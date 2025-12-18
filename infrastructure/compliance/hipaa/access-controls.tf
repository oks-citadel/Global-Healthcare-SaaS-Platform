# HIPAA Access Controls - 45 CFR § 164.312(a)(1) - Access Control
# Role-Based Access Control (RBAC) for PHI

# Custom RBAC Roles for HIPAA

# PHI Reader Role - Limited read access to PHI
resource "azurerm_role_definition" "phi_reader" {
  name  = "PHI-Reader-${var.environment}"
  scope = data.azurerm_resource_group.main.id

  description = "Can read PHI data with audit logging"

  permissions {
    actions = [
      "Microsoft.HealthcareApis/*/read",
      "Microsoft.Sql/servers/databases/read",
      "Microsoft.Storage/storageAccounts/blobServices/containers/read",
      "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"
    ]

    not_actions = []

    data_actions = [
      "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"
    ]

    not_data_actions = []
  }

  assignable_scopes = [
    data.azurerm_resource_group.main.id
  ]
}

# PHI Writer Role - Can create and update PHI
resource "azurerm_role_definition" "phi_writer" {
  name  = "PHI-Writer-${var.environment}"
  scope = data.azurerm_resource_group.main.id

  description = "Can read and write PHI data with full audit logging"

  permissions {
    actions = [
      "Microsoft.HealthcareApis/*/read",
      "Microsoft.HealthcareApis/*/write",
      "Microsoft.Sql/servers/databases/read",
      "Microsoft.Sql/servers/databases/write",
      "Microsoft.Storage/storageAccounts/blobServices/containers/read",
      "Microsoft.Storage/storageAccounts/blobServices/containers/write",
      "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
      "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
    ]

    not_actions = [
      "Microsoft.Sql/servers/databases/delete",
      "Microsoft.Storage/storageAccounts/blobServices/containers/delete"
    ]

    data_actions = [
      "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
      "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write",
      "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action"
    ]

    not_data_actions = [
      "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete"
    ]
  }

  assignable_scopes = [
    data.azurerm_resource_group.main.id
  ]
}

# PHI Administrator Role - Full access with strict audit
resource "azurerm_role_definition" "phi_administrator" {
  name  = "PHI-Administrator-${var.environment}"
  scope = data.azurerm_resource_group.main.id

  description = "Full administrative access to PHI with comprehensive audit logging"

  permissions {
    actions = [
      "Microsoft.HealthcareApis/*",
      "Microsoft.Sql/servers/databases/*",
      "Microsoft.Storage/storageAccounts/blobServices/containers/*",
      "Microsoft.KeyVault/vaults/secrets/read",
      "Microsoft.KeyVault/vaults/keys/read"
    ]

    not_actions = [
      "Microsoft.KeyVault/vaults/delete",
      "Microsoft.KeyVault/vaults/keys/delete"
    ]

    data_actions = [
      "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/*",
      "Microsoft.KeyVault/vaults/secrets/getSecret/action"
    ]

    not_data_actions = []
  }

  assignable_scopes = [
    data.azurerm_resource_group.main.id
  ]
}

# Compliance Officer Role - Audit and compliance access only
resource "azurerm_role_definition" "compliance_officer" {
  name  = "Compliance-Officer-${var.environment}"
  scope = data.azurerm_resource_group.main.id

  description = "Can access audit logs and compliance reports but not PHI"

  permissions {
    actions = [
      "Microsoft.Insights/*/read",
      "Microsoft.OperationalInsights/*/read",
      "Microsoft.Security/*/read",
      "Microsoft.PolicyInsights/*/read",
      "Microsoft.Authorization/*/read"
    ]

    not_actions = []

    data_actions = []

    not_data_actions = []
  }

  assignable_scopes = [
    data.azurerm_resource_group.main.id
  ]
}

# Azure AD Group for Healthcare Providers
resource "azuread_group" "healthcare_providers" {
  display_name     = "HIPAA-Healthcare-Providers-${var.environment}"
  description      = "Healthcare providers with PHI access"
  security_enabled = true

  owners = [data.azurerm_client_config.current.object_id]

  lifecycle {
    prevent_destroy = true
  }
}

