# Visual Regression Testing

This directory contains visual regression tests for the Global Healthcare SaaS Platform. Visual regression testing ensures that UI changes don't unintentionally break the visual appearance of the application.

## Overview

Visual regression testing compares screenshots of the application against baseline images to detect visual changes. This helps catch:

- Unintended CSS changes
- Layout regressions
- Font rendering issues
- Color and styling changes
- Component visual bugs

## Setup

### Prerequisites

- Node.js 18.x or higher
- pnpm 8.x
- Playwright installed

### Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
npx playwright install
```

### Configuration

Visual testing is configured in `playwright.visual.config.ts` at the project root. Key settings include:

- **Screenshot comparison thresholds**
- **Viewport configurations**
- **Browser/device definitions**
- **Output directories**

## Running Tests

### Run All Visual Tests

```bash
# Run visual tests with all viewports
pnpm test:visual

# Or using Playwright directly
npx playwright test --config=playwright.visual.config.ts
```

### Run Specific Projects (Viewports)

```bash
# Desktop Chrome only
npx playwright test --config=playwright.visual.config.ts --project=desktop-chrome

# Mobile devices only
npx playwright test --config=playwright.visual.config.ts --project=mobile-iphone-14-pro-max

# Tablet viewports
npx playwright test --config=playwright.visual.config.ts --project=tablet-ipad-pro
```

### Update Baseline Screenshots

When intentional visual changes are made, update the baseline snapshots:

```bash
# Update all snapshots
npx playwright test --config=playwright.visual.config.ts --update-snapshots

# Update specific project snapshots
npx playwright test --config=playwright.visual.config.ts --project=desktop-chrome --update-snapshots
```

### Run in UI Mode

```bash
npx playwright test --config=playwright.visual.config.ts --ui
```

## Directory Structure

```
tests/visual/
├── README.md                    # This documentation
├── snapshots/                   # Baseline screenshots (committed to git)
│   ├── desktop-chrome/
│   ├── mobile-iphone-14-pro-max/
│   └── ...
├── example.spec.ts              # Example visual test
├── pages/                       # Page-specific visual tests
│   ├── dashboard.visual.spec.ts
│   ├── login.visual.spec.ts
│   └── ...
├── components/                  # Component-specific visual tests
│   ├── button.visual.spec.ts
│   ├── modal.visual.spec.ts
│   └── ...
└── helpers/                     # Test utilities
    ├── screenshot.helpers.ts
    └── mask.helpers.ts
```

## Writing Visual Tests

### Basic Screenshot Test

```typescript
import { test, expect } from '@playwright/test';

test('homepage visual test', async ({ page }) => {
  await page.goto('/');

  // Wait for content to load
  await page.waitForLoadState('networkidle');

  // Take full page screenshot
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
  });
});
```

### Component Screenshot Test

```typescript
test('button component visual test', async ({ page }) => {
  await page.goto('/components/button');

  const button = page.locator('[data-testid="primary-button"]');

  // Screenshot specific element
  await expect(button).toHaveScreenshot('primary-button.png');
});
```

### Masking Dynamic Content

```typescript
test('dashboard with masked dynamic content', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.locator('[data-testid="timestamp"]'),
      page.locator('[data-testid="user-avatar"]'),
      page.locator('.notification-badge'),
    ],
  });
});
```

### Testing Different States

```typescript
test.describe('button states', () => {
  test('default state', async ({ page }) => {
    await page.goto('/components/button');
    const button = page.locator('[data-testid="button"]');
    await expect(button).toHaveScreenshot('button-default.png');
  });

  test('hover state', async ({ page }) => {
    await page.goto('/components/button');
    const button = page.locator('[data-testid="button"]');
    await button.hover();
    await expect(button).toHaveScreenshot('button-hover.png');
  });

  test('focus state', async ({ page }) => {
    await page.goto('/components/button');
    const button = page.locator('[data-testid="button"]');
    await button.focus();
    await expect(button).toHaveScreenshot('button-focus.png');
  });

  test('disabled state', async ({ page }) => {
    await page.goto('/components/button?disabled=true');
    const button = page.locator('[data-testid="button"]');
    await expect(button).toHaveScreenshot('button-disabled.png');
  });
});
```

### Testing Responsive Layouts

```typescript
import { customViewports } from '../../playwright.visual.config';

