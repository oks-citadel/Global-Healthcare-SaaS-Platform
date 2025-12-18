# ============================================
# Azure Front Door Module
# ============================================
# Provides global load balancing, CDN, WAF, and SSL offloading
# Optimized for multi-region deployments with health probes

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.85.0"
    }
  }
}

# ============================================
# Azure Front Door Profile (Standard/Premium)
# ============================================

resource "azurerm_cdn_frontdoor_profile" "main" {
  name                = "fd-${var.project_name}-${var.environment}"
  resource_group_name = var.resource_group_name
  sku_name            = var.sku_name # Standard_AzureFrontDoor or Premium_AzureFrontDoor
  tags                = var.tags

  response_timeout_seconds = var.response_timeout_seconds
}

# ============================================
# WAF Policy (Premium tier only)
# ============================================

resource "azurerm_cdn_frontdoor_firewall_policy" "main" {
  count = var.sku_name == "Premium_AzureFrontDoor" ? 1 : 0

  name                              = "waf${replace(var.project_name, "-", "")}${var.environment}"
  resource_group_name               = var.resource_group_name
  sku_name                          = var.sku_name
  enabled                           = true
  mode                              = var.waf_mode # Prevention or Detection
  redirect_url                      = var.waf_redirect_url
  custom_block_response_status_code = 403
  custom_block_response_body        = base64encode("Access denied by WAF policy")

  # OWASP Core Rule Set
  managed_rule {
    type    = "Microsoft_DefaultRuleSet"
    version = "2.1"
    action  = "Block"
  }

  # Bot protection rules
  managed_rule {
    type    = "Microsoft_BotManagerRuleSet"
    version = "1.0"
    action  = "Block"
  }

  tags = var.tags
}

# ============================================
# Front Door Endpoint
# ============================================

resource "azurerm_cdn_frontdoor_endpoint" "main" {
  name                     = "fde-${var.project_name}-${var.environment}"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
  tags                     = var.tags
}

# ============================================
# Origin Group
# ============================================

resource "azurerm_cdn_frontdoor_origin_group" "main" {
  name                     = "og-${var.project_name}-${var.environment}"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id

  load_balancing {
    sample_size                        = 4
    successful_samples_required        = 3
    additional_latency_in_milliseconds = 50
  }

  health_probe {
    protocol            = "Https"
    request_type        = "HEAD"
    interval_in_seconds = 120
    path                = var.health_probe_path
  }
}

# ============================================
# Origins (AKS Load Balancer)
# ============================================

resource "azurerm_cdn_frontdoor_origin" "main" {
  for_each = var.origins

  name                           = each.key
  cdn_frontdoor_origin_group_id  = azurerm_cdn_frontdoor_origin_group.main.id
  enabled                        = true
  host_name                      = each.value.host_name
  origin_host_header             = each.value.origin_host_header
  priority                       = each.value.priority
  weight                         = each.value.weight
  certificate_name_check_enabled = true
  http_port                      = 80
  https_port                     = 443

  private_link {
    request_message        = "Private link connection from Front Door"
    location               = each.value.location
    private_link_target_id = each.value.private_link_target_id
  }
}

# ============================================
# Custom Domain
# ============================================

resource "azurerm_cdn_frontdoor_custom_domain" "main" {
  for_each = var.custom_domains

  name                     = replace(each.key, ".", "-")
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
  host_name                = each.value.host_name

  tls {
    certificate_type    = each.value.certificate_type # ManagedCertificate or CustomerCertificate
    minimum_tls_version = "TLS12"
  }
}

# ============================================
# Routes
# ============================================

resource "azurerm_cdn_frontdoor_route" "main" {
  for_each = var.routes

  name                          = each.key
  cdn_frontdoor_endpoint_id     = azurerm_cdn_frontdoor_endpoint.main.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.main.id
  cdn_frontdoor_origin_ids      = [for origin_key in each.value.origin_keys : azurerm_cdn_frontdoor_origin.main[origin_key].id]
  enabled                       = true
  forwarding_protocol           = "HttpsOnly"
  https_redirect_enabled        = true
  patterns_to_match             = each.value.patterns_to_match
  supported_protocols           = ["Http", "Https"]

  cdn_frontdoor_custom_domain_ids = [
    for domain_key in each.value.custom_domain_keys :
    azurerm_cdn_frontdoor_custom_domain.main[domain_key].id
  ]

  link_to_default_domain = true

  cache {
    query_string_caching_behavior = each.value.query_string_caching_behavior
    compression_enabled           = true
    content_types_to_compress = [
      "application/javascript",
      "application/json",
      "application/xml",
      "text/css",
      "text/html",
      "text/javascript",
      "text/plain",
    ]
  }

  # Attach WAF policy if Premium tier
  cdn_frontdoor_rule_set_ids = var.sku_name == "Premium_AzureFrontDoor" ? [azurerm_cdn_frontdoor_rule_set.security[0].id] : []
}

# ============================================
# Rule Set for Security Headers
# ============================================

resource "azurerm_cdn_frontdoor_rule_set" "security" {
  count = var.sku_name == "Premium_AzureFrontDoor" ? 1 : 0

  name                     = "SecurityHeaders"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
}

resource "azurerm_cdn_frontdoor_rule" "security_headers" {
  count = var.sku_name == "Premium_AzureFrontDoor" ? 1 : 0

  name                      = "AddSecurityHeaders"
  cdn_frontdoor_rule_set_id = azurerm_cdn_frontdoor_rule_set.security[0].id
  order                     = 1
  behavior_on_match         = "Continue"

  actions {
    response_header_action {
      header_action = "Append"
      header_name   = "X-Content-Type-Options"
      value         = "nosniff"
    }

    response_header_action {
      header_action = "Append"
      header_name   = "X-Frame-Options"
      value         = "SAMEORIGIN"
    }

    response_header_action {
      header_action = "Append"
      header_name   = "X-XSS-Protection"
      value         = "1; mode=block"
    }

    response_header_action {
      header_action = "Append"
      header_name   = "Strict-Transport-Security"
      value         = "max-age=31536000; includeSubDomains"
    }

    response_header_action {
      header_action = "Append"
      header_name   = "Referrer-Policy"
      value         = "strict-origin-when-cross-origin"
    }

    response_header_action {
      header_action = "Append"
      header_name   = "Content-Security-Policy"
      value         = var.content_security_policy
    }
  }

  conditions {
    request_method_condition {
      match_values     = ["GET", "HEAD"]
      operator         = "Equal"
      negate_condition = false
    }
  }
}

# ============================================
# Security Association
# ============================================

resource "azurerm_cdn_frontdoor_security_policy" "main" {
  count = var.sku_name == "Premium_AzureFrontDoor" ? 1 : 0

  name                     = "security-policy"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id

  security_policies {
    firewall {
      cdn_frontdoor_firewall_policy_id = azurerm_cdn_frontdoor_firewall_policy.main[0].id

      association {
        domain {
          cdn_frontdoor_domain_id = azurerm_cdn_frontdoor_endpoint.main.id
        }

        dynamic "domain" {
          for_each = var.custom_domains
          content {
            cdn_frontdoor_domain_id = azurerm_cdn_frontdoor_custom_domain.main[domain.key].id
          }
        }

        patterns_to_match = ["/*"]
      }
    }
  }
}
