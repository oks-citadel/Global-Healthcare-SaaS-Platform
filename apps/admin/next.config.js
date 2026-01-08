/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // output: 'standalone', // Disabled locally. Enable in CI.
  ...(process.env.CI === 'true' ? { output: 'standalone' } : {}),
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Transpile workspace packages for Turbopack compatibility
  transpilePackages: ['@unified-health/sdk'],

  experimental: {
    serverActions: {
      allowedOrigins: process.env.NODE_ENV === 'production' 
        ? [process.env.ALLOWED_ORIGIN || 'admin.theunifiedhealth.com']
        : ['localhost:3001', 'localhost:3000'],
    },
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  async headers() {
    // Content Security Policy for admin dashboard
    // SECURITY: Prevents XSS, clickjacking, and data injection attacks
    const cspHeader = [
      "default-src 'self'",
      // Scripts: Allow self and Next.js inline scripts
      // SECURITY: 'unsafe-inline' required for Next.js hydration; 'unsafe-eval' removed to prevent eval-based XSS attacks
      "script-src 'self' 'unsafe-inline'",
      // Styles: Allow self and inline styles (required for CSS-in-JS)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: Allow self, data URIs, and CDN
      "img-src 'self' data: blob: https://*.amazonaws.com https://*.cloudfront.net",
      // Fonts: Allow Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Connect: Allow API
      "connect-src 'self' https://*.theunifiedhealth.com",
      // Frames: Block all frames for admin security
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
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: cspHeader },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
