/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Optimize for kiosk deployment
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
