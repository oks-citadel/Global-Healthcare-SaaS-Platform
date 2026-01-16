# EKS to ECS Fargate Migration Summary

## Migration Status: PLAN COMPLETE

**Date**: January 2026
**Status**: Ready for implementation (Terraform plan only - no apply)

## What Was Created

### 1. Architecture Documentation
- `docs/architecture/ecs-fargate-architecture.md` - Complete ECS Fargate target state

### 2. Terraform Modules

#### ECS Cluster Module (`infrastructure/terraform-aws/modules/ecs-cluster/`)
- `main.tf` - ECS cluster with Fargate capacity providers
- `variables.tf` - Configurable parameters
- `outputs.tf` - Module outputs

**Features:**
- Fargate + Fargate Spot capacity providers (80/20 split)
- CloudWatch Container Insights enabled
- ECS Exec enabled for debugging
- Task execution IAM role with Secrets Manager access
- Security group for ECS tasks
- Service discovery namespace (optional)

#### ECS Service Module (`infrastructure/terraform-aws/modules/ecs-service/`)
- `main.tf` - ECS service, task definition, ALB integration, auto-scaling
- `variables.tf` - Configurable parameters
- `outputs.tf` - Module outputs

**Features:**
- Fargate task definitions
- ALB target group and listener rules
- CPU and memory-based auto-scaling
- Deployment circuit breaker with rollback
- CloudWatch logging
- Health check configuration

### 3. CI/CD Pipeline

#### New ECS Deployment Workflow (`.github/workflows/ecs-deploy.yml`)
- Reusable workflow for ECS deployments
- Supports dev, staging, and production environments
- Automated rollback on failure
- Task definition versioning
- Service stability verification

## Resources to Remove (After Migration)

### EKS Resources (from `modules/eks/main.tf`)
```hcl
# DELETE THESE
aws_eks_cluster.main
aws_eks_node_group.system
aws_eks_node_group.application
aws_eks_addon.vpc_cni
aws_eks_addon.coredns
aws_eks_addon.kube_proxy
aws_eks_addon.ebs_csi_driver
aws_iam_role.cluster (EKS cluster role)
aws_iam_role.node (EKS node role)
aws_iam_openid_connect_provider.eks
aws_kms_key.eks
```

### Kubernetes Manifests (Archive, don't delete)
```
infrastructure/kubernetes/base/
infrastructure/kubernetes/overlays/
infrastructure/kubernetes/external-secrets/
infrastructure/kubernetes/monitoring/
infrastructure/helm/
```

### CI/CD Updates (in `unified-pipeline.yml`)
Replace lines 944-1067:
- Remove `aws eks update-kubeconfig`
- Remove all `kubectl` commands
- Add calls to `ecs-deploy.yml` workflow

## Implementation Steps (When Ready)

### Phase 1: Create ECS Infrastructure
```bash
cd infrastructure/terraform-aws
terraform init
terraform plan -target=module.ecs_cluster
terraform apply -target=module.ecs_cluster  # When approved
```

### Phase 2: Deploy Services to ECS
1. Create ECS services using ecs-service module
2. Deploy one service at a time
3. Validate health checks
4. Update ALB listener rules

### Phase 3: Switch Traffic
1. Update ALB to route to ECS target groups
2. Monitor for errors
3. Keep EKS running as fallback

### Phase 4: Decommission EKS
1. Verify all traffic on ECS
2. Scale down EKS node groups
3. Delete EKS cluster
4. Remove EKS Terraform resources

## Cost Comparison (Estimated)

| Resource | EKS (Current) | ECS Fargate | Savings |
|----------|--------------|-------------|---------|
| Control Plane | $219/mo (3 clusters) | $0 | 100% |
| Compute | ~$2,500/mo | ~$1,200/mo | 52% |
| Node Management | Manual effort | None | 100% |
| **Total** | **~$2,719/mo** | **~$1,200/mo** | **~56%** |

## IAM Policy Updates Required

Add to `github-actions-policy.json`:
```json
{
  "Sid": "ECSDeployment",
  "Effect": "Allow",
  "Action": [
    "ecs:DescribeServices",
    "ecs:DescribeTaskDefinition",
    "ecs:RegisterTaskDefinition",
    "ecs:UpdateService",
    "ecs:DescribeTasks",
    "ecs:ListTasks"
  ],
  "Resource": "*"
}
```

## Validation Checklist

Before implementing:
- [ ] Terraform plan shows expected changes
- [ ] ECS modules validate successfully
- [ ] IAM policies updated for ECS access
- [ ] GitHub secrets configured for each environment
- [ ] ALB listener rules prepared for new target groups
- [ ] Monitoring dashboards ready for ECS metrics

During migration:
- [ ] ECS cluster created successfully
- [ ] Task definitions registered
- [ ] Services reach RUNNING state
- [ ] Health checks passing
- [ ] Logs streaming to CloudWatch
- [ ] Auto-scaling tested

After migration:
- [ ] All services running on ECS
- [ ] Zero EKS resources remaining
- [ ] Cost reduction verified
- [ ] Documentation updated
- [ ] Runbooks created for operations

## Rollback Plan

If issues occur during migration:
1. Route traffic back to EKS via ALB
2. Scale up EKS node groups
3. Investigate ECS issues
4. Re-attempt migration after fixes

## Files Modified/Created

### Created:
- `docs/architecture/ecs-fargate-architecture.md`
- `docs/architecture/migration-summary.md`
- `infrastructure/terraform-aws/modules/ecs-cluster/main.tf`
- `infrastructure/terraform-aws/modules/ecs-cluster/variables.tf`
- `infrastructure/terraform-aws/modules/ecs-cluster/outputs.tf`
- `infrastructure/terraform-aws/modules/ecs-service/main.tf`
- `infrastructure/terraform-aws/modules/ecs-service/variables.tf`
- `infrastructure/terraform-aws/modules/ecs-service/outputs.tf`
- `.github/workflows/ecs-deploy.yml`

### To Be Modified (during implementation):
- `infrastructure/terraform-aws/main.tf` - Add ECS module calls
- `.github/workflows/unified-pipeline.yml` - Switch to ECS deploy
- `github-actions-policy.json` - Add ECS permissions

## Next Steps

1. **Review this plan** with team
2. **Add ECS permissions** to GitHub Actions IAM role
3. **Test ECS cluster** in dev environment first
4. **Migrate services** one at a time
5. **Validate thoroughly** before production
6. **Decommission EKS** after successful migration
