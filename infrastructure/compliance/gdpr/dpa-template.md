# DATA PROCESSING AGREEMENT (DPA)
## GDPR Compliance - Article 28

**Effective Date:** [DATE]

**Between:**

**Data Controller:** [HEALTHCARE ORGANIZATION NAME]
Address: [ADDRESS]
Country: [EU COUNTRY]
Contact: [CONTACT PERSON]
Email: [EMAIL]

**AND**

**Data Processor:** UnifiedHealth Platform, Inc.
Address: [EU ADDRESS]
Country: [EU COUNTRY]
Data Protection Officer: [DPO NAME]
Email: dpo@unifiedhealth.com

---

## 1. DEFINITIONS

**1.1** "GDPR" means Regulation (EU) 2016/679 of the European Parliament and of the Council.

**1.2** "Personal Data" means any information relating to an identified or identifiable natural person as defined in Article 4(1) GDPR.

**1.3** "Processing" means any operation performed on Personal Data as defined in Article 4(2) GDPR.

**1.4** "Data Subject" means the identified or identifiable natural person to whom Personal Data relates.

**1.5** "Sub-processor" means any processor engaged by the Data Processor.

**1.6** "Supervisory Authority" means an independent public authority established by an EU Member State.

---

## 2. SCOPE AND DURATION

**2.1 Subject Matter**
Processing of Personal Data necessary to provide healthcare technology platform services.

**2.2 Duration**
From the Effective Date until termination of the Service Agreement or until all Personal Data is deleted or returned.

**2.3 Nature and Purpose**
- Healthcare service delivery
- Electronic health records management
- Patient portal services
- Telemedicine consultations
- Healthcare analytics (anonymized)

**2.4 Type of Personal Data**
- Health data (Article 9(1) GDPR special categories)
- Identification data (name, date of birth, contact details)
- Financial data (insurance, billing)
- Technical data (IP address, device information)

**2.5 Categories of Data Subjects**
- Patients
- Healthcare providers
- Administrative staff
- Legal guardians

---

## 3. DATA PROCESSOR OBLIGATIONS (Article 28(3))

**3.1 General Obligations**

Data Processor shall:
- Process Personal Data only on documented instructions from Data Controller
- Ensure persons authorized to process Personal Data have committed to confidentiality
- Implement appropriate technical and organizational measures (Article 32)
- Respect conditions for engaging Sub-processors (Article 28(2) and (4))
- Assist Data Controller in responding to Data Subject requests (Article 12-22)
- Assist Data Controller in ensuring compliance with Articles 32-36
- Delete or return all Personal Data upon termination
- Make available all information to demonstrate compliance
- Allow for and contribute to audits and inspections

**3.2 Instructions**

Data Processor shall process Personal Data only on documented instructions from Data Controller, including:
- Instructions in the Service Agreement
- Instructions in this DPA
- Subsequent written instructions issued by Data Controller
- Instructions regarding transfers to third countries

Data Processor shall inform Data Controller if instructions violate GDPR or EU/Member State data protection provisions.

---

## 4. SECURITY MEASURES (Article 32)

**4.1 Technical and Organizational Measures**

Data Processor implements:

**Access Control:**
- Role-Based Access Control (RBAC)
- Multi-factor authentication (MFA)
- Just-in-time privileged access
- Principle of least privilege
- Access review every 90 days

**Encryption:**
- AES-256-GCM encryption at rest
- TLS 1.3 for data in transit
- HSM-backed encryption keys (FIPS 140-2 Level 3)
- Key rotation every 90 days

**Logging and Monitoring:**
- Comprehensive audit logging
- Real-time security monitoring (24/7 SOC)
- Automated threat detection
- Incident response within 1 hour

**Data Residency:**
- All Personal Data stored in EU regions only
- No data transfers outside EU without explicit consent
- Geo-filtering to block non-EU access
- EU-only backup locations

**Pseudonymization:**
- Health data pseudonymization where possible
- Tokenization of sensitive identifiers
- Anonymization for analytics

**Business Continuity:**
- RPO: 15 minutes
- RTO: 4 hours
- Geo-redundant backups within EU
- Annual disaster recovery testing

**Physical Security:**
- ISO 27001 certified data centers
- 24/7 physical security
- Biometric access control
- Video surveillance

**4.2 Security Certifications**
- ISO 27001:2022
- SOC 2 Type II
- HITRUST CSF
- Annual GDPR compliance audit

---

## 5. SUB-PROCESSORS (Article 28(2) and (4))

**5.1 General Authorization**

