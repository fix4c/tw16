// functions/api/fetch-article.js
import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

const ALLOWED_HOSTS = [
  "fda.gov.tw",
  "mohw.gov.tw",
  "cdc.gov.tw",
  "nhri.org.tw",
  "hpa.gov.tw",
  "nhi.gov.tw",
];

function isAllowedHost(url) {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== "https:" && protocol !== "http:") return false;
    return ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith("." + h));
  } catch {
    return false;
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
}

const BLOCKED_TAGS = [
  "script", "style", "iframe", "object", "embed",
  "form", "input", "button", "noscript", "svg",
];

function cleanAndAbsolutize(html, baseUrl) {
  const { document } = parseHTML(`<div id="__r">${html}</div>`);
  const root = document.getElementById("__r");
  if (!root) return "";

  for (const tag of BLOCKED_TAGS) {
    root.querySelectorAll(tag).forEach((el) => el.remove());
  }

  root.querySelectorAll("*").forEach((el) => {
    for (const attr of [...el.attributes]) {
      if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
    }
    for (const attr of ["href", "src", "poster", "srcset"]) {
      const v = el.getAttribute(attr);
      if (!v || v.startsWith("data:") || v.startsWith("#") || v.startsWith("mailto:")) continue;
      try {
        if (attr === "srcset") {
          el.setAttribute(
            "srcset",
            v
              .split(",")
              .map((part) => {
                const [u, ...rest] = part.trim().split(/\s+/);
                return [new URL(u, baseUrl).toString(), ...rest].join(" ");
              })
              .join(", ")
          );
        } else {
          el.setAttribute(attr, new URL(v, baseUrl).toString());
        }
      } catch {}
    }
    if (el.tagName && el.tagName.toLowerCase() === "img") {
      el.setAttribute("referrerpolicy", "no-referrer");
      el.setAttribute("loading", "lazy");
      el.setAttribute("decoding", "async");
    }
    if (el.tagName && el.tagName.toLowerCase() === "a") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });

  return root.innerHTML;
}

export async function onRequestGet(context) {
  const targetUrl = new URL(context.request.url).searchParams.get("url");
  if (!targetUrl) return json({ error: "缺少 url 参数" }, 400);
  if (!isAllowedHost(targetUrl)) return json({ error: "域名不在允许列表" }, 403);

  let upstream;
  try {
    upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent": "tw16-reader/1.0 (+https://tw16.net)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
  } catch (e) {
    return json({ error: "抓取失败", detail: String(e), fallback: true, sourceUrl: targetUrl }, 502);
  }

  if (!upstream.ok) {
    return json({ error: "来源错误", status: upstream.status, fallback: true, sourceUrl: targetUrl }, 502);
  }

  const ct = upstream.headers.get("content-type") || "";
  if (!ct.includes("text/html")) {
    return json({ error: "来源非 HTML", fallback: true, sourceUrl: targetUrl }, 415);
  }

  const html = await upstream.text();

  let article;
  try {
    const { document } = parseHTML(html);
    article = new Readability(document, { charThreshold: 200 }).parse();
  } catch (e) {
    return json({ error: "正文解析失败", detail: String(e), fallback: true, sourceUrl: targetUrl }, 422);
  }

  if (!article || !article.content) {
    return json({ error: "无法提取正文", fallback: true, sourceUrl: targetUrl }, 422);
  }

  const finalUrl = upstream.url || targetUrl;
  const content = cleanAndAbsolutize(article.content, finalUrl);

  return json({
    title: article.title || "",
    byline: article.byline || "",
    siteName: article.siteName || "",
    excerpt: article.excerpt || "",
    content,
    sourceUrl: targetUrl,
    resolvedUrl: finalUrl,
  });
}