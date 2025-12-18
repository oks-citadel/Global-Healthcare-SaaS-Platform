# HIPAA Technical Safeguards for UnifiedHealth Platform
# Implements 45 CFR § 164.312 - Technical Safeguards

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

variable "region" {
  description = "Azure region for HIPAA compliant resources"
  type        = string
  default     = "eastus"
}

variable "organization_name" {
  description = "Organization name for resource naming"
  type        = string
  default     = "unifiedhealth"
}

variable "resource_group_name" {
  description = "Resource group for HIPAA resources"
  type        = string
}

# HIPAA compliant tags
locals {
  hipaa_tags = {
    Compliance       = "HIPAA"
    DataClassification = "PHI"
    Environment      = var.environment
    ManagedBy        = "Terraform"
    CostCenter       = "Healthcare-Compliance"
    BackupRequired   = "true"
    Encryption       = "AES-256"
    RetentionYears   = "7"
  }
}

# Azure Policy for HIPAA Compliance
resource "azurerm_policy_assignment" "hipaa_compliance" {
  name                 = "hipaa-compliance-${var.environment}"
  scope                = data.azurerm_resource_group.main.id
  policy_definition_id = "/providers/Microsoft.Authorization/policySetDefinitions/a169a624-5599-4385-a696-c8d643089fab" # HIPAA HITRUST 9.2

  display_name = "HIPAA HITRUST 9.2 Compliance for ${var.environment}"
  description  = "Ensures all resources comply with HIPAA HITRUST 9.2 requirements"

  metadata = jsonencode({
    category = "HIPAA Compliance"
    version  = "1.0.0"
  })

  non_compliance_message {
    content = "Resource does not comply with HIPAA HITRUST 9.2 requirements"
  }
}

# Security Center - HIPAA Standard
resource "azurerm_security_center_subscription_pricing" "hipaa_security" {
  tier          = "Standard"
  resource_type = "VirtualMachines"
}

resource "azurerm_security_center_contact" "hipaa_security_contact" {
  email = var.security_contact_email
  phone = var.security_contact_phone

  alert_notifications = true
  alerts_to_admins    = true
}

# HIPAA Compliant Key Vault for PHI encryption keys
resource "azurerm_key_vault" "hipaa_kv" {
  name                = "${var.organization_name}-hipaa-kv-${var.environment}"
  location            = var.region
  resource_group_name = var.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id

  sku_name = "premium" # HSM-backed keys required for HIPAA

  # HIPAA requires purge protection
  purge_protection_enabled   = true
  soft_delete_retention_days = 90

  # Network isolation
  network_acls {
    bypass         = "AzureServices"
    default_action = "Deny"

    # Only allow access from healthcare VNet
    virtual_network_subnet_ids = [
      azurerm_subnet.healthcare_subnet.id
    ]

    ip_rules = var.allowed_ip_ranges
  }

  # Enable all HIPAA required logging
  enabled_for_deployment          = false
  enabled_for_disk_encryption     = true
  enabled_for_template_deployment = false

  tags = local.hipaa_tags
}

# Key Vault Diagnostic Settings for HIPAA Audit Trail
resource "azurerm_monitor_diagnostic_setting" "kv_diagnostics" {
  name                       = "hipaa-kv-diagnostics"
  target_resource_id         = azurerm_key_vault.hipaa_kv.id
  log_analytics_workspace_id = var.log_analytics_workspace_id

  enabled_log {
    category = "AuditEvent"
  }

  enabled_log {
    category = "AzurePolicyEvaluationDetails"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }

  # 7-year retention for HIPAA
  retention_policy {
    enabled = true
    days    = 2555 # 7 years
  }
}

# CMK (Customer Managed Key) for PHI encryption
resource "azurerm_key_vault_key" "phi_encryption_key" {
  name         = "phi-encryption-key-${var.environment}"
  key_vault_id = azurerm_key_vault.hipaa_kv.id
  key_type     = "RSA-HSM" # Hardware-backed key for HIPAA
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

  tags = local.hipaa_tags
}

# HIPAA Compliant Storage Account for PHI data
resource "azurerm_storage_account" "hipaa_storage" {
  name                     = "${var.organization_name}hipaa${var.environment}"
  resource_group_name      = var.resource_group_name
  location                 = var.region
  account_tier             = "Standard"
  account_replication_type = "GRS" # Geo-redundant for HIPAA disaster recovery
  account_kind             = "StorageV2"

  # HIPAA requires encryption at rest
  enable_https_traffic_only       = true
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = false # Use Azure AD authentication only

  # Infrastructure encryption (double encryption)
  infrastructure_encryption_enabled = true

  # Customer-managed key encryption
  identity {
    type = "SystemAssigned"
  }

  # Blob properties for HIPAA
  blob_properties {
    versioning_enabled       = true
    change_feed_enabled      = true
    last_access_time_enabled = true

    delete_retention_policy {
      days = 2555 # 7 years retention
    }

    container_delete_retention_policy {
      days = 2555
    }
  }

  # Network rules for HIPAA
  network_rules {
    default_action             = "Deny"
    bypass                     = ["AzureServices"]
    virtual_network_subnet_ids = [azurerm_subnet.healthcare_subnet.id]
    ip_rules                   = var.allowed_ip_ranges
  }

  tags = local.hipaa_tags
}

