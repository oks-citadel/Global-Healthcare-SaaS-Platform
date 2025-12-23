
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
 * Model ImagingOrder
 * 
 */
export type ImagingOrder = $Result.DefaultSelection<Prisma.$ImagingOrderPayload>
/**
 * Model Study
 * 
 */
export type Study = $Result.DefaultSelection<Prisma.$StudyPayload>
/**
 * Model Image
 * 
 */
export type Image = $Result.DefaultSelection<Prisma.$ImagePayload>
/**
 * Model RadiologyReport
 * 
 */
export type RadiologyReport = $Result.DefaultSelection<Prisma.$RadiologyReportPayload>
/**
 * Model CriticalFinding
 * 
 */
export type CriticalFinding = $Result.DefaultSelection<Prisma.$CriticalFindingPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Priority: {
  STAT: 'STAT',
  URGENT: 'URGENT',
  ROUTINE: 'ROUTINE'
};

export type Priority = (typeof Priority)[keyof typeof Priority]


export const Modality: {
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

export type Modality = (typeof Modality)[keyof typeof Modality]


export const OrderStatus: {
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ON_HOLD: 'ON_HOLD'
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]


export const StudyStatus: {
  SCHEDULED: 'SCHEDULED',
  ARRIVED: 'ARRIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  PRELIMINARY: 'PRELIMINARY',
  FINAL: 'FINAL',
  CANCELLED: 'CANCELLED'
};

export type StudyStatus = (typeof StudyStatus)[keyof typeof StudyStatus]


export const ReportStatus: {
  PRELIMINARY: 'PRELIMINARY',
  FINAL: 'FINAL',
  AMENDED: 'AMENDED',
  CORRECTED: 'CORRECTED'
};

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus]


export const Severity: {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MODERATE: 'MODERATE',
  LOW: 'LOW'
};

export type Severity = (typeof Severity)[keyof typeof Severity]

}

export type Priority = $Enums.Priority

export const Priority: typeof $Enums.Priority

export type Modality = $Enums.Modality

export const Modality: typeof $Enums.Modality

export type OrderStatus = $Enums.OrderStatus

export const OrderStatus: typeof $Enums.OrderStatus

export type StudyStatus = $Enums.StudyStatus

export const StudyStatus: typeof $Enums.StudyStatus

export type ReportStatus = $Enums.ReportStatus

export const ReportStatus: typeof $Enums.ReportStatus

export type Severity = $Enums.Severity

