# Middle East Region

## Overview

The Middle East region covers healthcare interoperability for the Gulf Cooperation Council (GCC) nations, Levant countries, and North Africa, characterized by centralized national health systems and strict data localization requirements.

## Regional Characteristics

### Healthcare System Model

- **Centralized national systems** with government health authorities
- **Mandatory health insurance** in most GCC countries
- **Advanced digital transformation** (UAE, Saudi Vision 2030)
- **Strict data localization** requirements
- **Arabic language** support essential

### FHIR Maturity

| Country      | FHIR Adoption | Primary Standard | National System   |
| ------------ | ------------- | ---------------- | ----------------- |
| UAE          | High          | FHIR R4          | Malaffi/Nabidh    |
| Saudi Arabia | Medium        | FHIR R4          | NPHIES            |
| Israel       | High          | FHIR R4          | Eitan/Ofek        |
| Qatar        | Medium        | HL7v2/FHIR       | Cerner Millennium |
| Bahrain      | Low           | HL7v2            | I-SEHA            |
| Kuwait       | Low           | HL7v2            | AFYA              |
| Oman         | Low           | HL7v2            | MOH Systems       |
| Jordan       | Low           | HL7v2            | Hakeem            |

## Country Configurations

### United Arab Emirates (AE)

```yaml
# ae/config.yaml
country:
  code: AE
  name: United Arab Emirates
  region: middle-east
  enabled: true

regulatory:
  primary: UAE Data Protection Law 2021
  secondary:
    - Dubai Health Authority Regulations
    - DOH Abu Dhabi Regulations
    - MOHAP Federal Regulations
  enforcement: UAE Data Office

data_residency:
  location: in-country
  allowed_regions: [AE]
  cross_border: prohibited
  encryption: mandatory
  cloud_providers: [UAE-certified]

healthcare_servers:
  emirates:
    abu_dhabi:
      - name: Malaffi
        type: hie
        operator: DOH Abu Dhabi
        standard: FHIR R4
        coverage: all_licensed_facilities
        adapter: malaffi-adapter
        features:
          - unified_patient_record
          - consent_management
          - analytics_platform

    dubai:
      - name: Nabidh
        type: hie
        operator: DHA Dubai
        standard: FHIR R4
        coverage: dubai_facilities
        adapter: nabidh-adapter
        features:
          - patient_portal
          - insurance_integration
          - telemedicine

    federal:
      - name: MOHAP Systems
        type: federal_health
        operator: Ministry of Health
        adapter: mohap-adapter

  national_systems:
    - name: Emirates Health Services
      type: ehr
      vendor: Epic
      adapter: ehs-adapter

    - name: SEHA
      type: hospital_network
      vendor: Cerner
      adapter: seha-adapter

  insurance:
    - name: DHA Insurance Pool
      type: mandatory_insurance
      standard: HL7v2/FHIR
      adapter: dha-insurance-adapter

    - name: Daman Health
      type: insurance
      adapter: daman-adapter

  pharmacy:
    - name: Tatmeen
      type: track_trace
      operator: DOH
      adapter: tatmeen-adapter

consent:
  model: opt-out # National mandate for HIE
  patient_portal_access: true
  data_sharing_control: granular
  emergency_override: true

retention:
  patient_records: lifetime
  medical_imaging: 25
  audit_logs: 10

integrations:
  required:
    - Malaffi (Abu Dhabi facilities)
    - Nabidh (Dubai facilities)
  priority_2:
    - SEHA
    - Emirates Health Services
  priority_3:
    - Insurance systems
    - Tatmeen
```

### Saudi Arabia (SA)

```yaml
# sa/config.yaml
country:
  code: SA
  name: Saudi Arabia
  region: middle-east
  enabled: true

regulatory:
  primary: PDPL (Personal Data Protection Law)
  secondary:
    - National Health Information Center Regulations
    - CCHI Regulations
    - MOH Regulations
  enforcement: SDAIA, CCHI

data_residency:
  location: in-country
  allowed_regions: [SA]
  cross_border: prohibited
  government_access: required
  encryption: mandatory

healthcare_servers:
  national_systems:
    - name: NPHIES (National Platform for Health Insurance Exchange Services)
      type: insurance_exchange
      operator: CCHI
      standard: FHIR R4
      adapter: nphies-adapter
      features:
        - eligibility_verification
        - prior_authorization
        - claims_adjudication
        - provider_directory

    - name: Sehhaty
      type: patient_portal
      operator: MOH
      standard: FHIR R4
      adapter: sehhaty-adapter
      features:
        - appointment_booking
        - medical_records
        - vaccination_records
        - prescriptions

    - name: Wasfaty
      type: e_prescription
      operator: MOH
      standard: HL7v2/FHIR
      adapter: wasfaty-adapter

    - name: HESN (Health Electronic Surveillance Network)
      type: disease_surveillance
      operator: MOH
      adapter: hesn-adapter

  government_providers:
    - name: MOH Hospitals
      type: government_hospital
      count: 284
      ehr: varies
      adapter: moh-hospital-adapter

    - name: National Guard Health Affairs
      type: military_health
      ehr: Epic
      adapter: ngha-adapter

    - name: Ministry of Defense Health Services
      type: military_health
      adapter: mod-health-adapter

  private_sector:
    - name: Private Hospital Groups
      type: private_hospitals
      groups: [HMG, Sulaiman Al Habib, Dallah, etc.]
      adapter: private-hospital-sa-adapter

  insurance:
    - name: CCHI Licensed Insurers
      type: health_insurance
      count: 30+
      adapter: cchi-insurer-adapter

consent:
  model: opt-in
  national_id_required: true
  absher_integration: true

retention:
  patient_records: 10
  medical_imaging: 10
  insurance_claims: 5
  audit_logs: 10

integrations:
  required:
    - NPHIES
    - Sehhaty
    - Wasfaty
  priority_2:
    - HESN
    - MOH Hospital systems
  priority_3:
    - Private hospital groups
    - Insurance systems
```

