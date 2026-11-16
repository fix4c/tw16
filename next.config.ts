import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true, // 👈 新增：改善静态导出的路径解析
  experimental: {
    inlineCss: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;