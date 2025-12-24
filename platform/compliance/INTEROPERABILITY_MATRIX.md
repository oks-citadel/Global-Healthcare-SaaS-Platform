# Country Interoperability Matrix

## Overview

This document provides a comprehensive matrix of healthcare interoperability capabilities, regulatory requirements, and implementation specifications for each supported country in the Global Healthcare Platform.

## Matrix Summary

### Americas

| Country       | Code | FHIR        | Regulation | Data Residency | National System | HIE                     | Priority |
| ------------- | ---- | ----------- | ---------- | -------------- | --------------- | ----------------------- | -------- |
| United States | US   | R4 ✅       | HIPAA      | Regional       | -               | CommonWell, Carequality | P1       |
| Canada        | CA   | R4 ✅       | PIPEDA     | In-country     | Provincial      | Provincial HIEs         | P2       |
| Mexico        | MX   | Emerging    | LFPDPPP    | In-country     | -               | -                       | P3       |
| Brazil        | BR   | R4 Emerging | LGPD       | In-country     | RNDS            | -                       | P2       |
| Argentina     | AR   | Low         | PDPL       | In-country     | -               | -                       | P4       |
| Colombia      | CO   | Low         | Law 1581   | In-country     | -               | -                       | P4       |
| Chile         | CL   | Emerging    | Law 19628  | In-country     | -               | -                       | P4       |

### Europe

| Country        | Code | FHIR        | Regulation | Data Residency   | National System | Cross-Border | Priority |
| -------------- | ---- | ----------- | ---------- | ---------------- | --------------- | ------------ | -------- |
| Germany        | DE   | R4 ✅       | GDPR/BDSG  | In-country       | gematik TI, ePA | MyHealth@EU  | P1       |
| United Kingdom | GB   | R4 ✅       | UK GDPR    | In-country       | NHS Spine       | -            | P1       |
| France         | FR   | R4 Partial  | GDPR       | In-country (HDS) | DMP             | MyHealth@EU  | P2       |
| Netherlands    | NL   | R4 ✅       | GDPR       | In-country       | MedMij, LSP     | MyHealth@EU  | P2       |
| Spain          | ES   | R4 Emerging | GDPR       | In-country       | HCDSNS          | MyHealth@EU  | P3       |
| Italy          | IT   | R4 Emerging | GDPR       | In-country       | FSE             | MyHealth@EU  | P3       |
| Sweden         | SE   | R4 ✅       | GDPR       | In-country       | 1177 Vårdguiden | MyHealth@EU  | P2       |
| Norway         | NO   | R4 ✅       | GDPR-equiv | In-country       | Kjernejournal   | -            | P3       |
| Denmark        | DK   | R4 ✅       | GDPR       | In-country       | Sundhed.dk      | MyHealth@EU  | P3       |
| Finland        | FI   | R4 ✅       | GDPR       | In-country       | Kanta           | MyHealth@EU  | P2       |
| Austria        | AT   | R4 ✅       | GDPR       | In-country       | ELGA            | MyHealth@EU  | P3       |
| Switzerland    | CH   | R4 ✅       | nDSG       | In-country       | EPD             | -            | P3       |
| Belgium        | BE   | R4 Emerging | GDPR       | In-country       | -               | MyHealth@EU  | P3       |
| Ireland        | IE   | R4 ✅       | GDPR       | In-country       | HSE             | MyHealth@EU  | P3       |
| Poland         | PL   | R4 Emerging | GDPR       | In-country       | P1 Platform     | MyHealth@EU  | P3       |

### Africa

