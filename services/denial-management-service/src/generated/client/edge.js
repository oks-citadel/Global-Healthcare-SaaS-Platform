
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.DenialScalarFieldEnum = {
  id: 'id',
  claimId: 'claimId',
  patientId: 'patientId',
  providerId: 'providerId',
  payerId: 'payerId',
  payerName: 'payerName',
  claimStatus: 'claimStatus',
  denialDate: 'denialDate',
  serviceDate: 'serviceDate',
  billedAmount: 'billedAmount',
  allowedAmount: 'allowedAmount',
  paidAmount: 'paidAmount',
  patientResponsibility: 'patientResponsibility',
  carcCode: 'carcCode',
  carcDescription: 'carcDescription',
  rarcCodes: 'rarcCodes',
  groupCode: 'groupCode',
  procedureCode: 'procedureCode',
  procedureModifiers: 'procedureModifiers',
  diagnosisCodes: 'diagnosisCodes',
  placeOfService: 'placeOfService',
  x277StatusCode: 'x277StatusCode',
  x277StatusMessage: 'x277StatusMessage',
  predictedRecoverable: 'predictedRecoverable',
  recoveryProbability: 'recoveryProbability',
  riskFactors: 'riskFactors',
  denialCategory: 'denialCategory',
  rootCause: 'rootCause',
  recoveredAmount: 'recoveredAmount',
  writeOffAmount: 'writeOffAmount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppealScalarFieldEnum = {
  id: 'id',
  denialId: 'denialId',
  appealLevel: 'appealLevel',
  appealType: 'appealType',
  status: 'status',
  payerAppealStrategy: 'payerAppealStrategy',
  appealLetterContent: 'appealLetterContent',
  appealLetterHtml: 'appealLetterHtml',
  supportingDocuments: 'supportingDocuments',
  filingDeadline: 'filingDeadline',
  submittedDate: 'submittedDate',
  responseDeadline: 'responseDeadline',
  responseDate: 'responseDate',
  outcome: 'outcome',
  outcomeReason: 'outcomeReason',
  adjustedAmount: 'adjustedAmount',
  assignedTo: 'assignedTo',
  assignedAt: 'assignedAt',
  completedBy: 'completedBy',
  completedAt: 'completedAt',
  processingTimeMinutes: 'processingTimeMinutes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DenialPatternScalarFieldEnum = {
  id: 'id',
  payerId: 'payerId',
  payerName: 'payerName',
  procedureCode: 'procedureCode',
  diagnosisCode: 'diagnosisCode',
  carcCode: 'carcCode',
  denialCategory: 'denialCategory',
  totalDenials: 'totalDenials',
  totalBilledAmount: 'totalBilledAmount',
  totalRecoveredAmount: 'totalRecoveredAmount',
  denialRate: 'denialRate',
  recoveryRate: 'recoveryRate',
  averageRecoveryTime: 'averageRecoveryTime',
  periodStart: 'periodStart',
  periodEnd: 'periodEnd',
  monthlyTrend: 'monthlyTrend',
  suggestedActions: 'suggestedActions',
  riskScore: 'riskScore',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PayerConfigScalarFieldEnum = {
  id: 'id',
  payerId: 'payerId',
  payerName: 'payerName',
  firstLevelDeadlineDays: 'firstLevelDeadlineDays',
  secondLevelDeadlineDays: 'secondLevelDeadlineDays',
  externalReviewDeadlineDays: 'externalReviewDeadlineDays',
  requiresClinicalNotes: 'requiresClinicalNotes',
  requiresMedicalRecords: 'requiresMedicalRecords',
  requiresLetterOfMedicalNecessity: 'requiresLetterOfMedicalNecessity',
  acceptsElectronicAppeals: 'acceptsElectronicAppeals',
  appealAddress: 'appealAddress',
  appealFaxNumber: 'appealFaxNumber',
  appealEmail: 'appealEmail',
  appealPortalUrl: 'appealPortalUrl',
  preferredFormat: 'preferredFormat',
  specialInstructions: 'specialInstructions',
  firstLevelSuccessRate: 'firstLevelSuccessRate',
  secondLevelSuccessRate: 'secondLevelSuccessRate',
  externalReviewSuccessRate: 'externalReviewSuccessRate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StaffProductivityScalarFieldEnum = {
  id: 'id',
  staffId: 'staffId',
  staffName: 'staffName',
  periodDate: 'periodDate',
  denialsReviewed: 'denialsReviewed',
  denialsAssigned: 'denialsAssigned',
  appealsCreated: 'appealsCreated',
  appealsSubmitted: 'appealsSubmitted',
  appealsOverturned: 'appealsOverturned',
  appealsUpheld: 'appealsUpheld',
  averageProcessingTime: 'averageProcessingTime',
  totalProcessingTime: 'totalProcessingTime',
  totalRecovered: 'totalRecovered',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RevenueRecoveryScalarFieldEnum = {
  id: 'id',
  periodStart: 'periodStart',
  periodEnd: 'periodEnd',
  totalDenials: 'totalDenials',
  totalDeniedAmount: 'totalDeniedAmount',
  totalAppeals: 'totalAppeals',
  successfulAppeals: 'successfulAppeals',
  totalRecovered: 'totalRecovered',
  totalWrittenOff: 'totalWrittenOff',
  recoveryRate: 'recoveryRate',
  recoveryByCategory: 'recoveryByCategory',
  recoveryByPayer: 'recoveryByPayer',
  weeklyBreakdown: 'weeklyBreakdown',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClaimRiskAssessmentScalarFieldEnum = {
  id: 'id',
  claimId: 'claimId',
  patientId: 'patientId',
  providerId: 'providerId',
  payerId: 'payerId',
  procedureCode: 'procedureCode',
  diagnosisCodes: 'diagnosisCodes',
  billedAmount: 'billedAmount',
  overallRiskScore: 'overallRiskScore',
  riskLevel: 'riskLevel',
  riskFactors: 'riskFactors',
  recommendations: 'recommendations',
  suggestedModifications: 'suggestedModifications',
  assessmentDate: 'assessmentDate',
  wasSubmitted: 'wasSubmitted',
  wasModified: 'wasModified',
  actualOutcome: 'actualOutcome',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.ClaimStatus = exports.$Enums.ClaimStatus = {
  pending: 'pending',
  denied: 'denied',
  partially_denied: 'partially_denied',
  appealed: 'appealed',
  appeal_pending: 'appeal_pending',
  appeal_approved: 'appeal_approved',
  appeal_denied: 'appeal_denied',
  recovered: 'recovered',
  written_off: 'written_off'
};

exports.DenialCategory = exports.$Enums.DenialCategory = {
  prior_authorization: 'prior_authorization',
  medical_necessity: 'medical_necessity',
  coding_error: 'coding_error',
  duplicate_claim: 'duplicate_claim',
  timely_filing: 'timely_filing',
  eligibility: 'eligibility',
  coordination_of_benefits: 'coordination_of_benefits',
  bundling: 'bundling',
  modifier_issue: 'modifier_issue',
  documentation: 'documentation',
  non_covered_service: 'non_covered_service',
  out_of_network: 'out_of_network',
  benefit_exhausted: 'benefit_exhausted',
  pre_existing_condition: 'pre_existing_condition',
  other: 'other'
};

exports.AppealType = exports.$Enums.AppealType = {
  clinical_review: 'clinical_review',
  administrative_review: 'administrative_review',
  peer_to_peer: 'peer_to_peer',
  external_review: 'external_review',
  expedited: 'expedited'
};

exports.AppealStatus = exports.$Enums.AppealStatus = {
  draft: 'draft',
  pending_review: 'pending_review',
  approved_for_submission: 'approved_for_submission',
  submitted: 'submitted',
  pending_response: 'pending_response',
  additional_info_requested: 'additional_info_requested',
  resolved: 'resolved',
  closed: 'closed'
};

exports.AppealOutcome = exports.$Enums.AppealOutcome = {
  overturned_full: 'overturned_full',
  overturned_partial: 'overturned_partial',
  upheld: 'upheld',
  withdrawn: 'withdrawn',
  expired: 'expired'
};

exports.RiskLevel = exports.$Enums.RiskLevel = {
  low: 'low',
  moderate: 'moderate',
  high: 'high',
  critical: 'critical'
};

exports.Prisma.ModelName = {
  Denial: 'Denial',
  Appeal: 'Appeal',
  DenialPattern: 'DenialPattern',
  PayerConfig: 'PayerConfig',
  StaffProductivity: 'StaffProductivity',
  RevenueRecovery: 'RevenueRecovery',
  ClaimRiskAssessment: 'ClaimRiskAssessment'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\citad\\OneDrive\\Documents\\Global-Healthcare-SaaS-Platform\\services\\denial-management-service\\src\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\citad\\OneDrive\\Documents\\Global-Healthcare-SaaS-Platform\\services\\denial-management-service\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  output   = \"./../src/generated/client\"\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// ==========================================\n// Denial Domain\n// ==========================================\n\nmodel Denial {\n  id         String @id @default(uuid())\n  claimId    String\n  patientId  String\n  providerId String\n  payerId    String\n  payerName  String\n\n  // X12 835 Remittance Advice fields\n  claimStatus           ClaimStatus @default(denied)\n  denialDate            DateTime    @default(now())\n  serviceDate           DateTime\n  billedAmount          Decimal     @db.Decimal(12, 2)\n  allowedAmount         Decimal?    @db.Decimal(12, 2)\n  paidAmount            Decimal?    @db.Decimal(12, 2)\n  patientResponsibility Decimal?    @db.Decimal(12, 2)\n\n  // CARC/RARC Codes (Claim Adjustment Reason Code / Remittance Advice Remark Code)\n  carcCode        String // Primary CARC code (e.g., CO-4, CO-16, PR-1)\n  carcDescription String\n  rarcCodes       String[] // Additional RARC codes\n  groupCode       String // CO, OA, PI, PR\n\n  // Procedure and diagnosis codes\n  procedureCode      String // CPT/HCPCS code\n  procedureModifiers String[]\n  diagnosisCodes     String[] // ICD-10 codes\n  placeOfService     String?\n\n  // X12 277 Claim Status fields\n  x277StatusCode    String? // Claim status category code\n  x277StatusMessage String?\n\n  // AI prediction data\n  predictedRecoverable Boolean @default(false)\n  recoveryProbability  Float? // 0-1 probability score\n  riskFactors          Json? // JSON array of risk factors\n\n  // Categorization\n  denialCategory DenialCategory\n  rootCause      String?\n\n  // Revenue tracking\n  recoveredAmount Decimal? @db.Decimal(12, 2)\n  writeOffAmount  Decimal? @db.Decimal(12, 2)\n\n  // Relationships\n  appeals Appeal[]\n\n  // Timestamps\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([claimId])\n  @@index([patientId])\n  @@index([providerId])\n  @@index([payerId])\n  @@index([carcCode])\n  @@index([denialCategory])\n  @@index([denialDate])\n  @@index([claimStatus])\n  @@index([procedureCode])\n}\n\nenum ClaimStatus {\n  pending\n  denied\n  partially_denied\n  appealed\n  appeal_pending\n  appeal_approved\n  appeal_denied\n  recovered\n  written_off\n}\n\nenum DenialCategory {\n  prior_authorization // Missing or invalid prior auth\n  medical_necessity // Service not medically necessary\n  coding_error // Incorrect CPT/ICD codes\n  duplicate_claim // Claim already processed\n  timely_filing // Claim filed too late\n  eligibility // Patient not eligible\n  coordination_of_benefits // COB issues\n  bundling // Services should be bundled\n  modifier_issue // Missing or incorrect modifiers\n  documentation // Insufficient documentation\n  non_covered_service // Service not covered by plan\n  out_of_network // Provider not in network\n  benefit_exhausted // Benefits maxed out\n  pre_existing_condition // Pre-existing condition exclusion\n  other // Other/unknown\n}\n\n// ==========================================\n// Appeal Domain\n// ==========================================\n\nmodel Appeal {\n  id       String @id @default(uuid())\n  denialId String\n  denial   Denial @relation(fields: [denialId], references: [id], onDelete: Cascade)\n\n  // Appeal details\n  appealLevel Int          @default(1) // 1st level, 2nd level, external review\n  appealType  AppealType\n  status      AppealStatus @default(draft)\n\n  // Payer-specific strategy\n  payerAppealStrategy Json? // Payer-specific requirements and tips\n\n  // Generated content\n  appealLetterContent String?  @db.Text\n  appealLetterHtml    String?  @db.Text\n  supportingDocuments String[] // Document IDs/URLs\n\n  // Key dates\n  filingDeadline   DateTime\n  submittedDate    DateTime?\n  responseDeadline DateTime?\n  responseDate     DateTime?\n\n  // Outcome\n  outcome        AppealOutcome?\n  outcomeReason  String?\n  adjustedAmount Decimal?       @db.Decimal(12, 2)\n\n  // Staff tracking\n  assignedTo  String? // Staff member ID\n  assignedAt  DateTime?\n  completedBy String?\n  completedAt DateTime?\n\n  // Processing time (for productivity metrics)\n  processingTimeMinutes Int?\n\n  // Timestamps\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([denialId])\n  @@index([status])\n  @@index([appealLevel])\n  @@index([assignedTo])\n  @@index([filingDeadline])\n  @@index([submittedDate])\n}\n\nenum AppealType {\n  clinical_review\n  administrative_review\n  peer_to_peer\n  external_review\n  expedited\n}\n\nenum AppealStatus {\n  draft\n  pending_review\n  approved_for_submission\n  submitted\n  pending_response\n  additional_info_requested\n  resolved\n  closed\n}\n\nenum AppealOutcome {\n  overturned_full // Full payment received\n  overturned_partial // Partial payment received\n  upheld // Denial upheld\n  withdrawn // Appeal withdrawn\n  expired // Filing deadline missed\n}\n\n// ==========================================\n// Denial Pattern Analytics\n// ==========================================\n\nmodel DenialPattern {\n  id String @id @default(uuid())\n\n  // Pattern identification\n  payerId        String\n  payerName      String\n  procedureCode  String? // CPT/HCPCS\n  diagnosisCode  String? // ICD-10\n  carcCode       String?\n  denialCategory DenialCategory?\n\n  // Statistics\n  totalDenials         Int     @default(0)\n  totalBilledAmount    Decimal @default(0) @db.Decimal(14, 2)\n  totalRecoveredAmount Decimal @default(0) @db.Decimal(14, 2)\n  denialRate           Float   @default(0)\n  recoveryRate         Float   @default(0)\n  averageRecoveryTime  Int? // Days\n\n  // Time period\n  periodStart DateTime\n  periodEnd   DateTime\n\n  // Trend data\n  monthlyTrend Json? // Array of {month, count, amount}\n\n  // AI insights\n  suggestedActions String[]\n  riskScore        Float? // 0-100 risk score for this pattern\n\n  // Timestamps\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([payerId, procedureCode, diagnosisCode, carcCode, periodStart, periodEnd])\n  @@index([payerId])\n  @@index([procedureCode])\n  @@index([diagnosisCode])\n  @@index([carcCode])\n  @@index([denialCategory])\n  @@index([denialRate])\n}\n\n// ==========================================\n// Payer Configuration\n// ==========================================\n\nmodel PayerConfig {\n  id        String @id @default(uuid())\n  payerId   String @unique\n  payerName String\n\n  // Appeal requirements\n  firstLevelDeadlineDays     Int @default(60)\n  secondLevelDeadlineDays    Int @default(60)\n  externalReviewDeadlineDays Int @default(120)\n\n  // Payer-specific requirements\n  requiresClinicalNotes            Boolean @default(true)\n  requiresMedicalRecords           Boolean @default(false)\n  requiresLetterOfMedicalNecessity Boolean @default(false)\n  acceptsElectronicAppeals         Boolean @default(true)\n\n  // Contact information\n  appealAddress   Json? // Mailing address\n  appealFaxNumber String?\n  appealEmail     String?\n  appealPortalUrl String?\n\n  // Appeal letter preferences\n  preferredFormat     String? // PDF, physical mail, portal\n  specialInstructions String?\n\n  // Historical success rates\n  firstLevelSuccessRate     Float?\n  secondLevelSuccessRate    Float?\n  externalReviewSuccessRate Float?\n\n  // Timestamps\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([payerName])\n}\n\n// ==========================================\n// Staff Productivity Tracking\n// ==========================================\n\nmodel StaffProductivity {\n  id        String @id @default(uuid())\n  staffId   String\n  staffName String\n\n  // Period\n  periodDate DateTime @db.Date\n\n  // Denial metrics\n  denialsReviewed Int @default(0)\n  denialsAssigned Int @default(0)\n\n  // Appeal metrics\n  appealsCreated    Int @default(0)\n  appealsSubmitted  Int @default(0)\n  appealsOverturned Int @default(0)\n  appealsUpheld     Int @default(0)\n\n  // Time metrics\n  averageProcessingTime Int? // Minutes\n  totalProcessingTime   Int  @default(0) // Minutes\n\n  // Revenue metrics\n  totalRecovered Decimal @default(0) @db.Decimal(14, 2)\n\n  // Timestamps\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([staffId, periodDate])\n  @@index([staffId])\n  @@index([periodDate])\n}\n\n// ==========================================\n// Revenue Recovery Tracking\n// ==========================================\n\nmodel RevenueRecovery {\n  id String @id @default(uuid())\n\n  // Period\n  periodStart DateTime\n  periodEnd   DateTime\n\n  // Denial metrics\n  totalDenials      Int     @default(0)\n  totalDeniedAmount Decimal @default(0) @db.Decimal(14, 2)\n\n  // Appeal metrics\n  totalAppeals      Int @default(0)\n  successfulAppeals Int @default(0)\n\n  // Recovery metrics\n  totalRecovered  Decimal @default(0) @db.Decimal(14, 2)\n  totalWrittenOff Decimal @default(0) @db.Decimal(14, 2)\n  recoveryRate    Float   @default(0)\n\n  // Breakdown by category\n  recoveryByCategory Json? // {category: amount}\n  recoveryByPayer    Json? // {payerId: amount}\n\n  // Trend data\n  weeklyBreakdown Json? // Array of weekly stats\n\n  // Timestamps\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([periodStart, periodEnd])\n  @@index([periodStart])\n  @@index([periodEnd])\n}\n\n// ==========================================\n// Pre-submission Risk Assessment\n// ==========================================\n\nmodel ClaimRiskAssessment {\n  id      String @id @default(uuid())\n  claimId String @unique\n\n  // Claim details\n  patientId      String\n  providerId     String\n  payerId        String\n  procedureCode  String\n  diagnosisCodes String[]\n  billedAmount   Decimal  @db.Decimal(12, 2)\n\n  // Risk assessment\n  overallRiskScore Float // 0-100\n  riskLevel        RiskLevel\n\n  // Risk factors\n  riskFactors Json // Array of {factor, score, description}\n\n  // Recommendations\n  recommendations        String[]\n  suggestedModifications Json? // Suggested claim modifications\n\n  // Assessment outcome\n  assessmentDate DateTime @default(now())\n  wasSubmitted   Boolean  @default(false)\n  wasModified    Boolean  @default(false)\n  actualOutcome  String? // paid, denied, partial\n\n  // Timestamps\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([claimId])\n  @@index([patientId])\n  @@index([payerId])\n  @@index([riskLevel])\n  @@index([assessmentDate])\n}\n\nenum RiskLevel {\n  low // 0-25\n  moderate // 26-50\n  high // 51-75\n  critical // 76-100\n}\n",
  "inlineSchemaHash": "2e6914e9450f03e356ff5e0ccce98c3b77045cac38b5eaa9b14acaf8e048ca95",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Denial\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"claimId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payerName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"claimStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ClaimStatus\",\"default\":\"denied\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"denialDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"billedAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"allowedAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paidAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientResponsibility\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carcCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carcDescription\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rarcCodes\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"procedureCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"procedureModifiers\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"diagnosisCodes\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"placeOfService\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"x277StatusCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"x277StatusMessage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"predictedRecoverable\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recoveryProbability\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskFactors\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"denialCategory\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DenialCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rootCause\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recoveredAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"writeOffAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appeals\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Appeal\",\"relationName\":\"AppealToDenial\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Appeal\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"denialId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"denial\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Denial\",\"relationName\":\"AppealToDenial\",\"relationFromFields\":[\"denialId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealLevel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AppealType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AppealStatus\",\"default\":\"draft\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payerAppealStrategy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealLetterContent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealLetterHtml\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supportingDocuments\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"filingDeadline\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"submittedDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseDeadline\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"outcome\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AppealOutcome\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"outcomeReason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"adjustedAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedTo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processingTimeMinutes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"DenialPattern\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payerName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"procedureCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"diagnosisCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carcCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"denialCategory\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DenialCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalDenials\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalBilledAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalRecoveredAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"denialRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recoveryRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"averageRecoveryTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodStart\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodEnd\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"monthlyTrend\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"suggestedActions\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"payerId\",\"procedureCode\",\"diagnosisCode\",\"carcCode\",\"periodStart\",\"periodEnd\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"payerId\",\"procedureCode\",\"diagnosisCode\",\"carcCode\",\"periodStart\",\"periodEnd\"]}],\"isGenerated\":false},\"PayerConfig\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payerName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"firstLevelDeadlineDays\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":60,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"secondLevelDeadlineDays\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":60,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"externalReviewDeadlineDays\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":120,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiresClinicalNotes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiresMedicalRecords\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiresLetterOfMedicalNecessity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"acceptsElectronicAppeals\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealFaxNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealEmail\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealPortalUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"preferredFormat\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"specialInstructions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"firstLevelSuccessRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"secondLevelSuccessRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"externalReviewSuccessRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"StaffProductivity\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"staffId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"staffName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"denialsReviewed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"denialsAssigned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealsCreated\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealsSubmitted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealsOverturned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appealsUpheld\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"averageProcessingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalProcessingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalRecovered\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"staffId\",\"periodDate\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"staffId\",\"periodDate\"]}],\"isGenerated\":false},\"RevenueRecovery\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodStart\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodEnd\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalDenials\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalDeniedAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalAppeals\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"successfulAppeals\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalRecovered\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalWrittenOff\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recoveryRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recoveryByCategory\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recoveryByPayer\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"weeklyBreakdown\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"periodStart\",\"periodEnd\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"periodStart\",\"periodEnd\"]}],\"isGenerated\":false},\"ClaimRiskAssessment\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"claimId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"procedureCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"diagnosisCodes\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"billedAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"overallRiskScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskLevel\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RiskLevel\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"riskFactors\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recommendations\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"suggestedModifications\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assessmentDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wasSubmitted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wasModified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualOutcome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"ClaimStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"denied\",\"dbName\":null},{\"name\":\"partially_denied\",\"dbName\":null},{\"name\":\"appealed\",\"dbName\":null},{\"name\":\"appeal_pending\",\"dbName\":null},{\"name\":\"appeal_approved\",\"dbName\":null},{\"name\":\"appeal_denied\",\"dbName\":null},{\"name\":\"recovered\",\"dbName\":null},{\"name\":\"written_off\",\"dbName\":null}],\"dbName\":null},\"DenialCategory\":{\"values\":[{\"name\":\"prior_authorization\",\"dbName\":null},{\"name\":\"medical_necessity\",\"dbName\":null},{\"name\":\"coding_error\",\"dbName\":null},{\"name\":\"duplicate_claim\",\"dbName\":null},{\"name\":\"timely_filing\",\"dbName\":null},{\"name\":\"eligibility\",\"dbName\":null},{\"name\":\"coordination_of_benefits\",\"dbName\":null},{\"name\":\"bundling\",\"dbName\":null},{\"name\":\"modifier_issue\",\"dbName\":null},{\"name\":\"documentation\",\"dbName\":null},{\"name\":\"non_covered_service\",\"dbName\":null},{\"name\":\"out_of_network\",\"dbName\":null},{\"name\":\"benefit_exhausted\",\"dbName\":null},{\"name\":\"pre_existing_condition\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"AppealType\":{\"values\":[{\"name\":\"clinical_review\",\"dbName\":null},{\"name\":\"administrative_review\",\"dbName\":null},{\"name\":\"peer_to_peer\",\"dbName\":null},{\"name\":\"external_review\",\"dbName\":null},{\"name\":\"expedited\",\"dbName\":null}],\"dbName\":null},\"AppealStatus\":{\"values\":[{\"name\":\"draft\",\"dbName\":null},{\"name\":\"pending_review\",\"dbName\":null},{\"name\":\"approved_for_submission\",\"dbName\":null},{\"name\":\"submitted\",\"dbName\":null},{\"name\":\"pending_response\",\"dbName\":null},{\"name\":\"additional_info_requested\",\"dbName\":null},{\"name\":\"resolved\",\"dbName\":null},{\"name\":\"closed\",\"dbName\":null}],\"dbName\":null},\"AppealOutcome\":{\"values\":[{\"name\":\"overturned_full\",\"dbName\":null},{\"name\":\"overturned_partial\",\"dbName\":null},{\"name\":\"upheld\",\"dbName\":null},{\"name\":\"withdrawn\",\"dbName\":null},{\"name\":\"expired\",\"dbName\":null}],\"dbName\":null},\"RiskLevel\":{\"values\":[{\"name\":\"low\",\"dbName\":null},{\"name\":\"moderate\",\"dbName\":null},{\"name\":\"high\",\"dbName\":null},{\"name\":\"critical\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

