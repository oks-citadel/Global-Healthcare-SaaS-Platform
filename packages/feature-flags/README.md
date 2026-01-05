# @unified-health/feature-flags

A lightweight, Redis-backed feature flag system for the Unified Health platform with support for boolean flags, percentage rollouts, user targeting, and A/B testing variants.

## Features

- **Boolean Flags**: Simple on/off feature toggles
- **Percentage Rollouts**: Gradual feature rollout to a percentage of users
- **User Targeting**: Target specific users or groups
- **A/B Testing Variants**: Support for multiple variants with weighted distribution
- **Scheduled Flags**: Enable/disable flags based on schedule
- **React Integration**: Hooks and components for React applications
- **Redis-backed**: Production-ready storage with Redis
- **In-memory Store**: For development and testing
- **Type-safe**: Full TypeScript support

## Installation

```bash
pnpm add @unified-health/feature-flags
```

## Quick Start

### Server-side

```typescript
import {
  FeatureFlagClient,
  RedisFeatureFlagStore,
  UNIFIED_HEALTH_FLAGS,
} from "@unified-health/feature-flags";
import Redis from "ioredis";

// Create Redis client
const redis = new Redis(process.env.REDIS_URL);

// Create feature flag store
const store = new RedisFeatureFlagStore(redis);

// Create client
const featureFlags = new FeatureFlagClient({
  store,
  defaultFlags: {
    [UNIFIED_HEALTH_FLAGS.TELEHEALTH_V2]: false,
  },
  enableLogging: process.env.NODE_ENV === "development",
});

// Check if a flag is enabled
const isEnabled = await featureFlags.isEnabled(
  UNIFIED_HEALTH_FLAGS.NEW_APPOINTMENT_UI,
  { userId: "user-123" },
);

// Get variant for A/B test
const variant = await featureFlags.getVariant(
  UNIFIED_HEALTH_FLAGS.NEW_DASHBOARD,
  { userId: "user-123" },
);
```

### React Application

```tsx
import {
  FeatureFlagProvider,
  Feature,
  useFeatureFlag,
  useVariant,
} from "@unified-health/feature-flags/react";

// In your app root
function App() {
  return (
    <FeatureFlagProvider
      client={featureFlags}
      initialContext={{ userId: currentUser.id }}
    >
      <AppContent />
    </FeatureFlagProvider>
  );
}

// Using the Feature component
function Dashboard() {
  return (
    <Feature flag="new-dashboard" fallback={<OldDashboard />}>
      <NewDashboard />
    </Feature>
  );
}

// Using hooks
function AppointmentBooking() {
  const newUIEnabled = useFeatureFlag("new-appointment-ui");

  if (newUIEnabled) {
    return <NewAppointmentUI />;
  }

  return <LegacyAppointmentUI />;
}

// A/B Testing
function PaymentFlow() {
  const variant = useVariant("payment-flow-test");

  switch (variant) {
    case "control":
      return <OriginalPaymentFlow />;
    case "variant-a":
      return <SimplifiedPaymentFlow />;
    case "variant-b":
      return <OneClickPayment />;
    default:
      return <OriginalPaymentFlow />;
  }
}
```

## Creating Flags

### Boolean Flag

```typescript
import { createBooleanFlag } from "@unified-health/feature-flags";

await featureFlags.setFlag(
  createBooleanFlag("dark-mode", "Dark Mode", true, "Enable dark mode theme"),
);
```

### Percentage Rollout

```typescript
import { createPercentageFlag } from "@unified-health/feature-flags";

// Roll out to 25% of users
await featureFlags.setFlag(
  createPercentageFlag(
    "new-appointment-ui",
    "New Appointment UI",
    25,
    "Redesigned appointment booking interface",
  ),
);
```

### A/B Test Variants

```typescript
import { createVariantFlag } from "@unified-health/feature-flags";

await featureFlags.setFlag(
  createVariantFlag(
    "checkout-flow-test",
    "Checkout Flow A/B Test",
    [
      { key: "control", weight: 50 },
      { key: "simplified", weight: 25 },
      { key: "one-click", weight: 25 },
    ],
    "Testing different checkout experiences",
  ),
);
```

### User Targeted Flag

```typescript
await featureFlags.setFlag({
  key: "beta-features",
  name: "Beta Features",
  description: "Early access features for beta testers",
  type: "user-targeted",
  status: "enabled",
  defaultValue: false,
  targetedUsers: ["user-123", "user-456"],
  targetedGroups: ["beta-testers", "internal-team"],
});
```

### Scheduled Flag

