/**
 * 健保署標準診療科別白名單與別名映射。
 */
const STANDARD_DEPARTMENTS = [
  "不分科", "家醫科", "內科", "外科", "兒科", "婦產科", "骨科", "泌尿科",
  "耳鼻喉科", "眼科", "皮膚科", "神經科", "精神科", "復健科", "牙科",
  "中醫一般科", "急診醫學科",
];

const STANDARD_DEPT_SET = new Set(STANDARD_DEPARTMENTS);

const DEPT_ALIAS_MAP = {
  感染科: "內科", 胸腔內科: "內科", 胸腔科: "內科", 心臟內科: "內科",
  心臟科: "內科", 胃腸肝膽科: "內科", 腸胃科: "內科", 消化內科: "內科",
  一般內科: "內科", 腎臟科: "內科", 新陳代謝科: "內科", 內分泌科: "內科",
  風濕免疫科: "內科", 血液腫瘤科: "內科", 神經內科: "神經科",
  神經外科: "外科", 一般外科: "外科", 大腸直腸外科: "外科",
  整形外科: "外科", 小兒科: "兒科", "小兒科(兒童)": "兒科",
  兒童科: "兒科", "婦產科(女性)": "婦產科", 身心科: "精神科",
  急診: "急診醫學科", 牙醫: "牙科", 牙醫科: "牙科",
  中醫: "中醫一般科", 中醫科: "中醫一般科",
};

/* ---------------- 可調參數（可用 Cloudflare 環境變數覆寫） ---------------- */
// GEMINI_MODELS     以逗號分隔的模型備援鏈，例如 "gemini-3.5-flash-lite,gemini-3.7-flash"
// GEMINI_MODEL      若有設定，會被放在備援鏈最前面（相容舊設定）
// GEMINI_REASONING  reasoning_effort：minimal / low / medium；設為 none 則不送此參數
const DEFAULT_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.1-flash-lite",
];
const DEFAULT_REASONING = "low";
const MAX_SYMPTOM_LENGTH = 500;

// 目前這個模型超過此時間還沒收到第一個 token，才啟動下一個模型（只處理「慢」）
const HEDGE_AFTER_MS = 4000;
// 整體等待上限
const TOTAL_TIMEOUT_MS = 9000;

// 相同症狀的快取（isolate 內的盡力快取，可大幅減少測試時的額度消耗）
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX = 200;
const RESPONSE_CACHE = new Map();

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

function jsonResponse(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

class UpstreamError extends Error {
  constructor(message, status, retryAfter, detail) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter; // 秒
    this.detail = detail;
  }
}

function parseRetryAfter(res, text) {
  const header = Number(res.headers.get("retry-after"));
  if (Number.isFinite(header) && header > 0) return Math.ceil(header);
  const m = /"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/.exec(text || "");
  return m ? Math.ceil(Number(m[1])) : undefined;
}

function cacheKey(symptoms) {
  return symptoms.replace(/\s+/g, " ").trim().toLowerCase();
}

function cacheGet(key) {
  const hit = RESPONSE_CACHE.get(key);
  if (!hit) return null;
  if (Date.now() - hit.t > CACHE_TTL_MS) {
    RESPONSE_CACHE.delete(key);
    return null;
  }
  return hit.text;
}

function cacheSet(key, text) {
  if (RESPONSE_CACHE.size >= CACHE_MAX) {
    RESPONSE_CACHE.delete(RESPONSE_CACHE.keys().next().value);
  }
  RESPONSE_CACHE.set(key, { t: Date.now(), text });
}

/** 對 Gemini 發出請求。只有「400 且訊息提到 reasoning/thinking」才去掉該參數重試 */
async function openUpstream({ apiKey, model, effort, messages, signal }) {
  const efforts = effort ? [effort, null] : [null];
  let lastErr = new UpstreamError("unknown", 502);

  for (const eff of efforts) {
    const payload = {
      model,
      messages,
      temperature: 0.1,
      // 思考 token 可能佔用額度，額度太小容易讓 JSON 被截斷
      max_tokens: 1024,
      response_format: { type: "json_object" },
      stream: true,
    };
    // ✅ OpenAI 相容端點用 reasoning_effort（不可與 thinking_level 並用）
    if (eff) payload.reasoning_effort = eff;

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (res.ok && res.body) return res;

    const text = await res.text().catch(() => "");
    console.error(
      `Gemini API error [${model}${eff ? "/" + eff : ""}]: ${res.status} ${text.slice(0, 500)}`
    );
    lastErr = new UpstreamError(
      `HTTP ${res.status}`,
      res.status,
      parseRetryAfter(res, text),
      text.slice(0, 200)
    );
    if (!(res.status === 400 && /reasoning|thinking/i.test(text))) break;
  }
  throw lastErr;
}

