# ============================================
# AWS Backup Restoration Testing Module
# ============================================
# This module provides automated backup restoration
# testing for RDS/Aurora databases to validate
# backup integrity and recoverability.
# ============================================

locals {
  name = var.region_name != "" ? "${var.project_name}-${var.environment}-${var.region_name}" : "${var.project_name}-${var.environment}"

  lambda_function_name = "${local.name}-backup-restore-test"

  tags = merge(var.tags, {
    Module = "backup-restore-testing"
  })
}

# ============================================
# Data Sources
# ============================================

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

data "aws_partition" "current" {}

# ============================================
# SNS Topic for Test Notifications
# ============================================

resource "aws_sns_topic" "backup_test_notifications" {
  name         = "${local.name}-backup-restore-test-notifications"
  display_name = "Backup Restoration Test Results - ${var.project_name}"

  kms_master_key_id = var.kms_key_arn != "" ? var.kms_key_arn : aws_kms_key.backup_test[0].id

  tags = merge(local.tags, {
    Name = "${local.name}-backup-restore-test-notifications"
  })
}

resource "aws_sns_topic_policy" "backup_test_notifications" {
  arn = aws_sns_topic.backup_test_notifications.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowLambdaPublish"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.backup_test_notifications.arn
        Condition = {
          ArnLike = {
            "aws:SourceArn" = aws_lambda_function.backup_restore_test.arn
          }
        }
      },
      {
        Sid    = "AllowCloudWatchPublish"
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.backup_test_notifications.arn
      },
      {
        Sid    = "AllowAccountOwner"
        Effect = "Allow"
        Principal = {
          AWS = "arn:${data.aws_partition.current.partition}:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action = [
          "SNS:Subscribe",
          "SNS:SetTopicAttributes",
          "SNS:Receive",
          "SNS:Publish",
          "SNS:ListSubscriptionsByTopic",
          "SNS:GetTopicAttributes"
        ]
        Resource = aws_sns_topic.backup_test_notifications.arn
      }
    ]
  })
}

resource "aws_sns_topic_subscription" "backup_test_email" {
  count = length(var.notification_emails)

  topic_arn = aws_sns_topic.backup_test_notifications.arn
  protocol  = "email"
  endpoint  = var.notification_emails[count.index]
}

# ============================================
# KMS Key for Encryption
# ============================================

resource "aws_kms_key" "backup_test" {
  count = var.kms_key_arn == "" ? 1 : 0

  description             = "KMS key for backup restoration testing - ${local.name}"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:${data.aws_partition.current.partition}:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow Lambda Service"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:GenerateDataKey*"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow SNS Service"
        Effect = "Allow"
        Principal = {
          Service = "sns.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:GenerateDataKey*"
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
          "kms:GenerateDataKey*"
        ]
        Resource = "*"
        Condition = {
          ArnLike = {
            "kms:EncryptionContext:aws:logs:arn" = "arn:${data.aws_partition.current.partition}:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"
          }
        }
      }
    ]
  })

  tags = merge(local.tags, {
    Name = "${local.name}-backup-test-kms"
  })
}

resource "aws_kms_alias" "backup_test" {
  count = var.kms_key_arn == "" ? 1 : 0

  name          = "alias/${local.name}-backup-test"
  target_key_id = aws_kms_key.backup_test[0].key_id
}

# ============================================
# IAM Role for Lambda Function
# ============================================

