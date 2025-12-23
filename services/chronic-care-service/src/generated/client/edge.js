
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

exports.Prisma.CarePlanScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  providerId: 'providerId',
  condition: 'condition',
  status: 'status',
  startDate: 'startDate',
  endDate: 'endDate',
  goals: 'goals',
  interventions: 'interventions',
  reviewSchedule: 'reviewSchedule',
  nextReviewDate: 'nextReviewDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CareTaskScalarFieldEnum = {
  id: 'id',
  carePlanId: 'carePlanId',
  title: 'title',
  description: 'description',
  taskType: 'taskType',
  frequency: 'frequency',
  dueDate: 'dueDate',
  completedAt: 'completedAt',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MonitoringDeviceScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  deviceType: 'deviceType',
  manufacturer: 'manufacturer',
  model: 'model',
  serialNumber: 'serialNumber',
  status: 'status',
  lastSyncAt: 'lastSyncAt',
  batteryLevel: 'batteryLevel',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VitalReadingScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  carePlanId: 'carePlanId',
  deviceId: 'deviceId',
  vitalType: 'vitalType',
  value: 'value',
  unit: 'unit',
  isAbnormal: 'isAbnormal',
  notes: 'notes',
  recordedAt: 'recordedAt',
  createdAt: 'createdAt'
};

exports.Prisma.AlertScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  carePlanId: 'carePlanId',
  alertType: 'alertType',
  severity: 'severity',
  title: 'title',
  description: 'description',
  status: 'status',
  acknowledgedBy: 'acknowledgedBy',
  acknowledgedAt: 'acknowledgedAt',
  resolvedAt: 'resolvedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GoalScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  carePlanId: 'carePlanId',
  title: 'title',
  description: 'description',
  goalType: 'goalType',
  targetValue: 'targetValue',
  targetUnit: 'targetUnit',
  targetDate: 'targetDate',
  frequency: 'frequency',
  status: 'status',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GoalProgressScalarFieldEnum = {
  id: 'id',
  goalId: 'goalId',
  value: 'value',
  currentValue: 'currentValue',
  currentUnit: 'currentUnit',
  notes: 'notes',
  recordedAt: 'recordedAt',
  createdAt: 'createdAt'
};

exports.Prisma.AlertThresholdScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  carePlanId: 'carePlanId',
  vitalType: 'vitalType',
  condition: 'condition',
  minValue: 'minValue',
  maxValue: 'maxValue',
  criticalMin: 'criticalMin',
  criticalMax: 'criticalMax',
  warningMin: 'warningMin',
  warningMax: 'warningMax',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CarePlanTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  condition: 'condition',
  goals: 'goals',
  interventions: 'interventions',
  tasks: 'tasks',
  reviewSchedule: 'reviewSchedule',
  thresholds: 'thresholds',
  version: 'version',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PatientEngagementScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  carePlanId: 'carePlanId',
  engagementType: 'engagementType',
  activityType: 'activityType',
  description: 'description',
  metadata: 'metadata',
  recordedAt: 'recordedAt',
  createdAt: 'createdAt'
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

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.PlanStatus = exports.$Enums.PlanStatus = {
  active: 'active',
  completed: 'completed',
  suspended: 'suspended',
  cancelled: 'cancelled'
};

exports.TaskType = exports.$Enums.TaskType = {
  medication: 'medication',
  measurement: 'measurement',
  exercise: 'exercise',
  diet: 'diet',
  appointment: 'appointment',
  other: 'other'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  pending: 'pending',
  completed: 'completed',
  missed: 'missed',
  cancelled: 'cancelled'
};

exports.DeviceType = exports.$Enums.DeviceType = {
  blood_pressure_monitor: 'blood_pressure_monitor',
  glucose_meter: 'glucose_meter',
  pulse_oximeter: 'pulse_oximeter',
  weight_scale: 'weight_scale',
  thermometer: 'thermometer',
  heart_rate_monitor: 'heart_rate_monitor',
  peak_flow_meter: 'peak_flow_meter',
  ecg_monitor: 'ecg_monitor'
};

exports.DeviceStatus = exports.$Enums.DeviceStatus = {
  active: 'active',
  inactive: 'inactive',
  maintenance: 'maintenance',
  decommissioned: 'decommissioned'
};

