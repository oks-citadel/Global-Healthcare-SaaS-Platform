# Terraform AWS Infrastructure - Unified Healthcare Platform

This directory contains Terraform configurations for deploying the Unified Healthcare Platform infrastructure on Amazon Web Services (AWS).

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Module Documentation](#module-documentation)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Multi-Region Deployment](#multi-region-deployment)
- [State Management](#state-management)
- [Security](#security)
- [Compliance](#compliance)
- [Troubleshooting](#troubleshooting)

## Overview

This Terraform configuration provides a complete AWS infrastructure deployment including:

- **Amazon EKS**: Managed Kubernetes clusters for container orchestration
- **Amazon ECR**: Container registry with cross-region replication
- **Amazon RDS**: PostgreSQL databases with Multi-AZ deployment
- **Amazon ElastiCache**: Redis clusters for caching and session management
- **Amazon S3**: Object storage for documents and media
- **AWS Secrets Manager**: Secure secrets management
- **Amazon Route 53**: DNS management and health checks
- **Amazon CloudFront**: Global CDN for static content
- **AWS ALB**: Application load balancing
- **VPC**: Isolated networking with public/private subnets

## Architecture

```
                                 ┌─────────────────────────────────────────────┐
                                 │              Amazon Route 53                │
                                 │         (Global DNS & Health Checks)        │
                                 └──────────────────────┬──────────────────────┘
                                                        │
        ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
        │                                               │                                               │
        ▼                                               ▼                                               ▼
┌───────────────────┐                       ┌───────────────────┐                       ┌───────────────────┐
│   Americas        │                       │   Europe          │                       │   Africa          │
│   (us-east-1)     │                       │   (eu-west-1)     │                       │   (af-south-1)    │
├───────────────────┤                       ├───────────────────┤                       ├───────────────────┤
│ ┌───────────────┐ │                       │ ┌───────────────┐ │                       │ ┌───────────────┐ │
│ │  CloudFront   │ │                       │ │  CloudFront   │ │                       │ │  CloudFront   │ │
│ └───────┬───────┘ │                       │ └───────┬───────┘ │                       │ └───────┬───────┘ │
│         ▼         │                       │         ▼         │                       │         ▼         │
│ ┌───────────────┐ │                       │ ┌───────────────┐ │                       │ ┌───────────────┐ │
│ │     ALB       │ │                       │ │     ALB       │ │                       │ │     ALB       │ │
│ └───────┬───────┘ │                       │ └───────┬───────┘ │                       │ └───────┬───────┘ │
│         ▼         │                       │         ▼         │                       │         ▼         │
│ ┌───────────────┐ │                       │ ┌───────────────┐ │                       │ ┌───────────────┐ │
│ │   EKS Cluster │ │                       │ │   EKS Cluster │ │                       │ │   EKS Cluster │ │
│ │   (3+ nodes)  │ │                       │ │   (3+ nodes)  │ │                       │ │   (3+ nodes)  │ │
│ └───────┬───────┘ │                       │ └───────┬───────┘ │                       │ └───────┬───────┘ │
│         │         │                       │         │         │                       │         │         │
│    ┌────┴────┐    │                       │    ┌────┴────┐    │                       │    ┌────┴────┐    │
│    ▼         ▼    │                       │    ▼         ▼    │                       │    ▼         ▼    │
│ ┌─────┐  ┌─────┐  │                       │ ┌─────┐  ┌─────┐  │                       │ ┌─────┐  ┌─────┐  │
│ │ RDS │  │Redis│  │                       │ │ RDS │  │Redis│  │                       │ │ RDS │  │Redis│  │
│ └─────┘  └─────┘  │                       │ └─────┘  └─────┘  │                       │ └─────┘  └─────┘  │
└───────────────────┘                       └───────────────────┘                       └───────────────────┘
        │                                               │                                               │
        └───────────────────────────────────────────────┼───────────────────────────────────────────────┘
                                                        │
                                 ┌──────────────────────┴──────────────────────┐
                                 │              Amazon ECR                      │
                                 │     (Container Registry with Replication)    │
                                 └─────────────────────────────────────────────┘
```

## Prerequisites

### Required Tools

1. **Terraform** (v1.5.0+)
   ```bash
   terraform version
   ```

2. **AWS CLI** (v2.0+)
   ```bash
   aws --version
   ```

3. **kubectl** (v1.27+)
   ```bash
   kubectl version --client
   ```

4. **eksctl** (v0.150+)
   ```bash
   eksctl version
   ```

### AWS Account Setup

1. **AWS Account**: Active AWS account with appropriate permissions
2. **IAM User/Role**: User or role with permissions to create:
   - VPC and networking resources
   - EKS clusters
   - RDS instances
   - ElastiCache clusters
   - S3 buckets
   - IAM roles and policies
   - Secrets Manager secrets
   - Route 53 hosted zones
   - CloudFront distributions
   - KMS keys

3. **AWS CLI Configuration**:
   ```bash
   aws configure
   # Or for SSO:
   aws configure sso
   ```

### S3 Backend Setup

Create an S3 bucket and DynamoDB table for Terraform state:

```bash
# Create S3 bucket for state
aws s3api create-bucket \
  --bucket unified-health-terraform-state \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket unified-health-terraform-state \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket unified-health-terraform-state \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms"
      }
    }]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket unified-health-terraform-state \
  --public-access-block-configuration '{
    "BlockPublicAcls": true,
    "IgnorePublicAcls": true,
    "BlockPublicPolicy": true,
    "RestrictPublicBuckets": true
  }'

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name unified-health-terraform-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

## Module Documentation

### VPC Module (`modules/vpc`)

Creates a VPC with public, private, database, and ElastiCache subnets across multiple Availability Zones.

**Inputs:**

| Name | Description | Type | Default |
|------|-------------|------|---------|
| `project_name` | Name of the project | `string` | - |
| `environment` | Environment (dev, staging, prod) | `string` | - |
| `region_name` | Region identifier | `string` | - |
| `vpc_cidr` | CIDR block for VPC | `string` | - |
| `availability_zones` | List of AZs | `list(string)` | - |
| `public_subnet_cidrs` | Public subnet CIDRs | `list(string)` | - |
| `private_subnet_cidrs` | Private subnet CIDRs | `list(string)` | - |
| `database_subnet_cidrs` | Database subnet CIDRs | `list(string)` | - |
| `elasticache_subnet_cidrs` | ElastiCache subnet CIDRs | `list(string)` | - |
| `enable_nat_gateway` | Enable NAT Gateway | `bool` | `true` |
| `enable_flow_logs` | Enable VPC Flow Logs | `bool` | `true` |
| `enable_vpc_endpoints` | Enable VPC Endpoints | `bool` | `true` |

**Outputs:**

| Name | Description |
|------|-------------|
| `vpc_id` | VPC ID |
| `public_subnet_ids` | List of public subnet IDs |
| `private_subnet_ids` | List of private subnet IDs |
| `db_subnet_group_name` | Database subnet group name |
| `elasticache_subnet_ids` | List of ElastiCache subnet IDs |

---

### EKS Module (`modules/eks`)

Creates an EKS cluster with managed node groups, IRSA support, and add-ons.

**Inputs:**

| Name | Description | Type | Default |
|------|-------------|------|---------|
| `project_name` | Name of the project | `string` | - |
| `environment` | Environment (dev, staging, prod) | `string` | - |
| `region_name` | Region identifier | `string` | - |
| `vpc_id` | VPC ID | `string` | - |
| `subnet_ids` | List of subnet IDs for nodes | `list(string)` | - |
| `cluster_version` | Kubernetes version | `string` | `"1.29"` |
| `system_node_instance_types` | System node instance types | `list(string)` | `["m6i.large"]` |
| `app_node_instance_types` | Application node instance types | `list(string)` | `["m6i.xlarge"]` |
| `app_node_min_size` | Minimum application nodes | `number` | `2` |
| `app_node_max_size` | Maximum application nodes | `number` | `10` |
| `app_node_desired_size` | Desired application nodes | `number` | `3` |

**Outputs:**

| Name | Description |
|------|-------------|
| `cluster_name` | EKS cluster name |
| `cluster_endpoint` | EKS cluster API endpoint |
| `cluster_certificate_authority_data` | Base64 encoded CA certificate |
| `node_security_group_id` | Node security group ID |
| `oidc_provider_arn` | OIDC provider ARN for IRSA |

---

### ECR Module (`modules/ecr`)

Creates ECR repositories with cross-region replication and image scanning.

**Inputs:**

| Name | Description | Type | Default |
|------|-------------|------|---------|
| `project_name` | Name of the project | `string` | - |
| `environment` | Environment (dev, staging, prod) | `string` | - |
| `repository_names` | List of repository names | `list(string)` | - |
| `replication_regions` | Regions to replicate images to | `list(string)` | `[]` |

**Outputs:**

| Name | Description |
|------|-------------|
| `repository_urls` | Map of repository names to URLs |

---

### RDS Module (`modules/rds`)

Creates an RDS PostgreSQL instance or Aurora cluster with Multi-AZ.

**Inputs:**

| Name | Description | Type | Default |
|------|-------------|------|---------|
| `project_name` | Name of the project | `string` | - |
| `environment` | Environment (dev, staging, prod) | `string` | - |
| `region_name` | Region identifier | `string` | - |
| `vpc_id` | VPC ID | `string` | - |
| `db_subnet_group_name` | Database subnet group | `string` | - |
| `allowed_security_group_id` | Security group allowed to access | `string` | - |
| `engine_version` | PostgreSQL version | `string` | `"15.4"` |
| `instance_class` | RDS instance class | `string` | `"db.r6g.large"` |
| `backup_retention_days` | Backup retention period | `number` | `35` |
| `deletion_protection` | Enable deletion protection | `bool` | `true` |

**Outputs:**

| Name | Description |
|------|-------------|
| `cluster_endpoint` | RDS cluster endpoint |
| `reader_endpoint` | RDS reader endpoint |
| `cluster_identifier` | RDS cluster identifier |

---

### ElastiCache Module (`modules/elasticache`)

Creates an ElastiCache Redis cluster with Multi-AZ failover.

**Inputs:**

| Name | Description | Type | Default |
|------|-------------|------|---------|
| `project_name` | Name of the project | `string` | - |
| `environment` | Environment (dev, staging, prod) | `string` | - |
| `region_name` | Region identifier | `string` | - |
| `vpc_id` | VPC ID | `string` | - |
| `subnet_ids` | List of subnet IDs | `list(string)` | - |
| `allowed_security_group_id` | Security group allowed to access | `string` | - |
| `node_type` | ElastiCache node type | `string` | `"cache.r6g.large"` |
| `num_cache_clusters` | Number of cache clusters | `number` | `2` |

**Outputs:**

| Name | Description |
|------|-------------|
| `primary_endpoint` | ElastiCache primary endpoint |
| `reader_endpoint` | ElastiCache reader endpoint |
| `replication_group_id` | Replication group ID |

---

### Secrets Manager Module (`modules/secrets-manager`)

Creates and manages secrets in AWS Secrets Manager.

**Inputs:**

| Name | Description | Type | Default |
|------|-------------|------|---------|
| `project_name` | Name of the project | `string` | - |
| `environment` | Environment (dev, staging, prod) | `string` | - |
| `secrets` | Map of secret names and values | `map(string)` | - |
| `recovery_window_in_days` | Recovery window for deletion | `number` | `7` |

**Outputs:**

| Name | Description |
|------|-------------|
| `secret_arns` | Map of secret names to ARNs |

---

### CloudFront Module (`modules/cloudfront`)

Creates a CloudFront distribution for static content delivery.

**Inputs:**

| Name | Description | Type | Default |
|------|-------------|------|---------|
| `project_name` | Name of the project | `string` | - |
| `environment` | Environment (dev, staging, prod) | `string` | - |
| `origin_domain_name` | Origin domain (ALB or S3) | `string` | - |
| `acm_certificate_arn` | ACM certificate ARN | `string` | - |
| `aliases` | Domain aliases | `list(string)` | `[]` |
| `price_class` | CloudFront price class | `string` | `"PriceClass_All"` |

**Outputs:**

| Name | Description |
|------|-------------|
| `distribution_id` | CloudFront distribution ID |
| `distribution_domain_name` | CloudFront domain name |

---

### ALB Module (`modules/alb`)

Creates an Application Load Balancer for the EKS cluster.

**Inputs:**

| Name | Description | Type | Default |
|------|-------------|------|---------|
| `project_name` | Name of the project | `string` | - |
| `environment` | Environment (dev, staging, prod) | `string` | - |
| `vpc_id` | VPC ID | `string` | - |
| `public_subnet_ids` | List of public subnet IDs | `list(string)` | - |
| `acm_certificate_arn` | ACM certificate ARN | `string` | - |
| `enable_waf` | Enable AWS WAF | `bool` | `true` |

**Outputs:**

| Name | Description |
|------|-------------|
| `alb_arn` | ALB ARN |
| `alb_dns_name` | ALB DNS name |
| `target_group_arn` | Default target group ARN |

## Quick Start

### 1. Clone and Navigate

```bash
cd infrastructure/terraform-aws
```

### 2. Initialize Terraform

```bash
terraform init \
  -backend-config="bucket=unified-health-terraform-state" \
  -backend-config="key=unified-health/dev/terraform.tfstate" \
  -backend-config="region=us-east-1" \
  -backend-config="dynamodb_table=unified-health-terraform-lock"
```

### 3. Create Variable File

Create `terraform.tfvars`:

```hcl
# Core Configuration
project_name = "unified-health"
environment  = "dev"
aws_region   = "us-east-1"

# Multi-Region Deployment
deploy_americas = true
deploy_europe   = true
deploy_africa   = true

# EKS Configuration
eks_cluster_version    = "1.29"
eks_node_instance_types = ["m6i.xlarge", "m6i.2xlarge"]
eks_node_min_size      = 2
eks_node_max_size      = 10
eks_node_desired_size  = 3

# RDS Configuration
rds_engine_version        = "15.4"
rds_instance_class        = "db.r6g.large"
rds_backup_retention_days = 35

# ElastiCache Configuration
elasticache_node_type          = "cache.r6g.large"
elasticache_num_cache_clusters = 2

# Compliance
compliance_standards    = ["HIPAA", "SOC2", "ISO27001"]
data_residency_required = true

# Monitoring
alert_email              = "ops@unifiedhealth.example.com"
enable_enhanced_monitoring = true
cloudwatch_retention_days  = 90
```

### 4. Plan and Apply

```bash
# Review planned changes
terraform plan -var-file="terraform.tfvars"

# Apply changes
terraform apply -var-file="terraform.tfvars"
```

### 5. Configure kubectl

```bash
# Get cluster credentials
aws eks update-kubeconfig \
  --region us-east-1 \
  --name $(terraform output -raw americas_eks_cluster_name)
```

## Environment Setup

### Development Environment

```bash
# Initialize with dev backend
terraform init \
  -backend-config="key=unified-health/dev/terraform.tfstate"

# Apply with dev variables
terraform apply -var-file="environments/dev.tfvars"
```

### Staging Environment

```bash
# Initialize with staging backend
terraform init \
  -backend-config="key=unified-health/staging/terraform.tfstate"

# Apply with staging variables
terraform apply -var-file="environments/staging.tfvars"
```

### Production Environment

```bash
# Initialize with prod backend
terraform init \
  -backend-config="key=unified-health/prod/terraform.tfstate"

# Apply with prod variables
terraform apply -var-file="environments/prod.tfvars"
```

## Multi-Region Deployment

### Deploy to All Regions

```hcl
# terraform.tfvars
deploy_americas = true
deploy_europe   = true
deploy_africa   = true
```

### Deploy to Specific Region

```hcl
# terraform.tfvars - Americas only
deploy_americas = true
deploy_europe   = false
deploy_africa   = false
```

### Region-Specific Configuration

Each region has specific compliance requirements:

| Region | AWS Region | Compliance Standards |
|--------|------------|---------------------|
| Americas | us-east-1 | HIPAA, SOC2, ISO27001 |
| Europe | eu-west-1 | GDPR, ISO27001, SOC2 |
| Africa | af-south-1 | POPIA, ISO27001, SOC2 |

### Cross-Region Outputs

```bash
# Get all region outputs
terraform output

# Get specific region outputs
terraform output americas_eks_cluster_endpoint
terraform output europe_rds_endpoint
terraform output africa_redis_endpoint
```

## State Management

### Remote State Configuration

The backend is configured in `backend.tf`:

```hcl
terraform {
  backend "s3" {
    bucket         = "unified-health-terraform-state"
    key            = "unified-health/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "unified-health-terraform-lock"
  }
}
```

### State Locking

State locking is automatically handled by DynamoDB. If a lock is stuck:

```bash
# Force unlock (use with caution!)
terraform force-unlock <lock-id>
```

### State Migration

To migrate state between backends:

```bash
# Initialize new backend
terraform init -migrate-state
```

## Security

### IAM Best Practices

1. Use IAM roles with minimal permissions
2. Enable MFA for IAM users
3. Rotate access keys regularly
4. Use IRSA for pod-level AWS access

### Network Security

1. VPC isolation with private subnets
2. Security groups with least privilege
3. Network ACLs for subnet-level control
4. VPC Flow Logs for monitoring

### Encryption

1. KMS encryption for all data at rest
2. TLS 1.2+ for data in transit
3. Secrets Manager for sensitive data
4. EBS encryption for node volumes

### Drift Detection

The `modules/drift-detection` module provides:

```bash
# Check for configuration drift
terraform plan -detailed-exitcode

# Exit codes:
# 0 - No changes
# 1 - Error
# 2 - Changes detected (drift)
```

## Compliance

### HIPAA Compliance

- Encryption at rest (KMS)
- Encryption in transit (TLS)
- Audit logging (CloudTrail)
- Access controls (IAM)
- Data backup (35 days retention)

### GDPR Compliance

- Data residency (eu-west-1)
- Data encryption
- Right to erasure support
- Audit logging
- Consent management

### POPIA Compliance

- Data residency (af-south-1)
- Data encryption
- Access controls
- Audit logging

## Troubleshooting

### Common Issues

#### EKS Node Not Joining

```bash
# Check node status
kubectl get nodes

# Check EKS cluster status
aws eks describe-cluster --name <cluster-name>

# Check node group status
aws eks describe-nodegroup --cluster-name <cluster-name> --nodegroup-name <nodegroup-name>
```

#### RDS Connection Issues

```bash
# Test connectivity
nc -zv <rds-endpoint> 5432

# Check security groups
aws ec2 describe-security-groups --group-ids <sg-id>
```

#### Terraform State Issues

```bash
# Refresh state
terraform refresh

# Import existing resources
terraform import aws_instance.example i-1234567890abcdef0
```

### Useful Commands

```bash
# View all outputs
terraform output

# Show specific resource
terraform state show aws_eks_cluster.main

# List all resources
terraform state list

# Destroy specific resource
terraform destroy -target=aws_eks_cluster.main
```

## Directory Structure

```
infrastructure/terraform-aws/
├── main.tf                 # Main configuration
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── providers.tf            # Provider configuration
├── backend.tf              # Backend configuration
├── versions.tf             # Version constraints
├── modules/
│   ├── vpc/               # VPC module
│   ├── eks/               # EKS module
│   ├── ecr/               # ECR module
│   ├── rds/               # RDS module
│   ├── elasticache/       # ElastiCache module
│   ├── secrets-manager/   # Secrets Manager module
│   ├── cloudfront/        # CloudFront module
│   ├── alb/               # ALB module
│   └── drift-detection/   # Drift detection module
├── environments/
│   ├── dev.tfvars         # Development variables
│   ├── staging.tfvars     # Staging variables
│   └── prod.tfvars        # Production variables
└── README.md              # This file
```

## Support

For issues or questions:
- Email: devops@thetheunifiedhealth.com
- Slack: #unified-health-platform
- Documentation: https://docs.thetheunifiedhealth.com

---

**Last Updated**: 2025-12-29
**Version**: 2.0.0
