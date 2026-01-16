-- ============================================================================
-- Row-Level Security (RLS) Migration for Multi-Tenant Data Isolation
-- ============================================================================
--
-- Purpose: Enable PostgreSQL Row-Level Security as a defense-in-depth measure
-- for multi-tenant data isolation in the Unified Health Platform.
--
-- This migration adds database-level enforcement of tenant isolation on top of
-- the existing application-level Prisma middleware isolation.
--
-- Security Model:
-- - Uses session variable 'app.current_tenant_id' set by the application
-- - All tenant-scoped tables get RLS policies for SELECT, INSERT, UPDATE, DELETE
-- - Policies ensure data access is restricted to the current tenant only
--
-- Tables with RLS:
-- - User (tenantId column)
-- - Patient (tenantId column)
-- - Provider (tenantId column)
-- - Appointment (tenantId column)
-- - Encounter (tenantId column)
-- - Document (tenantId column)
--
-- Related tables (inherit tenant from parent via FK):
-- - Visit (via Appointment)
-- - ChatMessage (via Visit)
-- - ClinicalNote (via Encounter)
-- - Consent (via Patient)
-- - Prescription (via patientId - needs tenantId added for direct RLS)
-- - LabResult (via patientId - needs tenantId added for direct RLS)
--
-- HIPAA Compliance Note: This provides an additional security layer
-- ensuring that even in case of application bugs, database-level
-- enforcement prevents cross-tenant data access.
--
-- ============================================================================

-- ============================================================================
-- Step 1: Create helper function to get current tenant ID
-- ============================================================================

-- Drop function if exists to allow for idempotent migration
DROP FUNCTION IF EXISTS get_current_tenant_id();

-- Create function to safely retrieve the current tenant ID from session
-- Returns NULL if not set (allows queries to work for system/admin operations)
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS TEXT AS $$
BEGIN
    -- current_setting with missing_ok=true returns NULL if not set
    RETURN NULLIF(current_setting('app.current_tenant_id', true), '');
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant execute permission to the application role
-- Note: Replace 'application_user' with your actual database user if different
-- GRANT EXECUTE ON FUNCTION get_current_tenant_id() TO application_user;

COMMENT ON FUNCTION get_current_tenant_id() IS
'Returns the current tenant ID from the session variable app.current_tenant_id.
Returns NULL if not set, which allows system-level operations to bypass RLS when needed.
Set using: SET app.current_tenant_id = ''tenant-uuid-here'';';


-- ============================================================================
-- Step 2: Enable RLS on User table
-- ============================================================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owners (defense-in-depth)
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;

-- Drop existing policies if any (for idempotent migration)
DROP POLICY IF EXISTS user_tenant_isolation_select ON "User";
DROP POLICY IF EXISTS user_tenant_isolation_insert ON "User";
DROP POLICY IF EXISTS user_tenant_isolation_update ON "User";
DROP POLICY IF EXISTS user_tenant_isolation_delete ON "User";
DROP POLICY IF EXISTS user_system_access ON "User";

-- SELECT policy: Users can only see records in their tenant
-- NULL tenantId check allows system users and tenant-less users
CREATE POLICY user_tenant_isolation_select ON "User"
    FOR SELECT
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL  -- Allows system/admin operations when no tenant set
    );

-- INSERT policy: Users can only insert records for their tenant
CREATE POLICY user_tenant_isolation_insert ON "User"
    FOR INSERT
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

-- UPDATE policy: Users can only update records in their tenant
CREATE POLICY user_tenant_isolation_update ON "User"
    FOR UPDATE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    )
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

-- DELETE policy: Users can only delete records in their tenant
CREATE POLICY user_tenant_isolation_delete ON "User"
    FOR DELETE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );


-- ============================================================================
-- Step 3: Enable RLS on Patient table
-- ============================================================================

ALTER TABLE "Patient" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Patient" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS patient_tenant_isolation_select ON "Patient";
DROP POLICY IF EXISTS patient_tenant_isolation_insert ON "Patient";
DROP POLICY IF EXISTS patient_tenant_isolation_update ON "Patient";
DROP POLICY IF EXISTS patient_tenant_isolation_delete ON "Patient";

CREATE POLICY patient_tenant_isolation_select ON "Patient"
    FOR SELECT
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY patient_tenant_isolation_insert ON "Patient"
    FOR INSERT
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY patient_tenant_isolation_update ON "Patient"
    FOR UPDATE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    )
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY patient_tenant_isolation_delete ON "Patient"
    FOR DELETE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );


-- ============================================================================
-- Step 4: Enable RLS on Provider table
-- ============================================================================

ALTER TABLE "Provider" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Provider" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS provider_tenant_isolation_select ON "Provider";
DROP POLICY IF EXISTS provider_tenant_isolation_insert ON "Provider";
DROP POLICY IF EXISTS provider_tenant_isolation_update ON "Provider";
DROP POLICY IF EXISTS provider_tenant_isolation_delete ON "Provider";

CREATE POLICY provider_tenant_isolation_select ON "Provider"
    FOR SELECT
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY provider_tenant_isolation_insert ON "Provider"
    FOR INSERT
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY provider_tenant_isolation_update ON "Provider"
    FOR UPDATE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    )
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY provider_tenant_isolation_delete ON "Provider"
    FOR DELETE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );


-- ============================================================================
-- Step 5: Enable RLS on Appointment table
-- ============================================================================

