"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import rawData from "@/data/symptoms.json";
import rawClinics from "@/data/clinics.json";
import { Header } from "../../components/Header";
import { ToolNav } from "../../components/ToolNav";
import { getSafeDepartments } from "@/lib/department-constants";
import { getTriageReason } from "@/lib/triage";

type Option = {
  label: string;
  type: "normal" | "emergency";
  advice: string;
  departments: string[];
};

type Symptom = { id: string; name: string; question: string; options: Option[] };
type Category = { id: string; name: string; icon: string; symptoms: Symptom[] };

const categories = (rawData as { categories: Category[] }).categories;

const COUNTY_ORDER = [
  "基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣",
  "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市",
  "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣", "連江縣"
];

const allCounties = Array.from(
  new Set(
    rawClinics.clinics.map((c: any) => {
      const match = c.address?.match(/^(.{2,3}[市縣])/);
      return match ? match[1].replace(/台/g, "臺") : "其他";
    })
  )
).filter((c) => c !== "其他")
.sort((a, b) => {
  const ia = COUNTY_ORDER.indexOf(a);
  const ib = COUNTY_ORDER.indexOf(b);
  return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
});

export default function SymptomsFlowPage() {
  const [mode, setMode] = useState<"select" | "ai">("select");
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [result, setResult] = useState<Option | null>(null);

  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  
  // 👇 新增：用於顯示打字機效果的狀態
  const [streamedText, setStreamedText] = useState("");
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [selectedCounty, setSelectedCounty] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (aiLoading) {
      setLoadingSeconds(0);
      interval = setInterval(() => {
        setLoadingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [aiLoading]);

  const reset = () => {
    setStep(0);
    setSelectedCategory(null);
    setSelectedSymptom(null);
    setResult(null);
    setAiInput("");
    setAiResult(null);
    setSelectedCounty("");
    setLoadingSeconds(0);
    setStreamedText(""); // 重置打字機文字
  };

  const handleAiSubmit = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    setStreamedText(""); // 清空上一次的文字

    try {
      const res = await fetch("/api/ai-triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: aiInput }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "AI 分析失敗");
        return;
      }

      if (!res.body) throw new Error("無法讀取回應內容");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullJsonString = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                alert(parsed.error);
                return;
              }
              if (parsed.content) {
                fullJsonString += parsed.content;
                // 👇 優化：邊接收邊更新畫面，實現打字機效果
                setStreamedText(fullJsonString);
              }
            } catch (e) {}
          }
        }
      }

      const cleaned = fullJsonString.replace(/```json|```/g, "").trim();
      const finalResult = JSON.parse(cleaned);
      setAiResult(finalResult);

    } catch (e) {
      alert("網路錯誤或分析超時，請稍後再試。");
    } finally {
      setAiLoading(false);
    }
  };

  const safeAiDepts: string[] = aiResult
    ? getSafeDepartments(aiResult.departments ?? [])
    : [];
  const safeResultDepts: string[] = result
    ? getSafeDepartments(result.departments ?? [])
    : [];
  const aiReason = aiResult && safeAiDepts[0] ? getTriageReason(aiInput, safeAiDepts[0]) : null;
  const selectReason = result && selectedSymptom && safeResultDepts[0]
      ? getTriageReason(`${selectedSymptom.name} ${result.label} ${result.advice}`, safeResultDepts[0])
      : null;

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <section className="relative overflow-hidden w-full border-b border-slate-100/50">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/40 to-transparent pointer-events-none"></div>
        <div className="relative max-w-3xl mx-auto px-6 pt-12 pb-8">
          <p className="text-xs font-bold tracking-widest text-teal-700 mb-3 uppercase">症狀導航</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            身體不舒服，該看哪一科？
          </h1>
          <p className="text-slate-600 leading-relaxed mb-6">
            你可以使用 AI 快速分析，或透過點選引導來找出適合的科別。本工具無法取代醫師診斷。
          </p>
          <ToolNav />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-8 w-full flex-1">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm min-h-[500px] flex flex-col relative overflow-hidden">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button onClick={() => { setMode("select"); reset(); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === "select" ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>👆 點選引導</button>
            <button onClick={() => { setMode("ai"); reset(); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${mode === "ai" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>✨ AI 智能分析</button>
          </div>

          {mode === "ai" && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center mb-6">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-2">用一句話描述您的症狀</h2>
                <p className="text-sm text-slate-500">例如：「我昨天開始右下腹一直痛，還有點發燒」</p>
              </div>
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="請詳細描述您的不適..."
                className="w-full h-32 p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none mb-4 bg-slate-50"
              />
              <button
                onClick={handleAiSubmit}
                disabled={aiLoading || !aiInput.trim()}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {aiLoading ? (
                  <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> 分析中... 已等待 {loadingSeconds} 秒</>
                ) : "✨ 開始分析"}
              </button>

              {/* 👇 新增：顯示打字機效果的文字 */}
              {aiLoading && streamedText && (
                <div className="mt-6 p-4 bg-slate-100 rounded-xl text-sm font-mono text-slate-600 break-all animate-pulse">
                  {streamedText}
                </div>
              )}

              {aiResult && (
                <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                  <div className={`p-6 rounded-2xl border ${aiResult.is_emergency ? "bg-rose-50 border-rose-200" : "bg-teal-50 border-teal-200"}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{aiResult.is_emergency ? "🚨" : "✅"}</span>
                      <h3 className={`text-xl font-bold ${aiResult.is_emergency ? "text-rose-700" : "text-teal-700"}`}>{aiResult.is_emergency ? "建議立即就醫" : "建議門診評估"}</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-4">{aiResult.advice}</p>
                    {aiResult.warning && <p className="text-sm font-bold text-rose-600 bg-white/60 p-3 rounded-lg mb-4">⚠️ {aiResult.warning}</p>}
                    <div className="bg-white/60 p-4 rounded-xl border border-white">
                      <p className="text-xs text-slate-500 mb-2">建議掛號科別：</p>
                      <div className="flex flex-wrap gap-2">
                        {safeAiDepts.map((d: string) => (
                          <span key={d} className="px-3 py-1 bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-700">{d}</span>
                        ))}
                      </div>
                    </div>
                    {aiReason && (
                      <div className="mt-4 p-3 bg-white/80 border border-teal-100 rounded-lg">
                        <p className="text-xs font-bold text-teal-700 mb-1">💡 為什麼建議這個科別？</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{aiReason}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                    <h4 className="font-bold text-slate-900 mb-3 text-center">尋找您附近的 {safeAiDepts[0]} 診所</h4>
                    <div className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
                      <select value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} className="flex-1 px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-teal-500 text-slate-700 font-medium">
                        <option value="">請選擇縣市</option>
                        {allCounties.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <Link href={selectedCounty ? `/clinics/${encodeURIComponent(`${selectedCounty}-${safeAiDepts[0]}`)}` : "#"} className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-bold transition-colors ${selectedCounty ? "bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-500/20" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`} onClick={(e) => { if (!selectedCounty) e.preventDefault(); }}>查看在地診所 →</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === "select" && (
            <>
              {step > 0 && step < 3 && (
                <button onClick={() => { if (step === 1) setStep(0); if (step === 2) { setStep(1); setResult(null); } }} className="absolute top-20 left-6 text-sm font-medium text-slate-400 hover:text-slate-700 flex items-center gap-1 z-10">← 返回</button>
              )}
              {step === 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="text-center mb-8"><h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">請問您哪裡不舒服？</h2></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((c) => (
                      <button key={c.id} onClick={() => { setSelectedCategory(c); setStep(1); }} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 transition-all group">
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{c.icon}</span>
                        <span className="font-bold text-slate-700 text-sm">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 1 && selectedCategory && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center mb-8"><h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">{selectedCategory.name}</h2></div>
                  <div className="space-y-3">
                    {selectedCategory.symptoms.map((s) => (
                      <button key={s.id} onClick={() => { setSelectedSymptom(s); setStep(2); }} className="w-full text-left px-6 py-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all font-medium text-slate-700 flex justify-between items-center group">
                        <span>{s.name}</span><span className="text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 2 && selectedSymptom && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center mb-8"><h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-2">{selectedSymptom.question}</h2></div>
                  <div className="space-y-3">
                    {selectedSymptom.options.map((opt, i) => (
                      <button key={i} onClick={() => { setResult(opt); setStep(3); }} className={`w-full text-left px-6 py-4 rounded-xl border transition-all font-medium text-slate-700 flex justify-between items-center group ${opt.type === "emergency" ? "border-rose-100 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300" : "border-slate-200 hover:border-teal-400 hover:bg-teal-50"}`}>
                        <span>{opt.label}</span>
                        {opt.type === "emergency" && <span className="text-rose-500 text-xs px-2 py-1 bg-rose-100 rounded">警示</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 3 && result && (
                <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 ${result.type === "emergency" ? "bg-rose-100 text-rose-600" : "bg-teal-100 text-teal-600"}`}>{result.type === "emergency" ? "⚠️" : "✅"}</div>
                  <h2 className={`text-2xl font-serif font-bold mb-4 ${result.type === "emergency" ? "text-rose-600" : "text-teal-700"}`}>{result.type === "emergency" ? "建議立即就醫" : "建議門診評估"}</h2>
                  <p className="text-slate-600 leading-relaxed mb-8 max-w-md mx-auto">{result.advice}</p>
                  <div className="bg-slate-50 rounded-xl p-4 mb-4 inline-block text-left border border-slate-100">
                    <p className="text-sm text-slate-500 mb-2">建議掛號科別：</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {safeResultDepts.map((d) => <span key={d} className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-700">{d}</span>)}
                    </div>
                  </div>
                  {selectReason && (
                    <div className="max-w-md mx-auto mb-8 p-3 bg-teal-50 border border-teal-100 rounded-lg text-left">
                      <p className="text-xs font-bold text-teal-700 mb-1">💡 為什麼建議這個科別？</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{selectReason}</p>
                    </div>
                  )}
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto">
                    <h4 className="font-bold text-slate-900 mb-3 text-center">尋找您附近的 {safeResultDepts[0]} 診所</h4>
                    <div className="flex flex-col gap-3">
                      <select value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-teal-500 text-slate-700 font-medium">
                        <option value="">請選擇縣市</option>
                        {allCounties.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <Link href={selectedCounty ? `/clinics/${encodeURIComponent(`${selectedCounty}-${safeResultDepts[0]}`)}` : "#"} className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-bold transition-colors ${selectedCounty ? "bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-500/20" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`} onClick={(e) => { if (!selectedCounty) e.preventDefault(); }}>查看在地診所 →</Link>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center gap-4">
                    <Link href="/hospitals" className="px-6 py-3 bg-white text-slate-700 border border-slate-200 font-medium rounded-full hover:bg-slate-50">查詢醫院掛號</Link>
                    <button onClick={reset} className="text-sm text-slate-400 hover:text-slate-700 underline underline-offset-4">重新評估</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-slate-500 text-center">
          <p className="mb-2">本工具僅供初步導航參考，無法取代專業醫師的診斷與治療。若症狀緊急，請立即撥打 119。</p>
          <p>© {new Date().getFullYear()} tw16.net · 非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}