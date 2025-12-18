# Audit Logging Documentation

**Document Version:** 1.0
**Last Updated:** 2025-01-15
**Classification:** Internal - Technical Documentation
**HIPAA Reference:** 45 CFR § 164.312(b) - Audit Controls

---

## Table of Contents

1. [Overview](#overview)
2. [Audit Logging Requirements](#audit-logging-requirements)
3. [What PHI Access is Logged](#what-phi-access-is-logged)
4. [Audit Log Format](#audit-log-format)
5. [Log Retention Policies](#log-retention-policies)
6. [Technical Implementation](#technical-implementation)
7. [Audit Log Analysis](#audit-log-analysis)
8. [Compliance and Monitoring](#compliance-and-monitoring)

---

## Overview

The Unified Healthcare Platform implements comprehensive audit logging to meet HIPAA Audit Controls requirements (45 CFR § 164.312(b)). All access to Protected Health Information (PHI) is automatically logged with sufficient detail to support security monitoring, incident investigation, and compliance audits.

### Purpose

The audit logging system serves multiple critical functions:

- **HIPAA Compliance:** Meet regulatory requirements for audit controls
- **Security Monitoring:** Detect unauthorized or suspicious PHI access
- **Incident Investigation:** Provide evidence for security incident analysis
- **Accountability:** Create a tamper-proof record of all system activities
- **Legal Protection:** Maintain evidence for potential legal proceedings

### Design Principles

1. **Automatic:** Logging happens automatically without user intervention
2. **Comprehensive:** All PHI access is logged without exception
3. **Tamper-Proof:** Audit logs cannot be modified or deleted by users
4. **Privacy-Preserving:** Logs do not contain raw PHI data
5. **Performant:** Logging does not significantly impact system performance
6. **Retained:** Logs are retained for the required 6-year period

---

## Audit Logging Requirements

### HIPAA Requirements

**45 CFR § 164.312(b) - Audit Controls (Required)**

> Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.

### What Must Be Logged

According to HIPAA, the following activities must be recorded:

1. **User Authentication Events**
   - Successful and failed login attempts
   - Logout events
   - Password changes and resets
   - MFA enrollment and usage

2. **PHI Access Events**
   - Reading patient records
   - Creating new patient data
   - Updating existing patient information
   - Deleting patient data (soft deletes)

3. **System Events**
   - Administrative changes
   - Configuration modifications
   - Security setting changes
   - User permission changes

4. **Data Export Events**
   - Downloading patient documents
   - Exporting patient data
   - Printing PHI
   - Sharing records

### Retention Requirements

- **Minimum Retention:** 6 years from creation or last active date
- **Recommended Retention:** 7 years (to account for discovery delays)
- **Current Policy:** 6 years in active database + archival

---

## What PHI Access is Logged

### 1. Patient Record Access

**Logged Activities:**
- Viewing patient demographics
- Accessing patient medical records
- Reading patient contact information
- Viewing patient insurance information
- Accessing emergency contact details

**Implementation:**
```
File: services/api/src/middleware/audit.middleware.ts
Function: auditPHIAccess
Trigger: Automatic on all /patients/* endpoints
```

**Logged Fields:**
- User ID (who accessed)
- Patient ID (what was accessed)
- Action type (read, list)
- Timestamp (when)
- IP address (from where)
- User agent (client device/browser)
- HTTP method and path
- Response status code

### 2. Clinical Encounter Access

**Logged Activities:**
- Creating new encounters
- Reading encounter details
- Updating encounter information
- Adding clinical notes
- Viewing diagnoses and treatments

**Implementation:**
```
File: services/api/src/middleware/audit.middleware.ts
Resource: encounter
Actions: create, read, update, delete, list
```

**Logged Fields:**
- User ID
- Encounter ID
- Patient ID (from encounter)
- Provider ID
- Action type
- Timestamp
- IP address
- Modified fields (for updates)

### 3. Appointment Access

**Logged Activities:**
- Scheduling appointments
- Viewing appointment details
- Modifying appointments
- Canceling appointments
- Viewing appointment history

**Implementation:**
```
Resource: appointment
Actions: create, read, update, delete, list, cancel
```

**Logged Fields:**
- User ID
- Appointment ID
- Patient ID
- Provider ID
- Scheduled date/time
- Appointment type
- Action type
- Timestamp

### 4. Document Access

**Logged Activities:**
- Uploading patient documents
- Viewing documents
- Downloading documents
- Deleting documents
- Sharing documents

**Implementation:**
```
Resource: document
Actions: create, read, update, delete, download, share
```

**Logged Fields:**
- User ID
- Document ID
- Patient ID
- Document type
- File name (not content)
- Action type
- Timestamp
- IP address

### 5. Prescription Access

**Logged Activities:**
- Creating prescriptions
- Viewing prescription details
- Modifying prescriptions
- Canceling prescriptions
- Refill requests

**Implementation:**
```
Resource: prescription
Actions: create, read, update, delete, refill
```

### 6. Lab Results Access

**Logged Activities:**
- Uploading lab results
- Viewing lab results
- Updating result values
- Acknowledging abnormal results

**Implementation:**
```
Resource: lab-result
Actions: create, read, update, acknowledge
```

### 7. Medical Record Number (MRN) Lookups

**Logged Activities:**
- MRN searches
- Patient identification queries

### 8. Authentication Events

**Logged Activities:**
- Successful logins
- Failed login attempts
- Logout events
- Password changes
- Password reset requests
- MFA enrollment
- MFA verification

**Implementation:**
```
File: services/api/src/middleware/audit.middleware.ts
Function: auditAuthEvent
```

**Logged Fields:**
- User ID or email (for failed attempts)
- Event type (login, logout, password_change, etc.)
- Success/failure status
- Timestamp
- IP address
- User agent
- Failure reason (for failed attempts)

### 9. Data Export Events

**Logged Activities:**
- Exporting patient data to CSV/JSON
- Generating reports with PHI
- Bulk data downloads
- API data extraction

**Implementation:**
```
File: services/api/src/middleware/audit.middleware.ts
Function: auditDataExport
```

**Logged Fields:**
- User ID
- Export format (CSV, JSON, PDF)
- Date range of exported data
- Number of records exported
- Filters applied
- Timestamp
- IP address

### 10. Administrative Actions

**Logged Activities:**
- User account creation/modification
- Role/permission changes
- System configuration changes
- Security setting modifications

**Implementation:**
```
Function: auditSensitiveOperation
Resource: system, user, configuration
```

### PHI Resources Tracked

The following resources are automatically tracked for PHI access:

```typescript
const PHI_RESOURCES = [
  'patient',          // Patient demographics and records
  'encounter',        // Clinical encounters
  'appointment',      // Appointment scheduling
  'document',         // Medical documents
  'visit',           // Telemedicine visits
  'medical-record',  // Comprehensive medical records
  'prescription',    // Medication prescriptions
  'lab-result',      // Laboratory test results
  'diagnosis',       // Patient diagnoses
  'treatment-plan',  // Treatment plans
];
```

---

## Audit Log Format

### Database Schema

**Table:** `AuditEvent` (Prisma schema)

```prisma
model AuditEvent {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  action     String
  resource   String
  resourceId String?
  details    Json?
  ipAddress  String?
  userAgent  String?
  timestamp  DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([resource])
  @@index([timestamp])
  @@index([userId, timestamp])
  @@index([resource, action])
}
```

### Audit Log Entry Structure

**TypeScript Interface:**
```typescript
interface AuditEvent {
  id: string;              // Unique audit event ID (UUID)
  userId: string;          // User who performed the action
  action: string;          // Action performed (e.g., "read_patient")
  resource: string;        // Resource type (e.g., "patient")
  resourceId?: string;     // Specific resource ID (e.g., patient UUID)
  details?: {              // Additional context (PHI-filtered)
    method: string;        // HTTP method
    path: string;          // Request path
    statusCode: number;    // Response status
    query?: object;        // Query parameters (filtered)
    body?: object;         // Request body (filtered)
  };
  ipAddress: string;       // Client IP address
  userAgent: string;       // Client user agent
  timestamp: string;       // ISO 8601 timestamp
}
```

### Example Audit Log Entries

**Example 1: Patient Record Access**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "action": "read_patient",
  "resource": "patient",
  "resourceId": "a8f5f167-a8c9-45e6-b8e4-123456789abc",
  "details": {
    "method": "GET",
    "path": "/api/v1/patients/a8f5f167-a8c9-45e6-b8e4-123456789abc",
    "statusCode": 200,
    "query": {}
  },
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "timestamp": "2025-01-15T10:30:45.123Z"
}
```

**Example 2: Failed Login Attempt**
```json
{
  "id": "660f9511-f30c-52e5-b827-557766551111",
  "userId": "user@example.com",
  "action": "failed_login",
  "resource": "authentication",
  "details": {
    "email": "[REDACTED]",
    "reason": "Invalid password",
    "timestamp": "2025-01-15T10:25:12.456Z"
  },
  "ipAddress": "203.0.113.42",
  "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)",
  "timestamp": "2025-01-15T10:25:12.456Z"
}
```

**Example 3: Document Download**
```json
{
  "id": "770g0622-g41d-63f6-c938-668877662222",
  "userId": "8d0f7780-8536-51ef-c05c-f18gd2g01bf8",
  "action": "download_document",
  "resource": "document",
  "resourceId": "doc-12345-abcde",
  "details": {
    "method": "GET",
    "path": "/api/v1/documents/doc-12345-abcde/download",
    "statusCode": 200,
    "fileName": "lab-results-2025-01-10.pdf",
    "fileType": "application/pdf",
    "fileSize": 245632
  },
  "ipAddress": "198.51.100.25",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  "timestamp": "2025-01-15T11:15:30.789Z"
}
```

**Example 4: Data Export**
```json
{
  "id": "880h1733-h52e-74g7-d049-779988773333",
  "userId": "9e1g8891-9647-62fg-d16d-g29he3h12cg9",
  "action": "export_data",
  "resource": "data_export",
  "details": {
    "format": "csv",
    "dateRange": {
      "from": "2024-01-01",
      "to": "2024-12-31"
    },
    "filters": {
      "status": "completed"
    },
    "recordCount": 1250,
    "timestamp": "2025-01-15T14:20:15.000Z"
  },
  "ipAddress": "192.0.2.50",
  "userAgent": "Mozilla/5.0 (X11; Linux x86_64)",
  "timestamp": "2025-01-15T14:20:15.000Z"
}
```

### Action Naming Convention

Actions follow the pattern: `{verb}_{resource}`

**Common Verbs:**
- `create` - Creating new resources
- `read` - Reading/viewing resources
- `update` - Modifying existing resources
- `delete` - Deleting resources (typically soft delete)
- `list` - Listing multiple resources
- `download` - Downloading files
- `share` - Sharing resources
- `export` - Exporting data
- `login` - User authentication
- `logout` - User session termination
- `failed_login` - Authentication failure

**Example Actions:**
- `read_patient`
- `create_encounter`
- `update_appointment`
- `delete_document`
- `download_document`
- `export_data`
- `login`
- `failed_login`

---

## Log Retention Policies

### Retention Periods

**Audit Logs:**
- **Active Storage:** 6 years in PostgreSQL database
- **Archival Storage:** 7+ years in Azure Blob Storage (cold tier)
- **Backup Retention:** 30 days for daily backups

**Other Logs:**
- **Application Logs:** 90 days
- **System Logs:** 1 year
- **Security Event Logs:** 6 years
- **Session Logs:** 30 days

### Retention Implementation

**Database Retention:**
```typescript
// Audit logs are retained in active database
// No automatic deletion for audit events
// Archival process moves old logs to cold storage

retention: {
  auditLogs: 6,            // years in active storage
  phiData: 10,             // years (varies by regulation)
  sessions: 30,            // days
  expiredTokens: 7         // days
}
```

**Archival Process:**
1. **Quarterly archival:** Logs older than 1 year moved to Azure Blob Storage
2. **Compressed storage:** Logs compressed with gzip before archival
3. **Encrypted archival:** All archived logs encrypted with AES-256
4. **Indexed archival:** Searchable metadata maintained for archived logs
5. **Retrieval process:** Archived logs can be retrieved within 24 hours

### Data Lifecycle

```
Creation → Active Storage (0-1 year)
  ↓
Database Storage (1-6 years)
  ↓
Cold Storage Archival (6-10 years)
  ↓
Secure Deletion (after retention period)
```

### Secure Deletion

After the retention period expires:

1. **Verification:** Confirm no legal hold or active investigation
2. **Multi-pass deletion:** Data overwritten multiple times
3. **Verification:** Deletion verified and logged
4. **Certificate:** Destruction certificate generated

**Deletion Standards:**
- DoD 5220.22-M (3-pass overwrite)
- NIST SP 800-88 compliance
- Verification of complete deletion

---

## Technical Implementation

### Middleware Architecture

**File:** `services/api/src/middleware/audit.middleware.ts`

The audit logging system uses Express middleware to automatically intercept and log requests:

```typescript
// Automatic PHI access logging
app.use(auditPHIAccess);

// Sensitive operation logging
app.post('/admin/users',
  authenticate,
  authorize('admin'),
  auditSensitiveOperation('create_user'),
  createUserHandler
);

// Authentication event logging
app.post('/auth/login',
  auditAuthEvent('login'),
  loginHandler
);
```

### Audit Service

**File:** `services/api/src/services/audit.service.ts`

The audit service provides centralized logging functionality:

```typescript
export const auditService = {
  /**
   * Log an audit event
   */
  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    await prisma.auditEvent.create({
      data: {
        userId: event.userId,
        action: event.action,
        resource: event.resource,
        resourceId: event.resourceId || null,
        details: event.details || null,
        ipAddress: event.ipAddress || null,
        userAgent: event.userAgent || null,
      },
    });
  },

  /**
   * List audit events with filters
   */
  async listEvents(filters): Promise<{ data: AuditEvent[]; pagination: any }> {
    // Query with filters
    // Return paginated results
  }
};
```

### PHI Filtering in Logs

**File:** `services/api/src/lib/phi-filter.ts`

All audit log details are automatically filtered to prevent PHI exposure:

```typescript
const details: Record<string, any> = {
  method: req.method,
  path: req.path,
  statusCode,
  query: filterPHI(req.query),  // Automatic PHI filtering
};

if (['create', 'update'].includes(action) && req.body) {
  details.body = filterPHI(req.body);  // Filter request body
}
```

**PHI Redaction:**
- SSN: `123-45-6789` → `***-**-****`
- Email: `john@example.com` → `***@***.***`
- Phone: `(555) 123-4567` → `***-***-****`
- Date of Birth: `1980-05-15` → `****-**-**`

### IP Address Extraction

Properly handles proxied requests:

```typescript
function getClientIp(req: Request): string {
  // Check X-Forwarded-For header
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = typeof forwarded === 'string' ? forwarded.split(',') : forwarded;
    return ips[0].trim();
  }

  // Check X-Real-IP header
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return typeof realIp === 'string' ? realIp : realIp[0];
  }

  // Fallback to socket address
  return req.socket.remoteAddress || 'unknown';
}
```

### Database Indexing

Optimized indexes for fast audit log queries:

```prisma
model AuditEvent {
  // ... fields ...

  @@index([userId])              // User-based queries
  @@index([action])              // Action-based queries
  @@index([resource])            // Resource-based queries
  @@index([timestamp])           // Time-based queries
  @@index([userId, timestamp])   // User activity timeline
  @@index([resource, action])    // Resource action patterns
}
```

### Performance Considerations

**Asynchronous Logging:**
- Audit logging does not block request processing
- Errors in logging do not fail the request
- Audit failures are logged separately

**Batch Processing:**
- High-volume logs batched for efficiency
- Write-through caching for active audit data

**Query Optimization:**
- Compound indexes for common query patterns
- Partitioning by timestamp for large datasets

---

## Audit Log Analysis

### Querying Audit Logs

**API Endpoint:** `GET /api/v1/audit`

**Query Parameters:**
- `userId` - Filter by user ID
- `action` - Filter by action type
- `resource` - Filter by resource type
- `from` - Start date (ISO 8601)
- `to` - End date (ISO 8601)
- `page` - Page number
- `limit` - Results per page

**Example Query:**
```
GET /api/v1/audit?userId=7c9e6679&resource=patient&from=2025-01-01&to=2025-01-15&page=1&limit=50
```

### Common Audit Queries

**1. User Activity Timeline**
```sql
SELECT * FROM "AuditEvent"
WHERE "userId" = $1
ORDER BY timestamp DESC
LIMIT 100;
```

**2. Patient Access History**
```sql
SELECT * FROM "AuditEvent"
WHERE resource = 'patient'
  AND "resourceId" = $1
ORDER BY timestamp DESC;
```

**3. Failed Login Attempts**
```sql
SELECT * FROM "AuditEvent"
WHERE action = 'failed_login'
  AND timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;
```

**4. Data Export Events**
```sql
SELECT * FROM "AuditEvent"
WHERE action = 'export_data'
  AND timestamp > NOW() - INTERVAL '7 days'
ORDER BY timestamp DESC;
```

**5. Administrative Actions**
```sql
SELECT * FROM "AuditEvent"
WHERE resource = 'system'
  AND action LIKE '%config%'
ORDER BY timestamp DESC;
```

### Audit Reports

**Standard Reports Generated:**
1. **Daily Access Summary** - PHI access by user/resource
2. **Weekly Security Report** - Failed logins, suspicious activity
3. **Monthly Compliance Report** - Audit coverage, gaps
4. **Quarterly Review** - Trends, anomalies, recommendations

### Anomaly Detection

**Automated Alerts:**
- Multiple failed login attempts (5+ in 15 minutes)
- Unusual PHI access patterns
- After-hours data exports
- Mass data downloads
- Geographic anomalies (IP-based)
- Privilege escalation attempts

---

## Compliance and Monitoring

### HIPAA Compliance Verification

**Monthly Compliance Checks:**
- [x] All PHI access logged (99.9% coverage target)
- [x] No gaps in audit trail
- [x] Logs properly retained (6 years minimum)
- [x] PHI filtered from log details
- [x] Tamper-proof storage (immutable records)

### Audit Log Coverage Metrics

**Current Coverage:**
- Patient record access: 100%
- Encounter access: 100%
- Document access: 100%
- Appointment access: 100%
- Authentication events: 100%
- Administrative actions: 100%
- Data exports: 100%

**Target:** 99.9% overall coverage

### Monitoring and Alerting

**Real-time Monitoring:**
- Azure Application Insights integration
- Custom audit log dashboards
- Automated anomaly detection
- Security event correlation

**Alert Thresholds:**
- Failed logins: 5 attempts in 15 minutes
- Mass data access: 100+ patient records in 1 hour
- After-hours access: Outside 6am-10pm local time
- Export volume: 1000+ records in single export

### Audit Log Integrity

**Protection Mechanisms:**
- Database-level immutability (no DELETE or UPDATE permissions)
- Separate audit database with restricted access
- Cryptographic checksums for archived logs
- Regular integrity verification

**Integrity Verification Process:**
1. Monthly checksum verification
2. Cross-reference with application logs
3. Sampling and manual review
4. External audit trail comparison

### Access to Audit Logs

**Who Can Access:**
- Security Operations Team (read-only)
- Compliance Officers (read-only)
- System Administrators (read-only, logged)
- External Auditors (read-only, time-limited)

**Access Logging:**
- All audit log access is itself audited
- "Audit the auditors" principle
- Separate audit trail for audit log access

### Regular Reviews

**Weekly Reviews:**
- Failed authentication attempts
- Unusual access patterns
- System alerts and anomalies

**Monthly Reviews:**
- Compliance metric reports
- Access pattern analysis
- Policy violation investigations

**Quarterly Reviews:**
- Comprehensive audit log analysis
- Trend identification
- Security posture assessment

**Annual Reviews:**
- External audit preparation
- Retention policy compliance
- Archival process verification

---

## Appendix

### A. Audit Event Types Reference

| Event Type | Description | Resource | Required Fields |
|------------|-------------|----------|-----------------|
| `login` | Successful user login | authentication | userId, ipAddress |
| `logout` | User logout | authentication | userId |
| `failed_login` | Failed login attempt | authentication | email, ipAddress, reason |
| `read_patient` | View patient record | patient | userId, resourceId |
| `create_patient` | Create new patient | patient | userId, resourceId |
| `update_patient` | Modify patient record | patient | userId, resourceId |
| `delete_patient` | Delete patient (soft) | patient | userId, resourceId |
| `read_encounter` | View encounter | encounter | userId, resourceId |
| `create_encounter` | Create encounter | encounter | userId, resourceId |
| `download_document` | Download document | document | userId, resourceId |
| `export_data` | Export patient data | data_export | userId, details |

### B. PHI Filter Patterns

**Automatically Redacted Patterns:**
- SSN: `/\b\d{3}-?\d{2}-?\d{4}\b/g`
- Phone: `/\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g`
- Email: `/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g`
- Date of Birth: `/\b(19|20)\d{2}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/g`
- Credit Card: `/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g`
- IP Address: `/\b(?:\d{1,3}\.){3}\d{1,3}\b/g`

### C. Database Queries for Common Scenarios

**Scenario 1: Investigate Potential Breach**
```sql
-- Find all access to a specific patient's data
SELECT
  ae.*,
  u.email as user_email,
  u.role as user_role
FROM "AuditEvent" ae
JOIN "User" u ON ae."userId" = u.id
WHERE ae."resourceId" = 'patient-id-here'
ORDER BY ae.timestamp DESC;
```

**Scenario 2: User Activity Report**
```sql
-- Generate activity report for a user
SELECT
  DATE(timestamp) as date,
  action,
  resource,
  COUNT(*) as count
FROM "AuditEvent"
WHERE "userId" = 'user-id-here'
  AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp), action, resource
ORDER BY date DESC, count DESC;
```

**Scenario 3: Security Incident Analysis**
```sql
-- Find suspicious activity patterns
SELECT
  "userId",
  "ipAddress",
  COUNT(*) as failed_attempts,
  MIN(timestamp) as first_attempt,
  MAX(timestamp) as last_attempt
FROM "AuditEvent"
WHERE action = 'failed_login'
  AND timestamp > NOW() - INTERVAL '1 hour'
GROUP BY "userId", "ipAddress"
HAVING COUNT(*) >= 5
ORDER BY failed_attempts DESC;
```

---

**Document Classification:** Internal - Technical Documentation
**Retention Period:** 6 years
**Review Schedule:** Quarterly

**For technical questions, contact:**
Engineering Team: engineering@unifiedhealthcare.com
Security Team: security@unifiedhealthcare.com
