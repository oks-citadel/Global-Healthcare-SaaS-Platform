# Global Healthcare Platform - Packages Overview

This document provides an overview of the three core packages created for the Global Healthcare SaaS Platform.

## Package Structure

```
packages/
├── fhir/                      # FHIR R4 resource types and utilities
├── country-config/            # Country-specific configurations
└── policy/                    # Policy evaluation engine
```

## 1. @global-health/fhir

**Purpose**: FHIR R4 canonical resource schemas, validation, and conversion utilities

### Directory Structure
```
packages/fhir/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts
    ├── types/
    │   ├── base.ts                    # Base FHIR types (Identifier, HumanName, etc.)
    │   ├── patient.ts                 # Patient resource
    │   ├── practitioner.ts            # Practitioner resource
    │   ├── organization.ts            # Organization resource
    │   ├── encounter.ts               # Encounter resource
    │   ├── appointment.ts             # Appointment resource
    │   ├── observation.ts             # Observation resource
    │   ├── condition.ts               # Condition resource
    │   ├── medication-request.ts      # MedicationRequest resource
    │   ├── diagnostic-report.ts       # DiagnosticReport resource
    │   ├── allergy-intolerance.ts     # AllergyIntolerance resource
    │   └── consent.ts                 # Consent resource
    ├── validation/
    │   ├── schemas.ts                 # Zod validation schemas
    │   └── validator.ts               # Validation functions
    ├── conversion/
    │   ├── r4-to-r5.ts               # R4 to R5 conversion
    │   └── r5-to-r4.ts               # R5 to R4 conversion
    ├── terminology/
    │   └── hooks.ts                   # SNOMED, LOINC, ICD placeholders
    └── utils/
        └── export.ts                  # Export utilities (JSON, NDJSON, Bundle)
```

### Key Features
- ✅ Complete TypeScript interfaces for 11 FHIR R4 resources
- ✅ Zod-based validation for all resources
- ✅ R4 ↔ R5 conversion utilities with warnings
- ✅ Terminology service placeholders (SNOMED CT, LOINC, ICD)
- ✅ Export utilities (JSON, NDJSON, Bundle)
- ✅ Filter and summary utilities

## 2. @global-health/country-config

**Purpose**: Country-specific configuration for healthcare compliance and features

### Directory Structure
```
packages/country-config/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts
    ├── types.ts                       # TypeScript interfaces
    ├── validation.ts                  # Schema and business rule validation
    ├── loader.ts                      # Configuration loader with caching
    └── configs/
        ├── us.ts                      # United States (HIPAA)
        ├── germany.ts                 # Germany (GDPR)
        └── kenya.ts                   # Kenya (DPA)
```

### Key Features
- ✅ Comprehensive `CountryConfig` interface with:
  - Data residency rules (regional, in-country, global)
  - Allowed features (telehealth, video, eRx, AI, etc.)
  - Consent rules (opt-in/out, scopes, validity)
  - Retention periods (patient records, imaging, logs, etc.)
  - Audit requirements (events, frequency, recipients)
  - Provider configurations (EHR, HIE, SMS, Payment, IDV)
  - Logging constraints (PHI redaction, retention)
- ✅ Pre-built configurations for:
  - **US**: HIPAA compliance, regional residency, Epic/Cerner integration
  - **Germany**: GDPR compliance, Telematik Infrastructure, strict in-country rules
  - **Kenya**: DPA compliance, OpenMRS/DHIS2, M-Pesa, mobile-first
- ✅ Configuration validation (schema + business rules)
- ✅ Configuration loader with caching and fallback support

## 3. @global-health/policy

**Purpose**: Policy evaluation engine for feature gating, consent, and audit

### Directory Structure
```
packages/policy/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts
    ├── types.ts                       # Policy types
    ├── engine.ts                      # Policy evaluation engine
    ├── feature-gate.ts                # Feature gating utilities
    ├── consent.ts                     # Consent management
    └── audit.ts                       # Audit event emitter
```

### Key Features
- ✅ **Policy Engine**:
  - Feature evaluation based on country config
  - Custom feature evaluation
  - Data residency evaluation
  - Encryption requirement checks
  - Retention period lookups
  - Batch policy evaluation

