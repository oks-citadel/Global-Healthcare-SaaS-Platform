# Vibecode Integration - Unified Health

## Overview

This workspace is configured for **controlled UI/UX generation** with strict security boundaries for healthcare compliance.

## Allowed Export Paths

Vibecode-generated code may ONLY be written to:

```
apps/web/src/ui/
apps/web/src/components/
apps/mobile/app/screens/
apps/mobile/src/components/
packages/ui/src/
```

## Blocked Content

The following are **NEVER** allowed in generated code:

- Environment variables or secrets
- Direct API endpoints or URLs
- Database connection strings
- AWS/cloud credentials
- Authentication tokens
- PHI (Protected Health Information)

## API Call Requirements

All API calls **MUST** use the SDK:

```typescript
import { api } from '@unified-health/sdk';

// CORRECT - Use SDK client
const appointments = await api.appointments.list();

// WRONG - Direct fetch calls are blocked
const data = await fetch('/api/appointments'); // BLOCKED
```

## Component Generation Guidelines

### Web Components (Next.js)

```typescript
// Use workspace UI components
import { Button, Card, Input } from '@unified-health/ui';
import { useAuth } from '@unified-health/sdk';

export function PatientCard({ patientId }: { patientId: string }) {
  const { user } = useAuth();
  // Component implementation
}
```

### Mobile Components (Expo)

```typescript
// Use React Native components with SDK
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@unified-health/sdk';

export function AppointmentList() {
  const { data } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => api.appointments.list(),
  });
  // Component implementation
}
```

## Security Enforcement

This configuration enforces:

1. **No hardcoded endpoints** - All URLs from environment
2. **No direct API calls** - Must use SDK
3. **No secret exposure** - Blocked at generation time
4. **Input validation** - Required for all user inputs
5. **Output sanitization** - Required for displayed data

## Compliance

- HIPAA: PHI handling rules enforced
- GDPR: Data privacy controls active
- SOC2: Security controls enabled
