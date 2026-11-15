"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "../../components/Header"; 
import { ToolNav } from "../../components/ToolNav";

export default function BmiCalculatorPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("");

  const calculateBmi = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height) / 100; // 公分轉公尺
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) return;

    const result = w / (h * h);
    const roundedResult = parseFloat(result.toFixed(1));
    setBmi(roundedResult);

    // 台灣衛福部標準：18.5 <= BMI < 24 為正常
    if (roundedResult < 18.5) {
      setStatus("體重過輕");
      setStatusColor("text-blue-600 bg-blue-50 border-blue-200");
    } else if (roundedResult >= 18.5 && roundedResult < 24) {
      setStatus("健康體位");
      setStatusColor("text-teal-600 bg-teal-50 border-teal-200");
    } else if (roundedResult >= 24 && roundedResult < 27) {
      setStatus("體重過重");
      setStatusColor("text-amber-600 bg-amber-50 border-amber-200");
    } else {
      setStatus("肥胖");
      setStatusColor("text-red-600 bg-red-50 border-red-200");
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="max-w-3xl mx-auto px-6 pt-12 pb-8 w-full">
        <p className="text-xs font-medium tracking-widest text-teal-700 mb-3">健康小工具</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-4">
          BMI 身體質量指數計算器
        </h1>
        <p className="text-neutral-600 leading-relaxed">
          輸入您的身高與體重，快速了解目前的體位狀態。本工具僅供參考，無法取代專業醫師的診斷與建議。
        </p>
        <ToolNav />
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16 w-full">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8">
          <form onSubmit={calculateBmi} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">身高 (公分)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="例如：170"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">體重 (公斤)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="例如：65"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
            >
              計算 BMI
            </button>
          </form>

          {bmi !== null && (
            <div className="mt-8 pt-8 border-t border-neutral-100">
              <h3 className="text-center text-sm text-neutral-500 mb-2">您的 BMI 數值</h3>
              <div className="text-center text-5xl font-bold text-neutral-900 mb-4">{bmi}</div>
              <div className={`mx-auto w-fit px-6 py-2 rounded-full border text-sm font-medium ${statusColor}`}>
                {status}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 導流區塊 */}
      <section className="max-w-3xl mx-auto px-6 pb-16 w-full border-t border-neutral-200 pt-8">
        <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-4">需要專業協助嗎？</h2>
        <p className="text-neutral-600 mb-6 text-sm">
          如果您的體位狀態需要進一步評估，建議諮詢專業醫師或營養師。您可以利用本站導航尋找附近的醫療資源。
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/hospitals"
            className="inline-flex items-center justify-center px-6 py-2 bg-teal-50 text-teal-700 font-medium rounded-full border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            查詢醫院掛號 →
          </Link>
          <Link
            href="/clinics"
            className="inline-flex items-center justify-center px-6 py-2 bg-neutral-50 text-neutral-700 font-medium rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            尋找附近診所 →
          </Link>
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