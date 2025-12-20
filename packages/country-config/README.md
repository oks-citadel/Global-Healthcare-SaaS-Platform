# @global-health/country-config

Country-specific configuration for healthcare compliance, data residency, and feature management.

## Features

- **Country Configurations**: Pre-built configs for US (HIPAA), Germany (GDPR), Kenya (DPA)
- **Validation**: Schema and business rule validation
- **Configuration Loader**: Caching and dynamic loading
- **Type Safety**: Full TypeScript support
- **Compliance**: Built-in support for HIPAA, GDPR, and other frameworks

## Installation

```bash
npm install @global-health/country-config
```

## Usage

### Initialize Default Configurations

```typescript
import { initializeDefaultConfigs, ConfigLoader } from '@global-health/country-config';

// Load default country configs (US, Germany, Kenya)
initializeDefaultConfigs();
```

### Load Country Configuration

```typescript
import { ConfigLoader } from '@global-health/country-config';

// Load config for a specific country
const usConfig = ConfigLoader.load('US');

if (usConfig) {
  console.log('Country:', usConfig.name);
  console.log('Framework:', usConfig.regulatoryFramework);
  console.log('Telehealth allowed:', usConfig.features.telehealth);
}
```

### Check Feature Availability

```typescript
const isTelehealthAllowed = ConfigLoader.isFeatureAllowed('US', 'telehealth');

if (isTelehealthAllowed) {
  // Enable telehealth features
}
```

### Get Provider Configuration

```typescript
const ehrProviders = ConfigLoader.getProviders('US', 'ehr');

ehrProviders.forEach(provider => {
  console.log('Provider:', provider.name);
  console.log('Required:', provider.required);
  console.log('Auth method:', provider.authMethod);
});
```

### Register Custom Configuration

```typescript
import { CountryConfig } from '@global-health/country-config';

const customConfig: CountryConfig = {
  region: 'Asia',
  countryCode: 'IN',
  name: 'India',
  enabled: true,
  regulatoryFramework: ['Digital Personal Data Protection Act'],
  // ... rest of configuration
};

ConfigLoader.register(customConfig);
```

### Validate Configuration

```typescript
import { validateComplete } from '@global-health/country-config';

const validation = validateComplete(config);

if (validation.valid) {
  console.log('Configuration is valid');
} else {
  console.error('Errors:', validation.errors);
  console.warn('Warnings:', validation.warnings);
}
```

## Country Configurations

### United States (US)

- **Framework**: HIPAA, HITECH
- **Data Residency**: Regional (US, CA)
- **Encryption**: Required (AES-256, TLS 1.3)
- **Consent Model**: Opt-in
- **Retention**: 6 years (patient records)
- **Providers**: Epic/Cerner, CommonWell, Twilio, Stripe

### Germany (DE)

- **Framework**: GDPR, BDSG, SGB V
- **Data Residency**: In-country only
- **Encryption**: Required with eHealth standards
- **Consent Model**: Opt-in (explicit)
- **Retention**: 10 years
- **Providers**: Telematik Infrastructure, ePA, SEPA

### Kenya (KE)

- **Framework**: Kenya Data Protection Act 2019
- **Data Residency**: In-country (transfer allowed)
- **Encryption**: Required (AES-256)
- **Consent Model**: Opt-in
- **Retention**: 10 years
- **Providers**: OpenMRS, DHIS2, M-Pesa, Africa's Talking

## Configuration Structure

```typescript
interface CountryConfig {
  region: string;
  countryCode: string;
  name: string;
  enabled: boolean;
  regulatoryFramework: string[];
  residency: ResidencyRules;
  features: AllowedFeatures;
  consent: ConsentRules;
  retention: RetentionPeriods;
  audit: AuditRequirements;
  providers: ProviderConfig[];
  logging: LoggingConstraints;
  timezone: string;
  languages: string[];
  currency: string;
}
```

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
