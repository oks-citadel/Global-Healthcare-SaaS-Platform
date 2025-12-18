# GDPR Technical Controls for UnifiedHealth Platform
# Implements EU General Data Protection Regulation (EU) 2016/679

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

variable "eu_region" {
  description = "EU Azure region for GDPR data residency"
  type        = string
  default     = "westeurope" # Must be EU region
}

variable "organization_name" {
  description = "Organization name for resource naming"
  type        = string
  default     = "unifiedhealth"
}

variable "resource_group_name" {
  description = "Resource group for GDPR resources"
  type        = string
}

# GDPR compliant tags
locals {
  gdpr_tags = {
    Compliance         = "GDPR"
    DataClassification = "Personal-Data"
    DataResidency      = "EU"
    Environment        = var.environment
    ManagedBy          = "Terraform"
    LegalBasis         = "Consent"
    DataController     = var.organization_name
    DPO                = var.dpo_email
    RetentionPeriod    = "As-Per-Policy"
  }
}

# Azure Policy for GDPR Compliance
resource "azurerm_policy_assignment" "gdpr_compliance" {
  name                 = "gdpr-compliance-${var.environment}"
  scope                = data.azurerm_resource_group.main.id
  policy_definition_id = "/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c" # Allowed locations

  display_name = "GDPR Data Residency Enforcement for ${var.environment}"
  description  = "Ensures all resources are deployed in EU regions only"

  parameters = jsonencode({
    listOfAllowedLocations = {
      value = [
        "westeurope",
        "northeurope",
        "francecentral",
        "germanywestcentral",
        "switzerlandnorth",
        "norwayeast"
      ]
    }
  })

  metadata = jsonencode({
    category = "GDPR Compliance"
    version  = "1.0.0"
  })

  non_compliance_message {
    content = "Resource must be deployed in EU region for GDPR compliance"
  }
}

# Azure Policy - Restrict resource types for GDPR
resource "azurerm_policy_assignment" "restrict_non_eu_services" {
  name                 = "restrict-non-eu-services-${var.environment}"
  scope                = data.azurerm_resource_group.main.id
  policy_definition_id = "/providers/Microsoft.Authorization/policyDefinitions/a451c1ef-c6ca-483d-87d-f49761e3ffb5" # Allowed resource types

  display_name = "Restrict to EU-Available Services"
  description  = "Only allow Azure services available in EU regions"

  non_compliance_message {
    content = "This resource type is not permitted for GDPR compliance"
  }
}

# GDPR Compliant Key Vault for Personal Data encryption
resource "azurerm_key_vault" "gdpr_kv" {
  name                = "${var.organization_name}-gdpr-kv-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id

  sku_name = "premium"

  # GDPR requires purge protection
  purge_protection_enabled   = true
  soft_delete_retention_days = 90

  # Network isolation
  network_acls {
    bypass         = "AzureServices"
    default_action = "Deny"

    virtual_network_subnet_ids = [
      azurerm_subnet.eu_healthcare_subnet.id
    ]

    ip_rules = var.eu_allowed_ip_ranges
  }

  enabled_for_deployment          = false
  enabled_for_disk_encryption     = true
  enabled_for_template_deployment = false

  tags = local.gdpr_tags
}

# Customer Managed Key for Personal Data Encryption
resource "azurerm_key_vault_key" "personal_data_encryption_key" {
  name         = "personal-data-encryption-${var.environment}"
  key_vault_id = azurerm_key_vault.gdpr_kv.id
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

  tags = merge(local.gdpr_tags, {
    Purpose = "Personal-Data-Encryption"
  })
}

# GDPR Compliant Storage Account - EU Residency Enforced
resource "azurerm_storage_account" "gdpr_storage" {
  name                     = "${var.organization_name}gdpr${var.environment}"
  resource_group_name      = var.resource_group_name
  location                 = var.eu_region
  account_tier             = "Standard"
  account_replication_type = "GZRS" # Geo-zone redundant within EU

  # Enforce EU replication only
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
      days = 30 # GDPR allows deletion after purpose fulfilled
    }

    container_delete_retention_policy {
      days = 30
    }

    # Enable point-in-time restore for accidental deletion
    restore_policy {
      days = 7
    }
  }

  network_rules {
    default_action             = "Deny"
    bypass                     = ["AzureServices"]
    virtual_network_subnet_ids = [azurerm_subnet.eu_healthcare_subnet.id]
    ip_rules                   = var.eu_allowed_ip_ranges
  }

  tags = local.gdpr_tags
}

