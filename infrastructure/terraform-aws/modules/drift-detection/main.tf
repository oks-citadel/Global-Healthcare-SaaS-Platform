# ============================================
# AWS Config Drift Detection Module
# ============================================
# Monitors infrastructure for configuration drift
# and compliance violations
# ============================================

locals {
  name = "${var.project_name}-${var.environment}"

  tags = merge(var.tags, {
    Module = "drift-detection"
  })
}

# ============================================
# AWS Config Recorder
# ============================================

resource "aws_config_configuration_recorder" "main" {
  name     = "${local.name}-config-recorder"
  role_arn = aws_iam_role.config.arn

  recording_group {
    all_supported                 = true
    include_global_resource_types = true
  }

  recording_mode {
    recording_frequency = "CONTINUOUS"
  }
}

resource "aws_config_configuration_recorder_status" "main" {
  name       = aws_config_configuration_recorder.main.name
  is_enabled = true

  depends_on = [aws_config_delivery_channel.main]
}

# ============================================
# AWS Config Delivery Channel
# ============================================

resource "aws_config_delivery_channel" "main" {
  name           = "${local.name}-config-delivery"
  s3_bucket_name = aws_s3_bucket.config.id
  sns_topic_arn  = aws_sns_topic.config_alerts.arn

  snapshot_delivery_properties {
    delivery_frequency = "TwentyFour_Hours"
  }

  depends_on = [aws_config_configuration_recorder.main]
}

# ============================================
# S3 Bucket for Config
# ============================================

resource "aws_s3_bucket" "config" {
  bucket = "${local.name}-aws-config"

  tags = merge(local.tags, {
    Name = "${local.name}-aws-config"
  })
}

resource "aws_s3_bucket_versioning" "config" {
  bucket = aws_s3_bucket.config.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "config" {
  bucket = aws_s3_bucket.config.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "config" {
  bucket = aws_s3_bucket.config.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "config" {
  bucket = aws_s3_bucket.config.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AWSConfigBucketPermissionsCheck"
        Effect = "Allow"
        Principal = {
          Service = "config.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.config.arn
      },
      {
        Sid    = "AWSConfigBucketDelivery"
        Effect = "Allow"
        Principal = {
          Service = "config.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.config.arn}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      }
    ]
  })
}

# ============================================
# IAM Role for Config
# ============================================

resource "aws_iam_role" "config" {
  name = "${local.name}-config-role"

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

  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "config" {
  role       = aws_iam_role.config.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWS_ConfigRole"
}

resource "aws_iam_role_policy" "config_s3" {
  name = "${local.name}-config-s3-policy"
  role = aws_iam_role.config.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl"
        ]
        Resource = "${aws_s3_bucket.config.arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.config.arn
      }
    ]
  })
}

# ============================================
# SNS Topic for Alerts
# ============================================

resource "aws_sns_topic" "config_alerts" {
  name = "${local.name}-config-alerts"

  tags = local.tags
}

