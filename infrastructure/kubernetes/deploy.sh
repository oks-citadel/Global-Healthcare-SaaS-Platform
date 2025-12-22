#!/bin/bash

# ============================================
# UnifiedHealth Platform - Deployment Script
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi

    if ! command -v kustomize &> /dev/null; then
        log_error "kustomize is not installed"
        exit 1
    fi

    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed"
        exit 1
    fi

    log_info "All prerequisites satisfied"
}

# Set environment variables
set_environment_variables() {
    log_info "Setting environment variables..."

    # Azure configuration
    export AZURE_SUBSCRIPTION_ID="${AZURE_SUBSCRIPTION_ID:-$(az account show --query id -o tsv)}"
    export AZURE_TENANT_ID="${AZURE_TENANT_ID:-$(az account show --query tenantId -o tsv)}"
    export AZURE_RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-rg-unified-health-dev2}"

    # ACR configuration
    export ACR_NAME="${ACR_NAME:-acrunifiedhealthdev2}"
    export ACR_LOGIN_SERVER="${ACR_NAME}.azurecr.io"

    # AKS configuration
    export AKS_NAME="${AKS_NAME:-unified-health-aks}"

    log_info "Environment variables set"
}

# Connect to AKS
connect_to_aks() {
    log_info "Connecting to AKS cluster..."

    az aks get-credentials \
        --resource-group "${AZURE_RESOURCE_GROUP}" \
        --name "${AKS_NAME}" \
        --overwrite-existing

    log_info "Connected to AKS cluster"
    kubectl cluster-info
}

# Deploy to environment
deploy_to_environment() {
    local environment=$1

    log_info "Deploying to ${environment} environment..."

    # Navigate to overlay directory
    cd "overlays/${environment}"

    # Build kustomization
    log_info "Building kustomization..."
    kustomize build . | envsubst > "/tmp/unified-health-${environment}.yaml"

    # Preview changes
    log_info "Preview of changes:"
    head -n 50 "/tmp/unified-health-${environment}.yaml"

    # Ask for confirmation
    read -p "Do you want to apply these changes? (yes/no): " confirmation

    if [ "$confirmation" != "yes" ]; then
        log_warn "Deployment cancelled"
        exit 0
    fi

    # Apply configuration
    log_info "Applying configuration..."
    kubectl apply -f "/tmp/unified-health-${environment}.yaml"

    # Wait for rollout
    log_info "Waiting for rollout to complete..."
    kubectl rollout status deployment/unified-health-api -n "unified-health-${environment}" --timeout=5m

    log_info "Deployment successful!"

    # Show status
    log_info "Current status:"
    kubectl get all -n "unified-health-${environment}"
}

# Verify deployment
verify_deployment() {
    local environment=$1
    local namespace="unified-health-${environment}"

    log_info "Verifying deployment..."

    # Check pods
    log_info "Checking pods..."
    kubectl get pods -n "${namespace}"

    # Check services
    log_info "Checking services..."
    kubectl get svc -n "${namespace}"

    # Check ingress
    log_info "Checking ingress..."
    kubectl get ingress -n "${namespace}"

    # Check pod logs
    log_info "Recent pod logs:"
    kubectl logs -n "${namespace}" -l app=unified-health-api --tail=20

    # Test health endpoint
    log_info "Testing health endpoint..."
    kubectl port-forward -n "${namespace}" svc/unified-health-api 8080:80 &
    PF_PID=$!
    sleep 3

    if curl -s http://localhost:8080/health | grep -q "ok"; then
        log_info "Health check passed!"
    else
        log_warn "Health check failed"
    fi

    kill $PF_PID
}

# Rollback deployment
rollback_deployment() {
    local environment=$1
    local namespace="unified-health-${environment}"

    log_warn "Rolling back deployment in ${environment}..."

    kubectl rollout undo deployment/unified-health-api -n "${namespace}"
    kubectl rollout status deployment/unified-health-api -n "${namespace}"

    log_info "Rollback completed"
}

# Main script
main() {
    echo "============================================"
    echo "UnifiedHealth Platform - Deployment Script"
    echo "============================================"
    echo ""

    # Parse arguments
    if [ $# -eq 0 ]; then
        echo "Usage: $0 <environment> [action]"
        echo ""
        echo "Environments:"
        echo "  staging     - Deploy to staging environment"
        echo "  production  - Deploy to production environment"
        echo ""
        echo "Actions:"
        echo "  deploy      - Deploy application (default)"
        echo "  verify      - Verify deployment"
        echo "  rollback    - Rollback to previous version"
        echo ""
        exit 1
    fi

    local environment=$1
    local action=${2:-deploy}

    # Validate environment
    if [ "$environment" != "staging" ] && [ "$environment" != "production" ]; then
        log_error "Invalid environment: ${environment}"
        log_error "Valid environments: staging, production"
        exit 1
    fi

    # Check prerequisites
    check_prerequisites

    # Set environment variables
    set_environment_variables

    # Connect to AKS
    connect_to_aks

    # Execute action
    case $action in
        deploy)
            deploy_to_environment "${environment}"
            verify_deployment "${environment}"
            ;;
        verify)
            verify_deployment "${environment}"
            ;;
        rollback)
            rollback_deployment "${environment}"
            ;;
        *)
            log_error "Invalid action: ${action}"
            exit 1
            ;;
    esac

    log_info "All done!"
}

# Run main function
main "$@"
