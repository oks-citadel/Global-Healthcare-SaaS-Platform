# POPIA Technical Controls for UnifiedHealth Platform - AWS
# South African Protection of Personal Information Act (POPIA) No. 4 of 2013
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

variable "sa_region" {
  description = "South African AWS region for POPIA data residency"
  type        = string
  default     = "af-south-1" # Cape Town - POPIA requires SA data residency
}

variable "organization_name" {
  description = "Organization name for resource naming"
  type        = string
  default     = "unifiedhealth"
}

variable "information_officer_email" {
  description = "Information Officer email (POPIA requirement)"
  type        = string
}

variable "legal_team_email" {
  description = "Legal team email for POPIA alerts"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for POPIA resources"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for POPIA resources"
  type        = list(string)
}

variable "sa_allowed_ip_ranges" {
  description = "Allowed South African IP CIDR ranges"
  type        = list(string)
  default     = []
}

# POPIA compliant tags
locals {
  popia_tags = {
    Compliance          = "POPIA"
    DataClassification  = "Personal-Information"
    DataResidency       = "South-Africa"
    Environment         = var.environment
    ManagedBy           = "Terraform"
    InformationOfficer  = var.information_officer_email
    LegalBasis          = "Consent"
    RetentionPeriod     = "As-Per-Policy"
    DataSovereignty     = "SA"
  }

  # South Africa AWS region (only af-south-1 available)
  sa_regions = ["af-south-1"]
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# =============================================================================
# AWS KMS - Customer Managed Keys for Personal Information Encryption
# =============================================================================

resource "aws_kms_key" "personal_info_encryption_key" {
  description              = "POPIA personal information encryption key for ${var.environment}"
  deletion_window_in_days  = 30
  enable_key_rotation      = true
  is_enabled               = true
  customer_master_key_spec = "SYMMETRIC_DEFAULT"
  key_usage                = "ENCRYPT_DECRYPT"
  multi_region             = false

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "popia-personal-info-key-policy"
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

  tags = merge(local.popia_tags, {
    Purpose = "Personal-Information-Encryption"
    KeyType = "CMK"
  })
}

resource "aws_kms_alias" "personal_info_encryption_key" {
  name          = "alias/popia-personal-info-key-${var.environment}"
  target_key_id = aws_kms_key.personal_info_encryption_key.key_id
}

# =============================================================================
# AWS Security Hub for POPIA Compliance Monitoring
# =============================================================================

resource "aws_securityhub_account" "popia" {
  enable_default_standards  = false
  control_finding_generator = "SECURITY_CONTROL"
  auto_enable_controls      = true
}

resource "aws_securityhub_standards_subscription" "aws_foundational" {
  depends_on    = [aws_securityhub_account.popia]
  standards_arn = "arn:aws:securityhub:${data.aws_region.current.name}::standards/aws-foundational-security-best-practices/v/1.0.0"
}

# =============================================================================
# AWS GuardDuty for Threat Detection
# =============================================================================

resource "aws_guardduty_detector" "popia" {
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

  tags = merge(local.popia_tags, {
    Purpose = "Threat-Detection"
  })
}

# GuardDuty findings to SNS
resource "aws_cloudwatch_event_rule" "guardduty_findings" {
  name        = "popia-guardduty-findings-${var.environment}"
  description = "Capture GuardDuty findings for POPIA compliance"

  event_pattern = jsonencode({
    source      = ["aws.guardduty"]
    detail-type = ["GuardDuty Finding"]
    detail = {
      severity = [
        { numeric = [">=", 4] }
      ]
    }
  })

  tags = local.popia_tags
}

resource "aws_cloudwatch_event_target" "guardduty_sns" {
  rule      = aws_cloudwatch_event_rule.guardduty_findings.name
  target_id = "SendToSNS"
  arn       = aws_sns_topic.popia_alerts.arn
}

# =============================================================================
# POPIA Compliant S3 Bucket - SA Residency Enforced
# =============================================================================

resource "aws_s3_bucket" "popia_storage" {
  bucket = "${var.organization_name}-popia-personal-info-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.popia_tags, {
    Purpose = "Personal-Information-Storage"
  })
}

