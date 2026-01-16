/**
 * Test Fixtures for Laboratory Service
 */

export const mockLabOrder = {
  id: 'order-123',
  orderNumber: 'LAB-1234567890-ABC123',
  patientId: 'patient-123',
  providerId: 'provider-123',
  encounterId: 'encounter-123',
  status: 'pending' as const,
  priority: 'routine' as const,
  clinicalInfo: 'Annual checkup',
  orderedAt: new Date('2025-01-01T10:00:00Z'),
  collectedAt: null,
  completedAt: null,
  reportUrl: null,
  createdAt: new Date('2025-01-01T10:00:00Z'),
  updatedAt: new Date('2025-01-01T10:00:00Z'),
  tests: [],
};

export const mockLabTest = {
  id: 'test-123',
  orderId: 'order-123',
  testCode: 'CBC',
  testName: 'Complete Blood Count',
  category: 'hematology' as const,
  status: 'pending' as const,
  performedBy: null,
  performedAt: null,
  verifiedBy: null,
  verifiedAt: null,
  results: [],
  createdAt: new Date('2025-01-01T10:00:00Z'),
  updatedAt: new Date('2025-01-01T10:00:00Z'),
};

export const mockLabResult = {
  id: 'result-123',
  testId: 'test-123',
  componentCode: 'WBC',
  componentName: 'White Blood Cell Count',
  value: '7500',
  numericValue: 7500,
  unit: 'cells/mcL',
  referenceRange: '4500-11000',
  isAbnormal: false,
  isCritical: false,
  abnormalFlag: null,
  interpretation: null,
  notes: null,
  performedBy: 'tech-123',
  verifiedBy: null,
  verifiedAt: null,
  resultedAt: new Date('2025-01-01T11:00:00Z'),
  createdAt: new Date('2025-01-01T11:00:00Z'),
  updatedAt: new Date('2025-01-01T11:00:00Z'),
};

export const mockAbnormalResult = {
  ...mockLabResult,
  id: 'result-abnormal-123',
  value: '15000',
  numericValue: 15000,
  isAbnormal: true,
  isCritical: false,
  abnormalFlag: 'H',
};

export const mockCriticalResult = {
  ...mockLabResult,
  id: 'result-critical-123',
  value: '25000',
  numericValue: 25000,
  isAbnormal: true,
  isCritical: true,
  abnormalFlag: 'HH',
};

export const mockDiagnosticTest = {
  id: 'diagnostic-123',
  code: 'CBC',
  name: 'Complete Blood Count',
  category: 'hematology' as const,
  description: 'Complete blood count with differential',
  preparation: 'No fasting required',
  sampleType: 'whole_blood' as const,
  turnaroundTime: '24 hours',
  price: 50.00,
  currency: 'USD',
  isActive: true,
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};

export const mockCreateOrderInput = {
  patientId: 'patient-123',
  encounterId: 'encounter-123',
  priority: 'routine' as const,
  clinicalInfo: 'Annual checkup',
  tests: [
    {
      testCode: 'CBC',
      testName: 'Complete Blood Count',
      category: 'hematology' as const,
    },
    {
      testCode: 'BMP',
      testName: 'Basic Metabolic Panel',
      category: 'biochemistry' as const,
    },
  ],
};

export const mockCreateResultInput = {
  testId: 'test-123',
  componentCode: 'WBC',
  componentName: 'White Blood Cell Count',
  value: '7500',
  numericValue: 7500,
  unit: 'cells/mcL',
  referenceRange: '4500-11000',
  isAbnormal: false,
  isCritical: false,
};

export const mockSample = {
  id: 'sample-123',
  sampleNumber: 'SMP-1234567890-ABC12',
  orderId: 'order-123',
  sampleType: 'whole_blood',
  containerType: 'EDTA tube',
  volume: '5ml',
  bodySource: 'Left arm',
  collectedBy: 'phlebotomist-123',
  collectedAt: new Date('2025-01-01T10:30:00Z'),
  receivedAt: null,
  status: 'collected' as const,
  priority: 'routine',
  notes: null,
  location: null,
  condition: null,
  rejectionReason: null,
  createdAt: new Date('2025-01-01T10:30:00Z'),
  updatedAt: new Date('2025-01-01T10:30:00Z'),
};

export const mockUser = {
  id: 'user-123',
  email: 'provider@example.com',
  role: 'provider',
};

export const mockAlert = {
  id: 'alert-123',
  resultId: 'result-critical-123',
  patientId: 'patient-123',
  providerId: 'provider-123',
  testName: 'Complete Blood Count',
  componentName: 'White Blood Cell Count',
  value: '25000',
  referenceRange: '4500-11000',
  severity: 'critical' as const,
  alertedAt: new Date('2025-01-01T11:00:00Z'),
  notificationSent: false,
  escalated: false,
  acknowledgedAt: null,
  acknowledgedBy: null,
  notes: null,
};
