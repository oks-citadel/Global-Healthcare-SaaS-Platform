# ============================================
# AWS Backup Restoration Testing Module - Variables
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

variable "region_name" {
  description = "Region name for resource naming (americas, europe, africa)"
  type        = string
  default     = ""
}

# ============================================
# RDS/Aurora Configuration
# ============================================

variable "rds_cluster_identifier" {
  description = "Identifier of the RDS/Aurora cluster to test backups for"
  type        = string
}

variable "db_subnet_group_name" {
  description = "Database subnet group name for restored instances"
  type        = string
}

variable "vpc_subnet_ids" {
  description = "VPC subnet IDs for Lambda function (for database connectivity)"
  type        = list(string)
  default     = []
}

variable "vpc_security_group_ids" {
  description = "VPC security group IDs for Lambda and restored RDS"
  type        = list(string)
  default     = []
}

# ============================================
# Testing Configuration
# ============================================

variable "test_schedule" {
  description = "CloudWatch Events schedule expression for automated testing"
  type        = string
  default     = "cron(0 3 1 * ? *)" # 3 AM UTC on the 1st of each month
}

variable "enable_scheduled_testing" {
  description = "Enable scheduled automated backup restoration testing"
  type        = bool
  default     = true
}

variable "test_queries" {
  description = "List of SQL queries to run for data integrity verification"
  type        = list(string)
  default = [
    "SELECT COUNT(*) as total_users FROM users;",
    "SELECT COUNT(*) as total_patients FROM patients;",
    "SELECT COUNT(*) as total_appointments FROM appointments;",
    "SELECT MAX(created_at) as latest_record FROM audit_logs;",
    "SELECT COUNT(*) as tables_count FROM information_schema.tables WHERE table_schema = 'public';"
  ]
}

variable "cleanup_after_test" {
  description = "Automatically delete temporary resources after testing"
  type        = bool
  default     = true
}

variable "max_wait_minutes" {
  description = "Maximum minutes to wait for restoration to complete"
  type        = number
  default     = 60

  validation {
    condition     = var.max_wait_minutes >= 10 && var.max_wait_minutes <= 180
    error_message = "Max wait minutes must be between 10 and 180."
  }
}

# ============================================
# Lambda Configuration
# ============================================

variable "lambda_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 900 # 15 minutes

  validation {
    condition     = var.lambda_timeout <= 900
    error_message = "Lambda timeout cannot exceed 900 seconds."
  }
}

variable "lambda_memory_size" {
  description = "Lambda function memory size in MB"
  type        = number
  default     = 512

  validation {
    condition     = var.lambda_memory_size >= 128 && var.lambda_memory_size <= 10240
    error_message = "Lambda memory size must be between 128 and 10240 MB."
  }
}

# ============================================
# Notification Configuration
# ============================================

variable "notification_emails" {
  description = "Email addresses for backup restoration test notifications"
  type        = list(string)
  default     = []
}

variable "notification_sns_topic_arn" {
  description = "Existing SNS topic ARN for notifications (optional)"
  type        = string
  default     = ""
}

# ============================================
# Alarm Configuration
# ============================================

variable "restore_time_alarm_threshold" {
  description = "Threshold in minutes for restoration time alarm (RTO indicator)"
  type        = number
  default     = 60

  validation {
    condition     = var.restore_time_alarm_threshold > 0
    error_message = "Restore time alarm threshold must be positive."
  }
}

# ============================================
# Encryption Configuration
# ============================================

variable "kms_key_arn" {
  description = "KMS key ARN for encryption (leave empty to create new)"
  type        = string
  default     = ""
}

# ============================================
# Logging Configuration
# ============================================

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 90

  validation {
    condition     = contains([1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653], var.log_retention_days)
    error_message = "Log retention days must be a valid CloudWatch retention period."
  }
}

# ============================================
# Dashboard Configuration
# ============================================

variable "create_dashboard" {
  description = "Create CloudWatch dashboard for backup restoration testing"
  type        = bool
  default     = true
}

# ============================================
# Tags
# ============================================

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
