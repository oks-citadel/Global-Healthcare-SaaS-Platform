# ============================================
# Country Module - Main Infrastructure
# ============================================
# Deploys country-specific resources within a regional VNet
# Supports data isolation for countries with strict compliance requirements
#
# Architecture: Global → Region → Country
# - Country-specific subnet within regional VNet
# - Country-specific Network Security Group
# - Country-specific Key Vault (for data isolation)
# - Country-specific AKS node pool (optional)
# - Country-specific storage account (for data residency)

# ============================================
# Local Variables
# ============================================

locals {
  resource_suffix = "${var.country_code}-${var.region_id}-${var.environment}"

  # Determine resource naming based on isolation level
  name_prefix = var.isolation_enabled ? "${var.project_name}-${var.country_code}" : "${var.project_name}-${var.region_id}"

  common_tags = merge(
    {
      Project         = "UnifiedHealth"
      Environment     = var.environment
      Region          = var.region_id
      Country         = var.country_name
      CountryCode     = var.country_code
      ManagedBy       = "Terraform"
      CostCenter      = "Healthcare-Platform"
      DataResidency   = var.data_residency_required ? "Required" : "Optional"
      IsolationLevel  = var.isolation_enabled ? "High" : "Standard"
      Compliance      = join(",", var.compliance_tags)
    },
    var.additional_tags
  )
}

# ============================================
# Data Sources
# ============================================

data "azurerm_client_config" "current" {}

# Reference to regional VNet
data "azurerm_virtual_network" "region" {
  name                = var.regional_vnet_name
  resource_group_name = var.regional_resource_group_name
}

# Reference to regional AKS cluster
data "azurerm_kubernetes_cluster" "region" {
  name                = var.regional_aks_cluster_name
  resource_group_name = var.regional_resource_group_name
}

# ============================================
# Country-Specific Subnet
# ============================================

resource "azurerm_subnet" "country" {
  name                 = "snet-${var.country_code}-workloads"
  resource_group_name  = var.regional_resource_group_name
  virtual_network_name = var.regional_vnet_name
  address_prefixes     = [var.subnet_cidr]

  # Service endpoints for Azure services
  service_endpoints = [
    "Microsoft.Storage",
    "Microsoft.KeyVault",
    "Microsoft.Sql",
    "Microsoft.Web"
  ]
}

# ============================================
# Country-Specific Network Security Group
# ============================================