| Country      | Code | FHIR        | Regulation | Data Residency | National System | HMIS     | Priority |
| ------------ | ---- | ----------- | ---------- | -------------- | --------------- | -------- | -------- |
| Kenya        | KE   | R4 Emerging | DPA 2019   | In-country     | KenyaHIE        | DHIS2    | P1       |
| South Africa | ZA   | R4 Partial  | POPIA      | In-country     | HPRS, NHI       | TIER.Net | P1       |
| Nigeria      | NG   | Low         | NDPR       | In-country     | NHIS            | DHIS2    | P2       |
| Ghana        | GH   | R4 Emerging | DPA 2012   | In-country     | Ghana HIE       | DHIS2    | P2       |
| Rwanda       | RW   | R4 Emerging | Law 2021   | In-country     | Rwanda HIE      | DHIS2    | P2       |
| Tanzania     | TZ   | Low         | -          | In-country     | GOTHOMIS        | DHIS2    | P3       |
| Ethiopia     | ET   | Low         | -          | In-country     | -               | DHIS2    | P3       |
| Uganda       | UG   | R4 Emerging | DPA 2019   | In-country     | Uganda EMR      | DHIS2    | P3       |

### Middle East

| Country      | Code | FHIR       | Regulation  | Data Residency | National System | Priority |
| ------------ | ---- | ---------- | ----------- | -------------- | --------------- | -------- |
| UAE          | AE   | R4 ✅      | DPL 2021    | In-country     | Malaffi, Nabidh | P1       |
| Saudi Arabia | SA   | R4 ✅      | PDPL        | In-country     | NPHIES, Sehhaty | P1       |
| Israel       | IL   | R4 ✅      | PPL         | In-country     | Eitan, Ofek     | P2       |
| Qatar        | QA   | R4 Partial | Law 13/2016 | In-country     | HMC Systems     | P2       |
| Bahrain      | BH   | Low        | PDPL 2018   | In-country     | I-SEHA          | P3       |
| Kuwait       | KW   | Low        | -           | In-country     | AFYA            | P3       |
| Oman         | OM   | Low        | -           | In-country     | MOH Systems     | P3       |
| Jordan       | JO   | Low        | -           | In-country     | Hakeem          | P3       |

### Asia-Pacific

| Country     | Code | FHIR        | Regulation   | Data Residency | National System  | Priority |
| ----------- | ---- | ----------- | ------------ | -------------- | ---------------- | -------- |
| Australia   | AU   | R4 ✅       | Privacy Act  | In-country     | My Health Record | P1       |
| New Zealand | NZ   | R4 ✅       | Privacy Act  | In-country     | Hira             | P2       |
| Japan       | JP   | R4 Partial  | APPI         | In-country     | SS-MIX2          | P1       |
| South Korea | KR   | R4 ✅       | PIPA         | In-country     | HIRA, NHIS       | P2       |
| Singapore   | SG   | R4 ✅       | PDPA         | In-country     | NEHR             | P1       |
| India       | IN   | R4 Emerging | DPDP Act     | In-country     | ABDM             | P1       |
| Thailand    | TH   | Low         | PDPA 2019    | In-country     | MOPH Systems     | P3       |
| Indonesia   | ID   | R4 Emerging | PDP Law      | In-country     | SatuSehat        | P2       |
| Philippines | PH   | Low         | DPA 2012     | In-country     | PhilHealth       | P3       |
| Malaysia    | MY   | R4 Emerging | PDPA 2010    | In-country     | MyHIX            | P3       |
| Vietnam     | VN   | Low         | Cybersec Law | In-country     | -                | P4       |
| Taiwan      | TW   | R4 ✅       | PDPA         | In-country     | NHI System       | P3       |

## Detailed Country Specifications

### United States (US)

