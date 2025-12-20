# Azure Blob Storage Integration - Document Management

This document provides comprehensive information about the Azure Blob Storage integration for secure, HIPAA-compliant document management in the Global Healthcare SaaS Platform.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Configuration](#configuration)
5. [Architecture](#architecture)
6. [API Reference](#api-reference)
7. [Security](#security)
8. [Virus Scanning](#virus-scanning)
9. [Lifecycle Policies](#lifecycle-policies)
10. [CORS Configuration](#cors-configuration)
11. [Error Handling & Retry Logic](#error-handling--retry-logic)
12. [Testing](#testing)
13. [Production Deployment](#production-deployment)
14. [Troubleshooting](#troubleshooting)

## Overview

The Azure Blob Storage integration provides secure, scalable document storage for healthcare documents including medical records, DICOM images, lab results, and more. The implementation follows HIPAA compliance requirements and healthcare industry best practices.

### Key Components

- **storage.ts**: Core Azure Blob Storage service with comprehensive document management
- **document.service.ts**: Business logic layer for document operations
- Virus scanning integration (ClamAV and Azure Defender)
- SAS token generation for secure, time-limited access
- Automatic retry logic for transient failures
- Lifecycle management and archival policies

## Features

### Document Management
- Stream-based upload for large files (up to 100MB)
- Direct client upload using pre-signed URLs
- Secure download with time-limited access
- Soft delete with recovery support
- Document versioning
- Thumbnail generation for images
- Metadata storage and tagging

### Security
- SAS tokens with time limits (15 min upload, 1 hour download)
- HTTPS-only access
- IP restrictions (optional)
- Virus scanning before download
- Quarantine mechanism for infected files
- Audit logging for all operations
- Content type validation
- File size validation

### Performance & Reliability
- Exponential backoff retry logic
- Configurable retry attempts
- Transient failure detection
- Stream-based processing for large files
- Connection pooling and reuse

### HIPAA Compliance
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.2+)
- 7-year retention policies
- Audit trails for all operations
- Access controls and authorization
- Data segregation by patient

## Prerequisites

### Azure Resources

1. **Azure Storage Account**
   - Standard or Premium tier
   - Hot access tier recommended
   - Blob versioning enabled
   - Soft delete enabled (30-day retention)
   - Encryption at rest enabled (default)

2. **Azure Defender for Storage** (Optional but Recommended)
   - Malware scanning
   - Threat detection
   - Activity monitoring

3. **ClamAV Server** (Alternative to Azure Defender)
   - Self-hosted or cloud-hosted
   - Network accessible from API server

### Node.js Dependencies

All required dependencies are already included in package.json:
- `@azure/storage-blob`: ^12.17.0
- `sharp`: ^0.33.2 (for thumbnail generation)

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# Azure Blob Storage - Connection String (Recommended)
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=YOUR_ACCOUNT;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net

# OR use Account Name and Key
# AZURE_STORAGE_ACCOUNT_NAME=healthcarestorageacct
# AZURE_STORAGE_ACCOUNT_KEY=your-account-key-here

# Container Configuration
AZURE_STORAGE_CONTAINER_NAME=healthcare-documents

# File Upload Limits
MAX_FILE_SIZE=104857600  # 100MB

# SAS Token Configuration
SAS_ALLOWED_IP_RANGE=  # Optional: e.g., 10.0.0.0/24

# Retry Configuration
STORAGE_MAX_RETRIES=3
STORAGE_RETRY_DELAY=1000  # milliseconds
STORAGE_RETRY_BACKOFF=2  # multiplier

# Virus Scanning
CLAMAV_ENABLED=false
CLAMAV_HOST=localhost
CLAMAV_PORT=3310

AZURE_DEFENDER_ENABLED=false
```

### Getting Azure Credentials

#### Option 1: Azure Portal
1. Navigate to https://portal.azure.com
2. Go to your Storage Account
3. Click "Access keys" in the left menu
4. Copy the Connection String

#### Option 2: Azure CLI
```bash
az storage account show-connection-string \
  --name healthcarestorageacct \
  --resource-group healthcare-rg
```

#### Option 3: Local Development with Azurite
```bash
# Install Azurite
npm install -g azurite

# Start Azurite
azurite --silent --location /tmp/azurite

# Use this connection string
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;
```

## Architecture

### Storage Organization

Documents are organized hierarchically:
```
{container-name}/
├── {patient-id}/
│   ├── {document-type}/
│   │   ├── {timestamp}_{random}_{filename}
│   │   └── {timestamp}_{random}_{filename}_thumbnail.jpg
│   └── ...
└── ...

{container-name}-quarantine/
└── {timestamp}_{original-blob-path}
```

### Flow Diagram

#### Upload Flow
```
Client → API (generateUploadUrl) → SAS Token
Client → Azure Blob (direct upload) → Document stored
Client → API (updateDocumentUrl) → Database updated
API → Virus Scan → Clean/Quarantine
```

#### Download Flow
```
Client → API (generateDownloadUrl) → Virus scan check
API → Azure Blob (SAS token) → Temporary URL
Client → Azure Blob (direct download) → Document delivered
```

## API Reference

### Generate Upload URL

```typescript
const result = await documentService.generateUploadUrl(
  documentId,
  fileName,
  mimeType,
  fileSize  // optional
);

// Returns:
{
  uploadUrl: string,      // Pre-signed URL for upload
  blobName: string,       // Blob identifier
  expiresAt: string       // ISO 8601 timestamp
}
```

### Generate Download URL

```typescript
const result = await documentService.generateDownloadUrl(
  documentId,
  expiryMinutes  // optional, default: 60
);

// Returns:
{
  downloadUrl: string,    // Pre-signed URL for download
  expiresAt: string       // ISO 8601 timestamp
}
```

### Delete Document

```typescript
await documentService.deleteDocument(
  documentId,
  requesterId,
  hardDelete  // optional, default: false (soft delete)
);
```

### Direct Storage Service Usage

```typescript
import { azureStorageService } from '../lib/storage.js';

// Upload with stream
const result = await azureStorageService.uploadDocument(stream, {
  patientId: 'patient-123',
  documentType: 'lab-result',
  fileName: 'bloodwork.pdf',
  mimeType: 'application/pdf',
  fileSize: 1024000,
  uploadedBy: 'user-456',
  generateThumbnail: false
});

// Scan for viruses
const scanResult = await azureStorageService.scanForViruses(blobName);

// Get patient storage stats
const stats = await azureStorageService.getPatientStorageStats(patientId);
```

## Security

### SAS Token Security

**Upload Tokens:**
- Validity: 15 minutes
- Permissions: Create + Write only
- Protocol: HTTPS only
- Content type enforcement
- Optional IP restrictions

**Download Tokens:**
- Validity: 1 hour (configurable)
- Permissions: Read only
- Protocol: HTTPS only
- Virus scan verification
- Optional IP restrictions

### Access Control

All document operations enforce authorization:
- Document access requires patient relationship
- Delete operations limited to uploader or admin
- Audit logging for compliance
- Role-based access control (RBAC)

### Encryption

- **At Rest**: AES-256 (Azure Storage default)
- **In Transit**: TLS 1.2+
- **Key Management**: Azure Key Vault integration available

## Virus Scanning

### ClamAV Integration

1. **Install ClamAV**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install clamav clamav-daemon

   # macOS
   brew install clamav

   # Start daemon
   sudo systemctl start clamav-daemon
   ```

2. **Configure**
   ```bash
   CLAMAV_ENABLED=true
   CLAMAV_HOST=localhost
   CLAMAV_PORT=3310
   ```

3. **How it Works**
   - Document is streamed to ClamAV
   - INSTREAM command used for scanning
   - Infected files moved to quarantine
   - Clean files allowed for download

### Azure Defender for Storage

1. **Enable in Azure Portal**
   - Navigate to Storage Account
   - Security → Defender for Cloud
   - Enable Microsoft Defender for Storage

2. **Configure**
   ```bash
   AZURE_DEFENDER_ENABLED=true
   ```

3. **How it Works**
   - Azure automatically scans uploaded blobs
   - Results stored in blob metadata
   - API checks metadata before download
   - Quarantine infected files automatically

### Quarantine Process

Infected files are:
1. Moved to `{container}-quarantine` container
2. Prefixed with timestamp
3. Tagged with threat information
4. Automatically deleted after 90 days (configurable)
5. Logged for security audit

## Lifecycle Policies

### Recommended Policies

The system provides recommended lifecycle policies:

```typescript
const policies = azureStorageService.getLifecyclePolicyRecommendations();
```

**Policy 1: Archive Old Documents**
- Move to Cool tier: 90 days after modification
- Move to Archive tier: 180 days after modification

**Policy 2: HIPAA Retention**
- Delete documents: 7 years (2555 days) after modification
- Delete snapshots: 90 days after creation

**Policy 3: Quarantine Cleanup**
- Delete quarantined files: 90 days after quarantine

### Applying Policies

#### Azure Portal
1. Storage Account → Data management → Lifecycle management
2. Add rule → Set conditions and actions

#### Azure CLI
```bash
az storage account management-policy create \
  --account-name healthcarestorageacct \
  --policy @lifecycle-policy.json
```

#### Sample Policy JSON
```json
{
  "rules": [
    {
      "enabled": true,
      "name": "moveToArchiveAfter90Days",
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["healthcare-documents/"]
        },
        "actions": {
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 90
            }
          }
        }
      }
    }
  ]
}
```

## CORS Configuration

Configure CORS for direct client uploads:

```typescript
await azureStorageService.configureCORS([
  'https://app.yourdomain.com',
  'https://admin.yourdomain.com'
]);
```

**CORS Settings:**
- Allowed Origins: Specified domains only
- Allowed Methods: GET, PUT, POST, DELETE, HEAD, OPTIONS
- Allowed Headers: Content-Type, Content-Length, Blob metadata
- Exposed Headers: Request ID, Version, ETag
- Max Age: 1 hour

## Error Handling & Retry Logic

### Automatic Retry

The service automatically retries transient failures:

**Retryable Errors:**
- HTTP 408, 429, 500, 502, 503, 504
- Network timeouts
- Connection failures
- Service unavailable

**Configuration:**
```bash
STORAGE_MAX_RETRIES=3        # Default: 3
STORAGE_RETRY_DELAY=1000     # Default: 1000ms
STORAGE_RETRY_BACKOFF=2      # Default: 2x
```

**Backoff Strategy:**
- Attempt 1: Immediate
- Attempt 2: 1 second delay
- Attempt 3: 2 second delay
- Attempt 4: 4 second delay

### Error Codes

| Error | Description | Retry? |
|-------|-------------|--------|
| `NotFoundError` | Blob not found | No |
| `BadRequestError` | Invalid parameters | No |
| `ForbiddenError` | Access denied | No |
| `InternalServerError` | Storage failure | Yes |
| `RequestTimeout` | Network timeout | Yes |
| `ServiceUnavailable` | Azure service down | Yes |

## Testing

### Unit Tests

```typescript
import { azureStorageService } from '../lib/storage';

describe('Azure Storage Service', () => {
  it('should generate upload URL', async () => {
    const result = await azureStorageService.generateUploadUrl(
      'patient-123',
      'lab-result',
      'test.pdf',
      'application/pdf'
    );

    expect(result.uploadUrl).toContain('sig=');
    expect(result.blobName).toContain('patient-123');
  });
});
```

### Integration Tests

```bash
# Set up test environment
export AZURE_STORAGE_CONNECTION_STRING="UseDevelopmentStorage=true"

# Start Azurite
azurite --silent --location /tmp/azurite-test

# Run tests
npm run test:integration
```

### Manual Testing

```bash
# Generate upload URL
curl -X POST http://localhost:8080/api/documents/{id}/upload-url \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.pdf","mimeType":"application/pdf"}'

# Upload file directly to Azure
curl -X PUT "$UPLOAD_URL" \
  -H "x-ms-blob-type: BlockBlob" \
  -H "Content-Type: application/pdf" \
  --data-binary @test.pdf

# Generate download URL
curl -X GET http://localhost:8080/api/documents/{id}/download-url \
  -H "Authorization: Bearer $TOKEN"
```

## Production Deployment

### Checklist

- [ ] Azure Storage Account created with encryption enabled
- [ ] Blob versioning enabled
- [ ] Soft delete enabled (30-day retention minimum)
- [ ] Network security rules configured
- [ ] Private endpoints configured (if required)
- [ ] Azure Defender for Storage enabled
- [ ] Lifecycle policies configured
- [ ] CORS configured for production domains
- [ ] Monitoring and alerts configured
- [ ] Backup strategy implemented
- [ ] Disaster recovery plan documented

### Azure Storage Configuration

```bash
# Create storage account
az storage account create \
  --name healthcarestorageacct \
  --resource-group healthcare-rg \
  --location eastus \
  --sku Standard_GRS \
  --encryption-services blob \
  --https-only true \
  --min-tls-version TLS1_2

# Enable versioning
az storage account blob-service-properties update \
  --account-name healthcarestorageacct \
  --enable-versioning true

# Enable soft delete
az storage blob service-properties delete-policy update \
  --account-name healthcarestorageacct \
  --enable true \
  --days-retained 30
```

### Monitoring

**Key Metrics to Monitor:**
- Blob storage capacity
- Transaction count and errors
- Latency (E2E and server)
- Availability
- Malware detection events
- Failed uploads/downloads

**Azure Monitor Alerts:**
- High error rate (> 1%)
- High latency (> 2 seconds)
- Malware detected
- Storage capacity > 80%

## Troubleshooting

### Common Issues

**Issue: "Azure Storage credentials not configured"**
- Solution: Set `AZURE_STORAGE_CONNECTION_STRING` or both `AZURE_STORAGE_ACCOUNT_NAME` and `AZURE_STORAGE_ACCOUNT_KEY`

**Issue: "Container not found"**
- Solution: Container is created automatically. Check storage account permissions.

**Issue: "Upload fails with 403 Forbidden"**
- Solution: Check SAS token expiration and permissions. Verify CORS configuration.

**Issue: "Virus scan fails"**
- Solution: Check ClamAV is running (`systemctl status clamav-daemon`). Verify network connectivity.

**Issue: "Download URL returns 404"**
- Solution: Ensure document was uploaded successfully. Check blob exists in Azure Portal.

### Debug Logging

Enable debug logging:

```bash
LOG_LEVEL=debug
```

View logs:
```bash
# Development
tail -f logs/combined.log

# Production
az monitor log-analytics query \
  --workspace healthcare-logs \
  --analytics-query "traces | where message contains 'Azure'"
```

### Support Resources

- **Azure Support**: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade
- **Documentation**: https://docs.microsoft.com/azure/storage/blobs/
- **Stack Overflow**: Tag with `azure-blob-storage`
- **Internal Support**: support@yourdomain.com

## License

Copyright 2024 Global Healthcare. All rights reserved.
