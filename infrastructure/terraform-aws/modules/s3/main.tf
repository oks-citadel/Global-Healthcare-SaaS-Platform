# ============================================
# AWS S3 Module - HIPAA Compliant Healthcare Storage
# ============================================
# Replaces: Azure Blob Storage
# Translation: Blob Container -> S3 Bucket, Storage Account -> S3
# ============================================

locals {
  name = "${var.project_name}-${var.environment}-${var.region_name}"

  tags = merge(var.tags, {
    Module           = "s3"
    Compliance       = "HIPAA"
    DataClassification = "PHI"
  })

  # Bucket names must be globally unique and DNS-compliant
  bucket_prefix = "${var.project_name}-${var.environment}-${var.region_name}"
}

# ============================================
# Data Sources
# ============================================

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ============================================
# KMS Key for S3 Encryption (HIPAA Requirement)
# ============================================

resource "aws_kms_key" "s3" {
  description             = "KMS key for S3 bucket encryption - ${local.name}"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  multi_region            = var.enable_replication

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
        Sid    = "Allow S3 Service"
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow CloudWatch Logs"
        Effect = "Allow"
        Principal = {
          Service = "logs.${data.aws_region.current.name}.amazonaws.com"
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

  tags = merge(local.tags, {
    Name = "${local.name}-s3-kms"
  })
}

resource "aws_kms_alias" "s3" {
  name          = "alias/${local.name}-s3"
  target_key_id = aws_kms_key.s3.key_id
}

# ============================================
# Access Logging Bucket
# ============================================

resource "aws_s3_bucket" "access_logs" {
  bucket        = "${local.bucket_prefix}-access-logs"
  force_destroy = var.force_destroy

  tags = merge(local.tags, {
    Name    = "${local.name}-access-logs"
    Purpose = "S3 Access Logging"
  })
}

resource "aws_s3_bucket_versioning" "access_logs" {
  bucket = aws_s3_bucket.access_logs.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "access_logs" {
  bucket = aws_s3_bucket.access_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "access_logs" {
  bucket = aws_s3_bucket.access_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "access_logs" {
  bucket = aws_s3_bucket.access_logs.id

  rule {
    id     = "log-retention"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    expiration {
      days = 365
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

resource "aws_s3_bucket_policy" "access_logs" {
  bucket = aws_s3_bucket.access_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3ServerAccessLogsPolicy"
        Effect = "Allow"
        Principal = {
          Service = "logging.s3.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.access_logs.arn}/*"
        Condition = {
          ArnLike = {
            "aws:SourceArn" = "arn:aws:s3:::${local.bucket_prefix}-*"
          }
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Sid    = "DenyInsecureTransport"
        Effect = "Deny"
        Principal = "*"
        Action = "s3:*"
        Resource = [
          aws_s3_bucket.access_logs.arn,
          "${aws_s3_bucket.access_logs.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}

# ============================================
# Document Storage Bucket (Patient Documents)
# ============================================

resource "aws_s3_bucket" "documents" {
  bucket        = "${local.bucket_prefix}-documents"
  force_destroy = var.force_destroy

  tags = merge(local.tags, {
    Name             = "${local.name}-documents"
    Purpose          = "Patient Document Storage"
    DataType         = "PHI"
    RetentionPolicy  = "7-years"
  })
}

resource "aws_s3_bucket_versioning" "documents" {
  bucket = aws_s3_bucket.documents.id

  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Suspended"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "documents" {
  bucket = aws_s3_bucket.documents.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "documents" {
  bucket = aws_s3_bucket.documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_logging" "documents" {
  bucket = aws_s3_bucket.documents.id

  target_bucket = aws_s3_bucket.access_logs.id
  target_prefix = "documents/"
}

resource "aws_s3_bucket_lifecycle_configuration" "documents" {
  bucket = aws_s3_bucket.documents.id

  rule {
    id     = "intelligent-tiering"
    status = "Enabled"

    filter {
      prefix = ""
    }

    transition {
      days          = 90
      storage_class = "INTELLIGENT_TIERING"
    }

    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "STANDARD_IA"
    }

    noncurrent_version_transition {
      noncurrent_days = 90
      storage_class   = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = 2555  # 7 years for HIPAA compliance
    }
  }

  rule {
    id     = "abort-incomplete-uploads"
    status = "Enabled"

    filter {
      prefix = ""
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }

  dynamic "rule" {
    for_each = var.lifecycle_rules
    content {
      id     = rule.value.id
      status = rule.value.enabled ? "Enabled" : "Disabled"

      filter {
        prefix = rule.value.prefix
      }

      dynamic "transition" {
        for_each = rule.value.transitions
        content {
          days          = transition.value.days
          storage_class = transition.value.storage_class
        }
      }

      dynamic "expiration" {
        for_each = rule.value.expiration_days != null ? [1] : []
        content {
          days = rule.value.expiration_days
        }
      }
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "documents" {
  bucket = aws_s3_bucket.documents.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD"]
    allowed_origins = var.cors_allowed_origins
    expose_headers  = ["ETag", "x-amz-meta-custom-header"]
    max_age_seconds = 3600
  }
}

resource "aws_s3_bucket_policy" "documents" {
  bucket = aws_s3_bucket.documents.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.documents.arn,
          "${aws_s3_bucket.documents.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      },
      {
        Sid       = "DenyIncorrectEncryptionHeader"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.documents.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      },
      {
        Sid       = "DenyUnencryptedObjectUploads"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.documents.arn}/*"
        Condition = {
          Null = {
            "s3:x-amz-server-side-encryption" = "true"
          }
        }
      },
      {
        Sid       = "RequireKMSEncryption"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.documents.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption-aws-kms-key-id" = aws_kms_key.s3.arn
          }
        }
      }
    ]
  })
}

# ============================================
# Medical Images Bucket (DICOM/Imaging)
# ============================================

resource "aws_s3_bucket" "medical_images" {
  bucket        = "${local.bucket_prefix}-medical-images"
  force_destroy = var.force_destroy

  tags = merge(local.tags, {
    Name             = "${local.name}-medical-images"
    Purpose          = "Medical Imaging Storage (DICOM)"
    DataType         = "PHI"
    RetentionPolicy  = "10-years"
  })
}

resource "aws_s3_bucket_versioning" "medical_images" {
  bucket = aws_s3_bucket.medical_images.id

  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Suspended"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "medical_images" {
  bucket = aws_s3_bucket.medical_images.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "medical_images" {
  bucket = aws_s3_bucket.medical_images.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_logging" "medical_images" {
  bucket = aws_s3_bucket.medical_images.id

  target_bucket = aws_s3_bucket.access_logs.id
  target_prefix = "medical-images/"
}

resource "aws_s3_bucket_lifecycle_configuration" "medical_images" {
  bucket = aws_s3_bucket.medical_images.id

  rule {
    id     = "medical-images-tiering"
    status = "Enabled"

    filter {
      prefix = ""
    }

    # Move to IA after 180 days (images accessed less frequently)
    transition {
      days          = 180
      storage_class = "STANDARD_IA"
    }

    # Move to Glacier after 1 year
    transition {
      days          = 365
      storage_class = "GLACIER"
    }

    # Deep Archive after 3 years
    transition {
      days          = 1095
      storage_class = "DEEP_ARCHIVE"
    }

    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "STANDARD_IA"
    }

    noncurrent_version_transition {
      noncurrent_days = 90
      storage_class   = "GLACIER"
    }

    # Keep for 10 years for medical records compliance
    noncurrent_version_expiration {
      noncurrent_days = 3650
    }
  }

  rule {
    id     = "abort-incomplete-uploads"
    status = "Enabled"

    filter {
      prefix = ""
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "medical_images" {
  bucket = aws_s3_bucket.medical_images.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD"]
    allowed_origins = var.cors_allowed_origins
    expose_headers  = ["ETag", "x-amz-meta-custom-header", "Content-Length"]
    max_age_seconds = 3600
  }
}

resource "aws_s3_bucket_policy" "medical_images" {
  bucket = aws_s3_bucket.medical_images.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.medical_images.arn,
          "${aws_s3_bucket.medical_images.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      },
      {
        Sid       = "DenyIncorrectEncryptionHeader"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.medical_images.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      },
      {
        Sid       = "DenyUnencryptedObjectUploads"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.medical_images.arn}/*"
        Condition = {
          Null = {
            "s3:x-amz-server-side-encryption" = "true"
          }
        }
      }
    ]
  })
}

# Object Lock Configuration for Medical Images (HIPAA/Legal Hold)
resource "aws_s3_bucket_object_lock_configuration" "medical_images" {
  count  = var.enable_object_lock ? 1 : 0
  bucket = aws_s3_bucket.medical_images.id

  rule {
    default_retention {
      mode = "GOVERNANCE"
      days = var.object_lock_retention_days
    }
  }
}

# ============================================
# Backups Bucket
# ============================================

resource "aws_s3_bucket" "backups" {
  bucket        = "${local.bucket_prefix}-backups"
  force_destroy = var.force_destroy

  tags = merge(local.tags, {
    Name             = "${local.name}-backups"
    Purpose          = "Database and System Backups"
    DataType         = "PHI"
    RetentionPolicy  = "35-days"
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
      kms_master_key_id = aws_kms_key.s3.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "backups" {
  bucket = aws_s3_bucket.backups.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_logging" "backups" {
  bucket = aws_s3_bucket.backups.id

  target_bucket = aws_s3_bucket.access_logs.id
  target_prefix = "backups/"
}

resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    id     = "daily-backups"
    status = "Enabled"

    filter {
      prefix = "daily/"
    }

    transition {
      days          = 7
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 30
      storage_class = "GLACIER"
    }

    expiration {
      days = 35
    }

    noncurrent_version_expiration {
      noncurrent_days = 7
    }
  }

  rule {
    id     = "weekly-backups"
    status = "Enabled"

    filter {
      prefix = "weekly/"
    }

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    expiration {
      days = 180
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }

  rule {
    id     = "monthly-backups"
    status = "Enabled"

    filter {
      prefix = "monthly/"
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
      days = 2555  # 7 years
    }

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }

  rule {
    id     = "abort-incomplete-uploads"
    status = "Enabled"

    filter {
      prefix = ""
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

resource "aws_s3_bucket_policy" "backups" {
  bucket = aws_s3_bucket.backups.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.backups.arn,
          "${aws_s3_bucket.backups.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      },
      {
        Sid       = "DenyIncorrectEncryptionHeader"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.backups.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      },
      {
        Sid       = "DenyUnencryptedObjectUploads"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.backups.arn}/*"
        Condition = {
          Null = {
            "s3:x-amz-server-side-encryption" = "true"
          }
        }
      }
    ]
  })
}

# Object Lock for Backups (Ransomware Protection)
resource "aws_s3_bucket_object_lock_configuration" "backups" {
  count  = var.enable_object_lock ? 1 : 0
  bucket = aws_s3_bucket.backups.id

  rule {
    default_retention {
      mode = "GOVERNANCE"
      days = 35
    }
  }
}

# ============================================
# Quarantine Bucket (Virus Scanning)
# ============================================

resource "aws_s3_bucket" "quarantine" {
  bucket        = "${local.bucket_prefix}-quarantine"
  force_destroy = var.force_destroy

  tags = merge(local.tags, {
    Name    = "${local.name}-quarantine"
    Purpose = "Malware Quarantine and Virus Scanning"
    DataType = "Untrusted"
  })
}

resource "aws_s3_bucket_versioning" "quarantine" {
  bucket = aws_s3_bucket.quarantine.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "quarantine" {
  bucket = aws_s3_bucket.quarantine.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "quarantine" {
  bucket = aws_s3_bucket.quarantine.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_logging" "quarantine" {
  bucket = aws_s3_bucket.quarantine.id

  target_bucket = aws_s3_bucket.access_logs.id
  target_prefix = "quarantine/"
}

resource "aws_s3_bucket_lifecycle_configuration" "quarantine" {
  bucket = aws_s3_bucket.quarantine.id

  rule {
    id     = "quarantine-cleanup"
    status = "Enabled"

    filter {
      prefix = ""
    }

    # Automatically delete quarantined files after 30 days
    expiration {
      days = 30
    }

    noncurrent_version_expiration {
      noncurrent_days = 7
    }
  }

  rule {
    id     = "abort-incomplete-uploads"
    status = "Enabled"

    filter {
      prefix = ""
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

resource "aws_s3_bucket_policy" "quarantine" {
  bucket = aws_s3_bucket.quarantine.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.quarantine.arn,
          "${aws_s3_bucket.quarantine.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      },
      {
        Sid       = "DenyIncorrectEncryptionHeader"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.quarantine.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      }
    ]
  })
}

# ============================================
# S3 Replication Configuration
# ============================================

# IAM Role for Replication
resource "aws_iam_role" "replication" {
  count = var.enable_replication ? 1 : 0
  name  = "${local.name}-s3-replication-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy" "replication" {
  count = var.enable_replication ? 1 : 0
  name  = "${local.name}-s3-replication-policy"
  role  = aws_iam_role.replication[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetReplicationConfiguration",
          "s3:ListBucket"
        ]
        Effect = "Allow"
        Resource = [
          aws_s3_bucket.documents.arn,
          aws_s3_bucket.medical_images.arn,
          aws_s3_bucket.backups.arn
        ]
      },
      {
        Action = [
          "s3:GetObjectVersionForReplication",
          "s3:GetObjectVersionAcl",
          "s3:GetObjectVersionTagging"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_s3_bucket.documents.arn}/*",
          "${aws_s3_bucket.medical_images.arn}/*",
          "${aws_s3_bucket.backups.arn}/*"
        ]
      },
      {
        Action = [
          "s3:ReplicateObject",
          "s3:ReplicateDelete",
          "s3:ReplicateTags"
        ]
        Effect   = "Allow"
        Resource = "${var.replication_destination_bucket_arn}/*"
      },
      {
        Action = [
          "kms:Decrypt"
        ]
        Effect = "Allow"
        Resource = [
          aws_kms_key.s3.arn
        ]
        Condition = {
          StringLike = {
            "kms:ViaService"   = "s3.${data.aws_region.current.name}.amazonaws.com"
            "kms:EncryptionContext:aws:s3:arn" = [
              "${aws_s3_bucket.documents.arn}/*",
              "${aws_s3_bucket.medical_images.arn}/*",
              "${aws_s3_bucket.backups.arn}/*"
            ]
          }
        }
      },
      {
        Action = [
          "kms:Encrypt"
        ]
        Effect   = "Allow"
        Resource = var.replication_destination_kms_key_arn != "" ? var.replication_destination_kms_key_arn : aws_kms_key.s3.arn
        Condition = {
          StringLike = {
            "kms:ViaService" = "s3.*.amazonaws.com"
          }
        }
      }
    ]
  })
}

# Replication Configuration for Documents Bucket
resource "aws_s3_bucket_replication_configuration" "documents" {
  count  = var.enable_replication ? 1 : 0
  bucket = aws_s3_bucket.documents.id
  role   = aws_iam_role.replication[0].arn

  rule {
    id     = "replicate-all-documents"
    status = "Enabled"

    filter {
      prefix = ""
    }

    destination {
      bucket        = var.replication_destination_bucket_arn
      storage_class = "STANDARD_IA"

      encryption_configuration {
        replica_kms_key_id = var.replication_destination_kms_key_arn != "" ? var.replication_destination_kms_key_arn : aws_kms_key.s3.arn
      }

      replication_time {
        status = "Enabled"
        time {
          minutes = 15
        }
      }

      metrics {
        event_threshold {
          minutes = 15
        }
        status = "Enabled"
      }
    }

    source_selection_criteria {
      sse_kms_encrypted_objects {
        status = "Enabled"
      }
    }

    delete_marker_replication {
      status = "Enabled"
    }
  }

  depends_on = [aws_s3_bucket_versioning.documents]
}

# Replication Configuration for Medical Images Bucket
resource "aws_s3_bucket_replication_configuration" "medical_images" {
  count  = var.enable_replication ? 1 : 0
  bucket = aws_s3_bucket.medical_images.id
  role   = aws_iam_role.replication[0].arn

  rule {
    id     = "replicate-all-medical-images"
    status = "Enabled"

    filter {
      prefix = ""
    }

    destination {
      bucket        = var.replication_destination_bucket_arn
      storage_class = "STANDARD_IA"

      encryption_configuration {
        replica_kms_key_id = var.replication_destination_kms_key_arn != "" ? var.replication_destination_kms_key_arn : aws_kms_key.s3.arn
      }

      replication_time {
        status = "Enabled"
        time {
          minutes = 15
        }
      }

      metrics {
        event_threshold {
          minutes = 15
        }
        status = "Enabled"
      }
    }

    source_selection_criteria {
      sse_kms_encrypted_objects {
        status = "Enabled"
      }
    }

    delete_marker_replication {
      status = "Enabled"
    }
  }

  depends_on = [aws_s3_bucket_versioning.medical_images]
}

# ============================================
# S3 Event Notifications (for virus scanning integration)
# ============================================

resource "aws_s3_bucket_notification" "quarantine_notifications" {
  count  = var.enable_virus_scanning ? 1 : 0
  bucket = aws_s3_bucket.quarantine.id

  lambda_function {
    lambda_function_arn = var.virus_scan_lambda_arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "incoming/"
  }

  depends_on = [aws_s3_bucket.quarantine]
}

# ============================================
# CloudWatch Metrics for S3 (HIPAA Monitoring)
# ============================================

resource "aws_s3_bucket_metric" "documents" {
  bucket = aws_s3_bucket.documents.id
  name   = "EntireBucket"
}

resource "aws_s3_bucket_metric" "medical_images" {
  bucket = aws_s3_bucket.medical_images.id
  name   = "EntireBucket"
}

resource "aws_s3_bucket_metric" "backups" {
  bucket = aws_s3_bucket.backups.id
  name   = "EntireBucket"
}

resource "aws_s3_bucket_metric" "quarantine" {
  bucket = aws_s3_bucket.quarantine.id
  name   = "EntireBucket"
}

# ============================================
# S3 Inventory Configuration (for compliance audits)
# ============================================

resource "aws_s3_bucket_inventory" "documents" {
  bucket = aws_s3_bucket.documents.id
  name   = "weekly-inventory"

  included_object_versions = "All"

  schedule {
    frequency = "Weekly"
  }

  destination {
    bucket {
      format     = "CSV"
      bucket_arn = aws_s3_bucket.access_logs.arn
      prefix     = "inventory/documents"
      encryption {
        sse_kms {
          key_id = aws_kms_key.s3.arn
        }
      }
    }
  }

  optional_fields = [
    "Size",
    "LastModifiedDate",
    "StorageClass",
    "ETag",
    "IsMultipartUploaded",
    "ReplicationStatus",
    "EncryptionStatus",
    "ObjectLockRetainUntilDate",
    "ObjectLockMode",
    "ObjectLockLegalHoldStatus",
    "IntelligentTieringAccessTier"
  ]
}

resource "aws_s3_bucket_inventory" "medical_images" {
  bucket = aws_s3_bucket.medical_images.id
  name   = "weekly-inventory"

  included_object_versions = "All"

  schedule {
    frequency = "Weekly"
  }

  destination {
    bucket {
      format     = "CSV"
      bucket_arn = aws_s3_bucket.access_logs.arn
      prefix     = "inventory/medical-images"
      encryption {
        sse_kms {
          key_id = aws_kms_key.s3.arn
        }
      }
    }
  }

  optional_fields = [
    "Size",
    "LastModifiedDate",
    "StorageClass",
    "ETag",
    "IsMultipartUploaded",
    "ReplicationStatus",
    "EncryptionStatus",
    "ObjectLockRetainUntilDate",
    "ObjectLockMode",
    "ObjectLockLegalHoldStatus"
  ]
}