Data Controller provides general authorization for Data Processor to engage Sub-processors, subject to:
- Written notification 30 days before engagement
- Data Controller right to object within 14 days
- Written contract imposing same obligations

**5.2 Current Sub-processors**

| Sub-processor | Service | Location | Safeguards |
|--------------|---------|----------|------------|
| Microsoft Azure | Cloud infrastructure | EU (West Europe) | Standard Contractual Clauses |
| [BACKUP PROVIDER] | Backup services | EU | DPA, ISO 27001 |
| [SECURITY PROVIDER] | Security monitoring | EU | DPA, SOC 2 |

**5.3 Sub-processor Requirements**

All Sub-processors must:
- Execute Data Processing Agreement
- Maintain GDPR compliance
- Implement Article 32 security measures
- Submit to audits
- Provide evidence of compliance

**5.4 Liability**

Data Processor remains fully liable to Data Controller for Sub-processor performance.

---

## 6. DATA SUBJECT RIGHTS (Articles 12-22)

**6.1 Assistance Obligations**

Data Processor shall assist Data Controller in fulfilling Data Subject requests:

**Right of Access (Article 15):**
- Provide Personal Data within 48 hours of request
- Include categories, purposes, recipients
- Format: JSON, PDF, or CSV

**Right to Rectification (Article 16):**
- Correct inaccurate Personal Data within 24 hours
- Complete incomplete Personal Data
- Notify Sub-processors

**Right to Erasure (Article 17):**
- Delete Personal Data within 30 days
- Confirm deletion in writing
- Exceptions documented

**Right to Restriction (Article 18):**
- Restrict processing upon request
- Mark restricted data
- Notify before lifting restriction

**Right to Data Portability (Article 20):**
- Provide structured, machine-readable format
- Transfer directly to another controller if feasible

**Right to Object (Article 21):**
- Stop processing upon objection
- Exception: compelling legitimate grounds

**6.2 Response Time**
- Acknowledge request: Within 24 hours
- Provide assistance: Within 48 hours
- Complete action: Within Data Controller's legal timeline

---

## 7. DATA BREACH NOTIFICATION (Article 33)

**7.1 Notification to Data Controller**

Data Processor shall notify Data Controller without undue delay, and in any event within 24 hours of becoming aware of a Personal Data breach.

**7.2 Breach Information**

Notification shall include:
- Nature of breach (Article 33(3)(a))
- Categories and approximate number of Data Subjects affected
- Categories and approximate number of Personal Data records affected
- Name and contact details of DPO or contact point
- Likely consequences of the breach
- Measures taken or proposed to address the breach
- Measures to mitigate possible adverse effects

**7.3 Investigation and Mitigation**

Data Processor shall:
- Immediately investigate the breach
- Contain and remediate
- Preserve evidence
- Cooperate with Data Controller's investigation
- Assist with notifications to Supervisory Authority and Data Subjects
- Implement preventive measures

---

## 8. DATA PROTECTION IMPACT ASSESSMENT (Article 35)

Data Processor shall assist Data Controller in conducting DPIAs by providing:
- Description of processing operations
- Purposes of processing
- Assessment of necessity and proportionality
- Assessment of risks to Data Subjects
- Security measures in place
- Previous DPIA results

---

## 9. AUDITS AND INSPECTIONS (Article 28(3)(h))

**9.1 Audit Rights**

Data Controller and Supervisory Authority may:
- Conduct audits annually
- Inspect facilities and systems
- Review documentation
- Interview personnel
- Request ad-hoc audits with reasonable notice

**9.2 Audit Reports**

Data Processor shall provide:
- SOC 2 Type II reports annually
- ISO 27001 certificates
- Penetration testing results
- Vulnerability assessments
- Internal audit reports

**9.3 Costs**

- Scheduled audits: Data Processor bears costs
- Ad-hoc audits: Data Controller bears costs unless breach found

---

## 10. DATA TRANSFERS

**10.1 EU Residency**

All Personal Data shall remain within the European Economic Area (EEA).

**10.2 Prohibited Transfers**

Data Processor shall NOT transfer Personal Data to:
- Third countries outside EEA
- International organizations
- Sub-processors outside EEA

Without explicit written consent and appropriate safeguards (Chapter V GDPR).

**10.3 Legal Requests**

If Data Processor receives legal request to disclose Personal Data from non-EU authority:
- Immediately notify Data Controller
- Challenge the request if possible
- Seek legal advice
- Minimize disclosure
- Document all steps taken

---

## 11. RETURN AND DELETION OF DATA

**11.1 Upon Termination**

