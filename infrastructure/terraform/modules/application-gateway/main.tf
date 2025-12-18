# ============================================
# Azure Application Gateway Module
# ============================================
# Provides Layer 7 load balancing, SSL termination, and WAF
# Integrated with AKS for ingress traffic management

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.85.0"
    }
  }
}

# ============================================
# Subnet for Application Gateway
# ============================================

resource "azurerm_subnet" "appgw" {
  name                 = "snet-appgw-${var.environment}"
  resource_group_name  = var.resource_group_name
  virtual_network_name = var.virtual_network_name
  address_prefixes     = [var.appgw_subnet_prefix]
}

# ============================================
# Public IP for Application Gateway
# ============================================

resource "azurerm_public_ip" "appgw" {
  name                = "pip-appgw-${var.project_name}-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Static"
  sku                 = "Standard"
  zones               = var.availability_zones
  tags                = var.tags

  domain_name_label = "${var.project_name}-${var.environment}-appgw"
}

# ============================================
# User Assigned Identity for Application Gateway
# ============================================

resource "azurerm_user_assigned_identity" "appgw" {
  name                = "id-appgw-${var.project_name}-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags
}

# Grant access to Key Vault for SSL certificates
resource "azurerm_role_assignment" "appgw_keyvault_secrets" {
  scope                = var.key_vault_id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.appgw.principal_id
}

# ============================================
# Web Application Firewall Policy
# ============================================

resource "azurerm_web_application_firewall_policy" "appgw" {
  name                = "waf-appgw-${var.project_name}-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.location
  tags                = var.tags

  policy_settings {
    enabled                     = true
    mode                        = var.waf_mode # Detection or Prevention
    request_body_check          = true
    file_upload_limit_in_mb     = 100
    max_request_body_size_in_kb = 128
  }

  managed_rules {
    managed_rule_set {
      type    = "OWASP"
      version = "3.2"
    }

    managed_rule_set {
      type    = "Microsoft_BotManagerRuleSet"
      version = "1.0"
    }
  }

  custom_rules {
    name      = "RateLimitRule"
    priority  = 1
    rule_type = "RateLimitRule"
    action    = "Block"

    match_conditions {
      match_variables {
        variable_name = "RemoteAddr"
      }

      operator           = "IPMatch"
      negation_condition = false
      match_values       = ["0.0.0.0/0"]
    }

    rate_limit_duration_in_minutes = 1
    rate_limit_threshold           = var.rate_limit_threshold
  }

  # HIPAA compliance: Block access from known malicious IPs
  dynamic "custom_rules" {
    for_each = var.blocked_ip_ranges
    content {
      name      = "BlockIP-${custom_rules.key}"
      priority  = 100 + custom_rules.key
      rule_type = "MatchRule"
      action    = "Block"

      match_conditions {
        match_variables {
          variable_name = "RemoteAddr"
        }

        operator           = "IPMatch"
        negation_condition = false
        match_values       = [custom_rules.value]
      }
    }
  }
}

# ============================================
# Application Gateway
# ============================================

locals {
  backend_address_pool_name      = "${var.virtual_network_name}-beap"
  frontend_port_name             = "${var.virtual_network_name}-feport"
  frontend_ip_configuration_name = "${var.virtual_network_name}-feip"
  http_setting_name              = "${var.virtual_network_name}-be-htst"
  listener_name                  = "${var.virtual_network_name}-httplstn"
  request_routing_rule_name      = "${var.virtual_network_name}-rqrt"
  redirect_configuration_name    = "${var.virtual_network_name}-rdrcfg"
  probe_name                     = "${var.virtual_network_name}-probe"
}

