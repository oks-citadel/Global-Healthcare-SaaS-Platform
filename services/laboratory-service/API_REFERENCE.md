# Laboratory Service API Reference

Base URL: `http://localhost:3005`

## Authentication

All endpoints (except health check and some catalog endpoints) require authentication via headers:
- `x-user-id`: User UUID
- `x-user-role`: User role (patient, provider, lab_tech, admin)
- `x-user-email`: User email

## Lab Orders API

### Create Lab Order
```http
POST /lab-orders
Content-Type: application/json

{
  "patientId": "uuid",
  "encounterId": "uuid", // optional
  "priority": "routine|urgent|stat", // default: routine
  "tests": [
    {
      "testCode": "CBC",
      "testName": "Complete Blood Count",
      "category": "hematology"
    }
  ],
  "clinicalInfo": "Patient presents with fatigue",
  "diagnosis": "R53.83 - Fatigue"
}

Response: 201 Created
{
  "data": { /* LabOrder */ },
  "message": "Lab order created successfully"
}
```

### List Lab Orders
```http
GET /lab-orders?status=pending&priority=urgent&limit=20&offset=0

Response: 200 OK
{
  "data": [ /* LabOrder[] */ ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

### Get Order Details
```http
GET /lab-orders/:id

Response: 200 OK
{
  "data": {
    "id": "uuid",
    "orderNumber": "LAB-1234567890-ABC123",
    "patientId": "uuid",
    "providerId": "uuid",
    "status": "completed",
    "priority": "routine",
    "tests": [
      {
        "id": "uuid",
        "testCode": "CBC",
        "testName": "Complete Blood Count",
        "category": "hematology",
        "status": "completed",
        "results": [ /* LabResult[] */ ]
      }
    ],
    "orderedAt": "2024-01-15T10:00:00Z",
    "collectedAt": "2024-01-15T11:00:00Z",
    "completedAt": "2024-01-15T14:00:00Z"
  }
}
```

### Update Order Status
```http
PATCH /lab-orders/:id/status
Content-Type: application/json

{
  "status": "collected"
}

Response: 200 OK
{
  "data": { /* Updated LabOrder */ },
  "message": "Lab order status updated"
}
```

### Get Order Statistics
```http
GET /lab-orders/statistics

Response: 200 OK
{
  "data": {
    "total": 500,
    "byStatus": {
      "pending": 50,
      "collected": 30,
      "processing": 100,
      "completed": 300,
      "cancelled": 20
    },
    "byPriority": {
      "routine": 400,
      "urgent": 80,
      "stat": 20
    }
  }
}
```

## Lab Results API

### Create Single Result
```http
POST /lab-results
Content-Type: application/json

{
  "testId": "uuid",
  "componentCode": "26464-8", // LOINC code
  "componentName": "White Blood Cell Count",
  "value": "8.5",
  "numericValue": 8.5,
  "unit": "10*3/uL",
  "referenceRange": "4.5-11.0",
  "isAbnormal": false,
  "isCritical": false,
  "abnormalFlag": "N",
  "notes": "Normal range"
}

Response: 201 Created
{
  "data": { /* LabResult */ },
  "message": "Result created successfully"
}
```

### Create Bulk Results
```http
POST /lab-results/bulk
Content-Type: application/json

{
  "testId": "uuid",
  "results": [
    {
      "componentName": "WBC",
      "value": "8.5",
      "numericValue": 8.5,
      "unit": "10*3/uL",
      "referenceRange": "4.5-11.0"
    },
    {
      "componentName": "RBC",
      "value": "4.8",
      "numericValue": 4.8,
      "unit": "10*6/uL",
      "referenceRange": "4.5-5.5"
    }
  ]
}

Response: 201 Created
{
  "data": [ /* LabResult[] */ ],
  "message": "Results created successfully"
}
```

### Get Patient Results
```http
GET /lab-results/patient/:patientId?startDate=2024-01-01&endDate=2024-12-31&limit=50

