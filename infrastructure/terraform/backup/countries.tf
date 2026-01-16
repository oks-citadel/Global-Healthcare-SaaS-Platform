# ============================================
# Country-Level Infrastructure Integration
# ============================================
# Extends the Global→Region architecture with Country-level segmentation
# - Country-specific subnets within regional VNets
# - Country-specific Network Security Groups
# - Country-specific Key Vaults (for high-isolation countries)
# - Country-specific Storage Accounts (for data residency)
# - Country-specific AKS node pools (optional)
# - Country-specific databases (optional)
#
# Architecture: Global → Region → Country
# - Global: Shared services (ACR, Front Door, Traffic Manager)
# - Region: Regional infrastructure (AKS, PostgreSQL, Redis, VNet)
# - Country: Country-specific resources for compliance and data sovereignty

# ============================================
# United States - Americas Region
# ============================================
module "country_us" {
  source = "./modules/country"
  count  = var.deploy_americas ? 1 : 0

  # Basic Configuration
  project_name   = var.project_name
  environment    = var.environment
  country_code   = "US"
  country_name   = "United States"
  region_id      = "americas"
  location       = "eastus"
  location_short = "eus"

  # Regional Infrastructure References
  regional_resource_group_name = module.americas[0].resource_group_name
  regional_vnet_name           = module.americas[0].vnet_name
  regional_aks_cluster_name    = module.americas[0].aks_cluster_name
  regional_aks_subnet_prefix   = "10.10.0.0/20"

  # Network Configuration
  subnet_cidr = "10.10.48.0/24"

  # Isolation & Compliance
  isolation_enabled       = false
  data_residency_required = true
  compliance_tags         = ["HIPAA", "SOC2", "ISO27001", "FedRAMP"]

  # Dedicated Resources
  dedicated_node_pool = false
  dedicated_database  = false

  # Currency & Localization
  supported_currencies = ["USD"]
  primary_language     = "en-US"
  timezone             = "America/New_York"

  # Global Resources
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  # Additional Tags
  additional_tags = {
    BusinessUnit       = "UnifiedHealth-Americas"
    MarketSegment      = "North-America"
    RegulatoryBody     = "HHS-OCR"
    DataClassification = "PHI"
  }

  depends_on = [module.americas]
}

# ============================================
# Germany - Europe Region (High Isolation)
# ============================================
module "country_de" {
  source = "./modules/country"
  count  = var.deploy_europe ? 1 : 0

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
  subnet_cidr          = "10.20.48.0/24"
  database_subnet_cidr = "10.20.49.0/24"

  # Isolation & Compliance (HIGH - Germany requires strict data protection)
  isolation_enabled       = true
  data_residency_required = true
  compliance_tags         = ["GDPR", "ISO27001", "SOC2", "BDSG", "EU-Data-Protection"]

  # Dedicated Resources (Full isolation for German data)
  dedicated_node_pool = true
  node_pool_vm_size   = "Standard_D8s_v3"
  node_pool_count     = 3
  node_pool_min_count = 3
  node_pool_max_count = 12

  dedicated_database        = true
  postgresql_admin_username = var.postgresql_admin_username
  postgresql_admin_password = var.postgresql_admin_password
  postgresql_sku            = "GP_Standard_D4s_v3"
  postgresql_storage_mb     = 131072

  # Currency & Localization
  supported_currencies = ["EUR"]
  primary_language     = "de-DE"
  timezone             = "Europe/Berlin"

  # Global Resources
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  # Additional Tags
  additional_tags = {
    BusinessUnit           = "UnifiedHealth-Europe"
    MarketSegment          = "Central-Europe"
    RegulatoryBody         = "BfDI"
    DataClassification     = "Highly-Sensitive"
    DataSovereignty        = "Enforced"
    IsolationJustification = "GDPR-BDSG-Compliance"
  }

  depends_on = [module.europe]
}

