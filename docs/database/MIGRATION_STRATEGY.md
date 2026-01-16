# Database Migration Strategy

## Overview

This document outlines the database migration strategy for the Global Healthcare SaaS Platform. The platform uses a microservices architecture with each service managing its own database schema through Prisma ORM.

## Services and Their Databases

| Service | Database | Schema Location | Migration Prefix |
|---------|----------|-----------------|------------------|
| API (Core) | `healthcare_api` | `services/api/prisma/schema.prisma` | `20241217` |
| Telehealth | `healthcare_telehealth` | `services/telehealth-service/prisma/schema.prisma` | `20241222120000` |
| Mental Health | `healthcare_mental_health` | `services/mental-health-service/prisma/schema.prisma` | `20241222120100` |
| Chronic Care | `healthcare_chronic_care` | `services/chronic-care-service/prisma/schema.prisma` | `20241222120200` |
| Pharmacy | `healthcare_pharmacy` | `services/pharmacy-service/prisma/schema.prisma` | `20241222120300` |
| Laboratory | `healthcare_laboratory` | `services/laboratory-service/prisma/schema.prisma` | `20241222120400` |
| Imaging | `healthcare_imaging` | `services/imaging-service/prisma/schema.prisma` | `20241222120500` |
| Auth | `healthcare_auth` | `services/auth-service/prisma/schema.prisma` | `20241222120600` |

---

## Migration Naming Convention

### Format
```
YYYYMMDDHHMMSS_description
```

### Examples
- `20241222120000_initial_schema` - Initial schema creation
- `20241222130000_add_patient_vitals_table` - Adding a new table
- `20241222140000_add_index_on_patient_email` - Adding an index
- `20241222150000_alter_appointment_status_enum` - Modifying an enum
- `20241222160000_rename_column_in_users` - Renaming a column

### Description Guidelines
- Use snake_case for all descriptions
- Start with a verb: `add_`, `remove_`, `alter_`, `create_`, `drop_`, `rename_`
- Be specific about what is being changed
- Keep descriptions under 50 characters

---

## Deployment Order

Migrations must be deployed in a specific order to maintain data integrity and foreign key relationships.

### Production Deployment Sequence

```
1. Auth Service (healthcare_auth)
   - Contains user authentication data
   - No external dependencies
   - Must be deployed first

2. API Service (healthcare_api)
   - Core platform entities (Users, Patients, Providers)
   - Depends on: None (self-contained user management)

3. Telehealth Service (healthcare_telehealth)
   - References: patientId, providerId from API
   - Depends on: API Service

4. Mental Health Service (healthcare_mental_health)
   - References: patientId, providerId from API
   - Depends on: API Service

5. Chronic Care Service (healthcare_chronic_care)
   - References: patientId, providerId from API
   - Depends on: API Service

6. Pharmacy Service (healthcare_pharmacy)
   - References: patientId, providerId, encounterId from API
   - Depends on: API Service

7. Laboratory Service (healthcare_laboratory)
   - References: patientId, providerId, encounterId from API
   - Depends on: API Service

8. Imaging Service (healthcare_imaging)
   - References: patientId, providerId from API
   - Depends on: API Service
```

### Deployment Script Example

```bash
#!/bin/bash
# deploy-migrations.sh

set -e

echo "=== Deploying Database Migrations ==="

# 1. Auth Service
echo "Deploying Auth Service migrations..."
cd services/auth-service
npx prisma migrate deploy
cd ../..

# 2. API Service
echo "Deploying API Service migrations..."
cd services/api
npx prisma migrate deploy
cd ../..

# 3. Telehealth Service
echo "Deploying Telehealth Service migrations..."
cd services/telehealth-service
npx prisma migrate deploy
cd ../..

# 4. Mental Health Service
echo "Deploying Mental Health Service migrations..."
cd services/mental-health-service
npx prisma migrate deploy
cd ../..

# 5. Chronic Care Service
echo "Deploying Chronic Care Service migrations..."
cd services/chronic-care-service
npx prisma migrate deploy
cd ../..

# 6. Pharmacy Service
echo "Deploying Pharmacy Service migrations..."
cd services/pharmacy-service
npx prisma migrate deploy
cd ../..

# 7. Laboratory Service
echo "Deploying Laboratory Service migrations..."
cd services/laboratory-service
npx prisma migrate deploy
cd ../..

# 8. Imaging Service
echo "Deploying Imaging Service migrations..."
cd services/imaging-service
npx prisma migrate deploy
cd ../..

echo "=== All migrations deployed successfully ==="
```