exports.VitalType = exports.$Enums.VitalType = {
  blood_pressure_systolic: 'blood_pressure_systolic',
  blood_pressure_diastolic: 'blood_pressure_diastolic',
  heart_rate: 'heart_rate',
  blood_glucose: 'blood_glucose',
  oxygen_saturation: 'oxygen_saturation',
  temperature: 'temperature',
  weight: 'weight',
  respiratory_rate: 'respiratory_rate',
  peak_flow: 'peak_flow'
};

exports.AlertType = exports.$Enums.AlertType = {
  vital_out_of_range: 'vital_out_of_range',
  missed_medication: 'missed_medication',
  missed_measurement: 'missed_measurement',
  device_offline: 'device_offline',
  no_activity: 'no_activity',
  threshold_exceeded: 'threshold_exceeded'
};

exports.AlertSeverity = exports.$Enums.AlertSeverity = {
  info: 'info',
  warning: 'warning',
  critical: 'critical'
};

exports.AlertStatus = exports.$Enums.AlertStatus = {
  new: 'new',
  acknowledged: 'acknowledged',
  resolved: 'resolved',
  dismissed: 'dismissed'
};

exports.GoalType = exports.$Enums.GoalType = {
  vital_sign: 'vital_sign',
  activity: 'activity',
  lifestyle: 'lifestyle',
  clinical_outcome: 'clinical_outcome',
  weight_loss: 'weight_loss',
  blood_pressure: 'blood_pressure',
  blood_glucose: 'blood_glucose',
  exercise: 'exercise',
  medication_adherence: 'medication_adherence',
  diet: 'diet',
  sleep: 'sleep',
  stress_management: 'stress_management',
  other: 'other'
};

exports.GoalStatus = exports.$Enums.GoalStatus = {
  achieved: 'achieved',
  active: 'active',
  completed: 'completed',
  paused: 'paused',
  cancelled: 'cancelled'
};

exports.EngagementType = exports.$Enums.EngagementType = {
  device_sync: 'device_sync',
  vital_reading: 'vital_reading',
  goal_progress: 'goal_progress',
  medication_taken: 'medication_taken',
  appointment_kept: 'appointment_kept',
  task_completed: 'task_completed',
  education_viewed: 'education_viewed',
  message_sent: 'message_sent',
  other: 'other'
};

