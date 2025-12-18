/**
 * Test Fixtures
 * Provides common test data for unit tests
 */

export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  role: 'patient' as const,
  status: 'active' as const,
  emailVerified: true,
  passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};

export const mockProvider = {
  id: 'provider-123',
  userId: 'user-provider-123',
  firstName: 'Dr. Jane',
  lastName: 'Smith',
  email: 'dr.smith@example.com',
  phone: '+1234567891',
  specialization: 'Cardiology',
  licenseNumber: 'LIC-123456',
  npiNumber: 'NPI-1234567890',
  status: 'active' as const,
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};

export const mockPatient = {
  id: 'patient-123',
  userId: 'user-123',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date('1990-01-01'),
  gender: 'male' as const,
  phone: '+1234567890',
  email: 'john.doe@example.com',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  emergencyContactName: 'Jane Doe',
  emergencyContactPhone: '+1234567891',
  medicalRecordNumber: 'MRN-123456',
  bloodType: 'O+',
  allergies: [],
  chronicConditions: [],
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};

export const mockAppointment = {
  id: 'appt-123',
  patientId: 'patient-123',
  providerId: 'provider-123',
  scheduledAt: new Date('2025-01-20T10:00:00Z'),
  duration: 30,
  type: 'checkup' as const,
  status: 'scheduled' as const,
  reasonForVisit: 'Annual checkup',
  notes: null,
  createdAt: new Date('2025-01-15T10:00:00Z'),
  updatedAt: new Date('2025-01-15T10:00:00Z'),
};

export const mockEncounter = {
  id: 'enc-123',
  appointmentId: 'appt-123',
  patientId: 'patient-123',
  providerId: 'provider-123',
  date: new Date('2025-01-20T10:00:00Z'),
  chiefComplaint: 'Annual checkup',
  diagnosis: 'Healthy',
  treatmentPlan: 'Continue regular exercise',
  notes: 'Patient in good health',
  status: 'completed' as const,
  createdAt: new Date('2025-01-20T11:00:00Z'),
  updatedAt: new Date('2025-01-20T11:00:00Z'),
};

export const mockDocument = {
  id: 'doc-123',
  patientId: 'patient-123',
  name: 'Lab Results',
  type: 'lab_result' as const,
  url: 'https://storage.example.com/documents/lab-results-123.pdf',
  size: 1024000,
  mimeType: 'application/pdf',
  uploadedBy: 'provider-123',
  encrypted: true,
  createdAt: new Date('2025-01-20T12:00:00Z'),
  updatedAt: new Date('2025-01-20T12:00:00Z'),
};

export const mockNotification = {
  id: 'notif-123',
  userId: 'user-123',
  type: 'appointment_reminder' as const,
  title: 'Appointment Reminder',
  message: 'Your appointment is scheduled for tomorrow at 10:00 AM',
  read: false,
  data: {
    appointmentId: 'appt-123',
  },
  createdAt: new Date('2025-01-19T10:00:00Z'),
  updatedAt: new Date('2025-01-19T10:00:00Z'),
};

export const mockPushDevice = {
  id: 'device-123',
  userId: 'user-123',
  token: 'fcm-token-abc123xyz',
  platform: 'android' as const,
  deviceId: 'device-android-123',
  enabled: true,
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};

export const mockSubscription = {
  id: 'sub-123',
  organizationId: 'org-123',
  planId: 'plan-123',
  status: 'active' as const,
  currentPeriodStart: new Date('2025-01-01T00:00:00Z'),
  currentPeriodEnd: new Date('2025-02-01T00:00:00Z'),
  stripeSubscriptionId: 'sub_stripe123',
  stripeCustomerId: 'cus_stripe123',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};

export const mockPayment = {
  id: 'pay-123',
  subscriptionId: 'sub-123',
  amount: 9900,
  currency: 'usd',
  status: 'succeeded' as const,
  stripePaymentIntentId: 'pi_stripe123',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};

export const mockConsent = {
  id: 'consent-123',
  patientId: 'patient-123',
  type: 'data_sharing' as const,
  granted: true,
  grantedAt: new Date('2025-01-01T00:00:00Z'),
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};

export const mockAuditLog = {
  id: 'audit-123',
  userId: 'user-123',
  action: 'patient.view',
  resource: 'patient',
  resourceId: 'patient-123',
  details: { field: 'medicalRecord' },
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0',
  createdAt: new Date('2025-01-20T10:00:00Z'),
};

export const mockJwtPayload = {
  userId: 'user-123',
  email: 'test@example.com',
  role: 'patient' as const,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
};

export const mockEncryptionKey = 'test-32-byte-encryption-key-here!!';

export const mockRedisConfig = {
  host: 'localhost',
  port: 6379,
  password: undefined,
  db: 0,
  keyPrefix: 'test',
  defaultTTL: 3600,
};

export const mockWebPushSubscription = JSON.stringify({
  endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
  keys: {
    p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls',
    auth: 'tBHItJI5svbpez7KI4CCXg',
  },
});
