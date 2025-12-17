# Repository Layer Documentation

This directory contains the repository layer implementation for the Global Healthcare SaaS Platform API. The repository pattern provides an abstraction layer between the business logic (services) and data access (Prisma ORM).

## Architecture

### Base Repository
The `BaseRepository` class provides generic CRUD operations that all specific repositories extend:

- **Generic Operations**: findById, findOne, findMany, create, update, delete
- **Pagination Support**: findWithPagination with page/limit parameters
- **Transaction Support**: Execute operations within database transactions
- **Bulk Operations**: createMany, updateMany, deleteMany
- **Utility Methods**: exists, count, upsert

### Repository Structure

```
repositories/
├── base.repository.ts          # Abstract base repository with generic operations
├── user.repository.ts          # User management operations
├── patient.repository.ts       # Patient record operations
├── provider.repository.ts      # Healthcare provider operations
├── appointment.repository.ts   # Appointment scheduling operations
├── encounter.repository.ts     # Clinical encounter operations
├── document.repository.ts      # Medical document operations
├── subscription.repository.ts  # Billing subscription operations
├── consent.repository.ts       # Patient consent operations
├── audit.repository.ts         # Audit log operations
└── index.ts                    # Central export file
```

## Repository Implementations

### User Repository
**File**: `user.repository.ts`

**Key Methods**:
- `findByEmail(email)` - Find user by email address
- `findByRole(role)` - Get all users with specific role
- `findByStatus(status)` - Filter users by status
- `updateEmailVerification(id, verified)` - Update email verification status
- `updatePassword(id, hashedPassword)` - Update user password
- `searchUsers(query, options)` - Search users by name or email
- `emailExists(email, excludeUserId)` - Check if email is already in use

### Patient Repository
**File**: `patient.repository.ts`

**Key Methods**:
- `findByUserId(userId)` - Get patient by associated user ID
- `findByMRN(medicalRecordNumber)` - Find by medical record number
- `findByGender(gender)` - Filter patients by gender
- `findByBloodType(bloodType)` - Filter by blood type
- `findByAllergy(allergy)` - Find patients with specific allergy
- `findWithFullDetails(id)` - Get patient with all related data
- `searchPatients(query, options)` - Search by name or MRN
- `findByAgeRange(minAge, maxAge)` - Filter by age range
- `addAllergy(id, allergy)` - Add allergy to patient record
- `removeAllergy(id, allergy)` - Remove allergy from patient record

### Provider Repository
**File**: `provider.repository.ts`

**Key Methods**:
- `findByUserId(userId)` - Get provider by user ID
- `findByLicenseNumber(licenseNumber)` - Find by license number
- `findBySpecialty(specialty)` - Filter by medical specialty
- `findAvailable()` - Get all available providers
- `findAvailableBySpecialty(specialty)` - Available providers for specialty
- `updateAvailability(id, available)` - Update provider availability
- `addSpecialty(id, specialty)` - Add specialty to provider
- `getProviderStats(providerId)` - Get appointment and encounter statistics

### Appointment Repository
**File**: `appointment.repository.ts`

**Key Methods**:
- `findByPatientId(patientId)` - Get patient's appointments
- `findByProviderId(providerId)` - Get provider's appointments
- `findByStatus(status)` - Filter by appointment status
- `findUpcoming(options)` - Get upcoming appointments
- `findPast(options)` - Get past appointments
- `findByDateRange(startDate, endDate, options)` - Filter by date range
- `findToday(providerId)` - Get today's appointments
- `hasConflict(providerId, scheduledAt, duration)` - Check scheduling conflicts
- `cancel(id)` - Cancel appointment
- `confirm(id)` - Confirm appointment
- `complete(id)` - Mark as completed

### Encounter Repository
**File**: `encounter.repository.ts`

**Key Methods**:
- `findByPatientId(patientId)` - Get patient's encounters
- `findByProviderId(providerId)` - Get provider's encounters
- `findByAppointmentId(appointmentId)` - Get encounter for appointment
- `findByStatus(status)` - Filter by encounter status
- `findActive(providerId)` - Get active encounters
- `start(id)` - Start encounter
- `end(id)` - End encounter
- `addNote(encounterId, noteData)` - Add clinical note
- `getNotes(encounterId)` - Get all clinical notes
- `getProviderStats(providerId, startDate, endDate)` - Get statistics

