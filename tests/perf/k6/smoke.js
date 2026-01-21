/**
 * k6 Smoke Test - Basic Performance Verification
 * Verifies API responds correctly under minimal load
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const authDuration = new Trend('auth_duration');
const apiDuration = new Trend('api_duration');

// Configuration
const BASE_URL = __ENV.K6_API_URL || 'http://localhost:3001/api/v1';

// Test user credentials (should be seeded test users)
const TEST_USER = {
  email: __ENV.TEST_USER_EMAIL || 'patient@test.unified.health',
  password: __ENV.TEST_USER_PASSWORD || 'TestPassword123!',
};

// Smoke test options - light load
export const options = {
  stages: [
    { duration: '30s', target: 5 },  // Ramp up to 5 users
    { duration: '1m', target: 5 },   // Stay at 5 users
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be under 2s
    errors: ['rate<0.1'],              // Error rate should be under 10%
    auth_duration: ['p(95)<3000'],     // Auth should be under 3s
    api_duration: ['p(95)<1500'],      // API calls should be under 1.5s
  },
};

// Helper function for authenticated requests
function authenticatedRequest(url, options = {}) {
  return http.get(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${__ENV.AUTH_TOKEN}`,
    },
  });
}

export function setup() {
  // Login and get auth token
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: TEST_USER.email,
    password: TEST_USER.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'has access token': (r) => r.json('accessToken') !== undefined,
  });

  if (loginRes.status !== 200) {
    console.error('Login failed:', loginRes.body);
    return { token: null };
  }

  return {
    token: loginRes.json('accessToken'),
  };
}

export default function (data) {
  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
    },
  };

  // Health check (no auth required)
  group('Health Check', function () {
    const res = http.get(`${BASE_URL.replace('/api/v1', '')}/health`);
    check(res, {
      'health check status 200': (r) => r.status === 200,
    });
    errorRate.add(res.status !== 200);
  });

  sleep(1);

  // Public endpoints
  group('Public Endpoints', function () {
    const versionRes = http.get(`${BASE_URL}/version`);
    check(versionRes, {
      'version endpoint accessible': (r) => r.status === 200 || r.status === 404,
    });

    const plansRes = http.get(`${BASE_URL}/plans`);
    check(plansRes, {
      'plans endpoint accessible': (r) => r.status === 200 || r.status === 404,
    });
  });

  sleep(1);

  // Authenticated endpoints
  if (data.token) {
    group('Authenticated Endpoints', function () {
      // Get current user
      const start = Date.now();
      const meRes = http.get(`${BASE_URL}/auth/me`, authHeaders);
      authDuration.add(Date.now() - start);

      check(meRes, {
        'me endpoint status 200': (r) => r.status === 200,
        'has user data': (r) => r.json('id') !== undefined || r.json('email') !== undefined,
      });
      errorRate.add(meRes.status !== 200);
    });

    sleep(1);

    group('Appointments API', function () {
      const start = Date.now();
      const appointmentsRes = http.get(`${BASE_URL}/appointments`, authHeaders);
      apiDuration.add(Date.now() - start);

      check(appointmentsRes, {
        'appointments status 200 or 402': (r) => r.status === 200 || r.status === 402,
      });
      errorRate.add(appointmentsRes.status >= 500);
    });

    sleep(1);

    group('Dashboard API', function () {
      const start = Date.now();
      const dashboardRes = http.get(`${BASE_URL}/dashboard/stats`, authHeaders);
      apiDuration.add(Date.now() - start);

      check(dashboardRes, {
        'dashboard stats accessible': (r) => r.status === 200 || r.status === 404,
      });
    });
  }

  sleep(2);
}

export function teardown(data) {
  // Optional: logout or cleanup
  if (data.token) {
    http.post(`${BASE_URL}/auth/logout`, null, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
  }
}
