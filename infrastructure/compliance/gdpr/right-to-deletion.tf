# GDPR Right to Deletion (Right to be Forgotten) - Article 17
# Automated data deletion workflow

# Azure Automation Account for deletion workflows
resource "azurerm_automation_account" "gdpr_automation" {
  name                = "${var.organization_name}-gdpr-auto-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  sku_name            = "Basic"

  identity {
    type = "SystemAssigned"
  }

  tags = merge(local.gdpr_tags, {
    Purpose = "GDPR-Right-to-Deletion"
  })
}

# Data Deletion Requests Storage
resource "azurerm_storage_queue" "deletion_requests" {
  name                 = "deletion-requests"
  storage_account_name = azurerm_storage_account.gdpr_storage.name

  metadata = {
    purpose     = "GDPR Article 17 deletion requests"
    sla         = "30_days"
    compliance  = "GDPR"
  }
}

# Deletion Audit Log
resource "azurerm_storage_table" "deletion_audit" {
  name                 = "deletionaudit"
  storage_account_name = azurerm_storage_account.gdpr_storage.name
}

# Deletion Status Tracking
resource "azurerm_storage_table" "deletion_status" {
  name                 = "deletionstatus"
  storage_account_name = azurerm_storage_account.gdpr_storage.name
}

# Event Hub for deletion events
resource "azurerm_eventhub" "deletion_events" {
  name                = "deletion-events"
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
      blob_container_name = azurerm_storage_container.dsr_requests.name
      storage_account_id  = azurerm_storage_account.gdpr_storage.id
    }
  }
}

# Function App for deletion processing
resource "azurerm_linux_function_app" "deletion_processor" {
  name                = "${var.organization_name}-deletion-func-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  service_plan_id     = azurerm_service_plan.consent_functions.id

  storage_account_name       = azurerm_storage_account.gdpr_storage.name
  storage_account_access_key = azurerm_storage_account.gdpr_storage.primary_access_key

  site_config {
    application_stack {
      node_version = "18"
    }

    vnet_route_all_enabled = true
    minimum_tls_version    = "1.2"
    always_on              = true

    application_insights_connection_string = azurerm_application_insights.deletion_insights.connection_string
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"    = "node"
    "POSTGRES_CONNECTION_STRING"  = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.postgres_connection.id})"
    "STORAGE_CONNECTION_STRING"   = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.storage_connection.id})"
    "DELETION_QUEUE_NAME"         = azurerm_storage_queue.deletion_requests.name
    "DELETION_GRACE_PERIOD_DAYS"  = "30"
    "DPO_EMAIL"                   = var.dpo_email
    "ENABLE_SOFT_DELETE"          = "true"
    "RETENTION_EXCEPTIONS"        = jsonencode([
      "legal_hold",
      "contractual_obligation",
      "legitimate_interest"
    ])
  }

  identity {
    type = "SystemAssigned"
  }

  tags = merge(local.gdpr_tags, {
    Component = "Deletion-Processing"
  })
}

# VNet integration for Deletion Function
resource "azurerm_app_service_virtual_network_swift_connection" "deletion_func_vnet" {
  app_service_id = azurerm_linux_function_app.deletion_processor.id
  subnet_id      = azurerm_subnet.function_subnet.id
}

# Application Insights for deletion monitoring
resource "azurerm_application_insights" "deletion_insights" {
  name                = "${var.organization_name}-deletion-insights-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  application_type    = "web"
  workspace_id        = azurerm_log_analytics_workspace.gdpr_residency_monitoring.id

  tags = local.gdpr_tags
}

# Key Vault secret for storage connection
resource "azurerm_key_vault_secret" "storage_connection" {
  name         = "storage-connection-string"
  value        = azurerm_storage_account.gdpr_storage.primary_connection_string
  key_vault_id = azurerm_key_vault.gdpr_kv.id

  tags = local.gdpr_tags
}

# Grant Deletion Function access to Key Vault
resource "azurerm_key_vault_access_policy" "deletion_func_kv_access" {
  key_vault_id = azurerm_key_vault.gdpr_kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_function_app.deletion_processor.identity[0].principal_id

  secret_permissions = [
    "Get",
    "List"
  ]
}

# Automation Runbook for scheduled deletion
resource "azurerm_automation_runbook" "process_deletions" {
  name                    = "Process-Deletion-Requests"
  location                = var.eu_region
  resource_group_name     = var.resource_group_name
  automation_account_name = azurerm_automation_account.gdpr_automation.name
  log_verbose             = true
  log_progress            = true
  runbook_type            = "PowerShell"

  content = file("${path.module}/runbooks/process-deletions.ps1")

  tags = local.gdpr_tags
}

# Schedule for deletion processing (daily)
resource "azurerm_automation_schedule" "daily_deletion" {
  name                    = "daily-deletion-processing"
  resource_group_name     = var.resource_group_name
  automation_account_name = azurerm_automation_account.gdpr_automation.name
  frequency               = "Day"
  interval                = 1
  start_time              = timeadd(timestamp(), "24h")
  description             = "Daily processing of GDPR deletion requests"
  timezone                = "Europe/Brussels"
}

