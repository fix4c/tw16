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

/**
 * 👇 新增：查詢當前 API Key 可用的模型，並挑選一個 Flash 模型。
 * 優先序：gemini-2.5-flash → gemini-2.0-flash → 任何名稱含 flash 的模型
 */
async function pickAvailableFlashModel(apiKey) {
  try {
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    if (!listRes.ok) return null;

    const listData = await listRes.json();
    const models = listData.models || [];

    const names = models
      .filter((m) => m.name && m.name.includes("flash"))
      .map((m) => m.name.replace("models/", ""));

    if (names.includes("gemini-2.5-flash")) return "gemini-2.5-flash";
    if (names.includes("gemini-2.0-flash")) return "gemini-2.0-flash";
    return names[0] || null;
  } catch {
    return null;
  }
}

async function fetchGeminiWithRetry(url, options, maxRetries = 3) {
  let lastResponse = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      lastResponse = response;
      if ((response.status === 503 || response.status === 429) && attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }
      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return lastResponse;
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

    // 👇 動態選擇可用模型，避免模型退役造成的 404
    const MODEL = await pickAvailableFlashModel(GEMINI_API_KEY);
    if (!MODEL) {
      return new Response(
        JSON.stringify({
          error: "您的 API Key 目前沒有可用的 Flash 模型，請確認 Google AI Studio 中的模型權限。",
        }),
        { status: 503 }
      );
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

    const res = await fetchGeminiWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 800,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${MODEL}): ${res.status} ${errText.slice(0, 200)}`);
    }

    const data = await res.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    const cleanedContent = rawContent.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedContent);
    } catch {
      parsed = {
        is_emergency: false,
        departments: ["家醫科"],
        advice: "AI 回覆格式異常，建議先至家醫科由醫師初步評估。",
        warning: "",
      };
    }

    const safeDepartments = getSafeDepartments(parsed.departments);

    const result = {
      is_emergency: Boolean(parsed.is_emergency),
      departments: safeDepartments,
      advice: typeof parsed.advice === "string" ? parsed.advice : "",
      warning: typeof parsed.warning === "string" ? parsed.warning : "",
    };

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "AI 分析失敗" }), { status: 500 });
  }
}