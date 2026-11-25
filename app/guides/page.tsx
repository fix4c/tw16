import type { Metadata } from 'next';
import Link from 'next/link';
import { guideCategories, guides } from '@/lib/guides/manifest';
import type { GuideCategory } from '@/lib/guides/types';

export const metadata: Metadata = {
  title: '就醫指南｜tw16.net 台灣醫療網',
  description:
    '從選院所、選科別、健保權益到看懂檢驗報告，tw16.net 就醫指南提供民眾真正用得上的就醫知識，並連結全台診所與醫院搜尋。',
  alternates: { canonical: 'https://tw16.net/guides' },
};

const categoryOrder: GuideCategory[] = [
  'process',
  'nhi-rights',
  'medication-safety',
  'report-reading',
  'special-groups',
  'chronic-disease',
];

export default function GuidesIndexPage() {
  const featured = guides.filter((g) => g.priority === 1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">就醫指南</h1>
      <p className="mt-3 text-slate-600">
        從選院所、選科別、健保權益到看懂檢驗報告，整理民眾真正用得上的就醫知識。每篇指南都可直接連結全台診所與醫院搜尋。
      </p>

      {featured.length > 0 && (
        <section className="mt-8 rounded-xl bg-blue-50 p-5">
          <h2 className="mb-3 font-bold text-slate-900">優先閱讀</h2>
          <ul className="space-y-2">
            {featured.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="font-medium text-blue-700 hover:underline"
                >
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {categoryOrder.map((cat) => {
        const list = guides.filter((g) => g.category === cat);
        if (list.length === 0) return null;
        return (
          <section key={cat} className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              {guideCategories[cat].label}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {guideCategories[cat].description}
            </p>
            <ul className="mt-4 space-y-3">
              {list.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="block rounded-lg border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/40"
                  >
                    <span className="font-medium text-slate-900">{g.title}</span>
                    <span className="mt-1 block text-sm text-slate-600">
                      {g.metaDescription}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}