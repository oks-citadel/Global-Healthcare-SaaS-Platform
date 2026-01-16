# Data Processing Agreement (DPA)

**Effective Date:** January 15, 2025
**Version:** 1.0

---

## Parties

**Data Controller / Covered Entity:**
[Customer Name]
[Address]
("Customer" or "Controller")

**Data Processor / Business Associate:**
Unified Health Platform
[Address]
("Processor" or "Business Associate")

---

## Background

This Data Processing Agreement ("DPA") forms part of the agreement between Customer and Unified Health Platform for the provision of healthcare platform services ("Services"). This DPA reflects the parties' agreement regarding the Processing of Personal Data and Protected Health Information in compliance with GDPR, HIPAA, and other applicable data protection laws.

---

## 1. Definitions

**1.1 General Definitions**

- **"Personal Data"** means any information relating to an identified or identifiable natural person as defined in GDPR Article 4(1).
- **"Protected Health Information" or "PHI"** means individually identifiable health information as defined in HIPAA 45 CFR § 160.103.
- **"Processing"** means any operation performed on Personal Data or PHI, including collection, storage, use, disclosure, or deletion.
- **"Data Subject"** means an identified or identifiable natural person (e.g., patient).
- **"Subprocessor"** means any third party engaged by Processor to Process Personal Data or PHI.
- **"Data Breach"** means unauthorized acquisition, access, use, or disclosure of Personal Data or PHI.
- **"Supervisory Authority"** means a data protection authority as defined in GDPR Article 51.

**1.2 GDPR-Specific Definitions**

Terms used in this DPA shall have the meanings set forth in GDPR unless otherwise defined herein.

**1.3 HIPAA-Specific Definitions**

Terms used in this DPA shall have the meanings set forth in 45 CFR § 160.103 unless otherwise defined herein.

---

## 2. Scope and Nature of Processing

**2.1 Subject Matter**

Processor will Process Personal Data and PHI on behalf of Controller to provide the following Services:

- Electronic health record (EHR) management
- Telemedicine consultation platform
- Appointment scheduling and management
- Patient communication and messaging
- Medical document storage and retrieval
- Prescription management
- Billing and payment processing
- Audit logging and compliance reporting

**2.2 Duration**

This DPA is effective as of the Effective Date and will remain in effect until termination of the Services agreement or until all Personal Data and PHI has been deleted or returned to Controller.

**2.3 Nature and Purpose of Processing**

Processor will Process Personal Data and PHI for the following purposes:

- **Treatment:** Facilitate healthcare delivery and coordination
- **Payment:** Process billing and insurance claims
- **Healthcare Operations:** Quality improvement, auditing, compliance
- **Platform Operations:** Provide, maintain, and improve Services
- **Security:** Protect against security threats and unauthorized access
- **Legal Compliance:** Comply with applicable laws and regulations

**2.4 Categories of Data Subjects**

- Patients receiving healthcare services
- Healthcare providers delivering care
- Administrative staff managing patient care
- Legal guardians and authorized representatives

**2.5 Types of Personal Data and PHI**

**Identification Data:**
- Name, date of birth, gender
- Contact information (email, phone, address)
- Social Security Number, Medical Record Number
- Government-issued ID numbers

**Health Data:**
- Medical history and conditions
- Diagnoses and treatment plans
- Medications and prescriptions
- Laboratory and imaging results
- Clinical notes and observations
- Vital signs and biometric data
- Allergies and adverse reactions

**Financial Data:**
- Insurance information
- Payment card details (tokenized)
- Billing and claims data

**Technical Data:**
- IP addresses, device identifiers
- Usage logs and session data
- Audit trail information

---

## 3. Processor Obligations

**3.1 Lawful Processing**

Processor shall:

- Process Personal Data and PHI only on documented instructions from Controller
- Not Process Personal Data for any purpose other than providing the Services
- Immediately inform Controller if instructions violate applicable law
- Comply with GDPR, HIPAA, and other applicable data protection laws

**3.2 Confidentiality**

Processor shall:

- Ensure that persons authorized to Process Personal Data and PHI are subject to confidentiality obligations
- Provide HIPAA training to all workforce members with access to PHI
- Implement and maintain confidentiality agreements with all personnel

**3.3 Security Measures**

Processor shall implement appropriate technical and organizational measures to protect Personal Data and PHI, including:

**Technical Safeguards:**
- AES-256-GCM encryption for data at rest
- TLS 1.3 encryption for data in transit
- Multi-factor authentication (MFA)
- Role-based access controls (RBAC)
- Automated session timeout (15 minutes)
- Comprehensive audit logging
- Intrusion detection and prevention systems
- Regular vulnerability scanning and penetration testing

**Organizational Safeguards:**
- Written security policies and procedures
- Workforce security and training programs
- Incident response procedures
- Business continuity and disaster recovery plans
- Risk assessment and management processes

