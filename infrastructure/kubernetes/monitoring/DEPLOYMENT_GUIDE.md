# Monitoring Stack Deployment Guide

Complete step-by-step guide to deploy the monitoring infrastructure for Unified Healthcare Platform.

## Prerequisites Checklist

- [ ] Kubernetes cluster (v1.24+) running
- [ ] kubectl installed and configured
- [ ] cert-manager installed in cluster
- [ ] nginx-ingress-controller installed
- [ ] htpasswd utility installed (for basic auth)
- [ ] DNS records configured for monitoring domains
- [ ] Slack workspace with webhook URL (optional)
- [ ] PagerDuty account with service key (optional)

## Step 1: Prepare Environment

### 1.1 Create Namespace

```bash
kubectl create namespace unified-health

# Verify namespace
kubectl get namespace unified-health
```

### 1.2 Label Namespace

```bash
kubectl label namespace unified-health \
  monitoring=enabled \
  environment=production
```

### 1.3 Set Context

```bash
kubectl config set-context --current --namespace=unified-health
```

## Step 2: Create Secrets

### 2.1 Grafana Admin Credentials

```bash
# Generate strong password
GRAFANA_PASSWORD=$(openssl rand -base64 32)

# Create secret
kubectl create secret generic grafana-admin \
  --from-literal=admin-user=admin \
  --from-literal=admin-password="$GRAFANA_PASSWORD" \
  -n unified-health

# Save password securely
echo "Grafana Admin Password: $GRAFANA_PASSWORD" > grafana-credentials.txt
chmod 600 grafana-credentials.txt

# Display password (save this!)
echo "Grafana Password: $GRAFANA_PASSWORD"
```

### 2.2 Prometheus Basic Auth

```bash
# Generate password
PROM_PASSWORD=$(openssl rand -base64 32)

# Create auth string
PROM_AUTH=$(htpasswd -nb admin "$PROM_PASSWORD")

# Create secret
kubectl create secret generic prometheus-basic-auth \
  --from-literal=auth="$PROM_AUTH" \
  -n unified-health

# Save password
echo "Prometheus Admin Password: $PROM_PASSWORD" >> prometheus-credentials.txt
chmod 600 prometheus-credentials.txt
```

### 2.3 AlertManager Basic Auth

```bash
# Generate password
ALERT_PASSWORD=$(openssl rand -base64 32)

# Create auth string
ALERT_AUTH=$(htpasswd -nb admin "$ALERT_PASSWORD")

# Create secret
kubectl create secret generic alertmanager-basic-auth \
  --from-literal=auth="$ALERT_AUTH" \
  -n unified-health

# Save password
echo "AlertManager Admin Password: $ALERT_PASSWORD" >> alertmanager-credentials.txt
chmod 600 alertmanager-credentials.txt
```

### 2.4 AlertManager Notification Secrets (Optional)

```bash
# Replace with your actual values
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
PAGERDUTY_SERVICE_KEY="your-pagerduty-service-key"

kubectl create secret generic alertmanager-secrets \
  --from-literal=slack-webhook-url="$SLACK_WEBHOOK_URL" \
  --from-literal=pagerduty-service-key="$PAGERDUTY_SERVICE_KEY" \
  -n unified-health
```

### 2.5 Verify Secrets

```bash
kubectl get secrets -n unified-health
```

Expected output:
```
NAME                          TYPE      DATA   AGE
grafana-admin                 Opaque    2      1m
prometheus-basic-auth         Opaque    1      1m
alertmanager-basic-auth       Opaque    1      1m
alertmanager-secrets          Opaque    2      1m
```

## Step 3: Deploy Storage

### 3.1 Create StorageClass (if not exists)

```bash
cat <<EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs  # Change based on your cloud provider
parameters:
  type: gp3
  fsType: ext4
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
EOF
```

### 3.2 Verify StorageClass

```bash
kubectl get storageclass fast-ssd
```

## Step 4: Deploy Prometheus

### 4.1 Apply Prometheus Configuration

```bash
# Apply ConfigMap
kubectl apply -f prometheus-config.yaml

# Verify ConfigMap
kubectl get configmap prometheus-config -n unified-health -o yaml
```

