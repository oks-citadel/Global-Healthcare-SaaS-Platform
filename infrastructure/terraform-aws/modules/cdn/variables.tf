# ============================================
# CDN Module Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "cost_center" {
  description = "Cost center for billing"
  type        = string
  default     = "healthcare-platform"
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}

# ============================================
# S3 Origin Configuration
# ============================================

variable "s3_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  type        = string
}

# ============================================
# API Origin Configuration
# ============================================

variable "api_domain_name" {
  description = "Domain name of the API (ALB or API Gateway)"
  type        = string
  default     = ""
}

# ============================================
# Cache Configuration
# ============================================

variable "default_ttl" {
  description = "Default TTL for cached objects (seconds)"
  type        = number
  default     = 86400 # 1 day
}

variable "min_ttl" {
  description = "Minimum TTL for cached objects (seconds)"
  type        = number
  default     = 3600 # 1 hour
}

variable "max_ttl" {
  description = "Maximum TTL for cached objects (seconds)"
  type        = number
  default     = 31536000 # 1 year
}

# ============================================
# Price Class Configuration
# ============================================

variable "price_class" {
  description = "CloudFront price class (PriceClass_100=US/EU, PriceClass_200=US/EU/Asia, PriceClass_All=All)"
  type        = string
  default     = "PriceClass_100" # Cost optimized - US, Canada, Europe only

  validation {
    condition     = contains(["PriceClass_100", "PriceClass_200", "PriceClass_All"], var.price_class)
    error_message = "Price class must be one of: PriceClass_100, PriceClass_200, PriceClass_All."
  }
}

# ============================================
# Origin Shield Configuration
# ============================================

variable "enable_origin_shield" {
  description = "Enable Origin Shield for additional caching layer"
  type        = bool
  default     = true
}

variable "origin_shield_region" {
  description = "Region for Origin Shield"
  type        = string
  default     = "us-east-1"
}

# ============================================
# Domain and SSL Configuration
# ============================================

variable "domain_aliases" {
  description = "List of domain aliases for the distribution"
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ARN of ACM certificate for HTTPS"
  type        = string
  default     = ""
}

# ============================================
# Security Configuration
# ============================================

variable "web_acl_id" {
  description = "WAF Web ACL ID"
  type        = string
  default     = null
}

variable "cors_allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "geo_restriction_type" {
  description = "Geo restriction type (whitelist, blacklist, none)"
  type        = string
  default     = "none"
}

variable "geo_restriction_locations" {
  description = "List of country codes for geo restriction"
  type        = list(string)
  default     = []
}

# ============================================
# Logging Configuration
# ============================================

variable "log_bucket" {
  description = "S3 bucket for CloudFront logs"
  type        = string
}

variable "enable_realtime_logs" {
  description = "Enable CloudFront real-time logs"
  type        = bool
  default     = false
}

variable "realtime_log_sampling_rate" {
  description = "Sampling rate for real-time logs (1-100)"
  type        = number
  default     = 5 # Sample 5% for cost optimization
}
