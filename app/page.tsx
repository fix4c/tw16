import Link from "next/link";
import rawData from "@/data/headlines.json";
import type { Headline, HeadlineFeed } from "@/lib/types";
import { Header } from "./components/Header";
import { HealthDashboard } from "./components/HealthDashboard"; // 👈 补上这行引入

const data = rawData as HeadlineFeed;

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TierBadge({ tier }: { tier: 1 | 2 | 3 }) {
  const config: Record<1 | 2 | 3, { label: string; className: string }> = {
    1: { label: "官方公告", className: "bg-blue-100 text-blue-800 border-blue-200" },
    2: { label: "醫學文獻", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    3: { label: "機構消息", className: "bg-amber-100 text-amber-800 border-amber-200" },
  };
  const c = config[tier];
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${c.className}`}>
      {c.label}
    </span>
  );
}

function HeadlineCard({ headline }: { headline: Headline }) {
  return (
    <article className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <TierBadge tier={headline.sourceTier} />
        <span className="text-xs font-medium text-slate-400">{headline.sourceName}</span>
      </div>
      <h3 className="font-serif text-xl font-bold text-slate-900 leading-snug mb-3">
        {headline.title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-5">{headline.summary}</p>
      <div className="bg-teal-50/70 border-l-2 border-teal-500 px-4 py-3 mb-5 mt-auto rounded-r-lg">
        <p className="text-sm text-teal-900 leading-relaxed">
          <span className="font-bold">為什麼與你有關：</span>
          {headline.whyItMatters}
        </p>
      </div>
      <a
        href={headline.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
      >
        查看原始出處 →
      </a>
    </article>
  );
}

function EntryIcon({ type }: { type: "hospital" | "clinic" | "news" }) {
  const paths = {
    hospital: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    clinic: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    news: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  };
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-blue-50/30 to-transparent pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
            從找醫院、找診所
            <br className="hidden md:block" />
            到讀懂每日醫療大事
          </h2>
          <p className="text-slate-600 max-w-2xl text-lg leading-relaxed">
            本站所有醫療資訊由 AI 從衛福部、疾管署、食藥署等公開權威來源自動聚合。零人工編輯，內容永遠反映第一手公告。
          </p>
        </div>
      </section>

      {/* 個人健康看板 */}
      <HealthDashboard />

      {/* 三大入口 */}
      <section className="max-w-5xl mx-auto px-6 pb-12 w-full">
        <div className="grid md:grid-cols-3 gap-5">
          <Link href="/hospitals" className="group bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-7 hover:bg-white hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <EntryIcon type="hospital" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">醫院掛號</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">全台醫學中心與區域醫院的官方網路掛號入口</p>
            <span className="mt-auto text-sm font-semibold text-teal-600 flex items-center gap-1 group-hover:gap-2 transition-all">前往 <span>→</span></span>
          </Link>
          
          <Link href="/clinics" className="group bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-7 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <EntryIcon type="clinic" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">診所查找</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">健保特約診所依縣市與科別篩選，資料每日更新</p>
            <span className="mt-auto text-sm font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">前往 <span>→</span></span>
          </Link>
          
          <Link href="#today" className="group bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl p-7 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <EntryIcon type="news" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">今日醫療資訊</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">每日自動彙整三大官方機關的最新公告</p>
            <span className="mt-auto text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">查看 <span>→</span></span>
          </Link>
        </div>
      </section>

      {/* 醫療小幫手直達 */}
      <section className="max-w-5xl mx-auto px-6 pb-6 w-full">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-xl flex items-center justify-between flex-wrap gap-6 border border-slate-700/50 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-teal-500/20 blur-3xl rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3">不知道該看哪一科？</h3>
            <p className="text-slate-300 text-lg">透過簡單點選，互動式醫療小幫手幫您釐清症狀，給出建議。</p>
          </div>
          <Link
            href="/tools/symptoms"
            className="relative z-10 px-8 py-3.5 bg-teal-500 text-white font-bold rounded-full hover:bg-teal-400 hover:scale-105 transition-all whitespace-nowrap shadow-lg shadow-teal-500/30"
          >
            開始評估 →
          </Link>
        </div>
      </section>

      {/* 健康工具專區 */}
      <section className="max-w-5xl mx-auto px-6 pb-12 w-full">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-slate-900 mb-6">免費健康管理小工具</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/tools/bmi" className="group p-4 rounded-2xl bg-teal-50 hover:bg-teal-100 transition-colors border border-teal-100 flex flex-col items-center text-center">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚖️</span>
              <span className="font-bold text-teal-900 text-sm">BMI 計算</span>
              <span className="text-xs text-teal-600 mt-1">了解體位狀態</span>
            </Link>
            <Link href="/tools/water" className="group p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100 flex flex-col items-center text-center">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💧</span>
              <span className="font-bold text-blue-900 text-sm">飲水量計算</span>
              <span className="text-xs text-blue-600 mt-1">每日該喝多少水</span>
            </Link>
            <Link href="/tools/health-tracker" className="group p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-100 flex flex-col items-center text-center">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🩺</span>
              <span className="font-bold text-rose-900 text-sm">三高記錄表</span>
              <span className="text-xs text-rose-600 mt-1">血壓血糖追蹤</span>
            </Link>
            <Link href="/tools/symptoms" className="group p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-100 flex flex-col items-center text-center">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔍</span>
              <span className="font-bold text-indigo-900 text-sm">症狀查科別</span>
              <span className="text-xs text-indigo-600 mt-1">該看哪一科？</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 今日醫療資訊 */}
      <section id="today" className="max-w-5xl mx-auto px-6 pt-10 pb-16 w-full border-t border-slate-200/60">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-1 w-8 bg-teal-500 rounded-full"></span>
          <p className="text-xs font-bold tracking-widest text-teal-700 uppercase">今日台灣醫療大事</p>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-3">
          每天清晨，為你篩選最值得知道的醫療資訊
        </h2>
        <p className="text-sm text-slate-500 mb-8">
          最後自動更新：{formatDateTime(data.lastUpdated)}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {data.headlines.map((h) => (
            <HeadlineCard key={h.id} headline={h} />
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 text-xs text-slate-500 leading-relaxed">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-medium">
            <span>🏆</span>
            <span>本站入圍衛福部 2006 年度優良健康資訊網站</span>
          </div>
          <p className="mb-2 font-semibold text-slate-700">重要聲明</p>
          <p className="mb-4">
            本站不提供醫療診斷或治療建議。所有內容由 AI 從公開權威來源自動聚合，僅供資訊導覽參考。任何健康問題請諮詢醫師或撥打 1922 防疫專線、1995 安心專線。
          </p>
          <p className="text-slate-400">
            © {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站
          </p>
        </div>
      </footer>
    </main>
  );
}