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

function normalizeCountyName(name: string): string {
  return name.replace(/台/g, "臺");
}

function getCountyFromAddress(address: string): string {
  if (!address) return "其他";
  const match = address.match(/^(.{2,3}[市縣])/);
  if (!match) return "其他";
  return normalizeCountyName(match[1]);
}

// 👇 終極無敵清洗函數：解決「眼 科」與「內科 外科」的混淆
function getAllSpecialties(c: Clinic): string[] {
  const specs = new Set<string>();

  const addValid = (s: string) => {
    const cleaned = s.trim();
    if (cleaned && cleaned.length < 10) {
      specs.add(cleaned);
    }
  };

  const process = (value: string) => {
    if (!value) return;
    
    // 1. 先用逗號、頓號等標點分割
    value.split(/[、,，；;\/]/).forEach(seg => {
      const trimmed = seg.trim();
      if (!trimmed) return;
      
      // 2. 嘗試按空格分割
      const words = trimmed.split(/\s+/);
      if (words.length > 1) {
        // 如果有任何一個詞長度是 1（如「眼 科」），代表這是排版錯誤，直接合併
        const hasShortWord = words.some(w => w.length === 1);
        if (hasShortWord) {
          addValid(trimmed.replace(/\s+/g, "")); // 合併成「眼科」
        } else {
          // 否則代表這是兩個不同的科別（如「內科 外科」），分別加入
          words.forEach(w => addValid(w));
          // 同時，為了保險，也把合併版加進去
          addValid(trimmed.replace(/\s+/g, ""));
        }
      } else {
        addValid(trimmed);
      }
    });
  };

  process(c.specialty);
  process(c.type);

  return Array.from(specs);
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  const countyMap = new Map<string, Set<string>>();

  clinics.forEach((c) => {
    const county = getCountyFromAddress(c.address);
    if (county === "其他") return;

    if (!countyMap.has(county)) countyMap.set(county, new Set());
    getAllSpecialties(c).forEach((spec) => countyMap.get(county)!.add(spec));
  });

  countyMap.forEach((specs, county) => {
    // 縣市頁面
    params.push({ slug: county });
    if (county.includes("臺")) {
      params.push({ slug: county.replace(/臺/g, "台") });
    }

    // 縣市-科別頁面
    specs.forEach((spec) => {
      params.push({ slug: `${county}-${spec}` });
      if (county.includes("臺")) {
        params.push({ slug: `${county.replace(/臺/g, "台")}-${spec}` });
      }
    });
  });

  const uniqueSlugs = Array.from(new Set(params.map((p) => p.slug)));
  return uniqueSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const [rawCounty, ...rawSpecs] = decodedSlug.split("-");
  const countyName = normalizeCountyName(rawCounty);
  const specialtyName = rawSpecs.join("-");

  if (specialtyName) {
    return {
      title: `${countyName}${specialtyName}診所推薦 | 台灣醫療入口`,
      description: `為您整理${countyName}所有${specialtyName}相關的健保特約診所與醫院。包含地址、電話與看診資訊。`,
    };
  }
  return {
    title: `${countyName}診所與醫院推薦 | 台灣醫療入口`,
    description: `收錄${countyName}所有健保特約診所與醫院。提供診所地址、電話與科別查詢，幫助您快速找到附近的醫療資源。`,
  };
}

export default async function ClinicLocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  
  const [rawCounty, ...rawSpecs] = decodedSlug.split("-");
  const countyName = normalizeCountyName(rawCounty);
  const specialtyName = rawSpecs.join("-");

  const countyClinics = clinics.filter((c) => getCountyFromAddress(c.address) === countyName);

  let finalClinics = countyClinics;
  if (specialtyName) {
    const targetSpec = specialtyName.replace(/\s+/g, ""); // 比對前也去空格
    finalClinics = countyClinics.filter((c) => {
      const specs = getAllSpecialties(c);
      return specs.some((s) => s.includes(targetSpec) || targetSpec.includes(s));
    });
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="relative overflow-hidden w-full border-b border-slate-100/50">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/40 to-transparent pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/clinics" className="hover:text-teal-600">院所查詢</Link>
            <span>/</span>
            <Link href={`/clinics/${encodeURIComponent(countyName)}`} className="hover:text-teal-600">{countyName}</Link>
            {specialtyName && (
              <>
                <span>/</span>
                <span className="text-teal-700 font-bold">{specialtyName}</span>
              </>
            )}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            {countyName} {specialtyName || "診所與醫院"}
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            共收錄 {finalClinics.length} 家相關機構。資料來自健保署開放資料平台，每日更新。
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-8 w-full flex-1">
        {!specialtyName && (
          <div className="mb-8 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-500 mb-3">🩺 依科別瀏覽 {countyName} 診所</p>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(countyClinics.flatMap((c) => getAllSpecialties(c)))).map((spec) => (
                <Link
                  key={spec}
                  href={`/clinics/${encodeURIComponent(`${countyName}-${spec}`)}`}
                  className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-700 transition-colors"
                >
                  {spec}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {finalClinics.slice(0, 100).map((c, i) => (
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
        
        {finalClinics.length > 100 && (
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