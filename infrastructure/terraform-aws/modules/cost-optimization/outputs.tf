# ============================================
# Cost Optimization Module Outputs
# ============================================

output "monthly_budget_id" {
  description = "ID of the monthly budget"
  value       = aws_budgets_budget.monthly.id
}

output "anomaly_monitor_arns" {
  description = "ARNs of cost anomaly monitors"
  value = [
    aws_ce_anomaly_monitor.service.arn,
    aws_ce_anomaly_monitor.custom.arn,
  ]
}

output "cost_optimized_bucket_id" {
  description = "ID of the cost-optimized S3 bucket"
  value       = aws_s3_bucket.cost_optimized_storage.id
}

output "cost_optimized_bucket_arn" {
  description = "ARN of the cost-optimized S3 bucket"
  value       = aws_s3_bucket.cost_optimized_storage.arn
}

output "spot_fleet_request_id" {
  description = "ID of the Spot fleet request"
  value       = var.enable_spot_instances ? aws_spot_fleet_request.workers[0].id : null
}

output "rds_proxy_endpoint" {
  description = "RDS Proxy endpoint"
  value       = var.enable_rds_proxy ? aws_db_proxy.main[0].endpoint : null
}

output "elasticache_endpoint" {
  description = "ElastiCache primary endpoint"
  value       = var.enable_elasticache ? aws_elasticache_replication_group.cost_optimized[0].primary_endpoint_address : null
}

output "cost_optimizer_lambda_arn" {
  description = "ARN of the cost optimizer Lambda"
  value       = var.enable_cost_optimizer_lambda ? aws_lambda_function.cost_optimizer[0].arn : null
}

output "cost_allocation_tags" {
  description = "Activated cost allocation tags"
  value = [
    aws_ce_cost_allocation_tag.project.tag_key,
    aws_ce_cost_allocation_tag.environment.tag_key,
    aws_ce_cost_allocation_tag.cost_center.tag_key,
    aws_ce_cost_allocation_tag.team.tag_key,
  ]
}
