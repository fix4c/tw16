export async function onRequest(context) {
  const { request, env, params } = context;
  const id = params.id;
  const method = request.method;
  const db = env.TW16_REVIEWS;

  if (method === "GET") {
    // ... GET 请求逻辑保持不变 ...
    try {
      const stmt = db.prepare("SELECT * FROM reviews WHERE id = ?").bind(id);
      const result = await stmt.first();
      if (!result) return new Response(JSON.stringify({ good: 0, bad: 0 }), { headers: { "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ good: result.good_count, bad: result.bad_count }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  if (method === "POST") {
    try {
      const body = await request.json();
      const { type, token, fingerprint } = body; // 增加 token 和 fingerprint

      // 1. 驗證 Turnstile 令牌
      const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      });
      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        return new Response(JSON.stringify({ error: "人機驗證失敗，請重試" }), { status: 403 });
      }

      // 2. 檢查 D1 中是否已有相同指紋的投票（防重複）
      const checkStmt = db.prepare("SELECT * FROM user_votes WHERE clinic_name = ? AND user_email = ?").bind(id, fingerprint);
      const existing = await checkStmt.first();
      if (existing) {
        return new Response(JSON.stringify({ error: "您已經投票過了" }), { status: 409 });
      }

      // 3. 寫入投票紀錄
      await db.prepare("INSERT INTO user_votes (clinic_name, user_email, vote_type) VALUES (?, ?, ?)").bind(id, fingerprint, type).run();

      // 4. 更新計數
      await db.prepare("INSERT OR IGNORE INTO reviews (id, good_count, bad_count) VALUES (?, 0, 0)").bind(id).run();
      const updateStmt = type === "good" 
        ? db.prepare("UPDATE reviews SET good_count = good_count + 1 WHERE id = ?").bind(id)
        : db.prepare("UPDATE reviews SET bad_count = bad_count + 1 WHERE id = ?").bind(id);
      await updateStmt.run();

      const updated = await db.prepare("SELECT * FROM reviews WHERE id = ?").bind(id).first();
      return new Response(JSON.stringify({ good: updated.good_count, bad: updated.bad_count }), { headers: { "Content-Type": "application/json" } });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}