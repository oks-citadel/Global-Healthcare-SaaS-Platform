################################################################################
# Variables - Edge CloudFront Module
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

################################################################################
# Domain Configuration
################################################################################

variable "domain_names" {
  description = "List of domain names for CloudFront aliases"
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ARN of ACM certificate for HTTPS (must be in us-east-1)"
  type        = string
  default     = null
}

variable "route53_zone_id" {
  description = "Route 53 hosted zone ID for DNS records"
  type        = string
  default     = null
}

################################################################################
# Origin Configuration
################################################################################

variable "s3_bucket_regional_domain_name" {
  description = "Regional domain name of S3 bucket for static assets"
  type        = string
}

variable "s3_origin_path" {
  description = "Path prefix for S3 origin"
  type        = string
  default     = ""
}

variable "alb_dns_name" {
  description = "DNS name of Application Load Balancer for dynamic content"
  type        = string
  default     = null
}

variable "cloudfront_secret_header" {
  description = "Secret header value to validate requests from CloudFront to ALB"
  type        = string
  sensitive   = true
  default     = ""
}

################################################################################
# Cache Configuration
################################################################################

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
  validation {
    condition     = contains(["PriceClass_100", "PriceClass_200", "PriceClass_All"], var.price_class)
    error_message = "Price class must be one of: PriceClass_100, PriceClass_200, PriceClass_All."
  }
}

variable "enable_origin_shield" {
  description = "Enable CloudFront Origin Shield"
  type        = bool
  default     = true
}

variable "origin_shield_region" {
  description = "Region for Origin Shield"
  type        = string
  default     = "us-east-1"
}

################################################################################
# Security Configuration
################################################################################

variable "waf_web_acl_arn" {
  description = "ARN of WAF Web ACL to associate"
  type        = string
  default     = null
}

variable "content_security_policy" {
  description = "Content Security Policy header value"
  type        = string
  default     = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
}

variable "cors_allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

################################################################################
# Geo Restriction
################################################################################

variable "geo_restriction_type" {
  description = "Type of geo restriction (whitelist or blacklist)"
  type        = string
  default     = "none"
  validation {
    condition     = contains(["none", "whitelist", "blacklist"], var.geo_restriction_type)
    error_message = "Geo restriction type must be one of: none, whitelist, blacklist."
  }
}

variable "geo_restriction_locations" {
  description = "List of country codes for geo restriction"
  type        = list(string)
  default     = []
}

################################################################################
# Logging
################################################################################

variable "log_bucket_domain_name" {
  description = "Domain name of S3 bucket for access logs"
  type        = string
}

################################################################################
# Tags
################################################################################

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
