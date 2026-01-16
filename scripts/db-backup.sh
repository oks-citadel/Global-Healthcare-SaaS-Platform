#!/bin/bash
# ============================================
# UnifiedHealth Platform - Database Backup
# ============================================
# This script creates a backup of the PostgreSQL database and stores it in S3
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
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo '')}"
PROJECT_NAME="unified-health"
RDS_INSTANCE="${PROJECT_NAME}-rds-${ENVIRONMENT}"
S3_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-${AWS_ACCOUNT_ID}"
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

    command -v aws >/dev/null 2>&1 || error_exit "AWS CLI is not installed"
    command -v pg_dump >/dev/null 2>&1 || error_exit "pg_dump is not installed"

    # Check AWS credentials
    aws sts get-caller-identity >/dev/null 2>&1 || error_exit "Not authenticated with AWS. Run 'aws configure' or 'aws sso login'"

    # Get AWS Account ID if not set
    if [ -z "${AWS_ACCOUNT_ID}" ]; then
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        S3_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-${AWS_ACCOUNT_ID}"
    fi

    log_success "Prerequisites check passed"
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
  "rds_instance": "${RDS_INSTANCE}",
  "host": "${POSTGRES_HOST}",
  "databases": ["unified_health", "hapi_fhir"],
  "backup_type": "full",
  "aws_region": "${AWS_REGION}",
  "s3_bucket": "${S3_BUCKET}",
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

# Upload to S3
upload_to_s3() {
    log_info "Uploading backup to S3..."

    # Upload backup file
    aws s3 cp "${COMPRESSED_FILE}" \
        "s3://${S3_BUCKET}/backups/${BACKUP_NAME}.tar.gz" \
        --region "${AWS_REGION}" \
        --storage-class STANDARD_IA || error_exit "Failed to upload backup to S3"

    # Upload checksum
    aws s3 cp "${COMPRESSED_FILE}.sha256" \
        "s3://${S3_BUCKET}/backups/${BACKUP_NAME}.tar.gz.sha256" \
        --region "${AWS_REGION}" || error_exit "Failed to upload checksum to S3"

    log_success "Backup uploaded to S3: s3://${S3_BUCKET}/backups/${BACKUP_NAME}.tar.gz"
}

# Verify backup
verify_backup() {
    log_info "Verifying backup..."

    # Check if backup file exists in S3
    aws s3api head-object \
        --bucket "${S3_BUCKET}" \
        --key "backups/${BACKUP_NAME}.tar.gz" \
        --region "${AWS_REGION}" >/dev/null || error_exit "Backup verification failed"

    log_success "Backup verified in S3"
}

# Apply retention policy
apply_retention_policy() {
    log_info "Applying retention policy (${BACKUP_RETENTION_DAYS} days)..."

    CUTOFF_DATE=$(date -d "${BACKUP_RETENTION_DAYS} days ago" +%Y-%m-%d 2>/dev/null || date -v -${BACKUP_RETENTION_DAYS}d +%Y-%m-%d)

    log_info "Deleting backups older than ${CUTOFF_DATE}..."

    # List and delete old backups
    OLD_BACKUPS=$(aws s3api list-objects-v2 \
        --bucket "${S3_BUCKET}" \
        --prefix "backups/backup-${ENVIRONMENT}-" \
        --region "${AWS_REGION}" \
        --query "Contents[?LastModified<='${CUTOFF_DATE}'].Key" \
        --output text 2>/dev/null || echo "")

    if [ -n "${OLD_BACKUPS}" ] && [ "${OLD_BACKUPS}" != "None" ]; then
        echo "${OLD_BACKUPS}" | tr '\t' '\n' | while read -r key; do
            if [ -n "${key}" ]; then
                log_info "Deleting old backup: ${key}"
                aws s3 rm "s3://${S3_BUCKET}/${key}" \
                    --region "${AWS_REGION}" || log_warning "Failed to delete ${key}"
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

# Store backup reference in Secrets Manager
store_backup_reference() {
    log_info "Storing backup reference in Secrets Manager..."

    aws secretsmanager update-secret \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/latest-backup" \
        --secret-string "${BACKUP_NAME}" \
        --region "${AWS_REGION}" 2>/dev/null || \
    aws secretsmanager create-secret \
        --name "${PROJECT_NAME}/${ENVIRONMENT}/latest-backup" \
        --secret-string "${BACKUP_NAME}" \
        --region "${AWS_REGION}" 2>/dev/null || log_warning "Failed to store backup reference"

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
                        {\"title\":\"S3 Location\",\"value\":\"s3://${S3_BUCKET}/backups/${BACKUP_NAME}.tar.gz\",\"short\":false}
                    ]
                }]
            }" || log_warning "Failed to send notification"
    fi

    # SNS notification
    if [ -n "${SNS_TOPIC_ARN:-}" ]; then
        aws sns publish \
            --topic-arn "${SNS_TOPIC_ARN}" \
            --subject "Database Backup ${status}" \
            --message "Backup ${BACKUP_NAME} completed for ${ENVIRONMENT}" \
            --region "${AWS_REGION}" || log_warning "Failed to send SNS notification"
    fi
}

# Output summary
output_summary() {
    log_success "=========================================="
    log_success "Database Backup Complete!"
    log_success "=========================================="
    log_info "Backup Name: ${BACKUP_NAME}"
    log_info "Environment: ${ENVIRONMENT}"
    log_info "S3 Location: s3://${S3_BUCKET}/backups/${BACKUP_NAME}.tar.gz"
    log_success "=========================================="
    log_info ""
    log_info "To restore this backup, run:"
    log_info "  ./scripts/db-restore.sh ${BACKUP_NAME}"
}

# Main backup flow
main() {
    log_info "Starting database backup..."
    log_info "Environment: ${ENVIRONMENT}"
    log_info "AWS Region: ${AWS_REGION}"
    log_info "Timestamp: ${BACKUP_TIMESTAMP}"

    check_prerequisites
    get_database_credentials
    create_backup_directory
    backup_main_database
    backup_fhir_database
    backup_schema
    create_backup_metadata
    compress_backup
    upload_to_s3
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
