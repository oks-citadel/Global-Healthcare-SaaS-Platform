# Infrastructure Scripts

This directory contains production-ready scripts for database management, monitoring, and automation.

## Available Scripts

### Database Management

#### db-backup.sh
Automated database backup script with encryption, compression, and cloud storage support.

**Features:**
- Full database backups using pg_dump
- Automatic gzip compression
- Optional AES-256-CBC encryption
- Cloud storage upload (Azure/AWS/GCP)
- Backup verification with checksums
- Configurable retention policies
- Email and webhook notifications
- Comprehensive logging

**Usage:**
```bash
# Manual backup
./db-backup.sh

# Scheduled backup (via cron)
0 2 * * * /path/to/db-backup.sh

# Configuration via environment variables
BACKUP_ENCRYPTION_KEY="your-key" ./db-backup.sh
```

**Configuration:**
See `.env` file for configuration options:
- `BACKUP_DIR` - Local backup directory
- `BACKUP_RETENTION_DAYS` - Days to keep backups
- `BACKUP_ENCRYPTION_KEY` - Encryption key
- `CLOUD_STORAGE_ENABLED` - Enable cloud upload
- `NOTIFICATION_ENABLED` - Enable notifications

#### db-restore.sh
Database restore script with verification and safety features.

**Features:**
- Interactive backup selection
- Pre-restore safety backup
- Test restore to temporary database
- Automatic decryption and decompression
- Backup integrity verification
- User confirmation prompts
- Cloud storage download support
- Rollback capabilities

**Usage:**
```bash
# Interactive restore
./db-restore.sh

# Restore specific backup
./db-restore.sh --file backup_20240101_020000.sql.gz

# Non-interactive (automation)
./db-restore.sh --file backup.sql.gz --no-confirm --no-test

# Options:
#   --file BACKUP_FILE   Specify backup file
#   --no-confirm         Skip confirmation prompt
#   --no-test           Skip test restore
#   --no-backup         Skip pre-restore backup
#   --help              Show help message
```

**Safety Features:**
- Creates backup before restore
- Tests restore in temporary database
- Requires explicit confirmation
- Verifies backup checksums
- Comprehensive error handling

#### db-monitor.sh
Comprehensive database performance monitoring and analysis script.

**Features:**
- Connection pool status
- Slow query analysis
- Missing/unused index detection
- Table bloat monitoring
- Lock and blocking query detection
- Cache hit ratio tracking
- Database size reporting
- Transaction statistics
- Replication status monitoring
- Performance recommendations
- Prometheus metrics export

**Usage:**
```bash
# Run monitoring report
./db-monitor.sh

# View report
cat ../monitoring/database/reports/performance_report_*.txt

# View Prometheus metrics
cat ../monitoring/database/metrics/metrics_*.prom
```

**Output:**
- Performance reports in `../monitoring/database/reports/`
- Prometheus metrics in `../monitoring/database/metrics/`
- Detailed analysis of database health

### Automation

#### crontab.example
Example cron job configurations for automated database operations.

**Includes:**
- Daily backup schedules
- Performance monitoring
- Database maintenance tasks
- Cleanup operations
- Health check automation

**Installation:**
```bash
# Copy and customize
cp crontab.example crontab.local

# Edit for your environment
vim crontab.local

# Install
crontab crontab.local

# Verify
crontab -l
```

## Prerequisites

### Required Tools:
- PostgreSQL client tools (psql, pg_dump)
- bash shell
- gzip (compression)

### Optional Tools:
- openssl (encryption)
- az CLI (Azure storage)
- aws CLI (AWS S3)
- gsutil (Google Cloud Storage)
- mail (email notifications)
- curl (webhook notifications)

### PostgreSQL Extensions:
```sql
-- For query monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- For UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Configuration

### Environment Variables

All scripts read configuration from `services/api/.env`:

```env
# Database connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unified_health_dev
DB_USER=unified_health
DB_PASSWORD=password

