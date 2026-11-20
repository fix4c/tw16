"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import rawData from "@/data/clinics.json";
import { Header } from "../components/Header";

type Clinic = { name: string; type: string; address: string; phone: string; specialty: string; };
const clinics = (rawData as { clinics: Clinic[] }).clinics;

/* ============================================================
 * 科別白名單與清洗（核心修正）
 * ------------------------------------------------------------
 * 健保署 17 個主科別。任何非白名單科別（如「放射線科」、
 * 「病理科」、「中醫診所」、「牙醫專科診所」等）都會被丟棄，
 * 避免空科別與重複科別。
 * ============================================================ */
const DEPT_ORDER = [
  "不分科", "家醫科", "內科", "外科", "兒科", "婦產科", "骨科", "泌尿科",
  "耳鼻喉科", "眼科", "皮膚科", "神經科", "精神科", "復健科", "牙科",
  "中醫一般科", "急診醫學科",
];
const STANDARD_DEPTS = new Set(DEPT_ORDER);

// 關鍵詞 → 主科別（順序重要：長詞 / 專科詞放前面）
const DEPT_KEYWORDS: [string, string][] = [
  ["中醫", "中醫一般科"],
  ["牙醫", "牙科"], ["牙科", "牙科"], ["牙", "牙科"],
  ["耳鼻喉", "耳鼻喉科"],
  ["婦產", "婦產科"], ["婦科", "婦產科"], ["產科", "婦產科"],
  ["復健", "復健科"],
  ["精神", "精神科"],
  ["神經", "神經科"],
  ["皮膚", "皮膚科"],
  ["眼科", "眼科"],
  ["泌尿", "泌尿科"],
  ["骨科", "骨科"],
  ["小兒", "兒科"], ["兒科", "兒科"],
  ["急診", "急診醫學科"],
  ["家醫", "家醫科"], ["家庭醫", "家醫科"],
  ["不分科", "不分科"],
  ["外科", "外科"],
  ["內科", "內科"],
];

function resolveDept(raw: string): string | null {
  const clean = raw.replace(/\s/g, "").replace(/[（）()]/g, "");
  if (!clean) return null;
  if (STANDARD_DEPTS.has(clean)) return clean;
  for (const [kw, target] of DEPT_KEYWORDS) {
    if (clean.includes(kw)) return target;
  }
  return null;
}

/**
 * 從 specialty 欄位萃取標準科別清單。
 * specialty 格式為 "科別1,科別2 類型"，末尾是「空格 + type」。
 * 先剝離 type，再按逗號切分，逐項解析為白名單主科別，最後去重。
 */
function extractDepartments(clinic: Clinic): string[] {
  const specialty = (clinic.specialty || "").trim();
  const type = (clinic.type || "").trim();

  let deptPart = specialty;
  if (type) {
    if (deptPart === type) {
      deptPart = "";
    } else if (deptPart.endsWith(" " + type)) {
      deptPart = deptPart.slice(0, deptPart.length - type.length - 1).trim();
    }
  }
  if (!deptPart) return [];

  const result = new Set<string>();
  for (const raw of deptPart.split(/[,、，；;\/]/)) {
    const resolved = resolveDept(raw);
    if (resolved) result.add(resolved);
  }
  return Array.from(result);
}

/* ============================================================
 * 縣市 / 行政區（沿用你原本的邏輯，未改動）
 * ============================================================ */
const COUNTY_ORDER = [
  "基隆市","臺北市","新北市","桃園市","新竹市","新竹縣","苗栗縣",
  "臺中市","彰化縣","南投縣","雲林縣","嘉義市","嘉義縣","臺南市",
  "高雄市","屏東縣","宜蘭縣","花蓮縣","臺東縣","澎湖縣","金門縣","連江縣"
];

