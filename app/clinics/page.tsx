"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import rawData from "@/data/clinics.json";

type Clinic = {
  name: string;
  address: string;
  phone: string;
  specialty: string;
  county: string;
};

const clinics = (rawData as { clinics: Clinic[] }).clinics;

// 从地址中提取县市名称（简单映射）
function getCountyFromAddress(address: string): string {
  if (!address) return "其他";
  const match = address.match(/^(.{2,3}[市縣])/);
  return match ? match[1] : "其他";
}

const counties = ["全部", ...new Set(clinics.map((c) => getCountyFromAddress(c.address)))];

export default function ClinicsPage() {
  const [selectedCounty, setSelectedCounty] = useState("全部");
  const [selectedSpecialty, setSelectedSpecialty] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");

  // 提取所有科别
  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    clinics.forEach((c) => {
      if (c.specialty) {
        c.specialty.split(/[、,，]/).forEach((s) => {
          const trimmed = s.trim();
          if (trimmed) set.add(trimmed);
        });
      }
    });
    return ["全部", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    return clinics.filter((c) => {
      if (selectedCounty !== "全部" && getCountyFromAddress(c.address) !== selectedCounty) return false;
      if (selectedSpecialty !== "全部" && !c.specialty.includes(selectedSpecialty)) return false;
      if (searchTerm && !c.name.includes(searchTerm) && !c.address.includes(searchTerm)) return false;
      return true;
    }).slice(0, 50); // 限制显示 50 条，避免页面过长
  }, [selectedCounty, selectedSpecialty, searchTerm]);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold text-neutral-900 hover:text-teal-700 transition-colors">
            ← 台灣醫療入口
          </Link>
          <span className="text-xs text-neutral-500">診所查找</span>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-10 pb-6 w-full">
        <p className="text-xs font-medium tracking-widest text-teal-700 mb-3">健保特約診所</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-4">
          找到附近的診所
        </h1>
        <p className="text-neutral-600 leading-relaxed max-w-2xl">
          資料來自健保署開放資料平台，每日更新。共收錄 {clinics.length} 家特約診所。
        </p>
      </section>

      {/* 篩選器 */}
      <section className="max-w-5xl mx-auto px-6 pb-6 w-full space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-neutral-500 py-1.5">縣市：</span>
          {counties.slice(0, 15).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCounty(c)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                selectedCounty === c
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-teal-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-neutral-500 py-1.5">科別：</span>
          {allSpecialties.slice(0, 15).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSpecialty(s)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                selectedSpecialty === s
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-teal-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="搜尋診所名稱或地址..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-teal-500"
        />
      </section>

      {/* 診所列表 */}
      <section className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <p className="text-xs text-neutral-400 mb-4">
          顯示 {filtered.length} 家（最多 50 家，請善用篩選）
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((c, i) => (
            <article key={i} className="bg-white border border-neutral-200 rounded-xl p-4">
              <h3 className="font-serif font-semibold text-neutral-900">{c.name}</h3>
              <p className="text-sm text-neutral-600 mt-1">{c.address}</p>
              <p className="text-sm text-neutral-500">電話：{c.phone || "—"}</p>
              {c.specialty && (
                <p className="text-xs text-teal-700 mt-1">科別：{c.specialty}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-neutral-100 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-neutral-500">
          <p>資料來源：衛生福利部中央健康保險署開放資料平台 · 每日更新</p>
        </div>
      </footer>
    </main>
  );
}