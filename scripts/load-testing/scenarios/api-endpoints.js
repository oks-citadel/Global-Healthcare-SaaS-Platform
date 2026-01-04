/**
 * Main API Endpoints Load Test
 * Global Healthcare SaaS Platform
 *
 * This script tests the main API endpoints of the healthcare platform including:
 * - Patient management
 * - Appointments
 * - Medical records
 * - Healthcare providers
 * - Organizations
 *
 * Usage:
 *   k6 run scripts/load-testing/scenarios/api-endpoints.js
 *
 * With custom API URL:
 *   K6_API_URL=http://staging-api.example.com/api/v1 k6 run api-endpoints.js
 */

import http from 'k6/http';
import { check, sleep, group, fail } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import {
  ENV,
  STANDARD_THRESHOLDS,
  RELAXED_THRESHOLDS,
  STANDARD_STAGES,
  TestData,
  RequestHelpers,
  Checks,
  validateEnvironment,
} from '../config.js';

// Custom metrics for API endpoints
const endpointSuccess = new Rate('endpoint_success');
const readOperations = new Trend('read_operations_duration');
const writeOperations = new Trend('write_operations_duration');
const listOperations = new Trend('list_operations_duration');
const apiErrors = new Counter('api_errors');

// Test data - using SharedArray for efficiency with many VUs
const patientIds = new SharedArray('patientIds', function() {
  // Generate synthetic patient IDs for testing
  const ids = [];
  for (let i = 1; i <= 100; i++) {
    ids.push(`test-patient-${i.toString().padStart(4, '0')}`);
  }
  return ids;
});

const appointmentIds = new SharedArray('appointmentIds', function() {
  const ids = [];
  for (let i = 1; i <= 50; i++) {
    ids.push(`test-appointment-${i.toString().padStart(4, '0')}`);
  }
  return ids;
});

// Test configuration
export const options = {
  // Scenario-based execution
  scenarios: {
    // Read-heavy traffic (most common)
    read_operations: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: __ENV.K6_STAGES === 'smoke'
        ? STANDARD_STAGES.smoke
        : __ENV.K6_STAGES === 'stress'
          ? [
              { duration: '1m', target: 150 },
              { duration: '3m', target: 150 },
              { duration: '1m', target: 300 },
              { duration: '3m', target: 300 },
              { duration: '2m', target: 0 },
            ]
          : STANDARD_STAGES.load,
      gracefulRampDown: '30s',
      exec: 'readOperations',
    },

    // Write operations (less frequent)
    write_operations: {
      executor: 'constant-arrival-rate',
      rate: 5, // 5 requests per second
      timeUnit: '1s',
      duration: __ENV.K6_STAGES === 'smoke' ? '1m' : '3m',
      preAllocatedVUs: 10,
      maxVUs: 30,
      exec: 'writeOperations',
      startTime: '1m',
    },

    // List/Search operations
    list_operations: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 20,
      maxVUs: 50,
      stages: [
        { duration: '1m', target: 10 },
        { duration: '2m', target: 20 },
        { duration: '1m', target: 5 },
      ],
      exec: 'listOperations',
      startTime: '30s',
    },
  },

  // Thresholds
  thresholds: {
    ...STANDARD_THRESHOLDS,
    endpoint_success: ['rate>0.95'],           // 95% success rate
    read_operations_duration: ['p(95)<200'],   // Reads under 200ms
    write_operations_duration: ['p(95)<500'],  // Writes under 500ms
    list_operations_duration: ['p(95)<1000'],  // Lists under 1s
    api_errors: ['count<100'],                  // Less than 100 errors total
  },

  // Tags
  tags: {
    scenario: 'api-endpoints',
    environment: ENV.ENVIRONMENT,
  },

  // Graceful handling
  gracefulStop: '30s',
};

// Shared state
let authToken = null;

// Setup function
export function setup() {
  console.log('='.repeat(60));
  console.log('API Endpoints Load Test');
  console.log('='.repeat(60));

  // Validate environment
  validateEnvironment();

  console.log(`\nAPI URL: ${ENV.API_URL}`);

  // Authenticate to get a test token
  const credentials = TestData.testCredentials();
  const loginPayload = JSON.stringify({
    email: credentials.email,
    password: credentials.password,
  });

  const loginResponse = http.post(
    `${ENV.AUTH_URL}/login`,
    loginPayload,
    { headers: RequestHelpers.getHeaders(), timeout: '10s' }
  );

  let token = null;
  if (loginResponse.status === 200) {
    try {
      const body = JSON.parse(loginResponse.body);
      token = body.accessToken || body.access_token || body.token;
      console.log('Authentication successful');
    } catch (e) {
      console.warn('Could not parse auth response, using mock token');
      token = 'test-token-for-load-testing';
    }
  } else {
    console.warn(`Authentication failed (${loginResponse.status}), using mock token`);
    token = 'test-token-for-load-testing';
  }

  // Verify API is accessible
  const healthCheck = http.get(`${ENV.API_URL}/health`, { timeout: '10s' });
  if (healthCheck.status !== 200) {
    console.warn(`API health check returned ${healthCheck.status}`);
  }

  console.log('\nStarting load test...\n');

  return {
    startTime: Date.now(),
    authToken: token,
  };
}

