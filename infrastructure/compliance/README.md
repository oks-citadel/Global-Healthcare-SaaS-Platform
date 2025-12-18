# UnifiedHealth Platform - Regional Compliance Infrastructure

This directory contains comprehensive compliance infrastructure for HIPAA (Americas), GDPR (Europe), and POPIA (Africa).

## Overview

The UnifiedHealth Platform implements multi-regional compliance controls to ensure adherence to healthcare data protection regulations worldwide:

- **HIPAA** (Health Insurance Portability and Accountability Act) - United States
- **GDPR** (General Data Protection Regulation) - European Union
- **POPIA** (Protection of Personal Information Act) - South Africa

## Directory Structure

```
infrastructure/compliance/
├── hipaa/                      # HIPAA compliance (Americas)
│   ├── hipaa-controls.tf       # Technical safeguards
│   ├── encryption.tf           # Encryption requirements
│   ├── audit-logging.tf        # 7-year audit retention
│   ├── access-controls.tf      # RBAC policies
│   └── baa-template.md         # Business Associate Agreement
│
├── gdpr/                       # GDPR compliance (Europe)
│   ├── gdpr-controls.tf        # Technical controls
│   ├── data-residency.tf       # EU data residency
│   ├── consent-management.tf   # Consent tracking
│   ├── right-to-deletion.tf    # Data deletion automation
│   └── dpa-template.md         # Data Processing Agreement
│
├── popia/                      # POPIA compliance (Africa)
│   ├── popia-controls.tf       # Technical controls
│   ├── data-residency.tf       # SA data residency
│   ├── consent-management.tf   # Consent requirements
│   └── paia-template.md        # PAIA compliance template
│
└── README.md                   # This file
```

## Compliance Features by Region

### HIPAA (Americas)

**Legal Basis:** 45 CFR Parts 160, 162, and 164

**Key Features:**
- ✅ PHI encryption at rest (AES-256-GCM) and in transit (TLS 1.3)
- ✅ 7-year audit log retention (§ 164.530(j))
- ✅ Role-Based Access Control (RBAC)
- ✅ Business Associate Agreements (BAA)
- ✅ Breach notification within 60 days
- ✅ Administrative, physical, and technical safeguards
- ✅ Minimum necessary principle
- ✅ Emergency access procedures
- ✅ Workstation security

**Terraform Resources:**
- Azure Key Vault with HSM-backed keys (FIPS 140-2 Level 3)
- SQL Server with Transparent Data Encryption (TDE)
- Storage Account with infrastructure encryption
- Log Analytics with 2555-day retention (7 years)
- Private Endpoints for network isolation
- Azure Policy assignments for compliance

**Certifications:**
- HITRUST CSF
- SOC 2 Type II
- ISO 27001

### GDPR (Europe)

**Legal Basis:** Regulation (EU) 2016/679

**Key Features:**
- ✅ EU-only data residency enforcement
- ✅ Consent management (Article 7)
- ✅ Right to access (Article 15)
- ✅ Right to rectification (Article 16)
- ✅ Right to erasure (Article 17)
- ✅ Right to data portability (Article 20)
- ✅ Data breach notification within 72 hours (Article 33)
- ✅ Data Protection Impact Assessment (DPIA)
- ✅ Privacy by design and by default (Article 25)
- ✅ Data Processing Agreements (DPA)

**Terraform Resources:**
- PostgreSQL Flexible Server in EU regions
- Azure Front Door with geo-filtering (EU-only access)
- Event Hub for consent events
- Azure Functions for deletion automation
- Azure Policy for EU region enforcement
- Private DNS zones for network isolation

**Data Subject Rights:**
- 30-day response time for access requests
- Automated deletion workflow
- Machine-readable data export (JSON, CSV)
- Consent withdrawal as easy as granting

### POPIA (Africa)

**Legal Basis:** Act No. 4 of 2013

**Key Features:**
- ✅ South African data residency
- ✅ Information Officer designation
- ✅ Consent management (Section 11)
- ✅ Purpose specification (Section 13)
- ✅ Security safeguards (Section 19)
- ✅ Data subject participation (Section 23-25)
- ✅ PAIA Manual (Promotion of Access to Information Act)
- ✅ Transborder flow restrictions (Section 72)

**Terraform Resources:**
- PostgreSQL Flexible Server in SA regions
- Storage Account with SA residency
- Event Hub for consent tracking
- Log Analytics for audit
- Network Security Groups for geo-restriction

