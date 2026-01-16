
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model TradingPartner
 * 
 */
export type TradingPartner = $Result.DefaultSelection<Prisma.$TradingPartnerPayload>
/**
 * Model TransactionLog
 * 
 */
export type TransactionLog = $Result.DefaultSelection<Prisma.$TransactionLogPayload>
/**
 * Model NetworkParticipant
 * 
 */
export type NetworkParticipant = $Result.DefaultSelection<Prisma.$NetworkParticipantPayload>
/**
 * Model DirectAddress
 * 
 */
export type DirectAddress = $Result.DefaultSelection<Prisma.$DirectAddressPayload>
/**
 * Model FhirEndpoint
 * 
 */
export type FhirEndpoint = $Result.DefaultSelection<Prisma.$FhirEndpointPayload>
/**
 * Model CCDADocument
 * 
 */
export type CCDADocument = $Result.DefaultSelection<Prisma.$CCDADocumentPayload>
/**
 * Model X12Transaction
 * 
 */
export type X12Transaction = $Result.DefaultSelection<Prisma.$X12TransactionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TradingPartnerType: {
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

export type TradingPartnerType = (typeof TradingPartnerType)[keyof typeof TradingPartnerType]


export const PartnerStatus: {
  pending: 'pending',
  active: 'active',
  suspended: 'suspended',
  terminated: 'terminated'
};

export type PartnerStatus = (typeof PartnerStatus)[keyof typeof PartnerStatus]


export const AuthenticationType: {
  none: 'none',
  basic: 'basic',
  oauth2: 'oauth2',
  mutual_tls: 'mutual_tls',
  saml: 'saml',
  smart_on_fhir: 'smart_on_fhir'
};

export type AuthenticationType = (typeof AuthenticationType)[keyof typeof AuthenticationType]


export const TransactionType: {
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

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]


export const TransactionDirection: {
  inbound: 'inbound',
  outbound: 'outbound'
};

export type TransactionDirection = (typeof TransactionDirection)[keyof typeof TransactionDirection]


export const TransactionStatus: {
  pending: 'pending',
  processing: 'processing',
  completed: 'completed',
  failed: 'failed',
  timeout: 'timeout',
  cancelled: 'cancelled',
  retrying: 'retrying'
};

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]


export const HealthcareNetwork: {
  tefca: 'tefca',
  carequality: 'carequality',
  commonwell: 'commonwell',
  ehealth_exchange: 'ehealth_exchange',
  surescripts: 'surescripts',
  direct_trust: 'direct_trust',
  state_hie: 'state_hie'
};

export type HealthcareNetwork = (typeof HealthcareNetwork)[keyof typeof HealthcareNetwork]


export const ParticipantStatus: {
  pending: 'pending',
  active: 'active',
  suspended: 'suspended',
  withdrawn: 'withdrawn'
};

export type ParticipantStatus = (typeof ParticipantStatus)[keyof typeof ParticipantStatus]


export const DirectAddressStatus: {
  pending: 'pending',
  active: 'active',
  suspended: 'suspended',
  revoked: 'revoked',
  expired: 'expired'
};

export type DirectAddressStatus = (typeof DirectAddressStatus)[keyof typeof DirectAddressStatus]


export const DirectAddressOwner: {
  user: 'user',
  organization: 'organization',
  department: 'department',
  system: 'system'
};

export type DirectAddressOwner = (typeof DirectAddressOwner)[keyof typeof DirectAddressOwner]


export const EndpointStatus: {
  active: 'active',
  inactive: 'inactive',
  testing: 'testing',
  deprecated: 'deprecated'
};

export type EndpointStatus = (typeof EndpointStatus)[keyof typeof EndpointStatus]


