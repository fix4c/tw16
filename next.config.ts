import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // 👈 移除 trailingSlash: true，讓 Next.js 生成標準的 .html 檔案
  experimental: {
    inlineCss: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;