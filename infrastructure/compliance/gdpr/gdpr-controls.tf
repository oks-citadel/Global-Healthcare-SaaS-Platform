# GDPR Technical Controls for UnifiedHealth Platform - AWS
# Implements EU General Data Protection Regulation (EU) 2016/679
# Migrated from Azure to AWS

terraform {
  required_version = ">= 1.5.0"
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

variable "eu_region" {
  description = "EU AWS region for GDPR data residency"
  type        = string
  default     = "eu-west-1" # Ireland - Must be EU region
}

variable "organization_name" {
  description = "Organization name for resource naming"
  type        = string
  default     = "unifiedhealth"
}

variable "dpo_email" {
  description = "Data Protection Officer email"
  type        = string
}

variable "legal_team_email" {
  description = "Legal team email for GDPR alerts"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for GDPR resources"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for GDPR resources"
  type        = list(string)
}

variable "eu_allowed_ip_ranges" {
  description = "Allowed EU IP CIDR ranges"
  type        = list(string)
  default     = []
}

# GDPR compliant tags
locals {
  gdpr_tags = {
    Compliance         = "GDPR"
    DataClassification = "Personal-Data"
    DataResidency      = "EU"
    Environment        = var.environment
    ManagedBy          = "Terraform"
    LegalBasis         = "Consent"
    DataController     = var.organization_name
    DPO                = var.dpo_email
    RetentionPeriod    = "As-Per-Policy"
  }

  # EU countries for geo-restriction
  eu_countries = [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
    "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
    "PL", "PT", "RO", "SK", "SI", "ES", "SE"
  ]

  # Allowed EU AWS regions
  eu_regions = [
    "eu-west-1",      # Ireland
    "eu-west-2",      # London
    "eu-west-3",      # Paris
    "eu-central-1",   # Frankfurt
    "eu-central-2",   # Zurich
    "eu-north-1",     # Stockholm
    "eu-south-1",     # Milan
    "eu-south-2"      # Spain
  ]
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# =============================================================================
# AWS KMS - Customer Managed Keys for Personal Data Encryption
# =============================================================================

resource "aws_kms_key" "personal_data_encryption_key" {
  description              = "GDPR personal data encryption key for ${var.environment}"
  deletion_window_in_days  = 30
  enable_key_rotation      = true
  is_enabled               = true
  customer_master_key_spec = "SYMMETRIC_DEFAULT"
  key_usage                = "ENCRYPT_DECRYPT"
  multi_region             = false

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "gdpr-personal-data-key-policy"
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
        Sid    = "Allow Macie Service"
        Effect = "Allow"
        Principal = {
          Service = "macie.amazonaws.com"
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

  tags = merge(local.gdpr_tags, {
    Purpose = "Personal-Data-Encryption"
    KeyType = "CMK"
  })
}

resource "aws_kms_alias" "personal_data_encryption_key" {
  name          = "alias/gdpr-personal-data-key-${var.environment}"
  target_key_id = aws_kms_key.personal_data_encryption_key.key_id
}

# =============================================================================
# AWS Macie - Data Classification (Replaces Azure Purview)
# =============================================================================

resource "aws_macie2_account" "gdpr" {
  finding_publishing_frequency = "FIFTEEN_MINUTES"
  status                       = "ENABLED"
}

resource "aws_macie2_classification_export_configuration" "gdpr" {
  depends_on = [aws_macie2_account.gdpr]

  s3_destination {
    bucket_name = aws_s3_bucket.macie_findings.id
    key_prefix  = "macie-findings/"
    kms_key_arn = aws_kms_key.personal_data_encryption_key.arn
  }
}

# S3 bucket for Macie findings
resource "aws_s3_bucket" "macie_findings" {
  bucket = "${var.organization_name}-gdpr-macie-findings-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.gdpr_tags, {
    Purpose = "Macie-Data-Classification"
  })
}

resource "aws_s3_bucket_versioning" "macie_findings" {
  bucket = aws_s3_bucket.macie_findings.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "macie_findings" {
  bucket = aws_s3_bucket.macie_findings.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.personal_data_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "macie_findings" {
  bucket = aws_s3_bucket.macie_findings.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "macie_findings" {
  bucket = aws_s3_bucket.macie_findings.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowMacie"
        Effect = "Allow"
        Principal = {
          Service = "macie.amazonaws.com"
        }
        Action = [
          "s3:PutObject",
          "s3:GetBucketLocation"
        ]
        Resource = [
          aws_s3_bucket.macie_findings.arn,
          "${aws_s3_bucket.macie_findings.arn}/*"
        ]
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.macie_findings.arn,
          "${aws_s3_bucket.macie_findings.arn}/*"
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

# =============================================================================
# GDPR Compliant S3 Bucket - EU Residency Enforced
# =============================================================================

resource "aws_s3_bucket" "gdpr_storage" {
  bucket = "${var.organization_name}-gdpr-personal-data-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.gdpr_tags, {
    Purpose = "Personal-Data-Storage"
  })
}

resource "aws_s3_bucket_versioning" "gdpr_storage" {
  bucket = aws_s3_bucket.gdpr_storage.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "gdpr_storage" {
  bucket = aws_s3_bucket.gdpr_storage.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.personal_data_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "gdpr_storage" {
  bucket = aws_s3_bucket.gdpr_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_logging" "gdpr_storage" {
  bucket        = aws_s3_bucket.gdpr_storage.id
  target_bucket = aws_s3_bucket.access_logs.id
  target_prefix = "gdpr-storage-logs/"
}

resource "aws_s3_bucket_lifecycle_configuration" "gdpr_storage" {
  bucket = aws_s3_bucket.gdpr_storage.id

  rule {
    id     = "gdpr-retention"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }

    # GDPR allows deletion after purpose fulfilled
    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

resource "aws_s3_bucket_policy" "gdpr_storage" {
  bucket = aws_s3_bucket.gdpr_storage.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.gdpr_storage.arn,
          "${aws_s3_bucket.gdpr_storage.arn}/*"
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
        Resource  = "${aws_s3_bucket.gdpr_storage.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      },
      {
        Sid       = "EnforceEURegionOnly"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.gdpr_storage.arn,
          "${aws_s3_bucket.gdpr_storage.arn}/*"
        ]
        Condition = {
          StringNotEquals = {
            "aws:RequestedRegion" = local.eu_regions
          }
        }
      }
    ]
  })
}

# S3 bucket for access logs
resource "aws_s3_bucket" "access_logs" {
  bucket = "${var.organization_name}-gdpr-access-logs-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.gdpr_tags, {
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
      kms_master_key_id = aws_kms_key.personal_data_encryption_key.arn
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
    id     = "gdpr-log-retention"
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

# DPIA (Data Protection Impact Assessment) storage
resource "aws_s3_bucket" "dpia_documents" {
  bucket = "${var.organization_name}-gdpr-dpia-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.gdpr_tags, {
    Purpose = "DPIA-Assessments"
  })
}

resource "aws_s3_bucket_versioning" "dpia_documents" {
  bucket = aws_s3_bucket.dpia_documents.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "dpia_documents" {
  bucket = aws_s3_bucket.dpia_documents.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.personal_data_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "dpia_documents" {
  bucket = aws_s3_bucket.dpia_documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Consent records storage
resource "aws_s3_bucket" "consent_records" {
  bucket = "${var.organization_name}-gdpr-consent-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.gdpr_tags, {
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
      kms_master_key_id = aws_kms_key.personal_data_encryption_key.arn
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

# Data Subject Requests storage
resource "aws_s3_bucket" "dsr_requests" {
  bucket = "${var.organization_name}-gdpr-dsr-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.gdpr_tags, {
    Purpose = "Data-Subject-Requests"
  })
}

resource "aws_s3_bucket_versioning" "dsr_requests" {
  bucket = aws_s3_bucket.dsr_requests.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "dsr_requests" {
  bucket = aws_s3_bucket.dsr_requests.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.personal_data_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "dsr_requests" {
  bucket = aws_s3_bucket.dsr_requests.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# =============================================================================
# AWS CloudTrail - Access Logging
# =============================================================================

resource "aws_cloudtrail" "gdpr" {
  name                          = "gdpr-cloudtrail-${var.environment}"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_logs.id
  s3_key_prefix                 = "cloudtrail"
  include_global_service_events = true
  is_multi_region_trail         = false # EU region only
  enable_logging                = true
  enable_log_file_validation    = true
  kms_key_id                    = aws_kms_key.personal_data_encryption_key.arn
  cloud_watch_logs_group_arn    = "${aws_cloudwatch_log_group.cloudtrail.arn}:*"
  cloud_watch_logs_role_arn     = aws_iam_role.cloudtrail_cloudwatch.arn

  event_selector {
    read_write_type           = "All"
    include_management_events = true

    data_resource {
      type   = "AWS::S3::Object"
      values = [
        "${aws_s3_bucket.gdpr_storage.arn}/",
        "${aws_s3_bucket.consent_records.arn}/",
        "${aws_s3_bucket.dsr_requests.arn}/"
      ]
    }
  }

  insight_selector {
    insight_type = "ApiCallRateInsight"
  }

  tags = merge(local.gdpr_tags, {
    Purpose = "GDPR-Audit-Trail"
  })

  depends_on = [aws_s3_bucket_policy.cloudtrail_logs]
}

# CloudTrail S3 bucket
resource "aws_s3_bucket" "cloudtrail_logs" {
  bucket = "${var.organization_name}-gdpr-cloudtrail-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.gdpr_tags, {
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
      kms_master_key_id = aws_kms_key.personal_data_encryption_key.arn
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
    id     = "gdpr-log-retention"
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
            "AWS:SourceArn" = "arn:aws:cloudtrail:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:trail/gdpr-cloudtrail-${var.environment}"
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
            "AWS:SourceArn" = "arn:aws:cloudtrail:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:trail/gdpr-cloudtrail-${var.environment}"
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
  name              = "/aws/cloudtrail/gdpr-${var.environment}"
  retention_in_days = 730 # 2 years
  kms_key_id        = aws_kms_key.personal_data_encryption_key.arn

  tags = merge(local.gdpr_tags, {
    Purpose = "CloudTrail-Logs"
  })
}

# IAM role for CloudTrail to CloudWatch
resource "aws_iam_role" "cloudtrail_cloudwatch" {
  name = "gdpr-cloudtrail-cloudwatch-${var.environment}"

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

  tags = local.gdpr_tags
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
# AWS Config Rules for GDPR Compliance
# =============================================================================

resource "aws_config_config_rule" "s3_bucket_ssl_requests_only" {
  name = "gdpr-s3-ssl-only-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "S3_BUCKET_SSL_REQUESTS_ONLY"
  }

  tags = local.gdpr_tags
}

resource "aws_config_config_rule" "s3_bucket_server_side_encryption_enabled" {
  name = "gdpr-s3-encryption-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED"
  }

  tags = local.gdpr_tags
}

resource "aws_config_config_rule" "rds_storage_encrypted" {
  name = "gdpr-rds-encrypted-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "RDS_STORAGE_ENCRYPTED"
  }

  tags = local.gdpr_tags
}

resource "aws_config_config_rule" "encrypted_volumes" {
  name = "gdpr-encrypted-volumes-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "ENCRYPTED_VOLUMES"
  }

  tags = local.gdpr_tags
}

resource "aws_config_config_rule" "cloudtrail_enabled" {
  name = "gdpr-cloudtrail-enabled-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "CLOUD_TRAIL_ENABLED"
  }

  tags = local.gdpr_tags
}

resource "aws_config_config_rule" "cmk_backing_key_rotation_enabled" {
  name = "gdpr-kms-key-rotation-${var.environment}"

  source {
    owner             = "AWS"
    source_identifier = "CMK_BACKING_KEY_ROTATION_ENABLED"
  }

  tags = local.gdpr_tags
}

# =============================================================================
# CloudFront with Geo-Restriction for EU Only
# =============================================================================

resource "aws_cloudfront_distribution" "gdpr" {
  enabled             = true
  comment             = "GDPR compliant distribution - EU only"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100" # EU and US only
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.gdpr_storage.bucket_regional_domain_name
    origin_id   = "gdpr-storage"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.gdpr.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "gdpr-storage"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = local.eu_countries
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  logging_config {
    bucket          = aws_s3_bucket.access_logs.bucket_domain_name
    include_cookies = false
    prefix          = "cloudfront-logs/"
  }

  tags = merge(local.gdpr_tags, {
    Purpose = "EU-Only-Content-Delivery"
  })
}

resource "aws_cloudfront_origin_access_identity" "gdpr" {
  comment = "GDPR storage access identity"
}

# =============================================================================
# SNS Topic for GDPR Alerts
# =============================================================================

resource "aws_sns_topic" "gdpr_alerts" {
  name              = "gdpr-compliance-alerts-${var.environment}"
  kms_master_key_id = aws_kms_key.personal_data_encryption_key.id

  tags = merge(local.gdpr_tags, {
    Purpose = "GDPR-Alerts"
  })
}

resource "aws_sns_topic_policy" "gdpr_alerts" {
  arn = aws_sns_topic.gdpr_alerts.arn

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
        Resource = aws_sns_topic.gdpr_alerts.arn
      },
      {
        Sid    = "AllowCloudWatchAlarms"
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.gdpr_alerts.arn
      }
    ]
  })
}