# GDPR Compliant PostgreSQL Database (EU-hosted)
resource "azurerm_postgresql_flexible_server" "gdpr_postgres" {
  name                = "${var.organization_name}-gdpr-postgres-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.eu_region

  administrator_login    = var.postgres_admin_username
  administrator_password = random_password.postgres_admin_password.result

  sku_name   = "GP_Standard_D4s_v3"
  version    = "15"
  storage_mb = 32768

  backup_retention_days        = 35
  geo_redundant_backup_enabled = true # Within EU only

  # High availability within EU zone
  high_availability {
    mode                      = "ZoneRedundant"
    standby_availability_zone = "2"
  }

  # Customer-managed key encryption
  customer_managed_key {
    key_vault_key_id = azurerm_key_vault_key.personal_data_encryption_key.id
  }

  # Private access only
  delegated_subnet_id = azurerm_subnet.postgres_subnet.id
  private_dns_zone_id = azurerm_private_dns_zone.postgres_dns.id

  tags = local.gdpr_tags
}

# PostgreSQL Configuration for GDPR
resource "azurerm_postgresql_flexible_server_configuration" "log_connections" {
  name      = "log_connections"
  server_id = azurerm_postgresql_flexible_server.gdpr_postgres.id
  value     = "on"
}

resource "azurerm_postgresql_flexible_server_configuration" "log_disconnections" {
  name      = "log_disconnections"
  server_id = azurerm_postgresql_flexible_server.gdpr_postgres.id
  value     = "on"
}

resource "azurerm_postgresql_flexible_server_configuration" "log_statement" {
  name      = "log_statement"
  server_id = azurerm_postgresql_flexible_server.gdpr_postgres.id
  value     = "all"
}

