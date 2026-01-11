# UnifiedHealth Platform - Deployment Guide

Complete guide for deploying the UnifiedHealth Platform to **AWS ECS Fargate** (serverless containers).

> **Note:** This platform uses **ECS Fargate**, not EKS. See [ECS Fargate Architecture](docs/architecture/ecs-fargate-architecture.md) for details.

> **Related Documentation:**
> - [Quick Start Deployment](QUICKSTART-DEPLOYMENT.md) - Get deployed in 60 minutes
> - [AWS Terraform Deployment](DEPLOYMENT_GUIDE.md) - Infrastructure as Code setup
> - [Deployment Overview](docs/deployment/README.md) - Comprehensive deployment options
> - [ECS Fargate Architecture](docs/architecture/ecs-fargate-architecture.md) - Target architecture

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Deployment Workflows](#deployment-workflows)
5. [Makefile Commands](#makefile-commands)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Disaster Recovery](#disaster-recovery)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Infrastructure Components

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   ECR        │      │   Secrets    │                    │
│  │ (Container   │      │   Manager    │                    │
│  │  Registry)   │      └──────────────┘                    │
│  └──────────────┘                                           │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           ECS Fargate (Serverless Containers)        │   │
│  │                                                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │ API Service │  │ Web Service │  │ Auth Service│ │   │
│  │  │  (Fargate)  │  │  (Fargate)  │  │  (Fargate)  │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │    Application Load Balancer (ALB)             │ │   │
│  │  │    Target Groups per Service                   │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │  Amazon RDS  │      │  ElastiCache │      │    S3     │ │
│  │  PostgreSQL  │      │    Redis     │      │  Storage  │ │
│  │              │      └──────────────┘      └───────────┘ │
│  └──────────────┘                                           │
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │  CloudWatch  │      │    X-Ray     │                    │
│  │    Logs      │      │   Tracing    │                    │
│  └──────────────┘      └──────────────┘                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Strategy

- **Staging**: Rolling updates with automated deployment on main branch
- **Production**: Blue-green deployment with CodeDeploy
- **Database**: Migrations with automatic backup and rollback
- **Secrets**: AWS Secrets Manager integration with ECS task definitions

## Prerequisites

### Required Tools

1. **AWS CLI** (v2.0+)
   ```bash
   # Install
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install

   # Configure
   aws configure
   ```

2. **Terraform** (v1.5+)
   ```bash
   # Install (macOS/Linux)
   brew install terraform
   # Or download from https://www.terraform.io/downloads
   ```

3. **ECS CLI** (optional, for local debugging)
   ```bash
   # Install
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

5. **Docker** (v24+)
   ```bash
   # Install
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

6. **PostgreSQL Client** (v15+)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql-client
   ```

7. **jq** (JSON processor)
   ```bash
   sudo apt-get install jq
   ```

8. **Node.js** (v20+) and **pnpm**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install pnpm
   npm install -g pnpm
   ```

### AWS Permissions

Required AWS IAM permissions:
- `eks:*` for EKS cluster management
- `ecr:*` for container registry
- `secretsmanager:*` for secrets management
- `iam:*` for IAM roles (IRSA setup)

### GitHub Secrets

Configure the following secrets in your GitHub repository:

| Secret | Description | Example |
|--------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS access key ID | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | `wJalr...` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `ECR_REGISTRY` | ECR registry URL | `123456789.dkr.ecr.us-east-1.amazonaws.com` |
| `SLACK_WEBHOOK_URL` | Slack webhook for notifications | `https://hooks.slack.com/services/...` |
| `STAGING_URL` | Staging environment URL | `https://staging.unified-health.com` |
| `STAGING_API_URL` | Staging API URL | `https://api-staging.unified-health.com` |
| `EMAIL_USERNAME` | SMTP username | `notifications@company.com` |
| `EMAIL_PASSWORD` | SMTP password | `***` |
| `NOTIFICATION_EMAIL` | Email for alerts | `devops@company.com` |

## Initial Setup

### 1. Create AWS IAM User for GitHub Actions

```bash
# Create IAM user
aws iam create-user --user-name github-actions-unified-health

# Create access key
aws iam create-access-key --user-name github-actions-unified-health

# Attach required policies
aws iam attach-user-policy \
  --user-name github-actions-unified-health \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy

# Save access key output for GitHub Secrets
```

### 2. Setup AWS Infrastructure

#### Staging Environment

```bash
# Clone repository
git clone https://github.com/your-org/unified-health-platform.git
cd unified-health-platform

# Make scripts executable
chmod +x scripts/*.sh

# Create staging infrastructure
./scripts/setup-aws.sh staging

# Setup secrets
./scripts/setup-secrets.sh staging

# Verify setup
kubectl get nodes
kubectl get namespaces
```

#### Production Environment

```bash
# Create production infrastructure
./scripts/setup-aws.sh production

# Setup secrets
./scripts/setup-secrets.sh production

# Switch context
aws eks update-kubeconfig --name unified-health-eks-prod --region us-east-1
```

### 3. Configure DNS

```bash
# Get ingress external IP
kubectl get svc -n ingress-nginx ingress-nginx-controller

# Create DNS A records:
# staging.unified-health.com -> <staging-ip>
# api-staging.unified-health.com -> <staging-ip>
# unified-health.com -> <production-ip>
# api.unified-health.com -> <production-ip>
```

### 4. Configure TLS Certificates

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer for Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@unified-health.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

## Deployment Workflows

### Staging Deployment

Automatically triggered on push to `main` branch.

**Manual trigger:**
```bash
# Via GitHub Actions UI
# 1. Go to Actions tab
# 2. Select "Deploy to Staging"
# 3. Click "Run workflow"

# Or via script
./scripts/deploy-staging.sh
```

**Process:**
1. Build and test code
2. Build Docker images
3. Push to ACR
4. Run database migrations
5. Deploy to Kubernetes
6. Run smoke tests
7. Run E2E tests
8. Send notification

### Production Deployment

Manual trigger only with approval.

**Via GitHub Actions (Recommended):**
```bash
# 1. Create release tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 2. Go to GitHub Actions
# 3. Select "Deploy to Production"
# 4. Click "Run workflow"
# 5. Enter version: v1.0.0
# 6. Approve deployment
```

**Via Script:**
```bash
# Set version
export VERSION=v1.0.0

# Deploy
./scripts/deploy-production.sh
```

**Process:**
1. Pre-deployment checks
2. Backup database
3. Build and push images
4. Scan images for vulnerabilities
5. Run database migrations
6. Deploy to new color (blue/green)
7. Verify deployment
8. Switch traffic
9. Monitor for issues
10. Scale down old deployment
11. Send notification

### Rollback

**Quick rollback to previous version:**
```bash
# Production
./scripts/rollback.sh production

# To specific version
./scripts/rollback.sh production v1.0.0

# With database rollback
ROLLBACK_DATABASE=true \
DB_BACKUP_NAME=backup-production-20240101-120000 \
./scripts/rollback.sh production
```

**Via GitHub Actions:**
- Trigger "Deploy to Production" with previous version tag

## Makefile Commands

The `Makefile` provides convenient shortcuts for common operations.

### Development

```bash
# Install dependencies
make install

# Build all services
make build

# Run tests
make test

# Lint code
make lint

# Format code
make format

# Start development servers
make dev
```

### Docker

```bash
# Build Docker images
make docker-build

# Push to ACR
make docker-push

# Start local environment
make docker-compose-up

# Stop local environment
make docker-compose-down
```

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
# Backup staging database
make backup-staging

# Backup production database
make backup-production

# Restore staging database
make restore-staging

# Restore production database
make restore-production
```

### Kubernetes

```bash
# Switch to staging context
make k8s-context-staging

# Switch to production context
make k8s-context-production

# List staging pods
make k8s-pods-staging

# View staging logs
make k8s-logs-staging

# Open shell in staging pod
make k8s-shell-staging

# Check staging status
make status-staging
```

### Utilities

```bash
# Clean build artifacts
make clean

# Show version
make version

# Show project info
make info

# Check environment
make check-env
```

## CI/CD Pipeline

### GitHub Actions Workflows

#### `.github/workflows/ci.yml`
- Runs on every PR
- Lints, type checks, and tests code
- Builds Docker images
- Runs E2E tests

#### `.github/workflows/deploy-staging.yml`
- Runs on push to `main`
- Deploys to staging
- Runs E2E tests
- Sends notifications

#### `.github/workflows/deploy-production.yml`
- Manual trigger only
- Requires version tag
- Blue-green deployment
- Automatic rollback on failure
- Sends notifications

### Deployment Flow

```
┌─────────────┐
│   Develop   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Create PR  │────▶│  Run CI     │
└──────┬──────┘     └──────┬──────┘
       │                   │
       │ Approved          │ Tests Pass
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│   Merge PR  │     │   Deploy    │
└──────┬──────┘────▶│  to Staging │
       │            └──────┬──────┘
       │                   │
       │                   │ E2E Pass
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  Create Tag │     │   Deploy    │
└──────┬──────┘────▶│ to Prod     │
       │            └──────┬──────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       └───────────▶│  Monitoring │
                    └─────────────┘
```

## Monitoring and Logging

### Application Insights

View application metrics and traces:
```bash
# Get Application Insights URL
az monitor app-insights component show \
  --app unified-health-insights-production \
  --resource-group unified-health-rg-prod \
  --query appId -o tsv
```

### Log Analytics

Query logs:
```bash
# View API logs
kubectl logs -f -n unified-health-prod -l app=unified-health-api --tail=100

# View all logs
kubectl logs -f -n unified-health-prod --all-containers=true --tail=100
```

### Kubernetes Dashboard

```bash
# Deploy dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

# Create admin user
kubectl create serviceaccount dashboard-admin -n kubernetes-dashboard
kubectl create clusterrolebinding dashboard-admin --clusterrole=cluster-admin --serviceaccount=kubernetes-dashboard:dashboard-admin

# Get token
kubectl -n kubernetes-dashboard create token dashboard-admin

# Access dashboard
kubectl proxy
# Open http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

### Prometheus and Grafana

```bash
# Install Prometheus and Grafana
kubectl create namespace monitoring

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set grafana.adminPassword=admin123

# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
# Open http://localhost:3000 (admin/admin123)
```

## Disaster Recovery

### Database Backups

**Automatic backups:**
- Daily backups at 2 AM UTC
- 30-day retention for staging
- 90-day retention for production
- Geo-redundant storage

**Manual backup:**
```bash
make backup-production
```

### Restore Procedures

**Full restore:**
```bash
# List available backups
./scripts/db-restore.sh

# Restore specific backup
./scripts/db-restore.sh backup-production-20240101-120000 production
```

**Point-in-time recovery:**
```bash
PITR_TARGET_TIME="2024-01-01T12:00:00Z" \
./scripts/db-restore.sh production
```

### Disaster Recovery Plan

1. **Database corruption:**
   - Restore from latest backup
   - Run data integrity checks
   - Verify application functionality

2. **Complete cluster failure:**
   - Create new AKS cluster
   - Restore infrastructure from IaC
   - Restore database from backup
   - Redeploy application

3. **AWS region outage:**
   - Failover to multi-region setup
   - Update Route53 DNS records
   - Restore from cross-region S3 backup

### Recovery Time Objectives (RTO)

- **Staging**: 2 hours
- **Production**: 1 hour
- **Critical systems**: 30 minutes

### Recovery Point Objectives (RPO)

- **Database**: 5 minutes (continuous backup)
- **Application**: 0 (stateless)
- **Files**: 1 hour (blob storage replication)

## Security

### Secret Management

All secrets stored in AWS Secrets Manager:
- JWT secrets
- Database passwords
- API keys
- Encryption keys

**Rotate secrets:**
```bash
ROTATE_SECRETS=true ./scripts/setup-secrets.sh production
```

### Network Security

- **Virtual Network**: Isolated network for AKS
- **Network Security Groups**: Firewall rules
- **Private Endpoints**: No public database access
- **TLS/SSL**: All traffic encrypted

### Container Security

- **Image scanning**: Trivy scans on every build
- **Non-root users**: Containers run as user 1001
- **Read-only filesystem**: Prevents tampering
- **Resource limits**: CPU and memory constraints

### RBAC

Kubernetes role-based access control:
```bash
# View current roles
kubectl get roles,rolebindings -n unified-health-prod

# Create read-only user
kubectl create rolebinding developer-readonly \
  --clusterrole=view \
  --user=developer@company.com \
  --namespace=unified-health-prod
```

### Compliance

- **HIPAA**: Healthcare data compliance
- **SOC 2**: Security controls
- **GDPR**: Data privacy regulations
- **Audit logging**: All operations logged

## Troubleshooting

### Common Issues

See [scripts/README.md](scripts/README.md#troubleshooting) for detailed troubleshooting guide.

### Debug Commands

```bash
# Check pod status
kubectl get pods -n unified-health-prod

# Describe pod
kubectl describe pod <pod-name> -n unified-health-prod

# View logs
kubectl logs <pod-name> -n unified-health-prod

# Execute command in pod
kubectl exec -it <pod-name> -n unified-health-prod -- /bin/sh

# View events
kubectl get events -n unified-health-prod --sort-by='.lastTimestamp'

# Check resource usage
kubectl top pods -n unified-health-prod
kubectl top nodes
```

### Support Contacts

- **DevOps Team**: devops@company.com
- **On-call**: +1-XXX-XXX-XXXX
- **Slack**: #unified-health-ops

## Additional Resources

- [Scripts Documentation](scripts/README.md)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Appendix

### Environment Comparison

| Feature | Staging | Production |
|---------|---------|------------|
| Deployment | Automatic on main | Manual with approval |
| Strategy | Rolling update | Blue-green |
| Replicas | 2 | 3 minimum, 20 maximum |
| Node size | Standard_D2s_v3 | Standard_D4s_v3 |
| Database | Single zone | High availability |
| Backup retention | 30 days | 90 days |
| Monitoring | Basic | Enhanced |

### Cost Optimization

- Use AWS Savings Plans or Reserved Instances for production
- Scale down non-production environments after hours
- Use spot instances for batch workloads
- Enable autoscaling based on demand
- Regular review of unused resources

### Maintenance Windows

- **Staging**: Anytime
- **Production**: Sunday 2-4 AM UTC
- **Emergency patches**: As needed with notification

### Change Management

1. All changes require PR review
2. Production deployments require approval
3. Database changes require backup
4. Document all changes in CHANGELOG
5. Notify team of scheduled maintenance
