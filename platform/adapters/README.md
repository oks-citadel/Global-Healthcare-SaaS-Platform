# Healthcare Adapter Framework

## Overview

The Adapter Framework provides standardized connectors for integrating with external healthcare systems worldwide. All adapters normalize data to FHIR R4 as the canonical internal format.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PLATFORM FHIR LAYER                                  │
│                         (FHIR R4 Canonical)                                  │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
┌─────────────────────────────────────┼───────────────────────────────────────┐
│                         ADAPTER ORCHESTRATION                                │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │   Router    │  │  Transform  │  │   Retry     │  │   Circuit Breaker   ││
│  │             │  │   Engine    │  │   Handler   │  │                     ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘│
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
        ┌─────────────┬───────────────┼───────────────┬─────────────┐
        │             │               │               │             │
        ▼             ▼               ▼               ▼             ▼
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│    EHR    │ │    HIE    │ │  National │ │   Lab     │ │  Pharmacy │
│ Adapters  │ │ Adapters  │ │ Adapters  │ │ Adapters  │ │ Adapters  │
└───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘
     │             │             │             │             │
     ▼             ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL HEALTHCARE SYSTEMS                          │
│                                                                              │
│  Epic  Cerner  gematik  NHS  CommonWell  Carequality  DHIS2  Surescripts   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Adapter Categories

### EHR Adapters

| Adapter             | Region | Protocol   | Status     |
| ------------------- | ------ | ---------- | ---------- |
| epic-fhir-adapter   | US     | FHIR R4    | Production |
| cerner-fhir-adapter | US     | FHIR R4    | Production |
| meditech-adapter    | US     | HL7v2/FHIR | Production |
| allscripts-adapter  | US     | FHIR R4    | Production |
| openmrs-adapter     | Global | FHIR R4    | Production |

### National System Adapters

| Adapter              | Country | System                 | Protocol     |
| -------------------- | ------- | ---------------------- | ------------ |
| gematik-ti-adapter   | DE      | Telematikinfrastruktur | Proprietary  |
| epa-fhir-adapter     | DE      | ePA                    | FHIR R4      |
| nhs-spine-adapter    | GB      | NHS Spine              | HL7v3/FHIR   |
| gp-connect-adapter   | GB      | GP Connect             | FHIR STU3/R4 |
| mhr-adapter          | AU      | My Health Record       | FHIR R4/CDA  |
| nehr-adapter         | SG      | NEHR                   | FHIR R4      |
| abdm-gateway-adapter | IN      | ABDM                   | FHIR R4      |
| malaffi-adapter      | AE      | Malaffi                | FHIR R4      |
| nphies-adapter       | SA      | NPHIES                 | FHIR R4      |

### HIE Adapters

| Adapter                 | Region | Network          | Protocol |
| ----------------------- | ------ | ---------------- | -------- |
| commonwell-adapter      | US     | CommonWell       | FHIR R4  |
| carequality-adapter     | US     | Carequality      | XCA/FHIR |
| ehealthexchange-adapter | US     | eHealth Exchange | XCA/XDS  |
| ehdsi-ncp-adapter       | EU     | MyHealth@EU      | IPS FHIR |

### HMIS Adapters

| Adapter         | Region | System  | Protocol   |
| --------------- | ------ | ------- | ---------- |
| dhis2-adapter   | Africa | DHIS2   | REST API   |
| openhim-adapter | Africa | OpenHIM | HL7v2/FHIR |
| opencr-adapter  | Africa | OpenCR  | FHIR R4    |

### Pharmacy Adapters

| Adapter             | Region | System      | Protocol     |
| ------------------- | ------ | ----------- | ------------ |
| surescripts-adapter | US     | Surescripts | NCPDP SCRIPT |
| erezept-adapter     | DE     | E-Rezept    | FHIR R4      |
| eps-adapter         | GB     | EPS         | HL7v3        |
| pbs-adapter         | AU     | PBS         | Custom       |

### Laboratory Adapters

| Adapter               | Region | System            | Protocol   |
| --------------------- | ------ | ----------------- | ---------- |
| lab-universal-adapter | Global | Generic Labs      | HL7v2 ORU  |
| quest-adapter         | US     | Quest Diagnostics | HL7v2/FHIR |
| labcorp-adapter       | US     | LabCorp           | HL7v2/FHIR |

## Base Adapter Interface

