/**
 * Global Error Handling Hook
 *
 * Provides centralized error handling with toast notifications
 * and retry actions for the frontend.
 */

import { useCallback, useState } from 'react';

export interface ErrorState {
  error: Error | null;
  message: string | null;
  code?: string;
  retryAction?: () => void | Promise<void>;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  retryable?: boolean;
  onError?: (error: Error) => void;
}

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * Error handler hook for managing errors in components
 */
export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    message: null
  });

  /**
   * Handle an error with optional configuration
   */
  const handleError = useCallback(
    (error: Error | ApiError, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError = true,
        retryable = false,
        onError
      } = options;

      // Log error to console in development
      if (logError && process.env.NODE_ENV === 'development') {
        console.error('Error caught:', error);
      }

      // Extract error details
      const message = getErrorMessage(error);
      const code = (error as ApiError).code;

      // Update error state
      setErrorState({
        error,
        message,
        code
      });

      // Show toast notification if enabled
      if (showToast) {
        showErrorToast(message, code);
      }

      // Call custom error handler if provided
      if (onError) {
        onError(error);
      }

      // Report to error tracking service
      reportError(error);
    },
    []
  );

  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      message: null
    });
  }, []);

  /**
   * Set a retry action for the current error
   */
  const setRetryAction = useCallback((action: () => void | Promise<void>) => {
    setErrorState((prev) => ({
      ...prev,
      retryAction: action
    }));
  }, []);

  /**
   * Execute the retry action
   */
  const retry = useCallback(async () => {
    if (errorState.retryAction) {
      clearError();
      try {
        await errorState.retryAction();
      } catch (error) {
        handleError(error as Error);
      }
    }
  }, [errorState.retryAction, clearError, handleError]);

  return {
    error: errorState.error,
    message: errorState.message,
    code: errorState.code,
    hasError: errorState.error !== null,
    handleError,
    clearError,
    setRetryAction,
    retry,
    canRetry: errorState.retryAction !== undefined
  };
}

/**
 * Hook for handling async operations with error handling
 */
export function useAsyncError<T extends (...args: any[]) => Promise<any>>() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleError, clearError, error } = useErrorHandler();

  const execute = useCallback(
    async (fn: T, ...args: Parameters<T>): Promise<ReturnType<T> | null> => {
      setIsLoading(true);
      clearError();

      try {
        const result = await fn(...args);
        setIsLoading(false);
        return result;
      } catch (error) {
        setIsLoading(false);
        handleError(error as Error);
        return null;
      }
    },
    [handleError, clearError]
  );

  return {
    execute,
    isLoading,
    error,
    clearError
  };
}

/**
 * Hook for retrying failed operations
 */
export function useRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    backoff?: boolean;
  } = {}
) {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;
  const [attempts, setAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { handleError } = useErrorHandler();

  const retry = useCallback(async (): Promise<T | null> => {
    setIsRetrying(true);
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setAttempts(attempt);
        const result = await operation();
        setIsRetrying(false);
        setAttempts(0);
        return result;
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts) {
          const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
          await sleep(waitTime);
        }
      }
    }

    setIsRetrying(false);
    if (lastError) {
      handleError(lastError);
    }
    return null;
  }, [operation, maxAttempts, delay, backoff, handleError]);

  return {
    retry,
    attempts,
    isRetrying,
    canRetry: attempts < maxAttempts
  };
}

/**
 * Extract user-friendly error message from error object
 */
function getErrorMessage(error: Error | ApiError): string {
  // If it's an API error with a message, use that
  if ('message' in error && error.message) {
    return error.message;
  }

  // Check for specific error codes
  const code = (error as ApiError).code;
  if (code) {
    return getErrorMessageByCode(code);
  }

  // Default message
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Get user-friendly message by error code
 */
function getErrorMessageByCode(code: string): string {
  const errorMessages: Record<string, string> = {
    // Authentication
    ERR_2000: 'Invalid username or password',
    ERR_2001: 'Your session has expired. Please log in again.',
    ERR_2002: 'Invalid authentication token',
    ERR_2003: 'Authentication required',

    // Authorization
    ERR_2100: 'You do not have permission to perform this action',
    ERR_2101: 'Access to this resource is denied',

    // Validation
    ERR_1006: 'Please check your input and try again',

    // Network
    ERR_1008: 'Service is temporarily unavailable. Please try again later.',
    ERR_7000: 'Failed to send email. Please try again.',
    ERR_7001: 'Failed to send SMS. Please try again.',

    // General
    ERR_1000: 'An unexpected error occurred. Please try again.',
    ERR_1004: 'The requested resource was not found',
    ERR_1007: 'Too many requests. Please wait a moment and try again.'
  };

  return errorMessages[code] || 'An error occurred. Please try again.';
}

/**
 * Show error toast notification
 * This is a placeholder - integrate with your toast library (e.g., react-hot-toast, sonner)
 */
function showErrorToast(message: string, code?: string) {
  // Example integration with react-hot-toast:
  // toast.error(message, { id: code, duration: 5000 });

  // For now, we'll use console.error
  console.error(`[Toast] ${message}${code ? ` (${code})` : ''}`);

  // You can also dispatch a custom event that your toast component listens to
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('show-error-toast', {
        detail: { message, code }
      })
    );
  }
}

/**
 * Report error to tracking service
 */
function reportError(error: Error) {
  // This is where you would integrate with error tracking service
  // Example: Sentry.captureException(error);

  // For now, we'll just log it in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error reported:', error);
  }

  // You can also send to your backend analytics endpoint
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(() => {
      // Silently fail - don't want error reporting to cause more errors
    });
  }
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes('network') ||
    error.message.includes('fetch') ||
    error.name === 'NetworkError' ||
    error.name === 'TypeError'
  );
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: ApiError): boolean {
  return (
    error.statusCode === 401 ||
    error.code === 'ERR_2000' ||
    error.code === 'ERR_2001' ||
    error.code === 'ERR_2002' ||
    error.code === 'ERR_2003'
  );
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: ApiError): boolean {
  return error.statusCode === 422 || error.code === 'ERR_1006';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: ApiError): boolean {
  const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
  const retryableCodes = ['ERR_1008', 'ERR_7000', 'ERR_7001', 'ERR_7002'];

  return (
    (error.statusCode && retryableStatusCodes.includes(error.statusCode)) ||
    (error.code && retryableCodes.includes(error.code)) ||
    isNetworkError(error)
  );
}

/**
 * Global error handler for window errors
 */
export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') {
    return;
  }

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    // Report to error tracking
    reportError(
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason))
    );

    // Prevent default behavior (console error)
    event.preventDefault();
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);

    // Report to error tracking
    if (event.error) {
      reportError(event.error);
    }
  });
}

/**
 * Hook to setup global error handlers
 */
export function useGlobalErrorHandler() {
  if (typeof window !== 'undefined') {
    setupGlobalErrorHandler();
  }
}
