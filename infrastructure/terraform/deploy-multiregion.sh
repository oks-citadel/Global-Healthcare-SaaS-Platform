#!/bin/bash

# ============================================
# UnifiedHealth Platform - Multi-Region Deployment Script
# ============================================
# Quick deployment script for multi-region infrastructure

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Functions
print_header() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI not found. Please install: https://docs.microsoft.com/cli/azure/install-azure-cli"
        exit 1
    fi
    print_success "Azure CLI installed: $(az --version | head -n 1)"

    # Check Terraform
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform not found. Please install: https://www.terraform.io/downloads"
        exit 1
    fi
    print_success "Terraform installed: $(terraform version | head -n 1)"

    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        print_warning "kubectl not found. It's recommended for managing AKS clusters."
    else
        print_success "kubectl installed: $(kubectl version --client --short 2>/dev/null | head -n 1)"
    fi

    # Check Azure login
    if ! az account show &> /dev/null; then
        print_error "Not logged into Azure. Please run: az login"
        exit 1
    fi
    print_success "Logged into Azure: $(az account show --query name -o tsv)"

    echo ""
}

create_config() {
    print_header "Configuration Setup"

    if [ ! -f "terraform.tfvars" ]; then
        print_info "terraform.tfvars not found. Creating from example..."
        cp terraform.tfvars.example terraform.tfvars
        print_warning "Please edit terraform.tfvars with your configuration before proceeding!"
        print_info "Required changes:"
        echo "  1. Set your Azure subscription_id"
        echo "  2. Change postgresql_admin_password"
        echo "  3. Update alert email addresses"
        echo "  4. Review region deployment flags"
        echo ""
        read -p "Press Enter after editing terraform.tfvars, or Ctrl+C to cancel..."
    else
        print_success "terraform.tfvars found"
    fi

    echo ""
}

select_deployment_mode() {
    print_header "Select Deployment Mode"
    echo "1) Full Multi-Region (Americas + Europe + Africa)"
    echo "2) Americas Only"
    echo "3) Europe Only"
    echo "4) Africa Only"
    echo "5) Americas + Europe"
    echo "6) Custom"
    echo ""
    read -p "Enter your choice [1-6]: " choice

    case $choice in
        1)
            DEPLOY_MODE="full"
            TERRAFORM_VARS=""
            print_info "Selected: Full Multi-Region Deployment"
            ;;
        2)
            DEPLOY_MODE="americas"
            TERRAFORM_VARS="-var='deploy_americas=true' -var='deploy_europe=false' -var='deploy_africa=false'"
            print_info "Selected: Americas Only"
            ;;
        3)
            DEPLOY_MODE="europe"
            TERRAFORM_VARS="-var='deploy_americas=false' -var='deploy_europe=true' -var='deploy_africa=false'"
            print_info "Selected: Europe Only"
            ;;
        4)
            DEPLOY_MODE="africa"
            TERRAFORM_VARS="-var='deploy_americas=false' -var='deploy_europe=false' -var='deploy_africa=true'"
            print_info "Selected: Africa Only"
            ;;
        5)
            DEPLOY_MODE="americas-europe"
            TERRAFORM_VARS="-var='deploy_americas=true' -var='deploy_europe=true' -var='deploy_africa=false'"
            print_info "Selected: Americas + Europe"
            ;;
        6)
            DEPLOY_MODE="custom"
            print_info "Using configuration from terraform.tfvars"
            TERRAFORM_VARS=""
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac

    echo ""
}

terraform_init() {
    print_header "Initializing Terraform"

    if terraform init -upgrade; then
        print_success "Terraform initialized successfully"
    else
        print_error "Terraform initialization failed"
        exit 1
    fi

    echo ""
}

terraform_validate() {
    print_header "Validating Configuration"

    if terraform validate; then
        print_success "Configuration is valid"
    else
        print_error "Configuration validation failed"
        exit 1
    fi

    echo ""
}

terraform_plan() {
    print_header "Creating Execution Plan"

    print_info "This may take 5-10 minutes..."

    if [ -n "$TERRAFORM_VARS" ]; then
        if terraform plan $TERRAFORM_VARS -out=multiregion.tfplan; then
            print_success "Plan created successfully"
        else
            print_error "Plan creation failed"
            exit 1
        fi
    else
        if terraform plan -out=multiregion.tfplan; then
            print_success "Plan created successfully"
        else
            print_error "Plan creation failed"
            exit 1
        fi
    fi

    echo ""
}

