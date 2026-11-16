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

    // 嚴格限制 AI 的角色與輸出格式
    const prompt = `
你是一個專業的台灣醫療分診導航助手。
使用者會描述他們的症狀，你的任務是根據症狀判斷建議掛號的科別，並評估緊急程度。

【嚴格規則】
1. 絕對不可以進行疾病診斷（不要說「你可能得了盲腸炎」）。
2. 絕對不可以建議任何藥物或治療方式。
3. 只能提供「建議科別」、「是否緊急」與「就醫前注意事項」。
4. 必須嚴格輸出 JSON 格式，不要包含任何 markdown 標記。

【輸出 JSON 格式】
{
  "is_emergency": true 或 false,
  "departments": ["科別1", "科別2"],
  "advice": "用 2-3 句話說明為什麼建議看這個科別，以及就醫前的注意事項。",
  "warning": "若為緊急狀況，請填寫具體的紅線警告（例如：若伴隨呼吸困難請立即撥打119）；若非緊急，填空字串。"
}

使用者的症狀描述：「${symptoms}」
`;

    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gemini-3.6-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1, // 溫度調低，確保回答穩定、不發散
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const rawContent = data.choices[0].message.content.trim();
    
    // 清除可能出現的 markdown code fence
    const cleanedContent = rawContent.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleanedContent);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "AI 分析失敗" }), { status: 500 });
  }
}