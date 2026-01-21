/**
 * Test Data for UI Tests
 * Centralized test fixtures for Playwright tests
 */

// Test Users
export const testUsers = {
  patient: {
    email: process.env.TEST_PATIENT_EMAIL || 'patient@test.unified.health',
    password: process.env.TEST_PATIENT_PASSWORD || 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Patient',
    role: 'patient',
  },
  provider: {
    email: process.env.TEST_PROVIDER_EMAIL || 'provider@test.unified.health',
    password: process.env.TEST_PROVIDER_PASSWORD || 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Provider',
    role: 'provider',
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'admin@test.unified.health',
    password: process.env.TEST_ADMIN_PASSWORD || 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Admin',
    role: 'admin',
  },
  newUser: {
    email: `new-user-${Date.now()}@test.unified.health`,
    password: 'NewUserPassword123!',
    firstName: 'New',
    lastName: 'User',
  },
};

// Test Appointments
export const testAppointments = {
  upcoming: {
    type: 'checkup',
    reason: 'Annual wellness visit',
    notes: 'Automated test appointment',
    duration: 30,
  },
  telehealth: {
    type: 'telehealth',
    reason: 'Virtual consultation',
    notes: 'Telehealth test appointment',
    duration: 20,
  },
};

// Test Documents
export const testDocuments = {
  labResult: {
    name: 'Test Lab Results',
    type: 'lab_result',
  },
  prescription: {
    name: 'Test Prescription',
    type: 'prescription',
  },
};

// Page Routes
export const routes = {
  web: {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    appointments: '/appointments',
    bookAppointment: '/appointments/book',
    prescriptions: '/prescriptions',
    records: '/records',
    medicalRecords: '/records',
    profile: '/profile',
    settings: '/settings',
    billing: '/billing',
    messages: '/messages',
  },
  admin: {
    login: '/login',
    dashboard: '/dashboard',
    users: '/users',
    auditLogs: '/audit-logs',
    settings: '/settings',
    billing: '/billing',
    providers: '/providers',
  },
  provider: {
    login: '/login',
    dashboard: '/dashboard',
    patients: '/patients',
    appointments: '/appointments',
    encounters: '/encounters',
    newEncounter: '/encounters/new',
    prescriptions: '/prescriptions',
    schedule: '/schedule',
    profile: '/profile',
  },
  kiosk: {
    home: '/',
    checkIn: '/check-in',
    register: '/register',
    queue: '/queue-status',
    payment: '/payment',
    directions: '/directions',
  },
};

// Test Selectors (data-testid attributes)
export const selectors = {
  // Common
  loadingSpinner: '[data-testid="loading-spinner"]',
  errorMessage: '[data-testid="error-message"]',
  successMessage: '[data-testid="success-message"]',
  submitButton: 'button[type="submit"]',
  cancelButton: '[data-testid="cancel-button"]',

  // Navigation
  sidebar: '[data-testid="sidebar"]',
  userMenu: '[data-testid="user-menu"]',
  logoutButton: '[data-testid="logout-button"]',

  // Auth
  loginForm: '[data-testid="login-form"]',
  emailInput: 'input[name="email"], input[type="email"]',
  passwordInput: 'input[name="password"], input[type="password"]',
  registerForm: '[data-testid="register-form"]',
  forgotPasswordLink: '[data-testid="forgot-password-link"]',

  // Dashboard
  dashboardContainer: '[data-testid="dashboard-container"]',
  welcomeMessage: '[data-testid="welcome-message"]',
  quickActions: '[data-testid="quick-actions"]',
  upcomingAppointments: '[data-testid="upcoming-appointments"]',
  statsCards: '[data-testid="stats-cards"]',

  // Appointments
  appointmentsList: '[data-testid="appointments-list"]',
  appointmentCard: '[data-testid="appointment-card"]',
  bookAppointmentButton: '[data-testid="book-appointment-button"]',
  appointmentForm: '[data-testid="appointment-form"]',
  appointmentTypeSelect: 'select[name="type"]',
  appointmentDateInput: 'input[name="date"], input[type="date"]',
  appointmentTimeInput: 'input[name="time"], input[type="time"]',
  appointmentReasonInput: 'textarea[name="reason"]',

  // Profile
  profileForm: '[data-testid="profile-form"]',
  firstNameInput: 'input[name="firstName"]',
  lastNameInput: 'input[name="lastName"]',
  phoneInput: 'input[name="phone"]',

  // Settings
  settingsForm: '[data-testid="settings-form"]',
  changePasswordButton: '[data-testid="change-password-button"]',
  notificationToggle: '[data-testid="notification-toggle"]',

  // Provider Portal
  patientsList: '[data-testid="patients-list"]',
  patientCard: '[data-testid="patient-card"]',
  encounterForm: '[data-testid="encounter-form"]',
  clinicalNotes: '[data-testid="clinical-notes"]',

  // Kiosk
  kioskWelcome: '[data-testid="kiosk-welcome"]',
  checkInButton: '[data-testid="check-in-button"]',
  queueDisplay: '[data-testid="queue-display"]',
  kioskKeypad: '[data-testid="kiosk-keypad"]',
};

// Accessibility test configuration
export const a11yConfig = {
  wcagLevel: 'AA',
  runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  exclude: [
    // Exclude known issues that are being tracked
  ],
};

// Performance thresholds
export const performanceThresholds = {
  pageLoad: 3000, // 3 seconds
  timeToInteractive: 5000, // 5 seconds
  firstContentfulPaint: 1500, // 1.5 seconds
  largestContentfulPaint: 2500, // 2.5 seconds
};
