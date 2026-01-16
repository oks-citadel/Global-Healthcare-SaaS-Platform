
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
      "value": "C:\\Users\\citad\\OneDrive\\Documents\\Global-Healthcare-SaaS-Platform\\services\\interoperability-service\\src\\generated\\client",
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
    "sourceFilePath": "C:\\Users\\citad\\OneDrive\\Documents\\Global-Healthcare-SaaS-Platform\\services\\interoperability-service\\prisma\\schema.prisma",
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
  "inlineSchema": "generator client {\n  output   = \"./../src/generated/client\"\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// ==========================================\n// Trading Partner Management\n// ==========================================\n\nmodel TradingPartner {\n  id           String             @id @default(uuid())\n  name         String\n  type         TradingPartnerType\n  endpoint     String\n  certificates Json? // { publicKey, privateKey, certificateChain }\n  status       PartnerStatus      @default(pending)\n\n  // Connection details\n  authType      AuthenticationType @default(oauth2)\n  clientId      String?\n  clientSecret  String? // Encrypted\n  tokenEndpoint String?\n  scopes        String[]\n\n  // FHIR-specific\n  fhirVersion       String? // R4, STU3, etc.\n  supportedProfiles String[]\n\n  // X12-specific\n  isaId String? // ISA Interchange ID\n  gsId  String? // GS Functional Group ID\n\n  // Direct messaging\n  directDomain String?\n  smtpHost     String?\n  smtpPort     Int?\n\n  // Metadata\n  contactName  String?\n  contactEmail String?\n  contactPhone String?\n  notes        String?\n\n  transactions TransactionLog[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([name])\n  @@index([type])\n  @@index([status])\n  @@index([isaId])\n  @@index([directDomain])\n}\n\nenum TradingPartnerType {\n  payer\n  provider\n  clearinghouse\n  hie\n  ehr_vendor\n  lab\n  pharmacy\n  public_health\n  qhin\n  carequality\n  commonwell\n}\n\nenum PartnerStatus {\n  pending\n  active\n  suspended\n  terminated\n}\n\nenum AuthenticationType {\n  none\n  basic\n  oauth2\n  mutual_tls\n  saml\n  smart_on_fhir\n}\n\n// ==========================================\n// Transaction Logging\n// ==========================================\n\nmodel TransactionLog {\n  id            String               @id @default(uuid())\n  transactionId String               @unique\n  type          TransactionType\n  direction     TransactionDirection\n  status        TransactionStatus    @default(pending)\n\n  // Partner reference\n  partnerId String?\n  partner   TradingPartner? @relation(fields: [partnerId], references: [id])\n\n  // Payload details\n  payload     Json? // Original request/response\n  payloadHash String? // SHA-256 hash for integrity\n  contentType String? // application/json, application/xml, etc.\n\n  // Transaction details\n  requestUrl      String?\n  requestMethod   String?\n  responseCode    Int?\n  responseMessage String?\n\n  // Error handling\n  errorCode    String?\n  errorMessage String?\n  retryCount   Int     @default(0)\n  maxRetries   Int     @default(3)\n\n  // Timing\n  initiatedAt      DateTime  @default(now())\n  completedAt      DateTime?\n  processingTimeMs Int?\n\n  // Audit\n  userId        String?\n  correlationId String? // For tracing across services\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([transactionId])\n  @@index([type])\n  @@index([direction])\n  @@index([status])\n  @@index([partnerId])\n  @@index([initiatedAt])\n  @@index([correlationId])\n}\n\nenum TransactionType {\n  fhir_read\n  fhir_search\n  fhir_create\n  fhir_update\n  fhir_delete\n  fhir_batch\n  x12_270_eligibility\n  x12_271_eligibility_response\n  x12_276_claim_status\n  x12_277_claim_status_response\n  x12_278_prior_auth\n  x12_835_payment\n  x12_837_claim\n  ccda_query\n  ccda_retrieve\n  ccda_submit\n  direct_message_send\n  direct_message_receive\n  tefca_query\n  tefca_response\n  carequality_query\n  carequality_retrieve\n  commonwell_link\n  commonwell_query\n}\n\nenum TransactionDirection {\n  inbound\n  outbound\n}\n\nenum TransactionStatus {\n  pending\n  processing\n  completed\n  failed\n  timeout\n  cancelled\n  retrying\n}\n\n// ==========================================\n// Network Participation\n// ==========================================\n\nmodel NetworkParticipant {\n  id            String            @id @default(uuid())\n  network       HealthcareNetwork\n  participantId String // Network-assigned ID (OID, etc.)\n  status        ParticipantStatus @default(pending)\n\n  // Organization details\n  organizationName String\n  organizationOid  String? // OID for the organization\n  npi              String? // National Provider Identifier\n\n  // Capabilities\n  capabilities      Json? // Network-specific capabilities\n  supportedPurposes String[] // Treatment, Payment, Operations, etc.\n\n  // Endpoints\n  queryEndpoint    String?\n  retrieveEndpoint String?\n  submitEndpoint   String?\n\n  // Certificates\n  certificates Json? // Public certificates for network\n\n  // TEFCA-specific\n  tefcaRole String? // QHIN, Participant, Subparticipant\n\n  // Carequality-specific\n  carequalityId  String?\n  implementerOid String?\n\n  // CommonWell-specific\n  commonwellId    String?\n  commonwellOrgId String?\n\n  // Dates\n  enrollmentDate DateTime?\n  lastVerified   DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([network, participantId])\n  @@index([network])\n  @@index([status])\n  @@index([organizationOid])\n  @@index([npi])\n  @@index([carequalityId])\n  @@index([commonwellId])\n}\n\nenum HealthcareNetwork {\n  tefca\n  carequality\n  commonwell\n  ehealth_exchange\n  surescripts\n  direct_trust\n  state_hie\n}\n\nenum ParticipantStatus {\n  pending\n  active\n  suspended\n  withdrawn\n}\n\n// ==========================================\n// Direct Messaging\n// ==========================================\n\nmodel DirectAddress {\n  id          String              @id @default(uuid())\n  address     String              @unique // e.g., provider@direct.hospital.org\n  certificate String? // PEM-encoded X.509 certificate\n  privateKey  String? // Encrypted private key\n  domain      String // direct.hospital.org\n  status      DirectAddressStatus @default(pending)\n\n  // Owner information\n  ownerType DirectAddressOwner\n  ownerId   String // User or Organization ID\n  ownerName String?\n\n  // Trust anchor\n  trustAnchor String? // Trust anchor certificate\n  trustBundle String? // URL to trust bundle\n\n  // Certificate details\n  certificateExpiry DateTime?\n  issuerDn          String?\n  subjectDn         String?\n\n  // HISP information\n  hispId   String?\n  hispName String?\n\n  // Statistics\n  messagesSent     Int       @default(0)\n  messagesReceived Int       @default(0)\n  lastActivity     DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([address])\n  @@index([domain])\n  @@index([status])\n  @@index([ownerId])\n  @@index([certificateExpiry])\n}\n\nenum DirectAddressStatus {\n  pending\n  active\n  suspended\n  revoked\n  expired\n}\n\nenum DirectAddressOwner {\n  user\n  organization\n  department\n  system\n}\n\n// ==========================================\n// FHIR Endpoint Registry\n// ==========================================\n\nmodel FhirEndpoint {\n  id          String         @id @default(uuid())\n  name        String\n  url         String\n  fhirVersion String // R4, STU3, DSTU2\n  status      EndpointStatus @default(active)\n\n  // Capabilities\n  capabilityStatement Json? // Cached CapabilityStatement\n  supportedResources  String[]\n  supportedOperations String[]\n\n  // Authentication\n  authType          AuthenticationType @default(oauth2)\n  tokenEndpoint     String?\n  authorizeEndpoint String?\n  clientId          String?\n  clientSecret      String? // Encrypted\n  scopes            String[]\n\n  // SMART on FHIR\n  smartEnabled  Boolean @default(false)\n  smartMetadata Json?\n\n  // Organization\n  organizationName String?\n  organizationNpi  String?\n\n  // Monitoring\n  lastHealthCheck   DateTime?\n  healthStatus      String?\n  avgResponseTimeMs Int?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([name])\n  @@index([status])\n  @@index([fhirVersion])\n  @@index([organizationNpi])\n}\n\nenum EndpointStatus {\n  active\n  inactive\n  testing\n  deprecated\n}\n\n// ==========================================\n// C-CDA Document Registry\n// ==========================================\n\nmodel CCDADocument {\n  id           String           @id @default(uuid())\n  documentId   String           @unique // XDS document unique ID\n  documentType CCDADocumentType\n  patientId    String\n\n  // Document metadata\n  title               String?\n  creationTime        DateTime\n  effectiveTime       DateTime?\n  confidentialityCode String?\n  languageCode        String    @default(\"en-US\")\n\n  // Author information\n  authorId           String?\n  authorName         String?\n  authorOrganization String?\n\n  // Custodian\n  custodianId   String?\n  custodianName String?\n\n  // Storage\n  storageLocation String? // S3 URL or file path\n  contentHash     String? // SHA-256 hash\n  sizeBytes       Int?\n  mimeType        String  @default(\"application/xml\")\n\n  // Exchange status\n  exchangeStatus     DocumentExchangeStatus @default(local)\n  sourceNetwork      String?\n  sourceOrganization String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([documentId])\n  @@index([patientId])\n  @@index([documentType])\n  @@index([creationTime])\n  @@index([exchangeStatus])\n}\n\nenum CCDADocumentType {\n  ccd // Continuity of Care Document\n  discharge_summary\n  progress_note\n  history_and_physical\n  consultation_note\n  operative_note\n  procedure_note\n  referral_note\n  transfer_summary\n  care_plan\n  unstructured\n}\n\nenum DocumentExchangeStatus {\n  local\n  shared\n  received\n  pending_send\n  send_failed\n}\n\n// ==========================================\n// X12 Transaction Sets\n// ==========================================\n\nmodel X12Transaction {\n  id               String             @id @default(uuid())\n  transactionSetId String // ISA control number\n  transactionType  X12TransactionType\n\n  // Interchange envelope\n  isaControlNumber String\n  gsControlNumber  String\n  stControlNumber  String\n\n  // Sender/Receiver\n  senderId          String\n  senderQualifier   String\n  receiverId        String\n  receiverQualifier String\n\n  // Content\n  rawContent    String? // Original X12 content\n  parsedContent Json? // Parsed segments\n\n  // Processing\n  status             X12Status @default(received)\n  acknowledgmentCode String? // TA1, 999, 997\n  errors             Json?\n\n  // Dates\n  interchangeDate DateTime\n  processedAt     DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([transactionSetId])\n  @@index([transactionType])\n  @@index([isaControlNumber])\n  @@index([senderId])\n  @@index([receiverId])\n  @@index([status])\n  @@index([interchangeDate])\n}\n\nenum X12TransactionType {\n  x270_eligibility_inquiry\n  x271_eligibility_response\n  x276_claim_status_inquiry\n  x277_claim_status_response\n  x278_prior_auth_request\n  x278_prior_auth_response\n  x835_payment_remittance\n  x837_professional_claim\n  x837_institutional_claim\n  x837_dental_claim\n  x999_acknowledgment\n  x997_acknowledgment\n  ta1_acknowledgment\n}\n\nenum X12Status {\n  received\n  validated\n  processing\n  completed\n  rejected\n  error\n}\n",
  "inlineSchemaHash": "c441264764b97d1b0c25b03cdeb712caac47e03919a32c269cfe6fc260a46eec",
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

