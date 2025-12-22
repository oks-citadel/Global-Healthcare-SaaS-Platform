/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
    ],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Production source maps (disabled for performance)
  productionBrowserSourceMaps: false,

  // Turbopack configuration (Next.js 16+)
  // Note: Turbopack is now the default bundler in Next.js 16
  // Use `next build --webpack` to fall back to webpack if needed
  turbopack: {
    // Resolve aliases for Turbopack (mirrors webpack config)
    resolveAlias: {
      '@': './src',
      '@components': './src/components',
      '@hooks': './src/hooks',
      '@lib': './src/lib',
      '@api': './src/api',
    },
  },

  // Transpile workspace packages for Turbopack compatibility
  transpilePackages: ['@unified-health/sdk'],

  // Experimental features for performance
  experimental: {
    // optimizeCss is now stable in Next.js 16, moved out of experimental
    optimizePackageImports: [
      '@tanstack/react-query',
      'zustand',
      'axios',
      'zod',
      'lucide-react',
      'date-fns',
      'recharts',
    ],
  },

  // CSS optimization (stable in Next.js 16)
  cssChunking: 'strict',

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
      // Cache static assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for optimization
  async redirects() {
    return [];
  },

  // Rewrites for API proxy (optional)
  async rewrites() {
    return [];
  },

  // Environment variables (public)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  },
};

module.exports = nextConfig;
