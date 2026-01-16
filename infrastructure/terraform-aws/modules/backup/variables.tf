# ============================================
# AWS Backup Module Variables
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
# Backup Vault Configuration
# ============================================

variable "vault_name" {
  description = "Name for the backup vault (leave empty to auto-generate)"
  type        = string
  default     = ""
}

variable "kms_key_arn" {
  description = "KMS key ARN for vault encryption (leave empty to create new)"
  type        = string
  default     = ""
}

variable "enable_vault_lock" {
  description = "Enable vault lock for immutable backups (compliance mode)"
  type        = bool
  default     = false
}

variable "vault_lock_min_retention_days" {
  description = "Minimum retention days when vault lock is enabled"
  type        = number
  default     = 7
}

variable "vault_lock_max_retention_days" {
  description = "Maximum retention days when vault lock is enabled"
  type        = number
  default     = 365
}

variable "vault_lock_changeable_for_days" {
  description = "Number of days before vault lock becomes immutable (0 for immediate)"
  type        = number
  default     = 3
}

# ============================================
# Backup Plan Configuration
# ============================================

variable "backup_plan_name" {
  description = "Name for the backup plan (leave empty to auto-generate)"
  type        = string
  default     = ""
}

# Daily Backup Rule
variable "daily_backup_schedule" {
  description = "Cron expression for daily backup schedule"
  type        = string
  default     = "cron(0 5 ? * * *)" # 5 AM UTC daily
}

variable "daily_backup_retention_days" {
  description = "Number of days to retain daily backups"
  type        = number
  default     = 35

  validation {
    condition     = var.daily_backup_retention_days >= 1
    error_message = "Daily backup retention must be at least 1 day."
  }
}

variable "daily_backup_cold_storage_after_days" {
  description = "Move daily backups to cold storage after N days (0 to disable)"
  type        = number
  default     = 0
}

# Weekly Backup Rule
variable "enable_weekly_backup" {
  description = "Enable weekly backup rule"
  type        = bool
  default     = true
}

variable "weekly_backup_schedule" {
  description = "Cron expression for weekly backup schedule"
  type        = string
  default     = "cron(0 5 ? * SUN *)" # 5 AM UTC every Sunday
}

variable "weekly_backup_retention_days" {
  description = "Number of days to retain weekly backups"
  type        = number
  default     = 90
}

variable "weekly_backup_cold_storage_after_days" {
  description = "Move weekly backups to cold storage after N days (0 to disable)"
  type        = number
  default     = 30
}

# Monthly Backup Rule
variable "enable_monthly_backup" {
  description = "Enable monthly backup rule"
  type        = bool
  default     = true
}

variable "monthly_backup_schedule" {
  description = "Cron expression for monthly backup schedule"
  type        = string
  default     = "cron(0 5 1 * ? *)" # 5 AM UTC on the 1st of each month
}

variable "monthly_backup_retention_days" {
  description = "Number of days to retain monthly backups"
  type        = number
  default     = 365
}

variable "monthly_backup_cold_storage_after_days" {
  description = "Move monthly backups to cold storage after N days (0 to disable)"
  type        = number
  default     = 90
}

# ============================================
# Backup Window Configuration
# ============================================

variable "backup_window_minutes" {
  description = "Backup window duration in minutes"
  type        = number
  default     = 120

  validation {
    condition     = var.backup_window_minutes >= 60
    error_message = "Backup window must be at least 60 minutes."
  }
}

# ============================================
# Resource Selection Configuration
# ============================================

variable "selection_name" {
  description = "Name for the backup selection (leave empty to auto-generate)"
  type        = string
  default     = ""
}

variable "backup_resources" {
  description = "List of resource ARNs to backup"
  type        = list(string)
  default     = []
}

variable "backup_resource_tags" {
  description = "Tags to select resources for backup"
  type = list(object({
    type  = string
    key   = string
    value = string
  }))
  default = []
}

variable "selection_tags" {
  description = "Map of tag key-value pairs to select resources for backup"
  type        = map(string)
  default     = {}
}

variable "not_resources" {
  description = "List of resource ARNs to exclude from backup"
  type        = list(string)
  default     = []
}

# ============================================
# Cross-Region Copy Configuration
# ============================================

variable "enable_cross_region_copy" {
  description = "Enable cross-region backup copy for disaster recovery"
  type        = bool
  default     = false
}

variable "copy_destination_vault_arn" {
  description = "Destination vault ARN for cross-region copy"
  type        = string
  default     = ""
}

variable "copy_retention_days" {
  description = "Retention days for cross-region copies"
  type        = number
  default     = 35
}

# ============================================
# Notifications Configuration
# ============================================

variable "enable_notifications" {
  description = "Enable SNS notifications for backup events"
  type        = bool
  default     = true
}

variable "notification_events" {
  description = "List of backup events to notify on"
  type        = list(string)
  default = [
    "BACKUP_JOB_STARTED",
    "BACKUP_JOB_COMPLETED",
    "BACKUP_JOB_FAILED",
    "RESTORE_JOB_STARTED",
    "RESTORE_JOB_COMPLETED",
    "RESTORE_JOB_FAILED",
    "COPY_JOB_STARTED",
    "COPY_JOB_SUCCESSFUL",
    "COPY_JOB_FAILED"
  ]
}

variable "notification_sns_topic_arn" {
  description = "Existing SNS topic ARN for notifications (leave empty to create new)"
  type        = string
  default     = ""
}

variable "notification_emails" {
  description = "List of email addresses for backup notifications"
  type        = list(string)
  default     = []
}

# ============================================
# Compliance Configuration
# ============================================

variable "enable_continuous_backup" {
  description = "Enable continuous backup (point-in-time recovery) for supported resources"
  type        = bool
  default     = false
}

variable "enable_windows_vss" {
  description = "Enable Windows VSS backup for EC2 instances"
  type        = bool
  default     = false
}

# ============================================
# Tags
# ============================================

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
