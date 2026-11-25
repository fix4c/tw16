import type { MetadataRoute } from 'next'
import rawData from "@/data/clinics.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tw16.net'
  
  const routes = [
    '', '/hospitals', '/clinics', '/rankings', '/guides', 

    // 既有 7 篇指南
    '/guides/cross-strait-guide', '/guides/health-checkup-guide', 
    '/guides/new-resident-guide', '/guides/nhi-card-guide', 
    '/guides/registration-guide', '/guides/blood-test-guide', 
    '/guides/hypertension-guide', 

    // 新增 21 篇指南（2026-11 擴充）
    '/guides/hospital-level-guide',
    '/guides/first-visit-guide',
    '/guides/referral-guide',
    '/guides/emergency-guide',
    '/guides/medical-department-guide',
    '/guides/nhi-copayment-guide',
    '/guides/nhi-card-usage-guide',
    '/guides/nhi-enrollment-guide',
    '/guides/nhi-app-guide',
    '/guides/prescription-guide',
    '/guides/chronic-prescription-guide',
    '/guides/drug-interaction-guide',
    '/guides/medicine-storage-guide',
    '/guides/urine-test-guide',
    '/guides/liver-function-guide',
    '/guides/kidney-function-guide',
    '/guides/blood-sugar-guide',
    '/guides/elderly-medical-guide',
    '/guides/child-medical-guide',
    '/guides/pregnancy-checkup-guide',
    '/guides/diabetes-management-guide',

    // 工具頁
    '/tools/assistant', '/tools/bmi', 
    '/tools/health-tracker', '/tools/symptoms', '/tools/water', 

    // 靜態頁
    '/about', '/privacy', '/disclaimer'
  ]

  const staticUrls = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  type Clinic = { address: string; specialty: string; type: string };
  const clinics = (rawData as { clinics: Clinic[] }).clinics;
  
  const countyMap = new Map<string, Set<string>>();

  // 使用與頁面完全相同的清洗邏輯
  const getAllSpecialties = (c: Clinic): string[] => {
    const specs = new Set<string>();
    const addValid = (s: string) => {
      const cleaned = s.trim();
      if (cleaned && cleaned.length < 10) specs.add(cleaned);
    };
    const process = (value: string) => {
      if (!value) return;
      value.split(/[、,，；;\/]/).forEach(seg => {
        const trimmed = seg.trim();
        if (!trimmed) return;
        const words = trimmed.split(/\s+/);
        if (words.length > 1) {
          const hasShortWord = words.some(w => w.length === 1);
          if (hasShortWord) {
            addValid(trimmed.replace(/\s+/g, ""));
          } else {
            words.forEach(w => addValid(w));
            addValid(trimmed.replace(/\s+/g, ""));
          }
        } else {
          addValid(trimmed);
        }
      });
    };
    process(c.specialty);
    process(c.type);
    return Array.from(specs);
  };

  clinics.forEach((c) => {
    const match = c.address?.match(/^(.{2,3}[市縣])/);
    if (!match) return;
    const county = match[1].replace(/台/g, "臺"); 
    
    if (!countyMap.has(county)) countyMap.set(county, new Set());
    getAllSpecialties(c).forEach(spec => countyMap.get(county)!.add(spec));
  });

  const dynamicUrls: MetadataRoute.Sitemap = [];

  // ⚠️ 已知問題：以下 clinics 動態 URL 在 Cloudflare Pages 上因中文路徑編碼問題可能回 404
  // 保留原因：架構不變；若日後修好中文路徑，這些 URL 可立即恢復索引
  // 若 Google Search Console 大量回報 404，可考慮暫時移除此段（另行通知我處理）
  countyMap.forEach((specs, county) => {
    dynamicUrls.push({
      url: `${baseUrl}/clinics/${encodeURIComponent(county)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    specs.forEach((spec) => {
      dynamicUrls.push({
        url: `${baseUrl}/clinics/${encodeURIComponent(`${county}-${spec}`)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
  });

  return [...staticUrls, ...dynamicUrls]
}