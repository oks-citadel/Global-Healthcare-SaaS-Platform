# Appointment Endpoints

Endpoints for managing patient appointments and scheduling.

## Base Path

All appointment endpoints are prefixed with `/api/v1/appointments`

## Endpoints

### Create Appointment

Schedule a new appointment.

```http
POST /api/v1/appointments
```

**Authentication:** Required (Bearer token)

**Request Body:**

```json
{
  "patientId": "patient-uuid-123",
  "providerId": "provider-uuid-456",
  "scheduledAt": "2024-12-20T10:00:00Z",
  "duration": 30,
  "type": "telehealth",
  "reason": "Follow-up consultation",
  "notes": "Patient requested video call"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| patientId | string | Yes | Patient ID (UUID) |
| providerId | string | Yes | Provider ID (UUID) |
| scheduledAt | string | Yes | Appointment date/time (ISO 8601) |
| duration | number | Yes | Duration in minutes |
| type | string | Yes | Type: `in-person` or `telehealth` |
| reason | string | No | Reason for appointment |
| notes | string | No | Additional notes |

**Response (201 Created):**

```json
{
  "id": "appointment-uuid-789",
  "organizationId": "org-uuid-123",
  "patientId": "patient-uuid-123",
  "providerId": "provider-uuid-456",
  "scheduledAt": "2024-12-20T10:00:00Z",
  "duration": 30,
  "type": "telehealth",
  "status": "scheduled",
  "reason": "Follow-up consultation",
  "notes": "Patient requested video call",
  "createdAt": "2024-12-17T12:00:00.000Z",
  "updatedAt": "2024-12-17T12:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `422 Unprocessable Entity` - Validation error
- `409 Conflict` - Time slot already booked

---

### List Appointments

Retrieve a list of appointments with optional filters.

```http
GET /api/v1/appointments
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
| type | string | - | Filter by type |
| startDate | string | - | Filter by start date (ISO 8601) |
| endDate | string | - | Filter by end date (ISO 8601) |

**Example Request:**

```http
GET /api/v1/appointments?patientId=patient-123&status=scheduled&page=1&limit=20
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "appointment-uuid-789",
      "organizationId": "org-uuid-123",
      "patientId": "patient-uuid-123",
      "providerId": "provider-uuid-456",
      "scheduledAt": "2024-12-20T10:00:00Z",
      "duration": 30,
      "type": "telehealth",
      "status": "scheduled",
      "reason": "Follow-up consultation",
      "notes": "Patient requested video call",
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
      "updatedAt": "2024-12-17T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions

---

### Get Appointment

Retrieve a specific appointment by ID.

```http
GET /api/v1/appointments/:id
```

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Appointment ID (UUID) |

**Response (200 OK):**

```json
{
  "id": "appointment-uuid-789",
  "organizationId": "org-uuid-123",
  "patientId": "patient-uuid-123",
  "providerId": "provider-uuid-456",
  "scheduledAt": "2024-12-20T10:00:00Z",
  "duration": 30,
  "type": "telehealth",
  "status": "scheduled",
  "reason": "Follow-up consultation",
  "notes": "Patient requested video call",
  "patient": {
    "id": "patient-uuid-123",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+1234567890"
  },
  "provider": {
    "id": "provider-uuid-456",
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
- `404 Not Found` - Appointment not found

---

### Update Appointment

Update appointment details or status.

```http
PATCH /api/v1/appointments/:id
```

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Appointment ID (UUID) |

**Request Body:**

All fields are optional. Only include fields you want to update.

```json
{
  "scheduledAt": "2024-12-20T14:00:00Z",
  "duration": 45,
  "status": "confirmed",
  "notes": "Patient confirmed via phone"
}
```

**Status Values:**

- `scheduled` - Appointment is scheduled
- `confirmed` - Patient confirmed attendance
- `checked-in` - Patient has checked in
- `in-progress` - Appointment is in progress
- `completed` - Appointment completed
- `cancelled` - Appointment cancelled
- `no-show` - Patient did not show up

**Response (200 OK):**

Returns the updated appointment object.

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Appointment not found
- `422 Unprocessable Entity` - Validation error

---

### Delete Appointment

Cancel and delete an appointment.

```http
DELETE /api/v1/appointments/:id
```

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Appointment ID (UUID) |

**Response (204 No Content):**

Empty response body on successful deletion.

**Error Responses:**

- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Appointment not found

---

## SDK Usage Examples

### TypeScript SDK

```typescript
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: 'http://localhost:4000/api/v1',
  accessToken: 'your-access-token',
});