# Azure AD Group for Nurses
resource "azuread_group" "nurses" {
  display_name     = "HIPAA-Nurses-${var.environment}"
  description      = "Nurses with limited PHI access"
  security_enabled = true

  owners = [data.azurerm_client_config.current.object_id]

  lifecycle {
    prevent_destroy = true
  }
}

# Azure AD Group for Administrative Staff
resource "azuread_group" "admin_staff" {
  display_name     = "HIPAA-Administrative-Staff-${var.environment}"
  description      = "Administrative staff with limited access"
  security_enabled = true

  owners = [data.azurerm_client_config.current.object_id]

  lifecycle {
    prevent_destroy = true
  }
}

# Azure AD Group for Compliance Officers
resource "azuread_group" "compliance_officers" {
  display_name     = "HIPAA-Compliance-Officers-${var.environment}"
  description      = "Compliance officers with audit access"
  security_enabled = true

  owners = [data.azurerm_client_config.current.object_id]

  lifecycle {
    prevent_destroy = true
  }
}

# Role Assignments - Healthcare Providers (Full Access)
resource "azurerm_role_assignment" "providers_phi_admin" {
  scope              = azurerm_mssql_database.hipaa_db.id
  role_definition_id = azurerm_role_definition.phi_administrator.role_definition_resource_id
  principal_id       = azuread_group.healthcare_providers.object_id
}

# Role Assignments - Nurses (Write Access)
resource "azurerm_role_assignment" "nurses_phi_writer" {
  scope              = azurerm_mssql_database.hipaa_db.id
  role_definition_id = azurerm_role_definition.phi_writer.role_definition_resource_id
  principal_id       = azuread_group.nurses.object_id
}

# Role Assignments - Admin Staff (Read Access)
resource "azurerm_role_assignment" "admin_phi_reader" {
  scope              = azurerm_mssql_database.hipaa_db.id
  role_definition_id = azurerm_role_definition.phi_reader.role_definition_resource_id
  principal_id       = azuread_group.admin_staff.object_id
}

# Role Assignments - Compliance Officers
resource "azurerm_role_assignment" "compliance_audit_reader" {
  scope              = azurerm_log_analytics_workspace.hipaa_audit.id
  role_definition_id = azurerm_role_definition.compliance_officer.role_definition_resource_id
  principal_id       = azuread_group.compliance_officers.object_id
}

# Conditional Access Policy - Require MFA for PHI Access
resource "azuread_conditional_access_policy" "require_mfa_phi" {
  display_name = "Require-MFA-PHI-Access-${var.environment}"
  state        = "enabled"

  conditions {
    client_app_types = ["all"]

    applications {
      included_applications = ["All"]
    }

    users {
      included_groups = [
        azuread_group.healthcare_providers.object_id,
        azuread_group.nurses.object_id,
        azuread_group.admin_staff.object_id
      ]
    }

    locations {
      included_locations = ["All"]
    }
  }

  grant_controls {
    operator          = "AND"
    built_in_controls = ["mfa", "compliantDevice"]
  }

  session_controls {
    sign_in_frequency = 4
    sign_in_frequency_period = "hours"

    persistent_browser_mode = "never"
  }
}

# Conditional Access Policy - Block access from high-risk locations
resource "azuread_conditional_access_policy" "block_risky_locations" {
  display_name = "Block-Risky-Locations-PHI-${var.environment}"
  state        = "enabled"

  conditions {
    client_app_types = ["all"]

    applications {
      included_applications = ["All"]
    }

    users {
      included_groups = [
        azuread_group.healthcare_providers.object_id,
        azuread_group.nurses.object_id,
        azuread_group.admin_staff.object_id
      ]
    }

    locations {
      included_locations = [var.blocked_location_id]
    }
  }

  grant_controls {
    operator          = "OR"
    built_in_controls = ["block"]
  }
}

# Conditional Access Policy - Require compliant device
resource "azuread_conditional_access_policy" "require_compliant_device" {
  display_name = "Require-Compliant-Device-PHI-${var.environment}"
  state        = "enabled"

  conditions {
    client_app_types = ["all"]

    applications {
      included_applications = ["All"]
    }

    users {
      included_groups = [
        azuread_group.healthcare_providers.object_id,
        azuread_group.nurses.object_id
      ]
    }

    platforms {
      included_platforms = ["windows", "macOS", "iOS", "android"]
    }
  }

  grant_controls {
    operator          = "OR"
    built_in_controls = ["compliantDevice", "domainJoinedDevice"]
  }
}

