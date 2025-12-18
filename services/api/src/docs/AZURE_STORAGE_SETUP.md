# Azure Blob Storage Integration - HIPAA-Compliant Document Management

## Overview

This document provides comprehensive instructions for setting up and using the Azure Blob Storage integration for the Unified Healthcare Platform. The implementation is designed to be HIPAA-compliant and production-ready.

## Features

### Core Functionality
- **Stream-based uploads** for large files (up to 100MB by default)
- **Content type validation** (PDF, images, medical documents, HL7, FHIR)
- **Configurable file size limits**
- **Virus scanning integration** (placeholder for third-party integration)
- **Signed URLs** for time-limited secure access (SAS tokens)
- **Soft-delete support** with configurable retention
- **Rich metadata storage** (patient ID, document type, uploader, timestamps)
- **HIPAA-compliant encryption at rest** (AES-256)
- **Container organization** by patient ID and document type
- **Thumbnail generation** for images
- **Document versioning support**

### Security & Compliance
- **Private blob access** - All documents require SAS tokens
- **Encryption at rest** - Azure Storage Service Encryption (SSE) with AES-256
- **Encryption in transit** - HTTPS only
- **Access control** - Role-based access control (RBAC)
- **Audit logging** - All operations logged
- **Checksum validation** - SHA-256 checksums for data integrity

## Prerequisites

1. **Azure Account** with an active subscription
2. **Azure Storage Account** with Blob Storage enabled
3. **Node.js** v18+ and npm/pnpm
4. **PostgreSQL** database (for metadata storage)

## Azure Setup

### 1. Create Azure Storage Account

```bash
# Using Azure CLI
az storage account create \
  --name healthcarestorageacct \
  --resource-group healthcare-rg \
  --location eastus \
  --sku Standard_GRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false \
  --https-only true
```

### 2. Enable Blob Versioning (Recommended)

```bash
az storage account blob-service-properties update \
  --account-name healthcarestorageacct \
  --enable-versioning true
```

### 3. Enable Soft Delete

```bash
az storage account blob-service-properties update \
  --account-name healthcarestorageacct \
  --enable-delete-retention true \
  --delete-retention-days 30
```

### 4. Configure CORS (if needed for direct browser uploads)

```bash
az storage cors add \
  --methods GET POST PUT \
  --origins https://yourdomain.com \
  --allowed-headers '*' \
  --exposed-headers '*' \
  --max-age 3600 \
  --services b \
  --account-name healthcarestorageacct
```

### 5. Get Connection String

```bash
# Method 1: Get connection string
az storage account show-connection-string \
  --name healthcarestorageacct \
  --resource-group healthcare-rg

# Method 2: Get account key (for SAS token generation)
az storage account keys list \
  --account-name healthcarestorageacct \
  --resource-group healthcare-rg
```

## Environment Configuration

Create or update your `.env` file:

```bash
# Azure Storage Configuration
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=healthcarestorageacct;AccountKey=your-key-here;EndpointSuffix=core.windows.net"

# OR use separate credentials
AZURE_STORAGE_ACCOUNT_NAME=healthcarestorageacct
AZURE_STORAGE_ACCOUNT_KEY=your-account-key-here

# Container name (will be created automatically)
AZURE_STORAGE_CONTAINER_NAME=healthcare-documents

# File size limits (in bytes)
MAX_FILE_SIZE=104857600  # 100MB
```

### Environment Variables Explained

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `AZURE_STORAGE_CONNECTION_STRING` | Yes* | Full connection string | - |
| `AZURE_STORAGE_ACCOUNT_NAME` | Yes* | Storage account name | - |
| `AZURE_STORAGE_ACCOUNT_KEY` | Yes* | Storage account key | - |
| `AZURE_STORAGE_CONTAINER_NAME` | No | Container for documents | `healthcare-documents` |
| `MAX_FILE_SIZE` | No | Max file size in bytes | `104857600` (100MB) |

