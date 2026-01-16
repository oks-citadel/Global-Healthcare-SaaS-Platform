# Americas Region

## Overview

The Americas region covers healthcare interoperability for North America (US, Canada, Mexico) and South America (Brazil, Argentina, Chile, Colombia, etc.).

## Regional Characteristics

### Healthcare System Model

- **United States**: Private insurance-based with fragmented EHR landscape
- **Canada**: Provincial single-payer systems
- **Latin America**: Mixed public/private systems

### FHIR Maturity

| Country       | FHIR Adoption | Primary Standard | Notes                                   |
| ------------- | ------------- | ---------------- | --------------------------------------- |
| United States | High          | FHIR R4          | ONC mandated via 21st Century Cures Act |
| Canada        | Medium        | FHIR R4          | Provincial adoption varies              |
| Mexico        | Low           | HL7v2            | FHIR emerging                           |
| Brazil        | Low           | HL7v2/TISS       | National standard TISS                  |
| Argentina     | Low           | HL7v2            | Fragmented                              |

## Country Configurations

### United States (US)

```yaml
# us/config.yaml
country:
  code: US
  name: United States
  region: americas
  enabled: true

regulatory:
  primary: HIPAA
  secondary:
    - HITECH
    - 21st Century Cures Act
    - State Privacy Laws (CCPA, SHIELD, etc.)
  enforcement: HHS OCR

data_residency:
  location: regional
  allowed_regions: [US, CA]
  cross_border: true
  safeguards: [BAA, DPA]

healthcare_servers:
  ehr_vendors:
    - name: Epic
      fhir: R4
      market_share: 35%
      adapter: epic-fhir-adapter

    - name: Cerner (Oracle Health)
      fhir: R4
      market_share: 25%
      adapter: cerner-fhir-adapter

    - name: Meditech
      fhir: R4
      market_share: 15%
      adapter: meditech-fhir-adapter

    - name: Allscripts
      fhir: R4
      market_share: 5%
      adapter: allscripts-fhir-adapter

  hie_networks:
    - name: CommonWell Health Alliance
      type: nationwide
      members: 30000+
      protocol: FHIR R4
      adapter: commonwell-adapter

    - name: Carequality
      type: nationwide
      members: 70%+ hospitals
      protocol: XCA/XDS, FHIR
      adapter: carequality-adapter

    - name: eHealth Exchange
      type: nationwide
      members: government + private
      protocol: XCA/XDS
      adapter: ehealthexchange-adapter

  public_health:
    - name: CDC NHSN
      type: surveillance
      protocol: HL7v2, FHIR R4
      adapter: cdc-nhsn-adapter

    - name: State Immunization Registries
      type: registry
      protocol: HL7v2 VXU
      adapter: iis-adapter

  claims:
    - name: X12 EDI
      standards: [837P, 837I, 835, 270/271, 276/277]
      adapter: x12-claims-adapter

  pharmacy:
    - name: Surescripts
      type: e-prescribing
      protocol: NCPDP SCRIPT
      adapter: surescripts-adapter

consent:
  model: opt-in
  minimum_age: 18
  minor_rules:
    - age: 12
      conditions: [substance_abuse, mental_health, reproductive]
  hipaa_authorizations: true

retention:
  patient_records: 6 # years (varies by state)
  medical_imaging: 7
  prescriptions: 2
  audit_logs: 6

integrations:
  priority_1:
    - Epic FHIR
    - Cerner FHIR
    - CommonWell
    - Carequality
  priority_2:
    - X12 Claims
    - Surescripts
    - State HIEs
  priority_3:
    - Lab networks (Quest, LabCorp)
    - Pharmacy chains
```

### Canada (CA)