Within 30 days of Service Agreement termination, Data Processor shall:
- Return all Personal Data to Data Controller in machine-readable format
- OR delete all Personal Data (at Data Controller's choice)
- Delete all existing copies
- Certify completion in writing

**11.2 Retention for Legal Obligations**

If EU or Member State law requires retention:
- Document legal basis
- Limit processing to necessary purposes
- Maintain security measures
- Delete upon expiry of retention period

---

## 12. LIABILITY AND INDEMNIFICATION

**12.1 Processor Liability (Article 82)**

Data Processor is liable for damage caused by:
- Processing that violates GDPR
- Acting outside lawful instructions
- Failure to implement appropriate security measures

**12.2 Indemnification**

Data Processor shall indemnify Data Controller against:
- Supervisory Authority fines (up to €20 million or 4% of annual turnover)
- Data Subject compensation claims
- Legal costs
- Reputational damage

**12.3 Exceptions**

Data Processor not liable if it proves it is not responsible for the event giving rise to damage.

---

## 13. CONTACT AND COOPERATION

**13.1 Data Protection Officer**

Data Processor DPO:
- Name: [DPO NAME]
- Email: dpo@unifiedhealth.com
- Phone: [PHONE]

**13.2 Supervisory Authority**

Data Controller's lead Supervisory Authority:
- Authority: [NAME]
- Country: [COUNTRY]
- Website: [URL]

---

## 14. GENERAL PROVISIONS

**14.1 Governing Law**

This DPA is governed by the laws of [EU COUNTRY] and GDPR.

**14.2 Amendments**

Amendments must be in writing and signed by both parties, except:
- Updates required by GDPR or EU law
- Sub-processor changes (with notification)
- Security measure improvements

**14.3 Severability**

If any provision is invalid, the remainder continues in full force.

**14.4 Precedence**

In case of conflict:
1. GDPR and EU law
2. This DPA
3. Service Agreement

---

## SIGNATURES

**DATA CONTROLLER:**

Signature: ________________________________
Name: ____________________________________
Title: ____________________________________
Date: _____________________________________

**DATA PROCESSOR:**

Signature: ________________________________
Name: ____________________________________
Title: Data Protection Officer
Date: _____________________________________

---

## ANNEX 1: TECHNICAL AND ORGANIZATIONAL MEASURES (Article 32)

### Confidentiality (Article 32(1)(b))

**Access Control:**
- Unique user IDs
- Strong password policy (12+ characters, complexity, 90-day expiry)
- Multi-factor authentication mandatory
- Privileged access management with just-in-time elevation
- Automatic session timeout (15 minutes)
- Failed login lockout (5 attempts)
- Access logging and review

**Physical Access Control:**
- Biometric authentication
- Security badges
- Visitor logs
- 24/7 surveillance
- Locked server rooms
- Controlled data center access

**Transmission Control:**
- TLS 1.3 encryption
- VPN for remote access
- Encrypted email (S/MIME or PGP)
- Secure file transfer (SFTP, HTTPS)
- DLP (Data Loss Prevention)

### Integrity (Article 32(1)(b))

**Transfer Control:**
- Audit logging of all transfers
- Data classification
- Encrypted transfers
- Transfer authorization
- Recipient verification

**Input Control:**
- User authentication
- Input validation
- Change logging
- Version control
- Data integrity checks (checksums)

### Availability and Resilience (Article 32(1)(b))

**Availability Control:**
- Redundant systems (N+1)
- Load balancing
- Auto-scaling
- Health monitoring
- 99.9% SLA

**Rapid Recovery (Article 32(1)(c)):**
- Automated backups (every 15 minutes)
- Geo-redundant storage
- Disaster recovery plan
- RPO: 15 minutes
- RTO: 4 hours
- Annual DR testing

### Testing and Evaluation (Article 32(1)(d))

**Incident Response:**
- 24/7 Security Operations Center (SOC)
- Incident response plan
- Breach notification process (24 hours)
- Root cause analysis
- Corrective actions

**Data Protection Management:**
- Privacy by design
- Data protection impact assessments
- Regular compliance audits
- Staff training (annual)
- Compliance monitoring

**Regular Testing:**
- Penetration testing (annual)
- Vulnerability scanning (weekly)
- Security assessments (quarterly)
- DR/BC testing (annual)
- Phishing simulations (monthly)

---

## ANNEX 2: SUB-PROCESSOR LIST

Maintained at: https://www.unifiedhealth.com/sub-processors

Updated: [DATE]

Data Controller will be notified 30 days before any changes.

---

*This Data Processing Agreement has been prepared in compliance with Article 28 GDPR. Legal review recommended before execution.*
