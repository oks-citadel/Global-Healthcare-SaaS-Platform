/**
 * Centralized test fixtures for API tests
 * All test data is deterministic and seeded
 */

// Test Organizations (Tenants)
export const testOrganizations = {
  premium: {
    id: 'org-test-premium-001',
    name: 'Premium Test Clinic',
    tier: 'premium',
    domain: 'premium.test.unified.health',
  },
  basic: {
    id: 'org-test-basic-001',
    name: 'Basic Test Practice',
    tier: 'free',
    domain: 'basic.test.unified.health',
  },
  enterprise: {
    id: 'org-test-enterprise-001',
    name: 'Enterprise Hospital',
    tier: 'enterprise',
    domain: 'enterprise.test.unified.health',
  },
};

// Test Users
export const testUsers = {
  patient: {
    id: 'user-test-patient-001',
    email: 'patient@test.unified.health',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Patient',
    role: 'patient',
    tenantId: testOrganizations.premium.id,
    emailVerified: true,
  },
  patient2: {
    id: 'user-test-patient-002',
    email: 'patient2@test.unified.health',
    password: 'TestPassword123!',
    firstName: 'Second',
    lastName: 'Patient',
    role: 'patient',
    tenantId: testOrganizations.premium.id,
    emailVerified: true,
  },
  provider: {
    id: 'user-test-provider-001',
    email: 'provider@test.unified.health',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Provider',
    role: 'provider',
    tenantId: testOrganizations.premium.id,
    emailVerified: true,
    specialization: 'General Practice',
  },
  admin: {
    id: 'user-test-admin-001',
    email: 'admin@test.unified.health',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Admin',
    role: 'admin',
    tenantId: testOrganizations.premium.id,
    emailVerified: true,
  },
  superAdmin: {
    id: 'user-test-superadmin-001',
    email: 'superadmin@test.unified.health',
    password: 'TestPassword123!',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'super_admin',
    tenantId: testOrganizations.premium.id,
    emailVerified: true,
  },
  unverified: {
    id: 'user-test-unverified-001',
    email: 'unverified@test.unified.health',
    password: 'TestPassword123!',
    firstName: 'Unverified',
    lastName: 'User',
    role: 'patient',
    tenantId: testOrganizations.premium.id,
    emailVerified: false,
  },
  // User in different tenant for cross-tenant testing
  otherTenant: {
    id: 'user-test-other-001',
    email: 'other@test.unified.health',
    password: 'TestPassword123!',
    firstName: 'Other',
    lastName: 'Tenant',
    role: 'patient',
    tenantId: testOrganizations.basic.id,
    emailVerified: true,
  },
};

// Test Patients
export const testPatients = {
  patient1: {
    id: 'patient-test-001',
    userId: testUsers.patient.id,
    dateOfBirth: '1990-05-15',
    gender: 'male',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    medications: ['Lisinopril 10mg'],
    conditions: ['Hypertension'],
    emergencyContact: {
      name: 'Emergency Contact',
      phone: '+1-555-0100',
      relationship: 'Spouse',
    },
    tenantId: testOrganizations.premium.id,
  },
  patient2: {
    id: 'patient-test-002',
    userId: testUsers.patient2.id,
    dateOfBirth: '1985-08-22',
    gender: 'female',
    bloodType: 'A+',
    allergies: [],
    medications: [],
    conditions: [],
    emergencyContact: {
      name: 'Family Member',
      phone: '+1-555-0101',
      relationship: 'Parent',
    },
    tenantId: testOrganizations.premium.id,
  },
};

// Test Appointments
export const testAppointments = {
  upcoming: {
    id: 'apt-test-001',
    patientId: testPatients.patient1.id,
    providerId: testUsers.provider.id,
    type: 'checkup',
    status: 'scheduled',
    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    duration: 30,
    reason: 'Annual checkup',
    notes: 'Patient requested morning appointment',
    tenantId: testOrganizations.premium.id,
  },
  completed: {
    id: 'apt-test-002',
    patientId: testPatients.patient1.id,
    providerId: testUsers.provider.id,
    type: 'consultation',
    status: 'completed',
    scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    duration: 45,
    reason: 'Follow-up consultation',
    notes: 'Follow-up on blood pressure',
    tenantId: testOrganizations.premium.id,
  },
  cancelled: {
    id: 'apt-test-003',
    patientId: testPatients.patient1.id,
    providerId: testUsers.provider.id,
    type: 'consultation',
    status: 'cancelled',
    scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 30,
    reason: 'Routine visit',
    cancellationReason: 'Patient requested cancellation',
    tenantId: testOrganizations.premium.id,
  },
};

