# ============================================
# AWS CloudWatch Module - Outputs
# ============================================

# ============================================
# Log Group Outputs
# ============================================

output "log_group_arns" {
  description = "Map of service names to their log group ARNs"
  value = {
    for key, log_group in aws_cloudwatch_log_group.services :
    key => log_group.arn
  }
}

output "log_group_names" {
  description = "Map of service names to their log group names"
  value = {
    for key, log_group in aws_cloudwatch_log_group.services :
    key => log_group.name
  }
}

output "application_log_group_arn" {
  description = "ARN of the application log group"
  value       = aws_cloudwatch_log_group.application.arn
}

output "application_log_group_name" {
  description = "Name of the application log group"
  value       = aws_cloudwatch_log_group.application.name
}

output "security_log_group_arn" {
  description = "ARN of the security log group"
  value       = aws_cloudwatch_log_group.security.arn
}

output "security_log_group_name" {
  description = "Name of the security log group"
  value       = aws_cloudwatch_log_group.security.name
}

output "access_log_group_arn" {
  description = "ARN of the access log group"
  value       = aws_cloudwatch_log_group.access.arn
}

output "access_log_group_name" {
  description = "Name of the access log group"
  value       = aws_cloudwatch_log_group.access.name
}

output "phi_access_log_group_arn" {
  description = "ARN of the PHI access log group"
  value       = aws_cloudwatch_log_group.phi_access.arn
}

output "phi_access_log_group_name" {
  description = "Name of the PHI access log group"
  value       = aws_cloudwatch_log_group.phi_access.name
}

output "all_log_group_arns" {
  description = "List of all log group ARNs"
  value = concat(
    [for lg in aws_cloudwatch_log_group.services : lg.arn],
    [
      aws_cloudwatch_log_group.application.arn,
      aws_cloudwatch_log_group.security.arn,
      aws_cloudwatch_log_group.access.arn,
      aws_cloudwatch_log_group.phi_access.arn
    ]
  )
}

# ============================================
# Alarm Outputs
# ============================================

output "alarm_arns" {
  description = "Map of alarm names to their ARNs"
  value = merge(
    {
      for key, alarm in aws_cloudwatch_metric_alarm.error_rate :
      "error-rate-${key}" => alarm.arn
    },
    var.alarm_configs.auth_failures_enabled ? {
      "auth-failures" = aws_cloudwatch_metric_alarm.auth_failures[0].arn
    } : {},
    var.alarm_configs.suspicious_activity_enabled ? {
      "suspicious-activity" = aws_cloudwatch_metric_alarm.suspicious_activity[0].arn
    } : {},
    var.alarm_configs.phi_access_enabled ? {
      "phi-access-anomaly" = aws_cloudwatch_metric_alarm.phi_access_anomaly[0].arn
    } : {},
    {
      for key, alarm in aws_cloudwatch_metric_alarm.custom :
      key => alarm.arn
    }
  )
}

output "error_rate_alarm_arns" {
  description = "Map of service names to their error rate alarm ARNs"
  value = {
    for key, alarm in aws_cloudwatch_metric_alarm.error_rate :
    key => alarm.arn
  }
}

output "security_alarm_arns" {
  description = "List of security-related alarm ARNs"
  value = compact([
    var.alarm_configs.auth_failures_enabled ? aws_cloudwatch_metric_alarm.auth_failures[0].arn : null,
    var.alarm_configs.suspicious_activity_enabled ? aws_cloudwatch_metric_alarm.suspicious_activity[0].arn : null
  ])
}

output "compliance_alarm_arns" {
  description = "List of compliance-related alarm ARNs"
  value = compact([
    var.alarm_configs.phi_access_enabled ? aws_cloudwatch_metric_alarm.phi_access_anomaly[0].arn : null
  ])
}

# ============================================
# KMS Key Outputs
# ============================================

output "kms_key_arn" {
  description = "ARN of the KMS key used for log encryption"
  value       = var.create_kms_key ? aws_kms_key.cloudwatch[0].arn : var.kms_key_arn
}

output "kms_key_id" {
  description = "ID of the KMS key used for log encryption"
  value       = var.create_kms_key ? aws_kms_key.cloudwatch[0].key_id : null
}

output "kms_key_alias" {
  description = "Alias of the KMS key"
  value       = var.create_kms_key ? aws_kms_alias.cloudwatch[0].name : null
}

# ============================================
# Dashboard Outputs
# ============================================

output "dashboard_arn" {
  description = "ARN of the CloudWatch dashboard"
  value       = var.create_dashboard ? aws_cloudwatch_dashboard.main[0].dashboard_arn : null
}

output "dashboard_name" {
  description = "Name of the CloudWatch dashboard"
  value       = var.create_dashboard ? aws_cloudwatch_dashboard.main[0].dashboard_name : null
}

# ============================================
# Metric Filter Outputs
# ============================================

output "metric_filter_names" {
  description = "List of metric filter names"
  value = concat(
    [for mf in aws_cloudwatch_log_metric_filter.error_count : mf.name],
    [
      aws_cloudwatch_log_metric_filter.auth_failures.name,
      aws_cloudwatch_log_metric_filter.phi_access.name,
      aws_cloudwatch_log_metric_filter.suspicious_activity.name,
      aws_cloudwatch_log_metric_filter.api_latency.name
    ]
  )
}

# ============================================
# Query Definition Outputs
# ============================================

output "query_definition_ids" {
  description = "Map of query definition names to their IDs"
  value = {
    "error-analysis"    = aws_cloudwatch_query_definition.error_analysis.query_definition_id
    "auth-failures"     = aws_cloudwatch_query_definition.auth_failures.query_definition_id
    "phi-access-audit"  = aws_cloudwatch_query_definition.phi_access_audit.query_definition_id
    "slow-requests"     = aws_cloudwatch_query_definition.slow_requests.query_definition_id
  }
}

# ============================================
# Summary Output
# ============================================

output "cloudwatch_summary" {
  description = "Summary of CloudWatch resources"
  value = {
    log_groups = {
      services    = [for lg in aws_cloudwatch_log_group.services : lg.name]
      application = aws_cloudwatch_log_group.application.name
      security    = aws_cloudwatch_log_group.security.name
      access      = aws_cloudwatch_log_group.access.name
      phi_access  = aws_cloudwatch_log_group.phi_access.name
    }
    retention = {
      application_days = var.log_retention_days
      security_days    = var.security_log_retention_days
      phi_days         = var.phi_log_retention_days
    }
    encryption = {
      enabled     = var.create_kms_key || var.kms_key_arn != null
      kms_key_arn = var.create_kms_key ? aws_kms_key.cloudwatch[0].arn : var.kms_key_arn
    }
    alarms = {
      error_rate_enabled          = var.alarm_configs.error_rate_enabled
      auth_failures_enabled       = var.alarm_configs.auth_failures_enabled
      suspicious_activity_enabled = var.alarm_configs.suspicious_activity_enabled
      phi_access_enabled          = var.alarm_configs.phi_access_enabled
      custom_alarm_count          = length(var.custom_alarms)
    }
    dashboard_enabled = var.create_dashboard
    metrics_namespace = var.metrics_namespace
  }
}
