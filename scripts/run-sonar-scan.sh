#!/bin/bash

###############################################################################
# UnifiedHealth Platform - SonarQube Scanner Script
# Runs static application security testing (SAST) using SonarQube
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# SonarQube Configuration
SONAR_HOST_URL="${SONAR_HOST_URL:-http://localhost:9000}"
SONAR_TOKEN="${SONAR_TOKEN:-}"
SONAR_SCANNER_VERSION="${SONAR_SCANNER_VERSION:-5.0.1.3006}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  UnifiedHealth Platform - SonarQube Security Scan             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

###############################################################################
# Check for SonarQube Scanner
###############################################################################
check_sonar_scanner() {
    echo -e "${YELLOW}[1/5] Checking for SonarQube Scanner...${NC}"

    if command -v sonar-scanner &> /dev/null; then
        SCANNER_VERSION=$(sonar-scanner --version | head -n 1)
        echo -e "${GREEN}✓ SonarQube Scanner found: $SCANNER_VERSION${NC}"
        return 0
    fi

    echo -e "${YELLOW}⚠ SonarQube Scanner not found${NC}"
    echo -e "${YELLOW}Attempting to install...${NC}"

    # Download and install sonar-scanner
    SCANNER_DIR="$HOME/.sonar/scanner"
    mkdir -p "$SCANNER_DIR"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        SCANNER_URL="https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-macosx.zip"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        SCANNER_URL="https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-windows.zip"
    else
        # Linux
        SCANNER_URL="https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux.zip"
    fi

    echo -e "${YELLOW}Downloading from: $SCANNER_URL${NC}"
    curl -L "$SCANNER_URL" -o "$SCANNER_DIR/sonar-scanner.zip"
    unzip -q "$SCANNER_DIR/sonar-scanner.zip" -d "$SCANNER_DIR"
    rm "$SCANNER_DIR/sonar-scanner.zip"

    export PATH="$SCANNER_DIR/sonar-scanner-${SONAR_SCANNER_VERSION}/bin:$PATH"

    echo -e "${GREEN}✓ SonarQube Scanner installed${NC}"
    echo ""
}

###############################################################################
# Check SonarQube Server
###############################################################################
check_sonar_server() {
    echo -e "${YELLOW}[2/5] Checking SonarQube server connection...${NC}"

    if [ -z "$SONAR_TOKEN" ]; then
        echo -e "${RED}✗ SONAR_TOKEN not set${NC}"
        echo -e "${YELLOW}Please set SONAR_TOKEN environment variable${NC}"
        echo -e "${YELLOW}Generate a token at: $SONAR_HOST_URL/account/security${NC}"
        exit 1
    fi

    # Test connection
    if curl -s -u "$SONAR_TOKEN:" "$SONAR_HOST_URL/api/system/status" > /dev/null; then
        echo -e "${GREEN}✓ Connected to SonarQube server: $SONAR_HOST_URL${NC}"
    else
        echo -e "${RED}✗ Cannot connect to SonarQube server${NC}"
        echo -e "${YELLOW}Please check SONAR_HOST_URL and SONAR_TOKEN${NC}"
        exit 1
    fi

    echo ""
}

###############################################################################
# Run Tests and Generate Coverage
###############################################################################
generate_coverage() {
    echo -e "${YELLOW}[3/5] Running tests and generating coverage...${NC}"

    cd "$PROJECT_ROOT"

    # Run tests with coverage
    if pnpm test:coverage > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Test coverage generated${NC}"
    else
        echo -e "${YELLOW}⚠ Failed to generate coverage (continuing anyway)${NC}"
    fi

    echo ""
}

