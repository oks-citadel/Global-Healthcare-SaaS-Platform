# ============================================
# AWS SNS/SQS Module - Variables
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

variable "topic_configs" {
  description = "Map of SNS topic configurations"
  type = map(object({
    display_name                = optional(string)
    purpose                     = optional(string, "general")
    fifo_topic                  = optional(bool, false)
    content_based_deduplication = optional(bool, false)
    delivery_policy = optional(object({
      http = object({
        defaultHealthyRetryPolicy = object({
          minDelayTarget     = number
          maxDelayTarget     = number
          numRetries         = number
          numMaxDelayRetries = number
          backoffFunction    = string
        })
      })
    }))
    allowed_publishers = optional(list(string))
    email_subscriptions = optional(list(string))
    https_subscriptions = optional(list(object({
      url          = string
      auto_confirm = optional(bool, false)
    })))
    lambda_subscriptions = optional(list(object({
      function_name = string
      function_arn  = string
      filter_policy = optional(map(list(string)))
    })))
  }))
  default = {}
}

variable "queue_configs" {
  description = "Map of SQS queue configurations"
  type = map(object({
    purpose                     = optional(string, "general")
    visibility_timeout_seconds  = optional(number, 30)
    message_retention_seconds   = optional(number, 1209600) # 14 days
    max_message_size            = optional(number, 262144)  # 256 KB
    delay_seconds               = optional(number, 0)
    receive_wait_time_seconds   = optional(number, 20) # Long polling
    fifo_queue                  = optional(bool, false)
    content_based_deduplication = optional(bool, false)
    deduplication_scope         = optional(string, "queue")
    fifo_throughput_limit       = optional(string, "perQueue")
    enable_dlq                  = optional(bool, true)
    max_receive_count           = optional(number, 3)
    dlq_message_retention_seconds = optional(number, 1209600) # 14 days
    subscribe_to_topics         = optional(list(string))
    allowed_senders             = optional(list(string))
    raw_message_delivery        = optional(bool, true)
    filter_policy               = optional(map(list(string)))
    enable_age_alarm            = optional(bool, false)
    age_alarm_threshold         = optional(number, 3600) # 1 hour in seconds
  }))
  default = {}

  validation {
    condition = alltrue([
      for key, config in var.queue_configs :
      config.visibility_timeout_seconds >= 0 && config.visibility_timeout_seconds <= 43200
    ])
    error_message = "Visibility timeout must be between 0 and 43200 seconds (12 hours)."
  }

  validation {
    condition = alltrue([
      for key, config in var.queue_configs :
      config.message_retention_seconds >= 60 && config.message_retention_seconds <= 1209600
    ])
    error_message = "Message retention must be between 60 seconds and 1209600 seconds (14 days)."
  }
}

variable "create_kms_key" {
  description = "Create a new KMS key for SNS/SQS encryption"
  type        = bool
  default     = true
}

variable "kms_key_id" {
  description = "Existing KMS key ID for SNS/SQS encryption (if not creating new)"
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

variable "enable_dlq_alarms" {
  description = "Enable CloudWatch alarms for dead-letter queues"
  type        = bool
  default     = true
}

variable "dlq_alarm_threshold" {
  description = "Threshold for DLQ message count alarm"
  type        = number
  default     = 1
}

variable "alarm_actions" {
  description = "List of ARNs to notify when alarms trigger"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
