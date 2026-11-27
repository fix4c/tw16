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

/* ---------------- 可調參數（也可用 Cloudflare 環境變數覆寫） ---------------- */
// GEMINI_MODEL           主要模型，預設 gemini-3.7-flash
// GEMINI_FALLBACK_MODEL  對沖請求使用的模型，預設與主要模型相同
// GEMINI_REASONING       reasoning_effort：minimal / low / medium；設為 none 則不送此參數
const DEFAULT_MODEL = "gemini-3.7-flash";
const DEFAULT_REASONING = "low";
const MAX_SYMPTOM_LENGTH = 500;

// 第一個請求超過這個時間還沒收到第一個 token，就同時發第二個請求（對沖）
const HEDGE_AFTER_MS = 4000;
// 整體等待上限：超過就放棄並回 504，讓前端自動重試
const TOTAL_TIMEOUT_MS = 9000;

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

class UpstreamError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/** 對 Gemini 發出請求；若因 reasoning_effort 被拒（400）則去掉該參數重試一次 */
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
      `Gemini API error [${model}${eff ? "/" + eff : ""}]: ${res.status} ${text.slice(0, 300)}`
    );
    lastErr = new UpstreamError(`HTTP ${res.status}`, res.status);
    if (res.status !== 400) break; // 只有 400 才值得去掉參數重試
  }
  throw lastErr;
}

/** 發起一次嘗試，並等到「第一個資料塊」到達才算成功（避免只拿到標頭就卡住） */
function startAttempt(ctx, model, controllers) {
  const ac = new AbortController();
  controllers.push(ac);

  return (async () => {
    const res = await openUpstream({ ...ctx, model, signal: ac.signal });
    const reader = res.body.getReader();
    const first = await reader.read();
    if (first.done || !first.value) throw new UpstreamError("empty response", 502);
    return { reader, first: first.value, ac };
  })();
}

/**
 * 把 Gemini (OpenAI 相容) 的 SSE 串流轉成前端使用的簡化格式：
 *   data: {"content":"..."}   /   data: {"error":"..."}   /   data: [DONE]
 */
function createSseTransformer() {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

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
      if (content) send(controller, { content });
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
    },
  });
}

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

    const model = env.GEMINI_MODEL || DEFAULT_MODEL;
    const fallbackModel = env.GEMINI_FALLBACK_MODEL || model;
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
        { role: "user", content: `症狀：${symptoms.slice(0, MAX_SYMPTOM_LENGTH)}` },
      ],
    };

    /* ---------- Hedged request：慢就補發第二個，誰先回就用誰 ---------- */
    const controllers = [];
    let hedgeTimer;

    const p1 = startAttempt(ctx, model, controllers);
    const p2 = new Promise((resolve, reject) => {
      let started = false;
      const startHedge = () => {
        if (started) return;
        started = true;
        clearTimeout(hedgeTimer);
        startAttempt(ctx, fallbackModel, controllers).then(resolve, reject);
      };
      hedgeTimer = setTimeout(startHedge, HEDGE_AFTER_MS);
      // 第一個請求若很快失敗，立刻補發，不必等到 4 秒
      p1.then(() => clearTimeout(hedgeTimer), startHedge);
    });

    const totalTimer = setTimeout(
      () => controllers.forEach((c) => c.abort()),
      TOTAL_TIMEOUT_MS
    );

    let winner;
    try {
      winner = await Promise.any([p1, p2]);
    } catch (agg) {
      const errors = agg?.errors || [agg];
      const statuses = errors.map((e) => e?.status).filter(Boolean);
      console.error("All Gemini attempts failed:", statuses.join(",") || "timeout/abort");
      if (statuses.includes(429)) {
        return jsonResponse({ error: "AI 使用量較高，請稍候幾秒再試" }, 429);
      }
      if (statuses.length === 0) {
        return jsonResponse({ error: "AI 回應逾時" }, 504);
      }
      return jsonResponse({ error: "AI 服務暫時無法使用，請稍後再試" }, 502);
    } finally {
      clearTimeout(totalTimer);
      clearTimeout(hedgeTimer);
    }

    // 中止落後的那個請求，避免浪費額度
    for (const c of controllers) {
      if (c !== winner.ac) c.abort();
    }

    // 把「已讀出的第一塊」加回串流前面，再接續讀取
    const { reader, first, ac } = winner;
    const upstreamBody = new ReadableStream({
      start(controller) {
        controller.enqueue(first);
      },
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) controller.close();
        else controller.enqueue(value);
      },
      cancel() {
        ac.abort();
      },
    });

    return new Response(upstreamBody.pipeThrough(createSseTransformer()), {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (e) {
    console.error("ai-triage error:", e);
    return jsonResponse({ error: "AI 分析暫時失敗，請重新整理頁面後再試" }, 500);
  }
}