Response: 200 OK
{
  "data": [ /* LabResult[] */ ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

### Get Abnormal Results
```http
GET /lab-results/abnormal?limit=20

Response: 200 OK
{
  "data": [ /* LabResult[] with isAbnormal=true */ ]
}
```

### Get Critical Results
```http
GET /lab-results/critical?limit=20

Response: 200 OK
{
  "data": [ /* LabResult[] with isCritical=true */ ]
}
```

### Verify Result
```http
PATCH /lab-results/:id/verify

Response: 200 OK
{
  "data": { /* LabResult with verifiedBy and verifiedAt set */ },
  "message": "Result verified successfully"
}
```

### Get FHIR Observation
```http
GET /lab-results/:id/fhir

Response: 200 OK
{
  "resourceType": "Observation",
  "id": "uuid",
  "status": "final",
  "category": [ /* ... */ ],
  "code": { /* ... */ },
  "subject": { "reference": "Patient/uuid" },
  "valueQuantity": { "value": 8.5, "unit": "10*3/uL" },
  "referenceRange": [ /* ... */ ]
}
```

## Test Catalog API

### List Tests
```http
GET /test-catalog?category=hematology&isActive=true&limit=50

Response: 200 OK
{
  "data": [
    {
      "id": "uuid",
      "code": "CBC",
      "name": "Complete Blood Count",
      "category": "hematology",
      "sampleType": "whole_blood",
      "price": 25.00,
      "turnaroundTime": "2-4 hours",
      "isActive": true
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

### Search Tests
```http
GET /test-catalog/search?q=blood&limit=20

Response: 200 OK
{
  "data": [ /* TestCatalog[] matching search */ ],
  "total": 25
}
```

### Create Test
```http
POST /test-catalog
Content-Type: application/json

{
  "code": "CBC",
  "name": "Complete Blood Count",
  "category": "hematology",
  "loincCode": "58410-2",
  "description": "Measures various blood components",
  "sampleType": "whole_blood",
  "containerType": "Lavender top (EDTA)",
  "minVolume": "3 mL",
  "turnaroundTime": "2-4 hours",
  "price": 25.00,
  "currency": "USD",
  "requiresFasting": false,
  "requiresConsent": false
}

Response: 201 Created
{
  "data": { /* TestCatalog */ },
  "message": "Test created successfully"
}
```

### Add Reference Range
```http
POST /test-catalog/:id/reference-ranges
Content-Type: application/json

{
  "componentName": "White Blood Cell Count",
  "componentCode": "26464-8",
  "lowValue": 4.5,
  "highValue": 11.0,
  "unit": "10*3/uL",
  "criticalLow": 2.0,
  "criticalHigh": 30.0,
  "gender": "M", // or "F", or null for both
  "ageMin": 18,
  "ageMax": 65
}

Response: 201 Created
{
  "data": { /* ReferenceRange */ },
  "message": "Reference range added successfully"
}
```

## Samples API

### Create Sample
```http
POST /samples
Content-Type: application/json

{
  "orderId": "uuid",
  "sampleType": "whole_blood",
  "containerType": "Lavender top (EDTA)",
  "volume": "5 mL",
  "bodySource": "Left antecubital vein",
  "collectedBy": "uuid",
  "priority": "routine",
  "notes": "Sample collected at bedside"
}

Response: 201 Created
{
  "data": {
    "id": "uuid",
    "sampleNumber": "SMP-1234567890-ABC12",
    "orderId": "uuid",
    "sampleType": "whole_blood",
    "status": "collected",
    /* ... */
  },
  "message": "Sample created successfully"
}
```

### Track Samples
```http
GET /samples?status=received&sampleType=whole_blood&limit=50

Response: 200 OK
{
  "data": [ /* Sample[] */ ],
  "total": 200,
  "limit": 50,
  "offset": 0
}
```

### Receive Sample
```http
PATCH /samples/:id/receive
Content-Type: application/json

{
  "condition": "Good condition, no hemolysis"
}

Response: 200 OK
{
  "data": { /* Sample with status=received */ },
  "message": "Sample marked as received"
}
```

### Reject Sample
```http
PATCH /samples/:id/reject
Content-Type: application/json

{
  "reason": "Hemolyzed specimen - recollection required"
}

Response: 200 OK
{
  "data": { /* Sample with status=rejected */ },
  "message": "Sample rejected"
}
```

### Update Sample Location
```http
PATCH /samples/:id/location
Content-Type: application/json

{
  "location": "Refrigerator A, Rack 3, Position B5"
}

Response: 200 OK
{
  "data": { /* Sample with updated location */ },
  "message": "Sample location updated"
}
```

## Response Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Error Response Format

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "field": "patientId",
      "message": "Invalid UUID"
    }
  ]
}
```

## Enums

### OrderStatus
- `pending` - Order created, awaiting collection
- `collected` - Sample collected
- `processing` - Tests in progress
- `completed` - All tests completed
- `cancelled` - Order cancelled
- `partial` - Some tests completed

### OrderPriority
- `routine` - Standard processing
- `urgent` - Expedited processing
- `stat` - Immediate processing

### TestCategory
- `hematology` - Blood cell analysis
- `biochemistry` - Chemical analysis
- `immunology` - Immune system tests
- `microbiology` - Infectious disease testing
- `pathology` - Tissue analysis
- `radiology` - Imaging studies
- `cardiology` - Heart-related tests
- `endocrinology` - Hormone analysis
- `molecular` - Molecular diagnostics
- `genetics` - Genetic testing
- `toxicology` - Drug/toxin screening
- `other` - Other categories

### SampleType
- `blood_serum` - Serum sample
- `blood_plasma` - Plasma sample
- `whole_blood` - Whole blood
- `urine` - Urine sample
- `stool` - Stool sample
- `sputum` - Sputum sample
- `csf` - Cerebrospinal fluid
- `tissue` - Tissue biopsy
- `swab` - Swab specimen
- `other` - Other types

### AbnormalFlag
- `N` - Normal
- `H` - High
- `L` - Low
- `HH` - Critical High
- `LL` - Critical Low
- `A` - Abnormal
- `AA` - Very Abnormal

## Rate Limiting

Currently not implemented. Recommended limits:
- 100 requests per minute for general endpoints
- 1000 requests per minute for read operations
- 50 requests per minute for write operations

## Pagination

Use `limit` and `offset` query parameters:
```http
GET /lab-orders?limit=20&offset=40
```

Default `limit`: 20
Maximum `limit`: 100