# Backup settings
BACKUP_DIR=./infrastructure/backups/database
BACKUP_RETENTION_DAYS=30
BACKUP_ENCRYPTION_KEY=your-secure-key
BACKUP_COMPRESSION=gzip

# Cloud storage (optional)
CLOUD_STORAGE_ENABLED=false
CLOUD_STORAGE_PROVIDER=azure
AZURE_STORAGE_ACCOUNT=
AZURE_STORAGE_CONTAINER=database-backups

# Notifications (optional)
NOTIFICATION_ENABLED=false
NOTIFICATION_EMAIL=ops@example.com
NOTIFICATION_WEBHOOK=your-slack-webhook-url

# Monitoring
OUTPUT_DIR=./infrastructure/monitoring/database
SLOW_QUERY_THRESHOLD=1000
```

### File Permissions

Scripts should be executable:

```bash
chmod +x db-backup.sh
chmod +x db-restore.sh
chmod +x db-monitor.sh
chmod 600 crontab.example
```

## Directory Structure

```
infrastructure/
├── scripts/
│   ├── README.md (this file)
│   ├── db-backup.sh
│   ├── db-restore.sh
│   ├── db-monitor.sh
│   ├── crontab.example
│   └── deploy-acr.sh
├── backups/
│   └── database/
│       ├── full/         # Full backups
│       ├── metadata/     # Backup metadata (JSON)
│       └── logs/         # Backup logs
└── monitoring/
    └── database/
        ├── reports/      # Performance reports
        ├── queries/      # Query analysis
        └── metrics/      # Prometheus metrics
```

## Common Operations

### Daily Operations

```bash
# Check backup completion
ls -lh ../backups/database/full/

# Review latest backup log
tail -f ../backups/database/logs/backup_*.log

# Run performance check
./db-monitor.sh

# View connection status
psql -U user -d dbname -c "
  SELECT state, COUNT(*)
  FROM pg_stat_activity
  GROUP BY state;"
```

### Weekly Maintenance

```bash
# Full performance analysis
./db-monitor.sh

# Review slow queries
cat ../monitoring/database/reports/performance_report_*.txt | grep -A 20 "Slow Queries"

# Check table bloat
psql -U user -d dbname -c "
  SELECT schemaname, tablename, n_dead_tup
  FROM pg_stat_user_tables
  WHERE n_dead_tup > 1000
  ORDER BY n_dead_tup DESC;"

# Test backup restore (on staging)
./db-restore.sh --file latest-backup.sql.gz --no-confirm
```

### Monthly Tasks

```bash
# Analyze query patterns
./db-monitor.sh

# Review index usage
psql -U user -d dbname -c "
  SELECT schemaname, tablename, indexname, idx_scan
  FROM pg_stat_user_indexes
  WHERE idx_scan = 0
  ORDER BY pg_relation_size(indexrelid) DESC;"

# Check database size growth
psql -U user -d dbname -c "
  SELECT pg_size_pretty(pg_database_size('dbname'));"

# Update documentation if needed
```

## Automation Best Practices

### Backup Strategy

**Development:**
- Daily backups at 2 AM
- 7-day retention
- Local storage only

**Staging:**
- Daily backups at 2 AM
- 14-day retention
- Cloud storage recommended
- Weekly test restores

**Production:**
- Hourly backups
- Multiple retention tiers:
  - Hourly: 24-hour retention
  - Daily: 30-day retention
  - Weekly: 90-day retention
- Cloud storage mandatory
- Encryption required
- Automated notifications
- Regular restore testing

### Monitoring Schedule

**Development:**
- Weekly performance reports
- Manual monitoring as needed

**Staging:**
- Daily performance reports
- Weekly detailed analysis

**Production:**
- Hourly health checks
- Daily performance reports
- Weekly detailed analysis
- Real-time alerting for issues
- Automated metric collection

### Maintenance Schedule

```bash
# Daily (3 AM)
0 3 * * * psql -c "ANALYZE;" >> /var/log/db-analyze.log

