#!/bin/bash

###############################################################################
# UnifiedHealth Platform - Container Security Scanner
# Scans Docker images for vulnerabilities using Trivy
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
REPORTS_DIR="$PROJECT_ROOT/security-reports/container-scans"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Scan settings
SEVERITY="${SEVERITY:-CRITICAL,HIGH}"
EXIT_CODE="${EXIT_CODE:-1}"
FORMAT="${FORMAT:-table}"

# Images to scan
IMAGES=(
    "unified-health-api:latest"
    "unified-health-web:latest"
    "unified-health-mobile:latest"
)

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  UnifiedHealth Platform - Container Security Scanner          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

###############################################################################
# Check for Trivy
###############################################################################
check_trivy() {
    echo -e "${YELLOW}[1/4] Checking for Trivy...${NC}"

    if command -v trivy &> /dev/null; then
        TRIVY_VERSION=$(trivy --version | head -n 1)
        echo -e "${GREEN}✓ Trivy found: $TRIVY_VERSION${NC}"
        return 0
    fi

    echo -e "${YELLOW}⚠ Trivy not found. Installing...${NC}"

    # Install Trivy based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install aquasecurity/trivy/trivy
        else
            echo -e "${RED}✗ Homebrew not found. Please install Trivy manually${NC}"
            echo -e "${YELLOW}Visit: https://aquasecurity.github.io/trivy/latest/getting-started/installation/${NC}"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
        echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
        sudo apt-get update
        sudo apt-get install trivy -y
    else
        echo -e "${RED}✗ Unsupported OS. Please install Trivy manually${NC}"
        echo -e "${YELLOW}Visit: https://aquasecurity.github.io/trivy/latest/getting-started/installation/${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ Trivy installed${NC}"
    echo ""
}

###############################################################################
# Update Trivy database
###############################################################################
update_database() {
    echo -e "${YELLOW}[2/4] Updating Trivy vulnerability database...${NC}"

    if trivy image --download-db-only > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Database updated${NC}"
    else
        echo -e "${RED}✗ Failed to update database${NC}"
        exit 1
    fi

    echo ""
}