resource "aws_s3_bucket_versioning" "popia_storage" {
  bucket = aws_s3_bucket.popia_storage.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "popia_storage" {
  bucket = aws_s3_bucket.popia_storage.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.personal_info_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "popia_storage" {
  bucket = aws_s3_bucket.popia_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_logging" "popia_storage" {
  bucket        = aws_s3_bucket.popia_storage.id
  target_bucket = aws_s3_bucket.access_logs.id
  target_prefix = "popia-storage-logs/"
}

resource "aws_s3_bucket_lifecycle_configuration" "popia_storage" {
  bucket = aws_s3_bucket.popia_storage.id

  rule {
    id     = "popia-retention"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }

    # POPIA allows deletion after purpose fulfilled
    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

resource "aws_s3_bucket_policy" "popia_storage" {
  bucket = aws_s3_bucket.popia_storage.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.popia_storage.arn,
          "${aws_s3_bucket.popia_storage.arn}/*"
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
        Resource  = "${aws_s3_bucket.popia_storage.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      },
      {
        Sid       = "EnforceSARegionOnly"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.popia_storage.arn,
          "${aws_s3_bucket.popia_storage.arn}/*"
        ]
        Condition = {
          StringNotEquals = {
            "aws:RequestedRegion" = local.sa_regions
          }
        }
      }
    ]
  })
}

# S3 bucket for access logs
resource "aws_s3_bucket" "access_logs" {
  bucket = "${var.organization_name}-popia-access-logs-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.popia_tags, {
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
      kms_master_key_id = aws_kms_key.personal_info_encryption_key.arn
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
    id     = "popia-log-retention"
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
      days = 730 # 2 years retention for audit logs
    }
  }
}

# POPIA Impact Assessment storage
resource "aws_s3_bucket" "popia_assessments" {
  bucket = "${var.organization_name}-popia-assessments-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.popia_tags, {
    Purpose = "POPIA-Impact-Assessments"
  })
}

