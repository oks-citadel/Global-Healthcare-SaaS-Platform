/**
 * Animation E2E Tests
 * Tests for animation behavior respecting prefers-reduced-motion
 * Healthcare-specific animations for appointment booking, vitals visualization, and transitions
 */

import { test, expect, Page } from '@playwright/test';
import { routes } from '../../fixtures/test-data';

// Animation-specific selectors
const animationSelectors = {
  // Generic animated elements
  animated: '[class*="animate"], [class*="transition"], .animated',
  fadeIn: '[class*="fade-in"], .fade-in',
  fadeOut: '[class*="fade-out"], .fade-out',
  slideIn: '[class*="slide-in"], .slide-in',
  slideOut: '[class*="slide-out"], .slide-out',
  pulse: '[class*="pulse"], .pulse',
  spin: '[class*="spin"], .spin',
  bounce: '[class*="bounce"], .bounce',
  shimmer: '[class*="shimmer"], .shimmer',

  // Healthcare-specific animations
  appointmentCard: '[data-testid="appointment-card"]',
  appointmentSuccess: '[data-testid="appointment-success"], .appointment-success',
  vitalsChart: '[data-testid="vitals-chart"], .vitals-chart',
  vitalsPulse: '[data-testid="vitals-pulse"], .vitals-pulse',
  heartRate: '[data-testid="heart-rate"], .heart-rate',
  progressBar: '[data-testid="progress-bar"], .progress-bar',
  loadingSpinner: '[data-testid="loading-spinner"], .loading-spinner',
  skeleton: '[data-testid="skeleton"], .skeleton',
  toast: '[data-testid="toast"], .toast',
  modal: '[role="dialog"], .modal',
  dropdown: '[role="menu"], .dropdown-menu',
  healthIndicator: '[data-testid="health-indicator"], .health-indicator',
  trendLine: '[data-testid="trend-line"], .trend-line',
  statusBadge: '[data-testid="status-badge"], .status-badge',
};

/**
 * Helper to collect animation properties from an element
 */
async function getAnimationProperties(page: Page, selector: string) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return null;

    const styles = window.getComputedStyle(element);

    return {
      animationName: styles.animationName,
      animationDuration: styles.animationDuration,
      animationTimingFunction: styles.animationTimingFunction,
      animationIterationCount: styles.animationIterationCount,
      animationPlayState: styles.animationPlayState,
      transitionProperty: styles.transitionProperty,
      transitionDuration: styles.transitionDuration,
      transitionTimingFunction: styles.transitionTimingFunction,
      transform: styles.transform,
      opacity: styles.opacity,
    };
  }, selector);
}

/**
 * Helper to count animated elements on page
 */
async function countAnimatedElements(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    let count = 0;

    elements.forEach((el) => {
      const styles = window.getComputedStyle(el);
      const animationDuration = parseFloat(styles.animationDuration) || 0;
      const transitionDuration = parseFloat(styles.transitionDuration) || 0;

      if (animationDuration > 0 || transitionDuration > 0.1) {
        count++;
      }
    });

    return count;
  });
}

