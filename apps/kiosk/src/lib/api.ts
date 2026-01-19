/**
 * API Service Layer
 *
 * Provides real API integration for the kiosk application.
 * All functions make actual API calls to the backend services.
 */

// API runs on port 8080 - this is the correct default port for all environments
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Types
import type { Patient, Appointment, Payment, QueueStatus } from '@/types'

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
}

export interface CheckInResponse {
  success: boolean
  message: string
  queueNumber?: number
  estimatedWaitTime?: number
}

export interface RegisterPatientResponse {
  success: boolean
  patientId: string
  message?: string
}

export interface ScheduleAppointmentResponse {
  success: boolean
  appointmentId: string
  confirmationNumber?: string
}

export interface PaymentResponse {
  success: boolean
  transactionId: string
  receiptUrl?: string
}

export interface VerifyPatientResponse {
  verified: boolean
  patientId?: string
  patientName?: string
  appointments?: Array<{
    id: string
    dateTime: string
    department: string
    provider: string
  }>
}

export interface InsuranceUploadResponse {
  success: boolean
  imageUrl: string
  extractedData?: {
    insuranceProvider?: string
    policyNumber?: string
    groupNumber?: string
  }
}

export interface Department {
  id: string
  name: string
  description: string
  floor?: string
  waitTime?: number
}

export interface Provider {
  id: string
  name: string
  specialty: string
  available?: boolean
  nextAvailableSlot?: string
}

// ============================================================================
// API Client Configuration
// ============================================================================

/**
 * Get the kiosk authentication token from session storage
 * Kiosk devices use a device-level authentication token
 */
function getKioskToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('kiosk_token')
  }
  return null
}

/**
 * Build request headers with authentication and content type
 */
function buildHeaders(contentType: string = 'application/json'): HeadersInit {
  const headers: HeadersInit = {}

  if (contentType) {
    headers['Content-Type'] = contentType
  }

  const token = getKioskToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Add kiosk identifier header for tracking
  headers['X-Kiosk-Device'] = typeof window !== 'undefined'
    ? sessionStorage.getItem('kiosk_device_id') || 'unknown'
    : 'unknown'

  return headers
}

/**
 * Generic fetch wrapper with comprehensive error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit & { skipContentType?: boolean }
): Promise<T> {
  const url = `${API_URL}${endpoint}`

  try {
    const headers = options?.skipContentType
      ? buildHeaders('')
      : buildHeaders()

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    })

    // Parse response body
    let data: any
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data.message
        ? data.message
        : `API Error: ${response.status} ${response.statusText}`

      const error = new Error(errorMessage) as Error & {
        statusCode?: number
        code?: string
      }
      error.statusCode = response.status
      error.code = typeof data === 'object' ? data.code : undefined
      throw error
    }

    return data as T
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your connection or ask staff for assistance.')
    }
    throw error
  }
}

// ============================================================================
// Patient Check-In API
// ============================================================================

/**
 * Check in a patient for their appointment
 */