```yaml
country: US
region: americas
priority: P1
status: production

regulatory:
  primary: HIPAA
  secondary:
    - HITECH Act
    - 21st Century Cures Act
    - State Privacy Laws (CCPA, SHIELD, NY Privacy, etc.)
  certifications:
    - ONC Health IT Certification (if applicable)

interoperability:
  fhir:
    version: R4
    profiles:
      - US Core v5.0.1
      - Da Vinci Implementation Guides
      - SMART App Launch
    operations:
      - $everything
      - $export (Bulk Data)
      - $match
      - $member-match

  other_standards:
    - HL7v2 (legacy integration)
    - C-CDA R2.1
    - X12 EDI (claims)
    - NCPDP SCRIPT (pharmacy)

national_systems:
  none: true # Fragmented market

hie_networks:
  - name: CommonWell Health Alliance
    type: nationwide
    protocol: FHIR R4
    adapter: commonwell-adapter
    priority: P1

  - name: Carequality
    type: nationwide
    protocol: XCA/XDS, FHIR
    adapter: carequality-adapter
    priority: P1

  - name: eHealth Exchange
    type: government_plus_private
    protocol: XCA/XDS
    adapter: ehealthexchange-adapter
    priority: P2

ehr_vendors:
  - name: Epic
    market_share: 35%
    fhir: R4
    adapter: epic-fhir-adapter
    priority: P1

  - name: Cerner (Oracle Health)
    market_share: 25%
    fhir: R4
    adapter: cerner-fhir-adapter
    priority: P1

  - name: Meditech
    market_share: 15%
    fhir: R4
    adapter: meditech-adapter
    priority: P2

  - name: Allscripts
    market_share: 5%
    fhir: R4
    adapter: allscripts-adapter
    priority: P2

pharmacy:
  - name: Surescripts
    type: e-prescribing
    protocol: NCPDP SCRIPT
    adapter: surescripts-adapter
    priority: P1

laboratory:
  - name: Quest Diagnostics
    protocol: HL7v2, FHIR
    adapter: quest-adapter
    priority: P2

  - name: LabCorp
    protocol: HL7v2, FHIR
    adapter: labcorp-adapter
    priority: P2

public_health:
  - name: CDC NHSN
    type: surveillance
    protocol: HL7v2, FHIR R4
    adapter: cdc-nhsn-adapter

  - name: State Immunization Registries (IIS)
    type: immunization
    protocol: HL7v2 VXU
    adapter: iis-adapter

consent:
  model: opt-in
  hipaa_authorization: required
  state_variations: true
  minimum_age: 18
  minor_access:
    - age: 12
      conditions: [substance_abuse, mental_health, reproductive]

data_residency:
  location: regional
  allowed_regions: [US, CA]
  cross_border: true
  safeguards: [BAA, DPA]

retention:
  patient_records: 6 # years, varies by state
  medical_imaging: 7
  audit_logs: 6

deployment:
  cloud_regions:
    - US-EAST-1 (Virginia)
    - US-WEST-2 (Oregon)
  data_centers:
    - Azure East US
    - Azure West US 2
```

### Germany (DE)

```yaml
country: DE
region: europe
priority: P1
status: production

regulatory:
  primary: GDPR
  secondary:
    - BDSG (Federal Data Protection Act)
    - SGB V (Social Code Book V)
    - PDSG (Patient Data Protection Act)
    - DiGA Regulations
  certifications:
    - BSI IT-Grundschutz
    - gematik Certification

interoperability:
  fhir:
    version: R4
    profiles:
      - KBV MIO (Medical Information Objects)
      - ISiK (Standard für Krankenhausinformationssysteme)
      - gematik ePA FHIR
    operations:
      - $validate
      - $convert

  other_standards:
    - HL7v3 (legacy)
    - CDA (clinical documents)

national_systems:
  - name: Telematikinfrastruktur (TI)
    operator: gematik
    type: national_backbone
    components:
      - TI-Connector
      - eGK (Gesundheitskarte)
      - HBA (Heilberufsausweis)
      - SMC-B (Praxisausweis)
    adapter: gematik-ti-adapter
    priority: P1

  - name: ePA (elektronische Patientenakte)
    type: national_ehr
    standard: FHIR R4
    operators: [AOK, TK, Barmer, DAK, etc.]
    adapter: epa-fhir-adapter
    priority: P1

  - name: E-Rezept
    type: e-prescription
    standard: FHIR R4
    operator: gematik
    adapter: erezept-adapter
    priority: P1

  - name: KIM (Kommunikation im Medizinwesen)
    type: secure_messaging
    standard: S/MIME
    adapter: kim-adapter
    priority: P2

cross_border:
  ehdsi:
    participating: true
    status: production
    services:
      - Patient Summary (PS)
      - ePrescription
    adapter: ehdsi-ncp-adapter

consent:
  model: opt-in
  explicit_required: true
  gdpr_basis: consent
  minimum_age: 16
  epa_consent:
    levels: [full, limited, emergency]
    withdrawal: anytime
    granular: per_document

data_residency:
  location: in-country
  allowed_regions: [DE]
  cross_border: false
  encryption: mandatory

retention:
  patient_records: 10
  medical_imaging: 30
  prescriptions: 3
  genetic_data: 30
  audit_logs: 10

deployment:
  cloud_regions:
    - EU-CENTRAL-1 (Frankfurt)
  data_centers:
    - Azure Germany West Central
    - Sovereign Cloud options
```

