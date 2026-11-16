"use client";

import { useEffect, useState } from "react";

// 👇 補上這段 Window 的型別定義，解決 TypeScript 報錯
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

export function LanguageSwitcher() {
  const [selectedLang, setSelectedLang] = useState("zh-TW");

  useEffect(() => {
    // 載入 Google 翻譯腳本
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "zh-TW",
          includedLanguages: "zh-TW,zh-CN,en,vi,id,th,ja,ko,fil,km,lo,hi,ru,my,ms",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // 初始化時檢查是否有翻譯 Cookie，同步下拉選單的狀態
    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
    if (match) {
      const parts = match[1].split("/");
      if (parts.length === 3) {
        setSelectedLang(parts[2]);
      }
    }

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    
    // 使用 Cookie 強制 Google 翻譯
    if (lang === "zh-TW") {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
    } else {
      document.cookie = `googtrans=/zh-TW/${lang}; path=/;`;
      document.cookie = `googtrans=/zh-TW/${lang}; path=/; domain=.${window.location.hostname}`;
    }
    
    // 刷新頁面以套用翻譯
    window.location.reload();
  };

  return (
    <div className="relative inline-block">
      {/* 隱藏 Google 預設的選單 */}
      <div 
        id="google_translate_element" 
        style={{ 
          position: "absolute", 
          top: "-9999px", 
          left: "-9999px", 
          opacity: 0, 
          pointerEvents: "none" 
        }}
      ></div>
      
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