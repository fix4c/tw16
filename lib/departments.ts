import fs from "fs";
import path from "path";

/**
 * 從健保署《診療科別代碼對照檔》CSV 解析出標準科別名稱白名單。
 * 構建時執行一次，之後全站共用。
 */
function loadValidDepartments(): Set<string> {
  const csvPath = path.join(process.cwd(), "data", "dept-codes.csv");

  if (!fs.existsSync(csvPath)) {
    throw new Error(
      `找不到科別代碼檔：${csvPath}。請先下載 data.gov.tw/dataset/168338 的 CSV 並放入 data/dept-codes.csv`
    );
  }

  const raw = fs.readFileSync(csvPath, "utf-8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim() !== "");

  // 跳過表頭
  const dataLines = lines.slice(1);
  const depts = new Set<string>();

  for (const line of dataLines) {
    // CSV 格式：診療科別,診療科別名稱
    const parts = line.split(",");
    if (parts.length < 2) continue;
    const name = parts[1].trim();
    if (name) depts.add(name);
  }

  return depts;
}

/** 全站唯一的標準科別白名單 */
export const VALID_DEPARTMENTS: ReadonlySet<string> = loadValidDepartments();

/** 標準科別名稱陣列，供 AI enum 等場景使用 */
export const VALID_DEPARTMENT_LIST: readonly string[] = Array.from(
  VALID_DEPARTMENTS
).sort();

/**
 * 判斷一個科別字串是否為健保署標準名稱。
 * 用於資料清洗時丟棄「中醫診所」「醫務室」等非科別值。
 */
export function isValidDepartment(dept: string | null | undefined): boolean {
  if (!dept) return false;
  return VALID_DEPARTMENTS.has(dept.trim().replace(/\s/g, ""));
}