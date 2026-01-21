#!/bin/bash

#####################################################
# Database Restore Script
# Unified Health Platform
#
# This script restores PostgreSQL database from
# backup files with safety checks
#####################################################

set -euo pipefail

# ==================================================
# Configuration
# ==================================================

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Database configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-healthcare_db}"
DB_USER="${DB_USER:-postgres}"

# Backup location (pass as first argument)
BACKUP_PATH="${1:-}"
LOG_FILE="restore_$(date +%Y%m%d_%H%M%S).log"

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
# Validation Functions
# ==================================================

validate_backup() {
  log "Validating backup file..."

  if [ -z "$BACKUP_PATH" ]; then
    log_error "No backup path provided"
    echo "Usage: $0 <backup_directory_or_file>"
    exit 1
  fi

  if [ ! -e "$BACKUP_PATH" ]; then
    log_error "Backup path does not exist: $BACKUP_PATH"
    exit 1
  fi

  # If directory provided, find the backup file
  if [ -d "$BACKUP_PATH" ]; then
    BACKUP_FILE=$(find "$BACKUP_PATH" -name "full_backup.dump.gz" -o -name "full_backup.dump" | head -1)
    if [ -z "$BACKUP_FILE" ]; then
      log_error "No backup file found in directory: $BACKUP_PATH"
      exit 1
    fi
  else
    BACKUP_FILE="$BACKUP_PATH"
  fi

  log_success "Backup file found: $BACKUP_FILE"
}

confirm_restore() {
  log "============================================"
  log "WARNING: Database Restore Operation"
  log "============================================"
  log "Database: $DB_NAME"
  log "Host: $DB_HOST"
  log "Backup: $BACKUP_FILE"
  log ""
  log "This will:"
  log "  1. Drop the existing database"
  log "  2. Create a new empty database"
  log "  3. Restore from backup"
  log ""
  log "⚠️  ALL CURRENT DATA WILL BE LOST! ⚠️"
  log "============================================"

  read -p "Are you sure you want to proceed? (type 'yes' to confirm): " confirmation

  if [ "$confirmation" != "yes" ]; then
    log "Restore cancelled by user"
    exit 0
  fi

  log "User confirmed. Proceeding with restore..."
}

# ==================================================
# Pre-restore Backup
# ==================================================

create_pre_restore_backup() {
  log "Creating pre-restore backup as safety measure..."

  PRE_RESTORE_DIR="/tmp/pre_restore_backup_$(date +%Y%m%d_%H%M%S)"
  mkdir -p "$PRE_RESTORE_DIR"

  PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -Fc \
    -f "$PRE_RESTORE_DIR/pre_restore_backup.dump" \
    2>> "$LOG_FILE" || {
      log "Warning: Could not create pre-restore backup (database may not exist)"
    }

  log_success "Pre-restore backup created at: $PRE_RESTORE_DIR"
}

# ==================================================
# Restore Functions
# ==================================================

terminate_connections() {
  log "Terminating active database connections..."

  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = '$DB_NAME'
      AND pid <> pg_backend_pid();
  " >> "$LOG_FILE" 2>&1

  log_success "Active connections terminated"
}

drop_database() {
  log "Dropping existing database..."

  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "
    DROP DATABASE IF EXISTS \"$DB_NAME\";
  " >> "$LOG_FILE" 2>&1

  if [ $? -eq 0 ]; then
    log_success "Database dropped"
  else
    log_error "Failed to drop database"
    exit 1
  fi
}

create_database() {
  log "Creating new database..."

  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "
    CREATE DATABASE \"$DB_NAME\"
      WITH ENCODING='UTF8'
      LC_COLLATE='en_US.UTF-8'
      LC_CTYPE='en_US.UTF-8'
      TEMPLATE=template0;
  " >> "$LOG_FILE" 2>&1

  if [ $? -eq 0 ]; then
    log_success "Database created"
  else
    log_error "Failed to create database"
    exit 1
  fi
}

restore_from_backup() {
  log "Restoring from backup..."

  # Decompress if needed
  if [[ "$BACKUP_FILE" == *.gz ]]; then
    log "Decompressing backup file..."
    DECOMPRESSED_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$BACKUP_FILE" > "$DECOMPRESSED_FILE"
    RESTORE_FILE="$DECOMPRESSED_FILE"
  else
    RESTORE_FILE="$BACKUP_FILE"
  fi

  # Restore database
  PGPASSWORD="$DB_PASSWORD" pg_restore \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -v \
    --no-owner \
    --no-acl \
    "$RESTORE_FILE" \
    2>> "$LOG_FILE"

  if [ $? -eq 0 ]; then
    log_success "Database restored successfully"
  else
    log_error "Database restore failed. Check log file: $LOG_FILE"
    exit 1
  fi

  # Cleanup decompressed file if created
  if [[ "$BACKUP_FILE" == *.gz ]]; then
    rm -f "$DECOMPRESSED_FILE"
  fi
}

# ==================================================
# Post-restore Validation
# ==================================================

validate_restore() {
  log "Validating restored database..."

  # Check if database exists and is accessible
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\dt' >> "$LOG_FILE" 2>&1

  if [ $? -eq 0 ]; then
    log_success "Database is accessible"
  else
    log_error "Database validation failed"
    exit 1
  fi

  # Get table counts
  log "Database statistics:"
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT
      schemaname,
      COUNT(*) as table_count
    FROM pg_tables
    WHERE schemaname = 'public'
    GROUP BY schemaname;
  " | tee -a "$LOG_FILE"

  # Get row counts for main tables
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT
      'User' as table_name,
      COUNT(*) as row_count
    FROM \"User\"
    UNION ALL
    SELECT 'Patient', COUNT(*) FROM \"Patient\"
    UNION ALL
    SELECT 'Provider', COUNT(*) FROM \"Provider\"
    UNION ALL
    SELECT 'Appointment', COUNT(*) FROM \"Appointment\";
  " | tee -a "$LOG_FILE"

  log_success "Validation complete"
}

analyze_database() {
  log "Analyzing database for optimization..."

  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "ANALYZE;" >> "$LOG_FILE" 2>&1

  log_success "Database analyzed"
}

# ==================================================
# Main Execution
# ==================================================

main() {
  log "============================================"
  log "Starting database restore process"
  log "============================================"

  START_TIME=$(date +%s)

  # Execute restore workflow
  validate_backup
  confirm_restore
  create_pre_restore_backup
  terminate_connections
  drop_database
  create_database
  restore_from_backup
  validate_restore
  analyze_database

  # Calculate duration
  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))

  log "============================================"
  log_success "Restore completed successfully!"
  log "Duration: ${DURATION}s"
  log "Log file: $LOG_FILE"
  log "============================================"
  log ""
  log "Next steps:"
  log "  1. Run application health checks"
  log "  2. Verify critical data"
  log "  3. Test application functionality"
  log "  4. Check Prisma migrations status: npx prisma migrate status"
}

# Execute main function
main
