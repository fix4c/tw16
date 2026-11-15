"use client";

import { useState, useMemo, useEffect } from "react";
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

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function ClinicsPage() {
  const [selectedCounty, setSelectedCounty] = useState("全部");
  const [selectedSpecialty, setSelectedSpecialty] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<Record<string, { good: number; bad: number }>>({});
  const [widgetId, setWidgetId] = useState<string | null>(null);

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
    return clinics
      .filter((c) => {
        if (selectedCounty !== "全部" && getCountyFromAddress(c.address) !== selectedCounty) return false;
        if (selectedSpecialty !== "全部" && !c.specialty.includes(selectedSpecialty)) return false;
        if (searchTerm && !c.name.includes(searchTerm) && !c.address.includes(searchTerm)) return false;
        return true;
      })
      .slice(0, 50);
  }, [selectedCounty, selectedSpecialty, searchTerm]);

  useEffect(() => {
    filtered.forEach(async (c) => {
      if (reviews[c.name]) return;
      try {
        const res = await fetch(`/api/reviews/${encodeURIComponent(c.name)}`);
        if (res.ok) {
          const data = await res.json();
          setReviews((prev) => ({ ...prev, [c.name]: data }));
        }
      } catch (e) {}
    });
  }, [filtered]);

  // 初始化 Turnstile：等待全域腳本就緒，然後渲染到固定容器
  useEffect(() => {
    const initTurnstile = () => {
      if (!window.turnstile) return false;
      const id = window.turnstile.render("#turnstile-container", {
        sitekey: "0x4AAAAAAGCQOLZJ-kNPvci4",
        execution: "execute",
        appearance: "always",
        callback: (token: string) => {
          (window as any).turnstileToken = token;
        },
        "error-callback": () => {
          console.error("Turnstile 驗證失敗");
        },
        "expired-callback": () => {
          (window as any).turnstileToken = null;
        },
      });
      setWidgetId(id);
      return true;
    };

    if (initTurnstile()) return;

    const interval = setInterval(() => {
      if (initTurnstile()) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getFingerprint = () => {
    let fp = localStorage.getItem("tw16-fp");
    if (!fp) {
      fp = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("tw16-fp", fp);
    }
    return fp;
  };

  const handleVote = async (id: string, type: "good" | "bad") => {
    const votedKey = `tw16-voted-${id}`;
    if (localStorage.getItem(votedKey)) {
      alert("您已經給這家機構投過票了！");
      return;
    }

    if (!window.turnstile || !widgetId) {
      alert("人機驗證載入中，請稍後再點擊。");
      return;
    }

    // 手動執行驗證
    window.turnstile.execute(widgetId);

    // 等待 token（最多 5 秒）
    const token = await new Promise<string>((resolve, reject) => {
      let attempts = 0;
      const interval = setInterval(() => {
        const t = (window as any).turnstileToken;
        if (t) {
          clearInterval(interval);
          resolve(t);
        }
        if (++attempts > 50) {
          clearInterval(interval);
          reject(new Error("驗證超時"));
        }
      }, 100);
    }).catch(() => null);

    if (!token) {
      alert("人機驗證失敗，請稍後再試。");
      return;
    }

    const current = reviews[id] || { good: 0, bad: 0 };
    setReviews((prev) => ({ ...prev, [id]: { ...current, [type]: current[type] + 1 } }));

    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, token, fingerprint: getFingerprint() }),
      });

      if (res.status === 409) {
        alert("您已經投票過了！");
        localStorage.setItem(votedKey, "true");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setReviews((prev) => ({ ...prev, [id]: data }));
        localStorage.setItem(votedKey, "true");
        (window as any).turnstileToken = null;
        window.turnstile.reset(widgetId);
      } else {
        const err = await res.json();
        alert(err.error || "投票失敗");
      }
    } catch (e) {
      alert("網路錯誤，請稍後再試。");
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="台灣醫療網" className="h-10 md:h-12 w-auto object-contain" />
          </Link>

          <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium">
            <Link href="/hospitals" className="text-slate-600 hover:text-teal-700 transition-colors">醫院掛號</Link>
            <Link href="/clinics" className="text-teal-700">院所查詢</Link>
            <Link href="/tools/symptoms" className="text-slate-600 hover:text-teal-700 transition-colors">症狀查科別</Link>
            <Link href="/tools/bmi" className="text-slate-600 hover:text-teal-700 transition-colors">BMI計算</Link>
            <Link href="/guides" className="text-slate-600 hover:text-teal-700 transition-colors">就醫指南</Link>
          </nav>
        </div>
      </header>

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
            <article key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 flex flex-col">
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
                <p className="text-xs font-medium text-blue-600 mt-3 bg-blue-50 inline-block px-2 py-1 rounded-md">
                  科別：{c.specialty}
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 mt-auto">
                <button
                  className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 transition-colors"
                  onClick={() => handleVote(c.name, "good")}
                >
                  👍 值得推薦{" "}
                  <span className="text-xs bg-white px-1.5 rounded-md text-teal-700">
                    {reviews[c.name]?.good || 0}
                  </span>
                </button>
                <button
                  className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 transition-colors"
                  onClick={() => handleVote(c.name, "bad")}
                >
                  👎 有待加強{" "}
                  <span className="text-xs bg-white px-1.5 rounded-md text-rose-700">
                    {reviews[c.name]?.bad || 0}
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 👇 Turnstile 掛載點：用 aria-hidden 隱藏，但不使用 display:none，避免 Turnstile 無法渲染 */}
      <div
        id="turnstile-container"
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          width: "300px",
          height: "65px",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      ></div>

      <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-slate-500">
          <p>資料來源：衛生福利部中央健康保險署開放資料平台 · 每日更新</p>
        </div>
      </footer>
    </main>
  );
}