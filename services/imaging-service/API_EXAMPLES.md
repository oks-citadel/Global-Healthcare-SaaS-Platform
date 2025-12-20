# Imaging Service API Examples

This document provides example API requests and responses for the Imaging Service.

## Authentication

All API requests require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Imaging Orders

### Create Imaging Order

**Request:**
```http
POST /api/imaging-orders
Content-Type: application/json

{
  "patientId": "patient-123",
  "providerId": "provider-456",
  "facilityId": "facility-789",
  "priority": "ROUTINE",
  "modality": "CT",
  "bodyPart": "Chest",
  "clinicalIndication": "Rule out pneumonia",
  "instructions": "With contrast",
  "transportRequired": false,
  "contrastAllergy": false,
  "requestedBy": "Dr. Smith",
  "scheduledAt": "2025-12-20T10:00:00Z"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "order-uuid",
      "orderNumber": "IMG-1703001234-ABC123",
      "patientId": "patient-123",
      "providerId": "provider-456",
      "facilityId": "facility-789",
      "priority": "ROUTINE",
      "modality": "CT",
      "bodyPart": "Chest",
      "clinicalIndication": "Rule out pneumonia",
      "status": "PENDING",
      "scheduledAt": "2025-12-20T10:00:00.000Z",
      "requestedBy": "Dr. Smith",
      "createdAt": "2025-12-19T15:30:00.000Z",
      "updatedAt": "2025-12-19T15:30:00.000Z"
    }
  }
}
```

### Get Imaging Orders

**Request:**
```http
GET /api/imaging-orders?page=1&limit=10&status=PENDING&modality=CT
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "order-uuid",
        "orderNumber": "IMG-1703001234-ABC123",
        "patientId": "patient-123",
        "priority": "ROUTINE",
        "modality": "CT",
        "bodyPart": "Chest",
        "status": "PENDING",
        "studies": []
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Update Imaging Order Status

**Request:**
```http
PATCH /api/imaging-orders/order-uuid
Content-Type: application/json

{
  "status": "SCHEDULED",
  "scheduledAt": "2025-12-20T14:00:00Z"
}
```

## Studies

### Register New Study

**Request:**
```http
POST /api/studies
Content-Type: application/json

{
  "orderId": "order-uuid",
  "studyDate": "2025-12-20",
  "studyTime": "14:30:00",
  "studyDescription": "CT Chest with Contrast",
  "modality": "CT",
  "bodyPart": "Chest",
  "patientId": "patient-123",
  "patientName": "John Doe",
  "patientDOB": "1980-05-15",
  "patientSex": "M",
  "performingPhysician": "Dr. Johnson",
  "institutionName": "General Hospital"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "study": {
      "id": "study-uuid",
      "orderId": "order-uuid",
      "accessionNumber": "ACC-1703001234-XYZ",
      "studyInstanceUID": "1.2.840.1703001234.123456",
      "studyDate": "2025-12-20T00:00:00.000Z",
      "studyDescription": "CT Chest with Contrast",
      "modality": "CT",
      "bodyPart": "Chest",
      "patientId": "patient-123",
      "patientName": "John Doe",
      "status": "SCHEDULED",
      "numberOfSeries": 0,
      "numberOfInstances": 0,
      "createdAt": "2025-12-19T15:35:00.000Z"
    }
  }
}
```

### Get Study by ID

**Request:**
```http
GET /api/studies/study-uuid
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "study": {
      "id": "study-uuid",
      "accessionNumber": "ACC-1703001234-XYZ",
      "studyInstanceUID": "1.2.840.1703001234.123456",
      "studyDate": "2025-12-20T00:00:00.000Z",
      "studyDescription": "CT Chest with Contrast",
      "modality": "CT",
      "status": "COMPLETED",
      "numberOfSeries": 3,
      "numberOfInstances": 120,
      "order": {
        "orderNumber": "IMG-1703001234-ABC123",
        "priority": "ROUTINE"
      },
      "images": [],
      "reports": [],
      "criticalFindings": []
    }
  }
}
```

## Images

### Upload Image Metadata

**Request:**
```http
POST /api/studies/study-uuid/images
Content-Type: application/json

{
  "studyId": "study-uuid",
  "seriesInstanceUID": "1.2.840.1703001234.123456.1",
  "sopInstanceUID": "1.2.840.1703001234.123456.1.1",
  "instanceNumber": 1,
  "seriesNumber": 1,
  "seriesDescription": "Axial 5mm",
  "imageType": "ORIGINAL\\PRIMARY\\AXIAL",
  "rows": 512,
  "columns": 512,
  "bitsAllocated": 16,
  "sliceThickness": 5.0,
  "storageUrl": "https://storage.blob.core.windows.net/medical-images/image-123.dcm",
  "fileSize": 524288,
  "metadata": {
    "windowCenter": "40",
    "windowWidth": "400"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "image": {
      "id": "image-uuid",
      "studyId": "study-uuid",
      "seriesInstanceUID": "1.2.840.1703001234.123456.1",
      "sopInstanceUID": "1.2.840.1703001234.123456.1.1",
      "instanceNumber": 1,
      "seriesNumber": 1,
      "rows": 512,
      "columns": 512,
      "storageUrl": "https://storage.blob.core.windows.net/medical-images/image-123.dcm",
      "createdAt": "2025-12-19T15:40:00.000Z"
    }
  }
}
```

### Get Study Images

**Request:**
```http
GET /api/studies/study-uuid/images
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "images": [
      {
        "id": "image-uuid-1",
        "seriesInstanceUID": "1.2.840.1703001234.123456.1",
        "sopInstanceUID": "1.2.840.1703001234.123456.1.1",
        "instanceNumber": 1,
        "seriesNumber": 1,
        "storageUrl": "https://storage.blob.core.windows.net/medical-images/image-1.dcm"
      },
      {
        "id": "image-uuid-2",
        "seriesInstanceUID": "1.2.840.1703001234.123456.1",
        "sopInstanceUID": "1.2.840.1703001234.123456.1.2",
        "instanceNumber": 2,
        "seriesNumber": 1,
        "storageUrl": "https://storage.blob.core.windows.net/medical-images/image-2.dcm"
      }
    ]
  }
}
```

### Get Image URL with SAS Token

**Request:**
```http
GET /api/images/image-uuid/url?expires=60
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "url": "https://storage.blob.core.windows.net/medical-images/image-123.dcm?sv=2021-06-08&se=2025-12-19T16%3A40%3A00Z&sr=b&sp=r&sig=..."
  }
}
```

## Radiology Reports

### Create Radiology Report

**Request:**
```http
POST /api/reports
Content-Type: application/json

