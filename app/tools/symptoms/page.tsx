"use client";

import { useState } from "react";
import Link from "next/link";
import rawData from "@/data/symptoms.json";
import { Header } from "../../components/Header";
import { ToolNav } from "../../components/ToolNav";

type Option = {
  label: string;
  type: "normal" | "emergency";
  advice: string;
  departments: string[];
};

type Symptom = {
  id: string;
  name: string;
  question: string;
  options: Option[];
};

type Category = {
  id: string;
  name: string;
  icon: string;
  symptoms: Symptom[];
};

const categories = (rawData as { categories: Category[] }).categories;

export default function SymptomsFlowPage() {
  const [step, setStep] = useState(0); // 0: 選大類, 1: 選症狀, 2: 回答問題, 3: 結果
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [result, setResult] = useState<Option | null>(null);

  const reset = () => {
    setStep(0);
    setSelectedCategory(null);
    setSelectedSymptom(null);
    setResult(null);
  };

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
            透過簡單點選，互動式醫療小幫手幫您釐清症狀，給出建議。本工具無法取代醫師診斷。
          </p>
          <ToolNav />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-8 w-full flex-1">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm min-h-[450px] flex flex-col justify-center relative overflow-hidden">
          
          {/* 返回按鈕 */}
          {step > 0 && step < 3 && (
            <button 
              onClick={() => {
                if (step === 1) setStep(0);
                if (step === 2) { setStep(1); setResult(null); }
              }} 
              className="absolute top-6 left-6 text-sm font-medium text-slate-400 hover:text-slate-700 flex items-center gap-1 z-10"
            >
              ← 返回
            </button>
          )}

          {/* Step 0: 選大類 */}
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">請問您哪裡不舒服？</h2>
                <p className="text-slate-500">請選擇最接近的症狀部位</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCategory(c); setStep(1); }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 transition-all group"
                  >
                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{c.icon}</span>
                    <span className="font-bold text-slate-700">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: 選症狀 */}
          {step === 1 && selectedCategory && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">{selectedCategory.name}</h2>
                <p className="text-slate-500">請選擇您的具體症狀</p>
              </div>
              <div className="space-y-3">
                {selectedCategory.symptoms.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedSymptom(s); setStep(2); }}
                    className="w-full text-left px-6 py-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all font-medium text-slate-700 flex justify-between items-center group"
                  >
                    <span>{s.name}</span>
                    <span className="text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: 回答問題 */}
          {step === 2 && selectedSymptom && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-2">
                  {selectedSymptom.question}
                </h2>
                <p className="text-sm text-slate-500">請選擇最符合您現況的選項</p>
              </div>
              <div className="space-y-3">
                {selectedSymptom.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => { setResult(opt); setStep(3); }}
                    className={`w-full text-left px-6 py-4 rounded-xl border transition-all font-medium text-slate-700 flex justify-between items-center group ${
                      opt.type === "emergency" 
                        ? "border-rose-100 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300" 
                        : "border-slate-200 hover:border-teal-400 hover:bg-teal-50"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {opt.type === "emergency" && <span className="text-rose-500 text-xs px-2 py-1 bg-rose-100 rounded">警示</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: 結果 */}
          {step === 3 && result && (
            <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
              {result.type === "emergency" ? (
                <div className="w-20 h-20 mx-auto bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-4xl mb-6">⚠️</div>
              ) : (
                <div className="w-20 h-20 mx-auto bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-4xl mb-6">✅</div>
              )}
              
              <h2 className={`text-2xl font-serif font-bold mb-4 ${result.type === "emergency" ? "text-rose-600" : "text-teal-700"}`}>
                {result.type === "emergency" ? "建議立即就醫" : "建議門診評估"}
              </h2>
              
              <p className="text-slate-600 leading-relaxed mb-8 max-w-md mx-auto">
                {result.advice}
              </p>

              <div className="bg-slate-50 rounded-xl p-4 mb-8 inline-block text-left border border-slate-100">
                <p className="text-sm text-slate-500 mb-2">建議掛號科別：</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {result.departments.map((d) => (
                    <span key={d} className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-700">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 justify-center mt-4">
                <Link href="/hospitals" className="px-6 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors">
                  查詢醫院掛號
                </Link>
                <Link href="/clinics" className="px-6 py-3 bg-white text-slate-700 border border-slate-200 font-medium rounded-full hover:bg-slate-50 transition-colors">
                  尋找附近診所
                </Link>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                <button onClick={reset} className="text-sm text-slate-400 hover:text-slate-700 underline underline-offset-4">
                  重新評估
                </button>
              </div>
            </div>
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