# ============================================
# UnifiedHealth Platform - AWS Variables
# ============================================
# MIGRATED FROM AZURE TO AWS
# All Azure-specific variables replaced with AWS equivalents
# ============================================

# ============================================
# AWS Account Configuration
# ============================================

variable "aws_account_id" {
  description = "AWS Account ID for deployment"
  type        = string
  default     = "992382449461"
}

variable "organizational_unit_id" {
  description = "AWS Organizations OU ID"
  type        = string
  default     = "ou-2kqs-qw6vym5t"
}

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
    condition     = contains(["dev", "dev2", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, dev2, staging, or prod."
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
# VPC / Network Configuration
# ============================================

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.1.0.0/16"
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access resources (e.g., EKS API)"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # Default to allow all for public access
}

# ============================================
# EKS Configuration (Replaces AKS)
# ============================================

variable "kubernetes_version" {
  description = "Kubernetes version for EKS"
  type        = string
  default     = "1.29"
}

variable "eks_public_access" {
  description = "Enable public access to EKS API endpoint"
  type        = bool
  default     = true
}

variable "eks_system_node_count" {
  description = "Desired number of system nodes"
  type        = number
  default     = 2
}

variable "eks_system_node_size" {
  description = "EC2 instance type for system nodes"
  type        = string
  default     = "m6i.large"
}

variable "eks_system_node_min" {
  description = "Minimum system nodes for autoscaling"
  type        = number
  default     = 2
}

variable "eks_system_node_max" {
  description = "Maximum system nodes for autoscaling"
  type        = number
  default     = 4
}

variable "eks_user_node_count" {
  description = "Desired number of application nodes"
  type        = number
  default     = 2
}

variable "eks_user_node_size" {
  description = "EC2 instance type for application nodes"
  type        = string
  default     = "m6i.xlarge"
}

variable "eks_user_node_min" {
  description = "Minimum application nodes for autoscaling"
  type        = number
  default     = 2
}

variable "eks_user_node_max" {
  description = "Maximum application nodes for autoscaling"
  type        = number
  default     = 10
}

# ============================================
# RDS / Aurora PostgreSQL (Replaces Azure PostgreSQL)
# ============================================

variable "postgresql_admin_username" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "unifiedhealth_admin"
  sensitive   = true
}

variable "rds_instance_class" {
  description = "RDS instance class (use db.serverless for Aurora Serverless v2)"
  type        = string
  default     = "db.serverless"
}

variable "rds_backup_retention_days" {
  description = "Backup retention period in days"
  type        = number
  default     = 35
}

# ============================================
# ElastiCache Redis (Replaces Azure Redis)
# ============================================

variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.r6g.large"
}

variable "redis_num_cache_clusters" {
  description = "Number of cache clusters (nodes)"
  type        = number
  default     = 2
}

# ============================================
# CloudWatch / Monitoring
# ============================================

variable "cloudwatch_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "alert_email_address" {
  description = "Email address for alert notifications"
  type        = string
  default     = "ops@unifiedhealth.example.com"
}

variable "alert_webhook_url" {
  description = "Webhook URL for alert notifications (PagerDuty, Slack, etc.)"
  type        = string
  default     = ""
}

# ============================================
# Global Resources
# ============================================

variable "primary_location" {
  description = "Primary AWS region for global resources"
  type        = string
  default     = "us-east-1"
}

variable "global_alert_email_address" {
  description = "Email address for global alert notifications"
  type        = string
  default     = "global-ops@unifiedhealth.example.com"
}

variable "global_alert_webhook_url" {
  description = "Webhook URL for global alert notifications"
  type        = string
  default     = ""
}

# ============================================
# CloudFront Configuration (Replaces Azure Front Door)
# ============================================

variable "cloudfront_price_class" {
  description = "CloudFront price class (PriceClass_All, PriceClass_200, PriceClass_100)"
  type        = string
  default     = "PriceClass_All"
}

variable "cloudfront_aliases" {
  description = "CloudFront custom domain aliases"
  type        = list(string)
  default     = []
}

variable "cloudfront_certificate_arn" {
  description = "ACM certificate ARN for CloudFront (must be in us-east-1)"
  type        = string
  default     = ""
}

variable "api_origin_domain" {
  description = "Domain name for API origin (ALB DNS name)"
  type        = string
  default     = "api.unifiedhealth.example.com"
}

# ============================================
# DNS Configuration (Replaces Azure DNS)
# ============================================

variable "manage_dns" {
  description = "Whether to manage DNS in Route 53"
  type        = bool
  default     = false
}

variable "dns_zone_name" {
  description = "Route 53 hosted zone name"
  type        = string
  default     = "unifiedhealth.example.com"
}

# ============================================
# Multi-Region Deployment
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
# Cost Management
# ============================================

variable "enable_cost_allocation_tags" {
  description = "Enable cost allocation tags"
  type        = bool
  default     = true
}

variable "monthly_budget_usd" {
  description = "Monthly budget in USD for AWS Cost Explorer alerts"
  type        = number
  default     = 50000
}

# ============================================
# CI/CD Pipeline Configuration
# ============================================

variable "github_repository" {
  description = "GitHub repository in format 'owner/repo'"
  type        = string
  default     = "oks-citadel/Global-Healthcare-SaaS-Platform"
}

variable "github_branch" {
  description = "GitHub branch to trigger pipeline"
  type        = string
  default     = "main"
}

variable "enable_cicd_pipeline" {
  description = "Enable CI/CD pipeline resources"
  type        = bool
  default     = true
}
