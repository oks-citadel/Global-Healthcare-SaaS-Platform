# NPM Scripts Reference

Quick reference for all available npm scripts in the API service.

## Database Scripts

### `npm run db:generate`
Generates Prisma Client based on schema.prisma

**When to use:**
- After modifying schema.prisma
- After pulling repo for first time
- When @prisma/client is missing

```bash
npm run db:generate
```

---

### `npm run db:migrate`
Runs database migrations in development mode

**When to use:**
- Creating new migrations
- Applying migrations locally
- During local development

```bash
npm run db:migrate

# With custom migration name
npm run db:migrate -- --name add_new_field
```

---

### `npm run db:migrate:prod`
Deploys migrations to production (no prompts)

**When to use:**
- Production deployments
- CI/CD pipelines
- Staging environments

```bash
npm run db:migrate:prod
```

**Warning:** Only use in production environments!

---

### `npm run db:seed`
Seeds database with test data

**When to use:**
- Initial setup
- After resetting database
- Refreshing test data

```bash
npm run db:seed
```

**Output:** Creates users, patients, providers, appointments, etc.

---

### `npm run db:studio`
Opens Prisma Studio GUI

**When to use:**
- Browsing database records
- Manual data editing
- Debugging data issues

```bash
npm run db:studio
```

**URL:** http://localhost:5555

---

## Development Scripts

### `npm run dev`
Starts development server with hot reload

**When to use:**
- Local development
- Testing changes
- Debugging

```bash
npm run dev
```

**Features:**
- Auto-restarts on file changes
- Uses tsx watch mode
- Port: 3000 (default)

---

### `npm run build`
Builds production-ready code

**When to use:**
- Before deployment
- Testing production build
- CI/CD pipelines

```bash
npm run build
```

**Output:** dist/ directory

---

### `npm start`
Starts production server

**When to use:**
- Running production build
- After npm run build
- Production environments

```bash
npm run build
npm start
```

---

## Testing Scripts

### `npm test`
Runs all tests once

**When to use:**
- Before commits
- CI/CD pipelines
- Quick test verification

```bash
npm test
```

---

### `npm run test:unit`
Runs unit tests only

**When to use:**
- Testing isolated functions
- Quick feedback loop
- During development

```bash
npm run test:unit
```

---

### `npm run test:integration`
Runs integration tests only

**When to use:**
- Testing API endpoints
- Database interactions
- End-to-end flows

```bash
npm run test:integration
```

---

### `npm run test:coverage`
Runs tests with coverage report

**When to use:**
- Before releases
- Code quality checks
- Coverage analysis

```bash
npm run test:coverage
```

**Output:** coverage/ directory

---

### `npm run test:watch`
Runs tests in watch mode

**When to use:**
- Active development
- Test-driven development (TDD)
- Continuous feedback

```bash
npm run test:watch
```

---

## Code Quality Scripts

### `npm run lint`
Lints code for errors

**When to use:**
- Before commits
- Code reviews
- CI/CD pipelines

```bash
npm run lint
```

---

### `npm run lint:fix`
Lints and auto-fixes issues

**When to use:**
- Fixing formatting issues
- Before commits
- Cleaning up code

```bash
npm run lint:fix
```

---

### `npm run typecheck`
Checks TypeScript types without building

**When to use:**
- Before commits
- CI/CD pipelines
- Quick type validation

```bash
npm run typecheck
```

---

### `npm run clean`
Removes build artifacts and coverage

**When to use:**
- Before fresh build
- Cleaning up workspace
- Troubleshooting build issues

```bash
npm run clean
```

**Removes:** dist/, coverage/

---

## Custom Scripts (Prisma-specific)

### Reset Database (Linux/Mac)
```bash
chmod +x scripts/reset-db.sh
./scripts/reset-db.sh
```

### Reset Database (Windows)
```bash
scripts\reset-db.bat
```

### Validate Seed Data
```bash
tsx scripts/validate-seed-data.ts
```

---

## Prisma CLI Commands

These can be run directly with npx:

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

### Deploy Migrations
```bash
npx prisma migrate deploy
```

### Reset Database
```bash
npx prisma migrate reset
```

**Warning:** Deletes all data!

### Pull Database Schema
```bash
npx prisma db pull
```

### Push Schema (Prototype)
```bash
npx prisma db push
```

**Note:** Skips migrations, use for prototyping only

### Format Schema
```bash
npx prisma format
```

### Validate Schema
```bash
npx prisma validate
```

### Generate Client
```bash
npx prisma generate
```

### View Migration Status
```bash
npx prisma migrate status
```

---

## Common Workflows

### Initial Setup
```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

### Start Development
```bash
npm run dev
```

### Before Commit
```bash
npm run lint:fix
npm run typecheck
npm test
```

### Production Build
```bash
npm run clean
npm run build
npm run db:migrate:prod
npm start
```

### Reset and Reseed
```bash
./scripts/reset-db.sh  # or scripts\reset-db.bat
```

### Update Schema
```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name update_schema
# 3. Update seed if needed
# 4. Reseed
npm run db:seed
```

### Debug Database
```bash
npm run db:studio
# Opens GUI at http://localhost:5555
```

---

## Environment-Specific

### Development
```bash
NODE_ENV=development npm run dev
```

### Production
```bash
NODE_ENV=production npm start
```

### Test
```bash
NODE_ENV=test npm test
```

---

## Troubleshooting Commands

### Prisma Client Issues
```bash
npm run db:generate
```

### Database Connection Issues
```bash
# Check connection
npx prisma db pull

# View status
npx prisma migrate status
```

### Migration Issues
```bash
# Reset migrations (DANGER: deletes data)
npx prisma migrate reset --force

# Or use script
./scripts/reset-db.sh
```

### Build Issues
```bash
npm run clean
npm run build
```

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run db:generate
```

---

## CI/CD Pipeline Example

```bash
# Install dependencies
npm ci

# Generate Prisma Client
npm run db:generate

# Run linting
npm run lint

# Type checking
npm run typecheck

# Run tests with coverage
npm run test:coverage

# Build application
npm run build

# Deploy migrations (staging/production)
npm run db:migrate:prod
```

---

## Tips

1. **Always run db:generate after schema changes**
2. **Use db:studio to inspect data visually**
3. **Run lint:fix before committing**
4. **Use test:watch during development**
5. **Never run reset scripts in production**
6. **Always backup before migrate reset**
7. **Use db:migrate for dev, db:migrate:prod for production**

---

**Last Updated:** December 17, 2024
**Project:** Unified Health Platform API
