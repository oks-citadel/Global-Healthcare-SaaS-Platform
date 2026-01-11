# ============================================
# The Unified Health Platform - AWS Outputs
# ============================================

# ============================================
# ECR Outputs
# ============================================

output "ecr_repository_urls" {
  description = "ECR repository URLs"
  value       = module.ecr.repository_urls
}

# ============================================
# Americas Region Outputs
# ============================================

output "americas_vpc_id" {
  description = "Americas VPC ID"
  value       = try(module.vpc_americas[0].vpc_id, null)
}

output "americas_ecs_cluster_name" {
  description = "Americas ECS Fargate cluster name"
  value       = try(module.ecs_americas[0].cluster_name, null)
}

output "americas_ecs_cluster_arn" {
  description = "Americas ECS Fargate cluster ARN"
  value       = try(module.ecs_americas[0].cluster_arn, null)
}

output "americas_alb_dns_name" {
  description = "Americas ALB DNS name"
  value       = try(module.alb_americas[0].dns_name, null)
}

output "americas_rds_endpoint" {
  description = "Americas RDS cluster endpoint"
  value       = try(module.rds_americas[0].cluster_endpoint, null)
}

output "americas_redis_endpoint" {
  description = "Americas ElastiCache endpoint"
  value       = try(module.elasticache_americas[0].primary_endpoint, null)
}

# ============================================
# Europe Region Outputs
# ============================================

output "europe_vpc_id" {
  description = "Europe VPC ID"
  value       = try(module.vpc_europe[0].vpc_id, null)
}

output "europe_ecs_cluster_name" {
  description = "Europe ECS Fargate cluster name"
  value       = try(module.ecs_europe[0].cluster_name, null)
}

output "europe_ecs_cluster_arn" {
  description = "Europe ECS Fargate cluster ARN"
  value       = try(module.ecs_europe[0].cluster_arn, null)
}

output "europe_alb_dns_name" {
  description = "Europe ALB DNS name"
  value       = try(module.alb_europe[0].dns_name, null)
}

output "europe_rds_endpoint" {
  description = "Europe RDS cluster endpoint"
  value       = try(module.rds_europe[0].cluster_endpoint, null)
}

output "europe_redis_endpoint" {
  description = "Europe ElastiCache endpoint"
  value       = try(module.elasticache_europe[0].primary_endpoint, null)
}

# ============================================
# Africa Region Outputs
# ============================================

output "africa_vpc_id" {
  description = "Africa VPC ID"
  value       = try(module.vpc_africa[0].vpc_id, null)
}

output "africa_ecs_cluster_name" {
  description = "Africa ECS Fargate cluster name"
  value       = try(module.ecs_africa[0].cluster_name, null)
}

output "africa_ecs_cluster_arn" {
  description = "Africa ECS Fargate cluster ARN"
  value       = try(module.ecs_africa[0].cluster_arn, null)
}

output "africa_alb_dns_name" {
  description = "Africa ALB DNS name"
  value       = try(module.alb_africa[0].dns_name, null)
}

output "africa_rds_endpoint" {
  description = "Africa RDS cluster endpoint"
  value       = try(module.rds_africa[0].cluster_endpoint, null)
}

output "africa_redis_endpoint" {
  description = "Africa ElastiCache endpoint"
  value       = try(module.elasticache_africa[0].primary_endpoint, null)
}

# ============================================
# Route53 DNS Outputs
# ============================================

output "route53_zone_id" {
  description = "Route53 hosted zone ID for theunifiedhealth.com"
  value       = try(module.route53[0].zone_id, null)
}

output "route53_nameservers" {
  description = "Route53 nameservers - Configure these in GoDaddy"
  value       = try(module.route53[0].nameservers, null)
}

output "route53_domain_name" {
  description = "Domain name for the hosted zone"
  value       = try(module.route53[0].domain_name, null)
}

# ============================================
# CodePipeline CI/CD Outputs
# ============================================

output "codepipeline_name" {
  description = "Name of the CodePipeline"
  value       = try(module.codepipeline[0].pipeline_name, null)
}

output "codepipeline_arn" {
  description = "ARN of the CodePipeline"
  value       = try(module.codepipeline[0].pipeline_arn, null)
}

output "codebuild_web_app_project" {
  description = "CodeBuild project for web app"
  value       = try(module.codepipeline[0].codebuild_web_app_name, null)
}

output "codebuild_api_service_project" {
  description = "CodeBuild project for API service"
  value       = try(module.codepipeline[0].codebuild_api_service_name, null)
}

output "pipeline_artifacts_bucket" {
  description = "S3 bucket for pipeline artifacts"
  value       = try(module.codepipeline[0].artifacts_bucket_name, null)
}

# ============================================
# AWS Budgets Outputs
# ============================================

output "budget_arn" {
  description = "ARN of the monthly budget"
  value       = try(module.budgets[0].budget_arn, null)
}

output "budget_alerts_sns_topic_arn" {
  description = "SNS topic ARN for budget alerts"
  value       = try(module.budgets[0].sns_topic_arn, null)
}

# ============================================
# AWS Backup Outputs - Americas
# ============================================

output "americas_backup_vault_arn" {
  description = "Americas backup vault ARN"
  value       = try(module.backup_americas[0].vault_arn, null)
}

output "americas_backup_plan_arn" {
  description = "Americas backup plan ARN"
  value       = try(module.backup_americas[0].plan_arn, null)
}

# ============================================
# AWS Backup Outputs - Europe
# ============================================

output "europe_backup_vault_arn" {
  description = "Europe backup vault ARN"
  value       = try(module.backup_europe[0].vault_arn, null)
}

output "europe_backup_plan_arn" {
  description = "Europe backup plan ARN"
  value       = try(module.backup_europe[0].plan_arn, null)
}

# ============================================
# AWS Backup Outputs - Africa
# ============================================

output "africa_backup_vault_arn" {
  description = "Africa backup vault ARN"
  value       = try(module.backup_africa[0].vault_arn, null)
}

output "africa_backup_plan_arn" {
  description = "Africa backup plan ARN"
  value       = try(module.backup_africa[0].plan_arn, null)
}