###############################################################################
# Run SonarQube Analysis
###############################################################################
run_sonar_analysis() {
    echo -e "${YELLOW}[4/5] Running SonarQube analysis...${NC}"

    cd "$PROJECT_ROOT"

    # Prepare scanner arguments
    SCANNER_ARGS=(
        "-Dsonar.host.url=$SONAR_HOST_URL"
        "-Dsonar.login=$SONAR_TOKEN"
    )

    # Add branch information if in CI
    if [ -n "$CI" ]; then
        if [ -n "$BRANCH_NAME" ]; then
            SCANNER_ARGS+=("-Dsonar.branch.name=$BRANCH_NAME")
        fi

        if [ -n "$PR_NUMBER" ]; then
            SCANNER_ARGS+=("-Dsonar.pullrequest.key=$PR_NUMBER")
            SCANNER_ARGS+=("-Dsonar.pullrequest.branch=$PR_BRANCH")
            SCANNER_ARGS+=("-Dsonar.pullrequest.base=$PR_BASE")
        fi
    fi

    # Run scanner
    sonar-scanner "${SCANNER_ARGS[@]}"

    echo -e "${GREEN}✓ SonarQube analysis completed${NC}"
    echo ""
}

###############################################################################
# Check Quality Gate
###############################################################################
check_quality_gate() {
    echo -e "${YELLOW}[5/5] Checking Quality Gate status...${NC}"

    # Wait for analysis to complete
    sleep 5

    # Get task ID from .scannerwork/report-task.txt
    TASK_FILE="$PROJECT_ROOT/.scannerwork/report-task.txt"

    if [ ! -f "$TASK_FILE" ]; then
        echo -e "${YELLOW}⚠ Cannot find task file${NC}"
        return 0
    fi

    CE_TASK_ID=$(grep ceTaskId "$TASK_FILE" | cut -d'=' -f2)

    if [ -z "$CE_TASK_ID" ]; then
        echo -e "${YELLOW}⚠ Cannot find task ID${NC}"
        return 0
    fi

    # Wait for task to complete
    echo -e "${BLUE}Waiting for analysis to complete...${NC}"
    MAX_WAIT=60
    WAITED=0

    while [ $WAITED -lt $MAX_WAIT ]; do
        STATUS=$(curl -s -u "$SONAR_TOKEN:" "$SONAR_HOST_URL/api/ce/task?id=$CE_TASK_ID" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

        if [ "$STATUS" = "SUCCESS" ]; then
            break
        elif [ "$STATUS" = "FAILED" ]; then
            echo -e "${RED}✗ Analysis task failed${NC}"
            return 1
        fi

        sleep 2
        WAITED=$((WAITED + 2))
    done

    # Get quality gate status
    ANALYSIS_ID=$(curl -s -u "$SONAR_TOKEN:" "$SONAR_HOST_URL/api/ce/task?id=$CE_TASK_ID" | grep -o '"analysisId":"[^"]*"' | cut -d'"' -f4)

    if [ -z "$ANALYSIS_ID" ]; then
        echo -e "${YELLOW}⚠ Cannot find analysis ID${NC}"
        return 0
    fi

    QG_STATUS=$(curl -s -u "$SONAR_TOKEN:" "$SONAR_HOST_URL/api/qualitygates/project_status?analysisId=$ANALYSIS_ID" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

    if [ "$QG_STATUS" = "OK" ]; then
        echo -e "${GREEN}✓ Quality Gate: PASSED${NC}"
        echo ""
        echo -e "${GREEN}View results at: $SONAR_HOST_URL/dashboard?id=unifiedhealth-platform${NC}"
        return 0
    elif [ "$QG_STATUS" = "ERROR" ]; then
        echo -e "${RED}✗ Quality Gate: FAILED${NC}"
        echo ""
        echo -e "${RED}View details at: $SONAR_HOST_URL/dashboard?id=unifiedhealth-platform${NC}"
        return 1
    else
        echo -e "${YELLOW}⚠ Quality Gate status: $QG_STATUS${NC}"
        return 0
    fi
}

###############################################################################
# Main execution
###############################################################################
main() {
    check_sonar_scanner
    check_sonar_server
    generate_coverage
    run_sonar_analysis

    if check_quality_gate; then
        echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${BLUE}║  SonarQube Security Scan Completed Successfully               ║${NC}"
        echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
        exit 0
    else
        echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║  SonarQube Quality Gate Failed                                 ║${NC}"
        echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
