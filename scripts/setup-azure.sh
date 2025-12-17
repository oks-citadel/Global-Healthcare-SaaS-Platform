#!/bin/bash
# ============================================
# UnifiedHealth Platform - Azure Infrastructure Setup
# ============================================
# This script sets up all Azure resources for the platform
# Usage: ./scripts/setup-azure.sh [environment]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-staging}"
LOCATION="${LOCATION:-eastus}"
RESOURCE_GROUP="unified-health-rg-${ENVIRONMENT}"
AKS_CLUSTER_NAME="unified-health-aks-${ENVIRONMENT}"
ACR_NAME="unifiedhealthacr${ENVIRONMENT}"
POSTGRES_SERVER="unified-health-postgres-${ENVIRONMENT}"
REDIS_NAME="unified-health-redis-${ENVIRONMENT}"
KEYVAULT_NAME="unified-health-kv-${ENVIRONMENT}"
VNET_NAME="unified-health-vnet-${ENVIRONMENT}"
STORAGE_ACCOUNT="unifiedhealthsa${ENVIRONMENT}"

# AKS Configuration
AKS_NODE_COUNT="${AKS_NODE_COUNT:-3}"
AKS_NODE_SIZE="${AKS_NODE_SIZE:-Standard_D4s_v3}"
AKS_VERSION="${AKS_VERSION:-1.28}"

# Database Configuration
POSTGRES_VERSION="15"
POSTGRES_SKU="${POSTGRES_SKU:-GP_Gen5_2}"
POSTGRES_STORAGE="${POSTGRES_STORAGE:-102400}"
POSTGRES_ADMIN="unifiedhealthadmin"

# Redis Configuration
REDIS_SKU="${REDIS_SKU:-Standard}"
REDIS_FAMILY="${REDIS_FAMILY:-C}"
REDIS_CAPACITY="${REDIS_CAPACITY:-1}"

# Log functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Error handler
error_exit() {
    log_error "$1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    command -v az >/dev/null 2>&1 || error_exit "Azure CLI is not installed"

    # Check Azure login
    az account show >/dev/null 2>&1 || error_exit "Not logged in to Azure. Run 'az login'"

    # Show subscription
    SUBSCRIPTION=$(az account show --query name -o tsv)
    log_info "Using subscription: ${SUBSCRIPTION}"

    log_success "Prerequisites check passed"
}

# Confirm setup
confirm_setup() {
    log_warning "=========================================="
    log_warning "AZURE INFRASTRUCTURE SETUP"
    log_warning "Environment: ${ENVIRONMENT}"
    log_warning "Location: ${LOCATION}"
    log_warning "Resource Group: ${RESOURCE_GROUP}"
    log_warning "=========================================="

    if [ "${SKIP_CONFIRMATION:-false}" != "true" ]; then
        read -p "Are you sure you want to create these resources? (yes/no): " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            log_info "Setup cancelled"
            exit 0
        fi
    fi
}

# Create resource group
create_resource_group() {
    log_info "Creating resource group..."

    if az group show --name "${RESOURCE_GROUP}" >/dev/null 2>&1; then
        log_warning "Resource group already exists"
    else
        az group create \
            --name "${RESOURCE_GROUP}" \
            --location "${LOCATION}" \
            --tags "environment=${ENVIRONMENT}" "project=unified-health" || error_exit "Failed to create resource group"

        log_success "Resource group created"
    fi
}

