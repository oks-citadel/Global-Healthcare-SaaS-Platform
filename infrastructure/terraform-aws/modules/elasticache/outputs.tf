# ============================================
# ElastiCache Module Outputs
# ============================================

output "replication_group_id" {
  description = "ElastiCache replication group ID"
  value       = aws_elasticache_replication_group.main.id
}

output "primary_endpoint" {
  description = "Primary endpoint address"
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "reader_endpoint" {
  description = "Reader endpoint address"
  value       = aws_elasticache_replication_group.main.reader_endpoint_address
}

output "port" {
  description = "Redis port"
  value       = 6379
}

output "auth_token_secret_arn" {
  description = "Secrets Manager ARN for auth token"
  value       = aws_secretsmanager_secret.auth_token.arn
}

output "security_group_id" {
  description = "Redis security group ID"
  value       = aws_security_group.redis.id
}

output "kms_key_arn" {
  description = "KMS key ARN used for encryption"
  value       = var.kms_key_arn != "" ? var.kms_key_arn : try(aws_kms_key.redis[0].arn, "")
}
