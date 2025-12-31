
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
 * Model Denial
 * 
 */
export type Denial = $Result.DefaultSelection<Prisma.$DenialPayload>
/**
 * Model Appeal
 * 
 */
export type Appeal = $Result.DefaultSelection<Prisma.$AppealPayload>
/**
 * Model DenialPattern
 * 
 */
export type DenialPattern = $Result.DefaultSelection<Prisma.$DenialPatternPayload>
/**
 * Model PayerConfig
 * 
 */
export type PayerConfig = $Result.DefaultSelection<Prisma.$PayerConfigPayload>
/**
 * Model StaffProductivity
 * 
 */
export type StaffProductivity = $Result.DefaultSelection<Prisma.$StaffProductivityPayload>
/**
 * Model RevenueRecovery
 * 
 */
export type RevenueRecovery = $Result.DefaultSelection<Prisma.$RevenueRecoveryPayload>
/**
 * Model ClaimRiskAssessment
 * 
 */
export type ClaimRiskAssessment = $Result.DefaultSelection<Prisma.$ClaimRiskAssessmentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ClaimStatus: {
  pending: 'pending',
  denied: 'denied',
  partially_denied: 'partially_denied',
  appealed: 'appealed',
  appeal_pending: 'appeal_pending',
  appeal_approved: 'appeal_approved',
  appeal_denied: 'appeal_denied',
  recovered: 'recovered',
  written_off: 'written_off'
};

export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus]


export const DenialCategory: {
  prior_authorization: 'prior_authorization',
  medical_necessity: 'medical_necessity',
  coding_error: 'coding_error',
  duplicate_claim: 'duplicate_claim',
  timely_filing: 'timely_filing',
  eligibility: 'eligibility',
  coordination_of_benefits: 'coordination_of_benefits',
  bundling: 'bundling',
  modifier_issue: 'modifier_issue',
  documentation: 'documentation',
  non_covered_service: 'non_covered_service',
  out_of_network: 'out_of_network',
  benefit_exhausted: 'benefit_exhausted',
  pre_existing_condition: 'pre_existing_condition',
  other: 'other'
};

export type DenialCategory = (typeof DenialCategory)[keyof typeof DenialCategory]


export const AppealType: {
  clinical_review: 'clinical_review',
  administrative_review: 'administrative_review',
  peer_to_peer: 'peer_to_peer',
  external_review: 'external_review',
  expedited: 'expedited'
};

export type AppealType = (typeof AppealType)[keyof typeof AppealType]


export const AppealStatus: {
  draft: 'draft',
  pending_review: 'pending_review',
  approved_for_submission: 'approved_for_submission',
  submitted: 'submitted',
  pending_response: 'pending_response',
  additional_info_requested: 'additional_info_requested',
  resolved: 'resolved',
  closed: 'closed'
};

export type AppealStatus = (typeof AppealStatus)[keyof typeof AppealStatus]


export const AppealOutcome: {
  overturned_full: 'overturned_full',
  overturned_partial: 'overturned_partial',
  upheld: 'upheld',
  withdrawn: 'withdrawn',
  expired: 'expired'
};

export type AppealOutcome = (typeof AppealOutcome)[keyof typeof AppealOutcome]


export const RiskLevel: {
  low: 'low',
  moderate: 'moderate',
  high: 'high',
  critical: 'critical'
};

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel]

}

export type ClaimStatus = $Enums.ClaimStatus

export const ClaimStatus: typeof $Enums.ClaimStatus

export type DenialCategory = $Enums.DenialCategory

export const DenialCategory: typeof $Enums.DenialCategory

export type AppealType = $Enums.AppealType

export const AppealType: typeof $Enums.AppealType

export type AppealStatus = $Enums.AppealStatus

export const AppealStatus: typeof $Enums.AppealStatus

export type AppealOutcome = $Enums.AppealOutcome

export const AppealOutcome: typeof $Enums.AppealOutcome

export type RiskLevel = $Enums.RiskLevel

