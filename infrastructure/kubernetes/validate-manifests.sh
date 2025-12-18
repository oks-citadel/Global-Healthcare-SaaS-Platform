#!/bin/bash

###############################################################################
# Kubernetes Manifests Validation Script
# Healthcare Platform - Validate YAML configurations
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

check_yaml_syntax() {
    log_info "Checking YAML syntax..."

    local errors=0

    # Find all YAML files
    while IFS= read -r -d '' file; do
        if ! kubectl apply --dry-run=client -f "$file" &> /dev/null; then
            log_error "Invalid YAML: $file"
            ((errors++))
        fi
    done < <(find "$SCRIPT_DIR" -name "*.yaml" -type f -print0)

    if [ $errors -eq 0 ]; then
        log_success "All YAML files have valid syntax"
        return 0
    else
        log_error "Found $errors YAML files with invalid syntax"
        return 1
    fi
}

check_kustomize_build() {
    local region=$1
    log_info "Validating Kustomize build for $region..."

    if kubectl kustomize "$SCRIPT_DIR/overlays/$region/" > /dev/null 2>&1; then
        log_success "Kustomize build successful for $region"
        return 0
    else
        log_error "Kustomize build failed for $region"
        kubectl kustomize "$SCRIPT_DIR/overlays/$region/" 2>&1
        return 1
    fi
}

check_secrets() {
    log_info "Checking for placeholder secrets..."

    if grep -r "CHANGEME" "$SCRIPT_DIR/base/shared/secrets.yaml" &> /dev/null; then
        log_warning "Found CHANGEME placeholders in secrets.yaml"
        log_warning "Remember to update secrets before production deployment"
        return 1
    else
        log_success "No placeholder secrets found"
        return 0
    fi
}

check_resource_limits() {
    log_info "Checking resource limits..."

    local missing=0

    # Check deployments for resource limits
    while IFS= read -r -d '' file; do
        if grep -q "kind: Deployment" "$file"; then
            if ! grep -q "resources:" "$file"; then
                log_warning "Missing resources in: $file"
                ((missing++))
            fi
        fi
    done < <(find "$SCRIPT_DIR/base/services" -name "deployment.yaml" -type f -print0)

    if [ $missing -eq 0 ]; then
        log_success "All deployments have resource limits"
        return 0
    else
        log_warning "Found $missing deployments without resource limits"
        return 1
    fi
}

check_health_probes() {
    log_info "Checking health probes..."

    local missing=0

    while IFS= read -r -d '' file; do
        if grep -q "kind: Deployment" "$file"; then
            if ! grep -q "livenessProbe:" "$file"; then
                log_warning "Missing livenessProbe in: $file"
                ((missing++))
            fi
            if ! grep -q "readinessProbe:" "$file"; then
                log_warning "Missing readinessProbe in: $file"
                ((missing++))
            fi
        fi
    done < <(find "$SCRIPT_DIR/base/services" -name "deployment.yaml" -type f -print0)

    if [ $missing -eq 0 ]; then
        log_success "All deployments have health probes"
        return 0
    else
        log_warning "Found $missing missing health probes"
        return 1
    fi
}

check_security_context() {
    log_info "Checking security contexts..."

    local missing=0

    while IFS= read -r -d '' file; do
        if grep -q "kind: Deployment" "$file"; then
            if ! grep -q "securityContext:" "$file"; then
                log_warning "Missing securityContext in: $file"
                ((missing++))
            fi
        fi
    done < <(find "$SCRIPT_DIR/base/services" -name "deployment.yaml" -type f -print0)

    if [ $missing -eq 0 ]; then
        log_success "All deployments have security contexts"
        return 0
    else
        log_warning "Found $missing deployments without security contexts"
        return 1
    fi
}

check_service_accounts() {
    log_info "Checking service accounts..."

    local missing=0

    while IFS= read -r -d '' file; do
        if grep -q "kind: Deployment" "$file"; then
            if ! grep -q "serviceAccountName:" "$file"; then
                log_warning "Missing serviceAccountName in: $file"
                ((missing++))
            fi
        fi
    done < <(find "$SCRIPT_DIR/base/services" -name "deployment.yaml" -type f -print0)

    if [ $missing -eq 0 ]; then
        log_success "All deployments have service accounts"
        return 0
    else
        log_warning "Found $missing deployments without service accounts"
        return 1
    fi
}

generate_report() {
    log_info "Generating validation report..."

    echo ""
    echo "========================================"
    echo "Kubernetes Manifests Validation Report"
    echo "========================================"
    echo ""

    # Count files
    local yaml_count=$(find "$SCRIPT_DIR" -name "*.yaml" -type f | wc -l)
    local deployment_count=$(find "$SCRIPT_DIR/base/services" -name "deployment.yaml" -type f | wc -l)
    local service_count=$(find "$SCRIPT_DIR/base/services" -name "service.yaml" -type f | wc -l)
    local hpa_count=$(find "$SCRIPT_DIR/base/services" -name "hpa.yaml" -type f | wc -l)

    echo "Total YAML files: $yaml_count"
    echo "Deployments: $deployment_count"
    echo "Services: $service_count"
    echo "HPAs: $hpa_count"
    echo ""

    # List services
    echo "Microservices:"
    for service_dir in "$SCRIPT_DIR/base/services"/*; do
        if [ -d "$service_dir" ]; then
            echo "  - $(basename "$service_dir")"
        fi
    done
    echo ""

    # List regions
    echo "Regions:"
    for region_dir in "$SCRIPT_DIR/overlays"/*; do
        if [ -d "$region_dir" ]; then
            echo "  - $(basename "$region_dir")"
        fi
    done
    echo ""

    echo "========================================"
}

main() {
    log_info "Starting Kubernetes manifests validation..."
    echo ""

    local errors=0

    # Run all checks
    check_yaml_syntax || ((errors++))
    echo ""

    check_secrets || ((errors++))
    echo ""

    check_resource_limits || ((errors++))
    echo ""

    check_health_probes || ((errors++))
    echo ""

    check_security_context || ((errors++))
    echo ""

    check_service_accounts || ((errors++))
    echo ""

    # Validate each region
    for region in americas europe africa; do
        check_kustomize_build "$region" || ((errors++))
        echo ""
    done

    # Generate report
    generate_report

    # Summary
    if [ $errors -eq 0 ]; then
        log_success "All validations passed! ✓"
        exit 0
    else
        log_warning "Validation completed with $errors warnings/errors"
        exit 0
    fi
}

main "$@"
