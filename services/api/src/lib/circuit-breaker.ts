/**
 * Circuit Breaker Pattern Implementation
 *
 * Prevents cascading failures by stopping calls to failing services
 * and providing fallback mechanisms.
 */

import { logger } from '../utils/logger.js';

export enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Service failing, rejecting all calls
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

export interface CircuitBreakerConfig {
  name: string;
  failureThreshold: number;      // Number of failures before opening
  successThreshold: number;       // Number of successes to close from half-open
  timeout: number;                // Time in ms before attempting recovery
  monitoringPeriod: number;       // Time window for failure counting (ms)
  volumeThreshold: number;        // Minimum calls before considering stats
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  totalCalls: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  nextAttempt?: Date;
}

export class CircuitBreakerOpenError extends Error {
  constructor(serviceName: string, nextAttempt: Date) {
    super(
      `Circuit breaker is OPEN for service "${serviceName}". ` +
      `Next attempt at ${nextAttempt.toISOString()}`
    );
    this.name = 'CircuitBreakerOpenError';
  }
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successes: number = 0;
  private consecutiveSuccesses: number = 0;
  private consecutiveFailures: number = 0;
  private totalCalls: number = 0;
  private lastFailureTime?: Date;
  private lastSuccessTime?: Date;
  private nextAttempt?: Date;
  private failureTimestamps: number[] = [];

  constructor(private config: CircuitBreakerConfig) {
    logger.info(`Circuit breaker initialized for ${config.name}`, {
      config: this.config
    });
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(
    fn: () => Promise<T>,
    fallback?: () => Promise<T> | T
  ): Promise<T> {
    this.totalCalls++;

    // Check if circuit is open
    if (this.state === CircuitState.OPEN) {
      if (this.nextAttempt && Date.now() < this.nextAttempt.getTime()) {
        logger.warn(`Circuit breaker OPEN for ${this.config.name}`, {
          nextAttempt: this.nextAttempt,
          stats: this.getStats()
        });

        if (fallback) {
          return typeof fallback === 'function' ? await fallback() : fallback;
        }

        throw new CircuitBreakerOpenError(this.config.name, this.nextAttempt);
      }

      // Transition to half-open to test service
      this.transitionTo(CircuitState.HALF_OPEN);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();

      // If we have a fallback, use it
      if (fallback) {
        logger.info(`Using fallback for ${this.config.name}`, {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        return typeof fallback === 'function' ? await fallback() : fallback;
      }

      throw error;
    }
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.successes++;
    this.consecutiveSuccesses++;
    this.consecutiveFailures = 0;
    this.lastSuccessTime = new Date();

    // Clean old failure timestamps
    this.cleanOldFailures();

    if (this.state === CircuitState.HALF_OPEN) {
      if (this.consecutiveSuccesses >= this.config.successThreshold) {
        this.transitionTo(CircuitState.CLOSED);
        this.reset();
      }
    }

    logger.debug(`Circuit breaker success for ${this.config.name}`, {
      consecutiveSuccesses: this.consecutiveSuccesses,
      state: this.state
    });
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.failures++;
    this.consecutiveFailures++;
    this.consecutiveSuccesses = 0;
    this.lastFailureTime = new Date();
    this.failureTimestamps.push(Date.now());

    // Clean old failure timestamps
    this.cleanOldFailures();

    logger.warn(`Circuit breaker failure for ${this.config.name}`, {
      consecutiveFailures: this.consecutiveFailures,
      failuresInWindow: this.failureTimestamps.length,
      state: this.state
    });

    // Check if we should open the circuit
    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionTo(CircuitState.OPEN);
      this.scheduleNextAttempt();
    } else if (
      this.state === CircuitState.CLOSED &&
      this.totalCalls >= this.config.volumeThreshold &&
      this.failureTimestamps.length >= this.config.failureThreshold
    ) {
      this.transitionTo(CircuitState.OPEN);
      this.scheduleNextAttempt();
    }
  }

  /**
   * Remove failure timestamps outside the monitoring period
   */
  private cleanOldFailures(): void {
    const cutoff = Date.now() - this.config.monitoringPeriod;
    this.failureTimestamps = this.failureTimestamps.filter(
      timestamp => timestamp > cutoff
    );
  }

  /**
   * Transition to a new state
   */
  private transitionTo(newState: CircuitState): void {
    const oldState = this.state;
    this.state = newState;

    logger.info(`Circuit breaker state transition for ${this.config.name}`, {
      from: oldState,
      to: newState,
      stats: this.getStats()
    });
  }

  /**
   * Schedule the next attempt after timeout
   */
  private scheduleNextAttempt(): void {
    this.nextAttempt = new Date(Date.now() + this.config.timeout);
  }

  /**
   * Reset the circuit breaker
   */
  private reset(): void {
    this.consecutiveSuccesses = 0;
    this.consecutiveFailures = 0;
    this.failureTimestamps = [];
    this.nextAttempt = undefined;

    logger.info(`Circuit breaker reset for ${this.config.name}`);
  }

  /**
   * Force open the circuit breaker
   */
  public forceOpen(): void {
    this.transitionTo(CircuitState.OPEN);
    this.scheduleNextAttempt();
  }

  /**
   * Force close the circuit breaker
   */
  public forceClose(): void {
    this.transitionTo(CircuitState.CLOSED);
    this.reset();
  }

  /**
   * Get current statistics
   */
  public getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      consecutiveSuccesses: this.consecutiveSuccesses,
      consecutiveFailures: this.consecutiveFailures,
      totalCalls: this.totalCalls,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      nextAttempt: this.nextAttempt
    };
  }

