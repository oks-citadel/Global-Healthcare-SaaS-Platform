#!/bin/bash
# ============================================
# DNS-01 Challenge Setup Script for UnifiedHealth
# ============================================
# This script sets up Azure DNS and cert-manager
# for DNS-01 ACME challenges
# ============================================

set -e

# Configuration - Update these values
RESOURCE_GROUP="rg-unified-health-dev2"
AKS_CLUSTER_NAME="aks-unified-health-dev2"
DNS_RESOURCE_GROUP="rg-unified-health-dns"
DNS_ZONE_NAME="unifiedhealth.com"
MANAGED_IDENTITY_NAME="id-cert-manager-dev2"
LOCATION="eastus"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}DNS-01 Challenge Setup for UnifiedHealth${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI not found. Please install az CLI.${NC}"
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}kubectl not found. Please install kubectl.${NC}"
    exit 1
fi

if ! command -v helm &> /dev/null; then
    echo -e "${RED}Helm not found. Please install helm.${NC}"
    exit 1
fi

echo -e "${GREEN}Prerequisites OK${NC}"
echo ""

# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo "Using subscription: $SUBSCRIPTION_ID"
echo ""

# Function to check and create resources
check_and_create() {
    local resource_type=$1
    local check_command=$2
    local create_command=$3
    local description=$4

    echo -e "${YELLOW}Checking $description...${NC}"
    if eval "$check_command" &> /dev/null; then
        echo -e "${GREEN}$description already exists${NC}"
    else
        echo "Creating $description..."
        eval "$create_command"
        echo -e "${GREEN}$description created${NC}"
    fi
}

# Step 1: Check/Enable OIDC issuer and workload identity on AKS
echo -e "\n${YELLOW}Step 1: Checking AKS workload identity...${NC}"
OIDC_ENABLED=$(az aks show --name $AKS_CLUSTER_NAME --resource-group $RESOURCE_GROUP --query "oidcIssuerProfile.enabled" -o tsv 2>/dev/null || echo "false")

if [ "$OIDC_ENABLED" != "true" ]; then
    echo "Enabling OIDC issuer and workload identity on AKS..."
    az aks update \
        --name $AKS_CLUSTER_NAME \
        --resource-group $RESOURCE_GROUP \
        --enable-oidc-issuer \
        --enable-workload-identity
    echo -e "${GREEN}OIDC and Workload Identity enabled${NC}"
else
    echo -e "${GREEN}OIDC issuer already enabled${NC}"
fi

# Get OIDC issuer URL
AKS_OIDC_ISSUER=$(az aks show \
    --name $AKS_CLUSTER_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "oidcIssuerProfile.issuerUrl" -o tsv)
echo "OIDC Issuer URL: $AKS_OIDC_ISSUER"

# Step 2: Create DNS resource group
echo -e "\n${YELLOW}Step 2: Creating DNS resource group...${NC}"
check_and_create \
    "resource-group" \
    "az group show --name $DNS_RESOURCE_GROUP" \
    "az group create --name $DNS_RESOURCE_GROUP --location $LOCATION" \
    "DNS resource group"

# Step 3: Create DNS zone
echo -e "\n${YELLOW}Step 3: Creating DNS zone...${NC}"
check_and_create \
    "dns-zone" \
    "az network dns zone show --name $DNS_ZONE_NAME --resource-group $DNS_RESOURCE_GROUP" \
    "az network dns zone create --name $DNS_ZONE_NAME --resource-group $DNS_RESOURCE_GROUP" \
    "DNS zone $DNS_ZONE_NAME"

# Get DNS zone name servers
echo ""
echo -e "${YELLOW}DNS Zone Name Servers (configure at your domain registrar):${NC}"
az network dns zone show \
    --name $DNS_ZONE_NAME \
    --resource-group $DNS_RESOURCE_GROUP \
    --query "nameServers" -o tsv

# Step 4: Create managed identity
echo -e "\n${YELLOW}Step 4: Creating managed identity for cert-manager...${NC}"
check_and_create \
    "managed-identity" \
    "az identity show --name $MANAGED_IDENTITY_NAME --resource-group $RESOURCE_GROUP" \
    "az identity create --name $MANAGED_IDENTITY_NAME --resource-group $RESOURCE_GROUP --location $LOCATION" \
    "Managed identity $MANAGED_IDENTITY_NAME"

# Get identity details
IDENTITY_CLIENT_ID=$(az identity show \
    --name $MANAGED_IDENTITY_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "clientId" -o tsv)