export const Severity: typeof $Enums.Severity

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ImagingOrders
 * const imagingOrders = await prisma.imagingOrder.findMany()
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
   * // Fetch zero or more ImagingOrders
   * const imagingOrders = await prisma.imagingOrder.findMany()
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
   * `prisma.imagingOrder`: Exposes CRUD operations for the **ImagingOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImagingOrders
    * const imagingOrders = await prisma.imagingOrder.findMany()
    * ```
    */
  get imagingOrder(): Prisma.ImagingOrderDelegate<ExtArgs>;

  /**
   * `prisma.study`: Exposes CRUD operations for the **Study** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Studies
    * const studies = await prisma.study.findMany()
    * ```
    */
  get study(): Prisma.StudyDelegate<ExtArgs>;

  /**
   * `prisma.image`: Exposes CRUD operations for the **Image** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Images
    * const images = await prisma.image.findMany()
    * ```
    */
  get image(): Prisma.ImageDelegate<ExtArgs>;

  /**
   * `prisma.radiologyReport`: Exposes CRUD operations for the **RadiologyReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RadiologyReports
    * const radiologyReports = await prisma.radiologyReport.findMany()
    * ```
    */
  get radiologyReport(): Prisma.RadiologyReportDelegate<ExtArgs>;

  /**
   * `prisma.criticalFinding`: Exposes CRUD operations for the **CriticalFinding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CriticalFindings
    * const criticalFindings = await prisma.criticalFinding.findMany()
    * ```
    */
  get criticalFinding(): Prisma.CriticalFindingDelegate<ExtArgs>;
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
    ImagingOrder: 'ImagingOrder',
    Study: 'Study',
    Image: 'Image',
    RadiologyReport: 'RadiologyReport',
    CriticalFinding: 'CriticalFinding'
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
      modelProps: "imagingOrder" | "study" | "image" | "radiologyReport" | "criticalFinding"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ImagingOrder: {
        payload: Prisma.$ImagingOrderPayload<ExtArgs>
        fields: Prisma.ImagingOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImagingOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagingOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImagingOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagingOrderPayload>
          }
          findFirst: {
            args: Prisma.ImagingOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagingOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImagingOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagingOrderPayload>
          }
          findMany: {
            args: Prisma.ImagingOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagingOrderPayload>[]
          }
          create: {
            args: Prisma.ImagingOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagingOrderPayload>
          }
          createMany: {
            args: Prisma.ImagingOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImagingOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagingOrderPayload>[]
          }
          delete: {
            args: Prisma.ImagingOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagingOrderPayload>
          }
          update: {
            args: Prisma.ImagingOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagingOrderPayload>
          }
          deleteMany: {
            args: Prisma.ImagingOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImagingOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ImagingOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagingOrderPayload>
          }
          aggregate: {
            args: Prisma.ImagingOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImagingOrder>
          }
          groupBy: {
            args: Prisma.ImagingOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImagingOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImagingOrderCountArgs<ExtArgs>
            result: $Utils.Optional<ImagingOrderCountAggregateOutputType> | number
          }
        }
      }
      Study: {
        payload: Prisma.$StudyPayload<ExtArgs>
        fields: Prisma.StudyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyPayload>
          }
          findFirst: {
            args: Prisma.StudyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyPayload>
          }
          findMany: {
            args: Prisma.StudyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyPayload>[]
          }
          create: {
            args: Prisma.StudyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyPayload>
          }
          createMany: {
            args: Prisma.StudyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyPayload>[]
          }
          delete: {
            args: Prisma.StudyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyPayload>
          }
          update: {
            args: Prisma.StudyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyPayload>
          }
          deleteMany: {
            args: Prisma.StudyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StudyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudyPayload>
          }
          aggregate: {
            args: Prisma.StudyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudy>
          }
          groupBy: {
            args: Prisma.StudyGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudyGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudyCountArgs<ExtArgs>
            result: $Utils.Optional<StudyCountAggregateOutputType> | number
          }
        }
      }
      Image: {
        payload: Prisma.$ImagePayload<ExtArgs>
        fields: Prisma.ImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          findFirst: {
            args: Prisma.ImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          findMany: {
            args: Prisma.ImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>[]
          }
          create: {
            args: Prisma.ImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          createMany: {
            args: Prisma.ImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>[]
          }
          delete: {
            args: Prisma.ImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          update: {
            args: Prisma.ImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          deleteMany: {
            args: Prisma.ImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          aggregate: {
            args: Prisma.ImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImage>
          }
          groupBy: {
            args: Prisma.ImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImageCountArgs<ExtArgs>
            result: $Utils.Optional<ImageCountAggregateOutputType> | number
          }
        }
      }
      RadiologyReport: {
        payload: Prisma.$RadiologyReportPayload<ExtArgs>
        fields: Prisma.RadiologyReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RadiologyReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RadiologyReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RadiologyReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RadiologyReportPayload>
          }
          findFirst: {
            args: Prisma.RadiologyReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RadiologyReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RadiologyReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RadiologyReportPayload>
          }
          findMany: {
            args: Prisma.RadiologyReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RadiologyReportPayload>[]
          }
          create: {
            args: Prisma.RadiologyReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RadiologyReportPayload>
          }
          createMany: {
            args: Prisma.RadiologyReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RadiologyReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RadiologyReportPayload>[]
          }
          delete: {
            args: Prisma.RadiologyReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RadiologyReportPayload>
          }
          update: {
            args: Prisma.RadiologyReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RadiologyReportPayload>
          }
          deleteMany: {
            args: Prisma.RadiologyReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RadiologyReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RadiologyReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RadiologyReportPayload>
          }
          aggregate: {
            args: Prisma.RadiologyReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRadiologyReport>
          }
          groupBy: {
            args: Prisma.RadiologyReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<RadiologyReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.RadiologyReportCountArgs<ExtArgs>
            result: $Utils.Optional<RadiologyReportCountAggregateOutputType> | number
          }
        }
      }
      CriticalFinding: {
        payload: Prisma.$CriticalFindingPayload<ExtArgs>
        fields: Prisma.CriticalFindingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CriticalFindingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CriticalFindingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CriticalFindingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CriticalFindingPayload>
          }
          findFirst: {
            args: Prisma.CriticalFindingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CriticalFindingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CriticalFindingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CriticalFindingPayload>
          }
          findMany: {
            args: Prisma.CriticalFindingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CriticalFindingPayload>[]
          }
          create: {
            args: Prisma.CriticalFindingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CriticalFindingPayload>
          }
          createMany: {
            args: Prisma.CriticalFindingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CriticalFindingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CriticalFindingPayload>[]
          }
          delete: {
            args: Prisma.CriticalFindingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CriticalFindingPayload>
          }
          update: {
            args: Prisma.CriticalFindingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CriticalFindingPayload>
          }
          deleteMany: {
            args: Prisma.CriticalFindingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CriticalFindingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CriticalFindingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CriticalFindingPayload>
          }
          aggregate: {
            args: Prisma.CriticalFindingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCriticalFinding>
          }
          groupBy: {
            args: Prisma.CriticalFindingGroupByArgs<ExtArgs>
            result: $Utils.Optional<CriticalFindingGroupByOutputType>[]
          }
          count: {
            args: Prisma.CriticalFindingCountArgs<ExtArgs>
            result: $Utils.Optional<CriticalFindingCountAggregateOutputType> | number
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
   * Count Type ImagingOrderCountOutputType
   */

  export type ImagingOrderCountOutputType = {
    studies: number
  }

  export type ImagingOrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studies?: boolean | ImagingOrderCountOutputTypeCountStudiesArgs
  }

  // Custom InputTypes
  /**
   * ImagingOrderCountOutputType without action
   */
  export type ImagingOrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrderCountOutputType
     */
    select?: ImagingOrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ImagingOrderCountOutputType without action
   */
  export type ImagingOrderCountOutputTypeCountStudiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudyWhereInput
  }


  /**
   * Count Type StudyCountOutputType
   */

  export type StudyCountOutputType = {
    images: number
    reports: number
    criticalFindings: number
  }

  export type StudyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | StudyCountOutputTypeCountImagesArgs
    reports?: boolean | StudyCountOutputTypeCountReportsArgs
    criticalFindings?: boolean | StudyCountOutputTypeCountCriticalFindingsArgs
  }

  // Custom InputTypes
  /**
   * StudyCountOutputType without action
   */
  export type StudyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudyCountOutputType
     */
    select?: StudyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StudyCountOutputType without action
   */
  export type StudyCountOutputTypeCountImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageWhereInput
  }

  /**
   * StudyCountOutputType without action
   */
  export type StudyCountOutputTypeCountReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RadiologyReportWhereInput
  }

  /**
   * StudyCountOutputType without action
   */
  export type StudyCountOutputTypeCountCriticalFindingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CriticalFindingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ImagingOrder
   */

  export type AggregateImagingOrder = {
    _count: ImagingOrderCountAggregateOutputType | null
    _min: ImagingOrderMinAggregateOutputType | null
    _max: ImagingOrderMaxAggregateOutputType | null
  }

  export type ImagingOrderMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    facilityId: string | null
    orderNumber: string | null
    priority: $Enums.Priority | null
    modality: $Enums.Modality | null
    bodyPart: string | null
    clinicalIndication: string | null
    instructions: string | null
    urgency: string | null
    transportRequired: boolean | null
    contrastAllergy: boolean | null
    contrastNotes: string | null
    status: $Enums.OrderStatus | null
    scheduledAt: Date | null
    requestedBy: string | null
    requestedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImagingOrderMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    facilityId: string | null
    orderNumber: string | null
    priority: $Enums.Priority | null
    modality: $Enums.Modality | null
    bodyPart: string | null
    clinicalIndication: string | null
    instructions: string | null
    urgency: string | null
    transportRequired: boolean | null
    contrastAllergy: boolean | null
    contrastNotes: string | null
    status: $Enums.OrderStatus | null
    scheduledAt: Date | null
    requestedBy: string | null
    requestedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImagingOrderCountAggregateOutputType = {
    id: number
    patientId: number
    providerId: number
    facilityId: number
    orderNumber: number
    priority: number
    modality: number
    bodyPart: number
    clinicalIndication: number
    instructions: number
    urgency: number
    transportRequired: number
    contrastAllergy: number
    contrastNotes: number
    status: number
    scheduledAt: number
    requestedBy: number
    requestedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ImagingOrderMinAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    facilityId?: true
    orderNumber?: true
    priority?: true
    modality?: true
    bodyPart?: true
    clinicalIndication?: true
    instructions?: true
    urgency?: true
    transportRequired?: true
    contrastAllergy?: true
    contrastNotes?: true
    status?: true
    scheduledAt?: true
    requestedBy?: true
    requestedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImagingOrderMaxAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    facilityId?: true
    orderNumber?: true
    priority?: true
    modality?: true
    bodyPart?: true
    clinicalIndication?: true
    instructions?: true
    urgency?: true
    transportRequired?: true
    contrastAllergy?: true
    contrastNotes?: true
    status?: true
    scheduledAt?: true
    requestedBy?: true
    requestedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImagingOrderCountAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    facilityId?: true
    orderNumber?: true
    priority?: true
    modality?: true
    bodyPart?: true
    clinicalIndication?: true
    instructions?: true
    urgency?: true
    transportRequired?: true
    contrastAllergy?: true
    contrastNotes?: true
    status?: true
    scheduledAt?: true
    requestedBy?: true
    requestedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ImagingOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImagingOrder to aggregate.
     */
    where?: ImagingOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagingOrders to fetch.
     */
    orderBy?: ImagingOrderOrderByWithRelationInput | ImagingOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImagingOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagingOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagingOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImagingOrders
    **/
    _count?: true | ImagingOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImagingOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImagingOrderMaxAggregateInputType
  }

  export type GetImagingOrderAggregateType<T extends ImagingOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateImagingOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImagingOrder[P]>
      : GetScalarType<T[P], AggregateImagingOrder[P]>
  }




  export type ImagingOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImagingOrderWhereInput
    orderBy?: ImagingOrderOrderByWithAggregationInput | ImagingOrderOrderByWithAggregationInput[]
    by: ImagingOrderScalarFieldEnum[] | ImagingOrderScalarFieldEnum
    having?: ImagingOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImagingOrderCountAggregateInputType | true
    _min?: ImagingOrderMinAggregateInputType
    _max?: ImagingOrderMaxAggregateInputType
  }

  export type ImagingOrderGroupByOutputType = {
    id: string
    patientId: string
    providerId: string
    facilityId: string
    orderNumber: string
    priority: $Enums.Priority
    modality: $Enums.Modality
    bodyPart: string
    clinicalIndication: string
    instructions: string | null
    urgency: string | null
    transportRequired: boolean
    contrastAllergy: boolean
    contrastNotes: string | null
    status: $Enums.OrderStatus
    scheduledAt: Date | null
    requestedBy: string
    requestedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: ImagingOrderCountAggregateOutputType | null
    _min: ImagingOrderMinAggregateOutputType | null
    _max: ImagingOrderMaxAggregateOutputType | null
  }

  type GetImagingOrderGroupByPayload<T extends ImagingOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImagingOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImagingOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImagingOrderGroupByOutputType[P]>
            : GetScalarType<T[P], ImagingOrderGroupByOutputType[P]>
        }
      >
    >


  export type ImagingOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    facilityId?: boolean
    orderNumber?: boolean
    priority?: boolean
    modality?: boolean
    bodyPart?: boolean
    clinicalIndication?: boolean
    instructions?: boolean
    urgency?: boolean
    transportRequired?: boolean
    contrastAllergy?: boolean
    contrastNotes?: boolean
    status?: boolean
    scheduledAt?: boolean
    requestedBy?: boolean
    requestedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    studies?: boolean | ImagingOrder$studiesArgs<ExtArgs>
    _count?: boolean | ImagingOrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imagingOrder"]>

  export type ImagingOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    facilityId?: boolean
    orderNumber?: boolean
    priority?: boolean
    modality?: boolean
    bodyPart?: boolean
    clinicalIndication?: boolean
    instructions?: boolean
    urgency?: boolean
    transportRequired?: boolean
    contrastAllergy?: boolean
    contrastNotes?: boolean
    status?: boolean
    scheduledAt?: boolean
    requestedBy?: boolean
    requestedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["imagingOrder"]>

  export type ImagingOrderSelectScalar = {
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    facilityId?: boolean
    orderNumber?: boolean
    priority?: boolean
    modality?: boolean
    bodyPart?: boolean
    clinicalIndication?: boolean
    instructions?: boolean
    urgency?: boolean
    transportRequired?: boolean
    contrastAllergy?: boolean
    contrastNotes?: boolean
    status?: boolean
    scheduledAt?: boolean
    requestedBy?: boolean
    requestedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ImagingOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studies?: boolean | ImagingOrder$studiesArgs<ExtArgs>
    _count?: boolean | ImagingOrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ImagingOrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ImagingOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImagingOrder"
    objects: {
      studies: Prisma.$StudyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      providerId: string
      facilityId: string
      orderNumber: string
      priority: $Enums.Priority
      modality: $Enums.Modality
      bodyPart: string
      clinicalIndication: string
      instructions: string | null
      urgency: string | null
      transportRequired: boolean
      contrastAllergy: boolean
      contrastNotes: string | null
      status: $Enums.OrderStatus
      scheduledAt: Date | null
      requestedBy: string
      requestedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["imagingOrder"]>
    composites: {}
  }

  type ImagingOrderGetPayload<S extends boolean | null | undefined | ImagingOrderDefaultArgs> = $Result.GetResult<Prisma.$ImagingOrderPayload, S>

  type ImagingOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ImagingOrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ImagingOrderCountAggregateInputType | true
    }

  export interface ImagingOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImagingOrder'], meta: { name: 'ImagingOrder' } }
    /**
     * Find zero or one ImagingOrder that matches the filter.
     * @param {ImagingOrderFindUniqueArgs} args - Arguments to find a ImagingOrder
     * @example
     * // Get one ImagingOrder
     * const imagingOrder = await prisma.imagingOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImagingOrderFindUniqueArgs>(args: SelectSubset<T, ImagingOrderFindUniqueArgs<ExtArgs>>): Prisma__ImagingOrderClient<$Result.GetResult<Prisma.$ImagingOrderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ImagingOrder that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ImagingOrderFindUniqueOrThrowArgs} args - Arguments to find a ImagingOrder
     * @example
     * // Get one ImagingOrder
     * const imagingOrder = await prisma.imagingOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImagingOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, ImagingOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImagingOrderClient<$Result.GetResult<Prisma.$ImagingOrderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ImagingOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagingOrderFindFirstArgs} args - Arguments to find a ImagingOrder
     * @example
     * // Get one ImagingOrder
     * const imagingOrder = await prisma.imagingOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImagingOrderFindFirstArgs>(args?: SelectSubset<T, ImagingOrderFindFirstArgs<ExtArgs>>): Prisma__ImagingOrderClient<$Result.GetResult<Prisma.$ImagingOrderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ImagingOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagingOrderFindFirstOrThrowArgs} args - Arguments to find a ImagingOrder
     * @example
     * // Get one ImagingOrder
     * const imagingOrder = await prisma.imagingOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImagingOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, ImagingOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImagingOrderClient<$Result.GetResult<Prisma.$ImagingOrderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ImagingOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagingOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImagingOrders
     * const imagingOrders = await prisma.imagingOrder.findMany()
     * 
     * // Get first 10 ImagingOrders
     * const imagingOrders = await prisma.imagingOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imagingOrderWithIdOnly = await prisma.imagingOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImagingOrderFindManyArgs>(args?: SelectSubset<T, ImagingOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagingOrderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ImagingOrder.
     * @param {ImagingOrderCreateArgs} args - Arguments to create a ImagingOrder.
     * @example
     * // Create one ImagingOrder
     * const ImagingOrder = await prisma.imagingOrder.create({
     *   data: {
     *     // ... data to create a ImagingOrder
     *   }
     * })
     * 
     */
    create<T extends ImagingOrderCreateArgs>(args: SelectSubset<T, ImagingOrderCreateArgs<ExtArgs>>): Prisma__ImagingOrderClient<$Result.GetResult<Prisma.$ImagingOrderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ImagingOrders.
     * @param {ImagingOrderCreateManyArgs} args - Arguments to create many ImagingOrders.
     * @example
     * // Create many ImagingOrders
     * const imagingOrder = await prisma.imagingOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImagingOrderCreateManyArgs>(args?: SelectSubset<T, ImagingOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImagingOrders and returns the data saved in the database.
     * @param {ImagingOrderCreateManyAndReturnArgs} args - Arguments to create many ImagingOrders.
     * @example
     * // Create many ImagingOrders
     * const imagingOrder = await prisma.imagingOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImagingOrders and only return the `id`
     * const imagingOrderWithIdOnly = await prisma.imagingOrder.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImagingOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, ImagingOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagingOrderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ImagingOrder.
     * @param {ImagingOrderDeleteArgs} args - Arguments to delete one ImagingOrder.
     * @example
     * // Delete one ImagingOrder
     * const ImagingOrder = await prisma.imagingOrder.delete({
     *   where: {
     *     // ... filter to delete one ImagingOrder
     *   }
     * })
     * 
     */
    delete<T extends ImagingOrderDeleteArgs>(args: SelectSubset<T, ImagingOrderDeleteArgs<ExtArgs>>): Prisma__ImagingOrderClient<$Result.GetResult<Prisma.$ImagingOrderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ImagingOrder.
     * @param {ImagingOrderUpdateArgs} args - Arguments to update one ImagingOrder.
     * @example
     * // Update one ImagingOrder
     * const imagingOrder = await prisma.imagingOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImagingOrderUpdateArgs>(args: SelectSubset<T, ImagingOrderUpdateArgs<ExtArgs>>): Prisma__ImagingOrderClient<$Result.GetResult<Prisma.$ImagingOrderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ImagingOrders.
     * @param {ImagingOrderDeleteManyArgs} args - Arguments to filter ImagingOrders to delete.
     * @example
     * // Delete a few ImagingOrders
     * const { count } = await prisma.imagingOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImagingOrderDeleteManyArgs>(args?: SelectSubset<T, ImagingOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImagingOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagingOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImagingOrders
     * const imagingOrder = await prisma.imagingOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImagingOrderUpdateManyArgs>(args: SelectSubset<T, ImagingOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ImagingOrder.
     * @param {ImagingOrderUpsertArgs} args - Arguments to update or create a ImagingOrder.
     * @example
     * // Update or create a ImagingOrder
     * const imagingOrder = await prisma.imagingOrder.upsert({
     *   create: {
     *     // ... data to create a ImagingOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImagingOrder we want to update
     *   }
     * })
     */
    upsert<T extends ImagingOrderUpsertArgs>(args: SelectSubset<T, ImagingOrderUpsertArgs<ExtArgs>>): Prisma__ImagingOrderClient<$Result.GetResult<Prisma.$ImagingOrderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ImagingOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagingOrderCountArgs} args - Arguments to filter ImagingOrders to count.
     * @example
     * // Count the number of ImagingOrders
     * const count = await prisma.imagingOrder.count({
     *   where: {
     *     // ... the filter for the ImagingOrders we want to count
     *   }
     * })
    **/
    count<T extends ImagingOrderCountArgs>(
      args?: Subset<T, ImagingOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImagingOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImagingOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagingOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImagingOrderAggregateArgs>(args: Subset<T, ImagingOrderAggregateArgs>): Prisma.PrismaPromise<GetImagingOrderAggregateType<T>>

    /**
     * Group by ImagingOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagingOrderGroupByArgs} args - Group by arguments.
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
      T extends ImagingOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImagingOrderGroupByArgs['orderBy'] }
        : { orderBy?: ImagingOrderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImagingOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImagingOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImagingOrder model
   */
  readonly fields: ImagingOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImagingOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImagingOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    studies<T extends ImagingOrder$studiesArgs<ExtArgs> = {}>(args?: Subset<T, ImagingOrder$studiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the ImagingOrder model
   */ 
  interface ImagingOrderFieldRefs {
    readonly id: FieldRef<"ImagingOrder", 'String'>
    readonly patientId: FieldRef<"ImagingOrder", 'String'>
    readonly providerId: FieldRef<"ImagingOrder", 'String'>
    readonly facilityId: FieldRef<"ImagingOrder", 'String'>
    readonly orderNumber: FieldRef<"ImagingOrder", 'String'>
    readonly priority: FieldRef<"ImagingOrder", 'Priority'>
    readonly modality: FieldRef<"ImagingOrder", 'Modality'>
    readonly bodyPart: FieldRef<"ImagingOrder", 'String'>
    readonly clinicalIndication: FieldRef<"ImagingOrder", 'String'>
    readonly instructions: FieldRef<"ImagingOrder", 'String'>
    readonly urgency: FieldRef<"ImagingOrder", 'String'>
    readonly transportRequired: FieldRef<"ImagingOrder", 'Boolean'>
    readonly contrastAllergy: FieldRef<"ImagingOrder", 'Boolean'>
    readonly contrastNotes: FieldRef<"ImagingOrder", 'String'>
    readonly status: FieldRef<"ImagingOrder", 'OrderStatus'>
    readonly scheduledAt: FieldRef<"ImagingOrder", 'DateTime'>
    readonly requestedBy: FieldRef<"ImagingOrder", 'String'>
    readonly requestedAt: FieldRef<"ImagingOrder", 'DateTime'>
    readonly createdAt: FieldRef<"ImagingOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"ImagingOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImagingOrder findUnique
   */
  export type ImagingOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrder
     */
    select?: ImagingOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagingOrderInclude<ExtArgs> | null
    /**
     * Filter, which ImagingOrder to fetch.
     */
    where: ImagingOrderWhereUniqueInput
  }

  /**
   * ImagingOrder findUniqueOrThrow
   */
  export type ImagingOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrder
     */
    select?: ImagingOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagingOrderInclude<ExtArgs> | null
    /**
     * Filter, which ImagingOrder to fetch.
     */
    where: ImagingOrderWhereUniqueInput
  }

  /**
   * ImagingOrder findFirst
   */
  export type ImagingOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrder
     */
    select?: ImagingOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagingOrderInclude<ExtArgs> | null
    /**
     * Filter, which ImagingOrder to fetch.
     */
    where?: ImagingOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagingOrders to fetch.
     */
    orderBy?: ImagingOrderOrderByWithRelationInput | ImagingOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImagingOrders.
     */
    cursor?: ImagingOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagingOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagingOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImagingOrders.
     */
    distinct?: ImagingOrderScalarFieldEnum | ImagingOrderScalarFieldEnum[]
  }

  /**
   * ImagingOrder findFirstOrThrow
   */
  export type ImagingOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrder
     */
    select?: ImagingOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagingOrderInclude<ExtArgs> | null
    /**
     * Filter, which ImagingOrder to fetch.
     */
    where?: ImagingOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagingOrders to fetch.
     */
    orderBy?: ImagingOrderOrderByWithRelationInput | ImagingOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImagingOrders.
     */
    cursor?: ImagingOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagingOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagingOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImagingOrders.
     */
    distinct?: ImagingOrderScalarFieldEnum | ImagingOrderScalarFieldEnum[]
  }

  /**
   * ImagingOrder findMany
   */
  export type ImagingOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrder
     */
    select?: ImagingOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagingOrderInclude<ExtArgs> | null
    /**
     * Filter, which ImagingOrders to fetch.
     */
    where?: ImagingOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagingOrders to fetch.
     */
    orderBy?: ImagingOrderOrderByWithRelationInput | ImagingOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImagingOrders.
     */
    cursor?: ImagingOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagingOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagingOrders.
     */
    skip?: number
    distinct?: ImagingOrderScalarFieldEnum | ImagingOrderScalarFieldEnum[]
  }

  /**
   * ImagingOrder create
   */
  export type ImagingOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrder
     */
    select?: ImagingOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagingOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a ImagingOrder.
     */
    data: XOR<ImagingOrderCreateInput, ImagingOrderUncheckedCreateInput>
  }

  /**
   * ImagingOrder createMany
   */
  export type ImagingOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImagingOrders.
     */
    data: ImagingOrderCreateManyInput | ImagingOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImagingOrder createManyAndReturn
   */
  export type ImagingOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrder
     */
    select?: ImagingOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ImagingOrders.
     */
    data: ImagingOrderCreateManyInput | ImagingOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImagingOrder update
   */
  export type ImagingOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrder
     */
    select?: ImagingOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagingOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a ImagingOrder.
     */
    data: XOR<ImagingOrderUpdateInput, ImagingOrderUncheckedUpdateInput>
    /**
     * Choose, which ImagingOrder to update.
     */
    where: ImagingOrderWhereUniqueInput
  }

  /**
   * ImagingOrder updateMany
   */
  export type ImagingOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImagingOrders.
     */
    data: XOR<ImagingOrderUpdateManyMutationInput, ImagingOrderUncheckedUpdateManyInput>
    /**
     * Filter which ImagingOrders to update
     */
    where?: ImagingOrderWhereInput
  }

  /**
   * ImagingOrder upsert
   */
  export type ImagingOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrder
     */
    select?: ImagingOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagingOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the ImagingOrder to update in case it exists.
     */
    where: ImagingOrderWhereUniqueInput
    /**
     * In case the ImagingOrder found by the `where` argument doesn't exist, create a new ImagingOrder with this data.
     */
    create: XOR<ImagingOrderCreateInput, ImagingOrderUncheckedCreateInput>
    /**
     * In case the ImagingOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImagingOrderUpdateInput, ImagingOrderUncheckedUpdateInput>
  }

  /**
   * ImagingOrder delete
   */
  export type ImagingOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrder
     */
    select?: ImagingOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagingOrderInclude<ExtArgs> | null
    /**
     * Filter which ImagingOrder to delete.
     */
    where: ImagingOrderWhereUniqueInput
  }

  /**
   * ImagingOrder deleteMany
   */
  export type ImagingOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImagingOrders to delete
     */
    where?: ImagingOrderWhereInput
  }

  /**
   * ImagingOrder.studies
   */
  export type ImagingOrder$studiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyInclude<ExtArgs> | null
    where?: StudyWhereInput
    orderBy?: StudyOrderByWithRelationInput | StudyOrderByWithRelationInput[]
    cursor?: StudyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudyScalarFieldEnum | StudyScalarFieldEnum[]
  }

  /**
   * ImagingOrder without action
   */
  export type ImagingOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagingOrder
     */
    select?: ImagingOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagingOrderInclude<ExtArgs> | null
  }


  /**
   * Model Study
   */

  export type AggregateStudy = {
    _count: StudyCountAggregateOutputType | null
    _avg: StudyAvgAggregateOutputType | null
    _sum: StudySumAggregateOutputType | null
    _min: StudyMinAggregateOutputType | null
    _max: StudyMaxAggregateOutputType | null
  }

  export type StudyAvgAggregateOutputType = {
    numberOfSeries: number | null
    numberOfInstances: number | null
  }

  export type StudySumAggregateOutputType = {
    numberOfSeries: number | null
    numberOfInstances: number | null
  }

  export type StudyMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    accessionNumber: string | null
    studyInstanceUID: string | null
    studyDate: Date | null
    studyTime: string | null
    studyDescription: string | null
    modality: $Enums.Modality | null
    bodyPart: string | null
    numberOfSeries: number | null
    numberOfInstances: number | null
    patientId: string | null
    patientName: string | null
    patientDOB: Date | null
    patientSex: string | null
    performingPhysician: string | null
    operatorName: string | null
    institutionName: string | null
    stationName: string | null
    status: $Enums.StudyStatus | null
    priority: $Enums.Priority | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudyMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    accessionNumber: string | null
    studyInstanceUID: string | null
    studyDate: Date | null
    studyTime: string | null
    studyDescription: string | null
    modality: $Enums.Modality | null
    bodyPart: string | null
    numberOfSeries: number | null
    numberOfInstances: number | null
    patientId: string | null
    patientName: string | null
    patientDOB: Date | null
    patientSex: string | null
    performingPhysician: string | null
    operatorName: string | null
    institutionName: string | null
    stationName: string | null
    status: $Enums.StudyStatus | null
    priority: $Enums.Priority | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudyCountAggregateOutputType = {
    id: number
    orderId: number
    accessionNumber: number
    studyInstanceUID: number
    studyDate: number
    studyTime: number
    studyDescription: number
    modality: number
    bodyPart: number
    numberOfSeries: number
    numberOfInstances: number
    patientId: number
    patientName: number
    patientDOB: number
    patientSex: number
    performingPhysician: number
    operatorName: number
    institutionName: number
    stationName: number
    status: number
    priority: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StudyAvgAggregateInputType = {
    numberOfSeries?: true
    numberOfInstances?: true
  }

  export type StudySumAggregateInputType = {
    numberOfSeries?: true
    numberOfInstances?: true
  }

  export type StudyMinAggregateInputType = {
    id?: true
    orderId?: true
    accessionNumber?: true
    studyInstanceUID?: true
    studyDate?: true
    studyTime?: true
    studyDescription?: true
    modality?: true
    bodyPart?: true
    numberOfSeries?: true
    numberOfInstances?: true
    patientId?: true
    patientName?: true
    patientDOB?: true
    patientSex?: true
    performingPhysician?: true
    operatorName?: true
    institutionName?: true
    stationName?: true
    status?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudyMaxAggregateInputType = {
    id?: true
    orderId?: true
    accessionNumber?: true
    studyInstanceUID?: true
    studyDate?: true
    studyTime?: true
    studyDescription?: true
    modality?: true
    bodyPart?: true
    numberOfSeries?: true
    numberOfInstances?: true
    patientId?: true
    patientName?: true
    patientDOB?: true
    patientSex?: true
    performingPhysician?: true
    operatorName?: true
    institutionName?: true
    stationName?: true
    status?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudyCountAggregateInputType = {
    id?: true
    orderId?: true
    accessionNumber?: true
    studyInstanceUID?: true
    studyDate?: true
    studyTime?: true
    studyDescription?: true
    modality?: true
    bodyPart?: true
    numberOfSeries?: true
    numberOfInstances?: true
    patientId?: true
    patientName?: true
    patientDOB?: true
    patientSex?: true
    performingPhysician?: true
    operatorName?: true
    institutionName?: true
    stationName?: true
    status?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StudyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Study to aggregate.
     */
    where?: StudyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Studies to fetch.
     */
    orderBy?: StudyOrderByWithRelationInput | StudyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Studies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Studies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Studies
    **/
    _count?: true | StudyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StudyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StudySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudyMaxAggregateInputType
  }

  export type GetStudyAggregateType<T extends StudyAggregateArgs> = {
        [P in keyof T & keyof AggregateStudy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudy[P]>
      : GetScalarType<T[P], AggregateStudy[P]>
  }




  export type StudyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudyWhereInput
    orderBy?: StudyOrderByWithAggregationInput | StudyOrderByWithAggregationInput[]
    by: StudyScalarFieldEnum[] | StudyScalarFieldEnum
    having?: StudyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudyCountAggregateInputType | true
    _avg?: StudyAvgAggregateInputType
    _sum?: StudySumAggregateInputType
    _min?: StudyMinAggregateInputType
    _max?: StudyMaxAggregateInputType
  }

  export type StudyGroupByOutputType = {
    id: string
    orderId: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date
    studyTime: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries: number
    numberOfInstances: number
    patientId: string
    patientName: string
    patientDOB: Date | null
    patientSex: string | null
    performingPhysician: string | null
    operatorName: string | null
    institutionName: string | null
    stationName: string | null
    status: $Enums.StudyStatus
    priority: $Enums.Priority
    createdAt: Date
    updatedAt: Date
    _count: StudyCountAggregateOutputType | null
    _avg: StudyAvgAggregateOutputType | null
    _sum: StudySumAggregateOutputType | null
    _min: StudyMinAggregateOutputType | null
    _max: StudyMaxAggregateOutputType | null
  }

  type GetStudyGroupByPayload<T extends StudyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudyGroupByOutputType[P]>
            : GetScalarType<T[P], StudyGroupByOutputType[P]>
        }
      >
    >


  export type StudySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    accessionNumber?: boolean
    studyInstanceUID?: boolean
    studyDate?: boolean
    studyTime?: boolean
    studyDescription?: boolean
    modality?: boolean
    bodyPart?: boolean
    numberOfSeries?: boolean
    numberOfInstances?: boolean
    patientId?: boolean
    patientName?: boolean
    patientDOB?: boolean
    patientSex?: boolean
    performingPhysician?: boolean
    operatorName?: boolean
    institutionName?: boolean
    stationName?: boolean
    status?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | ImagingOrderDefaultArgs<ExtArgs>
    images?: boolean | Study$imagesArgs<ExtArgs>
    reports?: boolean | Study$reportsArgs<ExtArgs>
    criticalFindings?: boolean | Study$criticalFindingsArgs<ExtArgs>
    _count?: boolean | StudyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["study"]>

  export type StudySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    accessionNumber?: boolean
    studyInstanceUID?: boolean
    studyDate?: boolean
    studyTime?: boolean
    studyDescription?: boolean
    modality?: boolean
    bodyPart?: boolean
    numberOfSeries?: boolean
    numberOfInstances?: boolean
    patientId?: boolean
    patientName?: boolean
    patientDOB?: boolean
    patientSex?: boolean
    performingPhysician?: boolean
    operatorName?: boolean
    institutionName?: boolean
    stationName?: boolean
    status?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | ImagingOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["study"]>

  export type StudySelectScalar = {
    id?: boolean
    orderId?: boolean
    accessionNumber?: boolean
    studyInstanceUID?: boolean
    studyDate?: boolean
    studyTime?: boolean
    studyDescription?: boolean
    modality?: boolean
    bodyPart?: boolean
    numberOfSeries?: boolean
    numberOfInstances?: boolean
    patientId?: boolean
    patientName?: boolean
    patientDOB?: boolean
    patientSex?: boolean
    performingPhysician?: boolean
    operatorName?: boolean
    institutionName?: boolean
    stationName?: boolean
    status?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StudyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | ImagingOrderDefaultArgs<ExtArgs>
    images?: boolean | Study$imagesArgs<ExtArgs>
    reports?: boolean | Study$reportsArgs<ExtArgs>
    criticalFindings?: boolean | Study$criticalFindingsArgs<ExtArgs>
    _count?: boolean | StudyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StudyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | ImagingOrderDefaultArgs<ExtArgs>
  }

  export type $StudyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Study"
    objects: {
      order: Prisma.$ImagingOrderPayload<ExtArgs>
      images: Prisma.$ImagePayload<ExtArgs>[]
      reports: Prisma.$RadiologyReportPayload<ExtArgs>[]
      criticalFindings: Prisma.$CriticalFindingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      accessionNumber: string
      studyInstanceUID: string
      studyDate: Date
      studyTime: string | null
      studyDescription: string
      modality: $Enums.Modality
      bodyPart: string
      numberOfSeries: number
      numberOfInstances: number
      patientId: string
      patientName: string
      patientDOB: Date | null
      patientSex: string | null
      performingPhysician: string | null
      operatorName: string | null
      institutionName: string | null
      stationName: string | null
      status: $Enums.StudyStatus
      priority: $Enums.Priority
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["study"]>
    composites: {}
  }

  type StudyGetPayload<S extends boolean | null | undefined | StudyDefaultArgs> = $Result.GetResult<Prisma.$StudyPayload, S>

  type StudyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StudyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StudyCountAggregateInputType | true
    }

  export interface StudyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Study'], meta: { name: 'Study' } }
    /**
     * Find zero or one Study that matches the filter.
     * @param {StudyFindUniqueArgs} args - Arguments to find a Study
     * @example
     * // Get one Study
     * const study = await prisma.study.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudyFindUniqueArgs>(args: SelectSubset<T, StudyFindUniqueArgs<ExtArgs>>): Prisma__StudyClient<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Study that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StudyFindUniqueOrThrowArgs} args - Arguments to find a Study
     * @example
     * // Get one Study
     * const study = await prisma.study.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudyFindUniqueOrThrowArgs>(args: SelectSubset<T, StudyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudyClient<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Study that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyFindFirstArgs} args - Arguments to find a Study
     * @example
     * // Get one Study
     * const study = await prisma.study.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudyFindFirstArgs>(args?: SelectSubset<T, StudyFindFirstArgs<ExtArgs>>): Prisma__StudyClient<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Study that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyFindFirstOrThrowArgs} args - Arguments to find a Study
     * @example
     * // Get one Study
     * const study = await prisma.study.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudyFindFirstOrThrowArgs>(args?: SelectSubset<T, StudyFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudyClient<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Studies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Studies
     * const studies = await prisma.study.findMany()
     * 
     * // Get first 10 Studies
     * const studies = await prisma.study.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studyWithIdOnly = await prisma.study.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudyFindManyArgs>(args?: SelectSubset<T, StudyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Study.
     * @param {StudyCreateArgs} args - Arguments to create a Study.
     * @example
     * // Create one Study
     * const Study = await prisma.study.create({
     *   data: {
     *     // ... data to create a Study
     *   }
     * })
     * 
     */
    create<T extends StudyCreateArgs>(args: SelectSubset<T, StudyCreateArgs<ExtArgs>>): Prisma__StudyClient<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Studies.
     * @param {StudyCreateManyArgs} args - Arguments to create many Studies.
     * @example
     * // Create many Studies
     * const study = await prisma.study.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudyCreateManyArgs>(args?: SelectSubset<T, StudyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Studies and returns the data saved in the database.
     * @param {StudyCreateManyAndReturnArgs} args - Arguments to create many Studies.
     * @example
     * // Create many Studies
     * const study = await prisma.study.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Studies and only return the `id`
     * const studyWithIdOnly = await prisma.study.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudyCreateManyAndReturnArgs>(args?: SelectSubset<T, StudyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Study.
     * @param {StudyDeleteArgs} args - Arguments to delete one Study.
     * @example
     * // Delete one Study
     * const Study = await prisma.study.delete({
     *   where: {
     *     // ... filter to delete one Study
     *   }
     * })
     * 
     */
    delete<T extends StudyDeleteArgs>(args: SelectSubset<T, StudyDeleteArgs<ExtArgs>>): Prisma__StudyClient<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Study.
     * @param {StudyUpdateArgs} args - Arguments to update one Study.
     * @example
     * // Update one Study
     * const study = await prisma.study.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudyUpdateArgs>(args: SelectSubset<T, StudyUpdateArgs<ExtArgs>>): Prisma__StudyClient<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Studies.
     * @param {StudyDeleteManyArgs} args - Arguments to filter Studies to delete.
     * @example
     * // Delete a few Studies
     * const { count } = await prisma.study.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudyDeleteManyArgs>(args?: SelectSubset<T, StudyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Studies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Studies
     * const study = await prisma.study.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudyUpdateManyArgs>(args: SelectSubset<T, StudyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Study.
     * @param {StudyUpsertArgs} args - Arguments to update or create a Study.
     * @example
     * // Update or create a Study
     * const study = await prisma.study.upsert({
     *   create: {
     *     // ... data to create a Study
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Study we want to update
     *   }
     * })
     */
    upsert<T extends StudyUpsertArgs>(args: SelectSubset<T, StudyUpsertArgs<ExtArgs>>): Prisma__StudyClient<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Studies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyCountArgs} args - Arguments to filter Studies to count.
     * @example
     * // Count the number of Studies
     * const count = await prisma.study.count({
     *   where: {
     *     // ... the filter for the Studies we want to count
     *   }
     * })
    **/
    count<T extends StudyCountArgs>(
      args?: Subset<T, StudyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Study.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StudyAggregateArgs>(args: Subset<T, StudyAggregateArgs>): Prisma.PrismaPromise<GetStudyAggregateType<T>>

    /**
     * Group by Study.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudyGroupByArgs} args - Group by arguments.
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
      T extends StudyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudyGroupByArgs['orderBy'] }
        : { orderBy?: StudyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StudyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Study model
   */
  readonly fields: StudyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Study.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends ImagingOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ImagingOrderDefaultArgs<ExtArgs>>): Prisma__ImagingOrderClient<$Result.GetResult<Prisma.$ImagingOrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    images<T extends Study$imagesArgs<ExtArgs> = {}>(args?: Subset<T, Study$imagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findMany"> | Null>
    reports<T extends Study$reportsArgs<ExtArgs> = {}>(args?: Subset<T, Study$reportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RadiologyReportPayload<ExtArgs>, T, "findMany"> | Null>
    criticalFindings<T extends Study$criticalFindingsArgs<ExtArgs> = {}>(args?: Subset<T, Study$criticalFindingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CriticalFindingPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Study model
   */ 
  interface StudyFieldRefs {
    readonly id: FieldRef<"Study", 'String'>
    readonly orderId: FieldRef<"Study", 'String'>
    readonly accessionNumber: FieldRef<"Study", 'String'>
    readonly studyInstanceUID: FieldRef<"Study", 'String'>
    readonly studyDate: FieldRef<"Study", 'DateTime'>
    readonly studyTime: FieldRef<"Study", 'String'>
    readonly studyDescription: FieldRef<"Study", 'String'>
    readonly modality: FieldRef<"Study", 'Modality'>
    readonly bodyPart: FieldRef<"Study", 'String'>
    readonly numberOfSeries: FieldRef<"Study", 'Int'>
    readonly numberOfInstances: FieldRef<"Study", 'Int'>
    readonly patientId: FieldRef<"Study", 'String'>
    readonly patientName: FieldRef<"Study", 'String'>
    readonly patientDOB: FieldRef<"Study", 'DateTime'>
    readonly patientSex: FieldRef<"Study", 'String'>
    readonly performingPhysician: FieldRef<"Study", 'String'>
    readonly operatorName: FieldRef<"Study", 'String'>
    readonly institutionName: FieldRef<"Study", 'String'>
    readonly stationName: FieldRef<"Study", 'String'>
    readonly status: FieldRef<"Study", 'StudyStatus'>
    readonly priority: FieldRef<"Study", 'Priority'>
    readonly createdAt: FieldRef<"Study", 'DateTime'>
    readonly updatedAt: FieldRef<"Study", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Study findUnique
   */
  export type StudyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyInclude<ExtArgs> | null
    /**
     * Filter, which Study to fetch.
     */
    where: StudyWhereUniqueInput
  }

  /**
   * Study findUniqueOrThrow
   */
  export type StudyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyInclude<ExtArgs> | null
    /**
     * Filter, which Study to fetch.
     */
    where: StudyWhereUniqueInput
  }

  /**
   * Study findFirst
   */
  export type StudyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyInclude<ExtArgs> | null
    /**
     * Filter, which Study to fetch.
     */
    where?: StudyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Studies to fetch.
     */
    orderBy?: StudyOrderByWithRelationInput | StudyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Studies.
     */
    cursor?: StudyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Studies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Studies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Studies.
     */
    distinct?: StudyScalarFieldEnum | StudyScalarFieldEnum[]
  }

  /**
   * Study findFirstOrThrow
   */
  export type StudyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyInclude<ExtArgs> | null
    /**
     * Filter, which Study to fetch.
     */
    where?: StudyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Studies to fetch.
     */
    orderBy?: StudyOrderByWithRelationInput | StudyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Studies.
     */
    cursor?: StudyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Studies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Studies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Studies.
     */
    distinct?: StudyScalarFieldEnum | StudyScalarFieldEnum[]
  }

  /**
   * Study findMany
   */
  export type StudyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyInclude<ExtArgs> | null
    /**
     * Filter, which Studies to fetch.
     */
    where?: StudyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Studies to fetch.
     */
    orderBy?: StudyOrderByWithRelationInput | StudyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Studies.
     */
    cursor?: StudyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Studies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Studies.
     */
    skip?: number
    distinct?: StudyScalarFieldEnum | StudyScalarFieldEnum[]
  }

  /**
   * Study create
   */
  export type StudyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyInclude<ExtArgs> | null
    /**
     * The data needed to create a Study.
     */
    data: XOR<StudyCreateInput, StudyUncheckedCreateInput>
  }

  /**
   * Study createMany
   */
  export type StudyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Studies.
     */
    data: StudyCreateManyInput | StudyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Study createManyAndReturn
   */
  export type StudyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Studies.
     */
    data: StudyCreateManyInput | StudyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Study update
   */
  export type StudyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyInclude<ExtArgs> | null
    /**
     * The data needed to update a Study.
     */
    data: XOR<StudyUpdateInput, StudyUncheckedUpdateInput>
    /**
     * Choose, which Study to update.
     */
    where: StudyWhereUniqueInput
  }

  /**
   * Study updateMany
   */
  export type StudyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Studies.
     */
    data: XOR<StudyUpdateManyMutationInput, StudyUncheckedUpdateManyInput>
    /**
     * Filter which Studies to update
     */
    where?: StudyWhereInput
  }

  /**
   * Study upsert
   */
  export type StudyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyInclude<ExtArgs> | null
    /**
     * The filter to search for the Study to update in case it exists.
     */
    where: StudyWhereUniqueInput
    /**
     * In case the Study found by the `where` argument doesn't exist, create a new Study with this data.
     */
    create: XOR<StudyCreateInput, StudyUncheckedCreateInput>
    /**
     * In case the Study was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudyUpdateInput, StudyUncheckedUpdateInput>
  }

  /**
   * Study delete
   */
  export type StudyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyInclude<ExtArgs> | null
    /**
     * Filter which Study to delete.
     */
    where: StudyWhereUniqueInput
  }

  /**
   * Study deleteMany
   */
  export type StudyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Studies to delete
     */
    where?: StudyWhereInput
  }

  /**
   * Study.images
   */
  export type Study$imagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    where?: ImageWhereInput
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    cursor?: ImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImageScalarFieldEnum | ImageScalarFieldEnum[]
  }

  /**
   * Study.reports
   */
  export type Study$reportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportInclude<ExtArgs> | null
    where?: RadiologyReportWhereInput
    orderBy?: RadiologyReportOrderByWithRelationInput | RadiologyReportOrderByWithRelationInput[]
    cursor?: RadiologyReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RadiologyReportScalarFieldEnum | RadiologyReportScalarFieldEnum[]
  }

  /**
   * Study.criticalFindings
   */
  export type Study$criticalFindingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingInclude<ExtArgs> | null
    where?: CriticalFindingWhereInput
    orderBy?: CriticalFindingOrderByWithRelationInput | CriticalFindingOrderByWithRelationInput[]
    cursor?: CriticalFindingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CriticalFindingScalarFieldEnum | CriticalFindingScalarFieldEnum[]
  }

  /**
   * Study without action
   */
  export type StudyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Study
     */
    select?: StudySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudyInclude<ExtArgs> | null
  }


  /**
   * Model Image
   */

  export type AggregateImage = {
    _count: ImageCountAggregateOutputType | null
    _avg: ImageAvgAggregateOutputType | null
    _sum: ImageSumAggregateOutputType | null
    _min: ImageMinAggregateOutputType | null
    _max: ImageMaxAggregateOutputType | null
  }

  export type ImageAvgAggregateOutputType = {
    instanceNumber: number | null
    seriesNumber: number | null
    rows: number | null
    columns: number | null
    bitsAllocated: number | null
    bitsStored: number | null
    sliceThickness: number | null
    sliceLocation: number | null
    fileSize: number | null
  }

  export type ImageSumAggregateOutputType = {
    instanceNumber: number | null
    seriesNumber: number | null
    rows: number | null
    columns: number | null
    bitsAllocated: number | null
    bitsStored: number | null
    sliceThickness: number | null
    sliceLocation: number | null
    fileSize: bigint | null
  }

  export type ImageMinAggregateOutputType = {
    id: string | null
    studyId: string | null
    seriesInstanceUID: string | null
    sopInstanceUID: string | null
    instanceNumber: number | null
    seriesNumber: number | null
    seriesDescription: string | null
    imageType: string | null
    photometricInterpretation: string | null
    rows: number | null
    columns: number | null
    bitsAllocated: number | null
    bitsStored: number | null
    pixelSpacing: string | null
    sliceThickness: number | null
    sliceLocation: number | null
    imagePosition: string | null
    imageOrientation: string | null
    acquisitionDate: Date | null
    acquisitionTime: string | null
    contentDate: Date | null
    contentTime: string | null
    windowCenter: string | null
    windowWidth: string | null
    storageUrl: string | null
    thumbnailUrl: string | null
    fileSize: bigint | null
    transferSyntaxUID: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImageMaxAggregateOutputType = {
    id: string | null
    studyId: string | null
    seriesInstanceUID: string | null
    sopInstanceUID: string | null
    instanceNumber: number | null
    seriesNumber: number | null
    seriesDescription: string | null
    imageType: string | null
    photometricInterpretation: string | null
    rows: number | null
    columns: number | null
    bitsAllocated: number | null
    bitsStored: number | null
    pixelSpacing: string | null
    sliceThickness: number | null
    sliceLocation: number | null
    imagePosition: string | null
    imageOrientation: string | null
    acquisitionDate: Date | null
    acquisitionTime: string | null
    contentDate: Date | null
    contentTime: string | null
    windowCenter: string | null
    windowWidth: string | null
    storageUrl: string | null
    thumbnailUrl: string | null
    fileSize: bigint | null
    transferSyntaxUID: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImageCountAggregateOutputType = {
    id: number
    studyId: number
    seriesInstanceUID: number
    sopInstanceUID: number
    instanceNumber: number
    seriesNumber: number
    seriesDescription: number
    imageType: number
    photometricInterpretation: number
    rows: number
    columns: number
    bitsAllocated: number
    bitsStored: number
    pixelSpacing: number
    sliceThickness: number
    sliceLocation: number
    imagePosition: number
    imageOrientation: number
    acquisitionDate: number
    acquisitionTime: number
    contentDate: number
    contentTime: number
    windowCenter: number
    windowWidth: number
    storageUrl: number
    thumbnailUrl: number
    fileSize: number
    transferSyntaxUID: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ImageAvgAggregateInputType = {
    instanceNumber?: true
    seriesNumber?: true
    rows?: true
    columns?: true
    bitsAllocated?: true
    bitsStored?: true
    sliceThickness?: true
    sliceLocation?: true
    fileSize?: true
  }

  export type ImageSumAggregateInputType = {
    instanceNumber?: true
    seriesNumber?: true
    rows?: true
    columns?: true
    bitsAllocated?: true
    bitsStored?: true
    sliceThickness?: true
    sliceLocation?: true
    fileSize?: true
  }

  export type ImageMinAggregateInputType = {
    id?: true
    studyId?: true
    seriesInstanceUID?: true
    sopInstanceUID?: true
    instanceNumber?: true
    seriesNumber?: true
    seriesDescription?: true
    imageType?: true
    photometricInterpretation?: true
    rows?: true
    columns?: true
    bitsAllocated?: true
    bitsStored?: true
    pixelSpacing?: true
    sliceThickness?: true
    sliceLocation?: true
    imagePosition?: true
    imageOrientation?: true
    acquisitionDate?: true
    acquisitionTime?: true
    contentDate?: true
    contentTime?: true
    windowCenter?: true
    windowWidth?: true
    storageUrl?: true
    thumbnailUrl?: true
    fileSize?: true
    transferSyntaxUID?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImageMaxAggregateInputType = {
    id?: true
    studyId?: true
    seriesInstanceUID?: true
    sopInstanceUID?: true
    instanceNumber?: true
    seriesNumber?: true
    seriesDescription?: true
    imageType?: true
    photometricInterpretation?: true
    rows?: true
    columns?: true
    bitsAllocated?: true
    bitsStored?: true
    pixelSpacing?: true
    sliceThickness?: true
    sliceLocation?: true
    imagePosition?: true
    imageOrientation?: true
    acquisitionDate?: true
    acquisitionTime?: true
    contentDate?: true
    contentTime?: true
    windowCenter?: true
    windowWidth?: true
    storageUrl?: true
    thumbnailUrl?: true
    fileSize?: true
    transferSyntaxUID?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImageCountAggregateInputType = {
    id?: true
    studyId?: true
    seriesInstanceUID?: true
    sopInstanceUID?: true
    instanceNumber?: true
    seriesNumber?: true
    seriesDescription?: true
    imageType?: true
    photometricInterpretation?: true
    rows?: true
    columns?: true
    bitsAllocated?: true
    bitsStored?: true
    pixelSpacing?: true
    sliceThickness?: true
    sliceLocation?: true
    imagePosition?: true
    imageOrientation?: true
    acquisitionDate?: true
    acquisitionTime?: true
    contentDate?: true
    contentTime?: true
    windowCenter?: true
    windowWidth?: true
    storageUrl?: true
    thumbnailUrl?: true
    fileSize?: true
    transferSyntaxUID?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Image to aggregate.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Images
    **/
    _count?: true | ImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImageMaxAggregateInputType
  }

  export type GetImageAggregateType<T extends ImageAggregateArgs> = {
        [P in keyof T & keyof AggregateImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImage[P]>
      : GetScalarType<T[P], AggregateImage[P]>
  }




  export type ImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageWhereInput
    orderBy?: ImageOrderByWithAggregationInput | ImageOrderByWithAggregationInput[]
    by: ImageScalarFieldEnum[] | ImageScalarFieldEnum
    having?: ImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImageCountAggregateInputType | true
    _avg?: ImageAvgAggregateInputType
    _sum?: ImageSumAggregateInputType
    _min?: ImageMinAggregateInputType
    _max?: ImageMaxAggregateInputType
  }

  export type ImageGroupByOutputType = {
    id: string
    studyId: string
    seriesInstanceUID: string
    sopInstanceUID: string
    instanceNumber: number
    seriesNumber: number
    seriesDescription: string | null
    imageType: string | null
    photometricInterpretation: string | null
    rows: number | null
    columns: number | null
    bitsAllocated: number | null
    bitsStored: number | null
    pixelSpacing: string | null
    sliceThickness: number | null
    sliceLocation: number | null
    imagePosition: string | null
    imageOrientation: string | null
    acquisitionDate: Date | null
    acquisitionTime: string | null
    contentDate: Date | null
    contentTime: string | null
    windowCenter: string | null
    windowWidth: string | null
    storageUrl: string
    thumbnailUrl: string | null
    fileSize: bigint
    transferSyntaxUID: string | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: ImageCountAggregateOutputType | null
    _avg: ImageAvgAggregateOutputType | null
    _sum: ImageSumAggregateOutputType | null
    _min: ImageMinAggregateOutputType | null
    _max: ImageMaxAggregateOutputType | null
  }

  type GetImageGroupByPayload<T extends ImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImageGroupByOutputType[P]>
            : GetScalarType<T[P], ImageGroupByOutputType[P]>
        }
      >
    >


  export type ImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studyId?: boolean
    seriesInstanceUID?: boolean
    sopInstanceUID?: boolean
    instanceNumber?: boolean
    seriesNumber?: boolean
    seriesDescription?: boolean
    imageType?: boolean
    photometricInterpretation?: boolean
    rows?: boolean
    columns?: boolean
    bitsAllocated?: boolean
    bitsStored?: boolean
    pixelSpacing?: boolean
    sliceThickness?: boolean
    sliceLocation?: boolean
    imagePosition?: boolean
    imageOrientation?: boolean
    acquisitionDate?: boolean
    acquisitionTime?: boolean
    contentDate?: boolean
    contentTime?: boolean
    windowCenter?: boolean
    windowWidth?: boolean
    storageUrl?: boolean
    thumbnailUrl?: boolean
    fileSize?: boolean
    transferSyntaxUID?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["image"]>

  export type ImageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studyId?: boolean
    seriesInstanceUID?: boolean
    sopInstanceUID?: boolean
    instanceNumber?: boolean
    seriesNumber?: boolean
    seriesDescription?: boolean
    imageType?: boolean
    photometricInterpretation?: boolean
    rows?: boolean
    columns?: boolean
    bitsAllocated?: boolean
    bitsStored?: boolean
    pixelSpacing?: boolean
    sliceThickness?: boolean
    sliceLocation?: boolean
    imagePosition?: boolean
    imageOrientation?: boolean
    acquisitionDate?: boolean
    acquisitionTime?: boolean
    contentDate?: boolean
    contentTime?: boolean
    windowCenter?: boolean
    windowWidth?: boolean
    storageUrl?: boolean
    thumbnailUrl?: boolean
    fileSize?: boolean
    transferSyntaxUID?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["image"]>

  export type ImageSelectScalar = {
    id?: boolean
    studyId?: boolean
    seriesInstanceUID?: boolean
    sopInstanceUID?: boolean
    instanceNumber?: boolean
    seriesNumber?: boolean
    seriesDescription?: boolean
    imageType?: boolean
    photometricInterpretation?: boolean
    rows?: boolean
    columns?: boolean
    bitsAllocated?: boolean
    bitsStored?: boolean
    pixelSpacing?: boolean
    sliceThickness?: boolean
    sliceLocation?: boolean
    imagePosition?: boolean
    imageOrientation?: boolean
    acquisitionDate?: boolean
    acquisitionTime?: boolean
    contentDate?: boolean
    contentTime?: boolean
    windowCenter?: boolean
    windowWidth?: boolean
    storageUrl?: boolean
    thumbnailUrl?: boolean
    fileSize?: boolean
    transferSyntaxUID?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ImageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }
  export type ImageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }

  export type $ImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Image"
    objects: {
      study: Prisma.$StudyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studyId: string
      seriesInstanceUID: string
      sopInstanceUID: string
      instanceNumber: number
      seriesNumber: number
      seriesDescription: string | null
      imageType: string | null
      photometricInterpretation: string | null
      rows: number | null
      columns: number | null
      bitsAllocated: number | null
      bitsStored: number | null
      pixelSpacing: string | null
      sliceThickness: number | null
      sliceLocation: number | null
      imagePosition: string | null
      imageOrientation: string | null
      acquisitionDate: Date | null
      acquisitionTime: string | null
      contentDate: Date | null
      contentTime: string | null
      windowCenter: string | null
      windowWidth: string | null
      storageUrl: string
      thumbnailUrl: string | null
      fileSize: bigint
      transferSyntaxUID: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["image"]>
    composites: {}
  }

  type ImageGetPayload<S extends boolean | null | undefined | ImageDefaultArgs> = $Result.GetResult<Prisma.$ImagePayload, S>

  type ImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ImageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ImageCountAggregateInputType | true
    }

  export interface ImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Image'], meta: { name: 'Image' } }
    /**
     * Find zero or one Image that matches the filter.
     * @param {ImageFindUniqueArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImageFindUniqueArgs>(args: SelectSubset<T, ImageFindUniqueArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Image that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ImageFindUniqueOrThrowArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImageFindUniqueOrThrowArgs>(args: SelectSubset<T, ImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Image that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageFindFirstArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImageFindFirstArgs>(args?: SelectSubset<T, ImageFindFirstArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Image that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageFindFirstOrThrowArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImageFindFirstOrThrowArgs>(args?: SelectSubset<T, ImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Images that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Images
     * const images = await prisma.image.findMany()
     * 
     * // Get first 10 Images
     * const images = await prisma.image.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imageWithIdOnly = await prisma.image.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImageFindManyArgs>(args?: SelectSubset<T, ImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Image.
     * @param {ImageCreateArgs} args - Arguments to create a Image.
     * @example
     * // Create one Image
     * const Image = await prisma.image.create({
     *   data: {
     *     // ... data to create a Image
     *   }
     * })
     * 
     */
    create<T extends ImageCreateArgs>(args: SelectSubset<T, ImageCreateArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Images.
     * @param {ImageCreateManyArgs} args - Arguments to create many Images.
     * @example
     * // Create many Images
     * const image = await prisma.image.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImageCreateManyArgs>(args?: SelectSubset<T, ImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Images and returns the data saved in the database.
     * @param {ImageCreateManyAndReturnArgs} args - Arguments to create many Images.
     * @example
     * // Create many Images
     * const image = await prisma.image.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Images and only return the `id`
     * const imageWithIdOnly = await prisma.image.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImageCreateManyAndReturnArgs>(args?: SelectSubset<T, ImageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Image.
     * @param {ImageDeleteArgs} args - Arguments to delete one Image.
     * @example
     * // Delete one Image
     * const Image = await prisma.image.delete({
     *   where: {
     *     // ... filter to delete one Image
     *   }
     * })
     * 
     */
    delete<T extends ImageDeleteArgs>(args: SelectSubset<T, ImageDeleteArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Image.
     * @param {ImageUpdateArgs} args - Arguments to update one Image.
     * @example
     * // Update one Image
     * const image = await prisma.image.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImageUpdateArgs>(args: SelectSubset<T, ImageUpdateArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Images.
     * @param {ImageDeleteManyArgs} args - Arguments to filter Images to delete.
     * @example
     * // Delete a few Images
     * const { count } = await prisma.image.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImageDeleteManyArgs>(args?: SelectSubset<T, ImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Images
     * const image = await prisma.image.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImageUpdateManyArgs>(args: SelectSubset<T, ImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Image.
     * @param {ImageUpsertArgs} args - Arguments to update or create a Image.
     * @example
     * // Update or create a Image
     * const image = await prisma.image.upsert({
     *   create: {
     *     // ... data to create a Image
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Image we want to update
     *   }
     * })
     */
    upsert<T extends ImageUpsertArgs>(args: SelectSubset<T, ImageUpsertArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageCountArgs} args - Arguments to filter Images to count.
     * @example
     * // Count the number of Images
     * const count = await prisma.image.count({
     *   where: {
     *     // ... the filter for the Images we want to count
     *   }
     * })
    **/
    count<T extends ImageCountArgs>(
      args?: Subset<T, ImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Image.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImageAggregateArgs>(args: Subset<T, ImageAggregateArgs>): Prisma.PrismaPromise<GetImageAggregateType<T>>

    /**
     * Group by Image.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGroupByArgs} args - Group by arguments.
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
      T extends ImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImageGroupByArgs['orderBy'] }
        : { orderBy?: ImageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Image model
   */
  readonly fields: ImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Image.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    study<T extends StudyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudyDefaultArgs<ExtArgs>>): Prisma__StudyClient<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Image model
   */ 
  interface ImageFieldRefs {
    readonly id: FieldRef<"Image", 'String'>
    readonly studyId: FieldRef<"Image", 'String'>
    readonly seriesInstanceUID: FieldRef<"Image", 'String'>
    readonly sopInstanceUID: FieldRef<"Image", 'String'>
    readonly instanceNumber: FieldRef<"Image", 'Int'>
    readonly seriesNumber: FieldRef<"Image", 'Int'>
    readonly seriesDescription: FieldRef<"Image", 'String'>
    readonly imageType: FieldRef<"Image", 'String'>
    readonly photometricInterpretation: FieldRef<"Image", 'String'>
    readonly rows: FieldRef<"Image", 'Int'>
    readonly columns: FieldRef<"Image", 'Int'>
    readonly bitsAllocated: FieldRef<"Image", 'Int'>
    readonly bitsStored: FieldRef<"Image", 'Int'>
    readonly pixelSpacing: FieldRef<"Image", 'String'>
    readonly sliceThickness: FieldRef<"Image", 'Float'>
    readonly sliceLocation: FieldRef<"Image", 'Float'>
    readonly imagePosition: FieldRef<"Image", 'String'>
    readonly imageOrientation: FieldRef<"Image", 'String'>
    readonly acquisitionDate: FieldRef<"Image", 'DateTime'>
    readonly acquisitionTime: FieldRef<"Image", 'String'>
    readonly contentDate: FieldRef<"Image", 'DateTime'>
    readonly contentTime: FieldRef<"Image", 'String'>
    readonly windowCenter: FieldRef<"Image", 'String'>
    readonly windowWidth: FieldRef<"Image", 'String'>
    readonly storageUrl: FieldRef<"Image", 'String'>
    readonly thumbnailUrl: FieldRef<"Image", 'String'>
    readonly fileSize: FieldRef<"Image", 'BigInt'>
    readonly transferSyntaxUID: FieldRef<"Image", 'String'>
    readonly metadata: FieldRef<"Image", 'Json'>
    readonly createdAt: FieldRef<"Image", 'DateTime'>
    readonly updatedAt: FieldRef<"Image", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Image findUnique
   */
  export type ImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image findUniqueOrThrow
   */
  export type ImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image findFirst
   */
  export type ImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Images.
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Images.
     */
    distinct?: ImageScalarFieldEnum | ImageScalarFieldEnum[]
  }

  /**
   * Image findFirstOrThrow
   */
  export type ImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Images.
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Images.
     */
    distinct?: ImageScalarFieldEnum | ImageScalarFieldEnum[]
  }

  /**
   * Image findMany
   */
  export type ImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Images to fetch.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Images.
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    distinct?: ImageScalarFieldEnum | ImageScalarFieldEnum[]
  }

  /**
   * Image create
   */
  export type ImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * The data needed to create a Image.
     */
    data: XOR<ImageCreateInput, ImageUncheckedCreateInput>
  }

  /**
   * Image createMany
   */
  export type ImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Images.
     */
    data: ImageCreateManyInput | ImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Image createManyAndReturn
   */
  export type ImageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Images.
     */
    data: ImageCreateManyInput | ImageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Image update
   */
  export type ImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * The data needed to update a Image.
     */
    data: XOR<ImageUpdateInput, ImageUncheckedUpdateInput>
    /**
     * Choose, which Image to update.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image updateMany
   */
  export type ImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Images.
     */
    data: XOR<ImageUpdateManyMutationInput, ImageUncheckedUpdateManyInput>
    /**
     * Filter which Images to update
     */
    where?: ImageWhereInput
  }

  /**
   * Image upsert
   */
  export type ImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * The filter to search for the Image to update in case it exists.
     */
    where: ImageWhereUniqueInput
    /**
     * In case the Image found by the `where` argument doesn't exist, create a new Image with this data.
     */
    create: XOR<ImageCreateInput, ImageUncheckedCreateInput>
    /**
     * In case the Image was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImageUpdateInput, ImageUncheckedUpdateInput>
  }

  /**
   * Image delete
   */
  export type ImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter which Image to delete.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image deleteMany
   */
  export type ImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Images to delete
     */
    where?: ImageWhereInput
  }

  /**
   * Image without action
   */
  export type ImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
  }


  /**
   * Model RadiologyReport
   */

  export type AggregateRadiologyReport = {
    _count: RadiologyReportCountAggregateOutputType | null
    _min: RadiologyReportMinAggregateOutputType | null
    _max: RadiologyReportMaxAggregateOutputType | null
  }

  export type RadiologyReportMinAggregateOutputType = {
    id: string | null
    studyId: string | null
    reportNumber: string | null
    radiologistId: string | null
    radiologistName: string | null
    status: $Enums.ReportStatus | null
    clinicalHistory: string | null
    technique: string | null
    comparison: string | null
    findings: string | null
    impression: string | null
    recommendations: string | null
    preliminaryDate: Date | null
    finalizedDate: Date | null
    amendedDate: Date | null
    amendmentReason: string | null
    signedBy: string | null
    signedAt: Date | null
    transcribedBy: string | null
    transcribedAt: Date | null
    template: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RadiologyReportMaxAggregateOutputType = {
    id: string | null
    studyId: string | null
    reportNumber: string | null
    radiologistId: string | null
    radiologistName: string | null
    status: $Enums.ReportStatus | null
    clinicalHistory: string | null
    technique: string | null
    comparison: string | null
    findings: string | null
    impression: string | null
    recommendations: string | null
    preliminaryDate: Date | null
    finalizedDate: Date | null
    amendedDate: Date | null
    amendmentReason: string | null
    signedBy: string | null
    signedAt: Date | null
    transcribedBy: string | null
    transcribedAt: Date | null
    template: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RadiologyReportCountAggregateOutputType = {
    id: number
    studyId: number
    reportNumber: number
    radiologistId: number
    radiologistName: number
    status: number
    clinicalHistory: number
    technique: number
    comparison: number
    findings: number
    impression: number
    recommendations: number
    preliminaryDate: number
    finalizedDate: number
    amendedDate: number
    amendmentReason: number
    signedBy: number
    signedAt: number
    transcribedBy: number
    transcribedAt: number
    template: number
    macros: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RadiologyReportMinAggregateInputType = {
    id?: true
    studyId?: true
    reportNumber?: true
    radiologistId?: true
    radiologistName?: true
    status?: true
    clinicalHistory?: true
    technique?: true
    comparison?: true
    findings?: true
    impression?: true
    recommendations?: true
    preliminaryDate?: true
    finalizedDate?: true
    amendedDate?: true
    amendmentReason?: true
    signedBy?: true
    signedAt?: true
    transcribedBy?: true
    transcribedAt?: true
    template?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RadiologyReportMaxAggregateInputType = {
    id?: true
    studyId?: true
    reportNumber?: true
    radiologistId?: true
    radiologistName?: true
    status?: true
    clinicalHistory?: true
    technique?: true
    comparison?: true
    findings?: true
    impression?: true
    recommendations?: true
    preliminaryDate?: true
    finalizedDate?: true
    amendedDate?: true
    amendmentReason?: true
    signedBy?: true
    signedAt?: true
    transcribedBy?: true
    transcribedAt?: true
    template?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RadiologyReportCountAggregateInputType = {
    id?: true
    studyId?: true
    reportNumber?: true
    radiologistId?: true
    radiologistName?: true
    status?: true
    clinicalHistory?: true
    technique?: true
    comparison?: true
    findings?: true
    impression?: true
    recommendations?: true
    preliminaryDate?: true
    finalizedDate?: true
    amendedDate?: true
    amendmentReason?: true
    signedBy?: true
    signedAt?: true
    transcribedBy?: true
    transcribedAt?: true
    template?: true
    macros?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RadiologyReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RadiologyReport to aggregate.
     */
    where?: RadiologyReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RadiologyReports to fetch.
     */
    orderBy?: RadiologyReportOrderByWithRelationInput | RadiologyReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RadiologyReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RadiologyReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RadiologyReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RadiologyReports
    **/
    _count?: true | RadiologyReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RadiologyReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RadiologyReportMaxAggregateInputType
  }

  export type GetRadiologyReportAggregateType<T extends RadiologyReportAggregateArgs> = {
        [P in keyof T & keyof AggregateRadiologyReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRadiologyReport[P]>
      : GetScalarType<T[P], AggregateRadiologyReport[P]>
  }




  export type RadiologyReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RadiologyReportWhereInput
    orderBy?: RadiologyReportOrderByWithAggregationInput | RadiologyReportOrderByWithAggregationInput[]
    by: RadiologyReportScalarFieldEnum[] | RadiologyReportScalarFieldEnum
    having?: RadiologyReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RadiologyReportCountAggregateInputType | true
    _min?: RadiologyReportMinAggregateInputType
    _max?: RadiologyReportMaxAggregateInputType
  }

  export type RadiologyReportGroupByOutputType = {
    id: string
    studyId: string
    reportNumber: string
    radiologistId: string
    radiologistName: string
    status: $Enums.ReportStatus
    clinicalHistory: string | null
    technique: string | null
    comparison: string | null
    findings: string
    impression: string
    recommendations: string | null
    preliminaryDate: Date | null
    finalizedDate: Date | null
    amendedDate: Date | null
    amendmentReason: string | null
    signedBy: string | null
    signedAt: Date | null
    transcribedBy: string | null
    transcribedAt: Date | null
    template: string | null
    macros: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: RadiologyReportCountAggregateOutputType | null
    _min: RadiologyReportMinAggregateOutputType | null
    _max: RadiologyReportMaxAggregateOutputType | null
  }

  type GetRadiologyReportGroupByPayload<T extends RadiologyReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RadiologyReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RadiologyReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RadiologyReportGroupByOutputType[P]>
            : GetScalarType<T[P], RadiologyReportGroupByOutputType[P]>
        }
      >
    >


  export type RadiologyReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studyId?: boolean
    reportNumber?: boolean
    radiologistId?: boolean
    radiologistName?: boolean
    status?: boolean
    clinicalHistory?: boolean
    technique?: boolean
    comparison?: boolean
    findings?: boolean
    impression?: boolean
    recommendations?: boolean
    preliminaryDate?: boolean
    finalizedDate?: boolean
    amendedDate?: boolean
    amendmentReason?: boolean
    signedBy?: boolean
    signedAt?: boolean
    transcribedBy?: boolean
    transcribedAt?: boolean
    template?: boolean
    macros?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["radiologyReport"]>

  export type RadiologyReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studyId?: boolean
    reportNumber?: boolean
    radiologistId?: boolean
    radiologistName?: boolean
    status?: boolean
    clinicalHistory?: boolean
    technique?: boolean
    comparison?: boolean
    findings?: boolean
    impression?: boolean
    recommendations?: boolean
    preliminaryDate?: boolean
    finalizedDate?: boolean
    amendedDate?: boolean
    amendmentReason?: boolean
    signedBy?: boolean
    signedAt?: boolean
    transcribedBy?: boolean
    transcribedAt?: boolean
    template?: boolean
    macros?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["radiologyReport"]>

  export type RadiologyReportSelectScalar = {
    id?: boolean
    studyId?: boolean
    reportNumber?: boolean
    radiologistId?: boolean
    radiologistName?: boolean
    status?: boolean
    clinicalHistory?: boolean
    technique?: boolean
    comparison?: boolean
    findings?: boolean
    impression?: boolean
    recommendations?: boolean
    preliminaryDate?: boolean
    finalizedDate?: boolean
    amendedDate?: boolean
    amendmentReason?: boolean
    signedBy?: boolean
    signedAt?: boolean
    transcribedBy?: boolean
    transcribedAt?: boolean
    template?: boolean
    macros?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RadiologyReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }
  export type RadiologyReportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }

  export type $RadiologyReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RadiologyReport"
    objects: {
      study: Prisma.$StudyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studyId: string
      reportNumber: string
      radiologistId: string
      radiologistName: string
      status: $Enums.ReportStatus
      clinicalHistory: string | null
      technique: string | null
      comparison: string | null
      findings: string
      impression: string
      recommendations: string | null
      preliminaryDate: Date | null
      finalizedDate: Date | null
      amendedDate: Date | null
      amendmentReason: string | null
      signedBy: string | null
      signedAt: Date | null
      transcribedBy: string | null
      transcribedAt: Date | null
      template: string | null
      macros: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["radiologyReport"]>
    composites: {}
  }

  type RadiologyReportGetPayload<S extends boolean | null | undefined | RadiologyReportDefaultArgs> = $Result.GetResult<Prisma.$RadiologyReportPayload, S>

  type RadiologyReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RadiologyReportFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RadiologyReportCountAggregateInputType | true
    }

  export interface RadiologyReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RadiologyReport'], meta: { name: 'RadiologyReport' } }
    /**
     * Find zero or one RadiologyReport that matches the filter.
     * @param {RadiologyReportFindUniqueArgs} args - Arguments to find a RadiologyReport
     * @example
     * // Get one RadiologyReport
     * const radiologyReport = await prisma.radiologyReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RadiologyReportFindUniqueArgs>(args: SelectSubset<T, RadiologyReportFindUniqueArgs<ExtArgs>>): Prisma__RadiologyReportClient<$Result.GetResult<Prisma.$RadiologyReportPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RadiologyReport that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RadiologyReportFindUniqueOrThrowArgs} args - Arguments to find a RadiologyReport
     * @example
     * // Get one RadiologyReport
     * const radiologyReport = await prisma.radiologyReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RadiologyReportFindUniqueOrThrowArgs>(args: SelectSubset<T, RadiologyReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RadiologyReportClient<$Result.GetResult<Prisma.$RadiologyReportPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RadiologyReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RadiologyReportFindFirstArgs} args - Arguments to find a RadiologyReport
     * @example
     * // Get one RadiologyReport
     * const radiologyReport = await prisma.radiologyReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RadiologyReportFindFirstArgs>(args?: SelectSubset<T, RadiologyReportFindFirstArgs<ExtArgs>>): Prisma__RadiologyReportClient<$Result.GetResult<Prisma.$RadiologyReportPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RadiologyReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RadiologyReportFindFirstOrThrowArgs} args - Arguments to find a RadiologyReport
     * @example
     * // Get one RadiologyReport
     * const radiologyReport = await prisma.radiologyReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RadiologyReportFindFirstOrThrowArgs>(args?: SelectSubset<T, RadiologyReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__RadiologyReportClient<$Result.GetResult<Prisma.$RadiologyReportPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RadiologyReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RadiologyReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RadiologyReports
     * const radiologyReports = await prisma.radiologyReport.findMany()
     * 
     * // Get first 10 RadiologyReports
     * const radiologyReports = await prisma.radiologyReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const radiologyReportWithIdOnly = await prisma.radiologyReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RadiologyReportFindManyArgs>(args?: SelectSubset<T, RadiologyReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RadiologyReportPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RadiologyReport.
     * @param {RadiologyReportCreateArgs} args - Arguments to create a RadiologyReport.
     * @example
     * // Create one RadiologyReport
     * const RadiologyReport = await prisma.radiologyReport.create({
     *   data: {
     *     // ... data to create a RadiologyReport
     *   }
     * })
     * 
     */
    create<T extends RadiologyReportCreateArgs>(args: SelectSubset<T, RadiologyReportCreateArgs<ExtArgs>>): Prisma__RadiologyReportClient<$Result.GetResult<Prisma.$RadiologyReportPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RadiologyReports.
     * @param {RadiologyReportCreateManyArgs} args - Arguments to create many RadiologyReports.
     * @example
     * // Create many RadiologyReports
     * const radiologyReport = await prisma.radiologyReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RadiologyReportCreateManyArgs>(args?: SelectSubset<T, RadiologyReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RadiologyReports and returns the data saved in the database.
     * @param {RadiologyReportCreateManyAndReturnArgs} args - Arguments to create many RadiologyReports.
     * @example
     * // Create many RadiologyReports
     * const radiologyReport = await prisma.radiologyReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RadiologyReports and only return the `id`
     * const radiologyReportWithIdOnly = await prisma.radiologyReport.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RadiologyReportCreateManyAndReturnArgs>(args?: SelectSubset<T, RadiologyReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RadiologyReportPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RadiologyReport.
     * @param {RadiologyReportDeleteArgs} args - Arguments to delete one RadiologyReport.
     * @example
     * // Delete one RadiologyReport
     * const RadiologyReport = await prisma.radiologyReport.delete({
     *   where: {
     *     // ... filter to delete one RadiologyReport
     *   }
     * })
     * 
     */
    delete<T extends RadiologyReportDeleteArgs>(args: SelectSubset<T, RadiologyReportDeleteArgs<ExtArgs>>): Prisma__RadiologyReportClient<$Result.GetResult<Prisma.$RadiologyReportPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RadiologyReport.
     * @param {RadiologyReportUpdateArgs} args - Arguments to update one RadiologyReport.
     * @example
     * // Update one RadiologyReport
     * const radiologyReport = await prisma.radiologyReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RadiologyReportUpdateArgs>(args: SelectSubset<T, RadiologyReportUpdateArgs<ExtArgs>>): Prisma__RadiologyReportClient<$Result.GetResult<Prisma.$RadiologyReportPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RadiologyReports.
     * @param {RadiologyReportDeleteManyArgs} args - Arguments to filter RadiologyReports to delete.
     * @example
     * // Delete a few RadiologyReports
     * const { count } = await prisma.radiologyReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RadiologyReportDeleteManyArgs>(args?: SelectSubset<T, RadiologyReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RadiologyReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RadiologyReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RadiologyReports
     * const radiologyReport = await prisma.radiologyReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RadiologyReportUpdateManyArgs>(args: SelectSubset<T, RadiologyReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RadiologyReport.
     * @param {RadiologyReportUpsertArgs} args - Arguments to update or create a RadiologyReport.
     * @example
     * // Update or create a RadiologyReport
     * const radiologyReport = await prisma.radiologyReport.upsert({
     *   create: {
     *     // ... data to create a RadiologyReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RadiologyReport we want to update
     *   }
     * })
     */
    upsert<T extends RadiologyReportUpsertArgs>(args: SelectSubset<T, RadiologyReportUpsertArgs<ExtArgs>>): Prisma__RadiologyReportClient<$Result.GetResult<Prisma.$RadiologyReportPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RadiologyReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RadiologyReportCountArgs} args - Arguments to filter RadiologyReports to count.
     * @example
     * // Count the number of RadiologyReports
     * const count = await prisma.radiologyReport.count({
     *   where: {
     *     // ... the filter for the RadiologyReports we want to count
     *   }
     * })
    **/
    count<T extends RadiologyReportCountArgs>(
      args?: Subset<T, RadiologyReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RadiologyReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RadiologyReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RadiologyReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RadiologyReportAggregateArgs>(args: Subset<T, RadiologyReportAggregateArgs>): Prisma.PrismaPromise<GetRadiologyReportAggregateType<T>>

    /**
     * Group by RadiologyReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RadiologyReportGroupByArgs} args - Group by arguments.
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
      T extends RadiologyReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RadiologyReportGroupByArgs['orderBy'] }
        : { orderBy?: RadiologyReportGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RadiologyReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRadiologyReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RadiologyReport model
   */
  readonly fields: RadiologyReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RadiologyReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RadiologyReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    study<T extends StudyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudyDefaultArgs<ExtArgs>>): Prisma__StudyClient<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the RadiologyReport model
   */ 
  interface RadiologyReportFieldRefs {
    readonly id: FieldRef<"RadiologyReport", 'String'>
    readonly studyId: FieldRef<"RadiologyReport", 'String'>
    readonly reportNumber: FieldRef<"RadiologyReport", 'String'>
    readonly radiologistId: FieldRef<"RadiologyReport", 'String'>
    readonly radiologistName: FieldRef<"RadiologyReport", 'String'>
    readonly status: FieldRef<"RadiologyReport", 'ReportStatus'>
    readonly clinicalHistory: FieldRef<"RadiologyReport", 'String'>
    readonly technique: FieldRef<"RadiologyReport", 'String'>
    readonly comparison: FieldRef<"RadiologyReport", 'String'>
    readonly findings: FieldRef<"RadiologyReport", 'String'>
    readonly impression: FieldRef<"RadiologyReport", 'String'>
    readonly recommendations: FieldRef<"RadiologyReport", 'String'>
    readonly preliminaryDate: FieldRef<"RadiologyReport", 'DateTime'>
    readonly finalizedDate: FieldRef<"RadiologyReport", 'DateTime'>
    readonly amendedDate: FieldRef<"RadiologyReport", 'DateTime'>
    readonly amendmentReason: FieldRef<"RadiologyReport", 'String'>
    readonly signedBy: FieldRef<"RadiologyReport", 'String'>
    readonly signedAt: FieldRef<"RadiologyReport", 'DateTime'>
    readonly transcribedBy: FieldRef<"RadiologyReport", 'String'>
    readonly transcribedAt: FieldRef<"RadiologyReport", 'DateTime'>
    readonly template: FieldRef<"RadiologyReport", 'String'>
    readonly macros: FieldRef<"RadiologyReport", 'Json'>
    readonly createdAt: FieldRef<"RadiologyReport", 'DateTime'>
    readonly updatedAt: FieldRef<"RadiologyReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RadiologyReport findUnique
   */
  export type RadiologyReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportInclude<ExtArgs> | null
    /**
     * Filter, which RadiologyReport to fetch.
     */
    where: RadiologyReportWhereUniqueInput
  }

  /**
   * RadiologyReport findUniqueOrThrow
   */
  export type RadiologyReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportInclude<ExtArgs> | null
    /**
     * Filter, which RadiologyReport to fetch.
     */
    where: RadiologyReportWhereUniqueInput
  }

  /**
   * RadiologyReport findFirst
   */
  export type RadiologyReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportInclude<ExtArgs> | null
    /**
     * Filter, which RadiologyReport to fetch.
     */
    where?: RadiologyReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RadiologyReports to fetch.
     */
    orderBy?: RadiologyReportOrderByWithRelationInput | RadiologyReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RadiologyReports.
     */
    cursor?: RadiologyReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RadiologyReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RadiologyReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RadiologyReports.
     */
    distinct?: RadiologyReportScalarFieldEnum | RadiologyReportScalarFieldEnum[]
  }

  /**
   * RadiologyReport findFirstOrThrow
   */
  export type RadiologyReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportInclude<ExtArgs> | null
    /**
     * Filter, which RadiologyReport to fetch.
     */
    where?: RadiologyReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RadiologyReports to fetch.
     */
    orderBy?: RadiologyReportOrderByWithRelationInput | RadiologyReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RadiologyReports.
     */
    cursor?: RadiologyReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RadiologyReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RadiologyReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RadiologyReports.
     */
    distinct?: RadiologyReportScalarFieldEnum | RadiologyReportScalarFieldEnum[]
  }

  /**
   * RadiologyReport findMany
   */
  export type RadiologyReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportInclude<ExtArgs> | null
    /**
     * Filter, which RadiologyReports to fetch.
     */
    where?: RadiologyReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RadiologyReports to fetch.
     */
    orderBy?: RadiologyReportOrderByWithRelationInput | RadiologyReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RadiologyReports.
     */
    cursor?: RadiologyReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RadiologyReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RadiologyReports.
     */
    skip?: number
    distinct?: RadiologyReportScalarFieldEnum | RadiologyReportScalarFieldEnum[]
  }

  /**
   * RadiologyReport create
   */
  export type RadiologyReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportInclude<ExtArgs> | null
    /**
     * The data needed to create a RadiologyReport.
     */
    data: XOR<RadiologyReportCreateInput, RadiologyReportUncheckedCreateInput>
  }

  /**
   * RadiologyReport createMany
   */
  export type RadiologyReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RadiologyReports.
     */
    data: RadiologyReportCreateManyInput | RadiologyReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RadiologyReport createManyAndReturn
   */
  export type RadiologyReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RadiologyReports.
     */
    data: RadiologyReportCreateManyInput | RadiologyReportCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RadiologyReport update
   */
  export type RadiologyReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportInclude<ExtArgs> | null
    /**
     * The data needed to update a RadiologyReport.
     */
    data: XOR<RadiologyReportUpdateInput, RadiologyReportUncheckedUpdateInput>
    /**
     * Choose, which RadiologyReport to update.
     */
    where: RadiologyReportWhereUniqueInput
  }

  /**
   * RadiologyReport updateMany
   */
  export type RadiologyReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RadiologyReports.
     */
    data: XOR<RadiologyReportUpdateManyMutationInput, RadiologyReportUncheckedUpdateManyInput>
    /**
     * Filter which RadiologyReports to update
     */
    where?: RadiologyReportWhereInput
  }

  /**
   * RadiologyReport upsert
   */
  export type RadiologyReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportInclude<ExtArgs> | null
    /**
     * The filter to search for the RadiologyReport to update in case it exists.
     */
    where: RadiologyReportWhereUniqueInput
    /**
     * In case the RadiologyReport found by the `where` argument doesn't exist, create a new RadiologyReport with this data.
     */
    create: XOR<RadiologyReportCreateInput, RadiologyReportUncheckedCreateInput>
    /**
     * In case the RadiologyReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RadiologyReportUpdateInput, RadiologyReportUncheckedUpdateInput>
  }

  /**
   * RadiologyReport delete
   */
  export type RadiologyReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportInclude<ExtArgs> | null
    /**
     * Filter which RadiologyReport to delete.
     */
    where: RadiologyReportWhereUniqueInput
  }

  /**
   * RadiologyReport deleteMany
   */
  export type RadiologyReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RadiologyReports to delete
     */
    where?: RadiologyReportWhereInput
  }

  /**
   * RadiologyReport without action
   */
  export type RadiologyReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RadiologyReport
     */
    select?: RadiologyReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RadiologyReportInclude<ExtArgs> | null
  }


  /**
   * Model CriticalFinding
   */

  export type AggregateCriticalFinding = {
    _count: CriticalFindingCountAggregateOutputType | null
    _min: CriticalFindingMinAggregateOutputType | null
    _max: CriticalFindingMaxAggregateOutputType | null
  }

  export type CriticalFindingMinAggregateOutputType = {
    id: string | null
    studyId: string | null
    reportId: string | null
    finding: string | null
    severity: $Enums.Severity | null
    category: string | null
    bodyPart: string | null
    reportedBy: string | null
    reportedAt: Date | null
    notificationSent: boolean | null
    acknowledgedBy: string | null
    acknowledgedAt: Date | null
    followUpRequired: boolean | null
    followUpAction: string | null
    followUpStatus: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CriticalFindingMaxAggregateOutputType = {
    id: string | null
    studyId: string | null
    reportId: string | null
    finding: string | null
    severity: $Enums.Severity | null
    category: string | null
    bodyPart: string | null
    reportedBy: string | null
    reportedAt: Date | null
    notificationSent: boolean | null
    acknowledgedBy: string | null
    acknowledgedAt: Date | null
    followUpRequired: boolean | null
    followUpAction: string | null
    followUpStatus: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CriticalFindingCountAggregateOutputType = {
    id: number
    studyId: number
    reportId: number
    finding: number
    severity: number
    category: number
    bodyPart: number
    reportedBy: number
    reportedAt: number
    notifiedTo: number
    notificationSent: number
    acknowledgedBy: number
    acknowledgedAt: number
    followUpRequired: number
    followUpAction: number
    followUpStatus: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CriticalFindingMinAggregateInputType = {
    id?: true
    studyId?: true
    reportId?: true
    finding?: true
    severity?: true
    category?: true
    bodyPart?: true
    reportedBy?: true
    reportedAt?: true
    notificationSent?: true
    acknowledgedBy?: true
    acknowledgedAt?: true
    followUpRequired?: true
    followUpAction?: true
    followUpStatus?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CriticalFindingMaxAggregateInputType = {
    id?: true
    studyId?: true
    reportId?: true
    finding?: true
    severity?: true
    category?: true
    bodyPart?: true
    reportedBy?: true
    reportedAt?: true
    notificationSent?: true
    acknowledgedBy?: true
    acknowledgedAt?: true
    followUpRequired?: true
    followUpAction?: true
    followUpStatus?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CriticalFindingCountAggregateInputType = {
    id?: true
    studyId?: true
    reportId?: true
    finding?: true
    severity?: true
    category?: true
    bodyPart?: true
    reportedBy?: true
    reportedAt?: true
    notifiedTo?: true
    notificationSent?: true
    acknowledgedBy?: true
    acknowledgedAt?: true
    followUpRequired?: true
    followUpAction?: true
    followUpStatus?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CriticalFindingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CriticalFinding to aggregate.
     */
    where?: CriticalFindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CriticalFindings to fetch.
     */
    orderBy?: CriticalFindingOrderByWithRelationInput | CriticalFindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CriticalFindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CriticalFindings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CriticalFindings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CriticalFindings
    **/
    _count?: true | CriticalFindingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CriticalFindingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CriticalFindingMaxAggregateInputType
  }

  export type GetCriticalFindingAggregateType<T extends CriticalFindingAggregateArgs> = {
        [P in keyof T & keyof AggregateCriticalFinding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCriticalFinding[P]>
      : GetScalarType<T[P], AggregateCriticalFinding[P]>
  }




  export type CriticalFindingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CriticalFindingWhereInput
    orderBy?: CriticalFindingOrderByWithAggregationInput | CriticalFindingOrderByWithAggregationInput[]
    by: CriticalFindingScalarFieldEnum[] | CriticalFindingScalarFieldEnum
    having?: CriticalFindingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CriticalFindingCountAggregateInputType | true
    _min?: CriticalFindingMinAggregateInputType
    _max?: CriticalFindingMaxAggregateInputType
  }

  export type CriticalFindingGroupByOutputType = {
    id: string
    studyId: string
    reportId: string | null
    finding: string
    severity: $Enums.Severity
    category: string
    bodyPart: string | null
    reportedBy: string
    reportedAt: Date
    notifiedTo: string[]
    notificationSent: boolean
    acknowledgedBy: string | null
    acknowledgedAt: Date | null
    followUpRequired: boolean
    followUpAction: string | null
    followUpStatus: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: CriticalFindingCountAggregateOutputType | null
    _min: CriticalFindingMinAggregateOutputType | null
    _max: CriticalFindingMaxAggregateOutputType | null
  }

  type GetCriticalFindingGroupByPayload<T extends CriticalFindingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CriticalFindingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CriticalFindingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CriticalFindingGroupByOutputType[P]>
            : GetScalarType<T[P], CriticalFindingGroupByOutputType[P]>
        }
      >
    >


  export type CriticalFindingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studyId?: boolean
    reportId?: boolean
    finding?: boolean
    severity?: boolean
    category?: boolean
    bodyPart?: boolean
    reportedBy?: boolean
    reportedAt?: boolean
    notifiedTo?: boolean
    notificationSent?: boolean
    acknowledgedBy?: boolean
    acknowledgedAt?: boolean
    followUpRequired?: boolean
    followUpAction?: boolean
    followUpStatus?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["criticalFinding"]>

  export type CriticalFindingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studyId?: boolean
    reportId?: boolean
    finding?: boolean
    severity?: boolean
    category?: boolean
    bodyPart?: boolean
    reportedBy?: boolean
    reportedAt?: boolean
    notifiedTo?: boolean
    notificationSent?: boolean
    acknowledgedBy?: boolean
    acknowledgedAt?: boolean
    followUpRequired?: boolean
    followUpAction?: boolean
    followUpStatus?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["criticalFinding"]>

  export type CriticalFindingSelectScalar = {
    id?: boolean
    studyId?: boolean
    reportId?: boolean
    finding?: boolean
    severity?: boolean
    category?: boolean
    bodyPart?: boolean
    reportedBy?: boolean
    reportedAt?: boolean
    notifiedTo?: boolean
    notificationSent?: boolean
    acknowledgedBy?: boolean
    acknowledgedAt?: boolean
    followUpRequired?: boolean
    followUpAction?: boolean
    followUpStatus?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CriticalFindingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }
  export type CriticalFindingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    study?: boolean | StudyDefaultArgs<ExtArgs>
  }

  export type $CriticalFindingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CriticalFinding"
    objects: {
      study: Prisma.$StudyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studyId: string
      reportId: string | null
      finding: string
      severity: $Enums.Severity
      category: string
      bodyPart: string | null
      reportedBy: string
      reportedAt: Date
      notifiedTo: string[]
      notificationSent: boolean
      acknowledgedBy: string | null
      acknowledgedAt: Date | null
      followUpRequired: boolean
      followUpAction: string | null
      followUpStatus: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["criticalFinding"]>
    composites: {}
  }

  type CriticalFindingGetPayload<S extends boolean | null | undefined | CriticalFindingDefaultArgs> = $Result.GetResult<Prisma.$CriticalFindingPayload, S>

  type CriticalFindingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CriticalFindingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CriticalFindingCountAggregateInputType | true
    }

  export interface CriticalFindingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CriticalFinding'], meta: { name: 'CriticalFinding' } }
    /**
     * Find zero or one CriticalFinding that matches the filter.
     * @param {CriticalFindingFindUniqueArgs} args - Arguments to find a CriticalFinding
     * @example
     * // Get one CriticalFinding
     * const criticalFinding = await prisma.criticalFinding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CriticalFindingFindUniqueArgs>(args: SelectSubset<T, CriticalFindingFindUniqueArgs<ExtArgs>>): Prisma__CriticalFindingClient<$Result.GetResult<Prisma.$CriticalFindingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CriticalFinding that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CriticalFindingFindUniqueOrThrowArgs} args - Arguments to find a CriticalFinding
     * @example
     * // Get one CriticalFinding
     * const criticalFinding = await prisma.criticalFinding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CriticalFindingFindUniqueOrThrowArgs>(args: SelectSubset<T, CriticalFindingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CriticalFindingClient<$Result.GetResult<Prisma.$CriticalFindingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CriticalFinding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CriticalFindingFindFirstArgs} args - Arguments to find a CriticalFinding
     * @example
     * // Get one CriticalFinding
     * const criticalFinding = await prisma.criticalFinding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CriticalFindingFindFirstArgs>(args?: SelectSubset<T, CriticalFindingFindFirstArgs<ExtArgs>>): Prisma__CriticalFindingClient<$Result.GetResult<Prisma.$CriticalFindingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CriticalFinding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CriticalFindingFindFirstOrThrowArgs} args - Arguments to find a CriticalFinding
     * @example
     * // Get one CriticalFinding
     * const criticalFinding = await prisma.criticalFinding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CriticalFindingFindFirstOrThrowArgs>(args?: SelectSubset<T, CriticalFindingFindFirstOrThrowArgs<ExtArgs>>): Prisma__CriticalFindingClient<$Result.GetResult<Prisma.$CriticalFindingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CriticalFindings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CriticalFindingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CriticalFindings
     * const criticalFindings = await prisma.criticalFinding.findMany()
     * 
     * // Get first 10 CriticalFindings
     * const criticalFindings = await prisma.criticalFinding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const criticalFindingWithIdOnly = await prisma.criticalFinding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CriticalFindingFindManyArgs>(args?: SelectSubset<T, CriticalFindingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CriticalFindingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CriticalFinding.
     * @param {CriticalFindingCreateArgs} args - Arguments to create a CriticalFinding.
     * @example
     * // Create one CriticalFinding
     * const CriticalFinding = await prisma.criticalFinding.create({
     *   data: {
     *     // ... data to create a CriticalFinding
     *   }
     * })
     * 
     */
    create<T extends CriticalFindingCreateArgs>(args: SelectSubset<T, CriticalFindingCreateArgs<ExtArgs>>): Prisma__CriticalFindingClient<$Result.GetResult<Prisma.$CriticalFindingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CriticalFindings.
     * @param {CriticalFindingCreateManyArgs} args - Arguments to create many CriticalFindings.
     * @example
     * // Create many CriticalFindings
     * const criticalFinding = await prisma.criticalFinding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CriticalFindingCreateManyArgs>(args?: SelectSubset<T, CriticalFindingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CriticalFindings and returns the data saved in the database.
     * @param {CriticalFindingCreateManyAndReturnArgs} args - Arguments to create many CriticalFindings.
     * @example
     * // Create many CriticalFindings
     * const criticalFinding = await prisma.criticalFinding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CriticalFindings and only return the `id`
     * const criticalFindingWithIdOnly = await prisma.criticalFinding.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CriticalFindingCreateManyAndReturnArgs>(args?: SelectSubset<T, CriticalFindingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CriticalFindingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CriticalFinding.
     * @param {CriticalFindingDeleteArgs} args - Arguments to delete one CriticalFinding.
     * @example
     * // Delete one CriticalFinding
     * const CriticalFinding = await prisma.criticalFinding.delete({
     *   where: {
     *     // ... filter to delete one CriticalFinding
     *   }
     * })
     * 
     */
    delete<T extends CriticalFindingDeleteArgs>(args: SelectSubset<T, CriticalFindingDeleteArgs<ExtArgs>>): Prisma__CriticalFindingClient<$Result.GetResult<Prisma.$CriticalFindingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CriticalFinding.
     * @param {CriticalFindingUpdateArgs} args - Arguments to update one CriticalFinding.
     * @example
     * // Update one CriticalFinding
     * const criticalFinding = await prisma.criticalFinding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CriticalFindingUpdateArgs>(args: SelectSubset<T, CriticalFindingUpdateArgs<ExtArgs>>): Prisma__CriticalFindingClient<$Result.GetResult<Prisma.$CriticalFindingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CriticalFindings.
     * @param {CriticalFindingDeleteManyArgs} args - Arguments to filter CriticalFindings to delete.
     * @example
     * // Delete a few CriticalFindings
     * const { count } = await prisma.criticalFinding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CriticalFindingDeleteManyArgs>(args?: SelectSubset<T, CriticalFindingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CriticalFindings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CriticalFindingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CriticalFindings
     * const criticalFinding = await prisma.criticalFinding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CriticalFindingUpdateManyArgs>(args: SelectSubset<T, CriticalFindingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CriticalFinding.
     * @param {CriticalFindingUpsertArgs} args - Arguments to update or create a CriticalFinding.
     * @example
     * // Update or create a CriticalFinding
     * const criticalFinding = await prisma.criticalFinding.upsert({
     *   create: {
     *     // ... data to create a CriticalFinding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CriticalFinding we want to update
     *   }
     * })
     */
    upsert<T extends CriticalFindingUpsertArgs>(args: SelectSubset<T, CriticalFindingUpsertArgs<ExtArgs>>): Prisma__CriticalFindingClient<$Result.GetResult<Prisma.$CriticalFindingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CriticalFindings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CriticalFindingCountArgs} args - Arguments to filter CriticalFindings to count.
     * @example
     * // Count the number of CriticalFindings
     * const count = await prisma.criticalFinding.count({
     *   where: {
     *     // ... the filter for the CriticalFindings we want to count
     *   }
     * })
    **/
    count<T extends CriticalFindingCountArgs>(
      args?: Subset<T, CriticalFindingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CriticalFindingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CriticalFinding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CriticalFindingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CriticalFindingAggregateArgs>(args: Subset<T, CriticalFindingAggregateArgs>): Prisma.PrismaPromise<GetCriticalFindingAggregateType<T>>

    /**
     * Group by CriticalFinding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CriticalFindingGroupByArgs} args - Group by arguments.
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
      T extends CriticalFindingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CriticalFindingGroupByArgs['orderBy'] }
        : { orderBy?: CriticalFindingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CriticalFindingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCriticalFindingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CriticalFinding model
   */
  readonly fields: CriticalFindingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CriticalFinding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CriticalFindingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    study<T extends StudyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudyDefaultArgs<ExtArgs>>): Prisma__StudyClient<$Result.GetResult<Prisma.$StudyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the CriticalFinding model
   */ 
  interface CriticalFindingFieldRefs {
    readonly id: FieldRef<"CriticalFinding", 'String'>
    readonly studyId: FieldRef<"CriticalFinding", 'String'>
    readonly reportId: FieldRef<"CriticalFinding", 'String'>
    readonly finding: FieldRef<"CriticalFinding", 'String'>
    readonly severity: FieldRef<"CriticalFinding", 'Severity'>
    readonly category: FieldRef<"CriticalFinding", 'String'>
    readonly bodyPart: FieldRef<"CriticalFinding", 'String'>
    readonly reportedBy: FieldRef<"CriticalFinding", 'String'>
    readonly reportedAt: FieldRef<"CriticalFinding", 'DateTime'>
    readonly notifiedTo: FieldRef<"CriticalFinding", 'String[]'>
    readonly notificationSent: FieldRef<"CriticalFinding", 'Boolean'>
    readonly acknowledgedBy: FieldRef<"CriticalFinding", 'String'>
    readonly acknowledgedAt: FieldRef<"CriticalFinding", 'DateTime'>
    readonly followUpRequired: FieldRef<"CriticalFinding", 'Boolean'>
    readonly followUpAction: FieldRef<"CriticalFinding", 'String'>
    readonly followUpStatus: FieldRef<"CriticalFinding", 'String'>
    readonly notes: FieldRef<"CriticalFinding", 'String'>
    readonly createdAt: FieldRef<"CriticalFinding", 'DateTime'>
    readonly updatedAt: FieldRef<"CriticalFinding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CriticalFinding findUnique
   */
  export type CriticalFindingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingInclude<ExtArgs> | null
    /**
     * Filter, which CriticalFinding to fetch.
     */
    where: CriticalFindingWhereUniqueInput
  }

  /**
   * CriticalFinding findUniqueOrThrow
   */
  export type CriticalFindingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingInclude<ExtArgs> | null
    /**
     * Filter, which CriticalFinding to fetch.
     */
    where: CriticalFindingWhereUniqueInput
  }

  /**
   * CriticalFinding findFirst
   */
  export type CriticalFindingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingInclude<ExtArgs> | null
    /**
     * Filter, which CriticalFinding to fetch.
     */
    where?: CriticalFindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CriticalFindings to fetch.
     */
    orderBy?: CriticalFindingOrderByWithRelationInput | CriticalFindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CriticalFindings.
     */
    cursor?: CriticalFindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CriticalFindings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CriticalFindings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CriticalFindings.
     */
    distinct?: CriticalFindingScalarFieldEnum | CriticalFindingScalarFieldEnum[]
  }

  /**
   * CriticalFinding findFirstOrThrow
   */
  export type CriticalFindingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingInclude<ExtArgs> | null
    /**
     * Filter, which CriticalFinding to fetch.
     */
    where?: CriticalFindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CriticalFindings to fetch.
     */
    orderBy?: CriticalFindingOrderByWithRelationInput | CriticalFindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CriticalFindings.
     */
    cursor?: CriticalFindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CriticalFindings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CriticalFindings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CriticalFindings.
     */
    distinct?: CriticalFindingScalarFieldEnum | CriticalFindingScalarFieldEnum[]
  }

  /**
   * CriticalFinding findMany
   */
  export type CriticalFindingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingInclude<ExtArgs> | null
    /**
     * Filter, which CriticalFindings to fetch.
     */
    where?: CriticalFindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CriticalFindings to fetch.
     */
    orderBy?: CriticalFindingOrderByWithRelationInput | CriticalFindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CriticalFindings.
     */
    cursor?: CriticalFindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CriticalFindings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CriticalFindings.
     */
    skip?: number
    distinct?: CriticalFindingScalarFieldEnum | CriticalFindingScalarFieldEnum[]
  }

  /**
   * CriticalFinding create
   */
  export type CriticalFindingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingInclude<ExtArgs> | null
    /**
     * The data needed to create a CriticalFinding.
     */
    data: XOR<CriticalFindingCreateInput, CriticalFindingUncheckedCreateInput>
  }

  /**
   * CriticalFinding createMany
   */
  export type CriticalFindingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CriticalFindings.
     */
    data: CriticalFindingCreateManyInput | CriticalFindingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CriticalFinding createManyAndReturn
   */
  export type CriticalFindingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CriticalFindings.
     */
    data: CriticalFindingCreateManyInput | CriticalFindingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CriticalFinding update
   */
  export type CriticalFindingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingInclude<ExtArgs> | null
    /**
     * The data needed to update a CriticalFinding.
     */
    data: XOR<CriticalFindingUpdateInput, CriticalFindingUncheckedUpdateInput>
    /**
     * Choose, which CriticalFinding to update.
     */
    where: CriticalFindingWhereUniqueInput
  }

  /**
   * CriticalFinding updateMany
   */
  export type CriticalFindingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CriticalFindings.
     */
    data: XOR<CriticalFindingUpdateManyMutationInput, CriticalFindingUncheckedUpdateManyInput>
    /**
     * Filter which CriticalFindings to update
     */
    where?: CriticalFindingWhereInput
  }

  /**
   * CriticalFinding upsert
   */
  export type CriticalFindingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingInclude<ExtArgs> | null
    /**
     * The filter to search for the CriticalFinding to update in case it exists.
     */
    where: CriticalFindingWhereUniqueInput
    /**
     * In case the CriticalFinding found by the `where` argument doesn't exist, create a new CriticalFinding with this data.
     */
    create: XOR<CriticalFindingCreateInput, CriticalFindingUncheckedCreateInput>
    /**
     * In case the CriticalFinding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CriticalFindingUpdateInput, CriticalFindingUncheckedUpdateInput>
  }

  /**
   * CriticalFinding delete
   */
  export type CriticalFindingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingInclude<ExtArgs> | null
    /**
     * Filter which CriticalFinding to delete.
     */
    where: CriticalFindingWhereUniqueInput
  }

  /**
   * CriticalFinding deleteMany
   */
  export type CriticalFindingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CriticalFindings to delete
     */
    where?: CriticalFindingWhereInput
  }

  /**
   * CriticalFinding without action
   */
  export type CriticalFindingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CriticalFinding
     */
    select?: CriticalFindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CriticalFindingInclude<ExtArgs> | null
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


  export const ImagingOrderScalarFieldEnum: {
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

  export type ImagingOrderScalarFieldEnum = (typeof ImagingOrderScalarFieldEnum)[keyof typeof ImagingOrderScalarFieldEnum]


  export const StudyScalarFieldEnum: {
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

  export type StudyScalarFieldEnum = (typeof StudyScalarFieldEnum)[keyof typeof StudyScalarFieldEnum]


  export const ImageScalarFieldEnum: {
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

  export type ImageScalarFieldEnum = (typeof ImageScalarFieldEnum)[keyof typeof ImageScalarFieldEnum]


  export const RadiologyReportScalarFieldEnum: {
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

  export type RadiologyReportScalarFieldEnum = (typeof RadiologyReportScalarFieldEnum)[keyof typeof RadiologyReportScalarFieldEnum]


  export const CriticalFindingScalarFieldEnum: {
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

  export type CriticalFindingScalarFieldEnum = (typeof CriticalFindingScalarFieldEnum)[keyof typeof CriticalFindingScalarFieldEnum]


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


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Priority'
   */
  export type EnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority'>
    


  /**
   * Reference to a field of type 'Priority[]'
   */
  export type ListEnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority[]'>
    


  /**
   * Reference to a field of type 'Modality'
   */
  export type EnumModalityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Modality'>
    


  /**
   * Reference to a field of type 'Modality[]'
   */
  export type ListEnumModalityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Modality[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'OrderStatus'
   */
  export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus'>
    


  /**
   * Reference to a field of type 'OrderStatus[]'
   */
  export type ListEnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'StudyStatus'
   */
  export type EnumStudyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StudyStatus'>
    


  /**
   * Reference to a field of type 'StudyStatus[]'
   */
  export type ListEnumStudyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StudyStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'ReportStatus'
   */
  export type EnumReportStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportStatus'>
    


  /**
   * Reference to a field of type 'ReportStatus[]'
   */
  export type ListEnumReportStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReportStatus[]'>
    


  /**
   * Reference to a field of type 'Severity'
   */
  export type EnumSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Severity'>
    


  /**
   * Reference to a field of type 'Severity[]'
   */
  export type ListEnumSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Severity[]'>
    
  /**
   * Deep Input Types
   */


  export type ImagingOrderWhereInput = {
    AND?: ImagingOrderWhereInput | ImagingOrderWhereInput[]
    OR?: ImagingOrderWhereInput[]
    NOT?: ImagingOrderWhereInput | ImagingOrderWhereInput[]
    id?: StringFilter<"ImagingOrder"> | string
    patientId?: StringFilter<"ImagingOrder"> | string
    providerId?: StringFilter<"ImagingOrder"> | string
    facilityId?: StringFilter<"ImagingOrder"> | string
    orderNumber?: StringFilter<"ImagingOrder"> | string
    priority?: EnumPriorityFilter<"ImagingOrder"> | $Enums.Priority
    modality?: EnumModalityFilter<"ImagingOrder"> | $Enums.Modality
    bodyPart?: StringFilter<"ImagingOrder"> | string
    clinicalIndication?: StringFilter<"ImagingOrder"> | string
    instructions?: StringNullableFilter<"ImagingOrder"> | string | null
    urgency?: StringNullableFilter<"ImagingOrder"> | string | null
    transportRequired?: BoolFilter<"ImagingOrder"> | boolean
    contrastAllergy?: BoolFilter<"ImagingOrder"> | boolean
    contrastNotes?: StringNullableFilter<"ImagingOrder"> | string | null
    status?: EnumOrderStatusFilter<"ImagingOrder"> | $Enums.OrderStatus
    scheduledAt?: DateTimeNullableFilter<"ImagingOrder"> | Date | string | null
    requestedBy?: StringFilter<"ImagingOrder"> | string
    requestedAt?: DateTimeFilter<"ImagingOrder"> | Date | string
    createdAt?: DateTimeFilter<"ImagingOrder"> | Date | string
    updatedAt?: DateTimeFilter<"ImagingOrder"> | Date | string
    studies?: StudyListRelationFilter
  }

  export type ImagingOrderOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    facilityId?: SortOrder
    orderNumber?: SortOrder
    priority?: SortOrder
    modality?: SortOrder
    bodyPart?: SortOrder
    clinicalIndication?: SortOrder
    instructions?: SortOrderInput | SortOrder
    urgency?: SortOrderInput | SortOrder
    transportRequired?: SortOrder
    contrastAllergy?: SortOrder
    contrastNotes?: SortOrderInput | SortOrder
    status?: SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    requestedBy?: SortOrder
    requestedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    studies?: StudyOrderByRelationAggregateInput
  }

  export type ImagingOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderNumber?: string
    AND?: ImagingOrderWhereInput | ImagingOrderWhereInput[]
    OR?: ImagingOrderWhereInput[]
    NOT?: ImagingOrderWhereInput | ImagingOrderWhereInput[]
    patientId?: StringFilter<"ImagingOrder"> | string
    providerId?: StringFilter<"ImagingOrder"> | string
    facilityId?: StringFilter<"ImagingOrder"> | string
    priority?: EnumPriorityFilter<"ImagingOrder"> | $Enums.Priority
    modality?: EnumModalityFilter<"ImagingOrder"> | $Enums.Modality
    bodyPart?: StringFilter<"ImagingOrder"> | string
    clinicalIndication?: StringFilter<"ImagingOrder"> | string
    instructions?: StringNullableFilter<"ImagingOrder"> | string | null
    urgency?: StringNullableFilter<"ImagingOrder"> | string | null
    transportRequired?: BoolFilter<"ImagingOrder"> | boolean
    contrastAllergy?: BoolFilter<"ImagingOrder"> | boolean
    contrastNotes?: StringNullableFilter<"ImagingOrder"> | string | null
    status?: EnumOrderStatusFilter<"ImagingOrder"> | $Enums.OrderStatus
    scheduledAt?: DateTimeNullableFilter<"ImagingOrder"> | Date | string | null
    requestedBy?: StringFilter<"ImagingOrder"> | string
    requestedAt?: DateTimeFilter<"ImagingOrder"> | Date | string
    createdAt?: DateTimeFilter<"ImagingOrder"> | Date | string
    updatedAt?: DateTimeFilter<"ImagingOrder"> | Date | string
    studies?: StudyListRelationFilter
  }, "id" | "orderNumber">

  export type ImagingOrderOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    facilityId?: SortOrder
    orderNumber?: SortOrder
    priority?: SortOrder
    modality?: SortOrder
    bodyPart?: SortOrder
    clinicalIndication?: SortOrder
    instructions?: SortOrderInput | SortOrder
    urgency?: SortOrderInput | SortOrder
    transportRequired?: SortOrder
    contrastAllergy?: SortOrder
    contrastNotes?: SortOrderInput | SortOrder
    status?: SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    requestedBy?: SortOrder
    requestedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ImagingOrderCountOrderByAggregateInput
    _max?: ImagingOrderMaxOrderByAggregateInput
    _min?: ImagingOrderMinOrderByAggregateInput
  }

  export type ImagingOrderScalarWhereWithAggregatesInput = {
    AND?: ImagingOrderScalarWhereWithAggregatesInput | ImagingOrderScalarWhereWithAggregatesInput[]
    OR?: ImagingOrderScalarWhereWithAggregatesInput[]
    NOT?: ImagingOrderScalarWhereWithAggregatesInput | ImagingOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImagingOrder"> | string
    patientId?: StringWithAggregatesFilter<"ImagingOrder"> | string
    providerId?: StringWithAggregatesFilter<"ImagingOrder"> | string
    facilityId?: StringWithAggregatesFilter<"ImagingOrder"> | string
    orderNumber?: StringWithAggregatesFilter<"ImagingOrder"> | string
    priority?: EnumPriorityWithAggregatesFilter<"ImagingOrder"> | $Enums.Priority
    modality?: EnumModalityWithAggregatesFilter<"ImagingOrder"> | $Enums.Modality
    bodyPart?: StringWithAggregatesFilter<"ImagingOrder"> | string
    clinicalIndication?: StringWithAggregatesFilter<"ImagingOrder"> | string
    instructions?: StringNullableWithAggregatesFilter<"ImagingOrder"> | string | null
    urgency?: StringNullableWithAggregatesFilter<"ImagingOrder"> | string | null
    transportRequired?: BoolWithAggregatesFilter<"ImagingOrder"> | boolean
    contrastAllergy?: BoolWithAggregatesFilter<"ImagingOrder"> | boolean
    contrastNotes?: StringNullableWithAggregatesFilter<"ImagingOrder"> | string | null
    status?: EnumOrderStatusWithAggregatesFilter<"ImagingOrder"> | $Enums.OrderStatus
    scheduledAt?: DateTimeNullableWithAggregatesFilter<"ImagingOrder"> | Date | string | null
    requestedBy?: StringWithAggregatesFilter<"ImagingOrder"> | string
    requestedAt?: DateTimeWithAggregatesFilter<"ImagingOrder"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"ImagingOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ImagingOrder"> | Date | string
  }

  export type StudyWhereInput = {
    AND?: StudyWhereInput | StudyWhereInput[]
    OR?: StudyWhereInput[]
    NOT?: StudyWhereInput | StudyWhereInput[]
    id?: StringFilter<"Study"> | string
    orderId?: StringFilter<"Study"> | string
    accessionNumber?: StringFilter<"Study"> | string
    studyInstanceUID?: StringFilter<"Study"> | string
    studyDate?: DateTimeFilter<"Study"> | Date | string
    studyTime?: StringNullableFilter<"Study"> | string | null
    studyDescription?: StringFilter<"Study"> | string
    modality?: EnumModalityFilter<"Study"> | $Enums.Modality
    bodyPart?: StringFilter<"Study"> | string
    numberOfSeries?: IntFilter<"Study"> | number
    numberOfInstances?: IntFilter<"Study"> | number
    patientId?: StringFilter<"Study"> | string
    patientName?: StringFilter<"Study"> | string
    patientDOB?: DateTimeNullableFilter<"Study"> | Date | string | null
    patientSex?: StringNullableFilter<"Study"> | string | null
    performingPhysician?: StringNullableFilter<"Study"> | string | null
    operatorName?: StringNullableFilter<"Study"> | string | null
    institutionName?: StringNullableFilter<"Study"> | string | null
    stationName?: StringNullableFilter<"Study"> | string | null
    status?: EnumStudyStatusFilter<"Study"> | $Enums.StudyStatus
    priority?: EnumPriorityFilter<"Study"> | $Enums.Priority
    createdAt?: DateTimeFilter<"Study"> | Date | string
    updatedAt?: DateTimeFilter<"Study"> | Date | string
    order?: XOR<ImagingOrderRelationFilter, ImagingOrderWhereInput>
    images?: ImageListRelationFilter
    reports?: RadiologyReportListRelationFilter
    criticalFindings?: CriticalFindingListRelationFilter
  }

  export type StudyOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    accessionNumber?: SortOrder
    studyInstanceUID?: SortOrder
    studyDate?: SortOrder
    studyTime?: SortOrderInput | SortOrder
    studyDescription?: SortOrder
    modality?: SortOrder
    bodyPart?: SortOrder
    numberOfSeries?: SortOrder
    numberOfInstances?: SortOrder
    patientId?: SortOrder
    patientName?: SortOrder
    patientDOB?: SortOrderInput | SortOrder
    patientSex?: SortOrderInput | SortOrder
    performingPhysician?: SortOrderInput | SortOrder
    operatorName?: SortOrderInput | SortOrder
    institutionName?: SortOrderInput | SortOrder
    stationName?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    order?: ImagingOrderOrderByWithRelationInput
    images?: ImageOrderByRelationAggregateInput
    reports?: RadiologyReportOrderByRelationAggregateInput
    criticalFindings?: CriticalFindingOrderByRelationAggregateInput
  }

  export type StudyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accessionNumber?: string
    studyInstanceUID?: string
    AND?: StudyWhereInput | StudyWhereInput[]
    OR?: StudyWhereInput[]
    NOT?: StudyWhereInput | StudyWhereInput[]
    orderId?: StringFilter<"Study"> | string
    studyDate?: DateTimeFilter<"Study"> | Date | string
    studyTime?: StringNullableFilter<"Study"> | string | null
    studyDescription?: StringFilter<"Study"> | string
    modality?: EnumModalityFilter<"Study"> | $Enums.Modality
    bodyPart?: StringFilter<"Study"> | string
    numberOfSeries?: IntFilter<"Study"> | number
    numberOfInstances?: IntFilter<"Study"> | number
    patientId?: StringFilter<"Study"> | string
    patientName?: StringFilter<"Study"> | string
    patientDOB?: DateTimeNullableFilter<"Study"> | Date | string | null
    patientSex?: StringNullableFilter<"Study"> | string | null
    performingPhysician?: StringNullableFilter<"Study"> | string | null
    operatorName?: StringNullableFilter<"Study"> | string | null
    institutionName?: StringNullableFilter<"Study"> | string | null
    stationName?: StringNullableFilter<"Study"> | string | null
    status?: EnumStudyStatusFilter<"Study"> | $Enums.StudyStatus
    priority?: EnumPriorityFilter<"Study"> | $Enums.Priority
    createdAt?: DateTimeFilter<"Study"> | Date | string
    updatedAt?: DateTimeFilter<"Study"> | Date | string
    order?: XOR<ImagingOrderRelationFilter, ImagingOrderWhereInput>
    images?: ImageListRelationFilter
    reports?: RadiologyReportListRelationFilter
    criticalFindings?: CriticalFindingListRelationFilter
  }, "id" | "accessionNumber" | "studyInstanceUID">

  export type StudyOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    accessionNumber?: SortOrder
    studyInstanceUID?: SortOrder
    studyDate?: SortOrder
    studyTime?: SortOrderInput | SortOrder
    studyDescription?: SortOrder
    modality?: SortOrder
    bodyPart?: SortOrder
    numberOfSeries?: SortOrder
    numberOfInstances?: SortOrder
    patientId?: SortOrder
    patientName?: SortOrder
    patientDOB?: SortOrderInput | SortOrder
    patientSex?: SortOrderInput | SortOrder
    performingPhysician?: SortOrderInput | SortOrder
    operatorName?: SortOrderInput | SortOrder
    institutionName?: SortOrderInput | SortOrder
    stationName?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StudyCountOrderByAggregateInput
    _avg?: StudyAvgOrderByAggregateInput
    _max?: StudyMaxOrderByAggregateInput
    _min?: StudyMinOrderByAggregateInput
    _sum?: StudySumOrderByAggregateInput
  }

  export type StudyScalarWhereWithAggregatesInput = {
    AND?: StudyScalarWhereWithAggregatesInput | StudyScalarWhereWithAggregatesInput[]
    OR?: StudyScalarWhereWithAggregatesInput[]
    NOT?: StudyScalarWhereWithAggregatesInput | StudyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Study"> | string
    orderId?: StringWithAggregatesFilter<"Study"> | string
    accessionNumber?: StringWithAggregatesFilter<"Study"> | string
    studyInstanceUID?: StringWithAggregatesFilter<"Study"> | string
    studyDate?: DateTimeWithAggregatesFilter<"Study"> | Date | string
    studyTime?: StringNullableWithAggregatesFilter<"Study"> | string | null
    studyDescription?: StringWithAggregatesFilter<"Study"> | string
    modality?: EnumModalityWithAggregatesFilter<"Study"> | $Enums.Modality
    bodyPart?: StringWithAggregatesFilter<"Study"> | string
    numberOfSeries?: IntWithAggregatesFilter<"Study"> | number
    numberOfInstances?: IntWithAggregatesFilter<"Study"> | number
    patientId?: StringWithAggregatesFilter<"Study"> | string
    patientName?: StringWithAggregatesFilter<"Study"> | string
    patientDOB?: DateTimeNullableWithAggregatesFilter<"Study"> | Date | string | null
    patientSex?: StringNullableWithAggregatesFilter<"Study"> | string | null
    performingPhysician?: StringNullableWithAggregatesFilter<"Study"> | string | null
    operatorName?: StringNullableWithAggregatesFilter<"Study"> | string | null
    institutionName?: StringNullableWithAggregatesFilter<"Study"> | string | null
    stationName?: StringNullableWithAggregatesFilter<"Study"> | string | null
    status?: EnumStudyStatusWithAggregatesFilter<"Study"> | $Enums.StudyStatus
    priority?: EnumPriorityWithAggregatesFilter<"Study"> | $Enums.Priority
    createdAt?: DateTimeWithAggregatesFilter<"Study"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Study"> | Date | string
  }

  export type ImageWhereInput = {
    AND?: ImageWhereInput | ImageWhereInput[]
    OR?: ImageWhereInput[]
    NOT?: ImageWhereInput | ImageWhereInput[]
    id?: StringFilter<"Image"> | string
    studyId?: StringFilter<"Image"> | string
    seriesInstanceUID?: StringFilter<"Image"> | string
    sopInstanceUID?: StringFilter<"Image"> | string
    instanceNumber?: IntFilter<"Image"> | number
    seriesNumber?: IntFilter<"Image"> | number
    seriesDescription?: StringNullableFilter<"Image"> | string | null
    imageType?: StringNullableFilter<"Image"> | string | null
    photometricInterpretation?: StringNullableFilter<"Image"> | string | null
    rows?: IntNullableFilter<"Image"> | number | null
    columns?: IntNullableFilter<"Image"> | number | null
    bitsAllocated?: IntNullableFilter<"Image"> | number | null
    bitsStored?: IntNullableFilter<"Image"> | number | null
    pixelSpacing?: StringNullableFilter<"Image"> | string | null
    sliceThickness?: FloatNullableFilter<"Image"> | number | null
    sliceLocation?: FloatNullableFilter<"Image"> | number | null
    imagePosition?: StringNullableFilter<"Image"> | string | null
    imageOrientation?: StringNullableFilter<"Image"> | string | null
    acquisitionDate?: DateTimeNullableFilter<"Image"> | Date | string | null
    acquisitionTime?: StringNullableFilter<"Image"> | string | null
    contentDate?: DateTimeNullableFilter<"Image"> | Date | string | null
    contentTime?: StringNullableFilter<"Image"> | string | null
    windowCenter?: StringNullableFilter<"Image"> | string | null
    windowWidth?: StringNullableFilter<"Image"> | string | null
    storageUrl?: StringFilter<"Image"> | string
    thumbnailUrl?: StringNullableFilter<"Image"> | string | null
    fileSize?: BigIntFilter<"Image"> | bigint | number
    transferSyntaxUID?: StringNullableFilter<"Image"> | string | null
    metadata?: JsonNullableFilter<"Image">
    createdAt?: DateTimeFilter<"Image"> | Date | string
    updatedAt?: DateTimeFilter<"Image"> | Date | string
    study?: XOR<StudyRelationFilter, StudyWhereInput>
  }

  export type ImageOrderByWithRelationInput = {
    id?: SortOrder
    studyId?: SortOrder
    seriesInstanceUID?: SortOrder
    sopInstanceUID?: SortOrder
    instanceNumber?: SortOrder
    seriesNumber?: SortOrder
    seriesDescription?: SortOrderInput | SortOrder
    imageType?: SortOrderInput | SortOrder
    photometricInterpretation?: SortOrderInput | SortOrder
    rows?: SortOrderInput | SortOrder
    columns?: SortOrderInput | SortOrder
    bitsAllocated?: SortOrderInput | SortOrder
    bitsStored?: SortOrderInput | SortOrder
    pixelSpacing?: SortOrderInput | SortOrder
    sliceThickness?: SortOrderInput | SortOrder
    sliceLocation?: SortOrderInput | SortOrder
    imagePosition?: SortOrderInput | SortOrder
    imageOrientation?: SortOrderInput | SortOrder
    acquisitionDate?: SortOrderInput | SortOrder
    acquisitionTime?: SortOrderInput | SortOrder
    contentDate?: SortOrderInput | SortOrder
    contentTime?: SortOrderInput | SortOrder
    windowCenter?: SortOrderInput | SortOrder
    windowWidth?: SortOrderInput | SortOrder
    storageUrl?: SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    fileSize?: SortOrder
    transferSyntaxUID?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    study?: StudyOrderByWithRelationInput
  }

  export type ImageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sopInstanceUID?: string
    AND?: ImageWhereInput | ImageWhereInput[]
    OR?: ImageWhereInput[]
    NOT?: ImageWhereInput | ImageWhereInput[]
    studyId?: StringFilter<"Image"> | string
    seriesInstanceUID?: StringFilter<"Image"> | string
    instanceNumber?: IntFilter<"Image"> | number
    seriesNumber?: IntFilter<"Image"> | number
    seriesDescription?: StringNullableFilter<"Image"> | string | null
    imageType?: StringNullableFilter<"Image"> | string | null
    photometricInterpretation?: StringNullableFilter<"Image"> | string | null
    rows?: IntNullableFilter<"Image"> | number | null
    columns?: IntNullableFilter<"Image"> | number | null
    bitsAllocated?: IntNullableFilter<"Image"> | number | null
    bitsStored?: IntNullableFilter<"Image"> | number | null
    pixelSpacing?: StringNullableFilter<"Image"> | string | null
    sliceThickness?: FloatNullableFilter<"Image"> | number | null
    sliceLocation?: FloatNullableFilter<"Image"> | number | null
    imagePosition?: StringNullableFilter<"Image"> | string | null
    imageOrientation?: StringNullableFilter<"Image"> | string | null
    acquisitionDate?: DateTimeNullableFilter<"Image"> | Date | string | null
    acquisitionTime?: StringNullableFilter<"Image"> | string | null
    contentDate?: DateTimeNullableFilter<"Image"> | Date | string | null
    contentTime?: StringNullableFilter<"Image"> | string | null
    windowCenter?: StringNullableFilter<"Image"> | string | null
    windowWidth?: StringNullableFilter<"Image"> | string | null
    storageUrl?: StringFilter<"Image"> | string
    thumbnailUrl?: StringNullableFilter<"Image"> | string | null
    fileSize?: BigIntFilter<"Image"> | bigint | number
    transferSyntaxUID?: StringNullableFilter<"Image"> | string | null
    metadata?: JsonNullableFilter<"Image">
    createdAt?: DateTimeFilter<"Image"> | Date | string
    updatedAt?: DateTimeFilter<"Image"> | Date | string
    study?: XOR<StudyRelationFilter, StudyWhereInput>
  }, "id" | "sopInstanceUID">

  export type ImageOrderByWithAggregationInput = {
    id?: SortOrder
    studyId?: SortOrder
    seriesInstanceUID?: SortOrder
    sopInstanceUID?: SortOrder
    instanceNumber?: SortOrder
    seriesNumber?: SortOrder
    seriesDescription?: SortOrderInput | SortOrder
    imageType?: SortOrderInput | SortOrder
    photometricInterpretation?: SortOrderInput | SortOrder
    rows?: SortOrderInput | SortOrder
    columns?: SortOrderInput | SortOrder
    bitsAllocated?: SortOrderInput | SortOrder
    bitsStored?: SortOrderInput | SortOrder
    pixelSpacing?: SortOrderInput | SortOrder
    sliceThickness?: SortOrderInput | SortOrder
    sliceLocation?: SortOrderInput | SortOrder
    imagePosition?: SortOrderInput | SortOrder
    imageOrientation?: SortOrderInput | SortOrder
    acquisitionDate?: SortOrderInput | SortOrder
    acquisitionTime?: SortOrderInput | SortOrder
    contentDate?: SortOrderInput | SortOrder
    contentTime?: SortOrderInput | SortOrder
    windowCenter?: SortOrderInput | SortOrder
    windowWidth?: SortOrderInput | SortOrder
    storageUrl?: SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    fileSize?: SortOrder
    transferSyntaxUID?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ImageCountOrderByAggregateInput
    _avg?: ImageAvgOrderByAggregateInput
    _max?: ImageMaxOrderByAggregateInput
    _min?: ImageMinOrderByAggregateInput
    _sum?: ImageSumOrderByAggregateInput
  }

  export type ImageScalarWhereWithAggregatesInput = {
    AND?: ImageScalarWhereWithAggregatesInput | ImageScalarWhereWithAggregatesInput[]
    OR?: ImageScalarWhereWithAggregatesInput[]
    NOT?: ImageScalarWhereWithAggregatesInput | ImageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Image"> | string
    studyId?: StringWithAggregatesFilter<"Image"> | string
    seriesInstanceUID?: StringWithAggregatesFilter<"Image"> | string
    sopInstanceUID?: StringWithAggregatesFilter<"Image"> | string
    instanceNumber?: IntWithAggregatesFilter<"Image"> | number
    seriesNumber?: IntWithAggregatesFilter<"Image"> | number
    seriesDescription?: StringNullableWithAggregatesFilter<"Image"> | string | null
    imageType?: StringNullableWithAggregatesFilter<"Image"> | string | null
    photometricInterpretation?: StringNullableWithAggregatesFilter<"Image"> | string | null
    rows?: IntNullableWithAggregatesFilter<"Image"> | number | null
    columns?: IntNullableWithAggregatesFilter<"Image"> | number | null
    bitsAllocated?: IntNullableWithAggregatesFilter<"Image"> | number | null
    bitsStored?: IntNullableWithAggregatesFilter<"Image"> | number | null
    pixelSpacing?: StringNullableWithAggregatesFilter<"Image"> | string | null
    sliceThickness?: FloatNullableWithAggregatesFilter<"Image"> | number | null
    sliceLocation?: FloatNullableWithAggregatesFilter<"Image"> | number | null
    imagePosition?: StringNullableWithAggregatesFilter<"Image"> | string | null
    imageOrientation?: StringNullableWithAggregatesFilter<"Image"> | string | null
    acquisitionDate?: DateTimeNullableWithAggregatesFilter<"Image"> | Date | string | null
    acquisitionTime?: StringNullableWithAggregatesFilter<"Image"> | string | null
    contentDate?: DateTimeNullableWithAggregatesFilter<"Image"> | Date | string | null
    contentTime?: StringNullableWithAggregatesFilter<"Image"> | string | null
    windowCenter?: StringNullableWithAggregatesFilter<"Image"> | string | null
    windowWidth?: StringNullableWithAggregatesFilter<"Image"> | string | null
    storageUrl?: StringWithAggregatesFilter<"Image"> | string
    thumbnailUrl?: StringNullableWithAggregatesFilter<"Image"> | string | null
    fileSize?: BigIntWithAggregatesFilter<"Image"> | bigint | number
    transferSyntaxUID?: StringNullableWithAggregatesFilter<"Image"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Image">
    createdAt?: DateTimeWithAggregatesFilter<"Image"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Image"> | Date | string
  }

  export type RadiologyReportWhereInput = {
    AND?: RadiologyReportWhereInput | RadiologyReportWhereInput[]
    OR?: RadiologyReportWhereInput[]
    NOT?: RadiologyReportWhereInput | RadiologyReportWhereInput[]
    id?: StringFilter<"RadiologyReport"> | string
    studyId?: StringFilter<"RadiologyReport"> | string
    reportNumber?: StringFilter<"RadiologyReport"> | string
    radiologistId?: StringFilter<"RadiologyReport"> | string
    radiologistName?: StringFilter<"RadiologyReport"> | string
    status?: EnumReportStatusFilter<"RadiologyReport"> | $Enums.ReportStatus
    clinicalHistory?: StringNullableFilter<"RadiologyReport"> | string | null
    technique?: StringNullableFilter<"RadiologyReport"> | string | null
    comparison?: StringNullableFilter<"RadiologyReport"> | string | null
    findings?: StringFilter<"RadiologyReport"> | string
    impression?: StringFilter<"RadiologyReport"> | string
    recommendations?: StringNullableFilter<"RadiologyReport"> | string | null
    preliminaryDate?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    finalizedDate?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    amendedDate?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    amendmentReason?: StringNullableFilter<"RadiologyReport"> | string | null
    signedBy?: StringNullableFilter<"RadiologyReport"> | string | null
    signedAt?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    transcribedBy?: StringNullableFilter<"RadiologyReport"> | string | null
    transcribedAt?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    template?: StringNullableFilter<"RadiologyReport"> | string | null
    macros?: JsonNullableFilter<"RadiologyReport">
    createdAt?: DateTimeFilter<"RadiologyReport"> | Date | string
    updatedAt?: DateTimeFilter<"RadiologyReport"> | Date | string
    study?: XOR<StudyRelationFilter, StudyWhereInput>
  }

  export type RadiologyReportOrderByWithRelationInput = {
    id?: SortOrder
    studyId?: SortOrder
    reportNumber?: SortOrder
    radiologistId?: SortOrder
    radiologistName?: SortOrder
    status?: SortOrder
    clinicalHistory?: SortOrderInput | SortOrder
    technique?: SortOrderInput | SortOrder
    comparison?: SortOrderInput | SortOrder
    findings?: SortOrder
    impression?: SortOrder
    recommendations?: SortOrderInput | SortOrder
    preliminaryDate?: SortOrderInput | SortOrder
    finalizedDate?: SortOrderInput | SortOrder
    amendedDate?: SortOrderInput | SortOrder
    amendmentReason?: SortOrderInput | SortOrder
    signedBy?: SortOrderInput | SortOrder
    signedAt?: SortOrderInput | SortOrder
    transcribedBy?: SortOrderInput | SortOrder
    transcribedAt?: SortOrderInput | SortOrder
    template?: SortOrderInput | SortOrder
    macros?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    study?: StudyOrderByWithRelationInput
  }

  export type RadiologyReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    reportNumber?: string
    AND?: RadiologyReportWhereInput | RadiologyReportWhereInput[]
    OR?: RadiologyReportWhereInput[]
    NOT?: RadiologyReportWhereInput | RadiologyReportWhereInput[]
    studyId?: StringFilter<"RadiologyReport"> | string
    radiologistId?: StringFilter<"RadiologyReport"> | string
    radiologistName?: StringFilter<"RadiologyReport"> | string
    status?: EnumReportStatusFilter<"RadiologyReport"> | $Enums.ReportStatus
    clinicalHistory?: StringNullableFilter<"RadiologyReport"> | string | null
    technique?: StringNullableFilter<"RadiologyReport"> | string | null
    comparison?: StringNullableFilter<"RadiologyReport"> | string | null
    findings?: StringFilter<"RadiologyReport"> | string
    impression?: StringFilter<"RadiologyReport"> | string
    recommendations?: StringNullableFilter<"RadiologyReport"> | string | null
    preliminaryDate?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    finalizedDate?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    amendedDate?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    amendmentReason?: StringNullableFilter<"RadiologyReport"> | string | null
    signedBy?: StringNullableFilter<"RadiologyReport"> | string | null
    signedAt?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    transcribedBy?: StringNullableFilter<"RadiologyReport"> | string | null
    transcribedAt?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    template?: StringNullableFilter<"RadiologyReport"> | string | null
    macros?: JsonNullableFilter<"RadiologyReport">
    createdAt?: DateTimeFilter<"RadiologyReport"> | Date | string
    updatedAt?: DateTimeFilter<"RadiologyReport"> | Date | string
    study?: XOR<StudyRelationFilter, StudyWhereInput>
  }, "id" | "reportNumber">

  export type RadiologyReportOrderByWithAggregationInput = {
    id?: SortOrder
    studyId?: SortOrder
    reportNumber?: SortOrder
    radiologistId?: SortOrder
    radiologistName?: SortOrder
    status?: SortOrder
    clinicalHistory?: SortOrderInput | SortOrder
    technique?: SortOrderInput | SortOrder
    comparison?: SortOrderInput | SortOrder
    findings?: SortOrder
    impression?: SortOrder
    recommendations?: SortOrderInput | SortOrder
    preliminaryDate?: SortOrderInput | SortOrder
    finalizedDate?: SortOrderInput | SortOrder
    amendedDate?: SortOrderInput | SortOrder
    amendmentReason?: SortOrderInput | SortOrder
    signedBy?: SortOrderInput | SortOrder
    signedAt?: SortOrderInput | SortOrder
    transcribedBy?: SortOrderInput | SortOrder
    transcribedAt?: SortOrderInput | SortOrder
    template?: SortOrderInput | SortOrder
    macros?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RadiologyReportCountOrderByAggregateInput
    _max?: RadiologyReportMaxOrderByAggregateInput
    _min?: RadiologyReportMinOrderByAggregateInput
  }

  export type RadiologyReportScalarWhereWithAggregatesInput = {
    AND?: RadiologyReportScalarWhereWithAggregatesInput | RadiologyReportScalarWhereWithAggregatesInput[]
    OR?: RadiologyReportScalarWhereWithAggregatesInput[]
    NOT?: RadiologyReportScalarWhereWithAggregatesInput | RadiologyReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RadiologyReport"> | string
    studyId?: StringWithAggregatesFilter<"RadiologyReport"> | string
    reportNumber?: StringWithAggregatesFilter<"RadiologyReport"> | string
    radiologistId?: StringWithAggregatesFilter<"RadiologyReport"> | string
    radiologistName?: StringWithAggregatesFilter<"RadiologyReport"> | string
    status?: EnumReportStatusWithAggregatesFilter<"RadiologyReport"> | $Enums.ReportStatus
    clinicalHistory?: StringNullableWithAggregatesFilter<"RadiologyReport"> | string | null
    technique?: StringNullableWithAggregatesFilter<"RadiologyReport"> | string | null
    comparison?: StringNullableWithAggregatesFilter<"RadiologyReport"> | string | null
    findings?: StringWithAggregatesFilter<"RadiologyReport"> | string
    impression?: StringWithAggregatesFilter<"RadiologyReport"> | string
    recommendations?: StringNullableWithAggregatesFilter<"RadiologyReport"> | string | null
    preliminaryDate?: DateTimeNullableWithAggregatesFilter<"RadiologyReport"> | Date | string | null
    finalizedDate?: DateTimeNullableWithAggregatesFilter<"RadiologyReport"> | Date | string | null
    amendedDate?: DateTimeNullableWithAggregatesFilter<"RadiologyReport"> | Date | string | null
    amendmentReason?: StringNullableWithAggregatesFilter<"RadiologyReport"> | string | null
    signedBy?: StringNullableWithAggregatesFilter<"RadiologyReport"> | string | null
    signedAt?: DateTimeNullableWithAggregatesFilter<"RadiologyReport"> | Date | string | null
    transcribedBy?: StringNullableWithAggregatesFilter<"RadiologyReport"> | string | null
    transcribedAt?: DateTimeNullableWithAggregatesFilter<"RadiologyReport"> | Date | string | null
    template?: StringNullableWithAggregatesFilter<"RadiologyReport"> | string | null
    macros?: JsonNullableWithAggregatesFilter<"RadiologyReport">
    createdAt?: DateTimeWithAggregatesFilter<"RadiologyReport"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RadiologyReport"> | Date | string
  }

  export type CriticalFindingWhereInput = {
    AND?: CriticalFindingWhereInput | CriticalFindingWhereInput[]
    OR?: CriticalFindingWhereInput[]
    NOT?: CriticalFindingWhereInput | CriticalFindingWhereInput[]
    id?: StringFilter<"CriticalFinding"> | string
    studyId?: StringFilter<"CriticalFinding"> | string
    reportId?: StringNullableFilter<"CriticalFinding"> | string | null
    finding?: StringFilter<"CriticalFinding"> | string
    severity?: EnumSeverityFilter<"CriticalFinding"> | $Enums.Severity
    category?: StringFilter<"CriticalFinding"> | string
    bodyPart?: StringNullableFilter<"CriticalFinding"> | string | null
    reportedBy?: StringFilter<"CriticalFinding"> | string
    reportedAt?: DateTimeFilter<"CriticalFinding"> | Date | string
    notifiedTo?: StringNullableListFilter<"CriticalFinding">
    notificationSent?: BoolFilter<"CriticalFinding"> | boolean
    acknowledgedBy?: StringNullableFilter<"CriticalFinding"> | string | null
    acknowledgedAt?: DateTimeNullableFilter<"CriticalFinding"> | Date | string | null
    followUpRequired?: BoolFilter<"CriticalFinding"> | boolean
    followUpAction?: StringNullableFilter<"CriticalFinding"> | string | null
    followUpStatus?: StringNullableFilter<"CriticalFinding"> | string | null
    notes?: StringNullableFilter<"CriticalFinding"> | string | null
    createdAt?: DateTimeFilter<"CriticalFinding"> | Date | string
    updatedAt?: DateTimeFilter<"CriticalFinding"> | Date | string
    study?: XOR<StudyRelationFilter, StudyWhereInput>
  }

  export type CriticalFindingOrderByWithRelationInput = {
    id?: SortOrder
    studyId?: SortOrder
    reportId?: SortOrderInput | SortOrder
    finding?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    bodyPart?: SortOrderInput | SortOrder
    reportedBy?: SortOrder
    reportedAt?: SortOrder
    notifiedTo?: SortOrder
    notificationSent?: SortOrder
    acknowledgedBy?: SortOrderInput | SortOrder
    acknowledgedAt?: SortOrderInput | SortOrder
    followUpRequired?: SortOrder
    followUpAction?: SortOrderInput | SortOrder
    followUpStatus?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    study?: StudyOrderByWithRelationInput
  }

  export type CriticalFindingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CriticalFindingWhereInput | CriticalFindingWhereInput[]
    OR?: CriticalFindingWhereInput[]
    NOT?: CriticalFindingWhereInput | CriticalFindingWhereInput[]
    studyId?: StringFilter<"CriticalFinding"> | string
    reportId?: StringNullableFilter<"CriticalFinding"> | string | null
    finding?: StringFilter<"CriticalFinding"> | string
    severity?: EnumSeverityFilter<"CriticalFinding"> | $Enums.Severity
    category?: StringFilter<"CriticalFinding"> | string
    bodyPart?: StringNullableFilter<"CriticalFinding"> | string | null
    reportedBy?: StringFilter<"CriticalFinding"> | string
    reportedAt?: DateTimeFilter<"CriticalFinding"> | Date | string
    notifiedTo?: StringNullableListFilter<"CriticalFinding">
    notificationSent?: BoolFilter<"CriticalFinding"> | boolean
    acknowledgedBy?: StringNullableFilter<"CriticalFinding"> | string | null
    acknowledgedAt?: DateTimeNullableFilter<"CriticalFinding"> | Date | string | null
    followUpRequired?: BoolFilter<"CriticalFinding"> | boolean
    followUpAction?: StringNullableFilter<"CriticalFinding"> | string | null
    followUpStatus?: StringNullableFilter<"CriticalFinding"> | string | null
    notes?: StringNullableFilter<"CriticalFinding"> | string | null
    createdAt?: DateTimeFilter<"CriticalFinding"> | Date | string
    updatedAt?: DateTimeFilter<"CriticalFinding"> | Date | string
    study?: XOR<StudyRelationFilter, StudyWhereInput>
  }, "id">

  export type CriticalFindingOrderByWithAggregationInput = {
    id?: SortOrder
    studyId?: SortOrder
    reportId?: SortOrderInput | SortOrder
    finding?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    bodyPart?: SortOrderInput | SortOrder
    reportedBy?: SortOrder
    reportedAt?: SortOrder
    notifiedTo?: SortOrder
    notificationSent?: SortOrder
    acknowledgedBy?: SortOrderInput | SortOrder
    acknowledgedAt?: SortOrderInput | SortOrder
    followUpRequired?: SortOrder
    followUpAction?: SortOrderInput | SortOrder
    followUpStatus?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CriticalFindingCountOrderByAggregateInput
    _max?: CriticalFindingMaxOrderByAggregateInput
    _min?: CriticalFindingMinOrderByAggregateInput
  }

  export type CriticalFindingScalarWhereWithAggregatesInput = {
    AND?: CriticalFindingScalarWhereWithAggregatesInput | CriticalFindingScalarWhereWithAggregatesInput[]
    OR?: CriticalFindingScalarWhereWithAggregatesInput[]
    NOT?: CriticalFindingScalarWhereWithAggregatesInput | CriticalFindingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CriticalFinding"> | string
    studyId?: StringWithAggregatesFilter<"CriticalFinding"> | string
    reportId?: StringNullableWithAggregatesFilter<"CriticalFinding"> | string | null
    finding?: StringWithAggregatesFilter<"CriticalFinding"> | string
    severity?: EnumSeverityWithAggregatesFilter<"CriticalFinding"> | $Enums.Severity
    category?: StringWithAggregatesFilter<"CriticalFinding"> | string
    bodyPart?: StringNullableWithAggregatesFilter<"CriticalFinding"> | string | null
    reportedBy?: StringWithAggregatesFilter<"CriticalFinding"> | string
    reportedAt?: DateTimeWithAggregatesFilter<"CriticalFinding"> | Date | string
    notifiedTo?: StringNullableListFilter<"CriticalFinding">
    notificationSent?: BoolWithAggregatesFilter<"CriticalFinding"> | boolean
    acknowledgedBy?: StringNullableWithAggregatesFilter<"CriticalFinding"> | string | null
    acknowledgedAt?: DateTimeNullableWithAggregatesFilter<"CriticalFinding"> | Date | string | null
    followUpRequired?: BoolWithAggregatesFilter<"CriticalFinding"> | boolean
    followUpAction?: StringNullableWithAggregatesFilter<"CriticalFinding"> | string | null
    followUpStatus?: StringNullableWithAggregatesFilter<"CriticalFinding"> | string | null
    notes?: StringNullableWithAggregatesFilter<"CriticalFinding"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CriticalFinding"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CriticalFinding"> | Date | string
  }

  export type ImagingOrderCreateInput = {
    id?: string
    patientId: string
    providerId: string
    facilityId: string
    orderNumber: string
    priority?: $Enums.Priority
    modality: $Enums.Modality
    bodyPart: string
    clinicalIndication: string
    instructions?: string | null
    urgency?: string | null
    transportRequired?: boolean
    contrastAllergy?: boolean
    contrastNotes?: string | null
    status?: $Enums.OrderStatus
    scheduledAt?: Date | string | null
    requestedBy: string
    requestedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    studies?: StudyCreateNestedManyWithoutOrderInput
  }

  export type ImagingOrderUncheckedCreateInput = {
    id?: string
    patientId: string
    providerId: string
    facilityId: string
    orderNumber: string
    priority?: $Enums.Priority
    modality: $Enums.Modality
    bodyPart: string
    clinicalIndication: string
    instructions?: string | null
    urgency?: string | null
    transportRequired?: boolean
    contrastAllergy?: boolean
    contrastNotes?: string | null
    status?: $Enums.OrderStatus
    scheduledAt?: Date | string | null
    requestedBy: string
    requestedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    studies?: StudyUncheckedCreateNestedManyWithoutOrderInput
  }

  export type ImagingOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    clinicalIndication?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    urgency?: NullableStringFieldUpdateOperationsInput | string | null
    transportRequired?: BoolFieldUpdateOperationsInput | boolean
    contrastAllergy?: BoolFieldUpdateOperationsInput | boolean
    contrastNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestedBy?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studies?: StudyUpdateManyWithoutOrderNestedInput
  }

  export type ImagingOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    clinicalIndication?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    urgency?: NullableStringFieldUpdateOperationsInput | string | null
    transportRequired?: BoolFieldUpdateOperationsInput | boolean
    contrastAllergy?: BoolFieldUpdateOperationsInput | boolean
    contrastNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestedBy?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studies?: StudyUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type ImagingOrderCreateManyInput = {
    id?: string
    patientId: string
    providerId: string
    facilityId: string
    orderNumber: string
    priority?: $Enums.Priority
    modality: $Enums.Modality
    bodyPart: string
    clinicalIndication: string
    instructions?: string | null
    urgency?: string | null
    transportRequired?: boolean
    contrastAllergy?: boolean
    contrastNotes?: string | null
    status?: $Enums.OrderStatus
    scheduledAt?: Date | string | null
    requestedBy: string
    requestedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImagingOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    clinicalIndication?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    urgency?: NullableStringFieldUpdateOperationsInput | string | null
    transportRequired?: BoolFieldUpdateOperationsInput | boolean
    contrastAllergy?: BoolFieldUpdateOperationsInput | boolean
    contrastNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestedBy?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImagingOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    clinicalIndication?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    urgency?: NullableStringFieldUpdateOperationsInput | string | null
    transportRequired?: BoolFieldUpdateOperationsInput | boolean
    contrastAllergy?: BoolFieldUpdateOperationsInput | boolean
    contrastNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestedBy?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudyCreateInput = {
    id?: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
    order: ImagingOrderCreateNestedOneWithoutStudiesInput
    images?: ImageCreateNestedManyWithoutStudyInput
    reports?: RadiologyReportCreateNestedManyWithoutStudyInput
    criticalFindings?: CriticalFindingCreateNestedManyWithoutStudyInput
  }

  export type StudyUncheckedCreateInput = {
    id?: string
    orderId: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ImageUncheckedCreateNestedManyWithoutStudyInput
    reports?: RadiologyReportUncheckedCreateNestedManyWithoutStudyInput
    criticalFindings?: CriticalFindingUncheckedCreateNestedManyWithoutStudyInput
  }

  export type StudyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: ImagingOrderUpdateOneRequiredWithoutStudiesNestedInput
    images?: ImageUpdateManyWithoutStudyNestedInput
    reports?: RadiologyReportUpdateManyWithoutStudyNestedInput
    criticalFindings?: CriticalFindingUpdateManyWithoutStudyNestedInput
  }

  export type StudyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ImageUncheckedUpdateManyWithoutStudyNestedInput
    reports?: RadiologyReportUncheckedUpdateManyWithoutStudyNestedInput
    criticalFindings?: CriticalFindingUncheckedUpdateManyWithoutStudyNestedInput
  }

  export type StudyCreateManyInput = {
    id?: string
    orderId: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageCreateInput = {
    id?: string
    seriesInstanceUID: string
    sopInstanceUID: string
    instanceNumber: number
    seriesNumber: number
    seriesDescription?: string | null
    imageType?: string | null
    photometricInterpretation?: string | null
    rows?: number | null
    columns?: number | null
    bitsAllocated?: number | null
    bitsStored?: number | null
    pixelSpacing?: string | null
    sliceThickness?: number | null
    sliceLocation?: number | null
    imagePosition?: string | null
    imageOrientation?: string | null
    acquisitionDate?: Date | string | null
    acquisitionTime?: string | null
    contentDate?: Date | string | null
    contentTime?: string | null
    windowCenter?: string | null
    windowWidth?: string | null
    storageUrl: string
    thumbnailUrl?: string | null
    fileSize: bigint | number
    transferSyntaxUID?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    study: StudyCreateNestedOneWithoutImagesInput
  }

  export type ImageUncheckedCreateInput = {
    id?: string
    studyId: string
    seriesInstanceUID: string
    sopInstanceUID: string
    instanceNumber: number
    seriesNumber: number
    seriesDescription?: string | null
    imageType?: string | null
    photometricInterpretation?: string | null
    rows?: number | null
    columns?: number | null
    bitsAllocated?: number | null
    bitsStored?: number | null
    pixelSpacing?: string | null
    sliceThickness?: number | null
    sliceLocation?: number | null
    imagePosition?: string | null
    imageOrientation?: string | null
    acquisitionDate?: Date | string | null
    acquisitionTime?: string | null
    contentDate?: Date | string | null
    contentTime?: string | null
    windowCenter?: string | null
    windowWidth?: string | null
    storageUrl: string
    thumbnailUrl?: string | null
    fileSize: bigint | number
    transferSyntaxUID?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    seriesInstanceUID?: StringFieldUpdateOperationsInput | string
    sopInstanceUID?: StringFieldUpdateOperationsInput | string
    instanceNumber?: IntFieldUpdateOperationsInput | number
    seriesNumber?: IntFieldUpdateOperationsInput | number
    seriesDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageType?: NullableStringFieldUpdateOperationsInput | string | null
    photometricInterpretation?: NullableStringFieldUpdateOperationsInput | string | null
    rows?: NullableIntFieldUpdateOperationsInput | number | null
    columns?: NullableIntFieldUpdateOperationsInput | number | null
    bitsAllocated?: NullableIntFieldUpdateOperationsInput | number | null
    bitsStored?: NullableIntFieldUpdateOperationsInput | number | null
    pixelSpacing?: NullableStringFieldUpdateOperationsInput | string | null
    sliceThickness?: NullableFloatFieldUpdateOperationsInput | number | null
    sliceLocation?: NullableFloatFieldUpdateOperationsInput | number | null
    imagePosition?: NullableStringFieldUpdateOperationsInput | string | null
    imageOrientation?: NullableStringFieldUpdateOperationsInput | string | null
    acquisitionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acquisitionTime?: NullableStringFieldUpdateOperationsInput | string | null
    contentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentTime?: NullableStringFieldUpdateOperationsInput | string | null
    windowCenter?: NullableStringFieldUpdateOperationsInput | string | null
    windowWidth?: NullableStringFieldUpdateOperationsInput | string | null
    storageUrl?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    transferSyntaxUID?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    study?: StudyUpdateOneRequiredWithoutImagesNestedInput
  }

  export type ImageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studyId?: StringFieldUpdateOperationsInput | string
    seriesInstanceUID?: StringFieldUpdateOperationsInput | string
    sopInstanceUID?: StringFieldUpdateOperationsInput | string
    instanceNumber?: IntFieldUpdateOperationsInput | number
    seriesNumber?: IntFieldUpdateOperationsInput | number
    seriesDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageType?: NullableStringFieldUpdateOperationsInput | string | null
    photometricInterpretation?: NullableStringFieldUpdateOperationsInput | string | null
    rows?: NullableIntFieldUpdateOperationsInput | number | null
    columns?: NullableIntFieldUpdateOperationsInput | number | null
    bitsAllocated?: NullableIntFieldUpdateOperationsInput | number | null
    bitsStored?: NullableIntFieldUpdateOperationsInput | number | null
    pixelSpacing?: NullableStringFieldUpdateOperationsInput | string | null
    sliceThickness?: NullableFloatFieldUpdateOperationsInput | number | null
    sliceLocation?: NullableFloatFieldUpdateOperationsInput | number | null
    imagePosition?: NullableStringFieldUpdateOperationsInput | string | null
    imageOrientation?: NullableStringFieldUpdateOperationsInput | string | null
    acquisitionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acquisitionTime?: NullableStringFieldUpdateOperationsInput | string | null
    contentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentTime?: NullableStringFieldUpdateOperationsInput | string | null
    windowCenter?: NullableStringFieldUpdateOperationsInput | string | null
    windowWidth?: NullableStringFieldUpdateOperationsInput | string | null
    storageUrl?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    transferSyntaxUID?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageCreateManyInput = {
    id?: string
    studyId: string
    seriesInstanceUID: string
    sopInstanceUID: string
    instanceNumber: number
    seriesNumber: number
    seriesDescription?: string | null
    imageType?: string | null
    photometricInterpretation?: string | null
    rows?: number | null
    columns?: number | null
    bitsAllocated?: number | null
    bitsStored?: number | null
    pixelSpacing?: string | null
    sliceThickness?: number | null
    sliceLocation?: number | null
    imagePosition?: string | null
    imageOrientation?: string | null
    acquisitionDate?: Date | string | null
    acquisitionTime?: string | null
    contentDate?: Date | string | null
    contentTime?: string | null
    windowCenter?: string | null
    windowWidth?: string | null
    storageUrl: string
    thumbnailUrl?: string | null
    fileSize: bigint | number
    transferSyntaxUID?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    seriesInstanceUID?: StringFieldUpdateOperationsInput | string
    sopInstanceUID?: StringFieldUpdateOperationsInput | string
    instanceNumber?: IntFieldUpdateOperationsInput | number
    seriesNumber?: IntFieldUpdateOperationsInput | number
    seriesDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageType?: NullableStringFieldUpdateOperationsInput | string | null
    photometricInterpretation?: NullableStringFieldUpdateOperationsInput | string | null
    rows?: NullableIntFieldUpdateOperationsInput | number | null
    columns?: NullableIntFieldUpdateOperationsInput | number | null
    bitsAllocated?: NullableIntFieldUpdateOperationsInput | number | null
    bitsStored?: NullableIntFieldUpdateOperationsInput | number | null
    pixelSpacing?: NullableStringFieldUpdateOperationsInput | string | null
    sliceThickness?: NullableFloatFieldUpdateOperationsInput | number | null
    sliceLocation?: NullableFloatFieldUpdateOperationsInput | number | null
    imagePosition?: NullableStringFieldUpdateOperationsInput | string | null
    imageOrientation?: NullableStringFieldUpdateOperationsInput | string | null
    acquisitionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acquisitionTime?: NullableStringFieldUpdateOperationsInput | string | null
    contentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentTime?: NullableStringFieldUpdateOperationsInput | string | null
    windowCenter?: NullableStringFieldUpdateOperationsInput | string | null
    windowWidth?: NullableStringFieldUpdateOperationsInput | string | null
    storageUrl?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    transferSyntaxUID?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studyId?: StringFieldUpdateOperationsInput | string
    seriesInstanceUID?: StringFieldUpdateOperationsInput | string
    sopInstanceUID?: StringFieldUpdateOperationsInput | string
    instanceNumber?: IntFieldUpdateOperationsInput | number
    seriesNumber?: IntFieldUpdateOperationsInput | number
    seriesDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageType?: NullableStringFieldUpdateOperationsInput | string | null
    photometricInterpretation?: NullableStringFieldUpdateOperationsInput | string | null
    rows?: NullableIntFieldUpdateOperationsInput | number | null
    columns?: NullableIntFieldUpdateOperationsInput | number | null
    bitsAllocated?: NullableIntFieldUpdateOperationsInput | number | null
    bitsStored?: NullableIntFieldUpdateOperationsInput | number | null
    pixelSpacing?: NullableStringFieldUpdateOperationsInput | string | null
    sliceThickness?: NullableFloatFieldUpdateOperationsInput | number | null
    sliceLocation?: NullableFloatFieldUpdateOperationsInput | number | null
    imagePosition?: NullableStringFieldUpdateOperationsInput | string | null
    imageOrientation?: NullableStringFieldUpdateOperationsInput | string | null
    acquisitionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acquisitionTime?: NullableStringFieldUpdateOperationsInput | string | null
    contentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentTime?: NullableStringFieldUpdateOperationsInput | string | null
    windowCenter?: NullableStringFieldUpdateOperationsInput | string | null
    windowWidth?: NullableStringFieldUpdateOperationsInput | string | null
    storageUrl?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    transferSyntaxUID?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RadiologyReportCreateInput = {
    id?: string
    reportNumber: string
    radiologistId: string
    radiologistName: string
    status?: $Enums.ReportStatus
    clinicalHistory?: string | null
    technique?: string | null
    comparison?: string | null
    findings: string
    impression: string
    recommendations?: string | null
    preliminaryDate?: Date | string | null
    finalizedDate?: Date | string | null
    amendedDate?: Date | string | null
    amendmentReason?: string | null
    signedBy?: string | null
    signedAt?: Date | string | null
    transcribedBy?: string | null
    transcribedAt?: Date | string | null
    template?: string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    study: StudyCreateNestedOneWithoutReportsInput
  }

  export type RadiologyReportUncheckedCreateInput = {
    id?: string
    studyId: string
    reportNumber: string
    radiologistId: string
    radiologistName: string
    status?: $Enums.ReportStatus
    clinicalHistory?: string | null
    technique?: string | null
    comparison?: string | null
    findings: string
    impression: string
    recommendations?: string | null
    preliminaryDate?: Date | string | null
    finalizedDate?: Date | string | null
    amendedDate?: Date | string | null
    amendmentReason?: string | null
    signedBy?: string | null
    signedAt?: Date | string | null
    transcribedBy?: string | null
    transcribedAt?: Date | string | null
    template?: string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RadiologyReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportNumber?: StringFieldUpdateOperationsInput | string
    radiologistId?: StringFieldUpdateOperationsInput | string
    radiologistName?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    clinicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    technique?: NullableStringFieldUpdateOperationsInput | string | null
    comparison?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: StringFieldUpdateOperationsInput | string
    impression?: StringFieldUpdateOperationsInput | string
    recommendations?: NullableStringFieldUpdateOperationsInput | string | null
    preliminaryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalizedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendmentReason?: NullableStringFieldUpdateOperationsInput | string | null
    signedBy?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transcribedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transcribedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    template?: NullableStringFieldUpdateOperationsInput | string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    study?: StudyUpdateOneRequiredWithoutReportsNestedInput
  }

  export type RadiologyReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studyId?: StringFieldUpdateOperationsInput | string
    reportNumber?: StringFieldUpdateOperationsInput | string
    radiologistId?: StringFieldUpdateOperationsInput | string
    radiologistName?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    clinicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    technique?: NullableStringFieldUpdateOperationsInput | string | null
    comparison?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: StringFieldUpdateOperationsInput | string
    impression?: StringFieldUpdateOperationsInput | string
    recommendations?: NullableStringFieldUpdateOperationsInput | string | null
    preliminaryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalizedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendmentReason?: NullableStringFieldUpdateOperationsInput | string | null
    signedBy?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transcribedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transcribedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    template?: NullableStringFieldUpdateOperationsInput | string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RadiologyReportCreateManyInput = {
    id?: string
    studyId: string
    reportNumber: string
    radiologistId: string
    radiologistName: string
    status?: $Enums.ReportStatus
    clinicalHistory?: string | null
    technique?: string | null
    comparison?: string | null
    findings: string
    impression: string
    recommendations?: string | null
    preliminaryDate?: Date | string | null
    finalizedDate?: Date | string | null
    amendedDate?: Date | string | null
    amendmentReason?: string | null
    signedBy?: string | null
    signedAt?: Date | string | null
    transcribedBy?: string | null
    transcribedAt?: Date | string | null
    template?: string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RadiologyReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportNumber?: StringFieldUpdateOperationsInput | string
    radiologistId?: StringFieldUpdateOperationsInput | string
    radiologistName?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    clinicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    technique?: NullableStringFieldUpdateOperationsInput | string | null
    comparison?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: StringFieldUpdateOperationsInput | string
    impression?: StringFieldUpdateOperationsInput | string
    recommendations?: NullableStringFieldUpdateOperationsInput | string | null
    preliminaryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalizedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendmentReason?: NullableStringFieldUpdateOperationsInput | string | null
    signedBy?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transcribedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transcribedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    template?: NullableStringFieldUpdateOperationsInput | string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RadiologyReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studyId?: StringFieldUpdateOperationsInput | string
    reportNumber?: StringFieldUpdateOperationsInput | string
    radiologistId?: StringFieldUpdateOperationsInput | string
    radiologistName?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    clinicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    technique?: NullableStringFieldUpdateOperationsInput | string | null
    comparison?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: StringFieldUpdateOperationsInput | string
    impression?: StringFieldUpdateOperationsInput | string
    recommendations?: NullableStringFieldUpdateOperationsInput | string | null
    preliminaryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalizedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendmentReason?: NullableStringFieldUpdateOperationsInput | string | null
    signedBy?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transcribedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transcribedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    template?: NullableStringFieldUpdateOperationsInput | string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CriticalFindingCreateInput = {
    id?: string
    reportId?: string | null
    finding: string
    severity: $Enums.Severity
    category: string
    bodyPart?: string | null
    reportedBy: string
    reportedAt?: Date | string
    notifiedTo?: CriticalFindingCreatenotifiedToInput | string[]
    notificationSent?: boolean
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    followUpRequired?: boolean
    followUpAction?: string | null
    followUpStatus?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    study: StudyCreateNestedOneWithoutCriticalFindingsInput
  }

  export type CriticalFindingUncheckedCreateInput = {
    id?: string
    studyId: string
    reportId?: string | null
    finding: string
    severity: $Enums.Severity
    category: string
    bodyPart?: string | null
    reportedBy: string
    reportedAt?: Date | string
    notifiedTo?: CriticalFindingCreatenotifiedToInput | string[]
    notificationSent?: boolean
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    followUpRequired?: boolean
    followUpAction?: string | null
    followUpStatus?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CriticalFindingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportId?: NullableStringFieldUpdateOperationsInput | string | null
    finding?: StringFieldUpdateOperationsInput | string
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    category?: StringFieldUpdateOperationsInput | string
    bodyPart?: NullableStringFieldUpdateOperationsInput | string | null
    reportedBy?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedTo?: CriticalFindingUpdatenotifiedToInput | string[]
    notificationSent?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    followUpAction?: NullableStringFieldUpdateOperationsInput | string | null
    followUpStatus?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    study?: StudyUpdateOneRequiredWithoutCriticalFindingsNestedInput
  }

  export type CriticalFindingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studyId?: StringFieldUpdateOperationsInput | string
    reportId?: NullableStringFieldUpdateOperationsInput | string | null
    finding?: StringFieldUpdateOperationsInput | string
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    category?: StringFieldUpdateOperationsInput | string
    bodyPart?: NullableStringFieldUpdateOperationsInput | string | null
    reportedBy?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedTo?: CriticalFindingUpdatenotifiedToInput | string[]
    notificationSent?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    followUpAction?: NullableStringFieldUpdateOperationsInput | string | null
    followUpStatus?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CriticalFindingCreateManyInput = {
    id?: string
    studyId: string
    reportId?: string | null
    finding: string
    severity: $Enums.Severity
    category: string
    bodyPart?: string | null
    reportedBy: string
    reportedAt?: Date | string
    notifiedTo?: CriticalFindingCreatenotifiedToInput | string[]
    notificationSent?: boolean
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    followUpRequired?: boolean
    followUpAction?: string | null
    followUpStatus?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CriticalFindingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportId?: NullableStringFieldUpdateOperationsInput | string | null
    finding?: StringFieldUpdateOperationsInput | string
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    category?: StringFieldUpdateOperationsInput | string
    bodyPart?: NullableStringFieldUpdateOperationsInput | string | null
    reportedBy?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedTo?: CriticalFindingUpdatenotifiedToInput | string[]
    notificationSent?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    followUpAction?: NullableStringFieldUpdateOperationsInput | string | null
    followUpStatus?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CriticalFindingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studyId?: StringFieldUpdateOperationsInput | string
    reportId?: NullableStringFieldUpdateOperationsInput | string | null
    finding?: StringFieldUpdateOperationsInput | string
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    category?: StringFieldUpdateOperationsInput | string
    bodyPart?: NullableStringFieldUpdateOperationsInput | string | null
    reportedBy?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedTo?: CriticalFindingUpdatenotifiedToInput | string[]
    notificationSent?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    followUpAction?: NullableStringFieldUpdateOperationsInput | string | null
    followUpStatus?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type EnumPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityFilter<$PrismaModel> | $Enums.Priority
  }

  export type EnumModalityFilter<$PrismaModel = never> = {
    equals?: $Enums.Modality | EnumModalityFieldRefInput<$PrismaModel>
    in?: $Enums.Modality[] | ListEnumModalityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Modality[] | ListEnumModalityFieldRefInput<$PrismaModel>
    not?: NestedEnumModalityFilter<$PrismaModel> | $Enums.Modality
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

  export type EnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
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

  export type StudyListRelationFilter = {
    every?: StudyWhereInput
    some?: StudyWhereInput
    none?: StudyWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StudyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImagingOrderCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    facilityId?: SortOrder
    orderNumber?: SortOrder
    priority?: SortOrder
    modality?: SortOrder
    bodyPart?: SortOrder
    clinicalIndication?: SortOrder
    instructions?: SortOrder
    urgency?: SortOrder
    transportRequired?: SortOrder
    contrastAllergy?: SortOrder
    contrastNotes?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    requestedBy?: SortOrder
    requestedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImagingOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    facilityId?: SortOrder
    orderNumber?: SortOrder
    priority?: SortOrder
    modality?: SortOrder
    bodyPart?: SortOrder
    clinicalIndication?: SortOrder
    instructions?: SortOrder
    urgency?: SortOrder
    transportRequired?: SortOrder
    contrastAllergy?: SortOrder
    contrastNotes?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    requestedBy?: SortOrder
    requestedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImagingOrderMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    facilityId?: SortOrder
    orderNumber?: SortOrder
    priority?: SortOrder
    modality?: SortOrder
    bodyPart?: SortOrder
    clinicalIndication?: SortOrder
    instructions?: SortOrder
    urgency?: SortOrder
    transportRequired?: SortOrder
    contrastAllergy?: SortOrder
    contrastNotes?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    requestedBy?: SortOrder
    requestedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type EnumPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityWithAggregatesFilter<$PrismaModel> | $Enums.Priority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityFilter<$PrismaModel>
    _max?: NestedEnumPriorityFilter<$PrismaModel>
  }

  export type EnumModalityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Modality | EnumModalityFieldRefInput<$PrismaModel>
    in?: $Enums.Modality[] | ListEnumModalityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Modality[] | ListEnumModalityFieldRefInput<$PrismaModel>
    not?: NestedEnumModalityWithAggregatesFilter<$PrismaModel> | $Enums.Modality
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumModalityFilter<$PrismaModel>
    _max?: NestedEnumModalityFilter<$PrismaModel>
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

  export type EnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
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

  export type EnumStudyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.StudyStatus | EnumStudyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.StudyStatus[] | ListEnumStudyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.StudyStatus[] | ListEnumStudyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStudyStatusFilter<$PrismaModel> | $Enums.StudyStatus
  }

  export type ImagingOrderRelationFilter = {
    is?: ImagingOrderWhereInput
    isNot?: ImagingOrderWhereInput
  }

  export type ImageListRelationFilter = {
    every?: ImageWhereInput
    some?: ImageWhereInput
    none?: ImageWhereInput
  }

  export type RadiologyReportListRelationFilter = {
    every?: RadiologyReportWhereInput
    some?: RadiologyReportWhereInput
    none?: RadiologyReportWhereInput
  }

  export type CriticalFindingListRelationFilter = {
    every?: CriticalFindingWhereInput
    some?: CriticalFindingWhereInput
    none?: CriticalFindingWhereInput
  }

  export type ImageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RadiologyReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CriticalFindingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudyCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    accessionNumber?: SortOrder
    studyInstanceUID?: SortOrder
    studyDate?: SortOrder
    studyTime?: SortOrder
    studyDescription?: SortOrder
    modality?: SortOrder
    bodyPart?: SortOrder
    numberOfSeries?: SortOrder
    numberOfInstances?: SortOrder
    patientId?: SortOrder
    patientName?: SortOrder
    patientDOB?: SortOrder
    patientSex?: SortOrder
    performingPhysician?: SortOrder
    operatorName?: SortOrder
    institutionName?: SortOrder
    stationName?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudyAvgOrderByAggregateInput = {
    numberOfSeries?: SortOrder
    numberOfInstances?: SortOrder
  }

  export type StudyMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    accessionNumber?: SortOrder
    studyInstanceUID?: SortOrder
    studyDate?: SortOrder
    studyTime?: SortOrder
    studyDescription?: SortOrder
    modality?: SortOrder
    bodyPart?: SortOrder
    numberOfSeries?: SortOrder
    numberOfInstances?: SortOrder
    patientId?: SortOrder
    patientName?: SortOrder
    patientDOB?: SortOrder
    patientSex?: SortOrder
    performingPhysician?: SortOrder
    operatorName?: SortOrder
    institutionName?: SortOrder
    stationName?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudyMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    accessionNumber?: SortOrder
    studyInstanceUID?: SortOrder
    studyDate?: SortOrder
    studyTime?: SortOrder
    studyDescription?: SortOrder
    modality?: SortOrder
    bodyPart?: SortOrder
    numberOfSeries?: SortOrder
    numberOfInstances?: SortOrder
    patientId?: SortOrder
    patientName?: SortOrder
    patientDOB?: SortOrder
    patientSex?: SortOrder
    performingPhysician?: SortOrder
    operatorName?: SortOrder
    institutionName?: SortOrder
    stationName?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudySumOrderByAggregateInput = {
    numberOfSeries?: SortOrder
    numberOfInstances?: SortOrder
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

  export type EnumStudyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StudyStatus | EnumStudyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.StudyStatus[] | ListEnumStudyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.StudyStatus[] | ListEnumStudyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStudyStatusWithAggregatesFilter<$PrismaModel> | $Enums.StudyStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStudyStatusFilter<$PrismaModel>
    _max?: NestedEnumStudyStatusFilter<$PrismaModel>
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

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
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

  export type StudyRelationFilter = {
    is?: StudyWhereInput
    isNot?: StudyWhereInput
  }

  export type ImageCountOrderByAggregateInput = {
    id?: SortOrder
    studyId?: SortOrder
    seriesInstanceUID?: SortOrder
    sopInstanceUID?: SortOrder
    instanceNumber?: SortOrder
    seriesNumber?: SortOrder
    seriesDescription?: SortOrder
    imageType?: SortOrder
    photometricInterpretation?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
    bitsAllocated?: SortOrder
    bitsStored?: SortOrder
    pixelSpacing?: SortOrder
    sliceThickness?: SortOrder
    sliceLocation?: SortOrder
    imagePosition?: SortOrder
    imageOrientation?: SortOrder
    acquisitionDate?: SortOrder
    acquisitionTime?: SortOrder
    contentDate?: SortOrder
    contentTime?: SortOrder
    windowCenter?: SortOrder
    windowWidth?: SortOrder
    storageUrl?: SortOrder
    thumbnailUrl?: SortOrder
    fileSize?: SortOrder
    transferSyntaxUID?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageAvgOrderByAggregateInput = {
    instanceNumber?: SortOrder
    seriesNumber?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
    bitsAllocated?: SortOrder
    bitsStored?: SortOrder
    sliceThickness?: SortOrder
    sliceLocation?: SortOrder
    fileSize?: SortOrder
  }

  export type ImageMaxOrderByAggregateInput = {
    id?: SortOrder
    studyId?: SortOrder
    seriesInstanceUID?: SortOrder
    sopInstanceUID?: SortOrder
    instanceNumber?: SortOrder
    seriesNumber?: SortOrder
    seriesDescription?: SortOrder
    imageType?: SortOrder
    photometricInterpretation?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
    bitsAllocated?: SortOrder
    bitsStored?: SortOrder
    pixelSpacing?: SortOrder
    sliceThickness?: SortOrder
    sliceLocation?: SortOrder
    imagePosition?: SortOrder
    imageOrientation?: SortOrder
    acquisitionDate?: SortOrder
    acquisitionTime?: SortOrder
    contentDate?: SortOrder
    contentTime?: SortOrder
    windowCenter?: SortOrder
    windowWidth?: SortOrder
    storageUrl?: SortOrder
    thumbnailUrl?: SortOrder
    fileSize?: SortOrder
    transferSyntaxUID?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageMinOrderByAggregateInput = {
    id?: SortOrder
    studyId?: SortOrder
    seriesInstanceUID?: SortOrder
    sopInstanceUID?: SortOrder
    instanceNumber?: SortOrder
    seriesNumber?: SortOrder
    seriesDescription?: SortOrder
    imageType?: SortOrder
    photometricInterpretation?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
    bitsAllocated?: SortOrder
    bitsStored?: SortOrder
    pixelSpacing?: SortOrder
    sliceThickness?: SortOrder
    sliceLocation?: SortOrder
    imagePosition?: SortOrder
    imageOrientation?: SortOrder
    acquisitionDate?: SortOrder
    acquisitionTime?: SortOrder
    contentDate?: SortOrder
    contentTime?: SortOrder
    windowCenter?: SortOrder
    windowWidth?: SortOrder
    storageUrl?: SortOrder
    thumbnailUrl?: SortOrder
    fileSize?: SortOrder
    transferSyntaxUID?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageSumOrderByAggregateInput = {
    instanceNumber?: SortOrder
    seriesNumber?: SortOrder
    rows?: SortOrder
    columns?: SortOrder
    bitsAllocated?: SortOrder
    bitsStored?: SortOrder
    sliceThickness?: SortOrder
    sliceLocation?: SortOrder
    fileSize?: SortOrder
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

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
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

  export type EnumReportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusFilter<$PrismaModel> | $Enums.ReportStatus
  }

  export type RadiologyReportCountOrderByAggregateInput = {
    id?: SortOrder
    studyId?: SortOrder
    reportNumber?: SortOrder
    radiologistId?: SortOrder
    radiologistName?: SortOrder
    status?: SortOrder
    clinicalHistory?: SortOrder
    technique?: SortOrder
    comparison?: SortOrder
    findings?: SortOrder
    impression?: SortOrder
    recommendations?: SortOrder
    preliminaryDate?: SortOrder
    finalizedDate?: SortOrder
    amendedDate?: SortOrder
    amendmentReason?: SortOrder
    signedBy?: SortOrder
    signedAt?: SortOrder
    transcribedBy?: SortOrder
    transcribedAt?: SortOrder
    template?: SortOrder
    macros?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RadiologyReportMaxOrderByAggregateInput = {
    id?: SortOrder
    studyId?: SortOrder
    reportNumber?: SortOrder
    radiologistId?: SortOrder
    radiologistName?: SortOrder
    status?: SortOrder
    clinicalHistory?: SortOrder
    technique?: SortOrder
    comparison?: SortOrder
    findings?: SortOrder
    impression?: SortOrder
    recommendations?: SortOrder
    preliminaryDate?: SortOrder
    finalizedDate?: SortOrder
    amendedDate?: SortOrder
    amendmentReason?: SortOrder
    signedBy?: SortOrder
    signedAt?: SortOrder
    transcribedBy?: SortOrder
    transcribedAt?: SortOrder
    template?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RadiologyReportMinOrderByAggregateInput = {
    id?: SortOrder
    studyId?: SortOrder
    reportNumber?: SortOrder
    radiologistId?: SortOrder
    radiologistName?: SortOrder
    status?: SortOrder
    clinicalHistory?: SortOrder
    technique?: SortOrder
    comparison?: SortOrder
    findings?: SortOrder
    impression?: SortOrder
    recommendations?: SortOrder
    preliminaryDate?: SortOrder
    finalizedDate?: SortOrder
    amendedDate?: SortOrder
    amendmentReason?: SortOrder
    signedBy?: SortOrder
    signedAt?: SortOrder
    transcribedBy?: SortOrder
    transcribedAt?: SortOrder
    template?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumReportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReportStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReportStatusFilter<$PrismaModel>
    _max?: NestedEnumReportStatusFilter<$PrismaModel>
  }

  export type EnumSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumSeverityFilter<$PrismaModel> | $Enums.Severity
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type CriticalFindingCountOrderByAggregateInput = {
    id?: SortOrder
    studyId?: SortOrder
    reportId?: SortOrder
    finding?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    bodyPart?: SortOrder
    reportedBy?: SortOrder
    reportedAt?: SortOrder
    notifiedTo?: SortOrder
    notificationSent?: SortOrder
    acknowledgedBy?: SortOrder
    acknowledgedAt?: SortOrder
    followUpRequired?: SortOrder
    followUpAction?: SortOrder
    followUpStatus?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CriticalFindingMaxOrderByAggregateInput = {
    id?: SortOrder
    studyId?: SortOrder
    reportId?: SortOrder
    finding?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    bodyPart?: SortOrder
    reportedBy?: SortOrder
    reportedAt?: SortOrder
    notificationSent?: SortOrder
    acknowledgedBy?: SortOrder
    acknowledgedAt?: SortOrder
    followUpRequired?: SortOrder
    followUpAction?: SortOrder
    followUpStatus?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CriticalFindingMinOrderByAggregateInput = {
    id?: SortOrder
    studyId?: SortOrder
    reportId?: SortOrder
    finding?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    bodyPart?: SortOrder
    reportedBy?: SortOrder
    reportedAt?: SortOrder
    notificationSent?: SortOrder
    acknowledgedBy?: SortOrder
    acknowledgedAt?: SortOrder
    followUpRequired?: SortOrder
    followUpAction?: SortOrder
    followUpStatus?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumSeverityWithAggregatesFilter<$PrismaModel> | $Enums.Severity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSeverityFilter<$PrismaModel>
    _max?: NestedEnumSeverityFilter<$PrismaModel>
  }

  export type StudyCreateNestedManyWithoutOrderInput = {
    create?: XOR<StudyCreateWithoutOrderInput, StudyUncheckedCreateWithoutOrderInput> | StudyCreateWithoutOrderInput[] | StudyUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: StudyCreateOrConnectWithoutOrderInput | StudyCreateOrConnectWithoutOrderInput[]
    createMany?: StudyCreateManyOrderInputEnvelope
    connect?: StudyWhereUniqueInput | StudyWhereUniqueInput[]
  }

  export type StudyUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<StudyCreateWithoutOrderInput, StudyUncheckedCreateWithoutOrderInput> | StudyCreateWithoutOrderInput[] | StudyUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: StudyCreateOrConnectWithoutOrderInput | StudyCreateOrConnectWithoutOrderInput[]
    createMany?: StudyCreateManyOrderInputEnvelope
    connect?: StudyWhereUniqueInput | StudyWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumPriorityFieldUpdateOperationsInput = {
    set?: $Enums.Priority
  }

  export type EnumModalityFieldUpdateOperationsInput = {
    set?: $Enums.Modality
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.OrderStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StudyUpdateManyWithoutOrderNestedInput = {
    create?: XOR<StudyCreateWithoutOrderInput, StudyUncheckedCreateWithoutOrderInput> | StudyCreateWithoutOrderInput[] | StudyUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: StudyCreateOrConnectWithoutOrderInput | StudyCreateOrConnectWithoutOrderInput[]
    upsert?: StudyUpsertWithWhereUniqueWithoutOrderInput | StudyUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: StudyCreateManyOrderInputEnvelope
    set?: StudyWhereUniqueInput | StudyWhereUniqueInput[]
    disconnect?: StudyWhereUniqueInput | StudyWhereUniqueInput[]
    delete?: StudyWhereUniqueInput | StudyWhereUniqueInput[]
    connect?: StudyWhereUniqueInput | StudyWhereUniqueInput[]
    update?: StudyUpdateWithWhereUniqueWithoutOrderInput | StudyUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: StudyUpdateManyWithWhereWithoutOrderInput | StudyUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: StudyScalarWhereInput | StudyScalarWhereInput[]
  }

  export type StudyUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<StudyCreateWithoutOrderInput, StudyUncheckedCreateWithoutOrderInput> | StudyCreateWithoutOrderInput[] | StudyUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: StudyCreateOrConnectWithoutOrderInput | StudyCreateOrConnectWithoutOrderInput[]
    upsert?: StudyUpsertWithWhereUniqueWithoutOrderInput | StudyUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: StudyCreateManyOrderInputEnvelope
    set?: StudyWhereUniqueInput | StudyWhereUniqueInput[]
    disconnect?: StudyWhereUniqueInput | StudyWhereUniqueInput[]
    delete?: StudyWhereUniqueInput | StudyWhereUniqueInput[]
    connect?: StudyWhereUniqueInput | StudyWhereUniqueInput[]
    update?: StudyUpdateWithWhereUniqueWithoutOrderInput | StudyUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: StudyUpdateManyWithWhereWithoutOrderInput | StudyUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: StudyScalarWhereInput | StudyScalarWhereInput[]
  }

  export type ImagingOrderCreateNestedOneWithoutStudiesInput = {
    create?: XOR<ImagingOrderCreateWithoutStudiesInput, ImagingOrderUncheckedCreateWithoutStudiesInput>
    connectOrCreate?: ImagingOrderCreateOrConnectWithoutStudiesInput
    connect?: ImagingOrderWhereUniqueInput
  }

  export type ImageCreateNestedManyWithoutStudyInput = {
    create?: XOR<ImageCreateWithoutStudyInput, ImageUncheckedCreateWithoutStudyInput> | ImageCreateWithoutStudyInput[] | ImageUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: ImageCreateOrConnectWithoutStudyInput | ImageCreateOrConnectWithoutStudyInput[]
    createMany?: ImageCreateManyStudyInputEnvelope
    connect?: ImageWhereUniqueInput | ImageWhereUniqueInput[]
  }

  export type RadiologyReportCreateNestedManyWithoutStudyInput = {
    create?: XOR<RadiologyReportCreateWithoutStudyInput, RadiologyReportUncheckedCreateWithoutStudyInput> | RadiologyReportCreateWithoutStudyInput[] | RadiologyReportUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: RadiologyReportCreateOrConnectWithoutStudyInput | RadiologyReportCreateOrConnectWithoutStudyInput[]
    createMany?: RadiologyReportCreateManyStudyInputEnvelope
    connect?: RadiologyReportWhereUniqueInput | RadiologyReportWhereUniqueInput[]
  }

  export type CriticalFindingCreateNestedManyWithoutStudyInput = {
    create?: XOR<CriticalFindingCreateWithoutStudyInput, CriticalFindingUncheckedCreateWithoutStudyInput> | CriticalFindingCreateWithoutStudyInput[] | CriticalFindingUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: CriticalFindingCreateOrConnectWithoutStudyInput | CriticalFindingCreateOrConnectWithoutStudyInput[]
    createMany?: CriticalFindingCreateManyStudyInputEnvelope
    connect?: CriticalFindingWhereUniqueInput | CriticalFindingWhereUniqueInput[]
  }

  export type ImageUncheckedCreateNestedManyWithoutStudyInput = {
    create?: XOR<ImageCreateWithoutStudyInput, ImageUncheckedCreateWithoutStudyInput> | ImageCreateWithoutStudyInput[] | ImageUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: ImageCreateOrConnectWithoutStudyInput | ImageCreateOrConnectWithoutStudyInput[]
    createMany?: ImageCreateManyStudyInputEnvelope
    connect?: ImageWhereUniqueInput | ImageWhereUniqueInput[]
  }

  export type RadiologyReportUncheckedCreateNestedManyWithoutStudyInput = {
    create?: XOR<RadiologyReportCreateWithoutStudyInput, RadiologyReportUncheckedCreateWithoutStudyInput> | RadiologyReportCreateWithoutStudyInput[] | RadiologyReportUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: RadiologyReportCreateOrConnectWithoutStudyInput | RadiologyReportCreateOrConnectWithoutStudyInput[]
    createMany?: RadiologyReportCreateManyStudyInputEnvelope
    connect?: RadiologyReportWhereUniqueInput | RadiologyReportWhereUniqueInput[]
  }

  export type CriticalFindingUncheckedCreateNestedManyWithoutStudyInput = {
    create?: XOR<CriticalFindingCreateWithoutStudyInput, CriticalFindingUncheckedCreateWithoutStudyInput> | CriticalFindingCreateWithoutStudyInput[] | CriticalFindingUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: CriticalFindingCreateOrConnectWithoutStudyInput | CriticalFindingCreateOrConnectWithoutStudyInput[]
    createMany?: CriticalFindingCreateManyStudyInputEnvelope
    connect?: CriticalFindingWhereUniqueInput | CriticalFindingWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumStudyStatusFieldUpdateOperationsInput = {
    set?: $Enums.StudyStatus
  }

  export type ImagingOrderUpdateOneRequiredWithoutStudiesNestedInput = {
    create?: XOR<ImagingOrderCreateWithoutStudiesInput, ImagingOrderUncheckedCreateWithoutStudiesInput>
    connectOrCreate?: ImagingOrderCreateOrConnectWithoutStudiesInput
    upsert?: ImagingOrderUpsertWithoutStudiesInput
    connect?: ImagingOrderWhereUniqueInput
    update?: XOR<XOR<ImagingOrderUpdateToOneWithWhereWithoutStudiesInput, ImagingOrderUpdateWithoutStudiesInput>, ImagingOrderUncheckedUpdateWithoutStudiesInput>
  }

  export type ImageUpdateManyWithoutStudyNestedInput = {
    create?: XOR<ImageCreateWithoutStudyInput, ImageUncheckedCreateWithoutStudyInput> | ImageCreateWithoutStudyInput[] | ImageUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: ImageCreateOrConnectWithoutStudyInput | ImageCreateOrConnectWithoutStudyInput[]
    upsert?: ImageUpsertWithWhereUniqueWithoutStudyInput | ImageUpsertWithWhereUniqueWithoutStudyInput[]
    createMany?: ImageCreateManyStudyInputEnvelope
    set?: ImageWhereUniqueInput | ImageWhereUniqueInput[]
    disconnect?: ImageWhereUniqueInput | ImageWhereUniqueInput[]
    delete?: ImageWhereUniqueInput | ImageWhereUniqueInput[]
    connect?: ImageWhereUniqueInput | ImageWhereUniqueInput[]
    update?: ImageUpdateWithWhereUniqueWithoutStudyInput | ImageUpdateWithWhereUniqueWithoutStudyInput[]
    updateMany?: ImageUpdateManyWithWhereWithoutStudyInput | ImageUpdateManyWithWhereWithoutStudyInput[]
    deleteMany?: ImageScalarWhereInput | ImageScalarWhereInput[]
  }

  export type RadiologyReportUpdateManyWithoutStudyNestedInput = {
    create?: XOR<RadiologyReportCreateWithoutStudyInput, RadiologyReportUncheckedCreateWithoutStudyInput> | RadiologyReportCreateWithoutStudyInput[] | RadiologyReportUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: RadiologyReportCreateOrConnectWithoutStudyInput | RadiologyReportCreateOrConnectWithoutStudyInput[]
    upsert?: RadiologyReportUpsertWithWhereUniqueWithoutStudyInput | RadiologyReportUpsertWithWhereUniqueWithoutStudyInput[]
    createMany?: RadiologyReportCreateManyStudyInputEnvelope
    set?: RadiologyReportWhereUniqueInput | RadiologyReportWhereUniqueInput[]
    disconnect?: RadiologyReportWhereUniqueInput | RadiologyReportWhereUniqueInput[]
    delete?: RadiologyReportWhereUniqueInput | RadiologyReportWhereUniqueInput[]
    connect?: RadiologyReportWhereUniqueInput | RadiologyReportWhereUniqueInput[]
    update?: RadiologyReportUpdateWithWhereUniqueWithoutStudyInput | RadiologyReportUpdateWithWhereUniqueWithoutStudyInput[]
    updateMany?: RadiologyReportUpdateManyWithWhereWithoutStudyInput | RadiologyReportUpdateManyWithWhereWithoutStudyInput[]
    deleteMany?: RadiologyReportScalarWhereInput | RadiologyReportScalarWhereInput[]
  }

  export type CriticalFindingUpdateManyWithoutStudyNestedInput = {
    create?: XOR<CriticalFindingCreateWithoutStudyInput, CriticalFindingUncheckedCreateWithoutStudyInput> | CriticalFindingCreateWithoutStudyInput[] | CriticalFindingUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: CriticalFindingCreateOrConnectWithoutStudyInput | CriticalFindingCreateOrConnectWithoutStudyInput[]
    upsert?: CriticalFindingUpsertWithWhereUniqueWithoutStudyInput | CriticalFindingUpsertWithWhereUniqueWithoutStudyInput[]
    createMany?: CriticalFindingCreateManyStudyInputEnvelope
    set?: CriticalFindingWhereUniqueInput | CriticalFindingWhereUniqueInput[]
    disconnect?: CriticalFindingWhereUniqueInput | CriticalFindingWhereUniqueInput[]
    delete?: CriticalFindingWhereUniqueInput | CriticalFindingWhereUniqueInput[]
    connect?: CriticalFindingWhereUniqueInput | CriticalFindingWhereUniqueInput[]
    update?: CriticalFindingUpdateWithWhereUniqueWithoutStudyInput | CriticalFindingUpdateWithWhereUniqueWithoutStudyInput[]
    updateMany?: CriticalFindingUpdateManyWithWhereWithoutStudyInput | CriticalFindingUpdateManyWithWhereWithoutStudyInput[]
    deleteMany?: CriticalFindingScalarWhereInput | CriticalFindingScalarWhereInput[]
  }

  export type ImageUncheckedUpdateManyWithoutStudyNestedInput = {
    create?: XOR<ImageCreateWithoutStudyInput, ImageUncheckedCreateWithoutStudyInput> | ImageCreateWithoutStudyInput[] | ImageUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: ImageCreateOrConnectWithoutStudyInput | ImageCreateOrConnectWithoutStudyInput[]
    upsert?: ImageUpsertWithWhereUniqueWithoutStudyInput | ImageUpsertWithWhereUniqueWithoutStudyInput[]
    createMany?: ImageCreateManyStudyInputEnvelope
    set?: ImageWhereUniqueInput | ImageWhereUniqueInput[]
    disconnect?: ImageWhereUniqueInput | ImageWhereUniqueInput[]
    delete?: ImageWhereUniqueInput | ImageWhereUniqueInput[]
    connect?: ImageWhereUniqueInput | ImageWhereUniqueInput[]
    update?: ImageUpdateWithWhereUniqueWithoutStudyInput | ImageUpdateWithWhereUniqueWithoutStudyInput[]
    updateMany?: ImageUpdateManyWithWhereWithoutStudyInput | ImageUpdateManyWithWhereWithoutStudyInput[]
    deleteMany?: ImageScalarWhereInput | ImageScalarWhereInput[]
  }

  export type RadiologyReportUncheckedUpdateManyWithoutStudyNestedInput = {
    create?: XOR<RadiologyReportCreateWithoutStudyInput, RadiologyReportUncheckedCreateWithoutStudyInput> | RadiologyReportCreateWithoutStudyInput[] | RadiologyReportUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: RadiologyReportCreateOrConnectWithoutStudyInput | RadiologyReportCreateOrConnectWithoutStudyInput[]
    upsert?: RadiologyReportUpsertWithWhereUniqueWithoutStudyInput | RadiologyReportUpsertWithWhereUniqueWithoutStudyInput[]
    createMany?: RadiologyReportCreateManyStudyInputEnvelope
    set?: RadiologyReportWhereUniqueInput | RadiologyReportWhereUniqueInput[]
    disconnect?: RadiologyReportWhereUniqueInput | RadiologyReportWhereUniqueInput[]
    delete?: RadiologyReportWhereUniqueInput | RadiologyReportWhereUniqueInput[]
    connect?: RadiologyReportWhereUniqueInput | RadiologyReportWhereUniqueInput[]
    update?: RadiologyReportUpdateWithWhereUniqueWithoutStudyInput | RadiologyReportUpdateWithWhereUniqueWithoutStudyInput[]
    updateMany?: RadiologyReportUpdateManyWithWhereWithoutStudyInput | RadiologyReportUpdateManyWithWhereWithoutStudyInput[]
    deleteMany?: RadiologyReportScalarWhereInput | RadiologyReportScalarWhereInput[]
  }

  export type CriticalFindingUncheckedUpdateManyWithoutStudyNestedInput = {
    create?: XOR<CriticalFindingCreateWithoutStudyInput, CriticalFindingUncheckedCreateWithoutStudyInput> | CriticalFindingCreateWithoutStudyInput[] | CriticalFindingUncheckedCreateWithoutStudyInput[]
    connectOrCreate?: CriticalFindingCreateOrConnectWithoutStudyInput | CriticalFindingCreateOrConnectWithoutStudyInput[]
    upsert?: CriticalFindingUpsertWithWhereUniqueWithoutStudyInput | CriticalFindingUpsertWithWhereUniqueWithoutStudyInput[]
    createMany?: CriticalFindingCreateManyStudyInputEnvelope
    set?: CriticalFindingWhereUniqueInput | CriticalFindingWhereUniqueInput[]
    disconnect?: CriticalFindingWhereUniqueInput | CriticalFindingWhereUniqueInput[]
    delete?: CriticalFindingWhereUniqueInput | CriticalFindingWhereUniqueInput[]
    connect?: CriticalFindingWhereUniqueInput | CriticalFindingWhereUniqueInput[]
    update?: CriticalFindingUpdateWithWhereUniqueWithoutStudyInput | CriticalFindingUpdateWithWhereUniqueWithoutStudyInput[]
    updateMany?: CriticalFindingUpdateManyWithWhereWithoutStudyInput | CriticalFindingUpdateManyWithWhereWithoutStudyInput[]
    deleteMany?: CriticalFindingScalarWhereInput | CriticalFindingScalarWhereInput[]
  }

  export type StudyCreateNestedOneWithoutImagesInput = {
    create?: XOR<StudyCreateWithoutImagesInput, StudyUncheckedCreateWithoutImagesInput>
    connectOrCreate?: StudyCreateOrConnectWithoutImagesInput
    connect?: StudyWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StudyUpdateOneRequiredWithoutImagesNestedInput = {
    create?: XOR<StudyCreateWithoutImagesInput, StudyUncheckedCreateWithoutImagesInput>
    connectOrCreate?: StudyCreateOrConnectWithoutImagesInput
    upsert?: StudyUpsertWithoutImagesInput
    connect?: StudyWhereUniqueInput
    update?: XOR<XOR<StudyUpdateToOneWithWhereWithoutImagesInput, StudyUpdateWithoutImagesInput>, StudyUncheckedUpdateWithoutImagesInput>
  }

  export type StudyCreateNestedOneWithoutReportsInput = {
    create?: XOR<StudyCreateWithoutReportsInput, StudyUncheckedCreateWithoutReportsInput>
    connectOrCreate?: StudyCreateOrConnectWithoutReportsInput
    connect?: StudyWhereUniqueInput
  }

  export type EnumReportStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReportStatus
  }

  export type StudyUpdateOneRequiredWithoutReportsNestedInput = {
    create?: XOR<StudyCreateWithoutReportsInput, StudyUncheckedCreateWithoutReportsInput>
    connectOrCreate?: StudyCreateOrConnectWithoutReportsInput
    upsert?: StudyUpsertWithoutReportsInput
    connect?: StudyWhereUniqueInput
    update?: XOR<XOR<StudyUpdateToOneWithWhereWithoutReportsInput, StudyUpdateWithoutReportsInput>, StudyUncheckedUpdateWithoutReportsInput>
  }

  export type CriticalFindingCreatenotifiedToInput = {
    set: string[]
  }

  export type StudyCreateNestedOneWithoutCriticalFindingsInput = {
    create?: XOR<StudyCreateWithoutCriticalFindingsInput, StudyUncheckedCreateWithoutCriticalFindingsInput>
    connectOrCreate?: StudyCreateOrConnectWithoutCriticalFindingsInput
    connect?: StudyWhereUniqueInput
  }

  export type EnumSeverityFieldUpdateOperationsInput = {
    set?: $Enums.Severity
  }

  export type CriticalFindingUpdatenotifiedToInput = {
    set?: string[]
    push?: string | string[]
  }

  export type StudyUpdateOneRequiredWithoutCriticalFindingsNestedInput = {
    create?: XOR<StudyCreateWithoutCriticalFindingsInput, StudyUncheckedCreateWithoutCriticalFindingsInput>
    connectOrCreate?: StudyCreateOrConnectWithoutCriticalFindingsInput
    upsert?: StudyUpsertWithoutCriticalFindingsInput
    connect?: StudyWhereUniqueInput
    update?: XOR<XOR<StudyUpdateToOneWithWhereWithoutCriticalFindingsInput, StudyUpdateWithoutCriticalFindingsInput>, StudyUncheckedUpdateWithoutCriticalFindingsInput>
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

  export type NestedEnumPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityFilter<$PrismaModel> | $Enums.Priority
  }

  export type NestedEnumModalityFilter<$PrismaModel = never> = {
    equals?: $Enums.Modality | EnumModalityFieldRefInput<$PrismaModel>
    in?: $Enums.Modality[] | ListEnumModalityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Modality[] | ListEnumModalityFieldRefInput<$PrismaModel>
    not?: NestedEnumModalityFilter<$PrismaModel> | $Enums.Modality
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

  export type NestedEnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
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

  export type NestedEnumPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityWithAggregatesFilter<$PrismaModel> | $Enums.Priority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityFilter<$PrismaModel>
    _max?: NestedEnumPriorityFilter<$PrismaModel>
  }

  export type NestedEnumModalityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Modality | EnumModalityFieldRefInput<$PrismaModel>
    in?: $Enums.Modality[] | ListEnumModalityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Modality[] | ListEnumModalityFieldRefInput<$PrismaModel>
    not?: NestedEnumModalityWithAggregatesFilter<$PrismaModel> | $Enums.Modality
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumModalityFilter<$PrismaModel>
    _max?: NestedEnumModalityFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
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

  export type NestedEnumStudyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.StudyStatus | EnumStudyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.StudyStatus[] | ListEnumStudyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.StudyStatus[] | ListEnumStudyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStudyStatusFilter<$PrismaModel> | $Enums.StudyStatus
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

  export type NestedEnumStudyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StudyStatus | EnumStudyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.StudyStatus[] | ListEnumStudyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.StudyStatus[] | ListEnumStudyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStudyStatusWithAggregatesFilter<$PrismaModel> | $Enums.StudyStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStudyStatusFilter<$PrismaModel>
    _max?: NestedEnumStudyStatusFilter<$PrismaModel>
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

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
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

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
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

  export type NestedEnumReportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusFilter<$PrismaModel> | $Enums.ReportStatus
  }

  export type NestedEnumReportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReportStatus | EnumReportStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReportStatus[] | ListEnumReportStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReportStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReportStatusFilter<$PrismaModel>
    _max?: NestedEnumReportStatusFilter<$PrismaModel>
  }

  export type NestedEnumSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumSeverityFilter<$PrismaModel> | $Enums.Severity
  }

  export type NestedEnumSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Severity | EnumSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Severity[] | ListEnumSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumSeverityWithAggregatesFilter<$PrismaModel> | $Enums.Severity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSeverityFilter<$PrismaModel>
    _max?: NestedEnumSeverityFilter<$PrismaModel>
  }

  export type StudyCreateWithoutOrderInput = {
    id?: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ImageCreateNestedManyWithoutStudyInput
    reports?: RadiologyReportCreateNestedManyWithoutStudyInput
    criticalFindings?: CriticalFindingCreateNestedManyWithoutStudyInput
  }

  export type StudyUncheckedCreateWithoutOrderInput = {
    id?: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ImageUncheckedCreateNestedManyWithoutStudyInput
    reports?: RadiologyReportUncheckedCreateNestedManyWithoutStudyInput
    criticalFindings?: CriticalFindingUncheckedCreateNestedManyWithoutStudyInput
  }

  export type StudyCreateOrConnectWithoutOrderInput = {
    where: StudyWhereUniqueInput
    create: XOR<StudyCreateWithoutOrderInput, StudyUncheckedCreateWithoutOrderInput>
  }

  export type StudyCreateManyOrderInputEnvelope = {
    data: StudyCreateManyOrderInput | StudyCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type StudyUpsertWithWhereUniqueWithoutOrderInput = {
    where: StudyWhereUniqueInput
    update: XOR<StudyUpdateWithoutOrderInput, StudyUncheckedUpdateWithoutOrderInput>
    create: XOR<StudyCreateWithoutOrderInput, StudyUncheckedCreateWithoutOrderInput>
  }

  export type StudyUpdateWithWhereUniqueWithoutOrderInput = {
    where: StudyWhereUniqueInput
    data: XOR<StudyUpdateWithoutOrderInput, StudyUncheckedUpdateWithoutOrderInput>
  }

  export type StudyUpdateManyWithWhereWithoutOrderInput = {
    where: StudyScalarWhereInput
    data: XOR<StudyUpdateManyMutationInput, StudyUncheckedUpdateManyWithoutOrderInput>
  }

  export type StudyScalarWhereInput = {
    AND?: StudyScalarWhereInput | StudyScalarWhereInput[]
    OR?: StudyScalarWhereInput[]
    NOT?: StudyScalarWhereInput | StudyScalarWhereInput[]
    id?: StringFilter<"Study"> | string
    orderId?: StringFilter<"Study"> | string
    accessionNumber?: StringFilter<"Study"> | string
    studyInstanceUID?: StringFilter<"Study"> | string
    studyDate?: DateTimeFilter<"Study"> | Date | string
    studyTime?: StringNullableFilter<"Study"> | string | null
    studyDescription?: StringFilter<"Study"> | string
    modality?: EnumModalityFilter<"Study"> | $Enums.Modality
    bodyPart?: StringFilter<"Study"> | string
    numberOfSeries?: IntFilter<"Study"> | number
    numberOfInstances?: IntFilter<"Study"> | number
    patientId?: StringFilter<"Study"> | string
    patientName?: StringFilter<"Study"> | string
    patientDOB?: DateTimeNullableFilter<"Study"> | Date | string | null
    patientSex?: StringNullableFilter<"Study"> | string | null
    performingPhysician?: StringNullableFilter<"Study"> | string | null
    operatorName?: StringNullableFilter<"Study"> | string | null
    institutionName?: StringNullableFilter<"Study"> | string | null
    stationName?: StringNullableFilter<"Study"> | string | null
    status?: EnumStudyStatusFilter<"Study"> | $Enums.StudyStatus
    priority?: EnumPriorityFilter<"Study"> | $Enums.Priority
    createdAt?: DateTimeFilter<"Study"> | Date | string
    updatedAt?: DateTimeFilter<"Study"> | Date | string
  }

  export type ImagingOrderCreateWithoutStudiesInput = {
    id?: string
    patientId: string
    providerId: string
    facilityId: string
    orderNumber: string
    priority?: $Enums.Priority
    modality: $Enums.Modality
    bodyPart: string
    clinicalIndication: string
    instructions?: string | null
    urgency?: string | null
    transportRequired?: boolean
    contrastAllergy?: boolean
    contrastNotes?: string | null
    status?: $Enums.OrderStatus
    scheduledAt?: Date | string | null
    requestedBy: string
    requestedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImagingOrderUncheckedCreateWithoutStudiesInput = {
    id?: string
    patientId: string
    providerId: string
    facilityId: string
    orderNumber: string
    priority?: $Enums.Priority
    modality: $Enums.Modality
    bodyPart: string
    clinicalIndication: string
    instructions?: string | null
    urgency?: string | null
    transportRequired?: boolean
    contrastAllergy?: boolean
    contrastNotes?: string | null
    status?: $Enums.OrderStatus
    scheduledAt?: Date | string | null
    requestedBy: string
    requestedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImagingOrderCreateOrConnectWithoutStudiesInput = {
    where: ImagingOrderWhereUniqueInput
    create: XOR<ImagingOrderCreateWithoutStudiesInput, ImagingOrderUncheckedCreateWithoutStudiesInput>
  }

  export type ImageCreateWithoutStudyInput = {
    id?: string
    seriesInstanceUID: string
    sopInstanceUID: string
    instanceNumber: number
    seriesNumber: number
    seriesDescription?: string | null
    imageType?: string | null
    photometricInterpretation?: string | null
    rows?: number | null
    columns?: number | null
    bitsAllocated?: number | null
    bitsStored?: number | null
    pixelSpacing?: string | null
    sliceThickness?: number | null
    sliceLocation?: number | null
    imagePosition?: string | null
    imageOrientation?: string | null
    acquisitionDate?: Date | string | null
    acquisitionTime?: string | null
    contentDate?: Date | string | null
    contentTime?: string | null
    windowCenter?: string | null
    windowWidth?: string | null
    storageUrl: string
    thumbnailUrl?: string | null
    fileSize: bigint | number
    transferSyntaxUID?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageUncheckedCreateWithoutStudyInput = {
    id?: string
    seriesInstanceUID: string
    sopInstanceUID: string
    instanceNumber: number
    seriesNumber: number
    seriesDescription?: string | null
    imageType?: string | null
    photometricInterpretation?: string | null
    rows?: number | null
    columns?: number | null
    bitsAllocated?: number | null
    bitsStored?: number | null
    pixelSpacing?: string | null
    sliceThickness?: number | null
    sliceLocation?: number | null
    imagePosition?: string | null
    imageOrientation?: string | null
    acquisitionDate?: Date | string | null
    acquisitionTime?: string | null
    contentDate?: Date | string | null
    contentTime?: string | null
    windowCenter?: string | null
    windowWidth?: string | null
    storageUrl: string
    thumbnailUrl?: string | null
    fileSize: bigint | number
    transferSyntaxUID?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageCreateOrConnectWithoutStudyInput = {
    where: ImageWhereUniqueInput
    create: XOR<ImageCreateWithoutStudyInput, ImageUncheckedCreateWithoutStudyInput>
  }

  export type ImageCreateManyStudyInputEnvelope = {
    data: ImageCreateManyStudyInput | ImageCreateManyStudyInput[]
    skipDuplicates?: boolean
  }

  export type RadiologyReportCreateWithoutStudyInput = {
    id?: string
    reportNumber: string
    radiologistId: string
    radiologistName: string
    status?: $Enums.ReportStatus
    clinicalHistory?: string | null
    technique?: string | null
    comparison?: string | null
    findings: string
    impression: string
    recommendations?: string | null
    preliminaryDate?: Date | string | null
    finalizedDate?: Date | string | null
    amendedDate?: Date | string | null
    amendmentReason?: string | null
    signedBy?: string | null
    signedAt?: Date | string | null
    transcribedBy?: string | null
    transcribedAt?: Date | string | null
    template?: string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RadiologyReportUncheckedCreateWithoutStudyInput = {
    id?: string
    reportNumber: string
    radiologistId: string
    radiologistName: string
    status?: $Enums.ReportStatus
    clinicalHistory?: string | null
    technique?: string | null
    comparison?: string | null
    findings: string
    impression: string
    recommendations?: string | null
    preliminaryDate?: Date | string | null
    finalizedDate?: Date | string | null
    amendedDate?: Date | string | null
    amendmentReason?: string | null
    signedBy?: string | null
    signedAt?: Date | string | null
    transcribedBy?: string | null
    transcribedAt?: Date | string | null
    template?: string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RadiologyReportCreateOrConnectWithoutStudyInput = {
    where: RadiologyReportWhereUniqueInput
    create: XOR<RadiologyReportCreateWithoutStudyInput, RadiologyReportUncheckedCreateWithoutStudyInput>
  }

  export type RadiologyReportCreateManyStudyInputEnvelope = {
    data: RadiologyReportCreateManyStudyInput | RadiologyReportCreateManyStudyInput[]
    skipDuplicates?: boolean
  }

  export type CriticalFindingCreateWithoutStudyInput = {
    id?: string
    reportId?: string | null
    finding: string
    severity: $Enums.Severity
    category: string
    bodyPart?: string | null
    reportedBy: string
    reportedAt?: Date | string
    notifiedTo?: CriticalFindingCreatenotifiedToInput | string[]
    notificationSent?: boolean
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    followUpRequired?: boolean
    followUpAction?: string | null
    followUpStatus?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CriticalFindingUncheckedCreateWithoutStudyInput = {
    id?: string
    reportId?: string | null
    finding: string
    severity: $Enums.Severity
    category: string
    bodyPart?: string | null
    reportedBy: string
    reportedAt?: Date | string
    notifiedTo?: CriticalFindingCreatenotifiedToInput | string[]
    notificationSent?: boolean
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    followUpRequired?: boolean
    followUpAction?: string | null
    followUpStatus?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CriticalFindingCreateOrConnectWithoutStudyInput = {
    where: CriticalFindingWhereUniqueInput
    create: XOR<CriticalFindingCreateWithoutStudyInput, CriticalFindingUncheckedCreateWithoutStudyInput>
  }

  export type CriticalFindingCreateManyStudyInputEnvelope = {
    data: CriticalFindingCreateManyStudyInput | CriticalFindingCreateManyStudyInput[]
    skipDuplicates?: boolean
  }

  export type ImagingOrderUpsertWithoutStudiesInput = {
    update: XOR<ImagingOrderUpdateWithoutStudiesInput, ImagingOrderUncheckedUpdateWithoutStudiesInput>
    create: XOR<ImagingOrderCreateWithoutStudiesInput, ImagingOrderUncheckedCreateWithoutStudiesInput>
    where?: ImagingOrderWhereInput
  }

  export type ImagingOrderUpdateToOneWithWhereWithoutStudiesInput = {
    where?: ImagingOrderWhereInput
    data: XOR<ImagingOrderUpdateWithoutStudiesInput, ImagingOrderUncheckedUpdateWithoutStudiesInput>
  }

  export type ImagingOrderUpdateWithoutStudiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    clinicalIndication?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    urgency?: NullableStringFieldUpdateOperationsInput | string | null
    transportRequired?: BoolFieldUpdateOperationsInput | boolean
    contrastAllergy?: BoolFieldUpdateOperationsInput | boolean
    contrastNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestedBy?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImagingOrderUncheckedUpdateWithoutStudiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    clinicalIndication?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    urgency?: NullableStringFieldUpdateOperationsInput | string | null
    transportRequired?: BoolFieldUpdateOperationsInput | boolean
    contrastAllergy?: BoolFieldUpdateOperationsInput | boolean
    contrastNotes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestedBy?: StringFieldUpdateOperationsInput | string
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageUpsertWithWhereUniqueWithoutStudyInput = {
    where: ImageWhereUniqueInput
    update: XOR<ImageUpdateWithoutStudyInput, ImageUncheckedUpdateWithoutStudyInput>
    create: XOR<ImageCreateWithoutStudyInput, ImageUncheckedCreateWithoutStudyInput>
  }

  export type ImageUpdateWithWhereUniqueWithoutStudyInput = {
    where: ImageWhereUniqueInput
    data: XOR<ImageUpdateWithoutStudyInput, ImageUncheckedUpdateWithoutStudyInput>
  }

  export type ImageUpdateManyWithWhereWithoutStudyInput = {
    where: ImageScalarWhereInput
    data: XOR<ImageUpdateManyMutationInput, ImageUncheckedUpdateManyWithoutStudyInput>
  }

  export type ImageScalarWhereInput = {
    AND?: ImageScalarWhereInput | ImageScalarWhereInput[]
    OR?: ImageScalarWhereInput[]
    NOT?: ImageScalarWhereInput | ImageScalarWhereInput[]
    id?: StringFilter<"Image"> | string
    studyId?: StringFilter<"Image"> | string
    seriesInstanceUID?: StringFilter<"Image"> | string
    sopInstanceUID?: StringFilter<"Image"> | string
    instanceNumber?: IntFilter<"Image"> | number
    seriesNumber?: IntFilter<"Image"> | number
    seriesDescription?: StringNullableFilter<"Image"> | string | null
    imageType?: StringNullableFilter<"Image"> | string | null
    photometricInterpretation?: StringNullableFilter<"Image"> | string | null
    rows?: IntNullableFilter<"Image"> | number | null
    columns?: IntNullableFilter<"Image"> | number | null
    bitsAllocated?: IntNullableFilter<"Image"> | number | null
    bitsStored?: IntNullableFilter<"Image"> | number | null
    pixelSpacing?: StringNullableFilter<"Image"> | string | null
    sliceThickness?: FloatNullableFilter<"Image"> | number | null
    sliceLocation?: FloatNullableFilter<"Image"> | number | null
    imagePosition?: StringNullableFilter<"Image"> | string | null
    imageOrientation?: StringNullableFilter<"Image"> | string | null
    acquisitionDate?: DateTimeNullableFilter<"Image"> | Date | string | null
    acquisitionTime?: StringNullableFilter<"Image"> | string | null
    contentDate?: DateTimeNullableFilter<"Image"> | Date | string | null
    contentTime?: StringNullableFilter<"Image"> | string | null
    windowCenter?: StringNullableFilter<"Image"> | string | null
    windowWidth?: StringNullableFilter<"Image"> | string | null
    storageUrl?: StringFilter<"Image"> | string
    thumbnailUrl?: StringNullableFilter<"Image"> | string | null
    fileSize?: BigIntFilter<"Image"> | bigint | number
    transferSyntaxUID?: StringNullableFilter<"Image"> | string | null
    metadata?: JsonNullableFilter<"Image">
    createdAt?: DateTimeFilter<"Image"> | Date | string
    updatedAt?: DateTimeFilter<"Image"> | Date | string
  }

  export type RadiologyReportUpsertWithWhereUniqueWithoutStudyInput = {
    where: RadiologyReportWhereUniqueInput
    update: XOR<RadiologyReportUpdateWithoutStudyInput, RadiologyReportUncheckedUpdateWithoutStudyInput>
    create: XOR<RadiologyReportCreateWithoutStudyInput, RadiologyReportUncheckedCreateWithoutStudyInput>
  }

  export type RadiologyReportUpdateWithWhereUniqueWithoutStudyInput = {
    where: RadiologyReportWhereUniqueInput
    data: XOR<RadiologyReportUpdateWithoutStudyInput, RadiologyReportUncheckedUpdateWithoutStudyInput>
  }

  export type RadiologyReportUpdateManyWithWhereWithoutStudyInput = {
    where: RadiologyReportScalarWhereInput
    data: XOR<RadiologyReportUpdateManyMutationInput, RadiologyReportUncheckedUpdateManyWithoutStudyInput>
  }

  export type RadiologyReportScalarWhereInput = {
    AND?: RadiologyReportScalarWhereInput | RadiologyReportScalarWhereInput[]
    OR?: RadiologyReportScalarWhereInput[]
    NOT?: RadiologyReportScalarWhereInput | RadiologyReportScalarWhereInput[]
    id?: StringFilter<"RadiologyReport"> | string
    studyId?: StringFilter<"RadiologyReport"> | string
    reportNumber?: StringFilter<"RadiologyReport"> | string
    radiologistId?: StringFilter<"RadiologyReport"> | string
    radiologistName?: StringFilter<"RadiologyReport"> | string
    status?: EnumReportStatusFilter<"RadiologyReport"> | $Enums.ReportStatus
    clinicalHistory?: StringNullableFilter<"RadiologyReport"> | string | null
    technique?: StringNullableFilter<"RadiologyReport"> | string | null
    comparison?: StringNullableFilter<"RadiologyReport"> | string | null
    findings?: StringFilter<"RadiologyReport"> | string
    impression?: StringFilter<"RadiologyReport"> | string
    recommendations?: StringNullableFilter<"RadiologyReport"> | string | null
    preliminaryDate?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    finalizedDate?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    amendedDate?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    amendmentReason?: StringNullableFilter<"RadiologyReport"> | string | null
    signedBy?: StringNullableFilter<"RadiologyReport"> | string | null
    signedAt?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    transcribedBy?: StringNullableFilter<"RadiologyReport"> | string | null
    transcribedAt?: DateTimeNullableFilter<"RadiologyReport"> | Date | string | null
    template?: StringNullableFilter<"RadiologyReport"> | string | null
    macros?: JsonNullableFilter<"RadiologyReport">
    createdAt?: DateTimeFilter<"RadiologyReport"> | Date | string
    updatedAt?: DateTimeFilter<"RadiologyReport"> | Date | string
  }

  export type CriticalFindingUpsertWithWhereUniqueWithoutStudyInput = {
    where: CriticalFindingWhereUniqueInput
    update: XOR<CriticalFindingUpdateWithoutStudyInput, CriticalFindingUncheckedUpdateWithoutStudyInput>
    create: XOR<CriticalFindingCreateWithoutStudyInput, CriticalFindingUncheckedCreateWithoutStudyInput>
  }

  export type CriticalFindingUpdateWithWhereUniqueWithoutStudyInput = {
    where: CriticalFindingWhereUniqueInput
    data: XOR<CriticalFindingUpdateWithoutStudyInput, CriticalFindingUncheckedUpdateWithoutStudyInput>
  }

  export type CriticalFindingUpdateManyWithWhereWithoutStudyInput = {
    where: CriticalFindingScalarWhereInput
    data: XOR<CriticalFindingUpdateManyMutationInput, CriticalFindingUncheckedUpdateManyWithoutStudyInput>
  }

  export type CriticalFindingScalarWhereInput = {
    AND?: CriticalFindingScalarWhereInput | CriticalFindingScalarWhereInput[]
    OR?: CriticalFindingScalarWhereInput[]
    NOT?: CriticalFindingScalarWhereInput | CriticalFindingScalarWhereInput[]
    id?: StringFilter<"CriticalFinding"> | string
    studyId?: StringFilter<"CriticalFinding"> | string
    reportId?: StringNullableFilter<"CriticalFinding"> | string | null
    finding?: StringFilter<"CriticalFinding"> | string
    severity?: EnumSeverityFilter<"CriticalFinding"> | $Enums.Severity
    category?: StringFilter<"CriticalFinding"> | string
    bodyPart?: StringNullableFilter<"CriticalFinding"> | string | null
    reportedBy?: StringFilter<"CriticalFinding"> | string
    reportedAt?: DateTimeFilter<"CriticalFinding"> | Date | string
    notifiedTo?: StringNullableListFilter<"CriticalFinding">
    notificationSent?: BoolFilter<"CriticalFinding"> | boolean
    acknowledgedBy?: StringNullableFilter<"CriticalFinding"> | string | null
    acknowledgedAt?: DateTimeNullableFilter<"CriticalFinding"> | Date | string | null
    followUpRequired?: BoolFilter<"CriticalFinding"> | boolean
    followUpAction?: StringNullableFilter<"CriticalFinding"> | string | null
    followUpStatus?: StringNullableFilter<"CriticalFinding"> | string | null
    notes?: StringNullableFilter<"CriticalFinding"> | string | null
    createdAt?: DateTimeFilter<"CriticalFinding"> | Date | string
    updatedAt?: DateTimeFilter<"CriticalFinding"> | Date | string
  }

  export type StudyCreateWithoutImagesInput = {
    id?: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
    order: ImagingOrderCreateNestedOneWithoutStudiesInput
    reports?: RadiologyReportCreateNestedManyWithoutStudyInput
    criticalFindings?: CriticalFindingCreateNestedManyWithoutStudyInput
  }

  export type StudyUncheckedCreateWithoutImagesInput = {
    id?: string
    orderId: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
    reports?: RadiologyReportUncheckedCreateNestedManyWithoutStudyInput
    criticalFindings?: CriticalFindingUncheckedCreateNestedManyWithoutStudyInput
  }

  export type StudyCreateOrConnectWithoutImagesInput = {
    where: StudyWhereUniqueInput
    create: XOR<StudyCreateWithoutImagesInput, StudyUncheckedCreateWithoutImagesInput>
  }

  export type StudyUpsertWithoutImagesInput = {
    update: XOR<StudyUpdateWithoutImagesInput, StudyUncheckedUpdateWithoutImagesInput>
    create: XOR<StudyCreateWithoutImagesInput, StudyUncheckedCreateWithoutImagesInput>
    where?: StudyWhereInput
  }

  export type StudyUpdateToOneWithWhereWithoutImagesInput = {
    where?: StudyWhereInput
    data: XOR<StudyUpdateWithoutImagesInput, StudyUncheckedUpdateWithoutImagesInput>
  }

  export type StudyUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: ImagingOrderUpdateOneRequiredWithoutStudiesNestedInput
    reports?: RadiologyReportUpdateManyWithoutStudyNestedInput
    criticalFindings?: CriticalFindingUpdateManyWithoutStudyNestedInput
  }

  export type StudyUncheckedUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: RadiologyReportUncheckedUpdateManyWithoutStudyNestedInput
    criticalFindings?: CriticalFindingUncheckedUpdateManyWithoutStudyNestedInput
  }

  export type StudyCreateWithoutReportsInput = {
    id?: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
    order: ImagingOrderCreateNestedOneWithoutStudiesInput
    images?: ImageCreateNestedManyWithoutStudyInput
    criticalFindings?: CriticalFindingCreateNestedManyWithoutStudyInput
  }

  export type StudyUncheckedCreateWithoutReportsInput = {
    id?: string
    orderId: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ImageUncheckedCreateNestedManyWithoutStudyInput
    criticalFindings?: CriticalFindingUncheckedCreateNestedManyWithoutStudyInput
  }

  export type StudyCreateOrConnectWithoutReportsInput = {
    where: StudyWhereUniqueInput
    create: XOR<StudyCreateWithoutReportsInput, StudyUncheckedCreateWithoutReportsInput>
  }

  export type StudyUpsertWithoutReportsInput = {
    update: XOR<StudyUpdateWithoutReportsInput, StudyUncheckedUpdateWithoutReportsInput>
    create: XOR<StudyCreateWithoutReportsInput, StudyUncheckedCreateWithoutReportsInput>
    where?: StudyWhereInput
  }

  export type StudyUpdateToOneWithWhereWithoutReportsInput = {
    where?: StudyWhereInput
    data: XOR<StudyUpdateWithoutReportsInput, StudyUncheckedUpdateWithoutReportsInput>
  }

  export type StudyUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: ImagingOrderUpdateOneRequiredWithoutStudiesNestedInput
    images?: ImageUpdateManyWithoutStudyNestedInput
    criticalFindings?: CriticalFindingUpdateManyWithoutStudyNestedInput
  }

  export type StudyUncheckedUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ImageUncheckedUpdateManyWithoutStudyNestedInput
    criticalFindings?: CriticalFindingUncheckedUpdateManyWithoutStudyNestedInput
  }

  export type StudyCreateWithoutCriticalFindingsInput = {
    id?: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
    order: ImagingOrderCreateNestedOneWithoutStudiesInput
    images?: ImageCreateNestedManyWithoutStudyInput
    reports?: RadiologyReportCreateNestedManyWithoutStudyInput
  }

  export type StudyUncheckedCreateWithoutCriticalFindingsInput = {
    id?: string
    orderId: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ImageUncheckedCreateNestedManyWithoutStudyInput
    reports?: RadiologyReportUncheckedCreateNestedManyWithoutStudyInput
  }

  export type StudyCreateOrConnectWithoutCriticalFindingsInput = {
    where: StudyWhereUniqueInput
    create: XOR<StudyCreateWithoutCriticalFindingsInput, StudyUncheckedCreateWithoutCriticalFindingsInput>
  }

  export type StudyUpsertWithoutCriticalFindingsInput = {
    update: XOR<StudyUpdateWithoutCriticalFindingsInput, StudyUncheckedUpdateWithoutCriticalFindingsInput>
    create: XOR<StudyCreateWithoutCriticalFindingsInput, StudyUncheckedCreateWithoutCriticalFindingsInput>
    where?: StudyWhereInput
  }

  export type StudyUpdateToOneWithWhereWithoutCriticalFindingsInput = {
    where?: StudyWhereInput
    data: XOR<StudyUpdateWithoutCriticalFindingsInput, StudyUncheckedUpdateWithoutCriticalFindingsInput>
  }

  export type StudyUpdateWithoutCriticalFindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: ImagingOrderUpdateOneRequiredWithoutStudiesNestedInput
    images?: ImageUpdateManyWithoutStudyNestedInput
    reports?: RadiologyReportUpdateManyWithoutStudyNestedInput
  }

  export type StudyUncheckedUpdateWithoutCriticalFindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ImageUncheckedUpdateManyWithoutStudyNestedInput
    reports?: RadiologyReportUncheckedUpdateManyWithoutStudyNestedInput
  }

  export type StudyCreateManyOrderInput = {
    id?: string
    accessionNumber: string
    studyInstanceUID: string
    studyDate: Date | string
    studyTime?: string | null
    studyDescription: string
    modality: $Enums.Modality
    bodyPart: string
    numberOfSeries?: number
    numberOfInstances?: number
    patientId: string
    patientName: string
    patientDOB?: Date | string | null
    patientSex?: string | null
    performingPhysician?: string | null
    operatorName?: string | null
    institutionName?: string | null
    stationName?: string | null
    status?: $Enums.StudyStatus
    priority?: $Enums.Priority
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudyUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ImageUpdateManyWithoutStudyNestedInput
    reports?: RadiologyReportUpdateManyWithoutStudyNestedInput
    criticalFindings?: CriticalFindingUpdateManyWithoutStudyNestedInput
  }

  export type StudyUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ImageUncheckedUpdateManyWithoutStudyNestedInput
    reports?: RadiologyReportUncheckedUpdateManyWithoutStudyNestedInput
    criticalFindings?: CriticalFindingUncheckedUpdateManyWithoutStudyNestedInput
  }

  export type StudyUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessionNumber?: StringFieldUpdateOperationsInput | string
    studyInstanceUID?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    studyTime?: NullableStringFieldUpdateOperationsInput | string | null
    studyDescription?: StringFieldUpdateOperationsInput | string
    modality?: EnumModalityFieldUpdateOperationsInput | $Enums.Modality
    bodyPart?: StringFieldUpdateOperationsInput | string
    numberOfSeries?: IntFieldUpdateOperationsInput | number
    numberOfInstances?: IntFieldUpdateOperationsInput | number
    patientId?: StringFieldUpdateOperationsInput | string
    patientName?: StringFieldUpdateOperationsInput | string
    patientDOB?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientSex?: NullableStringFieldUpdateOperationsInput | string | null
    performingPhysician?: NullableStringFieldUpdateOperationsInput | string | null
    operatorName?: NullableStringFieldUpdateOperationsInput | string | null
    institutionName?: NullableStringFieldUpdateOperationsInput | string | null
    stationName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStudyStatusFieldUpdateOperationsInput | $Enums.StudyStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageCreateManyStudyInput = {
    id?: string
    seriesInstanceUID: string
    sopInstanceUID: string
    instanceNumber: number
    seriesNumber: number
    seriesDescription?: string | null
    imageType?: string | null
    photometricInterpretation?: string | null
    rows?: number | null
    columns?: number | null
    bitsAllocated?: number | null
    bitsStored?: number | null
    pixelSpacing?: string | null
    sliceThickness?: number | null
    sliceLocation?: number | null
    imagePosition?: string | null
    imageOrientation?: string | null
    acquisitionDate?: Date | string | null
    acquisitionTime?: string | null
    contentDate?: Date | string | null
    contentTime?: string | null
    windowCenter?: string | null
    windowWidth?: string | null
    storageUrl: string
    thumbnailUrl?: string | null
    fileSize: bigint | number
    transferSyntaxUID?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RadiologyReportCreateManyStudyInput = {
    id?: string
    reportNumber: string
    radiologistId: string
    radiologistName: string
    status?: $Enums.ReportStatus
    clinicalHistory?: string | null
    technique?: string | null
    comparison?: string | null
    findings: string
    impression: string
    recommendations?: string | null
    preliminaryDate?: Date | string | null
    finalizedDate?: Date | string | null
    amendedDate?: Date | string | null
    amendmentReason?: string | null
    signedBy?: string | null
    signedAt?: Date | string | null
    transcribedBy?: string | null
    transcribedAt?: Date | string | null
    template?: string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CriticalFindingCreateManyStudyInput = {
    id?: string
    reportId?: string | null
    finding: string
    severity: $Enums.Severity
    category: string
    bodyPart?: string | null
    reportedBy: string
    reportedAt?: Date | string
    notifiedTo?: CriticalFindingCreatenotifiedToInput | string[]
    notificationSent?: boolean
    acknowledgedBy?: string | null
    acknowledgedAt?: Date | string | null
    followUpRequired?: boolean
    followUpAction?: string | null
    followUpStatus?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageUpdateWithoutStudyInput = {
    id?: StringFieldUpdateOperationsInput | string
    seriesInstanceUID?: StringFieldUpdateOperationsInput | string
    sopInstanceUID?: StringFieldUpdateOperationsInput | string
    instanceNumber?: IntFieldUpdateOperationsInput | number
    seriesNumber?: IntFieldUpdateOperationsInput | number
    seriesDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageType?: NullableStringFieldUpdateOperationsInput | string | null
    photometricInterpretation?: NullableStringFieldUpdateOperationsInput | string | null
    rows?: NullableIntFieldUpdateOperationsInput | number | null
    columns?: NullableIntFieldUpdateOperationsInput | number | null
    bitsAllocated?: NullableIntFieldUpdateOperationsInput | number | null
    bitsStored?: NullableIntFieldUpdateOperationsInput | number | null
    pixelSpacing?: NullableStringFieldUpdateOperationsInput | string | null
    sliceThickness?: NullableFloatFieldUpdateOperationsInput | number | null
    sliceLocation?: NullableFloatFieldUpdateOperationsInput | number | null
    imagePosition?: NullableStringFieldUpdateOperationsInput | string | null
    imageOrientation?: NullableStringFieldUpdateOperationsInput | string | null
    acquisitionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acquisitionTime?: NullableStringFieldUpdateOperationsInput | string | null
    contentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentTime?: NullableStringFieldUpdateOperationsInput | string | null
    windowCenter?: NullableStringFieldUpdateOperationsInput | string | null
    windowWidth?: NullableStringFieldUpdateOperationsInput | string | null
    storageUrl?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    transferSyntaxUID?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageUncheckedUpdateWithoutStudyInput = {
    id?: StringFieldUpdateOperationsInput | string
    seriesInstanceUID?: StringFieldUpdateOperationsInput | string
    sopInstanceUID?: StringFieldUpdateOperationsInput | string
    instanceNumber?: IntFieldUpdateOperationsInput | number
    seriesNumber?: IntFieldUpdateOperationsInput | number
    seriesDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageType?: NullableStringFieldUpdateOperationsInput | string | null
    photometricInterpretation?: NullableStringFieldUpdateOperationsInput | string | null
    rows?: NullableIntFieldUpdateOperationsInput | number | null
    columns?: NullableIntFieldUpdateOperationsInput | number | null
    bitsAllocated?: NullableIntFieldUpdateOperationsInput | number | null
    bitsStored?: NullableIntFieldUpdateOperationsInput | number | null
    pixelSpacing?: NullableStringFieldUpdateOperationsInput | string | null
    sliceThickness?: NullableFloatFieldUpdateOperationsInput | number | null
    sliceLocation?: NullableFloatFieldUpdateOperationsInput | number | null
    imagePosition?: NullableStringFieldUpdateOperationsInput | string | null
    imageOrientation?: NullableStringFieldUpdateOperationsInput | string | null
    acquisitionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acquisitionTime?: NullableStringFieldUpdateOperationsInput | string | null
    contentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentTime?: NullableStringFieldUpdateOperationsInput | string | null
    windowCenter?: NullableStringFieldUpdateOperationsInput | string | null
    windowWidth?: NullableStringFieldUpdateOperationsInput | string | null
    storageUrl?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    transferSyntaxUID?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageUncheckedUpdateManyWithoutStudyInput = {
    id?: StringFieldUpdateOperationsInput | string
    seriesInstanceUID?: StringFieldUpdateOperationsInput | string
    sopInstanceUID?: StringFieldUpdateOperationsInput | string
    instanceNumber?: IntFieldUpdateOperationsInput | number
    seriesNumber?: IntFieldUpdateOperationsInput | number
    seriesDescription?: NullableStringFieldUpdateOperationsInput | string | null
    imageType?: NullableStringFieldUpdateOperationsInput | string | null
    photometricInterpretation?: NullableStringFieldUpdateOperationsInput | string | null
    rows?: NullableIntFieldUpdateOperationsInput | number | null
    columns?: NullableIntFieldUpdateOperationsInput | number | null
    bitsAllocated?: NullableIntFieldUpdateOperationsInput | number | null
    bitsStored?: NullableIntFieldUpdateOperationsInput | number | null
    pixelSpacing?: NullableStringFieldUpdateOperationsInput | string | null
    sliceThickness?: NullableFloatFieldUpdateOperationsInput | number | null
    sliceLocation?: NullableFloatFieldUpdateOperationsInput | number | null
    imagePosition?: NullableStringFieldUpdateOperationsInput | string | null
    imageOrientation?: NullableStringFieldUpdateOperationsInput | string | null
    acquisitionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acquisitionTime?: NullableStringFieldUpdateOperationsInput | string | null
    contentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentTime?: NullableStringFieldUpdateOperationsInput | string | null
    windowCenter?: NullableStringFieldUpdateOperationsInput | string | null
    windowWidth?: NullableStringFieldUpdateOperationsInput | string | null
    storageUrl?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    transferSyntaxUID?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RadiologyReportUpdateWithoutStudyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportNumber?: StringFieldUpdateOperationsInput | string
    radiologistId?: StringFieldUpdateOperationsInput | string
    radiologistName?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    clinicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    technique?: NullableStringFieldUpdateOperationsInput | string | null
    comparison?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: StringFieldUpdateOperationsInput | string
    impression?: StringFieldUpdateOperationsInput | string
    recommendations?: NullableStringFieldUpdateOperationsInput | string | null
    preliminaryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalizedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendmentReason?: NullableStringFieldUpdateOperationsInput | string | null
    signedBy?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transcribedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transcribedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    template?: NullableStringFieldUpdateOperationsInput | string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RadiologyReportUncheckedUpdateWithoutStudyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportNumber?: StringFieldUpdateOperationsInput | string
    radiologistId?: StringFieldUpdateOperationsInput | string
    radiologistName?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    clinicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    technique?: NullableStringFieldUpdateOperationsInput | string | null
    comparison?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: StringFieldUpdateOperationsInput | string
    impression?: StringFieldUpdateOperationsInput | string
    recommendations?: NullableStringFieldUpdateOperationsInput | string | null
    preliminaryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalizedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendmentReason?: NullableStringFieldUpdateOperationsInput | string | null
    signedBy?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transcribedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transcribedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    template?: NullableStringFieldUpdateOperationsInput | string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RadiologyReportUncheckedUpdateManyWithoutStudyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportNumber?: StringFieldUpdateOperationsInput | string
    radiologistId?: StringFieldUpdateOperationsInput | string
    radiologistName?: StringFieldUpdateOperationsInput | string
    status?: EnumReportStatusFieldUpdateOperationsInput | $Enums.ReportStatus
    clinicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    technique?: NullableStringFieldUpdateOperationsInput | string | null
    comparison?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: StringFieldUpdateOperationsInput | string
    impression?: StringFieldUpdateOperationsInput | string
    recommendations?: NullableStringFieldUpdateOperationsInput | string | null
    preliminaryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finalizedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amendmentReason?: NullableStringFieldUpdateOperationsInput | string | null
    signedBy?: NullableStringFieldUpdateOperationsInput | string | null
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transcribedBy?: NullableStringFieldUpdateOperationsInput | string | null
    transcribedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    template?: NullableStringFieldUpdateOperationsInput | string | null
    macros?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CriticalFindingUpdateWithoutStudyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportId?: NullableStringFieldUpdateOperationsInput | string | null
    finding?: StringFieldUpdateOperationsInput | string
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    category?: StringFieldUpdateOperationsInput | string
    bodyPart?: NullableStringFieldUpdateOperationsInput | string | null
    reportedBy?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedTo?: CriticalFindingUpdatenotifiedToInput | string[]
    notificationSent?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    followUpAction?: NullableStringFieldUpdateOperationsInput | string | null
    followUpStatus?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CriticalFindingUncheckedUpdateWithoutStudyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportId?: NullableStringFieldUpdateOperationsInput | string | null
    finding?: StringFieldUpdateOperationsInput | string
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    category?: StringFieldUpdateOperationsInput | string
    bodyPart?: NullableStringFieldUpdateOperationsInput | string | null
    reportedBy?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedTo?: CriticalFindingUpdatenotifiedToInput | string[]
    notificationSent?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    followUpAction?: NullableStringFieldUpdateOperationsInput | string | null
    followUpStatus?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CriticalFindingUncheckedUpdateManyWithoutStudyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reportId?: NullableStringFieldUpdateOperationsInput | string | null
    finding?: StringFieldUpdateOperationsInput | string
    severity?: EnumSeverityFieldUpdateOperationsInput | $Enums.Severity
    category?: StringFieldUpdateOperationsInput | string
    bodyPart?: NullableStringFieldUpdateOperationsInput | string | null
    reportedBy?: StringFieldUpdateOperationsInput | string
    reportedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifiedTo?: CriticalFindingUpdatenotifiedToInput | string[]
    notificationSent?: BoolFieldUpdateOperationsInput | boolean
    acknowledgedBy?: NullableStringFieldUpdateOperationsInput | string | null
    acknowledgedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    followUpAction?: NullableStringFieldUpdateOperationsInput | string | null
    followUpStatus?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ImagingOrderCountOutputTypeDefaultArgs instead
     */
    export type ImagingOrderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ImagingOrderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StudyCountOutputTypeDefaultArgs instead
     */
    export type StudyCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StudyCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ImagingOrderDefaultArgs instead
     */
    export type ImagingOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ImagingOrderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StudyDefaultArgs instead
     */
    export type StudyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StudyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ImageDefaultArgs instead
     */
    export type ImageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ImageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RadiologyReportDefaultArgs instead
     */
    export type RadiologyReportArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RadiologyReportDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CriticalFindingDefaultArgs instead
     */
    export type CriticalFindingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CriticalFindingDefaultArgs<ExtArgs>

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