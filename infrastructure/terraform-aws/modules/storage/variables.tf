# ============================================
# Storage Module Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "cost_center" {
  description = "Cost center for billing"
  type        = string
  default     = "healthcare-platform"
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}

variable "enable_versioning" {
  description = "Enable S3 versioning"
  type        = bool
  default     = true
}

variable "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN for bucket policy"
  type        = string
  default     = ""
}

variable "kms_key_arn" {
  description = "KMS key ARN for encryption"
  type        = string
  default     = ""
}
