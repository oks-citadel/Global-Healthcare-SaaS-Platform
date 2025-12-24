# Patient Service

## Overview

The Patient Service manages patient demographics, identities, and consent in the Global Healthcare Platform. It serves as the Master Patient Index (MPI) and handles patient matching, merging, and linking across healthcare systems.

## FHIR Resources

- `Patient` - Core patient demographics
- `RelatedPerson` - Family members, caregivers
- `Person` - Links multiple patient records
- `Consent` - Patient consent directives

## API Endpoints

### Patient Management

```
POST   /api/v1/patients              # Create patient
GET    /api/v1/patients              # Search patients
GET    /api/v1/patients/:id          # Get patient by ID
PUT    /api/v1/patients/:id          # Update patient
DELETE /api/v1/patients/:id          # Delete patient (soft)
```

### FHIR R4 Endpoints

```
POST   /fhir/r4/Patient              # Create FHIR Patient
GET    /fhir/r4/Patient              # Search FHIR Patients
GET    /fhir/r4/Patient/:id          # Read FHIR Patient
PUT    /fhir/r4/Patient/:id          # Update FHIR Patient
DELETE /fhir/r4/Patient/:id          # Delete FHIR Patient
GET    /fhir/r4/Patient/:id/_history # Patient version history
POST   /fhir/r4/Patient/$match       # MPI matching
POST   /fhir/r4/Patient/$merge       # Merge duplicate patients
```

### Consent Management

```
POST   /api/v1/patients/:id/consents # Record consent
GET    /api/v1/patients/:id/consents # Get consent status
PUT    /api/v1/patients/:id/consents/:consentId # Update consent
DELETE /api/v1/patients/:id/consents/:consentId # Revoke consent
```

### Identity Linking

```
POST   /api/v1/patients/:id/links    # Link patient records
GET    /api/v1/patients/:id/links    # Get linked records
DELETE /api/v1/patients/:id/links/:linkId # Unlink records
```

## Data Model

### Patient Entity

```typescript
interface Patient {
  id: string;
  tenantId: string;

  // Demographics
  identifiers: Identifier[];
  name: HumanName[];
  birthDate: Date;
  gender: "male" | "female" | "other" | "unknown";

  // Contact
  telecom: ContactPoint[];
  address: Address[];

  // Administrative
  maritalStatus?: CodeableConcept;
  communication: PatientCommunication[];
  generalPractitioner?: Reference[];
  managingOrganization?: Reference;

  // Links
  link?: PatientLink[];

  // Metadata
  active: boolean;
  deceased?: boolean | Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  version: number;
}

interface Identifier {
  system: string; // e.g., "http://hl7.org/fhir/sid/us-ssn"
  value: string;
  type?: CodeableConcept;
  use?: "usual" | "official" | "temp" | "secondary" | "old";
  period?: Period;
}
```

### Consent Entity

```typescript
interface Consent {
  id: string;
  patientId: string;
  tenantId: string;

  // Consent details
  status:
    | "draft"
    | "proposed"
    | "active"
    | "rejected"
    | "inactive"
    | "entered-in-error";
  scope: CodeableConcept; // patient-privacy, research, treatment
  category: CodeableConcept[];

  // What is being consented
  provision: ConsentProvision;

  // When/how captured
  dateTime: Date;
  performer?: Reference[];
  sourceReference?: Reference;
  verification?: ConsentVerification[];

  // Country-specific
  countryCode: string;
  regulatoryFramework: string; // HIPAA, GDPR, etc.

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

## Master Patient Index (MPI)

### Matching Algorithm

```yaml
mpi:
  matching:
    algorithm: probabilistic

    blocking_rules:
      # First pass - exact matches
      - fields: [identifier.value]
        threshold: 1.0

      # Second pass - demographic matching
      - fields: [name.family, birthDate]
        threshold: 0.85

      # Third pass - fuzzy matching
      - fields: [name.given, name.family, birthDate, address.postalCode]
        threshold: 0.75

    scoring:
      exact_match:
        identifier: 100
        name_family: 30
        name_given: 20
        birthDate: 25
        gender: 5
        address_line: 10
        address_postalCode: 15
        phone: 20
        email: 20

      partial_match:
        name_family:
          method: soundex
          weight: 0.8
        name_given:
          method: soundex
          weight: 0.7
        address_line:
          method: levenshtein
          threshold: 0.8
          weight: 0.6

    thresholds:
      auto_link: 95 # Automatically link records
      review: 75 # Flag for manual review
      no_match: 50 # Treat as different patients

    duplicate_detection:
      enabled: true
      on_create: true
      on_update: true
      async_batch: true
```

### Patient Merge

```typescript
interface MergeRequest {
  sourcePatientId: string; // Patient to merge FROM (will be deprecated)
  targetPatientId: string; // Patient to merge INTO (will remain)

  // Field resolution
  fieldOverrides?: {
    name?: "source" | "target" | HumanName[];
    address?: "source" | "target" | Address[];
    telecom?: "source" | "target" | ContactPoint[];
  };

  // Audit
  reason: string;
  performedBy: string;
}

