/**
 * Shared Metrics Library for All Microservices
 * Standardized metrics collection across the The Unified Health Platform
 */

import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';
import { Request, Response, NextFunction } from 'express';

export interface MetricsConfig {
  serviceName: string;
  prefix?: string;
  defaultLabels?: Record<string, string>;
  collectDefaultMetrics?: boolean;
}

/**
 * Centralized metrics service for microservices
 */
export class ServiceMetrics {
  public readonly register: Registry;
  private serviceName: string;
  private prefix: string;

  // HTTP Metrics
  public httpRequestDuration: Histogram<string>;
  public httpRequestCounter: Counter<string>;
  public activeConnections: Gauge<string>;

  // Database Metrics
  public dbQueryDuration: Histogram<string>;
  public dbConnectionPoolActive: Gauge<string>;
  public dbConnectionPoolIdle: Gauge<string>;
  public dbConnectionPoolWaiting: Gauge<string>;

  // Error Metrics
  public errorCounter: Counter<string>;
  public criticalErrorCounter: Counter<string>;

  // Cache Metrics
  public cacheHits: Counter<string>;
  public cacheMisses: Counter<string>;
  public cacheSize: Gauge<string>;

  // External Service Metrics
  public externalServiceCalls: Counter<string>;
  public externalServiceDuration: Histogram<string>;

  // Rate Limiting
  public rateLimitExceeded: Counter<string>;

  constructor(config: MetricsConfig) {
    this.serviceName = config.serviceName;
    this.prefix = config.prefix || '';
    this.register = new Registry();

    // Set default labels
    this.register.setDefaultLabels({
      service: this.serviceName,
      ...config.defaultLabels,
    });

    // Enable default metrics collection (CPU, memory, etc.)
    if (config.collectDefaultMetrics !== false) {
      collectDefaultMetrics({ register: this.register, prefix: this.prefix });
    }

    // Initialize HTTP metrics
    this.httpRequestDuration = new Histogram({
      name: this.metricName('http_request_duration_seconds'),
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 5],
      registers: [this.register],
    });

    this.httpRequestCounter = new Counter({
      name: this.metricName('http_requests_total'),
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.activeConnections = new Gauge({
      name: this.metricName('http_active_connections'),
      help: 'Number of active HTTP connections',
      registers: [this.register],
    });

    // Initialize database metrics
    this.dbQueryDuration = new Histogram({
      name: this.metricName('db_query_duration_seconds'),
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'table', 'status'],
      buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
      registers: [this.register],
    });

    this.dbConnectionPoolActive = new Gauge({
      name: this.metricName('db_connection_pool_active'),
      help: 'Number of active database connections in the pool',
      registers: [this.register],
    });

    this.dbConnectionPoolIdle = new Gauge({
      name: this.metricName('db_connection_pool_idle'),
      help: 'Number of idle database connections in the pool',
      registers: [this.register],
    });

    this.dbConnectionPoolWaiting = new Gauge({
      name: this.metricName('db_connection_pool_waiting'),
      help: 'Number of requests waiting for a database connection',
      registers: [this.register],
    });

    // Initialize error metrics
    this.errorCounter = new Counter({
      name: this.metricName('errors_total'),
      help: 'Total number of errors',
      labelNames: ['type', 'route', 'status_code'],
      registers: [this.register],
    });

    this.criticalErrorCounter = new Counter({
      name: this.metricName('critical_errors_total'),
      help: 'Total number of critical errors',
      labelNames: ['type', 'component'],
      registers: [this.register],
    });

    // Initialize cache metrics
    this.cacheHits = new Counter({
      name: this.metricName('cache_hits_total'),
      help: 'Total number of cache hits',
      labelNames: ['cache_name', 'operation'],
      registers: [this.register],
    });

    this.cacheMisses = new Counter({
      name: this.metricName('cache_misses_total'),
      help: 'Total number of cache misses',
      labelNames: ['cache_name', 'operation'],
      registers: [this.register],
    });

    this.cacheSize = new Gauge({
      name: this.metricName('cache_size_bytes'),
      help: 'Current size of cache in bytes',
      labelNames: ['cache_name'],
      registers: [this.register],
    });

    // Initialize external service metrics
    this.externalServiceCalls = new Counter({
      name: this.metricName('external_service_calls_total'),
      help: 'Total number of external service calls',
      labelNames: ['service', 'operation', 'status'],
      registers: [this.register],
    });

    this.externalServiceDuration = new Histogram({
      name: this.metricName('external_service_duration_seconds'),
      help: 'Duration of external service calls in seconds',
      labelNames: ['service', 'operation'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 30],
      registers: [this.register],
    });

    // Initialize rate limiting metrics
    this.rateLimitExceeded = new Counter({
      name: this.metricName('rate_limit_exceeded_total'),
      help: 'Total number of rate limit violations',
      labelNames: ['endpoint', 'client'],
      registers: [this.register],
    });
  }

