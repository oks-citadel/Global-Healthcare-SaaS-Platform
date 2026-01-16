# ============================================
# Regional Module - Variables
# ============================================
# Reusable module for deploying UnifiedHealth
# infrastructure in any Azure region

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "unified-health"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "region_name" {
  description = "Logical region name (americas, europe, africa, asia)"
  type        = string
}

variable "location" {
  description = "Azure region location"
  type        = string
}

variable "location_short" {
  description = "Short location code for resource naming"
  type        = string
}

# ============================================
# Compliance & Data Residency
# ============================================

variable "compliance_standards" {
  description = "Compliance standards applicable to this region"
  type        = list(string)
  default     = []
}

variable "data_residency_required" {
  description = "Whether data must remain in region"
  type        = bool
  default     = true
}

variable "supported_currencies" {
  description = "Currencies supported in this region"
  type        = list(string)
  default     = ["USD"]
}

# ============================================
# Network
# ============================================

variable "vnet_address_space" {
  description = "Virtual network address space"
  type        = string
}

variable "aks_subnet_prefix" {
  description = "AKS subnet address prefix"
  type        = string
}

variable "database_subnet_prefix" {
  description = "Database subnet address prefix"
  type        = string
}

variable "appgw_subnet_prefix" {
  description = "Application Gateway subnet address prefix"
  type        = string
}

# ============================================
# AKS Configuration
# ============================================

variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.28.3"
}

variable "aks_system_node_count" {
  description = "Number of system nodes"
  type        = number
  default     = 3
}

variable "aks_system_node_size" {
  description = "System node VM size"
  type        = string
  default     = "Standard_DS2_v2"
}

variable "aks_system_node_min" {
  description = "Minimum system nodes for autoscaling"
  type        = number
  default     = 3
}

variable "aks_system_node_max" {
  description = "Maximum system nodes for autoscaling"
  type        = number
  default     = 6
}

variable "aks_user_node_count" {
  description = "Number of user nodes"
  type        = number
  default     = 3
}

variable "aks_user_node_size" {
  description = "User node VM size"
  type        = string
  default     = "Standard_DS3_v2"
}

variable "aks_user_node_min" {
  description = "Minimum user nodes for autoscaling"
  type        = number
  default     = 3
}

variable "aks_user_node_max" {
  description = "Maximum user nodes for autoscaling"
  type        = number
  default     = 15
}

# ============================================
# PostgreSQL Configuration
# ============================================

variable "postgresql_admin_username" {
  description = "PostgreSQL administrator username"
  type        = string
  sensitive   = true
}

variable "postgresql_admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

variable "postgresql_sku" {
  description = "PostgreSQL SKU"
  type        = string
  default     = "GP_Standard_D4s_v3"
}

variable "postgresql_storage_mb" {
  description = "PostgreSQL storage in MB"
  type        = number
  default     = 131072
}

variable "postgresql_high_availability" {
  description = "Enable PostgreSQL high availability"
  type        = bool
  default     = true
}

# ============================================
# Redis Configuration
# ============================================

variable "redis_capacity" {
  description = "Redis cache capacity"
  type        = number
  default     = 2
}

variable "redis_family" {
  description = "Redis cache family"
  type        = string
  default     = "P"
}

variable "redis_sku" {
  description = "Redis cache SKU"
  type        = string
  default     = "Premium"
}

# ============================================
# Global Resources
# ============================================

variable "global_acr_id" {
  description = "ID of the global Azure Container Registry"
  type        = string
}

variable "global_log_analytics_workspace_id" {
  description = "ID of the global Log Analytics workspace"
  type        = string
}

variable "global_keyvault_id" {
  description = "ID of the global Key Vault (optional)"
  type        = string
  default     = ""
}

# ============================================
# Cross-Region Networking
# ============================================

variable "enable_vnet_peering" {
  description = "Enable VNet peering to other regions"
  type        = bool
  default     = false
}

variable "peer_vnets" {
  description = "List of VNets to peer with"
  type = list(object({
    name                = string
    id                  = string
    resource_group_name = string
  }))
  default = []
}

# ============================================
# Monitoring
# ============================================

variable "alert_email_address" {
  description = "Email address for alert notifications"
  type        = string
}

variable "alert_webhook_url" {
  description = "Webhook URL for alert notifications"
  type        = string
  default     = ""
}

# ============================================
# Common Tags
# ============================================

variable "additional_tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}
