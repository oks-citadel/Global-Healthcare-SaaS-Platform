/**
 * API Service Layer
 *
 * This file provides a centralized location for all API calls.
 * Currently using mock data - replace with actual API calls when backend is available.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Types
import type { Patient, Appointment, Payment, QueueStatus } from '@/types'

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

/**
 * Patient Check-In
 */
export async function checkInPatient(data: {
  dateOfBirth: string
  phoneNumber: string
  insuranceScanned: boolean
}): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Check-in successful',
      })
    }, 1000)
  })

  // Actual implementation:
  // return fetchAPI('/check-in', {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // })
}

/**
 * Register New Patient
 */
export async function registerPatient(data: Partial<Patient>): Promise<{
  success: boolean
  patientId: string
}> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        patientId: `PAT-${Date.now()}`,
      })
    }, 1000)
  })

  // Actual implementation:
  // return fetchAPI('/patients', {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // })
}

/**
 * Schedule Appointment
 */
export async function scheduleAppointment(data: {
  department: string
  provider: string
  date: string
  time: string
}): Promise<{
  success: boolean
  appointmentId: string
}> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        appointmentId: `APT-${Date.now()}`,
      })
    }, 1000)
  })

  // Actual implementation:
  // return fetchAPI('/appointments', {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // })
}

/**
 * Get Queue Status
 */
export async function getQueueStatus(): Promise<QueueStatus[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { department: 'Emergency Room', waitTime: 45, patientsWaiting: 12, status: 'high' },
        { department: 'Primary Care', waitTime: 15, patientsWaiting: 4, status: 'low' },
        { department: 'Radiology', waitTime: 30, patientsWaiting: 8, status: 'medium' },
      ])
    }, 500)
  })

  // Actual implementation:
  // return fetchAPI('/queue-status')
}

/**
 * Process Payment
 */
export async function processPayment(data: {
  amount: number
  paymentMethod: 'credit' | 'debit'
}): Promise<{
  success: boolean
  transactionId: string
}> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `TXN-${Date.now()}`,
      })
    }, 2000)
  })

  // Actual implementation:
  // return fetchAPI('/payments', {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // })
}

/**
 * Get Available Appointments
 */
export async function getAvailableAppointments(params: {
  department: string
  provider: string
  date: string
}): Promise<string[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'])
    }, 500)
  })

  // Actual implementation:
  // return fetchAPI(`/appointments/available?${new URLSearchParams(params)}`)
}

/**
 * Verify Patient Identity
 */
export async function verifyPatient(data: {
  dateOfBirth: string
  phoneNumber: string
}): Promise<{
  verified: boolean
  patientId?: string
}> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        verified: true,
        patientId: 'PAT-123456',
      })
    }, 1000)
  })

  // Actual implementation:
  // return fetchAPI('/patients/verify', {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // })
}

/**
 * Upload Insurance Card Image
 */
export async function uploadInsuranceCard(imageData: File | Blob): Promise<{
  success: boolean
  imageUrl: string
}> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        imageUrl: '/placeholder-insurance-card.jpg',
      })
    }, 1500)
  })

  // Actual implementation:
  // const formData = new FormData()
  // formData.append('image', imageData)
  // return fetchAPI('/insurance/upload', {
  //   method: 'POST',
  //   body: formData,
  //   headers: {}, // Let browser set Content-Type for FormData
  // })
}

/**
 * Get Departments
 */
export async function getDepartments(): Promise<Array<{
  id: string
  name: string
  description: string
}>> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Primary Care', description: 'General health services' },
        { id: '2', name: 'Cardiology', description: 'Heart and cardiovascular care' },
        { id: '3', name: 'Orthopedics', description: 'Bone and joint care' },
      ])
    }, 500)
  })

  // Actual implementation:
  // return fetchAPI('/departments')
}

/**
 * Get Providers by Department
 */
export async function getProviders(departmentId: string): Promise<Array<{
  id: string
  name: string
  specialty: string
}>> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Internal Medicine' },
        { id: '2', name: 'Dr. Michael Chen', specialty: 'Family Medicine' },
      ])
    }, 500)
  })

  // Actual implementation:
  // return fetchAPI(`/departments/${departmentId}/providers`)
}

/**
 * Error handling helper
 */
export function handleAPIError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred. Please try again or ask staff for assistance.'
}
