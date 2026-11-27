/**
 * 健保署標準診療科別白名單與別名映射。
 * 與 app/tools/symptoms/page.tsx 使用的 lib/department-constants.ts 保持一致。
 * 內聯在此檔案中，避免 Cloudflare Pages Functions 打包時的路徑別名問題。
 */
const STANDARD_DEPARTMENTS = [
  "不分科",
  "家醫科",
  "內科",
  "外科",
  "兒科",
  "婦產科",
  "骨科",
  "泌尿科",
  "耳鼻喉科",
  "眼科",
  "皮膚科",
  "神經科",
  "精神科",
  "復健科",
  "牙科",
  "中醫一般科",
  "急診醫學科",
];

const STANDARD_DEPT_SET = new Set(STANDARD_DEPARTMENTS);

const DEPT_ALIAS_MAP = {
  感染科: "內科",
  胸腔內科: "內科",
  胸腔科: "內科",
  心臟內科: "內科",
  心臟科: "內科",
  胃腸肝膽科: "內科",
  腸胃科: "內科",
  消化內科: "內科",
  一般內科: "內科",
  腎臟科: "內科",
  新陳代謝科: "內科",
  內分泌科: "內科",
  風濕免疫科: "內科",
  血液腫瘤科: "內科",
  神經內科: "神經科",
  神經外科: "外科",
  一般外科: "外科",
  大腸直腸外科: "外科",
  整形外科: "外科",
  小兒科: "兒科",
  "小兒科(兒童)": "兒科",
  兒童科: "兒科",
  "婦產科(女性)": "婦產科",
  身心科: "精神科",
  急診: "急診醫學科",
  牙醫: "牙科",
  牙醫科: "牙科",
  中醫: "中醫一般科",
  中醫科: "中醫一般科",
};

/** 把任意科別名稱收斂為標準名稱；收斂不到回傳 null */
function resolveDepartment(raw) {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = raw.trim().replace(/\s/g, "");
  if (STANDARD_DEPT_SET.has(cleaned)) return cleaned;
  const mapped = DEPT_ALIAS_MAP[cleaned];
  if (mapped && STANDARD_DEPT_SET.has(mapped)) return mapped;
  return null;
}

/** 批次映射、去重、兜底為「家醫科」 */
function getSafeDepartments(rawDepts) {
  if (!Array.isArray(rawDepts)) return ["家醫科"];
  const mapped = rawDepts
    .map(resolveDepartment)
    .filter((d) => d !== null);
  const unique = Array.from(new Set(mapped));
  return unique.length > 0 ? unique : ["家醫科"];
}

/**
 * 帶指數退避重試的 Gemini API 呼叫。
 * 針對 503（服務暫時不可用）與 429（請求過多）自動重試，
 * 避免使用者第一次點擊就遇到錯誤。
 */
async function fetchGeminiWithRetry(url, options, maxRetries = 3) {
  let lastResponse = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      lastResponse = response;

      // 只對暫時性錯誤（503 / 429）重試
      if ((response.status === 503 || response.status === 429) && attempt < maxRetries - 1) {
        // 指數退避：1s → 2s → 4s（加上隨機抖動避免併發撞車）
        const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.warn(
          `Gemini API 返回 ${response.status}，${waitTime.toFixed(0)}ms 後重試 (${attempt + 1}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      // 其他錯誤或已達最大重試次數：直接回傳，交由上層處理
      return response;
    } catch (error) {
      // 網路層錯誤：若還有重試次數則等待後重試
      if (attempt === maxRetries - 1) throw error;
      console.warn(
        `網路請求失敗，重試中 (${attempt + 1}/${maxRetries}):`,
        error.message
      );
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

    // 嚴格限制 AI 的角色與輸出格式，並把科別鎖死在白名單內。
    const prompt = `
你是一個專業的台灣醫療分診導航助手。
請根據使用者的症狀，判斷建議掛號的科別，並評估緊急程度。

【嚴格規則】
1. 絕對不要進行疾病診斷，也不要建議藥物。
2. 只能提供「建議科別」、「是否緊急」與「就醫前注意事項」。
3. 必須嚴格輸出 JSON 格式，絕對不要包含任何 markdown 標記、前言或後語（例如「好的，這是您的分析結果」）。
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

    // 👇 回滾：使用 OpenAI 相容端點，確保絕不發生 404。
    // 並將原本錯誤的 gemini-3.6-flash 改為官方支援且極快的 gemini-1.5-flash。
    const res = await fetchGeminiWithRetry(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gemini-1.5-flash", 
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          max_tokens: 500, // 限制輸出長度，防止模型長篇大論拖慢速度
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${errText.slice(0, 200)}`);
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content?.trim() ?? "";

    // 清除可能出現的 markdown code fence
    const cleanedContent = rawContent.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedContent);
    } catch {
      // 模型偶爾仍可能輸出非法 JSON，直接回傳安全預設值，避免 500
      parsed = {
        is_emergency: false,
        departments: ["家醫科"],
        advice: "AI 回覆格式異常，建議先至家醫科由醫師初步評估。",
        warning: "",
      };
    }

    // 後端安全網：把模型輸出的科別收斂到白名單
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