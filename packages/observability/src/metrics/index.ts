/**
 * Metrics Module
 *
 * Provides Prometheus-compatible metrics collection using prom-client.
 * Includes pre-configured HTTP, database, and custom metrics.
 */

import client, {
  Registry,
  Counter,
  Gauge,
  Histogram,
  Summary,
  collectDefaultMetrics,
} from 'prom-client';

/**
 * Metrics configuration options
 */
export interface MetricsConfig {
  enabled: boolean;
  prefix: string;
  defaultLabels: Record<string, string>;
  collectDefaultMetrics: boolean;
  httpMetrics: boolean;
  databaseMetrics: boolean;
  customMetrics: boolean;
}

let registry: Registry | null = null;
let isInitialized = false;

// Pre-defined metrics
let httpRequestDurationHistogram: Histogram | null = null;
let httpRequestTotalCounter: Counter | null = null;
let activeConnectionsGauge: Gauge | null = null;
let databaseQueryDurationHistogram: Histogram | null = null;
let databaseConnectionsGauge: Gauge | null = null;
let errorTotalCounter: Counter | null = null;

/**
 * Initialize metrics collection
 */
export function initializeMetrics(config: MetricsConfig): Registry {
  if (isInitialized && registry) {
    return registry;
  }

  if (!config.enabled) {
    registry = new Registry();
    return registry;
  }

  // Create registry
  registry = new Registry();

  // Set default labels
  registry.setDefaultLabels(config.defaultLabels);

  // Collect default Node.js metrics
  if (config.collectDefaultMetrics) {
    collectDefaultMetrics({
      register: registry,
      prefix: config.prefix + '_',
    });
  }

  // Initialize HTTP metrics
  if (config.httpMetrics) {
    httpRequestDurationHistogram = new Histogram({
      name: `${config.prefix}_http_request_duration_seconds`,
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [registry],
    });

    httpRequestTotalCounter = new Counter({
      name: `${config.prefix}_http_requests_total`,
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [registry],
    });

    activeConnectionsGauge = new Gauge({
      name: `${config.prefix}_active_connections`,
      help: 'Number of active connections',
      registers: [registry],
    });
  }

  // Initialize database metrics
  if (config.databaseMetrics) {
    databaseQueryDurationHistogram = new Histogram({
      name: `${config.prefix}_database_query_duration_seconds`,
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'table'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
      registers: [registry],
    });

    databaseConnectionsGauge = new Gauge({
      name: `${config.prefix}_database_connections`,
      help: 'Number of database connections',
      labelNames: ['state'],
      registers: [registry],
    });
  }

  // Initialize error counter
  errorTotalCounter = new Counter({
    name: `${config.prefix}_errors_total`,
    help: 'Total number of errors',
    labelNames: ['type', 'code'],
    registers: [registry],
  });

  isInitialized = true;
  console.log('Metrics initialized with prefix:', config.prefix);

  return registry;
}

/**
 * Get the metrics registry
 */
export function getMetricsRegistry(): Registry {
  if (!registry) {
    registry = new Registry();
  }
  return registry;
}

/**
 * Create a new Counter metric
 */
export function createCounter(
  name: string,
  help: string,
  labelNames: string[] = []
): Counter {
  return new Counter({
    name,
    help,
    labelNames,
    registers: [getMetricsRegistry()],
  });
}

/**
 * Create a new Gauge metric
 */
export function createGauge(
  name: string,
  help: string,
  labelNames: string[] = []
): Gauge {
  return new Gauge({
    name,
    help,
    labelNames,
    registers: [getMetricsRegistry()],
  });
}

/**
 * Create a new Histogram metric
 */
export function createHistogram(
  name: string,
  help: string,
  options: {
    labelNames?: string[];
    buckets?: number[];
  } = {}
): Histogram {
  return new Histogram({
    name,
    help,
    labelNames: options.labelNames || [],
    buckets: options.buckets || [0.01, 0.05, 0.1, 0.5, 1, 5, 10],
    registers: [getMetricsRegistry()],
  });
}

/**
 * Create a new Summary metric
 */
export function createSummary(
  name: string,
  help: string,
  options: {
    labelNames?: string[];
    percentiles?: number[];
    maxAgeSeconds?: number;
    ageBuckets?: number;
  } = {}
): Summary {
  return new Summary({
    name,
    help,
    labelNames: options.labelNames || [],
    percentiles: options.percentiles || [0.5, 0.9, 0.99],
    maxAgeSeconds: options.maxAgeSeconds || 60,
    ageBuckets: options.ageBuckets || 5,
    registers: [getMetricsRegistry()],
  });
}

/**
 * Record HTTP request duration
 */
export function httpRequestDuration(
  method: string,
  route: string,
  statusCode: number,
  durationSeconds: number
): void {
  if (httpRequestDurationHistogram) {
    httpRequestDurationHistogram.observe(
      { method, route, status_code: String(statusCode) },
      durationSeconds
    );
  }
}

/**
 * Increment HTTP request total
 */
export function httpRequestTotal(
  method: string,
  route: string,
  statusCode: number
): void {
  if (httpRequestTotalCounter) {
    httpRequestTotalCounter.inc({
      method,
      route,
      status_code: String(statusCode),
    });
  }
}

/**
 * Set active connections count
 */
export function activeConnections(count: number): void {
  if (activeConnectionsGauge) {
    activeConnectionsGauge.set(count);
  }
}

/**
 * Record database query duration
 */
export function databaseQueryDuration(
  operation: string,
  table: string,
  durationSeconds: number
): void {
  if (databaseQueryDurationHistogram) {
    databaseQueryDurationHistogram.observe(
      { operation, table },
      durationSeconds
    );
  }
}

/**
 * Set database connections count
 */
export function databaseConnections(state: 'active' | 'idle' | 'waiting', count: number): void {
  if (databaseConnectionsGauge) {
    databaseConnectionsGauge.set({ state }, count);
  }
}

/**
 * Increment error counter
 */
export function recordError(type: string, code: string): void {
  if (errorTotalCounter) {
    errorTotalCounter.inc({ type, code });
  }
}

/**
 * Get metrics as string (Prometheus format)
 */
export async function getMetrics(): Promise<string> {
  return getMetricsRegistry().metrics();
}

/**
 * Get metrics content type
 */
export function getMetricsContentType(): string {
  return getMetricsRegistry().contentType;
}

/**
 * Reset all metrics
 */
export function resetMetrics(): void {
  getMetricsRegistry().resetMetrics();
}

/**
 * Express middleware for metrics endpoint
 */
export function metricsMiddleware() {
  return async (req: { path: string }, res: { set: (key: string, value: string) => void; send: (data: string) => void }, next: () => void) => {
    if (req.path === '/metrics') {
      res.set('Content-Type', getMetricsContentType());
      res.send(await getMetrics());
    } else {
      next();
    }
  };
}

/**
 * Express middleware to record HTTP metrics
 */
export function httpMetricsMiddleware() {
  return (req: { method: string; route?: { path: string }; path: string }, res: { statusCode: number; on: (event: string, callback: () => void) => void }, next: () => void) => {
    const start = process.hrtime();

    res.on('finish', () => {
      const [seconds, nanoseconds] = process.hrtime(start);
      const duration = seconds + nanoseconds / 1e9;
      const route = req.route?.path || req.path || 'unknown';

      httpRequestDuration(req.method, route, res.statusCode, duration);
      httpRequestTotal(req.method, route, res.statusCode);
    });

    next();
  };
}
