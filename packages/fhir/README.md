# @global-health/fhir

FHIR R4 canonical resource schemas, validation, and conversion utilities for the Global Healthcare Platform.

## Features

- **TypeScript Interfaces**: Complete type definitions for FHIR R4 resources
- **Validation**: Zod-based schema validation for all resource types
- **Conversion**: R4 to R5 and R5 to R4 conversion utilities
- **Terminology**: Placeholder hooks for SNOMED CT, LOINC, and ICD integration
- **Export Utilities**: JSON, NDJSON, and Bundle export capabilities

## Supported Resources

- Patient
- Practitioner
- Organization
- Encounter
- Appointment
- Observation
- Condition
- MedicationRequest
- DiagnosticReport
- AllergyIntolerance
- Consent

## Installation

```bash
npm install @global-health/fhir
```

## Usage

### Type Definitions

```typescript
import { Patient, Practitioner, Observation } from '@global-health/fhir';

const patient: Patient = {
  resourceType: 'Patient',
  id: 'patient-123',
  name: [
    {
      family: 'Doe',
      given: ['John'],
    },
  ],
  gender: 'male',
  birthDate: '1990-01-01',
};
```

### Validation

```typescript
import { FHIRValidator } from '@global-health/fhir';

const result = FHIRValidator.validatePatient(patientData);

if (result.valid) {
  console.log('Patient is valid:', result.data);
} else {
  console.error('Validation errors:', result.errors);
}
```

### R4 to R5 Conversion

```typescript
import { convertR4ToR5 } from '@global-health/fhir';

const r5Patient = convertR4ToR5(r4Patient);

if (r5Patient.success) {
  console.log('Converted to R5:', r5Patient.data);
  if (r5Patient.warnings) {
    console.warn('Warnings:', r5Patient.warnings);
  }
}
```

### Terminology Services

```typescript
import { SNOMEDService, LOINCService, ICDService } from '@global-health/fhir';

// Lookup SNOMED code
const snomedResult = await SNOMEDService.lookup('38341003');

// Lookup LOINC code
const loincResult = await LOINCService.lookup('8480-6');

// Validate CodeableConcept
const isValid = await SNOMEDService.validate(codeableConcept);
```

### Export Utilities

```typescript
import { exportAsJSON, exportAsBundle, exportAsNDJSON } from '@global-health/fhir';

// Export as JSON
const json = exportAsJSON(patient, { pretty: true });

// Export as Bundle
const bundle = exportAsBundle([patient, practitioner, observation], 'collection');

// Export as NDJSON
const ndjson = exportAsNDJSON([patient, practitioner]);
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
