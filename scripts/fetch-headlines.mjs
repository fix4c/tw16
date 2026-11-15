import Parser from "rss-parser";
import OpenAI from "openai";
import fs from "fs";
import { createConverter } from "js-opencc";

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

// 现有的三个 RSS 源 + 新华网
const RSS_SOURCES = [
  { name: "衛生福利部", tier: 1, url: "https://www.mohw.gov.tw/rss-16-1-1.html" },
  { name: "疾病管制署", tier: 1, url: "https://www.cdc.gov.tw/RSS/RssXml/Hh094B49-DRwe2RR4eFfrQ?type=1" },
  { name: "食品藥物管理署", tier: 1, url: "https://www.fda.gov.tw/TC/rssNews.ashx" },
  { name: "新華網", tier: 1, url: "http://www.xinhuanet.com/health/news_health.xml", isSimplified: true },
];

// 专门抓取 WHO 中文新闻网页的简易函数
async function fetchWhoNews() {
  try {
    const res = await fetch("https://www.who.int/zh/news", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "zh-TW,zh;q=0.9"
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // 提取 h3 里的标题和链接（WHO 页面结构大致如此）
    // 这是一个极其轻量的提取，不依赖复杂的 DOM 解析库
    const items = [];
    const regex = /<h3[^>]*class="[^"]*heading[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = regex.exec(html)) !== null && items.length < 6) {
      const link = match[1].startsWith("http") ? match[1] : `https://www.who.int${match[1]}`;
      const title = match[2].replace(/<[^>]+>/g, "").trim();
      if (title && link) {
        items.push({
          title,
          link,
          contentSnippet: "", // WHO 的摘要通常在详情页，这里留空，交给 AI 去推断
          sourceName: "世界衛生組織 (WHO)",
          sourceTier: 1,
        });
      }
    }
    return items;
  } catch (err) {
    console.warn(`  世界衛生組織 (WHO) 抓取失败：${err.message}`);
    return [];
  }
}

async function fetchAll() {
  const parser = new Parser({
    timeout: 30000,
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }
  });

  const converter = await createConverter({ from: "cn", to: "twp" });
  const results = [];

  // 1. 抓取常规 RSS
  for (const src of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(src.url);
      const items = (feed.items || []).slice(0, 6).map((item) => {
        let title = item.title || "";
        let snippet = (item.contentSnippet || item.content || "").slice(0, 400);

        if (src.isSimplified) {
          title = converter(title);
          snippet = converter(snippet);
        }

        return {
          title,
          link: item.link || "",
          contentSnippet: snippet,
          sourceName: src.name,
          sourceTier: src.tier,
        };
      });
      results.push(...items);
      console.log(`  ${src.name}：抓到 ${items.length} 条`);
    } catch (err) {
      console.warn(`  ${src.name} 抓取失败：${err.message}`);
    }
  }

  // 2. 抓取 WHO 网页
  console.log("  正在抓取世界衛生組織 (WHO)...");
  const whoItems = await fetchWhoNews();
  if (whoItems.length > 0) {
    results.push(...whoItems);
    console.log(`  世界衛生組織 (WHO)：抓到 ${whoItems.length} 条`);
  }

  return results;
}

function cleanText(s) {
  if (typeof s !== "string") return s;
  return s.replace(/\uFFFD+/g, "").replace(/\s+/g, " ").trim();
}

async function main() {
  console.log("开始抓取五个官方来源...");
  const items = await fetchAll();
  if (items.length === 0) {
    console.error("所有来源均无数据");
    process.exit(1);
  }
  console.log(`共 ${items.length} 条候选，交给 AI 筛选...`);

  const prompt = `
你是台灣醫療資訊編輯。以下是來自衛生福利部、疾病管制署、食品藥物管理署、新華網、世界衛生組織 (WHO) 的最新醫療資訊。

請從中選出「3 則」對一般民眾最相關、且主題不重複的公告，改寫成繁體中文的結構化摘要。
（備註：新華網與 WHO 屬於境外資訊，請確保改寫時使用台灣慣用語，並過濾掉過度政治宣傳的用語，保留純粹的醫療新知與公共衛生資訊。若 WHO 條目沒有摘要，請根據標題及你的醫療知識進行合理推測與說明。）

原始條目：
${JSON.stringify(items, null, 2)}

輸出要求：
- 嚴格輸出 JSON 陣列，長度必須為 3（若候選不足 3 則，有幾則輸出幾則）
- 不要加任何說明文字或 markdown 標記
- 所有文字必須是 UTF-8 可正常顯示的繁體中文與標準標點符號
- 禁止使用 emoji、特殊符號、罕見異體字；避免可能造成編碼問題的字元
- 每個物件欄位：
  id: 用 link 中的 slug 或隨機字串
  title: 改寫成一般民眾看得懂的標題（30 字以內）
  summary: 2-3 句摘要，說明公告內容
  whyItMatters: 1-2 句「為什麼與你有關」，具體說明對生活的影響
  sourceName: 原始來源名稱（衛生福利部 / 疾病管制署 / 食品藥物管理署 / 新華網 / 世界衛生組織）
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

  const cleanedHeadlines = unique.slice(0, 3).map((h) => ({
    ...h,
    title: cleanText(h.title),
    summary: cleanText(h.summary),
    whyItMatters: cleanText(h.whyItMatters),
  }));

  const output = {
    lastUpdated: new Date().toISOString(),
    headlines: cleanedHeadlines,
  };

  let jsonStr = JSON.stringify(output, null, 2);
  jsonStr = jsonStr.replace(/[\uFFFC-\uFFFF]/g, "");
  jsonStr = jsonStr.replace(/[\uE000-\uF8FF]/g, "");

  fs.writeFileSync("data/headlines.json", jsonStr, "utf8");
  console.log(`已更新 data/headlines.json，共 ${output.headlines.length} 则`);
}

main().catch((err) => {
  console.error("抓取失败：", err);
  process.exit(1);
});