# Database Setup Checklist

Use this checklist to set up production-ready database configuration, backup/restore system, and performance monitoring.

## Prerequisites

### System Requirements
- [ ] PostgreSQL 12+ installed and running
- [ ] Node.js 18+ installed
- [ ] bash shell available
- [ ] psql and pg_dump tools available
- [ ] gzip installed (for compression)
- [ ] openssl installed (for encryption, optional)

### Cloud Storage (Optional)
- [ ] Azure CLI installed (if using Azure Storage)
- [ ] AWS CLI installed (if using AWS S3)
- [ ] gsutil installed (if using Google Cloud Storage)

### Notification Tools (Optional)
- [ ] mail command available (for email notifications)
- [ ] curl installed (for webhook notifications)

## Phase 1: Initial Configuration

### 1.1 PostgreSQL Setup
- [ ] Enable pg_stat_statements extension
  ```sql
  CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```
- [ ] Configure postgresql.conf for production
  ```ini
  shared_preload_libraries = 'pg_stat_statements'
  pg_stat_statements.track = all
  log_min_duration_statement = 1000
  ```
- [ ] Restart PostgreSQL
  ```bash
  systemctl restart postgresql
  ```

### 1.2 Environment Configuration
- [ ] Navigate to API service directory
  ```bash
  cd services/api
  ```
- [ ] Copy environment example
  ```bash
  cp .env.example .env
  ```
- [ ] Configure database connection in .env
  ```env
  DATABASE_URL=postgresql://user:password@host:5432/dbname?connection_limit=10&pool_timeout=10
  DIRECT_DATABASE_URL=postgresql://user:password@host:5432/dbname
  ```
- [ ] Set connection pool parameters
  ```env
  DB_CONNECTION_LIMIT=10
  DB_POOL_TIMEOUT=10
  DB_CONNECT_TIMEOUT=5
  DB_SOCKET_TIMEOUT=60
  DB_QUERY_TIMEOUT=30000
  DB_SLOW_QUERY_THRESHOLD=1000
  ```
- [ ] Configure retry settings
  ```env
  DB_MAX_RETRIES=3
  DB_RETRY_DELAY=1000
  DB_RETRY_BACKOFF=2
  DB_HEALTH_CHECK_INTERVAL=30000
  ```

### 1.3 Backup Configuration
- [ ] Set database credentials for backup scripts
  ```env
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=unified_health_prod
  DB_USER=unified_health
  ```
- [ ] Configure backup settings
  ```env
  BACKUP_DIR=./infrastructure/backups/database
  BACKUP_RETENTION_DAYS=30
  BACKUP_COMPRESSION=gzip
  ```
- [ ] Generate and set encryption key (IMPORTANT!)
  ```bash
  # Generate strong encryption key
  openssl rand -base64 32
  ```
  ```env
  BACKUP_ENCRYPTION_KEY=your-generated-key-here
  ```

### 1.4 Cloud Storage Configuration (Optional)
- [ ] Choose cloud provider (azure/aws/gcp)
- [ ] For Azure:
  ```env
  CLOUD_STORAGE_ENABLED=true
  CLOUD_STORAGE_PROVIDER=azure
  AZURE_STORAGE_ACCOUNT=mystorageaccount
  AZURE_STORAGE_CONTAINER=database-backups
  ```
- [ ] For AWS:
  ```env
  CLOUD_STORAGE_ENABLED=true
  CLOUD_STORAGE_PROVIDER=aws
  AWS_S3_BUCKET=my-backup-bucket
  ```
- [ ] For GCP:
  ```env
  CLOUD_STORAGE_ENABLED=true
  CLOUD_STORAGE_PROVIDER=gcp
  GCP_BUCKET=my-backup-bucket
  ```
- [ ] Test cloud storage authentication
  ```bash
  # Azure
  az storage account show --name mystorageaccount
  # AWS
  aws s3 ls s3://my-backup-bucket
  # GCP
  gsutil ls gs://my-backup-bucket
  ```

### 1.5 Notification Configuration (Optional)
- [ ] Enable notifications
  ```env
  NOTIFICATION_ENABLED=true
  NOTIFICATION_EMAIL=ops@example.com
  NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/xxx
  ```
- [ ] Test email notifications
  ```bash
  echo "Test" | mail -s "Test Email" ops@example.com
  ```
- [ ] Test webhook notifications
  ```bash
  curl -X POST $NOTIFICATION_WEBHOOK \
    -H "Content-Type: application/json" \
    -d '{"text":"Test notification"}'
  ```

