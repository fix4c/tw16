"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "../components/Header"; 
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
      <Header />

      <section className="relative overflow-hidden w-full border-b border-slate-100/50">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-8">
          <p className="text-xs font-bold tracking-widest text-blue-700 mb-3 uppercase">健保特約機構</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            找到附近的診所與醫院
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            資料來自健保署開放資料平台，每日更新。共收錄 {clinics.length} 家特約機構。
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pt-8 pb-6 w-full space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-slate-500">縣市：</span>
          {counties.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCounty(c)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${
                selectedCounty === c
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-slate-500">科別：</span>
          {allSpecialties.slice(0, 20).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSpecialty(s)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${
                selectedSpecialty === s
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-700"
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
          className="w-full px-5 py-3 border border-slate-200 rounded-full text-base bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
        />
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <p className="text-xs text-slate-400 font-medium mb-4">
          顯示 {filtered.length} 家（最多 50 家，請善用篩選）
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((c, i) => (
            <article key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                {c.type && (
                  <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                    {c.type}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">{c.name}</h3>
              <p className="text-sm text-slate-600 mt-2">{c.address}</p>
              <p className="text-sm text-slate-500 mt-1">電話：{c.phone || "—"}</p>
              {c.specialty && (
                <p className="text-xs font-medium text-blue-600 mt-3 bg-blue-50 inline-block px-2 py-1 rounded-md">科別：{c.specialty}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 text-xs text-slate-500 text-center leading-relaxed">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-medium">
            <span>🏆</span>
            <span>本站入圍衛福部 2006 年度優良健康資訊網站</span>
          </div>
          <p>© {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}