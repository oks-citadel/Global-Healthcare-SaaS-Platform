# ============================================
# AWS WAFv2 Module - Variables
# ============================================

variable "name" {
  description = "Name prefix for the WAF resources"
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

variable "scope" {
  description = "WAF scope - REGIONAL for ALB/API Gateway, CLOUDFRONT for CloudFront"
  type        = string
  default     = "REGIONAL"

  validation {
    condition     = contains(["REGIONAL", "CLOUDFRONT"], var.scope)
    error_message = "Scope must be either REGIONAL or CLOUDFRONT."
  }
}

variable "allowed_countries" {
  description = "List of country codes allowed to access the application (ISO 3166-1 alpha-2)"
  type        = list(string)
  default     = []

  validation {
    condition = alltrue([
      for country in var.allowed_countries :
      can(regex("^[A-Z]{2}$", country))
    ])
    error_message = "Country codes must be valid ISO 3166-1 alpha-2 codes (e.g., US, GB, DE)."
  }
}

variable "rate_limit" {
  description = "Maximum requests per 5-minute period per IP address"
  type        = number
  default     = 2000

  validation {
    condition     = var.rate_limit >= 100 && var.rate_limit <= 20000000
    error_message = "Rate limit must be between 100 and 20,000,000."
  }
}

variable "rate_limit_uri_paths" {
  description = "List of URI paths to apply rate limiting (empty for all paths)"
  type        = list(string)
  default     = []
}

variable "enable_geo_blocking" {
  description = "Enable geographic blocking for HIPAA data residency compliance"
  type        = bool
  default     = true
}

variable "block_anonymous_ip" {
  description = "Block requests from anonymous IP addresses (Tor, VPN, etc.)"
  type        = bool
  default     = true
}

variable "ip_allowlist" {
  description = "List of IP addresses/CIDR blocks to always allow (healthcare partners)"
  type        = list(string)
  default     = []

  validation {
    condition = alltrue([
      for ip in var.ip_allowlist :
      can(cidrhost(ip, 0))
    ])
    error_message = "All IP allowlist entries must be valid CIDR blocks."
  }
}

variable "ip_blocklist" {
  description = "List of IP addresses/CIDR blocks to always block"
  type        = list(string)
  default     = []

  validation {
    condition = alltrue([
      for ip in var.ip_blocklist :
      can(cidrhost(ip, 0))
    ])
    error_message = "All IP blocklist entries must be valid CIDR blocks."
  }
}

variable "blocked_user_agents" {
  description = "List of user agent strings to block (case-insensitive)"
  type        = list(string)
  default = [
    "curl",
    "wget",
    "python-requests",
    "scrapy",
    "go-http-client",
    "java",
    "ruby",
    "perl",
    "nikto",
    "sqlmap",
    "nmap",
    "masscan"
  ]
}

variable "common_ruleset_excluded_rules" {
  description = "List of rules to exclude from the Common Rule Set (to prevent false positives)"
  type        = list(string)
  default = [
    "SizeRestrictions_BODY",
    "GenericRFI_BODY"
  ]
}

variable "custom_rules" {
  description = "List of custom WAF rules"
  type = list(object({
    name                  = string
    priority              = number
    action                = string # block, allow, count
    field_to_match        = string # uri_path, query_string, header
    positional_constraint = string # EXACTLY, STARTS_WITH, ENDS_WITH, CONTAINS
    search_string         = string
    header_name           = optional(string)
  }))
  default = []

  validation {
    condition = alltrue([
      for rule in var.custom_rules :
      contains(["block", "allow", "count"], rule.action)
    ])
    error_message = "Custom rule action must be one of: block, allow, count."
  }
}

variable "enable_logging" {
  description = "Enable WAF logging to CloudWatch/S3/Kinesis"
  type        = bool
  default     = true
}

variable "log_destination_arn" {
  description = "ARN of the log destination (CloudWatch Log Group, S3 bucket, or Kinesis Firehose)"
  type        = string
  default     = ""
}

variable "redacted_fields" {
  description = "List of fields to redact from WAF logs for HIPAA compliance"
  type = list(object({
    type = string # single_header
    name = string
  }))
  default = [
    { type = "single_header", name = "authorization" },
    { type = "single_header", name = "cookie" },
    { type = "single_header", name = "x-api-key" }
  ]
}

variable "logging_filter_enabled" {
  description = "Enable logging filter to reduce log volume (only log blocked/counted requests)"
  type        = bool
  default     = false
}

variable "enable_alarms" {
  description = "Enable CloudWatch alarms for WAF metrics"
  type        = bool
  default     = true
}

variable "blocked_requests_threshold" {
  description = "Threshold for blocked requests alarm (per 5-minute period)"
  type        = number
  default     = 1000
}

variable "rate_limit_alarm_threshold" {
  description = "Threshold for rate limit alarm (per 1-minute period)"
  type        = number
  default     = 100
}

variable "alarm_actions" {
  description = "List of ARNs to notify when WAF alarms trigger"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
