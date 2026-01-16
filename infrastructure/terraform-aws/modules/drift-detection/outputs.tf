# ============================================
# Drift Detection Module Outputs
# ============================================

output "config_recorder_id" {
  description = "AWS Config recorder ID"
  value       = aws_config_configuration_recorder.main.id
}

output "config_bucket_name" {
  description = "S3 bucket for Config data"
  value       = aws_s3_bucket.config.id
}

output "sns_topic_arn" {
  description = "SNS topic ARN for alerts"
  value       = aws_sns_topic.config_alerts.arn
}

output "dashboard_name" {
  description = "CloudWatch dashboard name"
  value       = aws_cloudwatch_dashboard.drift.dashboard_name
}

output "config_rules" {
  description = "List of Config rule names"
  value = [
    aws_config_config_rule.eks_logging.name,
    aws_config_config_rule.rds_encryption.name,
    aws_config_config_rule.s3_encryption.name,
    aws_config_config_rule.s3_public_access.name,
    aws_config_config_rule.vpc_flow_logs.name,
    aws_config_config_rule.encrypted_volumes.name,
    aws_config_config_rule.cloudtrail_enabled.name,
    aws_config_config_rule.security_group_open.name,
    aws_config_config_rule.root_access_key.name,
    aws_config_config_rule.mfa_enabled.name
  ]
}
