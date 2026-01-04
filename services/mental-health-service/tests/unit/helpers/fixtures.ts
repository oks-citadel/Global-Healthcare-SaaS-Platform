/**
 * Test Fixtures for Mental Health Service
 */

export const mockConsent = {
  id: 'consent-123',
  patientId: 'patient-123',
  providerId: 'provider-123',
  consentType: 'treatment' as const,
  purpose: 'Mental health treatment',
  grantedTo: 'provider-123',
  grantedAt: new Date('2025-01-01T10:00:00Z'),
  expiresAt: new Date('2025-12-31T23:59:59Z'),
  status: 'active' as const,
  substanceUseDisclosure: false,
  disclosureScope: ['treatment'],
  revokedAt: null,
  createdAt: new Date('2025-01-01T10:00:00Z'),
  updatedAt: new Date('2025-01-01T10:00:00Z'),
};

export const mockExpiredConsent = {
  ...mockConsent,
  id: 'consent-expired-123',
  expiresAt: new Date('2024-01-01T00:00:00Z'),
  status: 'expired' as const,
};

export const mockSubstanceUseConsent = {
  ...mockConsent,
  id: 'consent-sud-123',
  substanceUseDisclosure: true,
  disclosureScope: ['treatment', 'substance_use'],
};

export const mockTreatmentPlan = {
  id: 'plan-123',
  patientId: 'patient-123',
  providerId: 'provider-123',
  diagnosis: ['F33.1 - Major depressive disorder, recurrent, moderate'],
  goals: [],
  interventions: {
    cbt: true,
    medication: true,
    groupTherapy: false,
  },
  medications: {
    current: ['Sertraline 50mg daily'],
  },
  frequency: 'weekly',
  startDate: new Date('2025-01-01'),
  reviewDate: new Date('2025-04-01'),
  status: 'active' as const,
  createdAt: new Date('2025-01-01T10:00:00Z'),
  updatedAt: new Date('2025-01-01T10:00:00Z'),
};

export const mockTreatmentGoal = {
  id: 'goal-123',
  treatmentPlanId: 'plan-123',
  title: 'Reduce depressive symptoms',
  description: 'Target PHQ-9 score below 5',
  targetDate: new Date('2025-04-01'),
  strategies: ['Weekly therapy sessions', 'Medication compliance', 'Sleep hygiene'],
  measurements: ['PHQ-9', 'GAD-7'],
  progress: 50,
  status: 'in_progress' as const,
  barriers: [],
  createdAt: new Date('2025-01-01T10:00:00Z'),
  updatedAt: new Date('2025-01-15T10:00:00Z'),
};

export const mockAssessmentPHQ9 = {
  id: 'assessment-123',
  patientId: 'patient-123',
  providerId: 'provider-123',
  assessmentType: 'PHQ9' as const,
  responses: {
    phq9_1: 2,
    phq9_2: 1,
    phq9_3: 2,
    phq9_4: 1,
    phq9_5: 0,
    phq9_6: 1,
    phq9_7: 1,
    phq9_8: 0,
    phq9_9: 0,
  },
  totalScore: 8,
  severity: 'mild' as const,
  interpretation: 'Mild depression',
  recommendations: ['Watchful waiting', 'Consider counseling'],
  completedAt: new Date('2025-01-01T10:00:00Z'),
  createdAt: new Date('2025-01-01T10:00:00Z'),
  updatedAt: new Date('2025-01-01T10:00:00Z'),
};

export const mockAssessmentGAD7 = {
  id: 'assessment-gad-123',
  patientId: 'patient-123',
  providerId: 'provider-123',
  assessmentType: 'GAD7' as const,
  responses: {
    gad7_1: 2,
    gad7_2: 2,
    gad7_3: 1,
    gad7_4: 2,
    gad7_5: 1,
    gad7_6: 2,
    gad7_7: 1,
  },
  totalScore: 11,
  severity: 'moderate' as const,
  interpretation: 'Moderate anxiety',
  recommendations: ['Further assessment', 'Consider counseling and/or medication'],
  completedAt: new Date('2025-01-01T10:00:00Z'),
  createdAt: new Date('2025-01-01T10:00:00Z'),
  updatedAt: new Date('2025-01-01T10:00:00Z'),
};

export const mockTherapySession = {
  id: 'session-123',
  patientId: 'patient-123',
  providerId: 'provider-123',
  treatmentPlanId: 'plan-123',
  sessionType: 'individual' as const,
  sessionDate: new Date('2025-01-15T14:00:00Z'),
  duration: 50,
  status: 'completed' as const,
  format: 'in_person' as const,
  notes: 'Patient reports improved mood since last session',
  interventionsUsed: ['CBT', 'Behavioral activation'],
  moodRating: 6,
  createdAt: new Date('2025-01-15T14:00:00Z'),
  updatedAt: new Date('2025-01-15T15:00:00Z'),
};

export const mockProgressNote = {
  id: 'note-123',
  sessionId: 'session-123',
  patientId: 'patient-123',
  providerId: 'provider-123',
  content: 'Patient making good progress toward treatment goals',
  subjective: 'Patient reports improved sleep and reduced anxiety',
  objective: 'PHQ-9: 5, GAD-7: 4. Patient appears calm and engaged',
  assessment: 'Depression improving with current treatment regimen',
  plan: 'Continue current medications, weekly therapy sessions',
  createdAt: new Date('2025-01-15T15:00:00Z'),
  updatedAt: new Date('2025-01-15T15:00:00Z'),
};

export const mockUser = {
  id: 'user-123',
  email: 'therapist@example.com',
  role: 'provider',
};

export const mockCreateTreatmentPlanInput = {
  patientId: 'patient-123',
  providerId: 'provider-123',
  diagnosis: ['F33.1 - Major depressive disorder, recurrent, moderate'],
  interventions: {
    cbt: true,
    medication: true,
  },
  frequency: 'weekly',
  startDate: new Date('2025-01-01'),
  reviewDate: new Date('2025-04-01'),
  goals: [
    {
      title: 'Reduce depressive symptoms',
      description: 'Target PHQ-9 score below 5',
      targetDate: new Date('2025-04-01'),
      strategies: ['Weekly therapy', 'Medication'],
    },
  ],
};

export const mockPHQ9Responses = {
  phq9_1: 2,
  phq9_2: 2,
  phq9_3: 2,
  phq9_4: 2,
  phq9_5: 1,
  phq9_6: 1,
  phq9_7: 1,
  phq9_8: 0,
  phq9_9: 0,
};

export const mockGAD7Responses = {
  gad7_1: 2,
  gad7_2: 2,
  gad7_3: 2,
  gad7_4: 2,
  gad7_5: 1,
  gad7_6: 1,
  gad7_7: 1,
};

export const mockCSSRSResponses = {
  cssrs_1: false,
  cssrs_2: false,
  cssrs_3: false,
  cssrs_4: false,
  cssrs_5: false,
  cssrs_6: false,
};

export const mockCSSRSHighRisk = {
  cssrs_1: true,
  cssrs_2: true,
  cssrs_3: true,
  cssrs_4: true,
  cssrs_5: false,
  cssrs_6: false,
};
