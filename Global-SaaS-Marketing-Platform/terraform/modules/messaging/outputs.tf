################################################################################
# Outputs - Messaging Module
# Global SaaS Marketing Platform
################################################################################

# EventBridge Outputs
output "event_bus_name" {
  description = "Name of the EventBridge event bus"
  value       = aws_cloudwatch_event_bus.main.name
}

output "event_bus_arn" {
  description = "ARN of the EventBridge event bus"
  value       = aws_cloudwatch_event_bus.main.arn
}

output "event_archive_arn" {
  description = "ARN of the EventBridge archive"
  value       = aws_cloudwatch_event_archive.main.arn
}

output "event_rule_arns" {
  description = "Map of EventBridge rule ARNs"
  value       = { for k, v in aws_cloudwatch_event_rule.main : k => v.arn }
}

# SQS Outputs
output "sqs_queue_arns" {
  description = "Map of SQS queue ARNs"
  value       = { for k, v in aws_sqs_queue.main : k => v.arn }
}

output "sqs_queue_urls" {
  description = "Map of SQS queue URLs"
  value       = { for k, v in aws_sqs_queue.main : k => v.url }
}

output "sqs_queue_ids" {
  description = "Map of SQS queue IDs"
  value       = { for k, v in aws_sqs_queue.main : k => v.id }
}

output "sqs_dlq_arns" {
  description = "Map of SQS dead letter queue ARNs"
  value       = { for k, v in aws_sqs_queue.dlq : k => v.arn }
}

output "sqs_dlq_urls" {
  description = "Map of SQS dead letter queue URLs"
  value       = { for k, v in aws_sqs_queue.dlq : k => v.url }
}

# SNS Outputs
output "sns_topic_arns" {
  description = "Map of SNS topic ARNs"
  value       = { for k, v in aws_sns_topic.main : k => v.arn }
}

output "sns_topic_ids" {
  description = "Map of SNS topic IDs"
  value       = { for k, v in aws_sns_topic.main : k => v.id }
}

# Step Functions Outputs
output "step_function_arns" {
  description = "Map of Step Functions state machine ARNs"
  value       = { for k, v in aws_sfn_state_machine.main : k => v.arn }
}

output "step_function_ids" {
  description = "Map of Step Functions state machine IDs"
  value       = { for k, v in aws_sfn_state_machine.main : k => v.id }
}

output "step_function_role_arns" {
  description = "Map of Step Functions IAM role ARNs"
  value       = { for k, v in aws_iam_role.step_functions : k => v.arn }
}

# Scheduler Outputs
output "schedule_group_name" {
  description = "Name of the scheduler schedule group"
  value       = aws_scheduler_schedule_group.main.name
}

output "schedule_group_arn" {
  description = "ARN of the scheduler schedule group"
  value       = aws_scheduler_schedule_group.main.arn
}

output "scheduler_role_arn" {
  description = "ARN of the scheduler IAM role"
  value       = aws_iam_role.scheduler.arn
}
