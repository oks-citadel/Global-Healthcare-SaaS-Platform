export interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  phoneNumber: string
  email?: string
  address?: Address
  emergencyContact?: EmergencyContact
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
}

export interface EmergencyContact {
  name: string
  phoneNumber: string
  relationship: string
}

export interface Appointment {
  id: string
  patientId: string
  providerId: string
  departmentId: string
  dateTime: Date
  status: 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled'
  type: string
  notes?: string
}

export interface Provider {
  id: string
  firstName: string
  lastName: string
  specialty: string
  departmentId: string
}

export interface Department {
  id: string
  name: string
  floor: string
  description?: string
}

export interface Payment {
  id: string
  patientId: string
  amount: number
  paymentMethod: 'credit' | 'debit' | 'cash'
  status: 'pending' | 'completed' | 'failed'
  transactionId?: string
  timestamp: Date
}

export interface QueueStatus {
  department: string
  waitTime: number
  patientsWaiting: number
  status: 'low' | 'medium' | 'high'
}

export interface InsuranceCard {
  insuranceProvider: string
  policyNumber: string
  groupNumber?: string
  imageUrl?: string
}

export type Language = 'en' | 'es' | 'zh'