// Create appointment
const appointment = await client.createAppointment({
  patientId: 'patient-uuid-123',
  providerId: 'provider-uuid-456',
  scheduledAt: '2024-12-20T10:00:00Z',
  duration: 30,
  type: 'telehealth',
  reason: 'Follow-up consultation',
});

console.log('Appointment created:', appointment);

// List appointments
const appointments = await client.listAppointments({
  page: 1,
  limit: 20,
  patientId: 'patient-uuid-123',
  status: 'scheduled',
});

console.log('Found appointments:', appointments.data);

// Get specific appointment
const retrievedAppointment = await client.getAppointment(appointment.id);
console.log('Appointment details:', retrievedAppointment);

// Update appointment
const updatedAppointment = await client.updateAppointment(appointment.id, {
  status: 'confirmed',
  notes: 'Patient confirmed via phone',
});

console.log('Appointment updated:', updatedAppointment);

// Delete appointment
await client.deleteAppointment(appointment.id);
console.log('Appointment deleted');
```

### JavaScript/Fetch

```javascript
const accessToken = 'your-access-token';

// Create appointment
const createResponse = await fetch('http://localhost:4000/api/v1/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    patientId: 'patient-uuid-123',
    providerId: 'provider-uuid-456',
    scheduledAt: '2024-12-20T10:00:00Z',
    duration: 30,
    type: 'telehealth',
    reason: 'Follow-up consultation',
  }),
});

const appointment = await createResponse.json();

// List appointments with filters
const listResponse = await fetch(
  'http://localhost:4000/api/v1/appointments?patientId=patient-uuid-123&status=scheduled',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }
);

const appointments = await listResponse.json();

// Update appointment
const updateResponse = await fetch(
  `http://localhost:4000/api/v1/appointments/${appointment.id}`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      status: 'confirmed',
    }),
  }
);

const updatedAppointment = await updateResponse.json();
```

---

## Appointment Workflow

### Typical Appointment Lifecycle

1. **Schedule** - Create appointment with `status: scheduled`
2. **Confirm** - Patient confirms → `status: confirmed`
3. **Check-in** - Patient arrives → `status: checked-in`
4. **Start** - Provider begins → `status: in-progress`
5. **Complete** - Appointment ends → `status: completed`

### Alternative Outcomes

- **Cancel** - Either party cancels → `status: cancelled`
- **No-show** - Patient doesn't arrive → `status: no-show`

---

## Best Practices

### Scheduling

1. Check provider availability before creating appointments
2. Allow buffer time between appointments
3. Send confirmation emails/SMS after scheduling
4. Set appropriate durations based on appointment type

### Status Management

1. Update status as the appointment progresses
2. Send reminders before appointments
3. Handle no-shows appropriately
4. Track cancellation reasons

### Filtering & Searching

1. Use date ranges for efficient queries
2. Filter by status to find pending confirmations
3. Group by provider for schedule views
4. Paginate results for large datasets

### Notifications

1. Send appointment confirmations
2. Send reminders 24 hours before
3. Notify on status changes
4. Alert providers of check-ins

---

## Related Documentation

- [Patient Endpoints](./patients.md)
- [Encounter Endpoints](./encounters.md)
- [Visit Endpoints](./visits.md)
- [Getting Started Guide](../getting-started.md)
