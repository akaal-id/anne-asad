import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/wa/anne-asad',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;