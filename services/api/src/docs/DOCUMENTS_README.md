# Document Management System - README

## Overview

The Document Management System provides HIPAA-compliant document storage and retrieval for the Unified Health Platform. It leverages Azure Blob Storage for scalable, secure, and encrypted document storage.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Application                       │
│                    (Web, Mobile, Desktop)                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API Gateway / Load Balancer                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ JWT Auth
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Document Routes (Express)                     │
│  /api/documents/upload                                          │
│  /api/documents/upload-url                                      │
│  /api/documents/:id/download                                    │
│  /api/documents/:id                                             │
└────────────┬─────────────────────────┬──────────────────────────┘
             │                         │
             │ Metadata                │ File Operations
             ▼                         ▼
┌────────────────────────┐  ┌──────────────────────────────────┐
│  PostgreSQL Database   │  │   Azure Blob Storage Service     │
│  - Document metadata   │  │   - File storage                 │
│  - Patient info        │  │   - Encryption at rest           │
│  - Access control      │  │   - Versioning                   │
│  - Audit logs          │  │   - Soft delete                  │
└────────────────────────┘  └──────────────────────────────────┘
```

## Key Features

### 🔒 Security & Compliance
- **HIPAA-compliant** storage with encryption at rest (AES-256)
- **Encryption in transit** via HTTPS
- **SAS token-based access** for time-limited URLs
- **Role-based access control** (RBAC)
- **Audit logging** for all operations
- **Checksum validation** (SHA-256)

### 📁 Document Management
- **Multiple file types** (PDF, images, DICOM, HL7, FHIR, Office docs)
- **Large file support** (up to 100MB, configurable)
- **Stream-based uploads** for memory efficiency
- **Document versioning**
- **Soft delete** with configurable retention
- **Metadata storage** (patient ID, document type, uploader, etc.)

### 🖼️ Image Processing
- **Automatic thumbnail generation** for images
- **Format conversion** (original → JPEG thumbnail)
- **Optimized compression** for fast loading

### 🚀 Performance
- **Streaming uploads/downloads** for large files
- **Concurrent block uploads** for better throughput
- **CDN-ready** architecture
- **Efficient blob organization** by patient/type

## File Structure

```
services/api/src/
├── lib/
│   └── storage.ts                 # Azure Blob Storage service
├── routes/
│   └── documents.ts              # Document API routes
├── services/
│   └── document.service.ts       # Document business logic
├── controllers/
│   └── document.controller.ts    # Legacy document controller
├── dtos/
│   └── document.dto.ts           # Document validation schemas
└── docs/
    ├── AZURE_STORAGE_SETUP.md    # Setup guide
    ├── MIGRATION_GUIDE.md        # Database migration guide
    └── DOCUMENTS_README.md       # This file
```

## Quick Start

### 1. Prerequisites

- Node.js 18+
- Azure Storage Account
- PostgreSQL database
- Environment variables configured

### 2. Installation

```bash
cd services/api
npm install
```

### 3. Configuration

Copy the example environment file and update with your credentials:

```bash
cp .env.azure.example .env
```

Update the following variables:
```bash
AZURE_STORAGE_CONNECTION_STRING=your-connection-string
AZURE_STORAGE_CONTAINER_NAME=healthcare-documents
MAX_FILE_SIZE=104857600
```

### 4. Database Migration

```bash
npx prisma migrate dev --name add_azure_blob_storage_fields
npx prisma generate
```

### 5. Start the Server

```bash
npm run dev
```

## API Usage Examples

### Upload Document (Direct)

```javascript
const formData = new FormData();
formData.append('file', fileBlob);
formData.append('patientId', 'patient-uuid');
formData.append('type', 'lab_result');
formData.append('description', 'Blood test results');
formData.append('generateThumbnail', 'true');

const response = await fetch('/api/documents/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

const data = await response.json();
console.log('Uploaded:', data.data.documentId);
```

### Upload Document (Presigned URL)

```javascript
// Step 1: Get presigned upload URL
const urlResponse = await fetch('/api/documents/upload-url', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    patientId: 'patient-uuid',
    type: 'imaging',
    fileName: 'xray.jpg',
    mimeType: 'image/jpeg',
  }),
});

