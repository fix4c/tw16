import type { Metadata, Viewport } from "next";
import "./globals.css";

// ===== SEO / Metadata =====
export const metadata: Metadata = {
  metadataBase: new URL("https://tw16.net"),
  title: {
    default: "tw16.net 台灣醫療資訊網 | 醫院掛號、診所查找、醫療新聞",
    template: "%s | tw16.net",
  },
  description:
    "全台醫院掛號、健保診所查找、每日醫療新聞與 AI 分診助手。所有資訊由 AI 從衛福部、疾管署、食藥署等公開權威來源自動聚合。",
  keywords: ["台灣醫療", "醫院掛號", "診所", "健保", "醫療新聞", "AI 分診"],
  authors: [{ name: "tw16.net" }],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://tw16.net",
    siteName: "tw16.net 台灣醫療資訊網",
    title: "tw16.net 台灣醫療資訊網",
    description: "全台醫院掛號、診所查找、每日醫療新聞與 AI 分診助手。",
  },
  twitter: {
    card: "summary_large_image",
    title: "tw16.net 台灣醫療資訊網",
    description: "全台醫院掛號、診所查找、每日醫療新聞與 AI 分診助手。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  // 若你有 Search Console 驗證碼，可加在這裡
  // verification: { google: "xxxxxx" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d9488",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        {/* =============================================
            AdSense 驗證碼
            ⚠️ 必須用「原生 <script> 標籤」，不可用 next/script
            ⚠️ client 必須與 /ads.txt 的 pub-id 完全一致
            ============================================= */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8501375619420785"
          crossOrigin="anonymous"
        />

        {/* =============================================
            Google Translate（台灣人常用）
            ============================================= */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  {
                    pageLanguage: 'zh-TW',
                    includedLanguages: 'en,ja,ko,vi,th,id,zh-CN',
                    autoDisplay: false
                  },
                  'google_translate_element'
                );
              }
            `,
          }}
        />
        <script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
          defer
        />

        {/* =============================================
            Cloudflare Turnstile
            ⚠️ 若 Turnstile 只在特定頁面（如表單）使用，
               建議把這行移到該頁面而非 root layout
            ============================================= */}
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}