# Create Virtual Network
create_vnet() {
    log_info "Creating Virtual Network..."

    if az network vnet show --resource-group "${RESOURCE_GROUP}" --name "${VNET_NAME}" >/dev/null 2>&1; then
        log_warning "Virtual Network already exists"
    else
        az network vnet create \
            --resource-group "${RESOURCE_GROUP}" \
            --name "${VNET_NAME}" \
            --address-prefix 10.0.0.0/16 \
            --location "${LOCATION}" || error_exit "Failed to create Virtual Network"

        log_success "Virtual Network created"
    fi

    # Create subnets
    log_info "Creating subnets..."

    # AKS subnet
    if ! az network vnet subnet show --resource-group "${RESOURCE_GROUP}" --vnet-name "${VNET_NAME}" --name aks-subnet >/dev/null 2>&1; then
        az network vnet subnet create \
            --resource-group "${RESOURCE_GROUP}" \
            --vnet-name "${VNET_NAME}" \
            --name aks-subnet \
            --address-prefix 10.0.1.0/24 || error_exit "Failed to create AKS subnet"
    fi

    # Database subnet
    if ! az network vnet subnet show --resource-group "${RESOURCE_GROUP}" --vnet-name "${VNET_NAME}" --name database-subnet >/dev/null 2>&1; then
        az network vnet subnet create \
            --resource-group "${RESOURCE_GROUP}" \
            --vnet-name "${VNET_NAME}" \
            --name database-subnet \
            --address-prefix 10.0.2.0/24 \
            --service-endpoints Microsoft.Sql || error_exit "Failed to create database subnet"
    fi

    # Redis subnet
    if ! az network vnet subnet show --resource-group "${RESOURCE_GROUP}" --vnet-name "${VNET_NAME}" --name redis-subnet >/dev/null 2>&1; then
        az network vnet subnet create \
            --resource-group "${RESOURCE_GROUP}" \
            --vnet-name "${VNET_NAME}" \
            --name redis-subnet \
            --address-prefix 10.0.3.0/24 || error_exit "Failed to create Redis subnet"
    fi

    log_success "Subnets created"
}

# Create Azure Container Registry
create_acr() {
    log_info "Creating Azure Container Registry..."

    if az acr show --name "${ACR_NAME}" --resource-group "${RESOURCE_GROUP}" >/dev/null 2>&1; then
        log_warning "ACR already exists"
    else
        az acr create \
            --resource-group "${RESOURCE_GROUP}" \
            --name "${ACR_NAME}" \
            --sku Premium \
            --location "${LOCATION}" \
            --admin-enabled false || error_exit "Failed to create ACR"

        log_success "ACR created"
    fi

    # Enable geo-replication for production
    if [ "${ENVIRONMENT}" == "production" ]; then
        log_info "Configuring geo-replication..."
        az acr replication create \
            --registry "${ACR_NAME}" \
            --location westus \
            --resource-group "${RESOURCE_GROUP}" || log_warning "Failed to create geo-replication"
    fi
}

# Create AKS cluster
create_aks() {
    log_info "Creating AKS cluster (this may take 10-15 minutes)..."

    if az aks show --name "${AKS_CLUSTER_NAME}" --resource-group "${RESOURCE_GROUP}" >/dev/null 2>&1; then
        log_warning "AKS cluster already exists"
    else
        # Get subnet ID
        SUBNET_ID=$(az network vnet subnet show \
            --resource-group "${RESOURCE_GROUP}" \
            --vnet-name "${VNET_NAME}" \
            --name aks-subnet \
            --query id -o tsv)

        az aks create \
            --resource-group "${RESOURCE_GROUP}" \
            --name "${AKS_CLUSTER_NAME}" \
            --location "${LOCATION}" \
            --kubernetes-version "${AKS_VERSION}" \
            --node-count "${AKS_NODE_COUNT}" \
            --node-vm-size "${AKS_NODE_SIZE}" \
            --network-plugin azure \
            --vnet-subnet-id "${SUBNET_ID}" \
            --enable-managed-identity \
            --enable-cluster-autoscaler \
            --min-count 2 \
            --max-count 10 \
            --enable-addons monitoring,azure-keyvault-secrets-provider \
            --generate-ssh-keys \
            --tags "environment=${ENVIRONMENT}" || error_exit "Failed to create AKS cluster"

        log_success "AKS cluster created"
    fi

    # Attach ACR to AKS
    log_info "Attaching ACR to AKS..."
    az aks update \
        --name "${AKS_CLUSTER_NAME}" \
        --resource-group "${RESOURCE_GROUP}" \
        --attach-acr "${ACR_NAME}" || error_exit "Failed to attach ACR to AKS"

    log_success "ACR attached to AKS"
}

