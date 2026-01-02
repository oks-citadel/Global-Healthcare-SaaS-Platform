#!/bin/bash
# ============================================
# The Unified Health - AWS Deployment Script
# ============================================
# Domain: theunifiedhealth.com
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "============================================"
echo "  The Unified Health - AWS Deployment"
echo "  Domain: theunifiedhealth.com"
echo "============================================"
echo -e "${NC}"

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"

    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}ERROR: AWS CLI not installed${NC}"
        exit 1
    fi

    # Check Terraform
    if ! command -v terraform &> /dev/null; then
        echo -e "${RED}ERROR: Terraform not installed${NC}"
        exit 1
    fi

    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}ERROR: kubectl not installed${NC}"
        exit 1
    fi

    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}ERROR: AWS credentials not configured${NC}"
        exit 1
    fi

    echo -e "${GREEN}All prerequisites met!${NC}"
}

# Initialize Git repository
init_git() {
    echo -e "${YELLOW}Initializing Git repository...${NC}"

    if [ ! -d ".git" ]; then
        git init
        echo -e "${GREEN}Git repository initialized${NC}"
    else
        echo -e "${BLUE}Git repository already exists${NC}"
    fi
}

# Deploy infrastructure
deploy_infrastructure() {
    echo -e "${YELLOW}Deploying AWS infrastructure...${NC}"

    cd infrastructure/terraform-aws

    # Initialize Terraform
    terraform init

    # Plan
    echo -e "${BLUE}Creating Terraform plan...${NC}"
    terraform plan -out=tfplan

    # Apply
    echo -e "${YELLOW}Applying Terraform configuration...${NC}"
    echo -e "${YELLOW}This may take 30-45 minutes...${NC}"
    terraform apply tfplan

    cd ../..
}

# Get outputs
get_outputs() {
    echo -e "${GREEN}"
    echo "============================================"
    echo "  DEPLOYMENT COMPLETE!"
    echo "============================================"
    echo -e "${NC}"

    cd infrastructure/terraform-aws

    echo -e "${BLUE}Route53 Nameservers for GoDaddy:${NC}"
    echo -e "${GREEN}"
    terraform output route53_nameservers
    echo -e "${NC}"

    echo -e "${BLUE}EKS Cluster Endpoint:${NC}"
    terraform output americas_eks_cluster_endpoint

    echo -e "${BLUE}ECR Repository URLs:${NC}"
    terraform output ecr_repository_urls

    echo -e "${BLUE}CodePipeline Name:${NC}"
    terraform output codepipeline_name

    cd ../..

    echo -e "${YELLOW}"
    echo "============================================"
    echo "  NEXT STEPS:"
    echo "============================================"
    echo "1. Copy the nameservers above"
    echo "2. Log in to GoDaddy"
    echo "3. Go to: Domains → theunifiedhealth.com → DNS → Nameservers"
    echo "4. Select 'I'll use my own nameservers'"
    echo "5. Enter the 4 AWS nameservers"
    echo "6. Save and wait 24-48 hours for propagation"
    echo "============================================"
    echo -e "${NC}"
}

# Configure kubectl
configure_kubectl() {
    echo -e "${YELLOW}Configuring kubectl...${NC}"

    CLUSTER_NAME=$(cd infrastructure/terraform-aws && terraform output -raw americas_eks_cluster_name)

    if [ -n "$CLUSTER_NAME" ]; then
        aws eks update-kubeconfig --name "$CLUSTER_NAME" --region us-east-1
        echo -e "${GREEN}kubectl configured for cluster: $CLUSTER_NAME${NC}"
    fi
}

# Trigger pipeline
trigger_pipeline() {
    echo -e "${YELLOW}Triggering CodePipeline...${NC}"

    PIPELINE_NAME=$(cd infrastructure/terraform-aws && terraform output -raw codepipeline_name)

    if [ -n "$PIPELINE_NAME" ]; then
        aws codepipeline start-pipeline-execution --name "$PIPELINE_NAME" --region us-east-1
        echo -e "${GREEN}Pipeline triggered: $PIPELINE_NAME${NC}"
    fi
}

# Main execution
main() {
    case "${1:-deploy}" in
        "check")
            check_prerequisites
            ;;
        "init")
            check_prerequisites
            init_git
            ;;
        "deploy")
            check_prerequisites
            deploy_infrastructure
            get_outputs
            ;;
        "outputs")
            get_outputs
            ;;
        "kubectl")
            configure_kubectl
            ;;
        "trigger")
            trigger_pipeline
            ;;
        "full")
            check_prerequisites
            init_git
            deploy_infrastructure
            configure_kubectl
            get_outputs
            ;;
        *)
            echo "Usage: $0 {check|init|deploy|outputs|kubectl|trigger|full}"
            echo ""
            echo "Commands:"
            echo "  check   - Check prerequisites"
            echo "  init    - Initialize Git repository"
            echo "  deploy  - Deploy AWS infrastructure"
            echo "  outputs - Show deployment outputs"
            echo "  kubectl - Configure kubectl for EKS"
            echo "  trigger - Trigger CodePipeline"
            echo "  full    - Full deployment (all steps)"
            exit 1
            ;;
    esac
}

main "$@"
