# UnifiedHealth Platform - AWS Infrastructure

This directory contains Terraform configurations for deploying the UnifiedHealth Platform infrastructure on AWS.

## Architecture Overview

The infrastructure consists of:

- **Amazon Elastic Kubernetes Service (EKS)**: Container orchestration for microservices
- **Amazon RDS for PostgreSQL**: Primary database with HIPAA-compliant configuration
- **Amazon ElastiCache for Redis**: Session management and caching layer
- **Amazon Elastic Container Registry (ECR)**: Private container image registry with cross-region replication
- **AWS Secrets Manager**: Secrets and certificate management
- **Amazon S3**: Document storage with encryption and versioning
- **Amazon VPC**: Network isolation with subnets and security groups
- **Amazon CloudWatch**: Monitoring and observability
- **Amazon SNS/CloudWatch Alarms**: Proactive alerting for critical metrics

### Optional Modules

- **Amazon CloudFront**: Global CDN with WAF
- **Application Load Balancer (ALB)**: Regional load balancing with WAF
- **VPC Endpoints**: Private connectivity for AWS services

## Prerequisites

1. **AWS CLI** (>= 2.0.0)
   ```bash
   aws --version
   aws configure
   ```

2. **Terraform** (>= 1.6.0)
   ```bash
   terraform --version
   ```

3. **AWS Account** with appropriate permissions
   - AdministratorAccess or equivalent IAM permissions
   - Ability to create IAM roles and policies

4. **Backend S3 Bucket** for Terraform state
   - Run `./setup-backend.sh` to create S3 bucket and DynamoDB table

## Directory Structure

```
terraform/
├── main.tf                      # Main infrastructure resources
├── variables.tf                 # Variable definitions
├── outputs.tf                   # Output definitions
├── backend.tf                   # S3 backend configuration
├── deploy.sh                    # Bash deployment script
├── deploy.ps1                   # PowerShell deployment script
├── setup-backend.sh             # AWS S3 backend setup script
├── environments/
│   ├── dev.tfvars              # Development environment variables
│   ├── dev.tfbackend           # Development S3 backend config
│   ├── staging.tfvars          # Staging environment variables
│   ├── staging.tfbackend       # Staging S3 backend config
│   ├── prod.tfvars             # Production environment variables
│   └── prod.tfbackend          # Production S3 backend config
└── modules/
    ├── cloudfront/             # CloudFront CDN module
    ├── alb/                    # Application Load Balancer module
    └── vpc-endpoints/          # VPC Endpoints module
```

## Quick Start

### 1. Setup Backend Storage

First-time setup to create S3 bucket and DynamoDB table for Terraform state:

```bash
# Make script executable
chmod +x setup-backend.sh

# Run backend setup (interactive mode)
./setup-backend.sh

# Or specify environment directly
./setup-backend.sh --env dev
./setup-backend.sh --env staging
./setup-backend.sh --env prod --kms   # Production with KMS encryption

# Setup all environments at once
./setup-backend.sh --env all
```

This creates:
- **S3 bucket**: `unified-health-tfstate-{env}-{account-id}` with versioning enabled
- **DynamoDB table**: `unified-health-terraform-locks-{env}` for state locking
- **Encryption**: SSE-S3 (default) or SSE-KMS (recommended for production)
- **Public access blocked**: All public access is blocked by default
- **Bucket policy**: Enforces TLS and encryption for all requests

### 2. Configure Environment Variables

Create a `.tfvars` file for your environment or use the existing templates:

```bash
# Copy and customize for your environment
cp environments/dev.tfvars environments/dev.tfvars.local
```

Update the following sensitive values:
- `postgresql_admin_password`: Strong password for PostgreSQL
- `alert_email_address`: Email for infrastructure alerts

### 3. Deploy Infrastructure

#### Using Bash (Linux/macOS/WSL)

```bash
# Make script executable
chmod +x deploy.sh

# Plan deployment
./deploy.sh -e dev -a plan

# Apply deployment
./deploy.sh -e dev -a apply

# Destroy (if needed)
./deploy.sh -e dev -a destroy
```

#### Using PowerShell (Windows)

```powershell
# Plan deployment
.\deploy.ps1 -Environment dev -Action plan

# Apply deployment
.\deploy.ps1 -Environment dev -Action apply

# Destroy (if needed)
.\deploy.ps1 -Environment dev -Action destroy
```

### 4. Manual Deployment (Alternative)

If you prefer manual Terraform commands:

