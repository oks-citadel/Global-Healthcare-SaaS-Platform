import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';
import { randomString, randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

/**
 * K6 Load Test: Concurrent User Simulation
 * Simulates realistic concurrent user behavior across multiple workflows
 */

// Custom metrics
const userFlowSuccess = new Rate('user_flow_success');
const apiResponseTime = new Trend('api_response_time');
const concurrentUsers = new Gauge('concurrent_users');
const totalRequests = new Counter('total_requests');
const errorRate = new Rate('error_rate');

// Workflow-specific metrics
const patientWorkflowSuccess = new Rate('patient_workflow_success');
const providerWorkflowSuccess = new Rate('provider_workflow_success');
const documentUploadSuccess = new Rate('document_upload_success');

// Test configuration - Simulates realistic concurrent usage
export const options = {
  scenarios: {
    // Scenario 1: Patient users (60% of traffic)
    patient_users: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 30 },   // Morning rush
        { duration: '5m', target: 60 },   // Peak hours
        { duration: '3m', target: 40 },   // Afternoon
        { duration: '2m', target: 20 },   // Evening
        { duration: '1m', target: 0 },    // Night
      ],
      exec: 'patientWorkflow',
      gracefulRampDown: '30s',
    },
    // Scenario 2: Provider users (30% of traffic)
    provider_users: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 15 },
        { duration: '5m', target: 30 },
        { duration: '3m', target: 20 },
        { duration: '2m', target: 10 },
        { duration: '1m', target: 0 },
      ],
      exec: 'providerWorkflow',
      gracefulRampDown: '30s',
    },
    // Scenario 3: Admin users (10% of traffic)
    admin_users: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 5 },
        { duration: '5m', target: 10 },
        { duration: '3m', target: 7 },
        { duration: '2m', target: 3 },
        { duration: '1m', target: 0 },
      ],
      exec: 'adminWorkflow',
      gracefulRampDown: '30s',
    },
    // Scenario 4: Spike test - sudden traffic increase
    spike_test: {
      executor: 'ramping-vus',
      startTime: '5m',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 50 },  // Sudden spike
        { duration: '1m', target: 50 },   // Sustained
        { duration: '10s', target: 0 },   // Drop
      ],
      exec: 'patientWorkflow',
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.10'],
    user_flow_success: ['rate>0.85'],
    api_response_time: ['p(95)<800'],
    error_rate: ['rate<0.10'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:8080';

// Setup: Create test data
export function setup() {
  console.log('Setting up concurrent user test data...');

  const patients = createUsers('patient', 10);
  const providers = createUsers('provider', 5);
  const admins = createUsers('admin', 2);

  return { patients, providers, admins };
}

// Helper: Create users
function createUsers(role, count) {
  const users = [];

  for (let i = 0; i < count; i++) {
    const email = `${role}-concurrent-${i}-${Date.now()}@example.com`;
    const password = 'TestPassword123!@#';

    const payload = JSON.stringify({
      email,
      password,
      firstName: `${role}${i}`,
      lastName: 'Concurrent',
      role,
    });

    const res = http.post(
      `${BASE_URL}/api/v1/auth/register`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (res.status === 201) {
      users.push({
        email,
        password,
        role,
        accessToken: res.json('accessToken'),
      });
    }
  }

  console.log(`Created ${users.length} ${role} users`);
  return users;
}

// Patient workflow simulation
export function patientWorkflow(data) {
  concurrentUsers.add(1);
  const user = data.patients[__VU % data.patients.length];
  let accessToken = user.accessToken;
  let workflowSuccess = true;

  group('Patient User Flow', () => {
    // Login
    accessToken = login(user);
    if (!accessToken) {
      workflowSuccess = false;
      return;
    }

    // View dashboard
    if (!viewDashboard(accessToken)) workflowSuccess = false;

    // Common patient actions (random selection)
    const action = Math.random();

    if (action < 0.4) {
      // 40% - Book appointment
      if (!bookAppointmentFlow(accessToken)) workflowSuccess = false;
    } else if (action < 0.7) {
      // 30% - View appointments
      if (!viewAppointments(accessToken)) workflowSuccess = false;
    } else if (action < 0.85) {
      // 15% - View documents
      if (!viewDocuments(accessToken)) workflowSuccess = false;
    } else {
      // 15% - Update profile
      if (!updateProfile(accessToken)) workflowSuccess = false;
    }
  });

  patientWorkflowSuccess.add(workflowSuccess);
  userFlowSuccess.add(workflowSuccess);

  sleep(randomIntBetween(2, 5));
}

// Provider workflow simulation
export function providerWorkflow(data) {
  concurrentUsers.add(1);
  const user = data.providers[__VU % data.providers.length];
  let accessToken = user.accessToken;
  let workflowSuccess = true;

  group('Provider User Flow', () => {
    // Login
    accessToken = login(user);
    if (!accessToken) {
      workflowSuccess = false;
      return;
    }

    // View dashboard
    if (!viewDashboard(accessToken)) workflowSuccess = false;

    // Provider actions
    const action = Math.random();

    if (action < 0.3) {
      // 30% - View appointments
      if (!viewAppointments(accessToken)) workflowSuccess = false;
    } else if (action < 0.6) {
      // 30% - Create encounter
      if (!createEncounter(accessToken)) workflowSuccess = false;
    } else if (action < 0.8) {
      // 20% - View encounters
      if (!viewEncounters(accessToken)) workflowSuccess = false;
    } else {
      // 20% - View patient documents
      if (!viewDocuments(accessToken)) workflowSuccess = false;
    }
  });

  providerWorkflowSuccess.add(workflowSuccess);
  userFlowSuccess.add(workflowSuccess);

  sleep(randomIntBetween(3, 7));
}

// Admin workflow simulation
export function adminWorkflow(data) {
  concurrentUsers.add(1);
  const user = data.admins[__VU % data.admins.length];
  let accessToken = user.accessToken;
  let workflowSuccess = true;

  group('Admin User Flow', () => {
    // Login
    accessToken = login(user);
    if (!accessToken) {
      workflowSuccess = false;
      return;
    }

    // Admin actions
    const action = Math.random();

    if (action < 0.4) {
      // 40% - View audit logs
      if (!viewAuditLogs(accessToken)) workflowSuccess = false;
    } else if (action < 0.7) {
      // 30% - View dashboard
      if (!viewDashboard(accessToken)) workflowSuccess = false;
    } else {
      // 30% - Manage users
      if (!getRoles(accessToken)) workflowSuccess = false;
    }
  });

  userFlowSuccess.add(workflowSuccess);

  sleep(randomIntBetween(4, 8));
}

// Action functions
function login(user) {
  totalRequests.add(1);
  const res = http.post(
    `${BASE_URL}/api/v1/auth/login`,
    JSON.stringify({ email: user.email, password: user.password }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'Login' }
    }
  );

  apiResponseTime.add(res.timings.duration);
  const success = res.status === 200;
  errorRate.add(!success);

  return success ? res.json('accessToken') : null;
}

function viewDashboard(accessToken) {
  totalRequests.add(1);
  const res = http.get(
    `${BASE_URL}/api/v1/dashboard/stats`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      tags: { name: 'Dashboard' }
    }
  );

  apiResponseTime.add(res.timings.duration);
  const success = res.status === 200 || res.status === 404;
  errorRate.add(!success);

  return success;
}

