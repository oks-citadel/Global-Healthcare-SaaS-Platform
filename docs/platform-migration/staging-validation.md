# Staging Validation Plan

> **Version:** 1.0.0
> **Last Updated:** 2026-01-24
> **Purpose:** Pre-production validation before DNS cutover

## Staging Environment URLs

| Component | Staging URL | Production URL |
|-----------|-------------|----------------|
| Web App | `staging.yourdomain.com` | `app.yourdomain.com` |
| Admin | `admin-staging.yourdomain.com` | `admin.yourdomain.com` |
| API | `api-staging.yourdomain.com` | `api.yourdomain.com` |
| WebSocket | `ws-staging.yourdomain.com` | `ws.yourdomain.com` |

---

## Pre-Validation Checklist

### Infrastructure Ready

- [ ] Vercel staging project deployed
- [ ] Railway staging environment created
- [ ] Staging database provisioned and migrated
- [ ] Staging Redis provisioned
- [ ] SSL certificates issued (automatic)
- [ ] DNS records pointing to staging

### Configuration Verified

- [ ] Environment variables set in Vercel (staging)
- [ ] Environment variables set in Railway (staging)
- [ ] CORS origins include staging URLs
- [ ] API URLs point to staging backend
- [ ] Feature flags set appropriately

---

## Validation Test Cases

### 1. Authentication Tests

#### 1.1 User Registration

```bash
# Test: Create new account
curl -X POST https://api-staging.yourdomain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-$(date +%s)@example.com",
    "password": "SecureP@ssw0rd123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Expected: 201 Created
# Response: { "user": {...}, "tokens": {...} }
```

**Manual Steps:**
- [ ] Go to staging.yourdomain.com
- [ ] Click "Sign Up"
- [ ] Fill registration form
- [ ] Verify email verification sent (check staging email or logs)
- [ ] Confirm account via email link
- [ ] Verify redirect to dashboard

#### 1.2 User Login

```bash
# Test: Login with valid credentials
curl -X POST https://api-staging.yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecureP@ssw0rd123!"
  }'

# Expected: 200 OK
# Response: { "accessToken": "...", "refreshToken": "..." }
```

**Manual Steps:**
- [ ] Go to staging.yourdomain.com/auth/login
- [ ] Enter valid credentials
- [ ] Verify redirect to dashboard
- [ ] Verify session persists on refresh

#### 1.3 MFA Flow (if enabled)

**Manual Steps:**
- [ ] Login as user with MFA enabled
- [ ] Verify MFA challenge appears
- [ ] Enter TOTP code
- [ ] Verify successful login

#### 1.4 Password Reset

**Manual Steps:**
- [ ] Click "Forgot Password"
- [ ] Enter email address
- [ ] Verify reset email received
- [ ] Click reset link
- [ ] Set new password
- [ ] Verify can login with new password

#### 1.5 OAuth Login (if configured)

**Manual Steps:**
- [ ] Click "Sign in with Google"
- [ ] Complete Google OAuth flow
- [ ] Verify account created/linked
- [ ] Verify redirect to dashboard

---

### 2. Core API Tests

#### 2.1 Health Check

```bash
# Test: API health
curl https://api-staging.yourdomain.com/health

# Expected: 200 OK
# Response: { "status": "healthy", "checks": {...} }
```

#### 2.2 User Profile

```bash
# Test: Get current user
curl https://api-staging.yourdomain.com/api/v1/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: 200 OK
# Response: { "id": "...", "email": "...", ... }
```

#### 2.3 CRUD Operations

```bash
# Test: Create resource (example: appointment)
curl -X POST https://api-staging.yourdomain.com/api/v1/appointments \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "providerId": "provider-id",
    "scheduledAt": "2026-02-01T10:00:00Z",
    "reason": "Checkup"
  }'

# Expected: 201 Created

# Test: Read resource
curl https://api-staging.yourdomain.com/api/v1/appointments/$APPOINTMENT_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: 200 OK

# Test: Update resource
curl -X PATCH https://api-staging.yourdomain.com/api/v1/appointments/$APPOINTMENT_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Updated reason"}'

# Expected: 200 OK

# Test: Delete resource
curl -X DELETE https://api-staging.yourdomain.com/api/v1/appointments/$APPOINTMENT_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: 204 No Content
```

