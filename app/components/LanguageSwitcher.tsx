"use client";

import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const [selectedLang, setSelectedLang] = useState("zh-TW");

  // 從 cookie 讀取目前翻譯設定，同步下拉選單狀態
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
    if (match) {
      const parts = match[1].split("/");
      if (parts.length === 3 && parts[2]) {
        setSelectedLang(parts[2]);
      }
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setSelectedLang(lang);

    const hostname = window.location.hostname;

    // 先清除所有可能的舊 cookie
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname}`;

    // 非繁體中文才設定翻譯 cookie
    if (lang !== "zh-TW") {
      document.cookie = `googtrans=/zh-TW/${lang}; path=/;`;
      document.cookie = `googtrans=/zh-TW/${lang}; path=/; domain=${hostname}`;
      document.cookie = `googtrans=/zh-TW/${lang}; path=/; domain=.${hostname}`;
    }

    window.location.reload();
  };

  return (
    <div className="relative inline-block">
      <select
        value={selectedLang}
        onChange={handleLanguageChange}
        className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-1.5 pl-3 pr-8 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer transition-colors"
      >
        <option value="zh-TW">🌐 繁體中文</option>
        <option value="zh-CN">🇨🇳 简体中文</option>
        <option value="en">🇺🇸 English</option>
        <option value="vi">🇻🇳 Tiếng Việt</option>
        <option value="id">🇮🇩 Bahasa Indonesia</option>
        <option value="th">🇹🇭 ภาษาไทย</option>
        <option value="ja">🇯🇵 日本語</option>
        <option value="ko">🇰🇷 한국어</option>
        <option value="fil">🇵🇭 Filipino</option>
        <option value="my">🇲🇲 မြန်မာ</option>
        <option value="km">🇰🇭 ខ្មែរ</option>
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
}