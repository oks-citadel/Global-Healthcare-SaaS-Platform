# @unified-health/sdk

Official TypeScript/JavaScript SDK for the Unified Healthcare Platform API.

## Features

- Type-safe API client with full TypeScript support
- Automatic token refresh and authentication handling
- Comprehensive coverage of all API endpoints
- Built-in error handling and retry logic
- Support for both Node.js and browser environments
- Works with React, React Native, Vue, Angular, and vanilla JavaScript

## Installation

```bash
npm install @unified-health/sdk
```

or

```bash
yarn add @unified-health/sdk
```

or

```bash
pnpm add @unified-health/sdk
```

## Quick Start

```typescript
import { createClient } from '@unified-health/sdk';

// Create a client instance
const client = createClient({
  baseURL: 'https://api.unifiedhealth.com/api/v1',
});

// Login
const auth = await client.login({
  email: 'user@example.com',
  password: 'your-password',
});

console.log('Logged in as:', auth.user.firstName);

// Use the API
const appointments = await client.listAppointments({
  page: 1,
  limit: 10,
});

console.log('Appointments:', appointments.data);
```

## Configuration

### Basic Configuration

```typescript
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: 'https://api.unifiedhealth.com/api/v1',
  timeout: 30000, // 30 seconds
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

### With Existing Tokens

```typescript
const client = createClient({
  baseURL: 'https://api.unifiedhealth.com/api/v1',
  accessToken: 'your-access-token',
  refreshToken: 'your-refresh-token',
  onTokenRefresh: (tokens) => {
    // Save new tokens to storage
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },
});
```

## Usage Examples

### Authentication

```typescript
// Register a new user
const auth = await client.register({
  email: 'newuser@example.com',
  password: 'SecurePassword123!',
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'patient',
});

// Login
const auth = await client.login({
  email: 'user@example.com',
  password: 'your-password',
});

// Get current user
const user = await client.getCurrentUser();

// Logout
await client.logout();
```

### Patient Management

```typescript
// Create a patient
const patient = await client.createPatient({
  firstName: 'John',
  lastName: 'Smith',
  dateOfBirth: '1985-03-15',
  gender: 'male',
  email: 'john@example.com',
  phone: '+1234567890',
});

// Get patient details
const patient = await client.getPatient('patient-id');

// Update patient
const updated = await client.updatePatient('patient-id', {
  phone: '+1234567899',
  address: '123 New Street',
});
```

### Appointments

```typescript
// Create an appointment
const appointment = await client.createAppointment({
  patientId: 'patient-id',
  providerId: 'provider-id',
  scheduledAt: '2024-12-20T10:00:00Z',
  duration: 30,
  type: 'telehealth',
  reason: 'Annual checkup',
});

// List appointments
const appointments = await client.listAppointments({
  page: 1,
  limit: 20,
  status: 'scheduled',
  patientId: 'patient-id',
});

// Update appointment
const updated = await client.updateAppointment('appointment-id', {
  status: 'confirmed',
});

// Delete appointment
await client.deleteAppointment('appointment-id');
```

### Clinical Encounters

```typescript
// Create encounter
const encounter = await client.createEncounter({
  patientId: 'patient-id',
  providerId: 'provider-id',
  type: 'consultation',
  chiefComplaint: 'Headache',
});

// Start encounter
await client.startEncounter(encounter.id);

// Add clinical note
const note = await client.addClinicalNote(encounter.id, {
  content: 'SOAP note content...',
  type: 'soap',
});

// Update encounter
await client.updateEncounter(encounter.id, {
  diagnosis: [
    {
      code: 'R51',
      description: 'Headache',
      type: 'primary',
    },
  ],
  vitals: {
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    temperature: 98.6,
  },
});

// End encounter
await client.endEncounter(encounter.id);
```

### Document Management

```typescript
// Upload document
const document = await client.uploadDocument({
  file: fileBlob,
  patientId: 'patient-id',
  category: 'lab-result',
  description: 'Blood test results',
});

// List documents
const documents = await client.listDocuments({
  patientId: 'patient-id',
  category: 'lab-result',
});

// Get download URL
const downloadInfo = await client.getDocumentDownloadUrl('document-id');
const response = await fetch(downloadInfo.url);
const blob = await response.blob();