resource "aws_s3_bucket_versioning" "popia_assessments" {
  bucket = aws_s3_bucket.popia_assessments.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "popia_assessments" {
  bucket = aws_s3_bucket.popia_assessments.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.personal_info_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "popia_assessments" {
  bucket = aws_s3_bucket.popia_assessments.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Consent records storage
resource "aws_s3_bucket" "consent_records" {
  bucket = "${var.organization_name}-popia-consent-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.popia_tags, {
    Purpose = "Consent-Records"
  })
}

resource "aws_s3_bucket_versioning" "consent_records" {
  bucket = aws_s3_bucket.consent_records.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "consent_records" {
  bucket = aws_s3_bucket.consent_records.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.personal_info_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "consent_records" {
  bucket = aws_s3_bucket.consent_records.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# PAIA (Promotion of Access to Information Act) requests storage
resource "aws_s3_bucket" "paia_requests" {
  bucket = "${var.organization_name}-popia-paia-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.popia_tags, {
    Purpose = "PAIA-Requests"
  })
}

resource "aws_s3_bucket_versioning" "paia_requests" {
  bucket = aws_s3_bucket.paia_requests.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "paia_requests" {
  bucket = aws_s3_bucket.paia_requests.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.personal_info_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "paia_requests" {
  bucket = aws_s3_bucket.paia_requests.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# =============================================================================
# AWS CloudTrail for POPIA Audit Trail
# =============================================================================

resource "aws_cloudtrail" "popia" {
  name                          = "popia-cloudtrail-${var.environment}"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_logs.id
  s3_key_prefix                 = "cloudtrail"
  include_global_service_events = true
  is_multi_region_trail         = false # SA region only
  enable_logging                = true
  enable_log_file_validation    = true
  kms_key_id                    = aws_kms_key.personal_info_encryption_key.arn
  cloud_watch_logs_group_arn    = "${aws_cloudwatch_log_group.cloudtrail.arn}:*"
  cloud_watch_logs_role_arn     = aws_iam_role.cloudtrail_cloudwatch.arn

  event_selector {
    read_write_type           = "All"
    include_management_events = true

    data_resource {
      type   = "AWS::S3::Object"
      values = [
        "${aws_s3_bucket.popia_storage.arn}/",
        "${aws_s3_bucket.consent_records.arn}/",
        "${aws_s3_bucket.paia_requests.arn}/"
      ]
    }
  }

  insight_selector {
    insight_type = "ApiCallRateInsight"
  }

  tags = merge(local.popia_tags, {
    Purpose = "POPIA-Audit-Trail"
  })

  depends_on = [aws_s3_bucket_policy.cloudtrail_logs]
}

# CloudTrail S3 bucket
resource "aws_s3_bucket" "cloudtrail_logs" {
  bucket = "${var.organization_name}-popia-cloudtrail-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.popia_tags, {
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
      kms_master_key_id = aws_kms_key.personal_info_encryption_key.arn
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
    id     = "popia-log-retention"
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
      days = 730 # 2 years
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
            "AWS:SourceArn" = "arn:aws:cloudtrail:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:trail/popia-cloudtrail-${var.environment}"
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
            "AWS:SourceArn" = "arn:aws:cloudtrail:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:trail/popia-cloudtrail-${var.environment}"
          }
        }
      },
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
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
  name              = "/aws/cloudtrail/popia-${var.environment}"
  retention_in_days = 730 # 2 years
  kms_key_id        = aws_kms_key.personal_info_encryption_key.arn

  tags = merge(local.popia_tags, {
    Purpose = "CloudTrail-Logs"
  })
}

# CloudWatch Log Group for POPIA Audit
resource "aws_cloudwatch_log_group" "popia_audit" {
  name              = "/popia/audit/${var.environment}"
  retention_in_days = 730 # 2 years
  kms_key_id        = aws_kms_key.personal_info_encryption_key.arn

  tags = merge(local.popia_tags, {
    Purpose = "POPIA-Audit-Logging"
  })
}

# IAM role for CloudTrail to CloudWatch
resource "aws_iam_role" "cloudtrail_cloudwatch" {
  name = "popia-cloudtrail-cloudwatch-${var.environment}"

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

  tags = local.popia_tags
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
# AWS Config Rules for POPIA Compliance
# =============================================================================

resource "aws_config_config_rule" "s3_bucket_ssl_requests_only" {
  name = "popia-s3-ssl-only-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "S3_BUCKET_SSL_REQUESTS_ONLY"
  }

  tags = local.popia_tags
}

resource "aws_config_config_rule" "s3_bucket_server_side_encryption_enabled" {
  name = "popia-s3-encryption-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED"
  }

  tags = local.popia_tags
}

resource "aws_config_config_rule" "rds_storage_encrypted" {
  name = "popia-rds-encrypted-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "RDS_STORAGE_ENCRYPTED"
  }

  tags = local.popia_tags
}

resource "aws_config_config_rule" "encrypted_volumes" {
  name = "popia-encrypted-volumes-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "ENCRYPTED_VOLUMES"
  }

  tags = local.popia_tags
}

resource "aws_config_config_rule" "cloudtrail_enabled" {
  name = "popia-cloudtrail-enabled-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "CLOUD_TRAIL_ENABLED"
  }

  tags = local.popia_tags
}

resource "aws_config_config_rule" "cmk_backing_key_rotation_enabled" {
  name = "popia-kms-key-rotation-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "CMK_BACKING_KEY_ROTATION_ENABLED"
  }

  tags = local.popia_tags
}

resource "aws_config_config_rule" "vpc_flow_logs_enabled" {
  name = "popia-vpc-flow-logs-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "VPC_FLOW_LOGS_ENABLED"
  }

  tags = local.popia_tags
}

# =============================================================================
# SNS Topic for POPIA Alerts
# =============================================================================

resource "aws_sns_topic" "popia_alerts" {
  name              = "popia-compliance-alerts-${var.environment}"
  kms_master_key_id = aws_kms_key.personal_info_encryption_key.id

  tags = merge(local.popia_tags, {
    Purpose = "POPIA-Alerts"
  })
}

