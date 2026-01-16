export * from './auth';
export * from './provider';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  type: 'in-person' | 'video' | 'phone';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  upcomingAppointments: number;
  totalAppointments: number;
  pendingResults: number;
  unreadMessages: number;
}

export interface Document {
  id: string;
  patientId: string;
  name: string;
  type: 'lab-result' | 'prescription' | 'imaging' | 'insurance' | 'other';
  category: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
  tags?: string[];
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  condition: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Allergy {
  id: string;
  patientId: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  diagnosedDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id?: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: EmergencyContact;
  bloodType?: string;
  height?: number;
  weight?: number;
  medicalHistory: MedicalHistory[];
  allergies: Allergy[];
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  visitDate: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  type: 'video' | 'phone';
  roomUrl?: string;
  notes?: string;
  diagnosis?: string;
  prescriptions?: Prescription[];
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  title: string;
  imageUrl?: string;
  rating?: number;
  yearsOfExperience?: number;
  availableSlots?: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  dateTime: string;
  available: boolean;
}

export interface BookAppointmentData {
  doctorId: string;
  dateTime: string;
  duration: number;
  type: 'in-person' | 'video' | 'phone';
  reason: string;
  notes?: string;
}
