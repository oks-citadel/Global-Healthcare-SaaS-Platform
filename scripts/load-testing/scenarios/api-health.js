/**
 * API Health Check Load Test
 * Global Healthcare SaaS Platform
 *
 * This script tests the health and readiness endpoints of the platform services.
 * It verifies that all services are responding correctly under load.
 *
 * Usage:
 *   k6 run scripts/load-testing/scenarios/api-health.js
 *
 * With custom base URL:
 *   K6_BASE_URL=http://staging.example.com k6 run scripts/load-testing/scenarios/api-health.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import {
  ENV,
  STANDARD_THRESHOLDS,
  STANDARD_STAGES,
  RequestHelpers,
  Checks,
  validateEnvironment,
} from '../config.js';

// Custom metrics for health checks
const healthCheckSuccess = new Rate('health_check_success');
const healthCheckDuration = new Trend('health_check_duration');
const serviceUnavailable = new Counter('service_unavailable');

// Test configuration
export const options = {
  // Use load test stages by default, can be overridden
  stages: __ENV.K6_STAGES === 'smoke'
    ? STANDARD_STAGES.smoke
    : __ENV.K6_STAGES === 'stress'
      ? STANDARD_STAGES.stress
      : STANDARD_STAGES.load,

  // Standard thresholds plus custom health check thresholds
  thresholds: {
    ...STANDARD_THRESHOLDS,
    health_check_success: ['rate>0.99'],     // 99% health checks must pass
    health_check_duration: ['p(95)<100'],    // Health checks should be fast
  },

  // Tags for result organization
  tags: {
    scenario: 'api-health',
    environment: ENV.ENVIRONMENT,
  },

  // Graceful stop
  gracefulStop: '30s',
};

// Setup function - runs once before the test
export function setup() {
  console.log('='.repeat(60));
  console.log('API Health Check Load Test');
  console.log('='.repeat(60));

  // Validate we're not hitting production
  validateEnvironment();

  // Initial connectivity check
  const healthEndpoints = getHealthEndpoints();

  console.log('\nTesting initial connectivity...');
  for (const endpoint of healthEndpoints) {
    try {
      const res = http.get(endpoint.url, { timeout: '10s' });
      console.log(`  ${endpoint.name}: ${res.status} (${res.timings.duration.toFixed(0)}ms)`);
    } catch (e) {
      console.log(`  ${endpoint.name}: FAILED - ${e.message}`);
    }
  }

  console.log('\nStarting load test...\n');

  return {
    startTime: Date.now(),
    healthEndpoints,
  };
}

// Get health check endpoints
function getHealthEndpoints() {
  return [
    {
      name: 'Web App Health',
      url: `${ENV.BASE_URL}/health`,
      expectedStatus: 200,
      critical: true,
    },
    {
      name: 'Web App Readiness',
      url: `${ENV.BASE_URL}/ready`,
      expectedStatus: 200,
      critical: true,
    },
    {
      name: 'API Gateway Health',
      url: `${ENV.API_URL}/health`,
      expectedStatus: 200,
      critical: true,
    },
    {
      name: 'API Gateway Readiness',
      url: `${ENV.API_URL}/ready`,
      expectedStatus: 200,
      critical: true,
    },
    {
      name: 'Auth Service Health',
      url: `${ENV.AUTH_URL}/health`,
      expectedStatus: 200,
      critical: true,
    },
    {
      name: 'API Version',
      url: `${ENV.API_URL}/version`,
      expectedStatus: 200,
      critical: false,
    },
    {
      name: 'API Status',
      url: `${ENV.API_URL}/status`,
      expectedStatus: 200,
      critical: false,
    },
  ];
}

// Main test function - runs for each virtual user iteration
export default function(data) {
  const endpoints = data.healthEndpoints || getHealthEndpoints();

  // Test each health endpoint
  for (const endpoint of endpoints) {
    group(endpoint.name, function() {
      testHealthEndpoint(endpoint);
    });
  }

  // Small sleep between iterations to simulate realistic polling
  sleep(Math.random() * 2 + 1); // 1-3 seconds
}

// Test a single health endpoint
function testHealthEndpoint(endpoint) {
  const startTime = Date.now();

  const params = RequestHelpers.getParams({
    tags: {
      name: endpoint.name,
      endpoint: endpoint.url,
      critical: endpoint.critical.toString(),
    },
  });

  const response = http.get(endpoint.url, params);
  const duration = Date.now() - startTime;

  // Record custom metrics
  healthCheckDuration.add(duration, { endpoint: endpoint.name });

  // Perform checks
  const passed = check(response, {
    [`${endpoint.name} - status is ${endpoint.expectedStatus}`]:
      (r) => r.status === endpoint.expectedStatus,
    [`${endpoint.name} - response time OK`]:
      (r) => r.timings.duration < 200,
    [`${endpoint.name} - has body`]:
      (r) => r.body && r.body.length > 0,
  });

  // Update success rate metric
  healthCheckSuccess.add(passed ? 1 : 0, { endpoint: endpoint.name });

  // Track service unavailability
  if (response.status === 503 || response.status === 0) {
    serviceUnavailable.add(1, { endpoint: endpoint.name });
  }

  // Log failures for debugging (only in verbose mode)
  if (!passed && __ENV.K6_VERBOSE === 'true') {
    console.error(`Health check failed: ${endpoint.name}`);
    console.error(`  Status: ${response.status}`);
    console.error(`  Duration: ${response.timings.duration}ms`);
    console.error(`  Body: ${response.body ? response.body.substring(0, 200) : 'empty'}`);
  }

  return passed;
}

// Additional health check scenarios
export function deepHealthCheck() {
  // Extended health check that verifies dependencies
  group('Deep Health Check', function() {
    const deepHealthUrl = `${ENV.API_URL}/health/deep`;

    const response = http.get(deepHealthUrl, RequestHelpers.getParams({
      timeout: '30s', // Deep checks may take longer
      tags: { name: 'deep-health-check' },
    }));

    const checks = check(response, {
      'deep health check - status 200': Checks.isStatus200,
      'deep health check - valid JSON': Checks.isValidJson,
      'deep health check - all dependencies healthy': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.status === 'healthy' || body.status === 'ok';
        } catch {
          return false;
        }
      },
    });

    // Parse and log dependency status
    if (response.status === 200 && __ENV.K6_VERBOSE === 'true') {
      try {
        const health = JSON.parse(response.body);
        console.log('Dependency Status:');
        if (health.dependencies) {
          for (const [name, status] of Object.entries(health.dependencies)) {
            console.log(`  ${name}: ${status.status || status}`);
          }
        }
      } catch {
        // Ignore parse errors
      }
    }

    return checks;
  });
}

// Teardown function - runs once after the test
export function teardown(data) {
  const duration = ((Date.now() - data.startTime) / 1000).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('API Health Check Load Test Complete');
  console.log('='.repeat(60));
  console.log(`Total Duration: ${duration}s`);
  console.log(`Environment: ${ENV.ENVIRONMENT}`);
  console.log(`Base URL: ${ENV.BASE_URL}`);
  console.log('='.repeat(60));
}

// Handle summary output
export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    scenario: 'api-health',
    environment: ENV.ENVIRONMENT,
    baseUrl: ENV.BASE_URL,
    metrics: {
      http_reqs: data.metrics.http_reqs?.values?.count || 0,
      http_req_duration_p95: data.metrics.http_req_duration?.values?.['p(95)'] || 0,
      http_req_failed_rate: data.metrics.http_req_failed?.values?.rate || 0,
      health_check_success_rate: data.metrics.health_check_success?.values?.rate || 0,
    },
    passed: data.root_group?.checks?.every(c => c.passes > 0) || false,
  };

  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'results/api-health-summary.json': JSON.stringify(summary, null, 2),
  };
}

// Simple text summary generator
function textSummary(data, opts) {
  const lines = [
    '',
    '='.repeat(60),
    'API Health Check - Results Summary',
    '='.repeat(60),
    '',
    `Total Requests: ${data.metrics.http_reqs?.values?.count || 'N/A'}`,
    `Request Duration (p95): ${(data.metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`,
    `Failed Requests: ${((data.metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2)}%`,
    `Health Check Success: ${((data.metrics.health_check_success?.values?.rate || 0) * 100).toFixed(2)}%`,
    '',
    '='.repeat(60),
  ];

  return lines.join('\n');
}
