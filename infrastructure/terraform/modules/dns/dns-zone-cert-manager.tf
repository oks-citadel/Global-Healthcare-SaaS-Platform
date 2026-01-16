# ============================================
# Azure DNS Zone for cert-manager DNS-01 Challenge
# ============================================
# This Terraform module creates the Azure DNS resources
# needed for DNS-01 ACME challenges with cert-manager
# ============================================

# Variables
variable "dns_zone_name" {
  description = "The DNS zone name (e.g., unifiedhealth.com)"
  type        = string
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "eastus"
}

variable "aks_cluster_name" {
  description = "AKS cluster name for workload identity"
  type        = string
}

variable "aks_resource_group_name" {
  description = "AKS cluster resource group name"
  type        = string
}

variable "aks_oidc_issuer_url" {
  description = "AKS OIDC issuer URL"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

# ============================================
# DNS Zone
# ============================================

resource "azurerm_dns_zone" "main" {
  name                = var.dns_zone_name
  resource_group_name = var.resource_group_name

  tags = merge(var.tags, {
    Purpose = "cert-manager-dns01"
  })
}

# ============================================
# Managed Identity for cert-manager
# ============================================

resource "azurerm_user_assigned_identity" "cert_manager" {
  name                = "id-cert-manager-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group_name

  tags = var.tags
}

# ============================================
# Role Assignment: DNS Zone Contributor
# ============================================

# Grant the managed identity permission to manage DNS records
resource "azurerm_role_assignment" "cert_manager_dns_contributor" {
  scope                = azurerm_dns_zone.main.id
  role_definition_name = "DNS Zone Contributor"
  principal_id         = azurerm_user_assigned_identity.cert_manager.principal_id
}

# ============================================
# Federated Identity Credential
# ============================================

# This allows the cert-manager service account to use the managed identity
resource "azurerm_federated_identity_credential" "cert_manager" {
  name                = "cert-manager-federated-credential"
  resource_group_name = var.resource_group_name
  parent_id           = azurerm_user_assigned_identity.cert_manager.id

  audience = ["api://AzureADTokenExchange"]
  issuer   = var.aks_oidc_issuer_url

  # The service account that cert-manager uses
  subject = "system:serviceaccount:cert-manager:cert-manager"
}

# ============================================
# DNS Records for Development
# ============================================

# A record pointing to the AKS load balancer (example)
resource "azurerm_dns_a_record" "api" {
  name                = "api"
  zone_name           = azurerm_dns_zone.main.name
  resource_group_name = var.resource_group_name
  ttl                 = 300
  records             = [] # Will be populated by external-dns or manually

  lifecycle {
    ignore_changes = [records]
  }

  tags = var.tags
}

resource "azurerm_dns_a_record" "app" {
  name                = "app"
  zone_name           = azurerm_dns_zone.main.name
  resource_group_name = var.resource_group_name
  ttl                 = 300
  records             = []

  lifecycle {
    ignore_changes = [records]
  }

  tags = var.tags
}

# Wildcard A record for dev subdomain
resource "azurerm_dns_a_record" "dev_wildcard" {
  name                = "*.dev"
  zone_name           = azurerm_dns_zone.main.name
  resource_group_name = var.resource_group_name
  ttl                 = 300
  records             = []

  lifecycle {
    ignore_changes = [records]
  }

  tags = var.tags
}

# ============================================
# Outputs
# ============================================

output "dns_zone_id" {
  description = "DNS zone ID"
  value       = azurerm_dns_zone.main.id
}

output "dns_zone_name" {
  description = "DNS zone name"
  value       = azurerm_dns_zone.main.name
}

output "dns_zone_name_servers" {
  description = "DNS zone name servers (configure at registrar)"
  value       = azurerm_dns_zone.main.name_servers
}

output "managed_identity_id" {
  description = "Managed identity ID for cert-manager"
  value       = azurerm_user_assigned_identity.cert_manager.id
}

output "managed_identity_client_id" {
  description = "Managed identity client ID for cert-manager ClusterIssuer"
  value       = azurerm_user_assigned_identity.cert_manager.client_id
}

output "managed_identity_principal_id" {
  description = "Managed identity principal ID"
  value       = azurerm_user_assigned_identity.cert_manager.principal_id
}