resource "aws_iam_role" "backup_restore_test" {
  name = "${local.name}-backup-restore-test-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy" "backup_restore_test" {
  name = "${local.name}-backup-restore-test-policy"
  role = aws_iam_role.backup_restore_test.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # RDS Permissions for snapshot restoration
      {
        Sid    = "RDSReadPermissions"
        Effect = "Allow"
        Action = [
          "rds:DescribeDBClusterSnapshots",
          "rds:DescribeDBSnapshots",
          "rds:DescribeDBClusters",
          "rds:DescribeDBInstances",
          "rds:DescribeDBSubnetGroups",
          "rds:DescribeDBClusterParameterGroups",
          "rds:DescribeDBParameterGroups",
          "rds:ListTagsForResource"
        ]
        Resource = "*"
      },
      {
        Sid    = "RDSRestorePermissions"
        Effect = "Allow"
        Action = [
          "rds:RestoreDBClusterFromSnapshot",
          "rds:RestoreDBInstanceFromDBSnapshot",
          "rds:CreateDBInstance",
          "rds:CreateDBCluster",
          "rds:DeleteDBCluster",
          "rds:DeleteDBInstance",
          "rds:ModifyDBCluster",
          "rds:ModifyDBInstance",
          "rds:AddTagsToResource"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:rds:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:cluster:${local.name}-restore-test-*",
          "arn:${data.aws_partition.current.partition}:rds:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:db:${local.name}-restore-test-*",
          "arn:${data.aws_partition.current.partition}:rds:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:cluster-snapshot:*",
          "arn:${data.aws_partition.current.partition}:rds:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:snapshot:*",
          "arn:${data.aws_partition.current.partition}:rds:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:subgrp:*",
          "arn:${data.aws_partition.current.partition}:rds:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:cluster-pg:*",
          "arn:${data.aws_partition.current.partition}:rds:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:pg:*"
        ]
      },
      # AWS Backup Permissions
      {
        Sid    = "BackupPermissions"
        Effect = "Allow"
        Action = [
          "backup:ListRecoveryPointsByBackupVault",
          "backup:DescribeRecoveryPoint",
          "backup:GetRecoveryPointRestoreMetadata",
          "backup:StartRestoreJob",
          "backup:DescribeRestoreJob",
          "backup:ListRestoreJobs"
        ]
        Resource = "*"
      },
      # Secrets Manager for database credentials
      {
        Sid    = "SecretsManagerPermissions"
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.project_name}/*",
          "arn:${data.aws_partition.current.partition}:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${local.name}-*"
        ]
      },
      # KMS Permissions
      {
        Sid    = "KMSPermissions"
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:Encrypt",
          "kms:GenerateDataKey",
          "kms:DescribeKey",
          "kms:CreateGrant"
        ]
        Resource = var.kms_key_arn != "" ? [var.kms_key_arn] : [aws_kms_key.backup_test[0].arn]
      },
      # SNS Permissions
      {
        Sid    = "SNSPermissions"
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = aws_sns_topic.backup_test_notifications.arn
      },
      # CloudWatch Logs Permissions
      {
        Sid    = "CloudWatchLogsPermissions"
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = [
          "arn:${data.aws_partition.current.partition}:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${local.lambda_function_name}",
          "arn:${data.aws_partition.current.partition}:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${local.lambda_function_name}:*"
        ]
      },
      # CloudWatch Metrics Permissions
      {
        Sid    = "CloudWatchMetricsPermissions"
        Effect = "Allow"
        Action = [
          "cloudwatch:PutMetricData"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "cloudwatch:namespace" = "UnifiedHealth/BackupRestoreTesting"
          }
        }
      },
      # EC2 Permissions for VPC access
      {
        Sid    = "EC2Permissions"
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:DescribeSubnets",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeVpcs"
        ]
        Resource = "*"
      },
      # IAM PassRole for RDS
      {
        Sid      = "IAMPassRole"
        Effect   = "Allow"
        Action   = "iam:PassRole"
        Resource = "arn:${data.aws_partition.current.partition}:iam::${data.aws_caller_identity.current.account_id}:role/*-rds-monitoring-role"
        Condition = {
          StringEquals = {
            "iam:PassedToService" = "monitoring.rds.amazonaws.com"
          }
        }
      }
    ]
  })
}

# ============================================
# CloudWatch Log Group
# ============================================

resource "aws_cloudwatch_log_group" "backup_restore_test" {
  name              = "/aws/lambda/${local.lambda_function_name}"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_arn != "" ? var.kms_key_arn : aws_kms_key.backup_test[0].arn

  tags = local.tags
}

# ============================================
# Lambda Function
# ============================================

data "archive_file" "backup_restore_test" {
  type        = "zip"
  output_path = "${path.module}/lambda/backup-restore-test.zip"

  source {
    content  = file("${path.module}/lambda/backup_restore_test.py")
    filename = "backup_restore_test.py"
  }
}

resource "aws_lambda_function" "backup_restore_test" {
  filename         = data.archive_file.backup_restore_test.output_path
  function_name    = local.lambda_function_name
  role             = aws_iam_role.backup_restore_test.arn
  handler          = "backup_restore_test.lambda_handler"
  source_code_hash = data.archive_file.backup_restore_test.output_base64sha256
  runtime          = "python3.11"
  timeout          = var.lambda_timeout
  memory_size      = var.lambda_memory_size

  environment {
    variables = {
      PROJECT_NAME           = var.project_name
      ENVIRONMENT            = var.environment
      REGION_NAME            = var.region_name
      RDS_CLUSTER_IDENTIFIER = var.rds_cluster_identifier
      DB_SUBNET_GROUP_NAME   = var.db_subnet_group_name
      VPC_SECURITY_GROUP_IDS = join(",", var.vpc_security_group_ids)
      SNS_TOPIC_ARN          = aws_sns_topic.backup_test_notifications.arn
      TEST_QUERIES           = jsonencode(var.test_queries)
      CLEANUP_AFTER_TEST     = tostring(var.cleanup_after_test)
      MAX_WAIT_MINUTES       = tostring(var.max_wait_minutes)
    }
  }

  # VPC configuration for database connectivity testing
  dynamic "vpc_config" {
    for_each = length(var.vpc_subnet_ids) > 0 ? [1] : []
    content {
      subnet_ids         = var.vpc_subnet_ids
      security_group_ids = var.vpc_security_group_ids
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.backup_restore_test,
    aws_iam_role_policy.backup_restore_test
  ]

  tags = merge(local.tags, {
    Name = local.lambda_function_name
  })
}

# ============================================
# CloudWatch Events Rule (Monthly Schedule)
# ============================================

resource "aws_cloudwatch_event_rule" "backup_restore_test" {
  name                = "${local.name}-backup-restore-test-schedule"
  description         = "Monthly trigger for backup restoration testing"
  schedule_expression = var.test_schedule
  state               = var.enable_scheduled_testing ? "ENABLED" : "DISABLED"

  tags = local.tags
}

resource "aws_cloudwatch_event_target" "backup_restore_test" {
  rule      = aws_cloudwatch_event_rule.backup_restore_test.name
  target_id = "backup-restore-test-lambda"
  arn       = aws_lambda_function.backup_restore_test.arn

  input = jsonencode({
    source    = "scheduled"
    test_type = "full"
  })
}

resource "aws_lambda_permission" "backup_restore_test" {
  statement_id  = "AllowCloudWatchEvents"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backup_restore_test.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.backup_restore_test.arn
}

# ============================================
# CloudWatch Alarms
# ============================================

# Alarm for restoration test failures
resource "aws_cloudwatch_metric_alarm" "restore_test_failure" {
  alarm_name          = "${local.name}-backup-restore-test-failure"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "RestoreTestFailure"
  namespace           = "UnifiedHealth/BackupRestoreTesting"
  period              = 86400 # 24 hours
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Backup restoration test failed - immediate investigation required"
  alarm_actions       = [aws_sns_topic.backup_test_notifications.arn]
  ok_actions          = [aws_sns_topic.backup_test_notifications.arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    Project     = var.project_name
    Environment = var.environment
    Region      = var.region_name
  }

  tags = local.tags
}

# Alarm for missed scheduled tests
resource "aws_cloudwatch_metric_alarm" "restore_test_missed" {
  alarm_name          = "${local.name}-backup-restore-test-missed"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "RestoreTestExecuted"
  namespace           = "UnifiedHealth/BackupRestoreTesting"
  period              = 2678400 # 31 days
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "No backup restoration test executed in the past month"
  alarm_actions       = [aws_sns_topic.backup_test_notifications.arn]
  treat_missing_data  = "breaching"

  dimensions = {
    Project     = var.project_name
    Environment = var.environment
    Region      = var.region_name
  }

  tags = local.tags
}

# Alarm for long restoration time
resource "aws_cloudwatch_metric_alarm" "restore_time_high" {
  alarm_name          = "${local.name}-backup-restore-time-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "RestoreTimeMinutes"
  namespace           = "UnifiedHealth/BackupRestoreTesting"
  period              = 86400 # 24 hours
  statistic           = "Maximum"
  threshold           = var.restore_time_alarm_threshold
  alarm_description   = "Backup restoration time exceeded threshold - RTO may be at risk"
  alarm_actions       = [aws_sns_topic.backup_test_notifications.arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    Project     = var.project_name
    Environment = var.environment
    Region      = var.region_name
  }

  tags = local.tags
}

# Alarm for data integrity failures
resource "aws_cloudwatch_metric_alarm" "data_integrity_failure" {
  alarm_name          = "${local.name}-backup-data-integrity-failure"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "DataIntegrityFailure"
  namespace           = "UnifiedHealth/BackupRestoreTesting"
  period              = 86400 # 24 hours
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Data integrity verification failed after backup restoration"
  alarm_actions       = [aws_sns_topic.backup_test_notifications.arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    Project     = var.project_name
    Environment = var.environment
    Region      = var.region_name
  }

  tags = local.tags
}

# ============================================
# CloudWatch Dashboard Widget (Optional)
# ============================================

resource "aws_cloudwatch_dashboard" "backup_restore_testing" {
  count = var.create_dashboard ? 1 : 0

  dashboard_name = "${local.name}-backup-restore-testing"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title   = "Backup Restoration Test Results"
          view    = "timeSeries"
          stacked = false
          region  = data.aws_region.current.name
          metrics = [
            ["UnifiedHealth/BackupRestoreTesting", "RestoreTestSuccess", "Project", var.project_name, "Environment", var.environment, "Region", var.region_name, { color = "#2ca02c" }],
            [".", "RestoreTestFailure", ".", ".", ".", ".", ".", ".", { color = "#d62728" }]
          ]
          period = 86400
          stat   = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title   = "Restoration Time (Minutes)"
          view    = "timeSeries"
          stacked = false
          region  = data.aws_region.current.name
          metrics = [
            ["UnifiedHealth/BackupRestoreTesting", "RestoreTimeMinutes", "Project", var.project_name, "Environment", var.environment, "Region", var.region_name]
          ]
          period = 86400
          stat   = "Average"
          annotations = {
            horizontal = [
              {
                label = "RTO Threshold"
                value = var.restore_time_alarm_threshold
                color = "#ff7f0e"
              }
            ]
          }
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          title   = "Data Integrity Checks"
          view    = "timeSeries"
          stacked = false
          region  = data.aws_region.current.name
          metrics = [
            ["UnifiedHealth/BackupRestoreTesting", "DataIntegritySuccess", "Project", var.project_name, "Environment", var.environment, "Region", var.region_name, { color = "#2ca02c" }],
            [".", "DataIntegrityFailure", ".", ".", ".", ".", ".", ".", { color = "#d62728" }]
          ]
          period = 86400
          stat   = "Sum"
        }
      },
      {
        type   = "alarm"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          title = "Backup Restoration Alarms"
          alarms = [
            aws_cloudwatch_metric_alarm.restore_test_failure.arn,
            aws_cloudwatch_metric_alarm.restore_test_missed.arn,
            aws_cloudwatch_metric_alarm.restore_time_high.arn,
            aws_cloudwatch_metric_alarm.data_integrity_failure.arn
          ]
        }
      }
    ]
  })
}