resource "aws_sns_topic_policy" "popia_alerts" {
  arn = aws_sns_topic.popia_alerts.arn

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
        Resource = aws_sns_topic.popia_alerts.arn
      },
      {
        Sid    = "AllowCloudWatchAlarms"
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.popia_alerts.arn
      }
    ]
  })
}

resource "aws_sns_topic_subscription" "information_officer_email" {
  topic_arn = aws_sns_topic.popia_alerts.arn
  protocol  = "email"
  endpoint  = var.information_officer_email
}

resource "aws_sns_topic_subscription" "legal_email" {
  topic_arn = aws_sns_topic.popia_alerts.arn
  protocol  = "email"
  endpoint  = var.legal_team_email
}

# =============================================================================
# CloudWatch Alarms for POPIA Monitoring
# =============================================================================

resource "aws_cloudwatch_metric_alarm" "personal_info_access" {
  alarm_name          = "popia-personal-info-access-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "PersonalInfoAccessCount"
  namespace           = "POPIA/DataAccess"
  period              = 300
  statistic           = "Sum"
  threshold           = 100
  alarm_description   = "High volume of personal information access detected"
  alarm_actions       = [aws_sns_topic.popia_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.popia_tags, {
    AlertType = "Data-Access"
  })
}

resource "aws_cloudwatch_metric_alarm" "transborder_flow" {
  alarm_name          = "popia-transborder-flow-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "TransborderFlowCount"
  namespace           = "POPIA/DataTransfer"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Transborder data flow detected - requires Section 72 compliance"
  alarm_actions       = [aws_sns_topic.popia_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.popia_tags, {
    AlertType = "Transborder-Flow-Violation"
  })
}

resource "aws_cloudwatch_metric_alarm" "non_sa_region_access" {
  alarm_name          = "popia-non-sa-region-access-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "NonSARegionAccessCount"
  namespace           = "POPIA/DataResidency"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Data access from non-SA region detected"
  alarm_actions       = [aws_sns_topic.popia_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.popia_tags, {
    AlertType = "Data-Residency-Violation"
  })
}

resource "aws_cloudwatch_metric_alarm" "unauthorized_access" {
  alarm_name          = "popia-unauthorized-access-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "UnauthorizedAccessCount"
  namespace           = "POPIA/Security"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Unauthorized access attempt detected"
  alarm_actions       = [aws_sns_topic.popia_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.popia_tags, {
    AlertType = "Security"
  })
}

# =============================================================================
# AWS Secrets Manager - For storing database credentials
# =============================================================================

resource "aws_secretsmanager_secret" "database_credentials" {
  name                    = "popia/database-credentials-${var.environment}"
  description             = "POPIA compliant database credentials"
  kms_key_id              = aws_kms_key.personal_info_encryption_key.arn
  recovery_window_in_days = 30

  tags = local.popia_tags
}

resource "random_password" "database_password" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret_version" "database_credentials" {
  secret_id = aws_secretsmanager_secret.database_credentials.id
  secret_string = jsonencode({
    username = "popia_admin"
    password = random_password.database_password.result
  })
}

# =============================================================================
# SSM Parameter Store for POPIA Configuration
# =============================================================================

resource "aws_ssm_parameter" "data_residency_config" {
  name        = "/popia/${var.environment}/data-residency"
  description = "POPIA data residency configuration"
  type        = "SecureString"
  key_id      = aws_kms_key.personal_info_encryption_key.arn
  value = jsonencode({
    enforced               = true
    allowed_regions        = local.sa_regions
    primary_region         = var.sa_region
    failover_region        = null
    data_sovereignty       = "South-Africa"
    transborder_flow_allowed = false
  })

  tags = local.popia_tags
}

