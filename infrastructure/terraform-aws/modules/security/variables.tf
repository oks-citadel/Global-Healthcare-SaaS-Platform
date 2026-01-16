# ============================================
# AWS Security Services Module - Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "enable_hipaa_standard" {
  description = "Enable HIPAA Security Standard in Security Hub"
  type        = bool
  default     = true
}

variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {}
}

variable "alert_email" {
  description = "Email address for security alerts"
  type        = string
  default     = ""
}
