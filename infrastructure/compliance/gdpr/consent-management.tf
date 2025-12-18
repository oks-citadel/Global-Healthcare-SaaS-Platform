# GDPR Consent Management - Article 6 & 7
# Lawful basis for processing and conditions for consent

# Consent Database Table
resource "azurerm_postgresql_flexible_server_database" "consent_db" {
  name      = "consent_management"
  server_id = azurerm_postgresql_flexible_server.gdpr_postgres.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# Consent Audit Log Storage
resource "azurerm_storage_container" "consent_audit_logs" {
  name                  = "consent-audit-logs"
  storage_account_name  = azurerm_storage_account.gdpr_storage.name
  container_access_type = "private"

  metadata = {
    purpose     = "GDPR Consent Audit Trail"
    retention   = "Indefinite"
    compliance  = "GDPR Article 7(1)"
  }
}

# Consent Version Storage
resource "azurerm_storage_container" "consent_versions" {
  name                  = "consent-versions"
  storage_account_name  = azurerm_storage_account.gdpr_storage.name
  container_access_type = "private"

  metadata = {
    purpose = "Historical consent form versions"
  }
}

# Event Hub for real-time consent events
resource "azurerm_eventhub_namespace" "consent_events" {
  name                = "${var.organization_name}-consent-events-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  sku                 = "Standard"
  capacity            = 2

  identity {
    type = "SystemAssigned"
  }

  network_rulesets {
    default_action = "Deny"

    virtual_network_rule {
      subnet_id = azurerm_subnet.eu_healthcare_subnet.id
    }

    ip_rule {
      ip_mask = var.eu_allowed_ip_ranges[0]
      action  = "Allow"
    }
  }

  tags = merge(local.gdpr_tags, {
    Purpose = "Consent-Event-Streaming"
  })
}

# Event Hub for consent granted events
resource "azurerm_eventhub" "consent_granted" {
  name                = "consent-granted"
  namespace_name      = azurerm_eventhub_namespace.consent_events.name
  resource_group_name = var.resource_group_name
  partition_count     = 4
  message_retention   = 7

  capture_description {
    enabled  = true
    encoding = "Avro"

    destination {
      name                = "EventHubArchive.AzureBlockBlob"
      archive_name_format = "{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}"
      blob_container_name = azurerm_storage_container.consent_audit_logs.name
      storage_account_id  = azurerm_storage_account.gdpr_storage.id
    }
  }
}

# Event Hub for consent withdrawn events
resource "azurerm_eventhub" "consent_withdrawn" {
  name                = "consent-withdrawn"
  namespace_name      = azurerm_eventhub_namespace.consent_events.name
  resource_group_name = var.resource_group_name
  partition_count     = 4
  message_retention   = 7

  capture_description {
    enabled  = true
    encoding = "Avro"

    destination {
      name                = "EventHubArchive.AzureBlockBlob"
      archive_name_format = "{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}"
      blob_container_name = azurerm_storage_container.consent_audit_logs.name
      storage_account_id  = azurerm_storage_account.gdpr_storage.id
    }
  }
}

# Event Hub for consent updated events
resource "azurerm_eventhub" "consent_updated" {
  name                = "consent-updated"
  namespace_name      = azurerm_eventhub_namespace.consent_events.name
  resource_group_name = var.resource_group_name
  partition_count     = 4
  message_retention   = 7

  capture_description {
    enabled  = true
    encoding = "Avro"

    destination {
      name                = "EventHubArchive.AzureBlockBlob"
      archive_name_format = "{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}"
      blob_container_name = azurerm_storage_container.consent_audit_logs.name
      storage_account_id  = azurerm_storage_account.gdpr_storage.id
    }
  }
}

# Azure Function for consent processing
resource "azurerm_service_plan" "consent_functions" {
  name                = "${var.organization_name}-consent-asp-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  os_type             = "Linux"
  sku_name            = "EP1" # Elastic Premium for VNet integration
}

resource "azurerm_linux_function_app" "consent_processor" {
  name                = "${var.organization_name}-consent-func-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  service_plan_id     = azurerm_service_plan.consent_functions.id

  storage_account_name       = azurerm_storage_account.gdpr_storage.name
  storage_account_access_key = azurerm_storage_account.gdpr_storage.primary_access_key

  site_config {
    application_stack {
      node_version = "18"
    }

    # VNet integration for security
    vnet_route_all_enabled = true

    # Security headers
    cors {
      allowed_origins = var.allowed_origins
    }

    # Minimum TLS version
    minimum_tls_version = "1.2"

    # Always on for production
    always_on = true
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"       = "node"
    "POSTGRES_CONNECTION_STRING"     = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.postgres_connection.id})"
    "CONSENT_EVENTHUB_CONNECTION"    = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.consent_eventhub_connection.id})"
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.consent_insights.instrumentation_key
    "CONSENT_RETENTION_YEARS"        = "10"
    "DPO_EMAIL"                      = var.dpo_email
    "GDPR_MODE"                      = "strict"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = merge(local.gdpr_tags, {
    Component = "Consent-Processing"
  })
}

# VNet integration for Function App
resource "azurerm_app_service_virtual_network_swift_connection" "consent_func_vnet" {
  app_service_id = azurerm_linux_function_app.consent_processor.id
  subnet_id      = azurerm_subnet.function_subnet.id
}

