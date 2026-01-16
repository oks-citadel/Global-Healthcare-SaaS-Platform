# ============================================
# AWS Backup Restoration Testing Module - Outputs
# ============================================

# ============================================
# Lambda Function Outputs
# ============================================

output "lambda_function_arn" {
  description = "ARN of the backup restoration test Lambda function"
  value       = aws_lambda_function.backup_restore_test.arn
}

output "lambda_function_name" {
  description = "Name of the backup restoration test Lambda function"
  value       = aws_lambda_function.backup_restore_test.function_name
}

output "lambda_role_arn" {
  description = "ARN of the Lambda IAM role"
  value       = aws_iam_role.backup_restore_test.arn
}

# ============================================
# SNS Topic Outputs
# ============================================

output "sns_topic_arn" {
  description = "ARN of the SNS topic for test notifications"
  value       = aws_sns_topic.backup_test_notifications.arn
}

output "sns_topic_name" {
  description = "Name of the SNS topic for test notifications"
  value       = aws_sns_topic.backup_test_notifications.name
}

# ============================================
# CloudWatch Outputs
# ============================================

output "cloudwatch_event_rule_arn" {
  description = "ARN of the CloudWatch Events rule for scheduled testing"
  value       = aws_cloudwatch_event_rule.backup_restore_test.arn
}

output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.backup_restore_test.name
}

output "cloudwatch_log_group_arn" {
  description = "ARN of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.backup_restore_test.arn
}

# ============================================
# Alarm Outputs
# ============================================

output "alarm_arns" {
  description = "Map of CloudWatch alarm ARNs"
  value = {
    restore_test_failure = aws_cloudwatch_metric_alarm.restore_test_failure.arn
    restore_test_missed  = aws_cloudwatch_metric_alarm.restore_test_missed.arn
    restore_time_high    = aws_cloudwatch_metric_alarm.restore_time_high.arn
    data_integrity       = aws_cloudwatch_metric_alarm.data_integrity_failure.arn
  }
}

output "alarm_names" {
  description = "Map of CloudWatch alarm names"
  value = {
    restore_test_failure = aws_cloudwatch_metric_alarm.restore_test_failure.alarm_name
    restore_test_missed  = aws_cloudwatch_metric_alarm.restore_test_missed.alarm_name
    restore_time_high    = aws_cloudwatch_metric_alarm.restore_time_high.alarm_name
    data_integrity       = aws_cloudwatch_metric_alarm.data_integrity_failure.alarm_name
  }
}

# ============================================
# KMS Outputs
# ============================================

output "kms_key_arn" {
  description = "ARN of the KMS key used for encryption"
  value       = var.kms_key_arn != "" ? var.kms_key_arn : try(aws_kms_key.backup_test[0].arn, "")
}

output "kms_key_id" {
  description = "ID of the KMS key used for encryption"
  value       = var.kms_key_arn != "" ? null : try(aws_kms_key.backup_test[0].key_id, "")
}

# ============================================
# Dashboard Outputs
# ============================================

output "dashboard_name" {
  description = "Name of the CloudWatch dashboard"
  value       = var.create_dashboard ? aws_cloudwatch_dashboard.backup_restore_testing[0].dashboard_name : null
}

output "dashboard_arn" {
  description = "ARN of the CloudWatch dashboard"
  value       = var.create_dashboard ? aws_cloudwatch_dashboard.backup_restore_testing[0].dashboard_arn : null
}

# ============================================
# Testing Information
# ============================================

output "test_schedule" {
  description = "Schedule expression for automated testing"
  value       = var.test_schedule
}

output "test_enabled" {
  description = "Whether scheduled testing is enabled"
  value       = var.enable_scheduled_testing
}

output "invoke_command" {
  description = "AWS CLI command to manually invoke the backup restoration test"
  value       = "aws lambda invoke --function-name ${aws_lambda_function.backup_restore_test.function_name} --payload '{\"source\": \"manual\", \"test_type\": \"full\"}' --cli-binary-format raw-in-base64-out response.json"
}
