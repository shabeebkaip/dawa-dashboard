import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc/**',
      },
      {
        protocol: 'https',
        hostname: 'dawa-app-backend.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.usercontent.google.com',
      },
    ],
  },
};

export default nextConfig;
