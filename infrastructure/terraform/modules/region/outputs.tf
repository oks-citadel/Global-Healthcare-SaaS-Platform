# ============================================
# Regional Module - Outputs
# ============================================

output "region_name" {
  description = "Name of the region"
  value       = var.region_name
}

output "location" {
  description = "Azure location"
  value       = var.location
}

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.region.name
}

output "resource_group_id" {
  description = "ID of the resource group"
  value       = azurerm_resource_group.region.id
}

# ============================================
# Network Outputs
# ============================================

output "vnet_id" {
  description = "ID of the virtual network"
  value       = azurerm_virtual_network.region.id
}

output "vnet_name" {
  description = "Name of the virtual network"
  value       = azurerm_virtual_network.region.name
}

output "vnet_address_space" {
  description = "Address space of the virtual network"
  value       = azurerm_virtual_network.region.address_space
}

output "aks_subnet_id" {
  description = "ID of the AKS subnet"
  value       = azurerm_subnet.aks.id
}

output "database_subnet_id" {
  description = "ID of the database subnet"
  value       = azurerm_subnet.database.id
}

# ============================================
# AKS Outputs
# ============================================

output "aks_cluster_id" {
  description = "ID of the AKS cluster"
  value       = azurerm_kubernetes_cluster.region.id
}

output "aks_cluster_name" {
  description = "Name of the AKS cluster"
  value       = azurerm_kubernetes_cluster.region.name
}

output "aks_cluster_fqdn" {
  description = "FQDN of the AKS cluster"
  value       = azurerm_kubernetes_cluster.region.fqdn
}

output "aks_kubelet_identity" {
  description = "Kubelet identity of the AKS cluster"
  value       = azurerm_kubernetes_cluster.region.kubelet_identity[0].object_id
}

output "aks_kube_config" {
  description = "Kubeconfig for AKS cluster"
  value       = azurerm_kubernetes_cluster.region.kube_config_raw
  sensitive   = true
}

# ============================================
# Database Outputs
# ============================================

output "postgresql_server_id" {
  description = "ID of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.region.id
}

output "postgresql_server_name" {
  description = "Name of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.region.name
}

output "postgresql_server_fqdn" {
  description = "FQDN of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.region.fqdn
}

output "postgresql_database_name" {
  description = "Name of the PostgreSQL database"
  value       = azurerm_postgresql_flexible_server_database.unified_health.name
}

output "postgresql_connection_string" {
  description = "Connection string for PostgreSQL"
  value       = "postgresql://${var.postgresql_admin_username}@${azurerm_postgresql_flexible_server.region.fqdn}:5432/${azurerm_postgresql_flexible_server_database.unified_health.name}?sslmode=require"
  sensitive   = true
}

# ============================================
# Redis Outputs
# ============================================

output "redis_id" {
  description = "ID of the Redis cache"
  value       = azurerm_redis_cache.region.id
}

output "redis_name" {
  description = "Name of the Redis cache"
  value       = azurerm_redis_cache.region.name
}

output "redis_hostname" {
  description = "Hostname of the Redis cache"
  value       = azurerm_redis_cache.region.hostname
}

output "redis_ssl_port" {
  description = "SSL port of the Redis cache"
  value       = azurerm_redis_cache.region.ssl_port
}

output "redis_primary_key" {
  description = "Primary key for Redis cache"
  value       = azurerm_redis_cache.region.primary_access_key
  sensitive   = true
}

output "redis_connection_string" {
  description = "Connection string for Redis"
  value       = "${azurerm_redis_cache.region.hostname}:${azurerm_redis_cache.region.ssl_port},password=${azurerm_redis_cache.region.primary_access_key},ssl=True,abortConnect=False"
  sensitive   = true
}

# ============================================
# Key Vault Outputs
# ============================================

output "keyvault_id" {
  description = "ID of the Key Vault"
  value       = azurerm_key_vault.region.id
}

output "keyvault_name" {
  description = "Name of the Key Vault"
  value       = azurerm_key_vault.region.name
}

output "keyvault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.region.vault_uri
}

# ============================================
# Storage Outputs
# ============================================

output "storage_account_id" {
  description = "ID of the storage account"
  value       = azurerm_storage_account.region.id
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.region.name
}

output "storage_primary_blob_endpoint" {
  description = "Primary blob endpoint of the storage account"
  value       = azurerm_storage_account.region.primary_blob_endpoint
}

# ============================================
# Monitoring Outputs
# ============================================

output "application_insights_id" {
  description = "ID of Application Insights"
  value       = azurerm_application_insights.region.id
}

output "application_insights_instrumentation_key" {
  description = "Instrumentation key for Application Insights"
  value       = azurerm_application_insights.region.instrumentation_key
  sensitive   = true
}

output "application_insights_connection_string" {
  description = "Connection string for Application Insights"
  value       = azurerm_application_insights.region.connection_string
  sensitive   = true
}

output "action_group_id" {
  description = "ID of the action group"
  value       = azurerm_monitor_action_group.critical.id
}

# ============================================
# Compliance & Tags
# ============================================

output "compliance_standards" {
  description = "Compliance standards for this region"
  value       = var.compliance_standards
}

output "supported_currencies" {
  description = "Supported currencies in this region"
  value       = var.supported_currencies
}

output "data_residency_enabled" {
  description = "Whether data residency is enforced"
  value       = var.data_residency_required
}

output "common_tags" {
  description = "Common tags applied to all resources"
  value       = local.common_tags
}