### 4.2 Apply Alert Rules

```bash
# Apply alert rules ConfigMap
kubectl apply -f alerting/alert-rules.yaml

# Verify alert rules
kubectl get configmap prometheus-rules -n unified-health
```

### 4.3 Deploy Prometheus

```bash
# Deploy Prometheus
kubectl apply -f prometheus-deployment.yaml

# Wait for deployment
kubectl rollout status deployment/prometheus -n unified-health

# Check pods
kubectl get pods -l app=prometheus -n unified-health

# Check logs
kubectl logs -l app=prometheus -n unified-health --tail=50
```

### 4.4 Verify Prometheus Service

```bash
# Check service
kubectl get service prometheus -n unified-health

# Port forward to test locally
kubectl port-forward svc/prometheus 9090:9090 -n unified-health

# Visit http://localhost:9090 in browser
```

## Step 5: Deploy AlertManager

### 5.1 Update AlertManager Configuration

Before deploying, update `alerting/alertmanager-config.yaml` to use the secrets:

```yaml
slack_api_url: # This will be injected from secret
pagerduty_url: 'https://events.pagerduty.com/v2/enqueue'
```

### 5.2 Deploy AlertManager

```bash
# Apply AlertManager
kubectl apply -f alerting/alertmanager-config.yaml

# Wait for deployment
kubectl rollout status deployment/alertmanager -n unified-health

# Check pods
kubectl get pods -l app=alertmanager -n unified-health

# Check logs
kubectl logs -l app=alertmanager -n unified-health --tail=50
```

### 5.3 Verify AlertManager

```bash
# Port forward
kubectl port-forward svc/alertmanager 9093:9093 -n unified-health

# Visit http://localhost:9093 in browser
```

## Step 6: Deploy Grafana

### 6.1 Apply Dashboard ConfigMaps

```bash
# Apply dashboard ConfigMap
kubectl apply -f grafana-dashboards-configmap.yaml

# Verify ConfigMap
kubectl get configmap grafana-dashboards -n unified-health
```

### 6.2 Deploy Grafana

```bash
# Deploy Grafana
kubectl apply -f grafana-deployment.yaml

# Wait for deployment
kubectl rollout status deployment/grafana -n unified-health

# Check pods
kubectl get pods -l app=grafana -n unified-health

# Check logs
kubectl logs -l app=grafana -n unified-health --tail=50
```

### 6.3 Verify Grafana

```bash
# Port forward
kubectl port-forward svc/grafana 3000:3000 -n unified-health

# Visit http://localhost:3000 in browser
# Login with: admin / (password from Step 2.1)
```

## Step 7: Configure DNS and Ingress

### 7.1 Update DNS Records

Add the following DNS records pointing to your ingress controller's IP:

```
prometheus.unified-health.io  -> INGRESS_IP
grafana.unified-health.io     -> INGRESS_IP
alertmanager.unified-health.io -> INGRESS_IP
```

### 7.2 Verify Ingress

```bash
# Check ingress resources
kubectl get ingress -n unified-health

# Describe ingress
kubectl describe ingress prometheus -n unified-health
kubectl describe ingress grafana -n unified-health
kubectl describe ingress alertmanager -n unified-health
```

### 7.3 Wait for Certificates

```bash
# Check certificate status
kubectl get certificate -n unified-health

# Wait for certificates to be ready (may take 1-2 minutes)
kubectl wait --for=condition=Ready certificate/prometheus-tls -n unified-health --timeout=5m
kubectl wait --for=condition=Ready certificate/grafana-tls -n unified-health --timeout=5m
kubectl wait --for=condition=Ready certificate/alertmanager-tls -n unified-health --timeout=5m
```

## Step 8: Verify Complete Stack

### 8.1 Check All Pods

```bash
kubectl get pods -n unified-health -l component=monitoring

# Expected output (all Running):
# NAME                            READY   STATUS    RESTARTS   AGE
# prometheus-xxx                  1/1     Running   0          5m
# grafana-xxx                     1/1     Running   0          5m
# alertmanager-xxx                1/1     Running   0          5m
```

