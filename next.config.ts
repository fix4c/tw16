import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export',          // 👈 新增这一行，启用静态导出
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;