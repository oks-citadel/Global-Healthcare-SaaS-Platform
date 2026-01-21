# QA Inventory - Unified Health Platform

**Generated:** 2026-01-19
**Platform:** Unified Health Global Healthcare SaaS
**Version:** 1.0.0

---

## Executive Summary

This document provides a comprehensive inventory of the Unified Health Platform for QA testing purposes, including API endpoints, UI journeys, current test coverage, identified gaps, and recommended test suite structure.

### Key Metrics
| Metric | Count |
|--------|-------|
| Total API Endpoints | 200+ |
| Microservices | 21 |
| Frontend Apps | 5 |
| Existing Test Files | 626 |
| E2E Test Files | 19 |
| Critical User Journeys | 15 |
| Coverage Gaps Identified | 12 |

---

## 1. Technology Stack

### Frontend
| App | Framework | Version | Test Framework |
|-----|-----------|---------|----------------|
| Web (Patient Portal) | Next.js | 16.1.0 | Playwright, Vitest |
| Admin Dashboard | Next.js | 14.2.35 | Playwright |
| Provider Portal | Next.js | 14.x | None |
| Kiosk | Next.js | 14.x | None |
| Mobile | React Native/Expo | 54.0.30 | Jest |

### Backend
| Service | Framework | Database | Test Framework |
|---------|-----------|----------|----------------|
| API Service | Express 5.x | PostgreSQL (Prisma) | Vitest |
| Auth Service | Express | PostgreSQL | Vitest |
| 19 Microservices | Express | PostgreSQL/MongoDB | Vitest/Jest |

### Infrastructure
- **Monorepo:** pnpm + Turborepo
- **CI/CD:** GitHub Actions
- **Container:** Docker + Kubernetes
- **Cloud:** AWS (ECR, ECS, S3, KMS)

---

## 2. API Endpoint Inventory

### 2.1 Main API Service (`/services/api`)

#### Authentication Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login with credentials |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | Required | Logout user |
| GET | `/auth/me` | Required | Get current user |
| GET | `/roles` | Admin | Get available roles |

#### User Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/{id}` | Required | Get user by ID |
| PATCH | `/users/{id}` | Required | Update user |
| GET | `/users/me/export` | Required | GDPR data export |
| DELETE | `/users/me` | Required | GDPR right to erasure |

#### Patient Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/patients` | Required | Create patient |
| GET | `/patients/{id}` | Required | Get patient |
| PATCH | `/patients/{id}` | Required | Update patient |

#### Appointments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/appointments` | Subscription | Create appointment |
| GET | `/appointments` | Required | List appointments |
| GET | `/appointments/{id}` | Required | Get appointment |
| PATCH | `/appointments/{id}` | Subscription | Update appointment |
| DELETE | `/appointments/{id}` | Required | Cancel appointment |
| GET | `/appointments/pricing` | Required | Get pricing |

#### Encounters
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/encounters` | Provider+ | Create encounter |
| GET | `/encounters` | Required | List encounters |
| GET | `/encounters/{id}` | Required | Get encounter |
| PATCH | `/encounters/{id}` | Provider+ | Update encounter |
| POST | `/encounters/{id}/notes` | Provider+ | Add clinical note |
| POST | `/encounters/{id}/start` | Provider+ | Start encounter |
| POST | `/encounters/{id}/end` | Provider+ | End encounter |

#### Documents
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/documents` | Required | Upload document |
| GET | `/documents` | Required | List documents |
| GET | `/documents/{id}` | Required | Get document |
| DELETE | `/documents/{id}` | Required | Delete document |
| GET | `/documents/{id}/download` | Required | Get download URL |

#### Billing & Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/payments/config` | Public | Get Stripe config |
| POST | `/payments/setup-intent` | Required | Create SetupIntent |
| POST | `/payments/subscription` | Required | Create subscription |
| GET | `/payments/subscription` | Required | Get subscription |
| DELETE | `/payments/subscription` | Required | Cancel subscription |
| POST | `/payments/webhook` | Webhook | Stripe webhook |
| GET | `/payments/history` | Required | Payment history |

#### Plans & Subscriptions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/plans` | Public | List plans |
| POST | `/subscriptions` | Required | Create subscription |
| DELETE | `/subscriptions/{id}` | Required | Cancel subscription |

### 2.2 Microservices Endpoints

#### Auth Service
- OAuth: `/auth/oauth/{provider}`, `/auth/oauth/{provider}/callback`
- MFA: `/auth/mfa/*` endpoints
- Password: `/auth/forgot-password`, `/auth/reset-password`