### Israel (IL)

```yaml
# il/config.yaml
country:
  code: IL
  name: Israel
  region: middle-east
  enabled: true

regulatory:
  primary: Privacy Protection Law 5741-1981
  secondary:
    - Patient Rights Law
    - National Health Insurance Law
    - Public Health Ordinance
  enforcement: ILITA (Privacy Protection Authority)

data_residency:
  location: in-country
  allowed_regions: [IL]
  cross_border: restricted
  eu_adequacy: partial

healthcare_servers:
  health_funds:
    - name: Clalit Health Services
      type: hmo
      members: 4.7M
      market_share: 52%
      adapter: clalit-adapter

    - name: Maccabi Healthcare Services
      type: hmo
      members: 2.5M
      market_share: 27%
      adapter: maccabi-adapter

    - name: Meuhedet Health Fund
      type: hmo
      members: 1.3M
      market_share: 14%
      adapter: meuhedet-adapter

    - name: Leumit Health Fund
      type: hmo
      members: 0.7M
      market_share: 7%
      adapter: leumit-adapter

  national_systems:
    - name: Eitan (National Medical Record)
      type: national_ehr
      operator: Ministry of Health
      standard: FHIR R4
      adapter: eitan-adapter

    - name: Ofek
      type: emergency_records
      standard: FHIR R4
      adapter: ofek-adapter

    - name: Teudat Zehut (ID System)
      type: national_identity
      adapter: teudat-zehut-adapter

  hospitals:
    - name: Government Hospitals
      type: public_hospital
      ehr: varies
      adapter: gov-hospital-il-adapter

    - name: Clalit Hospitals
      type: hmo_hospital
      adapter: clalit-hospital-adapter

    - name: Private Hospitals
      type: private_hospital
      adapter: private-hospital-il-adapter

  pharmacy:
    - name: Pharmacy Networks
      type: e_prescription
      adapter: pharmacy-il-adapter

  laboratory:
    - name: Mega Lab
      type: lab_chain
      adapter: megalab-adapter

consent:
  model: opt-in
  health_fund_default: implied
  research_consent: separate

retention:
  patient_records: 7
  medical_imaging: 7
  audit_logs: 7

integrations:
  required:
    - Eitan
    - Health Fund APIs (all 4)
  priority_2:
    - Ofek
    - Hospital systems
  priority_3:
    - Laboratory networks
```

### Qatar (QA)

```yaml
# qa/config.yaml
country:
  code: QA
  name: Qatar
  region: middle-east
  enabled: true

regulatory:
  primary: Law No. 13 of 2016 (Personal Data Privacy)
  secondary:
    - Hamad Medical Corporation Regulations
    - PHCC Regulations
  enforcement: Ministry of Transport & Communications

data_residency:
  location: in-country
  allowed_regions: [QA]
  cross_border: prohibited

healthcare_servers:
  national_systems:
    - name: Hamad Medical Corporation
      type: public_healthcare
      ehr: Cerner Millennium
      standard: HL7v2/FHIR
      adapter: hmc-adapter

    - name: Primary Health Care Corporation
      type: primary_care
      facilities: 27
      adapter: phcc-adapter

    - name: Sidra Medicine
      type: women_children
      ehr: Epic
      adapter: sidra-adapter

  private_sector:
    - name: Private Hospitals
      type: private_hospital
      adapter: private-hospital-qa-adapter

  insurance:
    - name: NHIF (National Health Insurance)
      type: mandatory_insurance
      adapter: nhif-qa-adapter

consent:
  model: opt-in

integrations:
  required:
    - Hamad Medical Corporation
    - PHCC
  priority_2:
    - Sidra Medicine
```

### Bahrain (BH)

