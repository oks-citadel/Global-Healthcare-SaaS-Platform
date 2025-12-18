# ============================================
# Regional Module - Main Infrastructure
# ============================================
# Deploys AKS, PostgreSQL, Redis, and networking
# for a specific region with compliance controls

# ============================================
# Local Variables
# ============================================

locals {
  resource_suffix = "${var.region_name}-${var.environment}"

  common_tags = merge(
    {
      Project            = "UnifiedHealth"
      Environment        = var.environment
      Region             = var.region_name
      Location           = var.location
      ManagedBy          = "Terraform"
      CostCenter         = "Healthcare-Platform"
      DataResidency      = var.data_residency_required ? "Required" : "Optional"
      ComplianceStandards = join(",", var.compliance_standards)
    },
    var.additional_tags
  )
}

# ============================================
# Resource Group
# ============================================

resource "azurerm_resource_group" "region" {
  name     = "rg-${var.project_name}-${local.resource_suffix}"
  location = var.location
  tags     = local.common_tags
}

# ============================================
# Virtual Network
# ============================================

resource "azurerm_virtual_network" "region" {
  name                = "vnet-${var.project_name}-${local.resource_suffix}"
  location            = azurerm_resource_group.region.location
  resource_group_name = azurerm_resource_group.region.name
  address_space       = [var.vnet_address_space]
  tags                = local.common_tags
}

resource "azurerm_subnet" "aks" {
  name                 = "snet-aks"
  resource_group_name  = azurerm_resource_group.region.name
  virtual_network_name = azurerm_virtual_network.region.name
  address_prefixes     = [var.aks_subnet_prefix]
}

