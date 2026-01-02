# ============================================
# AWS Route53 Module - Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "unified-health"
}

variable "environment" {
  description = "Environment name (e.g., prod, staging, dev)"
  type        = string

  validation {
    condition     = contains(["prod", "staging", "dev", "production", "staging", "development"], var.environment)
    error_message = "Environment must be one of: prod, staging, dev, production, development."
  }
}

variable "domain_name" {
  description = "The domain name for the hosted zone (e.g., example.com)"
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]*[a-z0-9]\\.[a-z]{2,}$", var.domain_name))
    error_message = "Domain name must be a valid domain format."
  }
}

variable "records" {
  description = "List of DNS records to create"
  type = list(object({
    name                = string
    type                = string
    ttl                 = optional(number, 300)
    values              = optional(list(string), [])
    weight              = optional(number)
    set_identifier      = optional(string)
    health_check_name   = optional(string)
    failover_enabled    = optional(bool, false)
    failover_type       = optional(string) # PRIMARY or SECONDARY
    latency_region      = optional(string)
    geolocation = optional(object({
      continent   = optional(string)
      country     = optional(string)
      subdivision = optional(string)
    }))
    alias_target = optional(object({
      dns_name               = string
      zone_id                = string
      evaluate_target_health = optional(bool, true)
    }))
  }))
  default = []

  validation {
    condition = alltrue([
      for record in var.records :
      contains(["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "SRV", "CAA", "ALIAS"], record.type)
    ])
    error_message = "Record type must be one of: A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, CAA, ALIAS."
  }
}

variable "health_check_configs" {
  description = "Map of health check configurations"
  type = map(object({
    fqdn                            = string
    port                            = number
    type                            = string # HTTP, HTTPS, TCP
    resource_path                   = optional(string, "/health")
    failure_threshold               = optional(number, 3)
    request_interval                = optional(number, 30)
    regions                         = optional(list(string), ["us-east-1", "us-west-2", "eu-west-1"])
    service_type                    = optional(string, "api")
    cloudwatch_alarm_name           = optional(string)
    cloudwatch_alarm_region         = optional(string)
    insufficient_data_health_status = optional(string, "LastKnownStatus")
  }))
  default = {}

  validation {
    condition = alltrue([
      for name, config in var.health_check_configs :
      contains(["HTTP", "HTTPS", "TCP", "HTTP_STR_MATCH", "HTTPS_STR_MATCH"], config.type)
    ])
    error_message = "Health check type must be one of: HTTP, HTTPS, TCP, HTTP_STR_MATCH, HTTPS_STR_MATCH."
  }
}

variable "enable_caa_records" {
  description = "Enable CAA records for certificate authority authorization"
  type        = bool
  default     = true
}

variable "caa_email" {
  description = "Email address for CAA iodef record (certificate issue notifications)"
  type        = string
  default     = "security@example.com"
}

variable "enable_query_logging" {
  description = "Enable Route53 query logging for HIPAA audit compliance"
  type        = bool
  default     = true
}

variable "query_log_retention_days" {
  description = "Number of days to retain Route53 query logs"
  type        = number
  default     = 365 # HIPAA requires minimum 6 years, but logs can be archived

  validation {
    condition     = var.query_log_retention_days >= 90
    error_message = "Query log retention must be at least 90 days for compliance."
  }
}

variable "kms_key_arn" {
  description = "KMS key ARN for encrypting CloudWatch log groups"
  type        = string
  default     = null
}

variable "enable_dnssec" {
  description = "Enable DNSSEC signing for the hosted zone"
  type        = bool
  default     = false
}

variable "dnssec_kms_key_arn" {
  description = "KMS key ARN for DNSSEC signing (must be in us-east-1)"
  type        = string
  default     = null
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