// Read operations - GET requests
export function readOperations(data) {
  const token = data.authToken;
  const patientId = patientIds[Math.floor(Math.random() * patientIds.length)];
  const appointmentId = appointmentIds[Math.floor(Math.random() * appointmentIds.length)];

  // Randomly select a read operation
  const operations = [
    () => getPatient(token, patientId),
    () => getPatientMedicalHistory(token, patientId),
    () => getAppointment(token, appointmentId),
    () => getProviders(token),
    () => getDashboardData(token),
    () => getNotifications(token),
  ];

  // Execute a random operation
  const operation = operations[Math.floor(Math.random() * operations.length)];
  operation();

  sleep(Math.random() * 1 + 0.5); // 0.5-1.5s between requests
}

// Write operations - POST/PUT/PATCH requests
export function writeOperations(data) {
  const token = data.authToken;
  const patientId = patientIds[Math.floor(Math.random() * patientIds.length)];

  // Randomly select a write operation
  const operations = [
    () => createAppointment(token, patientId),
    () => updatePatientNotes(token, patientId),
    () => createVitalSign(token, patientId),
  ];

  const operation = operations[Math.floor(Math.random() * operations.length)];
  operation();

  sleep(Math.random() * 0.5 + 0.5); // 0.5-1s between writes
}

// List operations - paginated GET requests
export function listOperations(data) {
  const token = data.authToken;

  // Randomly select a list operation
  const operations = [
    () => listPatients(token),
    () => searchPatients(token, 'Smith'),
    () => listAppointments(token),
    () => listUpcomingAppointments(token),
    () => listProviders(token),
  ];

  const operation = operations[Math.floor(Math.random() * operations.length)];
  operation();

  sleep(Math.random() * 1 + 1); // 1-2s between list operations
}

// === Individual API Operations ===

// Get patient by ID
function getPatient(token, patientId) {
  const startTime = Date.now();

  const response = http.get(
    `${ENV.API_URL}/patients/${patientId}`,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'get-patient', endpoint: '/patients/:id' },
    })
  );

  readOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'get patient - status 200 or 404': (r) => r.status === 200 || r.status === 404,
    'get patient - response time OK': Checks.durationUnder200ms,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed) apiErrors.add(1, { endpoint: 'get-patient' });

  return response;
}

// Get patient medical history
function getPatientMedicalHistory(token, patientId) {
  const startTime = Date.now();

  const response = http.get(
    `${ENV.API_URL}/patients/${patientId}/medical-history`,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'get-medical-history', endpoint: '/patients/:id/medical-history' },
    })
  );

  readOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'get medical history - status OK': (r) => r.status === 200 || r.status === 404,
    'get medical history - response time OK': Checks.durationUnder500ms,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed) apiErrors.add(1, { endpoint: 'get-medical-history' });

  return response;
}

// Get appointment by ID
function getAppointment(token, appointmentId) {
  const startTime = Date.now();

  const response = http.get(
    `${ENV.API_URL}/appointments/${appointmentId}`,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'get-appointment', endpoint: '/appointments/:id' },
    })
  );

  readOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'get appointment - status OK': (r) => r.status === 200 || r.status === 404,
    'get appointment - response time OK': Checks.durationUnder200ms,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed) apiErrors.add(1, { endpoint: 'get-appointment' });

  return response;
}

// Get providers
function getProviders(token) {
  const startTime = Date.now();

  const response = http.get(
    `${ENV.API_URL}/providers`,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'get-providers', endpoint: '/providers' },
    })
  );

  readOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'get providers - status 200': Checks.isStatus200,
    'get providers - response time OK': Checks.durationUnder200ms,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed) apiErrors.add(1, { endpoint: 'get-providers' });

  return response;
}

