// @ts-nocheck
import { trace, context, SpanStatusCode, Span, Tracer } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor, BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { config } from '../config/index.js';

let tracerProvider: NodeTracerProvider | null = null;
let tracer: Tracer | null = null;

/**
 * Initialize OpenTelemetry tracing
 */
export function initTracing(): void {
  // Create a resource to identify this service
  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'unified-health-api',
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.env,
    })
  );

  // Create the tracer provider
  tracerProvider = new NodeTracerProvider({
    resource,
  });

  // Configure the Jaeger exporter
  const jaegerExporter = new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
    // Alternatively, use the agent endpoint
    // host: process.env.JAEGER_AGENT_HOST || 'localhost',
    // port: parseInt(process.env.JAEGER_AGENT_PORT || '6832', 10),
  });

  // Use BatchSpanProcessor for better performance in production
  // Use SimpleSpanProcessor for development/debugging
  const spanProcessor =
    config.env === 'production'
      ? new BatchSpanProcessor(jaegerExporter, {
          maxQueueSize: 2048,
          maxExportBatchSize: 512,
          scheduledDelayMillis: 5000,
          exportTimeoutMillis: 30000,
        })
      : new SimpleSpanProcessor(jaegerExporter);

  tracerProvider.addSpanProcessor(spanProcessor);

  // Register the tracer provider
  tracerProvider.register();

  // Register instrumentations
  registerInstrumentations({
    instrumentations: [
      // HTTP instrumentation
      new HttpInstrumentation({
        ignoreIncomingPaths: ['/health', '/metrics'],
      }),
      // Express instrumentation
      new ExpressInstrumentation({
        ignoreLayersType: ['middleware'],
      }),
      // Prisma instrumentation
      new PrismaInstrumentation(),
    ],
  });

  // Get the tracer instance
  tracer = trace.getTracer('unified-health-api', '1.0.0');

  console.log('OpenTelemetry tracing initialized');
}

/**
 * Get the current tracer instance
 */
export function getTracer(): Tracer {
  if (!tracer) {
    throw new Error('Tracer not initialized. Call initTracing() first.');
  }
  return tracer;
}

/**
 * Create a new span with the given name and optional attributes
 */
export function createSpan(
  name: string,
  attributes?: Record<string, string | number | boolean>
): Span {
  const tracer = getTracer();
  const span = tracer.startSpan(name, {
    attributes,
  });
  return span;
}

/**
 * Execute a function within a span context
 */
export async function withSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  attributes?: Record<string, string | number | boolean>
): Promise<T> {
  const span = createSpan(name, attributes);

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
 * Get the trace ID from the current active span
 */
export function getTraceId(): string | undefined {
  const span = trace.getActiveSpan();
  if (span) {
    return span.spanContext().traceId;
  }
  return undefined;
}

/**
 * Get the span ID from the current active span
 */
export function getSpanId(): string | undefined {
  const span = trace.getActiveSpan();
  if (span) {
    return span.spanContext().spanId;
  }
  return undefined;
}

/**
 * Decorator to automatically create a span for a method
 */
export function Traced(spanName?: string) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const name = spanName || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: unknown[]) {
      return await withSpan(
        name,
        async (span) => {
          span.setAttribute('method', propertyKey);
          span.setAttribute('class', target.constructor.name);
          return await originalMethod.apply(this, args);
        }
      );
    };

    return descriptor;
  };
}

/**
 * Shutdown tracing gracefully
 */
export async function shutdownTracing(): Promise<void> {
  if (tracerProvider) {
    await tracerProvider.shutdown();
    console.log('OpenTelemetry tracing shut down');
  }
}

// Graceful shutdown on process termination
process.on('SIGTERM', async () => {
  await shutdownTracing();
});

process.on('SIGINT', async () => {
  await shutdownTracing();
});
