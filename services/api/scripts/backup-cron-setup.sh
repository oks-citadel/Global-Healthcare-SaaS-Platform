#!/bin/bash

#####################################################
# Automated Backup Cron Setup Script
# Unified Healthcare Platform
#
# This script sets up automated database backups
# using crontab
#####################################################

set -euo pipefail

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CRON_USER="${CRON_USER:-$(whoami)}"
BACKUP_SCRIPT="$PROJECT_DIR/scripts/backup-database.sh"
LOG_DIR="/var/log/healthcare-db"

# Create log directory
sudo mkdir -p "$LOG_DIR"
sudo chown "$CRON_USER:$CRON_USER" "$LOG_DIR"

echo "============================================"
echo "Database Backup Cron Setup"
echo "============================================"
echo "Project Directory: $PROJECT_DIR"
echo "Cron User: $CRON_USER"
echo "Log Directory: $LOG_DIR"
echo ""

# Verify backup script exists
if [ ! -f "$BACKUP_SCRIPT" ]; then
  echo "ERROR: Backup script not found at: $BACKUP_SCRIPT"
  exit 1
fi

# Make backup script executable
chmod +x "$BACKUP_SCRIPT"

# Create cron jobs
CRON_JOBS=$(cat <<EOF
# Healthcare Platform Database Backups
# Generated on $(date)

# Daily full backup at 2:00 AM
0 2 * * * cd $PROJECT_DIR && bash scripts/backup-database.sh full >> $LOG_DIR/backup.log 2>&1

# Daily schema-only backup at 1:00 AM (for quick restore)
0 1 * * * cd $PROJECT_DIR && bash scripts/backup-database.sh schema-only >> $LOG_DIR/schema-backup.log 2>&1

# Hourly health check
0 * * * * cd $PROJECT_DIR && npm run db:validate >> $LOG_DIR/health-check.log 2>&1

# Weekly cleanup of old logs (Sunday 4:00 AM)
0 4 * * 0 find $LOG_DIR -name "*.log" -mtime +30 -delete

EOF
)

echo "Proposed cron jobs:"
echo "-------------------"
echo "$CRON_JOBS"
echo ""

read -p "Do you want to install these cron jobs? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Installation cancelled."
  exit 0
fi

# Backup existing crontab
crontab -l > /tmp/crontab.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Remove existing healthcare backup jobs
crontab -l 2>/dev/null | grep -v "Healthcare Platform Database Backups" | grep -v "backup-database.sh" | grep -v "db:validate" > /tmp/crontab.tmp || true

# Add new jobs
echo "$CRON_JOBS" >> /tmp/crontab.tmp

# Install new crontab
crontab /tmp/crontab.tmp

# Cleanup
rm /tmp/crontab.tmp

echo ""
echo "============================================"
echo "Cron jobs installed successfully!"
echo "============================================"
echo ""
echo "Installed jobs:"
crontab -l | grep -A 10 "Healthcare Platform"
echo ""
echo "Log files location: $LOG_DIR"
echo "  - backup.log          : Full backup logs"
echo "  - schema-backup.log   : Schema backup logs"
echo "  - health-check.log    : Health check logs"
echo ""
echo "To view logs:"
echo "  tail -f $LOG_DIR/backup.log"
echo ""
echo "To list current cron jobs:"
echo "  crontab -l"
echo ""
echo "To edit cron jobs:"
echo "  crontab -e"
echo ""
echo "Backup schedule:"
echo "  - Daily full backup: 2:00 AM"
echo "  - Daily schema backup: 1:00 AM"
echo "  - Hourly health check: Every hour"
echo "  - Weekly log cleanup: Sunday 4:00 AM"
echo ""
echo "============================================"