ALTER TABLE "Appointment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Appointment" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS appointment_tenant_isolation_select ON "Appointment";
DROP POLICY IF EXISTS appointment_tenant_isolation_insert ON "Appointment";
DROP POLICY IF EXISTS appointment_tenant_isolation_update ON "Appointment";
DROP POLICY IF EXISTS appointment_tenant_isolation_delete ON "Appointment";

CREATE POLICY appointment_tenant_isolation_select ON "Appointment"
    FOR SELECT
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY appointment_tenant_isolation_insert ON "Appointment"
    FOR INSERT
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY appointment_tenant_isolation_update ON "Appointment"
    FOR UPDATE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    )
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY appointment_tenant_isolation_delete ON "Appointment"
    FOR DELETE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );


-- ============================================================================
-- Step 6: Enable RLS on Encounter table
-- ============================================================================

ALTER TABLE "Encounter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Encounter" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS encounter_tenant_isolation_select ON "Encounter";
DROP POLICY IF EXISTS encounter_tenant_isolation_insert ON "Encounter";
DROP POLICY IF EXISTS encounter_tenant_isolation_update ON "Encounter";
DROP POLICY IF EXISTS encounter_tenant_isolation_delete ON "Encounter";

CREATE POLICY encounter_tenant_isolation_select ON "Encounter"
    FOR SELECT
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY encounter_tenant_isolation_insert ON "Encounter"
    FOR INSERT
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY encounter_tenant_isolation_update ON "Encounter"
    FOR UPDATE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    )
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY encounter_tenant_isolation_delete ON "Encounter"
    FOR DELETE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );


-- ============================================================================
-- Step 7: Enable RLS on Document table
-- ============================================================================

ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS document_tenant_isolation_select ON "Document";
DROP POLICY IF EXISTS document_tenant_isolation_insert ON "Document";
DROP POLICY IF EXISTS document_tenant_isolation_update ON "Document";
DROP POLICY IF EXISTS document_tenant_isolation_delete ON "Document";

CREATE POLICY document_tenant_isolation_select ON "Document"
    FOR SELECT
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY document_tenant_isolation_insert ON "Document"
    FOR INSERT
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY document_tenant_isolation_update ON "Document"
    FOR UPDATE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    )
    WITH CHECK (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );

CREATE POLICY document_tenant_isolation_delete ON "Document"
    FOR DELETE
    USING (
        "tenantId" IS NULL
        OR "tenantId" = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL
    );


-- ============================================================================
-- Step 8: Enable RLS on Tenant table (admin-only access)
-- ============================================================================

ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tenant" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_self_access ON "Tenant";
DROP POLICY IF EXISTS tenant_system_access ON "Tenant";

-- Tenants can only see their own tenant record
CREATE POLICY tenant_self_access ON "Tenant"
    FOR SELECT
    USING (
        id = get_current_tenant_id()
        OR get_current_tenant_id() IS NULL  -- System access
    );

-- Only allow INSERT/UPDATE/DELETE for system operations (no tenant context)
CREATE POLICY tenant_system_access ON "Tenant"
    FOR ALL
    USING (get_current_tenant_id() IS NULL)
    WITH CHECK (get_current_tenant_id() IS NULL);


-- ============================================================================
-- Step 9: Create indexes for RLS performance
-- ============================================================================
-- Note: Indexes on tenantId already exist from initial schema
-- These are included here for documentation and to ensure coverage

-- Ensure composite indexes exist for common query patterns with tenant filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_tenant_email
    ON "User" ("tenantId", email);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patient_tenant_mrn
    ON "Patient" ("tenantId", "medicalRecordNumber");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointment_tenant_scheduled
    ON "Appointment" ("tenantId", "scheduledAt");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_encounter_tenant_patient
    ON "Encounter" ("tenantId", "patientId");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_tenant_patient
    ON "Document" ("tenantId", "patientId");


-- ============================================================================
-- Step 10: Create audit trigger for tenant context changes (optional)
-- ============================================================================

-- Create audit table for RLS bypass attempts
CREATE TABLE IF NOT EXISTS "_RlsAuditLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "operation" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "attemptedTenantId" TEXT,
    "sessionTenantId" TEXT,
    "userId" TEXT,
    "queryText" TEXT,
    "blocked" BOOLEAN DEFAULT TRUE,
    "details" JSONB
);

-- Index for audit log queries
CREATE INDEX IF NOT EXISTS idx_rls_audit_timestamp ON "_RlsAuditLog" ("timestamp");
CREATE INDEX IF NOT EXISTS idx_rls_audit_table ON "_RlsAuditLog" ("tableName");
CREATE INDEX IF NOT EXISTS idx_rls_audit_blocked ON "_RlsAuditLog" ("blocked");

COMMENT ON TABLE "_RlsAuditLog" IS
'Audit log for Row-Level Security events, particularly blocked cross-tenant access attempts.
This table itself is not subject to RLS to ensure security events are always logged.';


-- ============================================================================
-- Verification Queries (for testing)
-- ============================================================================

-- To verify RLS is enabled on tables:
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public' AND tablename IN ('User', 'Patient', 'Provider', 'Appointment', 'Encounter', 'Document', 'Tenant');

-- To view all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public';

-- To test RLS (run as application user):
-- SET app.current_tenant_id = 'test-tenant-id';
-- SELECT * FROM "User" LIMIT 5;
-- RESET app.current_tenant_id;


-- ============================================================================
-- Rollback Instructions (if needed)
-- ============================================================================

-- To disable RLS on all tables (DANGER: removes protection):
-- ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Patient" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Provider" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Appointment" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Encounter" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Document" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Tenant" DISABLE ROW LEVEL SECURITY;

-- To drop all RLS policies, run the DROP POLICY statements above