/** 發起一次嘗試，並等到「第一個資料塊」到達才算成功 */
function startAttempt(ctx, model, master) {
  const ac = new AbortController();
  const onMaster = () => ac.abort();
  master.signal.addEventListener("abort", onMaster);

  return (async () => {
    try {
      const res = await openUpstream({ ...ctx, model, signal: ac.signal });
      const reader = res.body.getReader();
      const first = await reader.read();
      if (first.done || !first.value) throw new UpstreamError("empty response", 502);
      return { reader, first: first.value, ac, model };
    } catch (e) {
      throw e;
    } finally {
      master.signal.removeEventListener("abort", onMaster);
    }
  })();
}

/**
 * 依序嘗試模型鏈：
 *  - 目前模型「失敗」（429/5xx/404…）→ 立刻換下一個模型
 *  - 目前模型「太慢」（HEDGE_AFTER_MS 沒首包）→ 並行啟動下一個，先回的勝出
 * 正常情況每次只會送出 1 個請求。
 */
function raceModels(ctx, models, master) {
  return new Promise((resolve, reject) => {
    let next = 0;
    let pending = 0;
    let settled = false;
    let timer;
    const errors = [];
    const attempts = [];

    const finishReject = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(errors);
    };

    const launch = () => {
      if (settled || master.signal.aborted || next >= models.length) return false;
      const model = models[next++];
      pending++;
      const ac = { abort: () => {} };
      attempts.push(ac);

      startAttempt(ctx, model, master).then(
        (w) => {
          pending--;
          if (settled) {
            // 落後者：丟掉
            w.reader.cancel().catch(() => {});
            w.ac.abort();
            return;
          }
          settled = true;
          clearTimeout(timer);
          resolve(w);
        },
        (err) => {
          pending--;
          errors.push(err);
          if (settled) return;
          if (!launch() && pending === 0) finishReject();
        }
      );

      clearTimeout(timer);
      if (next < models.length) timer = setTimeout(launch, HEDGE_AFTER_MS);
      return true;
    };

    master.signal.addEventListener("abort", () => {
      if (pending === 0) finishReject();
    });

    launch();
  });
}

/**
 * 把 Gemini (OpenAI 相容) 的 SSE 串流轉成前端使用的簡化格式：
 *   data: {"content":"..."}   /   data: {"error":"..."}   /   data: [DONE]
 * 串流結束時呼叫 onComplete(完整文字)，用於寫入快取。
 */
