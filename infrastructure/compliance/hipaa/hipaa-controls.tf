# HIPAA Technical Safeguards for UnifiedHealth Platform - AWS
# Implements 45 CFR Section 164.312 - Technical Safeguards
# Migrated from Azure to AWS

terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "region" {
  description = "AWS region for HIPAA compliant resources"
  type        = string
  default     = "us-east-1"
}

variable "organization_name" {
  description = "Organization name for resource naming"
  type        = string
  default     = "unifiedhealth"
}

variable "security_contact_email" {
  description = "Security contact email for alerts"
  type        = string
}

variable "security_contact_phone" {
  description = "Security contact phone"
  type        = string
  default     = ""
}

variable "vpc_id" {
  description = "VPC ID for HIPAA resources"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for HIPAA resources"
  type        = list(string)
}

variable "allowed_ip_ranges" {
  description = "Allowed IP CIDR ranges for access"
  type        = list(string)
  default     = []
}

# HIPAA compliant tags
locals {
  hipaa_tags = {
    Compliance         = "HIPAA"
    DataClassification = "PHI"
    Environment        = var.environment
    ManagedBy          = "Terraform"
    CostCenter         = "Healthcare-Compliance"
    BackupRequired     = "true"
    Encryption         = "AES-256"
    RetentionYears     = "7"
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# =============================================================================
# AWS Security Hub - Replaces Azure Security Center
# =============================================================================

resource "aws_securityhub_account" "hipaa" {
  enable_default_standards = false
  control_finding_generator = "SECURITY_CONTROL"
  auto_enable_controls     = true
}

# Enable HIPAA standards in Security Hub
resource "aws_securityhub_standards_subscription" "hipaa" {
  depends_on    = [aws_securityhub_account.hipaa]
  standards_arn = "arn:aws:securityhub:${data.aws_region.current.name}::standards/hipaa-security/v/1.0.0"
}

# Enable AWS Foundational Security Best Practices
resource "aws_securityhub_standards_subscription" "aws_foundational" {
  depends_on    = [aws_securityhub_account.hipaa]
  standards_arn = "arn:aws:securityhub:${data.aws_region.current.name}::standards/aws-foundational-security-best-practices/v/1.0.0"
}

# =============================================================================
# AWS Config Rules - Replaces Azure Policy
# =============================================================================

resource "aws_config_configuration_recorder" "hipaa" {
  name     = "hipaa-config-recorder-${var.environment}"
  role_arn = aws_iam_role.config_role.arn

  recording_group {
    all_supported                 = true
    include_global_resource_types = true
  }
}

resource "aws_config_configuration_recorder_status" "hipaa" {
  name       = aws_config_configuration_recorder.hipaa.name
  is_enabled = true
  depends_on = [aws_config_delivery_channel.hipaa]
}

resource "aws_config_delivery_channel" "hipaa" {
  name           = "hipaa-config-delivery-${var.environment}"
  s3_bucket_name = aws_s3_bucket.config_logs.id
  sns_topic_arn  = aws_sns_topic.hipaa_alerts.arn

  snapshot_delivery_properties {
    delivery_frequency = "Six_Hours"
  }

  depends_on = [aws_config_configuration_recorder.hipaa]
}

# S3 bucket for Config logs
resource "aws_s3_bucket" "config_logs" {
  bucket = "${var.organization_name}-hipaa-config-logs-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.hipaa_tags, {
    Purpose = "AWS-Config-Logs"
  })
}

resource "aws_s3_bucket_versioning" "config_logs" {
  bucket = aws_s3_bucket.config_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "config_logs" {
  bucket = aws_s3_bucket.config_logs.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.phi_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "config_logs" {
  bucket = aws_s3_bucket.config_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "config_logs" {
  bucket = aws_s3_bucket.config_logs.id

  rule {
    id     = "hipaa-retention"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }

    expiration {
      days = 2555 # 7 years for HIPAA
    }
  }
}

# IAM role for AWS Config
resource "aws_iam_role" "config_role" {
  name = "hipaa-config-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "config.amazonaws.com"
        }
      }
    ]
  })

  tags = local.hipaa_tags
}

