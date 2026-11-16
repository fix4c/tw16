import type { MetadataRoute } from 'next'
import rawData from "@/data/clinics.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tw16.net'
  
  // 原有的靜態頁面
  const routes = [
    '', '/hospitals', '/clinics', '/rankings', '/guides', 
    '/guides/cross-strait-guide', '/guides/health-checkup-guide', 
    '/guides/new-resident-guide', '/guides/nhi-card-guide', 
    '/guides/registration-guide', '/guides/blood-test-guide', 
    '/guides/hypertension-guide', '/tools/assistant', '/tools/bmi', 
    '/tools/health-tracker', '/tools/symptoms', '/tools/water', 
    '/about', '/privacy', '/disclaimer'
  ]

  const staticUrls = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 👇 自動把 22 個縣市的頁面加入 Sitemap
  type Clinic = { address: string };
  const clinics = (rawData as { clinics: Clinic[] }).clinics;
  const countySet = new Set<string>();
  
  clinics.forEach((c) => {
    const match = c.address?.match(/^(.{2,3}[市縣])/);
    if (match) countySet.add(match[1]);
  });

  const countyUrls = Array.from(countySet).map((county) => ({
    url: `${baseUrl}/clinics/${encodeURIComponent(county)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticUrls, ...countyUrls]
}