// Delete document
await client.deleteDocument('document-id');
```

## Error Handling

```typescript
try {
  const patient = await client.getPatient('invalid-id');
} catch (error) {
  if (error.error === 'Not Found') {
    console.error('Patient not found');
  } else if (error.error === 'Unauthorized') {
    console.error('Authentication required');
    // Redirect to login
  } else {
    console.error('API Error:', error.message);
  }
}
```

## React Integration

### With React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: 'https://api.unifiedhealth.com/api/v1',
  accessToken: getAccessToken(),
});

// Query hook
function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: () => client.listAppointments({ page: 1, limit: 20 }),
  });
}

// Mutation hook
function useCreateAppointment() {
  return useMutation({
    mutationFn: (data) => client.createAppointment(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

// Usage in component
function AppointmentsPage() {
  const { data, isLoading, error } = useAppointments();
  const createMutation = useCreateAppointment();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Appointments</h1>
      {data.data.map((appointment) => (
        <div key={appointment.id}>{appointment.reason}</div>
      ))}
    </div>
  );
}
```

## React Native Integration

```typescript
import { createClient } from '@unified-health/sdk';
import * as SecureStore from 'expo-secure-store';

const client = createClient({
  baseURL: 'https://api.unifiedhealth.com/api/v1',
  onTokenRefresh: async (tokens) => {
    // Save tokens securely
    await SecureStore.setItemAsync('accessToken', tokens.accessToken);
    await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
  },
});

// Load tokens on app start
async function initializeClient() {
  const accessToken = await SecureStore.getItemAsync('accessToken');
  const refreshToken = await SecureStore.getItemAsync('refreshToken');

  if (accessToken && refreshToken) {
    client.setTokens(accessToken, refreshToken);
  }
}
```

## API Reference

### Authentication Methods

- `register(input)` - Register a new user
- `login(input)` - Login and obtain tokens
- `logout()` - Logout and invalidate session
- `getCurrentUser()` - Get current user information
- `refreshTokens(input)` - Refresh access token

### User Methods

- `getUser(userId)` - Get user by ID
- `updateUser(userId, input)` - Update user information

### Patient Methods

- `createPatient(input)` - Create a new patient
- `getPatient(patientId)` - Get patient by ID
- `updatePatient(patientId, input)` - Update patient information

### Appointment Methods

- `createAppointment(input)` - Create an appointment
- `listAppointments(params)` - List appointments with filters
- `getAppointment(appointmentId)` - Get appointment by ID
- `updateAppointment(appointmentId, input)` - Update appointment
- `deleteAppointment(appointmentId)` - Delete appointment

### Encounter Methods

- `createEncounter(input)` - Create a clinical encounter
- `listEncounters(params)` - List encounters with filters
- `getEncounter(encounterId)` - Get encounter by ID
- `updateEncounter(encounterId, input)` - Update encounter
- `startEncounter(encounterId)` - Start an encounter
- `endEncounter(encounterId)` - End an encounter
- `addClinicalNote(encounterId, input)` - Add clinical note
- `getClinicalNotes(encounterId)` - Get all clinical notes

### Document Methods

- `uploadDocument(input)` - Upload a document
- `listDocuments(params)` - List documents with filters
- `getDocument(documentId)` - Get document metadata
- `getDocumentDownloadUrl(documentId)` - Get pre-signed download URL
- `deleteDocument(documentId)` - Delete document
- `getPatientDocuments(patientId)` - Get all documents for a patient

### Visit Methods

- `startVisit(visitId)` - Start a telehealth visit
- `endVisit(visitId)` - End a telehealth visit
- `sendChatMessage(visitId, input)` - Send chat message

### Plan & Subscription Methods

- `listPlans()` - List available subscription plans
- `createSubscription(input)` - Create a subscription
- `cancelSubscription(subscriptionId)` - Cancel subscription

### Consent Methods

- `createConsent(input)` - Create consent record
- `getConsent(consentId)` - Get consent by ID

### Audit Methods

- `listAuditEvents(params)` - List audit events (admin only)

### System Methods

- `getVersion()` - Get API version
- `getPublicConfig()` - Get public configuration

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions for all methods and responses.

```typescript
import {
  UnifiedHealthClient,
  Patient,
  Appointment,
  Encounter,
  Document,
  CreatePatientInput,
  UpdatePatientInput,
  // ... and many more types
} from '@unified-health/sdk';
```

## Contributing

Contributions are welcome! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT

## Support

For support and questions:
- Documentation: https://docs.unifiedhealth.com
- Email: api-support@unifiedhealth.com
- GitHub Issues: https://github.com/unified-health/platform/issues
