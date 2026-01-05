/**
 * Unified Health - Stress Test
 *
 * Purpose: Find system breaking point and identify bottlenecks
 * Duration: 20 minutes
 * VUs: 100-500 (progressively increasing)
 *
 * Run: k6 run tests/stress.js
 */

import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend, Counter } from "k6/metrics";
import {
  randomItem,
  randomIntBetween,
} from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

// Custom metrics
const errorRate = new Rate("errors");
const breakingPointReached = new Counter("breaking_point_reached");
const apiLatency = new Trend("api_latency");

// Configuration
const BASE_URL = __ENV.K6_BASE_URL || "https://api.theunifiedhealth.com";
const API_VERSION = "v1";

export const options = {
  stages: [
    { duration: "2m", target: 100 }, // Warm up to 100 users
    { duration: "3m", target: 200 }, // Scale to 200 users
    { duration: "3m", target: 300 }, // Scale to 300 users
    { duration: "3m", target: 400 }, // Scale to 400 users
    { duration: "3m", target: 500 }, // Scale to 500 users (stress)
    { duration: "3m", target: 500 }, // Hold at 500 users
    { duration: "3m", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000"], // Relaxed: 95% under 1s
    http_req_failed: ["rate<0.10"], // Allow up to 10% errors under stress
    errors: ["rate<0.15"], // Custom error threshold
  },
};

export default function () {
  const headers = { "Content-Type": "application/json" };

  // Mix of operations to stress the system
  const operations = [
    { weight: 40, fn: () => apiCalls(headers) },
    { weight: 30, fn: () => searchOperations(headers) },
    { weight: 20, fn: () => writeOperations(headers) },
    { weight: 10, fn: () => heavyOperations(headers) },
  ];

  weightedRandom(operations)();

  sleep(randomIntBetween(0.5, 2));
}

function apiCalls(headers) {
  group("API Stress", () => {
    // Health check (lightweight)
    const healthRes = http.get(`${BASE_URL}/health`, {
      tags: { name: "HealthCheck", type: "health" },
    });

    const healthOk = check(healthRes, {
      "health check ok": (r) => r.status === 200,
    });

    if (!healthOk) {
      breakingPointReached.add(1);
    }

    errorRate.add(!healthOk);
    apiLatency.add(healthRes.timings.duration);

    // Multiple API calls in sequence
    const endpoints = [
      "/api/v1/providers/specialties",
      "/api/v1/providers/locations",
      "/api/v1/config/public",
    ];

    for (const endpoint of endpoints) {
      const res = http.get(`${BASE_URL}${endpoint}`, {
        headers,
        tags: { name: "APIEndpoint", type: "api" },
      });

      check(res, {
        "endpoint responds": (r) => r.status < 500,
      });

      apiLatency.add(res.timings.duration);

      if (res.status >= 500) {
        breakingPointReached.add(1);
        errorRate.add(1);
      }
    }
  });
}

function searchOperations(headers) {
  group("Search Stress", () => {
    const specialties = [
      "general",
      "cardiology",
      "dermatology",
      "orthopedics",
      "pediatrics",
      "neurology",
      "oncology",
    ];
    const locations = [
      "new-york",
      "los-angeles",
      "chicago",
      "houston",
      "phoenix",
      "philadelphia",
      "san-antonio",
    ];

    // Multiple concurrent searches
    const requests = [];
    for (let i = 0; i < 5; i++) {
      const specialty = randomItem(specialties);
      const location = randomItem(locations);
      requests.push({
        method: "GET",
        url: `${BASE_URL}/api/${API_VERSION}/providers/search?specialty=${specialty}&location=${location}&limit=20`,
        params: { headers, tags: { name: "SearchBatch", type: "search" } },
      });
    }

    const responses = http.batch(requests);

    let errors = 0;
    for (const res of responses) {
      apiLatency.add(res.timings.duration);
      if (res.status >= 500) {
        errors++;
        breakingPointReached.add(1);
      }
    }

    errorRate.add(errors / responses.length);

    check(responses, {
      "batch searches complete": (r) => r.every((res) => res.status < 500),
    });
  });
}

function writeOperations(headers) {
  group("Write Stress", () => {
    // Simulate write-heavy operations
    const payload = JSON.stringify({
      name: `StressTest-${Date.now()}`,
      email: `stress-${Date.now()}@test.com`,
      phone: "+1555" + Math.floor(Math.random() * 10000000),
    });

    // Contact form submission
    const contactRes = http.post(
      `${BASE_URL}/api/${API_VERSION}/contact`,
      payload,
      { headers, tags: { name: "ContactSubmit", type: "write" } },
    );

    check(contactRes, {
      "contact submission handled": (r) => r.status < 500,
    });

    apiLatency.add(contactRes.timings.duration);

    if (contactRes.status >= 500) {
      breakingPointReached.add(1);
      errorRate.add(1);
    }

    // Newsletter subscription
    const newsletterRes = http.post(
      `${BASE_URL}/api/${API_VERSION}/newsletter/subscribe`,
      JSON.stringify({ email: `stress-${Date.now()}@test.com` }),
      { headers, tags: { name: "Newsletter", type: "write" } },
    );

    apiLatency.add(newsletterRes.timings.duration);
  });
}

function heavyOperations(headers) {
  group("Heavy Operations", () => {
    // Operations that typically stress the database
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + randomIntBetween(1, 30));
    const dateStr = tomorrow.toISOString().split("T")[0];

    // Complex availability query
    const availRes = http.get(
      `${BASE_URL}/api/${API_VERSION}/appointments/availability?startDate=${dateStr}&endDate=${dateStr}&providerId=*&includeAll=true`,
      {
        headers,
        tags: { name: "AvailabilityQuery", type: "heavy" },
        timeout: "30s",
      },
    );

    check(availRes, {
      "availability query handled": (r) => r.status < 500,
    });

    apiLatency.add(availRes.timings.duration);

    if (availRes.status >= 500) {
      breakingPointReached.add(1);
      errorRate.add(1);
    }

    // Report generation
    const reportRes = http.get(
      `${BASE_URL}/api/${API_VERSION}/reports/summary?period=monthly`,
      {
        headers,
        tags: { name: "ReportGeneration", type: "heavy" },
        timeout: "60s",
      },
    );

    apiLatency.add(reportRes.timings.duration);

    if (reportRes.status >= 500) {
      breakingPointReached.add(1);
    }
  });
}

