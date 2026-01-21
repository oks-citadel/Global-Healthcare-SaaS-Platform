/**
 * Web Vitals Monitoring
 * Collects Core Web Vitals metrics for performance tracking
 */

import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
  timestamp: number;
}

export interface WebVitalsConfig {
  /** Callback for each metric */
  onMetric?: (metric: WebVitalMetric) => void;
  /** Whether to report all changes (vs just final values) */
  reportAllChanges?: boolean;
  /** Threshold overrides */
  thresholds?: Partial<WebVitalsThresholds>;
}

export interface WebVitalsThresholds {
  LCP: { good: number; poor: number };
  INP: { good: number; poor: number };
  CLS: { good: number; poor: number };
  FCP: { good: number; poor: number };
  TTFB: { good: number; poor: number };
}

// Default thresholds based on Google's recommendations
const DEFAULT_THRESHOLDS: WebVitalsThresholds = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(
  value: number,
  thresholds: { good: number; poor: number }
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value > thresholds.poor) return 'poor';
  return 'needs-improvement';
}

function createMetricHandler(
  config: WebVitalsConfig,
  metricName: keyof WebVitalsThresholds
) {
  const thresholds = config.thresholds?.[metricName] || DEFAULT_THRESHOLDS[metricName];

  return (metric: Metric) => {
    const webVitalMetric: WebVitalMetric = {
      name: metric.name,
      value: metric.value,
      rating: getRating(metric.value, thresholds),
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType || 'unknown',
      timestamp: Date.now(),
    };

    config.onMetric?.(webVitalMetric);
  };
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals(config: WebVitalsConfig = {}): void {
  const reportAllChanges = config.reportAllChanges ?? false;

  onLCP(createMetricHandler(config, 'LCP'), { reportAllChanges });
  onINP(createMetricHandler(config, 'INP'), { reportAllChanges });
  onCLS(createMetricHandler(config, 'CLS'), { reportAllChanges });
  onFCP(createMetricHandler(config, 'FCP'), { reportAllChanges });
  onTTFB(createMetricHandler(config, 'TTFB'), { reportAllChanges });
}

/**
 * Collect all Web Vitals as a promise
 * Useful for sending a batch of metrics
 */
export async function collectWebVitals(
  timeout = 30000
): Promise<Map<string, WebVitalMetric>> {
  const metrics = new Map<string, WebVitalMetric>();

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => resolve(metrics), timeout);

    initWebVitals({
      onMetric: (metric) => {
        metrics.set(metric.name, metric);

        // Resolve early if we have all metrics
        if (metrics.size >= 5) {
          clearTimeout(timeoutId);
          resolve(metrics);
        }
      },
    });
  });
}
