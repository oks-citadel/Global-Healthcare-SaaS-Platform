# POPIA Technical Controls for UnifiedHealth Platform
# South African Protection of Personal Information Act (POPIA) No. 4 of 2013

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "sa_region" {
  description = "South African Azure region for POPIA data residency"
  type        = string
  default     = "southafricanorth" # POPIA requires SA data residency
}

variable "organization_name" {
  description = "Organization name for resource naming"
  type        = string
  default     = "unifiedhealth"
}

variable "resource_group_name" {
  description = "Resource group for POPIA resources"
  type        = string
}

# POPIA compliant tags
locals {
  popia_tags = {
    Compliance         = "POPIA"
    DataClassification = "Personal-Information"
    DataResidency      = "South-Africa"
    Environment        = var.environment
    ManagedBy          = "Terraform"
    InformationOfficer = var.information_officer_email
    LegalBasis         = "Consent"
    RetentionPeriod    = "As-Per-Policy"
    DataSovereignty    = "SA"
  }
}

# Azure Policy for POPIA Compliance - SA Region Only
resource "azurerm_policy_assignment" "popia_compliance" {
  name                 = "popia-compliance-${var.environment}"
  scope                = data.azurerm_resource_group.main.id
  policy_definition_id = azurerm_policy_definition.sa_residency_policy.id

  display_name = "POPIA Data Residency Enforcement for ${var.environment}"
  description  = "Ensures all resources are deployed in South African regions only"

  metadata = jsonencode({
    category   = "POPIA Compliance"
    version    = "1.0.0"
    compliance = "POPIA Act 4 of 2013"
  })

  non_compliance_message {
    content = "Resource must be deployed in South African region for POPIA compliance"
  }
}

# Custom Policy Definition for SA Residency
resource "azurerm_policy_definition" "sa_residency_policy" {
  name         = "popia-sa-residency-policy"
  policy_type  = "Custom"
  mode         = "All"
  display_name = "POPIA SA Data Residency Enforcement"
  description  = "Denies resource creation outside SA regions for POPIA compliance"

  metadata = jsonencode({
    category = "POPIA Compliance"
  })

  policy_rule = jsonencode({
    if = {
      allOf = [
        {
          field = "location"
          notIn = [
            "southafricanorth",
            "southafricawest"
          ]
        },
        {
          field = "type"
          notEquals = "Microsoft.Resources/resourceGroups"
        }
      ]
    }
    then = {
      effect = "deny"
    }
  })
}

# POPIA Compliant Key Vault
resource "azurerm_key_vault" "popia_kv" {
  name                = "${var.organization_name}-popia-kv-${var.environment}"
  location            = var.sa_region
  resource_group_name = var.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id

  sku_name = "premium"

  purge_protection_enabled   = true
  soft_delete_retention_days = 90

  network_acls {
    bypass         = "AzureServices"
    default_action = "Deny"

    virtual_network_subnet_ids = [
      azurerm_subnet.sa_healthcare_subnet.id
    ]

    ip_rules = var.sa_allowed_ip_ranges
  }

  enabled_for_deployment          = false
  enabled_for_disk_encryption     = true
  enabled_for_template_deployment = false

  tags = local.popia_tags
}

# Customer Managed Key for Personal Information Encryption
resource "azurerm_key_vault_key" "personal_info_encryption_key" {
  name         = "personal-info-encryption-${var.environment}"
  key_vault_id = azurerm_key_vault.popia_kv.id
  key_type     = "RSA-HSM"
  key_size     = 4096

  key_opts = [
    "decrypt",
    "encrypt",
    "sign",
    "unwrapKey",
    "verify",
    "wrapKey",
  ]

  rotation_policy {
    automatic {
      time_before_expiry = "P30D"
    }

    expire_after         = "P90D"
    notify_before_expiry = "P29D"
  }

  tags = merge(local.popia_tags, {
    Purpose = "Personal-Information-Encryption"
  })
}

