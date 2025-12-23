
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

exports.Prisma.ImagingOrderScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  providerId: 'providerId',
  facilityId: 'facilityId',
  orderNumber: 'orderNumber',
  priority: 'priority',
  modality: 'modality',
  bodyPart: 'bodyPart',
  clinicalIndication: 'clinicalIndication',
  instructions: 'instructions',
  urgency: 'urgency',
  transportRequired: 'transportRequired',
  contrastAllergy: 'contrastAllergy',
  contrastNotes: 'contrastNotes',
  status: 'status',
  scheduledAt: 'scheduledAt',
  requestedBy: 'requestedBy',
  requestedAt: 'requestedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StudyScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  accessionNumber: 'accessionNumber',
  studyInstanceUID: 'studyInstanceUID',
  studyDate: 'studyDate',
  studyTime: 'studyTime',
  studyDescription: 'studyDescription',
  modality: 'modality',
  bodyPart: 'bodyPart',
  numberOfSeries: 'numberOfSeries',
  numberOfInstances: 'numberOfInstances',
  patientId: 'patientId',
  patientName: 'patientName',
  patientDOB: 'patientDOB',
  patientSex: 'patientSex',
  performingPhysician: 'performingPhysician',
  operatorName: 'operatorName',
  institutionName: 'institutionName',
  stationName: 'stationName',
  status: 'status',
  priority: 'priority',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ImageScalarFieldEnum = {
  id: 'id',
  studyId: 'studyId',
  seriesInstanceUID: 'seriesInstanceUID',
  sopInstanceUID: 'sopInstanceUID',
  instanceNumber: 'instanceNumber',
  seriesNumber: 'seriesNumber',
  seriesDescription: 'seriesDescription',
  imageType: 'imageType',
  photometricInterpretation: 'photometricInterpretation',
  rows: 'rows',
  columns: 'columns',
  bitsAllocated: 'bitsAllocated',
  bitsStored: 'bitsStored',
  pixelSpacing: 'pixelSpacing',
  sliceThickness: 'sliceThickness',
  sliceLocation: 'sliceLocation',
  imagePosition: 'imagePosition',
  imageOrientation: 'imageOrientation',
  acquisitionDate: 'acquisitionDate',
  acquisitionTime: 'acquisitionTime',
  contentDate: 'contentDate',
  contentTime: 'contentTime',
  windowCenter: 'windowCenter',
  windowWidth: 'windowWidth',
  storageUrl: 'storageUrl',
  thumbnailUrl: 'thumbnailUrl',
  fileSize: 'fileSize',
  transferSyntaxUID: 'transferSyntaxUID',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RadiologyReportScalarFieldEnum = {
  id: 'id',
  studyId: 'studyId',
  reportNumber: 'reportNumber',
  radiologistId: 'radiologistId',
  radiologistName: 'radiologistName',
  status: 'status',
  clinicalHistory: 'clinicalHistory',
  technique: 'technique',
  comparison: 'comparison',
  findings: 'findings',
  impression: 'impression',
  recommendations: 'recommendations',
  preliminaryDate: 'preliminaryDate',
  finalizedDate: 'finalizedDate',
  amendedDate: 'amendedDate',
  amendmentReason: 'amendmentReason',
  signedBy: 'signedBy',
  signedAt: 'signedAt',
  transcribedBy: 'transcribedBy',
  transcribedAt: 'transcribedAt',
  template: 'template',
  macros: 'macros',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CriticalFindingScalarFieldEnum = {
  id: 'id',
  studyId: 'studyId',
  reportId: 'reportId',
  finding: 'finding',
  severity: 'severity',
  category: 'category',
  bodyPart: 'bodyPart',
  reportedBy: 'reportedBy',
  reportedAt: 'reportedAt',
  notifiedTo: 'notifiedTo',
  notificationSent: 'notificationSent',
  acknowledgedBy: 'acknowledgedBy',
  acknowledgedAt: 'acknowledgedAt',
  followUpRequired: 'followUpRequired',
  followUpAction: 'followUpAction',
  followUpStatus: 'followUpStatus',
  notes: 'notes',
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
exports.Priority = exports.$Enums.Priority = {
  STAT: 'STAT',
  URGENT: 'URGENT',
  ROUTINE: 'ROUTINE'
};

exports.Modality = exports.$Enums.Modality = {
  CR: 'CR',
  CT: 'CT',
  MR: 'MR',
  US: 'US',
  XA: 'XA',
  DX: 'DX',
  MG: 'MG',
  NM: 'NM',
  PT: 'PT',
  PET_CT: 'PET_CT',
  RF: 'RF',
  OT: 'OT'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ON_HOLD: 'ON_HOLD'
};

exports.StudyStatus = exports.$Enums.StudyStatus = {
  SCHEDULED: 'SCHEDULED',
  ARRIVED: 'ARRIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  PRELIMINARY: 'PRELIMINARY',
  FINAL: 'FINAL',
  CANCELLED: 'CANCELLED'
};

exports.ReportStatus = exports.$Enums.ReportStatus = {
  PRELIMINARY: 'PRELIMINARY',
  FINAL: 'FINAL',
  AMENDED: 'AMENDED',
  CORRECTED: 'CORRECTED'
};

exports.Severity = exports.$Enums.Severity = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MODERATE: 'MODERATE',
  LOW: 'LOW'
};

exports.Prisma.ModelName = {
  ImagingOrder: 'ImagingOrder',
  Study: 'Study',
  Image: 'Image',
  RadiologyReport: 'RadiologyReport',
  CriticalFinding: 'CriticalFinding'
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
