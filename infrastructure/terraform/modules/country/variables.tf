# ============================================
# Country Module - Variables
# ============================================
# Configuration inputs for country-level infrastructure

# ============================================
# Basic Configuration
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "unified-health"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "country_code" {
  description = "ISO 3166-1 alpha-2 country code (e.g., US, DE, KE, NG, ZA)"
  type        = string
  validation {
    condition     = length(var.country_code) == 2 && upper(var.country_code) == var.country_code
    error_message = "Country code must be a 2-letter uppercase ISO 3166-1 alpha-2 code."
  }
}

variable "country_name" {
  description = "Full country name (e.g., United States, Germany, Kenya)"
  type        = string
}

variable "region_id" {
  description = "Regional identifier (americas, europe, africa)"
  type        = string
  validation {
    condition     = contains(["americas", "europe", "africa"], var.region_id)
    error_message = "Region ID must be one of: americas, europe, africa."
  }
}

variable "location" {
  description = "Azure region location (e.g., eastus, westeurope, southafricanorth)"
  type        = string
}

variable "location_short" {
  description = "Short location code for resource naming (e.g., eus, weu, san)"
  type        = string
}

# ============================================
# Regional Infrastructure References
# ============================================

variable "regional_resource_group_name" {
  description = "Name of the regional resource group"
  type        = string
}

variable "regional_vnet_name" {
  description = "Name of the regional virtual network"
  type        = string
}

variable "regional_aks_cluster_name" {
  description = "Name of the regional AKS cluster"
  type        = string
}

variable "regional_aks_subnet_prefix" {
  description = "Address prefix of the regional AKS subnet"
  type        = string
}

variable "global_log_analytics_workspace_id" {
  description = "ID of the global Log Analytics workspace"
  type        = string
}

# ============================================
# Network Configuration
# ============================================

variable "subnet_cidr" {
  description = "CIDR block for country-specific subnet (must be within regional VNet address space)"
  type        = string
  validation {
    condition     = can(cidrhost(var.subnet_cidr, 0))
    error_message = "Subnet CIDR must be a valid IPv4 CIDR block."
  }
}

variable "database_subnet_cidr" {
  description = "CIDR block for country-specific database subnet (required if dedicated_database is true)"
  type        = string
  default     = ""
  validation {
    condition     = var.database_subnet_cidr == "" || can(cidrhost(var.database_subnet_cidr, 0))
    error_message = "Database subnet CIDR must be empty or a valid IPv4 CIDR block."
  }
}

# ============================================
# Isolation & Compliance Configuration
# ============================================

variable "isolation_enabled" {
  description = "Enable strict isolation with dedicated Key Vault and namespace (e.g., for Germany, Switzerland)"
  type        = bool
  default     = false
}

variable "data_residency_required" {
  description = "Whether data must remain within country boundaries (creates country storage account)"
  type        = bool
  default     = true
}

variable "compliance_tags" {
  description = "Compliance standards applicable to this country (e.g., GDPR, HIPAA, POPIA)"
  type        = list(string)
  default     = []
}

# ============================================
# Dedicated Resources Configuration
# ============================================

variable "dedicated_node_pool" {
  description = "Create a dedicated AKS node pool for this country"
  type        = bool
  default     = false
}

variable "node_pool_vm_size" {
  description = "VM size for country-specific node pool"
  type        = string
  default     = "Standard_D4s_v3"
}

variable "node_pool_count" {
  description = "Initial node count for country-specific node pool"
  type        = number
  default     = 3
}

variable "node_pool_autoscaling" {
  description = "Enable autoscaling for country-specific node pool"
  type        = bool
  default     = true
}

variable "node_pool_min_count" {
  description = "Minimum node count for autoscaling"
  type        = number
  default     = 3
}

variable "node_pool_max_count" {
  description = "Maximum node count for autoscaling"
  type        = number
  default     = 10
}

variable "availability_zones" {
  description = "Availability zones for country-specific resources"
  type        = list(string)
  default     = ["1", "2", "3"]
}

# ============================================
# Dedicated Database Configuration
# ============================================

variable "dedicated_database" {
  description = "Create a dedicated PostgreSQL database for this country (for strict data isolation)"
  type        = bool
  default     = false
}

variable "postgresql_admin_username" {
  description = "PostgreSQL administrator username (required if dedicated_database is true)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "postgresql_admin_password" {
  description = "PostgreSQL administrator password (required if dedicated_database is true)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "postgresql_sku" {
  description = "PostgreSQL SKU for country-specific database"
  type        = string
  default     = "GP_Standard_D4s_v3"
}

variable "postgresql_storage_mb" {
  description = "PostgreSQL storage in MB for country-specific database"
  type        = number
  default     = 65536 # 64 GB
}

# ============================================
# Currency & Localization
# ============================================

variable "supported_currencies" {
  description = "Currencies supported in this country"
  type        = list(string)
  default     = ["USD"]
}

variable "primary_language" {
  description = "Primary language code for this country (e.g., en-US, de-DE, sw-KE)"
  type        = string
  default     = "en-US"
}

variable "timezone" {
  description = "Primary timezone for this country (e.g., America/New_York, Europe/Berlin, Africa/Nairobi)"
  type        = string
  default     = "UTC"
}

# ============================================
# Additional Tags
# ============================================

variable "additional_tags" {
  description = "Additional tags to apply to country resources"
  type        = map(string)
  default     = {}
}

# ============================================
# Feature Flags
# ============================================

variable "enable_advanced_threat_protection" {
  description = "Enable Advanced Threat Protection for storage account"
  type        = bool
  default     = true
}

variable "enable_diagnostic_logs" {
  description = "Enable diagnostic logs for all country resources"
  type        = bool
  default     = true
}
