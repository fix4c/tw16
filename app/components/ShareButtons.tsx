"use client";

import { useState, useEffect } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // 如果還沒抓到網址，先不顯示，避免閃爍
  if (!currentUrl) return null;

  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    alert("✅ 已複製文章連結！");
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 border-t border-slate-200 mt-12 bg-slate-50/50 rounded-b-3xl">
      <p className="text-sm font-bold text-slate-500 mb-4">分享這篇實用指南給親友</p>
      <div className="flex flex-wrap gap-3 justify-center px-4">
        {/* LINE 分享 */}
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#06C755] text-white rounded-full font-medium hover:bg-[#05b34c] hover:-translate-y-0.5 transition-all shadow-sm"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 10.3c0-5.7-5.4-10.3-12-10.3S0 4.6 0 10.3c0 5.1 4.3 9.3 10.2 10.1.4.1.9.3 1.1.7.1.4.1 1 .1 1.4 0 .4-.2 1.8-.2 2.1 0 .4-.2 1.3.9.7 1.2-.6 6.3-3.7 8.6-6.4 1.6-1.8 2.3-3.7 2.3-5.7z"/></svg>
          LINE 分享
        </a>

        {/* Facebook 分享 */}
        <a
          href={fbShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white rounded-full font-medium hover:bg-[#166fe5] hover:-translate-y-0.5 transition-all shadow-sm"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </a>

        {/* 複製連結 */}
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-full font-medium hover:bg-slate-50 hover:-translate-y-0.5 transition-all shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          複製連結
        </button>
      </div>
    </div>
  );
}