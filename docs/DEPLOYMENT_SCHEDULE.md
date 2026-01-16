# Deployment Schedule - The Unified Health Platform

## Overview

The platform uses a scheduled deployment strategy where:
- **Builds** continue throughout the day (triggered on each push)
- **Deployments** happen once daily at 9:00 PM EST (2:00 AM UTC)

This ensures all commits are bundled and released together, reducing production churn.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONTINUOUS INTEGRATION                       │
├─────────────────────────────────────────────────────────────────┤
│  GitHub Push → CodePipeline → CodeBuild → ECR (Image Push)      │
│                                                                  │
│  Runs: On every push to main branch                              │
│  Output: Docker images pushed to ECR with commit hash tags       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                              ↓ (Images staged in ECR)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   SCHEDULED DEPLOYMENT                           │
├─────────────────────────────────────────────────────────────────┤
│  EventBridge (9 PM EST) → CodeBuild → EKS (kubectl set image)   │
│                                                                  │
│  Runs: Daily at 2:00 AM UTC (9:00 PM EST)                        │
│  Action: Deploys latest ECR images to production                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Schedule Details

| Event | Time (EST) | Time (UTC) | Description |
|-------|------------|------------|-------------|
| Scheduled Deployment | 9:00 PM | 2:00 AM | Deploy latest images to EKS |

**Cron Expression:** `cron(0 2 * * ? *)`

---

## Services Deployed

| Service | ECR Repository | Kubernetes Deployment |
|---------|----------------|----------------------|
| API | unified-health-prod/api | api |
| Web App | unified-health-prod/web-app | web |

---

## Manual Deployment

For urgent hotfixes or off-schedule deployments:

### Option 1: Trigger Scheduled Deploy Manually
```bash
aws codebuild start-build --project-name unified-health-prod-scheduled-deploy --region us-east-1
```

### Option 2: Direct kubectl Deploy
```bash
# Get latest image tag
TAG=$(aws ecr describe-images \
    --repository-name unified-health-prod/api \
    --query 'sort_by(imageDetails, &imagePushedAt)[-1].imageTags[0]' \
    --output text)

# Deploy to EKS
kubectl set image deployment/api \
    api=992382449461.dkr.ecr.us-east-1.amazonaws.com/unified-health-prod/api:$TAG \
    -n unified-health
```

---

## Monitoring

### Check Deployment Logs
```bash
# View scheduled deployment build logs
aws codebuild batch-get-builds \
    --ids $(aws codebuild list-builds-for-project \
        --project-name unified-health-prod-scheduled-deploy \
        --max-items 1 \
        --query 'ids[0]' \
        --output text) \
    --query 'builds[0].logs.deepLink' \
    --output text
```

### Check EKS Deployment Status
```bash
kubectl rollout status deployment/api -n unified-health
kubectl rollout status deployment/web -n unified-health
```

---

## Rollback

If a deployment causes issues:

```bash
# Rollback to previous version
kubectl rollout undo deployment/api -n unified-health
kubectl rollout undo deployment/web -n unified-health

# Or deploy a specific version
kubectl set image deployment/api \
    api=992382449461.dkr.ecr.us-east-1.amazonaws.com/unified-health-prod/api:<specific-tag> \
    -n unified-health
```

---

## Configuration

The scheduled deployment is managed via Terraform:

- **EventBridge Rule:** `infrastructure/terraform/scheduled-deployment.tf`
- **Variables:** `infrastructure/terraform/variables.tf`
  - `enable_scheduled_deployment` - Enable/disable scheduled deployment
  - `eks_cluster_name` - Target EKS cluster

To disable scheduled deployment:
```bash
cd infrastructure/terraform
terraform apply -var="enable_scheduled_deployment=false"
```

---

## Cost Impact

- EventBridge: Free (included in AWS free tier)
- CodeBuild: ~$0.005/minute (BUILD_GENERAL1_SMALL)
- Estimated monthly cost: < $1/month (runs once daily for ~5 minutes)

---

Last Updated: January 2, 2026
