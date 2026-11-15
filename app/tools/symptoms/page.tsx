"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "../../components/Header"; 
import { ToolNav } from "../../components/ToolNav";
import symptomData from "@/data/symptoms.json";

type Symptom = {
  id: string;
  name: string;
  category: string;
  departments: string[];
  note: string;
};

const symptoms = (symptomData as { symptoms: Symptom[] }).symptoms;

export default function SymptomsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const categories = useMemo(() => {
    const set = new Set<string>();
    symptoms.forEach((s) => set.add(s.category));
    return ["全部", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return symptoms.filter((s) => {
      const matchSearch = s.name.includes(searchTerm) || s.departments.some(d => d.includes(searchTerm));
      const matchCategory = selectedCategory === "全部" || s.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8 w-full">
        <p className="text-xs font-medium tracking-widest text-teal-700 mb-3">症狀導航</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-4">
          身體不舒服，該看哪一科？
        </h1>
        <p className="text-neutral-600 leading-relaxed max-w-2xl">
          輸入您的症狀或想查詢的科別。本站提供初步的就醫導航建議，無法取代專業醫師的診斷，若症狀緊急請直接撥打 119 或前往急診。
        </p>
        <ToolNav />
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-8 w-full space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-neutral-500 whitespace-nowrap">分類：</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                selectedCategory === c
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-teal-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="搜尋症狀（如：頭痛、肚子痛）或科別（如：心臟內科）..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 border border-neutral-300 rounded-full text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all shadow-sm"
        />
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <p className="text-xs text-neutral-400 mb-4">找到 {filtered.length} 個相關症狀</p>
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <article key={s.id} className="bg-white border border-neutral-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full border bg-neutral-100 text-neutral-600 border-neutral-200">
                  {s.category}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-3">{s.name}</h3>
              
              <div className="mb-4">
                <p className="text-sm text-neutral-500 mb-1">建議掛號科別：</p>
                <div className="flex flex-wrap gap-2">
                  {s.departments.map((d) => (
                    <span key={d} className="inline-block text-sm font-medium px-3 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded-md">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 border-l-2 border-red-400 p-3 mb-4 text-xs text-red-700 leading-relaxed">
                <span className="font-bold">⚠️ 注意：</span>{s.note}
              </div>

              <div className="flex gap-3 mt-auto">
                <Link href="/hospitals" className="flex-1 text-center py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
                  找醫院掛號
                </Link>
                <Link href="/clinics" className="flex-1 text-center py-2 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors">
                  找附近診所
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-neutral-100 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-neutral-500">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-medium">
            <span>🏆</span>
            <span>本站入圍衛福部 95 年度優良健康資訊網站</span>
          </div>
          <p className="mb-2 text-red-500 font-medium">免責聲明：本頁面資訊僅供就醫參考，不構成醫療診斷或建議。如有緊急狀況，請立即就醫或撥打 119。</p>
          <p>© {new Date().getFullYear()} tw16.net · 非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}