# The Unified Health - AWS Deployment Guide

**Domain:** thetheunifiedhealth.com
**Platform:** AWS (CodePipeline → CodeBuild → ECR → ECS Fargate)

> **Note:** This platform uses **ECS Fargate** (serverless containers), not EKS.

> **Related Documentation:**
> - [Full Deployment Guide](DEPLOYMENT.md) - Comprehensive ECS Fargate deployment
> - [Quick Start Deployment](QUICKSTART-DEPLOYMENT.md) - Get deployed in 60 minutes
> - [ECS Fargate Architecture](docs/architecture/ecs-fargate-architecture.md) - Target architecture

---

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.6.0
- GitHub account with repository access
- GoDaddy account (for domain nameserver configuration)

---

## Step 1: Push to GitHub

```bash
# Initialize git if not already done
cd Global-Healthcare-SaaS-Platform
git init

# Add remote (replace with your GitHub repo)
git remote add origin https://github.com/YOUR_ORG/the-unified-health.git

# Create .gitignore if needed
cat >> .gitignore << 'EOF'
node_modules/
.env
.env.local
*.tfstate
*.tfstate.backup
.terraform/
dist/
build/
EOF

# Stage all files
git add .

# Commit
git commit -m "Initial commit: The Unified Health Platform

- Complete healthcare SaaS platform
- AWS infrastructure (Terraform)
- CI/CD pipeline configuration
- Multi-region deployment (Americas, Europe, Africa)

🤖 Generated with Claude Code"

# Push to main branch
git push -u origin main
```

---

## Step 2: Create GitHub Connection in AWS

```bash
# Create CodeStar connection to GitHub (do this in AWS Console first)
# AWS Console → Developer Tools → Connections → Create connection
# Select GitHub, authorize, and note the Connection ARN

# Export the connection ARN
export GITHUB_CONNECTION_ARN="arn:aws:codestar-connections:us-east-1:992382449461:connection/YOUR_CONNECTION_ID"
```

---

## Step 3: Deploy AWS Infrastructure

### 3.1 Initialize Terraform

```bash
cd infrastructure/terraform-aws

# Initialize Terraform
terraform init

# Create terraform.tfvars
cat > terraform.tfvars << 'EOF'
# The Unified Health - Production Configuration
project_name = "unified-health"
environment  = "prod"

# Domain
domain_name = "thetheunifiedhealth.com"

# Region Deployment
deploy_americas = true
deploy_europe   = false  # Enable when ready
deploy_africa   = false  # Enable when ready

# EKS Configuration
eks_cluster_version    = "1.28"
eks_node_instance_types = ["m6i.large"]
eks_node_min_size      = 2
eks_node_max_size      = 10
eks_node_desired_size  = 3

# RDS Configuration
rds_engine_version        = "16.1"
rds_instance_class        = "db.r6g.large"
rds_backup_retention_days = 30

# ElastiCache Configuration
elasticache_node_type          = "cache.r6g.large"
elasticache_num_cache_clusters = 2

# GitHub Configuration
github_repository = "YOUR_ORG/the-unified-health"
github_branch     = "main"
EOF
```

### 3.2 Deploy Infrastructure

```bash
# Plan deployment
terraform plan -out=tfplan

# Apply (this will take ~30-45 minutes)
terraform apply tfplan

# Get outputs
terraform output
```

---

## Step 4: Get Route53 Nameservers for GoDaddy

After Terraform completes, get the nameservers:

```bash
# Get nameservers from Terraform output
terraform output route53_nameservers

# Or directly from AWS CLI
aws route53 get-hosted-zone --id $(terraform output -raw route53_zone_id) \
  --query 'DelegationSet.NameServers' --output text
```

**Expected Output (4 nameservers):**
```
ns-1234.awsdns-12.org
ns-567.awsdns-34.com
ns-890.awsdns-56.co.uk
ns-123.awsdns-78.net
```

---

## Step 5: Configure GoDaddy Nameservers

