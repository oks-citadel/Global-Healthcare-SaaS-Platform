# Quick Start: Deployment Guide

This guide will get you from zero to deployed in approximately 60 minutes.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Azure subscription with admin access
- [ ] Azure CLI installed and logged in (`az login`)
- [ ] Docker installed and running
- [ ] kubectl installed
- [ ] Git repository access
- [ ] Node.js 20+ and pnpm installed

## Step 1: Initial Azure Setup (20 minutes)

### 1.1 Create Service Principal

```bash
# Login to Azure
az login

# Set your subscription
az account set --subscription "Your Subscription Name"

# Create service principal for automation
az ad sp create-for-rbac \
  --name "unified-health-deploy" \
  --role contributor \
  --scopes /subscriptions/$(az account show --query id -o tsv) \
  --sdk-auth

# Save the JSON output - you'll need it for GitHub Actions
```

### 1.2 Clone Repository

```bash
git clone https://github.com/your-org/unified-health-platform.git
cd unified-health-platform

# Make scripts executable
chmod +x scripts/*.sh
```

### 1.3 Setup Staging Infrastructure

```bash
# This creates all Azure resources for staging
./scripts/setup-azure.sh staging

# Expected duration: ~15 minutes
# Creates: AKS cluster, ACR, PostgreSQL, Redis, Key Vault, Storage
```

### 1.4 Setup Secrets

```bash
# Generate and store all secrets
./scripts/setup-secrets.sh staging

# This creates:
# - JWT secrets
# - Encryption keys
# - Kubernetes secrets
# - ConfigMaps
```

### 1.5 Verify Setup

```bash
# Get AKS credentials
az aks get-credentials \
  --resource-group unified-health-rg-staging \
  --name unified-health-aks-staging

# Check cluster is running
kubectl get nodes
kubectl get namespaces

# Should see:
# - 3 nodes in Ready state
# - unified-health-staging namespace
```

## Step 2: First Deployment (15 minutes)

### 2.1 Build and Deploy to Staging

```bash
# Option A: Using deployment script
./scripts/deploy-staging.sh

# Option B: Using Makefile
make deploy-staging
```

### 2.2 Watch Deployment

```bash
# Watch pods starting up
kubectl get pods -n unified-health-staging -w

# Check deployment status
kubectl rollout status deployment/unified-health-api -n unified-health-staging

# View logs
kubectl logs -f -n unified-health-staging -l app=unified-health-api
```

### 2.3 Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n unified-health-staging

# Test health endpoint
kubectl port-forward -n unified-health-staging svc/unified-health-api 8080:80 &
curl http://localhost:8080/health

# Should return: {"status":"ok"}
```

## Step 3: Setup GitHub Actions (10 minutes)

### 3.1 Add GitHub Secrets

Go to your GitHub repository: Settings → Secrets and variables → Actions

Add these secrets:

```
AZURE_CREDENTIALS = <service-principal-json-from-step-1.1>
ACR_NAME = unifiedhealthacr
SLACK_WEBHOOK_URL = https://hooks.slack.com/services/YOUR/WEBHOOK/URL
STAGING_URL = https://staging.unified-health.com
STAGING_API_URL = https://api-staging.unified-health.com
```

### 3.2 Test CI/CD

```bash
# Make a small change
echo "# Test deployment" >> README.md

# Commit and push
git add .
git commit -m "Test: Trigger staging deployment"
git push origin main

# Watch deployment in GitHub Actions tab
```

## Step 4: Production Setup (15 minutes)

### 4.1 Create Production Infrastructure

```bash
# Setup production environment
./scripts/setup-azure.sh production

# Setup secrets
./scripts/setup-secrets.sh production
```

### 4.2 Configure Production Settings

```bash
# Switch to production context
az aks get-credentials \
  --resource-group unified-health-rg-prod \
  --name unified-health-aks-prod

# Verify
kubectl get nodes
```

### 4.3 First Production Deployment

```bash
# Create release tag
git tag -a v1.0.0 -m "First production release"
git push origin v1.0.0

# Deploy via GitHub Actions:
# 1. Go to Actions tab
# 2. Select "Deploy to Production"
# 3. Click "Run workflow"
# 4. Enter version: v1.0.0
# 5. Approve deployment
```

## Step 5: Post-Deployment Verification

### 5.1 Check All Services

```bash
# Staging
make status-staging

# Production
make status-production
```

### 5.2 Run Health Checks

```bash
# Staging API health
curl https://api-staging.unified-health.com/health

# Production API health
curl https://api.unified-health.com/health
```

### 5.3 Check Monitoring

```bash
# View logs
make logs-staging
make logs-production

# Check metrics
make metrics-staging
make metrics-production
```

## Common Commands Reference

### Deployment

```bash
# Deploy to staging
make deploy-staging