resource "aws_sns_topic_subscription" "dpo_email" {
  topic_arn = aws_sns_topic.gdpr_alerts.arn
  protocol  = "email"
  endpoint  = var.dpo_email
}

resource "aws_sns_topic_subscription" "legal_email" {
  topic_arn = aws_sns_topic.gdpr_alerts.arn
  protocol  = "email"
  endpoint  = var.legal_team_email
}

# =============================================================================
# CloudWatch Alarms for GDPR Monitoring
# =============================================================================

resource "aws_cloudwatch_metric_alarm" "personal_data_access" {
  alarm_name          = "gdpr-personal-data-access-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "PersonalDataAccessCount"
  namespace           = "GDPR/DataAccess"
  period              = 300
  statistic           = "Sum"
  threshold           = 100
  alarm_description   = "High volume of personal data access detected"
  alarm_actions       = [aws_sns_topic.gdpr_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.gdpr_tags, {
    AlertType = "Data-Access"
  })
}

resource "aws_cloudwatch_metric_alarm" "data_export" {
  alarm_name          = "gdpr-data-export-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "DataExportCount"
  namespace           = "GDPR/DataExport"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "Data export activity detected - potential data transfer"
  alarm_actions       = [aws_sns_topic.gdpr_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.gdpr_tags, {
    AlertType = "Data-Export"
  })
}

