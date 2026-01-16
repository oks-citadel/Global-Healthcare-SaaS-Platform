# =============================================================================
# ECS Cluster Module - Variables
# =============================================================================

variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for ECS tasks"
  type        = string
}

variable "alb_security_group_ids" {
  description = "Security group IDs of the ALB to allow inbound traffic"
  type        = list(string)
}

variable "rds_security_group_id" {
  description = "Security group ID of RDS to allow outbound connections"
  type        = string
  default     = ""
}

variable "redis_security_group_id" {
  description = "Security group ID of ElastiCache Redis to allow outbound connections"
  type        = string
  default     = ""
}

variable "kms_key_arn" {
  description = "KMS key ARN for encrypting secrets (optional)"
  type        = string
  default     = ""
}

variable "enable_container_insights" {
  description = "Enable CloudWatch Container Insights"
  type        = bool
  default     = true
}

variable "enable_service_discovery" {
  description = "Enable AWS Cloud Map service discovery"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "fargate_base_count" {
  description = "Base count for Fargate capacity provider"
  type        = number
  default     = 1
}

variable "fargate_weight" {
  description = "Weight for Fargate capacity provider (on-demand)"
  type        = number
  default     = 20
}

variable "fargate_spot_weight" {
  description = "Weight for Fargate Spot capacity provider"
  type        = number
  default     = 80
}

variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}