```typescript
// packages/adapters/core/src/adapter.interface.ts

export interface HealthcareAdapter {
  // Metadata
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly country: string;
  readonly protocol: AdapterProtocol;

  // Lifecycle
  initialize(config: AdapterConfig): Promise<void>;
  healthCheck(): Promise<HealthCheckResult>;
  shutdown(): Promise<void>;

  // Patient operations
  getPatient(id: string): Promise<fhir.Patient>;
  searchPatients(params: SearchParams): Promise<fhir.Bundle>;
  createPatient(patient: fhir.Patient): Promise<fhir.Patient>;
  updatePatient(id: string, patient: fhir.Patient): Promise<fhir.Patient>;

  // Clinical data
  getObservations(
    patientId: string,
    params?: SearchParams,
  ): Promise<fhir.Bundle>;
  getConditions(patientId: string, params?: SearchParams): Promise<fhir.Bundle>;
  getMedications(
    patientId: string,
    params?: SearchParams,
  ): Promise<fhir.Bundle>;
  getAllergies(patientId: string, params?: SearchParams): Promise<fhir.Bundle>;

  // Documents
  getDocuments(patientId: string, params?: SearchParams): Promise<fhir.Bundle>;
  getDocument(id: string): Promise<fhir.DocumentReference>;

  // Encounters
  getEncounters(patientId: string, params?: SearchParams): Promise<fhir.Bundle>;
  getEncounter(id: string): Promise<fhir.Encounter>;
}

export interface AdapterConfig {
  endpoint: string;
  credentials: AdapterCredentials;
  timeout: number;
  retryPolicy: RetryPolicy;
  rateLimiting: RateLimitConfig;
  mapping: MappingConfig;
}

export interface AdapterCredentials {
  type: "oauth2" | "api_key" | "certificate" | "saml";
  clientId?: string;
  clientSecret?: string;
  certificate?: string;
  privateKey?: string;
}

export type AdapterProtocol =
  | "fhir-r4"
  | "fhir-stu3"
  | "hl7v2"
  | "hl7v3"
  | "cda"
  | "xds"
  | "xca"
  | "dicom"
  | "ncpdp"
  | "x12"
  | "custom";
```

## Transformation Engine

### FHIR Mapping Language (FML)

```fhir-mapping
// hl7v2-to-fhir.map
map "http://global-healthcare.io/mapping/hl7v2-to-fhir" = "HL7v2 to FHIR R4"

uses "http://hl7.org/fhir/StructureDefinition/ADT_A01" alias ADT_A01 as source
uses "http://hl7.org/fhir/StructureDefinition/Bundle" alias Bundle as target

group main(source adt : ADT_A01, target bundle : Bundle) {
  adt -> bundle.type = 'transaction' "set bundle type";
  adt.PID as pid -> bundle.entry as entry, entry.resource = create('Patient') as patient then {
    pid.PID_3 as id -> patient.identifier as identifier then {
      id.CX_1 as value -> identifier.value = value;
      id.CX_4 as system -> identifier.system = evaluate(system, getSystem());
    };
    pid.PID_5 as name -> patient.name as humanName then {
      name.XPN_1 as family -> humanName.family = family;
      name.XPN_2 as given -> humanName.given = given;
    };
    pid.PID_7 as dob -> patient.birthDate = evaluate(dob, parseDate());
    pid.PID_8 as gender -> patient.gender = evaluate(gender, mapGender());
  };
}
```

### Transformation Config

```yaml
# transformation-config.yaml
transformations:
  hl7v2_to_fhir:
    source_format: HL7v2
    target_format: FHIR_R4

    message_types:
      ADT_A01:
        target: Bundle
        resources:
          - Patient
          - Encounter
          - Location

      ORU_R01:
        target: Bundle
        resources:
          - DiagnosticReport
          - Observation
          - Specimen

      ORM_O01:
        target: Bundle
        resources:
          - ServiceRequest
          - Task

    field_mappings:
      PID:
        PID_3:
          target: Patient.identifier
          transform: parseIdentifier

        PID_5:
          target: Patient.name
          transform: parseHumanName

        PID_7:
          target: Patient.birthDate
          transform: parseDate
          format: "yyyyMMdd"

        PID_8:
          target: Patient.gender
          transform: mapCode
          mapping:
            M: male
            F: female
            O: other
            U: unknown

      OBX:
        OBX_3:
          target: Observation.code
          transform: parseCodeableConcept

        OBX_5:
          target: Observation.value[x]
          transform: parseValue
          type_mapping:
            NM: valueQuantity
            ST: valueString
            CE: valueCodeableConcept
```

## Authentication Flows

### OAuth 2.0 (SMART on FHIR)

```typescript
// packages/adapters/core/src/auth/smart-on-fhir.ts

export class SmartOnFhirAuth implements AdapterAuth {
  private tokenEndpoint: string;
  private clientId: string;
  private clientSecret: string;
  private scopes: string[];

  async getAccessToken(): Promise<AccessToken> {
    // Backend services flow (client credentials)
    const response = await fetch(this.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: this.scopes.join(" "),
      }),
    });

    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<AccessToken> {
    // Refresh token flow
  }
}
```

