# Africa Region

## Overview

The Africa region covers healthcare interoperability across the African Union nations, with focus on HMIS-first approaches using OpenMRS, DHIS2, and emerging FHIR adoption.

## Regional Characteristics

### Healthcare System Model

- **Public health focus** with donor-supported infrastructure
- **HMIS-centric** data collection (DHIS2 dominant)
- **Mobile-first** patient engagement (SMS, USSD, M-Pesa)
- **OpenMRS/OpenHIE** as common platform
- **Emerging FHIR** adoption through WHO initiatives

### FHIR Maturity

| Country      | FHIR Adoption | Primary Standard | National System |
| ------------ | ------------- | ---------------- | --------------- |
| Kenya        | Emerging      | FHIR R4          | Kenya HIE       |
| South Africa | Medium        | HL7v2/FHIR       | NHI (planned)   |
| Nigeria      | Low           | HL7v2            | NHIS            |
| Ghana        | Emerging      | FHIR R4          | Ghana HIE       |
| Rwanda       | Emerging      | FHIR R4          | Rwanda HIE      |
| Tanzania     | Low           | DHIS2            | GOTHOMIS        |
| Ethiopia     | Low           | DHIS2            | HMIS            |
| Uganda       | Emerging      | OpenMRS/FHIR     | Uganda EMR      |

## Country Configurations

### Kenya (KE)

```yaml
# ke/config.yaml
country:
  code: KE
  name: Kenya
  region: africa
  enabled: true

regulatory:
  primary: Data Protection Act 2019
  secondary:
    - Health Act 2017
    - Kenya Health Policy 2014-2030
  enforcement: ODPC (Office of Data Protection Commissioner)

data_residency:
  location: in-country
  allowed_regions: [KE]
  cross_border: limited
  safeguards: [SCC, consent]

healthcare_servers:
  national_systems:
    - name: Kenya Health Information Exchange (KenyaHIE)
      type: national_hie
      standard: OpenHIE/FHIR R4
      components:
        - OpenHIM (Interoperability Layer)
        - OpenCR (Client Registry)
        - OpenSHR (Shared Health Record)
        - HAPI FHIR Server
      adapter: kenya-hie-adapter

    - name: DHIS2 Kenya
      type: hmis
      standard: DHIS2 API
      purpose: aggregate_reporting
      adapter: dhis2-adapter

    - name: KMHFL (Kenya Master Health Facility List)
      type: facility_registry
      standard: FHIR R4
      adapter: kmhfl-adapter

  regional_systems:
    - name: County Health Information Systems
      type: county_his
      count: 47
      adapter: county-his-adapter

  clinical_systems:
    - name: KenyaEMR
      type: emr
      base: OpenMRS
      standard: FHIR R4
      facilities: 3000+
      adapter: kenyaemr-adapter

    - name: IQCare
      type: hiv_emr
      standard: OpenMRS
      adapter: iqcare-adapter

  pharmacy:
    - name: KEMSA (Kenya Medical Supplies Authority)
      type: supply_chain
      adapter: kemsa-adapter

  laboratory:
    - name: NASCOP Lab System
      type: lab_network
      focus: HIV/TB
      adapter: nascop-adapter

  mobile_health:
    - name: M-TIBA
      type: mobile_health_wallet
      operator: Safaricom
      adapter: mtiba-adapter

    - name: M-Pesa Health
      type: mobile_payment
      adapter: mpesa-health-adapter

consent:
  model: opt-in
  verbal_consent: allowed
  community_consent: recognized
  minimum_age: 18

retention:
  patient_records: 5
  aggregate_data: permanent
  audit_logs: 5

integrations:
  required:
    - KenyaHIE
    - DHIS2
    - KenyaEMR
  priority_2:
    - KMHFL
    - KEMSA
  priority_3:
    - M-TIBA
    - County systems
```

### South Africa (ZA)

```yaml
# za/config.yaml
country:
  code: ZA
  name: South Africa
  region: africa
  enabled: true

regulatory:
  primary: POPIA (Protection of Personal Information Act)
  secondary:
    - National Health Act 2003
    - NHI Bill
  enforcement: Information Regulator

data_residency:
  location: in-country
  allowed_regions: [ZA]
  cross_border: conditional
  popia_compliance: required

healthcare_servers:
  national_systems:
    - name: HPRS (Health Patient Registration System)
      type: master_patient_index
      operator: National DoH
      adapter: hprs-adapter

    - name: NHI (National Health Insurance)
      type: national_payer
      status: implementation
      adapter: nhi-adapter

    - name: NHLS (National Health Laboratory Service)
      type: lab_network
      adapter: nhls-adapter

  provincial_systems:
    - name: TIER.Net
      type: hiv_monitoring
      provinces: all
      adapter: tiernet-adapter

    - name: Provincial EMR Systems
      type: emr
      varies_by_province: true
      adapter: provincial-emr-adapter

  clinical_systems:
    - name: HPVS (Health Patient Verification System)
      type: identity_verification
      adapter: hpvs-adapter

  surveillance:
    - name: NICD (National Institute for Communicable Diseases)
      type: disease_surveillance
      adapter: nicd-adapter

  private_sector:
    - name: Discovery Health
      type: medical_scheme
      market_share: 30%
      adapter: discovery-adapter

    - name: Private Hospital Groups
      type: hospital_ehr
      groups: [Netcare, Mediclinic, Life Healthcare]
      adapter: private-hospital-adapter

consent:
  model: opt-in
  popia_principles:
    - lawfulness
    - minimality
    - purpose_limitation
    - retention_limitation

retention:
  patient_records: 5
  medical_imaging: 5
  audit_logs: 5

integrations:
  required:
    - HPRS
    - TIER.Net
    - NHLS
  priority_2:
    - NHI (when available)
    - NICD
  priority_3:
    - Private hospital groups
    - Medical schemes
```

