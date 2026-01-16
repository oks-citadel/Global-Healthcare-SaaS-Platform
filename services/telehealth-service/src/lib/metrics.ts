/**
 * Metrics Configuration for Telehealth Service
 * Comprehensive monitoring and observability
 */

import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Create a Registry
export const register = new Registry();

// Add default labels
register.setDefaultLabels({
  app: 'telehealth-service',
  environment: process.env.NODE_ENV || 'development',
  version: process.env.APP_VERSION || '1.0.0',
});

// Enable the collection of default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register });

// ==========================================
// HTTP Request Metrics
// ==========================================

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 5],
  registers: [register],
});

export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const activeConnections = new Gauge({
  name: 'http_active_connections',
  help: 'Number of active HTTP connections',
  registers: [register],
});

// ==========================================
// Database Metrics
// ==========================================

export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table', 'status'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

export const dbConnectionPoolActive = new Gauge({
  name: 'db_connection_pool_active',
  help: 'Number of active database connections in the pool',
  registers: [register],
});

export const dbConnectionPoolIdle = new Gauge({
  name: 'db_connection_pool_idle',
  help: 'Number of idle database connections in the pool',
  registers: [register],
});

export const dbConnectionPoolWaiting = new Gauge({
  name: 'db_connection_pool_waiting',
  help: 'Number of requests waiting for a database connection',
  registers: [register],
});

// ==========================================
// Telehealth-Specific Business Metrics
// ==========================================

export const consultationsStarted = new Counter({
  name: 'consultations_started_total',
  help: 'Total number of consultations started',
  labelNames: ['type', 'specialty'],
  registers: [register],
});

export const consultationsCompleted = new Counter({
  name: 'consultations_completed_total',
  help: 'Total number of consultations completed',
  labelNames: ['type', 'specialty'],
  registers: [register],
});

export const consultationDuration = new Histogram({
  name: 'consultation_duration_seconds',
  help: 'Duration of consultations in seconds',
  labelNames: ['type', 'specialty'],
  buckets: [60, 300, 600, 900, 1200, 1800, 2400, 3000, 3600],
  registers: [register],
});

export const videoCallsInitiated = new Counter({
  name: 'video_calls_initiated_total',
  help: 'Total number of video calls initiated',
  labelNames: ['type'],
  registers: [register],
});

export const videoCallsCompleted = new Counter({
  name: 'video_calls_completed_total',
  help: 'Total number of video calls completed',
  labelNames: ['type'],
  registers: [register],
});

export const videoCallDuration = new Histogram({
  name: 'video_call_duration_seconds',
  help: 'Duration of video calls in seconds',
  labelNames: ['type'],
  buckets: [60, 300, 600, 900, 1200, 1800, 2400, 3000, 3600],
  registers: [register],
});

export const videoCallQualityMetrics = new Histogram({
  name: 'video_call_quality_score',
  help: 'Video call quality score (0-100)',
  labelNames: ['metric_type'],
  buckets: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  registers: [register],
});

export const activeVideoSessions = new Gauge({
  name: 'active_video_sessions',
  help: 'Number of currently active video sessions',
  registers: [register],
});

export const appointmentsScheduled = new Counter({
  name: 'appointments_scheduled_total',
  help: 'Total number of appointments scheduled',
  labelNames: ['specialty', 'type'],
  registers: [register],
});

export const appointmentsCancelled = new Counter({
  name: 'appointments_cancelled_total',
  help: 'Total number of appointments cancelled',
  labelNames: ['reason'],
  registers: [register],
});

// ==========================================
// WebSocket Metrics
// ==========================================

export const websocketConnections = new Gauge({
  name: 'websocket_connections',
  help: 'Number of active WebSocket connections',
  labelNames: ['type'],
  registers: [register],
});

export const websocketMessagesReceived = new Counter({
  name: 'websocket_messages_received_total',
  help: 'Total number of WebSocket messages received',
  labelNames: ['type', 'event'],
  registers: [register],
});

