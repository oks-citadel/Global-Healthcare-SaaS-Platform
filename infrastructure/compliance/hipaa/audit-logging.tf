# HIPAA Audit Logging - 45 CFR § 164.312(b) - Audit Controls
# 7-year retention requirement for audit logs

# Log Analytics Workspace for HIPAA Audit Logs
resource "azurerm_log_analytics_workspace" "hipaa_audit" {
  name                = "${var.organization_name}-hipaa-audit-${var.environment}"
  location            = var.region
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 2555 # 7 years (2555 days) - HIPAA requirement

  # Prevent accidental deletion
  lifecycle {
    prevent_destroy = true
  }

  tags = merge(local.hipaa_tags, {
    Purpose        = "HIPAA-Audit-Logging"
    RetentionYears = "7"
  })
}

# Log Analytics Solutions for HIPAA
resource "azurerm_log_analytics_solution" "security_audit" {
  solution_name         = "Security"
  location              = var.region
  resource_group_name   = var.resource_group_name
  workspace_resource_id = azurerm_log_analytics_workspace.hipaa_audit.id
  workspace_name        = azurerm_log_analytics_workspace.hipaa_audit.name

  plan {
    publisher = "Microsoft"
    product   = "OMSGallery/Security"
  }

  tags = local.hipaa_tags
}

resource "azurerm_log_analytics_solution" "security_center" {
  solution_name         = "SecurityCenterFree"
  location              = var.region
  resource_group_name   = var.resource_group_name
  workspace_resource_id = azurerm_log_analytics_workspace.hipaa_audit.id
  workspace_name        = azurerm_log_analytics_workspace.hipaa_audit.name

  plan {
    publisher = "Microsoft"
    product   = "OMSGallery/SecurityCenterFree"
  }

  tags = local.hipaa_tags
}

# Storage Account for long-term audit log storage
resource "azurerm_storage_account" "hipaa_audit_storage" {
  name                     = "${var.organization_name}audit${var.environment}"
  resource_group_name      = var.resource_group_name
  location                 = var.region
  account_tier             = "Standard"
  account_replication_type = "GRS"
  account_kind             = "StorageV2"

  enable_https_traffic_only       = true
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = false

  # Infrastructure encryption
  infrastructure_encryption_enabled = true

  # Immutable storage for HIPAA compliance
  blob_properties {
    versioning_enabled       = true
    change_feed_enabled      = true
    last_access_time_enabled = true

    delete_retention_policy {
      days = 2555 # 7 years
    }

    container_delete_retention_policy {
      days = 2555
    }

    # Immutability policy for audit logs
    immutability_policy {
      period_since_creation_in_days = 2555
      state                         = "Unlocked" # Lock in production
    }
  }

  network_rules {
    default_action             = "Deny"
    bypass                     = ["AzureServices"]
    virtual_network_subnet_ids = [azurerm_subnet.healthcare_subnet.id]
  }

  # Prevent accidental deletion
  lifecycle {
    prevent_destroy = true
  }

  tags = merge(local.hipaa_tags, {
    Purpose           = "Audit-Log-Storage"
    ImmutableStorage  = "true"
    RetentionYears    = "7"
  })
}

# Container for audit logs
resource "azurerm_storage_container" "audit_logs" {
  name                  = "hipaa-audit-logs"
  storage_account_name  = azurerm_storage_account.hipaa_audit_storage.name
  container_access_type = "private"
}

# Container for access logs
resource "azurerm_storage_container" "access_logs" {
  name                  = "hipaa-access-logs"
  storage_account_name  = azurerm_storage_account.hipaa_audit_storage.name
  container_access_type = "private"
}

# Container for PHI access audit
resource "azurerm_storage_container" "phi_access_logs" {
  name                  = "phi-access-audit"
  storage_account_name  = azurerm_storage_account.hipaa_audit_storage.name
  container_access_type = "private"
}

# Event Hub for real-time audit log streaming
resource "azurerm_eventhub_namespace" "hipaa_audit_events" {
  name                = "${var.organization_name}-audit-events-${var.environment}"
  location            = var.region
  resource_group_name = var.resource_group_name
  sku                 = "Standard"
  capacity            = 2

  identity {
    type = "SystemAssigned"
  }

  network_rulesets {
    default_action = "Deny"

    virtual_network_rule {
      subnet_id = azurerm_subnet.healthcare_subnet.id
    }

    ip_rule {
      ip_mask = var.allowed_ip_ranges[0]
      action  = "Allow"
    }
  }

  tags = merge(local.hipaa_tags, {
    Purpose = "Real-Time-Audit-Streaming"
  })
}