resource "aws_cloudwatch_metric_alarm" "cross_region_access" {
  alarm_name          = "gdpr-cross-region-access-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CrossRegionAccessCount"
  namespace           = "GDPR/DataResidency"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Data access from non-EU region detected"
  alarm_actions       = [aws_sns_topic.gdpr_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge(local.gdpr_tags, {
    AlertType = "Data-Residency-Violation"
  })
}

# =============================================================================
# EventBridge Rules for GDPR Events
# =============================================================================

resource "aws_cloudwatch_event_rule" "macie_findings" {
  name        = "gdpr-macie-findings-${var.environment}"
  description = "Capture Macie findings for GDPR compliance"

  event_pattern = jsonencode({
    source      = ["aws.macie"]
    detail-type = ["Macie Finding"]
    detail = {
      severity = {
        score = [{ numeric = [">=", 4] }]
      }
    }
  })

  tags = local.gdpr_tags
}

resource "aws_cloudwatch_event_target" "macie_sns" {
  rule      = aws_cloudwatch_event_rule.macie_findings.name
  target_id = "SendToSNS"
  arn       = aws_sns_topic.gdpr_alerts.arn
}

# =============================================================================
# AWS Secrets Manager - For storing database credentials
# =============================================================================

resource "aws_secretsmanager_secret" "database_credentials" {
  name                    = "gdpr/database-credentials-${var.environment}"
  description             = "GDPR compliant database credentials"
  kms_key_id              = aws_kms_key.personal_data_encryption_key.arn
  recovery_window_in_days = 30

  tags = local.gdpr_tags
}

resource "random_password" "database_password" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret_version" "database_credentials" {
  secret_id = aws_secretsmanager_secret.database_credentials.id
  secret_string = jsonencode({
    username = "gdpr_admin"
    password = random_password.database_password.result
  })
}

