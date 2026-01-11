# ============================================
# AWS CloudWatch Module
# ============================================
# HIPAA Compliance: Logging and monitoring for healthcare applications
# Features: Log groups, metric filters, alarms, dashboards
# ============================================

locals {
  name = "${var.project_name}-${var.environment}"

  tags = merge(var.tags, {
    Module      = "cloudwatch"
    Compliance  = "HIPAA"
    Environment = var.environment
  })

  # Default healthcare service names if not provided
  default_service_names = [
    "api",
    "auth",
    "patient-service",
    "appointment-service",
    "billing-service",
    "document-service",
    "imaging-service",
    "laboratory-service",
    "notification-service",
    "telehealth-service"
  ]

  service_names = length(var.service_names) > 0 ? var.service_names : local.default_service_names
}

# ============================================
# KMS Key for CloudWatch Logs Encryption
# ============================================

resource "aws_kms_key" "cloudwatch" {
  count = var.create_kms_key ? 1 : 0

  description             = "KMS key for CloudWatch Logs encryption - ${local.name}"
  deletion_window_in_days = var.kms_key_deletion_window
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
      }
    ]
  })

  tags = merge(local.tags, {
    Name = "${local.name}-cloudwatch-kms"
  })
}

resource "aws_kms_alias" "cloudwatch" {
  count = var.create_kms_key ? 1 : 0

  name          = "alias/${local.name}-cloudwatch"
  target_key_id = aws_kms_key.cloudwatch[0].key_id
}

# ============================================
# CloudWatch Log Groups for Services
# ============================================

resource "aws_cloudwatch_log_group" "services" {
  for_each = toset(local.service_names)

  name              = "/aws/${var.log_group_prefix}/${local.name}/${each.value}"
  retention_in_days = var.log_retention_days

  # HIPAA: Encryption at rest
  kms_key_id = var.create_kms_key ? aws_kms_key.cloudwatch[0].arn : var.kms_key_arn

  tags = merge(local.tags, {
    Name       = "${local.name}-${each.value}-logs"
    Service    = each.value
    LogType    = "application"
    Compliance = "HIPAA-Audit"
  })
}

# ============================================
# CloudWatch Log Group for Application Logs
# ============================================

resource "aws_cloudwatch_log_group" "application" {
  name              = "/aws/${var.log_group_prefix}/${local.name}/application"
  retention_in_days = var.log_retention_days

  kms_key_id = var.create_kms_key ? aws_kms_key.cloudwatch[0].arn : var.kms_key_arn

  tags = merge(local.tags, {
    Name    = "${local.name}-application-logs"
    LogType = "application"
  })
}

# ============================================
# CloudWatch Log Group for Security/Audit Logs
# ============================================

resource "aws_cloudwatch_log_group" "security" {
  name              = "/aws/${var.log_group_prefix}/${local.name}/security"
  retention_in_days = var.security_log_retention_days # Longer retention for HIPAA

  kms_key_id = var.create_kms_key ? aws_kms_key.cloudwatch[0].arn : var.kms_key_arn

  tags = merge(local.tags, {
    Name       = "${local.name}-security-logs"
    LogType    = "security"
    Compliance = "HIPAA-Audit"
  })
}

# ============================================
# CloudWatch Log Group for Access Logs
# ============================================

resource "aws_cloudwatch_log_group" "access" {
  name              = "/aws/${var.log_group_prefix}/${local.name}/access"
  retention_in_days = var.security_log_retention_days

  kms_key_id = var.create_kms_key ? aws_kms_key.cloudwatch[0].arn : var.kms_key_arn

  tags = merge(local.tags, {
    Name       = "${local.name}-access-logs"
    LogType    = "access"
    Compliance = "HIPAA-Audit"
  })
}

# ============================================
# CloudWatch Log Group for PHI Access Logs
# ============================================

resource "aws_cloudwatch_log_group" "phi_access" {
  name              = "/aws/${var.log_group_prefix}/${local.name}/phi-access"
  retention_in_days = var.phi_log_retention_days # Extended retention for PHI

  kms_key_id = var.create_kms_key ? aws_kms_key.cloudwatch[0].arn : var.kms_key_arn

  tags = merge(local.tags, {
    Name       = "${local.name}-phi-access-logs"
    LogType    = "phi-access"
    Compliance = "HIPAA-PHI"
    Sensitive  = "true"
  })
}

# ============================================
# Metric Filters - Error Detection
# ============================================

