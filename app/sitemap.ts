import type { MetadataRoute } from 'next'
import rawData from "@/data/clinics.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tw16.net'
  
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

  // 處理診所資料
  type Clinic = { address: string; specialty: string; type: string };
  const clinics = (rawData as { clinics: Clinic[] }).clinics;
  
  const countyMap = new Map<string, Set<string>>();

  clinics.forEach((c) => {
    const match = c.address?.match(/^(.{2,3}[市縣])/);
    if (!match) return;
    const county = match[1];
    
    if (!countyMap.has(county)) countyMap.set(county, new Set());
    
    // 收集科別
    if (c.specialty) {
      c.specialty.split(/[、,，/]/).forEach((s) => {
        const trimmed = s.trim();
        if (trimmed && trimmed.length < 15) countyMap.get(county)!.add(trimmed);
      });
    }
    // 收集機構類型
    if (c.type) countyMap.get(county)!.add(c.type);
  });

  const countyUrls: MetadataRoute.Sitemap = [];
  const specialtyUrls: MetadataRoute.Sitemap = [];

  countyMap.forEach((specs, county) => {
    // 加入縣市頁面
    countyUrls.push({
      url: `${baseUrl}/clinics/${encodeURIComponent(county)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    // 加入縣市+科別頁面
    specs.forEach((spec) => {
      specialtyUrls.push({
        url: `${baseUrl}/clinics/${encodeURIComponent(county)}/${encodeURIComponent(spec)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
  });

  return [...staticUrls, ...countyUrls, ...specialtyUrls]
}