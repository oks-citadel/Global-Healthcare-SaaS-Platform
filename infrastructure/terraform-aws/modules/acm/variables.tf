# ============================================
# AWS ACM Module - Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
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

variable "domain_name" {
  description = "Primary domain name for the certificate (e.g., example.com)"
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9.-]*[a-z0-9]$", var.domain_name))
    error_message = "Domain name must be a valid domain format."
  }
}

variable "subject_alternative_names" {
  description = "List of additional domain names (SANs) for the certificate"
  type        = list(string)
  default     = []

  validation {
    condition = alltrue([
      for san in var.subject_alternative_names :
      can(regex("^[a-z0-9*][a-z0-9.-]*[a-z0-9]$", san))
    ])
    error_message = "All SANs must be valid domain formats."
  }
}

variable "validation_method" {
  description = "Certificate validation method (DNS or EMAIL)"
  type        = string
  default     = "DNS"

  validation {
    condition     = contains(["DNS", "EMAIL"], var.validation_method)
    error_message = "Validation method must be either DNS or EMAIL."
  }
}

variable "key_algorithm" {
  description = "Key algorithm for the certificate"
  type        = string
  default     = "RSA_2048"

  validation {
    condition     = contains(["RSA_2048", "RSA_3072", "RSA_4096", "EC_prime256v1", "EC_secp384r1", "EC_secp521r1"], var.key_algorithm)
    error_message = "Key algorithm must be one of: RSA_2048, RSA_3072, RSA_4096, EC_prime256v1, EC_secp384r1, EC_secp521r1."
  }
}

variable "enable_certificate_transparency" {
  description = "Enable certificate transparency logging"
  type        = bool
  default     = true
}

variable "create_route53_records" {
  description = "Create Route53 records for DNS validation"
  type        = bool
  default     = true
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID for DNS validation records"
  type        = string
  default     = ""
}

variable "wait_for_validation" {
  description = "Wait for certificate validation to complete"
  type        = bool
  default     = true
}

variable "validation_timeout" {
  description = "Timeout for certificate validation"
  type        = string
  default     = "45m"
}

variable "create_wildcard_certificate" {
  description = "Create a wildcard certificate (*.domain.com)"
  type        = bool
  default     = false
}

variable "wildcard_additional_sans" {
  description = "Additional SANs for the wildcard certificate"
  type        = list(string)
  default     = []
}

variable "enable_expiry_alarm" {
  description = "Enable CloudWatch alarm for certificate expiry"
  type        = bool
  default     = true
}

variable "expiry_alarm_days" {
  description = "Number of days before expiry to trigger the alarm"
  type        = number
  default     = 30

  validation {
    condition     = var.expiry_alarm_days >= 7 && var.expiry_alarm_days <= 90
    error_message = "Expiry alarm days must be between 7 and 90."
  }
}

variable "alarm_actions" {
  description = "List of ARNs to notify when certificate expiry alarms trigger"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
