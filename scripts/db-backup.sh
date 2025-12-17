#!/bin/bash
# ============================================
# UnifiedHealth Platform - Database Backup
# ============================================
# This script creates a backup of the PostgreSQL database
# Usage: ./scripts/db-backup.sh [environment]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-production}"
RESOURCE_GROUP="unified-health-rg-${ENVIRONMENT}"
POSTGRES_SERVER="unified-health-postgres-${ENVIRONMENT}"
STORAGE_ACCOUNT="unifiedhealthsa${ENVIRONMENT}"
KEYVAULT_NAME="unified-health-kv-${ENVIRONMENT}"
BACKUP_TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="backup-${ENVIRONMENT}-${BACKUP_TIMESTAMP}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

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
    command -v pg_dump >/dev/null 2>&1 || error_exit "pg_dump is not installed"

    # Check Azure login
    az account show >/dev/null 2>&1 || error_exit "Not logged in to Azure. Run 'az login'"

    log_success "Prerequisites check passed"
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

# Create backup directory
create_backup_directory() {
    log_info "Creating backup directory..."

    BACKUP_DIR="/tmp/${BACKUP_NAME}"
    mkdir -p "${BACKUP_DIR}" || error_exit "Failed to create backup directory"

    log_success "Backup directory created: ${BACKUP_DIR}"
}

# Backup main database
backup_main_database() {
    log_info "Backing up main database (unified_health)..."

    BACKUP_FILE="${BACKUP_DIR}/unified_health.sql"

    PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
        -h "${POSTGRES_HOST}" \
        -U "${POSTGRES_USER}" \
        -p "${POSTGRES_PORT}" \
        -d "unified_health" \
        -F c \
        -b \
        -v \
        -f "${BACKUP_FILE}" || error_exit "Failed to backup main database"

    log_success "Main database backed up"
}

# Backup FHIR database
backup_fhir_database() {
    log_info "Backing up FHIR database (hapi_fhir)..."

    BACKUP_FILE="${BACKUP_DIR}/hapi_fhir.sql"

    PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
        -h "${POSTGRES_HOST}" \
        -U "${POSTGRES_USER}" \
        -p "${POSTGRES_PORT}" \
        -d "hapi_fhir" \
        -F c \
        -b \
        -v \
        -f "${BACKUP_FILE}" || log_warning "Failed to backup FHIR database (may not exist)"

    log_success "FHIR database backed up"
}

# Backup schema only
backup_schema() {
    log_info "Backing up schema..."

    SCHEMA_FILE="${BACKUP_DIR}/schema.sql"

    PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
        -h "${POSTGRES_HOST}" \
        -U "${POSTGRES_USER}" \
        -p "${POSTGRES_PORT}" \
        -d "unified_health" \
        -s \
        -f "${SCHEMA_FILE}" || error_exit "Failed to backup schema"

    log_success "Schema backed up"
}

# Create backup metadata
create_backup_metadata() {
    log_info "Creating backup metadata..."

    METADATA_FILE="${BACKUP_DIR}/metadata.json"

    cat > "${METADATA_FILE}" <<EOF
{
  "backup_name": "${BACKUP_NAME}",
  "timestamp": "${BACKUP_TIMESTAMP}",
  "environment": "${ENVIRONMENT}",
  "server": "${POSTGRES_SERVER}",
  "host": "${POSTGRES_HOST}",
  "databases": ["unified_health", "hapi_fhir"],
  "backup_type": "full",
  "pg_version": "$(PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "${POSTGRES_HOST}" -U "${POSTGRES_USER}" -p "${POSTGRES_PORT}" -d unified_health -tAc 'SELECT version()' 2>/dev/null || echo 'unknown')",
  "size_bytes": $(du -sb "${BACKUP_DIR}" | cut -f1)
}
EOF

    log_success "Backup metadata created"
}

# Compress backup
compress_backup() {
    log_info "Compressing backup..."

    COMPRESSED_FILE="/tmp/${BACKUP_NAME}.tar.gz"

    tar -czf "${COMPRESSED_FILE}" -C /tmp "${BACKUP_NAME}" || error_exit "Failed to compress backup"

    # Calculate checksum
    CHECKSUM=$(sha256sum "${COMPRESSED_FILE}" | awk '{print $1}')
    echo "${CHECKSUM}" > "${COMPRESSED_FILE}.sha256"

    log_success "Backup compressed: ${COMPRESSED_FILE}"
    log_info "Checksum: ${CHECKSUM}"
}

# Upload to Azure Blob Storage
upload_to_azure() {
    log_info "Uploading backup to Azure Blob Storage..."

    # Get storage account key
    STORAGE_KEY=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "storage-account-key" \
        --query value -o tsv) || error_exit "Failed to get storage account key"

    # Upload backup file
    az storage blob upload \
        --account-name "${STORAGE_ACCOUNT}" \
        --account-key "${STORAGE_KEY}" \
        --container-name "backups" \
        --name "${BACKUP_NAME}.tar.gz" \
        --file "${COMPRESSED_FILE}" \
        --tier Hot \
        --overwrite || error_exit "Failed to upload backup"

    # Upload checksum
    az storage blob upload \
        --account-name "${STORAGE_ACCOUNT}" \
        --account-key "${STORAGE_KEY}" \
        --container-name "backups" \
        --name "${BACKUP_NAME}.tar.gz.sha256" \
        --file "${COMPRESSED_FILE}.sha256" \
        --overwrite || error_exit "Failed to upload checksum"

    log_success "Backup uploaded to Azure Blob Storage"
}

