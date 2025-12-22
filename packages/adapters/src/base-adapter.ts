/**
 * Base Adapter Implementation
 * Abstract base class for all healthcare provider adapters
 */

import {
  AdapterConfig,
  AdapterContext,
  AdapterRequest,
  AdapterResponse,
  AdapterError,
  AdapterEvent,
  AdapterEventType,
  AdapterStatus,
} from './types';

/**
 * Circuit breaker state
 */
interface CircuitBreakerState {
  failures: number;
  lastFailure: Date | null;
  state: 'closed' | 'open' | 'half-open';
  nextRetry: Date | null;
}

/**
 * Abstract base adapter class
 */
export abstract class BaseAdapter {
  protected config: AdapterConfig;
  protected circuitBreaker: CircuitBreakerState;
  protected eventHandlers: ((event: AdapterEvent) => void)[] = [];

  // Circuit breaker settings
  protected readonly failureThreshold = 5;
  protected readonly resetTimeoutMs = 30000;
  protected readonly halfOpenRequests = 3;

  constructor(config: AdapterConfig) {
    this.config = config;
    this.circuitBreaker = {
      failures: 0,
      lastFailure: null,
      state: 'closed',
      nextRetry: null,
    };
  }

  /**
   * Get adapter ID
   */
  get id(): string {
    return this.config.id;
  }

  /**
   * Get adapter type
   */
  get type(): string {
    return this.config.type;
  }

  /**
   * Get adapter status
   */
  get status(): AdapterStatus {
    return this.config.status;
  }

