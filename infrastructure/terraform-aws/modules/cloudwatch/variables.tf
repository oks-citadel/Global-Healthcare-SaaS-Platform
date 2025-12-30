# ============================================
# AWS CloudWatch Module - Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "unified-health"
}

variable "environment" {
  description = "Environment name (e.g., production, staging, development)"
  type        = string

  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be one of: production, staging, development."
  }
}

variable "log_group_prefix" {
  description = "Prefix for CloudWatch log group names"
  type        = string
  default     = "healthcare"
}

variable "service_names" {
  description = "List of service names to create log groups for"
  type        = list(string)
  default     = []
}

variable "log_retention_days" {
  description = "Number of days to retain application logs"
  type        = number
  default     = 90

  validation {
    condition     = contains([1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1096, 1827, 2192, 2557, 2922, 3288, 3653], var.log_retention_days)
    error_message = "Log retention must be a valid CloudWatch Logs retention value."
  }
}

variable "security_log_retention_days" {
  description = "Number of days to retain security/audit logs (HIPAA requires 6 years)"
  type        = number
  default     = 2557 # ~7 years

  validation {
    condition     = var.security_log_retention_days >= 2192 # 6 years minimum for HIPAA
    error_message = "Security log retention must be at least 2192 days (6 years) for HIPAA compliance."
  }
}

variable "phi_log_retention_days" {
  description = "Number of days to retain PHI access logs"
  type        = number
  default     = 2557 # ~7 years

  validation {
    condition     = var.phi_log_retention_days >= 2192
    error_message = "PHI log retention must be at least 2192 days (6 years) for HIPAA compliance."
  }
}

variable "create_kms_key" {
  description = "Create a new KMS key for CloudWatch Logs encryption"
  type        = bool
  default     = true
}

variable "kms_key_arn" {
  description = "Existing KMS key ARN for CloudWatch Logs encryption"
  type        = string
  default     = null
}

variable "kms_key_deletion_window" {
  description = "Number of days before KMS key deletion"
  type        = number
  default     = 30

  validation {
    condition     = var.kms_key_deletion_window >= 7 && var.kms_key_deletion_window <= 30
    error_message = "KMS key deletion window must be between 7 and 30 days."
  }
}

variable "metrics_namespace" {
  description = "CloudWatch metrics namespace"
  type        = string
  default     = "UnifiedHealth"
}

variable "alarm_configs" {
  description = "Configuration for CloudWatch alarms"
  type = object({
    error_rate_enabled            = optional(bool, true)
    error_rate_threshold          = optional(number, 10)
    error_rate_period             = optional(number, 300)
    error_rate_evaluation_periods = optional(number, 2)
    auth_failures_enabled         = optional(bool, true)
    auth_failures_threshold       = optional(number, 10)
    suspicious_activity_enabled   = optional(bool, true)
    suspicious_activity_threshold = optional(number, 5)
    phi_access_enabled            = optional(bool, true)
    phi_access_threshold          = optional(number, 100)
  })
  default = {}
}

variable "custom_alarms" {
  description = "Map of custom CloudWatch alarm configurations"
  type = map(object({
    metric_name         = string
    namespace           = string
    comparison_operator = string
    threshold           = number
    period              = number
    evaluation_periods  = number
    statistic           = string
    description         = string
    treat_missing_data  = optional(string, "notBreaching")
    dimensions          = optional(map(string), {})
  }))
  default = {}

  validation {
    condition = alltrue([
      for key, alarm in var.custom_alarms :
      contains(["GreaterThanThreshold", "GreaterThanOrEqualToThreshold", "LessThanThreshold", "LessThanOrEqualToThreshold"], alarm.comparison_operator)
    ])
    error_message = "Comparison operator must be one of: GreaterThanThreshold, GreaterThanOrEqualToThreshold, LessThanThreshold, LessThanOrEqualToThreshold."
  }
}

variable "alarm_actions" {
  description = "List of ARNs to notify when alarms trigger"
  type        = list(string)
  default     = []
}

variable "create_dashboard" {
  description = "Create a CloudWatch dashboard"
  type        = bool
  default     = true
}

variable "security_log_destination_arn" {
  description = "ARN of the destination for security log subscription filter (Lambda, Kinesis, etc.)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
