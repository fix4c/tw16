"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import rawData from "@/data/clinics.json";
import { Header } from "../components/Header";

type Clinic = {
  name: string;
  type: string;
  address: string;
  phone: string;
  specialty: string;
};

const clinics = (rawData as { clinics: Clinic[] }).clinics;

// 1. 台灣 22 縣市的正確排序
const COUNTY_ORDER = [
  "基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣",
  "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市",
  "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣", "連江縣"
];

// 2. 絕對防禦：強制對應表，把舊的、錯的、重複的縣市名稱暴力轉換
function normalizeCounty(name: string): string {
  if (!name) return "其他";
  // 先將所有「台」轉為「臺」
  let n = name.replace(/台/g, "臺").trim();
  
  // 強制對應（處理歷史舊資料）
  const mapping: Record<string, string> = {
    "桃園縣": "桃園市",
    "臺南縣": "臺南市",
    "臺北縣": "新北市",
    "高雄縣": "高雄市",
  };
  
  if (mapping[n]) return mapping[n];
  return n;
}

function getCountyFromAddress(address: string): string {
  if (!address) return "其他";
  const match = address.match(/^(.{2,3}[市縣])/);
  if (!match) return "其他";
  return normalizeCounty(match[1]);
}

function getDistrictFromAddress(address: string): string {
  if (!address) return "其他";
  const countyMatch = address.match(/^(.{2,3}[市縣])/);
  if (!countyMatch) return "其他";
  const county = countyMatch[1];
  const rest = address.slice(county.length).trim();
  const districtMatch = rest.match(/^(.{1,3}?[區鄉鎮市])/);
  return districtMatch ? districtMatch[1] : "其他";
}

