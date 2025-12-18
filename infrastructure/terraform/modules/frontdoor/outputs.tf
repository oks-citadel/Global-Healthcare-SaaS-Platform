# ============================================
# Azure Front Door Module Outputs
# ============================================

output "frontdoor_profile_id" {
  description = "ID of the Front Door profile"
  value       = azurerm_cdn_frontdoor_profile.main.id
}

output "frontdoor_profile_name" {
  description = "Name of the Front Door profile"
  value       = azurerm_cdn_frontdoor_profile.main.name
}

output "frontdoor_endpoint_id" {
  description = "ID of the Front Door endpoint"
  value       = azurerm_cdn_frontdoor_endpoint.main.id
}

output "frontdoor_endpoint_hostname" {
  description = "Hostname of the Front Door endpoint"
  value       = azurerm_cdn_frontdoor_endpoint.main.host_name
}

output "waf_policy_id" {
  description = "ID of the WAF policy (if Premium tier)"
  value       = var.sku_name == "Premium_AzureFrontDoor" ? azurerm_cdn_frontdoor_firewall_policy.main[0].id : null
}

output "custom_domain_validation_tokens" {
  description = "Validation tokens for custom domains"
  value = {
    for key, domain in azurerm_cdn_frontdoor_custom_domain.main :
    key => domain.validation_token
  }
  sensitive = true
}

output "origin_group_id" {
  description = "ID of the origin group"
  value       = azurerm_cdn_frontdoor_origin_group.main.id
}
