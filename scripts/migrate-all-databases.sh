#!/bin/bash
# ============================================
# UnifiedHealth Platform - Database Migration Script
# ============================================
# Runs Prisma migrations across all microservices
#
# Usage: ./scripts/migrate-all-databases.sh [options]
# Options:
#   --environment ENV  Target environment (default: staging)
#   --dry-run          Preview migrations without applying
#   --parallel         Run migrations in parallel
#   --service NAME     Migrate only specified service
# ============================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENT="staging"
DRY_RUN=false
PARALLEL=false
SINGLE_SERVICE=""
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_DIR="${PROJECT_ROOT}/security-reports"
LOG_FILE="${LOG_DIR}/migration-${TIMESTAMP}.log"

SERVICES=(
    "services/api"
    "services/auth-service"
    "services/telehealth-service"
    "services/mental-health-service"
    "services/pharmacy-service"
    "services/laboratory-service"
    "services/chronic-care-service"
    "services/clinical-trials-service"
    "services/home-health-service"
    "services/imaging-service"
    "services/population-health-service"
    "services/notification-service"
    "services/interoperability-service"
    "services/denial-management-service"
    "services/price-transparency-service"
    "services/vendor-risk-service"
)

log_info() { echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"; }

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --environment) ENVIRONMENT="$2"; shift 2 ;;
            --dry-run) DRY_RUN=true; shift ;;
            --parallel) PARALLEL=true; shift ;;
            --service) SINGLE_SERVICE="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    command -v pnpm >/dev/null 2>&1 || { log_error "pnpm is required"; exit 1; }
    command -v npx >/dev/null 2>&1 || { log_error "npx is required"; exit 1; }
    log_success "Prerequisites check passed"
}

migrate_service() {
    local service_path="$1"
    local service_name=$(basename "$service_path")
    local full_path="${PROJECT_ROOT}/${service_path}"

    if [ ! -d "${full_path}/prisma" ]; then
        log_warning "No Prisma schema found in ${service_name}, skipping"
        return 0
    fi

    log_info "Migrating ${service_name}..."

    cd "$full_path"

    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY-RUN] Would run: npx prisma migrate deploy"
        npx prisma migrate status 2>&1 | tee -a "$LOG_FILE" || true
    else
        if npx prisma migrate deploy 2>&1 | tee -a "$LOG_FILE"; then
            log_success "${service_name} migrated successfully"
        else
            log_error "${service_name} migration failed"
            return 1
        fi
    fi

    cd "$PROJECT_ROOT"
    return 0
}

run_migrations() {
    local failed=0

    if [ -n "$SINGLE_SERVICE" ]; then
        migrate_service "$SINGLE_SERVICE" || ((failed++))
    elif [ "$PARALLEL" = true ]; then
        log_info "Running migrations in parallel..."
        for service in "${SERVICES[@]}"; do
            migrate_service "$service" &
        done
        wait
    else
        for service in "${SERVICES[@]}"; do
            migrate_service "$service" || ((failed++))
        done
    fi

    return $failed
}

generate_report() {
    cat >> "$LOG_FILE" << EOF

============================================
Migration Summary
============================================
Environment: ${ENVIRONMENT}
Timestamp: $(date)
Dry Run: ${DRY_RUN}
EOF
}

main() {
    mkdir -p "$LOG_DIR"
    parse_args "$@"

    echo -e "${BLUE}"
    echo "============================================"
    echo "  UnifiedHealth Database Migration"
    echo "  Environment: ${ENVIRONMENT}"
    echo "============================================"
    echo -e "${NC}"

    check_prerequisites

    if run_migrations; then
        log_success "All migrations completed successfully"
        generate_report
        exit 0
    else
        log_error "Some migrations failed"
        generate_report
        exit 1
    fi
}

main "$@"