// 3. 絕對防禦：科別清洗函數（處理全形、半形空白與分隔符）
function getAllCleanSpecialties(c: Clinic): string[] {
  const specs = new Set<string>();
  
  const process = (value: string) => {
    if (!value) return;
    // 將所有可能的分隔符（包含全形空白 \u3000）替換為半形逗號
    const normalized = value.replace(/[\s\u3000、，；;\/]/g, ",");
    
    normalized.split(",").forEach(part => {
      const trimmed = part.trim();
      // 保留合理長度的字串（過濾掉無意義的長句）
      if (trimmed && trimmed.length < 10) {
        specs.add(trimmed);
      }
    });
  };

  process(c.specialty);
  process(c.type);
  
  return Array.from(specs);
}

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function ClinicsPage() {
  const [selectedCounty, setSelectedCounty] = useState("全部");
  const [selectedDistrict, setSelectedDistrict] = useState("全部");
  const [selectedSpecialty, setSelectedSpecialty] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<Record<string, { good: number; bad: number }>>({});
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);

  // 👇 渲染前二次除重：先轉換為正規化名稱，再用 Set 去除
  const counties = useMemo(() => {
    const set = new Set<string>();
    clinics.forEach((c) => set.add(getCountyFromAddress(c.address)));
    
    const sorted = Array.from(set)
      .filter(c => c !== "其他")
      .sort((a, b) => {
        const idxA = COUNTY_ORDER.indexOf(a);
        const idxB = COUNTY_ORDER.indexOf(b);
        // 如果在排序表中，依照排序表；如果不在，排到最後
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      });

    return ["全部", ...sorted];
  }, []);

  const districts = useMemo(() => {
    if (selectedCounty === "全部") return [];
    const set = new Set<string>();
    clinics
      .filter((c) => getCountyFromAddress(c.address) === selectedCounty)
      .forEach((c) => {
        const d = getDistrictFromAddress(c.address);
        if (d && d !== "其他") set.add(d);
      });
    return ["全部", ...Array.from(set).sort()];
  }, [selectedCounty]);

  // 👇 渲染前二次除重：收集所有診所的科別，放入 Set 中確保唯一
  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    clinics.forEach((c) => {
      getAllCleanSpecialties(c).forEach((s) => set.add(s));
    });
    return ["全部", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    return clinics
      .filter((c) => {
        if (selectedCounty !== "全部" && getCountyFromAddress(c.address) !== selectedCounty) return false;
        if (selectedDistrict !== "全部" && getDistrictFromAddress(c.address) !== selectedDistrict) return false;
        
        if (selectedSpecialty !== "全部") {
          const specs = getAllCleanSpecialties(c);
          if (!specs.includes(selectedSpecialty)) return false;
        }

        if (searchTerm && !c.name.includes(searchTerm) && !c.address.includes(searchTerm) && !c.specialty.includes(searchTerm)) return false;
        return true;
      })
      .slice(0, 200);
  }, [selectedCounty, selectedDistrict, selectedSpecialty, searchTerm]);

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

    setVotingId(id);
    const current = reviews[id] || { good: 0, bad: 0 };
    setReviews((prev) => ({ ...prev, [id]: { ...current, [type]: current[type] + 1 } }));

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
      setVotingId(null);
      setReviews((prev) => ({ ...prev, [id]: current }));
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, token, fingerprint: getFingerprint() }),
      });

      if (res.status === 409) {
        alert("您已經投票過了！");
        localStorage.setItem(votedKey, "true");
        setVotingId(null);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setReviews((prev) => ({ ...prev, [id]: data }));
        localStorage.setItem(votedKey, "true");
        (window as any).turnstileToken = null;
        window.turnstile.reset(widgetId);
        alert("✅ 感謝您的投票！您的意見已成功記錄。");
      } else {
        const err = await res.json();
        alert(err.error || "投票失敗");
        setReviews((prev) => ({ ...prev, [id]: current }));
      }
    } catch (e) {
      alert("網路錯誤，請稍後再試。");
      setReviews((prev) => ({ ...prev, [id]: current }));
    } finally {
      setVotingId(null);
    }
  };

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
        
        {/* 縣市篩選 */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-bold text-slate-500 mr-2">縣市：</span>
          {counties.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedCounty(c);
                setSelectedDistrict("全部");
              }}
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

        {/* 區域篩選 */}
        {selectedCounty !== "全部" && districts.length > 1 && (
          <div className="flex flex-wrap gap-2 items-center bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-1">
            <span className="text-sm font-bold text-indigo-700 mr-2">區域：</span>
            {districts.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDistrict(d)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                  selectedDistrict === d
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-700"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* 科別篩選 */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-bold text-slate-500 mr-2">科別：</span>
          {allSpecialties.map((s) => (
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
          顯示 {filtered.length} 家（最多 200 家，請善用篩選）
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
                  disabled={votingId === c.name}
                  className={`flex items-center gap-1 text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 transition-all duration-300 ${
                    votingId === c.name ? "opacity-50 scale-95 cursor-not-allowed" : "hover:text-teal-800 hover:bg-teal-100"
                  }`}
                  onClick={() => handleVote(c.name, "good")}
                >
                  {votingId === c.name ? (
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-teal-600 border-t-transparent rounded-full" />
                  ) : (
                    "👍 值得推薦"
                  )}
                  <span className={`text-xs px-1.5 rounded-md transition-all duration-300 ${
                    votingId === c.name ? "bg-teal-600 text-white text-lg py-0.5 px-2 font-bold scale-110 shadow-md" : "bg-white text-teal-700"
                  }`}>
                    {reviews[c.name]?.good || 0}
                  </span>
                </button>
                
                <button
                  disabled={votingId === c.name}
                  className={`flex items-center gap-1 text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 transition-all duration-300 ${
                    votingId === c.name ? "opacity-50 scale-95 cursor-not-allowed" : "hover:text-rose-800 hover:bg-rose-100"
                  }`}
                  onClick={() => handleVote(c.name, "bad")}
                >
                  {votingId === c.name ? (
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-rose-600 border-t-transparent rounded-full" />
                  ) : (
                    "👎 有待加強"
                  )}
                  <span className={`text-xs px-1.5 rounded-md transition-all duration-300 ${
                    votingId === c.name ? "bg-rose-600 text-white text-lg py-0.5 px-2 font-bold scale-110 shadow-md" : "bg-white text-rose-700"
                  }`}>
                    {reviews[c.name]?.bad || 0}
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

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