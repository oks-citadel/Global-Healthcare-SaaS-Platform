# Test Setup and Execution Guide

## Overview

This guide provides instructions for setting up and running the comprehensive test suite for the Global Healthcare SaaS Platform.

---

## Prerequisites

### Required Dependencies

Ensure all testing dependencies are installed:

```bash
# From project root
pnpm install

# This will install:
# - vitest: Unit and integration testing
# - @vitest/coverage-v8: Code coverage
# - @playwright/test: E2E testing
# - @testing-library/react: React component testing
# - @testing-library/jest-dom: DOM matchers
```

---

## Package-Specific Setup

### 1. UI Package

**Location**: `packages/ui/`

**Dependencies to Add** (if not already present):
```json
{
  "devDependencies": {
    "vitest": "^1.1.0",
    "@vitest/coverage-v8": "^1.1.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "jsdom": "^23.0.1"
  }
}
```

**Package.json Scripts**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

**Installation**:
```bash
cd packages/ui
pnpm install
pnpm test
```

---

### 2. SDK Package

**Location**: `packages/sdk/`

**Dependencies to Add**:
```json
{
  "devDependencies": {
    "vitest": "^1.1.0",
    "@vitest/coverage-v8": "^1.1.0",
    "axios": "^1.6.2"
  }
}
```

**Package.json Scripts**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Installation**:
```bash
cd packages/sdk
pnpm install
pnpm test
```

---

### 3. Compliance Package

**Location**: `packages/compliance/`

**Dependencies to Add**:
```json
{
  "devDependencies": {
    "vitest": "^1.1.0",
    "@vitest/coverage-v8": "^1.1.0",
    "@types/node": "^20.10.5"
  }
}
```

**Package.json Scripts**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Installation**:
```bash
cd packages/compliance
pnpm install
pnpm test
```

---

### 4. i18n Package

**Location**: `packages/i18n/`

**Dependencies to Add**:
```json
{
  "devDependencies": {
    "vitest": "^1.1.0",
    "@vitest/coverage-v8": "^1.1.0",
    "jsdom": "^23.0.1",
    "i18next": "^23.7.8",
    "react-i18next": "^13.5.0"
  }
}
```

**Package.json Scripts**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Installation**:
```bash
cd packages/i18n
pnpm install
pnpm test
```

---

### 5. Telehealth Service

**Location**: `services/telehealth-service/`

**Dependencies to Add**:
```json
{
  "devDependencies": {
    "vitest": "^1.1.0",
    "@vitest/coverage-v8": "^1.1.0",
    "@types/node": "^20.10.5",
    "socket.io": "^4.6.1"
  }
}
```

**Package.json Scripts**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Installation**:
```bash
cd services/telehealth-service
pnpm install
pnpm test
```

---

### 6. Chronic Care Service

**Location**: `services/chronic-care-service/`

**Dependencies to Add**:
```json
{
  "devDependencies": {
    "vitest": "^1.1.0",
    "@vitest/coverage-v8": "^1.1.0",
    "@types/node": "^20.10.5"
  }
}
```

**Package.json Scripts**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Installation**:
```bash
cd services/chronic-care-service
pnpm install
pnpm test
```

---

### 7. API Gateway

**Location**: `services/api-gateway/`

**Dependencies to Add**:
```json
{
  "devDependencies": {
    "vitest": "^1.1.0",
    "@vitest/coverage-v8": "^1.1.0",
    "@types/node": "^20.10.5",
    "jsonwebtoken": "^9.0.2",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
```

**Package.json Scripts**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Installation**:
```bash
cd services/api-gateway
pnpm install
pnpm test
```

---

## Running Tests

### Run All Tests (Root Level)

```bash
# From project root
pnpm test              # Run all tests
pnpm test:unit         # Run unit tests only
pnpm test:integration  # Run integration tests only
pnpm test:e2e          # Run E2E tests
pnpm test:coverage     # Run all tests with coverage
```

### Run Package-Specific Tests

```bash
# UI Package
cd packages/ui && pnpm test

# SDK Package
cd packages/sdk && pnpm test

# Compliance Package
cd packages/compliance && pnpm test

# i18n Package
cd packages/i18n && pnpm test
```

### Run Service-Specific Tests

