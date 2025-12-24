# Regional Healthcare Configurations

## Overview

This directory contains region and country-specific healthcare configurations, including regulatory frameworks, interoperability standards, data residency requirements, and national healthcare server patterns.

## Regional Structure

```
regions/
├── americas/           # North & South America
│   ├── us/             # United States
│   ├── ca/             # Canada
│   ├── mx/             # Mexico
│   ├── br/             # Brazil
│   └── ...
│
├── europe/             # European Union + UK
│   ├── de/             # Germany
│   ├── fr/             # France
│   ├── gb/             # United Kingdom
│   ├── nl/             # Netherlands
│   └── ...
│
├── africa/             # African Union nations
│   ├── ke/             # Kenya
│   ├── za/             # South Africa
│   ├── ng/             # Nigeria
│   ├── gh/             # Ghana
│   └── ...
│
├── middle-east/        # GCC and Levant
│   ├── ae/             # United Arab Emirates
│   ├── sa/             # Saudi Arabia
│   ├── il/             # Israel
│   └── ...
│
└── asia-pacific/       # APAC nations
    ├── au/             # Australia
    ├── jp/             # Japan
    ├── sg/             # Singapore
    ├── in/             # India
    └── ...
```

## Global Healthcare Server Taxonomy

### Server Type Classification

| Server Type             | Purpose                                | Common Standards       | FHIR Integration |
| ----------------------- | -------------------------------------- | ---------------------- | ---------------- |
| **FHIR Server**         | Clinical REST API for interoperability | FHIR R4, SMART on FHIR | Native           |
| **National EHR**        | Centralized patient records            | Varies by country      | Adapter required |
| **HIE**                 | Regional health information exchange   | XDS.b, XCPD, XCA       | Adapter required |
| **MPI**                 | Master Patient Index                   | PIX/PDQ, IHE           | Adapter required |
| **Terminology Service** | Code systems and value sets            | SNOMED CT, LOINC, ICD  | Native           |
| **HMIS**                | Health management information systems  | DHIS2, OpenHIM         | Adapter required |
| **Claims Exchange**     | Payer/claims processing                | X12 837/835, HL7v2     | Adapter required |
| **Pharmacy Network**    | E-prescriptions                        | NCPDP SCRIPT, HL7v2    | Adapter required |
| **Lab Exchange**        | Laboratory ordering/results            | HL7v2, FHIR R4         | Mixed            |
| **Imaging Archive**     | DICOM imaging repository               | DICOM, DICOMweb        | Adapter required |

### Regional Healthcare Patterns

#### Americas Pattern

- **Model**: Federated exchange with multiple EHR vendors
- **Key Players**: Epic, Cerner, CommonWell, Carequality
- **FHIR Maturity**: High (US), Medium (Canada), Low (Latin America)
- **Data Residency**: Regional (US/CA allowed transfer)

#### European Pattern

- **Model**: National centralized EHR with cross-border exchange
- **Key Players**: National health ministries, gematik (DE), NHS (UK)
- **FHIR Maturity**: High (Nordic), Medium (Western EU), Emerging (Eastern EU)
- **Data Residency**: Strict in-country (GDPR)

#### African Pattern

- **Model**: HMIS-first with OpenMRS/DHIS2
- **Key Players**: WHO, national health ministries, OpenHIE
- **FHIR Maturity**: Emerging
- **Data Residency**: Varies (typically in-country preferred)

#### Middle East Pattern

- **Model**: Centralized national systems
- **Key Players**: National health authorities (DHA, MOH)
- **FHIR Maturity**: Emerging to Medium
- **Data Residency**: Strict in-country

#### Asia-Pacific Pattern

- **Model**: Mixed (mature markets centralized, emerging federated)
- **Key Players**: National health ministries, regional HIEs
- **FHIR Maturity**: High (AU, JP), Medium (SG), Emerging (others)
- **Data Residency**: Varies by country

## Country Interoperability Matrix

