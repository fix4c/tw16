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
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${c.className}`}
    >
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
      <h2 className="font-serif text-xl font-semibold text-neutral-900 leading-snug mb-3">
        {headline.title}
      </h2>
      <p className="text-sm text-neutral-700 leading-relaxed mb-4">
        {headline.summary}
      </p>
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

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-neutral-900">
              台灣醫療入口
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              由 AI 自動策展的權威醫療資訊導航
            </p>
          </div>
          <Link
            href="/about"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            關於本站
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8 w-full">
        <p className="text-xs font-medium tracking-widest text-teal-700 mb-3">
          今日台灣醫療大事
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 leading-tight mb-4">
          每天清晨，為你篩選
          <br className="hidden md:block" />
          最值得知道的醫療資訊
        </h2>
        <p className="text-neutral-600 max-w-2xl leading-relaxed">
          本站不生產內容，所有資訊由 AI 從衛福部、疾管署、健保署等公開權威來源自動聚合。
          零人工編輯，內容永遠反映第一手公告。
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 w-full grid md:grid-cols-3 gap-6">
        {data.headlines.map((h) => (
          <HeadlineCard key={h.id} headline={h} />
        ))}
      </section>

      <section className="border-t border-neutral-200 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
          <span>最後自動更新：{formatDateTime(data.lastUpdated)}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            自動化流水線運作中
          </span>
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-8 text-xs text-neutral-600 leading-relaxed">
          <p className="mb-2 font-semibold text-neutral-700">重要聲明</p>
          <p className="mb-4">
            本站不提供醫療診斷或治療建議。所有內容由 AI
            從公開權威來源自動聚合，僅供資訊導覽參考。任何健康問題請諮詢醫師或撥打
            1922 防疫專線、1995 安心專線。
          </p>
          <p className="text-neutral-400">
            © {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站
          </p>
        </div>
      </footer>
    </main>
  );
}