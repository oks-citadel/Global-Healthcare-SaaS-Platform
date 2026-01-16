# Row-Level Security (RLS) Runbook

## Overview

This runbook provides operational procedures for managing PostgreSQL Row-Level Security (RLS) in the Unified Health Platform. RLS provides database-level enforcement of multi-tenant data isolation as a defense-in-depth security measure.

**Last Updated:** 2025-01-15
**Database:** PostgreSQL
**Security Layer:** Defense-in-Depth Multi-Tenant Isolation

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [RLS Policy Design](#rls-policy-design)
3. [Enabling RLS](#enabling-rls)
4. [Operational Procedures](#operational-procedures)
5. [Troubleshooting](#troubleshooting)
6. [Security Considerations](#security-considerations)
7. [Monitoring and Alerting](#monitoring-and-alerting)
8. [Emergency Procedures](#emergency-procedures)

---

## Architecture Overview

### Defense-in-Depth Model

The platform implements a three-layer tenant isolation architecture:

```
Request Flow:
[User Request]
    |
    v
[1. Application Layer - Express Middleware]
    - Extracts tenantId from JWT
    - Validates tenant context
    |
    v
[2. ORM Layer - Prisma Middleware]
    - Automatically adds tenantId to WHERE clauses
    - Validates cross-tenant access attempts
    |
    v
[3. Database Layer - PostgreSQL RLS]
    - Enforces tenant isolation via policies
    - Uses session variable for tenant context
    - Acts as final security barrier
```

### Why RLS?

1. **Defense-in-Depth**: Even if application bugs bypass the first two layers, RLS prevents data leakage
2. **HIPAA Compliance**: Provides auditable database-level access controls for PHI
3. **Zero Trust**: Never trust application logic alone for security
4. **SQL Injection Protection**: RLS policies apply even to raw SQL queries

### Tables with RLS Enabled

| Table | RLS Status | Policy Count | Notes |
|-------|------------|--------------|-------|
| User | Enabled + Forced | 4 | SELECT, INSERT, UPDATE, DELETE |
| Patient | Enabled + Forced | 4 | SELECT, INSERT, UPDATE, DELETE |
| Provider | Enabled + Forced | 4 | SELECT, INSERT, UPDATE, DELETE |
| Appointment | Enabled + Forced | 4 | SELECT, INSERT, UPDATE, DELETE |
| Encounter | Enabled + Forced | 4 | SELECT, INSERT, UPDATE, DELETE |
| Document | Enabled + Forced | 4 | SELECT, INSERT, UPDATE, DELETE |
| Tenant | Enabled + Forced | 2 | Self-access + System operations |

---

## RLS Policy Design

### Session Variable

RLS policies use a PostgreSQL session variable to identify the current tenant:

```sql
-- Variable name
app.current_tenant_id

-- Set by application on each request
SET app.current_tenant_id = 'tenant-uuid-here';

-- Or using set_config for transaction-local setting
SELECT set_config('app.current_tenant_id', 'tenant-uuid-here', true);
```

### Helper Function

A helper function retrieves the current tenant ID safely:

```sql
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS TEXT AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_tenant_id', true), '');
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```

### Policy Logic

Each tenant-scoped table has four policies:

```sql
-- SELECT: Allow access to own tenant's data or when no tenant context (system)
CREATE POLICY table_tenant_isolation_select ON "Table"
    FOR SELECT
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL  -- System access
    );

-- INSERT: Ensure new records belong to current tenant
CREATE POLICY table_tenant_isolation_insert ON "Table"
    FOR INSERT
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

-- UPDATE: Only update own tenant's data
CREATE POLICY table_tenant_isolation_update ON "Table"
    FOR UPDATE
    USING (...)
    WITH CHECK (...);

-- DELETE: Only delete own tenant's data
CREATE POLICY table_tenant_isolation_delete ON "Table"
    FOR DELETE
    USING (...);
```

---

## Enabling RLS

### Applying the Migration

```bash
# Navigate to API service
cd services/api

# View migration status
npx prisma migrate status

# Apply the RLS migration
npx prisma migrate deploy

# Verify migration applied
npx prisma migrate status
```

### Manual Verification

After applying the migration, verify RLS is enabled:

```sql
-- Check RLS status on tables
SELECT
    tablename,
    rowsecurity as rls_enabled,
    forcerowsecurity as rls_forced
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname = 'public'
AND tablename IN ('User', 'Patient', 'Provider', 'Appointment', 'Encounter', 'Document', 'Tenant');

-- List all RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Application Integration

The application automatically sets the tenant context. Verify integration:

```typescript
import { setTenantContext, runRlsHealthCheck } from '../lib/rls-tenant-context.js';
import prisma from '../lib/prisma.js';

// Health check
const health = await runRlsHealthCheck(prisma);
console.log(health.summary);
// Expected: "RLS Health Check: All tables properly configured"

// Manual context setting (usually done automatically)
await setTenantContext(prisma, 'tenant-uuid-here');
```

---

## Operational Procedures

### Daily Health Check

Run the RLS health check as part of daily operations:

```bash
# Via API endpoint (if exposed)
curl http://localhost:3000/health/rls

# Via application script
npm run db:rls-health-check
```

Or manually via SQL:

```sql
-- Check all tables have RLS enabled
SELECT
    c.relname as table_name,
    c.relrowsecurity as rls_enabled,
    c.relforcerowsecurity as rls_forced,
    COUNT(p.polname) as policy_count
FROM pg_class c
LEFT JOIN pg_policy p ON p.polrelid = c.oid
WHERE c.relname IN ('User', 'Patient', 'Provider', 'Appointment', 'Encounter', 'Document', 'Tenant')
GROUP BY c.relname, c.relrowsecurity, c.relforcerowsecurity;
```

### Adding RLS to New Tables

When adding new tenant-scoped tables:

1. Add `tenantId` column with index:
```sql
ALTER TABLE "NewTable" ADD COLUMN "tenantId" TEXT;
CREATE INDEX idx_newtable_tenant ON "NewTable" ("tenantId");
```

2. Enable RLS:
```sql
ALTER TABLE "NewTable" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NewTable" FORCE ROW LEVEL SECURITY;
```

3. Create policies (follow pattern from existing tables):
```sql
CREATE POLICY newtable_tenant_isolation_select ON "NewTable"
    FOR SELECT
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );
-- ... repeat for INSERT, UPDATE, DELETE
```

4. Update application:
   - Add table to `TENANT_SCOPED_MODELS` array in `tenant.middleware.ts`

### Performing System Operations

For admin operations that need cross-tenant access:

```typescript
import { withSystemContext } from '../lib/rls-tenant-context.js';
import prisma from '../lib/prisma.js';

// System operation with RLS bypassed
const totalUsers = await withSystemContext(prisma, async (tx) => {
    return tx.user.count();
});
```

**SECURITY WARNING**: Use `withSystemContext` sparingly and only for legitimate admin operations. All usage is logged.

### Migrating Existing Data

When adding tenantId to existing data:

```sql
-- Set default tenant for existing records (adjust as needed)
UPDATE "NewTable"
SET "tenantId" = 'default-tenant-uuid'
WHERE "tenantId" IS NULL;
```

---

## Troubleshooting

### Issue 1: RLS Blocking Legitimate Access

**Symptoms**: Queries return empty results when data exists

**Diagnosis**:
```sql
-- Check current tenant context
SELECT current_setting('app.current_tenant_id', true) as current_tenant;

-- Check if data has matching tenantId
SELECT id, "tenantId" FROM "TableName" LIMIT 5;
```

**Solutions**:
1. Verify tenant context is being set:
```typescript
const tenant = await getTenantContext(prisma);
console.log('Current tenant:', tenant);
```

2. Check JWT contains valid tenantId
3. Verify middleware chain order in Express

### Issue 2: System Operations Failing

**Symptoms**: Admin operations blocked by RLS

**Solution**: Use `withSystemContext`:
```typescript
await withSystemContext(prisma, async (tx) => {
    // Your admin operation here
});
```

### Issue 3: Performance Degradation

**Symptoms**: Slow queries after RLS enabled

**Diagnosis**:
```sql
-- Check if indexes are being used
EXPLAIN ANALYZE
SELECT * FROM "Patient" WHERE "tenantId" = 'test-tenant';
```

**Solutions**:
1. Ensure composite indexes exist:
```sql
CREATE INDEX CONCURRENTLY idx_table_tenant_column
ON "TableName" ("tenantId", "otherColumn");
```

2. Run ANALYZE to update statistics:
```sql
ANALYZE "TableName";
```

### Issue 4: Policies Not Applying

**Symptoms**: Users can access other tenants' data

**Diagnosis**:
```sql
-- Check if RLS is enabled AND forced
SELECT relrowsecurity, relforcerowsecurity
FROM pg_class
WHERE relname = 'TableName';
```

**Solution**: Ensure FORCE is enabled:
```sql
ALTER TABLE "TableName" FORCE ROW LEVEL SECURITY;
```

### Issue 5: Invalid Tenant ID Format

**Symptoms**: Error "Invalid tenant ID format"

**Diagnosis**: Check the tenant ID being passed is a valid UUID v4

**Solution**: Ensure JWT contains properly formatted tenant UUID

---

## Security Considerations

### Audit Logging

All RLS-related events are logged:

```sql
-- View recent RLS audit events
SELECT * FROM "_RlsAuditLog"
ORDER BY "timestamp" DESC
LIMIT 100;
```

### Bypass Prevention

1. **FORCE ROW LEVEL SECURITY**: Ensures policies apply even to table owners
2. **UUID Validation**: Application validates tenant ID format before use
3. **No Superuser Access**: Application database user should NOT be superuser

### Security Testing

Regularly test RLS with cross-tenant access attempts:

```sql
-- Set tenant A
SELECT set_config('app.current_tenant_id', 'tenant-a-uuid', false);

-- Try to access tenant B's data (should return empty)
SELECT COUNT(*) FROM "Patient" WHERE "tenantId" = 'tenant-b-uuid';

-- Try to insert into tenant B (should fail)
INSERT INTO "Patient" (id, "tenantId", ...)
VALUES ('test', 'tenant-b-uuid', ...);
```

### Penetration Testing Checklist

- [ ] Verify empty results when accessing other tenant's data
- [ ] Verify INSERT blocked for other tenant
- [ ] Verify UPDATE blocked for other tenant
- [ ] Verify DELETE blocked for other tenant
- [ ] Test with SQL injection attempts
- [ ] Test with modified JWT tokens

---

## Monitoring and Alerting

### Key Metrics

| Metric | Threshold | Alert |
|--------|-----------|-------|
| RLS policy violations | > 0 | High |
| RLS audit log blocked events | > 10/minute | Critical |
| Query performance degradation | > 50% | Warning |
| RLS health check failures | Any | Critical |

### Prometheus Metrics

Export RLS metrics:
```typescript
// In your metrics exporter
const rlsHealth = await runRlsHealthCheck(prisma);
rlsGauge.set({ status: rlsHealth.healthy ? 1 : 0 });
```

### Log Monitoring

Monitor for these log patterns:
- `Cross-tenant access attempt blocked`
- `Invalid tenant ID format`
- `Executing operation with system context`

---

## Emergency Procedures

### Disabling RLS (Emergency Only)

**WARNING**: Only disable RLS if absolutely necessary and under change control.

```sql
-- Disable RLS on specific table (DANGER!)
ALTER TABLE "TableName" DISABLE ROW LEVEL SECURITY;

-- Re-enable after emergency
ALTER TABLE "TableName" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TableName" FORCE ROW LEVEL SECURITY;
```

### Rollback Procedure

If RLS migration causes issues:

```bash
# Mark migration as rolled back
npx prisma migrate resolve --rolled-back 20250115000000_enable_rls_multi_tenant
```

Then manually disable RLS:
```sql
-- Run for each table
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Patient" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Provider" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Appointment" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Encounter" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Tenant" DISABLE ROW LEVEL SECURITY;

-- Drop policies
DROP POLICY IF EXISTS user_tenant_isolation_select ON "User";
-- ... (drop all policies)
```

### Contact Information

| Role | Contact | Escalation |
|------|---------|------------|
| Database Administrator | [DBA Contact] | Primary |
| Security Team | [Security Contact] | High Priority |
| On-Call Engineer | [PagerDuty/Slack] | 24/7 |

---

## Additional Resources

- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Prisma with RLS](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access)
- [Multi-Tenant Architecture Best Practices](internal-wiki-link)
- [HIPAA Security Controls](internal-wiki-link)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Security Team | Initial RLS runbook creation |

---

**Remember**: RLS is a critical security control. Any changes to RLS policies require security review and change control approval.
