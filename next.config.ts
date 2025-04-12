import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns:[
      {
        protocol: "http",
        hostname: "booky-be.onrender.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
            },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint errors during Vercel build
  },
};

export default nextConfig;
