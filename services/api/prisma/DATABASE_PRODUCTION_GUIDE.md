# Database Production Preparation Guide

## Overview

This guide provides comprehensive instructions for preparing the Unified Health Platform database for production deployment.

**Last Updated:** 2025-12-17
**Database:** PostgreSQL 13+
**ORM:** Prisma 5.7.1

---

## Table of Contents

1. [Schema Optimizations](#schema-optimizations)
2. [Production Seed Data](#production-seed-data)
3. [Database Operations](#database-operations)
4. [Backup and Restore](#backup-and-restore)
5. [Health Monitoring](#health-monitoring)
6. [Security Checklist](#security-checklist)
7. [Performance Tuning](#performance-tuning)

---

## Schema Optimizations

### Index Strategy

The schema has been optimized with production-grade indexes for common query patterns:

#### User & Authentication

- **User table:**
  - `email` - Unique constraint + index for login
  - `role` - Filter by user type
  - `status` - Filter active/inactive users
  - `role, status` - Composite for filtered queries
  - `createdAt` - Time-based queries

- **RefreshToken table:**
  - `token` - Unique constraint + index for lookups
  - `userId` - User's tokens
  - `expiresAt` - Cleanup expired tokens
  - `userId, expiresAt` - Composite for cleanup queries

#### Clinical Data

- **Patient table:**
  - `userId` - Unique constraint for one-to-one relation
  - `medicalRecordNumber` - Unique constraint for lookups

- **Provider table:**
  - `userId` - Unique constraint for one-to-one relation
  - `licenseNumber` - Unique constraint for verification
  - `specialty` - Array index for filtering by specialty
  - `available` - Filter available providers

#### Appointments & Scheduling

- **Appointment table:**
  - `patientId` - Patient's appointments
  - `providerId` - Provider's schedule
  - `scheduledAt` - Time-based queries
  - `status` - Filter by appointment state
  - `patientId, scheduledAt` - Patient schedule
  - `providerId, scheduledAt` - Provider schedule

#### Billing & Subscriptions

- **Plan table:**
  - `active` - Filter active plans
  - `interval` - Filter by billing interval
  - `active, interval` - Composite for plan listings

- **Subscription table:**
  - `userId` - User's subscriptions
  - `status` - Filter by subscription state
  - `currentPeriodEnd` - Renewal processing
  - `planId` - Plan usage analytics
  - `status, currentPeriodEnd` - Renewal queries

### Migration Notes

After schema changes, create and apply migrations:

```bash
# Development
npm run db:migrate

# Production
npm run db:migrate:prod
```

---

## Production Seed Data

### Overview

The production seed script (`prisma/seed-production.ts`) creates essential baseline data:

1. **Subscription Plans** (6 plans)
   - Basic Monthly/Annual
   - Professional Monthly/Annual
   - Enterprise Monthly/Annual

2. **Health Packages** (5 packages)
   - General Health Checkup
   - Cardiac Health Package
   - Diabetes Management
   - Women's Health
   - Executive Health Checkup

3. **Diagnostic Tests** (5 core tests)
   - Complete Blood Count (CBC)
   - Lipid Profile
   - HbA1c
   - Thyroid Function Test
   - Liver Function Test

4. **Default Admin User**
   - Email: admin@thetheunifiedhealth.com
   - Password: Set via `ADMIN_DEFAULT_PASSWORD` env variable

### Running Production Seed

```bash
# Set admin password (IMPORTANT!)
export ADMIN_DEFAULT_PASSWORD="YourSecurePassword123!"

# Run production seed
npm run db:seed:prod
```

### Post-Seed Actions

- [ ] Change admin password immediately after first login
- [ ] Enable MFA for admin account
- [ ] Review and adjust subscription plan pricing
- [ ] Add additional health packages as needed
- [ ] Configure notification templates

---

## Database Operations

### Available NPM Scripts

```bash
# Migration Management
npm run db:migrate          # Development migrations
npm run db:migrate:prod     # Production migrations (deploy only)
npm run db:generate         # Generate Prisma client

# Seeding
npm run db:seed             # Development seed (with test data)
npm run db:seed:prod        # Production seed (baseline only)

# Database Tools
npm run db:studio           # Open Prisma Studio
npm run db:validate         # Run health checks
npm run db:reset            # Reset database (DESTRUCTIVE!)

# Backup & Restore
npm run db:backup           # Full database backup
npm run db:backup:schema    # Schema-only backup
npm run db:restore          # Restore from backup
```

### Common Operations

#### 1. Initial Production Setup

```bash
# 1. Set environment variables
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"
export ADMIN_DEFAULT_PASSWORD="SecurePass123!"

# 2. Generate Prisma client
npm run db:generate

# 3. Run migrations
npm run db:migrate:prod

# 4. Seed production data
npm run db:seed:prod

# 5. Verify health
npm run db:validate
```

#### 2. Schema Updates

```bash
# 1. Create backup
npm run db:backup

# 2. Update schema.prisma file
# 3. Create migration
npx prisma migrate dev --name your_migration_name

# 4. Review migration SQL
cat prisma/migrations/XXXXXX_your_migration_name/migration.sql

# 5. Test in staging
# 6. Deploy to production
npm run db:migrate:prod

# 7. Verify
npm run db:validate
```

#### 3. Data Migrations

```bash
# For data migrations, create custom scripts in scripts/migrations/
# Example: scripts/migrations/backfill-user-roles.ts

tsx scripts/migrations/your-migration-script.ts
```

---

## Backup and Restore

### Backup Strategy

#### Automated Backups (Recommended)

Set up cron jobs for automated backups:

```bash
# Add to crontab: Daily backup at 2 AM
0 2 * * * cd /path/to/api && npm run db:backup >> /var/log/db-backup.log 2>&1

# Weekly full backup (Sunday 3 AM)
0 3 * * 0 cd /path/to/api && npm run db:backup >> /var/log/db-backup.log 2>&1
```

#### Manual Backups

**Full Backup:**

```bash
npm run db:backup
# Output: Backup location printed to console
```

**Schema-Only Backup:**

```bash
npm run db:backup:schema
```

**Custom Backup:**

```bash
# Using scripts directly
bash scripts/backup-database.sh full
bash scripts/backup-database.sh schema-only
bash scripts/backup-database.sh data-only
```

### Backup Configuration

Set these environment variables:

```bash
# Backup directory
export BACKUP_DIR="/var/backups/postgresql"

# Retention period (days)
export BACKUP_RETENTION_DAYS=30

# Database credentials
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_NAME="healthcare_db"
export DB_USER="postgres"
export DB_PASSWORD="your_password"
```

### Restore Procedure

```bash
# Restore from latest backup
npm run db:restore /path/to/backup/directory

# The script will:
# 1. Verify backup integrity
# 2. Prompt for confirmation
# 3. Create pre-restore backup
# 4. Drop existing database
# 5. Restore from backup
# 6. Run validation
```

**Important:** Always review the migration runbook before restoring in production!

---

## Health Monitoring

### Database Health Checks

Run comprehensive health checks:

```bash
npm run db:validate
```

### What's Checked:

1. **Connection Health**
   - Database connectivity
   - Connection pool status
   - Active connections

2. **Version & Configuration**
   - PostgreSQL version
   - Database size
   - Tablespace usage

3. **Data Integrity**
   - Table row counts
   - Foreign key constraints
   - Orphaned records
   - Data consistency

4. **Performance Metrics**
   - Index usage
   - Cache hit ratio
   - Long-running queries
   - Deadlock detection

5. **Migration Status**
   - Applied migrations
   - Pending migrations
   - Schema validation

### Health Check Output

```
============================================
  Database Health Check
  Unified Health Platform
============================================

Results:
========

✓ Database Connection: Successfully connected to database
✓ Database Version: PostgreSQL 15.2
✓ Database Size: 245 MB
✓ Table Row Counts: Successfully counted all tables
  Details: { User: 150, Patient: 120, Provider: 10, ... }
✓ Database Indexes: Found 85 indexes
✓ Foreign Key Constraints: Found 42 foreign key constraints
✓ Data Integrity: No orphaned records found
✓ Connection Pool: 15 active connections
⚠ Cache Hit Ratio: 85% (good, but could be better)
✓ Long Running Queries: No long-running queries detected
✓ Migration Status: Last migration: 20231217000000_initial_schema

============================================
Summary:
  Total Checks: 13
  Passed: 12
  Warnings: 1
  Failed: 0
============================================

✅ Health check PASSED with warnings
```

### Monitoring in Production

Set up automated health checks:

```bash
# Add to crontab: Health check every hour
0 * * * * cd /path/to/api && npm run db:validate >> /var/log/db-health.log 2>&1
```

**Recommended Monitoring Tools:**

- **Prometheus + Grafana** - Metrics visualization
- **pgAdmin** - Database management
- **Datadog/New Relic** - Application performance monitoring
- **PgBouncer** - Connection pooling

---

## Security Checklist

### Pre-Production Security

- [ ] **Environment Variables**
  - [ ] Database credentials in secure vault (not in code)
  - [ ] Use strong passwords (min 16 characters)
  - [ ] Rotate credentials regularly

- [ ] **Database Access**
  - [ ] Enable SSL/TLS connections
  - [ ] Restrict database access by IP whitelist
  - [ ] Use separate credentials for different services
  - [ ] Implement least-privilege access

- [ ] **Authentication & Authorization**
  - [ ] Change default admin password
  - [ ] Enable MFA for admin accounts
  - [ ] Implement session timeout
  - [ ] Use secure password hashing (bcrypt)

- [ ] **Data Protection**
  - [ ] Enable encryption at rest
  - [ ] Enable encryption in transit
  - [ ] Implement audit logging
  - [ ] Regular backup testing

- [ ] **Network Security**
  - [ ] Database not publicly accessible
  - [ ] Use VPC/private networks
  - [ ] Configure firewall rules
  - [ ] Enable DDoS protection

### Compliance Requirements

**HIPAA Compliance (Healthcare Data):**

- [ ] Enable comprehensive audit logging
- [ ] Implement data encryption (at rest and in transit)
- [ ] Regular access reviews
- [ ] Backup encryption
- [ ] Disaster recovery plan
- [ ] Business associate agreements (BAAs)

**GDPR Compliance:**

- [ ] Data retention policies
- [ ] Right to erasure implementation
- [ ] Data portability features
- [ ] Consent management
- [ ] Privacy by design

---

## Performance Tuning

### PostgreSQL Configuration

Recommended settings for production (adjust based on hardware):

```sql
-- Memory settings (for 8GB RAM server)
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
work_mem = 64MB

-- Connection settings
max_connections = 200
max_parallel_workers = 4
max_parallel_workers_per_gather = 2

-- Write-Ahead Log
wal_buffers = 16MB
checkpoint_completion_target = 0.9
max_wal_size = 4GB

-- Query planning
random_page_cost = 1.1  # For SSDs
effective_io_concurrency = 200

-- Logging (for monitoring)
log_min_duration_statement = 1000  # Log queries > 1s
log_connections = on
log_disconnections = on
log_checkpoints = on
```

### Index Maintenance

Regular maintenance tasks:

```sql
-- Analyze tables (update statistics)
ANALYZE;

-- Reindex specific table
REINDEX TABLE "User";

-- Vacuum to reclaim space
VACUUM ANALYZE;

-- Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexrelname NOT LIKE '%_pkey';
```

### Query Optimization

Monitor slow queries:

```sql
-- Enable query logging
ALTER DATABASE healthcare_db SET log_min_duration_statement = 1000;

-- View slow queries
SELECT
  calls,
  total_exec_time,
  mean_exec_time,
  query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

### Connection Pooling

**Use PgBouncer for connection pooling:**

```ini
[databases]
healthcare_db = host=localhost port=5432 dbname=healthcare_db

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
reserve_pool_size = 5
reserve_pool_timeout = 3
```

### Application-Level Optimizations

1. **Use Prisma's connection pool:**

```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ["error", "warn"],
});
```

2. **Implement caching:**
   - Redis for session data
   - Application-level caching for frequently accessed data
   - CDN for static assets

3. **Batch operations:**

```typescript
// Instead of multiple inserts
await prisma.user.createMany({
  data: users,
  skipDuplicates: true,
});
```

4. **Selective field queries:**

```typescript
// Only fetch needed fields
await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
  },
});
```

---

## Disaster Recovery

### Recovery Time Objective (RTO)

**Target:** 4 hours maximum downtime

### Recovery Point Objective (RPO)

**Target:** 1 hour maximum data loss

### Disaster Recovery Plan

1. **Daily Automated Backups**
   - Full backup every 24 hours
   - Transaction logs backed up hourly
   - Offsite backup storage (different region)

2. **Point-in-Time Recovery**
   - Enable continuous archiving
   - Maintain 30 days of transaction logs
   - Test restore procedures monthly

3. **High Availability Setup**
   - Primary database with streaming replication
   - Standby replica for failover
   - Automatic failover with monitoring

4. **Backup Testing**
   - Monthly restore tests in staging
   - Quarterly disaster recovery drills
   - Document recovery procedures

---

## Troubleshooting

### Common Issues

#### Issue: Connection Pool Exhausted

```
Error: Can't reach database server at `localhost:5432`
```

**Solution:**

- Check max_connections in PostgreSQL
- Implement connection pooling (PgBouncer)
- Review application connection lifecycle

#### Issue: Slow Queries

```
Query taking > 5 seconds
```

**Solution:**

- Run EXPLAIN ANALYZE on slow queries
- Check if indexes are being used
- Update table statistics with ANALYZE
- Consider query optimization or denormalization

#### Issue: Disk Space Full

```
ERROR: could not extend file
```

**Solution:**

- Run VACUUM FULL to reclaim space
- Increase disk space
- Implement archival strategy for old data
- Monitor disk usage proactively

#### Issue: Migration Fails

```
Migration failed with error
```

**Solution:**

- Review migration SQL
- Check for data inconsistencies
- Verify foreign key constraints
- Test migration in staging first
- Follow the migration runbook

---

## Additional Resources

- **Prisma Documentation:** https://www.prisma.io/docs
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Migration Runbook:** `./DATABASE_MIGRATION_RUNBOOK.md`
- **Schema Reference:** `./schema.prisma`
- **Backup Scripts:** `../scripts/backup-database.sh`
- **Health Check:** `../scripts/db-health-check.ts`

---

## Support Contacts

For database-related issues:

- **Database Administrator:** [Contact Info]
- **DevOps Team:** [Contact Info]
- **On-Call Engineer:** [PagerDuty/Slack Channel]

---

**Last Updated:** 2025-12-17
**Document Version:** 1.0
**Maintained By:** Database Administration Team
