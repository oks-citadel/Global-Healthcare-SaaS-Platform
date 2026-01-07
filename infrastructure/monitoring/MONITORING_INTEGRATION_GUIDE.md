# Monitoring Integration Guide
## Unified Healthcare Platform

Complete guide for integrating comprehensive monitoring, metrics, and alerting across all services.

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Integration Steps](#integration-steps)
5. [Metrics Collection](#metrics-collection)
6. [Dashboard Setup](#dashboard-setup)
7. [Alerting Configuration](#alerting-configuration)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This monitoring solution provides:

- **Prometheus** for metrics collection and storage
- **Grafana** for visualization and dashboards
- **Azure Application Insights** for distributed tracing and APM
- **AlertManager** for intelligent alerting
- **Custom metrics** for business and technical KPIs
- **Production-ready** configurations and dashboards

### Key Features

- Automatic service discovery in Kubernetes
- Pre-configured dashboards for all services
- Intelligent alerting with runbooks
- HIPAA-compliant logging and monitoring
- Performance tracking and SLO monitoring
- Business metrics tracking

---

## Quick Start

### 1. Deploy Monitoring Stack

```bash
# Navigate to monitoring directory
cd infrastructure/monitoring

# Make deployment script executable
chmod +x deploy-monitoring-stack.sh

# Run deployment
./deploy-monitoring-stack.sh
```

### 2. Access Dashboards

```bash
# Port forward to Grafana
kubectl port-forward --namespace unified-health-monitoring svc/grafana 3000:80

# Open browser to http://localhost:3000
# Username: admin
# Password: (retrieved from script output)
```

### 3. Verify Metrics Collection

```bash
# Port forward to Prometheus
kubectl port-forward --namespace unified-health-monitoring svc/prometheus-server 9090:80

# Open browser to http://localhost:9090
# Check Status > Targets to see all scraped endpoints
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Monitoring Stack                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Services    │  │  Services    │  │  Services    │      │
│  │  /metrics    │  │  /metrics    │  │  /metrics    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘              │
│                            │                                  │
│                    ┌───────▼────────┐                        │
│                    │   Prometheus   │                        │
│                    │   (Scraping)   │                        │
│                    └───────┬────────┘                        │
│                            │                                  │
│              ┌─────────────┼─────────────┐                  │
│              │                             │                  │
│      ┌───────▼────────┐          ┌───────▼────────┐        │
│      │     Grafana    │          │  AlertManager  │        │
│      │  (Visualization)│          │   (Alerting)   │        │
│      └────────────────┘          └────────────────┘        │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Azure Application Insights                    │  │
│  │         (Distributed Tracing & APM)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration Steps

### Step 1: Add Dependencies to Services

For each microservice, add monitoring dependencies:

**package.json:**
```json
{
  "dependencies": {
    "prom-client": "^15.1.0",
    "applicationinsights": "^2.9.1"
  }
}
```

Install dependencies:
```bash
npm install prom-client applicationinsights
```

### Step 2: Initialize Metrics in Service

Create `src/lib/metrics.ts`:

```typescript
import { createServiceMetrics } from '../../../infrastructure/monitoring/shared-metrics-library';

// Initialize metrics for your service
export const metrics = createServiceMetrics('your-service-name');

// Export register for /metrics endpoint
export const { register } = metrics;
```

### Step 3: Add Metrics Middleware

In your Express app (`src/index.ts`):

```typescript
import express from 'express';
import { metrics } from './lib/metrics';
import { createMetricsRouter } from '../../infrastructure/monitoring/shared-metrics-library';

const app = express();

// Add metrics middleware (tracks all HTTP requests)
app.use(metrics.createMiddleware());

// Add /metrics endpoint
app.get('/metrics', createMetricsRouter(metrics));

// Your routes here...
```

### Step 4: Initialize Azure Application Insights

```typescript
import { azureInsights, createAzureInsightsMiddleware } from '../../infrastructure/monitoring/azure-insights-integration';

// Initialize Application Insights
azureInsights.initialize({
  roleName: 'your-service-name',
  enableAutoCollect: true,
  enableLiveMetrics: true,
});

// Add middleware
app.use(createAzureInsightsMiddleware());
```

### Step 5: Add Service Annotations for Prometheus

Update your Kubernetes deployment (`kubernetes/base/your-service-deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: your-service
spec:
  template:
    metadata:
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      containers:
        - name: your-service
          image: your-service:latest
          ports:
            - containerPort: 3000
              name: http
          env:
            - name: APPINSIGHTS_INSTRUMENTATION_KEY
              valueFrom:
                secretKeyRef:
                  name: appinsights-secrets
                  key: APPINSIGHTS_INSTRUMENTATION_KEY
```

---

## Metrics Collection

### Standard HTTP Metrics

Automatically collected by the metrics middleware:

- `http_request_duration_seconds` - Request duration histogram
- `http_requests_total` - Total request counter
- `http_active_connections` - Active connections gauge

### Database Metrics

Track database queries:

```typescript
import { metrics } from './lib/metrics';

// Track query execution
const result = await metrics.measureAsync(
  async () => {
    return await prisma.user.findMany();
  },
  (duration, error) => {
    metrics.trackDatabaseQuery('findMany', 'user', duration, !error);
  }
);
```

Or use the helper:

```typescript
import { trackDatabaseQuery } from './lib/metrics';

const users = await trackDatabaseQuery('findMany', 'User', async () => {
  return await prisma.user.findMany();
});
```

### Custom Business Metrics

Track business-specific events:

```typescript
import { healthcareMetrics } from '../../infrastructure/monitoring/azure-insights-integration';

// Track appointment created
healthcareMetrics.trackAppointmentCreated('video-consultation', 'cardiology', 30);

// Track consultation completed
healthcareMetrics.trackConsultationCompleted(
  'video',
  'general-practice',
  1200, // duration in seconds
  true  // prescription issued
);

// Track payment
healthcareMetrics.trackPaymentProcessed(
  150.00,
  'USD',
  'stripe',
  true
);
```

### External Service Calls

Track external API calls:

```typescript
import { metrics } from './lib/metrics';

const response = await metrics.measureAsync(
  async () => {
    return await fetch('https://api.stripe.com/v1/charges');
  },
  (duration, error) => {
    metrics.trackExternalServiceCall(
      'stripe',
      'create_charge',
      duration,
      !error
    );
  }
);
```

### Cache Operations

Track cache hits and misses:

```typescript
import { metrics } from './lib/metrics';

const cachedValue = await redis.get(key);
metrics.trackCacheOperation('user-cache', 'get', cachedValue !== null);
```

---

## Dashboard Setup

### Available Dashboards

1. **System Overview** (`grafana-dashboard-system-health.json`)
   - Service availability
   - Resource utilization
   - Request rates
   - Error rates

2. **API Performance** (`dashboard-api-performance.json`)
   - Request throughput
   - Latency percentiles (P50, P95, P99)
   - Status code distribution
   - Endpoint-specific metrics

3. **Database Metrics** (`grafana-dashboard-database.json`)
   - Query performance
   - Connection pool status
   - Slow queries
   - Query error rates

4. **Error Monitoring** (`grafana-dashboard-errors.json`)
   - Error rates by service
   - Error distribution
   - Critical errors
   - Error logs

### Import Custom Dashboards

1. Access Grafana at `http://localhost:3000`
2. Navigate to **Dashboards** > **Import**
3. Upload JSON file or paste JSON content
4. Select Prometheus as the data source
5. Click **Import**

### Create Custom Panels

Example PromQL queries:

```promql
# Request rate by service
sum(rate(http_requests_total[5m])) by (service)

# P95 latency
histogram_quantile(0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
)

# Error rate percentage
(
  sum(rate(http_requests_total{status_code=~"5.."}[5m])) by (service)
  /
  sum(rate(http_requests_total[5m])) by (service)
) * 100

# Database connection pool utilization
(
  db_connection_pool_active
  /
  (db_connection_pool_active + db_connection_pool_idle)
) * 100
```

---

## Alerting Configuration

### Alert Rules

All alert rules are defined in `prometheus-alert-rules.yml`:

- **Service Availability** - Alerts when services go down
- **Error Rates** - Alerts on high error rates (>5%)
- **Latency** - Alerts on high response times
- **Resource Utilization** - CPU, memory, disk alerts
- **Database Health** - Connection pool, query performance
- **Business Metrics** - Low appointment rates, payment failures
- **Security** - Rate limiting, suspicious access patterns

### Alert Severity Levels

- **Critical** (Severity 1) - Immediate action required, pages on-call
- **Warning** (Severity 2) - Action required within 15 minutes
- **Info** (Severity 3) - Informational, review during business hours

### Configure Alert Channels

#### Slack Integration

```yaml
# In alertmanager-config.yml
receivers:
  - name: 'slack-alerts'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
        channel: '#alerts'
        title: 'Alert: {{ .GroupLabels.alertname }}'
        text: '{{ .CommonAnnotations.description }}'
```

#### PagerDuty Integration

```yaml
receivers:
  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_SERVICE_KEY'
        description: '{{ .GroupLabels.alertname }}'
```

#### Email Integration

```yaml
receivers:
  - name: 'email-alerts'
    email_configs:
      - to: 'sre-team@theunifiedhealth.com'
        from: 'alerts@thetheunifiedhealth.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'alerts@thetheunifiedhealth.com'
        auth_password: 'YOUR_PASSWORD'
```

### Test Alerts

```bash
# Trigger a test alert
curl -X POST http://localhost:9093/api/v1/alerts -d '[{
  "labels": {
    "alertname": "TestAlert",
    "severity": "warning"
  },
  "annotations": {
    "summary": "Test alert from monitoring integration",
    "description": "This is a test alert"
  }
}]'
```

---

## Best Practices

### Metric Naming Conventions

Follow Prometheus naming conventions:

- Use **snake_case** for metric names
- Include **unit** in the name (e.g., `_seconds`, `_bytes`, `_total`)
- Use **consistent labels** across services
- Avoid high cardinality labels (e.g., user IDs, timestamps)

**Good:**
```typescript
http_request_duration_seconds{method="GET", route="/api/users", status_code="200"}
```

**Bad:**
```typescript
httpRequestDuration{method="GET", url="/api/users/12345", timestamp="2025-12-18"}
```

### Label Best Practices

- Keep labels to 5-10 per metric
- Use consistent label names across services
- Avoid user-specific data in labels (PII/PHI)
- Use meaningful label values

### Performance Considerations

1. **Sampling for High-Traffic Endpoints**
   ```typescript
   // Only track 10% of health check requests
   if (req.path !== '/health' || Math.random() < 0.1) {
     // Track metric
   }
   ```

2. **Batch Metrics Updates**
   ```typescript
   // Update metrics in batches
   setInterval(() => {
     metrics.dbConnectionPoolActive.set(getCurrentActiveConnections());
   }, 10000); // Every 10 seconds
   ```

3. **Use Histograms Wisely**
   - Histograms are expensive (create multiple time series)
   - Use appropriate bucket sizes
   - Consider summaries for high-cardinality metrics

### Data Retention

- **Prometheus**: 30 days (configurable)
- **Azure Application Insights**: 90 days
- **Logs**: 90 days (HIPAA compliance requirement)

### Security Considerations

1. **Sanitize Metrics**
   - Never include PII/PHI in metric labels
   - Redact sensitive data in logs
   - Use the built-in sanitization in `azure-insights-integration.ts`

2. **Access Control**
   - Limit Grafana access with RBAC
   - Use Kubernetes secrets for credentials
   - Enable authentication on Prometheus/Grafana

3. **Network Security**
   - Use network policies to restrict access
   - Enable TLS for external access
   - Use Azure Private Link for Application Insights

---

## Troubleshooting

### Metrics Not Appearing in Prometheus

**Check 1: Verify service is running**
```bash
kubectl get pods -n unified-health
```

**Check 2: Verify /metrics endpoint**
```bash
kubectl port-forward pod/your-service-pod 3000:3000
curl http://localhost:3000/metrics
```

**Check 3: Verify Prometheus annotations**
```bash
kubectl get deployment your-service -n unified-health -o yaml | grep prometheus
```

**Check 4: Check Prometheus targets**
```bash
kubectl port-forward -n unified-health-monitoring svc/prometheus-server 9090:80
# Navigate to http://localhost:9090/targets
```

### High Memory Usage in Prometheus

**Solution 1: Reduce retention period**
```bash
helm upgrade prometheus prometheus-community/prometheus \
  --set server.retention=15d \
  --namespace unified-health-monitoring
```

**Solution 2: Increase storage**
```bash
helm upgrade prometheus prometheus-community/prometheus \
  --set server.persistentVolume.size=100Gi \
  --namespace unified-health-monitoring
```

**Solution 3: Reduce scrape frequency**
```yaml
# In prometheus-config.yml
global:
  scrape_interval: 30s  # Increase from 15s
```

### Grafana Dashboard Not Loading

**Check 1: Verify data source**
- Go to Configuration > Data Sources
- Test connection to Prometheus
- Ensure URL is correct: `http://prometheus-server:80`

**Check 2: Verify time range**
- Check if data exists for selected time range
- Try "Last 1 hour" to see recent data

**Check 3: Check queries**
- Open dashboard panel settings
- Verify PromQL queries are valid
- Test query in Prometheus UI first

### Application Insights Not Receiving Data

**Check 1: Verify instrumentation key**
```bash
kubectl get secret appinsights-secrets -n unified-health -o yaml
```

**Check 2: Check application logs**
```bash
kubectl logs deployment/your-service -n unified-health | grep -i "appinsights\|insights"
```

**Check 3: Test connection**
```bash
# From inside a pod
curl -X POST https://dc.services.visualstudio.com/v2/track \
  -H "Content-Type: application/json" \
  -d '{"name":"test","time":"2025-12-18T10:00:00Z","iKey":"YOUR_KEY"}'
```

### Alerts Not Firing

**Check 1: Verify alert rules are loaded**
```bash
kubectl logs -n unified-health-monitoring deployment/prometheus-server | grep -i "alert"
```

**Check 2: Check alert state in Prometheus**
- Navigate to http://localhost:9090/alerts
- Check if alerts are pending or firing

**Check 3: Verify AlertManager configuration**
```bash
kubectl get configmap alertmanager-config -n unified-health-monitoring
```

---

## Additional Resources

### Documentation
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Azure Application Insights Docs](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)

### Example Queries
See `QUICK_REFERENCE.md` for common PromQL queries

### Runbooks
See `incident-response-runbook.md` for alert response procedures

### Support
- **SRE Team**: sre@thetheunifiedhealth.com
- **On-Call**: oncall@thetheunifiedhealth.com
- **Documentation**: https://wiki.thetheunifiedhealth.com/monitoring

---

**Last Updated**: 2025-12-18
**Version**: 2.0
**Maintainer**: SRE Team
