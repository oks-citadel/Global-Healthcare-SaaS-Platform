
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

exports.Prisma.VendorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  legalName: 'legalName',
  dbaName: 'dbaName',
  taxId: 'taxId',
  dunsNumber: 'dunsNumber',
  website: 'website',
  description: 'description',
  category: 'category',
  tier: 'tier',
  status: 'status',
  riskScore: 'riskScore',
  riskLevel: 'riskLevel',
  primaryContactName: 'primaryContactName',
  primaryContactEmail: 'primaryContactEmail',
  primaryContactPhone: 'primaryContactPhone',
  address: 'address',
  dataAccessLevel: 'dataAccessLevel',
  phiAccess: 'phiAccess',
  piiAccess: 'piiAccess',
  onboardingDate: 'onboardingDate',
  lastReviewDate: 'lastReviewDate',
  nextReviewDate: 'nextReviewDate',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.AssessmentScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  type: 'type',
  status: 'status',
  dueDate: 'dueDate',
  completedDate: 'completedDate',
  score: 'score',
  maxScore: 'maxScore',
  passThreshold: 'passThreshold',
  passed: 'passed',
  reviewer: 'reviewer',
  reviewerEmail: 'reviewerEmail',
  findings: 'findings',
  recommendations: 'recommendations',
  attachments: 'attachments',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy'
};

exports.Prisma.QuestionnaireTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  version: 'version',
  type: 'type',
  description: 'description',
  sections: 'sections',
  totalQuestions: 'totalQuestions',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuestionnaireResponseScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  templateId: 'templateId',
  status: 'status',
  responses: 'responses',
  score: 'score',
  maxScore: 'maxScore',
  percentComplete: 'percentComplete',
  submittedAt: 'submittedAt',
  reviewedAt: 'reviewedAt',
  reviewedBy: 'reviewedBy',
  reviewNotes: 'reviewNotes',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContractScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  contractNumber: 'contractNumber',
  type: 'type',
  status: 'status',
  title: 'title',
  description: 'description',
  effectiveDate: 'effectiveDate',
  expirationDate: 'expirationDate',
  autoRenewal: 'autoRenewal',
  renewalTermMonths: 'renewalTermMonths',
  terminationNoticeDays: 'terminationNoticeDays',
  value: 'value',
  currency: 'currency',
  paymentTerms: 'paymentTerms',
  slaTerms: 'slaTerms',
  securityRequirements: 'securityRequirements',
  dataRetentionDays: 'dataRetentionDays',
  liabilityLimit: 'liabilityLimit',
  indemnification: 'indemnification',
  insuranceRequired: 'insuranceRequired',
  insuranceMinimum: 'insuranceMinimum',
  documentUrl: 'documentUrl',
  signedDate: 'signedDate',
  signedBy: 'signedBy',
  counterSignedDate: 'counterSignedDate',
  counterSignedBy: 'counterSignedBy',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy'
};

exports.Prisma.ContractAmendmentScalarFieldEnum = {
  id: 'id',
  contractId: 'contractId',
  amendmentNumber: 'amendmentNumber',
  title: 'title',
  description: 'description',
  effectiveDate: 'effectiveDate',
  documentUrl: 'documentUrl',
  signedDate: 'signedDate',
  signedBy: 'signedBy',
  createdAt: 'createdAt'
};

exports.Prisma.ContractRenewalScalarFieldEnum = {
  id: 'id',
  contractId: 'contractId',
  previousEndDate: 'previousEndDate',
  newEndDate: 'newEndDate',
  renewalDate: 'renewalDate',
  renewedBy: 'renewedBy',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.CertificationScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  type: 'type',
  name: 'name',
  issuingBody: 'issuingBody',
  certificationNumber: 'certificationNumber',
  scope: 'scope',
  issueDate: 'issueDate',
  expirationDate: 'expirationDate',
  status: 'status',
  verified: 'verified',
  verifiedDate: 'verifiedDate',
  verifiedBy: 'verifiedBy',
  documentUrl: 'documentUrl',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.IncidentScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  type: 'type',
  severity: 'severity',
  status: 'status',
  title: 'title',
  description: 'description',
  discoveredAt: 'discoveredAt',
  reportedAt: 'reportedAt',
  resolvedAt: 'resolvedAt',
  affectedSystems: 'affectedSystems',
  affectedDataTypes: 'affectedDataTypes',
  recordsAffected: 'recordsAffected',
  phiInvolved: 'phiInvolved',
  piiInvolved: 'piiInvolved',
  rootCause: 'rootCause',
  immediateActions: 'immediateActions',
  correctiveActions: 'correctiveActions',
  preventiveActions: 'preventiveActions',
  notificationRequired: 'notificationRequired',
  notifiedParties: 'notifiedParties',
  notificationDate: 'notificationDate',
  regulatoryReportRequired: 'regulatoryReportRequired',
  regulatoryReportDate: 'regulatoryReportDate',
  lessonLearned: 'lessonLearned',
  attachments: 'attachments',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy'
};

