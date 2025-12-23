/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile workspace packages for Turbopack compatibility
  transpilePackages: ['@unified-health/sdk'],
  
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3001"],
    },
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
}

module.exports = nextConfig
