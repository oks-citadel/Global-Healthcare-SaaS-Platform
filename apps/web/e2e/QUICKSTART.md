# Quick Start Guide - E2E Testing

## Prerequisites

1. **Node.js** >= 20.0.0
2. **pnpm** >= 8.0.0
3. **Application running** on `http://localhost:3000`

## Installation

### 1. Install dependencies

From the project root:

```bash
pnpm install
```

### 2. Install Playwright browsers

```bash
cd apps/web
npx playwright install --with-deps
```

This will download the necessary browser binaries (Chromium, Firefox, WebKit).

## Running Tests

### Start the application

In one terminal:

```bash
# From project root
pnpm dev
```

Wait for the application to start on `http://localhost:3000`.

### Run tests

In another terminal:

```bash
# From project root - Run all E2E tests
pnpm test:e2e

# Or from apps/web directory
cd apps/web
pnpm test:e2e
```

### Interactive Mode (Recommended for Development)

```bash
pnpm test:e2e:ui
```

This opens Playwright's UI mode where you can:
- See all tests
- Run tests individually
- Watch mode
- Time travel debugging
- View traces

### See the browser (Headed Mode)

```bash
pnpm test:e2e:headed
```

### Debug a test

```bash
pnpm test:e2e:debug
```

Or for a specific test:

```bash
pnpm test:e2e:debug auth.spec.ts
```

## Test Structure

```
e2e/
├── fixtures/          # Test data
├── pages/            # Page Object Models
├── tests/            # Test files
├── utils/            # Helper functions
└── playwright.config.ts
```

## Writing Your First Test

1. Create a new test file in `tests/`:

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('my first test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/UnifiedHealth/);
});
```

2. Run it:

```bash
pnpm test:e2e example.spec.ts
```

## Common Commands

```bash
# Run all tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e auth.spec.ts

# Run tests in specific browser
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit

# Run tests matching pattern
pnpm test:e2e --grep "login"

# Run in headed mode (see browser)
pnpm test:e2e:headed

# Run in UI mode (interactive)
pnpm test:e2e:ui

# Run in debug mode
pnpm test:e2e:debug

# Generate HTML report
pnpm test:e2e:report
```

## Test Reports

After running tests, view the HTML report:

```bash
pnpm test:e2e:report
```

This opens a browser with:
- Test results
- Screenshots of failures
- Videos of failures
- Traces for debugging

## Debugging Failed Tests

### 1. Check the HTML Report

```bash
pnpm test:e2e:report
```

### 2. View screenshots

Screenshots are saved in `test-results/` for failed tests.

### 3. View trace

Click on a failed test in the HTML report to see the trace:
- Step-by-step execution
- Network requests
- Console logs
- Screenshots at each step

### 4. Run in debug mode

```bash
pnpm test:e2e:debug auth.spec.ts
```

## Tips

### Use Page Objects

Instead of:

```typescript
test('login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@test.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
});
```

Use Page Objects:

```typescript
import { LoginPage } from '../pages/login.page';

test('login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test@test.com', 'password');
});
```

### Use Test Data

```typescript
import { testUsers } from '../fixtures/test-data';

test('login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
});
```

### Explicit Waits

Always wait for elements to be ready:

```typescript
// Wait for element to be visible
await page.locator('.dashboard').waitFor();

// Wait for network to be idle
await page.waitForLoadState('networkidle');

// Wait for URL
await page.waitForURL('/dashboard');
```

## Troubleshooting

### "Browser is not installed"

```bash
npx playwright install --with-deps
```

### "Connection refused"

Make sure the app is running:

```bash
pnpm dev
```

### "Element not found"

Use Playwright Inspector to find the correct selector:

```bash
PWDEBUG=1 pnpm test:e2e
```

### Tests are slow

- Run on single browser: `pnpm test:e2e --project=chromium`
- Increase workers in `playwright.config.ts`
- Use `page.waitForLoadState('domcontentloaded')` instead of `'networkidle'`

### Tests fail on CI but pass locally

- Check browser versions match
- Add explicit waits
- Increase timeouts
- Check for timing issues

## Next Steps

1. Read the full [README.md](./README.md)
2. Explore existing tests in `tests/`
3. Check out [Playwright Documentation](https://playwright.dev)
4. Learn about [Page Object Model](https://playwright.dev/docs/pom)

## Getting Help

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Playwright Discord](https://discord.com/invite/playwright-807756831384403968)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)
