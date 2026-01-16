# GDPR Data Residency Enforcement
# Article 44-50 - Transfers of personal data to third countries or international organisations

# Azure Policy - Enforce EU region only
resource "azurerm_resource_group_policy_assignment" "eu_regions_only" {
  name                 = "eu-regions-only-${var.environment}"
  resource_group_id    = data.azurerm_resource_group.main.id
  policy_definition_id = azurerm_policy_definition.eu_residency_policy.id

  description  = "Enforce that all resources are created in EU regions only"
  display_name = "GDPR EU Data Residency Policy"

  metadata = jsonencode({
    category    = "GDPR Data Residency"
    version     = "1.0.0"
    compliance  = "GDPR Article 44-50"
  })
}

# Custom Policy Definition for EU Residency
resource "azurerm_policy_definition" "eu_residency_policy" {
  name         = "gdpr-eu-residency-policy"
  policy_type  = "Custom"
  mode         = "All"
  display_name = "GDPR EU Data Residency Enforcement"
  description  = "Denies resource creation outside EU regions for GDPR compliance"

  metadata = jsonencode({
    category = "GDPR Compliance"
  })

  policy_rule = jsonencode({
    if = {
      allOf = [
        {
          field = "location"
          notIn = [
            "westeurope",
            "northeurope",
            "francecentral",
            "francesouth",
            "germanywestcentral",
            "germanynorth",
            "norwayeast",
            "norwaywest",
            "switzerlandnorth",
            "switzerlandwest",
            "uksouth",
            "ukwest"
          ]
        },
        {
          field = "type"
          notEquals = "Microsoft.Resources/resourceGroups"
        }
      ]
    }
    then = {
      effect = "deny"
    }
  })
}

# Storage Account - Disable cross-region replication outside EU
resource "azurerm_storage_account_network_rules" "eu_only_access" {
  storage_account_id = azurerm_storage_account.gdpr_storage.id

  default_action = "Deny"
  bypass         = ["AzureServices"]

  # Only allow EU IP ranges
  ip_rules = var.eu_allowed_ip_ranges

  virtual_network_subnet_ids = [
    azurerm_subnet.eu_healthcare_subnet.id
  ]

  # Prevent data exfiltration
  private_link_access {
    endpoint_resource_id = azurerm_private_endpoint.storage_pe.id
  }
}

