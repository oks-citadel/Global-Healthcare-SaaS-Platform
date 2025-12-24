# Data Operations

## Overview

Data operations manage FHIR-centric data lifecycle, ensuring data quality, residency compliance, replication, and interoperability across global healthcare systems.

## FHIR-Centric Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FHIR CANONICAL DATA LAYER                         │
│                          (Internal Standard)                             │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────────┐
        │                           │                               │
        ▼                           ▼                               ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│  FHIR R4 Store    │    │  Analytics Lake   │    │  Archive Store    │
│  (Hot Data)       │    │  (FHIR Bulk)      │    │  (Cold Storage)   │
│                   │    │                   │    │                   │
│  • PostgreSQL     │    │  • Delta Lake     │    │  • Blob Storage   │
│  • FHIR native    │    │  • Parquet        │    │  • Compressed     │
│  • Full-text      │    │  • NDJSON         │    │  • Encrypted      │
└─────────┬─────────┘    └─────────┬─────────┘    └─────────┬─────────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────────┐
│                         DATA PIPELINES                                   │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │   Ingest     │  │  Transform   │  │  Replicate   │  │   Export     ││
│  │  (Adapters)  │  │  (FHIR Map)  │  │  (Cross-Rgn) │  │  ($export)   ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## FHIR Data Store

### Schema Design

```yaml
# fhir-store-config.yaml
fhir_store:
  version: R4
  database: postgresql

  resource_tables:
    # Each FHIR resource type gets a table
    patient:
      table_name: fhir_patient
      indexes:
        - columns: [tenant_id, id]
          unique: true
        - columns: [tenant_id, identifier]
          type: gin # For JSON array search
        - columns: [tenant_id, name]
          type: gin # Full-text search
        - columns: [tenant_id, birthdate]
        - columns: [tenant_id, last_updated]

    observation:
      table_name: fhir_observation
      indexes:
        - columns: [tenant_id, id]
          unique: true
        - columns: [tenant_id, subject]
        - columns: [tenant_id, code]
          type: gin
        - columns: [tenant_id, effective_datetime]
        - columns: [tenant_id, last_updated]
      partitioning:
        type: range
        column: effective_datetime
        interval: monthly

    encounter:
      table_name: fhir_encounter
      indexes:
        - columns: [tenant_id, id]
          unique: true
        - columns: [tenant_id, subject]
        - columns: [tenant_id, status]
        - columns: [tenant_id, period_start]
      partitioning:
        type: range
        column: period_start
        interval: quarterly

  # Common columns for all resources
  common_columns:
    - name: id
      type: uuid
      primary_key: true
    - name: tenant_id
      type: uuid
      required: true
    - name: resource_type
      type: varchar(64)
      required: true
    - name: resource
      type: jsonb
      required: true
    - name: version_id
      type: integer
      default: 1
    - name: last_updated
      type: timestamptz
      required: true
    - name: created_at
      type: timestamptz
      required: true
    - name: created_by
      type: uuid
    - name: is_deleted
      type: boolean
      default: false

  # Version history for audit
  history:
    enabled: true
    table_suffix: _history
    retention_days: 2190 # 6 years (HIPAA)
```

### FHIR Search Parameters

```yaml
# fhir-search-config.yaml
search_parameters:
  patient:
    - name: identifier
      type: token
      path: Patient.identifier
    - name: name
      type: string
      path: Patient.name
    - name: family
      type: string
      path: Patient.name.family
    - name: given
      type: string
      path: Patient.name.given
    - name: birthdate
      type: date
      path: Patient.birthDate
    - name: gender
      type: token
      path: Patient.gender
    - name: address
      type: string
      path: Patient.address
    - name: phone
      type: token
      path: Patient.telecom.where(system='phone')
    - name: email
      type: token
      path: Patient.telecom.where(system='email')
    - name: organization
      type: reference
      path: Patient.managingOrganization

  observation:
    - name: code
      type: token
      path: Observation.code
    - name: subject
      type: reference
      path: Observation.subject
    - name: patient
      type: reference
      path: Observation.subject.where(resolve() is Patient)
    - name: date
      type: date
      path: Observation.effectiveDateTime | Observation.effectivePeriod
    - name: status
      type: token
      path: Observation.status
    - name: category
      type: token
      path: Observation.category
    - name: value-quantity
      type: quantity
      path: Observation.valueQuantity
    - name: value-concept
      type: token
      path: Observation.valueCodeableConcept

  encounter:
    - name: identifier
      type: token
      path: Encounter.identifier
    - name: status
      type: token
      path: Encounter.status
    - name: class
      type: token
      path: Encounter.class
    - name: type
      type: token
      path: Encounter.type
    - name: subject
      type: reference
      path: Encounter.subject
    - name: date
      type: date
      path: Encounter.period
    - name: participant
      type: reference
      path: Encounter.participant.individual
```