### Kenya (KE)

```yaml
country: KE
region: africa
priority: P1
status: production

regulatory:
  primary: Data Protection Act 2019
  secondary:
    - Health Act 2017
    - Kenya Health Policy 2014-2030
  enforcement: ODPC

interoperability:
  fhir:
    version: R4
    status: emerging
    profiles:
      - Kenya FHIR Implementation Guide
    implementation: OpenHIE-based

  other_standards:
    - HL7v2 (lab messaging)
    - DHIS2 API (aggregate data)

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
    priority: P1

  - name: DHIS2 Kenya
    type: hmis
    standard: DHIS2 API
    purpose: aggregate_reporting
    adapter: dhis2-adapter
    priority: P1

  - name: KMHFL (Master Health Facility List)
    type: facility_registry
    standard: FHIR R4
    adapter: kmhfl-adapter
    priority: P2

clinical_systems:
  - name: KenyaEMR
    type: emr
    base: OpenMRS
    standard: FHIR R4
    facilities: 3000+
    adapter: kenyaemr-adapter
    priority: P1

  - name: IQCare
    type: hiv_emr
    focus: HIV/AIDS
    adapter: iqcare-adapter
    priority: P2

mobile_health:
  - name: M-TIBA
    type: mobile_health_wallet
    operator: Safaricom
    adapter: mtiba-adapter
    priority: P2

  - name: M-Pesa Health
    type: mobile_payment
    adapter: mpesa-health-adapter
    priority: P2

consent:
  model: opt-in
  verbal_consent: allowed
  community_consent: recognized
  witness_required: sometimes
  minimum_age: 18

data_residency:
  location: in-country
  allowed_regions: [KE]
  cross_border: limited

retention:
  patient_records: 5
  aggregate_data: permanent
  audit_logs: 5

deployment:
  cloud_regions:
    - AF-SOUTH-1 (Johannesburg) # Closest region
  data_centers:
    - Azure South Africa North
```

### United Arab Emirates (AE)

```yaml
country: AE
region: middle-east
priority: P1
status: production

regulatory:
  primary: UAE Data Protection Law 2021
  secondary:
    - Dubai Health Authority Regulations
    - DOH Abu Dhabi Regulations
    - MOHAP Federal Regulations
  enforcement: UAE Data Office

interoperability:
  fhir:
    version: R4
    status: high
    profiles:
      - UAE National FHIR Profile
      - Malaffi FHIR IG
      - Nabidh FHIR IG

national_systems:
  abu_dhabi:
    - name: Malaffi
      type: hie
      operator: DOH Abu Dhabi
      standard: FHIR R4
      coverage: all_licensed_facilities
      adapter: malaffi-adapter
      priority: P1

  dubai:
    - name: Nabidh
      type: hie
      operator: DHA Dubai
      standard: FHIR R4
      coverage: dubai_facilities
      adapter: nabidh-adapter
      priority: P1

  hospital_systems:
    - name: Emirates Health Services (EHS)
      type: hospital_network
      ehr: Epic
      adapter: ehs-adapter
      priority: P1

    - name: SEHA
      type: hospital_network
      ehr: Cerner
      adapter: seha-adapter
      priority: P1

pharmacy:
  - name: Tatmeen
    type: track_trace
    operator: DOH
    adapter: tatmeen-adapter
    priority: P2

consent:
  model: opt-out # National mandate for HIE
  patient_portal_access: true
  data_sharing_control: granular
  emergency_override: true

data_residency:
  location: in-country
  allowed_regions: [AE]
  cross_border: prohibited
  encryption: mandatory
  cloud_providers: [UAE-certified]

retention:
  patient_records: lifetime
  medical_imaging: 25
  audit_logs: 10

deployment:
  cloud_regions:
    - ME-SOUTH-1 (Dubai)
  data_centers:
    - Azure UAE North
```

