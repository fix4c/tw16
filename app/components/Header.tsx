"use client";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/hospitals", label: "醫院掛號" },
    { href: "/clinics", label: "院所查詢" },
    { href: "/tools/symptoms", label: "症狀查科別" },
    { href: "/tools/bmi", label: "BMI計算" },
    { href: "/guides", label: "就醫指南" },
  ];

  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo 區塊：圖騰 + 文字 */}
        <Link href="/" className="group flex items-center gap-3 transition-transform hover:scale-[1.02]">
          <img 
            src="/icon.png" 
            alt="台灣醫療網" 
            className="h-10 w-10 md:h-12 md:w-12 object-contain drop-shadow-sm" 
          />
          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-xl font-bold text-slate-900 tracking-wide group-hover:text-teal-700 transition-colors">
              台灣醫療網
            </span>
            <span className="text-[10px] text-slate-500 tracking-widest font-medium hidden md:block">
              WWW.TW16.NET
            </span>
          </div>
        </Link>

        {/* 桌面端導航 (md 以上顯示) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-600 hover:text-teal-700 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 右側操作區：翻譯功能 + 手機端漢堡按鈕 */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          
          <button
            className="md:hidden p-2 text-slate-600 hover:text-teal-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="開啟選單"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 手機端展開選單 */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg absolute w-full left-0 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-base font-medium text-slate-700 hover:text-teal-700 hover:bg-slate-50 rounded-lg px-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}