### Nigeria (NG)

```yaml
# ng/config.yaml
country:
  code: NG
  name: Nigeria
  region: africa
  enabled: true

regulatory:
  primary: NDPR (Nigeria Data Protection Regulation)
  secondary:
    - National Health Act 2014
    - NHIS Act
  enforcement: NITDA

data_residency:
  location: in-country
  allowed_regions: [NG]
  cross_border: restricted

healthcare_servers:
  national_systems:
    - name: NHIS (National Health Insurance Scheme)
      type: national_insurance
      adapter: nhis-ng-adapter

    - name: DHIS2 Nigeria
      type: hmis
      operator: FMOH
      adapter: dhis2-ng-adapter

    - name: NHMIS (National Health Management Information System)
      type: aggregate_reporting
      adapter: nhmis-adapter

  state_systems:
    - name: State Primary Healthcare Boards
      type: state_pchb
      states: 36
      adapter: state-pchb-adapter

  clinical_systems:
    - name: LAMIS (Lafiya Management Information System)
      type: hiv_emr
      facilities: 1500+
      adapter: lamis-adapter

    - name: NMRS (Nigeria Medical Record System)
      type: emr
      base: OpenMRS
      adapter: nmrs-adapter

  laboratory:
    - name: NCDC Lab Network
      type: disease_surveillance
      adapter: ncdc-adapter

consent:
  model: opt-in
  ndpr_compliance: required

retention:
  patient_records: 5
  aggregate_data: permanent

integrations:
  required:
    - DHIS2 Nigeria
    - LAMIS
    - NMRS
  priority_2:
    - NHIS
    - NCDC
```

### Ghana (GH)

```yaml
# gh/config.yaml
country:
  code: GH
  name: Ghana
  region: africa
  enabled: true

regulatory:
  primary: Data Protection Act 2012
  secondary:
    - National Health Insurance Act
    - Ghana Health Service Act
  enforcement: Data Protection Commission

healthcare_servers:
  national_systems:
    - name: Ghana HIE
      type: national_hie
      standard: OpenHIE/FHIR R4
      adapter: ghana-hie-adapter

    - name: NHIA (National Health Insurance Authority)
      type: national_insurance
      adapter: nhia-adapter

    - name: DHIS2 Ghana
      type: hmis
      adapter: dhis2-gh-adapter

  clinical_systems:
    - name: Lightwave EMR
      type: emr
      facilities: 500+
      adapter: lightwave-adapter

    - name: OpenMRS Ghana
      type: emr
      adapter: openmrs-gh-adapter

consent:
  model: opt-in

integrations:
  required:
    - Ghana HIE
    - DHIS2
    - NHIA
```

### Rwanda (RW)

```yaml
# rw/config.yaml
country:
  code: RW
  name: Rwanda
  region: africa
  enabled: true

regulatory:
  primary: Law on Protection of Personal Data 2021
  secondary:
    - Health Sector Policy
  enforcement: NCSA

healthcare_servers:
  national_systems:
    - name: Rwanda HIE
      type: national_hie
      standard: OpenHIE/FHIR R4
      maturity: advanced
      adapter: rwanda-hie-adapter

    - name: HMIS (Health Management Information System)
      type: hmis
      standard: DHIS2
      adapter: dhis2-rw-adapter

    - name: Community Health Worker System
      type: chw_management
      adapter: chw-rw-adapter

  clinical_systems:
    - name: OpenMRS Rwanda
      type: emr
      facilities: 500+
      adapter: openmrs-rw-adapter

  pharmacy:
    - name: eLMIS Rwanda
      type: supply_chain
      adapter: elmis-rw-adapter

consent:
  model: opt-in
  community_based: true

integrations:
  required:
    - Rwanda HIE
    - DHIS2
    - OpenMRS
```

## Regional Integration Architecture

