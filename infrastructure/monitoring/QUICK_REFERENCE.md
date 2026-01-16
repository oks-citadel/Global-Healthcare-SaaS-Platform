# Monitoring Quick Reference Guide
## Unified Healthcare Platform

**For:** On-Call Engineers, SREs, DevOps
**Quick Links:** [Dashboards](#dashboards) | [Alerts](#common-alerts) | [Queries](#useful-queries) | [Commands](#useful-commands)

---

## Emergency Contacts

| Role | Contact | Method |
|------|---------|--------|
| On-Call SRE | oncall@thetheunifiedhealth.com | PagerDuty: +1-555-0100 |
| Engineering Lead | john.doe@thetheunifiedhealth.com | +1-555-0101 |
| Security Lead | security@thetheunifiedhealth.com | +1-555-0105 |

---

## Dashboards

### Quick Access URLs

| Dashboard | URL | Use Case |
|-----------|-----|----------|
| System Health | https://portal.azure.com/#dashboard/system-health | Overall system status |
| API Performance | https://grafana.thetheunifiedhealth.com/d/api-perf | Backend performance |
| Business Metrics | https://grafana.thetheunifiedhealth.com/d/business | KPIs and metrics |
| SLO Tracking | https://grafana.thetheunifiedhealth.com/d/slo | SLO compliance |

### Key Metrics to Watch

**Critical (Check every hour):**
- Service Availability: Should be > 99.9%
- Error Rate: Should be < 0.1%
- API Latency P95: Should be < 500ms

**Important (Check daily):**
- Active Users
- Appointment Creation Rate
- Payment Success Rate
- Database Connection Pool Usage

---

## Common Alerts

### SEV0 Alerts (Immediate Response)

#### Service Availability Below SLA
```
Trigger: Availability < 99.9%
Impact: Complete or partial outage
First Action: Check service health, recent deployments
Command: kubectl get pods -n unified-health
```

#### Critical Error Rate Spike
```
Trigger: Critical errors > 10 in 1 minute
Impact: System instability
First Action: Check error logs
Command: kubectl logs deployment/unified-health-api -n unified-health --tail=100 | grep ERROR
```

### SEV1 Alerts (15-minute response)

#### High API Error Rate
```
Trigger: Error rate > 5%
Impact: Elevated errors affecting users
First Action: Check recent changes, database connectivity
```

#### High API Latency
```
Trigger: P95 > 1s or P99 > 3s
Impact: Slow response times
First Action: Check pod resources, database queries
Command: kubectl top pods -n unified-health
```

### SEV2 Alerts (1-hour response)

#### High CPU/Memory Utilization
```
Trigger: CPU > 80% or Memory > 85%
Impact: Performance degradation risk
First Action: Check for resource leaks, consider scaling
```

---

## Useful Queries

### Azure Log Analytics (KQL)

#### Recent Errors (Last 15 minutes)
```kusto
ApplicationLogs_CL
| where TimeGenerated > ago(15m)
| where Level == "ERROR"
| project TimeGenerated, Service, Message, CorrelationId
| order by TimeGenerated desc
| take 50
```

#### Error Rate by Service
```kusto
ApplicationLogs_CL
| where TimeGenerated > ago(1h)
| summarize TotalCount=count(), ErrorCount=countif(Level=="ERROR") by Service
| extend ErrorRate = ErrorCount * 100.0 / TotalCount
| order by ErrorRate desc
```

#### Slow API Requests (>1s)
```kusto
ApplicationLogs_CL
| where TimeGenerated > ago(1h)
| where Duration > 1000
| project TimeGenerated, Route, Method, Duration, StatusCode
| order by Duration desc
| take 50
```

#### User Login Failures
```kusto
ApplicationLogs_CL
| where TimeGenerated > ago(1h)
| where Message contains "login" and Level == "ERROR"
| summarize count() by bin(TimeGenerated, 5m)
| render timechart
```

### Prometheus (PromQL)

#### Request Rate (Last 5 minutes)
```promql
sum(rate(http_requests_total[5m])) by (method, route)
```

#### Error Rate Percentage
```promql
sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

#### P95 API Latency
```promql
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))
```

#### Top 10 Slowest Endpoints
```promql
topk(10, histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route)))
```

#### Database Connection Pool Usage
```promql
(db_connection_pool_active / (db_connection_pool_active + db_connection_pool_idle)) * 100
```

---

## Useful Commands

### Kubernetes

#### Check Pod Health
```bash
# List all pods with status
kubectl get pods -n unified-health