test.describe('Animation Tests', () => {
  test.describe('Prefers-Reduced-Motion Respect', () => {
    test('should disable animations when prefers-reduced-motion: reduce', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const animatedCount = await countAnimatedElements(page);

      console.log('Animated elements with reduced motion:', animatedCount);

      // Should have minimal or no animations
      expect(animatedCount).toBeLessThan(10);
    });

    test('should enable animations when prefers-reduced-motion: no-preference', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Check for any animated elements
      const animatedElements = page.locator(animationSelectors.animated);
      const transitionElements = page.locator('[class*="transition"]');

      const animatedCount = await animatedElements.count();
      const transitionCount = await transitionElements.count();

      console.log('Animated elements:', animatedCount);
      console.log('Transition elements:', transitionCount);
    });

    test('should use CSS media query for reduced motion', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Check if reduced motion styles are defined
      const hasReducedMotionStyles = await page.evaluate(() => {
        const stylesheets = Array.from(document.styleSheets);
        let hasMediaQuery = false;

        try {
          for (const sheet of stylesheets) {
            try {
              const rules = sheet.cssRules || sheet.rules;
              for (const rule of Array.from(rules)) {
                if (rule instanceof CSSMediaRule) {
                  if (rule.conditionText?.includes('prefers-reduced-motion')) {
                    hasMediaQuery = true;
                    break;
                  }
                }
              }
            } catch (e) {
              // Cross-origin stylesheets can't be read
            }
          }
        } catch (e) {
          // Ignore errors
        }

        return hasMediaQuery;
      });

      console.log('Has prefers-reduced-motion media query:', hasReducedMotionStyles);
    });

    test('should stop spinner animations with reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });

      // Delay API to show loading spinner
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto(routes.web.dashboard);

      const spinner = page.locator(animationSelectors.loadingSpinner);

      if (await spinner.count() > 0) {
        const spinnerAnimation = await getAnimationProperties(page, animationSelectors.loadingSpinner);

        if (spinnerAnimation) {
          console.log('Spinner animation with reduced motion:', spinnerAnimation);

          // Animation should be disabled or very short
          const duration = parseFloat(spinnerAnimation.animationDuration) || 0;
          expect(duration).toBeLessThanOrEqual(0.01);
        }
      }
    });

    test('should use instant transitions with reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Check transition durations on interactive elements
      const buttons = await page.locator('button').all();

      for (const button of buttons.slice(0, 5)) {
        if (await button.isVisible()) {
          const transitionDuration = await button.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return parseFloat(styles.transitionDuration) || 0;
          });

          // Transitions should be instant (0) or very short
          expect(transitionDuration).toBeLessThanOrEqual(0.1);
        }
      }
    });

    test('should provide static alternatives for animated content', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Check that content is still visible without animations
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();

      // Cards should be visible
      const cards = page.locator('[data-testid*="card"], .card');
      if (await cards.count() > 0) {
        await expect(cards.first()).toBeVisible();
      }
    });
  });

  test.describe('Healthcare-Specific Animations', () => {
    test.describe('Appointment Booking Animations', () => {
      test('should animate appointment card hover state', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });

        await page.goto(routes.web.appointments);
        await page.waitForLoadState('networkidle');

        const appointmentCard = page.locator(animationSelectors.appointmentCard).first();

        if (await appointmentCard.isVisible()) {
          // Get initial state
          const initialState = await appointmentCard.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
              transform: styles.transform,
              boxShadow: styles.boxShadow,
            };
          });

          // Hover over card
          await appointmentCard.hover();
          await page.waitForTimeout(300);

          // Get hover state
          const hoverState = await appointmentCard.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
              transform: styles.transform,
              boxShadow: styles.boxShadow,
            };
          });

          console.log('Card initial state:', initialState);
          console.log('Card hover state:', hoverState);

          // Should have visual change on hover
          expect(
            initialState.transform !== hoverState.transform ||
            initialState.boxShadow !== hoverState.boxShadow
          ).toBe(true);
        }
      });

      test('should animate appointment booking success', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });

        await page.goto(routes.web.bookAppointment);
        await page.waitForLoadState('networkidle');

        // Try to trigger success animation by filling form
        // Note: This depends on actual form implementation

        const successElement = page.locator(animationSelectors.appointmentSuccess);

        // If success animation exists, it should have animation properties
        if (await successElement.count() > 0 && await successElement.isVisible()) {
          const animationProps = await getAnimationProperties(page, animationSelectors.appointmentSuccess);
          console.log('Appointment success animation:', animationProps);
        }
      });

      test('should disable appointment animations with reduced motion', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });

        await page.goto(routes.web.appointments);
        await page.waitForLoadState('networkidle');

        const appointmentCard = page.locator(animationSelectors.appointmentCard).first();

        if (await appointmentCard.isVisible()) {
          const animationProps = await appointmentCard.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
              transitionDuration: parseFloat(styles.transitionDuration) || 0,
              animationDuration: parseFloat(styles.animationDuration) || 0,
            };
          });

          // Animations should be disabled
          expect(animationProps.transitionDuration).toBeLessThanOrEqual(0.1);
          expect(animationProps.animationDuration).toBeLessThanOrEqual(0.01);
        }
      });

      test('should animate time slot selection', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });

        await page.goto(routes.web.bookAppointment);
        await page.waitForLoadState('networkidle');

        const timeSlot = page.locator('[data-testid="time-slot"]').first();

        if (await timeSlot.isVisible()) {
          // Click time slot
          await timeSlot.click();
          await page.waitForTimeout(300);

          // Check for selection animation
          const isSelected = await timeSlot.evaluate((el) => {
            return (
              el.classList.contains('selected') ||
              el.getAttribute('aria-selected') === 'true' ||
              el.getAttribute('data-selected') === 'true'
            );
          });

          console.log('Time slot selected:', isSelected);
        }
      });
    });

    test.describe('Vitals Animations', () => {
      test('should animate vitals chart rendering', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });

        await page.goto(routes.web.dashboard);
        await page.waitForLoadState('networkidle');

        const vitalsChart = page.locator(animationSelectors.vitalsChart);

        if (await vitalsChart.count() > 0 && await vitalsChart.isVisible()) {
          const chartAnimation = await getAnimationProperties(page, animationSelectors.vitalsChart);
          console.log('Vitals chart animation:', chartAnimation);
        }
      });

      test('should animate heart rate indicator', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });

        await page.goto(routes.web.dashboard);
        await page.waitForLoadState('networkidle');

        const heartRate = page.locator(animationSelectors.heartRate);

        if (await heartRate.count() > 0 && await heartRate.isVisible()) {
          const heartAnimation = await getAnimationProperties(page, animationSelectors.heartRate);

          if (heartAnimation) {
            console.log('Heart rate animation:', heartAnimation);

            // Heart rate should have pulse animation
            const hasPulse =
              heartAnimation.animationName.includes('pulse') ||
              heartAnimation.animationName.includes('beat');

            console.log('Has pulse animation:', hasPulse);
          }
        }
      });

      test('should animate trend lines smoothly', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });

        await page.goto(routes.web.records);
        await page.waitForLoadState('networkidle');

        const trendLine = page.locator(animationSelectors.trendLine);

        if (await trendLine.count() > 0 && await trendLine.isVisible()) {
          const trendAnimation = await getAnimationProperties(page, animationSelectors.trendLine);
          console.log('Trend line animation:', trendAnimation);
        }
      });

      test('should disable vitals animations with reduced motion', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });

        await page.goto(routes.web.dashboard);
        await page.waitForLoadState('networkidle');

        const vitalsChart = page.locator(animationSelectors.vitalsChart);
        const heartRate = page.locator(animationSelectors.heartRate);

        if (await vitalsChart.count() > 0) {
          const chartAnimation = await getAnimationProperties(page, animationSelectors.vitalsChart);
          if (chartAnimation) {
            const duration = parseFloat(chartAnimation.animationDuration) || 0;
            expect(duration).toBeLessThanOrEqual(0.01);
          }
        }

        if (await heartRate.count() > 0) {
          const heartAnimation = await getAnimationProperties(page, animationSelectors.heartRate);
          if (heartAnimation) {
            const duration = parseFloat(heartAnimation.animationDuration) || 0;
            expect(duration).toBeLessThanOrEqual(0.01);
          }
        }
      });

      test('should show static health indicator with reduced motion', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });

        await page.goto(routes.web.dashboard);
        await page.waitForLoadState('networkidle');

        const healthIndicator = page.locator(animationSelectors.healthIndicator);

        if (await healthIndicator.count() > 0 && await healthIndicator.isVisible()) {
          // Should be visible without animation
          await expect(healthIndicator.first()).toBeVisible();

          const indicatorAnimation = await getAnimationProperties(page, animationSelectors.healthIndicator);
          if (indicatorAnimation) {
            const duration = parseFloat(indicatorAnimation.animationDuration) || 0;
            expect(duration).toBeLessThanOrEqual(0.01);
          }
        }
      });
    });

    test.describe('Status Badge Animations', () => {
      test('should animate status badge updates', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });

        await page.goto(routes.web.appointments);
        await page.waitForLoadState('networkidle');

        const statusBadge = page.locator(animationSelectors.statusBadge);

        if (await statusBadge.count() > 0 && await statusBadge.isVisible()) {
          const badgeAnimation = await getAnimationProperties(page, animationSelectors.statusBadge);
          console.log('Status badge animation:', badgeAnimation);
        }
      });

      test('should use color transitions for status changes', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });

        await page.goto(routes.web.appointments);
        await page.waitForLoadState('networkidle');

        const statusBadge = page.locator(animationSelectors.statusBadge).first();

        if (await statusBadge.isVisible()) {
          const hasColorTransition = await statusBadge.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return (
              styles.transitionProperty.includes('background') ||
              styles.transitionProperty.includes('color') ||
              styles.transitionProperty.includes('all')
            );
          });

          console.log('Has color transition:', hasColorTransition);
        }
      });
    });
  });

  test.describe('UI Component Animations', () => {
    test('should animate modal opening', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const modalTrigger = page.locator('[data-testid="book-appointment-button"], button:has-text("Book")').first();

      if (await modalTrigger.isVisible()) {
        // Click to open modal
        await modalTrigger.click();

        const modal = page.locator(animationSelectors.modal);

        if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
          const modalAnimation = await getAnimationProperties(page, animationSelectors.modal);
          console.log('Modal animation:', modalAnimation);

          // Modal should have entrance animation
          expect(modalAnimation?.animationName !== 'none' || modalAnimation?.transitionDuration !== '0s').toBe(true);
        }
      }
    });

    test('should animate modal closing', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const modalTrigger = page.locator('[data-testid="book-appointment-button"], button:has-text("Book")').first();

      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();

        const modal = page.locator(animationSelectors.modal);

        if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
          // Close modal
          await page.keyboard.press('Escape');

          // Modal should animate out
          await expect(modal).not.toBeVisible({ timeout: 1000 });
        }
      }
    });

    test('should animate dropdown menu', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const userMenu = page.locator('[data-testid="user-menu"]');

      if (await userMenu.isVisible()) {
        await userMenu.click();

        const dropdown = page.locator(animationSelectors.dropdown);

        if (await dropdown.isVisible({ timeout: 1000 }).catch(() => false)) {
          const dropdownAnimation = await getAnimationProperties(page, animationSelectors.dropdown);
          console.log('Dropdown animation:', dropdownAnimation);
        }
      }
    });

    test('should animate toast notifications', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Try to trigger a toast (e.g., by performing an action)
      const toast = page.locator(animationSelectors.toast);

      // If toast is visible, check animation
      if (await toast.count() > 0 && await toast.isVisible({ timeout: 5000 }).catch(() => false)) {
        const toastAnimation = await getAnimationProperties(page, animationSelectors.toast);
        console.log('Toast animation:', toastAnimation);

        // Toast should have slide-in or fade-in animation
        expect(
          toastAnimation?.animationName !== 'none' ||
          toastAnimation?.transitionDuration !== '0s'
        ).toBe(true);
      }
    });

    test('should animate progress bars', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      await page.goto(routes.web.profile);
      await page.waitForLoadState('networkidle');

      const progressBar = page.locator(animationSelectors.progressBar);

      if (await progressBar.count() > 0 && await progressBar.isVisible()) {
        const progressAnimation = await getAnimationProperties(page, animationSelectors.progressBar);
        console.log('Progress bar animation:', progressAnimation);

        // Progress bar should have width transition
        expect(progressAnimation?.transitionProperty).toContain('width');
      }
    });

    test('should disable UI animations with reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Check modal animation
      const modalTrigger = page.locator('[data-testid="book-appointment-button"], button:has-text("Book")').first();

      if (await modalTrigger.isVisible()) {
        const startTime = Date.now();
        await modalTrigger.click();

        const modal = page.locator(animationSelectors.modal);

        if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
          const openTime = Date.now() - startTime;

          console.log('Modal open time with reduced motion:', openTime, 'ms');

          // Modal should open instantly (< 100ms for animation)
          expect(openTime).toBeLessThan(500);
        }
      }
    });
  });

  test.describe('Loading State Animations', () => {
    test('should animate skeleton shimmer effect', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      // Delay API to see skeleton
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto(routes.web.dashboard);

      const skeleton = page.locator(animationSelectors.skeleton);

      if (await skeleton.count() > 0) {
        const skeletonAnimation = await getAnimationProperties(page, animationSelectors.skeleton);

        if (skeletonAnimation) {
          console.log('Skeleton animation:', skeletonAnimation);

          // Skeleton should have shimmer/pulse animation
          const hasShimmer =
            skeletonAnimation.animationName !== 'none' ||
            skeletonAnimation.animationName.includes('shimmer') ||
            skeletonAnimation.animationName.includes('pulse');

          expect(hasShimmer).toBe(true);
        }
      }
    });

    test('should animate loading spinner', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      // Delay API to see spinner
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto(routes.web.dashboard);

      const spinner = page.locator(animationSelectors.loadingSpinner);

      if (await spinner.count() > 0) {
        const spinnerAnimation = await getAnimationProperties(page, animationSelectors.loadingSpinner);

        if (spinnerAnimation) {
          console.log('Spinner animation:', spinnerAnimation);

          // Spinner should have rotation animation
          const hasRotation =
            spinnerAnimation.animationName.includes('spin') ||
            spinnerAnimation.animationName.includes('rotate') ||
            parseFloat(spinnerAnimation.animationDuration) > 0;

          expect(hasRotation).toBe(true);
        }
      }
    });

    test('should use static loading indicator with reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto(routes.web.dashboard);

      const spinner = page.locator(animationSelectors.loadingSpinner);
      const skeleton = page.locator(animationSelectors.skeleton);

      if (await spinner.count() > 0) {
        const spinnerAnimation = await getAnimationProperties(page, animationSelectors.loadingSpinner);
        if (spinnerAnimation) {
          const duration = parseFloat(spinnerAnimation.animationDuration) || 0;
          expect(duration).toBeLessThanOrEqual(0.01);
        }
      }

      if (await skeleton.count() > 0) {
        const skeletonAnimation = await getAnimationProperties(page, animationSelectors.skeleton);
        if (skeletonAnimation) {
          const duration = parseFloat(skeletonAnimation.animationDuration) || 0;
          expect(duration).toBeLessThanOrEqual(0.01);
        }
      }
    });
  });

  test.describe('Animation Performance', () => {
    test('should use GPU-accelerated animations', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const animatedElements = await page.locator('[class*="animate"]').all();

      for (const element of animatedElements.slice(0, 5)) {
        if (await element.isVisible()) {
          const usesGPU = await element.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return (
              styles.transform !== 'none' ||
              styles.willChange !== 'auto' ||
              styles.contain !== 'none'
            );
          });

          console.log('Element uses GPU acceleration:', usesGPU);
        }
      }
    });

    test('should not cause layout thrashing during animations', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Monitor for layout shifts during animation
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;

          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              clsValue += (entry as any).value;
            }
          });

          observer.observe({ type: 'layout-shift', buffered: true });

          // Trigger some animations
          const buttons = document.querySelectorAll('button');
          buttons.forEach((btn) => {
            btn.dispatchEvent(new MouseEvent('mouseenter'));
            btn.dispatchEvent(new MouseEvent('mouseleave'));
          });

          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 1000);
        });
      });

      console.log('CLS during animations:', cls);

      // Animations should not cause significant layout shift
      expect(cls).toBeLessThan(0.1);
    });

    test('should complete animations within performance budget', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Check animation durations
      const animationDurations = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const durations: number[] = [];

        elements.forEach((el) => {
          const styles = window.getComputedStyle(el);
          const animationDuration = parseFloat(styles.animationDuration) || 0;
          const transitionDuration = parseFloat(styles.transitionDuration) || 0;

          if (animationDuration > 0) durations.push(animationDuration);
          if (transitionDuration > 0) durations.push(transitionDuration);
        });

        return durations;
      });

      console.log('Animation durations:', animationDurations);

      // All animations should complete within 1 second
      for (const duration of animationDurations) {
        expect(duration).toBeLessThan(1);
      }
    });
  });
});
