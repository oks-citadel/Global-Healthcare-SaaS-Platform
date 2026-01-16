################################################################################
# Variables - Observability Module
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
# Resource Identifiers for Dashboards
################################################################################

variable "eks_cluster_name" {
  description = "Name of the EKS cluster for dashboards"
  type        = string
  default     = ""
}

variable "aurora_cluster_id" {
  description = "ID of Aurora cluster for dashboards"
  type        = string
  default     = ""
}

variable "redis_replication_group_id" {
  description = "ID of Redis replication group for dashboards"
  type        = string
  default     = ""
}

variable "alb_arn_suffix" {
  description = "ARN suffix of ALB for dashboards"
  type        = string
  default     = ""
}

################################################################################
# CloudWatch Log Groups
################################################################################

variable "log_groups" {
  description = "Map of CloudWatch log group configurations"
  type = map(object({
    retention_days = number
    log_type       = string
  }))
  default = {
    application = {
      retention_days = 30
      log_type       = "application"
    }
    audit = {
      retention_days = 365
      log_type       = "audit"
    }
    security = {
      retention_days = 365
      log_type       = "security"
    }
  }
}

################################################################################
# CloudWatch Alarms
################################################################################

variable "metric_alarms" {
  description = "Map of CloudWatch metric alarm configurations"
  type = map(object({
    description         = string
    comparison_operator = string
    evaluation_periods  = number
    metric_name         = string
    namespace           = string
    period              = number
    statistic           = string
    threshold           = number
    treat_missing_data  = optional(string, "missing")
    dimensions          = map(string)
    severity            = string
  }))
  default = {}
}

variable "alarm_actions" {
  description = "List of ARNs for alarm actions"
  type        = list(string)
  default     = []
}

variable "ok_actions" {
  description = "List of ARNs for OK actions"
  type        = list(string)
  default     = []
}

variable "insufficient_data_actions" {
  description = "List of ARNs for insufficient data actions"
  type        = list(string)
  default     = []
}

variable "critical_alarm_actions" {
  description = "List of ARNs for critical alarm actions"
  type        = list(string)
  default     = []
}

variable "enable_composite_alarms" {
  description = "Enable composite alarms"
  type        = bool
  default     = true
}

################################################################################
# Amazon Managed Prometheus (AMP)
################################################################################

variable "enable_amp" {
  description = "Enable Amazon Managed Prometheus"
  type        = bool
  default     = true
}

variable "amp_log_retention_days" {
  description = "AMP log retention in days"
  type        = number
  default     = 30
}

variable "amp_alert_manager_definition" {
  description = "Alert Manager definition for AMP"
  type        = string
  default     = null
}

variable "amp_rule_groups" {
  description = "Map of AMP rule group definitions"
  type        = map(string)
  default     = {}
}

################################################################################
# Amazon Managed Grafana (AMG)
################################################################################

variable "enable_amg" {
  description = "Enable Amazon Managed Grafana"
  type        = bool
  default     = true
}

variable "amg_authentication_providers" {
  description = "Authentication providers for Grafana"
  type        = list(string)
  default     = ["AWS_SSO"]
}

variable "alert_sns_topic_arn" {
  description = "SNS topic ARN for Grafana alerts"
  type        = string
  default     = null
}

################################################################################
# X-Ray
################################################################################

variable "enable_xray" {
  description = "Enable X-Ray tracing"
  type        = bool
  default     = true
}

variable "xray_reservoir_size" {
  description = "X-Ray sampling reservoir size"
  type        = number
  default     = 5
}

variable "xray_fixed_rate" {
  description = "X-Ray sampling fixed rate"
  type        = number
  default     = 0.05
}

################################################################################
# Log Insights Queries
################################################################################

variable "log_insights_queries" {
  description = "Map of CloudWatch Log Insights query definitions"
  type = map(object({
    log_groups = list(string)
    query      = string
  }))
  default = {}
}

################################################################################
# Anomaly Detection
################################################################################

variable "anomaly_detection_alarms" {
  description = "Map of anomaly detection alarm configurations"
  type = map(object({
    description                  = string
    metric_name                  = string
    namespace                    = string
    period                       = number
    stat                         = string
    evaluation_periods           = number
    anomaly_standard_deviations  = number
    dimensions                   = map(string)
    severity                     = string
  }))
  default = {}
}

################################################################################
# Alert Recipients
################################################################################

variable "alert_email_addresses" {
  description = "List of email addresses for alert notifications"
  type        = list(string)
  default     = []
}

################################################################################
# Tags
################################################################################

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
