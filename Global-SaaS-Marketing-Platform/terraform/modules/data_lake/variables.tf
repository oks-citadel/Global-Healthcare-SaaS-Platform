################################################################################
# Variables - Data Lake Module
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
# Kinesis Configuration
################################################################################

variable "kinesis_streams" {
  description = "Map of Kinesis stream configurations"
  type = map(object({
    retention_period = optional(number, 24)
    stream_mode      = optional(string, "ON_DEMAND")
    shard_count      = optional(number, 1)
  }))
  default = {}
}

################################################################################
# Firehose Configuration
################################################################################

variable "firehose_streams" {
  description = "Map of Kinesis Firehose delivery stream configurations"
  type = map(object({
    source_stream                  = string
    s3_prefix                      = string
    error_prefix                   = string
    buffer_size                    = optional(number, 64)
    buffer_interval                = optional(number, 300)
    compression_format             = optional(string, "GZIP")
    enable_data_format_conversion  = optional(bool, false)
    glue_table_name                = optional(string)
    enable_processing              = optional(bool, false)
    lambda_processor_arn           = optional(string)
  }))
  default = {}
}

################################################################################
# Glue Configuration
################################################################################

variable "glue_tables" {
  description = "Map of Glue catalog table configurations"
  type = map(object({
    description            = string
    classification         = string
    compression_type       = optional(string, "gzip")
    s3_prefix              = string
    input_format           = string
    output_format          = string
    serialization_library  = string
    ser_de_parameters      = optional(map(string), {})
    enable_partition_projection = optional(bool, false)
    columns = list(object({
      name    = string
      type    = string
      comment = optional(string)
    }))
    partition_keys = optional(list(object({
      name = string
      type = string
    })), [])
  }))
  default = {}
}

variable "glue_crawlers" {
  description = "Map of Glue crawler configurations"
  type = map(object({
    s3_path  = string
    schedule = optional(string)
  }))
  default = {}
}

################################################################################
# Athena Configuration
################################################################################

variable "athena_bytes_scanned_cutoff" {
  description = "Bytes scanned cutoff per query for Athena workgroup"
  type        = number
  default     = 10737418240 # 10 GB
}

variable "athena_named_queries" {
  description = "Map of Athena named query configurations"
  type = map(object({
    description = string
    query       = string
  }))
  default = {}
}

################################################################################
# Lake Formation Configuration
################################################################################

variable "enable_lake_formation" {
  description = "Enable Lake Formation integration"
  type        = bool
  default     = false
}

variable "lake_formation_admin_arn" {
  description = "ARN of the Lake Formation administrator"
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
