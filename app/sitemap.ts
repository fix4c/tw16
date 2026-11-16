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