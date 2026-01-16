
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

exports.Prisma.PrescriptionScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  providerId: 'providerId',
  encounterId: 'encounterId',
  status: 'status',
  notes: 'notes',
  validFrom: 'validFrom',
  validUntil: 'validUntil',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PrescriptionItemScalarFieldEnum = {
  id: 'id',
  prescriptionId: 'prescriptionId',
  medicationName: 'medicationName',
  dosage: 'dosage',
  frequency: 'frequency',
  duration: 'duration',
  quantity: 'quantity',
  refillsAllowed: 'refillsAllowed',
  refillsUsed: 'refillsUsed',
  instructions: 'instructions',
  isGenericAllowed: 'isGenericAllowed',
  createdAt: 'createdAt'
};

exports.Prisma.PharmacyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  licenseNumber: 'licenseNumber',
  phone: 'phone',
  email: 'email',
  address: 'address',
  operatingHours: 'operatingHours',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MedicationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  genericName: 'genericName',
  brandNames: 'brandNames',
  strength: 'strength',
  dosageForm: 'dosageForm',
  manufacturer: 'manufacturer',
  ndcCode: 'ndcCode',
  description: 'description',
  sideEffects: 'sideEffects',
  interactions: 'interactions',
  isControlled: 'isControlled',
  schedule: 'schedule',
  requiresPriorAuth: 'requiresPriorAuth',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PriorAuthorizationScalarFieldEnum = {
  id: 'id',
  prescriptionId: 'prescriptionId',
  patientId: 'patientId',
  providerId: 'providerId',
  insurerId: 'insurerId',
  medicationName: 'medicationName',
  status: 'status',
  requestDate: 'requestDate',
  approvalDate: 'approvalDate',
  denialDate: 'denialDate',
  expirationDate: 'expirationDate',
  denialReason: 'denialReason',
  approvalCode: 'approvalCode',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DispensingScalarFieldEnum = {
  id: 'id',
  prescriptionId: 'prescriptionId',
  patientId: 'patientId',
  pharmacyId: 'pharmacyId',
  priorAuthorizationId: 'priorAuthorizationId',
  medicationName: 'medicationName',
  quantity: 'quantity',
  dispensedAt: 'dispensedAt',
  pharmacist: 'pharmacist',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.ControlledSubstanceLogScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  prescriberId: 'prescriberId',
  pharmacyId: 'pharmacyId',
  medicationName: 'medicationName',
  schedule: 'schedule',
  quantity: 'quantity',
  daysSupply: 'daysSupply',
  dispensedAt: 'dispensedAt',
  reportedToPDMP: 'reportedToPDMP',
  pdmpReportDate: 'pdmpReportDate',
  createdAt: 'createdAt'
};

exports.Prisma.InventoryScalarFieldEnum = {
  id: 'id',
  pharmacyId: 'pharmacyId',
  medicationId: 'medicationId',
  quantity: 'quantity',
  reorderLevel: 'reorderLevel',
  lotNumber: 'lotNumber',
  expirationDate: 'expirationDate',
  lastRestocked: 'lastRestocked',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DrugInteractionScalarFieldEnum = {
  id: 'id',
  drug1Name: 'drug1Name',
  drug2Name: 'drug2Name',
  severity: 'severity',
  description: 'description',
  source: 'source',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DrugAllergyScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  allergen: 'allergen',
  reaction: 'reaction',
  severity: 'severity',
  onsetDate: 'onsetDate',
  isActive: 'isActive',
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
exports.PrescriptionStatus = exports.$Enums.PrescriptionStatus = {
  active: 'active',
  completed: 'completed',
  cancelled: 'cancelled',
  expired: 'expired'
};

exports.PriorAuthStatus = exports.$Enums.PriorAuthStatus = {
  pending: 'pending',
  approved: 'approved',
  denied: 'denied',
  expired: 'expired',
  cancelled: 'cancelled',
  appealed: 'appealed'
};

exports.Prisma.ModelName = {
  Prescription: 'Prescription',
  PrescriptionItem: 'PrescriptionItem',
  Pharmacy: 'Pharmacy',
  Medication: 'Medication',
  PriorAuthorization: 'PriorAuthorization',
  Dispensing: 'Dispensing',
  ControlledSubstanceLog: 'ControlledSubstanceLog',
  Inventory: 'Inventory',
  DrugInteraction: 'DrugInteraction',
  DrugAllergy: 'DrugAllergy'
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
