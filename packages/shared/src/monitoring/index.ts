/**
 * Performance Monitoring Module
 * Comprehensive performance tracking for healthcare applications
 */

// Web Vitals
export {
  initWebVitals,
  collectWebVitals,
  type WebVitalMetric,
  type WebVitalsConfig,
  type WebVitalsThresholds,
} from './webVitals';

// Custom Metrics
export {
  createMetricCollector,
  getGlobalMetricCollector,
  measureAsync,
  measureSync,
  HEALTHCARE_METRICS,
  type CustomMetric,
  type MetricCollector,
  type HealthcareMetricName,
} from './customMetrics';

// Reporter
export {
  createMetricsReporter,
  getDefaultReporter,
  initializeReporter,
  type ReporterConfig,
  type MetricPayload,
  type ReportMetadata,
} from './reporter';

// React Hooks
export {
  usePerformance,
  useQueryPerformance,
  useInteractionPerformance,
  type UsePerformanceOptions,
  type UsePerformanceReturn,
} from './hooks/usePerformance';