# Private Endpoint for Storage (EU-only access)
resource "azurerm_private_endpoint" "storage_pe" {
  name                = "${var.organization_name}-storage-pe-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  subnet_id           = azurerm_subnet.eu_healthcare_subnet.id

  private_service_connection {
    name                           = "storage-privateserviceconnection"
    private_connection_resource_id = azurerm_storage_account.gdpr_storage.id
    subresource_names              = ["blob"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "storage-dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.storage_dns.id]
  }

  tags = local.gdpr_tags
}

# Private DNS Zone for Storage
resource "azurerm_private_dns_zone" "storage_dns" {
  name                = "privatelink.blob.core.windows.net"
  resource_group_name = var.resource_group_name

  tags = local.gdpr_tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "storage_dns_link" {
  name                  = "storage-dns-link"
  resource_group_name   = var.resource_group_name
  private_dns_zone_name = azurerm_private_dns_zone.storage_dns.name
  virtual_network_id    = azurerm_virtual_network.gdpr_vnet.id

  tags = local.gdpr_tags
}

# Azure Monitor - Track data movement outside EU
resource "azurerm_log_analytics_workspace" "gdpr_residency_monitoring" {
  name                = "${var.organization_name}-gdpr-residency-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 730 # 2 years retention

  tags = local.gdpr_tags
}

# Alert - Non-EU resource creation attempt
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "non_eu_resource_alert" {
  name                = "non-eu-resource-creation-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.eu_region

  evaluation_frequency = "PT5M"
  window_duration      = "PT5M"
  scopes               = [azurerm_log_analytics_workspace.gdpr_residency_monitoring.id]
  severity             = 0 # Critical

  criteria {
    query = <<-QUERY
      AzureActivity
      | where OperationNameValue == "MICROSOFT.RESOURCES/DEPLOYMENTS/WRITE"
      | where Location !in ("westeurope", "northeurope", "francecentral", "germanywestcentral", "norwayeast", "switzerlandnorth", "uksouth", "ukwest")
      | where TimeGenerated > ago(5m)
    QUERY

    time_aggregation_method = "Count"
    threshold               = 0
    operator                = "GreaterThan"

    failing_periods {
      minimum_failing_periods_to_trigger_alert = 1
      number_of_evaluation_periods             = 1
    }
  }

  action {
    action_groups = [azurerm_monitor_action_group.gdpr_alerts.id]
  }

  description = "Alert when resources are attempted to be created outside EU regions"
  enabled     = true

  tags = merge(local.gdpr_tags, {
    AlertType = "Data-Residency-Violation"
  })
}

# Alert - Data export outside EU
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "data_export_alert" {
  name                = "data-export-outside-eu-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.eu_region

  evaluation_frequency = "PT5M"
  window_duration      = "PT15M"
  scopes               = [azurerm_log_analytics_workspace.gdpr_residency_monitoring.id]
  severity             = 0 # Critical

  criteria {
    query = <<-QUERY
      StorageBlobLogs
      | where OperationName == "GetBlob" or OperationName == "ListBlobs"
      | where CallerIpAddress !startswith "10."
      | extend GeoInfo = geo_info_from_ip_address(CallerIpAddress)
      | where GeoInfo.country !in ("AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB")
      | where TimeGenerated > ago(15m)
    QUERY

    time_aggregation_method = "Count"
    threshold               = 0
    operator                = "GreaterThan"

    failing_periods {
      minimum_failing_periods_to_trigger_alert = 1
      number_of_evaluation_periods             = 1
    }
  }

  action {
    action_groups = [azurerm_monitor_action_group.gdpr_alerts.id]
  }

  description = "Alert when data is accessed from outside EU"
  enabled     = true

  tags = merge(local.gdpr_tags, {
    AlertType = "Data-Transfer-Violation"
  })
}

# Action Group for GDPR alerts
resource "azurerm_monitor_action_group" "gdpr_alerts" {
  name                = "gdpr-alerts-${var.environment}"
  resource_group_name = var.resource_group_name
  short_name          = "gdpralert"

  email_receiver {
    name                    = "dpo-team"
    email_address           = var.dpo_email
    use_common_alert_schema = true
  }

  email_receiver {
    name                    = "legal-team"
    email_address           = var.legal_team_email
    use_common_alert_schema = true
  }

  webhook_receiver {
    name        = "compliance-webhook"
    service_uri = var.compliance_webhook_uri
  }

  tags = local.gdpr_tags
}

# Traffic Manager Profile for EU-only routing
resource "azurerm_traffic_manager_profile" "eu_only" {
  name                   = "${var.organization_name}-gdpr-tm-${var.environment}"
  resource_group_name    = var.resource_group_name
  traffic_routing_method = "Geographic"

  dns_config {
    relative_name = "${var.organization_name}-gdpr-${var.environment}"
    ttl           = 60
  }

  monitor_config {
    protocol                     = "HTTPS"
    port                         = 443
    path                         = "/health"
    interval_in_seconds          = 30
    timeout_in_seconds           = 10
    tolerated_number_of_failures = 3
  }

  tags = local.gdpr_tags
}

# Traffic Manager Endpoint - West Europe
resource "azurerm_traffic_manager_azure_endpoint" "west_europe" {
  name               = "west-europe-endpoint"
  profile_id         = azurerm_traffic_manager_profile.eu_only.id
  target_resource_id = azurerm_public_ip.west_europe_pip.id
  weight             = 100

  geo_mappings = [
    "WORLD" # But will be filtered by Front Door geo-filtering
  ]
}

# Public IP for West Europe endpoint
resource "azurerm_public_ip" "west_europe_pip" {
  name                = "${var.organization_name}-westeu-pip-${var.environment}"
  location            = "westeurope"
  resource_group_name = var.resource_group_name
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = local.gdpr_tags
}

# Data Processing Register (GDPR Article 30)
resource "azurerm_storage_table" "processing_register" {
  name                 = "processingregister"
  storage_account_name = azurerm_storage_account.gdpr_storage.name
}

# Transfer Impact Assessment (TIA) Records
resource "azurerm_storage_table" "transfer_assessments" {
  name                 = "transferassessments"
  storage_account_name = azurerm_storage_account.gdpr_storage.name
}

# Standard Contractual Clauses (SCC) Storage
resource "azurerm_storage_container" "scc_documents" {
  name                  = "standard-contractual-clauses"
  storage_account_name  = azurerm_storage_account.gdpr_storage.name
  container_access_type = "private"
}

# Data Localization Configuration
resource "azurerm_app_configuration" "gdpr_config" {
  name                = "${var.organization_name}-gdpr-config-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.eu_region
  sku                 = "standard"

  identity {
    type = "SystemAssigned"
  }

  tags = local.gdpr_tags
}

# Data residency configuration
resource "azurerm_app_configuration_key" "data_residency" {
  configuration_store_id = azurerm_app_configuration.gdpr_config.id
  key                    = "compliance:gdpr:data_residency"
  value                  = jsonencode({
    enforced           = true
    allowed_regions    = ["westeurope", "northeurope", "francecentral", "germanywestcentral"]
    primary_region     = "westeurope"
    failover_region    = "northeurope"
    backup_regions     = ["francecentral"]
    data_sovereignty   = "EU"
    schrems_ii_compliant = true
  })
}

# Cross-border transfer rules
resource "azurerm_app_configuration_key" "cross_border_transfers" {
  configuration_store_id = azurerm_app_configuration.gdpr_config.id
  key                    = "compliance:gdpr:cross_border_transfers"
  value                  = jsonencode({
    enabled                    = false
    require_scc                = true
    require_tia                = true
    require_dpo_approval       = true
    allowed_countries          = []
    adequacy_decisions         = []
    additional_safeguards      = ["encryption", "anonymization", "pseudonymization"]
  })
}

# Backup configuration with EU residency
resource "azurerm_backup_policy_vm" "gdpr_backup" {
  name                = "gdpr-backup-policy-${var.environment}"
  resource_group_name = var.resource_group_name
  recovery_vault_name = azurerm_recovery_services_vault.gdpr_vault.name

  backup {
    frequency = "Daily"
    time      = "23:00"
  }

  retention_daily {
    count = 30
  }

  retention_weekly {
    count    = 12
    weekdays = ["Sunday"]
  }

  retention_monthly {
    count    = 12
    weekdays = ["Sunday"]
    weeks    = ["First"]
  }

  retention_yearly {
    count    = 7
    weekdays = ["Sunday"]
    weeks    = ["First"]
    months   = ["January"]
  }
}

# Recovery Services Vault (EU-only)
resource "azurerm_recovery_services_vault" "gdpr_vault" {
  name                = "${var.organization_name}-gdpr-vault-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  sku                 = "Standard"

  soft_delete_enabled = true

  tags = local.gdpr_tags
}

# Site Recovery for EU-only failover
resource "azurerm_site_recovery_replication_policy" "eu_replication" {
  name                                                 = "eu-replication-policy"
  resource_group_name                                  = var.resource_group_name
  recovery_vault_name                                  = azurerm_recovery_services_vault.gdpr_vault.name
  recovery_point_retention_in_minutes                  = 24 * 60
  application_consistent_snapshot_frequency_in_minutes = 4 * 60
}

# Variables
variable "legal_team_email" {
  description = "Legal team email for GDPR alerts"
  type        = string
}

variable "compliance_webhook_uri" {
  description = "Webhook URI for compliance notifications"
  type        = string
  default     = ""
}

# Outputs
output "residency_monitoring_workspace_id" {
  description = "GDPR residency monitoring workspace ID"
  value       = azurerm_log_analytics_workspace.gdpr_residency_monitoring.id
}

output "traffic_manager_fqdn" {
  description = "Traffic Manager FQDN for EU-only routing"
  value       = azurerm_traffic_manager_profile.eu_only.fqdn
}

output "app_configuration_endpoint" {
  description = "App Configuration endpoint for GDPR settings"
  value       = azurerm_app_configuration.gdpr_config.endpoint
}

output "recovery_vault_id" {
  description = "Recovery Services Vault ID"
  value       = azurerm_recovery_services_vault.gdpr_vault.id
}