```
                    ┌─────────────────────────────────────┐
                    │       AFRICA GATEWAY                │
                    │       (AF-SOUTH Region)             │
                    └─────────────────┬───────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│   EAST AFRICA     │    │   SOUTH AFRICA    │    │   WEST AFRICA     │
│   CLUSTER         │    │   CLUSTER         │    │   CLUSTER         │
│   (KE, RW, UG,    │    │   (ZA)            │    │   (NG, GH)        │
│    TZ, ET)        │    │                   │    │                   │
│                   │    │                   │    │                   │
│ ┌───────────────┐ │    │ ┌───────────────┐ │    │ ┌───────────────┐ │
│ │ OpenHIE Stack │ │    │ │ HPRS/NHI      │ │    │ │ DHIS2 NG/GH   │ │
│ ├───────────────┤ │    │ ├───────────────┤ │    │ ├───────────────┤ │
│ │ DHIS2 Adapter │ │    │ │ TIER.Net      │ │    │ │ LAMIS Adapter │ │
│ ├───────────────┤ │    │ ├───────────────┤ │    │ ├───────────────┤ │
│ │ OpenMRS/EMR   │ │    │ │ Provincial    │ │    │ │ NHIA Adapter  │ │
│ └───────────────┘ │    │ └───────────────┘ │    │ └───────────────┘ │
│                   │    │                   │    │                   │
│ Mobile Health:    │    │                   │    │                   │
│ ┌───────────────┐ │    │                   │    │                   │
│ │ M-TIBA        │ │    │                   │    │                   │
│ │ M-Pesa Health │ │    │                   │    │                   │
│ │ USSD Gateway  │ │    │                   │    │                   │
│ └───────────────┘ │    │                   │    │                   │
└───────────────────┘    └───────────────────┘    └───────────────────┘
```

## OpenHIE Reference Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       PLATFORM LAYER                                 │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    FHIR API (Our Platform)                       ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                  │                                   │
│                                  ▼                                   │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │              OpenHIM (Interoperability Layer)                    ││
│  │                                                                  ││
│  │  • Request routing & orchestration                               ││
│  │  • Transaction logging & audit                                   ││
│  │  • Security & authentication                                     ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│  OpenCR       │        │  OpenSHR      │        │  HAPI FHIR    │
│  (Client      │        │  (Shared      │        │  (FHIR        │
│   Registry)   │        │   Health      │        │   Server)     │
│               │        │   Record)     │        │               │
│ • MPI/EMPI    │        │ • Patient     │        │ • FHIR R4     │
│ • Matching    │        │   summaries   │        │ • Bulk ops    │
│ • Linking     │        │ • History     │        │ • Search      │
└───────────────┘        └───────────────┘        └───────────────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    POINT-OF-SERVICE LAYER                            │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │  OpenMRS    │  │  DHIS2      │  │  RapidSMS   │  │  ODK        ││
│  │  (Clinical  │  │  (HMIS)     │  │  (mHealth)  │  │  (Data      ││
│  │   Care)     │  │             │  │             │  │   Collection││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

## Mobile Health Integration

### SMS/USSD Gateway

```yaml
# mobile-gateway.yaml
mobile_health:
  sms_gateway:
    providers:
      - name: Africa's Talking
        countries: [KE, NG, UG, TZ, RW]
        adapter: africastalking-adapter

      - name: Twilio
        countries: [ZA, GH]
        adapter: twilio-adapter

    use_cases:
      - appointment_reminders
      - medication_adherence
      - lab_result_notifications
      - health_tips
      - two_way_consultation

  ussd_gateway:
    providers:
      - name: Africa's Talking USSD
        adapter: at-ussd-adapter

    services:
      - health_screening
      - facility_finder
      - insurance_check
      - emergency_contacts

  mobile_money:
    providers:
      - name: M-Pesa
        countries: [KE, TZ]
        adapter: mpesa-adapter

      - name: MTN MoMo
        countries: [GH, UG, RW]
        adapter: mtn-momo-adapter

    use_cases:
      - consultation_payment
      - insurance_premium
      - medication_purchase
```

## Deployment Regions

| Cloud Region | Countries Served     | Data Center  | Notes              |
| ------------ | -------------------- | ------------ | ------------------ |
| AF-SOUTH-1   | South Africa         | Johannesburg | Primary Africa hub |
| EU-WEST-1    | East Africa (backup) | Dublin       | Disaster recovery  |
| ME-SOUTH-1   | North Africa         | Dubai        | MENA overflow      |

## Compliance Checklist

### Pan-African

- [ ] African Union Data Policy Framework
- [ ] Country-specific DPA compliance
- [ ] WHO data sharing guidelines

### Kenya

- [ ] Data Protection Act 2019 compliance
- [ ] ODPC registration
- [ ] Cross-border transfer approval

### South Africa

- [ ] POPIA compliance
- [ ] Information Regulator registration
- [ ] PAIA manual

### Nigeria

- [ ] NDPR compliance
- [ ] NITDA registration
- [ ] Data protection audit

### Ghana

- [ ] Data Protection Act compliance
- [ ] DPC registration
