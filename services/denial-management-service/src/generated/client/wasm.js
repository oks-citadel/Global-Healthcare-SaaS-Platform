
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