# GDPR Audit Database
resource "azurerm_postgresql_flexible_server_database" "gdpr_audit_db" {
  name      = "gdpr_audit"
  server_id = azurerm_postgresql_flexible_server.gdpr_postgres.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# Personal Data Database
resource "azurerm_postgresql_flexible_server_database" "personal_data_db" {
  name      = "personal_data"
  server_id = azurerm_postgresql_flexible_server.gdpr_postgres.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# Private DNS Zone for PostgreSQL
resource "azurerm_private_dns_zone" "postgres_dns" {
  name                = "privatelink.postgres.database.azure.com"
  resource_group_name = var.resource_group_name

  tags = local.gdpr_tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "postgres_dns_link" {
  name                  = "postgres-dns-link"
  resource_group_name   = var.resource_group_name
  private_dns_zone_name = azurerm_private_dns_zone.postgres_dns.name
  virtual_network_id    = azurerm_virtual_network.gdpr_vnet.id

  tags = local.gdpr_tags
}

# Virtual Network for GDPR resources (EU-only)
resource "azurerm_virtual_network" "gdpr_vnet" {
  name                = "${var.organization_name}-gdpr-vnet-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name
  address_space       = ["10.1.0.0/16"]

  tags = local.gdpr_tags
}

# Subnet for healthcare services
resource "azurerm_subnet" "eu_healthcare_subnet" {
  name                 = "healthcare-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.gdpr_vnet.name
  address_prefixes     = ["10.1.1.0/24"]

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
  virtual_network_name = azurerm_virtual_network.gdpr_vnet.name
  address_prefixes     = ["10.1.2.0/24"]

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

# Network Security Group for GDPR resources
resource "azurerm_network_security_group" "gdpr_nsg" {
  name                = "${var.organization_name}-gdpr-nsg-${var.environment}"
  location            = var.eu_region
  resource_group_name = var.resource_group_name

  # Deny all inbound by default
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

  # Allow HTTPS from EU only
  security_rule {
    name                       = "AllowHTTPSFromEU"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefixes    = var.eu_ip_ranges
    destination_address_prefix = "*"
  }

  tags = local.gdpr_tags
}

resource "azurerm_subnet_network_security_group_association" "healthcare_nsg" {
  subnet_id                 = azurerm_subnet.eu_healthcare_subnet.id
  network_security_group_id = azurerm_network_security_group.gdpr_nsg.id
}

# Azure Front Door for EU-only traffic routing with geo-filtering
resource "azurerm_cdn_frontdoor_profile" "gdpr_frontdoor" {
  name                = "${var.organization_name}-gdpr-fd-${var.environment}"
  resource_group_name = var.resource_group_name
  sku_name            = "Premium_AzureFrontDoor"

  tags = local.gdpr_tags
}

resource "azurerm_cdn_frontdoor_firewall_policy" "geo_filter" {
  name                              = "gdprgeofilter${var.environment}"
  resource_group_name               = var.resource_group_name
  sku_name                          = azurerm_cdn_frontdoor_profile.gdpr_frontdoor.sku_name
  enabled                           = true
  mode                              = "Prevention"
  redirect_url                      = "https://www.unifiedhealth.com/not-available"
  custom_block_response_status_code = 403
  custom_block_response_body        = base64encode("Access denied due to GDPR data residency requirements")

  # Allow only EU countries
  custom_rule {
    name                           = "AllowEUOnly"
    enabled                        = true
    priority                       = 1
    rate_limit_duration_in_minutes = 1
    rate_limit_threshold           = 100
    type                           = "MatchRule"
    action                         = "Allow"

    match_condition {
      match_variable     = "RemoteAddr"
      operator           = "GeoMatch"
      negation_condition = false
      match_values = [
        "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
        "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
        "PL", "PT", "RO", "SK", "SI", "ES", "SE"
      ]
    }
  }

  # Block all non-EU countries
  custom_rule {
    name                           = "BlockNonEU"
    enabled                        = true
    priority                       = 2
    rate_limit_duration_in_minutes = 1
    rate_limit_threshold           = 100
    type                           = "MatchRule"
    action                         = "Block"

    match_condition {
      match_variable     = "RemoteAddr"
      operator           = "GeoMatch"
      negation_condition = true
      match_values = [
        "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
        "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
        "PL", "PT", "RO", "SK", "SI", "ES", "SE"
      ]
    }
  }

  tags = local.gdpr_tags
}

# Data Protection Impact Assessment (DPIA) Storage
resource "azurerm_storage_container" "dpia_documents" {
  name                  = "dpia-assessments"
  storage_account_name  = azurerm_storage_account.gdpr_storage.name
  container_access_type = "private"
}

# Consent Records Storage
resource "azurerm_storage_container" "consent_records" {
  name                  = "consent-records"
  storage_account_name  = azurerm_storage_account.gdpr_storage.name
  container_access_type = "private"
}

# Data Subject Requests Storage
resource "azurerm_storage_container" "dsr_requests" {
  name                  = "data-subject-requests"
  storage_account_name  = azurerm_storage_account.gdpr_storage.name
  container_access_type = "private"
}

# Random password for PostgreSQL
resource "random_password" "postgres_admin_password" {
  length  = 32
  special = true
}

resource "azurerm_key_vault_secret" "postgres_admin_password" {
  name         = "postgres-admin-password"
  value        = random_password.postgres_admin_password.result
  key_vault_id = azurerm_key_vault.gdpr_kv.id

  tags = local.gdpr_tags
}

# Data sources
data "azurerm_client_config" "current" {}

data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

# Variables
variable "dpo_email" {
  description = "Data Protection Officer email"
  type        = string
}

variable "postgres_admin_username" {
  description = "PostgreSQL administrator username"
  type        = string
  sensitive   = true
}

variable "eu_allowed_ip_ranges" {
  description = "Allowed EU IP ranges"
  type        = list(string)
  default     = []
}

variable "eu_ip_ranges" {
  description = "EU IP ranges for geo-filtering"
  type        = list(string)
}

# Outputs
output "gdpr_key_vault_id" {
  description = "GDPR Key Vault ID"
  value       = azurerm_key_vault.gdpr_kv.id
}

output "personal_data_encryption_key_id" {
  description = "Personal data encryption key ID"
  value       = azurerm_key_vault_key.personal_data_encryption_key.id
}

output "gdpr_storage_account_id" {
  description = "GDPR storage account ID"
  value       = azurerm_storage_account.gdpr_storage.id
}

output "gdpr_postgres_server_id" {
  description = "GDPR PostgreSQL server ID"
  value       = azurerm_postgresql_flexible_server.gdpr_postgres.id
}

output "gdpr_vnet_id" {
  description = "GDPR Virtual Network ID"
  value       = azurerm_virtual_network.gdpr_vnet.id
}

output "gdpr_frontdoor_id" {
  description = "GDPR Front Door ID"
  value       = azurerm_cdn_frontdoor_profile.gdpr_frontdoor.id
}
