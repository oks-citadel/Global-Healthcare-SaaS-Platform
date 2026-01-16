#!/bin/bash
# ============================================
# AWS Provider Validation Script
# ============================================
# Validates that AWS infrastructure is properly
# configured and no Azure remnants exist
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TERRAFORM_AWS_DIR="infrastructure/terraform-aws"
SCRIPTS_DIR="scripts"

echo "============================================"
echo "AWS Provider Validation - STATE-CHECK"
echo "============================================"
echo ""

AWS_VALID=0
WARNINGS=0

# Check for Azure remnants in AWS Terraform
echo "Checking AWS Terraform for Azure contamination..."
echo ""

# Check for azurerm provider
AZURERM_COUNT=$(grep -r "azurerm" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null | wc -l || echo "0")
if [ "$AZURERM_COUNT" -gt 0 ]; then
    echo -e "${RED}[FAIL] Found 'azurerm' references in AWS Terraform:${NC}"
    grep -r "azurerm" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null || true
    AWS_VALID=1
else
    echo -e "${GREEN}[PASS] No 'azurerm' provider references found${NC}"
fi

# Check for azuread provider
AZUREAD_COUNT=$(grep -r "azuread" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null | wc -l || echo "0")
if [ "$AZUREAD_COUNT" -gt 0 ]; then
    echo -e "${RED}[FAIL] Found 'azuread' references in AWS Terraform:${NC}"
    grep -r "azuread" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null || true
    AWS_VALID=1
else
    echo -e "${GREEN}[PASS] No 'azuread' provider references found${NC}"
fi

# Check for Azure resource types
AZURE_RESOURCES=$(grep -r "azurerm_\|azuread_" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null | wc -l || echo "0")
if [ "$AZURE_RESOURCES" -gt 0 ]; then
    echo -e "${RED}[FAIL] Found Azure resource types in AWS Terraform:${NC}"
    grep -r "azurerm_\|azuread_" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null || true
    AWS_VALID=1
else
    echo -e "${GREEN}[PASS] No Azure resource types found${NC}"
fi

echo ""
echo "============================================"
echo "Validating AWS Provider Configuration..."
echo "============================================"
echo ""

# Check that AWS provider exists
AWS_PROVIDER=$(grep -r "hashicorp/aws" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null | wc -l || echo "0")
if [ "$AWS_PROVIDER" -gt 0 ]; then
    echo -e "${GREEN}[PASS] AWS provider correctly configured${NC}"
else
    echo -e "${RED}[FAIL] AWS provider not found!${NC}"
    AWS_VALID=1
fi

# Check versions.tf exists
if [ -f "$TERRAFORM_AWS_DIR/versions.tf" ]; then
    echo -e "${GREEN}[PASS] versions.tf exists${NC}"
else
    echo -e "${RED}[FAIL] versions.tf missing!${NC}"
    AWS_VALID=1
fi

# Check backend.tf exists
if [ -f "$TERRAFORM_AWS_DIR/backend.tf" ]; then
    echo -e "${GREEN}[PASS] backend.tf exists${NC}"
    # Verify S3 backend is configured
    S3_BACKEND=$(grep -c "s3" "$TERRAFORM_AWS_DIR/backend.tf" 2>/dev/null || echo "0")
    if [ "$S3_BACKEND" -gt 0 ]; then
        echo -e "${GREEN}[PASS] S3 backend configured${NC}"
    else
        echo -e "${RED}[FAIL] S3 backend not configured!${NC}"
        AWS_VALID=1
    fi
else
    echo -e "${RED}[FAIL] backend.tf missing!${NC}"
    AWS_VALID=1
fi

echo ""
echo "============================================"
echo "Module Verification"
echo "============================================"
echo ""

# Verify AWS modules exist
MODULES=("vpc" "eks" "ecr" "rds" "elasticache" "secrets-manager" "cloudfront" "alb")
for module in "${MODULES[@]}"; do
    if [ -d "$TERRAFORM_AWS_DIR/modules/$module" ]; then
        echo -e "${GREEN}[PASS] Module '$module' exists${NC}"
    else
        echo -e "${RED}[FAIL] Module '$module' missing!${NC}"
        AWS_VALID=1
    fi
done

echo ""
echo "============================================"
echo "Scripts Validation"
echo "============================================"
echo ""

# Check deployment scripts use AWS
SCRIPTS_WITH_AZURE=$(grep -rl "az login\|az account\|az aks\|az acr\|\.azurecr\.io" "$SCRIPTS_DIR" --include="*.sh" 2>/dev/null | grep -v "azure-provider-check\|setup-azure" | wc -l || echo "0")
if [ "$SCRIPTS_WITH_AZURE" -gt 0 ]; then
    echo -e "${YELLOW}[WARN] Found scripts with Azure CLI references:${NC}"
    grep -rl "az login\|az account\|az aks\|az acr\|\.azurecr\.io" "$SCRIPTS_DIR" --include="*.sh" 2>/dev/null | grep -v "azure-provider-check\|setup-azure" || true
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}[PASS] No Azure CLI references in active scripts${NC}"
fi

# Check for AWS CLI usage
AWS_CLI_SCRIPTS=$(grep -rl "aws ecr\|aws eks\|aws s3\|aws secretsmanager" "$SCRIPTS_DIR" --include="*.sh" 2>/dev/null | wc -l || echo "0")
if [ "$AWS_CLI_SCRIPTS" -gt 0 ]; then
    echo -e "${GREEN}[PASS] AWS CLI properly used in $AWS_CLI_SCRIPTS scripts${NC}"
