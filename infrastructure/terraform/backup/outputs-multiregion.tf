# ============================================
# UnifiedHealth Platform - Multi-Region Outputs
# ============================================

# ============================================
# Global Resources
# ============================================

output "global_resource_group_name" {
  description = "Name of the global resource group"
  value       = azurerm_resource_group.global.name
}

output "global_acr_name" {
  description = "Name of the global Azure Container Registry"
  value       = azurerm_container_registry.global.name
}

output "global_acr_login_server" {
  description = "Login server for the global ACR"
  value       = azurerm_container_registry.global.login_server
}

output "global_keyvault_name" {
  description = "Name of the global Key Vault"
  value       = azurerm_key_vault.global.name
}

output "global_keyvault_uri" {
  description = "URI of the global Key Vault"
  value       = azurerm_key_vault.global.vault_uri
}

output "global_log_analytics_workspace_id" {
  description = "ID of the global Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.global.id
}

output "frontdoor_profile_name" {
  description = "Name of the Azure Front Door profile"
  value       = azurerm_cdn_frontdoor_profile.global.name
}

output "frontdoor_api_endpoint" {
  description = "API endpoint for Azure Front Door"
  value       = azurerm_cdn_frontdoor_endpoint.api.host_name
}

output "frontdoor_web_endpoint" {
  description = "Web endpoint for Azure Front Door"
  value       = azurerm_cdn_frontdoor_endpoint.web.host_name
}

output "traffic_manager_fqdn" {
  description = "FQDN of the Traffic Manager profile"
  value       = azurerm_traffic_manager_profile.global.fqdn
}

# ============================================
# Americas Region
# ============================================

output "americas_deployed" {
  description = "Whether Americas region is deployed"
  value       = var.deploy_americas
}

output "americas_resource_group_name" {
  description = "Americas resource group name"
  value       = var.deploy_americas ? module.americas[0].resource_group_name : null
}

output "americas_aks_cluster_name" {
  description = "Americas AKS cluster name"
  value       = var.deploy_americas ? module.americas[0].aks_cluster_name : null
}

output "americas_aks_cluster_fqdn" {
  description = "Americas AKS cluster FQDN"
  value       = var.deploy_americas ? module.americas[0].aks_cluster_fqdn : null
}

output "americas_postgresql_fqdn" {
  description = "Americas PostgreSQL server FQDN"
  value       = var.deploy_americas ? module.americas[0].postgresql_server_fqdn : null
}

output "americas_redis_hostname" {
  description = "Americas Redis hostname"
  value       = var.deploy_americas ? module.americas[0].redis_hostname : null
}

output "americas_keyvault_name" {
  description = "Americas Key Vault name"
  value       = var.deploy_americas ? module.americas[0].keyvault_name : null
}

output "americas_application_insights_key" {
  description = "Americas Application Insights instrumentation key"
  value       = var.deploy_americas ? module.americas[0].application_insights_instrumentation_key : null
  sensitive   = true
}

output "americas_compliance_standards" {
  description = "Americas compliance standards"
  value       = var.deploy_americas ? module.americas[0].compliance_standards : null
}

output "americas_supported_currencies" {
  description = "Americas supported currencies"
  value       = var.deploy_americas ? module.americas[0].supported_currencies : null
}

# ============================================
# Europe Region
# ============================================

output "europe_deployed" {
  description = "Whether Europe region is deployed"
  value       = var.deploy_europe
}

output "europe_resource_group_name" {
  description = "Europe resource group name"
  value       = var.deploy_europe ? module.europe[0].resource_group_name : null
}

output "europe_aks_cluster_name" {
  description = "Europe AKS cluster name"
  value       = var.deploy_europe ? module.europe[0].aks_cluster_name : null
}

output "europe_aks_cluster_fqdn" {
  description = "Europe AKS cluster FQDN"
  value       = var.deploy_europe ? module.europe[0].aks_cluster_fqdn : null
}

output "europe_postgresql_fqdn" {
  description = "Europe PostgreSQL server FQDN"
  value       = var.deploy_europe ? module.europe[0].postgresql_server_fqdn : null
}

output "europe_redis_hostname" {
  description = "Europe Redis hostname"
  value       = var.deploy_europe ? module.europe[0].redis_hostname : null
}

output "europe_keyvault_name" {
  description = "Europe Key Vault name"
  value       = var.deploy_europe ? module.europe[0].keyvault_name : null
}

output "europe_application_insights_key" {
  description = "Europe Application Insights instrumentation key"
  value       = var.deploy_europe ? module.europe[0].application_insights_instrumentation_key : null
  sensitive   = true
}

