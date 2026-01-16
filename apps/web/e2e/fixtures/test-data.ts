/**
 * Test Data Fixtures
 *
 * Centralized test data for E2E testing including user credentials,
 * patient information, and appointment data.
 */

export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor' | 'admin';
  phoneNumber?: string;
}

export interface TestPatient {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  medicalHistory?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
  };
}

export interface TestAppointment {
  id?: string;
  patientId: string;
  doctorId: string;
  appointmentType: 'consultation' | 'follow-up' | 'emergency' | 'routine-checkup';
  date: string;
  time: string;
  duration: number; // in minutes
  reason: string;
  notes?: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface TestDocument {
  name: string;
  type: 'lab-result' | 'prescription' | 'imaging' | 'other';
  file: string; // File path
  description?: string;
}

// Test Users
export const testUsers: Record<string, TestUser> = {
  patient1: {
    email: 'patient1@test.com',
    password: 'Test@1234',
    firstName: 'John',
    lastName: 'Doe',
    role: 'patient',
    phoneNumber: '+1-555-0101',
  },
  patient2: {
    email: 'patient2@test.com',
    password: 'Test@1234',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'patient',
    phoneNumber: '+1-555-0102',
  },
  doctor1: {
    email: 'doctor1@test.com',
    password: 'Test@1234',
    firstName: 'Robert',
    lastName: 'Johnson',
    role: 'doctor',
    phoneNumber: '+1-555-0201',
  },
  admin1: {
    email: 'admin1@test.com',
    password: 'Test@1234',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phoneNumber: '+1-555-0301',
  },
};

// Test Patients
export const testPatients: Record<string, TestPatient> = {
  patient1: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    email: 'patient1@test.com',
    phoneNumber: '+1-555-0101',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Mary Doe',
      relationship: 'Spouse',
      phoneNumber: '+1-555-0199',
    },
    medicalHistory: {
      allergies: ['Penicillin', 'Peanuts'],
      medications: ['Aspirin 81mg daily'],
      conditions: ['Hypertension'],
    },
  },
  patient2: {
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1985-08-20',
    gender: 'female',
    email: 'patient2@test.com',
    phoneNumber: '+1-555-0102',
    address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Bob Smith',
      relationship: 'Spouse',
      phoneNumber: '+1-555-0198',
    },
    medicalHistory: {
      allergies: ['Latex'],
      medications: [],
      conditions: ['Asthma'],
    },
  },
};

// Test Appointments
export const testAppointments: Record<string, TestAppointment> = {
  appointment1: {
    patientId: 'patient1',
    doctorId: 'doctor1',
    appointmentType: 'consultation',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    time: '10:00',
    duration: 30,
    reason: 'Annual checkup',
    notes: 'Patient reports feeling well overall',
    status: 'scheduled',
  },
  appointment2: {
    patientId: 'patient1',
    doctorId: 'doctor1',
    appointmentType: 'follow-up',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    time: '14:30',
    duration: 20,
    reason: 'Follow-up for hypertension',
    notes: 'Check blood pressure readings',
    status: 'scheduled',
  },
  appointment3: {
    patientId: 'patient2',
    doctorId: 'doctor1',
    appointmentType: 'routine-checkup',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    time: '09:00',
    duration: 30,
    reason: 'Asthma check',
    notes: 'Review inhaler usage',
    status: 'scheduled',
  },
};

// Test Documents
export const testDocuments: Record<string, TestDocument> = {
  labResult: {
    name: 'Blood Test Results',
    type: 'lab-result',
    file: './fixtures/files/sample-lab-result.pdf',
    description: 'Complete blood count results',
  },
  prescription: {
    name: 'Prescription',
    type: 'prescription',
    file: './fixtures/files/sample-prescription.pdf',
    description: 'Current medications list',
  },
  imaging: {
    name: 'X-Ray Results',
    type: 'imaging',
    file: './fixtures/files/sample-xray.jpg',
    description: 'Chest X-ray',
  },
};

// Invalid credentials for negative testing
export const invalidCredentials = {
  invalidEmail: {
    email: 'invalid@test.com',
    password: 'Test@1234',
  },
  invalidPassword: {
    email: 'patient1@test.com',
    password: 'WrongPassword',
  },
  emptyCredentials: {
    email: '',
    password: '',
  },
  malformedEmail: {
    email: 'not-an-email',
    password: 'Test@1234',
  },
};

// Helper function to generate random patient data
export function generateRandomPatient(): TestPatient {
  const timestamp = Date.now();
  return {
    firstName: `Test${timestamp}`,
    lastName: `Patient${timestamp}`,
    dateOfBirth: '1995-01-01',
    gender: 'other',
    email: `test${timestamp}@test.com`,
    phoneNumber: `+1-555-${String(timestamp).slice(-4)}`,
    address: {
      street: `${timestamp} Test Street`,
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Emergency Contact',
      relationship: 'Friend',
      phoneNumber: '+1-555-9999',
    },
  };
}

// Helper function to generate random appointment
export function generateRandomAppointment(patientId: string, doctorId: string): TestAppointment {
  const daysFromNow = Math.floor(Math.random() * 30) + 1;
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);

  return {
    patientId,
    doctorId,
    appointmentType: 'consultation',
    date: date.toISOString().split('T')[0],
    time: '10:00',
    duration: 30,
    reason: 'Test appointment',
    status: 'scheduled',
  };
}

// API endpoints for testing
export const apiEndpoints = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    profile: '/api/auth/profile',
  },
  patients: {
    list: '/api/patients',
    detail: (id: string) => `/api/patients/${id}`,
    create: '/api/patients',
    update: (id: string) => `/api/patients/${id}`,
    delete: (id: string) => `/api/patients/${id}`,
  },
  appointments: {
    list: '/api/appointments',
    detail: (id: string) => `/api/appointments/${id}`,
    create: '/api/appointments',
    update: (id: string) => `/api/appointments/${id}`,
    cancel: (id: string) => `/api/appointments/${id}/cancel`,
  },
  documents: {
    list: '/api/documents',
    upload: '/api/documents/upload',
    download: (id: string) => `/api/documents/${id}/download`,
    delete: (id: string) => `/api/documents/${id}`,
  },
};

// Storage keys
export const storageKeys = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
};
