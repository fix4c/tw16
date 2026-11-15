import Script from "next/script";
import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

const serif = Noto_Serif_TC({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "台灣醫療入口 | 由 AI 自動策展的權威醫療資訊導航",
  description:
    "從衛福部、疾管署、健保署等權威來源自動聚合，每日更新的台灣醫療資訊入口網站。",
  // 👇 新增這段，強制指定瀏覽器標籤圖標
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className={`${sans.variable} ${serif.variable}`}>
      <head>
        {/* 👇 Google AdSense 全局自動廣告腳本 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7289252603428818"
          crossOrigin="anonymous"
          strategy="afterInteractive"
          data-nscript={undefined}
        />
      </head>
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}