resource "aws_iam_role_policy_attachment" "config_policy" {
  role       = aws_iam_role.config_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWS_ConfigRole"
}

resource "aws_iam_role_policy" "config_s3_policy" {
  name = "config-s3-policy"
  role = aws_iam_role.config_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl"
        ]
        Resource = "${aws_s3_bucket.config_logs.arn}/*"
        Condition = {
          StringLike = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      },
      {
        Effect   = "Allow"
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.config_logs.arn
      }
    ]
  })
}

# HIPAA Config Rules
resource "aws_config_config_rule" "encrypted_volumes" {
  name = "hipaa-encrypted-volumes-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "ENCRYPTED_VOLUMES"
  }

  tags = local.hipaa_tags

  depends_on = [aws_config_configuration_recorder.hipaa]
}

resource "aws_config_config_rule" "s3_bucket_ssl_requests_only" {
  name = "hipaa-s3-ssl-only-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "S3_BUCKET_SSL_REQUESTS_ONLY"
  }

  tags = local.hipaa_tags

  depends_on = [aws_config_configuration_recorder.hipaa]
}

resource "aws_config_config_rule" "rds_storage_encrypted" {
  name = "hipaa-rds-encrypted-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "RDS_STORAGE_ENCRYPTED"
  }

  tags = local.hipaa_tags

  depends_on = [aws_config_configuration_recorder.hipaa]
}

resource "aws_config_config_rule" "cloudtrail_enabled" {
  name = "hipaa-cloudtrail-enabled-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "CLOUD_TRAIL_ENABLED"
  }

  tags = local.hipaa_tags

  depends_on = [aws_config_configuration_recorder.hipaa]
}

resource "aws_config_config_rule" "iam_password_policy" {
  name = "hipaa-iam-password-policy-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "IAM_PASSWORD_POLICY"
  }

  input_parameters = jsonencode({
    RequireUppercaseCharacters = "true"
    RequireLowercaseCharacters = "true"
    RequireSymbols             = "true"
    RequireNumbers             = "true"
    MinimumPasswordLength      = "14"
    PasswordReusePrevention    = "24"
    MaxPasswordAge             = "90"
  })

  tags = local.hipaa_tags

  depends_on = [aws_config_configuration_recorder.hipaa]
}

resource "aws_config_config_rule" "access_keys_rotated" {
  name = "hipaa-access-keys-rotated-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "ACCESS_KEYS_ROTATED"
  }

  input_parameters = jsonencode({
    maxAccessKeyAge = "90"
  })

  tags = local.hipaa_tags

  depends_on = [aws_config_configuration_recorder.hipaa]
}

resource "aws_config_config_rule" "mfa_enabled_for_iam_console" {
  name = "hipaa-mfa-enabled-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "MFA_ENABLED_FOR_IAM_CONSOLE_ACCESS"
  }

  tags = local.hipaa_tags

  depends_on = [aws_config_configuration_recorder.hipaa]
}

resource "aws_config_config_rule" "root_account_mfa" {
  name = "hipaa-root-mfa-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "ROOT_ACCOUNT_MFA_ENABLED"
  }

  tags = local.hipaa_tags

  depends_on = [aws_config_configuration_recorder.hipaa]
}

resource "aws_config_config_rule" "vpc_flow_logs_enabled" {
  name = "hipaa-vpc-flow-logs-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "VPC_FLOW_LOGS_ENABLED"
  }

  tags = local.hipaa_tags

  depends_on = [aws_config_configuration_recorder.hipaa]
}

