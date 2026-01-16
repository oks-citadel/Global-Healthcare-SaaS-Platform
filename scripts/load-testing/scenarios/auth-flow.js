/**
 * Authentication Flow Load Test
 * Global Healthcare SaaS Platform
 *
 * This script tests the complete authentication flow including:
 * - User login
 * - Token refresh
 * - Token validation
 * - User logout
 *
 * Usage:
 *   k6 run scripts/load-testing/scenarios/auth-flow.js
 *
 * With custom credentials:
 *   K6_TEST_USER=test@example.com K6_TEST_PASSWORD=password123 k6 run auth-flow.js
 */

import http from 'k6/http';
import { check, sleep, group, fail } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import {
  ENV,
  CRITICAL_THRESHOLDS,
  STANDARD_STAGES,
  TestData,
  RequestHelpers,
  Checks,
  validateEnvironment,
} from '../config.js';

// Custom metrics for authentication
const loginSuccess = new Rate('login_success');
const loginDuration = new Trend('login_duration');
const tokenRefreshSuccess = new Rate('token_refresh_success');
const tokenRefreshDuration = new Trend('token_refresh_duration');
const logoutSuccess = new Rate('logout_success');
const authFailures = new Counter('auth_failures');

// Test configuration
export const options = {
  // Use appropriate stages based on environment variable
  stages: __ENV.K6_STAGES === 'smoke'
    ? STANDARD_STAGES.smoke
    : __ENV.K6_STAGES === 'stress'
      ? STANDARD_STAGES.stress
      : STANDARD_STAGES.load,

  // Critical thresholds for authentication (stricter than standard)
  thresholds: {
    ...CRITICAL_THRESHOLDS,
    login_success: ['rate>0.95'],           // 95% login success rate
    login_duration: ['p(95)<300'],           // Login under 300ms
    token_refresh_success: ['rate>0.98'],   // 98% token refresh success
    token_refresh_duration: ['p(95)<100'],   // Token refresh under 100ms
    logout_success: ['rate>0.99'],          // 99% logout success
  },

  // Tags for result organization
  tags: {
    scenario: 'auth-flow',
    environment: ENV.ENVIRONMENT,
  },

  // Scenario configuration
  scenarios: {
    // Regular login/logout flow
    standard_auth: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: __ENV.K6_STAGES === 'smoke'
        ? STANDARD_STAGES.smoke
        : STANDARD_STAGES.load,
      gracefulRampDown: '30s',
      exec: 'standardAuthFlow',
    },

    // Token refresh under load
    token_refresh: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 20,
      maxVUs: 50,
      exec: 'tokenRefreshFlow',
      startTime: '30s', // Start after initial ramp-up
    },
  },

  // Graceful stop
  gracefulStop: '30s',
};

// Setup function
export function setup() {
  console.log('='.repeat(60));
  console.log('Authentication Flow Load Test');
  console.log('='.repeat(60));

  // Validate environment
  validateEnvironment();

  // Get test credentials
  const credentials = TestData.testCredentials();

  console.log(`\nTest User: ${credentials.email}`);
  console.log(`Auth URL: ${ENV.AUTH_URL}`);

  // Verify auth service is available
  const healthCheck = http.get(`${ENV.AUTH_URL}/health`, { timeout: '10s' });

  if (healthCheck.status !== 200) {
    console.error('Auth service health check failed!');
    console.error(`Status: ${healthCheck.status}`);
    fail('Auth service is not available');
  }

  console.log('Auth service is healthy\n');

  return {
    startTime: Date.now(),
    credentials,
    // Store tokens for token refresh tests
    sharedTokens: [],
  };
}

// Standard authentication flow
export function standardAuthFlow(data) {
  const credentials = data.credentials;
  let authToken = null;
  let refreshToken = null;

  // Step 1: Login
  group('Login', function() {
    const result = performLogin(credentials.email, credentials.password);
    if (result.success) {
      authToken = result.authToken;
      refreshToken = result.refreshToken;
    }
  });

  // Small pause between operations
  sleep(1);

  // Step 2: Validate token (if login succeeded)
  if (authToken) {
    group('Validate Token', function() {
      validateToken(authToken);
    });

    sleep(0.5);

    // Step 3: Access protected resource
    group('Access Protected Resource', function() {
      accessProtectedResource(authToken);
    });

    sleep(0.5);

    // Step 4: Refresh token
    if (refreshToken) {
      group('Refresh Token', function() {
        const result = performTokenRefresh(refreshToken);
        if (result.success) {
          authToken = result.authToken;
          refreshToken = result.refreshToken;
        }
      });
    }

    sleep(0.5);

    // Step 5: Logout
    group('Logout', function() {
      performLogout(authToken);
    });
  }

  // Delay before next iteration
  sleep(Math.random() * 2 + 1);
}

