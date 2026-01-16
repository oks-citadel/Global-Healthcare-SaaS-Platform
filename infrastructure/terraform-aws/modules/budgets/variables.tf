# ============================================
# AWS Budgets Module Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

# ============================================
# Budget Configuration
# ============================================

variable "budget_amount" {
  description = "Monthly budget amount in USD"
  type        = number
  default     = 10000

  validation {
    condition     = var.budget_amount > 0
    error_message = "Budget amount must be greater than 0."
  }
}

variable "budget_name" {
  description = "Name for the budget (leave empty to auto-generate)"
  type        = string
  default     = ""
}

variable "budget_time_unit" {
  description = "Time unit for the budget (MONTHLY, QUARTERLY, ANNUALLY)"
  type        = string
  default     = "MONTHLY"

  validation {
    condition     = contains(["MONTHLY", "QUARTERLY", "ANNUALLY"], var.budget_time_unit)
    error_message = "Budget time unit must be MONTHLY, QUARTERLY, or ANNUALLY."
  }
}

variable "budget_type" {
  description = "Type of budget (COST, USAGE, RI_UTILIZATION, RI_COVERAGE, SAVINGS_PLANS_UTILIZATION, SAVINGS_PLANS_COVERAGE)"
  type        = string
  default     = "COST"

  validation {
    condition     = contains(["COST", "USAGE", "RI_UTILIZATION", "RI_COVERAGE", "SAVINGS_PLANS_UTILIZATION", "SAVINGS_PLANS_COVERAGE"], var.budget_type)
    error_message = "Invalid budget type."
  }
}

# ============================================
# Alert Configuration
# ============================================

variable "alert_thresholds" {
  description = "List of threshold percentages to trigger alerts"
  type        = list(number)
  default     = [50, 80, 100, 120]

  validation {
    condition     = length(var.alert_thresholds) > 0
    error_message = "At least one alert threshold must be specified."
  }
}

variable "alert_emails" {
  description = "List of email addresses to receive budget alerts"
  type        = list(string)
  default     = []
}

variable "alert_sns_topic_arns" {
  description = "List of SNS topic ARNs to receive budget alerts (in addition to created topic)"
  type        = list(string)
  default     = []
}

# ============================================
# Cost Filter Configuration
# ============================================

variable "cost_filter_service" {
  description = "Filter budget by specific AWS service(s)"
  type        = list(string)
  default     = []
}

variable "cost_filter_linked_account" {
  description = "Filter budget by linked account ID(s)"
  type        = list(string)
  default     = []
}

variable "cost_filter_tag_key" {
  description = "Tag key to filter costs by"
  type        = string
  default     = ""
}

variable "cost_filter_tag_values" {
  description = "Tag values to filter costs by (requires cost_filter_tag_key)"
  type        = list(string)
  default     = []
}

variable "cost_filter_region" {
  description = "Filter budget by AWS region(s)"
  type        = list(string)
  default     = []
}

# ============================================
# Auto-Action Configuration
# ============================================

variable "enable_auto_actions" {
  description = "Enable automatic actions when budget threshold is exceeded"
  type        = bool
  default     = false
}

variable "auto_action_threshold" {
  description = "Threshold percentage to trigger automatic actions"
  type        = number
  default     = 100
}

variable "auto_action_type" {
  description = "Type of automatic action (APPLY_IAM_POLICY, APPLY_SCP_POLICY, RUN_SSM_DOCUMENTS)"
  type        = string
  default     = "APPLY_IAM_POLICY"

  validation {
    condition     = contains(["APPLY_IAM_POLICY", "APPLY_SCP_POLICY", "RUN_SSM_DOCUMENTS"], var.auto_action_type)
    error_message = "Invalid auto action type."
  }
}

variable "auto_action_iam_role_arn" {
  description = "IAM role ARN for budget auto-actions"
  type        = string
  default     = ""
}

variable "auto_action_policy_arn" {
  description = "IAM policy ARN to apply when budget threshold is exceeded"
  type        = string
  default     = ""
}

# ============================================
# Tags
# ============================================

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