resource "aws_config_config_rule" "cloudwatch_log_group_encrypted" {
  name = "hipaa-cloudwatch-encrypted-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "CLOUDWATCH_LOG_GROUP_ENCRYPTED"
  }

  tags = local.hipaa_tags

  depends_on = [aws_config_configuration_recorder.hipaa]
}

# =============================================================================
# AWS KMS - Replaces Azure Key Vault encryption
# =============================================================================

# Primary PHI encryption key
resource "aws_kms_key" "phi_encryption_key" {
  description              = "HIPAA PHI encryption key for ${var.environment}"
  deletion_window_in_days  = 30
  enable_key_rotation      = true
  is_enabled               = true
  customer_master_key_spec = "SYMMETRIC_DEFAULT"
  key_usage                = "ENCRYPT_DECRYPT"
  multi_region             = false

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "hipaa-phi-key-policy"
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
        Sid    = "Allow CloudWatch Logs"
        Effect = "Allow"
        Principal = {
          Service = "logs.${data.aws_region.current.name}.amazonaws.com"
        }
        Action = [
          "kms:Encrypt*",
          "kms:Decrypt*",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:Describe*"
        ]
        Resource = "*"
        Condition = {
          ArnLike = {
            "kms:EncryptionContext:aws:logs:arn" = "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"
          }
        }
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
        Sid    = "Allow RDS Service"
        Effect = "Allow"
        Principal = {
          Service = "rds.amazonaws.com"
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

  tags = merge(local.hipaa_tags, {
    Purpose = "PHI-Encryption"
    KeyType = "CMK"
  })
}

resource "aws_kms_alias" "phi_encryption_key" {
  name          = "alias/hipaa-phi-key-${var.environment}"
  target_key_id = aws_kms_key.phi_encryption_key.key_id
}

# Field-level encryption key
resource "aws_kms_key" "field_level_encryption_key" {
  description              = "HIPAA field-level encryption key for ${var.environment}"
  deletion_window_in_days  = 30
  enable_key_rotation      = true
  is_enabled               = true
  customer_master_key_spec = "SYMMETRIC_DEFAULT"
  key_usage                = "ENCRYPT_DECRYPT"

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "hipaa-field-key-policy"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      }
    ]
  })

  tags = merge(local.hipaa_tags, {
    Purpose = "Field-Level-Encryption"
  })
}

resource "aws_kms_alias" "field_level_encryption_key" {
  name          = "alias/hipaa-field-key-${var.environment}"
  target_key_id = aws_kms_key.field_level_encryption_key.key_id
}

# Backup encryption key
resource "aws_kms_key" "backup_encryption_key" {
  description              = "HIPAA backup encryption key for ${var.environment}"
  deletion_window_in_days  = 30
  enable_key_rotation      = true
  is_enabled               = true
  customer_master_key_spec = "SYMMETRIC_DEFAULT"
  key_usage                = "ENCRYPT_DECRYPT"

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "hipaa-backup-key-policy"
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
        Sid    = "Allow Backup Service"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
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

  tags = merge(local.hipaa_tags, {
    Purpose = "Backup-Encryption"
  })
}

resource "aws_kms_alias" "backup_encryption_key" {
  name          = "alias/hipaa-backup-key-${var.environment}"
  target_key_id = aws_kms_key.backup_encryption_key.key_id
}

# =============================================================================
# AWS CloudTrail - Replaces Azure Activity Log
# =============================================================================

