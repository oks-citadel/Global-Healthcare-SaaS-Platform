#!/bin/bash
# ============================================
# UnifiedHealth Platform - Staging Verification Script
# ============================================
# Runs E2E tests against staging and produces go/no-go report
#
# Usage: ./scripts/verify-staging-deployment.sh [options]
# Options:
#   --skip-e2e       Skip browser E2E tests
#   --full-suite     Run full test suite including load tests
#   --staging-url    Override staging URL
# ============================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="${PROJECT_ROOT}/security-reports"
REPORT_FILE="${REPORT_DIR}/staging-verification-${TIMESTAMP}"

STAGING_URL="${STAGING_URL:-https://staging.theunifiedhealth.com}"
API_URL="${STAGING_API_URL:-https://api-staging.theunifiedhealth.com}"
SKIP_E2E=false
FULL_SUITE=false

PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[PASS]${NC} $1"; ((PASSED_CHECKS++)); }
log_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; ((WARNINGS++)); }
log_error() { echo -e "${RED}[FAIL]${NC} $1"; ((FAILED_CHECKS++)); }
log_section() { echo ""; echo -e "${CYAN}========================================${NC}"; echo -e "${CYAN}  $1${NC}"; echo -e "${CYAN}========================================${NC}"; }

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-e2e) SKIP_E2E=true; shift ;;
            --full-suite) FULL_SUITE=true; shift ;;
            --staging-url) STAGING_URL="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
}

check_health_endpoint() {
    local name="$1"
    local url="$2"
    local timeout="${3:-10}"

    if curl -sf --max-time "$timeout" "$url" > /dev/null 2>&1; then
        log_success "$name health check passed"
        return 0
    else
        log_error "$name health check failed ($url)"
        return 1
    fi
}

verify_health_checks() {
    log_section "Health Check Verification"

    check_health_endpoint "Web Application" "${STAGING_URL}" || true
    check_health_endpoint "API Gateway" "${API_URL}/health" || true
    check_health_endpoint "API Ready" "${API_URL}/ready" || true
}

verify_api_endpoints() {
    log_section "API Endpoint Verification"

    # Test public endpoints
    endpoints=(
        "/api/v1/health"
        "/api/v1/version"
    )

    for endpoint in "${endpoints[@]}"; do
        status=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}${endpoint}" || echo "000")
        if [[ "$status" == "200" || "$status" == "401" ]]; then
            log_success "Endpoint ${endpoint} responding (HTTP ${status})"
        else
            log_error "Endpoint ${endpoint} failed (HTTP ${status})"
        fi
    done
}

verify_database_connectivity() {
    log_section "Database Connectivity"

    # Check via API health endpoint that includes DB status
    db_health=$(curl -s "${API_URL}/health" 2>/dev/null | grep -i "database" || echo "")

    if [[ -n "$db_health" ]]; then
        log_success "Database connectivity verified"
    else
        log_warning "Could not verify database connectivity via API"
    fi
}

run_security_scan() {
    log_section "Security Scan"

    log_info "Running security audit..."
    cd "$PROJECT_ROOT"

    if pnpm audit --audit-level=high 2>&1 | grep -q "found 0 vulnerabilities"; then
        log_success "No high/critical vulnerabilities found"
    else
        log_warning "Security audit found vulnerabilities (review required)"
    fi
}

run_e2e_tests() {
    log_section "E2E Test Suite"

    if [ "$SKIP_E2E" = true ]; then
        log_warning "E2E tests skipped by request"
        return 0
    fi

    log_info "Running Playwright E2E tests..."
    cd "$PROJECT_ROOT"

    export PLAYWRIGHT_BASE_URL="$STAGING_URL"
    export API_BASE_URL="$API_URL"
    export CI=true

    if pnpm test:e2e 2>&1 | tee "${REPORT_FILE}-e2e.log"; then
        log_success "E2E tests passed"
    else
        log_error "E2E tests failed"
    fi
}

