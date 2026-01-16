
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

exports.Prisma.TherapySessionScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  therapistId: 'therapistId',
  sessionType: 'sessionType',
  status: 'status',
  scheduledAt: 'scheduledAt',
  duration: 'duration',
  modality: 'modality',
  notes: 'notes',
  homework: 'homework',
  nextSessionDate: 'nextSessionDate',
  actualStartTime: 'actualStartTime',
  actualEndTime: 'actualEndTime',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MentalHealthAssessmentScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  assessedBy: 'assessedBy',
  assessmentType: 'assessmentType',
  score: 'score',
  severity: 'severity',
  results: 'results',
  notes: 'notes',
  followUpRequired: 'followUpRequired',
  followUpDate: 'followUpDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CrisisInterventionScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  responderId: 'responderId',
  crisisType: 'crisisType',
  severity: 'severity',
  status: 'status',
  description: 'description',
  interventions: 'interventions',
  outcome: 'outcome',
  referredTo: 'referredTo',
  contactedAt: 'contactedAt',
  resolvedAt: 'resolvedAt',
  followUpNeeded: 'followUpNeeded',
  followUpDate: 'followUpDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TreatmentPlanScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  providerId: 'providerId',
  diagnosis: 'diagnosis',
  goals: 'goals',
  interventions: 'interventions',
  medications: 'medications',
  frequency: 'frequency',
  startDate: 'startDate',
  reviewDate: 'reviewDate',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MoodLogScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  moodRating: 'moodRating',
  notes: 'notes',
  triggers: 'triggers',
  activities: 'activities',
  logDate: 'logDate',
  createdAt: 'createdAt'
};

exports.Prisma.SupportGroupScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  type: 'type',
  facilitatorId: 'facilitatorId',
  schedule: 'schedule',
  maxMembers: 'maxMembers',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupportGroupMemberScalarFieldEnum = {
  id: 'id',
  groupId: 'groupId',
  patientId: 'patientId',
  joinedAt: 'joinedAt',
  status: 'status'
};

exports.Prisma.ConsentRecordScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  providerId: 'providerId',
  consentType: 'consentType',
  status: 'status',
  signedAt: 'signedAt',
  expiresAt: 'expiresAt',
  scope: 'scope',
  notes: 'notes',
  grantedTo: 'grantedTo',
  grantedAt: 'grantedAt',
  revokedAt: 'revokedAt',
  purpose: 'purpose',
  disclosureScope: 'disclosureScope',
  substanceUseDisclosure: 'substanceUseDisclosure',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GroupSessionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  medicationName: 'medicationName',
  description: 'description',
  facilitatorId: 'facilitatorId',
  sessionType: 'sessionType',
  status: 'status',
  scheduledAt: 'scheduledAt',
  sessionDate: 'sessionDate',
  duration: 'duration',
  modality: 'modality',
  maxParticipants: 'maxParticipants',
  topic: 'topic',
  notes: 'notes',
  homework: 'homework',
  nextSessionDate: 'nextSessionDate',
  actualStartTime: 'actualStartTime',
  actualEndTime: 'actualEndTime',
  objectives: 'objectives',
  materials: 'materials',
  groupId: 'groupId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GroupSessionAttendeeScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  patientId: 'patientId',
  attended: 'attended',
  notes: 'notes',
  participation: 'participation',
  createdAt: 'createdAt'
};

exports.Prisma.PsychMedicationScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  prescriberId: 'prescriberId',
  name: 'name',
  medicationName: 'medicationName',
  dosage: 'dosage',
  frequency: 'frequency',
  medicationClass: 'medicationClass',
  status: 'status',
  startDate: 'startDate',
  endDate: 'endDate',
  reason: 'reason',
  sideEffects: 'sideEffects',
  interactions: 'interactions',
  notes: 'notes',
  homework: 'homework',
  nextSessionDate: 'nextSessionDate',
  actualStartTime: 'actualStartTime',
  actualEndTime: 'actualEndTime',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProgressNoteScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  providerId: 'providerId',
  sessionId: 'sessionId',
  noteType: 'noteType',
  content: 'content',
  diagnosis: 'diagnosis',
  interventions: 'interventions',
  plan: 'plan',
  isSigned: 'isSigned',
  signedAt: 'signedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TreatmentGoalScalarFieldEnum = {
  id: 'id',
  treatmentPlanId: 'treatmentPlanId',
  title: 'title',
  description: 'description',
  targetDate: 'targetDate',
  status: 'status',
  progress: 'progress',
  interventions: 'interventions',
  strategies: 'strategies',
  measurements: 'measurements',
  notes: 'notes',
  homework: 'homework',
  nextSessionDate: 'nextSessionDate',
  actualStartTime: 'actualStartTime',
  actualEndTime: 'actualEndTime',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.SessionType = exports.$Enums.SessionType = {
  individual: 'individual',
  group: 'group',
  couples: 'couples',
  family: 'family'
};

