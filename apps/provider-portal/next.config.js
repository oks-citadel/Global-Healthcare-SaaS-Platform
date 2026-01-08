/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output enabled only in CI/CD (avoids Windows symlink issues locally)
  ...(process.env.CI === "true" ? { output: "standalone" } : {}),
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "api.theunifiedhealth.com",
      },
    ],
  },
  transpilePackages: ["@unified-health/sdk"],
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  async headers() {
    // Content Security Policy for provider portal
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
      // Connect: Allow API and WebSocket for video calls
      "connect-src 'self' https://*.theunifiedhealth.com wss://*.theunifiedhealth.com",
      // Frames: Block frames for security
      "frame-src 'none'",
      // Form submissions
      "form-action 'self'",
      // Base URI
      "base-uri 'self'",
      // Media: Allow self for video consultation
      "media-src 'self' blob:",
      // Upgrade insecure requests in production
      process.env.NODE_ENV === "production" ? "upgrade-insecure-requests" : "",
    ]
      .filter(Boolean)
      .join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: cspHeader },
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), microphone=(self), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