```typescript
await featureFlags.setFlag({
  key: "holiday-theme",
  name: "Holiday Theme",
  description: "Special holiday theme",
  type: "boolean",
  status: "scheduled",
  defaultValue: true,
  schedule: {
    startAt: "2026-12-20T00:00:00Z",
    endAt: "2026-01-02T23:59:59Z",
  },
});
```

## API Reference

### FeatureFlagClient

| Method                        | Description                   |
| ----------------------------- | ----------------------------- |
| `isEnabled(key, context?)`    | Check if a flag is enabled    |
| `evaluate(key, context?)`     | Get full evaluation result    |
| `getVariant(key, context?)`   | Get variant for A/B test      |
| `evaluateAll(keys, context?)` | Batch evaluate multiple flags |
| `getAllFlags(context?)`       | Get all flags for hydration   |
| `setFlag(flag)`               | Create or update a flag       |
| `deleteFlag(key)`             | Delete a flag                 |
| `clearCache()`                | Clear local cache             |

### React Hooks

| Hook                        | Description          |
| --------------------------- | -------------------- |
| `useFeatureFlags()`         | Access full context  |
| `useFeatureFlag(key)`       | Check single flag    |
| `useVariant(key)`           | Get A/B test variant |
| `useFeatureFlagBatch(keys)` | Check multiple flags |
| `useFeatureFlagAsync(key)`  | Real-time evaluation |

### React Components

| Component                             | Description           |
| ------------------------------------- | --------------------- |
| `<Feature flag="..." fallback={...}>` | Conditional rendering |
| `<Variant flag="..." variants={...}>` | Variant rendering     |
| `<FeatureFlagLoading fallback={...}>` | Loading state         |

### HOCs

| HOC                                              | Description         |
| ------------------------------------------------ | ------------------- |
| `withFeatureFlag(Component, flagKey)`            | Inject flag as prop |
| `withFeatureGate(Component, flagKey, Fallback?)` | Gate component      |

## Predefined Flags

The package includes predefined flag keys for Unified Health:

```typescript
import { UNIFIED_HEALTH_FLAGS } from "@unified-health/feature-flags";

// UI Features
UNIFIED_HEALTH_FLAGS.NEW_APPOINTMENT_UI;
UNIFIED_HEALTH_FLAGS.TELEHEALTH_V2;
UNIFIED_HEALTH_FLAGS.DARK_MODE;
UNIFIED_HEALTH_FLAGS.NEW_DASHBOARD;

// Backend Features
UNIFIED_HEALTH_FLAGS.AI_SYMPTOM_CHECKER;
UNIFIED_HEALTH_FLAGS.REAL_TIME_NOTIFICATIONS;
UNIFIED_HEALTH_FLAGS.ADVANCED_ANALYTICS;

// Billing Features
UNIFIED_HEALTH_FLAGS.NEW_PAYMENT_FLOW;
UNIFIED_HEALTH_FLAGS.SUBSCRIPTION_PAUSE;
UNIFIED_HEALTH_FLAGS.FAMILY_PLANS;

// Provider Features
UNIFIED_HEALTH_FLAGS.PROVIDER_AVAILABILITY_V2;
UNIFIED_HEALTH_FLAGS.VIDEO_RECORDING;
UNIFIED_HEALTH_FLAGS.E_PRESCRIBE;

// Compliance
UNIFIED_HEALTH_FLAGS.HIPAA_ENHANCED_LOGGING;
UNIFIED_HEALTH_FLAGS.CONSENT_V2;

// Experimental
UNIFIED_HEALTH_FLAGS.BETA_FEATURES;
UNIFIED_HEALTH_FLAGS.INTERNAL_TESTING;
```

## Development

### Using In-Memory Store

For development and testing, use the in-memory store:

```typescript
import {
  FeatureFlagClient,
  InMemoryFeatureFlagStore,
} from "@unified-health/feature-flags";

const store = new InMemoryFeatureFlagStore();
const client = new FeatureFlagClient({ store });
```

### Testing

```typescript
// In your test setup
import {
  InMemoryFeatureFlagStore,
  FeatureFlagClient,
} from "@unified-health/feature-flags";

const store = new InMemoryFeatureFlagStore();
const client = new FeatureFlagClient({ store });

// Set up test flags
await client.setFlag(createBooleanFlag("test-flag", "Test", true));

// Run your tests
expect(await client.isEnabled("test-flag")).toBe(true);
```

## Best Practices

1. **Use meaningful flag names**: Use kebab-case and descriptive names
2. **Set default values**: Always provide sensible defaults
3. **Clean up old flags**: Remove flags after full rollout
4. **Document flag purpose**: Include descriptions
5. **Use percentage rollouts**: Gradually roll out new features
6. **Monitor flag evaluations**: Track flag usage in analytics
7. **Test both states**: Test with flags enabled and disabled

## License

MIT
