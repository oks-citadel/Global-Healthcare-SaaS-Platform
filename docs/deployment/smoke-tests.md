# Smoke Test Script - Post-Deployment Validation
## UnifiedHealth Global Platform

**Version:** 1.0
**Last Updated:** December 2024
**Owner:** QA Team
**Classification:** Internal

---

## Table of Contents

1. [Overview](#overview)
2. [Test Environment Setup](#test-environment-setup)
3. [Automated Smoke Tests](#automated-smoke-tests)
4. [Manual Validation Tests](#manual-validation-tests)
5. [Performance Validation](#performance-validation)
6. [Security Validation](#security-validation)
7. [Integration Tests](#integration-tests)
8. [Regional Validation](#regional-validation)
9. [Test Results Documentation](#test-results-documentation)

---

## Overview

### Purpose
This document provides comprehensive smoke test procedures to validate the UnifiedHealth platform after deployment. These tests ensure critical functionality is working correctly before declaring deployment success.

### Test Objectives
1. Verify all critical user journeys
2. Validate system health and performance
3. Confirm security controls
4. Test external integrations
5. Ensure multi-region functionality

### Test Execution Timeline
- **Duration:** 30-45 minutes
- **Execution Window:** Immediately after deployment
- **Pass Criteria:** 100% of critical tests passing
- **Failure Action:** Initiate rollback procedures

### Test Environments
- **Production:** Primary testing environment
- **Regions:** All deployed regions (US East, US West, EU, Asia, Africa)

---

## Test Environment Setup

### Prerequisites

#### Tools Required
```bash
# Install required tools
npm install -g newman  # API testing
npm install -g k6      # Load testing
npm install -g curl    # Manual API testing
```

#### Environment Variables
```bash
# Set test environment
export API_BASE_URL="https://api.unifiedhealth.io"
export WEB_BASE_URL="https://app.unifiedhealth.io"
export TEST_USER_EMAIL="smoke-test@unifiedhealth.io"
export TEST_USER_PASSWORD="SecureTestPassword123!"
export TEST_PROVIDER_ID="test-provider-001"
```

#### Test Data
```bash
# Test credentials (pre-created in production)
PATIENT_USER="patient-smoke-test@unifiedhealth.io"
PROVIDER_USER="provider-smoke-test@unifiedhealth.io"
ADMIN_USER="admin-smoke-test@unifiedhealth.io"

# Test credit card (Stripe test mode)
CARD_NUMBER="4242424242424242"
CARD_EXP="12/25"
CARD_CVC="123"
```

### Pre-Test Checklist
- [ ] All deployment steps completed
- [ ] Services showing as healthy
- [ ] Database migrations completed
- [ ] Feature flags configured
- [ ] Test users created
- [ ] Test environment variables set
- [ ] Tools installed

---

## Automated Smoke Tests

### Test Suite Execution

#### Run Complete Smoke Test Suite
```bash
# Navigate to test directory
cd tests/smoke

# Install dependencies
npm install

# Run all automated smoke tests
npm run test:smoke:production

# Expected output:
# ✓ All tests passed (XX/XX)
# Duration: X.XX seconds
# Status: SUCCESS
```

#### Run Individual Test Suites
```bash
# Authentication tests
npm run test:smoke:auth

# Core functionality tests
npm run test:smoke:core

# Integration tests
npm run test:smoke:integrations

# Performance tests
npm run test:smoke:performance
```

---

### Critical Test Cases

#### 1. Health & Status Tests
**File:** `tests/smoke/01-health-checks.test.js`

```javascript
/**
 * Health Check Tests
 * Validates system components are healthy
 */

describe('System Health Checks', () => {
  test('API Health Check', async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.version).toBeDefined();
    expect(data.timestamp).toBeDefined();
  });

  test('Database Health Check', async () => {
    const response = await fetch(`${API_BASE_URL}/health/database`);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.latency_ms).toBeLessThan(50);
  });

  test('Redis Health Check', async () => {
    const response = await fetch(`${API_BASE_URL}/health/redis`);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.latency_ms).toBeLessThan(10);
  });

  test('External Services Health', async () => {
    const response = await fetch(`${API_BASE_URL}/health/external`);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.payment_gateway).toBe('healthy');
    expect(data.sms_provider).toBe('healthy');
    expect(data.email_provider).toBe('healthy');
    expect(data.video_platform).toBe('healthy');
  });
});
```

**Expected Results:**
- [ ] All health endpoints return 200 OK
- [ ] All services report "healthy" status
- [ ] Latency within acceptable limits

---

#### 2. Authentication Tests
**File:** `tests/smoke/02-authentication.test.js`

```javascript
/**
 * Authentication Tests
 * Validates user authentication flows
 */

describe('Authentication', () => {
  test('User Registration', async () => {
    const timestamp = Date.now();
    const testEmail = `smoke-test-${timestamp}@example.com`;

    const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'TestPassword123!',
        firstName: 'Smoke',
        lastName: 'Test',
        role: 'patient'
      })
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(testEmail);
    expect(data.accessToken).toBeDefined();
  });

  test('User Login - Patient', async () => {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: PATIENT_USER,
        password: TEST_USER_PASSWORD
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.accessToken).toBeDefined();
    expect(data.refreshToken).toBeDefined();
    expect(data.user.role).toBe('patient');

    // Store token for subsequent tests
    global.patientToken = data.accessToken;
  });

  test('User Login - Provider', async () => {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: PROVIDER_USER,
        password: TEST_USER_PASSWORD
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.user.role).toBe('provider');

    global.providerToken = data.accessToken;
  });

  test('Token Validation', async () => {
    const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${global.patientToken}`
      }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(data.email).toBe(PATIENT_USER);
  });

  test('Invalid Credentials', async () => {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: PATIENT_USER,
        password: 'WrongPassword123!'
      })
    });

    expect(response.status).toBe(401);
  });
});
```

**Expected Results:**
- [ ] User registration creates new account
- [ ] User login returns valid tokens
- [ ] Token validation works
- [ ] Invalid credentials rejected

---

#### 3. Core Functionality Tests
**File:** `tests/smoke/03-core-features.test.js`

```javascript
/**
 * Core Functionality Tests
 * Validates critical business features
 */