#### Pharmacy Service
- Prescriptions: CRUD + verify + fill
- Dispensing: Dispense + return
- Formulary: Full management
- Drug interactions: Safety checks
- Inventory: Stock management
- PDMP: Controlled substance monitoring

#### Telehealth Service
- Appointments: CRUD
- Visits: Create, start, end, messaging

#### Laboratory Service
- Lab Orders: CRUD
- Lab Results: Read
- Test Catalog: Read
- Samples: CRUD

#### Imaging Service
- Orders: CRUD
- Studies: Management
- Reports: Generation
- Critical Findings: Alerts

#### Additional Services (15+)
- Chronic Care, Clinical Trials, Mental Health
- Population Health, Home Health
- Interoperability (FHIR, HL7)
- Denial Management, Price Transparency
- Notification, Vendor Risk

---

## 3. Critical User Journeys

### 3.1 Authentication Journeys

| Journey | Priority | Current Coverage | Status |
|---------|----------|-----------------|--------|
| User Registration | P0 | Playwright | ✅ Covered |
| User Login | P0 | Playwright | ✅ Covered |
| Password Reset | P0 | Playwright | ✅ Covered |
| Logout | P0 | Playwright | ✅ Covered |
| Session Refresh | P1 | Playwright | ✅ Covered |
| OAuth Login | P1 | None | ❌ Gap |

### 3.2 Patient Journeys

| Journey | Priority | Current Coverage | Status |
|---------|----------|-----------------|--------|
| View Dashboard | P0 | Playwright | ✅ Covered |
| Book Appointment | P0 | Playwright | ✅ Covered |
| View Appointments | P0 | Playwright | ✅ Covered |
| Cancel Appointment | P1 | Playwright | ✅ Covered |
| View Medical Records | P0 | Playwright | ✅ Covered |
| View Prescriptions | P0 | Playwright | ✅ Covered |
| Request Refill | P1 | None | ❌ Gap |
| View Lab Results | P0 | Playwright | ✅ Covered |
| Update Profile | P0 | Playwright | ✅ Covered |
| Manage Documents | P1 | Playwright | ✅ Covered |
| Billing/Subscription | P0 | Playwright | ✅ Covered |

### 3.3 Provider Journeys

| Journey | Priority | Current Coverage | Status |
|---------|----------|-----------------|--------|
| Provider Dashboard | P0 | None | ❌ Gap |
| Create Encounter | P0 | None | ❌ Gap |
| View Patient List | P0 | None | ❌ Gap |
| Add Clinical Notes | P0 | None | ❌ Gap |
| Manage Schedule | P1 | None | ❌ Gap |
| Telehealth Visit | P0 | None | ❌ Gap |

### 3.4 Admin Journeys

| Journey | Priority | Current Coverage | Status |
|---------|----------|-----------------|--------|
| Admin Login | P0 | Playwright | ✅ Covered |
| User Management | P0 | Playwright | ✅ Covered |
| Audit Logs | P0 | Playwright | ✅ Covered |
| System Settings | P1 | Playwright | ✅ Covered |

### 3.5 Kiosk Journeys

| Journey | Priority | Current Coverage | Status |
|---------|----------|-----------------|--------|
| Patient Check-in | P0 | None | ❌ Gap |
| Queue Status | P1 | None | ❌ Gap |
| Quick Registration | P1 | None | ❌ Gap |
| Payment Processing | P0 | None | ❌ Gap |

---

## 4. Current Test Coverage Analysis

### 4.1 Test Distribution

```
Total Test Files: 626

By Type:
├── E2E Tests: 19 files
│   ├── Web App: 9 Playwright tests
│   ├── Admin App: 4 Playwright tests
│   └── Mobile: 2 Jest tests (minimal)
│
├── Unit Tests: 500+ files
│   ├── API Service: 30+ tests
│   ├── Auth Service: 8 tests
│   └── Microservices: 400+ tests
│
├── Integration Tests: 20+ files
│   ├── API Service: 7 tests
│   └── Microservices: 15+ tests
│
├── Security Tests: 15+ files
│   ├── IDOR & Cross-tenant: 2 tests
│   ├── Privilege Escalation: 2 tests
│   ├── Business Logic: 4 tests
│   └── Error Leakage: 1 test
│
└── Performance: Load testing configs
```

### 4.2 Coverage by Application

