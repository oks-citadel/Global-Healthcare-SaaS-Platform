# ============================================
# Terraform State Backend - Bootstrap Module
# ============================================
# Creates S3 bucket and DynamoDB table for Terraform state management
#
# Usage:
#   1. First, run with local backend to create these resources
#   2. Then migrate state to S3 backend
#
# terraform init
# terraform apply -target=module.terraform_state_backend
# terraform init -migrate-state -backend-config=environments/dev.tfbackend
# ============================================

# ============================================
# Local Variables
# ============================================

locals {
  bucket_name = "${var.project_name}-terraform-state-${var.environment}"
  table_name  = "${var.project_name}-terraform-locks-${var.environment}"

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    Purpose     = "TerraformState"
    ManagedBy   = "Terraform"
  }
}

# ============================================
# S3 Bucket for State Storage
# ============================================

resource "aws_s3_bucket" "terraform_state" {
  bucket = local.bucket_name

  # Prevent accidental deletion of this S3 bucket
  lifecycle {
    prevent_destroy = true
  }

  tags = merge(local.common_tags, {
    Name = local.bucket_name
  })
}

# Enable versioning for state history
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption by default
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = var.use_kms_encryption ? "aws:kms" : "AES256"
      kms_master_key_id = var.use_kms_encryption ? aws_kms_key.terraform_state[0].arn : null
    }
    bucket_key_enabled = var.use_kms_encryption
  }
}

# Block all public access
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle rules for old versions
resource "aws_s3_bucket_lifecycle_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    id     = "expire-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = var.version_retention_days
    }
  }
}

# Bucket policy for access control
resource "aws_s3_bucket_policy" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "EnforceTLS"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.terraform_state.arn,
          "${aws_s3_bucket.terraform_state.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      },
      {
        Sid       = "AllowTerraformAccess"
        Effect    = "Allow"
        Principal = {
          AWS = var.allowed_principals
        }
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.terraform_state.arn,
          "${aws_s3_bucket.terraform_state.arn}/*"
        ]
      }
    ]
  })
}

# ============================================
# KMS Key for Encryption (Optional)
# ============================================

resource "aws_kms_key" "terraform_state" {
  count = var.use_kms_encryption ? 1 : 0

  description             = "KMS key for Terraform state encryption - ${var.environment}"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow Terraform Access"
        Effect = "Allow"
        Principal = {
          AWS = var.allowed_principals
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(local.common_tags, {
    Name = "${local.bucket_name}-kms"
  })
}

resource "aws_kms_alias" "terraform_state" {
  count = var.use_kms_encryption ? 1 : 0

  name          = "alias/${var.project_name}-terraform-${var.environment}"
  target_key_id = aws_kms_key.terraform_state[0].key_id
}

# ============================================
# DynamoDB Table for State Locking
# ============================================

resource "aws_dynamodb_table" "terraform_locks" {
  name         = local.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  # Enable point-in-time recovery for production
  point_in_time_recovery {
    enabled = var.environment == "prod"
  }

  # Prevent accidental deletion
  lifecycle {
    prevent_destroy = true
  }

  tags = merge(local.common_tags, {
    Name = local.table_name
  })
}

# ============================================
# Data Sources
# ============================================

data "aws_caller_identity" "current" {}
