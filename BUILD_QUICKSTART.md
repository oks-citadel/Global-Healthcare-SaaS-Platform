# Build Quickstart Guide

## Prerequisites

Ensure you have the following installed:
- **Node.js**: >= 20.0.0
- **pnpm**: >= 8.0.0 (install with `npm install -g pnpm`)
- **Git**: Latest version

## Quick Build Instructions

### Option 1: Using Build Scripts (Recommended)

**Windows:**
```cmd
build-all.bat
```

**Linux/macOS/Git Bash:**
```bash
chmod +x build-all.sh
./build-all.sh
```

### Option 2: Manual Build

```bash
# 1. Install dependencies
pnpm install

# 2. Build all packages and apps
pnpm build
```

## What Gets Built

The build process compiles the following in order (managed by Turbo):

### Packages (Libraries)
1. `@global-health/country-config` - Country configurations
2. `@global-health/fhir` - FHIR types and validation
3. `@global-health/policy` - Policy evaluation
4. `@healthcare/ui` - UI component library
5. `@unified-health/sdk` - TypeScript SDK
6. `@unified-health/i18n` - Internationalization
7. `@unifiedhealth/compliance` - Compliance utilities
8. `@unified-health/ai-workflows` - AI workflows

### Services (Backend)
1. `@unified-health/api` - Main API service
2. `@unified-health/api-gateway` - API Gateway
3. `@unified-health/telehealth-service` - Telehealth microservice
4. Other microservices (chronic-care, imaging, laboratory, mental-health, pharmacy)

### Apps (Frontend)
1. `@unified-health/web` - Patient portal (Next.js)
2. `@unified-health/admin` - Admin dashboard (Next.js)
3. `@unified-health/kiosk` - Kiosk application (Next.js)
4. `@unified-health/provider-portal` - Provider portal (Next.js)
5. `@unified-health/mobile` - Mobile app (Expo/React Native)

## Build Output Locations

After a successful build:

| Package/App | Build Output |
|-------------|--------------|
| Packages | `packages/*/dist/` |
| Services | `services/*/dist/` |
| Web Apps | `apps/*/(.next\|build)/` |
| Mobile | `apps/mobile/.expo/` |

## Common Issues and Solutions

### Issue: `pnpm: command not found`
**Solution:**
```bash
npm install -g pnpm@latest
```

### Issue: `EACCES` permission errors
**Solution (Linux/macOS):**
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ~/.pnpm
```

### Issue: Out of memory during build
**Solution:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

**Windows:**
```cmd
set NODE_OPTIONS=--max-old-space-size=4096
pnpm build
```

### Issue: Turbo cache issues
**Solution:**
```bash
pnpm turbo clean
pnpm install
pnpm build
```

### Issue: TypeScript errors in node_modules
**Solution:**
All `tsconfig.json` files should have `"skipLibCheck": true` - this is already configured.

### Issue: React version peer dependency warnings
**Solution:**
These are warnings, not errors. The project is configured to support multiple React versions:
- React 18: apps/admin, apps/kiosk, apps/provider-portal
- React 19: apps/web, apps/mobile

## Build Performance Tips

### 1. Use Turbo Cache
Turbo caches build outputs. Subsequent builds are much faster:
```bash
# First build: ~3-5 minutes
pnpm build

# Second build (with cache): ~30-60 seconds
pnpm build
```

### 2. Build Individual Packages
Build only what you need:
```bash
# Build a specific package
pnpm --filter @unified-health/web build

# Build a package and its dependencies
pnpm --filter @unified-health/web... build

# Build all apps only
pnpm --filter "./apps/*" build
```

### 3. Parallel Builds
Turbo automatically parallelizes builds. You can control concurrency:
```bash
# Limit to 4 concurrent tasks
pnpm build --concurrency=4
```

## Development Workflow

### Start Development Mode
```bash
# Start all apps in dev mode
pnpm dev

# Start specific app
pnpm --filter @unified-health/web dev
```

### Watch Mode for Packages
Packages support watch mode for development:
```bash
# Watch SDK for changes
pnpm --filter @unified-health/sdk dev

# Watch UI components
pnpm --filter @healthcare/ui dev
```

### Type Checking
```bash
# Check types without building
pnpm typecheck

# Check types for specific package
pnpm --filter @unified-health/web typecheck
```

## Verifying Successful Build

Check for these indicators:

✓ **Packages**:
```bash
ls packages/*/dist/index.{js,mjs,d.ts}
```

✓ **Services**:
```bash
ls services/*/dist/index.js
```

✓ **Web Apps**:
```bash
ls apps/web/.next
ls apps/admin/.next
```

✓ **No Errors**:
Look for output like:
```
 Tasks:    15 successful, 15 total
Cached:    0 cached, 15 total
  Time:    2m15s
```

## Next Steps After Build

1. **Run Tests** (if implemented):
   ```bash
   pnpm test
   ```

2. **Start Services**:
   ```bash
   # Using Docker
   docker-compose up

   # Or individually
   pnpm --filter @unified-health/api start
   ```

3. **Start Web Apps**:
   ```bash
   pnpm --filter @unified-health/web start
   ```

## Environment Variables

Before running services, copy and configure:
```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- API keys for third-party services

## Database Setup (For Services)

The API service requires a database:
```bash
# Generate Prisma client
pnpm --filter @unified-health/api db:generate

# Run migrations
pnpm --filter @unified-health/api db:migrate

# Seed database (optional)
pnpm --filter @unified-health/api db:seed
```

## Cleaning Build Artifacts

### Clean Everything
```bash
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

### Clean Individual Package
```bash
pnpm --filter @unified-health/web clean
pnpm --filter @unified-health/web build
```

### Clean Turbo Cache
```bash
pnpm turbo clean
```

## CI/CD Integration

The project is ready for CI/CD:

### GitHub Actions
```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 9.0.0

- name: Install dependencies
  run: pnpm install

- name: Build
  run: pnpm build

- name: Run tests
  run: pnpm test
```

### Docker Build
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build api
```

## Support

For detailed information on fixes applied, see `BUILD_FIXES_APPLIED.md`.

For architecture and package details, see `README.md`.
