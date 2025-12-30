# ============================================
# UnifiedHealth Platform - AWS Outputs
# ============================================
# MIGRATED FROM AZURE TO AWS
# All outputs reference AWS resources
# ============================================

# ============================================
# VPC Outputs
# ============================================

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "VPC CIDR block"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "database_subnet_ids" {
  description = "Database subnet IDs"
  value       = aws_subnet.database[*].id
}

output "elasticache_subnet_ids" {
  description = "ElastiCache subnet IDs"
  value       = aws_subnet.elasticache[*].id
}

output "nat_gateway_ips" {
  description = "NAT Gateway Elastic IPs"
  value       = aws_eip.nat[*].public_ip
}

# ============================================
# EKS Cluster Outputs (Replaces AKS)
# ============================================

output "eks_cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.main.name
}

output "eks_cluster_arn" {
  description = "EKS cluster ARN"
  value       = aws_eks_cluster.main.arn
}

output "eks_cluster_endpoint" {
  description = "EKS cluster endpoint URL"
  value       = aws_eks_cluster.main.endpoint
}

output "eks_cluster_ca_certificate" {
  description = "EKS cluster certificate authority data (base64 encoded)"
  value       = aws_eks_cluster.main.certificate_authority[0].data
  sensitive   = true
}

output "eks_cluster_security_group_id" {
  description = "EKS cluster security group ID"
  value       = aws_security_group.eks_cluster.id
}

output "eks_node_security_group_id" {
  description = "EKS node security group ID"
  value       = aws_security_group.eks_nodes.id
}

output "eks_oidc_provider_arn" {
  description = "EKS OIDC provider ARN for IRSA"
  value       = aws_iam_openid_connect_provider.eks.arn
}

output "eks_oidc_provider_url" {
  description = "EKS OIDC provider URL"
  value       = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

# kubectl configuration command
output "eks_configure_kubectl" {
  description = "Command to configure kubectl for EKS"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.main.name}"
}

# ============================================
# ECR Outputs (Replaces ACR)
# ============================================

output "ecr_repository_urls" {
  description = "ECR repository URLs"
  value       = { for k, v in aws_ecr_repository.services : k => v.repository_url }
}

output "ecr_registry_id" {
  description = "ECR registry ID (AWS account ID)"
  value       = data.aws_caller_identity.current.account_id
}

# Docker login command
output "ecr_docker_login" {
  description = "Command to authenticate Docker with ECR"
  value       = "aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
}

# ============================================
# RDS Aurora PostgreSQL Outputs (Replaces Azure PostgreSQL)
# ============================================

output "rds_cluster_endpoint" {
  description = "RDS Aurora cluster endpoint (write)"
  value       = aws_rds_cluster.main.endpoint
}

output "rds_cluster_reader_endpoint" {
  description = "RDS Aurora cluster reader endpoint (read replicas)"
  value       = aws_rds_cluster.main.reader_endpoint
}

output "rds_cluster_port" {
  description = "RDS Aurora cluster port"
  value       = aws_rds_cluster.main.port
}

output "rds_cluster_arn" {
  description = "RDS Aurora cluster ARN"
  value       = aws_rds_cluster.main.arn
}

output "rds_connection_secret_arn" {
  description = "Secrets Manager ARN for RDS connection details"
  value       = aws_secretsmanager_secret.rds_connection.arn
}

output "rds_security_group_id" {
  description = "RDS security group ID"
  value       = aws_security_group.rds.id
}

# ============================================
# ElastiCache Redis Outputs (Replaces Azure Redis)
# ============================================

output "redis_primary_endpoint" {
  description = "ElastiCache Redis primary endpoint"
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "redis_reader_endpoint" {
  description = "ElastiCache Redis reader endpoint"
  value       = aws_elasticache_replication_group.main.reader_endpoint_address
}

output "redis_port" {
  description = "ElastiCache Redis port"
  value       = 6379
}

output "redis_auth_token_secret_arn" {
  description = "Secrets Manager ARN for Redis auth token"
  value       = aws_secretsmanager_secret.redis_auth_token.arn
}

output "redis_security_group_id" {
  description = "Redis security group ID"
  value       = aws_security_group.redis.id
}

# ============================================
# S3 Outputs (Replaces Azure Storage Account)
# ============================================

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.main.id
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.main.arn
}

output "s3_bucket_domain_name" {
  description = "S3 bucket domain name"
  value       = aws_s3_bucket.main.bucket_regional_domain_name
}

# ============================================
# KMS Key Outputs (Replaces Azure Key Vault)
# ============================================

