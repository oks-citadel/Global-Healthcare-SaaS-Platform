# ============================================
# S3 Module Variables
# ============================================
# HIPAA-compliant S3 storage configuration
# ============================================

# ============================================
# Core Configuration
# ============================================

variable "project_name" {
  description = "Name of the project (used in bucket naming)"
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "Project name must contain only lowercase letters, numbers, and hyphens."
  }
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

  validation {
    condition     = contains(["americas", "europe", "africa"], var.region_name)
    error_message = "Region name must be americas, europe, or africa."
  }
}

# ============================================
# Versioning Configuration
# ============================================

variable "enable_versioning" {
  description = "Enable versioning for S3 buckets (required for HIPAA compliance)"
  type        = bool
  default     = true
}

# ============================================
# Replication Configuration
# ============================================

variable "enable_replication" {
  description = "Enable cross-region replication for disaster recovery"
  type        = bool
  default     = false
}

variable "replication_destination_bucket_arn" {
  description = "ARN of the destination bucket for cross-region replication"
  type        = string
  default     = ""

  validation {
    condition     = var.replication_destination_bucket_arn == "" || can(regex("^arn:aws:s3:::", var.replication_destination_bucket_arn))
    error_message = "Replication destination bucket ARN must be a valid S3 bucket ARN."
  }
}

variable "replication_destination_kms_key_arn" {
  description = "ARN of the KMS key in the destination region for replication encryption"
  type        = string
  default     = ""
}

# ============================================
# Lifecycle Rules Configuration
# ============================================

variable "lifecycle_rules" {
  description = "Additional lifecycle rules for the documents bucket"
  type = list(object({
    id      = string
    enabled = bool
    prefix  = string
    transitions = list(object({
      days          = number
      storage_class = string
    }))
    expiration_days = optional(number)
  }))
  default = []

  validation {
    condition = alltrue([
      for rule in var.lifecycle_rules : contains(
        ["STANDARD_IA", "ONEZONE_IA", "INTELLIGENT_TIERING", "GLACIER", "GLACIER_IR", "DEEP_ARCHIVE"],
        [for t in rule.transitions : t.storage_class][0]
      ) if length(rule.transitions) > 0
    ])
    error_message = "Transition storage class must be one of: STANDARD_IA, ONEZONE_IA, INTELLIGENT_TIERING, GLACIER, GLACIER_IR, DEEP_ARCHIVE."
  }
}

# ============================================
# CORS Configuration
# ============================================

variable "cors_allowed_origins" {
  description = "List of allowed origins for CORS (e.g., web application domains)"
  type        = list(string)
  default     = ["https://*.unifiedhealth.com"]

  validation {
    condition     = length(var.cors_allowed_origins) > 0
    error_message = "At least one CORS allowed origin must be specified."
  }
}

# ============================================
# Object Lock Configuration (Compliance)
# ============================================

variable "enable_object_lock" {
  description = "Enable S3 Object Lock for WORM compliance (cannot be disabled once enabled)"
  type        = bool
  default     = false
}

variable "object_lock_retention_days" {
  description = "Default retention period in days for Object Lock (medical records: 2555 = 7 years)"
  type        = number
  default     = 2555

  validation {
    condition     = var.object_lock_retention_days >= 1 && var.object_lock_retention_days <= 36500
    error_message = "Object lock retention days must be between 1 and 36500 (100 years)."
  }
}

# ============================================
# Virus Scanning Configuration
# ============================================

variable "enable_virus_scanning" {
  description = "Enable virus scanning integration for uploaded files"
  type        = bool
  default     = false
}

variable "virus_scan_lambda_arn" {
  description = "ARN of the Lambda function for virus scanning"
  type        = string
  default     = ""
}

# ============================================
# Bucket Behavior
# ============================================

variable "force_destroy" {
  description = "Allow bucket destruction even with objects (USE WITH CAUTION - not for production)"
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

  validation {
    condition     = !contains(keys(var.tags), "Module")
    error_message = "The 'Module' tag is reserved and will be set automatically."
  }
}

# ============================================
# Compliance Tags (Auto-populated)
# ============================================

variable "compliance_tags" {
  description = "Compliance-related tags (HIPAA, SOC2, etc.)"
  type        = map(string)
  default = {
    Compliance       = "HIPAA"
    DataClassification = "PHI"
    Encryption       = "AES-256-KMS"
    AccessControl    = "Private"
  }
}

# ============================================
# Access Logging Configuration
# ============================================

variable "access_log_retention_days" {
  description = "Number of days to retain access logs before transitioning to Glacier"
  type        = number
  default     = 90

  validation {
    condition     = var.access_log_retention_days >= 30
    error_message = "Access log retention must be at least 30 days for compliance."
  }
}

variable "access_log_expiration_days" {
  description = "Number of days after which access logs are deleted"
  type        = number
  default     = 365

  validation {
    condition     = var.access_log_expiration_days >= 90
    error_message = "Access log expiration must be at least 90 days for compliance."
  }
}

# ============================================
# Intelligent Tiering Configuration
# ============================================

variable "enable_intelligent_tiering" {
  description = "Enable S3 Intelligent Tiering for automatic cost optimization"
  type        = bool
  default     = true
}

variable "intelligent_tiering_archive_days" {
  description = "Days before moving to Archive Access tier in Intelligent Tiering"
  type        = number
  default     = 90
}

variable "intelligent_tiering_deep_archive_days" {
  description = "Days before moving to Deep Archive Access tier in Intelligent Tiering"
  type        = number
  default     = 180
}

# ============================================
# Backup Configuration
# ============================================

variable "backup_retention_days" {
  description = "Number of days to retain daily backups"
  type        = number
  default     = 35

  validation {
    condition     = var.backup_retention_days >= 7
    error_message = "Backup retention must be at least 7 days."
  }
}

variable "backup_archive_days" {
  description = "Number of days before moving backups to Glacier"
  type        = number
  default     = 30
}

# ============================================
# Notification Configuration
# ============================================

variable "enable_event_notifications" {
  description = "Enable S3 event notifications for object operations"
  type        = bool
  default     = false
}

variable "notification_sns_topic_arn" {
  description = "ARN of SNS topic for S3 event notifications"
  type        = string
  default     = ""
}

variable "notification_sqs_queue_arn" {
  description = "ARN of SQS queue for S3 event notifications"
  type        = string
  default     = ""
}
