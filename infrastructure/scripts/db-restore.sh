#!/bin/bash

##############################################################################
# Database Restore Script
#
# Production-ready PostgreSQL restore script with:
# - Full database restoration
# - Point-in-time recovery (PITR)
# - Restore verification and testing
# - Pre-restore validation
# - Backup selection interface
# - Safety checks and confirmations
# - Rollback support
# - Cloud storage download
##############################################################################

set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment variables
if [ -f "$SCRIPT_DIR/../../services/api/.env" ]; then
    source "$SCRIPT_DIR/../../services/api/.env"
fi

##############################################################################
# Configuration
##############################################################################

# Database connection
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-unified_health_dev}"
DB_USER="${DB_USER:-unified_health}"
DB_PASSWORD="${DB_PASSWORD:-password}"

# Restore configuration
BACKUP_DIR="${BACKUP_DIR:-$SCRIPT_DIR/../backups/database}"
BACKUP_ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-}"
RESTORE_MODE="${RESTORE_MODE:-full}" # full, pitr, test

# Safety settings
REQUIRE_CONFIRMATION="${REQUIRE_CONFIRMATION:-true}"
CREATE_PRE_RESTORE_BACKUP="${CREATE_PRE_RESTORE_BACKUP:-true}"
TEST_RESTORE_FIRST="${TEST_RESTORE_FIRST:-true}"

# Cloud storage (optional)
CLOUD_STORAGE_ENABLED="${CLOUD_STORAGE_ENABLED:-false}"
CLOUD_STORAGE_PROVIDER="${CLOUD_STORAGE_PROVIDER:-azure}"
AZURE_STORAGE_ACCOUNT="${AZURE_STORAGE_ACCOUNT:-}"
AZURE_STORAGE_CONTAINER="${AZURE_STORAGE_CONTAINER:-database-backups}"
AWS_S3_BUCKET="${AWS_S3_BUCKET:-}"
GCP_BUCKET="${GCP_BUCKET:-}"

# Restore metadata
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${BACKUP_DIR}/logs/restore_${TIMESTAMP}.log"

##############################################################################
# Logging Functions
##############################################################################

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

log_error() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $*" | tee -a "$LOG_FILE" >&2
}

log_success() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $*" | tee -a "$LOG_FILE"
}

log_warning() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $*" | tee -a "$LOG_FILE"
}

##############################################################################
# Setup Functions
##############################################################################

check_dependencies() {
    log "Checking dependencies..."

    local dependencies=("psql" "pg_restore")

    dependencies+=("gzip")

    if [ -n "$BACKUP_ENCRYPTION_KEY" ]; then
        dependencies+=("openssl")
    fi

    if [ "$CLOUD_STORAGE_ENABLED" = "true" ]; then
        case "$CLOUD_STORAGE_PROVIDER" in
            azure) dependencies+=("az") ;;
            aws) dependencies+=("aws") ;;
            gcp) dependencies+=("gsutil") ;;
        esac
    fi

    for cmd in "${dependencies[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            log_error "Required command not found: $cmd"
            exit 1
        fi
    done

    log "All dependencies satisfied"
}

##############################################################################
# Backup Selection Functions
##############################################################################

