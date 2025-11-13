import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker staging/production builds
  // This is required by Dockerfile.prod for the runner stage
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  images: {
    // Increase image quality for better thumbnails
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Allow local images
    unoptimized: false,
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
