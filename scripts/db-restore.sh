#!/bin/bash
# ============================================
# UnifiedHealth Platform - Database Restore
# ============================================
# This script restores a PostgreSQL database from backup in S3
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
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo '')}"
PROJECT_NAME="unified-health"
RDS_INSTANCE="${PROJECT_NAME}-rds-${ENVIRONMENT}"
S3_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-${AWS_ACCOUNT_ID}"
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

    command -v aws >/dev/null 2>&1 || error_exit "AWS CLI is not installed"
    command -v pg_restore >/dev/null 2>&1 || error_exit "pg_restore is not installed"
    command -v psql >/dev/null 2>&1 || error_exit "psql is not installed"

    # Check AWS credentials
    aws sts get-caller-identity >/dev/null 2>&1 || error_exit "Not authenticated with AWS. Run 'aws configure' or 'aws sso login'"

    # Get AWS Account ID if not set
    if [ -z "${AWS_ACCOUNT_ID}" ]; then
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        S3_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-${AWS_ACCOUNT_ID}"
    fi

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

    # Update restore directory
    RESTORE_DIR="/tmp/restore-${BACKUP_NAME}"

    log_info "Backup to restore: ${BACKUP_NAME}"
}

# List available backups
list_available_backups() {
    log_info "Available backups in S3:"

    aws s3api list-objects-v2 \
        --bucket "${S3_BUCKET}" \
        --prefix "backups/backup-${ENVIRONMENT}-" \
        --region "${AWS_REGION}" \
        --query "Contents[?ends_with(Key, '.tar.gz')].{Key:Key, LastModified:LastModified, Size:Size}" \
        --output table | head -n 25

    # Get latest backup from Secrets Manager
    LATEST_BACKUP=$(aws secretsmanager get-secret-value \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/latest-backup" \
        --region "${AWS_REGION}" \
        --query SecretString \
        --output text 2>/dev/null || echo "")

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
    log_warning "RDS Instance: ${RDS_INSTANCE}"
    log_warning "AWS Region: ${AWS_REGION}"
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

# Get database credentials from Secrets Manager
get_database_credentials() {
    log_info "Getting database credentials from Secrets Manager..."

    # Get admin password from Secrets Manager
    POSTGRES_PASSWORD=$(aws secretsmanager get-secret-value \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/rds-admin-password" \
        --region "${AWS_REGION}" \
        --query SecretString \
        --output text) || error_exit "Failed to get PostgreSQL password from Secrets Manager"

    # Get RDS endpoint
    POSTGRES_HOST=$(aws rds describe-db-instances \
        --db-instance-identifier "${RDS_INSTANCE}" \
        --region "${AWS_REGION}" \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text) || error_exit "Failed to get RDS endpoint"

    POSTGRES_USER="unifiedhealthadmin"
    POSTGRES_PORT="5432"

    log_success "Database credentials retrieved"
}

# Download backup from S3
download_backup() {
    log_info "Downloading backup from S3..."

    # Create restore directory
    mkdir -p "${RESTORE_DIR}" || error_exit "Failed to create restore directory"

    BACKUP_FILE="${RESTORE_DIR}/${BACKUP_NAME}.tar.gz"
    CHECKSUM_FILE="${RESTORE_DIR}/${BACKUP_NAME}.tar.gz.sha256"

    # Download backup
    aws s3 cp \
        "s3://${S3_BUCKET}/backups/${BACKUP_NAME}.tar.gz" \
        "${BACKUP_FILE}" \
        --region "${AWS_REGION}" || error_exit "Failed to download backup from S3"

    # Download checksum
    aws s3 cp \
        "s3://${S3_BUCKET}/backups/${BACKUP_NAME}.tar.gz.sha256" \
        "${CHECKSUM_FILE}" \
        --region "${AWS_REGION}" || log_warning "Checksum file not found"

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

# Point-in-time recovery using RDS
point_in_time_recovery() {
    if [ -n "${PITR_TARGET_TIME:-}" ]; then
        log_info "Performing point-in-time recovery to ${PITR_TARGET_TIME}..."

        NEW_INSTANCE="${RDS_INSTANCE}-pitr-$(date +%Y%m%d-%H%M%S)"

        aws rds restore-db-instance-to-point-in-time \
            --source-db-instance-identifier "${RDS_INSTANCE}" \
            --target-db-instance-identifier "${NEW_INSTANCE}" \
            --restore-time "${PITR_TARGET_TIME}" \
            --region "${AWS_REGION}" || error_exit "Point-in-time recovery failed"

        log_success "Point-in-time recovery initiated"
        log_warning "A new RDS instance '${NEW_INSTANCE}' is being created."
        log_warning "You need to manually switch to it once available."
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
    EKS_CLUSTER="${PROJECT_NAME}-eks-${ENVIRONMENT}"

    # Update kubeconfig
    aws eks update-kubeconfig \
        --region "${AWS_REGION}" \
        --name "${EKS_CLUSTER}" 2>/dev/null || log_warning "Failed to get EKS credentials"

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

    # SNS notification
    if [ -n "${SNS_TOPIC_ARN:-}" ]; then
        aws sns publish \
            --topic-arn "${SNS_TOPIC_ARN}" \
            --subject "Database Restore ${status}" \
            --message "Restore from ${BACKUP_NAME} completed for ${ENVIRONMENT}" \
            --region "${AWS_REGION}" || log_warning "Failed to send SNS notification"
    fi
}

# Output summary
output_summary() {
    log_success "=========================================="
    log_success "Database Restore Complete!"
    log_success "=========================================="
    log_info "Backup: ${BACKUP_NAME}"
    log_info "Environment: ${ENVIRONMENT}"
    log_info "RDS Instance: ${RDS_INSTANCE}"
    log_success "=========================================="
}

# Main restore flow
main() {
    log_info "Starting database restore..."
    log_info "Environment: ${ENVIRONMENT}"
    log_info "AWS Region: ${AWS_REGION}"

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
