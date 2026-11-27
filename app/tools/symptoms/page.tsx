"use client";

import { useState, useEffect, useRef } from "react";
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

type AiResult = {
  is_emergency?: boolean;
  departments?: string[];
  advice?: string;
  warning?: string;
};

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

/** 還原 JSON 字串中的跳脫字元；若結尾是不完整的跳脫序列則原樣回傳 */
function unescapeJsonString(s: string): string {
  try {
    return JSON.parse(`"${s}"`);
  } catch {
    return s.replace(/\\$/, "");
  }
}

/**
 * 從「尚未接收完整」的 JSON 字串中盡可能取出欄位，
 * 讓結果卡片能邊串流邊顯示（急診判斷 → 科別 → 建議）。
 */
function parsePartialAiJson(s: string): AiResult {
  const out: AiResult = {};

  const em = s.match(/"is_emergency"\s*:\s*(true|false)/);
  if (em) out.is_emergency = em[1] === "true";

  const dm = s.match(/"departments"\s*:\s*\[([^\]]*)\]/);
  if (dm) {
    out.departments = Array.from(dm[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)).map((m) =>
      unescapeJsonString(m[1])
    );
  }

  const am = s.match(/"advice"\s*:\s*"((?:[^"\\]|\\.)*)("|$)/);
  if (am) out.advice = unescapeJsonString(am[1]);

  const wm = s.match(/"warning"\s*:\s*"((?:[^"\\]|\\.)*)("|$)/);
  if (wm) out.warning = unescapeJsonString(wm[1]);

  return out;
}

/* ---------------- AI 請求：逾時偵測 + 自動重試 ---------------- */

// 後端最多等 9 秒（含備援模型），前端首包等待需略大於此值
const FIRST_DATA_TIMEOUT_MS = 11000;
// 開始串流後，若超過這段時間沒有新資料就視為卡住
const IDLE_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 2;

class TriageError extends Error {
  retryable: boolean;
  constructor(message: string, retryable: boolean) {
    super(message);
    this.retryable = retryable;
  }
}

async function requestTriage(
  symptoms: string,
  outer: AbortSignal,
  onText: (text: string) => void
): Promise<string> {
  const ctrl = new AbortController();
  const onOuterAbort = () => ctrl.abort();
  outer.addEventListener("abort", onOuterAbort);

  let stalled = false;
  let timer: ReturnType<typeof setTimeout> = setTimeout(() => {
    stalled = true;
    ctrl.abort();
  }, FIRST_DATA_TIMEOUT_MS);

  const bump = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      stalled = true;
      ctrl.abort();
    }, IDLE_TIMEOUT_MS);
  };

  // 把 fetch / read 的中止錯誤轉成可判斷的錯誤
  const wrap = (e: unknown): Error => {
    if (outer.aborted) return e as Error; // 使用者主動中止，原樣丟出
    if (e instanceof TriageError) return e;
    return new TriageError(stalled ? "AI 回應逾時" : "網路連線失敗", true);
  };

  try {
    let res: Response;
    try {
      res = await fetch("/api/ai-triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
        signal: ctrl.signal,
      });
    } catch (e) {
      throw wrap(e);
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      // 5xx（含 504 逾時）可重試；4xx（格式錯誤、429 額度）不重試，避免加重限流
      throw new TriageError(err.error || "AI 分析失敗", res.status >= 500);
    }
    if (!res.body) throw new TriageError("無法讀取回應內容", true);

    bump();
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let full = "";

    const handleLine = (line: string) => {
      if (!line.startsWith("data:")) return;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") return;
      let parsed: any;
      try {
        parsed = JSON.parse(data);
      } catch {
        return; // 忽略不完整片段
      }
      if (parsed.error) throw new TriageError(parsed.error, true);
      if (parsed.content) {
        full += parsed.content;
        onText(full);
      }
    };

    while (true) {
      let chunk: ReadableStreamReadResult<Uint8Array>;
      try {
        chunk = await reader.read();
      } catch (e) {
        throw wrap(e);
      }
      if (chunk.done) break;
      bump();

      buffer += decoder.decode(chunk.value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) handleLine(line.trim());
    }
    if (buffer.trim()) handleLine(buffer.trim());

    return full;
  } finally {
    clearTimeout(timer);
    outer.removeEventListener("abort", onOuterAbort);
  }
}