### 8.2 Check All Services

```bash
kubectl get services -n unified-health -l component=monitoring

# Expected output:
# NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
# prometheus     ClusterIP   10.x.x.x        <none>        9090/TCP   5m
# grafana        ClusterIP   10.x.x.x        <none>        3000/TCP   5m
# alertmanager   ClusterIP   10.x.x.x        <none>        9093/TCP   5m
```

### 8.3 Test External Access

```bash
# Test Prometheus
curl -k https://prometheus.unified-health.io/-/healthy

# Test Grafana
curl -k https://grafana.unified-health.io/api/health

# Test AlertManager
curl -k https://alertmanager.unified-health.io/-/healthy
```

## Step 9: Configure API Service for Metrics

### 9.1 Update API Deployment

Add annotations to your API deployment to enable Prometheus scraping:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: unified-health-api
  namespace: unified-health
spec:
  template:
    metadata:
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
```

### 9.2 Apply API Changes

```bash
kubectl apply -f ../../base/api-deployment.yaml

# Wait for rollout
kubectl rollout status deployment/unified-health-api -n unified-health
```

### 9.3 Verify API Metrics

```bash
# Port forward to API
kubectl port-forward svc/unified-health-api 3000:3000 -n unified-health

# Test metrics endpoint
curl http://localhost:3000/metrics
```

## Step 10: Import Grafana Dashboards

### 10.1 Access Grafana

1. Navigate to https://grafana.unified-health.io
2. Login with admin credentials from Step 2.1
3. Change password on first login

### 10.2 Verify Dashboards

1. Go to "Dashboards" → "Browse"
2. You should see:
   - Unified Health - API Overview
   - Unified Health - Database Metrics
   - Unified Health - Kubernetes Overview

### 10.3 Test Dashboards

1. Open "API Overview" dashboard
2. Verify metrics are displayed
3. Adjust time range to see historical data

## Step 11: Test Alerting

### 11.1 Verify Alert Rules

1. Navigate to https://prometheus.unified-health.io/rules
2. Verify all alert rules are loaded
3. Check rule status

### 11.2 Test Alert Firing

Trigger a test alert:

```bash
# Scale down API to 0 to trigger APIServiceDown alert
kubectl scale deployment unified-health-api --replicas=0 -n unified-health

# Wait 2 minutes for alert to fire
# Check AlertManager: https://alertmanager.unified-health.io

# Scale back up
kubectl scale deployment unified-health-api --replicas=3 -n unified-health
```

### 11.3 Verify Notifications

Check your configured notification channels (Slack, PagerDuty) for alerts.

## Step 12: Configure Tracing (Optional)

### 12.1 Deploy Jaeger

```bash
# Deploy Jaeger all-in-one
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
  namespace: unified-health
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:1.51
        ports:
        - containerPort: 6831
          protocol: UDP
        - containerPort: 6832
          protocol: UDP
        - containerPort: 16686
        - containerPort: 14268
        env:
        - name: COLLECTOR_ZIPKIN_HOST_PORT
          value: ":9411"
---
apiVersion: v1
kind: Service
metadata:
  name: jaeger
  namespace: unified-health
spec:
  ports:
  - name: jaeger-agent-compact
    port: 6831
    protocol: UDP
  - name: jaeger-agent-binary
    port: 6832
    protocol: UDP
  - name: jaeger-query
    port: 16686
  - name: jaeger-collector
    port: 14268
  selector:
    app: jaeger
EOF
```

### 12.2 Update API Configuration

Set environment variable in API deployment:

```yaml
env:
  - name: JAEGER_ENDPOINT
    value: "http://jaeger:14268/api/traces"
```

## Step 13: Security Hardening

### 13.1 Enable Network Policies

```bash
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: monitoring-network-policy
  namespace: unified-health
spec:
  podSelector:
    matchLabels:
      component: monitoring
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: unified-health
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
  egress:
  - to:
    - namespaceSelector: {}
EOF
```

### 13.2 Regular Secret Rotation

Set up a cron job to rotate secrets quarterly.

## Step 14: Backup Configuration

### 14.1 Backup Secrets

```bash
# Export secrets (encrypted)
kubectl get secrets -n unified-health -o yaml > monitoring-secrets-backup.yaml