resource "aws_cloudtrail" "hipaa" {
  name                          = "hipaa-cloudtrail-${var.environment}"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_logs.id
  s3_key_prefix                 = "cloudtrail"
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_logging                = true
  enable_log_file_validation    = true
  kms_key_id                    = aws_kms_key.phi_encryption_key.arn
  cloud_watch_logs_group_arn    = "${aws_cloudwatch_log_group.cloudtrail.arn}:*"
  cloud_watch_logs_role_arn     = aws_iam_role.cloudtrail_cloudwatch.arn

  event_selector {
    read_write_type           = "All"
    include_management_events = true

    data_resource {
      type   = "AWS::S3::Object"
      values = ["arn:aws:s3"]
    }
  }

  event_selector {
    read_write_type           = "All"
    include_management_events = true

    data_resource {
      type   = "AWS::Lambda::Function"
      values = ["arn:aws:lambda"]
    }
  }

  insight_selector {
    insight_type = "ApiCallRateInsight"
  }

  insight_selector {
    insight_type = "ApiErrorRateInsight"
  }

  tags = merge(local.hipaa_tags, {
    Purpose = "HIPAA-Audit-Trail"
  })

  depends_on = [aws_s3_bucket_policy.cloudtrail_logs]
}

# CloudTrail S3 bucket
resource "aws_s3_bucket" "cloudtrail_logs" {
  bucket = "${var.organization_name}-hipaa-cloudtrail-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.hipaa_tags, {
    Purpose = "CloudTrail-Logs"
  })
}

resource "aws_s3_bucket_versioning" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.phi_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  rule {
    id     = "hipaa-retention"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }

    expiration {
      days = 2555 # 7 years for HIPAA
    }
  }
}

resource "aws_s3_bucket_policy" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AWSCloudTrailAclCheck"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.cloudtrail_logs.arn
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = "arn:aws:cloudtrail:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:trail/hipaa-cloudtrail-${var.environment}"
          }
        }
      },
      {
        Sid    = "AWSCloudTrailWrite"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.cloudtrail_logs.arn}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl"  = "bucket-owner-full-control"
            "AWS:SourceArn" = "arn:aws:cloudtrail:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:trail/hipaa-cloudtrail-${var.environment}"
          }
        }
      },
      {
        Sid    = "DenyInsecureTransport"
        Effect = "Deny"
        Principal = "*"
        Action = "s3:*"
        Resource = [
          aws_s3_bucket.cloudtrail_logs.arn,
          "${aws_s3_bucket.cloudtrail_logs.arn}/*"
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

# CloudWatch Log Group for CloudTrail
resource "aws_cloudwatch_log_group" "cloudtrail" {
  name              = "/aws/cloudtrail/hipaa-${var.environment}"
  retention_in_days = 2555 # 7 years for HIPAA
  kms_key_id        = aws_kms_key.phi_encryption_key.arn

  tags = merge(local.hipaa_tags, {
    Purpose = "CloudTrail-Logs"
  })
}

# IAM role for CloudTrail to CloudWatch
resource "aws_iam_role" "cloudtrail_cloudwatch" {
  name = "hipaa-cloudtrail-cloudwatch-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
      }
    ]
  })

  tags = local.hipaa_tags
}

resource "aws_iam_role_policy" "cloudtrail_cloudwatch" {
  name = "cloudtrail-cloudwatch-policy"
  role = aws_iam_role.cloudtrail_cloudwatch.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.cloudtrail.arn}:*"
      }
    ]
  })
}

# =============================================================================
# CloudWatch Logs - Replaces Azure Diagnostic Settings
# =============================================================================

resource "aws_cloudwatch_log_group" "hipaa_audit" {
  name              = "/hipaa/audit/${var.environment}"
  retention_in_days = 2555 # 7 years for HIPAA
  kms_key_id        = aws_kms_key.phi_encryption_key.arn

  tags = merge(local.hipaa_tags, {
    Purpose = "HIPAA-Audit-Logs"
  })
}

resource "aws_cloudwatch_log_group" "phi_access" {
  name              = "/hipaa/phi-access/${var.environment}"
  retention_in_days = 2555 # 7 years for HIPAA
  kms_key_id        = aws_kms_key.phi_encryption_key.arn

  tags = merge(local.hipaa_tags, {
    Purpose = "PHI-Access-Logs"
  })
}

