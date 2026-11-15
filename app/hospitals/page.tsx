"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "../components/Header"; 
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
      <Header />

      <section className="relative overflow-hidden w-full border-b border-slate-100/50">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/40 to-transparent pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-8">
          <p className="text-xs font-bold tracking-widest text-teal-700 mb-3 uppercase">醫院掛號導航</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            查詢線上掛號
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            全台 {hospitals.length} 家主要醫院（包含醫學中心、區域醫院與地區醫院）。本站不代掛號，僅提供官方掛號入口；部分醫院點擊後會以 Google 搜尋該院官方掛號頁。
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pt-8 pb-6 w-full space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-slate-500">地區：</span>
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${
                selectedRegion === r
                  ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20"
                  : "bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-slate-500">層級：</span>
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLevel(l)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${
                selectedLevel === l
                  ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20"
                  : "bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-700"
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
          className="w-full px-5 py-3 border border-slate-200 rounded-full text-base bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all shadow-sm"
        />
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <p className="text-xs text-slate-400 font-medium mb-4">顯示 {filtered.length} 家</p>
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((h) => (
            <article key={h.id} className="bg-white rounded-2xl p-5 flex flex-col shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-100 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                  {h.level}
                </span>
                <span className="text-xs font-medium text-slate-500">{h.region}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">{h.name}</h3>
              <p className="text-sm text-slate-600 mb-1">{h.address}</p>
              <p className="text-sm text-slate-500 mb-5">電話：{h.phone || "—"}</p>
              <a
                href={h.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center px-4 py-2.5 bg-teal-50 text-teal-700 text-sm font-bold rounded-xl hover:bg-teal-600 hover:text-white transition-colors duration-300"
              >
                前往掛號入口 →
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 text-xs text-slate-500 text-center leading-relaxed">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-medium">
            <span>🏆</span>
            <span>本站入圍衛福部 95 年度優良健康資訊網站</span>
          </div>
          <p>© {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}