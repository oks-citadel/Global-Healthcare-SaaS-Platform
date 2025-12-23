
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
