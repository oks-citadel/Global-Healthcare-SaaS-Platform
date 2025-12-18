#!/bin/bash

###############################################################################
# Multi-Region Kubernetes Deployment Script
# Healthcare Platform - Microservices Deployment
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

###############################################################################
# Functions
###############################################################################

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

    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl not found. Please install kubectl first."
        exit 1
    fi

    # Check kustomize
    if ! command -v kustomize &> /dev/null; then
        log_warning "kustomize not found. Using kubectl kustomize instead."
    fi

    # Check cluster access
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster. Please configure kubectl."
        exit 1
    fi

    log_success "Prerequisites check passed"
}

validate_secrets() {
    local overlay=$1
    log_info "Validating secrets for $overlay..."

    # Check if secrets contain CHANGEME
    if grep -r "CHANGEME" "$SCRIPT_DIR/base/shared/secrets.yaml" &> /dev/null; then
        log_error "Secrets contain CHANGEME placeholders. Please update secrets before deployment."
        log_error "Edit: $SCRIPT_DIR/base/shared/secrets.yaml"
        return 1
    fi

    log_success "Secrets validation passed"
    return 0
}

preview_deployment() {
    local region=$1
    log_info "Previewing deployment for $region..."

    echo ""
    echo "========================================"
    echo "Deployment Preview: $region"
    echo "========================================"

    kubectl kustomize "$SCRIPT_DIR/overlays/$region/" || kustomize build "$SCRIPT_DIR/overlays/$region/"

    echo ""
    echo "========================================"
}

deploy_region() {
    local region=$1
    local dry_run=$2

    log_info "Deploying to region: $region"

    # Validate overlay exists
    if [ ! -d "$SCRIPT_DIR/overlays/$region" ]; then
        log_error "Overlay for region '$region' not found"
        exit 1
    fi

    # Validate secrets
    if [ "$dry_run" != "true" ]; then
        if ! validate_secrets "$region"; then
            exit 1
        fi
    fi

    # Preview deployment
    if [ "$dry_run" == "true" ]; then
        preview_deployment "$region"
        return 0
    fi

    # Apply deployment
    log_info "Applying Kubernetes manifests..."
    kubectl apply -k "$SCRIPT_DIR/overlays/$region/"

    # Wait for namespace to be ready
    local namespace="healthcare-$region"
    log_info "Waiting for namespace $namespace to be ready..."
    kubectl wait --for=condition=Ready namespace/$namespace --timeout=60s || true

    # Wait for deployments to be ready
    log_info "Waiting for deployments to be ready..."
    kubectl wait --for=condition=Available deployment --all -n "$namespace" --timeout=300s || {
        log_warning "Some deployments are not ready yet. Check status with: kubectl get pods -n $namespace"
    }

    # Display deployment status
    echo ""
    echo "========================================"
    echo "Deployment Status: $region"
    echo "========================================"
    kubectl get pods -n "$namespace"
    echo ""
    kubectl get svc -n "$namespace"
    echo ""
    kubectl get ingress -n "$namespace"
    echo ""

    log_success "Deployment to $region completed successfully"
}

rollback_region() {
    local region=$1
    local namespace="healthcare-$region"

    log_warning "Rolling back deployments in $namespace..."

    # Get all deployments
    deployments=$(kubectl get deployments -n "$namespace" -o jsonpath='{.items[*].metadata.name}')

    for deployment in $deployments; do
        log_info "Rolling back deployment: $deployment"
        kubectl rollout undo deployment/"$deployment" -n "$namespace" || true
    done

    log_success "Rollback completed for $region"
}

delete_region() {
    local region=$1
    local namespace="healthcare-$region"

    log_warning "Deleting all resources in region: $region"

    read -p "Are you sure you want to delete all resources in $namespace? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        log_info "Deletion cancelled"
        return 0
    fi

    log_info "Deleting resources..."
    kubectl delete -k "$SCRIPT_DIR/overlays/$region/" || true

    log_success "Deletion completed for $region"
}

