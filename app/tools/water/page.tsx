"use client";

import { useState } from "react";
import Link from "next/link";

export default function WaterCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [exercise, setExercise] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateWater = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const ex = parseFloat(exercise) || 0;

    if (!w || w <= 0) return;

    // 基礎飲水量：體重(kg) x 30ml；若有運動，每半小時額外增加 300ml
    const baseWater = w * 30;
    const extraWater = (ex / 0.5) * 300;
    const totalMl = baseWater + extraWater;
    
    setResult(Math.round(totalMl));
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="台灣醫療網" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium">
            <Link href="/tools/bmi" className="text-slate-600 hover:text-teal-700 transition-colors">BMI計算</Link>
            <Link href="/tools/water" className="text-teal-700">飲水量計算</Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden w-full border-b border-slate-100/50">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none"></div>
        <div className="relative max-w-3xl mx-auto px-6 pt-12 pb-8">
          <p className="text-xs font-bold tracking-widest text-blue-700 mb-3 uppercase">健康小工具</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            每日飲水量計算器
          </h1>
          <p className="text-slate-600 leading-relaxed">
            輸入您的體重與運動時間，快速算出今天該喝多少水。此數值僅供參考，實際需求依個人體質、氣候與健康狀況而異。
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-8 w-full flex-1">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <form onSubmit={calculateWater} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">體重 (公斤)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="例如：65"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">今日運動時間 (小時，選填)</label>
                <input
                  type="number"
                  step="0.5"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  placeholder="例如：1"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              計算建議飲水量
            </button>
          </form>

          {result !== null && (
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <h3 className="text-sm text-slate-500 mb-2">建議每日總飲水量</h3>
              <div className="text-5xl font-bold text-blue-700 mb-2">
                {result} <span className="text-2xl text-slate-400">ml</span>
              </div>
              <p className="text-sm text-slate-500">
                約等於 {Math.round(result / 250)} 杯 250c.c. 的水
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 text-xs text-slate-500 text-center leading-relaxed">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-medium">
            <span>🏆</span>
            <span>本站入圍衛福部 95 年度優良健康資訊網站（2006年）</span>
          </div>
          <p>© {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}