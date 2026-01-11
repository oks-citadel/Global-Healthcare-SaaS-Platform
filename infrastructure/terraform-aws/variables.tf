# ============================================
# The Unified Health Platform - AWS Variables
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
# ECS Fargate Configuration (Replaces EKS)
# ============================================

variable "ecs_enable_container_insights" {
  description = "Enable CloudWatch Container Insights for ECS"
  type        = bool
  default     = true
}

variable "ecs_fargate_weight" {
  description = "Weight for Fargate capacity provider (on-demand)"
  type        = number
  default     = 20
}

variable "ecs_fargate_spot_weight" {
  description = "Weight for Fargate Spot capacity provider"
  type        = number
  default     = 80
}

variable "ecs_log_retention_days" {
  description = "CloudWatch log retention in days for ECS"
  type        = number
  default     = 30
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

# ============================================
# Domain Configuration
# ============================================

variable "domain_name" {
  description = "Primary domain name"
  type        = string
  default     = "theunifiedhealth.com"
}

variable "enable_route53" {
  description = "Enable Route53 hosted zone"
  type        = bool
  default     = true
}

# ============================================
# CI/CD Configuration
# ============================================

variable "enable_codepipeline" {
  description = "Enable CodePipeline CI/CD"
  type        = bool
  default     = true
}

variable "github_connection_arn" {
  description = "ARN of CodeStar connection to GitHub"
  type        = string
  default     = ""
}

variable "github_repository" {
  description = "GitHub repository (owner/repo format)"
  type        = string
  default     = ""
}

variable "github_branch" {
  description = "GitHub branch to deploy"
  type        = string
  default     = "main"
}

# ============================================
# SES Configuration (Email - Replaces SendGrid)
# ============================================

variable "enable_ses" {
  description = "Enable AWS SES for email delivery (replaces SendGrid)"
  type        = bool
  default     = true
}

# ============================================
# SNS/SQS Configuration (Messaging - Replaces Twilio)
# ============================================

variable "enable_sns_sqs" {
  description = "Enable AWS SNS/SQS for messaging (replaces Twilio)"
  type        = bool
  default     = true
}

# ============================================
# AWS Budgets Configuration
# ============================================

variable "enable_budgets" {
  description = "Enable AWS Budgets for cost monitoring and alerts"
  type        = bool
  default     = true
}

variable "budget_amount" {
  description = "Monthly budget amount in USD"
  type        = number
  default     = 50000
}

variable "budget_alert_thresholds" {
  description = "List of threshold percentages to trigger budget alerts"
  type        = list(number)
  default     = [50, 80, 100, 120]
}

variable "budget_alert_emails" {
  description = "List of email addresses to receive budget alerts"
  type        = list(string)
  default     = []
}

# ============================================
# AWS Backup Configuration
# ============================================

variable "enable_backup" {
  description = "Enable AWS Backup for centralized backup management"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Number of days to retain daily backups"
  type        = number
  default     = 35
}

variable "backup_enable_weekly" {
  description = "Enable weekly backup rule"
  type        = bool
  default     = true
}

variable "backup_weekly_retention_days" {
  description = "Number of days to retain weekly backups"
  type        = number
  default     = 90
}

variable "backup_enable_monthly" {
  description = "Enable monthly backup rule"
  type        = bool
  default     = true
}

variable "backup_monthly_retention_days" {
  description = "Number of days to retain monthly backups"
  type        = number
  default     = 365
}

variable "backup_enable_vault_lock" {
  description = "Enable vault lock for immutable backups (compliance mode)"
  type        = bool
  default     = false
}

variable "backup_enable_cross_region_copy" {
  description = "Enable cross-region backup copy for disaster recovery"
  type        = bool
  default     = false
}

variable "backup_notification_emails" {
  description = "List of email addresses for backup notifications"
  type        = list(string)
  default     = []
}
