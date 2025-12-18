# Database Quick Start Guide

Quick reference for common database operations and maintenance tasks.

## Table of Contents

- [Initial Setup](#initial-setup)
- [Daily Operations](#daily-operations)
- [Backup Operations](#backup-operations)
- [Restore Operations](#restore-operations)
- [Performance Monitoring](#performance-monitoring)
- [Common Commands](#common-commands)

## Initial Setup

### 1. Configure Environment Variables

Copy and configure environment file:

```bash
cd services/api
cp .env.example .env
```

Edit `.env` and set database configuration:

```env
# Basic configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname?connection_limit=10&pool_timeout=10
DIRECT_DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Connection pool (adjust based on load)
DB_CONNECTION_LIMIT=10
DB_POOL_TIMEOUT=10
DB_QUERY_TIMEOUT=30000

# Backup configuration
BACKUP_DIR=./infrastructure/backups/database
BACKUP_RETENTION_DAYS=30
BACKUP_ENCRYPTION_KEY=your-secure-encryption-key
```

### 2. Enable PostgreSQL Extensions

```sql
-- Connect to your database
psql -U user -d dbname

-- Enable query statistics
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Enable UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 3. Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npm run prisma:seed
```

### 4. Initialize Database Manager

In your application code:

```typescript
import { initializeDatabaseManager } from './lib/database';

// At application startup
const dbManager = initializeDatabaseManager();
await dbManager.connect();

// At application shutdown
process.on('SIGTERM', async () => {
  await dbManager.disconnect();
  process.exit(0);
});
```

## Daily Operations

### Check Database Health

```typescript
import { getDatabaseManager } from './lib/database';

const manager = getDatabaseManager();
const health = await manager.checkHealth();

if (!health.healthy) {
  console.error('Database unhealthy:', health.error);
}
```

### Get Connection Metrics

```typescript
const metrics = manager.getMetrics();
console.log('Active connections:', metrics.activeConnections);
console.log('Slow queries:', metrics.slowQueries);
console.log('Average query time:', metrics.averageQueryTime, 'ms');
```

### Execute Queries with Retry

```typescript
// Write operation
const user = await manager.executeWithRetry(
  async (client) => {
    return await client.user.create({
      data: { email, password, firstName, lastName },
    });
  },
  false // write operation
);

// Read operation (uses replica if configured)
const users = await manager.executeWithRetry(
  async (client) => {
    return await client.user.findMany();
  },
  true // read operation
);
```

## Backup Operations

### Manual Backup

```bash
# Create backup now
./infrastructure/scripts/db-backup.sh

# Check backup status
ls -lh infrastructure/backups/database/full/

# View backup logs
tail -f infrastructure/backups/database/logs/backup_*.log
```

### Schedule Automated Backups

Add to crontab:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/infrastructure/scripts/db-backup.sh >> /var/log/db-backup.log 2>&1

# Add hourly backup (production)
0 * * * * /path/to/infrastructure/scripts/db-backup.sh >> /var/log/db-backup.log 2>&1
```

### Configure Cloud Backup

Enable cloud storage in `.env`:

```env
# Azure example
CLOUD_STORAGE_ENABLED=true
CLOUD_STORAGE_PROVIDER=azure
AZURE_STORAGE_ACCOUNT=mystorageaccount
AZURE_STORAGE_CONTAINER=database-backups

# AWS example
CLOUD_STORAGE_ENABLED=true
CLOUD_STORAGE_PROVIDER=aws
AWS_S3_BUCKET=my-backup-bucket

# Enable notifications
NOTIFICATION_ENABLED=true
NOTIFICATION_EMAIL=ops@example.com
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/xxx
```

### Verify Backup

```bash
# List backups with metadata
ls -lh infrastructure/backups/database/full/
ls -lh infrastructure/backups/database/metadata/

# Check backup integrity
cat infrastructure/backups/database/metadata/backup_*.json
```

## Restore Operations

### Interactive Restore

```bash
# Start restore process (will show menu)
./infrastructure/scripts/db-restore.sh

# Follow prompts:
# 1. Select backup from list
# 2. Review backup details
# 3. Confirm restore
# 4. Wait for completion
```

### Non-Interactive Restore

```bash
# Restore specific backup
./infrastructure/scripts/db-restore.sh \
  --file infrastructure/backups/database/full/backup_20240101_020000.sql.gz

# Restore without confirmations (DANGEROUS - use with caution)
./infrastructure/scripts/db-restore.sh \
  --file backup.sql.gz \
  --no-confirm \
  --no-test \
  --no-backup
```

### Restore from Cloud Storage

```bash
# Download backup from cloud first
# Azure
az storage blob download \
  --account-name mystorageaccount \
  --container-name database-backups \
  --name backup_20240101_020000.sql.gz.enc \
  --file ./backup.sql.gz.enc

# Then restore
./infrastructure/scripts/db-restore.sh --file ./backup.sql.gz.enc
```

### Emergency Restore Procedure

If restore script fails:

```bash
# 1. Decrypt backup (if encrypted)
openssl enc -aes-256-cbc -d -pbkdf2 \
  -in backup.sql.gz.enc \
  -out backup.sql.gz \
  -k YOUR_ENCRYPTION_KEY

# 2. Decompress
gunzip backup.sql.gz

# 3. Manual restore
psql -U user -d postgres -c "DROP DATABASE IF EXISTS dbname;"
psql -U user -d postgres -c "CREATE DATABASE dbname;"
psql -U user -d dbname -f backup.sql
```

## Performance Monitoring

### Run Performance Report

```bash
# Generate full performance report
./infrastructure/scripts/db-monitor.sh

# View report
cat infrastructure/monitoring/database/reports/performance_report_*.txt
```

### Quick Health Check

```bash
# Check connections
psql -U user -d dbname -c "
  SELECT state, COUNT(*)
  FROM pg_stat_activity
  WHERE datname = 'dbname'
  GROUP BY state;
"

# Check database size
psql -U user -d dbname -c "
  SELECT pg_size_pretty(pg_database_size('dbname'));
"

# Check cache hit ratio
psql -U user -d dbname -c "
  SELECT
    ROUND((sum(blks_hit) * 100.0 / NULLIF(sum(blks_hit) + sum(blks_read), 0))::numeric, 2) as cache_hit_ratio
  FROM pg_stat_database
  WHERE datname = 'dbname';
"
```

### Identify Slow Queries

```bash
# View slowest queries (requires pg_stat_statements)
psql -U user -d dbname -c "
  SELECT
    ROUND(mean_exec_time::numeric, 2) as avg_time_ms,
    calls,
    LEFT(query, 80) as query
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 10;
"
```

### Check for Missing Indexes

```bash
psql -U user -d dbname -c "
  SELECT
    schemaname,
    tablename,
    seq_scan,
    idx_scan,
    ROUND((seq_scan::float / NULLIF(seq_scan + idx_scan, 0))::numeric, 4) as seq_scan_ratio
  FROM pg_stat_user_tables
  WHERE seq_scan > 100
  ORDER BY seq_scan DESC
  LIMIT 10;
"
```

### Monitor Table Bloat

```bash
psql -U user -d dbname -c "
  SELECT
    schemaname,
    tablename,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    ROUND((n_dead_tup::float / NULLIF(n_live_tup, 0) * 100)::numeric, 2) as bloat_pct
  FROM pg_stat_user_tables
  WHERE n_dead_tup > 1000
  ORDER BY n_dead_tup DESC
  LIMIT 10;
"
```

## Common Commands

### Database Maintenance

```bash
# Analyze all tables (update statistics)
psql -U user -d dbname -c "ANALYZE;"

# Vacuum all tables
psql -U user -d dbname -c "VACUUM ANALYZE;"

# Vacuum specific table
psql -U user -d dbname -c "VACUUM ANALYZE users;"

# Full vacuum (locks table - use with caution)
psql -U user -d dbname -c "VACUUM FULL ANALYZE users;"

# Reindex database
psql -U user -d dbname -c "REINDEX DATABASE dbname;"
```

### Connection Management

```bash
# View active connections
psql -U user -d dbname -c "
  SELECT pid, usename, application_name, client_addr, state, query
  FROM pg_stat_activity
  WHERE datname = 'dbname';
"

# Terminate idle connections
psql -U user -d dbname -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = 'dbname'
    AND state = 'idle'
    AND state_change < now() - interval '1 hour';
"

# Terminate all connections (use with caution)
psql -U user -d postgres -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = 'dbname'
    AND pid <> pg_backend_pid();
"
```

### Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create new migration
npm run prisma:migrate dev --name migration_name

# Apply migrations (production)
npm run prisma:migrate deploy

# Reset database (DANGEROUS)
npm run prisma:migrate reset

# View database in Prisma Studio
npm run prisma:studio

# Seed database
npm run prisma:seed

# Format schema
npm run prisma:format
```

### Export Metrics

```bash
# Export Prometheus metrics
./infrastructure/scripts/db-monitor.sh

# View metrics
cat infrastructure/monitoring/database/metrics/metrics_*.prom

# Send to Prometheus Push Gateway
curl -X POST \
  --data-binary @infrastructure/monitoring/database/metrics/metrics_latest.prom \
  http://pushgateway.example.com:9091/metrics/job/postgres
```

## Emergency Procedures

### Database Down

```bash
# 1. Check PostgreSQL status
systemctl status postgresql

# 2. Check logs
tail -n 100 /var/log/postgresql/postgresql-*.log

# 3. Restart PostgreSQL
systemctl restart postgresql

# 4. Verify connectivity
psql -U user -d dbname -c "SELECT 1;"
```

### Connection Pool Exhausted

```bash
# 1. Check connection count
psql -U user -d dbname -c "
  SELECT COUNT(*) FROM pg_stat_activity WHERE datname = 'dbname';
"

# 2. Terminate idle connections
psql -U user -d dbname -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = 'dbname'
    AND state = 'idle'
    AND state_change < now() - interval '5 minutes';
"

# 3. Increase connection limit temporarily
# Edit postgresql.conf
max_connections = 200

# 4. Restart PostgreSQL
systemctl restart postgresql
```

### Data Corruption

```bash
# 1. Stop application
systemctl stop app-service

# 2. Create backup
./infrastructure/scripts/db-backup.sh

# 3. Run integrity checks
psql -U user -d dbname -c "
  SELECT tablename
  FROM pg_tables
  WHERE schemaname = 'public';
" | while read table; do
  echo "Checking $table..."
  psql -U user -d dbname -c "SELECT COUNT(*) FROM \"$table\";"
done

# 4. If corruption found, restore from backup
./infrastructure/scripts/db-restore.sh

# 5. Restart application
systemctl start app-service
```

## Monitoring Checklist

Daily:
- [ ] Check application logs for database errors
- [ ] Review connection pool metrics
- [ ] Verify backup completion

Weekly:
- [ ] Run performance monitoring script
- [ ] Review slow query report
- [ ] Check table bloat
- [ ] Verify backup restore (test restore)

Monthly:
- [ ] Review index usage
- [ ] Analyze query patterns
- [ ] Plan database capacity
- [ ] Update documentation

## Support

For detailed information, see [DATABASE_CONFIGURATION.md](./DATABASE_CONFIGURATION.md)

For issues:
1. Check application logs
2. Run monitoring script: `./infrastructure/scripts/db-monitor.sh`
3. Review database logs
4. Check backup logs
5. Contact database administrator
