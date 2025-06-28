import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'oshposapi.021.uz',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  reactStrictMode: true, // Enable strict mode for development
  swcMinify: true // Enable minification for production
};

export default nextConfig;
