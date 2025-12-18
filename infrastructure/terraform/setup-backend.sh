#!/bin/bash
# ============================================
# Terraform Backend Setup Script
# ============================================
# Creates Azure Storage accounts for Terraform state management
# Configures storage with versioning, soft delete, and encryption

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="unified-health-tfstate-rg"
LOCATION="eastus"
PROJECT_NAME="unifiedhealth"

# Storage account names (must be globally unique, lowercase, no hyphens)
STORAGE_ACCOUNT_DEV="${PROJECT_NAME}tfstatedev"
STORAGE_ACCOUNT_STAGING="${PROJECT_NAME}tfstatestg"
STORAGE_ACCOUNT_PROD="${PROJECT_NAME}tfstateprd"

# Container names
CONTAINER_DEV="tfstate-dev"
CONTAINER_STAGING="tfstate-staging"
CONTAINER_PROD="tfstate-prod"

# ============================================
# Helper Functions
# ============================================

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

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed. Please install it first."
        exit 1
    fi

    # Check Azure authentication
    if ! az account show &> /dev/null; then
        log_error "Not logged in to Azure. Please run 'az login' first."
        exit 1
    fi

    log_success "All prerequisites met"
}

create_resource_group() {
    log_info "Creating resource group: $RESOURCE_GROUP"

    if az group show --name "$RESOURCE_GROUP" &> /dev/null; then
        log_warning "Resource group already exists"
    else
        az group create \
            --name "$RESOURCE_GROUP" \
            --location "$LOCATION" \
            --tags Project=UnifiedHealth Purpose=TerraformState

        log_success "Resource group created"
    fi
}

create_storage_account() {
    local storage_account=$1
    local sku=$2
    local env=$3

    log_info "Creating storage account: $storage_account"

    if az storage account show --name "$storage_account" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        log_warning "Storage account already exists: $storage_account"
    else
        az storage account create \
            --name "$storage_account" \
            --resource-group "$RESOURCE_GROUP" \
            --location "$LOCATION" \
            --sku "$sku" \
            --kind StorageV2 \
            --encryption-services blob \
            --https-only true \
            --min-tls-version TLS1_2 \
            --allow-blob-public-access false \
            --tags Environment="$env" Purpose=TerraformState

        log_success "Storage account created: $storage_account"
    fi
}

enable_versioning() {
    local storage_account=$1

    log_info "Enabling versioning for: $storage_account"

    az storage account blob-service-properties update \
        --account-name "$storage_account" \
        --resource-group "$RESOURCE_GROUP" \
        --enable-versioning true

    log_success "Versioning enabled"
}

enable_soft_delete() {
    local storage_account=$1
    local retention_days=$2

    log_info "Enabling soft delete for: $storage_account (${retention_days} days retention)"

    az storage account blob-service-properties update \
        --account-name "$storage_account" \
        --resource-group "$RESOURCE_GROUP" \
        --enable-delete-retention true \
        --delete-retention-days "$retention_days"

    log_success "Soft delete enabled"
}

create_container() {
    local storage_account=$1
    local container=$2

    log_info "Creating container: $container"

    # Get storage account key
    local account_key
    account_key=$(az storage account keys list \
        --resource-group "$RESOURCE_GROUP" \
        --account-name "$storage_account" \
        --query '[0].value' \
        --output tsv)

    if az storage container show \
        --name "$container" \
        --account-name "$storage_account" \
        --account-key "$account_key" &> /dev/null; then
        log_warning "Container already exists: $container"
    else
        az storage container create \
            --name "$container" \
            --account-name "$storage_account" \
            --account-key "$account_key" \
            --public-access off

        log_success "Container created: $container"
    fi
}

configure_resource_lock() {
    local resource_name=$1

    log_info "Configuring resource lock for: $resource_name"

    if az lock show \
        --name "DoNotDelete" \
        --resource-group "$RESOURCE_GROUP" \
        --resource-type Microsoft.Storage/storageAccounts \
        --resource-name "$resource_name" &> /dev/null; then
        log_warning "Resource lock already exists"
    else
        az lock create \
            --name "DoNotDelete" \
            --lock-type CanNotDelete \
            --resource-group "$RESOURCE_GROUP" \
            --resource-type Microsoft.Storage/storageAccounts \
            --resource-name "$resource_name" \
            --notes "Protect Terraform state storage"

        log_success "Resource lock configured"
    fi
}

show_summary() {
    log_info "============================================"
    log_info "Backend Storage Summary"
    log_info "============================================"
    log_info "Resource Group: $RESOURCE_GROUP"
    log_info "Location: $LOCATION"
    log_info ""
    log_info "Development:"
    log_info "  Storage Account: $STORAGE_ACCOUNT_DEV"
    log_info "  Container: $CONTAINER_DEV"
    log_info "  SKU: Standard_LRS"
    log_info ""
    log_info "Staging:"
    log_info "  Storage Account: $STORAGE_ACCOUNT_STAGING"
    log_info "  Container: $CONTAINER_STAGING"
    log_info "  SKU: Standard_GRS"
    log_info ""
    log_info "Production:"
    log_info "  Storage Account: $STORAGE_ACCOUNT_PROD"
    log_info "  Container: $CONTAINER_PROD"
    log_info "  SKU: Standard_GZRS"
    log_info "============================================"
}

# ============================================
# Main Script
# ============================================

main() {
    log_info "Starting Terraform backend setup..."

    check_prerequisites
    create_resource_group

    # Development environment
    log_info "Setting up DEVELOPMENT environment..."
    create_storage_account "$STORAGE_ACCOUNT_DEV" "Standard_LRS" "dev"
    enable_versioning "$STORAGE_ACCOUNT_DEV"
    enable_soft_delete "$STORAGE_ACCOUNT_DEV" 7
    create_container "$STORAGE_ACCOUNT_DEV" "$CONTAINER_DEV"

    # Staging environment
    log_info "Setting up STAGING environment..."
    create_storage_account "$STORAGE_ACCOUNT_STAGING" "Standard_GRS" "staging"
    enable_versioning "$STORAGE_ACCOUNT_STAGING"
    enable_soft_delete "$STORAGE_ACCOUNT_STAGING" 14
    create_container "$STORAGE_ACCOUNT_STAGING" "$CONTAINER_STAGING"

    # Production environment
    log_info "Setting up PRODUCTION environment..."
    create_storage_account "$STORAGE_ACCOUNT_PROD" "Standard_GZRS" "prod"
    enable_versioning "$STORAGE_ACCOUNT_PROD"
    enable_soft_delete "$STORAGE_ACCOUNT_PROD" 30
    create_container "$STORAGE_ACCOUNT_PROD" "$CONTAINER_PROD"
    configure_resource_lock "$STORAGE_ACCOUNT_PROD"

    show_summary
    log_success "Terraform backend setup completed successfully!"

    log_info ""
    log_info "Next steps:"
    log_info "1. Update backend configuration files in environments/ directory"
    log_info "2. Run 'terraform init -backend-config=environments/<env>.tfbackend'"
    log_info "3. Deploy infrastructure with './deploy.sh -e <env> -a apply'"
}

# Run main function
main
