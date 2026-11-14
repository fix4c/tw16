import Parser from "rss-parser";
import OpenAI from "openai";
import fs from "fs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY 未设置");
  process.exit(1);
}

const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: GEMINI_API_KEY,
});

async function callWithRetry(fn, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRetryable =
        error.status === 503 || error.status === 429 ||
        (error.status >= 500 && error.status < 600);
      if (!isRetryable || attempt === maxRetries) throw error;
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      console.log(`  API 返回 ${error.status}，第 ${attempt} 次重试，等待 ${Math.round(delay / 1000)} 秒...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

const SOURCES = [
  { name: "衛生福利部", tier: 1, url: "https://www.mohw.gov.tw/rss-16-1-1.html" },
  { name: "疾病管制署", tier: 1, url: "https://www.cdc.gov.tw/RSS/RssXml/Hh094B49-DRwe2RR4eFfrQ?type=1" },
  { name: "食品藥物管理署", tier: 1, url: "https://www.fda.gov.tw/TC/rssNews.ashx" },
];

async function fetchAll() {
  const parser = new Parser({ timeout: 30000 });
  const results = [];
  for (const src of SOURCES) {
    try {
      const feed = await parser.parseURL(src.url);
      const items = (feed.items || []).slice(0, 6).map((item) => ({
        title: item.title || "",
        link: item.link || "",
        contentSnippet: (item.contentSnippet || item.content || "").slice(0, 400),
        sourceName: src.name,
        sourceTier: src.tier,
      }));
      results.push(...items);
      console.log(`  ${src.name}：抓到 ${items.length} 条`);
    } catch (err) {
      console.warn(`  ${src.name} 抓取失败：${err.message}`);
    }
  }
  return results;
}

async function main() {
  console.log("开始抓取三个官方来源...");
  const items = await fetchAll();
  if (items.length === 0) {
    console.error("所有来源均无数据");
    process.exit(1);
  }
  console.log(`共 ${items.length} 条候选，交给 AI 筛选...`);

  const prompt = `
你是台灣醫療資訊編輯。以下是來自衛生福利部、疾病管制署、食品藥物管理署、國民健康署的最新公告 RSS 條目。

請從中選出「3 則」對一般民眾最相關、且主題不重複的公告，改寫成繁體中文的結構化摘要。

原始條目：
${JSON.stringify(items, null, 2)}

輸出要求：
- 嚴格輸出 JSON 陣列，長度必須為 3（若候選不足 3 則，有幾則輸出幾則）
- 不要加任何說明文字或 markdown 標記
- 每個物件欄位：
  id: 用 link 中的 slug 或隨機字串
  title: 改寫成一般民眾看得懂的標題（30 字以內）
  summary: 2-3 句摘要，說明公告內容
  whyItMatters: 1-2 句「為什麼與你有關」，具體說明對生活的影響
  sourceName: 原始來源名稱（衛生福利部 / 疾病管制署 / 食品藥物管理署 / 國民健康署）
  sourceUrl: 原始 link
  sourceTier: 1
  publishedAt: 原始發布時間或抓取時間
  fetchedAt: ${new Date().toISOString()}
`;

  const res = await callWithRetry(() =>
    openai.chat.completions.create({
      model: "gemini-3.6-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    })
  );

  const raw = res.choices[0].message.content.trim();
  let headlines;
  try {
    headlines = JSON.parse(raw);
  } catch {
    headlines = JSON.parse(raw.replace(/```json|```/g, "").trim());
  }

  const seen = new Set();
  const unique = headlines.filter((h) => {
    if (seen.has(h.sourceUrl)) return false;
    seen.add(h.sourceUrl);
    return true;
  });

  const output = {
    lastUpdated: new Date().toISOString(),
    headlines: unique.slice(0, 3),
  };

  fs.writeFileSync("data/headlines.json", JSON.stringify(output, null, 2), "utf8");
  console.log(`已更新 data/headlines.json，共 ${output.headlines.length} 则`);
}

main().catch((err) => {
  console.error("抓取失败：", err);
  process.exit(1);
});