# ============================================
# AWS Budgets Module Outputs
# ============================================

output "budget_arn" {
  description = "ARN of the main budget"
  value       = aws_budgets_budget.monthly.arn
}

output "budget_id" {
  description = "ID of the main budget"
  value       = aws_budgets_budget.monthly.id
}

output "budget_name" {
  description = "Name of the main budget"
  value       = aws_budgets_budget.monthly.name
}

output "sns_topic_arn" {
  description = "ARN of the SNS topic for budget alerts"
  value       = aws_sns_topic.budget_alerts.arn
}

output "sns_topic_name" {
  description = "Name of the SNS topic for budget alerts"
  value       = aws_sns_topic.budget_alerts.name
}

output "kms_key_arn" {
  description = "ARN of the KMS key used for SNS encryption"
  value       = aws_kms_key.budget_alerts.arn
}

output "kms_key_id" {
  description = "ID of the KMS key used for SNS encryption"
  value       = aws_kms_key.budget_alerts.key_id
}

output "ec2_budget_arn" {
  description = "ARN of the EC2 service budget"
  value       = length(aws_budgets_budget.ec2) > 0 ? aws_budgets_budget.ec2[0].arn : null
}

output "rds_budget_arn" {
  description = "ARN of the RDS service budget"
  value       = length(aws_budgets_budget.rds) > 0 ? aws_budgets_budget.rds[0].arn : null
}

output "budget_action_id" {
  description = "ID of the budget action (if enabled)"
  value       = length(aws_budgets_budget_action.cost_control) > 0 ? aws_budgets_budget_action.cost_control[0].action_id : null
}