| Country | Region   | Primary Pattern              | FHIR     | Public Health  | Required Adapters        | Data Residency |
| ------- | -------- | ---------------------------- | -------- | -------------- | ------------------------ | -------------- |
| **US**  | Americas | Federated HIE                | Yes      | CDC/Syndromic  | Epic, Cerner, CommonWell | Regional       |
| **CA**  | Americas | Provincial HIE               | Yes      | PHAC           | OSCAR, Meditech          | Regional       |
| **DE**  | Europe   | National EHR (ePA)           | Yes      | RKI            | gematik, TI-Connector    | In-country     |
| **GB**  | Europe   | NHS Spine                    | Yes      | PHE            | NHS Connect              | In-country     |
| **FR**  | Europe   | DMP (Dossier Médical)        | Partial  | Santé Publique | DMP API                  | In-country     |
| **KE**  | Africa   | HMIS-based                   | Emerging | MOH/DHIS2      | OpenMRS, DHIS2           | In-country     |
| **ZA**  | Africa   | Provincial systems           | Partial  | NICD           | Various provincial       | In-country     |
| **AE**  | MENA     | Centralized (Malaffi/Nabidh) | Yes      | DHA/DOH        | Malaffi, Nabidh          | In-country     |
| **SA**  | MENA     | National Health ID           | Emerging | MOH            | NPHIES                   | In-country     |
| **AU**  | APAC     | My Health Record             | Yes      | DOH            | My Health Record         | In-country     |
| **JP**  | APAC     | Regional HIE                 | Partial  | MHLW           | SS-MIX2                  | In-country     |
| **SG**  | APAC     | NEHR                         | Yes      | MOH            | NEHR API                 | In-country     |
| **IN**  | APAC     | ABDM                         | Emerging | NHA            | ABHA, PHR                | In-country     |

## Quick Reference

### Compliance Requirements by Region

| Region        | Primary Regulation | Consent Model   | Retention | Breach Notification |
| ------------- | ------------------ | --------------- | --------- | ------------------- |
| Americas (US) | HIPAA              | Opt-in          | 6 years   | 60 days             |
| Americas (CA) | PIPEDA/PHIPA       | Opt-in          | 10 years  | ASAP                |
| Europe (EU)   | GDPR               | Explicit opt-in | 10 years  | 72 hours            |
| Europe (UK)   | UK GDPR            | Explicit opt-in | 10 years  | 72 hours            |
| Africa        | Various DPA        | Varies          | Varies    | Varies              |
| Middle East   | Local DPL          | Varies          | Varies    | Varies              |
| Asia-Pacific  | PDPA/POPIA         | Varies          | Varies    | Varies              |

### Integration Priority by Region

| Region    | Priority 1       | Priority 2             | Priority 3        |
| --------- | ---------------- | ---------------------- | ----------------- |
| US        | Epic/Cerner FHIR | CommonWell/Carequality | Claims (X12)      |
| Canada    | Provincial HIE   | OSCAR                  | Pharmacy networks |
| Germany   | gematik TI       | ePA                    | KV Connect        |
| UK        | NHS Spine        | GP Connect             | Care.data         |
| Kenya     | DHIS2            | OpenMRS                | M-Pesa            |
| UAE       | Malaffi/Nabidh   | DHA systems            | Insurance         |
| Australia | My Health Record | State HIEs             | PBS               |
| Singapore | NEHR             | Healthier SG           | MediSave          |

## Getting Started

### Adding a New Country

1. Create country folder: `regions/{region}/{country-code}/`
2. Copy template: `cp templates/country-config.yaml regions/{region}/{country-code}/config.yaml`
3. Configure:
   - Regulatory framework
   - Data residency requirements
   - Required adapters
   - Consent model
   - Retention periods
4. Add to country registry: `packages/country-config/src/configs/`
5. Implement required adapters
6. Run compliance validation: `pnpm platform:compliance:validate --country={code}`

### Validation

```bash
# Validate all country configurations
pnpm platform:regions:validate

# Validate specific country
pnpm platform:regions:validate --country=US

# Generate interoperability report
pnpm platform:regions:report
```
