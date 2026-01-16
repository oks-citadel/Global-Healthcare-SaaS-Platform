################################################################################
# Outputs - Databases Module
# Global SaaS Marketing Platform
################################################################################

# Aurora PostgreSQL Outputs
output "aurora_cluster_id" {
  description = "Aurora cluster identifier"
  value       = aws_rds_cluster.postgresql.id
}

output "aurora_cluster_arn" {
  description = "Aurora cluster ARN"
  value       = aws_rds_cluster.postgresql.arn
}

output "aurora_cluster_endpoint" {
  description = "Aurora cluster writer endpoint"
  value       = aws_rds_cluster.postgresql.endpoint
}

output "aurora_cluster_reader_endpoint" {
  description = "Aurora cluster reader endpoint"
  value       = aws_rds_cluster.postgresql.reader_endpoint
}

output "aurora_cluster_port" {
  description = "Aurora cluster port"
  value       = aws_rds_cluster.postgresql.port
}

output "aurora_database_name" {
  description = "Aurora database name"
  value       = aws_rds_cluster.postgresql.database_name
}

output "aurora_master_username" {
  description = "Aurora master username"
  value       = aws_rds_cluster.postgresql.master_username
}

output "aurora_master_user_secret_arn" {
  description = "ARN of the secret containing the master user password"
  value       = aws_rds_cluster.postgresql.master_user_secret[0].secret_arn
}

output "aurora_instance_ids" {
  description = "Aurora instance identifiers"
  value       = aws_rds_cluster_instance.postgresql[*].id
}

# DynamoDB Outputs
output "dynamodb_table_arns" {
  description = "Map of DynamoDB table ARNs"
  value       = { for k, v in aws_dynamodb_table.main : k => v.arn }
}

output "dynamodb_table_ids" {
  description = "Map of DynamoDB table IDs"
  value       = { for k, v in aws_dynamodb_table.main : k => v.id }
}

output "dynamodb_table_stream_arns" {
  description = "Map of DynamoDB table stream ARNs"
  value       = { for k, v in aws_dynamodb_table.main : k => v.stream_arn if v.stream_enabled }
}

# ElastiCache Redis Outputs
output "redis_replication_group_id" {
  description = "Redis replication group ID"
  value       = aws_elasticache_replication_group.redis.id
}

output "redis_replication_group_arn" {
  description = "Redis replication group ARN"
  value       = aws_elasticache_replication_group.redis.arn
}

output "redis_primary_endpoint_address" {
  description = "Redis primary endpoint address"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "redis_reader_endpoint_address" {
  description = "Redis reader endpoint address"
  value       = aws_elasticache_replication_group.redis.reader_endpoint_address
}

output "redis_port" {
  description = "Redis port"
  value       = aws_elasticache_replication_group.redis.port
}

output "redis_configuration_endpoint_address" {
  description = "Redis configuration endpoint address (for cluster mode)"
  value       = aws_elasticache_replication_group.redis.configuration_endpoint_address
}

# OpenSearch Outputs
output "opensearch_domain_id" {
  description = "OpenSearch domain ID"
  value       = var.enable_opensearch ? aws_opensearch_domain.main[0].domain_id : null
}

output "opensearch_domain_arn" {
  description = "OpenSearch domain ARN"
  value       = var.enable_opensearch ? aws_opensearch_domain.main[0].arn : null
}

output "opensearch_domain_name" {
  description = "OpenSearch domain name"
  value       = var.enable_opensearch ? aws_opensearch_domain.main[0].domain_name : null
}

output "opensearch_endpoint" {
  description = "OpenSearch domain endpoint"
  value       = var.enable_opensearch ? aws_opensearch_domain.main[0].endpoint : null
}

output "opensearch_dashboard_endpoint" {
  description = "OpenSearch dashboards endpoint"
  value       = var.enable_opensearch ? aws_opensearch_domain.main[0].dashboard_endpoint : null
}

# IAM Role Outputs
output "rds_monitoring_role_arn" {
  description = "ARN of RDS monitoring IAM role"
  value       = aws_iam_role.rds_monitoring.arn
}
