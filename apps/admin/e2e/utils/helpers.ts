import { Page, expect } from "@playwright/test";

/**
 * Admin Dashboard E2E Test Helper Utilities
 *
 * Common utility functions for E2E tests
 */

/**
 * Wait for API response
 */
export async function waitForResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 10000,
) {
  return await page.waitForResponse(
    (response) => {
      const url = response.url();
      if (typeof urlPattern === "string") {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout },
  );
}

/**
 * Wait for multiple API responses
 */
export async function waitForResponses(
  page: Page,
  urlPatterns: (string | RegExp)[],
  timeout: number = 10000,
) {
  const promises = urlPatterns.map((pattern) =>
    waitForResponse(page, pattern, timeout),
  );
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
    const input = page.locator(
      `input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`,
    );

    if (await input.isVisible()) {
      const tagName = await input.evaluate((el) => el.tagName.toLowerCase());

      if (tagName === "select") {
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
export async function elementExists(
  page: Page,
  selector: string,
): Promise<boolean> {
  try {
    return (await page.locator(selector).count()) > 0;
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
  const loadingSelectors = [
    '[data-testid="loading"]',
    ".loading",
    ".spinner",
    '[role="progressbar"]',
    ".skeleton",
  ];

  for (const selector of loadingSelectors) {
    const loader = page.locator(selector);
    if (await loader.isVisible().catch(() => false)) {
      await loader.waitFor({ state: "hidden", timeout });
    }
  }

  await page.waitForLoadState("networkidle", { timeout });
}

/**
 * Get table data as array of objects
 */
export async function getTableData(
  page: Page,
  tableSelector: string = "table",
) {
  return await page.locator(tableSelector).evaluate((table) => {
    const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
      th.textContent?.trim(),
    );

    const rows = Array.from(table.querySelectorAll("tbody tr"));

    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll("td"));
      const rowData: Record<string, string> = {};

      cells.forEach((cell, index) => {
        const header = headers[index];
        if (header) {
          rowData[header] = cell.textContent?.trim() || "";
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
  optionText: string,
) {
  await page.locator(selector).selectOption({ label: optionText });
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
export async function getLocalStorageItem(
  page: Page,
  key: string,
): Promise<string | null> {
  return await page.evaluate((key) => localStorage.getItem(key), key);
}

/**
 * Set local storage item
 */
export async function setLocalStorageItem(
  page: Page,
  key: string,
  value: string,
) {
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key,
    value,
  });
}

/**
 * Wait for element to contain text
 */
export async function waitForTextContent(
  page: Page,
  selector: string,
  text: string,
  timeout: number = 10000,
) {
  await expect(page.locator(selector)).toContainText(text, { timeout });
}

/**
 * Click and wait for navigation
 */
export async function clickAndWaitForNavigation(page: Page, selector: string) {
  await Promise.all([page.waitForNavigation(), page.locator(selector).click()]);
}

/**
 * Wait for toast/notification to appear
 */
export async function waitForToast(
  page: Page,
  expectedText?: string,
  timeout: number = 5000,
) {
  const toastSelectors = [
    '[role="status"]',
    ".toast",
    ".notification",
    '[data-testid="toast"]',
    ".Toastify__toast",
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
 * Check if page has error
 */
export async function hasPageError(page: Page): Promise<boolean> {
  const errorSelectors = [
    '[role="alert"]',
    ".error-message",
    ".alert-error",
    '[data-testid="error"]',
  ];

  for (const selector of errorSelectors) {
    if (await elementExists(page, selector)) {
      const isVisible = await page
        .locator(selector)
        .isVisible()
        .catch(() => false);
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
    ".error-message",
    ".alert-error",
    '[data-testid="error"]',
  ];

  for (const selector of errorSelectors) {
    if (await elementExists(page, selector)) {
      const isVisible = await page
        .locator(selector)
        .isVisible()
        .catch(() => false);
      if (isVisible) {
        return await page.locator(selector).textContent();
      }
    }
  }

  return null;
}

/**
 * Retry action until it succeeds
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
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
export function getCurrentURL(page: Page): string {
  return page.url();
}

/**
 * Assert URL contains path
 */
export function assertURLContains(page: Page, path: string) {
  expect(page.url()).toContain(path);
}

/**
 * Format date for display (locale-aware)
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Wait for modal to appear
 */
export async function waitForModal(page: Page, timeout: number = 5000) {
  const modalSelectors = [
    '[role="dialog"]',
    ".modal",
    '[data-testid="modal"]',
    ".MuiDialog-root",
    "[data-radix-portal]",
  ];

  for (const selector of modalSelectors) {
    const modal = page.locator(selector);
    try {
      await modal.waitFor({ state: "visible", timeout });
      return modal;
    } catch {
      continue;
    }
  }

  throw new Error("Modal not found");
}

/**
 * Close modal
 */
export async function closeModal(page: Page) {
  const closeButtons = [
    '[data-testid="modal-close"]',
    ".modal-close",
    'button[aria-label="Close"]',
    '[role="dialog"] button:has-text("Close")',
    '[role="dialog"] button:has-text("Cancel")',
  ];

  for (const selector of closeButtons) {
    const button = page.locator(selector);
    if (await button.isVisible().catch(() => false)) {
      await button.click();
      return;
    }
  }
}

/**
 * Confirm dialog action
 */
export async function confirmDialog(page: Page) {
  const confirmButtons = [
    '[data-testid="confirm-button"]',
    'button:has-text("Confirm")',
    'button:has-text("Yes")',
    'button:has-text("OK")',
    '[role="dialog"] button[type="submit"]',
  ];

  for (const selector of confirmButtons) {
    const button = page.locator(selector);
    if (await button.isVisible().catch(() => false)) {
      await button.click();
      return;
    }
  }
}

/**
 * Cancel dialog action
 */
export async function cancelDialog(page: Page) {
  const cancelButtons = [
    '[data-testid="cancel-button"]',
    'button:has-text("Cancel")',
    'button:has-text("No")',
    '[role="dialog"] button:has-text("Close")',
  ];

  for (const selector of cancelButtons) {
    const button = page.locator(selector);
    if (await button.isVisible().catch(() => false)) {
      await button.click();
      return;
    }
  }
}

/**
 * Export table data (trigger export button and handle download)
 */
export async function exportTableData(
  page: Page,
  format: "csv" | "excel" | "pdf",
) {
  const exportButton = page.locator(
    `button:has-text("Export ${format.toUpperCase()}"), [data-testid="export-${format}"]`,
  );

  if (await exportButton.isVisible()) {
    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent("download");
    await exportButton.click();
    const download = await downloadPromise;
    return download;
  }

  throw new Error(`Export button for ${format} not found`);
}

/**
 * Filter table by column
 */
export async function filterTableByColumn(
  page: Page,
  columnName: string,
  filterValue: string,
) {
  // Click on filter button or column header
  const filterTrigger = page.locator(
    `[data-testid="filter-${columnName}"], th:has-text("${columnName}") button`,
  );

  if (await filterTrigger.isVisible()) {
    await filterTrigger.click();

    // Enter filter value
    const filterInput = page.locator(
      `input[data-testid="filter-input-${columnName}"], [role="menu"] input`,
    );
    await filterInput.fill(filterValue);
    await filterInput.press("Enter");
  }
}

/**
 * Sort table by column
 */
export async function sortTableByColumn(
  page: Page,
  columnName: string,
  direction: "asc" | "desc",
) {
  const columnHeader = page.locator(`th:has-text("${columnName}")`);

  if (await columnHeader.isVisible()) {
    // Click to sort - may need to click twice for descending
    await columnHeader.click();

    if (direction === "desc") {
      await columnHeader.click();
    }
  }
}