---

## Rollback Procedures

### Pre-Rollback Checklist

1. **Backup the database** before any rollback
2. **Notify stakeholders** of potential downtime
3. **Verify rollback script** in staging environment first
4. **Document the reason** for rollback

### Rollback Strategy

Prisma does not support automatic rollbacks. Manual rollback scripts must be created.

#### Creating Rollback Scripts

For each migration, create a corresponding rollback script:

```
migrations/
  20241222120000_initial_schema/
    migration.sql        # Forward migration
  rollbacks/
    20241222120000_rollback.sql  # Rollback script
```

#### Rollback Script Template

```sql
-- Rollback for: 20241222120000_initial_schema
-- Service: telehealth-service
-- Description: Removes all tables and enums created in initial schema

-- 1. Drop foreign key constraints first
ALTER TABLE "ChatMessage" DROP CONSTRAINT IF EXISTS "ChatMessage_visitId_fkey";
ALTER TABLE "Visit" DROP CONSTRAINT IF EXISTS "Visit_appointmentId_fkey";

-- 2. Drop tables in reverse order of creation
DROP TABLE IF EXISTS "ProviderBreak";
DROP TABLE IF EXISTS "ProviderAvailability";
DROP TABLE IF EXISTS "ChatMessage";
DROP TABLE IF EXISTS "Visit";
DROP TABLE IF EXISTS "Appointment";

-- 3. Drop enums
DROP TYPE IF EXISTS "VisitStatus";
DROP TYPE IF EXISTS "AppointmentStatus";
DROP TYPE IF EXISTS "AppointmentType";

-- 4. Remove migration record from _prisma_migrations
DELETE FROM "_prisma_migrations" WHERE migration_name = '20241222120000_initial_schema';
```

### Emergency Rollback Procedure

```bash
#!/bin/bash
# rollback-migration.sh

SERVICE=$1
MIGRATION=$2

if [ -z "$SERVICE" ] || [ -z "$MIGRATION" ]; then
    echo "Usage: ./rollback-migration.sh <service> <migration_name>"
    exit 1
fi

echo "=== Rolling back migration ==="
echo "Service: $SERVICE"
echo "Migration: $MIGRATION"

# Backup first
echo "Creating backup..."
pg_dump $DATABASE_URL > "backup_$(date +%Y%m%d_%H%M%S).sql"

# Apply rollback
echo "Applying rollback script..."
psql $DATABASE_URL -f "services/$SERVICE/prisma/migrations/rollbacks/${MIGRATION}_rollback.sql"

echo "=== Rollback complete ==="
```

---

## Data Migration Guidelines

### When to Create Data Migrations

- Changing data types that require transformation
- Splitting or merging tables
- Populating new required columns
- Migrating data between services

### Data Migration Best Practices

1. **Separate Schema and Data Migrations**
   ```
   20241222120000_add_status_column.sql       # Schema change
   20241222120001_migrate_status_data.sql     # Data migration
   ```

2. **Use Batching for Large Tables**
   ```sql
   -- Migrate data in batches of 1000 records
   DO $$
   DECLARE
       batch_size INT := 1000;
       offset_val INT := 0;
       row_count INT;
   BEGIN
       LOOP
           UPDATE "Patient"
           SET "newColumn" = "oldColumn"
           WHERE id IN (
               SELECT id FROM "Patient"
               WHERE "newColumn" IS NULL
               ORDER BY id
               LIMIT batch_size
           );

           GET DIAGNOSTICS row_count = ROW_COUNT;
           EXIT WHEN row_count = 0;

           offset_val := offset_val + batch_size;
           RAISE NOTICE 'Migrated % records', offset_val;
       END LOOP;
   END $$;
   ```

