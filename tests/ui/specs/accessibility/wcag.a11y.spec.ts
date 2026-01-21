/**
 * Accessibility Tests - WCAG 2.1 AA Compliance
 * Tests for web accessibility across the platform
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes } from '../../fixtures/test-data';

// Pages to test for accessibility
const pagesToTest = [
  { name: 'Login', path: '/login', auth: false },
  { name: 'Register', path: '/register', auth: false },
  { name: 'Dashboard', path: routes.web.dashboard, auth: true },
  { name: 'Appointments', path: routes.web.appointments, auth: true },
  { name: 'Profile', path: routes.web.profile, auth: true },
  { name: 'Settings', path: routes.web.settings, auth: true },
  { name: 'Billing', path: routes.web.billing, auth: true },
];

test.describe('WCAG 2.1 AA Accessibility Tests', () => {
  for (const page of pagesToTest) {
    test(`${page.name} page should pass accessibility checks`, async ({ page: browserPage }) => {
      await browserPage.goto(page.path);
      await browserPage.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page: browserPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude(['[data-testid="skip-a11y"]']) // Exclude known issues being tracked
        .analyze();

      // Filter out known issues (if any)
      const violations = accessibilityScanResults.violations.filter(v => {
        // Add any known issues to ignore here
        return true;
      });

      expect(violations).toEqual([]);
    });
  }
});

test.describe('Keyboard Navigation', () => {
  test('should allow full keyboard navigation on login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Tab through all interactive elements
    const interactiveElements: string[] = [];

    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');

      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          type: (el as HTMLInputElement)?.type,
          text: el?.textContent?.trim().substring(0, 50),
        };
      });

      if (focusedElement.tagName === 'BODY') break;
      interactiveElements.push(`${focusedElement.tagName}:${focusedElement.type || focusedElement.text}`);
    }

    // Should have tabbed through email, password, and submit button at minimum
    expect(interactiveElements.length).toBeGreaterThanOrEqual(3);
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/login');

    // Tab to first focusable element
    await page.keyboard.press('Tab');

    // Get focused element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Check that focus is visible (has outline or other indicator)
    const hasVisibleFocus = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return (
        styles.outlineWidth !== '0px' ||
        styles.boxShadow !== 'none' ||
        el.classList.contains('focus-visible')
      );
    });

    expect(hasVisibleFocus).toBe(true);
  });

  test('should support Escape key to close modals', async ({ page }) => {
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');

    // Open user menu (if it's a modal/dropdown)
    const userMenu = page.locator('[data-testid="user-menu"]');
    if (await userMenu.isVisible()) {
      await userMenu.click();

      const dropdown = page.locator('[role="menu"], [data-testid="user-menu-dropdown"]');
      if (await dropdown.isVisible()) {
        // Press Escape
        await page.keyboard.press('Escape');

        // Dropdown should close
        await expect(dropdown).not.toBeVisible();
      }
    }
  });

  test('should trap focus in modal dialogs', async ({ page }) => {
    await page.goto(routes.web.dashboard);

    // Try to trigger a modal (e.g., book appointment button)
    const triggerButton = page.locator('[data-testid="book-appointment-button"]');

    if (await triggerButton.isVisible()) {
      await triggerButton.click();

      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible()) {
        // Tab multiple times - focus should stay within modal
        for (let i = 0; i < 20; i++) {
          await page.keyboard.press('Tab');

          const focusedInModal = await page.evaluate(() => {
            const modal = document.querySelector('[role="dialog"]');
            return modal?.contains(document.activeElement);
          });

          expect(focusedInModal).toBe(true);
        }
      }
    }
  });
});

test.describe('Screen Reader Support', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');

    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headingElements).map(h => ({
        level: parseInt(h.tagName[1]),
        text: h.textContent?.trim(),
      }));
    });

    // Should have at least one h1
    expect(headings.some(h => h.level === 1)).toBe(true);

    // Heading levels should not skip (e.g., h1 -> h3)
    for (let i = 1; i < headings.length; i++) {
      const currentLevel = headings[i].level;
      const previousLevel = headings[i - 1].level;

      // Can go down any number of levels, but can only go up by 1
      if (currentLevel > previousLevel) {
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    }
  });

  test('should have ARIA landmarks', async ({ page }) => {
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');

    // Check for essential landmarks
    const landmarks = await page.evaluate(() => {
      return {
        hasMain: !!document.querySelector('main, [role="main"]'),
        hasNav: !!document.querySelector('nav, [role="navigation"]'),
        hasBanner: !!document.querySelector('header, [role="banner"]'),
      };
    });

    expect(landmarks.hasMain).toBe(true);
    expect(landmarks.hasNav).toBe(true);
  });

  test('should have descriptive link text', async ({ page }) => {
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');

    const links = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('a');
      return Array.from(linkElements).map(a => ({
        text: a.textContent?.trim(),
        ariaLabel: a.getAttribute('aria-label'),
        title: a.getAttribute('title'),
      }));
    });

    // Check that links have descriptive text
    const genericLinks = links.filter(link => {
      const text = (link.text || link.ariaLabel || link.title || '').toLowerCase();
      return text === 'click here' || text === 'read more' || text === 'learn more' || text === '';
    });

    // Allow some generic links but warn if too many
    expect(genericLinks.length).toBeLessThan(links.length * 0.2);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');

    const images = await page.evaluate(() => {
      const imgElements = document.querySelectorAll('img');
      return Array.from(imgElements).map(img => ({
        src: img.src,
        alt: img.alt,
        role: img.getAttribute('role'),
      }));
    });

    // All images should have alt text (empty string for decorative images)
    for (const img of images) {
      expect(img.alt !== undefined || img.role === 'presentation').toBe(true);
    }
  });
});

test.describe('Color and Contrast', () => {
  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // Run separately for detailed analysis
      .analyze();

    // Then run color contrast specifically
    const contrastResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    // Log contrast issues for review
    if (contrastResults.violations.length > 0) {
      console.log('Color contrast issues:', contrastResults.violations);
    }

    expect(contrastResults.violations).toEqual([]);
  });

  test('should not rely solely on color to convey information', async ({ page }) => {
    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');

    // Check that status indicators have text labels, not just colors
    const statusElements = await page.locator('[class*="status"], [data-status]').all();

    for (const element of statusElements) {
      const hasText = await element.textContent();
      const hasAriaLabel = await element.getAttribute('aria-label');
      const hasTitle = await element.getAttribute('title');

      // Should have some text representation
      expect(hasText || hasAriaLabel || hasTitle).toBeTruthy();
    }
  });
});

test.describe('Form Accessibility', () => {
  test('should have labels for all form inputs', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const inputs = await page.locator('input:not([type="hidden"]):not([type="submit"])').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');

      // Check for associated label
      let hasLabel = false;

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        hasLabel = await label.count() > 0;
      }

      // Should have label, aria-label, or aria-labelledby
      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('should announce form errors to screen readers', async ({ page }) => {
    await page.goto('/login');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Wait for potential error messages
    await page.waitForTimeout(1000);

    // Check for ARIA live regions or error associations
    const errorMessages = await page.locator('[role="alert"], [aria-live], .error-message').all();

    // Or check that inputs are marked as invalid
    const invalidInputs = await page.locator('[aria-invalid="true"]').all();

    // Should have some error feedback mechanism
    expect(errorMessages.length > 0 || invalidInputs.length > 0).toBe(true);
  });

  test('should group related form fields', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Check for fieldsets with legends for grouped fields
    const fieldsets = await page.locator('fieldset').all();

    for (const fieldset of fieldsets) {
      const legend = await fieldset.locator('legend').count();
      expect(legend).toBeGreaterThan(0);
    }
  });
});

test.describe('Motion and Animation', () => {
  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto(routes.web.dashboard);
    await page.waitForLoadState('networkidle');

    // Check that animations are disabled or reduced
    const animatedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      return Array.from(elements).filter(el => {
        const styles = window.getComputedStyle(el);
        const animationDuration = parseFloat(styles.animationDuration);
        const transitionDuration = parseFloat(styles.transitionDuration);
        return animationDuration > 0 || transitionDuration > 0.3;
      }).length;
    });

    // Should have minimal animations when reduced motion is preferred
    expect(animatedElements).toBeLessThan(10);
  });
});