# Describe specific pod
kubectl describe pod <pod-name> -n unified-health

# Get pod logs
kubectl logs <pod-name> -n unified-health --tail=100 --follow

# Get logs from previous crashed container
kubectl logs <pod-name> -n unified-health --previous

# Check pod resource usage
kubectl top pods -n unified-health

# Check node resource usage
kubectl top nodes
```

#### Deployment Management
```bash
# Check deployment status
kubectl rollout status deployment/unified-health-api -n unified-health

# View deployment history
kubectl rollout history deployment/unified-health-api -n unified-health

# Rollback to previous version
kubectl rollout undo deployment/unified-health-api -n unified-health

# Scale deployment
kubectl scale deployment/unified-health-api --replicas=5 -n unified-health

# Restart deployment
kubectl rollout restart deployment/unified-health-api -n unified-health
```

#### Troubleshooting
```bash
# Get events
kubectl get events -n unified-health --sort-by='.lastTimestamp'

# Execute command in pod
kubectl exec -it <pod-name> -n unified-health -- /bin/bash

# Port forward to access service locally
kubectl port-forward svc/unified-health-api 8080:8080 -n unified-health

# Get service endpoints
kubectl get endpoints -n unified-health

# Check configmaps
kubectl get configmap -n unified-health
kubectl describe configmap unified-health-config -n unified-health

# Check secrets
kubectl get secrets -n unified-health
```

### Azure CLI

#### Application Insights
```bash
# Query Application Insights
az monitor app-insights query \
  --app unified-health-insights \
  --resource-group unified-health-monitoring-rg \
  --analytics-query "requests | where timestamp > ago(1h) | summarize count() by bin(timestamp, 5m)"

# Get instrumentation key
az monitor app-insights component show \
  --resource-group unified-health-monitoring-rg \
  --app unified-health-insights \
  --query instrumentationKey
```

#### Log Analytics
```bash
# Run KQL query
az monitor log-analytics query \
  --workspace <workspace-id> \
  --analytics-query "ApplicationLogs_CL | where Level == 'ERROR' | top 10 by TimeGenerated desc"
```

#### Alerts
```bash
# List active alerts
az monitor metrics alert list \
  --resource-group unified-health-monitoring-rg \
  --query "[?enabled==\`true\`]"

# Show alert details
az monitor metrics alert show \
  --name high-api-error-rate \
  --resource-group unified-health-monitoring-rg

# List fired alerts
az monitor metrics alert list \
  --resource-group unified-health-monitoring-rg \
  --query "[?state=='Fired']"
```

#### Resources
```bash
# Get resource IDs
az resource list \
  --resource-group unified-health-rg \
  --query "[].{name:name, type:type, id:id}"

# Get resource metrics
az monitor metrics list \
  --resource <resource-id> \
  --metric "Percentage CPU"

# Scale AKS cluster
az aks scale \
  --name unified-health-cluster \
  --resource-group unified-health-rg \
  --node-count 5
```

### Database

#### PostgreSQL
```bash
# Connect to database
kubectl exec -it postgres-0 -n unified-health -- psql -U unified_health

# Check active connections
SELECT count(*) FROM pg_stat_activity;

# Check long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC
LIMIT 10;

# Kill problematic query
SELECT pg_terminate_backend(pid);

# Check database size
SELECT pg_size_pretty(pg_database_size('unified_health_dev'));

# Check table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;
```

#### Redis
```bash
# Connect to Redis
kubectl exec -it redis-0 -n unified-health -- redis-cli

# Check Redis info
INFO

# Get memory stats
INFO memory

# Get keyspace info
INFO keyspace

# Monitor commands in real-time
MONITOR