# Create PostgreSQL server
create_postgresql() {
    log_info "Creating PostgreSQL server..."

    if az postgres flexible-server show --name "${POSTGRES_SERVER}" --resource-group "${RESOURCE_GROUP}" >/dev/null 2>&1; then
        log_warning "PostgreSQL server already exists"
    else
        # Generate admin password
        POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

        # Get subnet ID
        SUBNET_ID=$(az network vnet subnet show \
            --resource-group "${RESOURCE_GROUP}" \
            --vnet-name "${VNET_NAME}" \
            --name database-subnet \
            --query id -o tsv)

        az postgres flexible-server create \
            --resource-group "${RESOURCE_GROUP}" \
            --name "${POSTGRES_SERVER}" \
            --location "${LOCATION}" \
            --admin-user "${POSTGRES_ADMIN}" \
            --admin-password "${POSTGRES_PASSWORD}" \
            --version "${POSTGRES_VERSION}" \
            --tier GeneralPurpose \
            --sku-name Standard_D4s_v3 \
            --storage-size "${POSTGRES_STORAGE}" \
            --backup-retention 30 \
            --high-availability Enabled \
            --subnet "${SUBNET_ID}" \
            --tags "environment=${ENVIRONMENT}" || error_exit "Failed to create PostgreSQL server"

        # Store password in Key Vault
        log_info "Storing PostgreSQL password in Key Vault..."
        az keyvault secret set \
            --vault-name "${KEYVAULT_NAME}" \
            --name "postgres-admin-password" \
            --value "${POSTGRES_PASSWORD}" || log_warning "Failed to store password in Key Vault"

        log_success "PostgreSQL server created"
        log_warning "Admin password stored in Key Vault: postgres-admin-password"
    fi

    # Create databases
    log_info "Creating databases..."

    for DB_NAME in "unified_health" "hapi_fhir"; do
        if az postgres flexible-server db show \
            --server-name "${POSTGRES_SERVER}" \
            --resource-group "${RESOURCE_GROUP}" \
            --database-name "${DB_NAME}" >/dev/null 2>&1; then
            log_warning "Database ${DB_NAME} already exists"
        else
            az postgres flexible-server db create \
                --server-name "${POSTGRES_SERVER}" \
                --resource-group "${RESOURCE_GROUP}" \
                --database-name "${DB_NAME}" || log_warning "Failed to create database ${DB_NAME}"
        fi
    done

    log_success "Databases created"
}

# Create Redis Cache
create_redis() {
    log_info "Creating Redis Cache..."

    if az redis show --name "${REDIS_NAME}" --resource-group "${RESOURCE_GROUP}" >/dev/null 2>&1; then
        log_warning "Redis Cache already exists"
    else
        az redis create \
            --resource-group "${RESOURCE_GROUP}" \
            --name "${REDIS_NAME}" \
            --location "${LOCATION}" \
            --sku "${REDIS_SKU}" \
            --vm-size "${REDIS_FAMILY}${REDIS_CAPACITY}" \
            --enable-non-ssl-port false \
            --minimum-tls-version 1.2 \
            --redis-version 6 \
            --tags "environment=${ENVIRONMENT}" || error_exit "Failed to create Redis Cache"

        log_success "Redis Cache created"
    fi

    # Get Redis keys and store in Key Vault
    log_info "Storing Redis keys in Key Vault..."
    REDIS_KEY=$(az redis list-keys \
        --name "${REDIS_NAME}" \
        --resource-group "${RESOURCE_GROUP}" \
        --query primaryKey -o tsv)

    az keyvault secret set \
        --vault-name "${KEYVAULT_NAME}" \
        --name "redis-primary-key" \
        --value "${REDIS_KEY}" || log_warning "Failed to store Redis key in Key Vault"

    log_success "Redis key stored in Key Vault"
}

