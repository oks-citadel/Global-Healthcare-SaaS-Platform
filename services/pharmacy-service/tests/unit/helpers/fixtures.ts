/**
 * Test Fixtures for Pharmacy Service
 */

export const mockPrescription = {
  id: "prescription-123",
  patientId: "patient-123",
  providerId: "provider-123",
  encounterId: "encounter-123",
  status: "active" as const,
  validUntil: new Date("2027-06-01"),
  notes: "Take with food",
  createdAt: new Date("2026-01-01T10:00:00Z"),
  updatedAt: new Date("2026-01-01T10:00:00Z"),
  items: [],
};

export const mockPrescriptionItem = {
  id: "item-123",
  prescriptionId: "prescription-123",
  medicationName: "Metformin",
  dosage: "500mg",
  frequency: "twice daily",
  duration: "30 days",
  quantity: 60,
  refillsAllowed: 3,
  refillsUsed: 0,
  instructions: "Take with meals",
  isGenericAllowed: true,
  ndcCode: "0456-1234-01",
  rxNormCode: "6809",
  deaSchedule: null,
  createdAt: new Date("2025-01-01T10:00:00Z"),
  updatedAt: new Date("2025-01-01T10:00:00Z"),
};

export const mockControlledPrescriptionItem = {
  ...mockPrescriptionItem,
  id: "item-controlled-123",
  medicationName: "Oxycodone",
  dosage: "5mg",
  deaSchedule: "II",
  isGenericAllowed: false,
  refillsAllowed: 0,
};

export const mockMedication = {
  id: "medication-123",
  name: "Metformin",
  genericName: "Metformin HCL",
  brandName: "Glucophage",
  ndcCode: "0456-1234-01",
  rxNormCode: "6809",
  strength: "500mg",
  form: "tablet",
  manufacturer: "Generic Pharma",
  isControlled: false,
  schedule: null,
  isActive: true,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

export const mockControlledMedication = {
  ...mockMedication,
  id: "medication-controlled-123",
  name: "Oxycodone",
  genericName: "Oxycodone HCL",
  brandName: "OxyContin",
  ndcCode: "0999-0000-01",
  isControlled: true,
  schedule: "II",
};

export const mockPharmacy = {
  id: "pharmacy-123",
  name: "Main Street Pharmacy",
  address: "123 Main St",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  phone: "555-123-4567",
  fax: "555-123-4568",
  npi: "1234567890",
  deaNumber: "AB1234567",
  isActive: true,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

export const mockInventory = {
  id: "inventory-123",
  medicationId: "medication-123",
  pharmacyId: "pharmacy-123",
  lotNumber: "LOT-2025-001",
  quantity: 500,
  expirationDate: new Date("2026-12-31"),
  reorderLevel: 50,
  isActive: true,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  medication: undefined,
};

export const mockDispensing = {
  id: "dispensing-123",
  prescriptionId: "prescription-123",
  medicationName: "Metformin",
  patientId: "patient-123",
  pharmacyId: "pharmacy-123",
  pharmacist: "pharmacist-123",
  quantity: 30,
  dispensedAt: new Date("2025-01-01T10:00:00Z"),
  status: "completed" as const,
  notes: null,
  priorAuthorizationId: null,
  createdAt: new Date("2025-01-01T10:00:00Z"),
  updatedAt: new Date("2025-01-01T10:00:00Z"),
};

export const mockDrugInteraction = {
  id: "interaction-123",
  drug1Name: "Warfarin",
  drug2Name: "Aspirin",
  severity: "severe",
  description: "Increased bleeding risk when taken together",
  source: "FDA",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

export const mockDrugAllergy = {
  id: "allergy-123",
  patientId: "patient-123",
  allergen: "Penicillin",
  reaction: "anaphylaxis",
  severity: "severe",
  onsetDate: new Date("2020-01-01"),
  isActive: true,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

export const mockCreatePrescriptionInput = {
  patientId: "patient-123",
  providerId: "provider-123",
  encounterId: "encounter-123",
  notes: "Follow up in 30 days",
  validUntil: new Date("2027-06-01"),
  items: [
    {
      medicationName: "Metformin",
      dosage: "500mg",
      frequency: "twice daily",
      duration: "30 days",
      quantity: 60,
      refillsAllowed: 3,
      instructions: "Take with meals",
      isGenericAllowed: true,
    },
  ],
};

export const mockDispenseRequest = {
  prescriptionId: "prescription-123",
  prescriptionItemId: "item-123",
  medicationId: "medication-123",
  patientId: "patient-123",
  pharmacyId: "pharmacy-123",
  pharmacistId: "pharmacist-123",
  quantity: 30,
  lotNumber: "LOT-2025-001",
  daysSupply: 30,
};

export const mockUser = {
  id: "user-123",
  email: "pharmacist@example.com",
  role: "pharmacist",
};