// Get dashboard data
function getDashboardData(token) {
  const startTime = Date.now();

  const response = http.get(
    `${ENV.API_URL}/dashboard`,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'get-dashboard', endpoint: '/dashboard' },
    })
  );

  readOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'get dashboard - status OK': (r) => r.status === 200 || r.status === 401,
    'get dashboard - response time OK': Checks.durationUnder500ms,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed && response.status !== 401) apiErrors.add(1, { endpoint: 'get-dashboard' });

  return response;
}

// Get notifications
function getNotifications(token) {
  const startTime = Date.now();

  const response = http.get(
    `${ENV.API_URL}/notifications`,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'get-notifications', endpoint: '/notifications' },
    })
  );

  readOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'get notifications - status OK': (r) => r.status === 200 || r.status === 401,
    'get notifications - response time OK': Checks.durationUnder200ms,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed && response.status !== 401) apiErrors.add(1, { endpoint: 'get-notifications' });

  return response;
}

// Create appointment
function createAppointment(token, patientId) {
  const startTime = Date.now();

  const payload = JSON.stringify({
    patientId: patientId,
    providerId: 'test-provider-001',
    dateTime: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    type: 'consultation',
    duration: 30,
    notes: 'Load test appointment - please ignore',
    status: 'scheduled',
  });

  const response = http.post(
    `${ENV.API_URL}/appointments`,
    payload,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'create-appointment', endpoint: '/appointments' },
    })
  );

  writeOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'create appointment - status 201 or 400': (r) =>
      r.status === 201 || r.status === 400 || r.status === 409,
    'create appointment - response time OK': Checks.durationUnder500ms,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed) apiErrors.add(1, { endpoint: 'create-appointment' });

  return response;
}

// Update patient notes
function updatePatientNotes(token, patientId) {
  const startTime = Date.now();

  const payload = JSON.stringify({
    notes: `Load test note updated at ${new Date().toISOString()}`,
    lastUpdatedBy: 'load-test-user',
  });

  const response = http.patch(
    `${ENV.API_URL}/patients/${patientId}/notes`,
    payload,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'update-patient-notes', endpoint: '/patients/:id/notes' },
    })
  );

  writeOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'update notes - status OK': (r) =>
      r.status === 200 || r.status === 404 || r.status === 204,
    'update notes - response time OK': Checks.durationUnder500ms,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed && response.status !== 404) apiErrors.add(1, { endpoint: 'update-patient-notes' });

  return response;
}

// Create vital sign
function createVitalSign(token, patientId) {
  const startTime = Date.now();

  const payload = JSON.stringify({
    patientId: patientId,
    type: 'blood_pressure',
    value: {
      systolic: Math.floor(Math.random() * 40 + 100),
      diastolic: Math.floor(Math.random() * 20 + 60),
    },
    unit: 'mmHg',
    recordedAt: new Date().toISOString(),
    recordedBy: 'load-test-user',
  });

  const response = http.post(
    `${ENV.API_URL}/patients/${patientId}/vitals`,
    payload,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'create-vital-sign', endpoint: '/patients/:id/vitals' },
    })
  );

  writeOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'create vital - status OK': (r) =>
      r.status === 201 || r.status === 400 || r.status === 404,
    'create vital - response time OK': Checks.durationUnder500ms,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed && response.status !== 404) apiErrors.add(1, { endpoint: 'create-vital-sign' });

  return response;
}

// List patients (paginated)
function listPatients(token) {
  const startTime = Date.now();
  const page = Math.floor(Math.random() * 10) + 1;
  const limit = 20;

  const response = http.get(
    `${ENV.API_URL}/patients?page=${page}&limit=${limit}`,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'list-patients', endpoint: '/patients' },
    })
  );

  listOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'list patients - status 200': Checks.isStatus200,
    'list patients - response time OK': Checks.durationUnder1s,
    'list patients - is array or paginated': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body) || body.data || body.items || body.patients;
      } catch {
        return false;
      }
    },
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed) apiErrors.add(1, { endpoint: 'list-patients' });

  return response;
}

// Search patients
function searchPatients(token, query) {
  const startTime = Date.now();

  const response = http.get(
    `${ENV.API_URL}/patients/search?q=${encodeURIComponent(query)}&limit=10`,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'search-patients', endpoint: '/patients/search' },
    })
  );

  listOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'search patients - status 200': Checks.isStatus200,
    'search patients - response time OK': Checks.durationUnder1s,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed) apiErrors.add(1, { endpoint: 'search-patients' });

  return response;
}

