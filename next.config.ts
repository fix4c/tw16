import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    inlineCss: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;