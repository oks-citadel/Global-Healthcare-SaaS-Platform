# ============================================
# AWS SES Module - Variables
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
    condition     = contains(["prod", "staging", "dev", "production", "development"], var.environment)
    error_message = "Environment must be one of: prod, staging, dev, production, development."
  }
}

variable "domain_name" {
  description = "Domain name for SES identity (e.g., theunifiedhealth.com)"
  type        = string
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID for DNS records"
  type        = string
  default     = null
}

variable "wait_for_verification" {
  description = "Wait for domain verification to complete"
  type        = bool
  default     = false
}

variable "enable_dmarc" {
  description = "Enable DMARC record creation"
  type        = bool
  default     = true
}

variable "dmarc_policy" {
  description = "DMARC policy (none, quarantine, reject)"
  type        = string
  default     = "quarantine"

  validation {
    condition     = contains(["none", "quarantine", "reject"], var.dmarc_policy)
    error_message = "DMARC policy must be one of: none, quarantine, reject."
  }
}

variable "dmarc_rua_email" {
  description = "Email address for DMARC aggregate reports"
  type        = string
  default     = "dmarc-reports@theunifiedhealth.com"
}

variable "dmarc_ruf_email" {
  description = "Email address for DMARC forensic reports"
  type        = string
  default     = "dmarc-forensic@theunifiedhealth.com"
}

variable "custom_tracking_domain" {
  description = "Custom domain for click/open tracking"
  type        = string
  default     = null
}

variable "create_notification_topics" {
  description = "Create SNS topics and SQS queues for bounce/complaint handling"
  type        = bool
  default     = true
}

variable "kms_key_id" {
  description = "KMS key ID for encrypting SNS/SQS"
  type        = string
  default     = null
}

variable "allowed_from_addresses" {
  description = "List of allowed from email addresses"
  type        = list(string)
  default     = [
    "*@theunifiedhealth.com"
  ]
}

variable "enable_alarms" {
  description = "Enable CloudWatch alarms for SES metrics"
  type        = bool
  default     = true
}

variable "alarm_actions" {
  description = "List of ARNs for alarm actions"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
