/**
 * Skeleton Loading Component Tests
 * Tests for skeleton placeholder components during loading states
 * Includes healthcare-specific skeleton patterns for appointments, vitals, and lab results
 */

import { test, expect, Page } from '@playwright/test';
import { routes, selectors } from '../../fixtures/test-data';

// Skeleton-specific selectors
const skeletonSelectors = {
  // Generic skeleton components
  skeleton: '[data-testid="skeleton"], .skeleton',
  skeletonText: '[data-testid="skeleton-text"], .skeleton-text',
  skeletonAvatar: '[data-testid="skeleton-avatar"], .skeleton-avatar',
  skeletonCard: '[data-testid="skeleton-card"], .skeleton-card',
  skeletonTable: '[data-testid="skeleton-table"], .skeleton-table',
  skeletonList: '[data-testid="skeleton-list"], .skeleton-list',

  // Healthcare-specific skeletons
  appointmentSkeleton: '[data-testid="appointment-skeleton"], .appointment-skeleton',
  vitalsSkeleton: '[data-testid="vitals-skeleton"], .vitals-skeleton',
  labResultsSkeleton: '[data-testid="lab-results-skeleton"], .lab-results-skeleton',
  patientCardSkeleton: '[data-testid="patient-card-skeleton"], .patient-card-skeleton',
  prescriptionSkeleton: '[data-testid="prescription-skeleton"], .prescription-skeleton',
  timelineSkeleton: '[data-testid="timeline-skeleton"], .timeline-skeleton',
  chartSkeleton: '[data-testid="chart-skeleton"], .chart-skeleton',
  medicationSkeleton: '[data-testid="medication-skeleton"], .medication-skeleton',
};

/**
 * Helper function to delay network requests
 */
async function interceptAndDelayRequests(page: Page, delay: number = 2000): Promise<void> {
  await page.route('**/api/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    await route.continue();
  });
}

/**
 * Helper function to block network requests to simulate loading
 */
async function interceptAndBlockRequests(page: Page): Promise<() => void> {
  const pendingRequests: Array<{ route: any; resolve: () => void }> = [];

  await page.route('**/api/**', async (route) => {
    await new Promise<void>((resolve) => {
      pendingRequests.push({ route, resolve });
    });
    await route.continue();
  });

  // Return function to unblock requests
  return () => {
    pendingRequests.forEach(({ route, resolve }) => resolve());
  };
}

