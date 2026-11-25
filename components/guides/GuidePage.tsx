import Link from 'next/link';
import type { GuideContent, GuideEntry } from '@/lib/guides/types';
import { guideCategories, guides } from '@/lib/guides/manifest';

// 英文 slug → /clinics 能识别的中文科别名
const departmentLabels: Record<string, string> = {
  'family-medicine': '家庭醫學科',
  cardiology: '心臟內科',
  gastroenterology: '胃腸肝膽科',
  urology: '泌尿科',
  orthopedics: '骨科',
  dermatology: '皮膚科',
  pediatrics: '小兒科',
  psychiatry: '精神科',
  nephrology: '腎臟科',
  endocrinology: '內分泌暨新陳代謝科',
  'obstetrics-gynecology': '婦產科',
};

export function GuidePage({
  entry,
  content,
}: {
  entry: GuideEntry;
  content: GuideContent;
}) {
  const category = guideCategories[entry.category];
  const related =
    entry.relatedGuides
      ?.map((slug) => guides.find((g) => g.slug === slug))
      .filter((g): g is GuideEntry => Boolean(g)) ?? [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/guides" className="hover:underline">
          就醫指南
        </Link>
        <span className="mx-2">/</span>
        <span>{category.label}</span>
      </nav>

      <h1 className="text-3xl font-bold leading-tight text-slate-900">
        {entry.title}
      </h1>

      <div className="mt-6 rounded-xl bg-slate-50 p-5">
        <p className="mb-2 font-semibold text-slate-800">重點整理</p>
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          {content.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 leading-relaxed text-slate-700 [&_p]:my-3">
        {content.intro}
      </div>

      <div className="mt-6 leading-relaxed text-slate-700 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_p]:my-3 [&_ul]:my-3 [&_li]:my-1">
        {content.body}
      </div>

      {entry.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">常見問題</h2>
          <div className="space-y-3">
            {entry.faqs.map((faq, i) => (
              <details
                key={i}
                className="rounded-lg border border-slate-200 p-4"
              >
                <summary className="cursor-pointer font-medium text-slate-800">
                  {faq.q}
                </summary>
                <p className="mt-2 text-slate-700">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {entry.departmentSlugs && entry.departmentSlugs.length > 0 && (
        <section className="mt-12 rounded-xl border border-slate-200 p-5">
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            依科別找診所
          </h2>
          <div className="flex flex-wrap gap-2">
            {entry.departmentSlugs.map((d) => {
              const label = departmentLabels[d] ?? d;
              return (
                <Link
                  key={d}
                  href={`/clinics?department=${encodeURIComponent(label)}`}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100"
                >
                  全台{label}診所
                </Link>
              );
            })}
          </div>
          <Link
            href="/hospitals"
            className="mt-4 inline-block text-sm text-emerald-700 hover:underline"
          >
            → 或到醫院搜尋頁
          </Link>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 text-xl font-bold text-slate-900">延伸閱讀</h2>
          <ul className="space-y-2">
            {related.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="text-blue-700 hover:underline"
                >
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12 rounded-lg bg-amber-50 p-5 text-sm text-amber-900">
        <p className="font-semibold">醫療聲明</p>
        <p className="mt-1">
          本文資訊僅供就醫參考，不能取代醫師診斷與個別化建議。部分負擔金額、轉診與用藥規定以衛生福利部中央健康保險署及各醫療院所最新公告為準。
        </p>
      </section>
    </article>
  );
}