resource "aws_sns_topic_subscription" "config_email" {
  count     = var.alert_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.config_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# ============================================
# AWS Config Rules - Infrastructure Drift
# ============================================

# EKS Cluster Logging Enabled
resource "aws_config_config_rule" "eks_logging" {
  name = "${local.name}-eks-logging-enabled"

  source {
    owner             = "AWS"
    source_identifier = "EKS_CLUSTER_LOGGING_ENABLED"
  }

  depends_on = [aws_config_configuration_recorder.main]
}

# RDS Encryption Enabled
resource "aws_config_config_rule" "rds_encryption" {
  name = "${local.name}-rds-encryption-enabled"

  source {
    owner             = "AWS"
    source_identifier = "RDS_STORAGE_ENCRYPTED"
  }

  depends_on = [aws_config_configuration_recorder.main]
}

# S3 Bucket Encryption
resource "aws_config_config_rule" "s3_encryption" {
  name = "${local.name}-s3-bucket-encryption"

  source {
    owner             = "AWS"
    source_identifier = "S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED"
  }

  depends_on = [aws_config_configuration_recorder.main]
}

# S3 Bucket Public Access
resource "aws_config_config_rule" "s3_public_access" {
  name = "${local.name}-s3-public-access-prohibited"

  source {
    owner             = "AWS"
    source_identifier = "S3_BUCKET_PUBLIC_READ_PROHIBITED"
  }

  depends_on = [aws_config_configuration_recorder.main]
}

# VPC Flow Logs Enabled
resource "aws_config_config_rule" "vpc_flow_logs" {
  name = "${local.name}-vpc-flow-logs-enabled"

  source {
    owner             = "AWS"
    source_identifier = "VPC_FLOW_LOGS_ENABLED"
  }

  depends_on = [aws_config_configuration_recorder.main]
}

# Encrypted Volumes
resource "aws_config_config_rule" "encrypted_volumes" {
  name = "${local.name}-encrypted-volumes"

  source {
    owner             = "AWS"
    source_identifier = "ENCRYPTED_VOLUMES"
  }

  depends_on = [aws_config_configuration_recorder.main]
}

# CloudTrail Enabled
resource "aws_config_config_rule" "cloudtrail_enabled" {
  name = "${local.name}-cloudtrail-enabled"

  source {
    owner             = "AWS"
    source_identifier = "CLOUD_TRAIL_ENABLED"
  }

  depends_on = [aws_config_configuration_recorder.main]
}

# Security Group Open Access
resource "aws_config_config_rule" "security_group_open" {
  name = "${local.name}-restricted-incoming-traffic"

  source {
    owner             = "AWS"
    source_identifier = "RESTRICTED_INCOMING_TRAFFIC"
  }

  input_parameters = jsonencode({
    blockedPort1 = "22"
    blockedPort2 = "3389"
  })

  depends_on = [aws_config_configuration_recorder.main]
}

# IAM Root Access Key
resource "aws_config_config_rule" "root_access_key" {
  name = "${local.name}-iam-root-access-key-check"

  source {
    owner             = "AWS"
    source_identifier = "IAM_ROOT_ACCESS_KEY_CHECK"
  }

  depends_on = [aws_config_configuration_recorder.main]
}

# MFA Enabled for IAM Users
resource "aws_config_config_rule" "mfa_enabled" {
  name = "${local.name}-iam-user-mfa-enabled"

  source {
    owner             = "AWS"
    source_identifier = "IAM_USER_MFA_ENABLED"
  }

  depends_on = [aws_config_configuration_recorder.main]
}

# ============================================
# EventBridge Rule for Drift Detection
# ============================================

resource "aws_cloudwatch_event_rule" "config_compliance_change" {
  name        = "${local.name}-config-compliance-change"
  description = "Capture AWS Config compliance state changes"

  event_pattern = jsonencode({
    source      = ["aws.config"]
    detail-type = ["Config Rules Compliance Change"]
    detail = {
      messageType = ["ComplianceChangeNotification"]
      newEvaluationResult = {
        complianceType = ["NON_COMPLIANT"]
      }
    }
  })

  tags = local.tags
}

resource "aws_cloudwatch_event_target" "config_compliance_sns" {
  rule      = aws_cloudwatch_event_rule.config_compliance_change.name
  target_id = "SendToSNS"
  arn       = aws_sns_topic.config_alerts.arn

  input_transformer {
    input_paths = {
      configRuleName = "$.detail.configRuleName"
      resourceType   = "$.detail.resourceType"
      resourceId     = "$.detail.resourceId"
      awsRegion      = "$.detail.awsRegion"
    }
    input_template = "\"DRIFT DETECTED: Config rule <configRuleName> found non-compliant resource <resourceType>/<resourceId> in <awsRegion>\""
  }
}

resource "aws_sns_topic_policy" "config_alerts" {
  arn = aws_sns_topic.config_alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowEventBridge"
        Effect = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.config_alerts.arn
      }
    ]
  })
}

# ============================================
# CloudWatch Dashboard for Drift
# ============================================

resource "aws_cloudwatch_dashboard" "drift" {
  dashboard_name = "${local.name}-drift-detection"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "Config Rules Compliance"
          region = var.aws_region
          metrics = [
            ["AWS/Config", "ComplianceByConfigRule", "ConfigRuleName", "${local.name}-eks-logging-enabled"],
            [".", ".", ".", "${local.name}-rds-encryption-enabled"],
            [".", ".", ".", "${local.name}-s3-bucket-encryption"],
            [".", ".", ".", "${local.name}-vpc-flow-logs-enabled"]
          ]
          stat   = "Average"
          period = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "Non-Compliant Resources"
          region = var.aws_region
          metrics = [
            ["AWS/Config", "NonCompliantResources"]
          ]
          stat   = "Sum"
          period = 300
        }
      }
    ]
  })
}
