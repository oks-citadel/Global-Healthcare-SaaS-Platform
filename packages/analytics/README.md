# @unified-health/analytics

A privacy-compliant, HIPAA/GDPR-safe analytics system for the Unified Health platform.

## Features

- **Privacy-First**: Never collects PII without explicit consent
- **HIPAA/GDPR Compliant**: Automatic PII sanitization
- **Consent Management**: Built-in consent tracking
- **Multiple Providers**: Support for custom analytics backends
- **React Integration**: Hooks and components for React apps
- **Anonymization**: User IDs are hashed, never stored raw

## Installation

```bash
pnpm add @unified-health/analytics
```

## Quick Start

### Initialize Client

```typescript
import {
  AnalyticsClient,
  ConsoleAnalyticsProvider,
  ServerAnalyticsProvider,
} from "@unified-health/analytics";

const analytics = new AnalyticsClient({
  providers: [
    new ConsoleAnalyticsProvider(), // For development
    new ServerAnalyticsProvider({
      endpoint: "/api/analytics",
      batchSize: 10,
      flushInterval: 5000,
    }),
  ],
  defaultConsent: "essential",
  debug: process.env.NODE_ENV === "development",
});

await analytics.initialize();
```

### Basic Tracking

```typescript
// Track custom event
await analytics.track("button_clicked", { buttonId: "signup" });

// Track page view
await analytics.page("/dashboard", "Dashboard");

// Track conversion
await analytics.trackConversion("subscription_started", 99.99, {
  plan: "premium",
});

// Track error
await analytics.trackError(new Error("API failed"), {
  endpoint: "/api/users",
});

// Identify user (anonymized)
await analytics.identify("user-123", { plan: "premium" });
```

### React Integration

```tsx
import {
  AnalyticsProvider,
  useAnalytics,
  useTrackEvent,
  usePageView,
  useAutoPageView,
  ConsentBanner,
} from "@unified-health/analytics/react";

// Wrap your app
function App() {
  return (
    <AnalyticsProvider client={analytics}>
      <ConsentBanner
        onAcceptAll={() => console.log("Accepted all")}
        onAcceptEssential={() => console.log("Essential only")}
      />
      <AppContent />
    </AnalyticsProvider>
  );
}

// Track page views automatically
function AppContent() {
  useAutoPageView();
  return <Routes />;
}

// Use tracking hooks
function SignupButton() {
  const track = useTrackEvent();

  const handleClick = () => {
    track("signup_button_clicked", { location: "header" });
    // ... actual signup logic
  };

  return <button onClick={handleClick}>Sign Up</button>;
}

// Track specific pages
function Dashboard() {
  usePageView("/dashboard", "Dashboard");
  return <div>Dashboard content</div>;
}
```

## Consent Management

### Consent Levels

| Level       | Description                          |
| ----------- | ------------------------------------ |
| `none`      | No tracking (only essential cookies) |
| `essential` | Essential analytics only             |
| `analytics` | Full analytics tracking              |
| `marketing` | Marketing and remarketing            |
| `all`       | All tracking enabled                 |

### Using Consent

```tsx
import { useConsent } from "@unified-health/analytics/react";

function PrivacySettings() {
  const { consent, updateConsent, hasAnalyticsConsent, hasMarketingConsent } =
    useConsent();

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={hasAnalyticsConsent}
          onChange={(e) =>
            updateConsent(e.target.checked ? "analytics" : "essential")
          }
        />
        Analytics Cookies
      </label>
    </div>
  );
}
```

## Privacy Features

### Automatic PII Sanitization

The following fields are automatically stripped from events:

- email, phone, ssn, name, address
- dob, dateOfBirth, birth
- password, credit, card
- medical, health, diagnosis
- prescription, insurance

### User ID Anonymization

User IDs are SHA-256 hashed before storage:

```typescript
// You pass: 'user-123'
// Stored as: 'a665a45920422f9d417e4867efdc4fb8...'
```

### Safe User Traits

Only safe traits are stored:

- plan, accountType, role
- locale, timezone, createdAt

## Predefined Events

```typescript
import { ANALYTICS_EVENTS } from "@unified-health/analytics";

// Authentication
ANALYTICS_EVENTS.LOGIN_COMPLETED;
ANALYTICS_EVENTS.SIGNUP_COMPLETED;
ANALYTICS_EVENTS.LOGOUT;

// Appointments
ANALYTICS_EVENTS.APPOINTMENT_BOOKED;
ANALYTICS_EVENTS.APPOINTMENT_CANCELLED;

// Telehealth
ANALYTICS_EVENTS.TELEHEALTH_SESSION_JOINED;

// Billing
ANALYTICS_EVENTS.PAYMENT_COMPLETED;
ANALYTICS_EVENTS.SUBSCRIPTION_STARTED;

// Engagement
ANALYTICS_EVENTS.FEATURE_USED;
ANALYTICS_EVENTS.SEARCH_PERFORMED;
```

## Server-side Analytics Endpoint

Create an API endpoint to receive analytics:

```typescript
// /api/analytics.ts
export async function POST(req: Request) {
  const { events } = await req.json();

  for (const event of events) {
    // Store in your analytics database
    await db.analyticsEvents.create({
      data: {
        type: event.type,
        data: event.data,
        receivedAt: new Date(),
      },
    });
  }

  return Response.json({ success: true });
}
```

## Custom Providers

Create custom providers for other analytics services:

```typescript
import type { AnalyticsProvider } from "@unified-health/analytics";

class MixpanelProvider implements AnalyticsProvider {
  name = "mixpanel";
  requiredConsent = "analytics" as const;

  async initialize() {
    // Initialize Mixpanel SDK
  }

  async track(event, user) {
    mixpanel.track(event.name, {
      ...event.properties,
      distinct_id: user.anonymousId,
    });
  }

  async page(pageView, user) {
    mixpanel.track("Page Viewed", {
      path: pageView.path,
      distinct_id: user.anonymousId,
    });
  }

  async identify(user) {
    mixpanel.identify(user.anonymousId);
  }

  async reset() {
    mixpanel.reset();
  }
}
```

## Best Practices

1. **Always get consent first**: Don't track until user consents
2. **Use predefined events**: Consistent naming across the app
3. **Don't include PII in properties**: Even if allowed, avoid it
4. **Test with console provider**: Verify events in development
5. **Batch server requests**: Reduce network overhead
6. **Handle failures gracefully**: Analytics should never break the app

## HIPAA Compliance Notes

- User IDs are hashed, never stored raw
- Medical information is never included in events
- All PII fields are automatically stripped
- Consent is tracked and versioned
- Data retention policies should be configured server-side

## License

MIT
