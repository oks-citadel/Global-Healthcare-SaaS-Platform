# =============================================================================
# The Unified Health - ECS Fargate Module Variables
# =============================================================================

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod"
  }
}

variable "vpc_id" {
  description = "VPC ID for ECS tasks"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "alb_security_group_ids" {
  description = "List of ALB security group IDs"
  type        = list(string)
}

variable "ecr_repository_url" {
  description = "Base ECR repository URL"
  type        = string
}

variable "asset_branding_version" {
  description = "Version of asset-branding package to use (immutable, no :latest)"
  type        = string

  validation {
    condition     = can(regex("^v?[0-9]+\\.[0-9]+\\.[0-9]+", var.asset_branding_version))
    error_message = "Asset branding version must be a semantic version (e.g., 1.0.0 or v1.0.0)"
  }
}

variable "service_versions" {
  description = "Map of service names to their image versions"
  type        = map(string)

  validation {
    condition     = alltrue([for v in values(var.service_versions) : can(regex("^v?[0-9]+\\.[0-9]+\\.[0-9]+|sha256:[a-f0-9]+$", v))])
    error_message = "All service versions must be semantic versions or SHA256 digests. No :latest allowed."
  }
}

variable "target_group_arns" {
  description = "Map of service names to their ALB target group ARNs"
  type        = map(string)
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "kms_key_arn" {
  description = "KMS key ARN for encrypting CloudWatch logs (HIPAA compliance)"
  type        = string
  default     = null
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}
