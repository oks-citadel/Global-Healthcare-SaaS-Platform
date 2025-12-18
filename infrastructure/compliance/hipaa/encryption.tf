# HIPAA Encryption Requirements - 45 CFR § 164.312(a)(2)(iv) and § 164.312(e)(2)(ii)
# Encryption at rest and in transit for PHI

# Encryption Key Rotation Configuration
resource "azurerm_key_vault_key" "phi_data_encryption_key" {
  name         = "phi-data-encryption-${var.environment}"
  key_vault_id = azurerm_key_vault.hipaa_kv.id
  key_type     = "RSA-HSM"
  key_size     = 4096

  key_opts = [
    "decrypt",
    "encrypt",
    "wrapKey",
    "unwrapKey"
  ]

  # Automatic key rotation every 90 days
  rotation_policy {
    automatic {
      time_before_expiry = "P30D"
    }

    expire_after         = "P90D"
    notify_before_expiry = "P29D"
  }

  tags = merge(local.hipaa_tags, {
    Purpose = "PHI-Data-Encryption"
  })
}

# Encryption key for database field-level encryption
resource "azurerm_key_vault_key" "field_level_encryption_key" {
  name         = "phi-field-encryption-${var.environment}"
  key_vault_id = azurerm_key_vault.hipaa_kv.id
  key_type     = "RSA-HSM"
  key_size     = 4096

  key_opts = [
    "decrypt",
    "encrypt"
  ]

  rotation_policy {
    automatic {
      time_before_expiry = "P30D"
    }

    expire_after         = "P90D"
    notify_before_expiry = "P29D"
  }

  tags = merge(local.hipaa_tags, {
    Purpose = "Field-Level-Encryption"
  })
}

# Encryption key for backup data
resource "azurerm_key_vault_key" "backup_encryption_key" {
  name         = "phi-backup-encryption-${var.environment}"
  key_vault_id = azurerm_key_vault.hipaa_kv.id
  key_type     = "RSA-HSM"
  key_size     = 4096

  key_opts = [
    "decrypt",
    "encrypt",
    "wrapKey",
    "unwrapKey"
  ]

  rotation_policy {
    automatic {
      time_before_expiry = "P30D"
    }

    expire_after         = "P90D"
    notify_before_expiry = "P29D"
  }

  tags = merge(local.hipaa_tags, {
    Purpose = "Backup-Encryption"
  })
}

# Application Gateway with SSL/TLS termination for HIPAA
resource "azurerm_application_gateway" "hipaa_appgw" {
  name                = "${var.organization_name}-hipaa-appgw-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.region

  sku {
    name     = "WAF_v2"
    tier     = "WAF_v2"
    capacity = 2
  }

  gateway_ip_configuration {
    name      = "gateway-ip-config"
    subnet_id = azurerm_subnet.appgw_subnet.id
  }

  frontend_port {
    name = "https-port"
    port = 443
  }

  frontend_port {
    name = "http-port"
    port = 80
  }

  frontend_ip_configuration {
    name                 = "frontend-ip-config"
    public_ip_address_id = azurerm_public_ip.appgw_pip.id
  }

  backend_address_pool {
    name = "backend-pool"
  }

  backend_http_settings {
    name                  = "https-backend-settings"
    cookie_based_affinity = "Disabled"
    port                  = 443
    protocol              = "Https"
    request_timeout       = 60

    # Enforce TLS 1.2 minimum
    pick_host_name_from_backend_address = false
    host_name                           = var.backend_hostname

    # Health probe
    probe_name = "health-probe"
  }

  http_listener {
    name                           = "https-listener"
    frontend_ip_configuration_name = "frontend-ip-config"
    frontend_port_name             = "https-port"
    protocol                       = "Https"
    ssl_certificate_name           = "hipaa-ssl-cert"
    require_sni                    = true

    # Only TLS 1.2+
    ssl_profile_name = "tls12-profile"
  }

  # HTTP to HTTPS redirect
  http_listener {
    name                           = "http-listener"
    frontend_ip_configuration_name = "frontend-ip-config"
    frontend_port_name             = "http-port"
    protocol                       = "Http"
  }

  request_routing_rule {
    name                       = "https-routing-rule"
    rule_type                  = "Basic"
    http_listener_name         = "https-listener"
    backend_address_pool_name  = "backend-pool"
    backend_http_settings_name = "https-backend-settings"
    priority                   = 100
  }

  redirect_configuration {
    name                 = "http-to-https-redirect"
    redirect_type        = "Permanent"
    target_listener_name = "https-listener"
    include_path         = true
    include_query_string = true
  }

  request_routing_rule {
    name                        = "http-redirect-rule"
    rule_type                   = "Basic"
    http_listener_name          = "http-listener"
    redirect_configuration_name = "http-to-https-redirect"
    priority                    = 200
  }

  ssl_certificate {
    name                = "hipaa-ssl-cert"
    key_vault_secret_id = azurerm_key_vault_certificate.ssl_cert.secret_id
  }

  ssl_profile {
    name = "tls12-profile"

    ssl_policy {
      policy_type          = "Custom"
      min_protocol_version = "TLSv1_2"
      cipher_suites = [
        "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
        "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
        "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
        "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256"
      ]
    }
  }

  probe {
    name                = "health-probe"
    protocol            = "Https"
    path                = "/health"
    interval            = 30
    timeout             = 30
    unhealthy_threshold = 3
    host                = var.backend_hostname
  }

  # WAF Configuration for HIPAA
  waf_configuration {
    enabled                  = true
    firewall_mode            = "Prevention"
    rule_set_type            = "OWASP"
    rule_set_version         = "3.2"
    request_body_check       = true
    max_request_body_size_kb = 128
    file_upload_limit_mb     = 100
  }

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.appgw_identity.id]
  }

  tags = merge(local.hipaa_tags, {
    Component = "Network-Encryption"
  })
}

