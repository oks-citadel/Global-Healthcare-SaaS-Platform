# FHIR Service

## Overview

The FHIR Service provides a standards-compliant FHIR R4 REST API for the Global Healthcare Platform. It serves as the canonical data access layer for all clinical data.

## FHIR Capabilities

### Supported Resources

| Resource           | Read | Search | Create | Update | Delete | History |
| ------------------ | ---- | ------ | ------ | ------ | ------ | ------- |
| Patient            | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| Practitioner       | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| Organization       | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| Encounter          | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| Observation        | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| Condition          | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| Procedure          | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| MedicationRequest  | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| AllergyIntolerance | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| Immunization       | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| DiagnosticReport   | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| DocumentReference  | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| Appointment        | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| Consent            | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |
| CarePlan           | ✅   | ✅     | ✅     | ✅     | ✅     | ✅      |

### Supported Operations

- `$everything` - Patient compartment export
- `$export` - Bulk data export
- `$match` - Patient matching (MPI)
- `$validate` - Resource validation
- `$convert` - Format conversion

## API Endpoints

```
# Metadata
GET    /fhir/r4/metadata                    # Capability statement

# CRUD Operations
GET    /fhir/r4/{resourceType}              # Search
GET    /fhir/r4/{resourceType}/{id}         # Read
POST   /fhir/r4/{resourceType}              # Create
PUT    /fhir/r4/{resourceType}/{id}         # Update
DELETE /fhir/r4/{resourceType}/{id}         # Delete

# History
GET    /fhir/r4/{resourceType}/{id}/_history
GET    /fhir/r4/{resourceType}/_history

# Operations
POST   /fhir/r4/Patient/$match
POST   /fhir/r4/Patient/$everything
POST   /fhir/r4/$export
POST   /fhir/r4/{resourceType}/$validate

# Batch/Transaction
POST   /fhir/r4                             # Bundle processing
```

## Configuration

```yaml
# fhir-service.yaml
service:
  name: fhir-service
  port: 8083

fhir:
  version: R4
  base_url: /fhir/r4

  validation:
    enabled: true
    profile_validation: true
    terminology_validation: true

  search:
    max_count: 1000
    default_count: 20
    include_depth: 3

  history:
    enabled: true
    max_versions: 100

  bulk_export:
    enabled: true
    max_resources_per_file: 10000
    formats: [ndjson, parquet]
```

## Port

**8083**
