#!/bin/bash
# ============================================
# UnifiedHealth Platform - Staging Deployment
# ============================================
# This script deploys the application to staging environment
# Usage: ./scripts/deploy-staging.sh

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="staging"
NAMESPACE="unified-health-staging"
ACR_NAME="${ACR_NAME:-unifiedhealthacr}"
ACR_LOGIN_SERVER="${ACR_NAME}.azurecr.io"
AKS_CLUSTER="${AKS_CLUSTER:-unified-health-aks-staging}"
RESOURCE_GROUP="${RESOURCE_GROUP:-unified-health-rg-staging}"
VERSION="${VERSION:-$(git rev-parse --short HEAD)}"
BUILD_TIMESTAMP=$(date +%Y%m%d-%H%M%S)
IMAGE_TAG="${VERSION}-${BUILD_TIMESTAMP}"

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

    command -v docker >/dev/null 2>&1 || error_exit "Docker is not installed"
    command -v kubectl >/dev/null 2>&1 || error_exit "kubectl is not installed"
    command -v az >/dev/null 2>&1 || error_exit "Azure CLI is not installed"

    # Check Azure login
    az account show >/dev/null 2>&1 || error_exit "Not logged in to Azure. Run 'az login'"

    log_success "Prerequisites check passed"
}

# Login to ACR
login_to_acr() {
    log_info "Logging in to Azure Container Registry..."
    az acr login --name "${ACR_NAME}" || error_exit "Failed to login to ACR"
    log_success "Logged in to ACR"
}

# Build Docker images
build_images() {
    log_info "Building Docker images..."

    # Build API service
    log_info "Building API service..."
    docker build \
        -t "${ACR_LOGIN_SERVER}/unified-health-api:${IMAGE_TAG}" \
        -t "${ACR_LOGIN_SERVER}/unified-health-api:latest-staging" \
        -f services/api/Dockerfile \
        services/api || error_exit "Failed to build API image"

    # Build Web app
    log_info "Building Web app..."
    docker build \
        -t "${ACR_LOGIN_SERVER}/unified-health-web:${IMAGE_TAG}" \
        -t "${ACR_LOGIN_SERVER}/unified-health-web:latest-staging" \
        -f apps/web/Dockerfile \
        apps/web || error_exit "Failed to build Web image"

    # Build Mobile app (if Dockerfile exists)
    if [ -f "apps/mobile/Dockerfile" ]; then
        log_info "Building Mobile app..."
        docker build \
            -t "${ACR_LOGIN_SERVER}/unified-health-mobile:${IMAGE_TAG}" \
            -t "${ACR_LOGIN_SERVER}/unified-health-mobile:latest-staging" \
            -f apps/mobile/Dockerfile \
            apps/mobile || log_warning "Failed to build Mobile image (non-critical)"
    fi

    log_success "All images built successfully"
}

# Push images to ACR
push_images() {
    log_info "Pushing images to ACR..."

    docker push "${ACR_LOGIN_SERVER}/unified-health-api:${IMAGE_TAG}" || error_exit "Failed to push API image"
    docker push "${ACR_LOGIN_SERVER}/unified-health-api:latest-staging" || error_exit "Failed to push API latest tag"

    docker push "${ACR_LOGIN_SERVER}/unified-health-web:${IMAGE_TAG}" || error_exit "Failed to push Web image"
    docker push "${ACR_LOGIN_SERVER}/unified-health-web:latest-staging" || error_exit "Failed to push Web latest tag"

    if docker image inspect "${ACR_LOGIN_SERVER}/unified-health-mobile:${IMAGE_TAG}" >/dev/null 2>&1; then
        docker push "${ACR_LOGIN_SERVER}/unified-health-mobile:${IMAGE_TAG}" || log_warning "Failed to push Mobile image"
        docker push "${ACR_LOGIN_SERVER}/unified-health-mobile:latest-staging" || log_warning "Failed to push Mobile latest tag"
    fi

    log_success "All images pushed successfully"
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

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."

    # Create a migration job
    cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration-${BUILD_TIMESTAMP}
  namespace: ${NAMESPACE}
spec:
  ttlSecondsAfterFinished: 86400
  backoffLimit: 3
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: migration
        image: ${ACR_LOGIN_SERVER}/unified-health-api:${IMAGE_TAG}
        command: ["pnpm", "db:migrate:deploy"]
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: unified-health-secrets
              key: database-url
EOF

    # Wait for migration to complete
    log_info "Waiting for migration to complete..."
    kubectl wait --for=condition=complete \
        --timeout=300s \
        -n "${NAMESPACE}" \
        "job/db-migration-${BUILD_TIMESTAMP}" || error_exit "Database migration failed"

    log_success "Database migrations completed"
}