# ============================================
# Kenya - Africa Region
# ============================================
module "country_ke" {
  source = "./modules/country"
  count  = var.deploy_africa ? 1 : 0

  # Basic Configuration
  project_name   = var.project_name
  environment    = var.environment
  country_code   = "KE"
  country_name   = "Kenya"
  region_id      = "africa"
  location       = "southafricanorth"
  location_short = "san"

  # Regional Infrastructure References
  regional_resource_group_name = module.africa[0].resource_group_name
  regional_vnet_name           = module.africa[0].vnet_name
  regional_aks_cluster_name    = module.africa[0].aks_cluster_name
  regional_aks_subnet_prefix   = "10.30.0.0/20"

  # Network Configuration
  subnet_cidr = "10.30.48.0/24"

  # Isolation & Compliance
  isolation_enabled       = false
  data_residency_required = true
  compliance_tags         = ["KDPA", "ISO27001", "SOC2", "Kenya-Data-Protection"]

  # Dedicated Resources
  dedicated_node_pool = false
  dedicated_database  = false

  # Currency & Localization
  supported_currencies = ["KES", "USD"]
  primary_language     = "sw-KE"
  timezone             = "Africa/Nairobi"

  # Global Resources
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  # Additional Tags
  additional_tags = {
    BusinessUnit       = "UnifiedHealth-Africa"
    MarketSegment      = "East-Africa"
    RegulatoryBody     = "ODPC"
    DataClassification = "Sensitive"
    RegionalHub        = "EAC"
  }

  depends_on = [module.africa]
}

# ============================================
# Nigeria - Africa Region
# ============================================
module "country_ng" {
  source = "./modules/country"
  count  = var.deploy_africa ? 1 : 0

  # Basic Configuration
  project_name   = var.project_name
  environment    = var.environment
  country_code   = "NG"
  country_name   = "Nigeria"
  region_id      = "africa"
  location       = "southafricanorth"
  location_short = "san"

  # Regional Infrastructure References
  regional_resource_group_name = module.africa[0].resource_group_name
  regional_vnet_name           = module.africa[0].vnet_name
  regional_aks_cluster_name    = module.africa[0].aks_cluster_name
  regional_aks_subnet_prefix   = "10.30.0.0/20"

  # Network Configuration
  subnet_cidr = "10.30.50.0/24"

  # Isolation & Compliance
  isolation_enabled       = false
  data_residency_required = true
  compliance_tags         = ["NDPR", "ISO27001", "SOC2", "Nigeria-Data-Protection"]

  # Dedicated Resources
  dedicated_node_pool = false
  dedicated_database  = false

  # Currency & Localization
  supported_currencies = ["NGN", "USD"]
  primary_language     = "en-NG"
  timezone             = "Africa/Lagos"

  # Global Resources
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  # Additional Tags
  additional_tags = {
    BusinessUnit       = "UnifiedHealth-Africa"
    MarketSegment      = "West-Africa"
    RegulatoryBody     = "NITDA"
    DataClassification = "Sensitive"
    RegionalHub        = "ECOWAS"
  }

  depends_on = [module.africa]
}

# ============================================
# South Africa - Africa Region
# ============================================
module "country_za" {
  source = "./modules/country"
  count  = var.deploy_africa ? 1 : 0

  # Basic Configuration
  project_name   = var.project_name
  environment    = var.environment
  country_code   = "ZA"
  country_name   = "South Africa"
  region_id      = "africa"
  location       = "southafricanorth"
  location_short = "san"

  # Regional Infrastructure References
  regional_resource_group_name = module.africa[0].resource_group_name
  regional_vnet_name           = module.africa[0].vnet_name
  regional_aks_cluster_name    = module.africa[0].aks_cluster_name
  regional_aks_subnet_prefix   = "10.30.0.0/20"

  # Network Configuration
  subnet_cidr = "10.30.52.0/24"