###############################################################################
# Scan Docker images
###############################################################################
scan_images() {
    echo -e "${YELLOW}[3/4] Scanning Docker images...${NC}"

    # Create reports directory
    mkdir -p "$REPORTS_DIR"

    SCAN_FAILED=0
    SCANNED_COUNT=0
    FAILED_IMAGES=()

    for IMAGE in "${IMAGES[@]}"; do
        echo ""
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}Scanning: $IMAGE${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

        # Check if image exists
        if ! docker image inspect "$IMAGE" > /dev/null 2>&1; then
            echo -e "${YELLOW}⚠ Image not found: $IMAGE (skipping)${NC}"
            continue
        fi

        SCANNED_COUNT=$((SCANNED_COUNT + 1))

        # Generate report filename
        IMAGE_NAME=$(echo "$IMAGE" | tr ':/' '_')
        REPORT_FILE="$REPORTS_DIR/${IMAGE_NAME}_${TIMESTAMP}"

        # Run Trivy scan
        echo -e "${BLUE}Running vulnerability scan...${NC}"

        # Scan for vulnerabilities
        if trivy image \
            --severity "$SEVERITY" \
            --format table \
            --output "$REPORT_FILE.txt" \
            "$IMAGE"; then
            echo -e "${GREEN}✓ Scan completed: $IMAGE${NC}"
        else
            echo -e "${RED}✗ Vulnerabilities found in: $IMAGE${NC}"
            SCAN_FAILED=1
            FAILED_IMAGES+=("$IMAGE")
        fi

        # Generate JSON report for programmatic analysis
        trivy image \
            --severity "$SEVERITY" \
            --format json \
            --output "$REPORT_FILE.json" \
            "$IMAGE" > /dev/null 2>&1 || true

        # Generate SARIF report for GitHub Security
        trivy image \
            --severity "$SEVERITY" \
            --format sarif \
            --output "$REPORT_FILE.sarif" \
            "$IMAGE" > /dev/null 2>&1 || true

        # Scan for secrets
        echo -e "${BLUE}Scanning for secrets...${NC}"
        trivy image \
            --scanners secret \
            --format table \
            --output "$REPORT_FILE.secrets.txt" \
            "$IMAGE" > /dev/null 2>&1 || true

        # Scan for misconfigurations
        echo -e "${BLUE}Scanning for misconfigurations...${NC}"
        trivy image \
            --scanners config \
            --format table \
            --output "$REPORT_FILE.config.txt" \
            "$IMAGE" > /dev/null 2>&1 || true

        # Generate SBOM (Software Bill of Materials)
        echo -e "${BLUE}Generating SBOM...${NC}"
        trivy image \
            --format cyclonedx \
            --output "$REPORT_FILE.sbom.json" \
            "$IMAGE" > /dev/null 2>&1 || true

        echo -e "${GREEN}✓ Reports saved:${NC}"
        echo -e "  - Vulnerabilities: $REPORT_FILE.txt"
        echo -e "  - JSON: $REPORT_FILE.json"
        echo -e "  - SARIF: $REPORT_FILE.sarif"
        echo -e "  - Secrets: $REPORT_FILE.secrets.txt"
        echo -e "  - Config: $REPORT_FILE.config.txt"
        echo -e "  - SBOM: $REPORT_FILE.sbom.json"
    done

    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Scan Summary${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "Total images scanned: $SCANNED_COUNT"

    if [ ${#FAILED_IMAGES[@]} -gt 0 ]; then
        echo -e "${RED}Failed images: ${#FAILED_IMAGES[@]}${NC}"
        for IMG in "${FAILED_IMAGES[@]}"; do
            echo -e "${RED}  - $IMG${NC}"
        done
    else
        echo -e "${GREEN}All scans passed!${NC}"
    fi

    echo ""

    return $SCAN_FAILED
}

###############################################################################
# Scan base images
###############################################################################
scan_base_images() {
    echo -e "${YELLOW}[4/4] Scanning base images...${NC}"

    BASE_IMAGES=(
        "node:20-alpine"
        "postgres:15-alpine"
        "redis:7-alpine"
        "nginx:alpine"
    )

    echo -e "${BLUE}Checking base images for vulnerabilities...${NC}"
    echo ""

    for BASE_IMAGE in "${BASE_IMAGES[@]}"; do
        echo -e "${BLUE}Checking: $BASE_IMAGE${NC}"

        # Pull latest version
        docker pull "$BASE_IMAGE" > /dev/null 2>&1 || true

        # Quick scan
        if trivy image --severity CRITICAL,HIGH --quiet "$BASE_IMAGE"; then
            echo -e "${GREEN}✓ $BASE_IMAGE - No critical/high vulnerabilities${NC}"
        else
            echo -e "${RED}⚠ $BASE_IMAGE - Vulnerabilities found${NC}"
            echo -e "${YELLOW}  Consider updating to a newer version${NC}"
        fi
        echo ""
    done
}

###############################################################################
# Generate consolidated report
###############################################################################
generate_report() {
    CONSOLIDATED_REPORT="$REPORTS_DIR/container-security-report-$TIMESTAMP.md"

    cat > "$CONSOLIDATED_REPORT" << EOF
# Container Security Scan Report

**Date:** $(date)
**Scan ID:** $TIMESTAMP

---

## Executive Summary

This report provides a comprehensive security analysis of container images
in the UnifiedHealth Platform.

## Scanned Images

EOF

    for IMAGE in "${IMAGES[@]}"; do
        if docker image inspect "$IMAGE" > /dev/null 2>&1; then
            echo "- \`$IMAGE\`" >> "$CONSOLIDATED_REPORT"
        fi
    done

    cat >> "$CONSOLIDATED_REPORT" << EOF

## Scan Results

Detailed reports are available in: \`$REPORTS_DIR\`

### Report Files

- **Vulnerability Reports:** \`*.txt\`
- **JSON Reports:** \`*.json\`
- **SARIF Reports:** \`*.sarif\` (for GitHub Security)
- **Secret Scans:** \`*.secrets.txt\`
- **Configuration Scans:** \`*.config.txt\`
- **SBOM:** \`*.sbom.json\`

## Recommendations

1. **Critical Vulnerabilities:** Rebuild images with updated base images
2. **High Vulnerabilities:** Schedule image updates within 7 days
3. **Secrets Found:** Remove hardcoded secrets, use environment variables
4. **Misconfigurations:** Follow Docker security best practices

## Base Image Policy

Approved base images:
- \`node:20-alpine\` (or latest LTS)
- \`postgres:15-alpine\`
- \`redis:7-alpine\`
- \`nginx:alpine\`

**Update Policy:** Check for base image updates weekly

---

**Generated by:** Trivy Container Security Scanner
**Version:** $(trivy --version | head -n 1)
EOF

    echo -e "${GREEN}✓ Consolidated report: $CONSOLIDATED_REPORT${NC}"
}

###############################################################################
# Main execution
###############################################################################
main() {
    check_trivy
    update_database

    if scan_images; then
        scan_base_images
        generate_report

        echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${BLUE}║  Container Security Scan Completed                             ║${NC}"
        echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${GREEN}📊 Reports directory: $REPORTS_DIR${NC}"
        exit 0
    else
        scan_base_images
        generate_report

        echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║  Security Gate Failed: Vulnerabilities Found                   ║${NC}"
        echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}Review the reports in: $REPORTS_DIR${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
