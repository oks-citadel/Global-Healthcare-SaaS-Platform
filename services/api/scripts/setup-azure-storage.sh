#!/bin/bash

##############################################################################
# Azure Blob Storage Setup Script
#
# This script sets up Azure Blob Storage for the Global Healthcare platform
# with HIPAA-compliant configuration.
#
# Prerequisites:
# - Azure CLI installed and authenticated (az login)
# - Appropriate Azure subscription and permissions
#
# Usage:
#   ./setup-azure-storage.sh [environment]
#
# Environment: dev, staging, production (default: dev)
##############################################################################

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="${1:-dev}"
RESOURCE_GROUP="healthcare-${ENVIRONMENT}-rg"
LOCATION="eastus"
STORAGE_ACCOUNT_PREFIX="healthcare"
CONTAINER_NAME="healthcare-documents"

# Generate unique storage account name (lowercase, alphanumeric only, max 24 chars)
TIMESTAMP=$(date +%s)
RANDOM_SUFFIX=$(echo $RANDOM | md5sum | head -c 6)
STORAGE_ACCOUNT_NAME="${STORAGE_ACCOUNT_PREFIX}${ENVIRONMENT}${RANDOM_SUFFIX}"

# Ensure storage account name is lowercase and max 24 chars
STORAGE_ACCOUNT_NAME=$(echo "${STORAGE_ACCOUNT_NAME}" | tr '[:upper:]' '[:lower:]' | cut -c1-24)

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Azure Blob Storage Setup${NC}"
echo -e "${GREEN}======================================${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Resource Group: ${YELLOW}${RESOURCE_GROUP}${NC}"
echo -e "Location: ${YELLOW}${LOCATION}${NC}"
echo -e "Storage Account: ${YELLOW}${STORAGE_ACCOUNT_NAME}${NC}"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI is not installed${NC}"
    echo "Please install from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    echo -e "${RED}Error: Not logged in to Azure${NC}"
    echo "Please run: az login"
    exit 1
fi

# Get current subscription
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
echo -e "Using subscription: ${YELLOW}${SUBSCRIPTION_NAME} (${SUBSCRIPTION_ID})${NC}"
echo ""

read -p "Continue with setup? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 0
fi

echo -e "${GREEN}Step 1: Creating resource group...${NC}"
if az group show --name "${RESOURCE_GROUP}" &> /dev/null; then
    echo -e "${YELLOW}Resource group already exists${NC}"
else
    az group create \
        --name "${RESOURCE_GROUP}" \
        --location "${LOCATION}" \
        --tags Environment="${ENVIRONMENT}" Purpose="Healthcare Document Storage"
    echo -e "${GREEN}✓ Resource group created${NC}"
fi
echo ""

echo -e "${GREEN}Step 2: Creating storage account...${NC}"
az storage account create \
    --name "${STORAGE_ACCOUNT_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --location "${LOCATION}" \
    --sku Standard_GRS \
    --kind StorageV2 \
    --access-tier Hot \
    --https-only true \
    --min-tls-version TLS1_2 \
    --allow-blob-public-access false \
    --encryption-services blob \
    --tags Environment="${ENVIRONMENT}" Purpose="Healthcare Documents" HIPAACompliant="true"
echo -e "${GREEN}✓ Storage account created${NC}"
echo ""

echo -e "${GREEN}Step 3: Enabling blob versioning...${NC}"
az storage account blob-service-properties update \
    --account-name "${STORAGE_ACCOUNT_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --enable-versioning true
echo -e "${GREEN}✓ Blob versioning enabled${NC}"
echo ""

echo -e "${GREEN}Step 4: Enabling soft delete...${NC}"
az storage account blob-service-properties update \
    --account-name "${STORAGE_ACCOUNT_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --enable-delete-retention true \
    --delete-retention-days 30
echo -e "${GREEN}✓ Soft delete enabled (30 days)${NC}"
echo ""