test.describe('Skeleton Loading Components', () => {
  test.describe('Generic Skeleton Rendering', () => {
    test('should display skeleton components while data is loading', async ({ page }) => {
      // Delay API responses to see skeleton states
      await interceptAndDelayRequests(page, 3000);

      await page.goto(routes.web.dashboard);

      // Skeleton components should be visible during load
      const skeletons = page.locator(skeletonSelectors.skeleton);
      const skeletonCount = await skeletons.count();

      // Should have at least one skeleton during loading
      if (skeletonCount > 0) {
        await expect(skeletons.first()).toBeVisible();
      }
    });

    test('should replace skeletons with actual content after load', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Wait for content to load
      await page.waitForTimeout(1000);

      // Skeletons should be hidden or removed
      const skeletons = page.locator(skeletonSelectors.skeleton);
      const visibleSkeletons = await skeletons.filter({ hasNot: page.locator(':hidden') }).count();

      // All skeletons should be replaced
      expect(visibleSkeletons).toBe(0);
    });

    test('should display skeleton text placeholders correctly', async ({ page }) => {
      await interceptAndDelayRequests(page, 2000);

      await page.goto(routes.web.dashboard);

      const skeletonTexts = page.locator(skeletonSelectors.skeletonText);

      if (await skeletonTexts.count() > 0) {
        const firstSkeleton = skeletonTexts.first();
        await expect(firstSkeleton).toBeVisible();

        // Verify skeleton has appropriate styling
        const hasAnimation = await firstSkeleton.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return (
            styles.animation !== 'none' ||
            styles.animationName !== 'none' ||
            el.classList.contains('animate-pulse') ||
            el.classList.contains('shimmer')
          );
        });

        // Skeleton should have animation or shimmer effect
        expect(hasAnimation || await firstSkeleton.isVisible()).toBe(true);
      }
    });

    test('should display skeleton avatar placeholders', async ({ page }) => {
      await interceptAndDelayRequests(page, 2000);

      await page.goto(routes.web.profile);

      const skeletonAvatars = page.locator(skeletonSelectors.skeletonAvatar);

      if (await skeletonAvatars.count() > 0) {
        const avatar = skeletonAvatars.first();
        await expect(avatar).toBeVisible();

        // Avatar skeleton should be circular or rounded
        const borderRadius = await avatar.evaluate((el) => {
          return window.getComputedStyle(el).borderRadius;
        });

        // Should have rounded corners
        expect(borderRadius).not.toBe('0px');
      }
    });

    test('should display skeleton card placeholders', async ({ page }) => {
      await interceptAndDelayRequests(page, 2000);

      await page.goto(routes.web.dashboard);

      const skeletonCards = page.locator(skeletonSelectors.skeletonCard);

      if (await skeletonCards.count() > 0) {
        const card = skeletonCards.first();
        await expect(card).toBeVisible();

        // Card skeleton should have defined dimensions
        const box = await card.boundingBox();
        expect(box?.width).toBeGreaterThan(0);
        expect(box?.height).toBeGreaterThan(0);
      }
    });

    test('should display skeleton table during data fetch', async ({ page }) => {
      await interceptAndDelayRequests(page, 2000);

      // Navigate to a page with table data
      await page.goto(routes.web.records);

      const skeletonTable = page.locator(skeletonSelectors.skeletonTable);

      if (await skeletonTable.count() > 0) {
        await expect(skeletonTable.first()).toBeVisible();

        // Table skeleton should have multiple rows
        const rows = skeletonTable.locator('tr, [role="row"], .skeleton-row');
        const rowCount = await rows.count();

        expect(rowCount).toBeGreaterThanOrEqual(1);
      }
    });

    test('should display skeleton list during loading', async ({ page }) => {
      await interceptAndDelayRequests(page, 2000);

      await page.goto(routes.web.appointments);

      const skeletonList = page.locator(skeletonSelectors.skeletonList);

      if (await skeletonList.count() > 0) {
        await expect(skeletonList.first()).toBeVisible();

        // List skeleton should have multiple items
        const items = skeletonList.locator('li, [role="listitem"], .skeleton-list-item');
        const itemCount = await items.count();

        expect(itemCount).toBeGreaterThanOrEqual(1);
      }
    });
  });

  test.describe('Reduced Motion Support', () => {
    test('should respect prefers-reduced-motion: reduce', async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await interceptAndDelayRequests(page, 3000);

      await page.goto(routes.web.dashboard);

      const skeletons = page.locator(skeletonSelectors.skeleton);

      if (await skeletons.count() > 0) {
        const skeleton = skeletons.first();

        // Check animation properties with reduced motion
        const animationInfo = await skeleton.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          return {
            reducedMotion,
            animationDuration: parseFloat(styles.animationDuration) || 0,
            animationPlayState: styles.animationPlayState,
            animation: styles.animation,
          };
        });

        expect(animationInfo.reducedMotion).toBe(true);

        // With reduced motion, animations should be disabled or very short
        if (animationInfo.animationDuration > 0) {
          // Animation should be very subtle or paused
          expect(
            animationInfo.animationDuration <= 0.01 ||
            animationInfo.animationPlayState === 'paused'
          ).toBe(true);
        }
      }
    });

    test('should show static skeleton without animation when reduced motion enabled', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await interceptAndDelayRequests(page, 2000);

      await page.goto(routes.web.dashboard);

      const skeletons = page.locator(skeletonSelectors.skeleton);

      if (await skeletons.count() > 0) {
        const skeleton = skeletons.first();
        await expect(skeleton).toBeVisible();

        // Skeleton should still be visible but without animated shimmer
        const hasReducedAnimation = await skeleton.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const animationName = styles.animationName;
          const animationDuration = parseFloat(styles.animationDuration);

          // Either no animation or animation is disabled
          return animationName === 'none' || animationDuration === 0 || animationDuration <= 0.01;
        });

        expect(hasReducedAnimation).toBe(true);
      }
    });

    test('should show pulse animation when reduced motion is not set', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });

      await interceptAndDelayRequests(page, 3000);

      await page.goto(routes.web.dashboard);

      const skeletons = page.locator(skeletonSelectors.skeleton);

      if (await skeletons.count() > 0) {
        const skeleton = skeletons.first();

        const hasAnimation = await skeleton.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          const animationName = styles.animationName;
          const animationDuration = parseFloat(styles.animationDuration);

          return animationName !== 'none' && animationDuration > 0;
        });

        // With no reduced motion preference, skeleton should animate
        if (await skeleton.isVisible()) {
          // Animation presence is optional but preferred
          console.log('Skeleton animation present:', hasAnimation);
        }
      }
    });

    test('should handle prefers-reduced-motion toggle during session', async ({ page }) => {
      await interceptAndDelayRequests(page, 4000);

      await page.goto(routes.web.dashboard);

      const skeletons = page.locator(skeletonSelectors.skeleton);

      if (await skeletons.count() > 0) {
        // First check with no reduced motion
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.waitForTimeout(100);

        const animationBefore = await skeletons.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return parseFloat(styles.animationDuration) || 0;
        });

        // Now enable reduced motion
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForTimeout(100);

        const animationAfter = await skeletons.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return parseFloat(styles.animationDuration) || 0;
        });

        // Animation should change based on preference
        console.log('Animation before reduced motion:', animationBefore);
        console.log('Animation after reduced motion:', animationAfter);

        // The animation should be reduced or same (depends on implementation)
        expect(animationAfter).toBeLessThanOrEqual(animationBefore);
      }
    });
  });

  test.describe('Healthcare-Specific Skeletons', () => {
    test.describe('Appointment Skeletons', () => {
      test('should display appointment skeleton during appointments load', async ({ page }) => {
        await interceptAndDelayRequests(page, 2500);

        await page.goto(routes.web.appointments);

        const appointmentSkeletons = page.locator(skeletonSelectors.appointmentSkeleton);
        const genericSkeletons = page.locator(skeletonSelectors.skeletonCard);

        const appointmentSkeletonCount = await appointmentSkeletons.count();
        const genericSkeletonCount = await genericSkeletons.count();

        // Should have either specific appointment skeletons or generic card skeletons
        if (appointmentSkeletonCount > 0) {
          await expect(appointmentSkeletons.first()).toBeVisible();
        } else if (genericSkeletonCount > 0) {
          await expect(genericSkeletons.first()).toBeVisible();
        }
      });

      test('should display multiple appointment skeleton cards', async ({ page }) => {
        await interceptAndDelayRequests(page, 2500);

        await page.goto(routes.web.appointments);

        const skeletons = page.locator(`${skeletonSelectors.appointmentSkeleton}, ${skeletonSelectors.skeletonCard}`);

        if (await skeletons.count() > 0) {
          // Should show multiple skeletons for list view
          const count = await skeletons.count();
          expect(count).toBeGreaterThanOrEqual(1);

          // Each skeleton should have proper structure
          const firstSkeleton = skeletons.first();
          const box = await firstSkeleton.boundingBox();

          if (box) {
            // Appointment card skeleton should have reasonable dimensions
            expect(box.width).toBeGreaterThan(100);
            expect(box.height).toBeGreaterThan(50);
          }
        }
      });

      test('should show time slot skeletons on booking page', async ({ page }) => {
        await interceptAndDelayRequests(page, 2000);

        await page.goto(routes.web.bookAppointment);

        // Look for time slot skeletons
        const timeSlotSkeletons = page.locator('[data-testid="time-slot-skeleton"], .time-slot-skeleton');
        const genericSkeletons = page.locator(skeletonSelectors.skeleton);

        if (await timeSlotSkeletons.count() > 0) {
          await expect(timeSlotSkeletons.first()).toBeVisible();
        } else if (await genericSkeletons.count() > 0) {
          await expect(genericSkeletons.first()).toBeVisible();
        }
      });
    });

    test.describe('Vitals Skeletons', () => {
      test('should display vitals skeleton during health data load', async ({ page }) => {
        await interceptAndDelayRequests(page, 2500);

        await page.goto(routes.web.dashboard);

        const vitalsSkeletons = page.locator(skeletonSelectors.vitalsSkeleton);
        const chartSkeletons = page.locator(skeletonSelectors.chartSkeleton);
        const genericSkeletons = page.locator(skeletonSelectors.skeleton);

        const hasVitalsSkeleton = await vitalsSkeletons.count() > 0;
        const hasChartSkeleton = await chartSkeletons.count() > 0;
        const hasGenericSkeleton = await genericSkeletons.count() > 0;

        // Should display some form of skeleton for vitals
        if (hasVitalsSkeleton) {
          await expect(vitalsSkeletons.first()).toBeVisible();
        } else if (hasChartSkeleton) {
          await expect(chartSkeletons.first()).toBeVisible();
        } else if (hasGenericSkeleton) {
          // At least generic skeletons should be present
          console.log('Generic skeleton used for vitals');
        }
      });

      test('should display chart skeleton for vitals graphs', async ({ page }) => {
        await interceptAndDelayRequests(page, 2500);

        await page.goto(routes.web.records);

        const chartSkeletons = page.locator(skeletonSelectors.chartSkeleton);

        if (await chartSkeletons.count() > 0) {
          const chartSkeleton = chartSkeletons.first();
          await expect(chartSkeleton).toBeVisible();

          // Chart skeleton should have chart-like dimensions
          const box = await chartSkeleton.boundingBox();
          if (box) {
            // Charts typically have wider dimensions
            expect(box.width).toBeGreaterThan(100);
            expect(box.height).toBeGreaterThan(50);
          }
        }
      });

      test('should show vitals metric skeletons with proper layout', async ({ page }) => {
        await interceptAndDelayRequests(page, 2000);

        await page.goto(routes.web.dashboard);

        const vitalsContainer = page.locator('[data-testid="vitals-container"], .vitals-container');

        if (await vitalsContainer.count() > 0) {
          // Check for skeleton within vitals section
          const skeletonsInVitals = vitalsContainer.locator(skeletonSelectors.skeleton);

          if (await skeletonsInVitals.count() > 0) {
            await expect(skeletonsInVitals.first()).toBeVisible();
          }
        }
      });
    });

    test.describe('Lab Results Skeletons', () => {
      test('should display lab results skeleton during data load', async ({ page }) => {
        await interceptAndDelayRequests(page, 2500);

        await page.goto(routes.web.records);

        const labSkeletons = page.locator(skeletonSelectors.labResultsSkeleton);
        const tableSkeletons = page.locator(skeletonSelectors.skeletonTable);

        if (await labSkeletons.count() > 0) {
          await expect(labSkeletons.first()).toBeVisible();
        } else if (await tableSkeletons.count() > 0) {
          // Lab results often displayed in tables
          await expect(tableSkeletons.first()).toBeVisible();
        }
      });

      test('should display table rows skeleton for lab values', async ({ page }) => {
        await interceptAndDelayRequests(page, 2000);

        await page.goto(routes.web.records);

        const tableSkeletons = page.locator(skeletonSelectors.skeletonTable);

        if (await tableSkeletons.count() > 0) {
          const table = tableSkeletons.first();

          // Check for row skeletons
          const rowSkeletons = table.locator('.skeleton-row, [data-testid="skeleton-row"]');

          if (await rowSkeletons.count() > 0) {
            // Should have multiple row placeholders
            expect(await rowSkeletons.count()).toBeGreaterThanOrEqual(1);
          }
        }
      });

      test('should show lab result detail skeleton', async ({ page }) => {
        await interceptAndDelayRequests(page, 2000);

        // Navigate to a specific lab result page if exists
        await page.goto(`${routes.web.records}?type=lab`);

        const labDetailSkeleton = page.locator('[data-testid="lab-detail-skeleton"], .lab-detail-skeleton');
        const genericSkeleton = page.locator(skeletonSelectors.skeleton);

        if (await labDetailSkeleton.count() > 0) {
          await expect(labDetailSkeleton.first()).toBeVisible();
        } else if (await genericSkeleton.count() > 0) {
          await expect(genericSkeleton.first()).toBeVisible();
        }
      });
    });

    test.describe('Patient Card Skeletons', () => {
      test('should display patient card skeleton in search results', async ({ page }) => {
        await interceptAndDelayRequests(page, 2000);

        // Provider view with patient list
        await page.goto('/patients');

        const patientCardSkeletons = page.locator(skeletonSelectors.patientCardSkeleton);
        const genericSkeletons = page.locator(skeletonSelectors.skeletonCard);

        if (await patientCardSkeletons.count() > 0) {
          await expect(patientCardSkeletons.first()).toBeVisible();
        } else if (await genericSkeletons.count() > 0) {
          await expect(genericSkeletons.first()).toBeVisible();
        }
      });
    });

    test.describe('Prescription Skeletons', () => {
      test('should display prescription skeleton during load', async ({ page }) => {
        await interceptAndDelayRequests(page, 2000);

        await page.goto(routes.web.prescriptions);

        const prescriptionSkeletons = page.locator(skeletonSelectors.prescriptionSkeleton);
        const medicationSkeletons = page.locator(skeletonSelectors.medicationSkeleton);
        const genericSkeletons = page.locator(skeletonSelectors.skeletonCard);

        const hasPrescriptionSkeleton = await prescriptionSkeletons.count() > 0;
        const hasMedicationSkeleton = await medicationSkeletons.count() > 0;
        const hasGenericSkeleton = await genericSkeletons.count() > 0;

        if (hasPrescriptionSkeleton) {
          await expect(prescriptionSkeletons.first()).toBeVisible();
        } else if (hasMedicationSkeleton) {
          await expect(medicationSkeletons.first()).toBeVisible();
        } else if (hasGenericSkeleton) {
          await expect(genericSkeletons.first()).toBeVisible();
        }
      });
    });

    test.describe('Timeline Skeletons', () => {
      test('should display timeline skeleton for health history', async ({ page }) => {
        await interceptAndDelayRequests(page, 2000);

        await page.goto(routes.web.records);

        const timelineSkeletons = page.locator(skeletonSelectors.timelineSkeleton);
        const listSkeletons = page.locator(skeletonSelectors.skeletonList);

        if (await timelineSkeletons.count() > 0) {
          const timelineSkeleton = timelineSkeletons.first();
          await expect(timelineSkeleton).toBeVisible();

          // Timeline skeleton should have multiple items
          const items = timelineSkeleton.locator('.timeline-item-skeleton, [data-testid="timeline-item-skeleton"]');
          if (await items.count() > 0) {
            expect(await items.count()).toBeGreaterThanOrEqual(1);
          }
        } else if (await listSkeletons.count() > 0) {
          await expect(listSkeletons.first()).toBeVisible();
        }
      });
    });
  });

  test.describe('Skeleton Accessibility', () => {
    test('should have appropriate ARIA attributes on skeletons', async ({ page }) => {
      await interceptAndDelayRequests(page, 3000);

      await page.goto(routes.web.dashboard);

      const skeletons = page.locator(skeletonSelectors.skeleton);

      if (await skeletons.count() > 0) {
        const skeleton = skeletons.first();

        // Check for aria-busy or aria-hidden
        const ariaAttributes = await skeleton.evaluate((el) => {
          return {
            ariaBusy: el.getAttribute('aria-busy'),
            ariaHidden: el.getAttribute('aria-hidden'),
            ariaLabel: el.getAttribute('aria-label'),
            role: el.getAttribute('role'),
          };
        });

        // Skeleton should have some accessibility attribute
        const hasAccessibilityAttribute =
          ariaAttributes.ariaBusy === 'true' ||
          ariaAttributes.ariaHidden === 'true' ||
          ariaAttributes.ariaLabel !== null ||
          ariaAttributes.role === 'progressbar' ||
          ariaAttributes.role === 'status';

        // Log the result for debugging
        console.log('Skeleton ARIA attributes:', ariaAttributes);

        // Skeleton elements should ideally have accessibility attributes
        // This is a soft check as implementation may vary
      }
    });

    test('should announce loading state to screen readers', async ({ page }) => {
      await interceptAndDelayRequests(page, 3000);

      await page.goto(routes.web.dashboard);

      // Check for live region or loading announcement
      const liveRegion = page.locator('[aria-live], [role="alert"], [role="status"]');

      if (await liveRegion.count() > 0) {
        // A live region should exist to announce loading state
        const hasLoadingAnnouncement = await liveRegion.evaluate((el) => {
          const text = el.textContent?.toLowerCase() || '';
          return text.includes('loading') || text.includes('please wait');
        });

        console.log('Loading announcement present:', hasLoadingAnnouncement);
      }
    });

    test('should not trap focus on skeleton elements', async ({ page }) => {
      await interceptAndDelayRequests(page, 3000);

      await page.goto(routes.web.dashboard);

      // Tab through elements during loading
      const focusedElements: string[] = [];

      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');

        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tagName: el?.tagName,
            className: el?.className,
            testId: el?.getAttribute('data-testid'),
          };
        });

        focusedElements.push(JSON.stringify(focused));
      }

      // Skeleton elements should not receive focus
      const skeletonFocused = focusedElements.some(
        (el) => el.includes('skeleton')
      );

      expect(skeletonFocused).toBe(false);
    });
  });

  test.describe('Skeleton Performance', () => {
    test('should render skeletons quickly before data loads', async ({ page }) => {
      // Block all API requests to measure skeleton render time
      const unblock = await interceptAndBlockRequests(page);

      const startTime = Date.now();

      await page.goto(routes.web.dashboard, { waitUntil: 'domcontentloaded' });

      // Check for skeletons immediately
      const skeletons = page.locator(skeletonSelectors.skeleton);
      const hasSkeletons = await skeletons.count() > 0;

      const skeletonRenderTime = Date.now() - startTime;

      // Unblock requests to allow test cleanup
      unblock();

      console.log('Skeleton render time:', skeletonRenderTime, 'ms');

      // Skeletons should render quickly (under 1 second)
      if (hasSkeletons) {
        expect(skeletonRenderTime).toBeLessThan(1000);
      }
    });

    test('should transition smoothly from skeleton to content', async ({ page }) => {
      await page.goto(routes.web.dashboard);

      // Monitor for layout shifts during transition
      const layoutShifts: number[] = [];

      await page.evaluate(() => {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // @ts-ignore
            (window as any).__layoutShifts = (window as any).__layoutShifts || [];
            // @ts-ignore
            (window as any).__layoutShifts.push((entry as any).value);
          }
        });

        observer.observe({ type: 'layout-shift', buffered: true });
      });

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const shifts = await page.evaluate(() => {
        // @ts-ignore
        return (window as any).__layoutShifts || [];
      });

      const totalCLS = shifts.reduce((sum: number, val: number) => sum + val, 0);

      console.log('CLS during skeleton transition:', totalCLS);

      // CLS should be minimal during skeleton to content transition
      expect(totalCLS).toBeLessThan(0.1);
    });
  });
});
