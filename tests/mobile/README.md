# Mobile App E2E Testing

This directory contains end-to-end tests for the Unified Health mobile app (Expo/React Native).

## Testing Frameworks

### 1. Maestro (Recommended for Local Development)
Maestro is a mobile UI testing framework that works well with Expo managed workflow.

```bash
# Install Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# Run flows
maestro test tests/mobile/maestro/auth-flow.yaml
maestro test tests/mobile/maestro/
```

### 2. Detox (For CI/CD)
Detox provides robust E2E testing for React Native apps.

```bash
# Requires expo-dev-client for Expo apps
cd apps/mobile
npx expo install expo-dev-client
npx detox build -c ios.sim.debug
npx detox test -c ios.sim.debug
```

### 3. Jest Component Tests
Unit and integration tests for React Native components.

```bash
cd apps/mobile
pnpm test
```

## Directory Structure

```
tests/mobile/
├── maestro/           # Maestro flow files (YAML)
│   ├── auth-flow.yaml
│   ├── appointments-flow.yaml
│   ├── booking-flow.yaml
│   └── messaging-flow.yaml
├── detox/             # Detox test files
│   ├── auth.e2e.ts
│   ├── appointments.e2e.ts
│   └── config/
├── components/        # Component unit tests
└── helpers/           # Test utilities
```

## Running Tests

### Local Development
```bash
# Start the app
cd apps/mobile && pnpm dev

# In another terminal, run Maestro tests
maestro test tests/mobile/maestro/auth-flow.yaml
```

### CI/CD
```bash
# Build and test with Detox
pnpm test:mobile:e2e
```

## Test Data

Tests use the seeded test data from the API:
- Patient: patient@test.unified.health / TestPassword123!
- Provider: provider@test.unified.health / TestPassword123!
