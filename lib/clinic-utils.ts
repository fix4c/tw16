import { resolveDepartment } from "./department-constants";

export type Clinic = {
  name: string;
  type: string;
  address: string;
  phone: string;
  specialty: string;
};

/**
 * 从 specialty 字段提取标准科别列表。
 * specialty 格式为 "科別1,科別2 類型"，末尾是空格 + type。
 * 剥离 type 后按逗号切分，逐项映射到白名单，去重。
 */
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
  for (const raw of deptPart.split(",")) {
    const resolved = resolveDepartment(raw);
    if (resolved) result.add(resolved);
  }
  return Array.from(result);
}

/** 从地址提取县市，正规化为「臺」 */
export function extractCounty(address: string): string | null {
  const match = (address || "").match(/^(.{2,3}[市縣])/);
  if (!match) return null;
  return match[1].replace(/台/g, "臺");
}

/** 从地址提取乡镇区 */
export function extractDistrict(address: string): string | null {
  const match = (address || "").match(/^.{2,3}[市縣](.{2,3}[區鄉鎮市])/);
  return match ? match[1] : null;
}