verify_ssl_certificates() {
    log_section "SSL Certificate Verification"

    domain=$(echo "$STAGING_URL" | sed 's|https://||' | cut -d'/' -f1)

    expiry=$(echo | openssl s_client -servername "$domain" -connect "${domain}:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d'=' -f2)

    if [ -n "$expiry" ]; then
        expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$expiry" +%s 2>/dev/null || echo "0")
        now_epoch=$(date +%s)
        days_left=$(( (expiry_epoch - now_epoch) / 86400 ))

        if [ "$days_left" -gt 30 ]; then
            log_success "SSL certificate valid (${days_left} days remaining)"
        elif [ "$days_left" -gt 7 ]; then
            log_warning "SSL certificate expiring soon (${days_left} days)"
        else
            log_error "SSL certificate critical (${days_left} days)"
        fi
    else
        log_warning "Could not verify SSL certificate"
    fi
}

generate_report() {
    mkdir -p "$REPORT_DIR"

    local go_nogo="GO"
    [ "$FAILED_CHECKS" -gt 0 ] && go_nogo="NO-GO"

    cat > "${REPORT_FILE}.md" << EOF
# Staging Deployment Verification Report

**Date:** $(date)
**Staging URL:** ${STAGING_URL}
**API URL:** ${API_URL}

---

## Summary

| Metric | Count |
|--------|-------|
| Passed | ${PASSED_CHECKS} |
| Failed | ${FAILED_CHECKS} |
| Warnings | ${WARNINGS} |

---

## Decision

# ${go_nogo}

EOF

    if [ "$go_nogo" = "GO" ]; then
        echo "**Recommendation:** Staging environment is ready for production deployment." >> "${REPORT_FILE}.md"
    else
        echo "**Recommendation:** Address failed checks before proceeding to production." >> "${REPORT_FILE}.md"
    fi

    # JSON report
    cat > "${REPORT_FILE}.json" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "staging_url": "${STAGING_URL}",
  "api_url": "${API_URL}",
  "passed": ${PASSED_CHECKS},
  "failed": ${FAILED_CHECKS},
  "warnings": ${WARNINGS},
  "decision": "${go_nogo}"
}
EOF

    log_info "Reports saved:"
    log_info "  - ${REPORT_FILE}.md"
    log_info "  - ${REPORT_FILE}.json"
}

print_summary() {
    echo ""
    echo -e "${CYAN}============================================${NC}"
    echo -e "${CYAN}  Verification Summary${NC}"
    echo -e "${CYAN}============================================${NC}"
    echo -e "Passed:   ${GREEN}${PASSED_CHECKS}${NC}"
    echo -e "Failed:   ${RED}${FAILED_CHECKS}${NC}"
    echo -e "Warnings: ${YELLOW}${WARNINGS}${NC}"
    echo ""

    if [ "$FAILED_CHECKS" -eq 0 ]; then
        echo -e "${GREEN}============================================${NC}"
        echo -e "${GREEN}  DECISION: GO${NC}"
        echo -e "${GREEN}  Ready for production deployment${NC}"
        echo -e "${GREEN}============================================${NC}"
        return 0
    else
        echo -e "${RED}============================================${NC}"
        echo -e "${RED}  DECISION: NO-GO${NC}"
        echo -e "${RED}  ${FAILED_CHECKS} issue(s) must be resolved${NC}"
        echo -e "${RED}============================================${NC}"
        return 1
    fi
}

main() {
    echo -e "${BLUE}"
    echo "============================================"
    echo "  UnifiedHealth Staging Verification"
    echo "============================================"
    echo -e "${NC}"

    parse_args "$@"

    log_info "Staging URL: ${STAGING_URL}"
    log_info "API URL: ${API_URL}"

    verify_health_checks
    verify_api_endpoints
    verify_database_connectivity
    verify_ssl_certificates
    run_security_scan
    run_e2e_tests

    generate_report

    print_summary && exit 0 || exit 1
}

main "$@"
