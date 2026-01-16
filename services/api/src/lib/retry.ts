/**
 * Retry Logic with Exponential Backoff and Jitter
 *
 * Implements configurable retry mechanisms for transient failures
 * in distributed systems.
 */

import { logger } from '../utils/logger.js';

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;      // Initial delay in milliseconds
  maxDelay: number;          // Maximum delay in milliseconds
  backoffMultiplier: number; // Exponential backoff multiplier
  jitter: boolean;           // Add randomness to prevent thundering herd
  retryableErrors?: string[]; // Error codes/types that should trigger retry
  onRetry?: (error: Error, attempt: number, delay: number) => void | Promise<void>;
}

export interface RetryResult<T> {
  result: T;
  attempts: number;
  totalDelay: number;
}

export class RetryError extends Error {
  public readonly attempts: number;
  public readonly lastError: Error;

  constructor(message: string, attempts: number, lastError: Error) {
    super(message);
    this.name = 'RetryError';
    this.attempts = attempts;
    this.lastError = lastError;
  }
}

/**
 * Default retry configuration
 */
export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitter: true
};

/**
 * Calculate delay with exponential backoff and optional jitter
 */
export function calculateDelay(
  attempt: number,
  config: RetryConfig
): number {
  const exponentialDelay = Math.min(
    config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1),
    config.maxDelay
  );

  if (!config.jitter) {
    return exponentialDelay;
  }

  // Add jitter: random value between 0 and exponentialDelay
  return Math.random() * exponentialDelay;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(
  error: Error,
  retryableErrors?: string[]
): boolean {
  if (!retryableErrors || retryableErrors.length === 0) {
    // By default, retry on common transient errors
    const retryableErrorNames = [
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ENETUNREACH',
      'EAI_AGAIN',
      'ECONNRESET',
      'EPIPE',
      'NetworkError',
      'TimeoutError'
    ];

    return retryableErrorNames.some(
      name =>
        error.name === name ||
        error.message.includes(name) ||
        (error as any).code === name
    );
  }

  return retryableErrors.some(
    retryable =>
      error.name === retryable ||
      error.message.includes(retryable) ||
      (error as any).code === retryable
  );
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = defaultRetryConfig
): Promise<RetryResult<T>> {
  let lastError: Error;
  let totalDelay = 0;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const result = await fn();

      logger.debug('Retry succeeded', { attempt, totalDelay });

      return {
        result,
        attempts: attempt,
        totalDelay
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error is retryable
      if (!isRetryableError(lastError, config.retryableErrors)) {
        logger.warn('Non-retryable error encountered', {
          error: lastError.message,
          attempt
        });
        throw lastError;
      }

      // Don't retry if we've exhausted attempts
      if (attempt === config.maxAttempts) {
        break;
      }

      const delay = calculateDelay(attempt, config);
      totalDelay += delay;

      logger.warn('Retry attempt failed, retrying...', {
        attempt,
        maxAttempts: config.maxAttempts,
        delay,
        error: lastError.message
      });

      // Call onRetry callback if provided
      if (config.onRetry) {
        await config.onRetry(lastError, attempt, delay);
      }

      await sleep(delay);
    }
  }

  throw new RetryError(
    `Failed after ${config.maxAttempts} attempts: ${lastError!.message}`,
    config.maxAttempts,
    lastError!
  );
}

/**
 * Retry decorator for class methods
 */
export function Retry(config: Partial<RetryConfig> = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const retryConfig = { ...defaultRetryConfig, ...config };

    descriptor.value = async function (...args: any[]) {
      return retry(
        () => originalMethod.apply(this, args),
        retryConfig
      ).then(result => result.result);
    };

    return descriptor;
  };
}

/**
 * Retry with custom predicate
 */
export async function retryWithPredicate<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: Error) => boolean,
  config: RetryConfig = defaultRetryConfig
): Promise<RetryResult<T>> {
  let lastError: Error;
  let totalDelay = 0;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const result = await fn();

      return {
        result,
        attempts: attempt,
        totalDelay
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (!shouldRetry(lastError) || attempt === config.maxAttempts) {
        throw lastError;
      }

      const delay = calculateDelay(attempt, config);
      totalDelay += delay;

      logger.warn('Retry with predicate failed, retrying...', {
        attempt,
        delay,
        error: lastError.message
      });

      if (config.onRetry) {
        await config.onRetry(lastError, attempt, delay);
      }

      await sleep(delay);
    }
  }

  throw new RetryError(
    `Failed after ${config.maxAttempts} attempts: ${lastError!.message}`,
    config.maxAttempts,
    lastError!
  );
}

/**
 * Retry with timeout
 */
export async function retryWithTimeout<T>(
  fn: () => Promise<T>,
  config: RetryConfig & { timeout: number }
): Promise<RetryResult<T>> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error(`Operation timed out after ${config.timeout}ms`)),
      config.timeout
    );
  });

  return Promise.race([retry(fn, config), timeoutPromise]);
}

/**
 * Batch retry - retry multiple operations with shared configuration
 */
export async function retryBatch<T>(
  operations: Array<() => Promise<T>>,
  config: RetryConfig = defaultRetryConfig
): Promise<Array<RetryResult<T>>> {
  return Promise.all(
    operations.map(operation => retry(operation, config))
  );
}

/**
 * Retry configurations for common scenarios
 */
export const RetryPresets = {
  // Quick retry for fast operations (API calls)
  quick: {
    maxAttempts: 3,
    initialDelay: 500,
    maxDelay: 5000,
    backoffMultiplier: 2,
    jitter: true
  } as RetryConfig,

  // Standard retry for normal operations
  standard: {
    maxAttempts: 5,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitter: true
  } as RetryConfig,

  // Aggressive retry for critical operations
  aggressive: {
    maxAttempts: 10,
    initialDelay: 2000,
    maxDelay: 60000,
    backoffMultiplier: 2,
    jitter: true
  } as RetryConfig,

  // Database operations
  database: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    jitter: true,
    retryableErrors: [
      'ECONNREFUSED',
      'ETIMEDOUT',
      'PROTOCOL_CONNECTION_LOST',
      'ER_LOCK_DEADLOCK',
      'ER_LOCK_WAIT_TIMEOUT'
    ]
  } as RetryConfig,

  // External API calls
  externalApi: {
    maxAttempts: 5,
    initialDelay: 2000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitter: true,
    retryableErrors: [
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'NetworkError',
      'TimeoutError',
      'RATE_LIMIT_ERROR'
    ]
  } as RetryConfig,

  // File operations
  fileOperation: {
    maxAttempts: 3,
    initialDelay: 500,
    maxDelay: 5000,
    backoffMultiplier: 2,
    jitter: false
  } as RetryConfig
};

/**
 * Helper to create a retry wrapper for a specific service
 */
export function createRetryWrapper<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  config: RetryConfig = defaultRetryConfig
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const result = await retry(() => fn(...args), config);
    return result.result;
  };
}

/**
 * Retry with circuit breaker integration
 */
export async function retryWithCircuitBreaker<T>(
  fn: () => Promise<T>,
  circuitBreaker: { execute: <T>(fn: () => Promise<T>) => Promise<T> },
  config: RetryConfig = defaultRetryConfig
): Promise<RetryResult<T>> {
  return retry(() => circuitBreaker.execute(fn), config);
}
