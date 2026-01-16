# ============================================
# S3 Storage Module with Cost Optimization
# ============================================

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# ============================================
# Main Application Bucket
# ============================================

resource "aws_s3_bucket" "main" {
  bucket = "${var.project_name}-${var.environment}-assets"

  tags = merge(var.tags, {
    Name        = "${var.project_name}-${var.environment}-assets"
    Environment = var.environment
    CostCenter  = var.cost_center
  })
}

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id

  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Disabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true # Cost optimization: reduces KMS costs
  }
}

# ============================================
# Intelligent-Tiering Configuration
# ============================================

resource "aws_s3_bucket_intelligent_tiering_configuration" "main" {
  bucket = aws_s3_bucket.main.id
  name   = "EntireS3Bucket"

  tiering {
    access_tier = "DEEP_ARCHIVE_ACCESS"
    days        = 180
  }

  tiering {
    access_tier = "ARCHIVE_ACCESS"
    days        = 90
  }
}

# ============================================
# Lifecycle Rules for Cost Optimization
# ============================================

resource "aws_s3_bucket_lifecycle_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  # Transition infrequently accessed objects
  rule {
    id     = "transition-to-intelligent-tiering"
    status = "Enabled"

    filter {
      prefix = ""
    }

    transition {
      days          = 30
      storage_class = "INTELLIGENT_TIERING"
    }
  }

  # Medical records - move to Glacier after 7 years (HIPAA)
  rule {
    id     = "archive-medical-records"
    status = "Enabled"

    filter {
      prefix = "medical-records/"
    }

    transition {
      days          = 365
      storage_class = "GLACIER_IR" # Glacier Instant Retrieval
    }

    transition {
      days          = 2555 # 7 years
      storage_class = "DEEP_ARCHIVE"
    }

    # Keep for 10 years then delete
    expiration {
      days = 3650
    }
  }

  # Audit logs - archive quickly, retain 7 years
  rule {
    id     = "archive-audit-logs"
    status = "Enabled"

    filter {
      prefix = "audit-logs/"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    transition {
      days          = 365
      storage_class = "DEEP_ARCHIVE"
    }

    expiration {
      days = 2555 # 7 years
    }
  }

  # Temporary uploads - delete after 24 hours
  rule {
    id     = "cleanup-temp-uploads"
    status = "Enabled"

    filter {
      prefix = "temp/"
    }

    expiration {
      days = 1
    }
  }

  # Cache objects - short retention
  rule {
    id     = "cache-cleanup"
    status = "Enabled"

    filter {
      prefix = "cache/"
    }

    expiration {
      days = 7
    }
  }

  # Delete incomplete multipart uploads
  rule {
    id     = "abort-incomplete-multipart"
    status = "Enabled"

    filter {
      prefix = ""
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }

  # Clean up old versions
  rule {
    id     = "cleanup-old-versions"
    status = var.enable_versioning ? "Enabled" : "Disabled"

    filter {
      prefix = ""
    }

    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }

  # Session recordings - tiered storage
  rule {
    id     = "session-recordings"
    status = "Enabled"

    filter {
      prefix = "recordings/"
    }

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER_IR"
    }

    transition {
      days          = 365
      storage_class = "DEEP_ARCHIVE"
    }
  }

  # Profile images - keep accessible
  rule {
    id     = "profile-images"
    status = "Enabled"

    filter {
      prefix = "profiles/"
    }

    transition {
      days          = 365
      storage_class = "INTELLIGENT_TIERING"
    }
  }
}

# ============================================
# Bucket Policy for CloudFront OAC
# ============================================

resource "aws_s3_bucket_policy" "main" {
  bucket = aws_s3_bucket.main.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOAC"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.main.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = var.cloudfront_distribution_arn
          }
        }
      }
    ]
  })
}

# ============================================
# Logs Bucket (Cost Optimized)
# ============================================

resource "aws_s3_bucket" "logs" {
  bucket = "${var.project_name}-${var.environment}-logs"

  tags = merge(var.tags, {
    Name        = "${var.project_name}-${var.environment}-logs"
    Environment = var.environment
    CostCenter  = var.cost_center
  })
}

resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id

  rule {
    id     = "logs-lifecycle"
    status = "Enabled"

    filter {
      prefix = ""
    }

    # Move to Standard-IA after 30 days
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    # Move to Glacier after 90 days
    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    # Delete after 1 year
    expiration {
      days = 365
    }
  }
}

# ============================================
# Analytics Configuration
# ============================================

resource "aws_s3_bucket_analytics_configuration" "main" {
  bucket = aws_s3_bucket.main.id
  name   = "EntireBucket"

  storage_class_analysis {
    data_export {
      destination {
        s3_bucket_destination {
          bucket_arn = aws_s3_bucket.logs.arn
          prefix     = "storage-analytics/"
        }
      }
    }
  }
}

# ============================================
# S3 Inventory for Cost Analysis
# ============================================

resource "aws_s3_bucket_inventory" "main" {
  bucket = aws_s3_bucket.main.id
  name   = "weekly-inventory"

  included_object_versions = "Current"

  schedule {
    frequency = "Weekly"
  }

  destination {
    bucket {
      format     = "Parquet" # Efficient for Athena queries
      bucket_arn = aws_s3_bucket.logs.arn
      prefix     = "inventory/"
    }
  }

  optional_fields = [
    "Size",
    "StorageClass",
    "LastModifiedDate",
    "IntelligentTieringAccessTier"
  ]
}

# ============================================
# Backup Bucket (HIPAA Compliance)
# ============================================

resource "aws_s3_bucket" "backups" {
  bucket = "${var.project_name}-${var.environment}-backups"

  tags = merge(var.tags, {
    Name        = "${var.project_name}-${var.environment}-backups"
    Environment = var.environment
    CostCenter  = var.cost_center
    Compliance  = "HIPAA"
  })
}

resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = var.kms_key_arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    id     = "backup-lifecycle"
    status = "Enabled"

    filter {
      prefix = ""
    }

    # Daily backups: keep 30 days in Standard
    transition {
      days          = 30
      storage_class = "GLACIER_IR"
    }

    # Monthly backups: move to Deep Archive after 1 year
    transition {
      days          = 365
      storage_class = "DEEP_ARCHIVE"
    }

    # Retain for 7 years (HIPAA)
    expiration {
      days = 2555
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

resource "aws_s3_bucket_object_lock_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    default_retention {
      mode = "GOVERNANCE"
      days = 365
    }
  }
}

# ============================================
# Public ACL Block (Security)
# ============================================

resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "logs" {
  bucket = aws_s3_bucket.logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "backups" {
  bucket = aws_s3_bucket.backups.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
