# ============================================
# UnifiedHealth Platform - AWS Variables
# ============================================
# All variables for AWS deployment
# NO AZURE VARIABLES ALLOWED
# ============================================

# ============================================
# Core Configuration
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "unified-health"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "aws_region" {
  description = "Primary AWS region"
  type        = string
  default     = "us-east-1"
}

# ============================================
# IAM / Cross-Account Access
# ============================================

variable "assume_role_arn" {
  description = "IAM role ARN to assume for cross-account access"
  type        = string
  default     = ""
}

variable "assume_role_external_id" {
  description = "External ID for assume role"
  type        = string
  default     = ""
  sensitive   = true
}

# ============================================
# Multi-Region Deployment Flags
# ============================================

variable "deploy_americas" {
  description = "Deploy Americas region (us-east-1)"
  type        = bool
  default     = true
}

variable "deploy_europe" {
  description = "Deploy Europe region (eu-west-1)"
  type        = bool
  default     = true
}

variable "deploy_africa" {
  description = "Deploy Africa region (af-south-1)"
  type        = bool
  default     = true
}

# ============================================
# Compliance Configuration
# ============================================

variable "compliance_standards" {
  description = "Compliance standards to enforce"
  type        = list(string)
  default     = ["HIPAA", "SOC2", "ISO27001"]
}

variable "data_residency_required" {
  description = "Whether data residency restrictions apply"
  type        = bool
  default     = true
}

# ============================================
# VPC Configuration
# ============================================

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_azs" {
  description = "Availability zones for VPC"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "vpc_private_subnets" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "vpc_public_subnets" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "vpc_database_subnets" {
  description = "Database subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.201.0/24", "10.0.202.0/24", "10.0.203.0/24"]
}

variable "vpc_elasticache_subnets" {
  description = "ElastiCache subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.211.0/24", "10.0.212.0/24", "10.0.213.0/24"]
}

# ============================================
# EKS Configuration
# ============================================

variable "eks_cluster_version" {
  description = "Kubernetes version for EKS"
  type        = string
  default     = "1.29"
}

variable "eks_node_instance_types" {
  description = "Instance types for EKS node groups"
  type        = list(string)
  default     = ["m6i.xlarge", "m6i.2xlarge"]
}

variable "eks_node_min_size" {
  description = "Minimum number of EKS nodes"
  type        = number
  default     = 2
}

variable "eks_node_max_size" {
  description = "Maximum number of EKS nodes"
  type        = number
  default     = 10
}

variable "eks_node_desired_size" {
  description = "Desired number of EKS nodes"
  type        = number
  default     = 3
}

# ============================================
# RDS / Aurora Configuration
# ============================================

variable "rds_engine_version" {
  description = "PostgreSQL engine version for Aurora"
  type        = string
  default     = "15.4"
}

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.r6g.large"
}

variable "rds_allocated_storage" {
  description = "Allocated storage in GB"
  type        = number
  default     = 100
}

variable "rds_multi_az" {
  description = "Enable Multi-AZ for RDS"
  type        = bool
  default     = true
}

variable "rds_backup_retention_days" {
  description = "Backup retention period in days"
  type        = number
  default     = 35
}

variable "rds_master_username" {
  description = "Master username for RDS"
  type        = string
  default     = "unifiedhealth_admin"
  sensitive   = true
}

# ============================================
# ElastiCache Configuration
# ============================================

variable "elasticache_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.r6g.large"
}

variable "elasticache_num_cache_clusters" {
  description = "Number of cache clusters"
  type        = number
  default     = 2
}

variable "elasticache_engine_version" {
  description = "Redis engine version"
  type        = string
  default     = "7.0"
}

# ============================================
# S3 Configuration
# ============================================

variable "s3_force_destroy" {
  description = "Allow bucket destruction with objects"
  type        = bool
  default     = false
}

variable "s3_versioning" {
  description = "Enable S3 versioning"
  type        = bool
  default     = true
}

# ============================================
# CloudFront Configuration
# ============================================

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_All"
}

variable "cloudfront_ssl_certificate_arn" {
  description = "ACM certificate ARN for CloudFront"
  type        = string
  default     = ""
}

# ============================================
# Monitoring & Alerting
# ============================================

variable "alert_email" {
  description = "Email address for alerts"
  type        = string
  default     = "ops@unifiedhealth.example.com"
}

variable "enable_enhanced_monitoring" {
  description = "Enable enhanced monitoring for RDS"
  type        = bool
  default     = true
}

variable "cloudwatch_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 90
}

# ============================================
# Network Security
# ============================================

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access resources"
  type        = list(string)
  default     = []
}

variable "enable_vpc_flow_logs" {
  description = "Enable VPC flow logs"
  type        = bool
  default     = true
}

# ============================================
# Cost Management
# ============================================

variable "enable_cost_allocation_tags" {
  description = "Enable cost allocation tags"
  type        = bool
  default     = true
}

variable "monthly_budget_usd" {
  description = "Monthly budget in USD"
  type        = number
  default     = 50000
}