\* Either provide `CONNECTION_STRING` OR both `ACCOUNT_NAME` and `ACCOUNT_KEY`

## Installation

### 1. Install Dependencies

```bash
cd services/api
npm install

# Or using pnpm
pnpm install
```

The following packages will be installed:
- `@azure/storage-blob` - Azure Blob Storage SDK
- `multer` - Multipart form data handling
- `sharp` - Image processing for thumbnails

### 2. Update Database Schema

```bash
# Generate Prisma migration
npx prisma migrate dev --name add_document_blob_fields

# Or in production
npx prisma migrate deploy
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

## API Endpoints

### Upload Document (Multipart)

**POST** `/api/documents/upload`

Upload a document directly with multipart/form-data.

```bash
curl -X POST https://api.yourplatform.com/api/documents/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "patientId=uuid-here" \
  -F "type=lab_result" \
  -F "description=Lab results from 2024" \
  -F "generateThumbnail=true"
```

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "documentId": "doc-uuid",
    "blobName": "patient-id/lab_result/timestamp_random_filename.pdf",
    "url": "https://account.blob.core.windows.net/container/blob",
    "thumbnailUrl": "https://account.blob.core.windows.net/container/blob_thumbnail.jpg",
    "size": 1024000,
    "contentType": "application/pdf",
    "etag": "0x8D...",
    "versionId": "2024-01-01T00:00:00.0000000Z",
    "metadata": {
      "patientId": "patient-uuid",
      "documentType": "lab_result",
      "uploadedBy": "user-uuid",
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "encryptionMethod": "AES-256",
      "checksum": "sha256-hash",
      "version": "1"
    }
  }
}
```

### Generate Upload URL (Presigned)

**POST** `/api/documents/upload-url`

Generate a presigned URL for direct client-side upload.

```bash
curl -X POST https://api.yourplatform.com/api/documents/upload-url \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid",
    "type": "imaging",
    "fileName": "xray.jpg",
    "mimeType": "image/jpeg"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "doc-uuid",
    "uploadUrl": "https://account.blob.core.windows.net/container/blob?sv=2021-08-06&...",
    "blobName": "patient-id/imaging/timestamp_random_xray.jpg",
    "expiresAt": "2024-01-01T00:15:00.000Z",
    "instructions": {
      "method": "PUT",
      "headers": {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": "image/jpeg"
      },
      "note": "Upload the file to this URL using a PUT request with the file content in the body"
    }
  }
}
```

**Client-side upload example:**
```javascript
const response = await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'x-ms-blob-type': 'BlockBlob',
    'Content-Type': 'image/jpeg',
  },
  body: fileBlob,
});

// After successful upload, complete the upload
await fetch(`/api/documents/${documentId}/complete-upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    blobName: blobName,
    fileSize: fileBlob.size,
  }),
});
```

### Generate Download URL

**GET** `/api/documents/:id/download?expiryMinutes=60`

Generate a secure download URL with SAS token.

```bash
curl -X GET "https://api.yourplatform.com/api/documents/doc-uuid/download?expiryMinutes=60" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "doc-uuid",
    "downloadUrl": "https://account.blob.core.windows.net/container/blob?sv=2021-08-06&...",
    "fileName": "document.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "expiresAt": "2024-01-01T01:00:00.000Z"
  }
}
```

### Get Thumbnail

**GET** `/api/documents/:id/thumbnail`

Get thumbnail URL for image documents.

```bash
curl -X GET https://api.yourplatform.com/api/documents/doc-uuid/thumbnail \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### List Documents

**GET** `/api/documents?patientId=uuid&type=lab_result&page=1&limit=20`

```bash
curl -X GET "https://api.yourplatform.com/api/documents?patientId=patient-uuid&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Document Metadata

**PATCH** `/api/documents/:id`

```bash
curl -X PATCH https://api.yourplatform.com/api/documents/doc-uuid \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description",
    "type": "prescription"
  }'