output "kms_secrets_key_arn" {
  description = "KMS key ARN for secrets encryption"
  value       = aws_kms_key.secrets.arn
}

output "kms_secrets_key_alias" {
  description = "KMS key alias for secrets"
  value       = aws_kms_alias.secrets.name
}

output "kms_rds_key_arn" {
  description = "KMS key ARN for RDS encryption"
  value       = aws_kms_key.rds.arn
}

output "kms_ecr_key_arn" {
  description = "KMS key ARN for ECR encryption"
  value       = aws_kms_key.ecr.arn
}

output "kms_eks_key_arn" {
  description = "KMS key ARN for EKS secrets encryption"
  value       = aws_kms_key.eks.arn
}

output "kms_global_key_arn" {
  description = "Global KMS key ARN"
  value       = aws_kms_key.global.arn
}

# ============================================
# CloudWatch / Monitoring Outputs
# ============================================

output "cloudwatch_log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.main.name
}

output "cloudwatch_log_group_arn" {
  description = "CloudWatch log group ARN"
  value       = aws_cloudwatch_log_group.main.arn
}

output "sns_alerts_topic_arn" {
  description = "SNS topic ARN for alerts"
  value       = aws_sns_topic.alerts.arn
}

output "sns_global_alerts_topic_arn" {
  description = "Global SNS topic ARN for alerts"
  value       = aws_sns_topic.global_alerts.arn
}

# ============================================
# CloudFront / CDN Outputs (Replaces Azure Front Door)
# ============================================

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.global.id
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.global.arn
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.global.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "CloudFront hosted zone ID (for Route 53 alias records)"
  value       = aws_cloudfront_distribution.global.hosted_zone_id
}

# ============================================
# WAF Outputs
# ============================================

output "waf_web_acl_arn" {
  description = "WAF Web ACL ARN"
  value       = aws_wafv2_web_acl.global.arn
}

output "waf_web_acl_id" {
  description = "WAF Web ACL ID"
  value       = aws_wafv2_web_acl.global.id
}

# ============================================
# Global ECR Outputs
# ============================================

output "global_ecr_repository_urls" {
  description = "Global ECR repository URLs"
  value       = { for k, v in aws_ecr_repository.global : k => v.repository_url }
}

# ============================================
# Route 53 Outputs (Replaces Azure DNS / Traffic Manager)
# ============================================

output "route53_zone_id" {
  description = "Route 53 hosted zone ID"
  value       = var.manage_dns ? aws_route53_zone.global[0].zone_id : null
}

output "route53_zone_name_servers" {
  description = "Route 53 hosted zone name servers"
  value       = var.manage_dns ? aws_route53_zone.global[0].name_servers : null
}

# ============================================
# IAM Role Outputs
# ============================================

output "eks_cluster_role_arn" {
  description = "EKS cluster IAM role ARN"
  value       = aws_iam_role.eks_cluster.arn
}

output "eks_node_role_arn" {
  description = "EKS node IAM role ARN"
  value       = aws_iam_role.eks_nodes.arn
}

# ============================================
# Account / Region Information
# ============================================

output "aws_account_id" {
  description = "AWS account ID"
  value       = data.aws_caller_identity.current.account_id
}

output "aws_region" {
  description = "AWS region"
  value       = data.aws_region.current.name
}

# ============================================
# Connection Strings (for applications)
# ============================================

output "postgresql_connection_string" {
  description = "PostgreSQL connection string (fetch password from Secrets Manager)"
  value       = "postgresql://${var.postgresql_admin_username}:<password>@${aws_rds_cluster.main.endpoint}:${aws_rds_cluster.main.port}/unified_health"
  sensitive   = true
}

output "redis_connection_string" {
  description = "Redis connection string (TLS enabled)"
  value       = "rediss://:${random_password.redis_auth_token.result}@${aws_elasticache_replication_group.main.primary_endpoint_address}:6379/0"
  sensitive   = true
}

# ============================================
# Summary Output
# ============================================

output "deployment_summary" {
  description = "Summary of deployed resources"
  value = {
    environment           = var.environment
    aws_region            = var.aws_region
    vpc_id                = aws_vpc.main.id
    eks_cluster_name      = aws_eks_cluster.main.name
    rds_endpoint          = aws_rds_cluster.main.endpoint
    redis_endpoint        = aws_elasticache_replication_group.main.primary_endpoint_address
    cloudfront_domain     = aws_cloudfront_distribution.global.domain_name
    s3_bucket             = aws_s3_bucket.main.id
    ecr_registry          = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
  }
}
