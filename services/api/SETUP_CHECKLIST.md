# Database Setup Checklist

Use this checklist to ensure proper setup of the Prisma database system.

## Pre-Setup Requirements

- [ ] PostgreSQL installed and running
- [ ] Node.js and npm installed
- [ ] Project dependencies installed (`npm install`)
- [ ] `.env` file created with `DATABASE_URL`

## File Verification

### Migration Files

- [x] `prisma/migrations/20241217000000_initial_schema/migration.sql` exists
- [x] `prisma/migrations/migration_lock.toml` exists

### Seed Files

- [x] `prisma/seed.ts` exists
- [x] `prisma/seed-data/users.json` exists (14 users)
- [x] `prisma/seed-data/patients.json` exists (10 patients)
- [x] `prisma/seed-data/providers.json` exists (3 providers)
- [x] `prisma/seed-data/plans.json` exists (6 plans)
- [x] `prisma/seed-data/types.ts` exists

### Scripts

- [x] `scripts/reset-db.sh` exists (Linux/Mac)
- [x] `scripts/reset-db.bat` exists (Windows)
- [x] `scripts/validate-seed-data.ts` exists

### Documentation

- [x] `prisma/README.md` exists
- [x] `prisma/QUICKSTART.md` exists
- [x] `PRISMA_SETUP_SUMMARY.md` exists

### Configuration

- [x] `package.json` updated with prisma seed configuration
- [x] `prisma/schema.prisma` updated with cascade rules and indexes
- [x] `prisma/.gitignore` exists

## Setup Steps

### 1. Environment Configuration

- [ ] Create `.env` file if not exists
- [ ] Set `DATABASE_URL` with correct credentials
- [ ] Test database connection

```bash
# Example DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/unified_health?schema=public"
```

### 2. Generate Prisma Client

```bash
npm run db:generate
```

- [ ] No errors during generation
- [ ] `node_modules/@prisma/client` created

### 3. Run Migrations

```bash
npm run db:migrate
```

- [ ] Database created (if not exists)
- [ ] All migrations applied successfully
- [ ] No migration errors

### 4. Validate Seed Data (Optional but Recommended)

```bash
tsx scripts/validate-seed-data.ts
```

- [ ] All seed data files validated
- [ ] No critical errors found

### 5. Seed Database

```bash
npm run db:seed
```

- [ ] All users created (14 total)
- [ ] All providers created (3 total)
- [ ] All patients created (10 total)
- [ ] All plans created (6 total)
- [ ] Subscriptions created (6 total)
- [ ] Appointments created (15 total)
- [ ] Encounters and notes created (5 total)
- [ ] Documents created (8 total)
- [ ] Consents created (20+ total)
- [ ] Audit events created (50 total)
- [ ] No seeding errors

### 6. Verify Setup

```bash
npm run db:studio
```

- [ ] Prisma Studio opens successfully
- [ ] All tables visible
- [ ] Data correctly populated

## Test Login Credentials

### Admin Account

- [ ] Email: admin@unifiedhealth.com
- [ ] Password: Admin123!
- [ ] Can login successfully

### Provider Account

- [ ] Email: dr.smith@unifiedhealth.com
- [ ] Password: Provider123!
- [ ] Can login successfully

### Patient Account

- [ ] Email: john.doe@example.com
- [ ] Password: Patient123!
- [ ] Can login successfully

## Data Verification

### Users Table

- [ ] 14 records total
- [ ] 1 admin
- [ ] 3 providers
- [ ] 10 patients
- [ ] All emails unique
- [ ] All passwords hashed

### Patients Table

- [ ] 10 records total
- [ ] All have unique MRN
- [ ] All have emergency contacts
- [ ] Blood types populated
- [ ] Allergies arrays populated

### Providers Table

- [ ] 3 records total
- [ ] All have license numbers
- [ ] All have specialties
- [ ] All marked as available

### Appointments Table