# POPIA Compliant Storage Account - SA Residency
resource "azurerm_storage_account" "popia_storage" {
  name                     = "${var.organization_name}popia${var.environment}"
  resource_group_name      = var.resource_group_name
  location                 = var.sa_region
  account_tier             = "Standard"
  account_replication_type = "GZRS" # Geo-zone redundant within SA

  account_kind = "StorageV2"

  enable_https_traffic_only       = true
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = false

  infrastructure_encryption_enabled = true

  identity {
    type = "SystemAssigned"
  }

  blob_properties {
    versioning_enabled       = true
    change_feed_enabled      = true
    last_access_time_enabled = true

    delete_retention_policy {
      days = 30 # POPIA allows deletion after purpose fulfilled
    }

    container_delete_retention_policy {
      days = 30
    }

    restore_policy {
      days = 7
    }
  }

  network_rules {
    default_action             = "Deny"
    bypass                     = ["AzureServices"]
    virtual_network_subnet_ids = [azurerm_subnet.sa_healthcare_subnet.id]
    ip_rules                   = var.sa_allowed_ip_ranges
  }

  tags = local.popia_tags
}

# POPIA Compliant PostgreSQL Database (SA-hosted)
resource "azurerm_postgresql_flexible_server" "popia_postgres" {
  name                = "${var.organization_name}-popia-postgres-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.sa_region

  administrator_login    = var.postgres_admin_username
  administrator_password = random_password.postgres_admin_password.result

  sku_name   = "GP_Standard_D4s_v3"
  version    = "15"
  storage_mb = 32768

  backup_retention_days        = 35
  geo_redundant_backup_enabled = true # Within SA only

  high_availability {
    mode                      = "ZoneRedundant"
    standby_availability_zone = "2"
  }

  customer_managed_key {
    key_vault_key_id = azurerm_key_vault_key.personal_info_encryption_key.id
  }

  delegated_subnet_id = azurerm_subnet.postgres_subnet.id
  private_dns_zone_id = azurerm_private_dns_zone.postgres_dns.id

  tags = local.popia_tags
}

