# Deployment Guide

## Overview

This guide covers deploying the Unified Health Global Platform to production environments. The platform supports multiple deployment strategies including Kubernetes, Docker Compose, and cloud-native services.

## Deployment Options

### Option 1: Kubernetes (Recommended for Production)

**Best for:**
- Production environments
- High availability requirements
- Auto-scaling needs
- Multi-region deployments

**See:** [Kubernetes Deployment Guide](./KUBERNETES.md)

### Option 2: Docker Compose

**Best for:**
- Development/staging environments
- Small-scale deployments
- Quick setup

**See:** [Docker Deployment Guide](../DOCKER.md)

### Option 3: Cloud-Native Services

**Best for:**
- Managed services preference
- Reduced operational overhead
- Cloud provider integration

**See:** [Cloud Deployment Guide](./CLOUD.md)

## Pre-Deployment Checklist

### 1. Infrastructure Requirements

**Minimum Requirements:**
- **API Service:** 2 vCPUs, 4GB RAM
- **Web Application:** 2 vCPUs, 2GB RAM
- **Database (PostgreSQL):** 4 vCPUs, 8GB RAM
- **Cache (Redis):** 2 vCPUs, 4GB RAM
- **Storage:** 100GB SSD minimum

**Recommended Production:**
- **API Service:** 4-8 vCPUs, 16GB RAM (with auto-scaling)
- **Database:** 8 vCPUs, 32GB RAM (with read replicas)
- **Cache:** 4 vCPUs, 16GB RAM (clustered)
- **Storage:** 500GB+ SSD (with backup)

### 2. Required Services

- [ ] PostgreSQL 15+ (primary database)
- [ ] MongoDB 6+ (document storage)
- [ ] Redis 7+ (caching and sessions)
- [ ] Elasticsearch 8+ (search)
- [ ] SMTP server (email notifications)
- [ ] SMS provider (Twilio)
- [ ] Payment processor (Stripe)
- [ ] CDN (CloudFlare)
- [ ] Object storage (S3 or compatible)

### 3. Domain and DNS

- [ ] Domain name registered
- [ ] SSL/TLS certificates obtained
- [ ] DNS records configured:
  - `app.yourdomain.com` → Web application
  - `api.yourdomain.com` → API service
  - `admin.yourdomain.com` → Admin dashboard

### 4. Environment Variables

See [Environment Configuration](./ENVIRONMENT.md) for complete list.

**Critical Variables:**
```bash
# Application
NODE_ENV=production
API_URL=https://api.yourdomain.com
WEB_URL=https://app.yourdomain.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
MONGODB_URI=mongodb://host:27017/db
REDIS_URL=redis://host:6379

# Security
JWT_SECRET=your-256-bit-secret
JWT_REFRESH_SECRET=your-refresh-secret
ENCRYPTION_KEY=your-encryption-key

# External Services
STRIPE_SECRET_KEY=sk_live_...
TWILIO_ACCOUNT_SID=AC...
SENDGRID_API_KEY=SG...
```

## Quick Deployment (Kubernetes)

### Prerequisites

- Kubernetes cluster (1.27+)
- kubectl configured
- Helm 3.x installed
- Container registry access

### Step 1: Prepare Infrastructure

```bash
# Clone repository
git clone https://github.com/unified-health/platform.git
cd platform

# Navigate to infrastructure
cd infrastructure/kubernetes
```

### Step 2: Configure Secrets

```bash
# Create namespace
kubectl create namespace unified-health

# Create secrets
kubectl create secret generic unified-health-secrets \
  --from-env-file=.env.production \
  -n unified-health

# Create TLS certificate secret
kubectl create secret tls unified-health-tls \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key \
  -n unified-health
```

### Step 3: Deploy with Helm

```bash
# Add Helm repository
helm repo add unified-health https://charts.unifiedhealthcare.com
helm repo update

# Install the chart
helm install unified-health unified-health/unified-health \
  --namespace unified-health \
  --values values-production.yaml \
  --wait
```

Or use local charts:
```bash
cd infrastructure/helm

helm install unified-health ./unified-health \
  --namespace unified-health \
  --values values-production.yaml \
  --wait
```

### Step 4: Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n unified-health

# Check services
kubectl get svc -n unified-health

# Check ingress
kubectl get ingress -n unified-health

# View logs
kubectl logs -f deployment/api -n unified-health
```

### Step 5: Run Database Migrations

```bash
# Get API pod name
POD=$(kubectl get pod -l app=api -n unified-health -o jsonpath='{.items[0].metadata.name}')

# Run migrations
kubectl exec -it $POD -n unified-health -- pnpm db:migrate

# Seed initial data (optional)
kubectl exec -it $POD -n unified-health -- pnpm db:seed:prod
```

### Step 6: Health Check

```bash
# Test API health
curl https://api.yourdomain.com/health

# Expected response:
# {"status":"healthy","version":"1.0.0","timestamp":"..."}

# Test web application
curl -I https://app.yourdomain.com

# Expected: 200 OK
```

## Docker Compose Deployment

### Step 1: Prepare Server

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: Deploy Application

```bash
# Clone repository
git clone https://github.com/unified-health/platform.git
cd platform

# Copy environment file
cp .env.example .env.production
# Edit .env.production with your configuration

# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 3: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com -d app.yourdomain.com

