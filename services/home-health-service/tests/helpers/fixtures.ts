/**
 * Test Fixtures for Home Health Service
 */

export const mockCaregiver = {
  id: "caregiver-123",
  organizationId: "org-123",
  userId: "user-456",
  firstName: "Jane",
  lastName: "Smith",
  email: "jane.smith@example.com",
  phone: "555-123-4567",
  npi: "1234567890",
  licenseNumber: "RN-123456",
  licenseState: "CA",
  licenseExpiry: new Date("2025-12-31"),
  caregiverType: "registered_nurse",
  specializations: ["wound_care", "diabetes_management"],
  isActive: true,
  maxDailyVisits: 8,
  travelRadius: 25,
  homeLatitude: 37.7749,
  homeLongitude: -122.4194,
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2024-01-15"),
};

export const mockPatientHome = {
  id: "patient-home-123",
  patientId: "patient-789",
  organizationId: "org-123",
  addressLine1: "123 Main St",
  addressLine2: "Apt 4B",
  city: "San Francisco",
  state: "CA",
  zipCode: "94102",
  latitude: 37.7849,
  longitude: -122.4094,
  accessNotes: "Ring bell twice, wait 30 seconds",
  parkingInstructions: "Street parking available on Main St",
  safetyNotes: "Small dog in home",
  preferredTimeSlots: ["morning", "afternoon"],
  isActive: true,
};

export const mockHomeVisit = {
  id: "visit-123",
  organizationId: "org-123",
  patientId: "patient-789",
  caregiverId: "caregiver-123",
  patientHomeId: "patient-home-123",
  visitType: "skilled_nursing",
  visitPriority: "routine",
  status: "scheduled",
  scheduledStartTime: new Date("2024-01-20T09:00:00Z"),
  scheduledEndTime: new Date("2024-01-20T10:00:00Z"),
  scheduledDuration: 60,
  actualStartTime: null,
  actualEndTime: null,
  actualDuration: null,
  clinicalNotes: null,
  visitObjectives: ["Wound assessment", "Medication review"],
  carePlanId: "care-plan-456",
  authorizationId: "auth-789",
  authorizedUnits: 10,
  usedUnits: 5,
  isRecurring: true,
  recurringPattern: "weekly",
  requiresEvv: true,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15"),
};

export const mockEVVRecord = {
  id: "evv-123",
  visitId: "visit-123",
  organizationId: "org-123",
  caregiverId: "caregiver-123",
  patientId: "patient-789",
  checkInTime: new Date("2024-01-20T09:02:00Z"),
  checkOutTime: new Date("2024-01-20T09:58:00Z"),
  checkInMethod: "gps",
  checkOutMethod: "gps",
  checkInLatitude: 37.7849,
  checkInLongitude: -122.4094,
  checkOutLatitude: 37.7849,
  checkOutLongitude: -122.4094,
  checkInDistance: 15,
  checkOutDistance: 12,
  isCompliant: true,
  complianceNotes: null,
  verifiedAt: new Date("2024-01-20T10:00:00Z"),
  verifiedBy: "system",
  stateReportingStatus: "pending",
};

export const mockScheduleInput = {
  organizationId: "org-123",
  patientId: "patient-789",
  caregiverId: "caregiver-123",
  visitType: "skilled_nursing",
  scheduledStartTime: new Date("2024-01-25T09:00:00Z"),
  scheduledDuration: 60,
  visitObjectives: ["Wound assessment", "Medication review"],
  isRecurring: false,
};

export const mockEVVCheckInInput = {
  visitId: "visit-123",
  caregiverId: "caregiver-123",
  latitude: 37.7849,
  longitude: -122.4094,
  verificationMethod: "gps",
  deviceId: "device-abc123",
};

export const mockVisitRescheduleInput = {
  visitId: "visit-123",
  newStartTime: new Date("2024-01-25T14:00:00Z"),
  newDuration: 60,
  rescheduleReason: "Patient request",
};