```bash
# Initialize with backend
terraform init -backend-config=environments/dev.tfbackend

# Plan
terraform plan -var-file=environments/dev.tfvars -out=dev.tfplan

# Apply
terraform apply dev.tfplan

# Show outputs
terraform output
```

## Terraform State Management (AWS S3)

### Backend Configuration

The Terraform state is stored in AWS S3 with DynamoDB for state locking:

| Component | Purpose |
|-----------|---------|
| S3 Bucket | Stores terraform.tfstate file |
| S3 Versioning | Enables state history and recovery |
| S3 Encryption | SSE-S3 or SSE-KMS for data at rest |
| DynamoDB Table | State locking to prevent concurrent modifications |

### State File Structure

```
s3://unified-health-tfstate-{env}-{account-id}/
└── env/
    └── {environment}/
        └── terraform.tfstate
```

### IAM Permissions Required

Users or roles that run Terraform need these minimum permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketVersioning",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::unified-health-tfstate-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::unified-health-tfstate-*/env/*/terraform.tfstate"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:DescribeTable"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/unified-health-terraform-locks-*"
    }
  ]
}
```

## Environment-Specific Configurations

### Development

- **Cost-optimized** configuration
- Basic tier for PostgreSQL
- Standard tier for Redis
- Single-zone deployment
- Minimal node counts

### Staging

- **Production-like** setup with reduced capacity
- General Purpose PostgreSQL
- Standard Redis with moderate capacity
- Multi-zone capable
- Suitable for load testing

### Production

- **High-availability** configuration
- Memory-optimized PostgreSQL
- Premium Redis with geo-replication
- ECR geo-replication enabled
- Multi-zone deployment
- Enhanced monitoring and alerting
- KMS encryption for state files

## Security Best Practices

### HIPAA Compliance

1. **Encryption**
   - All data encrypted at rest (S3 SSE, RDS encryption, EBS encryption)
   - TLS 1.2+ enforced for all connections
   - VPC endpoints for private AWS service access

2. **Network Isolation**
   - VPC with private and public subnets
   - Security Groups with least-privilege rules
   - Database accessible only from EKS subnet
   - NAT Gateway for outbound internet access

3. **Access Control**
   - IAM policies following least privilege principle
   - Secrets Manager for credential management
   - IAM roles for service accounts (IRSA) in EKS

4. **Audit & Monitoring**
   - CloudTrail enabled for API logging
   - CloudWatch Logs for application and infrastructure logs
   - Real-time alerts for critical events
   - 90-day log retention minimum

### Secrets Management

Never commit sensitive values to version control:

```bash
# Add to .gitignore
*.tfvars.local
*.tfstate
*.tfstate.backup
.terraform/
```

Use environment variables or AWS Secrets Manager for secrets:

```bash
export TF_VAR_postgresql_admin_password="your-secure-password"
```

## Monitoring & Alerting

The infrastructure includes comprehensive monitoring:

### Metrics Collected

- **EKS**: Node CPU/Memory, Pod counts, Network traffic
- **RDS PostgreSQL**: CPU, Memory, Storage, Connections, Replication lag
- **ElastiCache Redis**: CPU, Memory, Cache hits/misses, Connected clients
- **S3**: Requests, Latency, Error rates

### Alert Rules

- High CPU usage (>80%)
- High memory usage (>80%)
- High storage usage (>85%)
- Service availability issues
- Backup failures

### Accessing Logs

```bash
# Query logs using AWS CLI
aws logs filter-log-events \
  --log-group-name /aws/eks/unified-health/cluster \
  --filter-pattern "ERROR" \
  --limit 10

# View CloudWatch Insights
aws logs start-query \
  --log-group-name /aws/eks/unified-health/cluster \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string 'fields @timestamp, @message | filter @message like /error/i | limit 20'
```

## Cost Optimization

### Development (~$200-300/month)

- Minimal node counts
- Basic tier services
- Single-region deployment

### Staging (~$500-700/month)

- Production-like but fewer nodes
- No geo-replication
- Standard tier services

### Production (~$1,500-2,500/month)

- High availability
- Multi-AZ deployment
- Premium tier services
- Auto-scaling enabled

### Cost Reduction Tips

1. Use AWS Savings Plans or Reserved Instances for 1-3 year commitments (up to 72% savings)
2. Enable auto-scaling to match demand
3. Use Spot Instances for non-critical workloads
4. Review and delete unused resources regularly
5. Use AWS Cost Explorer for tracking and optimization

## Troubleshooting

### Common Issues

#### 1. Terraform State Lock

```bash
# If state is locked, force unlock (use with caution!)
terraform force-unlock LOCK_ID

