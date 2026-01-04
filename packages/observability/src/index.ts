/**
 * @unified-health/observability
 *
 * Shared observability utilities for UnifiedHealth services.
 * Provides unified tracing, logging, and metrics configuration.
 */

// Tracing exports
export {
  TracingConfig,
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
export {
  LoggingConfig,
  createLogger,
  createStructuredLogger,
  LogLevel,
  LogContext,
  correlationFormat,
} from './logging/index.js';

// Metrics exports
export {
  MetricsConfig,
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
export { ObservabilityConfig, createObservabilityConfig } from './config.js';
