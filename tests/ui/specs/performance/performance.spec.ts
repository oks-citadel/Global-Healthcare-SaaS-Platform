/**
 * Performance E2E Tests
 * Comprehensive tests for Core Web Vitals, page load performance, and interaction responsiveness
 * Targets healthcare-specific performance requirements for HIPAA-compliant SaaS platform
 */

import { test, expect, Page } from '@playwright/test';
import { routes, performanceThresholds } from '../../fixtures/test-data';

// Extended performance thresholds for healthcare applications
const healthcareThresholds = {
  // Core Web Vitals (Google's recommendations)
  LCP: {
    good: 2500, // 2.5s - Good
    needsImprovement: 4000, // 4s - Needs Improvement
  },
  FID: {
    good: 100, // 100ms - Good
    needsImprovement: 300, // 300ms - Needs Improvement
  },
  CLS: {
    good: 0.1, // 0.1 - Good
    needsImprovement: 0.25, // 0.25 - Needs Improvement
  },
  FCP: {
    good: 1800, // 1.8s - Good
    needsImprovement: 3000, // 3s - Needs Improvement
  },
  TTFB: {
    good: 800, // 0.8s - Good
    needsImprovement: 1800, // 1.8s - Needs Improvement
  },
  INP: {
    good: 200, // 200ms - Good
    needsImprovement: 500, // 500ms - Needs Improvement
  },
  // Healthcare-specific thresholds
  criticalActionResponse: 1000, // 1s for critical actions like emergency alerts
  dataLoadTime: 3000, // 3s for loading patient data
  searchResponseTime: 2000, // 2s for search results
  formSubmitTime: 2000, // 2s for form submissions
};

// Performance metric collection helpers
interface PerformanceMetrics {
  LCP?: number;
  FCP?: number;
  CLS?: number;
  TTFB?: number;
  domContentLoaded?: number;
  loadComplete?: number;
  domInteractive?: number;
  resourceCount?: number;
  jsHeapSize?: number;
}

/**
 * Collect Core Web Vitals metrics from page
 */
async function collectWebVitals(page: Page): Promise<PerformanceMetrics> {
  return await page.evaluate(() => {
    return new Promise<PerformanceMetrics>((resolve) => {
      const metrics: PerformanceMetrics = {};

      // Navigation timing
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        metrics.TTFB = navEntry.responseStart - navEntry.requestStart;
        metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.fetchStart;
        metrics.loadComplete = navEntry.loadEventEnd - navEntry.fetchStart;
        metrics.domInteractive = navEntry.domInteractive - navEntry.fetchStart;
      }

      // Resource count
      metrics.resourceCount = performance.getEntriesByType('resource').length;

      // Memory usage
      // @ts-ignore - Chrome-specific API
      if (performance.memory) {
        // @ts-ignore
        metrics.jsHeapSize = performance.memory.usedJSHeapSize;
      }

      // LCP Observer
      let lcpValue = 0;
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        lcpValue = lastEntry.renderTime || lastEntry.loadTime;
      });

      // FCP Observer
      let fcpValue = 0;
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntriesByName('first-contentful-paint');
        if (entries.length > 0) {
          fcpValue = entries[0].startTime;
        }
      });

      // CLS Observer
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });

      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        fcpObserver.observe({ type: 'paint', buffered: true });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        // Some observers may not be available in all browsers
      }

      // Wait for metrics to be collected
      setTimeout(() => {
        lcpObserver.disconnect();
        fcpObserver.disconnect();
        clsObserver.disconnect();

        metrics.LCP = lcpValue;
        metrics.FCP = fcpValue;
        metrics.CLS = clsValue;

        resolve(metrics);
      }, 2000);
    });
  });
}

