/**
 * Structured Logging Module
 *
 * Provides structured logging with correlation ID support,
 * trace context integration, and sensitive data redaction.
 */

import winston from 'winston';
import { AsyncLocalStorage } from 'async_hooks';
import { getTraceContext } from '../tracing/index.js';

/**
 * Logging configuration options
 */
export interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  format: 'json' | 'pretty';
  includeTimestamp: boolean;
  includeCorrelationId: boolean;
  includeTraceId: boolean;
  includeServiceInfo: boolean;
  redactSensitiveFields: boolean;
  sensitiveFields: string[];
}

/**
 * Log context with correlation and trace information
 */
export interface LogContext {
  correlationId?: string;
  traceId?: string;
  spanId?: string;
  userId?: string;
  requestId?: string;
  serviceName?: string;
  [key: string]: unknown;
}

/**
 * Log levels
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// Async local storage for correlation ID
export const correlationStorage = new AsyncLocalStorage<string>();

/**
 * Winston format to add correlation ID and trace context
 */
export const correlationFormat = winston.format((info) => {
  // Get correlation ID from async local storage
  const correlationId = correlationStorage.getStore();
  if (correlationId) {
    info.correlationId = correlationId;
  }

  // Get trace context
  const traceContext = getTraceContext();
  if (traceContext.traceId) {
    info.traceId = traceContext.traceId;
  }
  if (traceContext.spanId) {
    info.spanId = traceContext.spanId;
  }

  return info;
});

/**
 * Winston format to redact sensitive fields
 */
function createRedactionFormat(sensitiveFields: string[]) {
  const redactValue = (obj: Record<string, unknown>, path: string[] = []): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];
      const fieldName = key.toLowerCase();

      // Check if field should be redacted
      if (sensitiveFields.some(f => fieldName.includes(f.toLowerCase()))) {
        result[key] = '[REDACTED]';
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = redactValue(value as Record<string, unknown>, currentPath);
      } else {
        result[key] = value;
      }
    }

    return result;
  };

  return winston.format((info) => {
    // Redact message if it's an object
    if (info.message && typeof info.message === 'object') {
      info.message = redactValue(info.message as Record<string, unknown>);
    }

    // Redact any additional metadata
    const { level, message, timestamp, correlationId, traceId, spanId, ...meta } = info;
    if (Object.keys(meta).length > 0) {
      const redactedMeta = redactValue(meta);
      Object.assign(info, { level, message, timestamp, correlationId, traceId, spanId }, redactedMeta);
    }

    return info;
  });
}

/**
 * Create pretty format for development
 */
function createPrettyFormat(config: LoggingConfig) {
  return winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    correlationFormat(),
    config.redactSensitiveFields
      ? createRedactionFormat(config.sensitiveFields)()
      : winston.format.simple(),
    winston.format.colorize(),
    winston.format.printf((info) => {
      const { timestamp, level, message, correlationId, traceId, spanId, stack, ...meta } = info;
      let log = `${timestamp} [${level}]`;

      if (correlationId) {
        log += ` [${correlationId}]`;
      }

      if (traceId) {
        log += ` [trace:${String(traceId).substring(0, 8)}]`;
      }

      log += `: ${message}`;

      if (stack) {
        log += `\n${stack}`;
      }

      if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta)}`;
      }

      return log;
    })
  );
}

/**
 * Create JSON format for production
 */
function createJsonFormat(config: LoggingConfig) {
  return winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    correlationFormat(),
    config.redactSensitiveFields
      ? createRedactionFormat(config.sensitiveFields)()
      : winston.format.simple(),
    winston.format.json()
  );
}

/**
 * Create a structured logger instance
 */
export function createStructuredLogger(
  serviceName: string,
  serviceVersion: string,
  config: LoggingConfig
): winston.Logger {
  const format = config.format === 'json'
    ? createJsonFormat(config)
    : createPrettyFormat(config);

  const logger = winston.createLogger({
    level: config.level,
    format,
    defaultMeta: config.includeServiceInfo
      ? {
          service: serviceName,
          version: serviceVersion,
        }
      : {},
    transports: [
      new winston.transports.Console({
        format,
      }),
    ],
  });

  return logger;
}

/**
 * Simple logger factory
 */
export function createLogger(
  serviceName: string,
  options: Partial<LoggingConfig> = {}
): winston.Logger {
  const defaultConfig: LoggingConfig = {
    level: 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
    includeTimestamp: true,
    includeCorrelationId: true,
    includeTraceId: true,
    includeServiceInfo: true,
    redactSensitiveFields: true,
    sensitiveFields: ['password', 'token', 'secret', 'authorization', 'apiKey'],
  };

  const config = { ...defaultConfig, ...options };

  return createStructuredLogger(
    serviceName,
    process.env.SERVICE_VERSION || '1.0.0',
    config
  );
}

/**
 * Log with correlation context
 */
export function withCorrelation<T>(
  correlationId: string,
  fn: () => T
): T {
  return correlationStorage.run(correlationId, fn);
}

/**
 * Get current correlation ID
 */
export function getCorrelationId(): string | undefined {
  return correlationStorage.getStore();
}

/**
 * Set correlation ID for current async context
 */
export function setCorrelationId(correlationId: string): void {
  // Note: This only works within an async context
  // For new contexts, use withCorrelation
}

/**
 * Create child logger with additional context
 */
export function createChildLogger(
  parent: winston.Logger,
  context: LogContext
): winston.Logger {
  return parent.child(context);
}

/**
 * Audit log helper
 */
export function createAuditLogger(
  parent: winston.Logger,
  serviceName: string
): {
  log: (action: string, userId: string, resource: string, details?: Record<string, unknown>) => void;
} {
  return {
    log: (action, userId, resource, details = {}) => {
      parent.info('Audit Log', {
        audit: true,
        action,
        userId,
        resource,
        serviceName,
        timestamp: new Date().toISOString(),
        ...details,
      });
    },
  };
}

/**
 * Security event logger
 */
export function createSecurityLogger(
  parent: winston.Logger
): {
  log: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', details: Record<string, unknown>) => void;
} {
  return {
    log: (event, severity, details) => {
      const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
      parent.log(level, 'Security Event', {
        security: true,
        event,
        severity,
        timestamp: new Date().toISOString(),
        ...details,
      });
    },
  };
}
