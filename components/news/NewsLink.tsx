// components/news/NewsLink.tsx
"use client";

import { useEffect, useState } from "react";
import ArticleReader from "./ArticleReader";

export default function NewsLink({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const shareHref = url;

  return (
    <>
      <a
        href={shareHref}
        className={className}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          setOpen(true);
        }}
      >
        {title}
      </a>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="relative mt-10 w-full max-w-4xl rounded-xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-gray-100 px-3 py-1 text-sm"
              aria-label="关闭"
            >
              关闭
            </button>
            <ArticleReader sourceUrl={url} />
          </div>
        </div>
      )}
    </>
  );
}