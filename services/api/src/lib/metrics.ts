import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Create a Registry which registers the metrics
export const register = new Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'unified-health-api',
});

// Enable the collection of default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register });

// HTTP Request Duration Histogram
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 5],
  registers: [register],
});

// HTTP Request Counter
export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Active Connections Gauge
export const activeConnections = new Gauge({
  name: 'http_active_connections',
  help: 'Number of active HTTP connections',
  registers: [register],
});

// Database Query Duration Histogram
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table', 'status'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Database Connection Pool Metrics
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

// Business Metrics - Appointments
export const appointmentsCreated = new Counter({
  name: 'appointments_created_total',
  help: 'Total number of appointments created',
  labelNames: ['status', 'type'],
  registers: [register],
});

export const appointmentsCancelled = new Counter({
  name: 'appointments_cancelled_total',
  help: 'Total number of appointments cancelled',
  labelNames: ['reason'],
  registers: [register],
});

export const appointmentsCompleted = new Counter({
  name: 'appointments_completed_total',
  help: 'Total number of appointments completed',
  labelNames: ['type'],
  registers: [register],
});

// Business Metrics - Users
export const usersRegistered = new Counter({
  name: 'users_registered_total',
  help: 'Total number of users registered',
  labelNames: ['role', 'organization_type'],
  registers: [register],
});

export const userLoginAttempts = new Counter({
  name: 'user_login_attempts_total',
  help: 'Total number of login attempts',
  labelNames: ['status', 'role'],
  registers: [register],
});

export const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Number of currently active users',
  labelNames: ['role'],
  registers: [register],
});

// Business Metrics - Consultations
export const consultationsStarted = new Counter({
  name: 'consultations_started_total',
  help: 'Total number of consultations started',
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

// Business Metrics - Prescriptions
export const prescriptionsIssued = new Counter({
  name: 'prescriptions_issued_total',
  help: 'Total number of prescriptions issued',
  labelNames: ['medication_type'],
  registers: [register],
});

// Business Metrics - Payments
export const paymentsProcessed = new Counter({
  name: 'payments_processed_total',
  help: 'Total number of payments processed',
  labelNames: ['status', 'method', 'currency'],
  registers: [register],
});

export const paymentAmount = new Histogram({
  name: 'payment_amount',
  help: 'Payment amounts',
  labelNames: ['currency', 'method'],
  buckets: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  registers: [register],
});

// Business Metrics - Medical Records
export const medicalRecordsCreated = new Counter({
  name: 'medical_records_created_total',
  help: 'Total number of medical records created',
  labelNames: ['record_type'],
  registers: [register],
});

export const medicalRecordsAccessed = new Counter({
  name: 'medical_records_accessed_total',
  help: 'Total number of medical records accessed',
  labelNames: ['access_type', 'user_role'],
  registers: [register],
});

// Error Metrics
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

// Cache Metrics
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

export const cacheSize = new Gauge({
  name: 'cache_size_bytes',
  help: 'Current size of cache in bytes',
  labelNames: ['cache_name'],
  registers: [register],
});

// External Service Metrics
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

// WebSocket Metrics
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

// Rate Limiting Metrics
export const rateLimitExceeded = new Counter({
  name: 'rate_limit_exceeded_total',
  help: 'Total number of rate limit violations',
  labelNames: ['endpoint', 'client'],
  registers: [register],
});

// File Upload Metrics
export const fileUploads = new Counter({
  name: 'file_uploads_total',
  help: 'Total number of file uploads',
  labelNames: ['file_type', 'status'],
  registers: [register],
});

export const fileUploadSize = new Histogram({
  name: 'file_upload_size_bytes',
  help: 'Size of uploaded files in bytes',
  labelNames: ['file_type'],
  buckets: [1024, 10240, 102400, 1048576, 10485760, 52428800, 104857600],
  registers: [register],
});

// Helper function to normalize paths (remove IDs and dynamic segments)
export function normalizePath(path: string): string {
  return path
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
    .replace(/\/\d+/g, '/:id')
    .replace(/\/[a-f0-9]{24}/g, '/:id');
}