- [ ] 15 records total
- [ ] 5 past appointments (completed)
- [ ] 3 today's appointments (confirmed)
- [ ] 7 future appointments (scheduled/confirmed)
- [ ] All linked to patients and providers

### Encounters Table

- [ ] 5 records total
- [ ] All have clinical notes
- [ ] All linked to completed appointments
- [ ] Start and end times set

### Plans Table

- [ ] 6 records total
- [ ] 3 tiers (Basic, Professional, Enterprise)
- [ ] 2 intervals (monthly, annual)
- [ ] All marked as active
- [ ] Features arrays populated

### Subscriptions Table

- [ ] 6 records total
- [ ] All marked as active
- [ ] Current periods set correctly
- [ ] Linked to valid users and plans

### Documents Table

- [ ] 8 records total
- [ ] Different types represented
- [ ] All linked to patients
- [ ] File metadata populated

### Consents Table

- [ ] 20+ records total
- [ ] All patients have data_sharing consent
- [ ] All patients have treatment consent
- [ ] Some have marketing consent
- [ ] Expiry dates set where applicable

### Audit Events Table

- [ ] 50 records total
- [ ] Various actions represented
- [ ] Timestamps within last 30 days
- [ ] IP addresses populated
- [ ] Linked to valid users

## Relationship Verification

- [ ] All foreign keys properly linked
- [ ] No orphaned records
- [ ] Cascade deletes configured correctly
- [ ] Unique constraints enforced

## Index Verification

- [ ] Single column indexes created
- [ ] Composite indexes created
- [ ] No duplicate indexes

## Performance Checks

- [ ] Query response time acceptable
- [ ] No slow queries detected
- [ ] Indexes being utilized

## Security Checks

- [ ] All passwords hashed with bcrypt
- [ ] No plain text passwords
- [ ] Sensitive data properly stored
- [ ] Environment variables not committed

## Troubleshooting

If any step fails, refer to:

1. `prisma/README.md` - Detailed documentation
2. `prisma/QUICKSTART.md` - Quick reference
3. `PRISMA_SETUP_SUMMARY.md` - Complete overview

Common fixes:

```bash
# Reset everything and start over
./scripts/reset-db.sh  # or scripts\reset-db.bat on Windows

# Regenerate Prisma Client
npm run db:generate

# Validate migrations
npx prisma migrate status

# Check database connection
npx prisma db pull
```

## Post-Setup Tasks

- [ ] Test API endpoints with seeded data
- [ ] Verify authentication with test credentials
- [ ] Test CRUD operations on all models
- [ ] Verify cascade deletes work correctly
- [ ] Test subscription queries
- [ ] Verify audit logging works
- [ ] Test appointment scheduling
- [ ] Verify document uploads work

## Production Deployment Checklist

- [ ] **DO NOT** run reset scripts in production
- [ ] Use `npm run db:migrate:prod` for migrations
- [ ] **DO NOT** seed production database with test data
- [ ] Set `NODE_ENV=production`
- [ ] Use strong DATABASE_URL credentials
- [ ] Enable SSL for database connection
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Monitor query performance
- [ ] Set up database alerts

## Maintenance

### Weekly

- [ ] Review audit logs
- [ ] Check for slow queries
- [ ] Monitor database size

### Monthly

- [ ] Vacuum database (PostgreSQL)
- [ ] Analyze query patterns
- [ ] Review and optimize indexes

### As Needed

- [ ] Create new migrations for schema changes
- [ ] Update seed data for new requirements
- [ ] Review and update documentation

## Sign-Off

- [ ] All setup steps completed successfully
- [ ] All verification checks passed
- [ ] Test credentials work
- [ ] Data relationships verified
- [ ] Documentation reviewed
- [ ] Ready for development

**Setup Completed By:** ******\_\_\_\_******

**Date:** ******\_\_\_\_******

**Notes:**

---

**Version:** 1.0
**Last Updated:** December 17, 2024