```

### Delete Document

**DELETE** `/api/documents/:id?permanent=false`

```bash
# Soft delete (recoverable within retention period)
curl -X DELETE https://api.yourplatform.com/api/documents/doc-uuid \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Permanent delete
curl -X DELETE "https://api.yourplatform.com/api/documents/doc-uuid?permanent=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Document Version

**POST** `/api/documents/:id/version`

Upload a new version of an existing document.

```bash
curl -X POST https://api.yourplatform.com/api/documents/doc-uuid/version \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/updated-document.pdf"
```

### Get Patient Storage Statistics

**GET** `/api/patients/:patientId/documents/stats`

```bash
curl -X GET https://api.yourplatform.com/api/documents/patients/patient-uuid/documents/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSize": 52428800,
    "fileCount": 15,
    "documentTypes": {
      "lab_result": 5,
      "imaging": 7,
      "prescription": 3
    }
  }
}
```

## Allowed MIME Types

### Medical Documents
- `application/pdf`
- `application/dicom`
- `text/plain`
- `application/json`
- `application/xml`
- `application/hl7-v2`
- `application/fhir+json`
- `application/fhir+xml`

### Images
- `image/jpeg`
- `image/png`
- `image/dicom`
- `image/tiff`
- `image/bmp`
- `image/gif`

### Office Documents
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (.xlsx)
- `application/msword` (.doc)
- `application/vnd.ms-excel` (.xls)

## Document Organization

Documents are organized in Azure Blob Storage using the following structure:

```
container-name/
├── patient-uuid-1/
│   ├── lab_result/
│   │   ├── 1704067200000_a1b2c3d4_blood-test.pdf
│   │   ├── 1704067200000_a1b2c3d4_blood-test.pdf_thumbnail.jpg
│   │   └── 1704067200000_a1b2c3d4_blood-test_v2.pdf
│   ├── imaging/
│   │   ├── 1704153600000_e5f6g7h8_xray.jpg
│   │   └── 1704153600000_e5f6g7h8_xray.jpg_thumbnail.jpg
│   └── prescription/
│       └── 1704240000000_i9j0k1l2_medication.pdf
└── patient-uuid-2/
    └── ...
```

**Naming Convention:**
`{patientId}/{documentType}/{timestamp}_{random}_{version}_{filename}`

## Security Best Practices

### 1. Network Security
- **Always use HTTPS** for all API calls
- **Enable CORS** only for trusted origins
- **Use Private Endpoints** for VNet integration (enterprise)

### 2. Access Control
- **Use SAS tokens** with minimal permissions and short expiry
- **Implement RBAC** at the storage account level
- **Rotate access keys** regularly (every 90 days)

### 3. Data Protection
- **Enable blob versioning** for data recovery
- **Configure soft delete** with appropriate retention period
- **Enable encryption at rest** (enabled by default)
- **Use Azure Key Vault** for key management (optional)

### 4. Monitoring & Auditing
- **Enable Azure Monitor** for storage metrics
- **Configure diagnostic logging**
- **Set up alerts** for unusual activity
- **Review access logs** regularly

### 5. Compliance
- **Sign BAA** (Business Associate Agreement) with Microsoft
- **Enable Azure Security Center**
- **Implement data residency** requirements
- **Document security controls** for audits

## Virus Scanning Integration

The implementation includes a placeholder for virus scanning. To integrate with a real antivirus service:

### Option 1: Microsoft Defender for Cloud
```typescript
// In storage.ts, update scanForViruses method
import { DefenderForCloud } from '@azure/defender-for-cloud';

async scanForViruses(blobName: string): Promise<{ clean: boolean; threats?: string[] }> {
  const defender = new DefenderForCloud(process.env.AZURE_SUBSCRIPTION_ID);
  const result = await defender.scanBlob(CONTAINER_NAME, blobName);

  return {
    clean: result.status === 'clean',
    threats: result.threats,
  };
}
```

### Option 2: ClamAV (Open Source)
Deploy ClamAV as a containerized service and integrate:

