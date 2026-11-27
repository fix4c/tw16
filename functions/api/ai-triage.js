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

// 若 Cloudflare 環境變數設定了 GEMINI_MODEL 則優先使用，方便日後換模型
const DEFAULT_MODEL = "gemini-3.7-flash";
const MAX_SYMPTOM_LENGTH = 500;

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
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

    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return jsonResponse({ error: "未設定 AI API Key" }, 500);
    }

    const model = env.GEMINI_MODEL || DEFAULT_MODEL;

    const systemPrompt =
      `你是台灣醫療分診助手。根據使用者症狀只輸出 JSON，嚴禁診斷或建議藥物。\n` +
      `科別只能從白名單選擇：${STANDARD_DEPARTMENTS.join("、")}\n` +
      `JSON 欄位順序固定：{"is_emergency":布林,"departments":["科別"],"advice":"2句內、60字內的就醫建議","warning":"需立即就醫的紅線，沒有則空字串"}`;

    const upstream = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `症狀：${symptoms.slice(0, MAX_SYMPTOM_LENGTH)}` },
          ],
          temperature: 0.1,
          // 思考 token 可能佔用額度，300 容易讓 JSON 被截斷
          max_tokens: 1024,
          response_format: { type: "json_object" },
          stream: true,
          // ✅ 正確參數：OpenAI 相容端點使用 reasoning_effort
          // （頂層 thinking_level 會造成 400，且不可與 reasoning_effort 並用）
          reasoning_effort: "low",
        }),
      }
    );

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => "");
      console.error(`Gemini API error: ${upstream.status} ${errText.slice(0, 500)}`);
      return jsonResponse({ error: "AI 服務暫時無法使用，請稍後再試" }, 502);
    }

    return new Response(upstream.body.pipeThrough(createSseTransformer()), {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (e) {
    console.error("ai-triage error:", e);
    return jsonResponse({ error: "AI 分析失敗" }, 500);
  }
}