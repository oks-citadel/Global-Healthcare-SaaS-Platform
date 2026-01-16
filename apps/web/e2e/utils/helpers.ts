import { Page, expect } from '@playwright/test';

/**
 * E2E Test Helper Utilities
 *
 * Common utility functions for E2E tests
 */

/**
 * Wait for API response
 */
export async function waitForResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 10000
) {
  return await page.waitForResponse(
    (response) => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
}

/**
 * Wait for multiple API responses
 */
export async function waitForResponses(
  page: Page,
  urlPatterns: (string | RegExp)[],
  timeout: number = 10000
) {
  const promises = urlPatterns.map((pattern) => waitForResponse(page, pattern, timeout));
  return await Promise.all(promises);
}

/**
 * Take a screenshot with a custom name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Fill form fields from an object
 */
export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [name, value] of Object.entries(formData)) {
    const input = page.locator(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`);

    if (await input.isVisible()) {
      const tagName = await input.evaluate((el) => el.tagName.toLowerCase());

      if (tagName === 'select') {
        await input.selectOption(value);
      } else {
        await input.fill(value);
      }
    }
  }
}

/**
 * Check if element exists (without waiting)
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  try {
    return await page.locator(selector).count() > 0;
  } catch {
    return false;
  }
}

/**
 * Scroll to element
 */
export async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Wait for loading to complete
 */
export async function waitForLoading(page: Page, timeout: number = 10000) {
  // Wait for common loading indicators to disappear
  const loadingSelectors = [
    '[data-testid="loading"]',
    '.loading',
    '.spinner',
    '[role="progressbar"]',
    '.skeleton',
  ];

  for (const selector of loadingSelectors) {
    const loader = page.locator(selector);
    if (await loader.isVisible().catch(() => false)) {
      await loader.waitFor({ state: 'hidden', timeout });
    }
  }

  // Also wait for network to be idle
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Get table data as array of objects
 */
export async function getTableData(page: Page, tableSelector: string = 'table') {
  return await page.locator(tableSelector).evaluate((table) => {
    const headers = Array.from(table.querySelectorAll('thead th')).map((th) =>
      th.textContent?.trim()
    );

    const rows = Array.from(table.querySelectorAll('tbody tr'));

    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('td'));
      const rowData: Record<string, string> = {};

      cells.forEach((cell, index) => {
        const header = headers[index];
        if (header) {
          rowData[header] = cell.textContent?.trim() || '';
        }
      });

      return rowData;
    });
  });
}

/**
 * Select option from dropdown by text
 */
export async function selectDropdownByText(
  page: Page,
  selector: string,
  optionText: string
) {
  await page.locator(selector).selectOption({ label: optionText });
}

/**
 * Upload file to input
 */
export async function uploadFile(
  page: Page,
  inputSelector: string,
  filePath: string
) {
  await page.locator(inputSelector).setInputFiles(filePath);
}

/**
 * Clear local storage
 */
export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

/**
 * Clear session storage
 */
export async function clearSessionStorage(page: Page) {
  await page.evaluate(() => sessionStorage.clear());
}

/**
 * Get local storage item
 */
export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  return await page.evaluate((key) => localStorage.getItem(key), key);
}

/**
 * Set local storage item
 */
export async function setLocalStorageItem(page: Page, key: string, value: string) {
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, value),
    { key, value }
  );
}

/**
 * Wait for element to contain text
 */
export async function waitForTextContent(
  page: Page,
  selector: string,
  text: string,
  timeout: number = 10000
) {
  await expect(page.locator(selector)).toContainText(text, { timeout });
}

/**
 * Click and wait for navigation
 */
export async function clickAndWaitForNavigation(page: Page, selector: string) {
  await Promise.all([
    page.waitForNavigation(),
    page.locator(selector).click(),
  ]);
}

/**
 * Hover over element
 */
export async function hoverElement(page: Page, selector: string) {
  await page.locator(selector).hover();
}

/**
 * Double click element
 */
export async function doubleClickElement(page: Page, selector: string) {
  await page.locator(selector).dblclick();
}

/**
 * Right click element
 */
export async function rightClickElement(page: Page, selector: string) {
  await page.locator(selector).click({ button: 'right' });
}

/**
 * Drag and drop
 */
export async function dragAndDrop(
  page: Page,
  sourceSelector: string,
  targetSelector: string
) {
  await page.locator(sourceSelector).dragTo(page.locator(targetSelector));
}

/**
 * Check if page has error
 */
export async function hasPageError(page: Page): Promise<boolean> {
  const errorSelectors = [
    '[role="alert"]',
    '.error-message',
    '.alert-error',
    '[data-testid="error"]',
  ];

  for (const selector of errorSelectors) {
    if (await elementExists(page, selector)) {
      const isVisible = await page.locator(selector).isVisible().catch(() => false);
      if (isVisible) return true;
    }
  }

  return false;
}

/**
 * Get error message from page
 */
export async function getErrorMessage(page: Page): Promise<string | null> {
  const errorSelectors = [
    '[role="alert"]',
    '.error-message',
    '.alert-error',
    '[data-testid="error"]',
  ];

  for (const selector of errorSelectors) {
    if (await elementExists(page, selector)) {
      const isVisible = await page.locator(selector).isVisible().catch(() => false);
      if (isVisible) {
        return await page.locator(selector).textContent();
      }
    }
  }

  return null;
}

/**
 * Wait for toast/notification to appear
 */
export async function waitForToast(
  page: Page,
  expectedText?: string,
  timeout: number = 5000
) {
  const toastSelectors = [
    '[role="status"]',
    '.toast',
    '.notification',
    '[data-testid="toast"]',
  ];

  for (const selector of toastSelectors) {
    const toast = page.locator(selector);
    if (await toast.isVisible().catch(() => false)) {
      if (expectedText) {
        await expect(toast).toContainText(expectedText, { timeout });
      }
      return;
    }
  }
}

/**
 * Retry action until it succeeds
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Get current URL
 */
export async function getCurrentURL(page: Page): Promise<string> {
  return page.url();
}

/**
 * Assert URL contains path
 */
export async function assertURLContains(page: Page, path: string) {
  expect(page.url()).toContain(path);
}

/**
 * Assert URL matches pattern
 */
export async function assertURLMatches(page: Page, pattern: RegExp) {
  expect(page.url()).toMatch(pattern);
}

/**
 * Get cookies
 */
export async function getCookies(page: Page) {
  return await page.context().cookies();
}

/**
 * Set cookies
 */
export async function setCookies(page: Page, cookies: any[]) {
  await page.context().addCookies(cookies);
}

/**
 * Clear cookies
 */
export async function clearCookies(page: Page) {
  await page.context().clearCookies();
}