interface MergeResult {
  survivingPatientId: string;
  mergedPatientId: string;
  linkedResources: {
    resourceType: string;
    count: number;
    referencesUpdated: boolean;
  }[];
  auditTrail: AuditEvent;
}
```

## Events Published

```yaml
events:
  - name: patient.created
    topic: healthcare.patient.created
    payload:
      patientId: string
      tenantId: string
      identifiers: Identifier[]
      timestamp: Date

  - name: patient.updated
    topic: healthcare.patient.updated
    payload:
      patientId: string
      tenantId: string
      changedFields: string[]
      previousVersion: number
      newVersion: number
      timestamp: Date

  - name: patient.merged
    topic: healthcare.patient.merged
    payload:
      survivingPatientId: string
      mergedPatientId: string
      tenantId: string
      timestamp: Date

  - name: patient.deceased
    topic: healthcare.patient.deceased
    payload:
      patientId: string
      tenantId: string
      deceasedDateTime: Date
      timestamp: Date

  - name: consent.granted
    topic: healthcare.consent.granted
    payload:
      consentId: string
      patientId: string
      scope: string
      timestamp: Date

  - name: consent.revoked
    topic: healthcare.consent.revoked
    payload:
      consentId: string
      patientId: string
      scope: string
      timestamp: Date
```

## Country-Specific Configurations

### United States

```yaml
us:
  identifiers:
    - system: "http://hl7.org/fhir/sid/us-ssn"
      name: "Social Security Number"
      validation: "^\\d{3}-\\d{2}-\\d{4}$"
      encrypted: true

    - system: "http://hl7.org/fhir/sid/us-medicare"
      name: "Medicare Beneficiary Identifier"
      validation: "^[1-9][A-Z0-9]{10}$"

  consent:
    model: opt-in
    hipaa_authorization: required
    minimum_age: 18
    minor_access:
      - age: 12
        conditions: [substance_abuse, mental_health, reproductive_health]
```

### Germany

```yaml
de:
  identifiers:
    - system: "http://fhir.de/sid/gkv/kvid-10"
      name: "Krankenversichertennummer"
      validation: "^[A-Z]\\d{9}$"

    - system: "http://fhir.de/sid/pkv/kvnr"
      name: "Private Insurance Number"

  consent:
    model: opt-in
    gdpr_explicit: true
    minimum_age: 16
    epa_consent:
      levels: [full, limited, emergency]
      withdrawal: anytime
```

### Kenya

```yaml
ke:
  identifiers:
    - system: "http://health.go.ke/fhir/sid/national-id"
      name: "Kenya National ID"
      validation: "^\\d{8}$"

    - system: "http://health.go.ke/fhir/sid/nhif"
      name: "NHIF Number"

  consent:
    model: opt-in
    verbal_consent: allowed
    community_consent: recognized
    witness_required: true
```

## Database Schema

```sql
-- Patient table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  fhir_resource JSONB NOT NULL,

  -- Searchable fields (denormalized)
  family_name VARCHAR(255),
  given_names VARCHAR(255)[],
  birth_date DATE,
  gender VARCHAR(20),

  -- Identifiers (for efficient lookup)
  identifiers JSONB NOT NULL DEFAULT '[]',

  -- Status
  active BOOLEAN DEFAULT true,
  deceased BOOLEAN DEFAULT false,
  deceased_datetime TIMESTAMPTZ,

  -- MPI
  master_patient_id UUID,
  match_confidence NUMERIC(5,2),

  -- Audit
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,

  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Indexes
CREATE INDEX idx_patients_tenant ON patients(tenant_id);
CREATE INDEX idx_patients_identifiers ON patients USING GIN (identifiers);
CREATE INDEX idx_patients_name ON patients(tenant_id, family_name, given_names);
CREATE INDEX idx_patients_birthdate ON patients(tenant_id, birth_date);
CREATE INDEX idx_patients_master ON patients(master_patient_id);

-- Patient history table
CREATE TABLE patient_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  version INTEGER NOT NULL,
  fhir_resource JSONB NOT NULL,
  changed_fields TEXT[],
  changed_by UUID,
  changed_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
  UNIQUE(patient_id, version)
);

-- Consent table
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  fhir_resource JSONB NOT NULL,

  status VARCHAR(50) NOT NULL,
  scope VARCHAR(100) NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,

  country_code VARCHAR(2) NOT NULL,
  regulatory_framework VARCHAR(50) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX idx_consents_patient ON consents(patient_id);
CREATE INDEX idx_consents_scope ON consents(tenant_id, scope, status);
```

## Configuration

```yaml
# patient-service.yaml
service:
  name: patient-service
  port: 8082

database:
  url: ${DATABASE_URL}
  pool_size: 20

redis:
  url: ${REDIS_URL}
  cache_ttl: 300

mpi:
  enabled: true
  async_matching: true

events:
  broker: kafka
  topic_prefix: healthcare.patient

fhir:
  version: R4
  validate_resources: true

countries:
  - US
  - DE
  - KE
  - AE
  - AU
```

## Testing

```bash
# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run MPI matching tests
pnpm test:mpi

# Generate coverage report
pnpm test:coverage
```