const { uploadUrl, documentId, blobName } = (await urlResponse.json()).data;

// Step 2: Upload file directly to Azure
const uploadResponse = await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'x-ms-blob-type': 'BlockBlob',
    'Content-Type': 'image/jpeg',
  },
  body: fileBlob,
});

// Step 3: Complete the upload
await fetch(`/api/documents/${documentId}/complete-upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    blobName,
    fileSize: fileBlob.size,
  }),
});
```

### Download Document

```javascript
// Get download URL
const response = await fetch(`/api/documents/${documentId}/download`, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const { downloadUrl } = (await response.json()).data;

// Download the file
window.location.href = downloadUrl;
// Or for programmatic download:
const blob = await fetch(downloadUrl).then(r => r.blob());
```

### List Documents

```javascript
const response = await fetch(
  `/api/documents?patientId=${patientId}&type=lab_result&page=1&limit=20`,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);

const { data, pagination } = await response.json();
```

### Create Document Version

```javascript
const formData = new FormData();
formData.append('file', updatedFileBlob);

const response = await fetch(`/api/documents/${documentId}/version`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

## Access Control

### Role-Based Permissions

| Role | Upload | View Own | View All | Delete Own | Delete All | Update |
|------|--------|----------|----------|------------|------------|--------|
| Patient | ✅ (own) | ✅ | ❌ | ✅ | ❌ | ✅ (own) |
| Provider | ✅ | ✅ | ✅ | ✅ (uploaded) | ❌ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Example Access Control Check

```typescript
// In routes/documents.ts
async function checkPatientAccess(
  userId: string,
  userRole: string,
  patientId: string
): Promise<void> {
  // Admins and providers have access to all patient documents
  if (userRole === 'admin' || userRole === 'provider') {
    return;
  }

  // Patients can only access their own documents
  if (userRole === 'patient') {
    const userPatient = await patientService.getPatientByUserId(userId);
    if (!userPatient || userPatient.id !== patientId) {
      throw new ForbiddenError('Cannot access documents for other patients');
    }
  }
}
```

## Document Types

The system supports the following document types:

- **lab_result** - Laboratory test results
- **imaging** - X-rays, MRIs, CT scans, etc.
- **prescription** - Medication prescriptions
- **other** - Other medical documents

## Metadata Schema

Each document stores the following metadata:

```typescript
interface DocumentMetadata {
  patientId: string;           // Patient UUID
  documentType: string;         // Document type enum
  uploadedBy: string;           // User UUID who uploaded
  uploadedAt: string;           // ISO timestamp
  description?: string;         // Optional description
  version: string;              // Version number
  encryptionMethod: string;     // "AES-256"
  checksum: string;             // SHA-256 hash
}
```

## Storage Organization

Documents are organized in Azure Blob Storage as:

```
{container-name}/
  {patientId}/
    {documentType}/
      {timestamp}_{random}_{version}_{filename}
```

Example:
```
healthcare-documents/
  550e8400-e29b-41d4-a716-446655440000/
    lab_result/
      1704067200000_a1b2c3d4_v1_blood-test.pdf
      1704067200000_a1b2c3d4_v1_blood-test.pdf_thumbnail.jpg
    imaging/
      1704153600000_e5f6g7h8_v1_xray.jpg
      1704153600000_e5f6g7h8_v1_xray.jpg_thumbnail.jpg
```

## Error Handling

The system provides detailed error messages:

| Error | Status | Description |
|-------|--------|-------------|
| `BadRequestError` | 400 | Invalid file type, size, or parameters |
| `UnauthorizedError` | 401 | Missing or invalid authentication |
| `ForbiddenError` | 403 | Insufficient permissions |
| `NotFoundError` | 404 | Document not found |
| `InternalServerError` | 500 | Upload/download failure |

Example error response:
```json
{
  "success": false,
  "error": {
    "message": "File size exceeds maximum allowed size of 100MB",
    "code": "BAD_REQUEST"
  }
}
```

## Testing

### Unit Tests

```bash
npm run test:unit -- lib/storage.test.ts
```

### Integration Tests

```bash
npm run test:integration -- routes/documents.test.ts
```

### Manual Testing with cURL

```bash
# Upload
curl -X POST http://localhost:8080/api/documents/upload \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "file=@test.pdf" \
  -F "patientId=${PATIENT_ID}" \
  -F "type=lab_result"

# Download
curl -X GET "http://localhost:8080/api/documents/${DOC_ID}/download" \
  -H "Authorization: Bearer ${TOKEN}"

# Delete
curl -X DELETE "http://localhost:8080/api/documents/${DOC_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

## Monitoring & Logging

### Application Logs

All document operations are logged:

```typescript
console.log(`[Document Upload] User: ${userId}, Patient: ${patientId}, Type: ${type}`);
console.log(`[Document Download] User: ${userId}, Document: ${documentId}`);
console.log(`[Document Delete] User: ${userId}, Document: ${documentId}`);
```

### Azure Storage Metrics

Monitor in Azure Portal:
- Request count
- Latency
- Success rate
- Storage capacity
- Egress bandwidth

### Health Checks

Document service health endpoint:

```bash
curl http://localhost:8080/health/documents
```

## Performance Optimization

### Client-Side Optimization

1. **Use presigned URLs** for large files (> 10MB)
2. **Compress images** before upload
3. **Use thumbnails** for previews
4. **Implement pagination** for document lists

### Server-Side Optimization

1. **Stream processing** - Avoid loading entire files in memory
2. **Concurrent uploads** - Upload blocks in parallel
3. **Connection pooling** - Reuse database connections
4. **CDN integration** - Cache frequently accessed documents

### Database Optimization

Indexes are created for common queries:

```sql
CREATE INDEX "Document_patientId_idx" ON "Document"("patientId");
CREATE INDEX "Document_type_idx" ON "Document"("type");
CREATE INDEX "Document_blobName_idx" ON "Document"("blobName");
CREATE INDEX "Document_patientId_type_idx" ON "Document"("patientId", "type");
```

## Security Best Practices

### 1. Environment Variables
- ✅ Store credentials in environment variables
- ✅ Use Azure Key Vault for production
- ❌ Never commit credentials to Git

### 2. Access Control
- ✅ Always validate user permissions
- ✅ Use SAS tokens with minimal permissions
- ✅ Set short expiry times (15 min for upload, 1 hour for download)

### 3. Input Validation
- ✅ Validate file types and sizes
- ✅ Sanitize file names
- ✅ Validate patient IDs

### 4. Encryption
- ✅ Use HTTPS for all requests
- ✅ Enable encryption at rest in Azure
- ✅ Verify checksums

## Troubleshooting

### Upload Fails

**Problem:** "File too large"
- **Solution:** Increase `MAX_FILE_SIZE` or reduce file size

**Problem:** "Invalid MIME type"
- **Solution:** Check file type is in `ALLOWED_MIME_TYPES`

### Download Fails

**Problem:** "SAS token expired"
- **Solution:** Generate new download URL

**Problem:** "Blob not found"
- **Solution:** Verify `blobName` in database matches Azure

### Connection Issues

**Problem:** "Cannot connect to Azure Storage"
- **Solution:** Verify connection string and firewall rules

## FAQ

**Q: What is the maximum file size?**
A: 100MB by default, configurable via `MAX_FILE_SIZE`

**Q: Are files encrypted?**
A: Yes, Azure Storage provides AES-256 encryption at rest

**Q: How long are download URLs valid?**
A: 1 hour by default, configurable per request

**Q: Can I recover deleted documents?**
A: Yes, if soft delete is enabled (default 30-day retention)

**Q: Does it support DICOM images?**
A: Yes, DICOM is a supported MIME type

**Q: How do I enable virus scanning?**
A: Integrate with Microsoft Defender for Cloud or ClamAV (see setup guide)

## Support

For issues or questions:
1. Check the [Azure Storage Setup Guide](./AZURE_STORAGE_SETUP.md)
2. Review the [Migration Guide](./MIGRATION_GUIDE.md)
3. Check application logs
4. Contact the development team

## License

This implementation is part of the Unified Health Platform and follows the project's license terms.
