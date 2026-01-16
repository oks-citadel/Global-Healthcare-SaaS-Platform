#!/bin/bash
# ============================================
# Terraform Infrastructure Deployment Script
# ============================================
# Deploys Azure infrastructure for UnifiedHealth Platform
# Supports dev, staging, and prod environments

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_DIR="${SCRIPT_DIR}/environments"

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

show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Deploy Azure infrastructure using Terraform

OPTIONS:
    -e, --environment ENV    Environment to deploy (dev, staging, prod) [REQUIRED]
    -a, --action ACTION      Action to perform (plan, apply, destroy) [Default: plan]
    -y, --yes               Auto-approve (skip confirmation)
    -h, --help              Show this help message

EXAMPLES:
    $0 -e dev -a plan
    $0 -e staging -a apply
    $0 -e prod -a apply -y

PREREQUISITES:
    - Azure CLI installed and authenticated (az login)
    - Terraform >= 1.6.0 installed
    - Environment variable files configured in environments/ directory
    - Azure Storage account created for Terraform state

EOF
}

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed. Please install it first."
        log_info "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi

    # Check Azure authentication
    if ! az account show &> /dev/null; then
        log_error "Not logged in to Azure. Please run 'az login' first."
        exit 1
    fi

    # Check Terraform
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed. Please install it first."
        log_info "Visit: https://www.terraform.io/downloads"
        exit 1
    fi

    # Check Terraform version
    TERRAFORM_VERSION=$(terraform version -json | jq -r '.terraform_version')
    REQUIRED_VERSION="1.6.0"
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$TERRAFORM_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
        log_error "Terraform version $REQUIRED_VERSION or higher is required. Current: $TERRAFORM_VERSION"
        exit 1
    fi

    log_success "All prerequisites met"
}

validate_environment() {
    local env=$1

    if [[ ! "$env" =~ ^(dev|staging|prod)$ ]]; then
        log_error "Invalid environment: $env"
        log_info "Valid environments: dev, staging, prod"
        exit 1
    fi

    if [[ ! -f "${ENV_DIR}/${env}.tfvars" ]]; then
        log_error "Environment file not found: ${ENV_DIR}/${env}.tfvars"
        exit 1
    fi

    if [[ ! -f "${ENV_DIR}/${env}.tfbackend" ]]; then
        log_error "Backend configuration file not found: ${ENV_DIR}/${env}.tfbackend"
        exit 1
    fi
}

setup_backend() {
    local env=$1

    log_info "Setting up Terraform backend for $env environment..."

    # Initialize Terraform with backend configuration
    terraform init \
        -backend-config="${ENV_DIR}/${env}.tfbackend" \
        -reconfigure

    log_success "Backend configured successfully"
}

terraform_plan() {
    local env=$1

    log_info "Running Terraform plan for $env environment..."

    terraform plan \
        -var-file="${ENV_DIR}/${env}.tfvars" \
        -out="${env}.tfplan"

    log_success "Plan saved to ${env}.tfplan"
}

terraform_apply() {
    local env=$1
    local auto_approve=$2

    log_info "Applying Terraform changes for $env environment..."

    if [[ "$auto_approve" == "true" ]]; then
        terraform apply -auto-approve "${env}.tfplan"
    else
        terraform apply "${env}.tfplan"
    fi

    log_success "Infrastructure deployed successfully"

    # Show outputs
    log_info "Infrastructure outputs:"
    terraform output
}

terraform_destroy() {
    local env=$1
    local auto_approve=$2

    log_warning "This will destroy ALL infrastructure in $env environment!"

    if [[ "$env" == "prod" ]]; then
        log_error "Production destruction requires manual confirmation"
        read -p "Type 'destroy-prod' to confirm: " confirmation
        if [[ "$confirmation" != "destroy-prod" ]]; then
            log_info "Destruction cancelled"
            exit 0
        fi
    fi

    if [[ "$auto_approve" == "true" ]]; then
        terraform destroy \
            -var-file="${ENV_DIR}/${env}.tfvars" \
            -auto-approve
    else
        terraform destroy \
            -var-file="${ENV_DIR}/${env}.tfvars"
    fi

    log_success "Infrastructure destroyed successfully"
}

validate_terraform() {
    log_info "Validating Terraform configuration..."

    terraform validate

    log_success "Terraform configuration is valid"
}

format_terraform() {
    log_info "Formatting Terraform files..."

    terraform fmt -recursive

    log_success "Terraform files formatted"
}

show_summary() {
    local env=$1
    local action=$2

    log_info "============================================"
    log_info "Deployment Summary"
    log_info "============================================"
    log_info "Environment: $env"
    log_info "Action: $action"
    log_info "Azure Subscription: $(az account show --query name -o tsv)"
    log_info "Terraform Version: $(terraform version -json | jq -r '.terraform_version')"
    log_info "============================================"
}

# ============================================
# Main Script
# ============================================

main() {
    local environment=""
    local action="plan"
    local auto_approve="false"

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--environment)
                environment="$2"
                shift 2
                ;;
            -a|--action)
                action="$2"
                shift 2
                ;;
            -y|--yes)
                auto_approve="true"
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done

    # Validate required arguments
    if [[ -z "$environment" ]]; then
        log_error "Environment is required"
        show_usage
        exit 1
    fi

    # Show summary
    show_summary "$environment" "$action"

    # Run checks
    check_prerequisites
    validate_environment "$environment"

    # Change to script directory
    cd "$SCRIPT_DIR"

    # Format and validate
    format_terraform
    validate_terraform

    # Setup backend
    setup_backend "$environment"

    # Execute action
    case $action in
        plan)
            terraform_plan "$environment"
            ;;
        apply)
            terraform_plan "$environment"
            terraform_apply "$environment" "$auto_approve"
            ;;
        destroy)
            terraform_destroy "$environment" "$auto_approve"
            ;;
        *)
            log_error "Invalid action: $action"
            log_info "Valid actions: plan, apply, destroy"
            exit 1
            ;;
    esac

    log_success "Deployment script completed successfully!"
}

# Run main function
main "$@"
