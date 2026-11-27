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

function resolveDepartment(raw) {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = raw.trim().replace(/\s/g, "");
  if (STANDARD_DEPT_SET.has(cleaned)) return cleaned;
  const mapped = DEPT_ALIAS_MAP[cleaned];
  if (mapped && STANDARD_DEPT_SET.has(mapped)) return mapped;
  return null;
}

function getSafeDepartments(rawDepts) {
  if (!Array.isArray(rawDepts)) return ["家醫科"];
  const mapped = rawDepts.map(resolveDepartment).filter((d) => d !== null);
  const unique = Array.from(new Set(mapped));
  return unique.length > 0 ? unique : ["家醫科"];
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { symptoms } = await request.json();
    if (!symptoms) {
      return new Response(JSON.stringify({ error: "請提供症狀描述" }), { status: 400 });
    }

    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "未設定 AI API Key" }), { status: 500 });
    }

    // 👇 優化：極簡化 Prompt。因為我們已經設定 response_format: json_object，
    // 所以不需要再用長文解釋 JSON 格式，大幅減少 AI 預填充時間。
    const prompt = `你是台灣醫療分診助手。根據症狀輸出 JSON。嚴禁診斷或建議藥物。
科別必須從以下白名單選擇：${STANDARD_DEPARTMENTS.join("、")}
輸出格式：{"is_emergency":bool,"departments":["科別"],"advice":"2-3句建議","warning":"緊急紅線或空"}
症狀：${symptoms}`;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GEMINI_API_KEY}`,
        },
        // 👇 清理了原本重複的 body 定義
        body: JSON.stringify({
          model: "gemini-3.8-flash",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          max_tokens: 300,
          response_format: { type: "json_object" },
          stream: true,
          thinkingConfig: {
            thinkingLevel: "LOW",
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${errText.slice(0, 200)}`);
    }

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const keepAliveInterval = setInterval(() => {
      writer.write(encoder.encode(`: keep-alive\n\n`));
    }, 15000); 

    (async () => {
      const reader = res.body.getReader();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                const content = json.choices?.[0]?.delta?.content || "";
                if (content) {
                  await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch (e) {}
            }
          }
        }
      } catch (error) {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: "串流中斷" })}\n\n`));
      } finally {
        clearInterval(keepAliveInterval);
        await writer.write(encoder.encode(`data: [DONE]\n\n`));
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "AI 分析失敗" }), { status: 500 });
  }
}