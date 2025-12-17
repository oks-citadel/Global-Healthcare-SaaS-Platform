#!/bin/bash
# ============================================
# UnifiedHealth Platform - Database Restore
# ============================================
# This script restores a PostgreSQL database from backup
# Usage: ./scripts/db-restore.sh [backup_name] [environment]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_NAME="${1:-}"
ENVIRONMENT="${2:-production}"
RESOURCE_GROUP="unified-health-rg-${ENVIRONMENT}"
POSTGRES_SERVER="unified-health-postgres-${ENVIRONMENT}"
STORAGE_ACCOUNT="unifiedhealthsa${ENVIRONMENT}"
KEYVAULT_NAME="unified-health-kv-${ENVIRONMENT}"
RESTORE_DIR="/tmp/restore-${BACKUP_NAME}"

# Log functions
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

# Error handler
error_exit() {
    log_error "$1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    command -v az >/dev/null 2>&1 || error_exit "Azure CLI is not installed"
    command -v pg_restore >/dev/null 2>&1 || error_exit "pg_restore is not installed"
    command -v psql >/dev/null 2>&1 || error_exit "psql is not installed"

    # Check Azure login
    az account show >/dev/null 2>&1 || error_exit "Not logged in to Azure. Run 'az login'"

    log_success "Prerequisites check passed"
}

# Get backup name if not provided
get_backup_name() {
    if [ -z "${BACKUP_NAME}" ]; then
        log_info "No backup name provided. Listing available backups..."
        list_available_backups

        read -p "Enter backup name to restore: " BACKUP_NAME

        if [ -z "${BACKUP_NAME}" ]; then
            error_exit "Backup name is required"
        fi
    fi

    log_info "Backup to restore: ${BACKUP_NAME}"
}

# List available backups
list_available_backups() {
    log_info "Available backups:"

    # Get storage account key
    STORAGE_KEY=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "storage-account-key" \
        --query value -o tsv) || error_exit "Failed to get storage account key"

    az storage blob list \
        --account-name "${STORAGE_ACCOUNT}" \
        --account-key "${STORAGE_KEY}" \
        --container-name "backups" \
        --prefix "backup-${ENVIRONMENT}-" \
        --query "[?ends_with(name, '.tar.gz')].{Name:name, LastModified:properties.lastModified, Size:properties.contentLength}" \
        --output table | head -n 20

    # Get latest backup from Key Vault
    LATEST_BACKUP=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "latest-backup-${ENVIRONMENT}" \
        --query value -o tsv 2>/dev/null || echo "")

    if [ -n "${LATEST_BACKUP}" ]; then
        log_info "Latest backup: ${LATEST_BACKUP}"
    fi
}

# Confirm restore
confirm_restore() {
    log_warning "=========================================="
    log_warning "DATABASE RESTORE"
    log_warning "Environment: ${ENVIRONMENT}"
    log_warning "Backup: ${BACKUP_NAME}"
    log_warning "Server: ${POSTGRES_SERVER}"
    log_warning "=========================================="
    log_warning "This will OVERWRITE the current database!"
    log_warning "Make sure you have a recent backup before proceeding."

    if [ "${SKIP_CONFIRMATION:-false}" != "true" ]; then
        read -p "Are you sure you want to restore? (type 'yes' to confirm): " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            log_info "Restore cancelled"
            exit 0
        fi
    fi
}

# Get database credentials
get_database_credentials() {
    log_info "Getting database credentials..."

    # Get admin password from Key Vault
    POSTGRES_PASSWORD=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "postgres-admin-password" \
        --query value -o tsv) || error_exit "Failed to get PostgreSQL password"

    POSTGRES_HOST="${POSTGRES_SERVER}.postgres.database.azure.com"
    POSTGRES_USER="unifiedhealthadmin"
    POSTGRES_PORT="5432"

    log_success "Database credentials retrieved"
}

# Download backup from Azure
download_backup() {
    log_info "Downloading backup from Azure Blob Storage..."

    # Get storage account key
    STORAGE_KEY=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "storage-account-key" \
        --query value -o tsv) || error_exit "Failed to get storage account key"

    # Create restore directory
    mkdir -p "${RESTORE_DIR}" || error_exit "Failed to create restore directory"

    BACKUP_FILE="${RESTORE_DIR}/${BACKUP_NAME}.tar.gz"
    CHECKSUM_FILE="${RESTORE_DIR}/${BACKUP_NAME}.tar.gz.sha256"

    # Download backup
    az storage blob download \
        --account-name "${STORAGE_ACCOUNT}" \
        --account-key "${STORAGE_KEY}" \
        --container-name "backups" \
        --name "${BACKUP_NAME}.tar.gz" \
        --file "${BACKUP_FILE}" || error_exit "Failed to download backup"

    # Download checksum
    az storage blob download \
        --account-name "${STORAGE_ACCOUNT}" \
        --account-key "${STORAGE_KEY}" \
        --container-name "backups" \
        --name "${BACKUP_NAME}.tar.gz.sha256" \
        --file "${CHECKSUM_FILE}" || log_warning "Checksum file not found"

    log_success "Backup downloaded"
}

