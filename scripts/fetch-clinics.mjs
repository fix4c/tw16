import fs from "fs";

const API_BASE = "https://info.nhi.gov.tw/api/iode0010/v1/rest/datastore/A21030000I-D21004-009";
const PAGE_SIZE = 1000;

async function fetchPage(offset) {
  const url = `${API_BASE}?limit=${PAGE_SIZE}&offset=${offset}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function main() {
  console.log("开始抓取健保特约诊所数据...");
  let allClinics = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const data = await fetchPage(offset);
    const records = data.result?.records || data || [];
    if (records.length === 0) break;

    const mapped = records.map((r) => ({
      name: r["醫事機構名稱"] || "",
      address: r["地址"] || "",
      phone: r["電話"] || "",
      specialty: r["診療科別"] || "",
      county: r["縣市別代碼"] || "",
    }));

    allClinics.push(...mapped);
    console.log(`  已抓取 ${allClinics.length} 家诊所 (offset: ${offset})`);

    offset += PAGE_SIZE;
    hasMore = records.length === PAGE_SIZE;
  }

  // 只保留有名称和地址的记录
  const cleaned = allClinics.filter((c) => c.name && c.address);

  const output = {
    lastUpdated: new Date().toISOString(),
    total: cleaned.length,
    clinics: cleaned,
  };

  fs.writeFileSync("data/clinics.json", JSON.stringify(output, null, 2), "utf8");
  console.log(`已更新 data/clinics.json，共 ${cleaned.length} 家诊所`);
}

main().catch((err) => {
  console.error("抓取失败：", err);
  process.exit(1);
});