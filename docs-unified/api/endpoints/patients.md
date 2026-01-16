# Patient Endpoints

Endpoints for managing patient information and medical records.

## Base Path

All patient endpoints are prefixed with `/api/v1/patients`

## Endpoints

### Create Patient

Create a new patient record.

```http
POST /api/v1/patients
```

**Authentication:** Required (Bearer token)

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-05-15",
  "gender": "female",
  "email": "jane.smith@example.com",
  "phone": "+1234567890",
  "address": "123 Main Street",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "country": "USA",
  "emergencyContact": {
    "name": "John Smith",
    "relationship": "Spouse",
    "phone": "+1234567891"
  },
  "insuranceInfo": {
    "provider": "Blue Cross Blue Shield",
    "policyNumber": "BCBS123456",
    "groupNumber": "GRP789"
  },
  "allergies": ["Penicillin", "Peanuts"],
  "medications": ["Lisinopril 10mg daily"],
  "conditions": ["Hypertension", "Type 2 Diabetes"]
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| firstName | string | Yes | Patient's first name |
| lastName | string | Yes | Patient's last name |
| dateOfBirth | string | Yes | Date of birth (ISO 8601 format) |
| gender | string | Yes | Gender: `male`, `female`, `other` |
| email | string | No | Email address |
| phone | string | No | Phone number |
| address | string | No | Street address |
| city | string | No | City |
| state | string | No | State/Province |
| zipCode | string | No | ZIP/Postal code |
| country | string | No | Country |
| emergencyContact | object | No | Emergency contact information |
| insuranceInfo | object | No | Insurance information |
| allergies | array | No | List of known allergies |
| medications | array | No | Current medications |
| conditions | array | No | Medical conditions |

**Response (201 Created):**

```json
{
  "id": "patient-uuid-123",
  "userId": "user-uuid-456",
  "organizationId": "org-uuid-789",
  "mrn": "MRN-2024-001234",
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-05-15",
  "gender": "female",
  "email": "jane.smith@example.com",
  "phone": "+1234567890",
  "address": "123 Main Street",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "country": "USA",
  "emergencyContact": {
    "name": "John Smith",
    "relationship": "Spouse",
    "phone": "+1234567891"
  },
  "insuranceInfo": {
    "provider": "Blue Cross Blue Shield",
    "policyNumber": "BCBS123456",
    "groupNumber": "GRP789"
  },
  "allergies": ["Penicillin", "Peanuts"],
  "medications": ["Lisinopril 10mg daily"],
  "conditions": ["Hypertension", "Type 2 Diabetes"],
  "createdAt": "2024-12-17T12:00:00.000Z",
  "updatedAt": "2024-12-17T12:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required
- `422 Unprocessable Entity` - Validation error

---

### Get Patient

Retrieve a specific patient by ID.

```http
GET /api/v1/patients/:id
```

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Patient ID (UUID) |

**Response (200 OK):**

```json
{
  "id": "patient-uuid-123",
  "userId": "user-uuid-456",
  "organizationId": "org-uuid-789",
  "mrn": "MRN-2024-001234",
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-05-15",
  "gender": "female",
  "email": "jane.smith@example.com",
  "phone": "+1234567890",
  "address": "123 Main Street",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "country": "USA",
  "emergencyContact": {
    "name": "John Smith",
    "relationship": "Spouse",
    "phone": "+1234567891"
  },
  "insuranceInfo": {
    "provider": "Blue Cross Blue Shield",
    "policyNumber": "BCBS123456",
    "groupNumber": "GRP789"
  },
  "allergies": ["Penicillin", "Peanuts"],
  "medications": ["Lisinopril 10mg daily"],
  "conditions": ["Hypertension", "Type 2 Diabetes"],
  "createdAt": "2024-12-17T12:00:00.000Z",
  "updatedAt": "2024-12-17T12:00:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Patient not found

---

### Update Patient

Update patient information.

```http
PATCH /api/v1/patients/:id
```

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Patient ID (UUID) |

**Request Body:**

All fields are optional. Only include fields you want to update.

```json
{
  "phone": "+1234567899",
  "address": "456 Oak Avenue",
  "city": "Oakland",
  "state": "CA",
  "zipCode": "94601",
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Sister",
    "phone": "+1234567898"
  },
  "allergies": ["Penicillin", "Peanuts", "Shellfish"],
  "medications": ["Lisinopril 10mg daily", "Metformin 500mg twice daily"]
}
```

**Response (200 OK):**

Returns the updated patient object.

```json
{
  "id": "patient-uuid-123",
  "userId": "user-uuid-456",
  "organizationId": "org-uuid-789",
  "mrn": "MRN-2024-001234",
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-05-15",
  "gender": "female",
  "email": "jane.smith@example.com",
  "phone": "+1234567899",
  "address": "456 Oak Avenue",
  "city": "Oakland",
  "state": "CA",
  "zipCode": "94601",
  "country": "USA",
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Sister",
    "phone": "+1234567898"
  },
  "insuranceInfo": {
    "provider": "Blue Cross Blue Shield",
    "policyNumber": "BCBS123456",
    "groupNumber": "GRP789"
  },
  "allergies": ["Penicillin", "Peanuts", "Shellfish"],
  "medications": ["Lisinopril 10mg daily", "Metformin 500mg twice daily"],
  "conditions": ["Hypertension", "Type 2 Diabetes"],
  "createdAt": "2024-12-17T12:00:00.000Z",
  "updatedAt": "2024-12-17T13:30:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Patient not found
- `422 Unprocessable Entity` - Validation error

---

## SDK Usage Examples

### TypeScript SDK

```typescript
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: 'http://localhost:4000/api/v1',
  accessToken: 'your-access-token',
});