  /**
   * Get the current state
   */
  public getState(): CircuitState {
    return this.state;
  }

  /**
   * Check if the circuit is healthy
   */
  public isHealthy(): boolean {
    return this.state === CircuitState.CLOSED;
  }
}

/**
 * Circuit Breaker Manager
 *
 * Manages multiple circuit breakers for different services
 */
export class CircuitBreakerManager {
  private breakers: Map<string, CircuitBreaker> = new Map();

  /**
   * Get or create a circuit breaker for a service
   */
  public getBreaker(config: CircuitBreakerConfig): CircuitBreaker {
    const existing = this.breakers.get(config.name);
    if (existing) {
      return existing;
    }

    const breaker = new CircuitBreaker(config);
    this.breakers.set(config.name, breaker);
    return breaker;
  }

  /**
   * Get all breakers stats
   */
  public getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};

    this.breakers.forEach((breaker, name) => {
      stats[name] = breaker.getStats();
    });

    return stats;
  }

  /**
   * Check if all breakers are healthy
   */
  public isAllHealthy(): boolean {
    return Array.from(this.breakers.values()).every(breaker =>
      breaker.isHealthy()
    );
  }
}

// Global circuit breaker manager instance
export const circuitBreakerManager = new CircuitBreakerManager();

// Predefined circuit breakers for common services
export const emailCircuitBreaker = circuitBreakerManager.getBreaker({
  name: 'email-service',
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 60000, // 1 minute
  monitoringPeriod: 120000, // 2 minutes
  volumeThreshold: 10
});

export const smsCircuitBreaker = circuitBreakerManager.getBreaker({
  name: 'sms-service',
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 60000,
  monitoringPeriod: 120000,
  volumeThreshold: 10
});

export const paymentCircuitBreaker = circuitBreakerManager.getBreaker({
  name: 'payment-service',
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 120000, // 2 minutes
  monitoringPeriod: 300000, // 5 minutes
  volumeThreshold: 5
});

export const storageCircuitBreaker = circuitBreakerManager.getBreaker({
  name: 'storage-service',
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30000, // 30 seconds
  monitoringPeriod: 120000,
  volumeThreshold: 10
});
