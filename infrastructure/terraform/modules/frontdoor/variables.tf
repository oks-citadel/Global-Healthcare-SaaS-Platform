# ============================================
# Azure Front Door Module Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "sku_name" {
  description = "SKU name for Front Door (Standard_AzureFrontDoor or Premium_AzureFrontDoor)"
  type        = string
  default     = "Premium_AzureFrontDoor"
  validation {
    condition     = contains(["Standard_AzureFrontDoor", "Premium_AzureFrontDoor"], var.sku_name)
    error_message = "SKU name must be either Standard_AzureFrontDoor or Premium_AzureFrontDoor"
  }
}

variable "response_timeout_seconds" {
  description = "Response timeout in seconds"
  type        = number
  default     = 120
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

# ============================================
# WAF Configuration
# ============================================

variable "waf_mode" {
  description = "WAF mode (Prevention or Detection)"
  type        = string
  default     = "Prevention"
  validation {
    condition     = contains(["Prevention", "Detection"], var.waf_mode)
    error_message = "WAF mode must be either Prevention or Detection"
  }
}

variable "waf_redirect_url" {
  description = "URL to redirect blocked requests"
  type        = string
  default     = null
}

variable "content_security_policy" {
  description = "Content Security Policy header value"
  type        = string
  default     = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com; frame-ancestors 'self';"
}

# ============================================
# Health Probe
# ============================================

variable "health_probe_path" {
  description = "Path for health probe"
  type        = string
  default     = "/health"
}

# ============================================
# Origins
# ============================================

variable "origins" {
  description = "Map of origin configurations"
  type = map(object({
    host_name              = string
    origin_host_header     = string
    priority               = number
    weight                 = number
    location               = string
    private_link_target_id = string
  }))
  default = {}
}

# ============================================
# Custom Domains
# ============================================

variable "custom_domains" {
  description = "Map of custom domain configurations"
  type = map(object({
    host_name        = string
    certificate_type = string # ManagedCertificate or CustomerCertificate
  }))
  default = {}
}

# ============================================
# Routes
# ============================================

variable "routes" {
  description = "Map of route configurations"
  type = map(object({
    patterns_to_match             = list(string)
    origin_keys                   = list(string)
    custom_domain_keys            = list(string)
    query_string_caching_behavior = string # IgnoreQueryString, UseQueryString, NotSet
  }))
  default = {}
}
