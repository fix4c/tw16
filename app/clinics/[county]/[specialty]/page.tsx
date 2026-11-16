import type { Metadata } from "next";
import Link from "next/link";
import rawData from "@/data/clinics.json";
import { Header } from "../../../components/Header";

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

function getAllSpecialties(c: Clinic): string[] {
  const specs = new Set<string>();
  const addIfValid = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && trimmed.length < 10 && !trimmed.includes(" ")) {
      specs.add(trimmed);
    }
  };
  if (c.specialty) c.specialty.split(/[、,，/]/).forEach(addIfValid);
  if (c.type) addIfValid(c.type);
  return Array.from(specs);
}

export async function generateStaticParams() {
  const params: { county: string; specialty: string }[] = [];
  const countyMap = new Map<string, Set<string>>();

  clinics.forEach((c) => {
    const county = getCountyFromAddress(c.address);
    if (county === "其他") return;

    if (!countyMap.has(county)) countyMap.set(county, new Set());
    getAllSpecialties(c).forEach((spec) => countyMap.get(county)!.add(spec));
  });

  countyMap.forEach((specs, county) => {
    specs.forEach((spec) => {
      params.push({
        county: county, // ✅ 返回未編碼的中文
        specialty: spec, // ✅ 返回未編碼的中文
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ county: string; specialty: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const countyName = decodeURIComponent(resolvedParams.county);
  const specialtyName = decodeURIComponent(resolvedParams.specialty);
  
  return {
    title: `${countyName}${specialtyName}診所推薦 | 台灣醫療入口`,
    description: `為您整理${countyName}所有${specialtyName}相關的健保特約診所與醫院。包含地址、電話與看診資訊，幫助您快速找到合適的醫療資源。`,
  };
}

export default async function SpecialtyClinicsPage({ params }: { params: Promise<{ county: string; specialty: string }> }) {
  const resolvedParams = await params;
  const countyName = decodeURIComponent(resolvedParams.county);
  const specialtyName = decodeURIComponent(resolvedParams.specialty);

  const filteredClinics = clinics.filter((c) => {
    if (getCountyFromAddress(c.address) !== countyName) return false;
    const specs = getAllSpecialties(c);
    return specs.some((s) => s.includes(specialtyName) || specialtyName.includes(s));
  });

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
            <span>/</span>
            <span className="text-teal-700 font-bold">{specialtyName}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            {countyName} {specialtyName}
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            共收錄 {filteredClinics.length} 家相關機構。資料來自健保署開放資料平台，每日更新。
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-8 w-full flex-1">
        <div className="grid md:grid-cols-2 gap-4">
          {filteredClinics.map((c, i) => (
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
        
        {filteredClinics.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p>目前資料庫中沒有符合條件的機構。</p>
          </div>
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