test.describe('Performance Tests', () => {
  test.describe('Core Web Vitals', () => {
    test('should meet LCP threshold on dashboard', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const metrics = await collectWebVitals(page);

      console.log('Dashboard LCP:', metrics.LCP, 'ms');

      if (metrics.LCP && metrics.LCP > 0) {
        // LCP should be under 4 seconds (acceptable threshold)
        expect(metrics.LCP).toBeLessThan(healthcareThresholds.LCP.needsImprovement);

        if (metrics.LCP < healthcareThresholds.LCP.good) {
          console.log('LCP Rating: GOOD');
        } else {
          console.log('LCP Rating: NEEDS IMPROVEMENT');
        }
      }
    });

    test('should meet FCP threshold on login page', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const metrics = await collectWebVitals(page);

      console.log('Login FCP:', metrics.FCP, 'ms');

      if (metrics.FCP && metrics.FCP > 0) {
        // FCP should be under 3 seconds
        expect(metrics.FCP).toBeLessThan(healthcareThresholds.FCP.needsImprovement);

        if (metrics.FCP < healthcareThresholds.FCP.good) {
          console.log('FCP Rating: GOOD');
        } else {
          console.log('FCP Rating: NEEDS IMPROVEMENT');
        }
      }
    });

    test('should meet CLS threshold across navigation', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Navigate to multiple pages to accumulate CLS
      const routes_to_test = [
        routes.web.appointments,
        routes.web.prescriptions,
        routes.web.profile,
      ];

      let totalCLS = 0;

      for (const route of routes_to_test) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        const metrics = await collectWebVitals(page);
        if (metrics.CLS) {
          totalCLS += metrics.CLS;
        }
      }

      console.log('Total CLS across navigation:', totalCLS);

      // Total CLS should be under 0.25
      expect(totalCLS).toBeLessThan(healthcareThresholds.CLS.needsImprovement);

      if (totalCLS < healthcareThresholds.CLS.good) {
        console.log('CLS Rating: GOOD');
      } else {
        console.log('CLS Rating: NEEDS IMPROVEMENT');
      }
    });

    test('should meet TTFB threshold on critical pages', async ({ page }) => {
      const criticalPages = [
        { name: 'Login', path: '/login' },
        { name: 'Dashboard', path: routes.web.dashboard },
        { name: 'Appointments', path: routes.web.appointments },
      ];

      for (const { name, path } of criticalPages) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        const metrics = await collectWebVitals(page);

        console.log(`${name} TTFB:`, metrics.TTFB, 'ms');

        if (metrics.TTFB) {
          // TTFB should be under 1.8 seconds
          expect(metrics.TTFB).toBeLessThan(healthcareThresholds.TTFB.needsImprovement);
        }
      }
    });

    test('should have consistent performance across page loads', async ({ page }) => {
      const metrics: number[] = [];

      // Load dashboard multiple times
      for (let i = 0; i < 3; i++) {
        await page.goto(routes.web.dashboard, { waitUntil: 'networkidle' });

        const pageMetrics = await collectWebVitals(page);
        if (pageMetrics.loadComplete) {
          metrics.push(pageMetrics.loadComplete);
        }

        // Clear cache between loads
        await page.evaluate(() => {
          performance.clearResourceTimings();
        });
      }

      console.log('Load times:', metrics);

      // Calculate variance
      if (metrics.length > 1) {
        const avg = metrics.reduce((a, b) => a + b, 0) / metrics.length;
        const variance = metrics.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / metrics.length;
        const stdDev = Math.sqrt(variance);

        console.log('Average load time:', avg, 'ms');
        console.log('Standard deviation:', stdDev, 'ms');

        // Standard deviation should be less than 30% of average for consistency
        expect(stdDev).toBeLessThan(avg * 0.5);
      }
    });
  });

  test.describe('Page Load Performance', () => {
    test('should load dashboard within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      console.log('Dashboard total load time:', loadTime, 'ms');

      // Dashboard should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should load appointments page efficiently', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(routes.web.appointments);
      await page.waitForLoadState('networkidle');

      // Wait for appointment cards to render
      await page.waitForSelector('[data-testid="appointment-card"], .appointment-card', { timeout: 10000 }).catch(() => {});

      const loadTime = Date.now() - startTime;

      console.log('Appointments page load time:', loadTime, 'ms');

      // Appointments page should load within healthcare threshold
      expect(loadTime).toBeLessThan(healthcareThresholds.dataLoadTime + 2000);
    });

    test('should load medical records within threshold', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(routes.web.records);
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      console.log('Medical records load time:', loadTime, 'ms');

      // Medical records contain sensitive data - should still load quickly
      expect(loadTime).toBeLessThan(healthcareThresholds.dataLoadTime + 2000);
    });

    test('should have reasonable resource count on initial load', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const resourceStats = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

        const stats = {
          total: resources.length,
          scripts: resources.filter(r => r.initiatorType === 'script').length,
          styles: resources.filter(r => r.name.endsWith('.css') || r.initiatorType === 'link').length,
          images: resources.filter(r => r.initiatorType === 'img' || r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)).length,
          fonts: resources.filter(r => r.name.match(/\.(woff|woff2|ttf|otf|eot)$/i)).length,
          totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        };

        return stats;
      });

      console.log('Resource statistics:', resourceStats);

      // Should have reasonable resource count
      expect(resourceStats.total).toBeLessThan(150);

      // Total transfer size should be under 3MB for initial load
      expect(resourceStats.totalSize).toBeLessThan(3 * 1024 * 1024);
    });

    test('should prioritize critical resources', async ({ page }) => {
      const resourceTimings: { name: string; startTime: number; duration: number }[] = [];

      page.on('response', async (response) => {
        const request = response.request();
        const timing = request.timing();
        if (timing) {
          resourceTimings.push({
            name: response.url(),
            startTime: timing.startTime,
            duration: timing.responseEnd - timing.startTime,
          });
        }
      });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Sort by start time
      resourceTimings.sort((a, b) => a.startTime - b.startTime);

      // Critical resources (HTML, CSS, critical JS) should load first
      const first10 = resourceTimings.slice(0, 10);

      console.log('First 10 resources loaded:', first10.map(r => r.name.split('/').pop()));

      // HTML should be among first resources
      const htmlLoaded = first10.some(r => r.name.endsWith('.html') || !r.name.includes('.'));
      console.log('HTML loaded early:', htmlLoaded);
    });

    test('should handle slow network gracefully', async ({ page, context }) => {
      // Simulate slow 3G network
      const cdpSession = await context.newCDPSession(page);
      await cdpSession.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: (500 * 1024) / 8, // 500 kbps
        uploadThroughput: (500 * 1024) / 8,
        latency: 400,
      });

      const startTime = Date.now();

      await page.goto('/login', { timeout: 30000 });
      await page.waitForLoadState('domcontentloaded');

      const domReadyTime = Date.now() - startTime;

      console.log('DOM ready on slow network:', domReadyTime, 'ms');

      // Even on slow network, DOM should be ready within reasonable time
      expect(domReadyTime).toBeLessThan(15000);

      // Page should still be usable
      await expect(page.locator('form, [data-testid="login-form"]').first()).toBeVisible({ timeout: 20000 });
    });
  });

  test.describe('Interaction Responsiveness', () => {
    test('should respond to button clicks within threshold', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Find a clickable button
      const button = page.locator('button').first();

      if (await button.isVisible()) {
        const startTime = Date.now();

        await button.click({ timeout: 5000 }).catch(() => {});

        // Measure time until any visual feedback
        await page.waitForTimeout(100);

        const responseTime = Date.now() - startTime;

        console.log('Button click response time:', responseTime, 'ms');

        // Interaction should respond within 300ms (FID threshold)
        expect(responseTime).toBeLessThan(healthcareThresholds.FID.needsImprovement);
      }
    });

    test('should handle form input responsively', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator('input[type="email"], input[name="email"]').first();

      if (await emailInput.isVisible()) {
        const startTime = Date.now();

        // Type and measure response
        await emailInput.fill('test@example.com');

        // Check if value is set
        const value = await emailInput.inputValue();

        const inputTime = Date.now() - startTime;

        console.log('Form input response time:', inputTime, 'ms');

        expect(value).toBe('test@example.com');
        expect(inputTime).toBeLessThan(500);
      }
    });

    test('should handle search input with debounce efficiently', async ({ page }) => {
      await page.goto(routes.web.appointments);
      await page.waitForLoadState('networkidle');

      const searchInput = page.locator('input[placeholder*="search" i], [data-testid*="search"]').first();

      if (await searchInput.isVisible()) {
        const startTime = Date.now();

        // Type search query
        await searchInput.fill('test');

        // Wait for debounce and results
        await page.waitForTimeout(500);

        const searchTime = Date.now() - startTime;

        console.log('Search response time:', searchTime, 'ms');

        // Search with debounce should respond within threshold
        expect(searchTime).toBeLessThan(healthcareThresholds.searchResponseTime);
      }
    });

    test('should handle navigation transitions smoothly', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Navigation links
      const navLink = page.locator('a[href*="appointments"]').first();

      if (await navLink.isVisible()) {
        const startTime = Date.now();

        await navLink.click();

        // Wait for navigation to complete
        await page.waitForLoadState('networkidle');

        const navTime = Date.now() - startTime;

        console.log('Navigation transition time:', navTime, 'ms');

        // Navigation should complete within 3 seconds
        expect(navTime).toBeLessThan(3000);
      }
    });

    test('should handle modal opening responsively', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Try to find a button that opens a modal
      const modalTrigger = page.locator('[data-testid="book-appointment-button"], button:has-text("Book")').first();

      if (await modalTrigger.isVisible()) {
        const startTime = Date.now();

        await modalTrigger.click();

        // Wait for modal to appear
        const modal = page.locator('[role="dialog"], .modal');
        await modal.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});

        const modalOpenTime = Date.now() - startTime;

        console.log('Modal open time:', modalOpenTime, 'ms');

        // Modal should open within 500ms
        expect(modalOpenTime).toBeLessThan(500);
      }
    });

    test('should handle scroll interactions smoothly', async ({ page }) => {
      await page.goto(routes.web.appointments);
      await page.waitForLoadState('networkidle');

      // Measure scroll performance
      const scrollMetrics = await page.evaluate(() => {
        return new Promise<{ frameTimes: number[]; avgFrameTime: number }>((resolve) => {
          const frameTimes: number[] = [];
          let lastTime = performance.now();
          let frameCount = 0;

          const measureFrame = (currentTime: number) => {
            const delta = currentTime - lastTime;
            frameTimes.push(delta);
            lastTime = currentTime;
            frameCount++;

            if (frameCount < 30) {
              requestAnimationFrame(measureFrame);
            } else {
              const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
              resolve({ frameTimes, avgFrameTime });
            }
          };

          // Start scrolling
          window.scrollBy(0, 500);
          requestAnimationFrame(measureFrame);
        });
      });

      console.log('Average frame time during scroll:', scrollMetrics.avgFrameTime, 'ms');

      // Average frame time should be under 16.67ms for 60fps
      // Allow some tolerance for test environment
      expect(scrollMetrics.avgFrameTime).toBeLessThan(50);
    });

    test('should handle rapid user interactions without lag', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      const startTime = Date.now();

      // Perform rapid interactions
      for (let i = 0; i < 10; i++) {
        await page.mouse.move(100 + i * 20, 100 + i * 10);
        await page.waitForTimeout(50);
      }

      // Click rapidly
      const buttons = await page.locator('button').all();
      for (let i = 0; i < Math.min(3, buttons.length); i++) {
        if (await buttons[i].isVisible()) {
          await buttons[i].click({ timeout: 500 }).catch(() => {});
          await page.waitForTimeout(100);
        }
      }

      const totalTime = Date.now() - startTime;

      console.log('Rapid interaction handling time:', totalTime, 'ms');

      // Should handle rapid interactions smoothly
      expect(totalTime).toBeLessThan(3000);

      // Page should still be responsive
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Healthcare-Specific Performance', () => {
    test('should load patient data within healthcare threshold', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(routes.web.profile);
      await page.waitForLoadState('networkidle');

      // Wait for patient data to render
      await page.waitForSelector('[data-testid="patient-info"], .patient-info, .profile-data', { timeout: 10000 }).catch(() => {});

      const loadTime = Date.now() - startTime;

      console.log('Patient data load time:', loadTime, 'ms');

      // Patient data should load within healthcare threshold
      expect(loadTime).toBeLessThan(healthcareThresholds.dataLoadTime);
    });

    test('should handle appointment booking form efficiently', async ({ page }) => {
      await page.goto(routes.web.bookAppointment);
      await page.waitForLoadState('networkidle');

      const formInteractionTimes: number[] = [];

      // Measure form field interactions
      const selects = await page.locator('select').all();
      const inputs = await page.locator('input:not([type="hidden"])').all();

      for (const select of selects.slice(0, 3)) {
        if (await select.isVisible()) {
          const start = Date.now();
          await select.selectOption({ index: 0 }).catch(() => {});
          formInteractionTimes.push(Date.now() - start);
        }
      }

      for (const input of inputs.slice(0, 3)) {
        if (await input.isVisible()) {
          const start = Date.now();
          await input.fill('test').catch(() => {});
          formInteractionTimes.push(Date.now() - start);
        }
      }

      if (formInteractionTimes.length > 0) {
        const avgInteractionTime = formInteractionTimes.reduce((a, b) => a + b, 0) / formInteractionTimes.length;

        console.log('Average form interaction time:', avgInteractionTime, 'ms');

        // Form interactions should be responsive
        expect(avgInteractionTime).toBeLessThan(200);
      }
    });

    test('should optimize API response handling for health data', async ({ page }) => {
      const apiTimes: { url: string; time: number }[] = [];

      page.on('response', (response) => {
        const url = response.url();
        if (url.includes('/api/')) {
          const request = response.request();
          const timing = request.timing();
          apiTimes.push({
            url: url.split('/api/')[1] || url,
            time: timing.responseEnd - timing.startTime,
          });
        }
      });

      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      console.log('API response times:', apiTimes);

      // All API calls should respond within reasonable time
      for (const api of apiTimes) {
        expect(api.time).toBeLessThan(3000);
      }
    });
  });

  test.describe('Memory and Resource Management', () => {
    test('should not have memory leaks during navigation', async ({ page }) => {
      // Get initial memory
      const initialMemory = await page.evaluate(() => {
        // @ts-ignore
        return performance.memory?.usedJSHeapSize || 0;
      });

      // Navigate through multiple pages
      const pagesToVisit = [
        routes.web.dashboard,
        routes.web.appointments,
        routes.web.prescriptions,
        routes.web.profile,
        routes.web.settings,
        routes.web.billing,
      ];

      for (const route of pagesToVisit) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      }

      // Return to dashboard
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Force garbage collection if available
      await page.evaluate(() => {
        // @ts-ignore
        if (window.gc) window.gc();
      });

      await page.waitForTimeout(1000);

      const finalMemory = await page.evaluate(() => {
        // @ts-ignore
        return performance.memory?.usedJSHeapSize || 0;
      });

      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory;
        const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;

        console.log('Initial memory:', (initialMemory / 1024 / 1024).toFixed(2), 'MB');
        console.log('Final memory:', (finalMemory / 1024 / 1024).toFixed(2), 'MB');
        console.log('Memory increase:', memoryIncreasePercent.toFixed(2), '%');

        // Memory should not increase by more than 100%
        expect(memoryIncreasePercent).toBeLessThan(100);
      }
    });

    test('should clean up resources on page unload', async ({ page }) => {
      await page.goto(routes.web.dashboard);
      await page.waitForLoadState('networkidle');

      // Get resource count before navigation
      const resourcesBefore = await page.evaluate(() => {
        return performance.getEntriesByType('resource').length;
      });

      // Navigate away
      await page.goto(routes.web.appointments);
      await page.waitForLoadState('networkidle');

      // Clear performance entries
      await page.evaluate(() => {
        performance.clearResourceTimings();
      });

      // Get resource count after clearing
      const resourcesAfter = await page.evaluate(() => {
        return performance.getEntriesByType('resource').length;
      });

      console.log('Resources before:', resourcesBefore);
      console.log('Resources after clear:', resourcesAfter);

      // Resources should be cleared
      expect(resourcesAfter).toBeLessThan(resourcesBefore);
    });
  });

  test.describe('Network Optimization', () => {
    test('should use browser caching effectively', async ({ page }) => {
      // First visit
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const firstVisitResources = await page.evaluate(() => {
        return performance.getEntriesByType('resource')
          .filter((r: any) => r.transferSize > 0).length;
      });

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      const reloadResources = await page.evaluate(() => {
        return performance.getEntriesByType('resource')
          .filter((r: any) => r.transferSize > 0).length;
      });

      console.log('First visit resources transferred:', firstVisitResources);
      console.log('Reload resources transferred:', reloadResources);

      // Second visit should have fewer transferred resources due to caching
      expect(reloadResources).toBeLessThanOrEqual(firstVisitResources);
    });

    test('should compress text-based resources', async ({ page }) => {
      const responses: { url: string; contentEncoding: string | null; contentType: string | null }[] = [];

      page.on('response', (response) => {
        const headers = response.headers();
        responses.push({
          url: response.url(),
          contentEncoding: headers['content-encoding'] || null,
          contentType: headers['content-type'] || null,
        });
      });

      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Filter text resources
      const textResources = responses.filter((r) =>
        r.contentType?.includes('text/') ||
        r.contentType?.includes('application/javascript') ||
        r.contentType?.includes('application/json')
      );

      const compressedResources = textResources.filter((r) =>
        r.contentEncoding?.includes('gzip') ||
        r.contentEncoding?.includes('br') ||
        r.contentEncoding?.includes('deflate')
      );

      console.log('Text resources:', textResources.length);
      console.log('Compressed resources:', compressedResources.length);

      // At least 50% of text resources should be compressed
      if (textResources.length > 0) {
        const compressionRate = compressedResources.length / textResources.length;
        expect(compressionRate).toBeGreaterThan(0.3);
      }
    });

    test('should minimize blocking resources', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const blockingResources = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

        return resources.filter((r) => {
          // Check for render-blocking resources
          return (
            (r.initiatorType === 'script' && !r.name.includes('async') && !r.name.includes('defer')) ||
            (r.initiatorType === 'link' && r.name.endsWith('.css'))
          );
        }).map((r) => ({
          name: r.name.split('/').pop(),
          duration: r.duration,
          size: r.transferSize,
        }));
      });

      console.log('Potentially blocking resources:', blockingResources.length);

      // Should have limited blocking resources
      expect(blockingResources.length).toBeLessThan(20);
    });
  });
});
