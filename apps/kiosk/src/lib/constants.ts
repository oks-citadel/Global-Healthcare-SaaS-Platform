// Kiosk Configuration Constants

export const KIOSK_CONFIG = {
  // Timeout settings (in milliseconds)
  IDLE_TIMEOUT: 120000, // 2 minutes
  WARNING_BEFORE_TIMEOUT: 30000, // 30 seconds
  SUCCESS_SCREEN_DURATION: 5000, // 5 seconds

  // Touch target sizes
  TOUCH_TARGET_MIN: 44, // pixels
  TOUCH_TARGET_COMFORTABLE: 56, // pixels
  TOUCH_TARGET_LARGE: 72, // pixels

  // Keyboard settings
  KEYBOARD_DEBOUNCE_MS: 100,

  // Queue status update interval
  QUEUE_UPDATE_INTERVAL: 5000, // 5 seconds

  // Supported languages
  SUPPORTED_LANGUAGES: ['en', 'es', 'zh'] as const,
  DEFAULT_LANGUAGE: 'en' as const,
} as const

export const DEPARTMENTS = [
  'Primary Care',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Radiology',
  'Emergency Room',
  'Laboratory',
] as const

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
] as const

export const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Friend',
  'Other',
] as const

export const PAYMENT_METHODS = [
  'credit',
  'debit',
  'cash',
] as const

export const COMMON_COPAY_AMOUNTS = [10, 25, 50, 100] as const

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please try again or ask staff for help.',
  VALIDATION_ERROR: 'Please check your information and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'Something went wrong. Please ask staff for assistance.',
} as const

export const SUCCESS_MESSAGES = {
  CHECK_IN: 'You are checked in! Please have a seat.',
  REGISTRATION: 'Registration complete! Your patient profile has been created.',
  APPOINTMENT: 'Your appointment has been scheduled successfully.',
  PAYMENT: 'Payment processed successfully. Thank you!',
} as const
