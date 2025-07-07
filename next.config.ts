import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oshposapi.021.uz',
        port: ''
      }
    ]
  },
  reactStrictMode: true // Enable strict mode for development
};

export default nextConfig;