show_plan_summary() {
    print_header "Plan Summary"

    terraform show -json multiregion.tfplan | jq -r '
        .resource_changes[] |
        select(.change.actions[] | contains("create")) |
        .type' | sort | uniq -c | sort -rn

    echo ""
    print_info "Review the plan above carefully"
    echo ""
}

confirm_deployment() {
    print_header "Deployment Confirmation"

    print_warning "This will create resources in Azure that will incur costs!"
    print_info "Estimated monthly cost: \$5,000-10,000 for full multi-region"
    echo ""

    read -p "Do you want to proceed with deployment? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "Deployment cancelled"
        exit 0
    fi

    echo ""
}

terraform_apply() {
    print_header "Applying Infrastructure"

    print_info "This will take 45-60 minutes for full multi-region deployment..."
    print_info "Please do not interrupt the process"
    echo ""

    if terraform apply multiregion.tfplan; then
        print_success "Infrastructure deployed successfully!"
    else
        print_error "Deployment failed"
        exit 1
    fi

    echo ""
}

show_outputs() {
    print_header "Deployment Outputs"

    terraform output

    echo ""
}

configure_kubectl() {
    print_header "Configuring kubectl"

    print_info "Would you like to configure kubectl for the deployed AKS clusters?"
    read -p "(yes/no): " configure_kb

    if [ "$configure_kb" == "yes" ]; then
        if command -v kubectl &> /dev/null; then
            print_info "Configuring kubectl contexts..."

            # Try to configure each region if deployed
            if terraform output americas_aks_cluster_name &> /dev/null; then
                RG=$(terraform output -raw americas_resource_group_name)
                AKS=$(terraform output -raw americas_aks_cluster_name)
                az aks get-credentials --resource-group "$RG" --name "$AKS" --context americas-prod --overwrite-existing || true
                print_success "Americas context configured"
            fi

            if terraform output europe_aks_cluster_name &> /dev/null; then
                RG=$(terraform output -raw europe_resource_group_name)
                AKS=$(terraform output -raw europe_aks_cluster_name)
                az aks get-credentials --resource-group "$RG" --name "$AKS" --context europe-prod --overwrite-existing || true
                print_success "Europe context configured"
            fi

            if terraform output africa_aks_cluster_name &> /dev/null; then
                RG=$(terraform output -raw africa_resource_group_name)
                AKS=$(terraform output -raw africa_aks_cluster_name)
                az aks get-credentials --resource-group "$RG" --name "$AKS" --context africa-prod --overwrite-existing || true
                print_success "Africa context configured"
            fi

            echo ""
            print_info "Available contexts:"
            kubectl config get-contexts
        else
            print_warning "kubectl not installed, skipping configuration"
        fi
    fi

    echo ""
}

show_next_steps() {
    print_header "Next Steps"

    echo "1. Review the outputs above and save important information"
    echo "2. Configure DNS records to point to Front Door endpoint"
    echo "3. Deploy your applications to each AKS cluster"
    echo "4. Configure SSL/TLS certificates in Front Door"
    echo "5. Set up monitoring dashboards"
    echo "6. Review security configurations"
    echo ""
    print_info "For detailed instructions, see: MULTIREGION_DEPLOYMENT_GUIDE.md"
    echo ""
}

cleanup_temp_files() {
    print_info "Cleaning up temporary files..."
    rm -f multiregion.tfplan
}

# Main execution
main() {
    print_header "UnifiedHealth Platform - Multi-Region Deployment"
    echo ""

    check_prerequisites
    create_config
    select_deployment_mode
    terraform_init
    terraform_validate
    terraform_plan
    show_plan_summary
    confirm_deployment
    terraform_apply
    show_outputs
    configure_kubectl
    show_next_steps
    cleanup_temp_files

    print_success "Deployment complete!"
}

# Run main function
main

# Trap errors
trap 'print_error "An error occurred. Deployment may be incomplete."; exit 1' ERR