resource "aws_cloudwatch_log_group" "security_events" {
  name              = "/hipaa/security/${var.environment}"
  retention_in_days = 2555 # 7 years for HIPAA
  kms_key_id        = aws_kms_key.phi_encryption_key.arn

  tags = merge(local.hipaa_tags, {
    Purpose = "Security-Event-Logs"
  })
}

# =============================================================================
# HIPAA Compliant S3 Bucket for PHI Data - Replaces Azure Storage
# =============================================================================

resource "aws_s3_bucket" "hipaa_storage" {
  bucket = "${var.organization_name}-hipaa-phi-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.hipaa_tags, {
    Purpose = "PHI-Storage"
  })
}

resource "aws_s3_bucket_versioning" "hipaa_storage" {
  bucket = aws_s3_bucket.hipaa_storage.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "hipaa_storage" {
  bucket = aws_s3_bucket.hipaa_storage.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.phi_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "hipaa_storage" {
  bucket = aws_s3_bucket.hipaa_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_logging" "hipaa_storage" {
  bucket        = aws_s3_bucket.hipaa_storage.id
  target_bucket = aws_s3_bucket.access_logs.id
  target_prefix = "hipaa-storage-logs/"
}

resource "aws_s3_bucket_lifecycle_configuration" "hipaa_storage" {
  bucket = aws_s3_bucket.hipaa_storage.id

  rule {
    id     = "hipaa-retention"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }

    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "STANDARD_IA"
    }

    noncurrent_version_expiration {
      noncurrent_days = 2555 # 7 years
    }
  }
}

resource "aws_s3_bucket_policy" "hipaa_storage" {
  bucket = aws_s3_bucket.hipaa_storage.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.hipaa_storage.arn,
          "${aws_s3_bucket.hipaa_storage.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      },
      {
        Sid       = "DenyUnencryptedUploads"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.hipaa_storage.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      }
    ]
  })
}

# S3 bucket for access logs
resource "aws_s3_bucket" "access_logs" {
  bucket = "${var.organization_name}-hipaa-access-logs-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.hipaa_tags, {
    Purpose = "Access-Logs"
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
      kms_master_key_id = aws_kms_key.phi_encryption_key.arn
      sse_algorithm     = "aws:kms"
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
    id     = "hipaa-retention"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }

    expiration {
      days = 2555 # 7 years for HIPAA
    }
  }
}

# =============================================================================
# AWS GuardDuty - Replaces Azure Advanced Threat Protection
# =============================================================================

resource "aws_guardduty_detector" "hipaa" {
  enable                       = true
  finding_publishing_frequency = "FIFTEEN_MINUTES"

  datasources {
    s3_logs {
      enable = true
    }
    kubernetes {
      audit_logs {
        enable = true
      }
    }
    malware_protection {
      scan_ec2_instance_with_findings {
        ebs_volumes {
          enable = true
        }
      }
    }
  }

  tags = merge(local.hipaa_tags, {
    Purpose = "Threat-Detection"
  })
}

# GuardDuty findings to SNS
resource "aws_cloudwatch_event_rule" "guardduty_findings" {
  name        = "hipaa-guardduty-findings-${var.environment}"
  description = "Capture GuardDuty findings for HIPAA compliance"

  event_pattern = jsonencode({
    source      = ["aws.guardduty"]
    detail-type = ["GuardDuty Finding"]
    detail = {
      severity = [
        { numeric = [">=", 4] }
      ]
    }
  })

  tags = local.hipaa_tags
}

resource "aws_cloudwatch_event_target" "guardduty_sns" {
  rule      = aws_cloudwatch_event_rule.guardduty_findings.name
  target_id = "SendToSNS"
  arn       = aws_sns_topic.hipaa_alerts.arn
}

# =============================================================================
# SNS Topic for HIPAA Alerts
# =============================================================================

resource "aws_sns_topic" "hipaa_alerts" {
  name              = "hipaa-security-alerts-${var.environment}"
  kms_master_key_id = aws_kms_key.phi_encryption_key.id

  tags = merge(local.hipaa_tags, {
    Purpose = "Security-Alerts"
  })
}