  /**
   * Execute an adapter request with retry, circuit breaker, and error handling
   */
  async execute<T, R>(request: AdapterRequest<T>): Promise<AdapterResponse<R>> {
    const startTime = Date.now();

    // Check circuit breaker
    if (this.isCircuitOpen()) {
      return this.createErrorResponse(request, {
        code: 'CIRCUIT_OPEN',
        message: 'Circuit breaker is open, request rejected',
        retryable: true,
        retryDelayMs: this.getCircuitRetryDelay(),
      }, startTime);
    }

    // Emit request sent event
    this.emitEvent(AdapterEventType.REQUEST_SENT, request.context.requestId, {
      operation: request.operation,
    });

    let lastError: AdapterError | null = null;
    const maxRetries = this.config.retry?.maxRetries ?? 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Execute the actual request
        const response = await this.executeRequest<T, R>(request);

        // Success - reset circuit breaker
        this.onSuccess();

        // Emit success event
        this.emitEvent(AdapterEventType.REQUEST_SUCCESS, request.context.requestId, {
          operation: request.operation,
          durationMs: Date.now() - startTime,
          statusCode: response.metadata.statusCode,
        });

        return response;
      } catch (error) {
        lastError = this.normalizeError(error);

        // Record failure for circuit breaker
        this.onFailure();

        // Check if retryable
        if (!lastError.retryable || attempt === maxRetries) {
          break;
        }

        // Emit retry event
        this.emitEvent(AdapterEventType.REQUEST_RETRIED, request.context.requestId, {
          operation: request.operation,
          attempt: attempt + 1,
          error: lastError.code,
        });

        // Wait before retry
        const delay = this.calculateRetryDelay(attempt);
        await this.sleep(delay);
      }
    }

    // All retries exhausted
    this.emitEvent(AdapterEventType.REQUEST_FAILED, request.context.requestId, {
      operation: request.operation,
      error: lastError?.code,
      durationMs: Date.now() - startTime,
    });

    return this.createErrorResponse(request, lastError!, startTime);
  }

  /**
   * Abstract method to execute the actual request
   * Must be implemented by concrete adapters
   */
  protected abstract executeRequest<T, R>(request: AdapterRequest<T>): Promise<AdapterResponse<R>>;

  /**
   * Health check
   */
  async healthCheck(): Promise<{ healthy: boolean; latencyMs: number; error?: string }> {
    const startTime = Date.now();
    try {
      await this.performHealthCheck();
      const latencyMs = Date.now() - startTime;
      this.emitEvent(AdapterEventType.HEALTH_CHECK_PASSED, undefined, { latencyMs });
      return { healthy: true, latencyMs };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.emitEvent(AdapterEventType.HEALTH_CHECK_FAILED, undefined, { latencyMs, error: errorMessage });
      return { healthy: false, latencyMs, error: errorMessage };
    }
  }

  /**
   * Abstract method for health check implementation
   */
  protected abstract performHealthCheck(): Promise<void>;

  /**
   * Register event handler
   */
  onEvent(handler: (event: AdapterEvent) => void): void {
    this.eventHandlers.push(handler);
  }

  /**
   * Emit an event
   */
  protected emitEvent(
    type: AdapterEventType,
    requestId?: string,
    data?: Record<string, any>
  ): void {
    const event: AdapterEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      adapterId: this.config.id,
      requestId,
      data,
      timestamp: new Date(),
    };

    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in event handler:', error);
      }
    }
  }

  // ============================================================================
  // CIRCUIT BREAKER
  // ============================================================================

  private isCircuitOpen(): boolean {
    if (this.circuitBreaker.state === 'closed') {
      return false;
    }

    if (this.circuitBreaker.state === 'open') {
      // Check if we should move to half-open
      if (this.circuitBreaker.nextRetry && new Date() >= this.circuitBreaker.nextRetry) {
        this.circuitBreaker.state = 'half-open';
        return false;
      }
      return true;
    }

    // half-open state - allow limited requests
    return false;
  }

  private getCircuitRetryDelay(): number {
    if (this.circuitBreaker.nextRetry) {
      return Math.max(0, this.circuitBreaker.nextRetry.getTime() - Date.now());
    }
    return this.resetTimeoutMs;
  }

  private onSuccess(): void {
    if (this.circuitBreaker.state === 'half-open') {
      // Success in half-open state - close circuit
      this.circuitBreaker.state = 'closed';
      this.circuitBreaker.failures = 0;
      this.emitEvent(AdapterEventType.CIRCUIT_CLOSED);
    }
    this.circuitBreaker.failures = 0;
  }

  private onFailure(): void {
    this.circuitBreaker.failures++;
    this.circuitBreaker.lastFailure = new Date();

    if (this.circuitBreaker.state === 'half-open') {
      // Failure in half-open state - open circuit again
      this.openCircuit();
    } else if (this.circuitBreaker.failures >= this.failureThreshold) {
      // Threshold reached - open circuit
      this.openCircuit();
    }
  }

  private openCircuit(): void {
    this.circuitBreaker.state = 'open';
    this.circuitBreaker.nextRetry = new Date(Date.now() + this.resetTimeoutMs);
    this.emitEvent(AdapterEventType.CIRCUIT_OPENED, undefined, {
      failures: this.circuitBreaker.failures,
      nextRetry: this.circuitBreaker.nextRetry,
    });
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private normalizeError(error: unknown): AdapterError {
    if (this.isAdapterError(error)) {
      return error;
    }

    if (error instanceof Error) {
      // Check for retryable errors
      const retryable = this.isRetryableError(error);
      return {
        code: 'ADAPTER_ERROR',
        message: error.message,
        details: error.stack,
        retryable,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error,
      retryable: false,
    };
  }

  private isAdapterError(error: unknown): error is AdapterError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error &&
      'retryable' in error
    );
  }

  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('timeout') ||
      message.includes('connection') ||
      message.includes('network') ||
      message.includes('econnrefused') ||
      message.includes('enotfound') ||
      message.includes('503') ||
      message.includes('429')
    );
  }

  private calculateRetryDelay(attempt: number): number {
    const baseDelay = this.config.retry?.backoffMs ?? 1000;
    const multiplier = this.config.retry?.backoffMultiplier ?? 2;
    return baseDelay * Math.pow(multiplier, attempt);
  }

  private createErrorResponse<T, R>(
    request: AdapterRequest<T>,
    error: AdapterError,
    startTime: number
  ): AdapterResponse<R> {
    return {
      success: false,
      error,
      metadata: {
        requestId: request.context.requestId,
        adapterId: this.config.id,
        durationMs: Date.now() - startTime,
      },
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