function createSseTransformer(onComplete) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let collected = "";

  const send = (controller, obj) =>
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

  const handleLine = (controller, line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return;
    const data = trimmed.slice(5).trim();
    if (!data || data === "[DONE]") return;
    try {
      const json = JSON.parse(data);
      if (json.error) {
        console.error("Gemini stream error:", JSON.stringify(json.error).slice(0, 300));
        send(controller, { error: "AI 服務暫時無法使用" });
        return;
      }
      const content = json.choices?.[0]?.delta?.content;
      if (content) {
        collected += content;
        send(controller, { content });
      }
    } catch (_) {
      // 忽略無法解析的片段
    }
  };

  return new TransformStream({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) handleLine(controller, line);
    },
    flush(controller) {
      if (buffer) handleLine(controller, buffer);
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      try {
        onComplete?.(collected);
      } catch (_) {}
    },
  });
}

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    let body;
    try {
      body = await request.json();
    } catch (_) {
      return jsonResponse({ error: "請求格式錯誤" }, 400);
    }

    const symptoms = typeof body?.symptoms === "string" ? body.symptoms.trim() : "";
    if (!symptoms) {
      return jsonResponse({ error: "請提供症狀描述" }, 400);
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return jsonResponse({ error: "未設定 AI API Key" }, 500);
    }

    const trimmedSymptoms = symptoms.slice(0, MAX_SYMPTOM_LENGTH);

    /* ---------- 快取命中：直接重播，不耗任何額度 ---------- */
    const key = cacheKey(trimmedSymptoms);
    const cached = cacheGet(key);
    if (cached) {
      const enc = new TextEncoder();
      const replay =
        `data: ${JSON.stringify({ content: cached })}\n\n` + `data: [DONE]\n\n`;
      return new Response(enc.encode(replay), {
        headers: { ...SSE_HEADERS, "X-Cache": "HIT" },
      });
    }

    /* ---------- 模型備援鏈 ---------- */
    const configured = (env.GEMINI_MODELS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const models = Array.from(
      new Set([
        ...(env.GEMINI_MODEL ? [env.GEMINI_MODEL.trim()] : []),
        ...(configured.length > 0 ? configured : DEFAULT_MODELS),
      ])
    );

    const rawEffort = env.GEMINI_REASONING || DEFAULT_REASONING;
    const effort = rawEffort === "none" ? null : rawEffort;

    const systemPrompt =
      `你是台灣醫療分診助手。根據使用者症狀只輸出 JSON，嚴禁診斷或建議藥物。\n` +
      `科別只能從白名單選擇：${STANDARD_DEPARTMENTS.join("、")}\n` +
      `JSON 欄位順序固定：{"is_emergency":布林,"departments":["科別"],"advice":"2句內、60字內的就醫建議","warning":"需立即就醫的紅線，沒有則空字串"}`;

    const ctx = {
      apiKey,
      effort,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `症狀：${trimmedSymptoms}` },
      ],
    };

    const master = new AbortController();
    const totalTimer = setTimeout(() => master.abort(), TOTAL_TIMEOUT_MS);

    let winner;
    try {
      winner = await raceModels(ctx, models, master);
    } catch (errs) {
      const errors = Array.isArray(errs) ? errs : [errs];
      const statuses = errors.map((e) => e?.status).filter(Boolean);
      const retryAfter = Math.max(0, ...errors.map((e) => e?.retryAfter || 0)) || undefined;
      const detail = errors.find((e) => e?.detail)?.detail;
      console.error(
        "All Gemini attempts failed:",
        statuses.join(",") || "timeout/abort",
        "models:",
        models.join(",")
      );

      if (statuses.includes(429)) {
        const wait = retryAfter ? `請約 ${retryAfter} 秒後再試` : "請稍候約 1 分鐘再試";
        return jsonResponse(
          { error: `AI 使用量較高，${wait}`, retry_after: retryAfter, detail },
          429,
          retryAfter ? { "Retry-After": String(retryAfter) } : {}
        );
      }
      if (statuses.length === 0) {
        return jsonResponse({ error: "AI 回應逾時，請再試一次" }, 504);
      }
      return jsonResponse({ error: "AI 服務暫時無法使用，請稍後再試", detail }, 502);
    } finally {
      clearTimeout(totalTimer);
    }

    // 勝出者之後不再受 master 中止影響（master 只用於首包階段）
    const { reader, first, ac } = winner;

    const upstreamBody = new ReadableStream({
      start(controller) {
        controller.enqueue(first);
      },
      async pull(controller) {
        try {
          const { done, value } = await reader.read();
          if (done) controller.close();
          else controller.enqueue(value);
        } catch (e) {
          controller.error(e);
        }
      },
      cancel() {
        ac.abort();
      },
    });

    const transformer = createSseTransformer((text) => {
      // 只快取「確定是完整有效 JSON」的結果
      try {
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        if (Array.isArray(parsed?.departments) && parsed.departments.length > 0) {
          cacheSet(key, text);
        }
      } catch (_) {}
    });

    return new Response(upstreamBody.pipeThrough(transformer), {
      headers: { ...SSE_HEADERS, "X-Model": winner.model },
    });
  } catch (e) {
    console.error("ai-triage error:", e);
    return jsonResponse({ error: "AI 分析暫時失敗，請重新整理頁面後再試" }, 500);
  }
}