exports.SessionStatus = exports.$Enums.SessionStatus = {
  scheduled: 'scheduled',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'no_show'
};

exports.AssessmentType = exports.$Enums.AssessmentType = {
  PHQ9: 'PHQ9',
  GAD7: 'GAD7',
  PCL5: 'PCL5',
  AUDIT: 'AUDIT',
  DAST: 'DAST',
  MDQ: 'MDQ',
  YBOCS: 'YBOCS',
  PSS: 'PSS',
  general_intake: 'general_intake'
};

exports.SeverityLevel = exports.$Enums.SeverityLevel = {
  none: 'none',
  minimal: 'minimal',
  mild: 'mild',
  moderate: 'moderate',
  moderately_severe: 'moderately_severe',
  severe: 'severe'
};

exports.CrisisType = exports.$Enums.CrisisType = {
  suicidal_ideation: 'suicidal_ideation',
  self_harm: 'self_harm',
  panic_attack: 'panic_attack',
  psychotic_episode: 'psychotic_episode',
  substance_overdose: 'substance_overdose',
  domestic_violence: 'domestic_violence',
  trauma: 'trauma',
  other: 'other'
};

exports.CrisisSeverity = exports.$Enums.CrisisSeverity = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical'
};

exports.CrisisStatus = exports.$Enums.CrisisStatus = {
  active: 'active',
  monitoring: 'monitoring',
  resolved: 'resolved',
  escalated: 'escalated'
};

exports.ConsentType = exports.$Enums.ConsentType = {
  treatment: 'treatment',
  medication: 'medication',
  information_sharing: 'information_sharing',
  information_release: 'information_release',
  telehealth: 'telehealth',
  research: 'research',
  emergency_contact: 'emergency_contact',
  cfr_part2: 'cfr_part2'
};

exports.ConsentStatus = exports.$Enums.ConsentStatus = {
  pending: 'pending',
  active: 'active',
  revoked: 'revoked',
  expired: 'expired'
};

exports.GroupSessionType = exports.$Enums.GroupSessionType = {
  support: 'support',
  psychoeducation: 'psychoeducation',
  skills_training: 'skills_training',
  process: 'process'
};

exports.GroupSessionStatus = exports.$Enums.GroupSessionStatus = {
  scheduled: 'scheduled',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'no_show'
};

exports.MedicationClass = exports.$Enums.MedicationClass = {
  antidepressant: 'antidepressant',
  antianxiety: 'antianxiety',
  anxiolytic: 'anxiolytic',
  antipsychotic: 'antipsychotic',
  mood_stabilizer: 'mood_stabilizer',
  stimulant: 'stimulant',
  sedative: 'sedative',
  sedative_hypnotic: 'sedative_hypnotic',
  other: 'other'
};

exports.MedicationStatus = exports.$Enums.MedicationStatus = {
  active: 'active',
  completed: 'completed',
  discontinued: 'discontinued',
  on_hold: 'on_hold',
  tapered: 'tapered'
};

exports.NoteType = exports.$Enums.NoteType = {
  initial_assessment: 'initial_assessment',
  progress: 'progress',
  discharge: 'discharge',
  crisis: 'crisis',
  consultation: 'consultation',
  group: 'group',
  SOAP: 'SOAP',
  DAP: 'DAP',
  BIRP: 'BIRP',
  GIRP: 'GIRP'
};

exports.TreatmentGoalStatus = exports.$Enums.TreatmentGoalStatus = {
  not_started: 'not_started',
  in_progress: 'in_progress',
  achieved: 'achieved',
  modified: 'modified',
  discontinued: 'discontinued'
};

exports.Prisma.ModelName = {
  TherapySession: 'TherapySession',
  MentalHealthAssessment: 'MentalHealthAssessment',
  CrisisIntervention: 'CrisisIntervention',
  TreatmentPlan: 'TreatmentPlan',
  MoodLog: 'MoodLog',
  SupportGroup: 'SupportGroup',
  SupportGroupMember: 'SupportGroupMember',
  ConsentRecord: 'ConsentRecord',
  GroupSession: 'GroupSession',
  GroupSessionAttendee: 'GroupSessionAttendee',
  PsychMedication: 'PsychMedication',
  ProgressNote: 'ProgressNote',
  TreatmentGoal: 'TreatmentGoal'
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
