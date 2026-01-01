# ============================================
# UnifiedHealth Platform - Multi-Region Variables
# ============================================

variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "unified-health"
}

variable "environment" {
  description = "Environment (prod recommended for multi-region)"
  type        = string
  default     = "prod"
  validation {
    condition     = contains(["prod", "staging"], var.environment)
    error_message = "Multi-region deployment only supported for prod or staging."
  }
}

variable "primary_location" {
  description = "Primary Azure region for global resources"
  type        = string
  default     = "eastus"
}

# ============================================
# Region Deployment Flags
# ============================================

variable "deploy_americas" {
  description = "Deploy Americas region (East US)"
  type        = bool
  default     = true
}

variable "deploy_europe" {
  description = "Deploy Europe region (West Europe)"
  type        = bool
  default     = true
}

variable "deploy_africa" {
  description = "Deploy Africa region (South Africa North)"
  type        = bool
  default     = true
}

# ============================================
# Cross-Region Configuration
# ============================================

variable "enable_cross_region_peering" {
  description = "Enable VNet peering between regions"
  type        = bool
  default     = false
}

# ============================================
# Kubernetes Configuration
# ============================================

variable "kubernetes_version" {
  description = "Kubernetes version for all clusters"
  type        = string
  default     = "1.28.3"
}

# ============================================
# Database Configuration
# ============================================

variable "postgresql_admin_username" {
  description = "PostgreSQL administrator username for all regions"
  type        = string
  default     = "unifiedhealth_admin"
  sensitive   = true
}

variable "postgresql_admin_password" {
  description = "PostgreSQL administrator password for all regions"
  type        = string
  sensitive   = true
}

# ============================================
# DNS Configuration
# ============================================

variable "manage_dns" {
  description = "Whether to manage DNS zone in Azure"
  type        = bool
  default     = false
}

variable "dns_zone_name" {
  description = "DNS zone name (e.g., unifiedhealth.com)"
  type        = string
  default     = "unifiedhealth.example.com"
}

# ============================================
# Monitoring & Alerts
# ============================================

variable "global_alert_email_address" {
  description = "Global email address for alert notifications"
  type        = string
  default     = "ops-global@unifiedhealth.example.com"
}

variable "americas_alert_email_address" {
  description = "Email address for Americas region alerts"
  type        = string
  default     = "ops-americas@unifiedhealth.example.com"
}

variable "europe_alert_email_address" {
  description = "Email address for Europe region alerts"
  type        = string
  default     = "ops-europe@unifiedhealth.example.com"
}

variable "africa_alert_email_address" {
  description = "Email address for Africa region alerts"
  type        = string
  default     = "ops-africa@unifiedhealth.example.com"
}

variable "global_alert_webhook_url" {
  description = "Global webhook URL for alert notifications"
  type        = string
  default     = ""
}

variable "alert_webhook_url" {
  description = "Webhook URL for regional alert notifications"
  type        = string
  default     = ""
}

# ============================================
# Cost Management
# ============================================

variable "enable_cost_alerts" {
  description = "Enable cost alerts for multi-region deployment"
  type        = bool
  default     = true
}

variable "monthly_budget_usd" {
  description = "Monthly budget in USD for multi-region deployment"
  type        = number
  default     = 50000
}

# ============================================
# Network Security
# ============================================

variable "acr_allowed_cidrs" {
  description = "CIDR ranges allowed to access ACR (CI/CD runners, VPN IPs)"
  type        = list(string)
  default     = []
  # Example: ["20.37.194.0/24", "20.42.5.0/24"]
  # GitHub Actions IPs can be found at: https://api.github.com/meta
}

variable "keyvault_allowed_cidrs" {
  description = "CIDR ranges allowed to access Key Vault"
  type        = list(string)
  default     = []
}
