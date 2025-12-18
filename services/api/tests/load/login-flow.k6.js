import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

/**
 * K6 Load Test: Login Flow
 * Tests authentication endpoint performance under load
 */

// Custom metrics
const loginSuccessRate = new Rate('login_success_rate');
const loginDuration = new Trend('login_duration');
const loginErrors = new Counter('login_errors');
const registrationSuccessRate = new Rate('registration_success_rate');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 50 },    // Ramp up to 50 users
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '2m', target: 100 },   // Stay at 100 users
    { duration: '1m', target: 50 },    // Ramp down to 50 users
    { duration: '30s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% of requests < 500ms, 99% < 1s
    http_req_failed: ['rate<0.05'],                  // Error rate < 5%
    login_success_rate: ['rate>0.95'],               // Success rate > 95%
    login_duration: ['p(95)<400', 'p(99)<800'],      // Login-specific thresholds
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:8080';

// Generate unique email for each VU (Virtual User)
function generateEmail() {
  return `loadtest-${__VU}-${Date.now()}@example.com`;
}

// Setup: Create test users
export function setup() {
  console.log('Setting up test data...');
  const users = [];

  // Create 10 test users for login tests
  for (let i = 0; i < 10; i++) {
    const email = `setup-user-${i}-${Date.now()}@example.com`;
    const password = 'TestPassword123!@#';

    const payload = JSON.stringify({
      email,
      password,
      firstName: `LoadTest${i}`,
      lastName: 'User',
      role: 'patient',
    });

    const params = {
      headers: { 'Content-Type': 'application/json' },
    };

    const res = http.post(`${BASE_URL}/api/v1/auth/register`, payload, params);

    if (res.status === 201) {
      users.push({ email, password });
      console.log(`Created test user: ${email}`);
    }
  }

  return { users };
}

// Main test scenario
export default function (data) {
  const scenario = Math.random();

  if (scenario < 0.7) {
    // 70% of traffic: Login with existing users
    testLogin(data.users);
  } else {
    // 30% of traffic: New user registration
    testRegistration();
  }

  sleep(1); // Think time between requests
}

// Test user login
function testLogin(users) {
  if (!users || users.length === 0) {
    console.log('No users available for login test');
    return;
  }

  const user = users[Math.floor(Math.random() * users.length)];

  const payload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'Login' },
  };

  const startTime = new Date();
  const res = http.post(`${BASE_URL}/api/v1/auth/login`, payload, params);
  const duration = new Date() - startTime;

  // Record metrics
  loginDuration.add(duration);

  // Check response
  const success = check(res, {
    'login status is 200': (r) => r.status === 200,
    'login has accessToken': (r) => r.json('accessToken') !== undefined,
    'login has refreshToken': (r) => r.json('refreshToken') !== undefined,
    'login has user object': (r) => r.json('user') !== undefined,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });

  loginSuccessRate.add(success);

  if (!success) {
    loginErrors.add(1);
    console.log(`Login failed: ${res.status} - ${res.body}`);
  }

  // Test token refresh if login successful
  if (res.status === 200) {
    const refreshToken = res.json('refreshToken');
    testTokenRefresh(refreshToken);
  }
}

// Test new user registration
function testRegistration() {
  const email = generateEmail();
  const payload = JSON.stringify({
    email,
    password: 'TestPassword123!@#',
    firstName: 'LoadTest',
    lastName: 'User',
    role: 'patient',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'Register' },
  };

  const res = http.post(`${BASE_URL}/api/v1/auth/register`, payload, params);

  const success = check(res, {
    'registration status is 201': (r) => r.status === 201,
    'registration has accessToken': (r) => r.json('accessToken') !== undefined,
    'registration has user': (r) => r.json('user') !== undefined,
    'registration response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  registrationSuccessRate.add(success);

  if (!success) {
    console.log(`Registration failed: ${res.status} - ${res.body}`);
  }
}

// Test token refresh
function testTokenRefresh(refreshToken) {
  const payload = JSON.stringify({ refreshToken });

  const params = {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'TokenRefresh' },
  };

  const res = http.post(`${BASE_URL}/api/v1/auth/refresh`, payload, params);

  check(res, {
    'refresh status is 200': (r) => r.status === 200,
    'refresh has new accessToken': (r) => r.json('accessToken') !== undefined,
    'refresh response time < 300ms': (r) => r.timings.duration < 300,
  });
}

// Teardown
export function teardown(data) {
  console.log('Load test completed!');
  console.log(`Total users created: ${data.users.length}`);
}

/**
 * Run this test with:
 * k6 run login-flow.k6.js
 *
 * Or with custom parameters:
 * k6 run --vus 100 --duration 5m login-flow.k6.js
 *
 * Or with environment variable:
 * API_URL=https://api.example.com k6 run login-flow.k6.js
 */
