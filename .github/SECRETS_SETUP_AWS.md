# AWS GitHub Secrets Setup Guide

This guide provides comprehensive instructions for configuring GitHub Actions secrets for AWS deployment of the UnifiedHealth Platform. We use OIDC Federation for secure, credential-less authentication.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Required GitHub Secrets](#required-github-secrets)
- [IAM Role Setup for OIDC](#iam-role-setup-for-oidc)
- [Step-by-Step Setup](#step-by-step-setup)
- [Environment-Specific Configuration](#environment-specific-configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

## Overview

For secure AWS access from GitHub Actions, we use **OIDC (OpenID Connect) Federation** instead of long-lived AWS access keys. This approach:

- Eliminates the need to store AWS credentials as GitHub secrets
- Provides short-lived credentials that automatically expire
- Enables fine-grained access control per environment/branch
- Follows AWS and GitHub security best practices
- Supports audit logging through AWS CloudTrail

## Prerequisites

- AWS Account with administrative access
- GitHub repository with Actions enabled
- AWS CLI v2 installed locally
- Terraform state S3 bucket created
- GitHub CLI (optional, for easier secret management)

---

## Required GitHub Secrets

### Core AWS Secrets (Required)

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ROLE_ARN_DEV` | IAM Role ARN for development environment | `arn:aws:iam::123456789012:role/github-actions-unified-health-dev` |
| `AWS_ROLE_ARN_STAGING` | IAM Role ARN for staging environment | `arn:aws:iam::123456789012:role/github-actions-unified-health-staging` |
| `AWS_ROLE_ARN_PROD` | IAM Role ARN for production environment | `arn:aws:iam::123456789012:role/github-actions-unified-health-prod` |
| `TF_STATE_BUCKET` | S3 bucket for Terraform state | `unified-health-terraform-state` |
| `TF_LOCK_TABLE` | DynamoDB table for state locking | `unified-health-terraform-locks` |

### Secret Descriptions

#### AWS_ROLE_ARN_DEV

The IAM role ARN that GitHub Actions will assume for development environment deployments. This role should have permissions for:
- EKS cluster management
- ECR image push/pull
- Terraform state access
- Development resource creation

#### AWS_ROLE_ARN_STAGING

The IAM role ARN for staging environment deployments. Similar permissions to dev, but scoped to staging resources. Consider:
- Requiring approval for deployments
- More restrictive resource access

#### AWS_ROLE_ARN_PROD

The IAM role ARN for production environment deployments. This role should have the most restrictive access:
- Only deployable from `main` branch
- Require multiple approvals
- Limited to essential production operations
- Read-only access where possible

#### TF_STATE_BUCKET

The S3 bucket name storing Terraform state files. This bucket should have:
- Versioning enabled
- Encryption at rest (SSE-S3 or SSE-KMS)
- Public access blocked
- Access logging enabled

#### TF_LOCK_TABLE

The DynamoDB table name used for Terraform state locking. Prevents concurrent modifications to infrastructure.

### Optional Secrets

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `AWS_REGION` | Default AWS region | `us-east-1` |
| `SLACK_WEBHOOK_URL` | Slack notifications | Slack App settings |
| `PAGERDUTY_ROUTING_KEY` | PagerDuty alerts | PagerDuty console |

---

## IAM Role Setup for OIDC

---

## Step-by-Step Setup

### Step 1: Create S3 Bucket for Terraform State

```bash
# Set variables
AWS_REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
STATE_BUCKET="unified-health-terraform-state-${ACCOUNT_ID}"

# Create S3 bucket
aws s3api create-bucket \
  --bucket "${STATE_BUCKET}" \
  --region "${AWS_REGION}"

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket "${STATE_BUCKET}" \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket "${STATE_BUCKET}" \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }
    ]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket "${STATE_BUCKET}" \
  --public-access-block-configuration '{
    "BlockPublicAcls": true,
    "IgnorePublicAcls": true,
    "BlockPublicPolicy": true,
    "RestrictPublicBuckets": true
  }'

echo "Created Terraform state bucket: ${STATE_BUCKET}"
```

### Step 2: Create DynamoDB Table for State Locking

```bash
LOCK_TABLE="unified-health-terraform-locks"

aws dynamodb create-table \
  --table-name "${LOCK_TABLE}" \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "${AWS_REGION}"

echo "Created DynamoDB lock table: ${LOCK_TABLE}"
```

### Step 3: Create OIDC Identity Provider for GitHub

```bash
# Get GitHub's OIDC thumbprint
THUMBPRINT="6938fd4d98bab03faadb97b34396831e3780aea1"

# Create OIDC provider
aws iam create-open-id-connect-provider \
  --url "https://token.actions.githubusercontent.com" \
  --client-id-list "sts.amazonaws.com" \
  --thumbprint-list "${THUMBPRINT}"

echo "Created GitHub OIDC provider"
```

### Step 4: Create IAM Roles for Each Environment

#### Trust Policy Template

Create a file `trust-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:environment:ENVIRONMENT"
        }
      }
    }
  ]
}
```

#### Create Dev Role

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
GITHUB_ORG="your-org"
GITHUB_REPO="Global-Healthcare-SaaS-Platform"

# Create trust policy for dev
cat > trust-policy-dev.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_ORG}/${GITHUB_REPO}:environment:dev"
        }
      }
    }
  ]
}
EOF

# Create the role
aws iam create-role \
  --role-name "github-actions-unified-health-dev" \
  --assume-role-policy-document file://trust-policy-dev.json \
  --description "GitHub Actions role for UnifiedHealth dev environment"

# Attach necessary policies
aws iam attach-role-policy \
  --role-name "github-actions-unified-health-dev" \
  --policy-arn "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"

aws iam attach-role-policy \
  --role-name "github-actions-unified-health-dev" \
  --policy-arn "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"

echo "Created dev role: arn:aws:iam::${ACCOUNT_ID}:role/github-actions-unified-health-dev"
```