const COUNTY_DISTRICTS: Record<string, string[]> = {
  "基隆市": ["仁愛區","信義區","中正區","中山區","安樂區","暖暖區","七堵區"],
  "臺北市": ["松山區","信義區","大安區","中山區","中正區","大同區","萬華區","文山區","南港區","內湖區","士林區","北投區"],
  "新北市": ["板橋區","三重區","中和區","永和區","新莊區","新店區","樹林區","鶯歌區","三峽區","淡水區","汐止區","瑞芳區","土城區","蘆洲區","五股區","泰山區","林口區","深坑區","石碇區","坪林區","三芝區","石門區","八里區","平溪區","雙溪區","貢寮區","金山區","萬里區","烏來區"],
  "桃園市": ["桃園區","中壢區","平鎮區","八德區","楊梅區","蘆竹區","大園區","龜山區","龍潭區","新屋區","觀音區","復興區","大溪區"],
  "新竹市": ["東區","北區","香山區"],
  "新竹縣": ["竹北市","竹東鎮","新埔鎮","關西鎮","湖口鄉","新豐鄉","芎林鄉","橫山鄉","北埔鄉","寶山鄉","峨眉鄉","尖石鄉","五峰鄉"],
  "苗栗縣": ["苗栗市","頭份市","竹南鎮","後龍鎮","通霄鎮","苑裡鎮","卓蘭鎮","造橋鄉","西湖鄉","頭屋鄉","公館鄉","銅鑼鄉","三義鄉","大湖鄉","獅潭鄉","三灣鄉","南庄鄉","泰安鄉"],
  "臺中市": ["中區","東區","西區","南區","北區","西屯區","南屯區","北屯區","豐原區","大里區","太平區","清水區","沙鹿區","大甲區","東勢區","梧棲區","烏日區","神岡區","大肚區","大雅區","后里區","霧峰區","潭子區","龍井區","外埔區","和平區","石岡區","大安區","新社區"],
  "彰化縣": ["彰化市","員林市","和美鎮","鹿港鎮","溪湖鎮","二林鎮","田中鎮","北斗鎮","花壇鄉","芬園鄉","大村鄉","埔鹽鄉","埔心鄉","永靖鄉","社頭鄉","二水鄉","田尾鄉","埤頭鄉","芳苑鄉","大城鄉","竹塘鄉","溪州鄉","伸港鄉","線西鄉","福興鄉","秀水鄉"],
  "南投縣": ["南投市","埔里鎮","草屯鎮","竹山鎮","集集鎮","名間鄉","鹿谷鄉","中寮鄉","魚池鄉","國姓鄉","水里鄉","信義鄉","仁愛鄉"],
  "雲林縣": ["斗六市","斗南鎮","虎尾鎮","西螺鎮","土庫鎮","北港鎮","古坑鄉","大埤鄉","莿桐鄉","林內鄉","二崙鄉","崙背鄉","麥寮鄉","東勢鄉","褒忠鄉","臺西鄉","元長鄉","四湖鄉","口湖鄉","水林鄉"],
  "嘉義市": ["東區","西區"],
  "嘉義縣": ["太保市","朴子市","布袋鎮","大林鎮","民雄鄉","溪口鄉","新港鄉","六腳鄉","東石鄉","義竹鄉","鹿草鄉","水上鄉","中埔鄉","竹崎鄉","梅山鄉","番路鄉","大埔鄉","阿里山鄉"],
  "臺南市": ["中西區","東區","南區","北區","安平區","安南區","永康區","歸仁區","新化區","左鎮區","玉井區","楠西區","南化區","仁德區","關廟區","龍崎區","官田區","麻豆區","佳里區","西港區","七股區","將軍區","學甲區","北門區","新營區","後壁區","白河區","東山區","六甲區","下營區","柳營區","鹽水區","善化區","大內區","山上區","新市區","安定區"],
  "高雄市": ["鹽埕區","鼓山區","左營區","楠梓區","三民區","新興區","前金區","苓雅區","前鎮區","旗津區","鳳山區","林園區","大寮區","岡山區","路竹區","阿蓮區","田寮區","燕巢區","橋頭區","梓官區","彌陀區","永安區","湖內區","茄萣區","內門區","杉林區","甲仙區","六龜區","美濃區","茂林區","桃源區","那瑪夏區","大樹區","鳥松區","大社區","仁武區"],
  "屏東縣": ["屏東市","潮州鎮","東港鎮","恆春鎮","萬丹鄉","長治鄉","麟洛鄉","九如鄉","里港鄉","鹽埔鄉","高樹鄉","竹田鄉","內埔鄉","萬巒鄉","新埤鄉","枋寮鄉","新園鄉","崁頂鄉","林邊鄉","南州鄉","佳冬鄉","琉球鄉","車城鄉","滿州鄉","枋山鄉","三地門鄉","霧臺鄉","瑪家鄉","泰武鄉","來義鄉","春日鄉","獅子鄉","牡丹鄉"],
  "宜蘭縣": ["宜蘭市","羅東鎮","蘇澳鎮","頭城鎮","礁溪鄉","壯圍鄉","員山鄉","冬山鄉","五結鄉","三星鄉","大同鄉","南澳鄉"],
  "花蓮縣": ["花蓮市","鳳林鎮","玉里鎮","新城鄉","吉安鄉","壽豐鄉","光復鄉","豐濱鄉","瑞穗鄉","富里鄉","秀林鄉","萬榮鄉","卓溪鄉"],
  "臺東縣": ["臺東市","成功鎮","關山鎮","卑南鄉","鹿野鄉","池上鄉","東河鄉","長濱鄉","太麻里鄉","大武鄉","綠島鄉","蘭嶼鄉","延平鄉","海端鄉","達仁鄉","金峰鄉"],
  "澎湖縣": ["馬公市","湖西鄉","白沙鄉","西嶼鄉","望安鄉","七美鄉"],
  "金門縣": ["金城鎮","金湖鎮","金沙鎮","金寧鄉","烈嶼鄉","烏坵鄉"],
  "連江縣": ["南竿鄉","北竿鄉","莒光鄉","東引鄉"]
};

