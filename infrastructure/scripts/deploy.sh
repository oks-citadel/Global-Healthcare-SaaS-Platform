#!/bin/bash
# ============================================
# UnifiedHealth Platform - AWS Deployment Script
# ============================================
# AWS Account: 992382449461
# Organizational Unit: ou-2kqs-qw6vym5t
# Region: us-east-1
# ============================================

set -e

# Configuration
AWS_ACCOUNT_ID="992382449461"
AWS_REGION="us-east-1"
PROJECT_NAME="unified-health"
ENVIRONMENT="${1:-prod}"
STATE_BUCKET="unified-health-terraform-state-${AWS_ACCOUNT_ID}"
LOCK_TABLE="unified-health-terraform-locks"

echo "============================================"
echo "UnifiedHealth Platform - AWS Deployment"
echo "============================================"
echo "Account ID: ${AWS_ACCOUNT_ID}"
echo "Region: ${AWS_REGION}"
echo "Environment: ${ENVIRONMENT}"
echo "============================================"

# Verify AWS credentials
echo ""
echo "Verifying AWS credentials..."
CURRENT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")

if [ "$CURRENT_ACCOUNT" != "$AWS_ACCOUNT_ID" ]; then
    echo "ERROR: Current AWS account ($CURRENT_ACCOUNT) does not match expected account ($AWS_ACCOUNT_ID)"
    echo "Please configure your AWS credentials for the correct account."
    exit 1
fi

echo "AWS credentials verified for account: ${AWS_ACCOUNT_ID}"

# Function to create bootstrap resources
bootstrap_terraform_backend() {
    echo ""
    echo "Creating Terraform state backend resources..."

    # Check if bucket exists
    if aws s3api head-bucket --bucket "$STATE_BUCKET" 2>/dev/null; then
        echo "State bucket already exists: ${STATE_BUCKET}"
    else
        echo "Creating S3 bucket for Terraform state..."
        aws s3api create-bucket \
            --bucket "$STATE_BUCKET" \
            --region "$AWS_REGION"

        echo "Enabling versioning..."
        aws s3api put-bucket-versioning \
            --bucket "$STATE_BUCKET" \
            --versioning-configuration Status=Enabled

        echo "Enabling encryption..."
        aws s3api put-bucket-encryption \
            --bucket "$STATE_BUCKET" \
            --server-side-encryption-configuration '{
                "Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "aws:kms"}}]
            }'

        echo "Blocking public access..."
        aws s3api put-public-access-block \
            --bucket "$STATE_BUCKET" \
            --public-access-block-configuration \
            "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
    fi

    # Check if DynamoDB table exists
    if aws dynamodb describe-table --table-name "$LOCK_TABLE" --region "$AWS_REGION" 2>/dev/null; then
        echo "Lock table already exists: ${LOCK_TABLE}"
    else
        echo "Creating DynamoDB table for state locking..."
        aws dynamodb create-table \
            --table-name "$LOCK_TABLE" \
            --attribute-definitions AttributeName=LockID,AttributeType=S \
            --key-schema AttributeName=LockID,KeyType=HASH \
            --billing-mode PAY_PER_REQUEST \
            --region "$AWS_REGION"

        echo "Waiting for table to be active..."
        aws dynamodb wait table-exists --table-name "$LOCK_TABLE" --region "$AWS_REGION"
    fi

    echo "Terraform backend resources ready!"
}

# Function to initialize Terraform
init_terraform() {
    echo ""
    echo "Initializing Terraform..."
    cd "$(dirname "$0")/../terraform"

    terraform init \
        -backend-config="bucket=${STATE_BUCKET}" \
        -backend-config="key=${PROJECT_NAME}/${ENVIRONMENT}/terraform.tfstate" \
        -backend-config="region=${AWS_REGION}" \
        -backend-config="dynamodb_table=${LOCK_TABLE}" \
        -backend-config="encrypt=true"

    echo "Terraform initialized!"
}

# Function to plan deployment
plan_deployment() {
    echo ""
    echo "Planning Terraform deployment..."
    cd "$(dirname "$0")/../terraform"

    terraform plan \
        -var="environment=${ENVIRONMENT}" \
        -var="aws_account_id=${AWS_ACCOUNT_ID}" \
        -var="aws_region=${AWS_REGION}" \
        -out=tfplan

    echo "Plan saved to: tfplan"
}

# Function to apply deployment
apply_deployment() {
    echo ""
    echo "Applying Terraform deployment..."
    cd "$(dirname "$0")/../terraform"

    terraform apply tfplan

    echo "Deployment complete!"
}

# Function to output connection info
output_info() {
    echo ""
    echo "============================================"
    echo "Deployment Outputs"
    echo "============================================"
    cd "$(dirname "$0")/../terraform"
    terraform output
}

# Main execution
case "${2:-deploy}" in
    bootstrap)
        bootstrap_terraform_backend
        ;;
    init)
        bootstrap_terraform_backend
        init_terraform
        ;;
    plan)
        init_terraform
        plan_deployment
        ;;
    apply)
        apply_deployment
        output_info
        ;;
    deploy)
        bootstrap_terraform_backend
        init_terraform
        plan_deployment
        echo ""
        read -p "Do you want to apply this plan? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            apply_deployment
            output_info
        else
            echo "Deployment cancelled."
        fi
        ;;
    destroy)
        echo "WARNING: This will destroy all infrastructure!"
        read -p "Type 'destroy' to confirm: " confirm
        if [ "$confirm" = "destroy" ]; then
            cd "$(dirname "$0")/../terraform"
            terraform destroy \
                -var="environment=${ENVIRONMENT}" \
                -var="aws_account_id=${AWS_ACCOUNT_ID}" \
                -var="aws_region=${AWS_REGION}"
        fi
        ;;
    *)
        echo "Usage: $0 [environment] [command]"
        echo ""
        echo "Environments: dev, staging, prod (default: prod)"
        echo ""
        echo "Commands:"
        echo "  bootstrap  - Create S3 bucket and DynamoDB table for state"
        echo "  init       - Initialize Terraform backend"
        echo "  plan       - Create execution plan"
        echo "  apply      - Apply the plan"
        echo "  deploy     - Full deployment (bootstrap + init + plan + apply)"
        echo "  destroy    - Destroy all infrastructure"
        echo ""
        echo "Examples:"
        echo "  $0 prod deploy    # Full production deployment"
        echo "  $0 dev plan       # Plan development deployment"
        echo "  $0 staging init   # Initialize staging environment"
        ;;
esac