exports.Prisma.ModelName = {
  CarePlan: 'CarePlan',
  CareTask: 'CareTask',
  MonitoringDevice: 'MonitoringDevice',
  VitalReading: 'VitalReading',
  Alert: 'Alert',
  Goal: 'Goal',
  GoalProgress: 'GoalProgress',
  AlertThreshold: 'AlertThreshold',
  CarePlanTemplate: 'CarePlanTemplate',
  PatientEngagement: 'PatientEngagement'
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
      "value": "C:\\Users\\kogun\\OneDrive\\Documents\\Global Healthcare\\Global-Healthcare-SaaS-Platform\\services\\chronic-care-service\\src\\generated\\client",
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
    "sourceFilePath": "C:\\Users\\kogun\\OneDrive\\Documents\\Global Healthcare\\Global-Healthcare-SaaS-Platform\\services\\chronic-care-service\\prisma\\schema.prisma",
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
  "inlineSchema": "generator client {\n  output   = \"./../src/generated/client\"\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// ==========================================\n// Chronic Care Domain\n// ==========================================\n\nmodel CarePlan {\n  id             String     @id @default(uuid())\n  patientId      String\n  providerId     String\n  condition      String\n  status         PlanStatus @default(active)\n  startDate      DateTime   @default(now())\n  endDate        DateTime?\n  goals          Json\n  interventions  Json\n  reviewSchedule String?\n  nextReviewDate DateTime?\n\n  // Relations\n  tasks  CareTask[]\n  vitals VitalReading[]\n  alerts Alert[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([providerId])\n  @@index([status])\n  @@index([nextReviewDate])\n}\n\nenum PlanStatus {\n  active\n  completed\n  suspended\n  cancelled\n}\n\nmodel CareTask {\n  id          String     @id @default(uuid())\n  carePlanId  String\n  carePlan    CarePlan   @relation(fields: [carePlanId], references: [id], onDelete: Cascade)\n  title       String\n  description String?\n  taskType    TaskType\n  frequency   String\n  dueDate     DateTime?\n  completedAt DateTime?\n  status      TaskStatus @default(pending)\n  notes       String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([carePlanId])\n  @@index([status])\n  @@index([dueDate])\n}\n\nenum TaskType {\n  medication\n  measurement\n  exercise\n  diet\n  appointment\n  other\n}\n\nenum TaskStatus {\n  pending\n  completed\n  missed\n  cancelled\n}\n\nmodel MonitoringDevice {\n  id           String       @id @default(uuid())\n  patientId    String\n  deviceType   DeviceType\n  manufacturer String?\n  model        String?\n  serialNumber String       @unique\n  status       DeviceStatus @default(active)\n  lastSyncAt   DateTime?\n  batteryLevel Int?\n\n  readings VitalReading[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([deviceType])\n  @@index([status])\n  @@index([serialNumber])\n}\n\nenum DeviceType {\n  blood_pressure_monitor\n  glucose_meter\n  pulse_oximeter\n  weight_scale\n  thermometer\n  heart_rate_monitor\n  peak_flow_meter\n  ecg_monitor\n}\n\nenum DeviceStatus {\n  active\n  inactive\n  maintenance\n  decommissioned\n}\n\nmodel VitalReading {\n  id         String            @id @default(uuid())\n  patientId  String\n  carePlanId String?\n  carePlan   CarePlan?         @relation(fields: [carePlanId], references: [id], onDelete: SetNull)\n  deviceId   String?\n  device     MonitoringDevice? @relation(fields: [deviceId], references: [id], onDelete: SetNull)\n  vitalType  VitalType\n  value      Float\n  unit       String\n  isAbnormal Boolean           @default(false)\n  notes      String?\n  recordedAt DateTime          @default(now())\n\n  createdAt DateTime @default(now())\n\n  @@index([patientId])\n  @@index([carePlanId])\n  @@index([deviceId])\n  @@index([vitalType])\n  @@index([recordedAt])\n  @@index([patientId, recordedAt])\n}\n\nenum VitalType {\n  blood_pressure_systolic\n  blood_pressure_diastolic\n  heart_rate\n  blood_glucose\n  oxygen_saturation\n  temperature\n  weight\n  respiratory_rate\n  peak_flow\n}\n\nmodel Alert {\n  id             String        @id @default(uuid())\n  patientId      String\n  carePlanId     String?\n  carePlan       CarePlan?     @relation(fields: [carePlanId], references: [id], onDelete: SetNull)\n  alertType      AlertType\n  severity       AlertSeverity\n  title          String\n  description    String\n  status         AlertStatus   @default(new)\n  acknowledgedBy String?\n  acknowledgedAt DateTime?\n  resolvedAt     DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([carePlanId])\n  @@index([status])\n  @@index([severity])\n  @@index([createdAt])\n}\n\nenum AlertType {\n  vital_out_of_range\n  missed_medication\n  missed_measurement\n  device_offline\n  no_activity\n  threshold_exceeded\n}\n\nenum AlertSeverity {\n  info\n  warning\n  critical\n}\n\nenum AlertStatus {\n  new\n  acknowledged\n  resolved\n  dismissed\n}\n\nmodel Goal {\n  id          String     @id @default(uuid())\n  patientId   String\n  carePlanId  String?\n  title       String\n  description String?\n  goalType    GoalType\n  targetValue Float?\n  targetUnit  String?\n  targetDate  DateTime?\n  frequency   String?\n  status      GoalStatus @default(active)\n  completedAt DateTime?\n\n  progress GoalProgress[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([carePlanId])\n  @@index([status])\n  @@index([goalType])\n}\n\nmodel GoalProgress {\n  id           String   @id @default(uuid())\n  goalId       String\n  goal         Goal     @relation(fields: [goalId], references: [id], onDelete: Cascade)\n  value        Float\n  currentValue Float?\n  currentUnit  String?\n  notes        String?\n  recordedAt   DateTime @default(now())\n\n  createdAt DateTime @default(now())\n\n  @@index([goalId])\n  @@index([recordedAt])\n}\n\nenum GoalType {\n  vital_sign\n  activity\n  lifestyle\n  clinical_outcome\n  weight_loss\n  blood_pressure\n  blood_glucose\n  exercise\n  medication_adherence\n  diet\n  sleep\n  stress_management\n  other\n}\n\nenum GoalStatus {\n  achieved\n  active\n  completed\n  paused\n  cancelled\n}\n\nmodel AlertThreshold {\n  id          String    @id @default(uuid())\n  patientId   String\n  carePlanId  String?\n  vitalType   VitalType\n  condition   String?\n  minValue    Float?\n  maxValue    Float?\n  criticalMin Float?\n  criticalMax Float?\n  warningMin  Float?\n  warningMax  Float?\n  isActive    Boolean   @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([patientId])\n  @@index([vitalType])\n  @@index([isActive])\n}\n\nmodel CarePlanTemplate {\n  id             String  @id @default(uuid())\n  name           String\n  description    String?\n  condition      String\n  goals          Json\n  interventions  Json\n  tasks          Json?\n  reviewSchedule String?\n  thresholds     Json?\n  version        Int     @default(1)\n  isActive       Boolean @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([condition])\n  @@index([isActive])\n}\n\nmodel PatientEngagement {\n  id             String         @id @default(uuid())\n  patientId      String\n  carePlanId     String?\n  engagementType EngagementType\n  activityType   String\n  description    String?\n  metadata       Json?\n  recordedAt     DateTime       @default(now())\n\n  createdAt DateTime @default(now())\n\n  @@index([patientId])\n  @@index([carePlanId])\n  @@index([engagementType])\n  @@index([recordedAt])\n}\n\nenum EngagementType {\n  device_sync\n  vital_reading\n  goal_progress\n  medication_taken\n  appointment_kept\n  task_completed\n  education_viewed\n  message_sent\n  other\n}\n",
  "inlineSchemaHash": "0986992d68a41848611b93687b40a8fbe912ddb0995c43cfce8a1c0a884173ba",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"CarePlan\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"condition\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PlanStatus\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"goals\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"interventions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewSchedule\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nextReviewDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CareTask\",\"relationName\":\"CarePlanToCareTask\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vitals\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VitalReading\",\"relationName\":\"CarePlanToVitalReading\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"alerts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Alert\",\"relationName\":\"AlertToCarePlan\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CareTask\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carePlanId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carePlan\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CarePlan\",\"relationName\":\"CarePlanToCareTask\",\"relationFromFields\":[\"carePlanId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taskType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TaskType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"frequency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TaskStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"MonitoringDevice\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deviceType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DeviceType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"manufacturer\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"model\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serialNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DeviceStatus\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastSyncAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"batteryLevel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"readings\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VitalReading\",\"relationName\":\"MonitoringDeviceToVitalReading\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"VitalReading\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carePlanId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carePlan\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CarePlan\",\"relationName\":\"CarePlanToVitalReading\",\"relationFromFields\":[\"carePlanId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deviceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"device\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MonitoringDevice\",\"relationName\":\"MonitoringDeviceToVitalReading\",\"relationFromFields\":[\"deviceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vitalType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VitalType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"unit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAbnormal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recordedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Alert\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carePlanId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carePlan\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CarePlan\",\"relationName\":\"AlertToCarePlan\",\"relationFromFields\":[\"carePlanId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"alertType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AlertType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"severity\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AlertSeverity\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AlertStatus\",\"default\":\"new\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"acknowledgedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"acknowledgedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolvedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Goal\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carePlanId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"goalType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GoalType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetUnit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"frequency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"GoalStatus\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"progress\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GoalProgress\",\"relationName\":\"GoalToGoalProgress\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"GoalProgress\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"goalId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"goal\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Goal\",\"relationName\":\"GoalToGoalProgress\",\"relationFromFields\":[\"goalId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentUnit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recordedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AlertThreshold\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carePlanId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vitalType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VitalType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"condition\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"minValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criticalMin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criticalMax\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"warningMin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"warningMax\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CarePlanTemplate\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"condition\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"goals\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"interventions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tasks\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewSchedule\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"thresholds\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"version\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PatientEngagement\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carePlanId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"engagementType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EngagementType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activityType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recordedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"PlanStatus\":{\"values\":[{\"name\":\"active\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"suspended\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null}],\"dbName\":null},\"TaskType\":{\"values\":[{\"name\":\"medication\",\"dbName\":null},{\"name\":\"measurement\",\"dbName\":null},{\"name\":\"exercise\",\"dbName\":null},{\"name\":\"diet\",\"dbName\":null},{\"name\":\"appointment\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"TaskStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"missed\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null}],\"dbName\":null},\"DeviceType\":{\"values\":[{\"name\":\"blood_pressure_monitor\",\"dbName\":null},{\"name\":\"glucose_meter\",\"dbName\":null},{\"name\":\"pulse_oximeter\",\"dbName\":null},{\"name\":\"weight_scale\",\"dbName\":null},{\"name\":\"thermometer\",\"dbName\":null},{\"name\":\"heart_rate_monitor\",\"dbName\":null},{\"name\":\"peak_flow_meter\",\"dbName\":null},{\"name\":\"ecg_monitor\",\"dbName\":null}],\"dbName\":null},\"DeviceStatus\":{\"values\":[{\"name\":\"active\",\"dbName\":null},{\"name\":\"inactive\",\"dbName\":null},{\"name\":\"maintenance\",\"dbName\":null},{\"name\":\"decommissioned\",\"dbName\":null}],\"dbName\":null},\"VitalType\":{\"values\":[{\"name\":\"blood_pressure_systolic\",\"dbName\":null},{\"name\":\"blood_pressure_diastolic\",\"dbName\":null},{\"name\":\"heart_rate\",\"dbName\":null},{\"name\":\"blood_glucose\",\"dbName\":null},{\"name\":\"oxygen_saturation\",\"dbName\":null},{\"name\":\"temperature\",\"dbName\":null},{\"name\":\"weight\",\"dbName\":null},{\"name\":\"respiratory_rate\",\"dbName\":null},{\"name\":\"peak_flow\",\"dbName\":null}],\"dbName\":null},\"AlertType\":{\"values\":[{\"name\":\"vital_out_of_range\",\"dbName\":null},{\"name\":\"missed_medication\",\"dbName\":null},{\"name\":\"missed_measurement\",\"dbName\":null},{\"name\":\"device_offline\",\"dbName\":null},{\"name\":\"no_activity\",\"dbName\":null},{\"name\":\"threshold_exceeded\",\"dbName\":null}],\"dbName\":null},\"AlertSeverity\":{\"values\":[{\"name\":\"info\",\"dbName\":null},{\"name\":\"warning\",\"dbName\":null},{\"name\":\"critical\",\"dbName\":null}],\"dbName\":null},\"AlertStatus\":{\"values\":[{\"name\":\"new\",\"dbName\":null},{\"name\":\"acknowledged\",\"dbName\":null},{\"name\":\"resolved\",\"dbName\":null},{\"name\":\"dismissed\",\"dbName\":null}],\"dbName\":null},\"GoalType\":{\"values\":[{\"name\":\"vital_sign\",\"dbName\":null},{\"name\":\"activity\",\"dbName\":null},{\"name\":\"lifestyle\",\"dbName\":null},{\"name\":\"clinical_outcome\",\"dbName\":null},{\"name\":\"weight_loss\",\"dbName\":null},{\"name\":\"blood_pressure\",\"dbName\":null},{\"name\":\"blood_glucose\",\"dbName\":null},{\"name\":\"exercise\",\"dbName\":null},{\"name\":\"medication_adherence\",\"dbName\":null},{\"name\":\"diet\",\"dbName\":null},{\"name\":\"sleep\",\"dbName\":null},{\"name\":\"stress_management\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"GoalStatus\":{\"values\":[{\"name\":\"achieved\",\"dbName\":null},{\"name\":\"active\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"paused\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null}],\"dbName\":null},\"EngagementType\":{\"values\":[{\"name\":\"device_sync\",\"dbName\":null},{\"name\":\"vital_reading\",\"dbName\":null},{\"name\":\"goal_progress\",\"dbName\":null},{\"name\":\"medication_taken\",\"dbName\":null},{\"name\":\"appointment_kept\",\"dbName\":null},{\"name\":\"task_completed\",\"dbName\":null},{\"name\":\"education_viewed\",\"dbName\":null},{\"name\":\"message_sent\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
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