// Token refresh flow (for high-frequency refresh testing)
export function tokenRefreshFlow(data) {
  // For this test, we'll simulate already logged-in users refreshing tokens
  // In a real scenario, you might pre-create tokens in setup()

  const credentials = data.credentials;

  // Quick login to get tokens
  const loginResult = performLogin(credentials.email, credentials.password, { silent: true });

  if (loginResult.success && loginResult.refreshToken) {
    // Perform token refresh
    const refreshResult = performTokenRefresh(loginResult.refreshToken);

    if (refreshResult.success) {
      // Logout with new token
      performLogout(refreshResult.authToken, { silent: true });
    }
  }

  sleep(0.5);
}

// Perform login
function performLogin(email, password, options = {}) {
  const startTime = Date.now();

  const payload = JSON.stringify({
    email: email,
    password: password,
  });

  const params = RequestHelpers.getParams({
    headers: RequestHelpers.getHeaders(),
    tags: {
      name: 'login',
      endpoint: '/login',
    },
  });

  const response = http.post(`${ENV.AUTH_URL}/login`, payload, params);
  const duration = Date.now() - startTime;

  // Record metrics
  loginDuration.add(duration);

  // Check response
  const passed = check(response, {
    'login - status is 200': Checks.isStatus200,
    'login - response is JSON': Checks.isValidJson,
    'login - has access token': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.accessToken || body.access_token || body.token;
      } catch {
        return false;
      }
    },
    'login - response time acceptable': (r) => r.timings.duration < 500,
  });

  loginSuccess.add(passed ? 1 : 0);

  if (!passed) {
    authFailures.add(1, { operation: 'login' });
    if (!options.silent) {
      console.error(`Login failed: ${response.status} - ${response.body?.substring(0, 100)}`);
    }
    return { success: false };
  }

  // Extract tokens
  try {
    const body = JSON.parse(response.body);
    return {
      success: true,
      authToken: body.accessToken || body.access_token || body.token,
      refreshToken: body.refreshToken || body.refresh_token,
      expiresIn: body.expiresIn || body.expires_in,
    };
  } catch {
    return { success: false };
  }
}

// Validate token
function validateToken(token) {
  const params = RequestHelpers.getParams({
    headers: RequestHelpers.getHeaders(token),
    tags: {
      name: 'validate-token',
      endpoint: '/validate',
    },
  });

  const response = http.get(`${ENV.AUTH_URL}/validate`, params);

  const passed = check(response, {
    'validate - status is 200': Checks.isStatus200,
    'validate - token is valid': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.valid === true || body.isValid === true;
      } catch {
        return r.status === 200;
      }
    },
    'validate - response time acceptable': (r) => r.timings.duration < 100,
  });

  if (!passed) {
    authFailures.add(1, { operation: 'validate' });
  }

  return passed;
}

// Access protected resource
function accessProtectedResource(token) {
  const params = RequestHelpers.getParams({
    headers: RequestHelpers.getHeaders(token),
    tags: {
      name: 'protected-resource',
      endpoint: '/me',
    },
  });

  const response = http.get(`${ENV.AUTH_URL}/me`, params);

  const passed = check(response, {
    'protected - status is 200': Checks.isStatus200,
    'protected - has user data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.id || body.userId || body.user;
      } catch {
        return false;
      }
    },
    'protected - response time acceptable': (r) => r.timings.duration < 200,
  });

  if (!passed) {
    authFailures.add(1, { operation: 'protected-access' });
  }

  return passed;
}

// Perform token refresh
function performTokenRefresh(refreshToken) {
  const startTime = Date.now();

  const payload = JSON.stringify({
    refreshToken: refreshToken,
  });

  const params = RequestHelpers.getParams({
    headers: RequestHelpers.getHeaders(),
    tags: {
      name: 'token-refresh',
      endpoint: '/refresh',
    },
  });

  const response = http.post(`${ENV.AUTH_URL}/refresh`, payload, params);
  const duration = Date.now() - startTime;

  // Record metrics
  tokenRefreshDuration.add(duration);

  const passed = check(response, {
    'refresh - status is 200': Checks.isStatus200,
    'refresh - has new access token': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.accessToken || body.access_token || body.token;
      } catch {
        return false;
      }
    },
    'refresh - response time acceptable': (r) => r.timings.duration < 150,
  });

  tokenRefreshSuccess.add(passed ? 1 : 0);

  if (!passed) {
    authFailures.add(1, { operation: 'refresh' });
    return { success: false };
  }

  // Extract new tokens
  try {
    const body = JSON.parse(response.body);
    return {
      success: true,
      authToken: body.accessToken || body.access_token || body.token,
      refreshToken: body.refreshToken || body.refresh_token || refreshToken,
    };
  } catch {
    return { success: false };
  }
}

