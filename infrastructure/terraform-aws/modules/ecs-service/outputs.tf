# =============================================================================
# ECS Service Module - Outputs
# =============================================================================

output "service_id" {
  description = "ECS service ID"
  value       = aws_ecs_service.main.id
}

output "service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.main.name
}

output "service_arn" {
  description = "ECS service ARN"
  value       = aws_ecs_service.main.id
}

output "task_definition_arn" {
  description = "Task definition ARN"
  value       = aws_ecs_task_definition.main.arn
}

output "task_definition_family" {
  description = "Task definition family"
  value       = aws_ecs_task_definition.main.family
}

output "task_definition_revision" {
  description = "Task definition revision"
  value       = aws_ecs_task_definition.main.revision
}

output "target_group_arn" {
  description = "ALB target group ARN"
  value       = aws_lb_target_group.main.arn
}

output "target_group_name" {
  description = "ALB target group name"
  value       = aws_lb_target_group.main.name
}

output "log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.service.name
}

output "log_group_arn" {
  description = "CloudWatch log group ARN"
  value       = aws_cloudwatch_log_group.service.arn
}
