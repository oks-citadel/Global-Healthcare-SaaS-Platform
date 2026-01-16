/**
 * Shared Configuration for k6 Load Tests
 * Global Healthcare SaaS Platform
 *
 * This configuration file contains shared settings, thresholds, and utilities
 * for all load testing scenarios.
 */

// Environment configuration - defaults to local/staging (NEVER production by default)
export const ENV = {
  // Base URL - override with K6_BASE_URL environment variable
  BASE_URL: __ENV.K6_BASE_URL || 'http://localhost:3000',

  // API Gateway URL
  API_URL: __ENV.K6_API_URL || 'http://localhost:4000/api/v1',

  // Auth service URL
  AUTH_URL: __ENV.K6_AUTH_URL || 'http://localhost:4001/auth',

  // Environment name for logging
  ENVIRONMENT: __ENV.K6_ENVIRONMENT || 'local',
};

// Standard thresholds aligned with SLA requirements
// p95 < 200ms, error rate < 1%
export const STANDARD_THRESHOLDS = {
  // Response time thresholds
  http_req_duration: [
    'p(50)<100',   // 50th percentile should be under 100ms
    'p(90)<150',   // 90th percentile should be under 150ms
    'p(95)<200',   // 95th percentile should be under 200ms (SLA requirement)
    'p(99)<500',   // 99th percentile should be under 500ms
  ],

  // Error rate thresholds
  http_req_failed: ['rate<0.01'],  // Less than 1% failure rate (SLA requirement)

  // Request blocking time (DNS lookup + connection)
  http_req_blocked: ['p(95)<50'],

  // Time to first byte
  http_req_waiting: ['p(95)<180'],
};

// Stricter thresholds for critical paths (authentication, payments)
export const CRITICAL_THRESHOLDS = {
  http_req_duration: [
    'p(50)<50',
    'p(90)<100',
    'p(95)<150',
    'p(99)<300',
  ],
  http_req_failed: ['rate<0.005'],  // Less than 0.5% failure rate for critical paths
  http_req_blocked: ['p(95)<30'],
  http_req_waiting: ['p(95)<130'],
};

// Relaxed thresholds for data-heavy operations (reports, exports)
export const RELAXED_THRESHOLDS = {
  http_req_duration: [
    'p(50)<500',
    'p(90)<1000',
    'p(95)<2000',
    'p(99)<5000',
  ],
  http_req_failed: ['rate<0.02'],  // Allow up to 2% failure rate
  http_req_blocked: ['p(95)<100'],
  http_req_waiting: ['p(95)<1800'],
};