resource "azurerm_network_security_group" "country" {
  name                = "nsg-${var.country_code}-${var.region_id}"
  location            = var.location
  resource_group_name = var.regional_resource_group_name
  tags                = local.common_tags

  # Allow inbound from regional AKS subnet
  security_rule {
    name                       = "AllowRegionalAKSInbound"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_ranges    = ["443", "80", "8080"]
    source_address_prefix      = var.regional_aks_subnet_prefix
    destination_address_prefix = var.subnet_cidr
  }

  # Allow inbound from country subnet (internal communication)
  security_rule {
    name                       = "AllowCountryInternalInbound"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = var.subnet_cidr
    destination_address_prefix = var.subnet_cidr
  }

  # Allow Azure Load Balancer
  security_rule {
    name                       = "AllowAzureLoadBalancerInbound"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "AzureLoadBalancer"
    destination_address_prefix = "*"
  }

  # Deny all other inbound
  security_rule {
    name                       = "DenyAllInbound"
    priority                   = 4096
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  # Allow outbound to Azure services
  security_rule {
    name                       = "AllowAzureOutbound"
    priority                   = 100
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "AzureCloud"
  }

  # Allow outbound to VNet
  security_rule {
    name                       = "AllowVNetOutbound"
    priority                   = 110
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "VirtualNetwork"
  }

  # Allow outbound to Internet
  security_rule {
    name                       = "AllowInternetOutbound"
    priority                   = 120
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "Internet"
  }
}

resource "azurerm_subnet_network_security_group_association" "country" {
  subnet_id                 = azurerm_subnet.country.id
  network_security_group_id = azurerm_network_security_group.country.id
}

# ============================================
# Country-Specific Key Vault (for data isolation)
# ============================================
# Only created when isolation is enabled (e.g., Germany, Switzerland)

resource "azurerm_key_vault" "country" {
  count = var.isolation_enabled ? 1 : 0

  name                       = "kv-${var.country_code}-${var.location_short}-${var.environment}"
  location                   = var.location
  resource_group_name        = var.regional_resource_group_name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "premium"
  soft_delete_retention_days = 90
  purge_protection_enabled   = true
  enable_rbac_authorization  = true

  tags = merge(
    local.common_tags,
    {
      Purpose = "CountryIsolatedSecrets"
      Scope   = "Country"
    }
  )

  network_acls {
    default_action             = "Deny"
    bypass                     = "AzureServices"
    ip_rules                   = []
    virtual_network_subnet_ids = [azurerm_subnet.country.id]
  }
}

# Grant AKS access to country Key Vault
resource "azurerm_role_assignment" "aks_country_keyvault" {
  count = var.isolation_enabled ? 1 : 0

  scope                = azurerm_key_vault.country[0].id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = data.azurerm_kubernetes_cluster.region.key_vault_secrets_provider[0].secret_identity[0].object_id
}

# ============================================
# Country-Specific Storage Account
# ============================================
# For countries with strict data residency requirements

resource "azurerm_storage_account" "country" {
  count = var.data_residency_required ? 1 : 0

  name                     = "st${var.country_code}${var.location_short}${var.environment}"
  resource_group_name      = var.regional_resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "ZRS" # Zone-redundant within same location
  min_tls_version          = "TLS1_2"

  tags = merge(
    local.common_tags,
    {
      Purpose         = "CountryDataResidency"
      Scope           = "Country"
      DataSovereignty = "Enforced"
    }
  )

  blob_properties {
    versioning_enabled       = true
    change_feed_enabled      = true
    last_access_time_enabled = true

    delete_retention_policy {
      days = 30
    }

    container_delete_retention_policy {
      days = 30
    }
  }

  network_rules {
    default_action             = "Deny"
    bypass                     = ["AzureServices"]
    ip_rules                   = []
    virtual_network_subnet_ids = [azurerm_subnet.country.id]
  }
}

# Storage containers for country-specific data
resource "azurerm_storage_container" "country_documents" {
  count = var.data_residency_required ? 1 : 0

  name                  = "documents-${var.country_code}"
  storage_account_name  = azurerm_storage_account.country[0].name
  container_access_type = "private"
}

resource "azurerm_storage_container" "country_patient_data" {
  count = var.data_residency_required ? 1 : 0

  name                  = "patient-data-${var.country_code}"
  storage_account_name  = azurerm_storage_account.country[0].name
  container_access_type = "private"
}

resource "azurerm_storage_container" "country_backups" {
  count = var.data_residency_required ? 1 : 0

  name                  = "backups-${var.country_code}"
  storage_account_name  = azurerm_storage_account.country[0].name
  container_access_type = "private"
}

# Grant AKS managed identity access to country storage
resource "azurerm_role_assignment" "aks_country_storage_blob" {
  count = var.data_residency_required ? 1 : 0

  scope                = azurerm_storage_account.country[0].id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = data.azurerm_kubernetes_cluster.region.kubelet_identity[0].object_id
}

# ============================================
# Country-Specific AKS Node Pool (Optional)
# ============================================
# For isolated workloads requiring dedicated compute

resource "azurerm_kubernetes_cluster_node_pool" "country" {
  count = var.dedicated_node_pool ? 1 : 0

  name                  = var.country_code
  kubernetes_cluster_id = data.azurerm_kubernetes_cluster.region.id
  vm_size               = var.node_pool_vm_size
  node_count            = var.node_pool_count
  vnet_subnet_id        = azurerm_subnet.country.id
  auto_scaling_enabled  = var.node_pool_autoscaling
  min_count             = var.node_pool_autoscaling ? var.node_pool_min_count : null
  max_count             = var.node_pool_autoscaling ? var.node_pool_max_count : null
  os_disk_size_gb       = 128
  zones                 = var.availability_zones

  node_labels = {
    "country"       = var.country_code
    "region"        = var.region_id
    "isolation"     = var.isolation_enabled ? "high" : "standard"
    "compliance"    = join("-", var.compliance_tags)
    "nodepool-type" = "country-dedicated"
  }

  node_taints = var.isolation_enabled ? [
    "country=${var.country_code}:NoSchedule",
    "isolation=high:NoSchedule"
  ] : []

  tags = local.common_tags
}

# ============================================
# Country-Specific PostgreSQL Database (Optional)
# ============================================
# Only for countries requiring fully isolated database

resource "azurerm_subnet" "country_database" {
  count = var.dedicated_database ? 1 : 0

  name                 = "snet-${var.country_code}-database"
  resource_group_name  = var.regional_resource_group_name
  virtual_network_name = var.regional_vnet_name
  address_prefixes     = [var.database_subnet_cidr]

  delegation {
    name = "postgresql-delegation"
    service_delegation {
      name    = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }

  service_endpoints = ["Microsoft.Storage"]
}

resource "azurerm_private_dns_zone" "country_postgresql" {
  count = var.dedicated_database ? 1 : 0

  name                = "${var.country_code}-${var.environment}.postgres.database.azure.com"
  resource_group_name = var.regional_resource_group_name
  tags                = local.common_tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "country_postgresql" {
  count = var.dedicated_database ? 1 : 0

  name                  = "${var.country_code}-postgresql-vnet-link"
  private_dns_zone_name = azurerm_private_dns_zone.country_postgresql[0].name
  virtual_network_id    = data.azurerm_virtual_network.region.id
  resource_group_name   = var.regional_resource_group_name
}

resource "azurerm_postgresql_flexible_server" "country" {
  count = var.dedicated_database ? 1 : 0

  name                          = "psql-${var.country_code}-${var.location_short}-${var.environment}"
  resource_group_name           = var.regional_resource_group_name
  location                      = var.location
  version                       = "15"
  delegated_subnet_id           = azurerm_subnet.country_database[0].id
  private_dns_zone_id           = azurerm_private_dns_zone.country_postgresql[0].id
  public_network_access_enabled = false
  administrator_login           = var.postgresql_admin_username
  administrator_password        = var.postgresql_admin_password
  zone                          = "1"
  storage_mb                    = var.postgresql_storage_mb
  sku_name                      = var.postgresql_sku
  backup_retention_days         = 35
  geo_redundant_backup_enabled  = false # Data residency requirement

  tags = merge(
    local.common_tags,
    {
      Purpose         = "CountryDedicatedDatabase"
      DataSovereignty = "Enforced"
    }
  )

  high_availability {
    mode                      = "ZoneRedundant"
    standby_availability_zone = "2"
  }

  maintenance_window {
    day_of_week  = 0
    start_hour   = 2
    start_minute = 0
  }

  depends_on = [azurerm_private_dns_zone_virtual_network_link.country_postgresql]
}

resource "azurerm_postgresql_flexible_server_database" "country" {
  count = var.dedicated_database ? 1 : 0

  name      = "unified_health_${var.country_code}"
  server_id = azurerm_postgresql_flexible_server.country[0].id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

resource "azurerm_postgresql_flexible_server_configuration" "country_log_connections" {
  count = var.dedicated_database ? 1 : 0

  name      = "log_connections"
  server_id = azurerm_postgresql_flexible_server.country[0].id
  value     = "on"
}

resource "azurerm_postgresql_flexible_server_configuration" "country_log_disconnections" {
  count = var.dedicated_database ? 1 : 0

  name      = "log_disconnections"
  server_id = azurerm_postgresql_flexible_server.country[0].id
  value     = "on"
}

# ============================================
# Monitoring & Diagnostics
# ============================================

resource "azurerm_monitor_diagnostic_setting" "country_nsg" {
  name                       = "nsg-${var.country_code}-diagnostics"
  target_resource_id         = azurerm_network_security_group.country.id
  log_analytics_workspace_id = var.global_log_analytics_workspace_id

  enabled_log {
    category = "NetworkSecurityGroupEvent"
  }

  enabled_log {
    category = "NetworkSecurityGroupRuleCounter"
  }
}

resource "azurerm_monitor_diagnostic_setting" "country_keyvault" {
  count = var.isolation_enabled ? 1 : 0

  name                       = "kv-${var.country_code}-diagnostics"
  target_resource_id         = azurerm_key_vault.country[0].id
  log_analytics_workspace_id = var.global_log_analytics_workspace_id

  enabled_log {
    category = "AuditEvent"
  }

  enabled_log {
    category = "AzurePolicyEvaluationDetails"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

resource "azurerm_monitor_diagnostic_setting" "country_storage" {
  count = var.data_residency_required ? 1 : 0

  name                       = "st-${var.country_code}-diagnostics"
  target_resource_id         = azurerm_storage_account.country[0].id
  log_analytics_workspace_id = var.global_log_analytics_workspace_id

  metric {
    category = "Transaction"
    enabled  = true
  }

  metric {
    category = "Capacity"
    enabled  = true
  }
}

resource "azurerm_monitor_diagnostic_setting" "country_postgresql" {
  count = var.dedicated_database ? 1 : 0

  name                       = "psql-${var.country_code}-diagnostics"
  target_resource_id         = azurerm_postgresql_flexible_server.country[0].id
  log_analytics_workspace_id = var.global_log_analytics_workspace_id

  enabled_log {
    category = "PostgreSQLLogs"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}
