import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.etsystatic.com',
      },
      {
        protocol: 'https',
        hostname: 'sgp1.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.qikink.com',
      },
      {
        protocol: 'https',
        hostname: 'qikink-assets.s3.ap-south-1.amazonaws.com',
      }
    ],
  },
};

export default nextConfig;