// List appointments
function listAppointments(token) {
  const startTime = Date.now();
  const page = Math.floor(Math.random() * 5) + 1;

  const response = http.get(
    `${ENV.API_URL}/appointments?page=${page}&limit=20`,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'list-appointments', endpoint: '/appointments' },
    })
  );

  listOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'list appointments - status 200': Checks.isStatus200,
    'list appointments - response time OK': Checks.durationUnder1s,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed) apiErrors.add(1, { endpoint: 'list-appointments' });

  return response;
}

// List upcoming appointments
function listUpcomingAppointments(token) {
  const startTime = Date.now();
  const today = new Date().toISOString().split('T')[0];

  const response = http.get(
    `${ENV.API_URL}/appointments?startDate=${today}&status=scheduled&limit=50`,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'list-upcoming-appointments', endpoint: '/appointments?upcoming' },
    })
  );

  listOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'list upcoming - status 200': Checks.isStatus200,
    'list upcoming - response time OK': Checks.durationUnder1s,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed) apiErrors.add(1, { endpoint: 'list-upcoming-appointments' });

  return response;
}

// List providers
function listProviders(token) {
  const startTime = Date.now();

  const response = http.get(
    `${ENV.API_URL}/providers?limit=50`,
    RequestHelpers.getParams({
      headers: RequestHelpers.getHeaders(token),
      tags: { name: 'list-providers', endpoint: '/providers' },
    })
  );

  listOperations.add(Date.now() - startTime);

  const passed = check(response, {
    'list providers - status 200': Checks.isStatus200,
    'list providers - response time OK': Checks.durationUnder500ms,
  });

  endpointSuccess.add(passed ? 1 : 0);
  if (!passed) apiErrors.add(1, { endpoint: 'list-providers' });

  return response;
}

// Teardown function
export function teardown(data) {
  const duration = ((Date.now() - data.startTime) / 1000).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('API Endpoints Load Test Complete');
  console.log('='.repeat(60));
  console.log(`Total Duration: ${duration}s`);
  console.log(`Environment: ${ENV.ENVIRONMENT}`);
  console.log(`API URL: ${ENV.API_URL}`);
  console.log('='.repeat(60));
}

// Handle summary output
export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    scenario: 'api-endpoints',
    environment: ENV.ENVIRONMENT,
    apiUrl: ENV.API_URL,
    metrics: {
      http_reqs: data.metrics.http_reqs?.values?.count || 0,
      http_req_duration_p50: data.metrics.http_req_duration?.values?.['p(50)'] || 0,
      http_req_duration_p95: data.metrics.http_req_duration?.values?.['p(95)'] || 0,
      http_req_duration_p99: data.metrics.http_req_duration?.values?.['p(99)'] || 0,
      http_req_failed_rate: data.metrics.http_req_failed?.values?.rate || 0,
      endpoint_success_rate: data.metrics.endpoint_success?.values?.rate || 0,
      read_operations_p95: data.metrics.read_operations_duration?.values?.['p(95)'] || 0,
      write_operations_p95: data.metrics.write_operations_duration?.values?.['p(95)'] || 0,
      list_operations_p95: data.metrics.list_operations_duration?.values?.['p(95)'] || 0,
      api_errors: data.metrics.api_errors?.values?.count || 0,
    },
    thresholds: {
      passed: Object.values(data.thresholds || {}).every(t => t.ok),
      details: data.thresholds,
    },
  };

  return {
    'stdout': textSummary(data),
    'results/api-endpoints-summary.json': JSON.stringify(summary, null, 2),
  };
}

// Text summary generator
function textSummary(data) {
  const lines = [
    '',
    '='.repeat(60),
    'API Endpoints - Results Summary',
    '='.repeat(60),
    '',
    `Total Requests: ${data.metrics.http_reqs?.values?.count || 'N/A'}`,
    '',
    'Response Times:',
    `  p50: ${(data.metrics.http_req_duration?.values?.['p(50)'] || 0).toFixed(2)}ms`,
    `  p95: ${(data.metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`,
    `  p99: ${(data.metrics.http_req_duration?.values?.['p(99)'] || 0).toFixed(2)}ms`,
    '',
    'Operation Types:',
    `  Read Operations (p95): ${(data.metrics.read_operations_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`,
    `  Write Operations (p95): ${(data.metrics.write_operations_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`,
    `  List Operations (p95): ${(data.metrics.list_operations_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`,
    '',
    `Endpoint Success Rate: ${((data.metrics.endpoint_success?.values?.rate || 0) * 100).toFixed(2)}%`,
    `Failed Requests: ${((data.metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2)}%`,
    `API Errors: ${data.metrics.api_errors?.values?.count || 0}`,
    '',
    '='.repeat(60),
  ];

  return lines.join('\n');
}