# =============================================================================
# SSM Parameter Store for GDPR Configuration
# =============================================================================

resource "aws_ssm_parameter" "data_residency_config" {
  name        = "/gdpr/${var.environment}/data-residency"
  description = "GDPR data residency configuration"
  type        = "SecureString"
  key_id      = aws_kms_key.personal_data_encryption_key.arn
  value = jsonencode({
    enforced            = true
    allowed_regions     = local.eu_regions
    primary_region      = var.eu_region
    failover_region     = "eu-central-1"
    data_sovereignty    = "EU"
    schrems_ii_compliant = true
  })

  tags = local.gdpr_tags
}

resource "aws_ssm_parameter" "cross_border_transfers" {
  name        = "/gdpr/${var.environment}/cross-border-transfers"
  description = "GDPR cross-border transfer configuration"
  type        = "SecureString"
  key_id      = aws_kms_key.personal_data_encryption_key.arn
  value = jsonencode({
    enabled                = false
    require_scc            = true
    require_tia            = true
    require_dpo_approval   = true
    allowed_countries      = local.eu_countries
    adequacy_decisions     = []
    additional_safeguards  = ["encryption", "anonymization", "pseudonymization"]
  })

  tags = local.gdpr_tags
}

# =============================================================================
# AWS Backup for GDPR Compliance
# =============================================================================

