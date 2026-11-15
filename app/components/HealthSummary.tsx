"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Record = {
  id: string;
  date: string;
  bpSys: string;
  bpDia: string;
  sugar: string;
};

export function HealthSummary() {
  const [latestBp, setLatestBp] = useState<string | null>(null);
  const [latestSugar, setLatestSugar] = useState<string | null>(null);
  const [bmi, setBmi] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. 讀取三高紀錄
    const savedRecords = localStorage.getItem("tw16-health-records");
    if (savedRecords) {
      try {
        const records: Record[] = JSON.parse(savedRecords);
        if (records.length > 0) {
          // 假設第一筆就是最新的一筆
          const latest = records[0];
          if (latest.bpSys && latest.bpDia) {
            setLatestBp(`${latest.bpSys}/${latest.bpDia}`);
          }
          if (latest.sugar) {
            setLatestSugar(latest.sugar);
          }
        }
      } catch (e) {}
    }

    // 2. 讀取 BMI 紀錄 (如果之前的 BMI 頁面有存 localStorage 的話，若無則略過)
    // 假設我們未來在 BMI 頁面儲存了名為 "tw16-bmi" 的 key
    const savedBmi = localStorage.getItem("tw16-bmi");
    if (savedBmi) {
      setBmi(savedBmi);
    }

    setIsLoaded(true);
  }, []);

  // 如果沒有載入完成，或是沒有任何紀錄，就不顯示這個區塊
  if (!isLoaded || (!latestBp && !latestSugar && !bmi)) {
    return null;
  }

  return (
    <section className="max-w-5xl mx-auto px-6 pb-6 w-full">
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-wrap gap-6 items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">我的健康摘要</h3>
          <p className="text-sm text-slate-500 mb-4">根據您在本站工具中儲存的紀錄，這是您的最新狀態：</p>
          
          <div className="flex flex-wrap gap-4">
            {latestBp && (
              <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <span className="text-xs text-slate-400 mb-1">最近血壓</span>
                <span className="text-lg font-bold text-teal-700">{latestBp} <span className="text-xs font-normal text-slate-500">mmHg</span></span>
              </div>
            )}
            {latestSugar && (
              <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <span className="text-xs text-slate-400 mb-1">最近血糖</span>
                <span className="text-lg font-bold text-teal-700">{latestSugar} <span className="text-xs font-normal text-slate-500">mg/dL</span></span>
              </div>
            )}
            {bmi && (
              <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <span className="text-xs text-slate-400 mb-1">BMI 數值</span>
                <span className="text-lg font-bold text-teal-700">{bmi}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/tools/health-tracker"
            className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors text-center"
          >
            更新三高紀錄
          </Link>
        </div>
      </div>
    </section>
  );
}