describe('Provider Search', () => {
  test('Search for Providers', async () => {
    const response = await fetch(
      `${API_BASE_URL}/v1/providers?specialty=cardiology&location=New York`,
      {
        headers: { 'Authorization': `Bearer ${global.patientToken}` }
      }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.providers)).toBe(true);
    expect(data.providers.length).toBeGreaterThan(0);
    expect(data.pagination).toBeDefined();
  });

  test('Get Provider Details', async () => {
    const response = await fetch(
      `${API_BASE_URL}/v1/providers/${TEST_PROVIDER_ID}`,
      {
        headers: { 'Authorization': `Bearer ${global.patientToken}` }
      }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(TEST_PROVIDER_ID);
    expect(data.specialties).toBeDefined();
    expect(data.availability).toBeDefined();
  });
});

describe('Appointment Booking', () => {
  test('Get Available Slots', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const response = await fetch(
      `${API_BASE_URL}/v1/appointments/availability?providerId=${TEST_PROVIDER_ID}&date=${dateStr}`,
      {
        headers: { 'Authorization': `Bearer ${global.patientToken}` }
      }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.slots)).toBe(true);
  });

  test('Book Appointment', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const response = await fetch(`${API_BASE_URL}/v1/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${global.patientToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        providerId: TEST_PROVIDER_ID,
        scheduledDateTime: tomorrow.toISOString(),
        type: 'video',
        reason: 'Smoke test appointment'
      })
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(data.status).toBe('scheduled');

    global.testAppointmentId = data.id;
  });

  test('Get Appointment Details', async () => {
    const response = await fetch(
      `${API_BASE_URL}/v1/appointments/${global.testAppointmentId}`,
      {
        headers: { 'Authorization': `Bearer ${global.patientToken}` }
      }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(global.testAppointmentId);
    expect(data.status).toBe('scheduled');
  });

  test('Cancel Appointment', async () => {
    const response = await fetch(
      `${API_BASE_URL}/v1/appointments/${global.testAppointmentId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${global.patientToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Smoke test cleanup'
        })
      }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('cancelled');
  });
});

