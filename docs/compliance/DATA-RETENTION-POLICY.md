# Data Retention and Deletion Policy

**Document Version:** 1.0
**Effective Date:** January 15, 2025
**Last Updated:** January 15, 2025
**Classification:** Internal - Compliance Policy

---

## Table of Contents

1. [Policy Overview](#policy-overview)
2. [Retention Periods](#retention-periods)
3. [Legal and Regulatory Requirements](#legal-and-regulatory-requirements)
4. [Data Classification](#data-classification)
5. [Retention Schedule](#retention-schedule)
6. [Data Deletion Procedures](#data-deletion-procedures)
7. [Legal Holds](#legal-holds)
8. [Patient Rights](#patient-rights)
9. [Implementation](#implementation)
10. [Roles and Responsibilities](#roles-and-responsibilities)

---

## Policy Overview

### Purpose

This Data Retention and Deletion Policy establishes guidelines for the retention and secure disposal of data maintained by Unified Health Platform. The policy ensures compliance with HIPAA, GDPR, state medical records laws, and other applicable regulations while supporting operational, legal, and business needs.

### Scope

This policy applies to:

- All Protected Health Information (PHI)
- Personal Data subject to GDPR
- Business records and operational data
- Audit logs and security records
- Communications and correspondence
- Backups and archived data

**Covered Systems:**
- Production databases (PostgreSQL)
- Document storage (Azure Blob Storage)
- Backup systems
- Audit log storage
- Email and communication systems
- Application logs

### Principles

**1. Legal Compliance**
- Retain data as required by law and regulation
- Never destroy data subject to legal hold or investigation
- Document retention decisions

**2. Minimum Retention**
- Retain data only as long as necessary
- Balance legal requirements with privacy principles
- Reduce data retention risk

**3. Secure Disposal**
- Securely delete data when retention period expires
- Verify complete deletion
- Maintain disposal records

**4. Consistency**
- Apply retention periods uniformly
- Regular reviews and updates
- Automated processes where possible

---

## Retention Periods

### Summary Table

| Data Category | Retention Period | Legal Basis | Deletion Method |
|---------------|------------------|-------------|-----------------|
| Medical Records | 10 years from last service | State law (varies) | Secure deletion |
| Audit Logs | 6 years | HIPAA § 164.316(b)(2)(i) | Secure deletion |
| Billing Records | 7 years | IRS requirement | Secure deletion |
| Consent Records | 6 years from revocation | HIPAA § 164.316(b)(2)(i) | Secure deletion |
| Prescriptions | 10 years | State pharmacy law | Secure deletion |
| Lab Results | 10 years | State law / accreditation | Secure deletion |
| Diagnostic Images | 10 years | State law / accreditation | Secure deletion |
| Clinical Notes | 10 years from last service | State law | Secure deletion |
| Patient Communications | Duration + 10 years | Medical records requirement | Secure deletion |
| User Account Data | Duration + 1 year | Business need | Secure deletion |
| Session Logs | 30 days | Security monitoring | Automatic deletion |
| Application Logs | 90 days | Operational need | Automatic deletion |
| Expired Auth Tokens | 7 days | Security best practice | Automatic deletion |
| Backup Data | 30 days (daily), 1 year (quarterly) | Business continuity | Secure deletion |
| De-identified Data | Indefinite | Research/analytics | N/A (not subject to retention rules) |

---

## Legal and Regulatory Requirements

### HIPAA Requirements

**§ 164.316(b)(2)(i) - Time Limit**

> Retain the documentation required by paragraph (b)(1) of this section for 6 years from the date of its creation or the date when it last was in effect, whichever is later.

**Applies to:**
- Security policies and procedures
- Audit logs
- Access records
- Security incident documentation
- Consent and authorization records
- Business Associate Agreements

**§ 164.530(j) - Documentation**

> Maintain policies, procedures, and documentation for 6 years from the date of creation or when last in effect.

### State Medical Records Laws

**Minimum Retention (varies by state):**

| State | Adult Records | Minor Records | Statute |
|-------|---------------|---------------|---------|
| California | 7 years | 7 years after age 18 | CA Business & Professions Code § 2221 |
| New York | 6 years | 6 years after age 18 | NY Education Law § 6530 |
| Texas | 10 years | 10 years after age 18 | TX Occupations Code § 165.001 |
| Florida | 7 years | 7 years after age 18 | FL Statute § 456.057 |

**Platform Policy:** Retain for **10 years** to comply with most stringent state requirements.

### GDPR Requirements

**Article 17 - Right to Erasure ("Right to be Forgotten")**

Data must be erased when:
- No longer necessary for purposes collected
- Consent withdrawn and no other legal basis
- Individual objects and no overriding legitimate grounds
- Processing was unlawful
- Required by legal obligation

**Exceptions:**
- Compliance with legal obligations
- Public interest in public health
- Archiving purposes in public interest
- Establishment, exercise, or defense of legal claims

### Federal Requirements

**IRS Records Retention:**
- Tax-related records: **7 years**
- Billing and payment records: **7 years**

**FDA Requirements (if applicable):**
- Clinical trial records: **2 years after marketing application**

**CLIA (Clinical Laboratory Improvement Amendments):**
- Lab test records: **2 years minimum** (platform retains 10 years)

---

## Data Classification

### PHI Data (HIPAA-Protected)

**High Sensitivity - Extended Retention:**

- Medical history and diagnoses
- Treatment plans and clinical notes
- Prescriptions and medications
- Laboratory and diagnostic test results
- Imaging studies
- Surgical records
- Mental health records

**Retention:** 10 years from last service date

### Personal Data (GDPR-Protected)

**Personal Identifiable Information (PII):**

- Name, date of birth
- Contact information (email, phone, address)
- Social Security Number
- Government-issued ID numbers
- Medical Record Number

**Retention:** Varies by category (see Retention Schedule)

### Business Records

**Operational Data:**

- User account information
- Subscription and billing records
- Service usage logs
- Customer support tickets

**Retention:** Duration of relationship + 1-7 years

### System Data

**Technical and Security Data:**

- Audit logs (6 years)
- Application logs (90 days)
- Session logs (30 days)
- Security incident records (6 years)

---

## Retention Schedule

### Patient Health Records

**Medical Records (Comprehensive)**

- **Retention Period:** 10 years from date of last service
- **Includes:**
  - Patient demographics
  - Medical history
  - Clinical encounters
  - Diagnoses and treatments
  - Medications and prescriptions
  - Allergies and adverse reactions
  - Vital signs and assessments

- **Triggering Event:** Last date of service/visit
- **Calculation Example:** Last visit on 2025-01-15 → Retain until 2035-01-15
- **Extension:** Additional 10 years for minors (from age 18)

**Lab Results and Diagnostic Tests**

- **Retention Period:** 10 years from date of result
- **Includes:**
  - Blood tests
  - Urinalysis
  - Pathology reports
  - Genetic testing results

- **Storage:** Database + linked documents

**Imaging Studies**

- **Retention Period:** 10 years from imaging date
- **Includes:**
  - X-rays
  - MRIs
  - CT scans
  - Ultrasounds

- **Storage:** Azure Blob Storage (encrypted)
- **Format:** DICOM or PDF

**Prescriptions**

- **Retention Period:** 10 years from prescription date
- **Includes:**
  - Medication name and dosage
  - Prescribing provider
  - Pharmacy information
  - Refill history

- **Regulatory Basis:** State pharmacy laws

**Clinical Notes**

- **Retention Period:** 10 years from note date
- **Includes:**
  - Provider assessments
  - Examination findings
  - Treatment recommendations
  - Follow-up plans

- **Created By:** Healthcare providers during encounters

### Consent and Authorization Records

**Patient Consent Records**

- **Retention Period:** 6 years from date of revocation or expiration
- **If Never Revoked:** 6 years from last use
- **Includes:**
  - HIPAA authorizations
  - Treatment consents
  - Research consents
  - Marketing opt-ins

- **Format:** Digital signatures and timestamps

**Privacy Practice Acknowledgments**

- **Retention Period:** 6 years from date signed
- **Includes:**
  - Notice of Privacy Practices acknowledgment
  - Terms of Service acceptance
  - Privacy Policy acceptance

### Audit and Compliance Records

**Audit Logs (PHI Access)**

- **Retention Period:** 6 years minimum
- **Current Practice:** Active database for 2 years, then archival
- **Includes:**
  - User authentication events
  - PHI access records
  - Data modifications
  - Export and download events

- **Format:** PostgreSQL database entries
- **Archive:** Azure Blob Storage (compressed, encrypted)

**Security Incident Records**

- **Retention Period:** 6 years from incident closure
- **Includes:**
  - Incident reports
  - Investigation findings
  - Remediation actions
  - Notifications sent

- **Storage:** Secure compliance database

**Security Policies and Procedures**

- **Retention Period:** 6 years from date superseded
- **Includes:**
  - HIPAA Security Rule documentation
  - Risk assessments
  - Security training records
  - Business Associate Agreements

### Billing and Financial Records

**Invoices and Payment Records**

- **Retention Period:** 7 years from date of service
- **Regulatory Basis:** IRS requirement
- **Includes:**
  - Invoices
  - Payment transactions
  - Credit card receipts (tokenized)
  - Insurance claims

**Subscription Records**

- **Retention Period:** 7 years from subscription end
- **Includes:**
  - Subscription plans
  - Payment history
  - Upgrades and downgrades
  - Cancellation records

### Communications

**Patient-Provider Messages**

- **Retention Period:** 10 years (part of medical record)
- **Includes:**
  - Secure messaging through platform
  - Clinical communications
  - Appointment-related messages

- **Excludes:** Marketing emails (see below)

**Marketing Communications**

- **Retention Period:** 3 years or until opt-out
- **Includes:**
  - Promotional emails
  - Newsletter subscriptions
  - Campaign tracking data

- **Opt-out:** Immediate cessation + suppression list

**Customer Support Tickets**

- **Retention Period:** 3 years from ticket closure
- **Includes:**
  - Support requests
  - Resolution notes
  - Attachments

### User Account Data

**Active Accounts**

- **Retention Period:** Duration of account
- **Continuous Retention:** While account is active
- **Includes:**
  - Login credentials (hashed)
  - Profile information
  - Preferences and settings

**Inactive Accounts**

- **Retention Period:** 1 year of inactivity, then review
- **Process:**
  - 6 months inactivity: Email reminder
  - 11 months inactivity: Final notice
  - 12 months inactivity: Account flagged for deletion
  - 13 months: Account deleted (PHI retained per medical records schedule)

**Deleted Accounts**

- **User-Initiated Deletion:** Immediate account deactivation
- **PHI Retention:** Continues per medical records schedule (10 years)
- **Account Data Deletion:** 30 days after deactivation

### System Logs

**Application Logs**

- **Retention Period:** 90 days
- **Includes:**
  - Error logs
  - Performance metrics
  - Debugging information

- **Storage:** Azure Log Analytics
- **Auto-Deletion:** After 90 days

**Session Logs**

- **Retention Period:** 30 days
- **Includes:**
  - Session IDs
  - Login/logout timestamps
  - IP addresses

- **Auto-Deletion:** After 30 days

**Expired Authentication Tokens**

- **Retention Period:** 7 days after expiration
- **Includes:**
  - Refresh tokens
  - Access tokens (JWTs)

- **Auto-Deletion:** After 7 days

### Backup Data

**Daily Backups**

- **Retention Period:** 30 days
- **Frequency:** Daily at 2:00 AM UTC
- **Storage:** Azure Blob Storage (geo-redundant)
- **Encryption:** AES-256
- **Auto-Deletion:** After 30 days

**Quarterly Backups**

- **Retention Period:** 1 year
- **Frequency:** First day of each quarter
- **Purpose:** Long-term disaster recovery
- **Auto-Deletion:** After 1 year

**Archival Backups**

- **Retention Period:** 6 years
- **Frequency:** Annual
- **Purpose:** Compliance and legal requirements
- **Storage:** Azure Blob Storage (Cool tier)

---

## Data Deletion Procedures

### Deletion Standards

**DoD 5220.22-M Standard (3-pass overwrite):**

1. **Pass 1:** Write a character
2. **Pass 2:** Write the complement of the character
3. **Pass 3:** Write a random character
4. **Verification:** Verify all sectors overwritten

**NIST SP 800-88 Guidelines:**

- **Clear:** Logical erasure (for data reuse within organization)
- **Purge:** Physical or logical techniques rendering recovery infeasible
- **Destroy:** Physical destruction of media

**Platform Implementation:**

- **Database Records:** Multi-pass overwrite + index rebuild
- **Blob Storage:** Secure deletion + verification
- **Backups:** Cryptographic erasure (delete encryption keys)

### Deletion Process

**Step 1: Identify Data for Deletion**

```
Automated Process (Daily):
1. Query database for records past retention period
2. Generate deletion candidate list
3. Check for legal holds or active cases
4. Flag records ready for deletion
```

**Step 2: Pre-Deletion Review**

```
Manual Review (Compliance Officer):
1. Review deletion candidate list
2. Verify no legal holds or pending investigations
3. Confirm retention periods calculated correctly
4. Approve deletion batch
```

**Step 3: Execute Deletion**

```
Automated Deletion (Scheduled Job):
1. Mark records for deletion
2. Export audit log of deletion (permanent record)
3. Execute secure deletion:
   - Database: Multi-pass overwrite
   - Blob Storage: Secure delete + verify
   - Backups: Delete + verify
4. Verify deletion completion
5. Generate deletion certificate
```

**Step 4: Verification and Documentation**

```
Post-Deletion Verification:
1. Verify records no longer accessible
2. Confirm deletion from all systems (primary + backups)
3. Document deletion in compliance log
4. Retain deletion certificate for 6 years
```

### Deletion Certificate Template

```
CERTIFICATE OF DATA DELETION

Deletion Date: [Date]
Deletion Batch ID: [ID]
Deletion Method: DoD 5220.22-M (3-pass)

Records Deleted:
- Record Type: [e.g., Patient Medical Records]
- Record Count: [Number]
- Retention Period Expired: [Date]
- Record IDs: [List or reference to audit log]

Systems Affected:
- Production Database: ✓ Deleted
- Backup Database: ✓ Deleted
- Blob Storage: ✓ Deleted
- Archived Backups: ✓ Deleted

Verification:
- Deletion Verified By: [Name]
- Verification Date: [Date]
- Verification Method: [Sampling/Full scan]

Legal Holds Checked: ✓ None applicable

Approved By:
Compliance Officer: _______________ Date: _______
IT Manager: _______________ Date: _______
```

---

## Legal Holds

### Definition

A legal hold is a process that an organization uses to preserve all forms of relevant information when litigation is reasonably anticipated or pending.

### Legal Hold Process

**Step 1: Legal Hold Notification**

When litigation, investigation, or regulatory inquiry is reasonably anticipated:

1. Legal department notifies Compliance Officer
2. Compliance Officer identifies relevant data
3. All deletions of relevant data are suspended

**Step 2: Implement Hold**

```
Technical Implementation:
1. Tag affected records with "LEGAL_HOLD" flag
2. Exclude tagged records from deletion processes
3. Notify IT and data custodians
4. Document hold in legal hold register
```

**Step 3: Preserve Data**

- Suspend automated deletions for affected data
- Create isolated backup of data under hold
- Restrict access to legal and compliance team
- Maintain chain of custody

**Step 4: Release Hold**

When legal matter is resolved:

1. Legal department authorizes release
2. Compliance Officer removes "LEGAL_HOLD" flag
3. Resume normal retention schedule
4. Document hold release date

### Legal Hold Register

Maintained by Legal department:

| Hold ID | Matter | Data Scope | Hold Date | Release Date | Status |
|---------|--------|------------|-----------|--------------|--------|
| LH-2025-001 | [Case Name] | Patient ID: [ID] | 2025-01-10 | Pending | Active |

---

## Patient Rights

### Right to Access (HIPAA § 164.524)

Patients have the right to access their medical records at any time, regardless of retention period.

**Process:**
1. Patient submits access request (written or electronic)
2. Provide access within 30 days (may extend to 60 days)
3. Provide in requested format (electronic or paper)
4. Charge reasonable, cost-based fee if applicable

### Right to Amendment (HIPAA § 164.526)

Patients may request amendments to their medical records.

**Process:**
1. Patient submits amendment request with supporting documentation
2. Review request within 60 days
3. Accept amendment or provide written denial with explanation
4. If denied, patient may submit statement of disagreement

### Right to Erasure / Right to be Forgotten (GDPR Article 17)

EU residents may request deletion of their personal data under certain circumstances.

**Exceptions:**
- Retention required by law (medical records)
- Necessary for legal claims or compliance
- Public interest in public health

**Process:**
1. Patient submits erasure request
2. Review applicable exceptions
3. Delete non-essential personal data
4. Retain PHI as required by law (medical records)
5. Provide confirmation of action taken

### Right to Data Portability (GDPR Article 20)

Patients may request their data in machine-readable format.

**Process:**
1. Patient requests data export
2. Generate export in JSON or CSV format
3. Include all personal data in structured format
4. Provide within 30 days (may extend to 90 days)

---

## Implementation

### Automated Processes

**Daily Jobs:**

```bash
# Run daily at 2:00 AM UTC
cron: "0 2 * * *"

Tasks:
1. Identify records past retention period
2. Check for legal holds
3. Generate deletion candidate list
4. Delete expired session logs (>30 days)
5. Delete expired application logs (>90 days)
6. Delete expired auth tokens (>7 days)
```

**Weekly Jobs:**

```bash
# Run weekly on Sunday at 3:00 AM UTC
cron: "0 3 * * 0"

Tasks:
1. Review deletion candidate list
2. Send notification to Compliance Officer
3. Generate retention compliance report
```

**Monthly Jobs:**

```bash
# Run first day of month at 4:00 AM UTC
cron: "0 4 1 * *"

Tasks:
1. Execute approved deletions
2. Generate deletion certificates
3. Update retention metrics
4. Audit retention policy compliance
```

### Manual Processes

**Quarterly Reviews:**
- Compliance Officer reviews retention policy
- Audit deletion logs
- Verify legal hold compliance
- Review state law changes

**Annual Reviews:**
- Comprehensive policy review
- Update retention schedule as needed
- Board/executive approval of policy changes
- Staff training on retention requirements

---

## Roles and Responsibilities

### Compliance Officer

**Responsibilities:**
- Oversee retention policy compliance
- Approve deletion batches
- Manage legal holds
- Coordinate with legal department
- Maintain deletion certificates
- Annual policy review

**Contact:** compliance@thetheunifiedhealth.com

### IT Manager / Database Administrator

**Responsibilities:**
- Implement automated retention processes
- Execute approved deletions
- Verify deletion completion
- Maintain backup integrity
- Technical implementation of legal holds

**Contact:** it@thetheunifiedhealth.com

### Legal Department

**Responsibilities:**
- Initiate and release legal holds
- Advise on regulatory changes
- Review patient data requests
- Approve policy changes

**Contact:** legal@thetheunifiedhealth.com

### Data Protection Officer (GDPR)

**Responsibilities:**
- Monitor GDPR compliance
- Advise on data subject rights
- Coordinate with EU supervisory authorities
- Review cross-border data transfers

**Contact:** dpo@thetheunifiedhealth.com

---

## Document Control

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Compliance Team | Initial policy |

### Review Schedule

- **Quarterly:** Operational review and metrics
- **Annual:** Comprehensive policy review
- **Ad Hoc:** Upon regulatory changes or legal requirements

**Next Review Date:** 2025-04-15

### Approval

**Approved By:**

Chief Compliance Officer: _______________ Date: _______
Chief Information Officer: _______________ Date: _______
Legal Counsel: _______________ Date: _______

---

## References

- HIPAA § 164.316(b)(2)(i) - Retention requirements
- HIPAA § 164.530(j) - Documentation
- GDPR Article 17 - Right to erasure
- NIST SP 800-88 - Guidelines for Media Sanitization
- DoD 5220.22-M - Data Sanitization Standard
- State Medical Records Laws (varies by state)

---

**Document Classification:** Internal - Compliance Policy
**Effective Date:** January 15, 2025
**Retention Period:** 6 years from superseded date

© 2025 Unified Health Platform. All rights reserved.
