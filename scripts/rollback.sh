#!/bin/bash
# ============================================
# UnifiedHealth Platform - Rollback Script
# ============================================
# This script performs a quick rollback to the previous version
# Usage: ./scripts/rollback.sh [environment] [version]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-production}"
TARGET_VERSION="${2:-}"
NAMESPACE="unified-health-${ENVIRONMENT}"
ACR_NAME="${ACR_NAME:-acrunifiedhealthdev2}"
ACR_LOGIN_SERVER="${ACR_NAME}.azurecr.io"
RESOURCE_GROUP="${RESOURCE_GROUP:-rg-unified-health-dev2-${ENVIRONMENT}}"
AKS_CLUSTER="${AKS_CLUSTER:-unified-health-aks-${ENVIRONMENT}}"

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

    command -v kubectl >/dev/null 2>&1 || error_exit "kubectl is not installed"
    command -v az >/dev/null 2>&1 || error_exit "Azure CLI is not installed"
    command -v jq >/dev/null 2>&1 || error_exit "jq is not installed"

    # Check Azure login
    az account show >/dev/null 2>&1 || error_exit "Not logged in to Azure. Run 'az login'"

    log_success "Prerequisites check passed"
}

# Confirm rollback
confirm_rollback() {
    log_warning "=========================================="
    log_warning "ROLLBACK OPERATION"
    log_warning "Environment: ${ENVIRONMENT}"
    log_warning "Target Version: ${TARGET_VERSION:-previous}"
    log_warning "=========================================="

    if [ "${SKIP_CONFIRMATION:-false}" != "true" ]; then
        read -p "Are you sure you want to rollback? (yes/no): " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            log_info "Rollback cancelled"
            exit 0
        fi
    fi
}

# Get AKS credentials
get_aks_credentials() {
    log_info "Getting AKS credentials..."
    az aks get-credentials \
        --resource-group "${RESOURCE_GROUP}" \
        --name "${AKS_CLUSTER}" \
        --overwrite-existing || error_exit "Failed to get AKS credentials"
    log_success "AKS credentials retrieved"
}

# Get previous version
get_previous_version() {
    if [ -z "${TARGET_VERSION}" ]; then
        log_info "Determining previous version..."

        # Get rollout history
        PREVIOUS_REVISION=$(kubectl rollout history deployment/unified-health-api -n "${NAMESPACE}" | tail -n 2 | head -n 1 | awk '{print $1}')

        if [ -z "${PREVIOUS_REVISION}" ]; then
            error_exit "Could not determine previous revision"
        fi

        log_info "Previous revision: ${PREVIOUS_REVISION}"
    else
        log_info "Target version specified: ${TARGET_VERSION}"
    fi
}

# Perform Kubernetes rollback
rollback_kubernetes() {
    log_info "Rolling back Kubernetes deployment..."

    if [ -z "${TARGET_VERSION}" ]; then
        # Rollback to previous revision
        kubectl rollout undo deployment/unified-health-api -n "${NAMESPACE}" || error_exit "Kubernetes rollback failed"
    else
        # Rollback to specific version
        kubectl set image deployment/unified-health-api \
            api="${ACR_LOGIN_SERVER}/unified-health-api:${TARGET_VERSION}" \
            -n "${NAMESPACE}" || error_exit "Failed to set image version"
    fi

    log_success "Rollback initiated"
}

# Wait for rollback to complete
wait_for_rollback() {
    log_info "Waiting for rollback to complete..."

    kubectl rollout status deployment/unified-health-api -n "${NAMESPACE}" --timeout=300s || error_exit "Rollback did not complete in time"

    log_success "Rollback completed"
}

# Verify rollback
verify_rollback() {
    log_info "Verifying rollback..."

    # Check pod status
    READY_PODS=$(kubectl get pods -n "${NAMESPACE}" -l app=unified-health-api -o json | jq -r '.items[] | select(.status.phase=="Running" and (.status.conditions[] | select(.type=="Ready" and .status=="True"))) | .metadata.name' | wc -l)

    if [ "${READY_PODS}" -eq 0 ]; then
        error_exit "No pods are running after rollback"
    fi

    log_success "Rollback verified: ${READY_PODS} pods running"

    # Get current image version
    CURRENT_IMAGE=$(kubectl get deployment unified-health-api -n "${NAMESPACE}" -o jsonpath='{.spec.template.spec.containers[0].image}')
    log_info "Current image: ${CURRENT_IMAGE}"
}