# Event Hub for PHI access events
resource "azurerm_eventhub" "phi_access_events" {
  name                = "phi-access-events"
  namespace_name      = azurerm_eventhub_namespace.hipaa_audit_events.name
  resource_group_name = var.resource_group_name
  partition_count     = 4
  message_retention   = 7

  capture_description {
    enabled  = true
    encoding = "Avro"

    destination {
      name                = "EventHubArchive.AzureBlockBlob"
      archive_name_format = "{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}"
      blob_container_name = azurerm_storage_container.phi_access_logs.name
      storage_account_id  = azurerm_storage_account.hipaa_audit_storage.id
    }
  }
}

# Event Hub for audit events
resource "azurerm_eventhub" "audit_events" {
  name                = "audit-events"
  namespace_name      = azurerm_eventhub_namespace.hipaa_audit_events.name
  resource_group_name = var.resource_group_name
  partition_count     = 4
  message_retention   = 7

  capture_description {
    enabled  = true
    encoding = "Avro"

    destination {
      name                = "EventHubArchive.AzureBlockBlob"
      archive_name_format = "{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}"
      blob_container_name = azurerm_storage_container.audit_logs.name
      storage_account_id  = azurerm_storage_account.hipaa_audit_storage.id
    }
  }
}

# Diagnostic Settings for Activity Logs
resource "azurerm_monitor_diagnostic_setting" "subscription_diagnostics" {
  name                       = "hipaa-subscription-diagnostics"
  target_resource_id         = "/subscriptions/${data.azurerm_client_config.current.subscription_id}"
  log_analytics_workspace_id = azurerm_log_analytics_workspace.hipaa_audit.id
  storage_account_id         = azurerm_storage_account.hipaa_audit_storage.id
  eventhub_name              = azurerm_eventhub.audit_events.name
  eventhub_authorization_rule_id = "${azurerm_eventhub_namespace.hipaa_audit_events.id}/authorizationRules/RootManageSharedAccessKey"

  enabled_log {
    category = "Administrative"
  }

  enabled_log {
    category = "Security"
  }

  enabled_log {
    category = "ServiceHealth"
  }

  enabled_log {
    category = "Alert"
  }

  enabled_log {
    category = "Recommendation"
  }

  enabled_log {
    category = "Policy"
  }

  enabled_log {
    category = "Autoscale"
  }

  enabled_log {
    category = "ResourceHealth"
  }
}

# Action Group for HIPAA audit alerts
resource "azurerm_monitor_action_group" "hipaa_audit_alerts" {
  name                = "hipaa-audit-alerts-${var.environment}"
  resource_group_name = var.resource_group_name
  short_name          = "hipaaaudit"

  email_receiver {
    name                    = "security-team"
    email_address           = var.security_contact_email
    use_common_alert_schema = true
  }

  email_receiver {
    name                    = "compliance-team"
    email_address           = var.compliance_contact_email
    use_common_alert_schema = true
  }

  sms_receiver {
    name         = "oncall-sms"
    country_code = "1"
    phone_number = var.security_contact_phone
  }

  webhook_receiver {
    name        = "compliance-webhook"
    service_uri = var.compliance_webhook_uri
  }

  tags = local.hipaa_tags
}

# Alert Rule: Unauthorized PHI Access Attempt
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "unauthorized_phi_access" {
  name                = "unauthorized-phi-access-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.region

  evaluation_frequency = "PT5M"
  window_duration      = "PT5M"
  scopes               = [azurerm_log_analytics_workspace.hipaa_audit.id]
  severity             = 1

  criteria {
    query = <<-QUERY
      AuditLogs
      | where Category == "PHI-Access"
      | where ResultType == "Unauthorized"
      | where TimeGenerated > ago(5m)
      | summarize Count = count() by UserPrincipalName, IPAddress
      | where Count > 3
    QUERY

    time_aggregation_method = "Count"
    threshold               = 1
    operator                = "GreaterThan"

    failing_periods {
      minimum_failing_periods_to_trigger_alert = 1
      number_of_evaluation_periods             = 1
    }
  }

  action {
    action_groups = [azurerm_monitor_action_group.hipaa_audit_alerts.id]
  }

  description = "Alert when unauthorized PHI access attempts are detected"
  enabled     = true

  tags = merge(local.hipaa_tags, {
    AlertType = "Security"
    Priority  = "Critical"
  })
}