describe('Patient Records', () => {
  test('Get Patient Profile', async () => {
    const response = await fetch(`${API_BASE_URL}/v1/patients/me`, {
      headers: { 'Authorization': `Bearer ${global.patientToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(data.email).toBe(PATIENT_USER);
    expect(data.profile).toBeDefined();
  });

  test('Get Medical History', async () => {
    const response = await fetch(`${API_BASE_URL}/v1/patients/me/history`, {
      headers: { 'Authorization': `Bearer ${global.patientToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.appointments).toBeDefined();
    expect(data.prescriptions).toBeDefined();
  });
});
```

**Expected Results:**
- [ ] Provider search returns results
- [ ] Appointment booking successful
- [ ] Appointment cancellation works
- [ ] Patient records accessible

---

#### 4. Payment Processing Tests
**File:** `tests/smoke/04-payment.test.js`

```javascript
/**
 * Payment Processing Tests
 * Validates payment gateway integration
 */

describe('Payment Processing', () => {
  test('Create Payment Intent', async () => {
    const response = await fetch(`${API_BASE_URL}/v1/payments/intent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${global.patientToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 5000, // $50.00
        currency: 'usd',
        description: 'Smoke test payment'
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.clientSecret).toBeDefined();
    expect(data.amount).toBe(5000);

    global.paymentIntentId = data.id;
  });

  test('Process Test Payment', async () => {
    const response = await fetch(`${API_BASE_URL}/v1/payments/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${global.patientToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentIntentId: global.paymentIntentId,
        paymentMethod: {
          card: {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2025,
            cvc: '123'
          }
        }
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('succeeded');
  });

  test('Get Payment History', async () => {
    const response = await fetch(`${API_BASE_URL}/v1/payments/history`, {
      headers: { 'Authorization': `Bearer ${global.patientToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.payments)).toBe(true);
  });
});
```

**Expected Results:**
- [ ] Payment intent created
- [ ] Test payment processed successfully
- [ ] Payment history retrievable

---

#### 5. Video Consultation Tests
**File:** `tests/smoke/05-video.test.js`

```javascript
/**
 * Video Consultation Tests
 * Validates video platform integration
 */

describe('Video Consultation', () => {
  test('Initialize Video Session', async () => {
    // Create an appointment first
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);

    const appointmentResponse = await fetch(`${API_BASE_URL}/v1/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${global.patientToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        providerId: TEST_PROVIDER_ID,
        scheduledDateTime: tomorrow.toISOString(),
        type: 'video',
        reason: 'Video test'
      })
    });

    const appointment = await appointmentResponse.json();

    // Initialize video session
    const response = await fetch(
      `${API_BASE_URL}/v1/video/sessions/${appointment.id}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${global.patientToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.sessionId).toBeDefined();
    expect(data.token).toBeDefined();
    expect(data.channelName).toBeDefined();
  });

  test('Get Video Session Details', async () => {
    const response = await fetch(
      `${API_BASE_URL}/v1/video/sessions/${global.testAppointmentId}`,
      {
        headers: { 'Authorization': `Bearer ${global.patientToken}` }
      }
    );

    // May return 404 if session ended, which is acceptable
    expect([200, 404]).toContain(response.status);
  });
});
```

**Expected Results:**
- [ ] Video session initialized
- [ ] Video tokens generated
- [ ] Session details retrievable

---

### Command Line Test Execution

#### Quick Health Check
```bash
#!/bin/bash
# quick-health-check.sh

API_URL="https://api.unifiedhealth.io"

echo "Running Quick Health Checks..."
echo "=============================="

# API Health
echo -n "API Health: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health)
if [ $STATUS -eq 200 ]; then
  echo "✓ PASS"
else
  echo "✗ FAIL (Status: $STATUS)"
  exit 1
fi

# Database Health
echo -n "Database: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health/database)
if [ $STATUS -eq 200 ]; then
  echo "✓ PASS"
else
  echo "✗ FAIL (Status: $STATUS)"
  exit 1
fi

# Redis Health
echo -n "Redis: "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health/redis)
if [ $STATUS -eq 200 ]; then
  echo "✓ PASS"
else
  echo "✗ FAIL (Status: $STATUS)"
  exit 1
fi

echo "=============================="
echo "All Health Checks Passed! ✓"
```

---

## Manual Validation Tests

### Web Application Tests

#### Test 1: Website Loading
**URL:** https://app.unifiedhealth.io

**Steps:**
1. Open browser (Chrome, Firefox, Safari)
2. Navigate to https://app.unifiedhealth.io
3. Wait for page to load

**Expected Results:**
- [ ] Page loads within 3 seconds
- [ ] No JavaScript errors in console
- [ ] All images and assets load
- [ ] Navigation menu visible
- [ ] Footer visible

---

#### Test 2: User Login (Web)
**URL:** https://app.unifiedhealth.io/login

**Steps:**
1. Navigate to login page
2. Enter test credentials
3. Click "Sign In"
4. Verify redirect to dashboard

**Expected Results:**
- [ ] Login form displays correctly
- [ ] Form validation works
- [ ] Successful login redirects to dashboard
- [ ] User name displayed in header
- [ ] Session persists on page refresh

---

#### Test 3: Provider Search (Web)
**URL:** https://app.unifiedhealth.io/providers

**Steps:**
1. Log in as patient
2. Navigate to provider search
3. Enter search criteria (specialty, location)
4. Click search
5. Review results

**Expected Results:**
- [ ] Search form functional
- [ ] Results display within 2 seconds
- [ ] Provider cards show correct information
- [ ] Pagination works
- [ ] Filters apply correctly

---

#### Test 4: Appointment Booking (Web)
**URL:** https://app.unifiedhealth.io/appointments/book

**Steps:**
1. Select a provider
2. Choose available time slot
3. Enter appointment details
4. Confirm booking
5. Verify confirmation

**Expected Results:**
- [ ] Calendar displays available slots
- [ ] Booking form validates input
- [ ] Confirmation email sent
- [ ] Appointment appears in dashboard
- [ ] Appointment details correct

---

### Mobile Application Tests

#### Test 1: App Launch (iOS)
**Device:** iPhone (iOS 14+)

**Steps:**
1. Open UnifiedHealth app
2. Wait for splash screen
3. Observe home screen

**Expected Results:**
- [ ] App launches within 3 seconds
- [ ] No crash on startup
- [ ] Home screen renders correctly
- [ ] Navigation functional

---

#### Test 2: App Launch (Android)
**Device:** Android (10+)

**Steps:**
1. Open UnifiedHealth app
2. Wait for splash screen
3. Observe home screen

**Expected Results:**
- [ ] App launches within 3 seconds
- [ ] No crash on startup
- [ ] Home screen renders correctly
- [ ] Navigation functional

---

#### Test 3: Push Notifications (Mobile)
**Platform:** iOS/Android

**Steps:**
1. Book an appointment
2. Wait for confirmation notification
3. Verify notification received

**Expected Results:**
- [ ] Notification received within 30 seconds
- [ ] Notification content correct
- [ ] Tapping notification opens app
- [ ] Notification leads to correct screen

---

## Performance Validation

### Response Time Tests

#### Test API Response Times
```bash
#!/bin/bash
# test-performance.sh

API_URL="https://api.unifiedhealth.io"

echo "Testing API Performance..."
echo "========================="

# Test health endpoint (should be < 100ms)
echo -n "Health endpoint: "
TIME=$(curl -s -o /dev/null -w "%{time_total}" $API_URL/health)
echo "${TIME}s"
if (( $(echo "$TIME < 0.1" | bc -l) )); then
  echo "✓ PASS (< 100ms)"
else
  echo "✗ SLOW (> 100ms)"
fi

# Test authentication endpoint (should be < 500ms)
echo -n "Login endpoint: "
TIME=$(curl -s -o /dev/null -w "%{time_total}" \
  -X POST $API_URL/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}')
echo "${TIME}s"
if (( $(echo "$TIME < 0.5" | bc -l) )); then
  echo "✓ PASS (< 500ms)"
else
  echo "✗ SLOW (> 500ms)"
fi

# Test provider search (should be < 200ms)
echo -n "Provider search: "
TIME=$(curl -s -o /dev/null -w "%{time_total}" \
  "$API_URL/v1/providers?specialty=cardiology")
echo "${TIME}s"
if (( $(echo "$TIME < 0.2" | bc -l) )); then
  echo "✓ PASS (< 200ms)"
else
  echo "✗ SLOW (> 200ms)"
fi
```

**Expected Results:**
- [ ] Health endpoint < 100ms
- [ ] Auth endpoints < 500ms
- [ ] Search endpoints < 200ms
- [ ] CRUD operations < 300ms

---

### Load Test (Light)
```javascript
// k6-smoke-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10, // 10 virtual users
  duration: '1m', // 1 minute test
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests < 200ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  const res = http.get('https://api.unifiedhealth.io/v1/providers');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

**Run:**
```bash
k6 run k6-smoke-test.js
```

**Expected Results:**
- [ ] p95 response time < 200ms
- [ ] Error rate < 1%
- [ ] All checks passing

---

## Security Validation

### Security Tests

#### Test 1: HTTPS Enforcement
```bash
# Test HTTP redirect to HTTPS
curl -I http://api.unifiedhealth.io

# Expected: 301 redirect to https://
```

**Expected:**
- [ ] HTTP redirects to HTTPS
- [ ] HSTS header present
- [ ] Valid SSL certificate

---

#### Test 2: Authentication Required
```bash
# Test unauthorized access
curl -I https://api.unifiedhealth.io/v1/patients/me

# Expected: 401 Unauthorized
```

**Expected:**
- [ ] Protected endpoints require auth
- [ ] Returns 401 without token
- [ ] Returns 403 with invalid token

---

#### Test 3: SQL Injection Prevention
```bash
# Test SQL injection attempt
curl -X POST https://api.unifiedhealth.io/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com OR 1=1--","password":"test"}'

# Expected: 401 or 400, not 500
```

**Expected:**
- [ ] Request rejected or returns 401
- [ ] No SQL error messages
- [ ] Application doesn't crash

---

#### Test 4: XSS Prevention
```bash
# Test XSS attempt
curl -X POST https://api.unifiedhealth.io/v1/patients/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"<script>alert(1)</script>"}'

# Expected: Input sanitized
```

**Expected:**
- [ ] Input sanitized
- [ ] Script tags escaped
- [ ] No JavaScript execution

---

## Integration Tests

### External Service Tests

#### Test 1: Payment Gateway (Stripe)
```bash
# Test Stripe connectivity
curl https://api.unifiedhealth.io/v1/payments/health

# Expected: 200 OK with Stripe status
```

**Expected:**
- [ ] Stripe API reachable
- [ ] Test payment successful
- [ ] Webhook receiving events

---

#### Test 2: SMS Notifications (Twilio)
```bash
# Test SMS notification
curl -X POST https://api.unifiedhealth.io/v1/test/sms \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","message":"Test message"}'

# Expected: 200 OK
```

**Expected:**
- [ ] SMS sent successfully
- [ ] Delivery confirmed
- [ ] No errors in logs

---

#### Test 3: Email Notifications (SendGrid)
```bash
# Test email notification
curl -X POST https://api.unifiedhealth.io/v1/test/email \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","subject":"Test","body":"Test"}'

# Expected: 200 OK
```

**Expected:**
- [ ] Email sent successfully
- [ ] Email received in inbox
- [ ] Correct formatting

---

#### Test 4: FHIR Server
```bash
# Test FHIR server connectivity
curl https://fhir.unifiedhealth.io/metadata

# Expected: FHIR capability statement
```

**Expected:**
- [ ] FHIR server accessible
- [ ] Capability statement returned
- [ ] FHIR version correct (R4)

---

## Regional Validation

### Multi-Region Tests

#### Test All Regions
```bash
#!/bin/bash
# test-all-regions.sh

REGIONS=(
  "us-east:https://us-east.api.unifiedhealth.io"
  "us-west:https://us-west.api.unifiedhealth.io"
  "eu:https://eu.api.unifiedhealth.io"
  "asia:https://asia.api.unifiedhealth.io"
)

for region in "${REGIONS[@]}"; do
  IFS=':' read -r name url <<< "$region"
  echo "Testing $name..."

  STATUS=$(curl -s -o /dev/null -w "%{http_code}" $url/health)

  if [ $STATUS -eq 200 ]; then
    echo "  ✓ $name is healthy"
  else
    echo "  ✗ $name is unhealthy (Status: $STATUS)"
    exit 1
  fi
done

echo "All regions healthy! ✓"
```

**Expected Results:**
- [ ] All regions return 200 OK
- [ ] Response times acceptable
- [ ] No regional outages

---

## Test Results Documentation

### Test Report Template

```markdown
# Smoke Test Results - v[X.Y.Z]

**Date:** [YYYY-MM-DD HH:MM UTC]
**Environment:** Production
**Tester:** [Name]
**Duration:** [XX] minutes

## Summary

| Category | Passed | Failed | Total | Pass Rate |
|----------|--------|--------|-------|-----------|
| Health Checks | X | X | X | XX% |
| Authentication | X | X | X | XX% |
| Core Features | X | X | X | XX% |
| Payment | X | X | X | XX% |
| Integrations | X | X | X | XX% |
| Performance | X | X | X | XX% |
| Security | X | X | X | XX% |
| **TOTAL** | **X** | **X** | **X** | **XX%** |

## Test Execution Log

### Health Checks
- [✓] API Health: PASS
- [✓] Database: PASS
- [✓] Redis: PASS
- [✓] External Services: PASS

### Authentication
- [✓] User Registration: PASS
- [✓] User Login: PASS
- [✓] Token Validation: PASS

### Core Features
- [✓] Provider Search: PASS
- [✓] Appointment Booking: PASS
- [✓] Patient Records: PASS

### Failures

[None | List failures]

## Performance Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| API p95 | [XX]ms | <200ms | [PASS/FAIL] |
| Error Rate | [X.X]% | <0.1% | [PASS/FAIL] |
| Uptime | [XX.XX]% | >99.9% | [PASS/FAIL] |

## Issues Discovered

[None | List issues with severity]

## Recommendations

[Any recommendations or concerns]

## Sign-Off

**QA Lead:** _________________ Date: _______
**Release Manager:** _________________ Date: _______

**Deployment Status:** [✓ APPROVED | ✗ ROLLBACK REQUIRED]
```

---

## Automated Test Results

### CI/CD Integration

```yaml
# .github/workflows/smoke-tests.yml
name: Production Smoke Tests

on:
  deployment_status:

jobs:
  smoke-tests:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install
        working-directory: ./tests/smoke

      - name: Run smoke tests
        run: npm run test:smoke:production
        working-directory: ./tests/smoke
        env:
          API_BASE_URL: ${{ secrets.PRODUCTION_API_URL }}
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: smoke-test-results
          path: tests/smoke/results/

      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Smoke tests failed! Deployment may need rollback.'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Appendix

### A. Test Data

**Test Users:**
- Patient: `patient-smoke-test@unifiedhealth.io`
- Provider: `provider-smoke-test@unifiedhealth.io`
- Admin: `admin-smoke-test@unifiedhealth.io`

**Test Credentials:**
- Password: `SecureTestPassword123!`

**Test Payment:**
- Card: `4242 4242 4242 4242`
- Exp: `12/25`
- CVC: `123`

### B. Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Tests timing out | Network issues | Check connectivity |
| 401 Unauthorized | Invalid token | Refresh test tokens |
| 500 Internal Error | Deployment issue | Check logs, consider rollback |
| Slow response times | High load | Check scaling |

### C. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-17 | Initial version |

---

**Document Classification:** Internal
**Review Frequency:** Before each deployment
**Next Review:** [Before next deployment]
