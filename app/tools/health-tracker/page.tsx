"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "../../components/Header";
import { ToolNav } from "../../components/ToolNav";
import { TrendChart } from "@/components/tracker/TrendChart";

type Record = {
  id: string;
  date: string;
  bpSys: string;
  bpDia: string;
  sugar: string;
};

const CONDITION_OPTIONS = [
  { key: "hypertension", label: "高血壓" },
  { key: "diabetes", label: "糖尿病" },
  { key: "liver", label: "肝臟相關" },
  { key: "kidney", label: "腎臟相關" },
];

export default function HealthTrackerPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [form, setForm] = useState({ date: "", bpSys: "", bpDia: "", sugar: "" });
  const [conditions, setConditions] = useState<string[]>([]);

  // 載入本地儲存的紀錄
  useEffect(() => {
    const saved = localStorage.getItem("tw16-health-records");
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {}
    }
    // 載入健康狀況
    const savedCond = localStorage.getItem("tw16-health-conditions");
    if (savedCond) {
      try {
        setConditions(JSON.parse(savedCond));
      } catch (e) {}
    }
    // 預設帶入今天日期
    const today = new Date().toISOString().split("T")[0];
    setForm(prev => ({ ...prev, date: today }));
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date) return;

    const newRecord: Record = {
      id: Date.now().toString(),
      date: form.date,
      bpSys: form.bpSys,
      bpDia: form.bpDia,
      sugar: form.sugar,
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem("tw16-health-records", JSON.stringify(updated));

    // 清空血壓血糖欄位，保留日期
    setForm({ date: form.date, bpSys: "", bpDia: "", sugar: "" });
  };

  const handleDelete = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem("tw16-health-records", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (confirm("確定要清除所有紀錄嗎？此動作無法復原。")) {
      setRecords([]);
      localStorage.removeItem("tw16-health-records");
    }
  };

  const toggleCondition = (key: string) => {
    const updated = conditions.includes(key)
      ? conditions.filter((c) => c !== key)
      : [...conditions, key];
    setConditions(updated);
    localStorage.setItem("tw16-health-conditions", JSON.stringify(updated));
  };

  // 趨勢資料：依日期排序，過濾空值
  const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const bpData = sortedRecords
    .filter((r) => r.bpSys && !isNaN(Number(r.bpSys)))
    .map((r) => ({ date: r.date, value: Number(r.bpSys) }));
  const sugarData = sortedRecords
    .filter((r) => r.sugar && !isNaN(Number(r.sugar)))
    .map((r) => ({ date: r.date, value: Number(r.sugar) }));

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="relative overflow-hidden w-full border-b border-slate-100/50">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/40 to-transparent pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-8">
          <p className="text-xs font-bold tracking-widest text-teal-700 mb-3 uppercase">健康管理</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            三高自我管理記錄表
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-3xl">
            記錄您每日的血壓與血糖。所有資料僅保存在您的瀏覽器中，不會上傳至伺服器，保障您的隱私安全。
          </p>
          <ToolNav />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-8 w-full flex-1 grid md:grid-cols-3 gap-8">
        {/* 左側輸入表單 */}
        <div className="md:col-span-1">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
            <h2 className="font-serif text-xl font-bold text-slate-900 mb-4">新增紀錄</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">測量日期</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">收縮壓 (mmHg)</label>
                  <input
                    type="number"
                    value={form.bpSys}
                    onChange={(e) => setForm({ ...form, bpSys: e.target.value })}
                    placeholder="120"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">舒張壓 (mmHg)</label>
                  <input
                    type="number"
                    value={form.bpDia}
                    onChange={(e) => setForm({ ...form, bpDia: e.target.value })}
                    placeholder="80"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">血糖 (mg/dL，選填)</label>
                <input
                  type="number"
                  value={form.sugar}
                  onChange={(e) => setForm({ ...form, sugar: e.target.value })}
                  placeholder="例如：95"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors mt-2"
              >
                儲存紀錄
              </button>
            </form>

            {/* 新增：我的健康狀況 */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-700 mb-1">我的健康狀況（選填）</p>
              <p className="text-xs text-slate-400 mb-3">
                勾選後，首頁新聞若與您的狀況相關，會加上提示標籤。
              </p>
              <div className="space-y-1.5">
                {CONDITION_OPTIONS.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={conditions.includes(key)}
                      onChange={() => toggleCondition(key)}
                      className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
              💡 小提醒：測量血壓前請先安靜休息 5 分鐘，並保持坐姿端正。
            </div>
          </div>
        </div>

        {/* 右側紀錄列表 */}
        <div className="md:col-span-2">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-bold text-slate-900">歷史紀錄</h2>
              {records.length > 0 && (
                <button onClick={handleClearAll} className="text-xs text-red-500 hover:underline">
                  清除全部
                </button>
              )}
            </div>

            {/* 新增：趨勢圖（各項 ≥2 筆才顯示） */}
            {(bpData.length >= 2 || sugarData.length >= 2) && (
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {bpData.length >= 2 && (
                  <TrendChart data={bpData} label="收縮壓" unit="mmHg" />
                )}
                {sugarData.length >= 2 && (
                  <TrendChart data={sugarData} label="血糖" unit="mg/dL" />
                )}
              </div>
            )}

            {records.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p>目前沒有紀錄</p>
                <p className="text-sm mt-2">請從左側表單新增第一筆資料</p>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-700 mb-1">{r.date}</p>
                      <div className="flex gap-4 text-sm">
                        {r.bpSys && r.bpDia && (
                          <span className="text-slate-600">
                            血壓：<span className="font-medium text-slate-900">{r.bpSys}/{r.bpDia}</span> mmHg
                          </span>
                        )}
                        {r.sugar && (
                          <span className="text-slate-600">
                            血糖：<span className="font-medium text-slate-900">{r.sugar}</span> mg/dL
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-slate-400 hover:text-red-500 p-2"
                      title="刪除"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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