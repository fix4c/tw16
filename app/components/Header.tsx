"use client";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "../../config/site";
import { SearchModal } from "./SearchModal";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        {/* 👇 修改為 flex-col，在手機上分成上下兩層 */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-2 md:py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
          
          {/* 第一層：Logo + 右側按鈕 */}
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2 md:gap-3 transition-transform hover:scale-[1.02] min-w-0">
              <img 
                src="/icon.png" 
                alt="台灣醫療網" 
                className="h-8 w-8 md:h-12 md:w-12 object-contain drop-shadow-sm shrink-0" 
              />
              <span className="font-serif text-lg md:text-xl font-bold text-slate-900 tracking-wide group-hover:text-teal-700 transition-colors whitespace-nowrap">
                台灣醫療網
              </span>
            </Link>

            {/* 手機版右側按鈕區 (只保留 搜尋 + 漢堡) */}
            <div className="flex items-center gap-1 md:hidden shrink-0">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-500 bg-slate-100 rounded-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button className="p-2 text-slate-600 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>

            {/* 桌面版導航與操作區 */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-6 text-sm font-medium">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="text-slate-600 hover:text-teal-700 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-500 bg-slate-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          {/* 👇 第二層：手機版專屬翻譯列 */}
          <div className="w-full md:hidden pt-1 pb-1 flex justify-end">
            <LanguageSwitcher />
          </div>

        </div>

        {/* 手機端漢堡選單 */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-lg absolute w-full left-0 max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col px-4 py-2 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="block py-3 text-base font-medium text-slate-700 hover:text-teal-700 hover:bg-slate-50 rounded-lg px-3" 
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}