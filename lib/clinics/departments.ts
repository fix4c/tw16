export type Clinic = {
  name: string;
  type: string;
  address: string;
  phone: string;
  specialty: string;
};

export const DEPT_ORDER = [
  "不分科", "家醫科", "內科", "外科", "兒科", "婦產科", "骨科", "泌尿科",
  "耳鼻喉科", "眼科", "皮膚科", "神經科", "精神科", "復健科",
  "整形外科", "職業醫學科", "洗腎科", "牙科", "中醫一般科",
];

export const STANDARD_DEPTS = new Set(DEPT_ORDER);

export const DEPT_EXCLUDE = [
  "神經外科", "急診", "重症", "麻醉", "放射線", "放射診斷", "放射腫瘤",
  "病理", "核子醫學", "結核",
];

export const DEPT_KEYWORDS: [string, string][] = [
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

export function resolveDept(raw: string): string | null {
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

export function extractDepartments(clinic: Clinic): string[] {
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

export function normalizeCountyName(name: string): string {
  return name.replace(/台/g, "臺");
}

export function getCountyFromAddress(address: string): string {
  if (!address) return "其他";
  const match = address.match(/^(.{2,3}[市縣])/);
  if (!match) return "其他";
  return normalizeCountyName(match[1]);
}