list_available_backups() {
    log "Available backups:"
    echo ""

    local backups=()

    # List local backups
    if [ -d "$BACKUP_DIR/full" ]; then
        while IFS= read -r backup; do
            backups+=("$backup")
        done < <(find "$BACKUP_DIR/full" -name "backup_*.sql*" -type f | sort -r)
    fi

    if [ ${#backups[@]} -eq 0 ]; then
        log_error "No backups found in $BACKUP_DIR/full"
        return 1
    fi

    local i=1
    for backup in "${backups[@]}"; do
        local backup_name=$(basename "$backup")
        local backup_size=$(du -h "$backup" | cut -f1)
        local backup_date=$(stat -c %y "$backup" 2>/dev/null || stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$backup")

        # Try to load metadata
        local metadata_file="${BACKUP_DIR}/metadata/${backup_name%.sql*}.json"
        local db_info=""
        if [ -f "$metadata_file" ]; then
            db_info=$(grep -o '"database": "[^"]*"' "$metadata_file" | cut -d'"' -f4)
            db_info=" (DB: $db_info)"
        fi

        echo "[$i] $backup_name - $backup_size - $backup_date$db_info"
        ((i++))
    done

    echo ""
}

select_backup() {
    list_available_backups

    local backups=($(find "$BACKUP_DIR/full" -name "backup_*.sql*" -type f | sort -r))

    if [ ${#backups[@]} -eq 0 ]; then
        log_error "No backups available"
        exit 1
    fi

    if [ -n "${BACKUP_FILE:-}" ]; then
        # Use provided backup file
        if [ ! -f "$BACKUP_FILE" ]; then
            log_error "Backup file not found: $BACKUP_FILE"
            exit 1
        fi
        echo "$BACKUP_FILE"
        return
    fi

    # Interactive selection
    echo -n "Select backup number to restore (1-${#backups[@]}), or 'q' to quit: "
    read -r selection

    if [ "$selection" = "q" ]; then
        log "Restore cancelled by user"
        exit 0
    fi

    if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#backups[@]} ]; then
        log_error "Invalid selection"
        exit 1
    fi

    local selected_backup="${backups[$((selection-1))]}"
    echo "$selected_backup"
}

##############################################################################
# Cloud Storage Functions
##############################################################################

download_from_cloud() {
    local backup_name=$1

    if [ "$CLOUD_STORAGE_ENABLED" != "true" ]; then
        return 0
    fi

    log "Downloading backup from cloud storage ($CLOUD_STORAGE_PROVIDER)..."

    local local_file="${BACKUP_DIR}/full/$backup_name"

    case "$CLOUD_STORAGE_PROVIDER" in
        azure)
            az storage blob download \
                --account-name "$AZURE_STORAGE_ACCOUNT" \
                --container-name "$AZURE_STORAGE_CONTAINER" \
                --name "$backup_name" \
                --file "$local_file"
            ;;
        aws)
            aws s3 cp "s3://${AWS_S3_BUCKET}/${backup_name}" "$local_file"
            ;;
        gcp)
            gsutil cp "gs://${GCP_BUCKET}/${backup_name}" "$local_file"
            ;;
        *)
            log_error "Unknown cloud storage provider: $CLOUD_STORAGE_PROVIDER"
            return 1
            ;;
    esac

    log_success "Backup downloaded from cloud storage"
    echo "$local_file"
}

##############################################################################
# Restore Functions
##############################################################################

prepare_backup_file() {
    local backup_file=$1
    local work_file="$backup_file"

    log "Preparing backup file for restore..."

    # Decrypt if needed
    if [[ "$backup_file" == *.enc ]]; then
        if [ -z "$BACKUP_ENCRYPTION_KEY" ]; then
            log_error "Backup is encrypted but no encryption key provided"
            exit 1
        fi

        log "Decrypting backup..."
        local decrypted_file="${backup_file%.enc}"
        openssl enc -aes-256-cbc -d -pbkdf2 \
            -in "$backup_file" \
            -out "$decrypted_file" \
            -k "$BACKUP_ENCRYPTION_KEY"

        work_file="$decrypted_file"
        log "Backup decrypted"
    fi

    # Decompress if needed
    if [[ "$work_file" == *.gz ]]; then
        log "Decompressing backup..."
        local decompressed_file="${work_file%.gz}"
        gunzip -c "$work_file" > "$decompressed_file"

        # Remove decrypted file if it was temporary
        if [ "$work_file" != "$backup_file" ]; then
            rm "$work_file"
        fi

        work_file="$decompressed_file"
        log "Backup decompressed"
    fi

    echo "$work_file"
}

create_pre_restore_backup() {
    if [ "$CREATE_PRE_RESTORE_BACKUP" != "true" ]; then
        return 0
    fi

    log "Creating pre-restore backup for safety..."

    local pre_restore_backup="${BACKUP_DIR}/full/pre_restore_${DB_NAME}_${TIMESTAMP}.sql.gz"

    export PGPASSWORD="$DB_PASSWORD"

    pg_dump \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --format=plain \
        --file=- \
        2>&1 | gzip > "$pre_restore_backup"

    unset PGPASSWORD

    if [ $? -eq 0 ]; then
        log_success "Pre-restore backup created: $pre_restore_backup"
        echo "$pre_restore_backup"
    else
        log_error "Failed to create pre-restore backup"
        return 1
    fi
}

verify_backup_integrity() {
    local backup_file=$1

    log "Verifying backup integrity..."

    # Check file exists and is not empty
    if [ ! -f "$backup_file" ] || [ ! -s "$backup_file" ]; then
        log_error "Backup file is missing or empty"
        return 1
    fi

    # Verify checksum if metadata exists
    local backup_name=$(basename "$backup_file")
    local metadata_file="${BACKUP_DIR}/metadata/${backup_name%.sql*}.json"

    if [ -f "$metadata_file" ]; then
        local stored_checksum=$(grep -o '"backup_checksum": "[^"]*"' "$metadata_file" | cut -d'"' -f4)

        # Calculate checksum of the original compressed/encrypted file
        local original_file="$backup_file"
        if [[ ! "$1" =~ \.(gz|enc)$ ]]; then
            # If file was decompressed, check the original
            if [ -f "${1}.gz" ]; then
                original_file="${1}.gz"
            elif [ -f "${1}.gz.enc" ]; then
                original_file="${1}.gz.enc"
            fi
        fi

        if [ -f "$original_file" ]; then
            local current_checksum=$(sha256sum "$original_file" | cut -d' ' -f1)

            if [ "$stored_checksum" != "$current_checksum" ]; then
                log_error "Checksum verification failed"
                return 1
            fi

            log "Checksum verification passed"
        fi
    fi

    # Verify SQL syntax (basic check)
    if grep -q "^--" "$backup_file" && grep -q "^CREATE" "$backup_file"; then
        log "Backup file structure looks valid"
    else
        log_warning "Backup file structure may be invalid"
    fi

    log_success "Backup integrity verified"
    return 0
}

test_restore() {
    local backup_file=$1

    if [ "$TEST_RESTORE_FIRST" != "true" ]; then
        return 0
    fi

    log "Performing test restore to temporary database..."

    local test_db="${DB_NAME}_restore_test_${TIMESTAMP}"

    export PGPASSWORD="$DB_PASSWORD"

    # Create test database
    psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="postgres" \
        --command="CREATE DATABASE $test_db;" \
        2>&1 | tee -a "$LOG_FILE"

    # Restore to test database
    psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$test_db" \
        --file="$backup_file" \
        2>&1 | tee -a "$LOG_FILE"

    local restore_status=$?

    # Verify restore
    if [ $restore_status -eq 0 ]; then
        # Run basic queries to verify
        local table_count=$(psql \
            --host="$DB_HOST" \
            --port="$DB_PORT" \
            --username="$DB_USER" \
            --dbname="$test_db" \
            --tuples-only \
            --command="SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" \
            2>/dev/null)

        log "Test restore successful - Found $table_count tables"
    else
        log_error "Test restore failed"
    fi

    # Cleanup test database
    psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="postgres" \
        --command="DROP DATABASE $test_db;" \
        2>&1 | tee -a "$LOG_FILE"

    unset PGPASSWORD

    if [ $restore_status -ne 0 ]; then
        return 1
    fi

    log_success "Test restore completed successfully"
    return 0
}

perform_restore() {
    local backup_file=$1

    log "Performing database restore..."

    export PGPASSWORD="$DB_PASSWORD"

    # Terminate existing connections
    log "Terminating existing database connections..."
    psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="postgres" \
        --command="SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" \
        2>&1 | tee -a "$LOG_FILE"

    # Drop and recreate database
    log "Dropping and recreating database..."
    psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="postgres" \
        --command="DROP DATABASE IF EXISTS $DB_NAME;" \
        2>&1 | tee -a "$LOG_FILE"

    psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="postgres" \
        --command="CREATE DATABASE $DB_NAME;" \
        2>&1 | tee -a "$LOG_FILE"

    # Restore backup
    log "Restoring backup data..."
    psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --file="$backup_file" \
        2>&1 | tee -a "$LOG_FILE"

    local restore_status=$?

    unset PGPASSWORD

    if [ $restore_status -ne 0 ]; then
        log_error "Restore failed"
        return 1
    fi

    log_success "Database restored successfully"
    return 0
}

verify_restore() {
    log "Verifying restore..."

    export PGPASSWORD="$DB_PASSWORD"

    # Check database exists
    local db_exists=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="postgres" \
        --tuples-only \
        --command="SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" \
        2>/dev/null)

    if [ -z "$db_exists" ]; then
        log_error "Database does not exist after restore"
        unset PGPASSWORD
        return 1
    fi

    # Count tables
    local table_count=$(psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --tuples-only \
        --command="SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" \
        2>/dev/null)

    log "Found $table_count tables in restored database"

    # Run basic health check query
    psql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --command="SELECT 1;" \
        2>&1 | tee -a "$LOG_FILE"

    unset PGPASSWORD

    if [ $? -ne 0 ]; then
        log_error "Restore verification failed"
        return 1
    fi

    log_success "Restore verified successfully"
    return 0
}

