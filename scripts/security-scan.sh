#!/bin/bash

###############################################################################
# UnifiedHealth Platform - Security Vulnerability Scanner
# Performs comprehensive security scanning including:
# - npm/pnpm audit for dependency vulnerabilities
# - Snyk scanning (if available)
# - License compliance checks
# - Generates vulnerability reports
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
REPORTS_DIR="$PROJECT_ROOT/security-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Severity levels
AUDIT_LEVEL="${AUDIT_LEVEL:-moderate}"
FAIL_ON_CRITICAL="${FAIL_ON_CRITICAL:-true}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  UnifiedHealth Platform - Security Vulnerability Scanner      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

###############################################################################
# Create reports directory
###############################################################################
create_reports_dir() {
    echo -e "${YELLOW}[1/6] Creating reports directory...${NC}"
    mkdir -p "$REPORTS_DIR"
    echo -e "${GREEN}✓ Reports directory: $REPORTS_DIR${NC}"
    echo ""
}

###############################################################################
# Run pnpm audit
###############################################################################
run_pnpm_audit() {
    echo -e "${YELLOW}[2/6] Running pnpm audit...${NC}"
    cd "$PROJECT_ROOT"

    # Run audit and capture output
    AUDIT_REPORT="$REPORTS_DIR/pnpm-audit-$TIMESTAMP.json"
    AUDIT_SUMMARY="$REPORTS_DIR/pnpm-audit-summary-$TIMESTAMP.txt"

    if pnpm audit --json > "$AUDIT_REPORT" 2>&1; then
        echo -e "${GREEN}✓ No vulnerabilities found!${NC}"
        AUDIT_RESULT=0
    else
        AUDIT_RESULT=$?
        echo -e "${RED}⚠ Vulnerabilities detected!${NC}"
    fi

    # Generate human-readable summary
    pnpm audit > "$AUDIT_SUMMARY" 2>&1 || true

    echo -e "${GREEN}✓ Audit reports saved:${NC}"
    echo -e "  - JSON: $AUDIT_REPORT"
    echo -e "  - Summary: $AUDIT_SUMMARY"
    echo ""

    # Display summary
    if [ -f "$AUDIT_SUMMARY" ]; then
        echo -e "${BLUE}Audit Summary:${NC}"
        tail -20 "$AUDIT_SUMMARY"
        echo ""
    fi

    return $AUDIT_RESULT
}

###############################################################################
# Run Snyk scan (if available)
###############################################################################
run_snyk_scan() {
    echo -e "${YELLOW}[3/6] Checking for Snyk...${NC}"

    if command -v snyk &> /dev/null; then
        echo -e "${GREEN}✓ Snyk found, running scan...${NC}"

        SNYK_REPORT="$REPORTS_DIR/snyk-report-$TIMESTAMP.json"

        # Check if Snyk is authenticated
        if snyk auth > /dev/null 2>&1 || [ -n "$SNYK_TOKEN" ]; then
            # Run Snyk test
            if snyk test --json > "$SNYK_REPORT" 2>&1; then
                echo -e "${GREEN}✓ Snyk scan completed - No issues found${NC}"
                SNYK_RESULT=0
            else
                SNYK_RESULT=$?
                echo -e "${RED}⚠ Snyk found vulnerabilities${NC}"
            fi

            # Run Snyk monitor (send results to Snyk dashboard)
            if [ "$CI" = "true" ] && [ -n "$SNYK_TOKEN" ]; then
                snyk monitor > /dev/null 2>&1 || true
                echo -e "${GREEN}✓ Results sent to Snyk dashboard${NC}"
            fi

            echo -e "${GREEN}✓ Snyk report saved: $SNYK_REPORT${NC}"

            return $SNYK_RESULT
        else
            echo -e "${YELLOW}⚠ Snyk not authenticated. Run 'snyk auth' or set SNYK_TOKEN${NC}"
            echo -e "${YELLOW}  Skipping Snyk scan...${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Snyk not installed${NC}"
        echo -e "${YELLOW}  Install with: npm install -g snyk${NC}"
        echo -e "${YELLOW}  Or use: npx snyk${NC}"
    fi

    echo ""
    return 0
}

###############################################################################
# Check for known malicious packages
###############################################################################
check_malicious_packages() {
    echo -e "${YELLOW}[4/6] Checking for known malicious packages...${NC}"

    # This would typically use a service like Socket.dev or npm audit signatures
    # For now, we'll do basic checks

    MALICIOUS_REPORT="$REPORTS_DIR/malicious-check-$TIMESTAMP.txt"

    echo "Malicious Package Check - $TIMESTAMP" > "$MALICIOUS_REPORT"
    echo "=======================================" >> "$MALICIOUS_REPORT"
    echo "" >> "$MALICIOUS_REPORT"

    # Check for common suspicious patterns in package.json files
    find "$PROJECT_ROOT" -name "package.json" -type f | while read -r pkg_file; do
        # Check for suspicious scripts
        if grep -q "preinstall\|postinstall" "$pkg_file"; then
            echo "⚠ File with install scripts: $pkg_file" >> "$MALICIOUS_REPORT"
        fi
    done

    echo -e "${GREEN}✓ Malicious package check completed${NC}"
    echo -e "  Report: $MALICIOUS_REPORT"
    echo ""
}