## Phase 2: Database Migration and Setup

### 2.1 Prisma Setup
- [ ] Install dependencies
  ```bash
  npm install
  ```
- [ ] Generate Prisma client
  ```bash
  npm run prisma:generate
  ```
- [ ] Run database migrations
  ```bash
  npm run prisma:migrate deploy
  ```
- [ ] Verify database schema
  ```bash
  psql -U user -d dbname -c "\dt"
  ```

### 2.2 Application Integration
- [ ] Update application code to use DatabaseManager
  ```typescript
  import { initializeDatabaseManager } from './lib/database';
  const dbManager = initializeDatabaseManager();
  await dbManager.connect();
  ```
- [ ] Add health check endpoint
  ```typescript
  app.get('/health/database', async (req, res) => {
    const health = await dbManager.checkHealth();
    res.json(health);
  });
  ```
- [ ] Add metrics endpoint
  ```typescript
  app.get('/metrics/database', async (req, res) => {
    const metrics = dbManager.getMetrics();
    res.json(metrics);
  });
  ```
- [ ] Test application startup
  ```bash
  npm run dev
  ```
- [ ] Verify database connection
  ```bash
  curl http://localhost:8080/health/database
  ```

## Phase 3: Backup System Setup

### 3.1 Directory Setup
- [ ] Create backup directories
  ```bash
  mkdir -p infrastructure/backups/database/{full,metadata,logs}
  mkdir -p infrastructure/monitoring/database/{reports,queries,metrics}
  ```
- [ ] Set proper permissions
  ```bash
  chmod 700 infrastructure/backups
  chmod 700 infrastructure/scripts/*.sh
  chmod 600 .env
  ```

### 3.2 Manual Backup Test
- [ ] Run first backup manually
  ```bash
  ./infrastructure/scripts/db-backup.sh
  ```
- [ ] Verify backup creation
  ```bash
  ls -lh infrastructure/backups/database/full/
  ```
- [ ] Check backup log
  ```bash
  tail -f infrastructure/backups/database/logs/backup_*.log
  ```
- [ ] Verify backup metadata
  ```bash
  cat infrastructure/backups/database/metadata/backup_*.json
  ```
- [ ] If cloud storage enabled, verify upload
  ```bash
  # Azure
  az storage blob list --account-name $AZURE_STORAGE_ACCOUNT --container-name $AZURE_STORAGE_CONTAINER
  # AWS
  aws s3 ls s3://$AWS_S3_BUCKET/
  # GCP
  gsutil ls gs://$GCP_BUCKET/
  ```

### 3.3 Restore Test (Staging Only)
- [ ] Create test database
  ```bash
  psql -U user -d postgres -c "CREATE DATABASE test_restore;"
  ```
- [ ] Test restore to test database
  ```bash
  DB_NAME=test_restore ./infrastructure/scripts/db-restore.sh
  ```
- [ ] Verify restore success
  ```bash
  psql -U user -d test_restore -c "\dt"
  psql -U user -d test_restore -c "SELECT COUNT(*) FROM \"User\";"
  ```
- [ ] Clean up test database
  ```bash
  psql -U user -d postgres -c "DROP DATABASE test_restore;"
  ```

### 3.4 Automated Backup Schedule
- [ ] Copy crontab example
  ```bash
  cp infrastructure/scripts/crontab.example infrastructure/scripts/crontab.local
  ```
- [ ] Edit crontab with correct paths
  ```bash
  vim infrastructure/scripts/crontab.local
  # Update PROJECT_DIR to absolute path
  ```
- [ ] Set backup schedule (production recommendation)
  ```cron
  # Hourly backups
  0 * * * * /path/to/db-backup.sh

  # Daily backups at 2 AM
  0 2 * * * /path/to/db-backup.sh
  ```
- [ ] Install crontab
  ```bash
  crontab infrastructure/scripts/crontab.local
  ```
- [ ] Verify crontab installation
  ```bash
  crontab -l
  ```
- [ ] Wait for first scheduled backup and verify
  ```bash
  # Check next backup in cron logs
  grep CRON /var/log/syslog | tail
  ```

## Phase 4: Performance Monitoring Setup

### 4.1 Initial Monitoring
- [ ] Run initial monitoring report
  ```bash
  ./infrastructure/scripts/db-monitor.sh
  ```
- [ ] Review performance report
  ```bash
  cat infrastructure/monitoring/database/reports/performance_report_*.txt
  ```
