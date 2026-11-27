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

    const prompt = `
你是一個專業的台灣醫療分診導航助手。
請根據使用者的症狀，判斷建議掛號的科別，並評估緊急程度。

【嚴格規則】
1. 絕對不要進行疾病診斷，也不要建議藥物。
2. 只能提供「建議科別」、「是否緊急」與「就醫前注意事項」。
3. 必須嚴格輸出 JSON 格式，絕對不要包含任何 markdown 標記、前言或後語。
4. departments 陣列中的每一個科別名稱，必須完全等於下列白名單中的字串：
${STANDARD_DEPARTMENTS.map((d) => `   - "${d}"`).join("\n")}
5. 如果症狀可能涉及多個科別，請挑選最相關的 1 至 3 個。
6. 若無法判斷，請使用 "家醫科"。

【輸出 JSON 格式】
{
  "is_emergency": true 或 false,
  "departments": ["科別1", "科別2"],
  "advice": "用 2-3 句話說明為什麼建議看這個科別，以及就醫前的注意事項。",
  "warning": "若為緊急狀況，請填寫具體紅線警告；若非緊急，填空字串。"
}

症狀描述：「${symptoms}」
`;

    // 👇 改用串流 (stream: true) 請求
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gemini-3.8-flash",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          max_tokens: 500,
          response_format: { type: "json_object" },
          stream: true, // 開啟串流
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${errText.slice(0, 200)}`);
    }

    // 👇 建立一個 TransformStream 來處理串流和心跳
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // 發送心跳，防止連線逾時
    const keepAliveInterval = setInterval(() => {
      writer.write(encoder.encode(`: keep-alive\n\n`));
    }, 15000); // 每 15 秒發送一次

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
                  // 將收到的內容片段傳給前端
                  await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch (e) {
                // 忽略無法解析的行
              }
            }
          }
        }
      } catch (error) {
        // 串流過程中發生錯誤
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: "串流中斷" })}\n\n`));
      } finally {
        clearInterval(keepAliveInterval);
        await writer.write(encoder.encode(`data: [DONE]\n\n`));
        await writer.close();
      }
    })();

    // 回傳串流回應
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