import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker staging/production builds
  // This is required by Dockerfile.prod for the runner stage
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reinartdesign.be',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rein.truyens.pro',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
