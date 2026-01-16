# @global-health/policy

Policy evaluation engine for feature gating, consent management, and audit logging based on country-specific configurations.

## Features

- **Policy Evaluation**: Evaluate features and policies based on country configuration
- **Feature Gating**: Control feature access with country-specific rules
- **Consent Management**: Handle consent with opt-in/opt-out models
- **Audit Logging**: Comprehensive audit event tracking and reporting
- **Type Safety**: Full TypeScript support

## Installation

```bash
npm install @global-health/policy @global-health/country-config
```

## Usage

### Policy Evaluation

```typescript
import { PolicyEngine } from '@global-health/policy';

const context = {
  countryCode: 'US',
  userId: 'user-123',
  organizationId: 'org-456',
};

// Check if telehealth is allowed
const result = PolicyEngine.evaluateFeature('telehealth', context);

if (result.allowed) {
  console.log('Telehealth is allowed');
} else {
  console.log('Telehealth not allowed:', result.reason);
}
```

### Feature Gating

```typescript
import { FeatureGate } from '@global-health/policy';

const context = {
  countryCode: 'DE',
  userId: 'user-123',
};

// Check if AI diagnosis is enabled
const aiEnabled = await FeatureGate.isEnabled('aiDiagnosis', context);

if (aiEnabled) {
  // Show AI diagnosis features
} else {
  // Hide AI features
}
```

### Feature Flags

```typescript
import { FeatureGate } from '@global-health/policy';

// Register a feature flag
FeatureGate.registerFlag({
  name: 'feature.videoConsultation',
  enabled: true,
  countries: ['US', 'DE'],
  rolloutPercentage: 50, // 50% gradual rollout
});

// Check if enabled for user
const enabled = await FeatureGate.isEnabled('videoConsultation', context);
```

### Consent Management

```typescript
import { ConsentManager } from '@global-health/policy';

// Grant consent
const consent = ConsentManager.grantConsent(
  'user-123',
  ['treatment', 'research', 'data-sharing'],
  'US',
  'patient-456'
);

// Check consent
const hasConsent = ConsentManager.hasConsent(
  'user-123',
  'research',
  'US',
  'patient-456'
);

if (hasConsent.allowed) {
  // Proceed with research data usage
} else {
  console.log('Consent denied:', hasConsent.reason);
}

// Withdraw consent
ConsentManager.withdrawConsent(consent.id, 'US');
```

### Audit Logging

```typescript
import { AuditEmitter } from '@global-health/policy';

// Add audit listener
AuditEmitter.addListener(async (event) => {
  console.log('Audit event:', event);
  // Send to logging service, database, etc.
});

// Emit audit event
await AuditEmitter.emit(
  'access',
  'View patient record',
  'success',
  {
    userId: 'user-123',
    patientId: 'patient-456',
    resourceType: 'Patient',
    resourceId: 'patient-456',
    countryCode: 'US',
    ipAddress: '192.168.1.1',
  }
);

// Generate audit report
const report = AuditEmitter.generateReport(
  'US',
  '2024-01-01T00:00:00Z',
  '2024-12-31T23:59:59Z'
);

console.log('Total events:', report.totalEvents);
console.log('Events by type:', report.eventsByType);
```

### Data Residency

```typescript
import { PolicyEngine } from '@global-health/policy';

// Check if data can be transferred to a specific region
const residencyCheck = PolicyEngine.evaluateDataResidency(
  'US', // target region
  { countryCode: 'DE', userId: 'user-123' }
);

if (!residencyCheck.allowed) {
  console.log('Cross-border transfer not allowed:', residencyCheck.reason);
}

if (residencyCheck.warnings) {
  console.warn('Transfer requirements:', residencyCheck.warnings);
}
```

### Retention Periods

```typescript
import { PolicyEngine } from '@global-health/policy';

// Get retention period for patient records
const retentionYears = PolicyEngine.getRetentionPeriod(
  'patientRecords',
  { countryCode: 'US' }
);

console.log(`Patient records must be retained for ${retentionYears} years`);
```

### Decorators

```typescript
import { FeatureGate, AuditEmitter } from '@global-health/policy';

class TelehealthService {
  // Feature gate decorator
  @FeatureGate.createDecorator('videoConsultation')
  async startVideoCall(context: FeatureContext) {
    // This method only executes if videoConsultation is enabled
    return 'Video call started';
  }

  // Audit decorator
  @AuditEmitter.createDecorator(
    'access',
    'Access patient data',
    (args) => ({
      userId: args[0].userId,
      patientId: args[0].patientId,
      countryCode: args[0].countryCode,
    })
  )
  async getPatientData(context: any) {
    // Automatically audited
    return { /* patient data */ };
  }
}
```

### Batch Policy Evaluation

```typescript
import { PolicyEngine } from '@global-health/policy';

const policies = [
  {
    type: 'feature' as const,
    name: 'telehealth',
    context: { countryCode: 'US' },
  },
  {
    type: 'feature' as const,
    name: 'aiDiagnosis',
    context: { countryCode: 'US' },
  },
];

const decisions = PolicyEngine.evaluatePolicies(policies);

decisions.forEach(decision => {
  console.log(`${decision.decision}: ${decision.reason}`);
});
```

## API Reference

### PolicyEngine

- `evaluateFeature(feature, context)` - Evaluate if a feature is allowed
- `evaluateCustomFeature(name, context)` - Evaluate custom feature
- `evaluateDataResidency(targetRegion, context)` - Check data transfer rules
- `requiresEncryption(context)` - Check encryption requirements
- `getRetentionPeriod(dataType, context)` - Get retention period
- `getRequiredAuditEvents(context)` - Get required audit events

### FeatureGate

- `isEnabled(feature, context)` - Check if feature is enabled
- `isCustomFeatureEnabled(name, context)` - Check custom feature
- `registerFlag(flag)` - Register feature flag
- `getEnabledFeatures(context)` - Get all enabled features

### ConsentManager

- `grantConsent(userId, scopes, countryCode, patientId)` - Grant consent
- `withdrawConsent(consentId, countryCode)` - Withdraw consent
- `hasConsent(userId, scope, countryCode, patientId)` - Check consent
- `getUserConsents(userId, patientId)` - Get user consents
- `getAvailableScopes(countryCode)` - Get available scopes

### AuditEmitter

- `emit(type, action, outcome, context)` - Emit audit event
- `addListener(listener)` - Add event listener
- `getEvents(filter)` - Get audit events
- `generateReport(countryCode, startDate, endDate)` - Generate report
- `purgeOldEvents(countryCode)` - Purge old events

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

## License

MIT