output "europe_compliance_standards" {
  description = "Europe compliance standards"
  value       = var.deploy_europe ? module.europe[0].compliance_standards : null
}

output "europe_supported_currencies" {
  description = "Europe supported currencies"
  value       = var.deploy_europe ? module.europe[0].supported_currencies : null
}

# ============================================
# Africa Region
# ============================================

output "africa_deployed" {
  description = "Whether Africa region is deployed"
  value       = var.deploy_africa
}

output "africa_resource_group_name" {
  description = "Africa resource group name"
  value       = var.deploy_africa ? module.africa[0].resource_group_name : null
}

output "africa_aks_cluster_name" {
  description = "Africa AKS cluster name"
  value       = var.deploy_africa ? module.africa[0].aks_cluster_name : null
}

output "africa_aks_cluster_fqdn" {
  description = "Africa AKS cluster FQDN"
  value       = var.deploy_africa ? module.africa[0].aks_cluster_fqdn : null
}

output "africa_postgresql_fqdn" {
  description = "Africa PostgreSQL server FQDN"
  value       = var.deploy_africa ? module.africa[0].postgresql_server_fqdn : null
}

output "africa_redis_hostname" {
  description = "Africa Redis hostname"
  value       = var.deploy_africa ? module.africa[0].redis_hostname : null
}

output "africa_keyvault_name" {
  description = "Africa Key Vault name"
  value       = var.deploy_africa ? module.africa[0].keyvault_name : null
}

output "africa_application_insights_key" {
  description = "Africa Application Insights instrumentation key"
  value       = var.deploy_africa ? module.africa[0].application_insights_instrumentation_key : null
  sensitive   = true
}

output "africa_compliance_standards" {
  description = "Africa compliance standards"
  value       = var.deploy_africa ? module.africa[0].compliance_standards : null
}

output "africa_supported_currencies" {
  description = "Africa supported currencies"
  value       = var.deploy_africa ? module.africa[0].supported_currencies : null
}

# ============================================
# Multi-Region Summary
# ============================================

output "deployment_summary" {
  description = "Summary of multi-region deployment"
  value = {
    environment      = var.environment
    regions_deployed = [
      var.deploy_americas ? "Americas (East US)" : null,
      var.deploy_europe ? "Europe (West Europe)" : null,
      var.deploy_africa ? "Africa (South Africa North)" : null
    ]
    total_regions           = (var.deploy_americas ? 1 : 0) + (var.deploy_europe ? 1 : 0) + (var.deploy_africa ? 1 : 0)
    cross_region_peering    = var.enable_cross_region_peering
    global_acr             = azurerm_container_registry.global.login_server
    frontdoor_endpoint     = azurerm_cdn_frontdoor_endpoint.api.host_name
    traffic_manager_fqdn   = azurerm_traffic_manager_profile.global.fqdn
  }
}

# ============================================
# Kubeconfig Commands
# ============================================

output "kubeconfig_commands" {
  description = "Commands to get kubeconfig for each region"
  value = {
    americas = var.deploy_americas ? "az aks get-credentials --resource-group ${module.americas[0].resource_group_name} --name ${module.americas[0].aks_cluster_name}" : "N/A"
    europe   = var.deploy_europe ? "az aks get-credentials --resource-group ${module.europe[0].resource_group_name} --name ${module.europe[0].aks_cluster_name}" : "N/A"
    africa   = var.deploy_africa ? "az aks get-credentials --resource-group ${module.africa[0].resource_group_name} --name ${module.africa[0].aks_cluster_name}" : "N/A"
  }
}

# ============================================
# Connection Information
# ============================================

output "connection_info" {
  description = "Connection information for all regions"
  value = {
    americas = var.deploy_americas ? {
      postgresql = module.americas[0].postgresql_server_fqdn
      redis      = "${module.americas[0].redis_hostname}:${module.americas[0].redis_ssl_port}"
      keyvault   = module.americas[0].keyvault_uri
    } : null
    europe = var.deploy_europe ? {
      postgresql = module.europe[0].postgresql_server_fqdn
      redis      = "${module.europe[0].redis_hostname}:${module.europe[0].redis_ssl_port}"
      keyvault   = module.europe[0].keyvault_uri
    } : null
    africa = var.deploy_africa ? {
      postgresql = module.africa[0].postgresql_server_fqdn
      redis      = "${module.africa[0].redis_hostname}:${module.africa[0].redis_ssl_port}"
      keyvault   = module.africa[0].keyvault_uri
    } : null
  }
  sensitive = false
}
