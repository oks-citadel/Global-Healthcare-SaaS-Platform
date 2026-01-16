################################################################################
# Outputs - Observability Module
# Global SaaS Marketing Platform
################################################################################

# CloudWatch Log Group Outputs
output "log_group_arns" {
  description = "Map of CloudWatch log group ARNs"
  value       = { for k, v in aws_cloudwatch_log_group.application : k => v.arn }
}

output "log_group_names" {
  description = "Map of CloudWatch log group names"
  value       = { for k, v in aws_cloudwatch_log_group.application : k => v.name }
}

# CloudWatch Alarm Outputs
output "alarm_arns" {
  description = "Map of CloudWatch alarm ARNs"
  value       = { for k, v in aws_cloudwatch_metric_alarm.main : k => v.arn }
}

output "alarm_names" {
  description = "Map of CloudWatch alarm names"
  value       = { for k, v in aws_cloudwatch_metric_alarm.main : k => v.alarm_name }
}

output "composite_alarm_arn" {
  description = "ARN of the composite alarm"
  value       = var.enable_composite_alarms ? aws_cloudwatch_composite_alarm.critical[0].arn : null
}

# CloudWatch Dashboard Outputs
output "dashboard_name" {
  description = "Name of the CloudWatch dashboard"
  value       = aws_cloudwatch_dashboard.main.dashboard_name
}

output "dashboard_arn" {
  description = "ARN of the CloudWatch dashboard"
  value       = aws_cloudwatch_dashboard.main.dashboard_arn
}

# Amazon Managed Prometheus Outputs
output "amp_workspace_id" {
  description = "ID of the AMP workspace"
  value       = var.enable_amp ? aws_prometheus_workspace.main[0].id : null
}

output "amp_workspace_arn" {
  description = "ARN of the AMP workspace"
  value       = var.enable_amp ? aws_prometheus_workspace.main[0].arn : null
}

output "amp_workspace_endpoint" {
  description = "Prometheus endpoint of the AMP workspace"
  value       = var.enable_amp ? aws_prometheus_workspace.main[0].prometheus_endpoint : null
}

# Amazon Managed Grafana Outputs
output "amg_workspace_id" {
  description = "ID of the AMG workspace"
  value       = var.enable_amg ? aws_grafana_workspace.main[0].id : null
}

output "amg_workspace_arn" {
  description = "ARN of the AMG workspace"
  value       = var.enable_amg ? aws_grafana_workspace.main[0].arn : null
}

output "amg_workspace_endpoint" {
  description = "Grafana workspace endpoint"
  value       = var.enable_amg ? aws_grafana_workspace.main[0].endpoint : null
}

output "amg_workspace_grafana_version" {
  description = "Version of Grafana running in the workspace"
  value       = var.enable_amg ? aws_grafana_workspace.main[0].grafana_version : null
}

output "grafana_role_arn" {
  description = "ARN of the Grafana IAM role"
  value       = var.enable_amg ? aws_iam_role.grafana[0].arn : null
}

# X-Ray Outputs
output "xray_sampling_rule_arn" {
  description = "ARN of the X-Ray sampling rule"
  value       = var.enable_xray ? aws_xray_sampling_rule.main[0].arn : null
}

output "xray_group_arn" {
  description = "ARN of the X-Ray group"
  value       = var.enable_xray ? aws_xray_group.main[0].arn : null
}

# SNS Alert Topic Outputs
output "alerts_topic_arn" {
  description = "ARN of the alerts SNS topic"
  value       = aws_sns_topic.alerts.arn
}

output "alerts_topic_name" {
  description = "Name of the alerts SNS topic"
  value       = aws_sns_topic.alerts.name
}

# Anomaly Detection Outputs
output "anomaly_alarm_arns" {
  description = "Map of anomaly detection alarm ARNs"
  value       = { for k, v in aws_cloudwatch_metric_alarm.anomaly : k => v.arn }
}