// Create patient
const patient = await client.createPatient({
  firstName: 'Jane',
  lastName: 'Smith',
  dateOfBirth: '1990-05-15',
  gender: 'female',
  email: 'jane.smith@example.com',
  phone: '+1234567890',
  address: '123 Main Street',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94102',
  emergencyContact: {
    name: 'John Smith',
    relationship: 'Spouse',
    phone: '+1234567891',
  },
  insuranceInfo: {
    provider: 'Blue Cross Blue Shield',
    policyNumber: 'BCBS123456',
    groupNumber: 'GRP789',
  },
  allergies: ['Penicillin', 'Peanuts'],
  medications: ['Lisinopril 10mg daily'],
  conditions: ['Hypertension', 'Type 2 Diabetes'],
});

console.log('Created patient:', patient);

// Get patient
const retrievedPatient = await client.getPatient(patient.id);
console.log('Retrieved patient:', retrievedPatient);

// Update patient
const updatedPatient = await client.updatePatient(patient.id, {
  phone: '+1234567899',
  address: '456 Oak Avenue',
  city: 'Oakland',
  allergies: ['Penicillin', 'Peanuts', 'Shellfish'],
});

console.log('Updated patient:', updatedPatient);
```

### JavaScript/Fetch

```javascript
const accessToken = 'your-access-token';

// Create patient
const createResponse = await fetch('http://localhost:4000/api/v1/patients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1990-05-15',
    gender: 'female',
    email: 'jane.smith@example.com',
    phone: '+1234567890',
  }),
});

const patient = await createResponse.json();
console.log('Created patient:', patient);

// Get patient
const getResponse = await fetch(`http://localhost:4000/api/v1/patients/${patient.id}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

const retrievedPatient = await getResponse.json();
console.log('Retrieved patient:', retrievedPatient);

// Update patient
const updateResponse = await fetch(`http://localhost:4000/api/v1/patients/${patient.id}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    phone: '+1234567899',
    address: '456 Oak Avenue',
  }),
});

const updatedPatient = await updateResponse.json();
console.log('Updated patient:', updatedPatient);
```

---

## Data Privacy & Security

### HIPAA Compliance

Patient data is handled in accordance with HIPAA regulations:

- All data is encrypted at rest and in transit
- Access is logged in audit trails
- Role-based access controls are enforced
- PHI is protected with additional safeguards

### Access Control

- **Patients**: Can view and update their own records
- **Providers**: Can view and update records for their patients
- **Admins**: Can view and update all patient records

### Audit Logging

All patient data access and modifications are logged for compliance:

- Who accessed the data
- What was accessed or modified
- When the access occurred
- IP address and user agent

---

## Best Practices

### Creating Patient Records

1. Validate all input data before submission
2. Include as much information as available
3. Ensure date of birth is in ISO 8601 format
4. Use standardized formats for phone numbers
5. Keep emergency contact information up to date

### Updating Patient Records

1. Only send fields that need to be updated
2. Validate changes before submission
3. Handle concurrent updates appropriately
4. Maintain audit trails of changes

### Medical Record Numbers (MRN)

- MRNs are automatically generated upon patient creation
- Format: `MRN-YYYY-NNNNNN`
- MRNs are unique within an organization
- Cannot be manually set or changed

---

## Related Documentation

- [Authentication Endpoints](./auth.md)
- [Appointment Endpoints](./appointments.md)
- [Encounter Endpoints](./encounters.md)
- [Document Endpoints](./documents.md)
- [Getting Started Guide](../getting-started.md)
