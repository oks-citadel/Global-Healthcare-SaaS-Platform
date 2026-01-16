# Monitoring Quick Reference Guide

Quick commands and tips for day-to-day monitoring operations.

## Access URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Prometheus | https://prometheus.unified-health.io | Basic Auth |
| Grafana | https://grafana.unified-health.io | admin / [secret] |
| AlertManager | https://alertmanager.unified-health.io | Basic Auth |
| Jaeger | https://jaeger.unified-health.io | None |

## Common Commands

### Check Monitoring Stack Health

```bash
# All monitoring pods
kubectl get pods -n unified-health -l component=monitoring

# Prometheus status
kubectl exec -it -n unified-health deploy/prometheus -- \
  wget -qO- http://localhost:9090/-/healthy

# Grafana status
kubectl exec -it -n unified-health deploy/grafana -- \
  wget -qO- http://localhost:3000/api/health
```

### View Logs

```bash
# Prometheus logs
kubectl logs -f -n unified-health deploy/prometheus --tail=100

# Grafana logs
kubectl logs -f -n unified-health deploy/grafana --tail=100

# AlertManager logs
kubectl logs -f -n unified-health deploy/alertmanager --tail=100

# API logs with metrics
kubectl logs -f -n unified-health deploy/unified-health-api | grep -i metric
```

### Check Metrics

```bash
# Test API metrics endpoint
kubectl port-forward -n unified-health svc/unified-health-api 3000:3000 &
curl http://localhost:3000/metrics | grep http_request

# Check specific metric
kubectl port-forward -n unified-health svc/prometheus 9090:9090 &
curl 'http://localhost:9090/api/v1/query?query=http_requests_total'
```

### Prometheus Targets

```bash
# List all targets
kubectl port-forward -n unified-health svc/prometheus 9090:9090 &
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, health: .health}'

# Check specific target health
curl 'http://localhost:9090/api/v1/targets' | \
  jq '.data.activeTargets[] | select(.labels.job=="unified-health-api")'
```

### Alert Management

```bash
# List active alerts
kubectl port-forward -n unified-health svc/alertmanager 9093:9093 &
curl http://localhost:9093/api/v1/alerts | jq '.data[] | {name: .labels.alertname, state: .status.state}'

# Silence an alert (30 minutes)
curl -X POST http://localhost:9093/api/v1/silences -d '{
  "matchers": [{"name": "alertname", "value": "HighAPILatency", "isRegex": false}],
  "startsAt": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "endsAt": "'$(date -u -d '+30 minutes' +%Y-%m-%dT%H:%M:%SZ)'",
  "createdBy": "admin",
  "comment": "Maintenance window"
}'

# List silences
curl http://localhost:9093/api/v1/silences | jq '.data[] | {id: .id, comment: .comment}'

# Delete silence
curl -X DELETE http://localhost:9093/api/v1/silence/<silence-id>
```

### Reload Configurations

```bash
# Reload Prometheus config (without restart)
kubectl exec -n unified-health deploy/prometheus -- \
  kill -HUP 1

# Or use the API
curl -X POST http://localhost:9090/-/reload

# Restart Grafana to reload dashboards
kubectl rollout restart -n unified-health deploy/grafana

# Restart AlertManager
kubectl rollout restart -n unified-health deploy/alertmanager
```

### Query Prometheus

```bash
# Request rate (last 5 minutes)
curl -G http://localhost:9090/api/v1/query \
  --data-urlencode 'query=rate(http_requests_total[5m])'

# 95th percentile latency
curl -G http://localhost:9090/api/v1/query \
  --data-urlencode 'query=histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))'

# Active database connections
curl -G http://localhost:9090/api/v1/query \
  --data-urlencode 'query=db_connection_pool_active'

# Error rate
curl -G http://localhost:9090/api/v1/query \
  --data-urlencode 'query=(sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))) * 100'
```

## Key Metrics to Monitor

### API Health
```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))

# Latency p95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Active connections
http_active_connections
```

### Database Health
```promql
# Connection pool usage
db_connection_pool_active / (db_connection_pool_active + db_connection_pool_idle)

# Query latency
histogram_quantile(0.95, rate(db_query_duration_seconds_bucket[5m]))

# Cache hit ratio
rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m]))
```

### Business Metrics
```promql
# Appointment creation rate
rate(appointments_created_total[1h])

# Payment success rate
sum(rate(payments_processed_total{status="success"}[5m])) / sum(rate(payments_processed_total[5m]))

# User registration rate
rate(users_registered_total[1h])
```

### Infrastructure
```promql
# Pod CPU usage
sum(rate(container_cpu_usage_seconds_total{namespace="unified-health"}[5m])) by (pod) * 100

# Pod memory usage
sum(container_memory_working_set_bytes{namespace="unified-health"}) by (pod)

# Pod restart rate
rate(kube_pod_container_status_restarts_total{namespace="unified-health"}[1h])
```

## Grafana Operations

### Export Dashboard

```bash
# Get dashboard UID from Grafana UI, then:
kubectl port-forward -n unified-health svc/grafana 3000:3000 &

# Create API key first in Grafana UI: Settings → API Keys

# Export dashboard
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3000/api/dashboards/uid/DASHBOARD_UID > dashboard.json
```

### Import Dashboard

```bash
# Via API
curl -X POST http://localhost:3000/api/dashboards/db \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d @dashboard.json

# Or add to ConfigMap and restart Grafana
kubectl create configmap custom-dashboard \
  --from-file=dashboard.json \
  -n unified-health

kubectl rollout restart -n unified-health deploy/grafana
```

### Create Grafana Snapshot

```bash
# Via UI: Dashboard → Share → Snapshot → Publish to snapshots.raintank.io

# Via API
curl -X POST http://localhost:3000/api/snapshots \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "dashboard": {...},
    "expires": 3600
  }'
```

