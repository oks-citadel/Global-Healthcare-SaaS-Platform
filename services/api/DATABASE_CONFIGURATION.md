# Production Database Configuration Guide

This document provides a comprehensive guide for configuring and managing the production database for the Unified Healthcare Platform.

## Table of Contents

- [Overview](#overview)
- [Connection Pooling](#connection-pooling)
- [Database Resilience](#database-resilience)
- [Backup and Restore](#backup-and-restore)
- [Performance Monitoring](#performance-monitoring)
- [Configuration Reference](#configuration-reference)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The platform uses PostgreSQL with Prisma ORM and implements production-ready features including:

- Connection pooling with configurable limits
- Automatic retry with exponential backoff
- Read replica support for scaling
- Health checks and monitoring
- Automated backups with encryption
- Point-in-time recovery (PITR)
- Performance monitoring and query analysis

## Connection Pooling

### Configuration

Connection pooling is configured in multiple layers:

1. **Prisma Schema** (`prisma/schema.prisma`)
   - Enables metrics and tracing preview features
   - Configures directUrl for migrations

2. **Database Manager** (`src/lib/database.ts`)
   - Production-ready connection pool manager
   - Configurable pool size, timeouts, and retry logic
   - Health checks and metrics export

3. **Environment Variables** (`.env`)
   ```env
   # Connection limits
   DB_CONNECTION_LIMIT=10          # Max connections per instance
   DB_POOL_TIMEOUT=10              # Wait time for connection (seconds)
   DB_CONNECT_TIMEOUT=5            # Connection timeout (seconds)
   DB_SOCKET_TIMEOUT=60            # Query timeout (seconds)
   ```

### Determining Pool Size

Calculate optimal pool size based on your workload:

```
connection_limit = ((core_count * 2) + effective_spindle_count)
```

For example:
- 4 CPU cores, SSD storage: `(4 * 2) + 1 = 9` connections
- 8 CPU cores, SSD storage: `(8 * 2) + 1 = 17` connections

For production with multiple app instances:
```
total_pool_size = connection_limit * number_of_instances
```

Ensure this doesn't exceed PostgreSQL's `max_connections` setting.

### Usage

```typescript
import { initializeDatabaseManager, getDatabaseManager } from './lib/database';

// Initialize at application startup
const dbManager = initializeDatabaseManager({
  connectionLimit: 10,
  poolTimeout: 10,
  queryTimeout: 30000,
  enableReadReplica: true,
  readReplicaUrl: process.env.DB_READ_REPLICA_URL,
});

await dbManager.connect();

// Get client for write operations
const writeClient = dbManager.getClient();
await writeClient.user.create({ data: { ... } });

// Get replica client for read operations
const readClient = dbManager.getReplicaClient();
const users = await readClient.user.findMany();

// Execute with retry logic
const result = await dbManager.executeWithRetry(
  async (client) => {
    return await client.user.findUnique({ where: { id } });
  },
  true // isReadOperation
);

// Get metrics
const metrics = dbManager.getMetrics();
console.log(metrics);

// Graceful shutdown
await dbManager.disconnect();
```

## Database Resilience

### Retry Logic

Automatic retry with exponential backoff for transient failures:

```env
DB_MAX_RETRIES=3              # Number of retry attempts
DB_RETRY_DELAY=1000           # Initial delay (ms)
DB_RETRY_BACKOFF=2            # Backoff multiplier
```

Non-retryable errors (immediate failure):
- Unique constraint violations (P2002)
- Foreign key violations (P2003)
- Record not found (P2025)

### Connection Health Checks

Automatic health checks run periodically:

```env
DB_HEALTH_CHECK_INTERVAL=30000  # 30 seconds
```

Health check includes:
- Primary database latency
- Read replica status (if configured)
- Connection pool status

Access health status:
```typescript
const health = await dbManager.checkHealth();
console.log(health);
// {
//   healthy: true,
//   latency: 5,
//   replica: { healthy: true, latency: 6 }
// }
```

### Read Replicas

Configure read replicas for improved read performance:

```env
DB_READ_REPLICA_URL=postgresql://user:pass@replica:5432/db
```

Benefits:
- Offload read queries from primary
- Improved read scalability
- Automatic fallback to primary if replica fails

## Backup and Restore

### Automated Backups

#### Running Backups

```bash
# Manual backup
./infrastructure/scripts/db-backup.sh

# Scheduled backup (add to cron)
0 2 * * * /path/to/db-backup.sh
```

#### Backup Configuration

```env
# Local storage
BACKUP_DIR=./infrastructure/backups/database
BACKUP_RETENTION_DAYS=30
BACKUP_ENCRYPTION_KEY=your-secure-key-here
BACKUP_COMPRESSION=gzip

# Cloud storage (Azure/AWS/GCP)
CLOUD_STORAGE_ENABLED=true
CLOUD_STORAGE_PROVIDER=azure
AZURE_STORAGE_ACCOUNT=mystorageaccount
AZURE_STORAGE_CONTAINER=database-backups

# Notifications
NOTIFICATION_ENABLED=true
NOTIFICATION_EMAIL=ops@example.com
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/xxx
```

#### Backup Features

- **Compression**: Automatic gzip compression
- **Encryption**: AES-256-CBC encryption
- **Verification**: Checksum validation
- **Metadata**: JSON metadata for each backup
- **Cloud Storage**: Auto-upload to Azure/AWS/GCP
- **Retention**: Automatic cleanup of old backups
- **Notifications**: Email/webhook alerts on success/failure

### Restore Process

#### Interactive Restore

```bash
./infrastructure/scripts/db-restore.sh
```

The script will:
1. List available backups
2. Verify backup integrity
3. Run test restore
4. Create pre-restore backup
5. Confirm with user
6. Perform restore
7. Verify restore success

#### Non-Interactive Restore

```bash
# Restore specific backup
./infrastructure/scripts/db-restore.sh --file /path/to/backup.sql.gz

# Skip confirmations (dangerous!)
./infrastructure/scripts/db-restore.sh --file backup.sql.gz --no-confirm

# Skip test restore
./infrastructure/scripts/db-restore.sh --file backup.sql.gz --no-test

# Skip pre-restore backup
./infrastructure/scripts/db-restore.sh --file backup.sql.gz --no-backup
```

#### Restore Safety Features

- **Pre-restore backup**: Automatic backup before restore
- **Test restore**: Validate backup in temporary database
- **Integrity checks**: Verify checksums and file structure
- **User confirmation**: Require explicit confirmation
- **Rollback support**: Keep pre-restore backup for manual rollback

## Performance Monitoring

### Monitoring Script

Run comprehensive database analysis:

```bash
./infrastructure/scripts/db-monitor.sh
```

### Monitoring Features

#### 1. Connection Pool Status
- Active/idle connections
- Connection usage percentage
- Average connection duration

#### 2. Slow Query Analysis
Requires `pg_stat_statements` extension:

```sql
CREATE EXTENSION pg_stat_statements;
```

Reports:
- Average execution time
- Total execution time
- Call frequency
- Query samples

#### 3. Index Analysis
- Missing indexes (high sequential scan ratio)
- Unused indexes (zero index scans)
- Index size and recommendations

#### 4. Table Bloat
- Dead vs live tuples
- Bloat percentage
- Last vacuum/autovacuum timestamp
- Recommendations for VACUUM FULL

#### 5. Lock Monitoring
- Current locks by type and mode
- Blocking query detection
- Lock wait times

#### 6. Cache Hit Ratio
- Buffer cache efficiency
- Target: >99% hit ratio
- Recommendations for shared_buffers tuning

#### 7. Database Size
- Total database size
- Largest tables with index sizes
- Growth trends

#### 8. Replication Status
- Replication lag (if replica)
- Replication slot status (if primary)
- WAL lag in bytes

### Metrics Export

Metrics are exported in Prometheus format:

```bash
# View metrics
cat infrastructure/monitoring/database/metrics/metrics_*.prom
```

Example metrics:
```
pg_connections{database="unified_health"} 15
pg_database_size{database="unified_health"} 524288000
pg_cache_hit_ratio{database="unified_health"} 99.5
```

Integrate with Prometheus:

```yaml
scrape_configs:
  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:9187']
    file_sd_configs:
      - files:
        - '/path/to/infrastructure/monitoring/database/metrics/*.prom'
```

### Database Manager Metrics

Export metrics from application:

```typescript
const manager = getDatabaseManager();
const metrics = manager.getMetrics();

// {
//   totalConnections: 15,
//   activeConnections: 5,
//   idleConnections: 10,
//   waitingRequests: 0,
//   totalQueries: 1250,
//   slowQueries: 3,
//   failedQueries: 0,
//   averageQueryTime: 12.5
// }

// Prometheus format
const prometheusMetrics = manager.exportMetricsPrometheus();
```

## Configuration Reference

### Environment Variables

#### Connection Pool
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_CONNECTION_LIMIT` | 10 | Max connections per instance |
| `DB_POOL_TIMEOUT` | 10 | Connection wait timeout (seconds) |
| `DB_CONNECT_TIMEOUT` | 5 | Initial connection timeout (seconds) |
| `DB_SOCKET_TIMEOUT` | 60 | Query socket timeout (seconds) |

#### Query Settings
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_QUERY_TIMEOUT` | 30000 | Query timeout (milliseconds) |
| `DB_SLOW_QUERY_THRESHOLD` | 1000 | Slow query threshold (milliseconds) |

#### Retry Settings
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_MAX_RETRIES` | 3 | Number of retry attempts |
| `DB_RETRY_DELAY` | 1000 | Initial retry delay (milliseconds) |
| `DB_RETRY_BACKOFF` | 2 | Exponential backoff multiplier |

#### Health Checks
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HEALTH_CHECK_INTERVAL` | 30000 | Health check interval (milliseconds) |

#### Read Replicas
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_READ_REPLICA_URL` | - | Read replica connection URL |

#### Backups
| Variable | Default | Description |
|----------|---------|-------------|
| `BACKUP_DIR` | ./infrastructure/backups/database | Local backup directory |
| `BACKUP_RETENTION_DAYS` | 30 | Days to retain backups |
| `BACKUP_ENCRYPTION_KEY` | - | AES-256 encryption key |
| `BACKUP_COMPRESSION` | gzip | Compression algorithm |

## Best Practices

### 1. Connection Pooling

- Set pool size based on actual workload, not arbitrarily
- Monitor connection usage and adjust as needed
- Use read replicas for read-heavy workloads
- Configure appropriate timeouts to prevent hanging connections

### 2. Query Performance

- Enable `pg_stat_statements` for query analysis
- Monitor slow queries regularly
- Add indexes based on query patterns
- Use `EXPLAIN ANALYZE` for complex queries
- Set appropriate `work_mem` for sorting/aggregation

### 3. Backup Strategy

- Automate daily backups with cron
- Test restore procedures regularly
- Encrypt backups containing sensitive data
- Store backups in multiple locations (local + cloud)
- Document restore procedures
- Monitor backup success/failure

### 4. Monitoring

- Run performance monitoring weekly
- Set up alerts for connection pool exhaustion
- Monitor cache hit ratio (should be >99%)
- Track slow query trends
- Monitor table bloat and run VACUUM as needed
- Set up replication lag alerts

### 5. Production Configuration

PostgreSQL configuration recommendations:

```ini
# Memory Configuration
shared_buffers = 256MB          # 25% of RAM for dedicated server
effective_cache_size = 768MB    # 75% of RAM
work_mem = 16MB                 # Per-operation memory
maintenance_work_mem = 128MB    # For VACUUM, CREATE INDEX

# Connection Configuration
max_connections = 100
superuser_reserved_connections = 3

# Write-Ahead Log
wal_level = replica
max_wal_size = 1GB
min_wal_size = 80MB

# Query Planning
random_page_cost = 1.1         # For SSDs
effective_io_concurrency = 200 # For SSDs

# Autovacuum
autovacuum = on
autovacuum_max_workers = 3
autovacuum_naptime = 1min

# Logging
log_min_duration_statement = 1000  # Log slow queries (>1s)
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
```

### 6. Security

- Use strong passwords for database users
- Enable SSL/TLS connections in production
- Encrypt backups with strong encryption keys
- Restrict database network access
- Use least-privilege principle for application users
- Regularly update PostgreSQL to latest stable version
- Monitor audit logs for suspicious activity

## Troubleshooting

### Connection Pool Exhausted

**Symptoms**: "Too many clients already" error

**Solutions**:
1. Increase `DB_CONNECTION_LIMIT`
2. Reduce number of application instances
3. Increase PostgreSQL `max_connections`
4. Check for connection leaks in application code
5. Implement connection pooler (PgBouncer)

### Slow Queries

**Symptoms**: High latency, timeouts

**Solutions**:
1. Run `db-monitor.sh` to identify slow queries
2. Add missing indexes
3. Optimize query structure
4. Increase `work_mem` for complex queries
5. Consider query result caching
6. Use read replicas for read queries

### High Table Bloat

**Symptoms**: Large table sizes, slow performance

**Solutions**:
1. Run `VACUUM ANALYZE` on affected tables
2. For severe bloat, run `VACUUM FULL` (locks table)
3. Tune autovacuum settings
4. Consider partitioning large tables

### Backup Failures

**Symptoms**: Backup script errors

**Solutions**:
1. Check disk space on backup directory
2. Verify database credentials
3. Check cloud storage credentials
4. Review backup logs in `infrastructure/backups/database/logs/`
5. Verify network connectivity to database
6. Check PostgreSQL pg_dump version compatibility

### Restore Failures

**Symptoms**: Restore script errors

**Solutions**:
1. Verify backup file integrity (checksum)
2. Check if backup is encrypted (provide encryption key)
3. Ensure sufficient disk space
4. Verify database credentials
5. Check PostgreSQL version compatibility
6. Review restore logs

### Replication Lag

**Symptoms**: Stale data from replica

**Solutions**:
1. Check network latency between primary and replica
2. Monitor WAL generation rate
3. Increase `max_wal_senders` on primary
4. Increase `max_replication_slots` on primary
5. Tune `wal_keep_size` to prevent WAL deletion
6. Consider using synchronous replication for critical data

### Connection Timeouts

**Symptoms**: "Connection timeout" errors

**Solutions**:
1. Increase `DB_CONNECT_TIMEOUT`
2. Check network connectivity
3. Verify database is running and accepting connections
4. Check firewall rules
5. Monitor database CPU/memory usage
6. Review PostgreSQL logs for errors

## Additional Resources

- [Prisma Connection Pool Documentation](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-pool)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [PostgreSQL Backup and Recovery](https://www.postgresql.org/docs/current/backup.html)
- [PgBouncer Connection Pooler](https://www.pgbouncer.org/)
- [pg_stat_statements Documentation](https://www.postgresql.org/docs/current/pgstatstatements.html)

## Support

For issues or questions:
- Review this documentation
- Check application logs
- Review database logs
- Run monitoring script for diagnostics
- Contact database administrator or DevOps team