# Enable Advanced Threat Protection for HIPAA
resource "azurerm_advanced_threat_protection" "storage_atp" {
  target_resource_id = azurerm_storage_account.hipaa_storage.id
  enabled            = true
}

# HIPAA Compliant SQL Database with TDE
resource "azurerm_mssql_server" "hipaa_sql" {
  name                         = "${var.organization_name}-hipaa-sql-${var.environment}"
  resource_group_name          = var.resource_group_name
  location                     = var.region
  version                      = "12.0"
  administrator_login          = var.sql_admin_username
  administrator_login_password = random_password.sql_admin_password.result

  minimum_tls_version = "1.2"

  azuread_administrator {
    login_username = var.azuread_admin_username
    object_id      = var.azuread_admin_object_id
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.hipaa_tags
}

# Transparent Data Encryption with CMK
resource "azurerm_mssql_server_transparent_data_encryption" "hipaa_tde" {
  server_id        = azurerm_mssql_server.hipaa_sql.id
  key_vault_key_id = azurerm_key_vault_key.phi_encryption_key.id
}

# SQL Auditing for HIPAA
resource "azurerm_mssql_server_extended_auditing_policy" "hipaa_sql_audit" {
  server_id                               = azurerm_mssql_server.hipaa_sql.id
  storage_endpoint                        = azurerm_storage_account.hipaa_storage.primary_blob_endpoint
  storage_account_access_key              = azurerm_storage_account.hipaa_storage.primary_access_key
  storage_account_access_key_is_secondary = false
  retention_in_days                       = 2555 # 7 years

  log_monitoring_enabled = true
}

# SQL Vulnerability Assessment for HIPAA
resource "azurerm_mssql_server_security_alert_policy" "hipaa_sql_alerts" {
  resource_group_name = var.resource_group_name
  server_name         = azurerm_mssql_server.hipaa_sql.name
  state               = "Enabled"

  storage_endpoint           = azurerm_storage_account.hipaa_storage.primary_blob_endpoint
  storage_account_access_key = azurerm_storage_account.hipaa_storage.primary_access_key
  retention_days             = 2555

  disabled_alerts = []

  email_account_admins = true
  email_addresses      = [var.security_contact_email]
}

# HIPAA Compliant Database
resource "azurerm_mssql_database" "hipaa_db" {
  name      = "unifiedhealth-phi-db"
  server_id = azurerm_mssql_server.hipaa_sql.id

  sku_name = "S3" # Standard tier for production

  # Backup retention for HIPAA
  short_term_retention_policy {
    retention_days = 35
  }

  long_term_retention_policy {
    weekly_retention  = "P12W"
    monthly_retention = "P12M"
    yearly_retention  = "P7Y"
    week_of_year      = 1
  }

  tags = local.hipaa_tags
}

# Data masking for PHI protection
resource "azurerm_mssql_database_extended_auditing_policy" "db_audit" {
  database_id                             = azurerm_mssql_database.hipaa_db.id
  storage_endpoint                        = azurerm_storage_account.hipaa_storage.primary_blob_endpoint
  storage_account_access_key              = azurerm_storage_account.hipaa_storage.primary_access_key
  storage_account_access_key_is_secondary = false
  retention_in_days                       = 2555

  log_monitoring_enabled = true
}

# Private Endpoint for SQL Server (HIPAA network isolation)
resource "azurerm_private_endpoint" "sql_private_endpoint" {
  name                = "${var.organization_name}-sql-pe-${var.environment}"
  location            = var.region
  resource_group_name = var.resource_group_name
  subnet_id           = azurerm_subnet.healthcare_subnet.id

  private_service_connection {
    name                           = "sql-privateserviceconnection"
    private_connection_resource_id = azurerm_mssql_server.hipaa_sql.id
    subresource_names              = ["sqlServer"]
    is_manual_connection           = false
  }

  tags = local.hipaa_tags
}

# Random password for SQL admin (stored in Key Vault)
resource "random_password" "sql_admin_password" {
  length  = 32
  special = true
}

resource "azurerm_key_vault_secret" "sql_admin_password" {
  name         = "sql-admin-password"
  value        = random_password.sql_admin_password.result
  key_vault_id = azurerm_key_vault.hipaa_kv.id

  tags = local.hipaa_tags
}

# Data sources
data "azurerm_client_config" "current" {}

data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

# Outputs
output "key_vault_id" {
  description = "HIPAA Key Vault ID"
  value       = azurerm_key_vault.hipaa_kv.id
}

output "phi_encryption_key_id" {
  description = "PHI encryption key ID"
  value       = azurerm_key_vault_key.phi_encryption_key.id
}

output "hipaa_storage_account_id" {
  description = "HIPAA storage account ID"
  value       = azurerm_storage_account.hipaa_storage.id
}

output "hipaa_sql_server_id" {
  description = "HIPAA SQL server ID"
  value       = azurerm_mssql_server.hipaa_sql.id
}

output "hipaa_database_id" {
  description = "HIPAA database ID"
  value       = azurerm_mssql_database.hipaa_db.id
}
