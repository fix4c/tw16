import type { Metadata, Viewport } from "next";
import "./globals.css";

// ===== SEO / Metadata =====
export const metadata: Metadata = {
  metadataBase: new URL("https://tw16.net"),
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: ["/icon.png"],
  },
  title: {
    default: "tw16.net 台灣醫療網 | 全台診所、醫院與就醫指南",
    template: "%s | tw16.net",
  },
  description:
    "全台診所與醫院查詢、AI 症狀分診、就醫指南、健保權益與檢驗報告解讀。tw16.net 提供民眾真正用得上的就醫資訊。",
  keywords: ["台灣醫療", "全台診所", "醫院", "就醫指南", "症狀查科別", "AI 分診"],
  authors: [{ name: "tw16.net" }],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://tw16.net",
    siteName: "tw16.net 台灣醫療網",
    title: "tw16.net 台灣醫療網",
    description: "全台診所與醫院查詢、AI 症狀分診、就醫指南與健保權益。",
  },
  twitter: {
    card: "summary_large_image",
    title: "tw16.net 台灣醫療網",
    description: "全台診所與醫院查詢、AI 症狀分診、就醫指南與健保權益。",
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
  // 谷歌 Search Console 驗證碼可放在這裡
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
            ⚠️ 必須用原生 <script> 標籤，不能用 next/script
            ⚠️ client 驗證用 /ads.txt 的 pub-id 要一致
            ============================================= */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8501375619420785"
          crossOrigin="anonymous"
        />

        {/* =============================================
            Google Translate（多語言用）
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
            ⚠️ 只在需要的頁面（如投票）載入
            建議移到需要的頁面，不要放在 root layout
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