resource "aws_cloudwatch_log_metric_filter" "error_count" {
  for_each = toset(local.service_names)

  name           = "${local.name}-${each.value}-errors"
  pattern        = "?ERROR ?Error ?error ?FATAL ?Fatal ?fatal"
  log_group_name = aws_cloudwatch_log_group.services[each.value].name

  metric_transformation {
    name          = "ErrorCount"
    namespace     = "${var.metrics_namespace}/${each.value}"
    value         = "1"
    default_value = "0"
    dimensions = {
      Service     = each.value
      Environment = var.environment
    }
  }
}

# ============================================
# Metric Filters - Authentication Failures
# ============================================

resource "aws_cloudwatch_log_metric_filter" "auth_failures" {
  name           = "${local.name}-auth-failures"
  pattern        = "?\"authentication failed\" ?\"login failed\" ?\"unauthorized\" ?\"invalid credentials\" ?\"invalid token\""
  log_group_name = aws_cloudwatch_log_group.security.name

  metric_transformation {
    name          = "AuthenticationFailures"
    namespace     = "${var.metrics_namespace}/Security"
    value         = "1"
    default_value = "0"
    dimensions = {
      Environment = var.environment
    }
  }
}

# ============================================
# Metric Filters - PHI Access
# ============================================

resource "aws_cloudwatch_log_metric_filter" "phi_access" {
  name           = "${local.name}-phi-access"
  pattern        = "?\"PHI access\" ?\"patient data\" ?\"medical record\" ?\"health information\""
  log_group_name = aws_cloudwatch_log_group.phi_access.name

  metric_transformation {
    name          = "PHIAccessCount"
    namespace     = "${var.metrics_namespace}/Compliance"
    value         = "1"
    default_value = "0"
    dimensions = {
      Environment = var.environment
    }
  }
}

# ============================================
# Metric Filters - Suspicious Activity
# ============================================

resource "aws_cloudwatch_log_metric_filter" "suspicious_activity" {
  name           = "${local.name}-suspicious-activity"
  pattern        = "?\"SQL injection\" ?\"XSS\" ?\"brute force\" ?\"suspicious\" ?\"blocked\" ?\"rate limit\""
  log_group_name = aws_cloudwatch_log_group.security.name

  metric_transformation {
    name          = "SuspiciousActivity"
    namespace     = "${var.metrics_namespace}/Security"
    value         = "1"
    default_value = "0"
    dimensions = {
      Environment = var.environment
    }
  }
}

# ============================================
# Metric Filters - API Latency
# ============================================

resource "aws_cloudwatch_log_metric_filter" "api_latency" {
  name           = "${local.name}-api-latency"
  pattern        = "[timestamp, requestId, level, message, duration]"
  log_group_name = aws_cloudwatch_log_group.services["api"].name

  metric_transformation {
    name          = "APILatency"
    namespace     = "${var.metrics_namespace}/API"
    value         = "$duration"
    default_value = "0"
    unit          = "Milliseconds"
  }
}

# ============================================
# CloudWatch Alarms - Error Rate
# ============================================

resource "aws_cloudwatch_metric_alarm" "error_rate" {
  for_each = var.alarm_configs.error_rate_enabled ? toset(local.service_names) : []

  alarm_name          = "${local.name}-${each.value}-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = var.alarm_configs.error_rate_evaluation_periods
  metric_name         = "ErrorCount"
  namespace           = "${var.metrics_namespace}/${each.value}"
  period              = var.alarm_configs.error_rate_period
  statistic           = "Sum"
  threshold           = var.alarm_configs.error_rate_threshold
  alarm_description   = "Error rate for ${each.value} exceeds threshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    Service     = each.value
    Environment = var.environment
  }

  alarm_actions = var.alarm_actions
  ok_actions    = var.alarm_actions

  tags = local.tags
}

# ============================================
# CloudWatch Alarms - Authentication Failures
# ============================================

resource "aws_cloudwatch_metric_alarm" "auth_failures" {
  count = var.alarm_configs.auth_failures_enabled ? 1 : 0

  alarm_name          = "${local.name}-auth-failures-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "AuthenticationFailures"
  namespace           = "${var.metrics_namespace}/Security"
  period              = 300
  statistic           = "Sum"
  threshold           = var.alarm_configs.auth_failures_threshold
  alarm_description   = "High number of authentication failures detected"
  treat_missing_data  = "notBreaching"

  dimensions = {
    Environment = var.environment
  }

  alarm_actions = var.alarm_actions
  ok_actions    = var.alarm_actions

  tags = local.tags
}

