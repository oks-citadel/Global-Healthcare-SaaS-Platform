# E2E Tests - Unified Healthcare Platform

This directory contains end-to-end (E2E) tests for the web application using Playwright.

## Project Structure

```
e2e/
├── fixtures/           # Test data and fixtures
│   └── test-data.ts   # Centralized test data (users, patients, appointments)
├── pages/             # Page Object Models (POM)
│   ├── login.page.ts
│   └── dashboard.page.ts
├── tests/             # Test specifications
│   ├── auth.spec.ts
│   ├── appointments.spec.ts
│   └── patient-profile.spec.ts
├── playwright.config.ts
└── README.md
```

## Running Tests

### Run all tests
```bash
pnpm test:e2e
```

### Run tests in UI mode (interactive)
```bash
pnpm test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
pnpm test:e2e:headed
```

### Run specific test file
```bash
pnpm test:e2e auth.spec.ts
```

### Run tests in debug mode
```bash
pnpm test:e2e:debug
```

### Run tests on specific browser
```bash
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit
```

### View test report
```bash
pnpm test:e2e:report
```

## Test Categories

### Authentication Tests (`auth.spec.ts`)
- User registration flow
- Login with valid/invalid credentials
- Logout functionality
- Password visibility toggle
- Token refresh
- Protected routes
- Session management

### Appointments Tests (`appointments.spec.ts`)
- Create new appointment
- View appointments list
- View appointment details
- Update/reschedule appointment
- Cancel appointment
- Filter and sort appointments
- Appointment notifications

### Patient Profile Tests (`patient-profile.spec.ts`)
- View profile information
- Update personal information
- Update address
- Update emergency contact
- Upload documents
- Download documents
- Delete documents
- Document filtering
- Profile privacy

## Configuration

The Playwright configuration is in `playwright.config.ts`. Key settings:

- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_BASE_URL`)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Timeout**: 30s per test
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure
- **Video**: On failure
- **Trace**: On first retry

## Environment Variables

You can customize the test environment with these variables:

```bash
# Base URL for the application
PLAYWRIGHT_BASE_URL=http://localhost:3000

# Storage state for authenticated tests
STORAGE_STATE=.auth/user.json

# CI mode
CI=true
```

## Page Object Model (POM)

Tests use the Page Object Model pattern to encapsulate page-specific logic:

```typescript
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login('user@test.com', 'password');
  await dashboardPage.assertDashboardDisplayed();
});
```

## Test Data

Test data is centralized in `fixtures/test-data.ts`:

```typescript
import { testUsers, testAppointments } from '../fixtures/test-data';

// Use predefined test users
await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);

// Use test appointment data
const appointment = testAppointments.appointment1;
```

## Best Practices

1. **Use Page Objects**: Encapsulate page interactions in Page Object classes
2. **Use Test Data**: Leverage centralized test data from fixtures
3. **Assertions**: Use Playwright's built-in assertions (`expect`)
4. **Waits**: Use explicit waits for dynamic content
5. **Cleanup**: Clean up test data after tests (if needed)
6. **Isolation**: Each test should be independent
7. **Naming**: Use descriptive test names that explain what is being tested

## Debugging

### Debug a specific test
```bash
pnpm test:e2e:debug auth.spec.ts
```

### Use Playwright Inspector
```bash
PWDEBUG=1 pnpm test:e2e
```

### View trace
After a test failure, traces are automatically saved. View them with:
```bash
npx playwright show-trace test-results/trace.zip
```

## CI/CD Integration

Tests are configured to run in CI with:
- 2 retries on failure
- Single worker (no parallelization)
- HTML, JSON, and JUnit reporters
- Screenshots and videos on failure

Example GitHub Actions workflow:

```yaml
- name: Install dependencies
  run: pnpm install

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: pnpm test:e2e

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: apps/web/test-results/
```

## Adding New Tests

1. Create a new test file in `tests/` directory:
   ```typescript
   import { test, expect } from '@playwright/test';
   import { LoginPage } from '../pages/login.page';

   test.describe('Feature Name', () => {
     test('should do something', async ({ page }) => {
       // Test implementation
     });
   });
   ```

2. Add necessary page objects in `pages/` directory

3. Add test data in `fixtures/test-data.ts` if needed

4. Run the tests to verify they pass

## Troubleshooting

### Tests fail with timeout
- Increase timeout in `playwright.config.ts`
- Check if the application is running on the correct port
- Use `page.waitForLoadState('networkidle')` for dynamic content

### Cannot find elements
- Use Playwright Inspector to debug selectors
- Check if elements are in shadow DOM
- Verify elements are visible and not covered

### Tests pass locally but fail in CI
- Check browser versions match
- Verify environment variables are set correctly
- Check for timing issues (add explicit waits)

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
