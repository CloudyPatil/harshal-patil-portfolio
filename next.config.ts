import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. This fixes the double-render 3D error
  reactStrictMode: false, 

  // 2. This allows images from Unsplash (for your project cards)
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;