  /**
   * Create metric name with optional prefix
   */
  private metricName(name: string): string {
    return this.prefix ? `${this.prefix}_${name}` : name;
  }

  /**
   * Get metrics in Prometheus format
   */
  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  /**
   * Get content type for metrics endpoint
   */
  getContentType(): string {
    return this.register.contentType;
  }

  /**
   * Normalize route path (remove IDs and dynamic segments)
   */
  normalizePath(path: string): string {
    return path
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/\d+/g, '/:id')
      .replace(/\/[a-f0-9]{24}/g, '/:id');
  }

  /**
   * Express middleware for automatic HTTP metrics collection
   */
  createMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const startTime = Date.now();

      // Increment active connections
      this.activeConnections.inc();

      // Store the original end function
      const originalEnd = res.end;

      // Override the end function to collect metrics
      res.end = function (this: Response, ...args: any[]): Response {
        // Calculate request duration
        const duration = (Date.now() - startTime) / 1000;

        // Normalize the path
        const normalizedPath = this.req.route?.path || this.req.path;

        // Record metrics
        this.httpRequestDuration.observe(
          {
            method: req.method,
            route: normalizedPath,
            status_code: res.statusCode.toString(),
          },
          duration
        );

        this.httpRequestCounter.inc({
          method: req.method,
          route: normalizedPath,
          status_code: res.statusCode.toString(),
        });

        // Record errors
        if (res.statusCode >= 400) {
          this.errorCounter.inc({
            type: res.statusCode >= 500 ? 'server_error' : 'client_error',
            route: normalizedPath,
            status_code: res.statusCode.toString(),
          });
        }

        // Decrement active connections
        this.activeConnections.dec();

        // Call the original end function
        return originalEnd.apply(this, args);
      }.bind({ req, res, httpRequestDuration: this.httpRequestDuration, httpRequestCounter: this.httpRequestCounter, errorCounter: this.errorCounter, activeConnections: this.activeConnections });

      next();
    };
  }

  /**
   * Track a database query
   */
  trackDatabaseQuery(
    operation: string,
    table: string,
    durationMs: number,
    success: boolean
  ): void {
    this.dbQueryDuration.observe(
      {
        operation,
        table,
        status: success ? 'success' : 'error',
      },
      durationMs / 1000
    );

    if (!success) {
      this.errorCounter.inc({
        type: 'database_error',
        route: table,
        status_code: 'db_error',
      });
    }
  }

  /**
   * Track external service call
   */
  trackExternalServiceCall(
    service: string,
    operation: string,
    durationMs: number,
    success: boolean
  ): void {
    this.externalServiceCalls.inc({
      service,
      operation,
      status: success ? 'success' : 'error',
    });

    this.externalServiceDuration.observe(
      {
        service,
        operation,
      },
      durationMs / 1000
    );
  }

  /**
   * Track cache operation
   */
  trackCacheOperation(
    cacheName: string,
    operation: 'get' | 'set' | 'delete',
    hit: boolean
  ): void {
    if (hit) {
      this.cacheHits.inc({ cache_name: cacheName, operation });
    } else {
      this.cacheMisses.inc({ cache_name: cacheName, operation });
    }
  }

  /**
   * Track critical error
   */
  trackCriticalError(type: string, component: string): void {
    this.criticalErrorCounter.inc({ type, component });
  }

  /**
   * Track rate limit violation
   */
  trackRateLimitViolation(endpoint: string, client: string): void {
    this.rateLimitExceeded.inc({ endpoint, client });
  }
}

/**
 * Create metrics router for Express
 */
export function createMetricsRouter(metrics: ServiceMetrics) {
  return async (req: Request, res: Response) => {
    try {
      res.set('Content-Type', metrics.getContentType());
      const metricsOutput = await metrics.getMetrics();
      res.send(metricsOutput);
    } catch (error) {
      res.status(500).send('Error collecting metrics');
    }
  };
}

/**
 * Helper to measure async function execution time
 */
export async function measureAsync<T>(
  fn: () => Promise<T>,
  onComplete: (durationMs: number, error?: Error) => void
): Promise<T> {
  const startTime = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    onComplete(duration);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    onComplete(duration, error as Error);
    throw error;
  }
}

/**
 * Helper to measure sync function execution time
 */
export function measure<T>(
  fn: () => T,
  onComplete: (durationMs: number, error?: Error) => void
): T {
  const startTime = Date.now();
  try {
    const result = fn();
    const duration = Date.now() - startTime;
    onComplete(duration);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    onComplete(duration, error as Error);
    throw error;
  }
}

/**
 * Example usage for a microservice
 */
export function createServiceMetrics(serviceName: string): ServiceMetrics {
  return new ServiceMetrics({
    serviceName,
    collectDefaultMetrics: true,
    defaultLabels: {
      environment: process.env.NODE_ENV || 'development',
      version: process.env.APP_VERSION || '1.0.0',
    },
  });
}
