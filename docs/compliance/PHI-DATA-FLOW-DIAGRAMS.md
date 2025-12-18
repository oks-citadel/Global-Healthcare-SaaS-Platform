# PHI Data Flow Diagrams and Documentation

**Document Version:** 1.0
**Last Updated:** 2025-01-15
**Classification:** Internal - Technical Documentation
**HIPAA Reference:** 45 CFR § 164.312 - Technical Safeguards

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [PHI Data Flows](#phi-data-flows)
4. [Encryption Points](#encryption-points)
5. [Access Control Points](#access-control-points)
6. [Audit Logging Points](#audit-logging-points)
7. [Data Storage Locations](#data-storage-locations)
8. [Third-Party Data Flows](#third-party-data-flows)

---

## Overview

This document provides detailed diagrams and descriptions of how Protected Health Information (PHI) flows through the Unified Healthcare Platform. Understanding these data flows is critical for HIPAA compliance, security audits, and incident response.

### Purpose

- **Compliance:** Demonstrate HIPAA technical safeguards
- **Security:** Identify encryption and access control points
- **Audit:** Document all PHI touchpoints for compliance verification
- **Incident Response:** Enable rapid assessment of breach scope

### Document Conventions

```
[Component]        - System component
──────>           - Data flow direction
[E]               - Encryption in transit
[Encrypted]       - Encryption at rest
{Logged}          - Audit logging enabled
<Auth>            - Authentication required
<RBAC>            - Role-based access control
```

---

## System Architecture

### High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Web App      │  │ Mobile App   │  │ Provider     │            │
│  │ (React)      │  │ (React       │  │ Portal       │            │
│  │              │  │  Native)     │  │              │            │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            │
│         │                  │                  │                     │
│         └──────────────────┴──────────────────┘                     │
│                            │                                        │
│                     [E] TLS 1.3                                    │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                    API GATEWAY LAYER                                │
│                            │                                        │
│  ┌─────────────────────────▼──────────────────────────────┐        │
│  │         Azure Application Gateway / Load Balancer       │        │
│  │  <Auth> JWT Validation | <RBAC> Role Verification       │        │
│  │  {Logged} Request Logging | Rate Limiting               │        │
│  └─────────────────────────┬──────────────────────────────┘        │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                     APPLICATION LAYER                               │
│                            │                                        │
│  ┌─────────────────────────▼──────────────────────────────┐        │
│  │              Node.js API Server (Express)               │        │
│  │                                                          │        │
│  │  Middleware Stack:                                      │        │
│  │  ┌──────────────────────────────────────────────┐      │        │
│  │  │ 1. Authentication Middleware <Auth>          │      │        │
│  │  │ 2. Authorization Middleware <RBAC>           │      │        │
│  │  │ 3. Audit Logging Middleware {Logged}         │      │        │
│  │  │ 4. Encryption/Decryption Middleware          │      │        │
│  │  │ 5. Rate Limiting Middleware                  │      │        │
│  │  └──────────────────────────────────────────────┘      │        │
│  │                                                          │        │
│  │  Controllers:                                           │        │
│  │  • Patient Controller                                   │        │
│  │  • Encounter Controller                                 │        │
│  │  • Appointment Controller                               │        │
│  │  • Document Controller                                  │        │
│  │  • Prescription Controller                              │        │
│  └─────────────────────────┬──────────────────────────────┘        │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                      DATA LAYER                                     │
│                            │                                        │
│  ┌─────────────────────────▼──────────────────────────────┐        │
│  │         PostgreSQL Database (Azure Database)            │        │
│  │                                                          │        │
│  │  Tables with PHI [Encrypted]:                           │        │
│  │  • User (email, phone, address)                         │        │
│  │  • Patient (MRN, DOB, allergies, emergency contact)     │        │
│  │  • Encounter (clinical notes, diagnoses)                │        │
│  │  • Document (file metadata, URLs)                       │        │
│  │  • Prescription (medications, dosages)                  │        │
│  │  • LabResult (test results, values)                     │        │
│  │  • AuditEvent {Logged} (all PHI access)                 │        │
│  │  • Consent (patient authorizations)                     │        │
│  │                                                          │        │
│  │  Encryption: AES-256-GCM at rest                        │        │
│  │  Access: TLS 1.3 connections only                       │        │
│  │  Backup: Encrypted geo-redundant backups                │        │
│  └──────────────────────────────────────────────────────────       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────┐          │
│  │      Azure Blob Storage (Encrypted Documents)        │          │
│  │                                                       │          │
│  │  • Medical documents (lab results, imaging)          │          │
│  │  • Prescriptions                                      │          │
│  │  • Patient uploaded files                            │          │
│  │                                                       │          │
│  │  Encryption: AES-256 at rest                         │          │
│  │  Access: SAS tokens with expiration                  │          │
│  │  {Logged}: All access logged to audit trail          │          │
│  └──────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                   THIRD-PARTY SERVICES                              │
│                            │                                        │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Stripe        │  │ Twilio       │  │ SendGrid     │            │
│  │ (Payment)     │  │ (SMS)        │  │ (Email)      │            │
│  │ [BAA Signed]  │  │ [BAA Signed] │  │ [BAA Signed] │            │
│  └───────────────┘  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## PHI Data Flows

### 1. Patient Registration Flow

```
Patient (Web/Mobile App)
    │
    │ [E] HTTPS POST /auth/register
    │ Payload: { firstName, lastName, email, phone, DOB, ... }
    │
    ▼
API Gateway <Auth> <RBAC>
    │
    │ JWT Validation
    │
    ▼
Authentication Middleware
    │
    ▼
Audit Middleware {Logged}
    │ Log: "create_user" action
    │
    ▼
Encryption Middleware
    │ Encrypt sensitive fields: phone, email, DOB, address
    │
    ▼
User Controller
    │
    │ Create user account
    │ Create patient record
    │ Generate Medical Record Number (MRN)
    │
    ▼
Database [Encrypted]
    │ INSERT INTO User (email*, phone*, ...)
    │ INSERT INTO Patient (dateOfBirth*, MRN*, ...)
    │ INSERT INTO AuditEvent (userId, action="create_user", ...)
    │
    │ *Encrypted at rest with AES-256-GCM
    │
    ▼
Response to Patient
    │ [E] HTTPS 201 Created
    │ { userId, message: "Account created" }
```

### 2. Patient Record Access Flow

```
Provider (Web Portal)
    │
    │ [E] HTTPS GET /api/v1/patients/:id
    │ Headers: { Authorization: "Bearer <JWT>" }
    │
    ▼
API Gateway
    │
    ▼
Authentication Middleware <Auth>
    │ Verify JWT signature
    │ Extract userId, role from token
    │
    ▼
Authorization Middleware <RBAC>
    │ Check: Is user a Provider?
    │ Check: Does provider have access to this patient?
    │
    ▼
Audit Middleware {Logged}
    │ Log PHI access:
    │   userId: provider-id
    │   action: "read_patient"
    │   resource: "patient"
    │   resourceId: patient-id
    │   ipAddress: 192.168.1.100
    │   timestamp: 2025-01-15T10:30:45Z
    │
    ▼
Patient Controller
    │ Query patient data from database
    │
    ▼
Database [Encrypted]
    │ SELECT * FROM Patient WHERE id = :id
    │ SELECT * FROM User WHERE id = patient.userId
    │
    │ Data retrieved (encrypted at rest)
    │
    ▼
Decryption Middleware
    │ Decrypt sensitive fields:
    │   - phone: [Encrypted] → "555-123-4567"
    │   - email: [Encrypted] → "john@example.com"
    │   - DOB: [Encrypted] → "1980-05-15"
    │   - address: [Encrypted] → "123 Main St"
    │
    ▼
Response to Provider
    │ [E] HTTPS 200 OK
    │ {
    │   id: "patient-id",
    │   firstName: "John",
    │   lastName: "Doe",
    │   dateOfBirth: "1980-05-15",
    │   phone: "555-123-4567",
    │   ...
    │ }
    │
    ▼
Provider's Browser
    │ Display patient information (secure session)
    │ Session timeout: 15 minutes
```

### 3. Document Upload Flow

```
Patient/Provider (Web/Mobile App)
    │
    │ [E] HTTPS POST /api/v1/documents
    │ Headers: { Authorization: "Bearer <JWT>" }
    │ Payload: { file: <binary>, type: "lab_result", patientId: "..." }
    │
    ▼
API Gateway
    │
    ▼
Authentication Middleware <Auth>
    │ Verify JWT
    │
    ▼
Authorization Middleware <RBAC>
    │ Check: Does user have permission to upload documents for this patient?
    │
    ▼
Audit Middleware {Logged}
    │ Log: "create_document" action
    │
    ▼
Document Controller
    │ Validate file type, size
    │ Generate unique document ID
    │ Generate secure file name
    │
    ▼
Azure Blob Storage
    │ [E] HTTPS PUT to Blob Storage
    │ Encryption: AES-256 at rest
    │ Container: patient-documents-{patientId}
    │ Blob name: {documentId}-{timestamp}.pdf
    │ Metadata: { encryptedBy: "system", uploadedBy: userId }
    │
    ▼
Database [Encrypted]
    │ INSERT INTO Document (
    │   id,
    │   patientId,
    │   type,
    │   fileName,
    │   fileUrl: blob-storage-url,
    │   uploadedBy,
    │   createdAt
    │ )
    │
    │ INSERT INTO AuditEvent (
    │   userId,
    │   action: "upload_document",
    │   resource: "document",
    │   resourceId: documentId
    │ )
    │
    ▼
Response
    │ [E] HTTPS 201 Created
    │ { documentId, message: "Document uploaded successfully" }
```

### 4. Document Download/Access Flow

```
Provider (Web Portal)
    │
    │ [E] HTTPS GET /api/v1/documents/:id/download
    │ Headers: { Authorization: "Bearer <JWT>" }
    │
    ▼
API Gateway → Auth Middleware → Authorization Middleware
    │
    ▼
Audit Middleware {Logged}
    │ Log CRITICAL action: "download_document"
    │ Details: documentId, patientId, fileType, fileSize
    │
    ▼
Document Controller
    │ Retrieve document metadata from database
    │ Verify user has access to patient's documents
    │
    ▼
Database [Encrypted]
    │ SELECT * FROM Document WHERE id = :id
    │ Retrieve: fileUrl, fileName, mimeType
    │
    ▼
Azure Blob Storage Access
    │ Generate time-limited SAS token (15-minute expiration)
    │ [E] HTTPS GET from Blob Storage using SAS token
    │ Blob Storage decrypts file (AES-256)
    │
    ▼
Audit Log (Additional Entry)
    │ INSERT INTO AuditEvent (
    │   userId,
    │   action: "download_document",
    │   resource: "document",
    │   resourceId,
    │   details: { fileName, fileSize, mimeType }
    │ )
    │
    ▼
Response to Provider
    │ [E] HTTPS 200 OK
    │ Content-Type: application/pdf (or appropriate type)
    │ Content-Disposition: attachment; filename="lab-result.pdf"
    │ Binary file data (encrypted in transit via TLS 1.3)
    │
    ▼
Provider's Browser
    │ Download file to local machine
    │ User responsible for securing downloaded file
```

### 5. Telemedicine Video Consultation Flow

```
Patient                                Provider
    │                                      │
    │ [E] WebRTC + HTTPS                  │ [E] WebRTC + HTTPS
    │                                      │
    ▼                                      ▼
WebRTC Signaling Server (Socket.io over HTTPS)
    │
    │ Establish encrypted peer-to-peer connection
    │ Encryption: DTLS-SRTP (media streams)
    │
    ▼
Direct P2P Video/Audio Stream
    │ [E] End-to-end encrypted (DTLS-SRTP)
    │ No PHI content stored on servers
    │ Session metadata logged:
    │   - Start time, end time
    │   - Participants (patient ID, provider ID)
    │   - Connection quality metrics
    │
    ▼
Audit Log {Logged}
    │ INSERT INTO AuditEvent (
    │   action: "telemedicine_session",
    │   resource: "visit",
    │   resourceId: visitId,
    │   details: { startTime, endTime, duration }
    │ )
    │
    ▼
Clinical Note Creation (Post-Visit)
    │ Provider creates clinical note
    │ Note contains PHI: symptoms, diagnosis, treatment plan
    │
    ▼
Encryption Middleware
    │ Encrypt clinical note content
    │
    ▼
Database [Encrypted]
    │ INSERT INTO ClinicalNote (
    │   encounterId,
    │   content: [Encrypted],
    │   authorId: providerId,
    │   timestamp
    │ )
```

### 6. Prescription Creation Flow

```
Provider (Web Portal)
    │
    │ [E] HTTPS POST /api/v1/prescriptions
    │ Payload: {
    │   patientId,
    │   medications: [
    │     { name: "Amoxicillin", dosage: "500mg", frequency: "3x daily" }
    │   ]
    │ }
    │
    ▼
Auth → RBAC → Audit {Logged}
    │
    ▼
Prescription Controller
    │ Verify provider credentials
    │ Check drug interactions (external API)
    │
    ▼
Encryption Middleware
    │ Encrypt: medication names, dosages, instructions
    │
    ▼
Database [Encrypted]
    │ INSERT INTO Prescription (
    │   id,
    │   patientId,
    │   providerId,
    │   status: "active"
    │ )
    │
    │ INSERT INTO PrescriptionItem (
    │   prescriptionId,
    │   medicationName: [Encrypted],
    │   dosage: [Encrypted],
    │   frequency: [Encrypted],
    │   instructions: [Encrypted]
    │ )
    │
    │ INSERT INTO AuditEvent (
    │   action: "create_prescription",
    │   resourceId: prescriptionId
    │ )
    │
    ▼
Notification Service (Optional)
    │ [E] HTTPS POST to Twilio (SMS notification)
    │ Message: "Your prescription is ready" (no PHI in message)
    │
    ▼
Response
    │ [E] HTTPS 201 Created
    │ { prescriptionId, status: "active" }
```

---

## Encryption Points

### Data at Rest Encryption

| Data Type | Location | Encryption Method | Key Management |
|-----------|----------|-------------------|----------------|
| Patient Demographics | PostgreSQL | AES-256-GCM | Azure Key Vault |
| Clinical Notes | PostgreSQL | AES-256-GCM | Azure Key Vault |
| Medical Documents | Azure Blob Storage | AES-256 | Azure Storage Service Encryption |
| Prescriptions | PostgreSQL | AES-256-GCM | Azure Key Vault |
| Lab Results | PostgreSQL | AES-256-GCM | Azure Key Vault |
| Audit Logs | PostgreSQL | AES-256 (database-level) | Azure Key Vault |
| Database Backups | Azure Blob Storage | AES-256 | Azure Key Vault |

### Data in Transit Encryption

| Connection | Protocol | Cipher Suite | Certificate |
|------------|----------|--------------|-------------|
| Client ↔ API Gateway | TLS 1.3 | TLS_AES_256_GCM_SHA384 | Let's Encrypt |
| API ↔ Database | TLS 1.3 | TLS_AES_256_GCM_SHA384 | Azure-managed |
| API ↔ Blob Storage | TLS 1.3 | TLS_AES_256_GCM_SHA384 | Azure-managed |
| API ↔ Third-Party (Stripe) | TLS 1.3 | TLS_AES_256_GCM_SHA384 | Third-party cert |
| WebRTC Media Streams | DTLS-SRTP | DTLS_SRTP_AES128_CM_HMAC_SHA1_80 | Self-signed (ephemeral) |

---

## Access Control Points

### Authentication Gates

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: API Gateway                                │
│ • JWT token validation                              │
│ • Token expiration check (15 minutes)               │
│ • Token signature verification                      │
│ • Token revocation list check                       │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│ Layer 2: Authentication Middleware                  │
│ • Extract user ID, role from JWT                    │
│ • Verify user account status (active/suspended)     │
│ • Check session validity                            │
│ • Enforce session timeout (15 minutes inactivity)   │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│ Layer 3: Authorization Middleware (RBAC)            │
│ • Verify user role permissions                      │
│ • Check resource-specific access rights             │
│ • Enforce minimum necessary access                  │
└─────────────────────────────────────────────────────┘
```

### Role-Based Access Control Matrix

| Resource | Patient (Read) | Patient (Write) | Provider (Read) | Provider (Write) | Admin |
|----------|----------------|-----------------|-----------------|------------------|-------|
| Own Medical Records | ✅ | ❌ | ✅ | ✅ | ✅ |
| Other Patient Records | ❌ | ❌ | ✅ (assigned) | ✅ (assigned) | ✅ |
| Prescriptions | ✅ (own) | ❌ | ✅ | ✅ (create) | ✅ |
| Lab Results | ✅ (own) | ❌ | ✅ | ✅ (upload) | ✅ |
| Appointments | ✅ (own) | ✅ (own) | ✅ | ✅ | ✅ |
| Audit Logs | ❌ | ❌ | ❌ | ❌ | ✅ (read-only) |
| System Config | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Audit Logging Points

All PHI access is logged at the following points:

```
Request Entry Point (API Gateway)
    │ Log: Request received, IP address, user agent
    │
    ▼
Authentication (Post-JWT Validation)
    │ Log: User authenticated, userId, role
    │
    ▼
Authorization (Post-RBAC Check)
    │ Log: Authorization granted/denied, resource, action
    │
    ▼
Controller (Pre-Database Query)
    │ Log: Action initiated, resource type, resource ID
    │
    ▼
Database Access
    │ Log: Query executed, affected records
    │
    ▼
Response Sent
    │ Log: Response status code, data size
    │
    ▼
Audit Event Persisted
    │ INSERT INTO AuditEvent (all details)
    │ Retention: 6 years minimum
```

**Logged Fields:**
- `userId` - Who accessed
- `action` - What action (create, read, update, delete)
- `resource` - What resource type (patient, document, etc.)
- `resourceId` - Specific resource ID
- `timestamp` - When (ISO 8601)
- `ipAddress` - From where
- `userAgent` - Client device/browser
- `details` - Additional context (PHI-filtered)

---

## Data Storage Locations

### Primary Data Stores

| Data Category | Storage System | Region | Encryption | Backup |
|---------------|----------------|--------|------------|--------|
| Patient Records | Azure PostgreSQL | US East | AES-256-GCM | Geo-redundant |
| Medical Documents | Azure Blob Storage | US East | AES-256 | Geo-redundant |
| Audit Logs | Azure PostgreSQL | US East | AES-256 | Geo-redundant |
| Session Data | Redis Cache | US East | TLS in transit | Not backed up |
| Application Logs | Azure Log Analytics | US East | AES-256 | 90-day retention |

### Backup Strategy

```
Production Database (US East)
    │
    │ Automated Daily Backups
    │
    ▼
Backup Storage (Azure Blob - US West) [Encrypted]
    │ AES-256 encryption
    │ 30-day retention
    │
    ▼
Long-Term Archive (Azure Blob - Cool Tier)
    │ Quarterly backups
    │ 6-year retention (HIPAA compliance)
    │ Compressed and encrypted
```

---

## Third-Party Data Flows

### Payment Processing (Stripe)

```
Patient/Provider → API → Stripe (PCI-DSS Compliant)
                            │
                            │ [BAA Signed]
                            │ [E] TLS 1.3
                            │
                            │ PHI Sent:
                            │ • Patient name (billing)
                            │ • Email (receipt)
                            │ • Insurance ID (claims)
                            │
                            ▼
                    Payment Processed
                            │
                            ▼
                    Webhook Callback [E] HTTPS
                            │
                            ▼
                        API {Logged}
                            │
                            ▼
                    Database (Payment record)
```

### SMS Notifications (Twilio)

```
Appointment System → API → Twilio
                            │
                            │ [BAA Signed]
                            │ [E] TLS 1.3
                            │
                            │ PHI Sent:
                            │ • Phone number
                            │ • Patient name (greeting)
                            │
                            │ Message Content:
                            │ "Hi [FirstName], you have an
                            │  appointment on [Date] at [Time]"
                            │
                            │ NO detailed PHI in messages
                            │
                            ▼
                    SMS Delivered {Logged}
```

### Email Notifications (SendGrid)

```
System Events → API → SendGrid
                        │
                        │ [BAA Signed]
                        │ [E] TLS 1.3
                        │
                        │ PHI Sent:
                        │ • Email address
                        │ • Patient name
                        │
                        │ Email Content:
                        │ • Appointment reminders (no clinical details)
                        │ • Password reset links
                        │ • Account notifications
                        │
                        │ Detailed PHI delivered via secure portal link
                        │
                        ▼
                Email Sent {Logged}
```

---

## Security Controls Summary

### Encryption Summary
- **At Rest:** AES-256-GCM for all PHI in database
- **In Transit:** TLS 1.3 for all API communications
- **Media Streams:** DTLS-SRTP for video consultations
- **Backups:** AES-256 encrypted

### Access Control Summary
- **Authentication:** JWT tokens, 15-minute expiration
- **Authorization:** Role-based access control (RBAC)
- **Session Management:** 15-minute inactivity timeout
- **MFA:** Available for all users, required for admins

### Audit Logging Summary
- **Coverage:** 100% PHI access logged
- **Retention:** 6 years minimum
- **Integrity:** Immutable audit trail
- **Access:** Admin read-only, all access logged

---

**Document Classification:** Internal - Technical Documentation
**Retention Period:** 6 years
**Review Schedule:** Quarterly or upon architecture changes

**For questions, contact:**
Security Team: security@unifiedhealthcare.com
Compliance Team: compliance@unifiedhealthcare.com
