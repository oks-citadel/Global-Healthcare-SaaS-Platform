# Data Classification Policy

**Document Version:** 1.0
**Effective Date:** January 2025
**Classification:** Internal - Compliance Policy
**Regulatory Basis:** HIPAA, GDPR, SOC2, POPIA

---

## Table of Contents

1. [Overview](#overview)
2. [Classification Levels](#classification-levels)
3. [PII Data Types and Handling](#pii-data-types-and-handling)
4. [PHI Data Types and Handling](#phi-data-types-and-handling)
5. [Data Retention Policies](#data-retention-policies)
6. [Encryption Requirements](#encryption-requirements)
7. [Access Control Requirements](#access-control-requirements)

---

## Overview

### Purpose

This Data Classification Policy establishes a framework for categorizing data based on sensitivity, regulatory requirements, and business impact. Proper classification ensures appropriate security controls are applied consistently across the Unified Health Platform.

### Scope

This policy applies to all data:
- Collected, processed, or stored by the platform
- Transmitted to or from third parties
- Backed up or archived
- Created by users, patients, or providers

### Classification Principles

1. **Default to Higher Classification** - When uncertain, apply the higher classification level
2. **Aggregate Sensitivity** - Combined data may have higher classification than individual elements
3. **Contextual Classification** - Same data type may have different classifications based on context
4. **Regulatory Compliance** - Classification must meet the most stringent applicable regulation

---

## Classification Levels

### Level 1: PUBLIC

**Definition:** Information intended for public disclosure with no adverse impact if disclosed.

**Examples:**
- Published marketing materials
- Public website content
- Press releases
- General product information

**Controls Required:**
- Standard access controls
- Version control for accuracy
- No encryption requirement for storage

---

### Level 2: INTERNAL

**Definition:** Information for internal use that could cause minor impact if disclosed.

**Examples:**
- Internal policies and procedures
- Non-sensitive business communications
- Project documentation (non-PHI)
- System architecture (non-security)

**Controls Required:**
- Authentication required for access
- Standard backup procedures
- Encryption in transit (TLS)

---

### Level 3: CONFIDENTIAL

**Definition:** Sensitive business information that could cause significant harm if disclosed.

**Examples:**
- Financial reports and projections
- Employee personnel records
- Vendor contracts and pricing
- Security configurations
- API keys and credentials (in Secrets Manager)

**Controls Required:**
- Role-based access control (RBAC)
- Encryption at rest and in transit
- Audit logging of access
- Secure disposal procedures

---

### Level 4: RESTRICTED (PII)

**Definition:** Personally Identifiable Information subject to privacy regulations (GDPR, CCPA).

**Examples:**
- Patient names, addresses, phone numbers
- Email addresses
- Date of birth
- Government IDs (SSN, passport)
- Financial account numbers

**Controls Required:**
- Field-level encryption (AES-256)
- Strict access controls with audit logging
- Data minimization
- Consent management
- Right to erasure compliance
- Breach notification (72 hours GDPR)

---

### Level 5: HIGHLY RESTRICTED (PHI)

**Definition:** Protected Health Information under HIPAA and equivalent regulations.

**Examples:**
- Medical records and history
- Diagnoses and conditions
- Treatment plans and notes
- Prescription information
- Laboratory and test results
- Mental health records
- Substance abuse records
- Genetic information
- Biometric identifiers

**Controls Required:**
- All Level 4 controls PLUS:
- HIPAA-compliant encryption
- Business Associate Agreements
- 6-year audit log retention
- Breach notification (60 days HIPAA)
- Minimum necessary access principle
- De-identification for analytics

---

### Classification Decision Matrix

| Data Element | Standalone Classification | Combined with Identifier |
|--------------|---------------------------|--------------------------|
| Name only | INTERNAL | RESTRICTED (PII) |
| Medical condition | CONFIDENTIAL | HIGHLY RESTRICTED (PHI) |
| Date of birth | INTERNAL | RESTRICTED (PII) |
| Diagnosis code | CONFIDENTIAL | HIGHLY RESTRICTED (PHI) |
| Address | INTERNAL | RESTRICTED (PII) |
| Lab result value | CONFIDENTIAL | HIGHLY RESTRICTED (PHI) |

---

## PII Data Types and Handling

### Direct Identifiers

| Data Type | Classification | Storage | Access | Retention |
|-----------|----------------|---------|--------|-----------|
| Full Name | RESTRICTED | Encrypted (AES-256) | RBAC + Audit | Account lifetime + 1 year |
| Email Address | RESTRICTED | Encrypted (AES-256) | RBAC + Audit | Account lifetime + 1 year |
| Phone Number | RESTRICTED | Encrypted (AES-256) | RBAC + Audit | Account lifetime + 1 year |
| Physical Address | RESTRICTED | Encrypted (AES-256) | RBAC + Audit | Account lifetime + 1 year |
| SSN/National ID | RESTRICTED | Encrypted (AES-256) | Admin only + Audit | Required period only |
| Passport Number | RESTRICTED | Encrypted (AES-256) | Admin only + Audit | Required period only |
| Driver's License | RESTRICTED | Encrypted (AES-256) | Admin only + Audit | Required period only |
| Date of Birth | RESTRICTED | Encrypted (AES-256) | RBAC + Audit | Account lifetime |
| Financial Account | RESTRICTED | Tokenized (Stripe) | Payment system only | 7 years (IRS) |

### Quasi-Identifiers

| Data Type | Classification | Handling Notes |
|-----------|----------------|----------------|
| Age | INTERNAL | May become PII when combined |
| Gender | INTERNAL | May become PII when combined |
| ZIP Code (5-digit) | INTERNAL | May become PII when combined |
| ZIP Code (full) | RESTRICTED | Can identify individuals |
| Profession | INTERNAL | May become PII when combined |
| IP Address | RESTRICTED | Considered PII under GDPR |

### PII Handling Requirements

**Collection:**
- Collect only necessary PII (data minimization)
- Obtain explicit consent with purpose specification
- Provide privacy notice at collection point

**Storage:**
```
Database: PostgreSQL with field-level encryption
Encryption: AES-256-GCM
Key Management: AWS KMS
Backup: Encrypted with separate key
```

**Processing:**
- Process only for stated purposes
- Apply pseudonymization where possible
- Log all access with user ID and timestamp

**Transmission:**
- TLS 1.3 minimum for all transmissions
- No PII in URLs or query strings
- Encrypted payloads for API responses

**Disposal:**
- Secure deletion per NIST SP 800-88
- Certificate of destruction required
- Retain disposal records for 6 years

---

## PHI Data Types and Handling

### HIPAA 18 Identifiers

The following identifiers must be removed for de-identification (Safe Harbor method):

| # | Identifier | Classification | Handling |
|---|------------|----------------|----------|
| 1 | Names | HIGHLY RESTRICTED | Encrypt, audit all access |
| 2 | Geographic data < state | HIGHLY RESTRICTED | Encrypt, audit all access |
| 3 | Dates (except year) related to individual | HIGHLY RESTRICTED | Encrypt, audit all access |
| 4 | Phone numbers | HIGHLY RESTRICTED | Encrypt, audit all access |
| 5 | Fax numbers | HIGHLY RESTRICTED | Encrypt, audit all access |
| 6 | Email addresses | HIGHLY RESTRICTED | Encrypt, audit all access |
| 7 | Social Security numbers | HIGHLY RESTRICTED | Encrypt, admin access only |
| 8 | Medical record numbers | HIGHLY RESTRICTED | Encrypt, audit all access |
| 9 | Health plan beneficiary numbers | HIGHLY RESTRICTED | Encrypt, audit all access |
| 10 | Account numbers | HIGHLY RESTRICTED | Tokenize, audit all access |
| 11 | Certificate/license numbers | HIGHLY RESTRICTED | Encrypt, admin access only |
| 12 | Vehicle identifiers | HIGHLY RESTRICTED | Encrypt if collected |
| 13 | Device identifiers | HIGHLY RESTRICTED | Encrypt, audit all access |
| 14 | Web URLs | HIGHLY RESTRICTED | Do not collect in PHI context |
| 15 | IP addresses | HIGHLY RESTRICTED | Log separately from PHI |
| 16 | Biometric identifiers | HIGHLY RESTRICTED | Encrypt, special access |
| 17 | Full-face photos | HIGHLY RESTRICTED | Encrypted blob storage |
| 18 | Any other unique identifier | HIGHLY RESTRICTED | Encrypt, audit all access |

### Clinical Data Types

| Data Type | Classification | Database Location | Access Level |
|-----------|----------------|-------------------|--------------|
| Medical History | HIGHLY RESTRICTED | Patient table | Provider + Patient |
| Diagnoses (ICD-10) | HIGHLY RESTRICTED | Encounter table | Provider + Patient |
| Treatment Plans | HIGHLY RESTRICTED | Encounter table | Provider + Patient |
| Clinical Notes | HIGHLY RESTRICTED | ClinicalNote table | Provider + Patient |
| Prescriptions | HIGHLY RESTRICTED | Prescription table | Provider + Patient + Pharmacy |
| Lab Results | HIGHLY RESTRICTED | LabResult table | Provider + Patient |
| Imaging Studies | HIGHLY RESTRICTED | S3 (encrypted) | Provider + Patient |
| Allergies | HIGHLY RESTRICTED | Patient table | Provider + Patient |
| Immunizations | HIGHLY RESTRICTED | Immunization table | Provider + Patient |
| Vital Signs | HIGHLY RESTRICTED | VitalSign table | Provider + Patient |

### Special Categories (Additional Protection)

| Category | Additional Controls |
|----------|---------------------|
| Mental Health Records | Restricted provider access, patient-controlled sharing |
| Substance Abuse Records | 42 CFR Part 2 compliance, written consent required |
| HIV/AIDS Information | State-specific consent requirements |
| Genetic Information | GINA compliance, research consent required |
| Reproductive Health | State-specific requirements |

### PHI Handling Requirements

**Authorization:**
```
Access requires:
1. Valid authentication (JWT)
2. Role authorization (Provider, Patient, Admin)
3. Relationship verification (treating provider)
4. Purpose validation (treatment, payment, operations)
```

**Minimum Necessary:**
- Query only required fields
- Filter results to authorized records
- Limit data in API responses

**Audit Requirements:**
```
Log Entry Fields:
- userId (who accessed)
- action (read, create, update, delete)
- resource (patient, encounter, document)
- resourceId (specific record ID)
- timestamp (ISO 8601)
- ipAddress (client IP)
- outcome (success, failure, partial)
```

**Disclosure Tracking:**
```
Track all disclosures for:
- Accounting of disclosures request
- Breach assessment
- Compliance auditing
```

---

## Data Retention Policies

### Retention Schedule by Classification

| Classification | Default Retention | Legal Basis | Deletion Method |
|----------------|-------------------|-------------|-----------------|
| PUBLIC | No limit | Business need | Standard delete |
| INTERNAL | 3 years | Business need | Standard delete |
| CONFIDENTIAL | 7 years | Business/legal | Secure delete |
| RESTRICTED (PII) | Per purpose + 1 year | GDPR Art. 17 | Secure delete + certificate |
| HIGHLY RESTRICTED (PHI) | 10 years from last service | State medical records laws | Secure delete + certificate |

### Healthcare-Specific Retention

| Data Type | Retention Period | Regulatory Basis |
|-----------|------------------|------------------|
| Medical Records (Adult) | 10 years from last service | State law (most stringent) |
| Medical Records (Minor) | 10 years after age 18 | State law (most stringent) |
| Prescriptions | 10 years | State pharmacy law |
| Lab Results | 10 years | CLIA, state law |
| Imaging Studies | 10 years | State law, accreditation |
| Billing Records | 7 years | IRS requirement |
| Audit Logs | 6 years | HIPAA 164.316(b)(2)(i) |
| Consent Records | 6 years from revocation | HIPAA 164.530(j) |
| BAAs | 6 years from termination | HIPAA 164.316(b)(2)(i) |

### Retention Exceptions

| Exception | Handling |
|-----------|----------|
| Legal Hold | Suspend deletion until hold released |
| Active Litigation | Retain until case closed + appeals |
| Regulatory Investigation | Retain per regulator instruction |
| Ongoing Treatment | Retain until relationship ends |

---

## Encryption Requirements

### Encryption by Classification Level

| Classification | At Rest | In Transit | Key Management |
|----------------|---------|------------|----------------|
| PUBLIC | Optional | TLS 1.2+ | N/A |
| INTERNAL | Recommended | TLS 1.2+ | Standard |
| CONFIDENTIAL | Required (AES-256) | TLS 1.3 | AWS KMS |
| RESTRICTED (PII) | Required (AES-256-GCM) | TLS 1.3 | AWS KMS (CMK) |
| HIGHLY RESTRICTED (PHI) | Required (AES-256-GCM) | TLS 1.3 | AWS KMS (CMK) |

### Field-Level Encryption (PHI/PII)

```typescript
// Encrypted fields in database schema
model Patient {
  id              String   @id @default(uuid())
  userId          String   @unique

  // Encrypted fields (AES-256-GCM)
  dateOfBirth     String   // Encrypted
  mrn             String   // Encrypted
  ssn             String?  // Encrypted (optional)

  // Standard fields
  bloodType       String?
  createdAt       DateTime @default(now())
}
```

### Encryption Implementation

**At Rest:**
```
Database: RDS with KMS encryption
  - Storage encryption: AES-256
  - Field-level: AES-256-GCM via application

S3 Buckets: Server-side encryption
  - Algorithm: AES-256
  - Key: AWS KMS CMK

Backups: Encrypted with separate key
  - Algorithm: AES-256
  - Cross-region replication encrypted
```

**In Transit:**
```
External: TLS 1.3
  - Cipher: TLS_AES_256_GCM_SHA384
  - Certificate: ACM managed
  - HSTS: Enabled

Internal: mTLS (optional)
  - Service mesh: Istio/Envoy
  - Certificate rotation: Automatic
```

**Key Rotation:**
```
KMS Keys: Automatic annual rotation
Application Keys: Manual rotation quarterly
Session Keys: Per-session generation
```

---

## Access Control Requirements

### Access by Classification Level

| Classification | Authentication | Authorization | Additional Controls |
|----------------|----------------|---------------|---------------------|
| PUBLIC | None | None | Rate limiting |
| INTERNAL | SSO | Role membership | Session timeout |
| CONFIDENTIAL | SSO + MFA | Role + resource | Audit logging |
| RESTRICTED (PII) | SSO + MFA | Role + resource + purpose | Full audit, consent check |
| HIGHLY RESTRICTED (PHI) | SSO + MFA | Role + relationship + purpose | Full audit, consent, minimum necessary |

### Role-Based Access Matrix

| Role | PUBLIC | INTERNAL | CONFIDENTIAL | RESTRICTED | HIGHLY RESTRICTED |
|------|--------|----------|--------------|------------|-------------------|
| Anonymous | Read | - | - | - | - |
| Patient | Read | - | Own profile | Own PII | Own PHI |
| Provider | Read | Read | Read | Assigned patients | Assigned patients |
| Staff | Read | Read | Limited | Limited | - |
| Admin | Read | Read/Write | Read/Write | Read/Write | Read (audit only) |
| Compliance | Read | Read | Read | Read | Read (audit only) |
| Super Admin | All | All | All | All | All (emergency) |

### Access Control Implementation

**Authentication:**
```
Method: JWT with RS256 signature
Expiration: 15 minutes (access token)
Refresh: 7 days (refresh token)
MFA: Required for CONFIDENTIAL+
Session: 8-hour maximum
```

**Authorization:**
```typescript
// Example authorization check
async function authorizeAccess(
  user: User,
  resource: string,
  resourceId: string,
  action: string
): Promise<boolean> {
  // 1. Check role permission
  if (!hasRolePermission(user.role, resource, action)) {
    return false;
  }

  // 2. Check resource ownership/relationship
  if (!await hasResourceAccess(user.id, resourceId)) {
    return false;
  }

  // 3. Check consent (for PHI)
  if (isPhiResource(resource)) {
    if (!await hasValidConsent(user.id, resourceId)) {
      return false;
    }
  }

  // 4. Log access attempt
  await logAccessAttempt(user, resource, resourceId, action);

  return true;
}
```

### Access Review Requirements

| Classification | Review Frequency | Reviewer | Documentation |
|----------------|------------------|----------|---------------|
| CONFIDENTIAL | Quarterly | Manager | Access review report |
| RESTRICTED | Quarterly | Manager + Compliance | Access review + attestation |
| HIGHLY RESTRICTED | Quarterly | Manager + Compliance + Security | Access review + attestation + audit |

---

## Implementation Guidelines

### For Developers

1. **Data Discovery:** Identify all data elements and classify appropriately
2. **Schema Review:** Ensure database schema reflects classification
3. **Code Review:** Verify encryption and access controls in code
4. **Testing:** Include security tests for classified data handling
5. **Documentation:** Document data flows with classification levels

### For Operations

1. **Infrastructure:** Configure encryption at all storage points
2. **Monitoring:** Alert on unauthorized access attempts
3. **Backup:** Ensure backups maintain encryption
4. **Disposal:** Follow secure deletion procedures

### For Compliance

1. **Audit:** Regular review of classification accuracy
2. **Training:** Ensure staff understand classification levels
3. **Incidents:** Use classification in breach assessment
4. **Reporting:** Include classification in compliance reports

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01 | Compliance Team | Initial data classification policy |

**Review Schedule:** Annual or upon regulatory changes
**Next Review:** January 2026

**Contacts:**
- Compliance Officer: compliance@thetheunifiedhealth.com
- Security Team: security@thetheunifiedhealth.com
- Data Protection Officer: dpo@thetheunifiedhealth.com

---

**Document Classification:** INTERNAL - Compliance Policy
**Access:** All employees (read), Compliance Team (write)
