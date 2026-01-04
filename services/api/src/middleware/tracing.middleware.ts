/**
 * Distributed Tracing Middleware
 *
 * Provides AWS X-Ray and OpenTelemetry integration for distributed tracing.
 * Supports correlation ID propagation and structured trace context.
 */

import { Request, Response, NextFunction } from 'express';
import { trace, context, SpanStatusCode, SpanKind } from '@opentelemetry/api';
import { logger } from '../utils/logger.js';
import { correlationIdStorage } from '../utils/logger.js';

// X-Ray SDK imports (conditionally loaded)
let AWSXRay: typeof import('aws-xray-sdk-core') | null = null;
let xrayExpress: typeof import('aws-xray-sdk-express') | null = null;

// Configuration for tracing
interface TracingConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  xrayEnabled: boolean;
  openTelemetryEnabled: boolean;
  samplingRate: number;
  excludePaths: string[];
}

const defaultConfig: TracingConfig = {
  serviceName: process.env.SERVICE_NAME || 'unified-health-api',
  serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  xrayEnabled: process.env.AWS_XRAY_ENABLED === 'true',
  openTelemetryEnabled: process.env.OTEL_ENABLED !== 'false',
  samplingRate: parseFloat(process.env.TRACE_SAMPLING_RATE || '1.0'),
  excludePaths: ['/health', '/ready', '/metrics', '/favicon.ico'],
};

/**
 * Initialize AWS X-Ray if enabled
 */
