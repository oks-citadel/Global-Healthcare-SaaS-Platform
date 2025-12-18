# POPIA Consent Management - Section 11 & 69
# Conditions for lawful processing

# Event Hub for consent events
resource "azurerm_eventhub_namespace" "popia_consent_events" {
  name                = "${var.organization_name}-popia-consent-${var.environment}"
  location            = var.sa_region
  resource_group_name = var.resource_group_name
  sku                 = "Standard"
  capacity            = 2

  identity {
    type = "SystemAssigned"
  }

  network_rulesets {
    default_action = "Deny"

    virtual_network_rule {
      subnet_id = azurerm_subnet.sa_healthcare_subnet.id
    }
  }

  tags = merge(local.popia_tags, {
    Purpose = "POPIA-Consent-Tracking"
  })
}

# Event Hub for consent granted
resource "azurerm_eventhub" "consent_granted" {
  name                = "consent-granted"
  namespace_name      = azurerm_eventhub_namespace.popia_consent_events.name
  resource_group_name = var.resource_group_name
  partition_count     = 4
  message_retention   = 7

  capture_description {
    enabled  = true
    encoding = "Avro"

    destination {
      name                = "EventHubArchive.AzureBlockBlob"
      archive_name_format = "{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}"
      blob_container_name = azurerm_storage_container.consent_records.name
      storage_account_id  = azurerm_storage_account.popia_storage.id
    }
  }
}

# Consent configuration
resource "azurerm_app_configuration_key" "consent_config" {
  configuration_store_id = azurerm_app_configuration.popia_config.id
  key                    = "compliance:popia:consent_management"
  value                  = jsonencode({
    purposes = [
      {
        id          = "healthcare_services"
        name        = "Healthcare Services"
        description = "Processing personal information for healthcare delivery"
        legal_basis = "consent"
        required    = true
      },
      {
        id          = "direct_marketing"
        name        = "Direct Marketing"
        description = "Marketing communications (requires opt-in)"
        legal_basis = "consent"
        required    = false
      }
    ]
    consent_requirements = {
      voluntary         = true
      specific          = true
      informed          = true
      unambiguous       = true
      separate_marketing = true
    }
    objection_rights = {
      enabled             = true
      easy_to_exercise    = true
      free_of_charge      = true
      no_penalty          = true
    }
  })
}

# Outputs
output "popia_consent_eventhub_id" {
  description = "POPIA consent Event Hub namespace ID"
  value       = azurerm_eventhub_namespace.popia_consent_events.id
}