exports.Prisma.RemediationTaskScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  incidentId: 'incidentId',
  type: 'type',
  priority: 'priority',
  status: 'status',
  title: 'title',
  description: 'description',
  requirement: 'requirement',
  controlReference: 'controlReference',
  dueDate: 'dueDate',
  completedDate: 'completedDate',
  assignedTo: 'assignedTo',
  assignedToEmail: 'assignedToEmail',
  evidence: 'evidence',
  verifiedBy: 'verifiedBy',
  verifiedDate: 'verifiedDate',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy'
};

exports.Prisma.VendorAuditLogScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  userId: 'userId',
  userEmail: 'userEmail',
  userRole: 'userRole',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  oldValues: 'oldValues',
  newValues: 'newValues',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.RiskScoringCriteriaScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  category: 'category',
  weight: 'weight',
  maxPoints: 'maxPoints',
  isActive: 'isActive',
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
exports.VendorCategory = exports.$Enums.VendorCategory = {
  CLOUD_HOSTING: 'CLOUD_HOSTING',
  SOFTWARE_SAAS: 'SOFTWARE_SAAS',
  DATA_ANALYTICS: 'DATA_ANALYTICS',
  IT_SERVICES: 'IT_SERVICES',
  CONSULTING: 'CONSULTING',
  MEDICAL_DEVICES: 'MEDICAL_DEVICES',
  LABORATORY: 'LABORATORY',
  PHARMACY: 'PHARMACY',
  BILLING: 'BILLING',
  CLEARINGHOUSE: 'CLEARINGHOUSE',
  STORAGE_BACKUP: 'STORAGE_BACKUP',
  NETWORK_SECURITY: 'NETWORK_SECURITY',
  TELECOMMUNICATIONS: 'TELECOMMUNICATIONS',
  STAFFING: 'STAFFING',
  OTHER: 'OTHER'
};

exports.VendorTier = exports.$Enums.VendorTier = {
  TIER_1: 'TIER_1',
  TIER_2: 'TIER_2',
  TIER_3: 'TIER_3',
  TIER_4: 'TIER_4'
};

exports.VendorStatus = exports.$Enums.VendorStatus = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  CONDITIONAL: 'CONDITIONAL',
  SUSPENDED: 'SUSPENDED',
  TERMINATED: 'TERMINATED',
  ARCHIVED: 'ARCHIVED'
};

exports.RiskLevel = exports.$Enums.RiskLevel = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  MINIMAL: 'MINIMAL',
  UNKNOWN: 'UNKNOWN'
};

exports.DataAccessLevel = exports.$Enums.DataAccessLevel = {
  NONE: 'NONE',
  MINIMAL: 'MINIMAL',
  LIMITED: 'LIMITED',
  MODERATE: 'MODERATE',
  EXTENSIVE: 'EXTENSIVE',
  FULL: 'FULL'
};

exports.AssessmentType = exports.$Enums.AssessmentType = {
  INITIAL_ONBOARDING: 'INITIAL_ONBOARDING',
  ANNUAL_REVIEW: 'ANNUAL_REVIEW',
  AD_HOC: 'AD_HOC',
  SIG_CORE: 'SIG_CORE',
  SIG_LITE: 'SIG_LITE',
  CAIQ: 'CAIQ',
  HECVAT: 'HECVAT',
  VSAQ: 'VSAQ',
  CUSTOM: 'CUSTOM'
};

exports.AssessmentStatus = exports.$Enums.AssessmentStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
};

exports.QuestionnaireType = exports.$Enums.QuestionnaireType = {
  SIG_CORE: 'SIG_CORE',
  SIG_LITE: 'SIG_LITE',
  CAIQ: 'CAIQ',
  HECVAT: 'HECVAT',
  VSAQ: 'VSAQ',
  CUSTOM: 'CUSTOM'
};