# Subnet for Function Apps
resource "azurerm_subnet" "function_subnet" {
  name                 = "function-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.gdpr_vnet.name
  address_prefixes     = ["10.1.3.0/24"]

  delegation {
    name = "function-delegation"

    service_delegation {
      name = "Microsoft.Web/serverFarms"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/action",
      ]
    }
  }

  service_endpoints = [
    "Microsoft.Storage",
    "Microsoft.Sql",
    "Microsoft.KeyVault"
  ]
}

# Application Insights for consent monitoring
resource "azurerm_application_insights" "consent_insights" {
  name                = "${var.organization_name}-consent-insights-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  application_type    = "web"
  workspace_id        = azurerm_log_analytics_workspace.gdpr_residency_monitoring.id

  tags = local.gdpr_tags
}

# Key Vault secrets for consent processing
resource "azurerm_key_vault_secret" "postgres_connection" {
  name         = "postgres-connection-string"
  value        = "postgresql://${var.postgres_admin_username}:${random_password.postgres_admin_password.result}@${azurerm_postgresql_flexible_server.gdpr_postgres.fqdn}:5432/consent_management?sslmode=require"
  key_vault_id = azurerm_key_vault.gdpr_kv.id

  tags = local.gdpr_tags
}

resource "azurerm_key_vault_secret" "consent_eventhub_connection" {
  name         = "consent-eventhub-connection"
  value        = azurerm_eventhub_namespace.consent_events.default_primary_connection_string
  key_vault_id = azurerm_key_vault.gdpr_kv.id

  tags = local.gdpr_tags
}

# Grant Function App access to Key Vault
resource "azurerm_key_vault_access_policy" "consent_func_kv_access" {
  key_vault_id = azurerm_key_vault.gdpr_kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_function_app.consent_processor.identity[0].principal_id

  secret_permissions = [
    "Get",
    "List"
  ]
}

# Alert - Consent withdrawal not processed
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "consent_withdrawal_delay" {
  name                = "consent-withdrawal-delay-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.eu_region

  evaluation_frequency = "PT5M"
  window_duration      = "PT15M"
  scopes               = [azurerm_application_insights.consent_insights.id]
  severity             = 1

  criteria {
    query = <<-QUERY
      customEvents
      | where name == "ConsentWithdrawn"
      | where customDimensions.processingStatus != "Completed"
      | where timestamp > ago(15m)
      | summarize count() by tostring(customDimensions.userId)
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

  description = "Alert when consent withdrawal is not processed within 15 minutes"
  enabled     = true

  tags = merge(local.gdpr_tags, {
    AlertType = "Consent-Processing"
    Priority  = "High"
  })
}

# Alert - Invalid consent detected
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "invalid_consent" {
  name                = "invalid-consent-detected-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.eu_region

  evaluation_frequency = "PT5M"
  window_duration      = "PT5M"
  scopes               = [azurerm_application_insights.consent_insights.id]
  severity             = 1

  criteria {
    query = <<-QUERY
      customEvents
      | where name == "ConsentValidationFailed"
      | where timestamp > ago(5m)
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

  description = "Alert when invalid consent is detected"
  enabled     = true

  tags = merge(local.gdpr_tags, {
    AlertType = "Consent-Validation"
    Priority  = "High"
  })
}

# Consent Management Configuration
resource "azurerm_app_configuration_key" "consent_config" {
  configuration_store_id = azurerm_app_configuration.gdpr_config.id
  key                    = "compliance:gdpr:consent_management"
  value                  = jsonencode({
    purposes = [
      {
        id          = "healthcare_services"
        name        = "Healthcare Services"
        description = "Processing health data to provide medical services"
        legal_basis = "consent"
        required    = true
        granular    = true
      },
      {
        id          = "analytics"
        name        = "Analytics and Research"
        description = "Anonymized data for healthcare research"
        legal_basis = "consent"
        required    = false
        granular    = true
      },
      {
        id          = "marketing"
        name        = "Marketing Communications"
        description = "Receive updates about new services"
        legal_basis = "consent"
        required    = false
        granular    = true
      },
      {
        id          = "third_party_sharing"
        name        = "Third Party Sharing"
        description = "Share data with partner healthcare providers"
        legal_basis = "consent"
        required    = false
        granular    = true
      }
    ]
    consent_requirements = {
      freely_given       = true
      specific           = true
      informed           = true
      unambiguous        = true
      withdrawable       = true
      granular           = true
      separate_from_tos  = true
      clear_language     = true
      no_bundled_consent = true
    }
    withdrawal_process = {
      easy_as_giving      = true
      immediate_effect    = true
      notification_sent   = true
      audit_trail         = true
      data_deletion_grace = "30_days"
    }
    proof_of_consent = {
      who_consented      = true
      when_consented     = true
      what_informed      = true
      how_consented      = true
      consent_version    = true
      ip_address         = true
      user_agent         = true
    }
    retention = {
      active_consent_indefinite = true
      withdrawn_consent_years   = 10
      audit_trail_years         = 10
    }
  })
}

# Variables
variable "allowed_origins" {
  description = "Allowed origins for CORS"
  type        = list(string)
  default     = []
}

# Outputs
output "consent_eventhub_namespace_id" {
  description = "Consent Event Hub namespace ID"
  value       = azurerm_eventhub_namespace.consent_events.id
}

output "consent_processor_function_id" {
  description = "Consent processor Function App ID"
  value       = azurerm_linux_function_app.consent_processor.id
}

output "consent_insights_instrumentation_key" {
  description = "Application Insights instrumentation key for consent"
  value       = azurerm_application_insights.consent_insights.instrumentation_key
  sensitive   = true
}

output "consent_database_name" {
  description = "Consent management database name"
  value       = azurerm_postgresql_flexible_server_database.consent_db.name
}
