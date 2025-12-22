/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: swcMinify is deprecated in Next.js 16 - SWC minification is now always enabled
  images: {
    // Use remotePatterns instead of deprecated domains option
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'api.unified-health.com',
      },
    ],
  },
  // Turbopack configuration (Next.js 16+)
  turbopack: {},
  // Transpile workspace packages for Turbopack compatibility
  transpilePackages: ['@unified-health/sdk'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ]
  },
}

module.exports = nextConfig
