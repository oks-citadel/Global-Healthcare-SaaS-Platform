#!/bin/bash
# ============================================
# UnifiedHealth Platform - Database Migration Script
# ============================================
# Runs Prisma migrations for all services with database schemas
#
# Usage:
#   ./run-migrations.sh [environment] [service]
#
# Examples:
#   ./run-migrations.sh                    # Run all migrations (development)
#   ./run-migrations.sh production         # Run all migrations (production)
#   ./run-migrations.sh development api    # Run only api service migrations
#   ./run-migrations.sh --status           # Check migration status for all services
#   ./run-migrations.sh --generate api     # Generate new migration for api service
#
# Prerequisites:
#   - Node.js and pnpm installed
#   - Database URLs configured in .env files or environment variables
#   - Prisma CLI available (pnpm prisma)
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Default values
ENVIRONMENT="${1:-development}"
TARGET_SERVICE="${2:-all}"

# ============================================
# Service Configuration
# ============================================
# Services with Prisma schemas that need migrations
# Format: "service_name:service_directory:database_name"
declare -a SERVICES=(
    "api:services/api:unified_health_dev"
    "auth-service:services/auth-service:auth_db"
    "telehealth-service:services/telehealth-service:telehealth_service_dev"
    "mental-health-service:services/mental-health-service:mental_health_db"
    "chronic-care-service:services/chronic-care-service:chronic_care_db"
    "pharmacy-service:services/pharmacy-service:pharmacy_service_dev"
    "laboratory-service:services/laboratory-service:laboratory_service_dev"
    "imaging-service:services/imaging-service:imaging_db"
    "notification-service:services/notification-service:notification_service_dev"
    "population-health-service:services/population-health-service:population_health_db"
    "vendor-risk-service:services/vendor-risk-service:vendor_risk_db"
    "denial-management-service:services/denial-management-service:denial_management"
    "clinical-trials-service:services/clinical-trials-service:clinical_trials_db"
    "price-transparency-service:services/price-transparency-service:price_transparency_db"
    "home-health-service:services/home-health-service:home_health_db"
    "interoperability-service:services/interoperability-service:interoperability_db"
)

# ============================================
# Helper Functions
# ============================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo ""
    echo "============================================"
    echo "$1"
    echo "============================================"
    echo ""
}

check_prisma_schema() {
    local service_dir="$1"
    local schema_path="$PROJECT_ROOT/$service_dir/prisma/schema.prisma"

    if [ -f "$schema_path" ]; then
        return 0
    else
        return 1
    fi
}

check_migrations_exist() {
    local service_dir="$1"
    local migrations_path="$PROJECT_ROOT/$service_dir/prisma/migrations"

    if [ -d "$migrations_path" ] && [ "$(ls -A "$migrations_path" 2>/dev/null)" ]; then
        return 0
    else
        return 1
    fi
}

# ============================================
# Migration Functions
# ============================================

run_migration() {
    local service_name="$1"
    local service_dir="$2"
    local db_name="$3"

    local full_path="$PROJECT_ROOT/$service_dir"

    if [ ! -d "$full_path" ]; then
        log_warning "Service directory not found: $service_dir"
        return 1
    fi

    if ! check_prisma_schema "$service_dir"; then
        log_warning "No Prisma schema found for $service_name"
        return 1
    fi

    log_info "Running migrations for $service_name..."

    cd "$full_path"

    # Load environment file if exists
    if [ -f ".env.$ENVIRONMENT" ]; then
        log_info "Loading .env.$ENVIRONMENT"
        set -a
        source ".env.$ENVIRONMENT"
        set +a
    elif [ -f ".env" ]; then
        log_info "Loading .env"
        set -a
        source ".env"
        set +a
    fi

    # Run Prisma migration
    if [ "$ENVIRONMENT" == "production" ]; then
        # In production, deploy existing migrations only
        if pnpm prisma migrate deploy 2>/dev/null || npx prisma migrate deploy 2>/dev/null; then
            log_success "Migrations deployed for $service_name"
        else
            log_error "Failed to deploy migrations for $service_name"
            return 1
        fi
    else
        # In development, run dev migrations
        if pnpm prisma migrate dev --name "auto_$(date +%Y%m%d_%H%M%S)" 2>/dev/null || \
           npx prisma migrate dev --name "auto_$(date +%Y%m%d_%H%M%S)" 2>/dev/null; then
            log_success "Migrations applied for $service_name"
        else
            log_warning "Migration may have failed or no changes for $service_name"
        fi
    fi

    # Generate Prisma Client
    log_info "Generating Prisma Client for $service_name..."
    if pnpm prisma generate 2>/dev/null || npx prisma generate 2>/dev/null; then
        log_success "Prisma Client generated for $service_name"
    else
        log_error "Failed to generate Prisma Client for $service_name"
        return 1
    fi

    cd "$PROJECT_ROOT"
    return 0
}

