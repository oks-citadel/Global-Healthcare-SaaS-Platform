# ============================================
# S3 Module Outputs
# ============================================
# Exports bucket information for use by other modules
# ============================================

# ============================================
# Bucket IDs
# ============================================

output "bucket_ids" {
  description = "Map of all bucket IDs"
  value = {
    documents      = aws_s3_bucket.documents.id
    medical_images = aws_s3_bucket.medical_images.id
    backups        = aws_s3_bucket.backups.id
    quarantine     = aws_s3_bucket.quarantine.id
    access_logs    = aws_s3_bucket.access_logs.id
  }
}

output "documents_bucket_id" {
  description = "ID of the documents bucket"
  value       = aws_s3_bucket.documents.id
}

output "medical_images_bucket_id" {
  description = "ID of the medical images bucket"
  value       = aws_s3_bucket.medical_images.id
}

output "backups_bucket_id" {
  description = "ID of the backups bucket"
  value       = aws_s3_bucket.backups.id
}

output "quarantine_bucket_id" {
  description = "ID of the quarantine bucket"
  value       = aws_s3_bucket.quarantine.id
}

output "access_logs_bucket_id" {
  description = "ID of the access logs bucket"
  value       = aws_s3_bucket.access_logs.id
}

# ============================================
# Bucket ARNs
# ============================================

output "bucket_arns" {
  description = "Map of all bucket ARNs"
  value = {
    documents      = aws_s3_bucket.documents.arn
    medical_images = aws_s3_bucket.medical_images.arn
    backups        = aws_s3_bucket.backups.arn
    quarantine     = aws_s3_bucket.quarantine.arn
    access_logs    = aws_s3_bucket.access_logs.arn
  }
}

output "documents_bucket_arn" {
  description = "ARN of the documents bucket"
  value       = aws_s3_bucket.documents.arn
}

output "medical_images_bucket_arn" {
  description = "ARN of the medical images bucket"
  value       = aws_s3_bucket.medical_images.arn
}

output "backups_bucket_arn" {
  description = "ARN of the backups bucket"
  value       = aws_s3_bucket.backups.arn
}

output "quarantine_bucket_arn" {
  description = "ARN of the quarantine bucket"
  value       = aws_s3_bucket.quarantine.arn
}

output "access_logs_bucket_arn" {
  description = "ARN of the access logs bucket"
  value       = aws_s3_bucket.access_logs.arn
}

# ============================================
# Bucket Domain Names
# ============================================

output "bucket_domain_names" {
  description = "Map of all bucket domain names"
  value = {
    documents      = aws_s3_bucket.documents.bucket_domain_name
    medical_images = aws_s3_bucket.medical_images.bucket_domain_name
    backups        = aws_s3_bucket.backups.bucket_domain_name
    quarantine     = aws_s3_bucket.quarantine.bucket_domain_name
    access_logs    = aws_s3_bucket.access_logs.bucket_domain_name
  }
}

output "documents_bucket_domain_name" {
  description = "Domain name of the documents bucket"
  value       = aws_s3_bucket.documents.bucket_domain_name
}

output "medical_images_bucket_domain_name" {
  description = "Domain name of the medical images bucket"
  value       = aws_s3_bucket.medical_images.bucket_domain_name
}

output "backups_bucket_domain_name" {
  description = "Domain name of the backups bucket"
  value       = aws_s3_bucket.backups.bucket_domain_name
}

output "quarantine_bucket_domain_name" {
  description = "Domain name of the quarantine bucket"
  value       = aws_s3_bucket.quarantine.bucket_domain_name
}

# ============================================
# Regional Domain Names (for S3 Transfer Acceleration)
# ============================================

output "bucket_regional_domain_names" {
  description = "Map of all bucket regional domain names"
  value = {
    documents      = aws_s3_bucket.documents.bucket_regional_domain_name
    medical_images = aws_s3_bucket.medical_images.bucket_regional_domain_name
    backups        = aws_s3_bucket.backups.bucket_regional_domain_name
    quarantine     = aws_s3_bucket.quarantine.bucket_regional_domain_name
    access_logs    = aws_s3_bucket.access_logs.bucket_regional_domain_name
  }
}

# ============================================
# KMS Key Information
# ============================================

output "kms_key_id" {
  description = "ID of the KMS key used for S3 encryption"
  value       = aws_kms_key.s3.key_id
}

