# Quick Start Guide - Kubernetes Deployment

This guide provides quick commands to deploy the Unified Healthcare Platform to Kubernetes.

## Prerequisites Checklist

- [ ] kubectl installed and configured
- [ ] kustomize installed (v5.0+)
- [ ] Azure CLI installed and logged in
- [ ] AKS cluster created
- [ ] ACR created and attached to AKS
- [ ] Azure Key Vault created with secrets
- [ ] NGINX Ingress Controller installed
- [ ] cert-manager installed
- [ ] Azure Workload Identity configured

## Quick Deploy Commands

### 1. Set Environment Variables

```bash
export ACR_LOGIN_SERVER="acrunifiedhealthdev2.azurecr.io"
export AZURE_CLIENT_ID="<your-client-id>"
export AZURE_TENANT_ID="<your-tenant-id>"
export AZURE_SUBSCRIPTION_ID="<your-subscription-id>"
export AZURE_RESOURCE_GROUP="rg-unified-health-dev2"
```

### 2. Connect to AKS

```bash
az aks get-credentials \
  --resource-group rg-unified-health-dev2 \
  --name unified-health-aks
```

### 3. Deploy to Staging

```bash
cd infrastructure/kubernetes
kubectl apply -k overlays/staging
```

### 4. Deploy to Production

```bash
cd infrastructure/kubernetes
kubectl apply -k overlays/production
```

### 5. Verify Deployment

```bash
# Check pods
kubectl get pods -n unified-health-staging
kubectl get pods -n unified-health-production

# Check services
kubectl get svc -n unified-health-staging
kubectl get svc -n unified-health-production

# Check ingress
kubectl get ingress -n unified-health-staging
kubectl get ingress -n unified-health-production
```

## Common Commands

### View Logs

```bash
# Staging
kubectl logs -n unified-health-staging -l app=unified-health-api --tail=100 -f

# Production
kubectl logs -n unified-health-production -l app=unified-health-api --tail=100 -f
```

### Scale Deployment

```bash
# Staging
kubectl scale deployment/unified-health-api --replicas=3 -n unified-health-staging

# Production
kubectl scale deployment/unified-health-api --replicas=5 -n unified-health-production
```

### Restart Deployment

```bash
# Staging
kubectl rollout restart deployment/unified-health-api -n unified-health-staging

# Production
kubectl rollout restart deployment/unified-health-api -n unified-health-production
```

### View Pod Details

```bash
# Staging
kubectl describe pod <pod-name> -n unified-health-staging

# Production
kubectl describe pod <pod-name> -n unified-health-production
```

### Execute Into Pod

```bash
# Staging
kubectl exec -it <pod-name> -n unified-health-staging -- /bin/sh

# Production
kubectl exec -it <pod-name> -n unified-health-production -- /bin/sh
```

### Port Forward for Local Testing

```bash
# Staging
kubectl port-forward -n unified-health-staging svc/unified-health-api 8080:80

# Production
kubectl port-forward -n unified-health-production svc/unified-health-api 8080:80
```

### Update Configuration

```bash
# Edit ConfigMap
kubectl edit configmap unified-health-config -n unified-health-production

# Restart pods to pick up changes
kubectl rollout restart deployment/unified-health-api -n unified-health-production
```

### View Events

```bash
# Staging
kubectl get events -n unified-health-staging --sort-by='.lastTimestamp'

# Production
kubectl get events -n unified-health-production --sort-by='.lastTimestamp'
```

### Rollback Deployment

```bash
# Staging
kubectl rollout undo deployment/unified-health-api -n unified-health-staging

# Production
kubectl rollout undo deployment/unified-health-api -n unified-health-production

# Rollback to specific revision
kubectl rollout undo deployment/unified-health-api --to-revision=2 -n unified-health-production
```

## Troubleshooting Quick Fixes

### Pods Not Starting

```bash
# Get pod status
kubectl get pods -n unified-health-production

# Describe pod to see events
kubectl describe pod <pod-name> -n unified-health-production

# Check logs
kubectl logs <pod-name> -n unified-health-production
```

### Image Pull Errors

```bash
# Verify ACR attachment
az aks update \
  --resource-group rg-unified-health-dev2 \
  --name unified-health-aks \
  --attach-acr acrunifiedhealthdev2
```

### Certificate Issues

```bash
# Check certificate status
kubectl get certificate -n unified-health-production
kubectl describe certificate unified-health-tls-cert -n unified-health-production

# Delete and recreate certificate
kubectl delete certificate unified-health-tls-cert -n unified-health-production
kubectl apply -f base/ingress.yaml
```

### Network Issues

```bash
# Test DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup google.com

# Test database connectivity
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- psql "$DATABASE_URL"
```

## Monitoring Commands

### Check HPA Status

```bash
kubectl get hpa -n unified-health-production
kubectl describe hpa unified-health-api-hpa -n unified-health-production
```

### Check PDB Status

```bash
kubectl get pdb -n unified-health-production
kubectl describe pdb unified-health-api-pdb -n unified-health-production
```

### Check Resource Usage

```bash
kubectl top nodes
kubectl top pods -n unified-health-production
```

### View Metrics

```bash
# Port forward to metrics endpoint
kubectl port-forward -n unified-health-production svc/unified-health-api 9090:9090

# Access metrics at http://localhost:9090/metrics
```

## Cleanup Commands

### Delete Staging Environment

```bash
kubectl delete namespace unified-health-staging
```

### Delete Production Environment

```bash
# WARNING: This will delete all production resources!
kubectl delete namespace unified-health-production
```

## Security Best Practices

1. Never commit secrets to Git
2. Use Azure Key Vault for secret management
3. Rotate secrets regularly
4. Enable Pod Security Policies
5. Use Network Policies to restrict traffic
6. Keep images updated with security patches
7. Use RBAC for access control
8. Enable audit logging

## Performance Tuning

### Adjust Resource Limits

Edit the kustomization.yaml in overlays/production and update resource limits:

```yaml
patches:
  - target:
      kind: Deployment
      name: unified-health-api
    patch: |-
      - op: replace
        path: /spec/template/spec/containers/0/resources/requests/cpu
        value: "1000m"
      - op: replace
        path: /spec/template/spec/containers/0/resources/requests/memory
        value: "1Gi"
```

### Adjust HPA Settings

Edit the HPA to change scaling thresholds:

```bash
kubectl edit hpa unified-health-api-hpa -n unified-health-production
```

### Adjust Database Connection Pool

Edit ConfigMap:

```bash
kubectl edit configmap unified-health-config -n unified-health-production
# Update database-pool-size value
```

## Health Check Endpoints

- **Liveness**: `/health` - Returns 200 if application is alive
- **Readiness**: `/ready` - Returns 200 if application is ready to serve traffic
- **Metrics**: `/metrics` - Prometheus metrics endpoint

## Support

For additional help, refer to:
- Full README: [README.md](README.md)
- Kubernetes Documentation: https://kubernetes.io/docs/
- Azure AKS Documentation: https://docs.microsoft.com/en-us/azure/aks/

---

**Last Updated**: 2025-12-17