**PAIA Compliance:**
- Information Officer contact details
- Request for access forms
- Fee structure
- Response procedures

## Shared Compliance Package

The `@unifiedhealth/compliance` TypeScript package provides:

### Audit Logger (`auditLogger.ts`)
```typescript
import { AuditLogger, AuditEventType } from '@unifiedhealth/compliance';

const logger = new AuditLogger({
  serviceName: 'api',
  environment: 'production',
  region: 'us-east-1',
  hashSecret: process.env.AUDIT_HASH_SECRET,
  retentionDays: 2555 // 7 years for HIPAA
});

// Log PHI access
await logger.logPHIAccess(
  { userId, ipAddress, userAgent },
  { patientId, recordType: 'health_record', recordId }
);
```

### Consent Manager (`consentManager.ts`)
```typescript
import { ConsentManager, ConsentPurpose } from '@unifiedhealth/compliance';

const consentMgr = new ConsentManager();

// Grant consent
await consentMgr.grantConsent({
  dataSubjectId: userId,
  purpose: ConsentPurpose.HEALTHCARE_SERVICES,
  consentText: 'I consent to...',
  version: '1.0',
  collectionMethod: 'web'
});

// Check consent
const check = await consentMgr.checkConsent(userId, ConsentPurpose.MARKETING);
if (!check.hasConsent) {
  // Deny request
}
```

### Field Encryption (`fieldEncryption.ts`)
```typescript
import { FieldEncryption } from '@unifiedhealth/compliance';

const encryption = new FieldEncryption(process.env.MASTER_KEY);

// Encrypt sensitive fields
const encrypted = encryption.encryptFields(patient, ['ssn', 'dateOfBirth']);

// Decrypt when needed
const decrypted = encryption.decryptFields(encrypted, ['ssn', 'dateOfBirth']);
```

### Data Retention Manager (`dataRetention.ts`)
```typescript
import { DataRetentionManager, RetentionPolicy } from '@unifiedhealth/compliance';

const retention = new DataRetentionManager();

// Check if data should be retained
if (!retention.shouldRetain('health_records', createdAt)) {
  // Schedule for deletion
}
```

### Data Deletion Manager (`dataDeletion.ts`)
```typescript
import { DataDeletionManager } from '@unifiedhealth/compliance';

const deletion = new DataDeletionManager();

// Request deletion (GDPR Article 17)
await deletion.requestDeletion(userId, ['personal_data', 'health_records']);
```

## API Compliance Middleware

The compliance middleware automatically handles regional compliance:

```typescript
import {
  complianceMiddleware,
  phiAccessMiddleware,
  consentVerificationMiddleware,
  gdprMiddleware,
  hipaaMiddleware,
  popiaMiddleware
} from './middleware/compliance.middleware';

// Apply to all routes
app.use(complianceMiddleware(config));

// PHI-specific routes
app.use('/api/v1/patients', phiAccessMiddleware(config));

// Consent verification
app.use(consentVerificationMiddleware(config));

// Regional middleware
app.use('/api/v1/eu/*', gdprMiddleware(config));
app.use('/api/v1/us/*', hipaaMiddleware(config));
app.use('/api/v1/sa/*', popiaMiddleware(config));
```

## Deployment

### Prerequisites

1. Azure subscription with appropriate permissions
2. Terraform >= 1.5.0
3. Azure CLI authenticated

### HIPAA Deployment

```bash
cd infrastructure/compliance/hipaa

terraform init

terraform plan \
  -var="environment=prod" \
  -var="region=eastus" \
  -var="resource_group_name=unifiedhealth-hipaa-rg" \
  -var="dpo_email=dpo@unifiedhealth.com"

terraform apply
```

### GDPR Deployment

```bash
cd infrastructure/compliance/gdpr

terraform init

terraform plan \
  -var="environment=prod" \
  -var="eu_region=westeurope" \
  -var="resource_group_name=unifiedhealth-gdpr-rg" \
  -var="dpo_email=dpo@unifiedhealth.com"

terraform apply
```

### POPIA Deployment

```bash
cd infrastructure/compliance/popia

terraform init

terraform plan \
  -var="environment=prod" \
  -var="sa_region=southafricanorth" \
  -var="resource_group_name=unifiedhealth-popia-rg" \
  -var="information_officer_email=io@unifiedhealth.com"

terraform apply
```

## Configuration

### Environment Variables

