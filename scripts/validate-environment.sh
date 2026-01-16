#!/bin/bash
# ============================================
# UnifiedHealth Platform - Environment Validation Script
# ============================================
# Validates all required environment variables are set for production deployment
#
# Usage: ./scripts/validate-environment.sh [environment]
# Environments: development, staging, production (default: production)
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
ENVIRONMENT="${1:-production}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="${PROJECT_ROOT}/security-reports"
REPORT_FILE="${REPORT_DIR}/env-validation-${ENVIRONMENT}-${TIMESTAMP}.md"

CRITICAL_MISSING=0
WARNING_MISSING=0
PASSED=0

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[PASS]${NC} $1"; ((PASSED++)); }
log_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; ((WARNING_MISSING++)); }
log_error() { echo -e "${RED}[FAIL]${NC} $1"; ((CRITICAL_MISSING++)); }
log_section() { echo ""; echo -e "${CYAN}========================================${NC}"; echo -e "${CYAN}  $1${NC}"; echo -e "${CYAN}========================================${NC}"; }

print_header() {
    echo -e "${BLUE}"
    echo "============================================"
    echo "  UnifiedHealth Platform"
    echo "  Environment Validation Script"
    echo "============================================"
    echo -e "${NC}"
    echo "Environment: ${ENVIRONMENT}"
    echo "Timestamp:   $(date)"
    echo ""
}

check_required() {
    local var_name="$1"
    local description="$2"
    local value="${!var_name:-}"
    if [ -n "$value" ]; then
        log_success "$var_name is set ($description)"
        return 0
    else
        log_error "$var_name is NOT SET ($description)"
        return 1
    fi
}

check_optional() {
    local var_name="$1"
    local description="$2"
    local value="${!var_name:-}"
    if [ -n "$value" ]; then
        log_success "$var_name is set ($description)"
        return 0
    else
        log_warning "$var_name is not set ($description)"
        return 1
    fi
}

check_secure() {
    local var_name="$1"
    local description="$2"
    local value="${!var_name:-}"
    local placeholders=("your-" "change-in-production" "changeme" "example" "placeholder" "xxx" "todo" "replace")
    if [ -z "$value" ]; then
        log_error "$var_name is NOT SET ($description)"
        return 1
    fi
    for placeholder in "${placeholders[@]}"; do
        if [[ "${value,,}" == *"${placeholder}"* ]]; then
            log_error "$var_name contains placeholder value ($description)"
            return 1
        fi
    done
    if [[ ${#value} -lt 16 && ("$var_name" == *"SECRET"* || "$var_name" == *"KEY"*) ]]; then
        log_error "$var_name is too short (minimum 16 characters)"
        return 1
    fi
    log_success "$var_name appears secure ($description)"
    return 0
}

check_url() {
    local var_name="$1"
    local description="$2"
    local value="${!var_name:-}"
    if [ -z "$value" ]; then
        log_error "$var_name is NOT SET ($description)"
        return 1
    elif [[ "$value" =~ ^https?:// ]]; then
        log_success "$var_name is valid URL ($description)"
        return 0
    else
        log_error "$var_name is not a valid URL ($description)"
        return 1
    fi
}

validate_core_settings() {
    log_section "Core Application Settings"
    check_required "NODE_ENV" "Runtime environment" || true
    if [ "$ENVIRONMENT" = "production" ] && [ "${NODE_ENV:-}" != "production" ]; then
        log_error "NODE_ENV must be 'production' for production deployment"
        ((CRITICAL_MISSING++))
    fi
    check_required "PORT" "Application port" || true
}

validate_database() {
    log_section "Database Configuration"
    check_required "DATABASE_URL" "Primary database connection" || true
    check_secure "DATABASE_URL" "Database credentials security" || true
    if [ "$ENVIRONMENT" = "production" ]; then
        check_optional "DIRECT_DATABASE_URL" "Direct database connection" || true
        check_optional "DB_CONNECTION_LIMIT" "Connection pool limit" || true
    fi
}

validate_redis() {
    log_section "Redis/Cache Configuration"
    check_required "REDIS_HOST" "Redis host" || true
    check_required "REDIS_PORT" "Redis port" || true
    [ "$ENVIRONMENT" = "production" ] && check_optional "REDIS_PASSWORD" "Redis password" || true
}

validate_jwt_security() {
    log_section "JWT & Authentication Security"
    check_required "JWT_SECRET" "JWT signing secret" || true
    check_secure "JWT_SECRET" "JWT secret security" || true
}

validate_encryption() {
    log_section "Encryption Configuration"
    check_required "ENCRYPTION_KEY" "Data encryption key" || true
    check_secure "ENCRYPTION_KEY" "Encryption key security" || true
}

validate_aws() {
    log_section "AWS Configuration"
    check_required "AWS_REGION" "AWS region" || true
    if [ "$ENVIRONMENT" = "production" ] && [ -n "${AWS_ACCESS_KEY_ID:-}" ]; then
        log_warning "Using AWS access keys - prefer IAM roles in production"
    fi
    check_optional "AWS_S3_BUCKET" "S3 bucket for documents" || true
}

validate_stripe() {
    log_section "Stripe Payment Configuration"
    if [ "$ENVIRONMENT" = "production" ]; then
        if [[ "${STRIPE_SECRET_KEY:-}" == sk_test_* ]]; then
            log_error "STRIPE_SECRET_KEY is using test key in production!"
            ((CRITICAL_MISSING++))
        else
            check_required "STRIPE_SECRET_KEY" "Stripe secret key" || true
        fi
    fi
}

validate_security() {
    log_section "Security Configuration"
    check_required "CORS_ORIGINS" "CORS allowed origins" || true
}

validate_urls() {
    log_section "Application URLs"
    check_url "APP_URL" "Application URL" || true
}

generate_report() {
    mkdir -p "$REPORT_DIR"
    cat > "$REPORT_FILE" << EOF
# Environment Validation Report
**Environment:** ${ENVIRONMENT}
**Date:** $(date)

## Summary
| Status | Count |
|--------|-------|
| Passed | ${PASSED} |
| Critical Missing | ${CRITICAL_MISSING} |
| Warnings | ${WARNING_MISSING} |
EOF
    [ "$CRITICAL_MISSING" -eq 0 ] && echo "**RESULT: PASSED**" >> "$REPORT_FILE" || echo "**RESULT: FAILED**" >> "$REPORT_FILE"
    log_info "Report saved to: $REPORT_FILE"
}

print_summary() {
    echo ""
    echo -e "${CYAN}  Validation Summary${NC}"
    echo -e "Passed: ${GREEN}${PASSED}${NC} | Critical: ${RED}${CRITICAL_MISSING}${NC} | Warnings: ${YELLOW}${WARNING_MISSING}${NC}"
    [ "$CRITICAL_MISSING" -eq 0 ] && echo -e "${GREEN}VALIDATION PASSED${NC}" && return 0 || echo -e "${RED}VALIDATION FAILED${NC}" && return 1
}

main() {
    print_header
    validate_core_settings
    validate_database
    validate_redis
    validate_jwt_security
    validate_encryption
    validate_aws
    validate_stripe
    validate_security
    validate_urls
    generate_report
    print_summary && exit 0 || exit 1
}

main "$@"
