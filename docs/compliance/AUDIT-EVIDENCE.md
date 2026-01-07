# Compliance Audit Evidence Guide

**Document Version:** 1.0
**Last Updated:** January 2025
**Classification:** Internal - Compliance Documentation
**Purpose:** Centralized evidence collection for HIPAA, GDPR, and SOC2 audits

---

## Table of Contents

1. [HIPAA Compliance Checklist](#hipaa-compliance-checklist)
2. [GDPR Compliance Checklist](#gdpr-compliance-checklist)
3. [SOC2 Control Mappings](#soc2-control-mappings)
4. [Data Flow Documentation References](#data-flow-documentation-references)

---

## HIPAA Compliance Checklist

### Administrative Safeguards (45 CFR 164.308)

| Requirement | Control | Evidence Location | Status |
|-------------|---------|-------------------|--------|
| **164.308(a)(1)(i)** Security Management Process | Risk analysis, security measures | `/docs/compliance/HIPAA-COMPLIANCE-CHECKLIST.md` | Implemented |
| **164.308(a)(1)(ii)(A)** Risk Analysis | Annual risk assessment | `/docs/security/risk-assessment-2025.pdf` | Completed |
| **164.308(a)(1)(ii)(B)** Risk Management | Security controls implementation | `/infrastructure/terraform-aws/SECURITY.md` | Implemented |
| **164.308(a)(1)(ii)(C)** Sanction Policy | Employee disciplinary procedures | `/policies/employee-handbook.pdf` | Documented |
| **164.308(a)(1)(ii)(D)** Information System Activity Review | Audit log monitoring | CloudWatch Logs, `/services/api/src/middleware/audit.middleware.ts` | Automated |
| **164.308(a)(2)** Assigned Security Responsibility | CSO designation | Organization chart, job descriptions | Completed |
| **164.308(a)(3)** Workforce Security | Access authorization procedures | `/docs/ACCESS_CONTROL_MATRIX.md` | Implemented |
| **164.308(a)(4)** Information Access Management | RBAC implementation | `/services/api/src/config/security.ts` | Implemented |
| **164.308(a)(5)** Security Awareness Training | Training program | LMS records, training completion logs | Ongoing |
| **164.308(a)(6)** Security Incident Procedures | Incident response plan | `/docs/compliance/INCIDENT-RESPONSE-PROCEDURES.md` | Documented |
| **164.308(a)(7)** Contingency Plan | DR/BC procedures | `/infrastructure/terraform-aws/DISASTER-RECOVERY.md` | Documented |
| **164.308(a)(8)** Evaluation | Periodic security assessments | Penetration test reports, audit reports | Quarterly |
| **164.308(b)(1)** Business Associate Contracts | BAA templates and tracking | `/docs/compliance/BUSINESS-ASSOCIATE-AGREEMENT.md` | Active |

### Physical Safeguards (45 CFR 164.310)

| Requirement | Control | Evidence Location | Status |
|-------------|---------|-------------------|--------|
| **164.310(a)(1)** Facility Access Controls | Cloud infrastructure security | AWS SOC2 reports, Azure compliance certifications | Delegated |
| **164.310(a)(2)(i)** Contingency Operations | Multi-region failover | `/infrastructure/terraform-aws/main.tf` | Implemented |
| **164.310(b)** Workstation Use | Endpoint security policy | `/policies/workstation-security-policy.md` | Documented |
| **164.310(c)** Workstation Security | Encryption, screen lock | MDM configuration, endpoint agents | Enforced |
| **164.310(d)(1)** Device and Media Controls | Disposal and reuse procedures | Disposal certificates, sanitization logs | Documented |

### Technical Safeguards (45 CFR 164.312)

| Requirement | Control | Evidence Location | Status |
|-------------|---------|-------------------|--------|
| **164.312(a)(1)** Access Control | Authentication and authorization | `/services/api/src/middleware/auth.middleware.ts` | Implemented |
| **164.312(a)(2)(i)** Unique User Identification | UUID-based user IDs | Prisma schema, database audit | Implemented |
| **164.312(a)(2)(ii)** Emergency Access Procedure | Break-glass accounts | Emergency access logs, procedures document | Documented |
| **164.312(a)(2)(iii)** Automatic Logoff | 15-minute session timeout | `/services/api/src/middleware/session.middleware.ts` | Implemented |
| **164.312(a)(2)(iv)** Encryption and Decryption | AES-256-GCM encryption | `/services/api/src/lib/encryption.ts` | Implemented |
| **164.312(b)** Audit Controls | Comprehensive audit logging | `/docs/compliance/AUDIT-LOGGING-DOCUMENTATION.md` | Implemented |
| **164.312(c)(1)** Integrity | Data integrity verification | Cryptographic hashing, database constraints | Implemented |
| **164.312(d)** Person or Entity Authentication | MFA, JWT tokens | Auth configuration, Cognito/Auth0 settings | Implemented |
| **164.312(e)(1)** Transmission Security | TLS 1.3 encryption | `/infrastructure/terraform-aws/SECURITY.md` | Implemented |

### Audit Log Evidence Collection

**System Logs:**
```
Location: AWS CloudWatch Logs
Groups:
  - /aws/eks/{cluster}/application
  - /aws/rds/{instance}/postgresql
  - /aws/cloudtrail/{project}
  - /aws/vpc/{vpc}/flow-logs

Retention:
  - CloudWatch: 2555 days (7 years)
  - S3 Archive: Indefinite (Glacier)
```

**Application Audit Logs:**
```
Database Table: AuditEvent
Schema: /packages/database/prisma/schema.prisma
Fields:
  - id, userId, action, resource, resourceId
  - timestamp, ipAddress, userAgent, details
  - outcome (success/failure)

Query for Audit:
SELECT * FROM "AuditEvent"
WHERE timestamp >= '2025-01-01'
ORDER BY timestamp DESC;
```

**Evidence Export Command:**
```bash
# Export audit logs for compliance review
aws logs filter-log-events \
  --log-group-name "/aws/cloudtrail/unified-health" \
  --start-time $(date -d "30 days ago" +%s000) \
  --end-time $(date +%s000) \
  --output json > audit-export.json
```

---

## GDPR Compliance Checklist

### Lawful Basis and Consent (Articles 6, 7)

| Requirement | Control | Evidence Location | Status |
|-------------|---------|-------------------|--------|
| Art. 6 - Lawful basis for processing | Consent management system | Consent table in database, consent forms | Implemented |
| Art. 7 - Conditions for consent | Explicit consent capture | `/services/api/src/services/consent.service.ts` | Implemented |
| Art. 7(3) - Withdrawal of consent | Consent revocation mechanism | Patient portal, API endpoints | Implemented |

### Data Subject Rights (Articles 15-22)

| Right | Implementation | Evidence Location | Status |
|-------|----------------|-------------------|--------|
| Art. 15 - Right of Access | Patient data export | `/api/v1/patients/{id}/export` | Implemented |
| Art. 16 - Right to Rectification | Profile update functionality | Patient portal, API endpoints | Implemented |
| Art. 17 - Right to Erasure | Data deletion procedures | `/docs/compliance/DATA-RETENTION-POLICY.md` | Documented |
| Art. 18 - Right to Restriction | Processing limitation flags | Database consent flags | Implemented |
| Art. 20 - Right to Portability | JSON/CSV export format | Export API, patient portal | Implemented |
| Art. 21 - Right to Object | Opt-out mechanisms | Marketing preferences, consent management | Implemented |
| Art. 22 - Automated Decision-Making | Manual review option | Care pathway overrides | Implemented |

### Data Protection Measures (Articles 25, 32)

| Requirement | Control | Evidence Location | Status |
|-------------|---------|-------------------|--------|
| Art. 25 - Data Protection by Design | Privacy-first architecture | `/docs/ARCHITECTURE.md` | Implemented |
| Art. 32 - Security of Processing | Encryption, access controls | `/infrastructure/terraform-aws/SECURITY.md` | Implemented |
| Art. 33 - Breach Notification (72h) | Incident response procedures | `/docs/compliance/INCIDENT-RESPONSE-PROCEDURES.md` | Documented |
| Art. 34 - Communication to Data Subject | Breach notification templates | Notification templates in compliance folder | Prepared |

### International Transfers (Articles 44-49)

| Requirement | Control | Evidence Location | Status |
|-------------|---------|-------------------|--------|
| Art. 44-49 - Transfer Mechanisms | Standard Contractual Clauses | `/docs/compliance/DATA-PROCESSING-AGREEMENT.md` | Documented |
| EU-US Data Privacy Framework | AWS certification | AWS compliance documentation | Active |
| Regional data residency | EU region deployment | `/infrastructure/terraform-aws/main.tf` (Europe module) | Implemented |

### GDPR Evidence Collection

**Data Processing Records (Art. 30):**
```
Location: /docs/compliance/DATA-PROCESSING-AGREEMENT.md
Contents:
  - Controller/Processor details
  - Processing purposes
  - Categories of data subjects
  - Categories of personal data
  - Recipients and transfers
  - Retention periods
  - Security measures
```

**Consent Records:**
```sql
-- Query consent records for audit
SELECT
  c.id, c."userId", c."consentType",
  c.granted, c."grantedAt", c."revokedAt",
  u.email
FROM "Consent" c
JOIN "User" u ON c."userId" = u.id
WHERE c."createdAt" >= '2025-01-01';
```

**Data Subject Request Log:**
```
Location: Compliance database
Table: DataSubjectRequest
Fields: requestId, subjectId, requestType,
        receivedDate, completedDate, status
SLA: 30 days (extendable to 90)
```

---

## SOC2 Control Mappings

### Trust Service Criteria

#### CC1 - Control Environment

| Control | Requirement | Evidence | Status |
|---------|-------------|----------|--------|
| CC1.1 | Integrity and ethical values | Code of conduct, employee handbook | Documented |
| CC1.2 | Board oversight | Board meeting minutes, security reports | Quarterly |
| CC1.3 | Organizational structure | Org chart, RACI matrix | Documented |
| CC1.4 | Commitment to competence | Training records, certifications | Ongoing |
| CC1.5 | Accountability | Performance reviews, access reviews | Quarterly |

#### CC2 - Communication and Information

| Control | Requirement | Evidence | Status |
|---------|-------------|----------|--------|
| CC2.1 | Internal communication | Security policies, Slack channels | Active |
| CC2.2 | External communication | Privacy policy, security.txt | Published |
| CC2.3 | System descriptions | Architecture documentation | `/docs/ARCHITECTURE.md` |

#### CC3 - Risk Assessment

| Control | Requirement | Evidence | Status |
|---------|-------------|----------|--------|
| CC3.1 | Risk identification | Risk register | `/docs/security/risk-register.xlsx` |
| CC3.2 | Risk analysis | Risk assessment reports | Annual |
| CC3.3 | Fraud risk | Fraud controls, separation of duties | Implemented |
| CC3.4 | Change management | Change management policy | Documented |

#### CC4 - Monitoring Activities

| Control | Requirement | Evidence | Status |
|---------|-------------|----------|--------|
| CC4.1 | Continuous monitoring | GuardDuty, Security Hub | `/infrastructure/terraform-aws/modules/security/` |
| CC4.2 | Deficiency evaluation | Vulnerability reports, remediation tracking | Ongoing |

#### CC5 - Control Activities

| Control | Requirement | Evidence | Status |
|---------|-------------|----------|--------|
| CC5.1 | Control selection | Control matrix | Compliance documentation |
| CC5.2 | Technology controls | IAM, encryption, network security | Infrastructure code |
| CC5.3 | Policy deployment | Security policies, runbooks | `/infrastructure/runbooks/` |

#### CC6 - Logical and Physical Access

| Control | Requirement | Evidence | Status |
|---------|-------------|----------|--------|
| CC6.1 | Logical access security | IAM policies, RBAC | `/docs/ACCESS_CONTROL_MATRIX.md` |
| CC6.2 | Access provisioning | User provisioning procedures | HR/IT processes |
| CC6.3 | Access removal | Termination procedures | HR checklist |
| CC6.4 | Access review | Quarterly access reviews | Access review reports |
| CC6.5 | Physical access | Cloud provider SOC2 | AWS/Azure SOC2 reports |
| CC6.6 | System boundaries | VPC isolation, network segmentation | `/infrastructure/terraform-aws/modules/vpc/` |
| CC6.7 | Data transmission | TLS encryption | Infrastructure configuration |
| CC6.8 | Malware prevention | Container scanning, WAF | Trivy, WAFv2 |

#### CC7 - System Operations

| Control | Requirement | Evidence | Status |
|---------|-------------|----------|--------|
| CC7.1 | Vulnerability management | Vulnerability scans, patch management | Dependabot, Trivy |
| CC7.2 | Incident detection | Security monitoring | GuardDuty, CloudWatch |
| CC7.3 | Incident response | Incident response plan | `/docs/compliance/INCIDENT-RESPONSE-PROCEDURES.md` |
| CC7.4 | Recovery procedures | Backup and recovery | `/infrastructure/terraform-aws/modules/backup/` |
| CC7.5 | Business continuity | DR plan | `/infrastructure/terraform-aws/DISASTER-RECOVERY.md` |

#### CC8 - Change Management

| Control | Requirement | Evidence | Status |
|---------|-------------|----------|--------|
| CC8.1 | Change authorization | PR reviews, approval workflows | GitHub PRs, CODEOWNERS |
| CC8.2 | Change testing | CI/CD pipeline, staging environments | `.github/workflows/` |
| CC8.3 | Change deployment | Automated deployments | CodePipeline, ArgoCD |

#### CC9 - Risk Mitigation

| Control | Requirement | Evidence | Status |
|---------|-------------|----------|--------|
| CC9.1 | Risk mitigation | Risk treatment plans | Risk register |
| CC9.2 | Vendor management | Vendor assessments, BAAs | Vendor security reviews |

### SOC2 Evidence Repository

```
/evidence/soc2/
  /CC1-control-environment/
    - code-of-conduct.pdf
    - org-chart.pdf
    - security-policy.pdf
  /CC2-communication/
    - privacy-policy.pdf
    - security-awareness-training.pdf
  /CC3-risk-assessment/
    - risk-assessment-2025.pdf
    - risk-register.xlsx
  /CC4-monitoring/
    - guardduty-findings-report.pdf
    - security-hub-summary.pdf
  /CC5-control-activities/
    - control-matrix.xlsx
    - security-controls-documentation.pdf
  /CC6-access/
    - access-reviews-q1-2025.xlsx
    - iam-policy-documentation.pdf
  /CC7-operations/
    - vulnerability-scan-reports/
    - incident-response-tests/
    - backup-verification-logs/
  /CC8-change-management/
    - change-management-policy.pdf
    - deployment-logs/
  /CC9-risk-mitigation/
    - vendor-assessments/
    - baa-tracking.xlsx
```

---

## Data Flow Documentation References

### PHI Data Flow Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| PHI Data Flow Diagrams | `/docs/compliance/PHI-DATA-FLOW-DIAGRAMS.md` | Visual PHI movement documentation |
| System Architecture | `/docs/ARCHITECTURE.md` | Overall system design |
| Database Schema | `/packages/database/prisma/schema.prisma` | Data model definitions |
| API Documentation | `/docs/api/` | Endpoint specifications |

### Key Data Flow Diagrams

1. **Patient Registration Flow**
   - Location: `PHI-DATA-FLOW-DIAGRAMS.md` Section 3.1
   - PHI collected: Name, DOB, contact info, insurance
   - Encryption points: TLS in transit, AES-256 at rest

2. **Medical Record Access Flow**
   - Location: `PHI-DATA-FLOW-DIAGRAMS.md` Section 3.2
   - Access controls: JWT auth, RBAC, audit logging
   - Decryption: On-demand with audit trail

3. **Telemedicine Session Flow**
   - Location: `PHI-DATA-FLOW-DIAGRAMS.md` Section 3.5
   - Encryption: DTLS-SRTP for video, TLS for signaling
   - Recording: Disabled by default (consent required)

4. **Third-Party Data Flows**
   - Location: `PHI-DATA-FLOW-DIAGRAMS.md` Section 8
   - Partners: Stripe (payments), AWS SES (email), AWS SNS (SMS)
   - BAA status: All signed and current

### Data Inventory

| Data Category | Classification | Storage Location | Encryption | Retention |
|---------------|----------------|------------------|------------|-----------|
| Patient Demographics | PHI/PII | RDS PostgreSQL | AES-256 | 10 years |
| Medical Records | PHI | RDS PostgreSQL | AES-256 | 10 years |
| Clinical Notes | PHI | RDS PostgreSQL | AES-256 | 10 years |
| Medical Documents | PHI | S3 (encrypted) | AES-256 | 10 years |
| Audit Logs | Sensitive | CloudWatch/S3 | AES-256 | 7 years |
| Session Logs | Internal | CloudWatch | AES-256 | 90 days |
| Payment Data | PCI | Stripe (tokenized) | Stripe PCI | 7 years |

### Cross-Reference Matrix

| Compliance Requirement | Data Flow Reference | Control Evidence |
|------------------------|--------------------|--------------------|
| HIPAA 164.312(e) - Transmission | TLS configuration | WAF, ALB, RDS SSL |
| HIPAA 164.312(a)(2)(iv) - Encryption | Encryption at rest | KMS, S3, RDS encryption |
| GDPR Art. 32 - Security | All flows | Infrastructure security docs |
| SOC2 CC6.7 - Transmission | External integrations | Third-party data flows |

---

## Audit Preparation Checklist

### Pre-Audit Tasks

- [ ] Update all compliance documentation
- [ ] Export audit logs for review period
- [ ] Generate access review reports
- [ ] Compile training completion records
- [ ] Verify BAA currency
- [ ] Run vulnerability scans
- [ ] Document any exceptions or compensating controls

### Evidence Package Contents

```
audit-evidence-package-{date}/
  01-policies/
    - security-policy.pdf
    - privacy-policy.pdf
    - acceptable-use-policy.pdf
  02-procedures/
    - incident-response.pdf
    - change-management.pdf
    - access-provisioning.pdf
  03-technical-controls/
    - infrastructure-documentation/
    - encryption-configuration/
    - network-security/
  04-audit-logs/
    - cloudtrail-export.json
    - application-audit-logs.csv
    - access-logs.csv
  05-assessments/
    - risk-assessment.pdf
    - penetration-test-report.pdf
    - vulnerability-scan-results.pdf
  06-training/
    - training-completion-report.xlsx
    - security-awareness-materials/
  07-vendor-management/
    - baa-inventory.xlsx
    - vendor-assessments/
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01 | Compliance Team | Initial audit evidence guide |

**Review Schedule:** Quarterly or before each audit
**Next Review:** April 2025

**Contacts:**
- Compliance Officer: compliance@thetheunifiedhealth.com
- Security Team: security@thetheunifiedhealth.com
- Legal: legal@thetheunifiedhealth.com

---

**Document Classification:** Internal - Compliance Documentation
**Access:** Compliance Team, Security Team, External Auditors (time-limited)
