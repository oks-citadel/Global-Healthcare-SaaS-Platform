# ============================================
# UnifiedHealth Platform - Terraform Outputs
# ============================================

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "aks_cluster_name" {
  description = "Name of the AKS cluster"
  value       = azurerm_kubernetes_cluster.main.name
}

output "aks_cluster_id" {
  description = "ID of the AKS cluster"
  value       = azurerm_kubernetes_cluster.main.id
}

output "aks_kube_config" {
  description = "Kubernetes config for AKS"
  value       = azurerm_kubernetes_cluster.main.kube_config_raw
  sensitive   = true
}

output "acr_login_server" {
  description = "ACR login server"
  value       = azurerm_container_registry.main.login_server
}

output "acr_name" {
  description = "ACR name"
  value       = azurerm_container_registry.main.name
}

output "key_vault_uri" {
  description = "Key Vault URI"
  value       = azurerm_key_vault.main.vault_uri
}

output "key_vault_name" {
  description = "Key Vault name"
  value       = azurerm_key_vault.main.name
}

output "postgresql_fqdn" {
  description = "PostgreSQL server FQDN"
  value       = azurerm_postgresql_flexible_server.main.fqdn
}

output "postgresql_database" {
  description = "PostgreSQL database name"
  value       = azurerm_postgresql_flexible_server_database.unified_health.name
}

output "redis_hostname" {
  description = "Redis hostname"
  value       = azurerm_redis_cache.main.hostname
}

output "redis_primary_key" {
  description = "Redis primary key"
  value       = azurerm_redis_cache.main.primary_access_key
  sensitive   = true
}

output "storage_account_name" {
  description = "Storage account name"
  value       = azurerm_storage_account.main.name
}

output "storage_primary_connection_string" {
  description = "Storage account connection string"
  value       = azurerm_storage_account.main.primary_connection_string
  sensitive   = true
}

output "log_analytics_workspace_id" {
  description = "Log Analytics workspace ID"
  value       = azurerm_log_analytics_workspace.main.id
}
