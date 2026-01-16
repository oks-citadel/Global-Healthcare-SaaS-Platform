# ============================================
# Secrets Manager Module Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "region_name" {
  description = "Region name (americas, europe, africa)"
  type        = string
}

variable "kms_deletion_window" {
  description = "KMS key deletion window in days"
  type        = number
  default     = 7
}

variable "eks_node_role_arn" {
  description = "EKS node IAM role ARN for KMS access"
  type        = string
}

variable "application_secrets" {
  description = "Map of application secrets to create"
  type = map(object({
    description     = string
    purpose         = string
    initial_value   = string
    enable_rotation = bool
    rotation_days   = number
  }))
  default = {}
}

variable "rotation_lambda_arn" {
  description = "Lambda ARN for secrets rotation"
  type        = string
  default     = ""
}

variable "cross_account_access_arns" {
  description = "AWS account ARNs for cross-account secrets access"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}
