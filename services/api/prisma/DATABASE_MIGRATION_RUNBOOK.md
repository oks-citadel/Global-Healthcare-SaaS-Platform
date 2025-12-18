# Database Migration Runbook

## Overview
This runbook provides step-by-step procedures for safely executing database migrations in production environments for the Unified Healthcare Platform.

**Last Updated:** 2025-12-17
**Database:** PostgreSQL
**ORM:** Prisma
**Environment:** Production

---

## Table of Contents
1. [Pre-Migration Checklist](#pre-migration-checklist)
2. [Migration Execution Steps](#migration-execution-steps)
3. [Rollback Procedures](#rollback-procedures)
4. [Post-Migration Validation](#post-migration-validation)
5. [Emergency Contacts](#emergency-contacts)
6. [Common Issues & Solutions](#common-issues--solutions)

---

## Pre-Migration Checklist

### 1. Planning Phase (1 week before)
- [ ] Review all pending migrations in `prisma/migrations/` directory
- [ ] Analyze migration SQL for breaking changes
- [ ] Identify affected tables and estimate downtime
- [ ] Schedule maintenance window (off-peak hours recommended)
- [ ] Notify stakeholders and users about scheduled maintenance
- [ ] Prepare rollback plan and test in staging environment
- [ ] Review migration for index additions/removals

### 2. Backup Phase (2 hours before)
- [ ] Verify backup system is functional
- [ ] Create full database backup using `pg_dump`
- [ ] Verify backup integrity and accessibility
- [ ] Document backup location and timestamp
- [ ] Export current schema for comparison
- [ ] Take snapshot of database metrics (size, row counts, indexes)

### 3. Environment Validation (1 hour before)
- [ ] Verify database connection credentials
- [ ] Check database disk space (minimum 30% free recommended)
- [ ] Verify Prisma CLI version matches project requirements
- [ ] Test database connectivity from application server
- [ ] Ensure monitoring and alerting systems are active
- [ ] Confirm rollback database backup is accessible

### 4. Communication
- [ ] Announce maintenance window start
- [ ] Enable maintenance mode on application
- [ ] Verify all active user sessions are cleared
- [ ] Send status update to operations team

---

## Migration Execution Steps

### Step 1: Pre-Migration Health Check
```bash
# Navigate to API service directory
cd services/api

# Check database connection
npm run db:validate

# Generate Prisma client to ensure schema is valid
npx prisma generate

# Check migration status
npx prisma migrate status
```

### Step 2: Create Database Backup
```bash
# Set environment variables
export BACKUP_DIR="/backups/db/$(date +%Y%m%d_%H%M%S)"
export DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Create backup directory
mkdir -p $BACKUP_DIR

# Full database backup with custom format (recommended for large databases)
pg_dump -Fc -v -h <host> -U <user> -d <database> -f $BACKUP_DIR/pre_migration_backup.dump

# Verify backup
pg_restore --list $BACKUP_DIR/pre_migration_backup.dump > $BACKUP_DIR/backup_contents.txt

# Record database statistics
psql $DATABASE_URL -c "\dt+" > $BACKUP_DIR/table_sizes.txt
psql $DATABASE_URL -c "SELECT COUNT(*) as total_users FROM \"User\";" > $BACKUP_DIR/row_counts.txt
```

### Step 3: Review Migration
```bash
# View pending migrations
npx prisma migrate status

# Review migration SQL
cat prisma/migrations/XXXXXX_migration_name/migration.sql

# Dry-run in separate transaction (if supported)
# Note: Prisma doesn't support dry-run, use staging environment instead
```

### Step 4: Execute Migration
```bash
# Set timeout for long-running migrations
export STATEMENT_TIMEOUT=600000  # 10 minutes

# Execute migration
npx prisma migrate deploy

# Expected output:
# The following migration(s) have been applied:
# migrations/
#   └─ 20231217000000_migration_name/
#     └─ migration.sql
```

### Step 5: Verify Migration Success
```bash
# Check migration status
npx prisma migrate status

# Verify schema
npx prisma db pull

# Check for differences
npx prisma format
npx prisma validate
```

### Step 6: Generate and Deploy Prisma Client
```bash
# Generate updated Prisma client
npx prisma generate

# Deploy updated application (if using Docker)
docker-compose up -d api

# Or restart application service
pm2 restart api
```

---

## Rollback Procedures

### When to Rollback
- Migration fails with errors
- Data corruption detected
- Application errors after migration
- Performance degradation beyond acceptable limits
- Failed post-migration validation checks

### Rollback Steps

#### Option 1: Using Prisma Migrate (Recommended for recent migrations)
```bash
# Mark migration as rolled back
npx prisma migrate resolve --rolled-back <migration_name>

# Restore from backup (see Option 2)
```

#### Option 2: Database Restore (For critical failures)
```bash
# Stop application
pm2 stop api
# or
docker-compose stop api

# Drop existing database (CAUTION!)
psql -h <host> -U <user> -c "DROP DATABASE <database>;"

# Recreate database
psql -h <host> -U <user> -c "CREATE DATABASE <database>;"

# Restore from backup
pg_restore -Fc -v -h <host> -U <user> -d <database> $BACKUP_DIR/pre_migration_backup.dump

# Verify restore
psql -h <host> -U <user> -d <database> -c "\dt"

# Reset Prisma migration history to match restored state
npx prisma migrate resolve --applied <last_successful_migration>

# Restart application
pm2 restart api
```

#### Option 3: Point-in-Time Recovery (If using continuous backups)
```bash
# Contact database administrator
# Provide exact timestamp before migration started
# Follow cloud provider's PITR procedures (AWS RDS, Azure Database, etc.)
```

### Post-Rollback Steps
- [ ] Verify database integrity
- [ ] Run health check scripts
- [ ] Test critical application features
- [ ] Document rollback reason and learnings
- [ ] Update migration strategy for retry attempt

---

## Post-Migration Validation

### 1. Database Integrity Checks
```bash
# Check migration status
npx prisma migrate status

# Validate schema
npx prisma validate

# Check database statistics
npm run db:validate

# Compare row counts before and after
psql $DATABASE_URL -c "SELECT COUNT(*) as total_users FROM \"User\";"
psql $DATABASE_URL -c "SELECT COUNT(*) as total_appointments FROM \"Appointment\";"
psql $DATABASE_URL -c "SELECT COUNT(*) as total_subscriptions FROM \"Subscription\";"
```

### 2. Index and Performance Validation
```bash
# List all indexes
psql $DATABASE_URL -c "
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
"

# Check for missing indexes
psql $DATABASE_URL -c "
SELECT
    relname as table_name,
    seq_scan,
    idx_scan,
    seq_scan / (idx_scan + 1) as seq_scan_ratio
FROM pg_stat_user_tables
WHERE seq_scan > 100
ORDER BY seq_scan DESC
LIMIT 20;
"

# Analyze query performance
psql $DATABASE_URL -c "ANALYZE;"
```

### 3. Application Health Checks
```bash
# Run health check endpoint
curl -f http://localhost:3000/health || echo "Health check failed"

# Test critical API endpoints
curl -f http://localhost:3000/api/v1/users/me -H "Authorization: Bearer <token>"
curl -f http://localhost:3000/api/v1/appointments -H "Authorization: Bearer <token>"

# Check application logs
tail -f logs/application.log | grep ERROR

# Monitor error rates
# Check application monitoring dashboard (Datadog, New Relic, etc.)
```

### 4. Data Integrity Validation
```bash
# Run custom validation script
npm run db:validate

# Check foreign key constraints
psql $DATABASE_URL -c "
SELECT
    con.conname,
    con.contype,
    con.condeferrable,
    con.condeferred,
    rel.relname
FROM pg_constraint con
JOIN pg_class rel ON con.conrelid = rel.oid
WHERE con.contype = 'f'
ORDER BY rel.relname;
"

# Verify critical data relationships
psql $DATABASE_URL -c "
SELECT
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT p.id) as total_patients,
    COUNT(DISTINCT pr.id) as total_providers
FROM \"User\" u
LEFT JOIN \"Patient\" p ON u.id = p.\"userId\"
LEFT JOIN \"Provider\" pr ON u.id = pr.\"userId\";
"
```

### 5. Monitoring Checklist
- [ ] CPU usage is within normal range
- [ ] Memory usage is stable
- [ ] Database connection pool is healthy
- [ ] Query response times are acceptable
- [ ] No increase in error rates
- [ ] Disk I/O is normal
- [ ] No deadlocks or blocking queries

---

## Emergency Contacts

| Role | Name | Contact | Escalation |
|------|------|---------|------------|
| Database Administrator | [Name] | [Email/Phone] | Primary |
| DevOps Lead | [Name] | [Email/Phone] | Secondary |
| CTO/Tech Lead | [Name] | [Email/Phone] | Escalation |
| On-Call Engineer | [Rotation] | [PagerDuty/Slack] | 24/7 |

### Escalation Matrix
1. **Severity 1 (Critical)**: Data loss, complete outage
   - Immediate rollback
   - Contact all team members
   - Initiate incident response protocol

2. **Severity 2 (High)**: Partial outage, significant errors
   - Attempt fixes within 15 minutes
   - Rollback if unresolved
   - Contact DBA and DevOps Lead

3. **Severity 3 (Medium)**: Performance degradation
   - Monitor for 30 minutes
   - Implement fixes or rollback
   - Document for post-mortem

---

## Common Issues & Solutions

### Issue 1: Migration Timeout
**Symptoms:** Migration fails with timeout error

**Solutions:**
- Increase statement timeout: `SET statement_timeout = '600s';`
- Break large migrations into smaller chunks
- Run migrations during low-traffic periods
- Consider adding indexes separately after migration

### Issue 2: Lock Conflicts
**Symptoms:** Migration hangs or fails with lock errors

**Solutions:**
```sql
-- Check for blocking queries
SELECT
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;

-- Terminate blocking queries (CAUTION!)
SELECT pg_terminate_backend(<blocking_pid>);
```

### Issue 3: Out of Disk Space
**Symptoms:** Migration fails with disk space error

**Solutions:**
- Clear temporary files and logs
- Increase disk space before retry
- Use `VACUUM FULL` to reclaim space (requires maintenance window)

### Issue 4: Foreign Key Constraint Violations
**Symptoms:** Migration fails with FK constraint errors

**Solutions:**
- Verify data consistency before migration
- Temporarily disable constraints (not recommended for production)
- Fix data issues before re-attempting migration

### Issue 5: Index Creation Takes Too Long
**Symptoms:** Migration creating indexes times out

**Solutions:**
```sql
-- Create indexes concurrently (doesn't lock table)
CREATE INDEX CONCURRENTLY index_name ON table_name (column_name);

-- Monitor index creation progress
SELECT
    now()::time,
    a.query,
    p.phase,
    p.blocks_done,
    p.blocks_total,
    p.blocks_done * 100.0 / p.blocks_total AS percentage
FROM pg_stat_progress_create_index p
JOIN pg_stat_activity a ON p.pid = a.pid;
```

---

## Migration History Template

### Migration: [Migration Name]
**Date:** YYYY-MM-DD
**Engineer:** [Name]
**Duration:** [X minutes]
**Downtime:** [X minutes or "Zero downtime"]

#### Changes Made:
- Table modifications
- Index additions/removals
- Data migrations
- Constraint changes

#### Issues Encountered:
- [None or list issues]

#### Rollback Required:
- [ ] Yes [ ] No

#### Lessons Learned:
- [Document learnings for future migrations]

---

## Best Practices

1. **Always test migrations in staging first**
   - Use production-like data volumes
   - Test rollback procedures
   - Measure performance impact

2. **Use explicit transactions when possible**
   - Ensure atomicity
   - Enable safe rollback

3. **Monitor actively during migration**
   - Watch database metrics
   - Monitor application logs
   - Keep communication channels open

4. **Document everything**
   - Record start and end times
   - Note any issues or anomalies
   - Update runbook with lessons learned

5. **Plan for zero-downtime migrations**
   - Use backward-compatible changes
   - Deploy application changes before/after schema changes
   - Consider blue-green deployments

6. **Maintain backup retention**
   - Keep pre-migration backups for at least 30 days
   - Test restore procedures regularly
   - Document backup locations

---

## Additional Resources

- Prisma Migration Documentation: https://www.prisma.io/docs/concepts/components/prisma-migrate
- PostgreSQL Backup Documentation: https://www.postgresql.org/docs/current/backup.html
- Database Migration Best Practices: [Internal Wiki Link]
- Incident Response Playbook: [Internal Wiki Link]

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-17 | Database Team | Initial runbook creation |

---

**Remember:** When in doubt, don't hesitate to rollback. It's better to be safe and retry than to risk data integrity.