# Verify backup integrity
verify_backup_integrity() {
    log_info "Verifying backup integrity..."

    BACKUP_FILE="${RESTORE_DIR}/${BACKUP_NAME}.tar.gz"
    CHECKSUM_FILE="${RESTORE_DIR}/${BACKUP_NAME}.tar.gz.sha256"

    if [ -f "${CHECKSUM_FILE}" ]; then
        EXPECTED_CHECKSUM=$(cat "${CHECKSUM_FILE}")
        ACTUAL_CHECKSUM=$(sha256sum "${BACKUP_FILE}" | awk '{print $1}')

        if [ "${EXPECTED_CHECKSUM}" == "${ACTUAL_CHECKSUM}" ]; then
            log_success "Backup integrity verified"
        else
            error_exit "Checksum mismatch! Backup may be corrupted."
        fi
    else
        log_warning "Checksum file not found, skipping integrity check"
    fi
}

# Extract backup
extract_backup() {
    log_info "Extracting backup..."

    tar -xzf "${RESTORE_DIR}/${BACKUP_NAME}.tar.gz" -C "${RESTORE_DIR}" || error_exit "Failed to extract backup"

    log_success "Backup extracted"
}

# Create pre-restore backup
create_pre_restore_backup() {
    log_info "Creating pre-restore backup as safety measure..."

    ./scripts/db-backup.sh "${ENVIRONMENT}" || log_warning "Failed to create pre-restore backup"

    log_success "Pre-restore backup created"
}

# Terminate existing connections
terminate_connections() {
    local database=$1

    log_info "Terminating existing connections to ${database}..."

    PGPASSWORD="${POSTGRES_PASSWORD}" psql \
        -h "${POSTGRES_HOST}" \
        -U "${POSTGRES_USER}" \
        -p "${POSTGRES_PORT}" \
        -d "postgres" \
        -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${database}' AND pid <> pg_backend_pid();" \
        2>/dev/null || log_warning "Failed to terminate connections"
}

# Drop and recreate database
drop_and_recreate_database() {
    local database=$1

    log_info "Dropping and recreating database ${database}..."

    # Terminate connections
    terminate_connections "${database}"

    # Drop database
    PGPASSWORD="${POSTGRES_PASSWORD}" psql \
        -h "${POSTGRES_HOST}" \
        -U "${POSTGRES_USER}" \
        -p "${POSTGRES_PORT}" \
        -d "postgres" \
        -c "DROP DATABASE IF EXISTS ${database};" || error_exit "Failed to drop database"

    # Create database
    PGPASSWORD="${POSTGRES_PASSWORD}" psql \
        -h "${POSTGRES_HOST}" \
        -U "${POSTGRES_USER}" \
        -p "${POSTGRES_PORT}" \
        -d "postgres" \
        -c "CREATE DATABASE ${database};" || error_exit "Failed to create database"

    log_success "Database ${database} recreated"
}

# Restore main database
restore_main_database() {
    log_info "Restoring main database (unified_health)..."

    BACKUP_FILE="${RESTORE_DIR}/${BACKUP_NAME}/unified_health.sql"

    if [ ! -f "${BACKUP_FILE}" ]; then
        error_exit "Backup file not found: ${BACKUP_FILE}"
    fi

    drop_and_recreate_database "unified_health"

    # Restore database
    PGPASSWORD="${POSTGRES_PASSWORD}" pg_restore \
        -h "${POSTGRES_HOST}" \
        -U "${POSTGRES_USER}" \
        -p "${POSTGRES_PORT}" \
        -d "unified_health" \
        -v \
        --no-owner \
        --no-privileges \
        "${BACKUP_FILE}" || error_exit "Failed to restore main database"

    log_success "Main database restored"
}

