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

    // 嚴格限制 AI 的角色與輸出格式，並把科別鎖死在白名單內
    const prompt = `
你是一個專業的台灣醫療分診導航助手。
使用者會描述他們的症狀，你的任務是根據症狀判斷建議掛號的科別，並評估緊急程度。

【嚴格規則】
1. 絕對不可以進行疾病診斷（不要說「你可能得了盲腸炎」）。
2. 絕對不可以建議任何藥物或治療方式。
3. 只能提供「建議科別」、「是否緊急」與「就醫前注意事項」。
4. 必須嚴格輸出 JSON 格式，不要包含任何 markdown 標記。
5. departments 陣列中的每一個科別名稱，必須完全等於下列白名單中的字串，不可自行創造、簡寫或使用別名：
${STANDARD_DEPARTMENTS.map((d) => `   - "${d}"`).join("\n")}
6. 如果症狀可能涉及多個科別，請從白名單中挑選最相關的 1 至 3 個。
7. 若無法判斷，請使用 "家醫科"。

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
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gemini-3.6-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        // 強制模型輸出合法 JSON，避免 markdown 或額外文字
        response_format: { type: "json_object" },
      }),
    });

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