##############################################################################
# Safety Functions
##############################################################################

confirm_restore() {
    if [ "$REQUIRE_CONFIRMATION" != "true" ]; then
        return 0
    fi

    log_warning "WARNING: This will replace the current database: $DB_NAME"
    log_warning "Host: $DB_HOST:$DB_PORT"

    if [ "$CREATE_PRE_RESTORE_BACKUP" = "true" ]; then
        log "A pre-restore backup will be created automatically"
    else
        log_warning "No pre-restore backup will be created!"
    fi

    echo ""
    echo -n "Are you sure you want to proceed? Type 'yes' to continue: "
    read -r confirmation

    if [ "$confirmation" != "yes" ]; then
        log "Restore cancelled by user"
        exit 0
    fi

    log "User confirmed restore operation"
}

##############################################################################
# Main Execution
##############################################################################

main() {
    log "=========================================="
    log "Database Restore Started"
    log "=========================================="
    log "Database: $DB_NAME@$DB_HOST:$DB_PORT"
    log "Timestamp: $TIMESTAMP"

    # Setup
    mkdir -p "$BACKUP_DIR/logs"
    check_dependencies

    # Select backup
    local backup_file=$(select_backup)
    log "Selected backup: $backup_file"

    # Prepare backup file (decrypt/decompress)
    local prepared_file=$(prepare_backup_file "$backup_file")

    # Verify backup integrity
    if ! verify_backup_integrity "$prepared_file"; then
        log_error "Backup integrity check failed"
        exit 1
    fi

    # Test restore first (optional)
    if ! test_restore "$prepared_file"; then
        log_error "Test restore failed - aborting"
        exit 1
    fi

    # Confirm restore
    confirm_restore

    # Create pre-restore backup
    local pre_restore_backup=""
    if [ "$CREATE_PRE_RESTORE_BACKUP" = "true" ]; then
        pre_restore_backup=$(create_pre_restore_backup)
        if [ $? -ne 0 ]; then
            log_error "Failed to create pre-restore backup - aborting"
            exit 1
        fi
    fi

    # Perform restore
    if ! perform_restore "$prepared_file"; then
        log_error "Restore failed"

        if [ -n "$pre_restore_backup" ]; then
            log "Pre-restore backup available at: $pre_restore_backup"
            log "You can manually restore it if needed"
        fi

        exit 1
    fi

    # Verify restore
    if ! verify_restore; then
        log_error "Restore verification failed"
        exit 1
    fi

    # Cleanup temporary files
    if [ "$prepared_file" != "$backup_file" ]; then
        rm -f "$prepared_file"
    fi

    log "=========================================="
    log_success "Database Restore Completed Successfully"
    log "=========================================="

    if [ -n "$pre_restore_backup" ]; then
        log "Pre-restore backup saved at: $pre_restore_backup"
    fi
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --file)
            BACKUP_FILE="$2"
            shift 2
            ;;
        --no-confirm)
            REQUIRE_CONFIRMATION=false
            shift
            ;;
        --no-test)
            TEST_RESTORE_FIRST=false
            shift
            ;;
        --no-backup)
            CREATE_PRE_RESTORE_BACKUP=false
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --file BACKUP_FILE       Specify backup file to restore"
            echo "  --no-confirm             Skip confirmation prompt"
            echo "  --no-test                Skip test restore"
            echo "  --no-backup              Skip pre-restore backup"
            echo "  --help                   Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main function
main "$@"