export async function checkInPatient(data: {
  dateOfBirth: string
  phoneNumber: string
  insuranceScanned: boolean
  appointmentId?: string
}): Promise<CheckInResponse> {
  return fetchAPI<CheckInResponse>('/kiosk/check-in', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ============================================================================
// Patient Registration API
// ============================================================================

/**
 * Register a new patient in the system
 */
export async function registerPatient(data: Partial<Patient>): Promise<RegisterPatientResponse> {
  return fetchAPI<RegisterPatientResponse>('/kiosk/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ============================================================================
// Appointment Scheduling API
// ============================================================================

/**
 * Schedule a new appointment
 */
export async function scheduleAppointment(data: {
  department: string
  provider: string
  date: string
  time: string
  patientId?: string
  appointmentType?: string
  notes?: string
}): Promise<ScheduleAppointmentResponse> {
  return fetchAPI<ScheduleAppointmentResponse>('/kiosk/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Get available appointment time slots
 */
export async function getAvailableAppointments(params: {
  department: string
  provider: string
  date: string
}): Promise<string[]> {
  const queryParams = new URLSearchParams({
    department: params.department,
    provider: params.provider,
    date: params.date,
  })

  return fetchAPI<string[]>(`/kiosk/appointments/available?${queryParams}`)
}

// ============================================================================
// Queue Status API
// ============================================================================

/**
 * Get current queue status for all departments
 */
export async function getQueueStatus(): Promise<QueueStatus[]> {
  return fetchAPI<QueueStatus[]>('/kiosk/queue-status')
}

// ============================================================================
// Payment Processing API
// ============================================================================

/**
 * Process a payment transaction
 */
export async function processPayment(data: {
  amount: number
  paymentMethod: 'credit' | 'debit'
  patientId?: string
  appointmentId?: string
  invoiceId?: string
}): Promise<PaymentResponse> {
  return fetchAPI<PaymentResponse>('/kiosk/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ============================================================================
// Patient Verification API
// ============================================================================

/**
 * Verify patient identity using date of birth and phone number
 */
export async function verifyPatient(data: {
  dateOfBirth: string
  phoneNumber: string
}): Promise<VerifyPatientResponse> {
  return fetchAPI<VerifyPatientResponse>('/kiosk/patients/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ============================================================================
// Insurance Card Upload API
// ============================================================================

/**
 * Upload insurance card image for processing
 */
export async function uploadInsuranceCard(imageData: File | Blob): Promise<InsuranceUploadResponse> {
  const formData = new FormData()
  formData.append('image', imageData)

  // For FormData, we don't set Content-Type - browser sets it with boundary
  return fetchAPI<InsuranceUploadResponse>('/kiosk/insurance/upload', {
    method: 'POST',
    body: formData,
    skipContentType: true,
  })
}

// ============================================================================
// Department API
// ============================================================================

/**
 * Get all available departments
 */
export async function getDepartments(): Promise<Department[]> {
  return fetchAPI<Department[]>('/kiosk/departments')
}

// ============================================================================
// Provider API
// ============================================================================

/**
 * Get providers for a specific department
 */
export async function getProviders(departmentId: string): Promise<Provider[]> {
  return fetchAPI<Provider[]>(`/kiosk/departments/${departmentId}/providers`)
}

// ============================================================================
// Error Handling Utilities
// ============================================================================

/**
 * Extract a user-friendly error message from an error object
 */
export function handleAPIError(error: unknown): string {
  if (error instanceof Error) {
    // Check for network errors
    if (error.message.includes('Unable to connect')) {
      return error.message
    }

    // Check for specific HTTP status codes
    const statusError = error as Error & { statusCode?: number }
    if (statusError.statusCode) {
      switch (statusError.statusCode) {
        case 400:
          return error.message || 'Invalid request. Please check your information and try again.'
        case 401:
          return 'Session expired. Please start over.'
        case 403:
          return 'Access denied. Please ask staff for assistance.'
        case 404:
          return 'Record not found. Please verify your information.'
        case 409:
          return 'A conflict occurred. This may already be registered.'
        case 422:
          return error.message || 'Invalid data provided. Please check your entries.'
        case 429:
          return 'Too many requests. Please wait a moment and try again.'
        case 500:
        case 502:
        case 503:
          return 'Server error. Please try again or ask staff for assistance.'
        default:
          return error.message
      }
    }

    return error.message
  }

  return 'An unexpected error occurred. Please try again or ask staff for assistance.'
}

/**
 * Check if an error is a network connectivity issue
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return true
  }
  if (error instanceof Error && error.message.includes('Unable to connect')) {
    return true
  }
  return false
}

/**
 * Check if an error indicates the patient was not found
 */
export function isPatientNotFoundError(error: unknown): boolean {
  if (error instanceof Error) {
    const statusError = error as Error & { statusCode?: number; code?: string }
    return statusError.statusCode === 404 || statusError.code === 'PATIENT_NOT_FOUND'
  }
  return false
}

// ============================================================================
// Kiosk Device Authentication
// ============================================================================

/**
 * Authenticate the kiosk device with the backend
 * This should be called when the kiosk application starts
 */
export async function authenticateKiosk(deviceId: string, deviceSecret: string): Promise<{
  success: boolean
  token: string
  expiresAt: string
}> {
  const response = await fetchAPI<{
    success: boolean
    token: string
    expiresAt: string
  }>('/kiosk/auth/device', {
    method: 'POST',
    body: JSON.stringify({ deviceId, deviceSecret }),
  })

  if (response.success && typeof window !== 'undefined') {
    sessionStorage.setItem('kiosk_token', response.token)
    sessionStorage.setItem('kiosk_device_id', deviceId)
  }

  return response
}

/**
 * Refresh the kiosk device authentication token
 */
export async function refreshKioskToken(): Promise<{
  success: boolean
  token: string
  expiresAt: string
}> {
  const response = await fetchAPI<{
    success: boolean
    token: string
    expiresAt: string
  }>('/kiosk/auth/refresh', {
    method: 'POST',
  })

  if (response.success && typeof window !== 'undefined') {
    sessionStorage.setItem('kiosk_token', response.token)
  }

  return response
}