# Deploy to production
make deploy-production

# Rollback staging
make rollback-staging

# Rollback production
make rollback-production
```

### Database

```bash
# Backup staging
make backup-staging

# Backup production
make backup-production

# Restore (interactive)
make restore-staging
make restore-production
```

### Monitoring

```bash
# View logs
make logs-staging
make logs-production

# Check status
make status-staging
make status-production

# View metrics
make metrics-staging
make metrics-production
```

### Development

```bash
# Start local environment
make docker-compose-up

# View logs
make docker-compose-logs

# Stop environment
make docker-compose-down

# Run tests
make test

# Lint code
make lint
```

## Troubleshooting Quick Fixes

### Issue: Azure login failed
```bash
az login
az account list
az account set --subscription "Your Subscription"
```

### Issue: AKS credentials not working
```bash
az aks get-credentials \
  --resource-group unified-health-rg-staging \
  --name unified-health-aks-staging \
  --overwrite-existing
```

### Issue: Pods not starting
```bash
# Check pod status
kubectl get pods -n unified-health-staging

# Describe pod for details
kubectl describe pod <pod-name> -n unified-health-staging

# Check logs
kubectl logs <pod-name> -n unified-health-staging

# Check events
kubectl get events -n unified-health-staging --sort-by='.lastTimestamp'
```

### Issue: Database connection failed
```bash
# Check secrets exist
kubectl get secrets -n unified-health-staging

# Verify database URL
kubectl get secret unified-health-secrets -n unified-health-staging -o jsonpath='{.data.database-url}' | base64 -d

# Test database connectivity from pod
kubectl exec -it <pod-name> -n unified-health-staging -- sh
# Then: psql $DATABASE_URL
```

### Issue: Docker build failed
```bash
# Check Docker is running
docker ps

# Clean Docker cache
docker system prune -af

# Rebuild with no cache
docker build --no-cache -f services/api/Dockerfile services/api
```

## Next Steps

### 1. Setup DNS and SSL
- Configure your domain DNS records
- Setup Let's Encrypt certificates
- Configure ingress with TLS

### 2. Configure Monitoring
- Setup Prometheus and Grafana
- Configure alerts
- Setup log aggregation

### 3. Setup Backup Schedule
- Configure automated daily backups
- Test restore procedures
- Document recovery procedures

### 4. Security Hardening
- Review RBAC policies
- Enable network policies
- Setup vulnerability scanning
- Configure audit logging

### 5. Performance Optimization
- Configure autoscaling
- Optimize database queries
- Setup caching strategies
- Enable CDN

## Getting Help

### Documentation
- [Full Deployment Guide](DEPLOYMENT.md)
- [Scripts Documentation](scripts/README.md)
- [Makefile Commands](Makefile)

### Support
- DevOps Team: devops@company.com
- Slack: #unified-health-ops
- On-call: +1-XXX-XXX-XXXX

### Useful Resources
- [Azure AKS Docs](https://docs.microsoft.com/en-us/azure/aks/)
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Docker Docs](https://docs.docker.com/)

## Checklist: Production Readiness

Before going live, verify:

- [ ] All infrastructure provisioned
- [ ] Secrets configured
- [ ] Database migrations successful
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Alerts setup
- [ ] Backup and restore tested
- [ ] SSL certificates configured
- [ ] DNS configured
- [ ] Load testing completed
- [ ] Security scan passed
- [ ] Documentation updated
- [ ] Team trained on deployment
- [ ] Runbook created
- [ ] On-call schedule setup

## Estimated Timeline

| Task | Duration |
|------|----------|
| Initial Azure Setup | 20 min |
| First Deployment | 15 min |
| GitHub Actions Setup | 10 min |
| Production Setup | 15 min |
| **Total** | **60 min** |

Note: Times are estimates for experienced users. First-time setup may take longer.

## Success Criteria

You're successfully deployed when:

1. ✅ All pods are in Running state
2. ✅ Health checks return 200 OK
3. ✅ Database connections working
4. ✅ Logs are clean (no errors)
5. ✅ Monitoring dashboards showing data
6. ✅ CI/CD pipeline passing
7. ✅ Backup completed successfully

## What's Next?

After successful deployment:

1. **Monitor** - Watch logs and metrics for first 24 hours
2. **Test** - Run comprehensive integration tests
3. **Document** - Update runbooks with any learnings
4. **Train** - Ensure team knows deployment procedures
5. **Optimize** - Review resource usage and costs
6. **Scale** - Test autoscaling under load
7. **Secure** - Complete security audit

---

**Need help?** Check the [Troubleshooting Guide](DEPLOYMENT.md#troubleshooting) or contact the DevOps team.
