/**
 * k6 Load Test - Standard Load Performance Test
 * Tests API performance under expected production load
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const authDuration = new Trend('auth_duration');
const readDuration = new Trend('read_duration');
const writeDuration = new Trend('write_duration');
const requestCount = new Counter('requests');

// Configuration
const BASE_URL = __ENV.K6_API_URL || 'http://localhost:3001/api/v1';

// Test users (should have multiple test users for realistic load)
const TEST_USERS = [
  { email: 'patient@test.unified.health', password: 'TestPassword123!' },
  { email: 'patient2@test.unified.health', password: 'TestPassword123!' },
  { email: 'provider@test.unified.health', password: 'TestPassword123!' },
];

// Load test options - moderate load
export const options = {
  scenarios: {
    // Constant load scenario
    constant_load: {
      executor: 'constant-vus',
      vus: 20,
      duration: '3m',
    },
    // Ramping load scenario
    ramping_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },   // Ramp up to 50 users
        { duration: '3m', target: 50 },   // Stay at 50 users
        { duration: '1m', target: 100 },  // Spike to 100 users
        { duration: '2m', target: 100 },  // Stay at 100 users
        { duration: '1m', target: 0 },    // Ramp down
      ],
      startTime: '3m', // Start after constant_load completes
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<3000', 'p(99)<5000'],
    errors: ['rate<0.05'], // Error rate under 5%
    read_duration: ['p(95)<2000'],
    write_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.05'],
  },
};

export function setup() {
  // Login all test users and collect tokens
  const tokens = [];

  for (const user of TEST_USERS) {
    const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
      email: user.email,
      password: user.password,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

    if (loginRes.status === 200) {
      tokens.push({
        email: user.email,
        token: loginRes.json('accessToken'),
      });
    }
  }

  if (tokens.length === 0) {
    console.error('No users could authenticate. Check test user credentials.');
  }

  return { tokens };
}

export default function (data) {
  if (data.tokens.length === 0) {
    sleep(1);
    return;
  }

  // Round-robin through available tokens
  const userIndex = __VU % data.tokens.length;
  const token = data.tokens[userIndex].token;

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // Simulate realistic user behavior

  // 60% read operations
  if (Math.random() < 0.6) {
    group('Read Operations', function () {
      requestCount.add(1);

      // Get user profile
      let start = Date.now();
      let res = http.get(`${BASE_URL}/auth/me`, authHeaders);
      readDuration.add(Date.now() - start);

      check(res, {
        'profile read successful': (r) => r.status === 200,
      });
      errorRate.add(res.status >= 500);

      sleep(0.5);

      // Get appointments
      start = Date.now();
      res = http.get(`${BASE_URL}/appointments`, authHeaders);
      readDuration.add(Date.now() - start);

      check(res, {
        'appointments read successful': (r) => r.status === 200 || r.status === 402,
      });
      errorRate.add(res.status >= 500);

      sleep(0.5);

      // Get documents (if available)
      start = Date.now();
      res = http.get(`${BASE_URL}/documents`, authHeaders);
      readDuration.add(Date.now() - start);

      check(res, {
        'documents accessible': (r) => r.status === 200 || r.status === 404,
      });
      errorRate.add(res.status >= 500);
    });
  }

  // 30% dashboard/stats operations
  if (Math.random() < 0.3) {
    group('Dashboard Operations', function () {
      requestCount.add(1);

      const start = Date.now();
      const res = http.get(`${BASE_URL}/dashboard/stats`, authHeaders);
      readDuration.add(Date.now() - start);

      check(res, {
        'dashboard stats accessible': (r) => r.status === 200 || r.status === 404,
      });
    });
  }

  // 10% write operations (create/update)
  if (Math.random() < 0.1) {
    group('Write Operations', function () {
      requestCount.add(1);

      // Try to create an appointment (may fail due to subscription)
      const appointmentData = {
        providerId: '00000000-0000-0000-0000-000000000001',
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'checkup',
        duration: 30,
        reason: 'Load test appointment',
      };

      const start = Date.now();
      const res = http.post(`${BASE_URL}/appointments`, JSON.stringify(appointmentData), authHeaders);
      writeDuration.add(Date.now() - start);

      check(res, {
        'appointment create handled': (r) => r.status < 500,
      });
      errorRate.add(res.status >= 500);
    });
  }

  // Think time between requests
  sleep(Math.random() * 3 + 1);
}

export function teardown(data) {
  // Logout all users
  for (const user of data.tokens) {
    http.post(`${BASE_URL}/auth/logout`, null, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
  }
}
