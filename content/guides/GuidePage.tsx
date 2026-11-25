import Link from 'next/link';
import type { GuideEntry } from '@/lib/guides/types';
import type { GuideContent } from '@/lib/guides/types';
import { guideCategories, guides } from '@/lib/guides/manifest';

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

      <div className="prose prose-slate mt-8 max-w-none">{content.intro}</div>
      <div className="prose prose-slate mt-6 max-w-none">{content.body}</div>

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
            依科別找診所與醫院
          </h2>
          <div className="flex flex-wrap gap-2">
            {entry.departmentSlugs.map((d) => (
              <span key={d} className="flex items-center gap-1 text-sm">
                <Link
                  href={`/clinics?department=${d}`}
                  className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 hover:bg-blue-100"
                >
                  全台{departmentLabels[d] ?? d}診所
                </Link>
                <Link
                  href={`/hospitals?department=${d}`}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-100"
                >
                  醫院
                </Link>
              </span>
            ))}
          </div>
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