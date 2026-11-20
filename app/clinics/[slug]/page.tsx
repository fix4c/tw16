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

/* ============================================================
 * 科別白名單（與 clinics/page.tsx 完全一致）
 * ============================================================ */
const DEPT_ORDER = [
  "不分科", "家醫科", "內科", "外科", "兒科", "婦產科", "骨科", "泌尿科",
  "耳鼻喉科", "眼科", "皮膚科", "神經科", "精神科", "復健科",
  "整形外科", "職業醫學科", "洗腎科", "牙科", "中醫一般科",
];
const STANDARD_DEPTS = new Set(DEPT_ORDER);

const DEPT_EXCLUDE = [
  "神經外科", "急診", "重症", "麻醉", "放射線", "放射診斷", "放射腫瘤",
  "病理", "核子醫學", "結核",
];

const DEPT_KEYWORDS: [string, string][] = [
  ["中醫", "中醫一般科"],
  ["特殊需求者口腔", "牙科"], ["家庭牙醫", "牙科"], ["兒童牙", "牙科"],
  ["牙體復形", "牙科"], ["齒顎矯正", "牙科"], ["贋復補綴", "牙科"],
  ["牙周病", "牙科"], ["牙髓病", "牙科"], ["口腔顎面", "牙科"],
  ["口腔診斷", "牙科"], ["牙醫", "牙科"], ["牙科", "牙科"],
  ["口腔", "牙科"], ["牙", "牙科"],
  ["心臟血管外科", "外科"], ["胸腔外科", "外科"], ["大腸直腸", "外科"],
  ["消化外科", "外科"], ["一般外科", "外科"],
  ["心臟", "內科"], ["胃腸", "內科"], ["肝膽", "內科"], ["胸腔內", "內科"],
  ["風濕", "內科"], ["免疫", "內科"], ["血液", "內科"], ["內分泌", "內科"],
  ["新陳代謝", "內科"], ["感染", "內科"],
  ["耳鼻喉", "耳鼻喉科"],
  ["婦產", "婦產科"], ["婦科", "婦產科"], ["產科", "婦產科"],
  ["復健", "復健科"],
  ["精神", "精神科"], ["身心", "精神科"],
  ["神經", "神經科"],
  ["皮膚", "皮膚科"],
  ["眼科", "眼科"],
  ["泌尿", "泌尿科"],
  ["骨科", "骨科"], ["骨外科", "骨科"],
  ["小兒", "兒科"], ["兒科", "兒科"],
  ["家醫", "家醫科"], ["家庭醫", "家醫科"],
  ["整形", "整形外科"], ["醫美", "整形外科"], ["美容外科", "整形外科"],
  ["職業醫", "職業醫學科"], ["職業病", "職業醫學科"],
  ["洗腎", "洗腎科"],
  ["不分科", "不分科"],
  ["外科", "外科"],
  ["內科", "內科"],
];

function resolveDept(raw: string): string | null {
  const clean = raw.replace(/\s/g, "").replace(/[（）()]/g, "");
  if (!clean) return null;
  for (const kw of DEPT_EXCLUDE) {
    if (clean.includes(kw)) return null;
  }
  if (STANDARD_DEPTS.has(clean)) return clean;
  for (const [kw, target] of DEPT_KEYWORDS) {
    if (clean.includes(kw)) return target;
  }
  return null;
}

function extractDepartments(clinic: Clinic): string[] {
  const specialty = (clinic.specialty || "").trim();
  const type = (clinic.type || "").trim();

  let deptPart = specialty;
  if (type) {
    if (deptPart === type) {
      deptPart = "";
    } else if (deptPart.endsWith(" " + type)) {
      deptPart = deptPart.slice(0, deptPart.length - type.length - 1).trim();
    }
  }
  if (!deptPart) return [];

  const result = new Set<string>();
  for (const raw of deptPart.split(/[,、，；;\/]/)) {
    const resolved = resolveDept(raw);
    if (resolved) result.add(resolved);
  }
  return Array.from(result);
}

/* ============================================================
 * 縣市解析
 * ============================================================ */
function normalizeCountyName(name: string): string {
  return name.replace(/台/g, "臺");
}

function getCountyFromAddress(address: string): string {
  if (!address) return "其他";
  const match = address.match(/^(.{2,3}[市縣])/);
  if (!match) return "其他";
  return normalizeCountyName(match[1]);
}

/* ============================================================
 * 靜態路徑生成
 * ============================================================ */
