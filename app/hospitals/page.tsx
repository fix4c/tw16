"use client";

import { useState, useMemo, useEffect } from "react";
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

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function HospitalsPage() {
  const [selectedRegion, setSelectedRegion] = useState("全部");
  const [selectedLevel, setSelectedLevel] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<Record<string, { good: number; bad: number }>>({});
  const [widgetId, setWidgetId] = useState<string | null>(null);

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

  useEffect(() => {
    filtered.forEach(async (h) => {
      if (reviews[h.name]) return;
      try {
        const res = await fetch(`/api/reviews/${encodeURIComponent(h.name)}`);
        if (res.ok) {
          const data = await res.json();
          setReviews((prev) => ({ ...prev, [h.name]: data }));
        }
      } catch (e) {}
    });
  }, [filtered]);

  // Turnstile 初始化
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
      alert("您已經給這家醫院投過票了！");
      return;
    }

    if (!window.turnstile || !widgetId) {
      alert("人機驗證載入中，請稍後再點擊。");
      return;
    }

    window.turnstile.execute(widgetId);

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
            <Link href="/hospitals" className="text-teal-700">醫院掛號</Link>
            <Link href="/clinics" className="text-slate-600 hover:text-teal-700 transition-colors">院所查詢</Link>
            <Link href="/tools/symptoms" className="text-slate-600 hover:text-teal-700 transition-colors">症狀查科別</Link>
            <Link href="/tools/bmi" className="text-slate-600 hover:text-teal-700 transition-colors">BMI計算</Link>
            <Link href="/guides" className="text-slate-600 hover:text-teal-700 transition-colors">就醫指南</Link>
          </nav>
        </div>
      </header>

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
            <article key={h.id} className="bg-white rounded-2xl p-5 flex flex-col shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
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
                className="inline-flex items-center justify-center px-4 py-2.5 bg-teal-50 text-teal-700 text-sm font-bold rounded-xl hover:bg-teal-600 hover:text-white transition-colors duration-300 mb-4"
              >
                前往掛號入口 →
              </a>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 transition-colors"
                  onClick={() => handleVote(h.name, "good")}
                >
                  👍 值得推薦{" "}
                  <span className="text-xs bg-white px-1.5 rounded-md text-teal-700">
                    {reviews[h.name]?.good || 0}
                  </span>
                </button>
                <button
                  className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 transition-colors"
                  onClick={() => handleVote(h.name, "bad")}
                >
                  👎 有待加強{" "}
                  <span className="text-xs bg-white px-1.5 rounded-md text-rose-700">
                    {reviews[h.name]?.bad || 0}
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Turnstile 掛載點 */}
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
          <p className="mb-2">
            本站僅提供掛號入口連結，不代為掛號、不處理個人醫療資料。掛號規則與看診時間請以各醫院官網公告為準。
          </p>
          <p>© {new Date().getFullYear()} tw16.net · 非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}