```yaml
# ca/config.yaml
country:
  code: CA
  name: Canada
  region: americas
  enabled: true

regulatory:
  primary: PIPEDA
  secondary:
    - Provincial health privacy laws (PHIPA-ON, HIA-AB, etc.)
  enforcement: OPC

data_residency:
  location: in-country
  allowed_regions: [CA]
  cross_border: limited
  safeguards: [SCC, Adequacy]

healthcare_servers:
  provincial_systems:
    - province: Ontario
      name: ConnectingOntario
      type: provincial_ehr
      fhir: R4
      adapter: ontario-ehr-adapter

    - province: Alberta
      name: Alberta Netcare
      type: provincial_ehr
      fhir: R4
      adapter: alberta-netcare-adapter

    - province: British Columbia
      name: CareConnect
      type: provincial_ehr
      fhir: R4
      adapter: bc-careconnect-adapter

  ehr_vendors:
    - name: OSCAR
      type: open-source
      market: primary_care
      adapter: oscar-adapter

    - name: Telus Health
      type: commercial
      market: multi-specialty
      adapter: telus-health-adapter

  pharmacy:
    - name: PharmaNet (BC)
      type: provincial
      adapter: pharmanet-adapter

    - name: DIS (Drug Information System)
      type: provincial
      adapter: dis-adapter

consent:
  model: opt-in
  minimum_age: varies_by_province
  circle_of_care: true

retention:
  patient_records: 10
  medical_imaging: 10
  prescriptions: 6
```

### Brazil (BR)

```yaml
# br/config.yaml
country:
  code: BR
  name: Brazil
  region: americas
  enabled: true

regulatory:
  primary: LGPD
  secondary:
    - CFM Resolutions
    - ANS Regulations
  enforcement: ANPD

data_residency:
  location: in-country
  allowed_regions: [BR]
  cross_border: limited

healthcare_servers:
  national_systems:
    - name: RNDS (Rede Nacional de Dados em Saúde)
      type: national_ehr
      standard: FHIR R4
      adapter: rnds-adapter

    - name: DATASUS
      type: public_health
      standard: SINAN, SIM, SINASC
      adapter: datasus-adapter

  private_sector:
    - name: TISS
      type: claims_exchange
      standard: TISS XML
      adapter: tiss-adapter

  terminology:
    - name: SIGTAP
      type: procedure_codes
      adapter: sigtap-adapter

consent:
  model: opt-in
  lgpd_basis: consent, legal_obligation, vital_interest

retention:
  patient_records: 20
  medical_imaging: 20
```

## Regional Integration Architecture

```
                    ┌─────────────────────────────────────┐
                    │       AMERICAS GATEWAY              │
                    │       (US-EAST Region)              │
                    └─────────────────┬───────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│    US CLUSTER     │    │   CANADA CLUSTER  │    │  LATAM CLUSTER    │
│                   │    │                   │    │                   │
│ ┌───────────────┐ │    │ ┌───────────────┐ │    │ ┌───────────────┐ │
│ │ Epic Adapter  │ │    │ │ Ontario HIE   │ │    │ │ RNDS Adapter  │ │
│ ├───────────────┤ │    │ ├───────────────┤ │    │ ├───────────────┤ │
│ │ Cerner Adapter│ │    │ │ Alberta HIE   │ │    │ │ TISS Adapter  │ │
│ ├───────────────┤ │    │ ├───────────────┤ │    │ ├───────────────┤ │
│ │ CommonWell    │ │    │ │ BC HIE        │ │    │ │ DATASUS       │ │
│ ├───────────────┤ │    │ ├───────────────┤ │    │ └───────────────┘ │
│ │ Carequality   │ │    │ │ OSCAR         │ │    │                   │
│ ├───────────────┤ │    │ └───────────────┘ │    │                   │
│ │ Surescripts   │ │    │                   │    │                   │
│ ├───────────────┤ │    │                   │    │                   │
│ │ X12 Claims    │ │    │                   │    │                   │
│ └───────────────┘ │    │                   │    │                   │
└───────────────────┘    └───────────────────┘    └───────────────────┘
```

## Deployment Regions

| Cloud Region | Countries Served | Data Center |
| ------------ | ---------------- | ----------- |
| US-EAST-1    | US (Eastern)     | Virginia    |
| US-WEST-2    | US (Western)     | Oregon      |
| CA-CENTRAL-1 | Canada           | Toronto     |
| SA-EAST-1    | Brazil, LATAM    | São Paulo   |

## Compliance Checklist

### United States

- [ ] HIPAA Business Associate Agreement
- [ ] 21st Century Cures Act compliance
- [ ] State-specific requirements (CCPA, etc.)
- [ ] ONC Certification (if applicable)

### Canada

- [ ] PIPEDA compliance
- [ ] Provincial health privacy compliance
- [ ] Privacy Impact Assessment

### Brazil

- [ ] LGPD compliance
- [ ] ANPD registration
- [ ] CFM requirements for telemedicine
