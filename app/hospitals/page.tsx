"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import rawData from "@/data/hospitals.json";

type Hospital = {
  id: string;
  name: string;
  level: string;
  region: string;
  address: string;
  phone: string;
  registrationUrl: string;
};

const hospitals = (rawData as { hospitals: Hospital[] }).hospitals;

export default function HospitalsPage() {
  const [selectedRegion, setSelectedRegion] = useState("全部");
  const [selectedLevel, setSelectedLevel] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");

  const regions = useMemo(() => {
    const set = new Set<string>();
    hospitals.forEach((h) => set.add(h.region));
    return ["全部", ...Array.from(set).sort()];
  }, []);

  const levels = useMemo(() => {
    const set = new Set<string>();
    hospitals.forEach((h) => set.add(h.level));
    return ["全部", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return hospitals.filter((h) => {
      if (selectedRegion !== "全部" && h.region !== selectedRegion) return false;
      if (selectedLevel !== "全部" && h.level !== selectedLevel) return false;
      if (searchTerm && !h.name.includes(searchTerm) && !h.address.includes(searchTerm)) return false;
      return true;
    });
  }, [selectedRegion, selectedLevel, searchTerm]);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="台灣醫療網" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          
          <nav className="flex items-center gap-4 md:gap-5">
            <Link href="/hospitals" className="text-sm font-medium text-teal-700 transition-colors">醫院掛號</Link>
            <Link href="/clinics" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">診所查找</Link>
            <Link href="/tools/bmi" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">健康小工具</Link>
            <Link href="/guides" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">就醫指南</Link>
            <Link href="/about" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">關於本站</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-10 pb-6 w-full">
        <p className="text-xs font-medium tracking-widest text-teal-700 mb-3">醫院掛號導航</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-4">
          查詢線上掛號
        </h1>
        <p className="text-neutral-600 leading-relaxed max-w-2xl">
          全台 {hospitals.length} 家主要醫院（包含醫學中心、區域醫院與地區醫院）。本站不代掛號，僅提供官方掛號入口；部分醫院點擊後會以 Google 搜尋該院官方掛號頁。
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-6 w-full space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-neutral-500">地區：</span>
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                selectedRegion === r
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-teal-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-neutral-500">層級：</span>
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLevel(l)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                selectedLevel === l
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-teal-400"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="搜尋醫院名稱或地址..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-teal-500"
        />
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <p className="text-xs text-neutral-400 mb-4">顯示 {filtered.length} 家</p>
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((h) => (
            <article key={h.id} className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                  {h.level}
                </span>
                <span className="text-xs text-neutral-500">{h.region}</span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-neutral-900 mb-1">{h.name}</h3>
              <p className="text-sm text-neutral-600 mb-1">{h.address}</p>
              <p className="text-sm text-neutral-500 mb-4">電話：{h.phone || "—"}</p>
              <a
                href={h.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors"
              >
                前往掛號入口 →
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-neutral-100 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-neutral-500">
          <p className="mb-2">
            本站僅提供掛號入口連結，不代為掛號、不處理個人醫療資料。掛號規則與看診時間請以各醫院官網公告為準。
          </p>
          <p>© {new Date().getFullYear()} tw16.net · 非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}