# ============================================
# CloudWatch Alarms - Suspicious Activity
# ============================================

resource "aws_cloudwatch_metric_alarm" "suspicious_activity" {
  count = var.alarm_configs.suspicious_activity_enabled ? 1 : 0

  alarm_name          = "${local.name}-suspicious-activity"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "SuspiciousActivity"
  namespace           = "${var.metrics_namespace}/Security"
  period              = 60
  statistic           = "Sum"
  threshold           = var.alarm_configs.suspicious_activity_threshold
  alarm_description   = "Suspicious activity detected - potential security threat"
  treat_missing_data  = "notBreaching"

  dimensions = {
    Environment = var.environment
  }

  alarm_actions = var.alarm_actions
  ok_actions    = var.alarm_actions

  tags = local.tags
}

# ============================================
# CloudWatch Alarms - PHI Access Anomaly
# ============================================

resource "aws_cloudwatch_metric_alarm" "phi_access_anomaly" {
  count = var.alarm_configs.phi_access_enabled ? 1 : 0

  alarm_name          = "${local.name}-phi-access-anomaly"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "PHIAccessCount"
  namespace           = "${var.metrics_namespace}/Compliance"
  period              = 300
  statistic           = "Sum"
  threshold           = var.alarm_configs.phi_access_threshold
  alarm_description   = "Unusually high PHI access detected - review for compliance"
  treat_missing_data  = "notBreaching"

  dimensions = {
    Environment = var.environment
  }

  alarm_actions = var.alarm_actions
  ok_actions    = var.alarm_actions

  tags = merge(local.tags, {
    Compliance = "HIPAA-PHI"
  })
}

# ============================================
# CloudWatch Alarms - Custom Alarms
# ============================================

resource "aws_cloudwatch_metric_alarm" "custom" {
  for_each = var.custom_alarms

  alarm_name          = "${local.name}-${each.key}"
  comparison_operator = each.value.comparison_operator
  evaluation_periods  = each.value.evaluation_periods
  metric_name         = each.value.metric_name
  namespace           = each.value.namespace
  period              = each.value.period
  statistic           = each.value.statistic
  threshold           = each.value.threshold
  alarm_description   = each.value.description
  treat_missing_data  = each.value.treat_missing_data

  dimensions = each.value.dimensions

  alarm_actions = var.alarm_actions
  ok_actions    = var.alarm_actions

  tags = local.tags
}

# ============================================
# CloudWatch Dashboard
# ============================================

