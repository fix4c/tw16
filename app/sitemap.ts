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

  type Clinic = { address: string; specialty: string; type: string };
  const clinics = (rawData as { clinics: Clinic[] }).clinics;
  
  const countyMap = new Map<string, Set<string>>();

  clinics.forEach((c) => {
    const match = c.address?.match(/^(.{2,3}[市縣])/);
    if (!match) return;
    const county = match[1].replace(/台/g, "臺"); // 統一臺
    
    if (!countyMap.has(county)) countyMap.set(county, new Set());
    
    const addSpec = (val: string) => {
      val.split(/[、,，/]/).forEach(s => {
        const cleaned = s.replace(/\s+/g, "").trim();
        if (cleaned && cleaned.length < 10) countyMap.get(county)!.add(cleaned);
      });
    };
    if (c.specialty) addSpec(c.specialty);
    if (c.type) addSpec(c.type);
  });

  const dynamicUrls: MetadataRoute.Sitemap = [];

  countyMap.forEach((specs, county) => {
    // 縣市頁面
    dynamicUrls.push({
      url: `${baseUrl}/clinics/${encodeURIComponent(county)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    // 縣市-科別頁面
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