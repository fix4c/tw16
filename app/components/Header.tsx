"use client";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "../../config/site";
import { SearchModal } from "./SearchModal"; // 👈 引入搜尋彈窗

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 👈 搜尋狀態

  return (
    <>
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo 區塊 */}
          <Link href="/" className="group flex items-center gap-3 transition-transform hover:scale-[1.02]">
            <img src="/icon.png" alt="台灣醫療網" className="h-10 w-10 md:h-12 md:w-12 object-contain drop-shadow-sm" />
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-bold text-slate-900 tracking-wide group-hover:text-teal-700 transition-colors">台灣醫療網</span>
              <span className="text-[10px] text-slate-500 tracking-widest font-medium hidden md:block">WWW.TW16.NET</span>
            </div>
          </Link>

          {/* 桌面端導航 */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-600 hover:text-teal-700 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 右側操作區 */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* 👇 搜尋按鈕 */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-500 hover:text-teal-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex items-center gap-2"
              aria-label="搜尋"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span className="hidden lg:inline text-sm font-medium pr-1">搜尋</span>
            </button>

            <LanguageSwitcher />
            
            <button className="md:hidden p-2 text-slate-600 hover:text-teal-700 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* 手機端選單 */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-lg absolute w-full left-0">
            <nav className="flex flex-col px-6 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="block py-3 text-base font-medium text-slate-700 hover:text-teal-700 hover:bg-slate-50 rounded-lg px-2" onClick={() => setIsOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* 👇 掛載搜尋彈窗 */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}