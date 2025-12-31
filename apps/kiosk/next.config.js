/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // TypeScript strict mode - do not ignore errors in production
  typescript: {
    ignoreBuildErrors: false,
  },

  // Transpile workspace packages for Turbopack compatibility
  transpilePackages: ['@unified-health/sdk'],

  // Optimize for kiosk deployment
  // output: 'standalone', // Disabled for Windows symlink issues

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