```typescript
async scanForViruses(blobName: string): Promise<{ clean: boolean; threats?: string[] }> {
  const clamav = new ClamAVClient(process.env.CLAMAV_URL);
  const stream = await this.containerClient.getBlockBlobClient(blobName).download();

  const result = await clamav.scanStream(stream.readableStreamBody);

  return {
    clean: result.isClean,
    threats: result.viruses,
  };
}
```

## Troubleshooting

### Connection Issues

**Error:** "Azure Storage credentials not configured"
```bash
# Verify environment variables are set
echo $AZURE_STORAGE_CONNECTION_STRING
# or
echo $AZURE_STORAGE_ACCOUNT_NAME
echo $AZURE_STORAGE_ACCOUNT_KEY
```

### Permission Issues

**Error:** "AuthorizationPermissionMismatch"
```bash
# Check storage account access
az storage account show \
  --name healthcarestorageacct \
  --resource-group healthcare-rg

# Verify RBAC roles
az role assignment list \
  --assignee your-user-or-sp-id \
  --scope /subscriptions/{subscription-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}
```

### Upload Failures

**Error:** "File too large"
- Check `MAX_FILE_SIZE` environment variable
- Verify Azure Storage account limits

**Error:** "Invalid MIME type"
- Check `ALLOWED_MIME_TYPES` in `storage.ts`
- Ensure file extension matches content type

## Performance Optimization

### 1. Enable CDN
Use Azure CDN for frequently accessed files:

```bash
az cdn endpoint create \
  --name healthcare-docs-cdn \
  --profile-name healthcare-cdn \
  --resource-group healthcare-rg \
  --origin healthcarestorageacct.blob.core.windows.net
```

### 2. Use Premium Storage
For high-performance requirements:

```bash
az storage account create \
  --name healthcarepremium \
  --resource-group healthcare-rg \
  --sku Premium_LRS \
  --kind BlockBlobStorage
```

### 3. Optimize Thumbnail Generation
Configure Sharp for better performance:

```typescript
// In storage.ts
const thumbnail = await sharp(buffer)
  .resize(300, 300, {
    fit: 'inside',
    withoutEnlargement: true,
  })
  .jpeg({
    quality: 80,
    progressive: true, // Enable progressive JPEG
    mozjpeg: true,     // Use mozjpeg for better compression
  })
  .toBuffer();
```

## Cost Optimization

### 1. Use Lifecycle Management
Automatically transition old documents to cool/archive storage:

```json
{
  "rules": [
    {
      "enabled": true,
      "name": "archive-old-documents",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "baseBlob": {
            "tierToCool": { "daysAfterModificationGreaterThan": 90 },
            "tierToArchive": { "daysAfterModificationGreaterThan": 365 }
          }
        },
        "filters": {
          "blobTypes": ["blockBlob"]
        }
      }
    }
  ]
}
```

### 2. Monitor Costs
```bash
az consumption usage list \
  --start-date 2024-01-01 \
  --end-date 2024-01-31 \
  --query "[?contains(instanceName, 'healthcarestorageacct')]"
```

## Testing

### Unit Tests
```bash
cd services/api
npm run test:unit -- lib/storage.test.ts
```

### Integration Tests
```bash
# Set test environment variables
export AZURE_STORAGE_CONNECTION_STRING="UseDevelopmentStorage=true"  # For Azurite
npm run test:integration -- routes/documents.test.ts
```

### Using Azurite (Local Development)
```bash
# Install Azurite
npm install -g azurite

# Start Azurite
azurite --silent --location /tmp/azurite --debug /tmp/azurite/debug.log

# Update .env for local testing
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"
```

## Support & Resources

- [Azure Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/)
- [HIPAA on Azure](https://docs.microsoft.com/en-us/azure/compliance/offerings/offering-hipaa-us)
- [Azure Blob Storage SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob)

## License

This implementation is part of the Unified Healthcare Platform and follows the project's license terms.