### Certificate-Based (mTLS)

```yaml
# certificate-auth.yaml
authentication:
  type: certificate
  client_certificate: /certs/client.crt
  private_key: /certs/client.key
  ca_bundle: /certs/ca-bundle.crt
  verify_server: true
```

### SAML 2.0

```yaml
# saml-auth.yaml
authentication:
  type: saml
  idp_metadata_url: https://idp.example.com/metadata
  sp_entity_id: https://our-platform.com/saml/metadata
  assertion_consumer_url: https://our-platform.com/saml/acs
  signing_certificate: /certs/saml-signing.crt
  signing_key: /certs/saml-signing.key
```

## Adapter Implementations

### Epic FHIR Adapter

```yaml
# epic-fhir-adapter.yaml
adapter:
  id: epic-fhir
  name: Epic FHIR R4 Adapter
  version: 2.0.0
  country: US
  protocol: fhir-r4

connection:
  base_url: ${EPIC_FHIR_URL}
  auth:
    type: oauth2
    token_url: ${EPIC_TOKEN_URL}
    client_id: ${EPIC_CLIENT_ID}
    private_key: ${EPIC_PRIVATE_KEY}
    scope:
      - patient/*.read
      - user/*.read
      - launch

endpoints:
  metadata: /metadata
  patient: /Patient
  observation: /Observation
  condition: /Condition
  medication_request: /MedicationRequest
  allergy_intolerance: /AllergyIntolerance
  immunization: /Immunization
  document_reference: /DocumentReference
  diagnostic_report: /DiagnosticReport

capabilities:
  patient_search:
    - identifier
    - name
    - birthdate
    - gender
    - phone
    - email
  bulk_export: true
  batch_operations: true

rate_limits:
  requests_per_second: 10
  concurrent_connections: 5
```

### gematik TI Adapter

```yaml
# gematik-ti-adapter.yaml
adapter:
  id: gematik-ti
  name: gematik Telematikinfrastruktur Adapter
  version: 1.0.0
  country: DE
  protocol: custom

connection:
  ti_connector:
    url: ${TI_CONNECTOR_URL}
    card_handle: ${SMC_B_HANDLE}

  epa_service:
    url: ${EPA_SERVICE_URL}
    auth:
      type: certificate
      client_certificate: ${HBA_CERTIFICATE}
      private_key: ${HBA_PRIVATE_KEY}

  erezept_service:
    url: ${EREZEPT_SERVICE_URL}

components:
  health_card:
    type: eGK
    reader: ${CARD_READER_ID}

  provider_card:
    type: HBA
    pin: ${HBA_PIN}

  institution_card:
    type: SMC-B
    pin: ${SMC_B_PIN}

capabilities:
  vsdm: true # Versichertenstammdatenmanagement
  epa: true # elektronische Patientenakte
  erp: true # E-Rezept
  kim: true # Kommunikation im Medizinwesen
  nfdm: false # Notfalldatenmanagement (planned)
```

### DHIS2 Adapter

```yaml
# dhis2-adapter.yaml
adapter:
  id: dhis2
  name: DHIS2 Adapter
  version: 2.0.0
  region: africa
  protocol: custom

connection:
  base_url: ${DHIS2_URL}
  auth:
    type: basic
    username: ${DHIS2_USERNAME}
    password: ${DHIS2_PASSWORD}

endpoints:
  tracked_entities: /api/trackedEntityInstances
  enrollments: /api/enrollments
  events: /api/events
  data_values: /api/dataValueSets
  org_units: /api/organisationUnits
  programs: /api/programs

mappings:
  # Map DHIS2 tracked entity to FHIR Patient
  tracked_entity_to_patient:
    source: trackedEntityInstance
    target: Patient
    field_mappings:
      trackedEntityInstance: Patient.id
      attributes.firstName: Patient.name.given
      attributes.surname: Patient.name.family
      attributes.dateOfBirth: Patient.birthDate
      attributes.gender: Patient.gender
      attributes.phoneNumber: Patient.telecom

  # Map DHIS2 event to FHIR Observation
  event_to_observation:
    source: event
    target: Observation
    field_mappings:
      event: Observation.id
      eventDate: Observation.effectiveDateTime
      dataValues: Observation.component

capabilities:
  tracked_entities: true
  aggregate_data: true
  events: true
  programs: true
```

## Error Handling