**Physical Safeguards:**
- SOC 2 Type II certified data centers (Azure)
- Physical access controls
- Workstation security policies
- Secure device disposal procedures

**3.4 Subprocessors**

Processor may engage Subprocessors to assist in providing the Services, subject to the following:

**Current Subprocessors:**
- Microsoft Azure (cloud infrastructure)
- Stripe (payment processing)
- Twilio (SMS and communication services)
- SendGrid (email services)

**Requirements:**
- Written agreement imposing same data protection obligations
- Processor remains fully liable for Subprocessor performance
- 30-day advance notice to Controller before adding new Subprocessors
- Controller may object to new Subprocessors on reasonable grounds

**3.5 Data Subject Rights**

Processor shall assist Controller in responding to Data Subject requests, including:

- Right of access
- Right to rectification
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object

Processor will:

- Respond to Controller's reasonable requests within 10 business days
- Implement technical measures to facilitate Data Subject rights
- Not respond directly to Data Subjects without Controller authorization

**3.6 Data Breach Notification**

In the event of a Data Breach, Processor shall:

- Notify Controller without undue delay and no later than 24 hours after discovery
- Provide sufficient information to enable Controller to meet breach notification obligations
- Cooperate with Controller's breach investigation
- Take reasonable steps to mitigate the breach and prevent future breaches

**Breach Notification Contents:**
- Nature of the breach
- Categories and number of affected Data Subjects
- Categories and amount of Personal Data/PHI involved
- Likely consequences of the breach
- Measures taken or proposed to address the breach
- Contact point for more information

**3.7 Audit and Inspection Rights**

Controller may audit Processor's compliance with this DPA by:

- Requesting and receiving relevant documentation (e.g., SOC 2 reports, certifications)
- Conducting on-site audits (with reasonable advance notice)
- Engaging third-party auditors (subject to confidentiality)

Processor shall:

- Cooperate with audits and provide necessary information
- Allow access to facilities and systems (subject to security requirements)
- Address any findings within agreed timeframes

Audits may be conducted no more than once per year unless required by law or in response to a suspected breach.

**3.8 Data Protection Impact Assessment**

Upon Controller's request, Processor shall provide reasonable assistance with Data Protection Impact Assessments (DPIAs) and consultations with Supervisory Authorities.

**3.9 International Data Transfers**

Processor's primary data storage is in the United States (Azure US regions). For transfers of Personal Data from the EEA to the United States, Processor implements:

- Standard Contractual Clauses (SCCs) approved by the European Commission
- Supplementary measures as required by EDPB recommendations
- Technical and organizational safeguards equivalent to GDPR standards

**3.10 Record Keeping**

Processor shall maintain records of Processing activities as required by GDPR Article 30, including:

- Name and contact details of Processor and Controller
- Categories of Processing performed
- Description of technical and organizational security measures
- Details of international data transfers

---

## 4. Controller Obligations

**4.1 Lawful Instructions**

Controller shall:

- Ensure that Processing instructions comply with applicable law
- Have legal basis for Processing (e.g., consent, contract, legal obligation)
- Provide clear, documented instructions to Processor

**4.2 Data Accuracy**

Controller is responsible for the accuracy, quality, and legality of Personal Data and PHI provided to Processor.

**4.3 Data Subject Notices**

Controller shall provide appropriate privacy notices to Data Subjects informing them of the Processing activities.

**4.4 Consent and Authorizations**

Controller shall obtain necessary consents and HIPAA authorizations from Data Subjects where required.

---

## 5. Data Retention and Deletion

**5.1 Retention Periods**

Processor shall retain Personal Data and PHI for the following periods:

- Medical records: 10 years from last service date (or as required by state law)
- Audit logs: 6 years (HIPAA requirement)
- Billing records: 7 years (IRS requirement)
- Consent records: 6 years from revocation
- Account data: Duration of relationship plus 1 year

**5.2 Return or Deletion**

Upon termination of Services or Controller's request, Processor shall:

**Option 1 - Return:**
- Return all Personal Data and PHI to Controller in a structured, machine-readable format
- Provide data within 30 days of request
- Include all copies and backups

**Option 2 - Deletion:**
- Securely delete all Personal Data and PHI using industry-standard methods
- Provide written certification of deletion
- Use DoD 5220.22-M or NIST SP 800-88 compliant deletion methods

**Exceptions:**
Processor may retain Personal Data/PHI to the extent required by law, provided that:

- Processor ensures confidentiality of retained data
- Processor only Processes retained data as required by law
- Processor informs Controller of the legal requirement

**5.3 Backup Data**

Processor maintains encrypted backups for disaster recovery. Backup data will be securely deleted according to the backup retention schedule (30 days for daily backups).

---

## 6. Permitted Uses and Disclosures

**6.1 Uses and Disclosures**

