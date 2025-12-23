
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
 * Model Appointment
 * 
 */
export type Appointment = $Result.DefaultSelection<Prisma.$AppointmentPayload>
/**
 * Model Visit
 * 
 */
export type Visit = $Result.DefaultSelection<Prisma.$VisitPayload>
/**
 * Model ChatMessage
 * 
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>
/**
 * Model ProviderAvailability
 * 
 */
export type ProviderAvailability = $Result.DefaultSelection<Prisma.$ProviderAvailabilityPayload>
/**
 * Model ProviderBreak
 * 
 */
export type ProviderBreak = $Result.DefaultSelection<Prisma.$ProviderBreakPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AppointmentType: {
  video: 'video',
  audio: 'audio',
  chat: 'chat',
  in_person: 'in_person'
};

export type AppointmentType = (typeof AppointmentType)[keyof typeof AppointmentType]


export const AppointmentStatus: {
  scheduled: 'scheduled',
  confirmed: 'confirmed',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'no_show'
};

export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus]


export const VisitStatus: {
  waiting: 'waiting',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled'
};

export type VisitStatus = (typeof VisitStatus)[keyof typeof VisitStatus]

}

export type AppointmentType = $Enums.AppointmentType

export const AppointmentType: typeof $Enums.AppointmentType

export type AppointmentStatus = $Enums.AppointmentStatus

export const AppointmentStatus: typeof $Enums.AppointmentStatus

export type VisitStatus = $Enums.VisitStatus

