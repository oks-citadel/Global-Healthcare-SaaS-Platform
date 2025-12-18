# ============================================
# UnifiedHealth Platform - Global Resources
# ============================================
# Shared resources across all regions:
# - Azure Front Door (Global CDN/WAF)
# - Global Container Registry with geo-replication
# - Global Key Vault
# - Global Log Analytics Workspace

# ============================================
# Global Resource Group
# ============================================

resource "azurerm_resource_group" "global" {
  name     = "rg-${var.project_name}-global"
  location = var.primary_location
  tags = merge(
    local.common_tags,
    {
      Scope = "Global"
    }
  )
}

# ============================================
# Global Log Analytics Workspace
# ============================================

resource "azurerm_log_analytics_workspace" "global" {
  name                = "log-${var.project_name}-global"
  location            = azurerm_resource_group.global.location
  resource_group_name = azurerm_resource_group.global.name
  sku                 = "PerGB2018"
  retention_in_days   = 90
  tags = merge(
    local.common_tags,
    {
      Scope = "Global"
    }
  )
}

# ============================================
# Global Azure Container Registry
# ============================================

resource "azurerm_container_registry" "global" {
  name                = "acr${replace(var.project_name, "-", "")}global"
  resource_group_name = azurerm_resource_group.global.name
  location            = azurerm_resource_group.global.location
  sku                 = "Premium"
  admin_enabled       = false
  tags = merge(
    local.common_tags,
    {
      Scope = "Global"
    }
  )

  # Geo-replication to all production regions
  georeplications {
    location                = "eastus"
    zone_redundancy_enabled = true
    tags = merge(
      local.common_tags,
      {
        Region = "Americas"
      }
    )
  }

  georeplications {
    location                = "westeurope"
    zone_redundancy_enabled = true
    tags = merge(
      local.common_tags,
      {
        Region = "Europe"
      }
    )
  }

  georeplications {
    location                = "southafricanorth"
    zone_redundancy_enabled = true
    tags = merge(
      local.common_tags,
      {
        Region = "Africa"
      }
    )
  }

  network_rule_set {
    default_action = "Deny"

    ip_rule {
      action   = "Allow"
      ip_range = "0.0.0.0/0" # Update with specific IPs in production
    }
  }
}

# ============================================
# Global Key Vault
# ============================================

resource "azurerm_key_vault" "global" {
  name                       = "kv-${var.project_name}-global"
  location                   = azurerm_resource_group.global.location
  resource_group_name        = azurerm_resource_group.global.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "premium"
  soft_delete_retention_days = 90
  purge_protection_enabled   = true
  enable_rbac_authorization  = true
  tags = merge(
    local.common_tags,
    {
      Scope = "Global"
    }
  )

  network_acls {
    default_action             = "Deny"
    bypass                     = "AzureServices"
    ip_rules                   = []
    virtual_network_subnet_ids = []
  }
}

# ============================================
# Azure Front Door
# ============================================

resource "azurerm_cdn_frontdoor_profile" "global" {
  name                = "afd-${var.project_name}"
  resource_group_name = azurerm_resource_group.global.name
  sku_name            = "Premium_AzureFrontDoor"
  tags = merge(
    local.common_tags,
    {
      Scope = "Global"
    }
  )
}

resource "azurerm_cdn_frontdoor_endpoint" "api" {
  name                     = "api-${var.project_name}"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.global.id
  tags = merge(
    local.common_tags,
    {
      Scope    = "Global"
      Type     = "API"
    }
  )
}

resource "azurerm_cdn_frontdoor_endpoint" "web" {
  name                     = "web-${var.project_name}"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.global.id
  tags = merge(
    local.common_tags,
    {
      Scope    = "Global"
      Type     = "Web"
    }
  )
}

# Front Door WAF Policy
resource "azurerm_cdn_frontdoor_firewall_policy" "global" {
  name                              = "waf${replace(var.project_name, "-", "")}"
  resource_group_name               = azurerm_resource_group.global.name
  sku_name                          = azurerm_cdn_frontdoor_profile.global.sku_name
  enabled                           = true
  mode                              = "Prevention"
  redirect_url                      = "https://www.unifiedhealth.com/blocked"
  custom_block_response_status_code = 403
  custom_block_response_body        = base64encode("Access denied by WAF policy")

  tags = merge(
    local.common_tags,
    {
      Scope = "Global"
    }
  )

  managed_rule {
    type    = "Microsoft_DefaultRuleSet"
    version = "2.1"
    action  = "Block"
  }

  managed_rule {
    type    = "Microsoft_BotManagerRuleSet"
    version = "1.0"
    action  = "Block"
  }
}

