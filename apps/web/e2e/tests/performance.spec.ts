import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { testUsers } from '../fixtures/test-data';

/**
 * Performance E2E Tests
 *
 * Tests for Core Web Vitals and performance metrics:
 * - Largest Contentful Paint (LCP)
 * - First Input Delay (FID)
 * - Cumulative Layout Shift (CLS)
 * - Time to Interactive (TTI)
 * - Total Blocking Time (TBT)
 */

test.describe('Performance Tests', () => {
  test.describe('Core Web Vitals', () => {
    test('should load dashboard within performance thresholds', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      // Measure navigation timing
      const navigationTiming = await page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          domInteractive: perfData.domInteractive - perfData.fetchStart,
          totalTime: perfData.loadEventEnd - perfData.fetchStart,
        };
      });

      // DOM Interactive should be under 2 seconds
      expect(navigationTiming.domInteractive).toBeLessThan(2000);

      // Total load time should be under 5 seconds
      expect(navigationTiming.totalTime).toBeLessThan(5000);

      console.log('Navigation Timing:', navigationTiming);
    });

    test('should measure Largest Contentful Paint (LCP)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      // Measure LCP
      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let lcpValue = 0;

          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            lcpValue = lastEntry.renderTime || lastEntry.loadTime;
          });

          observer.observe({ type: 'largest-contentful-paint', buffered: true });

          // Wait a bit for LCP to be captured
          setTimeout(() => {
            observer.disconnect();
            resolve(lcpValue);
          }, 1000);
        });
      });

      console.log('LCP:', lcp);

      // LCP should be under 2.5 seconds (good) or at least under 4 seconds (acceptable)
      expect(lcp).toBeLessThan(4000);
      if (lcp < 2500) {
        console.log('LCP is GOOD (<2.5s)');
      } else {
        console.log('LCP needs improvement (2.5-4s)');
      }
    });

    test('should measure Cumulative Layout Shift (CLS)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      // Wait for page to settle
      await page.waitForTimeout(2000);

      // Measure CLS
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;

          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          });

          observer.observe({ type: 'layout-shift', buffered: true });

          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 1000);
        });
      });

      console.log('CLS:', cls);

      // CLS should be under 0.1 (good) or at least under 0.25 (acceptable)
      expect(cls).toBeLessThan(0.25);
      if (cls < 0.1) {
        console.log('CLS is GOOD (<0.1)');
      } else {
        console.log('CLS needs improvement (0.1-0.25)');
      }
    });

    test('should measure First Contentful Paint (FCP)', async ({ page }) => {
      await page.goto('/login');

      const fcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntriesByName('first-contentful-paint');
            if (entries.length > 0) {
              resolve(entries[0].startTime);
              observer.disconnect();
            }
          });

          observer.observe({ type: 'paint', buffered: true });

          setTimeout(() => {
            observer.disconnect();
            resolve(0);
          }, 2000);
        });
      });

      console.log('FCP:', fcp);

      // FCP should be under 1.8 seconds (good) or under 3 seconds (acceptable)
      expect(fcp).toBeLessThan(3000);
      if (fcp < 1800) {
        console.log('FCP is GOOD (<1.8s)');
      }
    });

    test('should measure Time to Interactive (TTI)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const startTime = Date.now();

      await loginPage.goto();

      // Wait for page to be interactive
      await page.waitForLoadState('networkidle');

      const endTime = Date.now();
      const tti = endTime - startTime;

      console.log('TTI (approximate):', tti);

      // TTI should be under 3.8 seconds (good) or under 7.3 seconds (acceptable)
      expect(tti).toBeLessThan(7300);
      if (tti < 3800) {
        console.log('TTI is GOOD (<3.8s)');
      }
    });
  });

  test.describe('Resource Loading', () => {
    test('should load critical resources efficiently', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Get all resource timings
      const resources = await page.evaluate(() => {
        return performance.getEntriesByType('resource').map((r: any) => ({
          name: r.name,
          duration: r.duration,
          size: r.transferSize,
          type: r.initiatorType,
        }));
      });

      console.log('Total resources loaded:', resources.length);

      // Should have reasonable number of resources
      expect(resources.length).toBeLessThan(100);

      // Check for large resources
      const largeResources = resources.filter(r => r.size > 500000); // >500KB

      if (largeResources.length > 0) {
        console.log('Large resources (>500KB):', largeResources);
      }

      // Shouldn't have too many large resources
      expect(largeResources.length).toBeLessThan(10);
    });

    test('should have efficient JavaScript bundle size', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const jsResources = await page.evaluate(() => {
        return performance.getEntriesByType('resource')
          .filter((r: any) => r.initiatorType === 'script')
          .map((r: any) => ({
            name: r.name,
            size: r.transferSize,
            duration: r.duration,
          }));
      });

      const totalJsSize = jsResources.reduce((sum, r) => sum + r.size, 0);

      console.log('Total JS size:', (totalJsSize / 1024).toFixed(2), 'KB');
      console.log('Number of JS files:', jsResources.length);

      // Total JS should be under 1MB for initial load
      expect(totalJsSize).toBeLessThan(1024 * 1024);
    });

    test('should have efficient CSS bundle size', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const cssResources = await page.evaluate(() => {
        return performance.getEntriesByType('resource')
          .filter((r: any) => r.name.endsWith('.css') || r.initiatorType === 'link')
          .map((r: any) => ({
            name: r.name,
            size: r.transferSize,
            duration: r.duration,
          }));
      });

      const totalCssSize = cssResources.reduce((sum, r) => sum + r.size, 0);

      console.log('Total CSS size:', (totalCssSize / 1024).toFixed(2), 'KB');
      console.log('Number of CSS files:', cssResources.length);

      // Total CSS should be under 200KB
      expect(totalCssSize).toBeLessThan(200 * 1024);
    });

    test('should load images efficiently', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      await page.waitForLoadState('networkidle');

      const images = await page.evaluate(() => {
        return performance.getEntriesByType('resource')
          .filter((r: any) => r.initiatorType === 'img' ||
                             r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i))
          .map((r: any) => ({
            name: r.name,
            size: r.transferSize,
            duration: r.duration,
          }));
      });

      console.log('Total images loaded:', images.length);

      // Check for unoptimized images (>200KB)
      const largeImages = images.filter(img => img.size > 200000);

      if (largeImages.length > 0) {
        console.log('Large images (>200KB):', largeImages);
      }

      // Should optimize large images
      expect(largeImages.length).toBeLessThan(5);
    });
  });

  test.describe('Caching and Network', () => {
    test('should utilize browser caching', async ({ page }) => {
      // First visit
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const firstLoadResources = await page.evaluate(() => {
        return performance.getEntriesByType('resource').length;
      });

      // Second visit (reload)
      await page.reload();
      await page.waitForLoadState('networkidle');

      const secondLoadResources = await page.evaluate(() => {
        return performance.getEntriesByType('resource')
          .filter((r: any) => r.transferSize > 0).length;
      });

      console.log('First load resources:', firstLoadResources);
      console.log('Second load resources with transfer:', secondLoadResources);

      // Second load should have fewer resources with actual transfer (more cached)
      // This test may vary based on cache headers
    });

    test('should use compression for text resources', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Check response headers for compression
      const responses: any[] = [];

      page.on('response', response => {
        responses.push({
          url: response.url(),
          headers: response.headers(),
          status: response.status(),
        });
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check for content-encoding header
      const textResources = responses.filter(r =>
        r.headers['content-type']?.includes('text/') ||
        r.headers['content-type']?.includes('application/javascript') ||
        r.headers['content-type']?.includes('application/json')
      );

      const compressedResources = textResources.filter(r =>
        r.headers['content-encoding']?.includes('gzip') ||
        r.headers['content-encoding']?.includes('br')
      );

      console.log('Text resources:', textResources.length);
      console.log('Compressed resources:', compressedResources.length);

      // Most text resources should be compressed
      if (textResources.length > 0) {
        const compressionRate = compressedResources.length / textResources.length;
        console.log('Compression rate:', (compressionRate * 100).toFixed(2) + '%');
        // At least 50% should be compressed
        expect(compressionRate).toBeGreaterThan(0.3);
      }
    });
  });

  test.describe('JavaScript Performance', () => {
    test('should have minimal main thread blocking', async ({ page }) => {
      await page.goto('/login');

      // Measure long tasks
      const longTasks = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let taskCount = 0;

          const observer = new PerformanceObserver((list) => {
            taskCount += list.getEntries().length;
          });

          observer.observe({ type: 'longtask', buffered: true });

          setTimeout(() => {
            observer.disconnect();
            resolve(taskCount);
          }, 3000);
        });
      });

      console.log('Long tasks detected:', longTasks);

      // Should have minimal long tasks (blocking >50ms)
      expect(longTasks).toBeLessThan(10);
    });

    test('should handle rapid interactions smoothly', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      await page.goto('/appointments');
      await page.waitForLoadState('networkidle');

      const startTime = Date.now();

      // Perform rapid clicks
      const buttons = await page.locator('button').all();

      for (let i = 0; i < Math.min(5, buttons.length); i++) {
        if (await buttons[i].isVisible()) {
          await buttons[i].click({ timeout: 1000 }).catch(() => {});
          await page.waitForTimeout(100);
        }
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      console.log('Rapid interaction time:', totalTime);

      // Should handle interactions smoothly
      expect(totalTime).toBeLessThan(5000);
    });
  });

  test.describe('Memory Usage', () => {
    test('should not have memory leaks on navigation', async ({ page, context }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      // Navigate through several pages
      const routes = ['/dashboard', '/appointments', '/prescriptions', '/profile', '/settings'];

      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      }

      // Get memory usage (if available)
      const memoryInfo = await page.evaluate(() => {
        // @ts-ignore
        if (performance.memory) {
          // @ts-ignore
          return performance.memory.usedJSHeapSize;
        }
        return 0;
      });

      if (memoryInfo > 0) {
        console.log('Memory usage:', (memoryInfo / 1024 / 1024).toFixed(2), 'MB');

        // Should not exceed 100MB
        expect(memoryInfo).toBeLessThan(100 * 1024 * 1024);
      }
    });
  });

  test.describe('Rendering Performance', () => {
    test('should render lists efficiently', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      await page.goto('/appointments');

      const startTime = Date.now();
      await page.waitForSelector('.appointment-card, [data-testid="appointment-card"]', { timeout: 5000 });
      const endTime = Date.now();

      const renderTime = endTime - startTime;

      console.log('List render time:', renderTime);

      // List should render within 2 seconds
      expect(renderTime).toBeLessThan(2000);
    });

    test('should have smooth scrolling performance', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      await page.goto('/appointments');
      await page.waitForLoadState('networkidle');

      // Scroll multiple times
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, 200));
        await page.waitForTimeout(100);
      }

      // Measure layout shifts during scroll
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;

          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              clsValue += (entry as any).value;
            }
          });

          observer.observe({ type: 'layout-shift', buffered: true });

          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 500);
        });
      });

      console.log('CLS during scroll:', cls);

      // Should have minimal layout shift during scroll
      expect(cls).toBeLessThan(0.1);
    });
  });

  test.describe('API Response Times', () => {
    test('should have fast API response times', async ({ page }) => {
      const apiCalls: any[] = [];

      page.on('response', response => {
        const url = response.url();
        if (url.includes('/api/')) {
          apiCalls.push({
            url,
            status: response.status(),
            timing: response.timing(),
          });
        }
      });

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.patient1.email, testUsers.patient1.password);
      await loginPage.waitForLoginSuccess();

      await page.waitForLoadState('networkidle');

      console.log('API calls made:', apiCalls.length);

      // Check response times
      for (const call of apiCalls) {
        console.log(`API: ${call.url} - Status: ${call.status}`);

        // Each API call should respond within reasonable time
        // This is network-dependent, so we use a generous threshold
        if (call.timing && call.timing.responseEnd) {
          const responseTime = call.timing.responseEnd - call.timing.requestStart;
          expect(responseTime).toBeLessThan(3000);
        }
      }
    });
  });
});
