# Monitoring and Observability

This document describes the monitoring, logging, and observability infrastructure for the Unified Health Platform.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Metrics Collection](#metrics-collection)
- [Logging](#logging)
- [Tracing](#tracing)
- [Dashboards](#dashboards)
- [Alerting](#alerting)
- [Alert Runbooks](#alert-runbooks)
- [Deployment](#deployment)
- [Accessing Monitoring Tools](#accessing-monitoring-tools)

## Overview

The Unified Health Platform uses a comprehensive monitoring stack built on industry-standard tools:

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **OpenTelemetry**: Distributed tracing
- **Jaeger**: Trace visualization
- **AlertManager**: Alert routing and management
- **Winston**: Structured logging

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Services                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Metrics     │  │   Logging    │  │   Tracing    │          │
│  │  (prom-     │  │   (Winston)  │  │ (OpenTelemetry)│         │
│  │  client)    │  │              │  │               │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────────┐
│               Monitoring Infrastructure                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Prometheus  │  │    Loki      │  │    Jaeger    │          │
│  │  (Metrics)   │  │   (Logs)     │  │   (Traces)   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┼──────────────────┘                   │
│                            │                                      │
│                  ┌─────────▼──────────┐                          │
│                  │      Grafana       │                          │
│                  │   (Visualization)  │                          │
│                  └────────────────────┘                          │
│                            │                                      │
│                  ┌─────────▼──────────┐                          │
│                  │   AlertManager     │                          │
│                  │  (Alert Routing)   │                          │
│                  └────────┬───────────┘                          │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                  ┌─────────▼──────────┐
                  │  Notification      │
                  │  Channels          │
                  │  (Slack, PagerDuty)│
                  └────────────────────┘
```

## Metrics Collection

### Available Metrics

#### HTTP Metrics
- `http_request_duration_seconds` - Request duration histogram
- `http_requests_total` - Total request counter by method, route, and status
- `http_active_connections` - Current active connections

#### Database Metrics
- `db_query_duration_seconds` - Database query duration histogram
- `db_connection_pool_active` - Active database connections
- `db_connection_pool_idle` - Idle database connections
- `db_connection_pool_waiting` - Waiting requests for connections

#### Business Metrics
- `appointments_created_total` - Total appointments created
- `appointments_cancelled_total` - Total appointments cancelled
- `appointments_completed_total` - Total appointments completed
- `users_registered_total` - Total users registered
- `user_login_attempts_total` - Login attempts by status
- `consultations_started_total` - Consultations started
- `prescriptions_issued_total` - Prescriptions issued
- `payments_processed_total` - Payments processed by status

#### Cache Metrics
- `cache_hits_total` - Cache hits
- `cache_misses_total` - Cache misses
- `cache_size_bytes` - Current cache size

#### WebSocket Metrics
- `websocket_connections` - Active WebSocket connections
- `websocket_messages_received_total` - Messages received
- `websocket_messages_sent_total` - Messages sent

### Metrics Endpoint

Metrics are exposed at `/metrics` endpoint for Prometheus scraping:

```bash
curl http://localhost:3000/metrics
```

### Custom Metrics

To add custom metrics in your code:

```typescript
import { Counter, Histogram } from '../lib/metrics.js';

// Example: Track custom business events
const customMetric = new Counter({
  name: 'custom_event_total',
  help: 'Total custom events',
  labelNames: ['event_type'],
  registers: [register],
});

customMetric.inc({ event_type: 'user_action' });
```

## Logging

### Log Levels

- `error` - Error events
- `warn` - Warning events
- `info` - Informational messages
- `debug` - Debug messages
- `verbose` - Verbose output

### Structured Logging

All logs are structured JSON with the following fields:

```json
{
  "timestamp": "2024-01-15 10:30:45",
  "level": "info",
  "message": "User logged in",
  "service": "unified-health-api",
  "environment": "production",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "traceId": "a1b2c3d4e5f6",
  "spanId": "x7y8z9",
  "userId": "user123",
  "action": "login"
}
```

### Correlation IDs

Every request is assigned a correlation ID for tracking across services:

```typescript
import { correlationIdStorage, logWithCorrelation } from '../utils/logger.js';

// Log with correlation ID
logWithCorrelation(
  'correlation-id-123',
  'info',
  'Processing request',
  { userId: 'user123' }
);
```

### Audit Logging

For sensitive operations, use audit logging:

```typescript
import { auditLog } from '../utils/logger.js';

auditLog(
  'user_data_access',
  'user123',
  'patient_records',
  { recordId: 'record456', operation: 'read' }
);
```

### Performance Logging

Track operation performance:

```typescript
import { logPerformance } from '../utils/logger.js';

const startTime = Date.now();
// ... operation ...
const duration = Date.now() - startTime;

logPerformance('database_query', duration, {
  query: 'SELECT * FROM users',
  rows: 100
});
```

### Security Logging

Log security events:

```typescript
import { logSecurityEvent } from '../utils/logger.js';

logSecurityEvent(
  'suspicious_login_attempt',
  'high',
  {
    ipAddress: '192.168.1.1',
    userId: 'user123',
    reason: 'multiple_failed_attempts'
  }
);
```

## Tracing

### OpenTelemetry Integration

Distributed tracing is enabled using OpenTelemetry with Jaeger backend.

### Creating Spans

```typescript
import { withSpan, createSpan } from '../lib/tracing.js';

// Automatic span creation with error handling
await withSpan('operation_name', async (span) => {
  span.setAttribute('user_id', 'user123');

  // Your operation here
  const result = await someOperation();

  return result;
}, { custom_attribute: 'value' });
```

### Manual Span Management

```typescript
import { createSpan } from '../lib/tracing.js';
import { SpanStatusCode } from '@opentelemetry/api';

const span = createSpan('manual_operation');
try {
  // Your operation
  span.setStatus({ code: SpanStatusCode.OK });
} catch (error) {
  span.setStatus({ code: SpanStatusCode.ERROR });
  span.recordException(error);
  throw error;
} finally {
  span.end();
}
```

### Trace Decorator

Use the `@Traced` decorator for automatic tracing:

```typescript
import { Traced } from '../lib/tracing.js';

class UserService {
  @Traced('UserService.createUser')
  async createUser(data: CreateUserDto) {
    // Method is automatically traced
    return await this.repository.create(data);
  }
}
```

## Dashboards

### API Overview Dashboard

**Location**: `infrastructure/kubernetes/monitoring/dashboards/api-overview.json`

**Metrics Displayed**:
- Requests per second
- Request rate by method and status
- Request duration percentiles (p50, p95, p99)
- Active connections
- Error rate (4xx and 5xx)
- Appointments activity
- Database query duration
- Database connection pool status

**Access**: https://grafana.unified-health.io/d/unified-health-api-overview

### Database Metrics Dashboard

**Location**: `infrastructure/kubernetes/monitoring/dashboards/database-metrics.json`

**Metrics Displayed**:
- Database memory usage
- Database CPU usage
- Active connections
- Rows fetched
- Transaction rate (commits/rollbacks)
- Database operations (inserts/updates/deletes)
- Cache hit ratio
- Database size
- Query duration by table
- Locks and active queries

**Access**: https://grafana.unified-health.io/d/unified-health-database-metrics

### Kubernetes Overview Dashboard

**Location**: `infrastructure/kubernetes/monitoring/dashboards/kubernetes-overview.json`

**Metrics Displayed**:
- Total nodes
- Total pods
- Pod restarts (24h)
- Unhealthy pods
- CPU usage by pod
- Memory usage by pod
- Network I/O by pod
- Disk I/O by pod
- Pods by phase
- Pod restart rate

**Access**: https://grafana.unified-health.io/d/unified-health-k8s-overview

## Alerting

### Alert Rules

Alert rules are defined in `infrastructure/kubernetes/monitoring/alerting/alert-rules.yaml`.

### Alert Categories

1. **API Alerts**
   - High/Critical API latency
   - High/Critical error rate
   - API service down

2. **Database Alerts**
   - High database connections
   - Connection pool exhaustion
   - Slow queries
   - Low cache hit ratio
   - Disk space warnings

3. **Infrastructure Alerts**
   - Frequent pod restarts
   - CrashLoopBackOff
   - High CPU/memory usage
   - Pod not ready
   - Node not ready

4. **Business Alerts**
   - Low appointment creation rate
   - High cancellation rate
   - High payment failure rate

5. **Security Alerts**
   - High rate limit violations
   - Failed login attempts

### Alert Routing

Alerts are routed based on severity:

- **Critical**: PagerDuty + Slack (#critical-alerts)
- **High**: Slack (#high-priority-alerts)
- **Warning**: Slack (#alerts)

### Notification Channels

Configure notification channels via environment variables:

```bash
SLACK_WEBHOOK_URL=your-slack-webhook-url
PAGERDUTY_SERVICE_KEY=your-pagerduty-service-key
```

## Alert Runbooks

### High API Latency

**Alert**: `HighAPILatency` / `CriticalAPILatency`

**Severity**: Warning / Critical

**Symptoms**:
- API response times are elevated
- Users experiencing slow page loads
- Database queries taking longer than usual

**Investigation**:
1. Check current API latency in Grafana dashboard
2. Identify which endpoints are slow
3. Check database query performance
4. Verify database connection pool status
5. Check for resource constraints (CPU, memory)

**Resolution**:
1. Scale up API pods if needed: `kubectl scale deployment unified-health-api --replicas=5`
2. Optimize slow queries identified in logs
3. Review and add database indexes if needed
4. Check for slow external service calls
5. Consider caching frequently accessed data

**Prevention**:
- Regular performance testing
- Database query optimization
- Implement caching strategies
- Set up auto-scaling based on load

---

### High Error Rate

**Alert**: `HighAPIErrorRate` / `CriticalAPIErrorRate`

**Severity**: High / Critical

**Symptoms**:
- Increased 5xx errors
- Failed API requests
- Error logs in application

**Investigation**:
1. Check error dashboard in Grafana
2. Review application logs for error details
3. Check database connectivity
4. Verify external service dependencies
5. Check for recent deployments

**Resolution**:
1. If after recent deployment, consider rollback
2. Fix identified bugs in code
3. Restart services if needed: `kubectl rollout restart deployment unified-health-api`
4. Check and restore database connections
5. Scale resources if overloaded

**Prevention**:
- Thorough testing before deployment
- Gradual rollout strategies (canary/blue-green)
- Circuit breakers for external services
- Better error handling and retry logic

---

### Database Connection Pool Exhaustion

**Alert**: `DatabaseConnectionPoolExhaustion`

**Severity**: High

**Symptoms**:
- Requests waiting for database connections
- API slowdown
- Timeout errors

**Investigation**:
1. Check connection pool metrics in Grafana
2. Review active database queries
3. Identify long-running queries
4. Check for connection leaks

**Resolution**:
1. Kill long-running queries: `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < NOW() - INTERVAL '5 minutes';`
2. Increase connection pool size temporarily
3. Fix connection leaks in application code
4. Optimize slow queries

**Prevention**:
- Proper connection management
- Connection timeout configuration
- Query optimization
- Regular connection pool monitoring

---

### Pod Crash Loop BackOff

**Alert**: `PodCrashLoopBackOff`

**Severity**: Critical

**Symptoms**:
- Pod continuously restarting
- Service unavailable
- Failed health checks

**Investigation**:
1. Check pod logs: `kubectl logs -n unified-health <pod-name> --previous`
2. Describe pod: `kubectl describe pod -n unified-health <pod-name>`
3. Check recent configuration changes
4. Verify resource limits
5. Check for application bugs

**Resolution**:
1. Fix application bug causing crash
2. Adjust resource limits if OOMKilled
3. Fix configuration issues
4. Rollback to previous working version if needed
5. Scale horizontally to maintain service

**Prevention**:
- Thorough testing of deployments
- Proper resource allocation
- Health check configuration
- Gradual rollouts

---

### High Payment Failure Rate

**Alert**: `HighPaymentFailureRate`

**Severity**: High

**Symptoms**:
- Users unable to complete payments
- Increased payment failures
- Revenue impact

**Investigation**:
1. Check payment gateway status
2. Review payment error logs
3. Verify API credentials
4. Check for rate limiting
5. Monitor payment gateway dashboard

**Resolution**:
1. Contact payment gateway support if needed
2. Refresh API credentials
3. Implement retry logic with exponential backoff
4. Switch to backup payment gateway if available
5. Notify users of payment issues

**Prevention**:
- Multiple payment gateway redundancy
- Proper error handling
- Regular testing of payment flows
- Monitor payment gateway status

## Deployment

### Prerequisites

1. Kubernetes cluster running
2. kubectl configured
3. Namespace created: `kubectl create namespace unified-health`

### Deploy Monitoring Stack

```bash
# Deploy Prometheus
kubectl apply -f infrastructure/kubernetes/monitoring/prometheus-config.yaml
kubectl apply -f infrastructure/kubernetes/monitoring/prometheus-deployment.yaml

# Deploy AlertManager
kubectl apply -f infrastructure/kubernetes/monitoring/alerting/alertmanager-config.yaml
kubectl apply -f infrastructure/kubernetes/monitoring/alerting/alert-rules.yaml

# Deploy Grafana
kubectl apply -f infrastructure/kubernetes/monitoring/grafana-deployment.yaml
kubectl apply -f infrastructure/kubernetes/monitoring/grafana-dashboards-configmap.yaml
```

### Configure Secrets

```bash
# Grafana admin credentials
kubectl create secret generic grafana-admin \
  --from-literal=admin-user=admin \
  --from-literal=admin-password=your-secure-password \
  -n unified-health

# AlertManager basic auth
kubectl create secret generic alertmanager-basic-auth \
  --from-literal=auth=$(htpasswd -nb admin password) \
  -n unified-health

# Prometheus basic auth
kubectl create secret generic prometheus-basic-auth \
  --from-literal=auth=$(htpasswd -nb admin password) \
  -n unified-health
```

### Verify Deployment

```bash
# Check pods
kubectl get pods -n unified-health

# Check services
kubectl get services -n unified-health

# Check ingress
kubectl get ingress -n unified-health
```

## Accessing Monitoring Tools

### Prometheus
- URL: https://prometheus.unified-health.io
- Credentials: Basic auth (configured secret)

### Grafana
- URL: https://grafana.unified-health.io
- Credentials: admin / (configured password)

### AlertManager
- URL: https://alertmanager.unified-health.io
- Credentials: Basic auth (configured secret)

### Jaeger
- URL: https://jaeger.unified-health.io
- No authentication required (internal network only)

## Maintenance

### Prometheus Data Retention

Default retention: 30 days
Adjust in `prometheus-deployment.yaml`:

```yaml
args:
  - '--storage.tsdb.retention.time=30d'
  - '--storage.tsdb.retention.size=45GB'
```

### Log Rotation

Application logs are automatically rotated:
- Max file size: 10MB
- Max files: 5 (errors), 10 (combined), 30 (audit)

### Backup

1. **Prometheus Data**: Configure persistent volume backups
2. **Grafana Dashboards**: Export via API or UI
3. **AlertManager Config**: Version controlled in Git

## Troubleshooting

### Metrics Not Showing

1. Verify Prometheus is scraping targets: https://prometheus.unified-health.io/targets
2. Check service annotations for Prometheus discovery
3. Verify metrics endpoint is accessible: `curl http://api-service:3000/metrics`

### No Alerts Firing

1. Check AlertManager configuration
2. Verify Prometheus rule files are loaded
3. Check AlertManager logs: `kubectl logs -n unified-health alertmanager-xxx`

### Missing Traces

1. Verify Jaeger endpoint configuration
2. Check OpenTelemetry initialization in application
3. Review application logs for tracing errors

## Best Practices

1. **Use correlation IDs** for all requests
2. **Add context** to log messages
3. **Create custom metrics** for business KPIs
4. **Set up alerts** for critical thresholds
5. **Regular review** of dashboards and alerts
6. **Document** custom metrics and their purpose
7. **Test alerts** regularly (alert fatigue prevention)
8. **Optimize queries** before they become bottlenecks

## Support

For monitoring and observability issues:
- Slack: #platform-monitoring
- Email: platform-team@unified-health.io
- On-call: PagerDuty escalation policy
