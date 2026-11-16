import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    inlineCss: true, // 👈 核心：開啟 CSS 內聯，消除渲染阻塞
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;