test('responsive layout test', async ({ page }) => {
  // Test at different viewport sizes within the same test
  for (const [name, viewport] of Object.entries(customViewports)) {
    await page.setViewportSize(viewport);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`dashboard-${name}.png`);
  }
});
```

## Threshold Configuration

### Default Thresholds

The default configuration allows:
- **1% pixel difference ratio** (`maxDiffPixelRatio: 0.01`)
- **100 different pixels** (`maxDiffPixels: 100`)
- **0.2 threshold per pixel** (`threshold: 0.2`)

### Custom Thresholds Per Test

```typescript
import { screenshotThresholds } from '../../playwright.visual.config';

test('strict comparison for static content', async ({ page }) => {
  await page.goto('/static-page');

  await expect(page).toHaveScreenshot('static-page.png', {
    ...screenshotThresholds.strict,
  });
});

test('lenient comparison for dynamic content', async ({ page }) => {
  await page.goto('/dynamic-page');

  await expect(page).toHaveScreenshot('dynamic-page.png', {
    ...screenshotThresholds.lenient,
  });
});
```

## Best Practices

### 1. Stabilize Before Screenshot

```typescript
// Wait for network requests to complete
await page.waitForLoadState('networkidle');

// Wait for animations to complete
await page.waitForTimeout(500); // Use sparingly

// Wait for specific element
await page.waitForSelector('[data-testid="content-loaded"]');
```

### 2. Disable Animations

```typescript
// Add to test setup
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `,
});
```

### 3. Use Data Attributes

```html
<!-- In your components -->
<div data-testid="dashboard-widget" data-visual-test="widget">
  Content here
</div>
```

### 4. Handle Fonts

Ensure fonts are loaded before taking screenshots:

```typescript
await page.evaluate(() => document.fonts.ready);
```

### 5. Consistent Test Data

Use seeded/mocked data for consistent screenshots:

```typescript
test.beforeEach(async ({ page }) => {
  // Mock API responses with consistent data
  await page.route('**/api/**', (route) => {
    route.fulfill({
      body: JSON.stringify({ /* consistent mock data */ }),
    });
  });
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Visual Tests
  run: npx playwright test --config=playwright.visual.config.ts

- name: Upload Visual Test Results
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: visual-test-results
    path: test-results/visual/
```

### Handling Snapshot Updates in CI

1. Visual tests fail in CI when there are differences
2. Review the diff images in the test report
3. If changes are intentional, update snapshots locally
4. Commit the updated snapshots

## Troubleshooting

### Screenshots Don't Match Locally vs CI

- Ensure same browser versions
- Check font rendering differences
- Verify viewport sizes
- Consider OS-specific rendering differences

### Flaky Tests

- Add proper wait conditions
- Mask dynamic content (timestamps, avatars)
- Disable animations
- Use consistent test data

### Large Diff Files

- Review threshold settings
- Consider component-level tests vs full-page
- Optimize image compression in config

## Viewing Test Results

After running tests, view the HTML report:

```bash
npx playwright show-report test-results/visual/html-report
```

The report includes:
- Pass/fail status for each test
- Side-by-side comparison of expected vs actual screenshots
- Diff images highlighting changes
- Test execution details

## Resources

- [Playwright Visual Comparisons Documentation](https://playwright.dev/docs/test-snapshots)
- [Playwright Configuration Reference](https://playwright.dev/docs/test-configuration)
- [Visual Testing Best Practices](https://playwright.dev/docs/best-practices)
