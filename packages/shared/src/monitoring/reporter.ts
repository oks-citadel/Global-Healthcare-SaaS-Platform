/**
 * Metrics Reporter Service
 * Sends collected metrics to analytics backends
 */

import type { WebVitalMetric } from './webVitals';
import type { CustomMetric } from './customMetrics';

export interface ReporterConfig {
  /** Endpoint to send metrics */
  endpoint?: string;
  /** API key for authentication */
  apiKey?: string;
  /** Batch size before sending */
  batchSize?: number;
  /** Interval to flush metrics (ms) */
  flushInterval?: number;
  /** Enable debug logging */
  debug?: boolean;
  /** Custom headers */
  headers?: Record<string, string>;
  /** Transform metrics before sending */
  transform?: (metrics: MetricPayload[]) => MetricPayload[];
}

export interface MetricPayload {
  type: 'web_vital' | 'custom';
  metric: WebVitalMetric | CustomMetric;
  metadata: ReportMetadata;
}

export interface ReportMetadata {
  url: string;
  userAgent: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  appVersion?: string;
  environment?: string;
}

const DEFAULT_CONFIG: Required<ReporterConfig> = {
  endpoint: '/api/metrics',
  apiKey: '',
  batchSize: 10,
  flushInterval: 30000,
  debug: false,
  headers: {},
  transform: (metrics) => metrics,
};

/**
 * Create a metrics reporter
 */
export function createMetricsReporter(userConfig: ReporterConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const queue: MetricPayload[] = [];
  let flushTimer: ReturnType<typeof setInterval> | null = null;
  let sessionId = generateSessionId();

  function generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  function getMetadata(): ReportMetadata {
    return {
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: Date.now(),
      sessionId,
      environment: process.env.NODE_ENV,
    };
  }

  async function flush(): Promise<void> {
    if (queue.length === 0) return;

    const metrics = config.transform(queue.splice(0, queue.length));

    if (config.debug) {
      console.log('[Metrics Reporter] Flushing metrics:', metrics);
    }

    if (!config.endpoint) {
      if (config.debug) {
        console.log('[Metrics Reporter] No endpoint configured, skipping send');
      }
      return;
    }

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey ? { 'X-API-Key': config.apiKey } : {}),
          ...config.headers,
        },
        body: JSON.stringify({ metrics }),
        // Use keepalive for page unload scenarios
        keepalive: true,
      });

      if (!response.ok && config.debug) {
        console.error('[Metrics Reporter] Failed to send metrics:', response.status);
      }
    } catch (error) {
      if (config.debug) {
        console.error('[Metrics Reporter] Error sending metrics:', error);
      }
      // Re-queue failed metrics (with limit to prevent memory issues)
      if (queue.length < 100) {
        queue.push(...metrics);
      }
    }
  }

  function startAutoFlush(): void {
    if (flushTimer) return;

    flushTimer = setInterval(flush, config.flushInterval);

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', flush);
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          flush();
        }
      });
    }
  }

  function stopAutoFlush(): void {
    if (flushTimer) {
      clearInterval(flushTimer);
      flushTimer = null;
    }
  }

  return {
    /**
     * Report a Web Vital metric
     */
    reportWebVital(metric: WebVitalMetric): void {
      queue.push({
        type: 'web_vital',
        metric,
        metadata: getMetadata(),
      });

      if (queue.length >= config.batchSize) {
        flush();
      }
    },

    /**
     * Report a custom metric
     */
    reportCustomMetric(metric: CustomMetric): void {
      queue.push({
        type: 'custom',
        metric,
        metadata: getMetadata(),
      });

      if (queue.length >= config.batchSize) {
        flush();
      }
    },

    /**
     * Set user ID for attribution
     */
    setUserId(userId: string): void {
      // Update metadata for future reports
      sessionId = generateSessionId();
    },

    /**
     * Force flush all queued metrics
     */
    flush,

    /**
     * Start automatic flushing
     */
    startAutoFlush,

    /**
     * Stop automatic flushing
     */
    stopAutoFlush,

    /**
     * Get current queue size
     */
    getQueueSize(): number {
      return queue.length;
    },
  };
}

// Default reporter instance
let defaultReporter: ReturnType<typeof createMetricsReporter> | null = null;

export function getDefaultReporter(): ReturnType<typeof createMetricsReporter> {
  if (!defaultReporter) {
    defaultReporter = createMetricsReporter();
  }
  return defaultReporter;
}

export function initializeReporter(config: ReporterConfig): void {
  defaultReporter = createMetricsReporter(config);
  defaultReporter.startAutoFlush();
}