// Test Encounters
export const testEncounters = {
  active: {
    id: 'enc-test-001',
    patientId: testPatients.patient1.id,
    providerId: testUsers.provider.id,
    appointmentId: testAppointments.upcoming.id,
    type: 'in_person',
    status: 'in_progress',
    startedAt: new Date().toISOString(),
    chiefComplaint: 'Annual wellness visit',
    tenantId: testOrganizations.premium.id,
  },
  completed: {
    id: 'enc-test-002',
    patientId: testPatients.patient1.id,
    providerId: testUsers.provider.id,
    appointmentId: testAppointments.completed.id,
    type: 'in_person',
    status: 'completed',
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    chiefComplaint: 'Blood pressure follow-up',
    diagnosis: 'Hypertension - controlled',
    tenantId: testOrganizations.premium.id,
  },
};

// Test Documents
export const testDocuments = {
  labResult: {
    id: 'doc-test-001',
    patientId: testPatients.patient1.id,
    uploadedBy: testUsers.provider.id,
    type: 'lab_result',
    name: 'Blood Work Results - January 2026',
    mimeType: 'application/pdf',
    size: 125000,
    status: 'active',
    tenantId: testOrganizations.premium.id,
  },
  prescription: {
    id: 'doc-test-002',
    patientId: testPatients.patient1.id,
    uploadedBy: testUsers.provider.id,
    type: 'prescription',
    name: 'Prescription - Lisinopril',
    mimeType: 'application/pdf',
    size: 45000,
    status: 'active',
    tenantId: testOrganizations.premium.id,
  },
};

// Test Subscriptions
export const testSubscriptions = {
  premium: {
    id: 'sub-test-001',
    userId: testUsers.patient.id,
    planId: 'plan-premium',
    status: 'active',
    currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    tenantId: testOrganizations.premium.id,
  },
};

// Test Plans
export const testPlans = {
  free: {
    id: 'plan-free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: ['Basic appointments', 'Medical records view'],
  },
  premium: {
    id: 'plan-premium',
    name: 'Premium',
    price: 29.99,
    interval: 'month',
    features: ['Unlimited appointments', 'Telehealth', 'Priority support', 'AI symptom checker'],
  },
  enterprise: {
    id: 'plan-enterprise',
    name: 'Enterprise',
    price: 99.99,
    interval: 'month',
    features: ['Everything in Premium', 'Custom integrations', 'Dedicated support', 'SLA'],
  },
};

// Invalid test data for negative testing
export const invalidData = {
  emptyEmail: '',
  invalidEmail: 'not-an-email',
  shortPassword: '123',
  sqlInjection: "'; DROP TABLE users; --",
  xssPayload: '<script>alert("XSS")</script>',
  oversizedString: 'x'.repeat(100000),
  invalidUuid: 'not-a-uuid',
  futureDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 100).toISOString(), // 100 years
  pastDate: '1800-01-01T00:00:00.000Z',
  negativeNumber: -1,
  floatAsInt: 1.5,
};

// API Response schemas for contract testing
export const expectedSchemas = {
  user: {
    type: 'object',
    required: ['id', 'email', 'role', 'createdAt'],
    properties: {
      id: { type: 'string' },
      email: { type: 'string', format: 'email' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      role: { type: 'string', enum: ['patient', 'provider', 'admin', 'super_admin'] },
      emailVerified: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  appointment: {
    type: 'object',
    required: ['id', 'patientId', 'providerId', 'status', 'scheduledAt'],
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string' },
      providerId: { type: 'string' },
      type: { type: 'string' },
      status: { type: 'string', enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'] },
      scheduledAt: { type: 'string', format: 'date-time' },
      duration: { type: 'number' },
      reason: { type: 'string' },
      notes: { type: 'string' },
    },
  },
  error: {
    type: 'object',
    required: ['error'],
    properties: {
      error: {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
          details: { type: 'object' },
        },
      },
    },
  },
};