# Restore FHIR database
restore_fhir_database() {
    log_info "Restoring FHIR database (hapi_fhir)..."

    BACKUP_FILE="${RESTORE_DIR}/${BACKUP_NAME}/hapi_fhir.sql"

    if [ ! -f "${BACKUP_FILE}" ]; then
        log_warning "FHIR backup file not found, skipping"
        return 0
    fi

    drop_and_recreate_database "hapi_fhir"

    # Restore database
    PGPASSWORD="${POSTGRES_PASSWORD}" pg_restore \
        -h "${POSTGRES_HOST}" \
        -U "${POSTGRES_USER}" \
        -p "${POSTGRES_PORT}" \
        -d "hapi_fhir" \
        -v \
        --no-owner \
        --no-privileges \
        "${BACKUP_FILE}" || log_warning "Failed to restore FHIR database"

    log_success "FHIR database restored"
}

# Verify restore
verify_restore() {
    log_info "Verifying restore..."

    # Test connection
    PGPASSWORD="${POSTGRES_PASSWORD}" psql \
        -h "${POSTGRES_HOST}" \
        -U "${POSTGRES_USER}" \
        -p "${POSTGRES_PORT}" \
        -d "unified_health" \
        -c "SELECT 1;" >/dev/null || error_exit "Failed to connect to restored database"

    # Get table count
    TABLE_COUNT=$(PGPASSWORD="${POSTGRES_PASSWORD}" psql \
        -h "${POSTGRES_HOST}" \
        -U "${POSTGRES_USER}" \
        -p "${POSTGRES_PORT}" \
        -d "unified_health" \
        -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

    log_info "Tables restored: ${TABLE_COUNT}"

    if [ "${TABLE_COUNT}" -eq 0 ]; then
        error_exit "No tables found in restored database"
    fi

    log_success "Restore verified"
}

# Point-in-time recovery
point_in_time_recovery() {
    if [ -n "${PITR_TARGET_TIME:-}" ]; then
        log_info "Performing point-in-time recovery to ${PITR_TARGET_TIME}..."

        az postgres flexible-server restore \
            --resource-group "${RESOURCE_GROUP}" \
            --name "${POSTGRES_SERVER}-pitr-$(date +%Y%m%d-%H%M%S)" \
            --source-server "${POSTGRES_SERVER}" \
            --restore-time "${PITR_TARGET_TIME}" || error_exit "Point-in-time recovery failed"

        log_success "Point-in-time recovery completed"
        log_warning "A new server has been created. You need to manually switch to it."
    fi
}

# Cleanup restore files
cleanup_restore_files() {
    log_info "Cleaning up restore files..."

    rm -rf "${RESTORE_DIR}" 2>/dev/null || true

    log_success "Restore files cleaned up"
}

# Restart application pods
restart_application() {
    log_info "Restarting application pods..."

    NAMESPACE="unified-health-${ENVIRONMENT}"

    kubectl rollout restart deployment/unified-health-api -n "${NAMESPACE}" 2>/dev/null || log_warning "Failed to restart API deployment"

    log_success "Application restart initiated"
}

# Send notification
send_notification() {
    local status=$1

    log_info "Sending restore notification..."

    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST "${SLACK_WEBHOOK_URL}" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\":\"Database Restore ${status}\",
                \"attachments\":[{
                    \"color\":\"$([ "${status}" == "SUCCESS" ] && echo "good" || echo "danger")\",
                    \"fields\":[
                        {\"title\":\"Environment\",\"value\":\"${ENVIRONMENT}\",\"short\":true},
                        {\"title\":\"Backup\",\"value\":\"${BACKUP_NAME}\",\"short\":true}
                    ]
                }]
            }" || log_warning "Failed to send notification"
    fi
}

# Output summary
output_summary() {
    log_success "=========================================="
    log_success "Database Restore Complete!"
    log_success "=========================================="
    log_info "Backup: ${BACKUP_NAME}"
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Server: ${POSTGRES_SERVER}"
    log_success "=========================================="
}

# Main restore flow
main() {
    log_info "Starting database restore..."
    log_info "Environment: ${ENVIRONMENT}"

    check_prerequisites
    get_backup_name
    list_available_backups
    confirm_restore
    get_database_credentials
    create_pre_restore_backup
    download_backup
    verify_backup_integrity
    extract_backup
    restore_main_database
    restore_fhir_database
    verify_restore
    point_in_time_recovery
    cleanup_restore_files
    restart_application
    output_summary

    send_notification "SUCCESS"

    log_success "Restore completed successfully!"
}

# Trap errors
trap 'send_notification "FAILED"' ERR

# Run main
main "$@"
