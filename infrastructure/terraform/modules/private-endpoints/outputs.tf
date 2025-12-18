# ============================================
# Private Endpoints Module Outputs
# ============================================

output "private_endpoint_subnet_id" {
  description = "ID of the private endpoints subnet"
  value       = azurerm_subnet.private_endpoints.id
}

output "keyvault_private_endpoint_id" {
  description = "ID of the Key Vault private endpoint"
  value       = var.create_keyvault_private_endpoint ? azurerm_private_endpoint.keyvault[0].id : null
}

output "storage_blob_private_endpoint_id" {
  description = "ID of the Storage Account (blob) private endpoint"
  value       = var.create_storage_private_endpoint ? azurerm_private_endpoint.storage_blob[0].id : null
}

output "storage_file_private_endpoint_id" {
  description = "ID of the Storage Account (file) private endpoint"
  value       = var.create_storage_private_endpoint ? azurerm_private_endpoint.storage_file[0].id : null
}

output "redis_private_endpoint_id" {
  description = "ID of the Redis Cache private endpoint"
  value       = var.create_redis_private_endpoint ? azurerm_private_endpoint.redis[0].id : null
}

output "acr_private_endpoint_id" {
  description = "ID of the Container Registry private endpoint"
  value       = var.create_acr_private_endpoint ? azurerm_private_endpoint.acr[0].id : null
}

output "private_dns_zones" {
  description = "Map of private DNS zone names and IDs"
  value = {
    keyvault     = var.create_keyvault_private_endpoint ? azurerm_private_dns_zone.keyvault[0].id : null
    storage_blob = var.create_storage_private_endpoint ? azurerm_private_dns_zone.storage_blob[0].id : null
    storage_file = var.create_storage_private_endpoint ? azurerm_private_dns_zone.storage_file[0].id : null
    redis        = var.create_redis_private_endpoint ? azurerm_private_dns_zone.redis[0].id : null
    acr          = var.create_acr_private_endpoint ? azurerm_private_dns_zone.acr[0].id : null
  }
}

output "nsg_id" {
  description = "ID of the Network Security Group for private endpoints"
  value       = azurerm_network_security_group.private_endpoints.id
}