# Create Key Vault
create_keyvault() {
    log_info "Creating Key Vault..."

    if az keyvault show --name "${KEYVAULT_NAME}" --resource-group "${RESOURCE_GROUP}" >/dev/null 2>&1; then
        log_warning "Key Vault already exists"
    else
        az keyvault create \
            --resource-group "${RESOURCE_GROUP}" \
            --name "${KEYVAULT_NAME}" \
            --location "${LOCATION}" \
            --enable-rbac-authorization true \
            --enabled-for-deployment true \
            --enabled-for-template-deployment true \
            --tags "environment=${ENVIRONMENT}" || error_exit "Failed to create Key Vault"

        log_success "Key Vault created"
    fi

    # Grant AKS access to Key Vault
    log_info "Granting AKS access to Key Vault..."

    AKS_IDENTITY_ID=$(az aks show \
        --name "${AKS_CLUSTER_NAME}" \
        --resource-group "${RESOURCE_GROUP}" \
        --query identityProfile.kubeletidentity.clientId -o tsv)

    KEYVAULT_ID=$(az keyvault show \
        --name "${KEYVAULT_NAME}" \
        --resource-group "${RESOURCE_GROUP}" \
        --query id -o tsv)

    az role assignment create \
        --assignee "${AKS_IDENTITY_ID}" \
        --role "Key Vault Secrets User" \
        --scope "${KEYVAULT_ID}" || log_warning "Failed to grant Key Vault access"

    log_success "Key Vault access granted"
}

# Create Storage Account
create_storage() {
    log_info "Creating Storage Account..."

    if az storage account show --name "${STORAGE_ACCOUNT}" --resource-group "${RESOURCE_GROUP}" >/dev/null 2>&1; then
        log_warning "Storage Account already exists"
    else
        az storage account create \
            --resource-group "${RESOURCE_GROUP}" \
            --name "${STORAGE_ACCOUNT}" \
            --location "${LOCATION}" \
            --sku Standard_LRS \
            --kind StorageV2 \
            --enable-hierarchical-namespace true \
            --https-only true \
            --min-tls-version TLS1_2 \
            --tags "environment=${ENVIRONMENT}" || error_exit "Failed to create Storage Account"

        log_success "Storage Account created"
    fi

    # Create blob containers
    log_info "Creating blob containers..."

    STORAGE_KEY=$(az storage account keys list \
        --resource-group "${RESOURCE_GROUP}" \
        --account-name "${STORAGE_ACCOUNT}" \
        --query '[0].value' -o tsv)

    for CONTAINER in "backups" "medical-images" "documents"; do
        az storage container create \
            --name "${CONTAINER}" \
            --account-name "${STORAGE_ACCOUNT}" \
            --account-key "${STORAGE_KEY}" || log_warning "Failed to create container ${CONTAINER}"
    done

    # Store storage key in Key Vault
    az keyvault secret set \
        --vault-name "${KEYVAULT_NAME}" \
        --name "storage-account-key" \
        --value "${STORAGE_KEY}" || log_warning "Failed to store storage key in Key Vault"

    log_success "Storage containers created"
}

