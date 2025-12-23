/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: swcMinify is deprecated in Next.js 16 - SWC minification is now always enabled
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Transpile workspace packages for Turbopack compatibility
  transpilePackages: ['@unified-health/sdk'],
  // Optimize for kiosk deployment
  // output: 'standalone', // Disabled for Windows symlink issues
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