## Troubleshooting Checklist

### No Metrics Showing

- [ ] Check Prometheus targets: `/targets`
- [ ] Verify pod annotations for scraping
- [ ] Check network policies
- [ ] Verify metrics endpoint: `curl pod-ip:port/metrics`
- [ ] Check Prometheus logs for errors

### High Memory Usage

```bash
# Check Prometheus memory
kubectl top pod -n unified-health | grep prometheus

# Reduce cardinality
# Add recording rules for expensive queries
# Reduce retention period
# Increase memory limits
```

### Alerts Not Firing

- [ ] Check alert rules loaded: `/rules`
- [ ] Verify alert evaluation: Check rule state
- [ ] Check AlertManager config
- [ ] Test notification channels
- [ ] Check AlertManager logs

### Dashboards Not Loading

- [ ] Check Grafana logs
- [ ] Verify datasource connection
- [ ] Check dashboard JSON syntax
- [ ] Verify metrics exist in Prometheus

## Emergency Procedures

### Scale Up Monitoring

```bash
# Scale Prometheus for high load
kubectl scale deployment prometheus --replicas=2 -n unified-health
kubectl patch deployment prometheus -n unified-health \
  -p '{"spec":{"template":{"spec":{"containers":[{"name":"prometheus","resources":{"limits":{"memory":"8Gi","cpu":"4"}}}]}}}}'

# Scale Grafana
kubectl scale deployment grafana --replicas=2 -n unified-health
```

### Reduce Monitoring Load

```bash
# Increase scrape interval temporarily
kubectl edit configmap prometheus-config -n unified-health
# Change: scrape_interval: 30s → 60s

# Reload Prometheus
kubectl exec -n unified-health deploy/prometheus -- kill -HUP 1
```

### Clear Prometheus Data

```bash
# Delete PVC (will lose all metrics!)
kubectl scale deployment prometheus --replicas=0 -n unified-health
kubectl delete pvc prometheus-storage -n unified-health
kubectl scale deployment prometheus --replicas=1 -n unified-health
```

## Maintenance Windows

### Before Maintenance

```bash
# Create silence in AlertManager
SILENCE_ID=$(curl -X POST http://localhost:9093/api/v1/silences -d '{
  "matchers": [{"name": "alertname", "value": ".*", "isRegex": true}],
  "startsAt": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "endsAt": "'$(date -u -d '+2 hours' +%Y-%m-%dT%H:%M:%SZ)'",
  "createdBy": "admin",
  "comment": "Scheduled maintenance"
}' | jq -r '.silenceID')

echo "Silence ID: $SILENCE_ID"
```

### After Maintenance

```bash
# Delete silence
curl -X DELETE http://localhost:9093/api/v1/silence/$SILENCE_ID
```

## Performance Tuning

### Recording Rules

Add to `alert-rules.yaml`:

```yaml
groups:
  - name: recording-rules
    interval: 30s
    rules:
      - record: job:http_requests:rate5m
        expr: sum(rate(http_requests_total[5m])) by (job)

      - record: job:http_request_duration:p95
        expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (job, le))
```

### Query Optimization

```bash
# Use recording rules for expensive queries
# Reduce time range in dashboards
# Use rate() instead of increase() when possible
# Avoid high cardinality labels
```

## Backup and Restore

### Backup Prometheus Data

```bash
# Create snapshot
kubectl exec -n unified-health deploy/prometheus -- \
  curl -X POST http://localhost:9090/api/v1/admin/tsdb/snapshot

# Copy snapshot
SNAPSHOT=$(kubectl exec -n unified-health deploy/prometheus -- \
  ls -t /prometheus/snapshots | head -1)

kubectl cp unified-health/prometheus-pod:/prometheus/snapshots/$SNAPSHOT \
  ./prometheus-backup/
```

### Backup Grafana

```bash
# Backup Grafana PVC
kubectl get pvc grafana-storage -n unified-health -o yaml > grafana-pvc-backup.yaml

# Backup dashboards (via ConfigMap)
kubectl get configmap grafana-dashboards -n unified-health -o yaml > grafana-dashboards-backup.yaml
```

## Useful PromQL Examples

```promql
# Top 5 endpoints by request count
topk(5, sum(rate(http_requests_total[5m])) by (route))

# Requests per second by status code
sum(rate(http_requests_total[5m])) by (status_code)

# Average response time
avg(rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m]))

# Database query failure rate
sum(rate(db_query_duration_seconds_count{status="error"}[5m])) / sum(rate(db_query_duration_seconds_count[5m]))

# Memory usage percentage
(container_memory_working_set_bytes / container_spec_memory_limit_bytes) * 100

# Predict disk full (linear regression)
predict_linear(node_filesystem_avail_bytes[1h], 7*24*3600) < 0
```

## Integration Code Examples

### Log a Metric

```typescript
import { appointmentsCreated } from '../lib/metrics.js';

appointmentsCreated.inc({ status: 'scheduled', type: 'consultation' });
```

### Add Trace Span

```typescript
import { withSpan } from '../lib/tracing.js';

await withSpan('processPayment', async (span) => {
  span.setAttribute('amount', amount);
  span.setAttribute('currency', currency);
  // Your code
});
```

### Structured Logging

```typescript
import { logger, auditLog } from '../utils/logger.js';

logger.info('Payment processed', {
  userId,
  amount,
  paymentId
});

auditLog('payment_processed', userId, 'payment', { amount, paymentId });
```

## Contacts

- Platform Team: #platform-monitoring
- On-Call: PagerDuty escalation
- Email: platform-team@unified-health.io
- Documentation: https://docs.unified-health.io/monitoring
