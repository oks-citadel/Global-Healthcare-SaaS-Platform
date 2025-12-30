# GitHub Actions Workflows

## Active Workflows

### Web Frontend - Build & Deploy (`web-frontend-deploy.yml`)

Primary CI/CD workflow for the UnifiedHealth Platform.

**Triggers:**
- Push to `main` branch (paths: `apps/web/**`, `packages/sdk/**`)
- Manual workflow dispatch

**Jobs:**
1. **Build** - Builds SDK and web frontend, pushes to Amazon ECR
2. **Security Scan** - Runs Trivy vulnerability scanner
3. **Deploy to EKS** - Optional deployment to Amazon EKS
4. **Notify** - Posts build status summary

### Terraform AWS (`terraform-aws.yml`)

Infrastructure deployment workflow for AWS resources.

**Triggers:**
- Push/PR to `main` or `develop` (paths: `infrastructure/terraform-aws/**`)
- Manual workflow dispatch

**Jobs:**
1. **AWS Provider Check** - Validates AWS-only infrastructure
2. **Validate** - Terraform format and validation
3. **Plan** - Generate Terraform plan per environment
4. **Apply** - Apply infrastructure changes (with approval gates)

### Terraform Drift Check (`terraform-drift-check.yml`)

Scheduled infrastructure drift detection.

**Triggers:**
- Every 6 hours (cron schedule)
- Manual workflow dispatch

### AWS Provider Check (`aws-provider-check.yml`)

Ensures AWS-only infrastructure configuration.

**Triggers:**
- Push/PR to `main` or `develop`

### Security Check (`security-check.yml`)

PR-gated security verification.

**Triggers:**
- Pull requests to `main` or `develop`
- Push to `main` or `develop`

### Test Actions (`test-actions.yml`)

Simple workflow for testing GitHub Actions configuration.

## Required Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key ID |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key |
| `AWS_REGION` | AWS region (e.g., us-east-1) |
| `ECR_REGISTRY` | ECR registry URL (account.dkr.ecr.region.amazonaws.com) |
| `EKS_CLUSTER_NAME` | EKS cluster name |
| `AWS_ROLE_ARN_DEV` | IAM role ARN for dev environment (OIDC) |
| `AWS_ROLE_ARN_STAGING` | IAM role ARN for staging environment (OIDC) |
| `AWS_ROLE_ARN_PROD` | IAM role ARN for prod environment (OIDC) |
| `TF_STATE_BUCKET` | S3 bucket for Terraform state |
| `TF_LOCK_TABLE` | DynamoDB table for Terraform state locking |
| `SLACK_WEBHOOK_URL` | Slack notifications (optional) |

## AWS Resources

| Resource | Description |
|----------|-------------|
| ECR Registry | Container image registry |
| EKS Cluster | Kubernetes cluster for deployments |
| S3 Bucket | Terraform state storage |
| DynamoDB Table | Terraform state locking |

## Manual Deployment

```bash
gh workflow run "Web Frontend - Build & Deploy" \
  --field deploy_to_eks=true \
  --field environment=production
```

## Terraform Operations

```bash
# Run Terraform plan for dev
gh workflow run "Terraform AWS" \
  --field environment=dev \
  --field action=plan

# Run Terraform apply for dev (requires approval)
gh workflow run "Terraform AWS" \
  --field environment=dev \
  --field action=apply
```

## Troubleshooting

```bash
# View workflow runs
gh run list --workflow="Web Frontend - Build & Deploy"

# View logs
gh run view <run-id> --log

# Check EKS status
aws eks update-kubeconfig --name <cluster-name> --region <region>
kubectl get pods -n unifiedhealth-dev
```
