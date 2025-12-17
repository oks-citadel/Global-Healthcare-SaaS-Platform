# Monitoring Infrastructure

This directory contains Kubernetes manifests for deploying the monitoring stack for the Unified Healthcare Platform.

## Components

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **AlertManager**: Alert routing and management
- **Jaeger**: Distributed tracing (optional, separate deployment)

## Directory Structure

```
monitoring/
├── prometheus-config.yaml           # Prometheus ConfigMap with scrape configs
├── prometheus-deployment.yaml       # Prometheus deployment, service, and ingress
├── grafana-deployment.yaml          # Grafana deployment, service, and ingress
├── grafana-dashboards-configmap.yaml # ConfigMap for dashboard files
├── alerting/
│   ├── alertmanager-config.yaml    # AlertManager configuration and deployment
│   └── alert-rules.yaml            # Prometheus alert rules
└── dashboards/
    ├── api-overview.json           # API metrics dashboard
    ├── database-metrics.json       # Database metrics dashboard
    └── kubernetes-overview.json    # Kubernetes cluster dashboard
```

## Prerequisites

1. Kubernetes cluster (v1.24+)
2. kubectl configured
3. cert-manager for TLS certificates
4. nginx-ingress-controller

## Quick Start

### 1. Create Namespace

```bash
kubectl create namespace unified-health
```

### 2. Create Secrets

```bash
# Grafana admin credentials
kubectl create secret generic grafana-admin \
  --from-literal=admin-user=admin \
  --from-literal=admin-password=$(openssl rand -base64 32) \
  -n unified-health

# Save the password for later use
kubectl get secret grafana-admin -n unified-health -o jsonpath="{.data.admin-password}" | base64 --decode

# Basic auth for Prometheus
kubectl create secret generic prometheus-basic-auth \
  --from-literal=auth=$(htpasswd -nb admin $(openssl rand -base64 32)) \
  -n unified-health

# Basic auth for AlertManager
kubectl create secret generic alertmanager-basic-auth \
  --from-literal=auth=$(htpasswd -nb admin $(openssl rand -base64 32)) \
  -n unified-health
```

### 3. Configure Alert Notifications

Create a secret with Slack webhook URL and PagerDuty key:

```bash
kubectl create secret generic alertmanager-secrets \
  --from-literal=slack-webhook-url='https://hooks.slack.com/services/YOUR/WEBHOOK/URL' \
  --from-literal=pagerduty-service-key='YOUR_PAGERDUTY_SERVICE_KEY' \
  -n unified-health
```

Update `alertmanager-config.yaml` to reference these secrets.

### 4. Deploy Monitoring Stack

```bash
# Deploy Prometheus
kubectl apply -f prometheus-config.yaml
kubectl apply -f alerting/alert-rules.yaml
kubectl apply -f prometheus-deployment.yaml

# Deploy AlertManager
kubectl apply -f alerting/alertmanager-config.yaml

# Deploy Grafana
kubectl apply -f grafana-deployment.yaml
kubectl apply -f grafana-dashboards-configmap.yaml
```

### 5. Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n unified-health -l component=monitoring

# Check services
kubectl get svc -n unified-health -l component=monitoring

# Check ingress
kubectl get ingress -n unified-health -l component=monitoring
```

## Accessing the Tools

### Prometheus
- URL: https://prometheus.unified-health.io
- Authentication: Basic Auth (username: admin)

### Grafana
- URL: https://grafana.unified-health.io
- Default credentials: admin / (see secret above)
- Change password on first login

### AlertManager
- URL: https://alertmanager.unified-health.io
- Authentication: Basic Auth (username: admin)

## Configuration

### Prometheus Scrape Configs

Prometheus is configured to scrape:
- API services (via Kubernetes service discovery)
- PostgreSQL (via postgres-exporter)
- Redis (via redis-exporter)
- Kubernetes nodes and pods
- cadvisor metrics

To add a new scrape target, edit `prometheus-config.yaml` and add a new job:

```yaml
- job_name: 'my-service'
  kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
          - unified-health
  relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: my-service
```

### Adding Dashboards

1. Create a new dashboard JSON file in `dashboards/`
2. Update `grafana-dashboards-configmap.yaml` to include the new file
3. Apply the ConfigMap: `kubectl apply -f grafana-dashboards-configmap.yaml`
4. Restart Grafana: `kubectl rollout restart deployment/grafana -n unified-health`

### Adding Alert Rules

1. Edit `alerting/alert-rules.yaml`
2. Add your alert rule to the appropriate group
3. Apply the changes: `kubectl apply -f alerting/alert-rules.yaml`
4. Reload Prometheus config: `kubectl exec -it -n unified-health prometheus-xxx -- kill -HUP 1`

## Storage

### Prometheus Storage

- Storage class: `fast-ssd`
- Size: 50Gi
- Retention: 30 days or 45GB (whichever comes first)

To change retention:

```yaml
args:
  - '--storage.tsdb.retention.time=60d'
  - '--storage.tsdb.retention.size=90GB'
