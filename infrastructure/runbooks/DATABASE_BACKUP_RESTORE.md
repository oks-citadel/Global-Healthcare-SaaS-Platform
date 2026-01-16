# Database Backup and Restore Runbook

**Document Version:** 1.0
**Last Updated:** 2025-12
**Owner:** Platform Operations Team
**Classification:** Internal - Restricted

---

## Table of Contents

1. [Overview](#overview)
2. [Backup Procedures](#backup-procedures)
3. [Restore Procedures](#restore-procedures)
4. [Point-in-Time Recovery](#point-in-time-recovery)
5. [Disaster Recovery](#disaster-recovery)
6. [Testing and Validation](#testing-and-validation)

---

## Overview

### Purpose

This runbook provides procedures for backing up and restoring PostgreSQL databases in the UnifiedHealth Platform. Proper backup management is critical for:

- **Data Protection**: Recovery from accidental deletion or corruption
- **Compliance**: HIPAA requires data backup and recovery capabilities
- **Disaster Recovery**: Business continuity in case of infrastructure failure
- **Testing**: Refreshing staging/development environments

### Database Inventory

| Service | Database Name | Classification | Backup Frequency |
|---------|--------------|----------------|------------------|
| Auth Service | auth_db | PII | Hourly snapshots, daily full |
| Telehealth Service | telehealth_db | PHI | Hourly snapshots, daily full |
| Notification Service | notification_db | Operational | Daily full |
| Laboratory Service | laboratory_db | PHI | Hourly snapshots, daily full |
| Pharmacy Service | pharmacy_db | PHI | Hourly snapshots, daily full |
| Billing Service | billing_db | PCI | Hourly snapshots, daily full |

### Retention Policy

| Backup Type | Retention Period | Storage Location |
|-------------|------------------|------------------|
| Hourly snapshots | 24 hours | Azure Blob (same region) |
| Daily full backups | 30 days | Azure Blob (same region) |
| Weekly full backups | 90 days | Azure Blob (geo-redundant) |
| Monthly archives | 7 years | Azure Archive Storage |

---

## Backup Procedures

### Automated Backups (Azure PostgreSQL)

Automated backups are configured in Azure. To verify:

```bash
# Check backup configuration
az postgres flexible-server backup list \
  --resource-group unified-health-rg \
  --name unified-health-postgres \
  --query "[].{Name:name, Type:type, CompletedTime:completedTime}" \
  -o table
```

### Manual Backup - Full Database Dump

Use when you need an immediate backup before a risky operation.

```bash
# Set variables
DB_HOST="unified-health-postgres.postgres.database.azure.com"
DB_NAME="telehealth_db"
DB_USER="unified_admin"
BACKUP_FILE="backup-${DB_NAME}-$(date +%Y%m%d-%H%M%S).dump"

# Create backup using pg_dump
PGPASSWORD=$(kubectl get secret -n unified-health db-credentials -o jsonpath='{.data.password}' | base64 -d)
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -f $BACKUP_FILE

# Verify backup file
ls -lh $BACKUP_FILE
pg_restore --list $BACKUP_FILE | head -20

# Upload to Azure Blob Storage
az storage blob upload \
  --account-name unifiedhealthbackups \
  --container-name database-backups \
  --name "manual/$BACKUP_FILE" \
  --file $BACKUP_FILE
```

### Manual Backup - Specific Tables

Use when you need to backup specific tables before data migration.

```bash
# Backup specific tables
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
  -t visits -t appointments -t chat_messages \
  -F c -f backup-telehealth-visits-$(date +%Y%m%d).dump
```

### Backup from Kubernetes Pod

When you need to backup from within the cluster:

```bash
# Create backup pod
kubectl run db-backup --rm -it --restart=Never -n unified-health \
  --image=postgres:15 \
  --env="PGPASSWORD=$(kubectl get secret db-credentials -n unified-health -o jsonpath='{.data.password}' | base64 -d)" \
  -- pg_dump -h unified-health-postgres.postgres.database.azure.com \
     -U unified_admin -d telehealth_db -F c > /tmp/backup.dump

# Copy backup from pod (if not using --rm)
kubectl cp unified-health/db-backup:/tmp/backup.dump ./local-backup.dump
```

### Schema-Only Backup

Use for version control or migration planning:

```bash
# Backup schema only (no data)
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
  --schema-only \
  -f schema-${DB_NAME}-$(date +%Y%m%d).sql

# Backup schema and data definitions (no actual data)
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
  --schema-only --no-owner --no-privileges \
  -f schema-clean-${DB_NAME}-$(date +%Y%m%d).sql
```

---

## Restore Procedures

### Pre-Restore Checklist

- [ ] Identify the correct backup file to restore
- [ ] Verify backup file integrity
- [ ] Notify stakeholders of planned downtime
- [ ] Stop application services that connect to the database
- [ ] Take a fresh backup of current state (even if corrupted)
- [ ] Ensure sufficient storage space for restore

### Restore from Azure Automated Backup

```bash
# List available restore points
az postgres flexible-server backup list \
  --resource-group unified-health-rg \
  --name unified-health-postgres

# Create a new server from backup (point-in-time)
az postgres flexible-server restore \
  --resource-group unified-health-rg \
  --name unified-health-postgres-restored \
  --source-server unified-health-postgres \
  --restore-time "2025-12-30T10:00:00Z"

# Once verified, switch application to new server or
# restore data to original server
```

### Restore from Manual Backup (Full Database)

```bash
# Download backup from Azure Storage
az storage blob download \
  --account-name unifiedhealthbackups \
  --container-name database-backups \
  --name "daily/backup-telehealth_db-20251230.dump" \
  --file restore-file.dump

# Verify backup file
pg_restore --list restore-file.dump | head -20

# Stop applications
kubectl scale deployment telehealth-service -n unified-health --replicas=0

# Restore to database (drops and recreates)
pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME \
  --clean --if-exists \
  restore-file.dump

# Restart applications
kubectl scale deployment telehealth-service -n unified-health --replicas=3

# Verify data
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM visits;"
```

### Restore Specific Tables Only

```bash
# List tables in backup
pg_restore --list restore-file.dump | grep TABLE

# Restore only specific tables
pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME \
  --table=visits \
  --table=appointments \
  --clean --if-exists \
  restore-file.dump
```

### Restore to Different Database (for testing)

```bash
# Create new database for testing restore
psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE telehealth_db_restore;"

# Restore to new database
pg_restore -h $DB_HOST -U $DB_USER -d telehealth_db_restore \
  restore-file.dump

# Verify data
psql -h $DB_HOST -U $DB_USER -d telehealth_db_restore -c "\dt"
```

---

## Point-in-Time Recovery

### When to Use

- Accidental data deletion with known timestamp
- Data corruption with known start time
- Need to recover to state before a failed migration

### Azure Point-in-Time Restore

```bash
# Get the earliest restore point
az postgres flexible-server backup list \
  --resource-group unified-health-rg \
  --name unified-health-postgres \
  --query "sort_by([].{RestorePoint:completedTime}, &RestorePoint)[0]"

# Restore to specific point in time (UTC)
az postgres flexible-server restore \
  --resource-group unified-health-rg \
  --name unified-health-postgres-pit-restore \
  --source-server unified-health-postgres \
  --restore-time "2025-12-30T14:30:00Z"

# Verify restored server
az postgres flexible-server show \
  --resource-group unified-health-rg \
  --name unified-health-postgres-pit-restore

# Connect and verify data
psql -h unified-health-postgres-pit-restore.postgres.database.azure.com \
  -U unified_admin -d telehealth_db \
  -c "SELECT * FROM visits WHERE created_at < '2025-12-30T14:30:00Z' ORDER BY created_at DESC LIMIT 5;"
```

### Recovery Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Point-in-Time Recovery Workflow                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Incident Detected                                                        │
│     └── Data corruption/deletion identified                                  │
│                                                                              │
│  2. Determine Recovery Point                                                 │
│     └── Find the exact time before the issue                                │
│                                                                              │
│  3. Stop Write Operations                                                    │
│     └── Scale down services or set database to read-only                    │
│                                                                              │
│  4. Create Restored Server                                                   │
│     └── Use Azure PITR to create new server at target time                  │
│                                                                              │
│  5. Validate Restored Data                                                   │
│     └── Connect to restored server, verify data integrity                   │
│                                                                              │
│  6. Plan Data Merge (if needed)                                             │
│     └── Identify data created after corruption that's still valid          │
│                                                                              │
│  7. Switch Production                                                        │
│     └── Update connection strings or migrate data back                      │
│                                                                              │
│  8. Verify and Monitor                                                       │
│     └── Test application, monitor for issues                                │
│                                                                              │
│  9. Cleanup                                                                  │
│     └── Delete temporary resources                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Disaster Recovery

### Multi-Region Failover

For complete regional failure, use geo-redundant backups:

```bash
# Check geo-redundant backup status
az postgres flexible-server backup list \
  --resource-group unified-health-rg \
  --name unified-health-postgres \
  --query "[?location=='eastus2']"

# Restore to secondary region
az postgres flexible-server geo-restore \
  --resource-group unified-health-dr-rg \
  --name unified-health-postgres-dr \
  --source-server "/subscriptions/{sub-id}/resourceGroups/unified-health-rg/providers/Microsoft.DBforPostgreSQL/flexibleServers/unified-health-postgres" \
  --location eastus2

# Update application configuration to use DR server
kubectl set env deployment -n unified-health --all \
  DATABASE_URL="postgresql://unified_admin@unified-health-postgres-dr..."
```

### Recovery Time Objectives (RTO/RPO)

| Scenario | RTO | RPO |
|----------|-----|-----|
| Single database restore | < 1 hour | < 1 hour |
| Full service restore | < 4 hours | < 1 hour |
| Regional failover | < 8 hours | < 4 hours |
| Complete disaster recovery | < 24 hours | < 24 hours |

### DR Test Procedure (Quarterly)

```bash
# 1. Create DR restore in test environment
az postgres flexible-server restore \
  --resource-group unified-health-dr-test-rg \
  --name unified-health-postgres-dr-test \
  --source-server unified-health-postgres \
  --restore-time "$(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ)"

# 2. Deploy application to test environment pointing to restored DB
helm install unified-health-dr-test ./charts/unified-health \
  --set database.host=unified-health-postgres-dr-test.postgres.database.azure.com

# 3. Run DR validation tests
npm run test:dr-validation

# 4. Document results and cleanup
az group delete --name unified-health-dr-test-rg --yes
```

---

## Testing and Validation

### Backup Validation (Weekly)

```bash
# 1. Download latest backup
az storage blob download \
  --account-name unifiedhealthbackups \
  --container-name database-backups \
  --name "daily/$(az storage blob list --account-name unifiedhealthbackups --container-name database-backups --query 'sort_by([].name, &@)[-1]' -o tsv)" \
  --file test-restore.dump

# 2. Restore to test database
psql -h localhost -U postgres -c "CREATE DATABASE backup_test;"
pg_restore -h localhost -U postgres -d backup_test test-restore.dump

# 3. Validate data integrity
psql -h localhost -U postgres -d backup_test -c "
  SELECT
    'users' as table_name, COUNT(*) as row_count FROM users UNION ALL
    SELECT 'visits', COUNT(*) FROM visits UNION ALL
    SELECT 'appointments', COUNT(*) FROM appointments;
"

# 4. Compare with production counts
psql -h $DB_HOST -U $DB_USER -d telehealth_db -c "
  SELECT
    'users' as table_name, COUNT(*) as row_count FROM users UNION ALL
    SELECT 'visits', COUNT(*) FROM visits UNION ALL
    SELECT 'appointments', COUNT(*) FROM appointments;
"

# 5. Cleanup
psql -h localhost -U postgres -c "DROP DATABASE backup_test;"
```

### Restore Time Testing (Monthly)

Document the time taken for various restore operations:

| Operation | Backup Size | Time Taken | Date Tested |
|-----------|-------------|------------|-------------|
| Full DB restore (telehealth) | 50GB | 45 min | 2025-12-15 |
| Single table restore | 5GB | 10 min | 2025-12-15 |
| PITR restore | - | 30 min | 2025-12-15 |

### Backup Monitoring

```bash
# Check backup job status in Azure
az monitor activity-log list \
  --resource-group unified-health-rg \
  --resource-type Microsoft.DBforPostgreSQL/flexibleServers \
  --status Succeeded \
  --query "[?operationName.value=='Microsoft.DBforPostgreSQL/flexibleServers/backup/action']"

# Alert if backup is older than 24 hours
# Configure in Azure Monitor
```

---

## Quick Reference

### Common Commands

```bash
# List all backups
az storage blob list \
  --account-name unifiedhealthbackups \
  --container-name database-backups \
  --query "[].{Name:name, Size:properties.contentLength, Modified:properties.lastModified}" \
  -o table

# Check database size
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
  SELECT pg_size_pretty(pg_database_size('$DB_NAME'));"

# Check table sizes
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
  SELECT schemaname, tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
  LIMIT 10;"
```

### Emergency Contacts

| Role | Contact | When to Escalate |
|------|---------|------------------|
| DBA On-Call | PagerDuty | Any restore operation |
| Security Team | security@unifiedhealth.io | PHI data restore |
| Compliance Officer | compliance@unifiedhealth.io | Cross-region restore |

---

**Document Classification:** Internal - Restricted
**Review Frequency:** Quarterly
**Next Review Date:** 2026-03
