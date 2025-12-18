#!/bin/bash

#############################################
# Azure Key Vault Provisioning Script
#
# Purpose: Provision Azure Key Vault for secure secret management
# Compliance: HIPAA-compliant secret storage
#############################################

set -e

# Configuration
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-unified-health-rg}"
LOCATION="${AZURE_LOCATION:-eastus}"
KEY_VAULT_NAME="${AZURE_KEY_VAULT_NAME:-unified-health-kv-$(date +%s)}"
ENVIRONMENT="${ENVIRONMENT:-production}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Azure Key Vault Provisioning${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI is not installed${NC}"
    echo "Please install Azure CLI from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
echo -e "${YELLOW}Checking Azure login status...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in. Please log in to Azure...${NC}"
    az login
fi

# Display current subscription
SUBSCRIPTION=$(az account show --query name -o tsv)
echo -e "${GREEN}Using subscription: ${SUBSCRIPTION}${NC}"

# Create resource group if it doesn't exist
echo -e "${YELLOW}Checking resource group...${NC}"
if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}Creating resource group: ${RESOURCE_GROUP}${NC}"
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --tags "Environment=$ENVIRONMENT" "Project=UnifiedHealthcare" "ManagedBy=Script"
else
    echo -e "${GREEN}Resource group already exists: ${RESOURCE_GROUP}${NC}"
fi

# Create Key Vault
echo -e "${YELLOW}Creating Key Vault: ${KEY_VAULT_NAME}${NC}"
az keyvault create \
    --name "$KEY_VAULT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --enabled-for-deployment true \
    --enabled-for-disk-encryption true \
    --enabled-for-template-deployment true \
    --enable-soft-delete true \
    --soft-delete-retention-days 90 \
    --enable-purge-protection true \
    --enable-rbac-authorization false \
    --sku premium \
    --tags "Environment=$ENVIRONMENT" "Project=UnifiedHealthcare" "Compliance=HIPAA"

echo -e "${GREEN}Key Vault created successfully!${NC}"

# Enable diagnostic settings for audit logging (HIPAA requirement)
echo -e "${YELLOW}Configuring diagnostic settings...${NC}"

# Get the Key Vault resource ID
KV_RESOURCE_ID=$(az keyvault show \
    --name "$KEY_VAULT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query id -o tsv)

# Note: You'll need to create a Log Analytics workspace first
# Uncomment and configure the following if you have a workspace:
# LOG_ANALYTICS_WORKSPACE_ID="your-workspace-id"
# az monitor diagnostic-settings create \
#     --name "KeyVault-Diagnostics" \
#     --resource "$KV_RESOURCE_ID" \
#     --workspace "$LOG_ANALYTICS_WORKSPACE_ID" \
#     --logs '[{"category": "AuditEvent","enabled": true,"retentionPolicy": {"enabled": true,"days": 365}}]' \
#     --metrics '[{"category": "AllMetrics","enabled": true,"retentionPolicy": {"enabled": true,"days": 365}}]'

echo -e "${YELLOW}Configuring access policies...${NC}"

# Get current user object ID
USER_OBJECT_ID=$(az ad signed-in-user show --query id -o tsv)

# Grant current user full permissions (for initial setup)
az keyvault set-policy \
    --name "$KEY_VAULT_NAME" \
    --object-id "$USER_OBJECT_ID" \
    --secret-permissions get list set delete backup restore recover purge \
    --key-permissions get list create delete backup restore recover purge encrypt decrypt unwrapKey wrapKey \
    --certificate-permissions get list create delete backup restore recover purge

echo -e "${GREEN}Access policies configured!${NC}"

# Create a service principal for the application (optional)
echo -e "${YELLOW}Would you like to create a service principal for the application? (y/n)${NC}"
read -r CREATE_SP

if [[ "$CREATE_SP" == "y" || "$CREATE_SP" == "Y" ]]; then
    SP_NAME="unified-health-app-sp-$ENVIRONMENT"

    echo -e "${YELLOW}Creating service principal: ${SP_NAME}${NC}"
    SP_OUTPUT=$(az ad sp create-for-rbac \
        --name "$SP_NAME" \
        --role "Key Vault Secrets User" \
        --scopes "$KV_RESOURCE_ID" \
        --query "{appId:appId, password:password, tenant:tenant}" -o json)

    APP_ID=$(echo "$SP_OUTPUT" | jq -r .appId)
    APP_SECRET=$(echo "$SP_OUTPUT" | jq -r .password)
    TENANT_ID=$(echo "$SP_OUTPUT" | jq -r .tenant)

    # Grant the service principal access to Key Vault
    az keyvault set-policy \
        --name "$KEY_VAULT_NAME" \
        --spn "$APP_ID" \
        --secret-permissions get list \
        --key-permissions get list decrypt unwrapKey

    echo -e "${GREEN}Service principal created!${NC}"
    echo -e "${YELLOW}IMPORTANT: Save these credentials securely!${NC}"
    echo -e "AZURE_CLIENT_ID=${APP_ID}"
    echo -e "AZURE_CLIENT_SECRET=${APP_SECRET}"
    echo -e "AZURE_TENANT_ID=${TENANT_ID}"
fi

# Output Key Vault information
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Key Vault Provisioning Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Key Vault Name: ${KEY_VAULT_NAME}"
echo -e "Key Vault URL: https://${KEY_VAULT_NAME}.vault.azure.net/"
echo -e "Resource Group: ${RESOURCE_GROUP}"
echo -e "Location: ${LOCATION}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Add the following to your .env file:${NC}"
echo -e "AZURE_KEY_VAULT_URL=https://${KEY_VAULT_NAME}.vault.azure.net/"
echo -e "AZURE_KEY_VAULT_ENABLED=true"

# Save configuration to file
cat > "keyvault-config-${ENVIRONMENT}.txt" <<EOF
# Azure Key Vault Configuration
# Generated: $(date)

AZURE_KEY_VAULT_NAME=${KEY_VAULT_NAME}
AZURE_KEY_VAULT_URL=https://${KEY_VAULT_NAME}.vault.azure.net/
AZURE_RESOURCE_GROUP=${RESOURCE_GROUP}
AZURE_LOCATION=${LOCATION}
AZURE_KEY_VAULT_ENABLED=true

# Add these to your application's .env file:
# AZURE_KEY_VAULT_URL=https://${KEY_VAULT_NAME}.vault.azure.net/
# AZURE_CLIENT_ID=<from service principal>
# AZURE_CLIENT_SECRET=<from service principal>
# AZURE_TENANT_ID=<from service principal>
# AZURE_KEY_VAULT_ENABLED=true
EOF

echo -e "${GREEN}Configuration saved to: keyvault-config-${ENVIRONMENT}.txt${NC}"

echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Run ./populate-keyvault.sh to populate secrets"
echo -e "2. Configure your application with the Key Vault credentials"
echo -e "3. Update your .env file with AZURE_KEY_VAULT_URL and credentials"