### Document Repository
**File**: `document.repository.ts`

**Key Methods**:
- `findByPatientId(patientId)` - Get patient's documents
- `findByType(type)` - Filter by document type
- `findByPatientAndType(patientId, type)` - Specific patient document type
- `searchDocuments(query, options)` - Search by filename or description
- `findByMimeType(mimeType)` - Filter by MIME type
- `getTotalStorageByPatient(patientId)` - Calculate storage used
- `getPatientDocumentStats(patientId)` - Get document statistics
- `updateMetadata(id, metadata)` - Update document metadata

### Subscription Repository
**File**: `subscription.repository.ts`

**Key Methods**:
- `findByUserId(userId)` - Get user's subscriptions
- `findActiveByUserId(userId)` - Get active subscription
- `findByStripeSubscriptionId(stripeSubscriptionId)` - Find by Stripe ID
- `findExpiring(daysFromNow)` - Get expiring subscriptions
- `findExpired()` - Get expired subscriptions
- `updateStatus(id, status)` - Update subscription status
- `setCancelAtPeriodEnd(id, cancel)` - Schedule cancellation
- `cancelImmediately(id)` - Cancel subscription now
- `reactivate(id)` - Reactivate cancelled subscription
- `getStats()` - Get subscription statistics
- `markExpiredSubscriptions()` - Batch update expired subscriptions

### Consent Repository
**File**: `consent.repository.ts`

**Key Methods**:
- `findByPatientId(patientId)` - Get patient's consents
- `findByPatientAndType(patientId, type)` - Specific consent type
- `findActiveByPatientAndType(patientId, type)` - Active consent
- `hasGrantedConsent(patientId, type)` - Check if consent granted
- `grantConsent(patientId, type, options)` - Grant consent
- `revokeConsent(patientId, type)` - Revoke consent
- `findExpiring(daysFromNow, patientId)` - Get expiring consents
- `getPatientSummary(patientId)` - Get all consent statuses
- `bulkGrantConsents(patientId, consents)` - Grant multiple consents

### Audit Repository
**File**: `audit.repository.ts`

**Key Methods**:
- `findByUserId(userId)` - Get user's audit events
- `findByAction(action)` - Filter by action type
- `findByResource(resource)` - Filter by resource type
- `findByResourceId(resourceId)` - Get resource history
- `findByDateRange(startDate, endDate, options)` - Filter by date
- `createEvent(data)` - Log new audit event
- `searchEvents(query, options)` - Search audit logs
- `getStats(startDate, endDate)` - Get audit statistics
- `getUserActivitySummary(userId, startDate, endDate)` - User activity report
- `getResourceHistory(resource, resourceId, limit)` - Resource access history
- `cleanOldEvents(daysToKeep)` - Clean up old audit logs

## Usage Examples

### Basic CRUD Operations

```typescript
import { patientRepository } from './repositories/index.js';

// Create
const patient = await patientRepository.create({
  userId: 'user-123',
  medicalRecordNumber: 'MRN-12345',
  dateOfBirth: new Date('1990-01-01'),
  gender: 'male',
  allergies: ['penicillin'],
});

// Read
const foundPatient = await patientRepository.findById(patient.id);

// Update
const updated = await patientRepository.update(patient.id, {
  allergies: ['penicillin', 'peanuts'],
});

// Delete
await patientRepository.delete(patient.id);
```

### Pagination

```typescript
import { appointmentRepository } from './repositories/index.js';

const result = await appointmentRepository.findWithPagination(
  { status: 'scheduled' },
  { page: 1, limit: 20 },
  { orderBy: { scheduledAt: 'asc' } }
);

console.log(result.data); // Array of appointments
console.log(result.pagination); // { page, limit, total, totalPages }
```

### Transactions

