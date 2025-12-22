# ============================================
# Nigeria Country Configuration
# ============================================
# Deploys country-specific infrastructure for Nigeria
# Region: Africa (South Africa North)
# Compliance: Nigeria Data Protection Regulation (NDPR), ISO27001, SOC2
# Data Residency: Required
# Isolation: Standard (shared regional resources)

module "country_ng" {
  source = "../modules/country"

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
  subnet_cidr = "10.30.50.0/24" # Country-specific subnet within regional VNet

  # Isolation & Compliance
  isolation_enabled       = false # Standard isolation - uses regional Key Vault
  data_residency_required = true  # NDPR requires data localization
  compliance_tags         = ["NDPR", "ISO27001", "SOC2", "Nigeria-Data-Protection"]

  # Dedicated Resources
  dedicated_node_pool = false # Uses shared regional node pools
  dedicated_database  = false # Uses shared regional PostgreSQL

  # Currency & Localization
  supported_currencies = ["NGN", "USD"]
  primary_language     = "en-NG" # English (Nigeria)
  timezone             = "Africa/Lagos"

  # Global Resources
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  # Additional Tags
  additional_tags = {
    BusinessUnit       = "UnifiedHealth-Africa"
    MarketSegment      = "West-Africa"
    RegulatoryBody     = "NITDA" # National Information Technology Development Agency
    DataClassification = "Sensitive"
    RegionalHub        = "ECOWAS" # Economic Community of West African States
  }

  depends_on = [
    module.africa
  ]
}

# ============================================
# Outputs
# ============================================

output "ng_infrastructure" {
  description = "Nigeria infrastructure details"
  value = {
    country_code        = module.country_ng.country_code
    subnet_id           = module.country_ng.subnet_id
    storage_account     = module.country_ng.storage_account_name
    isolation_level     = module.country_ng.isolation_level
    compliance          = module.country_ng.compliance_standards
  }
}