echo -e "${GREEN}Step 5: Creating blob container...${NC}"
STORAGE_KEY=$(az storage account keys list \
    --account-name "${STORAGE_ACCOUNT_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --query '[0].value' -o tsv)

az storage container create \
    --name "${CONTAINER_NAME}" \
    --account-name "${STORAGE_ACCOUNT_NAME}" \
    --account-key "${STORAGE_KEY}" \
    --public-access off \
    --metadata purpose="healthcare-documents" hipaaCompliant="true" encryptionAtRest="true"
echo -e "${GREEN}✓ Container created${NC}"
echo ""

echo -e "${GREEN}Step 6: Creating quarantine container...${NC}"
az storage container create \
    --name "${CONTAINER_NAME}-quarantine" \
    --account-name "${STORAGE_ACCOUNT_NAME}" \
    --account-key "${STORAGE_KEY}" \
    --public-access off \
    --metadata purpose="quarantine" description="Infected files quarantine"
echo -e "${GREEN}✓ Quarantine container created${NC}"
echo ""

echo -e "${GREEN}Step 7: Applying lifecycle management policies...${NC}"
if [ -f "azure-lifecycle-policy.json" ]; then
    az storage account management-policy create \
        --account-name "${STORAGE_ACCOUNT_NAME}" \
        --resource-group "${RESOURCE_GROUP}" \
        --policy @azure-lifecycle-policy.json
    echo -e "${GREEN}✓ Lifecycle policies applied${NC}"
else
    echo -e "${YELLOW}⚠ azure-lifecycle-policy.json not found, skipping${NC}"
fi
echo ""

# Optional: Enable Azure Defender for Storage (production only)
if [ "${ENVIRONMENT}" == "production" ]; then
    echo -e "${GREEN}Step 8: Enabling Azure Defender for Storage...${NC}"
    read -p "Enable Azure Defender? (costs apply) (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        az security pricing create \
            --name StorageAccounts \
            --tier standard
        echo -e "${GREEN}✓ Azure Defender enabled${NC}"
    else
        echo -e "${YELLOW}⚠ Azure Defender not enabled${NC}"
    fi
    echo ""
fi

echo -e "${GREEN}Step 9: Configuring CORS...${NC}"
cat > cors-config.json << EOF
[
  {
    "allowedOrigins": ["https://app.yourdomain.com", "https://admin.yourdomain.com"],
    "allowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS"],
    "allowedHeaders": ["x-ms-blob-type", "x-ms-blob-content-type", "x-ms-meta-*", "content-type", "content-length"],
    "exposedHeaders": ["x-ms-request-id", "x-ms-version", "content-type", "content-length", "etag"],
    "maxAgeInSeconds": 3600
  }
]
EOF

az storage cors add \
    --account-name "${STORAGE_ACCOUNT_NAME}" \
    --account-key "${STORAGE_KEY}" \
    --services b \
    --origins "https://app.yourdomain.com" "https://admin.yourdomain.com" \
    --methods GET PUT POST DELETE HEAD OPTIONS \
    --allowed-headers "x-ms-blob-type" "x-ms-blob-content-type" "x-ms-meta-*" "content-type" "content-length" \
    --exposed-headers "x-ms-request-id" "x-ms-version" "content-type" "content-length" "etag" \
    --max-age 3600

rm cors-config.json
echo -e "${GREEN}✓ CORS configured${NC}"
echo ""

# Get connection string
CONNECTION_STRING=$(az storage account show-connection-string \
    --name "${STORAGE_ACCOUNT_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --query connectionString -o tsv)

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "Add these to your .env file:"
echo ""
echo -e "${YELLOW}AZURE_STORAGE_CONNECTION_STRING=${CONNECTION_STRING}${NC}"
echo -e "${YELLOW}AZURE_STORAGE_CONTAINER_NAME=${CONTAINER_NAME}${NC}"
echo ""
echo -e "Storage Account: ${GREEN}${STORAGE_ACCOUNT_NAME}${NC}"
echo -e "Resource Group: ${GREEN}${RESOURCE_GROUP}${NC}"
echo -e "Location: ${GREEN}${LOCATION}${NC}"
echo ""
echo -e "Next steps:"
echo "1. Update your .env file with the connection string above"
echo "2. Configure virus scanning (ClamAV or Azure Defender)"
echo "3. Update CORS origins with your actual domain names"
echo "4. Test upload and download functionality"
echo "5. Monitor storage metrics in Azure Portal"
echo ""
echo -e "${GREEN}Setup script completed successfully!${NC}"