###############################################################################
# License compliance check
###############################################################################
check_licenses() {
    echo -e "${YELLOW}[5/6] Checking license compliance...${NC}"

    LICENSE_REPORT="$REPORTS_DIR/license-check-$TIMESTAMP.txt"

    # Use license-checker if available, otherwise use pnpm licenses
    if command -v license-checker &> /dev/null; then
        license-checker --json > "$LICENSE_REPORT.json" 2>&1 || true
        license-checker --summary > "$LICENSE_REPORT" 2>&1 || true
    else
        pnpm licenses list > "$LICENSE_REPORT" 2>&1 || true
    fi

    echo -e "${GREEN}✓ License report saved: $LICENSE_REPORT${NC}"
    echo ""
}

###############################################################################
# Generate consolidated report
###############################################################################
generate_consolidated_report() {
    echo -e "${YELLOW}[6/6] Generating consolidated security report...${NC}"

    CONSOLIDATED_REPORT="$REPORTS_DIR/security-report-$TIMESTAMP.md"

    cat > "$CONSOLIDATED_REPORT" << EOF
# UnifiedHealth Platform - Security Scan Report

**Date:** $(date)
**Scan ID:** $TIMESTAMP

---

## Executive Summary

This report provides a comprehensive security analysis of the UnifiedHealth Platform,
including dependency vulnerabilities, license compliance, and malicious package detection.

## Scan Results

### 1. Dependency Vulnerabilities (pnpm audit)

EOF

    if [ -f "$AUDIT_SUMMARY" ]; then
        echo '```' >> "$CONSOLIDATED_REPORT"
        tail -50 "$AUDIT_SUMMARY" >> "$CONSOLIDATED_REPORT"
        echo '```' >> "$CONSOLIDATED_REPORT"
    fi

    cat >> "$CONSOLIDATED_REPORT" << EOF

**Detailed Report:** \`$(basename "$AUDIT_REPORT")\`

### 2. Snyk Security Scan

EOF

    if [ -f "$SNYK_REPORT" ]; then
        echo "Snyk scan completed. See detailed report: \`$(basename "$SNYK_REPORT")\`" >> "$CONSOLIDATED_REPORT"
    else
        echo "Snyk scan not available or not configured." >> "$CONSOLIDATED_REPORT"
    fi

    cat >> "$CONSOLIDATED_REPORT" << EOF

### 3. Malicious Package Check

EOF

    if [ -f "$MALICIOUS_REPORT" ]; then
        cat "$MALICIOUS_REPORT" >> "$CONSOLIDATED_REPORT"
    fi

    cat >> "$CONSOLIDATED_REPORT" << EOF

### 4. License Compliance

See detailed report: \`$(basename "$LICENSE_REPORT")\`

---

## Recommendations

1. **Critical Vulnerabilities:** Review and patch immediately
2. **High Vulnerabilities:** Schedule fixes within 7 days
3. **Medium Vulnerabilities:** Address in next sprint
4. **License Issues:** Consult legal team for incompatible licenses

## Reports Location

All detailed reports are available in: \`$REPORTS_DIR\`

---

**Generated by:** UnifiedHealth Security Scanner
**Version:** 1.0.0
EOF

    echo -e "${GREEN}✓ Consolidated report saved: $CONSOLIDATED_REPORT${NC}"
    echo ""
}

###############################################################################
# Check for critical vulnerabilities and fail if found
###############################################################################
check_critical_vulnerabilities() {
    if [ "$FAIL_ON_CRITICAL" = "true" ]; then
        # Check audit results for critical/high vulnerabilities
        if [ -f "$AUDIT_REPORT" ]; then
            CRITICAL_COUNT=$(grep -o '"severity":"critical"' "$AUDIT_REPORT" | wc -l || echo "0")
            HIGH_COUNT=$(grep -o '"severity":"high"' "$AUDIT_REPORT" | wc -l || echo "0")

            if [ "$CRITICAL_COUNT" -gt 0 ] || [ "$HIGH_COUNT" -gt 0 ]; then
                echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
                echo -e "${RED}║  SECURITY GATE FAILED: Critical/High vulnerabilities found    ║${NC}"
                echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
                echo -e "${RED}Critical: $CRITICAL_COUNT | High: $HIGH_COUNT${NC}"
                echo ""
                echo -e "${YELLOW}Review the security report: $CONSOLIDATED_REPORT${NC}"
                return 1
            fi
        fi
    fi

    return 0
}

###############################################################################
# Main execution
###############################################################################
main() {
    create_reports_dir

    AUDIT_FAILED=0
    run_pnpm_audit || AUDIT_FAILED=1
    run_snyk_scan || true  # Don't fail on Snyk errors
    check_malicious_packages
    check_licenses
    generate_consolidated_report

    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  Security Scan Completed                                       ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}📊 Consolidated Report: $CONSOLIDATED_REPORT${NC}"
    echo -e "${GREEN}📁 All Reports: $REPORTS_DIR${NC}"
    echo ""

    # Check for critical vulnerabilities
    if ! check_critical_vulnerabilities; then
        exit 1
    fi

    # Return audit result
    exit $AUDIT_FAILED
}

# Run main function
main "$@"
