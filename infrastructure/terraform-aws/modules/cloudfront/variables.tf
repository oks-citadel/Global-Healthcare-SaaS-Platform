# ============================================
# CloudFront Module Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "alb_dns_name" {
  description = "ALB DNS name for API origin"
  type        = string
}

variable "s3_bucket_domain_name" {
  description = "S3 bucket domain name for static assets (optional)"
  type        = string
  default     = ""
}

variable "domain_aliases" {
  description = "Domain aliases for CloudFront"
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN (must be in us-east-1)"
  type        = string
  default     = ""
}

variable "default_root_object" {
  description = "Default root object"
  type        = string
  default     = ""
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_All"
}

variable "geo_restriction_type" {
  description = "Geo restriction type (none, whitelist, blacklist)"
  type        = string
  default     = "none"
}

variable "geo_restriction_locations" {
  description = "Country codes for geo restriction"
  type        = list(string)
  default     = []
}

variable "logging_bucket" {
  description = "S3 bucket for CloudFront logs"
  type        = string
}

variable "rate_limit" {
  description = "Rate limit per 5 minutes"
  type        = number
  default     = 2000
}

variable "enable_bot_control" {
  description = "Enable AWS WAF Bot Control"
  type        = bool
  default     = false
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
