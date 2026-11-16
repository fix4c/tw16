import type { Metadata } from "next";
import Link from "next/link";
import rawData from "@/data/clinics.json";
import { Header } from "../../components/Header";

type Clinic = {
  name: string;
  type: string;
  address: string;
  phone: string;
  specialty: string;
};

const clinics = (rawData as { clinics: Clinic[] }).clinics;

function getCountyFromAddress(address: string): string {
  if (!address) return "其他";
  const match = address.match(/^(.{2,3}[市縣])/);
  return match ? match[1] : "其他";
}

export async function generateStaticParams() {
  const countySet = new Set<string>();
  clinics.forEach((c) => {
    const county = getCountyFromAddress(c.address);
    if (county !== "其他") countySet.add(county);
  });

  return Array.from(countySet).map((county) => ({
    county: county, // 未编码，保持中文
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ county: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const countyName = decodeURIComponent(resolvedParams.county);
  
  return {
    title: `${countyName}診所與醫院推薦 | 台灣醫療入口`,
    description: `收錄${countyName}所有健保特約診所與醫院。提供診所地址、電話與科別查詢，幫助您快速找到附近的醫療資源。`,
  };
}

export default async function CountyClinicsPage({ params }: { params: Promise<{ county: string }> }) {
  const resolvedParams = await params;
  const countyName = decodeURIComponent(resolvedParams.county);

  const countyClinics = clinics.filter((c) => getCountyFromAddress(c.address) === countyName);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="relative overflow-hidden w-full border-b border-slate-100/50">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-8">
          <p className="text-xs font-bold tracking-widest text-blue-700 mb-3 uppercase">地區導航</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            {countyName} 診所與醫院
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            共收錄 {countyClinics.length} 家健保特約機構。資料來自健保署開放資料平台，每日更新。
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-8 w-full flex-1">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/clinics" className="text-sm font-bold text-teal-600 hover:underline">
            ← 返回全台搜尋
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {countyClinics.slice(0, 100).map((c, i) => (
            <article key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                {c.type && (
                  <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                    {c.type}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">{c.name}</h3>
              <p className="text-sm text-slate-600 mt-2">{c.address}</p>
              <p className="text-sm text-slate-500 mt-1">電話：{c.phone || "—"}</p>
              {c.specialty && (
                <p className="text-xs font-medium text-blue-600 mt-3 bg-blue-50 inline-block px-2 py-1 rounded-md">
                  科別：{c.specialty}
                </p>
              )}
            </article>
          ))}
        </div>
        
        {countyClinics.length > 100 && (
          <p className="text-center text-sm text-slate-400 mt-8">
            僅顯示前 100 筆，請使用上方「返回全台搜尋」進行更精準的篩選。
          </p>
        )}
      </section>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-slate-500 text-center">
          <p>© {new Date().getFullYear()} tw16.net · 本站為非營利資訊導航站</p>
        </div>
      </footer>
    </main>
  );
}