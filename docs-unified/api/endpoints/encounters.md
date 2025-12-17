# Encounter Endpoints

Endpoints for managing clinical encounters and medical documentation.

## Base Path

All encounter endpoints are prefixed with `/api/v1/encounters`

## Endpoints

### Create Encounter

Create a new clinical encounter.

```http
POST /api/v1/encounters
```

**Authentication:** Required (Bearer token)

**Authorization:** Provider or Admin

**Request Body:**

```json
{
  "patientId": "patient-uuid-123",
  "providerId": "provider-uuid-456",
  "appointmentId": "appointment-uuid-789",
  "type": "consultation",
  "chiefComplaint": "Persistent headache for 3 days"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| patientId | string | Yes | Patient ID (UUID) |
| providerId | string | Yes | Provider ID (UUID) |
| appointmentId | string | No | Related appointment ID |
| type | string | Yes | Encounter type (e.g., consultation, follow-up, emergency) |
| chiefComplaint | string | No | Patient's chief complaint |

**Response (201 Created):**

```json
{
  "id": "encounter-uuid-abc",
  "organizationId": "org-uuid-123",
  "patientId": "patient-uuid-123",
  "providerId": "provider-uuid-456",
  "appointmentId": "appointment-uuid-789",
  "status": "planned",
  "type": "consultation",
  "chiefComplaint": "Persistent headache for 3 days",
  "createdAt": "2024-12-17T12:00:00.000Z",
  "updatedAt": "2024-12-17T12:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `422 Unprocessable Entity` - Validation error

---

### List Encounters

Retrieve a list of encounters with optional filters.

```http
GET /api/v1/encounters
```

**Authentication:** Required (Bearer token)

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page (max 100) |
| patientId | string | - | Filter by patient ID |
| providerId | string | - | Filter by provider ID |
| status | string | - | Filter by status |
| startDate | string | - | Filter by start date (ISO 8601) |
| endDate | string | - | Filter by end date (ISO 8601) |

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "encounter-uuid-abc",
      "organizationId": "org-uuid-123",
      "patientId": "patient-uuid-123",
      "providerId": "provider-uuid-456",
      "status": "finished",
      "type": "consultation",
      "chiefComplaint": "Persistent headache for 3 days",
      "startedAt": "2024-12-17T14:00:00.000Z",
      "endedAt": "2024-12-17T14:30:00.000Z",
      "patient": {
        "id": "patient-uuid-123",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "provider": {
        "id": "provider-uuid-456",
        "firstName": "Dr. John",
        "lastName": "Doe"
      },
      "createdAt": "2024-12-17T12:00:00.000Z",
      "updatedAt": "2024-12-17T14:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 75,
    "totalPages": 4
  }
}
```

---

### Get Encounter

Retrieve a specific encounter by ID.

```http
GET /api/v1/encounters/:id
```

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Encounter ID (UUID) |

**Response (200 OK):**

```json
{
  "id": "encounter-uuid-abc",
  "organizationId": "org-uuid-123",
  "patientId": "patient-uuid-123",
  "providerId": "provider-uuid-456",
  "appointmentId": "appointment-uuid-789",
  "status": "finished",
  "type": "consultation",
  "chiefComplaint": "Persistent headache for 3 days",
  "diagnosis": [
    {
      "code": "R51",
      "description": "Tension headache",
      "type": "primary"
    }
  ],
  "procedures": [
    {
      "code": "99213",
      "description": "Office visit, level 3"
    }
  ],
  "vitals": {
    "temperature": 98.6,
    "bloodPressureSystolic": 120,
    "bloodPressureDiastolic": 80,
    "heartRate": 72,
    "respiratoryRate": 16,
    "oxygenSaturation": 98,
    "height": 165,
    "weight": 65,
    "bmi": 23.9
  },
  "medications": [
    {
      "name": "Ibuprofen",
      "dosage": "400mg",
      "frequency": "Three times daily",
      "duration": "5 days"
    }
  ],
  "labOrders": [
    {
      "test": "Complete Blood Count",
      "status": "ordered"
    }
  ],
  "startedAt": "2024-12-17T14:00:00.000Z",
  "endedAt": "2024-12-17T14:30:00.000Z",
  "patient": {
    "id": "patient-uuid-123",
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": "1990-05-15"
  },
  "provider": {
    "id": "provider-uuid-456",
    "firstName": "Dr. John",
    "lastName": "Doe",
    "email": "drjohn@example.com"
  },
  "createdAt": "2024-12-17T12:00:00.000Z",
  "updatedAt": "2024-12-17T14:30:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Encounter not found

---

### Update Encounter

Update encounter details.

```http
PATCH /api/v1/encounters/:id
```

**Authentication:** Required (Bearer token)

**Authorization:** Provider or Admin

**Request Body:**

All fields are optional. Only include fields you want to update.

```json
{
  "status": "finished",
  "diagnosis": [
    {
      "code": "R51",
      "description": "Tension headache",
      "type": "primary"
    }
  ],
  "vitals": {
    "temperature": 98.6,
    "bloodPressureSystolic": 120,
    "bloodPressureDiastolic": 80,
    "heartRate": 72,
    "respiratoryRate": 16,
    "oxygenSaturation": 98
  },
  "medications": [
    {
      "name": "Ibuprofen",
      "dosage": "400mg",
      "frequency": "Three times daily",
      "duration": "5 days"
    }
  ]
}
```

**Status Values:**

- `planned` - Encounter is planned
- `in-progress` - Encounter is in progress
- `finished` - Encounter completed
- `cancelled` - Encounter cancelled

**Response (200 OK):**

Returns the updated encounter object.

---

### Start Encounter

Mark an encounter as started.

```http
POST /api/v1/encounters/:id/start
```

**Authentication:** Required (Bearer token)

**Authorization:** Provider or Admin

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Encounter ID (UUID) |

**Response (200 OK):**

Returns the encounter with `status: in-progress` and `startedAt` timestamp.

---

### End Encounter

Mark an encounter as finished.

```http
POST /api/v1/encounters/:id/end
```

**Authentication:** Required (Bearer token)

**Authorization:** Provider or Admin

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Encounter ID (UUID) |

**Response (200 OK):**

Returns the encounter with `status: finished` and `endedAt` timestamp.

---

### Add Clinical Note

Add a clinical note to an encounter.

```http
POST /api/v1/encounters/:id/notes
```

**Authentication:** Required (Bearer token)

**Authorization:** Provider or Admin

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Encounter ID (UUID) |

**Request Body:**

```json
{
  "content": "S: Patient reports persistent headache...\nO: BP 120/80...\nA: Tension headache...\nP: Ibuprofen 400mg...",
  "type": "soap"
}
```

**Note Types:**

- `soap` - SOAP note (Subjective, Objective, Assessment, Plan)
- `progress` - Progress note
- `consultation` - Consultation note
- `discharge` - Discharge summary
- `other` - Other note type

**Response (201 Created):**

```json
{
  "id": "note-uuid-xyz",
  "encounterId": "encounter-uuid-abc",
  "authorId": "provider-uuid-456",
  "content": "S: Patient reports persistent headache...\nO: BP 120/80...\nA: Tension headache...\nP: Ibuprofen 400mg...",
  "type": "soap",
  "author": {
    "id": "provider-uuid-456",
    "firstName": "Dr. John",
    "lastName": "Doe"
  },
  "createdAt": "2024-12-17T14:30:00.000Z",
  "updatedAt": "2024-12-17T14:30:00.000Z"
}
```

---

### Get Clinical Notes

Retrieve all clinical notes for an encounter.

```http
GET /api/v1/encounters/:id/notes
```

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Encounter ID (UUID) |

**Response (200 OK):**

```json
[
  {
    "id": "note-uuid-xyz",
    "encounterId": "encounter-uuid-abc",
    "authorId": "provider-uuid-456",
    "content": "S: Patient reports persistent headache...",
    "type": "soap",
    "author": {
      "id": "provider-uuid-456",
      "firstName": "Dr. John",
      "lastName": "Doe"
    },
    "createdAt": "2024-12-17T14:30:00.000Z",
    "updatedAt": "2024-12-17T14:30:00.000Z"
  }
]
```

---

## SDK Usage Examples

### TypeScript SDK

```typescript
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: 'http://localhost:4000/api/v1',
  accessToken: 'your-access-token',
});

// Create encounter
const encounter = await client.createEncounter({
  patientId: 'patient-uuid-123',
  providerId: 'provider-uuid-456',
  type: 'consultation',
  chiefComplaint: 'Persistent headache for 3 days',
});

// Start encounter
await client.startEncounter(encounter.id);

// Update encounter with vitals and diagnosis
const updated = await client.updateEncounter(encounter.id, {
  vitals: {
    temperature: 98.6,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    heartRate: 72,
  },
  diagnosis: [
    {
      code: 'R51',
      description: 'Tension headache',
      type: 'primary',
    },
  ],
  medications: [
    {
      name: 'Ibuprofen',
      dosage: '400mg',
      frequency: 'Three times daily',
      duration: '5 days',
    },
  ],
});

// Add clinical note
const note = await client.addClinicalNote(encounter.id, {
  content: `
    S: Patient reports persistent headache for 3 days
    O: Blood pressure 120/80, temperature 98.6°F
    A: Tension headache, likely stress-related
    P: Prescribed ibuprofen 400mg, follow-up in 1 week
  `,
  type: 'soap',
});

// End encounter
await client.endEncounter(encounter.id);

// Get all notes
const notes = await client.getClinicalNotes(encounter.id);
console.log('Clinical notes:', notes);
```

---

## Best Practices

### Documentation

1. Document all encounters thoroughly
2. Use standardized coding (ICD-10, CPT)
3. Include detailed clinical notes
4. Record all vitals and observations

### Workflow

1. Create encounter when patient arrives
2. Start encounter when provider begins
3. Document as you go
4. End encounter when complete
5. Review and sign notes

### Data Quality

1. Use structured data where possible
2. Include all relevant diagnoses
3. Document medications accurately
4. Record all procedures performed

---

## Related Documentation

- [Patient Endpoints](./patients.md)
- [Appointment Endpoints](./appointments.md)
- [Document Endpoints](./documents.md)
- [Getting Started Guide](../getting-started.md)
