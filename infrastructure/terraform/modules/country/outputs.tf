# ============================================
# Country Module - Outputs
# ============================================
# Outputs for country-specific resources

# ============================================
# Country Information
# ============================================

output "country_code" {
  description = "ISO 3166-1 alpha-2 country code"
  value       = var.country_code
}

output "country_name" {
  description = "Full country name"
  value       = var.country_name
}

output "region_id" {
  description = "Regional identifier"
  value       = var.region_id
}

output "isolation_level" {
  description = "Isolation level for this country"
  value       = var.isolation_enabled ? "High" : "Standard"
}

# ============================================
# Network Outputs
# ============================================

output "subnet_id" {
  description = "ID of the country-specific subnet"
  value       = azurerm_subnet.country.id
}

output "subnet_name" {
  description = "Name of the country-specific subnet"
  value       = azurerm_subnet.country.name
}

output "subnet_address_prefix" {
  description = "Address prefix of the country-specific subnet"
  value       = azurerm_subnet.country.address_prefixes[0]
}

output "network_security_group_id" {
  description = "ID of the country-specific Network Security Group"
  value       = azurerm_network_security_group.country.id
}

output "network_security_group_name" {
  description = "Name of the country-specific Network Security Group"
  value       = azurerm_network_security_group.country.name
}

# ============================================
# Key Vault Outputs
# ============================================

output "keyvault_id" {
  description = "ID of the country-specific Key Vault (if isolation is enabled)"
  value       = var.isolation_enabled ? azurerm_key_vault.country[0].id : null
}

output "keyvault_name" {
  description = "Name of the country-specific Key Vault (if isolation is enabled)"
  value       = var.isolation_enabled ? azurerm_key_vault.country[0].name : null
}

output "keyvault_uri" {
  description = "URI of the country-specific Key Vault (if isolation is enabled)"
  value       = var.isolation_enabled ? azurerm_key_vault.country[0].vault_uri : null
}

# ============================================
# Storage Account Outputs
# ============================================

output "storage_account_id" {
  description = "ID of the country-specific storage account (if data residency is required)"
  value       = var.data_residency_required ? azurerm_storage_account.country[0].id : null
}

output "storage_account_name" {
  description = "Name of the country-specific storage account (if data residency is required)"
  value       = var.data_residency_required ? azurerm_storage_account.country[0].name : null
}

output "storage_primary_blob_endpoint" {
  description = "Primary blob endpoint of the country-specific storage account"
  value       = var.data_residency_required ? azurerm_storage_account.country[0].primary_blob_endpoint : null
}

output "storage_primary_access_key" {
  description = "Primary access key for the country-specific storage account"
  value       = var.data_residency_required ? azurerm_storage_account.country[0].primary_access_key : null
  sensitive   = true
}

output "storage_containers" {
  description = "Map of storage container names"
  value = var.data_residency_required ? {
    documents    = azurerm_storage_container.country_documents[0].name
    patient_data = azurerm_storage_container.country_patient_data[0].name
    backups      = azurerm_storage_container.country_backups[0].name
  } : {}
}

# ============================================
# AKS Node Pool Outputs
# ============================================

output "node_pool_id" {
  description = "ID of the country-specific AKS node pool (if dedicated node pool is enabled)"
  value       = var.dedicated_node_pool ? azurerm_kubernetes_cluster_node_pool.country[0].id : null
}

output "node_pool_name" {
  description = "Name of the country-specific AKS node pool (if dedicated node pool is enabled)"
  value       = var.dedicated_node_pool ? azurerm_kubernetes_cluster_node_pool.country[0].name : null
}

output "node_pool_labels" {
  description = "Labels applied to the country-specific node pool"
  value = var.dedicated_node_pool ? {
    country       = var.country_code
    region        = var.region_id
    isolation     = var.isolation_enabled ? "high" : "standard"
    compliance    = join("-", var.compliance_tags)
    nodepool-type = "country-dedicated"
  } : {}
}

output "node_pool_taints" {
  description = "Taints applied to the country-specific node pool"
  value       = var.dedicated_node_pool ? azurerm_kubernetes_cluster_node_pool.country[0].node_taints : []
}

# ============================================
# PostgreSQL Database Outputs
# ============================================

output "postgresql_server_id" {
  description = "ID of the country-specific PostgreSQL server (if dedicated database is enabled)"
  value       = var.dedicated_database ? azurerm_postgresql_flexible_server.country[0].id : null
}

output "postgresql_server_name" {
  description = "Name of the country-specific PostgreSQL server (if dedicated database is enabled)"
  value       = var.dedicated_database ? azurerm_postgresql_flexible_server.country[0].name : null
}

output "postgresql_server_fqdn" {
  description = "FQDN of the country-specific PostgreSQL server (if dedicated database is enabled)"
  value       = var.dedicated_database ? azurerm_postgresql_flexible_server.country[0].fqdn : null
}

output "postgresql_database_name" {
  description = "Name of the country-specific PostgreSQL database (if dedicated database is enabled)"
  value       = var.dedicated_database ? azurerm_postgresql_flexible_server_database.country[0].name : null
}

output "postgresql_connection_string" {
  description = "Connection string for the country-specific PostgreSQL database"
  value = var.dedicated_database ? (
    "postgresql://${var.postgresql_admin_username}@${azurerm_postgresql_flexible_server.country[0].fqdn}:5432/${azurerm_postgresql_flexible_server_database.country[0].name}?sslmode=require"
  ) : null
  sensitive = true
}

output "database_subnet_id" {
  description = "ID of the country-specific database subnet (if dedicated database is enabled)"
  value       = var.dedicated_database ? azurerm_subnet.country_database[0].id : null
}

# ============================================
# Compliance & Configuration Outputs
# ============================================

output "compliance_standards" {
  description = "Compliance standards applicable to this country"
  value       = var.compliance_tags
}

output "data_residency_enabled" {
  description = "Whether data residency is enforced for this country"
  value       = var.data_residency_required
}

output "supported_currencies" {
  description = "Currencies supported in this country"
  value       = var.supported_currencies
}

output "primary_language" {
  description = "Primary language for this country"
  value       = var.primary_language
}

output "timezone" {
  description = "Primary timezone for this country"
  value       = var.timezone
}

# ============================================
# Resource Tags
# ============================================

output "common_tags" {
  description = "Common tags applied to all country resources"
  value       = local.common_tags
}

# ============================================
# Summary Output
# ============================================

output "country_infrastructure_summary" {
  description = "Summary of country infrastructure configuration"
  value = {
    country_code           = var.country_code
    country_name           = var.country_name
    region                 = var.region_id
    location               = var.location
    isolation_enabled      = var.isolation_enabled
    data_residency         = var.data_residency_required
    dedicated_keyvault     = var.isolation_enabled
    dedicated_storage      = var.data_residency_required
    dedicated_node_pool    = var.dedicated_node_pool
    dedicated_database     = var.dedicated_database
    subnet_cidr            = var.subnet_cidr
    compliance_standards   = var.compliance_tags
    supported_currencies   = var.supported_currencies
  }
}
