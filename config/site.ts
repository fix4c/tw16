// config/site.ts

export const SITE_CONFIG = {
  name: "台灣醫療入口",
  url: "https://tw16.net",
};

// 全站主導航（以後增加新頁面，只要在這裡加一行，全站頭部自動更新）
export const NAV_LINKS = [
  { href: "/hospitals", label: "醫院掛號" },
  { href: "/clinics", label: "院所查詢" },
  { href: "/tools/symptoms", label: "症狀查科別" },
  { href: "/tools/bmi", label: "BMI計算" },
  { href: "/guides", label: "就醫指南" },
];

// 工具區導航（以後新增計算器，只要在這裡加一行，所有工具頁面的切換列自動增加）
export const TOOL_LINKS = [
  { href: "/tools/bmi", label: "⚖️ BMI 計算" },
  { href: "/tools/water", label: "💧 飲水量計算" },
  { href: "/tools/health-tracker", label: "🩺 三高記錄" },
  { href: "/tools/symptoms", label: "🔍 症狀查科別" },
  { href: "/tools/assistant", label: "🧭 醫療小幫手" },
];