resource "aws_backup_vault" "gdpr" {
  name        = "gdpr-backup-vault-${var.environment}"
  kms_key_arn = aws_kms_key.personal_data_encryption_key.arn

  tags = merge(local.gdpr_tags, {
    Purpose = "GDPR-Backup"
  })
}

resource "aws_backup_plan" "gdpr" {
  name = "gdpr-backup-plan-${var.environment}"

  rule {
    rule_name         = "daily-backup"
    target_vault_name = aws_backup_vault.gdpr.name
    schedule          = "cron(0 5 ? * * *)"

    lifecycle {
      cold_storage_after = 90
      delete_after       = 730 # 2 years
    }
  }

  rule {
    rule_name         = "weekly-backup"
    target_vault_name = aws_backup_vault.gdpr.name
    schedule          = "cron(0 5 ? * SUN *)"

    lifecycle {
      cold_storage_after = 90
      delete_after       = 730
    }
  }

  tags = local.gdpr_tags
}

resource "aws_backup_selection" "gdpr" {
  iam_role_arn = aws_iam_role.backup_role.arn
  name         = "gdpr-backup-selection-${var.environment}"
  plan_id      = aws_backup_plan.gdpr.id

  selection_tag {
    type  = "STRINGEQUALS"
    key   = "Compliance"
    value = "GDPR"
  }
}

resource "aws_iam_role" "backup_role" {
  name = "gdpr-backup-role-${var.environment}"

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

  tags = local.gdpr_tags
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

output "personal_data_encryption_key_arn" {
  description = "Personal data encryption key ARN"
  value       = aws_kms_key.personal_data_encryption_key.arn
}

output "personal_data_encryption_key_id" {
  description = "Personal data encryption key ID"
  value       = aws_kms_key.personal_data_encryption_key.key_id
}

output "gdpr_storage_bucket" {
  description = "GDPR personal data storage bucket name"
  value       = aws_s3_bucket.gdpr_storage.id
}

output "gdpr_storage_bucket_arn" {
  description = "GDPR personal data storage bucket ARN"
  value       = aws_s3_bucket.gdpr_storage.arn
}

output "consent_records_bucket" {
  description = "Consent records bucket name"
  value       = aws_s3_bucket.consent_records.id
}

output "dsr_requests_bucket" {
  description = "Data Subject Requests bucket name"
  value       = aws_s3_bucket.dsr_requests.id
}

output "dpia_documents_bucket" {
  description = "DPIA documents bucket name"
  value       = aws_s3_bucket.dpia_documents.id
}

output "macie_account_id" {
  description = "Macie account ID"
  value       = aws_macie2_account.gdpr.id
}

output "cloudtrail_arn" {
  description = "CloudTrail ARN"
  value       = aws_cloudtrail.gdpr.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.gdpr.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name"
  value       = aws_cloudfront_distribution.gdpr.domain_name
}

output "sns_topic_arn" {
  description = "GDPR alerts SNS topic ARN"
  value       = aws_sns_topic.gdpr_alerts.arn
}

output "backup_vault_arn" {
  description = "GDPR backup vault ARN"
  value       = aws_backup_vault.gdpr.arn
}

output "database_credentials_secret_arn" {
  description = "Database credentials secret ARN"
  value       = aws_secretsmanager_secret.database_credentials.arn
}

output "data_residency_config_arn" {
  description = "Data residency configuration parameter ARN"
  value       = aws_ssm_parameter.data_residency_config.arn
}
