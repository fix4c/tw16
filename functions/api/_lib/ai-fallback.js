// 規則式降級分診：Gemini 不可用時提供合理科別建議
// 輸出結構與 ai-triage.js 的 JSON 一致：{ is_emergency, departments, advice, warning }

const EMERGENCY_KEYWORDS = [
  "意識改變",
  "意識不清",
  "昏迷",
  "抽搐",
  "癲癇",
  "冒冷汗",
  "呼吸困難",
  "喘不過氣",
  "大量出血",
  "出血不止",
  "中風",
  "臉歪",
  "口齒不清",
  "單側無力",
  "爆炸性頭痛",
  "劇烈頭痛合併頸部僵硬",
  "吞嚥困難",
  "流口水",
];

const DEPT_KEYWORDS = [
  {
    dept: "神經內科",
    keywords: ["頭痛", "頭暈", "眩暈", "麻木", "無力", "抽搐", "記憶", "失智", "中風", "複視"],
  },
  { dept: "眼科", keywords: ["眼睛", "視力", "紅眼", "飛蚊", "眼壓", "眼皮", "畏光"] },
  {
    dept: "耳鼻喉科",
    keywords: ["喉嚨", "鼻塞", "流鼻水", "流鼻血", "耳痛", "耳鳴", "聽力", "沙啞", "吞嚥", "扁桃腺"],
  },
  { dept: "牙科", keywords: ["牙痛", "牙齦", "蛀牙", "智齒", "口臭", "口腔潰瘍", "牙周", "顳顎"] },
  { dept: "心臟內科", keywords: ["胸痛", "胸悶", "心悸", "心律", "心跳", "心臟", "喘"] },
  { dept: "胸腔內科", keywords: ["咳嗽", "咳血", "氣喘", "喘鳴", "呼吸", "肺", "痰"] },
  {
    dept: "胃腸肝膽科",
    keywords: ["腹痛", "腹瀉", "便祕", "便秘", "嘔吐", "噁心", "胃痛", "胃酸", "血便", "黃疸", "腹脹", "食慾"],
  },
  { dept: "泌尿科", keywords: ["排尿", "頻尿", "血尿", "解尿", "尿失禁", "夜尿", "攝護腺", "睪丸"] },
  { dept: "腎臟科", keywords: ["水腫", "泡泡尿", "腎", "肌酸酐", "eGFR"] },
  { dept: "皮膚科", keywords: ["皮疹", "紅疹", "搔癢", "皮膚", "掉髮", "水泡", "帶狀疱疹", "蕁麻疹", "痣"] },
  { dept: "骨科", keywords: ["關節", "背痛", "腰痛", "肩", "頸", "骨折", "扭傷", "肌肉", "骨", "足底"] },
  { dept: "復健科", keywords: ["復健", "運動傷害", "拉傷", "姿勢", "痠痛"] },
  { dept: "婦產科", keywords: ["月經", "懷孕", "產檢", "更年期", "陰道", "乳房", "骨盆腔", "分泌物"] },
  { dept: "精神科", keywords: ["情緒", "焦慮", "憂鬱", "失眠", "幻覺", "妄想", "強迫", "恐慌", "嗜睡"] },
  {
    dept: "內分泌新陳代謝科",
    keywords: ["甲狀腺", "血糖", "糖尿病", "體重變化", "怕冷", "怕熱", "荷爾蒙", "多尿", "多喝"],
  },
  { dept: "風濕免疫科", keywords: ["關節痛", "口乾", "眼乾", "紫斑", "自體免疫", "紅斑", "乾燥"] },
  { dept: "血液腫瘤科", keywords: ["貧血", "瘀青", "出血", "淋巴結", "白血病", "淋巴瘤", "體重減輕"] },
  { dept: "感染科", keywords: ["發燒", "感染", "旅遊", "針扎", "疫苗", "盜汗"] },
  { dept: "家醫科", keywords: ["發燒", "感冒", "全身", "疲勞", "不明熱", "多重症狀"] },
  { dept: "小兒科", keywords: ["兒童", "小孩", "嬰兒", "寶寶"] },
  { dept: "老年醫學科", keywords: ["長者", "老人", "跌倒", "多重用藥", "衰弱"] },
];

const DEFAULT_DEPT = "家醫科";

export function isEmergency(symptoms) {
  const s = (symptoms || "").toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => s.includes(kw));
}

export function getFallbackTriage(rawSymptoms) {
  const symptoms = (rawSymptoms || "").trim();

  if (!symptoms) {
    return {
      is_emergency: false,
      departments: [DEFAULT_DEPT],
      advice: "請描述您的症狀，或至家醫科由醫師評估。",
      warning: null,
      _degraded: true,
    };
  }

  const emergency = isEmergency(symptoms);
  const lower = symptoms.toLowerCase();
  const matches = [];

  for (const { dept, keywords } of DEPT_KEYWORDS) {
    const hits = keywords.reduce(
      (n, kw) => (lower.includes(kw) ? n + 1 : n),
      0
    );
    if (hits > 0) matches.push({ dept, hits });
  }

  matches.sort((a, b) => b.hits - a.hits);
  const departments = matches.slice(0, 3).map((m) => m.dept);
  if (departments.length === 0) departments.push(DEFAULT_DEPT);

  if (emergency) {
    return {
      is_emergency: true,
      departments,
      advice: "您的症狀可能為急症，建議立即至急診或撥打 119。",
      warning: "若合併意識改變、呼吸困難或大量出血，請立即就醫。",
      _degraded: true,
    };
  }

  return {
    is_emergency: false,
    departments,
    advice:
      "依您的症狀描述，建議先至以下科別門診評估。若症狀持續或惡化，請盡速就醫。",
    warning: null,
    _degraded: true,
  };
}