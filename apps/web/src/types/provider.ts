export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  lastVisit?: string;
  totalVisits: number;
  createdAt: string;
  updatedAt: string;
}

export interface Encounter {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  encounterDate: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine';
  chiefComplaint: string;
  diagnosis?: string[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
  };
  notes?: ClinicalNote[];
  prescriptions?: Prescription[];
  labOrders?: LabOrder[];
  attachments?: Attachment[];
  duration?: number;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalNote {
  id: string;
  encounterId: string;
  authorId: string;
  authorName: string;
  noteType: 'subjective' | 'objective' | 'assessment' | 'plan' | 'progress' | 'discharge';
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  encounterId: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  refills: number;
  prescribedDate: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface LabOrder {
  id: string;
  encounterId: string;
  patientId: string;
  testName: string;
  testCode: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'ordered' | 'collected' | 'in-progress' | 'completed' | 'cancelled';
  orderedDate: string;
  resultDate?: string;
  results?: string;
  attachments?: string[];
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  conditions: ChronicCondition[];
  surgeries: Surgery[];
  medications: Medication[];
  allergies: Allergy[];
  familyHistory: FamilyHistory[];
  socialHistory?: SocialHistory;
  immunizations: Immunization[];
  createdAt: string;
  updatedAt: string;
}

export interface ChronicCondition {
  id: string;
  condition: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'in-remission';
  notes?: string;
}

export interface Surgery {
  id: string;
  procedure: string;
  date: string;
  surgeon?: string;
  hospital?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'discontinued';
  prescribedBy?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosedDate: string;
}

export interface FamilyHistory {
  id: string;
  relationship: string;
  condition: string;
  ageOfOnset?: number;
}

export interface SocialHistory {
  smokingStatus: 'never' | 'former' | 'current';
  alcoholUse: 'none' | 'occasional' | 'moderate' | 'heavy';
  drugUse?: string;
  occupation?: string;
  maritalStatus?: string;
  exerciseFrequency?: string;
}

export interface Immunization {
  id: string;
  vaccine: string;
  administeredDate: string;
  doseNumber?: number;
  administeredBy?: string;
  nextDueDate?: string;
}

export interface ProviderAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  dateTime: string;
  duration: number;
  status: 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  type: 'in-person' | 'video' | 'phone';
  notes?: string;
  encounterId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderStats {
  todayAppointments: number;
  patientsSeenToday: number;
  pendingEncounters: number;
  totalPatients: number;
  upcomingAppointments: number;
  completedToday: number;
}

export interface AvailabilitySlot {
  id: string;
  providerId: string;
  dayOfWeek: number; // 0-6, Sunday-Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
  slotDuration: number; // minutes
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: string;
}

export interface PatientsListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'lastVisit' | 'totalVisits';
  sortOrder?: 'asc' | 'desc';
}

export interface EncountersListParams {
  page?: number;
  limit?: number;
  status?: Encounter['status'];
  patientId?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'encounterDate' | 'patientName' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface AppointmentsListParams {
  page?: number;
  limit?: number;
  status?: ProviderAppointment['status'];
  fromDate?: string;
  toDate?: string;
  sortBy?: 'dateTime' | 'patientName' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
