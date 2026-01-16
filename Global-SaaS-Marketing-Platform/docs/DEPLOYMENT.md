# Deployment Guide

## Global SaaS Marketing Platform

This guide provides comprehensive instructions for deploying the Global SaaS Marketing Platform across different environments.

## Prerequisites

### Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20 LTS | Runtime |
| pnpm | 8+ | Package manager |
| Docker | 24+ | Container runtime |
| AWS CLI | 2.x | AWS operations |
| kubectl | 1.29+ | Kubernetes CLI |
| helm | 3.13+ | Kubernetes package manager |
| terraform | 1.6+ | Infrastructure as Code |

### AWS Access

Ensure you have AWS credentials configured with appropriate permissions:

```bash
aws configure
# Or use AWS SSO
aws sso login --profile your-profile
```

## Environment Overview

| Environment | Purpose | AWS Region | Kubernetes Namespace |
|-------------|---------|------------|---------------------|
| Development | Local/testing | us-east-1 | marketing-platform-dev |
| Staging | Pre-production | us-east-1 | marketing-platform-staging |
| Production | Live workloads | us-east-1 (primary) | marketing-platform-prod |

## Infrastructure Deployment

### 1. Initialize Terraform Backend

First, create the S3 bucket and DynamoDB table for Terraform state:

```bash
# Create state bucket
aws s3api create-bucket \
  --bucket global-saas-marketing-platform-terraform-state \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket global-saas-marketing-platform-terraform-state \
  --versioning-configuration Status=Enabled

# Create lock table
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### 2. Configure Environment Variables

Copy the example tfvars file and fill in your values:

```bash
cd terraform/environments/<env>
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your actual values
```

### 3. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Review changes
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan
```

### 4. Configure kubectl

After EKS is deployed:

```bash
aws eks update-kubeconfig \
  --name marketing-platform-<env> \
  --region us-east-1
```

## Application Deployment

### 1. Build and Push Docker Images

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build all services
pnpm docker:build

# Push images (handled by CI/CD typically)
```

### 2. Deploy Kubernetes Resources

```bash
# Apply namespaces and RBAC
kubectl apply -f k8s/namespaces/namespaces.yaml
kubectl apply -f k8s/namespaces/resource-quotas.yaml
kubectl apply -f k8s/namespaces/limit-ranges.yaml
kubectl apply -f k8s/namespaces/network-policies.yaml
```

### 3. Deploy Services via Helm

```bash
# Update dependencies
helm dependency update terraform/helm/charts/saas-marketing-platform

# Deploy to environment
helm upgrade --install marketing-platform \
  terraform/helm/charts/saas-marketing-platform \
  -f terraform/helm/values/<env>.yaml \
  --namespace marketing-platform-<env> \
  --create-namespace \
  --wait
```

## Helm Values Configuration

### Global Settings

| Parameter | Description | Default |
|-----------|-------------|---------|
| `global.environment` | Environment name | - |
| `global.namespace` | Kubernetes namespace | - |
| `global.aws.region` | AWS region | us-east-1 |
| `global.aws.accountId` | AWS account ID | - |
| `global.imageRegistry` | Docker registry | ECR |
| `global.ingress.enabled` | Enable ingress | true |
| `global.ingress.className` | Ingress class | alb |
| `global.ingress.domain` | Base domain | - |

### Service Settings

Each service supports the following configuration:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `enabled` | Enable service | true |
| `replicaCount` | Number of replicas | varies |
| `image.tag` | Docker image tag | latest |
| `resources.limits` | Resource limits | varies |
| `resources.requests` | Resource requests | varies |
| `autoscaling.enabled` | Enable HPA | varies |
| `autoscaling.minReplicas` | Min replicas | 2 |
| `autoscaling.maxReplicas` | Max replicas | 10 |
| `podDisruptionBudget.enabled` | Enable PDB | true (prod) |
| `networkPolicy.enabled` | Enable network policy | true (prod) |

### Environment Differences

| Feature | Dev | Staging | Production |
|---------|-----|---------|------------|
| Replicas | 1 | 2 | 3+ |
| Autoscaling | Disabled | Enabled | Enabled |
| PDB | Disabled | Enabled | Enabled |
| Network Policies | Disabled | Enabled | Enabled |
| TLS | Optional | Required | Required |
| Resource Limits | Minimal | Moderate | Production-sized |

## Service Ports

| Service | Internal Port | Metrics Port |
|---------|---------------|--------------|
| seo-service | 3001 | 9090 |
| content-service | 3002 | 9090 |
| analytics-service | 3003 | 9090 |
| personalization-service | 3004 | 9090 |
| lifecycle-service | 3005 | 9090 |
| growth-service | 3006 | 9090 |
| commerce-service | 3007 | 9090 |
| reputation-service | 3008 | 9090 |
| localization-service | 3009 | 9090 |
| ai-service | 3010 | 9090 |
| community-service | 3011 | 9090 |

## Post-Deployment Verification

### 1. Check Pod Status

```bash
kubectl get pods -n marketing-platform-<env>
```

### 2. Verify Service Health

```bash
# Port-forward to a service
kubectl port-forward svc/seo-service 3001:3001 -n marketing-platform-<env>

# Check health endpoint
curl http://localhost:3001/health
```

### 3. Run Verification Suite

```bash
cd verification
npm install
npm run verify
npm run report
```

### 4. SEO Verification

```bash
# Check sitemap
curl https://<domain>/sitemap.xml

# Check robots.txt
curl https://<domain>/robots.txt

# Run SEO audit
pnpm seo:audit
```

## Rollback Procedures

### Helm Rollback

```bash
# List releases
helm history marketing-platform -n marketing-platform-<env>

# Rollback to previous version
helm rollback marketing-platform <revision> -n marketing-platform-<env>
```

### Terraform Rollback

```bash
# Show state history (if using S3 versioning)
aws s3api list-object-versions \
  --bucket global-saas-marketing-platform-terraform-state \
  --prefix <env>/terraform.tfstate

# Restore previous state version
aws s3api get-object \
  --bucket global-saas-marketing-platform-terraform-state \
  --key <env>/terraform.tfstate \
  --version-id <version-id> \
  terraform.tfstate

# Import state
terraform state push terraform.tfstate
```

## Troubleshooting

### Common Issues

**Pods not starting:**
```bash
kubectl describe pod <pod-name> -n marketing-platform-<env>
kubectl logs <pod-name> -n marketing-platform-<env>
```

**Database connection issues:**
- Verify security group rules
- Check IRSA role permissions
- Validate connection string in secrets

**ALB not provisioning:**
```bash
kubectl describe ingress -n marketing-platform-<env>
kubectl logs -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller
```

### Support

For issues, contact the platform team or create a ticket in the issue tracker.

## Security Checklist

Before production deployment:

- [ ] All secrets stored in AWS Secrets Manager
- [ ] IRSA roles configured for all services
- [ ] Network policies enabled
- [ ] WAF rules active
- [ ] CloudTrail enabled
- [ ] GuardDuty enabled
- [ ] TLS certificates valid
- [ ] No hardcoded credentials in code
- [ ] Pod security policies applied
