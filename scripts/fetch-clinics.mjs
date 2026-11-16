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
  console.log("开始抓取健保特约机构数据...");
  let all = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const data = await fetchPage(offset);
    const records = data.result?.records || (Array.isArray(data) ? data : []);
    if (records.length === 0) break;

    const mapped = records.map((r) => ({
      name: r["HOSP_NAME"] || "",
      type: r["HOSP_CODE_CNAME"] || "",
      address: r["ADDRESS"] || "",
      phone: r["TEL"] || "",
      specialty: (r["FUNCTYPE_CNAME"] || "") + " " + (r["HOSP_CODE_CNAME"] || ""), // 👈 把機構類型也加進科別裡
    }));

    all.push(...mapped);
    console.log(`  已抓取 ${all.length} 家 (offset: ${offset})`);

    offset += PAGE_SIZE;
    hasMore = records.length === PAGE_SIZE;
  }

  const cleaned = all.filter((c) => c.name && c.address);

  const output = {
    lastUpdated: new Date().toISOString(),
    total: cleaned.length,
    clinics: cleaned,
  };

  fs.writeFileSync("data/clinics.json", JSON.stringify(output, null, 2), "utf8");
  console.log(`已更新 data/clinics.json，共 ${cleaned.length} 家`);
}

main().catch((err) => {
  console.error("抓取失败：", err);
  process.exit(1);
});