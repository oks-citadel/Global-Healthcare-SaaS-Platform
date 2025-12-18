# ============================================
# Application Gateway Module Outputs
# ============================================

output "application_gateway_id" {
  description = "ID of the Application Gateway"
  value       = azurerm_application_gateway.main.id
}

output "application_gateway_name" {
  description = "Name of the Application Gateway"
  value       = azurerm_application_gateway.main.name
}

output "public_ip_address" {
  description = "Public IP address of the Application Gateway"
  value       = azurerm_public_ip.appgw.ip_address
}

output "public_ip_fqdn" {
  description = "FQDN of the Application Gateway public IP"
  value       = azurerm_public_ip.appgw.fqdn
}

output "backend_address_pool_id" {
  description = "ID of the backend address pool"
  value       = tolist(azurerm_application_gateway.main.backend_address_pool)[0].id
}

output "waf_policy_id" {
  description = "ID of the WAF policy"
  value       = azurerm_web_application_firewall_policy.appgw.id
}

output "subnet_id" {
  description = "ID of the Application Gateway subnet"
  value       = azurerm_subnet.appgw.id
}

output "identity_principal_id" {
  description = "Principal ID of the Application Gateway managed identity"
  value       = azurerm_user_assigned_identity.appgw.principal_id
}
