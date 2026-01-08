# ECS Fargate Architecture - Unified Health Platform

## Overview

This document describes the target state architecture after migrating from EKS to ECS Fargate for the Unified Health Platform.

## Architecture Decision

**Decision**: Migrate from EKS (Kubernetes) to ECS Fargate (Serverless Containers)

**Rationale**:
- Eliminate EC2 node management overhead
- Pay only for actual container runtime (no idle node costs)
- Simplified operational model (no cluster upgrades, no node patching)
- Native AWS integration (IAM, Secrets Manager, CloudWatch)
- Reduced complexity (no kubectl, Helm, or K8s manifests)

## Target Architecture

```
                                    ┌─────────────────────────────────────────┐
                                    │              Route 53                    │
                                    │         theunifiedhealth.com             │
                                    └─────────────────┬───────────────────────┘
                                                      │
                                    ┌─────────────────▼───────────────────────┐
                                    │       Application Load Balancer          │
                                    │            (HTTPS:443)                   │
                                    │     Certificate: ACM (*.theunifiedhealth)│
                                    └─────────────────┬───────────────────────┘
                                                      │
                          ┌───────────────────────────┼───────────────────────────┐
                          │                           │                           │
              ┌───────────▼──────────┐   ┌───────────▼──────────┐   ┌───────────▼──────────┐
              │   Target Group: API   │   │  Target Group: Web   │   │ Target Group: Admin  │
              │      /api/*           │   │       /*             │   │     /admin/*         │
              └───────────┬──────────┘   └───────────┬──────────┘   └───────────┬──────────┘
                          │                           │                           │
              ┌───────────▼──────────┐   ┌───────────▼──────────┐   ┌───────────▼──────────┐
              │    ECS Service: API   │   │   ECS Service: Web   │   │  ECS Service: Admin  │
              │    Fargate Tasks (2+) │   │   Fargate Tasks (2+) │   │  Fargate Tasks (2+)  │
              └──────────────────────┘   └──────────────────────┘   └──────────────────────┘
                          │                           │                           │
                          └───────────────────────────┼───────────────────────────┘
                                                      │
                          ┌───────────────────────────▼───────────────────────────┐
                          │                    Private Subnets                     │
                          │              ECS Tasks (Fargate ENIs)                  │
                          │                                                        │
                          │   ┌──────────┐  ┌──────────┐  ┌──────────┐            │
                          │   │ API Task │  │ Web Task │  │ Auth Task│  ...       │
                          │   └────┬─────┘  └────┬─────┘  └────┬─────┘            │
                          └────────┼─────────────┼─────────────┼──────────────────┘
                                   │             │             │
                          ┌────────▼─────────────▼─────────────▼──────────────────┐
                          │                VPC Endpoints (Private)                 │
                          │   ECR API | ECR DKR | Secrets Manager | S3 | Logs     │
                          └───────────────────────────────────────────────────────┘
                                                      │
                          ┌───────────────────────────┼───────────────────────────┐
                          │                           │                           │
              ┌───────────▼──────────┐   ┌───────────▼──────────┐   ┌───────────▼──────────┐
              │   Aurora PostgreSQL   │   │   ElastiCache Redis  │   │    S3 / Secrets Mgr  │
              │   (Database Subnets)  │   │  (ElastiCache Subnets)│   │                      │
              └──────────────────────┘   └──────────────────────┘   └──────────────────────┘
```

## ECS Cluster Configuration

### Cluster Settings
- **Cluster Name**: `unified-health-{env}-cluster`
- **Capacity Providers**: FARGATE, FARGATE_SPOT
- **Default Strategy**:
  - Production: 80% FARGATE_SPOT, 20% FARGATE (for cost optimization)
  - Critical services: 100% FARGATE (for availability)
- **Container Insights**: Enabled
- **Execute Command**: Enabled (for debugging)

### Service Categories

| Category | Services | Capacity Provider | Min Tasks | Max Tasks |
|----------|----------|-------------------|-----------|-----------|
| Critical | api, auth-service | FARGATE | 2 | 10 |
| Standard | All other services | FARGATE_SPOT | 2 | 8 |
| Frontend | web-app, admin-portal, provider-portal, kiosk | FARGATE_SPOT | 2 | 6 |

