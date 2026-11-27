// app/components/ArticleReader.tsx
"use client";

import { useEffect, useState } from "react";

type ArticleData = {
  title: string;
  byline?: string;
  siteName?: string;
  excerpt?: string;
  content?: string;
  textContent?: string;
  markdown?: string;
  sourceUrl: string;
  fallback?: boolean;
  error?: string;
};

export default function ArticleReader({
  sourceUrl,
}: {
  sourceUrl: string;
}) {
  const [data, setData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);

    fetch(`/api/fetch-article?url=${encodeURIComponent(sourceUrl)}`)
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          if (json.fallback) {
            setData({ ...json, content: undefined });
            setFailed(true);
          } else {
            setFailed(true);
          }
          return;
        }

        setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sourceUrl]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">正在提取文章…</div>
    );
  }

  if (failed && (!data || !data.content)) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-gray-600">无法在站内渲染完整内容。</p>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded bg-blue-600 px-4 py-2 text-white"
        >
          前往原文阅读
        </a>
      </div>
    );
  }

  return (
    <article className="prose prose-lg mx-auto max-w-3xl p-6">
      {data?.title && <h1 className="text-2xl font-bold">{data.title}</h1>}
      {data?.byline && (
        <p className="text-sm text-gray-500">{data.byline}</p>
      )}
      {data?.siteName && (
        <p className="text-xs text-gray-400">来源：{data.siteName}</p>
      )}
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: data?.content || "" }}
      />
      <hr className="my-6" />
      <p className="text-xs text-gray-400">
        资料经 tw16.net 阅读模式提取，原始内容版权归来源网站所有。
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 underline"
        >
          查看原文
        </a>
      </p>
    </article>
  );
}