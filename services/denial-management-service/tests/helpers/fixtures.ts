/**
 * Test Fixtures for Denial Management Service
 */

export const mockDenial = {
  id: "denial-123",
  organizationId: "org-123",
  claimId: "claim-456",
  originalClaimNumber: "CLM-2024-001",
  patientId: "patient-789",
  patientName: "John Doe",
  payerId: "payer-001",
  payerName: "Blue Cross",
  denialReasonCode: "CO-4",
  denialReasonDescription: "Service not covered",
  denialDate: new Date("2024-01-15"),
  receivedDate: new Date("2024-01-16"),
  billedAmount: 1500.0,
  deniedAmount: 1500.0,
  allowedAmount: 0,
  status: "open",
  priority: "high",
  categoryCode: "coverage",
  serviceDate: new Date("2024-01-10"),
  procedureCode: "99213",
  diagnosisCodes: ["Z00.00"],
  timingStatus: "within_window",
  createdAt: new Date("2024-01-16"),
  updatedAt: new Date("2024-01-16"),
};

export const mockAppeal = {
  id: "appeal-123",
  denialId: "denial-123",
  appealLevel: 1,
  appealType: "internal",
  status: "pending",
  filedDate: new Date("2024-01-20"),
  deadlineDate: new Date("2024-02-20"),
  appealReason: "Service was medically necessary",
  requestedAmount: 1500.0,
  createdAt: new Date("2024-01-20"),
  updatedAt: new Date("2024-01-20"),
};

export const mockDenialPattern = {
  id: "pattern-123",
  organizationId: "org-123",
  payerId: "payer-001",
  payerName: "Blue Cross",
  denialReasonCode: "CO-4",
  categoryCode: "coverage",
  procedureCode: "99213",
  occurrenceCount: 25,
  totalDeniedAmount: 37500.0,
  successfulAppealCount: 15,
  appealSuccessRate: 0.6,
  averageDaysToResolve: 30,
  suggestedActions: [
    "Verify coverage before service",
    "Submit prior authorization",
  ],
  lastUpdated: new Date("2024-01-20"),
};

export const mockClaimRiskAssessment = {
  id: "risk-123",
  claimId: "claim-789",
  organizationId: "org-123",
  overallRiskScore: 0.75,
  riskLevel: "high",
  riskFactors: [
    { factor: "high_value_claim", score: 0.8, weight: 0.3 },
    { factor: "new_payer", score: 0.6, weight: 0.2 },
    { factor: "complex_procedure", score: 0.9, weight: 0.5 },
  ],
  recommendedActions: ["Verify eligibility", "Request prior authorization"],
  assessedAt: new Date("2024-01-15"),
  createdAt: new Date("2024-01-15"),
};

export const mockPayerConfig = {
  id: "payer-config-001",
  payerId: "payer-001",
  payerName: "Blue Cross",
  appealTimeLimit: 60,
  appealLevels: 3,
  electronicSubmission: true,
  requiredDocuments: ["medical_records", "authorization_form"],
  contactInfo: {
    phone: "1-800-123-4567",
    fax: "1-800-123-4568",
    email: "appeals@bluecross.com",
  },
};

export const mockX12835Data = {
  raw: `ISA*00*          *00*          *ZZ*PAYER          *ZZ*PROVIDER       *240115*1200*^*00501*000000001*0*P*:~GS*HP*PAYER*PROVIDER*20240115*1200*1*X*005010X221A1~ST*835*0001*005010X221A1~BPR*I*1500*C*ACH*CCP*01*999999999*DA*123456789*1234567890**01*123456789*DA*987654321*20240115~TRN*1*12345678901*1234567890~REF*EV*TEST~DTM*405*20240115~N1*PR*BLUE CROSS~N3*123 PAYER ST~N4*ANYTOWN*NY*12345~N1*PE*PROVIDER NAME*XX*1234567890~CLP*CLM-2024-001*1*1500*0*0*12*DCNO123*11~NM1*QC*1*DOE*JOHN****MI*123456789~DTM*232*20240110~SVC*HC:99213*500*0**1~DTM*472*20240110~CAS*CO*4*500~SE*20*0001~GE*1*1~IEA*1*000000001~`,
  parsed: {
    envelope: {
      isaControlNumber: "000000001",
      gsControlNumber: "1",
      stControlNumber: "0001",
      senderId: "PAYER",
      senderQualifier: "ZZ",
      receiverId: "PROVIDER",
      receiverQualifier: "ZZ",
      interchangeDate: new Date("2024-01-15"),
    },
    payments: [
      {
        claimId: "CLM-2024-001",
        status: "1",
        chargedAmount: 1500,
        paidAmount: 0,
        adjustments: [
          {
            groupCode: "CO",
            reasonCode: "4",
            amount: 500,
          },
        ],
      },
    ],
  },
};

export const mockAppealGenerationInput = {
  denialId: "denial-123",
  appealLevel: 1,
  appealType: "internal",
  additionalNotes: "Please reconsider this denial",
  supportingDocuments: ["medical_records.pdf"],
};

export const mockDenialAnalyticsParams = {
  organizationId: "org-123",
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-01-31"),
  payerId: "payer-001",
};

export const mockPredictionInput = {
  claimId: "claim-789",
  organizationId: "org-123",
  payerId: "payer-001",
  procedureCode: "99213",
  diagnosisCodes: ["Z00.00"],
  billedAmount: 500.0,
  patientAge: 45,
  isNewPatient: false,
  hasPreAuth: true,
};
