# ============================================
# UnifiedHealth Platform - Multi-Region Orchestration
# ============================================
# Orchestrates deployment across multiple regions:
# - Americas (East US)
# - Europe (West Europe)
# - Africa (South Africa North)
#
# Each region has full independence with:
# - Dedicated AKS cluster
# - Regional PostgreSQL database
# - Regional Redis cache
# - Regional storage
# - Data residency compliance

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.14.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 3.0.0"
    }
  }
}

provider "azurerm" {
  subscription_id                 = var.subscription_id
  resource_provider_registrations = "none"
  features {
    key_vault {
      purge_soft_delete_on_destroy = false
    }
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
}

provider "azuread" {}

# ============================================
# Local Variables
# ============================================

locals {
  common_tags = {
    Project     = "UnifiedHealth"
    Environment = var.environment
    ManagedBy   = "Terraform"
    CostCenter  = "Healthcare-Platform"
    Deployment  = "MultiRegion"
  }

  # Define regions
  regions = {
    americas = {
      enabled        = var.deploy_americas
      location       = "eastus"
      location_short = "eus"
      tfvars         = "environments/prod-americas.tfvars"
    }
    europe = {
      enabled        = var.deploy_europe
      location       = "westeurope"
      location_short = "weu"
      tfvars         = "environments/prod-europe.tfvars"
    }
    africa = {
      enabled        = var.deploy_africa
      location       = "southafricanorth"
      location_short = "san"
      tfvars         = "environments/prod-africa.tfvars"
    }
  }

  # Active regions
  active_regions = {
    for k, v in local.regions : k => v if v.enabled
  }
}

# ============================================
# Data Sources
# ============================================

data "azurerm_client_config" "current" {}

# ============================================
# Global Infrastructure
# ============================================
# Deployed first - provides shared resources

# Global resources are defined in global.tf

# ============================================
# Americas Region
# ============================================

module "americas" {
  source = "./modules/region"
  count  = var.deploy_americas ? 1 : 0

  # Basic Configuration
  project_name   = var.project_name
  environment    = var.environment
  region_name    = "americas"
  location       = "eastus"
  location_short = "eus"

  # Compliance & Data Residency
  compliance_standards    = ["HIPAA", "SOC2", "ISO27001"]
  data_residency_required = true
  supported_currencies    = ["USD", "CAD", "MXN"]

  # Network Configuration
  vnet_address_space     = "10.10.0.0/16"
  aks_subnet_prefix      = "10.10.0.0/20"
  database_subnet_prefix = "10.10.16.0/24"
  appgw_subnet_prefix    = "10.10.32.0/24"

  # AKS Configuration
  kubernetes_version    = var.kubernetes_version
  aks_system_node_count = 3
  aks_system_node_size  = "Standard_D4s_v3"
  aks_system_node_min   = 3
  aks_system_node_max   = 6
  aks_user_node_count   = 5
  aks_user_node_size    = "Standard_D8s_v3"
  aks_user_node_min     = 5
  aks_user_node_max     = 20

  # PostgreSQL Configuration
  postgresql_admin_username   = var.postgresql_admin_username
  postgresql_admin_password   = var.postgresql_admin_password
  postgresql_sku              = "GP_Standard_D4s_v3"
  postgresql_storage_mb       = 262144 # 256 GB
  postgresql_high_availability = true

  # Redis Configuration
  redis_capacity = 3
  redis_family   = "P"
  redis_sku      = "Premium"

  # Global Resources
  global_acr_id                     = azurerm_container_registry.global.id
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id
  global_keyvault_id                = azurerm_key_vault.global.id

  # Cross-Region Networking
  enable_vnet_peering = var.enable_cross_region_peering
  peer_vnets = var.enable_cross_region_peering ? concat(
    var.deploy_europe ? [{
      name                = module.europe[0].vnet_name
      id                  = module.europe[0].vnet_id
      resource_group_name = module.europe[0].resource_group_name
    }] : [],
    var.deploy_africa ? [{
      name                = module.africa[0].vnet_name
      id                  = module.africa[0].vnet_id
      resource_group_name = module.africa[0].resource_group_name
    }] : []
  ) : []

  # Monitoring
  alert_email_address = var.americas_alert_email_address
  alert_webhook_url   = var.alert_webhook_url

  # Additional Tags
  additional_tags = {
    Region         = "Americas"
    DataCenter     = "EastUS"
    ComplianceZone = "HIPAA-SOC2"
    BusinessUnit   = "UnifiedHealth-Americas"
  }

  depends_on = [
    azurerm_container_registry.global,
    azurerm_log_analytics_workspace.global
  ]
}

# ============================================
# Europe Region
# ============================================

module "europe" {
  source = "./modules/region"
  count  = var.deploy_europe ? 1 : 0

  # Basic Configuration
  project_name   = var.project_name
  environment    = var.environment
  region_name    = "europe"
  location       = "westeurope"
  location_short = "weu"

  # Compliance & Data Residency
  compliance_standards    = ["GDPR", "ISO27001", "SOC2"]
  data_residency_required = true
  supported_currencies    = ["EUR", "GBP", "CHF", "SEK", "NOK"]

  # Network Configuration
  vnet_address_space     = "10.20.0.0/16"
  aks_subnet_prefix      = "10.20.0.0/20"
  database_subnet_prefix = "10.20.16.0/24"
  appgw_subnet_prefix    = "10.20.32.0/24"

  # AKS Configuration
  kubernetes_version    = var.kubernetes_version
  aks_system_node_count = 3
  aks_system_node_size  = "Standard_D4s_v3"
  aks_system_node_min   = 3
  aks_system_node_max   = 6
  aks_user_node_count   = 5
  aks_user_node_size    = "Standard_D8s_v3"
  aks_user_node_min     = 5
  aks_user_node_max     = 20

  # PostgreSQL Configuration
  postgresql_admin_username   = var.postgresql_admin_username
  postgresql_admin_password   = var.postgresql_admin_password
  postgresql_sku              = "GP_Standard_D4s_v3"
  postgresql_storage_mb       = 262144 # 256 GB
  postgresql_high_availability = true

  # Redis Configuration
  redis_capacity = 3
  redis_family   = "P"
  redis_sku      = "Premium"

  # Global Resources
  global_acr_id                     = azurerm_container_registry.global.id
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id
  global_keyvault_id                = azurerm_key_vault.global.id

  # Cross-Region Networking
  enable_vnet_peering = var.enable_cross_region_peering
  peer_vnets = var.enable_cross_region_peering ? concat(
    var.deploy_americas ? [{
      name                = module.americas[0].vnet_name
      id                  = module.americas[0].vnet_id
      resource_group_name = module.americas[0].resource_group_name
    }] : [],
    var.deploy_africa ? [{
      name                = module.africa[0].vnet_name
      id                  = module.africa[0].vnet_id
      resource_group_name = module.africa[0].resource_group_name
    }] : []
  ) : []

  # Monitoring
  alert_email_address = var.europe_alert_email_address
  alert_webhook_url   = var.alert_webhook_url

  # Additional Tags
  additional_tags = {
    Region         = "Europe"
    DataCenter     = "WestEurope"
    ComplianceZone = "GDPR-ISO27001"
    BusinessUnit   = "UnifiedHealth-Europe"
  }

  depends_on = [
    azurerm_container_registry.global,
    azurerm_log_analytics_workspace.global
  ]
}

# ============================================
# Africa Region
# ============================================

module "africa" {
  source = "./modules/region"
  count  = var.deploy_africa ? 1 : 0

  # Basic Configuration
  project_name   = var.project_name
  environment    = var.environment
  region_name    = "africa"
  location       = "southafricanorth"
  location_short = "san"

  # Compliance & Data Residency
  compliance_standards    = ["POPIA", "ISO27001", "SOC2"]
  data_residency_required = true
  supported_currencies    = ["ZAR", "NGN", "KES", "EGP", "GHS"]

  # Network Configuration
  vnet_address_space     = "10.30.0.0/16"
  aks_subnet_prefix      = "10.30.0.0/20"
  database_subnet_prefix = "10.30.16.0/24"
  appgw_subnet_prefix    = "10.30.32.0/24"

  # AKS Configuration
  kubernetes_version    = var.kubernetes_version
  aks_system_node_count = 3
  aks_system_node_size  = "Standard_D4s_v3"
  aks_system_node_min   = 3
  aks_system_node_max   = 6
  aks_user_node_count   = 4
  aks_user_node_size    = "Standard_D8s_v3"
  aks_user_node_min     = 4
  aks_user_node_max     = 15

  # PostgreSQL Configuration
  postgresql_admin_username   = var.postgresql_admin_username
  postgresql_admin_password   = var.postgresql_admin_password
  postgresql_sku              = "GP_Standard_D4s_v3"
  postgresql_storage_mb       = 131072 # 128 GB
  postgresql_high_availability = true

  # Redis Configuration
  redis_capacity = 2
  redis_family   = "P"
  redis_sku      = "Premium"

  # Global Resources
  global_acr_id                     = azurerm_container_registry.global.id
  global_log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id
  global_keyvault_id                = azurerm_key_vault.global.id

  # Cross-Region Networking
  enable_vnet_peering = var.enable_cross_region_peering
  peer_vnets = var.enable_cross_region_peering ? concat(
    var.deploy_americas ? [{
      name                = module.americas[0].vnet_name
      id                  = module.americas[0].vnet_id
      resource_group_name = module.americas[0].resource_group_name
    }] : [],
    var.deploy_europe ? [{
      name                = module.europe[0].vnet_name
      id                  = module.europe[0].vnet_id
      resource_group_name = module.europe[0].resource_group_name
    }] : []
  ) : []

  # Monitoring
  alert_email_address = var.africa_alert_email_address
  alert_webhook_url   = var.alert_webhook_url

  # Additional Tags
  additional_tags = {
    Region         = "Africa"
    DataCenter     = "SouthAfricaNorth"
    ComplianceZone = "POPIA-ISO27001"
    BusinessUnit   = "UnifiedHealth-Africa"
  }

  depends_on = [
    azurerm_container_registry.global,
    azurerm_log_analytics_workspace.global
  ]
}

# ============================================
# Front Door Origin Groups & Routes
# ============================================

# Americas Origin Group
resource "azurerm_cdn_frontdoor_origin_group" "americas" {
  count                    = var.deploy_americas ? 1 : 0
  name                     = "og-americas"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.global.id

  load_balancing {
    additional_latency_in_milliseconds = 50
    sample_size                        = 4
    successful_samples_required        = 3
  }

  health_probe {
    interval_in_seconds = 30
    path                = "/health"
    protocol            = "Https"
    request_type        = "GET"
  }
}

# Europe Origin Group
resource "azurerm_cdn_frontdoor_origin_group" "europe" {
  count                    = var.deploy_europe ? 1 : 0
  name                     = "og-europe"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.global.id

  load_balancing {
    additional_latency_in_milliseconds = 50
    sample_size                        = 4
    successful_samples_required        = 3
  }

  health_probe {
    interval_in_seconds = 30
    path                = "/health"
    protocol            = "Https"
    request_type        = "GET"
  }
}

# Africa Origin Group
resource "azurerm_cdn_frontdoor_origin_group" "africa" {
  count                    = var.deploy_africa ? 1 : 0
  name                     = "og-africa"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.global.id

  load_balancing {
    additional_latency_in_milliseconds = 50
    sample_size                        = 4
    successful_samples_required        = 3
  }

  health_probe {
    interval_in_seconds = 30
    path                = "/health"
    protocol            = "Https"
    request_type        = "GET"
  }
}

# ============================================
# Traffic Manager Endpoints
# ============================================

# Americas Traffic Manager Endpoint
resource "azurerm_traffic_manager_azure_endpoint" "americas" {
  count              = var.deploy_americas ? 1 : 0
  name               = "endpoint-americas"
  profile_id         = azurerm_traffic_manager_profile.global.id
  target_resource_id = module.americas[0].aks_cluster_id
  weight             = 100
  priority           = 1
}

# Europe Traffic Manager Endpoint
resource "azurerm_traffic_manager_azure_endpoint" "europe" {
  count              = var.deploy_europe ? 1 : 0
  name               = "endpoint-europe"
  profile_id         = azurerm_traffic_manager_profile.global.id
  target_resource_id = module.europe[0].aks_cluster_id
  weight             = 100
  priority           = 2
}

# Africa Traffic Manager Endpoint
resource "azurerm_traffic_manager_azure_endpoint" "africa" {
  count              = var.deploy_africa ? 1 : 0
  name               = "endpoint-africa"
  profile_id         = azurerm_traffic_manager_profile.global.id
  target_resource_id = module.africa[0].aks_cluster_id
  weight             = 100
  priority           = 3
}
