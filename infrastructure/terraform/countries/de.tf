# ============================================
# Germany Country Configuration
# ============================================
# Deploys country-specific infrastructure for Germany
# Region: Europe (West Europe)
# Compliance: GDPR, ISO27001, SOC2, BDSG (German Federal Data Protection Act)
# Data Residency: Required (strict enforcement)
# Isolation: High (dedicated Key Vault, dedicated namespace, optional dedicated database)
#
# Germany has some of the strictest data protection laws in the world.
# This configuration ensures maximum data sovereignty and isolation.

module "country_de" {
  source = "../modules/country"

  # Basic Configuration
  project_name   = var.project_name
  environment    = var.environment
  country_code   = "DE"
  country_name   = "Germany"
  region_id      = "europe"
  location       = "westeurope"
  location_short = "weu"

  # Regional Infrastructure References
  regional_resource_group_name = module.europe[0].resource_group_name
  regional_vnet_name           = module.europe[0].vnet_name
  regional_aks_cluster_name    = module.europe[0].aks_cluster_name
  regional_aks_subnet_prefix   = "10.20.0.0/20"

  # Network Configuration
  subnet_cidr          = "10.20.48.0/24" # Country-specific subnet within regional VNet
  database_subnet_cidr = "10.20.49.0/24" # Dedicated database subnet for Germany

  # Isolation & Compliance
  isolation_enabled       = true  # HIGH isolation - dedicated Key Vault required
  data_residency_required = true  # Strict data residency enforcement
  compliance_tags         = ["GDPR", "ISO27001", "SOC2", "BDSG", "EU-Data-Protection"]

  # Dedicated Resources
  dedicated_node_pool = true  # Dedicated node pool for German workloads
  node_pool_vm_size   = "Standard_D8s_v3"
  node_pool_count     = 3
  node_pool_min_count = 3
  node_pool_max_count = 12

  dedicated_database         = true  # Dedicated PostgreSQL for German data
  postgresql_admin_username  = var.postgresql_admin_username
  postgresql_admin_password  = var.postgresql_admin_password
  postgresql_sku             = "GP_Standard_D4s_v3"
  postgresql_storage_mb      = 131072 # 128 GB

  # Currency & Localization
  supported_currencies = ["EUR"]
  primary_language     = "de-DE"
  timezone             = "Europe/Berlin"

  # Global Resources
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  # Additional Tags
  additional_tags = {
    BusinessUnit        = "UnifiedHealth-Europe"
    MarketSegment       = "Central-Europe"
    RegulatoryBody      = "BfDI" # German Federal Commissioner for Data Protection
    DataClassification  = "Highly-Sensitive"
    DataSovereignty     = "Enforced"
    IsolationJustification = "GDPR-BDSG-Compliance"
  }

  depends_on = [
    module.europe
  ]
}

# ============================================
# Outputs
# ============================================

output "de_infrastructure" {
  description = "Germany infrastructure details"
  value = {
    country_code        = module.country_de.country_code
    subnet_id           = module.country_de.subnet_id
    keyvault_name       = module.country_de.keyvault_name
    storage_account     = module.country_de.storage_account_name
    database_name       = module.country_de.postgresql_database_name
    node_pool_name      = module.country_de.node_pool_name
    isolation_level     = module.country_de.isolation_level
    compliance          = module.country_de.compliance_standards
  }
}

output "de_database_connection" {
  description = "Germany dedicated database connection string"
  value       = module.country_de.postgresql_connection_string
  sensitive   = true
}

output "de_keyvault_uri" {
  description = "Germany dedicated Key Vault URI"
  value       = module.country_de.keyvault_uri
}
