
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

exports.Prisma.CaregiverScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  licenseNumber: 'licenseNumber',
  licenseType: 'licenseType',
  licenseExpiry: 'licenseExpiry',
  certifications: 'certifications',
  specialties: 'specialties',
  languages: 'languages',
  status: 'status',
  hourlyRate: 'hourlyRate',
  maxDailyVisits: 'maxDailyVisits',
  maxWeeklyHours: 'maxWeeklyHours',
  currentLatitude: 'currentLatitude',
  currentLongitude: 'currentLongitude',
  lastLocationUpdate: 'lastLocationUpdate',
  homeLatitude: 'homeLatitude',
  homeLongitude: 'homeLongitude',
  homeAddress: 'homeAddress',
  serviceRadius: 'serviceRadius',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CaregiverScheduleScalarFieldEnum = {
  id: 'id',
  caregiverId: 'caregiverId',
  dayOfWeek: 'dayOfWeek',
  startTime: 'startTime',
  endTime: 'endTime',
  isAvailable: 'isAvailable',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PatientHomeScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  address: 'address',
  addressLine2: 'addressLine2',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  country: 'country',
  latitude: 'latitude',
  longitude: 'longitude',
  accessInstructions: 'accessInstructions',
  gateCode: 'gateCode',
  parkingInfo: 'parkingInfo',
  petInfo: 'petInfo',
  emergencyContact: 'emergencyContact',
  emergencyPhone: 'emergencyPhone',
  homeType: 'homeType',
  hasStairs: 'hasStairs',
  wheelchairAccessible: 'wheelchairAccessible',
  oxygenInHome: 'oxygenInHome',
  safetyHazards: 'safetyHazards',
  specialEquipment: 'specialEquipment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HomeVisitScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  patientHomeId: 'patientHomeId',
  caregiverId: 'caregiverId',
  scheduledDate: 'scheduledDate',
  scheduledStartTime: 'scheduledStartTime',
  scheduledEndTime: 'scheduledEndTime',
  estimatedDuration: 'estimatedDuration',
  priority: 'priority',
  visitType: 'visitType',
  status: 'status',
  actualStartTime: 'actualStartTime',
  actualEndTime: 'actualEndTime',
  actualDuration: 'actualDuration',
  startLatitude: 'startLatitude',
  startLongitude: 'startLongitude',
  endLatitude: 'endLatitude',
  endLongitude: 'endLongitude',
  reasonForVisit: 'reasonForVisit',
  clinicalNotes: 'clinicalNotes',
  patientCondition: 'patientCondition',
  followUpRequired: 'followUpRequired',
  followUpNotes: 'followUpNotes',
  caregiverSignature: 'caregiverSignature',
  patientSignature: 'patientSignature',
  signedAt: 'signedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VisitTaskScalarFieldEnum = {
  id: 'id',
  visitId: 'visitId',
  taskType: 'taskType',
  title: 'title',
  description: 'description',
  isRequired: 'isRequired',
  sequence: 'sequence',
  status: 'status',
  completedAt: 'completedAt',
  completedBy: 'completedBy',
  notes: 'notes',
  vitalType: 'vitalType',
  vitalValue: 'vitalValue',
  vitalUnit: 'vitalUnit',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EVVRecordScalarFieldEnum = {
  id: 'id',
  visitId: 'visitId',
  recordType: 'recordType',
  timestamp: 'timestamp',
  latitude: 'latitude',
  longitude: 'longitude',
  accuracy: 'accuracy',
  deviceId: 'deviceId',
  deviceType: 'deviceType',
  ipAddress: 'ipAddress',
  isVerified: 'isVerified',
  verificationMethod: 'verificationMethod',
  verificationNotes: 'verificationNotes',
  distanceFromHome: 'distanceFromHome',
  isWithinGeofence: 'isWithinGeofence',
  geofenceRadius: 'geofenceRadius',
  createdAt: 'createdAt'
};

exports.Prisma.TimeEntryScalarFieldEnum = {
  id: 'id',
  caregiverId: 'caregiverId',
  visitId: 'visitId',
  entryType: 'entryType',
  startTime: 'startTime',
  endTime: 'endTime',
  duration: 'duration',
  startLatitude: 'startLatitude',
  startLongitude: 'startLongitude',
  endLatitude: 'endLatitude',
  endLongitude: 'endLongitude',
  status: 'status',
  approvedBy: 'approvedBy',
  approvedAt: 'approvedAt',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MileageEntryScalarFieldEnum = {
  id: 'id',
  caregiverId: 'caregiverId',
  date: 'date',
  startAddress: 'startAddress',
  endAddress: 'endAddress',
  distance: 'distance',
  purpose: 'purpose',
  startLatitude: 'startLatitude',
  startLongitude: 'startLongitude',
  endLatitude: 'endLatitude',
  endLongitude: 'endLongitude',
  routeData: 'routeData',
  ratePerMile: 'ratePerMile',
  totalAmount: 'totalAmount',
  status: 'status',
  approvedBy: 'approvedBy',
  approvedAt: 'approvedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HomeAssessmentScalarFieldEnum = {
  id: 'id',
  patientHomeId: 'patientHomeId',
  assessorId: 'assessorId',
  assessmentDate: 'assessmentDate',
  safetyScore: 'safetyScore',
  fallRisk: 'fallRisk',
  fireRisk: 'fireRisk',
  infectionRisk: 'infectionRisk',
  cleanlinessScore: 'cleanlinessScore',
  adequateLighting: 'adequateLighting',
  adequateVentilation: 'adequateVentilation',
  workingUtilities: 'workingUtilities',
  bathroomAccessible: 'bathroomAccessible',
  bedroomAccessible: 'bedroomAccessible',
  kitchenAccessible: 'kitchenAccessible',
  recommendations: 'recommendations',
  requiredEquipment: 'requiredEquipment',
  followUpDate: 'followUpDate',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MedicationAdministrationScalarFieldEnum = {
  id: 'id',
  visitId: 'visitId',
  medicationName: 'medicationName',
  dosage: 'dosage',
  route: 'route',
  scheduledTime: 'scheduledTime',
  administeredTime: 'administeredTime',
  status: 'status',
  refusedReason: 'refusedReason',
  notes: 'notes',
  administeredBy: 'administeredBy',
  witnessedBy: 'witnessedBy',
  medicationBarcode: 'medicationBarcode',
  patientBarcode: 'patientBarcode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.IncidentScalarFieldEnum = {
  id: 'id',
  visitId: 'visitId',
  patientId: 'patientId',
  caregiverId: 'caregiverId',
  incidentType: 'incidentType',
  severity: 'severity',
  occurredAt: 'occurredAt',
  location: 'location',
  description: 'description',
  immediateAction: 'immediateAction',
  witnessNames: 'witnessNames',
  fallType: 'fallType',
  injuryOccurred: 'injuryOccurred',
  injuryDescription: 'injuryDescription',
  medicalAttentionRequired: 'medicalAttentionRequired',
  emergencyServicesNotified: 'emergencyServicesNotified',
  status: 'status',
  investigatedBy: 'investigatedBy',
  investigatedAt: 'investigatedAt',
  rootCause: 'rootCause',
  preventiveMeasures: 'preventiveMeasures',
  familyNotified: 'familyNotified',
  physicianNotified: 'physicianNotified',
  supervisorNotified: 'supervisorNotified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VisitDocumentationScalarFieldEnum = {
  id: 'id',
  visitId: 'visitId',
  documentType: 'documentType',
  title: 'title',
  content: 'content',
  fileUrl: 'fileUrl',
  fileType: 'fileType',
  fileSize: 'fileSize',
  assessmentData: 'assessmentData',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PatientEquipmentScalarFieldEnum = {
  id: 'id',
  patientHomeId: 'patientHomeId',
  equipmentType: 'equipmentType',
  name: 'name',
  serialNumber: 'serialNumber',
  manufacturer: 'manufacturer',
  model: 'model',
  status: 'status',
  condition: 'condition',
  deliveredDate: 'deliveredDate',
  expectedReturnDate: 'expectedReturnDate',
  returnedDate: 'returnedDate',
  lastMaintenanceDate: 'lastMaintenanceDate',
  nextMaintenanceDate: 'nextMaintenanceDate',
  maintenanceNotes: 'maintenanceNotes',
  ownershipType: 'ownershipType',
  rentalCompany: 'rentalCompany',
  monthlyRentalCost: 'monthlyRentalCost',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FamilyCommunicationScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  familyMemberId: 'familyMemberId',
  caregiverId: 'caregiverId',
  communicationType: 'communicationType',
  subject: 'subject',
  message: 'message',
  visitId: 'visitId',
  isRead: 'isRead',
  readAt: 'readAt',
  parentMessageId: 'parentMessageId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupplyOrderScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  orderedBy: 'orderedBy',
  items: 'items',
  totalCost: 'totalCost',
  status: 'status',
  orderedAt: 'orderedAt',
  expectedDelivery: 'expectedDelivery',
  deliveredAt: 'deliveredAt',
  deliveryNotes: 'deliveryNotes',
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
exports.LicenseType = exports.$Enums.LicenseType = {
  RN: 'RN',
  LPN: 'LPN',
  LVN: 'LVN',
  CNA: 'CNA',
  HHA: 'HHA',
  PT: 'PT',
  OT: 'OT',
  ST: 'ST',
  MSW: 'MSW',
  OTHER: 'OTHER'
};

exports.CaregiverStatus = exports.$Enums.CaregiverStatus = {
  active: 'active',
  inactive: 'inactive',
  on_leave: 'on_leave',
  terminated: 'terminated'
};

exports.HomeType = exports.$Enums.HomeType = {
  single_family: 'single_family',
  apartment: 'apartment',
  condo: 'condo',
  townhouse: 'townhouse',
  assisted_living: 'assisted_living',
  nursing_facility: 'nursing_facility',
  group_home: 'group_home',
  other: 'other'
};

exports.VisitPriority = exports.$Enums.VisitPriority = {
  routine: 'routine',
  urgent: 'urgent',
  emergency: 'emergency',
  prn: 'prn'
};

exports.VisitType = exports.$Enums.VisitType = {
  skilled_nursing: 'skilled_nursing',
  physical_therapy: 'physical_therapy',
  occupational_therapy: 'occupational_therapy',
  speech_therapy: 'speech_therapy',
  home_health_aide: 'home_health_aide',
  medical_social_services: 'medical_social_services',
  wound_care: 'wound_care',
  medication_management: 'medication_management',
  post_surgical: 'post_surgical',
  chronic_care: 'chronic_care',
  palliative: 'palliative',
  hospice: 'hospice',
  pediatric: 'pediatric',
  assessment: 'assessment',
  other: 'other'
};

exports.VisitStatus = exports.$Enums.VisitStatus = {
  scheduled: 'scheduled',
  confirmed: 'confirmed',
  en_route: 'en_route',
  arrived: 'arrived',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'no_show',
  rescheduled: 'rescheduled'
};

exports.CareTaskType = exports.$Enums.CareTaskType = {
  vital_signs: 'vital_signs',
  medication: 'medication',
  wound_care: 'wound_care',
  personal_care: 'personal_care',
  mobility: 'mobility',
  nutrition: 'nutrition',
  hydration: 'hydration',
  exercise: 'exercise',
  education: 'education',
  assessment: 'assessment',
  documentation: 'documentation',
  equipment_check: 'equipment_check',
  safety_check: 'safety_check',
  communication: 'communication',
  other: 'other'
};

exports.TaskCompletionStatus = exports.$Enums.TaskCompletionStatus = {
  pending: 'pending',
  completed: 'completed',
  skipped: 'skipped',
  unable_to_complete: 'unable_to_complete',
  deferred: 'deferred'
};

exports.EVVRecordType = exports.$Enums.EVVRecordType = {
  clock_in: 'clock_in',
  clock_out: 'clock_out',
  location_update: 'location_update',
  task_completion: 'task_completion',
  signature_capture: 'signature_capture'
};

exports.EVVVerificationMethod = exports.$Enums.EVVVerificationMethod = {
  gps: 'gps',
  telephony: 'telephony',
  biometric: 'biometric',
  fixed_device: 'fixed_device',
  manual_override: 'manual_override'
};

exports.TimeEntryType = exports.$Enums.TimeEntryType = {
  visit: 'visit',
  travel: 'travel',
  training: 'training',
  administrative: 'administrative',
  on_call: 'on_call',
  overtime: 'overtime',
  other: 'other'
};

exports.ApprovalStatus = exports.$Enums.ApprovalStatus = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  disputed: 'disputed'
};

exports.RiskLevel = exports.$Enums.RiskLevel = {
  low: 'low',
  moderate: 'moderate',
  high: 'high',
  critical: 'critical'
};

exports.MedicationRoute = exports.$Enums.MedicationRoute = {
  oral: 'oral',
  sublingual: 'sublingual',
  topical: 'topical',
  inhaled: 'inhaled',
  subcutaneous: 'subcutaneous',
  intramuscular: 'intramuscular',
  intravenous: 'intravenous',
  rectal: 'rectal',
  ophthalmic: 'ophthalmic',
  otic: 'otic',
  nasal: 'nasal',
  transdermal: 'transdermal',
  other: 'other'
};

exports.MedicationStatus = exports.$Enums.MedicationStatus = {
  pending: 'pending',
  administered: 'administered',
  refused: 'refused',
  held: 'held',
  not_available: 'not_available',
  self_administered: 'self_administered'
};

exports.IncidentType = exports.$Enums.IncidentType = {
  fall: 'fall',
  medication_error: 'medication_error',
  skin_injury: 'skin_injury',
  equipment_malfunction: 'equipment_malfunction',
  behavioral: 'behavioral',
  environmental: 'environmental',
  security: 'security',
  missing_patient: 'missing_patient',
  abuse_neglect: 'abuse_neglect',
  other: 'other'
};

exports.IncidentSeverity = exports.$Enums.IncidentSeverity = {
  minor: 'minor',
  moderate: 'moderate',
  major: 'major',
  critical: 'critical'
};

exports.FallType = exports.$Enums.FallType = {
  witnessed: 'witnessed',
  unwitnessed: 'unwitnessed',
  near_miss: 'near_miss',
  assisted_to_floor: 'assisted_to_floor'
};

exports.IncidentStatus = exports.$Enums.IncidentStatus = {
  reported: 'reported',
  under_investigation: 'under_investigation',
  investigated: 'investigated',
  closed: 'closed',
  requires_action: 'requires_action'
};

exports.DocumentType = exports.$Enums.DocumentType = {
  progress_note: 'progress_note',
  assessment: 'assessment',
  care_plan: 'care_plan',
  physician_order: 'physician_order',
  consent_form: 'consent_form',
  discharge_summary: 'discharge_summary',
  wound_photo: 'wound_photo',
  vital_signs_log: 'vital_signs_log',
  medication_list: 'medication_list',
  family_communication: 'family_communication',
  other: 'other'
};

exports.EquipmentType = exports.$Enums.EquipmentType = {
  hospital_bed: 'hospital_bed',
  wheelchair: 'wheelchair',
  walker: 'walker',
  cane: 'cane',
  oxygen_concentrator: 'oxygen_concentrator',
  oxygen_tank: 'oxygen_tank',
  nebulizer: 'nebulizer',
  suction_machine: 'suction_machine',
  feeding_pump: 'feeding_pump',
  iv_pump: 'iv_pump',
  cpap: 'cpap',
  bipap: 'bipap',
  lift: 'lift',
  commode: 'commode',
  shower_chair: 'shower_chair',
  blood_pressure_monitor: 'blood_pressure_monitor',
  glucose_monitor: 'glucose_monitor',
  pulse_oximeter: 'pulse_oximeter',
  other: 'other'
};

exports.EquipmentStatus = exports.$Enums.EquipmentStatus = {
  active: 'active',
  returned: 'returned',
  lost: 'lost',
  damaged: 'damaged',
  maintenance: 'maintenance'
};

exports.EquipmentCondition = exports.$Enums.EquipmentCondition = {
  excellent: 'excellent',
  good: 'good',
  fair: 'fair',
  poor: 'poor'
};

exports.OwnershipType = exports.$Enums.OwnershipType = {
  rental: 'rental',
  purchase: 'purchase',
  loan: 'loan',
  insurance_provided: 'insurance_provided'
};

exports.CommunicationType = exports.$Enums.CommunicationType = {
  visit_update: 'visit_update',
  schedule_change: 'schedule_change',
  medication_reminder: 'medication_reminder',
  care_plan_update: 'care_plan_update',
  general_inquiry: 'general_inquiry',
  emergency_notification: 'emergency_notification',
  documentation_shared: 'documentation_shared',
  feedback: 'feedback',
  other: 'other'
};

exports.SupplyOrderStatus = exports.$Enums.SupplyOrderStatus = {
  pending: 'pending',
  ordered: 'ordered',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
  back_ordered: 'back_ordered'
};

exports.Prisma.ModelName = {
  Caregiver: 'Caregiver',
  CaregiverSchedule: 'CaregiverSchedule',
  PatientHome: 'PatientHome',
  HomeVisit: 'HomeVisit',
  VisitTask: 'VisitTask',
  EVVRecord: 'EVVRecord',
  TimeEntry: 'TimeEntry',
  MileageEntry: 'MileageEntry',
  HomeAssessment: 'HomeAssessment',
  MedicationAdministration: 'MedicationAdministration',
  Incident: 'Incident',
  VisitDocumentation: 'VisitDocumentation',
  PatientEquipment: 'PatientEquipment',
  FamilyCommunication: 'FamilyCommunication',
  SupplyOrder: 'SupplyOrder'
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