# Link schedule to runbook
resource "azurerm_automation_job_schedule" "deletion_schedule" {
  resource_group_name     = var.resource_group_name
  automation_account_name = azurerm_automation_account.gdpr_automation.name
  schedule_name           = azurerm_automation_schedule.daily_deletion.name
  runbook_name            = azurerm_automation_runbook.process_deletions.name
}

# Alert - Deletion request not completed within SLA
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "deletion_sla_breach" {
  name                = "deletion-sla-breach-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.eu_region

  evaluation_frequency = "PT1H"
  window_duration      = "PT1H"
  scopes               = [azurerm_application_insights.deletion_insights.id]
  severity             = 1

  criteria {
    query = <<-QUERY
      customEvents
      | where name == "DeletionRequest"
      | where customDimensions.status == "Pending"
      | where timestamp < ago(30d)
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

  description = "Alert when deletion request is not completed within 30-day SLA"
  enabled     = true

  tags = merge(local.gdpr_tags, {
    AlertType = "SLA-Breach"
    Priority  = "High"
  })
}

# Alert - Deletion failure
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "deletion_failure" {
  name                = "deletion-failure-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.eu_region

  evaluation_frequency = "PT5M"
  window_duration      = "PT15M"
  scopes               = [azurerm_application_insights.deletion_insights.id]
  severity             = 1

  criteria {
    query = <<-QUERY
      customEvents
      | where name == "DeletionFailed"
      | where timestamp > ago(15m)
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

  description = "Alert when deletion processing fails"
  enabled     = true

  tags = merge(local.gdpr_tags, {
    AlertType = "Deletion-Failure"
    Priority  = "High"
  })
}

# Azure Policy - Prevent accidental deletion
resource "azurerm_management_lock" "prevent_deletion_data_loss" {
  name       = "prevent-deletion-data-loss"
  scope      = azurerm_storage_table.deletion_audit.id
  lock_level = "CanNotDelete"
  notes      = "Prevent accidental deletion of GDPR audit records"
}

# Data Retention Policy Configuration
resource "azurerm_app_configuration_key" "deletion_config" {
  configuration_store_id = azurerm_app_configuration.gdpr_config.id
  key                    = "compliance:gdpr:right_to_deletion"
  value                  = jsonencode({
    enabled = true
    sla_days = 30
    grace_period_days = 30
    verification_required = true
    dpo_approval_required = false

    deletion_scope = [
      "personal_data",
      "health_records",
      "consent_records",
      "audit_logs_with_pii",
      "backups",
      "cached_data",
      "third_party_data"
    ]

    retention_exceptions = {
      legal_obligation = {
        enabled = true
        max_retention_years = 7
        requires_documentation = true
      }

      legal_claims = {
        enabled = true
        retention_until = "claim_resolved"
        requires_legal_approval = true
      }

      public_health = {
        enabled = true
        legal_basis = "GDPR Article 9(2)(i)"
        requires_dpo_approval = true
      }

      archiving = {
        enabled = true
        legal_basis = "GDPR Article 17(3)(d)"
        pseudonymization_required = true
      }
    }

    deletion_process = {
      request_verification = true
      identity_confirmation = true
      impact_assessment = true
      multi_system_deletion = true
      third_party_notification = true
      backup_deletion = true
      confirmation_to_user = true
      audit_trail = true
    }

    soft_delete = {
      enabled = true
      retention_days = 30
      recoverable = true
      requires_admin_approval = true
    }

    data_subject_notification = {
      request_received = true
      processing_started = true
      deletion_completed = true
      any_exceptions = true
      timeline = "immediate"
    }
  })
}

# Deletion Workflow Status Dashboard
resource "azurerm_portal_dashboard" "deletion_dashboard" {
  name                = "${var.organization_name}-deletion-dashboard-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.eu_region

  dashboard_properties = jsonencode({
    lenses = [
      {
        order = 0
        parts = [
          {
            position = {
              x = 0
              y = 0
              colSpan = 6
              rowSpan = 4
            }
            metadata = {
              inputs = [
                {
                  name = "ComponentId"
                  value = azurerm_application_insights.deletion_insights.id
                }
              ]
              type = "Extension/AppInsightsExtension/PartType/AnalyticsGridPart"
            }
          }
        ]
      }
    ]
  })

  tags = local.gdpr_tags
}

# Outputs
output "deletion_queue_name" {
  description = "Deletion requests queue name"
  value       = azurerm_storage_queue.deletion_requests.name
}

output "deletion_processor_function_id" {
  description = "Deletion processor Function App ID"
  value       = azurerm_linux_function_app.deletion_processor.id
}

output "deletion_automation_account_id" {
  description = "Automation account ID for deletion workflows"
  value       = azurerm_automation_account.gdpr_automation.id
}

output "deletion_insights_instrumentation_key" {
  description = "Application Insights instrumentation key for deletion"
  value       = azurerm_application_insights.deletion_insights.instrumentation_key
  sensitive   = true
}
