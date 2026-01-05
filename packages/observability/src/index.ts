/**
 * @unified-health/observability
 *
 * Shared observability utilities for UnifiedHealth services.
 * Provides unified tracing, logging, and metrics configuration.
 */

// Tracing exports
export type { TracingConfig } from './tracing/index.js';
export {
  initializeTracing,
  shutdownTracing,
  getTracer,
  createSpan,
  withSpan,
  getTraceContext,
  addSpanEvent,
  setSpanAttributes,
  getTraceId,
  getSpanId,
} from './tracing/index.js';

// Logging exports
export type { LoggingConfig, LogLevel, LogContext } from './logging/index.js';
export {
  createLogger,
  createStructuredLogger,
  correlationFormat,
} from './logging/index.js';

// Metrics exports
export type { MetricsConfig } from './metrics/index.js';
export {
  initializeMetrics,
  getMetricsRegistry,
  createCounter,
  createGauge,
  createHistogram,
  createSummary,
  httpRequestDuration,
  httpRequestTotal,
  activeConnections,
} from './metrics/index.js';

// Configuration
export type { ObservabilityConfig } from './config.js';
export { createObservabilityConfig } from './config.js';