# Or manually delete the lock from DynamoDB
aws dynamodb delete-item \
  --table-name unified-health-terraform-locks-dev \
  --key '{"LockID": {"S": "unified-health-tfstate-dev-ACCOUNT_ID/env/dev/terraform.tfstate"}}'
```

#### 2. Backend Initialization Failed

```bash
# Check if S3 bucket exists
aws s3api head-bucket --bucket unified-health-tfstate-dev-ACCOUNT_ID

# Check DynamoDB table exists
aws dynamodb describe-table --table-name unified-health-terraform-locks-dev

# Verify AWS credentials
aws sts get-caller-identity
```

#### 3. PostgreSQL Password Requirements

Password must:
- Be 8-128 characters long
- Contain characters from three categories: uppercase, lowercase, numbers, special characters
- Not contain username

#### 4. Service Quota Limits

```bash
# Check EC2 instance quota
aws service-quotas get-service-quota \
  --service-code ec2 \
  --quota-code L-1216C47A

# Request quota increase
aws service-quotas request-service-quota-increase \
  --service-code ec2 \
  --quota-code L-1216C47A \
  --desired-value 100
```

### Debug Mode

Enable Terraform debug logging:

```bash
export TF_LOG=DEBUG
export TF_LOG_PATH=terraform-debug.log
terraform plan -var-file=environments/dev.tfvars
```

## Disaster Recovery

### Backup Strategy

1. **RDS PostgreSQL**: Automated backups with 35-day retention, point-in-time recovery
2. **S3**: Versioning enabled, cross-region replication available
3. **Terraform State**: S3 versioning enabled for state history

### Recovery Procedures

#### Restore RDS PostgreSQL

```bash
# Restore from automated backup
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier unified-health-prod \
  --target-db-instance-identifier unified-health-prod-restored \
  --restore-time 2024-01-15T13:10:00Z

# Or restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier unified-health-prod-restored \
  --db-snapshot-identifier unified-health-prod-snapshot-20240115
```

#### Restore Terraform State

```bash
# List state versions
aws s3api list-object-versions \
  --bucket unified-health-tfstate-prod-ACCOUNT_ID \
  --prefix env/prod/terraform.tfstate

# Download specific version
aws s3api get-object \
  --bucket unified-health-tfstate-prod-ACCOUNT_ID \
  --key env/prod/terraform.tfstate \
  --version-id VERSION_ID \
  terraform.tfstate.backup

# Restore previous state version
terraform state push terraform.tfstate.backup
```

## Updating Infrastructure

### Safe Update Process

1. **Test in Dev**: Deploy changes to dev environment first
2. **Review Plan**: Always review `terraform plan` output
3. **Staging Validation**: Test in staging before production
4. **Backup**: Take manual backups before major changes
5. **Maintenance Window**: Schedule production updates during off-peak hours
6. **Rollback Plan**: Know how to revert changes if needed

### Rolling Back

```bash
# Download previous state version and restore
aws s3api get-object \
  --bucket unified-health-tfstate-prod-ACCOUNT_ID \
  --key env/prod/terraform.tfstate \
  --version-id PREVIOUS_VERSION_ID \
  terraform.tfstate.backup

terraform state push terraform.tfstate.backup

# Or use previous plan file
terraform apply previous.tfplan
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Infrastructure

on:
  push:
    branches: [main]
    paths: ['infrastructure/terraform/**']

jobs:
  terraform:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole
          aws-region: us-east-1

      - name: Terraform Init
        working-directory: infrastructure/terraform
        run: terraform init -backend-config=environments/prod.tfbackend

      - name: Terraform Plan
        working-directory: infrastructure/terraform
        run: terraform plan -var-file=environments/prod.tfvars -out=prod.tfplan

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        working-directory: infrastructure/terraform
        run: terraform apply -auto-approve prod.tfplan
```

## Additional Resources

- [AWS Terraform Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
- [HIPAA on AWS](https://aws.amazon.com/compliance/hipaa-compliance/)
- [AWS Architecture Center](https://aws.amazon.com/architecture/)
- [Terraform S3 Backend Documentation](https://developer.hashicorp.com/terraform/language/settings/backends/s3)

## Support

For infrastructure issues or questions:
- Create an issue in the repository
- Contact the DevOps team
- Review AWS Health Dashboard

## License

Copyright (c) 2024 UnifiedHealth Platform