| Application | Unit | Integration | E2E | Visual | A11y | Overall |
|-------------|------|-------------|-----|--------|------|---------|
| Web Portal | 10% | 5% | 70% | 50% | 60% | **55%** |
| Admin | 5% | 0% | 30% | 0% | 0% | **15%** |
| Provider Portal | 0% | 0% | 0% | 0% | 0% | **0%** |
| Kiosk | 0% | 0% | 0% | 0% | 0% | **0%** |
| Mobile | 5% | 0% | 5% | 0% | 0% | **5%** |
| API Service | 60% | 40% | N/A | N/A | N/A | **55%** |
| Auth Service | 50% | 30% | N/A | N/A | N/A | **45%** |
| Microservices | 30% | 15% | N/A | N/A | N/A | **25%** |

---

## 5. Identified Gaps

### 5.1 Critical Gaps (P0)

| Gap ID | Area | Description | Impact |
|--------|------|-------------|--------|
| GAP-001 | Provider Portal | No E2E tests for provider workflows | High - Core business functionality |
| GAP-002 | Kiosk App | Zero test coverage | High - Patient-facing app |
| GAP-003 | Mobile App | Minimal tests (2 files) | High - Primary patient interface |
| GAP-004 | Telehealth | No WebSocket/real-time tests | High - Critical feature |
| GAP-005 | API Gateway | Limited middleware tests | Medium - Security risk |

### 5.2 Important Gaps (P1)

| Gap ID | Area | Description | Impact |
|--------|------|-------------|--------|
| GAP-006 | OAuth Flows | No OAuth integration tests | Medium |
| GAP-007 | Component Tests | Minimal React component tests | Medium |
| GAP-008 | Microservices | Inconsistent test coverage | Medium |
| GAP-009 | Load Testing | Not integrated in CI | Medium |
| GAP-010 | Visual Regression | Incomplete coverage | Low |
| GAP-011 | Database | No migration tests | Medium |
| GAP-012 | Contract Tests | No API contract testing | Medium |

---

## 6. Recommended Test Suite Structure

### 6.1 Directory Structure

```
/tests/
├── api/
│   ├── contracts/           # OpenAPI schema validation
│   │   ├── auth.contract.test.ts
│   │   ├── patients.contract.test.ts
│   │   └── appointments.contract.test.ts
│   ├── integration/         # API integration tests
│   │   ├── auth.integration.test.ts
│   │   ├── appointments.integration.test.ts
│   │   └── billing.integration.test.ts
│   ├── regression/          # Full regression suite
│   │   └── full-api.regression.test.ts
│   └── data/                # Test fixtures
│       ├── users.json
│       └── appointments.json
│
├── ui/
│   ├── specs/               # Playwright tests
│   │   ├── smoke/           # Smoke tests (fast)
│   │   │   ├── auth.smoke.spec.ts
│   │   │   ├── dashboard.smoke.spec.ts
│   │   │   └── appointments.smoke.spec.ts
│   │   ├── regression/      # Full regression
│   │   │   ├── patient-journeys.spec.ts
│   │   │   ├── provider-journeys.spec.ts
│   │   │   └── admin-journeys.spec.ts
│   │   ├── accessibility/   # A11y tests
│   │   │   └── wcag.a11y.spec.ts
│   │   └── visual/          # Visual regression
│   │       └── screenshots.visual.spec.ts
│   ├── pages/               # Page Object Models
│   │   ├── login.page.ts
│   │   ├── dashboard.page.ts
│   │   └── appointments.page.ts
│   └── fixtures/            # Test data & utilities
│       ├── test-data.ts
│       └── auth.fixture.ts
│
├── perf/                    # Performance tests
│   ├── k6/
│   │   ├── smoke.js
│   │   ├── load.js
│   │   └── stress.js
│   └── lighthouse/
│       └── budget.json
│
├── security/                # Security tests
│   ├── owasp/
│   │   ├── injection.test.ts
│   │   └── auth-bypass.test.ts
│   └── penetration/
│
└── scripts/                 # Utilities
    ├── seed-test-data.ts
    ├── reset-test-env.ts
    └── generate-report.ts
```

### 6.2 Test Run Cadence