// Load test stages - Ramp up, sustain, ramp down
export const STANDARD_STAGES = {
  // Smoke test - minimal load to verify system works
  smoke: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 5 },
    { duration: '30s', target: 0 },
  ],

  // Load test - typical expected load
  load: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 0 },
  ],

  // Stress test - push beyond normal capacity
  stress: [
    { duration: '1m', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 200 },
    { duration: '3m', target: 200 },
    { duration: '2m', target: 0 },
  ],

  // Spike test - sudden traffic spike
  spike: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 500 },
    { duration: '1m', target: 500 },
    { duration: '30s', target: 10 },
    { duration: '30s', target: 0 },
  ],

  // Soak test - sustained load over time
  soak: [
    { duration: '2m', target: 100 },
    { duration: '30m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

// Test data generators
export const TestData = {
  /**
   * Generate a random email address
   * @param {string} prefix - Prefix for the email
   * @returns {string} Random email address
   */
  randomEmail(prefix = 'loadtest') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${prefix}+${timestamp}${random}@test.example.com`;
  },

  /**
   * Generate a random user ID (UUID-like)
   * @returns {string} Random user ID
   */
  randomUserId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * Generate random patient data for testing
   * @returns {object} Patient data object
   */
  randomPatient() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'Robert', 'Emily'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis'];

    return {
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      email: this.randomEmail('patient'),
      dateOfBirth: '1990-01-01',
      phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    };
  },

  /**
   * Generate test credentials
   * @returns {object} Test user credentials
   */
  testCredentials() {
    return {
      email: __ENV.K6_TEST_USER || 'loadtest@test.example.com',
      password: __ENV.K6_TEST_PASSWORD || 'LoadTest123!',
    };
  },
};

// HTTP request helpers
export const RequestHelpers = {
  /**
   * Get default headers for API requests
   * @param {string} token - Optional auth token
   * @returns {object} Headers object
   */
  getHeaders(token = null) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Request-ID': `k6-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      'User-Agent': 'k6-load-test/1.0',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  },

  /**
   * Get standard request parameters
   * @param {object} customParams - Custom parameters to merge
   * @returns {object} Request parameters
   */
  getParams(customParams = {}) {
    return {
      timeout: '30s',
      tags: {
        environment: ENV.ENVIRONMENT,
        ...customParams.tags,
      },
      ...customParams,
    };
  },
};

// Common check functions
export const Checks = {
  /**
   * Standard response checks
   */
  isStatus200: (r) => r.status === 200,
  isStatus201: (r) => r.status === 201,
  isStatus2xx: (r) => r.status >= 200 && r.status < 300,
  isStatus401: (r) => r.status === 401,
  isStatus403: (r) => r.status === 403,
  isStatus404: (r) => r.status === 404,

  /**
   * Response time checks
   */
  durationUnder100ms: (r) => r.timings.duration < 100,
  durationUnder200ms: (r) => r.timings.duration < 200,
  durationUnder500ms: (r) => r.timings.duration < 500,
  durationUnder1s: (r) => r.timings.duration < 1000,

  /**
   * Body content checks
   */
  hasBody: (r) => r.body && r.body.length > 0,
  isValidJson: (r) => {
    try {
      JSON.parse(r.body);
      return true;
    } catch (e) {
      return false;
    }
  },
  bodyContains: (text) => (r) => r.body.includes(text),

  /**
   * Header checks
   */
  hasContentType: (r) => r.headers['Content-Type'] !== undefined,
  isJsonContentType: (r) => {
    const contentType = r.headers['Content-Type'] || '';
    return contentType.includes('application/json');
  },
};

// Metrics and tags for custom tracking
export const CustomMetrics = {
  tags: {
    scenario: 'default',
    endpoint: 'unknown',
    method: 'GET',
  },

  /**
   * Create tags for a specific endpoint
   * @param {string} scenario - Test scenario name
   * @param {string} endpoint - API endpoint name
   * @param {string} method - HTTP method
   * @returns {object} Tags object
   */
  createTags(scenario, endpoint, method = 'GET') {
    return {
      scenario,
      endpoint,
      method,
      environment: ENV.ENVIRONMENT,
    };
  },
};

// Safety checks to prevent accidental production testing
export function validateEnvironment() {
  const baseUrl = ENV.BASE_URL.toLowerCase();
  const apiUrl = ENV.API_URL.toLowerCase();

  const productionPatterns = [
    'prod.',
    'production.',
    '.prod.',
    '-prod.',
    'live.',
    '.healthcare.com',
    '.health.com',
  ];

  for (const pattern of productionPatterns) {
    if (baseUrl.includes(pattern) || apiUrl.includes(pattern)) {
      console.error(`
        ============================================================
        WARNING: Production environment detected!

        URL contains production pattern: ${pattern}
        BASE_URL: ${ENV.BASE_URL}
        API_URL: ${ENV.API_URL}

        Load testing against production is DISABLED by default.
        If you really need to test production, set:
        K6_ALLOW_PRODUCTION=true
        ============================================================
      `);

      if (__ENV.K6_ALLOW_PRODUCTION !== 'true') {
        throw new Error('Production testing is not allowed without explicit confirmation');
      }
    }
  }

  console.log(`Load test environment validated: ${ENV.ENVIRONMENT}`);
  console.log(`Base URL: ${ENV.BASE_URL}`);
  console.log(`API URL: ${ENV.API_URL}`);
}

export default {
  ENV,
  STANDARD_THRESHOLDS,
  CRITICAL_THRESHOLDS,
  RELAXED_THRESHOLDS,
  STANDARD_STAGES,
  TestData,
  RequestHelpers,
  Checks,
  CustomMetrics,
  validateEnvironment,
};
