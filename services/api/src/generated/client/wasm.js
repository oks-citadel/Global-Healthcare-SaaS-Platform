
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

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  dateOfBirth: 'dateOfBirth',
  role: 'role',
  status: 'status',
  emailVerified: 'emailVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.PatientScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  medicalRecordNumber: 'medicalRecordNumber',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  bloodType: 'bloodType',
  allergies: 'allergies',
  emergencyContact: 'emergencyContact',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProviderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  licenseNumber: 'licenseNumber',
  specialty: 'specialty',
  bio: 'bio',
  available: 'available',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppointmentScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  providerId: 'providerId',
  scheduledAt: 'scheduledAt',
  duration: 'duration',
  type: 'type',
  status: 'status',
  reasonForVisit: 'reasonForVisit',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VisitScalarFieldEnum = {
  id: 'id',
  appointmentId: 'appointmentId',
  sessionToken: 'sessionToken',
  status: 'status',
  startedAt: 'startedAt',
  endedAt: 'endedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatMessageScalarFieldEnum = {
  id: 'id',
  visitId: 'visitId',
  senderId: 'senderId',
  message: 'message',
  attachments: 'attachments',
  timestamp: 'timestamp'
};

exports.Prisma.EncounterScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  providerId: 'providerId',
  appointmentId: 'appointmentId',
  type: 'type',
  status: 'status',
  startedAt: 'startedAt',
  endedAt: 'endedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClinicalNoteScalarFieldEnum = {
  id: 'id',
  encounterId: 'encounterId',
  authorId: 'authorId',
  noteType: 'noteType',
  content: 'content',
  timestamp: 'timestamp'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  type: 'type',
  fileName: 'fileName',
  fileUrl: 'fileUrl',
  blobName: 'blobName',
  mimeType: 'mimeType',
  size: 'size',
  description: 'description',
  uploadedBy: 'uploadedBy',
  version: 'version',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlanScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  currency: 'currency',
  interval: 'interval',
  features: 'features',
  active: 'active',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  planId: 'planId',
  status: 'status',
  stripeSubscriptionId: 'stripeSubscriptionId',
  currentPeriodStart: 'currentPeriodStart',
  currentPeriodEnd: 'currentPeriodEnd',
  cancelAtPeriodEnd: 'cancelAtPeriodEnd',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentMethodScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  stripePaymentMethodId: 'stripePaymentMethodId',
  type: 'type',
  last4: 'last4',
  brand: 'brand',
  expiryMonth: 'expiryMonth',
  expiryYear: 'expiryYear',
  isDefault: 'isDefault',
  billingAddress: 'billingAddress',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  paymentMethodId: 'paymentMethodId',
  stripePaymentIntentId: 'stripePaymentIntentId',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  description: 'description',
  metadata: 'metadata',
  invoiceId: 'invoiceId',
  failedReason: 'failedReason',
  refundedAmount: 'refundedAmount',
  refundedAt: 'refundedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  invoiceNumber: 'invoiceNumber',
  stripeInvoiceId: 'stripeInvoiceId',
  status: 'status',
  subtotal: 'subtotal',
  tax: 'tax',
  discount: 'discount',
  total: 'total',
  currency: 'currency',
  dueDate: 'dueDate',
  paidAt: 'paidAt',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceItemScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  description: 'description',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  amount: 'amount',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.HealthPackageScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  category: 'category',
  price: 'price',
  currency: 'currency',
  duration: 'duration',
  active: 'active',
  popular: 'popular',
  tests: 'tests',
  consultations: 'consultations',
  followUps: 'followUps',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HealthPackageBookingScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  packageId: 'packageId',
  status: 'status',
  scheduledDate: 'scheduledDate',
  completedAt: 'completedAt',
  notes: 'notes',
  reportUrl: 'reportUrl',
  reportGeneratedAt: 'reportGeneratedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiagnosticTestScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  category: 'category',
  description: 'description',
  preparation: 'preparation',
  sampleType: 'sampleType',
  turnaroundTime: 'turnaroundTime',
  price: 'price',
  currency: 'currency',
  active: 'active',
  referenceRanges: 'referenceRanges',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LabResultScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  encounterId: 'encounterId',
  testCode: 'testCode',
  testName: 'testName',
  value: 'value',
  unit: 'unit',
  referenceRange: 'referenceRange',
  status: 'status',
  isAbnormal: 'isAbnormal',
  notes: 'notes',
  performedBy: 'performedBy',
  verifiedBy: 'verifiedBy',
  collectedAt: 'collectedAt',
  resultedAt: 'resultedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

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