IDENTITY_PRINCIPAL_ID=$(az identity show \
    --name $MANAGED_IDENTITY_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "principalId" -o tsv)

echo "Managed Identity Client ID: $IDENTITY_CLIENT_ID"

# Step 5: Assign DNS Zone Contributor role
echo -e "\n${YELLOW}Step 5: Assigning DNS Zone Contributor role...${NC}"
DNS_ZONE_ID=$(az network dns zone show \
    --name $DNS_ZONE_NAME \
    --resource-group $DNS_RESOURCE_GROUP \
    --query "id" -o tsv)

# Check if role assignment exists
ROLE_EXISTS=$(az role assignment list \
    --assignee $IDENTITY_PRINCIPAL_ID \
    --scope $DNS_ZONE_ID \
    --query "[?roleDefinitionName=='DNS Zone Contributor']" -o tsv)

if [ -z "$ROLE_EXISTS" ]; then
    echo "Creating role assignment..."
    az role assignment create \
        --assignee $IDENTITY_PRINCIPAL_ID \
        --role "DNS Zone Contributor" \
        --scope $DNS_ZONE_ID
    echo -e "${GREEN}Role assignment created${NC}"
else
    echo -e "${GREEN}Role assignment already exists${NC}"
fi

# Step 6: Create federated credential
echo -e "\n${YELLOW}Step 6: Creating federated credential...${NC}"
IDENTITY_ID=$(az identity show \
    --name $MANAGED_IDENTITY_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "id" -o tsv)

FEDERATED_EXISTS=$(az identity federated-credential list \
    --identity-name $MANAGED_IDENTITY_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "[?name=='cert-manager-federated']" -o tsv)

if [ -z "$FEDERATED_EXISTS" ]; then
    echo "Creating federated credential..."
    az identity federated-credential create \
        --name cert-manager-federated \
        --identity-name $MANAGED_IDENTITY_NAME \
        --resource-group $RESOURCE_GROUP \
        --issuer $AKS_OIDC_ISSUER \
        --subject "system:serviceaccount:cert-manager:cert-manager" \
        --audience "api://AzureADTokenExchange"
    echo -e "${GREEN}Federated credential created${NC}"
else
    echo -e "${GREEN}Federated credential already exists${NC}"
fi

# Step 7: Get AKS credentials
echo -e "\n${YELLOW}Step 7: Getting AKS credentials...${NC}"
az aks get-credentials \
    --name $AKS_CLUSTER_NAME \
    --resource-group $RESOURCE_GROUP \
    --overwrite-existing

# Step 8: Check cert-manager installation
echo -e "\n${YELLOW}Step 8: Checking cert-manager installation...${NC}"
if kubectl get namespace cert-manager &> /dev/null; then
    echo -e "${GREEN}cert-manager namespace exists${NC}"
else
    echo "cert-manager not installed. Installing..."
    helm repo add jetstack https://charts.jetstack.io
    helm repo update
    helm install cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --version v1.16.2 \
        --set crds.enabled=true
fi

# Step 9: Display summary
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Configuration Summary:"
echo "----------------------"
echo "Subscription ID:      $SUBSCRIPTION_ID"
echo "Resource Group:       $RESOURCE_GROUP"
echo "DNS Resource Group:   $DNS_RESOURCE_GROUP"
echo "DNS Zone:             $DNS_ZONE_NAME"
echo "AKS Cluster:          $AKS_CLUSTER_NAME"
echo "OIDC Issuer:          $AKS_OIDC_ISSUER"
echo "Identity Client ID:   $IDENTITY_CLIENT_ID"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update your domain registrar with the Azure DNS name servers (shown above)"
echo "2. Wait for DNS propagation (up to 48 hours)"
echo "3. Edit dns01-clusterissuer-azure.yaml with the following values:"
echo "   - subscriptionID: $SUBSCRIPTION_ID"
echo "   - resourceGroupName: $DNS_RESOURCE_GROUP"
echo "   - hostedZoneName: $DNS_ZONE_NAME"
echo "   - managedIdentity.clientID: $IDENTITY_CLIENT_ID"
echo "4. Apply the ClusterIssuer:"
echo "   kubectl apply -f dns01-clusterissuer-azure.yaml"
echo "5. Apply your Certificate resources:"
echo "   kubectl apply -f dns01-certificate.yaml"
echo ""
echo -e "${YELLOW}To verify setup:${NC}"
echo "kubectl describe clusterissuer letsencrypt-prod-dns01"
echo "kubectl describe certificate unified-health-tls-dns01 -n unified-health"
