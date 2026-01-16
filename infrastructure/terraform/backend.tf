# ============================================
# Terraform State Backend - AWS S3
# ============================================
# Configures AWS S3 as the backend for Terraform state management
# Provides state locking via DynamoDB, versioning, and team collaboration capabilities
#
# IMPORTANT: Before using this backend, you must:
# 1. Run ./setup-backend.sh to create S3 bucket and DynamoDB table
# 2. Configure appropriate IAM permissions (see IAM section below)
# 3. Use -backend-config for environment-specific settings
#
# Usage:
#   terraform init -backend-config=environments/dev.tfbackend
#   terraform init -backend-config=environments/staging.tfbackend
#   terraform init -backend-config=environments/prod.tfbackend

terraform {
  backend "s3" {
    # Backend configuration is provided via -backend-config flag during init
    # This allows different state files per environment while keeping code DRY

    # Key features of S3 backend:
    # - Automatic state locking using DynamoDB (prevents concurrent modifications)
    # - Encryption at rest (SSE-S3 or SSE-KMS)
    # - Versioning support (when enabled on bucket)
    # - Access control via IAM policies and bucket policies
    # - Cross-region replication available for disaster recovery
    # - Lifecycle policies for version management

    # Configuration values are loaded from environment-specific .tfbackend files:
    # - bucket: S3 bucket name for state storage
    # - key: Path to the state file within the bucket
    # - region: AWS region where bucket is located
    # - dynamodb_table: Table for state locking
    # - encrypt: Enable server-side encryption
    # - kms_key_id: (Optional) KMS key for encryption
  }
}

# ============================================
# Backend Setup Instructions
# ============================================
#
# To create the required AWS infrastructure, run the setup script:
#
#   ./setup-backend.sh
#
# Or manually create resources with these AWS CLI commands:
#
# 1. Create S3 bucket for state storage (with versioning):
#    aws s3api create-bucket \
#      --bucket unified-health-tfstate-${ENV} \
#      --region us-east-1
#
#    aws s3api put-bucket-versioning \
#      --bucket unified-health-tfstate-${ENV} \
#      --versioning-configuration Status=Enabled
#
#    aws s3api put-bucket-encryption \
#      --bucket unified-health-tfstate-${ENV} \
#      --server-side-encryption-configuration '{
#        "Rules": [{
#          "ApplyServerSideEncryptionByDefault": {
#            "SSEAlgorithm": "AES256"
#          },
#          "BucketKeyEnabled": true
#        }]
#      }'
#
#    aws s3api put-public-access-block \
#      --bucket unified-health-tfstate-${ENV} \
#      --public-access-block-configuration \
#        BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
#
# 2. Create DynamoDB table for state locking:
#    aws dynamodb create-table \
#      --table-name unified-health-terraform-locks-${ENV} \
#      --attribute-definitions AttributeName=LockID,AttributeType=S \
#      --key-schema AttributeName=LockID,KeyType=HASH \
#      --billing-mode PAY_PER_REQUEST \
#      --region us-east-1
#
# ============================================
# IAM Permissions Required
# ============================================
#
# The IAM user or role running Terraform needs these permissions:
#
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Action": [
#         "s3:ListBucket",
#         "s3:GetBucketVersioning",
#         "s3:GetBucketLocation"
#       ],
#       "Resource": "arn:aws:s3:::unified-health-tfstate-*"
#     },
#     {
#       "Effect": "Allow",
#       "Action": [
#         "s3:GetObject",
#         "s3:PutObject",
#         "s3:DeleteObject"
#       ],
#       "Resource": "arn:aws:s3:::unified-health-tfstate-*/env/*/terraform.tfstate"
#     },
#     {
#       "Effect": "Allow",
#       "Action": [
#         "dynamodb:GetItem",
#         "dynamodb:PutItem",
#         "dynamodb:DeleteItem",
#         "dynamodb:DescribeTable"
#       ],
#       "Resource": "arn:aws:dynamodb:*:*:table/unified-health-terraform-locks-*"
#     }
#   ]
# }
#
# ============================================
# Security Recommendations
# ============================================
#
# For Production:
# - Enable S3 versioning for state history and recovery
# - Use SSE-KMS encryption with customer-managed keys
# - Enable MFA delete on S3 bucket
# - Restrict bucket access via bucket policies
# - Enable S3 access logging
# - Configure cross-region replication for DR
# - Use separate AWS accounts per environment
# - Enable DynamoDB point-in-time recovery
# - Apply S3 Object Lock for compliance
#
# For Staging:
# - Enable versioning and encryption
# - Standard IAM access controls
# - SSE-S3 encryption is acceptable
#
# For Development:
# - Versioning recommended
# - SSE-S3 encryption
# - Standard IAM controls
#
# ============================================
# HIPAA Compliance Considerations
# ============================================
#
# Terraform state files may contain sensitive information:
# - Database connection strings
# - IP addresses and network configurations
# - Resource identifiers
# - Secrets and credentials (avoid storing in state)
#
# To maintain HIPAA compliance:
# - Enable SSE-KMS encryption with customer-managed keys
# - Use VPC endpoints for S3 access (avoid public internet)
# - Restrict IAM access using least privilege principle
# - Enable CloudTrail for audit logging
# - Enable S3 access logging
# - Regularly review CloudTrail and access logs
# - Implement data retention policies
# - Ensure state files are never committed to version control
# - Use AWS Organizations SCPs for additional guardrails
# - Consider using AWS Config rules for compliance monitoring
