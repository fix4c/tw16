// functions/api/img.js
export async function onRequestGet(context) {
  const targetUrl = new URL(context.request.url).searchParams.get("url");
  if (!targetUrl) return new Response("Missing url", { status: 400 });

  try {
    const parsed = new URL(targetUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return new Response("Invalid protocol", { status: 400 });
    }
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  // 抓取原图时不带 Referer，欺骗来源站
  const res = await fetch(targetUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; tw16-image-proxy/1.0)",
      Referer: "",
    },
  });

  if (!res.ok) return new Response("Failed to fetch image", { status: res.status });

  const headers = new Headers(res.headers);
  headers.set("Cache-Control", "public, max-age=86400"); // 缓存一天
  headers.delete("content-security-policy");
  headers.delete("x-frame-options");

  return new Response(res.body, {
    status: res.status,
    headers,
  });
}