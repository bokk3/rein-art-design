import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      // Note: Instagram images are downloaded and stored locally,
      // so we don't need to add Instagram CDN domains here
    ],
  },
};

export default nextConfig;