resource "azurerm_subnet" "database" {
  name                 = "snet-database"
  resource_group_name  = azurerm_resource_group.region.name
  virtual_network_name = azurerm_virtual_network.region.name
  address_prefixes     = [var.database_subnet_prefix]

  delegation {
    name = "postgresql-delegation"
    service_delegation {
      name    = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

resource "azurerm_subnet" "appgw" {
  name                 = "snet-appgw"
  resource_group_name  = azurerm_resource_group.region.name
  virtual_network_name = azurerm_virtual_network.region.name
  address_prefixes     = [var.appgw_subnet_prefix]
}

# ============================================
# Network Security Groups
# ============================================

resource "azurerm_network_security_group" "aks" {
  name                = "nsg-aks-${local.resource_suffix}"
  location            = azurerm_resource_group.region.location
  resource_group_name = azurerm_resource_group.region.name
  tags                = local.common_tags

  security_rule {
    name                       = "AllowAppGatewayInbound"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_ranges    = ["443", "80"]
    source_address_prefix      = var.appgw_subnet_prefix
    destination_address_prefix = var.aks_subnet_prefix
  }

  security_rule {
    name                       = "AllowKubeAPIInbound"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "AzureCloud"
    destination_address_prefix = var.aks_subnet_prefix
  }

  security_rule {
    name                       = "AllowInternalInbound"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = var.aks_subnet_prefix
    destination_address_prefix = var.aks_subnet_prefix
  }

  security_rule {
    name                       = "AllowAzureLoadBalancerInbound"
    priority                   = 130
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "AzureLoadBalancer"
    destination_address_prefix = "*"
  }

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

  security_rule {
    name                       = "AllowDatabaseOutbound"
    priority                   = 100
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "5432"
    source_address_prefix      = var.aks_subnet_prefix
    destination_address_prefix = var.database_subnet_prefix
  }

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

  security_rule {
    name                       = "AllowAzureOutbound"
    priority                   = 120
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "AzureCloud"
  }

  security_rule {
    name                       = "AllowInternetOutbound"
    priority                   = 130
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "Internet"
  }
}

resource "azurerm_subnet_network_security_group_association" "aks" {
  subnet_id                 = azurerm_subnet.aks.id
  network_security_group_id = azurerm_network_security_group.aks.id
}

resource "azurerm_network_security_group" "database" {
  name                = "nsg-database-${local.resource_suffix}"
  location            = azurerm_resource_group.region.location
  resource_group_name = azurerm_resource_group.region.name
  tags                = local.common_tags

  security_rule {
    name                       = "AllowAKSPostgreSQLInbound"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "5432"
    source_address_prefix      = var.aks_subnet_prefix
    destination_address_prefix = var.database_subnet_prefix
  }

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
}

resource "azurerm_subnet_network_security_group_association" "database" {
  subnet_id                 = azurerm_subnet.database.id
  network_security_group_id = azurerm_network_security_group.database.id
}

# ============================================
# VNet Peering (for cross-region connectivity)
# ============================================

resource "azurerm_virtual_network_peering" "outbound" {
  count = var.enable_vnet_peering ? length(var.peer_vnets) : 0

  name                      = "peer-${var.region_name}-to-${var.peer_vnets[count.index].name}"
  resource_group_name       = azurerm_resource_group.region.name
  virtual_network_name      = azurerm_virtual_network.region.name
  remote_virtual_network_id = var.peer_vnets[count.index].id

  allow_virtual_network_access = true
  allow_forwarded_traffic      = true
  allow_gateway_transit        = false
}

# ============================================
# Azure Kubernetes Service (AKS)
# ============================================

resource "azurerm_kubernetes_cluster" "region" {
  name                = "aks-${var.project_name}-${local.resource_suffix}"
  location            = azurerm_resource_group.region.location
  resource_group_name = azurerm_resource_group.region.name
  dns_prefix          = "${var.project_name}-${local.resource_suffix}"
  kubernetes_version  = var.kubernetes_version
  tags                = local.common_tags

  default_node_pool {
    name                = "system"
    node_count          = var.aks_system_node_count
    vm_size             = var.aks_system_node_size
    vnet_subnet_id      = azurerm_subnet.aks.id
    os_disk_size_gb     = 100
    type                = "VirtualMachineScaleSets"
    auto_scaling_enabled = true
    min_count           = var.aks_system_node_min
    max_count           = var.aks_system_node_max
    zones               = ["1", "2", "3"]

    node_labels = {
      "nodepool-type" = "system"
      "region"        = var.region_name
    }
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    network_policy    = "calico"
    load_balancer_sku = "standard"
    service_cidr      = "10.0.0.0/16"
    dns_service_ip    = "10.0.0.10"
  }

  oms_agent {
    log_analytics_workspace_id = var.global_log_analytics_workspace_id
  }

  key_vault_secrets_provider {
    secret_rotation_enabled = true
  }

  auto_scaler_profile {
    balance_similar_node_groups      = true
    expander                         = "random"
    max_graceful_termination_sec     = 600
    scale_down_delay_after_add       = "10m"
    scale_down_unneeded              = "10m"
    scale_down_utilization_threshold = 0.5
  }
}

# User node pool for workloads
resource "azurerm_kubernetes_cluster_node_pool" "user" {
  name                  = "user"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.region.id
  vm_size               = var.aks_user_node_size
  node_count            = var.aks_user_node_count
  vnet_subnet_id        = azurerm_subnet.aks.id
  auto_scaling_enabled  = true
  min_count             = var.aks_user_node_min
  max_count             = var.aks_user_node_max
  os_disk_size_gb       = 100
  zones                 = ["1", "2", "3"]

  node_labels = {
    "nodepool-type" = "user"
    "workload"      = "unified-health"
    "region"        = var.region_name
  }

  node_taints = [
    "workload=unified-health:NoSchedule"
  ]

  tags = local.common_tags
}

# ACR pull role for AKS
resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                = var.global_acr_id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.region.kubelet_identity[0].object_id
}

# ============================================
# Regional Key Vault (for regional secrets)
# ============================================

data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "region" {
  name                       = "kv-${var.project_name}-${var.location_short}-${var.environment}"
  location                   = azurerm_resource_group.region.location
  resource_group_name        = azurerm_resource_group.region.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "premium"
  soft_delete_retention_days = 90
  purge_protection_enabled   = true
  enable_rbac_authorization  = true
  tags                       = local.common_tags
}

# Key Vault access for AKS
resource "azurerm_role_assignment" "aks_keyvault_secrets" {
  scope                = azurerm_key_vault.region.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_kubernetes_cluster.region.key_vault_secrets_provider[0].secret_identity[0].object_id
}

# ============================================
# PostgreSQL Flexible Server
# ============================================

resource "azurerm_private_dns_zone" "postgresql" {
  name                = "${var.project_name}-${local.resource_suffix}.postgres.database.azure.com"
  resource_group_name = azurerm_resource_group.region.name
  tags                = local.common_tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "postgresql" {
  name                  = "postgresql-vnet-link"
  private_dns_zone_name = azurerm_private_dns_zone.postgresql.name
  virtual_network_id    = azurerm_virtual_network.region.id
  resource_group_name   = azurerm_resource_group.region.name
}

resource "azurerm_postgresql_flexible_server" "region" {
  name                          = "psql-${var.project_name}-${local.resource_suffix}"
  resource_group_name           = azurerm_resource_group.region.name
  location                      = azurerm_resource_group.region.location
  version                       = "15"
  delegated_subnet_id           = azurerm_subnet.database.id
  private_dns_zone_id           = azurerm_private_dns_zone.postgresql.id
  public_network_access_enabled = false
  administrator_login           = var.postgresql_admin_username
  administrator_password        = var.postgresql_admin_password
  zone                          = "1"
  storage_mb                    = var.postgresql_storage_mb
  sku_name                      = var.postgresql_sku
  backup_retention_days         = 35
  geo_redundant_backup_enabled  = var.data_residency_required ? false : true
  tags                          = local.common_tags

  high_availability {
    mode                      = var.postgresql_high_availability ? "ZoneRedundant" : "Disabled"
    standby_availability_zone = var.postgresql_high_availability ? "2" : null
  }

  maintenance_window {
    day_of_week  = 0
    start_hour   = 2
    start_minute = 0
  }

  depends_on = [azurerm_private_dns_zone_virtual_network_link.postgresql]
}

resource "azurerm_postgresql_flexible_server_database" "unified_health" {
  name      = "unified_health"
  server_id = azurerm_postgresql_flexible_server.region.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

resource "azurerm_postgresql_flexible_server_configuration" "log_connections" {
  name      = "log_connections"
  server_id = azurerm_postgresql_flexible_server.region.id
  value     = "on"
}

resource "azurerm_postgresql_flexible_server_configuration" "log_disconnections" {
  name      = "log_disconnections"
  server_id = azurerm_postgresql_flexible_server.region.id
  value     = "on"
}

# ============================================
# Redis Cache
# ============================================

resource "azurerm_redis_cache" "region" {
  name                = "redis-${var.project_name}-${local.resource_suffix}"
  location            = azurerm_resource_group.region.location
  resource_group_name = azurerm_resource_group.region.name
  capacity            = var.redis_capacity
  family              = var.redis_family
  sku_name            = var.redis_sku
  non_ssl_port_enabled = false
  minimum_tls_version = "1.2"
  zones               = ["1", "2", "3"]
  tags                = local.common_tags

  redis_configuration {
    maxmemory_policy              = "allkeys-lru"
    rdb_backup_enabled            = true
    rdb_backup_frequency          = 60
    rdb_backup_max_snapshot_count = 1
  }
}

# ============================================
# Storage Account (for regional data)
# ============================================

resource "azurerm_storage_account" "region" {
  name                     = "st${replace(var.project_name, "-", "")}${var.location_short}${var.environment}"
  resource_group_name      = azurerm_resource_group.region.name
  location                 = azurerm_resource_group.region.location
  account_tier             = "Standard"
  account_replication_type = var.data_residency_required ? "ZRS" : "GRS"
  min_tls_version          = "TLS1_2"
  tags                     = local.common_tags

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
}

resource "azurerm_storage_container" "documents" {
  name                  = "documents"
  storage_account_name  = azurerm_storage_account.region.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "backups" {
  name                  = "backups"
  storage_account_name  = azurerm_storage_account.region.name
  container_access_type = "private"
}

# ============================================
# Application Insights
# ============================================

resource "azurerm_application_insights" "region" {
  name                = "appi-${var.project_name}-${local.resource_suffix}"
  location            = azurerm_resource_group.region.location
  resource_group_name = azurerm_resource_group.region.name
  workspace_id        = var.global_log_analytics_workspace_id
  application_type    = "web"
  retention_in_days   = 90
  tags                = local.common_tags
}

# ============================================
# Monitoring & Alerting
# ============================================

resource "azurerm_monitor_action_group" "critical" {
  name                = "ag-critical-${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.region.name
  short_name          = "critical"
  tags                = local.common_tags

  email_receiver {
    name          = "operations-team"
    email_address = var.alert_email_address
  }

  dynamic "webhook_receiver" {
    for_each = var.alert_webhook_url != "" ? [1] : []
    content {
      name        = "webhook-notifications"
      service_uri = var.alert_webhook_url
    }
  }
}

# AKS alerts
resource "azurerm_monitor_metric_alert" "aks_node_cpu" {
  name                = "aks-node-cpu-high-${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.region.name
  scopes              = [azurerm_kubernetes_cluster.region.id]
  description         = "Alert when AKS node CPU exceeds threshold"
  severity            = 2
  frequency           = "PT5M"
  window_size         = "PT15M"
  tags                = local.common_tags

  criteria {
    metric_namespace = "Microsoft.ContainerService/managedClusters"
    metric_name      = "node_cpu_usage_percentage"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }

  action {
    action_group_id = azurerm_monitor_action_group.critical.id
  }
}

resource "azurerm_monitor_metric_alert" "aks_node_memory" {
  name                = "aks-node-memory-high-${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.region.name
  scopes              = [azurerm_kubernetes_cluster.region.id]
  description         = "Alert when AKS node memory exceeds threshold"
  severity            = 2
  frequency           = "PT5M"
  window_size         = "PT15M"
  tags                = local.common_tags

  criteria {
    metric_namespace = "Microsoft.ContainerService/managedClusters"
    metric_name      = "node_memory_working_set_percentage"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }

  action {
    action_group_id = azurerm_monitor_action_group.critical.id
  }
}

# PostgreSQL alerts
resource "azurerm_monitor_metric_alert" "postgresql_cpu" {
  name                = "postgresql-cpu-high-${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.region.name
  scopes              = [azurerm_postgresql_flexible_server.region.id]
  description         = "Alert when PostgreSQL CPU exceeds threshold"
  severity            = 2
  frequency           = "PT5M"
  window_size         = "PT15M"
  tags                = local.common_tags

  criteria {
    metric_namespace = "Microsoft.DBforPostgreSQL/flexibleServers"
    metric_name      = "cpu_percent"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }

  action {
    action_group_id = azurerm_monitor_action_group.critical.id
  }
}

resource "azurerm_monitor_metric_alert" "postgresql_storage" {
  name                = "postgresql-storage-high-${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.region.name
  scopes              = [azurerm_postgresql_flexible_server.region.id]
  description         = "Alert when PostgreSQL storage exceeds threshold"
  severity            = 1
  frequency           = "PT5M"
  window_size         = "PT15M"
  tags                = local.common_tags

  criteria {
    metric_namespace = "Microsoft.DBforPostgreSQL/flexibleServers"
    metric_name      = "storage_percent"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 85
  }

  action {
    action_group_id = azurerm_monitor_action_group.critical.id
  }
}

# Redis alerts
resource "azurerm_monitor_metric_alert" "redis_cpu" {
  name                = "redis-cpu-high-${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.region.name
  scopes              = [azurerm_redis_cache.region.id]
  description         = "Alert when Redis CPU exceeds threshold"
  severity            = 2
  frequency           = "PT5M"
  window_size         = "PT15M"
  tags                = local.common_tags

  criteria {
    metric_namespace = "Microsoft.Cache/Redis"
    metric_name      = "percentProcessorTime"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }

  action {
    action_group_id = azurerm_monitor_action_group.critical.id
  }
}

# ============================================
# Diagnostic Settings
# ============================================

resource "azurerm_monitor_diagnostic_setting" "keyvault" {
  name                       = "keyvault-diagnostics"
  target_resource_id         = azurerm_key_vault.region.id
  log_analytics_workspace_id = var.global_log_analytics_workspace_id

  enabled_log {
    category = "AuditEvent"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

resource "azurerm_monitor_diagnostic_setting" "postgresql" {
  name                       = "postgresql-diagnostics"
  target_resource_id         = azurerm_postgresql_flexible_server.region.id
  log_analytics_workspace_id = var.global_log_analytics_workspace_id

  enabled_log {
    category = "PostgreSQLLogs"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

resource "azurerm_monitor_diagnostic_setting" "redis" {
  name                       = "redis-diagnostics"
  target_resource_id         = azurerm_redis_cache.region.id
  log_analytics_workspace_id = var.global_log_analytics_workspace_id

  enabled_log {
    category = "ConnectedClientList"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}