export const VisitStatus: typeof $Enums.VisitStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Appointments
 * const appointments = await prisma.appointment.findMany()
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
   * // Fetch zero or more Appointments
   * const appointments = await prisma.appointment.findMany()
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
   * `prisma.appointment`: Exposes CRUD operations for the **Appointment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Appointments
    * const appointments = await prisma.appointment.findMany()
    * ```
    */
  get appointment(): Prisma.AppointmentDelegate<ExtArgs>;

  /**
   * `prisma.visit`: Exposes CRUD operations for the **Visit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Visits
    * const visits = await prisma.visit.findMany()
    * ```
    */
  get visit(): Prisma.VisitDelegate<ExtArgs>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs>;

  /**
   * `prisma.providerAvailability`: Exposes CRUD operations for the **ProviderAvailability** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProviderAvailabilities
    * const providerAvailabilities = await prisma.providerAvailability.findMany()
    * ```
    */
  get providerAvailability(): Prisma.ProviderAvailabilityDelegate<ExtArgs>;

  /**
   * `prisma.providerBreak`: Exposes CRUD operations for the **ProviderBreak** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProviderBreaks
    * const providerBreaks = await prisma.providerBreak.findMany()
    * ```
    */
  get providerBreak(): Prisma.ProviderBreakDelegate<ExtArgs>;
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
    Appointment: 'Appointment',
    Visit: 'Visit',
    ChatMessage: 'ChatMessage',
    ProviderAvailability: 'ProviderAvailability',
    ProviderBreak: 'ProviderBreak'
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
      modelProps: "appointment" | "visit" | "chatMessage" | "providerAvailability" | "providerBreak"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Appointment: {
        payload: Prisma.$AppointmentPayload<ExtArgs>
        fields: Prisma.AppointmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppointmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppointmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findFirst: {
            args: Prisma.AppointmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppointmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findMany: {
            args: Prisma.AppointmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          create: {
            args: Prisma.AppointmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          createMany: {
            args: Prisma.AppointmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppointmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          delete: {
            args: Prisma.AppointmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          update: {
            args: Prisma.AppointmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          deleteMany: {
            args: Prisma.AppointmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppointmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AppointmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          aggregate: {
            args: Prisma.AppointmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppointment>
          }
          groupBy: {
            args: Prisma.AppointmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppointmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppointmentCountArgs<ExtArgs>
            result: $Utils.Optional<AppointmentCountAggregateOutputType> | number
          }
        }
      }
      Visit: {
        payload: Prisma.$VisitPayload<ExtArgs>
        fields: Prisma.VisitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VisitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VisitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitPayload>
          }
          findFirst: {
            args: Prisma.VisitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VisitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitPayload>
          }
          findMany: {
            args: Prisma.VisitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitPayload>[]
          }
          create: {
            args: Prisma.VisitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitPayload>
          }
          createMany: {
            args: Prisma.VisitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VisitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitPayload>[]
          }
          delete: {
            args: Prisma.VisitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitPayload>
          }
          update: {
            args: Prisma.VisitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitPayload>
          }
          deleteMany: {
            args: Prisma.VisitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VisitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VisitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitPayload>
          }
          aggregate: {
            args: Prisma.VisitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVisit>
          }
          groupBy: {
            args: Prisma.VisitGroupByArgs<ExtArgs>
            result: $Utils.Optional<VisitGroupByOutputType>[]
          }
          count: {
            args: Prisma.VisitCountArgs<ExtArgs>
            result: $Utils.Optional<VisitCountAggregateOutputType> | number
          }
        }
      }
      ChatMessage: {
        payload: Prisma.$ChatMessagePayload<ExtArgs>
        fields: Prisma.ChatMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findFirst: {
            args: Prisma.ChatMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findMany: {
            args: Prisma.ChatMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          create: {
            args: Prisma.ChatMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          createMany: {
            args: Prisma.ChatMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          delete: {
            args: Prisma.ChatMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          update: {
            args: Prisma.ChatMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          deleteMany: {
            args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChatMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          aggregate: {
            args: Prisma.ChatMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMessage>
          }
          groupBy: {
            args: Prisma.ChatMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageCountAggregateOutputType> | number
          }
        }
      }
      ProviderAvailability: {
        payload: Prisma.$ProviderAvailabilityPayload<ExtArgs>
        fields: Prisma.ProviderAvailabilityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProviderAvailabilityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAvailabilityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProviderAvailabilityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAvailabilityPayload>
          }
          findFirst: {
            args: Prisma.ProviderAvailabilityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAvailabilityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProviderAvailabilityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAvailabilityPayload>
          }
          findMany: {
            args: Prisma.ProviderAvailabilityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAvailabilityPayload>[]
          }
          create: {
            args: Prisma.ProviderAvailabilityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAvailabilityPayload>
          }
          createMany: {
            args: Prisma.ProviderAvailabilityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProviderAvailabilityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAvailabilityPayload>[]
          }
          delete: {
            args: Prisma.ProviderAvailabilityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAvailabilityPayload>
          }
          update: {
            args: Prisma.ProviderAvailabilityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAvailabilityPayload>
          }
          deleteMany: {
            args: Prisma.ProviderAvailabilityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProviderAvailabilityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProviderAvailabilityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderAvailabilityPayload>
          }
          aggregate: {
            args: Prisma.ProviderAvailabilityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProviderAvailability>
          }
          groupBy: {
            args: Prisma.ProviderAvailabilityGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProviderAvailabilityGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProviderAvailabilityCountArgs<ExtArgs>
            result: $Utils.Optional<ProviderAvailabilityCountAggregateOutputType> | number
          }
        }
      }
      ProviderBreak: {
        payload: Prisma.$ProviderBreakPayload<ExtArgs>
        fields: Prisma.ProviderBreakFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProviderBreakFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderBreakPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProviderBreakFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderBreakPayload>
          }
          findFirst: {
            args: Prisma.ProviderBreakFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderBreakPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProviderBreakFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderBreakPayload>
          }
          findMany: {
            args: Prisma.ProviderBreakFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderBreakPayload>[]
          }
          create: {
            args: Prisma.ProviderBreakCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderBreakPayload>
          }
          createMany: {
            args: Prisma.ProviderBreakCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProviderBreakCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderBreakPayload>[]
          }
          delete: {
            args: Prisma.ProviderBreakDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderBreakPayload>
          }
          update: {
            args: Prisma.ProviderBreakUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderBreakPayload>
          }
          deleteMany: {
            args: Prisma.ProviderBreakDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProviderBreakUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProviderBreakUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderBreakPayload>
          }
          aggregate: {
            args: Prisma.ProviderBreakAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProviderBreak>
          }
          groupBy: {
            args: Prisma.ProviderBreakGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProviderBreakGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProviderBreakCountArgs<ExtArgs>
            result: $Utils.Optional<ProviderBreakCountAggregateOutputType> | number
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
   * Count Type VisitCountOutputType
   */

  export type VisitCountOutputType = {
    messages: number
  }

  export type VisitCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | VisitCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * VisitCountOutputType without action
   */
  export type VisitCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitCountOutputType
     */
    select?: VisitCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VisitCountOutputType without action
   */
  export type VisitCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Appointment
   */

  export type AggregateAppointment = {
    _count: AppointmentCountAggregateOutputType | null
    _avg: AppointmentAvgAggregateOutputType | null
    _sum: AppointmentSumAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  export type AppointmentAvgAggregateOutputType = {
    duration: number | null
  }

  export type AppointmentSumAggregateOutputType = {
    duration: number | null
  }

  export type AppointmentMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    scheduledAt: Date | null
    duration: number | null
    type: $Enums.AppointmentType | null
    status: $Enums.AppointmentStatus | null
    reasonForVisit: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    scheduledAt: Date | null
    duration: number | null
    type: $Enums.AppointmentType | null
    status: $Enums.AppointmentStatus | null
    reasonForVisit: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentCountAggregateOutputType = {
    id: number
    patientId: number
    providerId: number
    scheduledAt: number
    duration: number
    type: number
    status: number
    reasonForVisit: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AppointmentAvgAggregateInputType = {
    duration?: true
  }

  export type AppointmentSumAggregateInputType = {
    duration?: true
  }

  export type AppointmentMinAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    scheduledAt?: true
    duration?: true
    type?: true
    status?: true
    reasonForVisit?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentMaxAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    scheduledAt?: true
    duration?: true
    type?: true
    status?: true
    reasonForVisit?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentCountAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    scheduledAt?: true
    duration?: true
    type?: true
    status?: true
    reasonForVisit?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AppointmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointment to aggregate.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Appointments
    **/
    _count?: true | AppointmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AppointmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AppointmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppointmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppointmentMaxAggregateInputType
  }

  export type GetAppointmentAggregateType<T extends AppointmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAppointment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppointment[P]>
      : GetScalarType<T[P], AggregateAppointment[P]>
  }




  export type AppointmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithAggregationInput | AppointmentOrderByWithAggregationInput[]
    by: AppointmentScalarFieldEnum[] | AppointmentScalarFieldEnum
    having?: AppointmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppointmentCountAggregateInputType | true
    _avg?: AppointmentAvgAggregateInputType
    _sum?: AppointmentSumAggregateInputType
    _min?: AppointmentMinAggregateInputType
    _max?: AppointmentMaxAggregateInputType
  }

  export type AppointmentGroupByOutputType = {
    id: string
    patientId: string
    providerId: string
    scheduledAt: Date
    duration: number
    type: $Enums.AppointmentType
    status: $Enums.AppointmentStatus
    reasonForVisit: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: AppointmentCountAggregateOutputType | null
    _avg: AppointmentAvgAggregateOutputType | null
    _sum: AppointmentSumAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  type GetAppointmentGroupByPayload<T extends AppointmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppointmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppointmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
            : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
        }
      >
    >


  export type AppointmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    scheduledAt?: boolean
    duration?: boolean
    type?: boolean
    status?: boolean
    reasonForVisit?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    visit?: boolean | Appointment$visitArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    scheduledAt?: boolean
    duration?: boolean
    type?: boolean
    status?: boolean
    reasonForVisit?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectScalar = {
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    scheduledAt?: boolean
    duration?: boolean
    type?: boolean
    status?: boolean
    reasonForVisit?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AppointmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    visit?: boolean | Appointment$visitArgs<ExtArgs>
  }
  export type AppointmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AppointmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Appointment"
    objects: {
      visit: Prisma.$VisitPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      providerId: string
      scheduledAt: Date
      duration: number
      type: $Enums.AppointmentType
      status: $Enums.AppointmentStatus
      reasonForVisit: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["appointment"]>
    composites: {}
  }

  type AppointmentGetPayload<S extends boolean | null | undefined | AppointmentDefaultArgs> = $Result.GetResult<Prisma.$AppointmentPayload, S>

  type AppointmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AppointmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AppointmentCountAggregateInputType | true
    }

  export interface AppointmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Appointment'], meta: { name: 'Appointment' } }
    /**
     * Find zero or one Appointment that matches the filter.
     * @param {AppointmentFindUniqueArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppointmentFindUniqueArgs>(args: SelectSubset<T, AppointmentFindUniqueArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Appointment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AppointmentFindUniqueOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppointmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AppointmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Appointment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppointmentFindFirstArgs>(args?: SelectSubset<T, AppointmentFindFirstArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Appointment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppointmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AppointmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Appointments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appointments
     * const appointments = await prisma.appointment.findMany()
     * 
     * // Get first 10 Appointments
     * const appointments = await prisma.appointment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appointmentWithIdOnly = await prisma.appointment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppointmentFindManyArgs>(args?: SelectSubset<T, AppointmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Appointment.
     * @param {AppointmentCreateArgs} args - Arguments to create a Appointment.
     * @example
     * // Create one Appointment
     * const Appointment = await prisma.appointment.create({
     *   data: {
     *     // ... data to create a Appointment
     *   }
     * })
     * 
     */
    create<T extends AppointmentCreateArgs>(args: SelectSubset<T, AppointmentCreateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Appointments.
     * @param {AppointmentCreateManyArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppointmentCreateManyArgs>(args?: SelectSubset<T, AppointmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Appointments and returns the data saved in the database.
     * @param {AppointmentCreateManyAndReturnArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppointmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AppointmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Appointment.
     * @param {AppointmentDeleteArgs} args - Arguments to delete one Appointment.
     * @example
     * // Delete one Appointment
     * const Appointment = await prisma.appointment.delete({
     *   where: {
     *     // ... filter to delete one Appointment
     *   }
     * })
     * 
     */
    delete<T extends AppointmentDeleteArgs>(args: SelectSubset<T, AppointmentDeleteArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Appointment.
     * @param {AppointmentUpdateArgs} args - Arguments to update one Appointment.
     * @example
     * // Update one Appointment
     * const appointment = await prisma.appointment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppointmentUpdateArgs>(args: SelectSubset<T, AppointmentUpdateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Appointments.
     * @param {AppointmentDeleteManyArgs} args - Arguments to filter Appointments to delete.
     * @example
     * // Delete a few Appointments
     * const { count } = await prisma.appointment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppointmentDeleteManyArgs>(args?: SelectSubset<T, AppointmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppointmentUpdateManyArgs>(args: SelectSubset<T, AppointmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Appointment.
     * @param {AppointmentUpsertArgs} args - Arguments to update or create a Appointment.
     * @example
     * // Update or create a Appointment
     * const appointment = await prisma.appointment.upsert({
     *   create: {
     *     // ... data to create a Appointment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appointment we want to update
     *   }
     * })
     */
    upsert<T extends AppointmentUpsertArgs>(args: SelectSubset<T, AppointmentUpsertArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentCountArgs} args - Arguments to filter Appointments to count.
     * @example
     * // Count the number of Appointments
     * const count = await prisma.appointment.count({
     *   where: {
     *     // ... the filter for the Appointments we want to count
     *   }
     * })
    **/
    count<T extends AppointmentCountArgs>(
      args?: Subset<T, AppointmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppointmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AppointmentAggregateArgs>(args: Subset<T, AppointmentAggregateArgs>): Prisma.PrismaPromise<GetAppointmentAggregateType<T>>

    /**
     * Group by Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentGroupByArgs} args - Group by arguments.
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
      T extends AppointmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppointmentGroupByArgs['orderBy'] }
        : { orderBy?: AppointmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AppointmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Appointment model
   */
  readonly fields: AppointmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Appointment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppointmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    visit<T extends Appointment$visitArgs<ExtArgs> = {}>(args?: Subset<T, Appointment$visitArgs<ExtArgs>>): Prisma__VisitClient<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the Appointment model
   */ 
  interface AppointmentFieldRefs {
    readonly id: FieldRef<"Appointment", 'String'>
    readonly patientId: FieldRef<"Appointment", 'String'>
    readonly providerId: FieldRef<"Appointment", 'String'>
    readonly scheduledAt: FieldRef<"Appointment", 'DateTime'>
    readonly duration: FieldRef<"Appointment", 'Int'>
    readonly type: FieldRef<"Appointment", 'AppointmentType'>
    readonly status: FieldRef<"Appointment", 'AppointmentStatus'>
    readonly reasonForVisit: FieldRef<"Appointment", 'String'>
    readonly notes: FieldRef<"Appointment", 'String'>
    readonly createdAt: FieldRef<"Appointment", 'DateTime'>
    readonly updatedAt: FieldRef<"Appointment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Appointment findUnique
   */
  export type AppointmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findUniqueOrThrow
   */
  export type AppointmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findFirst
   */
  export type AppointmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findFirstOrThrow
   */
  export type AppointmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findMany
   */
  export type AppointmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointments to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment create
   */
  export type AppointmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Appointment.
     */
    data: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
  }

  /**
   * Appointment createMany
   */
  export type AppointmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Appointment createManyAndReturn
   */
  export type AppointmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Appointment update
   */
  export type AppointmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Appointment.
     */
    data: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
    /**
     * Choose, which Appointment to update.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment updateMany
   */
  export type AppointmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
  }

  /**
   * Appointment upsert
   */
  export type AppointmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Appointment to update in case it exists.
     */
    where: AppointmentWhereUniqueInput
    /**
     * In case the Appointment found by the `where` argument doesn't exist, create a new Appointment with this data.
     */
    create: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
    /**
     * In case the Appointment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
  }

  /**
   * Appointment delete
   */
  export type AppointmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter which Appointment to delete.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment deleteMany
   */
  export type AppointmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointments to delete
     */
    where?: AppointmentWhereInput
  }

  /**
   * Appointment.visit
   */
  export type Appointment$visitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitInclude<ExtArgs> | null
    where?: VisitWhereInput
  }

  /**
   * Appointment without action
   */
  export type AppointmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
  }


  /**
   * Model Visit
   */

  export type AggregateVisit = {
    _count: VisitCountAggregateOutputType | null
    _min: VisitMinAggregateOutputType | null
    _max: VisitMaxAggregateOutputType | null
  }

  export type VisitMinAggregateOutputType = {
    id: string | null
    appointmentId: string | null
    sessionToken: string | null
    status: $Enums.VisitStatus | null
    startedAt: Date | null
    endedAt: Date | null
    roomId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VisitMaxAggregateOutputType = {
    id: string | null
    appointmentId: string | null
    sessionToken: string | null
    status: $Enums.VisitStatus | null
    startedAt: Date | null
    endedAt: Date | null
    roomId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VisitCountAggregateOutputType = {
    id: number
    appointmentId: number
    sessionToken: number
    status: number
    startedAt: number
    endedAt: number
    roomId: number
    iceServers: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VisitMinAggregateInputType = {
    id?: true
    appointmentId?: true
    sessionToken?: true
    status?: true
    startedAt?: true
    endedAt?: true
    roomId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VisitMaxAggregateInputType = {
    id?: true
    appointmentId?: true
    sessionToken?: true
    status?: true
    startedAt?: true
    endedAt?: true
    roomId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VisitCountAggregateInputType = {
    id?: true
    appointmentId?: true
    sessionToken?: true
    status?: true
    startedAt?: true
    endedAt?: true
    roomId?: true
    iceServers?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VisitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Visit to aggregate.
     */
    where?: VisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Visits to fetch.
     */
    orderBy?: VisitOrderByWithRelationInput | VisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Visits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Visits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Visits
    **/
    _count?: true | VisitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VisitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VisitMaxAggregateInputType
  }

  export type GetVisitAggregateType<T extends VisitAggregateArgs> = {
        [P in keyof T & keyof AggregateVisit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVisit[P]>
      : GetScalarType<T[P], AggregateVisit[P]>
  }




  export type VisitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisitWhereInput
    orderBy?: VisitOrderByWithAggregationInput | VisitOrderByWithAggregationInput[]
    by: VisitScalarFieldEnum[] | VisitScalarFieldEnum
    having?: VisitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VisitCountAggregateInputType | true
    _min?: VisitMinAggregateInputType
    _max?: VisitMaxAggregateInputType
  }

  export type VisitGroupByOutputType = {
    id: string
    appointmentId: string
    sessionToken: string
    status: $Enums.VisitStatus
    startedAt: Date | null
    endedAt: Date | null
    roomId: string
    iceServers: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: VisitCountAggregateOutputType | null
    _min: VisitMinAggregateOutputType | null
    _max: VisitMaxAggregateOutputType | null
  }

  type GetVisitGroupByPayload<T extends VisitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VisitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VisitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VisitGroupByOutputType[P]>
            : GetScalarType<T[P], VisitGroupByOutputType[P]>
        }
      >
    >


  export type VisitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appointmentId?: boolean
    sessionToken?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    roomId?: boolean
    iceServers?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
    messages?: boolean | Visit$messagesArgs<ExtArgs>
    _count?: boolean | VisitCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visit"]>

  export type VisitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appointmentId?: boolean
    sessionToken?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    roomId?: boolean
    iceServers?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visit"]>

  export type VisitSelectScalar = {
    id?: boolean
    appointmentId?: boolean
    sessionToken?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    roomId?: boolean
    iceServers?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VisitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
    messages?: boolean | Visit$messagesArgs<ExtArgs>
    _count?: boolean | VisitCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VisitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }

  export type $VisitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Visit"
    objects: {
      appointment: Prisma.$AppointmentPayload<ExtArgs>
      messages: Prisma.$ChatMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      appointmentId: string
      sessionToken: string
      status: $Enums.VisitStatus
      startedAt: Date | null
      endedAt: Date | null
      roomId: string
      iceServers: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["visit"]>
    composites: {}
  }

  type VisitGetPayload<S extends boolean | null | undefined | VisitDefaultArgs> = $Result.GetResult<Prisma.$VisitPayload, S>

  type VisitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VisitFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VisitCountAggregateInputType | true
    }

  export interface VisitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Visit'], meta: { name: 'Visit' } }
    /**
     * Find zero or one Visit that matches the filter.
     * @param {VisitFindUniqueArgs} args - Arguments to find a Visit
     * @example
     * // Get one Visit
     * const visit = await prisma.visit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VisitFindUniqueArgs>(args: SelectSubset<T, VisitFindUniqueArgs<ExtArgs>>): Prisma__VisitClient<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Visit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VisitFindUniqueOrThrowArgs} args - Arguments to find a Visit
     * @example
     * // Get one Visit
     * const visit = await prisma.visit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VisitFindUniqueOrThrowArgs>(args: SelectSubset<T, VisitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VisitClient<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Visit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitFindFirstArgs} args - Arguments to find a Visit
     * @example
     * // Get one Visit
     * const visit = await prisma.visit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VisitFindFirstArgs>(args?: SelectSubset<T, VisitFindFirstArgs<ExtArgs>>): Prisma__VisitClient<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Visit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitFindFirstOrThrowArgs} args - Arguments to find a Visit
     * @example
     * // Get one Visit
     * const visit = await prisma.visit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VisitFindFirstOrThrowArgs>(args?: SelectSubset<T, VisitFindFirstOrThrowArgs<ExtArgs>>): Prisma__VisitClient<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Visits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Visits
     * const visits = await prisma.visit.findMany()
     * 
     * // Get first 10 Visits
     * const visits = await prisma.visit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const visitWithIdOnly = await prisma.visit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VisitFindManyArgs>(args?: SelectSubset<T, VisitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Visit.
     * @param {VisitCreateArgs} args - Arguments to create a Visit.
     * @example
     * // Create one Visit
     * const Visit = await prisma.visit.create({
     *   data: {
     *     // ... data to create a Visit
     *   }
     * })
     * 
     */
    create<T extends VisitCreateArgs>(args: SelectSubset<T, VisitCreateArgs<ExtArgs>>): Prisma__VisitClient<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Visits.
     * @param {VisitCreateManyArgs} args - Arguments to create many Visits.
     * @example
     * // Create many Visits
     * const visit = await prisma.visit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VisitCreateManyArgs>(args?: SelectSubset<T, VisitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Visits and returns the data saved in the database.
     * @param {VisitCreateManyAndReturnArgs} args - Arguments to create many Visits.
     * @example
     * // Create many Visits
     * const visit = await prisma.visit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Visits and only return the `id`
     * const visitWithIdOnly = await prisma.visit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VisitCreateManyAndReturnArgs>(args?: SelectSubset<T, VisitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Visit.
     * @param {VisitDeleteArgs} args - Arguments to delete one Visit.
     * @example
     * // Delete one Visit
     * const Visit = await prisma.visit.delete({
     *   where: {
     *     // ... filter to delete one Visit
     *   }
     * })
     * 
     */
    delete<T extends VisitDeleteArgs>(args: SelectSubset<T, VisitDeleteArgs<ExtArgs>>): Prisma__VisitClient<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Visit.
     * @param {VisitUpdateArgs} args - Arguments to update one Visit.
     * @example
     * // Update one Visit
     * const visit = await prisma.visit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VisitUpdateArgs>(args: SelectSubset<T, VisitUpdateArgs<ExtArgs>>): Prisma__VisitClient<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Visits.
     * @param {VisitDeleteManyArgs} args - Arguments to filter Visits to delete.
     * @example
     * // Delete a few Visits
     * const { count } = await prisma.visit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VisitDeleteManyArgs>(args?: SelectSubset<T, VisitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Visits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Visits
     * const visit = await prisma.visit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VisitUpdateManyArgs>(args: SelectSubset<T, VisitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Visit.
     * @param {VisitUpsertArgs} args - Arguments to update or create a Visit.
     * @example
     * // Update or create a Visit
     * const visit = await prisma.visit.upsert({
     *   create: {
     *     // ... data to create a Visit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Visit we want to update
     *   }
     * })
     */
    upsert<T extends VisitUpsertArgs>(args: SelectSubset<T, VisitUpsertArgs<ExtArgs>>): Prisma__VisitClient<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Visits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitCountArgs} args - Arguments to filter Visits to count.
     * @example
     * // Count the number of Visits
     * const count = await prisma.visit.count({
     *   where: {
     *     // ... the filter for the Visits we want to count
     *   }
     * })
    **/
    count<T extends VisitCountArgs>(
      args?: Subset<T, VisitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VisitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Visit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VisitAggregateArgs>(args: Subset<T, VisitAggregateArgs>): Prisma.PrismaPromise<GetVisitAggregateType<T>>

    /**
     * Group by Visit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitGroupByArgs} args - Group by arguments.
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
      T extends VisitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VisitGroupByArgs['orderBy'] }
        : { orderBy?: VisitGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VisitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVisitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Visit model
   */
  readonly fields: VisitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Visit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VisitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointment<T extends AppointmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AppointmentDefaultArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    messages<T extends Visit$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Visit$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Visit model
   */ 
  interface VisitFieldRefs {
    readonly id: FieldRef<"Visit", 'String'>
    readonly appointmentId: FieldRef<"Visit", 'String'>
    readonly sessionToken: FieldRef<"Visit", 'String'>
    readonly status: FieldRef<"Visit", 'VisitStatus'>
    readonly startedAt: FieldRef<"Visit", 'DateTime'>
    readonly endedAt: FieldRef<"Visit", 'DateTime'>
    readonly roomId: FieldRef<"Visit", 'String'>
    readonly iceServers: FieldRef<"Visit", 'Json'>
    readonly createdAt: FieldRef<"Visit", 'DateTime'>
    readonly updatedAt: FieldRef<"Visit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Visit findUnique
   */
  export type VisitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitInclude<ExtArgs> | null
    /**
     * Filter, which Visit to fetch.
     */
    where: VisitWhereUniqueInput
  }

  /**
   * Visit findUniqueOrThrow
   */
  export type VisitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitInclude<ExtArgs> | null
    /**
     * Filter, which Visit to fetch.
     */
    where: VisitWhereUniqueInput
  }

  /**
   * Visit findFirst
   */
  export type VisitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitInclude<ExtArgs> | null
    /**
     * Filter, which Visit to fetch.
     */
    where?: VisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Visits to fetch.
     */
    orderBy?: VisitOrderByWithRelationInput | VisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Visits.
     */
    cursor?: VisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Visits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Visits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Visits.
     */
    distinct?: VisitScalarFieldEnum | VisitScalarFieldEnum[]
  }

  /**
   * Visit findFirstOrThrow
   */
  export type VisitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitInclude<ExtArgs> | null
    /**
     * Filter, which Visit to fetch.
     */
    where?: VisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Visits to fetch.
     */
    orderBy?: VisitOrderByWithRelationInput | VisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Visits.
     */
    cursor?: VisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Visits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Visits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Visits.
     */
    distinct?: VisitScalarFieldEnum | VisitScalarFieldEnum[]
  }

  /**
   * Visit findMany
   */
  export type VisitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitInclude<ExtArgs> | null
    /**
     * Filter, which Visits to fetch.
     */
    where?: VisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Visits to fetch.
     */
    orderBy?: VisitOrderByWithRelationInput | VisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Visits.
     */
    cursor?: VisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Visits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Visits.
     */
    skip?: number
    distinct?: VisitScalarFieldEnum | VisitScalarFieldEnum[]
  }

  /**
   * Visit create
   */
  export type VisitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitInclude<ExtArgs> | null
    /**
     * The data needed to create a Visit.
     */
    data: XOR<VisitCreateInput, VisitUncheckedCreateInput>
  }

  /**
   * Visit createMany
   */
  export type VisitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Visits.
     */
    data: VisitCreateManyInput | VisitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Visit createManyAndReturn
   */
  export type VisitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Visits.
     */
    data: VisitCreateManyInput | VisitCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Visit update
   */
  export type VisitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitInclude<ExtArgs> | null
    /**
     * The data needed to update a Visit.
     */
    data: XOR<VisitUpdateInput, VisitUncheckedUpdateInput>
    /**
     * Choose, which Visit to update.
     */
    where: VisitWhereUniqueInput
  }

  /**
   * Visit updateMany
   */
  export type VisitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Visits.
     */
    data: XOR<VisitUpdateManyMutationInput, VisitUncheckedUpdateManyInput>
    /**
     * Filter which Visits to update
     */
    where?: VisitWhereInput
  }

  /**
   * Visit upsert
   */
  export type VisitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitInclude<ExtArgs> | null
    /**
     * The filter to search for the Visit to update in case it exists.
     */
    where: VisitWhereUniqueInput
    /**
     * In case the Visit found by the `where` argument doesn't exist, create a new Visit with this data.
     */
    create: XOR<VisitCreateInput, VisitUncheckedCreateInput>
    /**
     * In case the Visit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VisitUpdateInput, VisitUncheckedUpdateInput>
  }

  /**
   * Visit delete
   */
  export type VisitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitInclude<ExtArgs> | null
    /**
     * Filter which Visit to delete.
     */
    where: VisitWhereUniqueInput
  }

  /**
   * Visit deleteMany
   */
  export type VisitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Visits to delete
     */
    where?: VisitWhereInput
  }

  /**
   * Visit.messages
   */
  export type Visit$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * Visit without action
   */
  export type VisitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visit
     */
    select?: VisitSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitInclude<ExtArgs> | null
  }


  /**
   * Model ChatMessage
   */

  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: string | null
    visitId: string | null
    senderId: string | null
    senderRole: string | null
    message: string | null
    timestamp: Date | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: string | null
    visitId: string | null
    senderId: string | null
    senderRole: string | null
    message: string | null
    timestamp: Date | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    visitId: number
    senderId: number
    senderRole: number
    message: number
    attachments: number
    timestamp: number
    _all: number
  }


  export type ChatMessageMinAggregateInputType = {
    id?: true
    visitId?: true
    senderId?: true
    senderRole?: true
    message?: true
    timestamp?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    visitId?: true
    senderId?: true
    senderRole?: true
    message?: true
    timestamp?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    visitId?: true
    senderId?: true
    senderRole?: true
    message?: true
    attachments?: true
    timestamp?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithAggregationInput | ChatMessageOrderByWithAggregationInput[]
    by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }

  export type ChatMessageGroupByOutputType = {
    id: string
    visitId: string
    senderId: string
    senderRole: string
    message: string
    attachments: string[]
    timestamp: Date
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    visitId?: boolean
    senderId?: boolean
    senderRole?: boolean
    message?: boolean
    attachments?: boolean
    timestamp?: boolean
    visit?: boolean | VisitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    visitId?: boolean
    senderId?: boolean
    senderRole?: boolean
    message?: boolean
    attachments?: boolean
    timestamp?: boolean
    visit?: boolean | VisitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectScalar = {
    id?: boolean
    visitId?: boolean
    senderId?: boolean
    senderRole?: boolean
    message?: boolean
    attachments?: boolean
    timestamp?: boolean
  }

  export type ChatMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    visit?: boolean | VisitDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    visit?: boolean | VisitDefaultArgs<ExtArgs>
  }

  export type $ChatMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMessage"
    objects: {
      visit: Prisma.$VisitPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      visitId: string
      senderId: string
      senderRole: string
      message: string
      attachments: string[]
      timestamp: Date
    }, ExtArgs["result"]["chatMessage"]>
    composites: {}
  }

  type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = $Result.GetResult<Prisma.$ChatMessagePayload, S>

  type ChatMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'], meta: { name: 'ChatMessage' } }
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
     */
    create<T extends ChatMessageCreateArgs>(args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatMessages and returns the data saved in the database.
     * @param {ChatMessageCreateManyAndReturnArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
     */
    delete<T extends ChatMessageDeleteArgs>(args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMessageUpdateArgs>(args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
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
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMessage model
   */
  readonly fields: ChatMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    visit<T extends VisitDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VisitDefaultArgs<ExtArgs>>): Prisma__VisitClient<$Result.GetResult<Prisma.$VisitPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ChatMessage model
   */ 
  interface ChatMessageFieldRefs {
    readonly id: FieldRef<"ChatMessage", 'String'>
    readonly visitId: FieldRef<"ChatMessage", 'String'>
    readonly senderId: FieldRef<"ChatMessage", 'String'>
    readonly senderRole: FieldRef<"ChatMessage", 'String'>
    readonly message: FieldRef<"ChatMessage", 'String'>
    readonly attachments: FieldRef<"ChatMessage", 'String[]'>
    readonly timestamp: FieldRef<"ChatMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatMessage findUnique
   */
  export type ChatMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findFirst
   */
  export type ChatMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }

  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatMessage createManyAndReturn
   */
  export type ChatMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
  }

  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }

  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
  }

  /**
   * ChatMessage without action
   */
  export type ChatMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
  }


  /**
   * Model ProviderAvailability
   */

  export type AggregateProviderAvailability = {
    _count: ProviderAvailabilityCountAggregateOutputType | null
    _avg: ProviderAvailabilityAvgAggregateOutputType | null
    _sum: ProviderAvailabilitySumAggregateOutputType | null
    _min: ProviderAvailabilityMinAggregateOutputType | null
    _max: ProviderAvailabilityMaxAggregateOutputType | null
  }

  export type ProviderAvailabilityAvgAggregateOutputType = {
    dayOfWeek: number | null
  }

  export type ProviderAvailabilitySumAggregateOutputType = {
    dayOfWeek: number | null
  }

  export type ProviderAvailabilityMinAggregateOutputType = {
    id: string | null
    providerId: string | null
    dayOfWeek: number | null
    startTime: string | null
    endTime: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderAvailabilityMaxAggregateOutputType = {
    id: string | null
    providerId: string | null
    dayOfWeek: number | null
    startTime: string | null
    endTime: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderAvailabilityCountAggregateOutputType = {
    id: number
    providerId: number
    dayOfWeek: number
    startTime: number
    endTime: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProviderAvailabilityAvgAggregateInputType = {
    dayOfWeek?: true
  }

  export type ProviderAvailabilitySumAggregateInputType = {
    dayOfWeek?: true
  }

  export type ProviderAvailabilityMinAggregateInputType = {
    id?: true
    providerId?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderAvailabilityMaxAggregateInputType = {
    id?: true
    providerId?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderAvailabilityCountAggregateInputType = {
    id?: true
    providerId?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProviderAvailabilityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderAvailability to aggregate.
     */
    where?: ProviderAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderAvailabilities to fetch.
     */
    orderBy?: ProviderAvailabilityOrderByWithRelationInput | ProviderAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProviderAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderAvailabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProviderAvailabilities
    **/
    _count?: true | ProviderAvailabilityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProviderAvailabilityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProviderAvailabilitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProviderAvailabilityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProviderAvailabilityMaxAggregateInputType
  }

  export type GetProviderAvailabilityAggregateType<T extends ProviderAvailabilityAggregateArgs> = {
        [P in keyof T & keyof AggregateProviderAvailability]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProviderAvailability[P]>
      : GetScalarType<T[P], AggregateProviderAvailability[P]>
  }




  export type ProviderAvailabilityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProviderAvailabilityWhereInput
    orderBy?: ProviderAvailabilityOrderByWithAggregationInput | ProviderAvailabilityOrderByWithAggregationInput[]
    by: ProviderAvailabilityScalarFieldEnum[] | ProviderAvailabilityScalarFieldEnum
    having?: ProviderAvailabilityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProviderAvailabilityCountAggregateInputType | true
    _avg?: ProviderAvailabilityAvgAggregateInputType
    _sum?: ProviderAvailabilitySumAggregateInputType
    _min?: ProviderAvailabilityMinAggregateInputType
    _max?: ProviderAvailabilityMaxAggregateInputType
  }

  export type ProviderAvailabilityGroupByOutputType = {
    id: string
    providerId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: ProviderAvailabilityCountAggregateOutputType | null
    _avg: ProviderAvailabilityAvgAggregateOutputType | null
    _sum: ProviderAvailabilitySumAggregateOutputType | null
    _min: ProviderAvailabilityMinAggregateOutputType | null
    _max: ProviderAvailabilityMaxAggregateOutputType | null
  }

  type GetProviderAvailabilityGroupByPayload<T extends ProviderAvailabilityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProviderAvailabilityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProviderAvailabilityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProviderAvailabilityGroupByOutputType[P]>
            : GetScalarType<T[P], ProviderAvailabilityGroupByOutputType[P]>
        }
      >
    >


  export type ProviderAvailabilitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    providerId?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["providerAvailability"]>

  export type ProviderAvailabilitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    providerId?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["providerAvailability"]>

  export type ProviderAvailabilitySelectScalar = {
    id?: boolean
    providerId?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $ProviderAvailabilityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProviderAvailability"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      providerId: string
      dayOfWeek: number
      startTime: string
      endTime: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["providerAvailability"]>
    composites: {}
  }

  type ProviderAvailabilityGetPayload<S extends boolean | null | undefined | ProviderAvailabilityDefaultArgs> = $Result.GetResult<Prisma.$ProviderAvailabilityPayload, S>

  type ProviderAvailabilityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProviderAvailabilityFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProviderAvailabilityCountAggregateInputType | true
    }

  export interface ProviderAvailabilityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProviderAvailability'], meta: { name: 'ProviderAvailability' } }
    /**
     * Find zero or one ProviderAvailability that matches the filter.
     * @param {ProviderAvailabilityFindUniqueArgs} args - Arguments to find a ProviderAvailability
     * @example
     * // Get one ProviderAvailability
     * const providerAvailability = await prisma.providerAvailability.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProviderAvailabilityFindUniqueArgs>(args: SelectSubset<T, ProviderAvailabilityFindUniqueArgs<ExtArgs>>): Prisma__ProviderAvailabilityClient<$Result.GetResult<Prisma.$ProviderAvailabilityPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProviderAvailability that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProviderAvailabilityFindUniqueOrThrowArgs} args - Arguments to find a ProviderAvailability
     * @example
     * // Get one ProviderAvailability
     * const providerAvailability = await prisma.providerAvailability.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProviderAvailabilityFindUniqueOrThrowArgs>(args: SelectSubset<T, ProviderAvailabilityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProviderAvailabilityClient<$Result.GetResult<Prisma.$ProviderAvailabilityPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProviderAvailability that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAvailabilityFindFirstArgs} args - Arguments to find a ProviderAvailability
     * @example
     * // Get one ProviderAvailability
     * const providerAvailability = await prisma.providerAvailability.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProviderAvailabilityFindFirstArgs>(args?: SelectSubset<T, ProviderAvailabilityFindFirstArgs<ExtArgs>>): Prisma__ProviderAvailabilityClient<$Result.GetResult<Prisma.$ProviderAvailabilityPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProviderAvailability that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAvailabilityFindFirstOrThrowArgs} args - Arguments to find a ProviderAvailability
     * @example
     * // Get one ProviderAvailability
     * const providerAvailability = await prisma.providerAvailability.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProviderAvailabilityFindFirstOrThrowArgs>(args?: SelectSubset<T, ProviderAvailabilityFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProviderAvailabilityClient<$Result.GetResult<Prisma.$ProviderAvailabilityPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProviderAvailabilities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAvailabilityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProviderAvailabilities
     * const providerAvailabilities = await prisma.providerAvailability.findMany()
     * 
     * // Get first 10 ProviderAvailabilities
     * const providerAvailabilities = await prisma.providerAvailability.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const providerAvailabilityWithIdOnly = await prisma.providerAvailability.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProviderAvailabilityFindManyArgs>(args?: SelectSubset<T, ProviderAvailabilityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderAvailabilityPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProviderAvailability.
     * @param {ProviderAvailabilityCreateArgs} args - Arguments to create a ProviderAvailability.
     * @example
     * // Create one ProviderAvailability
     * const ProviderAvailability = await prisma.providerAvailability.create({
     *   data: {
     *     // ... data to create a ProviderAvailability
     *   }
     * })
     * 
     */
    create<T extends ProviderAvailabilityCreateArgs>(args: SelectSubset<T, ProviderAvailabilityCreateArgs<ExtArgs>>): Prisma__ProviderAvailabilityClient<$Result.GetResult<Prisma.$ProviderAvailabilityPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProviderAvailabilities.
     * @param {ProviderAvailabilityCreateManyArgs} args - Arguments to create many ProviderAvailabilities.
     * @example
     * // Create many ProviderAvailabilities
     * const providerAvailability = await prisma.providerAvailability.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProviderAvailabilityCreateManyArgs>(args?: SelectSubset<T, ProviderAvailabilityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProviderAvailabilities and returns the data saved in the database.
     * @param {ProviderAvailabilityCreateManyAndReturnArgs} args - Arguments to create many ProviderAvailabilities.
     * @example
     * // Create many ProviderAvailabilities
     * const providerAvailability = await prisma.providerAvailability.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProviderAvailabilities and only return the `id`
     * const providerAvailabilityWithIdOnly = await prisma.providerAvailability.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProviderAvailabilityCreateManyAndReturnArgs>(args?: SelectSubset<T, ProviderAvailabilityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderAvailabilityPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProviderAvailability.
     * @param {ProviderAvailabilityDeleteArgs} args - Arguments to delete one ProviderAvailability.
     * @example
     * // Delete one ProviderAvailability
     * const ProviderAvailability = await prisma.providerAvailability.delete({
     *   where: {
     *     // ... filter to delete one ProviderAvailability
     *   }
     * })
     * 
     */
    delete<T extends ProviderAvailabilityDeleteArgs>(args: SelectSubset<T, ProviderAvailabilityDeleteArgs<ExtArgs>>): Prisma__ProviderAvailabilityClient<$Result.GetResult<Prisma.$ProviderAvailabilityPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProviderAvailability.
     * @param {ProviderAvailabilityUpdateArgs} args - Arguments to update one ProviderAvailability.
     * @example
     * // Update one ProviderAvailability
     * const providerAvailability = await prisma.providerAvailability.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProviderAvailabilityUpdateArgs>(args: SelectSubset<T, ProviderAvailabilityUpdateArgs<ExtArgs>>): Prisma__ProviderAvailabilityClient<$Result.GetResult<Prisma.$ProviderAvailabilityPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProviderAvailabilities.
     * @param {ProviderAvailabilityDeleteManyArgs} args - Arguments to filter ProviderAvailabilities to delete.
     * @example
     * // Delete a few ProviderAvailabilities
     * const { count } = await prisma.providerAvailability.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProviderAvailabilityDeleteManyArgs>(args?: SelectSubset<T, ProviderAvailabilityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProviderAvailabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAvailabilityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProviderAvailabilities
     * const providerAvailability = await prisma.providerAvailability.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProviderAvailabilityUpdateManyArgs>(args: SelectSubset<T, ProviderAvailabilityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProviderAvailability.
     * @param {ProviderAvailabilityUpsertArgs} args - Arguments to update or create a ProviderAvailability.
     * @example
     * // Update or create a ProviderAvailability
     * const providerAvailability = await prisma.providerAvailability.upsert({
     *   create: {
     *     // ... data to create a ProviderAvailability
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProviderAvailability we want to update
     *   }
     * })
     */
    upsert<T extends ProviderAvailabilityUpsertArgs>(args: SelectSubset<T, ProviderAvailabilityUpsertArgs<ExtArgs>>): Prisma__ProviderAvailabilityClient<$Result.GetResult<Prisma.$ProviderAvailabilityPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProviderAvailabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAvailabilityCountArgs} args - Arguments to filter ProviderAvailabilities to count.
     * @example
     * // Count the number of ProviderAvailabilities
     * const count = await prisma.providerAvailability.count({
     *   where: {
     *     // ... the filter for the ProviderAvailabilities we want to count
     *   }
     * })
    **/
    count<T extends ProviderAvailabilityCountArgs>(
      args?: Subset<T, ProviderAvailabilityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProviderAvailabilityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProviderAvailability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAvailabilityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProviderAvailabilityAggregateArgs>(args: Subset<T, ProviderAvailabilityAggregateArgs>): Prisma.PrismaPromise<GetProviderAvailabilityAggregateType<T>>

    /**
     * Group by ProviderAvailability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAvailabilityGroupByArgs} args - Group by arguments.
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
      T extends ProviderAvailabilityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProviderAvailabilityGroupByArgs['orderBy'] }
        : { orderBy?: ProviderAvailabilityGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProviderAvailabilityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderAvailabilityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProviderAvailability model
   */
  readonly fields: ProviderAvailabilityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProviderAvailability.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProviderAvailabilityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ProviderAvailability model
   */ 
  interface ProviderAvailabilityFieldRefs {
    readonly id: FieldRef<"ProviderAvailability", 'String'>
    readonly providerId: FieldRef<"ProviderAvailability", 'String'>
    readonly dayOfWeek: FieldRef<"ProviderAvailability", 'Int'>
    readonly startTime: FieldRef<"ProviderAvailability", 'String'>
    readonly endTime: FieldRef<"ProviderAvailability", 'String'>
    readonly isActive: FieldRef<"ProviderAvailability", 'Boolean'>
    readonly createdAt: FieldRef<"ProviderAvailability", 'DateTime'>
    readonly updatedAt: FieldRef<"ProviderAvailability", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProviderAvailability findUnique
   */
  export type ProviderAvailabilityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAvailability
     */
    select?: ProviderAvailabilitySelect<ExtArgs> | null
    /**
     * Filter, which ProviderAvailability to fetch.
     */
    where: ProviderAvailabilityWhereUniqueInput
  }

  /**
   * ProviderAvailability findUniqueOrThrow
   */
  export type ProviderAvailabilityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAvailability
     */
    select?: ProviderAvailabilitySelect<ExtArgs> | null
    /**
     * Filter, which ProviderAvailability to fetch.
     */
    where: ProviderAvailabilityWhereUniqueInput
  }

  /**
   * ProviderAvailability findFirst
   */
  export type ProviderAvailabilityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAvailability
     */
    select?: ProviderAvailabilitySelect<ExtArgs> | null
    /**
     * Filter, which ProviderAvailability to fetch.
     */
    where?: ProviderAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderAvailabilities to fetch.
     */
    orderBy?: ProviderAvailabilityOrderByWithRelationInput | ProviderAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProviderAvailabilities.
     */
    cursor?: ProviderAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderAvailabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProviderAvailabilities.
     */
    distinct?: ProviderAvailabilityScalarFieldEnum | ProviderAvailabilityScalarFieldEnum[]
  }

  /**
   * ProviderAvailability findFirstOrThrow
   */
  export type ProviderAvailabilityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAvailability
     */
    select?: ProviderAvailabilitySelect<ExtArgs> | null
    /**
     * Filter, which ProviderAvailability to fetch.
     */
    where?: ProviderAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderAvailabilities to fetch.
     */
    orderBy?: ProviderAvailabilityOrderByWithRelationInput | ProviderAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProviderAvailabilities.
     */
    cursor?: ProviderAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderAvailabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProviderAvailabilities.
     */
    distinct?: ProviderAvailabilityScalarFieldEnum | ProviderAvailabilityScalarFieldEnum[]
  }

  /**
   * ProviderAvailability findMany
   */
  export type ProviderAvailabilityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAvailability
     */
    select?: ProviderAvailabilitySelect<ExtArgs> | null
    /**
     * Filter, which ProviderAvailabilities to fetch.
     */
    where?: ProviderAvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderAvailabilities to fetch.
     */
    orderBy?: ProviderAvailabilityOrderByWithRelationInput | ProviderAvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProviderAvailabilities.
     */
    cursor?: ProviderAvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderAvailabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderAvailabilities.
     */
    skip?: number
    distinct?: ProviderAvailabilityScalarFieldEnum | ProviderAvailabilityScalarFieldEnum[]
  }

  /**
   * ProviderAvailability create
   */
  export type ProviderAvailabilityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAvailability
     */
    select?: ProviderAvailabilitySelect<ExtArgs> | null
    /**
     * The data needed to create a ProviderAvailability.
     */
    data: XOR<ProviderAvailabilityCreateInput, ProviderAvailabilityUncheckedCreateInput>
  }

  /**
   * ProviderAvailability createMany
   */
  export type ProviderAvailabilityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProviderAvailabilities.
     */
    data: ProviderAvailabilityCreateManyInput | ProviderAvailabilityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProviderAvailability createManyAndReturn
   */
  export type ProviderAvailabilityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAvailability
     */
    select?: ProviderAvailabilitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProviderAvailabilities.
     */
    data: ProviderAvailabilityCreateManyInput | ProviderAvailabilityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProviderAvailability update
   */
  export type ProviderAvailabilityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAvailability
     */
    select?: ProviderAvailabilitySelect<ExtArgs> | null
    /**
     * The data needed to update a ProviderAvailability.
     */
    data: XOR<ProviderAvailabilityUpdateInput, ProviderAvailabilityUncheckedUpdateInput>
    /**
     * Choose, which ProviderAvailability to update.
     */
    where: ProviderAvailabilityWhereUniqueInput
  }

  /**
   * ProviderAvailability updateMany
   */
  export type ProviderAvailabilityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProviderAvailabilities.
     */
    data: XOR<ProviderAvailabilityUpdateManyMutationInput, ProviderAvailabilityUncheckedUpdateManyInput>
    /**
     * Filter which ProviderAvailabilities to update
     */
    where?: ProviderAvailabilityWhereInput
  }

  /**
   * ProviderAvailability upsert
   */
  export type ProviderAvailabilityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAvailability
     */
    select?: ProviderAvailabilitySelect<ExtArgs> | null
    /**
     * The filter to search for the ProviderAvailability to update in case it exists.
     */
    where: ProviderAvailabilityWhereUniqueInput
    /**
     * In case the ProviderAvailability found by the `where` argument doesn't exist, create a new ProviderAvailability with this data.
     */
    create: XOR<ProviderAvailabilityCreateInput, ProviderAvailabilityUncheckedCreateInput>
    /**
     * In case the ProviderAvailability was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProviderAvailabilityUpdateInput, ProviderAvailabilityUncheckedUpdateInput>
  }

  /**
   * ProviderAvailability delete
   */
  export type ProviderAvailabilityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAvailability
     */
    select?: ProviderAvailabilitySelect<ExtArgs> | null
    /**
     * Filter which ProviderAvailability to delete.
     */
    where: ProviderAvailabilityWhereUniqueInput
  }

  /**
   * ProviderAvailability deleteMany
   */
  export type ProviderAvailabilityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderAvailabilities to delete
     */
    where?: ProviderAvailabilityWhereInput
  }

  /**
   * ProviderAvailability without action
   */
  export type ProviderAvailabilityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderAvailability
     */
    select?: ProviderAvailabilitySelect<ExtArgs> | null
  }


  /**
   * Model ProviderBreak
   */

  export type AggregateProviderBreak = {
    _count: ProviderBreakCountAggregateOutputType | null
    _min: ProviderBreakMinAggregateOutputType | null
    _max: ProviderBreakMaxAggregateOutputType | null
  }

  export type ProviderBreakMinAggregateOutputType = {
    id: string | null
    providerId: string | null
    startTime: Date | null
    endTime: Date | null
    reason: string | null
    createdAt: Date | null
  }

  export type ProviderBreakMaxAggregateOutputType = {
    id: string | null
    providerId: string | null
    startTime: Date | null
    endTime: Date | null
    reason: string | null
    createdAt: Date | null
  }

  export type ProviderBreakCountAggregateOutputType = {
    id: number
    providerId: number
    startTime: number
    endTime: number
    reason: number
    createdAt: number
    _all: number
  }


  export type ProviderBreakMinAggregateInputType = {
    id?: true
    providerId?: true
    startTime?: true
    endTime?: true
    reason?: true
    createdAt?: true
  }

  export type ProviderBreakMaxAggregateInputType = {
    id?: true
    providerId?: true
    startTime?: true
    endTime?: true
    reason?: true
    createdAt?: true
  }

  export type ProviderBreakCountAggregateInputType = {
    id?: true
    providerId?: true
    startTime?: true
    endTime?: true
    reason?: true
    createdAt?: true
    _all?: true
  }

  export type ProviderBreakAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderBreak to aggregate.
     */
    where?: ProviderBreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderBreaks to fetch.
     */
    orderBy?: ProviderBreakOrderByWithRelationInput | ProviderBreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProviderBreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderBreaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderBreaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProviderBreaks
    **/
    _count?: true | ProviderBreakCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProviderBreakMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProviderBreakMaxAggregateInputType
  }

  export type GetProviderBreakAggregateType<T extends ProviderBreakAggregateArgs> = {
        [P in keyof T & keyof AggregateProviderBreak]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProviderBreak[P]>
      : GetScalarType<T[P], AggregateProviderBreak[P]>
  }




  export type ProviderBreakGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProviderBreakWhereInput
    orderBy?: ProviderBreakOrderByWithAggregationInput | ProviderBreakOrderByWithAggregationInput[]
    by: ProviderBreakScalarFieldEnum[] | ProviderBreakScalarFieldEnum
    having?: ProviderBreakScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProviderBreakCountAggregateInputType | true
    _min?: ProviderBreakMinAggregateInputType
    _max?: ProviderBreakMaxAggregateInputType
  }

  export type ProviderBreakGroupByOutputType = {
    id: string
    providerId: string
    startTime: Date
    endTime: Date
    reason: string | null
    createdAt: Date
    _count: ProviderBreakCountAggregateOutputType | null
    _min: ProviderBreakMinAggregateOutputType | null
    _max: ProviderBreakMaxAggregateOutputType | null
  }

  type GetProviderBreakGroupByPayload<T extends ProviderBreakGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProviderBreakGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProviderBreakGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProviderBreakGroupByOutputType[P]>
            : GetScalarType<T[P], ProviderBreakGroupByOutputType[P]>
        }
      >
    >


  export type ProviderBreakSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    providerId?: boolean
    startTime?: boolean
    endTime?: boolean
    reason?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["providerBreak"]>

  export type ProviderBreakSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    providerId?: boolean
    startTime?: boolean
    endTime?: boolean
    reason?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["providerBreak"]>

  export type ProviderBreakSelectScalar = {
    id?: boolean
    providerId?: boolean
    startTime?: boolean
    endTime?: boolean
    reason?: boolean
    createdAt?: boolean
  }


  export type $ProviderBreakPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProviderBreak"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      providerId: string
      startTime: Date
      endTime: Date
      reason: string | null
      createdAt: Date
    }, ExtArgs["result"]["providerBreak"]>
    composites: {}
  }

  type ProviderBreakGetPayload<S extends boolean | null | undefined | ProviderBreakDefaultArgs> = $Result.GetResult<Prisma.$ProviderBreakPayload, S>

  type ProviderBreakCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProviderBreakFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProviderBreakCountAggregateInputType | true
    }

  export interface ProviderBreakDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProviderBreak'], meta: { name: 'ProviderBreak' } }
    /**
     * Find zero or one ProviderBreak that matches the filter.
     * @param {ProviderBreakFindUniqueArgs} args - Arguments to find a ProviderBreak
     * @example
     * // Get one ProviderBreak
     * const providerBreak = await prisma.providerBreak.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProviderBreakFindUniqueArgs>(args: SelectSubset<T, ProviderBreakFindUniqueArgs<ExtArgs>>): Prisma__ProviderBreakClient<$Result.GetResult<Prisma.$ProviderBreakPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProviderBreak that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProviderBreakFindUniqueOrThrowArgs} args - Arguments to find a ProviderBreak
     * @example
     * // Get one ProviderBreak
     * const providerBreak = await prisma.providerBreak.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProviderBreakFindUniqueOrThrowArgs>(args: SelectSubset<T, ProviderBreakFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProviderBreakClient<$Result.GetResult<Prisma.$ProviderBreakPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProviderBreak that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderBreakFindFirstArgs} args - Arguments to find a ProviderBreak
     * @example
     * // Get one ProviderBreak
     * const providerBreak = await prisma.providerBreak.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProviderBreakFindFirstArgs>(args?: SelectSubset<T, ProviderBreakFindFirstArgs<ExtArgs>>): Prisma__ProviderBreakClient<$Result.GetResult<Prisma.$ProviderBreakPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProviderBreak that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderBreakFindFirstOrThrowArgs} args - Arguments to find a ProviderBreak
     * @example
     * // Get one ProviderBreak
     * const providerBreak = await prisma.providerBreak.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProviderBreakFindFirstOrThrowArgs>(args?: SelectSubset<T, ProviderBreakFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProviderBreakClient<$Result.GetResult<Prisma.$ProviderBreakPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProviderBreaks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderBreakFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProviderBreaks
     * const providerBreaks = await prisma.providerBreak.findMany()
     * 
     * // Get first 10 ProviderBreaks
     * const providerBreaks = await prisma.providerBreak.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const providerBreakWithIdOnly = await prisma.providerBreak.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProviderBreakFindManyArgs>(args?: SelectSubset<T, ProviderBreakFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderBreakPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProviderBreak.
     * @param {ProviderBreakCreateArgs} args - Arguments to create a ProviderBreak.
     * @example
     * // Create one ProviderBreak
     * const ProviderBreak = await prisma.providerBreak.create({
     *   data: {
     *     // ... data to create a ProviderBreak
     *   }
     * })
     * 
     */
    create<T extends ProviderBreakCreateArgs>(args: SelectSubset<T, ProviderBreakCreateArgs<ExtArgs>>): Prisma__ProviderBreakClient<$Result.GetResult<Prisma.$ProviderBreakPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProviderBreaks.
     * @param {ProviderBreakCreateManyArgs} args - Arguments to create many ProviderBreaks.
     * @example
     * // Create many ProviderBreaks
     * const providerBreak = await prisma.providerBreak.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProviderBreakCreateManyArgs>(args?: SelectSubset<T, ProviderBreakCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProviderBreaks and returns the data saved in the database.
     * @param {ProviderBreakCreateManyAndReturnArgs} args - Arguments to create many ProviderBreaks.
     * @example
     * // Create many ProviderBreaks
     * const providerBreak = await prisma.providerBreak.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProviderBreaks and only return the `id`
     * const providerBreakWithIdOnly = await prisma.providerBreak.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProviderBreakCreateManyAndReturnArgs>(args?: SelectSubset<T, ProviderBreakCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderBreakPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProviderBreak.
     * @param {ProviderBreakDeleteArgs} args - Arguments to delete one ProviderBreak.
     * @example
     * // Delete one ProviderBreak
     * const ProviderBreak = await prisma.providerBreak.delete({
     *   where: {
     *     // ... filter to delete one ProviderBreak
     *   }
     * })
     * 
     */
    delete<T extends ProviderBreakDeleteArgs>(args: SelectSubset<T, ProviderBreakDeleteArgs<ExtArgs>>): Prisma__ProviderBreakClient<$Result.GetResult<Prisma.$ProviderBreakPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProviderBreak.
     * @param {ProviderBreakUpdateArgs} args - Arguments to update one ProviderBreak.
     * @example
     * // Update one ProviderBreak
     * const providerBreak = await prisma.providerBreak.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProviderBreakUpdateArgs>(args: SelectSubset<T, ProviderBreakUpdateArgs<ExtArgs>>): Prisma__ProviderBreakClient<$Result.GetResult<Prisma.$ProviderBreakPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProviderBreaks.
     * @param {ProviderBreakDeleteManyArgs} args - Arguments to filter ProviderBreaks to delete.
     * @example
     * // Delete a few ProviderBreaks
     * const { count } = await prisma.providerBreak.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProviderBreakDeleteManyArgs>(args?: SelectSubset<T, ProviderBreakDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProviderBreaks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderBreakUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProviderBreaks
     * const providerBreak = await prisma.providerBreak.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProviderBreakUpdateManyArgs>(args: SelectSubset<T, ProviderBreakUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProviderBreak.
     * @param {ProviderBreakUpsertArgs} args - Arguments to update or create a ProviderBreak.
     * @example
     * // Update or create a ProviderBreak
     * const providerBreak = await prisma.providerBreak.upsert({
     *   create: {
     *     // ... data to create a ProviderBreak
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProviderBreak we want to update
     *   }
     * })
     */
    upsert<T extends ProviderBreakUpsertArgs>(args: SelectSubset<T, ProviderBreakUpsertArgs<ExtArgs>>): Prisma__ProviderBreakClient<$Result.GetResult<Prisma.$ProviderBreakPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProviderBreaks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderBreakCountArgs} args - Arguments to filter ProviderBreaks to count.
     * @example
     * // Count the number of ProviderBreaks
     * const count = await prisma.providerBreak.count({
     *   where: {
     *     // ... the filter for the ProviderBreaks we want to count
     *   }
     * })
    **/
    count<T extends ProviderBreakCountArgs>(
      args?: Subset<T, ProviderBreakCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProviderBreakCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProviderBreak.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderBreakAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProviderBreakAggregateArgs>(args: Subset<T, ProviderBreakAggregateArgs>): Prisma.PrismaPromise<GetProviderBreakAggregateType<T>>

    /**
     * Group by ProviderBreak.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderBreakGroupByArgs} args - Group by arguments.
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
      T extends ProviderBreakGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProviderBreakGroupByArgs['orderBy'] }
        : { orderBy?: ProviderBreakGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProviderBreakGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderBreakGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProviderBreak model
   */
  readonly fields: ProviderBreakFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProviderBreak.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProviderBreakClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ProviderBreak model
   */ 
  interface ProviderBreakFieldRefs {
    readonly id: FieldRef<"ProviderBreak", 'String'>
    readonly providerId: FieldRef<"ProviderBreak", 'String'>
    readonly startTime: FieldRef<"ProviderBreak", 'DateTime'>
    readonly endTime: FieldRef<"ProviderBreak", 'DateTime'>
    readonly reason: FieldRef<"ProviderBreak", 'String'>
    readonly createdAt: FieldRef<"ProviderBreak", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProviderBreak findUnique
   */
  export type ProviderBreakFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderBreak
     */
    select?: ProviderBreakSelect<ExtArgs> | null
    /**
     * Filter, which ProviderBreak to fetch.
     */
    where: ProviderBreakWhereUniqueInput
  }

  /**
   * ProviderBreak findUniqueOrThrow
   */
  export type ProviderBreakFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderBreak
     */
    select?: ProviderBreakSelect<ExtArgs> | null
    /**
     * Filter, which ProviderBreak to fetch.
     */
    where: ProviderBreakWhereUniqueInput
  }

  /**
   * ProviderBreak findFirst
   */
  export type ProviderBreakFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderBreak
     */
    select?: ProviderBreakSelect<ExtArgs> | null
    /**
     * Filter, which ProviderBreak to fetch.
     */
    where?: ProviderBreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderBreaks to fetch.
     */
    orderBy?: ProviderBreakOrderByWithRelationInput | ProviderBreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProviderBreaks.
     */
    cursor?: ProviderBreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderBreaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderBreaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProviderBreaks.
     */
    distinct?: ProviderBreakScalarFieldEnum | ProviderBreakScalarFieldEnum[]
  }

  /**
   * ProviderBreak findFirstOrThrow
   */
  export type ProviderBreakFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderBreak
     */
    select?: ProviderBreakSelect<ExtArgs> | null
    /**
     * Filter, which ProviderBreak to fetch.
     */
    where?: ProviderBreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderBreaks to fetch.
     */
    orderBy?: ProviderBreakOrderByWithRelationInput | ProviderBreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProviderBreaks.
     */
    cursor?: ProviderBreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderBreaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderBreaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProviderBreaks.
     */
    distinct?: ProviderBreakScalarFieldEnum | ProviderBreakScalarFieldEnum[]
  }

  /**
   * ProviderBreak findMany
   */
  export type ProviderBreakFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderBreak
     */
    select?: ProviderBreakSelect<ExtArgs> | null
    /**
     * Filter, which ProviderBreaks to fetch.
     */
    where?: ProviderBreakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderBreaks to fetch.
     */
    orderBy?: ProviderBreakOrderByWithRelationInput | ProviderBreakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProviderBreaks.
     */
    cursor?: ProviderBreakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderBreaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderBreaks.
     */
    skip?: number
    distinct?: ProviderBreakScalarFieldEnum | ProviderBreakScalarFieldEnum[]
  }

  /**
   * ProviderBreak create
   */
  export type ProviderBreakCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderBreak
     */
    select?: ProviderBreakSelect<ExtArgs> | null
    /**
     * The data needed to create a ProviderBreak.
     */
    data: XOR<ProviderBreakCreateInput, ProviderBreakUncheckedCreateInput>
  }

  /**
   * ProviderBreak createMany
   */
  export type ProviderBreakCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProviderBreaks.
     */
    data: ProviderBreakCreateManyInput | ProviderBreakCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProviderBreak createManyAndReturn
   */
  export type ProviderBreakCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderBreak
     */
    select?: ProviderBreakSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProviderBreaks.
     */
    data: ProviderBreakCreateManyInput | ProviderBreakCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProviderBreak update
   */
  export type ProviderBreakUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderBreak
     */
    select?: ProviderBreakSelect<ExtArgs> | null
    /**
     * The data needed to update a ProviderBreak.
     */
    data: XOR<ProviderBreakUpdateInput, ProviderBreakUncheckedUpdateInput>
    /**
     * Choose, which ProviderBreak to update.
     */
    where: ProviderBreakWhereUniqueInput
  }

  /**
   * ProviderBreak updateMany
   */
  export type ProviderBreakUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProviderBreaks.
     */
    data: XOR<ProviderBreakUpdateManyMutationInput, ProviderBreakUncheckedUpdateManyInput>
    /**
     * Filter which ProviderBreaks to update
     */
    where?: ProviderBreakWhereInput
  }

  /**
   * ProviderBreak upsert
   */
  export type ProviderBreakUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderBreak
     */
    select?: ProviderBreakSelect<ExtArgs> | null
    /**
     * The filter to search for the ProviderBreak to update in case it exists.
     */
    where: ProviderBreakWhereUniqueInput
    /**
     * In case the ProviderBreak found by the `where` argument doesn't exist, create a new ProviderBreak with this data.
     */
    create: XOR<ProviderBreakCreateInput, ProviderBreakUncheckedCreateInput>
    /**
     * In case the ProviderBreak was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProviderBreakUpdateInput, ProviderBreakUncheckedUpdateInput>
  }

  /**
   * ProviderBreak delete
   */
  export type ProviderBreakDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderBreak
     */
    select?: ProviderBreakSelect<ExtArgs> | null
    /**
     * Filter which ProviderBreak to delete.
     */
    where: ProviderBreakWhereUniqueInput
  }

  /**
   * ProviderBreak deleteMany
   */
  export type ProviderBreakDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderBreaks to delete
     */
    where?: ProviderBreakWhereInput
  }

  /**
   * ProviderBreak without action
   */
  export type ProviderBreakDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderBreak
     */
    select?: ProviderBreakSelect<ExtArgs> | null
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


  export const AppointmentScalarFieldEnum: {
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

  export type AppointmentScalarFieldEnum = (typeof AppointmentScalarFieldEnum)[keyof typeof AppointmentScalarFieldEnum]


  export const VisitScalarFieldEnum: {
    id: 'id',
    appointmentId: 'appointmentId',
    sessionToken: 'sessionToken',
    status: 'status',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    roomId: 'roomId',
    iceServers: 'iceServers',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VisitScalarFieldEnum = (typeof VisitScalarFieldEnum)[keyof typeof VisitScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    visitId: 'visitId',
    senderId: 'senderId',
    senderRole: 'senderRole',
    message: 'message',
    attachments: 'attachments',
    timestamp: 'timestamp'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const ProviderAvailabilityScalarFieldEnum: {
    id: 'id',
    providerId: 'providerId',
    dayOfWeek: 'dayOfWeek',
    startTime: 'startTime',
    endTime: 'endTime',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProviderAvailabilityScalarFieldEnum = (typeof ProviderAvailabilityScalarFieldEnum)[keyof typeof ProviderAvailabilityScalarFieldEnum]


  export const ProviderBreakScalarFieldEnum: {
    id: 'id',
    providerId: 'providerId',
    startTime: 'startTime',
    endTime: 'endTime',
    reason: 'reason',
    createdAt: 'createdAt'
  };

  export type ProviderBreakScalarFieldEnum = (typeof ProviderBreakScalarFieldEnum)[keyof typeof ProviderBreakScalarFieldEnum]


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
   * Reference to a field of type 'AppointmentType'
   */
  export type EnumAppointmentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppointmentType'>
    


  /**
   * Reference to a field of type 'AppointmentType[]'
   */
  export type ListEnumAppointmentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppointmentType[]'>
    


  /**
   * Reference to a field of type 'AppointmentStatus'
   */
  export type EnumAppointmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppointmentStatus'>
    


  /**
   * Reference to a field of type 'AppointmentStatus[]'
   */
  export type ListEnumAppointmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppointmentStatus[]'>
    


  /**
   * Reference to a field of type 'VisitStatus'
   */
  export type EnumVisitStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VisitStatus'>
    


  /**
   * Reference to a field of type 'VisitStatus[]'
   */
  export type ListEnumVisitStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VisitStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


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
   * Deep Input Types
   */


  export type AppointmentWhereInput = {
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    id?: StringFilter<"Appointment"> | string
    patientId?: StringFilter<"Appointment"> | string
    providerId?: StringFilter<"Appointment"> | string
    scheduledAt?: DateTimeFilter<"Appointment"> | Date | string
    duration?: IntFilter<"Appointment"> | number
    type?: EnumAppointmentTypeFilter<"Appointment"> | $Enums.AppointmentType
    status?: EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus
    reasonForVisit?: StringNullableFilter<"Appointment"> | string | null
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    visit?: XOR<VisitNullableRelationFilter, VisitWhereInput> | null
  }

  export type AppointmentOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    scheduledAt?: SortOrder
    duration?: SortOrder
    type?: SortOrder
    status?: SortOrder
    reasonForVisit?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    visit?: VisitOrderByWithRelationInput
  }

  export type AppointmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    patientId?: StringFilter<"Appointment"> | string
    providerId?: StringFilter<"Appointment"> | string
    scheduledAt?: DateTimeFilter<"Appointment"> | Date | string
    duration?: IntFilter<"Appointment"> | number
    type?: EnumAppointmentTypeFilter<"Appointment"> | $Enums.AppointmentType
    status?: EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus
    reasonForVisit?: StringNullableFilter<"Appointment"> | string | null
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    visit?: XOR<VisitNullableRelationFilter, VisitWhereInput> | null
  }, "id">

  export type AppointmentOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    scheduledAt?: SortOrder
    duration?: SortOrder
    type?: SortOrder
    status?: SortOrder
    reasonForVisit?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AppointmentCountOrderByAggregateInput
    _avg?: AppointmentAvgOrderByAggregateInput
    _max?: AppointmentMaxOrderByAggregateInput
    _min?: AppointmentMinOrderByAggregateInput
    _sum?: AppointmentSumOrderByAggregateInput
  }

  export type AppointmentScalarWhereWithAggregatesInput = {
    AND?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    OR?: AppointmentScalarWhereWithAggregatesInput[]
    NOT?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Appointment"> | string
    patientId?: StringWithAggregatesFilter<"Appointment"> | string
    providerId?: StringWithAggregatesFilter<"Appointment"> | string
    scheduledAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    duration?: IntWithAggregatesFilter<"Appointment"> | number
    type?: EnumAppointmentTypeWithAggregatesFilter<"Appointment"> | $Enums.AppointmentType
    status?: EnumAppointmentStatusWithAggregatesFilter<"Appointment"> | $Enums.AppointmentStatus
    reasonForVisit?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
  }

  export type VisitWhereInput = {
    AND?: VisitWhereInput | VisitWhereInput[]
    OR?: VisitWhereInput[]
    NOT?: VisitWhereInput | VisitWhereInput[]
    id?: StringFilter<"Visit"> | string
    appointmentId?: StringFilter<"Visit"> | string
    sessionToken?: StringFilter<"Visit"> | string
    status?: EnumVisitStatusFilter<"Visit"> | $Enums.VisitStatus
    startedAt?: DateTimeNullableFilter<"Visit"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"Visit"> | Date | string | null
    roomId?: StringFilter<"Visit"> | string
    iceServers?: JsonNullableFilter<"Visit">
    createdAt?: DateTimeFilter<"Visit"> | Date | string
    updatedAt?: DateTimeFilter<"Visit"> | Date | string
    appointment?: XOR<AppointmentRelationFilter, AppointmentWhereInput>
    messages?: ChatMessageListRelationFilter
  }

  export type VisitOrderByWithRelationInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    sessionToken?: SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    roomId?: SortOrder
    iceServers?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointment?: AppointmentOrderByWithRelationInput
    messages?: ChatMessageOrderByRelationAggregateInput
  }

  export type VisitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    appointmentId?: string
    sessionToken?: string
    roomId?: string
    AND?: VisitWhereInput | VisitWhereInput[]
    OR?: VisitWhereInput[]
    NOT?: VisitWhereInput | VisitWhereInput[]
    status?: EnumVisitStatusFilter<"Visit"> | $Enums.VisitStatus
    startedAt?: DateTimeNullableFilter<"Visit"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"Visit"> | Date | string | null
    iceServers?: JsonNullableFilter<"Visit">
    createdAt?: DateTimeFilter<"Visit"> | Date | string
    updatedAt?: DateTimeFilter<"Visit"> | Date | string
    appointment?: XOR<AppointmentRelationFilter, AppointmentWhereInput>
    messages?: ChatMessageListRelationFilter
  }, "id" | "appointmentId" | "sessionToken" | "roomId">

  export type VisitOrderByWithAggregationInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    sessionToken?: SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    roomId?: SortOrder
    iceServers?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VisitCountOrderByAggregateInput
    _max?: VisitMaxOrderByAggregateInput
    _min?: VisitMinOrderByAggregateInput
  }

  export type VisitScalarWhereWithAggregatesInput = {
    AND?: VisitScalarWhereWithAggregatesInput | VisitScalarWhereWithAggregatesInput[]
    OR?: VisitScalarWhereWithAggregatesInput[]
    NOT?: VisitScalarWhereWithAggregatesInput | VisitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Visit"> | string
    appointmentId?: StringWithAggregatesFilter<"Visit"> | string
    sessionToken?: StringWithAggregatesFilter<"Visit"> | string
    status?: EnumVisitStatusWithAggregatesFilter<"Visit"> | $Enums.VisitStatus
    startedAt?: DateTimeNullableWithAggregatesFilter<"Visit"> | Date | string | null
    endedAt?: DateTimeNullableWithAggregatesFilter<"Visit"> | Date | string | null
    roomId?: StringWithAggregatesFilter<"Visit"> | string
    iceServers?: JsonNullableWithAggregatesFilter<"Visit">
    createdAt?: DateTimeWithAggregatesFilter<"Visit"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Visit"> | Date | string
  }

  export type ChatMessageWhereInput = {
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    visitId?: StringFilter<"ChatMessage"> | string
    senderId?: StringFilter<"ChatMessage"> | string
    senderRole?: StringFilter<"ChatMessage"> | string
    message?: StringFilter<"ChatMessage"> | string
    attachments?: StringNullableListFilter<"ChatMessage">
    timestamp?: DateTimeFilter<"ChatMessage"> | Date | string
    visit?: XOR<VisitRelationFilter, VisitWhereInput>
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    visitId?: SortOrder
    senderId?: SortOrder
    senderRole?: SortOrder
    message?: SortOrder
    attachments?: SortOrder
    timestamp?: SortOrder
    visit?: VisitOrderByWithRelationInput
  }

  export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    visitId?: StringFilter<"ChatMessage"> | string
    senderId?: StringFilter<"ChatMessage"> | string
    senderRole?: StringFilter<"ChatMessage"> | string
    message?: StringFilter<"ChatMessage"> | string
    attachments?: StringNullableListFilter<"ChatMessage">
    timestamp?: DateTimeFilter<"ChatMessage"> | Date | string
    visit?: XOR<VisitRelationFilter, VisitWhereInput>
  }, "id">

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    visitId?: SortOrder
    senderId?: SortOrder
    senderRole?: SortOrder
    message?: SortOrder
    attachments?: SortOrder
    timestamp?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    OR?: ChatMessageScalarWhereWithAggregatesInput[]
    NOT?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatMessage"> | string
    visitId?: StringWithAggregatesFilter<"ChatMessage"> | string
    senderId?: StringWithAggregatesFilter<"ChatMessage"> | string
    senderRole?: StringWithAggregatesFilter<"ChatMessage"> | string
    message?: StringWithAggregatesFilter<"ChatMessage"> | string
    attachments?: StringNullableListFilter<"ChatMessage">
    timestamp?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string
  }

  export type ProviderAvailabilityWhereInput = {
    AND?: ProviderAvailabilityWhereInput | ProviderAvailabilityWhereInput[]
    OR?: ProviderAvailabilityWhereInput[]
    NOT?: ProviderAvailabilityWhereInput | ProviderAvailabilityWhereInput[]
    id?: StringFilter<"ProviderAvailability"> | string
    providerId?: StringFilter<"ProviderAvailability"> | string
    dayOfWeek?: IntFilter<"ProviderAvailability"> | number
    startTime?: StringFilter<"ProviderAvailability"> | string
    endTime?: StringFilter<"ProviderAvailability"> | string
    isActive?: BoolFilter<"ProviderAvailability"> | boolean
    createdAt?: DateTimeFilter<"ProviderAvailability"> | Date | string
    updatedAt?: DateTimeFilter<"ProviderAvailability"> | Date | string
  }

  export type ProviderAvailabilityOrderByWithRelationInput = {
    id?: SortOrder
    providerId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderAvailabilityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProviderAvailabilityWhereInput | ProviderAvailabilityWhereInput[]
    OR?: ProviderAvailabilityWhereInput[]
    NOT?: ProviderAvailabilityWhereInput | ProviderAvailabilityWhereInput[]
    providerId?: StringFilter<"ProviderAvailability"> | string
    dayOfWeek?: IntFilter<"ProviderAvailability"> | number
    startTime?: StringFilter<"ProviderAvailability"> | string
    endTime?: StringFilter<"ProviderAvailability"> | string
    isActive?: BoolFilter<"ProviderAvailability"> | boolean
    createdAt?: DateTimeFilter<"ProviderAvailability"> | Date | string
    updatedAt?: DateTimeFilter<"ProviderAvailability"> | Date | string
  }, "id">

  export type ProviderAvailabilityOrderByWithAggregationInput = {
    id?: SortOrder
    providerId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProviderAvailabilityCountOrderByAggregateInput
    _avg?: ProviderAvailabilityAvgOrderByAggregateInput
    _max?: ProviderAvailabilityMaxOrderByAggregateInput
    _min?: ProviderAvailabilityMinOrderByAggregateInput
    _sum?: ProviderAvailabilitySumOrderByAggregateInput
  }

  export type ProviderAvailabilityScalarWhereWithAggregatesInput = {
    AND?: ProviderAvailabilityScalarWhereWithAggregatesInput | ProviderAvailabilityScalarWhereWithAggregatesInput[]
    OR?: ProviderAvailabilityScalarWhereWithAggregatesInput[]
    NOT?: ProviderAvailabilityScalarWhereWithAggregatesInput | ProviderAvailabilityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProviderAvailability"> | string
    providerId?: StringWithAggregatesFilter<"ProviderAvailability"> | string
    dayOfWeek?: IntWithAggregatesFilter<"ProviderAvailability"> | number
    startTime?: StringWithAggregatesFilter<"ProviderAvailability"> | string
    endTime?: StringWithAggregatesFilter<"ProviderAvailability"> | string
    isActive?: BoolWithAggregatesFilter<"ProviderAvailability"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ProviderAvailability"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProviderAvailability"> | Date | string
  }

  export type ProviderBreakWhereInput = {
    AND?: ProviderBreakWhereInput | ProviderBreakWhereInput[]
    OR?: ProviderBreakWhereInput[]
    NOT?: ProviderBreakWhereInput | ProviderBreakWhereInput[]
    id?: StringFilter<"ProviderBreak"> | string
    providerId?: StringFilter<"ProviderBreak"> | string
    startTime?: DateTimeFilter<"ProviderBreak"> | Date | string
    endTime?: DateTimeFilter<"ProviderBreak"> | Date | string
    reason?: StringNullableFilter<"ProviderBreak"> | string | null
    createdAt?: DateTimeFilter<"ProviderBreak"> | Date | string
  }

  export type ProviderBreakOrderByWithRelationInput = {
    id?: SortOrder
    providerId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    reason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type ProviderBreakWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProviderBreakWhereInput | ProviderBreakWhereInput[]
    OR?: ProviderBreakWhereInput[]
    NOT?: ProviderBreakWhereInput | ProviderBreakWhereInput[]
    providerId?: StringFilter<"ProviderBreak"> | string
    startTime?: DateTimeFilter<"ProviderBreak"> | Date | string
    endTime?: DateTimeFilter<"ProviderBreak"> | Date | string
    reason?: StringNullableFilter<"ProviderBreak"> | string | null
    createdAt?: DateTimeFilter<"ProviderBreak"> | Date | string
  }, "id">

  export type ProviderBreakOrderByWithAggregationInput = {
    id?: SortOrder
    providerId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    reason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ProviderBreakCountOrderByAggregateInput
    _max?: ProviderBreakMaxOrderByAggregateInput
    _min?: ProviderBreakMinOrderByAggregateInput
  }

  export type ProviderBreakScalarWhereWithAggregatesInput = {
    AND?: ProviderBreakScalarWhereWithAggregatesInput | ProviderBreakScalarWhereWithAggregatesInput[]
    OR?: ProviderBreakScalarWhereWithAggregatesInput[]
    NOT?: ProviderBreakScalarWhereWithAggregatesInput | ProviderBreakScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProviderBreak"> | string
    providerId?: StringWithAggregatesFilter<"ProviderBreak"> | string
    startTime?: DateTimeWithAggregatesFilter<"ProviderBreak"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"ProviderBreak"> | Date | string
    reason?: StringNullableWithAggregatesFilter<"ProviderBreak"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProviderBreak"> | Date | string
  }

  export type AppointmentCreateInput = {
    id?: string
    patientId: string
    providerId: string
    scheduledAt: Date | string
    duration: number
    type: $Enums.AppointmentType
    status?: $Enums.AppointmentStatus
    reasonForVisit?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    visit?: VisitCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateInput = {
    id?: string
    patientId: string
    providerId: string
    scheduledAt: Date | string
    duration: number
    type: $Enums.AppointmentType
    status?: $Enums.AppointmentStatus
    reasonForVisit?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    visit?: VisitUncheckedCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    type?: EnumAppointmentTypeFieldUpdateOperationsInput | $Enums.AppointmentType
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reasonForVisit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    visit?: VisitUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    type?: EnumAppointmentTypeFieldUpdateOperationsInput | $Enums.AppointmentType
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reasonForVisit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    visit?: VisitUncheckedUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentCreateManyInput = {
    id?: string
    patientId: string
    providerId: string
    scheduledAt: Date | string
    duration: number
    type: $Enums.AppointmentType
    status?: $Enums.AppointmentStatus
    reasonForVisit?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    type?: EnumAppointmentTypeFieldUpdateOperationsInput | $Enums.AppointmentType
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reasonForVisit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    type?: EnumAppointmentTypeFieldUpdateOperationsInput | $Enums.AppointmentType
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reasonForVisit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitCreateInput = {
    id?: string
    sessionToken: string
    status?: $Enums.VisitStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    roomId: string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    appointment: AppointmentCreateNestedOneWithoutVisitInput
    messages?: ChatMessageCreateNestedManyWithoutVisitInput
  }

  export type VisitUncheckedCreateInput = {
    id?: string
    appointmentId: string
    sessionToken: string
    status?: $Enums.VisitStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    roomId: string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutVisitInput
  }

  export type VisitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointment?: AppointmentUpdateOneRequiredWithoutVisitNestedInput
    messages?: ChatMessageUpdateManyWithoutVisitNestedInput
  }

  export type VisitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    appointmentId?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutVisitNestedInput
  }

  export type VisitCreateManyInput = {
    id?: string
    appointmentId: string
    sessionToken: string
    status?: $Enums.VisitStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    roomId: string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    appointmentId?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateInput = {
    id?: string
    senderId: string
    senderRole: string
    message: string
    attachments?: ChatMessageCreateattachmentsInput | string[]
    timestamp?: Date | string
    visit: VisitCreateNestedOneWithoutMessagesInput
  }

  export type ChatMessageUncheckedCreateInput = {
    id?: string
    visitId: string
    senderId: string
    senderRole: string
    message: string
    attachments?: ChatMessageCreateattachmentsInput | string[]
    timestamp?: Date | string
  }

  export type ChatMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    attachments?: ChatMessageUpdateattachmentsInput | string[]
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    visit?: VisitUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    attachments?: ChatMessageUpdateattachmentsInput | string[]
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManyInput = {
    id?: string
    visitId: string
    senderId: string
    senderRole: string
    message: string
    attachments?: ChatMessageCreateattachmentsInput | string[]
    timestamp?: Date | string
  }

  export type ChatMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    attachments?: ChatMessageUpdateattachmentsInput | string[]
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    attachments?: ChatMessageUpdateattachmentsInput | string[]
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderAvailabilityCreateInput = {
    id?: string
    providerId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderAvailabilityUncheckedCreateInput = {
    id?: string
    providerId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderAvailabilityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderAvailabilityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderAvailabilityCreateManyInput = {
    id?: string
    providerId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderAvailabilityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderAvailabilityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderBreakCreateInput = {
    id?: string
    providerId: string
    startTime: Date | string
    endTime: Date | string
    reason?: string | null
    createdAt?: Date | string
  }

  export type ProviderBreakUncheckedCreateInput = {
    id?: string
    providerId: string
    startTime: Date | string
    endTime: Date | string
    reason?: string | null
    createdAt?: Date | string
  }

  export type ProviderBreakUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderBreakUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderBreakCreateManyInput = {
    id?: string
    providerId: string
    startTime: Date | string
    endTime: Date | string
    reason?: string | null
    createdAt?: Date | string
  }

  export type ProviderBreakUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderBreakUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumAppointmentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentType | EnumAppointmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentType[] | ListEnumAppointmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentType[] | ListEnumAppointmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentTypeFilter<$PrismaModel> | $Enums.AppointmentType
  }

  export type EnumAppointmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusFilter<$PrismaModel> | $Enums.AppointmentStatus
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

  export type VisitNullableRelationFilter = {
    is?: VisitWhereInput | null
    isNot?: VisitWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AppointmentCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    scheduledAt?: SortOrder
    duration?: SortOrder
    type?: SortOrder
    status?: SortOrder
    reasonForVisit?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type AppointmentMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    scheduledAt?: SortOrder
    duration?: SortOrder
    type?: SortOrder
    status?: SortOrder
    reasonForVisit?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    scheduledAt?: SortOrder
    duration?: SortOrder
    type?: SortOrder
    status?: SortOrder
    reasonForVisit?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentSumOrderByAggregateInput = {
    duration?: SortOrder
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

  export type EnumAppointmentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentType | EnumAppointmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentType[] | ListEnumAppointmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentType[] | ListEnumAppointmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentTypeWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppointmentTypeFilter<$PrismaModel>
    _max?: NestedEnumAppointmentTypeFilter<$PrismaModel>
  }

  export type EnumAppointmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppointmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAppointmentStatusFilter<$PrismaModel>
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

  export type EnumVisitStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitStatus | EnumVisitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitStatusFilter<$PrismaModel> | $Enums.VisitStatus
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

  export type AppointmentRelationFilter = {
    is?: AppointmentWhereInput
    isNot?: AppointmentWhereInput
  }

  export type ChatMessageListRelationFilter = {
    every?: ChatMessageWhereInput
    some?: ChatMessageWhereInput
    none?: ChatMessageWhereInput
  }

  export type ChatMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VisitCountOrderByAggregateInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    sessionToken?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    roomId?: SortOrder
    iceServers?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VisitMaxOrderByAggregateInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    sessionToken?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    roomId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VisitMinOrderByAggregateInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    sessionToken?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    roomId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumVisitStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitStatus | EnumVisitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitStatusWithAggregatesFilter<$PrismaModel> | $Enums.VisitStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVisitStatusFilter<$PrismaModel>
    _max?: NestedEnumVisitStatusFilter<$PrismaModel>
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type VisitRelationFilter = {
    is?: VisitWhereInput
    isNot?: VisitWhereInput
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    visitId?: SortOrder
    senderId?: SortOrder
    senderRole?: SortOrder
    message?: SortOrder
    attachments?: SortOrder
    timestamp?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    visitId?: SortOrder
    senderId?: SortOrder
    senderRole?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    visitId?: SortOrder
    senderId?: SortOrder
    senderRole?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ProviderAvailabilityCountOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderAvailabilityAvgOrderByAggregateInput = {
    dayOfWeek?: SortOrder
  }

  export type ProviderAvailabilityMaxOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderAvailabilityMinOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderAvailabilitySumOrderByAggregateInput = {
    dayOfWeek?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ProviderBreakCountOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type ProviderBreakMaxOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type ProviderBreakMinOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type VisitCreateNestedOneWithoutAppointmentInput = {
    create?: XOR<VisitCreateWithoutAppointmentInput, VisitUncheckedCreateWithoutAppointmentInput>
    connectOrCreate?: VisitCreateOrConnectWithoutAppointmentInput
    connect?: VisitWhereUniqueInput
  }

  export type VisitUncheckedCreateNestedOneWithoutAppointmentInput = {
    create?: XOR<VisitCreateWithoutAppointmentInput, VisitUncheckedCreateWithoutAppointmentInput>
    connectOrCreate?: VisitCreateOrConnectWithoutAppointmentInput
    connect?: VisitWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumAppointmentTypeFieldUpdateOperationsInput = {
    set?: $Enums.AppointmentType
  }

  export type EnumAppointmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.AppointmentStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type VisitUpdateOneWithoutAppointmentNestedInput = {
    create?: XOR<VisitCreateWithoutAppointmentInput, VisitUncheckedCreateWithoutAppointmentInput>
    connectOrCreate?: VisitCreateOrConnectWithoutAppointmentInput
    upsert?: VisitUpsertWithoutAppointmentInput
    disconnect?: VisitWhereInput | boolean
    delete?: VisitWhereInput | boolean
    connect?: VisitWhereUniqueInput
    update?: XOR<XOR<VisitUpdateToOneWithWhereWithoutAppointmentInput, VisitUpdateWithoutAppointmentInput>, VisitUncheckedUpdateWithoutAppointmentInput>
  }

  export type VisitUncheckedUpdateOneWithoutAppointmentNestedInput = {
    create?: XOR<VisitCreateWithoutAppointmentInput, VisitUncheckedCreateWithoutAppointmentInput>
    connectOrCreate?: VisitCreateOrConnectWithoutAppointmentInput
    upsert?: VisitUpsertWithoutAppointmentInput
    disconnect?: VisitWhereInput | boolean
    delete?: VisitWhereInput | boolean
    connect?: VisitWhereUniqueInput
    update?: XOR<XOR<VisitUpdateToOneWithWhereWithoutAppointmentInput, VisitUpdateWithoutAppointmentInput>, VisitUncheckedUpdateWithoutAppointmentInput>
  }

  export type AppointmentCreateNestedOneWithoutVisitInput = {
    create?: XOR<AppointmentCreateWithoutVisitInput, AppointmentUncheckedCreateWithoutVisitInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutVisitInput
    connect?: AppointmentWhereUniqueInput
  }

  export type ChatMessageCreateNestedManyWithoutVisitInput = {
    create?: XOR<ChatMessageCreateWithoutVisitInput, ChatMessageUncheckedCreateWithoutVisitInput> | ChatMessageCreateWithoutVisitInput[] | ChatMessageUncheckedCreateWithoutVisitInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutVisitInput | ChatMessageCreateOrConnectWithoutVisitInput[]
    createMany?: ChatMessageCreateManyVisitInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutVisitInput = {
    create?: XOR<ChatMessageCreateWithoutVisitInput, ChatMessageUncheckedCreateWithoutVisitInput> | ChatMessageCreateWithoutVisitInput[] | ChatMessageUncheckedCreateWithoutVisitInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutVisitInput | ChatMessageCreateOrConnectWithoutVisitInput[]
    createMany?: ChatMessageCreateManyVisitInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type EnumVisitStatusFieldUpdateOperationsInput = {
    set?: $Enums.VisitStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AppointmentUpdateOneRequiredWithoutVisitNestedInput = {
    create?: XOR<AppointmentCreateWithoutVisitInput, AppointmentUncheckedCreateWithoutVisitInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutVisitInput
    upsert?: AppointmentUpsertWithoutVisitInput
    connect?: AppointmentWhereUniqueInput
    update?: XOR<XOR<AppointmentUpdateToOneWithWhereWithoutVisitInput, AppointmentUpdateWithoutVisitInput>, AppointmentUncheckedUpdateWithoutVisitInput>
  }

  export type ChatMessageUpdateManyWithoutVisitNestedInput = {
    create?: XOR<ChatMessageCreateWithoutVisitInput, ChatMessageUncheckedCreateWithoutVisitInput> | ChatMessageCreateWithoutVisitInput[] | ChatMessageUncheckedCreateWithoutVisitInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutVisitInput | ChatMessageCreateOrConnectWithoutVisitInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutVisitInput | ChatMessageUpsertWithWhereUniqueWithoutVisitInput[]
    createMany?: ChatMessageCreateManyVisitInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutVisitInput | ChatMessageUpdateWithWhereUniqueWithoutVisitInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutVisitInput | ChatMessageUpdateManyWithWhereWithoutVisitInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type ChatMessageUncheckedUpdateManyWithoutVisitNestedInput = {
    create?: XOR<ChatMessageCreateWithoutVisitInput, ChatMessageUncheckedCreateWithoutVisitInput> | ChatMessageCreateWithoutVisitInput[] | ChatMessageUncheckedCreateWithoutVisitInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutVisitInput | ChatMessageCreateOrConnectWithoutVisitInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutVisitInput | ChatMessageUpsertWithWhereUniqueWithoutVisitInput[]
    createMany?: ChatMessageCreateManyVisitInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutVisitInput | ChatMessageUpdateWithWhereUniqueWithoutVisitInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutVisitInput | ChatMessageUpdateManyWithWhereWithoutVisitInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type ChatMessageCreateattachmentsInput = {
    set: string[]
  }

  export type VisitCreateNestedOneWithoutMessagesInput = {
    create?: XOR<VisitCreateWithoutMessagesInput, VisitUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: VisitCreateOrConnectWithoutMessagesInput
    connect?: VisitWhereUniqueInput
  }

  export type ChatMessageUpdateattachmentsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type VisitUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<VisitCreateWithoutMessagesInput, VisitUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: VisitCreateOrConnectWithoutMessagesInput
    upsert?: VisitUpsertWithoutMessagesInput
    connect?: VisitWhereUniqueInput
    update?: XOR<XOR<VisitUpdateToOneWithWhereWithoutMessagesInput, VisitUpdateWithoutMessagesInput>, VisitUncheckedUpdateWithoutMessagesInput>
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
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

  export type NestedEnumAppointmentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentType | EnumAppointmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentType[] | ListEnumAppointmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentType[] | ListEnumAppointmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentTypeFilter<$PrismaModel> | $Enums.AppointmentType
  }

  export type NestedEnumAppointmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusFilter<$PrismaModel> | $Enums.AppointmentStatus
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

  export type NestedEnumAppointmentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentType | EnumAppointmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentType[] | ListEnumAppointmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentType[] | ListEnumAppointmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentTypeWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppointmentTypeFilter<$PrismaModel>
    _max?: NestedEnumAppointmentTypeFilter<$PrismaModel>
  }

  export type NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppointmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAppointmentStatusFilter<$PrismaModel>
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

  export type NestedEnumVisitStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitStatus | EnumVisitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitStatusFilter<$PrismaModel> | $Enums.VisitStatus
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

  export type NestedEnumVisitStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitStatus | EnumVisitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitStatus[] | ListEnumVisitStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitStatusWithAggregatesFilter<$PrismaModel> | $Enums.VisitStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVisitStatusFilter<$PrismaModel>
    _max?: NestedEnumVisitStatusFilter<$PrismaModel>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type VisitCreateWithoutAppointmentInput = {
    id?: string
    sessionToken: string
    status?: $Enums.VisitStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    roomId: string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageCreateNestedManyWithoutVisitInput
  }

  export type VisitUncheckedCreateWithoutAppointmentInput = {
    id?: string
    sessionToken: string
    status?: $Enums.VisitStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    roomId: string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutVisitInput
  }

  export type VisitCreateOrConnectWithoutAppointmentInput = {
    where: VisitWhereUniqueInput
    create: XOR<VisitCreateWithoutAppointmentInput, VisitUncheckedCreateWithoutAppointmentInput>
  }

  export type VisitUpsertWithoutAppointmentInput = {
    update: XOR<VisitUpdateWithoutAppointmentInput, VisitUncheckedUpdateWithoutAppointmentInput>
    create: XOR<VisitCreateWithoutAppointmentInput, VisitUncheckedCreateWithoutAppointmentInput>
    where?: VisitWhereInput
  }

  export type VisitUpdateToOneWithWhereWithoutAppointmentInput = {
    where?: VisitWhereInput
    data: XOR<VisitUpdateWithoutAppointmentInput, VisitUncheckedUpdateWithoutAppointmentInput>
  }

  export type VisitUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUpdateManyWithoutVisitNestedInput
  }

  export type VisitUncheckedUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutVisitNestedInput
  }

  export type AppointmentCreateWithoutVisitInput = {
    id?: string
    patientId: string
    providerId: string
    scheduledAt: Date | string
    duration: number
    type: $Enums.AppointmentType
    status?: $Enums.AppointmentStatus
    reasonForVisit?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUncheckedCreateWithoutVisitInput = {
    id?: string
    patientId: string
    providerId: string
    scheduledAt: Date | string
    duration: number
    type: $Enums.AppointmentType
    status?: $Enums.AppointmentStatus
    reasonForVisit?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateOrConnectWithoutVisitInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutVisitInput, AppointmentUncheckedCreateWithoutVisitInput>
  }

  export type ChatMessageCreateWithoutVisitInput = {
    id?: string
    senderId: string
    senderRole: string
    message: string
    attachments?: ChatMessageCreateattachmentsInput | string[]
    timestamp?: Date | string
  }

  export type ChatMessageUncheckedCreateWithoutVisitInput = {
    id?: string
    senderId: string
    senderRole: string
    message: string
    attachments?: ChatMessageCreateattachmentsInput | string[]
    timestamp?: Date | string
  }

  export type ChatMessageCreateOrConnectWithoutVisitInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutVisitInput, ChatMessageUncheckedCreateWithoutVisitInput>
  }

  export type ChatMessageCreateManyVisitInputEnvelope = {
    data: ChatMessageCreateManyVisitInput | ChatMessageCreateManyVisitInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentUpsertWithoutVisitInput = {
    update: XOR<AppointmentUpdateWithoutVisitInput, AppointmentUncheckedUpdateWithoutVisitInput>
    create: XOR<AppointmentCreateWithoutVisitInput, AppointmentUncheckedCreateWithoutVisitInput>
    where?: AppointmentWhereInput
  }

  export type AppointmentUpdateToOneWithWhereWithoutVisitInput = {
    where?: AppointmentWhereInput
    data: XOR<AppointmentUpdateWithoutVisitInput, AppointmentUncheckedUpdateWithoutVisitInput>
  }

  export type AppointmentUpdateWithoutVisitInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    type?: EnumAppointmentTypeFieldUpdateOperationsInput | $Enums.AppointmentType
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reasonForVisit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateWithoutVisitInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    type?: EnumAppointmentTypeFieldUpdateOperationsInput | $Enums.AppointmentType
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reasonForVisit?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutVisitInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutVisitInput, ChatMessageUncheckedUpdateWithoutVisitInput>
    create: XOR<ChatMessageCreateWithoutVisitInput, ChatMessageUncheckedCreateWithoutVisitInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutVisitInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutVisitInput, ChatMessageUncheckedUpdateWithoutVisitInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutVisitInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutVisitInput>
  }

  export type ChatMessageScalarWhereInput = {
    AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    OR?: ChatMessageScalarWhereInput[]
    NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    visitId?: StringFilter<"ChatMessage"> | string
    senderId?: StringFilter<"ChatMessage"> | string
    senderRole?: StringFilter<"ChatMessage"> | string
    message?: StringFilter<"ChatMessage"> | string
    attachments?: StringNullableListFilter<"ChatMessage">
    timestamp?: DateTimeFilter<"ChatMessage"> | Date | string
  }

  export type VisitCreateWithoutMessagesInput = {
    id?: string
    sessionToken: string
    status?: $Enums.VisitStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    roomId: string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    appointment: AppointmentCreateNestedOneWithoutVisitInput
  }

  export type VisitUncheckedCreateWithoutMessagesInput = {
    id?: string
    appointmentId: string
    sessionToken: string
    status?: $Enums.VisitStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    roomId: string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisitCreateOrConnectWithoutMessagesInput = {
    where: VisitWhereUniqueInput
    create: XOR<VisitCreateWithoutMessagesInput, VisitUncheckedCreateWithoutMessagesInput>
  }

  export type VisitUpsertWithoutMessagesInput = {
    update: XOR<VisitUpdateWithoutMessagesInput, VisitUncheckedUpdateWithoutMessagesInput>
    create: XOR<VisitCreateWithoutMessagesInput, VisitUncheckedCreateWithoutMessagesInput>
    where?: VisitWhereInput
  }

  export type VisitUpdateToOneWithWhereWithoutMessagesInput = {
    where?: VisitWhereInput
    data: XOR<VisitUpdateWithoutMessagesInput, VisitUncheckedUpdateWithoutMessagesInput>
  }

  export type VisitUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointment?: AppointmentUpdateOneRequiredWithoutVisitNestedInput
  }

  export type VisitUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    appointmentId?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    status?: EnumVisitStatusFieldUpdateOperationsInput | $Enums.VisitStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    iceServers?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManyVisitInput = {
    id?: string
    senderId: string
    senderRole: string
    message: string
    attachments?: ChatMessageCreateattachmentsInput | string[]
    timestamp?: Date | string
  }

  export type ChatMessageUpdateWithoutVisitInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    attachments?: ChatMessageUpdateattachmentsInput | string[]
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateWithoutVisitInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    attachments?: ChatMessageUpdateattachmentsInput | string[]
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutVisitInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    senderRole?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    attachments?: ChatMessageUpdateattachmentsInput | string[]
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use VisitCountOutputTypeDefaultArgs instead
     */
    export type VisitCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VisitCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AppointmentDefaultArgs instead
     */
    export type AppointmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AppointmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VisitDefaultArgs instead
     */
    export type VisitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VisitDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChatMessageDefaultArgs instead
     */
    export type ChatMessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChatMessageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProviderAvailabilityDefaultArgs instead
     */
    export type ProviderAvailabilityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProviderAvailabilityDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProviderBreakDefaultArgs instead
     */
    export type ProviderBreakArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProviderBreakDefaultArgs<ExtArgs>

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