async function initializeXRay(config: TracingConfig): Promise<void> {
  if (!config.xrayEnabled) {
    return;
  }

  try {
    AWSXRay = await import('aws-xray-sdk-core');
    xrayExpress = await import('aws-xray-sdk-express');

    // Configure X-Ray
    AWSXRay.setDaemonAddress(process.env.AWS_XRAY_DAEMON_ADDRESS || '127.0.0.1:2000');

    // Set sampling rules
    const samplingRules = {
      version: 2,
      default: {
        fixed_target: 1,
        rate: config.samplingRate,
      },
      rules: [
        {
          description: 'Health checks - low sampling',
          host: '*',
          http_method: 'GET',
          url_path: '/health*',
          fixed_target: 0,
          rate: 0.01,
        },
        {
          description: 'Metrics - no sampling',
          host: '*',
          http_method: 'GET',
          url_path: '/metrics*',
          fixed_target: 0,
          rate: 0,
        },
      ],
    };

    AWSXRay.middleware.setSamplingRules(samplingRules);

    // Add custom annotations
    AWSXRay.config([
      AWSXRay.plugins.EC2Plugin,
      AWSXRay.plugins.ECSPlugin,
    ]);

    logger.info('AWS X-Ray initialized', {
      daemonAddress: process.env.AWS_XRAY_DAEMON_ADDRESS || '127.0.0.1:2000',
      serviceName: config.serviceName,
    });
  } catch (error) {
    logger.warn('Failed to initialize AWS X-Ray', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    AWSXRay = null;
    xrayExpress = null;
  }
}

/**
 * Get X-Ray open segment middleware
 */
export function getXRayOpenSegmentMiddleware(config: Partial<TracingConfig> = {}) {
  const mergedConfig = { ...defaultConfig, ...config };

  if (!mergedConfig.xrayEnabled || !xrayExpress) {
    return (req: Request, res: Response, next: NextFunction) => next();
  }

  return xrayExpress.openSegment(mergedConfig.serviceName);
}

/**
 * Get X-Ray close segment middleware
 */
export function getXRayCloseSegmentMiddleware() {
  if (!xrayExpress) {
    return (req: Request, res: Response, next: NextFunction) => next();
  }

  return xrayExpress.closeSegment();
}

/**
 * Express Request with tracing context
 */
export interface TracedRequest extends Request {
  correlationId?: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  xraySegment?: unknown;
}

/**
 * Main tracing middleware that integrates OpenTelemetry and X-Ray
 */
export function tracingMiddleware(config: Partial<TracingConfig> = {}) {
  const mergedConfig = { ...defaultConfig, ...config };

  // Initialize X-Ray asynchronously
  initializeXRay(mergedConfig);

  return (req: TracedRequest, res: Response, next: NextFunction): void => {
    // Skip excluded paths
    if (mergedConfig.excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Get correlation ID from header or use existing
    const correlationId = (req.headers['x-correlation-id'] as string) ||
                          (req.headers['x-request-id'] as string) ||
                          req.correlationId;

    // Get trace context from headers (W3C Trace Context)
    const traceparent = req.headers['traceparent'] as string;
    const tracestate = req.headers['tracestate'] as string;

    // Get X-Ray trace header
    const xrayTraceHeader = req.headers['x-amzn-trace-id'] as string;

    // Get or create OpenTelemetry span
    const tracer = trace.getTracer(mergedConfig.serviceName, mergedConfig.serviceVersion);
    const span = tracer.startSpan(`${req.method} ${req.path}`, {
      kind: SpanKind.SERVER,
      attributes: {
        'http.method': req.method,
        'http.url': req.url,
        'http.target': req.path,
        'http.host': req.hostname,
        'http.scheme': req.protocol,
        'http.user_agent': req.get('user-agent') || 'unknown',
        'http.client_ip': req.ip || req.socket.remoteAddress || 'unknown',
        'service.name': mergedConfig.serviceName,
        'service.version': mergedConfig.serviceVersion,
        'deployment.environment': mergedConfig.environment,
      },
    });

    // Add correlation ID to span
    if (correlationId) {
      span.setAttribute('correlation.id', correlationId);
    }

    // Add X-Ray trace ID if present
    if (xrayTraceHeader) {
      const match = xrayTraceHeader.match(/Root=([^;]+)/);
      if (match) {
        span.setAttribute('aws.xray.trace_id', match[1]);
      }
    }

    // Store trace IDs on request
    const spanContext = span.spanContext();
    req.traceId = spanContext.traceId;
    req.spanId = spanContext.spanId;

    // Propagate trace context in response headers
    res.setHeader('X-Trace-Id', spanContext.traceId);
    res.setHeader('X-Span-Id', spanContext.spanId);

    // Handle X-Ray segment
    if (AWSXRay && mergedConfig.xrayEnabled) {
      try {
        const segment = AWSXRay.getSegment();
        if (segment) {
          req.xraySegment = segment;

          // Add annotations
          segment.addAnnotation('correlationId', correlationId || 'none');
          segment.addAnnotation('environment', mergedConfig.environment);

          // Add metadata
          segment.addMetadata('request', {
            method: req.method,
            path: req.path,
            query: req.query,
            headers: {
              'user-agent': req.get('user-agent'),
              'content-type': req.get('content-type'),
            },
          });
        }
      } catch (error) {
        // X-Ray segment not available, continue without it
      }
    }

    // Track response
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;

      // Set span status based on response
      span.setAttribute('http.status_code', res.statusCode);
      span.setAttribute('http.response_time_ms', duration);

      if (res.statusCode >= 400) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: `HTTP ${res.statusCode}`,
        });
        span.setAttribute('error', true);
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }

      // Add X-Ray annotations for response
      if (AWSXRay && mergedConfig.xrayEnabled && req.xraySegment) {
        try {
          const segment = req.xraySegment as {
            addAnnotation: (key: string, value: string | number | boolean) => void;
            addMetadata: (key: string, value: unknown) => void;
          };
          segment.addAnnotation('statusCode', res.statusCode);
          segment.addAnnotation('responseTimeMs', duration);
          segment.addMetadata('response', {
            statusCode: res.statusCode,
            contentLength: res.get('content-length'),
          });
        } catch (error) {
          // Ignore X-Ray errors
        }
      }

      // Log request completion with trace context
      logger.info('Request completed', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs: duration,
        traceId: req.traceId,
        spanId: req.spanId,
        correlationId,
      });

      span.end();
    });

    // Handle errors
    res.on('error', (error) => {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      span.recordException(error);
      span.end();
    });

    // Continue with request in span context
    context.with(trace.setSpan(context.active(), span), () => {
      next();
    });
  };
}

