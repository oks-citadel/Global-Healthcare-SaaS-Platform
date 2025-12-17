# Document Endpoints

Endpoints for managing medical documents and files.

## Base Path

All document endpoints are prefixed with `/api/v1/documents`

## Endpoints

### Upload Document

Upload a medical document or file.

```http
POST /api/v1/documents
```

**Authentication:** Required (Bearer token)

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | File | Yes | The file to upload |
| patientId | string | Yes | Patient ID (UUID) |
| category | string | Yes | Document category |
| description | string | No | Document description |
| metadata | string | No | Additional metadata (JSON string) |

**Category Values:**

- `lab-result` - Laboratory test results
- `imaging` - Medical imaging (X-rays, MRI, CT scans)
- `prescription` - Prescriptions
- `insurance` - Insurance documents
- `consent` - Consent forms
- `other` - Other documents

**Example Request (JavaScript):**

```javascript
const formData = new FormData();
formData.append('file', fileBlob);
formData.append('patientId', 'patient-uuid-123');
formData.append('category', 'lab-result');
formData.append('description', 'Blood test results - December 2024');
formData.append('metadata', JSON.stringify({ testType: 'CBC', orderedBy: 'Dr. Smith' }));

const response = await fetch('http://localhost:4000/api/v1/documents', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
  body: formData,
});
```

**Response (201 Created):**

```json
{
  "id": "document-uuid-abc",
  "organizationId": "org-uuid-123",
  "patientId": "patient-uuid-123",
  "uploadedBy": "user-uuid-456",
  "filename": "blood-test-2024-12.pdf",
  "originalFilename": "blood_test_results.pdf",
  "mimeType": "application/pdf",
  "size": 245678,
  "category": "lab-result",
  "description": "Blood test results - December 2024",
  "metadata": {
    "testType": "CBC",
    "orderedBy": "Dr. Smith"
  },
  "storageKey": "documents/org-123/patient-123/doc-abc.enc",
  "encrypted": true,
  "uploadedByUser": {
    "id": "user-uuid-456",
    "firstName": "Dr. John",
    "lastName": "Doe"
  },
  "createdAt": "2024-12-17T12:00:00.000Z",
  "updatedAt": "2024-12-17T12:00:00.000Z"
}
```

**Supported File Types:**

- Documents: PDF, DOC, DOCX, TXT
- Images: JPG, JPEG, PNG, GIF, TIFF
- Medical: DICOM
- Archives: ZIP

**File Size Limits:**

- Maximum file size: 50 MB
- Maximum total storage per organization: Varies by subscription plan

**Error Responses:**

- `400 Bad Request` - Invalid input data or unsupported file type
- `401 Unauthorized` - Authentication required
- `413 Payload Too Large` - File exceeds size limit
- `422 Unprocessable Entity` - Validation error

---

### List Documents

Retrieve a list of documents with optional filters.

```http
GET /api/v1/documents
```

**Authentication:** Required (Bearer token)

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page (max 100) |
| patientId | string | - | Filter by patient ID |
| category | string | - | Filter by category |
| startDate | string | - | Filter by upload date (ISO 8601) |
| endDate | string | - | Filter by upload date (ISO 8601) |

**Example Request:**