#### Create Staging Role

```bash
# Create trust policy for staging
cat > trust-policy-staging.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_ORG}/${GITHUB_REPO}:environment:staging"
        }
      }
    }
  ]
}
EOF

aws iam create-role \
  --role-name "github-actions-unified-health-staging" \
  --assume-role-policy-document file://trust-policy-staging.json \
  --description "GitHub Actions role for UnifiedHealth staging environment"

aws iam attach-role-policy \
  --role-name "github-actions-unified-health-staging" \
  --policy-arn "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"

aws iam attach-role-policy \
  --role-name "github-actions-unified-health-staging" \
  --policy-arn "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"

echo "Created staging role: arn:aws:iam::${ACCOUNT_ID}:role/github-actions-unified-health-staging"
```

#### Create Production Role

```bash
# Create trust policy for prod (more restrictive)
cat > trust-policy-prod.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_ORG}/${GITHUB_REPO}:environment:prod"
        }
      }
    }
  ]
}
EOF

aws iam create-role \
  --role-name "github-actions-unified-health-prod" \
  --assume-role-policy-document file://trust-policy-prod.json \
  --description "GitHub Actions role for UnifiedHealth production environment"

# Attach read-only policies for prod (apply should be manual)
aws iam attach-role-policy \
  --role-name "github-actions-unified-health-prod" \
  --policy-arn "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"

aws iam attach-role-policy \
  --role-name "github-actions-unified-health-prod" \
  --policy-arn "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"

echo "Created prod role: arn:aws:iam::${ACCOUNT_ID}:role/github-actions-unified-health-prod"
```

### Step 5: Create Custom IAM Policy for Terraform