# Auto-renewal is configured automatically
```

## Database Setup

### PostgreSQL

**Initial Setup:**
```bash
# Create database
createdb unified_health

# Create user
createuser -P unified_health_user

# Grant permissions
psql -c "GRANT ALL PRIVILEGES ON DATABASE unified_health TO unified_health_user;"
```

**Performance Tuning:**
```conf
# postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 16MB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4
```

**Backup Configuration:**
```bash
# Automated daily backups
0 2 * * * /usr/local/bin/backup-postgres.sh
```

### MongoDB

**Replica Set Setup:**
```javascript
// Initialize replica set
rs.initiate({
  _id: "unified-health-rs",
  members: [
    { _id: 0, host: "mongo-1:27017" },
    { _id: 1, host: "mongo-2:27017" },
    { _id: 2, host: "mongo-3:27017" }
  ]
});
```

### Redis

**Cluster Mode:**
```bash
# Create Redis cluster
redis-cli --cluster create \
  redis-1:6379 \
  redis-2:6379 \
  redis-3:6379 \
  --cluster-replicas 1
```

## Monitoring Setup

### Prometheus & Grafana

```bash
# Deploy monitoring stack
kubectl apply -f infrastructure/kubernetes/monitoring/

# Access Grafana
kubectl port-forward svc/grafana 3000:80 -n monitoring

# Default credentials: admin / admin
```

**Key Metrics to Monitor:**
- API response times (p50, p95, p99)
- Error rates
- Database connections
- Cache hit ratio
- Queue depth
- Active users
- Resource utilization (CPU, memory, disk)

### Alerts Configuration

**Critical Alerts:**
- API down
- Database connection failures
- High error rate (>5%)
- Disk space >85%
- Memory usage >90%
- SSL certificate expiring (<7 days)

## Security Hardening

### 1. Network Security

```bash
# Configure firewall
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### 2. SSL/TLS Configuration

**Nginx Configuration:**
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
ssl_prefer_server_ciphers off;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_stapling on;
ssl_stapling_verify on;
add_header Strict-Transport-Security "max-age=63072000" always;
```

### 3. Database Security

```sql
-- Create read-only user for replicas
CREATE ROLE readonly_user WITH LOGIN PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE unified_health TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
```

### 4. Secrets Management

Use Azure Key Vault, AWS Secrets Manager, or HashiCorp Vault:

```bash
# Example: Sync secrets from Azure Key Vault
kubectl create secret generic app-secrets \
  --from-literal=database-url=$(az keyvault secret show --name database-url --vault-name unified-health-kv --query value -o tsv)
```

## Scaling

### Horizontal Pod Autoscaling

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Database Scaling

**Read Replicas:**
```yaml
# PostgreSQL read replica
apiVersion: v1
kind: Service
metadata:
  name: postgres-read
spec:
  selector:
    app: postgres
    role: replica
  ports:
  - port: 5432
```

## Backup and Recovery

### Automated Backups

**PostgreSQL:**
```bash
#!/bin/bash
# backup-postgres.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"

pg_dump unified_health > $BACKUP_DIR/backup_$TIMESTAMP.sql
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$TIMESTAMP.sql.gz \
  s3://unified-health-backups/postgres/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

**Application Data:**
```bash
# Kubernetes volume snapshots
kubectl apply -f - <<EOF
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: unified-health-snapshot-$(date +%Y%m%d)
spec:
  volumeSnapshotClassName: csi-snapshot-class
  source:
    persistentVolumeClaimName: data-pvc
EOF
```

### Disaster Recovery

**RTO (Recovery Time Objective):** 1 hour
**RPO (Recovery Point Objective):** 15 minutes

**Recovery Procedure:**
1. Restore database from latest backup
2. Deploy application from last known good image
3. Restore configuration from Git
4. Verify health checks
5. Update DNS if needed
6. Notify stakeholders

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and push Docker images
        run: |
          docker build -t registry.io/unified-health/api:${{ github.sha }} ./services/api
          docker push registry.io/unified-health/api:${{ github.sha }}

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/api \
            api=registry.io/unified-health/api:${{ github.sha }} \
            -n unified-health

      - name: Wait for rollout
        run: kubectl rollout status deployment/api -n unified-health

      - name: Run smoke tests
        run: ./scripts/smoke-tests.sh
```

## Troubleshooting

### Common Issues

**Issue: Pods not starting**
```bash
# Check pod status
kubectl describe pod <pod-name> -n unified-health

# Check logs
kubectl logs <pod-name> -n unified-health

# Check events
kubectl get events -n unified-health --sort-by='.lastTimestamp'
```

**Issue: Database connection failures**
```bash
# Test connection from pod
kubectl exec -it <pod-name> -n unified-health -- \
  psql $DATABASE_URL -c "SELECT 1;"

# Check database service
kubectl get svc postgres -n unified-health
```

**Issue: High memory usage**
```bash
# Check resource usage
kubectl top pods -n unified-health

# Adjust resource limits
kubectl set resources deployment/api \
  --limits=cpu=2,memory=4Gi \
  -n unified-health
```

## Support

For deployment issues:
- **Documentation:** https://docs.unifiedhealthcare.com/deployment
- **DevOps Support:** devops@unifiedhealth.io
- **Emergency Hotline:** +1-800-UNIFIED-OPS

---

**Last Updated:** 2025-12-17
**Version:** 1.0.0
