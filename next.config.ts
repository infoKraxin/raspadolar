import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.raspa.ae',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
