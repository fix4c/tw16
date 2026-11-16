"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "../components/Header";

type RankItem = { id: string; good_count: number; bad_count: number };

export default function RankingsPage() {
  const [items, setItems] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rankings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return <span className="text-slate-400 font-bold ml-1">{index + 1}</span>;
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="relative overflow-hidden w-full border-b border-slate-100/50">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 to-transparent pointer-events-none"></div>
        <div className="relative max-w-3xl mx-auto px-6 pt-12 pb-8 text-center">
          <p className="text-xs font-bold tracking-widest text-amber-700 mb-3 uppercase">社群互動</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            全台機構口碑排行榜
          </h1>
          <p className="text-slate-600 leading-relaxed mb-6">
            根據本站真實用戶（經人機驗證防刷票）點擊「值得推薦」的數據，即時統計出的熱門醫療機構。
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-8 w-full flex-1">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <span className="text-5xl block mb-4">📭</span>
            <h3 className="text-lg font-bold text-slate-700 mb-2">目前還沒有足夠的評價數據</h3>
            <p className="text-slate-500 text-sm mb-6">成為第一個為您推薦的診所或醫院點讚的人吧！</p>
            <div className="flex justify-center gap-3">
              <Link href="/hospitals" className="px-5 py-2.5 bg-teal-600 text-white rounded-full text-sm font-medium hover:bg-teal-700">去評價醫院</Link>
              <Link href="/clinics" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-50">去評價診所</Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center text-xl font-bold">
                      {getMedal(index)}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-900">{decodeURIComponent(item.id)}</h3>
                      <p className="text-xs text-slate-500 mt-1">獲得 {item.good_count} 人推薦</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.bad_count > 0 && (
                      <span className="text-xs text-rose-500 bg-rose-50 px-2 py-1 rounded-md">👎 {item.bad_count}</span>
                    )}
                    <span className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
                      👍 {item.good_count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-slate-500 text-center">
          <p>排行榜數據即時更新，僅供參考，不構成醫療機構評鑑之依據。</p>
          <p className="mt-2">© {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}