export const CCDADocumentType: {
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

export type CCDADocumentType = (typeof CCDADocumentType)[keyof typeof CCDADocumentType]


export const DocumentExchangeStatus: {
  local: 'local',
  shared: 'shared',
  received: 'received',
  pending_send: 'pending_send',
  send_failed: 'send_failed'
};

export type DocumentExchangeStatus = (typeof DocumentExchangeStatus)[keyof typeof DocumentExchangeStatus]


export const X12TransactionType: {
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

export type X12TransactionType = (typeof X12TransactionType)[keyof typeof X12TransactionType]


export const X12Status: {
  received: 'received',
  validated: 'validated',
  processing: 'processing',
  completed: 'completed',
  rejected: 'rejected',
  error: 'error'
};

export type X12Status = (typeof X12Status)[keyof typeof X12Status]

}

export type TradingPartnerType = $Enums.TradingPartnerType

export const TradingPartnerType: typeof $Enums.TradingPartnerType

export type PartnerStatus = $Enums.PartnerStatus

export const PartnerStatus: typeof $Enums.PartnerStatus

export type AuthenticationType = $Enums.AuthenticationType

export const AuthenticationType: typeof $Enums.AuthenticationType

export type TransactionType = $Enums.TransactionType

export const TransactionType: typeof $Enums.TransactionType

export type TransactionDirection = $Enums.TransactionDirection

export const TransactionDirection: typeof $Enums.TransactionDirection

export type TransactionStatus = $Enums.TransactionStatus

export const TransactionStatus: typeof $Enums.TransactionStatus

export type HealthcareNetwork = $Enums.HealthcareNetwork

export const HealthcareNetwork: typeof $Enums.HealthcareNetwork

export type ParticipantStatus = $Enums.ParticipantStatus

export const ParticipantStatus: typeof $Enums.ParticipantStatus

export type DirectAddressStatus = $Enums.DirectAddressStatus

export const DirectAddressStatus: typeof $Enums.DirectAddressStatus

export type DirectAddressOwner = $Enums.DirectAddressOwner

export const DirectAddressOwner: typeof $Enums.DirectAddressOwner

export type EndpointStatus = $Enums.EndpointStatus

export const EndpointStatus: typeof $Enums.EndpointStatus

export type CCDADocumentType = $Enums.CCDADocumentType

export const CCDADocumentType: typeof $Enums.CCDADocumentType

export type DocumentExchangeStatus = $Enums.DocumentExchangeStatus

export const DocumentExchangeStatus: typeof $Enums.DocumentExchangeStatus

export type X12TransactionType = $Enums.X12TransactionType

export const X12TransactionType: typeof $Enums.X12TransactionType

export type X12Status = $Enums.X12Status

export const X12Status: typeof $Enums.X12Status

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more TradingPartners
 * const tradingPartners = await prisma.tradingPartner.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more TradingPartners
   * const tradingPartners = await prisma.tradingPartner.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.tradingPartner`: Exposes CRUD operations for the **TradingPartner** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradingPartners
    * const tradingPartners = await prisma.tradingPartner.findMany()
    * ```
    */
  get tradingPartner(): Prisma.TradingPartnerDelegate<ExtArgs>;

  /**
   * `prisma.transactionLog`: Exposes CRUD operations for the **TransactionLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TransactionLogs
    * const transactionLogs = await prisma.transactionLog.findMany()
    * ```
    */
  get transactionLog(): Prisma.TransactionLogDelegate<ExtArgs>;

  /**
   * `prisma.networkParticipant`: Exposes CRUD operations for the **NetworkParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NetworkParticipants
    * const networkParticipants = await prisma.networkParticipant.findMany()
    * ```
    */
  get networkParticipant(): Prisma.NetworkParticipantDelegate<ExtArgs>;

  /**
   * `prisma.directAddress`: Exposes CRUD operations for the **DirectAddress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DirectAddresses
    * const directAddresses = await prisma.directAddress.findMany()
    * ```
    */
  get directAddress(): Prisma.DirectAddressDelegate<ExtArgs>;

  /**
   * `prisma.fhirEndpoint`: Exposes CRUD operations for the **FhirEndpoint** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FhirEndpoints
    * const fhirEndpoints = await prisma.fhirEndpoint.findMany()
    * ```
    */
  get fhirEndpoint(): Prisma.FhirEndpointDelegate<ExtArgs>;

  /**
   * `prisma.cCDADocument`: Exposes CRUD operations for the **CCDADocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CCDADocuments
    * const cCDADocuments = await prisma.cCDADocument.findMany()
    * ```
    */
  get cCDADocument(): Prisma.CCDADocumentDelegate<ExtArgs>;

  /**
   * `prisma.x12Transaction`: Exposes CRUD operations for the **X12Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more X12Transactions
    * const x12Transactions = await prisma.x12Transaction.findMany()
    * ```
    */
  get x12Transaction(): Prisma.X12TransactionDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    TradingPartner: 'TradingPartner',
    TransactionLog: 'TransactionLog',
    NetworkParticipant: 'NetworkParticipant',
    DirectAddress: 'DirectAddress',
    FhirEndpoint: 'FhirEndpoint',
    CCDADocument: 'CCDADocument',
    X12Transaction: 'X12Transaction'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "tradingPartner" | "transactionLog" | "networkParticipant" | "directAddress" | "fhirEndpoint" | "cCDADocument" | "x12Transaction"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      TradingPartner: {
        payload: Prisma.$TradingPartnerPayload<ExtArgs>
        fields: Prisma.TradingPartnerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradingPartnerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPartnerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradingPartnerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPartnerPayload>
          }
          findFirst: {
            args: Prisma.TradingPartnerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPartnerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradingPartnerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPartnerPayload>
          }
          findMany: {
            args: Prisma.TradingPartnerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPartnerPayload>[]
          }
          create: {
            args: Prisma.TradingPartnerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPartnerPayload>
          }
          createMany: {
            args: Prisma.TradingPartnerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradingPartnerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPartnerPayload>[]
          }
          delete: {
            args: Prisma.TradingPartnerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPartnerPayload>
          }
          update: {
            args: Prisma.TradingPartnerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPartnerPayload>
          }
          deleteMany: {
            args: Prisma.TradingPartnerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradingPartnerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TradingPartnerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPartnerPayload>
          }
          aggregate: {
            args: Prisma.TradingPartnerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradingPartner>
          }
          groupBy: {
            args: Prisma.TradingPartnerGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradingPartnerGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradingPartnerCountArgs<ExtArgs>
            result: $Utils.Optional<TradingPartnerCountAggregateOutputType> | number
          }
        }
      }
      TransactionLog: {
        payload: Prisma.$TransactionLogPayload<ExtArgs>
        fields: Prisma.TransactionLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionLogPayload>
          }
          findFirst: {
            args: Prisma.TransactionLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionLogPayload>
          }
          findMany: {
            args: Prisma.TransactionLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionLogPayload>[]
          }
          create: {
            args: Prisma.TransactionLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionLogPayload>
          }
          createMany: {
            args: Prisma.TransactionLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionLogPayload>[]
          }
          delete: {
            args: Prisma.TransactionLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionLogPayload>
          }
          update: {
            args: Prisma.TransactionLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionLogPayload>
          }
          deleteMany: {
            args: Prisma.TransactionLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TransactionLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionLogPayload>
          }
          aggregate: {
            args: Prisma.TransactionLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransactionLog>
          }
          groupBy: {
            args: Prisma.TransactionLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionLogCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionLogCountAggregateOutputType> | number
          }
        }
      }
      NetworkParticipant: {
        payload: Prisma.$NetworkParticipantPayload<ExtArgs>
        fields: Prisma.NetworkParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NetworkParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NetworkParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NetworkParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NetworkParticipantPayload>
          }
          findFirst: {
            args: Prisma.NetworkParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NetworkParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NetworkParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NetworkParticipantPayload>
          }
          findMany: {
            args: Prisma.NetworkParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NetworkParticipantPayload>[]
          }
          create: {
            args: Prisma.NetworkParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NetworkParticipantPayload>
          }
          createMany: {
            args: Prisma.NetworkParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NetworkParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NetworkParticipantPayload>[]
          }
          delete: {
            args: Prisma.NetworkParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NetworkParticipantPayload>
          }
          update: {
            args: Prisma.NetworkParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NetworkParticipantPayload>
          }
          deleteMany: {
            args: Prisma.NetworkParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NetworkParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NetworkParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NetworkParticipantPayload>
          }
          aggregate: {
            args: Prisma.NetworkParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNetworkParticipant>
          }
          groupBy: {
            args: Prisma.NetworkParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<NetworkParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.NetworkParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<NetworkParticipantCountAggregateOutputType> | number
          }
        }
      }
      DirectAddress: {
        payload: Prisma.$DirectAddressPayload<ExtArgs>
        fields: Prisma.DirectAddressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DirectAddressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectAddressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DirectAddressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectAddressPayload>
          }
          findFirst: {
            args: Prisma.DirectAddressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectAddressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DirectAddressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectAddressPayload>
          }
          findMany: {
            args: Prisma.DirectAddressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectAddressPayload>[]
          }
          create: {
            args: Prisma.DirectAddressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectAddressPayload>
          }
          createMany: {
            args: Prisma.DirectAddressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DirectAddressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectAddressPayload>[]
          }
          delete: {
            args: Prisma.DirectAddressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectAddressPayload>
          }
          update: {
            args: Prisma.DirectAddressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectAddressPayload>
          }
          deleteMany: {
            args: Prisma.DirectAddressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DirectAddressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DirectAddressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectAddressPayload>
          }
          aggregate: {
            args: Prisma.DirectAddressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDirectAddress>
          }
          groupBy: {
            args: Prisma.DirectAddressGroupByArgs<ExtArgs>
            result: $Utils.Optional<DirectAddressGroupByOutputType>[]
          }
          count: {
            args: Prisma.DirectAddressCountArgs<ExtArgs>
            result: $Utils.Optional<DirectAddressCountAggregateOutputType> | number
          }
        }
      }
      FhirEndpoint: {
        payload: Prisma.$FhirEndpointPayload<ExtArgs>
        fields: Prisma.FhirEndpointFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FhirEndpointFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FhirEndpointPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FhirEndpointFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FhirEndpointPayload>
          }
          findFirst: {
            args: Prisma.FhirEndpointFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FhirEndpointPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FhirEndpointFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FhirEndpointPayload>
          }
          findMany: {
            args: Prisma.FhirEndpointFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FhirEndpointPayload>[]
          }
          create: {
            args: Prisma.FhirEndpointCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FhirEndpointPayload>
          }
          createMany: {
            args: Prisma.FhirEndpointCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FhirEndpointCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FhirEndpointPayload>[]
          }
          delete: {
            args: Prisma.FhirEndpointDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FhirEndpointPayload>
          }
          update: {
            args: Prisma.FhirEndpointUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FhirEndpointPayload>
          }
          deleteMany: {
            args: Prisma.FhirEndpointDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FhirEndpointUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FhirEndpointUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FhirEndpointPayload>
          }
          aggregate: {
            args: Prisma.FhirEndpointAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFhirEndpoint>
          }
          groupBy: {
            args: Prisma.FhirEndpointGroupByArgs<ExtArgs>
            result: $Utils.Optional<FhirEndpointGroupByOutputType>[]
          }
          count: {
            args: Prisma.FhirEndpointCountArgs<ExtArgs>
            result: $Utils.Optional<FhirEndpointCountAggregateOutputType> | number
          }
        }
      }
      CCDADocument: {
        payload: Prisma.$CCDADocumentPayload<ExtArgs>
        fields: Prisma.CCDADocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CCDADocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CCDADocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CCDADocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CCDADocumentPayload>
          }
          findFirst: {
            args: Prisma.CCDADocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CCDADocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CCDADocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CCDADocumentPayload>
          }
          findMany: {
            args: Prisma.CCDADocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CCDADocumentPayload>[]
          }
          create: {
            args: Prisma.CCDADocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CCDADocumentPayload>
          }
          createMany: {
            args: Prisma.CCDADocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CCDADocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CCDADocumentPayload>[]
          }
          delete: {
            args: Prisma.CCDADocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CCDADocumentPayload>
          }
          update: {
            args: Prisma.CCDADocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CCDADocumentPayload>
          }
          deleteMany: {
            args: Prisma.CCDADocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CCDADocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CCDADocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CCDADocumentPayload>
          }
          aggregate: {
            args: Prisma.CCDADocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCCDADocument>
          }
          groupBy: {
            args: Prisma.CCDADocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CCDADocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CCDADocumentCountArgs<ExtArgs>
            result: $Utils.Optional<CCDADocumentCountAggregateOutputType> | number
          }
        }
      }
      X12Transaction: {
        payload: Prisma.$X12TransactionPayload<ExtArgs>
        fields: Prisma.X12TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.X12TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$X12TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.X12TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$X12TransactionPayload>
          }
          findFirst: {
            args: Prisma.X12TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$X12TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.X12TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$X12TransactionPayload>
          }
          findMany: {
            args: Prisma.X12TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$X12TransactionPayload>[]
          }
          create: {
            args: Prisma.X12TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$X12TransactionPayload>
          }
          createMany: {
            args: Prisma.X12TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.X12TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$X12TransactionPayload>[]
          }
          delete: {
            args: Prisma.X12TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$X12TransactionPayload>
          }
          update: {
            args: Prisma.X12TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$X12TransactionPayload>
          }
          deleteMany: {
            args: Prisma.X12TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.X12TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.X12TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$X12TransactionPayload>
          }
          aggregate: {
            args: Prisma.X12TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateX12Transaction>
          }
          groupBy: {
            args: Prisma.X12TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<X12TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.X12TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<X12TransactionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TradingPartnerCountOutputType
   */

  export type TradingPartnerCountOutputType = {
    transactions: number
  }

  export type TradingPartnerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | TradingPartnerCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * TradingPartnerCountOutputType without action
   */
  export type TradingPartnerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartnerCountOutputType
     */
    select?: TradingPartnerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TradingPartnerCountOutputType without action
   */
  export type TradingPartnerCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model TradingPartner
   */

  export type AggregateTradingPartner = {
    _count: TradingPartnerCountAggregateOutputType | null
    _avg: TradingPartnerAvgAggregateOutputType | null
    _sum: TradingPartnerSumAggregateOutputType | null
    _min: TradingPartnerMinAggregateOutputType | null
    _max: TradingPartnerMaxAggregateOutputType | null
  }

  export type TradingPartnerAvgAggregateOutputType = {
    smtpPort: number | null
  }

  export type TradingPartnerSumAggregateOutputType = {
    smtpPort: number | null
  }

  export type TradingPartnerMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.TradingPartnerType | null
    endpoint: string | null
    status: $Enums.PartnerStatus | null
    authType: $Enums.AuthenticationType | null
    clientId: string | null
    clientSecret: string | null
    tokenEndpoint: string | null
    fhirVersion: string | null
    isaId: string | null
    gsId: string | null
    directDomain: string | null
    smtpHost: string | null
    smtpPort: number | null
    contactName: string | null
    contactEmail: string | null
    contactPhone: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradingPartnerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.TradingPartnerType | null
    endpoint: string | null
    status: $Enums.PartnerStatus | null
    authType: $Enums.AuthenticationType | null
    clientId: string | null
    clientSecret: string | null
    tokenEndpoint: string | null
    fhirVersion: string | null
    isaId: string | null
    gsId: string | null
    directDomain: string | null
    smtpHost: string | null
    smtpPort: number | null
    contactName: string | null
    contactEmail: string | null
    contactPhone: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradingPartnerCountAggregateOutputType = {
    id: number
    name: number
    type: number
    endpoint: number
    certificates: number
    status: number
    authType: number
    clientId: number
    clientSecret: number
    tokenEndpoint: number
    scopes: number
    fhirVersion: number
    supportedProfiles: number
    isaId: number
    gsId: number
    directDomain: number
    smtpHost: number
    smtpPort: number
    contactName: number
    contactEmail: number
    contactPhone: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TradingPartnerAvgAggregateInputType = {
    smtpPort?: true
  }

  export type TradingPartnerSumAggregateInputType = {
    smtpPort?: true
  }

  export type TradingPartnerMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    endpoint?: true
    status?: true
    authType?: true
    clientId?: true
    clientSecret?: true
    tokenEndpoint?: true
    fhirVersion?: true
    isaId?: true
    gsId?: true
    directDomain?: true
    smtpHost?: true
    smtpPort?: true
    contactName?: true
    contactEmail?: true
    contactPhone?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradingPartnerMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    endpoint?: true
    status?: true
    authType?: true
    clientId?: true
    clientSecret?: true
    tokenEndpoint?: true
    fhirVersion?: true
    isaId?: true
    gsId?: true
    directDomain?: true
    smtpHost?: true
    smtpPort?: true
    contactName?: true
    contactEmail?: true
    contactPhone?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradingPartnerCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    endpoint?: true
    certificates?: true
    status?: true
    authType?: true
    clientId?: true
    clientSecret?: true
    tokenEndpoint?: true
    scopes?: true
    fhirVersion?: true
    supportedProfiles?: true
    isaId?: true
    gsId?: true
    directDomain?: true
    smtpHost?: true
    smtpPort?: true
    contactName?: true
    contactEmail?: true
    contactPhone?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TradingPartnerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingPartner to aggregate.
     */
    where?: TradingPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPartners to fetch.
     */
    orderBy?: TradingPartnerOrderByWithRelationInput | TradingPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradingPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPartners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradingPartners
    **/
    _count?: true | TradingPartnerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradingPartnerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradingPartnerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradingPartnerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradingPartnerMaxAggregateInputType
  }

  export type GetTradingPartnerAggregateType<T extends TradingPartnerAggregateArgs> = {
        [P in keyof T & keyof AggregateTradingPartner]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradingPartner[P]>
      : GetScalarType<T[P], AggregateTradingPartner[P]>
  }




  export type TradingPartnerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingPartnerWhereInput
    orderBy?: TradingPartnerOrderByWithAggregationInput | TradingPartnerOrderByWithAggregationInput[]
    by: TradingPartnerScalarFieldEnum[] | TradingPartnerScalarFieldEnum
    having?: TradingPartnerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradingPartnerCountAggregateInputType | true
    _avg?: TradingPartnerAvgAggregateInputType
    _sum?: TradingPartnerSumAggregateInputType
    _min?: TradingPartnerMinAggregateInputType
    _max?: TradingPartnerMaxAggregateInputType
  }

  export type TradingPartnerGroupByOutputType = {
    id: string
    name: string
    type: $Enums.TradingPartnerType
    endpoint: string
    certificates: JsonValue | null
    status: $Enums.PartnerStatus
    authType: $Enums.AuthenticationType
    clientId: string | null
    clientSecret: string | null
    tokenEndpoint: string | null
    scopes: string[]
    fhirVersion: string | null
    supportedProfiles: string[]
    isaId: string | null
    gsId: string | null
    directDomain: string | null
    smtpHost: string | null
    smtpPort: number | null
    contactName: string | null
    contactEmail: string | null
    contactPhone: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: TradingPartnerCountAggregateOutputType | null
    _avg: TradingPartnerAvgAggregateOutputType | null
    _sum: TradingPartnerSumAggregateOutputType | null
    _min: TradingPartnerMinAggregateOutputType | null
    _max: TradingPartnerMaxAggregateOutputType | null
  }

  type GetTradingPartnerGroupByPayload<T extends TradingPartnerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradingPartnerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradingPartnerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradingPartnerGroupByOutputType[P]>
            : GetScalarType<T[P], TradingPartnerGroupByOutputType[P]>
        }
      >
    >


  export type TradingPartnerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    endpoint?: boolean
    certificates?: boolean
    status?: boolean
    authType?: boolean
    clientId?: boolean
    clientSecret?: boolean
    tokenEndpoint?: boolean
    scopes?: boolean
    fhirVersion?: boolean
    supportedProfiles?: boolean
    isaId?: boolean
    gsId?: boolean
    directDomain?: boolean
    smtpHost?: boolean
    smtpPort?: boolean
    contactName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transactions?: boolean | TradingPartner$transactionsArgs<ExtArgs>
    _count?: boolean | TradingPartnerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradingPartner"]>

  export type TradingPartnerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    endpoint?: boolean
    certificates?: boolean
    status?: boolean
    authType?: boolean
    clientId?: boolean
    clientSecret?: boolean
    tokenEndpoint?: boolean
    scopes?: boolean
    fhirVersion?: boolean
    supportedProfiles?: boolean
    isaId?: boolean
    gsId?: boolean
    directDomain?: boolean
    smtpHost?: boolean
    smtpPort?: boolean
    contactName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tradingPartner"]>

  export type TradingPartnerSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    endpoint?: boolean
    certificates?: boolean
    status?: boolean
    authType?: boolean
    clientId?: boolean
    clientSecret?: boolean
    tokenEndpoint?: boolean
    scopes?: boolean
    fhirVersion?: boolean
    supportedProfiles?: boolean
    isaId?: boolean
    gsId?: boolean
    directDomain?: boolean
    smtpHost?: boolean
    smtpPort?: boolean
    contactName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TradingPartnerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | TradingPartner$transactionsArgs<ExtArgs>
    _count?: boolean | TradingPartnerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TradingPartnerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TradingPartnerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradingPartner"
    objects: {
      transactions: Prisma.$TransactionLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: $Enums.TradingPartnerType
      endpoint: string
      certificates: Prisma.JsonValue | null
      status: $Enums.PartnerStatus
      authType: $Enums.AuthenticationType
      clientId: string | null
      clientSecret: string | null
      tokenEndpoint: string | null
      scopes: string[]
      fhirVersion: string | null
      supportedProfiles: string[]
      isaId: string | null
      gsId: string | null
      directDomain: string | null
      smtpHost: string | null
      smtpPort: number | null
      contactName: string | null
      contactEmail: string | null
      contactPhone: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tradingPartner"]>
    composites: {}
  }

  type TradingPartnerGetPayload<S extends boolean | null | undefined | TradingPartnerDefaultArgs> = $Result.GetResult<Prisma.$TradingPartnerPayload, S>

  type TradingPartnerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TradingPartnerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TradingPartnerCountAggregateInputType | true
    }

  export interface TradingPartnerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradingPartner'], meta: { name: 'TradingPartner' } }
    /**
     * Find zero or one TradingPartner that matches the filter.
     * @param {TradingPartnerFindUniqueArgs} args - Arguments to find a TradingPartner
     * @example
     * // Get one TradingPartner
     * const tradingPartner = await prisma.tradingPartner.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradingPartnerFindUniqueArgs>(args: SelectSubset<T, TradingPartnerFindUniqueArgs<ExtArgs>>): Prisma__TradingPartnerClient<$Result.GetResult<Prisma.$TradingPartnerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TradingPartner that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TradingPartnerFindUniqueOrThrowArgs} args - Arguments to find a TradingPartner
     * @example
     * // Get one TradingPartner
     * const tradingPartner = await prisma.tradingPartner.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradingPartnerFindUniqueOrThrowArgs>(args: SelectSubset<T, TradingPartnerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradingPartnerClient<$Result.GetResult<Prisma.$TradingPartnerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TradingPartner that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPartnerFindFirstArgs} args - Arguments to find a TradingPartner
     * @example
     * // Get one TradingPartner
     * const tradingPartner = await prisma.tradingPartner.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradingPartnerFindFirstArgs>(args?: SelectSubset<T, TradingPartnerFindFirstArgs<ExtArgs>>): Prisma__TradingPartnerClient<$Result.GetResult<Prisma.$TradingPartnerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TradingPartner that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPartnerFindFirstOrThrowArgs} args - Arguments to find a TradingPartner
     * @example
     * // Get one TradingPartner
     * const tradingPartner = await prisma.tradingPartner.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradingPartnerFindFirstOrThrowArgs>(args?: SelectSubset<T, TradingPartnerFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradingPartnerClient<$Result.GetResult<Prisma.$TradingPartnerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TradingPartners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPartnerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradingPartners
     * const tradingPartners = await prisma.tradingPartner.findMany()
     * 
     * // Get first 10 TradingPartners
     * const tradingPartners = await prisma.tradingPartner.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradingPartnerWithIdOnly = await prisma.tradingPartner.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradingPartnerFindManyArgs>(args?: SelectSubset<T, TradingPartnerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingPartnerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TradingPartner.
     * @param {TradingPartnerCreateArgs} args - Arguments to create a TradingPartner.
     * @example
     * // Create one TradingPartner
     * const TradingPartner = await prisma.tradingPartner.create({
     *   data: {
     *     // ... data to create a TradingPartner
     *   }
     * })
     * 
     */
    create<T extends TradingPartnerCreateArgs>(args: SelectSubset<T, TradingPartnerCreateArgs<ExtArgs>>): Prisma__TradingPartnerClient<$Result.GetResult<Prisma.$TradingPartnerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TradingPartners.
     * @param {TradingPartnerCreateManyArgs} args - Arguments to create many TradingPartners.
     * @example
     * // Create many TradingPartners
     * const tradingPartner = await prisma.tradingPartner.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradingPartnerCreateManyArgs>(args?: SelectSubset<T, TradingPartnerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradingPartners and returns the data saved in the database.
     * @param {TradingPartnerCreateManyAndReturnArgs} args - Arguments to create many TradingPartners.
     * @example
     * // Create many TradingPartners
     * const tradingPartner = await prisma.tradingPartner.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradingPartners and only return the `id`
     * const tradingPartnerWithIdOnly = await prisma.tradingPartner.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradingPartnerCreateManyAndReturnArgs>(args?: SelectSubset<T, TradingPartnerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingPartnerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TradingPartner.
     * @param {TradingPartnerDeleteArgs} args - Arguments to delete one TradingPartner.
     * @example
     * // Delete one TradingPartner
     * const TradingPartner = await prisma.tradingPartner.delete({
     *   where: {
     *     // ... filter to delete one TradingPartner
     *   }
     * })
     * 
     */
    delete<T extends TradingPartnerDeleteArgs>(args: SelectSubset<T, TradingPartnerDeleteArgs<ExtArgs>>): Prisma__TradingPartnerClient<$Result.GetResult<Prisma.$TradingPartnerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TradingPartner.
     * @param {TradingPartnerUpdateArgs} args - Arguments to update one TradingPartner.
     * @example
     * // Update one TradingPartner
     * const tradingPartner = await prisma.tradingPartner.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradingPartnerUpdateArgs>(args: SelectSubset<T, TradingPartnerUpdateArgs<ExtArgs>>): Prisma__TradingPartnerClient<$Result.GetResult<Prisma.$TradingPartnerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TradingPartners.
     * @param {TradingPartnerDeleteManyArgs} args - Arguments to filter TradingPartners to delete.
     * @example
     * // Delete a few TradingPartners
     * const { count } = await prisma.tradingPartner.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradingPartnerDeleteManyArgs>(args?: SelectSubset<T, TradingPartnerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingPartners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPartnerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradingPartners
     * const tradingPartner = await prisma.tradingPartner.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradingPartnerUpdateManyArgs>(args: SelectSubset<T, TradingPartnerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TradingPartner.
     * @param {TradingPartnerUpsertArgs} args - Arguments to update or create a TradingPartner.
     * @example
     * // Update or create a TradingPartner
     * const tradingPartner = await prisma.tradingPartner.upsert({
     *   create: {
     *     // ... data to create a TradingPartner
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradingPartner we want to update
     *   }
     * })
     */
    upsert<T extends TradingPartnerUpsertArgs>(args: SelectSubset<T, TradingPartnerUpsertArgs<ExtArgs>>): Prisma__TradingPartnerClient<$Result.GetResult<Prisma.$TradingPartnerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TradingPartners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPartnerCountArgs} args - Arguments to filter TradingPartners to count.
     * @example
     * // Count the number of TradingPartners
     * const count = await prisma.tradingPartner.count({
     *   where: {
     *     // ... the filter for the TradingPartners we want to count
     *   }
     * })
    **/
    count<T extends TradingPartnerCountArgs>(
      args?: Subset<T, TradingPartnerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradingPartnerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradingPartner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPartnerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TradingPartnerAggregateArgs>(args: Subset<T, TradingPartnerAggregateArgs>): Prisma.PrismaPromise<GetTradingPartnerAggregateType<T>>

    /**
     * Group by TradingPartner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPartnerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TradingPartnerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradingPartnerGroupByArgs['orderBy'] }
        : { orderBy?: TradingPartnerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TradingPartnerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradingPartnerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradingPartner model
   */
  readonly fields: TradingPartnerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradingPartner.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradingPartnerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transactions<T extends TradingPartner$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, TradingPartner$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TradingPartner model
   */ 
  interface TradingPartnerFieldRefs {
    readonly id: FieldRef<"TradingPartner", 'String'>
    readonly name: FieldRef<"TradingPartner", 'String'>
    readonly type: FieldRef<"TradingPartner", 'TradingPartnerType'>
    readonly endpoint: FieldRef<"TradingPartner", 'String'>
    readonly certificates: FieldRef<"TradingPartner", 'Json'>
    readonly status: FieldRef<"TradingPartner", 'PartnerStatus'>
    readonly authType: FieldRef<"TradingPartner", 'AuthenticationType'>
    readonly clientId: FieldRef<"TradingPartner", 'String'>
    readonly clientSecret: FieldRef<"TradingPartner", 'String'>
    readonly tokenEndpoint: FieldRef<"TradingPartner", 'String'>
    readonly scopes: FieldRef<"TradingPartner", 'String[]'>
    readonly fhirVersion: FieldRef<"TradingPartner", 'String'>
    readonly supportedProfiles: FieldRef<"TradingPartner", 'String[]'>
    readonly isaId: FieldRef<"TradingPartner", 'String'>
    readonly gsId: FieldRef<"TradingPartner", 'String'>
    readonly directDomain: FieldRef<"TradingPartner", 'String'>
    readonly smtpHost: FieldRef<"TradingPartner", 'String'>
    readonly smtpPort: FieldRef<"TradingPartner", 'Int'>
    readonly contactName: FieldRef<"TradingPartner", 'String'>
    readonly contactEmail: FieldRef<"TradingPartner", 'String'>
    readonly contactPhone: FieldRef<"TradingPartner", 'String'>
    readonly notes: FieldRef<"TradingPartner", 'String'>
    readonly createdAt: FieldRef<"TradingPartner", 'DateTime'>
    readonly updatedAt: FieldRef<"TradingPartner", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradingPartner findUnique
   */
  export type TradingPartnerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPartnerInclude<ExtArgs> | null
    /**
     * Filter, which TradingPartner to fetch.
     */
    where: TradingPartnerWhereUniqueInput
  }

  /**
   * TradingPartner findUniqueOrThrow
   */
  export type TradingPartnerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPartnerInclude<ExtArgs> | null
    /**
     * Filter, which TradingPartner to fetch.
     */
    where: TradingPartnerWhereUniqueInput
  }

  /**
   * TradingPartner findFirst
   */
  export type TradingPartnerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPartnerInclude<ExtArgs> | null
    /**
     * Filter, which TradingPartner to fetch.
     */
    where?: TradingPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPartners to fetch.
     */
    orderBy?: TradingPartnerOrderByWithRelationInput | TradingPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingPartners.
     */
    cursor?: TradingPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPartners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingPartners.
     */
    distinct?: TradingPartnerScalarFieldEnum | TradingPartnerScalarFieldEnum[]
  }

  /**
   * TradingPartner findFirstOrThrow
   */
  export type TradingPartnerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPartnerInclude<ExtArgs> | null
    /**
     * Filter, which TradingPartner to fetch.
     */
    where?: TradingPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPartners to fetch.
     */
    orderBy?: TradingPartnerOrderByWithRelationInput | TradingPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingPartners.
     */
    cursor?: TradingPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPartners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingPartners.
     */
    distinct?: TradingPartnerScalarFieldEnum | TradingPartnerScalarFieldEnum[]
  }

  /**
   * TradingPartner findMany
   */
  export type TradingPartnerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPartnerInclude<ExtArgs> | null
    /**
     * Filter, which TradingPartners to fetch.
     */
    where?: TradingPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPartners to fetch.
     */
    orderBy?: TradingPartnerOrderByWithRelationInput | TradingPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradingPartners.
     */
    cursor?: TradingPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPartners.
     */
    skip?: number
    distinct?: TradingPartnerScalarFieldEnum | TradingPartnerScalarFieldEnum[]
  }

  /**
   * TradingPartner create
   */
  export type TradingPartnerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPartnerInclude<ExtArgs> | null
    /**
     * The data needed to create a TradingPartner.
     */
    data: XOR<TradingPartnerCreateInput, TradingPartnerUncheckedCreateInput>
  }

  /**
   * TradingPartner createMany
   */
  export type TradingPartnerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradingPartners.
     */
    data: TradingPartnerCreateManyInput | TradingPartnerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradingPartner createManyAndReturn
   */
  export type TradingPartnerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TradingPartners.
     */
    data: TradingPartnerCreateManyInput | TradingPartnerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradingPartner update
   */
  export type TradingPartnerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPartnerInclude<ExtArgs> | null
    /**
     * The data needed to update a TradingPartner.
     */
    data: XOR<TradingPartnerUpdateInput, TradingPartnerUncheckedUpdateInput>
    /**
     * Choose, which TradingPartner to update.
     */
    where: TradingPartnerWhereUniqueInput
  }

  /**
   * TradingPartner updateMany
   */
  export type TradingPartnerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradingPartners.
     */
    data: XOR<TradingPartnerUpdateManyMutationInput, TradingPartnerUncheckedUpdateManyInput>
    /**
     * Filter which TradingPartners to update
     */
    where?: TradingPartnerWhereInput
  }

  /**
   * TradingPartner upsert
   */
  export type TradingPartnerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPartnerInclude<ExtArgs> | null
    /**
     * The filter to search for the TradingPartner to update in case it exists.
     */
    where: TradingPartnerWhereUniqueInput
    /**
     * In case the TradingPartner found by the `where` argument doesn't exist, create a new TradingPartner with this data.
     */
    create: XOR<TradingPartnerCreateInput, TradingPartnerUncheckedCreateInput>
    /**
     * In case the TradingPartner was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradingPartnerUpdateInput, TradingPartnerUncheckedUpdateInput>
  }

  /**
   * TradingPartner delete
   */
  export type TradingPartnerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPartnerInclude<ExtArgs> | null
    /**
     * Filter which TradingPartner to delete.
     */
    where: TradingPartnerWhereUniqueInput
  }

  /**
   * TradingPartner deleteMany
   */
  export type TradingPartnerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingPartners to delete
     */
    where?: TradingPartnerWhereInput
  }

  /**
   * TradingPartner.transactions
   */
  export type TradingPartner$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogInclude<ExtArgs> | null
    where?: TransactionLogWhereInput
    orderBy?: TransactionLogOrderByWithRelationInput | TransactionLogOrderByWithRelationInput[]
    cursor?: TransactionLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionLogScalarFieldEnum | TransactionLogScalarFieldEnum[]
  }

  /**
   * TradingPartner without action
   */
  export type TradingPartnerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPartnerInclude<ExtArgs> | null
  }


  /**
   * Model TransactionLog
   */

  export type AggregateTransactionLog = {
    _count: TransactionLogCountAggregateOutputType | null
    _avg: TransactionLogAvgAggregateOutputType | null
    _sum: TransactionLogSumAggregateOutputType | null
    _min: TransactionLogMinAggregateOutputType | null
    _max: TransactionLogMaxAggregateOutputType | null
  }

  export type TransactionLogAvgAggregateOutputType = {
    responseCode: number | null
    retryCount: number | null
    maxRetries: number | null
    processingTimeMs: number | null
  }

  export type TransactionLogSumAggregateOutputType = {
    responseCode: number | null
    retryCount: number | null
    maxRetries: number | null
    processingTimeMs: number | null
  }

  export type TransactionLogMinAggregateOutputType = {
    id: string | null
    transactionId: string | null
    type: $Enums.TransactionType | null
    direction: $Enums.TransactionDirection | null
    status: $Enums.TransactionStatus | null
    partnerId: string | null
    payloadHash: string | null
    contentType: string | null
    requestUrl: string | null
    requestMethod: string | null
    responseCode: number | null
    responseMessage: string | null
    errorCode: string | null
    errorMessage: string | null
    retryCount: number | null
    maxRetries: number | null
    initiatedAt: Date | null
    completedAt: Date | null
    processingTimeMs: number | null
    userId: string | null
    correlationId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionLogMaxAggregateOutputType = {
    id: string | null
    transactionId: string | null
    type: $Enums.TransactionType | null
    direction: $Enums.TransactionDirection | null
    status: $Enums.TransactionStatus | null
    partnerId: string | null
    payloadHash: string | null
    contentType: string | null
    requestUrl: string | null
    requestMethod: string | null
    responseCode: number | null
    responseMessage: string | null
    errorCode: string | null
    errorMessage: string | null
    retryCount: number | null
    maxRetries: number | null
    initiatedAt: Date | null
    completedAt: Date | null
    processingTimeMs: number | null
    userId: string | null
    correlationId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionLogCountAggregateOutputType = {
    id: number
    transactionId: number
    type: number
    direction: number
    status: number
    partnerId: number
    payload: number
    payloadHash: number
    contentType: number
    requestUrl: number
    requestMethod: number
    responseCode: number
    responseMessage: number
    errorCode: number
    errorMessage: number
    retryCount: number
    maxRetries: number
    initiatedAt: number
    completedAt: number
    processingTimeMs: number
    userId: number
    correlationId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransactionLogAvgAggregateInputType = {
    responseCode?: true
    retryCount?: true
    maxRetries?: true
    processingTimeMs?: true
  }

  export type TransactionLogSumAggregateInputType = {
    responseCode?: true
    retryCount?: true
    maxRetries?: true
    processingTimeMs?: true
  }

  export type TransactionLogMinAggregateInputType = {
    id?: true
    transactionId?: true
    type?: true
    direction?: true
    status?: true
    partnerId?: true
    payloadHash?: true
    contentType?: true
    requestUrl?: true
    requestMethod?: true
    responseCode?: true
    responseMessage?: true
    errorCode?: true
    errorMessage?: true
    retryCount?: true
    maxRetries?: true
    initiatedAt?: true
    completedAt?: true
    processingTimeMs?: true
    userId?: true
    correlationId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionLogMaxAggregateInputType = {
    id?: true
    transactionId?: true
    type?: true
    direction?: true
    status?: true
    partnerId?: true
    payloadHash?: true
    contentType?: true
    requestUrl?: true
    requestMethod?: true
    responseCode?: true
    responseMessage?: true
    errorCode?: true
    errorMessage?: true
    retryCount?: true
    maxRetries?: true
    initiatedAt?: true
    completedAt?: true
    processingTimeMs?: true
    userId?: true
    correlationId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionLogCountAggregateInputType = {
    id?: true
    transactionId?: true
    type?: true
    direction?: true
    status?: true
    partnerId?: true
    payload?: true
    payloadHash?: true
    contentType?: true
    requestUrl?: true
    requestMethod?: true
    responseCode?: true
    responseMessage?: true
    errorCode?: true
    errorMessage?: true
    retryCount?: true
    maxRetries?: true
    initiatedAt?: true
    completedAt?: true
    processingTimeMs?: true
    userId?: true
    correlationId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransactionLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TransactionLog to aggregate.
     */
    where?: TransactionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionLogs to fetch.
     */
    orderBy?: TransactionLogOrderByWithRelationInput | TransactionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TransactionLogs
    **/
    _count?: true | TransactionLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionLogMaxAggregateInputType
  }

  export type GetTransactionLogAggregateType<T extends TransactionLogAggregateArgs> = {
        [P in keyof T & keyof AggregateTransactionLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransactionLog[P]>
      : GetScalarType<T[P], AggregateTransactionLog[P]>
  }




  export type TransactionLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionLogWhereInput
    orderBy?: TransactionLogOrderByWithAggregationInput | TransactionLogOrderByWithAggregationInput[]
    by: TransactionLogScalarFieldEnum[] | TransactionLogScalarFieldEnum
    having?: TransactionLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionLogCountAggregateInputType | true
    _avg?: TransactionLogAvgAggregateInputType
    _sum?: TransactionLogSumAggregateInputType
    _min?: TransactionLogMinAggregateInputType
    _max?: TransactionLogMaxAggregateInputType
  }

  export type TransactionLogGroupByOutputType = {
    id: string
    transactionId: string
    type: $Enums.TransactionType
    direction: $Enums.TransactionDirection
    status: $Enums.TransactionStatus
    partnerId: string | null
    payload: JsonValue | null
    payloadHash: string | null
    contentType: string | null
    requestUrl: string | null
    requestMethod: string | null
    responseCode: number | null
    responseMessage: string | null
    errorCode: string | null
    errorMessage: string | null
    retryCount: number
    maxRetries: number
    initiatedAt: Date
    completedAt: Date | null
    processingTimeMs: number | null
    userId: string | null
    correlationId: string | null
    createdAt: Date
    updatedAt: Date
    _count: TransactionLogCountAggregateOutputType | null
    _avg: TransactionLogAvgAggregateOutputType | null
    _sum: TransactionLogSumAggregateOutputType | null
    _min: TransactionLogMinAggregateOutputType | null
    _max: TransactionLogMaxAggregateOutputType | null
  }

  type GetTransactionLogGroupByPayload<T extends TransactionLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionLogGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionLogGroupByOutputType[P]>
        }
      >
    >


  export type TransactionLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionId?: boolean
    type?: boolean
    direction?: boolean
    status?: boolean
    partnerId?: boolean
    payload?: boolean
    payloadHash?: boolean
    contentType?: boolean
    requestUrl?: boolean
    requestMethod?: boolean
    responseCode?: boolean
    responseMessage?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    retryCount?: boolean
    maxRetries?: boolean
    initiatedAt?: boolean
    completedAt?: boolean
    processingTimeMs?: boolean
    userId?: boolean
    correlationId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    partner?: boolean | TransactionLog$partnerArgs<ExtArgs>
  }, ExtArgs["result"]["transactionLog"]>

  export type TransactionLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionId?: boolean
    type?: boolean
    direction?: boolean
    status?: boolean
    partnerId?: boolean
    payload?: boolean
    payloadHash?: boolean
    contentType?: boolean
    requestUrl?: boolean
    requestMethod?: boolean
    responseCode?: boolean
    responseMessage?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    retryCount?: boolean
    maxRetries?: boolean
    initiatedAt?: boolean
    completedAt?: boolean
    processingTimeMs?: boolean
    userId?: boolean
    correlationId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    partner?: boolean | TransactionLog$partnerArgs<ExtArgs>
  }, ExtArgs["result"]["transactionLog"]>

  export type TransactionLogSelectScalar = {
    id?: boolean
    transactionId?: boolean
    type?: boolean
    direction?: boolean
    status?: boolean
    partnerId?: boolean
    payload?: boolean
    payloadHash?: boolean
    contentType?: boolean
    requestUrl?: boolean
    requestMethod?: boolean
    responseCode?: boolean
    responseMessage?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    retryCount?: boolean
    maxRetries?: boolean
    initiatedAt?: boolean
    completedAt?: boolean
    processingTimeMs?: boolean
    userId?: boolean
    correlationId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransactionLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    partner?: boolean | TransactionLog$partnerArgs<ExtArgs>
  }
  export type TransactionLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    partner?: boolean | TransactionLog$partnerArgs<ExtArgs>
  }

  export type $TransactionLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TransactionLog"
    objects: {
      partner: Prisma.$TradingPartnerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      transactionId: string
      type: $Enums.TransactionType
      direction: $Enums.TransactionDirection
      status: $Enums.TransactionStatus
      partnerId: string | null
      payload: Prisma.JsonValue | null
      payloadHash: string | null
      contentType: string | null
      requestUrl: string | null
      requestMethod: string | null
      responseCode: number | null
      responseMessage: string | null
      errorCode: string | null
      errorMessage: string | null
      retryCount: number
      maxRetries: number
      initiatedAt: Date
      completedAt: Date | null
      processingTimeMs: number | null
      userId: string | null
      correlationId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transactionLog"]>
    composites: {}
  }

  type TransactionLogGetPayload<S extends boolean | null | undefined | TransactionLogDefaultArgs> = $Result.GetResult<Prisma.$TransactionLogPayload, S>

  type TransactionLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TransactionLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TransactionLogCountAggregateInputType | true
    }

  export interface TransactionLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TransactionLog'], meta: { name: 'TransactionLog' } }
    /**
     * Find zero or one TransactionLog that matches the filter.
     * @param {TransactionLogFindUniqueArgs} args - Arguments to find a TransactionLog
     * @example
     * // Get one TransactionLog
     * const transactionLog = await prisma.transactionLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionLogFindUniqueArgs>(args: SelectSubset<T, TransactionLogFindUniqueArgs<ExtArgs>>): Prisma__TransactionLogClient<$Result.GetResult<Prisma.$TransactionLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TransactionLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TransactionLogFindUniqueOrThrowArgs} args - Arguments to find a TransactionLog
     * @example
     * // Get one TransactionLog
     * const transactionLog = await prisma.transactionLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionLogFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionLogClient<$Result.GetResult<Prisma.$TransactionLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TransactionLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionLogFindFirstArgs} args - Arguments to find a TransactionLog
     * @example
     * // Get one TransactionLog
     * const transactionLog = await prisma.transactionLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionLogFindFirstArgs>(args?: SelectSubset<T, TransactionLogFindFirstArgs<ExtArgs>>): Prisma__TransactionLogClient<$Result.GetResult<Prisma.$TransactionLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TransactionLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionLogFindFirstOrThrowArgs} args - Arguments to find a TransactionLog
     * @example
     * // Get one TransactionLog
     * const transactionLog = await prisma.transactionLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionLogFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionLogClient<$Result.GetResult<Prisma.$TransactionLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TransactionLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TransactionLogs
     * const transactionLogs = await prisma.transactionLog.findMany()
     * 
     * // Get first 10 TransactionLogs
     * const transactionLogs = await prisma.transactionLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionLogWithIdOnly = await prisma.transactionLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionLogFindManyArgs>(args?: SelectSubset<T, TransactionLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TransactionLog.
     * @param {TransactionLogCreateArgs} args - Arguments to create a TransactionLog.
     * @example
     * // Create one TransactionLog
     * const TransactionLog = await prisma.transactionLog.create({
     *   data: {
     *     // ... data to create a TransactionLog
     *   }
     * })
     * 
     */
    create<T extends TransactionLogCreateArgs>(args: SelectSubset<T, TransactionLogCreateArgs<ExtArgs>>): Prisma__TransactionLogClient<$Result.GetResult<Prisma.$TransactionLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TransactionLogs.
     * @param {TransactionLogCreateManyArgs} args - Arguments to create many TransactionLogs.
     * @example
     * // Create many TransactionLogs
     * const transactionLog = await prisma.transactionLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionLogCreateManyArgs>(args?: SelectSubset<T, TransactionLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TransactionLogs and returns the data saved in the database.
     * @param {TransactionLogCreateManyAndReturnArgs} args - Arguments to create many TransactionLogs.
     * @example
     * // Create many TransactionLogs
     * const transactionLog = await prisma.transactionLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TransactionLogs and only return the `id`
     * const transactionLogWithIdOnly = await prisma.transactionLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionLogCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TransactionLog.
     * @param {TransactionLogDeleteArgs} args - Arguments to delete one TransactionLog.
     * @example
     * // Delete one TransactionLog
     * const TransactionLog = await prisma.transactionLog.delete({
     *   where: {
     *     // ... filter to delete one TransactionLog
     *   }
     * })
     * 
     */
    delete<T extends TransactionLogDeleteArgs>(args: SelectSubset<T, TransactionLogDeleteArgs<ExtArgs>>): Prisma__TransactionLogClient<$Result.GetResult<Prisma.$TransactionLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TransactionLog.
     * @param {TransactionLogUpdateArgs} args - Arguments to update one TransactionLog.
     * @example
     * // Update one TransactionLog
     * const transactionLog = await prisma.transactionLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionLogUpdateArgs>(args: SelectSubset<T, TransactionLogUpdateArgs<ExtArgs>>): Prisma__TransactionLogClient<$Result.GetResult<Prisma.$TransactionLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TransactionLogs.
     * @param {TransactionLogDeleteManyArgs} args - Arguments to filter TransactionLogs to delete.
     * @example
     * // Delete a few TransactionLogs
     * const { count } = await prisma.transactionLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionLogDeleteManyArgs>(args?: SelectSubset<T, TransactionLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TransactionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TransactionLogs
     * const transactionLog = await prisma.transactionLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionLogUpdateManyArgs>(args: SelectSubset<T, TransactionLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TransactionLog.
     * @param {TransactionLogUpsertArgs} args - Arguments to update or create a TransactionLog.
     * @example
     * // Update or create a TransactionLog
     * const transactionLog = await prisma.transactionLog.upsert({
     *   create: {
     *     // ... data to create a TransactionLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TransactionLog we want to update
     *   }
     * })
     */
    upsert<T extends TransactionLogUpsertArgs>(args: SelectSubset<T, TransactionLogUpsertArgs<ExtArgs>>): Prisma__TransactionLogClient<$Result.GetResult<Prisma.$TransactionLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TransactionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionLogCountArgs} args - Arguments to filter TransactionLogs to count.
     * @example
     * // Count the number of TransactionLogs
     * const count = await prisma.transactionLog.count({
     *   where: {
     *     // ... the filter for the TransactionLogs we want to count
     *   }
     * })
    **/
    count<T extends TransactionLogCountArgs>(
      args?: Subset<T, TransactionLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TransactionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionLogAggregateArgs>(args: Subset<T, TransactionLogAggregateArgs>): Prisma.PrismaPromise<GetTransactionLogAggregateType<T>>

    /**
     * Group by TransactionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionLogGroupByArgs['orderBy'] }
        : { orderBy?: TransactionLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TransactionLog model
   */
  readonly fields: TransactionLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TransactionLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    partner<T extends TransactionLog$partnerArgs<ExtArgs> = {}>(args?: Subset<T, TransactionLog$partnerArgs<ExtArgs>>): Prisma__TradingPartnerClient<$Result.GetResult<Prisma.$TradingPartnerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TransactionLog model
   */ 
  interface TransactionLogFieldRefs {
    readonly id: FieldRef<"TransactionLog", 'String'>
    readonly transactionId: FieldRef<"TransactionLog", 'String'>
    readonly type: FieldRef<"TransactionLog", 'TransactionType'>
    readonly direction: FieldRef<"TransactionLog", 'TransactionDirection'>
    readonly status: FieldRef<"TransactionLog", 'TransactionStatus'>
    readonly partnerId: FieldRef<"TransactionLog", 'String'>
    readonly payload: FieldRef<"TransactionLog", 'Json'>
    readonly payloadHash: FieldRef<"TransactionLog", 'String'>
    readonly contentType: FieldRef<"TransactionLog", 'String'>
    readonly requestUrl: FieldRef<"TransactionLog", 'String'>
    readonly requestMethod: FieldRef<"TransactionLog", 'String'>
    readonly responseCode: FieldRef<"TransactionLog", 'Int'>
    readonly responseMessage: FieldRef<"TransactionLog", 'String'>
    readonly errorCode: FieldRef<"TransactionLog", 'String'>
    readonly errorMessage: FieldRef<"TransactionLog", 'String'>
    readonly retryCount: FieldRef<"TransactionLog", 'Int'>
    readonly maxRetries: FieldRef<"TransactionLog", 'Int'>
    readonly initiatedAt: FieldRef<"TransactionLog", 'DateTime'>
    readonly completedAt: FieldRef<"TransactionLog", 'DateTime'>
    readonly processingTimeMs: FieldRef<"TransactionLog", 'Int'>
    readonly userId: FieldRef<"TransactionLog", 'String'>
    readonly correlationId: FieldRef<"TransactionLog", 'String'>
    readonly createdAt: FieldRef<"TransactionLog", 'DateTime'>
    readonly updatedAt: FieldRef<"TransactionLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TransactionLog findUnique
   */
  export type TransactionLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogInclude<ExtArgs> | null
    /**
     * Filter, which TransactionLog to fetch.
     */
    where: TransactionLogWhereUniqueInput
  }

  /**
   * TransactionLog findUniqueOrThrow
   */
  export type TransactionLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogInclude<ExtArgs> | null
    /**
     * Filter, which TransactionLog to fetch.
     */
    where: TransactionLogWhereUniqueInput
  }

  /**
   * TransactionLog findFirst
   */
  export type TransactionLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogInclude<ExtArgs> | null
    /**
     * Filter, which TransactionLog to fetch.
     */
    where?: TransactionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionLogs to fetch.
     */
    orderBy?: TransactionLogOrderByWithRelationInput | TransactionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TransactionLogs.
     */
    cursor?: TransactionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TransactionLogs.
     */
    distinct?: TransactionLogScalarFieldEnum | TransactionLogScalarFieldEnum[]
  }

  /**
   * TransactionLog findFirstOrThrow
   */
  export type TransactionLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogInclude<ExtArgs> | null
    /**
     * Filter, which TransactionLog to fetch.
     */
    where?: TransactionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionLogs to fetch.
     */
    orderBy?: TransactionLogOrderByWithRelationInput | TransactionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TransactionLogs.
     */
    cursor?: TransactionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TransactionLogs.
     */
    distinct?: TransactionLogScalarFieldEnum | TransactionLogScalarFieldEnum[]
  }

  /**
   * TransactionLog findMany
   */
  export type TransactionLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogInclude<ExtArgs> | null
    /**
     * Filter, which TransactionLogs to fetch.
     */
    where?: TransactionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionLogs to fetch.
     */
    orderBy?: TransactionLogOrderByWithRelationInput | TransactionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TransactionLogs.
     */
    cursor?: TransactionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionLogs.
     */
    skip?: number
    distinct?: TransactionLogScalarFieldEnum | TransactionLogScalarFieldEnum[]
  }

  /**
   * TransactionLog create
   */
  export type TransactionLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogInclude<ExtArgs> | null
    /**
     * The data needed to create a TransactionLog.
     */
    data: XOR<TransactionLogCreateInput, TransactionLogUncheckedCreateInput>
  }

  /**
   * TransactionLog createMany
   */
  export type TransactionLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TransactionLogs.
     */
    data: TransactionLogCreateManyInput | TransactionLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TransactionLog createManyAndReturn
   */
  export type TransactionLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TransactionLogs.
     */
    data: TransactionLogCreateManyInput | TransactionLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TransactionLog update
   */
  export type TransactionLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogInclude<ExtArgs> | null
    /**
     * The data needed to update a TransactionLog.
     */
    data: XOR<TransactionLogUpdateInput, TransactionLogUncheckedUpdateInput>
    /**
     * Choose, which TransactionLog to update.
     */
    where: TransactionLogWhereUniqueInput
  }

  /**
   * TransactionLog updateMany
   */
  export type TransactionLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TransactionLogs.
     */
    data: XOR<TransactionLogUpdateManyMutationInput, TransactionLogUncheckedUpdateManyInput>
    /**
     * Filter which TransactionLogs to update
     */
    where?: TransactionLogWhereInput
  }

  /**
   * TransactionLog upsert
   */
  export type TransactionLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogInclude<ExtArgs> | null
    /**
     * The filter to search for the TransactionLog to update in case it exists.
     */
    where: TransactionLogWhereUniqueInput
    /**
     * In case the TransactionLog found by the `where` argument doesn't exist, create a new TransactionLog with this data.
     */
    create: XOR<TransactionLogCreateInput, TransactionLogUncheckedCreateInput>
    /**
     * In case the TransactionLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionLogUpdateInput, TransactionLogUncheckedUpdateInput>
  }

  /**
   * TransactionLog delete
   */
  export type TransactionLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogInclude<ExtArgs> | null
    /**
     * Filter which TransactionLog to delete.
     */
    where: TransactionLogWhereUniqueInput
  }

  /**
   * TransactionLog deleteMany
   */
  export type TransactionLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TransactionLogs to delete
     */
    where?: TransactionLogWhereInput
  }

  /**
   * TransactionLog.partner
   */
  export type TransactionLog$partnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPartner
     */
    select?: TradingPartnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPartnerInclude<ExtArgs> | null
    where?: TradingPartnerWhereInput
  }

  /**
   * TransactionLog without action
   */
  export type TransactionLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionLog
     */
    select?: TransactionLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionLogInclude<ExtArgs> | null
  }


  /**
   * Model NetworkParticipant
   */

  export type AggregateNetworkParticipant = {
    _count: NetworkParticipantCountAggregateOutputType | null
    _min: NetworkParticipantMinAggregateOutputType | null
    _max: NetworkParticipantMaxAggregateOutputType | null
  }

  export type NetworkParticipantMinAggregateOutputType = {
    id: string | null
    network: $Enums.HealthcareNetwork | null
    participantId: string | null
    status: $Enums.ParticipantStatus | null
    organizationName: string | null
    organizationOid: string | null
    npi: string | null
    queryEndpoint: string | null
    retrieveEndpoint: string | null
    submitEndpoint: string | null
    tefcaRole: string | null
    carequalityId: string | null
    implementerOid: string | null
    commonwellId: string | null
    commonwellOrgId: string | null
    enrollmentDate: Date | null
    lastVerified: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NetworkParticipantMaxAggregateOutputType = {
    id: string | null
    network: $Enums.HealthcareNetwork | null
    participantId: string | null
    status: $Enums.ParticipantStatus | null
    organizationName: string | null
    organizationOid: string | null
    npi: string | null
    queryEndpoint: string | null
    retrieveEndpoint: string | null
    submitEndpoint: string | null
    tefcaRole: string | null
    carequalityId: string | null
    implementerOid: string | null
    commonwellId: string | null
    commonwellOrgId: string | null
    enrollmentDate: Date | null
    lastVerified: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NetworkParticipantCountAggregateOutputType = {
    id: number
    network: number
    participantId: number
    status: number
    organizationName: number
    organizationOid: number
    npi: number
    capabilities: number
    supportedPurposes: number
    queryEndpoint: number
    retrieveEndpoint: number
    submitEndpoint: number
    certificates: number
    tefcaRole: number
    carequalityId: number
    implementerOid: number
    commonwellId: number
    commonwellOrgId: number
    enrollmentDate: number
    lastVerified: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NetworkParticipantMinAggregateInputType = {
    id?: true
    network?: true
    participantId?: true
    status?: true
    organizationName?: true
    organizationOid?: true
    npi?: true
    queryEndpoint?: true
    retrieveEndpoint?: true
    submitEndpoint?: true
    tefcaRole?: true
    carequalityId?: true
    implementerOid?: true
    commonwellId?: true
    commonwellOrgId?: true
    enrollmentDate?: true
    lastVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NetworkParticipantMaxAggregateInputType = {
    id?: true
    network?: true
    participantId?: true
    status?: true
    organizationName?: true
    organizationOid?: true
    npi?: true
    queryEndpoint?: true
    retrieveEndpoint?: true
    submitEndpoint?: true
    tefcaRole?: true
    carequalityId?: true
    implementerOid?: true
    commonwellId?: true
    commonwellOrgId?: true
    enrollmentDate?: true
    lastVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NetworkParticipantCountAggregateInputType = {
    id?: true
    network?: true
    participantId?: true
    status?: true
    organizationName?: true
    organizationOid?: true
    npi?: true
    capabilities?: true
    supportedPurposes?: true
    queryEndpoint?: true
    retrieveEndpoint?: true
    submitEndpoint?: true
    certificates?: true
    tefcaRole?: true
    carequalityId?: true
    implementerOid?: true
    commonwellId?: true
    commonwellOrgId?: true
    enrollmentDate?: true
    lastVerified?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NetworkParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NetworkParticipant to aggregate.
     */
    where?: NetworkParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NetworkParticipants to fetch.
     */
    orderBy?: NetworkParticipantOrderByWithRelationInput | NetworkParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NetworkParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NetworkParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NetworkParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NetworkParticipants
    **/
    _count?: true | NetworkParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NetworkParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NetworkParticipantMaxAggregateInputType
  }

  export type GetNetworkParticipantAggregateType<T extends NetworkParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateNetworkParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNetworkParticipant[P]>
      : GetScalarType<T[P], AggregateNetworkParticipant[P]>
  }




  export type NetworkParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NetworkParticipantWhereInput
    orderBy?: NetworkParticipantOrderByWithAggregationInput | NetworkParticipantOrderByWithAggregationInput[]
    by: NetworkParticipantScalarFieldEnum[] | NetworkParticipantScalarFieldEnum
    having?: NetworkParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NetworkParticipantCountAggregateInputType | true
    _min?: NetworkParticipantMinAggregateInputType
    _max?: NetworkParticipantMaxAggregateInputType
  }

  export type NetworkParticipantGroupByOutputType = {
    id: string
    network: $Enums.HealthcareNetwork
    participantId: string
    status: $Enums.ParticipantStatus
    organizationName: string
    organizationOid: string | null
    npi: string | null
    capabilities: JsonValue | null
    supportedPurposes: string[]
    queryEndpoint: string | null
    retrieveEndpoint: string | null
    submitEndpoint: string | null
    certificates: JsonValue | null
    tefcaRole: string | null
    carequalityId: string | null
    implementerOid: string | null
    commonwellId: string | null
    commonwellOrgId: string | null
    enrollmentDate: Date | null
    lastVerified: Date | null
    createdAt: Date
    updatedAt: Date
    _count: NetworkParticipantCountAggregateOutputType | null
    _min: NetworkParticipantMinAggregateOutputType | null
    _max: NetworkParticipantMaxAggregateOutputType | null
  }

  type GetNetworkParticipantGroupByPayload<T extends NetworkParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NetworkParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NetworkParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NetworkParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], NetworkParticipantGroupByOutputType[P]>
        }
      >
    >


  export type NetworkParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    participantId?: boolean
    status?: boolean
    organizationName?: boolean
    organizationOid?: boolean
    npi?: boolean
    capabilities?: boolean
    supportedPurposes?: boolean
    queryEndpoint?: boolean
    retrieveEndpoint?: boolean
    submitEndpoint?: boolean
    certificates?: boolean
    tefcaRole?: boolean
    carequalityId?: boolean
    implementerOid?: boolean
    commonwellId?: boolean
    commonwellOrgId?: boolean
    enrollmentDate?: boolean
    lastVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["networkParticipant"]>

  export type NetworkParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    network?: boolean
    participantId?: boolean
    status?: boolean
    organizationName?: boolean
    organizationOid?: boolean
    npi?: boolean
    capabilities?: boolean
    supportedPurposes?: boolean
    queryEndpoint?: boolean
    retrieveEndpoint?: boolean
    submitEndpoint?: boolean
    certificates?: boolean
    tefcaRole?: boolean
    carequalityId?: boolean
    implementerOid?: boolean
    commonwellId?: boolean
    commonwellOrgId?: boolean
    enrollmentDate?: boolean
    lastVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["networkParticipant"]>

  export type NetworkParticipantSelectScalar = {
    id?: boolean
    network?: boolean
    participantId?: boolean
    status?: boolean
    organizationName?: boolean
    organizationOid?: boolean
    npi?: boolean
    capabilities?: boolean
    supportedPurposes?: boolean
    queryEndpoint?: boolean
    retrieveEndpoint?: boolean
    submitEndpoint?: boolean
    certificates?: boolean
    tefcaRole?: boolean
    carequalityId?: boolean
    implementerOid?: boolean
    commonwellId?: boolean
    commonwellOrgId?: boolean
    enrollmentDate?: boolean
    lastVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $NetworkParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NetworkParticipant"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      network: $Enums.HealthcareNetwork
      participantId: string
      status: $Enums.ParticipantStatus
      organizationName: string
      organizationOid: string | null
      npi: string | null
      capabilities: Prisma.JsonValue | null
      supportedPurposes: string[]
      queryEndpoint: string | null
      retrieveEndpoint: string | null
      submitEndpoint: string | null
      certificates: Prisma.JsonValue | null
      tefcaRole: string | null
      carequalityId: string | null
      implementerOid: string | null
      commonwellId: string | null
      commonwellOrgId: string | null
      enrollmentDate: Date | null
      lastVerified: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["networkParticipant"]>
    composites: {}
  }

  type NetworkParticipantGetPayload<S extends boolean | null | undefined | NetworkParticipantDefaultArgs> = $Result.GetResult<Prisma.$NetworkParticipantPayload, S>

  type NetworkParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NetworkParticipantFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NetworkParticipantCountAggregateInputType | true
    }

  export interface NetworkParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NetworkParticipant'], meta: { name: 'NetworkParticipant' } }
    /**
     * Find zero or one NetworkParticipant that matches the filter.
     * @param {NetworkParticipantFindUniqueArgs} args - Arguments to find a NetworkParticipant
     * @example
     * // Get one NetworkParticipant
     * const networkParticipant = await prisma.networkParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NetworkParticipantFindUniqueArgs>(args: SelectSubset<T, NetworkParticipantFindUniqueArgs<ExtArgs>>): Prisma__NetworkParticipantClient<$Result.GetResult<Prisma.$NetworkParticipantPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NetworkParticipant that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NetworkParticipantFindUniqueOrThrowArgs} args - Arguments to find a NetworkParticipant
     * @example
     * // Get one NetworkParticipant
     * const networkParticipant = await prisma.networkParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NetworkParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, NetworkParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NetworkParticipantClient<$Result.GetResult<Prisma.$NetworkParticipantPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NetworkParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NetworkParticipantFindFirstArgs} args - Arguments to find a NetworkParticipant
     * @example
     * // Get one NetworkParticipant
     * const networkParticipant = await prisma.networkParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NetworkParticipantFindFirstArgs>(args?: SelectSubset<T, NetworkParticipantFindFirstArgs<ExtArgs>>): Prisma__NetworkParticipantClient<$Result.GetResult<Prisma.$NetworkParticipantPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NetworkParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NetworkParticipantFindFirstOrThrowArgs} args - Arguments to find a NetworkParticipant
     * @example
     * // Get one NetworkParticipant
     * const networkParticipant = await prisma.networkParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NetworkParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, NetworkParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__NetworkParticipantClient<$Result.GetResult<Prisma.$NetworkParticipantPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NetworkParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NetworkParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NetworkParticipants
     * const networkParticipants = await prisma.networkParticipant.findMany()
     * 
     * // Get first 10 NetworkParticipants
     * const networkParticipants = await prisma.networkParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const networkParticipantWithIdOnly = await prisma.networkParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NetworkParticipantFindManyArgs>(args?: SelectSubset<T, NetworkParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NetworkParticipantPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NetworkParticipant.
     * @param {NetworkParticipantCreateArgs} args - Arguments to create a NetworkParticipant.
     * @example
     * // Create one NetworkParticipant
     * const NetworkParticipant = await prisma.networkParticipant.create({
     *   data: {
     *     // ... data to create a NetworkParticipant
     *   }
     * })
     * 
     */
    create<T extends NetworkParticipantCreateArgs>(args: SelectSubset<T, NetworkParticipantCreateArgs<ExtArgs>>): Prisma__NetworkParticipantClient<$Result.GetResult<Prisma.$NetworkParticipantPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NetworkParticipants.
     * @param {NetworkParticipantCreateManyArgs} args - Arguments to create many NetworkParticipants.
     * @example
     * // Create many NetworkParticipants
     * const networkParticipant = await prisma.networkParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NetworkParticipantCreateManyArgs>(args?: SelectSubset<T, NetworkParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NetworkParticipants and returns the data saved in the database.
     * @param {NetworkParticipantCreateManyAndReturnArgs} args - Arguments to create many NetworkParticipants.
     * @example
     * // Create many NetworkParticipants
     * const networkParticipant = await prisma.networkParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NetworkParticipants and only return the `id`
     * const networkParticipantWithIdOnly = await prisma.networkParticipant.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NetworkParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, NetworkParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NetworkParticipantPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NetworkParticipant.
     * @param {NetworkParticipantDeleteArgs} args - Arguments to delete one NetworkParticipant.
     * @example
     * // Delete one NetworkParticipant
     * const NetworkParticipant = await prisma.networkParticipant.delete({
     *   where: {
     *     // ... filter to delete one NetworkParticipant
     *   }
     * })
     * 
     */
    delete<T extends NetworkParticipantDeleteArgs>(args: SelectSubset<T, NetworkParticipantDeleteArgs<ExtArgs>>): Prisma__NetworkParticipantClient<$Result.GetResult<Prisma.$NetworkParticipantPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NetworkParticipant.
     * @param {NetworkParticipantUpdateArgs} args - Arguments to update one NetworkParticipant.
     * @example
     * // Update one NetworkParticipant
     * const networkParticipant = await prisma.networkParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NetworkParticipantUpdateArgs>(args: SelectSubset<T, NetworkParticipantUpdateArgs<ExtArgs>>): Prisma__NetworkParticipantClient<$Result.GetResult<Prisma.$NetworkParticipantPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NetworkParticipants.
     * @param {NetworkParticipantDeleteManyArgs} args - Arguments to filter NetworkParticipants to delete.
     * @example
     * // Delete a few NetworkParticipants
     * const { count } = await prisma.networkParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NetworkParticipantDeleteManyArgs>(args?: SelectSubset<T, NetworkParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NetworkParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NetworkParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NetworkParticipants
     * const networkParticipant = await prisma.networkParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NetworkParticipantUpdateManyArgs>(args: SelectSubset<T, NetworkParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NetworkParticipant.
     * @param {NetworkParticipantUpsertArgs} args - Arguments to update or create a NetworkParticipant.
     * @example
     * // Update or create a NetworkParticipant
     * const networkParticipant = await prisma.networkParticipant.upsert({
     *   create: {
     *     // ... data to create a NetworkParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NetworkParticipant we want to update
     *   }
     * })
     */
    upsert<T extends NetworkParticipantUpsertArgs>(args: SelectSubset<T, NetworkParticipantUpsertArgs<ExtArgs>>): Prisma__NetworkParticipantClient<$Result.GetResult<Prisma.$NetworkParticipantPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NetworkParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NetworkParticipantCountArgs} args - Arguments to filter NetworkParticipants to count.
     * @example
     * // Count the number of NetworkParticipants
     * const count = await prisma.networkParticipant.count({
     *   where: {
     *     // ... the filter for the NetworkParticipants we want to count
     *   }
     * })
    **/
    count<T extends NetworkParticipantCountArgs>(
      args?: Subset<T, NetworkParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NetworkParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NetworkParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NetworkParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NetworkParticipantAggregateArgs>(args: Subset<T, NetworkParticipantAggregateArgs>): Prisma.PrismaPromise<GetNetworkParticipantAggregateType<T>>

    /**
     * Group by NetworkParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NetworkParticipantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NetworkParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NetworkParticipantGroupByArgs['orderBy'] }
        : { orderBy?: NetworkParticipantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NetworkParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNetworkParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NetworkParticipant model
   */
  readonly fields: NetworkParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NetworkParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NetworkParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NetworkParticipant model
   */ 
  interface NetworkParticipantFieldRefs {
    readonly id: FieldRef<"NetworkParticipant", 'String'>
    readonly network: FieldRef<"NetworkParticipant", 'HealthcareNetwork'>
    readonly participantId: FieldRef<"NetworkParticipant", 'String'>
    readonly status: FieldRef<"NetworkParticipant", 'ParticipantStatus'>
    readonly organizationName: FieldRef<"NetworkParticipant", 'String'>
    readonly organizationOid: FieldRef<"NetworkParticipant", 'String'>
    readonly npi: FieldRef<"NetworkParticipant", 'String'>
    readonly capabilities: FieldRef<"NetworkParticipant", 'Json'>
    readonly supportedPurposes: FieldRef<"NetworkParticipant", 'String[]'>
    readonly queryEndpoint: FieldRef<"NetworkParticipant", 'String'>
    readonly retrieveEndpoint: FieldRef<"NetworkParticipant", 'String'>
    readonly submitEndpoint: FieldRef<"NetworkParticipant", 'String'>
    readonly certificates: FieldRef<"NetworkParticipant", 'Json'>
    readonly tefcaRole: FieldRef<"NetworkParticipant", 'String'>
    readonly carequalityId: FieldRef<"NetworkParticipant", 'String'>
    readonly implementerOid: FieldRef<"NetworkParticipant", 'String'>
    readonly commonwellId: FieldRef<"NetworkParticipant", 'String'>
    readonly commonwellOrgId: FieldRef<"NetworkParticipant", 'String'>
    readonly enrollmentDate: FieldRef<"NetworkParticipant", 'DateTime'>
    readonly lastVerified: FieldRef<"NetworkParticipant", 'DateTime'>
    readonly createdAt: FieldRef<"NetworkParticipant", 'DateTime'>
    readonly updatedAt: FieldRef<"NetworkParticipant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NetworkParticipant findUnique
   */
  export type NetworkParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NetworkParticipant
     */
    select?: NetworkParticipantSelect<ExtArgs> | null
    /**
     * Filter, which NetworkParticipant to fetch.
     */
    where: NetworkParticipantWhereUniqueInput
  }

  /**
   * NetworkParticipant findUniqueOrThrow
   */
  export type NetworkParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NetworkParticipant
     */
    select?: NetworkParticipantSelect<ExtArgs> | null
    /**
     * Filter, which NetworkParticipant to fetch.
     */
    where: NetworkParticipantWhereUniqueInput
  }

  /**
   * NetworkParticipant findFirst
   */
  export type NetworkParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NetworkParticipant
     */
    select?: NetworkParticipantSelect<ExtArgs> | null
    /**
     * Filter, which NetworkParticipant to fetch.
     */
    where?: NetworkParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NetworkParticipants to fetch.
     */
    orderBy?: NetworkParticipantOrderByWithRelationInput | NetworkParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NetworkParticipants.
     */
    cursor?: NetworkParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NetworkParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NetworkParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NetworkParticipants.
     */
    distinct?: NetworkParticipantScalarFieldEnum | NetworkParticipantScalarFieldEnum[]
  }

  /**
   * NetworkParticipant findFirstOrThrow
   */
  export type NetworkParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NetworkParticipant
     */
    select?: NetworkParticipantSelect<ExtArgs> | null
    /**
     * Filter, which NetworkParticipant to fetch.
     */
    where?: NetworkParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NetworkParticipants to fetch.
     */
    orderBy?: NetworkParticipantOrderByWithRelationInput | NetworkParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NetworkParticipants.
     */
    cursor?: NetworkParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NetworkParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NetworkParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NetworkParticipants.
     */
    distinct?: NetworkParticipantScalarFieldEnum | NetworkParticipantScalarFieldEnum[]
  }

  /**
   * NetworkParticipant findMany
   */
  export type NetworkParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NetworkParticipant
     */
    select?: NetworkParticipantSelect<ExtArgs> | null
    /**
     * Filter, which NetworkParticipants to fetch.
     */
    where?: NetworkParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NetworkParticipants to fetch.
     */
    orderBy?: NetworkParticipantOrderByWithRelationInput | NetworkParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NetworkParticipants.
     */
    cursor?: NetworkParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NetworkParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NetworkParticipants.
     */
    skip?: number
    distinct?: NetworkParticipantScalarFieldEnum | NetworkParticipantScalarFieldEnum[]
  }

  /**
   * NetworkParticipant create
   */
  export type NetworkParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NetworkParticipant
     */
    select?: NetworkParticipantSelect<ExtArgs> | null
    /**
     * The data needed to create a NetworkParticipant.
     */
    data: XOR<NetworkParticipantCreateInput, NetworkParticipantUncheckedCreateInput>
  }

  /**
   * NetworkParticipant createMany
   */
  export type NetworkParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NetworkParticipants.
     */
    data: NetworkParticipantCreateManyInput | NetworkParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NetworkParticipant createManyAndReturn
   */
  export type NetworkParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NetworkParticipant
     */
    select?: NetworkParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NetworkParticipants.
     */
    data: NetworkParticipantCreateManyInput | NetworkParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NetworkParticipant update
   */
  export type NetworkParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NetworkParticipant
     */
    select?: NetworkParticipantSelect<ExtArgs> | null
    /**
     * The data needed to update a NetworkParticipant.
     */
    data: XOR<NetworkParticipantUpdateInput, NetworkParticipantUncheckedUpdateInput>
    /**
     * Choose, which NetworkParticipant to update.
     */
    where: NetworkParticipantWhereUniqueInput
  }

  /**
   * NetworkParticipant updateMany
   */
  export type NetworkParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NetworkParticipants.
     */
    data: XOR<NetworkParticipantUpdateManyMutationInput, NetworkParticipantUncheckedUpdateManyInput>
    /**
     * Filter which NetworkParticipants to update
     */
    where?: NetworkParticipantWhereInput
  }

  /**
   * NetworkParticipant upsert
   */
  export type NetworkParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NetworkParticipant
     */
    select?: NetworkParticipantSelect<ExtArgs> | null
    /**
     * The filter to search for the NetworkParticipant to update in case it exists.
     */
    where: NetworkParticipantWhereUniqueInput
    /**
     * In case the NetworkParticipant found by the `where` argument doesn't exist, create a new NetworkParticipant with this data.
     */
    create: XOR<NetworkParticipantCreateInput, NetworkParticipantUncheckedCreateInput>
    /**
     * In case the NetworkParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NetworkParticipantUpdateInput, NetworkParticipantUncheckedUpdateInput>
  }

  /**
   * NetworkParticipant delete
   */
  export type NetworkParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NetworkParticipant
     */
    select?: NetworkParticipantSelect<ExtArgs> | null
    /**
     * Filter which NetworkParticipant to delete.
     */
    where: NetworkParticipantWhereUniqueInput
  }

  /**
   * NetworkParticipant deleteMany
   */
  export type NetworkParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NetworkParticipants to delete
     */
    where?: NetworkParticipantWhereInput
  }

  /**
   * NetworkParticipant without action
   */
  export type NetworkParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NetworkParticipant
     */
    select?: NetworkParticipantSelect<ExtArgs> | null
  }


  /**
   * Model DirectAddress
   */

  export type AggregateDirectAddress = {
    _count: DirectAddressCountAggregateOutputType | null
    _avg: DirectAddressAvgAggregateOutputType | null
    _sum: DirectAddressSumAggregateOutputType | null
    _min: DirectAddressMinAggregateOutputType | null
    _max: DirectAddressMaxAggregateOutputType | null
  }

  export type DirectAddressAvgAggregateOutputType = {
    messagesSent: number | null
    messagesReceived: number | null
  }

  export type DirectAddressSumAggregateOutputType = {
    messagesSent: number | null
    messagesReceived: number | null
  }

  export type DirectAddressMinAggregateOutputType = {
    id: string | null
    address: string | null
    certificate: string | null
    privateKey: string | null
    domain: string | null
    status: $Enums.DirectAddressStatus | null
    ownerType: $Enums.DirectAddressOwner | null
    ownerId: string | null
    ownerName: string | null
    trustAnchor: string | null
    trustBundle: string | null
    certificateExpiry: Date | null
    issuerDn: string | null
    subjectDn: string | null
    hispId: string | null
    hispName: string | null
    messagesSent: number | null
    messagesReceived: number | null
    lastActivity: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DirectAddressMaxAggregateOutputType = {
    id: string | null
    address: string | null
    certificate: string | null
    privateKey: string | null
    domain: string | null
    status: $Enums.DirectAddressStatus | null
    ownerType: $Enums.DirectAddressOwner | null
    ownerId: string | null
    ownerName: string | null
    trustAnchor: string | null
    trustBundle: string | null
    certificateExpiry: Date | null
    issuerDn: string | null
    subjectDn: string | null
    hispId: string | null
    hispName: string | null
    messagesSent: number | null
    messagesReceived: number | null
    lastActivity: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DirectAddressCountAggregateOutputType = {
    id: number
    address: number
    certificate: number
    privateKey: number
    domain: number
    status: number
    ownerType: number
    ownerId: number
    ownerName: number
    trustAnchor: number
    trustBundle: number
    certificateExpiry: number
    issuerDn: number
    subjectDn: number
    hispId: number
    hispName: number
    messagesSent: number
    messagesReceived: number
    lastActivity: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DirectAddressAvgAggregateInputType = {
    messagesSent?: true
    messagesReceived?: true
  }

  export type DirectAddressSumAggregateInputType = {
    messagesSent?: true
    messagesReceived?: true
  }

  export type DirectAddressMinAggregateInputType = {
    id?: true
    address?: true
    certificate?: true
    privateKey?: true
    domain?: true
    status?: true
    ownerType?: true
    ownerId?: true
    ownerName?: true
    trustAnchor?: true
    trustBundle?: true
    certificateExpiry?: true
    issuerDn?: true
    subjectDn?: true
    hispId?: true
    hispName?: true
    messagesSent?: true
    messagesReceived?: true
    lastActivity?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DirectAddressMaxAggregateInputType = {
    id?: true
    address?: true
    certificate?: true
    privateKey?: true
    domain?: true
    status?: true
    ownerType?: true
    ownerId?: true
    ownerName?: true
    trustAnchor?: true
    trustBundle?: true
    certificateExpiry?: true
    issuerDn?: true
    subjectDn?: true
    hispId?: true
    hispName?: true
    messagesSent?: true
    messagesReceived?: true
    lastActivity?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DirectAddressCountAggregateInputType = {
    id?: true
    address?: true
    certificate?: true
    privateKey?: true
    domain?: true
    status?: true
    ownerType?: true
    ownerId?: true
    ownerName?: true
    trustAnchor?: true
    trustBundle?: true
    certificateExpiry?: true
    issuerDn?: true
    subjectDn?: true
    hispId?: true
    hispName?: true
    messagesSent?: true
    messagesReceived?: true
    lastActivity?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DirectAddressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DirectAddress to aggregate.
     */
    where?: DirectAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectAddresses to fetch.
     */
    orderBy?: DirectAddressOrderByWithRelationInput | DirectAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DirectAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectAddresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DirectAddresses
    **/
    _count?: true | DirectAddressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DirectAddressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DirectAddressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DirectAddressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DirectAddressMaxAggregateInputType
  }

  export type GetDirectAddressAggregateType<T extends DirectAddressAggregateArgs> = {
        [P in keyof T & keyof AggregateDirectAddress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDirectAddress[P]>
      : GetScalarType<T[P], AggregateDirectAddress[P]>
  }




  export type DirectAddressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DirectAddressWhereInput
    orderBy?: DirectAddressOrderByWithAggregationInput | DirectAddressOrderByWithAggregationInput[]
    by: DirectAddressScalarFieldEnum[] | DirectAddressScalarFieldEnum
    having?: DirectAddressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DirectAddressCountAggregateInputType | true
    _avg?: DirectAddressAvgAggregateInputType
    _sum?: DirectAddressSumAggregateInputType
    _min?: DirectAddressMinAggregateInputType
    _max?: DirectAddressMaxAggregateInputType
  }

  export type DirectAddressGroupByOutputType = {
    id: string
    address: string
    certificate: string | null
    privateKey: string | null
    domain: string
    status: $Enums.DirectAddressStatus
    ownerType: $Enums.DirectAddressOwner
    ownerId: string
    ownerName: string | null
    trustAnchor: string | null
    trustBundle: string | null
    certificateExpiry: Date | null
    issuerDn: string | null
    subjectDn: string | null
    hispId: string | null
    hispName: string | null
    messagesSent: number
    messagesReceived: number
    lastActivity: Date | null
    createdAt: Date
    updatedAt: Date
    _count: DirectAddressCountAggregateOutputType | null
    _avg: DirectAddressAvgAggregateOutputType | null
    _sum: DirectAddressSumAggregateOutputType | null
    _min: DirectAddressMinAggregateOutputType | null
    _max: DirectAddressMaxAggregateOutputType | null
  }

  type GetDirectAddressGroupByPayload<T extends DirectAddressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DirectAddressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DirectAddressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DirectAddressGroupByOutputType[P]>
            : GetScalarType<T[P], DirectAddressGroupByOutputType[P]>
        }
      >
    >


  export type DirectAddressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    certificate?: boolean
    privateKey?: boolean
    domain?: boolean
    status?: boolean
    ownerType?: boolean
    ownerId?: boolean
    ownerName?: boolean
    trustAnchor?: boolean
    trustBundle?: boolean
    certificateExpiry?: boolean
    issuerDn?: boolean
    subjectDn?: boolean
    hispId?: boolean
    hispName?: boolean
    messagesSent?: boolean
    messagesReceived?: boolean
    lastActivity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["directAddress"]>

  export type DirectAddressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    certificate?: boolean
    privateKey?: boolean
    domain?: boolean
    status?: boolean
    ownerType?: boolean
    ownerId?: boolean
    ownerName?: boolean
    trustAnchor?: boolean
    trustBundle?: boolean
    certificateExpiry?: boolean
    issuerDn?: boolean
    subjectDn?: boolean
    hispId?: boolean
    hispName?: boolean
    messagesSent?: boolean
    messagesReceived?: boolean
    lastActivity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["directAddress"]>

  export type DirectAddressSelectScalar = {
    id?: boolean
    address?: boolean
    certificate?: boolean
    privateKey?: boolean
    domain?: boolean
    status?: boolean
    ownerType?: boolean
    ownerId?: boolean
    ownerName?: boolean
    trustAnchor?: boolean
    trustBundle?: boolean
    certificateExpiry?: boolean
    issuerDn?: boolean
    subjectDn?: boolean
    hispId?: boolean
    hispName?: boolean
    messagesSent?: boolean
    messagesReceived?: boolean
    lastActivity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $DirectAddressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DirectAddress"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      address: string
      certificate: string | null
      privateKey: string | null
      domain: string
      status: $Enums.DirectAddressStatus
      ownerType: $Enums.DirectAddressOwner
      ownerId: string
      ownerName: string | null
      trustAnchor: string | null
      trustBundle: string | null
      certificateExpiry: Date | null
      issuerDn: string | null
      subjectDn: string | null
      hispId: string | null
      hispName: string | null
      messagesSent: number
      messagesReceived: number
      lastActivity: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["directAddress"]>
    composites: {}
  }

  type DirectAddressGetPayload<S extends boolean | null | undefined | DirectAddressDefaultArgs> = $Result.GetResult<Prisma.$DirectAddressPayload, S>

  type DirectAddressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DirectAddressFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DirectAddressCountAggregateInputType | true
    }

  export interface DirectAddressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DirectAddress'], meta: { name: 'DirectAddress' } }
    /**
     * Find zero or one DirectAddress that matches the filter.
     * @param {DirectAddressFindUniqueArgs} args - Arguments to find a DirectAddress
     * @example
     * // Get one DirectAddress
     * const directAddress = await prisma.directAddress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DirectAddressFindUniqueArgs>(args: SelectSubset<T, DirectAddressFindUniqueArgs<ExtArgs>>): Prisma__DirectAddressClient<$Result.GetResult<Prisma.$DirectAddressPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DirectAddress that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DirectAddressFindUniqueOrThrowArgs} args - Arguments to find a DirectAddress
     * @example
     * // Get one DirectAddress
     * const directAddress = await prisma.directAddress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DirectAddressFindUniqueOrThrowArgs>(args: SelectSubset<T, DirectAddressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DirectAddressClient<$Result.GetResult<Prisma.$DirectAddressPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DirectAddress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectAddressFindFirstArgs} args - Arguments to find a DirectAddress
     * @example
     * // Get one DirectAddress
     * const directAddress = await prisma.directAddress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DirectAddressFindFirstArgs>(args?: SelectSubset<T, DirectAddressFindFirstArgs<ExtArgs>>): Prisma__DirectAddressClient<$Result.GetResult<Prisma.$DirectAddressPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DirectAddress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectAddressFindFirstOrThrowArgs} args - Arguments to find a DirectAddress
     * @example
     * // Get one DirectAddress
     * const directAddress = await prisma.directAddress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DirectAddressFindFirstOrThrowArgs>(args?: SelectSubset<T, DirectAddressFindFirstOrThrowArgs<ExtArgs>>): Prisma__DirectAddressClient<$Result.GetResult<Prisma.$DirectAddressPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DirectAddresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectAddressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DirectAddresses
     * const directAddresses = await prisma.directAddress.findMany()
     * 
     * // Get first 10 DirectAddresses
     * const directAddresses = await prisma.directAddress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const directAddressWithIdOnly = await prisma.directAddress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DirectAddressFindManyArgs>(args?: SelectSubset<T, DirectAddressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DirectAddressPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DirectAddress.
     * @param {DirectAddressCreateArgs} args - Arguments to create a DirectAddress.
     * @example
     * // Create one DirectAddress
     * const DirectAddress = await prisma.directAddress.create({
     *   data: {
     *     // ... data to create a DirectAddress
     *   }
     * })
     * 
     */
    create<T extends DirectAddressCreateArgs>(args: SelectSubset<T, DirectAddressCreateArgs<ExtArgs>>): Prisma__DirectAddressClient<$Result.GetResult<Prisma.$DirectAddressPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DirectAddresses.
     * @param {DirectAddressCreateManyArgs} args - Arguments to create many DirectAddresses.
     * @example
     * // Create many DirectAddresses
     * const directAddress = await prisma.directAddress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DirectAddressCreateManyArgs>(args?: SelectSubset<T, DirectAddressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DirectAddresses and returns the data saved in the database.
     * @param {DirectAddressCreateManyAndReturnArgs} args - Arguments to create many DirectAddresses.
     * @example
     * // Create many DirectAddresses
     * const directAddress = await prisma.directAddress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DirectAddresses and only return the `id`
     * const directAddressWithIdOnly = await prisma.directAddress.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DirectAddressCreateManyAndReturnArgs>(args?: SelectSubset<T, DirectAddressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DirectAddressPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DirectAddress.
     * @param {DirectAddressDeleteArgs} args - Arguments to delete one DirectAddress.
     * @example
     * // Delete one DirectAddress
     * const DirectAddress = await prisma.directAddress.delete({
     *   where: {
     *     // ... filter to delete one DirectAddress
     *   }
     * })
     * 
     */
    delete<T extends DirectAddressDeleteArgs>(args: SelectSubset<T, DirectAddressDeleteArgs<ExtArgs>>): Prisma__DirectAddressClient<$Result.GetResult<Prisma.$DirectAddressPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DirectAddress.
     * @param {DirectAddressUpdateArgs} args - Arguments to update one DirectAddress.
     * @example
     * // Update one DirectAddress
     * const directAddress = await prisma.directAddress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DirectAddressUpdateArgs>(args: SelectSubset<T, DirectAddressUpdateArgs<ExtArgs>>): Prisma__DirectAddressClient<$Result.GetResult<Prisma.$DirectAddressPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DirectAddresses.
     * @param {DirectAddressDeleteManyArgs} args - Arguments to filter DirectAddresses to delete.
     * @example
     * // Delete a few DirectAddresses
     * const { count } = await prisma.directAddress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DirectAddressDeleteManyArgs>(args?: SelectSubset<T, DirectAddressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DirectAddresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectAddressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DirectAddresses
     * const directAddress = await prisma.directAddress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DirectAddressUpdateManyArgs>(args: SelectSubset<T, DirectAddressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DirectAddress.
     * @param {DirectAddressUpsertArgs} args - Arguments to update or create a DirectAddress.
     * @example
     * // Update or create a DirectAddress
     * const directAddress = await prisma.directAddress.upsert({
     *   create: {
     *     // ... data to create a DirectAddress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DirectAddress we want to update
     *   }
     * })
     */
    upsert<T extends DirectAddressUpsertArgs>(args: SelectSubset<T, DirectAddressUpsertArgs<ExtArgs>>): Prisma__DirectAddressClient<$Result.GetResult<Prisma.$DirectAddressPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DirectAddresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectAddressCountArgs} args - Arguments to filter DirectAddresses to count.
     * @example
     * // Count the number of DirectAddresses
     * const count = await prisma.directAddress.count({
     *   where: {
     *     // ... the filter for the DirectAddresses we want to count
     *   }
     * })
    **/
    count<T extends DirectAddressCountArgs>(
      args?: Subset<T, DirectAddressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DirectAddressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DirectAddress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectAddressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DirectAddressAggregateArgs>(args: Subset<T, DirectAddressAggregateArgs>): Prisma.PrismaPromise<GetDirectAddressAggregateType<T>>

    /**
     * Group by DirectAddress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectAddressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DirectAddressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DirectAddressGroupByArgs['orderBy'] }
        : { orderBy?: DirectAddressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DirectAddressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDirectAddressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DirectAddress model
   */
  readonly fields: DirectAddressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DirectAddress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DirectAddressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DirectAddress model
   */ 
  interface DirectAddressFieldRefs {
    readonly id: FieldRef<"DirectAddress", 'String'>
    readonly address: FieldRef<"DirectAddress", 'String'>
    readonly certificate: FieldRef<"DirectAddress", 'String'>
    readonly privateKey: FieldRef<"DirectAddress", 'String'>
    readonly domain: FieldRef<"DirectAddress", 'String'>
    readonly status: FieldRef<"DirectAddress", 'DirectAddressStatus'>
    readonly ownerType: FieldRef<"DirectAddress", 'DirectAddressOwner'>
    readonly ownerId: FieldRef<"DirectAddress", 'String'>
    readonly ownerName: FieldRef<"DirectAddress", 'String'>
    readonly trustAnchor: FieldRef<"DirectAddress", 'String'>
    readonly trustBundle: FieldRef<"DirectAddress", 'String'>
    readonly certificateExpiry: FieldRef<"DirectAddress", 'DateTime'>
    readonly issuerDn: FieldRef<"DirectAddress", 'String'>
    readonly subjectDn: FieldRef<"DirectAddress", 'String'>
    readonly hispId: FieldRef<"DirectAddress", 'String'>
    readonly hispName: FieldRef<"DirectAddress", 'String'>
    readonly messagesSent: FieldRef<"DirectAddress", 'Int'>
    readonly messagesReceived: FieldRef<"DirectAddress", 'Int'>
    readonly lastActivity: FieldRef<"DirectAddress", 'DateTime'>
    readonly createdAt: FieldRef<"DirectAddress", 'DateTime'>
    readonly updatedAt: FieldRef<"DirectAddress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DirectAddress findUnique
   */
  export type DirectAddressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectAddress
     */
    select?: DirectAddressSelect<ExtArgs> | null
    /**
     * Filter, which DirectAddress to fetch.
     */
    where: DirectAddressWhereUniqueInput
  }

  /**
   * DirectAddress findUniqueOrThrow
   */
  export type DirectAddressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectAddress
     */
    select?: DirectAddressSelect<ExtArgs> | null
    /**
     * Filter, which DirectAddress to fetch.
     */
    where: DirectAddressWhereUniqueInput
  }

  /**
   * DirectAddress findFirst
   */
  export type DirectAddressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectAddress
     */
    select?: DirectAddressSelect<ExtArgs> | null
    /**
     * Filter, which DirectAddress to fetch.
     */
    where?: DirectAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectAddresses to fetch.
     */
    orderBy?: DirectAddressOrderByWithRelationInput | DirectAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DirectAddresses.
     */
    cursor?: DirectAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectAddresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DirectAddresses.
     */
    distinct?: DirectAddressScalarFieldEnum | DirectAddressScalarFieldEnum[]
  }

  /**
   * DirectAddress findFirstOrThrow
   */
  export type DirectAddressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectAddress
     */
    select?: DirectAddressSelect<ExtArgs> | null
    /**
     * Filter, which DirectAddress to fetch.
     */
    where?: DirectAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectAddresses to fetch.
     */
    orderBy?: DirectAddressOrderByWithRelationInput | DirectAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DirectAddresses.
     */
    cursor?: DirectAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectAddresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DirectAddresses.
     */
    distinct?: DirectAddressScalarFieldEnum | DirectAddressScalarFieldEnum[]
  }

  /**
   * DirectAddress findMany
   */
  export type DirectAddressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectAddress
     */
    select?: DirectAddressSelect<ExtArgs> | null
    /**
     * Filter, which DirectAddresses to fetch.
     */
    where?: DirectAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectAddresses to fetch.
     */
    orderBy?: DirectAddressOrderByWithRelationInput | DirectAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DirectAddresses.
     */
    cursor?: DirectAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectAddresses.
     */
    skip?: number
    distinct?: DirectAddressScalarFieldEnum | DirectAddressScalarFieldEnum[]
  }

  /**
   * DirectAddress create
   */
  export type DirectAddressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectAddress
     */
    select?: DirectAddressSelect<ExtArgs> | null
    /**
     * The data needed to create a DirectAddress.
     */
    data: XOR<DirectAddressCreateInput, DirectAddressUncheckedCreateInput>
  }

  /**
   * DirectAddress createMany
   */
  export type DirectAddressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DirectAddresses.
     */
    data: DirectAddressCreateManyInput | DirectAddressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DirectAddress createManyAndReturn
   */
  export type DirectAddressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectAddress
     */
    select?: DirectAddressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DirectAddresses.
     */
    data: DirectAddressCreateManyInput | DirectAddressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DirectAddress update
   */
  export type DirectAddressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectAddress
     */
    select?: DirectAddressSelect<ExtArgs> | null
    /**
     * The data needed to update a DirectAddress.
     */
    data: XOR<DirectAddressUpdateInput, DirectAddressUncheckedUpdateInput>
    /**
     * Choose, which DirectAddress to update.
     */
    where: DirectAddressWhereUniqueInput
  }

  /**
   * DirectAddress updateMany
   */
  export type DirectAddressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DirectAddresses.
     */
    data: XOR<DirectAddressUpdateManyMutationInput, DirectAddressUncheckedUpdateManyInput>
    /**
     * Filter which DirectAddresses to update
     */
    where?: DirectAddressWhereInput
  }

  /**
   * DirectAddress upsert
   */
  export type DirectAddressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectAddress
     */
    select?: DirectAddressSelect<ExtArgs> | null
    /**
     * The filter to search for the DirectAddress to update in case it exists.
     */
    where: DirectAddressWhereUniqueInput
    /**
     * In case the DirectAddress found by the `where` argument doesn't exist, create a new DirectAddress with this data.
     */
    create: XOR<DirectAddressCreateInput, DirectAddressUncheckedCreateInput>
    /**
     * In case the DirectAddress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DirectAddressUpdateInput, DirectAddressUncheckedUpdateInput>
  }

  /**
   * DirectAddress delete
   */
  export type DirectAddressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectAddress
     */
    select?: DirectAddressSelect<ExtArgs> | null
    /**
     * Filter which DirectAddress to delete.
     */
    where: DirectAddressWhereUniqueInput
  }

  /**
   * DirectAddress deleteMany
   */
  export type DirectAddressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DirectAddresses to delete
     */
    where?: DirectAddressWhereInput
  }

  /**
   * DirectAddress without action
   */
  export type DirectAddressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectAddress
     */
    select?: DirectAddressSelect<ExtArgs> | null
  }


  /**
   * Model FhirEndpoint
   */

  export type AggregateFhirEndpoint = {
    _count: FhirEndpointCountAggregateOutputType | null
    _avg: FhirEndpointAvgAggregateOutputType | null
    _sum: FhirEndpointSumAggregateOutputType | null
    _min: FhirEndpointMinAggregateOutputType | null
    _max: FhirEndpointMaxAggregateOutputType | null
  }

  export type FhirEndpointAvgAggregateOutputType = {
    avgResponseTimeMs: number | null
  }

  export type FhirEndpointSumAggregateOutputType = {
    avgResponseTimeMs: number | null
  }

  export type FhirEndpointMinAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    fhirVersion: string | null
    status: $Enums.EndpointStatus | null
    authType: $Enums.AuthenticationType | null
    tokenEndpoint: string | null
    authorizeEndpoint: string | null
    clientId: string | null
    clientSecret: string | null
    smartEnabled: boolean | null
    organizationName: string | null
    organizationNpi: string | null
    lastHealthCheck: Date | null
    healthStatus: string | null
    avgResponseTimeMs: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FhirEndpointMaxAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    fhirVersion: string | null
    status: $Enums.EndpointStatus | null
    authType: $Enums.AuthenticationType | null
    tokenEndpoint: string | null
    authorizeEndpoint: string | null
    clientId: string | null
    clientSecret: string | null
    smartEnabled: boolean | null
    organizationName: string | null
    organizationNpi: string | null
    lastHealthCheck: Date | null
    healthStatus: string | null
    avgResponseTimeMs: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FhirEndpointCountAggregateOutputType = {
    id: number
    name: number
    url: number
    fhirVersion: number
    status: number
    capabilityStatement: number
    supportedResources: number
    supportedOperations: number
    authType: number
    tokenEndpoint: number
    authorizeEndpoint: number
    clientId: number
    clientSecret: number
    scopes: number
    smartEnabled: number
    smartMetadata: number
    organizationName: number
    organizationNpi: number
    lastHealthCheck: number
    healthStatus: number
    avgResponseTimeMs: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FhirEndpointAvgAggregateInputType = {
    avgResponseTimeMs?: true
  }

  export type FhirEndpointSumAggregateInputType = {
    avgResponseTimeMs?: true
  }

  export type FhirEndpointMinAggregateInputType = {
    id?: true
    name?: true
    url?: true
    fhirVersion?: true
    status?: true
    authType?: true
    tokenEndpoint?: true
    authorizeEndpoint?: true
    clientId?: true
    clientSecret?: true
    smartEnabled?: true
    organizationName?: true
    organizationNpi?: true
    lastHealthCheck?: true
    healthStatus?: true
    avgResponseTimeMs?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FhirEndpointMaxAggregateInputType = {
    id?: true
    name?: true
    url?: true
    fhirVersion?: true
    status?: true
    authType?: true
    tokenEndpoint?: true
    authorizeEndpoint?: true
    clientId?: true
    clientSecret?: true
    smartEnabled?: true
    organizationName?: true
    organizationNpi?: true
    lastHealthCheck?: true
    healthStatus?: true
    avgResponseTimeMs?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FhirEndpointCountAggregateInputType = {
    id?: true
    name?: true
    url?: true
    fhirVersion?: true
    status?: true
    capabilityStatement?: true
    supportedResources?: true
    supportedOperations?: true
    authType?: true
    tokenEndpoint?: true
    authorizeEndpoint?: true
    clientId?: true
    clientSecret?: true
    scopes?: true
    smartEnabled?: true
    smartMetadata?: true
    organizationName?: true
    organizationNpi?: true
    lastHealthCheck?: true
    healthStatus?: true
    avgResponseTimeMs?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FhirEndpointAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FhirEndpoint to aggregate.
     */
    where?: FhirEndpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FhirEndpoints to fetch.
     */
    orderBy?: FhirEndpointOrderByWithRelationInput | FhirEndpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FhirEndpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FhirEndpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FhirEndpoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FhirEndpoints
    **/
    _count?: true | FhirEndpointCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FhirEndpointAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FhirEndpointSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FhirEndpointMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FhirEndpointMaxAggregateInputType
  }

  export type GetFhirEndpointAggregateType<T extends FhirEndpointAggregateArgs> = {
        [P in keyof T & keyof AggregateFhirEndpoint]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFhirEndpoint[P]>
      : GetScalarType<T[P], AggregateFhirEndpoint[P]>
  }




  export type FhirEndpointGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FhirEndpointWhereInput
    orderBy?: FhirEndpointOrderByWithAggregationInput | FhirEndpointOrderByWithAggregationInput[]
    by: FhirEndpointScalarFieldEnum[] | FhirEndpointScalarFieldEnum
    having?: FhirEndpointScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FhirEndpointCountAggregateInputType | true
    _avg?: FhirEndpointAvgAggregateInputType
    _sum?: FhirEndpointSumAggregateInputType
    _min?: FhirEndpointMinAggregateInputType
    _max?: FhirEndpointMaxAggregateInputType
  }

  export type FhirEndpointGroupByOutputType = {
    id: string
    name: string
    url: string
    fhirVersion: string
    status: $Enums.EndpointStatus
    capabilityStatement: JsonValue | null
    supportedResources: string[]
    supportedOperations: string[]
    authType: $Enums.AuthenticationType
    tokenEndpoint: string | null
    authorizeEndpoint: string | null
    clientId: string | null
    clientSecret: string | null
    scopes: string[]
    smartEnabled: boolean
    smartMetadata: JsonValue | null
    organizationName: string | null
    organizationNpi: string | null
    lastHealthCheck: Date | null
    healthStatus: string | null
    avgResponseTimeMs: number | null
    createdAt: Date
    updatedAt: Date
    _count: FhirEndpointCountAggregateOutputType | null
    _avg: FhirEndpointAvgAggregateOutputType | null
    _sum: FhirEndpointSumAggregateOutputType | null
    _min: FhirEndpointMinAggregateOutputType | null
    _max: FhirEndpointMaxAggregateOutputType | null
  }

  type GetFhirEndpointGroupByPayload<T extends FhirEndpointGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FhirEndpointGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FhirEndpointGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FhirEndpointGroupByOutputType[P]>
            : GetScalarType<T[P], FhirEndpointGroupByOutputType[P]>
        }
      >
    >


  export type FhirEndpointSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    fhirVersion?: boolean
    status?: boolean
    capabilityStatement?: boolean
    supportedResources?: boolean
    supportedOperations?: boolean
    authType?: boolean
    tokenEndpoint?: boolean
    authorizeEndpoint?: boolean
    clientId?: boolean
    clientSecret?: boolean
    scopes?: boolean
    smartEnabled?: boolean
    smartMetadata?: boolean
    organizationName?: boolean
    organizationNpi?: boolean
    lastHealthCheck?: boolean
    healthStatus?: boolean
    avgResponseTimeMs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fhirEndpoint"]>

  export type FhirEndpointSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    fhirVersion?: boolean
    status?: boolean
    capabilityStatement?: boolean
    supportedResources?: boolean
    supportedOperations?: boolean
    authType?: boolean
    tokenEndpoint?: boolean
    authorizeEndpoint?: boolean
    clientId?: boolean
    clientSecret?: boolean
    scopes?: boolean
    smartEnabled?: boolean
    smartMetadata?: boolean
    organizationName?: boolean
    organizationNpi?: boolean
    lastHealthCheck?: boolean
    healthStatus?: boolean
    avgResponseTimeMs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fhirEndpoint"]>

  export type FhirEndpointSelectScalar = {
    id?: boolean
    name?: boolean
    url?: boolean
    fhirVersion?: boolean
    status?: boolean
    capabilityStatement?: boolean
    supportedResources?: boolean
    supportedOperations?: boolean
    authType?: boolean
    tokenEndpoint?: boolean
    authorizeEndpoint?: boolean
    clientId?: boolean
    clientSecret?: boolean
    scopes?: boolean
    smartEnabled?: boolean
    smartMetadata?: boolean
    organizationName?: boolean
    organizationNpi?: boolean
    lastHealthCheck?: boolean
    healthStatus?: boolean
    avgResponseTimeMs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $FhirEndpointPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FhirEndpoint"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      url: string
      fhirVersion: string
      status: $Enums.EndpointStatus
      capabilityStatement: Prisma.JsonValue | null
      supportedResources: string[]
      supportedOperations: string[]
      authType: $Enums.AuthenticationType
      tokenEndpoint: string | null
      authorizeEndpoint: string | null
      clientId: string | null
      clientSecret: string | null
      scopes: string[]
      smartEnabled: boolean
      smartMetadata: Prisma.JsonValue | null
      organizationName: string | null
      organizationNpi: string | null
      lastHealthCheck: Date | null
      healthStatus: string | null
      avgResponseTimeMs: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fhirEndpoint"]>
    composites: {}
  }

  type FhirEndpointGetPayload<S extends boolean | null | undefined | FhirEndpointDefaultArgs> = $Result.GetResult<Prisma.$FhirEndpointPayload, S>

  type FhirEndpointCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FhirEndpointFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FhirEndpointCountAggregateInputType | true
    }

  export interface FhirEndpointDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FhirEndpoint'], meta: { name: 'FhirEndpoint' } }
    /**
     * Find zero or one FhirEndpoint that matches the filter.
     * @param {FhirEndpointFindUniqueArgs} args - Arguments to find a FhirEndpoint
     * @example
     * // Get one FhirEndpoint
     * const fhirEndpoint = await prisma.fhirEndpoint.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FhirEndpointFindUniqueArgs>(args: SelectSubset<T, FhirEndpointFindUniqueArgs<ExtArgs>>): Prisma__FhirEndpointClient<$Result.GetResult<Prisma.$FhirEndpointPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FhirEndpoint that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FhirEndpointFindUniqueOrThrowArgs} args - Arguments to find a FhirEndpoint
     * @example
     * // Get one FhirEndpoint
     * const fhirEndpoint = await prisma.fhirEndpoint.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FhirEndpointFindUniqueOrThrowArgs>(args: SelectSubset<T, FhirEndpointFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FhirEndpointClient<$Result.GetResult<Prisma.$FhirEndpointPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FhirEndpoint that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FhirEndpointFindFirstArgs} args - Arguments to find a FhirEndpoint
     * @example
     * // Get one FhirEndpoint
     * const fhirEndpoint = await prisma.fhirEndpoint.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FhirEndpointFindFirstArgs>(args?: SelectSubset<T, FhirEndpointFindFirstArgs<ExtArgs>>): Prisma__FhirEndpointClient<$Result.GetResult<Prisma.$FhirEndpointPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FhirEndpoint that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FhirEndpointFindFirstOrThrowArgs} args - Arguments to find a FhirEndpoint
     * @example
     * // Get one FhirEndpoint
     * const fhirEndpoint = await prisma.fhirEndpoint.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FhirEndpointFindFirstOrThrowArgs>(args?: SelectSubset<T, FhirEndpointFindFirstOrThrowArgs<ExtArgs>>): Prisma__FhirEndpointClient<$Result.GetResult<Prisma.$FhirEndpointPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FhirEndpoints that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FhirEndpointFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FhirEndpoints
     * const fhirEndpoints = await prisma.fhirEndpoint.findMany()
     * 
     * // Get first 10 FhirEndpoints
     * const fhirEndpoints = await prisma.fhirEndpoint.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fhirEndpointWithIdOnly = await prisma.fhirEndpoint.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FhirEndpointFindManyArgs>(args?: SelectSubset<T, FhirEndpointFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FhirEndpointPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FhirEndpoint.
     * @param {FhirEndpointCreateArgs} args - Arguments to create a FhirEndpoint.
     * @example
     * // Create one FhirEndpoint
     * const FhirEndpoint = await prisma.fhirEndpoint.create({
     *   data: {
     *     // ... data to create a FhirEndpoint
     *   }
     * })
     * 
     */
    create<T extends FhirEndpointCreateArgs>(args: SelectSubset<T, FhirEndpointCreateArgs<ExtArgs>>): Prisma__FhirEndpointClient<$Result.GetResult<Prisma.$FhirEndpointPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FhirEndpoints.
     * @param {FhirEndpointCreateManyArgs} args - Arguments to create many FhirEndpoints.
     * @example
     * // Create many FhirEndpoints
     * const fhirEndpoint = await prisma.fhirEndpoint.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FhirEndpointCreateManyArgs>(args?: SelectSubset<T, FhirEndpointCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FhirEndpoints and returns the data saved in the database.
     * @param {FhirEndpointCreateManyAndReturnArgs} args - Arguments to create many FhirEndpoints.
     * @example
     * // Create many FhirEndpoints
     * const fhirEndpoint = await prisma.fhirEndpoint.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FhirEndpoints and only return the `id`
     * const fhirEndpointWithIdOnly = await prisma.fhirEndpoint.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FhirEndpointCreateManyAndReturnArgs>(args?: SelectSubset<T, FhirEndpointCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FhirEndpointPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FhirEndpoint.
     * @param {FhirEndpointDeleteArgs} args - Arguments to delete one FhirEndpoint.
     * @example
     * // Delete one FhirEndpoint
     * const FhirEndpoint = await prisma.fhirEndpoint.delete({
     *   where: {
     *     // ... filter to delete one FhirEndpoint
     *   }
     * })
     * 
     */
    delete<T extends FhirEndpointDeleteArgs>(args: SelectSubset<T, FhirEndpointDeleteArgs<ExtArgs>>): Prisma__FhirEndpointClient<$Result.GetResult<Prisma.$FhirEndpointPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FhirEndpoint.
     * @param {FhirEndpointUpdateArgs} args - Arguments to update one FhirEndpoint.
     * @example
     * // Update one FhirEndpoint
     * const fhirEndpoint = await prisma.fhirEndpoint.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FhirEndpointUpdateArgs>(args: SelectSubset<T, FhirEndpointUpdateArgs<ExtArgs>>): Prisma__FhirEndpointClient<$Result.GetResult<Prisma.$FhirEndpointPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FhirEndpoints.
     * @param {FhirEndpointDeleteManyArgs} args - Arguments to filter FhirEndpoints to delete.
     * @example
     * // Delete a few FhirEndpoints
     * const { count } = await prisma.fhirEndpoint.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FhirEndpointDeleteManyArgs>(args?: SelectSubset<T, FhirEndpointDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FhirEndpoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FhirEndpointUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FhirEndpoints
     * const fhirEndpoint = await prisma.fhirEndpoint.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FhirEndpointUpdateManyArgs>(args: SelectSubset<T, FhirEndpointUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FhirEndpoint.
     * @param {FhirEndpointUpsertArgs} args - Arguments to update or create a FhirEndpoint.
     * @example
     * // Update or create a FhirEndpoint
     * const fhirEndpoint = await prisma.fhirEndpoint.upsert({
     *   create: {
     *     // ... data to create a FhirEndpoint
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FhirEndpoint we want to update
     *   }
     * })
     */
    upsert<T extends FhirEndpointUpsertArgs>(args: SelectSubset<T, FhirEndpointUpsertArgs<ExtArgs>>): Prisma__FhirEndpointClient<$Result.GetResult<Prisma.$FhirEndpointPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FhirEndpoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FhirEndpointCountArgs} args - Arguments to filter FhirEndpoints to count.
     * @example
     * // Count the number of FhirEndpoints
     * const count = await prisma.fhirEndpoint.count({
     *   where: {
     *     // ... the filter for the FhirEndpoints we want to count
     *   }
     * })
    **/
    count<T extends FhirEndpointCountArgs>(
      args?: Subset<T, FhirEndpointCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FhirEndpointCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FhirEndpoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FhirEndpointAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FhirEndpointAggregateArgs>(args: Subset<T, FhirEndpointAggregateArgs>): Prisma.PrismaPromise<GetFhirEndpointAggregateType<T>>

    /**
     * Group by FhirEndpoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FhirEndpointGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FhirEndpointGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FhirEndpointGroupByArgs['orderBy'] }
        : { orderBy?: FhirEndpointGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FhirEndpointGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFhirEndpointGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FhirEndpoint model
   */
  readonly fields: FhirEndpointFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FhirEndpoint.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FhirEndpointClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FhirEndpoint model
   */ 
  interface FhirEndpointFieldRefs {
    readonly id: FieldRef<"FhirEndpoint", 'String'>
    readonly name: FieldRef<"FhirEndpoint", 'String'>
    readonly url: FieldRef<"FhirEndpoint", 'String'>
    readonly fhirVersion: FieldRef<"FhirEndpoint", 'String'>
    readonly status: FieldRef<"FhirEndpoint", 'EndpointStatus'>
    readonly capabilityStatement: FieldRef<"FhirEndpoint", 'Json'>
    readonly supportedResources: FieldRef<"FhirEndpoint", 'String[]'>
    readonly supportedOperations: FieldRef<"FhirEndpoint", 'String[]'>
    readonly authType: FieldRef<"FhirEndpoint", 'AuthenticationType'>
    readonly tokenEndpoint: FieldRef<"FhirEndpoint", 'String'>
    readonly authorizeEndpoint: FieldRef<"FhirEndpoint", 'String'>
    readonly clientId: FieldRef<"FhirEndpoint", 'String'>
    readonly clientSecret: FieldRef<"FhirEndpoint", 'String'>
    readonly scopes: FieldRef<"FhirEndpoint", 'String[]'>
    readonly smartEnabled: FieldRef<"FhirEndpoint", 'Boolean'>
    readonly smartMetadata: FieldRef<"FhirEndpoint", 'Json'>
    readonly organizationName: FieldRef<"FhirEndpoint", 'String'>
    readonly organizationNpi: FieldRef<"FhirEndpoint", 'String'>
    readonly lastHealthCheck: FieldRef<"FhirEndpoint", 'DateTime'>
    readonly healthStatus: FieldRef<"FhirEndpoint", 'String'>
    readonly avgResponseTimeMs: FieldRef<"FhirEndpoint", 'Int'>
    readonly createdAt: FieldRef<"FhirEndpoint", 'DateTime'>
    readonly updatedAt: FieldRef<"FhirEndpoint", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FhirEndpoint findUnique
   */
  export type FhirEndpointFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FhirEndpoint
     */
    select?: FhirEndpointSelect<ExtArgs> | null
    /**
     * Filter, which FhirEndpoint to fetch.
     */
    where: FhirEndpointWhereUniqueInput
  }

  /**
   * FhirEndpoint findUniqueOrThrow
   */
  export type FhirEndpointFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FhirEndpoint
     */
    select?: FhirEndpointSelect<ExtArgs> | null
    /**
     * Filter, which FhirEndpoint to fetch.
     */
    where: FhirEndpointWhereUniqueInput
  }

  /**
   * FhirEndpoint findFirst
   */
  export type FhirEndpointFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FhirEndpoint
     */
    select?: FhirEndpointSelect<ExtArgs> | null
    /**
     * Filter, which FhirEndpoint to fetch.
     */
    where?: FhirEndpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FhirEndpoints to fetch.
     */
    orderBy?: FhirEndpointOrderByWithRelationInput | FhirEndpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FhirEndpoints.
     */
    cursor?: FhirEndpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FhirEndpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FhirEndpoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FhirEndpoints.
     */
    distinct?: FhirEndpointScalarFieldEnum | FhirEndpointScalarFieldEnum[]
  }

  /**
   * FhirEndpoint findFirstOrThrow
   */
  export type FhirEndpointFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FhirEndpoint
     */
    select?: FhirEndpointSelect<ExtArgs> | null
    /**
     * Filter, which FhirEndpoint to fetch.
     */
    where?: FhirEndpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FhirEndpoints to fetch.
     */
    orderBy?: FhirEndpointOrderByWithRelationInput | FhirEndpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FhirEndpoints.
     */
    cursor?: FhirEndpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FhirEndpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FhirEndpoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FhirEndpoints.
     */
    distinct?: FhirEndpointScalarFieldEnum | FhirEndpointScalarFieldEnum[]
  }

  /**
   * FhirEndpoint findMany
   */
  export type FhirEndpointFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FhirEndpoint
     */
    select?: FhirEndpointSelect<ExtArgs> | null
    /**
     * Filter, which FhirEndpoints to fetch.
     */
    where?: FhirEndpointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FhirEndpoints to fetch.
     */
    orderBy?: FhirEndpointOrderByWithRelationInput | FhirEndpointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FhirEndpoints.
     */
    cursor?: FhirEndpointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FhirEndpoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FhirEndpoints.
     */
    skip?: number
    distinct?: FhirEndpointScalarFieldEnum | FhirEndpointScalarFieldEnum[]
  }

  /**
   * FhirEndpoint create
   */
  export type FhirEndpointCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FhirEndpoint
     */
    select?: FhirEndpointSelect<ExtArgs> | null
    /**
     * The data needed to create a FhirEndpoint.
     */
    data: XOR<FhirEndpointCreateInput, FhirEndpointUncheckedCreateInput>
  }

  /**
   * FhirEndpoint createMany
   */
  export type FhirEndpointCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FhirEndpoints.
     */
    data: FhirEndpointCreateManyInput | FhirEndpointCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FhirEndpoint createManyAndReturn
   */
  export type FhirEndpointCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FhirEndpoint
     */
    select?: FhirEndpointSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FhirEndpoints.
     */
    data: FhirEndpointCreateManyInput | FhirEndpointCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FhirEndpoint update
   */
  export type FhirEndpointUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FhirEndpoint
     */
    select?: FhirEndpointSelect<ExtArgs> | null
    /**
     * The data needed to update a FhirEndpoint.
     */
    data: XOR<FhirEndpointUpdateInput, FhirEndpointUncheckedUpdateInput>
    /**
     * Choose, which FhirEndpoint to update.
     */
    where: FhirEndpointWhereUniqueInput
  }

  /**
   * FhirEndpoint updateMany
   */
  export type FhirEndpointUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FhirEndpoints.
     */
    data: XOR<FhirEndpointUpdateManyMutationInput, FhirEndpointUncheckedUpdateManyInput>
    /**
     * Filter which FhirEndpoints to update
     */
    where?: FhirEndpointWhereInput
  }

  /**
   * FhirEndpoint upsert
   */
  export type FhirEndpointUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FhirEndpoint
     */
    select?: FhirEndpointSelect<ExtArgs> | null
    /**
     * The filter to search for the FhirEndpoint to update in case it exists.
     */
    where: FhirEndpointWhereUniqueInput
    /**
     * In case the FhirEndpoint found by the `where` argument doesn't exist, create a new FhirEndpoint with this data.
     */
    create: XOR<FhirEndpointCreateInput, FhirEndpointUncheckedCreateInput>
    /**
     * In case the FhirEndpoint was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FhirEndpointUpdateInput, FhirEndpointUncheckedUpdateInput>
  }

  /**
   * FhirEndpoint delete
   */
  export type FhirEndpointDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FhirEndpoint
     */
    select?: FhirEndpointSelect<ExtArgs> | null
    /**
     * Filter which FhirEndpoint to delete.
     */
    where: FhirEndpointWhereUniqueInput
  }

  /**
   * FhirEndpoint deleteMany
   */
  export type FhirEndpointDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FhirEndpoints to delete
     */
    where?: FhirEndpointWhereInput
  }

  /**
   * FhirEndpoint without action
   */
  export type FhirEndpointDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FhirEndpoint
     */
    select?: FhirEndpointSelect<ExtArgs> | null
  }


  /**
   * Model CCDADocument
   */

  export type AggregateCCDADocument = {
    _count: CCDADocumentCountAggregateOutputType | null
    _avg: CCDADocumentAvgAggregateOutputType | null
    _sum: CCDADocumentSumAggregateOutputType | null
    _min: CCDADocumentMinAggregateOutputType | null
    _max: CCDADocumentMaxAggregateOutputType | null
  }

  export type CCDADocumentAvgAggregateOutputType = {
    sizeBytes: number | null
  }

  export type CCDADocumentSumAggregateOutputType = {
    sizeBytes: number | null
  }

  export type CCDADocumentMinAggregateOutputType = {
    id: string | null
    documentId: string | null
    documentType: $Enums.CCDADocumentType | null
    patientId: string | null
    title: string | null
    creationTime: Date | null
    effectiveTime: Date | null
    confidentialityCode: string | null
    languageCode: string | null
    authorId: string | null
    authorName: string | null
    authorOrganization: string | null
    custodianId: string | null
    custodianName: string | null
    storageLocation: string | null
    contentHash: string | null
    sizeBytes: number | null
    mimeType: string | null
    exchangeStatus: $Enums.DocumentExchangeStatus | null
    sourceNetwork: string | null
    sourceOrganization: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CCDADocumentMaxAggregateOutputType = {
    id: string | null
    documentId: string | null
    documentType: $Enums.CCDADocumentType | null
    patientId: string | null
    title: string | null
    creationTime: Date | null
    effectiveTime: Date | null
    confidentialityCode: string | null
    languageCode: string | null
    authorId: string | null
    authorName: string | null
    authorOrganization: string | null
    custodianId: string | null
    custodianName: string | null
    storageLocation: string | null
    contentHash: string | null
    sizeBytes: number | null
    mimeType: string | null
    exchangeStatus: $Enums.DocumentExchangeStatus | null
    sourceNetwork: string | null
    sourceOrganization: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CCDADocumentCountAggregateOutputType = {
    id: number
    documentId: number
    documentType: number
    patientId: number
    title: number
    creationTime: number
    effectiveTime: number
    confidentialityCode: number
    languageCode: number
    authorId: number
    authorName: number
    authorOrganization: number
    custodianId: number
    custodianName: number
    storageLocation: number
    contentHash: number
    sizeBytes: number
    mimeType: number
    exchangeStatus: number
    sourceNetwork: number
    sourceOrganization: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CCDADocumentAvgAggregateInputType = {
    sizeBytes?: true
  }

  export type CCDADocumentSumAggregateInputType = {
    sizeBytes?: true
  }

  export type CCDADocumentMinAggregateInputType = {
    id?: true
    documentId?: true
    documentType?: true
    patientId?: true
    title?: true
    creationTime?: true
    effectiveTime?: true
    confidentialityCode?: true
    languageCode?: true
    authorId?: true
    authorName?: true
    authorOrganization?: true
    custodianId?: true
    custodianName?: true
    storageLocation?: true
    contentHash?: true
    sizeBytes?: true
    mimeType?: true
    exchangeStatus?: true
    sourceNetwork?: true
    sourceOrganization?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CCDADocumentMaxAggregateInputType = {
    id?: true
    documentId?: true
    documentType?: true
    patientId?: true
    title?: true
    creationTime?: true
    effectiveTime?: true
    confidentialityCode?: true
    languageCode?: true
    authorId?: true
    authorName?: true
    authorOrganization?: true
    custodianId?: true
    custodianName?: true
    storageLocation?: true
    contentHash?: true
    sizeBytes?: true
    mimeType?: true
    exchangeStatus?: true
    sourceNetwork?: true
    sourceOrganization?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CCDADocumentCountAggregateInputType = {
    id?: true
    documentId?: true
    documentType?: true
    patientId?: true
    title?: true
    creationTime?: true
    effectiveTime?: true
    confidentialityCode?: true
    languageCode?: true
    authorId?: true
    authorName?: true
    authorOrganization?: true
    custodianId?: true
    custodianName?: true
    storageLocation?: true
    contentHash?: true
    sizeBytes?: true
    mimeType?: true
    exchangeStatus?: true
    sourceNetwork?: true
    sourceOrganization?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CCDADocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CCDADocument to aggregate.
     */
    where?: CCDADocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CCDADocuments to fetch.
     */
    orderBy?: CCDADocumentOrderByWithRelationInput | CCDADocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CCDADocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CCDADocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CCDADocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CCDADocuments
    **/
    _count?: true | CCDADocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CCDADocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CCDADocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CCDADocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CCDADocumentMaxAggregateInputType
  }

  export type GetCCDADocumentAggregateType<T extends CCDADocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateCCDADocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCCDADocument[P]>
      : GetScalarType<T[P], AggregateCCDADocument[P]>
  }




  export type CCDADocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CCDADocumentWhereInput
    orderBy?: CCDADocumentOrderByWithAggregationInput | CCDADocumentOrderByWithAggregationInput[]
    by: CCDADocumentScalarFieldEnum[] | CCDADocumentScalarFieldEnum
    having?: CCDADocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CCDADocumentCountAggregateInputType | true
    _avg?: CCDADocumentAvgAggregateInputType
    _sum?: CCDADocumentSumAggregateInputType
    _min?: CCDADocumentMinAggregateInputType
    _max?: CCDADocumentMaxAggregateInputType
  }

  export type CCDADocumentGroupByOutputType = {
    id: string
    documentId: string
    documentType: $Enums.CCDADocumentType
    patientId: string
    title: string | null
    creationTime: Date
    effectiveTime: Date | null
    confidentialityCode: string | null
    languageCode: string
    authorId: string | null
    authorName: string | null
    authorOrganization: string | null
    custodianId: string | null
    custodianName: string | null
    storageLocation: string | null
    contentHash: string | null
    sizeBytes: number | null
    mimeType: string
    exchangeStatus: $Enums.DocumentExchangeStatus
    sourceNetwork: string | null
    sourceOrganization: string | null
    createdAt: Date
    updatedAt: Date
    _count: CCDADocumentCountAggregateOutputType | null
    _avg: CCDADocumentAvgAggregateOutputType | null
    _sum: CCDADocumentSumAggregateOutputType | null
    _min: CCDADocumentMinAggregateOutputType | null
    _max: CCDADocumentMaxAggregateOutputType | null
  }

  type GetCCDADocumentGroupByPayload<T extends CCDADocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CCDADocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CCDADocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CCDADocumentGroupByOutputType[P]>
            : GetScalarType<T[P], CCDADocumentGroupByOutputType[P]>
        }
      >
    >


  export type CCDADocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    documentType?: boolean
    patientId?: boolean
    title?: boolean
    creationTime?: boolean
    effectiveTime?: boolean
    confidentialityCode?: boolean
    languageCode?: boolean
    authorId?: boolean
    authorName?: boolean
    authorOrganization?: boolean
    custodianId?: boolean
    custodianName?: boolean
    storageLocation?: boolean
    contentHash?: boolean
    sizeBytes?: boolean
    mimeType?: boolean
    exchangeStatus?: boolean
    sourceNetwork?: boolean
    sourceOrganization?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cCDADocument"]>

  export type CCDADocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    documentType?: boolean
    patientId?: boolean
    title?: boolean
    creationTime?: boolean
    effectiveTime?: boolean
    confidentialityCode?: boolean
    languageCode?: boolean
    authorId?: boolean
    authorName?: boolean
    authorOrganization?: boolean
    custodianId?: boolean
    custodianName?: boolean
    storageLocation?: boolean
    contentHash?: boolean
    sizeBytes?: boolean
    mimeType?: boolean
    exchangeStatus?: boolean
    sourceNetwork?: boolean
    sourceOrganization?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cCDADocument"]>

  export type CCDADocumentSelectScalar = {
    id?: boolean
    documentId?: boolean
    documentType?: boolean
    patientId?: boolean
    title?: boolean
    creationTime?: boolean
    effectiveTime?: boolean
    confidentialityCode?: boolean
    languageCode?: boolean
    authorId?: boolean
    authorName?: boolean
    authorOrganization?: boolean
    custodianId?: boolean
    custodianName?: boolean
    storageLocation?: boolean
    contentHash?: boolean
    sizeBytes?: boolean
    mimeType?: boolean
    exchangeStatus?: boolean
    sourceNetwork?: boolean
    sourceOrganization?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $CCDADocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CCDADocument"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      documentId: string
      documentType: $Enums.CCDADocumentType
      patientId: string
      title: string | null
      creationTime: Date
      effectiveTime: Date | null
      confidentialityCode: string | null
      languageCode: string
      authorId: string | null
      authorName: string | null
      authorOrganization: string | null
      custodianId: string | null
      custodianName: string | null
      storageLocation: string | null
      contentHash: string | null
      sizeBytes: number | null
      mimeType: string
      exchangeStatus: $Enums.DocumentExchangeStatus
      sourceNetwork: string | null
      sourceOrganization: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cCDADocument"]>
    composites: {}
  }

  type CCDADocumentGetPayload<S extends boolean | null | undefined | CCDADocumentDefaultArgs> = $Result.GetResult<Prisma.$CCDADocumentPayload, S>

  type CCDADocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CCDADocumentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CCDADocumentCountAggregateInputType | true
    }

  export interface CCDADocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CCDADocument'], meta: { name: 'CCDADocument' } }
    /**
     * Find zero or one CCDADocument that matches the filter.
     * @param {CCDADocumentFindUniqueArgs} args - Arguments to find a CCDADocument
     * @example
     * // Get one CCDADocument
     * const cCDADocument = await prisma.cCDADocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CCDADocumentFindUniqueArgs>(args: SelectSubset<T, CCDADocumentFindUniqueArgs<ExtArgs>>): Prisma__CCDADocumentClient<$Result.GetResult<Prisma.$CCDADocumentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CCDADocument that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CCDADocumentFindUniqueOrThrowArgs} args - Arguments to find a CCDADocument
     * @example
     * // Get one CCDADocument
     * const cCDADocument = await prisma.cCDADocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CCDADocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, CCDADocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CCDADocumentClient<$Result.GetResult<Prisma.$CCDADocumentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CCDADocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CCDADocumentFindFirstArgs} args - Arguments to find a CCDADocument
     * @example
     * // Get one CCDADocument
     * const cCDADocument = await prisma.cCDADocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CCDADocumentFindFirstArgs>(args?: SelectSubset<T, CCDADocumentFindFirstArgs<ExtArgs>>): Prisma__CCDADocumentClient<$Result.GetResult<Prisma.$CCDADocumentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CCDADocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CCDADocumentFindFirstOrThrowArgs} args - Arguments to find a CCDADocument
     * @example
     * // Get one CCDADocument
     * const cCDADocument = await prisma.cCDADocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CCDADocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, CCDADocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CCDADocumentClient<$Result.GetResult<Prisma.$CCDADocumentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CCDADocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CCDADocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CCDADocuments
     * const cCDADocuments = await prisma.cCDADocument.findMany()
     * 
     * // Get first 10 CCDADocuments
     * const cCDADocuments = await prisma.cCDADocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cCDADocumentWithIdOnly = await prisma.cCDADocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CCDADocumentFindManyArgs>(args?: SelectSubset<T, CCDADocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CCDADocumentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CCDADocument.
     * @param {CCDADocumentCreateArgs} args - Arguments to create a CCDADocument.
     * @example
     * // Create one CCDADocument
     * const CCDADocument = await prisma.cCDADocument.create({
     *   data: {
     *     // ... data to create a CCDADocument
     *   }
     * })
     * 
     */
    create<T extends CCDADocumentCreateArgs>(args: SelectSubset<T, CCDADocumentCreateArgs<ExtArgs>>): Prisma__CCDADocumentClient<$Result.GetResult<Prisma.$CCDADocumentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CCDADocuments.
     * @param {CCDADocumentCreateManyArgs} args - Arguments to create many CCDADocuments.
     * @example
     * // Create many CCDADocuments
     * const cCDADocument = await prisma.cCDADocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CCDADocumentCreateManyArgs>(args?: SelectSubset<T, CCDADocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CCDADocuments and returns the data saved in the database.
     * @param {CCDADocumentCreateManyAndReturnArgs} args - Arguments to create many CCDADocuments.
     * @example
     * // Create many CCDADocuments
     * const cCDADocument = await prisma.cCDADocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CCDADocuments and only return the `id`
     * const cCDADocumentWithIdOnly = await prisma.cCDADocument.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CCDADocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, CCDADocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CCDADocumentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CCDADocument.
     * @param {CCDADocumentDeleteArgs} args - Arguments to delete one CCDADocument.
     * @example
     * // Delete one CCDADocument
     * const CCDADocument = await prisma.cCDADocument.delete({
     *   where: {
     *     // ... filter to delete one CCDADocument
     *   }
     * })
     * 
     */
    delete<T extends CCDADocumentDeleteArgs>(args: SelectSubset<T, CCDADocumentDeleteArgs<ExtArgs>>): Prisma__CCDADocumentClient<$Result.GetResult<Prisma.$CCDADocumentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CCDADocument.
     * @param {CCDADocumentUpdateArgs} args - Arguments to update one CCDADocument.
     * @example
     * // Update one CCDADocument
     * const cCDADocument = await prisma.cCDADocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CCDADocumentUpdateArgs>(args: SelectSubset<T, CCDADocumentUpdateArgs<ExtArgs>>): Prisma__CCDADocumentClient<$Result.GetResult<Prisma.$CCDADocumentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CCDADocuments.
     * @param {CCDADocumentDeleteManyArgs} args - Arguments to filter CCDADocuments to delete.
     * @example
     * // Delete a few CCDADocuments
     * const { count } = await prisma.cCDADocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CCDADocumentDeleteManyArgs>(args?: SelectSubset<T, CCDADocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CCDADocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CCDADocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CCDADocuments
     * const cCDADocument = await prisma.cCDADocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CCDADocumentUpdateManyArgs>(args: SelectSubset<T, CCDADocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CCDADocument.
     * @param {CCDADocumentUpsertArgs} args - Arguments to update or create a CCDADocument.
     * @example
     * // Update or create a CCDADocument
     * const cCDADocument = await prisma.cCDADocument.upsert({
     *   create: {
     *     // ... data to create a CCDADocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CCDADocument we want to update
     *   }
     * })
     */
    upsert<T extends CCDADocumentUpsertArgs>(args: SelectSubset<T, CCDADocumentUpsertArgs<ExtArgs>>): Prisma__CCDADocumentClient<$Result.GetResult<Prisma.$CCDADocumentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CCDADocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CCDADocumentCountArgs} args - Arguments to filter CCDADocuments to count.
     * @example
     * // Count the number of CCDADocuments
     * const count = await prisma.cCDADocument.count({
     *   where: {
     *     // ... the filter for the CCDADocuments we want to count
     *   }
     * })
    **/
    count<T extends CCDADocumentCountArgs>(
      args?: Subset<T, CCDADocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CCDADocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CCDADocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CCDADocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CCDADocumentAggregateArgs>(args: Subset<T, CCDADocumentAggregateArgs>): Prisma.PrismaPromise<GetCCDADocumentAggregateType<T>>

    /**
     * Group by CCDADocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CCDADocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CCDADocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CCDADocumentGroupByArgs['orderBy'] }
        : { orderBy?: CCDADocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CCDADocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCCDADocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CCDADocument model
   */
  readonly fields: CCDADocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CCDADocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CCDADocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CCDADocument model
   */ 
  interface CCDADocumentFieldRefs {
    readonly id: FieldRef<"CCDADocument", 'String'>
    readonly documentId: FieldRef<"CCDADocument", 'String'>
    readonly documentType: FieldRef<"CCDADocument", 'CCDADocumentType'>
    readonly patientId: FieldRef<"CCDADocument", 'String'>
    readonly title: FieldRef<"CCDADocument", 'String'>
    readonly creationTime: FieldRef<"CCDADocument", 'DateTime'>
    readonly effectiveTime: FieldRef<"CCDADocument", 'DateTime'>
    readonly confidentialityCode: FieldRef<"CCDADocument", 'String'>
    readonly languageCode: FieldRef<"CCDADocument", 'String'>
    readonly authorId: FieldRef<"CCDADocument", 'String'>
    readonly authorName: FieldRef<"CCDADocument", 'String'>
    readonly authorOrganization: FieldRef<"CCDADocument", 'String'>
    readonly custodianId: FieldRef<"CCDADocument", 'String'>
    readonly custodianName: FieldRef<"CCDADocument", 'String'>
    readonly storageLocation: FieldRef<"CCDADocument", 'String'>
    readonly contentHash: FieldRef<"CCDADocument", 'String'>
    readonly sizeBytes: FieldRef<"CCDADocument", 'Int'>
    readonly mimeType: FieldRef<"CCDADocument", 'String'>
    readonly exchangeStatus: FieldRef<"CCDADocument", 'DocumentExchangeStatus'>
    readonly sourceNetwork: FieldRef<"CCDADocument", 'String'>
    readonly sourceOrganization: FieldRef<"CCDADocument", 'String'>
    readonly createdAt: FieldRef<"CCDADocument", 'DateTime'>
    readonly updatedAt: FieldRef<"CCDADocument", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CCDADocument findUnique
   */
  export type CCDADocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CCDADocument
     */
    select?: CCDADocumentSelect<ExtArgs> | null
    /**
     * Filter, which CCDADocument to fetch.
     */
    where: CCDADocumentWhereUniqueInput
  }

  /**
   * CCDADocument findUniqueOrThrow
   */
  export type CCDADocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CCDADocument
     */
    select?: CCDADocumentSelect<ExtArgs> | null
    /**
     * Filter, which CCDADocument to fetch.
     */
    where: CCDADocumentWhereUniqueInput
  }

  /**
   * CCDADocument findFirst
   */
  export type CCDADocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CCDADocument
     */
    select?: CCDADocumentSelect<ExtArgs> | null
    /**
     * Filter, which CCDADocument to fetch.
     */
    where?: CCDADocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CCDADocuments to fetch.
     */
    orderBy?: CCDADocumentOrderByWithRelationInput | CCDADocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CCDADocuments.
     */
    cursor?: CCDADocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CCDADocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CCDADocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CCDADocuments.
     */
    distinct?: CCDADocumentScalarFieldEnum | CCDADocumentScalarFieldEnum[]
  }

  /**
   * CCDADocument findFirstOrThrow
   */
  export type CCDADocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CCDADocument
     */
    select?: CCDADocumentSelect<ExtArgs> | null
    /**
     * Filter, which CCDADocument to fetch.
     */
    where?: CCDADocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CCDADocuments to fetch.
     */
    orderBy?: CCDADocumentOrderByWithRelationInput | CCDADocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CCDADocuments.
     */
    cursor?: CCDADocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CCDADocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CCDADocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CCDADocuments.
     */
    distinct?: CCDADocumentScalarFieldEnum | CCDADocumentScalarFieldEnum[]
  }

  /**
   * CCDADocument findMany
   */
  export type CCDADocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CCDADocument
     */
    select?: CCDADocumentSelect<ExtArgs> | null
    /**
     * Filter, which CCDADocuments to fetch.
     */
    where?: CCDADocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CCDADocuments to fetch.
     */
    orderBy?: CCDADocumentOrderByWithRelationInput | CCDADocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CCDADocuments.
     */
    cursor?: CCDADocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CCDADocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CCDADocuments.
     */
    skip?: number
    distinct?: CCDADocumentScalarFieldEnum | CCDADocumentScalarFieldEnum[]
  }

  /**
   * CCDADocument create
   */
  export type CCDADocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CCDADocument
     */
    select?: CCDADocumentSelect<ExtArgs> | null
    /**
     * The data needed to create a CCDADocument.
     */
    data: XOR<CCDADocumentCreateInput, CCDADocumentUncheckedCreateInput>
  }

  /**
   * CCDADocument createMany
   */
  export type CCDADocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CCDADocuments.
     */
    data: CCDADocumentCreateManyInput | CCDADocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CCDADocument createManyAndReturn
   */
  export type CCDADocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CCDADocument
     */
    select?: CCDADocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CCDADocuments.
     */
    data: CCDADocumentCreateManyInput | CCDADocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CCDADocument update
   */
  export type CCDADocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CCDADocument
     */
    select?: CCDADocumentSelect<ExtArgs> | null
    /**
     * The data needed to update a CCDADocument.
     */
    data: XOR<CCDADocumentUpdateInput, CCDADocumentUncheckedUpdateInput>
    /**
     * Choose, which CCDADocument to update.
     */
    where: CCDADocumentWhereUniqueInput
  }

  /**
   * CCDADocument updateMany
   */
  export type CCDADocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CCDADocuments.
     */
    data: XOR<CCDADocumentUpdateManyMutationInput, CCDADocumentUncheckedUpdateManyInput>
    /**
     * Filter which CCDADocuments to update
     */
    where?: CCDADocumentWhereInput
  }

  /**
   * CCDADocument upsert
   */
  export type CCDADocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CCDADocument
     */
    select?: CCDADocumentSelect<ExtArgs> | null
    /**
     * The filter to search for the CCDADocument to update in case it exists.
     */
    where: CCDADocumentWhereUniqueInput
    /**
     * In case the CCDADocument found by the `where` argument doesn't exist, create a new CCDADocument with this data.
     */
    create: XOR<CCDADocumentCreateInput, CCDADocumentUncheckedCreateInput>
    /**
     * In case the CCDADocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CCDADocumentUpdateInput, CCDADocumentUncheckedUpdateInput>
  }

  /**
   * CCDADocument delete
   */
  export type CCDADocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CCDADocument
     */
    select?: CCDADocumentSelect<ExtArgs> | null
    /**
     * Filter which CCDADocument to delete.
     */
    where: CCDADocumentWhereUniqueInput
  }

  /**
   * CCDADocument deleteMany
   */
  export type CCDADocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CCDADocuments to delete
     */
    where?: CCDADocumentWhereInput
  }

  /**
   * CCDADocument without action
   */
  export type CCDADocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CCDADocument
     */
    select?: CCDADocumentSelect<ExtArgs> | null
  }


  /**
   * Model X12Transaction
   */

  export type AggregateX12Transaction = {
    _count: X12TransactionCountAggregateOutputType | null
    _min: X12TransactionMinAggregateOutputType | null
    _max: X12TransactionMaxAggregateOutputType | null
  }

  export type X12TransactionMinAggregateOutputType = {
    id: string | null
    transactionSetId: string | null
    transactionType: $Enums.X12TransactionType | null
    isaControlNumber: string | null
    gsControlNumber: string | null
    stControlNumber: string | null
    senderId: string | null
    senderQualifier: string | null
    receiverId: string | null
    receiverQualifier: string | null
    rawContent: string | null
    status: $Enums.X12Status | null
    acknowledgmentCode: string | null
    interchangeDate: Date | null
    processedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type X12TransactionMaxAggregateOutputType = {
    id: string | null
    transactionSetId: string | null
    transactionType: $Enums.X12TransactionType | null
    isaControlNumber: string | null
    gsControlNumber: string | null
    stControlNumber: string | null
    senderId: string | null
    senderQualifier: string | null
    receiverId: string | null
    receiverQualifier: string | null
    rawContent: string | null
    status: $Enums.X12Status | null
    acknowledgmentCode: string | null
    interchangeDate: Date | null
    processedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type X12TransactionCountAggregateOutputType = {
    id: number
    transactionSetId: number
    transactionType: number
    isaControlNumber: number
    gsControlNumber: number
    stControlNumber: number
    senderId: number
    senderQualifier: number
    receiverId: number
    receiverQualifier: number
    rawContent: number
    parsedContent: number
    status: number
    acknowledgmentCode: number
    errors: number
    interchangeDate: number
    processedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type X12TransactionMinAggregateInputType = {
    id?: true
    transactionSetId?: true
    transactionType?: true
    isaControlNumber?: true
    gsControlNumber?: true
    stControlNumber?: true
    senderId?: true
    senderQualifier?: true
    receiverId?: true
    receiverQualifier?: true
    rawContent?: true
    status?: true
    acknowledgmentCode?: true
    interchangeDate?: true
    processedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type X12TransactionMaxAggregateInputType = {
    id?: true
    transactionSetId?: true
    transactionType?: true
    isaControlNumber?: true
    gsControlNumber?: true
    stControlNumber?: true
    senderId?: true
    senderQualifier?: true
    receiverId?: true
    receiverQualifier?: true
    rawContent?: true
    status?: true
    acknowledgmentCode?: true
    interchangeDate?: true
    processedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type X12TransactionCountAggregateInputType = {
    id?: true
    transactionSetId?: true
    transactionType?: true
    isaControlNumber?: true
    gsControlNumber?: true
    stControlNumber?: true
    senderId?: true
    senderQualifier?: true
    receiverId?: true
    receiverQualifier?: true
    rawContent?: true
    parsedContent?: true
    status?: true
    acknowledgmentCode?: true
    errors?: true
    interchangeDate?: true
    processedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type X12TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which X12Transaction to aggregate.
     */
    where?: X12TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of X12Transactions to fetch.
     */
    orderBy?: X12TransactionOrderByWithRelationInput | X12TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: X12TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` X12Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` X12Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned X12Transactions
    **/
    _count?: true | X12TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: X12TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: X12TransactionMaxAggregateInputType
  }

  export type GetX12TransactionAggregateType<T extends X12TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateX12Transaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateX12Transaction[P]>
      : GetScalarType<T[P], AggregateX12Transaction[P]>
  }




  export type X12TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: X12TransactionWhereInput
    orderBy?: X12TransactionOrderByWithAggregationInput | X12TransactionOrderByWithAggregationInput[]
    by: X12TransactionScalarFieldEnum[] | X12TransactionScalarFieldEnum
    having?: X12TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: X12TransactionCountAggregateInputType | true
    _min?: X12TransactionMinAggregateInputType
    _max?: X12TransactionMaxAggregateInputType
  }

  export type X12TransactionGroupByOutputType = {
    id: string
    transactionSetId: string
    transactionType: $Enums.X12TransactionType
    isaControlNumber: string
    gsControlNumber: string
    stControlNumber: string
    senderId: string
    senderQualifier: string
    receiverId: string
    receiverQualifier: string
    rawContent: string | null
    parsedContent: JsonValue | null
    status: $Enums.X12Status
    acknowledgmentCode: string | null
    errors: JsonValue | null
    interchangeDate: Date
    processedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: X12TransactionCountAggregateOutputType | null
    _min: X12TransactionMinAggregateOutputType | null
    _max: X12TransactionMaxAggregateOutputType | null
  }

  type GetX12TransactionGroupByPayload<T extends X12TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<X12TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof X12TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], X12TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], X12TransactionGroupByOutputType[P]>
        }
      >
    >


  export type X12TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionSetId?: boolean
    transactionType?: boolean
    isaControlNumber?: boolean
    gsControlNumber?: boolean
    stControlNumber?: boolean
    senderId?: boolean
    senderQualifier?: boolean
    receiverId?: boolean
    receiverQualifier?: boolean
    rawContent?: boolean
    parsedContent?: boolean
    status?: boolean
    acknowledgmentCode?: boolean
    errors?: boolean
    interchangeDate?: boolean
    processedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["x12Transaction"]>

  export type X12TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transactionSetId?: boolean
    transactionType?: boolean
    isaControlNumber?: boolean
    gsControlNumber?: boolean
    stControlNumber?: boolean
    senderId?: boolean
    senderQualifier?: boolean
    receiverId?: boolean
    receiverQualifier?: boolean
    rawContent?: boolean
    parsedContent?: boolean
    status?: boolean
    acknowledgmentCode?: boolean
    errors?: boolean
    interchangeDate?: boolean
    processedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["x12Transaction"]>

  export type X12TransactionSelectScalar = {
    id?: boolean
    transactionSetId?: boolean
    transactionType?: boolean
    isaControlNumber?: boolean
    gsControlNumber?: boolean
    stControlNumber?: boolean
    senderId?: boolean
    senderQualifier?: boolean
    receiverId?: boolean
    receiverQualifier?: boolean
    rawContent?: boolean
    parsedContent?: boolean
    status?: boolean
    acknowledgmentCode?: boolean
    errors?: boolean
    interchangeDate?: boolean
    processedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $X12TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "X12Transaction"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      transactionSetId: string
      transactionType: $Enums.X12TransactionType
      isaControlNumber: string
      gsControlNumber: string
      stControlNumber: string
      senderId: string
      senderQualifier: string
      receiverId: string
      receiverQualifier: string
      rawContent: string | null
      parsedContent: Prisma.JsonValue | null
      status: $Enums.X12Status
      acknowledgmentCode: string | null
      errors: Prisma.JsonValue | null
      interchangeDate: Date
      processedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["x12Transaction"]>
    composites: {}
  }

  type X12TransactionGetPayload<S extends boolean | null | undefined | X12TransactionDefaultArgs> = $Result.GetResult<Prisma.$X12TransactionPayload, S>

  type X12TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<X12TransactionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: X12TransactionCountAggregateInputType | true
    }

  export interface X12TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['X12Transaction'], meta: { name: 'X12Transaction' } }
    /**
     * Find zero or one X12Transaction that matches the filter.
     * @param {X12TransactionFindUniqueArgs} args - Arguments to find a X12Transaction
     * @example
     * // Get one X12Transaction
     * const x12Transaction = await prisma.x12Transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends X12TransactionFindUniqueArgs>(args: SelectSubset<T, X12TransactionFindUniqueArgs<ExtArgs>>): Prisma__X12TransactionClient<$Result.GetResult<Prisma.$X12TransactionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one X12Transaction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {X12TransactionFindUniqueOrThrowArgs} args - Arguments to find a X12Transaction
     * @example
     * // Get one X12Transaction
     * const x12Transaction = await prisma.x12Transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends X12TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, X12TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__X12TransactionClient<$Result.GetResult<Prisma.$X12TransactionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first X12Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {X12TransactionFindFirstArgs} args - Arguments to find a X12Transaction
     * @example
     * // Get one X12Transaction
     * const x12Transaction = await prisma.x12Transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends X12TransactionFindFirstArgs>(args?: SelectSubset<T, X12TransactionFindFirstArgs<ExtArgs>>): Prisma__X12TransactionClient<$Result.GetResult<Prisma.$X12TransactionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first X12Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {X12TransactionFindFirstOrThrowArgs} args - Arguments to find a X12Transaction
     * @example
     * // Get one X12Transaction
     * const x12Transaction = await prisma.x12Transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends X12TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, X12TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__X12TransactionClient<$Result.GetResult<Prisma.$X12TransactionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more X12Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {X12TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all X12Transactions
     * const x12Transactions = await prisma.x12Transaction.findMany()
     * 
     * // Get first 10 X12Transactions
     * const x12Transactions = await prisma.x12Transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const x12TransactionWithIdOnly = await prisma.x12Transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends X12TransactionFindManyArgs>(args?: SelectSubset<T, X12TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$X12TransactionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a X12Transaction.
     * @param {X12TransactionCreateArgs} args - Arguments to create a X12Transaction.
     * @example
     * // Create one X12Transaction
     * const X12Transaction = await prisma.x12Transaction.create({
     *   data: {
     *     // ... data to create a X12Transaction
     *   }
     * })
     * 
     */
    create<T extends X12TransactionCreateArgs>(args: SelectSubset<T, X12TransactionCreateArgs<ExtArgs>>): Prisma__X12TransactionClient<$Result.GetResult<Prisma.$X12TransactionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many X12Transactions.
     * @param {X12TransactionCreateManyArgs} args - Arguments to create many X12Transactions.
     * @example
     * // Create many X12Transactions
     * const x12Transaction = await prisma.x12Transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends X12TransactionCreateManyArgs>(args?: SelectSubset<T, X12TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many X12Transactions and returns the data saved in the database.
     * @param {X12TransactionCreateManyAndReturnArgs} args - Arguments to create many X12Transactions.
     * @example
     * // Create many X12Transactions
     * const x12Transaction = await prisma.x12Transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many X12Transactions and only return the `id`
     * const x12TransactionWithIdOnly = await prisma.x12Transaction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends X12TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, X12TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$X12TransactionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a X12Transaction.
     * @param {X12TransactionDeleteArgs} args - Arguments to delete one X12Transaction.
     * @example
     * // Delete one X12Transaction
     * const X12Transaction = await prisma.x12Transaction.delete({
     *   where: {
     *     // ... filter to delete one X12Transaction
     *   }
     * })
     * 
     */
    delete<T extends X12TransactionDeleteArgs>(args: SelectSubset<T, X12TransactionDeleteArgs<ExtArgs>>): Prisma__X12TransactionClient<$Result.GetResult<Prisma.$X12TransactionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one X12Transaction.
     * @param {X12TransactionUpdateArgs} args - Arguments to update one X12Transaction.
     * @example
     * // Update one X12Transaction
     * const x12Transaction = await prisma.x12Transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends X12TransactionUpdateArgs>(args: SelectSubset<T, X12TransactionUpdateArgs<ExtArgs>>): Prisma__X12TransactionClient<$Result.GetResult<Prisma.$X12TransactionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more X12Transactions.
     * @param {X12TransactionDeleteManyArgs} args - Arguments to filter X12Transactions to delete.
     * @example
     * // Delete a few X12Transactions
     * const { count } = await prisma.x12Transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends X12TransactionDeleteManyArgs>(args?: SelectSubset<T, X12TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more X12Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {X12TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many X12Transactions
     * const x12Transaction = await prisma.x12Transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends X12TransactionUpdateManyArgs>(args: SelectSubset<T, X12TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one X12Transaction.
     * @param {X12TransactionUpsertArgs} args - Arguments to update or create a X12Transaction.
     * @example
     * // Update or create a X12Transaction
     * const x12Transaction = await prisma.x12Transaction.upsert({
     *   create: {
     *     // ... data to create a X12Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the X12Transaction we want to update
     *   }
     * })
     */
    upsert<T extends X12TransactionUpsertArgs>(args: SelectSubset<T, X12TransactionUpsertArgs<ExtArgs>>): Prisma__X12TransactionClient<$Result.GetResult<Prisma.$X12TransactionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of X12Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {X12TransactionCountArgs} args - Arguments to filter X12Transactions to count.
     * @example
     * // Count the number of X12Transactions
     * const count = await prisma.x12Transaction.count({
     *   where: {
     *     // ... the filter for the X12Transactions we want to count
     *   }
     * })
    **/
    count<T extends X12TransactionCountArgs>(
      args?: Subset<T, X12TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], X12TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a X12Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {X12TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends X12TransactionAggregateArgs>(args: Subset<T, X12TransactionAggregateArgs>): Prisma.PrismaPromise<GetX12TransactionAggregateType<T>>

    /**
     * Group by X12Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {X12TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends X12TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: X12TransactionGroupByArgs['orderBy'] }
        : { orderBy?: X12TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, X12TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetX12TransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the X12Transaction model
   */
  readonly fields: X12TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for X12Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__X12TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the X12Transaction model
   */ 
  interface X12TransactionFieldRefs {
    readonly id: FieldRef<"X12Transaction", 'String'>
    readonly transactionSetId: FieldRef<"X12Transaction", 'String'>
    readonly transactionType: FieldRef<"X12Transaction", 'X12TransactionType'>
    readonly isaControlNumber: FieldRef<"X12Transaction", 'String'>
    readonly gsControlNumber: FieldRef<"X12Transaction", 'String'>
    readonly stControlNumber: FieldRef<"X12Transaction", 'String'>
    readonly senderId: FieldRef<"X12Transaction", 'String'>
    readonly senderQualifier: FieldRef<"X12Transaction", 'String'>
    readonly receiverId: FieldRef<"X12Transaction", 'String'>
    readonly receiverQualifier: FieldRef<"X12Transaction", 'String'>
    readonly rawContent: FieldRef<"X12Transaction", 'String'>
    readonly parsedContent: FieldRef<"X12Transaction", 'Json'>
    readonly status: FieldRef<"X12Transaction", 'X12Status'>
    readonly acknowledgmentCode: FieldRef<"X12Transaction", 'String'>
    readonly errors: FieldRef<"X12Transaction", 'Json'>
    readonly interchangeDate: FieldRef<"X12Transaction", 'DateTime'>
    readonly processedAt: FieldRef<"X12Transaction", 'DateTime'>
    readonly createdAt: FieldRef<"X12Transaction", 'DateTime'>
    readonly updatedAt: FieldRef<"X12Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * X12Transaction findUnique
   */
  export type X12TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the X12Transaction
     */
    select?: X12TransactionSelect<ExtArgs> | null
    /**
     * Filter, which X12Transaction to fetch.
     */
    where: X12TransactionWhereUniqueInput
  }

  /**
   * X12Transaction findUniqueOrThrow
   */
  export type X12TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the X12Transaction
     */
    select?: X12TransactionSelect<ExtArgs> | null
    /**
     * Filter, which X12Transaction to fetch.
     */
    where: X12TransactionWhereUniqueInput
  }

  /**
   * X12Transaction findFirst
   */
  export type X12TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the X12Transaction
     */
    select?: X12TransactionSelect<ExtArgs> | null
    /**
     * Filter, which X12Transaction to fetch.
     */
    where?: X12TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of X12Transactions to fetch.
     */
    orderBy?: X12TransactionOrderByWithRelationInput | X12TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for X12Transactions.
     */
    cursor?: X12TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` X12Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` X12Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of X12Transactions.
     */
    distinct?: X12TransactionScalarFieldEnum | X12TransactionScalarFieldEnum[]
  }

  /**
   * X12Transaction findFirstOrThrow
   */
  export type X12TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the X12Transaction
     */
    select?: X12TransactionSelect<ExtArgs> | null
    /**
     * Filter, which X12Transaction to fetch.
     */
    where?: X12TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of X12Transactions to fetch.
     */
    orderBy?: X12TransactionOrderByWithRelationInput | X12TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for X12Transactions.
     */
    cursor?: X12TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` X12Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` X12Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of X12Transactions.
     */
    distinct?: X12TransactionScalarFieldEnum | X12TransactionScalarFieldEnum[]
  }

  /**
   * X12Transaction findMany
   */
  export type X12TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the X12Transaction
     */
    select?: X12TransactionSelect<ExtArgs> | null
    /**
     * Filter, which X12Transactions to fetch.
     */
    where?: X12TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of X12Transactions to fetch.
     */
    orderBy?: X12TransactionOrderByWithRelationInput | X12TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing X12Transactions.
     */
    cursor?: X12TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` X12Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` X12Transactions.
     */
    skip?: number
    distinct?: X12TransactionScalarFieldEnum | X12TransactionScalarFieldEnum[]
  }

  /**
   * X12Transaction create
   */
  export type X12TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the X12Transaction
     */
    select?: X12TransactionSelect<ExtArgs> | null
    /**
     * The data needed to create a X12Transaction.
     */
    data: XOR<X12TransactionCreateInput, X12TransactionUncheckedCreateInput>
  }

  /**
   * X12Transaction createMany
   */
  export type X12TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many X12Transactions.
     */
    data: X12TransactionCreateManyInput | X12TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * X12Transaction createManyAndReturn
   */
  export type X12TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the X12Transaction
     */
    select?: X12TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many X12Transactions.
     */
    data: X12TransactionCreateManyInput | X12TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * X12Transaction update
   */
  export type X12TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the X12Transaction
     */
    select?: X12TransactionSelect<ExtArgs> | null
    /**
     * The data needed to update a X12Transaction.
     */
    data: XOR<X12TransactionUpdateInput, X12TransactionUncheckedUpdateInput>
    /**
     * Choose, which X12Transaction to update.
     */
    where: X12TransactionWhereUniqueInput
  }

  /**
   * X12Transaction updateMany
   */
  export type X12TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update X12Transactions.
     */
    data: XOR<X12TransactionUpdateManyMutationInput, X12TransactionUncheckedUpdateManyInput>
    /**
     * Filter which X12Transactions to update
     */
    where?: X12TransactionWhereInput
  }

  /**
   * X12Transaction upsert
   */
  export type X12TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the X12Transaction
     */
    select?: X12TransactionSelect<ExtArgs> | null
    /**
     * The filter to search for the X12Transaction to update in case it exists.
     */
    where: X12TransactionWhereUniqueInput
    /**
     * In case the X12Transaction found by the `where` argument doesn't exist, create a new X12Transaction with this data.
     */
    create: XOR<X12TransactionCreateInput, X12TransactionUncheckedCreateInput>
    /**
     * In case the X12Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<X12TransactionUpdateInput, X12TransactionUncheckedUpdateInput>
  }

  /**
   * X12Transaction delete
   */
  export type X12TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the X12Transaction
     */
    select?: X12TransactionSelect<ExtArgs> | null
    /**
     * Filter which X12Transaction to delete.
     */
    where: X12TransactionWhereUniqueInput
  }

  /**
   * X12Transaction deleteMany
   */
  export type X12TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which X12Transactions to delete
     */
    where?: X12TransactionWhereInput
  }

  /**
   * X12Transaction without action
   */
  export type X12TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the X12Transaction
     */
    select?: X12TransactionSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TradingPartnerScalarFieldEnum: {
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

  export type TradingPartnerScalarFieldEnum = (typeof TradingPartnerScalarFieldEnum)[keyof typeof TradingPartnerScalarFieldEnum]


  export const TransactionLogScalarFieldEnum: {
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

  export type TransactionLogScalarFieldEnum = (typeof TransactionLogScalarFieldEnum)[keyof typeof TransactionLogScalarFieldEnum]


  export const NetworkParticipantScalarFieldEnum: {
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

  export type NetworkParticipantScalarFieldEnum = (typeof NetworkParticipantScalarFieldEnum)[keyof typeof NetworkParticipantScalarFieldEnum]


  export const DirectAddressScalarFieldEnum: {
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

  export type DirectAddressScalarFieldEnum = (typeof DirectAddressScalarFieldEnum)[keyof typeof DirectAddressScalarFieldEnum]


  export const FhirEndpointScalarFieldEnum: {
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

  export type FhirEndpointScalarFieldEnum = (typeof FhirEndpointScalarFieldEnum)[keyof typeof FhirEndpointScalarFieldEnum]


  export const CCDADocumentScalarFieldEnum: {
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

  export type CCDADocumentScalarFieldEnum = (typeof CCDADocumentScalarFieldEnum)[keyof typeof CCDADocumentScalarFieldEnum]


  export const X12TransactionScalarFieldEnum: {
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

  export type X12TransactionScalarFieldEnum = (typeof X12TransactionScalarFieldEnum)[keyof typeof X12TransactionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'TradingPartnerType'
   */
  export type EnumTradingPartnerTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradingPartnerType'>
    


  /**
   * Reference to a field of type 'TradingPartnerType[]'
   */
  export type ListEnumTradingPartnerTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradingPartnerType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'PartnerStatus'
   */
  export type EnumPartnerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PartnerStatus'>
    


  /**
   * Reference to a field of type 'PartnerStatus[]'
   */
  export type ListEnumPartnerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PartnerStatus[]'>
    


  /**
   * Reference to a field of type 'AuthenticationType'
   */
  export type EnumAuthenticationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthenticationType'>
    


  /**
   * Reference to a field of type 'AuthenticationType[]'
   */
  export type ListEnumAuthenticationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthenticationType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TransactionType'
   */
  export type EnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType'>
    


  /**
   * Reference to a field of type 'TransactionType[]'
   */
  export type ListEnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType[]'>
    


  /**
   * Reference to a field of type 'TransactionDirection'
   */
  export type EnumTransactionDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionDirection'>
    


  /**
   * Reference to a field of type 'TransactionDirection[]'
   */
  export type ListEnumTransactionDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionDirection[]'>
    


  /**
   * Reference to a field of type 'TransactionStatus'
   */
  export type EnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus'>
    


  /**
   * Reference to a field of type 'TransactionStatus[]'
   */
  export type ListEnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus[]'>
    


  /**
   * Reference to a field of type 'HealthcareNetwork'
   */
  export type EnumHealthcareNetworkFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HealthcareNetwork'>
    


  /**
   * Reference to a field of type 'HealthcareNetwork[]'
   */
  export type ListEnumHealthcareNetworkFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HealthcareNetwork[]'>
    


  /**
   * Reference to a field of type 'ParticipantStatus'
   */
  export type EnumParticipantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ParticipantStatus'>
    


  /**
   * Reference to a field of type 'ParticipantStatus[]'
   */
  export type ListEnumParticipantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ParticipantStatus[]'>
    


  /**
   * Reference to a field of type 'DirectAddressStatus'
   */
  export type EnumDirectAddressStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DirectAddressStatus'>
    


  /**
   * Reference to a field of type 'DirectAddressStatus[]'
   */
  export type ListEnumDirectAddressStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DirectAddressStatus[]'>
    


  /**
   * Reference to a field of type 'DirectAddressOwner'
   */
  export type EnumDirectAddressOwnerFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DirectAddressOwner'>
    


  /**
   * Reference to a field of type 'DirectAddressOwner[]'
   */
  export type ListEnumDirectAddressOwnerFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DirectAddressOwner[]'>
    


  /**
   * Reference to a field of type 'EndpointStatus'
   */
  export type EnumEndpointStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EndpointStatus'>
    


  /**
   * Reference to a field of type 'EndpointStatus[]'
   */
  export type ListEnumEndpointStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EndpointStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'CCDADocumentType'
   */
  export type EnumCCDADocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CCDADocumentType'>
    


  /**
   * Reference to a field of type 'CCDADocumentType[]'
   */
  export type ListEnumCCDADocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CCDADocumentType[]'>
    


  /**
   * Reference to a field of type 'DocumentExchangeStatus'
   */
  export type EnumDocumentExchangeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentExchangeStatus'>
    


  /**
   * Reference to a field of type 'DocumentExchangeStatus[]'
   */
  export type ListEnumDocumentExchangeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentExchangeStatus[]'>
    


  /**
   * Reference to a field of type 'X12TransactionType'
   */
  export type EnumX12TransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'X12TransactionType'>
    


  /**
   * Reference to a field of type 'X12TransactionType[]'
   */
  export type ListEnumX12TransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'X12TransactionType[]'>
    


  /**
   * Reference to a field of type 'X12Status'
   */
  export type EnumX12StatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'X12Status'>
    


  /**
   * Reference to a field of type 'X12Status[]'
   */
  export type ListEnumX12StatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'X12Status[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type TradingPartnerWhereInput = {
    AND?: TradingPartnerWhereInput | TradingPartnerWhereInput[]
    OR?: TradingPartnerWhereInput[]
    NOT?: TradingPartnerWhereInput | TradingPartnerWhereInput[]
    id?: StringFilter<"TradingPartner"> | string
    name?: StringFilter<"TradingPartner"> | string
    type?: EnumTradingPartnerTypeFilter<"TradingPartner"> | $Enums.TradingPartnerType
    endpoint?: StringFilter<"TradingPartner"> | string
    certificates?: JsonNullableFilter<"TradingPartner">
    status?: EnumPartnerStatusFilter<"TradingPartner"> | $Enums.PartnerStatus
    authType?: EnumAuthenticationTypeFilter<"TradingPartner"> | $Enums.AuthenticationType
    clientId?: StringNullableFilter<"TradingPartner"> | string | null
    clientSecret?: StringNullableFilter<"TradingPartner"> | string | null
    tokenEndpoint?: StringNullableFilter<"TradingPartner"> | string | null
    scopes?: StringNullableListFilter<"TradingPartner">
    fhirVersion?: StringNullableFilter<"TradingPartner"> | string | null
    supportedProfiles?: StringNullableListFilter<"TradingPartner">
    isaId?: StringNullableFilter<"TradingPartner"> | string | null
    gsId?: StringNullableFilter<"TradingPartner"> | string | null
    directDomain?: StringNullableFilter<"TradingPartner"> | string | null
    smtpHost?: StringNullableFilter<"TradingPartner"> | string | null
    smtpPort?: IntNullableFilter<"TradingPartner"> | number | null
    contactName?: StringNullableFilter<"TradingPartner"> | string | null
    contactEmail?: StringNullableFilter<"TradingPartner"> | string | null
    contactPhone?: StringNullableFilter<"TradingPartner"> | string | null
    notes?: StringNullableFilter<"TradingPartner"> | string | null
    createdAt?: DateTimeFilter<"TradingPartner"> | Date | string
    updatedAt?: DateTimeFilter<"TradingPartner"> | Date | string
    transactions?: TransactionLogListRelationFilter
  }

  export type TradingPartnerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    endpoint?: SortOrder
    certificates?: SortOrderInput | SortOrder
    status?: SortOrder
    authType?: SortOrder
    clientId?: SortOrderInput | SortOrder
    clientSecret?: SortOrderInput | SortOrder
    tokenEndpoint?: SortOrderInput | SortOrder
    scopes?: SortOrder
    fhirVersion?: SortOrderInput | SortOrder
    supportedProfiles?: SortOrder
    isaId?: SortOrderInput | SortOrder
    gsId?: SortOrderInput | SortOrder
    directDomain?: SortOrderInput | SortOrder
    smtpHost?: SortOrderInput | SortOrder
    smtpPort?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transactions?: TransactionLogOrderByRelationAggregateInput
  }

  export type TradingPartnerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradingPartnerWhereInput | TradingPartnerWhereInput[]
    OR?: TradingPartnerWhereInput[]
    NOT?: TradingPartnerWhereInput | TradingPartnerWhereInput[]
    name?: StringFilter<"TradingPartner"> | string
    type?: EnumTradingPartnerTypeFilter<"TradingPartner"> | $Enums.TradingPartnerType
    endpoint?: StringFilter<"TradingPartner"> | string
    certificates?: JsonNullableFilter<"TradingPartner">
    status?: EnumPartnerStatusFilter<"TradingPartner"> | $Enums.PartnerStatus
    authType?: EnumAuthenticationTypeFilter<"TradingPartner"> | $Enums.AuthenticationType
    clientId?: StringNullableFilter<"TradingPartner"> | string | null
    clientSecret?: StringNullableFilter<"TradingPartner"> | string | null
    tokenEndpoint?: StringNullableFilter<"TradingPartner"> | string | null
    scopes?: StringNullableListFilter<"TradingPartner">
    fhirVersion?: StringNullableFilter<"TradingPartner"> | string | null
    supportedProfiles?: StringNullableListFilter<"TradingPartner">
    isaId?: StringNullableFilter<"TradingPartner"> | string | null
    gsId?: StringNullableFilter<"TradingPartner"> | string | null
    directDomain?: StringNullableFilter<"TradingPartner"> | string | null
    smtpHost?: StringNullableFilter<"TradingPartner"> | string | null
    smtpPort?: IntNullableFilter<"TradingPartner"> | number | null
    contactName?: StringNullableFilter<"TradingPartner"> | string | null
    contactEmail?: StringNullableFilter<"TradingPartner"> | string | null
    contactPhone?: StringNullableFilter<"TradingPartner"> | string | null
    notes?: StringNullableFilter<"TradingPartner"> | string | null
    createdAt?: DateTimeFilter<"TradingPartner"> | Date | string
    updatedAt?: DateTimeFilter<"TradingPartner"> | Date | string
    transactions?: TransactionLogListRelationFilter
  }, "id">

  export type TradingPartnerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    endpoint?: SortOrder
    certificates?: SortOrderInput | SortOrder
    status?: SortOrder
    authType?: SortOrder
    clientId?: SortOrderInput | SortOrder
    clientSecret?: SortOrderInput | SortOrder
    tokenEndpoint?: SortOrderInput | SortOrder
    scopes?: SortOrder
    fhirVersion?: SortOrderInput | SortOrder
    supportedProfiles?: SortOrder
    isaId?: SortOrderInput | SortOrder
    gsId?: SortOrderInput | SortOrder
    directDomain?: SortOrderInput | SortOrder
    smtpHost?: SortOrderInput | SortOrder
    smtpPort?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TradingPartnerCountOrderByAggregateInput
    _avg?: TradingPartnerAvgOrderByAggregateInput
    _max?: TradingPartnerMaxOrderByAggregateInput
    _min?: TradingPartnerMinOrderByAggregateInput
    _sum?: TradingPartnerSumOrderByAggregateInput
  }

  export type TradingPartnerScalarWhereWithAggregatesInput = {
    AND?: TradingPartnerScalarWhereWithAggregatesInput | TradingPartnerScalarWhereWithAggregatesInput[]
    OR?: TradingPartnerScalarWhereWithAggregatesInput[]
    NOT?: TradingPartnerScalarWhereWithAggregatesInput | TradingPartnerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradingPartner"> | string
    name?: StringWithAggregatesFilter<"TradingPartner"> | string
    type?: EnumTradingPartnerTypeWithAggregatesFilter<"TradingPartner"> | $Enums.TradingPartnerType
    endpoint?: StringWithAggregatesFilter<"TradingPartner"> | string
    certificates?: JsonNullableWithAggregatesFilter<"TradingPartner">
    status?: EnumPartnerStatusWithAggregatesFilter<"TradingPartner"> | $Enums.PartnerStatus
    authType?: EnumAuthenticationTypeWithAggregatesFilter<"TradingPartner"> | $Enums.AuthenticationType
    clientId?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    clientSecret?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    tokenEndpoint?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    scopes?: StringNullableListFilter<"TradingPartner">
    fhirVersion?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    supportedProfiles?: StringNullableListFilter<"TradingPartner">
    isaId?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    gsId?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    directDomain?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    smtpHost?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    smtpPort?: IntNullableWithAggregatesFilter<"TradingPartner"> | number | null
    contactName?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    contactEmail?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    contactPhone?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    notes?: StringNullableWithAggregatesFilter<"TradingPartner"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TradingPartner"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TradingPartner"> | Date | string
  }

  export type TransactionLogWhereInput = {
    AND?: TransactionLogWhereInput | TransactionLogWhereInput[]
    OR?: TransactionLogWhereInput[]
    NOT?: TransactionLogWhereInput | TransactionLogWhereInput[]
    id?: StringFilter<"TransactionLog"> | string
    transactionId?: StringFilter<"TransactionLog"> | string
    type?: EnumTransactionTypeFilter<"TransactionLog"> | $Enums.TransactionType
    direction?: EnumTransactionDirectionFilter<"TransactionLog"> | $Enums.TransactionDirection
    status?: EnumTransactionStatusFilter<"TransactionLog"> | $Enums.TransactionStatus
    partnerId?: StringNullableFilter<"TransactionLog"> | string | null
    payload?: JsonNullableFilter<"TransactionLog">
    payloadHash?: StringNullableFilter<"TransactionLog"> | string | null
    contentType?: StringNullableFilter<"TransactionLog"> | string | null
    requestUrl?: StringNullableFilter<"TransactionLog"> | string | null
    requestMethod?: StringNullableFilter<"TransactionLog"> | string | null
    responseCode?: IntNullableFilter<"TransactionLog"> | number | null
    responseMessage?: StringNullableFilter<"TransactionLog"> | string | null
    errorCode?: StringNullableFilter<"TransactionLog"> | string | null
    errorMessage?: StringNullableFilter<"TransactionLog"> | string | null
    retryCount?: IntFilter<"TransactionLog"> | number
    maxRetries?: IntFilter<"TransactionLog"> | number
    initiatedAt?: DateTimeFilter<"TransactionLog"> | Date | string
    completedAt?: DateTimeNullableFilter<"TransactionLog"> | Date | string | null
    processingTimeMs?: IntNullableFilter<"TransactionLog"> | number | null
    userId?: StringNullableFilter<"TransactionLog"> | string | null
    correlationId?: StringNullableFilter<"TransactionLog"> | string | null
    createdAt?: DateTimeFilter<"TransactionLog"> | Date | string
    updatedAt?: DateTimeFilter<"TransactionLog"> | Date | string
    partner?: XOR<TradingPartnerNullableRelationFilter, TradingPartnerWhereInput> | null
  }

  export type TransactionLogOrderByWithRelationInput = {
    id?: SortOrder
    transactionId?: SortOrder
    type?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    partnerId?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    payloadHash?: SortOrderInput | SortOrder
    contentType?: SortOrderInput | SortOrder
    requestUrl?: SortOrderInput | SortOrder
    requestMethod?: SortOrderInput | SortOrder
    responseCode?: SortOrderInput | SortOrder
    responseMessage?: SortOrderInput | SortOrder
    errorCode?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    maxRetries?: SortOrder
    initiatedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    processingTimeMs?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    correlationId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    partner?: TradingPartnerOrderByWithRelationInput
  }

  export type TransactionLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    transactionId?: string
    AND?: TransactionLogWhereInput | TransactionLogWhereInput[]
    OR?: TransactionLogWhereInput[]
    NOT?: TransactionLogWhereInput | TransactionLogWhereInput[]
    type?: EnumTransactionTypeFilter<"TransactionLog"> | $Enums.TransactionType
    direction?: EnumTransactionDirectionFilter<"TransactionLog"> | $Enums.TransactionDirection
    status?: EnumTransactionStatusFilter<"TransactionLog"> | $Enums.TransactionStatus
    partnerId?: StringNullableFilter<"TransactionLog"> | string | null
    payload?: JsonNullableFilter<"TransactionLog">
    payloadHash?: StringNullableFilter<"TransactionLog"> | string | null
    contentType?: StringNullableFilter<"TransactionLog"> | string | null
    requestUrl?: StringNullableFilter<"TransactionLog"> | string | null
    requestMethod?: StringNullableFilter<"TransactionLog"> | string | null
    responseCode?: IntNullableFilter<"TransactionLog"> | number | null
    responseMessage?: StringNullableFilter<"TransactionLog"> | string | null
    errorCode?: StringNullableFilter<"TransactionLog"> | string | null
    errorMessage?: StringNullableFilter<"TransactionLog"> | string | null
    retryCount?: IntFilter<"TransactionLog"> | number
    maxRetries?: IntFilter<"TransactionLog"> | number
    initiatedAt?: DateTimeFilter<"TransactionLog"> | Date | string
    completedAt?: DateTimeNullableFilter<"TransactionLog"> | Date | string | null
    processingTimeMs?: IntNullableFilter<"TransactionLog"> | number | null
    userId?: StringNullableFilter<"TransactionLog"> | string | null
    correlationId?: StringNullableFilter<"TransactionLog"> | string | null
    createdAt?: DateTimeFilter<"TransactionLog"> | Date | string
    updatedAt?: DateTimeFilter<"TransactionLog"> | Date | string
    partner?: XOR<TradingPartnerNullableRelationFilter, TradingPartnerWhereInput> | null
  }, "id" | "transactionId">

  export type TransactionLogOrderByWithAggregationInput = {
    id?: SortOrder
    transactionId?: SortOrder
    type?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    partnerId?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    payloadHash?: SortOrderInput | SortOrder
    contentType?: SortOrderInput | SortOrder
    requestUrl?: SortOrderInput | SortOrder
    requestMethod?: SortOrderInput | SortOrder
    responseCode?: SortOrderInput | SortOrder
    responseMessage?: SortOrderInput | SortOrder
    errorCode?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    maxRetries?: SortOrder
    initiatedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    processingTimeMs?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    correlationId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransactionLogCountOrderByAggregateInput
    _avg?: TransactionLogAvgOrderByAggregateInput
    _max?: TransactionLogMaxOrderByAggregateInput
    _min?: TransactionLogMinOrderByAggregateInput
    _sum?: TransactionLogSumOrderByAggregateInput
  }

  export type TransactionLogScalarWhereWithAggregatesInput = {
    AND?: TransactionLogScalarWhereWithAggregatesInput | TransactionLogScalarWhereWithAggregatesInput[]
    OR?: TransactionLogScalarWhereWithAggregatesInput[]
    NOT?: TransactionLogScalarWhereWithAggregatesInput | TransactionLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TransactionLog"> | string
    transactionId?: StringWithAggregatesFilter<"TransactionLog"> | string
    type?: EnumTransactionTypeWithAggregatesFilter<"TransactionLog"> | $Enums.TransactionType
    direction?: EnumTransactionDirectionWithAggregatesFilter<"TransactionLog"> | $Enums.TransactionDirection
    status?: EnumTransactionStatusWithAggregatesFilter<"TransactionLog"> | $Enums.TransactionStatus
    partnerId?: StringNullableWithAggregatesFilter<"TransactionLog"> | string | null
    payload?: JsonNullableWithAggregatesFilter<"TransactionLog">
    payloadHash?: StringNullableWithAggregatesFilter<"TransactionLog"> | string | null
    contentType?: StringNullableWithAggregatesFilter<"TransactionLog"> | string | null
    requestUrl?: StringNullableWithAggregatesFilter<"TransactionLog"> | string | null
    requestMethod?: StringNullableWithAggregatesFilter<"TransactionLog"> | string | null
    responseCode?: IntNullableWithAggregatesFilter<"TransactionLog"> | number | null
    responseMessage?: StringNullableWithAggregatesFilter<"TransactionLog"> | string | null
    errorCode?: StringNullableWithAggregatesFilter<"TransactionLog"> | string | null
    errorMessage?: StringNullableWithAggregatesFilter<"TransactionLog"> | string | null
    retryCount?: IntWithAggregatesFilter<"TransactionLog"> | number
    maxRetries?: IntWithAggregatesFilter<"TransactionLog"> | number
    initiatedAt?: DateTimeWithAggregatesFilter<"TransactionLog"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"TransactionLog"> | Date | string | null
    processingTimeMs?: IntNullableWithAggregatesFilter<"TransactionLog"> | number | null
    userId?: StringNullableWithAggregatesFilter<"TransactionLog"> | string | null
    correlationId?: StringNullableWithAggregatesFilter<"TransactionLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TransactionLog"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TransactionLog"> | Date | string
  }

  export type NetworkParticipantWhereInput = {
    AND?: NetworkParticipantWhereInput | NetworkParticipantWhereInput[]
    OR?: NetworkParticipantWhereInput[]
    NOT?: NetworkParticipantWhereInput | NetworkParticipantWhereInput[]
    id?: StringFilter<"NetworkParticipant"> | string
    network?: EnumHealthcareNetworkFilter<"NetworkParticipant"> | $Enums.HealthcareNetwork
    participantId?: StringFilter<"NetworkParticipant"> | string
    status?: EnumParticipantStatusFilter<"NetworkParticipant"> | $Enums.ParticipantStatus
    organizationName?: StringFilter<"NetworkParticipant"> | string
    organizationOid?: StringNullableFilter<"NetworkParticipant"> | string | null
    npi?: StringNullableFilter<"NetworkParticipant"> | string | null
    capabilities?: JsonNullableFilter<"NetworkParticipant">
    supportedPurposes?: StringNullableListFilter<"NetworkParticipant">
    queryEndpoint?: StringNullableFilter<"NetworkParticipant"> | string | null
    retrieveEndpoint?: StringNullableFilter<"NetworkParticipant"> | string | null
    submitEndpoint?: StringNullableFilter<"NetworkParticipant"> | string | null
    certificates?: JsonNullableFilter<"NetworkParticipant">
    tefcaRole?: StringNullableFilter<"NetworkParticipant"> | string | null
    carequalityId?: StringNullableFilter<"NetworkParticipant"> | string | null
    implementerOid?: StringNullableFilter<"NetworkParticipant"> | string | null
    commonwellId?: StringNullableFilter<"NetworkParticipant"> | string | null
    commonwellOrgId?: StringNullableFilter<"NetworkParticipant"> | string | null
    enrollmentDate?: DateTimeNullableFilter<"NetworkParticipant"> | Date | string | null
    lastVerified?: DateTimeNullableFilter<"NetworkParticipant"> | Date | string | null
    createdAt?: DateTimeFilter<"NetworkParticipant"> | Date | string
    updatedAt?: DateTimeFilter<"NetworkParticipant"> | Date | string
  }

  export type NetworkParticipantOrderByWithRelationInput = {
    id?: SortOrder
    network?: SortOrder
    participantId?: SortOrder
    status?: SortOrder
    organizationName?: SortOrder
    organizationOid?: SortOrderInput | SortOrder
    npi?: SortOrderInput | SortOrder
    capabilities?: SortOrderInput | SortOrder
    supportedPurposes?: SortOrder
    queryEndpoint?: SortOrderInput | SortOrder
    retrieveEndpoint?: SortOrderInput | SortOrder
    submitEndpoint?: SortOrderInput | SortOrder
    certificates?: SortOrderInput | SortOrder
    tefcaRole?: SortOrderInput | SortOrder
    carequalityId?: SortOrderInput | SortOrder
    implementerOid?: SortOrderInput | SortOrder
    commonwellId?: SortOrderInput | SortOrder
    commonwellOrgId?: SortOrderInput | SortOrder
    enrollmentDate?: SortOrderInput | SortOrder
    lastVerified?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NetworkParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    network_participantId?: NetworkParticipantNetworkParticipantIdCompoundUniqueInput
    AND?: NetworkParticipantWhereInput | NetworkParticipantWhereInput[]
    OR?: NetworkParticipantWhereInput[]
    NOT?: NetworkParticipantWhereInput | NetworkParticipantWhereInput[]
    network?: EnumHealthcareNetworkFilter<"NetworkParticipant"> | $Enums.HealthcareNetwork
    participantId?: StringFilter<"NetworkParticipant"> | string
    status?: EnumParticipantStatusFilter<"NetworkParticipant"> | $Enums.ParticipantStatus
    organizationName?: StringFilter<"NetworkParticipant"> | string
    organizationOid?: StringNullableFilter<"NetworkParticipant"> | string | null
    npi?: StringNullableFilter<"NetworkParticipant"> | string | null
    capabilities?: JsonNullableFilter<"NetworkParticipant">
    supportedPurposes?: StringNullableListFilter<"NetworkParticipant">
    queryEndpoint?: StringNullableFilter<"NetworkParticipant"> | string | null
    retrieveEndpoint?: StringNullableFilter<"NetworkParticipant"> | string | null
    submitEndpoint?: StringNullableFilter<"NetworkParticipant"> | string | null
    certificates?: JsonNullableFilter<"NetworkParticipant">
    tefcaRole?: StringNullableFilter<"NetworkParticipant"> | string | null
    carequalityId?: StringNullableFilter<"NetworkParticipant"> | string | null
    implementerOid?: StringNullableFilter<"NetworkParticipant"> | string | null
    commonwellId?: StringNullableFilter<"NetworkParticipant"> | string | null
    commonwellOrgId?: StringNullableFilter<"NetworkParticipant"> | string | null
    enrollmentDate?: DateTimeNullableFilter<"NetworkParticipant"> | Date | string | null
    lastVerified?: DateTimeNullableFilter<"NetworkParticipant"> | Date | string | null
    createdAt?: DateTimeFilter<"NetworkParticipant"> | Date | string
    updatedAt?: DateTimeFilter<"NetworkParticipant"> | Date | string
  }, "id" | "network_participantId">

  export type NetworkParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    network?: SortOrder
    participantId?: SortOrder
    status?: SortOrder
    organizationName?: SortOrder
    organizationOid?: SortOrderInput | SortOrder
    npi?: SortOrderInput | SortOrder
    capabilities?: SortOrderInput | SortOrder
    supportedPurposes?: SortOrder
    queryEndpoint?: SortOrderInput | SortOrder
    retrieveEndpoint?: SortOrderInput | SortOrder
    submitEndpoint?: SortOrderInput | SortOrder
    certificates?: SortOrderInput | SortOrder
    tefcaRole?: SortOrderInput | SortOrder
    carequalityId?: SortOrderInput | SortOrder
    implementerOid?: SortOrderInput | SortOrder
    commonwellId?: SortOrderInput | SortOrder
    commonwellOrgId?: SortOrderInput | SortOrder
    enrollmentDate?: SortOrderInput | SortOrder
    lastVerified?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NetworkParticipantCountOrderByAggregateInput
    _max?: NetworkParticipantMaxOrderByAggregateInput
    _min?: NetworkParticipantMinOrderByAggregateInput
  }

  export type NetworkParticipantScalarWhereWithAggregatesInput = {
    AND?: NetworkParticipantScalarWhereWithAggregatesInput | NetworkParticipantScalarWhereWithAggregatesInput[]
    OR?: NetworkParticipantScalarWhereWithAggregatesInput[]
    NOT?: NetworkParticipantScalarWhereWithAggregatesInput | NetworkParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NetworkParticipant"> | string
    network?: EnumHealthcareNetworkWithAggregatesFilter<"NetworkParticipant"> | $Enums.HealthcareNetwork
    participantId?: StringWithAggregatesFilter<"NetworkParticipant"> | string
    status?: EnumParticipantStatusWithAggregatesFilter<"NetworkParticipant"> | $Enums.ParticipantStatus
    organizationName?: StringWithAggregatesFilter<"NetworkParticipant"> | string
    organizationOid?: StringNullableWithAggregatesFilter<"NetworkParticipant"> | string | null
    npi?: StringNullableWithAggregatesFilter<"NetworkParticipant"> | string | null
    capabilities?: JsonNullableWithAggregatesFilter<"NetworkParticipant">
    supportedPurposes?: StringNullableListFilter<"NetworkParticipant">
    queryEndpoint?: StringNullableWithAggregatesFilter<"NetworkParticipant"> | string | null
    retrieveEndpoint?: StringNullableWithAggregatesFilter<"NetworkParticipant"> | string | null
    submitEndpoint?: StringNullableWithAggregatesFilter<"NetworkParticipant"> | string | null
    certificates?: JsonNullableWithAggregatesFilter<"NetworkParticipant">
    tefcaRole?: StringNullableWithAggregatesFilter<"NetworkParticipant"> | string | null
    carequalityId?: StringNullableWithAggregatesFilter<"NetworkParticipant"> | string | null
    implementerOid?: StringNullableWithAggregatesFilter<"NetworkParticipant"> | string | null
    commonwellId?: StringNullableWithAggregatesFilter<"NetworkParticipant"> | string | null
    commonwellOrgId?: StringNullableWithAggregatesFilter<"NetworkParticipant"> | string | null
    enrollmentDate?: DateTimeNullableWithAggregatesFilter<"NetworkParticipant"> | Date | string | null
    lastVerified?: DateTimeNullableWithAggregatesFilter<"NetworkParticipant"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"NetworkParticipant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NetworkParticipant"> | Date | string
  }

  export type DirectAddressWhereInput = {
    AND?: DirectAddressWhereInput | DirectAddressWhereInput[]
    OR?: DirectAddressWhereInput[]
    NOT?: DirectAddressWhereInput | DirectAddressWhereInput[]
    id?: StringFilter<"DirectAddress"> | string
    address?: StringFilter<"DirectAddress"> | string
    certificate?: StringNullableFilter<"DirectAddress"> | string | null
    privateKey?: StringNullableFilter<"DirectAddress"> | string | null
    domain?: StringFilter<"DirectAddress"> | string
    status?: EnumDirectAddressStatusFilter<"DirectAddress"> | $Enums.DirectAddressStatus
    ownerType?: EnumDirectAddressOwnerFilter<"DirectAddress"> | $Enums.DirectAddressOwner
    ownerId?: StringFilter<"DirectAddress"> | string
    ownerName?: StringNullableFilter<"DirectAddress"> | string | null
    trustAnchor?: StringNullableFilter<"DirectAddress"> | string | null
    trustBundle?: StringNullableFilter<"DirectAddress"> | string | null
    certificateExpiry?: DateTimeNullableFilter<"DirectAddress"> | Date | string | null
    issuerDn?: StringNullableFilter<"DirectAddress"> | string | null
    subjectDn?: StringNullableFilter<"DirectAddress"> | string | null
    hispId?: StringNullableFilter<"DirectAddress"> | string | null
    hispName?: StringNullableFilter<"DirectAddress"> | string | null
    messagesSent?: IntFilter<"DirectAddress"> | number
    messagesReceived?: IntFilter<"DirectAddress"> | number
    lastActivity?: DateTimeNullableFilter<"DirectAddress"> | Date | string | null
    createdAt?: DateTimeFilter<"DirectAddress"> | Date | string
    updatedAt?: DateTimeFilter<"DirectAddress"> | Date | string
  }

  export type DirectAddressOrderByWithRelationInput = {
    id?: SortOrder
    address?: SortOrder
    certificate?: SortOrderInput | SortOrder
    privateKey?: SortOrderInput | SortOrder
    domain?: SortOrder
    status?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    ownerName?: SortOrderInput | SortOrder
    trustAnchor?: SortOrderInput | SortOrder
    trustBundle?: SortOrderInput | SortOrder
    certificateExpiry?: SortOrderInput | SortOrder
    issuerDn?: SortOrderInput | SortOrder
    subjectDn?: SortOrderInput | SortOrder
    hispId?: SortOrderInput | SortOrder
    hispName?: SortOrderInput | SortOrder
    messagesSent?: SortOrder
    messagesReceived?: SortOrder
    lastActivity?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DirectAddressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    address?: string
    AND?: DirectAddressWhereInput | DirectAddressWhereInput[]
    OR?: DirectAddressWhereInput[]
    NOT?: DirectAddressWhereInput | DirectAddressWhereInput[]
    certificate?: StringNullableFilter<"DirectAddress"> | string | null
    privateKey?: StringNullableFilter<"DirectAddress"> | string | null
    domain?: StringFilter<"DirectAddress"> | string
    status?: EnumDirectAddressStatusFilter<"DirectAddress"> | $Enums.DirectAddressStatus
    ownerType?: EnumDirectAddressOwnerFilter<"DirectAddress"> | $Enums.DirectAddressOwner
    ownerId?: StringFilter<"DirectAddress"> | string
    ownerName?: StringNullableFilter<"DirectAddress"> | string | null
    trustAnchor?: StringNullableFilter<"DirectAddress"> | string | null
    trustBundle?: StringNullableFilter<"DirectAddress"> | string | null
    certificateExpiry?: DateTimeNullableFilter<"DirectAddress"> | Date | string | null
    issuerDn?: StringNullableFilter<"DirectAddress"> | string | null
    subjectDn?: StringNullableFilter<"DirectAddress"> | string | null
    hispId?: StringNullableFilter<"DirectAddress"> | string | null
    hispName?: StringNullableFilter<"DirectAddress"> | string | null
    messagesSent?: IntFilter<"DirectAddress"> | number
    messagesReceived?: IntFilter<"DirectAddress"> | number
    lastActivity?: DateTimeNullableFilter<"DirectAddress"> | Date | string | null
    createdAt?: DateTimeFilter<"DirectAddress"> | Date | string
    updatedAt?: DateTimeFilter<"DirectAddress"> | Date | string
  }, "id" | "address">

  export type DirectAddressOrderByWithAggregationInput = {
    id?: SortOrder
    address?: SortOrder
    certificate?: SortOrderInput | SortOrder
    privateKey?: SortOrderInput | SortOrder
    domain?: SortOrder
    status?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    ownerName?: SortOrderInput | SortOrder
    trustAnchor?: SortOrderInput | SortOrder
    trustBundle?: SortOrderInput | SortOrder
    certificateExpiry?: SortOrderInput | SortOrder
    issuerDn?: SortOrderInput | SortOrder
    subjectDn?: SortOrderInput | SortOrder
    hispId?: SortOrderInput | SortOrder
    hispName?: SortOrderInput | SortOrder
    messagesSent?: SortOrder
    messagesReceived?: SortOrder
    lastActivity?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DirectAddressCountOrderByAggregateInput
    _avg?: DirectAddressAvgOrderByAggregateInput
    _max?: DirectAddressMaxOrderByAggregateInput
    _min?: DirectAddressMinOrderByAggregateInput
    _sum?: DirectAddressSumOrderByAggregateInput
  }

  export type DirectAddressScalarWhereWithAggregatesInput = {
    AND?: DirectAddressScalarWhereWithAggregatesInput | DirectAddressScalarWhereWithAggregatesInput[]
    OR?: DirectAddressScalarWhereWithAggregatesInput[]
    NOT?: DirectAddressScalarWhereWithAggregatesInput | DirectAddressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DirectAddress"> | string
    address?: StringWithAggregatesFilter<"DirectAddress"> | string
    certificate?: StringNullableWithAggregatesFilter<"DirectAddress"> | string | null
    privateKey?: StringNullableWithAggregatesFilter<"DirectAddress"> | string | null
    domain?: StringWithAggregatesFilter<"DirectAddress"> | string
    status?: EnumDirectAddressStatusWithAggregatesFilter<"DirectAddress"> | $Enums.DirectAddressStatus
    ownerType?: EnumDirectAddressOwnerWithAggregatesFilter<"DirectAddress"> | $Enums.DirectAddressOwner
    ownerId?: StringWithAggregatesFilter<"DirectAddress"> | string
    ownerName?: StringNullableWithAggregatesFilter<"DirectAddress"> | string | null
    trustAnchor?: StringNullableWithAggregatesFilter<"DirectAddress"> | string | null
    trustBundle?: StringNullableWithAggregatesFilter<"DirectAddress"> | string | null
    certificateExpiry?: DateTimeNullableWithAggregatesFilter<"DirectAddress"> | Date | string | null
    issuerDn?: StringNullableWithAggregatesFilter<"DirectAddress"> | string | null
    subjectDn?: StringNullableWithAggregatesFilter<"DirectAddress"> | string | null
    hispId?: StringNullableWithAggregatesFilter<"DirectAddress"> | string | null
    hispName?: StringNullableWithAggregatesFilter<"DirectAddress"> | string | null
    messagesSent?: IntWithAggregatesFilter<"DirectAddress"> | number
    messagesReceived?: IntWithAggregatesFilter<"DirectAddress"> | number
    lastActivity?: DateTimeNullableWithAggregatesFilter<"DirectAddress"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DirectAddress"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DirectAddress"> | Date | string
  }

  export type FhirEndpointWhereInput = {
    AND?: FhirEndpointWhereInput | FhirEndpointWhereInput[]
    OR?: FhirEndpointWhereInput[]
    NOT?: FhirEndpointWhereInput | FhirEndpointWhereInput[]
    id?: StringFilter<"FhirEndpoint"> | string
    name?: StringFilter<"FhirEndpoint"> | string
    url?: StringFilter<"FhirEndpoint"> | string
    fhirVersion?: StringFilter<"FhirEndpoint"> | string
    status?: EnumEndpointStatusFilter<"FhirEndpoint"> | $Enums.EndpointStatus
    capabilityStatement?: JsonNullableFilter<"FhirEndpoint">
    supportedResources?: StringNullableListFilter<"FhirEndpoint">
    supportedOperations?: StringNullableListFilter<"FhirEndpoint">
    authType?: EnumAuthenticationTypeFilter<"FhirEndpoint"> | $Enums.AuthenticationType
    tokenEndpoint?: StringNullableFilter<"FhirEndpoint"> | string | null
    authorizeEndpoint?: StringNullableFilter<"FhirEndpoint"> | string | null
    clientId?: StringNullableFilter<"FhirEndpoint"> | string | null
    clientSecret?: StringNullableFilter<"FhirEndpoint"> | string | null
    scopes?: StringNullableListFilter<"FhirEndpoint">
    smartEnabled?: BoolFilter<"FhirEndpoint"> | boolean
    smartMetadata?: JsonNullableFilter<"FhirEndpoint">
    organizationName?: StringNullableFilter<"FhirEndpoint"> | string | null
    organizationNpi?: StringNullableFilter<"FhirEndpoint"> | string | null
    lastHealthCheck?: DateTimeNullableFilter<"FhirEndpoint"> | Date | string | null
    healthStatus?: StringNullableFilter<"FhirEndpoint"> | string | null
    avgResponseTimeMs?: IntNullableFilter<"FhirEndpoint"> | number | null
    createdAt?: DateTimeFilter<"FhirEndpoint"> | Date | string
    updatedAt?: DateTimeFilter<"FhirEndpoint"> | Date | string
  }

  export type FhirEndpointOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    fhirVersion?: SortOrder
    status?: SortOrder
    capabilityStatement?: SortOrderInput | SortOrder
    supportedResources?: SortOrder
    supportedOperations?: SortOrder
    authType?: SortOrder
    tokenEndpoint?: SortOrderInput | SortOrder
    authorizeEndpoint?: SortOrderInput | SortOrder
    clientId?: SortOrderInput | SortOrder
    clientSecret?: SortOrderInput | SortOrder
    scopes?: SortOrder
    smartEnabled?: SortOrder
    smartMetadata?: SortOrderInput | SortOrder
    organizationName?: SortOrderInput | SortOrder
    organizationNpi?: SortOrderInput | SortOrder
    lastHealthCheck?: SortOrderInput | SortOrder
    healthStatus?: SortOrderInput | SortOrder
    avgResponseTimeMs?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FhirEndpointWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FhirEndpointWhereInput | FhirEndpointWhereInput[]
    OR?: FhirEndpointWhereInput[]
    NOT?: FhirEndpointWhereInput | FhirEndpointWhereInput[]
    name?: StringFilter<"FhirEndpoint"> | string
    url?: StringFilter<"FhirEndpoint"> | string
    fhirVersion?: StringFilter<"FhirEndpoint"> | string
    status?: EnumEndpointStatusFilter<"FhirEndpoint"> | $Enums.EndpointStatus
    capabilityStatement?: JsonNullableFilter<"FhirEndpoint">
    supportedResources?: StringNullableListFilter<"FhirEndpoint">
    supportedOperations?: StringNullableListFilter<"FhirEndpoint">
    authType?: EnumAuthenticationTypeFilter<"FhirEndpoint"> | $Enums.AuthenticationType
    tokenEndpoint?: StringNullableFilter<"FhirEndpoint"> | string | null
    authorizeEndpoint?: StringNullableFilter<"FhirEndpoint"> | string | null
    clientId?: StringNullableFilter<"FhirEndpoint"> | string | null
    clientSecret?: StringNullableFilter<"FhirEndpoint"> | string | null
    scopes?: StringNullableListFilter<"FhirEndpoint">
    smartEnabled?: BoolFilter<"FhirEndpoint"> | boolean
    smartMetadata?: JsonNullableFilter<"FhirEndpoint">
    organizationName?: StringNullableFilter<"FhirEndpoint"> | string | null
    organizationNpi?: StringNullableFilter<"FhirEndpoint"> | string | null
    lastHealthCheck?: DateTimeNullableFilter<"FhirEndpoint"> | Date | string | null
    healthStatus?: StringNullableFilter<"FhirEndpoint"> | string | null
    avgResponseTimeMs?: IntNullableFilter<"FhirEndpoint"> | number | null
    createdAt?: DateTimeFilter<"FhirEndpoint"> | Date | string
    updatedAt?: DateTimeFilter<"FhirEndpoint"> | Date | string
  }, "id">

  export type FhirEndpointOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    fhirVersion?: SortOrder
    status?: SortOrder
    capabilityStatement?: SortOrderInput | SortOrder
    supportedResources?: SortOrder
    supportedOperations?: SortOrder
    authType?: SortOrder
    tokenEndpoint?: SortOrderInput | SortOrder
    authorizeEndpoint?: SortOrderInput | SortOrder
    clientId?: SortOrderInput | SortOrder
    clientSecret?: SortOrderInput | SortOrder
    scopes?: SortOrder
    smartEnabled?: SortOrder
    smartMetadata?: SortOrderInput | SortOrder
    organizationName?: SortOrderInput | SortOrder
    organizationNpi?: SortOrderInput | SortOrder
    lastHealthCheck?: SortOrderInput | SortOrder
    healthStatus?: SortOrderInput | SortOrder
    avgResponseTimeMs?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FhirEndpointCountOrderByAggregateInput
    _avg?: FhirEndpointAvgOrderByAggregateInput
    _max?: FhirEndpointMaxOrderByAggregateInput
    _min?: FhirEndpointMinOrderByAggregateInput
    _sum?: FhirEndpointSumOrderByAggregateInput
  }

  export type FhirEndpointScalarWhereWithAggregatesInput = {
    AND?: FhirEndpointScalarWhereWithAggregatesInput | FhirEndpointScalarWhereWithAggregatesInput[]
    OR?: FhirEndpointScalarWhereWithAggregatesInput[]
    NOT?: FhirEndpointScalarWhereWithAggregatesInput | FhirEndpointScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FhirEndpoint"> | string
    name?: StringWithAggregatesFilter<"FhirEndpoint"> | string
    url?: StringWithAggregatesFilter<"FhirEndpoint"> | string
    fhirVersion?: StringWithAggregatesFilter<"FhirEndpoint"> | string
    status?: EnumEndpointStatusWithAggregatesFilter<"FhirEndpoint"> | $Enums.EndpointStatus
    capabilityStatement?: JsonNullableWithAggregatesFilter<"FhirEndpoint">
    supportedResources?: StringNullableListFilter<"FhirEndpoint">
    supportedOperations?: StringNullableListFilter<"FhirEndpoint">
    authType?: EnumAuthenticationTypeWithAggregatesFilter<"FhirEndpoint"> | $Enums.AuthenticationType
    tokenEndpoint?: StringNullableWithAggregatesFilter<"FhirEndpoint"> | string | null
    authorizeEndpoint?: StringNullableWithAggregatesFilter<"FhirEndpoint"> | string | null
    clientId?: StringNullableWithAggregatesFilter<"FhirEndpoint"> | string | null
    clientSecret?: StringNullableWithAggregatesFilter<"FhirEndpoint"> | string | null
    scopes?: StringNullableListFilter<"FhirEndpoint">
    smartEnabled?: BoolWithAggregatesFilter<"FhirEndpoint"> | boolean
    smartMetadata?: JsonNullableWithAggregatesFilter<"FhirEndpoint">
    organizationName?: StringNullableWithAggregatesFilter<"FhirEndpoint"> | string | null
    organizationNpi?: StringNullableWithAggregatesFilter<"FhirEndpoint"> | string | null
    lastHealthCheck?: DateTimeNullableWithAggregatesFilter<"FhirEndpoint"> | Date | string | null
    healthStatus?: StringNullableWithAggregatesFilter<"FhirEndpoint"> | string | null
    avgResponseTimeMs?: IntNullableWithAggregatesFilter<"FhirEndpoint"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"FhirEndpoint"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FhirEndpoint"> | Date | string
  }

  export type CCDADocumentWhereInput = {
    AND?: CCDADocumentWhereInput | CCDADocumentWhereInput[]
    OR?: CCDADocumentWhereInput[]
    NOT?: CCDADocumentWhereInput | CCDADocumentWhereInput[]
    id?: StringFilter<"CCDADocument"> | string
    documentId?: StringFilter<"CCDADocument"> | string
    documentType?: EnumCCDADocumentTypeFilter<"CCDADocument"> | $Enums.CCDADocumentType
    patientId?: StringFilter<"CCDADocument"> | string
    title?: StringNullableFilter<"CCDADocument"> | string | null
    creationTime?: DateTimeFilter<"CCDADocument"> | Date | string
    effectiveTime?: DateTimeNullableFilter<"CCDADocument"> | Date | string | null
    confidentialityCode?: StringNullableFilter<"CCDADocument"> | string | null
    languageCode?: StringFilter<"CCDADocument"> | string
    authorId?: StringNullableFilter<"CCDADocument"> | string | null
    authorName?: StringNullableFilter<"CCDADocument"> | string | null
    authorOrganization?: StringNullableFilter<"CCDADocument"> | string | null
    custodianId?: StringNullableFilter<"CCDADocument"> | string | null
    custodianName?: StringNullableFilter<"CCDADocument"> | string | null
    storageLocation?: StringNullableFilter<"CCDADocument"> | string | null
    contentHash?: StringNullableFilter<"CCDADocument"> | string | null
    sizeBytes?: IntNullableFilter<"CCDADocument"> | number | null
    mimeType?: StringFilter<"CCDADocument"> | string
    exchangeStatus?: EnumDocumentExchangeStatusFilter<"CCDADocument"> | $Enums.DocumentExchangeStatus
    sourceNetwork?: StringNullableFilter<"CCDADocument"> | string | null
    sourceOrganization?: StringNullableFilter<"CCDADocument"> | string | null
    createdAt?: DateTimeFilter<"CCDADocument"> | Date | string
    updatedAt?: DateTimeFilter<"CCDADocument"> | Date | string
  }

  export type CCDADocumentOrderByWithRelationInput = {
    id?: SortOrder
    documentId?: SortOrder
    documentType?: SortOrder
    patientId?: SortOrder
    title?: SortOrderInput | SortOrder
    creationTime?: SortOrder
    effectiveTime?: SortOrderInput | SortOrder
    confidentialityCode?: SortOrderInput | SortOrder
    languageCode?: SortOrder
    authorId?: SortOrderInput | SortOrder
    authorName?: SortOrderInput | SortOrder
    authorOrganization?: SortOrderInput | SortOrder
    custodianId?: SortOrderInput | SortOrder
    custodianName?: SortOrderInput | SortOrder
    storageLocation?: SortOrderInput | SortOrder
    contentHash?: SortOrderInput | SortOrder
    sizeBytes?: SortOrderInput | SortOrder
    mimeType?: SortOrder
    exchangeStatus?: SortOrder
    sourceNetwork?: SortOrderInput | SortOrder
    sourceOrganization?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CCDADocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    documentId?: string
    AND?: CCDADocumentWhereInput | CCDADocumentWhereInput[]
    OR?: CCDADocumentWhereInput[]
    NOT?: CCDADocumentWhereInput | CCDADocumentWhereInput[]
    documentType?: EnumCCDADocumentTypeFilter<"CCDADocument"> | $Enums.CCDADocumentType
    patientId?: StringFilter<"CCDADocument"> | string
    title?: StringNullableFilter<"CCDADocument"> | string | null
    creationTime?: DateTimeFilter<"CCDADocument"> | Date | string
    effectiveTime?: DateTimeNullableFilter<"CCDADocument"> | Date | string | null
    confidentialityCode?: StringNullableFilter<"CCDADocument"> | string | null
    languageCode?: StringFilter<"CCDADocument"> | string
    authorId?: StringNullableFilter<"CCDADocument"> | string | null
    authorName?: StringNullableFilter<"CCDADocument"> | string | null
    authorOrganization?: StringNullableFilter<"CCDADocument"> | string | null
    custodianId?: StringNullableFilter<"CCDADocument"> | string | null
    custodianName?: StringNullableFilter<"CCDADocument"> | string | null
    storageLocation?: StringNullableFilter<"CCDADocument"> | string | null
    contentHash?: StringNullableFilter<"CCDADocument"> | string | null
    sizeBytes?: IntNullableFilter<"CCDADocument"> | number | null
    mimeType?: StringFilter<"CCDADocument"> | string
    exchangeStatus?: EnumDocumentExchangeStatusFilter<"CCDADocument"> | $Enums.DocumentExchangeStatus
    sourceNetwork?: StringNullableFilter<"CCDADocument"> | string | null
    sourceOrganization?: StringNullableFilter<"CCDADocument"> | string | null
    createdAt?: DateTimeFilter<"CCDADocument"> | Date | string
    updatedAt?: DateTimeFilter<"CCDADocument"> | Date | string
  }, "id" | "documentId">

  export type CCDADocumentOrderByWithAggregationInput = {
    id?: SortOrder
    documentId?: SortOrder
    documentType?: SortOrder
    patientId?: SortOrder
    title?: SortOrderInput | SortOrder
    creationTime?: SortOrder
    effectiveTime?: SortOrderInput | SortOrder
    confidentialityCode?: SortOrderInput | SortOrder
    languageCode?: SortOrder
    authorId?: SortOrderInput | SortOrder
    authorName?: SortOrderInput | SortOrder
    authorOrganization?: SortOrderInput | SortOrder
    custodianId?: SortOrderInput | SortOrder
    custodianName?: SortOrderInput | SortOrder
    storageLocation?: SortOrderInput | SortOrder
    contentHash?: SortOrderInput | SortOrder
    sizeBytes?: SortOrderInput | SortOrder
    mimeType?: SortOrder
    exchangeStatus?: SortOrder
    sourceNetwork?: SortOrderInput | SortOrder
    sourceOrganization?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CCDADocumentCountOrderByAggregateInput
    _avg?: CCDADocumentAvgOrderByAggregateInput
    _max?: CCDADocumentMaxOrderByAggregateInput
    _min?: CCDADocumentMinOrderByAggregateInput
    _sum?: CCDADocumentSumOrderByAggregateInput
  }

  export type CCDADocumentScalarWhereWithAggregatesInput = {
    AND?: CCDADocumentScalarWhereWithAggregatesInput | CCDADocumentScalarWhereWithAggregatesInput[]
    OR?: CCDADocumentScalarWhereWithAggregatesInput[]
    NOT?: CCDADocumentScalarWhereWithAggregatesInput | CCDADocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CCDADocument"> | string
    documentId?: StringWithAggregatesFilter<"CCDADocument"> | string
    documentType?: EnumCCDADocumentTypeWithAggregatesFilter<"CCDADocument"> | $Enums.CCDADocumentType
    patientId?: StringWithAggregatesFilter<"CCDADocument"> | string
    title?: StringNullableWithAggregatesFilter<"CCDADocument"> | string | null
    creationTime?: DateTimeWithAggregatesFilter<"CCDADocument"> | Date | string
    effectiveTime?: DateTimeNullableWithAggregatesFilter<"CCDADocument"> | Date | string | null
    confidentialityCode?: StringNullableWithAggregatesFilter<"CCDADocument"> | string | null
    languageCode?: StringWithAggregatesFilter<"CCDADocument"> | string
    authorId?: StringNullableWithAggregatesFilter<"CCDADocument"> | string | null
    authorName?: StringNullableWithAggregatesFilter<"CCDADocument"> | string | null
    authorOrganization?: StringNullableWithAggregatesFilter<"CCDADocument"> | string | null
    custodianId?: StringNullableWithAggregatesFilter<"CCDADocument"> | string | null
    custodianName?: StringNullableWithAggregatesFilter<"CCDADocument"> | string | null
    storageLocation?: StringNullableWithAggregatesFilter<"CCDADocument"> | string | null
    contentHash?: StringNullableWithAggregatesFilter<"CCDADocument"> | string | null
    sizeBytes?: IntNullableWithAggregatesFilter<"CCDADocument"> | number | null
    mimeType?: StringWithAggregatesFilter<"CCDADocument"> | string
    exchangeStatus?: EnumDocumentExchangeStatusWithAggregatesFilter<"CCDADocument"> | $Enums.DocumentExchangeStatus
    sourceNetwork?: StringNullableWithAggregatesFilter<"CCDADocument"> | string | null
    sourceOrganization?: StringNullableWithAggregatesFilter<"CCDADocument"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CCDADocument"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CCDADocument"> | Date | string
  }

  export type X12TransactionWhereInput = {
    AND?: X12TransactionWhereInput | X12TransactionWhereInput[]
    OR?: X12TransactionWhereInput[]
    NOT?: X12TransactionWhereInput | X12TransactionWhereInput[]
    id?: StringFilter<"X12Transaction"> | string
    transactionSetId?: StringFilter<"X12Transaction"> | string
    transactionType?: EnumX12TransactionTypeFilter<"X12Transaction"> | $Enums.X12TransactionType
    isaControlNumber?: StringFilter<"X12Transaction"> | string
    gsControlNumber?: StringFilter<"X12Transaction"> | string
    stControlNumber?: StringFilter<"X12Transaction"> | string
    senderId?: StringFilter<"X12Transaction"> | string
    senderQualifier?: StringFilter<"X12Transaction"> | string
    receiverId?: StringFilter<"X12Transaction"> | string
    receiverQualifier?: StringFilter<"X12Transaction"> | string
    rawContent?: StringNullableFilter<"X12Transaction"> | string | null
    parsedContent?: JsonNullableFilter<"X12Transaction">
    status?: EnumX12StatusFilter<"X12Transaction"> | $Enums.X12Status
    acknowledgmentCode?: StringNullableFilter<"X12Transaction"> | string | null
    errors?: JsonNullableFilter<"X12Transaction">
    interchangeDate?: DateTimeFilter<"X12Transaction"> | Date | string
    processedAt?: DateTimeNullableFilter<"X12Transaction"> | Date | string | null
    createdAt?: DateTimeFilter<"X12Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"X12Transaction"> | Date | string
  }

  export type X12TransactionOrderByWithRelationInput = {
    id?: SortOrder
    transactionSetId?: SortOrder
    transactionType?: SortOrder
    isaControlNumber?: SortOrder
    gsControlNumber?: SortOrder
    stControlNumber?: SortOrder
    senderId?: SortOrder
    senderQualifier?: SortOrder
    receiverId?: SortOrder
    receiverQualifier?: SortOrder
    rawContent?: SortOrderInput | SortOrder
    parsedContent?: SortOrderInput | SortOrder
    status?: SortOrder
    acknowledgmentCode?: SortOrderInput | SortOrder
    errors?: SortOrderInput | SortOrder
    interchangeDate?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type X12TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: X12TransactionWhereInput | X12TransactionWhereInput[]
    OR?: X12TransactionWhereInput[]
    NOT?: X12TransactionWhereInput | X12TransactionWhereInput[]
    transactionSetId?: StringFilter<"X12Transaction"> | string
    transactionType?: EnumX12TransactionTypeFilter<"X12Transaction"> | $Enums.X12TransactionType
    isaControlNumber?: StringFilter<"X12Transaction"> | string
    gsControlNumber?: StringFilter<"X12Transaction"> | string
    stControlNumber?: StringFilter<"X12Transaction"> | string
    senderId?: StringFilter<"X12Transaction"> | string
    senderQualifier?: StringFilter<"X12Transaction"> | string
    receiverId?: StringFilter<"X12Transaction"> | string
    receiverQualifier?: StringFilter<"X12Transaction"> | string
    rawContent?: StringNullableFilter<"X12Transaction"> | string | null
    parsedContent?: JsonNullableFilter<"X12Transaction">
    status?: EnumX12StatusFilter<"X12Transaction"> | $Enums.X12Status
    acknowledgmentCode?: StringNullableFilter<"X12Transaction"> | string | null
    errors?: JsonNullableFilter<"X12Transaction">
    interchangeDate?: DateTimeFilter<"X12Transaction"> | Date | string
    processedAt?: DateTimeNullableFilter<"X12Transaction"> | Date | string | null
    createdAt?: DateTimeFilter<"X12Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"X12Transaction"> | Date | string
  }, "id">

  export type X12TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    transactionSetId?: SortOrder
    transactionType?: SortOrder
    isaControlNumber?: SortOrder
    gsControlNumber?: SortOrder
    stControlNumber?: SortOrder
    senderId?: SortOrder
    senderQualifier?: SortOrder
    receiverId?: SortOrder
    receiverQualifier?: SortOrder
    rawContent?: SortOrderInput | SortOrder
    parsedContent?: SortOrderInput | SortOrder
    status?: SortOrder
    acknowledgmentCode?: SortOrderInput | SortOrder
    errors?: SortOrderInput | SortOrder
    interchangeDate?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: X12TransactionCountOrderByAggregateInput
    _max?: X12TransactionMaxOrderByAggregateInput
    _min?: X12TransactionMinOrderByAggregateInput
  }

  export type X12TransactionScalarWhereWithAggregatesInput = {
    AND?: X12TransactionScalarWhereWithAggregatesInput | X12TransactionScalarWhereWithAggregatesInput[]
    OR?: X12TransactionScalarWhereWithAggregatesInput[]
    NOT?: X12TransactionScalarWhereWithAggregatesInput | X12TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"X12Transaction"> | string
    transactionSetId?: StringWithAggregatesFilter<"X12Transaction"> | string
    transactionType?: EnumX12TransactionTypeWithAggregatesFilter<"X12Transaction"> | $Enums.X12TransactionType
    isaControlNumber?: StringWithAggregatesFilter<"X12Transaction"> | string
    gsControlNumber?: StringWithAggregatesFilter<"X12Transaction"> | string
    stControlNumber?: StringWithAggregatesFilter<"X12Transaction"> | string
    senderId?: StringWithAggregatesFilter<"X12Transaction"> | string
    senderQualifier?: StringWithAggregatesFilter<"X12Transaction"> | string
    receiverId?: StringWithAggregatesFilter<"X12Transaction"> | string
    receiverQualifier?: StringWithAggregatesFilter<"X12Transaction"> | string
    rawContent?: StringNullableWithAggregatesFilter<"X12Transaction"> | string | null
    parsedContent?: JsonNullableWithAggregatesFilter<"X12Transaction">
    status?: EnumX12StatusWithAggregatesFilter<"X12Transaction"> | $Enums.X12Status
    acknowledgmentCode?: StringNullableWithAggregatesFilter<"X12Transaction"> | string | null
    errors?: JsonNullableWithAggregatesFilter<"X12Transaction">
    interchangeDate?: DateTimeWithAggregatesFilter<"X12Transaction"> | Date | string
    processedAt?: DateTimeNullableWithAggregatesFilter<"X12Transaction"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"X12Transaction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"X12Transaction"> | Date | string
  }

  export type TradingPartnerCreateInput = {
    id?: string
    name: string
    type: $Enums.TradingPartnerType
    endpoint: string
    certificates?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.PartnerStatus
    authType?: $Enums.AuthenticationType
    clientId?: string | null
    clientSecret?: string | null
    tokenEndpoint?: string | null
    scopes?: TradingPartnerCreatescopesInput | string[]
    fhirVersion?: string | null
    supportedProfiles?: TradingPartnerCreatesupportedProfilesInput | string[]
    isaId?: string | null
    gsId?: string | null
    directDomain?: string | null
    smtpHost?: string | null
    smtpPort?: number | null
    contactName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionLogCreateNestedManyWithoutPartnerInput
  }

  export type TradingPartnerUncheckedCreateInput = {
    id?: string
    name: string
    type: $Enums.TradingPartnerType
    endpoint: string
    certificates?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.PartnerStatus
    authType?: $Enums.AuthenticationType
    clientId?: string | null
    clientSecret?: string | null
    tokenEndpoint?: string | null
    scopes?: TradingPartnerCreatescopesInput | string[]
    fhirVersion?: string | null
    supportedProfiles?: TradingPartnerCreatesupportedProfilesInput | string[]
    isaId?: string | null
    gsId?: string | null
    directDomain?: string | null
    smtpHost?: string | null
    smtpPort?: number | null
    contactName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionLogUncheckedCreateNestedManyWithoutPartnerInput
  }

  export type TradingPartnerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTradingPartnerTypeFieldUpdateOperationsInput | $Enums.TradingPartnerType
    endpoint?: StringFieldUpdateOperationsInput | string
    certificates?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumPartnerStatusFieldUpdateOperationsInput | $Enums.PartnerStatus
    authType?: EnumAuthenticationTypeFieldUpdateOperationsInput | $Enums.AuthenticationType
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    clientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    tokenEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    scopes?: TradingPartnerUpdatescopesInput | string[]
    fhirVersion?: NullableStringFieldUpdateOperationsInput | string | null
    supportedProfiles?: TradingPartnerUpdatesupportedProfilesInput | string[]
    isaId?: NullableStringFieldUpdateOperationsInput | string | null
    gsId?: NullableStringFieldUpdateOperationsInput | string | null
    directDomain?: NullableStringFieldUpdateOperationsInput | string | null
    smtpHost?: NullableStringFieldUpdateOperationsInput | string | null
    smtpPort?: NullableIntFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionLogUpdateManyWithoutPartnerNestedInput
  }

  export type TradingPartnerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTradingPartnerTypeFieldUpdateOperationsInput | $Enums.TradingPartnerType
    endpoint?: StringFieldUpdateOperationsInput | string
    certificates?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumPartnerStatusFieldUpdateOperationsInput | $Enums.PartnerStatus
    authType?: EnumAuthenticationTypeFieldUpdateOperationsInput | $Enums.AuthenticationType
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    clientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    tokenEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    scopes?: TradingPartnerUpdatescopesInput | string[]
    fhirVersion?: NullableStringFieldUpdateOperationsInput | string | null
    supportedProfiles?: TradingPartnerUpdatesupportedProfilesInput | string[]
    isaId?: NullableStringFieldUpdateOperationsInput | string | null
    gsId?: NullableStringFieldUpdateOperationsInput | string | null
    directDomain?: NullableStringFieldUpdateOperationsInput | string | null
    smtpHost?: NullableStringFieldUpdateOperationsInput | string | null
    smtpPort?: NullableIntFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionLogUncheckedUpdateManyWithoutPartnerNestedInput
  }

  export type TradingPartnerCreateManyInput = {
    id?: string
    name: string
    type: $Enums.TradingPartnerType
    endpoint: string
    certificates?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.PartnerStatus
    authType?: $Enums.AuthenticationType
    clientId?: string | null
    clientSecret?: string | null
    tokenEndpoint?: string | null
    scopes?: TradingPartnerCreatescopesInput | string[]
    fhirVersion?: string | null
    supportedProfiles?: TradingPartnerCreatesupportedProfilesInput | string[]
    isaId?: string | null
    gsId?: string | null
    directDomain?: string | null
    smtpHost?: string | null
    smtpPort?: number | null
    contactName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingPartnerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTradingPartnerTypeFieldUpdateOperationsInput | $Enums.TradingPartnerType
    endpoint?: StringFieldUpdateOperationsInput | string
    certificates?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumPartnerStatusFieldUpdateOperationsInput | $Enums.PartnerStatus
    authType?: EnumAuthenticationTypeFieldUpdateOperationsInput | $Enums.AuthenticationType
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    clientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    tokenEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    scopes?: TradingPartnerUpdatescopesInput | string[]
    fhirVersion?: NullableStringFieldUpdateOperationsInput | string | null
    supportedProfiles?: TradingPartnerUpdatesupportedProfilesInput | string[]
    isaId?: NullableStringFieldUpdateOperationsInput | string | null
    gsId?: NullableStringFieldUpdateOperationsInput | string | null
    directDomain?: NullableStringFieldUpdateOperationsInput | string | null
    smtpHost?: NullableStringFieldUpdateOperationsInput | string | null
    smtpPort?: NullableIntFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingPartnerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTradingPartnerTypeFieldUpdateOperationsInput | $Enums.TradingPartnerType
    endpoint?: StringFieldUpdateOperationsInput | string
    certificates?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumPartnerStatusFieldUpdateOperationsInput | $Enums.PartnerStatus
    authType?: EnumAuthenticationTypeFieldUpdateOperationsInput | $Enums.AuthenticationType
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    clientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    tokenEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    scopes?: TradingPartnerUpdatescopesInput | string[]
    fhirVersion?: NullableStringFieldUpdateOperationsInput | string | null
    supportedProfiles?: TradingPartnerUpdatesupportedProfilesInput | string[]
    isaId?: NullableStringFieldUpdateOperationsInput | string | null
    gsId?: NullableStringFieldUpdateOperationsInput | string | null
    directDomain?: NullableStringFieldUpdateOperationsInput | string | null
    smtpHost?: NullableStringFieldUpdateOperationsInput | string | null
    smtpPort?: NullableIntFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionLogCreateInput = {
    id?: string
    transactionId: string
    type: $Enums.TransactionType
    direction: $Enums.TransactionDirection
    status?: $Enums.TransactionStatus
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: string | null
    contentType?: string | null
    requestUrl?: string | null
    requestMethod?: string | null
    responseCode?: number | null
    responseMessage?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    maxRetries?: number
    initiatedAt?: Date | string
    completedAt?: Date | string | null
    processingTimeMs?: number | null
    userId?: string | null
    correlationId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    partner?: TradingPartnerCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionLogUncheckedCreateInput = {
    id?: string
    transactionId: string
    type: $Enums.TransactionType
    direction: $Enums.TransactionDirection
    status?: $Enums.TransactionStatus
    partnerId?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: string | null
    contentType?: string | null
    requestUrl?: string | null
    requestMethod?: string | null
    responseCode?: number | null
    responseMessage?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    maxRetries?: number
    initiatedAt?: Date | string
    completedAt?: Date | string | null
    processingTimeMs?: number | null
    userId?: string | null
    correlationId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    direction?: EnumTransactionDirectionFieldUpdateOperationsInput | $Enums.TransactionDirection
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    requestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    requestMethod?: NullableStringFieldUpdateOperationsInput | string | null
    responseCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseMessage?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    maxRetries?: IntFieldUpdateOperationsInput | number
    initiatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partner?: TradingPartnerUpdateOneWithoutTransactionsNestedInput
  }

  export type TransactionLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    direction?: EnumTransactionDirectionFieldUpdateOperationsInput | $Enums.TransactionDirection
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    partnerId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    requestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    requestMethod?: NullableStringFieldUpdateOperationsInput | string | null
    responseCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseMessage?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    maxRetries?: IntFieldUpdateOperationsInput | number
    initiatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionLogCreateManyInput = {
    id?: string
    transactionId: string
    type: $Enums.TransactionType
    direction: $Enums.TransactionDirection
    status?: $Enums.TransactionStatus
    partnerId?: string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: string | null
    contentType?: string | null
    requestUrl?: string | null
    requestMethod?: string | null
    responseCode?: number | null
    responseMessage?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    maxRetries?: number
    initiatedAt?: Date | string
    completedAt?: Date | string | null
    processingTimeMs?: number | null
    userId?: string | null
    correlationId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    direction?: EnumTransactionDirectionFieldUpdateOperationsInput | $Enums.TransactionDirection
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    requestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    requestMethod?: NullableStringFieldUpdateOperationsInput | string | null
    responseCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseMessage?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    maxRetries?: IntFieldUpdateOperationsInput | number
    initiatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    direction?: EnumTransactionDirectionFieldUpdateOperationsInput | $Enums.TransactionDirection
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    partnerId?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    requestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    requestMethod?: NullableStringFieldUpdateOperationsInput | string | null
    responseCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseMessage?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    maxRetries?: IntFieldUpdateOperationsInput | number
    initiatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NetworkParticipantCreateInput = {
    id?: string
    network: $Enums.HealthcareNetwork
    participantId: string
    status?: $Enums.ParticipantStatus
    organizationName: string
    organizationOid?: string | null
    npi?: string | null
    capabilities?: NullableJsonNullValueInput | InputJsonValue
    supportedPurposes?: NetworkParticipantCreatesupportedPurposesInput | string[]
    queryEndpoint?: string | null
    retrieveEndpoint?: string | null
    submitEndpoint?: string | null
    certificates?: NullableJsonNullValueInput | InputJsonValue
    tefcaRole?: string | null
    carequalityId?: string | null
    implementerOid?: string | null
    commonwellId?: string | null
    commonwellOrgId?: string | null
    enrollmentDate?: Date | string | null
    lastVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NetworkParticipantUncheckedCreateInput = {
    id?: string
    network: $Enums.HealthcareNetwork
    participantId: string
    status?: $Enums.ParticipantStatus
    organizationName: string
    organizationOid?: string | null
    npi?: string | null
    capabilities?: NullableJsonNullValueInput | InputJsonValue
    supportedPurposes?: NetworkParticipantCreatesupportedPurposesInput | string[]
    queryEndpoint?: string | null
    retrieveEndpoint?: string | null
    submitEndpoint?: string | null
    certificates?: NullableJsonNullValueInput | InputJsonValue
    tefcaRole?: string | null
    carequalityId?: string | null
    implementerOid?: string | null
    commonwellId?: string | null
    commonwellOrgId?: string | null
    enrollmentDate?: Date | string | null
    lastVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NetworkParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    network?: EnumHealthcareNetworkFieldUpdateOperationsInput | $Enums.HealthcareNetwork
    participantId?: StringFieldUpdateOperationsInput | string
    status?: EnumParticipantStatusFieldUpdateOperationsInput | $Enums.ParticipantStatus
    organizationName?: StringFieldUpdateOperationsInput | string
    organizationOid?: NullableStringFieldUpdateOperationsInput | string | null
    npi?: NullableStringFieldUpdateOperationsInput | string | null
    capabilities?: NullableJsonNullValueInput | InputJsonValue
    supportedPurposes?: NetworkParticipantUpdatesupportedPurposesInput | string[]
    queryEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    retrieveEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    submitEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableJsonNullValueInput | InputJsonValue
    tefcaRole?: NullableStringFieldUpdateOperationsInput | string | null
    carequalityId?: NullableStringFieldUpdateOperationsInput | string | null
    implementerOid?: NullableStringFieldUpdateOperationsInput | string | null
    commonwellId?: NullableStringFieldUpdateOperationsInput | string | null
    commonwellOrgId?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NetworkParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    network?: EnumHealthcareNetworkFieldUpdateOperationsInput | $Enums.HealthcareNetwork
    participantId?: StringFieldUpdateOperationsInput | string
    status?: EnumParticipantStatusFieldUpdateOperationsInput | $Enums.ParticipantStatus
    organizationName?: StringFieldUpdateOperationsInput | string
    organizationOid?: NullableStringFieldUpdateOperationsInput | string | null
    npi?: NullableStringFieldUpdateOperationsInput | string | null
    capabilities?: NullableJsonNullValueInput | InputJsonValue
    supportedPurposes?: NetworkParticipantUpdatesupportedPurposesInput | string[]
    queryEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    retrieveEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    submitEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableJsonNullValueInput | InputJsonValue
    tefcaRole?: NullableStringFieldUpdateOperationsInput | string | null
    carequalityId?: NullableStringFieldUpdateOperationsInput | string | null
    implementerOid?: NullableStringFieldUpdateOperationsInput | string | null
    commonwellId?: NullableStringFieldUpdateOperationsInput | string | null
    commonwellOrgId?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NetworkParticipantCreateManyInput = {
    id?: string
    network: $Enums.HealthcareNetwork
    participantId: string
    status?: $Enums.ParticipantStatus
    organizationName: string
    organizationOid?: string | null
    npi?: string | null
    capabilities?: NullableJsonNullValueInput | InputJsonValue
    supportedPurposes?: NetworkParticipantCreatesupportedPurposesInput | string[]
    queryEndpoint?: string | null
    retrieveEndpoint?: string | null
    submitEndpoint?: string | null
    certificates?: NullableJsonNullValueInput | InputJsonValue
    tefcaRole?: string | null
    carequalityId?: string | null
    implementerOid?: string | null
    commonwellId?: string | null
    commonwellOrgId?: string | null
    enrollmentDate?: Date | string | null
    lastVerified?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NetworkParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    network?: EnumHealthcareNetworkFieldUpdateOperationsInput | $Enums.HealthcareNetwork
    participantId?: StringFieldUpdateOperationsInput | string
    status?: EnumParticipantStatusFieldUpdateOperationsInput | $Enums.ParticipantStatus
    organizationName?: StringFieldUpdateOperationsInput | string
    organizationOid?: NullableStringFieldUpdateOperationsInput | string | null
    npi?: NullableStringFieldUpdateOperationsInput | string | null
    capabilities?: NullableJsonNullValueInput | InputJsonValue
    supportedPurposes?: NetworkParticipantUpdatesupportedPurposesInput | string[]
    queryEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    retrieveEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    submitEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableJsonNullValueInput | InputJsonValue
    tefcaRole?: NullableStringFieldUpdateOperationsInput | string | null
    carequalityId?: NullableStringFieldUpdateOperationsInput | string | null
    implementerOid?: NullableStringFieldUpdateOperationsInput | string | null
    commonwellId?: NullableStringFieldUpdateOperationsInput | string | null
    commonwellOrgId?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NetworkParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    network?: EnumHealthcareNetworkFieldUpdateOperationsInput | $Enums.HealthcareNetwork
    participantId?: StringFieldUpdateOperationsInput | string
    status?: EnumParticipantStatusFieldUpdateOperationsInput | $Enums.ParticipantStatus
    organizationName?: StringFieldUpdateOperationsInput | string
    organizationOid?: NullableStringFieldUpdateOperationsInput | string | null
    npi?: NullableStringFieldUpdateOperationsInput | string | null
    capabilities?: NullableJsonNullValueInput | InputJsonValue
    supportedPurposes?: NetworkParticipantUpdatesupportedPurposesInput | string[]
    queryEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    retrieveEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    submitEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    certificates?: NullableJsonNullValueInput | InputJsonValue
    tefcaRole?: NullableStringFieldUpdateOperationsInput | string | null
    carequalityId?: NullableStringFieldUpdateOperationsInput | string | null
    implementerOid?: NullableStringFieldUpdateOperationsInput | string | null
    commonwellId?: NullableStringFieldUpdateOperationsInput | string | null
    commonwellOrgId?: NullableStringFieldUpdateOperationsInput | string | null
    enrollmentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectAddressCreateInput = {
    id?: string
    address: string
    certificate?: string | null
    privateKey?: string | null
    domain: string
    status?: $Enums.DirectAddressStatus
    ownerType: $Enums.DirectAddressOwner
    ownerId: string
    ownerName?: string | null
    trustAnchor?: string | null
    trustBundle?: string | null
    certificateExpiry?: Date | string | null
    issuerDn?: string | null
    subjectDn?: string | null
    hispId?: string | null
    hispName?: string | null
    messagesSent?: number
    messagesReceived?: number
    lastActivity?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DirectAddressUncheckedCreateInput = {
    id?: string
    address: string
    certificate?: string | null
    privateKey?: string | null
    domain: string
    status?: $Enums.DirectAddressStatus
    ownerType: $Enums.DirectAddressOwner
    ownerId: string
    ownerName?: string | null
    trustAnchor?: string | null
    trustBundle?: string | null
    certificateExpiry?: Date | string | null
    issuerDn?: string | null
    subjectDn?: string | null
    hispId?: string | null
    hispName?: string | null
    messagesSent?: number
    messagesReceived?: number
    lastActivity?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DirectAddressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: StringFieldUpdateOperationsInput | string
    status?: EnumDirectAddressStatusFieldUpdateOperationsInput | $Enums.DirectAddressStatus
    ownerType?: EnumDirectAddressOwnerFieldUpdateOperationsInput | $Enums.DirectAddressOwner
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    trustAnchor?: NullableStringFieldUpdateOperationsInput | string | null
    trustBundle?: NullableStringFieldUpdateOperationsInput | string | null
    certificateExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    issuerDn?: NullableStringFieldUpdateOperationsInput | string | null
    subjectDn?: NullableStringFieldUpdateOperationsInput | string | null
    hispId?: NullableStringFieldUpdateOperationsInput | string | null
    hispName?: NullableStringFieldUpdateOperationsInput | string | null
    messagesSent?: IntFieldUpdateOperationsInput | number
    messagesReceived?: IntFieldUpdateOperationsInput | number
    lastActivity?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectAddressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: StringFieldUpdateOperationsInput | string
    status?: EnumDirectAddressStatusFieldUpdateOperationsInput | $Enums.DirectAddressStatus
    ownerType?: EnumDirectAddressOwnerFieldUpdateOperationsInput | $Enums.DirectAddressOwner
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    trustAnchor?: NullableStringFieldUpdateOperationsInput | string | null
    trustBundle?: NullableStringFieldUpdateOperationsInput | string | null
    certificateExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    issuerDn?: NullableStringFieldUpdateOperationsInput | string | null
    subjectDn?: NullableStringFieldUpdateOperationsInput | string | null
    hispId?: NullableStringFieldUpdateOperationsInput | string | null
    hispName?: NullableStringFieldUpdateOperationsInput | string | null
    messagesSent?: IntFieldUpdateOperationsInput | number
    messagesReceived?: IntFieldUpdateOperationsInput | number
    lastActivity?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectAddressCreateManyInput = {
    id?: string
    address: string
    certificate?: string | null
    privateKey?: string | null
    domain: string
    status?: $Enums.DirectAddressStatus
    ownerType: $Enums.DirectAddressOwner
    ownerId: string
    ownerName?: string | null
    trustAnchor?: string | null
    trustBundle?: string | null
    certificateExpiry?: Date | string | null
    issuerDn?: string | null
    subjectDn?: string | null
    hispId?: string | null
    hispName?: string | null
    messagesSent?: number
    messagesReceived?: number
    lastActivity?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DirectAddressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: StringFieldUpdateOperationsInput | string
    status?: EnumDirectAddressStatusFieldUpdateOperationsInput | $Enums.DirectAddressStatus
    ownerType?: EnumDirectAddressOwnerFieldUpdateOperationsInput | $Enums.DirectAddressOwner
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    trustAnchor?: NullableStringFieldUpdateOperationsInput | string | null
    trustBundle?: NullableStringFieldUpdateOperationsInput | string | null
    certificateExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    issuerDn?: NullableStringFieldUpdateOperationsInput | string | null
    subjectDn?: NullableStringFieldUpdateOperationsInput | string | null
    hispId?: NullableStringFieldUpdateOperationsInput | string | null
    hispName?: NullableStringFieldUpdateOperationsInput | string | null
    messagesSent?: IntFieldUpdateOperationsInput | number
    messagesReceived?: IntFieldUpdateOperationsInput | number
    lastActivity?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectAddressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    privateKey?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: StringFieldUpdateOperationsInput | string
    status?: EnumDirectAddressStatusFieldUpdateOperationsInput | $Enums.DirectAddressStatus
    ownerType?: EnumDirectAddressOwnerFieldUpdateOperationsInput | $Enums.DirectAddressOwner
    ownerId?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    trustAnchor?: NullableStringFieldUpdateOperationsInput | string | null
    trustBundle?: NullableStringFieldUpdateOperationsInput | string | null
    certificateExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    issuerDn?: NullableStringFieldUpdateOperationsInput | string | null
    subjectDn?: NullableStringFieldUpdateOperationsInput | string | null
    hispId?: NullableStringFieldUpdateOperationsInput | string | null
    hispName?: NullableStringFieldUpdateOperationsInput | string | null
    messagesSent?: IntFieldUpdateOperationsInput | number
    messagesReceived?: IntFieldUpdateOperationsInput | number
    lastActivity?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FhirEndpointCreateInput = {
    id?: string
    name: string
    url: string
    fhirVersion: string
    status?: $Enums.EndpointStatus
    capabilityStatement?: NullableJsonNullValueInput | InputJsonValue
    supportedResources?: FhirEndpointCreatesupportedResourcesInput | string[]
    supportedOperations?: FhirEndpointCreatesupportedOperationsInput | string[]
    authType?: $Enums.AuthenticationType
    tokenEndpoint?: string | null
    authorizeEndpoint?: string | null
    clientId?: string | null
    clientSecret?: string | null
    scopes?: FhirEndpointCreatescopesInput | string[]
    smartEnabled?: boolean
    smartMetadata?: NullableJsonNullValueInput | InputJsonValue
    organizationName?: string | null
    organizationNpi?: string | null
    lastHealthCheck?: Date | string | null
    healthStatus?: string | null
    avgResponseTimeMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FhirEndpointUncheckedCreateInput = {
    id?: string
    name: string
    url: string
    fhirVersion: string
    status?: $Enums.EndpointStatus
    capabilityStatement?: NullableJsonNullValueInput | InputJsonValue
    supportedResources?: FhirEndpointCreatesupportedResourcesInput | string[]
    supportedOperations?: FhirEndpointCreatesupportedOperationsInput | string[]
    authType?: $Enums.AuthenticationType
    tokenEndpoint?: string | null
    authorizeEndpoint?: string | null
    clientId?: string | null
    clientSecret?: string | null
    scopes?: FhirEndpointCreatescopesInput | string[]
    smartEnabled?: boolean
    smartMetadata?: NullableJsonNullValueInput | InputJsonValue
    organizationName?: string | null
    organizationNpi?: string | null
    lastHealthCheck?: Date | string | null
    healthStatus?: string | null
    avgResponseTimeMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FhirEndpointUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fhirVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumEndpointStatusFieldUpdateOperationsInput | $Enums.EndpointStatus
    capabilityStatement?: NullableJsonNullValueInput | InputJsonValue
    supportedResources?: FhirEndpointUpdatesupportedResourcesInput | string[]
    supportedOperations?: FhirEndpointUpdatesupportedOperationsInput | string[]
    authType?: EnumAuthenticationTypeFieldUpdateOperationsInput | $Enums.AuthenticationType
    tokenEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    authorizeEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    clientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    scopes?: FhirEndpointUpdatescopesInput | string[]
    smartEnabled?: BoolFieldUpdateOperationsInput | boolean
    smartMetadata?: NullableJsonNullValueInput | InputJsonValue
    organizationName?: NullableStringFieldUpdateOperationsInput | string | null
    organizationNpi?: NullableStringFieldUpdateOperationsInput | string | null
    lastHealthCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    healthStatus?: NullableStringFieldUpdateOperationsInput | string | null
    avgResponseTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FhirEndpointUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fhirVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumEndpointStatusFieldUpdateOperationsInput | $Enums.EndpointStatus
    capabilityStatement?: NullableJsonNullValueInput | InputJsonValue
    supportedResources?: FhirEndpointUpdatesupportedResourcesInput | string[]
    supportedOperations?: FhirEndpointUpdatesupportedOperationsInput | string[]
    authType?: EnumAuthenticationTypeFieldUpdateOperationsInput | $Enums.AuthenticationType
    tokenEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    authorizeEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    clientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    scopes?: FhirEndpointUpdatescopesInput | string[]
    smartEnabled?: BoolFieldUpdateOperationsInput | boolean
    smartMetadata?: NullableJsonNullValueInput | InputJsonValue
    organizationName?: NullableStringFieldUpdateOperationsInput | string | null
    organizationNpi?: NullableStringFieldUpdateOperationsInput | string | null
    lastHealthCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    healthStatus?: NullableStringFieldUpdateOperationsInput | string | null
    avgResponseTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FhirEndpointCreateManyInput = {
    id?: string
    name: string
    url: string
    fhirVersion: string
    status?: $Enums.EndpointStatus
    capabilityStatement?: NullableJsonNullValueInput | InputJsonValue
    supportedResources?: FhirEndpointCreatesupportedResourcesInput | string[]
    supportedOperations?: FhirEndpointCreatesupportedOperationsInput | string[]
    authType?: $Enums.AuthenticationType
    tokenEndpoint?: string | null
    authorizeEndpoint?: string | null
    clientId?: string | null
    clientSecret?: string | null
    scopes?: FhirEndpointCreatescopesInput | string[]
    smartEnabled?: boolean
    smartMetadata?: NullableJsonNullValueInput | InputJsonValue
    organizationName?: string | null
    organizationNpi?: string | null
    lastHealthCheck?: Date | string | null
    healthStatus?: string | null
    avgResponseTimeMs?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FhirEndpointUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fhirVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumEndpointStatusFieldUpdateOperationsInput | $Enums.EndpointStatus
    capabilityStatement?: NullableJsonNullValueInput | InputJsonValue
    supportedResources?: FhirEndpointUpdatesupportedResourcesInput | string[]
    supportedOperations?: FhirEndpointUpdatesupportedOperationsInput | string[]
    authType?: EnumAuthenticationTypeFieldUpdateOperationsInput | $Enums.AuthenticationType
    tokenEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    authorizeEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    clientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    scopes?: FhirEndpointUpdatescopesInput | string[]
    smartEnabled?: BoolFieldUpdateOperationsInput | boolean
    smartMetadata?: NullableJsonNullValueInput | InputJsonValue
    organizationName?: NullableStringFieldUpdateOperationsInput | string | null
    organizationNpi?: NullableStringFieldUpdateOperationsInput | string | null
    lastHealthCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    healthStatus?: NullableStringFieldUpdateOperationsInput | string | null
    avgResponseTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FhirEndpointUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    fhirVersion?: StringFieldUpdateOperationsInput | string
    status?: EnumEndpointStatusFieldUpdateOperationsInput | $Enums.EndpointStatus
    capabilityStatement?: NullableJsonNullValueInput | InputJsonValue
    supportedResources?: FhirEndpointUpdatesupportedResourcesInput | string[]
    supportedOperations?: FhirEndpointUpdatesupportedOperationsInput | string[]
    authType?: EnumAuthenticationTypeFieldUpdateOperationsInput | $Enums.AuthenticationType
    tokenEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    authorizeEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    clientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    scopes?: FhirEndpointUpdatescopesInput | string[]
    smartEnabled?: BoolFieldUpdateOperationsInput | boolean
    smartMetadata?: NullableJsonNullValueInput | InputJsonValue
    organizationName?: NullableStringFieldUpdateOperationsInput | string | null
    organizationNpi?: NullableStringFieldUpdateOperationsInput | string | null
    lastHealthCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    healthStatus?: NullableStringFieldUpdateOperationsInput | string | null
    avgResponseTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CCDADocumentCreateInput = {
    id?: string
    documentId: string
    documentType: $Enums.CCDADocumentType
    patientId: string
    title?: string | null
    creationTime: Date | string
    effectiveTime?: Date | string | null
    confidentialityCode?: string | null
    languageCode?: string
    authorId?: string | null
    authorName?: string | null
    authorOrganization?: string | null
    custodianId?: string | null
    custodianName?: string | null
    storageLocation?: string | null
    contentHash?: string | null
    sizeBytes?: number | null
    mimeType?: string
    exchangeStatus?: $Enums.DocumentExchangeStatus
    sourceNetwork?: string | null
    sourceOrganization?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CCDADocumentUncheckedCreateInput = {
    id?: string
    documentId: string
    documentType: $Enums.CCDADocumentType
    patientId: string
    title?: string | null
    creationTime: Date | string
    effectiveTime?: Date | string | null
    confidentialityCode?: string | null
    languageCode?: string
    authorId?: string | null
    authorName?: string | null
    authorOrganization?: string | null
    custodianId?: string | null
    custodianName?: string | null
    storageLocation?: string | null
    contentHash?: string | null
    sizeBytes?: number | null
    mimeType?: string
    exchangeStatus?: $Enums.DocumentExchangeStatus
    sourceNetwork?: string | null
    sourceOrganization?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CCDADocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    documentType?: EnumCCDADocumentTypeFieldUpdateOperationsInput | $Enums.CCDADocumentType
    patientId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    creationTime?: DateTimeFieldUpdateOperationsInput | Date | string
    effectiveTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confidentialityCode?: NullableStringFieldUpdateOperationsInput | string | null
    languageCode?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    authorName?: NullableStringFieldUpdateOperationsInput | string | null
    authorOrganization?: NullableStringFieldUpdateOperationsInput | string | null
    custodianId?: NullableStringFieldUpdateOperationsInput | string | null
    custodianName?: NullableStringFieldUpdateOperationsInput | string | null
    storageLocation?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    exchangeStatus?: EnumDocumentExchangeStatusFieldUpdateOperationsInput | $Enums.DocumentExchangeStatus
    sourceNetwork?: NullableStringFieldUpdateOperationsInput | string | null
    sourceOrganization?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CCDADocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    documentType?: EnumCCDADocumentTypeFieldUpdateOperationsInput | $Enums.CCDADocumentType
    patientId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    creationTime?: DateTimeFieldUpdateOperationsInput | Date | string
    effectiveTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confidentialityCode?: NullableStringFieldUpdateOperationsInput | string | null
    languageCode?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    authorName?: NullableStringFieldUpdateOperationsInput | string | null
    authorOrganization?: NullableStringFieldUpdateOperationsInput | string | null
    custodianId?: NullableStringFieldUpdateOperationsInput | string | null
    custodianName?: NullableStringFieldUpdateOperationsInput | string | null
    storageLocation?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    exchangeStatus?: EnumDocumentExchangeStatusFieldUpdateOperationsInput | $Enums.DocumentExchangeStatus
    sourceNetwork?: NullableStringFieldUpdateOperationsInput | string | null
    sourceOrganization?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CCDADocumentCreateManyInput = {
    id?: string
    documentId: string
    documentType: $Enums.CCDADocumentType
    patientId: string
    title?: string | null
    creationTime: Date | string
    effectiveTime?: Date | string | null
    confidentialityCode?: string | null
    languageCode?: string
    authorId?: string | null
    authorName?: string | null
    authorOrganization?: string | null
    custodianId?: string | null
    custodianName?: string | null
    storageLocation?: string | null
    contentHash?: string | null
    sizeBytes?: number | null
    mimeType?: string
    exchangeStatus?: $Enums.DocumentExchangeStatus
    sourceNetwork?: string | null
    sourceOrganization?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CCDADocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    documentType?: EnumCCDADocumentTypeFieldUpdateOperationsInput | $Enums.CCDADocumentType
    patientId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    creationTime?: DateTimeFieldUpdateOperationsInput | Date | string
    effectiveTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confidentialityCode?: NullableStringFieldUpdateOperationsInput | string | null
    languageCode?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    authorName?: NullableStringFieldUpdateOperationsInput | string | null
    authorOrganization?: NullableStringFieldUpdateOperationsInput | string | null
    custodianId?: NullableStringFieldUpdateOperationsInput | string | null
    custodianName?: NullableStringFieldUpdateOperationsInput | string | null
    storageLocation?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    exchangeStatus?: EnumDocumentExchangeStatusFieldUpdateOperationsInput | $Enums.DocumentExchangeStatus
    sourceNetwork?: NullableStringFieldUpdateOperationsInput | string | null
    sourceOrganization?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CCDADocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    documentType?: EnumCCDADocumentTypeFieldUpdateOperationsInput | $Enums.CCDADocumentType
    patientId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    creationTime?: DateTimeFieldUpdateOperationsInput | Date | string
    effectiveTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confidentialityCode?: NullableStringFieldUpdateOperationsInput | string | null
    languageCode?: StringFieldUpdateOperationsInput | string
    authorId?: NullableStringFieldUpdateOperationsInput | string | null
    authorName?: NullableStringFieldUpdateOperationsInput | string | null
    authorOrganization?: NullableStringFieldUpdateOperationsInput | string | null
    custodianId?: NullableStringFieldUpdateOperationsInput | string | null
    custodianName?: NullableStringFieldUpdateOperationsInput | string | null
    storageLocation?: NullableStringFieldUpdateOperationsInput | string | null
    contentHash?: NullableStringFieldUpdateOperationsInput | string | null
    sizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    exchangeStatus?: EnumDocumentExchangeStatusFieldUpdateOperationsInput | $Enums.DocumentExchangeStatus
    sourceNetwork?: NullableStringFieldUpdateOperationsInput | string | null
    sourceOrganization?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type X12TransactionCreateInput = {
    id?: string
    transactionSetId: string
    transactionType: $Enums.X12TransactionType
    isaControlNumber: string
    gsControlNumber: string
    stControlNumber: string
    senderId: string
    senderQualifier: string
    receiverId: string
    receiverQualifier: string
    rawContent?: string | null
    parsedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.X12Status
    acknowledgmentCode?: string | null
    errors?: NullableJsonNullValueInput | InputJsonValue
    interchangeDate: Date | string
    processedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type X12TransactionUncheckedCreateInput = {
    id?: string
    transactionSetId: string
    transactionType: $Enums.X12TransactionType
    isaControlNumber: string
    gsControlNumber: string
    stControlNumber: string
    senderId: string
    senderQualifier: string
    receiverId: string
    receiverQualifier: string
    rawContent?: string | null
    parsedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.X12Status
    acknowledgmentCode?: string | null
    errors?: NullableJsonNullValueInput | InputJsonValue
    interchangeDate: Date | string
    processedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type X12TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionSetId?: StringFieldUpdateOperationsInput | string
    transactionType?: EnumX12TransactionTypeFieldUpdateOperationsInput | $Enums.X12TransactionType
    isaControlNumber?: StringFieldUpdateOperationsInput | string
    gsControlNumber?: StringFieldUpdateOperationsInput | string
    stControlNumber?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderQualifier?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverQualifier?: StringFieldUpdateOperationsInput | string
    rawContent?: NullableStringFieldUpdateOperationsInput | string | null
    parsedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumX12StatusFieldUpdateOperationsInput | $Enums.X12Status
    acknowledgmentCode?: NullableStringFieldUpdateOperationsInput | string | null
    errors?: NullableJsonNullValueInput | InputJsonValue
    interchangeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type X12TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionSetId?: StringFieldUpdateOperationsInput | string
    transactionType?: EnumX12TransactionTypeFieldUpdateOperationsInput | $Enums.X12TransactionType
    isaControlNumber?: StringFieldUpdateOperationsInput | string
    gsControlNumber?: StringFieldUpdateOperationsInput | string
    stControlNumber?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderQualifier?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverQualifier?: StringFieldUpdateOperationsInput | string
    rawContent?: NullableStringFieldUpdateOperationsInput | string | null
    parsedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumX12StatusFieldUpdateOperationsInput | $Enums.X12Status
    acknowledgmentCode?: NullableStringFieldUpdateOperationsInput | string | null
    errors?: NullableJsonNullValueInput | InputJsonValue
    interchangeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type X12TransactionCreateManyInput = {
    id?: string
    transactionSetId: string
    transactionType: $Enums.X12TransactionType
    isaControlNumber: string
    gsControlNumber: string
    stControlNumber: string
    senderId: string
    senderQualifier: string
    receiverId: string
    receiverQualifier: string
    rawContent?: string | null
    parsedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.X12Status
    acknowledgmentCode?: string | null
    errors?: NullableJsonNullValueInput | InputJsonValue
    interchangeDate: Date | string
    processedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type X12TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionSetId?: StringFieldUpdateOperationsInput | string
    transactionType?: EnumX12TransactionTypeFieldUpdateOperationsInput | $Enums.X12TransactionType
    isaControlNumber?: StringFieldUpdateOperationsInput | string
    gsControlNumber?: StringFieldUpdateOperationsInput | string
    stControlNumber?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderQualifier?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverQualifier?: StringFieldUpdateOperationsInput | string
    rawContent?: NullableStringFieldUpdateOperationsInput | string | null
    parsedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumX12StatusFieldUpdateOperationsInput | $Enums.X12Status
    acknowledgmentCode?: NullableStringFieldUpdateOperationsInput | string | null
    errors?: NullableJsonNullValueInput | InputJsonValue
    interchangeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type X12TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionSetId?: StringFieldUpdateOperationsInput | string
    transactionType?: EnumX12TransactionTypeFieldUpdateOperationsInput | $Enums.X12TransactionType
    isaControlNumber?: StringFieldUpdateOperationsInput | string
    gsControlNumber?: StringFieldUpdateOperationsInput | string
    stControlNumber?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderQualifier?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    receiverQualifier?: StringFieldUpdateOperationsInput | string
    rawContent?: NullableStringFieldUpdateOperationsInput | string | null
    parsedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumX12StatusFieldUpdateOperationsInput | $Enums.X12Status
    acknowledgmentCode?: NullableStringFieldUpdateOperationsInput | string | null
    errors?: NullableJsonNullValueInput | InputJsonValue
    interchangeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumTradingPartnerTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TradingPartnerType | EnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TradingPartnerType[] | ListEnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradingPartnerType[] | ListEnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTradingPartnerTypeFilter<$PrismaModel> | $Enums.TradingPartnerType
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumPartnerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PartnerStatus | EnumPartnerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PartnerStatus[] | ListEnumPartnerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PartnerStatus[] | ListEnumPartnerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPartnerStatusFilter<$PrismaModel> | $Enums.PartnerStatus
  }

  export type EnumAuthenticationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthenticationType | EnumAuthenticationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AuthenticationType[] | ListEnumAuthenticationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthenticationType[] | ListEnumAuthenticationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthenticationTypeFilter<$PrismaModel> | $Enums.AuthenticationType
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TransactionLogListRelationFilter = {
    every?: TransactionLogWhereInput
    some?: TransactionLogWhereInput
    none?: TransactionLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TransactionLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TradingPartnerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    endpoint?: SortOrder
    certificates?: SortOrder
    status?: SortOrder
    authType?: SortOrder
    clientId?: SortOrder
    clientSecret?: SortOrder
    tokenEndpoint?: SortOrder
    scopes?: SortOrder
    fhirVersion?: SortOrder
    supportedProfiles?: SortOrder
    isaId?: SortOrder
    gsId?: SortOrder
    directDomain?: SortOrder
    smtpHost?: SortOrder
    smtpPort?: SortOrder
    contactName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingPartnerAvgOrderByAggregateInput = {
    smtpPort?: SortOrder
  }

  export type TradingPartnerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    endpoint?: SortOrder
    status?: SortOrder
    authType?: SortOrder
    clientId?: SortOrder
    clientSecret?: SortOrder
    tokenEndpoint?: SortOrder
    fhirVersion?: SortOrder
    isaId?: SortOrder
    gsId?: SortOrder
    directDomain?: SortOrder
    smtpHost?: SortOrder
    smtpPort?: SortOrder
    contactName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingPartnerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    endpoint?: SortOrder
    status?: SortOrder
    authType?: SortOrder
    clientId?: SortOrder
    clientSecret?: SortOrder
    tokenEndpoint?: SortOrder
    fhirVersion?: SortOrder
    isaId?: SortOrder
    gsId?: SortOrder
    directDomain?: SortOrder
    smtpHost?: SortOrder
    smtpPort?: SortOrder
    contactName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradingPartnerSumOrderByAggregateInput = {
    smtpPort?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumTradingPartnerTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradingPartnerType | EnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TradingPartnerType[] | ListEnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradingPartnerType[] | ListEnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTradingPartnerTypeWithAggregatesFilter<$PrismaModel> | $Enums.TradingPartnerType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradingPartnerTypeFilter<$PrismaModel>
    _max?: NestedEnumTradingPartnerTypeFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumPartnerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PartnerStatus | EnumPartnerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PartnerStatus[] | ListEnumPartnerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PartnerStatus[] | ListEnumPartnerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPartnerStatusWithAggregatesFilter<$PrismaModel> | $Enums.PartnerStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPartnerStatusFilter<$PrismaModel>
    _max?: NestedEnumPartnerStatusFilter<$PrismaModel>
  }

  export type EnumAuthenticationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthenticationType | EnumAuthenticationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AuthenticationType[] | ListEnumAuthenticationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthenticationType[] | ListEnumAuthenticationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthenticationTypeWithAggregatesFilter<$PrismaModel> | $Enums.AuthenticationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthenticationTypeFilter<$PrismaModel>
    _max?: NestedEnumAuthenticationTypeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type EnumTransactionDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionDirection | EnumTransactionDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionDirection[] | ListEnumTransactionDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionDirection[] | ListEnumTransactionDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionDirectionFilter<$PrismaModel> | $Enums.TransactionDirection
  }

  export type EnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TradingPartnerNullableRelationFilter = {
    is?: TradingPartnerWhereInput | null
    isNot?: TradingPartnerWhereInput | null
  }

  export type TransactionLogCountOrderByAggregateInput = {
    id?: SortOrder
    transactionId?: SortOrder
    type?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    partnerId?: SortOrder
    payload?: SortOrder
    payloadHash?: SortOrder
    contentType?: SortOrder
    requestUrl?: SortOrder
    requestMethod?: SortOrder
    responseCode?: SortOrder
    responseMessage?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    retryCount?: SortOrder
    maxRetries?: SortOrder
    initiatedAt?: SortOrder
    completedAt?: SortOrder
    processingTimeMs?: SortOrder
    userId?: SortOrder
    correlationId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionLogAvgOrderByAggregateInput = {
    responseCode?: SortOrder
    retryCount?: SortOrder
    maxRetries?: SortOrder
    processingTimeMs?: SortOrder
  }

  export type TransactionLogMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionId?: SortOrder
    type?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    partnerId?: SortOrder
    payloadHash?: SortOrder
    contentType?: SortOrder
    requestUrl?: SortOrder
    requestMethod?: SortOrder
    responseCode?: SortOrder
    responseMessage?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    retryCount?: SortOrder
    maxRetries?: SortOrder
    initiatedAt?: SortOrder
    completedAt?: SortOrder
    processingTimeMs?: SortOrder
    userId?: SortOrder
    correlationId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionLogMinOrderByAggregateInput = {
    id?: SortOrder
    transactionId?: SortOrder
    type?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    partnerId?: SortOrder
    payloadHash?: SortOrder
    contentType?: SortOrder
    requestUrl?: SortOrder
    requestMethod?: SortOrder
    responseCode?: SortOrder
    responseMessage?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    retryCount?: SortOrder
    maxRetries?: SortOrder
    initiatedAt?: SortOrder
    completedAt?: SortOrder
    processingTimeMs?: SortOrder
    userId?: SortOrder
    correlationId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionLogSumOrderByAggregateInput = {
    responseCode?: SortOrder
    retryCount?: SortOrder
    maxRetries?: SortOrder
    processingTimeMs?: SortOrder
  }

  export type EnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type EnumTransactionDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionDirection | EnumTransactionDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionDirection[] | ListEnumTransactionDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionDirection[] | ListEnumTransactionDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionDirectionWithAggregatesFilter<$PrismaModel> | $Enums.TransactionDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionDirectionFilter<$PrismaModel>
    _max?: NestedEnumTransactionDirectionFilter<$PrismaModel>
  }

  export type EnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumHealthcareNetworkFilter<$PrismaModel = never> = {
    equals?: $Enums.HealthcareNetwork | EnumHealthcareNetworkFieldRefInput<$PrismaModel>
    in?: $Enums.HealthcareNetwork[] | ListEnumHealthcareNetworkFieldRefInput<$PrismaModel>
    notIn?: $Enums.HealthcareNetwork[] | ListEnumHealthcareNetworkFieldRefInput<$PrismaModel>
    not?: NestedEnumHealthcareNetworkFilter<$PrismaModel> | $Enums.HealthcareNetwork
  }

  export type EnumParticipantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ParticipantStatus | EnumParticipantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ParticipantStatus[] | ListEnumParticipantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ParticipantStatus[] | ListEnumParticipantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumParticipantStatusFilter<$PrismaModel> | $Enums.ParticipantStatus
  }

  export type NetworkParticipantNetworkParticipantIdCompoundUniqueInput = {
    network: $Enums.HealthcareNetwork
    participantId: string
  }

  export type NetworkParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    participantId?: SortOrder
    status?: SortOrder
    organizationName?: SortOrder
    organizationOid?: SortOrder
    npi?: SortOrder
    capabilities?: SortOrder
    supportedPurposes?: SortOrder
    queryEndpoint?: SortOrder
    retrieveEndpoint?: SortOrder
    submitEndpoint?: SortOrder
    certificates?: SortOrder
    tefcaRole?: SortOrder
    carequalityId?: SortOrder
    implementerOid?: SortOrder
    commonwellId?: SortOrder
    commonwellOrgId?: SortOrder
    enrollmentDate?: SortOrder
    lastVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NetworkParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    participantId?: SortOrder
    status?: SortOrder
    organizationName?: SortOrder
    organizationOid?: SortOrder
    npi?: SortOrder
    queryEndpoint?: SortOrder
    retrieveEndpoint?: SortOrder
    submitEndpoint?: SortOrder
    tefcaRole?: SortOrder
    carequalityId?: SortOrder
    implementerOid?: SortOrder
    commonwellId?: SortOrder
    commonwellOrgId?: SortOrder
    enrollmentDate?: SortOrder
    lastVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NetworkParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    network?: SortOrder
    participantId?: SortOrder
    status?: SortOrder
    organizationName?: SortOrder
    organizationOid?: SortOrder
    npi?: SortOrder
    queryEndpoint?: SortOrder
    retrieveEndpoint?: SortOrder
    submitEndpoint?: SortOrder
    tefcaRole?: SortOrder
    carequalityId?: SortOrder
    implementerOid?: SortOrder
    commonwellId?: SortOrder
    commonwellOrgId?: SortOrder
    enrollmentDate?: SortOrder
    lastVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumHealthcareNetworkWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HealthcareNetwork | EnumHealthcareNetworkFieldRefInput<$PrismaModel>
    in?: $Enums.HealthcareNetwork[] | ListEnumHealthcareNetworkFieldRefInput<$PrismaModel>
    notIn?: $Enums.HealthcareNetwork[] | ListEnumHealthcareNetworkFieldRefInput<$PrismaModel>
    not?: NestedEnumHealthcareNetworkWithAggregatesFilter<$PrismaModel> | $Enums.HealthcareNetwork
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHealthcareNetworkFilter<$PrismaModel>
    _max?: NestedEnumHealthcareNetworkFilter<$PrismaModel>
  }

  export type EnumParticipantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ParticipantStatus | EnumParticipantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ParticipantStatus[] | ListEnumParticipantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ParticipantStatus[] | ListEnumParticipantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumParticipantStatusWithAggregatesFilter<$PrismaModel> | $Enums.ParticipantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumParticipantStatusFilter<$PrismaModel>
    _max?: NestedEnumParticipantStatusFilter<$PrismaModel>
  }

  export type EnumDirectAddressStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DirectAddressStatus | EnumDirectAddressStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DirectAddressStatus[] | ListEnumDirectAddressStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DirectAddressStatus[] | ListEnumDirectAddressStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectAddressStatusFilter<$PrismaModel> | $Enums.DirectAddressStatus
  }

  export type EnumDirectAddressOwnerFilter<$PrismaModel = never> = {
    equals?: $Enums.DirectAddressOwner | EnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    in?: $Enums.DirectAddressOwner[] | ListEnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    notIn?: $Enums.DirectAddressOwner[] | ListEnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectAddressOwnerFilter<$PrismaModel> | $Enums.DirectAddressOwner
  }

  export type DirectAddressCountOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    certificate?: SortOrder
    privateKey?: SortOrder
    domain?: SortOrder
    status?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    ownerName?: SortOrder
    trustAnchor?: SortOrder
    trustBundle?: SortOrder
    certificateExpiry?: SortOrder
    issuerDn?: SortOrder
    subjectDn?: SortOrder
    hispId?: SortOrder
    hispName?: SortOrder
    messagesSent?: SortOrder
    messagesReceived?: SortOrder
    lastActivity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DirectAddressAvgOrderByAggregateInput = {
    messagesSent?: SortOrder
    messagesReceived?: SortOrder
  }

  export type DirectAddressMaxOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    certificate?: SortOrder
    privateKey?: SortOrder
    domain?: SortOrder
    status?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    ownerName?: SortOrder
    trustAnchor?: SortOrder
    trustBundle?: SortOrder
    certificateExpiry?: SortOrder
    issuerDn?: SortOrder
    subjectDn?: SortOrder
    hispId?: SortOrder
    hispName?: SortOrder
    messagesSent?: SortOrder
    messagesReceived?: SortOrder
    lastActivity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DirectAddressMinOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    certificate?: SortOrder
    privateKey?: SortOrder
    domain?: SortOrder
    status?: SortOrder
    ownerType?: SortOrder
    ownerId?: SortOrder
    ownerName?: SortOrder
    trustAnchor?: SortOrder
    trustBundle?: SortOrder
    certificateExpiry?: SortOrder
    issuerDn?: SortOrder
    subjectDn?: SortOrder
    hispId?: SortOrder
    hispName?: SortOrder
    messagesSent?: SortOrder
    messagesReceived?: SortOrder
    lastActivity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DirectAddressSumOrderByAggregateInput = {
    messagesSent?: SortOrder
    messagesReceived?: SortOrder
  }

  export type EnumDirectAddressStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DirectAddressStatus | EnumDirectAddressStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DirectAddressStatus[] | ListEnumDirectAddressStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DirectAddressStatus[] | ListEnumDirectAddressStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectAddressStatusWithAggregatesFilter<$PrismaModel> | $Enums.DirectAddressStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDirectAddressStatusFilter<$PrismaModel>
    _max?: NestedEnumDirectAddressStatusFilter<$PrismaModel>
  }

  export type EnumDirectAddressOwnerWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DirectAddressOwner | EnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    in?: $Enums.DirectAddressOwner[] | ListEnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    notIn?: $Enums.DirectAddressOwner[] | ListEnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectAddressOwnerWithAggregatesFilter<$PrismaModel> | $Enums.DirectAddressOwner
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDirectAddressOwnerFilter<$PrismaModel>
    _max?: NestedEnumDirectAddressOwnerFilter<$PrismaModel>
  }

  export type EnumEndpointStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EndpointStatus | EnumEndpointStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EndpointStatus[] | ListEnumEndpointStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EndpointStatus[] | ListEnumEndpointStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEndpointStatusFilter<$PrismaModel> | $Enums.EndpointStatus
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FhirEndpointCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    fhirVersion?: SortOrder
    status?: SortOrder
    capabilityStatement?: SortOrder
    supportedResources?: SortOrder
    supportedOperations?: SortOrder
    authType?: SortOrder
    tokenEndpoint?: SortOrder
    authorizeEndpoint?: SortOrder
    clientId?: SortOrder
    clientSecret?: SortOrder
    scopes?: SortOrder
    smartEnabled?: SortOrder
    smartMetadata?: SortOrder
    organizationName?: SortOrder
    organizationNpi?: SortOrder
    lastHealthCheck?: SortOrder
    healthStatus?: SortOrder
    avgResponseTimeMs?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FhirEndpointAvgOrderByAggregateInput = {
    avgResponseTimeMs?: SortOrder
  }

  export type FhirEndpointMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    fhirVersion?: SortOrder
    status?: SortOrder
    authType?: SortOrder
    tokenEndpoint?: SortOrder
    authorizeEndpoint?: SortOrder
    clientId?: SortOrder
    clientSecret?: SortOrder
    smartEnabled?: SortOrder
    organizationName?: SortOrder
    organizationNpi?: SortOrder
    lastHealthCheck?: SortOrder
    healthStatus?: SortOrder
    avgResponseTimeMs?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FhirEndpointMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    fhirVersion?: SortOrder
    status?: SortOrder
    authType?: SortOrder
    tokenEndpoint?: SortOrder
    authorizeEndpoint?: SortOrder
    clientId?: SortOrder
    clientSecret?: SortOrder
    smartEnabled?: SortOrder
    organizationName?: SortOrder
    organizationNpi?: SortOrder
    lastHealthCheck?: SortOrder
    healthStatus?: SortOrder
    avgResponseTimeMs?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FhirEndpointSumOrderByAggregateInput = {
    avgResponseTimeMs?: SortOrder
  }

  export type EnumEndpointStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EndpointStatus | EnumEndpointStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EndpointStatus[] | ListEnumEndpointStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EndpointStatus[] | ListEnumEndpointStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEndpointStatusWithAggregatesFilter<$PrismaModel> | $Enums.EndpointStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEndpointStatusFilter<$PrismaModel>
    _max?: NestedEnumEndpointStatusFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumCCDADocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CCDADocumentType | EnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CCDADocumentType[] | ListEnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CCDADocumentType[] | ListEnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCCDADocumentTypeFilter<$PrismaModel> | $Enums.CCDADocumentType
  }

  export type EnumDocumentExchangeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentExchangeStatus | EnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentExchangeStatus[] | ListEnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentExchangeStatus[] | ListEnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentExchangeStatusFilter<$PrismaModel> | $Enums.DocumentExchangeStatus
  }

  export type CCDADocumentCountOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    documentType?: SortOrder
    patientId?: SortOrder
    title?: SortOrder
    creationTime?: SortOrder
    effectiveTime?: SortOrder
    confidentialityCode?: SortOrder
    languageCode?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    authorOrganization?: SortOrder
    custodianId?: SortOrder
    custodianName?: SortOrder
    storageLocation?: SortOrder
    contentHash?: SortOrder
    sizeBytes?: SortOrder
    mimeType?: SortOrder
    exchangeStatus?: SortOrder
    sourceNetwork?: SortOrder
    sourceOrganization?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CCDADocumentAvgOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type CCDADocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    documentType?: SortOrder
    patientId?: SortOrder
    title?: SortOrder
    creationTime?: SortOrder
    effectiveTime?: SortOrder
    confidentialityCode?: SortOrder
    languageCode?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    authorOrganization?: SortOrder
    custodianId?: SortOrder
    custodianName?: SortOrder
    storageLocation?: SortOrder
    contentHash?: SortOrder
    sizeBytes?: SortOrder
    mimeType?: SortOrder
    exchangeStatus?: SortOrder
    sourceNetwork?: SortOrder
    sourceOrganization?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CCDADocumentMinOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    documentType?: SortOrder
    patientId?: SortOrder
    title?: SortOrder
    creationTime?: SortOrder
    effectiveTime?: SortOrder
    confidentialityCode?: SortOrder
    languageCode?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    authorOrganization?: SortOrder
    custodianId?: SortOrder
    custodianName?: SortOrder
    storageLocation?: SortOrder
    contentHash?: SortOrder
    sizeBytes?: SortOrder
    mimeType?: SortOrder
    exchangeStatus?: SortOrder
    sourceNetwork?: SortOrder
    sourceOrganization?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CCDADocumentSumOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type EnumCCDADocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CCDADocumentType | EnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CCDADocumentType[] | ListEnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CCDADocumentType[] | ListEnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCCDADocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.CCDADocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCCDADocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumCCDADocumentTypeFilter<$PrismaModel>
  }

  export type EnumDocumentExchangeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentExchangeStatus | EnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentExchangeStatus[] | ListEnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentExchangeStatus[] | ListEnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentExchangeStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentExchangeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentExchangeStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentExchangeStatusFilter<$PrismaModel>
  }

  export type EnumX12TransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.X12TransactionType | EnumX12TransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.X12TransactionType[] | ListEnumX12TransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.X12TransactionType[] | ListEnumX12TransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumX12TransactionTypeFilter<$PrismaModel> | $Enums.X12TransactionType
  }

  export type EnumX12StatusFilter<$PrismaModel = never> = {
    equals?: $Enums.X12Status | EnumX12StatusFieldRefInput<$PrismaModel>
    in?: $Enums.X12Status[] | ListEnumX12StatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.X12Status[] | ListEnumX12StatusFieldRefInput<$PrismaModel>
    not?: NestedEnumX12StatusFilter<$PrismaModel> | $Enums.X12Status
  }

  export type X12TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    transactionSetId?: SortOrder
    transactionType?: SortOrder
    isaControlNumber?: SortOrder
    gsControlNumber?: SortOrder
    stControlNumber?: SortOrder
    senderId?: SortOrder
    senderQualifier?: SortOrder
    receiverId?: SortOrder
    receiverQualifier?: SortOrder
    rawContent?: SortOrder
    parsedContent?: SortOrder
    status?: SortOrder
    acknowledgmentCode?: SortOrder
    errors?: SortOrder
    interchangeDate?: SortOrder
    processedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type X12TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    transactionSetId?: SortOrder
    transactionType?: SortOrder
    isaControlNumber?: SortOrder
    gsControlNumber?: SortOrder
    stControlNumber?: SortOrder
    senderId?: SortOrder
    senderQualifier?: SortOrder
    receiverId?: SortOrder
    receiverQualifier?: SortOrder
    rawContent?: SortOrder
    status?: SortOrder
    acknowledgmentCode?: SortOrder
    interchangeDate?: SortOrder
    processedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type X12TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    transactionSetId?: SortOrder
    transactionType?: SortOrder
    isaControlNumber?: SortOrder
    gsControlNumber?: SortOrder
    stControlNumber?: SortOrder
    senderId?: SortOrder
    senderQualifier?: SortOrder
    receiverId?: SortOrder
    receiverQualifier?: SortOrder
    rawContent?: SortOrder
    status?: SortOrder
    acknowledgmentCode?: SortOrder
    interchangeDate?: SortOrder
    processedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumX12TransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.X12TransactionType | EnumX12TransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.X12TransactionType[] | ListEnumX12TransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.X12TransactionType[] | ListEnumX12TransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumX12TransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.X12TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumX12TransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumX12TransactionTypeFilter<$PrismaModel>
  }

  export type EnumX12StatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.X12Status | EnumX12StatusFieldRefInput<$PrismaModel>
    in?: $Enums.X12Status[] | ListEnumX12StatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.X12Status[] | ListEnumX12StatusFieldRefInput<$PrismaModel>
    not?: NestedEnumX12StatusWithAggregatesFilter<$PrismaModel> | $Enums.X12Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumX12StatusFilter<$PrismaModel>
    _max?: NestedEnumX12StatusFilter<$PrismaModel>
  }

  export type TradingPartnerCreatescopesInput = {
    set: string[]
  }

  export type TradingPartnerCreatesupportedProfilesInput = {
    set: string[]
  }

  export type TransactionLogCreateNestedManyWithoutPartnerInput = {
    create?: XOR<TransactionLogCreateWithoutPartnerInput, TransactionLogUncheckedCreateWithoutPartnerInput> | TransactionLogCreateWithoutPartnerInput[] | TransactionLogUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: TransactionLogCreateOrConnectWithoutPartnerInput | TransactionLogCreateOrConnectWithoutPartnerInput[]
    createMany?: TransactionLogCreateManyPartnerInputEnvelope
    connect?: TransactionLogWhereUniqueInput | TransactionLogWhereUniqueInput[]
  }

  export type TransactionLogUncheckedCreateNestedManyWithoutPartnerInput = {
    create?: XOR<TransactionLogCreateWithoutPartnerInput, TransactionLogUncheckedCreateWithoutPartnerInput> | TransactionLogCreateWithoutPartnerInput[] | TransactionLogUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: TransactionLogCreateOrConnectWithoutPartnerInput | TransactionLogCreateOrConnectWithoutPartnerInput[]
    createMany?: TransactionLogCreateManyPartnerInputEnvelope
    connect?: TransactionLogWhereUniqueInput | TransactionLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumTradingPartnerTypeFieldUpdateOperationsInput = {
    set?: $Enums.TradingPartnerType
  }

  export type EnumPartnerStatusFieldUpdateOperationsInput = {
    set?: $Enums.PartnerStatus
  }

  export type EnumAuthenticationTypeFieldUpdateOperationsInput = {
    set?: $Enums.AuthenticationType
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type TradingPartnerUpdatescopesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TradingPartnerUpdatesupportedProfilesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TransactionLogUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<TransactionLogCreateWithoutPartnerInput, TransactionLogUncheckedCreateWithoutPartnerInput> | TransactionLogCreateWithoutPartnerInput[] | TransactionLogUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: TransactionLogCreateOrConnectWithoutPartnerInput | TransactionLogCreateOrConnectWithoutPartnerInput[]
    upsert?: TransactionLogUpsertWithWhereUniqueWithoutPartnerInput | TransactionLogUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: TransactionLogCreateManyPartnerInputEnvelope
    set?: TransactionLogWhereUniqueInput | TransactionLogWhereUniqueInput[]
    disconnect?: TransactionLogWhereUniqueInput | TransactionLogWhereUniqueInput[]
    delete?: TransactionLogWhereUniqueInput | TransactionLogWhereUniqueInput[]
    connect?: TransactionLogWhereUniqueInput | TransactionLogWhereUniqueInput[]
    update?: TransactionLogUpdateWithWhereUniqueWithoutPartnerInput | TransactionLogUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: TransactionLogUpdateManyWithWhereWithoutPartnerInput | TransactionLogUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: TransactionLogScalarWhereInput | TransactionLogScalarWhereInput[]
  }

  export type TransactionLogUncheckedUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<TransactionLogCreateWithoutPartnerInput, TransactionLogUncheckedCreateWithoutPartnerInput> | TransactionLogCreateWithoutPartnerInput[] | TransactionLogUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: TransactionLogCreateOrConnectWithoutPartnerInput | TransactionLogCreateOrConnectWithoutPartnerInput[]
    upsert?: TransactionLogUpsertWithWhereUniqueWithoutPartnerInput | TransactionLogUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: TransactionLogCreateManyPartnerInputEnvelope
    set?: TransactionLogWhereUniqueInput | TransactionLogWhereUniqueInput[]
    disconnect?: TransactionLogWhereUniqueInput | TransactionLogWhereUniqueInput[]
    delete?: TransactionLogWhereUniqueInput | TransactionLogWhereUniqueInput[]
    connect?: TransactionLogWhereUniqueInput | TransactionLogWhereUniqueInput[]
    update?: TransactionLogUpdateWithWhereUniqueWithoutPartnerInput | TransactionLogUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: TransactionLogUpdateManyWithWhereWithoutPartnerInput | TransactionLogUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: TransactionLogScalarWhereInput | TransactionLogScalarWhereInput[]
  }

  export type TradingPartnerCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<TradingPartnerCreateWithoutTransactionsInput, TradingPartnerUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: TradingPartnerCreateOrConnectWithoutTransactionsInput
    connect?: TradingPartnerWhereUniqueInput
  }

  export type EnumTransactionTypeFieldUpdateOperationsInput = {
    set?: $Enums.TransactionType
  }

  export type EnumTransactionDirectionFieldUpdateOperationsInput = {
    set?: $Enums.TransactionDirection
  }

  export type EnumTransactionStatusFieldUpdateOperationsInput = {
    set?: $Enums.TransactionStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TradingPartnerUpdateOneWithoutTransactionsNestedInput = {
    create?: XOR<TradingPartnerCreateWithoutTransactionsInput, TradingPartnerUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: TradingPartnerCreateOrConnectWithoutTransactionsInput
    upsert?: TradingPartnerUpsertWithoutTransactionsInput
    disconnect?: TradingPartnerWhereInput | boolean
    delete?: TradingPartnerWhereInput | boolean
    connect?: TradingPartnerWhereUniqueInput
    update?: XOR<XOR<TradingPartnerUpdateToOneWithWhereWithoutTransactionsInput, TradingPartnerUpdateWithoutTransactionsInput>, TradingPartnerUncheckedUpdateWithoutTransactionsInput>
  }

  export type NetworkParticipantCreatesupportedPurposesInput = {
    set: string[]
  }

  export type EnumHealthcareNetworkFieldUpdateOperationsInput = {
    set?: $Enums.HealthcareNetwork
  }

  export type EnumParticipantStatusFieldUpdateOperationsInput = {
    set?: $Enums.ParticipantStatus
  }

  export type NetworkParticipantUpdatesupportedPurposesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumDirectAddressStatusFieldUpdateOperationsInput = {
    set?: $Enums.DirectAddressStatus
  }

  export type EnumDirectAddressOwnerFieldUpdateOperationsInput = {
    set?: $Enums.DirectAddressOwner
  }

  export type FhirEndpointCreatesupportedResourcesInput = {
    set: string[]
  }

  export type FhirEndpointCreatesupportedOperationsInput = {
    set: string[]
  }

  export type FhirEndpointCreatescopesInput = {
    set: string[]
  }

  export type EnumEndpointStatusFieldUpdateOperationsInput = {
    set?: $Enums.EndpointStatus
  }

  export type FhirEndpointUpdatesupportedResourcesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type FhirEndpointUpdatesupportedOperationsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type FhirEndpointUpdatescopesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumCCDADocumentTypeFieldUpdateOperationsInput = {
    set?: $Enums.CCDADocumentType
  }

  export type EnumDocumentExchangeStatusFieldUpdateOperationsInput = {
    set?: $Enums.DocumentExchangeStatus
  }

  export type EnumX12TransactionTypeFieldUpdateOperationsInput = {
    set?: $Enums.X12TransactionType
  }

  export type EnumX12StatusFieldUpdateOperationsInput = {
    set?: $Enums.X12Status
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumTradingPartnerTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TradingPartnerType | EnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TradingPartnerType[] | ListEnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradingPartnerType[] | ListEnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTradingPartnerTypeFilter<$PrismaModel> | $Enums.TradingPartnerType
  }

  export type NestedEnumPartnerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PartnerStatus | EnumPartnerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PartnerStatus[] | ListEnumPartnerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PartnerStatus[] | ListEnumPartnerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPartnerStatusFilter<$PrismaModel> | $Enums.PartnerStatus
  }

  export type NestedEnumAuthenticationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthenticationType | EnumAuthenticationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AuthenticationType[] | ListEnumAuthenticationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthenticationType[] | ListEnumAuthenticationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthenticationTypeFilter<$PrismaModel> | $Enums.AuthenticationType
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumTradingPartnerTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradingPartnerType | EnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TradingPartnerType[] | ListEnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradingPartnerType[] | ListEnumTradingPartnerTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTradingPartnerTypeWithAggregatesFilter<$PrismaModel> | $Enums.TradingPartnerType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradingPartnerTypeFilter<$PrismaModel>
    _max?: NestedEnumTradingPartnerTypeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumPartnerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PartnerStatus | EnumPartnerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PartnerStatus[] | ListEnumPartnerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PartnerStatus[] | ListEnumPartnerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPartnerStatusWithAggregatesFilter<$PrismaModel> | $Enums.PartnerStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPartnerStatusFilter<$PrismaModel>
    _max?: NestedEnumPartnerStatusFilter<$PrismaModel>
  }

  export type NestedEnumAuthenticationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthenticationType | EnumAuthenticationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AuthenticationType[] | ListEnumAuthenticationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthenticationType[] | ListEnumAuthenticationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthenticationTypeWithAggregatesFilter<$PrismaModel> | $Enums.AuthenticationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthenticationTypeFilter<$PrismaModel>
    _max?: NestedEnumAuthenticationTypeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumTransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeFilter<$PrismaModel> | $Enums.TransactionType
  }

  export type NestedEnumTransactionDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionDirection | EnumTransactionDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionDirection[] | ListEnumTransactionDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionDirection[] | ListEnumTransactionDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionDirectionFilter<$PrismaModel> | $Enums.TransactionDirection
  }

  export type NestedEnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeFilter<$PrismaModel>
  }

  export type NestedEnumTransactionDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionDirection | EnumTransactionDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionDirection[] | ListEnumTransactionDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionDirection[] | ListEnumTransactionDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionDirectionWithAggregatesFilter<$PrismaModel> | $Enums.TransactionDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionDirectionFilter<$PrismaModel>
    _max?: NestedEnumTransactionDirectionFilter<$PrismaModel>
  }

  export type NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumHealthcareNetworkFilter<$PrismaModel = never> = {
    equals?: $Enums.HealthcareNetwork | EnumHealthcareNetworkFieldRefInput<$PrismaModel>
    in?: $Enums.HealthcareNetwork[] | ListEnumHealthcareNetworkFieldRefInput<$PrismaModel>
    notIn?: $Enums.HealthcareNetwork[] | ListEnumHealthcareNetworkFieldRefInput<$PrismaModel>
    not?: NestedEnumHealthcareNetworkFilter<$PrismaModel> | $Enums.HealthcareNetwork
  }

  export type NestedEnumParticipantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ParticipantStatus | EnumParticipantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ParticipantStatus[] | ListEnumParticipantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ParticipantStatus[] | ListEnumParticipantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumParticipantStatusFilter<$PrismaModel> | $Enums.ParticipantStatus
  }

  export type NestedEnumHealthcareNetworkWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HealthcareNetwork | EnumHealthcareNetworkFieldRefInput<$PrismaModel>
    in?: $Enums.HealthcareNetwork[] | ListEnumHealthcareNetworkFieldRefInput<$PrismaModel>
    notIn?: $Enums.HealthcareNetwork[] | ListEnumHealthcareNetworkFieldRefInput<$PrismaModel>
    not?: NestedEnumHealthcareNetworkWithAggregatesFilter<$PrismaModel> | $Enums.HealthcareNetwork
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHealthcareNetworkFilter<$PrismaModel>
    _max?: NestedEnumHealthcareNetworkFilter<$PrismaModel>
  }

  export type NestedEnumParticipantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ParticipantStatus | EnumParticipantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ParticipantStatus[] | ListEnumParticipantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ParticipantStatus[] | ListEnumParticipantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumParticipantStatusWithAggregatesFilter<$PrismaModel> | $Enums.ParticipantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumParticipantStatusFilter<$PrismaModel>
    _max?: NestedEnumParticipantStatusFilter<$PrismaModel>
  }

  export type NestedEnumDirectAddressStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DirectAddressStatus | EnumDirectAddressStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DirectAddressStatus[] | ListEnumDirectAddressStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DirectAddressStatus[] | ListEnumDirectAddressStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectAddressStatusFilter<$PrismaModel> | $Enums.DirectAddressStatus
  }

  export type NestedEnumDirectAddressOwnerFilter<$PrismaModel = never> = {
    equals?: $Enums.DirectAddressOwner | EnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    in?: $Enums.DirectAddressOwner[] | ListEnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    notIn?: $Enums.DirectAddressOwner[] | ListEnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectAddressOwnerFilter<$PrismaModel> | $Enums.DirectAddressOwner
  }

  export type NestedEnumDirectAddressStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DirectAddressStatus | EnumDirectAddressStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DirectAddressStatus[] | ListEnumDirectAddressStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DirectAddressStatus[] | ListEnumDirectAddressStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectAddressStatusWithAggregatesFilter<$PrismaModel> | $Enums.DirectAddressStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDirectAddressStatusFilter<$PrismaModel>
    _max?: NestedEnumDirectAddressStatusFilter<$PrismaModel>
  }

  export type NestedEnumDirectAddressOwnerWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DirectAddressOwner | EnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    in?: $Enums.DirectAddressOwner[] | ListEnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    notIn?: $Enums.DirectAddressOwner[] | ListEnumDirectAddressOwnerFieldRefInput<$PrismaModel>
    not?: NestedEnumDirectAddressOwnerWithAggregatesFilter<$PrismaModel> | $Enums.DirectAddressOwner
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDirectAddressOwnerFilter<$PrismaModel>
    _max?: NestedEnumDirectAddressOwnerFilter<$PrismaModel>
  }

  export type NestedEnumEndpointStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EndpointStatus | EnumEndpointStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EndpointStatus[] | ListEnumEndpointStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EndpointStatus[] | ListEnumEndpointStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEndpointStatusFilter<$PrismaModel> | $Enums.EndpointStatus
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumEndpointStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EndpointStatus | EnumEndpointStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EndpointStatus[] | ListEnumEndpointStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EndpointStatus[] | ListEnumEndpointStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEndpointStatusWithAggregatesFilter<$PrismaModel> | $Enums.EndpointStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEndpointStatusFilter<$PrismaModel>
    _max?: NestedEnumEndpointStatusFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumCCDADocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CCDADocumentType | EnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CCDADocumentType[] | ListEnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CCDADocumentType[] | ListEnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCCDADocumentTypeFilter<$PrismaModel> | $Enums.CCDADocumentType
  }

  export type NestedEnumDocumentExchangeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentExchangeStatus | EnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentExchangeStatus[] | ListEnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentExchangeStatus[] | ListEnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentExchangeStatusFilter<$PrismaModel> | $Enums.DocumentExchangeStatus
  }

  export type NestedEnumCCDADocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CCDADocumentType | EnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.CCDADocumentType[] | ListEnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CCDADocumentType[] | ListEnumCCDADocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumCCDADocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.CCDADocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCCDADocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumCCDADocumentTypeFilter<$PrismaModel>
  }

  export type NestedEnumDocumentExchangeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentExchangeStatus | EnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentExchangeStatus[] | ListEnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentExchangeStatus[] | ListEnumDocumentExchangeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentExchangeStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentExchangeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentExchangeStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentExchangeStatusFilter<$PrismaModel>
  }

  export type NestedEnumX12TransactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.X12TransactionType | EnumX12TransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.X12TransactionType[] | ListEnumX12TransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.X12TransactionType[] | ListEnumX12TransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumX12TransactionTypeFilter<$PrismaModel> | $Enums.X12TransactionType
  }

  export type NestedEnumX12StatusFilter<$PrismaModel = never> = {
    equals?: $Enums.X12Status | EnumX12StatusFieldRefInput<$PrismaModel>
    in?: $Enums.X12Status[] | ListEnumX12StatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.X12Status[] | ListEnumX12StatusFieldRefInput<$PrismaModel>
    not?: NestedEnumX12StatusFilter<$PrismaModel> | $Enums.X12Status
  }

  export type NestedEnumX12TransactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.X12TransactionType | EnumX12TransactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.X12TransactionType[] | ListEnumX12TransactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.X12TransactionType[] | ListEnumX12TransactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumX12TransactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.X12TransactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumX12TransactionTypeFilter<$PrismaModel>
    _max?: NestedEnumX12TransactionTypeFilter<$PrismaModel>
  }

  export type NestedEnumX12StatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.X12Status | EnumX12StatusFieldRefInput<$PrismaModel>
    in?: $Enums.X12Status[] | ListEnumX12StatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.X12Status[] | ListEnumX12StatusFieldRefInput<$PrismaModel>
    not?: NestedEnumX12StatusWithAggregatesFilter<$PrismaModel> | $Enums.X12Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumX12StatusFilter<$PrismaModel>
    _max?: NestedEnumX12StatusFilter<$PrismaModel>
  }

  export type TransactionLogCreateWithoutPartnerInput = {
    id?: string
    transactionId: string
    type: $Enums.TransactionType
    direction: $Enums.TransactionDirection
    status?: $Enums.TransactionStatus
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: string | null
    contentType?: string | null
    requestUrl?: string | null
    requestMethod?: string | null
    responseCode?: number | null
    responseMessage?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    maxRetries?: number
    initiatedAt?: Date | string
    completedAt?: Date | string | null
    processingTimeMs?: number | null
    userId?: string | null
    correlationId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionLogUncheckedCreateWithoutPartnerInput = {
    id?: string
    transactionId: string
    type: $Enums.TransactionType
    direction: $Enums.TransactionDirection
    status?: $Enums.TransactionStatus
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: string | null
    contentType?: string | null
    requestUrl?: string | null
    requestMethod?: string | null
    responseCode?: number | null
    responseMessage?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    maxRetries?: number
    initiatedAt?: Date | string
    completedAt?: Date | string | null
    processingTimeMs?: number | null
    userId?: string | null
    correlationId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionLogCreateOrConnectWithoutPartnerInput = {
    where: TransactionLogWhereUniqueInput
    create: XOR<TransactionLogCreateWithoutPartnerInput, TransactionLogUncheckedCreateWithoutPartnerInput>
  }

  export type TransactionLogCreateManyPartnerInputEnvelope = {
    data: TransactionLogCreateManyPartnerInput | TransactionLogCreateManyPartnerInput[]
    skipDuplicates?: boolean
  }

  export type TransactionLogUpsertWithWhereUniqueWithoutPartnerInput = {
    where: TransactionLogWhereUniqueInput
    update: XOR<TransactionLogUpdateWithoutPartnerInput, TransactionLogUncheckedUpdateWithoutPartnerInput>
    create: XOR<TransactionLogCreateWithoutPartnerInput, TransactionLogUncheckedCreateWithoutPartnerInput>
  }

  export type TransactionLogUpdateWithWhereUniqueWithoutPartnerInput = {
    where: TransactionLogWhereUniqueInput
    data: XOR<TransactionLogUpdateWithoutPartnerInput, TransactionLogUncheckedUpdateWithoutPartnerInput>
  }

  export type TransactionLogUpdateManyWithWhereWithoutPartnerInput = {
    where: TransactionLogScalarWhereInput
    data: XOR<TransactionLogUpdateManyMutationInput, TransactionLogUncheckedUpdateManyWithoutPartnerInput>
  }

  export type TransactionLogScalarWhereInput = {
    AND?: TransactionLogScalarWhereInput | TransactionLogScalarWhereInput[]
    OR?: TransactionLogScalarWhereInput[]
    NOT?: TransactionLogScalarWhereInput | TransactionLogScalarWhereInput[]
    id?: StringFilter<"TransactionLog"> | string
    transactionId?: StringFilter<"TransactionLog"> | string
    type?: EnumTransactionTypeFilter<"TransactionLog"> | $Enums.TransactionType
    direction?: EnumTransactionDirectionFilter<"TransactionLog"> | $Enums.TransactionDirection
    status?: EnumTransactionStatusFilter<"TransactionLog"> | $Enums.TransactionStatus
    partnerId?: StringNullableFilter<"TransactionLog"> | string | null
    payload?: JsonNullableFilter<"TransactionLog">
    payloadHash?: StringNullableFilter<"TransactionLog"> | string | null
    contentType?: StringNullableFilter<"TransactionLog"> | string | null
    requestUrl?: StringNullableFilter<"TransactionLog"> | string | null
    requestMethod?: StringNullableFilter<"TransactionLog"> | string | null
    responseCode?: IntNullableFilter<"TransactionLog"> | number | null
    responseMessage?: StringNullableFilter<"TransactionLog"> | string | null
    errorCode?: StringNullableFilter<"TransactionLog"> | string | null
    errorMessage?: StringNullableFilter<"TransactionLog"> | string | null
    retryCount?: IntFilter<"TransactionLog"> | number
    maxRetries?: IntFilter<"TransactionLog"> | number
    initiatedAt?: DateTimeFilter<"TransactionLog"> | Date | string
    completedAt?: DateTimeNullableFilter<"TransactionLog"> | Date | string | null
    processingTimeMs?: IntNullableFilter<"TransactionLog"> | number | null
    userId?: StringNullableFilter<"TransactionLog"> | string | null
    correlationId?: StringNullableFilter<"TransactionLog"> | string | null
    createdAt?: DateTimeFilter<"TransactionLog"> | Date | string
    updatedAt?: DateTimeFilter<"TransactionLog"> | Date | string
  }

  export type TradingPartnerCreateWithoutTransactionsInput = {
    id?: string
    name: string
    type: $Enums.TradingPartnerType
    endpoint: string
    certificates?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.PartnerStatus
    authType?: $Enums.AuthenticationType
    clientId?: string | null
    clientSecret?: string | null
    tokenEndpoint?: string | null
    scopes?: TradingPartnerCreatescopesInput | string[]
    fhirVersion?: string | null
    supportedProfiles?: TradingPartnerCreatesupportedProfilesInput | string[]
    isaId?: string | null
    gsId?: string | null
    directDomain?: string | null
    smtpHost?: string | null
    smtpPort?: number | null
    contactName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingPartnerUncheckedCreateWithoutTransactionsInput = {
    id?: string
    name: string
    type: $Enums.TradingPartnerType
    endpoint: string
    certificates?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.PartnerStatus
    authType?: $Enums.AuthenticationType
    clientId?: string | null
    clientSecret?: string | null
    tokenEndpoint?: string | null
    scopes?: TradingPartnerCreatescopesInput | string[]
    fhirVersion?: string | null
    supportedProfiles?: TradingPartnerCreatesupportedProfilesInput | string[]
    isaId?: string | null
    gsId?: string | null
    directDomain?: string | null
    smtpHost?: string | null
    smtpPort?: number | null
    contactName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradingPartnerCreateOrConnectWithoutTransactionsInput = {
    where: TradingPartnerWhereUniqueInput
    create: XOR<TradingPartnerCreateWithoutTransactionsInput, TradingPartnerUncheckedCreateWithoutTransactionsInput>
  }

  export type TradingPartnerUpsertWithoutTransactionsInput = {
    update: XOR<TradingPartnerUpdateWithoutTransactionsInput, TradingPartnerUncheckedUpdateWithoutTransactionsInput>
    create: XOR<TradingPartnerCreateWithoutTransactionsInput, TradingPartnerUncheckedCreateWithoutTransactionsInput>
    where?: TradingPartnerWhereInput
  }

  export type TradingPartnerUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: TradingPartnerWhereInput
    data: XOR<TradingPartnerUpdateWithoutTransactionsInput, TradingPartnerUncheckedUpdateWithoutTransactionsInput>
  }

  export type TradingPartnerUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTradingPartnerTypeFieldUpdateOperationsInput | $Enums.TradingPartnerType
    endpoint?: StringFieldUpdateOperationsInput | string
    certificates?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumPartnerStatusFieldUpdateOperationsInput | $Enums.PartnerStatus
    authType?: EnumAuthenticationTypeFieldUpdateOperationsInput | $Enums.AuthenticationType
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    clientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    tokenEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    scopes?: TradingPartnerUpdatescopesInput | string[]
    fhirVersion?: NullableStringFieldUpdateOperationsInput | string | null
    supportedProfiles?: TradingPartnerUpdatesupportedProfilesInput | string[]
    isaId?: NullableStringFieldUpdateOperationsInput | string | null
    gsId?: NullableStringFieldUpdateOperationsInput | string | null
    directDomain?: NullableStringFieldUpdateOperationsInput | string | null
    smtpHost?: NullableStringFieldUpdateOperationsInput | string | null
    smtpPort?: NullableIntFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingPartnerUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumTradingPartnerTypeFieldUpdateOperationsInput | $Enums.TradingPartnerType
    endpoint?: StringFieldUpdateOperationsInput | string
    certificates?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumPartnerStatusFieldUpdateOperationsInput | $Enums.PartnerStatus
    authType?: EnumAuthenticationTypeFieldUpdateOperationsInput | $Enums.AuthenticationType
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    clientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    tokenEndpoint?: NullableStringFieldUpdateOperationsInput | string | null
    scopes?: TradingPartnerUpdatescopesInput | string[]
    fhirVersion?: NullableStringFieldUpdateOperationsInput | string | null
    supportedProfiles?: TradingPartnerUpdatesupportedProfilesInput | string[]
    isaId?: NullableStringFieldUpdateOperationsInput | string | null
    gsId?: NullableStringFieldUpdateOperationsInput | string | null
    directDomain?: NullableStringFieldUpdateOperationsInput | string | null
    smtpHost?: NullableStringFieldUpdateOperationsInput | string | null
    smtpPort?: NullableIntFieldUpdateOperationsInput | number | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionLogCreateManyPartnerInput = {
    id?: string
    transactionId: string
    type: $Enums.TransactionType
    direction: $Enums.TransactionDirection
    status?: $Enums.TransactionStatus
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: string | null
    contentType?: string | null
    requestUrl?: string | null
    requestMethod?: string | null
    responseCode?: number | null
    responseMessage?: string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    maxRetries?: number
    initiatedAt?: Date | string
    completedAt?: Date | string | null
    processingTimeMs?: number | null
    userId?: string | null
    correlationId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionLogUpdateWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    direction?: EnumTransactionDirectionFieldUpdateOperationsInput | $Enums.TransactionDirection
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    requestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    requestMethod?: NullableStringFieldUpdateOperationsInput | string | null
    responseCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseMessage?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    maxRetries?: IntFieldUpdateOperationsInput | number
    initiatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionLogUncheckedUpdateWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    direction?: EnumTransactionDirectionFieldUpdateOperationsInput | $Enums.TransactionDirection
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    requestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    requestMethod?: NullableStringFieldUpdateOperationsInput | string | null
    responseCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseMessage?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    maxRetries?: IntFieldUpdateOperationsInput | number
    initiatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionLogUncheckedUpdateManyWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    type?: EnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType
    direction?: EnumTransactionDirectionFieldUpdateOperationsInput | $Enums.TransactionDirection
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    payload?: NullableJsonNullValueInput | InputJsonValue
    payloadHash?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    requestUrl?: NullableStringFieldUpdateOperationsInput | string | null
    requestMethod?: NullableStringFieldUpdateOperationsInput | string | null
    responseCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseMessage?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    maxRetries?: IntFieldUpdateOperationsInput | number
    initiatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use TradingPartnerCountOutputTypeDefaultArgs instead
     */
    export type TradingPartnerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TradingPartnerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TradingPartnerDefaultArgs instead
     */
    export type TradingPartnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TradingPartnerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TransactionLogDefaultArgs instead
     */
    export type TransactionLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TransactionLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NetworkParticipantDefaultArgs instead
     */
    export type NetworkParticipantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NetworkParticipantDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DirectAddressDefaultArgs instead
     */
    export type DirectAddressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DirectAddressDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FhirEndpointDefaultArgs instead
     */
    export type FhirEndpointArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FhirEndpointDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CCDADocumentDefaultArgs instead
     */
    export type CCDADocumentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CCDADocumentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use X12TransactionDefaultArgs instead
     */
    export type X12TransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = X12TransactionDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}