# Daily (4 AM)
0 4 * * * psql -c "VACUUM ANALYZE;" >> /var/log/db-vacuum.log

# Weekly (Sunday 5 AM)
0 5 * * 0 psql -c "REINDEX DATABASE dbname;" >> /var/log/db-reindex.log
```

## Troubleshooting

### Backup Issues

**Problem:** Backup fails with connection error
```bash
# Solution: Check database connectivity
psql -U user -d dbname -c "SELECT 1;"

# Check PostgreSQL status
systemctl status postgresql

# Review backup logs
tail -100 ../backups/database/logs/backup_*.log
```

**Problem:** Backup too large
```bash
# Solution: Check database size and bloat
./db-monitor.sh | grep -A 10 "Database Size"

# Run vacuum to reduce bloat
psql -U user -d dbname -c "VACUUM FULL ANALYZE;"
```

### Restore Issues

**Problem:** Restore fails with checksum error
```bash
# Solution: Verify backup integrity
sha256sum backup_file.sql.gz

# Compare with metadata
cat ../backups/database/metadata/backup_*.json
```

**Problem:** Out of disk space during restore
```bash
# Solution: Check available space
df -h

# Clean up old backups
find ../backups/database/full -mtime +30 -delete
```

### Monitoring Issues

**Problem:** No slow queries shown
```bash
# Solution: Enable pg_stat_statements
psql -U user -d dbname -c "CREATE EXTENSION pg_stat_statements;"

# Add to postgresql.conf:
# shared_preload_libraries = 'pg_stat_statements'

# Restart PostgreSQL
systemctl restart postgresql
```

**Problem:** High connection count
```bash
# Solution: Terminate idle connections
psql -U user -d dbname -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE state = 'idle'
    AND state_change < now() - interval '1 hour';"
```

## Security Considerations

### Backup Security
- Use strong encryption keys (32+ characters)
- Rotate encryption keys regularly
- Secure backup storage locations
- Restrict backup file permissions (chmod 600)
- Use secure cloud storage with IAM roles
- Enable versioning on cloud storage

### Script Security
- Protect script permissions (chmod 700)
- Use environment variables for credentials
- Never hardcode passwords in scripts
- Secure .env file permissions (chmod 600)
- Use IAM roles instead of access keys when possible
- Audit script execution logs

### Database Security
- Use SSL/TLS for database connections
- Implement least-privilege database users
- Rotate database passwords regularly
- Enable PostgreSQL audit logging
- Monitor for suspicious activity
- Regular security updates

## Performance Optimization

### Connection Pool Tuning

Based on monitoring results:
```env
# Light load (< 100 req/min)
DB_CONNECTION_LIMIT=5

# Medium load (100-1000 req/min)
DB_CONNECTION_LIMIT=10

# Heavy load (> 1000 req/min)
DB_CONNECTION_LIMIT=20
```

### Query Optimization

Use monitoring reports to identify:
- Slow queries needing optimization
- Missing indexes for frequent queries
- Unused indexes consuming resources
- Tables needing VACUUM

### Database Maintenance

Regular maintenance improves performance:
```bash
# Daily analysis
ANALYZE;

# Weekly vacuum
VACUUM ANALYZE;

# Monthly reindex (during low traffic)
REINDEX DATABASE dbname;
```

## Additional Resources

- [Database Configuration Guide](../../services/api/DATABASE_CONFIGURATION.md)
- [Database Quick Start](../../services/api/DATABASE_QUICKSTART.md)
- [Implementation Summary](../../DATABASE_IMPLEMENTATION_SUMMARY.md)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)

## Support

For issues or questions:
1. Check script logs in `../backups/database/logs/`
2. Review monitoring reports in `../monitoring/database/reports/`
3. Check database logs
4. Review documentation files
5. Contact database administrator

## Contributing

When adding new scripts:
1. Follow existing naming conventions
2. Include comprehensive error handling
3. Add logging functionality
4. Document all configuration options
5. Update this README
6. Test thoroughly before deployment