## Data Pipelines

### Ingestion Pipeline

```yaml
# ingestion-pipeline.yaml
ingestion:
  sources:
    - name: fhir-native
      type: fhir-r4
      processing: pass-through
      validation: strict

    - name: hl7v2
      type: hl7-v2.x
      processing: transform
      transform_rules: hl7v2-to-fhir
      validation: strict

    - name: cda
      type: cda-r2
      processing: transform
      transform_rules: cda-to-fhir
      validation: strict

    - name: csv-import
      type: csv
      processing: transform
      mapping_required: true
      validation: strict

    - name: legacy-ehr
      type: custom
      processing: adapter
      adapter_id: ${EHR_ADAPTER}
      validation: permissive

  validation:
    strict:
      - schema_validation: true
      - terminology_validation: true
      - reference_validation: true
      - business_rules: true
      - reject_on_error: true

    permissive:
      - schema_validation: true
      - terminology_validation: warn
      - reference_validation: warn
      - business_rules: warn
      - reject_on_error: false

  error_handling:
    dead_letter_queue: true
    retry_count: 3
    retry_delay: exponential
    max_retry_delay: 5m
    alert_on_failure: true
```

### Transformation Pipeline

```yaml
# transformation-pipeline.yaml
transformations:
  hl7v2_to_fhir:
    name: HL7 v2.x to FHIR R4
    source_format: hl7v2
    target_format: fhir-r4

    segment_mappings:
      PID:
        target: Patient
        fields:
          PID-3: identifier
          PID-5: name
          PID-7: birthDate
          PID-8: gender
          PID-11: address
          PID-13: telecom

      OBX:
        target: Observation
        fields:
          OBX-3: code
          OBX-5: value
          OBX-6: valueQuantity.unit
          OBX-11: status
          OBX-14: effectiveDateTime

      ORC:
        target: ServiceRequest
        fields:
          ORC-1: status
          ORC-2: identifier
          ORC-9: dateTime

  cda_to_fhir:
    name: CDA R2 to FHIR R4
    source_format: cda-r2
    target_format: fhir-r4

    section_mappings:
      allergies:
        target: AllergyIntolerance
        xpath: //section[code/@code='48765-2']

      medications:
        target: MedicationStatement
        xpath: //section[code/@code='10160-0']

      problems:
        target: Condition
        xpath: //section[code/@code='11450-4']

      vitals:
        target: Observation
        xpath: //section[code/@code='8716-3']
```

### Replication Pipeline

```yaml
# replication-pipeline.yaml
replication:
  mode: active-passive # or active-active for specific regions

  topology:
    americas:
      primary: us-east
      replicas:
        - us-west
        - us-central

    europe:
      primary: eu-west
      replicas:
        - eu-north
      # No cross-region replication due to GDPR

    apac:
      primary: ap-southeast
      replicas:
        - ap-northeast

  sync_config:
    method: change-data-capture
    provider: debezium

    streams:
      - name: patient-changes
        source_table: fhir_patient
        target_topic: healthcare.fhir.patient
        key: id
        include_before: true

      - name: observation-changes
        source_table: fhir_observation
        target_topic: healthcare.fhir.observation
        key: id
        include_before: false

    conflict_resolution:
      strategy: last-write-wins
      timestamp_field: last_updated
      conflict_log: true

  data_residency:
    enforcement: strict

    rules:
      - region: europe
        allowed_destinations: [europe]
        cross_border_transfer: false

      - region: americas
        allowed_destinations: [americas]
        cross_border_transfer: true
        safeguards_required: true

      - region: apac
        allowed_destinations: [apac]
        cross_border_transfer: true
        safeguards_required: true
```

