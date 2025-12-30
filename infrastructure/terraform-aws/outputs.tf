# ============================================
# UnifiedHealth Platform - AWS Outputs
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

output "americas_eks_cluster_endpoint" {
  description = "Americas EKS cluster endpoint"
  value       = try(module.eks_americas[0].cluster_endpoint, null)
}

output "americas_eks_cluster_name" {
  description = "Americas EKS cluster name"
  value       = try(module.eks_americas[0].cluster_name, null)
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

output "europe_eks_cluster_endpoint" {
  description = "Europe EKS cluster endpoint"
  value       = try(module.eks_europe[0].cluster_endpoint, null)
}

output "europe_eks_cluster_name" {
  description = "Europe EKS cluster name"
  value       = try(module.eks_europe[0].cluster_name, null)
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

output "africa_eks_cluster_endpoint" {
  description = "Africa EKS cluster endpoint"
  value       = try(module.eks_africa[0].cluster_endpoint, null)
}

output "africa_eks_cluster_name" {
  description = "Africa EKS cluster name"
  value       = try(module.eks_africa[0].cluster_name, null)
}

output "africa_rds_endpoint" {
  description = "Africa RDS cluster endpoint"
  value       = try(module.rds_africa[0].cluster_endpoint, null)
}

output "africa_redis_endpoint" {
  description = "Africa ElastiCache endpoint"
  value       = try(module.elasticache_africa[0].primary_endpoint, null)
}
