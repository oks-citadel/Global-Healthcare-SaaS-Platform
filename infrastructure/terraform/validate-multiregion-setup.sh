#!/bin/bash

# ============================================
# UnifiedHealth Platform - Multi-Region Setup Validator
# ============================================
# Validates that all required files are present

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

MISSING_FILES=0
TOTAL_FILES=0

check_file() {
    TOTAL_FILES=$((TOTAL_FILES + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 - MISSING"
        MISSING_FILES=$((MISSING_FILES + 1))
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ - MISSING"
        return 1
    fi
}

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Multi-Region Setup Validation${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

echo -e "${YELLOW}Core Infrastructure Files:${NC}"
check_file "main-multiregion.tf"
check_file "global.tf"
check_file "variables-multiregion.tf"
check_file "outputs-multiregion.tf"
echo ""

echo -e "${YELLOW}Regional Module:${NC}"
check_dir "modules/region"
check_file "modules/region/main.tf"
check_file "modules/region/variables.tf"
check_file "modules/region/outputs.tf"
echo ""

echo -e "${YELLOW}Environment Configurations:${NC}"
check_dir "environments"
check_file "environments/prod-americas.tfvars"
check_file "environments/prod-europe.tfvars"
check_file "environments/prod-africa.tfvars"
echo ""

echo -e "${YELLOW}Documentation:${NC}"
check_file "MULTIREGION_DEPLOYMENT_GUIDE.md"
check_file "README.MULTIREGION.md"
check_file "MULTIREGION_FILES_SUMMARY.md"
check_file "MULTIREGION_QUICK_START.md"
echo ""

echo -e "${YELLOW}Automation Scripts:${NC}"
check_file "Makefile.multiregion"
check_file "deploy-multiregion.sh"
check_file "terraform.tfvars.example"
echo ""

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Validation Summary${NC}"
echo -e "${BLUE}============================================${NC}"

if [ $MISSING_FILES -eq 0 ]; then
    echo -e "${GREEN}✓ All $TOTAL_FILES required files are present!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Copy terraform.tfvars.example to terraform.tfvars"
    echo "2. Edit terraform.tfvars with your configuration"
    echo "3. Run: ./deploy-multiregion.sh"
    echo ""
    echo "Or use the Makefile:"
    echo "  make -f Makefile.multiregion help"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Missing $MISSING_FILES out of $TOTAL_FILES files${NC}"
    echo ""
    echo "Please ensure all files are created before deploying."
    exit 1
fi