1. Log in to [GoDaddy](https://www.godaddy.com)
2. Go to **My Products** → **Domains** → **thetheunifiedhealth.com**
3. Click **DNS** → **Nameservers** → **Change**
4. Select **"I'll use my own nameservers"**
5. Enter the 4 AWS Route53 nameservers:
   ```
   ns-XXXX.awsdns-XX.org
   ns-XXX.awsdns-XX.com
   ns-XXX.awsdns-XX.co.uk
   ns-XXX.awsdns-XX.net
   ```
6. Click **Save**

**Note:** DNS propagation takes 24-48 hours globally.

---

## Step 6: Verify DNS Propagation

```bash
# Check nameserver delegation
dig NS thetheunifiedhealth.com

# Check A record (after ALB is created)
dig A thetheunifiedhealth.com

# Check from multiple locations
nslookup thetheunifiedhealth.com 8.8.8.8
nslookup thetheunifiedhealth.com 1.1.1.1
```

---

## Step 7: Trigger First Deployment

The pipeline will automatically trigger on push to main. To manually trigger:

```bash
# Using AWS CLI
aws codepipeline start-pipeline-execution \
  --name unified-health-prod-pipeline \
  --region us-east-1
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT FLOW                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐    ┌─────────────┐    ┌──────────┐    ┌───────────┐  │
│  │  GitHub  │───▶│ CodePipeline│───▶│ CodeBuild│───▶│    ECR    │  │
│  │  (Push)  │    │  (Source)   │    │  (Build) │    │  (Image)  │  │
│  └──────────┘    └─────────────┘    └──────────┘    └─────┬─────┘  │
│                                                           │         │
│                                                           ▼         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                         Amazon EKS                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │  │
│  │  │   Web App    │  │  API Service │  │  Auth Service│        │  │
│  │  │   (Next.js)  │  │  (Express)   │  │  (Express)   │        │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │  │
│  │         │                 │                 │                 │  │
│  │         └────────────┬────┴─────────────────┘                 │  │
│  │                      ▼                                        │  │
│  │              ┌───────────────┐                                │  │
│  │              │  Ingress/ALB  │                                │  │
│  │              └───────┬───────┘                                │  │
│  └──────────────────────┼───────────────────────────────────────┘  │
│                         │                                          │
│                         ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      CloudFront                               │  │
│  │                    (CDN + SSL)                                │  │
│  └──────────────────────┬───────────────────────────────────────┘  │
│                         │                                          │
│                         ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                       Route53                                 │  │
│  │               thetheunifiedhealth.com                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## DNS Records Created

| Record | Type | Value | Purpose |
|--------|------|-------|---------|
| thetheunifiedhealth.com | A | ALB DNS | Main website |
| www.thetheunifiedhealth.com | CNAME | thetheunifiedhealth.com | WWW redirect |
| api.thetheunifiedhealth.com | A | ALB DNS | API endpoint |
| app.thetheunifiedhealth.com | A | ALB DNS | Patient portal |
| admin.thetheunifiedhealth.com | A | ALB DNS | Admin portal |
| provider.thetheunifiedhealth.com | A | ALB DNS | Provider portal |

---

## SSL Certificates

ACM (AWS Certificate Manager) will automatically provision SSL certificates for:
- `thetheunifiedhealth.com`
- `*.thetheunifiedhealth.com` (wildcard)

Validation is done via DNS (Route53 automatically adds validation records).

---

## Monitoring & Logs

```bash
# View CodePipeline status
aws codepipeline get-pipeline-state --name unified-health-prod-pipeline

# View CodeBuild logs
aws logs tail /aws/codebuild/unified-health-prod-web-app-build --follow

# View EKS pod logs
kubectl logs -f deployment/web-app -n unified-health

# CloudWatch Dashboard
# https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:
```

---

## Troubleshooting

### Pipeline Failed
```bash
# Check CodeBuild logs
aws codebuild batch-get-builds --ids $(aws codebuild list-builds-for-project \
  --project-name unified-health-prod-web-app-build \
  --max-items 1 --query 'ids[0]' --output text)
```

### DNS Not Resolving
```bash
# Check Route53 hosted zone
aws route53 list-resource-record-sets --hosted-zone-id YOUR_ZONE_ID

# Verify nameservers at GoDaddy match Route53
dig NS thetheunifiedhealth.com +short
```

### EKS Deployment Issues
```bash
# Get pod status
kubectl get pods -n unified-health

# Describe failing pod
kubectl describe pod POD_NAME -n unified-health

# Check service
kubectl get svc -n unified-health
```

---

## Cost Estimate (Monthly)

| Service | Configuration | Estimated Cost |
|---------|--------------|----------------|
| EKS | 1 cluster | $73 |
| EC2 (nodes) | 3x m6i.large | $234 |
| RDS | db.r6g.large (Multi-AZ) | $350 |
| ElastiCache | 2x cache.r6g.large | $260 |
| ALB | 1 load balancer | $25 |
| Route53 | 1 hosted zone | $0.50 |
| CloudFront | ~100GB transfer | $15 |
| ECR | ~10GB storage | $1 |
| CodePipeline | 1 pipeline | $1 |
| **Total** | | **~$960/month** |

---

## Security Checklist

- [x] HIPAA-compliant infrastructure
- [x] Data encrypted at rest (RDS, EBS, S3)
- [x] Data encrypted in transit (TLS 1.3)
- [x] VPC with private subnets
- [x] WAF enabled on ALB
- [x] CloudTrail logging enabled
- [x] Route53 query logging (HIPAA audit)
- [x] Secrets in AWS Secrets Manager

---

## Support

For issues or questions:
- **Email:** support@thetheunifiedhealth.com
- **Documentation:** https://docs.thetheunifiedhealth.com