function weightedRandom(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item.fn;
    }
  }

  return items[items.length - 1].fn;
}

export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return {
    [`results/stress-${timestamp}.json`]: JSON.stringify(data, null, 2),
    stdout: generateStressSummary(data),
  };
}

function generateStressSummary(data) {
  const httpDuration = data.metrics.http_req_duration?.values || {};
  const httpReqs = data.metrics.http_reqs?.values || {};
  const errors = data.metrics.errors?.values || {};
  const breakingPoints = data.metrics.breaking_point_reached?.values || {};

  const p95 = httpDuration["p(95)"] || 0;
  const errorPct = (errors.rate || 0) * 100;

  let status = "✅ PASSED";
  if (p95 > 1000 || errorPct > 10) {
    status = "⚠️ DEGRADED";
  }
  if (p95 > 2000 || errorPct > 20) {
    status = "❌ BREAKING POINT REACHED";
  }

  return `
╔══════════════════════════════════════════════════════════════════════╗
║                      STRESS TEST RESULTS                              ║
╠══════════════════════════════════════════════════════════════════════╣
║  STATUS: ${status}
║                                                                       ║
║  LOAD METRICS                                                         ║
║    Total Requests:  ${httpReqs.count || 0}
║    Request Rate:    ${httpReqs.rate?.toFixed(2) || 0}/s
║    Breaking Points: ${breakingPoints.count || 0}
║                                                                       ║
║  RESPONSE TIMES                                                       ║
║    Average:         ${httpDuration.avg?.toFixed(2) || 0}ms
║    p50:             ${httpDuration["p(50)"]?.toFixed(2) || 0}ms
║    p95:             ${p95.toFixed(2)}ms
║    p99:             ${httpDuration["p(99)"]?.toFixed(2) || 0}ms
║    Max:             ${httpDuration.max?.toFixed(2) || 0}ms
║                                                                       ║
║  ERROR ANALYSIS                                                       ║
║    Error Rate:      ${errorPct.toFixed(2)}%
║    5xx Errors:      ${data.metrics.http_req_failed?.values?.passes || 0}
║                                                                       ║
║  CAPACITY ANALYSIS                                                    ║
║    Max Sustainable: ~${Math.floor((httpReqs.rate || 0) * (1 - (errors.rate || 0)))} req/s
║    Breaking VUs:    ${breakingPoints.count > 10 ? "System stressed" : "Not reached"}
╚══════════════════════════════════════════════════════════════════════╝

RECOMMENDATIONS:
${p95 > 500 ? "- Consider adding more application replicas\n" : ""}${errorPct > 5 ? "- Investigate error causes and add circuit breakers\n" : ""}${httpDuration.max > 5000 ? "- Review slow queries and add caching\n" : ""}${breakingPoints.count > 50 ? "- System needs horizontal scaling before production\n" : ""}
`;
}
