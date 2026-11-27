import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tw16.net"),
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
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
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        {children}

        {/* AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8501375619420785"
          crossOrigin="anonymous"
        />

        {/* Google Translate */}
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

        {/* Cloudflare Turnstile */}
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          async
          defer
        />
      </body>
    </html>
  );
}