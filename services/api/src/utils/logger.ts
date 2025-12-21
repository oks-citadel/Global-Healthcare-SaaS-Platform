import winston from 'winston';
import { AsyncLocalStorage } from 'async_hooks';
import { config } from '../config/index.js';
import { getTraceId, getSpanId } from '../lib/tracing.js';

// AsyncLocalStorage for correlation IDs
export const correlationIdStorage = new AsyncLocalStorage<string>();

/**
 * Format to add correlation ID and trace information to logs
 */
const correlationFormat = winston.format((info) => {
  // Get correlation ID from async context
  const correlationId = correlationIdStorage.getStore();
  if (correlationId) {
    info.correlationId = correlationId;
  }

  // Get trace information from OpenTelemetry
  const traceId = getTraceId();
  const spanId = getSpanId();

  if (traceId) {
    info.traceId = traceId;
  }

  if (spanId) {
    info.spanId = spanId;
  }

  return info;
});

/**
 * Custom format for development environment
 */
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  correlationFormat(),
  winston.format.colorize(),
  winston.format.printf((info) => {
    const { timestamp, level, message, correlationId, traceId, spanId, ...meta } = info;
    let log = `${timestamp} [${level}]`;

    if (correlationId) {
      log += ` [${correlationId}]`;
    }

    if (traceId) {
      log += ` [trace:${String(traceId).substring(0, 8)}]`;
    }

    log += `: ${message}`;

    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    return log;
  })
);

/**
 * Structured format for production environment
 */
const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  correlationFormat(),
  winston.format.json()
);

const logFormat = config.env === 'development' ? developmentFormat : productionFormat;

/**
 * Main logger instance with enhanced features
 */
export const logger = winston.createLogger({
  level: config.logging.level || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'unified-health-api',
    environment: config.env,
    version: '1.0.0',
  },
  transports: [
    new winston.transports.Console({
      format: logFormat,
    }),
  ],
});

// Add file transport in production
if (config.env === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
    })
  );

  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10485760, // 10MB
      maxFiles: 10,
      tailable: true,
    })
  );

  // Add separate file for audit logs
  logger.add(
    new winston.transports.File({
      filename: 'logs/audit.log',
      level: 'info',
      maxsize: 10485760, // 10MB
      maxFiles: 30,
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        correlationFormat(),
        winston.format.json()
      ),
    })
  );
}

/**
 * Create a child logger with additional metadata
 */
export function createLogger(defaultMeta: Record<string, unknown>): winston.Logger {
  return logger.child(defaultMeta);
}

/**
 * Log with correlation ID context
 */
export function logWithCorrelation(
  correlationId: string,
  level: string,
  message: string,
  meta?: Record<string, unknown>
): void {
  correlationIdStorage.run(correlationId, () => {
    logger.log(level, message, meta);
  });
}

/**
 * Audit logging for sensitive operations
 */
export function auditLog(
  action: string,
  userId: string,
  resource: string,
  details?: Record<string, unknown>
): void {
  logger.info('Audit Log', {
    audit: true,
    action,
    userId,
    resource,
    timestamp: new Date().toISOString(),
    ...details,
  });
}

/**
 * Performance logging
 */
export function logPerformance(
  operation: string,
  durationMs: number,
  metadata?: Record<string, unknown>
): void {
  logger.info('Performance', {
    performance: true,
    operation,
    durationMs,
    ...metadata,
  });
}

/**
 * Security event logging
 */
export function logSecurityEvent(
  event: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  details: Record<string, unknown>
): void {
  const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';

  logger.log(level, 'Security Event', {
    security: true,
    event,
    severity,
    ...details,
  });
}