```bash
cat > terraform-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "TerraformStateAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::${STATE_BUCKET}",
        "arn:aws:s3:::${STATE_BUCKET}/*"
      ]
    },
    {
      "Sid": "TerraformLockAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:${AWS_REGION}:${ACCOUNT_ID}:table/${LOCK_TABLE}"
    },
    {
      "Sid": "EKSFullAccess",
      "Effect": "Allow",
      "Action": [
        "eks:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECRFullAccess",
      "Effect": "Allow",
      "Action": [
        "ecr:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "VPCNetworkingAccess",
      "Effect": "Allow",
      "Action": [
        "ec2:*Vpc*",
        "ec2:*Subnet*",
        "ec2:*SecurityGroup*",
        "ec2:*RouteTable*",
        "ec2:*InternetGateway*",
        "ec2:*NatGateway*",
        "ec2:*Address*",
        "ec2:*NetworkInterface*",
        "ec2:*FlowLogs*",
        "ec2:Describe*",
        "ec2:CreateTags",
        "ec2:DeleteTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "RDSAccess",
      "Effect": "Allow",
      "Action": [
        "rds:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ElastiCacheAccess",
      "Effect": "Allow",
      "Action": [
        "elasticache:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3BucketManagement",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:PutBucket*",
        "s3:GetBucket*",
        "s3:ListBucket"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SecretsManagerAccess",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMRoleManagement",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:PassRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:CreatePolicy",
        "iam:DeletePolicy",
        "iam:GetPolicy",
        "iam:CreateServiceLinkedRole",
        "iam:TagRole",
        "iam:UntagRole",
        "iam:ListRolePolicies",
        "iam:ListAttachedRolePolicies"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchAccess",
      "Effect": "Allow",
      "Action": [
        "logs:*",
        "cloudwatch:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Route53Access",
      "Effect": "Allow",
      "Action": [
        "route53:*",
        "route53domains:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ACMAccess",
      "Effect": "Allow",
      "Action": [
        "acm:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "WAFAccess",
      "Effect": "Allow",
      "Action": [
        "wafv2:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SNSSQSAccess",
      "Effect": "Allow",
      "Action": [
        "sns:*",
        "sqs:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudFrontAccess",
      "Effect": "Allow",
      "Action": [
        "cloudfront:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "LoadBalancerAccess",
      "Effect": "Allow",
      "Action": [
        "elasticloadbalancing:*"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Create the policy
aws iam create-policy \
  --policy-name "unified-health-terraform-policy" \
  --policy-document file://terraform-policy.json

# Attach to all roles
for ENV in dev staging prod; do
  aws iam attach-role-policy \
    --role-name "github-actions-unified-health-${ENV}" \
    --policy-arn "arn:aws:iam::${ACCOUNT_ID}:policy/unified-health-terraform-policy"
done

echo "Created and attached Terraform policy to all roles"
```

### Step 6: Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret** for each secret:

```
AWS_ROLE_ARN_DEV = arn:aws:iam::YOUR_ACCOUNT_ID:role/github-actions-unified-health-dev
AWS_ROLE_ARN_STAGING = arn:aws:iam::YOUR_ACCOUNT_ID:role/github-actions-unified-health-staging
AWS_ROLE_ARN_PROD = arn:aws:iam::YOUR_ACCOUNT_ID:role/github-actions-unified-health-prod
TF_STATE_BUCKET = unified-health-terraform-state-YOUR_ACCOUNT_ID
TF_LOCK_TABLE = unified-health-terraform-locks
```

### Step 7: Create GitHub Environments

1. Go to **Settings** > **Environments**
2. Create three environments:
   - `dev` - No protection rules
   - `staging` - Require reviewers (optional)
   - `prod` - Require reviewers, restrict to `main` branch

---

## Verification

### Test OIDC Authentication

Create a test workflow `.github/workflows/test-aws-auth.yml`:

```yaml
name: Test AWS Authentication

on:
  workflow_dispatch:

jobs:
  test-auth:
    runs-on: ubuntu-latest
    environment: dev
    permissions:
      id-token: write
      contents: read

    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN_DEV }}
          aws-region: us-east-1

      - name: Verify Authentication
        run: |
          aws sts get-caller-identity
          echo "Successfully authenticated with AWS!"
```

---

## Troubleshooting

### Common Issues

1. **"Not authorized to perform sts:AssumeRoleWithWebIdentity"**
   - Verify OIDC provider is created correctly
   - Check trust policy matches your repo name exactly
   - Ensure environment name in workflow matches trust policy

2. **"Error: Unable to locate credentials"**
   - Verify `id-token: write` permission is set in workflow
   - Check role ARN is correct in secrets

3. **"Access Denied" on S3 state bucket**
   - Verify IAM policy allows access to the specific bucket
   - Check bucket name matches exactly

### Useful Commands

```bash
# List OIDC providers
aws iam list-open-id-connect-providers

# Check role trust policy
aws iam get-role --role-name github-actions-unified-health-dev --query 'Role.AssumeRolePolicyDocument'

# Test role assumption locally
aws sts assume-role \
  --role-arn arn:aws:iam::YOUR_ACCOUNT_ID:role/github-actions-unified-health-dev \
  --role-session-name test-session
```

---

## Security Best Practices

1. **Principle of Least Privilege**: Production role has read-only ECR access
2. **Environment Protection**: Require approvals for staging/prod deployments
3. **Branch Protection**: Only allow prod deployments from `main` branch
4. **Audit Logging**: CloudTrail logs all IAM actions
5. **Secret Rotation**: Rotate any static credentials regularly
6. **No Long-Lived Credentials**: Use OIDC federation instead of access keys

---

## Using Secrets in Workflows

### Example Terraform Workflow

