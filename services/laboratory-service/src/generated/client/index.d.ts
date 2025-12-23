
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
 * Model LabOrder
 * 
 */
export type LabOrder = $Result.DefaultSelection<Prisma.$LabOrderPayload>
/**
 * Model LabTest
 * 
 */
export type LabTest = $Result.DefaultSelection<Prisma.$LabTestPayload>
/**
 * Model LabResult
 * 
 */
export type LabResult = $Result.DefaultSelection<Prisma.$LabResultPayload>
/**
 * Model DiagnosticTest
 * 
 */
export type DiagnosticTest = $Result.DefaultSelection<Prisma.$DiagnosticTestPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const OrderStatus: {
  pending: 'pending',
  collected: 'collected',
  processing: 'processing',
  completed: 'completed',
  cancelled: 'cancelled'
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]


export const OrderPriority: {
  routine: 'routine',
  urgent: 'urgent',
  stat: 'stat'
};

export type OrderPriority = (typeof OrderPriority)[keyof typeof OrderPriority]


export const TestCategory: {
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

export type TestCategory = (typeof TestCategory)[keyof typeof TestCategory]


export const TestStatus: {
  pending: 'pending',
  processing: 'processing',
  completed: 'completed',
  cancelled: 'cancelled'
};

export type TestStatus = (typeof TestStatus)[keyof typeof TestStatus]

}

export type OrderStatus = $Enums.OrderStatus

export const OrderStatus: typeof $Enums.OrderStatus

export type OrderPriority = $Enums.OrderPriority

export const OrderPriority: typeof $Enums.OrderPriority

export type TestCategory = $Enums.TestCategory

export const TestCategory: typeof $Enums.TestCategory

export type TestStatus = $Enums.TestStatus