Processor may use or disclose PHI only as permitted by this DPA and HIPAA:

**Permitted Uses:**
- Provide Services to Controller
- Data aggregation for healthcare operations (de-identified data only)
- Management and administrative activities of Processor
- Legal compliance

**Permitted Disclosures:**
- To Subprocessors (with appropriate safeguards)
- As required by law
- As directed by Controller
- To Data Subjects (at their request)

**6.2 Minimum Necessary**

Processor shall use, disclose, and request only the minimum amount of PHI necessary to accomplish the intended purpose, except for disclosures to healthcare providers for treatment purposes.

**6.3 De-identification**

Processor may create de-identified data sets from PHI for analytics, research, and platform improvement, provided that:

- De-identification follows HIPAA Safe Harbor or Expert Determination methods
- De-identified data cannot reasonably be re-identified
- De-identified data is not subject to DPA restrictions

---

## 7. Compliance with Laws

**7.1 HIPAA Compliance**

Processor agrees to comply with the HIPAA Privacy Rule (45 CFR Part 164, Subpart E) and Security Rule (45 CFR Part 164, Subpart C).

Processor shall:

- Implement administrative, physical, and technical safeguards
- Report Security Incidents to Controller
- Make PHI available to Individuals as directed by Controller
- Make PHI available for amendment as directed by Controller
- Provide an accounting of disclosures as directed by Controller
- Make internal practices, books, and records available to HHS

**7.2 GDPR Compliance**

Processor agrees to comply with GDPR requirements applicable to Processors, including:

- Processing only on documented instructions (Article 28(3)(a))
- Ensuring confidentiality (Article 28(3)(b))
- Implementing appropriate security measures (Article 32)
- Engaging Subprocessors with authorization (Article 28(2))
- Assisting with Data Subject rights (Article 28(3)(e))
- Assisting with compliance obligations (Article 28(3)(f))
- Deleting or returning data at end of Services (Article 28(3)(g))
- Providing information for audits (Article 28(3)(h))

**7.3 Other Applicable Laws**

Processor shall comply with:

- HITECH Act
- State health privacy laws
- CCPA/CPRA (California)
- Other applicable data protection laws

---

## 8. Liability and Indemnification

**8.1 Processor Liability**

Processor is liable to Controller for damages caused by Processing that violates GDPR or this DPA. Liability is limited as set forth in the Services agreement, except where GDPR or HIPAA prohibits limitation.

**8.2 Indemnification**

Processor shall indemnify and hold harmless Controller from claims, fines, and damages resulting from Processor's:

- Breach of this DPA
- Violation of applicable data protection laws
- Negligent or willful misconduct
- Failure to implement required security measures

**8.3 Supervisory Authority Fines**

Processor shall be responsible for GDPR fines imposed on Controller resulting from Processor's non-compliance with GDPR Processor obligations.

---

## 9. Term and Termination

**9.1 Term**

This DPA takes effect on the Effective Date and continues for the duration of the Services agreement.

**9.2 Termination**

This DPA may be terminated:

- Upon termination of the Services agreement
- By Controller if Processor materially breaches this DPA and fails to cure within 30 days
- Immediately if required by Supervisory Authority

**9.3 Effect of Termination**

Upon termination:

- Processor shall return or delete all Personal Data and PHI (Section 5.2)
- Processor shall certify in writing completion of return/deletion
- Surviving provisions (audit rights, liability) remain in effect

---

## 10. Miscellaneous

**10.1 Conflict**

In case of conflict between this DPA and the Services agreement, this DPA prevails on data protection matters.

**10.2 Amendments**

Amendments to this DPA must be in writing and signed by both parties, except for updates to Subprocessor list (which follow Section 3.4 notice requirements).

**10.3 Severability**

If any provision is held invalid, the remaining provisions remain in effect.

**10.4 Governing Law**

This DPA is governed by the laws specified in the Services agreement, to the extent not preempted by HIPAA or GDPR.

**10.5 Notices**

Notices must be sent to:

**Controller:**
[Contact information from Services agreement]

**Processor:**
Unified Health Platform
Email: legal@thetheunifiedhealth.com
Address: [Company Address]

---

## 11. Signatures

By signing below, the parties agree to the terms of this Data Processing Agreement.

**Data Controller / Covered Entity:**

Name: _______________________
Title: _______________________
Signature: _______________________
Date: _______________________

**Data Processor / Business Associate:**

Name: _______________________
Title: _______________________
Signature: _______________________
Date: _______________________

---

**Annexes:**

- Annex 1: List of Subprocessors
- Annex 2: Technical and Organizational Security Measures
- Annex 3: Standard Contractual Clauses (for EEA data transfers)

---

**Document Classification:** Confidential - Legal Agreement
**Version:** 1.0
**Effective Date:** January 15, 2025

© 2025 Unified Health Platform. All rights reserved.
