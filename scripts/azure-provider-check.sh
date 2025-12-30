#!/bin/bash
# ============================================
# Azure Provider Detection Script
# ============================================
# Validates that NO Azure providers exist in the
# new AWS Terraform codebase
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TERRAFORM_AWS_DIR="infrastructure/terraform-aws"
TERRAFORM_AZURE_DIR="infrastructure/terraform"

echo "============================================"
echo "Azure Provider Detection - STATE-CHECK"
echo "============================================"
echo ""

AZURE_FOUND=0
WARNINGS=0

# Check for Azure providers in new AWS Terraform
echo "Checking AWS Terraform for Azure contamination..."
echo ""

# Check for azurerm provider
AZURERM_COUNT=$(grep -r "azurerm" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null | wc -l || echo "0")
if [ "$AZURERM_COUNT" -gt 0 ]; then
    echo -e "${RED}[FAIL] Found 'azurerm' references in AWS Terraform:${NC}"
    grep -r "azurerm" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null || true
    AZURE_FOUND=1
else
    echo -e "${GREEN}[PASS] No 'azurerm' provider references found${NC}"
fi

# Check for azuread provider
AZUREAD_COUNT=$(grep -r "azuread" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null | wc -l || echo "0")
if [ "$AZUREAD_COUNT" -gt 0 ]; then
    echo -e "${RED}[FAIL] Found 'azuread' references in AWS Terraform:${NC}"
    grep -r "azuread" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null || true
    AZURE_FOUND=1
else
    echo -e "${GREEN}[PASS] No 'azuread' provider references found${NC}"
fi

# Check for Azure resource types
AZURE_RESOURCES=$(grep -r "azurerm_\|azuread_" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null | wc -l || echo "0")
if [ "$AZURE_RESOURCES" -gt 0 ]; then
    echo -e "${RED}[FAIL] Found Azure resource types in AWS Terraform:${NC}"
    grep -r "azurerm_\|azuread_" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null || true
    AZURE_FOUND=1
else
    echo -e "${GREEN}[PASS] No Azure resource types found${NC}"
fi

# Check for Azure-specific naming patterns
AZURE_PATTERNS=$(grep -ri "\.azure\.\|\.microsoft\.\|\.windows\.net\|eastus\|westeurope\|southafricanorth" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null | grep -v "#" | wc -l || echo "0")
if [ "$AZURE_PATTERNS" -gt 0 ]; then
    echo -e "${YELLOW}[WARN] Found potential Azure naming patterns:${NC}"
    grep -ri "\.azure\.\|\.microsoft\.\|\.windows\.net\|eastus\|westeurope\|southafricanorth" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null | grep -v "#" || true
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}[PASS] No Azure naming patterns found${NC}"
fi

echo ""
echo "============================================"
echo "Validating AWS-only providers..."
echo "============================================"
echo ""

# Check that AWS provider exists
AWS_PROVIDER=$(grep -r "hashicorp/aws" "$TERRAFORM_AWS_DIR" --include="*.tf" 2>/dev/null | wc -l || echo "0")
if [ "$AWS_PROVIDER" -gt 0 ]; then
    echo -e "${GREEN}[PASS] AWS provider correctly configured${NC}"
else
    echo -e "${RED}[FAIL] AWS provider not found!${NC}"
    AZURE_FOUND=1
fi

# Check versions.tf exists
if [ -f "$TERRAFORM_AWS_DIR/versions.tf" ]; then
    echo -e "${GREEN}[PASS] versions.tf exists${NC}"
else
    echo -e "${RED}[FAIL] versions.tf missing!${NC}"
    AZURE_FOUND=1
fi

# Check backend.tf exists
if [ -f "$TERRAFORM_AWS_DIR/backend.tf" ]; then
    echo -e "${GREEN}[PASS] backend.tf exists${NC}"
else
    echo -e "${RED}[FAIL] backend.tf missing!${NC}"
    AZURE_FOUND=1
fi

echo ""
echo "============================================"
echo "Module Translation Verification"
echo "============================================"
echo ""

# Verify AWS modules exist
MODULES=("vpc" "eks" "ecr" "rds" "elasticache" "secrets-manager" "cloudfront" "alb")
for module in "${MODULES[@]}"; do
    if [ -d "$TERRAFORM_AWS_DIR/modules/$module" ]; then
        echo -e "${GREEN}[PASS] Module '$module' exists${NC}"
    else
        echo -e "${RED}[FAIL] Module '$module' missing!${NC}"
        AZURE_FOUND=1
    fi
done

echo ""
echo "============================================"
echo "Summary"
echo "============================================"
echo ""

# Count total files
TF_FILES=$(find "$TERRAFORM_AWS_DIR" -name "*.tf" 2>/dev/null | wc -l || echo "0")
echo "Total .tf files in AWS Terraform: $TF_FILES"

if [ "$AZURE_FOUND" -eq 0 ]; then
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}STATE-CHECK PASSED${NC}"
    echo -e "${GREEN}No Azure providers detected in AWS Terraform${NC}"
    echo -e "${GREEN}============================================${NC}"

    if [ "$WARNINGS" -gt 0 ]; then
        echo -e "${YELLOW}Warnings: $WARNINGS (review recommended)${NC}"
    fi

    exit 0
else
    echo ""
    echo -e "${RED}============================================${NC}"
    echo -e "${RED}STATE-CHECK FAILED${NC}"
    echo -e "${RED}Azure contamination detected!${NC}"
    echo -e "${RED}============================================${NC}"
    exit 1
fi
