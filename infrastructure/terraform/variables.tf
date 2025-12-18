# ============================================
# UnifiedHealth Platform - Terraform Variables
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
  description = "Environment (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "dev2", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "eastus"
}

# ============================================
# Network
# ============================================

variable "vnet_address_space" {
  description = "Virtual network address space"
  type        = string
  default     = "10.1.0.0/16"
}

variable "aks_subnet_prefix" {
  description = "AKS subnet address prefix"
  type        = string
  default     = "10.1.0.0/20"
}

variable "database_subnet_prefix" {
  description = "Database subnet address prefix"
  type        = string
  default     = "10.1.16.0/24"
}

variable "appgw_subnet_prefix" {
  description = "Application Gateway subnet address prefix"
  type        = string
  default     = "10.1.32.0/24"
}

# ============================================
# AKS
# ============================================

variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.28.3"
}

variable "aks_system_node_count" {
  description = "Number of system nodes"
  type        = number
  default     = 2
}

variable "aks_system_node_size" {
  description = "System node VM size"
  type        = string
  default     = "Standard_DS2_v2"
}

variable "aks_system_node_min" {
  description = "Minimum system nodes for autoscaling"
  type        = number
  default     = 2
}

variable "aks_system_node_max" {
  description = "Maximum system nodes for autoscaling"
  type        = number
  default     = 4
}

variable "aks_user_node_count" {
  description = "Number of user nodes"
  type        = number
  default     = 2
}

variable "aks_user_node_size" {
  description = "User node VM size"
  type        = string
  default     = "Standard_DS3_v2"
}

variable "aks_user_node_min" {
  description = "Minimum user nodes for autoscaling"
  type        = number
  default     = 2
}

variable "aks_user_node_max" {
  description = "Maximum user nodes for autoscaling"
  type        = number
  default     = 10
}

# ============================================
# ACR
# ============================================

variable "acr_georeplications" {
  description = "ACR geo-replications for production"
  type = list(object({
    location        = string
    zone_redundancy = bool
  }))
  default = []
}

# ============================================
# PostgreSQL
# ============================================

variable "postgresql_admin_username" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "unifiedhealth_admin"
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
  default     = "GP_Standard_D2s_v3"
}

variable "postgresql_storage_mb" {
  description = "PostgreSQL storage in MB"
  type        = number
  default     = 32768
}

# ============================================
# Redis
# ============================================

variable "redis_capacity" {
  description = "Redis cache capacity"
  type        = number
  default     = 1
}

variable "redis_family" {
  description = "Redis cache family"
  type        = string
  default     = "C"
}

variable "redis_sku" {
  description = "Redis cache SKU"
  type        = string
  default     = "Standard"
}

# ============================================
# Monitoring & Alerts
# ============================================

variable "alert_email_address" {
  description = "Email address for alert notifications"
  type        = string
  default     = "ops@unifiedhealth.example.com"
}

variable "alert_webhook_url" {
  description = "Webhook URL for alert notifications (PagerDuty, Slack, etc.)"
  type        = string
  default     = ""
}
