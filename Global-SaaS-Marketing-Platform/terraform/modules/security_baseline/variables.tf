################################################################################
# Variables - Security Baseline Module
# Global SaaS Marketing Platform
################################################################################

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

################################################################################
# KMS Variables
################################################################################

variable "kms_deletion_window" {
  description = "Number of days before KMS key deletion"
  type        = number
  default     = 30
  validation {
    condition     = var.kms_deletion_window >= 7 && var.kms_deletion_window <= 30
    error_message = "KMS deletion window must be between 7 and 30 days."
  }
}

variable "enable_multi_region_kms" {
  description = "Enable multi-region KMS keys"
  type        = bool
  default     = false
}

################################################################################
# IAM Variables
################################################################################

variable "allowed_regions" {
  description = "List of allowed AWS regions for permission boundary"
  type        = list(string)
  default     = ["us-east-1", "us-west-2", "eu-west-1"]
}

################################################################################
# CloudTrail Variables
################################################################################

variable "enable_cloudtrail" {
  description = "Enable CloudTrail"
  type        = bool
  default     = true
}

variable "cloudtrail_retention_days" {
  description = "Number of days to retain CloudTrail logs in S3"
  type        = number
  default     = 365
}

variable "cloudtrail_log_retention_days" {
  description = "Number of days to retain CloudTrail logs in CloudWatch"
  type        = number
  default     = 90
}

################################################################################
# AWS Config Variables
################################################################################

variable "enable_config" {
  description = "Enable AWS Config"
  type        = bool
  default     = true
}

################################################################################
# GuardDuty Variables
################################################################################

variable "enable_guardduty" {
  description = "Enable GuardDuty"
  type        = bool
  default     = true
}

################################################################################
# WAF Variables
################################################################################

variable "enable_waf" {
  description = "Enable WAF"
  type        = bool
  default     = true
}

variable "waf_rate_limit" {
  description = "Rate limit for WAF (requests per 5 minutes per IP)"
  type        = number
  default     = 2000
}

variable "waf_blocked_countries" {
  description = "List of country codes to block"
  type        = list(string)
  default     = []
}

variable "waf_log_retention_days" {
  description = "Number of days to retain WAF logs"
  type        = number
  default     = 30
}

################################################################################
# Shield Variables
################################################################################

variable "enable_shield_advanced" {
  description = "Enable AWS Shield Advanced (requires subscription)"
  type        = bool
  default     = false
}

variable "cloudfront_distribution_arn" {
  description = "ARN of CloudFront distribution for Shield protection"
  type        = string
  default     = null
}

variable "alb_arn" {
  description = "ARN of ALB for Shield protection"
  type        = string
  default     = null
}

################################################################################
# Tags
################################################################################

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
