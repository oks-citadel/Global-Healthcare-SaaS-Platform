// ============================================
// Lighthouse CI Configuration
// The Unified Health Platform - Performance Monitoring
// ============================================

module.exports = {
  ci: {
    collect: {
      // Use the built Next.js application
      staticDistDir: './apps/web/.next',
      // Or use a running server
      startServerCommand: 'pnpm --filter @unified-health/web start',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 60000,

      // URLs to test for performance
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/login',
        'http://localhost:3000/dashboard',
      ],

      // Number of runs per URL for more accurate results
      numberOfRuns: 3,

      // Chrome settings for consistent results
      settings: {
        // Use mobile emulation for more stringent testing
        preset: 'desktop',
        // Additional Chrome flags
        chromeFlags: '--no-sandbox --disable-gpu --headless',
        // Skip certain audits that may be flaky in CI
        skipAudits: [
          'uses-http2',
          'uses-long-cache-ttl',
        ],
      },
    },

    assert: {
      // Performance thresholds - fail if below these scores
      assertions: {
        // Core Web Vitals and Performance
        'categories:performance': ['error', { minScore: 0.80 }],

        // Accessibility - critical for healthcare applications
        'categories:accessibility': ['error', { minScore: 0.90 }],

        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.85 }],

        // SEO
        'categories:seo': ['error', { minScore: 0.80 }],

        // Progressive Web App (optional, warn only)
        'categories:pwa': ['warn', { minScore: 0.50 }],

        // Specific performance metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'interactive': ['warn', { maxNumericValue: 3500 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],

        // Accessibility-specific assertions
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'meta-viewport': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'button-name': 'error',

        // Security-related best practices
        'is-on-https': 'off', // Disabled for local testing
        'uses-http2': 'off',

        // Resource optimization
        'uses-text-compression': 'warn',
        'uses-responsive-images': 'warn',
        'offscreen-images': 'warn',
        'unminified-css': 'warn',
        'unminified-javascript': 'warn',
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',

        // SEO-specific assertions
        'meta-description': 'warn',
        'crawlable-anchors': 'warn',
        'robots-txt': 'off', // May not exist in dev
        'canonical': 'warn',
      },

      // Aggregate assertions across all URLs
      aggregationMethod: 'median',
    },

    upload: {
      // Upload results to temporary public storage (for PR comments)
      target: 'temporary-public-storage',

      // Alternatively, configure for Lighthouse CI Server
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.example.com',
      // token: process.env.LHCI_TOKEN,
    },

    server: {
      // Configuration for self-hosted LHCI server (if used)
      // storage: {
      //   storageMethod: 'sql',
      //   sqlDialect: 'postgres',
      //   sqlConnectionUrl: process.env.LHCI_DATABASE_URL,
      // },
    },
  },
};
