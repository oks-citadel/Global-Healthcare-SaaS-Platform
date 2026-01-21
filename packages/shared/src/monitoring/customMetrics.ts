/**
 * Custom Healthcare Metrics
 * Domain-specific performance metrics for healthcare applications
 */

export interface CustomMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  context?: Record<string, string | number | boolean>;
}

export interface MetricCollector {
  startTimer(name: string): () => number;
  recordMetric(metric: CustomMetric): void;
  getMetrics(): CustomMetric[];
  clearMetrics(): void;
}

/**
 * Healthcare-specific metric names
 */
export const HEALTHCARE_METRICS = {
  // Appointment booking flow
  APPOINTMENT_BOOKING_COMPLETE: 'appointment_booking_complete',
  APPOINTMENT_SEARCH_TIME: 'appointment_search_time',
  PROVIDER_SELECTION_TIME: 'provider_selection_time',
  TIME_SLOT_LOAD_TIME: 'time_slot_load_time',

  // Telehealth
  TELEHEALTH_CONNECTION_TIME: 'telehealth_connection_time',
  TELEHEALTH_JOIN_LATENCY: 'telehealth_join_latency',
  VIDEO_QUALITY_SCORE: 'video_quality_score',

  // Medical records
  RECORDS_LOAD_TIME: 'records_load_time',
  LAB_RESULTS_RENDER_TIME: 'lab_results_render_time',
  DOCUMENT_DOWNLOAD_TIME: 'document_download_time',

  // Authentication
  LOGIN_TIME: 'login_time',
  MFA_VERIFICATION_TIME: 'mfa_verification_time',
  SESSION_RESTORE_TIME: 'session_restore_time',

  // Patient portal
  DASHBOARD_LOAD_TIME: 'dashboard_load_time',
  PRESCRIPTION_REFILL_TIME: 'prescription_refill_time',
  MESSAGE_SEND_TIME: 'message_send_time',

  // Provider portal
  PATIENT_CHART_LOAD_TIME: 'patient_chart_load_time',
  ENCOUNTER_SAVE_TIME: 'encounter_save_time',
  PRESCRIPTION_WRITE_TIME: 'prescription_write_time',
} as const;

export type HealthcareMetricName = (typeof HEALTHCARE_METRICS)[keyof typeof HEALTHCARE_METRICS];

/**
 * Create a metric collector instance
 */
export function createMetricCollector(): MetricCollector {
  const metrics: CustomMetric[] = [];
  const activeTimers = new Map<string, number>();

  return {
    startTimer(name: string): () => number {
      const startTime = performance.now();
      activeTimers.set(name, startTime);

      return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        activeTimers.delete(name);

        this.recordMetric({
          name,
          value: duration,
          unit: 'ms',
          timestamp: Date.now(),
        });

        return duration;
      };
    },

    recordMetric(metric: CustomMetric): void {
      metrics.push(metric);
    },

    getMetrics(): CustomMetric[] {
      return [...metrics];
    },

    clearMetrics(): void {
      metrics.length = 0;
    },
  };
}

/**
 * Global metric collector singleton
 */
let globalCollector: MetricCollector | null = null;

export function getGlobalMetricCollector(): MetricCollector {
  if (!globalCollector) {
    globalCollector = createMetricCollector();
  }
  return globalCollector;
}

/**
 * Convenience function to time an async operation
 */
export async function measureAsync<T>(
  name: string,
  operation: () => Promise<T>,
  context?: Record<string, string | number | boolean>
): Promise<T> {
  const collector = getGlobalMetricCollector();
  const startTime = performance.now();

  try {
    const result = await operation();
    const duration = performance.now() - startTime;

    collector.recordMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      context: { ...context, success: true },
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    collector.recordMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      context: {
        ...context,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    throw error;
  }
}

/**
 * Convenience function to time a sync operation
 */
export function measureSync<T>(
  name: string,
  operation: () => T,
  context?: Record<string, string | number | boolean>
): T {
  const collector = getGlobalMetricCollector();
  const startTime = performance.now();

  try {
    const result = operation();
    const duration = performance.now() - startTime;

    collector.recordMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      context: { ...context, success: true },
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    collector.recordMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      context: {
        ...context,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    throw error;
  }
}
