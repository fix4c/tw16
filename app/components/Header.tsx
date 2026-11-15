"use client";

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
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <img src="/logo.png" alt="台灣醫療網" className="h-10 md:h-12 w-auto object-contain" />
        </Link>

        {/* 桌面端導航 (md 以上顯示) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-600 hover:text-teal-700 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 手機端漢堡按鈕 (md 以下顯示) */}
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