resource "azurerm_application_gateway" "main" {
  name                = "appgw-${var.project_name}-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group_name
  zones               = var.availability_zones
  tags                = var.tags

  # WAF v2 SKU for enhanced security
  sku {
    name     = var.sku_name
    tier     = var.sku_tier
    capacity = var.capacity
  }

  # Enable autoscaling
  autoscale_configuration {
    min_capacity = var.min_capacity
    max_capacity = var.max_capacity
  }

  # Gateway IP configuration
  gateway_ip_configuration {
    name      = "appgw-ip-config"
    subnet_id = azurerm_subnet.appgw.id
  }

  # Frontend port for HTTP (redirect to HTTPS)
  frontend_port {
    name = "${local.frontend_port_name}-http"
    port = 80
  }

  # Frontend port for HTTPS
  frontend_port {
    name = "${local.frontend_port_name}-https"
    port = 443
  }

  # Frontend IP configuration
  frontend_ip_configuration {
    name                 = local.frontend_ip_configuration_name
    public_ip_address_id = azurerm_public_ip.appgw.id
  }

  # Backend address pool (AKS ingress)
  backend_address_pool {
    name  = local.backend_address_pool_name
    fqdns = var.backend_fqdns
  }

  # Backend HTTP settings
  backend_http_settings {
    name                                = local.http_setting_name
    cookie_based_affinity               = "Enabled"
    port                                = 443
    protocol                            = "Https"
    request_timeout                     = 60
    probe_name                          = local.probe_name
    pick_host_name_from_backend_address = true
  }

  # Health probe
  probe {
    name                                      = local.probe_name
    protocol                                  = "Https"
    path                                      = var.health_probe_path
    interval                                  = 30
    timeout                                   = 30
    unhealthy_threshold                       = 3
    pick_host_name_from_backend_http_settings = true

    match {
      status_code = ["200-399"]
    }
  }

  # HTTPS listener
  http_listener {
    name                           = "${local.listener_name}-https"
    frontend_ip_configuration_name = local.frontend_ip_configuration_name
    frontend_port_name             = "${local.frontend_port_name}-https"
    protocol                       = "Https"
    ssl_certificate_name           = var.ssl_certificate_name
    firewall_policy_id             = azurerm_web_application_firewall_policy.appgw.id
    require_sni                    = true
  }

  # HTTP listener (for redirect)
  http_listener {
    name                           = "${local.listener_name}-http"
    frontend_ip_configuration_name = local.frontend_ip_configuration_name
    frontend_port_name             = "${local.frontend_port_name}-http"
    protocol                       = "Http"
    firewall_policy_id             = azurerm_web_application_firewall_policy.appgw.id
  }

  # Request routing rule for HTTPS
  request_routing_rule {
    name                       = "${local.request_routing_rule_name}-https"
    rule_type                  = "Basic"
    http_listener_name         = "${local.listener_name}-https"
    backend_address_pool_name  = local.backend_address_pool_name
    backend_http_settings_name = local.http_setting_name
    priority                   = 100
  }

  # Redirect HTTP to HTTPS
  redirect_configuration {
    name                 = local.redirect_configuration_name
    redirect_type        = "Permanent"
    target_listener_name = "${local.listener_name}-https"
    include_path         = true
    include_query_string = true
  }

  # Request routing rule for HTTP redirect
  request_routing_rule {
    name                        = "${local.request_routing_rule_name}-http"
    rule_type                   = "Basic"
    http_listener_name          = "${local.listener_name}-http"
    redirect_configuration_name = local.redirect_configuration_name
    priority                    = 110
  }

  # SSL certificate from Key Vault
  ssl_certificate {
    name                = var.ssl_certificate_name
    key_vault_secret_id = var.ssl_certificate_key_vault_secret_id
  }

  # SSL policy - enforce TLS 1.2+
  ssl_policy {
    policy_type = "Predefined"
    policy_name = "AppGwSslPolicy20220101"
  }

  # Managed identity for Key Vault access
  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.appgw.id]
  }

  # Enable HTTP/2
  enable_http2 = true

  # WAF configuration
  firewall_policy_id = azurerm_web_application_firewall_policy.appgw.id

  # Force tunneling for outbound traffic (security)
  force_firewall_policy_association = true

  lifecycle {
    ignore_changes = [
      tags,
      backend_address_pool,
      backend_http_settings,
      http_listener,
      probe,
      request_routing_rule,
      url_path_map,
      redirect_configuration,
      ssl_certificate
    ]
  }
}

# ============================================
# Diagnostic Settings
# ============================================

resource "azurerm_monitor_diagnostic_setting" "appgw" {
  name                       = "appgw-diagnostics"
  target_resource_id         = azurerm_application_gateway.main.id
  log_analytics_workspace_id = var.log_analytics_workspace_id

  enabled_log {
    category = "ApplicationGatewayAccessLog"
  }

  enabled_log {
    category = "ApplicationGatewayPerformanceLog"
  }

  enabled_log {
    category = "ApplicationGatewayFirewallLog"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}
