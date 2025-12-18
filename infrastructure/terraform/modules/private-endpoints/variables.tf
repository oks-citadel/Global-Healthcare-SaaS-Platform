# ============================================
# Private Endpoints Module Variables
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

variable "virtual_network_id" {
  description = "ID of the virtual network"
  type        = string
}

variable "private_endpoint_subnet_prefix" {
  description = "Address prefix for private endpoints subnet"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

# ============================================
# Resource IDs
# ============================================

variable "key_vault_id" {
  description = "ID of the Key Vault"
  type        = string
  default     = ""
}

variable "storage_account_id" {
  description = "ID of the Storage Account"
  type        = string
  default     = ""
}

variable "redis_cache_id" {
  description = "ID of the Redis Cache"
  type        = string
  default     = ""
}

variable "container_registry_id" {
  description = "ID of the Container Registry"
  type        = string
  default     = ""
}

# ============================================
# Feature Flags
# ============================================

variable "create_keyvault_private_endpoint" {
  description = "Whether to create a private endpoint for Key Vault"
  type        = bool
  default     = true
}

variable "create_storage_private_endpoint" {
  description = "Whether to create a private endpoint for Storage Account"
  type        = bool
  default     = true
}

variable "create_redis_private_endpoint" {
  description = "Whether to create a private endpoint for Redis Cache"
  type        = bool
  default     = true
}

variable "create_acr_private_endpoint" {
  description = "Whether to create a private endpoint for Container Registry"
  type        = bool
  default     = true
}