| Suite | Trigger | Duration Target | Gate |
|-------|---------|-----------------|------|
| Lint + Type Check | PR | < 2 min | Blocking |
| Unit Tests | PR | < 5 min | Blocking |
| API Smoke | PR | < 3 min | Blocking |
| UI Smoke | PR | < 5 min | Blocking |
| API Regression | Nightly | < 30 min | Non-blocking |
| UI Regression | Nightly | < 45 min | Non-blocking |
| Performance | Nightly | < 15 min | Non-blocking |
| Security | Weekly | < 1 hour | Non-blocking |

---

## 7. Environment Configuration

### 7.1 Test Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Local | localhost:3000 | Development |
| CI | docker-compose | Automated tests |
| Staging | api-staging.theunifiedhealth.com | Pre-prod testing |
| Production | api.theunifiedhealth.com | Smoke only |

### 7.2 Required Environment Variables

```env
# Test Configuration
TEST_BASE_URL=http://localhost:3000
TEST_API_URL=http://localhost:3001/api/v1

# Test Users
TEST_PATIENT_EMAIL=patient@test.com
TEST_PATIENT_PASSWORD=Test@123456
TEST_PROVIDER_EMAIL=provider@test.com
TEST_PROVIDER_PASSWORD=Test@123456
TEST_ADMIN_EMAIL=admin@test.com
TEST_ADMIN_PASSWORD=Test@123456

# Database
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/unified_health_test

# Feature Flags
TEST_FEATURE_TELEHEALTH=true
TEST_FEATURE_BILLING=true
```

---

## 8. Data Strategy

### 8.1 Test Data Principles

1. **Deterministic:** All test data is seeded, not random
2. **Isolated:** Each test suite has its own data namespace
3. **Idempotent:** Tests can run repeatedly without cleanup
4. **Multi-tenant:** Data respects tenant boundaries

### 8.2 Seed Data Structure

```typescript
// Test Organizations
const testOrgs = [
  { id: 'org-test-001', name: 'Test Clinic', tier: 'premium' },
  { id: 'org-test-002', name: 'Basic Practice', tier: 'free' }
];

// Test Users
const testUsers = [
  { email: 'patient1@test.com', role: 'patient', orgId: 'org-test-001' },
  { email: 'provider1@test.com', role: 'provider', orgId: 'org-test-001' },
  { email: 'admin1@test.com', role: 'admin', orgId: 'org-test-001' }
];

// Test Appointments
const testAppointments = [
  { id: 'apt-001', patientId: 'user-001', providerId: 'user-002', status: 'scheduled' },
  { id: 'apt-002', patientId: 'user-001', providerId: 'user-002', status: 'completed' }
];
```

---

## 9. Quality Gates

### 9.1 PR Merge Requirements

| Gate | Threshold | Enforcement |
|------|-----------|-------------|
| Lint | 0 errors | Blocking |
| Type Check | 0 errors | Blocking |
| Unit Tests | 100% pass | Blocking |
| API Smoke | 100% pass | Blocking |
| UI Smoke | 100% pass | Blocking |
| Coverage | > 70% new code | Warning |

### 9.2 Release Requirements

| Gate | Threshold | Enforcement |
|------|-----------|-------------|
| Full Regression | 100% pass | Blocking |
| Performance | < 10% degradation | Warning |
| Security Scan | 0 critical/high | Blocking |
| Visual Regression | < 0.1% diff | Warning |

---

## 10. Next Steps

### Immediate (Sprint 1)
1. [ ] Set up `/tests/` directory structure
2. [ ] Implement API contract tests for core endpoints
3. [ ] Add missing E2E tests for provider portal
4. [ ] Configure Allure reporting

### Short-term (Sprint 2-3)
5. [ ] Implement kiosk app E2E tests
6. [ ] Add mobile app test coverage
7. [ ] Integrate load testing in CI
8. [ ] Add WebSocket/telehealth tests

### Medium-term (Sprint 4-6)
9. [ ] Achieve 80% coverage across all services
10. [ ] Implement visual regression for all apps
11. [ ] Add contract testing with Pact
12. [ ] Security penetration testing automation

---

## Appendix A: Existing Test File Locations

### E2E Tests
- `/apps/web/e2e/tests/*.spec.ts` (9 files)
- `/apps/admin/e2e/tests/*.spec.ts` (4 files)

### API Tests
- `/services/api/tests/unit/*.test.ts` (30+ files)
- `/services/api/tests/integration/*.test.ts` (7 files)
- `/services/api/tests/security/*.test.ts` (6 files)

### Microservice Tests
- `/services/*/tests/**/*.test.ts` (500+ files)

---

*Document maintained by QA Architect Agent*