check_migration_status() {
    local service_name="$1"
    local service_dir="$2"

    local full_path="$PROJECT_ROOT/$service_dir"

    if [ ! -d "$full_path" ]; then
        echo -e "  ${YELLOW}$service_name${NC}: Directory not found"
        return
    fi

    if ! check_prisma_schema "$service_dir"; then
        echo -e "  ${YELLOW}$service_name${NC}: No Prisma schema"
        return
    fi

    if check_migrations_exist "$service_dir"; then
        local migration_count=$(ls -1 "$full_path/prisma/migrations" 2>/dev/null | grep -v "migration_lock.toml" | wc -l)
        echo -e "  ${GREEN}$service_name${NC}: $migration_count migration(s) found"
    else
        echo -e "  ${RED}$service_name${NC}: No migrations - needs initial migration"
    fi
}

generate_migration() {
    local service_name="$1"
    local service_dir="$2"
    local migration_name="${3:-new_migration}"

    local full_path="$PROJECT_ROOT/$service_dir"

    if [ ! -d "$full_path" ]; then
        log_error "Service directory not found: $service_dir"
        return 1
    fi

    if ! check_prisma_schema "$service_dir"; then
        log_error "No Prisma schema found for $service_name"
        return 1
    fi

    log_info "Generating migration for $service_name..."

    cd "$full_path"

    # Load environment file if exists
    if [ -f ".env.development" ]; then
        set -a
        source ".env.development"
        set +a
    elif [ -f ".env" ]; then
        set -a
        source ".env"
        set +a
    fi

    if pnpm prisma migrate dev --name "$migration_name" --create-only 2>/dev/null || \
       npx prisma migrate dev --name "$migration_name" --create-only 2>/dev/null; then
        log_success "Migration created for $service_name"
    else
        log_error "Failed to create migration for $service_name"
        cd "$PROJECT_ROOT"
        return 1
    fi

    cd "$PROJECT_ROOT"
    return 0
}

# ============================================
# Main Script Logic
# ============================================

print_header "UnifiedHealth Platform - Database Migrations"

# Handle special flags
case "$ENVIRONMENT" in
    --status)
        log_info "Checking migration status for all services..."
        echo ""
        for service_config in "${SERVICES[@]}"; do
            IFS=':' read -r name dir db <<< "$service_config"
            check_migration_status "$name" "$dir"
        done
        echo ""
        exit 0
        ;;
    --generate)
        if [ -z "$TARGET_SERVICE" ] || [ "$TARGET_SERVICE" == "all" ]; then
            log_error "Please specify a service name for migration generation"
            echo "Usage: $0 --generate <service_name> [migration_name]"
            exit 1
        fi

        migration_name="${3:-new_migration}"

        for service_config in "${SERVICES[@]}"; do
            IFS=':' read -r name dir db <<< "$service_config"
            if [ "$name" == "$TARGET_SERVICE" ]; then
                generate_migration "$name" "$dir" "$migration_name"
                exit $?
            fi
        done

        log_error "Service not found: $TARGET_SERVICE"
        exit 1
        ;;
    --help|-h)
        echo "Usage: $0 [environment] [service]"
        echo ""
        echo "Arguments:"
        echo "  environment    Environment to run migrations for (development, staging, production)"
        echo "  service        Specific service to migrate (or 'all' for all services)"
        echo ""
        echo "Special flags:"
        echo "  --status       Check migration status for all services"
        echo "  --generate     Generate a new migration for a specific service"
        echo "  --help, -h     Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                           # Run all development migrations"
        echo "  $0 production                # Run all production migrations"
        echo "  $0 development api           # Run only api service migrations"
        echo "  $0 --status                  # Check migration status"
        echo "  $0 --generate api add_users  # Generate 'add_users' migration for api"
        exit 0
        ;;
esac

log_info "Environment: $ENVIRONMENT"
log_info "Target: ${TARGET_SERVICE:-all}"
echo ""

# Track results
declare -a SUCCESS_SERVICES=()
declare -a FAILED_SERVICES=()
declare -a SKIPPED_SERVICES=()

# Run migrations
for service_config in "${SERVICES[@]}"; do
    IFS=':' read -r name dir db <<< "$service_config"

    # Skip if targeting specific service
    if [ "$TARGET_SERVICE" != "all" ] && [ "$name" != "$TARGET_SERVICE" ]; then
        continue
    fi

    echo "-------------------------------------------"

    if run_migration "$name" "$dir" "$db"; then
        SUCCESS_SERVICES+=("$name")
    else
        if check_prisma_schema "$dir"; then
            FAILED_SERVICES+=("$name")
        else
            SKIPPED_SERVICES+=("$name")
        fi
    fi
done

# Print summary
print_header "Migration Summary"

if [ ${#SUCCESS_SERVICES[@]} -gt 0 ]; then
    log_success "Successful migrations:"
    for svc in "${SUCCESS_SERVICES[@]}"; do
        echo "  - $svc"
    done
fi

if [ ${#SKIPPED_SERVICES[@]} -gt 0 ]; then
    log_warning "Skipped (no Prisma schema):"
    for svc in "${SKIPPED_SERVICES[@]}"; do
        echo "  - $svc"
    done
fi

if [ ${#FAILED_SERVICES[@]} -gt 0 ]; then
    log_error "Failed migrations:"
    for svc in "${FAILED_SERVICES[@]}"; do
        echo "  - $svc"
    done
    exit 1
fi

log_success "All migrations completed successfully!"
exit 0