check_health() {
    local region=$1
    local namespace="healthcare-$region"

    log_info "Checking health for region: $region"

    echo ""
    echo "========================================"
    echo "Health Check: $region"
    echo "========================================"

    # Check pods
    echo ""
    echo "Pod Status:"
    kubectl get pods -n "$namespace" -o wide

    # Check services
    echo ""
    echo "Service Status:"
    kubectl get svc -n "$namespace"

    # Check HPA
    echo ""
    echo "HPA Status:"
    kubectl get hpa -n "$namespace"

    # Check ingress
    echo ""
    echo "Ingress Status:"
    kubectl get ingress -n "$namespace"

    # Check pod health
    echo ""
    echo "Unhealthy Pods:"
    kubectl get pods -n "$namespace" --field-selector=status.phase!=Running,status.phase!=Succeeded || echo "All pods are healthy"

    echo ""
}

show_logs() {
    local region=$1
    local service=$2
    local namespace="healthcare-$region"

    log_info "Fetching logs for $service in $region..."

    # Get pod name
    pod=$(kubectl get pods -n "$namespace" -l app="$service" -o jsonpath='{.items[0].metadata.name}')

    if [ -z "$pod" ]; then
        log_error "No pods found for service: $service"
        exit 1
    fi

    log_info "Pod: $pod"
    kubectl logs "$pod" -n "$namespace" --tail=100 -f
}

scale_service() {
    local region=$1
    local service=$2
    local replicas=$3
    local namespace="healthcare-$region"

    log_info "Scaling $service in $region to $replicas replicas..."

    kubectl scale deployment "$service" -n "$namespace" --replicas="$replicas"

    log_success "Scaled $service to $replicas replicas"
}

###############################################################################
# Main Script
###############################################################################

show_usage() {
    cat << EOF
Usage: $0 [command] [options]

Commands:
    deploy <region>          Deploy to specific region (americas|europe|africa)
    deploy-all              Deploy to all regions
    preview <region>        Preview deployment without applying
    rollback <region>       Rollback deployments in region
    delete <region>         Delete all resources in region
    health <region>         Check health status of region
    logs <region> <service> Show logs for a service
    scale <region> <service> <replicas>  Scale a service

Regions:
    americas    - Americas region (US, Canada, Brazil)
    europe      - Europe region (GDPR compliant)
    africa      - Africa region (optimized for mobile)

Examples:
    $0 deploy americas
    $0 deploy-all
    $0 preview europe
    $0 health africa
    $0 logs americas api-gateway
    $0 scale europe telehealth-service 5
    $0 rollback americas
    $0 delete africa

Options:
    -h, --help              Show this help message

EOF
}

main() {
    local command=$1

    if [ -z "$command" ]; then
        show_usage
        exit 1
    fi

    case "$command" in
        deploy)
            check_prerequisites
            local region=$2
            if [ -z "$region" ]; then
                log_error "Region not specified"
                show_usage
                exit 1
            fi
            deploy_region "$region" "false"
            ;;
        deploy-all)
            check_prerequisites
            log_info "Deploying to all regions..."
            deploy_region "americas" "false"
            deploy_region "europe" "false"
            deploy_region "africa" "false"
            log_success "All regions deployed successfully"
            ;;
        preview)
            check_prerequisites
            local region=$2
            if [ -z "$region" ]; then
                log_error "Region not specified"
                show_usage
                exit 1
            fi
            deploy_region "$region" "true"
            ;;
        rollback)
            check_prerequisites
            local region=$2
            if [ -z "$region" ]; then
                log_error "Region not specified"
                show_usage
                exit 1
            fi
            rollback_region "$region"
            ;;
        delete)
            check_prerequisites
            local region=$2
            if [ -z "$region" ]; then
                log_error "Region not specified"
                show_usage
                exit 1
            fi
            delete_region "$region"
            ;;
        health)
            check_prerequisites
            local region=$2
            if [ -z "$region" ]; then
                log_error "Region not specified"
                show_usage
                exit 1
            fi
            check_health "$region"
            ;;
        logs)
            check_prerequisites
            local region=$2
            local service=$3
            if [ -z "$region" ] || [ -z "$service" ]; then
                log_error "Region and service must be specified"
                show_usage
                exit 1
            fi
            show_logs "$region" "$service"
            ;;
        scale)
            check_prerequisites
            local region=$2
            local service=$3
            local replicas=$4
            if [ -z "$region" ] || [ -z "$service" ] || [ -z "$replicas" ]; then
                log_error "Region, service, and replicas must be specified"
                show_usage
                exit 1
            fi
            scale_service "$region" "$service" "$replicas"
            ;;
        -h|--help|help)
            show_usage
            ;;
        *)
            log_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
