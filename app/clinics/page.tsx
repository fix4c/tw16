"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import rawData from "@/data/clinics.json";

type Clinic = {
  name: string;
  type: string;
  address: string;
  phone: string;
  specialty: string;
};

const clinics = (rawData as { clinics: Clinic[] }).clinics;

function getCountyFromAddress(address: string): string {
  if (!address) return "其他";
  const match = address.match(/^(.{2,3}[市縣])/);
  return match ? match[1] : "其他";
}

export default function ClinicsPage() {
  const [selectedCounty, setSelectedCounty] = useState("全部");
  const [selectedSpecialty, setSelectedSpecialty] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");

  const counties = useMemo(() => {
    const set = new Set<string>();
    clinics.forEach((c) => set.add(getCountyFromAddress(c.address)));
    return ["全部", ...Array.from(set).sort()];
  }, []);

  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    clinics.forEach((c) => {
      if (c.specialty) {
        c.specialty.split(/[、,，/]/).forEach((s) => {
          const trimmed = s.trim();
          if (trimmed && trimmed.length < 15) set.add(trimmed);
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
    }).slice(0, 50);
  }, [selectedCounty, selectedSpecialty, searchTerm]);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="台灣醫療網" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          
          <nav className="flex items-center gap-4 md:gap-5">
            <Link href="/hospitals" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">醫院掛號</Link>
            <Link href="/clinics" className="text-sm font-medium text-teal-700 transition-colors">診所查找</Link>
            <Link href="/tools/bmi" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">健康小工具</Link>
            <Link href="/guides" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">就醫指南</Link>
            <Link href="/about" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">關於本站</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-10 pb-6 w-full">
        <p className="text-xs font-medium tracking-widest text-teal-700 mb-3">健保特約機構</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-4">
          找到附近的診所與醫院
        </h1>
        <p className="text-neutral-600 leading-relaxed max-w-2xl">
          資料來自健保署開放資料平台，每日更新。共收錄 {clinics.length} 家特約機構。
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-6 w-full space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-neutral-500">縣市：</span>
          {counties.map((c) => (
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
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-neutral-500">科別：</span>
          {allSpecialties.slice(0, 20).map((s) => (
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
          placeholder="搜尋機構名稱或地址..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-teal-500"
        />
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <p className="text-xs text-neutral-400 mb-4">
          顯示 {filtered.length} 家（最多 50 家，請善用篩選）
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((c, i) => (
            <article key={i} className="bg-white border border-neutral-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                {c.type && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {c.type}
                  </span>
                )}
              </div>
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