resource "azurerm_cdn_frontdoor_security_policy" "global" {
  name                     = "security-policy"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.global.id

  security_policies {
    firewall {
      cdn_frontdoor_firewall_policy_id = azurerm_cdn_frontdoor_firewall_policy.global.id

      association {
        domain {
          cdn_frontdoor_domain_id = azurerm_cdn_frontdoor_endpoint.api.id
        }
        domain {
          cdn_frontdoor_domain_id = azurerm_cdn_frontdoor_endpoint.web.id
        }
        patterns_to_match = ["/*"]
      }
    }
  }
}

# ============================================
# Azure Traffic Manager (DNS-based routing)
# ============================================

resource "azurerm_traffic_manager_profile" "global" {
  name                   = "tm-${var.project_name}"
  resource_group_name    = azurerm_resource_group.global.name
  traffic_routing_method = "Performance"

  dns_config {
    relative_name = var.project_name
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

  tags = merge(
    local.common_tags,
    {
      Scope = "Global"
    }
  )
}

# ============================================
# Global DNS Zone (if managing DNS)
# ============================================

resource "azurerm_dns_zone" "global" {
  count               = var.manage_dns ? 1 : 0
  name                = var.dns_zone_name
  resource_group_name = azurerm_resource_group.global.name
  tags = merge(
    local.common_tags,
    {
      Scope = "Global"
    }
  )
}

# ============================================
# Global Monitoring & Alerting
# ============================================

resource "azurerm_monitor_action_group" "global_critical" {
  name                = "ag-global-critical"
  resource_group_name = azurerm_resource_group.global.name
  short_name          = "globalcrit"
  tags = merge(
    local.common_tags,
    {
      Scope = "Global"
    }
  )

  email_receiver {
    name          = "global-operations"
    email_address = var.global_alert_email_address
  }

  dynamic "webhook_receiver" {
    for_each = var.global_alert_webhook_url != "" ? [1] : []
    content {
      name        = "global-webhook"
      service_uri = var.global_alert_webhook_url
    }
  }
}

# Front Door alerts
resource "azurerm_monitor_metric_alert" "frontdoor_health" {
  name                = "frontdoor-backend-health"
  resource_group_name = azurerm_resource_group.global.name
  scopes              = [azurerm_cdn_frontdoor_profile.global.id]
  description         = "Alert when Front Door backend health is degraded"
  severity            = 1
  frequency           = "PT1M"
  window_size         = "PT5M"
  tags = merge(
    local.common_tags,
    {
      Scope = "Global"
    }
  )

  criteria {
    metric_namespace = "Microsoft.Cdn/profiles"
    metric_name      = "Percentage4XX"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 10
  }

  action {
    action_group_id = azurerm_monitor_action_group.global_critical.id
  }
}

# ============================================
# Diagnostic Settings for Global Resources
# ============================================

resource "azurerm_monitor_diagnostic_setting" "global_keyvault" {
  name                       = "global-keyvault-diagnostics"
  target_resource_id         = azurerm_key_vault.global.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  enabled_log {
    category = "AuditEvent"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

resource "azurerm_monitor_diagnostic_setting" "global_acr" {
  name                       = "global-acr-diagnostics"
  target_resource_id         = azurerm_container_registry.global.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  enabled_log {
    category = "ContainerRegistryRepositoryEvents"
  }

  enabled_log {
    category = "ContainerRegistryLoginEvents"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

resource "azurerm_monitor_diagnostic_setting" "global_frontdoor" {
  name                       = "global-frontdoor-diagnostics"
  target_resource_id         = azurerm_cdn_frontdoor_profile.global.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.global.id

  enabled_log {
    category = "FrontDoorAccessLog"
  }

  enabled_log {
    category = "FrontDoorHealthProbeLog"
  }

  enabled_log {
    category = "FrontDoorWebApplicationFirewallLog"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}
