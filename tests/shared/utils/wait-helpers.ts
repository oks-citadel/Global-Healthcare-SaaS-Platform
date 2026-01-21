/**
 * Wait Helpers
 * Utilities for waiting and polling in tests
 */

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: {
    timeout?: number;
    interval?: number;
    message?: string;
  } = {}
): Promise<void> {
  const { timeout = 10000, interval = 100, message = 'Condition not met within timeout' } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) {
      return;
    }
    await sleep(interval);
  }

  throw new Error(message);
}

/**
 * Wait for a value to be defined
 */
export async function waitForValue<T>(
  getter: () => T | undefined | null | Promise<T | undefined | null>,
  options: {
    timeout?: number;
    interval?: number;
    message?: string;
  } = {}
): Promise<T> {
  const { timeout = 10000, interval = 100, message = 'Value not defined within timeout' } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const value = await getter();
    if (value !== undefined && value !== null) {
      return value;
    }
    await sleep(interval);
  }

  throw new Error(message);
}

/**
 * Retry a function until it succeeds or max retries reached
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    backoff?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, delay = 1000, backoff = 2, onRetry } = options;

  let lastError: Error;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        if (onRetry) {
          onRetry(lastError, attempt);
        }
        await sleep(currentDelay);
        currentDelay *= backoff;
      }
    }
  }

  throw lastError!;
}

/**
 * Poll a function until it returns a truthy value
 */
export async function poll<T>(
  fn: () => Promise<T>,
  options: {
    timeout?: number;
    interval?: number;
    predicate?: (value: T) => boolean;
    message?: string;
  } = {}
): Promise<T> {
  const {
    timeout = 30000,
    interval = 1000,
    predicate = (v) => Boolean(v),
    message = 'Poll condition not met within timeout',
  } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await fn();
    if (predicate(result)) {
      return result;
    }
    await sleep(interval);
  }

  throw new Error(message);
}

/**
 * Wait for an element count to stabilize (useful for loading states)
 */
export async function waitForStableCount(
  getCount: () => Promise<number>,
  options: {
    timeout?: number;
    checkInterval?: number;
    stabilityDuration?: number;
  } = {}
): Promise<number> {
  const { timeout = 10000, checkInterval = 200, stabilityDuration = 1000 } = options;

  const startTime = Date.now();
  let lastCount = -1;
  let stableStartTime = 0;

  while (Date.now() - startTime < timeout) {
    const currentCount = await getCount();

    if (currentCount === lastCount) {
      if (Date.now() - stableStartTime >= stabilityDuration) {
        return currentCount;
      }
    } else {
      lastCount = currentCount;
      stableStartTime = Date.now();
    }

    await sleep(checkInterval);
  }

  return lastCount;
}

/**
 * Execute with timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

/**
 * Debounce helper for tests
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        resolve(fn(...args) as ReturnType<T>);
      }, delay);
    });
  };
}
