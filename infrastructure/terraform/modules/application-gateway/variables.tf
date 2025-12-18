# ============================================
# Application Gateway Module Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "virtual_network_name" {
  description = "Name of the virtual network"
  type        = string
}

variable "appgw_subnet_prefix" {
  description = "Address prefix for Application Gateway subnet"
  type        = string
}

variable "key_vault_id" {
  description = "ID of the Key Vault for SSL certificates"
  type        = string
}

variable "log_analytics_workspace_id" {
  description = "ID of the Log Analytics workspace"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

# ============================================
# SKU Configuration
# ============================================

variable "sku_name" {
  description = "SKU name for Application Gateway"
  type        = string
  default     = "WAF_v2"
  validation {
    condition     = contains(["Standard_v2", "WAF_v2"], var.sku_name)
    error_message = "SKU name must be either Standard_v2 or WAF_v2"
  }
}

variable "sku_tier" {
  description = "SKU tier for Application Gateway"
  type        = string
  default     = "WAF_v2"
  validation {
    condition     = contains(["Standard_v2", "WAF_v2"], var.sku_tier)
    error_message = "SKU tier must be either Standard_v2 or WAF_v2"
  }
}

variable "capacity" {
  description = "Initial capacity"
  type        = number
  default     = null
}

variable "min_capacity" {
  description = "Minimum autoscale capacity"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "Maximum autoscale capacity"
  type        = number
  default     = 10
}

variable "availability_zones" {
  description = "Availability zones for Application Gateway"
  type        = list(string)
  default     = ["1", "2", "3"]
}

# ============================================
# WAF Configuration
# ============================================

variable "waf_mode" {
  description = "WAF mode (Detection or Prevention)"
  type        = string
  default     = "Prevention"
  validation {
    condition     = contains(["Detection", "Prevention"], var.waf_mode)
    error_message = "WAF mode must be either Detection or Prevention"
  }
}

variable "rate_limit_threshold" {
  description = "Rate limit threshold (requests per minute)"
  type        = number
  default     = 100
}

variable "blocked_ip_ranges" {
  description = "List of IP ranges to block"
  type        = list(string)
  default     = []
}

# ============================================
# Backend Configuration
# ============================================

variable "backend_fqdns" {
  description = "List of backend FQDNs (AKS ingress controller)"
  type        = list(string)
  default     = []
}

variable "health_probe_path" {
  description = "Path for health probe"
  type        = string
  default     = "/health"
}

# ============================================
# SSL Configuration
# ============================================

variable "ssl_certificate_name" {
  description = "Name of the SSL certificate"
  type        = string
}

variable "ssl_certificate_key_vault_secret_id" {
  description = "Key Vault secret ID for SSL certificate"
  type        = string
}
