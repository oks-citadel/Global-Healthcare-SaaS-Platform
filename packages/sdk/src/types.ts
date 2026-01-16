// ==========================================
// Common Types
// ==========================================

export interface ApiError {
  error: string;
  message: string;
  timestamp: string;
  path?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==========================================
// Auth Types
// ==========================================

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  role?: 'patient' | 'provider' | 'admin';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

// ==========================================
// User Types
// ==========================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'patient' | 'provider' | 'admin';
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

// ==========================================
// Patient Types
// ==========================================

export interface Patient {
  id: string;
  userId?: string;
  organizationId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
}

export interface UpdatePatientInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
}

// ==========================================
// Appointment Types
// ==========================================

export interface Appointment {
  id: string;
  organizationId: string;
  patientId: string;
  providerId: string;
  scheduledAt: string;
  duration: number;
  type: 'in-person' | 'telehealth';
  status: 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
  patient?: Patient;
  provider?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentInput {
  patientId: string;
  providerId: string;
  scheduledAt: string;
  duration: number;
  type: 'in-person' | 'telehealth';
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentInput {
  scheduledAt?: string;
  duration?: number;
  type?: 'in-person' | 'telehealth';
  status?: 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
}

export interface ListAppointmentsParams extends PaginationParams {
  patientId?: string;
  providerId?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

// ==========================================
// Encounter Types
// ==========================================

export interface Encounter {
  id: string;
  organizationId: string;
  patientId: string;
  providerId: string;
  appointmentId?: string;
  status: 'planned' | 'in-progress' | 'finished' | 'cancelled';
  type: string;
  chiefComplaint?: string;
  diagnosis?: Array<{
    code: string;
    description: string;
    type?: 'primary' | 'secondary';
  }>;
  procedures?: Array<{
    code: string;
    description: string;
  }>;
  vitals?: {
    temperature?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    height?: number;
    weight?: number;
    bmi?: number;
  };
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration?: string;
  }>;
  labOrders?: Array<{
    test: string;
    status: string;
  }>;
  startedAt?: string;
  endedAt?: string;
  patient?: Patient;
  provider?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEncounterInput {
  patientId: string;
  providerId: string;
  appointmentId?: string;
  type: string;
  chiefComplaint?: string;
}

export interface UpdateEncounterInput {
  status?: 'planned' | 'in-progress' | 'finished' | 'cancelled';
  type?: string;
  chiefComplaint?: string;
  diagnosis?: Array<{
    code: string;
    description: string;
    type?: 'primary' | 'secondary';
  }>;
  procedures?: Array<{
    code: string;
    description: string;
  }>;
  vitals?: {
    temperature?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    height?: number;
    weight?: number;
    bmi?: number;
  };
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration?: string;
  }>;
  labOrders?: Array<{
    test: string;
    status: string;
  }>;
}

export interface ClinicalNote {
  id: string;
  encounterId: string;
  authorId: string;
  content: string;
  type: 'soap' | 'progress' | 'consultation' | 'discharge' | 'other';
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClinicalNoteInput {
  content: string;
  type: 'soap' | 'progress' | 'consultation' | 'discharge' | 'other';
}

export interface ListEncountersParams extends PaginationParams {
  patientId?: string;
  providerId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

// ==========================================
// Document Types
// ==========================================

export interface Document {
  id: string;
  organizationId: string;
  patientId: string;
  uploadedBy: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  category: 'lab-result' | 'imaging' | 'prescription' | 'insurance' | 'consent' | 'other';
  description?: string;
  metadata?: Record<string, any>;
  storageKey: string;
  encrypted: boolean;
  uploadedByUser?: User;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentInput {
  file: File | Blob;
  patientId: string;
  category: 'lab-result' | 'imaging' | 'prescription' | 'insurance' | 'consent' | 'other';
  description?: string;
  metadata?: Record<string, any>;
}

export interface ListDocumentsParams extends PaginationParams {
  patientId?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

// ==========================================
// Visit Types
// ==========================================

export interface ChatMessage {
  id: string;
  visitId: string;
  senderId: string;
  message: string;
  type: 'text' | 'system';
  sender?: User;
  createdAt: string;
}

export interface SendChatMessageInput {
  message: string;
}

// ==========================================
// Plan Types
// ==========================================

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  maxProviders?: number;
  maxPatients?: number;
  storageLimit?: number;
  active: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Subscription Types
// ==========================================

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  plan?: Plan;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionInput {
  planId: string;
  paymentMethodId: string;
}

// ==========================================
// Consent Types
// ==========================================

export interface Consent {
  id: string;
  organizationId: string;
  patientId: string;
  type: 'treatment' | 'privacy' | 'communication' | 'research' | 'other';
  status: 'granted' | 'denied' | 'revoked';
  grantedAt?: string;
  revokedAt?: string;
  expiresAt?: string;
  consentText: string;
  signature?: string;
  ipAddress?: string;
  patient?: Patient;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsentInput {
  patientId: string;
  type: 'treatment' | 'privacy' | 'communication' | 'research' | 'other';
  status: 'granted' | 'denied';
  consentText: string;
  signature?: string;
  expiresAt?: string;
}

// ==========================================
// Audit Types
// ==========================================

export interface AuditEvent {
  id: string;
  organizationId: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  user?: User;
  createdAt: string;
}

export interface ListAuditEventsParams extends PaginationParams {
  userId?: string;
  action?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
}

// ==========================================
// System Types
// ==========================================

export interface SystemVersion {
  version: string;
  buildDate: string;
}

export interface PublicConfig {
  features: {
    telehealth: boolean;
    messaging: boolean;
    billing: boolean;
    documents: boolean;
  };
  limits: {
    maxFileSize: number;
    allowedFileTypes: string[];
  };
}