---

### 3. Frontend Tests

#### 3.1 Page Load Tests

```bash
# Test each main page loads
pages=(
  "/"
  "/auth/login"
  "/auth/register"
  "/dashboard"
  "/appointments"
  "/profile"
)

for page in "${pages[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://staging.yourdomain.com$page")
  echo "$page: $status"
done
```

#### 3.2 Static Assets

```bash
# Test: CSS loads
curl -I https://staging.yourdomain.com/_next/static/css/app.css

# Test: JS loads
curl -I https://staging.yourdomain.com/_next/static/chunks/main.js

# Expected: 200 OK for all
```

#### 3.3 Web Vitals

**Manual Steps:**
- [ ] Open Chrome DevTools → Lighthouse
- [ ] Run Performance audit
- [ ] Verify LCP < 2.5s
- [ ] Verify FID < 100ms
- [ ] Verify CLS < 0.1

---

### 4. Real-time Features (WebSocket)

#### 4.1 WebSocket Connection

```javascript
// Browser console test
const ws = new WebSocket('wss://ws-staging.yourdomain.com');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', e.data);
ws.onerror = (e) => console.error('Error:', e);
```

**Manual Steps:**
- [ ] Open two browser windows
- [ ] Login as two different users
- [ ] Send real-time message/notification
- [ ] Verify received in other window

#### 4.2 Telehealth Video (if applicable)

**Manual Steps:**
- [ ] Schedule telehealth appointment
- [ ] Join as patient
- [ ] Join as provider (different browser)
- [ ] Verify video/audio connection
- [ ] Verify chat works
- [ ] End call and verify recording (if enabled)

---

### 5. Payment Processing (if applicable)

#### 5.1 Stripe Test Mode

**Prerequisites:**
- Staging uses Stripe test keys
- Test card: 4242 4242 4242 4242

**Manual Steps:**
- [ ] Navigate to payment flow
- [ ] Enter test card details
- [ ] Complete payment
- [ ] Verify success message
- [ ] Check Stripe dashboard for transaction
- [ ] Verify webhook received

#### 5.2 Subscription Flow

**Manual Steps:**
- [ ] Start subscription signup
- [ ] Select plan
- [ ] Enter payment details
- [ ] Verify subscription active
- [ ] Test cancellation flow

---

### 6. File Upload Tests

#### 6.1 Document Upload

```bash
# Test: Upload file
curl -X POST https://api-staging.yourdomain.com/api/v1/documents/upload \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "file=@test-document.pdf" \
  -F "type=medical_record"

# Expected: 201 Created
# Response: { "id": "...", "url": "..." }
```

**Manual Steps:**
- [ ] Navigate to upload interface
- [ ] Select valid file (PDF, image)
- [ ] Upload file
- [ ] Verify success message
- [ ] Verify file appears in list
- [ ] Download and verify content

#### 6.2 Upload Validation

**Manual Steps:**
- [ ] Try uploading invalid file type
- [ ] Verify error message
- [ ] Try uploading oversized file
- [ ] Verify error message

---

### 7. Email Tests

#### 7.1 Transactional Emails

**Manual Steps:**
- [ ] Trigger welcome email (registration)
- [ ] Verify email received (staging inbox or logs)
- [ ] Verify email content correct
- [ ] Verify links work

- [ ] Trigger password reset email
- [ ] Verify email received
- [ ] Verify reset link works

- [ ] Trigger appointment reminder (if applicable)
- [ ] Verify email content

---

### 8. Webhook Tests

#### 8.1 Stripe Webhooks

