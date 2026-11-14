import fs from "fs";

const API_BASE = "https://info.nhi.gov.tw/api/iode0010/v1/rest/datastore/A21030000I-D21004-009";
const PAGE_SIZE = 1000;
const ALLOWED_LEVELS = ["醫學中心", "區域醫院"];

// 精品醫院的精確掛號連結（名稱關鍵字 → 連結）
// 匹配時用 includes，涵蓋簡稱與全名
const PREMIUM_LINKS = [
  { keyword: "臺灣大學醫學院附設醫院", url: "https://reg.ntuh.gov.tw" },
  { keyword: "臺大醫院", url: "https://reg.ntuh.gov.tw" },
  { keyword: "臺北榮民總醫院", url: "https://www6.vghtpe.gov.tw/reg/home.do" },
  { keyword: "長庚紀念醫院", url: "https://register.cgmh.org.tw/" },
  { keyword: "中國醫藥大學附設醫院", url: "https://www.cmuh.cmu.edu.tw/OnlineAppointment/RegBooking" },
  { keyword: "臺中榮民總醫院", url: "https://register.vghtc.gov.tw" },
  { keyword: "成功大學醫學院附設醫院", url: "https://tandem.hosp.ncku.edu.tw/" },
  { keyword: "成大醫院", url: "https://tandem.hosp.ncku.edu.tw/" },
  { keyword: "奇美醫院", url: "https://www.chimei.org.tw/opdschedule/index.aspx?ihosp=10&lang=CH" },
  { keyword: "高雄醫學大學附設中和紀念醫院", url: "http://www.kmuh.org.tw/" },
];

function findPremiumLink(name) {
  for (const p of PREMIUM_LINKS) {
    if (name.includes(p.keyword)) return p.url;
  }
  return null;
}

function getCountyFromAddress(address) {
  if (!address) return "其他";
  const m = address.match(/^(.{2,3}[市縣])/);
  return m ? m[1] : "其他";
}

async function fetchPage(offset) {
  const url = `${API_BASE}?limit=${PAGE_SIZE}&offset=${offset}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function main() {
  console.log("开始抓取全台医院数据...");
  let all = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const data = await fetchPage(offset);
    const records = data.result?.records || (Array.isArray(data) ? data : []);
    if (records.length === 0) break;
    all.push(...records);
    offset += PAGE_SIZE;
    hasMore = records.length === PAGE_SIZE;
  }

  console.log(`共抓取 ${all.length} 笔机构，开始筛选医院层级...`);

  const hospitals = all
    .filter((r) => ALLOWED_LEVELS.includes(r["HOSP_CODE_CNAME"] || ""))
    .map((r) => {
      const name = r["HOSP_NAME"] || "";
      const premiumUrl = findPremiumLink(name);
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(name + " 網路掛號")}`;
      return {
        id: r["HOSP_ID"] || "",
        name,
        level: r["HOSP_CODE_CNAME"] || "",
        region: getCountyFromAddress(r["ADDRESS"] || ""),
        address: r["ADDRESS"] || "",
        phone: r["TEL"] || "",
        registrationUrl: premiumUrl || searchUrl,
        hasDirectLink: premiumUrl !== null,
      };
    })
    .filter((h) => h.name && h.address)
    .sort((a, b) => {
      // 精品直链优先，其次按层级（医学中心 > 区域医院），再按名称
      if (a.hasDirectLink !== b.hasDirectLink) return a.hasDirectLink ? -1 : 1;
      if (a.level !== b.level) return a.level === "醫學中心" ? -1 : 1;
      return a.name.localeCompare(b.name, "zh-TW");
    });

  const directCount = hospitals.filter((h) => h.hasDirectLink).length;
  const searchCount = hospitals.filter((h) => !h.hasDirectLink).length;

  const output = {
    lastUpdated: new Date().toISOString(),
    total: hospitals.length,
    directCount,
    searchCount,
    hospitals,
  };

  fs.writeFileSync("data/hospitals.json", JSON.stringify(output, null, 2), "utf8");
  console.log(`已更新 data/hospitals.json`);
  console.log(`  共 ${hospitals.length} 家医院（精品直链 ${directCount} 家 / 搜索链接 ${searchCount} 家）`);
}

main().catch((err) => {
  console.error("抓取失败：", err);
  process.exit(1);
});