3. **Add Columns as Nullable First**
   ```sql
   -- Step 1: Add nullable column
   ALTER TABLE "User" ADD COLUMN "newField" TEXT;

   -- Step 2: Migrate data
   UPDATE "User" SET "newField" = 'default_value';

   -- Step 3: Make column required (in a separate migration)
   ALTER TABLE "User" ALTER COLUMN "newField" SET NOT NULL;
   ```

4. **Preserve Old Columns During Transition**
   ```sql
   -- Add new column, keep old one
   ALTER TABLE "Patient" ADD COLUMN "dateOfBirthNew" DATE;

   -- Application reads from both during transition
   -- After full deployment, create cleanup migration
   ALTER TABLE "Patient" DROP COLUMN "dateOfBirthOld";
   ```

---

## Schema Consistency Guidelines

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Tables | PascalCase | `Patient`, `LabResult` |
| Columns | camelCase | `firstName`, `createdAt` |
| Enums | PascalCase | `AppointmentStatus` |
| Enum Values | snake_case | `in_progress`, `no_show` |
| Indexes | `TableName_column_idx` | `Patient_userId_idx` |
| Foreign Keys | `TableName_column_fkey` | `Visit_appointmentId_fkey` |

### Required Audit Columns

All tables must include:

```prisma
model ExampleTable {
  id        String   @id @default(uuid())
  // ... other fields

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Index Guidelines

1. **Always index foreign keys**
   ```prisma
   model Visit {
     appointmentId String
     @@index([appointmentId])
   }
   ```

2. **Index frequently queried columns**
   ```prisma
   @@index([status])
   @@index([scheduledAt])
   ```

3. **Use composite indexes for common query patterns**
   ```prisma
   @@index([patientId, scheduledAt])
   @@index([providerId, status])
   ```

4. **Add unique indexes for business keys**
   ```prisma
   @@unique([email])
   @@unique([medicalRecordNumber])
   ```

### Foreign Key Guidelines

1. **Use CASCADE for owned relationships**
   ```prisma
   // When parent is deleted, delete children
   messages ChatMessage[] // Deleting Visit deletes messages

   visit Visit @relation(fields: [visitId], references: [id], onDelete: Cascade)
   ```

2. **Use SET NULL for optional relationships**
   ```prisma
   // Keep child, set FK to null
   device MonitoringDevice? @relation(fields: [deviceId], references: [id], onDelete: SetNull)
   ```

3. **Use RESTRICT for required relationships**
   ```prisma
   // Prevent deletion if children exist
   plan Plan @relation(fields: [planId], references: [id], onDelete: Restrict)
   ```

---

## Development Workflow

### Creating New Migrations

1. **Modify the schema**
   ```bash
   # Edit the schema file
   vim services/[service]/prisma/schema.prisma
   ```

2. **Generate migration (development)**
   ```bash
   cd services/[service]
   npx prisma migrate dev --name add_new_feature --create-only
   ```

3. **Review the generated SQL**
   ```bash
   cat prisma/migrations/YYYYMMDDHHMMSS_add_new_feature/migration.sql
   ```

4. **Apply the migration (development)**
   ```bash
   npx prisma migrate dev
   ```

5. **Create rollback script**
   ```bash
   vim prisma/migrations/rollbacks/YYYYMMDDHHMMSS_rollback.sql
   ```

### Testing Migrations

1. **Run migrations on fresh database**
   ```bash
   npx prisma migrate reset
   ```

2. **Verify schema with Prisma validate**
   ```bash
   npx prisma validate
   ```

3. **Test in staging environment**
   ```bash
   DATABASE_URL=$STAGING_URL npx prisma migrate deploy
   ```

---

## Monitoring and Troubleshooting

### Checking Migration Status

```bash
# View migration history
npx prisma migrate status

