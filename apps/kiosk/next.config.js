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
  // // output: 'standalone', // Disabled locally. Enable in CI.
  ...(process.env.CI === 'true' ? { output: 'standalone' } : {}), // Disabled for Windows symlink issues

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Security headers
  async headers() {
    // Content Security Policy for kiosk application
    // SECURITY: Strict CSP for public-facing kiosk terminals
    const cspHeader = [
      "default-src 'self'",
      // Scripts: 'unsafe-inline' is required for Next.js hydration scripts
      "script-src 'self' 'unsafe-inline'",
      // Styles: Allow self and inline styles (required for CSS-in-JS)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: Allow self and data URIs only (strict for kiosk)
      "img-src 'self' data: blob:",
      // Fonts: Allow Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Connect: Allow API only
      "connect-src 'self' https://*.theunifiedhealth.com",
      // Frames: Block all frames for kiosk security
      "frame-src 'none'",
      // Form submissions
      "form-action 'self'",
      // Base URI
      "base-uri 'self'",
      // Upgrade insecure requests in production
      process.env.NODE_ENV === 'production' ? "upgrade-insecure-requests" : "",
    ].filter(Boolean).join('; ');

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
          {
            key: 'Content-Security-Policy',
            value: cspHeader
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