```http
GET /api/v1/documents?patientId=patient-123&category=lab-result&page=1&limit=20
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "document-uuid-abc",
      "organizationId": "org-uuid-123",
      "patientId": "patient-uuid-123",
      "uploadedBy": "user-uuid-456",
      "filename": "blood-test-2024-12.pdf",
      "originalFilename": "blood_test_results.pdf",
      "mimeType": "application/pdf",
      "size": 245678,
      "category": "lab-result",
      "description": "Blood test results - December 2024",
      "encrypted": true,
      "uploadedByUser": {
        "id": "user-uuid-456",
        "firstName": "Dr. John",
        "lastName": "Doe"
      },
      "createdAt": "2024-12-17T12:00:00.000Z",
      "updatedAt": "2024-12-17T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 35,
    "totalPages": 2
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions

---

### Get Document

Retrieve document metadata by ID.

```http
GET /api/v1/documents/:id
```

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Document ID (UUID) |

**Response (200 OK):**

```json
{
  "id": "document-uuid-abc",
  "organizationId": "org-uuid-123",
  "patientId": "patient-uuid-123",
  "uploadedBy": "user-uuid-456",
  "filename": "blood-test-2024-12.pdf",
  "originalFilename": "blood_test_results.pdf",
  "mimeType": "application/pdf",
  "size": 245678,
  "category": "lab-result",
  "description": "Blood test results - December 2024",
  "metadata": {
    "testType": "CBC",
    "orderedBy": "Dr. Smith"
  },
  "storageKey": "documents/org-123/patient-123/doc-abc.enc",
  "encrypted": true,
  "uploadedByUser": {
    "id": "user-uuid-456",
    "firstName": "Dr. John",
    "lastName": "Doe",
    "email": "drjohn@example.com"
  },
  "createdAt": "2024-12-17T12:00:00.000Z",
  "updatedAt": "2024-12-17T12:00:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Document not found

---

### Get Document Download URL

Get a pre-signed URL to download a document.

```http
GET /api/v1/documents/:id/download
```

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Document ID (UUID) |

**Response (200 OK):**

```json
{
  "url": "https://storage.example.com/documents/org-123/patient-123/doc-abc.enc?signature=...",
  "expiresAt": "2024-12-17T13:00:00.000Z"
}
```

**Notes:**

- The URL is pre-signed and expires after 1 hour
- The file is automatically decrypted during download
- No authentication is required to access the pre-signed URL

**Error Responses:**

- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Document not found

---

### Delete Document

Delete a document permanently.

```http
DELETE /api/v1/documents/:id
```

**Authentication:** Required (Bearer token)

**Authorization:** Document owner, Provider, or Admin

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Document ID (UUID) |

**Response (204 No Content):**

Empty response body on successful deletion.

**Error Responses:**

- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Document not found

---

### Get Patient Documents

Retrieve all documents for a specific patient.

```http
GET /api/v1/patients/:patientId/documents
```

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| patientId | string | Patient ID (UUID) |

**Response (200 OK):**

```json
[
  {
    "id": "document-uuid-abc",
    "patientId": "patient-uuid-123",
    "uploadedBy": "user-uuid-456",
    "filename": "blood-test-2024-12.pdf",
    "originalFilename": "blood_test_results.pdf",
    "mimeType": "application/pdf",
    "size": 245678,
    "category": "lab-result",
    "description": "Blood test results - December 2024",
    "encrypted": true,
    "createdAt": "2024-12-17T12:00:00.000Z"
  }
]
```

**Error Responses:**

- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Patient not found

---

## SDK Usage Examples

### TypeScript SDK

```typescript
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: 'http://localhost:4000/api/v1',
  accessToken: 'your-access-token',
});

// Upload document
const document = await client.uploadDocument({
  file: fileBlob,
  patientId: 'patient-uuid-123',
  category: 'lab-result',
  description: 'Blood test results - December 2024',
  metadata: {
    testType: 'CBC',
    orderedBy: 'Dr. Smith',
  },
});

console.log('Document uploaded:', document);

// List documents
const documents = await client.listDocuments({
  page: 1,
  limit: 20,
  patientId: 'patient-uuid-123',
  category: 'lab-result',
});

console.log('Found documents:', documents.data);

// Get document metadata
const docMetadata = await client.getDocument(document.id);
console.log('Document metadata:', docMetadata);

// Get download URL
const downloadInfo = await client.getDocumentDownloadUrl(document.id);
console.log('Download URL:', downloadInfo.url);

// Download the file
const response = await fetch(downloadInfo.url);
const blob = await response.blob();
// Save or display the file

// Delete document
await client.deleteDocument(document.id);
console.log('Document deleted');

// Get all documents for a patient
const patientDocs = await client.getPatientDocuments('patient-uuid-123');
console.log('Patient documents:', patientDocs);
```

### JavaScript/Fetch

```javascript
const accessToken = 'your-access-token';

// Upload document
const formData = new FormData();
formData.append('file', fileBlob);
formData.append('patientId', 'patient-uuid-123');
formData.append('category', 'lab-result');
formData.append('description', 'Blood test results');

const uploadResponse = await fetch('http://localhost:4000/api/v1/documents', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
  body: formData,
});

const document = await uploadResponse.json();

// Get download URL
const downloadResponse = await fetch(
  `http://localhost:4000/api/v1/documents/${document.id}/download`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }
);

const downloadInfo = await downloadResponse.json();

// Download the file
const fileResponse = await fetch(downloadInfo.url);
const blob = await fileResponse.blob();

// Create download link
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = document.originalFilename;
a.click();
```

---

## Security & Compliance

### Encryption

- All documents are encrypted at rest using AES-256
- Files are automatically encrypted upon upload
- Decryption happens transparently during download
- Encryption keys are managed securely

### Access Control

- **Patients**: Can upload and view their own documents
- **Providers**: Can upload and view documents for their patients
- **Admins**: Can manage all documents in the organization

### Audit Trail

All document operations are logged:
- Who uploaded the document
- When it was uploaded
- Who accessed/downloaded it
- When it was deleted (if applicable)

### HIPAA Compliance

Documents are handled in compliance with HIPAA:
- Encrypted storage and transmission
- Access controls and audit logs
- Secure deletion (data is overwritten)
- BAA (Business Associate Agreement) in place

---

## Best Practices

### Uploading

1. Use descriptive filenames
2. Add detailed descriptions
3. Categorize documents correctly
4. Include relevant metadata
5. Validate file types before upload

### Organization

1. Use consistent naming conventions
2. Group related documents
3. Add metadata for searchability
4. Regular cleanup of old documents
5. Maintain document versioning

### Access

1. Only grant necessary permissions
2. Use pre-signed URLs for downloads
3. Monitor access patterns
4. Set appropriate expiration times
5. Revoke access when no longer needed

### Performance

1. Compress large files before upload
2. Use batch uploads when possible
3. Implement pagination for listings
4. Cache frequently accessed documents
5. Use CDN for static content

---

## Related Documentation

- [Patient Endpoints](./patients.md)
- [Encounter Endpoints](./encounters.md)
- [Getting Started Guide](../getting-started.md)