```

### Grafana Storage

- Storage class: `fast-ssd`
- Size: 10Gi
- Contains: Dashboards, data sources, settings

## Backup and Recovery

### Backup Prometheus Data

```bash
# Create a backup job
kubectl create job prometheus-backup-$(date +%Y%m%d) \
  --from=cronjob/prometheus-backup \
  -n unified-health
```

### Backup Grafana Dashboards

```bash
# Export all dashboards
kubectl exec -it -n unified-health grafana-xxx -- \
  grafana-cli admin export-dashboard \
  --output=/tmp/dashboards-backup.json
```

### Restore Grafana

1. Create a new Grafana instance
2. Import dashboards from backup
3. Update ConfigMaps and redeploy

## Troubleshooting

### Prometheus Not Scraping Targets

1. Check target status: https://prometheus.unified-health.io/targets
2. Verify service discovery: Check Prometheus logs
3. Ensure pods have correct labels
4. Verify network policies allow scraping

```bash
kubectl logs -n unified-health prometheus-xxx
```

### Grafana Dashboards Not Loading

1. Check ConfigMap is mounted: `kubectl describe pod -n unified-health grafana-xxx`
2. Verify dashboard files are present: `kubectl exec -it -n unified-health grafana-xxx -- ls /var/lib/grafana/dashboards`
3. Check Grafana logs: `kubectl logs -n unified-health grafana-xxx`

### Alerts Not Firing

1. Check alert rules are loaded: https://prometheus.unified-health.io/rules
2. Verify AlertManager configuration
3. Check AlertManager logs: `kubectl logs -n unified-health alertmanager-xxx`
4. Test alert routing: https://alertmanager.unified-health.io/#/status

### High Memory Usage

Prometheus can use significant memory with many metrics:

1. Reduce scrape interval
2. Increase memory limits
3. Reduce retention period
4. Use recording rules for expensive queries

```bash
# Scale up Prometheus
kubectl patch deployment prometheus -n unified-health \
  -p '{"spec":{"template":{"spec":{"containers":[{"name":"prometheus","resources":{"limits":{"memory":"8Gi"}}}]}}}}'
```

## Maintenance

### Update Prometheus

```bash
# Update image version in prometheus-deployment.yaml
kubectl set image deployment/prometheus \
  prometheus=prom/prometheus:v2.50.0 \
  -n unified-health

# Monitor rollout
kubectl rollout status deployment/prometheus -n unified-health
```

### Update Grafana

```bash
# Update image version in grafana-deployment.yaml
kubectl set image deployment/grafana \
  grafana=grafana/grafana:10.3.0 \
  -n unified-health

# Monitor rollout
kubectl rollout status deployment/grafana -n unified-health
```

### Clean Up Old Data

```bash
# Prometheus automatically removes old data based on retention settings
# To force cleanup, restart Prometheus
kubectl rollout restart deployment/prometheus -n unified-health
```

## Security

### Network Policies

Consider adding network policies to restrict access:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: prometheus-network-policy
  namespace: unified-health
spec:
  podSelector:
    matchLabels:
      app: prometheus
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: grafana
      ports:
        - protocol: TCP
          port: 9090
```

### TLS Configuration

All external endpoints use TLS via cert-manager:

```yaml
annotations:
  cert-manager.io/cluster-issuer: letsencrypt-prod
```

### RBAC

Prometheus ServiceAccount has ClusterRole for Kubernetes API access:
- Read nodes, pods, services, endpoints
- Access metrics endpoints

## Performance Tuning

### Prometheus

```yaml
# Adjust based on your metrics volume
resources:
  requests:
    cpu: 1000m
    memory: 2Gi
  limits:
    cpu: 4000m
    memory: 8Gi

# Query timeout
args:
  - '--query.timeout=2m'
  - '--query.max-concurrency=20'
```

### Grafana

```yaml
# For high dashboard usage
resources:
  requests:
    cpu: 500m
    memory: 512Mi
  limits:
    cpu: 2000m
    memory: 2Gi

# Configure caching
env:
  - name: GF_SERVER_ENABLE_GZIP
    value: "true"
  - name: GF_DATABASE_CACHE_MODE
    value: "shared"
```

## Monitoring the Monitors

Prometheus and Grafana expose their own metrics:

- Prometheus: http://prometheus:9090/metrics
- Grafana: http://grafana:3000/metrics

Create alerts for monitoring infrastructure health:

```yaml
- alert: PrometheusDown
  expr: up{job="prometheus"} == 0
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Prometheus is down"
```

## Support

For issues or questions:
- Documentation: https://docs.unified-health.io/monitoring
- Slack: #platform-monitoring
- Email: platform-team@unified-health.io