# Run health checks
run_health_checks() {
    log_info "Running health checks..."

    # Get a pod name
    POD_NAME=$(kubectl get pods -n "${NAMESPACE}" -l app=unified-health-api -o jsonpath='{.items[0].metadata.name}')

    if [ -z "${POD_NAME}" ]; then
        error_exit "No pods found"
    fi

    # Wait for pod to be ready
    sleep 10

    # Test health endpoint
    if kubectl exec -n "${NAMESPACE}" "${POD_NAME}" -- wget -q -O- http://localhost:8080/health >/dev/null 2>&1; then
        log_success "Health check passed"
    else
        log_warning "Health check failed"
    fi

    # Test ready endpoint
    if kubectl exec -n "${NAMESPACE}" "${POD_NAME}" -- wget -q -O- http://localhost:8080/ready >/dev/null 2>&1; then
        log_success "Ready check passed"
    else
        log_warning "Ready check failed"
    fi
}

# Rollback database
rollback_database() {
    log_warning "Database rollback requested"

    if [ "${ROLLBACK_DATABASE:-false}" == "true" ]; then
        log_info "Rolling back database..."

        if [ -z "${DB_BACKUP_NAME:-}" ]; then
            log_error "DB_BACKUP_NAME not specified"
            read -p "Enter backup name to restore (or 'skip' to skip database rollback): " DB_BACKUP_NAME

            if [ "${DB_BACKUP_NAME}" == "skip" ]; then
                log_warning "Database rollback skipped"
                return 0
            fi
        fi

        ./scripts/db-restore.sh "${DB_BACKUP_NAME}" || error_exit "Database rollback failed"

        log_success "Database rolled back"
    else
        log_info "Database rollback not requested (set ROLLBACK_DATABASE=true to enable)"
    fi
}

# List available versions
list_available_versions() {
    log_info "Available versions in ACR:"

    az acr repository show-tags \
        --name "${ACR_NAME}" \
        --repository unified-health-api \
        --orderby time_desc \
        --output table | head -n 10

    log_info "Recent Kubernetes rollout history:"
    kubectl rollout history deployment/unified-health-api -n "${NAMESPACE}"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2

    log_info "Sending rollback notification..."

    # Slack notification
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST "${SLACK_WEBHOOK_URL}" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\":\"Rollback ${status}\",
                \"attachments\":[{
                    \"color\":\"$([ "${status}" == "SUCCESS" ] && echo "warning" || echo "danger")\",
                    \"fields\":[
                        {\"title\":\"Environment\",\"value\":\"${ENVIRONMENT}\",\"short\":true},
                        {\"title\":\"Target Version\",\"value\":\"${TARGET_VERSION:-previous}\",\"short\":true},
                        {\"title\":\"Message\",\"value\":\"${message}\",\"short\":false}
                    ]
                }]
            }" || log_warning "Failed to send notification"
    fi
}

# Main rollback flow
main() {
    log_info "Starting rollback process..."
    log_info "Environment: ${ENVIRONMENT}"

    # Show available versions if no target specified
    if [ -z "${TARGET_VERSION}" ]; then
        list_available_versions
        echo ""
    fi

    check_prerequisites
    confirm_rollback
    get_aks_credentials
    get_previous_version
    rollback_database
    rollback_kubernetes
    wait_for_rollback
    verify_rollback
    run_health_checks

    log_success "=========================================="
    log_success "Rollback completed successfully!"
    log_success "Environment: ${ENVIRONMENT}"
    log_success "=========================================="

    send_notification "SUCCESS" "Rollback completed successfully"
}

# Trap errors
trap 'send_notification "FAILED" "Rollback failed at line $LINENO"' ERR

# Run main
main "$@"
