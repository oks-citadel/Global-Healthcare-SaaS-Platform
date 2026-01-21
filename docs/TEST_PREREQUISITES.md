# Test Execution Prerequisites

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Set up test environment
cp tests/.env.example tests/.env
# Edit tests/.env with your local configuration

# 3. Start services (Docker)
docker compose up -d

# 4. Seed test data
pnpm test:seed

# 5. Run tests
pnpm test:smoke  # Quick smoke tests
pnpm qa:full     # Full test suite
```

## Environment Requirements

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | ≥22.0.0 | Runtime |
| pnpm | ≥8.0.0 | Package manager |
| Docker | Latest | Services (DB, Redis) |
| Playwright | Installed via pnpm | UI testing |

### Optional Software

| Software | Version | Purpose |
|----------|---------|---------|
| k6 | Latest | Performance testing |
| Maestro | Latest | Mobile E2E testing |
| Allure CLI | Latest | Test reporting |

## Database Setup

### Option 1: Docker (Recommended)

```bash
# Start PostgreSQL and Redis
docker compose up -d postgres redis

# Verify services
docker compose ps
```

### Option 2: Local Installation

1. Install PostgreSQL 15+
2. Create database: `createdb unifiedhealth_test`
3. Install Redis 7+
4. Update `tests/.env` with connection strings

## Test Data Seeding

```bash
# Seed test users and data
pnpm test:seed

# Or manually run
pnpm ts-node tests/scripts/seed-test-data.ts
```

### Seeded Test Users

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@test.unified.health | TestPassword123! |
| Provider | provider@test.unified.health | TestPassword123! |
| Admin | admin@test.unified.health | TestPassword123! |
| Super Admin | superadmin@test.unified.health | TestPassword123! |

## Running Tests

### API Tests (Vitest)

```bash
# All API tests
pnpm test:api

# Smoke tests only
pnpm test:api:smoke

# Contract tests
pnpm test:api:contracts

# Integration tests
pnpm test:api:integration

# Regression tests
pnpm test:api:regression

# Watch mode (development)
pnpm test:api:watch
```

### UI Tests (Playwright)

```bash
# All UI tests
pnpm test:ui

# Smoke tests
pnpm test:ui:smoke

# Specific app
pnpm test:ui:web
pnpm test:ui:admin
pnpm test:ui:provider

# Accessibility tests
pnpm test:ui:a11y

# Visual regression
pnpm test:ui:visual

# Interactive mode
pnpm test:ui:headed
pnpm test:ui:debug
```

### Performance Tests (k6)

```bash
# Install k6 first: https://k6.io/docs/getting-started/installation/

# Smoke test (quick)
pnpm test:perf

# Load test
pnpm test:perf:load
```

### Mobile Tests (Maestro/Detox)

```bash
# Install Maestro: https://maestro.mobile.dev/
# Start your app first

# Run Maestro flows
cd tests/mobile
maestro test maestro/auth-flow.yaml
maestro test maestro/  # All flows
```

## CI/CD Integration

### GitHub Actions

The following workflows are configured:

1. **qa-checks.yml** - Runs on every PR
   - Lint, typecheck
   - Unit tests
   - Smoke tests (API + UI)
   - Security scan

2. **qa-nightly.yml** - Runs nightly at 2 AM UTC
   - Full regression suite
   - Multi-browser testing
   - Performance tests
   - Allure report generation

### Required Secrets

Set these in GitHub repository settings:

```
TEST_PATIENT_EMAIL
TEST_PATIENT_PASSWORD
TEST_PROVIDER_EMAIL
TEST_PROVIDER_PASSWORD
TEST_ADMIN_EMAIL
TEST_ADMIN_PASSWORD
```

## Test Reports

### Allure Reports

```bash
# Generate and open report
pnpm test:report

# Or manually
pnpm exec allure generate reports/allure-results -o reports/allure-report --clean
pnpm exec allure open reports/allure-report
```

### Playwright Reports

```bash
# Show last test report
pnpm test:report:ui

# Or
cd tests/ui && npx playwright show-report
```

## Troubleshooting

### Common Issues

**Tests fail to connect to API**
- Ensure API server is running: `pnpm --filter @unified-health/api dev`
- Check `TEST_API_URL` in `.env`

**Database connection errors**
- Verify Docker is running: `docker compose ps`
- Check `DATABASE_URL` in `.env`

**Playwright browser install**
```bash
cd tests/ui && npx playwright install
```

**Test data not found**
```bash
pnpm test:seed
```

**Flaky UI tests**
- Increase timeouts in `playwright.config.ts`
- Add explicit waits with `waitForLoadingToComplete()`

### Debug Mode

```bash
# API tests with verbose logging
DEBUG=* pnpm test:api

# UI tests with headed browser
pnpm test:ui:headed

# UI tests with debugger
pnpm test:ui:debug
```

## Test Coverage

### Viewing Coverage

```bash
# API coverage
pnpm test:api -- --coverage

# Open coverage report
open reports/coverage/api/index.html
```

### Coverage Targets

| Type | Target |
|------|--------|
| Unit | ≥80% |
| Integration | ≥70% |
| E2E | Critical paths |

## Adding New Tests

### API Test Template

```typescript
// tests/api/integration/feature.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api, login, clearTokenCache } from '../helpers/api-client';
import { testUsers } from '../data/test-fixtures';

describe('Feature Name', () => {
  let token: string;

  beforeAll(async () => {
    clearTokenCache();
    token = await login(testUsers.patient.email, testUsers.patient.password);
  });

  afterAll(() => {
    clearTokenCache();
  });

  it('should do something', async () => {
    const response = await api.get('/endpoint', { token });
    expect(response.ok).toBe(true);
  });
});
```

### UI Test Template

```typescript
// tests/ui/specs/feature/feature.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage } from '../../pages';
import { testUsers } from '../../fixtures/test-data';

test.describe('Feature Name', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login(testUsers.patient.email, testUsers.patient.password);
  });

  test('should do something', async () => {
    await dashboardPage.navigate();
    await dashboardPage.expectDashboardLoaded();
  });
});
```

## Contact

For test infrastructure issues, contact the QA team or open an issue in the repository.