```yaml
# bh/config.yaml
country:
  code: BH
  name: Bahrain
  region: middle-east
  enabled: true

regulatory:
  primary: Personal Data Protection Law 2018
  secondary:
    - NHRA Regulations
  enforcement: Personal Data Protection Authority

healthcare_servers:
  national_systems:
    - name: I-SEHA
      type: national_ehr
      operator: NHRA
      adapter: iseha-adapter

    - name: MOH Hospitals
      type: government_hospital
      adapter: moh-bh-adapter

  private_sector:
    - name: Private Healthcare
      type: private_hospital
      adapter: private-hospital-bh-adapter

consent:
  model: opt-in

integrations:
  required:
    - I-SEHA
    - MOH Systems
```

## Regional Integration Architecture

```
                    ┌─────────────────────────────────────┐
                    │       MIDDLE EAST GATEWAY           │
                    │       (ME-SOUTH Region)             │
                    └─────────────────┬───────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│   GCC CLUSTER     │    │   LEVANT CLUSTER  │    │   ISRAEL CLUSTER  │
│   (AE, SA, QA,    │    │   (JO, LB)        │    │   (IL)            │
│    BH, KW, OM)    │    │                   │    │                   │
│                   │    │                   │    │                   │
│ ┌───────────────┐ │    │ ┌───────────────┐ │    │ ┌───────────────┐ │
│ │ UAE Systems   │ │    │ │ Hakeem (JO)   │ │    │ │ Eitan/Ofek    │ │
│ │ • Malaffi    │ │    │ └───────────────┘ │    │ ├───────────────┤ │
│ │ • Nabidh     │ │    │                   │    │ │ Health Funds  │ │
│ ├───────────────┤ │    │                   │    │ │ • Clalit     │ │
│ │ Saudi Systems │ │    │                   │    │ │ • Maccabi    │ │
│ │ • NPHIES     │ │    │                   │    │ │ • Meuhedet   │ │
│ │ • Sehhaty    │ │    │                   │    │ │ • Leumit     │ │
│ │ • Wasfaty    │ │    │                   │    │ └───────────────┘ │
│ ├───────────────┤ │    │                   │    │                   │
│ │ Qatar (HMC)   │ │    │                   │    │                   │
│ ├───────────────┤ │    │                   │    │                   │
│ │ Bahrain I-SEHA│ │    │                   │    │                   │
│ └───────────────┘ │    │                   │    │                   │
└───────────────────┘    └───────────────────┘    └───────────────────┘
```

## GCC Health Council Standards

```yaml
# gcc-standards.yaml
gcc_health_council:
  name: GCC Health Council
  member_states: [AE, SA, QA, BH, KW, OM]

  interoperability_initiatives:
    - name: GCC Electronic Health Record
      status: planning
      standard: FHIR R4

    - name: Cross-border Emergency Access
      status: pilot
      participating: [AE, SA]

  common_standards:
    terminology:
      - SNOMED CT (Arabic extension)
      - ICD-10-AM (Arabic)
      - GCC Drug Codes

    messaging:
      - HL7v2 (current)
      - FHIR R4 (target)

  data_sharing:
    # Very limited due to sovereignty
    emergency_access: bilateral_agreements
    research: anonymized_only
```

## Arabic Language Support

```yaml
# arabic-localization.yaml
localization:
  primary_language: ar
  secondary_language: en

  direction: rtl

  fhir_localization:
    display_names: arabic
    code_displays: bilingual

    resources:
      patient:
        name:
          text: ar
          family: ar
          given: ar
        address:
          text: ar
          city: ar
          country: ar

  terminology:
    snomed_ct:
      extension: Arabic
      source: IHTSDO

    icd_10:
      version: ICD-10-AM
      translation: WHO Arabic

  ui_components:
    date_format: "DD/MM/YYYY" # Gregorian
    hijri_calendar: supported
    number_format: "٠١٢٣٤٥٦٧٨٩" # Arabic-Indic optional
```

## Deployment Regions

| Cloud Region | Countries Served       | Data Center    | Notes                |
| ------------ | ---------------------- | -------------- | -------------------- |
| ME-SOUTH-1   | UAE, Oman              | Dubai          | Primary ME hub       |
| ME-CENTRAL-1 | Saudi Arabia           | Riyadh         | Saudi data residency |
| EU-SOUTH-1   | Israel                 | Milan          | EU-adjacent          |
| ME-SOUTH-2   | Qatar, Bahrain, Kuwait | Dubai (backup) | GCC overflow         |

## Compliance Checklist

### UAE

- [ ] UAE Data Protection Law compliance
- [ ] DHA licensing (Dubai)
- [ ] DOH licensing (Abu Dhabi)
- [ ] Malaffi integration certification
- [ ] Nabidh integration certification

### Saudi Arabia

- [ ] PDPL compliance
- [ ] NPHIES certification
- [ ] CCHI registration
- [ ] MOH licensing
- [ ] SDAIA approval

### Israel

- [ ] Privacy Protection Law compliance
- [ ] ILITA registration
- [ ] Ministry of Health approval
- [ ] Health fund integration agreements

### Qatar

- [ ] Personal Data Privacy Law compliance
- [ ] HMC integration requirements
- [ ] MOPH licensing

### GCC General

- [ ] Arabic language support
- [ ] In-country data residency
- [ ] Government cloud certification
- [ ] Local entity establishment
