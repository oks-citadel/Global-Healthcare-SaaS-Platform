/**
 * Custom Assertions and Matchers
 * Additional assertion utilities for testing
 */

import { expect } from 'vitest';

/**
 * Assert that a value is a valid UUID
 */
export function assertUUID(value: unknown): asserts value is string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  expect(typeof value).toBe('string');
  expect(value).toMatch(uuidRegex);
}

/**
 * Assert that a value is a valid email
 */
export function assertEmail(value: unknown): asserts value is string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  expect(typeof value).toBe('string');
  expect(value).toMatch(emailRegex);
}

/**
 * Assert that a value is a valid ISO date string
 */
export function assertISODate(value: unknown): asserts value is string {
  expect(typeof value).toBe('string');
  const date = new Date(value as string);
  expect(date.toISOString()).toBe(value);
}

/**
 * Assert that a value is within a range
 */
export function assertInRange(value: number, min: number, max: number): void {
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
}

/**
 * Assert that an array has unique values
 */
export function assertUniqueArray<T>(arr: T[]): void {
  const unique = new Set(arr);
  expect(unique.size).toBe(arr.length);
}

/**
 * Assert that an object has specific keys
 */
export function assertHasKeys(obj: object, keys: string[]): void {
  for (const key of keys) {
    expect(obj).toHaveProperty(key);
  }
}

/**
 * Assert that an object doesn't have specific keys (good for checking no sensitive data)
 */
export function assertNotHasKeys(obj: object, keys: string[]): void {
  for (const key of keys) {
    expect(obj).not.toHaveProperty(key);
  }
}

/**
 * Assert that a string contains no sensitive data patterns
 */
export function assertNoSensitiveData(value: string): void {
  // SSN pattern
  expect(value).not.toMatch(/\b\d{3}-\d{2}-\d{4}\b/);
  // Credit card patterns
  expect(value).not.toMatch(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/);
  // Full phone numbers (allowing last 4 digits)
  // This is a basic check - real implementation should be more thorough
}

/**
 * Assert that an API response matches expected shape
 */
export function assertAPIResponse(
  response: { status: number; data: unknown },
  expectedStatus: number,
  requiredFields: string[] = []
): void {
  expect(response.status).toBe(expectedStatus);

  if (response.data && typeof response.data === 'object' && requiredFields.length > 0) {
    assertHasKeys(response.data as object, requiredFields);
  }
}

/**
 * Assert that a pagination response has correct structure
 */
export function assertPaginatedResponse(response: {
  data: unknown[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}): void {
  expect(Array.isArray(response.data)).toBe(true);

  if (response.page !== undefined) {
    expect(typeof response.page).toBe('number');
    expect(response.page).toBeGreaterThan(0);
  }

  if (response.limit !== undefined) {
    expect(typeof response.limit).toBe('number');
    expect(response.limit).toBeGreaterThan(0);
  }

  if (response.total !== undefined) {
    expect(typeof response.total).toBe('number');
    expect(response.total).toBeGreaterThanOrEqual(0);
  }
}

/**
 * Assert that a timestamp is recent (within specified minutes)
 */
export function assertRecentTimestamp(timestamp: string | Date, withinMinutes: number = 5): void {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  expect(diffMinutes).toBeLessThan(withinMinutes);
}

/**
 * Assert that a date is in the future
 */
export function assertFutureDate(date: string | Date): void {
  const d = typeof date === 'string' ? new Date(date) : date;
  expect(d.getTime()).toBeGreaterThan(Date.now());
}

/**
 * Assert that a date is in the past
 */
export function assertPastDate(date: string | Date): void {
  const d = typeof date === 'string' ? new Date(date) : date;
  expect(d.getTime()).toBeLessThan(Date.now());
}

/**
 * Assert that an array is sorted
 */
export function assertSorted<T>(arr: T[], key?: keyof T, descending: boolean = false): void {
  for (let i = 1; i < arr.length; i++) {
    const prev = key ? arr[i - 1][key] : arr[i - 1];
    const curr = key ? arr[i][key] : arr[i];

    if (descending) {
      expect(prev >= curr).toBe(true);
    } else {
      expect(prev <= curr).toBe(true);
    }
  }
}

/**
 * Assert that an error has expected structure
 */
export function assertErrorResponse(response: {
  status: number;
  data?: { message?: string; code?: string; errors?: unknown[] };
}): void {
  expect(response.status).toBeGreaterThanOrEqual(400);

  if (response.data) {
    // Error responses should have some error indicator
    const hasErrorInfo =
      response.data.message !== undefined ||
      response.data.code !== undefined ||
      response.data.errors !== undefined;

    expect(hasErrorInfo).toBe(true);
  }
}

/**
 * Assert HIPAA compliant response (no PHI in error messages)
 */
export function assertHIPAACompliant(response: { data?: { message?: string } }): void {
  if (response.data?.message) {
    const message = response.data.message.toLowerCase();

    // Error messages should not reveal PHI
    expect(message).not.toContain('ssn');
    expect(message).not.toContain('social security');
    expect(message).not.toContain('date of birth');
    expect(message).not.toContain('medical record');
    expect(message).not.toContain('diagnosis');
    expect(message).not.toMatch(/patient.*name/);
  }
}