export const TestStatus: typeof $Enums.TestStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more LabOrders
 * const labOrders = await prisma.labOrder.findMany()
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
   * // Fetch zero or more LabOrders
   * const labOrders = await prisma.labOrder.findMany()
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
   * `prisma.labOrder`: Exposes CRUD operations for the **LabOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LabOrders
    * const labOrders = await prisma.labOrder.findMany()
    * ```
    */
  get labOrder(): Prisma.LabOrderDelegate<ExtArgs>;

  /**
   * `prisma.labTest`: Exposes CRUD operations for the **LabTest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LabTests
    * const labTests = await prisma.labTest.findMany()
    * ```
    */
  get labTest(): Prisma.LabTestDelegate<ExtArgs>;

  /**
   * `prisma.labResult`: Exposes CRUD operations for the **LabResult** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LabResults
    * const labResults = await prisma.labResult.findMany()
    * ```
    */
  get labResult(): Prisma.LabResultDelegate<ExtArgs>;

  /**
   * `prisma.diagnosticTest`: Exposes CRUD operations for the **DiagnosticTest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DiagnosticTests
    * const diagnosticTests = await prisma.diagnosticTest.findMany()
    * ```
    */
  get diagnosticTest(): Prisma.DiagnosticTestDelegate<ExtArgs>;
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
    LabOrder: 'LabOrder',
    LabTest: 'LabTest',
    LabResult: 'LabResult',
    DiagnosticTest: 'DiagnosticTest'
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
      modelProps: "labOrder" | "labTest" | "labResult" | "diagnosticTest"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      LabOrder: {
        payload: Prisma.$LabOrderPayload<ExtArgs>
        fields: Prisma.LabOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LabOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LabOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOrderPayload>
          }
          findFirst: {
            args: Prisma.LabOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LabOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOrderPayload>
          }
          findMany: {
            args: Prisma.LabOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOrderPayload>[]
          }
          create: {
            args: Prisma.LabOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOrderPayload>
          }
          createMany: {
            args: Prisma.LabOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LabOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOrderPayload>[]
          }
          delete: {
            args: Prisma.LabOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOrderPayload>
          }
          update: {
            args: Prisma.LabOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOrderPayload>
          }
          deleteMany: {
            args: Prisma.LabOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LabOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LabOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabOrderPayload>
          }
          aggregate: {
            args: Prisma.LabOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLabOrder>
          }
          groupBy: {
            args: Prisma.LabOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<LabOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.LabOrderCountArgs<ExtArgs>
            result: $Utils.Optional<LabOrderCountAggregateOutputType> | number
          }
        }
      }
      LabTest: {
        payload: Prisma.$LabTestPayload<ExtArgs>
        fields: Prisma.LabTestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LabTestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabTestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LabTestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabTestPayload>
          }
          findFirst: {
            args: Prisma.LabTestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabTestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LabTestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabTestPayload>
          }
          findMany: {
            args: Prisma.LabTestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabTestPayload>[]
          }
          create: {
            args: Prisma.LabTestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabTestPayload>
          }
          createMany: {
            args: Prisma.LabTestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LabTestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabTestPayload>[]
          }
          delete: {
            args: Prisma.LabTestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabTestPayload>
          }
          update: {
            args: Prisma.LabTestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabTestPayload>
          }
          deleteMany: {
            args: Prisma.LabTestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LabTestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LabTestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabTestPayload>
          }
          aggregate: {
            args: Prisma.LabTestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLabTest>
          }
          groupBy: {
            args: Prisma.LabTestGroupByArgs<ExtArgs>
            result: $Utils.Optional<LabTestGroupByOutputType>[]
          }
          count: {
            args: Prisma.LabTestCountArgs<ExtArgs>
            result: $Utils.Optional<LabTestCountAggregateOutputType> | number
          }
        }
      }
      LabResult: {
        payload: Prisma.$LabResultPayload<ExtArgs>
        fields: Prisma.LabResultFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LabResultFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabResultPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LabResultFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabResultPayload>
          }
          findFirst: {
            args: Prisma.LabResultFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabResultPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LabResultFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabResultPayload>
          }
          findMany: {
            args: Prisma.LabResultFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabResultPayload>[]
          }
          create: {
            args: Prisma.LabResultCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabResultPayload>
          }
          createMany: {
            args: Prisma.LabResultCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LabResultCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabResultPayload>[]
          }
          delete: {
            args: Prisma.LabResultDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabResultPayload>
          }
          update: {
            args: Prisma.LabResultUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabResultPayload>
          }
          deleteMany: {
            args: Prisma.LabResultDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LabResultUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LabResultUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabResultPayload>
          }
          aggregate: {
            args: Prisma.LabResultAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLabResult>
          }
          groupBy: {
            args: Prisma.LabResultGroupByArgs<ExtArgs>
            result: $Utils.Optional<LabResultGroupByOutputType>[]
          }
          count: {
            args: Prisma.LabResultCountArgs<ExtArgs>
            result: $Utils.Optional<LabResultCountAggregateOutputType> | number
          }
        }
      }
      DiagnosticTest: {
        payload: Prisma.$DiagnosticTestPayload<ExtArgs>
        fields: Prisma.DiagnosticTestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiagnosticTestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticTestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiagnosticTestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticTestPayload>
          }
          findFirst: {
            args: Prisma.DiagnosticTestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticTestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiagnosticTestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticTestPayload>
          }
          findMany: {
            args: Prisma.DiagnosticTestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticTestPayload>[]
          }
          create: {
            args: Prisma.DiagnosticTestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticTestPayload>
          }
          createMany: {
            args: Prisma.DiagnosticTestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiagnosticTestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticTestPayload>[]
          }
          delete: {
            args: Prisma.DiagnosticTestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticTestPayload>
          }
          update: {
            args: Prisma.DiagnosticTestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticTestPayload>
          }
          deleteMany: {
            args: Prisma.DiagnosticTestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiagnosticTestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DiagnosticTestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticTestPayload>
          }
          aggregate: {
            args: Prisma.DiagnosticTestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiagnosticTest>
          }
          groupBy: {
            args: Prisma.DiagnosticTestGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiagnosticTestGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiagnosticTestCountArgs<ExtArgs>
            result: $Utils.Optional<DiagnosticTestCountAggregateOutputType> | number
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
   * Count Type LabOrderCountOutputType
   */

  export type LabOrderCountOutputType = {
    tests: number
  }

  export type LabOrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tests?: boolean | LabOrderCountOutputTypeCountTestsArgs
  }

  // Custom InputTypes
  /**
   * LabOrderCountOutputType without action
   */
  export type LabOrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrderCountOutputType
     */
    select?: LabOrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LabOrderCountOutputType without action
   */
  export type LabOrderCountOutputTypeCountTestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabTestWhereInput
  }


  /**
   * Count Type LabTestCountOutputType
   */

  export type LabTestCountOutputType = {
    results: number
  }

  export type LabTestCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    results?: boolean | LabTestCountOutputTypeCountResultsArgs
  }

  // Custom InputTypes
  /**
   * LabTestCountOutputType without action
   */
  export type LabTestCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTestCountOutputType
     */
    select?: LabTestCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LabTestCountOutputType without action
   */
  export type LabTestCountOutputTypeCountResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabResultWhereInput
  }


  /**
   * Models
   */

  /**
   * Model LabOrder
   */

  export type AggregateLabOrder = {
    _count: LabOrderCountAggregateOutputType | null
    _min: LabOrderMinAggregateOutputType | null
    _max: LabOrderMaxAggregateOutputType | null
  }

  export type LabOrderMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    encounterId: string | null
    orderNumber: string | null
    status: $Enums.OrderStatus | null
    priority: $Enums.OrderPriority | null
    clinicalInfo: string | null
    orderedAt: Date | null
    collectedAt: Date | null
    completedAt: Date | null
    reportUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LabOrderMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    encounterId: string | null
    orderNumber: string | null
    status: $Enums.OrderStatus | null
    priority: $Enums.OrderPriority | null
    clinicalInfo: string | null
    orderedAt: Date | null
    collectedAt: Date | null
    completedAt: Date | null
    reportUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LabOrderCountAggregateOutputType = {
    id: number
    patientId: number
    providerId: number
    encounterId: number
    orderNumber: number
    status: number
    priority: number
    clinicalInfo: number
    orderedAt: number
    collectedAt: number
    completedAt: number
    reportUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LabOrderMinAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    encounterId?: true
    orderNumber?: true
    status?: true
    priority?: true
    clinicalInfo?: true
    orderedAt?: true
    collectedAt?: true
    completedAt?: true
    reportUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LabOrderMaxAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    encounterId?: true
    orderNumber?: true
    status?: true
    priority?: true
    clinicalInfo?: true
    orderedAt?: true
    collectedAt?: true
    completedAt?: true
    reportUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LabOrderCountAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    encounterId?: true
    orderNumber?: true
    status?: true
    priority?: true
    clinicalInfo?: true
    orderedAt?: true
    collectedAt?: true
    completedAt?: true
    reportUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LabOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabOrder to aggregate.
     */
    where?: LabOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabOrders to fetch.
     */
    orderBy?: LabOrderOrderByWithRelationInput | LabOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LabOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LabOrders
    **/
    _count?: true | LabOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabOrderMaxAggregateInputType
  }

  export type GetLabOrderAggregateType<T extends LabOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateLabOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabOrder[P]>
      : GetScalarType<T[P], AggregateLabOrder[P]>
  }




  export type LabOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabOrderWhereInput
    orderBy?: LabOrderOrderByWithAggregationInput | LabOrderOrderByWithAggregationInput[]
    by: LabOrderScalarFieldEnum[] | LabOrderScalarFieldEnum
    having?: LabOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabOrderCountAggregateInputType | true
    _min?: LabOrderMinAggregateInputType
    _max?: LabOrderMaxAggregateInputType
  }

  export type LabOrderGroupByOutputType = {
    id: string
    patientId: string
    providerId: string
    encounterId: string | null
    orderNumber: string
    status: $Enums.OrderStatus
    priority: $Enums.OrderPriority
    clinicalInfo: string | null
    orderedAt: Date
    collectedAt: Date | null
    completedAt: Date | null
    reportUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: LabOrderCountAggregateOutputType | null
    _min: LabOrderMinAggregateOutputType | null
    _max: LabOrderMaxAggregateOutputType | null
  }

  type GetLabOrderGroupByPayload<T extends LabOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LabOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabOrderGroupByOutputType[P]>
            : GetScalarType<T[P], LabOrderGroupByOutputType[P]>
        }
      >
    >


  export type LabOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    encounterId?: boolean
    orderNumber?: boolean
    status?: boolean
    priority?: boolean
    clinicalInfo?: boolean
    orderedAt?: boolean
    collectedAt?: boolean
    completedAt?: boolean
    reportUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tests?: boolean | LabOrder$testsArgs<ExtArgs>
    _count?: boolean | LabOrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["labOrder"]>

  export type LabOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    encounterId?: boolean
    orderNumber?: boolean
    status?: boolean
    priority?: boolean
    clinicalInfo?: boolean
    orderedAt?: boolean
    collectedAt?: boolean
    completedAt?: boolean
    reportUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["labOrder"]>

  export type LabOrderSelectScalar = {
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    encounterId?: boolean
    orderNumber?: boolean
    status?: boolean
    priority?: boolean
    clinicalInfo?: boolean
    orderedAt?: boolean
    collectedAt?: boolean
    completedAt?: boolean
    reportUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LabOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tests?: boolean | LabOrder$testsArgs<ExtArgs>
    _count?: boolean | LabOrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LabOrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LabOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LabOrder"
    objects: {
      tests: Prisma.$LabTestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      providerId: string
      encounterId: string | null
      orderNumber: string
      status: $Enums.OrderStatus
      priority: $Enums.OrderPriority
      clinicalInfo: string | null
      orderedAt: Date
      collectedAt: Date | null
      completedAt: Date | null
      reportUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["labOrder"]>
    composites: {}
  }

  type LabOrderGetPayload<S extends boolean | null | undefined | LabOrderDefaultArgs> = $Result.GetResult<Prisma.$LabOrderPayload, S>

  type LabOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LabOrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LabOrderCountAggregateInputType | true
    }

  export interface LabOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LabOrder'], meta: { name: 'LabOrder' } }
    /**
     * Find zero or one LabOrder that matches the filter.
     * @param {LabOrderFindUniqueArgs} args - Arguments to find a LabOrder
     * @example
     * // Get one LabOrder
     * const labOrder = await prisma.labOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LabOrderFindUniqueArgs>(args: SelectSubset<T, LabOrderFindUniqueArgs<ExtArgs>>): Prisma__LabOrderClient<$Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LabOrder that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LabOrderFindUniqueOrThrowArgs} args - Arguments to find a LabOrder
     * @example
     * // Get one LabOrder
     * const labOrder = await prisma.labOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LabOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, LabOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LabOrderClient<$Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LabOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOrderFindFirstArgs} args - Arguments to find a LabOrder
     * @example
     * // Get one LabOrder
     * const labOrder = await prisma.labOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LabOrderFindFirstArgs>(args?: SelectSubset<T, LabOrderFindFirstArgs<ExtArgs>>): Prisma__LabOrderClient<$Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LabOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOrderFindFirstOrThrowArgs} args - Arguments to find a LabOrder
     * @example
     * // Get one LabOrder
     * const labOrder = await prisma.labOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LabOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, LabOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__LabOrderClient<$Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LabOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LabOrders
     * const labOrders = await prisma.labOrder.findMany()
     * 
     * // Get first 10 LabOrders
     * const labOrders = await prisma.labOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const labOrderWithIdOnly = await prisma.labOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LabOrderFindManyArgs>(args?: SelectSubset<T, LabOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LabOrder.
     * @param {LabOrderCreateArgs} args - Arguments to create a LabOrder.
     * @example
     * // Create one LabOrder
     * const LabOrder = await prisma.labOrder.create({
     *   data: {
     *     // ... data to create a LabOrder
     *   }
     * })
     * 
     */
    create<T extends LabOrderCreateArgs>(args: SelectSubset<T, LabOrderCreateArgs<ExtArgs>>): Prisma__LabOrderClient<$Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LabOrders.
     * @param {LabOrderCreateManyArgs} args - Arguments to create many LabOrders.
     * @example
     * // Create many LabOrders
     * const labOrder = await prisma.labOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LabOrderCreateManyArgs>(args?: SelectSubset<T, LabOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LabOrders and returns the data saved in the database.
     * @param {LabOrderCreateManyAndReturnArgs} args - Arguments to create many LabOrders.
     * @example
     * // Create many LabOrders
     * const labOrder = await prisma.labOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LabOrders and only return the `id`
     * const labOrderWithIdOnly = await prisma.labOrder.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LabOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, LabOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a LabOrder.
     * @param {LabOrderDeleteArgs} args - Arguments to delete one LabOrder.
     * @example
     * // Delete one LabOrder
     * const LabOrder = await prisma.labOrder.delete({
     *   where: {
     *     // ... filter to delete one LabOrder
     *   }
     * })
     * 
     */
    delete<T extends LabOrderDeleteArgs>(args: SelectSubset<T, LabOrderDeleteArgs<ExtArgs>>): Prisma__LabOrderClient<$Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LabOrder.
     * @param {LabOrderUpdateArgs} args - Arguments to update one LabOrder.
     * @example
     * // Update one LabOrder
     * const labOrder = await prisma.labOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LabOrderUpdateArgs>(args: SelectSubset<T, LabOrderUpdateArgs<ExtArgs>>): Prisma__LabOrderClient<$Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LabOrders.
     * @param {LabOrderDeleteManyArgs} args - Arguments to filter LabOrders to delete.
     * @example
     * // Delete a few LabOrders
     * const { count } = await prisma.labOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LabOrderDeleteManyArgs>(args?: SelectSubset<T, LabOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LabOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LabOrders
     * const labOrder = await prisma.labOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LabOrderUpdateManyArgs>(args: SelectSubset<T, LabOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LabOrder.
     * @param {LabOrderUpsertArgs} args - Arguments to update or create a LabOrder.
     * @example
     * // Update or create a LabOrder
     * const labOrder = await prisma.labOrder.upsert({
     *   create: {
     *     // ... data to create a LabOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LabOrder we want to update
     *   }
     * })
     */
    upsert<T extends LabOrderUpsertArgs>(args: SelectSubset<T, LabOrderUpsertArgs<ExtArgs>>): Prisma__LabOrderClient<$Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of LabOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOrderCountArgs} args - Arguments to filter LabOrders to count.
     * @example
     * // Count the number of LabOrders
     * const count = await prisma.labOrder.count({
     *   where: {
     *     // ... the filter for the LabOrders we want to count
     *   }
     * })
    **/
    count<T extends LabOrderCountArgs>(
      args?: Subset<T, LabOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LabOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LabOrderAggregateArgs>(args: Subset<T, LabOrderAggregateArgs>): Prisma.PrismaPromise<GetLabOrderAggregateType<T>>

    /**
     * Group by LabOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabOrderGroupByArgs} args - Group by arguments.
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
      T extends LabOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabOrderGroupByArgs['orderBy'] }
        : { orderBy?: LabOrderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LabOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LabOrder model
   */
  readonly fields: LabOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LabOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LabOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tests<T extends LabOrder$testsArgs<ExtArgs> = {}>(args?: Subset<T, LabOrder$testsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the LabOrder model
   */ 
  interface LabOrderFieldRefs {
    readonly id: FieldRef<"LabOrder", 'String'>
    readonly patientId: FieldRef<"LabOrder", 'String'>
    readonly providerId: FieldRef<"LabOrder", 'String'>
    readonly encounterId: FieldRef<"LabOrder", 'String'>
    readonly orderNumber: FieldRef<"LabOrder", 'String'>
    readonly status: FieldRef<"LabOrder", 'OrderStatus'>
    readonly priority: FieldRef<"LabOrder", 'OrderPriority'>
    readonly clinicalInfo: FieldRef<"LabOrder", 'String'>
    readonly orderedAt: FieldRef<"LabOrder", 'DateTime'>
    readonly collectedAt: FieldRef<"LabOrder", 'DateTime'>
    readonly completedAt: FieldRef<"LabOrder", 'DateTime'>
    readonly reportUrl: FieldRef<"LabOrder", 'String'>
    readonly createdAt: FieldRef<"LabOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"LabOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LabOrder findUnique
   */
  export type LabOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrder
     */
    select?: LabOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabOrderInclude<ExtArgs> | null
    /**
     * Filter, which LabOrder to fetch.
     */
    where: LabOrderWhereUniqueInput
  }

  /**
   * LabOrder findUniqueOrThrow
   */
  export type LabOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrder
     */
    select?: LabOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabOrderInclude<ExtArgs> | null
    /**
     * Filter, which LabOrder to fetch.
     */
    where: LabOrderWhereUniqueInput
  }

  /**
   * LabOrder findFirst
   */
  export type LabOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrder
     */
    select?: LabOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabOrderInclude<ExtArgs> | null
    /**
     * Filter, which LabOrder to fetch.
     */
    where?: LabOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabOrders to fetch.
     */
    orderBy?: LabOrderOrderByWithRelationInput | LabOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabOrders.
     */
    cursor?: LabOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabOrders.
     */
    distinct?: LabOrderScalarFieldEnum | LabOrderScalarFieldEnum[]
  }

  /**
   * LabOrder findFirstOrThrow
   */
  export type LabOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrder
     */
    select?: LabOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabOrderInclude<ExtArgs> | null
    /**
     * Filter, which LabOrder to fetch.
     */
    where?: LabOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabOrders to fetch.
     */
    orderBy?: LabOrderOrderByWithRelationInput | LabOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabOrders.
     */
    cursor?: LabOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabOrders.
     */
    distinct?: LabOrderScalarFieldEnum | LabOrderScalarFieldEnum[]
  }

  /**
   * LabOrder findMany
   */
  export type LabOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrder
     */
    select?: LabOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabOrderInclude<ExtArgs> | null
    /**
     * Filter, which LabOrders to fetch.
     */
    where?: LabOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabOrders to fetch.
     */
    orderBy?: LabOrderOrderByWithRelationInput | LabOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LabOrders.
     */
    cursor?: LabOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabOrders.
     */
    skip?: number
    distinct?: LabOrderScalarFieldEnum | LabOrderScalarFieldEnum[]
  }

  /**
   * LabOrder create
   */
  export type LabOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrder
     */
    select?: LabOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a LabOrder.
     */
    data: XOR<LabOrderCreateInput, LabOrderUncheckedCreateInput>
  }

  /**
   * LabOrder createMany
   */
  export type LabOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LabOrders.
     */
    data: LabOrderCreateManyInput | LabOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LabOrder createManyAndReturn
   */
  export type LabOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrder
     */
    select?: LabOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LabOrders.
     */
    data: LabOrderCreateManyInput | LabOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LabOrder update
   */
  export type LabOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrder
     */
    select?: LabOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a LabOrder.
     */
    data: XOR<LabOrderUpdateInput, LabOrderUncheckedUpdateInput>
    /**
     * Choose, which LabOrder to update.
     */
    where: LabOrderWhereUniqueInput
  }

  /**
   * LabOrder updateMany
   */
  export type LabOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LabOrders.
     */
    data: XOR<LabOrderUpdateManyMutationInput, LabOrderUncheckedUpdateManyInput>
    /**
     * Filter which LabOrders to update
     */
    where?: LabOrderWhereInput
  }

  /**
   * LabOrder upsert
   */
  export type LabOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrder
     */
    select?: LabOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the LabOrder to update in case it exists.
     */
    where: LabOrderWhereUniqueInput
    /**
     * In case the LabOrder found by the `where` argument doesn't exist, create a new LabOrder with this data.
     */
    create: XOR<LabOrderCreateInput, LabOrderUncheckedCreateInput>
    /**
     * In case the LabOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LabOrderUpdateInput, LabOrderUncheckedUpdateInput>
  }

  /**
   * LabOrder delete
   */
  export type LabOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrder
     */
    select?: LabOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabOrderInclude<ExtArgs> | null
    /**
     * Filter which LabOrder to delete.
     */
    where: LabOrderWhereUniqueInput
  }

  /**
   * LabOrder deleteMany
   */
  export type LabOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabOrders to delete
     */
    where?: LabOrderWhereInput
  }

  /**
   * LabOrder.tests
   */
  export type LabOrder$testsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestInclude<ExtArgs> | null
    where?: LabTestWhereInput
    orderBy?: LabTestOrderByWithRelationInput | LabTestOrderByWithRelationInput[]
    cursor?: LabTestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LabTestScalarFieldEnum | LabTestScalarFieldEnum[]
  }

  /**
   * LabOrder without action
   */
  export type LabOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabOrder
     */
    select?: LabOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabOrderInclude<ExtArgs> | null
  }


  /**
   * Model LabTest
   */

  export type AggregateLabTest = {
    _count: LabTestCountAggregateOutputType | null
    _min: LabTestMinAggregateOutputType | null
    _max: LabTestMaxAggregateOutputType | null
  }

  export type LabTestMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    testCode: string | null
    testName: string | null
    category: $Enums.TestCategory | null
    status: $Enums.TestStatus | null
    verifiedAt: Date | null
    performedBy: string | null
    performedAt: Date | null
    verifiedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LabTestMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    testCode: string | null
    testName: string | null
    category: $Enums.TestCategory | null
    status: $Enums.TestStatus | null
    verifiedAt: Date | null
    performedBy: string | null
    performedAt: Date | null
    verifiedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LabTestCountAggregateOutputType = {
    id: number
    orderId: number
    testCode: number
    testName: number
    category: number
    status: number
    verifiedAt: number
    performedBy: number
    performedAt: number
    verifiedBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LabTestMinAggregateInputType = {
    id?: true
    orderId?: true
    testCode?: true
    testName?: true
    category?: true
    status?: true
    verifiedAt?: true
    performedBy?: true
    performedAt?: true
    verifiedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LabTestMaxAggregateInputType = {
    id?: true
    orderId?: true
    testCode?: true
    testName?: true
    category?: true
    status?: true
    verifiedAt?: true
    performedBy?: true
    performedAt?: true
    verifiedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LabTestCountAggregateInputType = {
    id?: true
    orderId?: true
    testCode?: true
    testName?: true
    category?: true
    status?: true
    verifiedAt?: true
    performedBy?: true
    performedAt?: true
    verifiedBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LabTestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabTest to aggregate.
     */
    where?: LabTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabTests to fetch.
     */
    orderBy?: LabTestOrderByWithRelationInput | LabTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LabTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LabTests
    **/
    _count?: true | LabTestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabTestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabTestMaxAggregateInputType
  }

  export type GetLabTestAggregateType<T extends LabTestAggregateArgs> = {
        [P in keyof T & keyof AggregateLabTest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabTest[P]>
      : GetScalarType<T[P], AggregateLabTest[P]>
  }




  export type LabTestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabTestWhereInput
    orderBy?: LabTestOrderByWithAggregationInput | LabTestOrderByWithAggregationInput[]
    by: LabTestScalarFieldEnum[] | LabTestScalarFieldEnum
    having?: LabTestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabTestCountAggregateInputType | true
    _min?: LabTestMinAggregateInputType
    _max?: LabTestMaxAggregateInputType
  }

  export type LabTestGroupByOutputType = {
    id: string
    orderId: string
    testCode: string
    testName: string
    category: $Enums.TestCategory
    status: $Enums.TestStatus
    verifiedAt: Date | null
    performedBy: string | null
    performedAt: Date | null
    verifiedBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: LabTestCountAggregateOutputType | null
    _min: LabTestMinAggregateOutputType | null
    _max: LabTestMaxAggregateOutputType | null
  }

  type GetLabTestGroupByPayload<T extends LabTestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LabTestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabTestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabTestGroupByOutputType[P]>
            : GetScalarType<T[P], LabTestGroupByOutputType[P]>
        }
      >
    >


  export type LabTestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    testCode?: boolean
    testName?: boolean
    category?: boolean
    status?: boolean
    verifiedAt?: boolean
    performedBy?: boolean
    performedAt?: boolean
    verifiedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | LabOrderDefaultArgs<ExtArgs>
    results?: boolean | LabTest$resultsArgs<ExtArgs>
    _count?: boolean | LabTestCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["labTest"]>

  export type LabTestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    testCode?: boolean
    testName?: boolean
    category?: boolean
    status?: boolean
    verifiedAt?: boolean
    performedBy?: boolean
    performedAt?: boolean
    verifiedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | LabOrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["labTest"]>

  export type LabTestSelectScalar = {
    id?: boolean
    orderId?: boolean
    testCode?: boolean
    testName?: boolean
    category?: boolean
    status?: boolean
    verifiedAt?: boolean
    performedBy?: boolean
    performedAt?: boolean
    verifiedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LabTestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | LabOrderDefaultArgs<ExtArgs>
    results?: boolean | LabTest$resultsArgs<ExtArgs>
    _count?: boolean | LabTestCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LabTestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | LabOrderDefaultArgs<ExtArgs>
  }

  export type $LabTestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LabTest"
    objects: {
      order: Prisma.$LabOrderPayload<ExtArgs>
      results: Prisma.$LabResultPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      testCode: string
      testName: string
      category: $Enums.TestCategory
      status: $Enums.TestStatus
      verifiedAt: Date | null
      performedBy: string | null
      performedAt: Date | null
      verifiedBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["labTest"]>
    composites: {}
  }

  type LabTestGetPayload<S extends boolean | null | undefined | LabTestDefaultArgs> = $Result.GetResult<Prisma.$LabTestPayload, S>

  type LabTestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LabTestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LabTestCountAggregateInputType | true
    }

  export interface LabTestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LabTest'], meta: { name: 'LabTest' } }
    /**
     * Find zero or one LabTest that matches the filter.
     * @param {LabTestFindUniqueArgs} args - Arguments to find a LabTest
     * @example
     * // Get one LabTest
     * const labTest = await prisma.labTest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LabTestFindUniqueArgs>(args: SelectSubset<T, LabTestFindUniqueArgs<ExtArgs>>): Prisma__LabTestClient<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LabTest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LabTestFindUniqueOrThrowArgs} args - Arguments to find a LabTest
     * @example
     * // Get one LabTest
     * const labTest = await prisma.labTest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LabTestFindUniqueOrThrowArgs>(args: SelectSubset<T, LabTestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LabTestClient<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LabTest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabTestFindFirstArgs} args - Arguments to find a LabTest
     * @example
     * // Get one LabTest
     * const labTest = await prisma.labTest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LabTestFindFirstArgs>(args?: SelectSubset<T, LabTestFindFirstArgs<ExtArgs>>): Prisma__LabTestClient<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LabTest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabTestFindFirstOrThrowArgs} args - Arguments to find a LabTest
     * @example
     * // Get one LabTest
     * const labTest = await prisma.labTest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LabTestFindFirstOrThrowArgs>(args?: SelectSubset<T, LabTestFindFirstOrThrowArgs<ExtArgs>>): Prisma__LabTestClient<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LabTests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabTestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LabTests
     * const labTests = await prisma.labTest.findMany()
     * 
     * // Get first 10 LabTests
     * const labTests = await prisma.labTest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const labTestWithIdOnly = await prisma.labTest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LabTestFindManyArgs>(args?: SelectSubset<T, LabTestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LabTest.
     * @param {LabTestCreateArgs} args - Arguments to create a LabTest.
     * @example
     * // Create one LabTest
     * const LabTest = await prisma.labTest.create({
     *   data: {
     *     // ... data to create a LabTest
     *   }
     * })
     * 
     */
    create<T extends LabTestCreateArgs>(args: SelectSubset<T, LabTestCreateArgs<ExtArgs>>): Prisma__LabTestClient<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LabTests.
     * @param {LabTestCreateManyArgs} args - Arguments to create many LabTests.
     * @example
     * // Create many LabTests
     * const labTest = await prisma.labTest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LabTestCreateManyArgs>(args?: SelectSubset<T, LabTestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LabTests and returns the data saved in the database.
     * @param {LabTestCreateManyAndReturnArgs} args - Arguments to create many LabTests.
     * @example
     * // Create many LabTests
     * const labTest = await prisma.labTest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LabTests and only return the `id`
     * const labTestWithIdOnly = await prisma.labTest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LabTestCreateManyAndReturnArgs>(args?: SelectSubset<T, LabTestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a LabTest.
     * @param {LabTestDeleteArgs} args - Arguments to delete one LabTest.
     * @example
     * // Delete one LabTest
     * const LabTest = await prisma.labTest.delete({
     *   where: {
     *     // ... filter to delete one LabTest
     *   }
     * })
     * 
     */
    delete<T extends LabTestDeleteArgs>(args: SelectSubset<T, LabTestDeleteArgs<ExtArgs>>): Prisma__LabTestClient<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LabTest.
     * @param {LabTestUpdateArgs} args - Arguments to update one LabTest.
     * @example
     * // Update one LabTest
     * const labTest = await prisma.labTest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LabTestUpdateArgs>(args: SelectSubset<T, LabTestUpdateArgs<ExtArgs>>): Prisma__LabTestClient<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LabTests.
     * @param {LabTestDeleteManyArgs} args - Arguments to filter LabTests to delete.
     * @example
     * // Delete a few LabTests
     * const { count } = await prisma.labTest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LabTestDeleteManyArgs>(args?: SelectSubset<T, LabTestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LabTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabTestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LabTests
     * const labTest = await prisma.labTest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LabTestUpdateManyArgs>(args: SelectSubset<T, LabTestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LabTest.
     * @param {LabTestUpsertArgs} args - Arguments to update or create a LabTest.
     * @example
     * // Update or create a LabTest
     * const labTest = await prisma.labTest.upsert({
     *   create: {
     *     // ... data to create a LabTest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LabTest we want to update
     *   }
     * })
     */
    upsert<T extends LabTestUpsertArgs>(args: SelectSubset<T, LabTestUpsertArgs<ExtArgs>>): Prisma__LabTestClient<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of LabTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabTestCountArgs} args - Arguments to filter LabTests to count.
     * @example
     * // Count the number of LabTests
     * const count = await prisma.labTest.count({
     *   where: {
     *     // ... the filter for the LabTests we want to count
     *   }
     * })
    **/
    count<T extends LabTestCountArgs>(
      args?: Subset<T, LabTestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabTestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LabTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabTestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LabTestAggregateArgs>(args: Subset<T, LabTestAggregateArgs>): Prisma.PrismaPromise<GetLabTestAggregateType<T>>

    /**
     * Group by LabTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabTestGroupByArgs} args - Group by arguments.
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
      T extends LabTestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabTestGroupByArgs['orderBy'] }
        : { orderBy?: LabTestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LabTestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabTestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LabTest model
   */
  readonly fields: LabTestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LabTest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LabTestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends LabOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LabOrderDefaultArgs<ExtArgs>>): Prisma__LabOrderClient<$Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    results<T extends LabTest$resultsArgs<ExtArgs> = {}>(args?: Subset<T, LabTest$resultsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the LabTest model
   */ 
  interface LabTestFieldRefs {
    readonly id: FieldRef<"LabTest", 'String'>
    readonly orderId: FieldRef<"LabTest", 'String'>
    readonly testCode: FieldRef<"LabTest", 'String'>
    readonly testName: FieldRef<"LabTest", 'String'>
    readonly category: FieldRef<"LabTest", 'TestCategory'>
    readonly status: FieldRef<"LabTest", 'TestStatus'>
    readonly verifiedAt: FieldRef<"LabTest", 'DateTime'>
    readonly performedBy: FieldRef<"LabTest", 'String'>
    readonly performedAt: FieldRef<"LabTest", 'DateTime'>
    readonly verifiedBy: FieldRef<"LabTest", 'String'>
    readonly createdAt: FieldRef<"LabTest", 'DateTime'>
    readonly updatedAt: FieldRef<"LabTest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LabTest findUnique
   */
  export type LabTestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestInclude<ExtArgs> | null
    /**
     * Filter, which LabTest to fetch.
     */
    where: LabTestWhereUniqueInput
  }

  /**
   * LabTest findUniqueOrThrow
   */
  export type LabTestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestInclude<ExtArgs> | null
    /**
     * Filter, which LabTest to fetch.
     */
    where: LabTestWhereUniqueInput
  }

  /**
   * LabTest findFirst
   */
  export type LabTestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestInclude<ExtArgs> | null
    /**
     * Filter, which LabTest to fetch.
     */
    where?: LabTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabTests to fetch.
     */
    orderBy?: LabTestOrderByWithRelationInput | LabTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabTests.
     */
    cursor?: LabTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabTests.
     */
    distinct?: LabTestScalarFieldEnum | LabTestScalarFieldEnum[]
  }

  /**
   * LabTest findFirstOrThrow
   */
  export type LabTestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestInclude<ExtArgs> | null
    /**
     * Filter, which LabTest to fetch.
     */
    where?: LabTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabTests to fetch.
     */
    orderBy?: LabTestOrderByWithRelationInput | LabTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabTests.
     */
    cursor?: LabTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabTests.
     */
    distinct?: LabTestScalarFieldEnum | LabTestScalarFieldEnum[]
  }

  /**
   * LabTest findMany
   */
  export type LabTestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestInclude<ExtArgs> | null
    /**
     * Filter, which LabTests to fetch.
     */
    where?: LabTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabTests to fetch.
     */
    orderBy?: LabTestOrderByWithRelationInput | LabTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LabTests.
     */
    cursor?: LabTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabTests.
     */
    skip?: number
    distinct?: LabTestScalarFieldEnum | LabTestScalarFieldEnum[]
  }

  /**
   * LabTest create
   */
  export type LabTestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestInclude<ExtArgs> | null
    /**
     * The data needed to create a LabTest.
     */
    data: XOR<LabTestCreateInput, LabTestUncheckedCreateInput>
  }

  /**
   * LabTest createMany
   */
  export type LabTestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LabTests.
     */
    data: LabTestCreateManyInput | LabTestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LabTest createManyAndReturn
   */
  export type LabTestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LabTests.
     */
    data: LabTestCreateManyInput | LabTestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LabTest update
   */
  export type LabTestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestInclude<ExtArgs> | null
    /**
     * The data needed to update a LabTest.
     */
    data: XOR<LabTestUpdateInput, LabTestUncheckedUpdateInput>
    /**
     * Choose, which LabTest to update.
     */
    where: LabTestWhereUniqueInput
  }

  /**
   * LabTest updateMany
   */
  export type LabTestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LabTests.
     */
    data: XOR<LabTestUpdateManyMutationInput, LabTestUncheckedUpdateManyInput>
    /**
     * Filter which LabTests to update
     */
    where?: LabTestWhereInput
  }

  /**
   * LabTest upsert
   */
  export type LabTestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestInclude<ExtArgs> | null
    /**
     * The filter to search for the LabTest to update in case it exists.
     */
    where: LabTestWhereUniqueInput
    /**
     * In case the LabTest found by the `where` argument doesn't exist, create a new LabTest with this data.
     */
    create: XOR<LabTestCreateInput, LabTestUncheckedCreateInput>
    /**
     * In case the LabTest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LabTestUpdateInput, LabTestUncheckedUpdateInput>
  }

  /**
   * LabTest delete
   */
  export type LabTestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestInclude<ExtArgs> | null
    /**
     * Filter which LabTest to delete.
     */
    where: LabTestWhereUniqueInput
  }

  /**
   * LabTest deleteMany
   */
  export type LabTestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabTests to delete
     */
    where?: LabTestWhereInput
  }

  /**
   * LabTest.results
   */
  export type LabTest$resultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultInclude<ExtArgs> | null
    where?: LabResultWhereInput
    orderBy?: LabResultOrderByWithRelationInput | LabResultOrderByWithRelationInput[]
    cursor?: LabResultWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LabResultScalarFieldEnum | LabResultScalarFieldEnum[]
  }

  /**
   * LabTest without action
   */
  export type LabTestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabTest
     */
    select?: LabTestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabTestInclude<ExtArgs> | null
  }


  /**
   * Model LabResult
   */

  export type AggregateLabResult = {
    _count: LabResultCountAggregateOutputType | null
    _avg: LabResultAvgAggregateOutputType | null
    _sum: LabResultSumAggregateOutputType | null
    _min: LabResultMinAggregateOutputType | null
    _max: LabResultMaxAggregateOutputType | null
  }

  export type LabResultAvgAggregateOutputType = {
    numericValue: number | null
  }

  export type LabResultSumAggregateOutputType = {
    numericValue: number | null
  }

  export type LabResultMinAggregateOutputType = {
    id: string | null
    testId: string | null
    componentName: string | null
    componentCode: string | null
    numericValue: number | null
    value: string | null
    unit: string | null
    referenceRange: string | null
    isAbnormal: boolean | null
    isCritical: boolean | null
    abnormalFlag: string | null
    notes: string | null
    interpretation: string | null
    verifiedAt: Date | null
    performedBy: string | null
    performedAt: Date | null
    verifiedBy: string | null
    resultedAt: Date | null
    createdAt: Date | null
  }

  export type LabResultMaxAggregateOutputType = {
    id: string | null
    testId: string | null
    componentName: string | null
    componentCode: string | null
    numericValue: number | null
    value: string | null
    unit: string | null
    referenceRange: string | null
    isAbnormal: boolean | null
    isCritical: boolean | null
    abnormalFlag: string | null
    notes: string | null
    interpretation: string | null
    verifiedAt: Date | null
    performedBy: string | null
    performedAt: Date | null
    verifiedBy: string | null
    resultedAt: Date | null
    createdAt: Date | null
  }

  export type LabResultCountAggregateOutputType = {
    id: number
    testId: number
    componentName: number
    componentCode: number
    numericValue: number
    value: number
    unit: number
    referenceRange: number
    isAbnormal: number
    isCritical: number
    abnormalFlag: number
    notes: number
    interpretation: number
    verifiedAt: number
    performedBy: number
    performedAt: number
    verifiedBy: number
    resultedAt: number
    createdAt: number
    _all: number
  }


  export type LabResultAvgAggregateInputType = {
    numericValue?: true
  }

  export type LabResultSumAggregateInputType = {
    numericValue?: true
  }

  export type LabResultMinAggregateInputType = {
    id?: true
    testId?: true
    componentName?: true
    componentCode?: true
    numericValue?: true
    value?: true
    unit?: true
    referenceRange?: true
    isAbnormal?: true
    isCritical?: true
    abnormalFlag?: true
    notes?: true
    interpretation?: true
    verifiedAt?: true
    performedBy?: true
    performedAt?: true
    verifiedBy?: true
    resultedAt?: true
    createdAt?: true
  }

  export type LabResultMaxAggregateInputType = {
    id?: true
    testId?: true
    componentName?: true
    componentCode?: true
    numericValue?: true
    value?: true
    unit?: true
    referenceRange?: true
    isAbnormal?: true
    isCritical?: true
    abnormalFlag?: true
    notes?: true
    interpretation?: true
    verifiedAt?: true
    performedBy?: true
    performedAt?: true
    verifiedBy?: true
    resultedAt?: true
    createdAt?: true
  }

  export type LabResultCountAggregateInputType = {
    id?: true
    testId?: true
    componentName?: true
    componentCode?: true
    numericValue?: true
    value?: true
    unit?: true
    referenceRange?: true
    isAbnormal?: true
    isCritical?: true
    abnormalFlag?: true
    notes?: true
    interpretation?: true
    verifiedAt?: true
    performedBy?: true
    performedAt?: true
    verifiedBy?: true
    resultedAt?: true
    createdAt?: true
    _all?: true
  }

  export type LabResultAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabResult to aggregate.
     */
    where?: LabResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabResults to fetch.
     */
    orderBy?: LabResultOrderByWithRelationInput | LabResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LabResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LabResults
    **/
    _count?: true | LabResultCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LabResultAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LabResultSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabResultMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabResultMaxAggregateInputType
  }

  export type GetLabResultAggregateType<T extends LabResultAggregateArgs> = {
        [P in keyof T & keyof AggregateLabResult]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabResult[P]>
      : GetScalarType<T[P], AggregateLabResult[P]>
  }




  export type LabResultGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabResultWhereInput
    orderBy?: LabResultOrderByWithAggregationInput | LabResultOrderByWithAggregationInput[]
    by: LabResultScalarFieldEnum[] | LabResultScalarFieldEnum
    having?: LabResultScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabResultCountAggregateInputType | true
    _avg?: LabResultAvgAggregateInputType
    _sum?: LabResultSumAggregateInputType
    _min?: LabResultMinAggregateInputType
    _max?: LabResultMaxAggregateInputType
  }

  export type LabResultGroupByOutputType = {
    id: string
    testId: string
    componentName: string
    componentCode: string | null
    numericValue: number | null
    value: string
    unit: string | null
    referenceRange: string | null
    isAbnormal: boolean
    isCritical: boolean
    abnormalFlag: string | null
    notes: string | null
    interpretation: string | null
    verifiedAt: Date | null
    performedBy: string | null
    performedAt: Date | null
    verifiedBy: string | null
    resultedAt: Date
    createdAt: Date
    _count: LabResultCountAggregateOutputType | null
    _avg: LabResultAvgAggregateOutputType | null
    _sum: LabResultSumAggregateOutputType | null
    _min: LabResultMinAggregateOutputType | null
    _max: LabResultMaxAggregateOutputType | null
  }

  type GetLabResultGroupByPayload<T extends LabResultGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LabResultGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabResultGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabResultGroupByOutputType[P]>
            : GetScalarType<T[P], LabResultGroupByOutputType[P]>
        }
      >
    >


  export type LabResultSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    testId?: boolean
    componentName?: boolean
    componentCode?: boolean
    numericValue?: boolean
    value?: boolean
    unit?: boolean
    referenceRange?: boolean
    isAbnormal?: boolean
    isCritical?: boolean
    abnormalFlag?: boolean
    notes?: boolean
    interpretation?: boolean
    verifiedAt?: boolean
    performedBy?: boolean
    performedAt?: boolean
    verifiedBy?: boolean
    resultedAt?: boolean
    createdAt?: boolean
    test?: boolean | LabTestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["labResult"]>

  export type LabResultSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    testId?: boolean
    componentName?: boolean
    componentCode?: boolean
    numericValue?: boolean
    value?: boolean
    unit?: boolean
    referenceRange?: boolean
    isAbnormal?: boolean
    isCritical?: boolean
    abnormalFlag?: boolean
    notes?: boolean
    interpretation?: boolean
    verifiedAt?: boolean
    performedBy?: boolean
    performedAt?: boolean
    verifiedBy?: boolean
    resultedAt?: boolean
    createdAt?: boolean
    test?: boolean | LabTestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["labResult"]>

  export type LabResultSelectScalar = {
    id?: boolean
    testId?: boolean
    componentName?: boolean
    componentCode?: boolean
    numericValue?: boolean
    value?: boolean
    unit?: boolean
    referenceRange?: boolean
    isAbnormal?: boolean
    isCritical?: boolean
    abnormalFlag?: boolean
    notes?: boolean
    interpretation?: boolean
    verifiedAt?: boolean
    performedBy?: boolean
    performedAt?: boolean
    verifiedBy?: boolean
    resultedAt?: boolean
    createdAt?: boolean
  }

  export type LabResultInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | LabTestDefaultArgs<ExtArgs>
  }
  export type LabResultIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | LabTestDefaultArgs<ExtArgs>
  }

  export type $LabResultPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LabResult"
    objects: {
      test: Prisma.$LabTestPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      testId: string
      componentName: string
      componentCode: string | null
      numericValue: number | null
      value: string
      unit: string | null
      referenceRange: string | null
      isAbnormal: boolean
      isCritical: boolean
      abnormalFlag: string | null
      notes: string | null
      interpretation: string | null
      verifiedAt: Date | null
      performedBy: string | null
      performedAt: Date | null
      verifiedBy: string | null
      resultedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["labResult"]>
    composites: {}
  }

  type LabResultGetPayload<S extends boolean | null | undefined | LabResultDefaultArgs> = $Result.GetResult<Prisma.$LabResultPayload, S>

  type LabResultCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LabResultFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LabResultCountAggregateInputType | true
    }

  export interface LabResultDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LabResult'], meta: { name: 'LabResult' } }
    /**
     * Find zero or one LabResult that matches the filter.
     * @param {LabResultFindUniqueArgs} args - Arguments to find a LabResult
     * @example
     * // Get one LabResult
     * const labResult = await prisma.labResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LabResultFindUniqueArgs>(args: SelectSubset<T, LabResultFindUniqueArgs<ExtArgs>>): Prisma__LabResultClient<$Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LabResult that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LabResultFindUniqueOrThrowArgs} args - Arguments to find a LabResult
     * @example
     * // Get one LabResult
     * const labResult = await prisma.labResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LabResultFindUniqueOrThrowArgs>(args: SelectSubset<T, LabResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LabResultClient<$Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LabResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabResultFindFirstArgs} args - Arguments to find a LabResult
     * @example
     * // Get one LabResult
     * const labResult = await prisma.labResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LabResultFindFirstArgs>(args?: SelectSubset<T, LabResultFindFirstArgs<ExtArgs>>): Prisma__LabResultClient<$Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LabResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabResultFindFirstOrThrowArgs} args - Arguments to find a LabResult
     * @example
     * // Get one LabResult
     * const labResult = await prisma.labResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LabResultFindFirstOrThrowArgs>(args?: SelectSubset<T, LabResultFindFirstOrThrowArgs<ExtArgs>>): Prisma__LabResultClient<$Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LabResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LabResults
     * const labResults = await prisma.labResult.findMany()
     * 
     * // Get first 10 LabResults
     * const labResults = await prisma.labResult.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const labResultWithIdOnly = await prisma.labResult.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LabResultFindManyArgs>(args?: SelectSubset<T, LabResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LabResult.
     * @param {LabResultCreateArgs} args - Arguments to create a LabResult.
     * @example
     * // Create one LabResult
     * const LabResult = await prisma.labResult.create({
     *   data: {
     *     // ... data to create a LabResult
     *   }
     * })
     * 
     */
    create<T extends LabResultCreateArgs>(args: SelectSubset<T, LabResultCreateArgs<ExtArgs>>): Prisma__LabResultClient<$Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LabResults.
     * @param {LabResultCreateManyArgs} args - Arguments to create many LabResults.
     * @example
     * // Create many LabResults
     * const labResult = await prisma.labResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LabResultCreateManyArgs>(args?: SelectSubset<T, LabResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LabResults and returns the data saved in the database.
     * @param {LabResultCreateManyAndReturnArgs} args - Arguments to create many LabResults.
     * @example
     * // Create many LabResults
     * const labResult = await prisma.labResult.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LabResults and only return the `id`
     * const labResultWithIdOnly = await prisma.labResult.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LabResultCreateManyAndReturnArgs>(args?: SelectSubset<T, LabResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a LabResult.
     * @param {LabResultDeleteArgs} args - Arguments to delete one LabResult.
     * @example
     * // Delete one LabResult
     * const LabResult = await prisma.labResult.delete({
     *   where: {
     *     // ... filter to delete one LabResult
     *   }
     * })
     * 
     */
    delete<T extends LabResultDeleteArgs>(args: SelectSubset<T, LabResultDeleteArgs<ExtArgs>>): Prisma__LabResultClient<$Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LabResult.
     * @param {LabResultUpdateArgs} args - Arguments to update one LabResult.
     * @example
     * // Update one LabResult
     * const labResult = await prisma.labResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LabResultUpdateArgs>(args: SelectSubset<T, LabResultUpdateArgs<ExtArgs>>): Prisma__LabResultClient<$Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LabResults.
     * @param {LabResultDeleteManyArgs} args - Arguments to filter LabResults to delete.
     * @example
     * // Delete a few LabResults
     * const { count } = await prisma.labResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LabResultDeleteManyArgs>(args?: SelectSubset<T, LabResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LabResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LabResults
     * const labResult = await prisma.labResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LabResultUpdateManyArgs>(args: SelectSubset<T, LabResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LabResult.
     * @param {LabResultUpsertArgs} args - Arguments to update or create a LabResult.
     * @example
     * // Update or create a LabResult
     * const labResult = await prisma.labResult.upsert({
     *   create: {
     *     // ... data to create a LabResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LabResult we want to update
     *   }
     * })
     */
    upsert<T extends LabResultUpsertArgs>(args: SelectSubset<T, LabResultUpsertArgs<ExtArgs>>): Prisma__LabResultClient<$Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of LabResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabResultCountArgs} args - Arguments to filter LabResults to count.
     * @example
     * // Count the number of LabResults
     * const count = await prisma.labResult.count({
     *   where: {
     *     // ... the filter for the LabResults we want to count
     *   }
     * })
    **/
    count<T extends LabResultCountArgs>(
      args?: Subset<T, LabResultCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabResultCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LabResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LabResultAggregateArgs>(args: Subset<T, LabResultAggregateArgs>): Prisma.PrismaPromise<GetLabResultAggregateType<T>>

    /**
     * Group by LabResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabResultGroupByArgs} args - Group by arguments.
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
      T extends LabResultGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabResultGroupByArgs['orderBy'] }
        : { orderBy?: LabResultGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LabResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LabResult model
   */
  readonly fields: LabResultFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LabResult.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LabResultClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    test<T extends LabTestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LabTestDefaultArgs<ExtArgs>>): Prisma__LabTestClient<$Result.GetResult<Prisma.$LabTestPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the LabResult model
   */ 
  interface LabResultFieldRefs {
    readonly id: FieldRef<"LabResult", 'String'>
    readonly testId: FieldRef<"LabResult", 'String'>
    readonly componentName: FieldRef<"LabResult", 'String'>
    readonly componentCode: FieldRef<"LabResult", 'String'>
    readonly numericValue: FieldRef<"LabResult", 'Float'>
    readonly value: FieldRef<"LabResult", 'String'>
    readonly unit: FieldRef<"LabResult", 'String'>
    readonly referenceRange: FieldRef<"LabResult", 'String'>
    readonly isAbnormal: FieldRef<"LabResult", 'Boolean'>
    readonly isCritical: FieldRef<"LabResult", 'Boolean'>
    readonly abnormalFlag: FieldRef<"LabResult", 'String'>
    readonly notes: FieldRef<"LabResult", 'String'>
    readonly interpretation: FieldRef<"LabResult", 'String'>
    readonly verifiedAt: FieldRef<"LabResult", 'DateTime'>
    readonly performedBy: FieldRef<"LabResult", 'String'>
    readonly performedAt: FieldRef<"LabResult", 'DateTime'>
    readonly verifiedBy: FieldRef<"LabResult", 'String'>
    readonly resultedAt: FieldRef<"LabResult", 'DateTime'>
    readonly createdAt: FieldRef<"LabResult", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LabResult findUnique
   */
  export type LabResultFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultInclude<ExtArgs> | null
    /**
     * Filter, which LabResult to fetch.
     */
    where: LabResultWhereUniqueInput
  }

  /**
   * LabResult findUniqueOrThrow
   */
  export type LabResultFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultInclude<ExtArgs> | null
    /**
     * Filter, which LabResult to fetch.
     */
    where: LabResultWhereUniqueInput
  }

  /**
   * LabResult findFirst
   */
  export type LabResultFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultInclude<ExtArgs> | null
    /**
     * Filter, which LabResult to fetch.
     */
    where?: LabResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabResults to fetch.
     */
    orderBy?: LabResultOrderByWithRelationInput | LabResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabResults.
     */
    cursor?: LabResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabResults.
     */
    distinct?: LabResultScalarFieldEnum | LabResultScalarFieldEnum[]
  }

  /**
   * LabResult findFirstOrThrow
   */
  export type LabResultFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultInclude<ExtArgs> | null
    /**
     * Filter, which LabResult to fetch.
     */
    where?: LabResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabResults to fetch.
     */
    orderBy?: LabResultOrderByWithRelationInput | LabResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabResults.
     */
    cursor?: LabResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabResults.
     */
    distinct?: LabResultScalarFieldEnum | LabResultScalarFieldEnum[]
  }

  /**
   * LabResult findMany
   */
  export type LabResultFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultInclude<ExtArgs> | null
    /**
     * Filter, which LabResults to fetch.
     */
    where?: LabResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabResults to fetch.
     */
    orderBy?: LabResultOrderByWithRelationInput | LabResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LabResults.
     */
    cursor?: LabResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabResults.
     */
    skip?: number
    distinct?: LabResultScalarFieldEnum | LabResultScalarFieldEnum[]
  }

  /**
   * LabResult create
   */
  export type LabResultCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultInclude<ExtArgs> | null
    /**
     * The data needed to create a LabResult.
     */
    data: XOR<LabResultCreateInput, LabResultUncheckedCreateInput>
  }

  /**
   * LabResult createMany
   */
  export type LabResultCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LabResults.
     */
    data: LabResultCreateManyInput | LabResultCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LabResult createManyAndReturn
   */
  export type LabResultCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LabResults.
     */
    data: LabResultCreateManyInput | LabResultCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LabResult update
   */
  export type LabResultUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultInclude<ExtArgs> | null
    /**
     * The data needed to update a LabResult.
     */
    data: XOR<LabResultUpdateInput, LabResultUncheckedUpdateInput>
    /**
     * Choose, which LabResult to update.
     */
    where: LabResultWhereUniqueInput
  }

  /**
   * LabResult updateMany
   */
  export type LabResultUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LabResults.
     */
    data: XOR<LabResultUpdateManyMutationInput, LabResultUncheckedUpdateManyInput>
    /**
     * Filter which LabResults to update
     */
    where?: LabResultWhereInput
  }

  /**
   * LabResult upsert
   */
  export type LabResultUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultInclude<ExtArgs> | null
    /**
     * The filter to search for the LabResult to update in case it exists.
     */
    where: LabResultWhereUniqueInput
    /**
     * In case the LabResult found by the `where` argument doesn't exist, create a new LabResult with this data.
     */
    create: XOR<LabResultCreateInput, LabResultUncheckedCreateInput>
    /**
     * In case the LabResult was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LabResultUpdateInput, LabResultUncheckedUpdateInput>
  }

  /**
   * LabResult delete
   */
  export type LabResultDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultInclude<ExtArgs> | null
    /**
     * Filter which LabResult to delete.
     */
    where: LabResultWhereUniqueInput
  }

  /**
   * LabResult deleteMany
   */
  export type LabResultDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabResults to delete
     */
    where?: LabResultWhereInput
  }

  /**
   * LabResult without action
   */
  export type LabResultDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabResult
     */
    select?: LabResultSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabResultInclude<ExtArgs> | null
  }


  /**
   * Model DiagnosticTest
   */

  export type AggregateDiagnosticTest = {
    _count: DiagnosticTestCountAggregateOutputType | null
    _avg: DiagnosticTestAvgAggregateOutputType | null
    _sum: DiagnosticTestSumAggregateOutputType | null
    _min: DiagnosticTestMinAggregateOutputType | null
    _max: DiagnosticTestMaxAggregateOutputType | null
  }

  export type DiagnosticTestAvgAggregateOutputType = {
    price: Decimal | null
  }

  export type DiagnosticTestSumAggregateOutputType = {
    price: Decimal | null
  }

  export type DiagnosticTestMinAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    category: $Enums.TestCategory | null
    description: string | null
    preparation: string | null
    sampleType: string | null
    turnaroundTime: string | null
    price: Decimal | null
    currency: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DiagnosticTestMaxAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    category: $Enums.TestCategory | null
    description: string | null
    preparation: string | null
    sampleType: string | null
    turnaroundTime: string | null
    price: Decimal | null
    currency: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DiagnosticTestCountAggregateOutputType = {
    id: number
    name: number
    code: number
    category: number
    description: number
    preparation: number
    sampleType: number
    turnaroundTime: number
    price: number
    currency: number
    referenceRanges: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DiagnosticTestAvgAggregateInputType = {
    price?: true
  }

  export type DiagnosticTestSumAggregateInputType = {
    price?: true
  }

  export type DiagnosticTestMinAggregateInputType = {
    id?: true
    name?: true
    code?: true
    category?: true
    description?: true
    preparation?: true
    sampleType?: true
    turnaroundTime?: true
    price?: true
    currency?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DiagnosticTestMaxAggregateInputType = {
    id?: true
    name?: true
    code?: true
    category?: true
    description?: true
    preparation?: true
    sampleType?: true
    turnaroundTime?: true
    price?: true
    currency?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DiagnosticTestCountAggregateInputType = {
    id?: true
    name?: true
    code?: true
    category?: true
    description?: true
    preparation?: true
    sampleType?: true
    turnaroundTime?: true
    price?: true
    currency?: true
    referenceRanges?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DiagnosticTestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiagnosticTest to aggregate.
     */
    where?: DiagnosticTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosticTests to fetch.
     */
    orderBy?: DiagnosticTestOrderByWithRelationInput | DiagnosticTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiagnosticTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosticTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosticTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DiagnosticTests
    **/
    _count?: true | DiagnosticTestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DiagnosticTestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DiagnosticTestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiagnosticTestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiagnosticTestMaxAggregateInputType
  }

  export type GetDiagnosticTestAggregateType<T extends DiagnosticTestAggregateArgs> = {
        [P in keyof T & keyof AggregateDiagnosticTest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiagnosticTest[P]>
      : GetScalarType<T[P], AggregateDiagnosticTest[P]>
  }




  export type DiagnosticTestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiagnosticTestWhereInput
    orderBy?: DiagnosticTestOrderByWithAggregationInput | DiagnosticTestOrderByWithAggregationInput[]
    by: DiagnosticTestScalarFieldEnum[] | DiagnosticTestScalarFieldEnum
    having?: DiagnosticTestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiagnosticTestCountAggregateInputType | true
    _avg?: DiagnosticTestAvgAggregateInputType
    _sum?: DiagnosticTestSumAggregateInputType
    _min?: DiagnosticTestMinAggregateInputType
    _max?: DiagnosticTestMaxAggregateInputType
  }

  export type DiagnosticTestGroupByOutputType = {
    id: string
    name: string
    code: string
    category: $Enums.TestCategory
    description: string | null
    preparation: string | null
    sampleType: string | null
    turnaroundTime: string | null
    price: Decimal
    currency: string
    referenceRanges: JsonValue | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: DiagnosticTestCountAggregateOutputType | null
    _avg: DiagnosticTestAvgAggregateOutputType | null
    _sum: DiagnosticTestSumAggregateOutputType | null
    _min: DiagnosticTestMinAggregateOutputType | null
    _max: DiagnosticTestMaxAggregateOutputType | null
  }

  type GetDiagnosticTestGroupByPayload<T extends DiagnosticTestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiagnosticTestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiagnosticTestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiagnosticTestGroupByOutputType[P]>
            : GetScalarType<T[P], DiagnosticTestGroupByOutputType[P]>
        }
      >
    >


  export type DiagnosticTestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    category?: boolean
    description?: boolean
    preparation?: boolean
    sampleType?: boolean
    turnaroundTime?: boolean
    price?: boolean
    currency?: boolean
    referenceRanges?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["diagnosticTest"]>

  export type DiagnosticTestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    category?: boolean
    description?: boolean
    preparation?: boolean
    sampleType?: boolean
    turnaroundTime?: boolean
    price?: boolean
    currency?: boolean
    referenceRanges?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["diagnosticTest"]>

  export type DiagnosticTestSelectScalar = {
    id?: boolean
    name?: boolean
    code?: boolean
    category?: boolean
    description?: boolean
    preparation?: boolean
    sampleType?: boolean
    turnaroundTime?: boolean
    price?: boolean
    currency?: boolean
    referenceRanges?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $DiagnosticTestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DiagnosticTest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      code: string
      category: $Enums.TestCategory
      description: string | null
      preparation: string | null
      sampleType: string | null
      turnaroundTime: string | null
      price: Prisma.Decimal
      currency: string
      referenceRanges: Prisma.JsonValue | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["diagnosticTest"]>
    composites: {}
  }

  type DiagnosticTestGetPayload<S extends boolean | null | undefined | DiagnosticTestDefaultArgs> = $Result.GetResult<Prisma.$DiagnosticTestPayload, S>

  type DiagnosticTestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DiagnosticTestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DiagnosticTestCountAggregateInputType | true
    }

  export interface DiagnosticTestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DiagnosticTest'], meta: { name: 'DiagnosticTest' } }
    /**
     * Find zero or one DiagnosticTest that matches the filter.
     * @param {DiagnosticTestFindUniqueArgs} args - Arguments to find a DiagnosticTest
     * @example
     * // Get one DiagnosticTest
     * const diagnosticTest = await prisma.diagnosticTest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiagnosticTestFindUniqueArgs>(args: SelectSubset<T, DiagnosticTestFindUniqueArgs<ExtArgs>>): Prisma__DiagnosticTestClient<$Result.GetResult<Prisma.$DiagnosticTestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DiagnosticTest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DiagnosticTestFindUniqueOrThrowArgs} args - Arguments to find a DiagnosticTest
     * @example
     * // Get one DiagnosticTest
     * const diagnosticTest = await prisma.diagnosticTest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiagnosticTestFindUniqueOrThrowArgs>(args: SelectSubset<T, DiagnosticTestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiagnosticTestClient<$Result.GetResult<Prisma.$DiagnosticTestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DiagnosticTest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticTestFindFirstArgs} args - Arguments to find a DiagnosticTest
     * @example
     * // Get one DiagnosticTest
     * const diagnosticTest = await prisma.diagnosticTest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiagnosticTestFindFirstArgs>(args?: SelectSubset<T, DiagnosticTestFindFirstArgs<ExtArgs>>): Prisma__DiagnosticTestClient<$Result.GetResult<Prisma.$DiagnosticTestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DiagnosticTest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticTestFindFirstOrThrowArgs} args - Arguments to find a DiagnosticTest
     * @example
     * // Get one DiagnosticTest
     * const diagnosticTest = await prisma.diagnosticTest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiagnosticTestFindFirstOrThrowArgs>(args?: SelectSubset<T, DiagnosticTestFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiagnosticTestClient<$Result.GetResult<Prisma.$DiagnosticTestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DiagnosticTests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticTestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DiagnosticTests
     * const diagnosticTests = await prisma.diagnosticTest.findMany()
     * 
     * // Get first 10 DiagnosticTests
     * const diagnosticTests = await prisma.diagnosticTest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const diagnosticTestWithIdOnly = await prisma.diagnosticTest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiagnosticTestFindManyArgs>(args?: SelectSubset<T, DiagnosticTestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosticTestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DiagnosticTest.
     * @param {DiagnosticTestCreateArgs} args - Arguments to create a DiagnosticTest.
     * @example
     * // Create one DiagnosticTest
     * const DiagnosticTest = await prisma.diagnosticTest.create({
     *   data: {
     *     // ... data to create a DiagnosticTest
     *   }
     * })
     * 
     */
    create<T extends DiagnosticTestCreateArgs>(args: SelectSubset<T, DiagnosticTestCreateArgs<ExtArgs>>): Prisma__DiagnosticTestClient<$Result.GetResult<Prisma.$DiagnosticTestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DiagnosticTests.
     * @param {DiagnosticTestCreateManyArgs} args - Arguments to create many DiagnosticTests.
     * @example
     * // Create many DiagnosticTests
     * const diagnosticTest = await prisma.diagnosticTest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiagnosticTestCreateManyArgs>(args?: SelectSubset<T, DiagnosticTestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DiagnosticTests and returns the data saved in the database.
     * @param {DiagnosticTestCreateManyAndReturnArgs} args - Arguments to create many DiagnosticTests.
     * @example
     * // Create many DiagnosticTests
     * const diagnosticTest = await prisma.diagnosticTest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DiagnosticTests and only return the `id`
     * const diagnosticTestWithIdOnly = await prisma.diagnosticTest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DiagnosticTestCreateManyAndReturnArgs>(args?: SelectSubset<T, DiagnosticTestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosticTestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DiagnosticTest.
     * @param {DiagnosticTestDeleteArgs} args - Arguments to delete one DiagnosticTest.
     * @example
     * // Delete one DiagnosticTest
     * const DiagnosticTest = await prisma.diagnosticTest.delete({
     *   where: {
     *     // ... filter to delete one DiagnosticTest
     *   }
     * })
     * 
     */
    delete<T extends DiagnosticTestDeleteArgs>(args: SelectSubset<T, DiagnosticTestDeleteArgs<ExtArgs>>): Prisma__DiagnosticTestClient<$Result.GetResult<Prisma.$DiagnosticTestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DiagnosticTest.
     * @param {DiagnosticTestUpdateArgs} args - Arguments to update one DiagnosticTest.
     * @example
     * // Update one DiagnosticTest
     * const diagnosticTest = await prisma.diagnosticTest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiagnosticTestUpdateArgs>(args: SelectSubset<T, DiagnosticTestUpdateArgs<ExtArgs>>): Prisma__DiagnosticTestClient<$Result.GetResult<Prisma.$DiagnosticTestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DiagnosticTests.
     * @param {DiagnosticTestDeleteManyArgs} args - Arguments to filter DiagnosticTests to delete.
     * @example
     * // Delete a few DiagnosticTests
     * const { count } = await prisma.diagnosticTest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiagnosticTestDeleteManyArgs>(args?: SelectSubset<T, DiagnosticTestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiagnosticTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticTestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DiagnosticTests
     * const diagnosticTest = await prisma.diagnosticTest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiagnosticTestUpdateManyArgs>(args: SelectSubset<T, DiagnosticTestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DiagnosticTest.
     * @param {DiagnosticTestUpsertArgs} args - Arguments to update or create a DiagnosticTest.
     * @example
     * // Update or create a DiagnosticTest
     * const diagnosticTest = await prisma.diagnosticTest.upsert({
     *   create: {
     *     // ... data to create a DiagnosticTest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DiagnosticTest we want to update
     *   }
     * })
     */
    upsert<T extends DiagnosticTestUpsertArgs>(args: SelectSubset<T, DiagnosticTestUpsertArgs<ExtArgs>>): Prisma__DiagnosticTestClient<$Result.GetResult<Prisma.$DiagnosticTestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DiagnosticTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticTestCountArgs} args - Arguments to filter DiagnosticTests to count.
     * @example
     * // Count the number of DiagnosticTests
     * const count = await prisma.diagnosticTest.count({
     *   where: {
     *     // ... the filter for the DiagnosticTests we want to count
     *   }
     * })
    **/
    count<T extends DiagnosticTestCountArgs>(
      args?: Subset<T, DiagnosticTestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiagnosticTestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DiagnosticTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticTestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DiagnosticTestAggregateArgs>(args: Subset<T, DiagnosticTestAggregateArgs>): Prisma.PrismaPromise<GetDiagnosticTestAggregateType<T>>

    /**
     * Group by DiagnosticTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticTestGroupByArgs} args - Group by arguments.
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
      T extends DiagnosticTestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiagnosticTestGroupByArgs['orderBy'] }
        : { orderBy?: DiagnosticTestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DiagnosticTestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiagnosticTestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DiagnosticTest model
   */
  readonly fields: DiagnosticTestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DiagnosticTest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiagnosticTestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the DiagnosticTest model
   */ 
  interface DiagnosticTestFieldRefs {
    readonly id: FieldRef<"DiagnosticTest", 'String'>
    readonly name: FieldRef<"DiagnosticTest", 'String'>
    readonly code: FieldRef<"DiagnosticTest", 'String'>
    readonly category: FieldRef<"DiagnosticTest", 'TestCategory'>
    readonly description: FieldRef<"DiagnosticTest", 'String'>
    readonly preparation: FieldRef<"DiagnosticTest", 'String'>
    readonly sampleType: FieldRef<"DiagnosticTest", 'String'>
    readonly turnaroundTime: FieldRef<"DiagnosticTest", 'String'>
    readonly price: FieldRef<"DiagnosticTest", 'Decimal'>
    readonly currency: FieldRef<"DiagnosticTest", 'String'>
    readonly referenceRanges: FieldRef<"DiagnosticTest", 'Json'>
    readonly isActive: FieldRef<"DiagnosticTest", 'Boolean'>
    readonly createdAt: FieldRef<"DiagnosticTest", 'DateTime'>
    readonly updatedAt: FieldRef<"DiagnosticTest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DiagnosticTest findUnique
   */
  export type DiagnosticTestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticTest
     */
    select?: DiagnosticTestSelect<ExtArgs> | null
    /**
     * Filter, which DiagnosticTest to fetch.
     */
    where: DiagnosticTestWhereUniqueInput
  }

  /**
   * DiagnosticTest findUniqueOrThrow
   */
  export type DiagnosticTestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticTest
     */
    select?: DiagnosticTestSelect<ExtArgs> | null
    /**
     * Filter, which DiagnosticTest to fetch.
     */
    where: DiagnosticTestWhereUniqueInput
  }

  /**
   * DiagnosticTest findFirst
   */
  export type DiagnosticTestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticTest
     */
    select?: DiagnosticTestSelect<ExtArgs> | null
    /**
     * Filter, which DiagnosticTest to fetch.
     */
    where?: DiagnosticTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosticTests to fetch.
     */
    orderBy?: DiagnosticTestOrderByWithRelationInput | DiagnosticTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiagnosticTests.
     */
    cursor?: DiagnosticTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosticTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosticTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiagnosticTests.
     */
    distinct?: DiagnosticTestScalarFieldEnum | DiagnosticTestScalarFieldEnum[]
  }

  /**
   * DiagnosticTest findFirstOrThrow
   */
  export type DiagnosticTestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticTest
     */
    select?: DiagnosticTestSelect<ExtArgs> | null
    /**
     * Filter, which DiagnosticTest to fetch.
     */
    where?: DiagnosticTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosticTests to fetch.
     */
    orderBy?: DiagnosticTestOrderByWithRelationInput | DiagnosticTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiagnosticTests.
     */
    cursor?: DiagnosticTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosticTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosticTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiagnosticTests.
     */
    distinct?: DiagnosticTestScalarFieldEnum | DiagnosticTestScalarFieldEnum[]
  }

  /**
   * DiagnosticTest findMany
   */
  export type DiagnosticTestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticTest
     */
    select?: DiagnosticTestSelect<ExtArgs> | null
    /**
     * Filter, which DiagnosticTests to fetch.
     */
    where?: DiagnosticTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosticTests to fetch.
     */
    orderBy?: DiagnosticTestOrderByWithRelationInput | DiagnosticTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DiagnosticTests.
     */
    cursor?: DiagnosticTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosticTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosticTests.
     */
    skip?: number
    distinct?: DiagnosticTestScalarFieldEnum | DiagnosticTestScalarFieldEnum[]
  }

  /**
   * DiagnosticTest create
   */
  export type DiagnosticTestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticTest
     */
    select?: DiagnosticTestSelect<ExtArgs> | null
    /**
     * The data needed to create a DiagnosticTest.
     */
    data: XOR<DiagnosticTestCreateInput, DiagnosticTestUncheckedCreateInput>
  }

  /**
   * DiagnosticTest createMany
   */
  export type DiagnosticTestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DiagnosticTests.
     */
    data: DiagnosticTestCreateManyInput | DiagnosticTestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiagnosticTest createManyAndReturn
   */
  export type DiagnosticTestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticTest
     */
    select?: DiagnosticTestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DiagnosticTests.
     */
    data: DiagnosticTestCreateManyInput | DiagnosticTestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiagnosticTest update
   */
  export type DiagnosticTestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticTest
     */
    select?: DiagnosticTestSelect<ExtArgs> | null
    /**
     * The data needed to update a DiagnosticTest.
     */
    data: XOR<DiagnosticTestUpdateInput, DiagnosticTestUncheckedUpdateInput>
    /**
     * Choose, which DiagnosticTest to update.
     */
    where: DiagnosticTestWhereUniqueInput
  }

  /**
   * DiagnosticTest updateMany
   */
  export type DiagnosticTestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DiagnosticTests.
     */
    data: XOR<DiagnosticTestUpdateManyMutationInput, DiagnosticTestUncheckedUpdateManyInput>
    /**
     * Filter which DiagnosticTests to update
     */
    where?: DiagnosticTestWhereInput
  }

  /**
   * DiagnosticTest upsert
   */
  export type DiagnosticTestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticTest
     */
    select?: DiagnosticTestSelect<ExtArgs> | null
    /**
     * The filter to search for the DiagnosticTest to update in case it exists.
     */
    where: DiagnosticTestWhereUniqueInput
    /**
     * In case the DiagnosticTest found by the `where` argument doesn't exist, create a new DiagnosticTest with this data.
     */
    create: XOR<DiagnosticTestCreateInput, DiagnosticTestUncheckedCreateInput>
    /**
     * In case the DiagnosticTest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiagnosticTestUpdateInput, DiagnosticTestUncheckedUpdateInput>
  }

  /**
   * DiagnosticTest delete
   */
  export type DiagnosticTestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticTest
     */
    select?: DiagnosticTestSelect<ExtArgs> | null
    /**
     * Filter which DiagnosticTest to delete.
     */
    where: DiagnosticTestWhereUniqueInput
  }

  /**
   * DiagnosticTest deleteMany
   */
  export type DiagnosticTestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiagnosticTests to delete
     */
    where?: DiagnosticTestWhereInput
  }

  /**
   * DiagnosticTest without action
   */
  export type DiagnosticTestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticTest
     */
    select?: DiagnosticTestSelect<ExtArgs> | null
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


  export const LabOrderScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    providerId: 'providerId',
    encounterId: 'encounterId',
    orderNumber: 'orderNumber',
    status: 'status',
    priority: 'priority',
    clinicalInfo: 'clinicalInfo',
    orderedAt: 'orderedAt',
    collectedAt: 'collectedAt',
    completedAt: 'completedAt',
    reportUrl: 'reportUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LabOrderScalarFieldEnum = (typeof LabOrderScalarFieldEnum)[keyof typeof LabOrderScalarFieldEnum]


  export const LabTestScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    testCode: 'testCode',
    testName: 'testName',
    category: 'category',
    status: 'status',
    verifiedAt: 'verifiedAt',
    performedBy: 'performedBy',
    performedAt: 'performedAt',
    verifiedBy: 'verifiedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LabTestScalarFieldEnum = (typeof LabTestScalarFieldEnum)[keyof typeof LabTestScalarFieldEnum]


  export const LabResultScalarFieldEnum: {
    id: 'id',
    testId: 'testId',
    componentName: 'componentName',
    componentCode: 'componentCode',
    numericValue: 'numericValue',
    value: 'value',
    unit: 'unit',
    referenceRange: 'referenceRange',
    isAbnormal: 'isAbnormal',
    isCritical: 'isCritical',
    abnormalFlag: 'abnormalFlag',
    notes: 'notes',
    interpretation: 'interpretation',
    verifiedAt: 'verifiedAt',
    performedBy: 'performedBy',
    performedAt: 'performedAt',
    verifiedBy: 'verifiedBy',
    resultedAt: 'resultedAt',
    createdAt: 'createdAt'
  };

  export type LabResultScalarFieldEnum = (typeof LabResultScalarFieldEnum)[keyof typeof LabResultScalarFieldEnum]


  export const DiagnosticTestScalarFieldEnum: {
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
    referenceRanges: 'referenceRanges',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DiagnosticTestScalarFieldEnum = (typeof DiagnosticTestScalarFieldEnum)[keyof typeof DiagnosticTestScalarFieldEnum]


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
   * Reference to a field of type 'OrderStatus'
   */
  export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus'>
    


  /**
   * Reference to a field of type 'OrderStatus[]'
   */
  export type ListEnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus[]'>
    


  /**
   * Reference to a field of type 'OrderPriority'
   */
  export type EnumOrderPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderPriority'>
    


  /**
   * Reference to a field of type 'OrderPriority[]'
   */
  export type ListEnumOrderPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderPriority[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TestCategory'
   */
  export type EnumTestCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TestCategory'>
    


  /**
   * Reference to a field of type 'TestCategory[]'
   */
  export type ListEnumTestCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TestCategory[]'>
    


  /**
   * Reference to a field of type 'TestStatus'
   */
  export type EnumTestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TestStatus'>
    


  /**
   * Reference to a field of type 'TestStatus[]'
   */
  export type ListEnumTestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TestStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type LabOrderWhereInput = {
    AND?: LabOrderWhereInput | LabOrderWhereInput[]
    OR?: LabOrderWhereInput[]
    NOT?: LabOrderWhereInput | LabOrderWhereInput[]
    id?: StringFilter<"LabOrder"> | string
    patientId?: StringFilter<"LabOrder"> | string
    providerId?: StringFilter<"LabOrder"> | string
    encounterId?: StringNullableFilter<"LabOrder"> | string | null
    orderNumber?: StringFilter<"LabOrder"> | string
    status?: EnumOrderStatusFilter<"LabOrder"> | $Enums.OrderStatus
    priority?: EnumOrderPriorityFilter<"LabOrder"> | $Enums.OrderPriority
    clinicalInfo?: StringNullableFilter<"LabOrder"> | string | null
    orderedAt?: DateTimeFilter<"LabOrder"> | Date | string
    collectedAt?: DateTimeNullableFilter<"LabOrder"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"LabOrder"> | Date | string | null
    reportUrl?: StringNullableFilter<"LabOrder"> | string | null
    createdAt?: DateTimeFilter<"LabOrder"> | Date | string
    updatedAt?: DateTimeFilter<"LabOrder"> | Date | string
    tests?: LabTestListRelationFilter
  }

  export type LabOrderOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    orderNumber?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    clinicalInfo?: SortOrderInput | SortOrder
    orderedAt?: SortOrder
    collectedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    reportUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tests?: LabTestOrderByRelationAggregateInput
  }

  export type LabOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderNumber?: string
    AND?: LabOrderWhereInput | LabOrderWhereInput[]
    OR?: LabOrderWhereInput[]
    NOT?: LabOrderWhereInput | LabOrderWhereInput[]
    patientId?: StringFilter<"LabOrder"> | string
    providerId?: StringFilter<"LabOrder"> | string
    encounterId?: StringNullableFilter<"LabOrder"> | string | null
    status?: EnumOrderStatusFilter<"LabOrder"> | $Enums.OrderStatus
    priority?: EnumOrderPriorityFilter<"LabOrder"> | $Enums.OrderPriority
    clinicalInfo?: StringNullableFilter<"LabOrder"> | string | null
    orderedAt?: DateTimeFilter<"LabOrder"> | Date | string
    collectedAt?: DateTimeNullableFilter<"LabOrder"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"LabOrder"> | Date | string | null
    reportUrl?: StringNullableFilter<"LabOrder"> | string | null
    createdAt?: DateTimeFilter<"LabOrder"> | Date | string
    updatedAt?: DateTimeFilter<"LabOrder"> | Date | string
    tests?: LabTestListRelationFilter
  }, "id" | "orderNumber">

  export type LabOrderOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    orderNumber?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    clinicalInfo?: SortOrderInput | SortOrder
    orderedAt?: SortOrder
    collectedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    reportUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LabOrderCountOrderByAggregateInput
    _max?: LabOrderMaxOrderByAggregateInput
    _min?: LabOrderMinOrderByAggregateInput
  }

  export type LabOrderScalarWhereWithAggregatesInput = {
    AND?: LabOrderScalarWhereWithAggregatesInput | LabOrderScalarWhereWithAggregatesInput[]
    OR?: LabOrderScalarWhereWithAggregatesInput[]
    NOT?: LabOrderScalarWhereWithAggregatesInput | LabOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LabOrder"> | string
    patientId?: StringWithAggregatesFilter<"LabOrder"> | string
    providerId?: StringWithAggregatesFilter<"LabOrder"> | string
    encounterId?: StringNullableWithAggregatesFilter<"LabOrder"> | string | null
    orderNumber?: StringWithAggregatesFilter<"LabOrder"> | string
    status?: EnumOrderStatusWithAggregatesFilter<"LabOrder"> | $Enums.OrderStatus
    priority?: EnumOrderPriorityWithAggregatesFilter<"LabOrder"> | $Enums.OrderPriority
    clinicalInfo?: StringNullableWithAggregatesFilter<"LabOrder"> | string | null
    orderedAt?: DateTimeWithAggregatesFilter<"LabOrder"> | Date | string
    collectedAt?: DateTimeNullableWithAggregatesFilter<"LabOrder"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"LabOrder"> | Date | string | null
    reportUrl?: StringNullableWithAggregatesFilter<"LabOrder"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LabOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LabOrder"> | Date | string
  }

  export type LabTestWhereInput = {
    AND?: LabTestWhereInput | LabTestWhereInput[]
    OR?: LabTestWhereInput[]
    NOT?: LabTestWhereInput | LabTestWhereInput[]
    id?: StringFilter<"LabTest"> | string
    orderId?: StringFilter<"LabTest"> | string
    testCode?: StringFilter<"LabTest"> | string
    testName?: StringFilter<"LabTest"> | string
    category?: EnumTestCategoryFilter<"LabTest"> | $Enums.TestCategory
    status?: EnumTestStatusFilter<"LabTest"> | $Enums.TestStatus
    verifiedAt?: DateTimeNullableFilter<"LabTest"> | Date | string | null
    performedBy?: StringNullableFilter<"LabTest"> | string | null
    performedAt?: DateTimeNullableFilter<"LabTest"> | Date | string | null
    verifiedBy?: StringNullableFilter<"LabTest"> | string | null
    createdAt?: DateTimeFilter<"LabTest"> | Date | string
    updatedAt?: DateTimeFilter<"LabTest"> | Date | string
    order?: XOR<LabOrderRelationFilter, LabOrderWhereInput>
    results?: LabResultListRelationFilter
  }

  export type LabTestOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    testCode?: SortOrder
    testName?: SortOrder
    category?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    performedBy?: SortOrderInput | SortOrder
    performedAt?: SortOrderInput | SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    order?: LabOrderOrderByWithRelationInput
    results?: LabResultOrderByRelationAggregateInput
  }

  export type LabTestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LabTestWhereInput | LabTestWhereInput[]
    OR?: LabTestWhereInput[]
    NOT?: LabTestWhereInput | LabTestWhereInput[]
    orderId?: StringFilter<"LabTest"> | string
    testCode?: StringFilter<"LabTest"> | string
    testName?: StringFilter<"LabTest"> | string
    category?: EnumTestCategoryFilter<"LabTest"> | $Enums.TestCategory
    status?: EnumTestStatusFilter<"LabTest"> | $Enums.TestStatus
    verifiedAt?: DateTimeNullableFilter<"LabTest"> | Date | string | null
    performedBy?: StringNullableFilter<"LabTest"> | string | null
    performedAt?: DateTimeNullableFilter<"LabTest"> | Date | string | null
    verifiedBy?: StringNullableFilter<"LabTest"> | string | null
    createdAt?: DateTimeFilter<"LabTest"> | Date | string
    updatedAt?: DateTimeFilter<"LabTest"> | Date | string
    order?: XOR<LabOrderRelationFilter, LabOrderWhereInput>
    results?: LabResultListRelationFilter
  }, "id">

  export type LabTestOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    testCode?: SortOrder
    testName?: SortOrder
    category?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    performedBy?: SortOrderInput | SortOrder
    performedAt?: SortOrderInput | SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LabTestCountOrderByAggregateInput
    _max?: LabTestMaxOrderByAggregateInput
    _min?: LabTestMinOrderByAggregateInput
  }

  export type LabTestScalarWhereWithAggregatesInput = {
    AND?: LabTestScalarWhereWithAggregatesInput | LabTestScalarWhereWithAggregatesInput[]
    OR?: LabTestScalarWhereWithAggregatesInput[]
    NOT?: LabTestScalarWhereWithAggregatesInput | LabTestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LabTest"> | string
    orderId?: StringWithAggregatesFilter<"LabTest"> | string
    testCode?: StringWithAggregatesFilter<"LabTest"> | string
    testName?: StringWithAggregatesFilter<"LabTest"> | string
    category?: EnumTestCategoryWithAggregatesFilter<"LabTest"> | $Enums.TestCategory
    status?: EnumTestStatusWithAggregatesFilter<"LabTest"> | $Enums.TestStatus
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"LabTest"> | Date | string | null
    performedBy?: StringNullableWithAggregatesFilter<"LabTest"> | string | null
    performedAt?: DateTimeNullableWithAggregatesFilter<"LabTest"> | Date | string | null
    verifiedBy?: StringNullableWithAggregatesFilter<"LabTest"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LabTest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LabTest"> | Date | string
  }

  export type LabResultWhereInput = {
    AND?: LabResultWhereInput | LabResultWhereInput[]
    OR?: LabResultWhereInput[]
    NOT?: LabResultWhereInput | LabResultWhereInput[]
    id?: StringFilter<"LabResult"> | string
    testId?: StringFilter<"LabResult"> | string
    componentName?: StringFilter<"LabResult"> | string
    componentCode?: StringNullableFilter<"LabResult"> | string | null
    numericValue?: FloatNullableFilter<"LabResult"> | number | null
    value?: StringFilter<"LabResult"> | string
    unit?: StringNullableFilter<"LabResult"> | string | null
    referenceRange?: StringNullableFilter<"LabResult"> | string | null
    isAbnormal?: BoolFilter<"LabResult"> | boolean
    isCritical?: BoolFilter<"LabResult"> | boolean
    abnormalFlag?: StringNullableFilter<"LabResult"> | string | null
    notes?: StringNullableFilter<"LabResult"> | string | null
    interpretation?: StringNullableFilter<"LabResult"> | string | null
    verifiedAt?: DateTimeNullableFilter<"LabResult"> | Date | string | null
    performedBy?: StringNullableFilter<"LabResult"> | string | null
    performedAt?: DateTimeNullableFilter<"LabResult"> | Date | string | null
    verifiedBy?: StringNullableFilter<"LabResult"> | string | null
    resultedAt?: DateTimeFilter<"LabResult"> | Date | string
    createdAt?: DateTimeFilter<"LabResult"> | Date | string
    test?: XOR<LabTestRelationFilter, LabTestWhereInput>
  }

  export type LabResultOrderByWithRelationInput = {
    id?: SortOrder
    testId?: SortOrder
    componentName?: SortOrder
    componentCode?: SortOrderInput | SortOrder
    numericValue?: SortOrderInput | SortOrder
    value?: SortOrder
    unit?: SortOrderInput | SortOrder
    referenceRange?: SortOrderInput | SortOrder
    isAbnormal?: SortOrder
    isCritical?: SortOrder
    abnormalFlag?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    interpretation?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    performedBy?: SortOrderInput | SortOrder
    performedAt?: SortOrderInput | SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    resultedAt?: SortOrder
    createdAt?: SortOrder
    test?: LabTestOrderByWithRelationInput
  }

  export type LabResultWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LabResultWhereInput | LabResultWhereInput[]
    OR?: LabResultWhereInput[]
    NOT?: LabResultWhereInput | LabResultWhereInput[]
    testId?: StringFilter<"LabResult"> | string
    componentName?: StringFilter<"LabResult"> | string
    componentCode?: StringNullableFilter<"LabResult"> | string | null
    numericValue?: FloatNullableFilter<"LabResult"> | number | null
    value?: StringFilter<"LabResult"> | string
    unit?: StringNullableFilter<"LabResult"> | string | null
    referenceRange?: StringNullableFilter<"LabResult"> | string | null
    isAbnormal?: BoolFilter<"LabResult"> | boolean
    isCritical?: BoolFilter<"LabResult"> | boolean
    abnormalFlag?: StringNullableFilter<"LabResult"> | string | null
    notes?: StringNullableFilter<"LabResult"> | string | null
    interpretation?: StringNullableFilter<"LabResult"> | string | null
    verifiedAt?: DateTimeNullableFilter<"LabResult"> | Date | string | null
    performedBy?: StringNullableFilter<"LabResult"> | string | null
    performedAt?: DateTimeNullableFilter<"LabResult"> | Date | string | null
    verifiedBy?: StringNullableFilter<"LabResult"> | string | null
    resultedAt?: DateTimeFilter<"LabResult"> | Date | string
    createdAt?: DateTimeFilter<"LabResult"> | Date | string
    test?: XOR<LabTestRelationFilter, LabTestWhereInput>
  }, "id">

  export type LabResultOrderByWithAggregationInput = {
    id?: SortOrder
    testId?: SortOrder
    componentName?: SortOrder
    componentCode?: SortOrderInput | SortOrder
    numericValue?: SortOrderInput | SortOrder
    value?: SortOrder
    unit?: SortOrderInput | SortOrder
    referenceRange?: SortOrderInput | SortOrder
    isAbnormal?: SortOrder
    isCritical?: SortOrder
    abnormalFlag?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    interpretation?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    performedBy?: SortOrderInput | SortOrder
    performedAt?: SortOrderInput | SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    resultedAt?: SortOrder
    createdAt?: SortOrder
    _count?: LabResultCountOrderByAggregateInput
    _avg?: LabResultAvgOrderByAggregateInput
    _max?: LabResultMaxOrderByAggregateInput
    _min?: LabResultMinOrderByAggregateInput
    _sum?: LabResultSumOrderByAggregateInput
  }

  export type LabResultScalarWhereWithAggregatesInput = {
    AND?: LabResultScalarWhereWithAggregatesInput | LabResultScalarWhereWithAggregatesInput[]
    OR?: LabResultScalarWhereWithAggregatesInput[]
    NOT?: LabResultScalarWhereWithAggregatesInput | LabResultScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LabResult"> | string
    testId?: StringWithAggregatesFilter<"LabResult"> | string
    componentName?: StringWithAggregatesFilter<"LabResult"> | string
    componentCode?: StringNullableWithAggregatesFilter<"LabResult"> | string | null
    numericValue?: FloatNullableWithAggregatesFilter<"LabResult"> | number | null
    value?: StringWithAggregatesFilter<"LabResult"> | string
    unit?: StringNullableWithAggregatesFilter<"LabResult"> | string | null
    referenceRange?: StringNullableWithAggregatesFilter<"LabResult"> | string | null
    isAbnormal?: BoolWithAggregatesFilter<"LabResult"> | boolean
    isCritical?: BoolWithAggregatesFilter<"LabResult"> | boolean
    abnormalFlag?: StringNullableWithAggregatesFilter<"LabResult"> | string | null
    notes?: StringNullableWithAggregatesFilter<"LabResult"> | string | null
    interpretation?: StringNullableWithAggregatesFilter<"LabResult"> | string | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"LabResult"> | Date | string | null
    performedBy?: StringNullableWithAggregatesFilter<"LabResult"> | string | null
    performedAt?: DateTimeNullableWithAggregatesFilter<"LabResult"> | Date | string | null
    verifiedBy?: StringNullableWithAggregatesFilter<"LabResult"> | string | null
    resultedAt?: DateTimeWithAggregatesFilter<"LabResult"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"LabResult"> | Date | string
  }

  export type DiagnosticTestWhereInput = {
    AND?: DiagnosticTestWhereInput | DiagnosticTestWhereInput[]
    OR?: DiagnosticTestWhereInput[]
    NOT?: DiagnosticTestWhereInput | DiagnosticTestWhereInput[]
    id?: StringFilter<"DiagnosticTest"> | string
    name?: StringFilter<"DiagnosticTest"> | string
    code?: StringFilter<"DiagnosticTest"> | string
    category?: EnumTestCategoryFilter<"DiagnosticTest"> | $Enums.TestCategory
    description?: StringNullableFilter<"DiagnosticTest"> | string | null
    preparation?: StringNullableFilter<"DiagnosticTest"> | string | null
    sampleType?: StringNullableFilter<"DiagnosticTest"> | string | null
    turnaroundTime?: StringNullableFilter<"DiagnosticTest"> | string | null
    price?: DecimalFilter<"DiagnosticTest"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"DiagnosticTest"> | string
    referenceRanges?: JsonNullableFilter<"DiagnosticTest">
    isActive?: BoolFilter<"DiagnosticTest"> | boolean
    createdAt?: DateTimeFilter<"DiagnosticTest"> | Date | string
    updatedAt?: DateTimeFilter<"DiagnosticTest"> | Date | string
  }

  export type DiagnosticTestOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    category?: SortOrder
    description?: SortOrderInput | SortOrder
    preparation?: SortOrderInput | SortOrder
    sampleType?: SortOrderInput | SortOrder
    turnaroundTime?: SortOrderInput | SortOrder
    price?: SortOrder
    currency?: SortOrder
    referenceRanges?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiagnosticTestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: DiagnosticTestWhereInput | DiagnosticTestWhereInput[]
    OR?: DiagnosticTestWhereInput[]
    NOT?: DiagnosticTestWhereInput | DiagnosticTestWhereInput[]
    name?: StringFilter<"DiagnosticTest"> | string
    category?: EnumTestCategoryFilter<"DiagnosticTest"> | $Enums.TestCategory
    description?: StringNullableFilter<"DiagnosticTest"> | string | null
    preparation?: StringNullableFilter<"DiagnosticTest"> | string | null
    sampleType?: StringNullableFilter<"DiagnosticTest"> | string | null
    turnaroundTime?: StringNullableFilter<"DiagnosticTest"> | string | null
    price?: DecimalFilter<"DiagnosticTest"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"DiagnosticTest"> | string
    referenceRanges?: JsonNullableFilter<"DiagnosticTest">
    isActive?: BoolFilter<"DiagnosticTest"> | boolean
    createdAt?: DateTimeFilter<"DiagnosticTest"> | Date | string
    updatedAt?: DateTimeFilter<"DiagnosticTest"> | Date | string
  }, "id" | "code">

  export type DiagnosticTestOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    category?: SortOrder
    description?: SortOrderInput | SortOrder
    preparation?: SortOrderInput | SortOrder
    sampleType?: SortOrderInput | SortOrder
    turnaroundTime?: SortOrderInput | SortOrder
    price?: SortOrder
    currency?: SortOrder
    referenceRanges?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DiagnosticTestCountOrderByAggregateInput
    _avg?: DiagnosticTestAvgOrderByAggregateInput
    _max?: DiagnosticTestMaxOrderByAggregateInput
    _min?: DiagnosticTestMinOrderByAggregateInput
    _sum?: DiagnosticTestSumOrderByAggregateInput
  }

  export type DiagnosticTestScalarWhereWithAggregatesInput = {
    AND?: DiagnosticTestScalarWhereWithAggregatesInput | DiagnosticTestScalarWhereWithAggregatesInput[]
    OR?: DiagnosticTestScalarWhereWithAggregatesInput[]
    NOT?: DiagnosticTestScalarWhereWithAggregatesInput | DiagnosticTestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DiagnosticTest"> | string
    name?: StringWithAggregatesFilter<"DiagnosticTest"> | string
    code?: StringWithAggregatesFilter<"DiagnosticTest"> | string
    category?: EnumTestCategoryWithAggregatesFilter<"DiagnosticTest"> | $Enums.TestCategory
    description?: StringNullableWithAggregatesFilter<"DiagnosticTest"> | string | null
    preparation?: StringNullableWithAggregatesFilter<"DiagnosticTest"> | string | null
    sampleType?: StringNullableWithAggregatesFilter<"DiagnosticTest"> | string | null
    turnaroundTime?: StringNullableWithAggregatesFilter<"DiagnosticTest"> | string | null
    price?: DecimalWithAggregatesFilter<"DiagnosticTest"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"DiagnosticTest"> | string
    referenceRanges?: JsonNullableWithAggregatesFilter<"DiagnosticTest">
    isActive?: BoolWithAggregatesFilter<"DiagnosticTest"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"DiagnosticTest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DiagnosticTest"> | Date | string
  }

  export type LabOrderCreateInput = {
    id?: string
    patientId: string
    providerId: string
    encounterId?: string | null
    orderNumber: string
    status?: $Enums.OrderStatus
    priority?: $Enums.OrderPriority
    clinicalInfo?: string | null
    orderedAt?: Date | string
    collectedAt?: Date | string | null
    completedAt?: Date | string | null
    reportUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tests?: LabTestCreateNestedManyWithoutOrderInput
  }

  export type LabOrderUncheckedCreateInput = {
    id?: string
    patientId: string
    providerId: string
    encounterId?: string | null
    orderNumber: string
    status?: $Enums.OrderStatus
    priority?: $Enums.OrderPriority
    clinicalInfo?: string | null
    orderedAt?: Date | string
    collectedAt?: Date | string | null
    completedAt?: Date | string | null
    reportUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tests?: LabTestUncheckedCreateNestedManyWithoutOrderInput
  }

  export type LabOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    priority?: EnumOrderPriorityFieldUpdateOperationsInput | $Enums.OrderPriority
    clinicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    orderedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tests?: LabTestUpdateManyWithoutOrderNestedInput
  }

  export type LabOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    priority?: EnumOrderPriorityFieldUpdateOperationsInput | $Enums.OrderPriority
    clinicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    orderedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tests?: LabTestUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type LabOrderCreateManyInput = {
    id?: string
    patientId: string
    providerId: string
    encounterId?: string | null
    orderNumber: string
    status?: $Enums.OrderStatus
    priority?: $Enums.OrderPriority
    clinicalInfo?: string | null
    orderedAt?: Date | string
    collectedAt?: Date | string | null
    completedAt?: Date | string | null
    reportUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    priority?: EnumOrderPriorityFieldUpdateOperationsInput | $Enums.OrderPriority
    clinicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    orderedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    priority?: EnumOrderPriorityFieldUpdateOperationsInput | $Enums.OrderPriority
    clinicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    orderedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabTestCreateInput = {
    id?: string
    testCode: string
    testName: string
    category: $Enums.TestCategory
    status?: $Enums.TestStatus
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    order: LabOrderCreateNestedOneWithoutTestsInput
    results?: LabResultCreateNestedManyWithoutTestInput
  }

  export type LabTestUncheckedCreateInput = {
    id?: string
    orderId: string
    testCode: string
    testName: string
    category: $Enums.TestCategory
    status?: $Enums.TestStatus
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    results?: LabResultUncheckedCreateNestedManyWithoutTestInput
  }

  export type LabTestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    testCode?: StringFieldUpdateOperationsInput | string
    testName?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: LabOrderUpdateOneRequiredWithoutTestsNestedInput
    results?: LabResultUpdateManyWithoutTestNestedInput
  }

  export type LabTestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    testCode?: StringFieldUpdateOperationsInput | string
    testName?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    results?: LabResultUncheckedUpdateManyWithoutTestNestedInput
  }

  export type LabTestCreateManyInput = {
    id?: string
    orderId: string
    testCode: string
    testName: string
    category: $Enums.TestCategory
    status?: $Enums.TestStatus
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabTestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    testCode?: StringFieldUpdateOperationsInput | string
    testName?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabTestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    testCode?: StringFieldUpdateOperationsInput | string
    testName?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabResultCreateInput = {
    id?: string
    componentName: string
    componentCode?: string | null
    numericValue?: number | null
    value: string
    unit?: string | null
    referenceRange?: string | null
    isAbnormal?: boolean
    isCritical?: boolean
    abnormalFlag?: string | null
    notes?: string | null
    interpretation?: string | null
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    resultedAt?: Date | string
    createdAt?: Date | string
    test: LabTestCreateNestedOneWithoutResultsInput
  }

  export type LabResultUncheckedCreateInput = {
    id?: string
    testId: string
    componentName: string
    componentCode?: string | null
    numericValue?: number | null
    value: string
    unit?: string | null
    referenceRange?: string | null
    isAbnormal?: boolean
    isCritical?: boolean
    abnormalFlag?: string | null
    notes?: string | null
    interpretation?: string | null
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    resultedAt?: Date | string
    createdAt?: Date | string
  }

  export type LabResultUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentName?: StringFieldUpdateOperationsInput | string
    componentCode?: NullableStringFieldUpdateOperationsInput | string | null
    numericValue?: NullableFloatFieldUpdateOperationsInput | number | null
    value?: StringFieldUpdateOperationsInput | string
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRange?: NullableStringFieldUpdateOperationsInput | string | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    isCritical?: BoolFieldUpdateOperationsInput | boolean
    abnormalFlag?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    interpretation?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    resultedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    test?: LabTestUpdateOneRequiredWithoutResultsNestedInput
  }

  export type LabResultUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    testId?: StringFieldUpdateOperationsInput | string
    componentName?: StringFieldUpdateOperationsInput | string
    componentCode?: NullableStringFieldUpdateOperationsInput | string | null
    numericValue?: NullableFloatFieldUpdateOperationsInput | number | null
    value?: StringFieldUpdateOperationsInput | string
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRange?: NullableStringFieldUpdateOperationsInput | string | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    isCritical?: BoolFieldUpdateOperationsInput | boolean
    abnormalFlag?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    interpretation?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    resultedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabResultCreateManyInput = {
    id?: string
    testId: string
    componentName: string
    componentCode?: string | null
    numericValue?: number | null
    value: string
    unit?: string | null
    referenceRange?: string | null
    isAbnormal?: boolean
    isCritical?: boolean
    abnormalFlag?: string | null
    notes?: string | null
    interpretation?: string | null
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    resultedAt?: Date | string
    createdAt?: Date | string
  }

  export type LabResultUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentName?: StringFieldUpdateOperationsInput | string
    componentCode?: NullableStringFieldUpdateOperationsInput | string | null
    numericValue?: NullableFloatFieldUpdateOperationsInput | number | null
    value?: StringFieldUpdateOperationsInput | string
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRange?: NullableStringFieldUpdateOperationsInput | string | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    isCritical?: BoolFieldUpdateOperationsInput | boolean
    abnormalFlag?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    interpretation?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    resultedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabResultUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    testId?: StringFieldUpdateOperationsInput | string
    componentName?: StringFieldUpdateOperationsInput | string
    componentCode?: NullableStringFieldUpdateOperationsInput | string | null
    numericValue?: NullableFloatFieldUpdateOperationsInput | number | null
    value?: StringFieldUpdateOperationsInput | string
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRange?: NullableStringFieldUpdateOperationsInput | string | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    isCritical?: BoolFieldUpdateOperationsInput | boolean
    abnormalFlag?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    interpretation?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    resultedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosticTestCreateInput = {
    id?: string
    name: string
    code: string
    category: $Enums.TestCategory
    description?: string | null
    preparation?: string | null
    sampleType?: string | null
    turnaroundTime?: string | null
    price: Decimal | DecimalJsLike | number | string
    currency?: string
    referenceRanges?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiagnosticTestUncheckedCreateInput = {
    id?: string
    name: string
    code: string
    category: $Enums.TestCategory
    description?: string | null
    preparation?: string | null
    sampleType?: string | null
    turnaroundTime?: string | null
    price: Decimal | DecimalJsLike | number | string
    currency?: string
    referenceRanges?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiagnosticTestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    preparation?: NullableStringFieldUpdateOperationsInput | string | null
    sampleType?: NullableStringFieldUpdateOperationsInput | string | null
    turnaroundTime?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    referenceRanges?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosticTestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    preparation?: NullableStringFieldUpdateOperationsInput | string | null
    sampleType?: NullableStringFieldUpdateOperationsInput | string | null
    turnaroundTime?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    referenceRanges?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosticTestCreateManyInput = {
    id?: string
    name: string
    code: string
    category: $Enums.TestCategory
    description?: string | null
    preparation?: string | null
    sampleType?: string | null
    turnaroundTime?: string | null
    price: Decimal | DecimalJsLike | number | string
    currency?: string
    referenceRanges?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiagnosticTestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    preparation?: NullableStringFieldUpdateOperationsInput | string | null
    sampleType?: NullableStringFieldUpdateOperationsInput | string | null
    turnaroundTime?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    referenceRanges?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosticTestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    description?: NullableStringFieldUpdateOperationsInput | string | null
    preparation?: NullableStringFieldUpdateOperationsInput | string | null
    sampleType?: NullableStringFieldUpdateOperationsInput | string | null
    turnaroundTime?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    referenceRanges?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
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

  export type EnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type EnumOrderPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderPriority | EnumOrderPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.OrderPriority[] | ListEnumOrderPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderPriority[] | ListEnumOrderPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderPriorityFilter<$PrismaModel> | $Enums.OrderPriority
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

  export type LabTestListRelationFilter = {
    every?: LabTestWhereInput
    some?: LabTestWhereInput
    none?: LabTestWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LabTestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LabOrderCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    encounterId?: SortOrder
    orderNumber?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    clinicalInfo?: SortOrder
    orderedAt?: SortOrder
    collectedAt?: SortOrder
    completedAt?: SortOrder
    reportUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LabOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    encounterId?: SortOrder
    orderNumber?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    clinicalInfo?: SortOrder
    orderedAt?: SortOrder
    collectedAt?: SortOrder
    completedAt?: SortOrder
    reportUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LabOrderMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    encounterId?: SortOrder
    orderNumber?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    clinicalInfo?: SortOrder
    orderedAt?: SortOrder
    collectedAt?: SortOrder
    completedAt?: SortOrder
    reportUrl?: SortOrder
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

  export type EnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type EnumOrderPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderPriority | EnumOrderPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.OrderPriority[] | ListEnumOrderPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderPriority[] | ListEnumOrderPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderPriorityWithAggregatesFilter<$PrismaModel> | $Enums.OrderPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderPriorityFilter<$PrismaModel>
    _max?: NestedEnumOrderPriorityFilter<$PrismaModel>
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

  export type EnumTestCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.TestCategory | EnumTestCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TestCategory[] | ListEnumTestCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestCategory[] | ListEnumTestCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTestCategoryFilter<$PrismaModel> | $Enums.TestCategory
  }

  export type EnumTestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TestStatus | EnumTestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTestStatusFilter<$PrismaModel> | $Enums.TestStatus
  }

  export type LabOrderRelationFilter = {
    is?: LabOrderWhereInput
    isNot?: LabOrderWhereInput
  }

  export type LabResultListRelationFilter = {
    every?: LabResultWhereInput
    some?: LabResultWhereInput
    none?: LabResultWhereInput
  }

  export type LabResultOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LabTestCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    testCode?: SortOrder
    testName?: SortOrder
    category?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    performedBy?: SortOrder
    performedAt?: SortOrder
    verifiedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LabTestMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    testCode?: SortOrder
    testName?: SortOrder
    category?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    performedBy?: SortOrder
    performedAt?: SortOrder
    verifiedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LabTestMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    testCode?: SortOrder
    testName?: SortOrder
    category?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    performedBy?: SortOrder
    performedAt?: SortOrder
    verifiedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTestCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TestCategory | EnumTestCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TestCategory[] | ListEnumTestCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestCategory[] | ListEnumTestCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTestCategoryWithAggregatesFilter<$PrismaModel> | $Enums.TestCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTestCategoryFilter<$PrismaModel>
    _max?: NestedEnumTestCategoryFilter<$PrismaModel>
  }

  export type EnumTestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TestStatus | EnumTestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTestStatusWithAggregatesFilter<$PrismaModel> | $Enums.TestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTestStatusFilter<$PrismaModel>
    _max?: NestedEnumTestStatusFilter<$PrismaModel>
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type LabTestRelationFilter = {
    is?: LabTestWhereInput
    isNot?: LabTestWhereInput
  }

  export type LabResultCountOrderByAggregateInput = {
    id?: SortOrder
    testId?: SortOrder
    componentName?: SortOrder
    componentCode?: SortOrder
    numericValue?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    referenceRange?: SortOrder
    isAbnormal?: SortOrder
    isCritical?: SortOrder
    abnormalFlag?: SortOrder
    notes?: SortOrder
    interpretation?: SortOrder
    verifiedAt?: SortOrder
    performedBy?: SortOrder
    performedAt?: SortOrder
    verifiedBy?: SortOrder
    resultedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LabResultAvgOrderByAggregateInput = {
    numericValue?: SortOrder
  }

  export type LabResultMaxOrderByAggregateInput = {
    id?: SortOrder
    testId?: SortOrder
    componentName?: SortOrder
    componentCode?: SortOrder
    numericValue?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    referenceRange?: SortOrder
    isAbnormal?: SortOrder
    isCritical?: SortOrder
    abnormalFlag?: SortOrder
    notes?: SortOrder
    interpretation?: SortOrder
    verifiedAt?: SortOrder
    performedBy?: SortOrder
    performedAt?: SortOrder
    verifiedBy?: SortOrder
    resultedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LabResultMinOrderByAggregateInput = {
    id?: SortOrder
    testId?: SortOrder
    componentName?: SortOrder
    componentCode?: SortOrder
    numericValue?: SortOrder
    value?: SortOrder
    unit?: SortOrder
    referenceRange?: SortOrder
    isAbnormal?: SortOrder
    isCritical?: SortOrder
    abnormalFlag?: SortOrder
    notes?: SortOrder
    interpretation?: SortOrder
    verifiedAt?: SortOrder
    performedBy?: SortOrder
    performedAt?: SortOrder
    verifiedBy?: SortOrder
    resultedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LabResultSumOrderByAggregateInput = {
    numericValue?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type DiagnosticTestCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    category?: SortOrder
    description?: SortOrder
    preparation?: SortOrder
    sampleType?: SortOrder
    turnaroundTime?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    referenceRanges?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiagnosticTestAvgOrderByAggregateInput = {
    price?: SortOrder
  }

  export type DiagnosticTestMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    category?: SortOrder
    description?: SortOrder
    preparation?: SortOrder
    sampleType?: SortOrder
    turnaroundTime?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiagnosticTestMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    category?: SortOrder
    description?: SortOrder
    preparation?: SortOrder
    sampleType?: SortOrder
    turnaroundTime?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiagnosticTestSumOrderByAggregateInput = {
    price?: SortOrder
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

  export type LabTestCreateNestedManyWithoutOrderInput = {
    create?: XOR<LabTestCreateWithoutOrderInput, LabTestUncheckedCreateWithoutOrderInput> | LabTestCreateWithoutOrderInput[] | LabTestUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LabTestCreateOrConnectWithoutOrderInput | LabTestCreateOrConnectWithoutOrderInput[]
    createMany?: LabTestCreateManyOrderInputEnvelope
    connect?: LabTestWhereUniqueInput | LabTestWhereUniqueInput[]
  }

  export type LabTestUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<LabTestCreateWithoutOrderInput, LabTestUncheckedCreateWithoutOrderInput> | LabTestCreateWithoutOrderInput[] | LabTestUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LabTestCreateOrConnectWithoutOrderInput | LabTestCreateOrConnectWithoutOrderInput[]
    createMany?: LabTestCreateManyOrderInputEnvelope
    connect?: LabTestWhereUniqueInput | LabTestWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.OrderStatus
  }

  export type EnumOrderPriorityFieldUpdateOperationsInput = {
    set?: $Enums.OrderPriority
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type LabTestUpdateManyWithoutOrderNestedInput = {
    create?: XOR<LabTestCreateWithoutOrderInput, LabTestUncheckedCreateWithoutOrderInput> | LabTestCreateWithoutOrderInput[] | LabTestUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LabTestCreateOrConnectWithoutOrderInput | LabTestCreateOrConnectWithoutOrderInput[]
    upsert?: LabTestUpsertWithWhereUniqueWithoutOrderInput | LabTestUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: LabTestCreateManyOrderInputEnvelope
    set?: LabTestWhereUniqueInput | LabTestWhereUniqueInput[]
    disconnect?: LabTestWhereUniqueInput | LabTestWhereUniqueInput[]
    delete?: LabTestWhereUniqueInput | LabTestWhereUniqueInput[]
    connect?: LabTestWhereUniqueInput | LabTestWhereUniqueInput[]
    update?: LabTestUpdateWithWhereUniqueWithoutOrderInput | LabTestUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: LabTestUpdateManyWithWhereWithoutOrderInput | LabTestUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: LabTestScalarWhereInput | LabTestScalarWhereInput[]
  }

  export type LabTestUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<LabTestCreateWithoutOrderInput, LabTestUncheckedCreateWithoutOrderInput> | LabTestCreateWithoutOrderInput[] | LabTestUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: LabTestCreateOrConnectWithoutOrderInput | LabTestCreateOrConnectWithoutOrderInput[]
    upsert?: LabTestUpsertWithWhereUniqueWithoutOrderInput | LabTestUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: LabTestCreateManyOrderInputEnvelope
    set?: LabTestWhereUniqueInput | LabTestWhereUniqueInput[]
    disconnect?: LabTestWhereUniqueInput | LabTestWhereUniqueInput[]
    delete?: LabTestWhereUniqueInput | LabTestWhereUniqueInput[]
    connect?: LabTestWhereUniqueInput | LabTestWhereUniqueInput[]
    update?: LabTestUpdateWithWhereUniqueWithoutOrderInput | LabTestUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: LabTestUpdateManyWithWhereWithoutOrderInput | LabTestUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: LabTestScalarWhereInput | LabTestScalarWhereInput[]
  }

  export type LabOrderCreateNestedOneWithoutTestsInput = {
    create?: XOR<LabOrderCreateWithoutTestsInput, LabOrderUncheckedCreateWithoutTestsInput>
    connectOrCreate?: LabOrderCreateOrConnectWithoutTestsInput
    connect?: LabOrderWhereUniqueInput
  }

  export type LabResultCreateNestedManyWithoutTestInput = {
    create?: XOR<LabResultCreateWithoutTestInput, LabResultUncheckedCreateWithoutTestInput> | LabResultCreateWithoutTestInput[] | LabResultUncheckedCreateWithoutTestInput[]
    connectOrCreate?: LabResultCreateOrConnectWithoutTestInput | LabResultCreateOrConnectWithoutTestInput[]
    createMany?: LabResultCreateManyTestInputEnvelope
    connect?: LabResultWhereUniqueInput | LabResultWhereUniqueInput[]
  }

  export type LabResultUncheckedCreateNestedManyWithoutTestInput = {
    create?: XOR<LabResultCreateWithoutTestInput, LabResultUncheckedCreateWithoutTestInput> | LabResultCreateWithoutTestInput[] | LabResultUncheckedCreateWithoutTestInput[]
    connectOrCreate?: LabResultCreateOrConnectWithoutTestInput | LabResultCreateOrConnectWithoutTestInput[]
    createMany?: LabResultCreateManyTestInputEnvelope
    connect?: LabResultWhereUniqueInput | LabResultWhereUniqueInput[]
  }

  export type EnumTestCategoryFieldUpdateOperationsInput = {
    set?: $Enums.TestCategory
  }

  export type EnumTestStatusFieldUpdateOperationsInput = {
    set?: $Enums.TestStatus
  }

  export type LabOrderUpdateOneRequiredWithoutTestsNestedInput = {
    create?: XOR<LabOrderCreateWithoutTestsInput, LabOrderUncheckedCreateWithoutTestsInput>
    connectOrCreate?: LabOrderCreateOrConnectWithoutTestsInput
    upsert?: LabOrderUpsertWithoutTestsInput
    connect?: LabOrderWhereUniqueInput
    update?: XOR<XOR<LabOrderUpdateToOneWithWhereWithoutTestsInput, LabOrderUpdateWithoutTestsInput>, LabOrderUncheckedUpdateWithoutTestsInput>
  }

  export type LabResultUpdateManyWithoutTestNestedInput = {
    create?: XOR<LabResultCreateWithoutTestInput, LabResultUncheckedCreateWithoutTestInput> | LabResultCreateWithoutTestInput[] | LabResultUncheckedCreateWithoutTestInput[]
    connectOrCreate?: LabResultCreateOrConnectWithoutTestInput | LabResultCreateOrConnectWithoutTestInput[]
    upsert?: LabResultUpsertWithWhereUniqueWithoutTestInput | LabResultUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: LabResultCreateManyTestInputEnvelope
    set?: LabResultWhereUniqueInput | LabResultWhereUniqueInput[]
    disconnect?: LabResultWhereUniqueInput | LabResultWhereUniqueInput[]
    delete?: LabResultWhereUniqueInput | LabResultWhereUniqueInput[]
    connect?: LabResultWhereUniqueInput | LabResultWhereUniqueInput[]
    update?: LabResultUpdateWithWhereUniqueWithoutTestInput | LabResultUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: LabResultUpdateManyWithWhereWithoutTestInput | LabResultUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: LabResultScalarWhereInput | LabResultScalarWhereInput[]
  }

  export type LabResultUncheckedUpdateManyWithoutTestNestedInput = {
    create?: XOR<LabResultCreateWithoutTestInput, LabResultUncheckedCreateWithoutTestInput> | LabResultCreateWithoutTestInput[] | LabResultUncheckedCreateWithoutTestInput[]
    connectOrCreate?: LabResultCreateOrConnectWithoutTestInput | LabResultCreateOrConnectWithoutTestInput[]
    upsert?: LabResultUpsertWithWhereUniqueWithoutTestInput | LabResultUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: LabResultCreateManyTestInputEnvelope
    set?: LabResultWhereUniqueInput | LabResultWhereUniqueInput[]
    disconnect?: LabResultWhereUniqueInput | LabResultWhereUniqueInput[]
    delete?: LabResultWhereUniqueInput | LabResultWhereUniqueInput[]
    connect?: LabResultWhereUniqueInput | LabResultWhereUniqueInput[]
    update?: LabResultUpdateWithWhereUniqueWithoutTestInput | LabResultUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: LabResultUpdateManyWithWhereWithoutTestInput | LabResultUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: LabResultScalarWhereInput | LabResultScalarWhereInput[]
  }

  export type LabTestCreateNestedOneWithoutResultsInput = {
    create?: XOR<LabTestCreateWithoutResultsInput, LabTestUncheckedCreateWithoutResultsInput>
    connectOrCreate?: LabTestCreateOrConnectWithoutResultsInput
    connect?: LabTestWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type LabTestUpdateOneRequiredWithoutResultsNestedInput = {
    create?: XOR<LabTestCreateWithoutResultsInput, LabTestUncheckedCreateWithoutResultsInput>
    connectOrCreate?: LabTestCreateOrConnectWithoutResultsInput
    upsert?: LabTestUpsertWithoutResultsInput
    connect?: LabTestWhereUniqueInput
    update?: XOR<XOR<LabTestUpdateToOneWithWhereWithoutResultsInput, LabTestUpdateWithoutResultsInput>, LabTestUncheckedUpdateWithoutResultsInput>
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
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

  export type NestedEnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type NestedEnumOrderPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderPriority | EnumOrderPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.OrderPriority[] | ListEnumOrderPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderPriority[] | ListEnumOrderPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderPriorityFilter<$PrismaModel> | $Enums.OrderPriority
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

  export type NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type NestedEnumOrderPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderPriority | EnumOrderPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.OrderPriority[] | ListEnumOrderPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderPriority[] | ListEnumOrderPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderPriorityWithAggregatesFilter<$PrismaModel> | $Enums.OrderPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderPriorityFilter<$PrismaModel>
    _max?: NestedEnumOrderPriorityFilter<$PrismaModel>
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

  export type NestedEnumTestCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.TestCategory | EnumTestCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TestCategory[] | ListEnumTestCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestCategory[] | ListEnumTestCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTestCategoryFilter<$PrismaModel> | $Enums.TestCategory
  }

  export type NestedEnumTestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TestStatus | EnumTestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTestStatusFilter<$PrismaModel> | $Enums.TestStatus
  }

  export type NestedEnumTestCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TestCategory | EnumTestCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TestCategory[] | ListEnumTestCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestCategory[] | ListEnumTestCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTestCategoryWithAggregatesFilter<$PrismaModel> | $Enums.TestCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTestCategoryFilter<$PrismaModel>
    _max?: NestedEnumTestCategoryFilter<$PrismaModel>
  }

  export type NestedEnumTestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TestStatus | EnumTestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTestStatusWithAggregatesFilter<$PrismaModel> | $Enums.TestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTestStatusFilter<$PrismaModel>
    _max?: NestedEnumTestStatusFilter<$PrismaModel>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type LabTestCreateWithoutOrderInput = {
    id?: string
    testCode: string
    testName: string
    category: $Enums.TestCategory
    status?: $Enums.TestStatus
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    results?: LabResultCreateNestedManyWithoutTestInput
  }

  export type LabTestUncheckedCreateWithoutOrderInput = {
    id?: string
    testCode: string
    testName: string
    category: $Enums.TestCategory
    status?: $Enums.TestStatus
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    results?: LabResultUncheckedCreateNestedManyWithoutTestInput
  }

  export type LabTestCreateOrConnectWithoutOrderInput = {
    where: LabTestWhereUniqueInput
    create: XOR<LabTestCreateWithoutOrderInput, LabTestUncheckedCreateWithoutOrderInput>
  }

  export type LabTestCreateManyOrderInputEnvelope = {
    data: LabTestCreateManyOrderInput | LabTestCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type LabTestUpsertWithWhereUniqueWithoutOrderInput = {
    where: LabTestWhereUniqueInput
    update: XOR<LabTestUpdateWithoutOrderInput, LabTestUncheckedUpdateWithoutOrderInput>
    create: XOR<LabTestCreateWithoutOrderInput, LabTestUncheckedCreateWithoutOrderInput>
  }

  export type LabTestUpdateWithWhereUniqueWithoutOrderInput = {
    where: LabTestWhereUniqueInput
    data: XOR<LabTestUpdateWithoutOrderInput, LabTestUncheckedUpdateWithoutOrderInput>
  }

  export type LabTestUpdateManyWithWhereWithoutOrderInput = {
    where: LabTestScalarWhereInput
    data: XOR<LabTestUpdateManyMutationInput, LabTestUncheckedUpdateManyWithoutOrderInput>
  }

  export type LabTestScalarWhereInput = {
    AND?: LabTestScalarWhereInput | LabTestScalarWhereInput[]
    OR?: LabTestScalarWhereInput[]
    NOT?: LabTestScalarWhereInput | LabTestScalarWhereInput[]
    id?: StringFilter<"LabTest"> | string
    orderId?: StringFilter<"LabTest"> | string
    testCode?: StringFilter<"LabTest"> | string
    testName?: StringFilter<"LabTest"> | string
    category?: EnumTestCategoryFilter<"LabTest"> | $Enums.TestCategory
    status?: EnumTestStatusFilter<"LabTest"> | $Enums.TestStatus
    verifiedAt?: DateTimeNullableFilter<"LabTest"> | Date | string | null
    performedBy?: StringNullableFilter<"LabTest"> | string | null
    performedAt?: DateTimeNullableFilter<"LabTest"> | Date | string | null
    verifiedBy?: StringNullableFilter<"LabTest"> | string | null
    createdAt?: DateTimeFilter<"LabTest"> | Date | string
    updatedAt?: DateTimeFilter<"LabTest"> | Date | string
  }

  export type LabOrderCreateWithoutTestsInput = {
    id?: string
    patientId: string
    providerId: string
    encounterId?: string | null
    orderNumber: string
    status?: $Enums.OrderStatus
    priority?: $Enums.OrderPriority
    clinicalInfo?: string | null
    orderedAt?: Date | string
    collectedAt?: Date | string | null
    completedAt?: Date | string | null
    reportUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabOrderUncheckedCreateWithoutTestsInput = {
    id?: string
    patientId: string
    providerId: string
    encounterId?: string | null
    orderNumber: string
    status?: $Enums.OrderStatus
    priority?: $Enums.OrderPriority
    clinicalInfo?: string | null
    orderedAt?: Date | string
    collectedAt?: Date | string | null
    completedAt?: Date | string | null
    reportUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabOrderCreateOrConnectWithoutTestsInput = {
    where: LabOrderWhereUniqueInput
    create: XOR<LabOrderCreateWithoutTestsInput, LabOrderUncheckedCreateWithoutTestsInput>
  }

  export type LabResultCreateWithoutTestInput = {
    id?: string
    componentName: string
    componentCode?: string | null
    numericValue?: number | null
    value: string
    unit?: string | null
    referenceRange?: string | null
    isAbnormal?: boolean
    isCritical?: boolean
    abnormalFlag?: string | null
    notes?: string | null
    interpretation?: string | null
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    resultedAt?: Date | string
    createdAt?: Date | string
  }

  export type LabResultUncheckedCreateWithoutTestInput = {
    id?: string
    componentName: string
    componentCode?: string | null
    numericValue?: number | null
    value: string
    unit?: string | null
    referenceRange?: string | null
    isAbnormal?: boolean
    isCritical?: boolean
    abnormalFlag?: string | null
    notes?: string | null
    interpretation?: string | null
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    resultedAt?: Date | string
    createdAt?: Date | string
  }

  export type LabResultCreateOrConnectWithoutTestInput = {
    where: LabResultWhereUniqueInput
    create: XOR<LabResultCreateWithoutTestInput, LabResultUncheckedCreateWithoutTestInput>
  }

  export type LabResultCreateManyTestInputEnvelope = {
    data: LabResultCreateManyTestInput | LabResultCreateManyTestInput[]
    skipDuplicates?: boolean
  }

  export type LabOrderUpsertWithoutTestsInput = {
    update: XOR<LabOrderUpdateWithoutTestsInput, LabOrderUncheckedUpdateWithoutTestsInput>
    create: XOR<LabOrderCreateWithoutTestsInput, LabOrderUncheckedCreateWithoutTestsInput>
    where?: LabOrderWhereInput
  }

  export type LabOrderUpdateToOneWithWhereWithoutTestsInput = {
    where?: LabOrderWhereInput
    data: XOR<LabOrderUpdateWithoutTestsInput, LabOrderUncheckedUpdateWithoutTestsInput>
  }

  export type LabOrderUpdateWithoutTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    priority?: EnumOrderPriorityFieldUpdateOperationsInput | $Enums.OrderPriority
    clinicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    orderedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabOrderUncheckedUpdateWithoutTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: StringFieldUpdateOperationsInput | string
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    priority?: EnumOrderPriorityFieldUpdateOperationsInput | $Enums.OrderPriority
    clinicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    orderedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabResultUpsertWithWhereUniqueWithoutTestInput = {
    where: LabResultWhereUniqueInput
    update: XOR<LabResultUpdateWithoutTestInput, LabResultUncheckedUpdateWithoutTestInput>
    create: XOR<LabResultCreateWithoutTestInput, LabResultUncheckedCreateWithoutTestInput>
  }

  export type LabResultUpdateWithWhereUniqueWithoutTestInput = {
    where: LabResultWhereUniqueInput
    data: XOR<LabResultUpdateWithoutTestInput, LabResultUncheckedUpdateWithoutTestInput>
  }

  export type LabResultUpdateManyWithWhereWithoutTestInput = {
    where: LabResultScalarWhereInput
    data: XOR<LabResultUpdateManyMutationInput, LabResultUncheckedUpdateManyWithoutTestInput>
  }

  export type LabResultScalarWhereInput = {
    AND?: LabResultScalarWhereInput | LabResultScalarWhereInput[]
    OR?: LabResultScalarWhereInput[]
    NOT?: LabResultScalarWhereInput | LabResultScalarWhereInput[]
    id?: StringFilter<"LabResult"> | string
    testId?: StringFilter<"LabResult"> | string
    componentName?: StringFilter<"LabResult"> | string
    componentCode?: StringNullableFilter<"LabResult"> | string | null
    numericValue?: FloatNullableFilter<"LabResult"> | number | null
    value?: StringFilter<"LabResult"> | string
    unit?: StringNullableFilter<"LabResult"> | string | null
    referenceRange?: StringNullableFilter<"LabResult"> | string | null
    isAbnormal?: BoolFilter<"LabResult"> | boolean
    isCritical?: BoolFilter<"LabResult"> | boolean
    abnormalFlag?: StringNullableFilter<"LabResult"> | string | null
    notes?: StringNullableFilter<"LabResult"> | string | null
    interpretation?: StringNullableFilter<"LabResult"> | string | null
    verifiedAt?: DateTimeNullableFilter<"LabResult"> | Date | string | null
    performedBy?: StringNullableFilter<"LabResult"> | string | null
    performedAt?: DateTimeNullableFilter<"LabResult"> | Date | string | null
    verifiedBy?: StringNullableFilter<"LabResult"> | string | null
    resultedAt?: DateTimeFilter<"LabResult"> | Date | string
    createdAt?: DateTimeFilter<"LabResult"> | Date | string
  }

  export type LabTestCreateWithoutResultsInput = {
    id?: string
    testCode: string
    testName: string
    category: $Enums.TestCategory
    status?: $Enums.TestStatus
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    order: LabOrderCreateNestedOneWithoutTestsInput
  }

  export type LabTestUncheckedCreateWithoutResultsInput = {
    id?: string
    orderId: string
    testCode: string
    testName: string
    category: $Enums.TestCategory
    status?: $Enums.TestStatus
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabTestCreateOrConnectWithoutResultsInput = {
    where: LabTestWhereUniqueInput
    create: XOR<LabTestCreateWithoutResultsInput, LabTestUncheckedCreateWithoutResultsInput>
  }

  export type LabTestUpsertWithoutResultsInput = {
    update: XOR<LabTestUpdateWithoutResultsInput, LabTestUncheckedUpdateWithoutResultsInput>
    create: XOR<LabTestCreateWithoutResultsInput, LabTestUncheckedCreateWithoutResultsInput>
    where?: LabTestWhereInput
  }

  export type LabTestUpdateToOneWithWhereWithoutResultsInput = {
    where?: LabTestWhereInput
    data: XOR<LabTestUpdateWithoutResultsInput, LabTestUncheckedUpdateWithoutResultsInput>
  }

  export type LabTestUpdateWithoutResultsInput = {
    id?: StringFieldUpdateOperationsInput | string
    testCode?: StringFieldUpdateOperationsInput | string
    testName?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: LabOrderUpdateOneRequiredWithoutTestsNestedInput
  }

  export type LabTestUncheckedUpdateWithoutResultsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    testCode?: StringFieldUpdateOperationsInput | string
    testName?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabTestCreateManyOrderInput = {
    id?: string
    testCode: string
    testName: string
    category: $Enums.TestCategory
    status?: $Enums.TestStatus
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabTestUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    testCode?: StringFieldUpdateOperationsInput | string
    testName?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    results?: LabResultUpdateManyWithoutTestNestedInput
  }

  export type LabTestUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    testCode?: StringFieldUpdateOperationsInput | string
    testName?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    results?: LabResultUncheckedUpdateManyWithoutTestNestedInput
  }

  export type LabTestUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    testCode?: StringFieldUpdateOperationsInput | string
    testName?: StringFieldUpdateOperationsInput | string
    category?: EnumTestCategoryFieldUpdateOperationsInput | $Enums.TestCategory
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabResultCreateManyTestInput = {
    id?: string
    componentName: string
    componentCode?: string | null
    numericValue?: number | null
    value: string
    unit?: string | null
    referenceRange?: string | null
    isAbnormal?: boolean
    isCritical?: boolean
    abnormalFlag?: string | null
    notes?: string | null
    interpretation?: string | null
    verifiedAt?: Date | string | null
    performedBy?: string | null
    performedAt?: Date | string | null
    verifiedBy?: string | null
    resultedAt?: Date | string
    createdAt?: Date | string
  }

  export type LabResultUpdateWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentName?: StringFieldUpdateOperationsInput | string
    componentCode?: NullableStringFieldUpdateOperationsInput | string | null
    numericValue?: NullableFloatFieldUpdateOperationsInput | number | null
    value?: StringFieldUpdateOperationsInput | string
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRange?: NullableStringFieldUpdateOperationsInput | string | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    isCritical?: BoolFieldUpdateOperationsInput | boolean
    abnormalFlag?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    interpretation?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    resultedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabResultUncheckedUpdateWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentName?: StringFieldUpdateOperationsInput | string
    componentCode?: NullableStringFieldUpdateOperationsInput | string | null
    numericValue?: NullableFloatFieldUpdateOperationsInput | number | null
    value?: StringFieldUpdateOperationsInput | string
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRange?: NullableStringFieldUpdateOperationsInput | string | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    isCritical?: BoolFieldUpdateOperationsInput | boolean
    abnormalFlag?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    interpretation?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    resultedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabResultUncheckedUpdateManyWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentName?: StringFieldUpdateOperationsInput | string
    componentCode?: NullableStringFieldUpdateOperationsInput | string | null
    numericValue?: NullableFloatFieldUpdateOperationsInput | number | null
    value?: StringFieldUpdateOperationsInput | string
    unit?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRange?: NullableStringFieldUpdateOperationsInput | string | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    isCritical?: BoolFieldUpdateOperationsInput | boolean
    abnormalFlag?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    interpretation?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    performedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    resultedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use LabOrderCountOutputTypeDefaultArgs instead
     */
    export type LabOrderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LabOrderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LabTestCountOutputTypeDefaultArgs instead
     */
    export type LabTestCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LabTestCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LabOrderDefaultArgs instead
     */
    export type LabOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LabOrderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LabTestDefaultArgs instead
     */
    export type LabTestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LabTestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LabResultDefaultArgs instead
     */
    export type LabResultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LabResultDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DiagnosticTestDefaultArgs instead
     */
    export type DiagnosticTestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DiagnosticTestDefaultArgs<ExtArgs>

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