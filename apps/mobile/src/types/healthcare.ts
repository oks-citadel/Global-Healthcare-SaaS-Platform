/**
 * Healthcare-specific types for mobile app
 * Ensures full feature parity with web application
 */

// Provider/Doctor Types
export interface Provider {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty: string;
  subspecialties?: string[];
  title?: string;
  credentials?: string[];
  bio?: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  yearsOfExperience?: number;
  education?: Education[];
  languages?: string[];
  acceptingNewPatients: boolean;
  insuranceAccepted?: string[];
  location?: ProviderLocation;
  availability?: AvailabilitySlot[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: number;
  specialty?: string;
}

export interface ProviderLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface AvailabilitySlot {
  id: string;
  providerId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: number; // minutes
  appointmentTypes: AppointmentType[];
  isActive: boolean;
}

export type AppointmentType = 'video' | 'phone' | 'in-person';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  providerId: string;
  appointmentType: AppointmentType;
}

// Medical Records Types
export interface MedicalRecord {
  id: string;
  patientId: string;
  providerId?: string;
  providerName?: string;
  type: MedicalRecordType;
  title: string;
  description?: string;
  date: string;
  status: RecordStatus;
  category?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  isShared?: boolean;
  sharedWith?: string[];
  createdAt: string;
  updatedAt: string;
}

export type MedicalRecordType =
  | 'lab-result'
  | 'imaging'
  | 'visit-summary'
  | 'immunization'
  | 'prescription'
  | 'procedure'
  | 'allergy'
  | 'vital-signs'
  | 'other';

export type RecordStatus =
  | 'normal'
  | 'completed'
  | 'attention'
  | 'pending'
  | 'abnormal'
  | 'critical';

// Prescription Types
export interface Prescription {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  medication: Medication;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  refillsRemaining: number;
  instructions?: string;
  status: PrescriptionStatus;
  startDate: string;
  endDate?: string;
  pharmacy?: Pharmacy;
  lastFilledDate?: string;
  nextRefillDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  strength?: string;
  form?: string; // tablet, capsule, liquid, etc.
  ndc?: string; // National Drug Code
  rxcui?: string;
  warnings?: string[];
  sideEffects?: string[];
  interactions?: string[];
}

export type PrescriptionStatus =
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'pending-refill'
  | 'on-hold';

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  fax?: string;
  hours?: string;
  isPreferred?: boolean;
}

// Patient Profile Types
export interface PatientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address?: Address;
  emergencyContact?: EmergencyContact;
  insurance?: InsuranceInfo;
  medicalHistory?: MedicalHistory;
  allergies?: Allergy[];
  bloodType?: string;
  height?: number; // in cm
  weight?: number; // in kg
  primaryCareProvider?: string;
  preferredLanguage?: string;
  communicationPreferences?: CommunicationPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  street2?: string;
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
  provider: string;
  planName?: string;
  memberId: string;
  groupNumber?: string;
  policyHolderName?: string;
  policyHolderRelationship?: string;
  effectiveDate?: string;
  expirationDate?: string;
}

export interface MedicalHistory {
  conditions?: string[];
  surgeries?: Surgery[];
  familyHistory?: string[];
  socialHistory?: SocialHistory;
}

export interface Surgery {
  name: string;
  date: string;
  provider?: string;
  notes?: string;
}

export interface SocialHistory {
  smokingStatus?: 'never' | 'former' | 'current';
  alcoholUse?: 'none' | 'occasional' | 'moderate' | 'heavy';
  exerciseFrequency?: string;
  occupation?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  type: 'medication' | 'food' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  onsetDate?: string;
}

export interface CommunicationPreferences {
  appointmentReminders: boolean;
  resultNotifications: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  preferredContactMethod: 'email' | 'phone' | 'sms';
}

// Encounter Types (for Provider Portal)
export interface Encounter {
  id: string;
  patientId: string;
  providerId: string;
  appointmentId?: string;
  type: EncounterType;
  status: EncounterStatus;
  chiefComplaint?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  diagnosis?: Diagnosis[];
  procedures?: Procedure[];
  vitalSigns?: VitalSigns;
  notes?: ClinicalNote[];
  startTime?: string;
  endTime?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export type EncounterType =
  | 'office-visit'
  | 'telehealth'
  | 'phone-consult'
  | 'follow-up'
  | 'urgent-care'
  | 'emergency';

export type EncounterStatus =
  | 'scheduled'
  | 'checked-in'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface Diagnosis {
  id: string;
  code: string; // ICD-10
  description: string;
  type: 'primary' | 'secondary';
  status?: 'active' | 'resolved';
}

export interface Procedure {
  id: string;
  code: string; // CPT
  description: string;
  quantity?: number;
  modifier?: string;
}

export interface VitalSigns {
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  painLevel?: number;
  recordedAt: string;
}

export interface ClinicalNote {
  id: string;
  encounterId: string;
  authorId: string;
  authorName: string;
  type: 'progress' | 'assessment' | 'plan' | 'discharge' | 'other';
  content: string;
  isAmended?: boolean;
  amendedAt?: string;
  amendmentReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Messaging Types (extended)
export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'appointment';
  participants: ConversationParticipant[];
  subject?: string;
  lastMessage?: Message;
  unreadCount: number;
  isArchived: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  id: string;
  userId: string;
  name: string;
  role: 'patient' | 'provider' | 'admin';
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'provider' | 'admin';
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  attachments?: Attachment[];
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  replyTo?: string;
  isEdited?: boolean;
  editedAt?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

// Billing Types
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  trialEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  trialDays?: number;
}

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
  createdAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  description?: string;
  periodStart: string;
  periodEnd: string;
  pdfUrl?: string;
  hostedUrl?: string;
  createdAt: string;
  paidAt?: string;
}

// Dashboard Stats Types
export interface PatientDashboardStats {
  upcomingAppointments: number;
  totalAppointments: number;
  pendingResults: number;
  unreadMessages: number;
  activePrescriptions?: number;
  dueImmunizations?: number;
}

export interface ProviderDashboardStats {
  todayAppointments: number;
  patientsSeenToday: number;
  pendingEncounters: number;
  totalPatients: number;
  unreadMessages?: number;
  pendingLabReviews?: number;
}

// Search/Filter Types
export interface ProviderSearchParams {
  query?: string;
  specialty?: string;
  location?: string;
  acceptingNewPatients?: boolean;
  insuranceAccepted?: string;
  gender?: string;
  language?: string;
  availableDate?: string;
  appointmentType?: AppointmentType;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'distance' | 'availability' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface MedicalRecordSearchParams {
  type?: MedicalRecordType;
  status?: RecordStatus;
  providerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Booking Flow Types
export interface BookingState {
  step: 'provider' | 'datetime' | 'reason' | 'confirm';
  provider?: Provider;
  selectedDate?: string;
  selectedSlot?: TimeSlot;
  appointmentType?: AppointmentType;
  reason?: string;
  notes?: string;
  symptoms?: string[];
  isNewPatient?: boolean;
}