```typescript
import { patientRepository, userRepository } from './repositories/index.js';

await patientRepository.transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'test@example.com', ... }
  });

  const patient = await tx.patient.create({
    data: { userId: user.id, ... }
  });

  return { user, patient };
});
```

### Complex Queries

```typescript
import { appointmentRepository } from './repositories/index.js';

// Find appointments with filters
const appointments = await appointmentRepository.findWithFilters(
  {
    patientId: 'patient-123',
    status: 'scheduled',
    fromDate: new Date('2025-01-01'),
    toDate: new Date('2025-12-31'),
  },
  { page: 1, limit: 50 }
);

// Check for scheduling conflicts
const hasConflict = await appointmentRepository.hasConflict(
  'provider-123',
  new Date('2025-12-17T10:00:00Z'),
  60 // duration in minutes
);
```

### Search Operations

```typescript
import { patientRepository, documentRepository } from './repositories/index.js';

// Search patients
const patients = await patientRepository.searchPatients('john', {
  limit: 20,
  includeUser: true,
});

// Search documents
const documents = await documentRepository.searchDocuments('lab result', {
  patientId: 'patient-123',
  type: 'lab_result',
  limit: 10,
});
```

## Best Practices

### 1. Use Repositories in Services
Services should use repositories instead of direct Prisma calls:

```typescript
// Good
import { patientRepository } from '../repositories/index.js';
const patient = await patientRepository.findById(id);

// Avoid
import { prisma } from '../lib/prisma.js';
const patient = await prisma.patient.findUnique({ where: { id } });
```

### 2. Handle Errors in Services
Repositories throw errors that should be caught in service layer:

```typescript
async getPatient(id: string) {
  const patient = await patientRepository.findById(id);
  if (!patient) {
    throw new NotFoundError('Patient not found');
  }
  return patient;
}
```

### 3. Use Transactions for Multi-Step Operations
When operations depend on each other, use transactions:

```typescript
await repository.transaction(async (tx) => {
  // All operations here are atomic
  await tx.user.create(...);
  await tx.patient.create(...);
});
```

### 4. Leverage Specialized Methods
Use repository-specific methods for common queries:

```typescript
// Better
const available = await providerRepository.findAvailableBySpecialty('cardiology');

// Instead of
const available = await providerRepository.findMany({
  where: { available: true, specialty: { has: 'cardiology' } }
});
```

### 5. Use Pagination for Large Datasets
Always paginate when fetching potentially large result sets:

```typescript
const result = await repository.findWithPagination(
  filters,
  { page: 1, limit: 50 }
);
```

## Testing Repositories

When testing services, you can mock repositories:

```typescript
import { patientRepository } from '../repositories/index.js';
import { vi } from 'vitest';

vi.mock('../repositories/index.js', () => ({
  patientRepository: {
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

// In test
patientRepository.findById.mockResolvedValue(mockPatient);
```

## Performance Considerations

1. **Use Includes Wisely**: Only include relations you need
2. **Index Usage**: Repositories leverage Prisma indexes defined in schema
3. **Batch Operations**: Use `createMany`, `updateMany` for bulk operations
4. **Caching**: Consider implementing caching layer above repositories
5. **Connection Pooling**: Configured in Prisma client setup

## Migration Guide

To migrate existing services to use repositories:

1. Import repository instead of prisma
2. Replace `prisma.model.*` with `repository.*`
3. Adjust method names (e.g., `findUnique` → `findById`)
4. Use specialized methods where available
5. Test thoroughly

Example:
```typescript
// Before
import { prisma } from '../lib/prisma.js';
const patient = await prisma.patient.findUnique({ where: { userId } });

// After
import { patientRepository } from '../repositories/index.js';
const patient = await patientRepository.findByUserId(userId);
```

## Contributing

When adding new repositories:

1. Extend `BaseRepository` class
2. Add model-specific query methods
3. Include proper TypeScript typing
4. Add JSDoc comments for all methods
5. Export from `index.ts`
6. Update this README with usage examples

## Support

For questions or issues with the repository layer:
- Check the inline JSDoc comments in repository files
- Review the base repository for available generic methods
- Consult the Prisma schema for available fields and relations