- [ ] Check for immediate issues:
  - [ ] Connection pool usage < 80%
  - [ ] Cache hit ratio > 99%
  - [ ] No slow queries > 1000ms
  - [ ] No unused indexes
  - [ ] Table bloat < 20%

### 4.2 Optimize Based on Findings
- [ ] Add missing indexes if identified
  ```sql
  CREATE INDEX idx_name ON table_name (column_name);
  ```
- [ ] Remove unused indexes if safe
  ```sql
  DROP INDEX IF EXISTS unused_index_name;
  ```
- [ ] Run VACUUM on bloated tables
  ```sql
  VACUUM ANALYZE table_name;
  ```
- [ ] Adjust connection pool if needed
  ```env
  DB_CONNECTION_LIMIT=20  # Increase if pool exhausted
  ```

### 4.3 Schedule Monitoring
- [ ] Add monitoring to crontab
  ```cron
  # Daily monitoring at 9 AM
  0 9 * * * /path/to/db-monitor.sh

  # Weekly detailed monitoring on Monday
  0 8 * * 1 /path/to/db-monitor.sh
  ```
- [ ] Set up monitoring alerts (optional)
  ```bash
  # Add to crontab for critical alerts
  0 * * * * /path/to/check-critical-metrics.sh
  ```

### 4.4 Prometheus Integration (Optional)
- [ ] Configure Prometheus to scrape metrics
  ```yaml
  # prometheus.yml
  scrape_configs:
    - job_name: 'postgres'
      file_sd_configs:
        - files:
          - '/path/to/infrastructure/monitoring/database/metrics/*.prom'
  ```
- [ ] Verify metrics collection
  ```bash
  cat infrastructure/monitoring/database/metrics/metrics_*.prom
  ```

## Phase 5: Production Deployment

### 5.1 Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Backups running successfully
- [ ] Monitoring reports generated
- [ ] Cloud storage working (if enabled)
- [ ] Notifications working (if enabled)
- [ ] Documentation reviewed
- [ ] Emergency procedures documented

### 5.2 Production Configuration
- [ ] Review and adjust connection pool for production load
  ```env
  DB_CONNECTION_LIMIT=15  # Based on expected load
  ```
- [ ] Enable read replica if available
  ```env
  DB_READ_REPLICA_URL=postgresql://user:pass@replica:5432/db
  ```
- [ ] Set production-appropriate timeouts
  ```env
  DB_QUERY_TIMEOUT=30000
  DB_SLOW_QUERY_THRESHOLD=1000
  ```
- [ ] Enable cloud backups
  ```env
  CLOUD_STORAGE_ENABLED=true
  ```
- [ ] Enable notifications
  ```env
  NOTIFICATION_ENABLED=true
  ```

### 5.3 PostgreSQL Production Tuning
- [ ] Update postgresql.conf
  ```ini
  shared_buffers = 256MB
  effective_cache_size = 768MB
  work_mem = 16MB
  maintenance_work_mem = 128MB
  max_connections = 100
  wal_level = replica
  max_wal_size = 1GB
  ```
- [ ] Restart PostgreSQL
  ```bash
  systemctl restart postgresql
  ```
- [ ] Verify configuration
  ```bash
  psql -U user -d dbname -c "SHOW ALL;"
  ```

### 5.4 Deployment
- [ ] Deploy application with new database manager
- [ ] Monitor application logs for database errors
- [ ] Check health endpoint
  ```bash
  curl https://api.example.com/health/database
  ```
- [ ] Verify metrics endpoint
  ```bash
  curl https://api.example.com/metrics/database
  ```
- [ ] Monitor connection pool usage
- [ ] Verify backup runs successfully

## Phase 6: Post-Deployment Monitoring

### 6.1 First 24 Hours
- [ ] Monitor application logs continuously
- [ ] Check connection pool metrics every hour
- [ ] Verify backup completion
- [ ] Review slow query logs
- [ ] Monitor database CPU/memory usage
- [ ] Check for any errors in backup logs

### 6.2 First Week
- [ ] Daily monitoring reports review
- [ ] Verify all scheduled backups running
- [ ] Test restore procedure once
- [ ] Review and tune connection pool if needed
- [ ] Check table bloat trends
- [ ] Monitor cache hit ratio
- [ ] Review slow queries and optimize

### 6.3 First Month
- [ ] Weekly detailed performance analysis
- [ ] Review backup retention and adjust if needed
- [ ] Test full disaster recovery procedure
- [ ] Analyze query patterns and add indexes
- [ ] Review and update documentation
- [ ] Train team on operations procedures

