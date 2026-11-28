// AI 額度與 D1 持久快取工具
// 並發安全：所有計數用 UPSERT 原子遞增，避免 race condition

export function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizeSymptomText(raw) {
  if (typeof raw !== "string") return "";
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function makeCacheKey(raw) {
  return sha256Hex(normalizeSymptomText(raw));
}

export async function hashIp(ip, salt = "tw16") {
  return sha256Hex(`${salt}:${ip}`);
}

/* ---------------- 快取讀寫 ---------------- */

export async function readCache(db, cacheKey) {
  const now = Math.floor(Date.now() / 1000);
  try {
    const row = await db
      .prepare(
        "SELECT result_json FROM ai_symptom_cache WHERE cache_key = ? AND expires_at > ?"
      )
      .bind(cacheKey, now)
      .first();
    if (!row) return null;
    return JSON.parse(row.result_json);
  } catch {
    return null;
  }
}

export async function writeCache(db, cacheKey, result, ttlSeconds = 604800) {
  const now = Math.floor(Date.now() / 1000);
  try {
    await db
      .prepare(
        `INSERT INTO ai_symptom_cache (cache_key, result_json, created_at, expires_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(cache_key) DO UPDATE SET
           result_json = excluded.result_json,
           created_at  = excluded.created_at,
           expires_at  = excluded.expires_at`
      )
      .bind(cacheKey, JSON.stringify(result), now, now + ttlSeconds)
      .run();
    return true;
  } catch {
    return false;
  }
}

/* ---------------- 原子計數 ---------------- */

async function bumpGlobal(db, day, limit) {
  try {
    const row = await db
      .prepare(
        `INSERT INTO ai_daily_global (day, used) VALUES (?, 1)
         ON CONFLICT(day) DO UPDATE SET used = used + 1
         RETURNING used`
      )
      .bind(day)
      .first();
    const used = row?.used ?? 1;
    if (used > limit) {
      await db
        .prepare("UPDATE ai_daily_global SET used = used - 1 WHERE day = ?")
        .bind(day)
        .run();
      return { ok: false, used: used - 1, limit };
    }
    return { ok: true, used, limit };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function revertGlobal(db, day) {
  try {
    await db
      .prepare(
        "UPDATE ai_daily_global SET used = MAX(used - 1, 0) WHERE day = ?"
      )
      .bind(day)
      .run();
  } catch {}
}

async function bumpIp(db, day, ipHash, limit) {
  try {
    const row = await db
      .prepare(
        `INSERT INTO ai_daily_ip (day, ip_hash, used) VALUES (?, ?, 1)
         ON CONFLICT(day, ip_hash) DO UPDATE SET used = used + 1
         RETURNING used`
      )
      .bind(day, ipHash)
      .first();
    const used = row?.used ?? 1;
    if (used > limit) {
      await db
        .prepare(
          "UPDATE ai_daily_ip SET used = used - 1 WHERE day = ? AND ip_hash = ?"
        )
        .bind(day, ipHash)
        .run();
      return { ok: false, used: used - 1, limit };
    }
    return { ok: true, used, limit };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function revertIp(db, day, ipHash) {
  try {
    await db
      .prepare(
        "UPDATE ai_daily_ip SET used = MAX(used - 1, 0) WHERE day = ? AND ip_hash = ?"
      )
      .bind(day, ipHash)
      .run();
  } catch {}
}

/**
 * 檢查額度並預占一次名額。
 * D1 故障時保守放行（避免 D1 掛掉導致全站 AI 完全癱瘓）。
 */
export async function checkAndReserve(db, ipHash, { ipLimit, globalLimit }) {
  const day = todayUTC();

  const ipRes = await bumpIp(db, day, ipHash, ipLimit);
  if (!ipRes.ok) {
    if (ipRes.error) {
      return { allowed: true, day, ipHash, reason: "db_error_pass" };
    }
    return {
      allowed: false,
      reason: "ip_quota",
      used: ipRes.used,
      limit: ipRes.limit,
    };
  }

  const globalRes = await bumpGlobal(db, day, globalLimit);
  if (!globalRes.ok) {
    if (globalRes.error) {
      return { allowed: true, day, ipHash, reason: "db_error_pass" };
    }
    await revertIp(db, day, ipHash);
    return {
      allowed: false,
      reason: "global_quota",
      used: globalRes.used,
      limit: globalRes.limit,
    };
  }

  return { allowed: true, day, ipHash, reason: "ok" };
}

/** Gemini 呼叫失敗時退還預占 */
export async function releaseReservation(db, day, ipHash) {
  await revertIp(db, day, ipHash);
  await revertGlobal(db, day);
}

export async function logDegrade(db, reason) {
  try {
    await db
      .prepare(
        "INSERT INTO ai_degrade_log (day, reason, created_at) VALUES (?, ?, ?)"
      )
      .bind(todayUTC(), reason, Math.floor(Date.now() / 1000))
      .run();
  } catch {}
}