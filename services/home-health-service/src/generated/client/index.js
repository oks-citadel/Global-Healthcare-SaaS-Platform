
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
} = require('./runtime/library.js')


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




  const path = require('path')

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
      "value": "C:\\Users\\citad\\OneDrive\\Documents\\Global-Healthcare-SaaS-Platform\\services\\home-health-service\\src\\generated\\client",
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
    "sourceFilePath": "C:\\Users\\citad\\OneDrive\\Documents\\Global-Healthcare-SaaS-Platform\\services\\home-health-service\\prisma\\schema.prisma",
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
  "inlineSchema": "generator client {\n  output   = \"./../src/generated/client\"\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// ==========================================\n// Home Health Workforce Domain\n// ==========================================\n\n// Caregiver/Nurse Model\nmodel Caregiver {\n  id             String          @id @default(uuid())\n  userId         String          @unique\n  firstName      String\n  lastName       String\n  email          String          @unique\n  phone          String\n  licenseNumber  String?\n  licenseType    LicenseType?\n  licenseExpiry  DateTime?\n  certifications Json? // Array of certifications\n  specialties    String[] // Array of specialties (wound care, pediatric, etc.)\n  languages      String[] // Languages spoken\n  status         CaregiverStatus @default(active)\n  hourlyRate     Float?\n  maxDailyVisits Int             @default(8)\n  maxWeeklyHours Float           @default(40)\n\n  // Location tracking\n  currentLatitude    Float?\n  currentLongitude   Float?\n  lastLocationUpdate DateTime?\n  homeLatitude       Float?\n  homeLongitude      Float?\n  homeAddress        String?\n  serviceRadius      Float     @default(25) // miles\n\n  // Relations\n  visits         HomeVisit[]\n  schedules      CaregiverSchedule[]\n  timeEntries    TimeEntry[]\n  mileageEntries MileageEntry[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@index([status])\n  @@index([licenseType])\n}\n\nenum LicenseType {\n  RN\n  LPN\n  LVN\n  CNA\n  HHA\n  PT\n  OT\n  ST\n  MSW\n  OTHER\n}\n\nenum CaregiverStatus {\n  active\n  inactive\n  on_leave\n  terminated\n}\n\nmodel CaregiverSchedule {\n  id          String    @id @default(uuid())\n  caregiverId String\n  caregiver   Caregiver @relation(fields: [caregiverId], references: [id], onDelete: Cascade)\n  dayOfWeek   Int // 0=Sunday, 6=Saturday\n  startTime   String // HH:MM format\n  endTime     String // HH:MM format\n  isAvailable Boolean   @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([caregiverId, dayOfWeek])\n  @@index([caregiverId])\n  @@index([dayOfWeek])\n}\n\n// Patient Home Profile\nmodel PatientHome {\n  id           String  @id @default(uuid())\n  patientId    String  @unique\n  address      String\n  addressLine2 String?\n  city         String\n  state        String\n  zipCode      String\n  country      String  @default(\"USA\")\n  latitude     Float?\n  longitude    Float?\n\n  // Access information\n  accessInstructions String?\n  gateCode           String?\n  parkingInfo        String?\n  petInfo            String?\n  emergencyContact   String?\n  emergencyPhone     String?\n\n  // Home assessment data\n  homeType             HomeType @default(single_family)\n  hasStairs            Boolean  @default(false)\n  wheelchairAccessible Boolean  @default(false)\n  oxygenInHome         Boolean  @default(false)\n  safetyHazards        String?\n  specialEquipment     String[]\n\n  // Relations\n  visits      HomeVisit[]\n  assessments HomeAssessment[]\n  equipment   PatientEquipment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([zipCode])\n}\n\nenum HomeType {\n  single_family\n  apartment\n  condo\n  townhouse\n  assisted_living\n  nursing_facility\n  group_home\n  other\n}\n\n// Home Visit Model\nmodel HomeVisit {\n  id            String      @id @default(uuid())\n  patientId     String\n  patientHomeId String\n  patientHome   PatientHome @relation(fields: [patientHomeId], references: [id])\n  caregiverId   String\n  caregiver     Caregiver   @relation(fields: [caregiverId], references: [id])\n\n  // Scheduling\n  scheduledDate      DateTime\n  scheduledStartTime String // HH:MM format\n  scheduledEndTime   String // HH:MM format\n  estimatedDuration  Int // minutes\n  priority           VisitPriority @default(routine)\n  visitType          VisitType\n\n  // Status tracking\n  status VisitStatus @default(scheduled)\n\n  // Actual times\n  actualStartTime DateTime?\n  actualEndTime   DateTime?\n  actualDuration  Int? // minutes\n\n  // Location verification\n  startLatitude  Float?\n  startLongitude Float?\n  endLatitude    Float?\n  endLongitude   Float?\n\n  // Visit details\n  reasonForVisit   String?\n  clinicalNotes    String?\n  patientCondition String?\n  followUpRequired Boolean @default(false)\n  followUpNotes    String?\n\n  // Signatures\n  caregiverSignature String?\n  patientSignature   String?\n  signedAt           DateTime?\n\n  // Relations\n  tasks         VisitTask[]\n  evvRecords    EVVRecord[]\n  medications   MedicationAdministration[]\n  incidents     Incident[]\n  documentation VisitDocumentation[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([caregiverId])\n  @@index([scheduledDate])\n  @@index([status])\n  @@index([patientHomeId])\n}\n\nenum VisitType {\n  skilled_nursing\n  physical_therapy\n  occupational_therapy\n  speech_therapy\n  home_health_aide\n  medical_social_services\n  wound_care\n  medication_management\n  post_surgical\n  chronic_care\n  palliative\n  hospice\n  pediatric\n  assessment\n  other\n}\n\nenum VisitPriority {\n  routine\n  urgent\n  emergency\n  prn\n}\n\nenum VisitStatus {\n  scheduled\n  confirmed\n  en_route\n  arrived\n  in_progress\n  completed\n  cancelled\n  no_show\n  rescheduled\n}\n\n// Visit Task Checklist\nmodel VisitTask {\n  id      String    @id @default(uuid())\n  visitId String\n  visit   HomeVisit @relation(fields: [visitId], references: [id], onDelete: Cascade)\n\n  taskType    CareTaskType\n  title       String\n  description String?\n  isRequired  Boolean      @default(true)\n  sequence    Int          @default(0)\n\n  // Completion\n  status      TaskCompletionStatus @default(pending)\n  completedAt DateTime?\n  completedBy String?\n  notes       String?\n\n  // For vital sign tasks\n  vitalType  String?\n  vitalValue Float?\n  vitalUnit  String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([visitId])\n  @@index([status])\n  @@index([taskType])\n}\n\nenum CareTaskType {\n  vital_signs\n  medication\n  wound_care\n  personal_care\n  mobility\n  nutrition\n  hydration\n  exercise\n  education\n  assessment\n  documentation\n  equipment_check\n  safety_check\n  communication\n  other\n}\n\nenum TaskCompletionStatus {\n  pending\n  completed\n  skipped\n  unable_to_complete\n  deferred\n}\n\n// Electronic Visit Verification (EVV) Record\nmodel EVVRecord {\n  id      String    @id @default(uuid())\n  visitId String\n  visit   HomeVisit @relation(fields: [visitId], references: [id], onDelete: Cascade)\n\n  recordType EVVRecordType\n  timestamp  DateTime      @default(now())\n\n  // GPS verification\n  latitude  Float\n  longitude Float\n  accuracy  Float? // GPS accuracy in meters\n\n  // Device info\n  deviceId   String?\n  deviceType String?\n  ipAddress  String?\n\n  // Verification\n  isVerified         Boolean               @default(false)\n  verificationMethod EVVVerificationMethod\n  verificationNotes  String?\n\n  // Distance from patient home\n  distanceFromHome Float? // meters\n  isWithinGeofence Boolean @default(false)\n  geofenceRadius   Float   @default(100) // meters\n\n  createdAt DateTime @default(now())\n\n  @@index([visitId])\n  @@index([timestamp])\n  @@index([recordType])\n}\n\nenum EVVRecordType {\n  clock_in\n  clock_out\n  location_update\n  task_completion\n  signature_capture\n}\n\nenum EVVVerificationMethod {\n  gps\n  telephony\n  biometric\n  fixed_device\n  manual_override\n}\n\n// Time Entry for caregivers\nmodel TimeEntry {\n  id          String    @id @default(uuid())\n  caregiverId String\n  caregiver   Caregiver @relation(fields: [caregiverId], references: [id], onDelete: Cascade)\n  visitId     String?\n\n  entryType TimeEntryType\n  startTime DateTime\n  endTime   DateTime?\n  duration  Int? // minutes\n\n  // Location\n  startLatitude  Float?\n  startLongitude Float?\n  endLatitude    Float?\n  endLongitude   Float?\n\n  // Approval\n  status     ApprovalStatus @default(pending)\n  approvedBy String?\n  approvedAt DateTime?\n  notes      String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([caregiverId])\n  @@index([visitId])\n  @@index([startTime])\n  @@index([status])\n}\n\nenum TimeEntryType {\n  visit\n  travel\n  training\n  administrative\n  on_call\n  overtime\n  other\n}\n\nenum ApprovalStatus {\n  pending\n  approved\n  rejected\n  disputed\n}\n\n// Mileage Entry\nmodel MileageEntry {\n  id          String    @id @default(uuid())\n  caregiverId String\n  caregiver   Caregiver @relation(fields: [caregiverId], references: [id], onDelete: Cascade)\n\n  date         DateTime @default(now())\n  startAddress String\n  endAddress   String\n  distance     Float // miles\n  purpose      String?\n\n  // GPS tracking\n  startLatitude  Float?\n  startLongitude Float?\n  endLatitude    Float?\n  endLongitude   Float?\n  routeData      Json? // Array of coordinates for the route\n\n  // Reimbursement\n  ratePerMile Float          @default(0.67) // IRS rate\n  totalAmount Float?\n  status      ApprovalStatus @default(pending)\n  approvedBy  String?\n  approvedAt  DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([caregiverId])\n  @@index([date])\n  @@index([status])\n}\n\n// Home Assessment\nmodel HomeAssessment {\n  id             String      @id @default(uuid())\n  patientHomeId  String\n  patientHome    PatientHome @relation(fields: [patientHomeId], references: [id], onDelete: Cascade)\n  assessorId     String\n  assessmentDate DateTime    @default(now())\n\n  // Safety assessment\n  safetyScore   Int? // 0-100\n  fallRisk      RiskLevel @default(low)\n  fireRisk      RiskLevel @default(low)\n  infectionRisk RiskLevel @default(low)\n\n  // Living conditions\n  cleanlinessScore    Int? // 0-100\n  adequateLighting    Boolean @default(true)\n  adequateVentilation Boolean @default(true)\n  workingUtilities    Boolean @default(true)\n\n  // Accessibility\n  bathroomAccessible Boolean @default(true)\n  bedroomAccessible  Boolean @default(true)\n  kitchenAccessible  Boolean @default(true)\n\n  // Recommendations\n  recommendations   Json? // Array of recommendations\n  requiredEquipment String[]\n  followUpDate      DateTime?\n\n  notes String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientHomeId])\n  @@index([assessmentDate])\n}\n\nenum RiskLevel {\n  low\n  moderate\n  high\n  critical\n}\n\n// Medication Administration Record\nmodel MedicationAdministration {\n  id      String    @id @default(uuid())\n  visitId String\n  visit   HomeVisit @relation(fields: [visitId], references: [id], onDelete: Cascade)\n\n  medicationName   String\n  dosage           String\n  route            MedicationRoute\n  scheduledTime    DateTime\n  administeredTime DateTime?\n\n  status        MedicationStatus @default(pending)\n  refusedReason String?\n  notes         String?\n\n  // Verification\n  administeredBy String?\n  witnessedBy    String?\n\n  // Barcode/verification\n  medicationBarcode String?\n  patientBarcode    String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([visitId])\n  @@index([scheduledTime])\n  @@index([status])\n}\n\nenum MedicationRoute {\n  oral\n  sublingual\n  topical\n  inhaled\n  subcutaneous\n  intramuscular\n  intravenous\n  rectal\n  ophthalmic\n  otic\n  nasal\n  transdermal\n  other\n}\n\nenum MedicationStatus {\n  pending\n  administered\n  refused\n  held\n  not_available\n  self_administered\n}\n\n// Incident/Fall Reporting\nmodel Incident {\n  id          String     @id @default(uuid())\n  visitId     String?\n  visit       HomeVisit? @relation(fields: [visitId], references: [id], onDelete: SetNull)\n  patientId   String\n  caregiverId String?\n\n  incidentType IncidentType\n  severity     IncidentSeverity\n  occurredAt   DateTime\n  location     String?\n\n  // Incident details\n  description     String\n  immediateAction String?\n  witnessNames    String?\n\n  // For falls specifically\n  fallType                  FallType?\n  injuryOccurred            Boolean   @default(false)\n  injuryDescription         String?\n  medicalAttentionRequired  Boolean   @default(false)\n  emergencyServicesNotified Boolean   @default(false)\n\n  // Follow-up\n  status             IncidentStatus @default(reported)\n  investigatedBy     String?\n  investigatedAt     DateTime?\n  rootCause          String?\n  preventiveMeasures String?\n\n  // Notifications\n  familyNotified     Boolean @default(false)\n  physicianNotified  Boolean @default(false)\n  supervisorNotified Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([visitId])\n  @@index([incidentType])\n  @@index([occurredAt])\n  @@index([status])\n}\n\nenum IncidentType {\n  fall\n  medication_error\n  skin_injury\n  equipment_malfunction\n  behavioral\n  environmental\n  security\n  missing_patient\n  abuse_neglect\n  other\n}\n\nenum IncidentSeverity {\n  minor\n  moderate\n  major\n  critical\n}\n\nenum FallType {\n  witnessed\n  unwitnessed\n  near_miss\n  assisted_to_floor\n}\n\nenum IncidentStatus {\n  reported\n  under_investigation\n  investigated\n  closed\n  requires_action\n}\n\n// Visit Documentation\nmodel VisitDocumentation {\n  id      String    @id @default(uuid())\n  visitId String\n  visit   HomeVisit @relation(fields: [visitId], references: [id], onDelete: Cascade)\n\n  documentType DocumentType\n  title        String\n  content      String?\n  fileUrl      String?\n  fileType     String?\n  fileSize     Int?\n\n  // For structured assessments\n  assessmentData Json?\n\n  createdBy String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([visitId])\n  @@index([documentType])\n}\n\nenum DocumentType {\n  progress_note\n  assessment\n  care_plan\n  physician_order\n  consent_form\n  discharge_summary\n  wound_photo\n  vital_signs_log\n  medication_list\n  family_communication\n  other\n}\n\n// Patient Equipment Tracking\nmodel PatientEquipment {\n  id            String      @id @default(uuid())\n  patientHomeId String\n  patientHome   PatientHome @relation(fields: [patientHomeId], references: [id], onDelete: Cascade)\n\n  equipmentType EquipmentType\n  name          String\n  serialNumber  String?\n  manufacturer  String?\n  model         String?\n\n  // Tracking\n  status             EquipmentStatus    @default(active)\n  condition          EquipmentCondition @default(good)\n  deliveredDate      DateTime?\n  expectedReturnDate DateTime?\n  returnedDate       DateTime?\n\n  // Maintenance\n  lastMaintenanceDate DateTime?\n  nextMaintenanceDate DateTime?\n  maintenanceNotes    String?\n\n  // Ownership\n  ownershipType     OwnershipType @default(rental)\n  rentalCompany     String?\n  monthlyRentalCost Float?\n\n  notes String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientHomeId])\n  @@index([equipmentType])\n  @@index([status])\n}\n\nenum EquipmentType {\n  hospital_bed\n  wheelchair\n  walker\n  cane\n  oxygen_concentrator\n  oxygen_tank\n  nebulizer\n  suction_machine\n  feeding_pump\n  iv_pump\n  cpap\n  bipap\n  lift\n  commode\n  shower_chair\n  blood_pressure_monitor\n  glucose_monitor\n  pulse_oximeter\n  other\n}\n\nenum EquipmentStatus {\n  active\n  returned\n  lost\n  damaged\n  maintenance\n}\n\nenum EquipmentCondition {\n  excellent\n  good\n  fair\n  poor\n}\n\nenum OwnershipType {\n  rental\n  purchase\n  loan\n  insurance_provided\n}\n\n// Family/Caregiver Communication\nmodel FamilyCommunication {\n  id             String  @id @default(uuid())\n  patientId      String\n  familyMemberId String?\n  caregiverId    String?\n\n  communicationType CommunicationType\n  subject           String?\n  message           String\n\n  // If related to a visit\n  visitId String?\n\n  // Status\n  isRead Boolean   @default(false)\n  readAt DateTime?\n\n  // Reply chain\n  parentMessageId String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([familyMemberId])\n  @@index([caregiverId])\n  @@index([visitId])\n  @@index([createdAt])\n}\n\nenum CommunicationType {\n  visit_update\n  schedule_change\n  medication_reminder\n  care_plan_update\n  general_inquiry\n  emergency_notification\n  documentation_shared\n  feedback\n  other\n}\n\n// Supply Tracking\nmodel SupplyOrder {\n  id        String @id @default(uuid())\n  patientId String\n  orderedBy String\n\n  items     Json // Array of supply items\n  totalCost Float?\n\n  status           SupplyOrderStatus @default(pending)\n  orderedAt        DateTime          @default(now())\n  expectedDelivery DateTime?\n  deliveredAt      DateTime?\n  deliveryNotes    String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([status])\n  @@index([orderedAt])\n}\n\nenum SupplyOrderStatus {\n  pending\n  ordered\n  shipped\n  delivered\n  cancelled\n  back_ordered\n}\n",
  "inlineSchemaHash": "e9bcc650d83c6c782241a5da855641ffabcb64180a21919f08703a7e8649c965",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "src/generated/client",
    "generated/client",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"Caregiver\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"firstName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"licenseNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"licenseType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LicenseType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"licenseExpiry\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"certifications\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"specialties\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"languages\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"CaregiverStatus\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hourlyRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxDailyVisits\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":8,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxWeeklyHours\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":40,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentLatitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentLongitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastLocationUpdate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"homeLatitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"homeLongitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"homeAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceRadius\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":25,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visits\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HomeVisit\",\"relationName\":\"CaregiverToHomeVisit\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"schedules\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CaregiverSchedule\",\"relationName\":\"CaregiverToCaregiverSchedule\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timeEntries\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TimeEntry\",\"relationName\":\"CaregiverToTimeEntry\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mileageEntries\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MileageEntry\",\"relationName\":\"CaregiverToMileageEntry\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CaregiverSchedule\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caregiverId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caregiver\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Caregiver\",\"relationName\":\"CaregiverToCaregiverSchedule\",\"relationFromFields\":[\"caregiverId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dayOfWeek\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAvailable\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"caregiverId\",\"dayOfWeek\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"caregiverId\",\"dayOfWeek\"]}],\"isGenerated\":false},\"PatientHome\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"addressLine2\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"city\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"zipCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"USA\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"latitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"longitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accessInstructions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gateCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parkingInfo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"petInfo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergencyContact\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergencyPhone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"homeType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"HomeType\",\"default\":\"single_family\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hasStairs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wheelchairAccessible\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"oxygenInHome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"safetyHazards\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"specialEquipment\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visits\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HomeVisit\",\"relationName\":\"HomeVisitToPatientHome\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assessments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HomeAssessment\",\"relationName\":\"HomeAssessmentToPatientHome\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"equipment\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PatientEquipment\",\"relationName\":\"PatientEquipmentToPatientHome\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"HomeVisit\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientHomeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientHome\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PatientHome\",\"relationName\":\"HomeVisitToPatientHome\",\"relationFromFields\":[\"patientHomeId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caregiverId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caregiver\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Caregiver\",\"relationName\":\"CaregiverToHomeVisit\",\"relationFromFields\":[\"caregiverId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scheduledDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scheduledStartTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scheduledEndTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimatedDuration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"VisitPriority\",\"default\":\"routine\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visitType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VisitType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"VisitStatus\",\"default\":\"scheduled\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualStartTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualEndTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualDuration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startLatitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startLongitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endLatitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endLongitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reasonForVisit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clinicalNotes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientCondition\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"followUpRequired\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"followUpNotes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caregiverSignature\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientSignature\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"signedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VisitTask\",\"relationName\":\"HomeVisitToVisitTask\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evvRecords\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EVVRecord\",\"relationName\":\"EVVRecordToHomeVisit\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MedicationAdministration\",\"relationName\":\"HomeVisitToMedicationAdministration\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"incidents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Incident\",\"relationName\":\"HomeVisitToIncident\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentation\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VisitDocumentation\",\"relationName\":\"HomeVisitToVisitDocumentation\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"VisitTask\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visitId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visit\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HomeVisit\",\"relationName\":\"HomeVisitToVisitTask\",\"relationFromFields\":[\"visitId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taskType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CareTaskType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isRequired\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sequence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TaskCompletionStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vitalType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vitalValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vitalUnit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"EVVRecord\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visitId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visit\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HomeVisit\",\"relationName\":\"EVVRecordToHomeVisit\",\"relationFromFields\":[\"visitId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recordType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EVVRecordType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"latitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"longitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accuracy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deviceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deviceType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isVerified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verificationMethod\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EVVVerificationMethod\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verificationNotes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"distanceFromHome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isWithinGeofence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"geofenceRadius\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":100,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TimeEntry\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caregiverId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caregiver\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Caregiver\",\"relationName\":\"CaregiverToTimeEntry\",\"relationFromFields\":[\"caregiverId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visitId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entryType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TimeEntryType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startLatitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startLongitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endLatitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endLongitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ApprovalStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approvedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approvedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"MileageEntry\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caregiverId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caregiver\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Caregiver\",\"relationName\":\"CaregiverToMileageEntry\",\"relationFromFields\":[\"caregiverId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"distance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purpose\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startLatitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startLongitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endLatitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endLongitude\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"routeData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ratePerMile\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0.67,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ApprovalStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approvedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approvedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"HomeAssessment\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientHomeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientHome\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PatientHome\",\"relationName\":\"HomeAssessmentToPatientHome\",\"relationFromFields\":[\"patientHomeId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assessorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assessmentDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"safetyScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fallRisk\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"RiskLevel\",\"default\":\"low\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fireRisk\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"RiskLevel\",\"default\":\"low\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"infectionRisk\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"RiskLevel\",\"default\":\"low\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cleanlinessScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"adequateLighting\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"adequateVentilation\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workingUtilities\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bathroomAccessible\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bedroomAccessible\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"kitchenAccessible\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recommendations\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiredEquipment\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"followUpDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"MedicationAdministration\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visitId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visit\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HomeVisit\",\"relationName\":\"HomeVisitToMedicationAdministration\",\"relationFromFields\":[\"visitId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medicationName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dosage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"route\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MedicationRoute\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scheduledTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"administeredTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"MedicationStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"refusedReason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"administeredBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"witnessedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medicationBarcode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientBarcode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Incident\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visitId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visit\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HomeVisit\",\"relationName\":\"HomeVisitToIncident\",\"relationFromFields\":[\"visitId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caregiverId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"incidentType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"IncidentType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"severity\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"IncidentSeverity\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"occurredAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"location\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"immediateAction\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"witnessNames\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fallType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FallType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"injuryOccurred\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"injuryDescription\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"medicalAttentionRequired\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emergencyServicesNotified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"IncidentStatus\",\"default\":\"reported\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"investigatedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"investigatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rootCause\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"preventiveMeasures\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"familyNotified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"physicianNotified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supervisorNotified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"VisitDocumentation\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visitId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visit\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HomeVisit\",\"relationName\":\"HomeVisitToVisitDocumentation\",\"relationFromFields\":[\"visitId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DocumentType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileSize\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assessmentData\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PatientEquipment\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientHomeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientHome\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PatientHome\",\"relationName\":\"PatientEquipmentToPatientHome\",\"relationFromFields\":[\"patientHomeId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"equipmentType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EquipmentType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serialNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"manufacturer\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"model\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EquipmentStatus\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"condition\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EquipmentCondition\",\"default\":\"good\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveredDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expectedReturnDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"returnedDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastMaintenanceDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nextMaintenanceDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maintenanceNotes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownershipType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"OwnershipType\",\"default\":\"rental\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rentalCompany\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"monthlyRentalCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FamilyCommunication\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"familyMemberId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caregiverId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"communicationType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CommunicationType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subject\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visitId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isRead\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"readAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parentMessageId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SupplyOrder\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"items\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"SupplyOrderStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expectedDelivery\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveredAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveryNotes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"LicenseType\":{\"values\":[{\"name\":\"RN\",\"dbName\":null},{\"name\":\"LPN\",\"dbName\":null},{\"name\":\"LVN\",\"dbName\":null},{\"name\":\"CNA\",\"dbName\":null},{\"name\":\"HHA\",\"dbName\":null},{\"name\":\"PT\",\"dbName\":null},{\"name\":\"OT\",\"dbName\":null},{\"name\":\"ST\",\"dbName\":null},{\"name\":\"MSW\",\"dbName\":null},{\"name\":\"OTHER\",\"dbName\":null}],\"dbName\":null},\"CaregiverStatus\":{\"values\":[{\"name\":\"active\",\"dbName\":null},{\"name\":\"inactive\",\"dbName\":null},{\"name\":\"on_leave\",\"dbName\":null},{\"name\":\"terminated\",\"dbName\":null}],\"dbName\":null},\"HomeType\":{\"values\":[{\"name\":\"single_family\",\"dbName\":null},{\"name\":\"apartment\",\"dbName\":null},{\"name\":\"condo\",\"dbName\":null},{\"name\":\"townhouse\",\"dbName\":null},{\"name\":\"assisted_living\",\"dbName\":null},{\"name\":\"nursing_facility\",\"dbName\":null},{\"name\":\"group_home\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"VisitType\":{\"values\":[{\"name\":\"skilled_nursing\",\"dbName\":null},{\"name\":\"physical_therapy\",\"dbName\":null},{\"name\":\"occupational_therapy\",\"dbName\":null},{\"name\":\"speech_therapy\",\"dbName\":null},{\"name\":\"home_health_aide\",\"dbName\":null},{\"name\":\"medical_social_services\",\"dbName\":null},{\"name\":\"wound_care\",\"dbName\":null},{\"name\":\"medication_management\",\"dbName\":null},{\"name\":\"post_surgical\",\"dbName\":null},{\"name\":\"chronic_care\",\"dbName\":null},{\"name\":\"palliative\",\"dbName\":null},{\"name\":\"hospice\",\"dbName\":null},{\"name\":\"pediatric\",\"dbName\":null},{\"name\":\"assessment\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"VisitPriority\":{\"values\":[{\"name\":\"routine\",\"dbName\":null},{\"name\":\"urgent\",\"dbName\":null},{\"name\":\"emergency\",\"dbName\":null},{\"name\":\"prn\",\"dbName\":null}],\"dbName\":null},\"VisitStatus\":{\"values\":[{\"name\":\"scheduled\",\"dbName\":null},{\"name\":\"confirmed\",\"dbName\":null},{\"name\":\"en_route\",\"dbName\":null},{\"name\":\"arrived\",\"dbName\":null},{\"name\":\"in_progress\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null},{\"name\":\"no_show\",\"dbName\":null},{\"name\":\"rescheduled\",\"dbName\":null}],\"dbName\":null},\"CareTaskType\":{\"values\":[{\"name\":\"vital_signs\",\"dbName\":null},{\"name\":\"medication\",\"dbName\":null},{\"name\":\"wound_care\",\"dbName\":null},{\"name\":\"personal_care\",\"dbName\":null},{\"name\":\"mobility\",\"dbName\":null},{\"name\":\"nutrition\",\"dbName\":null},{\"name\":\"hydration\",\"dbName\":null},{\"name\":\"exercise\",\"dbName\":null},{\"name\":\"education\",\"dbName\":null},{\"name\":\"assessment\",\"dbName\":null},{\"name\":\"documentation\",\"dbName\":null},{\"name\":\"equipment_check\",\"dbName\":null},{\"name\":\"safety_check\",\"dbName\":null},{\"name\":\"communication\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"TaskCompletionStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"skipped\",\"dbName\":null},{\"name\":\"unable_to_complete\",\"dbName\":null},{\"name\":\"deferred\",\"dbName\":null}],\"dbName\":null},\"EVVRecordType\":{\"values\":[{\"name\":\"clock_in\",\"dbName\":null},{\"name\":\"clock_out\",\"dbName\":null},{\"name\":\"location_update\",\"dbName\":null},{\"name\":\"task_completion\",\"dbName\":null},{\"name\":\"signature_capture\",\"dbName\":null}],\"dbName\":null},\"EVVVerificationMethod\":{\"values\":[{\"name\":\"gps\",\"dbName\":null},{\"name\":\"telephony\",\"dbName\":null},{\"name\":\"biometric\",\"dbName\":null},{\"name\":\"fixed_device\",\"dbName\":null},{\"name\":\"manual_override\",\"dbName\":null}],\"dbName\":null},\"TimeEntryType\":{\"values\":[{\"name\":\"visit\",\"dbName\":null},{\"name\":\"travel\",\"dbName\":null},{\"name\":\"training\",\"dbName\":null},{\"name\":\"administrative\",\"dbName\":null},{\"name\":\"on_call\",\"dbName\":null},{\"name\":\"overtime\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"ApprovalStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"approved\",\"dbName\":null},{\"name\":\"rejected\",\"dbName\":null},{\"name\":\"disputed\",\"dbName\":null}],\"dbName\":null},\"RiskLevel\":{\"values\":[{\"name\":\"low\",\"dbName\":null},{\"name\":\"moderate\",\"dbName\":null},{\"name\":\"high\",\"dbName\":null},{\"name\":\"critical\",\"dbName\":null}],\"dbName\":null},\"MedicationRoute\":{\"values\":[{\"name\":\"oral\",\"dbName\":null},{\"name\":\"sublingual\",\"dbName\":null},{\"name\":\"topical\",\"dbName\":null},{\"name\":\"inhaled\",\"dbName\":null},{\"name\":\"subcutaneous\",\"dbName\":null},{\"name\":\"intramuscular\",\"dbName\":null},{\"name\":\"intravenous\",\"dbName\":null},{\"name\":\"rectal\",\"dbName\":null},{\"name\":\"ophthalmic\",\"dbName\":null},{\"name\":\"otic\",\"dbName\":null},{\"name\":\"nasal\",\"dbName\":null},{\"name\":\"transdermal\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"MedicationStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"administered\",\"dbName\":null},{\"name\":\"refused\",\"dbName\":null},{\"name\":\"held\",\"dbName\":null},{\"name\":\"not_available\",\"dbName\":null},{\"name\":\"self_administered\",\"dbName\":null}],\"dbName\":null},\"IncidentType\":{\"values\":[{\"name\":\"fall\",\"dbName\":null},{\"name\":\"medication_error\",\"dbName\":null},{\"name\":\"skin_injury\",\"dbName\":null},{\"name\":\"equipment_malfunction\",\"dbName\":null},{\"name\":\"behavioral\",\"dbName\":null},{\"name\":\"environmental\",\"dbName\":null},{\"name\":\"security\",\"dbName\":null},{\"name\":\"missing_patient\",\"dbName\":null},{\"name\":\"abuse_neglect\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"IncidentSeverity\":{\"values\":[{\"name\":\"minor\",\"dbName\":null},{\"name\":\"moderate\",\"dbName\":null},{\"name\":\"major\",\"dbName\":null},{\"name\":\"critical\",\"dbName\":null}],\"dbName\":null},\"FallType\":{\"values\":[{\"name\":\"witnessed\",\"dbName\":null},{\"name\":\"unwitnessed\",\"dbName\":null},{\"name\":\"near_miss\",\"dbName\":null},{\"name\":\"assisted_to_floor\",\"dbName\":null}],\"dbName\":null},\"IncidentStatus\":{\"values\":[{\"name\":\"reported\",\"dbName\":null},{\"name\":\"under_investigation\",\"dbName\":null},{\"name\":\"investigated\",\"dbName\":null},{\"name\":\"closed\",\"dbName\":null},{\"name\":\"requires_action\",\"dbName\":null}],\"dbName\":null},\"DocumentType\":{\"values\":[{\"name\":\"progress_note\",\"dbName\":null},{\"name\":\"assessment\",\"dbName\":null},{\"name\":\"care_plan\",\"dbName\":null},{\"name\":\"physician_order\",\"dbName\":null},{\"name\":\"consent_form\",\"dbName\":null},{\"name\":\"discharge_summary\",\"dbName\":null},{\"name\":\"wound_photo\",\"dbName\":null},{\"name\":\"vital_signs_log\",\"dbName\":null},{\"name\":\"medication_list\",\"dbName\":null},{\"name\":\"family_communication\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"EquipmentType\":{\"values\":[{\"name\":\"hospital_bed\",\"dbName\":null},{\"name\":\"wheelchair\",\"dbName\":null},{\"name\":\"walker\",\"dbName\":null},{\"name\":\"cane\",\"dbName\":null},{\"name\":\"oxygen_concentrator\",\"dbName\":null},{\"name\":\"oxygen_tank\",\"dbName\":null},{\"name\":\"nebulizer\",\"dbName\":null},{\"name\":\"suction_machine\",\"dbName\":null},{\"name\":\"feeding_pump\",\"dbName\":null},{\"name\":\"iv_pump\",\"dbName\":null},{\"name\":\"cpap\",\"dbName\":null},{\"name\":\"bipap\",\"dbName\":null},{\"name\":\"lift\",\"dbName\":null},{\"name\":\"commode\",\"dbName\":null},{\"name\":\"shower_chair\",\"dbName\":null},{\"name\":\"blood_pressure_monitor\",\"dbName\":null},{\"name\":\"glucose_monitor\",\"dbName\":null},{\"name\":\"pulse_oximeter\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"EquipmentStatus\":{\"values\":[{\"name\":\"active\",\"dbName\":null},{\"name\":\"returned\",\"dbName\":null},{\"name\":\"lost\",\"dbName\":null},{\"name\":\"damaged\",\"dbName\":null},{\"name\":\"maintenance\",\"dbName\":null}],\"dbName\":null},\"EquipmentCondition\":{\"values\":[{\"name\":\"excellent\",\"dbName\":null},{\"name\":\"good\",\"dbName\":null},{\"name\":\"fair\",\"dbName\":null},{\"name\":\"poor\",\"dbName\":null}],\"dbName\":null},\"OwnershipType\":{\"values\":[{\"name\":\"rental\",\"dbName\":null},{\"name\":\"purchase\",\"dbName\":null},{\"name\":\"loan\",\"dbName\":null},{\"name\":\"insurance_provided\",\"dbName\":null}],\"dbName\":null},\"CommunicationType\":{\"values\":[{\"name\":\"visit_update\",\"dbName\":null},{\"name\":\"schedule_change\",\"dbName\":null},{\"name\":\"medication_reminder\",\"dbName\":null},{\"name\":\"care_plan_update\",\"dbName\":null},{\"name\":\"general_inquiry\",\"dbName\":null},{\"name\":\"emergency_notification\",\"dbName\":null},{\"name\":\"documentation_shared\",\"dbName\":null},{\"name\":\"feedback\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"SupplyOrderStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"ordered\",\"dbName\":null},{\"name\":\"shipped\",\"dbName\":null},{\"name\":\"delivered\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null},{\"name\":\"back_ordered\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "src/generated/client/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "src/generated/client/schema.prisma")