# Apply Kubernetes configurations
apply_k8s_configs() {
    log_info "Applying Kubernetes configurations..."

    # Update image tags in deployments
    export ACR_LOGIN_SERVER IMAGE_TAG

    # Apply namespace
    kubectl apply -f infrastructure/kubernetes/base/namespace.yaml || error_exit "Failed to apply namespace"

    # Apply ConfigMaps and Secrets
    kubectl apply -f infrastructure/kubernetes/base/configmap.yaml || error_exit "Failed to apply ConfigMap"
    kubectl apply -f infrastructure/kubernetes/base/secrets.yaml || error_exit "Failed to apply Secrets"

    # Apply deployments with updated image tags
    envsubst < infrastructure/kubernetes/base/api-deployment.yaml | kubectl apply -f - || error_exit "Failed to apply API deployment"

    # Apply overlays if they exist
    if [ -d "infrastructure/kubernetes/overlays/staging" ]; then
        kubectl apply -k infrastructure/kubernetes/overlays/staging || error_exit "Failed to apply staging overlay"
    fi

    log_success "Kubernetes configurations applied"
}

# Wait for deployment rollout
wait_for_rollout() {
    log_info "Waiting for deployment rollout..."

    kubectl rollout status deployment/unified-health-api -n "${NAMESPACE}" --timeout=300s || error_exit "API deployment rollout failed"

    log_success "Deployment rollout completed"
}

# Verify deployment health
verify_health() {
    log_info "Verifying deployment health..."

    # Get pod status
    kubectl get pods -n "${NAMESPACE}" -l app=unified-health-api

    # Check if pods are running
    READY_PODS=$(kubectl get pods -n "${NAMESPACE}" -l app=unified-health-api -o json | jq -r '.items[] | select(.status.phase=="Running") | .metadata.name' | wc -l)

    if [ "${READY_PODS}" -eq 0 ]; then
        error_exit "No pods are running"
    fi

    log_success "Deployment health verified: ${READY_PODS} pods running"

    # Get service endpoint
    SERVICE_IP=$(kubectl get svc unified-health-api -n "${NAMESPACE}" -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "ClusterIP")
    log_info "Service endpoint: ${SERVICE_IP}"
}

# Run smoke tests
run_smoke_tests() {
    log_info "Running smoke tests..."

    # Port forward to API service
    kubectl port-forward -n "${NAMESPACE}" svc/unified-health-api 8080:80 &
    PF_PID=$!

    sleep 5

    # Test health endpoint
    log_info "Testing health endpoint..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health || echo "000")

    if [ "${HTTP_CODE}" == "200" ]; then
        log_success "Health check passed"
    else
        log_warning "Health check returned: ${HTTP_CODE}"
    fi

    # Test ready endpoint
    log_info "Testing ready endpoint..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ready || echo "000")

    if [ "${HTTP_CODE}" == "200" ]; then
        log_success "Ready check passed"
    else
        log_warning "Ready check returned: ${HTTP_CODE}"
    fi

    # Kill port forward
    kill ${PF_PID} 2>/dev/null || true

    log_success "Smoke tests completed"
}

# Tag deployment
tag_deployment() {
    log_info "Tagging deployment..."

    git tag -a "staging-${IMAGE_TAG}" -m "Staging deployment ${IMAGE_TAG}" 2>/dev/null || log_warning "Failed to create git tag"

    log_success "Deployment tagged"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2

    log_info "Sending deployment notification..."

    # Webhook URL from environment variable
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST "${SLACK_WEBHOOK_URL}" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"Staging Deployment ${status}: ${message}\"}" || log_warning "Failed to send notification"
    fi
}

# Main deployment flow
main() {
    log_info "Starting staging deployment..."
    log_info "Version: ${VERSION}"
    log_info "Image Tag: ${IMAGE_TAG}"
    log_info "Environment: ${ENVIRONMENT}"

    check_prerequisites
    login_to_acr
    build_images
    push_images
    get_aks_credentials
    apply_k8s_configs
    run_migrations
    wait_for_rollout
    verify_health
    run_smoke_tests
    tag_deployment

    log_success "=========================================="
    log_success "Staging deployment completed successfully!"
    log_success "Version: ${IMAGE_TAG}"
    log_success "=========================================="

    send_notification "SUCCESS" "Version ${IMAGE_TAG} deployed successfully"
}

# Trap errors
trap 'send_notification "FAILED" "Deployment failed at line $LINENO"' ERR

# Run main
main "$@"