# List applied migrations
SELECT * FROM "_prisma_migrations" ORDER BY finished_at DESC;
```

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Migration failed midway | Check `_prisma_migrations` for failed entry, fix issue, re-run |
| Schema drift | Run `npx prisma db pull` to compare, then align |
| Timeout on large tables | Increase connection timeout, use batched updates |
| Foreign key constraint violation | Check deployment order, ensure parent data exists |

### Logging

All migration operations should be logged:

```bash
# Log migrations to file
npx prisma migrate deploy 2>&1 | tee -a migration_$(date +%Y%m%d).log
```

---

## Schema Consistency Verification Results

### Cross-Service Analysis (As of 2024-12-22)

| Aspect | Status | Notes |
|--------|--------|-------|
| Naming conventions | CONSISTENT | All tables use PascalCase, columns use camelCase |
| Audit columns (createdAt, updatedAt) | CONSISTENT | All tables have audit columns |
| Index definitions | CONSISTENT | All foreign keys are indexed |
| UUID primary keys | CONSISTENT | All services use `@id @default(uuid())` |
| Enum naming | CONSISTENT | All enums use PascalCase |
| Foreign key actions | CONSISTENT | Appropriate CASCADE/SET NULL usage |

### Service-Specific Observations

1. **API Service** - Comprehensive schema with 30+ models covering core platform functionality
2. **Auth Service** - Includes enhanced security features (token rotation, account locking)
3. **Telehealth Service** - Includes WebRTC-specific fields (roomId, iceServers)
4. **Mental Health Service** - Includes standardized assessment types (PHQ-9, GAD-7)
5. **Chronic Care Service** - Comprehensive vital tracking with device integration
6. **Pharmacy Service** - Medication database with NDC codes and controlled substance tracking
7. **Laboratory Service** - Full lab workflow from order to result
8. **Imaging Service** - DICOM-compliant with PACS integration support

---

## Appendix

### Migration File Locations

```
Global-Healthcare-SaaS-Platform/
├── services/
│   ├── api/
│   │   └── prisma/
│   │       └── migrations/
│   │           ├── 20241217000000_initial_schema/
│   │           │   └── migration.sql
│   │           ├── webhook_event_log_migration.sql
│   │           └── migration_lock.toml
│   ├── telehealth-service/
│   │   └── prisma/
│   │       └── migrations/
│   │           ├── 20241222120000_initial_schema/
│   │           │   └── migration.sql
│   │           └── migration_lock.toml
│   ├── mental-health-service/
│   │   └── prisma/
│   │       └── migrations/
│   │           ├── 20241222120100_initial_schema/
│   │           │   └── migration.sql
│   │           └── migration_lock.toml
│   ├── chronic-care-service/
│   │   └── prisma/
│   │       └── migrations/
│   │           ├── 20241222120200_initial_schema/
│   │           │   └── migration.sql
│   │           └── migration_lock.toml
│   ├── pharmacy-service/
│   │   └── prisma/
│   │       └── migrations/
│   │           ├── 20241222120300_initial_schema/
│   │           │   └── migration.sql
│   │           └── migration_lock.toml
│   ├── laboratory-service/
│   │   └── prisma/
│   │       └── migrations/
│   │           ├── 20241222120400_initial_schema/
│   │           │   └── migration.sql
│   │           └── migration_lock.toml
│   ├── imaging-service/
│   │   └── prisma/
│   │       └── migrations/
│   │           ├── 20241222120500_initial_schema/
│   │           │   └── migration.sql
│   │           └── migration_lock.toml
│   └── auth-service/
│       └── prisma/
│           └── migrations/
│               ├── 20241222120600_initial_schema/
│               │   └── migration.sql
│               └── migration_lock.toml
└── docs/
    └── database/
        └── MIGRATION_STRATEGY.md
```

### Environment Variables

Each service requires the following environment variables:

```bash
# Database connection
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# For Prisma Data Proxy (optional)
DIRECT_DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

### Version History

| Date | Version | Changes |
|------|---------|---------|
| 2024-12-17 | 1.0.0 | Initial API service migration |
| 2024-12-22 | 1.1.0 | Added migrations for all 8 services |