# Alert Rule: Bulk PHI Data Export
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "bulk_phi_export" {
  name                = "bulk-phi-export-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.region

  evaluation_frequency = "PT15M"
  window_duration      = "PT15M"
  scopes               = [azurerm_log_analytics_workspace.hipaa_audit.id]
  severity             = 1

  criteria {
    query = <<-QUERY
      AuditLogs
      | where Category == "PHI-Export"
      | where TimeGenerated > ago(15m)
      | summarize ExportCount = count(), RecordCount = sum(RecordCount) by UserPrincipalName
      | where RecordCount > 1000
    QUERY

    time_aggregation_method = "Count"
    threshold               = 1
    operator                = "GreaterThan"

    failing_periods {
      minimum_failing_periods_to_trigger_alert = 1
      number_of_evaluation_periods             = 1
    }
  }

  action {
    action_groups = [azurerm_monitor_action_group.hipaa_audit_alerts.id]
  }

  description = "Alert when bulk PHI data export is detected"
  enabled     = true

  tags = merge(local.hipaa_tags, {
    AlertType = "Data-Loss-Prevention"
    Priority  = "Critical"
  })
}

# Alert Rule: Failed Login Attempts
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "failed_login_attempts" {
  name                = "failed-login-attempts-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.region

  evaluation_frequency = "PT5M"
  window_duration      = "PT5M"
  scopes               = [azurerm_log_analytics_workspace.hipaa_audit.id]
  severity             = 2

  criteria {
    query = <<-QUERY
      SigninLogs
      | where ResultType != "0"
      | where TimeGenerated > ago(5m)
      | summarize FailedAttempts = count() by UserPrincipalName, IPAddress
      | where FailedAttempts > 5
    QUERY

    time_aggregation_method = "Count"
    threshold               = 1
    operator                = "GreaterThan"

    failing_periods {
      minimum_failing_periods_to_trigger_alert = 1
      number_of_evaluation_periods             = 1
    }
  }

  action {
    action_groups = [azurerm_monitor_action_group.hipaa_audit_alerts.id]
  }

  description = "Alert when multiple failed login attempts are detected"
  enabled     = true

  tags = merge(local.hipaa_tags, {
    AlertType = "Authentication"
    Priority  = "High"
  })
}

# Alert Rule: Privilege Escalation
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "privilege_escalation" {
  name                = "privilege-escalation-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.region

  evaluation_frequency = "PT5M"
  window_duration      = "PT5M"
  scopes               = [azurerm_log_analytics_workspace.hipaa_audit.id]
  severity             = 0

  criteria {
    query = <<-QUERY
      AuditLogs
      | where Category == "RoleManagement"
      | where ActivityDisplayName has "Add member to role"
      | where TargetResources has "Admin" or TargetResources has "Privileged"
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
    action_groups = [azurerm_monitor_action_group.hipaa_audit_alerts.id]
  }

  description = "Alert when privilege escalation is detected"
  enabled     = true

  tags = merge(local.hipaa_tags, {
    AlertType = "Authorization"
    Priority  = "Critical"
  })
}

# Data Collection Rule for custom logs
resource "azurerm_monitor_data_collection_rule" "hipaa_audit_dcr" {
  name                = "hipaa-audit-dcr-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.region

  destinations {
    log_analytics {
      workspace_resource_id = azurerm_log_analytics_workspace.hipaa_audit.id
      name                  = "hipaa-audit-destination"
    }
  }

  data_flow {
    streams      = ["Custom-PHI_Access_CL", "Custom-Audit_Events_CL"]
    destinations = ["hipaa-audit-destination"]
  }

  tags = local.hipaa_tags
}

# Variables
variable "compliance_contact_email" {
  description = "Compliance team contact email"
  type        = string
}

variable "compliance_webhook_uri" {
  description = "Webhook URI for compliance notifications"
  type        = string
  default     = ""
}

# Outputs
output "log_analytics_workspace_id" {
  description = "HIPAA audit Log Analytics workspace ID"
  value       = azurerm_log_analytics_workspace.hipaa_audit.id
}

output "audit_storage_account_id" {
  description = "HIPAA audit storage account ID"
  value       = azurerm_storage_account.hipaa_audit_storage.id
}

output "audit_eventhub_namespace_id" {
  description = "HIPAA audit Event Hub namespace ID"
  value       = azurerm_eventhub_namespace.hipaa_audit_events.id
}

output "phi_access_eventhub_name" {
  description = "PHI access Event Hub name"
  value       = azurerm_eventhub.phi_access_events.name
}

output "audit_action_group_id" {
  description = "HIPAA audit action group ID"
  value       = azurerm_monitor_action_group.hipaa_audit_alerts.id
}
