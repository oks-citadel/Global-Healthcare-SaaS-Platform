/**
 * Unified Health - Load Test
 *
 * Purpose: Test system under expected normal load
 * Duration: 10 minutes
 * VUs: 50-100
 * Target: 1000 requests/second
 *
 * Run: k6 run tests/load.js
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
const apiLatency = new Trend("api_latency");
const successfulLogins = new Counter("successful_logins");
const appointmentBookings = new Counter("appointment_bookings");

// Configuration
const BASE_URL = __ENV.K6_BASE_URL || "https://api.theunifiedhealth.com";
const API_VERSION = "v1";

// Test data
const TEST_USERS = [
  { email: "loadtest1@example.com", password: "TestPass123!" },
  { email: "loadtest2@example.com", password: "TestPass123!" },
  { email: "loadtest3@example.com", password: "TestPass123!" },
];

const SPECIALTIES = [
  "general",
  "cardiology",
  "dermatology",
  "orthopedics",
  "pediatrics",
];
const LOCATIONS = ["new-york", "los-angeles", "chicago", "houston", "phoenix"];

export const options = {
  stages: [
    { duration: "2m", target: 50 }, // Ramp up to 50 users
    { duration: "5m", target: 100 }, // Stay at 100 users
    { duration: "2m", target: 100 }, // Continue at 100 users
    { duration: "1m", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<200", "p(99)<500"], // Performance targets
    http_req_failed: ["rate<0.01"], // Less than 1% errors
    errors: ["rate<0.05"], // Less than 5% custom errors
    api_latency: ["p(95)<300"], // API latency target
  },
};

// Shared state for authenticated requests
let authToken = null;

export function setup() {
  // Pre-test setup - authenticate test user
  console.log("Setting up load test...");

  const loginRes = http.post(
    `${BASE_URL}/api/${API_VERSION}/auth/login`,
    JSON.stringify({
      email: TEST_USERS[0].email,
      password: TEST_USERS[0].password,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  if (loginRes.status === 200) {
    const body = JSON.parse(loginRes.body);
    return { token: body.accessToken || body.token };
  }

  console.warn("Setup login failed, tests will run without authentication");
  return { token: null };
}

export default function (data) {
  const token = data.token;
  const headers = token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };

  // Randomly select test scenario (weighted)
  const scenario = weightedRandom([
    { weight: 30, fn: () => healthCheck() },
    { weight: 25, fn: () => providerSearch(headers) },
    { weight: 20, fn: () => appointmentOperations(headers) },
    { weight: 15, fn: () => patientOperations(headers) },
    { weight: 10, fn: () => authenticationFlow() },
  ]);

  scenario();

  sleep(randomIntBetween(1, 3));
}

function healthCheck() {
  group("Health Check", () => {
    const res = http.get(`${BASE_URL}/health`, {
      tags: { name: "HealthCheck", type: "health" },
    });

    const success = check(res, {
      "health check is 200": (r) => r.status === 200,
      "health check < 100ms": (r) => r.timings.duration < 100,
    });

    errorRate.add(!success);
    apiLatency.add(res.timings.duration);
  });
}

function providerSearch(headers) {
  group("Provider Search", () => {
    const specialty = randomItem(SPECIALTIES);
    const location = randomItem(LOCATIONS);

    // Search providers
    const searchRes = http.get(
      `${BASE_URL}/api/${API_VERSION}/providers/search?specialty=${specialty}&location=${location}&limit=10`,
      { headers, tags: { name: "ProviderSearch", type: "search" } },
    );

    const searchSuccess = check(searchRes, {
      "provider search status 200": (r) => r.status === 200,
      "provider search has results": (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.data || body.providers || body);
        } catch {
          return false;
        }
      },
      "provider search < 200ms": (r) => r.timings.duration < 200,
    });

    errorRate.add(!searchSuccess);
    apiLatency.add(searchRes.timings.duration);

    // Get provider details (if search succeeded)
    if (searchRes.status === 200) {
      try {
        const providers = JSON.parse(searchRes.body);
        const providerList = providers.data || providers.providers || providers;
        if (Array.isArray(providerList) && providerList.length > 0) {
          const provider = randomItem(providerList);
          const providerId = provider.id || provider.providerId;

          if (providerId) {
            const detailRes = http.get(
              `${BASE_URL}/api/${API_VERSION}/providers/${providerId}`,
              { headers, tags: { name: "ProviderDetail", type: "detail" } },
            );

            check(detailRes, {
              "provider detail status 200": (r) => r.status === 200,
            });

            apiLatency.add(detailRes.timings.duration);
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  });
}

function appointmentOperations(headers) {
  group("Appointment Operations", () => {
    // Get available slots
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const slotsRes = http.get(
      `${BASE_URL}/api/${API_VERSION}/appointments/slots?date=${dateStr}&providerId=test-provider`,
      { headers, tags: { name: "AvailableSlots", type: "appointment" } },
    );

    const slotsSuccess = check(slotsRes, {
      "slots endpoint responds": (r) =>
        r.status === 200 || r.status === 401 || r.status === 404,
      "slots response < 300ms": (r) => r.timings.duration < 300,
    });

    errorRate.add(!slotsSuccess && slotsRes.status >= 500);
    apiLatency.add(slotsRes.timings.duration);

    // List user appointments
    const listRes = http.get(
      `${BASE_URL}/api/${API_VERSION}/appointments?status=upcoming&limit=10`,
      { headers, tags: { name: "ListAppointments", type: "appointment" } },
    );

    check(listRes, {
      "list appointments responds": (r) => r.status === 200 || r.status === 401,
    });

    apiLatency.add(listRes.timings.duration);
  });
}

function patientOperations(headers) {
  group("Patient Operations", () => {
    // Get patient profile
    const profileRes = http.get(`${BASE_URL}/api/${API_VERSION}/patients/me`, {
      headers,
      tags: { name: "PatientProfile", type: "patient" },
    });

    check(profileRes, {
      "patient profile responds": (r) => r.status === 200 || r.status === 401,
      "patient profile < 200ms": (r) => r.timings.duration < 200,
    });

    apiLatency.add(profileRes.timings.duration);

    // Get medical records
    const recordsRes = http.get(
      `${BASE_URL}/api/${API_VERSION}/patients/me/records?limit=5`,
      { headers, tags: { name: "MedicalRecords", type: "patient" } },
    );

    check(recordsRes, {
      "medical records responds": (r) =>
        r.status === 200 || r.status === 401 || r.status === 404,
    });

    apiLatency.add(recordsRes.timings.duration);
  });
}

function authenticationFlow() {
  group("Authentication", () => {
    const user = randomItem(TEST_USERS);

    // Login
    const loginRes = http.post(
      `${BASE_URL}/api/${API_VERSION}/auth/login`,
      JSON.stringify({ email: user.email, password: user.password }),
      {
        headers: { "Content-Type": "application/json" },
        tags: { name: "Login", type: "auth" },
      },
    );

    const loginSuccess = check(loginRes, {
      "login responds": (r) =>
        r.status === 200 || r.status === 401 || r.status === 429,
      "login < 500ms": (r) => r.timings.duration < 500,
    });

    if (loginRes.status === 200) {
      successfulLogins.add(1);

      // Token refresh
      try {
        const body = JSON.parse(loginRes.body);
        const refreshToken = body.refreshToken;

        if (refreshToken) {
          sleep(1);

          const refreshRes = http.post(
            `${BASE_URL}/api/${API_VERSION}/auth/refresh`,
            JSON.stringify({ refreshToken }),
            {
              headers: { "Content-Type": "application/json" },
              tags: { name: "TokenRefresh", type: "auth" },
            },
          );

          check(refreshRes, {
            "token refresh responds": (r) =>
              r.status === 200 || r.status === 401,
          });
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    errorRate.add(!loginSuccess && loginRes.status >= 500);
    apiLatency.add(loginRes.timings.duration);
  });
}

// Helper function for weighted random selection
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

export function teardown(data) {
  console.log("Load test completed");
}

export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return {
    [`results/load-${timestamp}.json`]: JSON.stringify(data, null, 2),
    stdout: generateSummary(data),
  };
}

function generateSummary(data) {
  const httpDuration = data.metrics.http_req_duration?.values || {};
  const httpReqs = data.metrics.http_reqs?.values || {};
  const errors = data.metrics.errors?.values || {};

  return `
╔══════════════════════════════════════════════════════════════════════╗
║                      LOAD TEST RESULTS                                ║
╠══════════════════════════════════════════════════════════════════════╣
║  REQUESTS                                                             ║
║    Total:           ${httpReqs.count || 0}
║    Rate:            ${httpReqs.rate?.toFixed(2) || 0}/s
║                                                                       ║
║  RESPONSE TIMES                                                       ║
║    Average:         ${httpDuration.avg?.toFixed(2) || 0}ms
║    p50:             ${httpDuration["p(50)"]?.toFixed(2) || 0}ms
║    p95:             ${httpDuration["p(95)"]?.toFixed(2) || 0}ms
║    p99:             ${httpDuration["p(99)"]?.toFixed(2) || 0}ms
║    Max:             ${httpDuration.max?.toFixed(2) || 0}ms
║                                                                       ║
║  ERROR RATE                                                           ║
║    Errors:          ${((errors.rate || 0) * 100).toFixed(2)}%
║                                                                       ║
║  THRESHOLDS                                                           ║
║    p95 < 200ms:     ${httpDuration["p(95)"] < 200 ? "✅ PASS" : "❌ FAIL"}
║    p99 < 500ms:     ${httpDuration["p(99)"] < 500 ? "✅ PASS" : "❌ FAIL"}
║    Error < 1%:      ${(errors.rate || 0) < 0.01 ? "✅ PASS" : "❌ FAIL"}
╚══════════════════════════════════════════════════════════════════════╝
`;
}
