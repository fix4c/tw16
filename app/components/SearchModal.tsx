"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import rawClinics from "@/data/clinics.json";
import rawHospitals from "@/data/hospitals.json";
import rawSymptoms from "@/data/symptoms.json";

const guides = [
  { title: "全台醫院掛號指南", desc: "網路掛號、現場號、各大醫院系統差異", url: "/guides/registration-guide" },
  { title: "兩岸醫療面面觀", desc: "台灣與大陸就醫流程差異與注意事項", url: "/guides/cross-strait-guide" },
  { title: "新住民就醫指南", desc: "新住民與外籍移工在台就醫須知", url: "/guides/new-resident-guide" },
  { title: "看懂健康檢查報告", desc: "紅字指標解析、三高與肝腎功能", url: "/guides/health-checkup-guide" },
  { title: "看懂常規抽血報告", desc: "GPT、eGFR、膽固醇等常見數值解析", url: "/guides/blood-test-guide" },
  { title: "高血壓日常控制指南", desc: "正確量血壓、得舒飲食與就醫時機", url: "/guides/hypertension-guide" },
  { title: "健保卡遺失換發指南", desc: "補辦管道、無卡就醫解決方案", url: "/guides/nhi-card-guide" },
];

type SearchItem = {
  title: string;
  subtitle: string;
  url: string;
  type: "醫院" | "診所" | "指南" | "症狀";
};

function normalizeName(name: string): string {
  return name.replace(/台/g, "臺");
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);

  useEffect(() => {
    if (isOpen && !fuse) {
      const allItems: SearchItem[] = [];

      // 醫院 (正規化名稱)
      rawHospitals.hospitals.forEach((h) => {
        allItems.push({
          title: normalizeName(h.name),
          subtitle: `${normalizeName(h.region)} | ${h.level}`,
          url: "/hospitals",
          type: "醫院",
        });
      });

      // 診所 (正規化名稱與科別)
      rawClinics.clinics.slice(0, 2000).forEach((c) => {
        const countyMatch = c.address.match(/^(.{2,3}[市縣])/);
        const county = countyMatch ? normalizeName(countyMatch[1]) : "其他";
        allItems.push({
          title: normalizeName(c.name),
          subtitle: `${county} | ${c.specialty || c.type}`,
          url: `/clinics/${encodeURIComponent(county)}`,
          type: "診所",
        });
      });

      // 指南
      guides.forEach((g) => {
        allItems.push({
          title: g.title,
          subtitle: g.desc,
          url: g.url,
          type: "指南",
        });
      });

      // 症狀
      rawSymptoms.categories.forEach((cat) => {
        cat.symptoms.forEach((sym) => {
          allItems.push({
            title: sym.name,
            subtitle: cat.name,
            url: "/tools/symptoms",
            type: "症狀",
          });
        });
      });

      setFuse(
        new Fuse(allItems, {
          keys: ["title", "subtitle"],
          threshold: 0.3,
          includeScore: true,
        })
      );
    }
  }, [isOpen, fuse]);

  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    // 👇 搜尋前將輸入正規化，讓輸入「台大」也能找到「臺大」
    const normalizedQuery = query.replace(/台/g, "臺");
    const searchResults = fuse.search(normalizedQuery).slice(0, 8).map((r) => r.item);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, fuse]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
      if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        router.push(results[selectedIndex].url);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 md:pt-32 bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="relative border-b border-slate-100">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="搜尋醫院、診所、指南或症狀..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-12 py-5 text-lg text-slate-900 bg-transparent focus:outline-none placeholder-slate-400"
          />
          <button onClick={onClose} className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-slate-700 text-sm font-bold">
            ESC
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              請輸入關鍵字開始搜尋
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              找不到與「{query}」相關的結果
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((item, index) => (
                <li key={`${item.title}-${index}`}>
                  <button
                    onClick={() => {
                      router.push(item.url);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
                      index === selectedIndex ? "bg-teal-50 text-teal-900" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-base">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                      item.type === "醫院" ? "bg-blue-100 text-blue-700" :
                      item.type === "診所" ? "bg-teal-100 text-teal-700" :
                      item.type === "指南" ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    }`}>
                      {item.type}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span><kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5">↑</kbd> <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5">↓</kbd> 選擇</span>
            <span><kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5">Enter</kbd> 前往</span>
          </div>
          <span>全站搜尋</span>
        </div>

      </div>
    </div>
  );
}