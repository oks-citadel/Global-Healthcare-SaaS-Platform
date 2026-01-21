#!/bin/bash

#####################################################
# Database Backup Script
# Unified Health Platform
#
# This script creates compressed backups of the
# PostgreSQL database with retention management
#####################################################

set -euo pipefail

# ==================================================
# Configuration
# ==================================================

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Backup configuration
BACKUP_ROOT_DIR="${BACKUP_DIR:-/var/backups/postgresql}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT_DIR/$TIMESTAMP"
LOG_FILE="$BACKUP_ROOT_DIR/backup.log"

# Database configuration from environment
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-healthcare_db}"
DB_USER="${DB_USER:-postgres}"

# Backup types
BACKUP_TYPE="${1:-full}"  # full, schema-only, data-only

# ==================================================
# Logging Functions
# ==================================================

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_error() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" | tee -a "$LOG_FILE" >&2
}

log_success() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1" | tee -a "$LOG_FILE"
}

# ==================================================
# Pre-flight Checks
# ==================================================

preflight_checks() {
  log "Starting pre-flight checks..."

  # Check if pg_dump is available
  if ! command -v pg_dump &> /dev/null; then
    log_error "pg_dump command not found. Please install PostgreSQL client tools."
    exit 1
  fi

  # Check database connectivity
  if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; then
    log_error "Cannot connect to database. Please check connection parameters."
    exit 1
  fi

  # Create backup directory
  mkdir -p "$BACKUP_DIR"
  if [ ! -d "$BACKUP_DIR" ]; then
    log_error "Failed to create backup directory: $BACKUP_DIR"
    exit 1
  fi

  # Check available disk space (require at least 5GB)
  AVAILABLE_SPACE=$(df -BG "$BACKUP_ROOT_DIR" | tail -1 | awk '{print $4}' | sed 's/G//')
  if [ "$AVAILABLE_SPACE" -lt 5 ]; then
    log_error "Insufficient disk space. Available: ${AVAILABLE_SPACE}GB, Required: 5GB"
    exit 1
  fi

  log_success "Pre-flight checks passed"
}

# ==================================================
# Database Statistics
# ==================================================

collect_statistics() {
  log "Collecting database statistics..."

  # Get database size
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT pg_size_pretty(pg_database_size('$DB_NAME')) as database_size;
  " > "$BACKUP_DIR/database_size.txt"

  # Get table sizes
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT
      schemaname,
      tablename,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
      pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY size_bytes DESC;
  " > "$BACKUP_DIR/table_sizes.txt"

  # Get row counts
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT
      schemaname,
      tablename,
      n_live_tup AS row_count
    FROM pg_stat_user_tables
    ORDER BY n_live_tup DESC;
  " > "$BACKUP_DIR/row_counts.txt"

  # Get index information
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT
      schemaname,
      tablename,
      indexname,
      pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
    FROM pg_indexes
    LEFT JOIN pg_class ON pg_class.relname = indexname
    WHERE schemaname = 'public'
    ORDER BY pg_relation_size(indexrelid) DESC;
  " > "$BACKUP_DIR/index_sizes.txt"

  log_success "Statistics collected"
}

# ==================================================
# Backup Functions
# ==================================================

backup_full() {
  log "Creating full database backup..."

  PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -Fc \
    -v \
    -f "$BACKUP_DIR/full_backup.dump" \
    2>> "$LOG_FILE"

  if [ $? -eq 0 ]; then
    log_success "Full backup created successfully"

    # Compress backup
    gzip -9 "$BACKUP_DIR/full_backup.dump"
    log_success "Backup compressed"
  else
    log_error "Full backup failed"
    exit 1
  fi
}

backup_schema_only() {
  log "Creating schema-only backup..."

  PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -Fc \
    -v \
    --schema-only \
    -f "$BACKUP_DIR/schema_backup.dump" \
    2>> "$LOG_FILE"

  if [ $? -eq 0 ]; then
    log_success "Schema backup created successfully"
    gzip -9 "$BACKUP_DIR/schema_backup.dump"
  else
    log_error "Schema backup failed"
    exit 1
  fi
}

