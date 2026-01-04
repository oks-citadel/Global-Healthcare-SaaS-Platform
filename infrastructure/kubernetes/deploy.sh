#!/bin/bash

# ============================================
# UnifiedHealth Platform - Deployment Script (AWS)
# ============================================
# AUTHORITATIVE ENVIRONMENT DEPLOYMENT SCRIPT
#
# This script deploys the application to AWS EKS for all environments (dev, staging, production).
# It uses Kustomize overlays from infrastructure/kubernetes/overlays/<environment>/
#
# For production deployments, prefer using scripts/deploy-production.sh which provides:
#   - Blue-green deployment
#   - Automatic rollback
#   - Database backup and migration
#
# DO NOT use the archived stub files in infrastructure/kubernetes/production/archived/
# Those were development/testing configurations and are NOT production-ready.
#
# Authoritative deployment configurations:
#   - Base configs: infrastructure/kubernetes/base/services/*/deployment.yaml
#   - Overlays: infrastructure/kubernetes/overlays/<environment>/
#
# Usage: ./infrastructure/kubernetes/deploy.sh <environment> [action]
# ============================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="unified-health"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"

# Log functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
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

    if ! command -v kubectl &> /dev/null; then
        error_exit "kubectl is not installed"
    fi

    if ! command -v kustomize &> /dev/null; then
        error_exit "kustomize is not installed"
    fi

    if ! command -v aws &> /dev/null; then
        error_exit "AWS CLI is not installed"
    fi

    if ! command -v envsubst &> /dev/null; then
        error_exit "envsubst is not installed (install gettext package)"
    fi

    # Check AWS credentials
    aws sts get-caller-identity >/dev/null 2>&1 || error_exit "Not authenticated with AWS. Run 'aws configure' or 'aws sso login'"

    log_success "All prerequisites satisfied"
}

# Set environment variables
set_environment_variables() {
    local environment=$1
    log_info "Setting environment variables for ${environment}..."

    # AWS configuration
    if [ -z "${AWS_ACCOUNT_ID}" ]; then
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    fi
    export AWS_ACCOUNT_ID

    # ECR configuration
    export ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    export ECR_REPOSITORY="${ECR_REGISTRY}/${PROJECT_NAME}"

    # EKS configuration
    export EKS_CLUSTER="${EKS_CLUSTER:-${PROJECT_NAME}-eks-${environment}}"

    # Image configuration
    export IMAGE_TAG="${IMAGE_TAG:-latest}"

    log_success "Environment variables set"
    log_info "  AWS Account: ${AWS_ACCOUNT_ID}"
    log_info "  AWS Region: ${AWS_REGION}"
    log_info "  ECR Registry: ${ECR_REGISTRY}"
    log_info "  EKS Cluster: ${EKS_CLUSTER}"
}

# Login to ECR
login_to_ecr() {
    log_info "Logging in to Amazon ECR..."
    aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${ECR_REGISTRY}" || error_exit "Failed to login to ECR"
    log_success "Logged in to ECR"
}

# Connect to EKS
connect_to_eks() {
    log_info "Connecting to EKS cluster..."

    aws eks update-kubeconfig \
        --region "${AWS_REGION}" \
        --name "${EKS_CLUSTER}" || error_exit "Failed to get EKS credentials"

    log_success "Connected to EKS cluster"
    kubectl cluster-info
}

# Build and push images to ECR
build_and_push_images() {
    local environment=$1
    log_info "Building and pushing images for ${environment}..."

    # Ensure ECR repositories exist
    for repo in "unified-health-api" "unified-health-web"; do
        aws ecr describe-repositories --repository-names "${repo}" --region "${AWS_REGION}" 2>/dev/null || \
            aws ecr create-repository --repository-name "${repo}" --region "${AWS_REGION}" --image-scanning-configuration scanOnPush=true
    done

    # Build and tag images
    log_info "Building API service..."
    docker build \
        -t "${ECR_REGISTRY}/unified-health-api:${IMAGE_TAG}" \
        -t "${ECR_REGISTRY}/unified-health-api:latest-${environment}" \
        -f services/api/Dockerfile \
        services/api || error_exit "Failed to build API image"

    log_info "Building Web app..."
    docker build \
        -t "${ECR_REGISTRY}/unified-health-web:${IMAGE_TAG}" \
        -t "${ECR_REGISTRY}/unified-health-web:latest-${environment}" \
        -f apps/web/Dockerfile \
        apps/web || error_exit "Failed to build Web image"

    # Push images
    log_info "Pushing images to ECR..."
    docker push "${ECR_REGISTRY}/unified-health-api:${IMAGE_TAG}" || error_exit "Failed to push API image"
    docker push "${ECR_REGISTRY}/unified-health-api:latest-${environment}" || error_exit "Failed to push API latest tag"
    docker push "${ECR_REGISTRY}/unified-health-web:${IMAGE_TAG}" || error_exit "Failed to push Web image"
    docker push "${ECR_REGISTRY}/unified-health-web:latest-${environment}" || error_exit "Failed to push Web latest tag"

    log_success "All images built and pushed successfully"
}

