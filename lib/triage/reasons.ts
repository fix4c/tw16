// 症狀 → 科別建議理由
// 擴充方式：往 REASON_RULES 陣列加新規則即可，調用方不需改動

export type TriageReasonRule = {
  keywords: string[];
  dept: string;
  reason: string;
};

export const REASON_RULES: TriageReasonRule[] = [
  {
    keywords: ["胸悶", "胸痛", "心悸", "喘"],
    dept: "心臟內科",
    reason: "胸悶、心悸或喘可能與心臟或血管功能有關，心臟內科是合適的初步評估科別。",
  },
  {
    keywords: ["頭暈", "頭痛", "手腳麻", "無力", "麻木"],
    dept: "神經科",
    reason: "頭暈合併手腳麻木或無力，需要評估神經系統功能，神經科可安排相關檢查。",
  },
  {
    keywords: ["腹痛", "腹瀉", "便秘", "胃痛", "脹氣", "噁心"],
    dept: "胃腸肝膽科",
    reason: "腹部不適持續或反覆出現時，胃腸肝膽科能評估消化道與肝膽系統的狀況。",
  },
  {
    keywords: ["頻尿", "解尿", "血尿", "腰痛", "排尿"],
    dept: "泌尿科",
    reason: "排尿相關症狀或合併腰痛，泌尿科可檢查泌尿道與腎臟功能。",
  },
  {
    keywords: ["關節", "背痛", "扭傷", "運動傷害", "骨"],
    dept: "骨科",
    reason: "關節、下背或外傷相關問題，骨科可評估骨骼、關節與肌肉狀況。",
  },
  {
    keywords: ["皮膚", "紅疹", "搔癢", "掉髮", "痘"],
    dept: "皮膚科",
    reason: "皮膚相關症狀由皮膚科評估，能針對皮疹、搔癢或掉髮做鑑別。",
  },
  {
    keywords: ["發燒", "咳嗽", "喉嚨痛", "流鼻水", "感冒"],
    dept: "家醫科",
    reason: "急性呼吸道或發燒症狀，先由家醫科評估是最合適的入口，必要時會協助轉介。",
  },
  {
    keywords: ["多重症狀", "不確定", "疲勞", "體重變化", "全身"],
    dept: "家醫科",
    reason: "症狀分散或不明確時，家醫科能做整體評估，避免在各專科之間來回掛號。",
  },
];

/**
 * 依症狀文字與推薦科別，取得對應的理由說明。
 * 找不到對應理由時回傳 null，調用方不顯示即可。
 */
export function getTriageReason(
  symptomText: string,
  recommendedDept: string
): string | null {
  const normalized = symptomText.replace(/\s/g, "");
  for (const rule of REASON_RULES) {
    if (rule.dept !== recommendedDept) continue;
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      return rule.reason;
    }
  }
  return null;
}