```typescript
// packages/adapters/core/src/errors.ts

export class AdapterError extends Error {
  constructor(
    public code: AdapterErrorCode,
    public message: string,
    public source: string,
    public originalError?: Error,
    public retryable: boolean = false,
  ) {
    super(message);
  }
}

export enum AdapterErrorCode {
  // Connection errors
  CONNECTION_FAILED = "CONNECTION_FAILED",
  TIMEOUT = "TIMEOUT",
  SSL_ERROR = "SSL_ERROR",

  // Authentication errors
  AUTH_FAILED = "AUTH_FAILED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INSUFFICIENT_SCOPE = "INSUFFICIENT_SCOPE",

  // Data errors
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  INVALID_RESOURCE = "INVALID_RESOURCE",
  VALIDATION_ERROR = "VALIDATION_ERROR",

  // Transform errors
  TRANSFORM_FAILED = "TRANSFORM_FAILED",
  MAPPING_ERROR = "MAPPING_ERROR",

  // Rate limiting
  RATE_LIMITED = "RATE_LIMITED",
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",

  // System errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  EXTERNAL_SYSTEM_ERROR = "EXTERNAL_SYSTEM_ERROR",
}
```

## Retry and Circuit Breaker

```yaml
# resilience-config.yaml
retry:
  max_attempts: 3
  initial_delay: 1000
  max_delay: 30000
  multiplier: 2
  retryable_errors:
    - TIMEOUT
    - CONNECTION_FAILED
    - RATE_LIMITED
    - EXTERNAL_SYSTEM_ERROR

circuit_breaker:
  failure_threshold: 5
  success_threshold: 3
  timeout: 60000
  half_open_requests: 3

  states:
    closed:
      description: "Normal operation"

    open:
      description: "Failing, rejecting requests"
      fallback: cache_or_error

    half_open:
      description: "Testing if recovered"
```

## Adapter Registry

```yaml
# adapter-registry.yaml
adapters:
  americas:
    us:
      ehr:
        - epic-fhir-adapter
        - cerner-fhir-adapter
        - meditech-adapter
      hie:
        - commonwell-adapter
        - carequality-adapter
      pharmacy:
        - surescripts-adapter
      lab:
        - quest-adapter
        - labcorp-adapter

    ca:
      provincial:
        - ontario-ehr-adapter
        - alberta-netcare-adapter
        - bc-careconnect-adapter

  europe:
    de:
      national:
        - gematik-ti-adapter
        - epa-fhir-adapter
        - erezept-adapter
      regional:
        - kis-adapter

    gb:
      national:
        - nhs-spine-adapter
        - gp-connect-adapter
      pharmacy:
        - eps-adapter

  africa:
    ke:
      national:
        - kenya-hie-adapter
        - dhis2-adapter
      clinical:
        - kenyaemr-adapter

  middle_east:
    ae:
      regional:
        - malaffi-adapter
        - nabidh-adapter

    sa:
      national:
        - nphies-adapter
        - sehhaty-adapter

  asia_pacific:
    au:
      national:
        - mhr-adapter
        - hi-service-adapter
      pharmacy:
        - erx-adapter
        - pbs-adapter

    sg:
      national:
        - nehr-adapter
        - healthhub-adapter

    in:
      national:
        - abdm-gateway-adapter
        - abha-adapter
```

## Testing Adapters

```typescript
// packages/adapters/core/tests/adapter.test.ts

describe("EpicFhirAdapter", () => {
  let adapter: EpicFhirAdapter;

  beforeAll(async () => {
    adapter = new EpicFhirAdapter({
      endpoint: process.env.EPIC_SANDBOX_URL,
      credentials: {
        type: "oauth2",
        clientId: process.env.EPIC_CLIENT_ID,
        privateKey: process.env.EPIC_PRIVATE_KEY,
      },
    });
    await adapter.initialize();
  });

  describe("Patient Operations", () => {
    it("should search patients by name", async () => {
      const bundle = await adapter.searchPatients({
        name: "Smith",
        _count: 10,
      });

      expect(bundle.resourceType).toBe("Bundle");
      expect(bundle.entry).toBeDefined();
    });

    it("should get patient by ID", async () => {
      const patient = await adapter.getPatient("erXuFYUfucBZaryVksYEcMg3");

      expect(patient.resourceType).toBe("Patient");
      expect(patient.id).toBe("erXuFYUfucBZaryVksYEcMg3");
    });
  });

  describe("Clinical Data", () => {
    it("should get patient observations", async () => {
      const bundle = await adapter.getObservations("erXuFYUfucBZaryVksYEcMg3", {
        category: "vital-signs",
        _count: 50,
      });

      expect(bundle.resourceType).toBe("Bundle");
    });
  });
});
```

## Creating a New Adapter

```bash
# Generate adapter scaffold
pnpm create:adapter --name=my-system --country=XX --protocol=fhir-r4

# This creates:
# packages/adapters/my-system-adapter/
# ├── src/
# │   ├── adapter.ts
# │   ├── auth.ts
# │   ├── config.ts
# │   ├── mappings/
# │   └── index.ts
# ├── tests/
# ├── README.md
# └── package.json
```