exports.Prisma.ConsentScalarFieldEnum = {
  id: 'id',
  patientId: 'patientId',
  type: 'type',
  granted: 'granted',
  scope: 'scope',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditEventScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  resource: 'resource',
  resourceId: 'resourceId',
  details: 'details',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  timestamp: 'timestamp'
};

exports.Prisma.DeviceTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  platform: 'platform',
  deviceName: 'deviceName',
  deviceModel: 'deviceModel',
  osVersion: 'osVersion',
  appVersion: 'appVersion',
  active: 'active',
  lastUsedAt: 'lastUsedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PushNotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  body: 'body',
  data: 'data',
  type: 'type',
  status: 'status',
  sentAt: 'sentAt',
  readAt: 'readAt',
  failedReason: 'failedReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationPreferenceScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  emailEnabled: 'emailEnabled',
  smsEnabled: 'smsEnabled',
  pushEnabled: 'pushEnabled',
  appointmentReminders: 'appointmentReminders',
  messageAlerts: 'messageAlerts',
  prescriptionAlerts: 'prescriptionAlerts',
  labResultAlerts: 'labResultAlerts',
  paymentAlerts: 'paymentAlerts',
  marketingEmails: 'marketingEmails',
  quietHoursEnabled: 'quietHoursEnabled',
  quietHoursStart: 'quietHoursStart',
  quietHoursEnd: 'quietHoursEnd',
  quietHoursTimezone: 'quietHoursTimezone',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WebhookEventLogScalarFieldEnum = {
  id: 'id',
  eventType: 'eventType',
  eventId: 'eventId',
  status: 'status',
  payload: 'payload',
  error: 'error',
  retryCount: 'retryCount',
  processingTimeMs: 'processingTimeMs',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BillingTransactionLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  transactionType: 'transactionType',
  stripeId: 'stripeId',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  idempotencyKey: 'idempotencyKey',
  metadata: 'metadata',
  error: 'error',
  processingTimeMs: 'processingTimeMs',
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

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  patient: 'patient',
  provider: 'provider',
  admin: 'admin'
};

exports.UserStatus = exports.$Enums.UserStatus = {
  active: 'active',
  inactive: 'inactive',
  pending: 'pending',
  suspended: 'suspended'
};

exports.Gender = exports.$Enums.Gender = {
  male: 'male',
  female: 'female',
  other: 'other',
  prefer_not_to_say: 'prefer_not_to_say'
};

exports.AppointmentType = exports.$Enums.AppointmentType = {
  video: 'video',
  audio: 'audio',
  chat: 'chat',
  in_person: 'in_person'
};

exports.AppointmentStatus = exports.$Enums.AppointmentStatus = {
  scheduled: 'scheduled',
  confirmed: 'confirmed',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'no_show'
};

exports.VisitStatus = exports.$Enums.VisitStatus = {
  waiting: 'waiting',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled'
};

exports.EncounterType = exports.$Enums.EncounterType = {
  virtual: 'virtual',
  in_person: 'in_person',
  phone: 'phone'
};

exports.EncounterStatus = exports.$Enums.EncounterStatus = {
  planned: 'planned',
  in_progress: 'in_progress',
  finished: 'finished',
  cancelled: 'cancelled'
};

exports.DocumentType = exports.$Enums.DocumentType = {
  lab_result: 'lab_result',
  imaging: 'imaging',
  prescription: 'prescription',
  other: 'other'
};

exports.PlanInterval = exports.$Enums.PlanInterval = {
  monthly: 'monthly',
  annual: 'annual'
};

exports.SubscriptionStatus = exports.$Enums.SubscriptionStatus = {
  active: 'active',
  past_due: 'past_due',
  cancelled: 'cancelled',
  expired: 'expired'
};

exports.PaymentMethodType = exports.$Enums.PaymentMethodType = {
  card: 'card',
  bank_account: 'bank_account',
  us_bank_account: 'us_bank_account'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  pending: 'pending',
  processing: 'processing',
  succeeded: 'succeeded',
  failed: 'failed',
  cancelled: 'cancelled',
  refunded: 'refunded',
  partially_refunded: 'partially_refunded'
};

exports.InvoiceStatus = exports.$Enums.InvoiceStatus = {
  draft: 'draft',
  sent: 'sent',
  paid: 'paid',
  partially_paid: 'partially_paid',
  overdue: 'overdue',
  cancelled: 'cancelled',
  refunded: 'refunded'
};