backup_data_only() {
  log "Creating data-only backup..."

  PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -Fc \
    -v \
    --data-only \
    -f "$BACKUP_DIR/data_backup.dump" \
    2>> "$LOG_FILE"

  if [ $? -eq 0 ]; then
    log_success "Data backup created successfully"
    gzip -9 "$BACKUP_DIR/data_backup.dump"
  else
    log_error "Data backup failed"
    exit 1
  fi
}

# ==================================================
# Backup Verification
# ==================================================

verify_backup() {
  log "Verifying backup integrity..."

  # List backup contents
  if [ -f "$BACKUP_DIR/full_backup.dump.gz" ]; then
    gunzip -c "$BACKUP_DIR/full_backup.dump.gz" | pg_restore --list > "$BACKUP_DIR/backup_contents.txt" 2>/dev/null

    if [ $? -eq 0 ]; then
      log_success "Backup verification passed"
    else
      log_error "Backup verification failed"
      exit 1
    fi
  fi

  # Calculate checksums
  cd "$BACKUP_DIR"
  find . -type f -name "*.gz" -o -name "*.txt" | xargs md5sum > checksums.md5
  log_success "Checksums calculated"
}

# ==================================================
# Metadata and Manifest
# ==================================================

create_manifest() {
  log "Creating backup manifest..."

  cat > "$BACKUP_DIR/manifest.json" <<EOF
{
  "backup_timestamp": "$TIMESTAMP",
  "backup_type": "$BACKUP_TYPE",
  "database_name": "$DB_NAME",
  "database_host": "$DB_HOST",
  "database_port": "$DB_PORT",
  "backup_directory": "$BACKUP_DIR",
  "created_by": "${USER:-system}",
  "hostname": "$(hostname)",
  "postgres_version": "$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c 'SELECT version();' | head -1 | xargs)",
  "files": [
$(find "$BACKUP_DIR" -type f -name "*.gz" -o -name "*.txt" -o -name "*.md5" | while read file; do
    filename=$(basename "$file")
    filesize=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    echo "    { \"name\": \"$filename\", \"size\": $filesize },"
done | sed '$ s/,$//')
  ]
}
EOF

  log_success "Manifest created"
}

# ==================================================
# Cleanup Old Backups
# ==================================================

cleanup_old_backups() {
  log "Cleaning up backups older than $RETENTION_DAYS days..."

  find "$BACKUP_ROOT_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \;

  REMAINING_BACKUPS=$(find "$BACKUP_ROOT_DIR" -mindepth 1 -maxdepth 1 -type d | wc -l)
  log_success "Cleanup complete. Remaining backups: $REMAINING_BACKUPS"
}

# ==================================================
# Main Execution
# ==================================================

main() {
  log "============================================"
  log "Starting database backup process"
  log "Backup type: $BACKUP_TYPE"
  log "============================================"

  START_TIME=$(date +%s)

  # Execute backup workflow
  preflight_checks
  collect_statistics

  case "$BACKUP_TYPE" in
    full)
      backup_full
      ;;
    schema-only)
      backup_schema_only
      ;;
    data-only)
      backup_data_only
      ;;
    *)
      log_error "Invalid backup type: $BACKUP_TYPE. Use: full, schema-only, or data-only"
      exit 1
      ;;
  esac

  verify_backup
  create_manifest
  cleanup_old_backups

  # Calculate duration
  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))

  # Final summary
  BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

  log "============================================"
  log_success "Backup completed successfully!"
  log "Backup location: $BACKUP_DIR"
  log "Backup size: $BACKUP_SIZE"
  log "Duration: ${DURATION}s"
  log "============================================"

  # Output backup path for automation
  echo "$BACKUP_DIR"
}

# Execute main function
main