# Encrypt and store securely
gpg -c monitoring-secrets-backup.yaml
rm monitoring-secrets-backup.yaml
```

### 14.2 Backup Grafana Dashboards

Dashboards are version-controlled in Git, but also export:

```bash
# Port forward to Grafana
kubectl port-forward svc/grafana 3000:3000 -n unified-health &

# Use Grafana API to export dashboards (replace with your API key)
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3000/api/search?type=dash-db | \
  jq -r '.[].uid' | \
  xargs -I {} curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3000/api/dashboards/uid/{} > dashboard-backup.json
```

## Step 15: Post-Deployment Validation

### 15.1 Run Validation Script

```bash
#!/bin/bash
# validation.sh

echo "=== Monitoring Stack Validation ==="

# Check pods
echo "Checking pods..."
kubectl get pods -n unified-health -l component=monitoring | grep Running || echo "ERROR: Pods not running"

# Check Prometheus targets
echo "Checking Prometheus targets..."
curl -k https://prometheus.unified-health.io/api/v1/targets | jq '.data.activeTargets[] | select(.health!="up")' && echo "ERROR: Some targets are down"

# Check Grafana health
echo "Checking Grafana..."
curl -k https://grafana.unified-health.io/api/health | grep ok || echo "ERROR: Grafana unhealthy"

# Check AlertManager
echo "Checking AlertManager..."
curl -k https://alertmanager.unified-health.io/-/healthy || echo "ERROR: AlertManager unhealthy"

echo "=== Validation Complete ==="
```

### 15.2 Document Access

Create a document with:
- URLs for all monitoring tools
- Credentials (stored securely)
- Runbook links
- On-call escalation procedures

## Troubleshooting

### Issue: Pods Not Starting

```bash
# Check events
kubectl get events -n unified-health --sort-by='.lastTimestamp'

# Check pod details
kubectl describe pod <pod-name> -n unified-health

# Check logs
kubectl logs <pod-name> -n unified-health
```

### Issue: Metrics Not Appearing

```bash
# Check Prometheus targets
kubectl port-forward svc/prometheus 9090:9090 -n unified-health
# Visit http://localhost:9090/targets

# Check API metrics endpoint
kubectl port-forward svc/unified-health-api 3000:3000 -n unified-health
curl http://localhost:3000/metrics
```

### Issue: Certificates Not Ready

```bash
# Check cert-manager logs
kubectl logs -n cert-manager deploy/cert-manager

# Check certificate status
kubectl describe certificate <cert-name> -n unified-health

# Check certificate request
kubectl get certificaterequest -n unified-health
```

### Issue: Alerts Not Firing

```bash
# Check Prometheus rules
kubectl port-forward svc/prometheus 9090:9090 -n unified-health
# Visit http://localhost:9090/rules

# Check AlertManager config
kubectl logs -n unified-health deploy/alertmanager

# Test alert routing
curl -k https://alertmanager.unified-health.io/api/v1/status
```

## Rollback Procedure

If deployment fails:

```bash
# Delete monitoring resources
kubectl delete -f prometheus-deployment.yaml
kubectl delete -f grafana-deployment.yaml
kubectl delete -f alerting/alertmanager-config.yaml

# Delete ConfigMaps
kubectl delete configmap prometheus-config -n unified-health
kubectl delete configmap prometheus-rules -n unified-health
kubectl delete configmap grafana-dashboards -n unified-health

# Keep secrets for retry
# Retry deployment after fixing issues
```

## Next Steps

1. [ ] Configure additional data sources in Grafana
2. [ ] Create custom dashboards for business metrics
3. [ ] Set up log aggregation with Loki
4. [ ] Configure long-term storage (Thanos or Cortex)
5. [ ] Set up automated backups
6. [ ] Train team on using monitoring tools
7. [ ] Document incident response procedures
8. [ ] Schedule regular monitoring reviews

## Support

For deployment issues:
- Documentation: https://docs.unified-health.io/operations/monitoring
- Slack: #platform-infrastructure
- Email: platform-team@unified-health.io