  # Isolation & Compliance
  isolation_enabled       = false
  data_residency_required = true
  compliance_tags         = ["POPIA", "ISO27001", "SOC2", "South-Africa-Data-Protection"]

  # Dedicated Resources
  dedicated_node_pool = false
  dedicated_database  = false

  # Currency & Localization
  supported_currencies = ["ZAR", "USD"]
  primary_language     = "en-ZA"
  timezone             = "Africa/Johannesburg"

  # Global Resources
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  # Additional Tags
  additional_tags = {
    BusinessUnit       = "UnifiedHealth-Africa"
    MarketSegment      = "Southern-Africa"
    RegulatoryBody     = "Information-Regulator-SA"
    DataClassification = "Sensitive"
    RegionalHub        = "SADC"
    HostRegion         = "true"
  }

  depends_on = [module.africa]
}

# ============================================
# Country Infrastructure Outputs
# ============================================

output "country_infrastructure_summary" {
  description = "Summary of all country-level infrastructure deployments"
  value = {
    united_states = var.deploy_americas ? {
      country_code         = module.country_us[0].country_code
      subnet_id            = module.country_us[0].subnet_id
      storage_account      = module.country_us[0].storage_account_name
      isolation_level      = module.country_us[0].isolation_level
      compliance_standards = module.country_us[0].compliance_standards
    } : null

    germany = var.deploy_europe ? {
      country_code         = module.country_de[0].country_code
      subnet_id            = module.country_de[0].subnet_id
      keyvault_name        = module.country_de[0].keyvault_name
      storage_account      = module.country_de[0].storage_account_name
      database_name        = module.country_de[0].postgresql_database_name
      node_pool_name       = module.country_de[0].node_pool_name
      isolation_level      = module.country_de[0].isolation_level
      compliance_standards = module.country_de[0].compliance_standards
    } : null

    kenya = var.deploy_africa ? {
      country_code         = module.country_ke[0].country_code
      subnet_id            = module.country_ke[0].subnet_id
      storage_account      = module.country_ke[0].storage_account_name
      isolation_level      = module.country_ke[0].isolation_level
      compliance_standards = module.country_ke[0].compliance_standards
    } : null

    nigeria = var.deploy_africa ? {
      country_code         = module.country_ng[0].country_code
      subnet_id            = module.country_ng[0].subnet_id
      storage_account      = module.country_ng[0].storage_account_name
      isolation_level      = module.country_ng[0].isolation_level
      compliance_standards = module.country_ng[0].compliance_standards
    } : null

    south_africa = var.deploy_africa ? {
      country_code         = module.country_za[0].country_code
      subnet_id            = module.country_za[0].subnet_id
      storage_account      = module.country_za[0].storage_account_name
      isolation_level      = module.country_za[0].isolation_level
      compliance_standards = module.country_za[0].compliance_standards
    } : null
  }
}

output "country_high_isolation_resources" {
  description = "High-isolation resources for countries requiring strict data protection"
  value = {
    germany = var.deploy_europe ? {
      keyvault_uri        = module.country_de[0].keyvault_uri
      database_connection = module.country_de[0].postgresql_connection_string
      node_pool_labels    = module.country_de[0].node_pool_labels
      node_pool_taints    = module.country_de[0].node_pool_taints
    } : null
  }
  sensitive = true
}

output "country_data_residency_compliance" {
  description = "Data residency compliance status for all countries"
  value = {
    united_states = var.deploy_americas ? module.country_us[0].data_residency_enabled : null
    germany       = var.deploy_europe ? module.country_de[0].data_residency_enabled : null
    kenya         = var.deploy_africa ? module.country_ke[0].data_residency_enabled : null
    nigeria       = var.deploy_africa ? module.country_ng[0].data_residency_enabled : null
    south_africa  = var.deploy_africa ? module.country_za[0].data_residency_enabled : null
  }
}