## Task Definition Specifications

### Resource Allocation

| Service Type | CPU | Memory | Notes |
|-------------|-----|--------|-------|
| API Services | 512 | 1024 | Prisma + Express |
| Frontend Apps | 256 | 512 | Next.js static |
| Background Jobs | 256 | 512 | Queue processors |

### Health Checks

All services expose `/health` endpoint:
- **Path**: `/health`
- **Interval**: 30 seconds
- **Timeout**: 5 seconds
- **Healthy Threshold**: 2
- **Unhealthy Threshold**: 3

### Environment Variables

Secrets sourced from AWS Secrets Manager:
- `DATABASE_URL`
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `STRIPE_SECRET_KEY`
- `SENDGRID_API_KEY`

Configuration from SSM Parameter Store:
- `LOG_LEVEL`
- `FEATURE_FLAGS`
- `API_ENDPOINTS`

## Networking

### Existing Infrastructure (Reused)
- VPC: 10.10.0.0/16 (Americas)
- Private Subnets: 10.10.11.0/24, 10.10.12.0/24, 10.10.13.0/24
- ALB: Already configured with HTTPS listener
- Security Groups: Updated for ECS (port 3000-8080)

### New Security Group Rules

```hcl
# ECS Tasks Security Group
ingress {
  from_port   = 3000
  to_port     = 8080
  protocol    = "tcp"
  security_groups = [aws_security_group.alb.id]
}

egress {
  from_port   = 0
  to_port     = 0
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]
}
```

## Auto Scaling

### Scaling Policies

```hcl
# CPU-based scaling
aws_appautoscaling_policy "cpu" {
  target_value       = 70.0
  predefined_metric = "ECSServiceAverageCPUUtilization"
  scale_in_cooldown  = 300
  scale_out_cooldown = 60
}

# Memory-based scaling
aws_appautoscaling_policy "memory" {
  target_value       = 80.0
  predefined_metric = "ECSServiceAverageMemoryUtilization"
  scale_in_cooldown  = 300
  scale_out_cooldown = 60
}
```

## IAM Roles

### Task Execution Role
Permissions:
- `ecr:GetAuthorizationToken`
- `ecr:BatchCheckLayerAvailability`
- `ecr:GetDownloadUrlForLayer`
- `ecr:BatchGetImage`
- `logs:CreateLogStream`
- `logs:PutLogEvents`
- `secretsmanager:GetSecretValue`
- `ssm:GetParameters`

### Task Role (per service)
Service-specific permissions:
- S3 access (if needed)
- DynamoDB access (if needed)
- SES/SNS for notifications
- Other AWS service integrations

## Migration Phases

### Phase 1: Infrastructure (Terraform)
- Create ECS cluster module
- Create ECS service module
- Update ALB target groups
- Create new IAM roles

### Phase 2: Service Migration
- Deploy services one-by-one to ECS
- Validate health checks
- Switch ALB traffic
- Monitor for issues

### Phase 3: Cleanup
- Remove EKS clusters
- Delete node groups
- Remove K8s-related IAM roles
- Archive K8s manifests

## Cost Comparison (Estimated)

| Resource | EKS (Current) | ECS Fargate (Target) | Savings |
|----------|---------------|---------------------|---------|
| Compute | ~$2,500/mo (nodes) | ~$1,200/mo (tasks) | 52% |
| Control Plane | $73/mo per cluster | $0 (included) | 100% |
| Node Management | Manual patching | None | 100% |
| **Total** | **~$2,800/mo** | **~$1,200/mo** | **~57%** |

*Note: Actual savings depend on utilization patterns and Fargate Spot availability.*

## Success Criteria

- [ ] All 21 services running on ECS Fargate
- [ ] Zero EKS clusters remaining
- [ ] Terraform plan shows no changes
- [ ] All health checks passing
- [ ] CI/CD pipeline deploys to ECS
- [ ] Cost reduction verified
