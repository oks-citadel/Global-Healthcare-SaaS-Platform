# ============================================
# South Africa Country Configuration
# ============================================
# Deploys country-specific infrastructure for South Africa
# Region: Africa (South Africa North)
# Compliance: POPIA (Protection of Personal Information Act), ISO27001, SOC2
# Data Residency: Required (strict enforcement)
# Isolation: Standard (shared regional resources with enhanced compliance)

module "country_za" {
  source = "../modules/country"

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
  subnet_cidr = "10.30.52.0/24" # Country-specific subnet within regional VNet

  # Isolation & Compliance
  isolation_enabled       = false # Standard isolation - uses regional Key Vault
  data_residency_required = true  # POPIA requires data to remain in South Africa
  compliance_tags         = ["POPIA", "ISO27001", "SOC2", "South-Africa-Data-Protection"]

  # Dedicated Resources
  dedicated_node_pool = false # Uses shared regional node pools
  dedicated_database  = false # Uses shared regional PostgreSQL

  # Currency & Localization
  supported_currencies = ["ZAR", "USD"]
  primary_language     = "en-ZA" # English (South Africa)
  timezone             = "Africa/Johannesburg"

  # Global Resources
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  # Additional Tags
  additional_tags = {
    BusinessUnit       = "UnifiedHealth-Africa"
    MarketSegment      = "Southern-Africa"
    RegulatoryBody     = "Information-Regulator-SA"
    DataClassification = "Sensitive"
    RegionalHub        = "SADC" # Southern African Development Community
    HostRegion         = "true" # This is the host region for Africa
  }

  depends_on = [
    module.africa
  ]
}

# ============================================
# Outputs
# ============================================

output "za_infrastructure" {
  description = "South Africa infrastructure details"
  value = {
    country_code        = module.country_za.country_code
    subnet_id           = module.country_za.subnet_id
    storage_account     = module.country_za.storage_account_name
    isolation_level     = module.country_za.isolation_level
    compliance          = module.country_za.compliance_standards
  }
}