# Get slow log
SLOWLOG GET 10
```

---

## Common Scenarios

### Scenario: High Error Rate

**Symptoms:** Error rate alert triggered

**Quick Diagnosis:**
1. Check error distribution: `kubectl logs deployment/unified-health-api -n unified-health --tail=200 | grep ERROR | awk '{print $5}' | sort | uniq -c`
2. Check recent deployments: `kubectl rollout history deployment/unified-health-api -n unified-health`
3. Check database connectivity: `kubectl exec -it deployment/unified-health-api -n unified-health -- nc -zv postgres-service 5432`

**Quick Fixes:**
- Rollback if recent deployment: `kubectl rollout undo deployment/unified-health-api -n unified-health`
- Restart if transient: `kubectl rollout restart deployment/unified-health-api -n unified-health`
- Scale if overloaded: `kubectl scale deployment/unified-health-api --replicas=10 -n unified-health`

### Scenario: High Latency

**Symptoms:** API response time > 1s

**Quick Diagnosis:**
1. Check pod resources: `kubectl top pods -n unified-health`
2. Check database queries: See PostgreSQL commands above
3. Check cache hit rate: `curl https://api.thetheunifiedhealth.com/metrics | grep cache_hit`

**Quick Fixes:**
- Scale up: `kubectl scale deployment/unified-health-api --replicas=10 -n unified-health`
- Restart to clear potential memory leaks: `kubectl rollout restart deployment/unified-health-api -n unified-health`
- Increase database connections in config

### Scenario: Pod Crashes

**Symptoms:** Pods in CrashLoopBackOff

**Quick Diagnosis:**
1. Check pod status: `kubectl get pods -n unified-health | grep -v Running`
2. Get pod description: `kubectl describe pod <pod-name> -n unified-health`
3. Check logs: `kubectl logs <pod-name> -n unified-health --previous`

**Common Causes:**
- OOMKilled: Increase memory limits
- Failed health checks: Adjust health check config
- Configuration error: Check ConfigMap
- Image pull error: Verify image registry

---

## Incident Workflow

### Quick Steps for Any Alert

1. **Acknowledge** (30 seconds)
   - Acknowledge in PagerDuty
   - Join #incidents channel in Slack

2. **Assess** (2 minutes)
   - Check dashboards
   - Determine severity
   - Identify impact

3. **Communicate** (3 minutes)
   - Create incident channel: `/incident create`
   - Post initial status
   - Page additional help if needed

4. **Investigate** (5-15 minutes)
   - Check logs
   - Check metrics
   - Check recent changes
   - Identify root cause

5. **Mitigate** (15-30 minutes)
   - Apply fix
   - Monitor recovery
   - Verify resolution

6. **Document** (Ongoing)
   - Update incident timeline
   - Record all actions taken
   - Prepare for post-incident review

---

## Health Check URLs

| Service | URL | Expected Response |
|---------|-----|-------------------|
| API | https://api.thetheunifiedhealth.com/health | 200 OK |
| Web | https://app.thetheunifiedhealth.com/api/health | 200 OK |
| Metrics | https://api.thetheunifiedhealth.com/metrics | 200 OK (Prometheus format) |

---

## Runbook Links

- **Full Incident Response Runbook:** [incident-response-runbook.md](./incident-response-runbook.md)
- **SLO Definitions:** [sli-slo-definitions.yaml](./sli-slo-definitions.yaml)
- **Alert Rules:** [alert-rules.yaml](./alert-rules.yaml)

---

## Cheat Sheet: First 5 Minutes of Any Incident

```bash
# 1. Quick health check
kubectl get pods -n unified-health
kubectl top nodes

# 2. Check recent errors
kubectl logs deployment/unified-health-api -n unified-health --tail=100 | grep ERROR

# 3. Check recent deployments
kubectl rollout history deployment/unified-health-api -n unified-health

# 4. Check metrics endpoint
curl https://api.thetheunifiedhealth.com/metrics | head -20

# 5. Check Application Insights
# Visit: https://portal.azure.com > Application Insights > Live Metrics
```

---

**Last Updated:** 2025-12-17
**Maintained By:** SRE Team
**Feedback:** sre@thetheunifiedhealth.com
