/**
 * Distributed Tracing Module
 *
 * Provides OpenTelemetry-based distributed tracing with support for
 * Jaeger, OTLP, and console exporters.
 */

import {
  trace,
  context,
  SpanStatusCode,
  Span,
  Tracer,
  SpanKind,
  Context,
} from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import {
  SimpleSpanProcessor,
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SpanExporter,
} from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

/**
 * Tracing configuration options
 */
export interface TracingConfig {
  enabled: boolean;
  exporterType: 'jaeger' | 'otlp' | 'console';
  jaegerEndpoint?: string;
  otlpEndpoint?: string;
  samplingRate: number;
  propagateW3CTraceContext: boolean;
  ignoreHealthChecks: boolean;
  batchExport: boolean;
}

let tracerProvider: NodeTracerProvider | null = null;
let tracer: Tracer | null = null;
let isInitialized = false;

/**
 * Initialize OpenTelemetry tracing
 */
export function initializeTracing(
  serviceName: string,
  serviceVersion: string,
  environment: string,
  config: TracingConfig
): void {
  if (isInitialized) {
    console.warn('Tracing already initialized');
    return;
  }

  if (!config.enabled) {
    console.log('Tracing disabled');
    return;
  }

  // Create resource to identify the service
  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
    })
  );

  // Create tracer provider
  tracerProvider = new NodeTracerProvider({
    resource,
  });

  // Create exporter based on configuration
  let exporter: SpanExporter;
  switch (config.exporterType) {
    case 'jaeger':
      exporter = new JaegerExporter({
        endpoint: config.jaegerEndpoint || 'http://localhost:14268/api/traces',
      });
      break;
    case 'otlp':
      exporter = new OTLPTraceExporter({
        url: config.otlpEndpoint || 'http://localhost:4318/v1/traces',
      });
      break;
    case 'console':
    default:
      exporter = new ConsoleSpanExporter();
  }

  // Add span processor
  const spanProcessor = config.batchExport
    ? new BatchSpanProcessor(exporter, {
        maxQueueSize: 2048,
        maxExportBatchSize: 512,
        scheduledDelayMillis: 5000,
        exportTimeoutMillis: 30000,
      })
    : new SimpleSpanProcessor(exporter);

  tracerProvider.addSpanProcessor(spanProcessor);
  tracerProvider.register();

  // Get tracer instance
  tracer = trace.getTracer(serviceName, serviceVersion);
  isInitialized = true;

  console.log(`Tracing initialized: ${config.exporterType} exporter, service=${serviceName}`);
}

/**
 * Shutdown tracing gracefully
 */
export async function shutdownTracing(): Promise<void> {
  if (tracerProvider) {
    await tracerProvider.shutdown();
    tracerProvider = null;
    tracer = null;
    isInitialized = false;
    console.log('Tracing shut down');
  }
}

/**
 * Get the tracer instance
 */
export function getTracer(): Tracer {
  if (!tracer) {
    // Return a no-op tracer if not initialized
    return trace.getTracer('noop');
  }
  return tracer;
}

/**
 * Create a new span
 */
export function createSpan(
  name: string,
  options?: {
    kind?: SpanKind;
    attributes?: Record<string, string | number | boolean>;
    parent?: Context;
  }
): Span {
  const t = getTracer();
  return t.startSpan(name, {
    kind: options?.kind || SpanKind.INTERNAL,
    attributes: options?.attributes,
  }, options?.parent);
}

/**
 * Execute a function within a span context
 */
export async function withSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  options?: {
    kind?: SpanKind;
    attributes?: Record<string, string | number | boolean>;
  }
): Promise<T> {
  const span = createSpan(name, options);

  try {
    const result = await context.with(trace.setSpan(context.active(), span), async () => {
      return await fn(span);
    });

    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof Error) {
      span.recordException(error);
    }

    throw error;
  } finally {
    span.end();
  }
}

/**
 * Get current trace context
 */
export function getTraceContext(): {
  traceId: string | undefined;
  spanId: string | undefined;
  traceFlags: number | undefined;
} {
  const span = trace.getActiveSpan();
  if (!span) {
    return { traceId: undefined, spanId: undefined, traceFlags: undefined };
  }

  const spanContext = span.spanContext();
  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
    traceFlags: spanContext.traceFlags,
  };
}

/**
 * Add an event to the current active span
 */
export function addSpanEvent(
  name: string,
  attributes?: Record<string, string | number | boolean>
): void {
  const span = trace.getActiveSpan();
  if (span) {
    span.addEvent(name, attributes);
  }
}

/**
 * Set attributes on the current active span
 */
export function setSpanAttributes(
  attributes: Record<string, string | number | boolean>
): void {
  const span = trace.getActiveSpan();
  if (span) {
    span.setAttributes(attributes);
  }
}

/**
 * Get trace ID from current span
 */
export function getTraceId(): string | undefined {
  return getTraceContext().traceId;
}

/**
 * Get span ID from current span
 */
export function getSpanId(): string | undefined {
  return getTraceContext().spanId;
}

/**
 * Create W3C traceparent header value
 */
export function createTraceparentHeader(): string | undefined {
  const ctx = getTraceContext();
  if (!ctx.traceId || !ctx.spanId) {
    return undefined;
  }
  const flags = ctx.traceFlags?.toString(16).padStart(2, '0') || '01';
  return `00-${ctx.traceId}-${ctx.spanId}-${flags}`;
}

/**
 * Decorator for tracing methods
 */
export function Traced(spanName?: string) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const name = spanName || `${(target as { constructor: { name: string } }).constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: unknown[]) {
      return withSpan(
        name,
        async (span) => {
          span.setAttribute('method', propertyKey);
          span.setAttribute('class', (target as { constructor: { name: string } }).constructor.name);
          return await originalMethod.apply(this, args);
        },
        { kind: SpanKind.INTERNAL }
      );
    };

    return descriptor;
  };
}
