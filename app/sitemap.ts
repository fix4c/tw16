import type { MetadataRoute } from 'next'
import rawData from "@/data/clinics.json";
import {
  type Clinic,
  extractDepartments,
  normalizeCountyName,
  getCountyFromAddress,
} from "@/lib/clinics/departments";

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

  const clinics = (rawData as { clinics: Clinic[] }).clinics;

  const countyMap = new Map<string, Set<string>>();
  clinics.forEach((c) => {
    const county = getCountyFromAddress(c.address);
    if (county === "其他") return;
    if (!countyMap.has(county)) countyMap.set(county, new Set());
    extractDepartments(c).forEach((spec) => countyMap.get(county)!.add(spec));
  });

  const dynamicUrls: MetadataRoute.Sitemap = [];
  countyMap.forEach((specs, county) => {
    // 縣市頁（同時生成 臺 / 台 兩種變體，與頁面 generateStaticParams 一致）
    dynamicUrls.push({
      url: `${baseUrl}/clinics/${encodeURIComponent(county)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
    if (county.includes("臺")) {
      dynamicUrls.push({
        url: `${baseUrl}/clinics/${encodeURIComponent(county.replace(/臺/g, "台"))}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    // 縣市-科別頁（同樣兩種變體）
    specs.forEach((spec) => {
      dynamicUrls.push({
        url: `${baseUrl}/clinics/${encodeURIComponent(`${county}-${spec}`)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
      if (county.includes("臺")) {
        dynamicUrls.push({
          url: `${baseUrl}/clinics/${encodeURIComponent(`${county.replace(/臺/g, "台")}-${spec}`)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    });
  });

  return [...staticUrls, ...dynamicUrls]
}