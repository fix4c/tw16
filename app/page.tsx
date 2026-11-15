import { AdPlaceholder } from "./AdPlaceholder";
import Link from "next/link";
import rawData from "@/data/headlines.json";
import type { Headline, HeadlineFeed } from "@/lib/types";

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
    <article className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <TierBadge tier={headline.sourceTier} />
        <span className="text-xs text-neutral-500">{headline.sourceName}</span>
      </div>
      <h3 className="font-serif text-xl font-semibold text-neutral-900 leading-snug mb-3">
        {headline.title}
      </h3>
      <p className="text-sm text-neutral-700 leading-relaxed mb-4">{headline.summary}</p>
      <div className="bg-teal-50 border-l-2 border-teal-500 px-4 py-2 mb-4 mt-auto">
        <p className="text-sm text-teal-900 leading-relaxed">
          <span className="font-semibold">為什麼與你有關：</span>
          {headline.whyItMatters}
        </p>
      </div>
      <a
        href={headline.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-blue-700 hover:underline"
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
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
<Link href="/" className="flex items-center gap-2">
  <img src="/logo.png" alt="台灣醫療網" className="h-10 md:h-12 w-auto object-contain" />
</Link>
          <nav className="flex items-center gap-4 md:gap-6 text-sm">
            <Link href="/hospitals" className="text-neutral-500 hover:text-teal-700 transition-colors">醫院掛號</Link>
            <Link href="/clinics" className="text-neutral-500 hover:text-teal-700 transition-colors">院所查詢</Link>
            <Link href="/tools/symptoms" className="font-medium text-teal-700">症狀查科別</Link>
            <Link href="/tools/bmi" className="text-neutral-500 hover:text-teal-700 transition-colors">BMI計算</Link>
            <Link href="/guides" className="text-neutral-500 hover:text-teal-700 transition-colors">就醫指南</Link>
          </nav>
        </div>
      </header>

      {/* 頂部橫幅廣告 */}
      <AdPlaceholder type="banner" />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8 w-full">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-4">
          從找醫院、找診所
          <br className="hidden md:block" />
          到讀懂每日醫療大事
        </h2>
        <p className="text-neutral-600 max-w-2xl leading-relaxed">
          本站不生產內容，所有醫療資訊由 AI 從衛福部、疾管署、食藥署等公開權威來源自動聚合。零人工編輯，內容永遠反映第一手公告。
        </p>
      </section>

      {/* 三大入口 */}
      <section className="max-w-5xl mx-auto px-6 pb-12 w-full">
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/hospitals"
            className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all flex flex-col"
          >
            <div className="text-teal-600 mb-4"><EntryIcon type="hospital" /></div>
            <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-2">醫院掛號</h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              全台醫學中心與區域醫院的官方網路掛號入口
            </p>
            <span className="mt-auto text-sm font-medium text-teal-700 group-hover:underline">前往 →</span>
          </Link>
          <Link
            href="/clinics"
            className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all flex flex-col"
          >
            <div className="text-teal-600 mb-4"><EntryIcon type="clinic" /></div>
            <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-2">診所查找</h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              健保特約診所依縣市與科別篩選，資料每日更新
            </p>
            <span className="mt-auto text-sm font-medium text-teal-700 group-hover:underline">前往 →</span>
          </Link>
          <Link
            href="#today"
            className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all flex flex-col"
          >
            <div className="text-teal-600 mb-4"><EntryIcon type="news" /></div>
            <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-2">今日醫療資訊</h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              每日自動彙整三大官方機關的最新公告
            </p>
            <span className="mt-auto text-sm font-medium text-teal-700 group-hover:underline">查看 →</span>
          </Link>
        </div>
      </section>

      {/* 今日醫療資訊 */}
      <section id="today" className="max-w-5xl mx-auto px-6 pt-8 pb-8 w-full border-t border-neutral-200">
        <p className="text-xs font-medium tracking-widest text-teal-700 mb-3">今日台灣醫療大事</p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 leading-tight mb-2">
          每天清晨，為你篩選最值得知道的醫療資訊
        </h2>
        <p className="text-sm text-neutral-500 mb-6">
          最後自動更新：{formatDateTime(data.lastUpdated)}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {data.headlines.map((h) => (
            <HeadlineCard key={h.id} headline={h} />
          ))}
        </div>
      </section>

      {/* 醫療小幫手直達 */}
      <section className="max-w-5xl mx-auto px-6 pb-6 w-full">
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl p-8 text-white shadow-lg flex items-center justify-between flex-wrap gap-6">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-2">不知道該看哪一科？</h3>
            <p className="text-teal-100">透過簡單點選，互動式醫療小幫手幫您釐清症狀，給出建議。</p>
          </div>
          <Link
            href="/tools/assistant"
            className="px-6 py-3 bg-white text-teal-800 font-bold rounded-full hover:bg-teal-50 transition-colors whitespace-nowrap shadow-sm"
          >
            開始評估 →
          </Link>
        </div>
      </section>

      {/* 健康小工具直達 */}
      <section className="max-w-5xl mx-auto px-6 pb-12 w-full">
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-teal-900 mb-1">計算你的 BMI 身體質量指數</h3>
            <p className="text-sm text-teal-700">輸入身高體重，快速了解目前的體位狀態。</p>
          </div>
          <Link
            href="/tools/bmi"
            className="px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors whitespace-nowrap"
          >
            立即計算 →
          </Link>
        </div>
      </section>      

      {/* 內容底部矩形廣告 */}
      <section className="max-w-5xl mx-auto px-6 pb-12 w-full">
        <AdPlaceholder type="box" />
      </section>

      <footer className="border-t border-neutral-200 bg-neutral-100 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 text-xs text-neutral-600 leading-relaxed">
          <p className="mb-2 font-semibold text-neutral-700">重要聲明</p>
          <p className="mb-4">
            本站不提供醫療診斷或治療建議。所有內容由 AI 從公開權威來源自動聚合，僅供資訊導覽參考。任何健康問題請諮詢醫師或撥打 1922 防疫專線、1995 安心專線。
          </p>
          <p className="text-neutral-400">
            © {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站
          </p>
        </div>
      </footer>
    </main>
  );
}