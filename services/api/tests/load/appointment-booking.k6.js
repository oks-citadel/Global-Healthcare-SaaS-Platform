import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

/**
 * K6 Load Test: Appointment Booking Flow
 * Tests complete appointment booking workflow under load
 */

// Custom metrics
const appointmentBookingSuccess = new Rate('appointment_booking_success');
const appointmentCreationDuration = new Trend('appointment_creation_duration');
const appointmentListDuration = new Trend('appointment_list_duration');
const bookingErrors = new Counter('booking_errors');
const authenticationSuccess = new Rate('authentication_success');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 20 },    // Ramp up to 20 users
    { duration: '3m', target: 50 },    // Ramp up to 50 users
    { duration: '5m', target: 100 },   // Peak load at 100 users
    { duration: '3m', target: 50 },    // Ramp down to 50 users
    { duration: '1m', target: 0 },     // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
    http_req_failed: ['rate<0.05'],
    appointment_booking_success: ['rate>0.90'],
    appointment_creation_duration: ['p(95)<600'],
    authentication_success: ['rate>0.98'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:8080';
const PROVIDER_ID = __ENV.PROVIDER_ID || '00000000-0000-0000-0000-000000000001';

// Setup: Create test users and providers
export function setup() {
  console.log('Setting up test data for appointment booking...');
  const testUsers = [];

  // Create 20 test patients
  for (let i = 0; i < 20; i++) {
    const email = `patient-${i}-${Date.now()}@example.com`;
    const password = 'TestPassword123!@#';

    const payload = JSON.stringify({
      email,
      password,
      firstName: `Patient${i}`,
      lastName: 'LoadTest',
      role: 'patient',
    });

    const params = {
      headers: { 'Content-Type': 'application/json' },
    };

    const res = http.post(`${BASE_URL}/api/v1/auth/register`, payload, params);

    if (res.status === 201) {
      testUsers.push({
        email,
        password,
        accessToken: res.json('accessToken'),
        userId: res.json('user.id'),
      });
      console.log(`Created patient: ${email}`);
    }
  }

  return { testUsers };
}

// Main test scenario
export default function (data) {
  const user = data.testUsers[__VU % data.testUsers.length];
  let accessToken = user.accessToken;

  group('Appointment Booking Flow', () => {
    // Step 1: Authenticate
    accessToken = authenticate(user);

    if (!accessToken) {
      console.log('Authentication failed, skipping booking');
      return;
    }

    // Step 2: List available appointments (optional)
    if (Math.random() < 0.5) {
      listAppointments(accessToken);
    }

    // Step 3: Create appointment
    const appointmentId = createAppointment(accessToken);

    if (appointmentId) {
      // Step 4: Get appointment details
      getAppointmentDetails(accessToken, appointmentId);

      // Step 5: Update appointment (30% chance)
      if (Math.random() < 0.3) {
        updateAppointment(accessToken, appointmentId);
      }

      // Step 6: Cancel appointment (20% chance)
      if (Math.random() < 0.2) {
        cancelAppointment(accessToken, appointmentId);
      }
    }
  });

  sleep(Math.random() * 3 + 1); // Random think time 1-4 seconds
}

// Authenticate user
function authenticate(user) {
  const payload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'Authenticate' },
  };

  const res = http.post(`${BASE_URL}/api/v1/auth/login`, payload, params);

  const success = check(res, {
    'auth status is 200': (r) => r.status === 200,
    'auth has token': (r) => r.json('accessToken') !== undefined,
  });

  authenticationSuccess.add(success);

  return success ? res.json('accessToken') : null;
}

// List appointments
function listAppointments(accessToken) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    tags: { name: 'ListAppointments' },
  };

  const startTime = new Date();
  const res = http.get(`${BASE_URL}/api/v1/appointments`, params);
  const duration = new Date() - startTime;

  appointmentListDuration.add(duration);

  check(res, {
    'list status is 200': (r) => r.status === 200,
    'list response time < 400ms': (r) => r.timings.duration < 400,
  });
}

// Create appointment
function createAppointment(accessToken) {
  // Schedule appointment for future date (1-30 days from now)
  const daysInFuture = Math.floor(Math.random() * 30) + 1;
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + daysInFuture);

  const appointmentTypes = ['telehealth', 'in-person'];
  const reasons = [
    'Annual checkup',
    'Follow-up visit',
    'New patient consultation',
    'Lab results review',
    'Prescription refill',
    'Symptom evaluation',
  ];

  const payload = JSON.stringify({
    providerId: PROVIDER_ID,
    scheduledAt: scheduledDate.toISOString(),
    duration: 30,
    type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    notes: `Load test appointment created at ${new Date().toISOString()}`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    tags: { name: 'CreateAppointment' },
  };

  const startTime = new Date();
  const res = http.post(`${BASE_URL}/api/v1/appointments`, payload, params);
  const duration = new Date() - startTime;

  appointmentCreationDuration.add(duration);

  const success = check(res, {
    'create status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'create has id': (r) => r.json('id') !== undefined || r.json('appointment.id') !== undefined,
    'create response time < 600ms': (r) => r.timings.duration < 600,
  });

  appointmentBookingSuccess.add(success);

  if (!success) {
    bookingErrors.add(1);
    console.log(`Appointment creation failed: ${res.status} - ${res.body}`);
    return null;
  }

  return res.json('id') || res.json('appointment.id');
}

// Get appointment details
function getAppointmentDetails(accessToken, appointmentId) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    tags: { name: 'GetAppointment' },
  };

  const res = http.get(`${BASE_URL}/api/v1/appointments/${appointmentId}`, params);

  check(res, {
    'get status is 200': (r) => r.status === 200,
    'get has appointment data': (r) => r.json('id') !== undefined,
    'get response time < 300ms': (r) => r.timings.duration < 300,
  });
}

// Update appointment
function updateAppointment(accessToken, appointmentId) {
  const statuses = ['confirmed', 'checked-in'];

  const payload = JSON.stringify({
    status: statuses[Math.floor(Math.random() * statuses.length)],
    notes: `Updated during load test at ${new Date().toISOString()}`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    tags: { name: 'UpdateAppointment' },
  };

  const res = http.patch(`${BASE_URL}/api/v1/appointments/${appointmentId}`, payload, params);

  check(res, {
    'update status is 200': (r) => r.status === 200,
    'update response time < 400ms': (r) => r.timings.duration < 400,
  });
}

// Cancel appointment
function cancelAppointment(accessToken, appointmentId) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    tags: { name: 'CancelAppointment' },
  };

  const res = http.del(`${BASE_URL}/api/v1/appointments/${appointmentId}`, null, params);

  check(res, {
    'cancel status is 200 or 204': (r) => r.status === 200 || r.status === 204,
    'cancel response time < 400ms': (r) => r.timings.duration < 400,
  });
}

// Teardown
export function teardown(data) {
  console.log('Appointment booking load test completed!');
  console.log(`Total test users: ${data.testUsers.length}`);
}

/**
 * Run this test with:
 * k6 run appointment-booking.k6.js
 *
 * With custom parameters:
 * k6 run --vus 100 --duration 10m appointment-booking.k6.js
 *
 * With environment variables:
 * API_URL=https://api.example.com PROVIDER_ID=xxx k6 run appointment-booking.k6.js
 *
 * Generate HTML report:
 * k6 run --out json=results.json appointment-booking.k6.js
 * k6 report results.json
 */