### Australia (AU)

```yaml
country: AU
region: asia-pacific
priority: P1
status: production

regulatory:
  primary: Privacy Act 1988
  secondary:
    - My Health Records Act 2012
    - Australian Privacy Principles (APPs)
    - State Health Records Acts
  enforcement: OAIC, ADHA

interoperability:
  fhir:
    version: R4
    status: high
    profiles:
      - AU Base FHIR IG
      - AU Core FHIR IG
      - ADHA Specifications
    operations:
      - $everything
      - $validate

national_systems:
  - name: My Health Record
    type: national_ehr
    operator: ADHA
    standard: FHIR R4, CDA
    coverage: 23M+ Australians
    adapter: mhr-adapter
    priority: P1
    features:
      - shared_health_summaries
      - discharge_summaries
      - prescription_records
      - pathology_reports
      - diagnostic_imaging

  - name: Healthcare Identifiers Service
    type: national_identity
    operator: Services Australia
    identifiers:
      - IHI (Individual Healthcare Identifier)
      - HPI-I (Provider - Individual)
      - HPI-O (Provider - Organisation)
    adapter: hi-service-adapter
    priority: P1

  - name: National Clinical Terminology Service
    type: terminology
    operator: ADHA
    terminologies:
      - SNOMED CT-AU
      - AMT (Australian Medicines Terminology)
    adapter: ncts-adapter
    priority: P2

clinical_systems:
  - name: Best Practice
    type: gp_software
    market_share: 45%
    adapter: best-practice-adapter
    priority: P2

  - name: Medical Director
    type: gp_software
    market_share: 35%
    adapter: medical-director-adapter
    priority: P2

pharmacy:
  - name: eRx Script Exchange
    type: e_prescription
    operator: Fred IT
    adapter: erx-adapter
    priority: P1

  - name: PBS (Pharmaceutical Benefits Scheme)
    type: medication_subsidies
    operator: Services Australia
    adapter: pbs-adapter
    priority: P2

consent:
  model: opt-out
  mhr_opt_out: permanent
  access_controls: granular
  emergency_access: break-glass

data_residency:
  location: in-country
  allowed_regions: [AU]
  cross_border: restricted

retention:
  patient_records: 7
  medical_imaging: 7
  pathology: 7
  audit_logs: 7

deployment:
  cloud_regions:
    - AP-SOUTHEAST-2 (Sydney)
  data_centers:
    - Azure Australia East
```

### India (IN)