export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  const countyMap = new Map<string, Set<string>>();

  clinics.forEach((c) => {
    const county = getCountyFromAddress(c.address);
    if (county === "其他") return;
    if (!countyMap.has(county)) countyMap.set(county, new Set());
    extractDepartments(c).forEach((spec) => countyMap.get(county)!.add(spec));
  });

  countyMap.forEach((specs, county) => {
    params.push({ slug: county });
    if (county.includes("臺")) params.push({ slug: county.replace(/臺/g, "台") });

    specs.forEach((spec) => {
      params.push({ slug: `${county}-${spec}` });
      if (county.includes("臺")) params.push({ slug: `${county.replace(/臺/g, "台")}-${spec}` });
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

  const allCounties = Array.from(new Set(clinics.map((c) => getCountyFromAddress(c.address)))).filter(c => c !== "其他").sort();

  const countyClinics = clinics.filter((c) => getCountyFromAddress(c.address) === countyName);

  let finalClinics = countyClinics;
  if (specialtyName) {
    const targetSpec = resolveDept(specialtyName) || specialtyName.replace(/\s+/g, "");
    finalClinics = countyClinics.filter((c) => extractDepartments(c).includes(targetSpec));
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="relative overflow-hidden w-full border-b border-slate-100/50">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/40 to-transparent pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto px-6 pt-8 pb-8">
          
          <nav className="flex items-center text-sm font-medium text-slate-500 mb-6">
            <Link href="/" className="hover:text-teal-600 transition-colors">首頁</Link>
            <span className="mx-2 text-slate-300">/</span>
            <Link href="/clinics" className="hover:text-teal-600 transition-colors">院所查詢</Link>
            <span className="mx-2 text-slate-300">/</span>
            {specialtyName ? (
              <>
                <Link href={`/clinics/${encodeURIComponent(countyName)}`} className="hover:text-teal-600 transition-colors">
                  {countyName}
                </Link>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-teal-700">{specialtyName}</span>
              </>
            ) : (
              <span className="text-teal-700">{countyName}</span>
            )}
          </nav>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
            {countyName} {specialtyName || "診所與醫院"}
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl mb-8">
            共收錄 {finalClinics.length} 家相關機構。資料來自健保署開放資料平台，每日更新。
          </p>

          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <p className="text-sm font-bold text-slate-500 mb-3">📍 切換其他縣市</p>
            <div className="flex flex-wrap gap-2">
              {allCounties.map((c) => (
                <Link
                  key={c}
                  href={`/clinics/${encodeURIComponent(c)}`}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    c === countyName
                      ? "bg-teal-50 border-teal-200 text-teal-700 font-bold"
                      : "bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700"
                  }`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-8 w-full flex-1">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/clinics" className="inline-flex items-center gap-1 text-sm font-bold text-teal-600 hover:underline">
            ← 返回全台搜尋
          </Link>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-900 mb-3">
            在 {countyName} 尋找 {specialtyName || "合適的診所"} 嗎？
          </h2>
          <p className="text-slate-600 leading-relaxed mb-5">
            本站整理了 {countyName} 共 {finalClinics.length} 家與「{specialtyName || "醫療服務"}」相關的健保特約機構，包含詳細的診所地址與聯絡電話。
            如果您不確定自己的狀況該看哪一科，建議使用下方工具進行初步評估，以免跑錯科別。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/tools/symptoms" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-teal-700 text-sm font-medium rounded-full border border-teal-200 hover:bg-teal-50 transition-colors shadow-sm">
              <span>🔍</span> 症狀查科別
            </Link>
            <Link href="/tools/assistant" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-700 text-sm font-medium rounded-full border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm">
              <span>✨</span> AI 智能分診
            </Link>
          </div>
        </div>

        {!specialtyName && (
          <div className="mb-8 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-500 mb-3">🩺 依科別瀏覽 {countyName} 診所</p>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(countyClinics.flatMap((c) => extractDepartments(c)))).sort((a, b) => {
                const ia = DEPT_ORDER.indexOf(a), ib = DEPT_ORDER.indexOf(b);
                return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
              }).map((spec) => (
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
          {finalClinics.slice(0, 100).map((c, i) => {
            const depts = extractDepartments(c);
            return (
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
                {depts.length > 0 && (
                  <p className="text-xs font-medium text-blue-600 mt-3 bg-blue-50 inline-block px-2 py-1 rounded-md">
                    科別：{depts.join("、")}
                  </p>
                )}
              </article>
            );
          })}
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