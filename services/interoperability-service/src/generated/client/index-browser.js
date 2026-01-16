
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

exports.Prisma.TradingPartnerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  endpoint: 'endpoint',
  certificates: 'certificates',
  status: 'status',
  authType: 'authType',
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  tokenEndpoint: 'tokenEndpoint',
  scopes: 'scopes',
  fhirVersion: 'fhirVersion',
  supportedProfiles: 'supportedProfiles',
  isaId: 'isaId',
  gsId: 'gsId',
  directDomain: 'directDomain',
  smtpHost: 'smtpHost',
  smtpPort: 'smtpPort',
  contactName: 'contactName',
  contactEmail: 'contactEmail',
  contactPhone: 'contactPhone',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionLogScalarFieldEnum = {
  id: 'id',
  transactionId: 'transactionId',
  type: 'type',
  direction: 'direction',
  status: 'status',
  partnerId: 'partnerId',
  payload: 'payload',
  payloadHash: 'payloadHash',
  contentType: 'contentType',
  requestUrl: 'requestUrl',
  requestMethod: 'requestMethod',
  responseCode: 'responseCode',
  responseMessage: 'responseMessage',
  errorCode: 'errorCode',
  errorMessage: 'errorMessage',
  retryCount: 'retryCount',
  maxRetries: 'maxRetries',
  initiatedAt: 'initiatedAt',
  completedAt: 'completedAt',
  processingTimeMs: 'processingTimeMs',
  userId: 'userId',
  correlationId: 'correlationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NetworkParticipantScalarFieldEnum = {
  id: 'id',
  network: 'network',
  participantId: 'participantId',
  status: 'status',
  organizationName: 'organizationName',
  organizationOid: 'organizationOid',
  npi: 'npi',
  capabilities: 'capabilities',
  supportedPurposes: 'supportedPurposes',
  queryEndpoint: 'queryEndpoint',
  retrieveEndpoint: 'retrieveEndpoint',
  submitEndpoint: 'submitEndpoint',
  certificates: 'certificates',
  tefcaRole: 'tefcaRole',
  carequalityId: 'carequalityId',
  implementerOid: 'implementerOid',
  commonwellId: 'commonwellId',
  commonwellOrgId: 'commonwellOrgId',
  enrollmentDate: 'enrollmentDate',
  lastVerified: 'lastVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DirectAddressScalarFieldEnum = {
  id: 'id',
  address: 'address',
  certificate: 'certificate',
  privateKey: 'privateKey',
  domain: 'domain',
  status: 'status',
  ownerType: 'ownerType',
  ownerId: 'ownerId',
  ownerName: 'ownerName',
  trustAnchor: 'trustAnchor',
  trustBundle: 'trustBundle',
  certificateExpiry: 'certificateExpiry',
  issuerDn: 'issuerDn',
  subjectDn: 'subjectDn',
  hispId: 'hispId',
  hispName: 'hispName',
  messagesSent: 'messagesSent',
  messagesReceived: 'messagesReceived',
  lastActivity: 'lastActivity',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FhirEndpointScalarFieldEnum = {
  id: 'id',
  name: 'name',
  url: 'url',
  fhirVersion: 'fhirVersion',
  status: 'status',
  capabilityStatement: 'capabilityStatement',
  supportedResources: 'supportedResources',
  supportedOperations: 'supportedOperations',
  authType: 'authType',
  tokenEndpoint: 'tokenEndpoint',
  authorizeEndpoint: 'authorizeEndpoint',
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  scopes: 'scopes',
  smartEnabled: 'smartEnabled',
  smartMetadata: 'smartMetadata',
  organizationName: 'organizationName',
  organizationNpi: 'organizationNpi',
  lastHealthCheck: 'lastHealthCheck',
  healthStatus: 'healthStatus',
  avgResponseTimeMs: 'avgResponseTimeMs',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CCDADocumentScalarFieldEnum = {
  id: 'id',
  documentId: 'documentId',
  documentType: 'documentType',
  patientId: 'patientId',
  title: 'title',
  creationTime: 'creationTime',
  effectiveTime: 'effectiveTime',
  confidentialityCode: 'confidentialityCode',
  languageCode: 'languageCode',
  authorId: 'authorId',
  authorName: 'authorName',
  authorOrganization: 'authorOrganization',
  custodianId: 'custodianId',
  custodianName: 'custodianName',
  storageLocation: 'storageLocation',
  contentHash: 'contentHash',
  sizeBytes: 'sizeBytes',
  mimeType: 'mimeType',
  exchangeStatus: 'exchangeStatus',
  sourceNetwork: 'sourceNetwork',
  sourceOrganization: 'sourceOrganization',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.X12TransactionScalarFieldEnum = {
  id: 'id',
  transactionSetId: 'transactionSetId',
  transactionType: 'transactionType',
  isaControlNumber: 'isaControlNumber',
  gsControlNumber: 'gsControlNumber',
  stControlNumber: 'stControlNumber',
  senderId: 'senderId',
  senderQualifier: 'senderQualifier',
  receiverId: 'receiverId',
  receiverQualifier: 'receiverQualifier',
  rawContent: 'rawContent',
  parsedContent: 'parsedContent',
  status: 'status',
  acknowledgmentCode: 'acknowledgmentCode',
  errors: 'errors',
  interchangeDate: 'interchangeDate',
  processedAt: 'processedAt',
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

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.TradingPartnerType = exports.$Enums.TradingPartnerType = {
  payer: 'payer',
  provider: 'provider',
  clearinghouse: 'clearinghouse',
  hie: 'hie',
  ehr_vendor: 'ehr_vendor',
  lab: 'lab',
  pharmacy: 'pharmacy',
  public_health: 'public_health',
  qhin: 'qhin',
  carequality: 'carequality',
  commonwell: 'commonwell'
};

exports.PartnerStatus = exports.$Enums.PartnerStatus = {
  pending: 'pending',
  active: 'active',
  suspended: 'suspended',
  terminated: 'terminated'
};

exports.AuthenticationType = exports.$Enums.AuthenticationType = {
  none: 'none',
  basic: 'basic',
  oauth2: 'oauth2',
  mutual_tls: 'mutual_tls',
  saml: 'saml',
  smart_on_fhir: 'smart_on_fhir'
};

exports.TransactionType = exports.$Enums.TransactionType = {
  fhir_read: 'fhir_read',
  fhir_search: 'fhir_search',
  fhir_create: 'fhir_create',
  fhir_update: 'fhir_update',
  fhir_delete: 'fhir_delete',
  fhir_batch: 'fhir_batch',
  x12_270_eligibility: 'x12_270_eligibility',
  x12_271_eligibility_response: 'x12_271_eligibility_response',
  x12_276_claim_status: 'x12_276_claim_status',
  x12_277_claim_status_response: 'x12_277_claim_status_response',
  x12_278_prior_auth: 'x12_278_prior_auth',
  x12_835_payment: 'x12_835_payment',
  x12_837_claim: 'x12_837_claim',
  ccda_query: 'ccda_query',
  ccda_retrieve: 'ccda_retrieve',
  ccda_submit: 'ccda_submit',
  direct_message_send: 'direct_message_send',
  direct_message_receive: 'direct_message_receive',
  tefca_query: 'tefca_query',
  tefca_response: 'tefca_response',
  carequality_query: 'carequality_query',
  carequality_retrieve: 'carequality_retrieve',
  commonwell_link: 'commonwell_link',
  commonwell_query: 'commonwell_query'
};

exports.TransactionDirection = exports.$Enums.TransactionDirection = {
  inbound: 'inbound',
  outbound: 'outbound'
};

exports.TransactionStatus = exports.$Enums.TransactionStatus = {
  pending: 'pending',
  processing: 'processing',
  completed: 'completed',
  failed: 'failed',
  timeout: 'timeout',
  cancelled: 'cancelled',
  retrying: 'retrying'
};

exports.HealthcareNetwork = exports.$Enums.HealthcareNetwork = {
  tefca: 'tefca',
  carequality: 'carequality',
  commonwell: 'commonwell',
  ehealth_exchange: 'ehealth_exchange',
  surescripts: 'surescripts',
  direct_trust: 'direct_trust',
  state_hie: 'state_hie'
};

exports.ParticipantStatus = exports.$Enums.ParticipantStatus = {
  pending: 'pending',
  active: 'active',
  suspended: 'suspended',
  withdrawn: 'withdrawn'
};

exports.DirectAddressStatus = exports.$Enums.DirectAddressStatus = {
  pending: 'pending',
  active: 'active',
  suspended: 'suspended',
  revoked: 'revoked',
  expired: 'expired'
};

exports.DirectAddressOwner = exports.$Enums.DirectAddressOwner = {
  user: 'user',
  organization: 'organization',
  department: 'department',
  system: 'system'
};

exports.EndpointStatus = exports.$Enums.EndpointStatus = {
  active: 'active',
  inactive: 'inactive',
  testing: 'testing',
  deprecated: 'deprecated'
};

exports.CCDADocumentType = exports.$Enums.CCDADocumentType = {
  ccd: 'ccd',
  discharge_summary: 'discharge_summary',
  progress_note: 'progress_note',
  history_and_physical: 'history_and_physical',
  consultation_note: 'consultation_note',
  operative_note: 'operative_note',
  procedure_note: 'procedure_note',
  referral_note: 'referral_note',
  transfer_summary: 'transfer_summary',
  care_plan: 'care_plan',
  unstructured: 'unstructured'
};

exports.DocumentExchangeStatus = exports.$Enums.DocumentExchangeStatus = {
  local: 'local',
  shared: 'shared',
  received: 'received',
  pending_send: 'pending_send',
  send_failed: 'send_failed'
};

exports.X12TransactionType = exports.$Enums.X12TransactionType = {
  x270_eligibility_inquiry: 'x270_eligibility_inquiry',
  x271_eligibility_response: 'x271_eligibility_response',
  x276_claim_status_inquiry: 'x276_claim_status_inquiry',
  x277_claim_status_response: 'x277_claim_status_response',
  x278_prior_auth_request: 'x278_prior_auth_request',
  x278_prior_auth_response: 'x278_prior_auth_response',
  x835_payment_remittance: 'x835_payment_remittance',
  x837_professional_claim: 'x837_professional_claim',
  x837_institutional_claim: 'x837_institutional_claim',
  x837_dental_claim: 'x837_dental_claim',
  x999_acknowledgment: 'x999_acknowledgment',
  x997_acknowledgment: 'x997_acknowledgment',
  ta1_acknowledgment: 'ta1_acknowledgment'
};

exports.X12Status = exports.$Enums.X12Status = {
  received: 'received',
  validated: 'validated',
  processing: 'processing',
  completed: 'completed',
  rejected: 'rejected',
  error: 'error'
};

exports.Prisma.ModelName = {
  TradingPartner: 'TradingPartner',
  TransactionLog: 'TransactionLog',
  NetworkParticipant: 'NetworkParticipant',
  DirectAddress: 'DirectAddress',
  FhirEndpoint: 'FhirEndpoint',
  CCDADocument: 'CCDADocument',
  X12Transaction: 'X12Transaction'
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