function viewAppointments(accessToken) {
  totalRequests.add(1);
  const res = http.get(
    `${BASE_URL}/api/v1/appointments`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      tags: { name: 'ListAppointments' }
    }
  );

  apiResponseTime.add(res.timings.duration);
  const success = res.status === 200;
  errorRate.add(!success);

  return success;
}

function bookAppointmentFlow(accessToken) {
  totalRequests.add(1);
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + randomIntBetween(1, 30));

  const res = http.post(
    `${BASE_URL}/api/v1/appointments`,
    JSON.stringify({
      providerId: '00000000-0000-0000-0000-000000000001',
      scheduledAt: scheduledDate.toISOString(),
      type: Math.random() < 0.5 ? 'telehealth' : 'in-person',
      reason: 'Checkup',
      duration: 30,
    }),
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      tags: { name: 'BookAppointment' }
    }
  );

  apiResponseTime.add(res.timings.duration);
  const success = res.status === 200 || res.status === 201 || res.status === 404;
  errorRate.add(!success);

  return success;
}

function viewDocuments(accessToken) {
  totalRequests.add(1);
  const res = http.get(
    `${BASE_URL}/api/v1/documents`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      tags: { name: 'ListDocuments' }
    }
  );

  apiResponseTime.add(res.timings.duration);
  const success = res.status === 200 || res.status === 404;
  errorRate.add(!success);

  return success;
}

function updateProfile(accessToken) {
  totalRequests.add(1);
  const res = http.patch(
    `${BASE_URL}/api/v1/users/me`,
    JSON.stringify({
      firstName: 'Updated',
      lastName: 'Name',
    }),
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      tags: { name: 'UpdateProfile' }
    }
  );

  apiResponseTime.add(res.timings.duration);
  const success = res.status === 200 || res.status === 404;
  errorRate.add(!success);

  return success;
}

function createEncounter(accessToken) {
  totalRequests.add(1);
  const res = http.post(
    `${BASE_URL}/api/v1/encounters`,
    JSON.stringify({
      patientId: '00000000-0000-0000-0000-000000000001',
      type: 'outpatient',
      chiefComplaint: 'Routine checkup',
    }),
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      tags: { name: 'CreateEncounter' }
    }
  );

  apiResponseTime.add(res.timings.duration);
  const success = res.status === 200 || res.status === 201 || res.status === 404;
  errorRate.add(!success);

  return success;
}

function viewEncounters(accessToken) {
  totalRequests.add(1);
  const res = http.get(
    `${BASE_URL}/api/v1/encounters`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      tags: { name: 'ListEncounters' }
    }
  );

  apiResponseTime.add(res.timings.duration);
  const success = res.status === 200;
  errorRate.add(!success);

  return success;
}

function viewAuditLogs(accessToken) {
  totalRequests.add(1);
  const res = http.get(
    `${BASE_URL}/api/v1/audit/events`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      tags: { name: 'AuditLogs' }
    }
  );

  apiResponseTime.add(res.timings.duration);
  const success = res.status === 200 || res.status === 404;
  errorRate.add(!success);

  return success;
}

function getRoles(accessToken) {
  totalRequests.add(1);
  const res = http.get(
    `${BASE_URL}/api/v1/roles`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      tags: { name: 'GetRoles' }
    }
  );

  apiResponseTime.add(res.timings.duration);
  const success = res.status === 200;
  errorRate.add(!success);

  return success;
}

// Teardown
export function teardown(data) {
  console.log('Concurrent user simulation completed!');
  console.log(`Patients: ${data.patients.length}`);
  console.log(`Providers: ${data.providers.length}`);
  console.log(`Admins: ${data.admins.length}`);
}

/**
 * Run this test with:
 * k6 run concurrent-users.k6.js
 *
 * With custom API URL:
 * API_URL=https://api.example.com k6 run concurrent-users.k6.js
 *
 * Generate detailed report:
 * k6 run --out json=concurrent-test-results.json concurrent-users.k6.js
 *
 * With InfluxDB output:
 * k6 run --out influxdb=http://localhost:8086/k6 concurrent-users.k6.js
 */