# Personal Information Database
resource "azurerm_postgresql_flexible_server_database" "personal_info_db" {
  name      = "personal_information"
  server_id = azurerm_postgresql_flexible_server.popia_postgres.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# POPIA Audit Database
resource "azurerm_postgresql_flexible_server_database" "popia_audit_db" {
  name      = "popia_audit"
  server_id = azurerm_postgresql_flexible_server.popia_postgres.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# Consent Management Database
resource "azurerm_postgresql_flexible_server_database" "consent_db" {
  name      = "consent_management"
  server_id = azurerm_postgresql_flexible_server.popia_postgres.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# Private DNS Zone for PostgreSQL
resource "azurerm_private_dns_zone" "postgres_dns" {
  name                = "privatelink.postgres.database.azure.com"
  resource_group_name = var.resource_group_name

  tags = local.popia_tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "postgres_dns_link" {
  name                  = "postgres-dns-link"
  resource_group_name   = var.resource_group_name
  private_dns_zone_name = azurerm_private_dns_zone.postgres_dns.name
  virtual_network_id    = azurerm_virtual_network.popia_vnet.id

  tags = local.popia_tags
}

# Virtual Network for POPIA resources (SA-only)
resource "azurerm_virtual_network" "popia_vnet" {
  name                = "${var.organization_name}-popia-vnet-${var.environment}"
  location            = var.sa_region
  resource_group_name = var.resource_group_name
  address_space       = ["10.2.0.0/16"]

  tags = local.popia_tags
}

# Subnet for healthcare services
resource "azurerm_subnet" "sa_healthcare_subnet" {
  name                 = "healthcare-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.popia_vnet.name
  address_prefixes     = ["10.2.1.0/24"]

  service_endpoints = [
    "Microsoft.Storage",
    "Microsoft.Sql",
    "Microsoft.KeyVault"
  ]
}

# Subnet for PostgreSQL
resource "azurerm_subnet" "postgres_subnet" {
  name                 = "postgres-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.popia_vnet.name
  address_prefixes     = ["10.2.2.0/24"]

  delegation {
    name = "postgres-delegation"

    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action",
      ]
    }
  }
}

# Network Security Group for POPIA resources
resource "azurerm_network_security_group" "popia_nsg" {
  name                = "${var.organization_name}-popia-nsg-${var.environment}"
  location            = var.sa_region
  resource_group_name = var.resource_group_name

  security_rule {
    name                       = "DenyAllInbound"
    priority                   = 4096
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowHTTPSFromSA"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = var.sa_ip_range
    destination_address_prefix = "*"
  }

  tags = local.popia_tags
}

resource "azurerm_subnet_network_security_group_association" "healthcare_nsg" {
  subnet_id                 = azurerm_subnet.sa_healthcare_subnet.id
  network_security_group_id = azurerm_network_security_group.popia_nsg.id
}

# Storage Containers for POPIA Compliance
resource "azurerm_storage_container" "popia_assessments" {
  name                  = "popia-impact-assessments"
  storage_account_name  = azurerm_storage_account.popia_storage.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "consent_records" {
  name                  = "consent-records"
  storage_account_name  = azurerm_storage_account.popia_storage.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "paia_requests" {
  name                  = "paia-requests"
  storage_account_name  = azurerm_storage_account.popia_storage.name
  container_access_type = "private"

  metadata = {
    purpose = "Promotion of Access to Information Act (PAIA) requests"
  }
}

# Random password for PostgreSQL
resource "random_password" "postgres_admin_password" {
  length  = 32
  special = true
}

resource "azurerm_key_vault_secret" "postgres_admin_password" {
  name         = "postgres-admin-password"
  value        = random_password.postgres_admin_password.result
  key_vault_id = azurerm_key_vault.popia_kv.id

  tags = local.popia_tags
}

# Log Analytics for POPIA Audit
resource "azurerm_log_analytics_workspace" "popia_audit" {
  name                = "${var.organization_name}-popia-audit-${var.environment}"
  location            = var.sa_region
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 730 # 2 years retention

  tags = merge(local.popia_tags, {
    Purpose = "POPIA-Audit-Logging"
  })
}

# Data sources
data "azurerm_client_config" "current" {}

data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

# Variables
variable "information_officer_email" {
  description = "Information Officer email (POPIA requirement)"
  type        = string
}

variable "postgres_admin_username" {
  description = "PostgreSQL administrator username"
  type        = string
  sensitive   = true
}

variable "sa_allowed_ip_ranges" {
  description = "Allowed South African IP ranges"
  type        = list(string)
  default     = []
}

variable "sa_ip_range" {
  description = "South African IP range for geo-filtering"
  type        = string
  default     = "196.0.0.0/8" # SA IP range
}

# Outputs
output "popia_key_vault_id" {
  description = "POPIA Key Vault ID"
  value       = azurerm_key_vault.popia_kv.id
}

output "personal_info_encryption_key_id" {
  description = "Personal information encryption key ID"
  value       = azurerm_key_vault_key.personal_info_encryption_key.id
}

output "popia_storage_account_id" {
  description = "POPIA storage account ID"
  value       = azurerm_storage_account.popia_storage.id
}

output "popia_postgres_server_id" {
  description = "POPIA PostgreSQL server ID"
  value       = azurerm_postgresql_flexible_server.popia_postgres.id
}

output "popia_vnet_id" {
  description = "POPIA Virtual Network ID"
  value       = azurerm_virtual_network.popia_vnet.id
}

output "popia_audit_workspace_id" {
  description = "POPIA audit Log Analytics workspace ID"
  value       = azurerm_log_analytics_workspace.popia_audit.id
}