// Perform logout
function performLogout(token, options = {}) {
  const params = RequestHelpers.getParams({
    headers: RequestHelpers.getHeaders(token),
    tags: {
      name: 'logout',
      endpoint: '/logout',
    },
  });

  const response = http.post(`${ENV.AUTH_URL}/logout`, null, params);

  const passed = check(response, {
    'logout - status is 200 or 204': (r) => r.status === 200 || r.status === 204,
    'logout - response time acceptable': (r) => r.timings.duration < 100,
  });

  logoutSuccess.add(passed ? 1 : 0);

  if (!passed) {
    authFailures.add(1, { operation: 'logout' });
    if (!options.silent) {
      console.error(`Logout failed: ${response.status}`);
    }
  }

  return passed;
}

// Additional test scenarios
export function failedLoginAttempts() {
  // Test rate limiting and failed login handling
  group('Failed Login Attempts', function() {
    const invalidCredentials = [
      { email: 'invalid@test.com', password: 'wrongpassword' },
      { email: 'nonexistent@test.com', password: 'test123' },
      { email: '', password: '' },
      { email: 'sql@injection.com', password: "' OR '1'='1" },
    ];

    for (const creds of invalidCredentials) {
      const payload = JSON.stringify(creds);

      const response = http.post(
        `${ENV.AUTH_URL}/login`,
        payload,
        RequestHelpers.getParams({
          headers: RequestHelpers.getHeaders(),
          tags: { name: 'failed-login-attempt' },
        })
      );

      check(response, {
        'failed login - returns 401 or 400': (r) =>
          r.status === 401 || r.status === 400,
        'failed login - no token in response': (r) => {
          try {
            const body = JSON.parse(r.body);
            return !body.accessToken && !body.access_token && !body.token;
          } catch {
            return true;
          }
        },
      });

      sleep(0.5); // Avoid triggering rate limits too aggressively
    }
  });
}

// Teardown function
export function teardown(data) {
  const duration = ((Date.now() - data.startTime) / 1000).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('Authentication Flow Load Test Complete');
  console.log('='.repeat(60));
  console.log(`Total Duration: ${duration}s`);
  console.log(`Environment: ${ENV.ENVIRONMENT}`);
  console.log(`Auth URL: ${ENV.AUTH_URL}`);
  console.log('='.repeat(60));
}

// Handle summary output
export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    scenario: 'auth-flow',
    environment: ENV.ENVIRONMENT,
    authUrl: ENV.AUTH_URL,
    metrics: {
      http_reqs: data.metrics.http_reqs?.values?.count || 0,
      http_req_duration_p95: data.metrics.http_req_duration?.values?.['p(95)'] || 0,
      login_success_rate: data.metrics.login_success?.values?.rate || 0,
      login_duration_p95: data.metrics.login_duration?.values?.['p(95)'] || 0,
      token_refresh_success_rate: data.metrics.token_refresh_success?.values?.rate || 0,
      logout_success_rate: data.metrics.logout_success?.values?.rate || 0,
      auth_failures: data.metrics.auth_failures?.values?.count || 0,
    },
    thresholds: {
      passed: Object.values(data.thresholds || {}).every(t => t.ok),
    },
  };

  return {
    'stdout': textSummary(data),
    'results/auth-flow-summary.json': JSON.stringify(summary, null, 2),
  };
}

// Text summary generator
function textSummary(data) {
  const lines = [
    '',
    '='.repeat(60),
    'Authentication Flow - Results Summary',
    '='.repeat(60),
    '',
    `Total Requests: ${data.metrics.http_reqs?.values?.count || 'N/A'}`,
    `Request Duration (p95): ${(data.metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`,
    '',
    'Authentication Metrics:',
    `  Login Success Rate: ${((data.metrics.login_success?.values?.rate || 0) * 100).toFixed(2)}%`,
    `  Login Duration (p95): ${(data.metrics.login_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`,
    `  Token Refresh Success: ${((data.metrics.token_refresh_success?.values?.rate || 0) * 100).toFixed(2)}%`,
    `  Logout Success Rate: ${((data.metrics.logout_success?.values?.rate || 0) * 100).toFixed(2)}%`,
    `  Auth Failures: ${data.metrics.auth_failures?.values?.count || 0}`,
    '',
    '='.repeat(60),
  ];

  return lines.join('\n');
}