else
    echo -e "${YELLOW}[WARN] AWS CLI not found in deployment scripts${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Verify key scripts exist
echo ""
echo "Checking required AWS scripts..."
REQUIRED_SCRIPTS=("setup-aws.sh" "deploy-staging.sh" "deploy-production.sh" "db-backup.sh" "db-restore.sh" "rollback.sh" "setup-secrets.sh")
for script in "${REQUIRED_SCRIPTS[@]}"; do
    if [ -f "$SCRIPTS_DIR/$script" ]; then
        echo -e "${GREEN}[PASS] $script exists${NC}"
    else
        echo -e "${RED}[FAIL] $script missing!${NC}"
        AWS_VALID=1
    fi
done

echo ""
echo "============================================"
echo "AWS Resource Pattern Check"
echo "============================================"
echo ""

# Check for AWS resource patterns in scripts
echo "Checking for correct AWS patterns..."

# ECR pattern
ECR_PATTERN=$(grep -r "\.dkr\.ecr\." "$SCRIPTS_DIR" --include="*.sh" 2>/dev/null | wc -l || echo "0")
if [ "$ECR_PATTERN" -gt 0 ]; then
    echo -e "${GREEN}[PASS] ECR pattern (*.dkr.ecr.*) found${NC}"
else
    echo -e "${YELLOW}[WARN] ECR pattern not found in scripts${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# EKS pattern
EKS_PATTERN=$(grep -r "aws eks update-kubeconfig" "$SCRIPTS_DIR" --include="*.sh" 2>/dev/null | wc -l || echo "0")
if [ "$EKS_PATTERN" -gt 0 ]; then
    echo -e "${GREEN}[PASS] EKS kubeconfig pattern found${NC}"
else
    echo -e "${YELLOW}[WARN] EKS kubeconfig pattern not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Secrets Manager pattern
SM_PATTERN=$(grep -r "aws secretsmanager" "$SCRIPTS_DIR" --include="*.sh" 2>/dev/null | wc -l || echo "0")
if [ "$SM_PATTERN" -gt 0 ]; then
    echo -e "${GREEN}[PASS] Secrets Manager pattern found${NC}"
else
    echo -e "${YELLOW}[WARN] Secrets Manager pattern not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# S3 pattern
S3_PATTERN=$(grep -r "aws s3" "$SCRIPTS_DIR" --include="*.sh" 2>/dev/null | wc -l || echo "0")
if [ "$S3_PATTERN" -gt 0 ]; then
    echo -e "${GREEN}[PASS] S3 pattern found${NC}"
else
    echo -e "${YELLOW}[WARN] S3 pattern not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "============================================"
echo "Environment Variable Check"
echo "============================================"
echo ""

# Check for AWS environment variables
echo "Checking for correct AWS environment variables..."

AWS_VARS=$(grep -r "AWS_REGION\|AWS_ACCOUNT_ID\|ECR_REGISTRY\|EKS_CLUSTER" "$SCRIPTS_DIR" --include="*.sh" 2>/dev/null | wc -l || echo "0")
if [ "$AWS_VARS" -gt 0 ]; then
    echo -e "${GREEN}[PASS] AWS environment variables found${NC}"
else
    echo -e "${RED}[FAIL] AWS environment variables not found!${NC}"
    AWS_VALID=1
fi

# Check for deprecated Azure variables
AZURE_VARS=$(grep -r "AZURE_\|ACR_NAME\|AKS_CLUSTER\|RESOURCE_GROUP" "$SCRIPTS_DIR" --include="*.sh" 2>/dev/null | grep -v "azure-provider-check\|setup-azure" | wc -l || echo "0")
if [ "$AZURE_VARS" -gt 0 ]; then
    echo -e "${YELLOW}[WARN] Found Azure-style environment variables:${NC}"
    grep -r "AZURE_\|ACR_NAME\|AKS_CLUSTER\|RESOURCE_GROUP" "$SCRIPTS_DIR" --include="*.sh" 2>/dev/null | grep -v "azure-provider-check\|setup-azure" | head -10 || true
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}[PASS] No Azure environment variables in active scripts${NC}"
fi

echo ""
echo "============================================"
echo "Summary"
echo "============================================"
echo ""

# Count total files
TF_FILES=$(find "$TERRAFORM_AWS_DIR" -name "*.tf" 2>/dev/null | wc -l || echo "0")
SCRIPT_FILES=$(find "$SCRIPTS_DIR" -name "*.sh" 2>/dev/null | wc -l || echo "0")
echo "Total .tf files in AWS Terraform: $TF_FILES"
echo "Total .sh files in scripts: $SCRIPT_FILES"

if [ "$AWS_VALID" -eq 0 ]; then
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}AWS VALIDATION PASSED${NC}"
    echo -e "${GREEN}Infrastructure is properly configured for AWS${NC}"
    echo -e "${GREEN}============================================${NC}"

    if [ "$WARNINGS" -gt 0 ]; then
        echo -e "${YELLOW}Warnings: $WARNINGS (review recommended)${NC}"
    fi

    exit 0
else
    echo ""
    echo -e "${RED}============================================${NC}"
    echo -e "${RED}AWS VALIDATION FAILED${NC}"
    echo -e "${RED}Issues found in AWS configuration!${NC}"
    echo -e "${RED}============================================${NC}"
    exit 1
fi