{
  "studyId": "study-uuid",
  "radiologistId": "radiologist-123",
  "radiologistName": "Dr. Sarah Wilson",
  "clinicalHistory": "45-year-old male with cough and fever",
  "technique": "CT chest with IV contrast",
  "comparison": "None available",
  "findings": "The lungs are clear. No pleural effusion. Heart size is normal. No mediastinal lymphadenopathy.",
  "impression": "Normal CT chest examination.",
  "recommendations": "No further imaging required at this time.",
  "status": "PRELIMINARY"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "report": {
      "id": "report-uuid",
      "reportNumber": "RPT-1703001234-ABC",
      "studyId": "study-uuid",
      "radiologistId": "radiologist-123",
      "radiologistName": "Dr. Sarah Wilson",
      "status": "PRELIMINARY",
      "findings": "The lungs are clear...",
      "impression": "Normal CT chest examination.",
      "preliminaryDate": "2025-12-19T15:45:00.000Z",
      "createdAt": "2025-12-19T15:45:00.000Z"
    }
  }
}
```

### Sign Report

**Request:**
```http
POST /api/reports/report-uuid/sign
Content-Type: application/json

{
  "signedBy": "Dr. Sarah Wilson"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "report": {
      "id": "report-uuid",
      "reportNumber": "RPT-1703001234-ABC",
      "status": "FINAL",
      "signedBy": "Dr. Sarah Wilson",
      "signedAt": "2025-12-19T16:00:00.000Z",
      "finalizedDate": "2025-12-19T16:00:00.000Z"
    }
  }
}
```

### Amend Report

**Request:**
```http
POST /api/reports/report-uuid/amend
Content-Type: application/json

{
  "amendmentReason": "Additional findings noted on review",
  "findings": "Updated findings with additional detail...",
  "impression": "Updated impression..."
}
```

## Critical Findings

### Report Critical Finding

**Request:**
```http
POST /api/critical-findings
Content-Type: application/json

{
  "studyId": "study-uuid",
  "finding": "Large pulmonary embolism in right main pulmonary artery",
  "severity": "CRITICAL",
  "category": "Pulmonary Embolism",
  "bodyPart": "Chest",
  "reportedBy": "Dr. Sarah Wilson",
  "notifiedTo": ["provider-456", "er-attending-789"],
  "followUpRequired": true,
  "followUpAction": "Immediate anticoagulation therapy",
  "notes": "Patient in ER, attending notified by phone"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "finding": {
      "id": "finding-uuid",
      "studyId": "study-uuid",
      "finding": "Large pulmonary embolism in right main pulmonary artery",
      "severity": "CRITICAL",
      "category": "Pulmonary Embolism",
      "reportedBy": "Dr. Sarah Wilson",
      "reportedAt": "2025-12-19T15:50:00.000Z",
      "notifiedTo": ["provider-456", "er-attending-789"],
      "notificationSent": false,
      "followUpRequired": true,
      "createdAt": "2025-12-19T15:50:00.000Z"
    }
  }
}
```

### Acknowledge Critical Finding

**Request:**
```http
POST /api/critical-findings/finding-uuid/acknowledge
Content-Type: application/json

{
  "acknowledgedBy": "Dr. John Smith"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "finding": {
      "id": "finding-uuid",
      "finding": "Large pulmonary embolism in right main pulmonary artery",
      "severity": "CRITICAL",
      "acknowledgedBy": "Dr. John Smith",
      "acknowledgedAt": "2025-12-19T15:55:00.000Z"
    }
  }
}
```

### Get Pending Critical Findings

**Request:**
```http
GET /api/critical-findings/pending?page=1&limit=10
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "findings": [
      {
        "id": "finding-uuid",
        "finding": "Large pulmonary embolism",
        "severity": "CRITICAL",
        "reportedBy": "Dr. Sarah Wilson",
        "reportedAt": "2025-12-19T15:50:00.000Z",
        "study": {
          "accessionNumber": "ACC-1703001234-XYZ",
          "patientName": "John Doe",
          "modality": "CT",
          "studyDate": "2025-12-20T00:00:00.000Z"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Patient ID is required"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Imaging order not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Filtering
- `patientId`: Filter by patient
- `providerId`: Filter by provider
- `facilityId`: Filter by facility
- `status`: Filter by status
- `modality`: Filter by imaging modality
- `priority`: Filter by priority
- `startDate`: Filter by start date (ISO 8601)
- `endDate`: Filter by end date (ISO 8601)

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All IDs are UUIDs
3. File sizes are in bytes
4. DICOM UIDs follow the standard format
5. Authentication tokens expire after a configured period
6. Rate limiting may apply to API endpoints
7. Large result sets are paginated
8. Critical findings trigger automatic notifications