function normalizeCounty(name: string): string {
  if (!name) return "其他";
  const n = name.replace(/台/g, "臺").trim();
  const map: Record<string, string> = { "桃園縣":"桃園市","臺南縣":"臺南市","臺北縣":"新北市","高雄縣":"高雄市" };
  return map[n] || n;
}

function getCountyFromAddress(address: string): string {
  if (!address) return "其他";
  const m = address.match(/^(.{2,3}[市縣])/);
  return m ? normalizeCounty(m[1]) : "其他";
}

function getDistrictFromAddress(address: string, county: string): string {
  if (!address || !county) return "其他";
  const districts = COUNTY_DISTRICTS[county];
  if (!districts) return "其他";
  const rest = address.replace(/^(.{2,3}[市縣])/, "").trim();
  for (const d of districts) {
    if (rest.startsWith(d)) return d;
  }
  for (const d of districts) {
    if (d.length < 2) continue;
    const baseName = d.slice(0, -1);
    if (baseName.length >= 2 && rest.startsWith(baseName)) return d;
  }
  return "其他";
}

/* ============================================================
 * 主元件
 * ============================================================ */
declare global { interface Window { turnstile: any; } }

export default function ClinicsPage() {
  const [selectedCounty, setSelectedCounty] = useState("全部");
  const [selectedDistrict, setSelectedDistrict] = useState("全部");
  const [selectedSpecialty, setSelectedSpecialty] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<Record<string, { good: number; bad: number }>>({});
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);

  const counties = useMemo(() => {
    const set = new Set<string>();
    clinics.forEach(c => set.add(getCountyFromAddress(c.address)));
    return ["全部", ...Array.from(set).filter(c => c !== "其他").sort((a, b) => {
      const ia = COUNTY_ORDER.indexOf(a), ib = COUNTY_ORDER.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    })];
  }, []);

  const districts = useMemo(() => {
    if (selectedCounty === "全部") return [];
    const set = new Set<string>();
    clinics.filter(c => getCountyFromAddress(c.address) === selectedCounty)
      .forEach(c => {
        const d = getDistrictFromAddress(c.address, selectedCounty);
        if (d && d !== "其他") set.add(d);
      });
    return ["全部", ...Array.from(set).sort()];
  }, [selectedCounty]);

  // 【修正】一覽表科別清單：改用 extractDepartments，只顯示白名單主科別
  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    clinics.forEach(c => extractDepartments(c).forEach(s => set.add(s)));
    const sorted = Array.from(set).sort((a, b) => {
      const ia = DEPT_ORDER.indexOf(a), ib = DEPT_ORDER.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
    return ["全部", ...sorted];
  }, []);

  const filtered = useMemo(() => {
    return clinics.filter(c => {
      if (selectedCounty !== "全部" && getCountyFromAddress(c.address) !== selectedCounty) return false;
      if (selectedDistrict !== "全部" && getDistrictFromAddress(c.address, selectedCounty) !== selectedDistrict) return false;
      if (selectedSpecialty !== "全部" && !extractDepartments(c).includes(selectedSpecialty)) return false;
      if (searchTerm && !c.name.includes(searchTerm) && !c.address.includes(searchTerm) && !c.specialty.includes(searchTerm)) return false;
      return true;
    }).slice(0, 200);
  }, [selectedCounty, selectedDistrict, selectedSpecialty, searchTerm]);

  useEffect(() => {
    filtered.forEach(async c => {
      if (reviews[c.name]) return;
      try {
        const res = await fetch(`/api/reviews/${encodeURIComponent(c.name)}`);
        if (res.ok) { const data = await res.json(); setReviews(p => ({ ...p, [c.name]: data })); }
      } catch (e) {}
    });
  }, [filtered]);

  useEffect(() => {
    const init = () => {
      if (!window.turnstile) return false;
      const id = window.turnstile.render("#turnstile-container", {
        sitekey: "0x4AAAAAAGCQOLZJ-kNPvci4", execution: "execute", appearance: "always",
        callback: (t: string) => { (window as any).turnstileToken = t; },
        "error-callback": () => console.error("Turnstile fail"),
        "expired-callback": () => { (window as any).turnstileToken = null; },
      });
      setWidgetId(id); return true;
    };
    if (init()) return;
    const interval = setInterval(() => { if (init()) clearInterval(interval); }, 500);
    return () => clearInterval(interval);
  }, []);

  const getFp = () => {
    let fp = localStorage.getItem("tw16-fp");
    if (!fp) { fp = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("tw16-fp", fp); }
    return fp;
  };

  const handleVote = async (id: string, type: "good" | "bad") => {
    const key = `tw16-voted-${id}`;
    if (localStorage.getItem(key)) return alert("您已經給這家機構投過票了！");
    if (!window.turnstile || !widgetId) return alert("人機驗證載入中，請稍後再點擊。");

    setVotingId(id);
    const cur = reviews[id] || { good: 0, bad: 0 };
    setReviews(p => ({ ...p, [id]: { ...cur, [type]: cur[type] + 1 } }));

    window.turnstile.execute(widgetId);
    const token = await new Promise<string>((res, rej) => {
      let n = 0; const iv = setInterval(() => {
        const t = (window as any).turnstileToken;
        if (t) { clearInterval(iv); res(t); }
        if (++n > 50) { clearInterval(iv); rej(new Error("timeout")); }
      }, 100);
    }).catch(() => null);

    if (!token) { alert("人機驗證失敗，請稍後再試。"); setVotingId(null); setReviews(p => ({ ...p, [id]: cur })); return; }

    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(id)}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, token, fingerprint: getFp() }),
      });
      if (res.status === 409) { alert("您已經投票過了！"); localStorage.setItem(key, "true"); setVotingId(null); return; }
      if (res.ok) {
        const data = await res.json();
        setReviews(p => ({ ...p, [id]: data }));
        localStorage.setItem(key, "true");
        (window as any).turnstileToken = null;
        window.turnstile.reset(widgetId);
        alert("✅ 感謝您的投票！");
      } else { const e = await res.json(); alert(e.error || "投票失敗"); setReviews(p => ({ ...p, [id]: cur })); }
    } catch { alert("網路錯誤，請稍後再試。"); setReviews(p => ({ ...p, [id]: cur })); }
    finally { setVotingId(null); }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="relative overflow-hidden w-full border-b border-slate-100/50">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-8">
          <p className="text-xs font-bold tracking-widest text-blue-700 mb-3 uppercase">健保特約機構</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">找到附近的診所與醫院</h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl">資料來自健保署開放資料平台，每日更新。共收錄 {clinics.length} 家特約機構。</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pt-8 pb-6 w-full space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-bold text-slate-500 mr-2">縣市：</span>
          {counties.map(c => (
            <button key={c} onClick={() => { setSelectedCounty(c); setSelectedDistrict("全部"); }}
              className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${
                selectedCounty === c ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-700"
              }`}>{c}</button>
          ))}
        </div>

        {selectedCounty !== "全部" && districts.length > 1 && (
          <div className="flex flex-wrap gap-2 items-center bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-1">
            <span className="text-sm font-bold text-indigo-700 mr-2">區域：</span>
            {districts.map(d => (
              <button key={d} onClick={() => setSelectedDistrict(d)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                  selectedDistrict === d ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-700"
                }`}>{d}</button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-bold text-slate-500 mr-2">科別：</span>
          {allSpecialties.map(s => (
            <button key={s} onClick={() => setSelectedSpecialty(s)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${
                selectedSpecialty === s ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-700"
              }`}>{s}</button>
          ))}
        </div>

        <input type="text" placeholder="搜尋機構名稱或地址..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 border border-slate-200 rounded-full text-base bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm" />
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <p className="text-xs text-slate-400 font-medium mb-4">顯示 {filtered.length} 家（最多 200 家，請善用篩選）</p>
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((c, i) => {
            const depts = extractDepartments(c);
            return (
              <article key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  {c.type && <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">{c.type}</span>}
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900">{c.name}</h3>
                <p className="text-sm text-slate-600 mt-2">{c.address}</p>
                <p className="text-sm text-slate-500 mt-1">電話：{c.phone || "—"}</p>
                {depts.length > 0 && (
                  <p className="text-xs font-medium text-blue-600 mt-3 bg-blue-50 inline-block px-2 py-1 rounded-md">
                    科別：{depts.join("、")}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 mt-auto">
                  <button disabled={votingId === c.name} onClick={() => handleVote(c.name, "good")}
                    className={`flex items-center gap-1 text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 transition-all duration-300 ${
                      votingId === c.name ? "opacity-50 scale-95 cursor-not-allowed" : "hover:text-teal-800 hover:bg-teal-100"
                    }`}>
                    {votingId === c.name ? <span className="inline-block animate-spin h-4 w-4 border-2 border-teal-600 border-t-transparent rounded-full" /> : "👍 值得推薦"}
                    <span className={`text-xs px-1.5 rounded-md transition-all duration-300 ${votingId === c.name ? "bg-teal-600 text-white text-lg py-0.5 px-2 font-bold scale-110 shadow-md" : "bg-white text-teal-700"}`}>{reviews[c.name]?.good || 0}</span>
                  </button>
                  <button disabled={votingId === c.name} onClick={() => handleVote(c.name, "bad")}
                    className={`flex items-center gap-1 text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 transition-all duration-300 ${
                      votingId === c.name ? "opacity-50 scale-95 cursor-not-allowed" : "hover:text-rose-800 hover:bg-rose-100"
                    }`}>
                    {votingId === c.name ? <span className="inline-block animate-spin h-4 w-4 border-2 border-rose-600 border-t-transparent rounded-full" /> : "👎 有待加強"}
                    <span className={`text-xs px-1.5 rounded-md transition-all duration-300 ${votingId === c.name ? "bg-rose-600 text-white text-lg py-0.5 px-2 font-bold scale-110 shadow-md" : "bg-white text-rose-700"}`}>{reviews[c.name]?.bad || 0}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div id="turnstile-container" aria-hidden="true" style={{ position: "fixed", bottom: "10px", right: "10px", width: "300px", height: "65px", opacity: 0, pointerEvents: "none", zIndex: -1 }} />
      <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-slate-500">
          <p>資料來源：衛生福利部中央健康保險署開放資料平台 · 每日更新</p>
        </div>
      </footer>
    </main>
  );
}