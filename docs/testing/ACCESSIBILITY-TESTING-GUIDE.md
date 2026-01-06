# Accessibility Testing Guide

Comprehensive accessibility testing guide for the Unified Healthcare Platform to ensure WCAG 2.1 AA compliance.

## Table of Contents

1. [Overview of WCAG 2.1 AA Requirements](#1-overview-of-wcag-21-aa-requirements)
2. [Automated Testing Setup](#2-automated-testing-setup)
3. [Manual Testing Checklist](#3-manual-testing-checklist)
4. [Screen Reader Testing Scripts](#4-screen-reader-testing-scripts)
5. [Common Accessibility Patterns in the Codebase](#5-common-accessibility-patterns-in-the-codebase)
6. [Testing Matrix Template](#6-testing-matrix-template)

---

## 1. Overview of WCAG 2.1 AA Requirements

### POUR Principles

WCAG 2.1 is organized around four core principles, known as POUR:

#### 1.1 Perceivable

Information and user interface components must be presentable to users in ways they can perceive.

| Guideline | Success Criterion | Level | Description |
|-----------|------------------|-------|-------------|
| 1.1 Text Alternatives | 1.1.1 Non-text Content | A | All non-text content has text alternatives |
| 1.2 Time-based Media | 1.2.1 - 1.2.5 | A/AA | Captions, audio descriptions for media |
| 1.3 Adaptable | 1.3.1 Info and Relationships | A | Information structure is programmatically determined |
| 1.3 Adaptable | 1.3.2 Meaningful Sequence | A | Reading order is logical |
| 1.3 Adaptable | 1.3.3 Sensory Characteristics | A | Instructions not solely reliant on sensory characteristics |
| 1.3 Adaptable | 1.3.4 Orientation | AA | Content not restricted to single orientation |
| 1.3 Adaptable | 1.3.5 Identify Input Purpose | AA | Input field purpose can be programmatically determined |
| 1.4 Distinguishable | 1.4.1 Use of Color | A | Color not sole means of conveying information |
| 1.4 Distinguishable | 1.4.2 Audio Control | A | Audio can be paused/stopped |
| 1.4 Distinguishable | 1.4.3 Contrast (Minimum) | AA | 4.5:1 for normal text, 3:1 for large text |
| 1.4 Distinguishable | 1.4.4 Resize Text | AA | Text resizable to 200% without loss of function |
| 1.4 Distinguishable | 1.4.5 Images of Text | AA | Text used instead of images of text |
| 1.4 Distinguishable | 1.4.10 Reflow | AA | Content reflows without horizontal scrolling at 320px |
| 1.4 Distinguishable | 1.4.11 Non-text Contrast | AA | 3:1 contrast for UI components |
| 1.4 Distinguishable | 1.4.12 Text Spacing | AA | Content adapts to text spacing changes |
| 1.4 Distinguishable | 1.4.13 Content on Hover/Focus | AA | Additional content dismissable, hoverable, persistent |

#### 1.2 Operable

User interface components and navigation must be operable.

| Guideline | Success Criterion | Level | Description |
|-----------|------------------|-------|-------------|
| 2.1 Keyboard | 2.1.1 Keyboard | A | All functionality via keyboard |
| 2.1 Keyboard | 2.1.2 No Keyboard Trap | A | Focus can be moved away from any component |
| 2.1 Keyboard | 2.1.4 Character Key Shortcuts | A | Single character shortcuts can be turned off |
| 2.2 Enough Time | 2.2.1 Timing Adjustable | A | Time limits can be extended |
| 2.2 Enough Time | 2.2.2 Pause, Stop, Hide | A | Moving content can be controlled |
| 2.3 Seizures | 2.3.1 Three Flashes | A | No content flashes more than 3 times/second |
| 2.4 Navigable | 2.4.1 Bypass Blocks | A | Skip navigation mechanism |
| 2.4 Navigable | 2.4.2 Page Titled | A | Pages have descriptive titles |
| 2.4 Navigable | 2.4.3 Focus Order | A | Focus order preserves meaning |
| 2.4 Navigable | 2.4.4 Link Purpose (In Context) | A | Link purpose clear from text or context |
| 2.4 Navigable | 2.4.5 Multiple Ways | AA | Multiple ways to find pages |
| 2.4 Navigable | 2.4.6 Headings and Labels | AA | Headings and labels describe topic/purpose |
| 2.4 Navigable | 2.4.7 Focus Visible | AA | Keyboard focus indicator is visible |
| 2.5 Input Modalities | 2.5.1 Pointer Gestures | A | Multipoint gestures have alternatives |
| 2.5 Input Modalities | 2.5.2 Pointer Cancellation | A | Pointer input can be cancelled |
| 2.5 Input Modalities | 2.5.3 Label in Name | A | Accessible name contains visible label |
| 2.5 Input Modalities | 2.5.4 Motion Actuation | A | Motion-triggered functions have alternatives |

#### 1.3 Understandable

Information and the operation of user interface must be understandable.

| Guideline | Success Criterion | Level | Description |
|-----------|------------------|-------|-------------|
| 3.1 Readable | 3.1.1 Language of Page | A | Page language is programmatically set |
| 3.1 Readable | 3.1.2 Language of Parts | AA | Language of passages can be identified |
| 3.2 Predictable | 3.2.1 On Focus | A | Focus does not trigger context change |
| 3.2 Predictable | 3.2.2 On Input | A | Input does not trigger unexpected context change |
| 3.2 Predictable | 3.2.3 Consistent Navigation | AA | Navigation is consistent across pages |
| 3.2 Predictable | 3.2.4 Consistent Identification | AA | Same functions have consistent identification |
| 3.3 Input Assistance | 3.3.1 Error Identification | A | Errors are identified and described |
| 3.3 Input Assistance | 3.3.2 Labels or Instructions | A | Form inputs have labels or instructions |
| 3.3 Input Assistance | 3.3.3 Error Suggestion | AA | Error correction suggestions provided |
| 3.3 Input Assistance | 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Submissions can be reviewed/corrected |

#### 1.4 Robust

Content must be robust enough to be interpreted by assistive technologies.

| Guideline | Success Criterion | Level | Description |
|-----------|------------------|-------|-------------|
| 4.1 Compatible | 4.1.1 Parsing | A | HTML is well-formed (deprecated in WCAG 2.2) |
| 4.1 Compatible | 4.1.2 Name, Role, Value | A | UI components have accessible name, role, value |
| 4.1 Compatible | 4.1.3 Status Messages | AA | Status messages announced by screen readers |

### Healthcare-Specific Considerations

For a healthcare platform, additional attention should be paid to:

1. **Medical Form Accessibility**: Ensure complex medical forms are navigable and all fields are properly labeled
2. **Error Prevention**: Critical medical information submissions must have confirmation steps
3. **Emergency Information**: Emergency contacts and critical alerts must be immediately perceivable
4. **Time-Sensitive Actions**: Appointment booking and medication reminders must handle timing appropriately
5. **Document Accessibility**: Patient records and medical documents must be accessible

---

## 2. Automated Testing Setup

### 2.1 axe-core Integration

axe-core is the industry standard for automated accessibility testing.

#### Installation

```bash
# Install axe-core and related packages
npm install --save-dev @axe-core/react axe-core
```

#### React Integration

Create a development-only accessibility checker:

```tsx
// src/lib/axeAccessibility.ts
import React from 'react';

export const initAxe = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const axe = await import('@axe-core/react');
    const ReactDOM = await import('react-dom');

    axe.default(React, ReactDOM, 1000, {
      rules: [
        // WCAG 2.1 AA rules
        { id: 'color-contrast', enabled: true },
        { id: 'heading-order', enabled: true },
        { id: 'label', enabled: true },
        { id: 'link-name', enabled: true },
        { id: 'button-name', enabled: true },
        { id: 'image-alt', enabled: true },
        { id: 'form-field-multiple-labels', enabled: true },
        { id: 'duplicate-id', enabled: true },
        { id: 'valid-lang', enabled: true },
        { id: 'document-title', enabled: true },
        { id: 'html-has-lang', enabled: true },
        { id: 'meta-viewport', enabled: true },
        { id: 'landmark-one-main', enabled: true },
        { id: 'bypass', enabled: true },
      ],
    });
  }
};
```

#### Usage in App Entry Point

```tsx
// src/app/layout.tsx or src/pages/_app.tsx
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/axeAccessibility').then(({ initAxe }) => initAxe());
    }
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 2.2 jest-axe for Unit Tests

jest-axe integrates axe-core with Jest for component-level accessibility testing.

#### Installation

```bash
npm install --save-dev jest-axe @types/jest-axe
```

#### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // ... other config
};
```

```javascript
// jest.setup.js
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
```

#### Writing Accessibility Tests

```tsx
// src/components/__tests__/Button.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from '../Button';

describe('Button Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Button onClick={() => {}}>Click Me</Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations when disabled', async () => {
    const { container } = render(
      <Button onClick={() => {}} disabled>
        Disabled Button
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with icon-only button', async () => {
    const { container } = render(
      <Button onClick={() => {}} aria-label="Close dialog">
        <CloseIcon aria-hidden="true" />
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

#### Testing Forms

```tsx
// src/components/__tests__/LoginForm.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { LoginForm } from '../LoginForm';

describe('LoginForm Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<LoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with error states', async () => {
    const { container } = render(
      <LoginForm errors={{ email: 'Invalid email', password: 'Required' }} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations in loading state', async () => {
    const { container } = render(<LoginForm isLoading />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

#### Custom axe Configuration

```tsx
// For specific rule configurations
const customAxeConfig = {
  rules: {
    // Disable specific rules if necessary (with justification)
    'color-contrast': { enabled: true },
    // Custom configurations
    region: { enabled: false }, // Disable for component tests
  },
};

it('should pass with custom configuration', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container, customAxeConfig);
  expect(results).toHaveNoViolations();
});
```

### 2.3 Playwright Accessibility Testing

Playwright provides built-in accessibility testing through axe-core integration.

#### Installation

```bash
npm install --save-dev @playwright/test @axe-core/playwright
```

#### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/a11y-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

#### Accessibility Test File

```typescript
// e2e/tests/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.describe('Page-Level Accessibility', () => {
    const pages = [
      { name: 'Home', path: '/' },
      { name: 'Login', path: '/login' },
      { name: 'Register', path: '/register' },
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Appointments', path: '/appointments' },
      { name: 'Profile', path: '/profile' },
      { name: 'Settings', path: '/settings' },
    ];

    for (const page of pages) {
      test(`${page.name} page should have no WCAG 2.1 AA violations`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        await browserPage.waitForLoadState('networkidle');

        const accessibilityScanResults = await new AxeBuilder({ page: browserPage })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }
  });

  test.describe('Form Accessibility', () => {
    test('Login form should be accessible', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Test empty form submission
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('form')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('Error messages should be accessible', async ({ page }) => {
      await page.goto('/login');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);

      // Verify error messages have proper ARIA
      const errorMessages = page.locator('[role="alert"], [aria-invalid="true"]');
      expect(await errorMessages.count()).toBeGreaterThan(0);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Interactive Component Accessibility', () => {
    test('Modal dialogs should trap focus', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Open a modal
      const modalTrigger = page.locator('[data-testid="open-modal"]').first();
      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();

        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();

        // Verify modal has proper ARIA
        await expect(modal).toHaveAttribute('aria-modal', 'true');

        // Test focus trap
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab');
          const focusedInModal = await page.evaluate(() => {
            const modal = document.querySelector('[role="dialog"]');
            return modal?.contains(document.activeElement);
          });
          expect(focusedInModal).toBe(true);
        }

        // Test Escape closes modal
        await page.keyboard.press('Escape');
        await expect(modal).not.toBeVisible();
      }
    });

    test('Dropdown menus should be keyboard accessible', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      const dropdown = page.locator('[aria-haspopup="menu"], [aria-haspopup="true"]').first();
      if (await dropdown.isVisible()) {
        // Open with Enter
        await dropdown.focus();
        await page.keyboard.press('Enter');

        const menu = page.locator('[role="menu"]');
        await expect(menu).toBeVisible();

        // Navigate with arrow keys
        await page.keyboard.press('ArrowDown');
        const firstItem = page.locator('[role="menuitem"]').first();
        await expect(firstItem).toBeFocused();

        // Close with Escape
        await page.keyboard.press('Escape');
        await expect(menu).not.toBeVisible();
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('should have sufficient color contrast in light mode', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .options({ rules: { 'color-contrast': { enabled: true } } })
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter(
        v => v.id === 'color-contrast'
      );
      expect(contrastViolations).toEqual([]);
    });

    test('should have sufficient color contrast in dark mode', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Toggle dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .options({ rules: { 'color-contrast': { enabled: true } } })
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter(
        v => v.id === 'color-contrast'
      );
      expect(contrastViolations).toEqual([]);
    });
  });

  test.describe('Responsive Accessibility', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 812 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1440, height: 900 },
    ];

    for (const viewport of viewports) {
      test(`should be accessible at ${viewport.name} viewport`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }
  });
});
```

#### Generating Accessibility Reports

```typescript
// e2e/tests/accessibility-report.spec.ts
import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

test('Generate comprehensive accessibility report', async ({ page }) => {
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Login', path: '/login' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const report = {
    timestamp: new Date().toISOString(),
    pages: [] as any[],
    summary: {
      totalViolations: 0,
      totalPasses: 0,
      totalIncomplete: 0,
    },
  };

  for (const pageInfo of pages) {
    await page.goto(pageInfo.path);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    report.pages.push({
      name: pageInfo.name,
      path: pageInfo.path,
      violations: results.violations,
      passes: results.passes.length,
      incomplete: results.incomplete,
    });

    report.summary.totalViolations += results.violations.length;
    report.summary.totalPasses += results.passes.length;
    report.summary.totalIncomplete += results.incomplete.length;
  }

  // Save report
  const reportPath = path.join(process.cwd(), 'test-results', 'accessibility-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
});
```

### 2.4 CI/CD Integration

#### GitHub Actions Workflow

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Start application
        run: npm run start &
        env:
          PORT: 3000

      - name: Wait for application
        run: npx wait-on http://localhost:3000

      - name: Run accessibility tests
        run: npm run test:a11y

      - name: Upload accessibility report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: accessibility-report
          path: |
            test-results/
            playwright-report/

      - name: Comment on PR with results
        if: github.event_name == 'pull_request' && failure()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('test-results/accessibility-report.json'));

            let comment = '## Accessibility Test Results\n\n';
            comment += `**Total Violations:** ${report.summary.totalViolations}\n\n`;

            if (report.summary.totalViolations > 0) {
              comment += '### Violations Found\n\n';
              for (const page of report.pages) {
                if (page.violations.length > 0) {
                  comment += `#### ${page.name} (${page.path})\n`;
                  for (const violation of page.violations) {
                    comment += `- **${violation.id}**: ${violation.description}\n`;
                  }
                  comment += '\n';
                }
              }
            }

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

#### Package.json Scripts

```json
{
  "scripts": {
    "test:a11y": "playwright test --project=chromium e2e/tests/accessibility.spec.ts",
    "test:a11y:all": "playwright test e2e/tests/accessibility.spec.ts",
    "test:a11y:report": "playwright test e2e/tests/accessibility-report.spec.ts",
    "test:a11y:unit": "jest --testPathPattern=\\.a11y\\.test\\.",
    "lint:a11y": "eslint --ext .tsx,.ts src/ --rule 'jsx-a11y/*: error'"
  }
}
```

---

## 3. Manual Testing Checklist

### 3.1 Keyboard Navigation Testing

#### Basic Navigation Checklist

| Test | Expected Behavior | Pass/Fail |
|------|-------------------|-----------|
| Tab through all interactive elements | Focus moves in logical order | |
| Shift+Tab moves focus backward | Focus moves to previous element | |
| Enter activates buttons and links | Action is triggered | |
| Space activates buttons | Button click is triggered | |
| Space toggles checkboxes | Checkbox state changes | |
| Arrow keys navigate within components | Selection moves appropriately | |
| Escape closes modals and dropdowns | Overlay closes, focus returns | |
| Skip link is first focusable element | Skip link appears on first Tab | |
| Skip link skips to main content | Focus moves to main content | |
| Focus never gets trapped | Can always Tab out of components | |

#### Focus Management Checklist

| Test | Expected Behavior | Pass/Fail |
|------|-------------------|-----------|
| Focus indicator is visible | Clear outline/ring on focused elements | |
| Focus indicator has sufficient contrast | 3:1 minimum contrast ratio | |
| Modal opening moves focus to modal | First focusable element receives focus | |
| Modal closing returns focus | Focus returns to trigger element | |
| Dynamic content does not steal focus | User maintains control of focus | |
| Page navigation updates focus | Focus moves to new page content | |
| Error messages receive focus | Focus moves to first error | |
| Loading states maintain focus | Focus preserved during loading | |

#### Component-Specific Keyboard Tests

**Data Tables:**
| Test | Expected Behavior | Pass/Fail |
|------|-------------------|-----------|
| Tab moves between interactive cells | Focus moves to buttons/links in cells | |
| Arrow keys navigate cells (if applicable) | Selection moves through cells | |
| Enter activates row actions | Row action is triggered | |
| Sort controls are keyboard accessible | Can sort columns with keyboard | |

**Forms:**
| Test | Expected Behavior | Pass/Fail |
|------|-------------------|-----------|
| Tab moves through form fields | Logical field order | |
| Required fields are indicated | Screen reader announces "required" | |
| Error messages are announced | Screen reader reads error on focus | |
| Autocomplete suggestions navigable | Arrow keys navigate suggestions | |
| Date pickers keyboard accessible | Can select dates without mouse | |

**Navigation:**
| Test | Expected Behavior | Pass/Fail |
|------|-------------------|-----------|
| Main navigation keyboard accessible | Can navigate all menu items | |
| Dropdown menus open with Enter/Space | Submenu appears | |
| Arrow keys navigate menu items | Focus moves through items | |
| Escape closes open menus | Menu closes, focus returns | |
| Current page indicated | aria-current="page" present | |

### 3.2 Screen Reader Testing

#### General Screen Reader Checklist

| Test | Expected Behavior | Pass/Fail |
|------|-------------------|-----------|
| Page title is announced | Descriptive title read on page load | |
| Headings create logical outline | Heading structure is logical (h1-h6) | |
| Landmarks are announced | Main, navigation, header, footer identified | |
| Images have alt text | Meaningful images described | |
| Decorative images hidden | alt="" or role="presentation" | |
| Links describe destination | Link text is meaningful | |
| Buttons describe action | Button text explains purpose | |
| Form fields have labels | Labels announced with fields | |
| Error messages announced | Errors read when they appear | |
| Status updates announced | Live regions work correctly | |
| Tables have captions | Table purpose is announced | |
| Table headers associated | Headers read with data cells | |

#### Landmarks to Verify

```
<header> or role="banner"    - Page header
<nav> or role="navigation"   - Navigation regions
<main> or role="main"        - Main content
<footer> or role="contentinfo" - Page footer
<aside> or role="complementary" - Sidebar content
<form> or role="form"        - Form regions
<section> with aria-label    - Named sections
```

### 3.3 Color Contrast Verification

#### Contrast Ratio Requirements

| Element Type | Minimum Ratio | Level |
|--------------|---------------|-------|
| Normal text (< 18pt / 14pt bold) | 4.5:1 | AA |
| Large text (>= 18pt / 14pt bold) | 3:1 | AA |
| UI components (borders, icons) | 3:1 | AA |
| Focus indicators | 3:1 | AA |
| Graphical objects | 3:1 | AA |

#### Testing Procedure

1. **Browser DevTools:**
   - Open Chrome DevTools > Elements
   - Select text element
   - View Styles panel
   - Look for contrast ratio in color picker

2. **axe DevTools Extension:**
   - Install axe DevTools browser extension
   - Run scan on page
   - Review color contrast violations

3. **WebAIM Contrast Checker:**
   - Visit https://webaim.org/resources/contrastchecker/
   - Enter foreground and background colors
   - Verify AA compliance

4. **Automated Testing:**
   ```bash
   # Run Lighthouse accessibility audit
   npx lighthouse http://localhost:3000 --only-categories=accessibility
   ```

#### Color Contrast Checklist

| Element | Foreground | Background | Ratio | Pass/Fail |
|---------|------------|------------|-------|-----------|
| Body text | | | >= 4.5:1 | |
| Headings | | | >= 4.5:1 | |
| Links | | | >= 4.5:1 | |
| Button text | | | >= 4.5:1 | |
| Form labels | | | >= 4.5:1 | |
| Placeholder text | | | >= 4.5:1 | |
| Error messages | | | >= 4.5:1 | |
| Focus ring | | | >= 3:1 | |
| Icons | | | >= 3:1 | |
| Borders | | | >= 3:1 | |

### 3.4 Focus Management Testing

#### Focus Behavior Checklist

| Scenario | Expected Behavior | Pass/Fail |
|----------|-------------------|-----------|
| Page load | Focus at top of page or skip link | |
| Modal open | Focus moves to modal | |
| Modal close | Focus returns to trigger | |
| Toast/notification | Focus not moved (unless action required) | |
| Dynamic content load | Focus managed appropriately | |
| Route change | Focus moved to main content | |
| Accordion expand | Focus stays on trigger | |
| Tab panel switch | Focus moves to panel content | |
| Dropdown open | Focus moves to first option | |
| Dropdown select | Focus returns to trigger | |
| Delete confirmation | Focus moves to confirmation | |
| After delete | Focus moves to appropriate element | |

### 3.5 Form Error Handling

#### Error Handling Checklist

| Test | Expected Behavior | Pass/Fail |
|------|-------------------|-----------|
| Errors identified in text | Not just color | |
| Error messages associated with fields | aria-describedby links error | |
| Invalid fields marked | aria-invalid="true" | |
| Error summary provided | List of all errors | |
| First error receives focus | On submission with errors | |
| Errors cleared when fixed | aria-invalid removed | |
| Required fields indicated | Before and after submission | |
| Error suggestions provided | Help text for fixing errors | |
| Form preserves input | Values not lost on error | |

#### Error Message Format

```tsx
// Accessible error message pattern
<div>
  <label htmlFor="email">
    Email Address
    <span className="required">(required)</span>
  </label>
  <input
    id="email"
    type="email"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
    aria-required="true"
  />
  {hasError && (
    <div id="email-error" role="alert" className="error-message">
      Please enter a valid email address
    </div>
  )}
</div>
```

---

## 4. Screen Reader Testing Scripts

### 4.1 VoiceOver (macOS)

#### Setup and Basics

```
ENABLING VOICEOVER:
1. Press Cmd + F5 to toggle VoiceOver on/off
2. Or go to System Preferences > Accessibility > VoiceOver

BASIC NAVIGATION:
- VO keys = Control + Option (by default)
- Read next item: VO + Right Arrow
- Read previous item: VO + Left Arrow
- Interact with element: VO + Shift + Down Arrow
- Stop interacting: VO + Shift + Up Arrow
- Activate link/button: VO + Space
```

#### Testing Script: Login Page

```
TEST: Login Page Accessibility with VoiceOver

PREPARATION:
1. Open Safari (recommended for VoiceOver)
2. Navigate to the login page
3. Enable VoiceOver (Cmd + F5)

STEP 1: Page Load Announcement
Expected: VoiceOver announces page title
Action: Listen after page loads
Check: [ ] Page title announced (e.g., "Login - Unified Healthcare")
Check: [ ] Focus announced (skip link or first element)

STEP 2: Navigate Landmarks
Action: Press VO + U to open Rotor, select Landmarks
Check: [ ] Banner landmark found
Check: [ ] Navigation landmark found
Check: [ ] Main landmark found
Check: [ ] Footer/contentinfo landmark found

STEP 3: Test Skip Link
Action: Press Tab (first element)
Check: [ ] Skip link announced
Action: Press Enter/VO + Space
Check: [ ] Focus moves to main content
Check: [ ] VoiceOver announces main content

STEP 4: Navigate Headings
Action: Press VO + U, select Headings
Check: [ ] h1 heading found (page title)
Check: [ ] Heading hierarchy is logical

STEP 5: Test Form Fields
Action: Tab to email field
Check: [ ] Label announced ("Email" or "Email Address")
Check: [ ] Required state announced
Check: [ ] Input type announced ("edit text" or "email")

Action: Tab to password field
Check: [ ] Label announced
Check: [ ] Secure text input announced
Check: [ ] Required state announced

STEP 6: Test Buttons
Action: Tab to submit button
Check: [ ] Button role announced
Check: [ ] Button label announced (e.g., "Sign In, button")

STEP 7: Test Error States
Action: Submit empty form (VO + Space on submit button)
Check: [ ] Error message announced
Check: [ ] Invalid fields announced
Check: [ ] Focus moves to first error

STEP 8: Test Links
Action: Navigate to "Forgot Password" link
Check: [ ] Link role announced
Check: [ ] Link text is descriptive

RESULTS:
Total Checks: ___
Passed: ___
Failed: ___
Notes:
```

#### Testing Script: Dashboard Navigation

```
TEST: Dashboard Navigation with VoiceOver

PREPARATION:
1. Login to the application
2. Navigate to dashboard
3. Enable VoiceOver (Cmd + F5)

STEP 1: Main Navigation
Action: Press VO + U, select Navigation
Check: [ ] Main navigation found
Check: [ ] All nav items accessible

Action: Navigate through menu items with arrow keys
Check: [ ] Each item announced with label
Check: [ ] Current page indicated (aria-current)

STEP 2: Dashboard Widgets
Action: Navigate through main content with VO + Right Arrow
Check: [ ] Widget headings announced
Check: [ ] Data values announced
Check: [ ] Interactive elements identified

STEP 3: Data Tables
Action: Navigate to any data table
Check: [ ] Table caption announced
Check: [ ] Column headers announced
Check: [ ] Row data read with headers

Action: Use VO + Left/Right/Up/Down to navigate cells
Check: [ ] Cell content announced
Check: [ ] Header context provided

STEP 4: Action Buttons
Action: Navigate to action buttons (Edit, Delete, etc.)
Check: [ ] Button purpose clear
Check: [ ] Icon-only buttons have accessible names

STEP 5: Notifications
Action: Trigger a notification/toast
Check: [ ] Message announced automatically
Check: [ ] Politeness level appropriate

RESULTS:
Total Checks: ___
Passed: ___
Failed: ___
Notes:
```

### 4.2 NVDA (Windows)

#### Setup and Basics

```
ENABLING NVDA:
1. Download from https://www.nvaccess.org/download/
2. Press Ctrl + Alt + N to start NVDA
3. Or use the desktop shortcut

BASIC NAVIGATION:
- NVDA key = Insert or Caps Lock (configurable)
- Read next item: Down Arrow
- Read previous item: Up Arrow
- Activate: Enter or Space
- Stop reading: Ctrl
- Read current line: NVDA + Up Arrow
- Open Elements List: NVDA + F7
```

#### Testing Script: Login Page

```
TEST: Login Page Accessibility with NVDA

PREPARATION:
1. Open Chrome or Firefox
2. Navigate to the login page
3. Start NVDA (Ctrl + Alt + N)

STEP 1: Page Load
Expected: NVDA announces page title and initial content
Action: Wait for page to load
Check: [ ] Page title announced
Check: [ ] Focus position announced

STEP 2: Elements List
Action: Press NVDA + F7 to open Elements List
Check: [ ] Landmarks tab shows all landmarks
Check: [ ] Headings tab shows heading hierarchy
Check: [ ] Links list populated
Check: [ ] Form fields list populated

STEP 3: Browse Mode Navigation
Action: Press H to jump to headings
Check: [ ] First heading is h1
Check: [ ] Subsequent headings are h2 or lower

Action: Press F to jump to form fields
Check: [ ] All form fields navigable
Check: [ ] Labels announced with fields

STEP 4: Form Field Testing
Action: Tab to email field
Check: [ ] "Email, edit" or similar announced
Check: [ ] Required state indicated
Check: [ ] Autocomplete works

Action: Type in email field
Check: [ ] Characters announced (or words in word echo mode)

Action: Tab to password field
Check: [ ] "Password, protected edit text" announced
Check: [ ] Characters not announced when typing

STEP 5: Submit Form
Action: Tab to submit button
Check: [ ] "Sign In, button" announced

Action: Press Enter or Space
Check: [ ] Form submission announced
Check: [ ] Loading state announced (if applicable)

STEP 6: Error Testing
Action: Clear fields and submit empty form
Check: [ ] Error messages announced
Check: [ ] Focus moves to error or summary
Check: [ ] Fields marked as invalid announced

STEP 7: Focus Mode
Action: Press NVDA + Space to toggle Focus mode in form
Check: [ ] Can type in fields without triggering browse commands

RESULTS:
Total Checks: ___
Passed: ___
Failed: ___
Notes:
```

#### Testing Script: Modal Dialog

```
TEST: Modal Dialog Accessibility with NVDA

PREPARATION:
1. Navigate to a page with modal functionality
2. Start NVDA

STEP 1: Opening Modal
Action: Activate modal trigger button
Check: [ ] Modal announced ("dialog" or modal title)
Check: [ ] Focus moves into modal
Check: [ ] Background content not readable

STEP 2: Modal Content
Action: Navigate within modal using Down Arrow
Check: [ ] All content readable
Check: [ ] Interactive elements identified

STEP 3: Focus Trap
Action: Press Tab repeatedly
Check: [ ] Focus cycles within modal
Check: [ ] Cannot Tab to background content

STEP 4: Close Modal
Action: Press Escape
Check: [ ] Modal closes
Check: [ ] "Dialog closed" or similar announced
Check: [ ] Focus returns to trigger button

Action: Verify focus return
Check: [ ] Original button is focused
Check: [ ] Can continue navigating from button

RESULTS:
Total Checks: ___
Passed: ___
Failed: ___
Notes:
```

### 4.3 TalkBack (Android)

#### Setup and Basics

```
ENABLING TALKBACK:
1. Settings > Accessibility > TalkBack
2. Toggle TalkBack ON
3. Or use gesture shortcut if configured

BASIC GESTURES:
- Explore by touch: Drag finger to hear elements
- Read next: Swipe right
- Read previous: Swipe left
- Activate: Double tap
- Scroll: Two-finger swipe
- Back: Two-finger swipe down then left
- Home: Two-finger swipe up then left
- Open TalkBack menu: Swipe down then right
```

#### Testing Script: Mobile Login

```
TEST: Mobile Login with TalkBack

PREPARATION:
1. Open Chrome on Android device
2. Navigate to login page
3. Enable TalkBack in Settings

STEP 1: Page Exploration
Action: Explore by dragging finger across screen
Check: [ ] All elements announced
Check: [ ] Touch targets large enough (44x44dp minimum)
Check: [ ] No overlapping touch targets

STEP 2: Linear Navigation
Action: Swipe right through all elements
Check: [ ] Logical reading order
Check: [ ] All interactive elements reachable
Check: [ ] Skip link available

STEP 3: Form Fields
Action: Swipe to email field
Check: [ ] "Email, edit box" announced
Check: [ ] Double tap to edit

Action: Enter text in field
Check: [ ] Keyboard announces letters
Check: [ ] Field content announced

Action: Swipe to password field
Check: [ ] "Password, password edit box" announced
Check: [ ] Characters hidden when typing

STEP 4: Buttons
Action: Swipe to submit button
Check: [ ] "Sign In, button" announced
Check: [ ] Double tap submits form

STEP 5: Error Handling
Action: Submit empty form
Check: [ ] Error message announced
Check: [ ] Focus moves appropriately

STEP 6: Touch Target Size
Action: Try to tap small elements
Check: [ ] Buttons at least 44x44dp
Check: [ ] Adequate spacing between targets

RESULTS:
Total Checks: ___
Passed: ___
Failed: ___
Notes:
```

### 4.4 VoiceOver (iOS)

#### Setup and Basics

```
ENABLING VOICEOVER:
1. Settings > Accessibility > VoiceOver
2. Toggle VoiceOver ON
3. Or use Siri: "Turn on VoiceOver"
4. Or triple-click Home/Side button if configured

BASIC GESTURES:
- Explore by touch: Drag finger
- Read next: Swipe right
- Read previous: Swipe left
- Activate: Double tap
- Scroll: Three-finger swipe
- Go to top: Four-finger tap top of screen
- Go to bottom: Four-finger tap bottom of screen
- Rotor: Two-finger rotate gesture
```

#### Testing Script: iOS App/Web Navigation

```
TEST: iOS Navigation with VoiceOver

PREPARATION:
1. Open Safari on iOS device
2. Navigate to the application
3. Enable VoiceOver

STEP 1: Initial Navigation
Action: Swipe right from top of page
Check: [ ] Page title announced
Check: [ ] Skip link available and functional

STEP 2: Rotor Navigation
Action: Two-finger rotate to select "Headings"
Check: [ ] Headings navigation available
Action: Swipe down to navigate headings
Check: [ ] All headings reachable
Check: [ ] Hierarchy is logical

Action: Two-finger rotate to select "Landmarks"
Check: [ ] Landmarks navigation available
Action: Swipe down to navigate landmarks
Check: [ ] All landmarks accessible

STEP 3: Form Interaction
Action: Swipe to form field
Check: [ ] Field type and label announced
Check: [ ] Required state indicated

Action: Double tap to edit
Check: [ ] Keyboard appears
Check: [ ] Can type in field

Action: Double tap with two fingers to dismiss keyboard
Check: [ ] Keyboard closes
Check: [ ] Focus maintained

STEP 4: Custom Controls
Action: Navigate to any custom components (date pickers, etc.)
Check: [ ] Purpose is clear
Check: [ ] Instructions provided if needed
Check: [ ] Operable with VoiceOver

STEP 5: Notifications
Action: Trigger a notification
Check: [ ] Announced appropriately
Check: [ ] Does not steal focus unexpectedly

STEP 6: Touch Targets
Action: Explore touch targets
Check: [ ] Minimum 44x44pt
Check: [ ] No overlapping targets

RESULTS:
Total Checks: ___
Passed: ___
Failed: ___
Notes:
```

---

## 5. Common Accessibility Patterns in the Codebase

### 5.1 FocusTrap Component

The `FocusTrap` component (`apps/web/src/components/a11y/FocusTrap.tsx`) traps keyboard focus within a container, essential for modal dialogs.

#### Usage

```tsx
import { FocusTrap } from '@/components/a11y';

// Basic modal usage
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <FocusTrap active={isOpen}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">Modal Title</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </FocusTrap>
  );
};

// With initial focus control
<FocusTrap
  active={isOpen}
  initialFocus={true}   // Focus first focusable element
  returnFocus={true}    // Return focus on close
>
  {/* content */}
</FocusTrap>
```

#### Hook Version

```tsx
import { useFocusTrap } from '@/components/a11y';

const CustomModal = () => {
  const trapRef = useFocusTrap({
    active: isOpen,
    initialFocus: true,
    returnFocus: true
  });

  return (
    <div ref={trapRef} role="dialog">
      {/* content */}
    </div>
  );
};
```

#### Key Features

- Traps Tab and Shift+Tab within container
- Handles dynamic content changes
- Returns focus to trigger element on close
- Supports initial focus customization

### 5.2 LiveRegion for Announcements

The `LiveRegion` component (`apps/web/src/components/a11y/LiveRegion.tsx`) announces dynamic content changes to screen readers.

#### Basic Usage

```tsx
import { LiveRegion, StatusMessage, useAnnouncer } from '@/components/a11y';

// Status message with automatic styling
<StatusMessage type="success">
  Profile updated successfully
</StatusMessage>

<StatusMessage type="error">
  Please correct the form errors
</StatusMessage>

// Custom live region
<LiveRegion politeness="polite" visuallyHidden>
  Loading complete, {count} items found
</LiveRegion>
```

#### Programmatic Announcements

```tsx
import { useAnnouncer } from '@/components/a11y';

const SaveButton = () => {
  const { announce, LiveRegion } = useAnnouncer();

  const handleSave = async () => {
    try {
      await saveData();
      announce('Data saved successfully', 'polite');
    } catch (error) {
      announce('Error saving data. Please try again.', 'assertive');
    }
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <LiveRegion /> {/* Renders the announcement */}
    </>
  );
};
```

#### Politeness Levels

| Level | Use Case | Behavior |
|-------|----------|----------|
| `polite` | Status updates, confirmations | Announces after current speech |
| `assertive` | Errors, critical alerts | Interrupts current speech |
| `off` | Disable announcements | No announcement |

### 5.3 SkipLink for Navigation

The `SkipLink` component (`apps/web/src/components/a11y/SkipLink.tsx`) allows keyboard users to bypass repetitive navigation.

#### Basic Usage

```tsx
import { SkipLink, SkipLinks } from '@/components/a11y';

// Single skip link (most common)
const Layout = ({ children }) => (
  <>
    <SkipLink targetId="main-content">
      Skip to main content
    </SkipLink>
    <header>{/* navigation */}</header>
    <main id="main-content">{children}</main>
  </>
);

// Multiple skip links for complex layouts
<SkipLinks
  links={[
    { targetId: 'main-content', label: 'Skip to main content' },
    { targetId: 'main-navigation', label: 'Skip to navigation' },
    { targetId: 'search', label: 'Skip to search' },
  ]}
/>
```

#### Styling

The skip link is:
- Visually hidden by default
- Becomes visible when focused
- Positioned at top-left of viewport
- Styled with high contrast for visibility

### 5.4 VisuallyHidden for Screen Readers

The `VisuallyHidden` component (`apps/web/src/components/a11y/VisuallyHidden.tsx`) hides content visually while keeping it accessible.

#### Usage Patterns

```tsx
import { VisuallyHidden, ScreenReaderOnly } from '@/components/a11y';

// Icon-only button
<button aria-label="Close">
  <CloseIcon aria-hidden="true" />
</button>

// Or with VisuallyHidden
<button>
  <CloseIcon aria-hidden="true" />
  <VisuallyHidden>Close dialog</VisuallyHidden>
</button>

// Screen reader only heading
<VisuallyHidden as="h2">
  Search results section
</VisuallyHidden>

// Additional context for links
<a href="/reports">
  View report
  <VisuallyHidden> for January 2024 sales data</VisuallyHidden>
</a>

// Focusable version (becomes visible on focus)
<VisuallyHidden focusable>
  Press Enter to activate keyboard shortcuts
</VisuallyHidden>
```

#### Hook Usage

```tsx
import { useVisuallyHidden } from '@/components/a11y';

const MyComponent = () => {
  const srOnlyClass = useVisuallyHidden();

  return (
    <span className={srOnlyClass}>
      Screen reader only content
    </span>
  );
};
```

### 5.5 Accessible Forms Pattern

```tsx
import { FormField, TextAreaField, CheckboxField } from '@/components/forms/FormField';
import { VisuallyHidden, LiveRegion } from '@/components/a11y';

const AccessibleForm = () => {
  const [errors, setErrors] = useState({});
  const { announce } = useAnnouncer();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      announce(
        `Form has ${Object.keys(newErrors).length} errors. Please review and correct.`,
        'assertive'
      );
      // Focus first error field
      document.getElementById(Object.keys(newErrors)[0])?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-describedby="form-instructions">
      <p id="form-instructions">
        Required fields are marked with an asterisk (*).
      </p>

      <div>
        <label htmlFor="email">
          Email Address
          <span aria-hidden="true" className="required">*</span>
          <VisuallyHidden>(required)</VisuallyHidden>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : 'email-hint'}
          autoComplete="email"
        />
        <p id="email-hint" className="hint">
          We will never share your email.
        </p>
        {errors.email && (
          <p id="email-error" role="alert" className="error">
            {errors.email}
          </p>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

### 5.6 Accessible Modal Pattern

```tsx
import { FocusTrap, LiveRegion } from '@/components/a11y';
import { useEffect, useRef } from 'react';

const AccessibleModal = ({ isOpen, onClose, title, children }) => {
  const closeButtonRef = useRef(null);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      aria-hidden="true"
    >
      <FocusTrap active={isOpen}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="modal-header">
            <h2 id="modal-title">{title}</h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close dialog"
            >
              <CloseIcon aria-hidden="true" />
            </button>
          </header>

          <div id="modal-description" className="modal-body">
            {children}
          </div>

          <footer className="modal-footer">
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleConfirm}>Confirm</button>
          </footer>
        </div>
      </FocusTrap>
    </div>
  );
};
```

### 5.7 Accessible Data Table Pattern

```tsx
import { DataTable } from '@/components/DataTable';

// Basic usage
<DataTable
  caption="Patient Appointments for January 2024"
  data={appointments}
  columns={[
    {
      id: 'patient',
      header: 'Patient Name',
      accessorKey: 'patientName',
      scope: 'row' // Makes this column a row header
    },
    {
      id: 'date',
      header: 'Date',
      accessorKey: 'date',
      sortable: true
    },
    {
      id: 'time',
      header: 'Time',
      accessorKey: 'time'
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status'
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div role="group" aria-label="Row actions">
          <button aria-label={`Edit appointment for ${row.patientName}`}>
            Edit
          </button>
          <button aria-label={`Cancel appointment for ${row.patientName}`}>
            Cancel
          </button>
        </div>
      )
    }
  ]}
/>
```

---

## 6. Testing Matrix Template

### 6.1 Feature Testing Matrix

Use this template to track accessibility testing for each feature.

```
Feature: ________________________________
Tester: ________________________________
Date: __________________________________
Browser/Device: _________________________

AUTOMATED TESTING
-----------------
[ ] axe-core scan completed
    Violations found: ___
    Violations fixed: ___
[ ] jest-axe unit tests pass
[ ] Playwright a11y tests pass
[ ] ESLint jsx-a11y rules pass

KEYBOARD TESTING
----------------
[ ] All interactive elements focusable
[ ] Focus order is logical
[ ] Focus indicator is visible (3:1 contrast)
[ ] No keyboard traps
[ ] Enter/Space activate buttons
[ ] Escape closes overlays
[ ] Arrow keys work in menus/lists

SCREEN READER TESTING
---------------------
VoiceOver (macOS):
[ ] Page title announced
[ ] Headings navigable and logical
[ ] Form fields have labels
[ ] Errors announced
[ ] Status messages announced

NVDA (Windows):
[ ] Page title announced
[ ] Headings navigable and logical
[ ] Form fields have labels
[ ] Errors announced
[ ] Status messages announced

COLOR & CONTRAST
----------------
[ ] Text contrast >= 4.5:1
[ ] Large text contrast >= 3:1
[ ] UI component contrast >= 3:1
[ ] Information not conveyed by color alone
[ ] Works in high contrast mode

RESPONSIVE
----------
[ ] Accessible at 320px width
[ ] No horizontal scroll at 320px
[ ] Touch targets >= 44x44px
[ ] Works at 200% zoom

NOTES
-----
[Additional observations and issues]


SIGN-OFF
--------
Accessibility Approved: [ ] Yes [ ] No
Signed: _____________________
Date: _______________________
```

### 6.2 Page-Level Testing Matrix

```
+------------------+--------+-------+--------+---------+-------+--------+
| Page             | axe    | NVDA  | VO Mac | VO iOS  | JAWS  | Status |
+------------------+--------+-------+--------+---------+-------+--------+
| Home             | [ ]    | [ ]   | [ ]    | [ ]     | [ ]   |        |
| Login            | [ ]    | [ ]   | [ ]    | [ ]     | [ ]   |        |
| Register         | [ ]    | [ ]   | [ ]    | [ ]     | [ ]   |        |
| Dashboard        | [ ]    | [ ]   | [ ]    | [ ]     | [ ]   |        |
| Profile          | [ ]    | [ ]   | [ ]    | [ ]     | [ ]   |        |
| Settings         | [ ]    | [ ]   | [ ]    | [ ]     | [ ]   |        |
| Appointments     | [ ]    | [ ]   | [ ]    | [ ]     | [ ]   |        |
| Medical Records  | [ ]    | [ ]   | [ ]    | [ ]     | [ ]   |        |
| Messaging        | [ ]    | [ ]   | [ ]    | [ ]     | [ ]   |        |
| Billing          | [ ]    | [ ]   | [ ]    | [ ]     | [ ]   |        |
+------------------+--------+-------+--------+---------+-------+--------+

Legend:
[P] = Pass
[F] = Fail
[N/A] = Not Applicable
[IP] = In Progress
```

### 6.3 Component Testing Matrix

```
+-------------------+-------+------+--------+-------+--------+--------+
| Component         | axe   | Keys | Labels | Focus | Errors | Status |
+-------------------+-------+------+--------+-------+--------+--------+
| Button            | [ ]   | [ ]  | [ ]    | [ ]   | N/A    |        |
| Input             | [ ]   | [ ]  | [ ]    | [ ]   | [ ]    |        |
| Select            | [ ]   | [ ]  | [ ]    | [ ]   | [ ]    |        |
| Checkbox          | [ ]   | [ ]  | [ ]    | [ ]   | [ ]    |        |
| Radio             | [ ]   | [ ]  | [ ]    | [ ]   | [ ]    |        |
| Modal             | [ ]   | [ ]  | [ ]    | [ ]   | [ ]    |        |
| Dropdown          | [ ]   | [ ]  | [ ]    | [ ]   | N/A    |        |
| DataTable         | [ ]   | [ ]  | [ ]    | [ ]   | N/A    |        |
| Tabs              | [ ]   | [ ]  | [ ]    | [ ]   | N/A    |        |
| Accordion         | [ ]   | [ ]  | [ ]    | [ ]   | N/A    |        |
| Toast             | [ ]   | [ ]  | [ ]    | N/A   | N/A    |        |
| DatePicker        | [ ]   | [ ]  | [ ]    | [ ]   | [ ]    |        |
| Autocomplete      | [ ]   | [ ]  | [ ]    | [ ]   | [ ]    |        |
+-------------------+-------+------+--------+-------+--------+--------+

Keys = Keyboard accessible
Labels = Proper ARIA labels
Focus = Focus management
Errors = Error handling
```

### 6.4 Release Accessibility Checklist

Before any release, complete this checklist:

```
RELEASE: ________________________________
DATE: ___________________________________

PRE-RELEASE CHECKLIST
---------------------

Automated Testing:
[ ] All axe-core scans pass (0 violations)
[ ] All jest-axe unit tests pass
[ ] All Playwright accessibility tests pass
[ ] ESLint jsx-a11y rules pass
[ ] Lighthouse accessibility score >= 90

Manual Testing:
[ ] Keyboard navigation tested on all new features
[ ] Screen reader testing completed (NVDA + VoiceOver)
[ ] Color contrast verified for all new UI
[ ] Focus management tested for modals/overlays
[ ] Form error handling tested
[ ] Responsive accessibility tested (320px - 1920px)

Documentation:
[ ] ARIA usage documented for custom components
[ ] Accessibility considerations noted in PR
[ ] Known issues documented with remediation plan

Sign-offs:
[ ] Developer self-review complete
[ ] Accessibility testing complete
[ ] QA review complete

APPROVAL
--------
Release Accessibility Approved: [ ] Yes [ ] No

Approved by: _____________________
Date: ___________________________

Notes/Exceptions:
_________________________________
_________________________________
_________________________________
```

---

## Appendix A: Useful Resources

### Official Documentation
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Testing Tools
- [axe DevTools Browser Extension](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessibility Insights](https://accessibilityinsights.io/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Screen Readers
- [NVDA (Windows - Free)](https://www.nvaccess.org/download/)
- [JAWS (Windows - Commercial)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (macOS/iOS - Built-in)](https://support.apple.com/guide/voiceover/welcome/mac)
- [TalkBack (Android - Built-in)](https://support.google.com/accessibility/android/answer/6283677)

### Learning Resources
- [Deque University](https://dequeuniversity.com/)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)
- [Inclusive Components](https://inclusive-components.design/)

---

## Appendix B: Common WCAG Violations and Fixes

### Missing Form Labels

**Violation:** Form inputs without associated labels

**Fix:**
```tsx
// Bad
<input type="email" placeholder="Email" />

// Good - Associated label
<label htmlFor="email">Email Address</label>
<input id="email" type="email" />

// Good - aria-label
<input type="email" aria-label="Email Address" />

// Good - Wrapped label
<label>
  Email Address
  <input type="email" />
</label>
```

### Insufficient Color Contrast

**Violation:** Text does not meet 4.5:1 contrast ratio

**Fix:**
```css
/* Bad - Contrast ratio 2.8:1 */
.text-gray {
  color: #9ca3af;
}

/* Good - Contrast ratio 4.5:1 */
.text-gray {
  color: #4b5563;
}
```

### Missing Alt Text

**Violation:** Images without alt text

**Fix:**
```tsx
// Bad
<img src="profile.jpg" />

// Good - Meaningful image
<img src="profile.jpg" alt="Dr. Smith's profile photo" />

// Good - Decorative image
<img src="decoration.svg" alt="" role="presentation" />
```

### Missing Page Language

**Violation:** HTML element missing lang attribute

**Fix:**
```html
<!-- Bad -->
<html>

<!-- Good -->
<html lang="en">
```

### Empty Buttons

**Violation:** Buttons without accessible text

**Fix:**
```tsx
// Bad
<button><IconClose /></button>

// Good
<button aria-label="Close dialog">
  <IconClose aria-hidden="true" />
</button>
```

### Missing Landmark Regions

**Violation:** Page structure not identifiable

**Fix:**
```tsx
// Bad
<div class="header">...</div>
<div class="content">...</div>

// Good
<header role="banner">...</header>
<main role="main">...</main>
<nav role="navigation">...</nav>
<footer role="contentinfo">...</footer>
```

---

*Last Updated: January 2026*
*Maintained By: Frontend Team*
*Version: 1.0.0*