# SSL Certificate from Key Vault
resource "azurerm_key_vault_certificate" "ssl_cert" {
  name         = "hipaa-ssl-certificate"
  key_vault_id = azurerm_key_vault.hipaa_kv.id

  certificate_policy {
    issuer_parameters {
      name = "Self" # Use proper CA in production
    }

    key_properties {
      exportable = true
      key_size   = 4096
      key_type   = "RSA"
      reuse_key  = false
    }

    lifetime_action {
      action {
        action_type = "AutoRenew"
      }

      trigger {
        days_before_expiry = 30
      }
    }

    secret_properties {
      content_type = "application/x-pkcs12"
    }

    x509_certificate_properties {
      key_usage = [
        "cRLSign",
        "dataEncipherment",
        "digitalSignature",
        "keyAgreement",
        "keyCertSign",
        "keyEncipherment",
      ]

      subject            = "CN=${var.domain_name}"
      validity_in_months = 12

      subject_alternative_names {
        dns_names = [
          var.domain_name,
          "*.${var.domain_name}"
        ]
      }
    }
  }

  tags = local.hipaa_tags
}

# User Assigned Identity for App Gateway to access Key Vault
resource "azurerm_user_assigned_identity" "appgw_identity" {
  name                = "${var.organization_name}-appgw-identity-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.region

  tags = local.hipaa_tags
}

# Grant App Gateway access to Key Vault
resource "azurerm_key_vault_access_policy" "appgw_kv_access" {
  key_vault_id = azurerm_key_vault.hipaa_kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_user_assigned_identity.appgw_identity.principal_id

  secret_permissions = [
    "Get",
    "List"
  ]

  certificate_permissions = [
    "Get",
    "List"
  ]
}

# Public IP for Application Gateway
resource "azurerm_public_ip" "appgw_pip" {
  name                = "${var.organization_name}-appgw-pip-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.region
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = local.hipaa_tags
}

# Subnet for Application Gateway
resource "azurerm_subnet" "appgw_subnet" {
  name                 = "appgw-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.hipaa_vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# VPN Gateway for secure remote access (HIPAA requirement)
resource "azurerm_vpn_gateway" "hipaa_vpn" {
  name                = "${var.organization_name}-vpn-gateway-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.region
  virtual_hub_id      = azurerm_virtual_hub.hipaa_hub.id

  tags = merge(local.hipaa_tags, {
    Component = "Secure-Remote-Access"
  })
}

# Disk Encryption Set for VM disks
resource "azurerm_disk_encryption_set" "hipaa_des" {
  name                = "${var.organization_name}-disk-encryption-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.region
  key_vault_key_id    = azurerm_key_vault_key.phi_data_encryption_key.id

  identity {
    type = "SystemAssigned"
  }

  tags = merge(local.hipaa_tags, {
    Purpose = "VM-Disk-Encryption"
  })
}

# Grant Disk Encryption Set access to Key Vault
resource "azurerm_key_vault_access_policy" "des_kv_access" {
  key_vault_id = azurerm_key_vault.hipaa_kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_disk_encryption_set.hipaa_des.identity[0].principal_id

  key_permissions = [
    "Get",
    "WrapKey",
    "UnwrapKey"
  ]
}

# Variables
variable "backend_hostname" {
  description = "Backend hostname for Application Gateway"
  type        = string
}

variable "domain_name" {
  description = "Domain name for SSL certificate"
  type        = string
}

variable "sql_admin_username" {
  description = "SQL administrator username"
  type        = string
  sensitive   = true
}

variable "azuread_admin_username" {
  description = "Azure AD administrator username"
  type        = string
}

variable "azuread_admin_object_id" {
  description = "Azure AD administrator object ID"
  type        = string
}

variable "security_contact_email" {
  description = "Security contact email for alerts"
  type        = string
}

variable "security_contact_phone" {
  description = "Security contact phone"
  type        = string
  default     = ""
}

variable "allowed_ip_ranges" {
  description = "Allowed IP ranges for Key Vault and Storage"
  type        = list(string)
  default     = []
}

variable "log_analytics_workspace_id" {
  description = "Log Analytics workspace ID for diagnostics"
  type        = string
}

# Outputs
output "data_encryption_key_id" {
  description = "PHI data encryption key ID"
  value       = azurerm_key_vault_key.phi_data_encryption_key.id
}

output "field_encryption_key_id" {
  description = "Field-level encryption key ID"
  value       = azurerm_key_vault_key.field_level_encryption_key.id
}

output "backup_encryption_key_id" {
  description = "Backup encryption key ID"
  value       = azurerm_key_vault_key.backup_encryption_key.id
}

output "application_gateway_id" {
  description = "Application Gateway ID"
  value       = azurerm_application_gateway.hipaa_appgw.id
}

output "disk_encryption_set_id" {
  description = "Disk Encryption Set ID"
  value       = azurerm_disk_encryption_set.hipaa_des.id
}
