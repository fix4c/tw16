/**
 * 健保署標準診療科別白名單與常見別名映射。
 * 純常量，client 與 server 均可使用（無 fs 依賴）。
 * 與 data/dept-codes.csv 及診所長尾頁實際生成值保持一致。
 */

/** 標準科別白名單 */
export const STANDARD_DEPARTMENTS: ReadonlySet<string> = new Set([
  "不分科",
  "家醫科",
  "內科",
  "外科",
  "兒科",
  "婦產科",
  "骨科",
  "泌尿科",
  "耳鼻喉科",
  "眼科",
  "皮膚科",
  "神經科",
  "精神科",
  "復健科",
  "牙科",
  "中醫一般科",
  "急診醫學科",
]);

/** 常見別名 → 標準科別 */
export const DEPT_ALIAS_MAP: Record<string, string> = {
  "感染科": "內科",
  "胸腔內科": "內科",
  "胸腔科": "內科",
  "心臟內科": "內科",
  "心臟科": "內科",
  "胃腸肝膽科": "內科",
  "腸胃科": "內科",
  "消化內科": "內科",
  "一般內科": "內科",
  "腎臟科": "內科",
  "新陳代謝科": "內科",
  "內分泌科": "內科",
  "風濕免疫科": "內科",
  "血液腫瘤科": "內科",
  "神經內科": "神經科",
  "神經外科": "外科",
  "一般外科": "外科",
  "大腸直腸外科": "外科",
  "整形外科": "外科",
  "小兒科": "兒科",
  "小兒科(兒童)": "兒科",
  "兒童科": "兒科",
  "婦產科(女性)": "婦產科",
  "身心科": "精神科",
  "急診": "急診醫學科",
  "牙醫": "牙科",
  "牙醫科": "牙科",
  "中醫": "中醫一般科",
  "中醫科": "中醫一般科",
};

/** 把任意科別名稱收斂為標準名稱；收斂不到回傳 null */
export function resolveDepartment(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/\s/g, "");
  if (STANDARD_DEPARTMENTS.has(cleaned)) return cleaned;
  const mapped = DEPT_ALIAS_MAP[cleaned];
  if (mapped && STANDARD_DEPARTMENTS.has(mapped)) return mapped;
  return null;
}

/** 批次映射、去重、兜底為「家醫科」 */
export function getSafeDepartments(rawDepts: readonly string[]): string[] {
  const mapped = rawDepts
    .map(resolveDepartment)
    .filter((d): d is string => d !== null);
  const unique = Array.from(new Set(mapped));
  return unique.length > 0 ? unique : ["家醫科"];
}