# Deploy to environment
deploy_to_environment() {
    local environment=$1
    local namespace="unified-health-${environment}"

    log_info "Deploying to ${environment} environment..."

    # Navigate to overlay directory
    cd "${SCRIPT_DIR}/overlays/${environment}"

    # Build kustomization
    log_info "Building kustomization..."
    kustomize build . | envsubst > "/tmp/unified-health-${environment}.yaml"

    # Preview changes
    log_info "Preview of changes:"
    head -n 50 "/tmp/unified-health-${environment}.yaml"

    # Ask for confirmation
    if [ "${SKIP_CONFIRMATION:-false}" != "true" ]; then
        read -p "Do you want to apply these changes? (yes/no): " confirmation
        if [ "$confirmation" != "yes" ]; then
            log_warn "Deployment cancelled"
            exit 0
        fi
    fi

    # Create namespace if not exists
    kubectl create namespace "${namespace}" 2>/dev/null || true

    # Apply configuration
    log_info "Applying configuration..."
    kubectl apply -f "/tmp/unified-health-${environment}.yaml"

    # Wait for rollout
    log_info "Waiting for rollout to complete..."
    kubectl rollout status deployment/unified-health-api -n "${namespace}" --timeout=5m || error_exit "Rollout failed"

    log_success "Deployment successful!"

    # Show status
    log_info "Current status:"
    kubectl get all -n "${namespace}"
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
    kubectl logs -n "${namespace}" -l app=unified-health-api --tail=20 || log_warn "No logs available"

    # Test health endpoint
    log_info "Testing health endpoint..."
    kubectl port-forward -n "${namespace}" svc/unified-health-api 8080:80 &
    PF_PID=$!
    sleep 5

    if curl -s http://localhost:8080/health | grep -q "ok"; then
        log_success "Health check passed!"
    else
        log_warn "Health check failed"
    fi

    kill $PF_PID 2>/dev/null || true

    # Check CloudWatch metrics (if available)
    log_info "Checking CloudWatch metrics..."
    aws cloudwatch get-metric-statistics \
        --namespace "AWS/EKS" \
        --metric-name "cluster_failed_request_count" \
        --dimensions "Name=ClusterName,Value=${EKS_CLUSTER}" \
        --start-time "$(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v-5M +%Y-%m-%dT%H:%M:%SZ)" \
        --end-time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --period 300 \
        --statistics Sum \
        --region "${AWS_REGION}" 2>/dev/null || log_warn "CloudWatch metrics not available"
}

# Rollback deployment
rollback_deployment() {
    local environment=$1
    local namespace="unified-health-${environment}"

    log_warn "Rolling back deployment in ${environment}..."

    kubectl rollout undo deployment/unified-health-api -n "${namespace}"
    kubectl rollout status deployment/unified-health-api -n "${namespace}" --timeout=5m

    log_success "Rollback completed"
}

# Show usage
show_usage() {
    echo "============================================"
    echo "UnifiedHealth Platform - AWS Deployment Script"
    echo "============================================"
    echo ""
    echo "Usage: $0 <environment> [action]"
    echo ""
    echo "Environments:"
    echo "  dev         - Deploy to development environment"
    echo "  staging     - Deploy to staging environment"
    echo "  production  - Deploy to production environment"
    echo ""
    echo "Actions:"
    echo "  deploy      - Deploy application (default)"
    echo "  build       - Build and push images only"
    echo "  verify      - Verify deployment"
    echo "  rollback    - Rollback to previous version"
    echo ""
    echo "Environment Variables:"
    echo "  AWS_REGION          - AWS region (default: us-east-1)"
    echo "  AWS_ACCOUNT_ID      - AWS account ID (auto-detected)"
    echo "  EKS_CLUSTER         - EKS cluster name (default: unified-health-eks-<env>)"
    echo "  IMAGE_TAG           - Docker image tag (default: latest)"
    echo "  SKIP_CONFIRMATION   - Skip deployment confirmation (default: false)"
    echo ""
    echo "Examples:"
    echo "  $0 staging deploy"
    echo "  $0 production verify"
    echo "  AWS_REGION=eu-west-1 $0 staging deploy"
    echo ""
}

# Main script
main() {
    echo "============================================"
    echo "UnifiedHealth Platform - AWS Deployment"
    echo "============================================"
    echo ""

    # Parse arguments
    if [ $# -eq 0 ]; then
        show_usage
        exit 1
    fi

    local environment=$1
    local action=${2:-deploy}

    # Validate environment
    if [ "$environment" != "dev" ] && [ "$environment" != "staging" ] && [ "$environment" != "production" ]; then
        log_error "Invalid environment: ${environment}"
        log_error "Valid environments: dev, staging, production"
        exit 1
    fi

    # Check prerequisites
    check_prerequisites

    # Set environment variables
    set_environment_variables "${environment}"

    # Login to ECR
    login_to_ecr

    # Connect to EKS
    connect_to_eks

    # Execute action
    case $action in
        deploy)
            build_and_push_images "${environment}"
            deploy_to_environment "${environment}"
            verify_deployment "${environment}"
            ;;
        build)
            build_and_push_images "${environment}"
            ;;
        verify)
            verify_deployment "${environment}"
            ;;
        rollback)
            rollback_deployment "${environment}"
            ;;
        *)
            log_error "Invalid action: ${action}"
            show_usage
            exit 1
            ;;
    esac

    log_success "All done!"
}

# Trap for cleanup
cleanup() {
    log_info "Cleaning up..."
    # Kill any background processes
    jobs -p | xargs -r kill 2>/dev/null || true
}
trap cleanup EXIT

# Run main function
main "$@"
