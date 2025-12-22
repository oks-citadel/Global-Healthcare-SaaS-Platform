#!/bin/bash
# ============================================
# UnifiedHealth Platform - Azure Container Registry Deployment
# Build and push Docker images to ACR
# ============================================

set -e

# Configuration
ACR_NAME="${ACR_NAME:-acrunifiedhealthdev2}"
ACR_REGISTRY="${ACR_NAME}.azurecr.io"
RESOURCE_GROUP="${RESOURCE_GROUP:-rg-unified-health-dev2}"
LOCATION="${LOCATION:-eastus}"
IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD 2>/dev/null || echo 'latest')}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Print banner
echo "============================================"
echo "  UnifiedHealth Platform - ACR Deployment"
echo "============================================"
echo ""
log_info "ACR Registry: $ACR_REGISTRY"
log_info "Image Tag: $IMAGE_TAG"
log_info "Resource Group: $RESOURCE_GROUP"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    log_error "Azure CLI is not installed. Please install it first."
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged into Azure
log_info "Checking Azure login status..."
if ! az account show &> /dev/null; then
    log_warning "Not logged into Azure. Initiating login..."
    az login
fi

# Display current subscription
SUBSCRIPTION=$(az account show --query name -o tsv)
log_info "Using Azure Subscription: $SUBSCRIPTION"

# Create Resource Group if it doesn't exist
log_info "Checking Resource Group..."
if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    log_info "Creating Resource Group: $RESOURCE_GROUP"
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
    log_success "Resource Group created"
else
    log_info "Resource Group exists"
fi

# Create ACR if it doesn't exist
log_info "Checking Azure Container Registry..."
if ! az acr show --name "$ACR_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    log_info "Creating Azure Container Registry: $ACR_NAME"
    az acr create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$ACR_NAME" \
        --sku Standard \
        --admin-enabled true
    log_success "ACR created"
else
    log_info "ACR exists"
fi

# Login to ACR
log_info "Logging into ACR..."
az acr login --name "$ACR_NAME"
log_success "Logged into ACR"

# Get ACR login server
ACR_LOGIN_SERVER=$(az acr show --name "$ACR_NAME" --query loginServer -o tsv)
log_info "ACR Login Server: $ACR_LOGIN_SERVER"

# Build and push API image
log_info "Building API Docker image..."
docker build \
    -t "$ACR_LOGIN_SERVER/unifiedhealth/api:$IMAGE_TAG" \
    -t "$ACR_LOGIN_SERVER/unifiedhealth/api:latest" \
    -f services/api/Dockerfile \
    services/api

log_info "Pushing API image to ACR..."
docker push "$ACR_LOGIN_SERVER/unifiedhealth/api:$IMAGE_TAG"
docker push "$ACR_LOGIN_SERVER/unifiedhealth/api:latest"
log_success "API image pushed"

# Build and push Web image
log_info "Building Web Docker image..."
docker build \
    -t "$ACR_LOGIN_SERVER/unifiedhealth/web:$IMAGE_TAG" \
    -t "$ACR_LOGIN_SERVER/unifiedhealth/web:latest" \
    -f apps/web/Dockerfile \
    apps/web

log_info "Pushing Web image to ACR..."
docker push "$ACR_LOGIN_SERVER/unifiedhealth/web:$IMAGE_TAG"
docker push "$ACR_LOGIN_SERVER/unifiedhealth/web:latest"
log_success "Web image pushed"

# List images in ACR
echo ""
log_info "Images in ACR:"
az acr repository list --name "$ACR_NAME" --output table

echo ""
log_success "All images built and pushed successfully!"
echo ""
echo "============================================"
echo "  Deployment Summary"
echo "============================================"
echo "ACR Registry:    $ACR_LOGIN_SERVER"
echo "API Image:       $ACR_LOGIN_SERVER/unifiedhealth/api:$IMAGE_TAG"
echo "Web Image:       $ACR_LOGIN_SERVER/unifiedhealth/web:$IMAGE_TAG"
echo "Image Tag:       $IMAGE_TAG"
echo "============================================"
