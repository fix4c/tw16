import type { MetadataRoute } from 'next'

// 👇 靜態導出必須加上這一行
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tw16.net'

  // 這裡列出你網站所有的靜態頁面路徑
  const routes = [
    '',
    '/hospitals',
    '/clinics',
    '/guides',
    '/guides/cross-strait-guide',
    '/guides/health-checkup-guide',
    '/guides/new-resident-guide',
    '/guides/nhi-card-guide',
    '/guides/registration-guide',
    '/tools/assistant',
    '/tools/bmi',
    '/tools/health-tracker',
    '/tools/symptoms',
    '/tools/water',
    '/about',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
}