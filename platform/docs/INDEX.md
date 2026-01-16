# Global Healthcare Platform Documentation

## Documentation Index

### Platform Overview

| Document              | Description                    | Location                                        |
| --------------------- | ------------------------------ | ----------------------------------------------- |
| Platform Architecture | High-level system architecture | [platform/README.md](../README.md)              |
| Getting Started       | Quick start guide              | [docs/GETTING_STARTED.md](./GETTING_STARTED.md) |
| Deployment Guide      | Production deployment          | [docs/DEPLOYMENT.md](./DEPLOYMENT.md)           |

### Operations

| Document            | Description                     | Location                                                                |
| ------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| Operations Overview | Four-layer operations model     | [operations/README.md](../operations/README.md)                         |
| Networking          | Geo-routing, service mesh, DNS  | [operations/networking/README.md](../operations/networking/README.md)   |
| Security            | IAM, WAF, encryption, audit     | [operations/security/README.md](../operations/security/README.md)       |
| Application         | Deployment, scaling, monitoring | [operations/application/README.md](../operations/application/README.md) |
| Data                | FHIR store, pipelines, backup   | [operations/data/README.md](../operations/data/README.md)               |

### Regional Configurations

| Document         | Description                        | Location                                                            |
| ---------------- | ---------------------------------- | ------------------------------------------------------------------- |
| Regions Overview | Global healthcare patterns         | [regions/README.md](../regions/README.md)                           |
| Americas         | US, Canada, Brazil                 | [regions/americas/README.md](../regions/americas/README.md)         |
| Europe           | Germany, UK, France, EU            | [regions/europe/README.md](../regions/europe/README.md)             |
| Africa           | Kenya, South Africa, Nigeria       | [regions/africa/README.md](../regions/africa/README.md)             |
| Middle East      | UAE, Saudi Arabia, Israel          | [regions/middle-east/README.md](../regions/middle-east/README.md)   |
| Asia-Pacific     | Australia, Japan, Singapore, India | [regions/asia-pacific/README.md](../regions/asia-pacific/README.md) |

### Microservices

| Document            | Description                | Location                                                                            |
| ------------------- | -------------------------- | ----------------------------------------------------------------------------------- |
| Services Overview   | Microservices architecture | [services/README.md](../services/README.md)                                         |
| Patient Service     | MPI, demographics, consent | [services/patient-service/README.md](../services/patient-service/README.md)         |
| FHIR Service        | FHIR R4 REST API           | [services/fhir-service/README.md](../services/fhir-service/README.md)               |
| Appointment Service | Scheduling                 | [services/appointment-service/README.md](../services/appointment-service/README.md) |
| Encounter Service   | Clinical visits            | [services/encounter-service/README.md](../services/encounter-service/README.md)     |
| Telehealth Service  | Video, chat                | [services/telehealth-service/README.md](../services/telehealth-service/README.md)   |
| Pharmacy Service    | Prescriptions              | [services/pharmacy-service/README.md](../services/pharmacy-service/README.md)       |
| Laboratory Service  | Lab orders/results         | [services/laboratory-service/README.md](../services/laboratory-service/README.md)   |
| Imaging Service     | DICOM, radiology           | [services/imaging-service/README.md](../services/imaging-service/README.md)         |

### Adapters

| Document          | Description                | Location                                    |
| ----------------- | -------------------------- | ------------------------------------------- |
| Adapter Framework | External system connectors | [adapters/README.md](../adapters/README.md) |

### Compliance

| Document                | Description            | Location                                                                          |
| ----------------------- | ---------------------- | --------------------------------------------------------------------------------- |
| Interoperability Matrix | Country specifications | [compliance/INTEROPERABILITY_MATRIX.md](../compliance/INTEROPERABILITY_MATRIX.md) |
| HIPAA Compliance        | US compliance          | [compliance/HIPAA.md](../compliance/HIPAA.md)                                     |
| GDPR Compliance         | EU compliance          | [compliance/GDPR.md](../compliance/GDPR.md)                                       |

### FHIR

| Document            | Description                  | Location                                              |
| ------------------- | ---------------------------- | ----------------------------------------------------- |
| FHIR Implementation | FHIR R4 implementation guide | [fhir/README.md](../fhir/README.md)                   |
| Resource Profiles   | Custom FHIR profiles         | [fhir/profiles/README.md](../fhir/profiles/README.md) |

## Quick Links

### For Developers

- [API Reference](./API_REFERENCE.md)
- [Development Setup](./DEVELOPMENT.md)
- [Testing Guide](./TESTING.md)
- [Code Standards](./CODE_STANDARDS.md)

### For Operations

- [Deployment Runbook](./DEPLOYMENT.md)
- [Monitoring Guide](./MONITORING.md)
- [Incident Response](./INCIDENT_RESPONSE.md)
- [Disaster Recovery](./DISASTER_RECOVERY.md)

### For Integrators

- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Adapter Development](../adapters/README.md)
- [FHIR API](../fhir/README.md)
- [Webhook Events](./WEBHOOKS.md)

### For Compliance

- [Security Overview](../operations/security/README.md)
- [Audit Logging](./AUDIT_LOGGING.md)
- [Data Governance](./DATA_GOVERNANCE.md)
- [Privacy Policy Template](./PRIVACY_TEMPLATE.md)

## Architecture Decision Records (ADRs)

| ADR     | Title                            | Status   |
| ------- | -------------------------------- | -------- |
| ADR-001 | FHIR R4 as Canonical Data Model  | Accepted |
| ADR-002 | Multi-Region Cloud Architecture  | Accepted |
| ADR-003 | Microservices over Monolith      | Accepted |
| ADR-004 | Event-Driven Data Replication    | Accepted |
| ADR-005 | Country-Specific Adapter Pattern | Accepted |

## Changelog

| Version | Date    | Changes                       |
| ------- | ------- | ----------------------------- |
| 1.0.0   | 2024-01 | Initial platform architecture |
| 1.1.0   | 2024-02 | Added regional configurations |
| 1.2.0   | 2024-03 | Microservices segmentation    |
| 1.3.0   | 2024-04 | Adapter framework             |

## Support

- **Documentation Issues**: [GitHub Issues](https://github.com/global-healthcare/platform/issues)
- **Security Concerns**: security@global-healthcare.io
- **General Inquiries**: support@global-healthcare.io
