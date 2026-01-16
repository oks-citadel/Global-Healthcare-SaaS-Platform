# Quick Start: Deployment Guide

This guide will get you from zero to deployed in approximately 60 minutes.

> **Note:** This platform uses **ECS Fargate** (serverless containers).

> **Related Documentation:**
> - [Full Deployment Guide](DEPLOYMENT.md) - Comprehensive ECS Fargate deployment
> - [AWS Terraform Deployment](DEPLOYMENT_GUIDE.md) - Infrastructure as Code setup with Terraform
> - [ECS Fargate Architecture](docs/architecture/ecs-fargate-architecture.md) - Target architecture

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] AWS account with admin access
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Terraform >= 1.5 installed
- [ ] Docker installed and running
- [ ] Git repository access
- [ ] Node.js 20+ and pnpm installed

## Step 1: Initial AWS Setup (20 minutes)

### 1.1 Create IAM User for GitHub Actions

```bash
# Create IAM user
aws iam create-user --user-name unified-health-deploy

# Attach required policies
aws iam attach-user-policy \
  --user-name unified-health-deploy \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess

aws iam attach-user-policy \
  --user-name unified-health-deploy \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess

# Create access key - save the output for GitHub Actions
aws iam create-access-key --user-name unified-health-deploy
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
# This creates all AWS resources for staging
./scripts/setup-aws.sh staging

# Expected duration: ~15 minutes
# Creates: ECS Fargate cluster, ECR, RDS PostgreSQL, ElastiCache Redis, Secrets Manager, S3
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
# Verify ECS cluster is running
aws ecs describe-clusters \
  --region us-east-1 \
  --clusters unified-health-staging

# List ECS services
aws ecs list-services \
  --region us-east-1 \
  --cluster unified-health-staging

# Should see:
# - Cluster status: ACTIVE
# - Services deployed
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
# Watch ECS service deployment
aws ecs describe-services \
  --cluster unified-health-staging \
  --services unified-health-api \
  --query 'services[0].deployments'

# View logs in CloudWatch
aws logs tail /ecs/unified-health-staging/api --follow
```

### 2.3 Verify Deployment

```bash
# Check all services are running
aws ecs list-services --cluster unified-health-staging

# Check service status
aws ecs describe-services \
  --cluster unified-health-staging \
  --services unified-health-api

# Test health endpoint via ALB
curl https://api-staging.unified-health.com/health

# Should return: {"status":"ok"}
```

## Step 3: Setup GitHub Actions (10 minutes)

### 3.1 Add GitHub Secrets

Go to your GitHub repository: Settings → Secrets and variables → Actions

Add these secrets:

```
AWS_ACCESS_KEY_ID = <access-key-id-from-step-1.1>
AWS_SECRET_ACCESS_KEY = <secret-access-key-from-step-1.1>
AWS_REGION = us-east-1
ECR_REGISTRY = <your-account-id>.dkr.ecr.us-east-1.amazonaws.com
SLACK_WEBHOOK_URL = your-slack-webhook-url
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
./scripts/setup-aws.sh production

# Setup secrets
./scripts/setup-secrets.sh production
```

### 4.2 Configure Production Settings

```bash
# Verify production ECS cluster
aws ecs describe-clusters \
  --region us-east-1 \
  --clusters unified-health-prod

# List production services
aws ecs list-services \
  --cluster unified-health-prod
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

### Issue: AWS credentials not working
```bash
aws configure
aws sts get-caller-identity
```

### Issue: ECS service not starting
```bash
# Check service status
aws ecs describe-services \
  --cluster unified-health-staging \
  --services unified-health-api

# List tasks
aws ecs list-tasks \
  --cluster unified-health-staging \
  --service-name unified-health-api

# Describe task for details
aws ecs describe-tasks \
  --cluster unified-health-staging \
  --tasks <task-id>

# Check CloudWatch logs
aws logs tail /ecs/unified-health-staging/api --since 1h
```

### Issue: Database connection failed
```bash
# Check secrets in Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id unified-health-staging/database-url

# Check security group allows database access
aws ec2 describe-security-groups \
  --group-ids <security-group-id>
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
- [AWS ECS Docs](https://docs.aws.amazon.com/ecs/)
- [AWS Fargate Docs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
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
| Initial AWS Setup | 20 min |
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
