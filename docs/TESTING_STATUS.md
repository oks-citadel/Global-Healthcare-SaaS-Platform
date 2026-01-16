# Testing Infrastructure Status

**Last Updated:** December 31, 2025
**Version:** 1.0.0

## Overview

This document provides a comprehensive overview of the testing infrastructure for the Global Healthcare SaaS Platform, including test coverage configurations, CI/CD integration, and recommendations for improvement.

---

## Table of Contents

1. [Test Coverage Summary](#test-coverage-summary)
2. [Test Framework Configuration](#test-framework-configuration)
3. [Coverage Thresholds](#coverage-thresholds)
4. [Integration Test Setup](#integration-test-setup)
5. [E2E Test Configuration](#e2e-test-configuration)
6. [CI/CD Test Pipeline](#cicd-test-pipeline)
7. [Running Tests](#running-tests)
8. [Recommendations](#recommendations)

---

## Test Coverage Summary

### By Component

| Component | Framework | Coverage Config | Thresholds | Status |
|-----------|-----------|-----------------|------------|--------|
| **Apps** |
| apps/web | Vitest | vitest.config.ts | 60/50/60/60 | Configured |
| apps/mobile | Jest | jest.config.js | 60/50/60/60 | Configured |
| **Services** |
| services/api | Vitest | vitest.config.ts | 70/70/70/70 | Configured |
| services/api-gateway | Vitest | vitest.config.ts | 80/80/80/80 | Configured |
| services/auth-service | Vitest | - | Missing | Needs Config |
| services/notification-service | Vitest | - | Missing | Needs Config |
| services/pharmacy-service | Vitest | - | Missing | Needs Config |
| services/imaging-service | Jest | jest.config.js | 60/50/60/60 | Configured |
| services/telehealth-service | Vitest | vitest.config.ts | 80/80/80/80 | Configured |
| services/chronic-care-service | Vitest | vitest.config.ts | 80/80/80/80 | Configured |
| **Packages** |
| packages/sdk | Vitest | vitest.config.ts | 80/80/80/80 | Configured |
| packages/ui | Vitest | vitest.config.ts | 80/80/80/80 | Configured |
| packages/i18n | Vitest | vitest.config.ts | 80/80/80/80 | Configured |
| packages/compliance | Vitest | vitest.config.ts | 80/80/80/80 | Configured |
| packages/fhir | Jest | jest.config.js | 60/50/60/60 | Configured |
| packages/policy | Jest | jest.config.js | 60/50/60/60 | Configured |
| packages/adapters | Jest | jest.config.js | 60/50/60/60 | Configured |
| packages/country-config | Jest | jest.config.js | 60/50/60/60 | Configured |
| packages/entitlements | Jest | jest.config.js | 60/50/60/60 | Configured |
| packages/ai-workflows | Jest | jest.config.js | 60/50/60/60 | Configured |

### Legend

- Thresholds format: statements/branches/functions/lines
- 60/50/60/60: Minimum target thresholds
- 70/70/70/70: Standard thresholds
- 80/80/80/80: Strict thresholds

---

## Test Framework Configuration

### Vitest Configuration (Recommended for New Services)

Services using Vitest have the following standardized configuration:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // or 'jsdom' for UI components
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        'tests/',
      ],
      all: true,
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60,
      },
    },
    include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Jest Configuration (Legacy/React Native)

Packages using Jest have the following configuration:

```javascript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  passWithNoTests: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "json", "html"],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 50,
      functions: 60,
      lines: 60,
    },
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
  ],
};
```

---

## Coverage Thresholds

### Target Thresholds

The platform uses the following minimum coverage thresholds:

| Metric | Minimum | Standard | Strict |
|--------|---------|----------|--------|
| Statements | 60% | 70% | 80% |
| Branches | 50% | 70% | 80% |
| Functions | 60% | 70% | 80% |
| Lines | 60% | 70% | 80% |

### Threshold Application

- **New code**: Should meet Standard (70%) thresholds
- **Critical services** (API, Auth, Payment): Should meet Strict (80%) thresholds
- **Legacy code**: Minimum (60%) thresholds acceptable during transition

---

## Integration Test Setup

### Docker Compose Test Environment

The platform provides two Docker Compose configurations for testing:

#### 1. CI/CD Testing (`docker-compose.ci.yml`)

Used for continuous integration pipelines:

```bash
# Start CI test environment
docker compose -f docker-compose.ci.yml up -d

# Run tests
docker compose -f docker-compose.ci.yml run test

# Cleanup
docker compose -f docker-compose.ci.yml down -v
```

#### 2. Integration Testing (`docker-compose.test.yml`)

Full integration test environment with all services:

```bash
# Start integration test environment
docker compose -f docker-compose.test.yml up -d

# Wait for services to be healthy
docker compose -f docker-compose.test.yml ps

# Run integration tests
docker compose -f docker-compose.test.yml run test-runner

# Run E2E tests
docker compose -f docker-compose.test.yml run e2e-test

# Cleanup
docker compose -f docker-compose.test.yml down -v
```

### Test Infrastructure Services

| Service | Port (Host) | Purpose |
|---------|-------------|---------|
| postgres-test | 5433 | PostgreSQL test database |
| redis-test | 6380 | Redis test instance |
| minio-test | 9100/9101 | S3-compatible storage |
| mailhog-test | 1025/8025 | Email testing (SMTP/Web UI) |
| api-test | 8081 | API service test instance |
| auth-service-test | 3011 | Auth service test instance |
| notification-service-test | 3016 | Notification service test instance |
| web-test | 3010 | Web application test instance |

---

## E2E Test Configuration

### Playwright Configuration

E2E tests are located in `apps/web/e2e/` with the following setup:

**Configuration:** `apps/web/e2e/playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
    { name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
    { name: 'Google Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
  ],
});
```

### E2E Test Categories

| Test File | Description |
|-----------|-------------|
| auth.spec.ts | Authentication flows |
| dashboard.spec.ts | Dashboard functionality |
| appointments.spec.ts | Appointment booking and management |
| prescriptions.spec.ts | Prescription management |
| medical-records.spec.ts | Medical records viewing |
| billing.spec.ts | Billing and payments |
| settings.spec.ts | User settings |
| accessibility.spec.ts | Accessibility compliance (WCAG) |
| performance.spec.ts | Performance benchmarks |
| visual-regression.spec.ts | Visual regression testing |

### Running E2E Tests

```bash
# Run all E2E tests
pnpm --filter @unified-health/web test:e2e

# Run specific browser
pnpm --filter @unified-health/web test:e2e:chromium
pnpm --filter @unified-health/web test:e2e:firefox
pnpm --filter @unified-health/web test:e2e:webkit

# Run mobile tests
pnpm --filter @unified-health/web test:e2e:mobile

# Run with UI
pnpm --filter @unified-health/web test:e2e:ui

# Run specific test file
pnpm --filter @unified-health/web test:e2e:auth
pnpm --filter @unified-health/web test:e2e:accessibility

# Update snapshots
pnpm --filter @unified-health/web test:e2e:update-snapshots
```

---

## CI/CD Test Pipeline

### GitHub Actions Workflow

**Location:** `.github/workflows/ci-tests.yml`

### Pipeline Stages

1. **Setup**: Install dependencies and cache
2. **Unit Tests - API**: Run API service unit tests
3. **Unit Tests - Notification**: Run notification service tests
4. **Payment Tests**: Run payment and billing tests
5. **Webhook Tests**: Run Stripe webhook tests
6. **Security Tests**: Run security-specific tests
7. **TypeScript Check**: Type checking across services
8. **CI Gate**: Summary and PR comment

### Triggers

- Pull requests to `main` and `develop` branches
- Push to `main` and `develop` branches
- Manual trigger via `workflow_dispatch`

### Test Result Reporting

The CI pipeline automatically:
- Uploads coverage reports as artifacts
- Posts test summary as PR comment
- Fails if any critical test category fails

---

## Running Tests

### Root Level Commands

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

### Service-Specific Commands

```bash
# API Service
cd services/api
pnpm test                    # Run all tests
pnpm test:unit               # Unit tests only
pnpm test:integration        # Integration tests
pnpm test:coverage           # With coverage

# Web App
cd apps/web
pnpm test                    # Unit tests
pnpm test:coverage           # With coverage
pnpm test:e2e                # E2E tests
pnpm test:all                # Unit + E2E

# Mobile App
cd apps/mobile
pnpm test                    # Jest tests
```

### Docker-Based Testing

```bash
# CI environment (fast, minimal)
docker compose -f docker-compose.ci.yml up -d
docker compose -f docker-compose.ci.yml run test
docker compose -f docker-compose.ci.yml down -v

# Full integration environment
docker compose -f docker-compose.test.yml up -d
docker compose -f docker-compose.test.yml run test-runner
docker compose -f docker-compose.test.yml run e2e-test
docker compose -f docker-compose.test.yml down -v
```

---

## Recommendations

### High Priority

1. **Add Vitest Configuration for Services Missing Configs**
   - `services/auth-service`
   - `services/notification-service`
   - `services/pharmacy-service`
   - `services/laboratory-service`
   - `services/mental-health-service`

2. **Increase Coverage on Critical Services**
   - Target 80% coverage for API, Auth, and Payment services
   - Add more integration tests for cross-service communication

3. **Add Test Coverage Reporting to CI**
   - Upload coverage reports to Codecov or similar
   - Add coverage badges to README

### Medium Priority

4. **Standardize Test Structure**
   - Use consistent folder structure: `tests/unit/`, `tests/integration/`, `tests/e2e/`
   - Create shared test utilities package

5. **Add Performance Testing**
   - Add k6 or Artillery for API load testing
   - Add Lighthouse CI for web performance

6. **Add Contract Testing**
   - Implement Pact or similar for API contract testing
   - Ensure backward compatibility between services

### Low Priority

7. **Add Mutation Testing**
   - Consider Stryker for mutation testing
   - Use to validate test quality

8. **Add Visual Regression CI**
   - Integrate visual regression tests in CI
   - Use Percy or Chromatic for visual testing

---

## Appendix

### Test Environment Variables

```env
# Test Database
DATABASE_URL=postgresql://test_user:test_password@localhost:5433/unified_health_test

# Test Redis
REDIS_HOST=localhost
REDIS_PORT=6380

# Test API
API_URL=http://localhost:8081
AUTH_SERVICE_URL=http://localhost:3011
NOTIFICATION_SERVICE_URL=http://localhost:3016

# Test Credentials
JWT_SECRET=test-jwt-secret-for-integration-tests-only

# Test S3 (MinIO)
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_ENDPOINT=http://localhost:9100
AWS_S3_BUCKET=test-bucket

# Test Email (MailHog)
SMTP_HOST=localhost
SMTP_PORT=1025
```

### Coverage Report Locations

| Component | Report Location |
|-----------|-----------------|
| services/api | `services/api/coverage/` |
| apps/web | `apps/web/coverage/` |
| apps/mobile | `apps/mobile/coverage/` |
| packages/* | `packages/*/coverage/` |
| E2E Tests | `apps/web/e2e/test-results/` |

---

*For questions or updates, contact the Platform Engineering team.*
