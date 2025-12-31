
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

exports.Prisma.ClinicalTrialScalarFieldEnum = {
  id: 'id',
  nctId: 'nctId',
  title: 'title',
  officialTitle: 'officialTitle',
  briefSummary: 'briefSummary',
  detailedDescription: 'detailedDescription',
  status: 'status',
  phase: 'phase',
  studyType: 'studyType',
  primaryPurpose: 'primaryPurpose',
  interventionModel: 'interventionModel',
  masking: 'masking',
  allocation: 'allocation',
  enrollmentCount: 'enrollmentCount',
  enrollmentType: 'enrollmentType',
  startDate: 'startDate',
  completionDate: 'completionDate',
  primaryCompletionDate: 'primaryCompletionDate',
  lastUpdatedDate: 'lastUpdatedDate',
  sponsorName: 'sponsorName',
  sponsorType: 'sponsorType',
  leadSponsorClass: 'leadSponsorClass',
  collaborators: 'collaborators',
  conditions: 'conditions',
  interventions: 'interventions',
  keywords: 'keywords',
  meshTerms: 'meshTerms',
  primaryOutcomes: 'primaryOutcomes',
  secondaryOutcomes: 'secondaryOutcomes',
  eligibilityCriteria: 'eligibilityCriteria',
  eligibilityText: 'eligibilityText',
  healthyVolunteers: 'healthyVolunteers',
  minimumAge: 'minimumAge',
  maximumAge: 'maximumAge',
  gender: 'gender',
  contactName: 'contactName',
  contactPhone: 'contactPhone',
  contactEmail: 'contactEmail',
  overallOfficial: 'overallOfficial',
  locations: 'locations',
  fhirResearchStudy: 'fhirResearchStudy',
  lastSyncedAt: 'lastSyncedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TrialSiteScalarFieldEnum = {
  id: 'id',
  trialId: 'trialId',
  facilityName: 'facilityName',
  facilityId: 'facilityId',
  status: 'status',
  city: 'city',
  state: 'state',
  country: 'country',
  zipCode: 'zipCode',
  latitude: 'latitude',
  longitude: 'longitude',
  contactName: 'contactName',
  contactPhone: 'contactPhone',
  contactEmail: 'contactEmail',
  principalInvestigator: 'principalInvestigator',
  recruitmentStatus: 'recruitmentStatus',
  targetEnrollment: 'targetEnrollment',
  currentEnrollment: 'currentEnrollment',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PatientMatchScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  trialId: 'trialId',
  matchScore: 'matchScore',
  eligibilityStatus: 'eligibilityStatus',
  matchedCriteria: 'matchedCriteria',
  unmatchedCriteria: 'unmatchedCriteria',
  uncertainCriteria: 'uncertainCriteria',
  matchDetails: 'matchDetails',
  distance: 'distance',
  nearestSiteId: 'nearestSiteId',
  reviewStatus: 'reviewStatus',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  reviewNotes: 'reviewNotes',
  patientNotified: 'patientNotified',
  notifiedAt: 'notifiedAt',
  isInterested: 'isInterested',
  interestExpressedAt: 'interestExpressedAt',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EnrollmentScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  trialId: 'trialId',
  siteId: 'siteId',
  status: 'status',
  studySubjectId: 'studySubjectId',
  screeningDate: 'screeningDate',
  enrollmentDate: 'enrollmentDate',
  randomizationDate: 'randomizationDate',
  armAssignment: 'armAssignment',
  withdrawalDate: 'withdrawalDate',
  withdrawalReason: 'withdrawalReason',
  completionDate: 'completionDate',
  primaryInvestigator: 'primaryInvestigator',
  studyCoordinator: 'studyCoordinator',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EnrollmentStatusHistoryScalarFieldEnum = {
  id: 'id',
  enrollmentId: 'enrollmentId',
  fromStatus: 'fromStatus',
  toStatus: 'toStatus',
  reason: 'reason',
  changedBy: 'changedBy',
  changedAt: 'changedAt'
};

exports.Prisma.ConsentRecordScalarFieldEnum = {
  id: 'id',
  enrollmentId: 'enrollmentId',
  consentType: 'consentType',
  consentFormId: 'consentFormId',
  consentFormVersion: 'consentFormVersion',
  signedAt: 'signedAt',
  signedBy: 'signedBy',
  witnessName: 'witnessName',
  witnessSignedAt: 'witnessSignedAt',
  coordinatorName: 'coordinatorName',
  coordinatorId: 'coordinatorId',
  documentUrl: 'documentUrl',
  isActive: 'isActive',
  revokedAt: 'revokedAt',
  revokedReason: 'revokedReason',
  expiresAt: 'expiresAt',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TrialVisitScalarFieldEnum = {
  id: 'id',
  enrollmentId: 'enrollmentId',
  visitNumber: 'visitNumber',
  visitName: 'visitName',
  visitType: 'visitType',
  scheduledDate: 'scheduledDate',
  actualDate: 'actualDate',
  status: 'status',
  completedBy: 'completedBy',
  notes: 'notes',
  protocolDeviations: 'protocolDeviations',
  missedReason: 'missedReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvestigatorScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  specialty: 'specialty',
  institution: 'institution',
  npiNumber: 'npiNumber',
  licenseNumber: 'licenseNumber',
  licenseState: 'licenseState',
  cvUrl: 'cvUrl',
  isActive: 'isActive',
  roles: 'roles',
  certifications: 'certifications',
  trainingRecords: 'trainingRecords',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvestigatorSiteAssignmentScalarFieldEnum = {
  id: 'id',
  investigatorId: 'investigatorId',
  siteId: 'siteId',
  trialId: 'trialId',
  role: 'role',
  startDate: 'startDate',
  endDate: 'endDate',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TrialNotificationScalarFieldEnum = {
  id: 'id',
  recipientId: 'recipientId',
  recipientType: 'recipientType',
  type: 'type',
  title: 'title',
  message: 'message',
  trialId: 'trialId',
  enrollmentId: 'enrollmentId',
  matchId: 'matchId',
  priority: 'priority',
  isRead: 'isRead',
  readAt: 'readAt',
  sentAt: 'sentAt',
  deliveryMethod: 'deliveryMethod',
  externalId: 'externalId',
  createdAt: 'createdAt'
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
exports.TrialStatus = exports.$Enums.TrialStatus = {
  not_yet_recruiting: 'not_yet_recruiting',
  recruiting: 'recruiting',
  enrolling_by_invitation: 'enrolling_by_invitation',
  active_not_recruiting: 'active_not_recruiting',
  suspended: 'suspended',
  terminated: 'terminated',
  completed: 'completed',
  withdrawn: 'withdrawn',
  unknown: 'unknown'
};

exports.TrialPhase = exports.$Enums.TrialPhase = {
  early_phase_1: 'early_phase_1',
  phase_1: 'phase_1',
  phase_1_2: 'phase_1_2',
  phase_2: 'phase_2',
  phase_2_3: 'phase_2_3',
  phase_3: 'phase_3',
  phase_4: 'phase_4',
  not_applicable: 'not_applicable'
};

exports.StudyType = exports.$Enums.StudyType = {
  interventional: 'interventional',
  observational: 'observational',
  expanded_access: 'expanded_access',
  patient_registry: 'patient_registry'
};

exports.SiteStatus = exports.$Enums.SiteStatus = {
  pending: 'pending',
  active: 'active',
  recruiting: 'recruiting',
  closed: 'closed',
  suspended: 'suspended',
  withdrawn: 'withdrawn'
};

exports.EligibilityStatus = exports.$Enums.EligibilityStatus = {
  eligible: 'eligible',
  potentially_eligible: 'potentially_eligible',
  ineligible: 'ineligible',
  unknown: 'unknown',
  requires_screening: 'requires_screening'
};

exports.ReviewStatus = exports.$Enums.ReviewStatus = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  needs_info: 'needs_info'
};

exports.EnrollmentStatus = exports.$Enums.EnrollmentStatus = {
  screening: 'screening',
  screen_failed: 'screen_failed',
  enrolled: 'enrolled',
  randomized: 'randomized',
  active: 'active',
  on_hold: 'on_hold',
  withdrawn: 'withdrawn',
  completed: 'completed',
  lost_to_follow_up: 'lost_to_follow_up'
};

exports.ConsentType = exports.$Enums.ConsentType = {
  main_study: 'main_study',
  optional_sub_study: 'optional_sub_study',
  genetic_testing: 'genetic_testing',
  biobanking: 'biobanking',
  future_contact: 'future_contact',
  data_sharing: 'data_sharing',
  imaging: 'imaging',
  amendment: 'amendment',
  reconsent: 'reconsent'
};

exports.VisitType = exports.$Enums.VisitType = {
  screening: 'screening',
  baseline: 'baseline',
  scheduled: 'scheduled',
  unscheduled: 'unscheduled',
  early_termination: 'early_termination',
  follow_up: 'follow_up',
  closeout: 'closeout'
};

exports.VisitStatus = exports.$Enums.VisitStatus = {
  scheduled: 'scheduled',
  completed: 'completed',
  missed: 'missed',
  rescheduled: 'rescheduled',
  cancelled: 'cancelled'
};

exports.InvestigatorRole = exports.$Enums.InvestigatorRole = {
  principal_investigator: 'principal_investigator',
  sub_investigator: 'sub_investigator',
  study_coordinator: 'study_coordinator',
  research_nurse: 'research_nurse',
  data_manager: 'data_manager',
  pharmacist: 'pharmacist',
  laboratory: 'laboratory'
};

exports.RecipientType = exports.$Enums.RecipientType = {
  patient: 'patient',
  investigator: 'investigator',
  coordinator: 'coordinator',
  sponsor: 'sponsor',
  admin: 'admin'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  new_match: 'new_match',
  eligibility_update: 'eligibility_update',
  enrollment_status: 'enrollment_status',
  visit_reminder: 'visit_reminder',
  consent_required: 'consent_required',
  trial_status_change: 'trial_status_change',
  document_ready: 'document_ready',
  action_required: 'action_required',
  general: 'general'
};

exports.NotificationPriority = exports.$Enums.NotificationPriority = {
  low: 'low',
  normal: 'normal',
  high: 'high',
  urgent: 'urgent'
};

exports.DeliveryMethod = exports.$Enums.DeliveryMethod = {
  in_app: 'in_app',
  email: 'email',
  sms: 'sms',
  push: 'push'
};

exports.Prisma.ModelName = {
  ClinicalTrial: 'ClinicalTrial',
  TrialSite: 'TrialSite',
  PatientMatch: 'PatientMatch',
  Enrollment: 'Enrollment',
  EnrollmentStatusHistory: 'EnrollmentStatusHistory',
  ConsentRecord: 'ConsentRecord',
  TrialVisit: 'TrialVisit',
  Investigator: 'Investigator',
  InvestigatorSiteAssignment: 'InvestigatorSiteAssignment',
  TrialNotification: 'TrialNotification'
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