```bash
# Use Stripe CLI for webhook testing
stripe listen --forward-to https://api-staging.yourdomain.com/webhooks/stripe

# Trigger test event
stripe trigger payment_intent.succeeded
```

**Verification:**
- [ ] Webhook received by staging API
- [ ] Event processed correctly
- [ ] Database updated appropriately

---

### 9. Admin Portal Tests

**Manual Steps:**
- [ ] Login to admin-staging.yourdomain.com
- [ ] View user list
- [ ] Search for user
- [ ] View user details
- [ ] Edit user (if applicable)
- [ ] View analytics dashboard
- [ ] Export data (if applicable)

---

### 10. Provider Portal Tests (if applicable)

**Manual Steps:**
- [ ] Login as provider
- [ ] View schedule
- [ ] View patient list
- [ ] Access patient record
- [ ] Update clinical notes
- [ ] Complete encounter

---

### 11. Mobile App Tests (if applicable)

**Prerequisites:**
- Update mobile app to point to staging API

**Manual Steps:**
- [ ] Login on mobile
- [ ] View dashboard
- [ ] Complete core flow (appointment, etc.)
- [ ] Test push notifications
- [ ] Test offline mode

---

## Performance Baseline

### Load Testing

```bash
# Using k6 for load testing
k6 run --vus 50 --duration 60s staging-load-test.js
```

**Targets:**
| Metric | Target | Actual |
|--------|--------|--------|
| P95 Response Time | < 500ms | ___ms |
| P99 Response Time | < 1000ms | ___ms |
| Error Rate | < 1% | ___% |
| Throughput | > 100 rps | ___ rps |

---

## Security Validation

### Security Headers

```bash
# Check security headers
curl -I https://staging.yourdomain.com | grep -E "^(Strict-Transport|X-Frame|X-Content|Content-Security)"
```

- [ ] HSTS header present
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Content-Security-Policy present

### SSL/TLS

```bash
# Check TLS configuration
testssl.sh https://api-staging.yourdomain.com
```

- [ ] TLS 1.2+ only
- [ ] No weak ciphers
- [ ] Valid certificate chain

### Rate Limiting

```bash
# Test rate limits
for i in {1..110}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://api-staging.yourdomain.com/api/v1/status
done | tail -20
```

- [ ] 429 returned after exceeding limit
- [ ] Rate limit headers present

---

## Sign-off Checklist

### Functional Sign-off

| Area | Tester | Status | Date |
|------|--------|--------|------|
| Authentication | | [ ] Pass / [ ] Fail | |
| Core API | | [ ] Pass / [ ] Fail | |
| Frontend | | [ ] Pass / [ ] Fail | |
| Real-time | | [ ] Pass / [ ] Fail | |
| Payments | | [ ] Pass / [ ] Fail | |
| File Upload | | [ ] Pass / [ ] Fail | |
| Email | | [ ] Pass / [ ] Fail | |
| Admin Portal | | [ ] Pass / [ ] Fail | |

### Non-Functional Sign-off

| Area | Tester | Status | Date |
|------|--------|--------|------|
| Performance | | [ ] Pass / [ ] Fail | |
| Security | | [ ] Pass / [ ] Fail | |
| Accessibility | | [ ] Pass / [ ] Fail | |

### Final Approval

| Role | Name | Approval | Date |
|------|------|----------|------|
| QA Lead | | [ ] Approved | |
| Engineering Lead | | [ ] Approved | |
| Product Owner | | [ ] Approved | |

---

## Issues Found

| ID | Description | Severity | Status | Resolution |
|----|-------------|----------|--------|------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## Go/No-Go Decision

After completing all validation:

- [ ] All critical tests pass
- [ ] No P1/P2 issues outstanding
- [ ] Performance within acceptable range
- [ ] Security baseline met
- [ ] Stakeholder sign-off obtained

**Decision:** [ ] GO for production cutover / [ ] NO-GO - issues to resolve

**Scheduled Cutover Date/Time:** _______________

**Notes:**
