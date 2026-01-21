# QA Runbook - Unified Health Platform

This runbook provides comprehensive instructions for running, debugging, and maintaining the QA test suites for the Unified Health Platform.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Test Suite Overview](#test-suite-overview)
3. [Running Tests Locally](#running-tests-locally)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Test Reports](#test-reports)
6. [Debugging Failures](#debugging-failures)
7. [Writing New Tests](#writing-new-tests)
8. [Test Data Management](#test-data-management)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 9.0.0
- Docker (for local database)
- Playwright browsers (auto-installed)

### Install Dependencies

```bash
# Install all dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install --with-deps
```

### Run All Tests

```bash
# Run all test suites
pnpm test

# Run specific suite
pnpm test:unit       # Unit tests only
pnpm test:api        # API tests only
pnpm test:ui         # UI/E2E tests only
pnpm test:smoke      # Smoke tests (fast)
pnpm test:regression # Full regression suite
```

---

## Test Suite Overview

### Test Types

| Suite | Framework | Location | Purpose |
|-------|-----------|----------|---------|
| Unit Tests | Vitest | `services/*/tests/unit/` | Component/function testing |
| API Contract | Vitest | `tests/api/contracts/` | API schema validation |
| API Integration | Vitest | `tests/api/integration/` | End-to-end API workflows |
| UI Smoke | Playwright | `tests/ui/specs/smoke/` | Quick UI verification |
| UI Regression | Playwright | `apps/*/e2e/` | Full UI coverage |
| Accessibility | Playwright + Axe | `tests/ui/specs/accessibility/` | WCAG compliance |
| Performance | k6 | `tests/perf/k6/` | Load and stress testing |
| Security | Vitest | `services/api/tests/security/` | Security vulnerability tests |

### Test Run Cadence

| Trigger | Tests Run | Target Duration |
|---------|-----------|-----------------|
| PR Check | Lint + Unit + API Smoke + UI Smoke | < 15 minutes |
| Main Merge | PR Check + Extended Smoke | < 20 minutes |
| Nightly | Full Regression + Perf + All Browsers | < 90 minutes |
| Weekly | Security Scan + Accessibility Audit | < 2 hours |

---

## Running Tests Locally

### Environment Setup

```bash
# 1. Start local services (database, redis)
docker compose up -d postgres redis

# 2. Run database migrations
pnpm db:migrate

# 3. Seed test data
pnpm test:seed

# 4. Start API server (in separate terminal)
pnpm --filter @unified-health/api dev

# 5. Start web app (in separate terminal)
pnpm --filter @unified-health/web dev
```

### Environment Variables

Create `.env.test` or use environment variables:

```bash
# API Configuration
TEST_API_URL=http://localhost:3001/api/v1
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/unified_health_test

# UI Configuration
TEST_BASE_URL=http://localhost:3000
WEB_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
PROVIDER_URL=http://localhost:3002
KIOSK_URL=http://localhost:3003

# Test Credentials
TEST_PATIENT_EMAIL=patient@test.unified.health
TEST_PATIENT_PASSWORD=TestPassword123!
TEST_PROVIDER_EMAIL=provider@test.unified.health
TEST_PROVIDER_PASSWORD=TestPassword123!
TEST_ADMIN_EMAIL=admin@test.unified.health
TEST_ADMIN_PASSWORD=TestPassword123!
```

### Running Specific Tests

```bash
# API Tests
cd tests/api
pnpm vitest run contracts/auth.contract.test.ts     # Single file
pnpm vitest run contracts/                          # All contracts
pnpm vitest run --watch                             # Watch mode

# UI Tests
cd tests/ui
pnpm exec playwright test --project=web-chromium    # Web app in Chrome
pnpm exec playwright test --project=admin-chromium  # Admin app
pnpm exec playwright test specs/smoke/              # Smoke tests only
pnpm exec playwright test --debug                   # Debug mode
pnpm exec playwright test --ui                      # Interactive UI mode

# Performance Tests
cd tests/perf/k6
k6 run smoke.js                                     # Smoke performance
k6 run load.js                                      # Load test
```

### Running with Specific Browsers

```bash
# Run in specific browser
pnpm exec playwright test --project=web-firefox
pnpm exec playwright test --project=web-webkit
pnpm exec playwright test --project=mobile-chrome

# Run in all browsers
pnpm exec playwright test
```

---

## CI/CD Pipeline

### PR Checks (`.github/workflows/qa-checks.yml`)

Triggered on every pull request:

1. **Lint & Type Check** - Code quality validation
2. **Unit Tests** - Fast isolated tests
3. **API Smoke Tests** - Core API verification
4. **UI Smoke Tests** - Critical path verification
5. **Security Scan** - Dependency audit + secret scan

All gates must pass for PR to be mergeable.

### Nightly Regression (`.github/workflows/qa-nightly.yml`)

Runs daily at 2 AM UTC:

1. **Full API Regression** - All API tests
2. **Full UI Regression** - All browsers and apps
3. **Performance Tests** - k6 load testing
4. **Report Generation** - Allure report publishing

### Viewing CI Results

1. Go to GitHub Actions tab
2. Select workflow run
3. Download artifacts for detailed reports
4. View Allure report (published to GitHub Pages)

---

## Test Reports

### Allure Reports

Allure provides rich test reports with history and trends.

**Viewing Locally:**
```bash
# Generate report after running tests
pnpm exec allure generate reports/allure-results -o reports/allure-report --clean

# Open report in browser
pnpm exec allure open reports/allure-report
```

**CI Reports:**
- Published to GitHub Pages after nightly runs
- URL: `https://<org>.github.io/<repo>/qa-reports/<timestamp>`

### Playwright Reports

```bash
# Open HTML report after test run
pnpm exec playwright show-report tests/ui/playwright-report
```

### JUnit Reports

JUnit XML reports are generated for CI integration:
- `reports/api/junit.xml`
- `reports/ui/junit.xml`

---

## Debugging Failures

### API Test Failures

1. **Check logs:**
   ```bash
   # View API server logs
   docker logs unified-health-api
   ```

2. **Run single test with verbose:**
   ```bash
   cd tests/api
   pnpm vitest run auth.contract.test.ts --reporter=verbose
   ```

3. **Check database state:**
   ```bash
   # Connect to test database
   psql postgresql://test:test@localhost:5432/unified_health_test
   ```

### UI Test Failures

1. **View trace:**
   ```bash
   # Traces are saved on failure
   pnpm exec playwright show-trace tests/ui/test-results/<test>/trace.zip
   ```

2. **Run in debug mode:**
   ```bash
   pnpm exec playwright test --debug auth.smoke.spec.ts
   ```

3. **Run headed (visible browser):**
   ```bash
   pnpm exec playwright test --headed auth.smoke.spec.ts
   ```

4. **Check screenshots:**
   - Screenshots on failure are in `tests/ui/test-results/`

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Token expired/invalid | Re-run auth setup, check JWT secrets |
| Element not found | Selector changed | Update selector in page object |
| Timeout | Slow response/network | Increase timeout or check server health |
| Flaky test | Race condition | Add proper waits, use stable selectors |
| 500 errors | Server exception | Check API logs, database connectivity |

---

## Writing New Tests

### API Test Structure

```typescript
// tests/api/contracts/example.contract.test.ts
import { describe, it, expect } from 'vitest';
import { api, authApi } from '../helpers/api-client';
import { validateSchema, schemas } from '../helpers/schema-validator';

describe('Example API Contract Tests', () => {
  it('should return valid response schema', async () => {
    const response = await authApi.asPatient.get('/endpoint');

    expect(response.ok).toBe(true);
    expectValidSchema(response.data, schemas.example);
  });

  it('should return 401 without auth', async () => {
    const response = await api.get('/protected-endpoint');
    expect(response.status).toBe(401);
  });
});
```

### UI Test Structure

```typescript
// tests/ui/specs/example/example.spec.ts
import { test, expect } from '@playwright/test';
import { ExamplePage } from '../../pages/example.page';

test.describe('Example Feature', () => {
  test.beforeEach(async ({ page }) => {
    const examplePage = new ExamplePage(page);
    await examplePage.navigate();
  });

  test('should display correctly', async ({ page }) => {
    const examplePage = new ExamplePage(page);
    await examplePage.expectElementVisible();
  });
});
```

### Page Object Model

```typescript
// tests/ui/pages/example.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ExamplePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get exampleElement(): Locator {
    return this.page.locator('[data-testid="example"]');
  }

  async navigate(): Promise<void> {
    await this.goto('/example');
  }

  async expectElementVisible(): Promise<void> {
    await expect(this.exampleElement).toBeVisible();
  }
}
```

### Best Practices

1. **Use data-testid selectors** - Most stable
2. **No arbitrary sleeps** - Use waitFor instead
3. **Isolate tests** - Each test should be independent
4. **Use fixtures** - Centralize test data
5. **Follow AAA pattern** - Arrange, Act, Assert

---

## Test Data Management

### Seeding Test Data

```bash
# Seed all test data
pnpm test:seed

# Or run the script directly
pnpm ts-node tests/scripts/seed-test-data.ts
```

### Test Users

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@test.unified.health | TestPassword123! |
| Patient 2 | patient2@test.unified.health | TestPassword123! |
| Provider | provider@test.unified.health | TestPassword123! |
| Admin | admin@test.unified.health | TestPassword123! |

### Resetting Test Data

```bash
# Reset database to clean state
pnpm db:reset

# Re-seed test data
pnpm test:seed
```

### Data Isolation

- Each test tenant is isolated: `org-test-001`
- Tests use deterministic IDs for reproducibility
- No cross-tenant data access

---

## Troubleshooting

### "Cannot find module" errors

```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Database connection issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart services
docker compose restart postgres

# Verify connection
psql postgresql://test:test@localhost:5432/unified_health_test
```

### Playwright browser issues

```bash
# Reinstall browsers
pnpm exec playwright install --force

# Clear browser cache
rm -rf ~/.cache/ms-playwright
pnpm exec playwright install
```

### Tests passing locally but failing in CI

1. Check for environment differences (Node version, OS)
2. Look for race conditions (add proper waits)
3. Check for timezone-dependent tests
4. Verify test isolation (no shared state)

### Slow tests

1. Use smoke tests for PR checks
2. Run full regression nightly
3. Parallelize where possible
4. Optimize setup/teardown

---

## Contact & Support

- **QA Lead:** qa@unified.health
- **Slack Channel:** #qa-automation
- **Issue Tracker:** GitHub Issues with label `qa`

---

*Document maintained by QA Architect Agent*
*Last updated: 2026-01-19*
