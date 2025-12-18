# Monitoring and Observability Setup
## Unified Healthcare Platform

This directory contains all monitoring, observability, and incident response configurations for the Unified Healthcare Platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Components](#components)
3. [Quick Start](#quick-start)
4. [Configuration Files](#configuration-files)
5. [Deployment](#deployment)
6. [Dashboards](#dashboards)
7. [Alerting](#alerting)
8. [SLIs/SLOs](#slisslos)
9. [Incident Response](#incident-response)
10. [Maintenance](#maintenance)

---

## Overview

The monitoring infrastructure provides comprehensive observability across the entire healthcare platform, including:

- **API Performance Monitoring**: Request rates, latency, error rates
- **Frontend Performance**: Page load times, Web Vitals, user interactions
- **Infrastructure Metrics**: CPU, memory, disk, network
- **Business Metrics**: Appointments, consultations, payments, user engagement
- **Security Monitoring**: Authentication, authorization, audit trails
- **Compliance Tracking**: HIPAA-compliant logging and audit trails

### Key Features

- ✅ Real-time monitoring and alerting
- ✅ Centralized logging with retention policies
- ✅ Custom dashboards for different stakeholders
- ✅ SLI/SLO tracking with error budgets
- ✅ Automated incident response workflows
- ✅ HIPAA-compliant audit logging
- ✅ Multi-region support
- ✅ Performance optimization recommendations

---

## Components

### Azure Monitor / Application Insights

**Purpose**: Cloud-native monitoring and APM solution

**Features**:
- Application performance monitoring
- Distributed tracing
- Smart detection and anomaly alerts
- Live metrics stream
- Application map

**Configuration**: `azure-application-insights.json`

### Prometheus + Grafana

**Purpose**: Metrics collection and visualization

**Features**:
- Time-series metrics storage
- Custom metric collection
- Flexible query language (PromQL)
- Community dashboards

**Configuration**: `../kubernetes/monitoring/prometheus-config.yaml`

### Centralized Logging

**Purpose**: Structured log aggregation and analysis

**Features**:
- JSON structured logging
- Log retention policies
- PII/PHI data masking
- Multi-destination routing

**Configuration**: `logging-configuration.yaml`

### Custom Dashboards

**Purpose**: Tailored visualizations for different teams

**Dashboards**:
1. **System Health**: Infrastructure and service health
2. **API Performance**: Backend performance metrics
3. **Business Metrics**: KPIs and business analytics

**Configuration**: `dashboard-*.json`

---

## Quick Start

### Prerequisites

- Azure subscription with appropriate permissions
- Azure CLI installed and authenticated
- kubectl configured for AKS cluster
- Terraform installed (optional, for IaC deployment)

### Setup Steps

#### 1. Deploy Azure Application Insights

```bash
# Create resource group (if not exists)
az group create \
  --name unified-health-monitoring-rg \
  --location eastus

# Deploy Application Insights using ARM template
az deployment group create \
  --resource-group unified-health-monitoring-rg \
  --template-file azure-application-insights.json \
  --parameters environment=production

# Retrieve instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --resource-group unified-health-monitoring-rg \
  --app unified-health-insights \
  --query instrumentationKey \
  --output tsv)

echo "Instrumentation Key: $INSTRUMENTATION_KEY"
```

#### 2. Configure Backend Monitoring

The API already has Prometheus metrics configured in `services/api/src/lib/metrics.ts`.

Update environment variables:

```bash
# Add to Kubernetes secrets
kubectl create secret generic monitoring-secrets \
  -n unified-health \
  --from-literal=APPINSIGHTS_INSTRUMENTATION_KEY=$INSTRUMENTATION_KEY \
  --from-literal=APPINSIGHTS_CONNECTION_STRING="$(az monitor app-insights component show \
    --resource-group unified-health-monitoring-rg \
    --app unified-health-insights \
    --query connectionString \
    --output tsv)"
```

#### 3. Configure Frontend Monitoring

Add environment variables to your frontend:

```bash
# .env.production
NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATION_KEY=<your-key>
NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING=<your-connection-string>
```

Integrate the monitoring code:

```typescript
// In your _app.tsx or main entry point
import { initializeAppInsights } from '@/infrastructure/monitoring/frontend-monitoring-config';

const { appInsights } = initializeAppInsights();

export { appInsights };
```

#### 4. Deploy Alert Rules

```bash
# Deploy alert rules to Azure Monitor
az monitor metrics alert create \
  --resource-group unified-health-monitoring-rg \
  --name high-api-error-rate \
  --scopes /subscriptions/<subscription-id>/resourceGroups/unified-health-rg/providers/Microsoft.Insights/components/unified-health-insights \
  --condition "avg requests/failed > 5" \
  --window-size 5m \
  --evaluation-frequency 5m \
  --severity 2 \
  --action unified-health-alerts
```

Or use the configuration file:

```bash
# This is a conceptual example - adapt based on your deployment method
kubectl apply -f alert-rules.yaml
```

#### 5. Import Dashboards

**Grafana**:
```bash
# Import dashboards via Grafana API
curl -X POST http://grafana.unifiedhealth.com/api/dashboards/db \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <api-key>" \
  -d @dashboard-system-health.json
```

**Azure Portal**:
1. Navigate to Azure Portal > Dashboards
2. Click "Upload"
3. Select dashboard JSON files
4. Click "Save"

---

## Configuration Files

### `azure-application-insights.json`

ARM template for deploying Azure Application Insights resources.

**Deploys**:
- Application Insights instance
- Log Analytics workspace
- Action groups for alerting
- Smart detection rules

**Parameters**:
- `applicationInsightsName`: Name of the Application Insights resource
- `location`: Azure region
- `workspaceName`: Log Analytics workspace name
- `retentionInDays`: Data retention period (default: 90 days)
- `environment`: Environment tag (development, staging, production)

### `logging-configuration.yaml`

Centralized logging configuration for all services.

**Features**:
- Standard JSON log format
- Field naming conventions
- Log aggregation to Azure Log Analytics
- Retention policies by log type
- PII/PHI data masking
- Log routing rules

**Key Sections**:
- `logFormat`: Standardized log structure
- `aggregation`: Log collection endpoints
- `retention`: Retention policies by type
- `dataMasking`: PII/PHI protection patterns

### `alert-rules.yaml`

Alert rule definitions for Azure Monitor.

**Categories**:
- Error rate alerts
- Latency threshold alerts
- Resource utilization alerts
- Business metrics alerts
- Availability alerts
- Security alerts

**Alert Levels**:
- Severity 1 (Critical): Immediate action required
- Severity 2 (High): Action required within 15 minutes
- Severity 3 (Medium): Action required within 1 hour

### `sli-slo-definitions.yaml`

Service Level Indicators and Objectives.

**Categories**:
- Availability SLOs (99.95% target)
- Latency SLOs (P95 < 500ms)
- Error rate SLOs (< 0.1%)
- Data quality SLOs
- Business metrics SLOs
- Security SLOs

**Includes**:
- Error budget calculations
- Burn rate alerts
- Reporting configuration
- Error budget policies

### Dashboard Configurations

#### `dashboard-system-health.json`

System-level infrastructure monitoring.

**Panels**:
- Service availability
- Request/error rates
- CPU/memory usage by pod
- Database connection pools
- Network traffic
- Pod status
- Recent critical errors

#### `dashboard-api-performance.json`

Backend API performance monitoring.

**Panels**:
- Request throughput
- Response time distribution (P50, P95, P99)
- Status code distribution
- Error rate by endpoint
- Database query performance
- Cache hit rates
- WebSocket connections

#### `dashboard-business-metrics.json`

Business KPIs and analytics.

**Panels**:
- Active users
- New registrations
- Appointment metrics
- Consultation metrics
- Payment success rates
- Revenue tracking
- User engagement scores

### `incident-response-runbook.md`

Comprehensive incident response procedures.

**Contents**:
- Incident severity definitions
- Response workflows
- Common incident scenarios with solutions
- Escalation procedures
- Communication templates
- Post-incident review process

### `frontend-monitoring-config.ts`

TypeScript configuration for frontend Application Insights.

**Features**:
- Automatic page tracking
- Custom event tracking
- Performance monitoring (Web Vitals)
- Error tracking
- User behavior analytics
- HIPAA-compliant event tracking

---

## Deployment

### Azure Deployment

#### Using Azure CLI

```bash
# 1. Deploy Application Insights
az deployment group create \
  --resource-group unified-health-monitoring-rg \
  --template-file azure-application-insights.json \
  --parameters environment=production

# 2. Create action groups for alerts
az monitor action-group create \
  --name unified-health-alerts \
  --resource-group unified-health-monitoring-rg \
  --short-name UHAlerts \
  --email-receiver name=SRE email=sre@unifiedhealth.com

# 3. Deploy alert rules
# See alert-rules.yaml for rule definitions
```

#### Using Terraform

```hcl
# infrastructure/terraform/monitoring.tf

resource "azurerm_application_insights" "unified_health" {
  name                = "unified-health-insights"
  location            = azurerm_resource_group.monitoring.location
  resource_group_name = azurerm_resource_group.monitoring.name
  application_type    = "web"
  retention_in_days   = 90

  tags = {
    environment = "production"
    application = "unified-healthcare"
  }
}

resource "azurerm_log_analytics_workspace" "unified_health" {
  name                = "unified-health-logs"
  location            = azurerm_resource_group.monitoring.location
  resource_group_name = azurerm_resource_group.monitoring.name
  sku                 = "PerGB2018"
  retention_in_days   = 90
}
```

### Kubernetes Deployment

```bash
# 1. Deploy Prometheus
kubectl apply -f ../kubernetes/monitoring/prometheus-deployment.yaml

# 2. Deploy Grafana
kubectl apply -f ../kubernetes/monitoring/grafana-deployment.yaml

# 3. Create monitoring secrets
kubectl create secret generic monitoring-secrets \
  -n unified-health \
  --from-literal=APPINSIGHTS_INSTRUMENTATION_KEY=$INSTRUMENTATION_KEY

# 4. Update API deployment with monitoring config
kubectl apply -f ../kubernetes/base/api-deployment.yaml
```

---

## Dashboards

### Accessing Dashboards

**Azure Portal**:
- URL: https://portal.azure.com
- Navigate to: Monitor > Dashboards
- Select: Unified Health dashboards

**Grafana**:
- URL: https://grafana.unifiedhealth.com
- Dashboards > Manage > Unified Health folder

### Dashboard URLs

| Dashboard | Azure Portal | Grafana |
|-----------|-------------|---------|
| System Health | [Portal Link] | http://grafana/d/system-health |
| API Performance | [Portal Link] | http://grafana/d/api-performance |
| Business Metrics | [Portal Link] | http://grafana/d/business-metrics |

### Customizing Dashboards

1. **Clone existing dashboard**
2. **Modify panels** using PromQL or KQL queries
3. **Save** with new name
4. **Export** JSON for version control

Example PromQL query:
```promql
# Request rate by endpoint
sum(rate(http_requests_total[5m])) by (route)

# P95 latency
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

Example KQL query:
```kusto
ApplicationLogs_CL
| where Level == "ERROR"
| summarize count() by bin(TimeGenerated, 5m), Service
| render timechart
```

---

## Alerting

### Alert Channels

**Configured Channels**:
- Email: sre@unifiedhealth.com
- SMS: +1-555-0100
- PagerDuty: Integration key configured
- Slack: #incidents channel
- Teams: Alerts channel

### Alert Workflow

```
Alert Triggered
    ↓
Azure Monitor evaluates rule
    ↓
Action Group notified
    ↓
Multiple channels activated:
    - Email to SRE team
    - SMS to on-call
    - PagerDuty incident
    - Slack notification
    ↓
On-call engineer responds
    ↓
Incident workflow begins
```

### Testing Alerts

```bash
# Test alert by triggering high error rate
for i in {1..100}; do
  curl -X GET https://api.unifiedhealth.com/api/v1/test/error
done

# Verify alert triggered
az monitor metrics alert list \
  --resource-group unified-health-monitoring-rg \
  --query "[?state=='Fired']"
```

### Alert Maintenance

**Weekly**:
- Review triggered alerts
- Adjust thresholds if too noisy
- Update on-call schedule

**Monthly**:
- Review alert effectiveness
- Add new alerts for new features
- Remove obsolete alerts

---

## SLIs/SLOs

### Current SLO Targets

| Service | SLI | Target | Error Budget |
|---------|-----|--------|--------------|
| API | Availability | 99.95% | 21.6 min/month |
| API | Latency (P95) | < 500ms | 5% slow requests |
| API | Error Rate | < 0.1% | 0.1% |
| Frontend | Availability | 99.9% | 43.2 min/month |
| Frontend | Page Load (P75) | < 2s | 25% slow loads |
| Database | Query Latency (P95) | < 100ms | 5% slow queries |

### Monitoring SLOs

**Dashboard**: https://grafana.unifiedhealth.com/d/slo-tracking

**Error Budget Dashboard**:
```
Current Period: [Date Range]
Budget Remaining: [Percentage]
Time Remaining: [Days]
Status: [Healthy | Warning | Critical | Emergency]
```

### Error Budget Policy

| Budget Remaining | Status | Actions |
|------------------|--------|---------|
| 100-75% | Healthy | Normal operations |
| 75-50% | Warning | Review recent changes |
| 50-25% | Critical | Freeze non-critical deploys |
| 25-0% | Emergency | All hands on reliability |

---

## Incident Response

### On-Call Schedule

**Tool**: PagerDuty
**Schedule**: 24/7 rotation
**Escalation**: 15 minutes

**Current On-Call**: Check PagerDuty or run:
```bash
curl -H "Authorization: Token token=YOUR_API_KEY" \
  https://api.pagerduty.com/oncalls
```

### Incident Workflow

1. **Alert Received** → Acknowledge in PagerDuty
2. **Initial Assessment** → Determine severity
3. **Create Incident** → Open ticket, create Slack channel
4. **Investigate** → Follow runbook procedures
5. **Mitigate** → Implement fixes
6. **Monitor** → Verify resolution
7. **Close** → Update status page
8. **Review** → Post-incident meeting

### Runbook

See: [incident-response-runbook.md](./incident-response-runbook.md)

**Quick Links**:
- [High API Error Rate](#scenario-1-high-api-error-rate)
- [High API Latency](#scenario-2-high-api-latency)
- [Database Issues](#scenario-3-database-connection-issues)
- [Service Outage](#scenario-4-service-outage-pod-crashes)

---

## Maintenance

### Daily Tasks

- [ ] Review overnight alerts
- [ ] Check error budget status
- [ ] Verify backup jobs completed
- [ ] Check dashboard for anomalies

### Weekly Tasks

- [ ] Review alert noise and adjust thresholds
- [ ] Update on-call schedule
- [ ] Review incident trends
- [ ] Check monitoring coverage for new features

### Monthly Tasks

- [ ] Generate SLO report
- [ ] Review and update runbooks
- [ ] Audit log retention compliance
- [ ] Update monitoring documentation
- [ ] Review and optimize costs

### Quarterly Tasks

- [ ] SLO target review and adjustment
- [ ] Monitoring infrastructure upgrade
- [ ] Disaster recovery drill
- [ ] Security monitoring audit

---

## Troubleshooting

### Common Issues

#### Application Insights Not Receiving Data

**Check**:
```bash
# Verify instrumentation key
echo $APPINSIGHTS_INSTRUMENTATION_KEY

# Check API logs for telemetry errors
kubectl logs deployment/unified-health-api -n unified-health | grep -i "appinsights"

# Test connection
curl -X POST https://dc.services.visualstudio.com/v2/track \
  -H "Content-Type: application/json" \
  -d '{"name":"test","time":"2025-12-17T10:00:00Z","iKey":"YOUR_KEY"}'
```

#### Prometheus Not Scraping Metrics

**Check**:
```bash
# Verify metrics endpoint
curl http://api-service.unified-health.svc.cluster.local:3000/metrics

# Check Prometheus targets
kubectl port-forward -n unified-health svc/prometheus 9090:9090
# Visit: http://localhost:9090/targets

# Check pod annotations
kubectl get pods -n unified-health -o yaml | grep prometheus.io
```

#### Alerts Not Firing

**Check**:
```bash
# Verify alert rule exists
az monitor metrics alert list \
  --resource-group unified-health-monitoring-rg

# Check alert state
az monitor metrics alert show \
  --name high-api-error-rate \
  --resource-group unified-health-monitoring-rg

# Verify action group
az monitor action-group list \
  --resource-group unified-health-monitoring-rg
```

---

## Support

### Contacts

- **SRE Team**: sre@unifiedhealth.com
- **On-Call**: oncall@unifiedhealth.com (PagerDuty)
- **Security**: security@unifiedhealth.com

### Resources

- **Runbook**: [incident-response-runbook.md](./incident-response-runbook.md)
- **Architecture Docs**: https://wiki.unifiedhealth.com/architecture
- **Azure Monitor Docs**: https://docs.microsoft.com/azure/azure-monitor
- **Prometheus Docs**: https://prometheus.io/docs

---

**Last Updated**: 2025-12-17
**Version**: 1.0
**Owner**: SRE Team