export const websocketMessagesSent = new Counter({
  name: 'websocket_messages_sent_total',
  help: 'Total number of WebSocket messages sent',
  labelNames: ['type', 'event'],
  registers: [register],
});

// ==========================================
// Error Metrics
// ==========================================

export const errorCounter = new Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'route', 'status_code'],
  registers: [register],
});

export const criticalErrorCounter = new Counter({
  name: 'critical_errors_total',
  help: 'Total number of critical errors',
  labelNames: ['type', 'component'],
  registers: [register],
});

// ==========================================
// Cache Metrics
// ==========================================

export const cacheHits = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_name', 'operation'],
  registers: [register],
});

export const cacheMisses = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_name', 'operation'],
  registers: [register],
});

// ==========================================
// External Service Metrics
// ==========================================

export const externalServiceCalls = new Counter({
  name: 'external_service_calls_total',
  help: 'Total number of external service calls',
  labelNames: ['service', 'operation', 'status'],
  registers: [register],
});

export const externalServiceDuration = new Histogram({
  name: 'external_service_duration_seconds',
  help: 'Duration of external service calls in seconds',
  labelNames: ['service', 'operation'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 30],
  registers: [register],
});

// ==========================================
// Helper Functions
// ==========================================

/**
 * Normalize path to remove IDs and dynamic segments
 */
export function normalizePath(path: string): string {
  return path
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
    .replace(/\/\d+/g, '/:id')
    .replace(/\/[a-f0-9]{24}/g, '/:id');
}

/**
 * Track consultation lifecycle
 */
export function trackConsultationStarted(type: string, specialty: string): void {
  consultationsStarted.inc({ type, specialty });
}

export function trackConsultationCompleted(
  type: string,
  specialty: string,
  durationSeconds: number
): void {
  consultationsCompleted.inc({ type, specialty });
  consultationDuration.observe({ type, specialty }, durationSeconds);
}

/**
 * Track video call lifecycle
 */
export function trackVideoCallStarted(type: string = 'consultation'): void {
  videoCallsInitiated.inc({ type });
  activeVideoSessions.inc();
}

export function trackVideoCallEnded(
  type: string,
  durationSeconds: number,
  qualityMetrics?: {
    packetLoss?: number;
    jitter?: number;
    latency?: number;
  }
): void {
  videoCallsCompleted.inc({ type });
  activeVideoSessions.dec();
  videoCallDuration.observe({ type }, durationSeconds);

  if (qualityMetrics) {
    if (qualityMetrics.packetLoss !== undefined) {
      videoCallQualityMetrics.observe(
        { metric_type: 'packet_loss' },
        qualityMetrics.packetLoss
      );
    }
    if (qualityMetrics.jitter !== undefined) {
      videoCallQualityMetrics.observe({ metric_type: 'jitter' }, qualityMetrics.jitter);
    }
    if (qualityMetrics.latency !== undefined) {
      videoCallQualityMetrics.observe(
        { metric_type: 'latency' },
        qualityMetrics.latency
      );
    }
  }
}

/**
 * Track appointment operations
 */
export function trackAppointmentScheduled(specialty: string, type: string): void {
  appointmentsScheduled.inc({ specialty, type });
}

export function trackAppointmentCancelled(reason: string): void {
  appointmentsCancelled.inc({ reason });
}

/**
 * Track database query
 */
export async function trackDatabaseQuery<T>(
  operation: string,
  table: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  try {
    const result = await queryFn();
    const duration = (Date.now() - startTime) / 1000;
    dbQueryDuration.observe({ operation, table, status: 'success' }, duration);
    return result;
  } catch (error) {
    const duration = (Date.now() - startTime) / 1000;
    dbQueryDuration.observe({ operation, table, status: 'error' }, duration);
    throw error;
  }
}
