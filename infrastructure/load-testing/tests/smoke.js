/**
 * Unified Health - Smoke Test
 *
 * Purpose: Verify system is working under minimal load
 * Duration: 1 minute
 * VUs: 1-5
 *
 * Run: k6 run tests/smoke.js
 */

import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");
const healthCheckDuration = new Trend("health_check_duration");

// Configuration
const BASE_URL = __ENV.K6_BASE_URL || "https://api.theunifiedhealth.com";

export const options = {
  stages: [
    { duration: "30s", target: 1 }, // Ramp up to 1 user
    { duration: "30s", target: 5 }, // Stay at 5 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests under 500ms
    http_req_failed: ["rate<0.01"], // Less than 1% errors
    errors: ["rate<0.01"],
  },
};

export default function () {
  group("Health Checks", () => {
    // API Health Check
    const healthRes = http.get(`${BASE_URL}/health`, {
      tags: { name: "HealthCheck" },
    });

    healthCheckDuration.add(healthRes.timings.duration);

    const healthCheckPassed = check(healthRes, {
      "health check status is 200": (r) => r.status === 200,
      "health check response time < 200ms": (r) => r.timings.duration < 200,
      "health check has status field": (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.status === "healthy" || body.status === "ok";
        } catch {
          return false;
        }
      },
    });

    errorRate.add(!healthCheckPassed);
  });

  group("API Readiness", () => {
    // Ready endpoint
    const readyRes = http.get(`${BASE_URL}/ready`, {
      tags: { name: "ReadyCheck" },
    });

    check(readyRes, {
      "ready check returns 200": (r) => r.status === 200,
    });
  });

  group("Public Endpoints", () => {
    // API documentation (should be publicly accessible)
    const docsRes = http.get(`${BASE_URL}/api/v1/docs`, {
      tags: { name: "APIDocs" },
    });

    check(docsRes, {
      "docs endpoint accessible": (r) => r.status === 200 || r.status === 404,
    });

    // Public provider search
    const providersRes = http.get(
      `${BASE_URL}/api/v1/providers/search?specialty=general&limit=5`,
      {
        tags: { name: "ProviderSearch" },
      },
    );

    check(providersRes, {
      "provider search returns valid response": (r) =>
        r.status === 200 || r.status === 401,
    });
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "results/smoke-summary.json": JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function textSummary(data, options) {
  const checks = data.metrics.checks;
  const httpReqs = data.metrics.http_reqs;
  const httpDuration = data.metrics.http_req_duration;

  return `
╔══════════════════════════════════════════════════════════════╗
║                 SMOKE TEST SUMMARY                            ║
╠══════════════════════════════════════════════════════════════╣
║ Total Requests:    ${httpReqs?.values?.count || 0}
║ Failed Requests:   ${data.metrics.http_req_failed?.values?.passes || 0}
║ Avg Duration:      ${httpDuration?.values?.avg?.toFixed(2) || 0}ms
║ p95 Duration:      ${httpDuration?.values?.["p(95)"]?.toFixed(2) || 0}ms
║ Checks Passed:     ${checks?.values?.passes || 0}/${(checks?.values?.passes || 0) + (checks?.values?.fails || 0)}
╚══════════════════════════════════════════════════════════════╝
`;
}
