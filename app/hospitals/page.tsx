import type { Metadata } from "next";
import Link from "next/link";
import rawData from "@/data/hospitals.json";

export const metadata: Metadata = {
  title: "醫院掛號導航 | 台灣醫療入口",
  description:
    "全台主要醫學中心與區域醫院的官方網路掛號直達入口，按地區與醫院層級篩選，一鍵前往官方掛號頁面。",
};

type Hospital = {
  id: string;
  name: string;
  level: string;
  region: string;
  address: string;
  phone: string;
  registrationUrl: string;
};

const hospitals = (rawData as { hospitals: Hospital[] }).hospitals;

const regions = ["全部", ...new Set(hospitals.map((h) => h.region))];
const levels = ["全部", ...new Set(hospitals.map((h) => h.level))];

export default function HospitalsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl font-bold text-neutral-900 hover:text-teal-700 transition-colors"
          >
            ← 台灣醫療入口
          </Link>
          <span className="text-xs text-neutral-500">醫院掛號導航</span>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-10 pb-6 w-full">
        <p className="text-xs font-medium tracking-widest text-teal-700 mb-3">
          醫院掛號導航
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-4">
          找到醫院，直達官方掛號
        </h1>
        <p className="text-neutral-600 leading-relaxed max-w-2xl">
          本站不代掛號，只提供全台主要醫院的官方網路掛號入口。選擇地區與醫院層級，一鍵前往該院掛號頁面。
        </p>
      </section>

      {/* 篩選器（純前端表單，無需 JavaScript 交互即可用 GET 參數實現，但此處先做靜態展示，後續可加交互） */}
      <section className="max-w-5xl mx-auto px-6 pb-8 w-full">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-neutral-500 py-1.5">地區：</span>
            {regions.map((r) => (
              <span
                key={r}
                className="px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-full text-neutral-700"
              >
                {r}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-neutral-500 py-1.5">層級：</span>
            {levels.map((l) => (
              <span
                key={l}
                className="px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-full text-neutral-700"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-neutral-400 mt-2">
          （篩選功能將在下一階段加入互動）
        </p>
      </section>

      {/* 醫院列表 */}
      <section className="max-w-5xl mx-auto px-6 pb-16 w-full grid md:grid-cols-2 gap-4">
        {hospitals.map((h) => (
          <article
            key={h.id}
            className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                {h.level}
              </span>
              <span className="text-xs text-neutral-500">{h.region}</span>
            </div>
            <h2 className="font-serif text-lg font-semibold text-neutral-900 mb-1">
              {h.name}
            </h2>
            <p className="text-sm text-neutral-600 mb-1">{h.address}</p>
            <p className="text-sm text-neutral-500 mb-4">電話：{h.phone}</p>
            <a
              href={h.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors"
            >
              前往官方掛號 →
            </a>
          </article>
        ))}
      </section>

      <footer className="border-t border-neutral-200 bg-neutral-100 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-neutral-500">
          <p className="mb-2">
            本站僅提供掛號入口連結，不代為掛號、不處理個人醫療資料。掛號規則與看診時間請以各醫院官網公告為準。
          </p>
          <p>© {new Date().getFullYear()} tw16.net · 非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}