// 新聞 → 個人健康看板關聯標記
// 擴充方式：
//   1. 新增健康狀況：往 CONDITION_KEYWORDS 加鍵值，同步 HealthCondition 型別
//   2. 新增新聞來源：不需改此檔，改新聞抓取層即可

export type HealthCondition = "hypertension" | "diabetes" | "liver" | "kidney";

export const HEALTH_CONDITION_LABELS: Record<HealthCondition, string> = {
  hypertension: "高血壓",
  diabetes: "糖尿病",
  liver: "肝臟相關",
  kidney: "腎臟相關",
};

const CONDITION_KEYWORDS: Record<HealthCondition, string[]> = {
  hypertension: ["血壓", "高血壓", "心血管", "中風", "心肌"],
  diabetes: ["血糖", "糖尿病", "糖化血色素", "胰島素"],
  liver: ["肝功能", "肝炎", "肝臟", "脂肪肝", "B肝", "C肝"],
  kidney: ["腎功能", "腎臟", "肌酸酐", "eGFR", "洗腎", "腎病"],
};

/**
 * 回傳這則新聞與使用者健康狀況的交集。
 * 使用者未記錄任何狀況時，回傳空陣列。
 */
export function getRelatedConditions(
  newsTitle: string,
  newsSummary: string,
  userConditions: HealthCondition[]
): HealthCondition[] {
  const text = `${newsTitle} ${newsSummary}`;
  return userConditions.filter((cond) =>
    CONDITION_KEYWORDS[cond]?.some((kw) => text.includes(kw))
  );
}