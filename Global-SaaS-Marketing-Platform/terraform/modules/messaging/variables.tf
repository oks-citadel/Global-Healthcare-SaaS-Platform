################################################################################
# Variables - Messaging Module
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

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

################################################################################
# EventBridge Configuration
################################################################################

variable "event_archive_retention_days" {
  description = "Number of days to retain events in archive"
  type        = number
  default     = 30
}

variable "event_rules" {
  description = "Map of EventBridge rules"
  type = map(object({
    description      = string
    event_pattern    = string
    enabled          = bool
    target_type      = string
    target_name      = string
    message_group_id = optional(string)
  }))
  default = {}
}

################################################################################
# SQS Configuration
################################################################################

variable "sqs_queues" {
  description = "Map of SQS queue configurations"
  type = map(object({
    fifo                        = optional(bool, false)
    content_based_deduplication = optional(bool, false)
    deduplication_scope         = optional(string, "queue")
    fifo_throughput_limit       = optional(string, "perQueue")
    visibility_timeout_seconds  = optional(number, 30)
    message_retention_seconds   = optional(number, 345600)
    max_message_size            = optional(number, 262144)
    delay_seconds               = optional(number, 0)
    receive_wait_time_seconds   = optional(number, 0)
    max_receive_count           = optional(number, 3)
    kms_key_id                  = optional(string)
  }))
  default = {}
}

################################################################################
# SNS Configuration
################################################################################

variable "sns_topics" {
  description = "Map of SNS topic configurations"
  type = map(object({
    fifo                        = optional(bool, false)
    content_based_deduplication = optional(bool, false)
    kms_key_id                  = optional(string)
    sqs_subscriptions           = optional(list(string), [])
  }))
  default = {}
}

################################################################################
# Step Functions Configuration
################################################################################

variable "step_functions" {
  description = "Map of Step Functions state machine configurations"
  type = map(object({
    definition          = string
    type                = optional(string, "STANDARD")
    additional_policies = optional(list(any), [])
  }))
  default = {}
}

################################################################################
# Scheduler Configuration
################################################################################

variable "schedules" {
  description = "Map of EventBridge Scheduler configurations"
  type = map(object({
    description                  = string
    schedule_expression          = string
    timezone                     = optional(string, "UTC")
    enabled                      = optional(bool, true)
    flexible_time_window_mode    = optional(string, "OFF")
    flexible_time_window_minutes = optional(number)
    target_type                  = string
    target_arn                   = string
    message_group_id             = optional(string)
  }))
  default = {}
}

variable "scheduler_dlq_arn" {
  description = "ARN of the DLQ for scheduler failures"
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
