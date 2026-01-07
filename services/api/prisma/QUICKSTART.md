# Database Quick Start Guide

Quick reference for common database operations.

## Initial Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and set DATABASE_URL

# 3. Generate Prisma Client
npm run db:generate

# 4. Run migrations
npm run db:migrate

# 5. Seed database
npm run db:seed
```

## Common Commands

### Development

```bash
# Run migrations in dev mode
npm run db:migrate

# Seed the database
npm run db:seed

# Open Prisma Studio (GUI)
npm run db:studio

# Reset and reseed database
./scripts/reset-db.sh    # Linux/Mac
scripts\reset-db.bat     # Windows
```

### Production

```bash
# Deploy migrations (no prompts)
npm run db:migrate:prod

# Generate Prisma Client
npm run db:generate
```

## Prisma CLI Commands

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (DANGER: deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Open Prisma Studio
npx prisma studio

# Pull database schema (introspect)
npx prisma db pull

# Push schema to database (prototype)
npx prisma db push
```

## Validate Seed Data

```bash
# Check seed data for errors
tsx scripts/validate-seed-data.ts
```

## Test Credentials

After seeding, use these to test:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@thetheunifiedhealth.com | Admin123! |
| Provider | dr.smith@thetheunifiedhealth.com | Provider123! |
| Patient | john.doe@example.com | Patient123! |

## Quick Schema Changes

### Adding a new field

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_field_name`
3. Update seed script if needed
4. Run `npm run db:seed`

### Modifying relationships

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name update_relationship`
3. Fix any foreign key issues in seed data
4. Run `npm run db:seed`

## Troubleshooting

### "Module not found: @prisma/client"
```bash
npm run db:generate
```

### "Database does not exist"
```bash
npm run db:migrate
```

### "Unique constraint violation"
```bash
npx prisma migrate reset --force
npm run db:seed
```

### "Connection refused"
Check if PostgreSQL is running and DATABASE_URL is correct

## Database URL Format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

Example:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/unified_health?schema=public"
```

## Need Help?

- [Full Documentation](./README.md)
- [Prisma Docs](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