export default function SymptomsFlowPage() {
  const [mode, setMode] = useState<"select" | "ai">("select");
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [result, setResult] = useState<Option | null>(null);

  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRetrying, setAiRetrying] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);

  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [selectedCounty, setSelectedCounty] = useState("");

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
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

  // 離開頁面時中止進行中的請求
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const reset = () => {
    abortRef.current?.abort();
    setStep(0);
    setSelectedCategory(null);
    setSelectedSymptom(null);
    setResult(null);
    setAiInput("");
    setAiResult(null);
    setAiLoading(false);
    setAiRetrying(false);
    setSelectedCounty("");
    setLoadingSeconds(0);
  };

  const handleAiSubmit = async () => {
    if (!aiInput.trim() || aiLoading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAiLoading(true);
    setAiRetrying(false);
    setAiResult(null);

    try {
      let fullText = "";
      let lastError: TriageError | null = null;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          fullText = await requestTriage(aiInput, controller.signal, (text) => {
            // 邊接收邊更新：is_emergency 一出現就先顯示結果卡片
            const partial = parsePartialAiJson(text);
            if (partial.is_emergency !== undefined) setAiResult(partial);
          });
          lastError = null;
          break;
        } catch (e: any) {
          if (controller.signal.aborted) return; // 使用者重設或切換模式
          lastError =
            e instanceof TriageError ? e : new TriageError("AI 分析失敗", true);
          setAiResult(null);
          if (lastError.retryable && attempt < MAX_ATTEMPTS) {
            setAiRetrying(true); // 自動重試一次
            continue;
          }
          break;
        }
      }

      if (lastError) {
        alert(lastError.message || "AI 分析失敗，請稍後再試。");
        return;
      }

      // 以完整 JSON 為準；失敗時退回使用已解析的部分內容
      const cleaned = fullText.replace(/```json|```/g, "").trim();
      try {
        setAiResult(JSON.parse(cleaned));
      } catch {
        const fallback = parsePartialAiJson(fullText);
        if (fallback.departments && fallback.departments.length > 0) {
          setAiResult(fallback);
        } else {
          setAiResult(null);
          alert("AI 回應格式異常，請再試一次。");
        }
      }
    } finally {
      if (abortRef.current === controller) {
        setAiLoading(false);
        setAiRetrying(false);
      }
    }
  };

  const safeAiDepts: string[] = aiResult?.departments
    ? getSafeDepartments(aiResult.departments)
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
                id="ai-symptoms"
                name="symptoms"
                aria-label="症狀描述"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="請詳細描述您的不適..."
                maxLength={500}
                className="w-full h-32 p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none mb-4 bg-slate-50"
              />
              <button
                onClick={handleAiSubmit}
                disabled={aiLoading || !aiInput.trim()}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {aiLoading ? (
                  <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> {aiRetrying ? "連線較慢，自動重試中..." : "分析中..."} 已等待 {loadingSeconds} 秒</>
                ) : "✨ 開始分析"}
              </button>

              {aiResult && (
                <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                  <div className={`p-6 rounded-2xl border ${aiResult.is_emergency ? "bg-rose-50 border-rose-200" : "bg-teal-50 border-teal-200"}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{aiResult.is_emergency ? "🚨" : "✅"}</span>
                      <h3 className={`text-xl font-bold ${aiResult.is_emergency ? "text-rose-700" : "text-teal-700"}`}>{aiResult.is_emergency ? "建議立即就醫" : "建議門診評估"}</h3>
                    </div>
                    {aiResult.advice && <p className="text-slate-700 leading-relaxed mb-4">{aiResult.advice}</p>}
                    {aiResult.warning && <p className="text-sm font-bold text-rose-600 bg-white/60 p-3 rounded-lg mb-4">⚠️ {aiResult.warning}</p>}
                    {safeAiDepts.length > 0 && (
                      <div className="bg-white/60 p-4 rounded-xl border border-white">
                        <p className="text-xs text-slate-500 mb-2">建議掛號科別：</p>
                        <div className="flex flex-wrap gap-2">
                          {safeAiDepts.map((d: string) => (
                            <span key={d} className="px-3 py-1 bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-700">{d}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {aiReason && (
                      <div className="mt-4 p-3 bg-white/80 border border-teal-100 rounded-lg">
                        <p className="text-xs font-bold text-teal-700 mb-1">💡 為什麼建議這個科別？</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{aiReason}</p>
                      </div>
                    )}
                  </div>

                  {safeAiDepts[0] && (
                    <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                      <h4 className="font-bold text-slate-900 mb-3 text-center">尋找您附近的 {safeAiDepts[0]} 診所</h4>
                      <div className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
                        <select id="county-ai" name="county" aria-label="選擇縣市" value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} className="flex-1 px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-teal-500 text-slate-700 font-medium">
                          <option value="">請選擇縣市</option>
                          {allCounties.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <Link href={selectedCounty ? `/clinics/${encodeURIComponent(`${selectedCounty}-${safeAiDepts[0]}`)}` : "#"} className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-bold transition-colors ${selectedCounty ? "bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-500/20" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`} onClick={(e) => { if (!selectedCounty) e.preventDefault(); }}>查看在地診所 →</Link>
                      </div>
                    </div>
                  )}
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
                      <select id="county-select" name="county" aria-label="選擇縣市" value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-teal-500 text-slate-700 font-medium">
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