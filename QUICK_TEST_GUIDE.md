# Quick Test Guide
## Run Tests - Global Healthcare SaaS Platform

### Quick Start

```bash
# Run all tests across the monorepo
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific test type
pnpm test:unit           # Unit tests only
pnpm test:integration    # Integration tests only
pnpm test:e2e           # E2E tests only
```

### Package-Specific Testing

```bash
# SDK Package (axios mocking fixed!)
cd packages/sdk
pnpm test

# API Service
cd services/api
pnpm test

# Compliance Package
cd packages/compliance
pnpm test

# UI Components
cd packages/ui
pnpm test

# i18n Package
cd packages/i18n
pnpm test

# Telehealth Service
cd services/telehealth-service
pnpm test

# Chronic Care Service
cd services/chronic-care-service
pnpm test

# API Gateway
cd services/api-gateway
pnpm test

# Web App E2E Tests
cd apps/web
pnpm test:e2e
```

### Watch Mode (Development)

```bash
# Any package - auto re-run on file changes
pnpm test:watch
```

### Coverage Reports

```bash
# Generate coverage reports
pnpm test:coverage

# View HTML report
# Open: coverage/index.html in your browser
```

### Troubleshooting

#### If tests fail with "Cannot find module" errors:
```bash
# Reinstall dependencies
pnpm install
```

#### If E2E tests fail:
```bash
# Install Playwright browsers
cd apps/web
pnpm exec playwright install
```

#### If tests timeout:
```bash
# Increase timeout in vitest.config.ts
# test: { testTimeout: 20000 }
```

### Recent Fixes

✅ **SDK Package** - Fixed axios mocking issue
- Changed from `global.fetch` mock to proper `axios.create()` mock
- All 21 SDK tests should now pass

See `TEST_FIXES_REPORT.md` for detailed information.

---

**Last Updated**: December 20, 2025
