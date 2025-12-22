# ============================================
# United States Country Configuration
# ============================================
# Deploys country-specific infrastructure for the United States
# Region: Americas (East US)
# Compliance: HIPAA, SOC2, ISO27001
# Data Residency: Required
# Isolation: Standard (shared regional resources)

module "country_us" {
  source = "../modules/country"

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
  subnet_cidr = "10.10.48.0/24" # Country-specific subnet within regional VNet

  # Isolation & Compliance
  isolation_enabled        = false # Standard isolation - uses regional Key Vault
  data_residency_required  = true  # HIPAA requires data to stay in US
  compliance_tags          = ["HIPAA", "SOC2", "ISO27001", "FedRAMP"]

  # Dedicated Resources
  dedicated_node_pool = false # Uses shared regional node pools
  dedicated_database  = false # Uses shared regional PostgreSQL

  # Currency & Localization
  supported_currencies = ["USD"]
  primary_language     = "en-US"
  timezone             = "America/New_York"

  # Global Resources
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  # Additional Tags
  additional_tags = {
    BusinessUnit    = "UnifiedHealth-Americas"
    MarketSegment   = "North-America"
    RegulatoryBody  = "HHS-OCR"
    DataClassification = "PHI"
  }

  depends_on = [
    module.americas
  ]
}

# ============================================
# Outputs
# ============================================

output "us_infrastructure" {
  description = "United States infrastructure details"
  value = {
    country_code        = module.country_us.country_code
    subnet_id           = module.country_us.subnet_id
    storage_account     = module.country_us.storage_account_name
    isolation_level     = module.country_us.isolation_level
    compliance          = module.country_us.compliance_standards
  }
}