/**
 * Middleware to add custom span attributes
 */
export function addSpanAttribute(key: string, value: string | number | boolean) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const span = trace.getActiveSpan();
    if (span) {
      span.setAttribute(key, value);
    }
    next();
  };
}

/**
 * Create a custom subsegment for X-Ray
 */
export function createXRaySubsegment(name: string): unknown | null {
  if (!AWSXRay) return null;

  try {
    const segment = AWSXRay.getSegment();
    if (segment) {
      return segment.addNewSubsegment(name);
    }
  } catch (error) {
    logger.debug('Failed to create X-Ray subsegment', { name });
  }
  return null;
}

/**
 * Close an X-Ray subsegment
 */
export function closeXRaySubsegment(subsegment: unknown): void {
  if (!subsegment) return;

  try {
    (subsegment as { close: () => void }).close();
  } catch (error) {
    // Ignore close errors
  }
}

/**
 * Add error to X-Ray segment
 */
export function addXRayError(error: Error): void {
  if (!AWSXRay) return;

  try {
    const segment = AWSXRay.getSegment();
    if (segment) {
      segment.addError(error);
    }
  } catch (err) {
    // Ignore X-Ray errors
  }
}

/**
 * Capture AWS SDK calls with X-Ray
 */
export function captureAWSClient<T>(client: T): T {
  if (!AWSXRay) return client;

  try {
    return AWSXRay.captureAWSv3Client(client as never);
  } catch (error) {
    logger.debug('Failed to capture AWS client for X-Ray');
    return client;
  }
}

/**
 * Capture HTTP/HTTPS calls with X-Ray
 */
export function captureHTTPsGlobal(): void {
  if (!AWSXRay) return;

  try {
    AWSXRay.captureHTTPsGlobal(require('http'));
    AWSXRay.captureHTTPsGlobal(require('https'));
    logger.info('HTTP/HTTPS captured for X-Ray tracing');
  } catch (error) {
    logger.debug('Failed to capture HTTP for X-Ray');
  }
}

/**
 * Get current trace context for propagation
 */
export function getTraceContext(): {
  traceId?: string;
  spanId?: string;
  correlationId?: string;
  xrayTraceId?: string;
} {
  const span = trace.getActiveSpan();
  const correlationId = correlationIdStorage.getStore();

  const result: {
    traceId?: string;
    spanId?: string;
    correlationId?: string;
    xrayTraceId?: string;
  } = {
    correlationId,
  };

  if (span) {
    const spanContext = span.spanContext();
    result.traceId = spanContext.traceId;
    result.spanId = spanContext.spanId;
  }

  if (AWSXRay) {
    try {
      const segment = AWSXRay.getSegment();
      if (segment) {
        result.xrayTraceId = segment.trace_id;
      }
    } catch (error) {
      // Ignore
    }
  }

  return result;
}

/**
 * Create trace headers for outgoing requests
 */
export function createTraceHeaders(): Record<string, string> {
  const traceContext = getTraceContext();
  const headers: Record<string, string> = {};

  if (traceContext.correlationId) {
    headers['X-Correlation-ID'] = traceContext.correlationId;
  }

  if (traceContext.traceId && traceContext.spanId) {
    // W3C Trace Context format
    headers['traceparent'] = `00-${traceContext.traceId}-${traceContext.spanId}-01`;
  }

  if (traceContext.xrayTraceId) {
    headers['X-Amzn-Trace-Id'] = traceContext.xrayTraceId;
  }

  return headers;
}

export { defaultConfig as tracingConfig };
