"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Record = { date: string; bpSys: string; bpDia: string; sugar: string };

export function HealthDashboard() {
  const [latestRecord, setLatestRecord] = useState<Record | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const [waterGoal, setWaterGoal] = useState<number | null>(null);

  useEffect(() => {
    const recordsStr = localStorage.getItem("tw16-health-records");
    if (recordsStr) {
      try {
        const records: Record[] = JSON.parse(recordsStr);
        if (records.length > 0) setLatestRecord(records[0]);
      } catch (e) {}
    }
    const bmiStr = localStorage.getItem("tw16-bmi");
    if (bmiStr) setBmi(parseFloat(bmiStr));
    
    const waterStr = localStorage.getItem("tw16-water");
    if (waterStr) setWaterGoal(parseInt(waterStr));
  }, []);

  if (!latestRecord && !bmi && !waterGoal) {
    return (
      <section className="max-w-5xl mx-auto px-6 pb-6 w-full">
        <div className="bg-teal-50 border border-teal-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-teal-900 mb-1">建立您的專屬健康看板</h3>
            <p className="text-sm text-teal-700">記錄您的血壓、血糖或計算 BMI，系統會在此顯示您的健康狀態。</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/tools/health-tracker" className="px-4 py-2 bg-white text-teal-700 font-medium rounded-full border border-teal-200 text-sm hover:bg-teal-100">記錄三高</Link>
            <Link href="/tools/bmi" className="px-4 py-2 bg-teal-600 text-white font-medium rounded-full text-sm hover:bg-teal-700">算 BMI</Link>
          </div>
        </div>
      </section>
    );
  }

  const getStatusColor = (status: "good" | "warn" | "danger") => {
    if (status === "good") return "bg-emerald-500";
    if (status === "warn") return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <section className="max-w-5xl mx-auto px-6 pb-8 w-full animate-in fade-in duration-500">
      <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-900">我的健康看板</h3>
            <p className="text-xs text-slate-500 mt-1">數據僅保存在您的瀏覽器中，不上傳伺服器。</p>
          </div>
          <Link href="/tools/health-tracker" className="text-sm font-medium text-teal-600 hover:underline">更新數據 →</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* 血壓卡片 */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🩺</span>
              <h4 className="font-medium text-slate-700 text-sm">最近血壓</h4>
            </div>
            {latestRecord && latestRecord.bpSys && latestRecord.bpDia ? (
              <div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold text-slate-900">{latestRecord.bpSys}/{latestRecord.bpDia}</span>
                  <span className="text-xs text-slate-500 mb-1">mmHg</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(parseInt(latestRecord.bpSys) >= 140 || parseInt(latestRecord.bpDia) >= 90 ? "danger" : parseInt(latestRecord.bpSys) >= 120 ? "warn" : "good")}`}></span>
                  <span className="text-slate-500">{parseInt(latestRecord.bpSys) >= 140 || parseInt(latestRecord.bpDia) >= 90 ? "偏高，請留意" : parseInt(latestRecord.bpSys) >= 120 ? "血壓偏高" : "正常範圍"}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 mt-4">尚未記錄</p>
            )}
          </div>

          {/* BMI 卡片 */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚖️</span>
              <h4 className="font-medium text-slate-700 text-sm">身體質量指數</h4>
            </div>
            {bmi ? (
              <div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold text-slate-900">{bmi}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(bmi >= 27 ? "danger" : bmi >= 24 || bmi < 18.5 ? "warn" : "good")}`}></span>
                  <span className="text-slate-500">{bmi >= 27 ? "肥胖" : bmi >= 24 ? "過重" : bmi < 18.5 ? "過輕" : "健康體位"}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 mt-4">尚未計算</p>
            )}
          </div>

          {/* 飲水量卡片 */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💧</span>
              <h4 className="font-medium text-slate-700 text-sm">每日飲水目標</h4>
            </div>
            {waterGoal ? (
              <div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold text-slate-900">{waterGoal}</span>
                  <span className="text-xs text-slate-500 mb-1">ml</span>
                </div>
                <p className="text-xs text-slate-500">記得喝足水分！</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400 mt-4">尚未計算</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}