## Phase 7: Ongoing Maintenance

### 7.1 Daily Tasks
- [ ] Check backup completion
  ```bash
  ls -lh infrastructure/backups/database/full/ | tail -5
  ```
- [ ] Review application logs for database errors
- [ ] Monitor connection pool metrics
  ```bash
  curl http://localhost:8080/metrics/database
  ```

### 7.2 Weekly Tasks
- [ ] Run performance monitoring
  ```bash
  ./infrastructure/scripts/db-monitor.sh
  ```
- [ ] Review slow query report
- [ ] Check table bloat
- [ ] Verify backup uploads to cloud
- [ ] Test restore on staging environment

### 7.3 Monthly Tasks
- [ ] Detailed performance analysis
- [ ] Review and optimize indexes
- [ ] Analyze query patterns
- [ ] Review backup storage usage
- [ ] Test full disaster recovery
- [ ] Update capacity planning

### 7.4 Quarterly Tasks
- [ ] Review and update configurations
- [ ] Rotate encryption keys
- [ ] Review access controls
- [ ] Update documentation
- [ ] Train new team members
- [ ] Review and test emergency procedures

## Emergency Procedures

### Database Connection Issues
1. [ ] Check PostgreSQL status: `systemctl status postgresql`
2. [ ] Review PostgreSQL logs: `tail -100 /var/log/postgresql/*.log`
3. [ ] Check connection count: See troubleshooting section
4. [ ] Restart PostgreSQL if needed: `systemctl restart postgresql`
5. [ ] Notify team if issue persists

### Backup Failures
1. [ ] Check backup logs: `tail -100 infrastructure/backups/database/logs/*.log`
2. [ ] Verify disk space: `df -h`
3. [ ] Check database connectivity
4. [ ] Verify cloud storage credentials
5. [ ] Run manual backup: `./infrastructure/scripts/db-backup.sh`
6. [ ] Escalate if unresolved

### Performance Issues
1. [ ] Run monitoring report: `./infrastructure/scripts/db-monitor.sh`
2. [ ] Check connection pool usage
3. [ ] Review slow queries
4. [ ] Check for blocking queries
5. [ ] Consider increasing resources
6. [ ] Analyze and optimize queries

### Data Corruption
1. [ ] Stop application immediately
2. [ ] Create emergency backup
3. [ ] Assess extent of corruption
4. [ ] Restore from last known good backup
5. [ ] Verify data integrity
6. [ ] Investigate root cause
7. [ ] Document incident

## Documentation and Training

### Documentation Review
- [ ] Read DATABASE_CONFIGURATION.md
- [ ] Read DATABASE_QUICKSTART.md
- [ ] Read DATABASE_IMPLEMENTATION_SUMMARY.md
- [ ] Read infrastructure/scripts/README.md
- [ ] Bookmark important sections

### Team Training
- [ ] Train on backup procedures
- [ ] Train on restore procedures
- [ ] Train on monitoring reports
- [ ] Train on emergency procedures
- [ ] Document team responsibilities
- [ ] Schedule regular drills

## Validation

### Final Validation Checklist
- [ ] Database connection working
- [ ] Connection pool configured correctly
- [ ] Health checks returning success
- [ ] Metrics being collected
- [ ] Backups running automatically
- [ ] Backups uploading to cloud (if enabled)
- [ ] Notifications working (if enabled)
- [ ] Monitoring reports generated
- [ ] Test restore successful
- [ ] Documentation complete
- [ ] Team trained
- [ ] Emergency procedures tested

## Success Criteria

You have successfully completed the database setup when:
- [ ] All items in this checklist are completed
- [ ] Application runs without database errors for 24 hours
- [ ] Automated backups run successfully
- [ ] Test restore completes without errors
- [ ] Monitoring reports show healthy metrics
- [ ] Team can perform basic operations
- [ ] Emergency procedures documented and tested

## Support Resources

- Documentation: `services/api/DATABASE_CONFIGURATION.md`
- Quick Reference: `services/api/DATABASE_QUICKSTART.md`
- Scripts README: `infrastructure/scripts/README.md`
- Implementation Summary: `DATABASE_IMPLEMENTATION_SUMMARY.md`

## Notes

Use this space to track custom configurations, issues encountered, and their resolutions:

```
Date: _______________
Configuration Changes:


Issues Encountered:


Resolutions:


Additional Notes:


```

---

**Completed By:** _______________
**Date:** _______________
**Reviewed By:** _______________
**Date:** _______________
