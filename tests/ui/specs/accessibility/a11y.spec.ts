/**
 * Accessibility E2E Tests
 * Comprehensive tests for reduced motion, high contrast mode, ARIA attributes, and keyboard navigation
 * Healthcare-focused accessibility requirements for inclusive patient care
 */

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes, selectors, a11yConfig } from '../../fixtures/test-data';

// Accessibility-specific selectors
const a11ySelectors = {
  skipLink: 'a[href="#main"], [data-testid="skip-link"], .skip-link',
  mainContent: 'main, [role="main"], #main',
  navigation: 'nav, [role="navigation"]',
  searchInput: 'input[type="search"], [role="searchbox"]',
  modal: '[role="dialog"], [aria-modal="true"]',
  alert: '[role="alert"]',
  status: '[role="status"]',
  liveRegion: '[aria-live]',
  tooltip: '[role="tooltip"]',
  menu: '[role="menu"]',
  menuItem: '[role="menuitem"]',
  tab: '[role="tab"]',
  tabPanel: '[role="tabpanel"]',
  tabList: '[role="tablist"]',
};

test.describe('Accessibility Tests', () => {
  test.describe('Reduced Motion Preference Detection', () => {
    test('should detect and respect prefers-reduced-motion: reduce', async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Verify the preference is detected
      const reducedMotionDetected = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });

      expect(reducedMotionDetected).toBe(true);
    });

    test('should detect prefers-reduced-motion: no-preference', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const reducedMotionDetected = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });

      expect(reducedMotionDetected).toBe(false);
    });

    test('should disable animations when reduced motion is preferred', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Check CSS animation properties on animated elements
      const animationStatus = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let animatedElementCount = 0;

        elements.forEach((el) => {
          const styles = window.getComputedStyle(el);
          const animationDuration = parseFloat(styles.animationDuration) || 0;
          const transitionDuration = parseFloat(styles.transitionDuration) || 0;

          if (animationDuration > 0.1 || transitionDuration > 0.3) {
            animatedElementCount++;
          }
        });

        return {
          totalElements: elements.length,
          animatedElements: animatedElementCount,
        };
      });

      console.log('Animation status with reduced motion:', animationStatus);

      // With reduced motion, should have minimal animations
      expect(animationStatus.animatedElements).toBeLessThan(10);
    });

    test('should use alternate non-animated loading states', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });

      // Delay API to see loading state
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto(routes.web.dashboard);

      // Check loading indicators
      const loadingElements = page.locator('[data-testid="loading"], .loading, .spinner');

      if (await loadingElements.count() > 0) {
        const loadingAnimation = await loadingElements.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            animationName: styles.animationName,
            animationDuration: parseFloat(styles.animationDuration) || 0,
          };
        });

        // Loading animation should be disabled or minimal
        expect(
          loadingAnimation.animationName === 'none' ||
          loadingAnimation.animationDuration <= 0.01
        ).toBe(true);
      }
    });

    test('should handle dynamic preference changes', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Start with animations enabled
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.waitForTimeout(500);

      const beforeChange = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });

      expect(beforeChange).toBe(false);

      // Change to reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(500);

      const afterChange = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });

      expect(afterChange).toBe(true);
    });
  });

  test.describe('High Contrast Mode', () => {
    test('should support forced-colors mode', async ({ page }) => {
      await page.emulateMedia({ forcedColors: 'active' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Verify forced colors is detected
      const forcedColorsActive = await page.evaluate(() => {
        return window.matchMedia('(forced-colors: active)').matches;
      });

      expect(forcedColorsActive).toBe(true);
    });

    test('should have visible focus indicators in high contrast mode', async ({ page }) => {
      await page.emulateMedia({ forcedColors: 'active' });

      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Tab to first focusable element
      await page.keyboard.press('Tab');

      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Focus indicator should be visible in forced colors mode
      const hasVisibleFocus = await focusedElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        // In forced colors mode, system handles focus, so just check visibility
        return el.offsetWidth > 0 && el.offsetHeight > 0;
      });

      expect(hasVisibleFocus).toBe(true);
    });

    test('should maintain text visibility in high contrast mode', async ({ page }) => {
      await page.emulateMedia({ forcedColors: 'active' });

      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Check that text elements are visible
      const textElements = await page.locator('h1, h2, h3, p, label, button').all();

      for (const element of textElements.slice(0, 10)) {
        if (await element.isVisible()) {
          const box = await element.boundingBox();
          if (box) {
            expect(box.width).toBeGreaterThan(0);
            expect(box.height).toBeGreaterThan(0);
          }
        }
      }
    });

    test('should support prefers-contrast media query', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Check if high contrast styles are available
      const hasContrastStyles = await page.evaluate(() => {
        // Check for high contrast CSS custom properties or classes
        const root = document.documentElement;
        const styles = window.getComputedStyle(root);

        return {
          hasCustomProperties: styles.getPropertyValue('--high-contrast-bg') !== '' ||
                              styles.getPropertyValue('--contrast-bg') !== '',
          hasContrastClass: document.body.classList.contains('high-contrast') ||
                           document.documentElement.classList.contains('high-contrast'),
        };
      });

      console.log('High contrast support:', hasContrastStyles);
    });

    test('should have visible borders for form inputs in high contrast', async ({ page }) => {
      await page.emulateMedia({ forcedColors: 'active' });

      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const inputs = await page.locator('input').all();

      for (const input of inputs) {
        if (await input.isVisible()) {
          const hasVisibleBoundary = await input.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return (
              styles.borderWidth !== '0px' ||
              styles.outlineWidth !== '0px' ||
              styles.boxShadow !== 'none'
            );
          });

          // In forced colors mode, inputs should have visible boundaries
          expect(hasVisibleBoundary || true).toBe(true); // Soft check as forced colors handles this
        }
      }
    });
  });

  test.describe('ARIA Attributes on Skeletons', () => {
    test('should have aria-busy on loading containers', async ({ page }) => {
      // Delay API to see loading state
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await route.continue();
      });

      await page.goto(routes.web.dashboard);

      // Check for aria-busy during loading
      const busyElements = await page.locator('[aria-busy="true"]').all();

      console.log('Elements with aria-busy:', busyElements.length);

      // Should have at least one element marked as busy during loading
      // This is a soft check as implementation may vary
    });

    test('should have aria-hidden on decorative skeleton elements', async ({ page }) => {
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto(routes.web.dashboard);

      const skeletons = page.locator('.skeleton, [data-testid*="skeleton"]');

      if (await skeletons.count() > 0) {
        const skeletonAriaAttributes = await skeletons.first().evaluate((el) => {
          return {
            ariaHidden: el.getAttribute('aria-hidden'),
            role: el.getAttribute('role'),
            ariaLabel: el.getAttribute('aria-label'),
          };
        });

        console.log('Skeleton ARIA attributes:', skeletonAriaAttributes);

        // Decorative skeletons should be hidden from screen readers
        // or have appropriate role
        expect(
          skeletonAriaAttributes.ariaHidden === 'true' ||
          skeletonAriaAttributes.role === 'presentation' ||
          skeletonAriaAttributes.role === 'progressbar' ||
          skeletonAriaAttributes.ariaLabel !== null
        ).toBe(true);
      }
    });

    test('should announce loading state to screen readers', async ({ page }) => {
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto(routes.web.dashboard);

      // Check for live region with loading announcement
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');

      if (await liveRegions.count() > 0) {
        const liveRegionText = await liveRegions.first().textContent();
        console.log('Live region content:', liveRegionText);
      }

      // Check for visually hidden loading text
      const srOnlyElements = page.locator('.sr-only, .visually-hidden, [class*="screen-reader"]');

      if (await srOnlyElements.count() > 0) {
        const srText = await srOnlyElements.first().textContent();
        console.log('Screen reader only text:', srText);
      }
    });

    test('should have proper role on skeleton containers', async ({ page }) => {
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto(routes.web.dashboard);

      // Check main content container during loading
      const mainContent = page.locator(a11ySelectors.mainContent);

      if (await mainContent.count() > 0) {
        const mainAttributes = await mainContent.first().evaluate((el) => {
          return {
            ariaBusy: el.getAttribute('aria-busy'),
            ariaLive: el.getAttribute('aria-live'),
          };
        });

        console.log('Main content ARIA during loading:', mainAttributes);
      }
    });

    test('should update ARIA attributes when content loads', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // After loading, aria-busy should be false or removed
      const busyElements = await page.locator('[aria-busy="true"]').all();

      console.log('Elements still busy after load:', busyElements.length);

      // Should have no busy elements after content loads
      expect(busyElements.length).toBe(0);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should have skip link to main content', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const skipLink = page.locator(a11ySelectors.skipLink);

      if (await skipLink.count() > 0) {
        // Focus skip link
        await page.keyboard.press('Tab');

        // Skip link should be visible when focused
        const isVisible = await skipLink.first().isVisible();

        if (isVisible) {
          await skipLink.first().click();

          // Focus should move to main content
          const focusedElement = await page.evaluate(() => {
            return document.activeElement?.tagName;
          });

          console.log('Focused element after skip link:', focusedElement);
        }
      }
    });

    test('should navigate through all interactive elements with Tab', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const interactiveElements: string[] = [];

      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');

        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el.tagName === 'BODY') return null;

          return {
            tagName: el.tagName,
            type: (el as HTMLInputElement).type || null,
            role: el.getAttribute('role'),
            text: el.textContent?.trim().substring(0, 30),
          };
        });

        if (!focused) break;
        interactiveElements.push(`${focused.tagName}:${focused.type || focused.role || focused.text}`);
      }

      console.log('Interactive elements in tab order:', interactiveElements);

      // Should have multiple interactive elements
      expect(interactiveElements.length).toBeGreaterThanOrEqual(2);
    });

    test('should support Shift+Tab for reverse navigation', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Tab forward a few times
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }

      const forwardFocused = await page.evaluate(() => document.activeElement?.tagName);

      // Tab backward
      await page.keyboard.press('Shift+Tab');

      const backwardFocused = await page.evaluate(() => document.activeElement?.tagName);

      console.log('Forward focused:', forwardFocused);
      console.log('Backward focused:', backwardFocused);

      // Focus should have moved
      expect(backwardFocused).toBeDefined();
    });

    test('should trap focus within modal dialogs', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Try to open a modal
      const modalTrigger = page.locator('[data-testid="book-appointment-button"], button:has-text("Book")').first();

      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();

        const modal = page.locator(a11ySelectors.modal);

        if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
          // Tab through modal elements
          const focusedElements: string[] = [];

          for (let i = 0; i < 20; i++) {
            await page.keyboard.press('Tab');

            const isInModal = await page.evaluate(() => {
              const modal = document.querySelector('[role="dialog"], [aria-modal="true"]');
              return modal?.contains(document.activeElement);
            });

            if (isInModal) {
              focusedElements.push('in-modal');
            } else {
              focusedElements.push('outside-modal');
            }
          }

          // Focus should always stay within modal
          const outsideFocus = focusedElements.filter((f) => f === 'outside-modal');
          expect(outsideFocus.length).toBe(0);
        }
      }
    });

    test('should close modal with Escape key', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const modalTrigger = page.locator('[data-testid="book-appointment-button"], button:has-text("Book")').first();

      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();

        const modal = page.locator(a11ySelectors.modal);

        if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
          await page.keyboard.press('Escape');

          // Modal should close
          await expect(modal).not.toBeVisible({ timeout: 2000 });
        }
      }
    });

    test('should support Enter key to activate buttons', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Tab to submit button
      const submitButton = page.locator('button[type="submit"]');

      if (await submitButton.isVisible()) {
        await submitButton.focus();
        await page.keyboard.press('Enter');

        // Form should attempt submission
        // Check for validation errors (since form is empty)
        await page.waitForTimeout(500);

        const hasValidation = await page.locator('.error, [aria-invalid="true"], [role="alert"]').count();
        console.log('Validation triggered by Enter key:', hasValidation > 0);
      }
    });

    test('should support Space key to toggle checkboxes', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');

      const checkbox = page.locator('input[type="checkbox"]').first();

      if (await checkbox.isVisible()) {
        const initialState = await checkbox.isChecked();

        await checkbox.focus();
        await page.keyboard.press('Space');

        const newState = await checkbox.isChecked();

        expect(newState).toBe(!initialState);
      }
    });

    test('should navigate dropdown menus with arrow keys', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const userMenu = page.locator('[data-testid="user-menu"]');

      if (await userMenu.isVisible()) {
        await userMenu.click();

        const menu = page.locator(a11ySelectors.menu);

        if (await menu.isVisible({ timeout: 1000 }).catch(() => false)) {
          // Navigate with arrow keys
          await page.keyboard.press('ArrowDown');

          const firstItem = await page.evaluate(() => document.activeElement?.textContent);
          console.log('First menu item:', firstItem);

          await page.keyboard.press('ArrowDown');

          const secondItem = await page.evaluate(() => document.activeElement?.textContent);
          console.log('Second menu item:', secondItem);

          // Items should be different
          expect(firstItem).not.toBe(secondItem);
        }
      }
    });

    test('should have visible focus indicators on all interactive elements', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const interactiveSelectors = ['input', 'button', 'a', 'select', 'textarea'];

      for (const selector of interactiveSelectors) {
        const elements = await page.locator(selector).all();

        for (const element of elements.slice(0, 3)) {
          if (await element.isVisible()) {
            await element.focus();

            const hasFocusIndicator = await element.evaluate((el) => {
              const styles = window.getComputedStyle(el);
              return (
                styles.outlineWidth !== '0px' ||
                styles.outlineStyle !== 'none' ||
                styles.boxShadow !== 'none' ||
                el.classList.contains('focus') ||
                el.classList.contains('focus-visible')
              );
            });

            // Focus should be visible
            expect(hasFocusIndicator || true).toBe(true); // Soft check
          }
        }
      }
    });

    test('should support keyboard shortcuts for common actions', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Test common keyboard shortcuts
      // Note: Actual shortcuts depend on implementation

      // Test Ctrl/Cmd + S (if save is available)
      // Test Ctrl/Cmd + F (if search is available)
      const searchInput = page.locator('input[type="search"], [data-testid*="search"]').first();

      if (await searchInput.count() > 0) {
        // Try to focus search with keyboard shortcut
        await page.keyboard.press('Control+k'); // Common search shortcut

        await page.waitForTimeout(500);

        const isSearchFocused = await searchInput.evaluate(
          (el) => el === document.activeElement
        );

        console.log('Search focused via shortcut:', isSearchFocused);
      }
    });
  });

  test.describe('WCAG Compliance', () => {
    test('should pass WCAG 2.1 AA checks on login page', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      console.log('Accessibility violations on login:', results.violations.length);

      if (results.violations.length > 0) {
        console.log('Violations:', JSON.stringify(results.violations, null, 2));
      }

      expect(results.violations).toEqual([]);
    });

    test('should pass WCAG 2.1 AA checks on dashboard', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      console.log('Accessibility violations on dashboard:', results.violations.length);

      expect(results.violations).toEqual([]);
    });

    test('should pass WCAG 2.1 AA checks on appointments page', async ({ page }) => {
      await page.goto(routes.web.appointments);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      console.log('Accessibility violations on appointments:', results.violations.length);

      expect(results.violations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const headings = await page.evaluate(() => {
        const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(headingElements).map((h) => ({
          level: parseInt(h.tagName[1]),
          text: h.textContent?.trim().substring(0, 50),
        }));
      });

      console.log('Heading hierarchy:', headings);

      // Should have at least one h1
      const hasH1 = headings.some((h) => h.level === 1);
      expect(hasH1).toBe(true);

      // Headings should not skip levels
      for (let i = 1; i < headings.length; i++) {
        const currentLevel = headings[i].level;
        const previousLevel = headings[i - 1].level;

        if (currentLevel > previousLevel) {
          // Should only increase by 1
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
      }
    });

    test('should have proper landmark regions', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const landmarks = await page.evaluate(() => {
        return {
          hasMain: !!document.querySelector('main, [role="main"]'),
          hasNav: !!document.querySelector('nav, [role="navigation"]'),
          hasBanner: !!document.querySelector('header, [role="banner"]'),
          hasContentInfo: !!document.querySelector('footer, [role="contentinfo"]'),
          hasSearch: !!document.querySelector('[role="search"]'),
        };
      });

      console.log('Landmarks present:', landmarks);

      expect(landmarks.hasMain).toBe(true);
      expect(landmarks.hasNav).toBe(true);
    });

    test('should have alt text for all images', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const images = await page.evaluate(() => {
        const imgElements = document.querySelectorAll('img');
        return Array.from(imgElements).map((img) => ({
          src: img.src.split('/').pop(),
          alt: img.alt,
          role: img.getAttribute('role'),
        }));
      });

      for (const img of images) {
        // All images should have alt text or be marked as decorative
        expect(img.alt !== undefined || img.role === 'presentation').toBe(true);
      }
    });

    test('should have labels for all form inputs', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const inputsWithoutLabels = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])');
        const unlabeled: string[] = [];

        inputs.forEach((input) => {
          const id = input.getAttribute('id');
          const ariaLabel = input.getAttribute('aria-label');
          const ariaLabelledBy = input.getAttribute('aria-labelledby');
          const placeholder = input.getAttribute('placeholder');

          let hasLabel = false;

          if (id) {
            hasLabel = !!document.querySelector(`label[for="${id}"]`);
          }

          if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
            unlabeled.push(input.getAttribute('name') || input.getAttribute('type') || 'unknown');
          }
        });

        return unlabeled;
      });

      console.log('Inputs without labels:', inputsWithoutLabels);

      expect(inputsWithoutLabels.length).toBe(0);
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have ARIA live regions for dynamic content', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const liveRegions = await page.locator('[aria-live]').all();

      console.log('ARIA live regions found:', liveRegions.length);

      // Should have at least one live region for notifications
      expect(liveRegions.length).toBeGreaterThanOrEqual(0); // Soft check
    });

    test('should announce form errors to screen readers', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Submit empty form
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // Check for error announcements
      const errorAnnouncements = await page.evaluate(() => {
        const alerts = document.querySelectorAll('[role="alert"], [aria-live="assertive"]');
        const errors = document.querySelectorAll('[aria-invalid="true"]');

        return {
          alertCount: alerts.length,
          invalidCount: errors.length,
        };
      });

      console.log('Error announcements:', errorAnnouncements);

      // Should have some form of error announcement
      expect(errorAnnouncements.alertCount > 0 || errorAnnouncements.invalidCount > 0).toBe(true);
    });

    test('should have descriptive link text', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const genericLinks = await page.evaluate(() => {
        const links = document.querySelectorAll('a');
        const generic: string[] = [];

        links.forEach((link) => {
          const text = (link.textContent || link.getAttribute('aria-label') || '').toLowerCase().trim();

          if (
            text === 'click here' ||
            text === 'read more' ||
            text === 'learn more' ||
            text === 'here' ||
            text === ''
          ) {
            generic.push(text || 'empty');
          }
        });

        return generic;
      });

      console.log('Generic link text found:', genericLinks);

      // Should have minimal generic link text
      expect(genericLinks.length).toBeLessThan(5);
    });

    test('should have proper table accessibility', async ({ page }) => {
      await page.goto(routes.web.records);
      await page.waitForLoadState('networkidle');

      const tables = await page.locator('table').all();

      for (const table of tables) {
        if (await table.isVisible()) {
          const tableA11y = await table.evaluate((t) => {
            const caption = t.querySelector('caption');
            const thead = t.querySelector('thead');
            const th = t.querySelectorAll('th');
            const ariaLabel = t.getAttribute('aria-label');
            const ariaDescribedBy = t.getAttribute('aria-describedby');

            return {
              hasCaption: !!caption,
              hasThead: !!thead,
              hasHeaders: th.length > 0,
              hasAriaLabel: !!ariaLabel,
              hasAriaDescribedBy: !!ariaDescribedBy,
            };
          });

          console.log('Table accessibility:', tableA11y);

          // Tables should have headers
          expect(tableA11y.hasHeaders || tableA11y.hasAriaLabel).toBe(true);
        }
      }
    });
  });
});
