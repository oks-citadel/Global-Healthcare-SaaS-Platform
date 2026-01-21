/**
 * Mock Data Factories
 * Factory functions for creating test data objects
 */

import {
  randomEmail,
  randomPhone,
  randomUUID,
  randomFutureDate,
  randomPastDate,
  randomString,
  randomInt,
  randomPick,
  randomAppointmentType,
  randomAppointmentStatus,
  randomVitals,
  randomAllergy,
  randomMedication,
  randomMRN,
  randomNPI,
} from './test-data-generators';

/**
 * Create a mock user
 */
export function createMockUser(overrides: Partial<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}> = {}): {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
} {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    email: randomEmail(),
    firstName: randomPick(['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily']),
    lastName: randomPick(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia']),
    phone: randomPhone(),
    role: 'patient',
    status: 'active',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock provider
 */
export function createMockProvider(overrides: Partial<{
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  specialties: string[];
  npi: string;
  licenseNumber: string;
  bio: string;
  languages: string[];
  acceptingNewPatients: boolean;
  createdAt: string;
  updatedAt: string;
}> = {}): {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  specialties: string[];
  npi: string;
  licenseNumber: string;
  bio: string;
  languages: string[];
  acceptingNewPatients: boolean;
  createdAt: string;
  updatedAt: string;
} {
  const now = new Date().toISOString();
  const firstName = randomPick(['Robert', 'Maria', 'James', 'Lisa', 'William', 'Jennifer']);
  const lastName = randomPick(['Anderson', 'Martinez', 'Taylor', 'Thomas', 'Moore', 'Jackson']);

  return {
    id: randomUUID(),
    userId: randomUUID(),
    firstName,
    lastName,
    email: randomEmail(),
    specialties: ['internal_medicine'],
    npi: randomNPI(),
    licenseNumber: `MD${randomInt(100000, 999999)}`,
    bio: `Dr. ${lastName} is a board-certified physician with extensive experience.`,
    languages: ['en'],
    acceptingNewPatients: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock appointment
 */
export function createMockAppointment(overrides: Partial<{
  id: string;
  patientId: string;
  providerId: string;
  tenantId: string;
  type: string;
  status: string;
  scheduledAt: string;
  duration: number;
  reason: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}> = {}): {
  id: string;
  patientId: string;
  providerId: string;
  tenantId: string;
  type: string;
  status: string;
  scheduledAt: string;
  duration: number;
  reason: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
} {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    patientId: randomUUID(),
    providerId: randomUUID(),
    tenantId: randomUUID(),
    type: randomAppointmentType(),
    status: randomAppointmentStatus(),
    scheduledAt: randomFutureDate(30).toISOString(),
    duration: randomPick([15, 30, 45, 60]),
    reason: randomPick([
      'Annual checkup',
      'Follow-up visit',
      'New symptoms',
      'Medication review',
      'Consultation',
    ]),
    notes: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock patient record
 */
export function createMockPatient(overrides: Partial<{
  id: string;
  userId: string;
  mrn: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  createdAt: string;
  updatedAt: string;
}> = {}): {
  id: string;
  userId: string;
  mrn: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  createdAt: string;
  updatedAt: string;
} {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    userId: randomUUID(),
    mrn: randomMRN(),
    dateOfBirth: randomPastDate(365 * 50).toISOString().split('T')[0],
    gender: randomPick(['male', 'female', 'other', 'prefer_not_to_say']),
    bloodType: randomPick(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    emergencyContactName: `${randomPick(['John', 'Jane'])} ${randomPick(['Doe', 'Smith'])}`,
    emergencyContactPhone: randomPhone(),
    insuranceProvider: randomPick(['BlueCross', 'Aetna', 'United', 'Cigna', 'Kaiser']),
    insurancePolicyNumber: `POL${randomInt(100000000, 999999999)}`,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock lab result
 */
export function createMockLabResult(overrides: Partial<{
  id: string;
  patientId: string;
  testName: string;
  testCode: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: string;
  resultDate: string;
  orderedBy: string;
  createdAt: string;
}> = {}): {
  id: string;
  patientId: string;
  testName: string;
  testCode: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: string;
  resultDate: string;
  orderedBy: string;
  createdAt: string;
} {
  const now = new Date().toISOString();
  const testTypes = [
    { name: 'Complete Blood Count', code: 'CBC', unit: 'cells/mcL', range: '4500-11000' },
    { name: 'Hemoglobin A1c', code: 'HBA1C', unit: '%', range: '4.0-5.6' },
    { name: 'Cholesterol, Total', code: 'CHOL', unit: 'mg/dL', range: '<200' },
    { name: 'Glucose, Fasting', code: 'GLU', unit: 'mg/dL', range: '70-100' },
    { name: 'Creatinine', code: 'CREAT', unit: 'mg/dL', range: '0.7-1.3' },
  ];

  const test = randomPick(testTypes);

  return {
    id: randomUUID(),
    patientId: randomUUID(),
    testName: test.name,
    testCode: test.code,
    value: randomInt(50, 150).toString(),
    unit: test.unit,
    referenceRange: test.range,
    status: randomPick(['pending', 'completed', 'reviewed']),
    resultDate: randomPastDate(30).toISOString(),
    orderedBy: randomUUID(),
    createdAt: now,
    ...overrides,
  };
}

/**
 * Create a mock prescription
 */
export function createMockPrescription(overrides: Partial<{
  id: string;
  patientId: string;
  providerId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  quantity: number;
  refillsRemaining: number;
  startDate: string;
  endDate: string;
  status: string;
  instructions: string;
  createdAt: string;
}> = {}): {
  id: string;
  patientId: string;
  providerId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  quantity: number;
  refillsRemaining: number;
  startDate: string;
  endDate: string;
  status: string;
  instructions: string;
  createdAt: string;
} {
  const now = new Date().toISOString();
  const med = randomMedication();

  return {
    id: randomUUID(),
    patientId: randomUUID(),
    providerId: randomUUID(),
    medicationName: med.name,
    dosage: med.dosage,
    frequency: med.frequency,
    quantity: randomPick([30, 60, 90]),
    refillsRemaining: randomInt(0, 3),
    startDate: randomPastDate(30).toISOString(),
    endDate: randomFutureDate(365).toISOString(),
    status: randomPick(['active', 'completed', 'discontinued']),
    instructions: `Take ${med.dosage} ${med.frequency}`,
    createdAt: now,
    ...overrides,
  };
}

/**
 * Create a mock invoice
 */
export function createMockInvoice(overrides: Partial<{
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
}> = {}): {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
} {
  const now = new Date().toISOString();
  const status = randomPick(['draft', 'open', 'paid', 'void', 'uncollectible']);

  return {
    id: randomUUID(),
    userId: randomUUID(),
    amount: randomPick([2999, 4999, 9999, 14999, 19999]),
    currency: 'usd',
    status,
    description: 'Monthly subscription',
    dueDate: randomFutureDate(30).toISOString(),
    paidAt: status === 'paid' ? randomPastDate(7).toISOString() : null,
    createdAt: now,
    ...overrides,
  };
}

/**
 * Create a mock notification
 */
export function createMockNotification(overrides: Partial<{
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: string;
}> = {}): {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: string;
} {
  const types = [
    { type: 'appointment_reminder', title: 'Appointment Reminder', message: 'Your appointment is tomorrow at 10:00 AM' },
    { type: 'message', title: 'New Message', message: 'You have a new message from Dr. Smith' },
    { type: 'lab_results', title: 'Lab Results Ready', message: 'Your lab results are now available' },
    { type: 'prescription', title: 'Prescription Ready', message: 'Your prescription is ready for pickup' },
  ];

  const notification = randomPick(types);

  return {
    id: randomUUID(),
    userId: randomUUID(),
    type: notification.type,
    title: notification.title,
    message: notification.message,
    read: false,
    actionUrl: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock conversation/message thread
 */
export function createMockConversation(overrides: Partial<{
  id: string;
  participants: string[];
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
}> = {}): {
  id: string;
  participants: string[];
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
} {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    participants: [randomUUID(), randomUUID()],
    lastMessageAt: randomPastDate(7).toISOString(),
    unreadCount: randomInt(0, 5),
    createdAt: now,
    ...overrides,
  };
}

/**
 * Create a mock message
 */
export function createMockMessage(overrides: Partial<{
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
}> = {}): {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
} {
  const messages = [
    'Hello, I have a question about my medication.',
    'Thank you for the information.',
    'When should I schedule my next appointment?',
    'I am experiencing some side effects.',
    'Could you please clarify the dosage?',
  ];

  return {
    id: randomUUID(),
    conversationId: randomUUID(),
    senderId: randomUUID(),
    content: randomPick(messages),
    read: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}