# Configure networking
configure_networking() {
    log_info "Configuring networking..."

    # Create Network Security Group
    NSG_NAME="${VNET_NAME}-nsg"

    if ! az network nsg show --name "${NSG_NAME}" --resource-group "${RESOURCE_GROUP}" >/dev/null 2>&1; then
        az network nsg create \
            --resource-group "${RESOURCE_GROUP}" \
            --name "${NSG_NAME}" \
            --location "${LOCATION}" || error_exit "Failed to create NSG"

        # Add security rules
        az network nsg rule create \
            --resource-group "${RESOURCE_GROUP}" \
            --nsg-name "${NSG_NAME}" \
            --name AllowHTTPS \
            --priority 100 \
            --direction Inbound \
            --access Allow \
            --protocol Tcp \
            --destination-port-ranges 443 || log_warning "Failed to create HTTPS rule"

        az network nsg rule create \
            --resource-group "${RESOURCE_GROUP}" \
            --nsg-name "${NSG_NAME}" \
            --name AllowHTTP \
            --priority 110 \
            --direction Inbound \
            --access Allow \
            --protocol Tcp \
            --destination-port-ranges 80 || log_warning "Failed to create HTTP rule"

        log_success "NSG configured"
    fi
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring..."

    # Create Log Analytics Workspace
    LOG_WORKSPACE="unified-health-logs-${ENVIRONMENT}"

    if ! az monitor log-analytics workspace show \
        --resource-group "${RESOURCE_GROUP}" \
        --workspace-name "${LOG_WORKSPACE}" >/dev/null 2>&1; then

        az monitor log-analytics workspace create \
            --resource-group "${RESOURCE_GROUP}" \
            --workspace-name "${LOG_WORKSPACE}" \
            --location "${LOCATION}" \
            --retention-time 90 || error_exit "Failed to create Log Analytics Workspace"

        log_success "Log Analytics Workspace created"
    fi

    # Create Application Insights
    APP_INSIGHTS="unified-health-insights-${ENVIRONMENT}"

    if ! az monitor app-insights component show \
        --resource-group "${RESOURCE_GROUP}" \
        --app "${APP_INSIGHTS}" >/dev/null 2>&1; then

        WORKSPACE_ID=$(az monitor log-analytics workspace show \
            --resource-group "${RESOURCE_GROUP}" \
            --workspace-name "${LOG_WORKSPACE}" \
            --query id -o tsv)

        az monitor app-insights component create \
            --resource-group "${RESOURCE_GROUP}" \
            --app "${APP_INSIGHTS}" \
            --location "${LOCATION}" \
            --workspace "${WORKSPACE_ID}" || error_exit "Failed to create Application Insights"

        # Store instrumentation key in Key Vault
        INSTRUMENTATION_KEY=$(az monitor app-insights component show \
            --resource-group "${RESOURCE_GROUP}" \
            --app "${APP_INSIGHTS}" \
            --query instrumentationKey -o tsv)

        az keyvault secret set \
            --vault-name "${KEYVAULT_NAME}" \
            --name "app-insights-key" \
            --value "${INSTRUMENTATION_KEY}" || log_warning "Failed to store instrumentation key"

        log_success "Application Insights created"
    fi
}

# Output summary
output_summary() {
    log_success "=========================================="
    log_success "Azure Infrastructure Setup Complete!"
    log_success "=========================================="
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Resource Group: ${RESOURCE_GROUP}"
    log_info "AKS Cluster: ${AKS_CLUSTER_NAME}"
    log_info "ACR: ${ACR_NAME}"
    log_info "PostgreSQL: ${POSTGRES_SERVER}"
    log_info "Redis: ${REDIS_NAME}"
    log_info "Key Vault: ${KEYVAULT_NAME}"
    log_info "Storage: ${STORAGE_ACCOUNT}"
    log_success "=========================================="
    log_info ""
    log_info "Next steps:"
    log_info "1. Run: az aks get-credentials --resource-group ${RESOURCE_GROUP} --name ${AKS_CLUSTER_NAME}"
    log_info "2. Run: ./scripts/setup-secrets.sh ${ENVIRONMENT}"
    log_info "3. Deploy application: ./scripts/deploy-${ENVIRONMENT}.sh"
}

# Main setup flow
main() {
    log_info "Starting Azure infrastructure setup..."
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Location: ${LOCATION}"

    check_prerequisites
    confirm_setup
    create_resource_group
    create_keyvault
    create_vnet
    create_acr
    create_aks
    create_postgresql
    create_redis
    create_storage
    configure_networking
    setup_monitoring
    output_summary
}

# Run main
main "$@"
