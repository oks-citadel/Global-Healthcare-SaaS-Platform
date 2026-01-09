# =============================================================================
# The Unified Health - Asset Branding ECR Module Variables
# =============================================================================

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod"
  }
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "kms_key_arn" {
  description = "KMS key ARN for ECR encryption. If empty, uses AWS managed key."
  type        = string
  default     = ""
}

variable "allowed_account_ids" {
  description = "List of AWS account IDs allowed to pull images"
  type        = list(string)
  default     = []
}

variable "replication_regions" {
  description = "List of AWS regions to replicate images to"
  type        = list(string)
  default     = []
}

variable "alarm_sns_topic_arn" {
  description = "SNS topic ARN for CloudWatch alarms"
  type        = string
  default     = ""
}

variable "initial_version" {
  description = "Initial version to set in SSM parameter"
  type        = string
  default     = "1.0.0"
}