config.runtimeDataModel = JSON.parse("{\"models\":{\"TradingPartner\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradingPartnerType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endpoint\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"certificates\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PartnerStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AuthenticationType\",\"default\":\"oauth2\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientSecret\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tokenEndpoint\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scopes\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirVersion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supportedProfiles\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gsId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"directDomain\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"smtpHost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"smtpPort\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contactName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contactEmail\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contactPhone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TransactionLog\",\"relationName\":\"TradingPartnerToTransactionLog\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TransactionLog\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TransactionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"direction\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TransactionDirection\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TransactionStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"partnerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"partner\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TradingPartner\",\"relationName\":\"TradingPartnerToTransactionLog\",\"relationFromFields\":[\"partnerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payload\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payloadHash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contentType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requestUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requestMethod\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseMessage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"errorCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"errorMessage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"retryCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxRetries\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":3,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"initiatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processingTimeMs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"correlationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"NetworkParticipant\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"network\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HealthcareNetwork\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"participantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ParticipantStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"organizationName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"organizationOid\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"npi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"capabilities\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supportedPurposes\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"queryEndpoint\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"retrieveEndpoint\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"submitEndpoint\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"certificates\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tefcaRole\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"carequalityId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"implementerOid\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"commonwellId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"commonwellOrgId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"enrollmentDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastVerified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"network\",\"participantId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"network\",\"participantId\"]}],\"isGenerated\":false},\"DirectAddress\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"certificate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"privateKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"domain\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DirectAddressStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownerType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DirectAddressOwner\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownerName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trustAnchor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trustBundle\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"certificateExpiry\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"issuerDn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subjectDn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hispId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hispName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"messagesSent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"messagesReceived\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastActivity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FhirEndpoint\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fhirVersion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EndpointStatus\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"capabilityStatement\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supportedResources\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supportedOperations\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AuthenticationType\",\"default\":\"oauth2\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tokenEndpoint\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authorizeEndpoint\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientSecret\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scopes\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"smartEnabled\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"smartMetadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"organizationName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"organizationNpi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastHealthCheck\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"healthStatus\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avgResponseTimeMs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CCDADocument\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CCDADocumentType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"patientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creationTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"effectiveTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"confidentialityCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"languageCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"en-US\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authorName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authorOrganization\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"custodianId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"custodianName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"storageLocation\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contentHash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sizeBytes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"application/xml\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"exchangeStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DocumentExchangeStatus\",\"default\":\"local\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sourceNetwork\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sourceOrganization\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"X12Transaction\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactionSetId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transactionType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"X12TransactionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isaControlNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gsControlNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stControlNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"senderId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"senderQualifier\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiverId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiverQualifier\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rawContent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parsedContent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"X12Status\",\"default\":\"received\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"acknowledgmentCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"errors\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"interchangeDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"TradingPartnerType\":{\"values\":[{\"name\":\"payer\",\"dbName\":null},{\"name\":\"provider\",\"dbName\":null},{\"name\":\"clearinghouse\",\"dbName\":null},{\"name\":\"hie\",\"dbName\":null},{\"name\":\"ehr_vendor\",\"dbName\":null},{\"name\":\"lab\",\"dbName\":null},{\"name\":\"pharmacy\",\"dbName\":null},{\"name\":\"public_health\",\"dbName\":null},{\"name\":\"qhin\",\"dbName\":null},{\"name\":\"carequality\",\"dbName\":null},{\"name\":\"commonwell\",\"dbName\":null}],\"dbName\":null},\"PartnerStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"active\",\"dbName\":null},{\"name\":\"suspended\",\"dbName\":null},{\"name\":\"terminated\",\"dbName\":null}],\"dbName\":null},\"AuthenticationType\":{\"values\":[{\"name\":\"none\",\"dbName\":null},{\"name\":\"basic\",\"dbName\":null},{\"name\":\"oauth2\",\"dbName\":null},{\"name\":\"mutual_tls\",\"dbName\":null},{\"name\":\"saml\",\"dbName\":null},{\"name\":\"smart_on_fhir\",\"dbName\":null}],\"dbName\":null},\"TransactionType\":{\"values\":[{\"name\":\"fhir_read\",\"dbName\":null},{\"name\":\"fhir_search\",\"dbName\":null},{\"name\":\"fhir_create\",\"dbName\":null},{\"name\":\"fhir_update\",\"dbName\":null},{\"name\":\"fhir_delete\",\"dbName\":null},{\"name\":\"fhir_batch\",\"dbName\":null},{\"name\":\"x12_270_eligibility\",\"dbName\":null},{\"name\":\"x12_271_eligibility_response\",\"dbName\":null},{\"name\":\"x12_276_claim_status\",\"dbName\":null},{\"name\":\"x12_277_claim_status_response\",\"dbName\":null},{\"name\":\"x12_278_prior_auth\",\"dbName\":null},{\"name\":\"x12_835_payment\",\"dbName\":null},{\"name\":\"x12_837_claim\",\"dbName\":null},{\"name\":\"ccda_query\",\"dbName\":null},{\"name\":\"ccda_retrieve\",\"dbName\":null},{\"name\":\"ccda_submit\",\"dbName\":null},{\"name\":\"direct_message_send\",\"dbName\":null},{\"name\":\"direct_message_receive\",\"dbName\":null},{\"name\":\"tefca_query\",\"dbName\":null},{\"name\":\"tefca_response\",\"dbName\":null},{\"name\":\"carequality_query\",\"dbName\":null},{\"name\":\"carequality_retrieve\",\"dbName\":null},{\"name\":\"commonwell_link\",\"dbName\":null},{\"name\":\"commonwell_query\",\"dbName\":null}],\"dbName\":null},\"TransactionDirection\":{\"values\":[{\"name\":\"inbound\",\"dbName\":null},{\"name\":\"outbound\",\"dbName\":null}],\"dbName\":null},\"TransactionStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"processing\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"failed\",\"dbName\":null},{\"name\":\"timeout\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null},{\"name\":\"retrying\",\"dbName\":null}],\"dbName\":null},\"HealthcareNetwork\":{\"values\":[{\"name\":\"tefca\",\"dbName\":null},{\"name\":\"carequality\",\"dbName\":null},{\"name\":\"commonwell\",\"dbName\":null},{\"name\":\"ehealth_exchange\",\"dbName\":null},{\"name\":\"surescripts\",\"dbName\":null},{\"name\":\"direct_trust\",\"dbName\":null},{\"name\":\"state_hie\",\"dbName\":null}],\"dbName\":null},\"ParticipantStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"active\",\"dbName\":null},{\"name\":\"suspended\",\"dbName\":null},{\"name\":\"withdrawn\",\"dbName\":null}],\"dbName\":null},\"DirectAddressStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"active\",\"dbName\":null},{\"name\":\"suspended\",\"dbName\":null},{\"name\":\"revoked\",\"dbName\":null},{\"name\":\"expired\",\"dbName\":null}],\"dbName\":null},\"DirectAddressOwner\":{\"values\":[{\"name\":\"user\",\"dbName\":null},{\"name\":\"organization\",\"dbName\":null},{\"name\":\"department\",\"dbName\":null},{\"name\":\"system\",\"dbName\":null}],\"dbName\":null},\"EndpointStatus\":{\"values\":[{\"name\":\"active\",\"dbName\":null},{\"name\":\"inactive\",\"dbName\":null},{\"name\":\"testing\",\"dbName\":null},{\"name\":\"deprecated\",\"dbName\":null}],\"dbName\":null},\"CCDADocumentType\":{\"values\":[{\"name\":\"ccd\",\"dbName\":null},{\"name\":\"discharge_summary\",\"dbName\":null},{\"name\":\"progress_note\",\"dbName\":null},{\"name\":\"history_and_physical\",\"dbName\":null},{\"name\":\"consultation_note\",\"dbName\":null},{\"name\":\"operative_note\",\"dbName\":null},{\"name\":\"procedure_note\",\"dbName\":null},{\"name\":\"referral_note\",\"dbName\":null},{\"name\":\"transfer_summary\",\"dbName\":null},{\"name\":\"care_plan\",\"dbName\":null},{\"name\":\"unstructured\",\"dbName\":null}],\"dbName\":null},\"DocumentExchangeStatus\":{\"values\":[{\"name\":\"local\",\"dbName\":null},{\"name\":\"shared\",\"dbName\":null},{\"name\":\"received\",\"dbName\":null},{\"name\":\"pending_send\",\"dbName\":null},{\"name\":\"send_failed\",\"dbName\":null}],\"dbName\":null},\"X12TransactionType\":{\"values\":[{\"name\":\"x270_eligibility_inquiry\",\"dbName\":null},{\"name\":\"x271_eligibility_response\",\"dbName\":null},{\"name\":\"x276_claim_status_inquiry\",\"dbName\":null},{\"name\":\"x277_claim_status_response\",\"dbName\":null},{\"name\":\"x278_prior_auth_request\",\"dbName\":null},{\"name\":\"x278_prior_auth_response\",\"dbName\":null},{\"name\":\"x835_payment_remittance\",\"dbName\":null},{\"name\":\"x837_professional_claim\",\"dbName\":null},{\"name\":\"x837_institutional_claim\",\"dbName\":null},{\"name\":\"x837_dental_claim\",\"dbName\":null},{\"name\":\"x999_acknowledgment\",\"dbName\":null},{\"name\":\"x997_acknowledgment\",\"dbName\":null},{\"name\":\"ta1_acknowledgment\",\"dbName\":null}],\"dbName\":null},\"X12Status\":{\"values\":[{\"name\":\"received\",\"dbName\":null},{\"name\":\"validated\",\"dbName\":null},{\"name\":\"processing\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"rejected\",\"dbName\":null},{\"name\":\"error\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
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