output "kms_key_arn" {
  description = "ARN of the KMS key used for S3 encryption"
  value       = aws_kms_key.s3.arn
}

output "kms_key_alias" {
  description = "Alias of the KMS key"
  value       = aws_kms_alias.s3.name
}

# ============================================
# Replication Information
# ============================================

output "replication_role_arn" {
  description = "ARN of the IAM role used for S3 replication"
  value       = var.enable_replication ? aws_iam_role.replication[0].arn : null
}

output "replication_enabled" {
  description = "Whether cross-region replication is enabled"
  value       = var.enable_replication
}

# ============================================
# Bucket Names (for reference)
# ============================================

output "bucket_names" {
  description = "Map of all bucket names"
  value = {
    documents      = aws_s3_bucket.documents.bucket
    medical_images = aws_s3_bucket.medical_images.bucket
    backups        = aws_s3_bucket.backups.bucket
    quarantine     = aws_s3_bucket.quarantine.bucket
    access_logs    = aws_s3_bucket.access_logs.bucket
  }
}

# ============================================
# Versioning Status
# ============================================

output "versioning_enabled" {
  description = "Whether versioning is enabled on buckets"
  value       = var.enable_versioning
}

# ============================================
# Object Lock Status
# ============================================

output "object_lock_enabled" {
  description = "Whether Object Lock is enabled"
  value       = var.enable_object_lock
}

output "object_lock_retention_days" {
  description = "Object Lock retention period in days"
  value       = var.enable_object_lock ? var.object_lock_retention_days : null
}

# ============================================
# IAM Policy Documents (for external use)
# ============================================

output "read_only_policy_document" {
  description = "IAM policy document for read-only access to all buckets"
  value = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3ReadOnlyAccess"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:GetObjectTagging",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [
          aws_s3_bucket.documents.arn,
          "${aws_s3_bucket.documents.arn}/*",
          aws_s3_bucket.medical_images.arn,
          "${aws_s3_bucket.medical_images.arn}/*"
        ]
      },
      {
        Sid    = "KMSDecryptAccess"
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:DescribeKey"
        ]
        Resource = aws_kms_key.s3.arn
      }
    ]
  })
}

output "read_write_policy_document" {
  description = "IAM policy document for read-write access to documents and medical images buckets"
  value = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3ReadWriteAccess"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:GetObjectTagging",
          "s3:PutObject",
          "s3:PutObjectTagging",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [
          aws_s3_bucket.documents.arn,
          "${aws_s3_bucket.documents.arn}/*",
          aws_s3_bucket.medical_images.arn,
          "${aws_s3_bucket.medical_images.arn}/*"
        ]
      },
      {
        Sid    = "KMSAccess"
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:Encrypt",
          "kms:GenerateDataKey",
          "kms:DescribeKey"
        ]
        Resource = aws_kms_key.s3.arn
      }
    ]
  })
}

output "backup_policy_document" {
  description = "IAM policy document for backup operations"
  value = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3BackupAccess"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:PutObject",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [
          aws_s3_bucket.backups.arn,
          "${aws_s3_bucket.backups.arn}/*"
        ]
      },
      {
        Sid    = "KMSBackupAccess"
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:Encrypt",
          "kms:GenerateDataKey",
          "kms:DescribeKey"
        ]
        Resource = aws_kms_key.s3.arn
      }
    ]
  })
}

# ============================================
# Compliance Information
# ============================================

output "compliance_info" {
  description = "Compliance-related information for auditing"
  value = {
    encryption_type     = "AES-256-KMS"
    encryption_key_arn  = aws_kms_key.s3.arn
    versioning_enabled  = var.enable_versioning
    access_logging      = true
    public_access_blocked = true
    ssl_enforced        = true
    object_lock_enabled = var.enable_object_lock
    replication_enabled = var.enable_replication
  }
}

# ============================================
# Endpoint URLs for Application Configuration
# ============================================

output "s3_endpoints" {
  description = "S3 endpoint URLs for application configuration"
  value = {
    documents      = "s3://${aws_s3_bucket.documents.bucket}"
    medical_images = "s3://${aws_s3_bucket.medical_images.bucket}"
    backups        = "s3://${aws_s3_bucket.backups.bucket}"
    quarantine     = "s3://${aws_s3_bucket.quarantine.bucket}"
  }
}