resource "aws_ssm_parameter" "transborder_flow_config" {
  name        = "/popia/${var.environment}/transborder-flow"
  description = "POPIA transborder flow configuration (Section 72)"
  type        = "SecureString"
  key_id      = aws_kms_key.personal_info_encryption_key.arn
  value = jsonencode({
    enabled                          = false
    require_consent                  = true
    require_binding_corporate_rules  = true
    require_information_officer_approval = true
    allowed_countries                = []
    adequate_protection_countries    = []
    additional_safeguards            = ["encryption", "anonymization", "pseudonymization"]
  })

  tags = local.popia_tags
}

# =============================================================================
# AWS Backup for POPIA Compliance
# =============================================================================

resource "aws_backup_vault" "popia" {
  name        = "popia-backup-vault-${var.environment}"
  kms_key_arn = aws_kms_key.personal_info_encryption_key.arn

  tags = merge(local.popia_tags, {
    Purpose = "POPIA-Backup"
  })
}

resource "aws_backup_plan" "popia" {
  name = "popia-backup-plan-${var.environment}"

  rule {
    rule_name         = "daily-backup"
    target_vault_name = aws_backup_vault.popia.name
    schedule          = "cron(0 5 ? * * *)"

    lifecycle {
      cold_storage_after = 90
      delete_after       = 730 # 2 years
    }
  }

  rule {
    rule_name         = "weekly-backup"
    target_vault_name = aws_backup_vault.popia.name
    schedule          = "cron(0 5 ? * SUN *)"

    lifecycle {
      cold_storage_after = 90
      delete_after       = 730
    }
  }

  tags = local.popia_tags
}

resource "aws_backup_selection" "popia" {
  iam_role_arn = aws_iam_role.backup_role.arn
  name         = "popia-backup-selection-${var.environment}"
  plan_id      = aws_backup_plan.popia.id

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Compliance"
    value = "POPIA"
  }
}

resource "aws_iam_role" "backup_role" {
  name = "popia-backup-role-${var.environment}"

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

  tags = local.popia_tags
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
# Outputs
# =============================================================================

output "personal_info_encryption_key_arn" {
  description = "Personal information encryption key ARN"
  value       = aws_kms_key.personal_info_encryption_key.arn
}

output "personal_info_encryption_key_id" {
  description = "Personal information encryption key ID"
  value       = aws_kms_key.personal_info_encryption_key.key_id
}

output "popia_storage_bucket" {
  description = "POPIA personal information storage bucket name"
  value       = aws_s3_bucket.popia_storage.id
}

output "popia_storage_bucket_arn" {
  description = "POPIA personal information storage bucket ARN"
  value       = aws_s3_bucket.popia_storage.arn
}

output "consent_records_bucket" {
  description = "Consent records bucket name"
  value       = aws_s3_bucket.consent_records.id
}

output "paia_requests_bucket" {
  description = "PAIA requests bucket name"
  value       = aws_s3_bucket.paia_requests.id
}

output "popia_assessments_bucket" {
  description = "POPIA assessments bucket name"
  value       = aws_s3_bucket.popia_assessments.id
}

output "security_hub_account_id" {
  description = "Security Hub account ID"
  value       = aws_securityhub_account.popia.id
}

output "guardduty_detector_id" {
  description = "GuardDuty detector ID"
  value       = aws_guardduty_detector.popia.id
}

output "cloudtrail_arn" {
  description = "CloudTrail ARN"
  value       = aws_cloudtrail.popia.arn
}

output "sns_topic_arn" {
  description = "POPIA alerts SNS topic ARN"
  value       = aws_sns_topic.popia_alerts.arn
}

output "backup_vault_arn" {
  description = "POPIA backup vault ARN"
  value       = aws_backup_vault.popia.arn
}

output "audit_log_group_name" {
  description = "POPIA audit log group name"
  value       = aws_cloudwatch_log_group.popia_audit.name
}

output "database_credentials_secret_arn" {
  description = "Database credentials secret ARN"
  value       = aws_secretsmanager_secret.database_credentials.arn
}

output "data_residency_config_arn" {
  description = "Data residency configuration parameter ARN"
  value       = aws_ssm_parameter.data_residency_config.arn
}

output "transborder_flow_config_arn" {
  description = "Transborder flow configuration parameter ARN"
  value       = aws_ssm_parameter.transborder_flow_config.arn
}
