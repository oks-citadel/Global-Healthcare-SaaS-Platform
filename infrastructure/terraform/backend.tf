# ============================================
# Terraform State Backend - AWS S3
# ============================================
# State is stored in S3 with DynamoDB locking
# Separate state files per environment
#
# IMPORTANT: Before using this backend, you must:
# 1. Create the S3 bucket and DynamoDB table (see bootstrap section below)
# 2. Configure appropriate IAM permissions
# 3. Use -backend-config for environment-specific settings
#
# Usage:
#   terraform init -backend-config=environments/dev.tfbackend
#   terraform init -backend-config=environments/staging.tfbackend
#   terraform init -backend-config=environments/prod.tfbackend
# ============================================

terraform {
  backend "s3" {
    # AWS Account: 992382449461
    # Organizational Unit: ou-2kqs-qw6vym5t
    bucket         = "unified-health-terraform-state-992382449461"
    key            = "unified-health/prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true

    # DynamoDB table for state locking
    dynamodb_table = "unified-health-terraform-locks"

    # Key features of S3 backend:
    # - Automatic state locking using DynamoDB (prevents concurrent modifications)
    # - Encryption at rest (SSE-S3 or SSE-KMS)
    # - Versioning support (when enabled on bucket)
    # - Access control via IAM
    # - Cross-region replication available for DR
  }
}

# ============================================
# Backend Bootstrap Resources
# ============================================
# These resources should be created FIRST before using the S3 backend
# Run this with local backend: terraform apply -target=module.terraform_state_backend
#
# After bootstrap:
# 1. Update the bucket name in backend configuration
# 2. Run: terraform init -migrate-state
# ============================================
