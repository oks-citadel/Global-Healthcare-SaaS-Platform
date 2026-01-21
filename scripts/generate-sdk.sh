#!/bin/bash

# Script to generate TypeScript SDK from OpenAPI specification
# This script uses openapi-generator-cli to generate client code

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Unified Health Platform${NC}"
echo -e "${BLUE}SDK Generation Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if OpenAPI spec file exists or API is running
OPENAPI_SPEC_URL="http://localhost:4000/api/docs/openapi.json"
OPENAPI_SPEC_FILE="./services/api/openapi.json"
SDK_OUTPUT_DIR="./packages/sdk/src/generated"
SDK_SOURCE_DIR="./packages/sdk/src"

# Function to check if API is running
check_api_running() {
    echo -e "${BLUE}Checking if API is running...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" "$OPENAPI_SPEC_URL" | grep -q "200"; then
        echo -e "${GREEN}API is running${NC}"
        return 0
    else
        echo -e "${RED}API is not running${NC}"
        return 1
    fi
}

# Function to download OpenAPI spec
download_spec() {
    echo -e "${BLUE}Downloading OpenAPI specification...${NC}"
    if curl -s "$OPENAPI_SPEC_URL" -o "$OPENAPI_SPEC_FILE"; then
        echo -e "${GREEN}OpenAPI spec downloaded successfully${NC}"
        return 0
    else
        echo -e "${RED}Failed to download OpenAPI spec${NC}"
        return 1
    fi
}

# Function to validate OpenAPI spec
validate_spec() {
    echo -e "${BLUE}Validating OpenAPI specification...${NC}"
    if [ -f "$OPENAPI_SPEC_FILE" ]; then
        # Basic validation - check if it's valid JSON
        if jq empty "$OPENAPI_SPEC_FILE" 2>/dev/null; then
            echo -e "${GREEN}OpenAPI spec is valid JSON${NC}"
            return 0
        else
            echo -e "${RED}OpenAPI spec is not valid JSON${NC}"
            return 1
        fi
    else
        echo -e "${RED}OpenAPI spec file not found${NC}"
        return 1
    fi
}

# Function to generate SDK using openapi-generator
generate_with_openapi_generator() {
    echo -e "${BLUE}Generating SDK with openapi-generator-cli...${NC}"

    # Check if openapi-generator-cli is installed
    if ! command -v openapi-generator-cli &> /dev/null; then
        echo -e "${RED}openapi-generator-cli is not installed${NC}"
        echo -e "${BLUE}Installing openapi-generator-cli...${NC}"
        npm install -g @openapitools/openapi-generator-cli
    fi

    # Create output directory if it doesn't exist
    mkdir -p "$SDK_OUTPUT_DIR"

    # Generate TypeScript client
    openapi-generator-cli generate \
        -i "$OPENAPI_SPEC_FILE" \
        -g typescript-axios \
        -o "$SDK_OUTPUT_DIR" \
        --additional-properties=supportsES6=true,withSeparateModelsAndApi=true,modelPackage=models,apiPackage=api \
        --skip-validate-spec

    echo -e "${GREEN}SDK generation completed${NC}"
}

# Function to generate SDK using custom templates
generate_custom_sdk() {
    echo -e "${BLUE}Custom SDK is already implemented${NC}"
    echo -e "${GREEN}Using handcrafted TypeScript SDK in ${SDK_SOURCE_DIR}${NC}"
    echo ""
    echo -e "${BLUE}SDK includes:${NC}"
    echo "  - Type-safe API client"
    echo "  - Automatic token refresh"
    echo "  - Comprehensive type definitions"
    echo "  - Support for all endpoints"
    echo ""
    echo -e "${GREEN}To use the SDK:${NC}"
    echo "  1. Build the SDK: cd packages/sdk && npm run build"
    echo "  2. Import in your app: import { createClient } from '@unified-health/sdk'"
}

# Function to build SDK
build_sdk() {
    echo -e "${BLUE}Building SDK package...${NC}"
    cd packages/sdk
    npm install
    npm run build
    cd ../..
    echo -e "${GREEN}SDK built successfully${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Starting SDK generation process...${NC}"
    echo ""

    # Option 1: Use the handcrafted SDK (recommended)
    generate_custom_sdk

    # Option 2: Generate from OpenAPI spec (optional)
    read -p "Do you want to generate additional code from OpenAPI spec? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if check_api_running; then
            download_spec
            if validate_spec; then
                generate_with_openapi_generator
            else
                echo -e "${RED}Skipping SDK generation due to invalid spec${NC}"
            fi
        else
            echo -e "${RED}Please start the API server first:${NC}"
            echo "  cd services/api && npm run dev"
            echo ""
            echo -e "${BLUE}Using existing handcrafted SDK instead${NC}"
        fi
    fi

    # Build the SDK
    echo ""
    read -p "Do you want to build the SDK now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        build_sdk
    fi

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}SDK generation process completed!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "  1. Review generated types in packages/sdk/src/types.ts"
    echo "  2. Test the SDK: cd packages/sdk && npm test"
    echo "  3. Use in your applications:"
    echo "     - Web: cd apps/web && npm install @unified-health/sdk"
    echo "     - Mobile: cd apps/mobile && npm install @unified-health/sdk"
    echo ""
}

# Run main function
main