```yaml
country: IN
region: asia-pacific
priority: P1
status: implementation

regulatory:
  primary: DPDP Act 2023
  secondary:
    - IT Act 2000
    - Clinical Establishments Act
    - ABDM Guidelines
  enforcement: Data Protection Board of India

interoperability:
  fhir:
    version: R4
    status: emerging
    profiles:
      - ABDM FHIR IG
      - NDHM Health Data Standards
    operations:
      - $consent

national_systems:
  - name: ABDM (Ayushman Bharat Digital Mission)
    type: national_digital_health
    operator: NHA
    standard: FHIR R4
    adapter: abdm-gateway-adapter
    priority: P1
    components:
      - name: ABHA (Health Account)
        type: health_id
        adapter: abha-adapter

      - name: HPR (Health Professional Registry)
        type: provider_directory
        adapter: hpr-adapter

      - name: HFR (Health Facility Registry)
        type: facility_registry
        adapter: hfr-adapter

  - name: Ayushman Bharat - PMJAY
    type: insurance_scheme
    coverage: 500M+
    adapter: pmjay-adapter
    priority: P2

diagnostic_chains:
  - name: Dr. Lal PathLabs
    type: lab_chain
    adapter: lal-pathlabs-adapter
    priority: P2

  - name: SRL Diagnostics
    type: lab_chain
    adapter: srl-adapter
    priority: P3

telemedicine:
  platforms: [Practo, Apollo 24/7, DocsApp]
  adapter: telemedicine-india-adapter
  priority: P2

consent:
  model: opt-in
  abdm_consent_manager: required
  granular_consent: per_transaction
  consent_artifact: abdm_standard

data_residency:
  location: in-country
  allowed_regions: [IN]
  cross_border: conditional
  critical_data: localization_required

retention:
  patient_records: 3
  medical_imaging: 3
  audit_logs: 3

deployment:
  cloud_regions:
    - AP-SOUTH-1 (Mumbai)
  data_centers:
    - Azure Central India
```

## Implementation Priorities

### Phase 1 (P1 Countries) - Immediate

| Country | Key Integration                       | Timeline |
| ------- | ------------------------------------- | -------- |
| US      | Epic, Cerner, CommonWell, Carequality | Q1       |
| DE      | gematik TI, ePA, E-Rezept             | Q1-Q2    |
| GB      | NHS Spine, GP Connect                 | Q2       |
| AE      | Malaffi, Nabidh                       | Q2       |
| SA      | NPHIES, Sehhaty                       | Q2-Q3    |
| AU      | My Health Record                      | Q2       |
| SG      | NEHR                                  | Q2       |
| KE      | KenyaHIE, DHIS2                       | Q2       |
| ZA      | HPRS, TIER.Net                        | Q3       |
| IN      | ABDM                                  | Q3       |
| JP      | SS-MIX2                               | Q3       |

### Phase 2 (P2 Countries) - Near-term

| Country | Key Integration       | Timeline |
| ------- | --------------------- | -------- |
| CA      | Provincial HIEs       | Q3-Q4    |
| FR      | DMP, Mon Espace Santé | Q3       |
| NL      | MedMij, LSP           | Q3       |
| BR      | RNDS                  | Q4       |
| NZ      | Hira                  | Q4       |
| KR      | HIRA, NHIS            | Q4       |
| IL      | Eitan, Health Funds   | Q4       |
| NG      | DHIS2, LAMIS          | Q4       |
| GH      | Ghana HIE             | Q4       |
| ID      | SatuSehat             | Q4       |

### Phase 3-4 (P3/P4 Countries) - Future

Expansion based on market demand and regulatory readiness.

## Compliance Checklist Template

```yaml
# compliance-checklist.yaml
country: XX
completed_by: ""
date: ""

regulatory:
  - item: Primary regulation compliance documented
    status: pending
    evidence: ""

  - item: Secondary regulations identified
    status: pending
    evidence: ""

  - item: Certification requirements met
    status: pending
    evidence: ""

technical:
  - item: FHIR profile conformance validated
    status: pending
    evidence: ""

  - item: National system adapters implemented
    status: pending
    evidence: ""

  - item: Authentication flows tested
    status: pending
    evidence: ""

data_protection:
  - item: Data residency requirements met
    status: pending
    evidence: ""

  - item: Encryption standards implemented
    status: pending
    evidence: ""

  - item: Consent management configured
    status: pending
    evidence: ""

  - item: Retention policies implemented
    status: pending
    evidence: ""

operational:
  - item: Local language support
    status: pending
    evidence: ""

  - item: Time zone handling
    status: pending
    evidence: ""

  - item: Currency support
    status: pending
    evidence: ""

  - item: Support hours defined
    status: pending
    evidence: ""
```