```bash
# Compliance Package
AUDIT_HASH_SECRET=your-secret-key-here
MASTER_ENCRYPTION_KEY=your-master-key-here

# Azure
AZURE_KEY_VAULT_URL=https://your-kv.vault.azure.net/
AZURE_STORAGE_CONNECTION_STRING=your-connection-string

# Compliance
ENABLE_HIPAA=true
ENABLE_GDPR=true
ENABLE_POPIA=true
DATA_RESIDENCY_ENFORCEMENT=strict
```

### Application Settings

```typescript
// config/compliance.ts
export const complianceConfig = {
  hipaa: {
    enabled: process.env.ENABLE_HIPAA === 'true',
    auditRetentionDays: 2555, // 7 years
    baaRequired: true
  },
  gdpr: {
    enabled: process.env.ENABLE_GDPR === 'true',
    dataResidency: 'EU',
    consentRequired: true,
    breachNotificationHours: 72
  },
  popia: {
    enabled: process.env.ENABLE_POPIA === 'true',
    dataResidency: 'SA',
    informationOfficer: process.env.POPIA_IO_EMAIL
  }
};
```

## Monitoring and Alerts

### HIPAA Alerts
- Unauthorized PHI access attempts
- Bulk data export (>1000 records)
- Failed login attempts (>5)
- Privilege escalation
- Security incidents

### GDPR Alerts
- Non-EU resource creation attempts
- Data export outside EU
- Consent withdrawal not processed (>15 min)
- Invalid consent detected
- Deletion SLA breach (>30 days)

### POPIA Alerts
- Non-SA resource creation attempts
- Transborder data flow attempts
- Consent violations

## Audit and Compliance Reporting

### Generate Compliance Report

```bash
# HIPAA Audit Report
az monitor log-analytics query \
  --workspace-id $WORKSPACE_ID \
  --analytics-query "AuditLogs | where Compliance == 'HIPAA'" \
  --timespan P7D

# GDPR Data Subject Access Report
az storage blob list \
  --account-name unifiedhealthgdpr \
  --container-name dsr-requests

# POPIA Access Report
az storage table query \
  --account-name unifiedhealthpopia \
  --table-name processingregister
```

## Security Best Practices

1. **Encryption Keys**
   - Rotate encryption keys every 90 days
   - Use HSM-backed keys (FIPS 140-2 Level 3)
   - Store keys in Azure Key Vault
   - Never commit keys to source control

2. **Access Control**
   - Implement least privilege principle
   - Enable MFA for all administrative access
   - Review access permissions quarterly
   - Use Just-in-Time (JIT) access for privileged operations

3. **Network Security**
   - Use Private Endpoints for all services
   - Enable Network Security Groups (NSGs)
   - Implement geo-filtering
   - Block all public access by default

4. **Audit Logging**
   - Enable comprehensive audit logging
   - Monitor logs in real-time
   - Set up alerts for suspicious activity
   - Retain logs per regulatory requirements

5. **Incident Response**
   - Maintain incident response plan
   - Conduct regular DR/BC testing
   - Document all security incidents
   - Notify regulators within required timeframes

## Compliance Checklist

### HIPAA
- [ ] BAA signed with all business associates
- [ ] Annual risk assessment completed
- [ ] Workforce training completed
- [ ] Breach notification procedures tested
- [ ] Audit logs reviewed quarterly
- [ ] Access controls reviewed
- [ ] Encryption verified

### GDPR
- [ ] DPA signed with all data processors
- [ ] DPIA completed for high-risk processing
- [ ] Consent mechanism validated
- [ ] Data subject rights procedures tested
- [ ] Breach notification procedure (72 hours) tested
- [ ] Privacy policy updated
- [ ] Cookie consent implemented

### POPIA
- [ ] Information Officer designated
- [ ] PAIA Manual published
- [ ] Processing register maintained
- [ ] Consent mechanism implemented
- [ ] Data subject rights procedures documented
- [ ] Transborder flow controls verified
- [ ] Security safeguards audited

## Support and Contact

**Data Protection Officer (DPO):** dpo@unifiedhealth.com

**Information Officer (POPIA):** information.officer@unifiedhealth.com

**Security Team:** security@unifiedhealth.com

**Compliance Team:** compliance@unifiedhealth.com

## License

PROPRIETARY - UnifiedHealth Platform, Inc.

## Version History

- **v1.0.0** (2025-12-18) - Initial release
  - HIPAA technical safeguards
  - GDPR data residency and consent management
  - POPIA compliance controls
  - Shared compliance TypeScript package
  - API compliance middleware
