import Script from "next/script";
import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["400", "500", "700"],
  display: "optional", // 👈 改為 optional，避免字體下載拖慢渲染
});

const serif = Noto_Serif_TC({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  weight: ["600", "700"],
  display: "optional", // 👈 改為 optional
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tw16.net"),
  title: "台灣醫療入口 | 由 AI 自動策展的權威醫療資訊導航",
  description:
    "從衛福部、疾管署、健保署等權威來源自動聚合，每日更新的台灣醫療資訊入口網站。",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://tw16.net",
    siteName: "台灣醫療入口",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "台灣醫療入口 - AI 策展的權威醫療資訊導航",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "台灣醫療入口",
    url: "https://tw16.net",
    description:
      "由 AI 自動策展的台灣醫療資訊導航。整合全台醫院掛號、診所查詢、健康工具與兩岸權威醫療新聞。",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://tw16.net/tools/symptoms?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="zh-Hant" className={`${sans.variable} ${serif.variable}`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7289252603428818"
          crossOrigin="anonymous"
          strategy="afterInteractive"
          data-nscript={undefined}
        />
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}