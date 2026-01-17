import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oshposapi.021.uz',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'ooni.com',
        port: '',
      },
    ],
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tabler/icons-react',
      'date-fns',
    ],
  },
}

export default nextConfig
