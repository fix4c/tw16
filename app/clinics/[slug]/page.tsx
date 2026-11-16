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

// 👇 关键：全角/半角统一 + NFC 正规化，消除编码差异
function normalizeText(name: string): string {
  return name
    .replace(/台/g, "臺")
    .normalize("NFC"); // 统一 Unicode 表示，避免 macOS/iOS 与 Windows 的编码差异
}

function getCountyFromAddress(address: string): string {
  if (!address) return "其他";
  const match = address.match(/^(.{2,3}[市縣])/);
  if (!match) return "其他";
  return normalizeText(match[1]);
}

// 👇 核心：彻底清洗科别，按空格、逗号、顿号、斜杠、分号分割
function cleanAndSplitSpecialty(value: string): string[] {
  if (!value) return [];
  // 把所有可能的分隔符统一替换为半角逗号，然后分割
  const normalized = value
    .replace(/[\s、，；;\/]/g, ",") // 空格、顿号、全角逗号、分号、斜杠 -> 半角逗号
    .replace(/,+/g, ","); // 多个连续逗号合并为一个

  return normalized
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && part.length < 10); // 过滤空值和过长的组合字符串
}

function getAllSpecialties(c: Clinic): string[] {
  const specs = new Set<string>();
  if (c.specialty) {
    cleanAndSplitSpecialty(c.specialty).forEach((s) => specs.add(s));
  }
  if (c.type) {
    cleanAndSplitSpecialty(c.type).forEach((s) => specs.add(s));
  }
  return Array.from(specs);
}

// 👇 关键：禁止运行期动态渲染，未生成的路径直接404，避免Cloudflare Worker干扰
export const dynamicParams = false;

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
    // 1. 县市页面（同时生成「臺」和「台」两个变体）
    params.push({ slug: county });
    if (county.includes("臺")) {
      params.push({ slug: county.replace(/臺/g, "台") });
    }

    // 2. 县市-科别页面（每个独立科别都生成，同样含两种变体）
    specs.forEach((spec) => {
      params.push({ slug: `${county}-${spec}` });
      if (county.includes("臺")) {
        params.push({ slug: `${county.replace(/臺/g, "台")}-${spec}` });
      }
    });
  });

  // 去重，避免重复生成
  const uniqueSlugs = Array.from(new Set(params.map((p) => p.slug)));
  return uniqueSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const [rawCounty, ...rawSpecs] = decodedSlug.split("-");
  const countyName = normalizeText(rawCounty);
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
  const countyName = normalizeText(rawCounty);
  const specialtyName = rawSpecs.join("-");

  // 1. 先过滤出该县市的所有诊所
  const countyClinics = clinics.filter((c) => getCountyFromAddress(c.address) === countyName);

  // 2. 如果有指定科别，再进一步过滤
  let finalClinics = countyClinics;
  if (specialtyName) {
    const targetSpec = specialtyName;
    finalClinics = countyClinics.filter((c) => {
      const specs = getAllSpecialties(c);
      // 使用宽松匹配，确保「眼科」能抓到「眼科」和「眼科專科診所」
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