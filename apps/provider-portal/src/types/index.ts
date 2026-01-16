// Core Provider Types
export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  npi: string; // National Provider Identifier
  specialty: string;
  licenseNumber: string;
  licenseState: string;
  certifications: string[];
  avatar?: string;
  bio?: string;
  education: Education[];
  languagesSpoken: string[];
  acceptingNewPatients: boolean;
  status: 'active' | 'inactive' | 'on_leave';
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  field: string;
}

// Patient Types
export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  email: string;
  phone: string;
  address: Address;
  emergencyContact: EmergencyContact;
  insuranceInfo: InsuranceInfo[];
  bloodType?: string;
  allergies: Allergy[];
  chronicConditions: string[];
  medications: Medication[];
  avatar?: string;
  status: 'active' | 'inactive' | 'deceased';
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface InsuranceInfo {
  id: string;
  provider: string;
  policyNumber: string;
  groupNumber: string;
  isPrimary: boolean;
  effectiveDate: string;
  expirationDate?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosedDate: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  providerId: string;
  provider?: Provider;
  type: 'in_person' | 'telehealth' | 'follow_up' | 'consultation';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  reason: string;
  notes?: string;
  location?: string;
  roomNumber?: string;
  videoCallLink?: string;
  createdAt: string;
  updatedAt: string;
}

// Clinical Documentation Types
export interface SOAPNote {
  id: string;
  patientId: string;
  providerId: string;
  appointmentId: string;
  date: string;
  subjective: string; // Patient's description
  objective: string; // Provider's observations
  assessment: string; // Diagnosis
  plan: string; // Treatment plan
  vitalSigns?: VitalSigns;
  attachments?: Attachment[];
  isSigned: boolean;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VitalSigns {
  temperature?: number; // Fahrenheit
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number; // lbs
  height?: number; // inches
  bmi?: number;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
}

// Prescription Types
export interface Prescription {
  id: string;
  patientId: string;
  patient?: Patient;
  providerId: string;
  provider?: Provider;
  medication: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'topical' | 'injection' | 'inhalation' | 'other';
  quantity: number;
  refills: number;
  startDate: string;
  endDate?: string;
  instructions: string;
  pharmacyId?: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  isSent: boolean;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  isActive: boolean;
}

// Lab Order Types
export interface LabOrder {
  id: string;
  patientId: string;
  patient?: Patient;
  providerId: string;
  provider?: Provider;
  orderDate: string;
  tests: LabTest[];
  priority: 'routine' | 'urgent' | 'stat';
  status: 'ordered' | 'collected' | 'processing' | 'completed' | 'cancelled';
  labName?: string;
  diagnosis: string;
  notes?: string;
  results?: LabResult[];
  createdAt: string;
  updatedAt: string;
}

export interface LabTest {
  id: string;
  testCode: string;
  testName: string;
  description?: string;
}

export interface LabResult {
  id: string;
  labOrderId: string;
  testId: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  performedDate: string;
  notes?: string;
}

// Medical History Types
export interface MedicalHistory {
  patientId: string;
  appointments: Appointment[];
  soapNotes: SOAPNote[];
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  procedures: Procedure[];
  immunizations: Immunization[];
}

export interface Procedure {
  id: string;
  name: string;
  code: string; // CPT code
  date: string;
  providerId: string;
  provider?: Provider;
  location: string;
  notes?: string;
  outcome: string;
}

export interface Immunization {
  id: string;
  vaccine: string;
  date: string;
  administeredBy: string;
  lotNumber: string;
  expirationDate: string;
  site: string;
  route: string;
}

// Schedule and Availability Types
export interface ProviderSchedule {
  id: string;
  providerId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  startTime: string; // HH:mm format
  endTime: string;
  isAvailable: boolean;
  slotDuration: number; // in minutes
}

export interface TimeSlot {
  id: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  appointmentId?: string;
}

export interface AvailabilityException {
  id: string;
  providerId: string;
  date: string;
  startTime?: string;
  endTime?: string;
  reason: string;
  type: 'unavailable' | 'custom_hours';
}

// Telehealth Types
export interface TelehealthSession {
  id: string;
  appointmentId: string;
  patientId: string;
  providerId: string;
  roomId: string;
  status: 'scheduled' | 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  connectionQuality?: 'excellent' | 'good' | 'fair' | 'poor';
  recordingUrl?: string;
  notes?: string;
  createdAt: string;
}

// Billing Types
export interface Claim {
  id: string;
  patientId: string;
  patient?: Patient;
  providerId: string;
  appointmentId?: string;
  claimNumber: string;
  insuranceId: string;
  dateOfService: string;
  totalAmount: number;
  paidAmount: number;
  status: 'submitted' | 'processing' | 'approved' | 'denied' | 'partially_paid' | 'paid';
  submittedDate: string;
  processedDate?: string;
  denialReason?: string;
  services: BillingService[];
  createdAt: string;
  updatedAt: string;
}

export interface BillingService {
  id: string;
  cptCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  modifiers?: string[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'lab_result' | 'prescription' | 'message' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  createdAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  provider: Provider;
  expiresAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and Search Types
export interface PatientFilters {
  search?: string;
  status?: Patient['status'];
  ageMin?: number;
  ageMax?: number;
  gender?: Patient['gender'];
  hasUpcomingAppointment?: boolean;
}

export interface AppointmentFilters {
  startDate?: string;
  endDate?: string;
  status?: Appointment['status'];
  type?: Appointment['type'];
  patientId?: string;
}