resource "aws_cloudwatch_dashboard" "main" {
  count = var.create_dashboard ? 1 : 0

  dashboard_name = "${local.name}-overview"

  dashboard_body = jsonencode({
    widgets = concat(
      # Row 1: Service Health Overview
      [
        {
          type   = "text"
          x      = 0
          y      = 0
          width  = 24
          height = 1
          properties = {
            markdown = "# ${var.project_name} - ${var.environment} Environment Dashboard\n**HIPAA-Compliant Healthcare Platform Monitoring**"
          }
        }
      ],
      # Row 2: Error Metrics
      [
        {
          type   = "metric"
          x      = 0
          y      = 1
          width  = 12
          height = 6
          properties = {
            title  = "Error Count by Service"
            region = data.aws_region.current.name
            metrics = [
              for service in local.service_names :
              ["${var.metrics_namespace}/${service}", "ErrorCount", "Service", service, "Environment", var.environment]
            ]
            period = 300
            stat   = "Sum"
            view   = "timeSeries"
          }
        },
        {
          type   = "metric"
          x      = 12
          y      = 1
          width  = 12
          height = 6
          properties = {
            title  = "Security Events"
            region = data.aws_region.current.name
            metrics = [
              ["${var.metrics_namespace}/Security", "AuthenticationFailures", "Environment", var.environment],
              ["${var.metrics_namespace}/Security", "SuspiciousActivity", "Environment", var.environment]
            ]
            period = 300
            stat   = "Sum"
            view   = "timeSeries"
          }
        }
      ],
      # Row 3: PHI and Compliance
      [
        {
          type   = "metric"
          x      = 0
          y      = 7
          width  = 12
          height = 6
          properties = {
            title  = "PHI Access Count"
            region = data.aws_region.current.name
            metrics = [
              ["${var.metrics_namespace}/Compliance", "PHIAccessCount", "Environment", var.environment]
            ]
            period = 300
            stat   = "Sum"
            view   = "timeSeries"
          }
        },
        {
          type   = "metric"
          x      = 12
          y      = 7
          width  = 12
          height = 6
          properties = {
            title  = "API Latency"
            region = data.aws_region.current.name
            metrics = [
              ["${var.metrics_namespace}/API", "APILatency"]
            ]
            period = 60
            stat   = "Average"
            view   = "timeSeries"
          }
        }
      ],
      # Row 4: Alarm Status
      [
        {
          type   = "alarm"
          x      = 0
          y      = 13
          width  = 24
          height = 4
          properties = {
            title = "Alarm Status"
            alarms = concat(
              [for service in local.service_names : aws_cloudwatch_metric_alarm.error_rate[service].arn if var.alarm_configs.error_rate_enabled],
              var.alarm_configs.auth_failures_enabled ? [aws_cloudwatch_metric_alarm.auth_failures[0].arn] : [],
              var.alarm_configs.suspicious_activity_enabled ? [aws_cloudwatch_metric_alarm.suspicious_activity[0].arn] : [],
              var.alarm_configs.phi_access_enabled ? [aws_cloudwatch_metric_alarm.phi_access_anomaly[0].arn] : []
            )
          }
        }
      ],
      # Row 5: Log Insights
      [
        {
          type   = "log"
          x      = 0
          y      = 17
          width  = 24
          height = 6
          properties = {
            title  = "Recent Errors (Last 1 Hour)"
            region = data.aws_region.current.name
            query  = "SOURCE '${aws_cloudwatch_log_group.application.name}' | fields @timestamp, @message | filter @message like /(?i)error|exception|fail/ | sort @timestamp desc | limit 50"
          }
        }
      ]
    )
  })
}

# ============================================
# CloudWatch Log Insights Query Definitions
# ============================================

resource "aws_cloudwatch_query_definition" "error_analysis" {
  name = "${local.name}/Error-Analysis"

  log_group_names = [for service in local.service_names : aws_cloudwatch_log_group.services[service].name]

  query_string = <<-EOT
    fields @timestamp, @message, @logStream
    | filter @message like /(?i)error|exception|fail/
    | stats count(*) as error_count by bin(5m)
    | sort @timestamp desc
  EOT
}

resource "aws_cloudwatch_query_definition" "auth_failures" {
  name = "${local.name}/Authentication-Failures"

  log_group_names = [aws_cloudwatch_log_group.security.name]

  query_string = <<-EOT
    fields @timestamp, @message
    | filter @message like /(?i)authentication failed|login failed|unauthorized|invalid credentials/
    | stats count(*) as failure_count by bin(5m)
    | sort @timestamp desc
  EOT
}

resource "aws_cloudwatch_query_definition" "phi_access_audit" {
  name = "${local.name}/PHI-Access-Audit"

  log_group_names = [aws_cloudwatch_log_group.phi_access.name]

  query_string = <<-EOT
    fields @timestamp, @message
    | parse @message /user:(?<user>\S+)/
    | parse @message /patient:(?<patient>\S+)/
    | parse @message /action:(?<action>\S+)/
    | stats count(*) as access_count by user, action
    | sort access_count desc
  EOT
}

resource "aws_cloudwatch_query_definition" "slow_requests" {
  name = "${local.name}/Slow-API-Requests"

  log_group_names = [for service in local.service_names : aws_cloudwatch_log_group.services[service].name]

  query_string = <<-EOT
    fields @timestamp, @message
    | parse @message /duration:(?<duration>\d+)/
    | filter duration > 1000
    | stats count(*) as slow_count, avg(duration) as avg_duration by bin(5m)
    | sort @timestamp desc
  EOT
}

# ============================================
# Log Subscription Filter for Real-time Processing
# ============================================

resource "aws_cloudwatch_log_subscription_filter" "security_alerts" {
  count = var.security_log_destination_arn != "" ? 1 : 0

  name            = "${local.name}-security-alerts"
  log_group_name  = aws_cloudwatch_log_group.security.name
  filter_pattern  = "?ERROR ?CRITICAL ?\"security\" ?\"breach\" ?\"attack\""
  destination_arn = var.security_log_destination_arn

  distribution = "ByLogStream"
}

# ============================================
# Data Sources
# ============================================

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
