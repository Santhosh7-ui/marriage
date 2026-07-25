import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Unoptimized: Three.js loads textures directly via fetch/XHR,
    // not through the Next.js <Image> component, so optimisation isn't needed.
    unoptimized: true,

    // Allow images from Cloudflare R2 public buckets
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev',   // matches pub-XXXX.r2.dev
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
    ],
  },
};

export default nextConfig;