# Privileged Identity Management (PIM) for emergency access
resource "azurerm_pim_active_role_assignment" "emergency_access" {
  scope              = data.azurerm_resource_group.main.id
  role_definition_id = azurerm_role_definition.phi_administrator.role_definition_resource_id
  principal_id       = var.emergency_access_principal_id

  schedule {
    start_date_time = timestamp()

    expiration {
      duration_hours = 8
    }
  }

  justification = "Emergency PHI access for incident response"

  ticket {
    number = var.emergency_ticket_number
    system = "ServiceNow"
  }
}

# Just-In-Time (JIT) VM Access for HIPAA systems
resource "azurerm_security_center_jit_network_access_policy" "hipaa_jit" {
  name                = "hipaa-jit-policy-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.region

  jit_network_access_policy {
    virtual_machine_id = var.hipaa_vm_id

    port {
      number                     = 22
      protocol                   = "TCP"
      allowed_source_address_prefix = var.admin_ip_range
      max_request_access_duration = "PT4H"
    }

    port {
      number                     = 3389
      protocol                   = "TCP"
      allowed_source_address_prefix = var.admin_ip_range
      max_request_access_duration = "PT4H"
    }

    port {
      number                     = 1433
      protocol                   = "TCP"
      allowed_source_address_prefix = var.admin_ip_range
      max_request_access_duration = "PT2H"
    }
  }

  depends_on = [
    azurerm_security_center_subscription_pricing.hipaa_security
  ]
}

# Key Vault Access Policies with least privilege
resource "azurerm_key_vault_access_policy" "app_service_access" {
  key_vault_id = azurerm_key_vault.hipaa_kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = var.app_service_principal_id

  secret_permissions = [
    "Get",
    "List"
  ]

  key_permissions = [
    "Get",
    "Decrypt",
    "Encrypt"
  ]
}

# SQL Row-Level Security Configuration
resource "azurerm_mssql_database_extended_auditing_policy" "rls_audit" {
  database_id                             = azurerm_mssql_database.hipaa_db.id
  storage_endpoint                        = azurerm_storage_account.hipaa_audit_storage.primary_blob_endpoint
  storage_account_access_key              = azurerm_storage_account.hipaa_audit_storage.primary_access_key
  storage_account_access_key_is_secondary = false
  retention_in_days                       = 2555

  log_monitoring_enabled = true
}

# Variables
variable "blocked_location_id" {
  description = "Named location ID for blocked countries"
  type        = string
}

variable "emergency_access_principal_id" {
  description = "Principal ID for emergency access"
  type        = string
}

variable "emergency_ticket_number" {
  description = "Ticket number for emergency access"
  type        = string
  default     = "EMERGENCY-001"
}

variable "hipaa_vm_id" {
  description = "VM ID for JIT access"
  type        = string
  default     = ""
}

variable "admin_ip_range" {
  description = "Admin IP range for JIT access"
  type        = string
}

variable "app_service_principal_id" {
  description = "App Service principal ID for Key Vault access"
  type        = string
}

# Outputs
output "phi_reader_role_id" {
  description = "PHI Reader role definition ID"
  value       = azurerm_role_definition.phi_reader.role_definition_resource_id
}

output "phi_writer_role_id" {
  description = "PHI Writer role definition ID"
  value       = azurerm_role_definition.phi_writer.role_definition_resource_id
}

output "phi_administrator_role_id" {
  description = "PHI Administrator role definition ID"
  value       = azurerm_role_definition.phi_administrator.role_definition_resource_id
}

output "compliance_officer_role_id" {
  description = "Compliance Officer role definition ID"
  value       = azurerm_role_definition.compliance_officer.role_definition_resource_id
}

output "healthcare_providers_group_id" {
  description = "Healthcare Providers Azure AD group ID"
  value       = azuread_group.healthcare_providers.object_id
}

output "nurses_group_id" {
  description = "Nurses Azure AD group ID"
  value       = azuread_group.nurses.object_id
}

output "admin_staff_group_id" {
  description = "Administrative Staff Azure AD group ID"
  value       = azuread_group.admin_staff.object_id
}

output "compliance_officers_group_id" {
  description = "Compliance Officers Azure AD group ID"
  value       = azuread_group.compliance_officers.object_id
}
