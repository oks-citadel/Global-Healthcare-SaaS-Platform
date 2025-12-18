# Testing Guide - Unified Healthcare Platform

Comprehensive guide for E2E, accessibility, performance, and visual regression testing.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Suite Overview](#test-suite-overview)
- [Running Tests](#running-tests)
- [Test Categories](#test-categories)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Quick Start

### Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm playwright install
```

### Running Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test suite
pnpm test:e2e:auth
pnpm test:e2e:appointments
pnpm test:e2e:accessibility

# Run with UI mode (recommended for development)
pnpm test:e2e:ui

# Run in headed mode (see browser)
pnpm test:e2e:headed

# Debug tests
pnpm test:e2e:debug
```

## Test Suite Overview

### Test Coverage

| Test Category | File | Critical Flows | Test Count |
|--------------|------|----------------|------------|
| **Authentication** | `auth.spec.ts` | Login, Registration, Logout, Session Management | 25+ |
| **Appointments** | `appointments.spec.ts` | Booking, Viewing, Rescheduling, Cancellation | 20+ |
| **Prescriptions** | `prescriptions.spec.ts` | Viewing, Refills, Pharmacy Management | 18+ |
| **Medical Records** | `medical-records.spec.ts` | Viewing, Uploading, Filtering, Downloading | 22+ |
| **Settings** | `settings.spec.ts` | Account, Privacy, Notifications, Security | 24+ |
| **Accessibility** | `accessibility.spec.ts` | Keyboard Nav, ARIA, Screen Readers | 30+ |
| **Performance** | `performance.spec.ts` | Core Web Vitals, Resource Loading | 15+ |
| **Visual Regression** | `visual-regression.spec.ts` | Screenshots, Component Snapshots | 25+ |
| **Patient Profile** | `patient-profile.spec.ts` | Profile Management, Documents | 15+ |

### Quality Gates

All tests must pass these thresholds:

- **E2E Pass Rate:** 100%
- **Accessibility Score:** >90
- **Performance Score:** >80
- **Visual Regression:** <100 pixel difference
- **Test Coverage:** >80%

## Running Tests

### All Tests

```bash
# Run complete test suite
pnpm test:all

# Run E2E tests only
pnpm test:e2e

# Run unit tests only
pnpm test
```

### Specific Browsers

```bash
# Run on Chrome/Chromium
pnpm test:e2e:chromium

# Run on Firefox
pnpm test:e2e:firefox

# Run on Safari/WebKit
pnpm test:e2e:webkit

# Run on mobile browsers
pnpm test:e2e:mobile
```

### Specific Test Suites

```bash
# Authentication tests
pnpm test:e2e:auth

# Appointment tests
pnpm test:e2e:appointments

# Prescription tests
pnpm test:e2e:prescriptions

# Medical records tests
pnpm test:e2e:medical-records

# Settings tests
pnpm test:e2e:settings

# Accessibility tests
pnpm test:e2e:accessibility

# Performance tests
pnpm test:e2e:performance

# Visual regression tests
pnpm test:e2e:visual
```

### Test Reports

```bash
# View HTML report
pnpm test:e2e:report

# Generate and view after test run
pnpm test:e2e && pnpm test:e2e:report
```

## Test Categories

### 1. End-to-End (E2E) Tests

Tests complete user workflows across the application.

**Critical Flows:**
- Patient registration and login
- Appointment booking and management
- Prescription viewing and refill requests
- Medical records access and document upload
- Profile and settings updates

**Example:**
```typescript
test('should book new appointment', async ({ page }) => {
  await dashboardPage.goto();
  await dashboardPage.clickBookAppointment();

  // Fill appointment form
  await page.selectOption('select[name="doctorId"]', 'doctor1');
  await page.fill('input[name="date"]', futureDate);
  await page.fill('input[name="time"]', '10:00');

  await page.click('button[type="submit"]');

  // Verify success
  await page.waitForSelector('.success-message');
});
```

### 2. Accessibility Tests

Tests WCAG 2.1 AA compliance.

**Coverage:**
- Keyboard navigation
- Screen reader compatibility
- ARIA attributes and landmarks
- Color contrast
- Focus management
- Form accessibility

**Example:**
```typescript
test('should navigate with keyboard only', async ({ page }) => {
  await page.goto('/login');

  // Tab through elements
  await page.keyboard.press('Tab');
  let focused = await page.evaluate(() =>
    document.activeElement?.getAttribute('name')
  );

  expect(['email', 'username']).toContain(focused);
});
```

### 3. Performance Tests

Tests Core Web Vitals and performance metrics.

**Metrics:**
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3.8s
- Total Blocking Time (TBT) < 300ms

**Example:**
```typescript
test('should load within performance thresholds', async ({ page }) => {
  await page.goto('/dashboard');

  const lcp = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    });
  });

  expect(lcp).toBeLessThan(2500);
});
```

### 4. Visual Regression Tests

Tests visual consistency across releases.

**Coverage:**
- Full page screenshots
- Component snapshots
- Responsive layouts
- Theme variations
- Interaction states

**Example:**
```typescript
test('should match dashboard screenshot', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('dashboard.png', {
    fullPage: true,
    animations: 'disabled',
    maxDiffPixels: 100,
  });
});
```

**Updating Snapshots:**
```bash
# Update all snapshots
pnpm test:e2e:update-snapshots

# Update specific test snapshots
pnpm test:e2e:visual --update-snapshots
```

## Lighthouse CI Performance Testing

### Running Lighthouse

```bash
# Run complete Lighthouse CI suite
pnpm test:lighthouse

# Collect metrics only
pnpm test:lighthouse:collect

# Upload results
pnpm test:lighthouse:upload
```

### Performance Thresholds

Configured in `lighthouserc.json`:

- **Performance:** ≥80
- **Accessibility:** ≥90
- **Best Practices:** ≥85
- **SEO:** ≥85
- **First Contentful Paint:** <2000ms
- **Largest Contentful Paint:** <3000ms
- **Cumulative Layout Shift:** <0.1
- **Total Blocking Time:** <300ms

## Writing Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Feature Name', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    // Setup code
  });

  test('should do something specific', async ({ page }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login(email, password);

    // Assert
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

### Page Object Model

Organize tests using the Page Object pattern:

```typescript
// pages/dashboard.page.ts
export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/dashboard');
  }

  async clickBookAppointment() {
    await this.page.click('button:has-text("Book Appointment")');
  }
}
```

### Best Practices

1. **Use Data Attributes for Selectors**
```typescript
// Good
await page.click('[data-testid="submit-button"]');

// Avoid
await page.click('.btn.btn-primary.submit-btn');
```

2. **Wait for Network Idle**
```typescript
await page.goto('/dashboard');
await page.waitForLoadState('networkidle');
```

3. **Handle Dynamic Content**
```typescript
// Wait for specific content
await page.waitForSelector('.appointment-card');

// Or wait for API response
await page.waitForResponse(response =>
  response.url().includes('/api/appointments')
);
```

4. **Use Soft Assertions for Non-Critical Checks**
```typescript
// Continues test even if assertion fails
await expect.soft(page.locator('.optional-element')).toBeVisible();
```

5. **Clean Up Test Data**
```typescript
test.afterEach(async ({ page }) => {
  // Clean up created data
  await deleteTestAppointment(appointmentId);
});
```

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Install dependencies
        run: pnpm install
      - name: Install Playwright browsers
        run: pnpm playwright install --with-deps
      - name: Run E2E tests
        run: pnpm test:ci
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: test-results/
```

### Environment Variables

Set these in your CI environment:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000
CI=true
```

## Troubleshooting

### Common Issues

#### 1. Tests Failing Locally

**Problem:** Tests pass in CI but fail locally.

**Solution:**
```bash
# Ensure browsers are up to date
pnpm playwright install

# Clear test artifacts
rm -rf test-results/

# Run tests with fresh state
pnpm test:e2e
```

#### 2. Flaky Tests

**Problem:** Tests fail intermittently.

**Solution:**
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Increase timeout: `{ timeout: 10000 }`
- Use `waitForSelector` instead of `waitForTimeout`
- Check for race conditions

#### 3. Visual Regression Failures

**Problem:** Screenshots don't match.

**Solution:**
```bash
# Review differences in UI mode
pnpm test:e2e:ui

# Update snapshots if changes are intentional
pnpm test:e2e:update-snapshots

# Run only visual tests
pnpm test:e2e:visual
```

#### 4. Slow Tests

**Problem:** Tests take too long to run.

**Solution:**
- Run tests in parallel (default in Playwright)
- Use `fullyParallel: true` in config
- Reduce `timeout` values where appropriate
- Use `page.route()` to mock slow API calls

### Debug Mode

```bash
# Run in debug mode with inspector
pnpm test:e2e:debug

# Run specific test in debug
pnpm playwright test e2e/tests/auth.spec.ts:10 --debug
```

### Verbose Logging

```typescript
test('test with logging', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => console.log(msg.text()));

  // Enable request logging
  page.on('request', request =>
    console.log('>>', request.method(), request.url())
  );

  page.on('response', response =>
    console.log('<<', response.status(), response.url())
  );
});
```

## Best Practices

### 1. Test Independence

Each test should be independent and not rely on other tests:

```typescript
// Good - test has its own setup
test('should update profile', async ({ page }) => {
  await loginPage.login(testUser.email, testUser.password);
  await profilePage.goto();
  // ... test logic
});

// Bad - relies on previous test state
test('should update profile', async ({ page }) => {
  // Assumes user is already logged in
  await profilePage.goto();
});
```

### 2. Data Management

Use test data factories:

```typescript
// fixtures/test-data.ts
export function generateRandomPatient() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: `test${Date.now()}@test.com`,
  };
}
```

### 3. Selectors Hierarchy

Priority order for selectors:

1. `data-testid` attributes
2. ARIA roles and labels
3. Semantic HTML tags
4. Text content
5. CSS classes (last resort)

### 4. Waiting Strategies

```typescript
// Wait for element
await page.waitForSelector('.appointment-card');

// Wait for navigation
await page.waitForURL('/dashboard');

// Wait for network idle
await page.waitForLoadState('networkidle');

// Wait for function
await page.waitForFunction(() =>
  document.querySelector('.data-loaded')
);
```

### 5. Error Messages

Provide descriptive error messages:

```typescript
// Good
await expect(page.locator('[data-testid="appointment"]'))
  .toBeVisible({ timeout: 5000 })
  .catch(() => {
    throw new Error('Appointment card not visible after booking');
  });

// Basic
await expect(page.locator('.appointment')).toBeVisible();
```

## Test Metrics and Reporting

### Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# View coverage in browser
open coverage/index.html
```

### Test Results

Test results are saved to:
- **HTML Report:** `test-results/html/index.html`
- **JSON Report:** `test-results/results.json`
- **JUnit XML:** `test-results/junit.xml`

### Performance Reports

Lighthouse reports are saved to:
- `.lighthouseci/` directory
- Uploaded to Lighthouse CI server (if configured)

## Resources

### Documentation

- [Playwright Documentation](https://playwright.dev)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)

### Tools

- **Playwright Inspector:** Debug tests step-by-step
- **Playwright UI Mode:** Interactive test runner
- **Trace Viewer:** Analyze test execution
- **Lighthouse CI:** Automated performance testing

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
**Maintained By:** Frontend Quality Engineering Team