exports.HealthPackageCategory = exports.$Enums.HealthPackageCategory = {
  general_checkup: 'general_checkup',
  cardiac: 'cardiac',
  diabetes: 'diabetes',
  womens_health: 'womens_health',
  mens_health: 'mens_health',
  senior_citizen: 'senior_citizen',
  executive: 'executive',
  pre_employment: 'pre_employment',
  sports_fitness: 'sports_fitness'
};

exports.BookingStatus = exports.$Enums.BookingStatus = {
  scheduled: 'scheduled',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'no_show'
};

exports.DiagnosticCategory = exports.$Enums.DiagnosticCategory = {
  hematology: 'hematology',
  biochemistry: 'biochemistry',
  immunology: 'immunology',
  microbiology: 'microbiology',
  pathology: 'pathology',
  radiology: 'radiology',
  cardiology: 'cardiology',
  endocrinology: 'endocrinology',
  other: 'other'
};

exports.LabResultStatus = exports.$Enums.LabResultStatus = {
  pending: 'pending',
  processing: 'processing',
  completed: 'completed',
  cancelled: 'cancelled'
};

exports.PrescriptionStatus = exports.$Enums.PrescriptionStatus = {
  active: 'active',
  completed: 'completed',
  cancelled: 'cancelled',
  expired: 'expired'
};

exports.ConsentType = exports.$Enums.ConsentType = {
  data_sharing: 'data_sharing',
  treatment: 'treatment',
  marketing: 'marketing',
  research: 'research'
};

exports.Platform = exports.$Enums.Platform = {
  ios: 'ios',
  android: 'android',
  web: 'web'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  appointment_reminder: 'appointment_reminder',
  appointment_confirmation: 'appointment_confirmation',
  appointment_cancelled: 'appointment_cancelled',
  message_received: 'message_received',
  prescription_ready: 'prescription_ready',
  lab_results_available: 'lab_results_available',
  payment_due: 'payment_due',
  payment_received: 'payment_received',
  general: 'general'
};

exports.NotificationStatus = exports.$Enums.NotificationStatus = {
  pending: 'pending',
  sent: 'sent',
  delivered: 'delivered',
  read: 'read',
  failed: 'failed'
};

exports.WebhookEventStatus = exports.$Enums.WebhookEventStatus = {
  pending: 'pending',
  processing: 'processing',
  succeeded: 'succeeded',
  failed: 'failed'
};

exports.BillingTransactionType = exports.$Enums.BillingTransactionType = {
  CHARGE: 'CHARGE',
  REFUND: 'REFUND',
  SUBSCRIPTION_CREATE: 'SUBSCRIPTION_CREATE',
  SUBSCRIPTION_UPDATE: 'SUBSCRIPTION_UPDATE',
  SUBSCRIPTION_CANCEL: 'SUBSCRIPTION_CANCEL',
  PAYMENT_METHOD_ADD: 'PAYMENT_METHOD_ADD',
  PAYMENT_METHOD_REMOVE: 'PAYMENT_METHOD_REMOVE',
  INVOICE_PAID: 'INVOICE_PAID',
  INVOICE_FAILED: 'INVOICE_FAILED'
};

exports.BillingTransactionStatus = exports.$Enums.BillingTransactionStatus = {
  pending: 'pending',
  processing: 'processing',
  succeeded: 'succeeded',
  failed: 'failed'
};

exports.Prisma.ModelName = {
  User: 'User',
  RefreshToken: 'RefreshToken',
  Patient: 'Patient',
  Provider: 'Provider',
  Appointment: 'Appointment',
  Visit: 'Visit',
  ChatMessage: 'ChatMessage',
  Encounter: 'Encounter',
  ClinicalNote: 'ClinicalNote',
  Document: 'Document',
  Plan: 'Plan',
  Subscription: 'Subscription',
  PaymentMethod: 'PaymentMethod',
  Payment: 'Payment',
  Invoice: 'Invoice',
  InvoiceItem: 'InvoiceItem',
  HealthPackage: 'HealthPackage',
  HealthPackageBooking: 'HealthPackageBooking',
  DiagnosticTest: 'DiagnosticTest',
  LabResult: 'LabResult',
  Prescription: 'Prescription',
  PrescriptionItem: 'PrescriptionItem',
  Consent: 'Consent',
  AuditEvent: 'AuditEvent',
  DeviceToken: 'DeviceToken',
  PushNotification: 'PushNotification',
  NotificationPreference: 'NotificationPreference',
  WebhookEventLog: 'WebhookEventLog',
  BillingTransactionLog: 'BillingTransactionLog'
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
