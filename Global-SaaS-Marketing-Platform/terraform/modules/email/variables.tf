################################################################################
# Variables - Email Module
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
# Domain Configuration
################################################################################

variable "domain_name" {
  description = "Domain name for SES"
  type        = string
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID for DNS records"
  type        = string
  default     = null
}

variable "tracking_domain" {
  description = "Custom domain for tracking opens and clicks"
  type        = string
  default     = null
}

################################################################################
# DMARC Configuration
################################################################################

variable "enable_dmarc" {
  description = "Enable DMARC record"
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

variable "dmarc_subdomain_policy" {
  description = "DMARC subdomain policy"
  type        = string
  default     = "quarantine"
}

variable "dmarc_rua_email" {
  description = "Email address for DMARC aggregate reports"
  type        = string
  default     = ""
}

variable "dmarc_ruf_email" {
  description = "Email address for DMARC forensic reports"
  type        = string
  default     = ""
}

################################################################################
# Firehose Configuration
################################################################################

variable "enable_firehose_destination" {
  description = "Enable Firehose delivery for SES events"
  type        = bool
  default     = true
}

variable "data_lake_bucket_arn" {
  description = "ARN of the data lake S3 bucket for event storage"
  type        = string
  default     = ""
}

################################################################################
# Email Templates
################################################################################

variable "email_templates" {
  description = "Map of SES email template configurations"
  type = map(object({
    subject = string
    html    = string
    text    = string
  }))
  default = {}
}

################################################################################
# Suppression List
################################################################################

variable "suppression_list_reasons" {
  description = "List of suppression reasons to enable"
  type        = list(string)
  default     = ["BOUNCE", "COMPLAINT"]
}

################################################################################
# Sender Configuration
################################################################################

variable "allowed_from_addresses" {
  description = "List of allowed from email addresses"
  type        = list(string)
  default     = []
}

################################################################################
# Tags
################################################################################

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