# Verify backup
verify_backup() {
    log_info "Verifying backup..."

    # Check if backup file exists in Azure
    az storage blob exists \
        --account-name "${STORAGE_ACCOUNT}" \
        --container-name "backups" \
        --name "${BACKUP_NAME}.tar.gz" \
        --query exists -o tsv || error_exit "Backup verification failed"

    log_success "Backup verified"
}

# Apply retention policy
apply_retention_policy() {
    log_info "Applying retention policy (${BACKUP_RETENTION_DAYS} days)..."

    # Get storage account key
    STORAGE_KEY=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "storage-account-key" \
        --query value -o tsv) || error_exit "Failed to get storage account key"

    # List all backups
    CUTOFF_DATE=$(date -d "${BACKUP_RETENTION_DAYS} days ago" +%Y-%m-%d 2>/dev/null || date -v -${BACKUP_RETENTION_DAYS}d +%Y-%m-%d)

    log_info "Deleting backups older than ${CUTOFF_DATE}..."

    # Get list of old backups
    OLD_BACKUPS=$(az storage blob list \
        --account-name "${STORAGE_ACCOUNT}" \
        --account-key "${STORAGE_KEY}" \
        --container-name "backups" \
        --prefix "backup-${ENVIRONMENT}-" \
        --query "[?properties.lastModified < '${CUTOFF_DATE}'].name" -o tsv)

    if [ -n "${OLD_BACKUPS}" ]; then
        echo "${OLD_BACKUPS}" | while read -r blob_name; do
            if [ -n "${blob_name}" ]; then
                log_info "Deleting old backup: ${blob_name}"
                az storage blob delete \
                    --account-name "${STORAGE_ACCOUNT}" \
                    --account-key "${STORAGE_KEY}" \
                    --container-name "backups" \
                    --name "${blob_name}" || log_warning "Failed to delete ${blob_name}"
            fi
        done
        log_success "Old backups cleaned up"
    else
        log_info "No old backups to delete"
    fi
}

# Cleanup local files
cleanup_local_files() {
    log_info "Cleaning up local files..."

    rm -rf "${BACKUP_DIR}" 2>/dev/null || true
    rm -f "${COMPRESSED_FILE}" "${COMPRESSED_FILE}.sha256" 2>/dev/null || true

    log_success "Local files cleaned up"
}

# Store backup reference in Key Vault
store_backup_reference() {
    log_info "Storing backup reference in Key Vault..."

    az keyvault secret set \
        --vault-name "${KEYVAULT_NAME}" \
        --name "latest-backup-${ENVIRONMENT}" \
        --value "${BACKUP_NAME}" || log_warning "Failed to store backup reference"

    log_success "Backup reference stored"
}

# Send notification
send_notification() {
    local status=$1

    log_info "Sending backup notification..."

    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST "${SLACK_WEBHOOK_URL}" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\":\"Database Backup ${status}\",
                \"attachments\":[{
                    \"color\":\"$([ "${status}" == "SUCCESS" ] && echo "good" || echo "danger")\",
                    \"fields\":[
                        {\"title\":\"Environment\",\"value\":\"${ENVIRONMENT}\",\"short\":true},
                        {\"title\":\"Backup Name\",\"value\":\"${BACKUP_NAME}\",\"short\":true},
                        {\"title\":\"Timestamp\",\"value\":\"${BACKUP_TIMESTAMP}\",\"short\":true}
                    ]
                }]
            }" || log_warning "Failed to send notification"
    fi
}

# Output summary
output_summary() {
    log_success "=========================================="
    log_success "Database Backup Complete!"
    log_success "=========================================="
    log_info "Backup Name: ${BACKUP_NAME}"
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Storage Location: Azure Blob Storage (backups container)"
    log_success "=========================================="
    log_info ""
    log_info "To restore this backup, run:"
    log_info "  ./scripts/db-restore.sh ${BACKUP_NAME}"
}

# Main backup flow
main() {
    log_info "Starting database backup..."
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Timestamp: ${BACKUP_TIMESTAMP}"

    check_prerequisites
    get_database_credentials
    create_backup_directory
    backup_main_database
    backup_fhir_database
    backup_schema
    create_backup_metadata
    compress_backup
    upload_to_azure
    verify_backup
    apply_retention_policy
    store_backup_reference
    cleanup_local_files
    output_summary

    send_notification "SUCCESS"

    log_success "Backup completed successfully!"
}

# Trap errors
trap 'send_notification "FAILED"' ERR

# Run main
main "$@"
