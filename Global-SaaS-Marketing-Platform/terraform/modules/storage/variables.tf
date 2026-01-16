################################################################################
# Variables - Storage Module
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

variable "kms_key_arn" {
  description = "KMS key ARN for encryption"
  type        = string
}

################################################################################
# S3 Configuration
################################################################################

variable "cors_allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN for S3 bucket policy"
  type        = string
  default     = null
}

variable "log_retention_days" {
  description = "Number of days to retain logs"
  type        = number
  default     = 365
}

################################################################################
# EFS Configuration
################################################################################

variable "enable_efs" {
  description = "Enable EFS file system"
  type        = bool
  default     = true
}

variable "efs_subnet_ids" {
  description = "Subnet IDs for EFS mount targets"
  type        = list(string)
  default     = []
}

variable "efs_security_group_id" {
  description = "Security group ID for EFS"
  type        = string
  default     = ""
}

variable "efs_performance_mode" {
  description = "EFS performance mode"
  type        = string
  default     = "generalPurpose"
  validation {
    condition     = contains(["generalPurpose", "maxIO"], var.efs_performance_mode)
    error_message = "EFS performance mode must be generalPurpose or maxIO."
  }
}

variable "efs_throughput_mode" {
  description = "EFS throughput mode"
  type        = string
  default     = "bursting"
  validation {
    condition     = contains(["bursting", "provisioned", "elastic"], var.efs_throughput_mode)
    error_message = "EFS throughput mode must be bursting, provisioned, or elastic."
  }
}

variable "efs_provisioned_throughput" {
  description = "Provisioned throughput in MiB/s (when throughput_mode is provisioned)"
  type        = number
  default     = 100
}

variable "efs_access_points" {
  description = "Map of EFS access point configurations"
  type = map(object({
    posix_user = object({
      gid = number
      uid = number
    })
    root_directory = object({
      path = string
      creation_info = object({
        owner_gid   = number
        owner_uid   = number
        permissions = string
      })
    })
  }))
  default = {}
}

################################################################################
# Tags
################################################################################

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
