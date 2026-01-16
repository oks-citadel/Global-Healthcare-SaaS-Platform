/**
 * Shared Utilities
 */
import { randomUUID } from 'crypto';

// ============================================================================
// ID Generation
// ============================================================================

export function generateId(): string {
  return randomUUID();
}

export function generateShortId(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ============================================================================
// Slug Generation
// ============================================================================

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateUniqueSlug(text: string, existingSlugs: string[]): string {
  let slug = generateSlug(text);
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${generateSlug(text)}-${counter}`;
    counter++;
  }

  return slug;
}

// ============================================================================
// URL Utilities
// ============================================================================

export function buildUrl(base: string, path: string, params?: Record<string, string>): string {
  const url = new URL(path, base);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

export function parseQueryParams(url: string): Record<string, string> {
  const urlObj = new URL(url);
  const params: Record<string, string> = {};

  for (const [key, value] of urlObj.searchParams.entries()) {
    params[key] = value;
  }

  return params;
}

export function buildUtmUrl(
  baseUrl: string,
  utm: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
  }
): string {
  const url = new URL(baseUrl);

  url.searchParams.set('utm_source', utm.source);
  url.searchParams.set('utm_medium', utm.medium);
  url.searchParams.set('utm_campaign', utm.campaign);

  if (utm.term) {
    url.searchParams.set('utm_term', utm.term);
  }

  if (utm.content) {
    url.searchParams.set('utm_content', utm.content);
  }

  return url.toString();
}

export function parseUtmParams(url: string): {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
} {
  const urlObj = new URL(url);

  return {
    source: urlObj.searchParams.get('utm_source') ?? undefined,
    medium: urlObj.searchParams.get('utm_medium') ?? undefined,
    campaign: urlObj.searchParams.get('utm_campaign') ?? undefined,
    term: urlObj.searchParams.get('utm_term') ?? undefined,
    content: urlObj.searchParams.get('utm_content') ?? undefined,
  };
}

// ============================================================================
// Date Utilities
// ============================================================================

export function formatIsoDate(date: Date): string {
  return date.toISOString();
}

export function parseIsoDate(dateString: string): Date {
  return new Date(dateString);
}

export function getStartOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getEndOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function daysBetween(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ============================================================================
// String Utilities
// ============================================================================

export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - suffix.length) + suffix;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function camelToSnake(text: string): string {
  return text.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export function snakeToCamel(text: string): string {
  return text.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// ============================================================================
// Object Utilities
// ============================================================================

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else {
      (result as Record<string, unknown>)[key] = sourceValue;
    }
  }

  return result;
}

// ============================================================================
// Array Utilities
// ============================================================================

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

// ============================================================================
// Number Utilities
// ============================================================================

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function percentage(part: number, total: number, decimals = 2): number {
  if (total === 0) return 0;
  return Number(((part / total) * 100).toFixed(decimals));
}

export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCurrency(value: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

// ============================================================================
// Hash Utilities
// ============================================================================

export function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function consistentBucket(identifier: string, buckets: number): number {
  return simpleHash(identifier) % buckets;
}

// ============================================================================
// Retry Utilities
// ============================================================================

export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    backoffMultiplier?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// ============================================================================
// NPS Utilities
// ============================================================================

export function categorizeNpsScore(score: number): 'promoter' | 'passive' | 'detractor' {
  if (score >= 9) return 'promoter';
  if (score >= 7) return 'passive';
  return 'detractor';
}

export function calculateNpsScore(scores: number[]): number {
  if (scores.length === 0) return 0;

  let promoters = 0;
  let detractors = 0;

  for (const score of scores) {
    const category = categorizeNpsScore(score);
    if (category === 'promoter') promoters++;
    else if (category === 'detractor') detractors++;
  }

  return Math.round(((promoters - detractors) / scores.length) * 100);
}
