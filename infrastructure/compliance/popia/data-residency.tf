# POPIA Data Residency Enforcement
# Section 72 - Transborder flows of personal information

# Alert - Non-SA resource creation attempt
resource "azurerm_monitor_scheduled_query_rules_alert_v2" "non_sa_resource_alert" {
  name                = "non-sa-resource-creation-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.sa_region

  evaluation_frequency = "PT5M"
  window_duration      = "PT5M"
  scopes               = [azurerm_log_analytics_workspace.popia_audit.id]
  severity             = 0

  criteria {
    query = <<-QUERY
      AzureActivity
      | where OperationNameValue == "MICROSOFT.RESOURCES/DEPLOYMENTS/WRITE"
      | where Location !in ("southafricanorth", "southafricawest")
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
    action_groups = [azurerm_monitor_action_group.popia_alerts.id]
  }

  description = "Alert when resources are attempted to be created outside SA regions"
  enabled     = true

  tags = merge(local.popia_tags, {
    AlertType = "Data-Residency-Violation"
  })
}

# Action Group for POPIA alerts
resource "azurerm_monitor_action_group" "popia_alerts" {
  name                = "popia-alerts-${var.environment}"
  resource_group_name = var.resource_group_name
  short_name          = "popiaalert"

  email_receiver {
    name                    = "information-officer"
    email_address           = var.information_officer_email
    use_common_alert_schema = true
  }

  email_receiver {
    name                    = "legal-team"
    email_address           = var.legal_team_email
    use_common_alert_schema = true
  }

  tags = local.popia_tags
}

# Data residency configuration
resource "azurerm_app_configuration" "popia_config" {
  name                = "${var.organization_name}-popia-config-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.sa_region
  sku                 = "standard"

  identity {
    type = "SystemAssigned"
  }

  tags = local.popia_tags
}

resource "azurerm_app_configuration_key" "data_residency" {
  configuration_store_id = azurerm_app_configuration.popia_config.id
  key                    = "compliance:popia:data_residency"
  value                  = jsonencode({
    enforced                = true
    allowed_regions         = ["southafricanorth", "southafricawest"]
    primary_region          = "southafricanorth"
    failover_region         = "southafricawest"
    data_sovereignty        = "South-Africa"
    transborder_flow_allowed = false
  })
}

# Variables
variable "legal_team_email" {
  description = "Legal team email for POPIA alerts"
  type        = string
}

# Outputs
output "popia_config_endpoint" {
  description = "App Configuration endpoint for POPIA settings"
  value       = azurerm_app_configuration.popia_config.endpoint
}
