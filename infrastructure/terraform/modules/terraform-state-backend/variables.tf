# ============================================
# Terraform State Backend - Variables
# ============================================

variable "project_name" {
  description = "Project name used as prefix for resources"
  type        = string
  default     = "unified-health"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "use_kms_encryption" {
  description = "Use KMS encryption for S3 bucket (recommended for production)"
  type        = bool
  default     = false
}

variable "version_retention_days" {
  description = "Number of days to retain old state versions"
  type        = number
  default     = 90
}

variable "allowed_principals" {
  description = "List of AWS principals allowed to access the state bucket"
  type        = list(string)
  default     = []
}