## Backup & Recovery

```yaml
# backup-config.yaml
backup:
  strategy:
    type: continuous
    provider: azure-backup

  schedules:
    # Point-in-time recovery
    continuous:
      enabled: true
      retention: 35d
      wal_archiving: true

    # Daily full backups
    daily:
      enabled: true
      time: "02:00"
      retention: 30d
      geo_redundant: true

    # Weekly backups
    weekly:
      enabled: true
      day: sunday
      time: "03:00"
      retention: 52w

    # Monthly backups (compliance)
    monthly:
      enabled: true
      day: 1
      time: "04:00"
      retention: 7y # HIPAA requirement

  encryption:
    enabled: true
    algorithm: AES-256
    key_source: customer-managed
    key_rotation: 90d

  verification:
    enabled: true
    frequency: weekly
    restore_test: true
    integrity_check: true

recovery:
  rto: 4h # Recovery Time Objective
  rpo: 15m # Recovery Point Objective

  procedures:
    point_in_time:
      enabled: true
      max_age: 35d

    full_restore:
      enabled: true
      automated: true
      target_region: same

    cross_region:
      enabled: true
      target_regions: [backup_region]
```

## Data Quality

```yaml
# data-quality.yaml
quality_checks:
  # Schema validation
  schema:
    enabled: true
    fhir_version: R4
    strict_mode: true

  # Terminology validation
  terminology:
    enabled: true
    validate_codes: true
    code_systems:
      - snomed-ct
      - loinc
      - icd-10
      - rxnorm
      - ndc
    unknown_code_action: warn

  # Reference integrity
  references:
    enabled: true
    validate_references: true
    check_existence: true
    allow_external: true

  # Business rules
  business_rules:
    enabled: true
    rules:
      - name: patient-identifier-required
        resource: Patient
        condition: identifier.exists()
        severity: error

      - name: observation-subject-required
        resource: Observation
        condition: subject.exists()
        severity: error

      - name: encounter-valid-status
        resource: Encounter
        condition: status in ('planned' | 'arrived' | 'in-progress' | 'finished' | 'cancelled')
        severity: error

  # Deduplication
  deduplication:
    enabled: true
    resources:
      - type: Patient
        match_criteria:
          - identifier.value
          - name.family + birthDate
          - name.given + name.family + address.postalCode
        threshold: 0.85
        action: merge_review

      - type: Practitioner
        match_criteria:
          - identifier.value
          - name.family + name.given
        threshold: 0.90
        action: auto_merge

  # Completeness
  completeness:
    enabled: true
    resources:
      - type: Patient
        required_fields:
          - identifier
          - name
          - birthDate
        recommended_fields:
          - gender
          - address
          - telecom

      - type: Observation
        required_fields:
          - code
          - subject
          - status
        recommended_fields:
          - effectiveDateTime
          - value
```

## FHIR Bulk Export

```yaml
# bulk-export.yaml
bulk_export:
  enabled: true

  endpoints:
    system: /$export
    patient: /Patient/$export
    group: /Group/{id}/$export

  formats:
    - ndjson # Default
    - parquet # For analytics

  parameters:
    _outputFormat: application/fhir+ndjson
    _type: Patient,Observation,Condition,Encounter
    _since: # Last export timestamp
    _typeFilter: # FHIR search filter

  storage:
    provider: azure-blob
    container: fhir-exports
    encryption: customer-managed
    retention: 7d
    access: presigned-url

  limits:
    max_resources_per_file: 10000
    max_concurrent_exports: 5
    max_export_duration: 24h

  notifications:
    webhook: true
    email: true
```
