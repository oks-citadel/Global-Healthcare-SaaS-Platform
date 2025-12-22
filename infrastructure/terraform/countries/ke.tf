# ============================================
# Kenya Country Configuration
# ============================================
# Deploys country-specific infrastructure for Kenya
# Region: Africa (South Africa North)
# Compliance: Kenya Data Protection Act (KDPA), ISO27001, SOC2
# Data Residency: Required
# Isolation: Standard (shared regional resources)

module "country_ke" {
  source = "../modules/country"

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
  subnet_cidr = "10.30.48.0/24" # Country-specific subnet within regional VNet

  # Isolation & Compliance
  isolation_enabled       = false # Standard isolation - uses regional Key Vault
  data_residency_required = true  # Kenya Data Protection Act requires data sovereignty
  compliance_tags         = ["KDPA", "ISO27001", "SOC2", "Kenya-Data-Protection"]

  # Dedicated Resources
  dedicated_node_pool = false # Uses shared regional node pools
  dedicated_database  = false # Uses shared regional PostgreSQL

  # Currency & Localization
  supported_currencies = ["KES", "USD"]
  primary_language     = "sw-KE" # Swahili (Kenya)
  timezone             = "Africa/Nairobi"

  # Global Resources
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  # Additional Tags
  additional_tags = {
    BusinessUnit       = "UnifiedHealth-Africa"
    MarketSegment      = "East-Africa"
    RegulatoryBody     = "ODPC" # Office of the Data Protection Commissioner
    DataClassification = "Sensitive"
    RegionalHub        = "EAC" # East African Community
  }

  depends_on = [
    module.africa
  ]
}

# ============================================
# Outputs
# ============================================

output "ke_infrastructure" {
  description = "Kenya infrastructure details"
  value = {
    country_code        = module.country_ke.country_code
    subnet_id           = module.country_ke.subnet_id
    storage_account     = module.country_ke.storage_account_name
    isolation_level     = module.country_ke.isolation_level
    compliance          = module.country_ke.compliance_standards
  }
}