resource "aws_sns_topic_policy" "hipaa_alerts" {
  arn = aws_sns_topic.hipaa_alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudWatchEvents"
        Effect = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.hipaa_alerts.arn
      },
      {
        Sid    = "AllowCloudWatchAlarms"
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.hipaa_alerts.arn
      }
    ]
  })
}

resource "aws_sns_topic_subscription" "security_email" {
  topic_arn = aws_sns_topic.hipaa_alerts.arn
  protocol  = "email"
  endpoint  = var.security_contact_email
}

# =============================================================================
# CloudWatch Alarms for HIPAA Monitoring
# =============================================================================

resource "aws_cloudwatch_metric_alarm" "unauthorized_api_calls" {
  alarm_name          = "hipaa-unauthorized-api-calls-${var.environment}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "UnauthorizedAttemptCount"
  namespace           = "CloudTrailMetrics"
  period              = 300
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "Unauthorized API calls detected - HIPAA violation potential"
  alarm_actions       = [aws_sns_topic.hipaa_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.hipaa_tags, {
    AlertType = "Security"
  })
}

resource "aws_cloudwatch_metric_alarm" "root_account_usage" {
  alarm_name          = "hipaa-root-account-usage-${var.environment}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "RootAccountUsage"
  namespace           = "CloudTrailMetrics"
  period              = 300
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "Root account usage detected - HIPAA violation potential"
  alarm_actions       = [aws_sns_topic.hipaa_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.hipaa_tags, {
    AlertType = "Security"
  })
}

resource "aws_cloudwatch_metric_alarm" "iam_policy_changes" {
  alarm_name          = "hipaa-iam-policy-changes-${var.environment}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "IAMPolicyEventCount"
  namespace           = "CloudTrailMetrics"
  period              = 300
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "IAM policy changes detected"
  alarm_actions       = [aws_sns_topic.hipaa_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.hipaa_tags, {
    AlertType = "Authorization"
  })
}

resource "aws_cloudwatch_metric_alarm" "cloudtrail_config_changes" {
  alarm_name          = "hipaa-cloudtrail-changes-${var.environment}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "CloudTrailEventCount"
  namespace           = "CloudTrailMetrics"
  period              = 300
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "CloudTrail configuration changes detected"
  alarm_actions       = [aws_sns_topic.hipaa_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.hipaa_tags, {
    AlertType = "AuditConfiguration"
  })
}

resource "aws_cloudwatch_metric_alarm" "security_group_changes" {
  alarm_name          = "hipaa-security-group-changes-${var.environment}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "SecurityGroupEventCount"
  namespace           = "CloudTrailMetrics"
  period              = 300
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "Security group changes detected"
  alarm_actions       = [aws_sns_topic.hipaa_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.hipaa_tags, {
    AlertType = "NetworkSecurity"
  })
}

resource "aws_cloudwatch_metric_alarm" "kms_key_disabled" {
  alarm_name          = "hipaa-kms-key-disabled-${var.environment}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "KMSKeyDisabled"
  namespace           = "CloudTrailMetrics"
  period              = 300
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "KMS key disabled or scheduled for deletion"
  alarm_actions       = [aws_sns_topic.hipaa_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.hipaa_tags, {
    AlertType = "Encryption"
  })
}

# =============================================================================
# CloudWatch Log Metric Filters
# =============================================================================