exports.QuestionnaireStatus = exports.$Enums.QuestionnaireStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

exports.ContractType = exports.$Enums.ContractType = {
  BAA: 'BAA',
  MSA: 'MSA',
  SLA: 'SLA',
  NDA: 'NDA',
  DPA: 'DPA',
  SOW: 'SOW',
  AMENDMENT: 'AMENDMENT',
  OTHER: 'OTHER'
};

exports.ContractStatus = exports.$Enums.ContractStatus = {
  DRAFT: 'DRAFT',
  PENDING_SIGNATURE: 'PENDING_SIGNATURE',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED',
  RENEWED: 'RENEWED',
  SUSPENDED: 'SUSPENDED'
};

exports.CertificationType = exports.$Enums.CertificationType = {
  SOC_2_TYPE_1: 'SOC_2_TYPE_1',
  SOC_2_TYPE_2: 'SOC_2_TYPE_2',
  SOC_1: 'SOC_1',
  HITRUST: 'HITRUST',
  ISO_27001: 'ISO_27001',
  ISO_27017: 'ISO_27017',
  ISO_27018: 'ISO_27018',
  PCI_DSS: 'PCI_DSS',
  HIPAA_ATTESTATION: 'HIPAA_ATTESTATION',
  FedRAMP: 'FedRAMP',
  StateRAMP: 'StateRAMP',
  CSA_STAR: 'CSA_STAR',
  NIST_CSF: 'NIST_CSF',
  OTHER: 'OTHER'
};

exports.CertificationStatus = exports.$Enums.CertificationStatus = {
  PENDING: 'PENDING',
  VALID: 'VALID',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED',
  NOT_APPLICABLE: 'NOT_APPLICABLE'
};

exports.IncidentType = exports.$Enums.IncidentType = {
  DATA_BREACH: 'DATA_BREACH',
  SECURITY_INCIDENT: 'SECURITY_INCIDENT',
  PRIVACY_VIOLATION: 'PRIVACY_VIOLATION',
  AVAILABILITY_ISSUE: 'AVAILABILITY_ISSUE',
  COMPLIANCE_VIOLATION: 'COMPLIANCE_VIOLATION',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  MALWARE: 'MALWARE',
  PHISHING: 'PHISHING',
  INSIDER_THREAT: 'INSIDER_THREAT',
  PHYSICAL_SECURITY: 'PHYSICAL_SECURITY',
  OTHER: 'OTHER'
};

exports.IncidentSeverity = exports.$Enums.IncidentSeverity = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
};

exports.IncidentStatus = exports.$Enums.IncidentStatus = {
  OPEN: 'OPEN',
  INVESTIGATING: 'INVESTIGATING',
  CONTAINED: 'CONTAINED',
  REMEDIATED: 'REMEDIATED',
  CLOSED: 'CLOSED',
  MONITORING: 'MONITORING'
};

exports.RemediationType = exports.$Enums.RemediationType = {
  CONTROL_GAP: 'CONTROL_GAP',
  ASSESSMENT_FINDING: 'ASSESSMENT_FINDING',
  INCIDENT_RESPONSE: 'INCIDENT_RESPONSE',
  CERTIFICATION_REQUIREMENT: 'CERTIFICATION_REQUIREMENT',
  CONTRACT_REQUIREMENT: 'CONTRACT_REQUIREMENT',
  POLICY_UPDATE: 'POLICY_UPDATE',
  TRAINING: 'TRAINING',
  TECHNICAL_FIX: 'TECHNICAL_FIX',
  PROCESS_IMPROVEMENT: 'PROCESS_IMPROVEMENT',
  OTHER: 'OTHER'
};

exports.TaskPriority = exports.$Enums.TaskPriority = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  COMPLETED: 'COMPLETED',
  DEFERRED: 'DEFERRED',
  CANCELLED: 'CANCELLED'
};

exports.Prisma.ModelName = {
  Vendor: 'Vendor',
  Assessment: 'Assessment',
  QuestionnaireTemplate: 'QuestionnaireTemplate',
  QuestionnaireResponse: 'QuestionnaireResponse',
  Contract: 'Contract',
  ContractAmendment: 'ContractAmendment',
  ContractRenewal: 'ContractRenewal',
  Certification: 'Certification',
  Incident: 'Incident',
  RemediationTask: 'RemediationTask',
  VendorAuditLog: 'VendorAuditLog',
  RiskScoringCriteria: 'RiskScoringCriteria'
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