```yaml
name: Terraform Deploy

on:
  push:
    branches: [main]
    paths:
      - 'infrastructure/terraform-aws/**'

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: prod

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN_PROD }}
          aws-region: us-east-1

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        run: |
          terraform init \
            -backend-config="bucket=${{ secrets.TF_STATE_BUCKET }}" \
            -backend-config="key=unified-health/prod/terraform.tfstate" \
            -backend-config="region=us-east-1" \
            -backend-config="dynamodb_table=${{ secrets.TF_LOCK_TABLE }}"
        working-directory: infrastructure/terraform-aws

      - name: Terraform Plan
        run: terraform plan -out=tfplan
        working-directory: infrastructure/terraform-aws

      - name: Terraform Apply
        run: terraform apply -auto-approve tfplan
        working-directory: infrastructure/terraform-aws
```

### Example EKS Deployment Workflow

```yaml
name: Deploy to EKS

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - dev
          - staging
          - prod

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets[format('AWS_ROLE_ARN_{0}', upper(inputs.environment))] }}
          aws-region: us-east-1

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig \
            --region us-east-1 \
            --name unified-health-${{ inputs.environment }}-americas-eks

      - name: Deploy to Kubernetes
        run: |
          kubectl apply -k infrastructure/kubernetes/overlays/${{ inputs.environment }}
```

---

## Quick Setup Script

For convenience, here is a complete setup script:

```bash
#!/bin/bash
# setup-github-aws-secrets.sh

set -e

# Configuration
GITHUB_ORG="your-org"
GITHUB_REPO="Global-Healthcare-SaaS-Platform"
AWS_REGION="us-east-1"

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
STATE_BUCKET="unified-health-terraform-state-${ACCOUNT_ID}"
LOCK_TABLE="unified-health-terraform-locks"

echo "Setting up AWS resources for GitHub Actions..."

# 1. Create S3 bucket for Terraform state
echo "Creating S3 bucket: ${STATE_BUCKET}"
aws s3api create-bucket --bucket "${STATE_BUCKET}" --region "${AWS_REGION}" 2>/dev/null || true
aws s3api put-bucket-versioning --bucket "${STATE_BUCKET}" --versioning-configuration Status=Enabled
aws s3api put-bucket-encryption --bucket "${STATE_BUCKET}" \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
aws s3api put-public-access-block --bucket "${STATE_BUCKET}" \
  --public-access-block-configuration '{"BlockPublicAcls":true,"IgnorePublicAcls":true,"BlockPublicPolicy":true,"RestrictPublicBuckets":true}'

# 2. Create DynamoDB table for state locking
echo "Creating DynamoDB table: ${LOCK_TABLE}"
aws dynamodb create-table \
  --table-name "${LOCK_TABLE}" \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "${AWS_REGION}" 2>/dev/null || true

# 3. Create OIDC provider
echo "Creating OIDC provider..."
aws iam create-open-id-connect-provider \
  --url "https://token.actions.githubusercontent.com" \
  --client-id-list "sts.amazonaws.com" \
  --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1" 2>/dev/null || true

# 4. Create roles for each environment
for ENV in dev staging prod; do
  ROLE_NAME="github-actions-unified-health-${ENV}"
  echo "Creating role: ${ROLE_NAME}"

  # Create trust policy
  cat > /tmp/trust-policy-${ENV}.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
      },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": "repo:${GITHUB_ORG}/${GITHUB_REPO}:environment:${ENV}"
      }
    }
  }]
}
EOF

  aws iam create-role \
    --role-name "${ROLE_NAME}" \
    --assume-role-policy-document file:///tmp/trust-policy-${ENV}.json 2>/dev/null || true
done

echo ""
echo "Setup complete! Add these secrets to GitHub:"
echo ""
echo "AWS_ROLE_ARN_DEV = arn:aws:iam::${ACCOUNT_ID}:role/github-actions-unified-health-dev"
echo "AWS_ROLE_ARN_STAGING = arn:aws:iam::${ACCOUNT_ID}:role/github-actions-unified-health-staging"
echo "AWS_ROLE_ARN_PROD = arn:aws:iam::${ACCOUNT_ID}:role/github-actions-unified-health-prod"
echo "TF_STATE_BUCKET = ${STATE_BUCKET}"
echo "TF_LOCK_TABLE = ${LOCK_TABLE}"
```

---

## Related Documentation

- [AWS OIDC with GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [Terraform AWS Provider Authentication](https://registry.terraform.io/providers/hashicorp/aws/latest/docs#authentication)
- [EKS IAM Roles for Service Accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)
- [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
- [Amazon ECR Documentation](https://docs.aws.amazon.com/ecr/)

---

**Last Updated**: 2025-12-29
