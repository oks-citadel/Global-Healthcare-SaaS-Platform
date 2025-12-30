# ============================================
# RDS Aurora Module Variables
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

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "db_subnet_group_name" {
  description = "Database subnet group name"
  type        = string
}

variable "allowed_security_group_id" {
  description = "Security group ID allowed to access RDS"
  type        = string
}

variable "engine_version" {
  description = "Aurora PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "database_name" {
  description = "Initial database name"
  type        = string
  default     = "unified_health"
}

variable "master_username" {
  description = "Master username"
  type        = string
  default     = "unifiedhealth_admin"
  sensitive   = true
}

variable "instance_class" {
  description = "Instance class for Aurora instances"
  type        = string
  default     = "db.serverless"
}

variable "instance_count" {
  description = "Number of Aurora instances"
  type        = number
  default     = 2
}

variable "serverless_min_capacity" {
  description = "Minimum ACUs for serverless"
  type        = number
  default     = 0.5
}

variable "serverless_max_capacity" {
  description = "Maximum ACUs for serverless"
  type        = number
  default     = 16
}

variable "backup_retention_days" {
  description = "Backup retention period in days"
  type        = number
  default     = 35
}

variable "backup_window" {
  description = "Preferred backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "maintenance_window" {
  description = "Preferred maintenance window"
  type        = string
  default     = "Mon:04:00-Mon:05:00"
}

variable "deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
  default     = true
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot on deletion"
  type        = bool
  default     = false
}

variable "kms_key_arn" {
  description = "KMS key ARN for encryption (leave empty to create new)"
  type        = string
  default     = ""
}

variable "performance_insights_enabled" {
  description = "Enable Performance Insights"
  type        = bool
  default     = true
}

variable "performance_insights_retention" {
  description = "Performance Insights retention period"
  type        = number
  default     = 7
}

variable "enhanced_monitoring_interval" {
  description = "Enhanced monitoring interval (0 to disable)"
  type        = number
  default     = 60
}

variable "alarm_sns_topic_arns" {
  description = "SNS topic ARNs for CloudWatch alarms"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}