export const RiskLevel: typeof $Enums.RiskLevel

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Denials
 * const denials = await prisma.denial.findMany()
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
   * // Fetch zero or more Denials
   * const denials = await prisma.denial.findMany()
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
   * `prisma.denial`: Exposes CRUD operations for the **Denial** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Denials
    * const denials = await prisma.denial.findMany()
    * ```
    */
  get denial(): Prisma.DenialDelegate<ExtArgs>;

  /**
   * `prisma.appeal`: Exposes CRUD operations for the **Appeal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Appeals
    * const appeals = await prisma.appeal.findMany()
    * ```
    */
  get appeal(): Prisma.AppealDelegate<ExtArgs>;

  /**
   * `prisma.denialPattern`: Exposes CRUD operations for the **DenialPattern** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DenialPatterns
    * const denialPatterns = await prisma.denialPattern.findMany()
    * ```
    */
  get denialPattern(): Prisma.DenialPatternDelegate<ExtArgs>;

  /**
   * `prisma.payerConfig`: Exposes CRUD operations for the **PayerConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayerConfigs
    * const payerConfigs = await prisma.payerConfig.findMany()
    * ```
    */
  get payerConfig(): Prisma.PayerConfigDelegate<ExtArgs>;

  /**
   * `prisma.staffProductivity`: Exposes CRUD operations for the **StaffProductivity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StaffProductivities
    * const staffProductivities = await prisma.staffProductivity.findMany()
    * ```
    */
  get staffProductivity(): Prisma.StaffProductivityDelegate<ExtArgs>;

  /**
   * `prisma.revenueRecovery`: Exposes CRUD operations for the **RevenueRecovery** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RevenueRecoveries
    * const revenueRecoveries = await prisma.revenueRecovery.findMany()
    * ```
    */
  get revenueRecovery(): Prisma.RevenueRecoveryDelegate<ExtArgs>;

  /**
   * `prisma.claimRiskAssessment`: Exposes CRUD operations for the **ClaimRiskAssessment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClaimRiskAssessments
    * const claimRiskAssessments = await prisma.claimRiskAssessment.findMany()
    * ```
    */
  get claimRiskAssessment(): Prisma.ClaimRiskAssessmentDelegate<ExtArgs>;
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
    Denial: 'Denial',
    Appeal: 'Appeal',
    DenialPattern: 'DenialPattern',
    PayerConfig: 'PayerConfig',
    StaffProductivity: 'StaffProductivity',
    RevenueRecovery: 'RevenueRecovery',
    ClaimRiskAssessment: 'ClaimRiskAssessment'
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
      modelProps: "denial" | "appeal" | "denialPattern" | "payerConfig" | "staffProductivity" | "revenueRecovery" | "claimRiskAssessment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Denial: {
        payload: Prisma.$DenialPayload<ExtArgs>
        fields: Prisma.DenialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DenialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DenialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          findFirst: {
            args: Prisma.DenialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DenialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          findMany: {
            args: Prisma.DenialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>[]
          }
          create: {
            args: Prisma.DenialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          createMany: {
            args: Prisma.DenialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DenialCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>[]
          }
          delete: {
            args: Prisma.DenialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          update: {
            args: Prisma.DenialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          deleteMany: {
            args: Prisma.DenialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DenialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DenialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          aggregate: {
            args: Prisma.DenialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDenial>
          }
          groupBy: {
            args: Prisma.DenialGroupByArgs<ExtArgs>
            result: $Utils.Optional<DenialGroupByOutputType>[]
          }
          count: {
            args: Prisma.DenialCountArgs<ExtArgs>
            result: $Utils.Optional<DenialCountAggregateOutputType> | number
          }
        }
      }
      Appeal: {
        payload: Prisma.$AppealPayload<ExtArgs>
        fields: Prisma.AppealFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppealFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppealPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppealFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppealPayload>
          }
          findFirst: {
            args: Prisma.AppealFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppealPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppealFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppealPayload>
          }
          findMany: {
            args: Prisma.AppealFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppealPayload>[]
          }
          create: {
            args: Prisma.AppealCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppealPayload>
          }
          createMany: {
            args: Prisma.AppealCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppealCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppealPayload>[]
          }
          delete: {
            args: Prisma.AppealDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppealPayload>
          }
          update: {
            args: Prisma.AppealUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppealPayload>
          }
          deleteMany: {
            args: Prisma.AppealDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppealUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AppealUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppealPayload>
          }
          aggregate: {
            args: Prisma.AppealAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppeal>
          }
          groupBy: {
            args: Prisma.AppealGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppealGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppealCountArgs<ExtArgs>
            result: $Utils.Optional<AppealCountAggregateOutputType> | number
          }
        }
      }
      DenialPattern: {
        payload: Prisma.$DenialPatternPayload<ExtArgs>
        fields: Prisma.DenialPatternFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DenialPatternFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPatternPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DenialPatternFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPatternPayload>
          }
          findFirst: {
            args: Prisma.DenialPatternFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPatternPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DenialPatternFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPatternPayload>
          }
          findMany: {
            args: Prisma.DenialPatternFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPatternPayload>[]
          }
          create: {
            args: Prisma.DenialPatternCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPatternPayload>
          }
          createMany: {
            args: Prisma.DenialPatternCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DenialPatternCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPatternPayload>[]
          }
          delete: {
            args: Prisma.DenialPatternDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPatternPayload>
          }
          update: {
            args: Prisma.DenialPatternUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPatternPayload>
          }
          deleteMany: {
            args: Prisma.DenialPatternDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DenialPatternUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DenialPatternUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPatternPayload>
          }
          aggregate: {
            args: Prisma.DenialPatternAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDenialPattern>
          }
          groupBy: {
            args: Prisma.DenialPatternGroupByArgs<ExtArgs>
            result: $Utils.Optional<DenialPatternGroupByOutputType>[]
          }
          count: {
            args: Prisma.DenialPatternCountArgs<ExtArgs>
            result: $Utils.Optional<DenialPatternCountAggregateOutputType> | number
          }
        }
      }
      PayerConfig: {
        payload: Prisma.$PayerConfigPayload<ExtArgs>
        fields: Prisma.PayerConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayerConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayerConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerConfigPayload>
          }
          findFirst: {
            args: Prisma.PayerConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayerConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerConfigPayload>
          }
          findMany: {
            args: Prisma.PayerConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerConfigPayload>[]
          }
          create: {
            args: Prisma.PayerConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerConfigPayload>
          }
          createMany: {
            args: Prisma.PayerConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PayerConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerConfigPayload>[]
          }
          delete: {
            args: Prisma.PayerConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerConfigPayload>
          }
          update: {
            args: Prisma.PayerConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerConfigPayload>
          }
          deleteMany: {
            args: Prisma.PayerConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayerConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayerConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerConfigPayload>
          }
          aggregate: {
            args: Prisma.PayerConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayerConfig>
          }
          groupBy: {
            args: Prisma.PayerConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayerConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.PayerConfigCountArgs<ExtArgs>
            result: $Utils.Optional<PayerConfigCountAggregateOutputType> | number
          }
        }
      }
      StaffProductivity: {
        payload: Prisma.$StaffProductivityPayload<ExtArgs>
        fields: Prisma.StaffProductivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StaffProductivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffProductivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StaffProductivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffProductivityPayload>
          }
          findFirst: {
            args: Prisma.StaffProductivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffProductivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StaffProductivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffProductivityPayload>
          }
          findMany: {
            args: Prisma.StaffProductivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffProductivityPayload>[]
          }
          create: {
            args: Prisma.StaffProductivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffProductivityPayload>
          }
          createMany: {
            args: Prisma.StaffProductivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StaffProductivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffProductivityPayload>[]
          }
          delete: {
            args: Prisma.StaffProductivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffProductivityPayload>
          }
          update: {
            args: Prisma.StaffProductivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffProductivityPayload>
          }
          deleteMany: {
            args: Prisma.StaffProductivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StaffProductivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StaffProductivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffProductivityPayload>
          }
          aggregate: {
            args: Prisma.StaffProductivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStaffProductivity>
          }
          groupBy: {
            args: Prisma.StaffProductivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<StaffProductivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.StaffProductivityCountArgs<ExtArgs>
            result: $Utils.Optional<StaffProductivityCountAggregateOutputType> | number
          }
        }
      }
      RevenueRecovery: {
        payload: Prisma.$RevenueRecoveryPayload<ExtArgs>
        fields: Prisma.RevenueRecoveryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RevenueRecoveryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueRecoveryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RevenueRecoveryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueRecoveryPayload>
          }
          findFirst: {
            args: Prisma.RevenueRecoveryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueRecoveryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RevenueRecoveryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueRecoveryPayload>
          }
          findMany: {
            args: Prisma.RevenueRecoveryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueRecoveryPayload>[]
          }
          create: {
            args: Prisma.RevenueRecoveryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueRecoveryPayload>
          }
          createMany: {
            args: Prisma.RevenueRecoveryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RevenueRecoveryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueRecoveryPayload>[]
          }
          delete: {
            args: Prisma.RevenueRecoveryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueRecoveryPayload>
          }
          update: {
            args: Prisma.RevenueRecoveryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueRecoveryPayload>
          }
          deleteMany: {
            args: Prisma.RevenueRecoveryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RevenueRecoveryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RevenueRecoveryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueRecoveryPayload>
          }
          aggregate: {
            args: Prisma.RevenueRecoveryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRevenueRecovery>
          }
          groupBy: {
            args: Prisma.RevenueRecoveryGroupByArgs<ExtArgs>
            result: $Utils.Optional<RevenueRecoveryGroupByOutputType>[]
          }
          count: {
            args: Prisma.RevenueRecoveryCountArgs<ExtArgs>
            result: $Utils.Optional<RevenueRecoveryCountAggregateOutputType> | number
          }
        }
      }
      ClaimRiskAssessment: {
        payload: Prisma.$ClaimRiskAssessmentPayload<ExtArgs>
        fields: Prisma.ClaimRiskAssessmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClaimRiskAssessmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimRiskAssessmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClaimRiskAssessmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimRiskAssessmentPayload>
          }
          findFirst: {
            args: Prisma.ClaimRiskAssessmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimRiskAssessmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClaimRiskAssessmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimRiskAssessmentPayload>
          }
          findMany: {
            args: Prisma.ClaimRiskAssessmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimRiskAssessmentPayload>[]
          }
          create: {
            args: Prisma.ClaimRiskAssessmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimRiskAssessmentPayload>
          }
          createMany: {
            args: Prisma.ClaimRiskAssessmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClaimRiskAssessmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimRiskAssessmentPayload>[]
          }
          delete: {
            args: Prisma.ClaimRiskAssessmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimRiskAssessmentPayload>
          }
          update: {
            args: Prisma.ClaimRiskAssessmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimRiskAssessmentPayload>
          }
          deleteMany: {
            args: Prisma.ClaimRiskAssessmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClaimRiskAssessmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClaimRiskAssessmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimRiskAssessmentPayload>
          }
          aggregate: {
            args: Prisma.ClaimRiskAssessmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClaimRiskAssessment>
          }
          groupBy: {
            args: Prisma.ClaimRiskAssessmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClaimRiskAssessmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClaimRiskAssessmentCountArgs<ExtArgs>
            result: $Utils.Optional<ClaimRiskAssessmentCountAggregateOutputType> | number
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
   * Count Type DenialCountOutputType
   */

  export type DenialCountOutputType = {
    appeals: number
  }

  export type DenialCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appeals?: boolean | DenialCountOutputTypeCountAppealsArgs
  }

  // Custom InputTypes
  /**
   * DenialCountOutputType without action
   */
  export type DenialCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialCountOutputType
     */
    select?: DenialCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DenialCountOutputType without action
   */
  export type DenialCountOutputTypeCountAppealsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppealWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Denial
   */

  export type AggregateDenial = {
    _count: DenialCountAggregateOutputType | null
    _avg: DenialAvgAggregateOutputType | null
    _sum: DenialSumAggregateOutputType | null
    _min: DenialMinAggregateOutputType | null
    _max: DenialMaxAggregateOutputType | null
  }

  export type DenialAvgAggregateOutputType = {
    billedAmount: Decimal | null
    allowedAmount: Decimal | null
    paidAmount: Decimal | null
    patientResponsibility: Decimal | null
    recoveryProbability: number | null
    recoveredAmount: Decimal | null
    writeOffAmount: Decimal | null
  }

  export type DenialSumAggregateOutputType = {
    billedAmount: Decimal | null
    allowedAmount: Decimal | null
    paidAmount: Decimal | null
    patientResponsibility: Decimal | null
    recoveryProbability: number | null
    recoveredAmount: Decimal | null
    writeOffAmount: Decimal | null
  }

  export type DenialMinAggregateOutputType = {
    id: string | null
    claimId: string | null
    patientId: string | null
    providerId: string | null
    payerId: string | null
    payerName: string | null
    claimStatus: $Enums.ClaimStatus | null
    denialDate: Date | null
    serviceDate: Date | null
    billedAmount: Decimal | null
    allowedAmount: Decimal | null
    paidAmount: Decimal | null
    patientResponsibility: Decimal | null
    carcCode: string | null
    carcDescription: string | null
    groupCode: string | null
    procedureCode: string | null
    placeOfService: string | null
    x277StatusCode: string | null
    x277StatusMessage: string | null
    predictedRecoverable: boolean | null
    recoveryProbability: number | null
    denialCategory: $Enums.DenialCategory | null
    rootCause: string | null
    recoveredAmount: Decimal | null
    writeOffAmount: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DenialMaxAggregateOutputType = {
    id: string | null
    claimId: string | null
    patientId: string | null
    providerId: string | null
    payerId: string | null
    payerName: string | null
    claimStatus: $Enums.ClaimStatus | null
    denialDate: Date | null
    serviceDate: Date | null
    billedAmount: Decimal | null
    allowedAmount: Decimal | null
    paidAmount: Decimal | null
    patientResponsibility: Decimal | null
    carcCode: string | null
    carcDescription: string | null
    groupCode: string | null
    procedureCode: string | null
    placeOfService: string | null
    x277StatusCode: string | null
    x277StatusMessage: string | null
    predictedRecoverable: boolean | null
    recoveryProbability: number | null
    denialCategory: $Enums.DenialCategory | null
    rootCause: string | null
    recoveredAmount: Decimal | null
    writeOffAmount: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DenialCountAggregateOutputType = {
    id: number
    claimId: number
    patientId: number
    providerId: number
    payerId: number
    payerName: number
    claimStatus: number
    denialDate: number
    serviceDate: number
    billedAmount: number
    allowedAmount: number
    paidAmount: number
    patientResponsibility: number
    carcCode: number
    carcDescription: number
    rarcCodes: number
    groupCode: number
    procedureCode: number
    procedureModifiers: number
    diagnosisCodes: number
    placeOfService: number
    x277StatusCode: number
    x277StatusMessage: number
    predictedRecoverable: number
    recoveryProbability: number
    riskFactors: number
    denialCategory: number
    rootCause: number
    recoveredAmount: number
    writeOffAmount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DenialAvgAggregateInputType = {
    billedAmount?: true
    allowedAmount?: true
    paidAmount?: true
    patientResponsibility?: true
    recoveryProbability?: true
    recoveredAmount?: true
    writeOffAmount?: true
  }

  export type DenialSumAggregateInputType = {
    billedAmount?: true
    allowedAmount?: true
    paidAmount?: true
    patientResponsibility?: true
    recoveryProbability?: true
    recoveredAmount?: true
    writeOffAmount?: true
  }

  export type DenialMinAggregateInputType = {
    id?: true
    claimId?: true
    patientId?: true
    providerId?: true
    payerId?: true
    payerName?: true
    claimStatus?: true
    denialDate?: true
    serviceDate?: true
    billedAmount?: true
    allowedAmount?: true
    paidAmount?: true
    patientResponsibility?: true
    carcCode?: true
    carcDescription?: true
    groupCode?: true
    procedureCode?: true
    placeOfService?: true
    x277StatusCode?: true
    x277StatusMessage?: true
    predictedRecoverable?: true
    recoveryProbability?: true
    denialCategory?: true
    rootCause?: true
    recoveredAmount?: true
    writeOffAmount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DenialMaxAggregateInputType = {
    id?: true
    claimId?: true
    patientId?: true
    providerId?: true
    payerId?: true
    payerName?: true
    claimStatus?: true
    denialDate?: true
    serviceDate?: true
    billedAmount?: true
    allowedAmount?: true
    paidAmount?: true
    patientResponsibility?: true
    carcCode?: true
    carcDescription?: true
    groupCode?: true
    procedureCode?: true
    placeOfService?: true
    x277StatusCode?: true
    x277StatusMessage?: true
    predictedRecoverable?: true
    recoveryProbability?: true
    denialCategory?: true
    rootCause?: true
    recoveredAmount?: true
    writeOffAmount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DenialCountAggregateInputType = {
    id?: true
    claimId?: true
    patientId?: true
    providerId?: true
    payerId?: true
    payerName?: true
    claimStatus?: true
    denialDate?: true
    serviceDate?: true
    billedAmount?: true
    allowedAmount?: true
    paidAmount?: true
    patientResponsibility?: true
    carcCode?: true
    carcDescription?: true
    rarcCodes?: true
    groupCode?: true
    procedureCode?: true
    procedureModifiers?: true
    diagnosisCodes?: true
    placeOfService?: true
    x277StatusCode?: true
    x277StatusMessage?: true
    predictedRecoverable?: true
    recoveryProbability?: true
    riskFactors?: true
    denialCategory?: true
    rootCause?: true
    recoveredAmount?: true
    writeOffAmount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DenialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Denial to aggregate.
     */
    where?: DenialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Denials to fetch.
     */
    orderBy?: DenialOrderByWithRelationInput | DenialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DenialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Denials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Denials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Denials
    **/
    _count?: true | DenialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DenialAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DenialSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DenialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DenialMaxAggregateInputType
  }

  export type GetDenialAggregateType<T extends DenialAggregateArgs> = {
        [P in keyof T & keyof AggregateDenial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDenial[P]>
      : GetScalarType<T[P], AggregateDenial[P]>
  }




  export type DenialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DenialWhereInput
    orderBy?: DenialOrderByWithAggregationInput | DenialOrderByWithAggregationInput[]
    by: DenialScalarFieldEnum[] | DenialScalarFieldEnum
    having?: DenialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DenialCountAggregateInputType | true
    _avg?: DenialAvgAggregateInputType
    _sum?: DenialSumAggregateInputType
    _min?: DenialMinAggregateInputType
    _max?: DenialMaxAggregateInputType
  }

  export type DenialGroupByOutputType = {
    id: string
    claimId: string
    patientId: string
    providerId: string
    payerId: string
    payerName: string
    claimStatus: $Enums.ClaimStatus
    denialDate: Date
    serviceDate: Date
    billedAmount: Decimal
    allowedAmount: Decimal | null
    paidAmount: Decimal | null
    patientResponsibility: Decimal | null
    carcCode: string
    carcDescription: string
    rarcCodes: string[]
    groupCode: string
    procedureCode: string
    procedureModifiers: string[]
    diagnosisCodes: string[]
    placeOfService: string | null
    x277StatusCode: string | null
    x277StatusMessage: string | null
    predictedRecoverable: boolean
    recoveryProbability: number | null
    riskFactors: JsonValue | null
    denialCategory: $Enums.DenialCategory
    rootCause: string | null
    recoveredAmount: Decimal | null
    writeOffAmount: Decimal | null
    createdAt: Date
    updatedAt: Date
    _count: DenialCountAggregateOutputType | null
    _avg: DenialAvgAggregateOutputType | null
    _sum: DenialSumAggregateOutputType | null
    _min: DenialMinAggregateOutputType | null
    _max: DenialMaxAggregateOutputType | null
  }

  type GetDenialGroupByPayload<T extends DenialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DenialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DenialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DenialGroupByOutputType[P]>
            : GetScalarType<T[P], DenialGroupByOutputType[P]>
        }
      >
    >


  export type DenialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    claimId?: boolean
    patientId?: boolean
    providerId?: boolean
    payerId?: boolean
    payerName?: boolean
    claimStatus?: boolean
    denialDate?: boolean
    serviceDate?: boolean
    billedAmount?: boolean
    allowedAmount?: boolean
    paidAmount?: boolean
    patientResponsibility?: boolean
    carcCode?: boolean
    carcDescription?: boolean
    rarcCodes?: boolean
    groupCode?: boolean
    procedureCode?: boolean
    procedureModifiers?: boolean
    diagnosisCodes?: boolean
    placeOfService?: boolean
    x277StatusCode?: boolean
    x277StatusMessage?: boolean
    predictedRecoverable?: boolean
    recoveryProbability?: boolean
    riskFactors?: boolean
    denialCategory?: boolean
    rootCause?: boolean
    recoveredAmount?: boolean
    writeOffAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appeals?: boolean | Denial$appealsArgs<ExtArgs>
    _count?: boolean | DenialCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["denial"]>

  export type DenialSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    claimId?: boolean
    patientId?: boolean
    providerId?: boolean
    payerId?: boolean
    payerName?: boolean
    claimStatus?: boolean
    denialDate?: boolean
    serviceDate?: boolean
    billedAmount?: boolean
    allowedAmount?: boolean
    paidAmount?: boolean
    patientResponsibility?: boolean
    carcCode?: boolean
    carcDescription?: boolean
    rarcCodes?: boolean
    groupCode?: boolean
    procedureCode?: boolean
    procedureModifiers?: boolean
    diagnosisCodes?: boolean
    placeOfService?: boolean
    x277StatusCode?: boolean
    x277StatusMessage?: boolean
    predictedRecoverable?: boolean
    recoveryProbability?: boolean
    riskFactors?: boolean
    denialCategory?: boolean
    rootCause?: boolean
    recoveredAmount?: boolean
    writeOffAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["denial"]>

  export type DenialSelectScalar = {
    id?: boolean
    claimId?: boolean
    patientId?: boolean
    providerId?: boolean
    payerId?: boolean
    payerName?: boolean
    claimStatus?: boolean
    denialDate?: boolean
    serviceDate?: boolean
    billedAmount?: boolean
    allowedAmount?: boolean
    paidAmount?: boolean
    patientResponsibility?: boolean
    carcCode?: boolean
    carcDescription?: boolean
    rarcCodes?: boolean
    groupCode?: boolean
    procedureCode?: boolean
    procedureModifiers?: boolean
    diagnosisCodes?: boolean
    placeOfService?: boolean
    x277StatusCode?: boolean
    x277StatusMessage?: boolean
    predictedRecoverable?: boolean
    recoveryProbability?: boolean
    riskFactors?: boolean
    denialCategory?: boolean
    rootCause?: boolean
    recoveredAmount?: boolean
    writeOffAmount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DenialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appeals?: boolean | Denial$appealsArgs<ExtArgs>
    _count?: boolean | DenialCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DenialIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DenialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Denial"
    objects: {
      appeals: Prisma.$AppealPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      claimId: string
      patientId: string
      providerId: string
      payerId: string
      payerName: string
      claimStatus: $Enums.ClaimStatus
      denialDate: Date
      serviceDate: Date
      billedAmount: Prisma.Decimal
      allowedAmount: Prisma.Decimal | null
      paidAmount: Prisma.Decimal | null
      patientResponsibility: Prisma.Decimal | null
      carcCode: string
      carcDescription: string
      rarcCodes: string[]
      groupCode: string
      procedureCode: string
      procedureModifiers: string[]
      diagnosisCodes: string[]
      placeOfService: string | null
      x277StatusCode: string | null
      x277StatusMessage: string | null
      predictedRecoverable: boolean
      recoveryProbability: number | null
      riskFactors: Prisma.JsonValue | null
      denialCategory: $Enums.DenialCategory
      rootCause: string | null
      recoveredAmount: Prisma.Decimal | null
      writeOffAmount: Prisma.Decimal | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["denial"]>
    composites: {}
  }

  type DenialGetPayload<S extends boolean | null | undefined | DenialDefaultArgs> = $Result.GetResult<Prisma.$DenialPayload, S>

  type DenialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DenialFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DenialCountAggregateInputType | true
    }

  export interface DenialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Denial'], meta: { name: 'Denial' } }
    /**
     * Find zero or one Denial that matches the filter.
     * @param {DenialFindUniqueArgs} args - Arguments to find a Denial
     * @example
     * // Get one Denial
     * const denial = await prisma.denial.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DenialFindUniqueArgs>(args: SelectSubset<T, DenialFindUniqueArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Denial that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DenialFindUniqueOrThrowArgs} args - Arguments to find a Denial
     * @example
     * // Get one Denial
     * const denial = await prisma.denial.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DenialFindUniqueOrThrowArgs>(args: SelectSubset<T, DenialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Denial that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialFindFirstArgs} args - Arguments to find a Denial
     * @example
     * // Get one Denial
     * const denial = await prisma.denial.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DenialFindFirstArgs>(args?: SelectSubset<T, DenialFindFirstArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Denial that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialFindFirstOrThrowArgs} args - Arguments to find a Denial
     * @example
     * // Get one Denial
     * const denial = await prisma.denial.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DenialFindFirstOrThrowArgs>(args?: SelectSubset<T, DenialFindFirstOrThrowArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Denials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Denials
     * const denials = await prisma.denial.findMany()
     * 
     * // Get first 10 Denials
     * const denials = await prisma.denial.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const denialWithIdOnly = await prisma.denial.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DenialFindManyArgs>(args?: SelectSubset<T, DenialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Denial.
     * @param {DenialCreateArgs} args - Arguments to create a Denial.
     * @example
     * // Create one Denial
     * const Denial = await prisma.denial.create({
     *   data: {
     *     // ... data to create a Denial
     *   }
     * })
     * 
     */
    create<T extends DenialCreateArgs>(args: SelectSubset<T, DenialCreateArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Denials.
     * @param {DenialCreateManyArgs} args - Arguments to create many Denials.
     * @example
     * // Create many Denials
     * const denial = await prisma.denial.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DenialCreateManyArgs>(args?: SelectSubset<T, DenialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Denials and returns the data saved in the database.
     * @param {DenialCreateManyAndReturnArgs} args - Arguments to create many Denials.
     * @example
     * // Create many Denials
     * const denial = await prisma.denial.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Denials and only return the `id`
     * const denialWithIdOnly = await prisma.denial.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DenialCreateManyAndReturnArgs>(args?: SelectSubset<T, DenialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Denial.
     * @param {DenialDeleteArgs} args - Arguments to delete one Denial.
     * @example
     * // Delete one Denial
     * const Denial = await prisma.denial.delete({
     *   where: {
     *     // ... filter to delete one Denial
     *   }
     * })
     * 
     */
    delete<T extends DenialDeleteArgs>(args: SelectSubset<T, DenialDeleteArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Denial.
     * @param {DenialUpdateArgs} args - Arguments to update one Denial.
     * @example
     * // Update one Denial
     * const denial = await prisma.denial.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DenialUpdateArgs>(args: SelectSubset<T, DenialUpdateArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Denials.
     * @param {DenialDeleteManyArgs} args - Arguments to filter Denials to delete.
     * @example
     * // Delete a few Denials
     * const { count } = await prisma.denial.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DenialDeleteManyArgs>(args?: SelectSubset<T, DenialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Denials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Denials
     * const denial = await prisma.denial.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DenialUpdateManyArgs>(args: SelectSubset<T, DenialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Denial.
     * @param {DenialUpsertArgs} args - Arguments to update or create a Denial.
     * @example
     * // Update or create a Denial
     * const denial = await prisma.denial.upsert({
     *   create: {
     *     // ... data to create a Denial
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Denial we want to update
     *   }
     * })
     */
    upsert<T extends DenialUpsertArgs>(args: SelectSubset<T, DenialUpsertArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Denials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialCountArgs} args - Arguments to filter Denials to count.
     * @example
     * // Count the number of Denials
     * const count = await prisma.denial.count({
     *   where: {
     *     // ... the filter for the Denials we want to count
     *   }
     * })
    **/
    count<T extends DenialCountArgs>(
      args?: Subset<T, DenialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DenialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Denial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DenialAggregateArgs>(args: Subset<T, DenialAggregateArgs>): Prisma.PrismaPromise<GetDenialAggregateType<T>>

    /**
     * Group by Denial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialGroupByArgs} args - Group by arguments.
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
      T extends DenialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DenialGroupByArgs['orderBy'] }
        : { orderBy?: DenialGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DenialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDenialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Denial model
   */
  readonly fields: DenialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Denial.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DenialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appeals<T extends Denial$appealsArgs<ExtArgs> = {}>(args?: Subset<T, Denial$appealsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppealPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Denial model
   */ 
  interface DenialFieldRefs {
    readonly id: FieldRef<"Denial", 'String'>
    readonly claimId: FieldRef<"Denial", 'String'>
    readonly patientId: FieldRef<"Denial", 'String'>
    readonly providerId: FieldRef<"Denial", 'String'>
    readonly payerId: FieldRef<"Denial", 'String'>
    readonly payerName: FieldRef<"Denial", 'String'>
    readonly claimStatus: FieldRef<"Denial", 'ClaimStatus'>
    readonly denialDate: FieldRef<"Denial", 'DateTime'>
    readonly serviceDate: FieldRef<"Denial", 'DateTime'>
    readonly billedAmount: FieldRef<"Denial", 'Decimal'>
    readonly allowedAmount: FieldRef<"Denial", 'Decimal'>
    readonly paidAmount: FieldRef<"Denial", 'Decimal'>
    readonly patientResponsibility: FieldRef<"Denial", 'Decimal'>
    readonly carcCode: FieldRef<"Denial", 'String'>
    readonly carcDescription: FieldRef<"Denial", 'String'>
    readonly rarcCodes: FieldRef<"Denial", 'String[]'>
    readonly groupCode: FieldRef<"Denial", 'String'>
    readonly procedureCode: FieldRef<"Denial", 'String'>
    readonly procedureModifiers: FieldRef<"Denial", 'String[]'>
    readonly diagnosisCodes: FieldRef<"Denial", 'String[]'>
    readonly placeOfService: FieldRef<"Denial", 'String'>
    readonly x277StatusCode: FieldRef<"Denial", 'String'>
    readonly x277StatusMessage: FieldRef<"Denial", 'String'>
    readonly predictedRecoverable: FieldRef<"Denial", 'Boolean'>
    readonly recoveryProbability: FieldRef<"Denial", 'Float'>
    readonly riskFactors: FieldRef<"Denial", 'Json'>
    readonly denialCategory: FieldRef<"Denial", 'DenialCategory'>
    readonly rootCause: FieldRef<"Denial", 'String'>
    readonly recoveredAmount: FieldRef<"Denial", 'Decimal'>
    readonly writeOffAmount: FieldRef<"Denial", 'Decimal'>
    readonly createdAt: FieldRef<"Denial", 'DateTime'>
    readonly updatedAt: FieldRef<"Denial", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Denial findUnique
   */
  export type DenialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter, which Denial to fetch.
     */
    where: DenialWhereUniqueInput
  }

  /**
   * Denial findUniqueOrThrow
   */
  export type DenialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter, which Denial to fetch.
     */
    where: DenialWhereUniqueInput
  }

  /**
   * Denial findFirst
   */
  export type DenialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter, which Denial to fetch.
     */
    where?: DenialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Denials to fetch.
     */
    orderBy?: DenialOrderByWithRelationInput | DenialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Denials.
     */
    cursor?: DenialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Denials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Denials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Denials.
     */
    distinct?: DenialScalarFieldEnum | DenialScalarFieldEnum[]
  }

  /**
   * Denial findFirstOrThrow
   */
  export type DenialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter, which Denial to fetch.
     */
    where?: DenialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Denials to fetch.
     */
    orderBy?: DenialOrderByWithRelationInput | DenialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Denials.
     */
    cursor?: DenialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Denials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Denials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Denials.
     */
    distinct?: DenialScalarFieldEnum | DenialScalarFieldEnum[]
  }

  /**
   * Denial findMany
   */
  export type DenialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter, which Denials to fetch.
     */
    where?: DenialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Denials to fetch.
     */
    orderBy?: DenialOrderByWithRelationInput | DenialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Denials.
     */
    cursor?: DenialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Denials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Denials.
     */
    skip?: number
    distinct?: DenialScalarFieldEnum | DenialScalarFieldEnum[]
  }

  /**
   * Denial create
   */
  export type DenialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * The data needed to create a Denial.
     */
    data: XOR<DenialCreateInput, DenialUncheckedCreateInput>
  }

  /**
   * Denial createMany
   */
  export type DenialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Denials.
     */
    data: DenialCreateManyInput | DenialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Denial createManyAndReturn
   */
  export type DenialCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Denials.
     */
    data: DenialCreateManyInput | DenialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Denial update
   */
  export type DenialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * The data needed to update a Denial.
     */
    data: XOR<DenialUpdateInput, DenialUncheckedUpdateInput>
    /**
     * Choose, which Denial to update.
     */
    where: DenialWhereUniqueInput
  }

  /**
   * Denial updateMany
   */
  export type DenialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Denials.
     */
    data: XOR<DenialUpdateManyMutationInput, DenialUncheckedUpdateManyInput>
    /**
     * Filter which Denials to update
     */
    where?: DenialWhereInput
  }

  /**
   * Denial upsert
   */
  export type DenialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * The filter to search for the Denial to update in case it exists.
     */
    where: DenialWhereUniqueInput
    /**
     * In case the Denial found by the `where` argument doesn't exist, create a new Denial with this data.
     */
    create: XOR<DenialCreateInput, DenialUncheckedCreateInput>
    /**
     * In case the Denial was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DenialUpdateInput, DenialUncheckedUpdateInput>
  }

  /**
   * Denial delete
   */
  export type DenialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter which Denial to delete.
     */
    where: DenialWhereUniqueInput
  }

  /**
   * Denial deleteMany
   */
  export type DenialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Denials to delete
     */
    where?: DenialWhereInput
  }

  /**
   * Denial.appeals
   */
  export type Denial$appealsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealInclude<ExtArgs> | null
    where?: AppealWhereInput
    orderBy?: AppealOrderByWithRelationInput | AppealOrderByWithRelationInput[]
    cursor?: AppealWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppealScalarFieldEnum | AppealScalarFieldEnum[]
  }

  /**
   * Denial without action
   */
  export type DenialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
  }


  /**
   * Model Appeal
   */

  export type AggregateAppeal = {
    _count: AppealCountAggregateOutputType | null
    _avg: AppealAvgAggregateOutputType | null
    _sum: AppealSumAggregateOutputType | null
    _min: AppealMinAggregateOutputType | null
    _max: AppealMaxAggregateOutputType | null
  }

  export type AppealAvgAggregateOutputType = {
    appealLevel: number | null
    adjustedAmount: Decimal | null
    processingTimeMinutes: number | null
  }

  export type AppealSumAggregateOutputType = {
    appealLevel: number | null
    adjustedAmount: Decimal | null
    processingTimeMinutes: number | null
  }

  export type AppealMinAggregateOutputType = {
    id: string | null
    denialId: string | null
    appealLevel: number | null
    appealType: $Enums.AppealType | null
    status: $Enums.AppealStatus | null
    appealLetterContent: string | null
    appealLetterHtml: string | null
    filingDeadline: Date | null
    submittedDate: Date | null
    responseDeadline: Date | null
    responseDate: Date | null
    outcome: $Enums.AppealOutcome | null
    outcomeReason: string | null
    adjustedAmount: Decimal | null
    assignedTo: string | null
    assignedAt: Date | null
    completedBy: string | null
    completedAt: Date | null
    processingTimeMinutes: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppealMaxAggregateOutputType = {
    id: string | null
    denialId: string | null
    appealLevel: number | null
    appealType: $Enums.AppealType | null
    status: $Enums.AppealStatus | null
    appealLetterContent: string | null
    appealLetterHtml: string | null
    filingDeadline: Date | null
    submittedDate: Date | null
    responseDeadline: Date | null
    responseDate: Date | null
    outcome: $Enums.AppealOutcome | null
    outcomeReason: string | null
    adjustedAmount: Decimal | null
    assignedTo: string | null
    assignedAt: Date | null
    completedBy: string | null
    completedAt: Date | null
    processingTimeMinutes: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppealCountAggregateOutputType = {
    id: number
    denialId: number
    appealLevel: number
    appealType: number
    status: number
    payerAppealStrategy: number
    appealLetterContent: number
    appealLetterHtml: number
    supportingDocuments: number
    filingDeadline: number
    submittedDate: number
    responseDeadline: number
    responseDate: number
    outcome: number
    outcomeReason: number
    adjustedAmount: number
    assignedTo: number
    assignedAt: number
    completedBy: number
    completedAt: number
    processingTimeMinutes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AppealAvgAggregateInputType = {
    appealLevel?: true
    adjustedAmount?: true
    processingTimeMinutes?: true
  }

  export type AppealSumAggregateInputType = {
    appealLevel?: true
    adjustedAmount?: true
    processingTimeMinutes?: true
  }

  export type AppealMinAggregateInputType = {
    id?: true
    denialId?: true
    appealLevel?: true
    appealType?: true
    status?: true
    appealLetterContent?: true
    appealLetterHtml?: true
    filingDeadline?: true
    submittedDate?: true
    responseDeadline?: true
    responseDate?: true
    outcome?: true
    outcomeReason?: true
    adjustedAmount?: true
    assignedTo?: true
    assignedAt?: true
    completedBy?: true
    completedAt?: true
    processingTimeMinutes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppealMaxAggregateInputType = {
    id?: true
    denialId?: true
    appealLevel?: true
    appealType?: true
    status?: true
    appealLetterContent?: true
    appealLetterHtml?: true
    filingDeadline?: true
    submittedDate?: true
    responseDeadline?: true
    responseDate?: true
    outcome?: true
    outcomeReason?: true
    adjustedAmount?: true
    assignedTo?: true
    assignedAt?: true
    completedBy?: true
    completedAt?: true
    processingTimeMinutes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppealCountAggregateInputType = {
    id?: true
    denialId?: true
    appealLevel?: true
    appealType?: true
    status?: true
    payerAppealStrategy?: true
    appealLetterContent?: true
    appealLetterHtml?: true
    supportingDocuments?: true
    filingDeadline?: true
    submittedDate?: true
    responseDeadline?: true
    responseDate?: true
    outcome?: true
    outcomeReason?: true
    adjustedAmount?: true
    assignedTo?: true
    assignedAt?: true
    completedBy?: true
    completedAt?: true
    processingTimeMinutes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AppealAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appeal to aggregate.
     */
    where?: AppealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appeals to fetch.
     */
    orderBy?: AppealOrderByWithRelationInput | AppealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appeals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Appeals
    **/
    _count?: true | AppealCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AppealAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AppealSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppealMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppealMaxAggregateInputType
  }

  export type GetAppealAggregateType<T extends AppealAggregateArgs> = {
        [P in keyof T & keyof AggregateAppeal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppeal[P]>
      : GetScalarType<T[P], AggregateAppeal[P]>
  }




  export type AppealGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppealWhereInput
    orderBy?: AppealOrderByWithAggregationInput | AppealOrderByWithAggregationInput[]
    by: AppealScalarFieldEnum[] | AppealScalarFieldEnum
    having?: AppealScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppealCountAggregateInputType | true
    _avg?: AppealAvgAggregateInputType
    _sum?: AppealSumAggregateInputType
    _min?: AppealMinAggregateInputType
    _max?: AppealMaxAggregateInputType
  }

  export type AppealGroupByOutputType = {
    id: string
    denialId: string
    appealLevel: number
    appealType: $Enums.AppealType
    status: $Enums.AppealStatus
    payerAppealStrategy: JsonValue | null
    appealLetterContent: string | null
    appealLetterHtml: string | null
    supportingDocuments: string[]
    filingDeadline: Date
    submittedDate: Date | null
    responseDeadline: Date | null
    responseDate: Date | null
    outcome: $Enums.AppealOutcome | null
    outcomeReason: string | null
    adjustedAmount: Decimal | null
    assignedTo: string | null
    assignedAt: Date | null
    completedBy: string | null
    completedAt: Date | null
    processingTimeMinutes: number | null
    createdAt: Date
    updatedAt: Date
    _count: AppealCountAggregateOutputType | null
    _avg: AppealAvgAggregateOutputType | null
    _sum: AppealSumAggregateOutputType | null
    _min: AppealMinAggregateOutputType | null
    _max: AppealMaxAggregateOutputType | null
  }

  type GetAppealGroupByPayload<T extends AppealGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppealGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppealGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppealGroupByOutputType[P]>
            : GetScalarType<T[P], AppealGroupByOutputType[P]>
        }
      >
    >


  export type AppealSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    denialId?: boolean
    appealLevel?: boolean
    appealType?: boolean
    status?: boolean
    payerAppealStrategy?: boolean
    appealLetterContent?: boolean
    appealLetterHtml?: boolean
    supportingDocuments?: boolean
    filingDeadline?: boolean
    submittedDate?: boolean
    responseDeadline?: boolean
    responseDate?: boolean
    outcome?: boolean
    outcomeReason?: boolean
    adjustedAmount?: boolean
    assignedTo?: boolean
    assignedAt?: boolean
    completedBy?: boolean
    completedAt?: boolean
    processingTimeMinutes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    denial?: boolean | DenialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appeal"]>

  export type AppealSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    denialId?: boolean
    appealLevel?: boolean
    appealType?: boolean
    status?: boolean
    payerAppealStrategy?: boolean
    appealLetterContent?: boolean
    appealLetterHtml?: boolean
    supportingDocuments?: boolean
    filingDeadline?: boolean
    submittedDate?: boolean
    responseDeadline?: boolean
    responseDate?: boolean
    outcome?: boolean
    outcomeReason?: boolean
    adjustedAmount?: boolean
    assignedTo?: boolean
    assignedAt?: boolean
    completedBy?: boolean
    completedAt?: boolean
    processingTimeMinutes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    denial?: boolean | DenialDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appeal"]>

  export type AppealSelectScalar = {
    id?: boolean
    denialId?: boolean
    appealLevel?: boolean
    appealType?: boolean
    status?: boolean
    payerAppealStrategy?: boolean
    appealLetterContent?: boolean
    appealLetterHtml?: boolean
    supportingDocuments?: boolean
    filingDeadline?: boolean
    submittedDate?: boolean
    responseDeadline?: boolean
    responseDate?: boolean
    outcome?: boolean
    outcomeReason?: boolean
    adjustedAmount?: boolean
    assignedTo?: boolean
    assignedAt?: boolean
    completedBy?: boolean
    completedAt?: boolean
    processingTimeMinutes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AppealInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    denial?: boolean | DenialDefaultArgs<ExtArgs>
  }
  export type AppealIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    denial?: boolean | DenialDefaultArgs<ExtArgs>
  }

  export type $AppealPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Appeal"
    objects: {
      denial: Prisma.$DenialPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      denialId: string
      appealLevel: number
      appealType: $Enums.AppealType
      status: $Enums.AppealStatus
      payerAppealStrategy: Prisma.JsonValue | null
      appealLetterContent: string | null
      appealLetterHtml: string | null
      supportingDocuments: string[]
      filingDeadline: Date
      submittedDate: Date | null
      responseDeadline: Date | null
      responseDate: Date | null
      outcome: $Enums.AppealOutcome | null
      outcomeReason: string | null
      adjustedAmount: Prisma.Decimal | null
      assignedTo: string | null
      assignedAt: Date | null
      completedBy: string | null
      completedAt: Date | null
      processingTimeMinutes: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["appeal"]>
    composites: {}
  }

  type AppealGetPayload<S extends boolean | null | undefined | AppealDefaultArgs> = $Result.GetResult<Prisma.$AppealPayload, S>

  type AppealCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AppealFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AppealCountAggregateInputType | true
    }

  export interface AppealDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Appeal'], meta: { name: 'Appeal' } }
    /**
     * Find zero or one Appeal that matches the filter.
     * @param {AppealFindUniqueArgs} args - Arguments to find a Appeal
     * @example
     * // Get one Appeal
     * const appeal = await prisma.appeal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppealFindUniqueArgs>(args: SelectSubset<T, AppealFindUniqueArgs<ExtArgs>>): Prisma__AppealClient<$Result.GetResult<Prisma.$AppealPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Appeal that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AppealFindUniqueOrThrowArgs} args - Arguments to find a Appeal
     * @example
     * // Get one Appeal
     * const appeal = await prisma.appeal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppealFindUniqueOrThrowArgs>(args: SelectSubset<T, AppealFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppealClient<$Result.GetResult<Prisma.$AppealPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Appeal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppealFindFirstArgs} args - Arguments to find a Appeal
     * @example
     * // Get one Appeal
     * const appeal = await prisma.appeal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppealFindFirstArgs>(args?: SelectSubset<T, AppealFindFirstArgs<ExtArgs>>): Prisma__AppealClient<$Result.GetResult<Prisma.$AppealPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Appeal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppealFindFirstOrThrowArgs} args - Arguments to find a Appeal
     * @example
     * // Get one Appeal
     * const appeal = await prisma.appeal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppealFindFirstOrThrowArgs>(args?: SelectSubset<T, AppealFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppealClient<$Result.GetResult<Prisma.$AppealPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Appeals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppealFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appeals
     * const appeals = await prisma.appeal.findMany()
     * 
     * // Get first 10 Appeals
     * const appeals = await prisma.appeal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appealWithIdOnly = await prisma.appeal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppealFindManyArgs>(args?: SelectSubset<T, AppealFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppealPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Appeal.
     * @param {AppealCreateArgs} args - Arguments to create a Appeal.
     * @example
     * // Create one Appeal
     * const Appeal = await prisma.appeal.create({
     *   data: {
     *     // ... data to create a Appeal
     *   }
     * })
     * 
     */
    create<T extends AppealCreateArgs>(args: SelectSubset<T, AppealCreateArgs<ExtArgs>>): Prisma__AppealClient<$Result.GetResult<Prisma.$AppealPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Appeals.
     * @param {AppealCreateManyArgs} args - Arguments to create many Appeals.
     * @example
     * // Create many Appeals
     * const appeal = await prisma.appeal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppealCreateManyArgs>(args?: SelectSubset<T, AppealCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Appeals and returns the data saved in the database.
     * @param {AppealCreateManyAndReturnArgs} args - Arguments to create many Appeals.
     * @example
     * // Create many Appeals
     * const appeal = await prisma.appeal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Appeals and only return the `id`
     * const appealWithIdOnly = await prisma.appeal.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppealCreateManyAndReturnArgs>(args?: SelectSubset<T, AppealCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppealPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Appeal.
     * @param {AppealDeleteArgs} args - Arguments to delete one Appeal.
     * @example
     * // Delete one Appeal
     * const Appeal = await prisma.appeal.delete({
     *   where: {
     *     // ... filter to delete one Appeal
     *   }
     * })
     * 
     */
    delete<T extends AppealDeleteArgs>(args: SelectSubset<T, AppealDeleteArgs<ExtArgs>>): Prisma__AppealClient<$Result.GetResult<Prisma.$AppealPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Appeal.
     * @param {AppealUpdateArgs} args - Arguments to update one Appeal.
     * @example
     * // Update one Appeal
     * const appeal = await prisma.appeal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppealUpdateArgs>(args: SelectSubset<T, AppealUpdateArgs<ExtArgs>>): Prisma__AppealClient<$Result.GetResult<Prisma.$AppealPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Appeals.
     * @param {AppealDeleteManyArgs} args - Arguments to filter Appeals to delete.
     * @example
     * // Delete a few Appeals
     * const { count } = await prisma.appeal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppealDeleteManyArgs>(args?: SelectSubset<T, AppealDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appeals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppealUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appeals
     * const appeal = await prisma.appeal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppealUpdateManyArgs>(args: SelectSubset<T, AppealUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Appeal.
     * @param {AppealUpsertArgs} args - Arguments to update or create a Appeal.
     * @example
     * // Update or create a Appeal
     * const appeal = await prisma.appeal.upsert({
     *   create: {
     *     // ... data to create a Appeal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appeal we want to update
     *   }
     * })
     */
    upsert<T extends AppealUpsertArgs>(args: SelectSubset<T, AppealUpsertArgs<ExtArgs>>): Prisma__AppealClient<$Result.GetResult<Prisma.$AppealPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Appeals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppealCountArgs} args - Arguments to filter Appeals to count.
     * @example
     * // Count the number of Appeals
     * const count = await prisma.appeal.count({
     *   where: {
     *     // ... the filter for the Appeals we want to count
     *   }
     * })
    **/
    count<T extends AppealCountArgs>(
      args?: Subset<T, AppealCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppealCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Appeal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppealAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AppealAggregateArgs>(args: Subset<T, AppealAggregateArgs>): Prisma.PrismaPromise<GetAppealAggregateType<T>>

    /**
     * Group by Appeal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppealGroupByArgs} args - Group by arguments.
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
      T extends AppealGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppealGroupByArgs['orderBy'] }
        : { orderBy?: AppealGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AppealGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppealGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Appeal model
   */
  readonly fields: AppealFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Appeal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppealClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    denial<T extends DenialDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DenialDefaultArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Appeal model
   */ 
  interface AppealFieldRefs {
    readonly id: FieldRef<"Appeal", 'String'>
    readonly denialId: FieldRef<"Appeal", 'String'>
    readonly appealLevel: FieldRef<"Appeal", 'Int'>
    readonly appealType: FieldRef<"Appeal", 'AppealType'>
    readonly status: FieldRef<"Appeal", 'AppealStatus'>
    readonly payerAppealStrategy: FieldRef<"Appeal", 'Json'>
    readonly appealLetterContent: FieldRef<"Appeal", 'String'>
    readonly appealLetterHtml: FieldRef<"Appeal", 'String'>
    readonly supportingDocuments: FieldRef<"Appeal", 'String[]'>
    readonly filingDeadline: FieldRef<"Appeal", 'DateTime'>
    readonly submittedDate: FieldRef<"Appeal", 'DateTime'>
    readonly responseDeadline: FieldRef<"Appeal", 'DateTime'>
    readonly responseDate: FieldRef<"Appeal", 'DateTime'>
    readonly outcome: FieldRef<"Appeal", 'AppealOutcome'>
    readonly outcomeReason: FieldRef<"Appeal", 'String'>
    readonly adjustedAmount: FieldRef<"Appeal", 'Decimal'>
    readonly assignedTo: FieldRef<"Appeal", 'String'>
    readonly assignedAt: FieldRef<"Appeal", 'DateTime'>
    readonly completedBy: FieldRef<"Appeal", 'String'>
    readonly completedAt: FieldRef<"Appeal", 'DateTime'>
    readonly processingTimeMinutes: FieldRef<"Appeal", 'Int'>
    readonly createdAt: FieldRef<"Appeal", 'DateTime'>
    readonly updatedAt: FieldRef<"Appeal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Appeal findUnique
   */
  export type AppealFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealInclude<ExtArgs> | null
    /**
     * Filter, which Appeal to fetch.
     */
    where: AppealWhereUniqueInput
  }

  /**
   * Appeal findUniqueOrThrow
   */
  export type AppealFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealInclude<ExtArgs> | null
    /**
     * Filter, which Appeal to fetch.
     */
    where: AppealWhereUniqueInput
  }

  /**
   * Appeal findFirst
   */
  export type AppealFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealInclude<ExtArgs> | null
    /**
     * Filter, which Appeal to fetch.
     */
    where?: AppealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appeals to fetch.
     */
    orderBy?: AppealOrderByWithRelationInput | AppealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appeals.
     */
    cursor?: AppealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appeals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appeals.
     */
    distinct?: AppealScalarFieldEnum | AppealScalarFieldEnum[]
  }

  /**
   * Appeal findFirstOrThrow
   */
  export type AppealFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealInclude<ExtArgs> | null
    /**
     * Filter, which Appeal to fetch.
     */
    where?: AppealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appeals to fetch.
     */
    orderBy?: AppealOrderByWithRelationInput | AppealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appeals.
     */
    cursor?: AppealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appeals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appeals.
     */
    distinct?: AppealScalarFieldEnum | AppealScalarFieldEnum[]
  }

  /**
   * Appeal findMany
   */
  export type AppealFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealInclude<ExtArgs> | null
    /**
     * Filter, which Appeals to fetch.
     */
    where?: AppealWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appeals to fetch.
     */
    orderBy?: AppealOrderByWithRelationInput | AppealOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Appeals.
     */
    cursor?: AppealWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appeals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appeals.
     */
    skip?: number
    distinct?: AppealScalarFieldEnum | AppealScalarFieldEnum[]
  }

  /**
   * Appeal create
   */
  export type AppealCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealInclude<ExtArgs> | null
    /**
     * The data needed to create a Appeal.
     */
    data: XOR<AppealCreateInput, AppealUncheckedCreateInput>
  }

  /**
   * Appeal createMany
   */
  export type AppealCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Appeals.
     */
    data: AppealCreateManyInput | AppealCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Appeal createManyAndReturn
   */
  export type AppealCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Appeals.
     */
    data: AppealCreateManyInput | AppealCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appeal update
   */
  export type AppealUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealInclude<ExtArgs> | null
    /**
     * The data needed to update a Appeal.
     */
    data: XOR<AppealUpdateInput, AppealUncheckedUpdateInput>
    /**
     * Choose, which Appeal to update.
     */
    where: AppealWhereUniqueInput
  }

  /**
   * Appeal updateMany
   */
  export type AppealUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Appeals.
     */
    data: XOR<AppealUpdateManyMutationInput, AppealUncheckedUpdateManyInput>
    /**
     * Filter which Appeals to update
     */
    where?: AppealWhereInput
  }

  /**
   * Appeal upsert
   */
  export type AppealUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealInclude<ExtArgs> | null
    /**
     * The filter to search for the Appeal to update in case it exists.
     */
    where: AppealWhereUniqueInput
    /**
     * In case the Appeal found by the `where` argument doesn't exist, create a new Appeal with this data.
     */
    create: XOR<AppealCreateInput, AppealUncheckedCreateInput>
    /**
     * In case the Appeal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppealUpdateInput, AppealUncheckedUpdateInput>
  }

  /**
   * Appeal delete
   */
  export type AppealDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealInclude<ExtArgs> | null
    /**
     * Filter which Appeal to delete.
     */
    where: AppealWhereUniqueInput
  }

  /**
   * Appeal deleteMany
   */
  export type AppealDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appeals to delete
     */
    where?: AppealWhereInput
  }

  /**
   * Appeal without action
   */
  export type AppealDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appeal
     */
    select?: AppealSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppealInclude<ExtArgs> | null
  }


  /**
   * Model DenialPattern
   */

  export type AggregateDenialPattern = {
    _count: DenialPatternCountAggregateOutputType | null
    _avg: DenialPatternAvgAggregateOutputType | null
    _sum: DenialPatternSumAggregateOutputType | null
    _min: DenialPatternMinAggregateOutputType | null
    _max: DenialPatternMaxAggregateOutputType | null
  }

  export type DenialPatternAvgAggregateOutputType = {
    totalDenials: number | null
    totalBilledAmount: Decimal | null
    totalRecoveredAmount: Decimal | null
    denialRate: number | null
    recoveryRate: number | null
    averageRecoveryTime: number | null
    riskScore: number | null
  }

  export type DenialPatternSumAggregateOutputType = {
    totalDenials: number | null
    totalBilledAmount: Decimal | null
    totalRecoveredAmount: Decimal | null
    denialRate: number | null
    recoveryRate: number | null
    averageRecoveryTime: number | null
    riskScore: number | null
  }

  export type DenialPatternMinAggregateOutputType = {
    id: string | null
    payerId: string | null
    payerName: string | null
    procedureCode: string | null
    diagnosisCode: string | null
    carcCode: string | null
    denialCategory: $Enums.DenialCategory | null
    totalDenials: number | null
    totalBilledAmount: Decimal | null
    totalRecoveredAmount: Decimal | null
    denialRate: number | null
    recoveryRate: number | null
    averageRecoveryTime: number | null
    periodStart: Date | null
    periodEnd: Date | null
    riskScore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DenialPatternMaxAggregateOutputType = {
    id: string | null
    payerId: string | null
    payerName: string | null
    procedureCode: string | null
    diagnosisCode: string | null
    carcCode: string | null
    denialCategory: $Enums.DenialCategory | null
    totalDenials: number | null
    totalBilledAmount: Decimal | null
    totalRecoveredAmount: Decimal | null
    denialRate: number | null
    recoveryRate: number | null
    averageRecoveryTime: number | null
    periodStart: Date | null
    periodEnd: Date | null
    riskScore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DenialPatternCountAggregateOutputType = {
    id: number
    payerId: number
    payerName: number
    procedureCode: number
    diagnosisCode: number
    carcCode: number
    denialCategory: number
    totalDenials: number
    totalBilledAmount: number
    totalRecoveredAmount: number
    denialRate: number
    recoveryRate: number
    averageRecoveryTime: number
    periodStart: number
    periodEnd: number
    monthlyTrend: number
    suggestedActions: number
    riskScore: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DenialPatternAvgAggregateInputType = {
    totalDenials?: true
    totalBilledAmount?: true
    totalRecoveredAmount?: true
    denialRate?: true
    recoveryRate?: true
    averageRecoveryTime?: true
    riskScore?: true
  }

  export type DenialPatternSumAggregateInputType = {
    totalDenials?: true
    totalBilledAmount?: true
    totalRecoveredAmount?: true
    denialRate?: true
    recoveryRate?: true
    averageRecoveryTime?: true
    riskScore?: true
  }

  export type DenialPatternMinAggregateInputType = {
    id?: true
    payerId?: true
    payerName?: true
    procedureCode?: true
    diagnosisCode?: true
    carcCode?: true
    denialCategory?: true
    totalDenials?: true
    totalBilledAmount?: true
    totalRecoveredAmount?: true
    denialRate?: true
    recoveryRate?: true
    averageRecoveryTime?: true
    periodStart?: true
    periodEnd?: true
    riskScore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DenialPatternMaxAggregateInputType = {
    id?: true
    payerId?: true
    payerName?: true
    procedureCode?: true
    diagnosisCode?: true
    carcCode?: true
    denialCategory?: true
    totalDenials?: true
    totalBilledAmount?: true
    totalRecoveredAmount?: true
    denialRate?: true
    recoveryRate?: true
    averageRecoveryTime?: true
    periodStart?: true
    periodEnd?: true
    riskScore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DenialPatternCountAggregateInputType = {
    id?: true
    payerId?: true
    payerName?: true
    procedureCode?: true
    diagnosisCode?: true
    carcCode?: true
    denialCategory?: true
    totalDenials?: true
    totalBilledAmount?: true
    totalRecoveredAmount?: true
    denialRate?: true
    recoveryRate?: true
    averageRecoveryTime?: true
    periodStart?: true
    periodEnd?: true
    monthlyTrend?: true
    suggestedActions?: true
    riskScore?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DenialPatternAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DenialPattern to aggregate.
     */
    where?: DenialPatternWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DenialPatterns to fetch.
     */
    orderBy?: DenialPatternOrderByWithRelationInput | DenialPatternOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DenialPatternWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DenialPatterns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DenialPatterns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DenialPatterns
    **/
    _count?: true | DenialPatternCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DenialPatternAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DenialPatternSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DenialPatternMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DenialPatternMaxAggregateInputType
  }

  export type GetDenialPatternAggregateType<T extends DenialPatternAggregateArgs> = {
        [P in keyof T & keyof AggregateDenialPattern]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDenialPattern[P]>
      : GetScalarType<T[P], AggregateDenialPattern[P]>
  }




  export type DenialPatternGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DenialPatternWhereInput
    orderBy?: DenialPatternOrderByWithAggregationInput | DenialPatternOrderByWithAggregationInput[]
    by: DenialPatternScalarFieldEnum[] | DenialPatternScalarFieldEnum
    having?: DenialPatternScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DenialPatternCountAggregateInputType | true
    _avg?: DenialPatternAvgAggregateInputType
    _sum?: DenialPatternSumAggregateInputType
    _min?: DenialPatternMinAggregateInputType
    _max?: DenialPatternMaxAggregateInputType
  }

  export type DenialPatternGroupByOutputType = {
    id: string
    payerId: string
    payerName: string
    procedureCode: string | null
    diagnosisCode: string | null
    carcCode: string | null
    denialCategory: $Enums.DenialCategory | null
    totalDenials: number
    totalBilledAmount: Decimal
    totalRecoveredAmount: Decimal
    denialRate: number
    recoveryRate: number
    averageRecoveryTime: number | null
    periodStart: Date
    periodEnd: Date
    monthlyTrend: JsonValue | null
    suggestedActions: string[]
    riskScore: number | null
    createdAt: Date
    updatedAt: Date
    _count: DenialPatternCountAggregateOutputType | null
    _avg: DenialPatternAvgAggregateOutputType | null
    _sum: DenialPatternSumAggregateOutputType | null
    _min: DenialPatternMinAggregateOutputType | null
    _max: DenialPatternMaxAggregateOutputType | null
  }

  type GetDenialPatternGroupByPayload<T extends DenialPatternGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DenialPatternGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DenialPatternGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DenialPatternGroupByOutputType[P]>
            : GetScalarType<T[P], DenialPatternGroupByOutputType[P]>
        }
      >
    >


  export type DenialPatternSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    payerId?: boolean
    payerName?: boolean
    procedureCode?: boolean
    diagnosisCode?: boolean
    carcCode?: boolean
    denialCategory?: boolean
    totalDenials?: boolean
    totalBilledAmount?: boolean
    totalRecoveredAmount?: boolean
    denialRate?: boolean
    recoveryRate?: boolean
    averageRecoveryTime?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    monthlyTrend?: boolean
    suggestedActions?: boolean
    riskScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["denialPattern"]>

  export type DenialPatternSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    payerId?: boolean
    payerName?: boolean
    procedureCode?: boolean
    diagnosisCode?: boolean
    carcCode?: boolean
    denialCategory?: boolean
    totalDenials?: boolean
    totalBilledAmount?: boolean
    totalRecoveredAmount?: boolean
    denialRate?: boolean
    recoveryRate?: boolean
    averageRecoveryTime?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    monthlyTrend?: boolean
    suggestedActions?: boolean
    riskScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["denialPattern"]>

  export type DenialPatternSelectScalar = {
    id?: boolean
    payerId?: boolean
    payerName?: boolean
    procedureCode?: boolean
    diagnosisCode?: boolean
    carcCode?: boolean
    denialCategory?: boolean
    totalDenials?: boolean
    totalBilledAmount?: boolean
    totalRecoveredAmount?: boolean
    denialRate?: boolean
    recoveryRate?: boolean
    averageRecoveryTime?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    monthlyTrend?: boolean
    suggestedActions?: boolean
    riskScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $DenialPatternPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DenialPattern"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      payerId: string
      payerName: string
      procedureCode: string | null
      diagnosisCode: string | null
      carcCode: string | null
      denialCategory: $Enums.DenialCategory | null
      totalDenials: number
      totalBilledAmount: Prisma.Decimal
      totalRecoveredAmount: Prisma.Decimal
      denialRate: number
      recoveryRate: number
      averageRecoveryTime: number | null
      periodStart: Date
      periodEnd: Date
      monthlyTrend: Prisma.JsonValue | null
      suggestedActions: string[]
      riskScore: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["denialPattern"]>
    composites: {}
  }

  type DenialPatternGetPayload<S extends boolean | null | undefined | DenialPatternDefaultArgs> = $Result.GetResult<Prisma.$DenialPatternPayload, S>

  type DenialPatternCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DenialPatternFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DenialPatternCountAggregateInputType | true
    }

  export interface DenialPatternDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DenialPattern'], meta: { name: 'DenialPattern' } }
    /**
     * Find zero or one DenialPattern that matches the filter.
     * @param {DenialPatternFindUniqueArgs} args - Arguments to find a DenialPattern
     * @example
     * // Get one DenialPattern
     * const denialPattern = await prisma.denialPattern.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DenialPatternFindUniqueArgs>(args: SelectSubset<T, DenialPatternFindUniqueArgs<ExtArgs>>): Prisma__DenialPatternClient<$Result.GetResult<Prisma.$DenialPatternPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DenialPattern that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DenialPatternFindUniqueOrThrowArgs} args - Arguments to find a DenialPattern
     * @example
     * // Get one DenialPattern
     * const denialPattern = await prisma.denialPattern.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DenialPatternFindUniqueOrThrowArgs>(args: SelectSubset<T, DenialPatternFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DenialPatternClient<$Result.GetResult<Prisma.$DenialPatternPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DenialPattern that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialPatternFindFirstArgs} args - Arguments to find a DenialPattern
     * @example
     * // Get one DenialPattern
     * const denialPattern = await prisma.denialPattern.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DenialPatternFindFirstArgs>(args?: SelectSubset<T, DenialPatternFindFirstArgs<ExtArgs>>): Prisma__DenialPatternClient<$Result.GetResult<Prisma.$DenialPatternPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DenialPattern that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialPatternFindFirstOrThrowArgs} args - Arguments to find a DenialPattern
     * @example
     * // Get one DenialPattern
     * const denialPattern = await prisma.denialPattern.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DenialPatternFindFirstOrThrowArgs>(args?: SelectSubset<T, DenialPatternFindFirstOrThrowArgs<ExtArgs>>): Prisma__DenialPatternClient<$Result.GetResult<Prisma.$DenialPatternPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DenialPatterns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialPatternFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DenialPatterns
     * const denialPatterns = await prisma.denialPattern.findMany()
     * 
     * // Get first 10 DenialPatterns
     * const denialPatterns = await prisma.denialPattern.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const denialPatternWithIdOnly = await prisma.denialPattern.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DenialPatternFindManyArgs>(args?: SelectSubset<T, DenialPatternFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DenialPatternPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DenialPattern.
     * @param {DenialPatternCreateArgs} args - Arguments to create a DenialPattern.
     * @example
     * // Create one DenialPattern
     * const DenialPattern = await prisma.denialPattern.create({
     *   data: {
     *     // ... data to create a DenialPattern
     *   }
     * })
     * 
     */
    create<T extends DenialPatternCreateArgs>(args: SelectSubset<T, DenialPatternCreateArgs<ExtArgs>>): Prisma__DenialPatternClient<$Result.GetResult<Prisma.$DenialPatternPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DenialPatterns.
     * @param {DenialPatternCreateManyArgs} args - Arguments to create many DenialPatterns.
     * @example
     * // Create many DenialPatterns
     * const denialPattern = await prisma.denialPattern.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DenialPatternCreateManyArgs>(args?: SelectSubset<T, DenialPatternCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DenialPatterns and returns the data saved in the database.
     * @param {DenialPatternCreateManyAndReturnArgs} args - Arguments to create many DenialPatterns.
     * @example
     * // Create many DenialPatterns
     * const denialPattern = await prisma.denialPattern.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DenialPatterns and only return the `id`
     * const denialPatternWithIdOnly = await prisma.denialPattern.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DenialPatternCreateManyAndReturnArgs>(args?: SelectSubset<T, DenialPatternCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DenialPatternPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DenialPattern.
     * @param {DenialPatternDeleteArgs} args - Arguments to delete one DenialPattern.
     * @example
     * // Delete one DenialPattern
     * const DenialPattern = await prisma.denialPattern.delete({
     *   where: {
     *     // ... filter to delete one DenialPattern
     *   }
     * })
     * 
     */
    delete<T extends DenialPatternDeleteArgs>(args: SelectSubset<T, DenialPatternDeleteArgs<ExtArgs>>): Prisma__DenialPatternClient<$Result.GetResult<Prisma.$DenialPatternPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DenialPattern.
     * @param {DenialPatternUpdateArgs} args - Arguments to update one DenialPattern.
     * @example
     * // Update one DenialPattern
     * const denialPattern = await prisma.denialPattern.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DenialPatternUpdateArgs>(args: SelectSubset<T, DenialPatternUpdateArgs<ExtArgs>>): Prisma__DenialPatternClient<$Result.GetResult<Prisma.$DenialPatternPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DenialPatterns.
     * @param {DenialPatternDeleteManyArgs} args - Arguments to filter DenialPatterns to delete.
     * @example
     * // Delete a few DenialPatterns
     * const { count } = await prisma.denialPattern.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DenialPatternDeleteManyArgs>(args?: SelectSubset<T, DenialPatternDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DenialPatterns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialPatternUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DenialPatterns
     * const denialPattern = await prisma.denialPattern.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DenialPatternUpdateManyArgs>(args: SelectSubset<T, DenialPatternUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DenialPattern.
     * @param {DenialPatternUpsertArgs} args - Arguments to update or create a DenialPattern.
     * @example
     * // Update or create a DenialPattern
     * const denialPattern = await prisma.denialPattern.upsert({
     *   create: {
     *     // ... data to create a DenialPattern
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DenialPattern we want to update
     *   }
     * })
     */
    upsert<T extends DenialPatternUpsertArgs>(args: SelectSubset<T, DenialPatternUpsertArgs<ExtArgs>>): Prisma__DenialPatternClient<$Result.GetResult<Prisma.$DenialPatternPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DenialPatterns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialPatternCountArgs} args - Arguments to filter DenialPatterns to count.
     * @example
     * // Count the number of DenialPatterns
     * const count = await prisma.denialPattern.count({
     *   where: {
     *     // ... the filter for the DenialPatterns we want to count
     *   }
     * })
    **/
    count<T extends DenialPatternCountArgs>(
      args?: Subset<T, DenialPatternCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DenialPatternCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DenialPattern.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialPatternAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DenialPatternAggregateArgs>(args: Subset<T, DenialPatternAggregateArgs>): Prisma.PrismaPromise<GetDenialPatternAggregateType<T>>

    /**
     * Group by DenialPattern.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialPatternGroupByArgs} args - Group by arguments.
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
      T extends DenialPatternGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DenialPatternGroupByArgs['orderBy'] }
        : { orderBy?: DenialPatternGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DenialPatternGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDenialPatternGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DenialPattern model
   */
  readonly fields: DenialPatternFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DenialPattern.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DenialPatternClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the DenialPattern model
   */ 
  interface DenialPatternFieldRefs {
    readonly id: FieldRef<"DenialPattern", 'String'>
    readonly payerId: FieldRef<"DenialPattern", 'String'>
    readonly payerName: FieldRef<"DenialPattern", 'String'>
    readonly procedureCode: FieldRef<"DenialPattern", 'String'>
    readonly diagnosisCode: FieldRef<"DenialPattern", 'String'>
    readonly carcCode: FieldRef<"DenialPattern", 'String'>
    readonly denialCategory: FieldRef<"DenialPattern", 'DenialCategory'>
    readonly totalDenials: FieldRef<"DenialPattern", 'Int'>
    readonly totalBilledAmount: FieldRef<"DenialPattern", 'Decimal'>
    readonly totalRecoveredAmount: FieldRef<"DenialPattern", 'Decimal'>
    readonly denialRate: FieldRef<"DenialPattern", 'Float'>
    readonly recoveryRate: FieldRef<"DenialPattern", 'Float'>
    readonly averageRecoveryTime: FieldRef<"DenialPattern", 'Int'>
    readonly periodStart: FieldRef<"DenialPattern", 'DateTime'>
    readonly periodEnd: FieldRef<"DenialPattern", 'DateTime'>
    readonly monthlyTrend: FieldRef<"DenialPattern", 'Json'>
    readonly suggestedActions: FieldRef<"DenialPattern", 'String[]'>
    readonly riskScore: FieldRef<"DenialPattern", 'Float'>
    readonly createdAt: FieldRef<"DenialPattern", 'DateTime'>
    readonly updatedAt: FieldRef<"DenialPattern", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DenialPattern findUnique
   */
  export type DenialPatternFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialPattern
     */
    select?: DenialPatternSelect<ExtArgs> | null
    /**
     * Filter, which DenialPattern to fetch.
     */
    where: DenialPatternWhereUniqueInput
  }

  /**
   * DenialPattern findUniqueOrThrow
   */
  export type DenialPatternFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialPattern
     */
    select?: DenialPatternSelect<ExtArgs> | null
    /**
     * Filter, which DenialPattern to fetch.
     */
    where: DenialPatternWhereUniqueInput
  }

  /**
   * DenialPattern findFirst
   */
  export type DenialPatternFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialPattern
     */
    select?: DenialPatternSelect<ExtArgs> | null
    /**
     * Filter, which DenialPattern to fetch.
     */
    where?: DenialPatternWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DenialPatterns to fetch.
     */
    orderBy?: DenialPatternOrderByWithRelationInput | DenialPatternOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DenialPatterns.
     */
    cursor?: DenialPatternWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DenialPatterns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DenialPatterns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DenialPatterns.
     */
    distinct?: DenialPatternScalarFieldEnum | DenialPatternScalarFieldEnum[]
  }

  /**
   * DenialPattern findFirstOrThrow
   */
  export type DenialPatternFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialPattern
     */
    select?: DenialPatternSelect<ExtArgs> | null
    /**
     * Filter, which DenialPattern to fetch.
     */
    where?: DenialPatternWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DenialPatterns to fetch.
     */
    orderBy?: DenialPatternOrderByWithRelationInput | DenialPatternOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DenialPatterns.
     */
    cursor?: DenialPatternWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DenialPatterns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DenialPatterns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DenialPatterns.
     */
    distinct?: DenialPatternScalarFieldEnum | DenialPatternScalarFieldEnum[]
  }

  /**
   * DenialPattern findMany
   */
  export type DenialPatternFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialPattern
     */
    select?: DenialPatternSelect<ExtArgs> | null
    /**
     * Filter, which DenialPatterns to fetch.
     */
    where?: DenialPatternWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DenialPatterns to fetch.
     */
    orderBy?: DenialPatternOrderByWithRelationInput | DenialPatternOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DenialPatterns.
     */
    cursor?: DenialPatternWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DenialPatterns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DenialPatterns.
     */
    skip?: number
    distinct?: DenialPatternScalarFieldEnum | DenialPatternScalarFieldEnum[]
  }

  /**
   * DenialPattern create
   */
  export type DenialPatternCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialPattern
     */
    select?: DenialPatternSelect<ExtArgs> | null
    /**
     * The data needed to create a DenialPattern.
     */
    data: XOR<DenialPatternCreateInput, DenialPatternUncheckedCreateInput>
  }

  /**
   * DenialPattern createMany
   */
  export type DenialPatternCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DenialPatterns.
     */
    data: DenialPatternCreateManyInput | DenialPatternCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DenialPattern createManyAndReturn
   */
  export type DenialPatternCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialPattern
     */
    select?: DenialPatternSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DenialPatterns.
     */
    data: DenialPatternCreateManyInput | DenialPatternCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DenialPattern update
   */
  export type DenialPatternUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialPattern
     */
    select?: DenialPatternSelect<ExtArgs> | null
    /**
     * The data needed to update a DenialPattern.
     */
    data: XOR<DenialPatternUpdateInput, DenialPatternUncheckedUpdateInput>
    /**
     * Choose, which DenialPattern to update.
     */
    where: DenialPatternWhereUniqueInput
  }

  /**
   * DenialPattern updateMany
   */
  export type DenialPatternUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DenialPatterns.
     */
    data: XOR<DenialPatternUpdateManyMutationInput, DenialPatternUncheckedUpdateManyInput>
    /**
     * Filter which DenialPatterns to update
     */
    where?: DenialPatternWhereInput
  }

  /**
   * DenialPattern upsert
   */
  export type DenialPatternUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialPattern
     */
    select?: DenialPatternSelect<ExtArgs> | null
    /**
     * The filter to search for the DenialPattern to update in case it exists.
     */
    where: DenialPatternWhereUniqueInput
    /**
     * In case the DenialPattern found by the `where` argument doesn't exist, create a new DenialPattern with this data.
     */
    create: XOR<DenialPatternCreateInput, DenialPatternUncheckedCreateInput>
    /**
     * In case the DenialPattern was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DenialPatternUpdateInput, DenialPatternUncheckedUpdateInput>
  }

  /**
   * DenialPattern delete
   */
  export type DenialPatternDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialPattern
     */
    select?: DenialPatternSelect<ExtArgs> | null
    /**
     * Filter which DenialPattern to delete.
     */
    where: DenialPatternWhereUniqueInput
  }

  /**
   * DenialPattern deleteMany
   */
  export type DenialPatternDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DenialPatterns to delete
     */
    where?: DenialPatternWhereInput
  }

  /**
   * DenialPattern without action
   */
  export type DenialPatternDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DenialPattern
     */
    select?: DenialPatternSelect<ExtArgs> | null
  }


  /**
   * Model PayerConfig
   */

  export type AggregatePayerConfig = {
    _count: PayerConfigCountAggregateOutputType | null
    _avg: PayerConfigAvgAggregateOutputType | null
    _sum: PayerConfigSumAggregateOutputType | null
    _min: PayerConfigMinAggregateOutputType | null
    _max: PayerConfigMaxAggregateOutputType | null
  }

  export type PayerConfigAvgAggregateOutputType = {
    firstLevelDeadlineDays: number | null
    secondLevelDeadlineDays: number | null
    externalReviewDeadlineDays: number | null
    firstLevelSuccessRate: number | null
    secondLevelSuccessRate: number | null
    externalReviewSuccessRate: number | null
  }

  export type PayerConfigSumAggregateOutputType = {
    firstLevelDeadlineDays: number | null
    secondLevelDeadlineDays: number | null
    externalReviewDeadlineDays: number | null
    firstLevelSuccessRate: number | null
    secondLevelSuccessRate: number | null
    externalReviewSuccessRate: number | null
  }

  export type PayerConfigMinAggregateOutputType = {
    id: string | null
    payerId: string | null
    payerName: string | null
    firstLevelDeadlineDays: number | null
    secondLevelDeadlineDays: number | null
    externalReviewDeadlineDays: number | null
    requiresClinicalNotes: boolean | null
    requiresMedicalRecords: boolean | null
    requiresLetterOfMedicalNecessity: boolean | null
    acceptsElectronicAppeals: boolean | null
    appealFaxNumber: string | null
    appealEmail: string | null
    appealPortalUrl: string | null
    preferredFormat: string | null
    specialInstructions: string | null
    firstLevelSuccessRate: number | null
    secondLevelSuccessRate: number | null
    externalReviewSuccessRate: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayerConfigMaxAggregateOutputType = {
    id: string | null
    payerId: string | null
    payerName: string | null
    firstLevelDeadlineDays: number | null
    secondLevelDeadlineDays: number | null
    externalReviewDeadlineDays: number | null
    requiresClinicalNotes: boolean | null
    requiresMedicalRecords: boolean | null
    requiresLetterOfMedicalNecessity: boolean | null
    acceptsElectronicAppeals: boolean | null
    appealFaxNumber: string | null
    appealEmail: string | null
    appealPortalUrl: string | null
    preferredFormat: string | null
    specialInstructions: string | null
    firstLevelSuccessRate: number | null
    secondLevelSuccessRate: number | null
    externalReviewSuccessRate: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayerConfigCountAggregateOutputType = {
    id: number
    payerId: number
    payerName: number
    firstLevelDeadlineDays: number
    secondLevelDeadlineDays: number
    externalReviewDeadlineDays: number
    requiresClinicalNotes: number
    requiresMedicalRecords: number
    requiresLetterOfMedicalNecessity: number
    acceptsElectronicAppeals: number
    appealAddress: number
    appealFaxNumber: number
    appealEmail: number
    appealPortalUrl: number
    preferredFormat: number
    specialInstructions: number
    firstLevelSuccessRate: number
    secondLevelSuccessRate: number
    externalReviewSuccessRate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PayerConfigAvgAggregateInputType = {
    firstLevelDeadlineDays?: true
    secondLevelDeadlineDays?: true
    externalReviewDeadlineDays?: true
    firstLevelSuccessRate?: true
    secondLevelSuccessRate?: true
    externalReviewSuccessRate?: true
  }

  export type PayerConfigSumAggregateInputType = {
    firstLevelDeadlineDays?: true
    secondLevelDeadlineDays?: true
    externalReviewDeadlineDays?: true
    firstLevelSuccessRate?: true
    secondLevelSuccessRate?: true
    externalReviewSuccessRate?: true
  }

  export type PayerConfigMinAggregateInputType = {
    id?: true
    payerId?: true
    payerName?: true
    firstLevelDeadlineDays?: true
    secondLevelDeadlineDays?: true
    externalReviewDeadlineDays?: true
    requiresClinicalNotes?: true
    requiresMedicalRecords?: true
    requiresLetterOfMedicalNecessity?: true
    acceptsElectronicAppeals?: true
    appealFaxNumber?: true
    appealEmail?: true
    appealPortalUrl?: true
    preferredFormat?: true
    specialInstructions?: true
    firstLevelSuccessRate?: true
    secondLevelSuccessRate?: true
    externalReviewSuccessRate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayerConfigMaxAggregateInputType = {
    id?: true
    payerId?: true
    payerName?: true
    firstLevelDeadlineDays?: true
    secondLevelDeadlineDays?: true
    externalReviewDeadlineDays?: true
    requiresClinicalNotes?: true
    requiresMedicalRecords?: true
    requiresLetterOfMedicalNecessity?: true
    acceptsElectronicAppeals?: true
    appealFaxNumber?: true
    appealEmail?: true
    appealPortalUrl?: true
    preferredFormat?: true
    specialInstructions?: true
    firstLevelSuccessRate?: true
    secondLevelSuccessRate?: true
    externalReviewSuccessRate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayerConfigCountAggregateInputType = {
    id?: true
    payerId?: true
    payerName?: true
    firstLevelDeadlineDays?: true
    secondLevelDeadlineDays?: true
    externalReviewDeadlineDays?: true
    requiresClinicalNotes?: true
    requiresMedicalRecords?: true
    requiresLetterOfMedicalNecessity?: true
    acceptsElectronicAppeals?: true
    appealAddress?: true
    appealFaxNumber?: true
    appealEmail?: true
    appealPortalUrl?: true
    preferredFormat?: true
    specialInstructions?: true
    firstLevelSuccessRate?: true
    secondLevelSuccessRate?: true
    externalReviewSuccessRate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PayerConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayerConfig to aggregate.
     */
    where?: PayerConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayerConfigs to fetch.
     */
    orderBy?: PayerConfigOrderByWithRelationInput | PayerConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayerConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayerConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayerConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayerConfigs
    **/
    _count?: true | PayerConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayerConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayerConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayerConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayerConfigMaxAggregateInputType
  }

  export type GetPayerConfigAggregateType<T extends PayerConfigAggregateArgs> = {
        [P in keyof T & keyof AggregatePayerConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayerConfig[P]>
      : GetScalarType<T[P], AggregatePayerConfig[P]>
  }




  export type PayerConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayerConfigWhereInput
    orderBy?: PayerConfigOrderByWithAggregationInput | PayerConfigOrderByWithAggregationInput[]
    by: PayerConfigScalarFieldEnum[] | PayerConfigScalarFieldEnum
    having?: PayerConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayerConfigCountAggregateInputType | true
    _avg?: PayerConfigAvgAggregateInputType
    _sum?: PayerConfigSumAggregateInputType
    _min?: PayerConfigMinAggregateInputType
    _max?: PayerConfigMaxAggregateInputType
  }

  export type PayerConfigGroupByOutputType = {
    id: string
    payerId: string
    payerName: string
    firstLevelDeadlineDays: number
    secondLevelDeadlineDays: number
    externalReviewDeadlineDays: number
    requiresClinicalNotes: boolean
    requiresMedicalRecords: boolean
    requiresLetterOfMedicalNecessity: boolean
    acceptsElectronicAppeals: boolean
    appealAddress: JsonValue | null
    appealFaxNumber: string | null
    appealEmail: string | null
    appealPortalUrl: string | null
    preferredFormat: string | null
    specialInstructions: string | null
    firstLevelSuccessRate: number | null
    secondLevelSuccessRate: number | null
    externalReviewSuccessRate: number | null
    createdAt: Date
    updatedAt: Date
    _count: PayerConfigCountAggregateOutputType | null
    _avg: PayerConfigAvgAggregateOutputType | null
    _sum: PayerConfigSumAggregateOutputType | null
    _min: PayerConfigMinAggregateOutputType | null
    _max: PayerConfigMaxAggregateOutputType | null
  }

  type GetPayerConfigGroupByPayload<T extends PayerConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayerConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayerConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayerConfigGroupByOutputType[P]>
            : GetScalarType<T[P], PayerConfigGroupByOutputType[P]>
        }
      >
    >


  export type PayerConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    payerId?: boolean
    payerName?: boolean
    firstLevelDeadlineDays?: boolean
    secondLevelDeadlineDays?: boolean
    externalReviewDeadlineDays?: boolean
    requiresClinicalNotes?: boolean
    requiresMedicalRecords?: boolean
    requiresLetterOfMedicalNecessity?: boolean
    acceptsElectronicAppeals?: boolean
    appealAddress?: boolean
    appealFaxNumber?: boolean
    appealEmail?: boolean
    appealPortalUrl?: boolean
    preferredFormat?: boolean
    specialInstructions?: boolean
    firstLevelSuccessRate?: boolean
    secondLevelSuccessRate?: boolean
    externalReviewSuccessRate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["payerConfig"]>

  export type PayerConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    payerId?: boolean
    payerName?: boolean
    firstLevelDeadlineDays?: boolean
    secondLevelDeadlineDays?: boolean
    externalReviewDeadlineDays?: boolean
    requiresClinicalNotes?: boolean
    requiresMedicalRecords?: boolean
    requiresLetterOfMedicalNecessity?: boolean
    acceptsElectronicAppeals?: boolean
    appealAddress?: boolean
    appealFaxNumber?: boolean
    appealEmail?: boolean
    appealPortalUrl?: boolean
    preferredFormat?: boolean
    specialInstructions?: boolean
    firstLevelSuccessRate?: boolean
    secondLevelSuccessRate?: boolean
    externalReviewSuccessRate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["payerConfig"]>

  export type PayerConfigSelectScalar = {
    id?: boolean
    payerId?: boolean
    payerName?: boolean
    firstLevelDeadlineDays?: boolean
    secondLevelDeadlineDays?: boolean
    externalReviewDeadlineDays?: boolean
    requiresClinicalNotes?: boolean
    requiresMedicalRecords?: boolean
    requiresLetterOfMedicalNecessity?: boolean
    acceptsElectronicAppeals?: boolean
    appealAddress?: boolean
    appealFaxNumber?: boolean
    appealEmail?: boolean
    appealPortalUrl?: boolean
    preferredFormat?: boolean
    specialInstructions?: boolean
    firstLevelSuccessRate?: boolean
    secondLevelSuccessRate?: boolean
    externalReviewSuccessRate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $PayerConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayerConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      payerId: string
      payerName: string
      firstLevelDeadlineDays: number
      secondLevelDeadlineDays: number
      externalReviewDeadlineDays: number
      requiresClinicalNotes: boolean
      requiresMedicalRecords: boolean
      requiresLetterOfMedicalNecessity: boolean
      acceptsElectronicAppeals: boolean
      appealAddress: Prisma.JsonValue | null
      appealFaxNumber: string | null
      appealEmail: string | null
      appealPortalUrl: string | null
      preferredFormat: string | null
      specialInstructions: string | null
      firstLevelSuccessRate: number | null
      secondLevelSuccessRate: number | null
      externalReviewSuccessRate: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payerConfig"]>
    composites: {}
  }

  type PayerConfigGetPayload<S extends boolean | null | undefined | PayerConfigDefaultArgs> = $Result.GetResult<Prisma.$PayerConfigPayload, S>

  type PayerConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PayerConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PayerConfigCountAggregateInputType | true
    }

  export interface PayerConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayerConfig'], meta: { name: 'PayerConfig' } }
    /**
     * Find zero or one PayerConfig that matches the filter.
     * @param {PayerConfigFindUniqueArgs} args - Arguments to find a PayerConfig
     * @example
     * // Get one PayerConfig
     * const payerConfig = await prisma.payerConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayerConfigFindUniqueArgs>(args: SelectSubset<T, PayerConfigFindUniqueArgs<ExtArgs>>): Prisma__PayerConfigClient<$Result.GetResult<Prisma.$PayerConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PayerConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PayerConfigFindUniqueOrThrowArgs} args - Arguments to find a PayerConfig
     * @example
     * // Get one PayerConfig
     * const payerConfig = await prisma.payerConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayerConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, PayerConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayerConfigClient<$Result.GetResult<Prisma.$PayerConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PayerConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerConfigFindFirstArgs} args - Arguments to find a PayerConfig
     * @example
     * // Get one PayerConfig
     * const payerConfig = await prisma.payerConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayerConfigFindFirstArgs>(args?: SelectSubset<T, PayerConfigFindFirstArgs<ExtArgs>>): Prisma__PayerConfigClient<$Result.GetResult<Prisma.$PayerConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PayerConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerConfigFindFirstOrThrowArgs} args - Arguments to find a PayerConfig
     * @example
     * // Get one PayerConfig
     * const payerConfig = await prisma.payerConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayerConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, PayerConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayerConfigClient<$Result.GetResult<Prisma.$PayerConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PayerConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayerConfigs
     * const payerConfigs = await prisma.payerConfig.findMany()
     * 
     * // Get first 10 PayerConfigs
     * const payerConfigs = await prisma.payerConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payerConfigWithIdOnly = await prisma.payerConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayerConfigFindManyArgs>(args?: SelectSubset<T, PayerConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayerConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PayerConfig.
     * @param {PayerConfigCreateArgs} args - Arguments to create a PayerConfig.
     * @example
     * // Create one PayerConfig
     * const PayerConfig = await prisma.payerConfig.create({
     *   data: {
     *     // ... data to create a PayerConfig
     *   }
     * })
     * 
     */
    create<T extends PayerConfigCreateArgs>(args: SelectSubset<T, PayerConfigCreateArgs<ExtArgs>>): Prisma__PayerConfigClient<$Result.GetResult<Prisma.$PayerConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PayerConfigs.
     * @param {PayerConfigCreateManyArgs} args - Arguments to create many PayerConfigs.
     * @example
     * // Create many PayerConfigs
     * const payerConfig = await prisma.payerConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayerConfigCreateManyArgs>(args?: SelectSubset<T, PayerConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PayerConfigs and returns the data saved in the database.
     * @param {PayerConfigCreateManyAndReturnArgs} args - Arguments to create many PayerConfigs.
     * @example
     * // Create many PayerConfigs
     * const payerConfig = await prisma.payerConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PayerConfigs and only return the `id`
     * const payerConfigWithIdOnly = await prisma.payerConfig.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PayerConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, PayerConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayerConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PayerConfig.
     * @param {PayerConfigDeleteArgs} args - Arguments to delete one PayerConfig.
     * @example
     * // Delete one PayerConfig
     * const PayerConfig = await prisma.payerConfig.delete({
     *   where: {
     *     // ... filter to delete one PayerConfig
     *   }
     * })
     * 
     */
    delete<T extends PayerConfigDeleteArgs>(args: SelectSubset<T, PayerConfigDeleteArgs<ExtArgs>>): Prisma__PayerConfigClient<$Result.GetResult<Prisma.$PayerConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PayerConfig.
     * @param {PayerConfigUpdateArgs} args - Arguments to update one PayerConfig.
     * @example
     * // Update one PayerConfig
     * const payerConfig = await prisma.payerConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayerConfigUpdateArgs>(args: SelectSubset<T, PayerConfigUpdateArgs<ExtArgs>>): Prisma__PayerConfigClient<$Result.GetResult<Prisma.$PayerConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PayerConfigs.
     * @param {PayerConfigDeleteManyArgs} args - Arguments to filter PayerConfigs to delete.
     * @example
     * // Delete a few PayerConfigs
     * const { count } = await prisma.payerConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayerConfigDeleteManyArgs>(args?: SelectSubset<T, PayerConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayerConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayerConfigs
     * const payerConfig = await prisma.payerConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayerConfigUpdateManyArgs>(args: SelectSubset<T, PayerConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayerConfig.
     * @param {PayerConfigUpsertArgs} args - Arguments to update or create a PayerConfig.
     * @example
     * // Update or create a PayerConfig
     * const payerConfig = await prisma.payerConfig.upsert({
     *   create: {
     *     // ... data to create a PayerConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayerConfig we want to update
     *   }
     * })
     */
    upsert<T extends PayerConfigUpsertArgs>(args: SelectSubset<T, PayerConfigUpsertArgs<ExtArgs>>): Prisma__PayerConfigClient<$Result.GetResult<Prisma.$PayerConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PayerConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerConfigCountArgs} args - Arguments to filter PayerConfigs to count.
     * @example
     * // Count the number of PayerConfigs
     * const count = await prisma.payerConfig.count({
     *   where: {
     *     // ... the filter for the PayerConfigs we want to count
     *   }
     * })
    **/
    count<T extends PayerConfigCountArgs>(
      args?: Subset<T, PayerConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayerConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayerConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PayerConfigAggregateArgs>(args: Subset<T, PayerConfigAggregateArgs>): Prisma.PrismaPromise<GetPayerConfigAggregateType<T>>

    /**
     * Group by PayerConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerConfigGroupByArgs} args - Group by arguments.
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
      T extends PayerConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayerConfigGroupByArgs['orderBy'] }
        : { orderBy?: PayerConfigGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PayerConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayerConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayerConfig model
   */
  readonly fields: PayerConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayerConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayerConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PayerConfig model
   */ 
  interface PayerConfigFieldRefs {
    readonly id: FieldRef<"PayerConfig", 'String'>
    readonly payerId: FieldRef<"PayerConfig", 'String'>
    readonly payerName: FieldRef<"PayerConfig", 'String'>
    readonly firstLevelDeadlineDays: FieldRef<"PayerConfig", 'Int'>
    readonly secondLevelDeadlineDays: FieldRef<"PayerConfig", 'Int'>
    readonly externalReviewDeadlineDays: FieldRef<"PayerConfig", 'Int'>
    readonly requiresClinicalNotes: FieldRef<"PayerConfig", 'Boolean'>
    readonly requiresMedicalRecords: FieldRef<"PayerConfig", 'Boolean'>
    readonly requiresLetterOfMedicalNecessity: FieldRef<"PayerConfig", 'Boolean'>
    readonly acceptsElectronicAppeals: FieldRef<"PayerConfig", 'Boolean'>
    readonly appealAddress: FieldRef<"PayerConfig", 'Json'>
    readonly appealFaxNumber: FieldRef<"PayerConfig", 'String'>
    readonly appealEmail: FieldRef<"PayerConfig", 'String'>
    readonly appealPortalUrl: FieldRef<"PayerConfig", 'String'>
    readonly preferredFormat: FieldRef<"PayerConfig", 'String'>
    readonly specialInstructions: FieldRef<"PayerConfig", 'String'>
    readonly firstLevelSuccessRate: FieldRef<"PayerConfig", 'Float'>
    readonly secondLevelSuccessRate: FieldRef<"PayerConfig", 'Float'>
    readonly externalReviewSuccessRate: FieldRef<"PayerConfig", 'Float'>
    readonly createdAt: FieldRef<"PayerConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"PayerConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayerConfig findUnique
   */
  export type PayerConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerConfig
     */
    select?: PayerConfigSelect<ExtArgs> | null
    /**
     * Filter, which PayerConfig to fetch.
     */
    where: PayerConfigWhereUniqueInput
  }

  /**
   * PayerConfig findUniqueOrThrow
   */
  export type PayerConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerConfig
     */
    select?: PayerConfigSelect<ExtArgs> | null
    /**
     * Filter, which PayerConfig to fetch.
     */
    where: PayerConfigWhereUniqueInput
  }

  /**
   * PayerConfig findFirst
   */
  export type PayerConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerConfig
     */
    select?: PayerConfigSelect<ExtArgs> | null
    /**
     * Filter, which PayerConfig to fetch.
     */
    where?: PayerConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayerConfigs to fetch.
     */
    orderBy?: PayerConfigOrderByWithRelationInput | PayerConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayerConfigs.
     */
    cursor?: PayerConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayerConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayerConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayerConfigs.
     */
    distinct?: PayerConfigScalarFieldEnum | PayerConfigScalarFieldEnum[]
  }

  /**
   * PayerConfig findFirstOrThrow
   */
  export type PayerConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerConfig
     */
    select?: PayerConfigSelect<ExtArgs> | null
    /**
     * Filter, which PayerConfig to fetch.
     */
    where?: PayerConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayerConfigs to fetch.
     */
    orderBy?: PayerConfigOrderByWithRelationInput | PayerConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayerConfigs.
     */
    cursor?: PayerConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayerConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayerConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayerConfigs.
     */
    distinct?: PayerConfigScalarFieldEnum | PayerConfigScalarFieldEnum[]
  }

  /**
   * PayerConfig findMany
   */
  export type PayerConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerConfig
     */
    select?: PayerConfigSelect<ExtArgs> | null
    /**
     * Filter, which PayerConfigs to fetch.
     */
    where?: PayerConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayerConfigs to fetch.
     */
    orderBy?: PayerConfigOrderByWithRelationInput | PayerConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayerConfigs.
     */
    cursor?: PayerConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayerConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayerConfigs.
     */
    skip?: number
    distinct?: PayerConfigScalarFieldEnum | PayerConfigScalarFieldEnum[]
  }

  /**
   * PayerConfig create
   */
  export type PayerConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerConfig
     */
    select?: PayerConfigSelect<ExtArgs> | null
    /**
     * The data needed to create a PayerConfig.
     */
    data: XOR<PayerConfigCreateInput, PayerConfigUncheckedCreateInput>
  }

  /**
   * PayerConfig createMany
   */
  export type PayerConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayerConfigs.
     */
    data: PayerConfigCreateManyInput | PayerConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PayerConfig createManyAndReturn
   */
  export type PayerConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerConfig
     */
    select?: PayerConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PayerConfigs.
     */
    data: PayerConfigCreateManyInput | PayerConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PayerConfig update
   */
  export type PayerConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerConfig
     */
    select?: PayerConfigSelect<ExtArgs> | null
    /**
     * The data needed to update a PayerConfig.
     */
    data: XOR<PayerConfigUpdateInput, PayerConfigUncheckedUpdateInput>
    /**
     * Choose, which PayerConfig to update.
     */
    where: PayerConfigWhereUniqueInput
  }

  /**
   * PayerConfig updateMany
   */
  export type PayerConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayerConfigs.
     */
    data: XOR<PayerConfigUpdateManyMutationInput, PayerConfigUncheckedUpdateManyInput>
    /**
     * Filter which PayerConfigs to update
     */
    where?: PayerConfigWhereInput
  }

  /**
   * PayerConfig upsert
   */
  export type PayerConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerConfig
     */
    select?: PayerConfigSelect<ExtArgs> | null
    /**
     * The filter to search for the PayerConfig to update in case it exists.
     */
    where: PayerConfigWhereUniqueInput
    /**
     * In case the PayerConfig found by the `where` argument doesn't exist, create a new PayerConfig with this data.
     */
    create: XOR<PayerConfigCreateInput, PayerConfigUncheckedCreateInput>
    /**
     * In case the PayerConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayerConfigUpdateInput, PayerConfigUncheckedUpdateInput>
  }

  /**
   * PayerConfig delete
   */
  export type PayerConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerConfig
     */
    select?: PayerConfigSelect<ExtArgs> | null
    /**
     * Filter which PayerConfig to delete.
     */
    where: PayerConfigWhereUniqueInput
  }

  /**
   * PayerConfig deleteMany
   */
  export type PayerConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayerConfigs to delete
     */
    where?: PayerConfigWhereInput
  }

  /**
   * PayerConfig without action
   */
  export type PayerConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerConfig
     */
    select?: PayerConfigSelect<ExtArgs> | null
  }


  /**
   * Model StaffProductivity
   */

  export type AggregateStaffProductivity = {
    _count: StaffProductivityCountAggregateOutputType | null
    _avg: StaffProductivityAvgAggregateOutputType | null
    _sum: StaffProductivitySumAggregateOutputType | null
    _min: StaffProductivityMinAggregateOutputType | null
    _max: StaffProductivityMaxAggregateOutputType | null
  }

  export type StaffProductivityAvgAggregateOutputType = {
    denialsReviewed: number | null
    denialsAssigned: number | null
    appealsCreated: number | null
    appealsSubmitted: number | null
    appealsOverturned: number | null
    appealsUpheld: number | null
    averageProcessingTime: number | null
    totalProcessingTime: number | null
    totalRecovered: Decimal | null
  }

  export type StaffProductivitySumAggregateOutputType = {
    denialsReviewed: number | null
    denialsAssigned: number | null
    appealsCreated: number | null
    appealsSubmitted: number | null
    appealsOverturned: number | null
    appealsUpheld: number | null
    averageProcessingTime: number | null
    totalProcessingTime: number | null
    totalRecovered: Decimal | null
  }

  export type StaffProductivityMinAggregateOutputType = {
    id: string | null
    staffId: string | null
    staffName: string | null
    periodDate: Date | null
    denialsReviewed: number | null
    denialsAssigned: number | null
    appealsCreated: number | null
    appealsSubmitted: number | null
    appealsOverturned: number | null
    appealsUpheld: number | null
    averageProcessingTime: number | null
    totalProcessingTime: number | null
    totalRecovered: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StaffProductivityMaxAggregateOutputType = {
    id: string | null
    staffId: string | null
    staffName: string | null
    periodDate: Date | null
    denialsReviewed: number | null
    denialsAssigned: number | null
    appealsCreated: number | null
    appealsSubmitted: number | null
    appealsOverturned: number | null
    appealsUpheld: number | null
    averageProcessingTime: number | null
    totalProcessingTime: number | null
    totalRecovered: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StaffProductivityCountAggregateOutputType = {
    id: number
    staffId: number
    staffName: number
    periodDate: number
    denialsReviewed: number
    denialsAssigned: number
    appealsCreated: number
    appealsSubmitted: number
    appealsOverturned: number
    appealsUpheld: number
    averageProcessingTime: number
    totalProcessingTime: number
    totalRecovered: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StaffProductivityAvgAggregateInputType = {
    denialsReviewed?: true
    denialsAssigned?: true
    appealsCreated?: true
    appealsSubmitted?: true
    appealsOverturned?: true
    appealsUpheld?: true
    averageProcessingTime?: true
    totalProcessingTime?: true
    totalRecovered?: true
  }

  export type StaffProductivitySumAggregateInputType = {
    denialsReviewed?: true
    denialsAssigned?: true
    appealsCreated?: true
    appealsSubmitted?: true
    appealsOverturned?: true
    appealsUpheld?: true
    averageProcessingTime?: true
    totalProcessingTime?: true
    totalRecovered?: true
  }

  export type StaffProductivityMinAggregateInputType = {
    id?: true
    staffId?: true
    staffName?: true
    periodDate?: true
    denialsReviewed?: true
    denialsAssigned?: true
    appealsCreated?: true
    appealsSubmitted?: true
    appealsOverturned?: true
    appealsUpheld?: true
    averageProcessingTime?: true
    totalProcessingTime?: true
    totalRecovered?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StaffProductivityMaxAggregateInputType = {
    id?: true
    staffId?: true
    staffName?: true
    periodDate?: true
    denialsReviewed?: true
    denialsAssigned?: true
    appealsCreated?: true
    appealsSubmitted?: true
    appealsOverturned?: true
    appealsUpheld?: true
    averageProcessingTime?: true
    totalProcessingTime?: true
    totalRecovered?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StaffProductivityCountAggregateInputType = {
    id?: true
    staffId?: true
    staffName?: true
    periodDate?: true
    denialsReviewed?: true
    denialsAssigned?: true
    appealsCreated?: true
    appealsSubmitted?: true
    appealsOverturned?: true
    appealsUpheld?: true
    averageProcessingTime?: true
    totalProcessingTime?: true
    totalRecovered?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StaffProductivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StaffProductivity to aggregate.
     */
    where?: StaffProductivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StaffProductivities to fetch.
     */
    orderBy?: StaffProductivityOrderByWithRelationInput | StaffProductivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StaffProductivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StaffProductivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StaffProductivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StaffProductivities
    **/
    _count?: true | StaffProductivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StaffProductivityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StaffProductivitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StaffProductivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StaffProductivityMaxAggregateInputType
  }

  export type GetStaffProductivityAggregateType<T extends StaffProductivityAggregateArgs> = {
        [P in keyof T & keyof AggregateStaffProductivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStaffProductivity[P]>
      : GetScalarType<T[P], AggregateStaffProductivity[P]>
  }




  export type StaffProductivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StaffProductivityWhereInput
    orderBy?: StaffProductivityOrderByWithAggregationInput | StaffProductivityOrderByWithAggregationInput[]
    by: StaffProductivityScalarFieldEnum[] | StaffProductivityScalarFieldEnum
    having?: StaffProductivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StaffProductivityCountAggregateInputType | true
    _avg?: StaffProductivityAvgAggregateInputType
    _sum?: StaffProductivitySumAggregateInputType
    _min?: StaffProductivityMinAggregateInputType
    _max?: StaffProductivityMaxAggregateInputType
  }

  export type StaffProductivityGroupByOutputType = {
    id: string
    staffId: string
    staffName: string
    periodDate: Date
    denialsReviewed: number
    denialsAssigned: number
    appealsCreated: number
    appealsSubmitted: number
    appealsOverturned: number
    appealsUpheld: number
    averageProcessingTime: number | null
    totalProcessingTime: number
    totalRecovered: Decimal
    createdAt: Date
    updatedAt: Date
    _count: StaffProductivityCountAggregateOutputType | null
    _avg: StaffProductivityAvgAggregateOutputType | null
    _sum: StaffProductivitySumAggregateOutputType | null
    _min: StaffProductivityMinAggregateOutputType | null
    _max: StaffProductivityMaxAggregateOutputType | null
  }

  type GetStaffProductivityGroupByPayload<T extends StaffProductivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StaffProductivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StaffProductivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StaffProductivityGroupByOutputType[P]>
            : GetScalarType<T[P], StaffProductivityGroupByOutputType[P]>
        }
      >
    >


  export type StaffProductivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    staffId?: boolean
    staffName?: boolean
    periodDate?: boolean
    denialsReviewed?: boolean
    denialsAssigned?: boolean
    appealsCreated?: boolean
    appealsSubmitted?: boolean
    appealsOverturned?: boolean
    appealsUpheld?: boolean
    averageProcessingTime?: boolean
    totalProcessingTime?: boolean
    totalRecovered?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["staffProductivity"]>

  export type StaffProductivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    staffId?: boolean
    staffName?: boolean
    periodDate?: boolean
    denialsReviewed?: boolean
    denialsAssigned?: boolean
    appealsCreated?: boolean
    appealsSubmitted?: boolean
    appealsOverturned?: boolean
    appealsUpheld?: boolean
    averageProcessingTime?: boolean
    totalProcessingTime?: boolean
    totalRecovered?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["staffProductivity"]>

  export type StaffProductivitySelectScalar = {
    id?: boolean
    staffId?: boolean
    staffName?: boolean
    periodDate?: boolean
    denialsReviewed?: boolean
    denialsAssigned?: boolean
    appealsCreated?: boolean
    appealsSubmitted?: boolean
    appealsOverturned?: boolean
    appealsUpheld?: boolean
    averageProcessingTime?: boolean
    totalProcessingTime?: boolean
    totalRecovered?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $StaffProductivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StaffProductivity"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      staffId: string
      staffName: string
      periodDate: Date
      denialsReviewed: number
      denialsAssigned: number
      appealsCreated: number
      appealsSubmitted: number
      appealsOverturned: number
      appealsUpheld: number
      averageProcessingTime: number | null
      totalProcessingTime: number
      totalRecovered: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["staffProductivity"]>
    composites: {}
  }

  type StaffProductivityGetPayload<S extends boolean | null | undefined | StaffProductivityDefaultArgs> = $Result.GetResult<Prisma.$StaffProductivityPayload, S>

  type StaffProductivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StaffProductivityFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StaffProductivityCountAggregateInputType | true
    }

  export interface StaffProductivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StaffProductivity'], meta: { name: 'StaffProductivity' } }
    /**
     * Find zero or one StaffProductivity that matches the filter.
     * @param {StaffProductivityFindUniqueArgs} args - Arguments to find a StaffProductivity
     * @example
     * // Get one StaffProductivity
     * const staffProductivity = await prisma.staffProductivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StaffProductivityFindUniqueArgs>(args: SelectSubset<T, StaffProductivityFindUniqueArgs<ExtArgs>>): Prisma__StaffProductivityClient<$Result.GetResult<Prisma.$StaffProductivityPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StaffProductivity that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StaffProductivityFindUniqueOrThrowArgs} args - Arguments to find a StaffProductivity
     * @example
     * // Get one StaffProductivity
     * const staffProductivity = await prisma.staffProductivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StaffProductivityFindUniqueOrThrowArgs>(args: SelectSubset<T, StaffProductivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StaffProductivityClient<$Result.GetResult<Prisma.$StaffProductivityPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StaffProductivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffProductivityFindFirstArgs} args - Arguments to find a StaffProductivity
     * @example
     * // Get one StaffProductivity
     * const staffProductivity = await prisma.staffProductivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StaffProductivityFindFirstArgs>(args?: SelectSubset<T, StaffProductivityFindFirstArgs<ExtArgs>>): Prisma__StaffProductivityClient<$Result.GetResult<Prisma.$StaffProductivityPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StaffProductivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffProductivityFindFirstOrThrowArgs} args - Arguments to find a StaffProductivity
     * @example
     * // Get one StaffProductivity
     * const staffProductivity = await prisma.staffProductivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StaffProductivityFindFirstOrThrowArgs>(args?: SelectSubset<T, StaffProductivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__StaffProductivityClient<$Result.GetResult<Prisma.$StaffProductivityPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StaffProductivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffProductivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StaffProductivities
     * const staffProductivities = await prisma.staffProductivity.findMany()
     * 
     * // Get first 10 StaffProductivities
     * const staffProductivities = await prisma.staffProductivity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const staffProductivityWithIdOnly = await prisma.staffProductivity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StaffProductivityFindManyArgs>(args?: SelectSubset<T, StaffProductivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffProductivityPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StaffProductivity.
     * @param {StaffProductivityCreateArgs} args - Arguments to create a StaffProductivity.
     * @example
     * // Create one StaffProductivity
     * const StaffProductivity = await prisma.staffProductivity.create({
     *   data: {
     *     // ... data to create a StaffProductivity
     *   }
     * })
     * 
     */
    create<T extends StaffProductivityCreateArgs>(args: SelectSubset<T, StaffProductivityCreateArgs<ExtArgs>>): Prisma__StaffProductivityClient<$Result.GetResult<Prisma.$StaffProductivityPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StaffProductivities.
     * @param {StaffProductivityCreateManyArgs} args - Arguments to create many StaffProductivities.
     * @example
     * // Create many StaffProductivities
     * const staffProductivity = await prisma.staffProductivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StaffProductivityCreateManyArgs>(args?: SelectSubset<T, StaffProductivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StaffProductivities and returns the data saved in the database.
     * @param {StaffProductivityCreateManyAndReturnArgs} args - Arguments to create many StaffProductivities.
     * @example
     * // Create many StaffProductivities
     * const staffProductivity = await prisma.staffProductivity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StaffProductivities and only return the `id`
     * const staffProductivityWithIdOnly = await prisma.staffProductivity.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StaffProductivityCreateManyAndReturnArgs>(args?: SelectSubset<T, StaffProductivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffProductivityPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StaffProductivity.
     * @param {StaffProductivityDeleteArgs} args - Arguments to delete one StaffProductivity.
     * @example
     * // Delete one StaffProductivity
     * const StaffProductivity = await prisma.staffProductivity.delete({
     *   where: {
     *     // ... filter to delete one StaffProductivity
     *   }
     * })
     * 
     */
    delete<T extends StaffProductivityDeleteArgs>(args: SelectSubset<T, StaffProductivityDeleteArgs<ExtArgs>>): Prisma__StaffProductivityClient<$Result.GetResult<Prisma.$StaffProductivityPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StaffProductivity.
     * @param {StaffProductivityUpdateArgs} args - Arguments to update one StaffProductivity.
     * @example
     * // Update one StaffProductivity
     * const staffProductivity = await prisma.staffProductivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StaffProductivityUpdateArgs>(args: SelectSubset<T, StaffProductivityUpdateArgs<ExtArgs>>): Prisma__StaffProductivityClient<$Result.GetResult<Prisma.$StaffProductivityPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StaffProductivities.
     * @param {StaffProductivityDeleteManyArgs} args - Arguments to filter StaffProductivities to delete.
     * @example
     * // Delete a few StaffProductivities
     * const { count } = await prisma.staffProductivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StaffProductivityDeleteManyArgs>(args?: SelectSubset<T, StaffProductivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StaffProductivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffProductivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StaffProductivities
     * const staffProductivity = await prisma.staffProductivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StaffProductivityUpdateManyArgs>(args: SelectSubset<T, StaffProductivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StaffProductivity.
     * @param {StaffProductivityUpsertArgs} args - Arguments to update or create a StaffProductivity.
     * @example
     * // Update or create a StaffProductivity
     * const staffProductivity = await prisma.staffProductivity.upsert({
     *   create: {
     *     // ... data to create a StaffProductivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StaffProductivity we want to update
     *   }
     * })
     */
    upsert<T extends StaffProductivityUpsertArgs>(args: SelectSubset<T, StaffProductivityUpsertArgs<ExtArgs>>): Prisma__StaffProductivityClient<$Result.GetResult<Prisma.$StaffProductivityPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StaffProductivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffProductivityCountArgs} args - Arguments to filter StaffProductivities to count.
     * @example
     * // Count the number of StaffProductivities
     * const count = await prisma.staffProductivity.count({
     *   where: {
     *     // ... the filter for the StaffProductivities we want to count
     *   }
     * })
    **/
    count<T extends StaffProductivityCountArgs>(
      args?: Subset<T, StaffProductivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StaffProductivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StaffProductivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffProductivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StaffProductivityAggregateArgs>(args: Subset<T, StaffProductivityAggregateArgs>): Prisma.PrismaPromise<GetStaffProductivityAggregateType<T>>

    /**
     * Group by StaffProductivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffProductivityGroupByArgs} args - Group by arguments.
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
      T extends StaffProductivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StaffProductivityGroupByArgs['orderBy'] }
        : { orderBy?: StaffProductivityGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StaffProductivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStaffProductivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StaffProductivity model
   */
  readonly fields: StaffProductivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StaffProductivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StaffProductivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the StaffProductivity model
   */ 
  interface StaffProductivityFieldRefs {
    readonly id: FieldRef<"StaffProductivity", 'String'>
    readonly staffId: FieldRef<"StaffProductivity", 'String'>
    readonly staffName: FieldRef<"StaffProductivity", 'String'>
    readonly periodDate: FieldRef<"StaffProductivity", 'DateTime'>
    readonly denialsReviewed: FieldRef<"StaffProductivity", 'Int'>
    readonly denialsAssigned: FieldRef<"StaffProductivity", 'Int'>
    readonly appealsCreated: FieldRef<"StaffProductivity", 'Int'>
    readonly appealsSubmitted: FieldRef<"StaffProductivity", 'Int'>
    readonly appealsOverturned: FieldRef<"StaffProductivity", 'Int'>
    readonly appealsUpheld: FieldRef<"StaffProductivity", 'Int'>
    readonly averageProcessingTime: FieldRef<"StaffProductivity", 'Int'>
    readonly totalProcessingTime: FieldRef<"StaffProductivity", 'Int'>
    readonly totalRecovered: FieldRef<"StaffProductivity", 'Decimal'>
    readonly createdAt: FieldRef<"StaffProductivity", 'DateTime'>
    readonly updatedAt: FieldRef<"StaffProductivity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StaffProductivity findUnique
   */
  export type StaffProductivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffProductivity
     */
    select?: StaffProductivitySelect<ExtArgs> | null
    /**
     * Filter, which StaffProductivity to fetch.
     */
    where: StaffProductivityWhereUniqueInput
  }

  /**
   * StaffProductivity findUniqueOrThrow
   */
  export type StaffProductivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffProductivity
     */
    select?: StaffProductivitySelect<ExtArgs> | null
    /**
     * Filter, which StaffProductivity to fetch.
     */
    where: StaffProductivityWhereUniqueInput
  }

  /**
   * StaffProductivity findFirst
   */
  export type StaffProductivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffProductivity
     */
    select?: StaffProductivitySelect<ExtArgs> | null
    /**
     * Filter, which StaffProductivity to fetch.
     */
    where?: StaffProductivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StaffProductivities to fetch.
     */
    orderBy?: StaffProductivityOrderByWithRelationInput | StaffProductivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StaffProductivities.
     */
    cursor?: StaffProductivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StaffProductivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StaffProductivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StaffProductivities.
     */
    distinct?: StaffProductivityScalarFieldEnum | StaffProductivityScalarFieldEnum[]
  }

  /**
   * StaffProductivity findFirstOrThrow
   */
  export type StaffProductivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffProductivity
     */
    select?: StaffProductivitySelect<ExtArgs> | null
    /**
     * Filter, which StaffProductivity to fetch.
     */
    where?: StaffProductivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StaffProductivities to fetch.
     */
    orderBy?: StaffProductivityOrderByWithRelationInput | StaffProductivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StaffProductivities.
     */
    cursor?: StaffProductivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StaffProductivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StaffProductivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StaffProductivities.
     */
    distinct?: StaffProductivityScalarFieldEnum | StaffProductivityScalarFieldEnum[]
  }

  /**
   * StaffProductivity findMany
   */
  export type StaffProductivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffProductivity
     */
    select?: StaffProductivitySelect<ExtArgs> | null
    /**
     * Filter, which StaffProductivities to fetch.
     */
    where?: StaffProductivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StaffProductivities to fetch.
     */
    orderBy?: StaffProductivityOrderByWithRelationInput | StaffProductivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StaffProductivities.
     */
    cursor?: StaffProductivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StaffProductivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StaffProductivities.
     */
    skip?: number
    distinct?: StaffProductivityScalarFieldEnum | StaffProductivityScalarFieldEnum[]
  }

  /**
   * StaffProductivity create
   */
  export type StaffProductivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffProductivity
     */
    select?: StaffProductivitySelect<ExtArgs> | null
    /**
     * The data needed to create a StaffProductivity.
     */
    data: XOR<StaffProductivityCreateInput, StaffProductivityUncheckedCreateInput>
  }

  /**
   * StaffProductivity createMany
   */
  export type StaffProductivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StaffProductivities.
     */
    data: StaffProductivityCreateManyInput | StaffProductivityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StaffProductivity createManyAndReturn
   */
  export type StaffProductivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffProductivity
     */
    select?: StaffProductivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StaffProductivities.
     */
    data: StaffProductivityCreateManyInput | StaffProductivityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StaffProductivity update
   */
  export type StaffProductivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffProductivity
     */
    select?: StaffProductivitySelect<ExtArgs> | null
    /**
     * The data needed to update a StaffProductivity.
     */
    data: XOR<StaffProductivityUpdateInput, StaffProductivityUncheckedUpdateInput>
    /**
     * Choose, which StaffProductivity to update.
     */
    where: StaffProductivityWhereUniqueInput
  }

  /**
   * StaffProductivity updateMany
   */
  export type StaffProductivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StaffProductivities.
     */
    data: XOR<StaffProductivityUpdateManyMutationInput, StaffProductivityUncheckedUpdateManyInput>
    /**
     * Filter which StaffProductivities to update
     */
    where?: StaffProductivityWhereInput
  }

  /**
   * StaffProductivity upsert
   */
  export type StaffProductivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffProductivity
     */
    select?: StaffProductivitySelect<ExtArgs> | null
    /**
     * The filter to search for the StaffProductivity to update in case it exists.
     */
    where: StaffProductivityWhereUniqueInput
    /**
     * In case the StaffProductivity found by the `where` argument doesn't exist, create a new StaffProductivity with this data.
     */
    create: XOR<StaffProductivityCreateInput, StaffProductivityUncheckedCreateInput>
    /**
     * In case the StaffProductivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StaffProductivityUpdateInput, StaffProductivityUncheckedUpdateInput>
  }

  /**
   * StaffProductivity delete
   */
  export type StaffProductivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffProductivity
     */
    select?: StaffProductivitySelect<ExtArgs> | null
    /**
     * Filter which StaffProductivity to delete.
     */
    where: StaffProductivityWhereUniqueInput
  }

  /**
   * StaffProductivity deleteMany
   */
  export type StaffProductivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StaffProductivities to delete
     */
    where?: StaffProductivityWhereInput
  }

  /**
   * StaffProductivity without action
   */
  export type StaffProductivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffProductivity
     */
    select?: StaffProductivitySelect<ExtArgs> | null
  }


  /**
   * Model RevenueRecovery
   */

  export type AggregateRevenueRecovery = {
    _count: RevenueRecoveryCountAggregateOutputType | null
    _avg: RevenueRecoveryAvgAggregateOutputType | null
    _sum: RevenueRecoverySumAggregateOutputType | null
    _min: RevenueRecoveryMinAggregateOutputType | null
    _max: RevenueRecoveryMaxAggregateOutputType | null
  }

  export type RevenueRecoveryAvgAggregateOutputType = {
    totalDenials: number | null
    totalDeniedAmount: Decimal | null
    totalAppeals: number | null
    successfulAppeals: number | null
    totalRecovered: Decimal | null
    totalWrittenOff: Decimal | null
    recoveryRate: number | null
  }

  export type RevenueRecoverySumAggregateOutputType = {
    totalDenials: number | null
    totalDeniedAmount: Decimal | null
    totalAppeals: number | null
    successfulAppeals: number | null
    totalRecovered: Decimal | null
    totalWrittenOff: Decimal | null
    recoveryRate: number | null
  }

  export type RevenueRecoveryMinAggregateOutputType = {
    id: string | null
    periodStart: Date | null
    periodEnd: Date | null
    totalDenials: number | null
    totalDeniedAmount: Decimal | null
    totalAppeals: number | null
    successfulAppeals: number | null
    totalRecovered: Decimal | null
    totalWrittenOff: Decimal | null
    recoveryRate: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RevenueRecoveryMaxAggregateOutputType = {
    id: string | null
    periodStart: Date | null
    periodEnd: Date | null
    totalDenials: number | null
    totalDeniedAmount: Decimal | null
    totalAppeals: number | null
    successfulAppeals: number | null
    totalRecovered: Decimal | null
    totalWrittenOff: Decimal | null
    recoveryRate: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RevenueRecoveryCountAggregateOutputType = {
    id: number
    periodStart: number
    periodEnd: number
    totalDenials: number
    totalDeniedAmount: number
    totalAppeals: number
    successfulAppeals: number
    totalRecovered: number
    totalWrittenOff: number
    recoveryRate: number
    recoveryByCategory: number
    recoveryByPayer: number
    weeklyBreakdown: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RevenueRecoveryAvgAggregateInputType = {
    totalDenials?: true
    totalDeniedAmount?: true
    totalAppeals?: true
    successfulAppeals?: true
    totalRecovered?: true
    totalWrittenOff?: true
    recoveryRate?: true
  }

  export type RevenueRecoverySumAggregateInputType = {
    totalDenials?: true
    totalDeniedAmount?: true
    totalAppeals?: true
    successfulAppeals?: true
    totalRecovered?: true
    totalWrittenOff?: true
    recoveryRate?: true
  }

  export type RevenueRecoveryMinAggregateInputType = {
    id?: true
    periodStart?: true
    periodEnd?: true
    totalDenials?: true
    totalDeniedAmount?: true
    totalAppeals?: true
    successfulAppeals?: true
    totalRecovered?: true
    totalWrittenOff?: true
    recoveryRate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RevenueRecoveryMaxAggregateInputType = {
    id?: true
    periodStart?: true
    periodEnd?: true
    totalDenials?: true
    totalDeniedAmount?: true
    totalAppeals?: true
    successfulAppeals?: true
    totalRecovered?: true
    totalWrittenOff?: true
    recoveryRate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RevenueRecoveryCountAggregateInputType = {
    id?: true
    periodStart?: true
    periodEnd?: true
    totalDenials?: true
    totalDeniedAmount?: true
    totalAppeals?: true
    successfulAppeals?: true
    totalRecovered?: true
    totalWrittenOff?: true
    recoveryRate?: true
    recoveryByCategory?: true
    recoveryByPayer?: true
    weeklyBreakdown?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RevenueRecoveryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RevenueRecovery to aggregate.
     */
    where?: RevenueRecoveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevenueRecoveries to fetch.
     */
    orderBy?: RevenueRecoveryOrderByWithRelationInput | RevenueRecoveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RevenueRecoveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevenueRecoveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevenueRecoveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RevenueRecoveries
    **/
    _count?: true | RevenueRecoveryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RevenueRecoveryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RevenueRecoverySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RevenueRecoveryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RevenueRecoveryMaxAggregateInputType
  }

  export type GetRevenueRecoveryAggregateType<T extends RevenueRecoveryAggregateArgs> = {
        [P in keyof T & keyof AggregateRevenueRecovery]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRevenueRecovery[P]>
      : GetScalarType<T[P], AggregateRevenueRecovery[P]>
  }




  export type RevenueRecoveryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RevenueRecoveryWhereInput
    orderBy?: RevenueRecoveryOrderByWithAggregationInput | RevenueRecoveryOrderByWithAggregationInput[]
    by: RevenueRecoveryScalarFieldEnum[] | RevenueRecoveryScalarFieldEnum
    having?: RevenueRecoveryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RevenueRecoveryCountAggregateInputType | true
    _avg?: RevenueRecoveryAvgAggregateInputType
    _sum?: RevenueRecoverySumAggregateInputType
    _min?: RevenueRecoveryMinAggregateInputType
    _max?: RevenueRecoveryMaxAggregateInputType
  }

  export type RevenueRecoveryGroupByOutputType = {
    id: string
    periodStart: Date
    periodEnd: Date
    totalDenials: number
    totalDeniedAmount: Decimal
    totalAppeals: number
    successfulAppeals: number
    totalRecovered: Decimal
    totalWrittenOff: Decimal
    recoveryRate: number
    recoveryByCategory: JsonValue | null
    recoveryByPayer: JsonValue | null
    weeklyBreakdown: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: RevenueRecoveryCountAggregateOutputType | null
    _avg: RevenueRecoveryAvgAggregateOutputType | null
    _sum: RevenueRecoverySumAggregateOutputType | null
    _min: RevenueRecoveryMinAggregateOutputType | null
    _max: RevenueRecoveryMaxAggregateOutputType | null
  }

  type GetRevenueRecoveryGroupByPayload<T extends RevenueRecoveryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RevenueRecoveryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RevenueRecoveryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RevenueRecoveryGroupByOutputType[P]>
            : GetScalarType<T[P], RevenueRecoveryGroupByOutputType[P]>
        }
      >
    >


  export type RevenueRecoverySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    totalDenials?: boolean
    totalDeniedAmount?: boolean
    totalAppeals?: boolean
    successfulAppeals?: boolean
    totalRecovered?: boolean
    totalWrittenOff?: boolean
    recoveryRate?: boolean
    recoveryByCategory?: boolean
    recoveryByPayer?: boolean
    weeklyBreakdown?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["revenueRecovery"]>

  export type RevenueRecoverySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    totalDenials?: boolean
    totalDeniedAmount?: boolean
    totalAppeals?: boolean
    successfulAppeals?: boolean
    totalRecovered?: boolean
    totalWrittenOff?: boolean
    recoveryRate?: boolean
    recoveryByCategory?: boolean
    recoveryByPayer?: boolean
    weeklyBreakdown?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["revenueRecovery"]>

  export type RevenueRecoverySelectScalar = {
    id?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    totalDenials?: boolean
    totalDeniedAmount?: boolean
    totalAppeals?: boolean
    successfulAppeals?: boolean
    totalRecovered?: boolean
    totalWrittenOff?: boolean
    recoveryRate?: boolean
    recoveryByCategory?: boolean
    recoveryByPayer?: boolean
    weeklyBreakdown?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $RevenueRecoveryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RevenueRecovery"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      periodStart: Date
      periodEnd: Date
      totalDenials: number
      totalDeniedAmount: Prisma.Decimal
      totalAppeals: number
      successfulAppeals: number
      totalRecovered: Prisma.Decimal
      totalWrittenOff: Prisma.Decimal
      recoveryRate: number
      recoveryByCategory: Prisma.JsonValue | null
      recoveryByPayer: Prisma.JsonValue | null
      weeklyBreakdown: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["revenueRecovery"]>
    composites: {}
  }

  type RevenueRecoveryGetPayload<S extends boolean | null | undefined | RevenueRecoveryDefaultArgs> = $Result.GetResult<Prisma.$RevenueRecoveryPayload, S>

  type RevenueRecoveryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RevenueRecoveryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RevenueRecoveryCountAggregateInputType | true
    }

  export interface RevenueRecoveryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RevenueRecovery'], meta: { name: 'RevenueRecovery' } }
    /**
     * Find zero or one RevenueRecovery that matches the filter.
     * @param {RevenueRecoveryFindUniqueArgs} args - Arguments to find a RevenueRecovery
     * @example
     * // Get one RevenueRecovery
     * const revenueRecovery = await prisma.revenueRecovery.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RevenueRecoveryFindUniqueArgs>(args: SelectSubset<T, RevenueRecoveryFindUniqueArgs<ExtArgs>>): Prisma__RevenueRecoveryClient<$Result.GetResult<Prisma.$RevenueRecoveryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RevenueRecovery that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RevenueRecoveryFindUniqueOrThrowArgs} args - Arguments to find a RevenueRecovery
     * @example
     * // Get one RevenueRecovery
     * const revenueRecovery = await prisma.revenueRecovery.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RevenueRecoveryFindUniqueOrThrowArgs>(args: SelectSubset<T, RevenueRecoveryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RevenueRecoveryClient<$Result.GetResult<Prisma.$RevenueRecoveryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RevenueRecovery that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueRecoveryFindFirstArgs} args - Arguments to find a RevenueRecovery
     * @example
     * // Get one RevenueRecovery
     * const revenueRecovery = await prisma.revenueRecovery.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RevenueRecoveryFindFirstArgs>(args?: SelectSubset<T, RevenueRecoveryFindFirstArgs<ExtArgs>>): Prisma__RevenueRecoveryClient<$Result.GetResult<Prisma.$RevenueRecoveryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RevenueRecovery that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueRecoveryFindFirstOrThrowArgs} args - Arguments to find a RevenueRecovery
     * @example
     * // Get one RevenueRecovery
     * const revenueRecovery = await prisma.revenueRecovery.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RevenueRecoveryFindFirstOrThrowArgs>(args?: SelectSubset<T, RevenueRecoveryFindFirstOrThrowArgs<ExtArgs>>): Prisma__RevenueRecoveryClient<$Result.GetResult<Prisma.$RevenueRecoveryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RevenueRecoveries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueRecoveryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RevenueRecoveries
     * const revenueRecoveries = await prisma.revenueRecovery.findMany()
     * 
     * // Get first 10 RevenueRecoveries
     * const revenueRecoveries = await prisma.revenueRecovery.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const revenueRecoveryWithIdOnly = await prisma.revenueRecovery.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RevenueRecoveryFindManyArgs>(args?: SelectSubset<T, RevenueRecoveryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RevenueRecoveryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RevenueRecovery.
     * @param {RevenueRecoveryCreateArgs} args - Arguments to create a RevenueRecovery.
     * @example
     * // Create one RevenueRecovery
     * const RevenueRecovery = await prisma.revenueRecovery.create({
     *   data: {
     *     // ... data to create a RevenueRecovery
     *   }
     * })
     * 
     */
    create<T extends RevenueRecoveryCreateArgs>(args: SelectSubset<T, RevenueRecoveryCreateArgs<ExtArgs>>): Prisma__RevenueRecoveryClient<$Result.GetResult<Prisma.$RevenueRecoveryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RevenueRecoveries.
     * @param {RevenueRecoveryCreateManyArgs} args - Arguments to create many RevenueRecoveries.
     * @example
     * // Create many RevenueRecoveries
     * const revenueRecovery = await prisma.revenueRecovery.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RevenueRecoveryCreateManyArgs>(args?: SelectSubset<T, RevenueRecoveryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RevenueRecoveries and returns the data saved in the database.
     * @param {RevenueRecoveryCreateManyAndReturnArgs} args - Arguments to create many RevenueRecoveries.
     * @example
     * // Create many RevenueRecoveries
     * const revenueRecovery = await prisma.revenueRecovery.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RevenueRecoveries and only return the `id`
     * const revenueRecoveryWithIdOnly = await prisma.revenueRecovery.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RevenueRecoveryCreateManyAndReturnArgs>(args?: SelectSubset<T, RevenueRecoveryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RevenueRecoveryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RevenueRecovery.
     * @param {RevenueRecoveryDeleteArgs} args - Arguments to delete one RevenueRecovery.
     * @example
     * // Delete one RevenueRecovery
     * const RevenueRecovery = await prisma.revenueRecovery.delete({
     *   where: {
     *     // ... filter to delete one RevenueRecovery
     *   }
     * })
     * 
     */
    delete<T extends RevenueRecoveryDeleteArgs>(args: SelectSubset<T, RevenueRecoveryDeleteArgs<ExtArgs>>): Prisma__RevenueRecoveryClient<$Result.GetResult<Prisma.$RevenueRecoveryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RevenueRecovery.
     * @param {RevenueRecoveryUpdateArgs} args - Arguments to update one RevenueRecovery.
     * @example
     * // Update one RevenueRecovery
     * const revenueRecovery = await prisma.revenueRecovery.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RevenueRecoveryUpdateArgs>(args: SelectSubset<T, RevenueRecoveryUpdateArgs<ExtArgs>>): Prisma__RevenueRecoveryClient<$Result.GetResult<Prisma.$RevenueRecoveryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RevenueRecoveries.
     * @param {RevenueRecoveryDeleteManyArgs} args - Arguments to filter RevenueRecoveries to delete.
     * @example
     * // Delete a few RevenueRecoveries
     * const { count } = await prisma.revenueRecovery.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RevenueRecoveryDeleteManyArgs>(args?: SelectSubset<T, RevenueRecoveryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RevenueRecoveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueRecoveryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RevenueRecoveries
     * const revenueRecovery = await prisma.revenueRecovery.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RevenueRecoveryUpdateManyArgs>(args: SelectSubset<T, RevenueRecoveryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RevenueRecovery.
     * @param {RevenueRecoveryUpsertArgs} args - Arguments to update or create a RevenueRecovery.
     * @example
     * // Update or create a RevenueRecovery
     * const revenueRecovery = await prisma.revenueRecovery.upsert({
     *   create: {
     *     // ... data to create a RevenueRecovery
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RevenueRecovery we want to update
     *   }
     * })
     */
    upsert<T extends RevenueRecoveryUpsertArgs>(args: SelectSubset<T, RevenueRecoveryUpsertArgs<ExtArgs>>): Prisma__RevenueRecoveryClient<$Result.GetResult<Prisma.$RevenueRecoveryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RevenueRecoveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueRecoveryCountArgs} args - Arguments to filter RevenueRecoveries to count.
     * @example
     * // Count the number of RevenueRecoveries
     * const count = await prisma.revenueRecovery.count({
     *   where: {
     *     // ... the filter for the RevenueRecoveries we want to count
     *   }
     * })
    **/
    count<T extends RevenueRecoveryCountArgs>(
      args?: Subset<T, RevenueRecoveryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RevenueRecoveryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RevenueRecovery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueRecoveryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RevenueRecoveryAggregateArgs>(args: Subset<T, RevenueRecoveryAggregateArgs>): Prisma.PrismaPromise<GetRevenueRecoveryAggregateType<T>>

    /**
     * Group by RevenueRecovery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueRecoveryGroupByArgs} args - Group by arguments.
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
      T extends RevenueRecoveryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RevenueRecoveryGroupByArgs['orderBy'] }
        : { orderBy?: RevenueRecoveryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RevenueRecoveryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRevenueRecoveryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RevenueRecovery model
   */
  readonly fields: RevenueRecoveryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RevenueRecovery.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RevenueRecoveryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the RevenueRecovery model
   */ 
  interface RevenueRecoveryFieldRefs {
    readonly id: FieldRef<"RevenueRecovery", 'String'>
    readonly periodStart: FieldRef<"RevenueRecovery", 'DateTime'>
    readonly periodEnd: FieldRef<"RevenueRecovery", 'DateTime'>
    readonly totalDenials: FieldRef<"RevenueRecovery", 'Int'>
    readonly totalDeniedAmount: FieldRef<"RevenueRecovery", 'Decimal'>
    readonly totalAppeals: FieldRef<"RevenueRecovery", 'Int'>
    readonly successfulAppeals: FieldRef<"RevenueRecovery", 'Int'>
    readonly totalRecovered: FieldRef<"RevenueRecovery", 'Decimal'>
    readonly totalWrittenOff: FieldRef<"RevenueRecovery", 'Decimal'>
    readonly recoveryRate: FieldRef<"RevenueRecovery", 'Float'>
    readonly recoveryByCategory: FieldRef<"RevenueRecovery", 'Json'>
    readonly recoveryByPayer: FieldRef<"RevenueRecovery", 'Json'>
    readonly weeklyBreakdown: FieldRef<"RevenueRecovery", 'Json'>
    readonly createdAt: FieldRef<"RevenueRecovery", 'DateTime'>
    readonly updatedAt: FieldRef<"RevenueRecovery", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RevenueRecovery findUnique
   */
  export type RevenueRecoveryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueRecovery
     */
    select?: RevenueRecoverySelect<ExtArgs> | null
    /**
     * Filter, which RevenueRecovery to fetch.
     */
    where: RevenueRecoveryWhereUniqueInput
  }

  /**
   * RevenueRecovery findUniqueOrThrow
   */
  export type RevenueRecoveryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueRecovery
     */
    select?: RevenueRecoverySelect<ExtArgs> | null
    /**
     * Filter, which RevenueRecovery to fetch.
     */
    where: RevenueRecoveryWhereUniqueInput
  }

  /**
   * RevenueRecovery findFirst
   */
  export type RevenueRecoveryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueRecovery
     */
    select?: RevenueRecoverySelect<ExtArgs> | null
    /**
     * Filter, which RevenueRecovery to fetch.
     */
    where?: RevenueRecoveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevenueRecoveries to fetch.
     */
    orderBy?: RevenueRecoveryOrderByWithRelationInput | RevenueRecoveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RevenueRecoveries.
     */
    cursor?: RevenueRecoveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevenueRecoveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevenueRecoveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RevenueRecoveries.
     */
    distinct?: RevenueRecoveryScalarFieldEnum | RevenueRecoveryScalarFieldEnum[]
  }

  /**
   * RevenueRecovery findFirstOrThrow
   */
  export type RevenueRecoveryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueRecovery
     */
    select?: RevenueRecoverySelect<ExtArgs> | null
    /**
     * Filter, which RevenueRecovery to fetch.
     */
    where?: RevenueRecoveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevenueRecoveries to fetch.
     */
    orderBy?: RevenueRecoveryOrderByWithRelationInput | RevenueRecoveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RevenueRecoveries.
     */
    cursor?: RevenueRecoveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevenueRecoveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevenueRecoveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RevenueRecoveries.
     */
    distinct?: RevenueRecoveryScalarFieldEnum | RevenueRecoveryScalarFieldEnum[]
  }

  /**
   * RevenueRecovery findMany
   */
  export type RevenueRecoveryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueRecovery
     */
    select?: RevenueRecoverySelect<ExtArgs> | null
    /**
     * Filter, which RevenueRecoveries to fetch.
     */
    where?: RevenueRecoveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevenueRecoveries to fetch.
     */
    orderBy?: RevenueRecoveryOrderByWithRelationInput | RevenueRecoveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RevenueRecoveries.
     */
    cursor?: RevenueRecoveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevenueRecoveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevenueRecoveries.
     */
    skip?: number
    distinct?: RevenueRecoveryScalarFieldEnum | RevenueRecoveryScalarFieldEnum[]
  }

  /**
   * RevenueRecovery create
   */
  export type RevenueRecoveryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueRecovery
     */
    select?: RevenueRecoverySelect<ExtArgs> | null
    /**
     * The data needed to create a RevenueRecovery.
     */
    data: XOR<RevenueRecoveryCreateInput, RevenueRecoveryUncheckedCreateInput>
  }

  /**
   * RevenueRecovery createMany
   */
  export type RevenueRecoveryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RevenueRecoveries.
     */
    data: RevenueRecoveryCreateManyInput | RevenueRecoveryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RevenueRecovery createManyAndReturn
   */
  export type RevenueRecoveryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueRecovery
     */
    select?: RevenueRecoverySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RevenueRecoveries.
     */
    data: RevenueRecoveryCreateManyInput | RevenueRecoveryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RevenueRecovery update
   */
  export type RevenueRecoveryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueRecovery
     */
    select?: RevenueRecoverySelect<ExtArgs> | null
    /**
     * The data needed to update a RevenueRecovery.
     */
    data: XOR<RevenueRecoveryUpdateInput, RevenueRecoveryUncheckedUpdateInput>
    /**
     * Choose, which RevenueRecovery to update.
     */
    where: RevenueRecoveryWhereUniqueInput
  }

  /**
   * RevenueRecovery updateMany
   */
  export type RevenueRecoveryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RevenueRecoveries.
     */
    data: XOR<RevenueRecoveryUpdateManyMutationInput, RevenueRecoveryUncheckedUpdateManyInput>
    /**
     * Filter which RevenueRecoveries to update
     */
    where?: RevenueRecoveryWhereInput
  }

  /**
   * RevenueRecovery upsert
   */
  export type RevenueRecoveryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueRecovery
     */
    select?: RevenueRecoverySelect<ExtArgs> | null
    /**
     * The filter to search for the RevenueRecovery to update in case it exists.
     */
    where: RevenueRecoveryWhereUniqueInput
    /**
     * In case the RevenueRecovery found by the `where` argument doesn't exist, create a new RevenueRecovery with this data.
     */
    create: XOR<RevenueRecoveryCreateInput, RevenueRecoveryUncheckedCreateInput>
    /**
     * In case the RevenueRecovery was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RevenueRecoveryUpdateInput, RevenueRecoveryUncheckedUpdateInput>
  }

  /**
   * RevenueRecovery delete
   */
  export type RevenueRecoveryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueRecovery
     */
    select?: RevenueRecoverySelect<ExtArgs> | null
    /**
     * Filter which RevenueRecovery to delete.
     */
    where: RevenueRecoveryWhereUniqueInput
  }

  /**
   * RevenueRecovery deleteMany
   */
  export type RevenueRecoveryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RevenueRecoveries to delete
     */
    where?: RevenueRecoveryWhereInput
  }

  /**
   * RevenueRecovery without action
   */
  export type RevenueRecoveryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueRecovery
     */
    select?: RevenueRecoverySelect<ExtArgs> | null
  }


  /**
   * Model ClaimRiskAssessment
   */

  export type AggregateClaimRiskAssessment = {
    _count: ClaimRiskAssessmentCountAggregateOutputType | null
    _avg: ClaimRiskAssessmentAvgAggregateOutputType | null
    _sum: ClaimRiskAssessmentSumAggregateOutputType | null
    _min: ClaimRiskAssessmentMinAggregateOutputType | null
    _max: ClaimRiskAssessmentMaxAggregateOutputType | null
  }

  export type ClaimRiskAssessmentAvgAggregateOutputType = {
    billedAmount: Decimal | null
    overallRiskScore: number | null
  }

  export type ClaimRiskAssessmentSumAggregateOutputType = {
    billedAmount: Decimal | null
    overallRiskScore: number | null
  }

  export type ClaimRiskAssessmentMinAggregateOutputType = {
    id: string | null
    claimId: string | null
    patientId: string | null
    providerId: string | null
    payerId: string | null
    procedureCode: string | null
    billedAmount: Decimal | null
    overallRiskScore: number | null
    riskLevel: $Enums.RiskLevel | null
    assessmentDate: Date | null
    wasSubmitted: boolean | null
    wasModified: boolean | null
    actualOutcome: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClaimRiskAssessmentMaxAggregateOutputType = {
    id: string | null
    claimId: string | null
    patientId: string | null
    providerId: string | null
    payerId: string | null
    procedureCode: string | null
    billedAmount: Decimal | null
    overallRiskScore: number | null
    riskLevel: $Enums.RiskLevel | null
    assessmentDate: Date | null
    wasSubmitted: boolean | null
    wasModified: boolean | null
    actualOutcome: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClaimRiskAssessmentCountAggregateOutputType = {
    id: number
    claimId: number
    patientId: number
    providerId: number
    payerId: number
    procedureCode: number
    diagnosisCodes: number
    billedAmount: number
    overallRiskScore: number
    riskLevel: number
    riskFactors: number
    recommendations: number
    suggestedModifications: number
    assessmentDate: number
    wasSubmitted: number
    wasModified: number
    actualOutcome: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClaimRiskAssessmentAvgAggregateInputType = {
    billedAmount?: true
    overallRiskScore?: true
  }

  export type ClaimRiskAssessmentSumAggregateInputType = {
    billedAmount?: true
    overallRiskScore?: true
  }

  export type ClaimRiskAssessmentMinAggregateInputType = {
    id?: true
    claimId?: true
    patientId?: true
    providerId?: true
    payerId?: true
    procedureCode?: true
    billedAmount?: true
    overallRiskScore?: true
    riskLevel?: true
    assessmentDate?: true
    wasSubmitted?: true
    wasModified?: true
    actualOutcome?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClaimRiskAssessmentMaxAggregateInputType = {
    id?: true
    claimId?: true
    patientId?: true
    providerId?: true
    payerId?: true
    procedureCode?: true
    billedAmount?: true
    overallRiskScore?: true
    riskLevel?: true
    assessmentDate?: true
    wasSubmitted?: true
    wasModified?: true
    actualOutcome?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClaimRiskAssessmentCountAggregateInputType = {
    id?: true
    claimId?: true
    patientId?: true
    providerId?: true
    payerId?: true
    procedureCode?: true
    diagnosisCodes?: true
    billedAmount?: true
    overallRiskScore?: true
    riskLevel?: true
    riskFactors?: true
    recommendations?: true
    suggestedModifications?: true
    assessmentDate?: true
    wasSubmitted?: true
    wasModified?: true
    actualOutcome?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClaimRiskAssessmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClaimRiskAssessment to aggregate.
     */
    where?: ClaimRiskAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClaimRiskAssessments to fetch.
     */
    orderBy?: ClaimRiskAssessmentOrderByWithRelationInput | ClaimRiskAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClaimRiskAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClaimRiskAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClaimRiskAssessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClaimRiskAssessments
    **/
    _count?: true | ClaimRiskAssessmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClaimRiskAssessmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClaimRiskAssessmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClaimRiskAssessmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClaimRiskAssessmentMaxAggregateInputType
  }

  export type GetClaimRiskAssessmentAggregateType<T extends ClaimRiskAssessmentAggregateArgs> = {
        [P in keyof T & keyof AggregateClaimRiskAssessment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClaimRiskAssessment[P]>
      : GetScalarType<T[P], AggregateClaimRiskAssessment[P]>
  }




  export type ClaimRiskAssessmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClaimRiskAssessmentWhereInput
    orderBy?: ClaimRiskAssessmentOrderByWithAggregationInput | ClaimRiskAssessmentOrderByWithAggregationInput[]
    by: ClaimRiskAssessmentScalarFieldEnum[] | ClaimRiskAssessmentScalarFieldEnum
    having?: ClaimRiskAssessmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClaimRiskAssessmentCountAggregateInputType | true
    _avg?: ClaimRiskAssessmentAvgAggregateInputType
    _sum?: ClaimRiskAssessmentSumAggregateInputType
    _min?: ClaimRiskAssessmentMinAggregateInputType
    _max?: ClaimRiskAssessmentMaxAggregateInputType
  }

  export type ClaimRiskAssessmentGroupByOutputType = {
    id: string
    claimId: string
    patientId: string
    providerId: string
    payerId: string
    procedureCode: string
    diagnosisCodes: string[]
    billedAmount: Decimal
    overallRiskScore: number
    riskLevel: $Enums.RiskLevel
    riskFactors: JsonValue
    recommendations: string[]
    suggestedModifications: JsonValue | null
    assessmentDate: Date
    wasSubmitted: boolean
    wasModified: boolean
    actualOutcome: string | null
    createdAt: Date
    updatedAt: Date
    _count: ClaimRiskAssessmentCountAggregateOutputType | null
    _avg: ClaimRiskAssessmentAvgAggregateOutputType | null
    _sum: ClaimRiskAssessmentSumAggregateOutputType | null
    _min: ClaimRiskAssessmentMinAggregateOutputType | null
    _max: ClaimRiskAssessmentMaxAggregateOutputType | null
  }

  type GetClaimRiskAssessmentGroupByPayload<T extends ClaimRiskAssessmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClaimRiskAssessmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClaimRiskAssessmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClaimRiskAssessmentGroupByOutputType[P]>
            : GetScalarType<T[P], ClaimRiskAssessmentGroupByOutputType[P]>
        }
      >
    >


  export type ClaimRiskAssessmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    claimId?: boolean
    patientId?: boolean
    providerId?: boolean
    payerId?: boolean
    procedureCode?: boolean
    diagnosisCodes?: boolean
    billedAmount?: boolean
    overallRiskScore?: boolean
    riskLevel?: boolean
    riskFactors?: boolean
    recommendations?: boolean
    suggestedModifications?: boolean
    assessmentDate?: boolean
    wasSubmitted?: boolean
    wasModified?: boolean
    actualOutcome?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["claimRiskAssessment"]>

  export type ClaimRiskAssessmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    claimId?: boolean
    patientId?: boolean
    providerId?: boolean
    payerId?: boolean
    procedureCode?: boolean
    diagnosisCodes?: boolean
    billedAmount?: boolean
    overallRiskScore?: boolean
    riskLevel?: boolean
    riskFactors?: boolean
    recommendations?: boolean
    suggestedModifications?: boolean
    assessmentDate?: boolean
    wasSubmitted?: boolean
    wasModified?: boolean
    actualOutcome?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["claimRiskAssessment"]>

  export type ClaimRiskAssessmentSelectScalar = {
    id?: boolean
    claimId?: boolean
    patientId?: boolean
    providerId?: boolean
    payerId?: boolean
    procedureCode?: boolean
    diagnosisCodes?: boolean
    billedAmount?: boolean
    overallRiskScore?: boolean
    riskLevel?: boolean
    riskFactors?: boolean
    recommendations?: boolean
    suggestedModifications?: boolean
    assessmentDate?: boolean
    wasSubmitted?: boolean
    wasModified?: boolean
    actualOutcome?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $ClaimRiskAssessmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClaimRiskAssessment"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      claimId: string
      patientId: string
      providerId: string
      payerId: string
      procedureCode: string
      diagnosisCodes: string[]
      billedAmount: Prisma.Decimal
      overallRiskScore: number
      riskLevel: $Enums.RiskLevel
      riskFactors: Prisma.JsonValue
      recommendations: string[]
      suggestedModifications: Prisma.JsonValue | null
      assessmentDate: Date
      wasSubmitted: boolean
      wasModified: boolean
      actualOutcome: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["claimRiskAssessment"]>
    composites: {}
  }

  type ClaimRiskAssessmentGetPayload<S extends boolean | null | undefined | ClaimRiskAssessmentDefaultArgs> = $Result.GetResult<Prisma.$ClaimRiskAssessmentPayload, S>

  type ClaimRiskAssessmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClaimRiskAssessmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClaimRiskAssessmentCountAggregateInputType | true
    }

  export interface ClaimRiskAssessmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClaimRiskAssessment'], meta: { name: 'ClaimRiskAssessment' } }
    /**
     * Find zero or one ClaimRiskAssessment that matches the filter.
     * @param {ClaimRiskAssessmentFindUniqueArgs} args - Arguments to find a ClaimRiskAssessment
     * @example
     * // Get one ClaimRiskAssessment
     * const claimRiskAssessment = await prisma.claimRiskAssessment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClaimRiskAssessmentFindUniqueArgs>(args: SelectSubset<T, ClaimRiskAssessmentFindUniqueArgs<ExtArgs>>): Prisma__ClaimRiskAssessmentClient<$Result.GetResult<Prisma.$ClaimRiskAssessmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ClaimRiskAssessment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClaimRiskAssessmentFindUniqueOrThrowArgs} args - Arguments to find a ClaimRiskAssessment
     * @example
     * // Get one ClaimRiskAssessment
     * const claimRiskAssessment = await prisma.claimRiskAssessment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClaimRiskAssessmentFindUniqueOrThrowArgs>(args: SelectSubset<T, ClaimRiskAssessmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClaimRiskAssessmentClient<$Result.GetResult<Prisma.$ClaimRiskAssessmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ClaimRiskAssessment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimRiskAssessmentFindFirstArgs} args - Arguments to find a ClaimRiskAssessment
     * @example
     * // Get one ClaimRiskAssessment
     * const claimRiskAssessment = await prisma.claimRiskAssessment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClaimRiskAssessmentFindFirstArgs>(args?: SelectSubset<T, ClaimRiskAssessmentFindFirstArgs<ExtArgs>>): Prisma__ClaimRiskAssessmentClient<$Result.GetResult<Prisma.$ClaimRiskAssessmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ClaimRiskAssessment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimRiskAssessmentFindFirstOrThrowArgs} args - Arguments to find a ClaimRiskAssessment
     * @example
     * // Get one ClaimRiskAssessment
     * const claimRiskAssessment = await prisma.claimRiskAssessment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClaimRiskAssessmentFindFirstOrThrowArgs>(args?: SelectSubset<T, ClaimRiskAssessmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClaimRiskAssessmentClient<$Result.GetResult<Prisma.$ClaimRiskAssessmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ClaimRiskAssessments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimRiskAssessmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClaimRiskAssessments
     * const claimRiskAssessments = await prisma.claimRiskAssessment.findMany()
     * 
     * // Get first 10 ClaimRiskAssessments
     * const claimRiskAssessments = await prisma.claimRiskAssessment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const claimRiskAssessmentWithIdOnly = await prisma.claimRiskAssessment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClaimRiskAssessmentFindManyArgs>(args?: SelectSubset<T, ClaimRiskAssessmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClaimRiskAssessmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ClaimRiskAssessment.
     * @param {ClaimRiskAssessmentCreateArgs} args - Arguments to create a ClaimRiskAssessment.
     * @example
     * // Create one ClaimRiskAssessment
     * const ClaimRiskAssessment = await prisma.claimRiskAssessment.create({
     *   data: {
     *     // ... data to create a ClaimRiskAssessment
     *   }
     * })
     * 
     */
    create<T extends ClaimRiskAssessmentCreateArgs>(args: SelectSubset<T, ClaimRiskAssessmentCreateArgs<ExtArgs>>): Prisma__ClaimRiskAssessmentClient<$Result.GetResult<Prisma.$ClaimRiskAssessmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ClaimRiskAssessments.
     * @param {ClaimRiskAssessmentCreateManyArgs} args - Arguments to create many ClaimRiskAssessments.
     * @example
     * // Create many ClaimRiskAssessments
     * const claimRiskAssessment = await prisma.claimRiskAssessment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClaimRiskAssessmentCreateManyArgs>(args?: SelectSubset<T, ClaimRiskAssessmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClaimRiskAssessments and returns the data saved in the database.
     * @param {ClaimRiskAssessmentCreateManyAndReturnArgs} args - Arguments to create many ClaimRiskAssessments.
     * @example
     * // Create many ClaimRiskAssessments
     * const claimRiskAssessment = await prisma.claimRiskAssessment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClaimRiskAssessments and only return the `id`
     * const claimRiskAssessmentWithIdOnly = await prisma.claimRiskAssessment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClaimRiskAssessmentCreateManyAndReturnArgs>(args?: SelectSubset<T, ClaimRiskAssessmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClaimRiskAssessmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ClaimRiskAssessment.
     * @param {ClaimRiskAssessmentDeleteArgs} args - Arguments to delete one ClaimRiskAssessment.
     * @example
     * // Delete one ClaimRiskAssessment
     * const ClaimRiskAssessment = await prisma.claimRiskAssessment.delete({
     *   where: {
     *     // ... filter to delete one ClaimRiskAssessment
     *   }
     * })
     * 
     */
    delete<T extends ClaimRiskAssessmentDeleteArgs>(args: SelectSubset<T, ClaimRiskAssessmentDeleteArgs<ExtArgs>>): Prisma__ClaimRiskAssessmentClient<$Result.GetResult<Prisma.$ClaimRiskAssessmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ClaimRiskAssessment.
     * @param {ClaimRiskAssessmentUpdateArgs} args - Arguments to update one ClaimRiskAssessment.
     * @example
     * // Update one ClaimRiskAssessment
     * const claimRiskAssessment = await prisma.claimRiskAssessment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClaimRiskAssessmentUpdateArgs>(args: SelectSubset<T, ClaimRiskAssessmentUpdateArgs<ExtArgs>>): Prisma__ClaimRiskAssessmentClient<$Result.GetResult<Prisma.$ClaimRiskAssessmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ClaimRiskAssessments.
     * @param {ClaimRiskAssessmentDeleteManyArgs} args - Arguments to filter ClaimRiskAssessments to delete.
     * @example
     * // Delete a few ClaimRiskAssessments
     * const { count } = await prisma.claimRiskAssessment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClaimRiskAssessmentDeleteManyArgs>(args?: SelectSubset<T, ClaimRiskAssessmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClaimRiskAssessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimRiskAssessmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClaimRiskAssessments
     * const claimRiskAssessment = await prisma.claimRiskAssessment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClaimRiskAssessmentUpdateManyArgs>(args: SelectSubset<T, ClaimRiskAssessmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ClaimRiskAssessment.
     * @param {ClaimRiskAssessmentUpsertArgs} args - Arguments to update or create a ClaimRiskAssessment.
     * @example
     * // Update or create a ClaimRiskAssessment
     * const claimRiskAssessment = await prisma.claimRiskAssessment.upsert({
     *   create: {
     *     // ... data to create a ClaimRiskAssessment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClaimRiskAssessment we want to update
     *   }
     * })
     */
    upsert<T extends ClaimRiskAssessmentUpsertArgs>(args: SelectSubset<T, ClaimRiskAssessmentUpsertArgs<ExtArgs>>): Prisma__ClaimRiskAssessmentClient<$Result.GetResult<Prisma.$ClaimRiskAssessmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ClaimRiskAssessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimRiskAssessmentCountArgs} args - Arguments to filter ClaimRiskAssessments to count.
     * @example
     * // Count the number of ClaimRiskAssessments
     * const count = await prisma.claimRiskAssessment.count({
     *   where: {
     *     // ... the filter for the ClaimRiskAssessments we want to count
     *   }
     * })
    **/
    count<T extends ClaimRiskAssessmentCountArgs>(
      args?: Subset<T, ClaimRiskAssessmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClaimRiskAssessmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClaimRiskAssessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimRiskAssessmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClaimRiskAssessmentAggregateArgs>(args: Subset<T, ClaimRiskAssessmentAggregateArgs>): Prisma.PrismaPromise<GetClaimRiskAssessmentAggregateType<T>>

    /**
     * Group by ClaimRiskAssessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimRiskAssessmentGroupByArgs} args - Group by arguments.
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
      T extends ClaimRiskAssessmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClaimRiskAssessmentGroupByArgs['orderBy'] }
        : { orderBy?: ClaimRiskAssessmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ClaimRiskAssessmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClaimRiskAssessmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClaimRiskAssessment model
   */
  readonly fields: ClaimRiskAssessmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClaimRiskAssessment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClaimRiskAssessmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ClaimRiskAssessment model
   */ 
  interface ClaimRiskAssessmentFieldRefs {
    readonly id: FieldRef<"ClaimRiskAssessment", 'String'>
    readonly claimId: FieldRef<"ClaimRiskAssessment", 'String'>
    readonly patientId: FieldRef<"ClaimRiskAssessment", 'String'>
    readonly providerId: FieldRef<"ClaimRiskAssessment", 'String'>
    readonly payerId: FieldRef<"ClaimRiskAssessment", 'String'>
    readonly procedureCode: FieldRef<"ClaimRiskAssessment", 'String'>
    readonly diagnosisCodes: FieldRef<"ClaimRiskAssessment", 'String[]'>
    readonly billedAmount: FieldRef<"ClaimRiskAssessment", 'Decimal'>
    readonly overallRiskScore: FieldRef<"ClaimRiskAssessment", 'Float'>
    readonly riskLevel: FieldRef<"ClaimRiskAssessment", 'RiskLevel'>
    readonly riskFactors: FieldRef<"ClaimRiskAssessment", 'Json'>
    readonly recommendations: FieldRef<"ClaimRiskAssessment", 'String[]'>
    readonly suggestedModifications: FieldRef<"ClaimRiskAssessment", 'Json'>
    readonly assessmentDate: FieldRef<"ClaimRiskAssessment", 'DateTime'>
    readonly wasSubmitted: FieldRef<"ClaimRiskAssessment", 'Boolean'>
    readonly wasModified: FieldRef<"ClaimRiskAssessment", 'Boolean'>
    readonly actualOutcome: FieldRef<"ClaimRiskAssessment", 'String'>
    readonly createdAt: FieldRef<"ClaimRiskAssessment", 'DateTime'>
    readonly updatedAt: FieldRef<"ClaimRiskAssessment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClaimRiskAssessment findUnique
   */
  export type ClaimRiskAssessmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClaimRiskAssessment
     */
    select?: ClaimRiskAssessmentSelect<ExtArgs> | null
    /**
     * Filter, which ClaimRiskAssessment to fetch.
     */
    where: ClaimRiskAssessmentWhereUniqueInput
  }

  /**
   * ClaimRiskAssessment findUniqueOrThrow
   */
  export type ClaimRiskAssessmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClaimRiskAssessment
     */
    select?: ClaimRiskAssessmentSelect<ExtArgs> | null
    /**
     * Filter, which ClaimRiskAssessment to fetch.
     */
    where: ClaimRiskAssessmentWhereUniqueInput
  }

  /**
   * ClaimRiskAssessment findFirst
   */
  export type ClaimRiskAssessmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClaimRiskAssessment
     */
    select?: ClaimRiskAssessmentSelect<ExtArgs> | null
    /**
     * Filter, which ClaimRiskAssessment to fetch.
     */
    where?: ClaimRiskAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClaimRiskAssessments to fetch.
     */
    orderBy?: ClaimRiskAssessmentOrderByWithRelationInput | ClaimRiskAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClaimRiskAssessments.
     */
    cursor?: ClaimRiskAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClaimRiskAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClaimRiskAssessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClaimRiskAssessments.
     */
    distinct?: ClaimRiskAssessmentScalarFieldEnum | ClaimRiskAssessmentScalarFieldEnum[]
  }

  /**
   * ClaimRiskAssessment findFirstOrThrow
   */
  export type ClaimRiskAssessmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClaimRiskAssessment
     */
    select?: ClaimRiskAssessmentSelect<ExtArgs> | null
    /**
     * Filter, which ClaimRiskAssessment to fetch.
     */
    where?: ClaimRiskAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClaimRiskAssessments to fetch.
     */
    orderBy?: ClaimRiskAssessmentOrderByWithRelationInput | ClaimRiskAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClaimRiskAssessments.
     */
    cursor?: ClaimRiskAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClaimRiskAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClaimRiskAssessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClaimRiskAssessments.
     */
    distinct?: ClaimRiskAssessmentScalarFieldEnum | ClaimRiskAssessmentScalarFieldEnum[]
  }

  /**
   * ClaimRiskAssessment findMany
   */
  export type ClaimRiskAssessmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClaimRiskAssessment
     */
    select?: ClaimRiskAssessmentSelect<ExtArgs> | null
    /**
     * Filter, which ClaimRiskAssessments to fetch.
     */
    where?: ClaimRiskAssessmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClaimRiskAssessments to fetch.
     */
    orderBy?: ClaimRiskAssessmentOrderByWithRelationInput | ClaimRiskAssessmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClaimRiskAssessments.
     */
    cursor?: ClaimRiskAssessmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClaimRiskAssessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClaimRiskAssessments.
     */
    skip?: number
    distinct?: ClaimRiskAssessmentScalarFieldEnum | ClaimRiskAssessmentScalarFieldEnum[]
  }

  /**
   * ClaimRiskAssessment create
   */
  export type ClaimRiskAssessmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClaimRiskAssessment
     */
    select?: ClaimRiskAssessmentSelect<ExtArgs> | null
    /**
     * The data needed to create a ClaimRiskAssessment.
     */
    data: XOR<ClaimRiskAssessmentCreateInput, ClaimRiskAssessmentUncheckedCreateInput>
  }

  /**
   * ClaimRiskAssessment createMany
   */
  export type ClaimRiskAssessmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClaimRiskAssessments.
     */
    data: ClaimRiskAssessmentCreateManyInput | ClaimRiskAssessmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClaimRiskAssessment createManyAndReturn
   */
  export type ClaimRiskAssessmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClaimRiskAssessment
     */
    select?: ClaimRiskAssessmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ClaimRiskAssessments.
     */
    data: ClaimRiskAssessmentCreateManyInput | ClaimRiskAssessmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClaimRiskAssessment update
   */
  export type ClaimRiskAssessmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClaimRiskAssessment
     */
    select?: ClaimRiskAssessmentSelect<ExtArgs> | null
    /**
     * The data needed to update a ClaimRiskAssessment.
     */
    data: XOR<ClaimRiskAssessmentUpdateInput, ClaimRiskAssessmentUncheckedUpdateInput>
    /**
     * Choose, which ClaimRiskAssessment to update.
     */
    where: ClaimRiskAssessmentWhereUniqueInput
  }

  /**
   * ClaimRiskAssessment updateMany
   */
  export type ClaimRiskAssessmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClaimRiskAssessments.
     */
    data: XOR<ClaimRiskAssessmentUpdateManyMutationInput, ClaimRiskAssessmentUncheckedUpdateManyInput>
    /**
     * Filter which ClaimRiskAssessments to update
     */
    where?: ClaimRiskAssessmentWhereInput
  }

  /**
   * ClaimRiskAssessment upsert
   */
  export type ClaimRiskAssessmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClaimRiskAssessment
     */
    select?: ClaimRiskAssessmentSelect<ExtArgs> | null
    /**
     * The filter to search for the ClaimRiskAssessment to update in case it exists.
     */
    where: ClaimRiskAssessmentWhereUniqueInput
    /**
     * In case the ClaimRiskAssessment found by the `where` argument doesn't exist, create a new ClaimRiskAssessment with this data.
     */
    create: XOR<ClaimRiskAssessmentCreateInput, ClaimRiskAssessmentUncheckedCreateInput>
    /**
     * In case the ClaimRiskAssessment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClaimRiskAssessmentUpdateInput, ClaimRiskAssessmentUncheckedUpdateInput>
  }

  /**
   * ClaimRiskAssessment delete
   */
  export type ClaimRiskAssessmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClaimRiskAssessment
     */
    select?: ClaimRiskAssessmentSelect<ExtArgs> | null
    /**
     * Filter which ClaimRiskAssessment to delete.
     */
    where: ClaimRiskAssessmentWhereUniqueInput
  }

  /**
   * ClaimRiskAssessment deleteMany
   */
  export type ClaimRiskAssessmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClaimRiskAssessments to delete
     */
    where?: ClaimRiskAssessmentWhereInput
  }

  /**
   * ClaimRiskAssessment without action
   */
  export type ClaimRiskAssessmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClaimRiskAssessment
     */
    select?: ClaimRiskAssessmentSelect<ExtArgs> | null
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


  export const DenialScalarFieldEnum: {
    id: 'id',
    claimId: 'claimId',
    patientId: 'patientId',
    providerId: 'providerId',
    payerId: 'payerId',
    payerName: 'payerName',
    claimStatus: 'claimStatus',
    denialDate: 'denialDate',
    serviceDate: 'serviceDate',
    billedAmount: 'billedAmount',
    allowedAmount: 'allowedAmount',
    paidAmount: 'paidAmount',
    patientResponsibility: 'patientResponsibility',
    carcCode: 'carcCode',
    carcDescription: 'carcDescription',
    rarcCodes: 'rarcCodes',
    groupCode: 'groupCode',
    procedureCode: 'procedureCode',
    procedureModifiers: 'procedureModifiers',
    diagnosisCodes: 'diagnosisCodes',
    placeOfService: 'placeOfService',
    x277StatusCode: 'x277StatusCode',
    x277StatusMessage: 'x277StatusMessage',
    predictedRecoverable: 'predictedRecoverable',
    recoveryProbability: 'recoveryProbability',
    riskFactors: 'riskFactors',
    denialCategory: 'denialCategory',
    rootCause: 'rootCause',
    recoveredAmount: 'recoveredAmount',
    writeOffAmount: 'writeOffAmount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DenialScalarFieldEnum = (typeof DenialScalarFieldEnum)[keyof typeof DenialScalarFieldEnum]


  export const AppealScalarFieldEnum: {
    id: 'id',
    denialId: 'denialId',
    appealLevel: 'appealLevel',
    appealType: 'appealType',
    status: 'status',
    payerAppealStrategy: 'payerAppealStrategy',
    appealLetterContent: 'appealLetterContent',
    appealLetterHtml: 'appealLetterHtml',
    supportingDocuments: 'supportingDocuments',
    filingDeadline: 'filingDeadline',
    submittedDate: 'submittedDate',
    responseDeadline: 'responseDeadline',
    responseDate: 'responseDate',
    outcome: 'outcome',
    outcomeReason: 'outcomeReason',
    adjustedAmount: 'adjustedAmount',
    assignedTo: 'assignedTo',
    assignedAt: 'assignedAt',
    completedBy: 'completedBy',
    completedAt: 'completedAt',
    processingTimeMinutes: 'processingTimeMinutes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AppealScalarFieldEnum = (typeof AppealScalarFieldEnum)[keyof typeof AppealScalarFieldEnum]


  export const DenialPatternScalarFieldEnum: {
    id: 'id',
    payerId: 'payerId',
    payerName: 'payerName',
    procedureCode: 'procedureCode',
    diagnosisCode: 'diagnosisCode',
    carcCode: 'carcCode',
    denialCategory: 'denialCategory',
    totalDenials: 'totalDenials',
    totalBilledAmount: 'totalBilledAmount',
    totalRecoveredAmount: 'totalRecoveredAmount',
    denialRate: 'denialRate',
    recoveryRate: 'recoveryRate',
    averageRecoveryTime: 'averageRecoveryTime',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    monthlyTrend: 'monthlyTrend',
    suggestedActions: 'suggestedActions',
    riskScore: 'riskScore',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DenialPatternScalarFieldEnum = (typeof DenialPatternScalarFieldEnum)[keyof typeof DenialPatternScalarFieldEnum]


  export const PayerConfigScalarFieldEnum: {
    id: 'id',
    payerId: 'payerId',
    payerName: 'payerName',
    firstLevelDeadlineDays: 'firstLevelDeadlineDays',
    secondLevelDeadlineDays: 'secondLevelDeadlineDays',
    externalReviewDeadlineDays: 'externalReviewDeadlineDays',
    requiresClinicalNotes: 'requiresClinicalNotes',
    requiresMedicalRecords: 'requiresMedicalRecords',
    requiresLetterOfMedicalNecessity: 'requiresLetterOfMedicalNecessity',
    acceptsElectronicAppeals: 'acceptsElectronicAppeals',
    appealAddress: 'appealAddress',
    appealFaxNumber: 'appealFaxNumber',
    appealEmail: 'appealEmail',
    appealPortalUrl: 'appealPortalUrl',
    preferredFormat: 'preferredFormat',
    specialInstructions: 'specialInstructions',
    firstLevelSuccessRate: 'firstLevelSuccessRate',
    secondLevelSuccessRate: 'secondLevelSuccessRate',
    externalReviewSuccessRate: 'externalReviewSuccessRate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PayerConfigScalarFieldEnum = (typeof PayerConfigScalarFieldEnum)[keyof typeof PayerConfigScalarFieldEnum]


  export const StaffProductivityScalarFieldEnum: {
    id: 'id',
    staffId: 'staffId',
    staffName: 'staffName',
    periodDate: 'periodDate',
    denialsReviewed: 'denialsReviewed',
    denialsAssigned: 'denialsAssigned',
    appealsCreated: 'appealsCreated',
    appealsSubmitted: 'appealsSubmitted',
    appealsOverturned: 'appealsOverturned',
    appealsUpheld: 'appealsUpheld',
    averageProcessingTime: 'averageProcessingTime',
    totalProcessingTime: 'totalProcessingTime',
    totalRecovered: 'totalRecovered',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StaffProductivityScalarFieldEnum = (typeof StaffProductivityScalarFieldEnum)[keyof typeof StaffProductivityScalarFieldEnum]


  export const RevenueRecoveryScalarFieldEnum: {
    id: 'id',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    totalDenials: 'totalDenials',
    totalDeniedAmount: 'totalDeniedAmount',
    totalAppeals: 'totalAppeals',
    successfulAppeals: 'successfulAppeals',
    totalRecovered: 'totalRecovered',
    totalWrittenOff: 'totalWrittenOff',
    recoveryRate: 'recoveryRate',
    recoveryByCategory: 'recoveryByCategory',
    recoveryByPayer: 'recoveryByPayer',
    weeklyBreakdown: 'weeklyBreakdown',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RevenueRecoveryScalarFieldEnum = (typeof RevenueRecoveryScalarFieldEnum)[keyof typeof RevenueRecoveryScalarFieldEnum]


  export const ClaimRiskAssessmentScalarFieldEnum: {
    id: 'id',
    claimId: 'claimId',
    patientId: 'patientId',
    providerId: 'providerId',
    payerId: 'payerId',
    procedureCode: 'procedureCode',
    diagnosisCodes: 'diagnosisCodes',
    billedAmount: 'billedAmount',
    overallRiskScore: 'overallRiskScore',
    riskLevel: 'riskLevel',
    riskFactors: 'riskFactors',
    recommendations: 'recommendations',
    suggestedModifications: 'suggestedModifications',
    assessmentDate: 'assessmentDate',
    wasSubmitted: 'wasSubmitted',
    wasModified: 'wasModified',
    actualOutcome: 'actualOutcome',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClaimRiskAssessmentScalarFieldEnum = (typeof ClaimRiskAssessmentScalarFieldEnum)[keyof typeof ClaimRiskAssessmentScalarFieldEnum]


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


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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
   * Reference to a field of type 'ClaimStatus'
   */
  export type EnumClaimStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClaimStatus'>
    


  /**
   * Reference to a field of type 'ClaimStatus[]'
   */
  export type ListEnumClaimStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClaimStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DenialCategory'
   */
  export type EnumDenialCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DenialCategory'>
    


  /**
   * Reference to a field of type 'DenialCategory[]'
   */
  export type ListEnumDenialCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DenialCategory[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'AppealType'
   */
  export type EnumAppealTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppealType'>
    


  /**
   * Reference to a field of type 'AppealType[]'
   */
  export type ListEnumAppealTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppealType[]'>
    


  /**
   * Reference to a field of type 'AppealStatus'
   */
  export type EnumAppealStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppealStatus'>
    


  /**
   * Reference to a field of type 'AppealStatus[]'
   */
  export type ListEnumAppealStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppealStatus[]'>
    


  /**
   * Reference to a field of type 'AppealOutcome'
   */
  export type EnumAppealOutcomeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppealOutcome'>
    


  /**
   * Reference to a field of type 'AppealOutcome[]'
   */
  export type ListEnumAppealOutcomeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppealOutcome[]'>
    


  /**
   * Reference to a field of type 'RiskLevel'
   */
  export type EnumRiskLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RiskLevel'>
    


  /**
   * Reference to a field of type 'RiskLevel[]'
   */
  export type ListEnumRiskLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RiskLevel[]'>
    
  /**
   * Deep Input Types
   */


  export type DenialWhereInput = {
    AND?: DenialWhereInput | DenialWhereInput[]
    OR?: DenialWhereInput[]
    NOT?: DenialWhereInput | DenialWhereInput[]
    id?: StringFilter<"Denial"> | string
    claimId?: StringFilter<"Denial"> | string
    patientId?: StringFilter<"Denial"> | string
    providerId?: StringFilter<"Denial"> | string
    payerId?: StringFilter<"Denial"> | string
    payerName?: StringFilter<"Denial"> | string
    claimStatus?: EnumClaimStatusFilter<"Denial"> | $Enums.ClaimStatus
    denialDate?: DateTimeFilter<"Denial"> | Date | string
    serviceDate?: DateTimeFilter<"Denial"> | Date | string
    billedAmount?: DecimalFilter<"Denial"> | Decimal | DecimalJsLike | number | string
    allowedAmount?: DecimalNullableFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    paidAmount?: DecimalNullableFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: DecimalNullableFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    carcCode?: StringFilter<"Denial"> | string
    carcDescription?: StringFilter<"Denial"> | string
    rarcCodes?: StringNullableListFilter<"Denial">
    groupCode?: StringFilter<"Denial"> | string
    procedureCode?: StringFilter<"Denial"> | string
    procedureModifiers?: StringNullableListFilter<"Denial">
    diagnosisCodes?: StringNullableListFilter<"Denial">
    placeOfService?: StringNullableFilter<"Denial"> | string | null
    x277StatusCode?: StringNullableFilter<"Denial"> | string | null
    x277StatusMessage?: StringNullableFilter<"Denial"> | string | null
    predictedRecoverable?: BoolFilter<"Denial"> | boolean
    recoveryProbability?: FloatNullableFilter<"Denial"> | number | null
    riskFactors?: JsonNullableFilter<"Denial">
    denialCategory?: EnumDenialCategoryFilter<"Denial"> | $Enums.DenialCategory
    rootCause?: StringNullableFilter<"Denial"> | string | null
    recoveredAmount?: DecimalNullableFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: DecimalNullableFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"Denial"> | Date | string
    updatedAt?: DateTimeFilter<"Denial"> | Date | string
    appeals?: AppealListRelationFilter
  }

  export type DenialOrderByWithRelationInput = {
    id?: SortOrder
    claimId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    claimStatus?: SortOrder
    denialDate?: SortOrder
    serviceDate?: SortOrder
    billedAmount?: SortOrder
    allowedAmount?: SortOrderInput | SortOrder
    paidAmount?: SortOrderInput | SortOrder
    patientResponsibility?: SortOrderInput | SortOrder
    carcCode?: SortOrder
    carcDescription?: SortOrder
    rarcCodes?: SortOrder
    groupCode?: SortOrder
    procedureCode?: SortOrder
    procedureModifiers?: SortOrder
    diagnosisCodes?: SortOrder
    placeOfService?: SortOrderInput | SortOrder
    x277StatusCode?: SortOrderInput | SortOrder
    x277StatusMessage?: SortOrderInput | SortOrder
    predictedRecoverable?: SortOrder
    recoveryProbability?: SortOrderInput | SortOrder
    riskFactors?: SortOrderInput | SortOrder
    denialCategory?: SortOrder
    rootCause?: SortOrderInput | SortOrder
    recoveredAmount?: SortOrderInput | SortOrder
    writeOffAmount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appeals?: AppealOrderByRelationAggregateInput
  }

  export type DenialWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DenialWhereInput | DenialWhereInput[]
    OR?: DenialWhereInput[]
    NOT?: DenialWhereInput | DenialWhereInput[]
    claimId?: StringFilter<"Denial"> | string
    patientId?: StringFilter<"Denial"> | string
    providerId?: StringFilter<"Denial"> | string
    payerId?: StringFilter<"Denial"> | string
    payerName?: StringFilter<"Denial"> | string
    claimStatus?: EnumClaimStatusFilter<"Denial"> | $Enums.ClaimStatus
    denialDate?: DateTimeFilter<"Denial"> | Date | string
    serviceDate?: DateTimeFilter<"Denial"> | Date | string
    billedAmount?: DecimalFilter<"Denial"> | Decimal | DecimalJsLike | number | string
    allowedAmount?: DecimalNullableFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    paidAmount?: DecimalNullableFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: DecimalNullableFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    carcCode?: StringFilter<"Denial"> | string
    carcDescription?: StringFilter<"Denial"> | string
    rarcCodes?: StringNullableListFilter<"Denial">
    groupCode?: StringFilter<"Denial"> | string
    procedureCode?: StringFilter<"Denial"> | string
    procedureModifiers?: StringNullableListFilter<"Denial">
    diagnosisCodes?: StringNullableListFilter<"Denial">
    placeOfService?: StringNullableFilter<"Denial"> | string | null
    x277StatusCode?: StringNullableFilter<"Denial"> | string | null
    x277StatusMessage?: StringNullableFilter<"Denial"> | string | null
    predictedRecoverable?: BoolFilter<"Denial"> | boolean
    recoveryProbability?: FloatNullableFilter<"Denial"> | number | null
    riskFactors?: JsonNullableFilter<"Denial">
    denialCategory?: EnumDenialCategoryFilter<"Denial"> | $Enums.DenialCategory
    rootCause?: StringNullableFilter<"Denial"> | string | null
    recoveredAmount?: DecimalNullableFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: DecimalNullableFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"Denial"> | Date | string
    updatedAt?: DateTimeFilter<"Denial"> | Date | string
    appeals?: AppealListRelationFilter
  }, "id">

  export type DenialOrderByWithAggregationInput = {
    id?: SortOrder
    claimId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    claimStatus?: SortOrder
    denialDate?: SortOrder
    serviceDate?: SortOrder
    billedAmount?: SortOrder
    allowedAmount?: SortOrderInput | SortOrder
    paidAmount?: SortOrderInput | SortOrder
    patientResponsibility?: SortOrderInput | SortOrder
    carcCode?: SortOrder
    carcDescription?: SortOrder
    rarcCodes?: SortOrder
    groupCode?: SortOrder
    procedureCode?: SortOrder
    procedureModifiers?: SortOrder
    diagnosisCodes?: SortOrder
    placeOfService?: SortOrderInput | SortOrder
    x277StatusCode?: SortOrderInput | SortOrder
    x277StatusMessage?: SortOrderInput | SortOrder
    predictedRecoverable?: SortOrder
    recoveryProbability?: SortOrderInput | SortOrder
    riskFactors?: SortOrderInput | SortOrder
    denialCategory?: SortOrder
    rootCause?: SortOrderInput | SortOrder
    recoveredAmount?: SortOrderInput | SortOrder
    writeOffAmount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DenialCountOrderByAggregateInput
    _avg?: DenialAvgOrderByAggregateInput
    _max?: DenialMaxOrderByAggregateInput
    _min?: DenialMinOrderByAggregateInput
    _sum?: DenialSumOrderByAggregateInput
  }

  export type DenialScalarWhereWithAggregatesInput = {
    AND?: DenialScalarWhereWithAggregatesInput | DenialScalarWhereWithAggregatesInput[]
    OR?: DenialScalarWhereWithAggregatesInput[]
    NOT?: DenialScalarWhereWithAggregatesInput | DenialScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Denial"> | string
    claimId?: StringWithAggregatesFilter<"Denial"> | string
    patientId?: StringWithAggregatesFilter<"Denial"> | string
    providerId?: StringWithAggregatesFilter<"Denial"> | string
    payerId?: StringWithAggregatesFilter<"Denial"> | string
    payerName?: StringWithAggregatesFilter<"Denial"> | string
    claimStatus?: EnumClaimStatusWithAggregatesFilter<"Denial"> | $Enums.ClaimStatus
    denialDate?: DateTimeWithAggregatesFilter<"Denial"> | Date | string
    serviceDate?: DateTimeWithAggregatesFilter<"Denial"> | Date | string
    billedAmount?: DecimalWithAggregatesFilter<"Denial"> | Decimal | DecimalJsLike | number | string
    allowedAmount?: DecimalNullableWithAggregatesFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    paidAmount?: DecimalNullableWithAggregatesFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: DecimalNullableWithAggregatesFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    carcCode?: StringWithAggregatesFilter<"Denial"> | string
    carcDescription?: StringWithAggregatesFilter<"Denial"> | string
    rarcCodes?: StringNullableListFilter<"Denial">
    groupCode?: StringWithAggregatesFilter<"Denial"> | string
    procedureCode?: StringWithAggregatesFilter<"Denial"> | string
    procedureModifiers?: StringNullableListFilter<"Denial">
    diagnosisCodes?: StringNullableListFilter<"Denial">
    placeOfService?: StringNullableWithAggregatesFilter<"Denial"> | string | null
    x277StatusCode?: StringNullableWithAggregatesFilter<"Denial"> | string | null
    x277StatusMessage?: StringNullableWithAggregatesFilter<"Denial"> | string | null
    predictedRecoverable?: BoolWithAggregatesFilter<"Denial"> | boolean
    recoveryProbability?: FloatNullableWithAggregatesFilter<"Denial"> | number | null
    riskFactors?: JsonNullableWithAggregatesFilter<"Denial">
    denialCategory?: EnumDenialCategoryWithAggregatesFilter<"Denial"> | $Enums.DenialCategory
    rootCause?: StringNullableWithAggregatesFilter<"Denial"> | string | null
    recoveredAmount?: DecimalNullableWithAggregatesFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: DecimalNullableWithAggregatesFilter<"Denial"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Denial"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Denial"> | Date | string
  }

  export type AppealWhereInput = {
    AND?: AppealWhereInput | AppealWhereInput[]
    OR?: AppealWhereInput[]
    NOT?: AppealWhereInput | AppealWhereInput[]
    id?: StringFilter<"Appeal"> | string
    denialId?: StringFilter<"Appeal"> | string
    appealLevel?: IntFilter<"Appeal"> | number
    appealType?: EnumAppealTypeFilter<"Appeal"> | $Enums.AppealType
    status?: EnumAppealStatusFilter<"Appeal"> | $Enums.AppealStatus
    payerAppealStrategy?: JsonNullableFilter<"Appeal">
    appealLetterContent?: StringNullableFilter<"Appeal"> | string | null
    appealLetterHtml?: StringNullableFilter<"Appeal"> | string | null
    supportingDocuments?: StringNullableListFilter<"Appeal">
    filingDeadline?: DateTimeFilter<"Appeal"> | Date | string
    submittedDate?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    responseDeadline?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    responseDate?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    outcome?: EnumAppealOutcomeNullableFilter<"Appeal"> | $Enums.AppealOutcome | null
    outcomeReason?: StringNullableFilter<"Appeal"> | string | null
    adjustedAmount?: DecimalNullableFilter<"Appeal"> | Decimal | DecimalJsLike | number | string | null
    assignedTo?: StringNullableFilter<"Appeal"> | string | null
    assignedAt?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    completedBy?: StringNullableFilter<"Appeal"> | string | null
    completedAt?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    processingTimeMinutes?: IntNullableFilter<"Appeal"> | number | null
    createdAt?: DateTimeFilter<"Appeal"> | Date | string
    updatedAt?: DateTimeFilter<"Appeal"> | Date | string
    denial?: XOR<DenialRelationFilter, DenialWhereInput>
  }

  export type AppealOrderByWithRelationInput = {
    id?: SortOrder
    denialId?: SortOrder
    appealLevel?: SortOrder
    appealType?: SortOrder
    status?: SortOrder
    payerAppealStrategy?: SortOrderInput | SortOrder
    appealLetterContent?: SortOrderInput | SortOrder
    appealLetterHtml?: SortOrderInput | SortOrder
    supportingDocuments?: SortOrder
    filingDeadline?: SortOrder
    submittedDate?: SortOrderInput | SortOrder
    responseDeadline?: SortOrderInput | SortOrder
    responseDate?: SortOrderInput | SortOrder
    outcome?: SortOrderInput | SortOrder
    outcomeReason?: SortOrderInput | SortOrder
    adjustedAmount?: SortOrderInput | SortOrder
    assignedTo?: SortOrderInput | SortOrder
    assignedAt?: SortOrderInput | SortOrder
    completedBy?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    processingTimeMinutes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    denial?: DenialOrderByWithRelationInput
  }

  export type AppealWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AppealWhereInput | AppealWhereInput[]
    OR?: AppealWhereInput[]
    NOT?: AppealWhereInput | AppealWhereInput[]
    denialId?: StringFilter<"Appeal"> | string
    appealLevel?: IntFilter<"Appeal"> | number
    appealType?: EnumAppealTypeFilter<"Appeal"> | $Enums.AppealType
    status?: EnumAppealStatusFilter<"Appeal"> | $Enums.AppealStatus
    payerAppealStrategy?: JsonNullableFilter<"Appeal">
    appealLetterContent?: StringNullableFilter<"Appeal"> | string | null
    appealLetterHtml?: StringNullableFilter<"Appeal"> | string | null
    supportingDocuments?: StringNullableListFilter<"Appeal">
    filingDeadline?: DateTimeFilter<"Appeal"> | Date | string
    submittedDate?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    responseDeadline?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    responseDate?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    outcome?: EnumAppealOutcomeNullableFilter<"Appeal"> | $Enums.AppealOutcome | null
    outcomeReason?: StringNullableFilter<"Appeal"> | string | null
    adjustedAmount?: DecimalNullableFilter<"Appeal"> | Decimal | DecimalJsLike | number | string | null
    assignedTo?: StringNullableFilter<"Appeal"> | string | null
    assignedAt?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    completedBy?: StringNullableFilter<"Appeal"> | string | null
    completedAt?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    processingTimeMinutes?: IntNullableFilter<"Appeal"> | number | null
    createdAt?: DateTimeFilter<"Appeal"> | Date | string
    updatedAt?: DateTimeFilter<"Appeal"> | Date | string
    denial?: XOR<DenialRelationFilter, DenialWhereInput>
  }, "id">

  export type AppealOrderByWithAggregationInput = {
    id?: SortOrder
    denialId?: SortOrder
    appealLevel?: SortOrder
    appealType?: SortOrder
    status?: SortOrder
    payerAppealStrategy?: SortOrderInput | SortOrder
    appealLetterContent?: SortOrderInput | SortOrder
    appealLetterHtml?: SortOrderInput | SortOrder
    supportingDocuments?: SortOrder
    filingDeadline?: SortOrder
    submittedDate?: SortOrderInput | SortOrder
    responseDeadline?: SortOrderInput | SortOrder
    responseDate?: SortOrderInput | SortOrder
    outcome?: SortOrderInput | SortOrder
    outcomeReason?: SortOrderInput | SortOrder
    adjustedAmount?: SortOrderInput | SortOrder
    assignedTo?: SortOrderInput | SortOrder
    assignedAt?: SortOrderInput | SortOrder
    completedBy?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    processingTimeMinutes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AppealCountOrderByAggregateInput
    _avg?: AppealAvgOrderByAggregateInput
    _max?: AppealMaxOrderByAggregateInput
    _min?: AppealMinOrderByAggregateInput
    _sum?: AppealSumOrderByAggregateInput
  }

  export type AppealScalarWhereWithAggregatesInput = {
    AND?: AppealScalarWhereWithAggregatesInput | AppealScalarWhereWithAggregatesInput[]
    OR?: AppealScalarWhereWithAggregatesInput[]
    NOT?: AppealScalarWhereWithAggregatesInput | AppealScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Appeal"> | string
    denialId?: StringWithAggregatesFilter<"Appeal"> | string
    appealLevel?: IntWithAggregatesFilter<"Appeal"> | number
    appealType?: EnumAppealTypeWithAggregatesFilter<"Appeal"> | $Enums.AppealType
    status?: EnumAppealStatusWithAggregatesFilter<"Appeal"> | $Enums.AppealStatus
    payerAppealStrategy?: JsonNullableWithAggregatesFilter<"Appeal">
    appealLetterContent?: StringNullableWithAggregatesFilter<"Appeal"> | string | null
    appealLetterHtml?: StringNullableWithAggregatesFilter<"Appeal"> | string | null
    supportingDocuments?: StringNullableListFilter<"Appeal">
    filingDeadline?: DateTimeWithAggregatesFilter<"Appeal"> | Date | string
    submittedDate?: DateTimeNullableWithAggregatesFilter<"Appeal"> | Date | string | null
    responseDeadline?: DateTimeNullableWithAggregatesFilter<"Appeal"> | Date | string | null
    responseDate?: DateTimeNullableWithAggregatesFilter<"Appeal"> | Date | string | null
    outcome?: EnumAppealOutcomeNullableWithAggregatesFilter<"Appeal"> | $Enums.AppealOutcome | null
    outcomeReason?: StringNullableWithAggregatesFilter<"Appeal"> | string | null
    adjustedAmount?: DecimalNullableWithAggregatesFilter<"Appeal"> | Decimal | DecimalJsLike | number | string | null
    assignedTo?: StringNullableWithAggregatesFilter<"Appeal"> | string | null
    assignedAt?: DateTimeNullableWithAggregatesFilter<"Appeal"> | Date | string | null
    completedBy?: StringNullableWithAggregatesFilter<"Appeal"> | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"Appeal"> | Date | string | null
    processingTimeMinutes?: IntNullableWithAggregatesFilter<"Appeal"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Appeal"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Appeal"> | Date | string
  }

  export type DenialPatternWhereInput = {
    AND?: DenialPatternWhereInput | DenialPatternWhereInput[]
    OR?: DenialPatternWhereInput[]
    NOT?: DenialPatternWhereInput | DenialPatternWhereInput[]
    id?: StringFilter<"DenialPattern"> | string
    payerId?: StringFilter<"DenialPattern"> | string
    payerName?: StringFilter<"DenialPattern"> | string
    procedureCode?: StringNullableFilter<"DenialPattern"> | string | null
    diagnosisCode?: StringNullableFilter<"DenialPattern"> | string | null
    carcCode?: StringNullableFilter<"DenialPattern"> | string | null
    denialCategory?: EnumDenialCategoryNullableFilter<"DenialPattern"> | $Enums.DenialCategory | null
    totalDenials?: IntFilter<"DenialPattern"> | number
    totalBilledAmount?: DecimalFilter<"DenialPattern"> | Decimal | DecimalJsLike | number | string
    totalRecoveredAmount?: DecimalFilter<"DenialPattern"> | Decimal | DecimalJsLike | number | string
    denialRate?: FloatFilter<"DenialPattern"> | number
    recoveryRate?: FloatFilter<"DenialPattern"> | number
    averageRecoveryTime?: IntNullableFilter<"DenialPattern"> | number | null
    periodStart?: DateTimeFilter<"DenialPattern"> | Date | string
    periodEnd?: DateTimeFilter<"DenialPattern"> | Date | string
    monthlyTrend?: JsonNullableFilter<"DenialPattern">
    suggestedActions?: StringNullableListFilter<"DenialPattern">
    riskScore?: FloatNullableFilter<"DenialPattern"> | number | null
    createdAt?: DateTimeFilter<"DenialPattern"> | Date | string
    updatedAt?: DateTimeFilter<"DenialPattern"> | Date | string
  }

  export type DenialPatternOrderByWithRelationInput = {
    id?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    procedureCode?: SortOrderInput | SortOrder
    diagnosisCode?: SortOrderInput | SortOrder
    carcCode?: SortOrderInput | SortOrder
    denialCategory?: SortOrderInput | SortOrder
    totalDenials?: SortOrder
    totalBilledAmount?: SortOrder
    totalRecoveredAmount?: SortOrder
    denialRate?: SortOrder
    recoveryRate?: SortOrder
    averageRecoveryTime?: SortOrderInput | SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    monthlyTrend?: SortOrderInput | SortOrder
    suggestedActions?: SortOrder
    riskScore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DenialPatternWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    payerId_procedureCode_diagnosisCode_carcCode_periodStart_periodEnd?: DenialPatternPayerIdProcedureCodeDiagnosisCodeCarcCodePeriodStartPeriodEndCompoundUniqueInput
    AND?: DenialPatternWhereInput | DenialPatternWhereInput[]
    OR?: DenialPatternWhereInput[]
    NOT?: DenialPatternWhereInput | DenialPatternWhereInput[]
    payerId?: StringFilter<"DenialPattern"> | string
    payerName?: StringFilter<"DenialPattern"> | string
    procedureCode?: StringNullableFilter<"DenialPattern"> | string | null
    diagnosisCode?: StringNullableFilter<"DenialPattern"> | string | null
    carcCode?: StringNullableFilter<"DenialPattern"> | string | null
    denialCategory?: EnumDenialCategoryNullableFilter<"DenialPattern"> | $Enums.DenialCategory | null
    totalDenials?: IntFilter<"DenialPattern"> | number
    totalBilledAmount?: DecimalFilter<"DenialPattern"> | Decimal | DecimalJsLike | number | string
    totalRecoveredAmount?: DecimalFilter<"DenialPattern"> | Decimal | DecimalJsLike | number | string
    denialRate?: FloatFilter<"DenialPattern"> | number
    recoveryRate?: FloatFilter<"DenialPattern"> | number
    averageRecoveryTime?: IntNullableFilter<"DenialPattern"> | number | null
    periodStart?: DateTimeFilter<"DenialPattern"> | Date | string
    periodEnd?: DateTimeFilter<"DenialPattern"> | Date | string
    monthlyTrend?: JsonNullableFilter<"DenialPattern">
    suggestedActions?: StringNullableListFilter<"DenialPattern">
    riskScore?: FloatNullableFilter<"DenialPattern"> | number | null
    createdAt?: DateTimeFilter<"DenialPattern"> | Date | string
    updatedAt?: DateTimeFilter<"DenialPattern"> | Date | string
  }, "id" | "payerId_procedureCode_diagnosisCode_carcCode_periodStart_periodEnd">

  export type DenialPatternOrderByWithAggregationInput = {
    id?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    procedureCode?: SortOrderInput | SortOrder
    diagnosisCode?: SortOrderInput | SortOrder
    carcCode?: SortOrderInput | SortOrder
    denialCategory?: SortOrderInput | SortOrder
    totalDenials?: SortOrder
    totalBilledAmount?: SortOrder
    totalRecoveredAmount?: SortOrder
    denialRate?: SortOrder
    recoveryRate?: SortOrder
    averageRecoveryTime?: SortOrderInput | SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    monthlyTrend?: SortOrderInput | SortOrder
    suggestedActions?: SortOrder
    riskScore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DenialPatternCountOrderByAggregateInput
    _avg?: DenialPatternAvgOrderByAggregateInput
    _max?: DenialPatternMaxOrderByAggregateInput
    _min?: DenialPatternMinOrderByAggregateInput
    _sum?: DenialPatternSumOrderByAggregateInput
  }

  export type DenialPatternScalarWhereWithAggregatesInput = {
    AND?: DenialPatternScalarWhereWithAggregatesInput | DenialPatternScalarWhereWithAggregatesInput[]
    OR?: DenialPatternScalarWhereWithAggregatesInput[]
    NOT?: DenialPatternScalarWhereWithAggregatesInput | DenialPatternScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DenialPattern"> | string
    payerId?: StringWithAggregatesFilter<"DenialPattern"> | string
    payerName?: StringWithAggregatesFilter<"DenialPattern"> | string
    procedureCode?: StringNullableWithAggregatesFilter<"DenialPattern"> | string | null
    diagnosisCode?: StringNullableWithAggregatesFilter<"DenialPattern"> | string | null
    carcCode?: StringNullableWithAggregatesFilter<"DenialPattern"> | string | null
    denialCategory?: EnumDenialCategoryNullableWithAggregatesFilter<"DenialPattern"> | $Enums.DenialCategory | null
    totalDenials?: IntWithAggregatesFilter<"DenialPattern"> | number
    totalBilledAmount?: DecimalWithAggregatesFilter<"DenialPattern"> | Decimal | DecimalJsLike | number | string
    totalRecoveredAmount?: DecimalWithAggregatesFilter<"DenialPattern"> | Decimal | DecimalJsLike | number | string
    denialRate?: FloatWithAggregatesFilter<"DenialPattern"> | number
    recoveryRate?: FloatWithAggregatesFilter<"DenialPattern"> | number
    averageRecoveryTime?: IntNullableWithAggregatesFilter<"DenialPattern"> | number | null
    periodStart?: DateTimeWithAggregatesFilter<"DenialPattern"> | Date | string
    periodEnd?: DateTimeWithAggregatesFilter<"DenialPattern"> | Date | string
    monthlyTrend?: JsonNullableWithAggregatesFilter<"DenialPattern">
    suggestedActions?: StringNullableListFilter<"DenialPattern">
    riskScore?: FloatNullableWithAggregatesFilter<"DenialPattern"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"DenialPattern"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DenialPattern"> | Date | string
  }

  export type PayerConfigWhereInput = {
    AND?: PayerConfigWhereInput | PayerConfigWhereInput[]
    OR?: PayerConfigWhereInput[]
    NOT?: PayerConfigWhereInput | PayerConfigWhereInput[]
    id?: StringFilter<"PayerConfig"> | string
    payerId?: StringFilter<"PayerConfig"> | string
    payerName?: StringFilter<"PayerConfig"> | string
    firstLevelDeadlineDays?: IntFilter<"PayerConfig"> | number
    secondLevelDeadlineDays?: IntFilter<"PayerConfig"> | number
    externalReviewDeadlineDays?: IntFilter<"PayerConfig"> | number
    requiresClinicalNotes?: BoolFilter<"PayerConfig"> | boolean
    requiresMedicalRecords?: BoolFilter<"PayerConfig"> | boolean
    requiresLetterOfMedicalNecessity?: BoolFilter<"PayerConfig"> | boolean
    acceptsElectronicAppeals?: BoolFilter<"PayerConfig"> | boolean
    appealAddress?: JsonNullableFilter<"PayerConfig">
    appealFaxNumber?: StringNullableFilter<"PayerConfig"> | string | null
    appealEmail?: StringNullableFilter<"PayerConfig"> | string | null
    appealPortalUrl?: StringNullableFilter<"PayerConfig"> | string | null
    preferredFormat?: StringNullableFilter<"PayerConfig"> | string | null
    specialInstructions?: StringNullableFilter<"PayerConfig"> | string | null
    firstLevelSuccessRate?: FloatNullableFilter<"PayerConfig"> | number | null
    secondLevelSuccessRate?: FloatNullableFilter<"PayerConfig"> | number | null
    externalReviewSuccessRate?: FloatNullableFilter<"PayerConfig"> | number | null
    createdAt?: DateTimeFilter<"PayerConfig"> | Date | string
    updatedAt?: DateTimeFilter<"PayerConfig"> | Date | string
  }

  export type PayerConfigOrderByWithRelationInput = {
    id?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    firstLevelDeadlineDays?: SortOrder
    secondLevelDeadlineDays?: SortOrder
    externalReviewDeadlineDays?: SortOrder
    requiresClinicalNotes?: SortOrder
    requiresMedicalRecords?: SortOrder
    requiresLetterOfMedicalNecessity?: SortOrder
    acceptsElectronicAppeals?: SortOrder
    appealAddress?: SortOrderInput | SortOrder
    appealFaxNumber?: SortOrderInput | SortOrder
    appealEmail?: SortOrderInput | SortOrder
    appealPortalUrl?: SortOrderInput | SortOrder
    preferredFormat?: SortOrderInput | SortOrder
    specialInstructions?: SortOrderInput | SortOrder
    firstLevelSuccessRate?: SortOrderInput | SortOrder
    secondLevelSuccessRate?: SortOrderInput | SortOrder
    externalReviewSuccessRate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayerConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    payerId?: string
    AND?: PayerConfigWhereInput | PayerConfigWhereInput[]
    OR?: PayerConfigWhereInput[]
    NOT?: PayerConfigWhereInput | PayerConfigWhereInput[]
    payerName?: StringFilter<"PayerConfig"> | string
    firstLevelDeadlineDays?: IntFilter<"PayerConfig"> | number
    secondLevelDeadlineDays?: IntFilter<"PayerConfig"> | number
    externalReviewDeadlineDays?: IntFilter<"PayerConfig"> | number
    requiresClinicalNotes?: BoolFilter<"PayerConfig"> | boolean
    requiresMedicalRecords?: BoolFilter<"PayerConfig"> | boolean
    requiresLetterOfMedicalNecessity?: BoolFilter<"PayerConfig"> | boolean
    acceptsElectronicAppeals?: BoolFilter<"PayerConfig"> | boolean
    appealAddress?: JsonNullableFilter<"PayerConfig">
    appealFaxNumber?: StringNullableFilter<"PayerConfig"> | string | null
    appealEmail?: StringNullableFilter<"PayerConfig"> | string | null
    appealPortalUrl?: StringNullableFilter<"PayerConfig"> | string | null
    preferredFormat?: StringNullableFilter<"PayerConfig"> | string | null
    specialInstructions?: StringNullableFilter<"PayerConfig"> | string | null
    firstLevelSuccessRate?: FloatNullableFilter<"PayerConfig"> | number | null
    secondLevelSuccessRate?: FloatNullableFilter<"PayerConfig"> | number | null
    externalReviewSuccessRate?: FloatNullableFilter<"PayerConfig"> | number | null
    createdAt?: DateTimeFilter<"PayerConfig"> | Date | string
    updatedAt?: DateTimeFilter<"PayerConfig"> | Date | string
  }, "id" | "payerId">

  export type PayerConfigOrderByWithAggregationInput = {
    id?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    firstLevelDeadlineDays?: SortOrder
    secondLevelDeadlineDays?: SortOrder
    externalReviewDeadlineDays?: SortOrder
    requiresClinicalNotes?: SortOrder
    requiresMedicalRecords?: SortOrder
    requiresLetterOfMedicalNecessity?: SortOrder
    acceptsElectronicAppeals?: SortOrder
    appealAddress?: SortOrderInput | SortOrder
    appealFaxNumber?: SortOrderInput | SortOrder
    appealEmail?: SortOrderInput | SortOrder
    appealPortalUrl?: SortOrderInput | SortOrder
    preferredFormat?: SortOrderInput | SortOrder
    specialInstructions?: SortOrderInput | SortOrder
    firstLevelSuccessRate?: SortOrderInput | SortOrder
    secondLevelSuccessRate?: SortOrderInput | SortOrder
    externalReviewSuccessRate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PayerConfigCountOrderByAggregateInput
    _avg?: PayerConfigAvgOrderByAggregateInput
    _max?: PayerConfigMaxOrderByAggregateInput
    _min?: PayerConfigMinOrderByAggregateInput
    _sum?: PayerConfigSumOrderByAggregateInput
  }

  export type PayerConfigScalarWhereWithAggregatesInput = {
    AND?: PayerConfigScalarWhereWithAggregatesInput | PayerConfigScalarWhereWithAggregatesInput[]
    OR?: PayerConfigScalarWhereWithAggregatesInput[]
    NOT?: PayerConfigScalarWhereWithAggregatesInput | PayerConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayerConfig"> | string
    payerId?: StringWithAggregatesFilter<"PayerConfig"> | string
    payerName?: StringWithAggregatesFilter<"PayerConfig"> | string
    firstLevelDeadlineDays?: IntWithAggregatesFilter<"PayerConfig"> | number
    secondLevelDeadlineDays?: IntWithAggregatesFilter<"PayerConfig"> | number
    externalReviewDeadlineDays?: IntWithAggregatesFilter<"PayerConfig"> | number
    requiresClinicalNotes?: BoolWithAggregatesFilter<"PayerConfig"> | boolean
    requiresMedicalRecords?: BoolWithAggregatesFilter<"PayerConfig"> | boolean
    requiresLetterOfMedicalNecessity?: BoolWithAggregatesFilter<"PayerConfig"> | boolean
    acceptsElectronicAppeals?: BoolWithAggregatesFilter<"PayerConfig"> | boolean
    appealAddress?: JsonNullableWithAggregatesFilter<"PayerConfig">
    appealFaxNumber?: StringNullableWithAggregatesFilter<"PayerConfig"> | string | null
    appealEmail?: StringNullableWithAggregatesFilter<"PayerConfig"> | string | null
    appealPortalUrl?: StringNullableWithAggregatesFilter<"PayerConfig"> | string | null
    preferredFormat?: StringNullableWithAggregatesFilter<"PayerConfig"> | string | null
    specialInstructions?: StringNullableWithAggregatesFilter<"PayerConfig"> | string | null
    firstLevelSuccessRate?: FloatNullableWithAggregatesFilter<"PayerConfig"> | number | null
    secondLevelSuccessRate?: FloatNullableWithAggregatesFilter<"PayerConfig"> | number | null
    externalReviewSuccessRate?: FloatNullableWithAggregatesFilter<"PayerConfig"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"PayerConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PayerConfig"> | Date | string
  }

  export type StaffProductivityWhereInput = {
    AND?: StaffProductivityWhereInput | StaffProductivityWhereInput[]
    OR?: StaffProductivityWhereInput[]
    NOT?: StaffProductivityWhereInput | StaffProductivityWhereInput[]
    id?: StringFilter<"StaffProductivity"> | string
    staffId?: StringFilter<"StaffProductivity"> | string
    staffName?: StringFilter<"StaffProductivity"> | string
    periodDate?: DateTimeFilter<"StaffProductivity"> | Date | string
    denialsReviewed?: IntFilter<"StaffProductivity"> | number
    denialsAssigned?: IntFilter<"StaffProductivity"> | number
    appealsCreated?: IntFilter<"StaffProductivity"> | number
    appealsSubmitted?: IntFilter<"StaffProductivity"> | number
    appealsOverturned?: IntFilter<"StaffProductivity"> | number
    appealsUpheld?: IntFilter<"StaffProductivity"> | number
    averageProcessingTime?: IntNullableFilter<"StaffProductivity"> | number | null
    totalProcessingTime?: IntFilter<"StaffProductivity"> | number
    totalRecovered?: DecimalFilter<"StaffProductivity"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"StaffProductivity"> | Date | string
    updatedAt?: DateTimeFilter<"StaffProductivity"> | Date | string
  }

  export type StaffProductivityOrderByWithRelationInput = {
    id?: SortOrder
    staffId?: SortOrder
    staffName?: SortOrder
    periodDate?: SortOrder
    denialsReviewed?: SortOrder
    denialsAssigned?: SortOrder
    appealsCreated?: SortOrder
    appealsSubmitted?: SortOrder
    appealsOverturned?: SortOrder
    appealsUpheld?: SortOrder
    averageProcessingTime?: SortOrderInput | SortOrder
    totalProcessingTime?: SortOrder
    totalRecovered?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StaffProductivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    staffId_periodDate?: StaffProductivityStaffIdPeriodDateCompoundUniqueInput
    AND?: StaffProductivityWhereInput | StaffProductivityWhereInput[]
    OR?: StaffProductivityWhereInput[]
    NOT?: StaffProductivityWhereInput | StaffProductivityWhereInput[]
    staffId?: StringFilter<"StaffProductivity"> | string
    staffName?: StringFilter<"StaffProductivity"> | string
    periodDate?: DateTimeFilter<"StaffProductivity"> | Date | string
    denialsReviewed?: IntFilter<"StaffProductivity"> | number
    denialsAssigned?: IntFilter<"StaffProductivity"> | number
    appealsCreated?: IntFilter<"StaffProductivity"> | number
    appealsSubmitted?: IntFilter<"StaffProductivity"> | number
    appealsOverturned?: IntFilter<"StaffProductivity"> | number
    appealsUpheld?: IntFilter<"StaffProductivity"> | number
    averageProcessingTime?: IntNullableFilter<"StaffProductivity"> | number | null
    totalProcessingTime?: IntFilter<"StaffProductivity"> | number
    totalRecovered?: DecimalFilter<"StaffProductivity"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"StaffProductivity"> | Date | string
    updatedAt?: DateTimeFilter<"StaffProductivity"> | Date | string
  }, "id" | "staffId_periodDate">

  export type StaffProductivityOrderByWithAggregationInput = {
    id?: SortOrder
    staffId?: SortOrder
    staffName?: SortOrder
    periodDate?: SortOrder
    denialsReviewed?: SortOrder
    denialsAssigned?: SortOrder
    appealsCreated?: SortOrder
    appealsSubmitted?: SortOrder
    appealsOverturned?: SortOrder
    appealsUpheld?: SortOrder
    averageProcessingTime?: SortOrderInput | SortOrder
    totalProcessingTime?: SortOrder
    totalRecovered?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StaffProductivityCountOrderByAggregateInput
    _avg?: StaffProductivityAvgOrderByAggregateInput
    _max?: StaffProductivityMaxOrderByAggregateInput
    _min?: StaffProductivityMinOrderByAggregateInput
    _sum?: StaffProductivitySumOrderByAggregateInput
  }

  export type StaffProductivityScalarWhereWithAggregatesInput = {
    AND?: StaffProductivityScalarWhereWithAggregatesInput | StaffProductivityScalarWhereWithAggregatesInput[]
    OR?: StaffProductivityScalarWhereWithAggregatesInput[]
    NOT?: StaffProductivityScalarWhereWithAggregatesInput | StaffProductivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StaffProductivity"> | string
    staffId?: StringWithAggregatesFilter<"StaffProductivity"> | string
    staffName?: StringWithAggregatesFilter<"StaffProductivity"> | string
    periodDate?: DateTimeWithAggregatesFilter<"StaffProductivity"> | Date | string
    denialsReviewed?: IntWithAggregatesFilter<"StaffProductivity"> | number
    denialsAssigned?: IntWithAggregatesFilter<"StaffProductivity"> | number
    appealsCreated?: IntWithAggregatesFilter<"StaffProductivity"> | number
    appealsSubmitted?: IntWithAggregatesFilter<"StaffProductivity"> | number
    appealsOverturned?: IntWithAggregatesFilter<"StaffProductivity"> | number
    appealsUpheld?: IntWithAggregatesFilter<"StaffProductivity"> | number
    averageProcessingTime?: IntNullableWithAggregatesFilter<"StaffProductivity"> | number | null
    totalProcessingTime?: IntWithAggregatesFilter<"StaffProductivity"> | number
    totalRecovered?: DecimalWithAggregatesFilter<"StaffProductivity"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"StaffProductivity"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StaffProductivity"> | Date | string
  }

  export type RevenueRecoveryWhereInput = {
    AND?: RevenueRecoveryWhereInput | RevenueRecoveryWhereInput[]
    OR?: RevenueRecoveryWhereInput[]
    NOT?: RevenueRecoveryWhereInput | RevenueRecoveryWhereInput[]
    id?: StringFilter<"RevenueRecovery"> | string
    periodStart?: DateTimeFilter<"RevenueRecovery"> | Date | string
    periodEnd?: DateTimeFilter<"RevenueRecovery"> | Date | string
    totalDenials?: IntFilter<"RevenueRecovery"> | number
    totalDeniedAmount?: DecimalFilter<"RevenueRecovery"> | Decimal | DecimalJsLike | number | string
    totalAppeals?: IntFilter<"RevenueRecovery"> | number
    successfulAppeals?: IntFilter<"RevenueRecovery"> | number
    totalRecovered?: DecimalFilter<"RevenueRecovery"> | Decimal | DecimalJsLike | number | string
    totalWrittenOff?: DecimalFilter<"RevenueRecovery"> | Decimal | DecimalJsLike | number | string
    recoveryRate?: FloatFilter<"RevenueRecovery"> | number
    recoveryByCategory?: JsonNullableFilter<"RevenueRecovery">
    recoveryByPayer?: JsonNullableFilter<"RevenueRecovery">
    weeklyBreakdown?: JsonNullableFilter<"RevenueRecovery">
    createdAt?: DateTimeFilter<"RevenueRecovery"> | Date | string
    updatedAt?: DateTimeFilter<"RevenueRecovery"> | Date | string
  }

  export type RevenueRecoveryOrderByWithRelationInput = {
    id?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    totalDenials?: SortOrder
    totalDeniedAmount?: SortOrder
    totalAppeals?: SortOrder
    successfulAppeals?: SortOrder
    totalRecovered?: SortOrder
    totalWrittenOff?: SortOrder
    recoveryRate?: SortOrder
    recoveryByCategory?: SortOrderInput | SortOrder
    recoveryByPayer?: SortOrderInput | SortOrder
    weeklyBreakdown?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RevenueRecoveryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    periodStart_periodEnd?: RevenueRecoveryPeriodStartPeriodEndCompoundUniqueInput
    AND?: RevenueRecoveryWhereInput | RevenueRecoveryWhereInput[]
    OR?: RevenueRecoveryWhereInput[]
    NOT?: RevenueRecoveryWhereInput | RevenueRecoveryWhereInput[]
    periodStart?: DateTimeFilter<"RevenueRecovery"> | Date | string
    periodEnd?: DateTimeFilter<"RevenueRecovery"> | Date | string
    totalDenials?: IntFilter<"RevenueRecovery"> | number
    totalDeniedAmount?: DecimalFilter<"RevenueRecovery"> | Decimal | DecimalJsLike | number | string
    totalAppeals?: IntFilter<"RevenueRecovery"> | number
    successfulAppeals?: IntFilter<"RevenueRecovery"> | number
    totalRecovered?: DecimalFilter<"RevenueRecovery"> | Decimal | DecimalJsLike | number | string
    totalWrittenOff?: DecimalFilter<"RevenueRecovery"> | Decimal | DecimalJsLike | number | string
    recoveryRate?: FloatFilter<"RevenueRecovery"> | number
    recoveryByCategory?: JsonNullableFilter<"RevenueRecovery">
    recoveryByPayer?: JsonNullableFilter<"RevenueRecovery">
    weeklyBreakdown?: JsonNullableFilter<"RevenueRecovery">
    createdAt?: DateTimeFilter<"RevenueRecovery"> | Date | string
    updatedAt?: DateTimeFilter<"RevenueRecovery"> | Date | string
  }, "id" | "periodStart_periodEnd">

  export type RevenueRecoveryOrderByWithAggregationInput = {
    id?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    totalDenials?: SortOrder
    totalDeniedAmount?: SortOrder
    totalAppeals?: SortOrder
    successfulAppeals?: SortOrder
    totalRecovered?: SortOrder
    totalWrittenOff?: SortOrder
    recoveryRate?: SortOrder
    recoveryByCategory?: SortOrderInput | SortOrder
    recoveryByPayer?: SortOrderInput | SortOrder
    weeklyBreakdown?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RevenueRecoveryCountOrderByAggregateInput
    _avg?: RevenueRecoveryAvgOrderByAggregateInput
    _max?: RevenueRecoveryMaxOrderByAggregateInput
    _min?: RevenueRecoveryMinOrderByAggregateInput
    _sum?: RevenueRecoverySumOrderByAggregateInput
  }

  export type RevenueRecoveryScalarWhereWithAggregatesInput = {
    AND?: RevenueRecoveryScalarWhereWithAggregatesInput | RevenueRecoveryScalarWhereWithAggregatesInput[]
    OR?: RevenueRecoveryScalarWhereWithAggregatesInput[]
    NOT?: RevenueRecoveryScalarWhereWithAggregatesInput | RevenueRecoveryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RevenueRecovery"> | string
    periodStart?: DateTimeWithAggregatesFilter<"RevenueRecovery"> | Date | string
    periodEnd?: DateTimeWithAggregatesFilter<"RevenueRecovery"> | Date | string
    totalDenials?: IntWithAggregatesFilter<"RevenueRecovery"> | number
    totalDeniedAmount?: DecimalWithAggregatesFilter<"RevenueRecovery"> | Decimal | DecimalJsLike | number | string
    totalAppeals?: IntWithAggregatesFilter<"RevenueRecovery"> | number
    successfulAppeals?: IntWithAggregatesFilter<"RevenueRecovery"> | number
    totalRecovered?: DecimalWithAggregatesFilter<"RevenueRecovery"> | Decimal | DecimalJsLike | number | string
    totalWrittenOff?: DecimalWithAggregatesFilter<"RevenueRecovery"> | Decimal | DecimalJsLike | number | string
    recoveryRate?: FloatWithAggregatesFilter<"RevenueRecovery"> | number
    recoveryByCategory?: JsonNullableWithAggregatesFilter<"RevenueRecovery">
    recoveryByPayer?: JsonNullableWithAggregatesFilter<"RevenueRecovery">
    weeklyBreakdown?: JsonNullableWithAggregatesFilter<"RevenueRecovery">
    createdAt?: DateTimeWithAggregatesFilter<"RevenueRecovery"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RevenueRecovery"> | Date | string
  }

  export type ClaimRiskAssessmentWhereInput = {
    AND?: ClaimRiskAssessmentWhereInput | ClaimRiskAssessmentWhereInput[]
    OR?: ClaimRiskAssessmentWhereInput[]
    NOT?: ClaimRiskAssessmentWhereInput | ClaimRiskAssessmentWhereInput[]
    id?: StringFilter<"ClaimRiskAssessment"> | string
    claimId?: StringFilter<"ClaimRiskAssessment"> | string
    patientId?: StringFilter<"ClaimRiskAssessment"> | string
    providerId?: StringFilter<"ClaimRiskAssessment"> | string
    payerId?: StringFilter<"ClaimRiskAssessment"> | string
    procedureCode?: StringFilter<"ClaimRiskAssessment"> | string
    diagnosisCodes?: StringNullableListFilter<"ClaimRiskAssessment">
    billedAmount?: DecimalFilter<"ClaimRiskAssessment"> | Decimal | DecimalJsLike | number | string
    overallRiskScore?: FloatFilter<"ClaimRiskAssessment"> | number
    riskLevel?: EnumRiskLevelFilter<"ClaimRiskAssessment"> | $Enums.RiskLevel
    riskFactors?: JsonFilter<"ClaimRiskAssessment">
    recommendations?: StringNullableListFilter<"ClaimRiskAssessment">
    suggestedModifications?: JsonNullableFilter<"ClaimRiskAssessment">
    assessmentDate?: DateTimeFilter<"ClaimRiskAssessment"> | Date | string
    wasSubmitted?: BoolFilter<"ClaimRiskAssessment"> | boolean
    wasModified?: BoolFilter<"ClaimRiskAssessment"> | boolean
    actualOutcome?: StringNullableFilter<"ClaimRiskAssessment"> | string | null
    createdAt?: DateTimeFilter<"ClaimRiskAssessment"> | Date | string
    updatedAt?: DateTimeFilter<"ClaimRiskAssessment"> | Date | string
  }

  export type ClaimRiskAssessmentOrderByWithRelationInput = {
    id?: SortOrder
    claimId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    payerId?: SortOrder
    procedureCode?: SortOrder
    diagnosisCodes?: SortOrder
    billedAmount?: SortOrder
    overallRiskScore?: SortOrder
    riskLevel?: SortOrder
    riskFactors?: SortOrder
    recommendations?: SortOrder
    suggestedModifications?: SortOrderInput | SortOrder
    assessmentDate?: SortOrder
    wasSubmitted?: SortOrder
    wasModified?: SortOrder
    actualOutcome?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClaimRiskAssessmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    claimId?: string
    AND?: ClaimRiskAssessmentWhereInput | ClaimRiskAssessmentWhereInput[]
    OR?: ClaimRiskAssessmentWhereInput[]
    NOT?: ClaimRiskAssessmentWhereInput | ClaimRiskAssessmentWhereInput[]
    patientId?: StringFilter<"ClaimRiskAssessment"> | string
    providerId?: StringFilter<"ClaimRiskAssessment"> | string
    payerId?: StringFilter<"ClaimRiskAssessment"> | string
    procedureCode?: StringFilter<"ClaimRiskAssessment"> | string
    diagnosisCodes?: StringNullableListFilter<"ClaimRiskAssessment">
    billedAmount?: DecimalFilter<"ClaimRiskAssessment"> | Decimal | DecimalJsLike | number | string
    overallRiskScore?: FloatFilter<"ClaimRiskAssessment"> | number
    riskLevel?: EnumRiskLevelFilter<"ClaimRiskAssessment"> | $Enums.RiskLevel
    riskFactors?: JsonFilter<"ClaimRiskAssessment">
    recommendations?: StringNullableListFilter<"ClaimRiskAssessment">
    suggestedModifications?: JsonNullableFilter<"ClaimRiskAssessment">
    assessmentDate?: DateTimeFilter<"ClaimRiskAssessment"> | Date | string
    wasSubmitted?: BoolFilter<"ClaimRiskAssessment"> | boolean
    wasModified?: BoolFilter<"ClaimRiskAssessment"> | boolean
    actualOutcome?: StringNullableFilter<"ClaimRiskAssessment"> | string | null
    createdAt?: DateTimeFilter<"ClaimRiskAssessment"> | Date | string
    updatedAt?: DateTimeFilter<"ClaimRiskAssessment"> | Date | string
  }, "id" | "claimId">

  export type ClaimRiskAssessmentOrderByWithAggregationInput = {
    id?: SortOrder
    claimId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    payerId?: SortOrder
    procedureCode?: SortOrder
    diagnosisCodes?: SortOrder
    billedAmount?: SortOrder
    overallRiskScore?: SortOrder
    riskLevel?: SortOrder
    riskFactors?: SortOrder
    recommendations?: SortOrder
    suggestedModifications?: SortOrderInput | SortOrder
    assessmentDate?: SortOrder
    wasSubmitted?: SortOrder
    wasModified?: SortOrder
    actualOutcome?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClaimRiskAssessmentCountOrderByAggregateInput
    _avg?: ClaimRiskAssessmentAvgOrderByAggregateInput
    _max?: ClaimRiskAssessmentMaxOrderByAggregateInput
    _min?: ClaimRiskAssessmentMinOrderByAggregateInput
    _sum?: ClaimRiskAssessmentSumOrderByAggregateInput
  }

  export type ClaimRiskAssessmentScalarWhereWithAggregatesInput = {
    AND?: ClaimRiskAssessmentScalarWhereWithAggregatesInput | ClaimRiskAssessmentScalarWhereWithAggregatesInput[]
    OR?: ClaimRiskAssessmentScalarWhereWithAggregatesInput[]
    NOT?: ClaimRiskAssessmentScalarWhereWithAggregatesInput | ClaimRiskAssessmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClaimRiskAssessment"> | string
    claimId?: StringWithAggregatesFilter<"ClaimRiskAssessment"> | string
    patientId?: StringWithAggregatesFilter<"ClaimRiskAssessment"> | string
    providerId?: StringWithAggregatesFilter<"ClaimRiskAssessment"> | string
    payerId?: StringWithAggregatesFilter<"ClaimRiskAssessment"> | string
    procedureCode?: StringWithAggregatesFilter<"ClaimRiskAssessment"> | string
    diagnosisCodes?: StringNullableListFilter<"ClaimRiskAssessment">
    billedAmount?: DecimalWithAggregatesFilter<"ClaimRiskAssessment"> | Decimal | DecimalJsLike | number | string
    overallRiskScore?: FloatWithAggregatesFilter<"ClaimRiskAssessment"> | number
    riskLevel?: EnumRiskLevelWithAggregatesFilter<"ClaimRiskAssessment"> | $Enums.RiskLevel
    riskFactors?: JsonWithAggregatesFilter<"ClaimRiskAssessment">
    recommendations?: StringNullableListFilter<"ClaimRiskAssessment">
    suggestedModifications?: JsonNullableWithAggregatesFilter<"ClaimRiskAssessment">
    assessmentDate?: DateTimeWithAggregatesFilter<"ClaimRiskAssessment"> | Date | string
    wasSubmitted?: BoolWithAggregatesFilter<"ClaimRiskAssessment"> | boolean
    wasModified?: BoolWithAggregatesFilter<"ClaimRiskAssessment"> | boolean
    actualOutcome?: StringNullableWithAggregatesFilter<"ClaimRiskAssessment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ClaimRiskAssessment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ClaimRiskAssessment"> | Date | string
  }

  export type DenialCreateInput = {
    id?: string
    claimId: string
    patientId: string
    providerId: string
    payerId: string
    payerName: string
    claimStatus?: $Enums.ClaimStatus
    denialDate?: Date | string
    serviceDate: Date | string
    billedAmount: Decimal | DecimalJsLike | number | string
    allowedAmount?: Decimal | DecimalJsLike | number | string | null
    paidAmount?: Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    carcCode: string
    carcDescription: string
    rarcCodes?: DenialCreaterarcCodesInput | string[]
    groupCode: string
    procedureCode: string
    procedureModifiers?: DenialCreateprocedureModifiersInput | string[]
    diagnosisCodes?: DenialCreatediagnosisCodesInput | string[]
    placeOfService?: string | null
    x277StatusCode?: string | null
    x277StatusMessage?: string | null
    predictedRecoverable?: boolean
    recoveryProbability?: number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    denialCategory: $Enums.DenialCategory
    rootCause?: string | null
    recoveredAmount?: Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appeals?: AppealCreateNestedManyWithoutDenialInput
  }

  export type DenialUncheckedCreateInput = {
    id?: string
    claimId: string
    patientId: string
    providerId: string
    payerId: string
    payerName: string
    claimStatus?: $Enums.ClaimStatus
    denialDate?: Date | string
    serviceDate: Date | string
    billedAmount: Decimal | DecimalJsLike | number | string
    allowedAmount?: Decimal | DecimalJsLike | number | string | null
    paidAmount?: Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    carcCode: string
    carcDescription: string
    rarcCodes?: DenialCreaterarcCodesInput | string[]
    groupCode: string
    procedureCode: string
    procedureModifiers?: DenialCreateprocedureModifiersInput | string[]
    diagnosisCodes?: DenialCreatediagnosisCodesInput | string[]
    placeOfService?: string | null
    x277StatusCode?: string | null
    x277StatusMessage?: string | null
    predictedRecoverable?: boolean
    recoveryProbability?: number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    denialCategory: $Enums.DenialCategory
    rootCause?: string | null
    recoveredAmount?: Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appeals?: AppealUncheckedCreateNestedManyWithoutDenialInput
  }

  export type DenialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    claimId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    claimStatus?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    denialDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    billedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    paidAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    carcCode?: StringFieldUpdateOperationsInput | string
    carcDescription?: StringFieldUpdateOperationsInput | string
    rarcCodes?: DenialUpdaterarcCodesInput | string[]
    groupCode?: StringFieldUpdateOperationsInput | string
    procedureCode?: StringFieldUpdateOperationsInput | string
    procedureModifiers?: DenialUpdateprocedureModifiersInput | string[]
    diagnosisCodes?: DenialUpdatediagnosisCodesInput | string[]
    placeOfService?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusCode?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    predictedRecoverable?: BoolFieldUpdateOperationsInput | boolean
    recoveryProbability?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    denialCategory?: EnumDenialCategoryFieldUpdateOperationsInput | $Enums.DenialCategory
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    recoveredAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appeals?: AppealUpdateManyWithoutDenialNestedInput
  }

  export type DenialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    claimId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    claimStatus?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    denialDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    billedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    paidAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    carcCode?: StringFieldUpdateOperationsInput | string
    carcDescription?: StringFieldUpdateOperationsInput | string
    rarcCodes?: DenialUpdaterarcCodesInput | string[]
    groupCode?: StringFieldUpdateOperationsInput | string
    procedureCode?: StringFieldUpdateOperationsInput | string
    procedureModifiers?: DenialUpdateprocedureModifiersInput | string[]
    diagnosisCodes?: DenialUpdatediagnosisCodesInput | string[]
    placeOfService?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusCode?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    predictedRecoverable?: BoolFieldUpdateOperationsInput | boolean
    recoveryProbability?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    denialCategory?: EnumDenialCategoryFieldUpdateOperationsInput | $Enums.DenialCategory
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    recoveredAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appeals?: AppealUncheckedUpdateManyWithoutDenialNestedInput
  }

  export type DenialCreateManyInput = {
    id?: string
    claimId: string
    patientId: string
    providerId: string
    payerId: string
    payerName: string
    claimStatus?: $Enums.ClaimStatus
    denialDate?: Date | string
    serviceDate: Date | string
    billedAmount: Decimal | DecimalJsLike | number | string
    allowedAmount?: Decimal | DecimalJsLike | number | string | null
    paidAmount?: Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    carcCode: string
    carcDescription: string
    rarcCodes?: DenialCreaterarcCodesInput | string[]
    groupCode: string
    procedureCode: string
    procedureModifiers?: DenialCreateprocedureModifiersInput | string[]
    diagnosisCodes?: DenialCreatediagnosisCodesInput | string[]
    placeOfService?: string | null
    x277StatusCode?: string | null
    x277StatusMessage?: string | null
    predictedRecoverable?: boolean
    recoveryProbability?: number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    denialCategory: $Enums.DenialCategory
    rootCause?: string | null
    recoveredAmount?: Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DenialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    claimId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    claimStatus?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    denialDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    billedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    paidAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    carcCode?: StringFieldUpdateOperationsInput | string
    carcDescription?: StringFieldUpdateOperationsInput | string
    rarcCodes?: DenialUpdaterarcCodesInput | string[]
    groupCode?: StringFieldUpdateOperationsInput | string
    procedureCode?: StringFieldUpdateOperationsInput | string
    procedureModifiers?: DenialUpdateprocedureModifiersInput | string[]
    diagnosisCodes?: DenialUpdatediagnosisCodesInput | string[]
    placeOfService?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusCode?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    predictedRecoverable?: BoolFieldUpdateOperationsInput | boolean
    recoveryProbability?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    denialCategory?: EnumDenialCategoryFieldUpdateOperationsInput | $Enums.DenialCategory
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    recoveredAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DenialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    claimId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    claimStatus?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    denialDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    billedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    paidAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    carcCode?: StringFieldUpdateOperationsInput | string
    carcDescription?: StringFieldUpdateOperationsInput | string
    rarcCodes?: DenialUpdaterarcCodesInput | string[]
    groupCode?: StringFieldUpdateOperationsInput | string
    procedureCode?: StringFieldUpdateOperationsInput | string
    procedureModifiers?: DenialUpdateprocedureModifiersInput | string[]
    diagnosisCodes?: DenialUpdatediagnosisCodesInput | string[]
    placeOfService?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusCode?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    predictedRecoverable?: BoolFieldUpdateOperationsInput | boolean
    recoveryProbability?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    denialCategory?: EnumDenialCategoryFieldUpdateOperationsInput | $Enums.DenialCategory
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    recoveredAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppealCreateInput = {
    id?: string
    appealLevel?: number
    appealType: $Enums.AppealType
    status?: $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: string | null
    appealLetterHtml?: string | null
    supportingDocuments?: AppealCreatesupportingDocumentsInput | string[]
    filingDeadline: Date | string
    submittedDate?: Date | string | null
    responseDeadline?: Date | string | null
    responseDate?: Date | string | null
    outcome?: $Enums.AppealOutcome | null
    outcomeReason?: string | null
    adjustedAmount?: Decimal | DecimalJsLike | number | string | null
    assignedTo?: string | null
    assignedAt?: Date | string | null
    completedBy?: string | null
    completedAt?: Date | string | null
    processingTimeMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    denial: DenialCreateNestedOneWithoutAppealsInput
  }

  export type AppealUncheckedCreateInput = {
    id?: string
    denialId: string
    appealLevel?: number
    appealType: $Enums.AppealType
    status?: $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: string | null
    appealLetterHtml?: string | null
    supportingDocuments?: AppealCreatesupportingDocumentsInput | string[]
    filingDeadline: Date | string
    submittedDate?: Date | string | null
    responseDeadline?: Date | string | null
    responseDate?: Date | string | null
    outcome?: $Enums.AppealOutcome | null
    outcomeReason?: string | null
    adjustedAmount?: Decimal | DecimalJsLike | number | string | null
    assignedTo?: string | null
    assignedAt?: Date | string | null
    completedBy?: string | null
    completedAt?: Date | string | null
    processingTimeMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppealUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    appealLevel?: IntFieldUpdateOperationsInput | number
    appealType?: EnumAppealTypeFieldUpdateOperationsInput | $Enums.AppealType
    status?: EnumAppealStatusFieldUpdateOperationsInput | $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: NullableStringFieldUpdateOperationsInput | string | null
    appealLetterHtml?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocuments?: AppealUpdatesupportingDocumentsInput | string[]
    filingDeadline?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableEnumAppealOutcomeFieldUpdateOperationsInput | $Enums.AppealOutcome | null
    outcomeReason?: NullableStringFieldUpdateOperationsInput | string | null
    adjustedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    denial?: DenialUpdateOneRequiredWithoutAppealsNestedInput
  }

  export type AppealUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    denialId?: StringFieldUpdateOperationsInput | string
    appealLevel?: IntFieldUpdateOperationsInput | number
    appealType?: EnumAppealTypeFieldUpdateOperationsInput | $Enums.AppealType
    status?: EnumAppealStatusFieldUpdateOperationsInput | $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: NullableStringFieldUpdateOperationsInput | string | null
    appealLetterHtml?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocuments?: AppealUpdatesupportingDocumentsInput | string[]
    filingDeadline?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableEnumAppealOutcomeFieldUpdateOperationsInput | $Enums.AppealOutcome | null
    outcomeReason?: NullableStringFieldUpdateOperationsInput | string | null
    adjustedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppealCreateManyInput = {
    id?: string
    denialId: string
    appealLevel?: number
    appealType: $Enums.AppealType
    status?: $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: string | null
    appealLetterHtml?: string | null
    supportingDocuments?: AppealCreatesupportingDocumentsInput | string[]
    filingDeadline: Date | string
    submittedDate?: Date | string | null
    responseDeadline?: Date | string | null
    responseDate?: Date | string | null
    outcome?: $Enums.AppealOutcome | null
    outcomeReason?: string | null
    adjustedAmount?: Decimal | DecimalJsLike | number | string | null
    assignedTo?: string | null
    assignedAt?: Date | string | null
    completedBy?: string | null
    completedAt?: Date | string | null
    processingTimeMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppealUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    appealLevel?: IntFieldUpdateOperationsInput | number
    appealType?: EnumAppealTypeFieldUpdateOperationsInput | $Enums.AppealType
    status?: EnumAppealStatusFieldUpdateOperationsInput | $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: NullableStringFieldUpdateOperationsInput | string | null
    appealLetterHtml?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocuments?: AppealUpdatesupportingDocumentsInput | string[]
    filingDeadline?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableEnumAppealOutcomeFieldUpdateOperationsInput | $Enums.AppealOutcome | null
    outcomeReason?: NullableStringFieldUpdateOperationsInput | string | null
    adjustedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppealUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    denialId?: StringFieldUpdateOperationsInput | string
    appealLevel?: IntFieldUpdateOperationsInput | number
    appealType?: EnumAppealTypeFieldUpdateOperationsInput | $Enums.AppealType
    status?: EnumAppealStatusFieldUpdateOperationsInput | $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: NullableStringFieldUpdateOperationsInput | string | null
    appealLetterHtml?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocuments?: AppealUpdatesupportingDocumentsInput | string[]
    filingDeadline?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableEnumAppealOutcomeFieldUpdateOperationsInput | $Enums.AppealOutcome | null
    outcomeReason?: NullableStringFieldUpdateOperationsInput | string | null
    adjustedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DenialPatternCreateInput = {
    id?: string
    payerId: string
    payerName: string
    procedureCode?: string | null
    diagnosisCode?: string | null
    carcCode?: string | null
    denialCategory?: $Enums.DenialCategory | null
    totalDenials?: number
    totalBilledAmount?: Decimal | DecimalJsLike | number | string
    totalRecoveredAmount?: Decimal | DecimalJsLike | number | string
    denialRate?: number
    recoveryRate?: number
    averageRecoveryTime?: number | null
    periodStart: Date | string
    periodEnd: Date | string
    monthlyTrend?: NullableJsonNullValueInput | InputJsonValue
    suggestedActions?: DenialPatternCreatesuggestedActionsInput | string[]
    riskScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DenialPatternUncheckedCreateInput = {
    id?: string
    payerId: string
    payerName: string
    procedureCode?: string | null
    diagnosisCode?: string | null
    carcCode?: string | null
    denialCategory?: $Enums.DenialCategory | null
    totalDenials?: number
    totalBilledAmount?: Decimal | DecimalJsLike | number | string
    totalRecoveredAmount?: Decimal | DecimalJsLike | number | string
    denialRate?: number
    recoveryRate?: number
    averageRecoveryTime?: number | null
    periodStart: Date | string
    periodEnd: Date | string
    monthlyTrend?: NullableJsonNullValueInput | InputJsonValue
    suggestedActions?: DenialPatternCreatesuggestedActionsInput | string[]
    riskScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DenialPatternUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    procedureCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisCode?: NullableStringFieldUpdateOperationsInput | string | null
    carcCode?: NullableStringFieldUpdateOperationsInput | string | null
    denialCategory?: NullableEnumDenialCategoryFieldUpdateOperationsInput | $Enums.DenialCategory | null
    totalDenials?: IntFieldUpdateOperationsInput | number
    totalBilledAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalRecoveredAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    denialRate?: FloatFieldUpdateOperationsInput | number
    recoveryRate?: FloatFieldUpdateOperationsInput | number
    averageRecoveryTime?: NullableIntFieldUpdateOperationsInput | number | null
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    monthlyTrend?: NullableJsonNullValueInput | InputJsonValue
    suggestedActions?: DenialPatternUpdatesuggestedActionsInput | string[]
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DenialPatternUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    procedureCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisCode?: NullableStringFieldUpdateOperationsInput | string | null
    carcCode?: NullableStringFieldUpdateOperationsInput | string | null
    denialCategory?: NullableEnumDenialCategoryFieldUpdateOperationsInput | $Enums.DenialCategory | null
    totalDenials?: IntFieldUpdateOperationsInput | number
    totalBilledAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalRecoveredAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    denialRate?: FloatFieldUpdateOperationsInput | number
    recoveryRate?: FloatFieldUpdateOperationsInput | number
    averageRecoveryTime?: NullableIntFieldUpdateOperationsInput | number | null
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    monthlyTrend?: NullableJsonNullValueInput | InputJsonValue
    suggestedActions?: DenialPatternUpdatesuggestedActionsInput | string[]
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DenialPatternCreateManyInput = {
    id?: string
    payerId: string
    payerName: string
    procedureCode?: string | null
    diagnosisCode?: string | null
    carcCode?: string | null
    denialCategory?: $Enums.DenialCategory | null
    totalDenials?: number
    totalBilledAmount?: Decimal | DecimalJsLike | number | string
    totalRecoveredAmount?: Decimal | DecimalJsLike | number | string
    denialRate?: number
    recoveryRate?: number
    averageRecoveryTime?: number | null
    periodStart: Date | string
    periodEnd: Date | string
    monthlyTrend?: NullableJsonNullValueInput | InputJsonValue
    suggestedActions?: DenialPatternCreatesuggestedActionsInput | string[]
    riskScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DenialPatternUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    procedureCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisCode?: NullableStringFieldUpdateOperationsInput | string | null
    carcCode?: NullableStringFieldUpdateOperationsInput | string | null
    denialCategory?: NullableEnumDenialCategoryFieldUpdateOperationsInput | $Enums.DenialCategory | null
    totalDenials?: IntFieldUpdateOperationsInput | number
    totalBilledAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalRecoveredAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    denialRate?: FloatFieldUpdateOperationsInput | number
    recoveryRate?: FloatFieldUpdateOperationsInput | number
    averageRecoveryTime?: NullableIntFieldUpdateOperationsInput | number | null
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    monthlyTrend?: NullableJsonNullValueInput | InputJsonValue
    suggestedActions?: DenialPatternUpdatesuggestedActionsInput | string[]
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DenialPatternUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    procedureCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisCode?: NullableStringFieldUpdateOperationsInput | string | null
    carcCode?: NullableStringFieldUpdateOperationsInput | string | null
    denialCategory?: NullableEnumDenialCategoryFieldUpdateOperationsInput | $Enums.DenialCategory | null
    totalDenials?: IntFieldUpdateOperationsInput | number
    totalBilledAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalRecoveredAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    denialRate?: FloatFieldUpdateOperationsInput | number
    recoveryRate?: FloatFieldUpdateOperationsInput | number
    averageRecoveryTime?: NullableIntFieldUpdateOperationsInput | number | null
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    monthlyTrend?: NullableJsonNullValueInput | InputJsonValue
    suggestedActions?: DenialPatternUpdatesuggestedActionsInput | string[]
    riskScore?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayerConfigCreateInput = {
    id?: string
    payerId: string
    payerName: string
    firstLevelDeadlineDays?: number
    secondLevelDeadlineDays?: number
    externalReviewDeadlineDays?: number
    requiresClinicalNotes?: boolean
    requiresMedicalRecords?: boolean
    requiresLetterOfMedicalNecessity?: boolean
    acceptsElectronicAppeals?: boolean
    appealAddress?: NullableJsonNullValueInput | InputJsonValue
    appealFaxNumber?: string | null
    appealEmail?: string | null
    appealPortalUrl?: string | null
    preferredFormat?: string | null
    specialInstructions?: string | null
    firstLevelSuccessRate?: number | null
    secondLevelSuccessRate?: number | null
    externalReviewSuccessRate?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayerConfigUncheckedCreateInput = {
    id?: string
    payerId: string
    payerName: string
    firstLevelDeadlineDays?: number
    secondLevelDeadlineDays?: number
    externalReviewDeadlineDays?: number
    requiresClinicalNotes?: boolean
    requiresMedicalRecords?: boolean
    requiresLetterOfMedicalNecessity?: boolean
    acceptsElectronicAppeals?: boolean
    appealAddress?: NullableJsonNullValueInput | InputJsonValue
    appealFaxNumber?: string | null
    appealEmail?: string | null
    appealPortalUrl?: string | null
    preferredFormat?: string | null
    specialInstructions?: string | null
    firstLevelSuccessRate?: number | null
    secondLevelSuccessRate?: number | null
    externalReviewSuccessRate?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayerConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    firstLevelDeadlineDays?: IntFieldUpdateOperationsInput | number
    secondLevelDeadlineDays?: IntFieldUpdateOperationsInput | number
    externalReviewDeadlineDays?: IntFieldUpdateOperationsInput | number
    requiresClinicalNotes?: BoolFieldUpdateOperationsInput | boolean
    requiresMedicalRecords?: BoolFieldUpdateOperationsInput | boolean
    requiresLetterOfMedicalNecessity?: BoolFieldUpdateOperationsInput | boolean
    acceptsElectronicAppeals?: BoolFieldUpdateOperationsInput | boolean
    appealAddress?: NullableJsonNullValueInput | InputJsonValue
    appealFaxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    appealEmail?: NullableStringFieldUpdateOperationsInput | string | null
    appealPortalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredFormat?: NullableStringFieldUpdateOperationsInput | string | null
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    firstLevelSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    secondLevelSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    externalReviewSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayerConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    firstLevelDeadlineDays?: IntFieldUpdateOperationsInput | number
    secondLevelDeadlineDays?: IntFieldUpdateOperationsInput | number
    externalReviewDeadlineDays?: IntFieldUpdateOperationsInput | number
    requiresClinicalNotes?: BoolFieldUpdateOperationsInput | boolean
    requiresMedicalRecords?: BoolFieldUpdateOperationsInput | boolean
    requiresLetterOfMedicalNecessity?: BoolFieldUpdateOperationsInput | boolean
    acceptsElectronicAppeals?: BoolFieldUpdateOperationsInput | boolean
    appealAddress?: NullableJsonNullValueInput | InputJsonValue
    appealFaxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    appealEmail?: NullableStringFieldUpdateOperationsInput | string | null
    appealPortalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredFormat?: NullableStringFieldUpdateOperationsInput | string | null
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    firstLevelSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    secondLevelSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    externalReviewSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayerConfigCreateManyInput = {
    id?: string
    payerId: string
    payerName: string
    firstLevelDeadlineDays?: number
    secondLevelDeadlineDays?: number
    externalReviewDeadlineDays?: number
    requiresClinicalNotes?: boolean
    requiresMedicalRecords?: boolean
    requiresLetterOfMedicalNecessity?: boolean
    acceptsElectronicAppeals?: boolean
    appealAddress?: NullableJsonNullValueInput | InputJsonValue
    appealFaxNumber?: string | null
    appealEmail?: string | null
    appealPortalUrl?: string | null
    preferredFormat?: string | null
    specialInstructions?: string | null
    firstLevelSuccessRate?: number | null
    secondLevelSuccessRate?: number | null
    externalReviewSuccessRate?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayerConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    firstLevelDeadlineDays?: IntFieldUpdateOperationsInput | number
    secondLevelDeadlineDays?: IntFieldUpdateOperationsInput | number
    externalReviewDeadlineDays?: IntFieldUpdateOperationsInput | number
    requiresClinicalNotes?: BoolFieldUpdateOperationsInput | boolean
    requiresMedicalRecords?: BoolFieldUpdateOperationsInput | boolean
    requiresLetterOfMedicalNecessity?: BoolFieldUpdateOperationsInput | boolean
    acceptsElectronicAppeals?: BoolFieldUpdateOperationsInput | boolean
    appealAddress?: NullableJsonNullValueInput | InputJsonValue
    appealFaxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    appealEmail?: NullableStringFieldUpdateOperationsInput | string | null
    appealPortalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredFormat?: NullableStringFieldUpdateOperationsInput | string | null
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    firstLevelSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    secondLevelSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    externalReviewSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayerConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    firstLevelDeadlineDays?: IntFieldUpdateOperationsInput | number
    secondLevelDeadlineDays?: IntFieldUpdateOperationsInput | number
    externalReviewDeadlineDays?: IntFieldUpdateOperationsInput | number
    requiresClinicalNotes?: BoolFieldUpdateOperationsInput | boolean
    requiresMedicalRecords?: BoolFieldUpdateOperationsInput | boolean
    requiresLetterOfMedicalNecessity?: BoolFieldUpdateOperationsInput | boolean
    acceptsElectronicAppeals?: BoolFieldUpdateOperationsInput | boolean
    appealAddress?: NullableJsonNullValueInput | InputJsonValue
    appealFaxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    appealEmail?: NullableStringFieldUpdateOperationsInput | string | null
    appealPortalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredFormat?: NullableStringFieldUpdateOperationsInput | string | null
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    firstLevelSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    secondLevelSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    externalReviewSuccessRate?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffProductivityCreateInput = {
    id?: string
    staffId: string
    staffName: string
    periodDate: Date | string
    denialsReviewed?: number
    denialsAssigned?: number
    appealsCreated?: number
    appealsSubmitted?: number
    appealsOverturned?: number
    appealsUpheld?: number
    averageProcessingTime?: number | null
    totalProcessingTime?: number
    totalRecovered?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StaffProductivityUncheckedCreateInput = {
    id?: string
    staffId: string
    staffName: string
    periodDate: Date | string
    denialsReviewed?: number
    denialsAssigned?: number
    appealsCreated?: number
    appealsSubmitted?: number
    appealsOverturned?: number
    appealsUpheld?: number
    averageProcessingTime?: number | null
    totalProcessingTime?: number
    totalRecovered?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StaffProductivityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    staffName?: StringFieldUpdateOperationsInput | string
    periodDate?: DateTimeFieldUpdateOperationsInput | Date | string
    denialsReviewed?: IntFieldUpdateOperationsInput | number
    denialsAssigned?: IntFieldUpdateOperationsInput | number
    appealsCreated?: IntFieldUpdateOperationsInput | number
    appealsSubmitted?: IntFieldUpdateOperationsInput | number
    appealsOverturned?: IntFieldUpdateOperationsInput | number
    appealsUpheld?: IntFieldUpdateOperationsInput | number
    averageProcessingTime?: NullableIntFieldUpdateOperationsInput | number | null
    totalProcessingTime?: IntFieldUpdateOperationsInput | number
    totalRecovered?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffProductivityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    staffName?: StringFieldUpdateOperationsInput | string
    periodDate?: DateTimeFieldUpdateOperationsInput | Date | string
    denialsReviewed?: IntFieldUpdateOperationsInput | number
    denialsAssigned?: IntFieldUpdateOperationsInput | number
    appealsCreated?: IntFieldUpdateOperationsInput | number
    appealsSubmitted?: IntFieldUpdateOperationsInput | number
    appealsOverturned?: IntFieldUpdateOperationsInput | number
    appealsUpheld?: IntFieldUpdateOperationsInput | number
    averageProcessingTime?: NullableIntFieldUpdateOperationsInput | number | null
    totalProcessingTime?: IntFieldUpdateOperationsInput | number
    totalRecovered?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffProductivityCreateManyInput = {
    id?: string
    staffId: string
    staffName: string
    periodDate: Date | string
    denialsReviewed?: number
    denialsAssigned?: number
    appealsCreated?: number
    appealsSubmitted?: number
    appealsOverturned?: number
    appealsUpheld?: number
    averageProcessingTime?: number | null
    totalProcessingTime?: number
    totalRecovered?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StaffProductivityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    staffName?: StringFieldUpdateOperationsInput | string
    periodDate?: DateTimeFieldUpdateOperationsInput | Date | string
    denialsReviewed?: IntFieldUpdateOperationsInput | number
    denialsAssigned?: IntFieldUpdateOperationsInput | number
    appealsCreated?: IntFieldUpdateOperationsInput | number
    appealsSubmitted?: IntFieldUpdateOperationsInput | number
    appealsOverturned?: IntFieldUpdateOperationsInput | number
    appealsUpheld?: IntFieldUpdateOperationsInput | number
    averageProcessingTime?: NullableIntFieldUpdateOperationsInput | number | null
    totalProcessingTime?: IntFieldUpdateOperationsInput | number
    totalRecovered?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffProductivityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    staffName?: StringFieldUpdateOperationsInput | string
    periodDate?: DateTimeFieldUpdateOperationsInput | Date | string
    denialsReviewed?: IntFieldUpdateOperationsInput | number
    denialsAssigned?: IntFieldUpdateOperationsInput | number
    appealsCreated?: IntFieldUpdateOperationsInput | number
    appealsSubmitted?: IntFieldUpdateOperationsInput | number
    appealsOverturned?: IntFieldUpdateOperationsInput | number
    appealsUpheld?: IntFieldUpdateOperationsInput | number
    averageProcessingTime?: NullableIntFieldUpdateOperationsInput | number | null
    totalProcessingTime?: IntFieldUpdateOperationsInput | number
    totalRecovered?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevenueRecoveryCreateInput = {
    id?: string
    periodStart: Date | string
    periodEnd: Date | string
    totalDenials?: number
    totalDeniedAmount?: Decimal | DecimalJsLike | number | string
    totalAppeals?: number
    successfulAppeals?: number
    totalRecovered?: Decimal | DecimalJsLike | number | string
    totalWrittenOff?: Decimal | DecimalJsLike | number | string
    recoveryRate?: number
    recoveryByCategory?: NullableJsonNullValueInput | InputJsonValue
    recoveryByPayer?: NullableJsonNullValueInput | InputJsonValue
    weeklyBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RevenueRecoveryUncheckedCreateInput = {
    id?: string
    periodStart: Date | string
    periodEnd: Date | string
    totalDenials?: number
    totalDeniedAmount?: Decimal | DecimalJsLike | number | string
    totalAppeals?: number
    successfulAppeals?: number
    totalRecovered?: Decimal | DecimalJsLike | number | string
    totalWrittenOff?: Decimal | DecimalJsLike | number | string
    recoveryRate?: number
    recoveryByCategory?: NullableJsonNullValueInput | InputJsonValue
    recoveryByPayer?: NullableJsonNullValueInput | InputJsonValue
    weeklyBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RevenueRecoveryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    totalDenials?: IntFieldUpdateOperationsInput | number
    totalDeniedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAppeals?: IntFieldUpdateOperationsInput | number
    successfulAppeals?: IntFieldUpdateOperationsInput | number
    totalRecovered?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWrittenOff?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    recoveryRate?: FloatFieldUpdateOperationsInput | number
    recoveryByCategory?: NullableJsonNullValueInput | InputJsonValue
    recoveryByPayer?: NullableJsonNullValueInput | InputJsonValue
    weeklyBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevenueRecoveryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    totalDenials?: IntFieldUpdateOperationsInput | number
    totalDeniedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAppeals?: IntFieldUpdateOperationsInput | number
    successfulAppeals?: IntFieldUpdateOperationsInput | number
    totalRecovered?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWrittenOff?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    recoveryRate?: FloatFieldUpdateOperationsInput | number
    recoveryByCategory?: NullableJsonNullValueInput | InputJsonValue
    recoveryByPayer?: NullableJsonNullValueInput | InputJsonValue
    weeklyBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevenueRecoveryCreateManyInput = {
    id?: string
    periodStart: Date | string
    periodEnd: Date | string
    totalDenials?: number
    totalDeniedAmount?: Decimal | DecimalJsLike | number | string
    totalAppeals?: number
    successfulAppeals?: number
    totalRecovered?: Decimal | DecimalJsLike | number | string
    totalWrittenOff?: Decimal | DecimalJsLike | number | string
    recoveryRate?: number
    recoveryByCategory?: NullableJsonNullValueInput | InputJsonValue
    recoveryByPayer?: NullableJsonNullValueInput | InputJsonValue
    weeklyBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RevenueRecoveryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    totalDenials?: IntFieldUpdateOperationsInput | number
    totalDeniedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAppeals?: IntFieldUpdateOperationsInput | number
    successfulAppeals?: IntFieldUpdateOperationsInput | number
    totalRecovered?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWrittenOff?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    recoveryRate?: FloatFieldUpdateOperationsInput | number
    recoveryByCategory?: NullableJsonNullValueInput | InputJsonValue
    recoveryByPayer?: NullableJsonNullValueInput | InputJsonValue
    weeklyBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevenueRecoveryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    totalDenials?: IntFieldUpdateOperationsInput | number
    totalDeniedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAppeals?: IntFieldUpdateOperationsInput | number
    successfulAppeals?: IntFieldUpdateOperationsInput | number
    totalRecovered?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWrittenOff?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    recoveryRate?: FloatFieldUpdateOperationsInput | number
    recoveryByCategory?: NullableJsonNullValueInput | InputJsonValue
    recoveryByPayer?: NullableJsonNullValueInput | InputJsonValue
    weeklyBreakdown?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClaimRiskAssessmentCreateInput = {
    id?: string
    claimId: string
    patientId: string
    providerId: string
    payerId: string
    procedureCode: string
    diagnosisCodes?: ClaimRiskAssessmentCreatediagnosisCodesInput | string[]
    billedAmount: Decimal | DecimalJsLike | number | string
    overallRiskScore: number
    riskLevel: $Enums.RiskLevel
    riskFactors: JsonNullValueInput | InputJsonValue
    recommendations?: ClaimRiskAssessmentCreaterecommendationsInput | string[]
    suggestedModifications?: NullableJsonNullValueInput | InputJsonValue
    assessmentDate?: Date | string
    wasSubmitted?: boolean
    wasModified?: boolean
    actualOutcome?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClaimRiskAssessmentUncheckedCreateInput = {
    id?: string
    claimId: string
    patientId: string
    providerId: string
    payerId: string
    procedureCode: string
    diagnosisCodes?: ClaimRiskAssessmentCreatediagnosisCodesInput | string[]
    billedAmount: Decimal | DecimalJsLike | number | string
    overallRiskScore: number
    riskLevel: $Enums.RiskLevel
    riskFactors: JsonNullValueInput | InputJsonValue
    recommendations?: ClaimRiskAssessmentCreaterecommendationsInput | string[]
    suggestedModifications?: NullableJsonNullValueInput | InputJsonValue
    assessmentDate?: Date | string
    wasSubmitted?: boolean
    wasModified?: boolean
    actualOutcome?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClaimRiskAssessmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    claimId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    procedureCode?: StringFieldUpdateOperationsInput | string
    diagnosisCodes?: ClaimRiskAssessmentUpdatediagnosisCodesInput | string[]
    billedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    overallRiskScore?: FloatFieldUpdateOperationsInput | number
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    riskFactors?: JsonNullValueInput | InputJsonValue
    recommendations?: ClaimRiskAssessmentUpdaterecommendationsInput | string[]
    suggestedModifications?: NullableJsonNullValueInput | InputJsonValue
    assessmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    wasSubmitted?: BoolFieldUpdateOperationsInput | boolean
    wasModified?: BoolFieldUpdateOperationsInput | boolean
    actualOutcome?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClaimRiskAssessmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    claimId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    procedureCode?: StringFieldUpdateOperationsInput | string
    diagnosisCodes?: ClaimRiskAssessmentUpdatediagnosisCodesInput | string[]
    billedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    overallRiskScore?: FloatFieldUpdateOperationsInput | number
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    riskFactors?: JsonNullValueInput | InputJsonValue
    recommendations?: ClaimRiskAssessmentUpdaterecommendationsInput | string[]
    suggestedModifications?: NullableJsonNullValueInput | InputJsonValue
    assessmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    wasSubmitted?: BoolFieldUpdateOperationsInput | boolean
    wasModified?: BoolFieldUpdateOperationsInput | boolean
    actualOutcome?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClaimRiskAssessmentCreateManyInput = {
    id?: string
    claimId: string
    patientId: string
    providerId: string
    payerId: string
    procedureCode: string
    diagnosisCodes?: ClaimRiskAssessmentCreatediagnosisCodesInput | string[]
    billedAmount: Decimal | DecimalJsLike | number | string
    overallRiskScore: number
    riskLevel: $Enums.RiskLevel
    riskFactors: JsonNullValueInput | InputJsonValue
    recommendations?: ClaimRiskAssessmentCreaterecommendationsInput | string[]
    suggestedModifications?: NullableJsonNullValueInput | InputJsonValue
    assessmentDate?: Date | string
    wasSubmitted?: boolean
    wasModified?: boolean
    actualOutcome?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClaimRiskAssessmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    claimId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    procedureCode?: StringFieldUpdateOperationsInput | string
    diagnosisCodes?: ClaimRiskAssessmentUpdatediagnosisCodesInput | string[]
    billedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    overallRiskScore?: FloatFieldUpdateOperationsInput | number
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    riskFactors?: JsonNullValueInput | InputJsonValue
    recommendations?: ClaimRiskAssessmentUpdaterecommendationsInput | string[]
    suggestedModifications?: NullableJsonNullValueInput | InputJsonValue
    assessmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    wasSubmitted?: BoolFieldUpdateOperationsInput | boolean
    wasModified?: BoolFieldUpdateOperationsInput | boolean
    actualOutcome?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClaimRiskAssessmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    claimId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    procedureCode?: StringFieldUpdateOperationsInput | string
    diagnosisCodes?: ClaimRiskAssessmentUpdatediagnosisCodesInput | string[]
    billedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    overallRiskScore?: FloatFieldUpdateOperationsInput | number
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    riskFactors?: JsonNullValueInput | InputJsonValue
    recommendations?: ClaimRiskAssessmentUpdaterecommendationsInput | string[]
    suggestedModifications?: NullableJsonNullValueInput | InputJsonValue
    assessmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    wasSubmitted?: BoolFieldUpdateOperationsInput | boolean
    wasModified?: BoolFieldUpdateOperationsInput | boolean
    actualOutcome?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type EnumClaimStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClaimStatusFilter<$PrismaModel> | $Enums.ClaimStatus
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

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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

  export type EnumDenialCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.DenialCategory | EnumDenialCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumDenialCategoryFilter<$PrismaModel> | $Enums.DenialCategory
  }

  export type AppealListRelationFilter = {
    every?: AppealWhereInput
    some?: AppealWhereInput
    none?: AppealWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AppealOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DenialCountOrderByAggregateInput = {
    id?: SortOrder
    claimId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    claimStatus?: SortOrder
    denialDate?: SortOrder
    serviceDate?: SortOrder
    billedAmount?: SortOrder
    allowedAmount?: SortOrder
    paidAmount?: SortOrder
    patientResponsibility?: SortOrder
    carcCode?: SortOrder
    carcDescription?: SortOrder
    rarcCodes?: SortOrder
    groupCode?: SortOrder
    procedureCode?: SortOrder
    procedureModifiers?: SortOrder
    diagnosisCodes?: SortOrder
    placeOfService?: SortOrder
    x277StatusCode?: SortOrder
    x277StatusMessage?: SortOrder
    predictedRecoverable?: SortOrder
    recoveryProbability?: SortOrder
    riskFactors?: SortOrder
    denialCategory?: SortOrder
    rootCause?: SortOrder
    recoveredAmount?: SortOrder
    writeOffAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DenialAvgOrderByAggregateInput = {
    billedAmount?: SortOrder
    allowedAmount?: SortOrder
    paidAmount?: SortOrder
    patientResponsibility?: SortOrder
    recoveryProbability?: SortOrder
    recoveredAmount?: SortOrder
    writeOffAmount?: SortOrder
  }

  export type DenialMaxOrderByAggregateInput = {
    id?: SortOrder
    claimId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    claimStatus?: SortOrder
    denialDate?: SortOrder
    serviceDate?: SortOrder
    billedAmount?: SortOrder
    allowedAmount?: SortOrder
    paidAmount?: SortOrder
    patientResponsibility?: SortOrder
    carcCode?: SortOrder
    carcDescription?: SortOrder
    groupCode?: SortOrder
    procedureCode?: SortOrder
    placeOfService?: SortOrder
    x277StatusCode?: SortOrder
    x277StatusMessage?: SortOrder
    predictedRecoverable?: SortOrder
    recoveryProbability?: SortOrder
    denialCategory?: SortOrder
    rootCause?: SortOrder
    recoveredAmount?: SortOrder
    writeOffAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DenialMinOrderByAggregateInput = {
    id?: SortOrder
    claimId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    claimStatus?: SortOrder
    denialDate?: SortOrder
    serviceDate?: SortOrder
    billedAmount?: SortOrder
    allowedAmount?: SortOrder
    paidAmount?: SortOrder
    patientResponsibility?: SortOrder
    carcCode?: SortOrder
    carcDescription?: SortOrder
    groupCode?: SortOrder
    procedureCode?: SortOrder
    placeOfService?: SortOrder
    x277StatusCode?: SortOrder
    x277StatusMessage?: SortOrder
    predictedRecoverable?: SortOrder
    recoveryProbability?: SortOrder
    denialCategory?: SortOrder
    rootCause?: SortOrder
    recoveredAmount?: SortOrder
    writeOffAmount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DenialSumOrderByAggregateInput = {
    billedAmount?: SortOrder
    allowedAmount?: SortOrder
    paidAmount?: SortOrder
    patientResponsibility?: SortOrder
    recoveryProbability?: SortOrder
    recoveredAmount?: SortOrder
    writeOffAmount?: SortOrder
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

  export type EnumClaimStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClaimStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClaimStatusFilter<$PrismaModel>
    _max?: NestedEnumClaimStatusFilter<$PrismaModel>
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

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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

  export type EnumDenialCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DenialCategory | EnumDenialCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumDenialCategoryWithAggregatesFilter<$PrismaModel> | $Enums.DenialCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDenialCategoryFilter<$PrismaModel>
    _max?: NestedEnumDenialCategoryFilter<$PrismaModel>
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

  export type EnumAppealTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealType | EnumAppealTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AppealType[] | ListEnumAppealTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppealType[] | ListEnumAppealTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAppealTypeFilter<$PrismaModel> | $Enums.AppealType
  }

  export type EnumAppealStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealStatus | EnumAppealStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppealStatus[] | ListEnumAppealStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppealStatus[] | ListEnumAppealStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppealStatusFilter<$PrismaModel> | $Enums.AppealStatus
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

  export type EnumAppealOutcomeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealOutcome | EnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    in?: $Enums.AppealOutcome[] | ListEnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AppealOutcome[] | ListEnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAppealOutcomeNullableFilter<$PrismaModel> | $Enums.AppealOutcome | null
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

  export type DenialRelationFilter = {
    is?: DenialWhereInput
    isNot?: DenialWhereInput
  }

  export type AppealCountOrderByAggregateInput = {
    id?: SortOrder
    denialId?: SortOrder
    appealLevel?: SortOrder
    appealType?: SortOrder
    status?: SortOrder
    payerAppealStrategy?: SortOrder
    appealLetterContent?: SortOrder
    appealLetterHtml?: SortOrder
    supportingDocuments?: SortOrder
    filingDeadline?: SortOrder
    submittedDate?: SortOrder
    responseDeadline?: SortOrder
    responseDate?: SortOrder
    outcome?: SortOrder
    outcomeReason?: SortOrder
    adjustedAmount?: SortOrder
    assignedTo?: SortOrder
    assignedAt?: SortOrder
    completedBy?: SortOrder
    completedAt?: SortOrder
    processingTimeMinutes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppealAvgOrderByAggregateInput = {
    appealLevel?: SortOrder
    adjustedAmount?: SortOrder
    processingTimeMinutes?: SortOrder
  }

  export type AppealMaxOrderByAggregateInput = {
    id?: SortOrder
    denialId?: SortOrder
    appealLevel?: SortOrder
    appealType?: SortOrder
    status?: SortOrder
    appealLetterContent?: SortOrder
    appealLetterHtml?: SortOrder
    filingDeadline?: SortOrder
    submittedDate?: SortOrder
    responseDeadline?: SortOrder
    responseDate?: SortOrder
    outcome?: SortOrder
    outcomeReason?: SortOrder
    adjustedAmount?: SortOrder
    assignedTo?: SortOrder
    assignedAt?: SortOrder
    completedBy?: SortOrder
    completedAt?: SortOrder
    processingTimeMinutes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppealMinOrderByAggregateInput = {
    id?: SortOrder
    denialId?: SortOrder
    appealLevel?: SortOrder
    appealType?: SortOrder
    status?: SortOrder
    appealLetterContent?: SortOrder
    appealLetterHtml?: SortOrder
    filingDeadline?: SortOrder
    submittedDate?: SortOrder
    responseDeadline?: SortOrder
    responseDate?: SortOrder
    outcome?: SortOrder
    outcomeReason?: SortOrder
    adjustedAmount?: SortOrder
    assignedTo?: SortOrder
    assignedAt?: SortOrder
    completedBy?: SortOrder
    completedAt?: SortOrder
    processingTimeMinutes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppealSumOrderByAggregateInput = {
    appealLevel?: SortOrder
    adjustedAmount?: SortOrder
    processingTimeMinutes?: SortOrder
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

  export type EnumAppealTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealType | EnumAppealTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AppealType[] | ListEnumAppealTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppealType[] | ListEnumAppealTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAppealTypeWithAggregatesFilter<$PrismaModel> | $Enums.AppealType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppealTypeFilter<$PrismaModel>
    _max?: NestedEnumAppealTypeFilter<$PrismaModel>
  }

  export type EnumAppealStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealStatus | EnumAppealStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppealStatus[] | ListEnumAppealStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppealStatus[] | ListEnumAppealStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppealStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppealStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppealStatusFilter<$PrismaModel>
    _max?: NestedEnumAppealStatusFilter<$PrismaModel>
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

  export type EnumAppealOutcomeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealOutcome | EnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    in?: $Enums.AppealOutcome[] | ListEnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AppealOutcome[] | ListEnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAppealOutcomeNullableWithAggregatesFilter<$PrismaModel> | $Enums.AppealOutcome | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumAppealOutcomeNullableFilter<$PrismaModel>
    _max?: NestedEnumAppealOutcomeNullableFilter<$PrismaModel>
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

  export type EnumDenialCategoryNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DenialCategory | EnumDenialCategoryFieldRefInput<$PrismaModel> | null
    in?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDenialCategoryNullableFilter<$PrismaModel> | $Enums.DenialCategory | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DenialPatternPayerIdProcedureCodeDiagnosisCodeCarcCodePeriodStartPeriodEndCompoundUniqueInput = {
    payerId: string
    procedureCode: string
    diagnosisCode: string
    carcCode: string
    periodStart: Date | string
    periodEnd: Date | string
  }

  export type DenialPatternCountOrderByAggregateInput = {
    id?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    procedureCode?: SortOrder
    diagnosisCode?: SortOrder
    carcCode?: SortOrder
    denialCategory?: SortOrder
    totalDenials?: SortOrder
    totalBilledAmount?: SortOrder
    totalRecoveredAmount?: SortOrder
    denialRate?: SortOrder
    recoveryRate?: SortOrder
    averageRecoveryTime?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    monthlyTrend?: SortOrder
    suggestedActions?: SortOrder
    riskScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DenialPatternAvgOrderByAggregateInput = {
    totalDenials?: SortOrder
    totalBilledAmount?: SortOrder
    totalRecoveredAmount?: SortOrder
    denialRate?: SortOrder
    recoveryRate?: SortOrder
    averageRecoveryTime?: SortOrder
    riskScore?: SortOrder
  }

  export type DenialPatternMaxOrderByAggregateInput = {
    id?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    procedureCode?: SortOrder
    diagnosisCode?: SortOrder
    carcCode?: SortOrder
    denialCategory?: SortOrder
    totalDenials?: SortOrder
    totalBilledAmount?: SortOrder
    totalRecoveredAmount?: SortOrder
    denialRate?: SortOrder
    recoveryRate?: SortOrder
    averageRecoveryTime?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    riskScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DenialPatternMinOrderByAggregateInput = {
    id?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    procedureCode?: SortOrder
    diagnosisCode?: SortOrder
    carcCode?: SortOrder
    denialCategory?: SortOrder
    totalDenials?: SortOrder
    totalBilledAmount?: SortOrder
    totalRecoveredAmount?: SortOrder
    denialRate?: SortOrder
    recoveryRate?: SortOrder
    averageRecoveryTime?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    riskScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DenialPatternSumOrderByAggregateInput = {
    totalDenials?: SortOrder
    totalBilledAmount?: SortOrder
    totalRecoveredAmount?: SortOrder
    denialRate?: SortOrder
    recoveryRate?: SortOrder
    averageRecoveryTime?: SortOrder
    riskScore?: SortOrder
  }

  export type EnumDenialCategoryNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DenialCategory | EnumDenialCategoryFieldRefInput<$PrismaModel> | null
    in?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDenialCategoryNullableWithAggregatesFilter<$PrismaModel> | $Enums.DenialCategory | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDenialCategoryNullableFilter<$PrismaModel>
    _max?: NestedEnumDenialCategoryNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type PayerConfigCountOrderByAggregateInput = {
    id?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    firstLevelDeadlineDays?: SortOrder
    secondLevelDeadlineDays?: SortOrder
    externalReviewDeadlineDays?: SortOrder
    requiresClinicalNotes?: SortOrder
    requiresMedicalRecords?: SortOrder
    requiresLetterOfMedicalNecessity?: SortOrder
    acceptsElectronicAppeals?: SortOrder
    appealAddress?: SortOrder
    appealFaxNumber?: SortOrder
    appealEmail?: SortOrder
    appealPortalUrl?: SortOrder
    preferredFormat?: SortOrder
    specialInstructions?: SortOrder
    firstLevelSuccessRate?: SortOrder
    secondLevelSuccessRate?: SortOrder
    externalReviewSuccessRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayerConfigAvgOrderByAggregateInput = {
    firstLevelDeadlineDays?: SortOrder
    secondLevelDeadlineDays?: SortOrder
    externalReviewDeadlineDays?: SortOrder
    firstLevelSuccessRate?: SortOrder
    secondLevelSuccessRate?: SortOrder
    externalReviewSuccessRate?: SortOrder
  }

  export type PayerConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    firstLevelDeadlineDays?: SortOrder
    secondLevelDeadlineDays?: SortOrder
    externalReviewDeadlineDays?: SortOrder
    requiresClinicalNotes?: SortOrder
    requiresMedicalRecords?: SortOrder
    requiresLetterOfMedicalNecessity?: SortOrder
    acceptsElectronicAppeals?: SortOrder
    appealFaxNumber?: SortOrder
    appealEmail?: SortOrder
    appealPortalUrl?: SortOrder
    preferredFormat?: SortOrder
    specialInstructions?: SortOrder
    firstLevelSuccessRate?: SortOrder
    secondLevelSuccessRate?: SortOrder
    externalReviewSuccessRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayerConfigMinOrderByAggregateInput = {
    id?: SortOrder
    payerId?: SortOrder
    payerName?: SortOrder
    firstLevelDeadlineDays?: SortOrder
    secondLevelDeadlineDays?: SortOrder
    externalReviewDeadlineDays?: SortOrder
    requiresClinicalNotes?: SortOrder
    requiresMedicalRecords?: SortOrder
    requiresLetterOfMedicalNecessity?: SortOrder
    acceptsElectronicAppeals?: SortOrder
    appealFaxNumber?: SortOrder
    appealEmail?: SortOrder
    appealPortalUrl?: SortOrder
    preferredFormat?: SortOrder
    specialInstructions?: SortOrder
    firstLevelSuccessRate?: SortOrder
    secondLevelSuccessRate?: SortOrder
    externalReviewSuccessRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayerConfigSumOrderByAggregateInput = {
    firstLevelDeadlineDays?: SortOrder
    secondLevelDeadlineDays?: SortOrder
    externalReviewDeadlineDays?: SortOrder
    firstLevelSuccessRate?: SortOrder
    secondLevelSuccessRate?: SortOrder
    externalReviewSuccessRate?: SortOrder
  }

  export type StaffProductivityStaffIdPeriodDateCompoundUniqueInput = {
    staffId: string
    periodDate: Date | string
  }

  export type StaffProductivityCountOrderByAggregateInput = {
    id?: SortOrder
    staffId?: SortOrder
    staffName?: SortOrder
    periodDate?: SortOrder
    denialsReviewed?: SortOrder
    denialsAssigned?: SortOrder
    appealsCreated?: SortOrder
    appealsSubmitted?: SortOrder
    appealsOverturned?: SortOrder
    appealsUpheld?: SortOrder
    averageProcessingTime?: SortOrder
    totalProcessingTime?: SortOrder
    totalRecovered?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StaffProductivityAvgOrderByAggregateInput = {
    denialsReviewed?: SortOrder
    denialsAssigned?: SortOrder
    appealsCreated?: SortOrder
    appealsSubmitted?: SortOrder
    appealsOverturned?: SortOrder
    appealsUpheld?: SortOrder
    averageProcessingTime?: SortOrder
    totalProcessingTime?: SortOrder
    totalRecovered?: SortOrder
  }

  export type StaffProductivityMaxOrderByAggregateInput = {
    id?: SortOrder
    staffId?: SortOrder
    staffName?: SortOrder
    periodDate?: SortOrder
    denialsReviewed?: SortOrder
    denialsAssigned?: SortOrder
    appealsCreated?: SortOrder
    appealsSubmitted?: SortOrder
    appealsOverturned?: SortOrder
    appealsUpheld?: SortOrder
    averageProcessingTime?: SortOrder
    totalProcessingTime?: SortOrder
    totalRecovered?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StaffProductivityMinOrderByAggregateInput = {
    id?: SortOrder
    staffId?: SortOrder
    staffName?: SortOrder
    periodDate?: SortOrder
    denialsReviewed?: SortOrder
    denialsAssigned?: SortOrder
    appealsCreated?: SortOrder
    appealsSubmitted?: SortOrder
    appealsOverturned?: SortOrder
    appealsUpheld?: SortOrder
    averageProcessingTime?: SortOrder
    totalProcessingTime?: SortOrder
    totalRecovered?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StaffProductivitySumOrderByAggregateInput = {
    denialsReviewed?: SortOrder
    denialsAssigned?: SortOrder
    appealsCreated?: SortOrder
    appealsSubmitted?: SortOrder
    appealsOverturned?: SortOrder
    appealsUpheld?: SortOrder
    averageProcessingTime?: SortOrder
    totalProcessingTime?: SortOrder
    totalRecovered?: SortOrder
  }

  export type RevenueRecoveryPeriodStartPeriodEndCompoundUniqueInput = {
    periodStart: Date | string
    periodEnd: Date | string
  }

  export type RevenueRecoveryCountOrderByAggregateInput = {
    id?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    totalDenials?: SortOrder
    totalDeniedAmount?: SortOrder
    totalAppeals?: SortOrder
    successfulAppeals?: SortOrder
    totalRecovered?: SortOrder
    totalWrittenOff?: SortOrder
    recoveryRate?: SortOrder
    recoveryByCategory?: SortOrder
    recoveryByPayer?: SortOrder
    weeklyBreakdown?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RevenueRecoveryAvgOrderByAggregateInput = {
    totalDenials?: SortOrder
    totalDeniedAmount?: SortOrder
    totalAppeals?: SortOrder
    successfulAppeals?: SortOrder
    totalRecovered?: SortOrder
    totalWrittenOff?: SortOrder
    recoveryRate?: SortOrder
  }

  export type RevenueRecoveryMaxOrderByAggregateInput = {
    id?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    totalDenials?: SortOrder
    totalDeniedAmount?: SortOrder
    totalAppeals?: SortOrder
    successfulAppeals?: SortOrder
    totalRecovered?: SortOrder
    totalWrittenOff?: SortOrder
    recoveryRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RevenueRecoveryMinOrderByAggregateInput = {
    id?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    totalDenials?: SortOrder
    totalDeniedAmount?: SortOrder
    totalAppeals?: SortOrder
    successfulAppeals?: SortOrder
    totalRecovered?: SortOrder
    totalWrittenOff?: SortOrder
    recoveryRate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RevenueRecoverySumOrderByAggregateInput = {
    totalDenials?: SortOrder
    totalDeniedAmount?: SortOrder
    totalAppeals?: SortOrder
    successfulAppeals?: SortOrder
    totalRecovered?: SortOrder
    totalWrittenOff?: SortOrder
    recoveryRate?: SortOrder
  }

  export type EnumRiskLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelFilter<$PrismaModel> | $Enums.RiskLevel
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
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

  export type ClaimRiskAssessmentCountOrderByAggregateInput = {
    id?: SortOrder
    claimId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    payerId?: SortOrder
    procedureCode?: SortOrder
    diagnosisCodes?: SortOrder
    billedAmount?: SortOrder
    overallRiskScore?: SortOrder
    riskLevel?: SortOrder
    riskFactors?: SortOrder
    recommendations?: SortOrder
    suggestedModifications?: SortOrder
    assessmentDate?: SortOrder
    wasSubmitted?: SortOrder
    wasModified?: SortOrder
    actualOutcome?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClaimRiskAssessmentAvgOrderByAggregateInput = {
    billedAmount?: SortOrder
    overallRiskScore?: SortOrder
  }

  export type ClaimRiskAssessmentMaxOrderByAggregateInput = {
    id?: SortOrder
    claimId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    payerId?: SortOrder
    procedureCode?: SortOrder
    billedAmount?: SortOrder
    overallRiskScore?: SortOrder
    riskLevel?: SortOrder
    assessmentDate?: SortOrder
    wasSubmitted?: SortOrder
    wasModified?: SortOrder
    actualOutcome?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClaimRiskAssessmentMinOrderByAggregateInput = {
    id?: SortOrder
    claimId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    payerId?: SortOrder
    procedureCode?: SortOrder
    billedAmount?: SortOrder
    overallRiskScore?: SortOrder
    riskLevel?: SortOrder
    assessmentDate?: SortOrder
    wasSubmitted?: SortOrder
    wasModified?: SortOrder
    actualOutcome?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClaimRiskAssessmentSumOrderByAggregateInput = {
    billedAmount?: SortOrder
    overallRiskScore?: SortOrder
  }

  export type EnumRiskLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelWithAggregatesFilter<$PrismaModel> | $Enums.RiskLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRiskLevelFilter<$PrismaModel>
    _max?: NestedEnumRiskLevelFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
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
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DenialCreaterarcCodesInput = {
    set: string[]
  }

  export type DenialCreateprocedureModifiersInput = {
    set: string[]
  }

  export type DenialCreatediagnosisCodesInput = {
    set: string[]
  }

  export type AppealCreateNestedManyWithoutDenialInput = {
    create?: XOR<AppealCreateWithoutDenialInput, AppealUncheckedCreateWithoutDenialInput> | AppealCreateWithoutDenialInput[] | AppealUncheckedCreateWithoutDenialInput[]
    connectOrCreate?: AppealCreateOrConnectWithoutDenialInput | AppealCreateOrConnectWithoutDenialInput[]
    createMany?: AppealCreateManyDenialInputEnvelope
    connect?: AppealWhereUniqueInput | AppealWhereUniqueInput[]
  }

  export type AppealUncheckedCreateNestedManyWithoutDenialInput = {
    create?: XOR<AppealCreateWithoutDenialInput, AppealUncheckedCreateWithoutDenialInput> | AppealCreateWithoutDenialInput[] | AppealUncheckedCreateWithoutDenialInput[]
    connectOrCreate?: AppealCreateOrConnectWithoutDenialInput | AppealCreateOrConnectWithoutDenialInput[]
    createMany?: AppealCreateManyDenialInputEnvelope
    connect?: AppealWhereUniqueInput | AppealWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumClaimStatusFieldUpdateOperationsInput = {
    set?: $Enums.ClaimStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type DenialUpdaterarcCodesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DenialUpdateprocedureModifiersInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DenialUpdatediagnosisCodesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumDenialCategoryFieldUpdateOperationsInput = {
    set?: $Enums.DenialCategory
  }

  export type AppealUpdateManyWithoutDenialNestedInput = {
    create?: XOR<AppealCreateWithoutDenialInput, AppealUncheckedCreateWithoutDenialInput> | AppealCreateWithoutDenialInput[] | AppealUncheckedCreateWithoutDenialInput[]
    connectOrCreate?: AppealCreateOrConnectWithoutDenialInput | AppealCreateOrConnectWithoutDenialInput[]
    upsert?: AppealUpsertWithWhereUniqueWithoutDenialInput | AppealUpsertWithWhereUniqueWithoutDenialInput[]
    createMany?: AppealCreateManyDenialInputEnvelope
    set?: AppealWhereUniqueInput | AppealWhereUniqueInput[]
    disconnect?: AppealWhereUniqueInput | AppealWhereUniqueInput[]
    delete?: AppealWhereUniqueInput | AppealWhereUniqueInput[]
    connect?: AppealWhereUniqueInput | AppealWhereUniqueInput[]
    update?: AppealUpdateWithWhereUniqueWithoutDenialInput | AppealUpdateWithWhereUniqueWithoutDenialInput[]
    updateMany?: AppealUpdateManyWithWhereWithoutDenialInput | AppealUpdateManyWithWhereWithoutDenialInput[]
    deleteMany?: AppealScalarWhereInput | AppealScalarWhereInput[]
  }

  export type AppealUncheckedUpdateManyWithoutDenialNestedInput = {
    create?: XOR<AppealCreateWithoutDenialInput, AppealUncheckedCreateWithoutDenialInput> | AppealCreateWithoutDenialInput[] | AppealUncheckedCreateWithoutDenialInput[]
    connectOrCreate?: AppealCreateOrConnectWithoutDenialInput | AppealCreateOrConnectWithoutDenialInput[]
    upsert?: AppealUpsertWithWhereUniqueWithoutDenialInput | AppealUpsertWithWhereUniqueWithoutDenialInput[]
    createMany?: AppealCreateManyDenialInputEnvelope
    set?: AppealWhereUniqueInput | AppealWhereUniqueInput[]
    disconnect?: AppealWhereUniqueInput | AppealWhereUniqueInput[]
    delete?: AppealWhereUniqueInput | AppealWhereUniqueInput[]
    connect?: AppealWhereUniqueInput | AppealWhereUniqueInput[]
    update?: AppealUpdateWithWhereUniqueWithoutDenialInput | AppealUpdateWithWhereUniqueWithoutDenialInput[]
    updateMany?: AppealUpdateManyWithWhereWithoutDenialInput | AppealUpdateManyWithWhereWithoutDenialInput[]
    deleteMany?: AppealScalarWhereInput | AppealScalarWhereInput[]
  }

  export type AppealCreatesupportingDocumentsInput = {
    set: string[]
  }

  export type DenialCreateNestedOneWithoutAppealsInput = {
    create?: XOR<DenialCreateWithoutAppealsInput, DenialUncheckedCreateWithoutAppealsInput>
    connectOrCreate?: DenialCreateOrConnectWithoutAppealsInput
    connect?: DenialWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumAppealTypeFieldUpdateOperationsInput = {
    set?: $Enums.AppealType
  }

  export type EnumAppealStatusFieldUpdateOperationsInput = {
    set?: $Enums.AppealStatus
  }

  export type AppealUpdatesupportingDocumentsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableEnumAppealOutcomeFieldUpdateOperationsInput = {
    set?: $Enums.AppealOutcome | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DenialUpdateOneRequiredWithoutAppealsNestedInput = {
    create?: XOR<DenialCreateWithoutAppealsInput, DenialUncheckedCreateWithoutAppealsInput>
    connectOrCreate?: DenialCreateOrConnectWithoutAppealsInput
    upsert?: DenialUpsertWithoutAppealsInput
    connect?: DenialWhereUniqueInput
    update?: XOR<XOR<DenialUpdateToOneWithWhereWithoutAppealsInput, DenialUpdateWithoutAppealsInput>, DenialUncheckedUpdateWithoutAppealsInput>
  }

  export type DenialPatternCreatesuggestedActionsInput = {
    set: string[]
  }

  export type NullableEnumDenialCategoryFieldUpdateOperationsInput = {
    set?: $Enums.DenialCategory | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DenialPatternUpdatesuggestedActionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ClaimRiskAssessmentCreatediagnosisCodesInput = {
    set: string[]
  }

  export type ClaimRiskAssessmentCreaterecommendationsInput = {
    set: string[]
  }

  export type ClaimRiskAssessmentUpdatediagnosisCodesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumRiskLevelFieldUpdateOperationsInput = {
    set?: $Enums.RiskLevel
  }

  export type ClaimRiskAssessmentUpdaterecommendationsInput = {
    set?: string[]
    push?: string | string[]
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

  export type NestedEnumClaimStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClaimStatusFilter<$PrismaModel> | $Enums.ClaimStatus
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

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedEnumDenialCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.DenialCategory | EnumDenialCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumDenialCategoryFilter<$PrismaModel> | $Enums.DenialCategory
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

  export type NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClaimStatus | EnumClaimStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClaimStatus[] | ListEnumClaimStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClaimStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClaimStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClaimStatusFilter<$PrismaModel>
    _max?: NestedEnumClaimStatusFilter<$PrismaModel>
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

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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

  export type NestedEnumDenialCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DenialCategory | EnumDenialCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumDenialCategoryWithAggregatesFilter<$PrismaModel> | $Enums.DenialCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDenialCategoryFilter<$PrismaModel>
    _max?: NestedEnumDenialCategoryFilter<$PrismaModel>
  }

  export type NestedEnumAppealTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealType | EnumAppealTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AppealType[] | ListEnumAppealTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppealType[] | ListEnumAppealTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAppealTypeFilter<$PrismaModel> | $Enums.AppealType
  }

  export type NestedEnumAppealStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealStatus | EnumAppealStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppealStatus[] | ListEnumAppealStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppealStatus[] | ListEnumAppealStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppealStatusFilter<$PrismaModel> | $Enums.AppealStatus
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

  export type NestedEnumAppealOutcomeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealOutcome | EnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    in?: $Enums.AppealOutcome[] | ListEnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AppealOutcome[] | ListEnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAppealOutcomeNullableFilter<$PrismaModel> | $Enums.AppealOutcome | null
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

  export type NestedEnumAppealTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealType | EnumAppealTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AppealType[] | ListEnumAppealTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppealType[] | ListEnumAppealTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAppealTypeWithAggregatesFilter<$PrismaModel> | $Enums.AppealType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppealTypeFilter<$PrismaModel>
    _max?: NestedEnumAppealTypeFilter<$PrismaModel>
  }

  export type NestedEnumAppealStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealStatus | EnumAppealStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppealStatus[] | ListEnumAppealStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppealStatus[] | ListEnumAppealStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppealStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppealStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppealStatusFilter<$PrismaModel>
    _max?: NestedEnumAppealStatusFilter<$PrismaModel>
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

  export type NestedEnumAppealOutcomeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppealOutcome | EnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    in?: $Enums.AppealOutcome[] | ListEnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AppealOutcome[] | ListEnumAppealOutcomeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAppealOutcomeNullableWithAggregatesFilter<$PrismaModel> | $Enums.AppealOutcome | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumAppealOutcomeNullableFilter<$PrismaModel>
    _max?: NestedEnumAppealOutcomeNullableFilter<$PrismaModel>
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

  export type NestedEnumDenialCategoryNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DenialCategory | EnumDenialCategoryFieldRefInput<$PrismaModel> | null
    in?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDenialCategoryNullableFilter<$PrismaModel> | $Enums.DenialCategory | null
  }

  export type NestedEnumDenialCategoryNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DenialCategory | EnumDenialCategoryFieldRefInput<$PrismaModel> | null
    in?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DenialCategory[] | ListEnumDenialCategoryFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDenialCategoryNullableWithAggregatesFilter<$PrismaModel> | $Enums.DenialCategory | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDenialCategoryNullableFilter<$PrismaModel>
    _max?: NestedEnumDenialCategoryNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumRiskLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelFilter<$PrismaModel> | $Enums.RiskLevel
  }

  export type NestedEnumRiskLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelWithAggregatesFilter<$PrismaModel> | $Enums.RiskLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRiskLevelFilter<$PrismaModel>
    _max?: NestedEnumRiskLevelFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
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

  export type AppealCreateWithoutDenialInput = {
    id?: string
    appealLevel?: number
    appealType: $Enums.AppealType
    status?: $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: string | null
    appealLetterHtml?: string | null
    supportingDocuments?: AppealCreatesupportingDocumentsInput | string[]
    filingDeadline: Date | string
    submittedDate?: Date | string | null
    responseDeadline?: Date | string | null
    responseDate?: Date | string | null
    outcome?: $Enums.AppealOutcome | null
    outcomeReason?: string | null
    adjustedAmount?: Decimal | DecimalJsLike | number | string | null
    assignedTo?: string | null
    assignedAt?: Date | string | null
    completedBy?: string | null
    completedAt?: Date | string | null
    processingTimeMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppealUncheckedCreateWithoutDenialInput = {
    id?: string
    appealLevel?: number
    appealType: $Enums.AppealType
    status?: $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: string | null
    appealLetterHtml?: string | null
    supportingDocuments?: AppealCreatesupportingDocumentsInput | string[]
    filingDeadline: Date | string
    submittedDate?: Date | string | null
    responseDeadline?: Date | string | null
    responseDate?: Date | string | null
    outcome?: $Enums.AppealOutcome | null
    outcomeReason?: string | null
    adjustedAmount?: Decimal | DecimalJsLike | number | string | null
    assignedTo?: string | null
    assignedAt?: Date | string | null
    completedBy?: string | null
    completedAt?: Date | string | null
    processingTimeMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppealCreateOrConnectWithoutDenialInput = {
    where: AppealWhereUniqueInput
    create: XOR<AppealCreateWithoutDenialInput, AppealUncheckedCreateWithoutDenialInput>
  }

  export type AppealCreateManyDenialInputEnvelope = {
    data: AppealCreateManyDenialInput | AppealCreateManyDenialInput[]
    skipDuplicates?: boolean
  }

  export type AppealUpsertWithWhereUniqueWithoutDenialInput = {
    where: AppealWhereUniqueInput
    update: XOR<AppealUpdateWithoutDenialInput, AppealUncheckedUpdateWithoutDenialInput>
    create: XOR<AppealCreateWithoutDenialInput, AppealUncheckedCreateWithoutDenialInput>
  }

  export type AppealUpdateWithWhereUniqueWithoutDenialInput = {
    where: AppealWhereUniqueInput
    data: XOR<AppealUpdateWithoutDenialInput, AppealUncheckedUpdateWithoutDenialInput>
  }

  export type AppealUpdateManyWithWhereWithoutDenialInput = {
    where: AppealScalarWhereInput
    data: XOR<AppealUpdateManyMutationInput, AppealUncheckedUpdateManyWithoutDenialInput>
  }

  export type AppealScalarWhereInput = {
    AND?: AppealScalarWhereInput | AppealScalarWhereInput[]
    OR?: AppealScalarWhereInput[]
    NOT?: AppealScalarWhereInput | AppealScalarWhereInput[]
    id?: StringFilter<"Appeal"> | string
    denialId?: StringFilter<"Appeal"> | string
    appealLevel?: IntFilter<"Appeal"> | number
    appealType?: EnumAppealTypeFilter<"Appeal"> | $Enums.AppealType
    status?: EnumAppealStatusFilter<"Appeal"> | $Enums.AppealStatus
    payerAppealStrategy?: JsonNullableFilter<"Appeal">
    appealLetterContent?: StringNullableFilter<"Appeal"> | string | null
    appealLetterHtml?: StringNullableFilter<"Appeal"> | string | null
    supportingDocuments?: StringNullableListFilter<"Appeal">
    filingDeadline?: DateTimeFilter<"Appeal"> | Date | string
    submittedDate?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    responseDeadline?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    responseDate?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    outcome?: EnumAppealOutcomeNullableFilter<"Appeal"> | $Enums.AppealOutcome | null
    outcomeReason?: StringNullableFilter<"Appeal"> | string | null
    adjustedAmount?: DecimalNullableFilter<"Appeal"> | Decimal | DecimalJsLike | number | string | null
    assignedTo?: StringNullableFilter<"Appeal"> | string | null
    assignedAt?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    completedBy?: StringNullableFilter<"Appeal"> | string | null
    completedAt?: DateTimeNullableFilter<"Appeal"> | Date | string | null
    processingTimeMinutes?: IntNullableFilter<"Appeal"> | number | null
    createdAt?: DateTimeFilter<"Appeal"> | Date | string
    updatedAt?: DateTimeFilter<"Appeal"> | Date | string
  }

  export type DenialCreateWithoutAppealsInput = {
    id?: string
    claimId: string
    patientId: string
    providerId: string
    payerId: string
    payerName: string
    claimStatus?: $Enums.ClaimStatus
    denialDate?: Date | string
    serviceDate: Date | string
    billedAmount: Decimal | DecimalJsLike | number | string
    allowedAmount?: Decimal | DecimalJsLike | number | string | null
    paidAmount?: Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    carcCode: string
    carcDescription: string
    rarcCodes?: DenialCreaterarcCodesInput | string[]
    groupCode: string
    procedureCode: string
    procedureModifiers?: DenialCreateprocedureModifiersInput | string[]
    diagnosisCodes?: DenialCreatediagnosisCodesInput | string[]
    placeOfService?: string | null
    x277StatusCode?: string | null
    x277StatusMessage?: string | null
    predictedRecoverable?: boolean
    recoveryProbability?: number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    denialCategory: $Enums.DenialCategory
    rootCause?: string | null
    recoveredAmount?: Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DenialUncheckedCreateWithoutAppealsInput = {
    id?: string
    claimId: string
    patientId: string
    providerId: string
    payerId: string
    payerName: string
    claimStatus?: $Enums.ClaimStatus
    denialDate?: Date | string
    serviceDate: Date | string
    billedAmount: Decimal | DecimalJsLike | number | string
    allowedAmount?: Decimal | DecimalJsLike | number | string | null
    paidAmount?: Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    carcCode: string
    carcDescription: string
    rarcCodes?: DenialCreaterarcCodesInput | string[]
    groupCode: string
    procedureCode: string
    procedureModifiers?: DenialCreateprocedureModifiersInput | string[]
    diagnosisCodes?: DenialCreatediagnosisCodesInput | string[]
    placeOfService?: string | null
    x277StatusCode?: string | null
    x277StatusMessage?: string | null
    predictedRecoverable?: boolean
    recoveryProbability?: number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    denialCategory: $Enums.DenialCategory
    rootCause?: string | null
    recoveredAmount?: Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DenialCreateOrConnectWithoutAppealsInput = {
    where: DenialWhereUniqueInput
    create: XOR<DenialCreateWithoutAppealsInput, DenialUncheckedCreateWithoutAppealsInput>
  }

  export type DenialUpsertWithoutAppealsInput = {
    update: XOR<DenialUpdateWithoutAppealsInput, DenialUncheckedUpdateWithoutAppealsInput>
    create: XOR<DenialCreateWithoutAppealsInput, DenialUncheckedCreateWithoutAppealsInput>
    where?: DenialWhereInput
  }

  export type DenialUpdateToOneWithWhereWithoutAppealsInput = {
    where?: DenialWhereInput
    data: XOR<DenialUpdateWithoutAppealsInput, DenialUncheckedUpdateWithoutAppealsInput>
  }

  export type DenialUpdateWithoutAppealsInput = {
    id?: StringFieldUpdateOperationsInput | string
    claimId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    claimStatus?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    denialDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    billedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    paidAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    carcCode?: StringFieldUpdateOperationsInput | string
    carcDescription?: StringFieldUpdateOperationsInput | string
    rarcCodes?: DenialUpdaterarcCodesInput | string[]
    groupCode?: StringFieldUpdateOperationsInput | string
    procedureCode?: StringFieldUpdateOperationsInput | string
    procedureModifiers?: DenialUpdateprocedureModifiersInput | string[]
    diagnosisCodes?: DenialUpdatediagnosisCodesInput | string[]
    placeOfService?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusCode?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    predictedRecoverable?: BoolFieldUpdateOperationsInput | boolean
    recoveryProbability?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    denialCategory?: EnumDenialCategoryFieldUpdateOperationsInput | $Enums.DenialCategory
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    recoveredAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DenialUncheckedUpdateWithoutAppealsInput = {
    id?: StringFieldUpdateOperationsInput | string
    claimId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    claimStatus?: EnumClaimStatusFieldUpdateOperationsInput | $Enums.ClaimStatus
    denialDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    billedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    paidAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    carcCode?: StringFieldUpdateOperationsInput | string
    carcDescription?: StringFieldUpdateOperationsInput | string
    rarcCodes?: DenialUpdaterarcCodesInput | string[]
    groupCode?: StringFieldUpdateOperationsInput | string
    procedureCode?: StringFieldUpdateOperationsInput | string
    procedureModifiers?: DenialUpdateprocedureModifiersInput | string[]
    diagnosisCodes?: DenialUpdatediagnosisCodesInput | string[]
    placeOfService?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusCode?: NullableStringFieldUpdateOperationsInput | string | null
    x277StatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    predictedRecoverable?: BoolFieldUpdateOperationsInput | boolean
    recoveryProbability?: NullableFloatFieldUpdateOperationsInput | number | null
    riskFactors?: NullableJsonNullValueInput | InputJsonValue
    denialCategory?: EnumDenialCategoryFieldUpdateOperationsInput | $Enums.DenialCategory
    rootCause?: NullableStringFieldUpdateOperationsInput | string | null
    recoveredAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    writeOffAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppealCreateManyDenialInput = {
    id?: string
    appealLevel?: number
    appealType: $Enums.AppealType
    status?: $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: string | null
    appealLetterHtml?: string | null
    supportingDocuments?: AppealCreatesupportingDocumentsInput | string[]
    filingDeadline: Date | string
    submittedDate?: Date | string | null
    responseDeadline?: Date | string | null
    responseDate?: Date | string | null
    outcome?: $Enums.AppealOutcome | null
    outcomeReason?: string | null
    adjustedAmount?: Decimal | DecimalJsLike | number | string | null
    assignedTo?: string | null
    assignedAt?: Date | string | null
    completedBy?: string | null
    completedAt?: Date | string | null
    processingTimeMinutes?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppealUpdateWithoutDenialInput = {
    id?: StringFieldUpdateOperationsInput | string
    appealLevel?: IntFieldUpdateOperationsInput | number
    appealType?: EnumAppealTypeFieldUpdateOperationsInput | $Enums.AppealType
    status?: EnumAppealStatusFieldUpdateOperationsInput | $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: NullableStringFieldUpdateOperationsInput | string | null
    appealLetterHtml?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocuments?: AppealUpdatesupportingDocumentsInput | string[]
    filingDeadline?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableEnumAppealOutcomeFieldUpdateOperationsInput | $Enums.AppealOutcome | null
    outcomeReason?: NullableStringFieldUpdateOperationsInput | string | null
    adjustedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppealUncheckedUpdateWithoutDenialInput = {
    id?: StringFieldUpdateOperationsInput | string
    appealLevel?: IntFieldUpdateOperationsInput | number
    appealType?: EnumAppealTypeFieldUpdateOperationsInput | $Enums.AppealType
    status?: EnumAppealStatusFieldUpdateOperationsInput | $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: NullableStringFieldUpdateOperationsInput | string | null
    appealLetterHtml?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocuments?: AppealUpdatesupportingDocumentsInput | string[]
    filingDeadline?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableEnumAppealOutcomeFieldUpdateOperationsInput | $Enums.AppealOutcome | null
    outcomeReason?: NullableStringFieldUpdateOperationsInput | string | null
    adjustedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppealUncheckedUpdateManyWithoutDenialInput = {
    id?: StringFieldUpdateOperationsInput | string
    appealLevel?: IntFieldUpdateOperationsInput | number
    appealType?: EnumAppealTypeFieldUpdateOperationsInput | $Enums.AppealType
    status?: EnumAppealStatusFieldUpdateOperationsInput | $Enums.AppealStatus
    payerAppealStrategy?: NullableJsonNullValueInput | InputJsonValue
    appealLetterContent?: NullableStringFieldUpdateOperationsInput | string | null
    appealLetterHtml?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocuments?: AppealUpdatesupportingDocumentsInput | string[]
    filingDeadline?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    responseDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableEnumAppealOutcomeFieldUpdateOperationsInput | $Enums.AppealOutcome | null
    outcomeReason?: NullableStringFieldUpdateOperationsInput | string | null
    adjustedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedBy?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    processingTimeMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use DenialCountOutputTypeDefaultArgs instead
     */
    export type DenialCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DenialCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DenialDefaultArgs instead
     */
    export type DenialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DenialDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AppealDefaultArgs instead
     */
    export type AppealArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AppealDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DenialPatternDefaultArgs instead
     */
    export type DenialPatternArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DenialPatternDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PayerConfigDefaultArgs instead
     */
    export type PayerConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PayerConfigDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StaffProductivityDefaultArgs instead
     */
    export type StaffProductivityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StaffProductivityDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RevenueRecoveryDefaultArgs instead
     */
    export type RevenueRecoveryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RevenueRecoveryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClaimRiskAssessmentDefaultArgs instead
     */
    export type ClaimRiskAssessmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClaimRiskAssessmentDefaultArgs<ExtArgs>

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