################################################################################
# Variables - Databases Module
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

variable "sns_topic_arn" {
  description = "SNS topic ARN for notifications"
  type        = string
  default     = null
}

################################################################################
# Aurora PostgreSQL Variables
################################################################################

variable "aurora_postgresql_version" {
  description = "Aurora PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "aurora_database_name" {
  description = "Name of the default database"
  type        = string
  default     = "marketing"
}

variable "aurora_master_username" {
  description = "Master username for Aurora"
  type        = string
  default     = "admin"
}

variable "db_subnet_group_name" {
  description = "DB subnet group name"
  type        = string
}

variable "rds_security_group_id" {
  description = "Security group ID for RDS"
  type        = string
}

variable "aurora_instance_count" {
  description = "Number of Aurora instances"
  type        = number
  default     = 2
}

variable "aurora_min_capacity" {
  description = "Minimum Aurora Serverless v2 capacity"
  type        = number
  default     = 0.5
}

variable "aurora_max_capacity" {
  description = "Maximum Aurora Serverless v2 capacity"
  type        = number
  default     = 16
}

variable "aurora_backup_retention_days" {
  description = "Backup retention period in days"
  type        = number
  default     = 7
}

variable "aurora_backup_window" {
  description = "Preferred backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "aurora_maintenance_window" {
  description = "Preferred maintenance window"
  type        = string
  default     = "Mon:04:00-Mon:05:00"
}

################################################################################
# DynamoDB Variables
################################################################################

variable "dynamodb_tables" {
  description = "Map of DynamoDB table configurations"
  type = map(object({
    billing_mode     = string
    hash_key         = string
    range_key        = optional(string)
    read_capacity    = optional(number)
    write_capacity   = optional(number)
    ttl_attribute    = optional(string)
    stream_enabled   = optional(bool, false)
    stream_view_type = optional(string, "NEW_AND_OLD_IMAGES")
    enable_point_in_time_recovery = optional(bool, true)
    enable_autoscaling = optional(bool, false)
    autoscaling_min_read_capacity  = optional(number, 5)
    autoscaling_max_read_capacity  = optional(number, 100)
    autoscaling_min_write_capacity = optional(number, 5)
    autoscaling_max_write_capacity = optional(number, 100)
    autoscaling_target_value       = optional(number, 70)
    attributes = list(object({
      name = string
      type = string
    }))
    global_secondary_indexes = optional(list(object({
      name               = string
      hash_key           = string
      range_key          = optional(string)
      projection_type    = string
      non_key_attributes = optional(list(string))
      read_capacity      = optional(number)
      write_capacity     = optional(number)
    })), [])
    local_secondary_indexes = optional(list(object({
      name               = string
      range_key          = string
      projection_type    = string
      non_key_attributes = optional(list(string))
    })), [])
  }))
  default = {}
}

################################################################################
# ElastiCache Redis Variables
################################################################################

variable "elasticache_subnet_group_name" {
  description = "ElastiCache subnet group name"
  type        = string
}

variable "elasticache_security_group_id" {
  description = "Security group ID for ElastiCache"
  type        = string
}

variable "redis_version" {
  description = "Redis engine version"
  type        = string
  default     = "7.0"
}

variable "redis_node_type" {
  description = "Redis node type"
  type        = string
  default     = "cache.t4g.medium"
}

variable "redis_num_cache_clusters" {
  description = "Number of Redis cache clusters"
  type        = number
  default     = 2
}

variable "redis_auth_token" {
  description = "Redis auth token (password)"
  type        = string
  sensitive   = true
}

variable "redis_snapshot_retention_limit" {
  description = "Number of days to retain snapshots"
  type        = number
  default     = 7
}

variable "redis_snapshot_window" {
  description = "Daily time range for snapshots"
  type        = string
  default     = "03:00-05:00"
}

variable "redis_maintenance_window" {
  description = "Weekly time range for maintenance"
  type        = string
  default     = "mon:05:00-mon:06:00"
}

################################################################################
# OpenSearch Variables
################################################################################

variable "enable_opensearch" {
  description = "Enable OpenSearch domain"
  type        = bool
  default     = true
}

variable "create_opensearch_service_linked_role" {
  description = "Create OpenSearch service-linked role"
  type        = bool
  default     = false
}

variable "opensearch_subnet_ids" {
  description = "Subnet IDs for OpenSearch"
  type        = list(string)
  default     = []
}

variable "opensearch_security_group_id" {
  description = "Security group ID for OpenSearch"
  type        = string
  default     = ""
}

variable "opensearch_version" {
  description = "OpenSearch engine version"
  type        = string
  default     = "OpenSearch_2.11"
}

variable "opensearch_instance_type" {
  description = "OpenSearch instance type"
  type        = string
  default     = "r6g.large.search"
}

variable "opensearch_instance_count" {
  description = "Number of OpenSearch instances"
  type        = number
  default     = 2
}

variable "opensearch_dedicated_master_enabled" {
  description = "Enable dedicated master nodes"
  type        = bool
  default     = false
}

variable "opensearch_dedicated_master_type" {
  description = "Dedicated master node type"
  type        = string
  default     = "r6g.large.search"
}

variable "opensearch_dedicated_master_count" {
  description = "Number of dedicated master nodes"
  type        = number
  default     = 3
}

variable "opensearch_volume_size" {
  description = "EBS volume size in GB"
  type        = number
  default     = 100
}

variable "opensearch_iops" {
  description = "EBS IOPS"
  type        = number
  default     = 3000
}

variable "opensearch_throughput" {
  description = "EBS throughput in MiB/s"
  type        = number
  default     = 125
}

variable "opensearch_master_user_arn" {
  description = "ARN of the master user for OpenSearch"
  type        = string
  default     = ""
}

################################################################################
# Tags
################################################################################

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
