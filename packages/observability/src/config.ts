/**
 * Observability Configuration
 *
 * Central configuration for all observability features.
 */

import { TracingConfig } from './tracing/index.js';
import { LoggingConfig } from './logging/index.js';
import { MetricsConfig } from './metrics/index.js';

/**
 * Complete observability configuration
 */
export interface ObservabilityConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  tracing: TracingConfig;
  logging: LoggingConfig;
  metrics: MetricsConfig;
}

/**
 * Default observability configuration
 */
const defaultConfig: ObservabilityConfig = {
  serviceName: process.env.SERVICE_NAME || 'unified-health-service',
  serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',

  tracing: {
    enabled: process.env.TRACING_ENABLED !== 'false',
    exporterType: (process.env.TRACING_EXPORTER as 'jaeger' | 'otlp' | 'console') || 'jaeger',
    jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
    otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
    samplingRate: parseFloat(process.env.TRACE_SAMPLING_RATE || '1.0'),
    propagateW3CTraceContext: true,
    ignoreHealthChecks: true,
    batchExport: process.env.NODE_ENV === 'production',
  },

  logging: {
    level: (process.env.LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug') || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
    includeTimestamp: true,
    includeCorrelationId: true,
    includeTraceId: true,
    includeServiceInfo: true,
    redactSensitiveFields: true,
    sensitiveFields: ['password', 'token', 'secret', 'authorization', 'apiKey', 'ssn', 'creditCard'],
  },

  metrics: {
    enabled: process.env.METRICS_ENABLED !== 'false',
    prefix: process.env.METRICS_PREFIX || 'unified_health',
    defaultLabels: {
      service: process.env.SERVICE_NAME || 'unified-health-service',
      environment: process.env.NODE_ENV || 'development',
    },
    collectDefaultMetrics: true,
    httpMetrics: true,
    databaseMetrics: true,
    customMetrics: true,
  },
};

/**
 * Create observability configuration with overrides
 */
export function createObservabilityConfig(
  overrides: Partial<ObservabilityConfig> = {}
): ObservabilityConfig {
  return {
    ...defaultConfig,
    ...overrides,
    tracing: {
      ...defaultConfig.tracing,
      ...overrides.tracing,
    },
    logging: {
      ...defaultConfig.logging,
      ...overrides.logging,
    },
    metrics: {
      ...defaultConfig.metrics,
      ...overrides.metrics,
    },
  };
}

/**
 * Validate observability configuration
 */
export function validateObservabilityConfig(config: ObservabilityConfig): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate service name
  if (!config.serviceName || config.serviceName.length === 0) {
    errors.push('serviceName is required');
  }

  // Validate tracing configuration
  if (config.tracing.enabled) {
    if (config.tracing.exporterType === 'jaeger' && !config.tracing.jaegerEndpoint) {
      warnings.push('Jaeger endpoint not configured, using default');
    }
    if (config.tracing.exporterType === 'otlp' && !config.tracing.otlpEndpoint) {
      warnings.push('OTLP endpoint not configured, using default');
    }
    if (config.tracing.samplingRate < 0 || config.tracing.samplingRate > 1) {
      errors.push('samplingRate must be between 0 and 1');
    }
  }

  // Validate logging configuration
  const validLogLevels = ['error', 'warn', 'info', 'debug'];
  if (!validLogLevels.includes(config.logging.level)) {
    errors.push(`Invalid log level: ${config.logging.level}`);
  }

  // Production warnings
  if (config.environment === 'production') {
    if (config.logging.level === 'debug') {
      warnings.push('Debug logging enabled in production - may impact performance');
    }
    if (config.tracing.samplingRate === 1.0) {
      warnings.push('100% trace sampling in production - consider reducing for high traffic');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
