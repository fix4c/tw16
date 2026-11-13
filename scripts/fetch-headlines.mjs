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

// 指数退避重试函数
async function callWithRetry(fn, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // 仅对 503 (服务过载) 和 429 (速率限制) 进行重试
      const isRetryable =
        error.status === 503 ||
        error.status === 429 ||
        (error.status >= 500 && error.status < 600);

      if (!isRetryable || attempt === maxRetries) {
        throw error; // 不可重试或已达最大重试次数，抛出错误
      }

      // 计算指数退避等待时间：2s, 4s, 8s, 16s, 32s，并加入随机抖动
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      console.log(
        `  API 返回 ${error.status}，第 ${attempt} 次重试，等待 ${Math.round(
          delay / 1000
        )} 秒...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

const RSS_URL = "https://www.mohw.gov.tw/rss-16-1-1.html";

async function main() {
  const parser = new Parser();
  const feed = await parser.parseURL(RSS_URL);

  const items = feed.items.slice(0, 5).map((item) => ({
    title: item.title,
    link: item.link,
    contentSnippet: item.contentSnippet || item.content || "",
  }));

  const prompt = `
你是台灣醫療資訊編輯。以下是衛生福利部的最新公告 RSS 條目。
請從中選出 3 則對一般民眾最相關的，並改寫成繁體中文的結構化摘要。

原始條目：
${JSON.stringify(items, null, 2)}

輸出要求：
- 嚴格輸出 JSON 陣列，不要加任何說明文字或 markdown 標記
- 每個物件包含以下欄位：
  id: 用 link 中的 slug 或隨機字串
  title: 改寫成一般民眾看得懂的標題（30 字以內）
  summary: 2-3 句摘要，說明公告內容
  whyItMatters: 1-2 句「為什麼與你有關」，具體說明對生活的影響
  sourceName: "衛生福利部"
  sourceUrl: 原始 link
  sourceTier: 1
  publishedAt: 原始發布時間或抓取時間
  fetchedAt: ${new Date().toISOString()}
`;

  // 使用 callWithRetry 包装 API 调用
  const res = await callWithRetry(() =>
    openai.chat.completions.create({
      model: "gemini-3.6-flash", // 可以先用 3.6 版本
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    })
  );

  const raw = res.choices[0].message.content.trim();
  let headlines;
  try {
    headlines = JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    headlines = JSON.parse(cleaned);
  }

  const output = {
    lastUpdated: new Date().toISOString(),
    headlines: headlines.slice(0, 3),
  };

  fs.writeFileSync(
    "data/headlines.json",
    JSON.stringify(output, null, 2),
    "utf8"
  );
  console.log("已更新 data/headlines.json，共 " + output.headlines.length + " 则");
}

main().catch((err) => {
  console.error("抓取失败：", err);
  process.exit(1);
});