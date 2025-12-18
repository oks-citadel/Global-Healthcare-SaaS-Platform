#!/bin/bash

#####################################################
# Docker Backup Container Entrypoint
# Unified Healthcare Platform
#
# This script runs as a sidecar container to handle
# automated database backups in containerized
# environments
#####################################################

set -euo pipefail

echo "============================================"
echo "Healthcare Platform - Backup Container"
echo "============================================"

# Configuration from environment
BACKUP_SCHEDULE="${BACKUP_SCHEDULE:-0 2 * * *}"  # Default: 2 AM daily
BACKUP_TYPE="${BACKUP_TYPE:-full}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

# Validate environment
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL environment variable is required"
  exit 1
fi

# Install cron if not present
if ! command -v cron &> /dev/null; then
  apt-get update && apt-get install -y cron
fi

# Create backup directory
mkdir -p "${BACKUP_DIR:-/backups}"

# Create cron job
echo "$BACKUP_SCHEDULE cd /app && bash scripts/backup-database.sh $BACKUP_TYPE >> /var/log/backup.log 2>&1" | crontab -

echo "Backup schedule configured: $BACKUP_SCHEDULE"
echo "Backup type: $BACKUP_TYPE"
echo "Retention: $BACKUP_RETENTION_DAYS days"
echo ""

# Start cron in foreground
echo "Starting backup service..."
cron -f