```bash
# API Service (already configured)
cd services/api && pnpm test

# Telehealth Service
cd services/telehealth-service && pnpm test

# Chronic Care Service
cd services/chronic-care-service && pnpm test

# API Gateway
cd services/api-gateway && pnpm test
```

### E2E Tests

```bash
cd apps/web

# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e e2e/tests/dashboard.spec.ts
pnpm test:e2e e2e/tests/billing.spec.ts

# Run with UI
pnpm test:e2e:ui

# Run in specific browser
pnpm test:e2e:chromium
pnpm test:e2e:firefox
pnpm test:e2e:webkit
```

---

## Coverage Reports

### Generate Coverage Reports

```bash
# For any package/service
pnpm test:coverage

# Coverage report will be generated in:
# - coverage/index.html (HTML report)
# - coverage/lcov.info (LCOV format)
# - coverage/coverage-final.json (JSON format)
```

### View HTML Coverage Report

```bash
# After running tests with coverage
open coverage/index.html  # macOS
start coverage/index.html  # Windows
xdg-open coverage/index.html  # Linux
```

---

## Watch Mode

Watch mode automatically re-runs tests when files change:

```bash
# Any package/service
pnpm test:watch

# Vitest will watch for changes and re-run relevant tests
```

---

## Debugging Tests

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Vitest Tests",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test", "--run", "--no-coverage"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Command Line Debugging

```bash
# Run specific test
pnpm test -t "test name pattern"

# Run with verbose output
pnpm test -- --reporter=verbose

# Run in UI mode
pnpm test:ui
```

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors

**Solution**: Ensure all dependencies are installed
```bash
pnpm install
```

#### 2. Tests timing out

**Solution**: Increase timeout in vitest.config.ts
```typescript
export default defineConfig({
  test: {
    testTimeout: 10000, // 10 seconds
  },
});
```

#### 3. Coverage not generating

**Solution**: Install coverage provider
```bash
pnpm add -D @vitest/coverage-v8
```

#### 4. E2E tests failing

**Solution**: Install Playwright browsers
```bash
cd apps/web
pnpm exec playwright install
```

#### 5. "ELIFECYCLE" errors

**Solution**: Clear node_modules and reinstall
```bash
rm -rf node_modules
pnpm install
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:unit

      - name: Run integration tests
        run: pnpm test:integration

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Generate coverage
        run: pnpm test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Environment Variables for Testing

Create `.env.test` files for test-specific configuration:

```bash
# .env.test (services/api/)
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
ENCRYPTION_KEY=test-32-byte-encryption-key-here
```

---

## Best Practices

### 1. Test Organization
- Keep tests close to source code or in dedicated `tests/` directory
- Use descriptive test names
- Group related tests with `describe` blocks

### 2. Test Data
- Use fixtures for complex test data
- Store fixtures in `tests/fixtures/`
- Avoid hardcoding sensitive data

### 3. Mocking
- Mock external dependencies (databases, APIs)
- Use `vi.mock()` for module-level mocks
- Clear mocks in `afterEach` hooks

### 4. Coverage
- Aim for 80%+ coverage
- Focus on critical business logic
- Don't sacrifice code quality for coverage metrics

### 5. Performance
- Keep unit tests fast (< 100ms each)
- Use `beforeAll` for expensive setup when safe
- Run integration tests in parallel when possible

---

## Quick Reference

### Test Commands Cheat Sheet

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch

# Run specific test file
pnpm test path/to/test.test.ts

# Run tests matching pattern
pnpm test -t "pattern"

# Run with UI
pnpm test:ui

# E2E tests
pnpm test:e2e
pnpm test:e2e:ui
pnpm test:e2e:headed
```

### Coverage Targets

- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [React Testing Library](https://testing-library.com/react)

---

## Support

For issues or questions about the test suite:

1. Check this guide
2. Review test examples in the codebase
3. Consult the team documentation
4. Create an issue in the project repository

---

## Next Steps

After setting up tests:

1. ✅ Run all tests to ensure they pass
2. ✅ Review coverage reports
3. ✅ Add tests for new features as you develop
4. ✅ Integrate tests into CI/CD pipeline
5. ✅ Set up pre-commit hooks for automatic testing

---

**Last Updated**: December 2024
**Maintained By**: Development Team
**Test Framework Versions**: Vitest 1.1.0, Playwright 1.40.1
