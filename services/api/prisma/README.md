# Database Setup and Seeding Guide

This directory contains all database-related files for the Unified Healthcare Platform API.

## Directory Structure

```
prisma/
├── schema.prisma              # Database schema definition
├── seed.ts                    # Seed script for test data
├── seed-data/                 # JSON files with seed data
│   ├── users.json            # User account data
│   ├── patients.json         # Patient profile data
│   ├── providers.json        # Provider profile data
│   └── plans.json            # Subscription plan data
├── migrations/                # Database migration files
│   ├── migration_lock.toml   # Migration lock file
│   └── 20241217000000_initial_schema/
│       └── migration.sql     # Initial schema migration
└── README.md                 # This file
```

## Prerequisites

1. PostgreSQL database running
2. Environment variables configured in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/unified_health?schema=public"
   ```

## Quick Start

### 1. Generate Prisma Client

```bash
npm run db:generate
```

### 2. Run Migrations

```bash
# Development (creates database if not exists)
npm run db:migrate

# Production (only runs migrations)
npm run db:migrate:prod
```

### 3. Seed the Database

```bash
npm run db:seed
```

### 4. Reset Database (Development Only)

**Linux/Mac:**
```bash
chmod +x scripts/reset-db.sh
./scripts/reset-db.sh
```

**Windows:**
```bash
scripts\reset-db.bat
```

Or use npm script:
```bash
npx prisma migrate reset --force
```

## Test Credentials

After seeding, you can use these credentials to test the application:

### Admin Account
- **Email:** admin@unifiedhealth.com
- **Password:** Admin123!
- **Role:** Administrator

### Provider Accounts
- **Email:** dr.smith@unifiedhealth.com
- **Password:** Provider123!
- **Specialty:** Cardiology, Internal Medicine

- **Email:** dr.johnson@unifiedhealth.com
- **Password:** Provider123!
- **Specialty:** Pediatrics, Family Medicine

- **Email:** dr.williams@unifiedhealth.com
- **Password:** Provider123!
- **Specialty:** Dermatology, Cosmetic Medicine

### Patient Accounts
- **Email:** john.doe@example.com
- **Password:** Patient123!
- **MRN:** Generated automatically

- **Email:** jane.smith@example.com
- **Password:** Patient123!
- **MRN:** Generated automatically

(8 more patient accounts available - see `seed-data/users.json`)

## Seeded Data Summary

The seed script creates:

- **14 Users** (1 admin, 3 providers, 10 patients)
- **3 Providers** with different specialties
- **10 Patients** with complete medical records
- **6 Subscription Plans** (Basic, Professional, Enterprise - monthly and annual)
- **6 Active Subscriptions**
- **15 Appointments** (5 past, 3 today, 7 future)
- **5 Encounters** with clinical notes
- **8 Documents** (lab results, imaging, prescriptions)
- **20+ Consent Records** (data sharing, treatment, marketing)
- **50 Audit Events** for tracking user actions

## Database Schema Overview

### Core Models

1. **User** - Authentication and user accounts
2. **Patient** - Patient profiles and medical records
3. **Provider** - Healthcare provider profiles
4. **Appointment** - Scheduled appointments
5. **Encounter** - Clinical encounters
6. **ClinicalNote** - Clinical documentation
7. **Document** - Patient documents
8. **Plan** - Subscription plans
9. **Subscription** - User subscriptions
10. **Consent** - Patient consent records
11. **AuditEvent** - Audit trail

### Key Features

- **Cascade Deletes:** Most child records cascade delete when parent is removed
- **Soft Deletes:** User status field allows for soft deletion
- **Indexes:** Optimized composite indexes for common queries
- **Foreign Keys:** Enforced referential integrity
- **Timestamps:** Automatic `createdAt` and `updatedAt` tracking

## Prisma Studio

To explore and manage database records visually:

```bash
npm run db:studio
```

This opens Prisma Studio at `http://localhost:5555`

## Migration Management

### Create a New Migration

```bash
npx prisma migrate dev --name your_migration_name
```

### Apply Migrations in Production

```bash
npx prisma migrate deploy
```

### Reset Migrations (Development Only)

```bash
npx prisma migrate reset
```

## Seed Script Features

The seed script (`seed.ts`) includes:

- **Transaction Support:** All data created in a single transaction
- **Error Handling:** Comprehensive error logging
- **Idempotency:** Clears existing data before seeding
- **Progress Logging:** Detailed console output
- **Realistic Data:** Dates, timestamps, and relationships match real-world scenarios
- **Referential Integrity:** All foreign keys properly linked

### Customizing Seed Data

Edit the JSON files in `seed-data/` to customize:

1. **users.json** - Add/modify user accounts
2. **patients.json** - Update patient profiles
3. **providers.json** - Change provider information
4. **plans.json** - Modify subscription plans

After editing, run:
```bash
npm run db:seed
```

## Common Issues and Solutions

### Issue: "Cannot read properties of undefined"
**Solution:** Make sure all migrations are applied:
```bash
npm run db:generate && npm run db:migrate
```

### Issue: "Unique constraint violation"
**Solution:** Reset the database:
```bash
npx prisma migrate reset --force
```

### Issue: "Connection timeout"
**Solution:** Check your DATABASE_URL and ensure PostgreSQL is running

### Issue: "Module not found: @prisma/client"
**Solution:** Generate the Prisma Client:
```bash
npm run db:generate
```

## Best Practices

1. **Never run reset scripts in production**
2. **Always backup before migrations**
3. **Use migrations for schema changes**
4. **Keep seed data minimal** (only what's needed for testing)
5. **Version control migrations** (commit to git)
6. **Test migrations locally** before deploying

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