- ✅ **Feature Gating**:
  - Check if features are enabled per country
  - Feature flag support (rollout %, targeting)
  - Batch feature checks
  - TypeScript decorators for method-level gating

- ✅ **Consent Management**:
  - Grant/withdraw consent
  - Opt-in and opt-out model support
  - Scope-based consent checking
  - Consent expiration and reconfirmation
  - Multi-scope validation

- ✅ **Audit Logging**:
  - Event emission with listeners
  - Country-specific required events
  - Audit report generation
  - Event filtering and querying
  - NDJSON export for log shipping
  - Retention-based purging
  - TypeScript decorators for automatic auditing

## Dependencies

### FHIR Package
```json
{
  "dependencies": {
    "zod": "^3.22.4"
  }
}
```

### Country-Config Package
```json
{
  "dependencies": {
    "zod": "^3.22.4"
  }
}
```

### Policy Package
```json
{
  "dependencies": {
    "@global-health/country-config": "^1.0.0"
  }
}
```

## Installation & Build

### Install Dependencies
```bash
# From project root
npm install

# Or using pnpm (if configured)
pnpm install
```

### Build All Packages
```bash
# Build FHIR package
cd packages/fhir
npm run build

# Build Country-Config package
cd packages/country-config
npm run build

# Build Policy package
cd packages/policy
npm run build
```

### Watch Mode (Development)
```bash
# In separate terminals
cd packages/fhir && npm run dev
cd packages/country-config && npm run dev
cd packages/policy && npm run dev
```

## Usage Examples

### Example 1: Feature-Gated Telehealth

```typescript
import { initializeDefaultConfigs } from '@global-health/country-config';
import { FeatureGate } from '@global-health/policy';

// Initialize country configs
initializeDefaultConfigs();

// Check if telehealth is allowed
const context = { countryCode: 'US', userId: 'user-123' };
const allowed = await FeatureGate.isEnabled('telehealth', context);

if (allowed) {
  // Show telehealth features
}
```

### Example 2: FHIR Resource Validation

```typescript
import { Patient } from '@global-health/fhir';
import { FHIRValidator } from '@global-health/fhir';

const patient: Patient = {
  resourceType: 'Patient',
  name: [{ family: 'Doe', given: ['John'] }],
  gender: 'male',
};

const result = FHIRValidator.validatePatient(patient);
if (result.valid) {
  // Save to database
}
```

### Example 3: Consent Management

```typescript
import { ConsentManager } from '@global-health/policy';

// Grant consent
const consent = ConsentManager.grantConsent(
  'user-123',
  ['treatment', 'research'],
  'US'
);

// Check consent before accessing research data
const hasConsent = ConsentManager.hasConsent(
  'user-123',
  'research',
  'US'
);

if (hasConsent.allowed) {
  // Access research data
}
```

### Example 4: Audit Logging

```typescript
import { AuditEmitter } from '@global-health/policy';

// Add listener to send to logging service
AuditEmitter.addListener(async (event) => {
  await loggingService.send(event);
});

// Emit audit event
await AuditEmitter.emit('access', 'View patient record', 'success', {
  userId: 'user-123',
  patientId: 'patient-456',
  countryCode: 'US',
});
```

## Integration with Platform

These packages integrate with the platform as follows:

1. **FHIR Package** → Used by:
   - Backend services for FHIR resource handling
   - API layer for validation
   - EHR/HIE adapters for data conversion

2. **Country-Config Package** → Used by:
   - All services requiring country-specific rules
   - Tenant configuration system
   - Compliance enforcement layer

3. **Policy Package** → Used by:
   - API middleware for feature gating
   - Consent service
   - Audit logging service
   - Access control layer

## Next Steps

1. **Testing**: Add comprehensive unit tests for each package
2. **Documentation**: Add JSDoc comments for all public APIs
3. **Integration**: Integrate with existing platform services
4. **Expansion**: Add more country configurations as needed
5. **Validation**: Implement real terminology service connections
6. **Performance**: Add caching layers for policy evaluation

## License

MIT