resource "aws_cloudwatch_log_metric_filter" "unauthorized_api_calls" {
  name           = "hipaa-unauthorized-api-calls-${var.environment}"
  pattern        = "{ ($.errorCode = \"*UnauthorizedAccess*\") || ($.errorCode = \"AccessDenied*\") }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail.name

  metric_transformation {
    name      = "UnauthorizedAttemptCount"
    namespace = "CloudTrailMetrics"
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "root_account_usage" {
  name           = "hipaa-root-account-usage-${var.environment}"
  pattern        = "{ $.userIdentity.type = \"Root\" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != \"AwsServiceEvent\" }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail.name

  metric_transformation {
    name      = "RootAccountUsage"
    namespace = "CloudTrailMetrics"
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "iam_policy_changes" {
  name           = "hipaa-iam-policy-changes-${var.environment}"
  pattern        = "{ ($.eventName=DeleteGroupPolicy) || ($.eventName=DeleteRolePolicy) || ($.eventName=DeleteUserPolicy) || ($.eventName=PutGroupPolicy) || ($.eventName=PutRolePolicy) || ($.eventName=PutUserPolicy) || ($.eventName=CreatePolicy) || ($.eventName=DeletePolicy) || ($.eventName=CreatePolicyVersion) || ($.eventName=DeletePolicyVersion) || ($.eventName=AttachRolePolicy) || ($.eventName=DetachRolePolicy) || ($.eventName=AttachUserPolicy) || ($.eventName=DetachUserPolicy) || ($.eventName=AttachGroupPolicy) || ($.eventName=DetachGroupPolicy) }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail.name

  metric_transformation {
    name      = "IAMPolicyEventCount"
    namespace = "CloudTrailMetrics"
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "cloudtrail_config_changes" {
  name           = "hipaa-cloudtrail-changes-${var.environment}"
  pattern        = "{ ($.eventName = CreateTrail) || ($.eventName = UpdateTrail) || ($.eventName = DeleteTrail) || ($.eventName = StartLogging) || ($.eventName = StopLogging) }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail.name

  metric_transformation {
    name      = "CloudTrailEventCount"
    namespace = "CloudTrailMetrics"
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "security_group_changes" {
  name           = "hipaa-security-group-changes-${var.environment}"
  pattern        = "{ ($.eventName = AuthorizeSecurityGroupIngress) || ($.eventName = AuthorizeSecurityGroupEgress) || ($.eventName = RevokeSecurityGroupIngress) || ($.eventName = RevokeSecurityGroupEgress) || ($.eventName = CreateSecurityGroup) || ($.eventName = DeleteSecurityGroup) }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail.name

  metric_transformation {
    name      = "SecurityGroupEventCount"
    namespace = "CloudTrailMetrics"
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "kms_key_disabled" {
  name           = "hipaa-kms-key-disabled-${var.environment}"
  pattern        = "{ ($.eventSource = kms.amazonaws.com) && (($.eventName = DisableKey) || ($.eventName = ScheduleKeyDeletion)) }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail.name

  metric_transformation {
    name      = "KMSKeyDisabled"
    namespace = "CloudTrailMetrics"
    value     = "1"
  }
}

# =============================================================================
# AWS Backup for HIPAA Compliance
# =============================================================================

resource "aws_backup_vault" "hipaa" {
  name        = "hipaa-backup-vault-${var.environment}"
  kms_key_arn = aws_kms_key.backup_encryption_key.arn

  tags = merge(local.hipaa_tags, {
    Purpose = "HIPAA-Backup"
  })
}

resource "aws_backup_plan" "hipaa" {
  name = "hipaa-backup-plan-${var.environment}"

  rule {
    rule_name         = "daily-backup"
    target_vault_name = aws_backup_vault.hipaa.name
    schedule          = "cron(0 5 ? * * *)" # Daily at 5 AM UTC

    lifecycle {
      cold_storage_after = 90
      delete_after       = 2555 # 7 years for HIPAA
    }

    copy_action {
      destination_vault_arn = aws_backup_vault.hipaa.arn
      lifecycle {
        cold_storage_after = 90
        delete_after       = 2555
      }
    }
  }

  rule {
    rule_name         = "weekly-backup"
    target_vault_name = aws_backup_vault.hipaa.name
    schedule          = "cron(0 5 ? * SUN *)" # Weekly on Sunday

    lifecycle {
      cold_storage_after = 90
      delete_after       = 2555
    }
  }

  tags = local.hipaa_tags
}

resource "aws_backup_selection" "hipaa" {
  iam_role_arn = aws_iam_role.backup_role.arn
  name         = "hipaa-backup-selection-${var.environment}"
  plan_id      = aws_backup_plan.hipaa.id

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Compliance"
    value = "HIPAA"
  }
}

resource "aws_iam_role" "backup_role" {
  name = "hipaa-backup-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
      }
    ]
  })

  tags = local.hipaa_tags
}

resource "aws_iam_role_policy_attachment" "backup_policy" {
  role       = aws_iam_role.backup_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
}

resource "aws_iam_role_policy_attachment" "restore_policy" {
  role       = aws_iam_role.backup_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores"
}

# =============================================================================
# AWS Secrets Manager - For storing sensitive credentials
# =============================================================================

resource "aws_secretsmanager_secret" "database_credentials" {
  name                    = "hipaa/database-credentials-${var.environment}"
  description             = "HIPAA compliant database credentials"
  kms_key_id              = aws_kms_key.phi_encryption_key.arn
  recovery_window_in_days = 30

  tags = local.hipaa_tags
}

resource "random_password" "database_password" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret_version" "database_credentials" {
  secret_id = aws_secretsmanager_secret.database_credentials.id
  secret_string = jsonencode({
    username = "hipaa_admin"
    password = random_password.database_password.result
  })
}

# =============================================================================
# Outputs
# =============================================================================

output "security_hub_account_id" {
  description = "Security Hub account ID"
  value       = aws_securityhub_account.hipaa.id
}

output "phi_encryption_key_arn" {
  description = "PHI encryption key ARN"
  value       = aws_kms_key.phi_encryption_key.arn
}

output "phi_encryption_key_id" {
  description = "PHI encryption key ID"
  value       = aws_kms_key.phi_encryption_key.key_id
}

output "field_level_encryption_key_arn" {
  description = "Field-level encryption key ARN"
  value       = aws_kms_key.field_level_encryption_key.arn
}

output "backup_encryption_key_arn" {
  description = "Backup encryption key ARN"
  value       = aws_kms_key.backup_encryption_key.arn
}

output "cloudtrail_arn" {
  description = "CloudTrail ARN"
  value       = aws_cloudtrail.hipaa.arn
}

output "cloudtrail_s3_bucket" {
  description = "CloudTrail S3 bucket name"
  value       = aws_s3_bucket.cloudtrail_logs.id
}

output "hipaa_storage_bucket" {
  description = "HIPAA PHI storage bucket name"
  value       = aws_s3_bucket.hipaa_storage.id
}

output "hipaa_storage_bucket_arn" {
  description = "HIPAA PHI storage bucket ARN"
  value       = aws_s3_bucket.hipaa_storage.arn
}

output "guardduty_detector_id" {
  description = "GuardDuty detector ID"
  value       = aws_guardduty_detector.hipaa.id
}

output "sns_topic_arn" {
  description = "HIPAA alerts SNS topic ARN"
  value       = aws_sns_topic.hipaa_alerts.arn
}

output "backup_vault_arn" {
  description = "HIPAA backup vault ARN"
  value       = aws_backup_vault.hipaa.arn
}

output "audit_log_group_name" {
  description = "HIPAA audit log group name"
  value       = aws_cloudwatch_log_group.hipaa_audit.name
}

output "phi_access_log_group_name" {
  description = "PHI access log group name"
  value       = aws_cloudwatch_log_group.phi_access.name
}

output "config_recorder_id" {
  description = "AWS Config recorder ID"
  value       = aws_config_configuration_recorder.hipaa.id
}

output "database_credentials_secret_arn" {
  description = "Database credentials secret ARN"
  value       = aws_secretsmanager_secret.database_credentials.arn
}
