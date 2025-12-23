
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
 * Model Prescription
 * 
 */
export type Prescription = $Result.DefaultSelection<Prisma.$PrescriptionPayload>
/**
 * Model PrescriptionItem
 * 
 */
export type PrescriptionItem = $Result.DefaultSelection<Prisma.$PrescriptionItemPayload>
/**
 * Model Pharmacy
 * 
 */
export type Pharmacy = $Result.DefaultSelection<Prisma.$PharmacyPayload>
/**
 * Model Medication
 * 
 */
export type Medication = $Result.DefaultSelection<Prisma.$MedicationPayload>
/**
 * Model PriorAuthorization
 * 
 */
export type PriorAuthorization = $Result.DefaultSelection<Prisma.$PriorAuthorizationPayload>
/**
 * Model Dispensing
 * 
 */
export type Dispensing = $Result.DefaultSelection<Prisma.$DispensingPayload>
/**
 * Model ControlledSubstanceLog
 * 
 */
export type ControlledSubstanceLog = $Result.DefaultSelection<Prisma.$ControlledSubstanceLogPayload>
/**
 * Model Inventory
 * 
 */
export type Inventory = $Result.DefaultSelection<Prisma.$InventoryPayload>
/**
 * Model DrugInteraction
 * 
 */
export type DrugInteraction = $Result.DefaultSelection<Prisma.$DrugInteractionPayload>
/**
 * Model DrugAllergy
 * 
 */
export type DrugAllergy = $Result.DefaultSelection<Prisma.$DrugAllergyPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PrescriptionStatus: {
  active: 'active',
  completed: 'completed',
  cancelled: 'cancelled',
  expired: 'expired'
};

export type PrescriptionStatus = (typeof PrescriptionStatus)[keyof typeof PrescriptionStatus]


export const PriorAuthStatus: {
  pending: 'pending',
  approved: 'approved',
  denied: 'denied',
  expired: 'expired',
  cancelled: 'cancelled',
  appealed: 'appealed'
};

export type PriorAuthStatus = (typeof PriorAuthStatus)[keyof typeof PriorAuthStatus]

}

export type PrescriptionStatus = $Enums.PrescriptionStatus

export const PrescriptionStatus: typeof $Enums.PrescriptionStatus

export type PriorAuthStatus = $Enums.PriorAuthStatus

export const PriorAuthStatus: typeof $Enums.PriorAuthStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Prescriptions
 * const prescriptions = await prisma.prescription.findMany()
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
   * // Fetch zero or more Prescriptions
   * const prescriptions = await prisma.prescription.findMany()
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
   * `prisma.prescription`: Exposes CRUD operations for the **Prescription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Prescriptions
    * const prescriptions = await prisma.prescription.findMany()
    * ```
    */
  get prescription(): Prisma.PrescriptionDelegate<ExtArgs>;

  /**
   * `prisma.prescriptionItem`: Exposes CRUD operations for the **PrescriptionItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PrescriptionItems
    * const prescriptionItems = await prisma.prescriptionItem.findMany()
    * ```
    */
  get prescriptionItem(): Prisma.PrescriptionItemDelegate<ExtArgs>;

  /**
   * `prisma.pharmacy`: Exposes CRUD operations for the **Pharmacy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pharmacies
    * const pharmacies = await prisma.pharmacy.findMany()
    * ```
    */
  get pharmacy(): Prisma.PharmacyDelegate<ExtArgs>;

  /**
   * `prisma.medication`: Exposes CRUD operations for the **Medication** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Medications
    * const medications = await prisma.medication.findMany()
    * ```
    */
  get medication(): Prisma.MedicationDelegate<ExtArgs>;

  /**
   * `prisma.priorAuthorization`: Exposes CRUD operations for the **PriorAuthorization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PriorAuthorizations
    * const priorAuthorizations = await prisma.priorAuthorization.findMany()
    * ```
    */
  get priorAuthorization(): Prisma.PriorAuthorizationDelegate<ExtArgs>;

  /**
   * `prisma.dispensing`: Exposes CRUD operations for the **Dispensing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dispensings
    * const dispensings = await prisma.dispensing.findMany()
    * ```
    */
  get dispensing(): Prisma.DispensingDelegate<ExtArgs>;

  /**
   * `prisma.controlledSubstanceLog`: Exposes CRUD operations for the **ControlledSubstanceLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ControlledSubstanceLogs
    * const controlledSubstanceLogs = await prisma.controlledSubstanceLog.findMany()
    * ```
    */
  get controlledSubstanceLog(): Prisma.ControlledSubstanceLogDelegate<ExtArgs>;

  /**
   * `prisma.inventory`: Exposes CRUD operations for the **Inventory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inventories
    * const inventories = await prisma.inventory.findMany()
    * ```
    */
  get inventory(): Prisma.InventoryDelegate<ExtArgs>;

  /**
   * `prisma.drugInteraction`: Exposes CRUD operations for the **DrugInteraction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DrugInteractions
    * const drugInteractions = await prisma.drugInteraction.findMany()
    * ```
    */
  get drugInteraction(): Prisma.DrugInteractionDelegate<ExtArgs>;

  /**
   * `prisma.drugAllergy`: Exposes CRUD operations for the **DrugAllergy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DrugAllergies
    * const drugAllergies = await prisma.drugAllergy.findMany()
    * ```
    */
  get drugAllergy(): Prisma.DrugAllergyDelegate<ExtArgs>;
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "prescription" | "prescriptionItem" | "pharmacy" | "medication" | "priorAuthorization" | "dispensing" | "controlledSubstanceLog" | "inventory" | "drugInteraction" | "drugAllergy"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Prescription: {
        payload: Prisma.$PrescriptionPayload<ExtArgs>
        fields: Prisma.PrescriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PrescriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PrescriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionPayload>
          }
          findFirst: {
            args: Prisma.PrescriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PrescriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionPayload>
          }
          findMany: {
            args: Prisma.PrescriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionPayload>[]
          }
          create: {
            args: Prisma.PrescriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionPayload>
          }
          createMany: {
            args: Prisma.PrescriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PrescriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionPayload>[]
          }
          delete: {
            args: Prisma.PrescriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionPayload>
          }
          update: {
            args: Prisma.PrescriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionPayload>
          }
          deleteMany: {
            args: Prisma.PrescriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PrescriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PrescriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionPayload>
          }
          aggregate: {
            args: Prisma.PrescriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrescription>
          }
          groupBy: {
            args: Prisma.PrescriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PrescriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PrescriptionCountArgs<ExtArgs>
            result: $Utils.Optional<PrescriptionCountAggregateOutputType> | number
          }
        }
      }
      PrescriptionItem: {
        payload: Prisma.$PrescriptionItemPayload<ExtArgs>
        fields: Prisma.PrescriptionItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PrescriptionItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PrescriptionItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionItemPayload>
          }
          findFirst: {
            args: Prisma.PrescriptionItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PrescriptionItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionItemPayload>
          }
          findMany: {
            args: Prisma.PrescriptionItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionItemPayload>[]
          }
          create: {
            args: Prisma.PrescriptionItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionItemPayload>
          }
          createMany: {
            args: Prisma.PrescriptionItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PrescriptionItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionItemPayload>[]
          }
          delete: {
            args: Prisma.PrescriptionItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionItemPayload>
          }
          update: {
            args: Prisma.PrescriptionItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionItemPayload>
          }
          deleteMany: {
            args: Prisma.PrescriptionItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PrescriptionItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PrescriptionItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrescriptionItemPayload>
          }
          aggregate: {
            args: Prisma.PrescriptionItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrescriptionItem>
          }
          groupBy: {
            args: Prisma.PrescriptionItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<PrescriptionItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.PrescriptionItemCountArgs<ExtArgs>
            result: $Utils.Optional<PrescriptionItemCountAggregateOutputType> | number
          }
        }
      }
      Pharmacy: {
        payload: Prisma.$PharmacyPayload<ExtArgs>
        fields: Prisma.PharmacyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PharmacyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PharmacyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          findFirst: {
            args: Prisma.PharmacyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PharmacyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          findMany: {
            args: Prisma.PharmacyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>[]
          }
          create: {
            args: Prisma.PharmacyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          createMany: {
            args: Prisma.PharmacyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PharmacyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>[]
          }
          delete: {
            args: Prisma.PharmacyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          update: {
            args: Prisma.PharmacyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          deleteMany: {
            args: Prisma.PharmacyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PharmacyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PharmacyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          aggregate: {
            args: Prisma.PharmacyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePharmacy>
          }
          groupBy: {
            args: Prisma.PharmacyGroupByArgs<ExtArgs>
            result: $Utils.Optional<PharmacyGroupByOutputType>[]
          }
          count: {
            args: Prisma.PharmacyCountArgs<ExtArgs>
            result: $Utils.Optional<PharmacyCountAggregateOutputType> | number
          }
        }
      }
      Medication: {
        payload: Prisma.$MedicationPayload<ExtArgs>
        fields: Prisma.MedicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MedicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MedicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationPayload>
          }
          findFirst: {
            args: Prisma.MedicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MedicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationPayload>
          }
          findMany: {
            args: Prisma.MedicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationPayload>[]
          }
          create: {
            args: Prisma.MedicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationPayload>
          }
          createMany: {
            args: Prisma.MedicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MedicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationPayload>[]
          }
          delete: {
            args: Prisma.MedicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationPayload>
          }
          update: {
            args: Prisma.MedicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationPayload>
          }
          deleteMany: {
            args: Prisma.MedicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MedicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MedicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationPayload>
          }
          aggregate: {
            args: Prisma.MedicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMedication>
          }
          groupBy: {
            args: Prisma.MedicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<MedicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.MedicationCountArgs<ExtArgs>
            result: $Utils.Optional<MedicationCountAggregateOutputType> | number
          }
        }
      }
      PriorAuthorization: {
        payload: Prisma.$PriorAuthorizationPayload<ExtArgs>
        fields: Prisma.PriorAuthorizationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PriorAuthorizationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorAuthorizationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PriorAuthorizationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorAuthorizationPayload>
          }
          findFirst: {
            args: Prisma.PriorAuthorizationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorAuthorizationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PriorAuthorizationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorAuthorizationPayload>
          }
          findMany: {
            args: Prisma.PriorAuthorizationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorAuthorizationPayload>[]
          }
          create: {
            args: Prisma.PriorAuthorizationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorAuthorizationPayload>
          }
          createMany: {
            args: Prisma.PriorAuthorizationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PriorAuthorizationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorAuthorizationPayload>[]
          }
          delete: {
            args: Prisma.PriorAuthorizationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorAuthorizationPayload>
          }
          update: {
            args: Prisma.PriorAuthorizationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorAuthorizationPayload>
          }
          deleteMany: {
            args: Prisma.PriorAuthorizationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PriorAuthorizationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PriorAuthorizationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriorAuthorizationPayload>
          }
          aggregate: {
            args: Prisma.PriorAuthorizationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePriorAuthorization>
          }
          groupBy: {
            args: Prisma.PriorAuthorizationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PriorAuthorizationGroupByOutputType>[]
          }
          count: {
            args: Prisma.PriorAuthorizationCountArgs<ExtArgs>
            result: $Utils.Optional<PriorAuthorizationCountAggregateOutputType> | number
          }
        }
      }
      Dispensing: {
        payload: Prisma.$DispensingPayload<ExtArgs>
        fields: Prisma.DispensingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DispensingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispensingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DispensingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispensingPayload>
          }
          findFirst: {
            args: Prisma.DispensingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispensingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DispensingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispensingPayload>
          }
          findMany: {
            args: Prisma.DispensingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispensingPayload>[]
          }
          create: {
            args: Prisma.DispensingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispensingPayload>
          }
          createMany: {
            args: Prisma.DispensingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DispensingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispensingPayload>[]
          }
          delete: {
            args: Prisma.DispensingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispensingPayload>
          }
          update: {
            args: Prisma.DispensingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispensingPayload>
          }
          deleteMany: {
            args: Prisma.DispensingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DispensingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DispensingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DispensingPayload>
          }
          aggregate: {
            args: Prisma.DispensingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDispensing>
          }
          groupBy: {
            args: Prisma.DispensingGroupByArgs<ExtArgs>
            result: $Utils.Optional<DispensingGroupByOutputType>[]
          }
          count: {
            args: Prisma.DispensingCountArgs<ExtArgs>
            result: $Utils.Optional<DispensingCountAggregateOutputType> | number
          }
        }
      }
      ControlledSubstanceLog: {
        payload: Prisma.$ControlledSubstanceLogPayload<ExtArgs>
        fields: Prisma.ControlledSubstanceLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ControlledSubstanceLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControlledSubstanceLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ControlledSubstanceLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControlledSubstanceLogPayload>
          }
          findFirst: {
            args: Prisma.ControlledSubstanceLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControlledSubstanceLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ControlledSubstanceLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControlledSubstanceLogPayload>
          }
          findMany: {
            args: Prisma.ControlledSubstanceLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControlledSubstanceLogPayload>[]
          }
          create: {
            args: Prisma.ControlledSubstanceLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControlledSubstanceLogPayload>
          }
          createMany: {
            args: Prisma.ControlledSubstanceLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ControlledSubstanceLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControlledSubstanceLogPayload>[]
          }
          delete: {
            args: Prisma.ControlledSubstanceLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControlledSubstanceLogPayload>
          }
          update: {
            args: Prisma.ControlledSubstanceLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControlledSubstanceLogPayload>
          }
          deleteMany: {
            args: Prisma.ControlledSubstanceLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ControlledSubstanceLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ControlledSubstanceLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControlledSubstanceLogPayload>
          }
          aggregate: {
            args: Prisma.ControlledSubstanceLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateControlledSubstanceLog>
          }
          groupBy: {
            args: Prisma.ControlledSubstanceLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ControlledSubstanceLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ControlledSubstanceLogCountArgs<ExtArgs>
            result: $Utils.Optional<ControlledSubstanceLogCountAggregateOutputType> | number
          }
        }
      }
      Inventory: {
        payload: Prisma.$InventoryPayload<ExtArgs>
        fields: Prisma.InventoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          findFirst: {
            args: Prisma.InventoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          findMany: {
            args: Prisma.InventoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          create: {
            args: Prisma.InventoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          createMany: {
            args: Prisma.InventoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          delete: {
            args: Prisma.InventoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          update: {
            args: Prisma.InventoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          deleteMany: {
            args: Prisma.InventoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          aggregate: {
            args: Prisma.InventoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventory>
          }
          groupBy: {
            args: Prisma.InventoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryCountAggregateOutputType> | number
          }
        }
      }
      DrugInteraction: {
        payload: Prisma.$DrugInteractionPayload<ExtArgs>
        fields: Prisma.DrugInteractionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DrugInteractionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugInteractionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DrugInteractionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugInteractionPayload>
          }
          findFirst: {
            args: Prisma.DrugInteractionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugInteractionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DrugInteractionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugInteractionPayload>
          }
          findMany: {
            args: Prisma.DrugInteractionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugInteractionPayload>[]
          }
          create: {
            args: Prisma.DrugInteractionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugInteractionPayload>
          }
          createMany: {
            args: Prisma.DrugInteractionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DrugInteractionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugInteractionPayload>[]
          }
          delete: {
            args: Prisma.DrugInteractionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugInteractionPayload>
          }
          update: {
            args: Prisma.DrugInteractionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugInteractionPayload>
          }
          deleteMany: {
            args: Prisma.DrugInteractionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DrugInteractionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DrugInteractionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugInteractionPayload>
          }
          aggregate: {
            args: Prisma.DrugInteractionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDrugInteraction>
          }
          groupBy: {
            args: Prisma.DrugInteractionGroupByArgs<ExtArgs>
            result: $Utils.Optional<DrugInteractionGroupByOutputType>[]
          }
          count: {
            args: Prisma.DrugInteractionCountArgs<ExtArgs>
            result: $Utils.Optional<DrugInteractionCountAggregateOutputType> | number
          }
        }
      }
      DrugAllergy: {
        payload: Prisma.$DrugAllergyPayload<ExtArgs>
        fields: Prisma.DrugAllergyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DrugAllergyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugAllergyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DrugAllergyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugAllergyPayload>
          }
          findFirst: {
            args: Prisma.DrugAllergyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugAllergyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DrugAllergyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugAllergyPayload>
          }
          findMany: {
            args: Prisma.DrugAllergyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugAllergyPayload>[]
          }
          create: {
            args: Prisma.DrugAllergyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugAllergyPayload>
          }
          createMany: {
            args: Prisma.DrugAllergyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DrugAllergyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugAllergyPayload>[]
          }
          delete: {
            args: Prisma.DrugAllergyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugAllergyPayload>
          }
          update: {
            args: Prisma.DrugAllergyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugAllergyPayload>
          }
          deleteMany: {
            args: Prisma.DrugAllergyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DrugAllergyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DrugAllergyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DrugAllergyPayload>
          }
          aggregate: {
            args: Prisma.DrugAllergyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDrugAllergy>
          }
          groupBy: {
            args: Prisma.DrugAllergyGroupByArgs<ExtArgs>
            result: $Utils.Optional<DrugAllergyGroupByOutputType>[]
          }
          count: {
            args: Prisma.DrugAllergyCountArgs<ExtArgs>
            result: $Utils.Optional<DrugAllergyCountAggregateOutputType> | number
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
   * Count Type PrescriptionCountOutputType
   */

  export type PrescriptionCountOutputType = {
    items: number
  }

  export type PrescriptionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | PrescriptionCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * PrescriptionCountOutputType without action
   */
  export type PrescriptionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionCountOutputType
     */
    select?: PrescriptionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PrescriptionCountOutputType without action
   */
  export type PrescriptionCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PrescriptionItemWhereInput
  }


  /**
   * Count Type MedicationCountOutputType
   */

  export type MedicationCountOutputType = {
    inventory: number
  }

  export type MedicationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventory?: boolean | MedicationCountOutputTypeCountInventoryArgs
  }

  // Custom InputTypes
  /**
   * MedicationCountOutputType without action
   */
  export type MedicationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationCountOutputType
     */
    select?: MedicationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MedicationCountOutputType without action
   */
  export type MedicationCountOutputTypeCountInventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryWhereInput
  }


  /**
   * Count Type PriorAuthorizationCountOutputType
   */

  export type PriorAuthorizationCountOutputType = {
    dispensings: number
  }

  export type PriorAuthorizationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dispensings?: boolean | PriorAuthorizationCountOutputTypeCountDispensingsArgs
  }

  // Custom InputTypes
  /**
   * PriorAuthorizationCountOutputType without action
   */
  export type PriorAuthorizationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorizationCountOutputType
     */
    select?: PriorAuthorizationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PriorAuthorizationCountOutputType without action
   */
  export type PriorAuthorizationCountOutputTypeCountDispensingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DispensingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Prescription
   */

  export type AggregatePrescription = {
    _count: PrescriptionCountAggregateOutputType | null
    _min: PrescriptionMinAggregateOutputType | null
    _max: PrescriptionMaxAggregateOutputType | null
  }

  export type PrescriptionMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    encounterId: string | null
    status: $Enums.PrescriptionStatus | null
    notes: string | null
    validFrom: Date | null
    validUntil: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PrescriptionMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    encounterId: string | null
    status: $Enums.PrescriptionStatus | null
    notes: string | null
    validFrom: Date | null
    validUntil: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PrescriptionCountAggregateOutputType = {
    id: number
    patientId: number
    providerId: number
    encounterId: number
    status: number
    notes: number
    validFrom: number
    validUntil: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PrescriptionMinAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    encounterId?: true
    status?: true
    notes?: true
    validFrom?: true
    validUntil?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PrescriptionMaxAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    encounterId?: true
    status?: true
    notes?: true
    validFrom?: true
    validUntil?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PrescriptionCountAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    encounterId?: true
    status?: true
    notes?: true
    validFrom?: true
    validUntil?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PrescriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Prescription to aggregate.
     */
    where?: PrescriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prescriptions to fetch.
     */
    orderBy?: PrescriptionOrderByWithRelationInput | PrescriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PrescriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prescriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prescriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Prescriptions
    **/
    _count?: true | PrescriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PrescriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PrescriptionMaxAggregateInputType
  }

  export type GetPrescriptionAggregateType<T extends PrescriptionAggregateArgs> = {
        [P in keyof T & keyof AggregatePrescription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrescription[P]>
      : GetScalarType<T[P], AggregatePrescription[P]>
  }




  export type PrescriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PrescriptionWhereInput
    orderBy?: PrescriptionOrderByWithAggregationInput | PrescriptionOrderByWithAggregationInput[]
    by: PrescriptionScalarFieldEnum[] | PrescriptionScalarFieldEnum
    having?: PrescriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PrescriptionCountAggregateInputType | true
    _min?: PrescriptionMinAggregateInputType
    _max?: PrescriptionMaxAggregateInputType
  }

  export type PrescriptionGroupByOutputType = {
    id: string
    patientId: string
    providerId: string
    encounterId: string | null
    status: $Enums.PrescriptionStatus
    notes: string | null
    validFrom: Date
    validUntil: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PrescriptionCountAggregateOutputType | null
    _min: PrescriptionMinAggregateOutputType | null
    _max: PrescriptionMaxAggregateOutputType | null
  }

  type GetPrescriptionGroupByPayload<T extends PrescriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PrescriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PrescriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PrescriptionGroupByOutputType[P]>
            : GetScalarType<T[P], PrescriptionGroupByOutputType[P]>
        }
      >
    >


  export type PrescriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    encounterId?: boolean
    status?: boolean
    notes?: boolean
    validFrom?: boolean
    validUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    items?: boolean | Prescription$itemsArgs<ExtArgs>
    _count?: boolean | PrescriptionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["prescription"]>

  export type PrescriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    encounterId?: boolean
    status?: boolean
    notes?: boolean
    validFrom?: boolean
    validUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["prescription"]>

  export type PrescriptionSelectScalar = {
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    encounterId?: boolean
    status?: boolean
    notes?: boolean
    validFrom?: boolean
    validUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PrescriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | Prescription$itemsArgs<ExtArgs>
    _count?: boolean | PrescriptionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PrescriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PrescriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Prescription"
    objects: {
      items: Prisma.$PrescriptionItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      providerId: string
      encounterId: string | null
      status: $Enums.PrescriptionStatus
      notes: string | null
      validFrom: Date
      validUntil: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["prescription"]>
    composites: {}
  }

  type PrescriptionGetPayload<S extends boolean | null | undefined | PrescriptionDefaultArgs> = $Result.GetResult<Prisma.$PrescriptionPayload, S>

  type PrescriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PrescriptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PrescriptionCountAggregateInputType | true
    }

  export interface PrescriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Prescription'], meta: { name: 'Prescription' } }
    /**
     * Find zero or one Prescription that matches the filter.
     * @param {PrescriptionFindUniqueArgs} args - Arguments to find a Prescription
     * @example
     * // Get one Prescription
     * const prescription = await prisma.prescription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PrescriptionFindUniqueArgs>(args: SelectSubset<T, PrescriptionFindUniqueArgs<ExtArgs>>): Prisma__PrescriptionClient<$Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Prescription that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PrescriptionFindUniqueOrThrowArgs} args - Arguments to find a Prescription
     * @example
     * // Get one Prescription
     * const prescription = await prisma.prescription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PrescriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, PrescriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PrescriptionClient<$Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Prescription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionFindFirstArgs} args - Arguments to find a Prescription
     * @example
     * // Get one Prescription
     * const prescription = await prisma.prescription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PrescriptionFindFirstArgs>(args?: SelectSubset<T, PrescriptionFindFirstArgs<ExtArgs>>): Prisma__PrescriptionClient<$Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Prescription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionFindFirstOrThrowArgs} args - Arguments to find a Prescription
     * @example
     * // Get one Prescription
     * const prescription = await prisma.prescription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PrescriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, PrescriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PrescriptionClient<$Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Prescriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Prescriptions
     * const prescriptions = await prisma.prescription.findMany()
     * 
     * // Get first 10 Prescriptions
     * const prescriptions = await prisma.prescription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const prescriptionWithIdOnly = await prisma.prescription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PrescriptionFindManyArgs>(args?: SelectSubset<T, PrescriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Prescription.
     * @param {PrescriptionCreateArgs} args - Arguments to create a Prescription.
     * @example
     * // Create one Prescription
     * const Prescription = await prisma.prescription.create({
     *   data: {
     *     // ... data to create a Prescription
     *   }
     * })
     * 
     */
    create<T extends PrescriptionCreateArgs>(args: SelectSubset<T, PrescriptionCreateArgs<ExtArgs>>): Prisma__PrescriptionClient<$Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Prescriptions.
     * @param {PrescriptionCreateManyArgs} args - Arguments to create many Prescriptions.
     * @example
     * // Create many Prescriptions
     * const prescription = await prisma.prescription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PrescriptionCreateManyArgs>(args?: SelectSubset<T, PrescriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Prescriptions and returns the data saved in the database.
     * @param {PrescriptionCreateManyAndReturnArgs} args - Arguments to create many Prescriptions.
     * @example
     * // Create many Prescriptions
     * const prescription = await prisma.prescription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Prescriptions and only return the `id`
     * const prescriptionWithIdOnly = await prisma.prescription.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PrescriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, PrescriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Prescription.
     * @param {PrescriptionDeleteArgs} args - Arguments to delete one Prescription.
     * @example
     * // Delete one Prescription
     * const Prescription = await prisma.prescription.delete({
     *   where: {
     *     // ... filter to delete one Prescription
     *   }
     * })
     * 
     */
    delete<T extends PrescriptionDeleteArgs>(args: SelectSubset<T, PrescriptionDeleteArgs<ExtArgs>>): Prisma__PrescriptionClient<$Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Prescription.
     * @param {PrescriptionUpdateArgs} args - Arguments to update one Prescription.
     * @example
     * // Update one Prescription
     * const prescription = await prisma.prescription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PrescriptionUpdateArgs>(args: SelectSubset<T, PrescriptionUpdateArgs<ExtArgs>>): Prisma__PrescriptionClient<$Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Prescriptions.
     * @param {PrescriptionDeleteManyArgs} args - Arguments to filter Prescriptions to delete.
     * @example
     * // Delete a few Prescriptions
     * const { count } = await prisma.prescription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PrescriptionDeleteManyArgs>(args?: SelectSubset<T, PrescriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Prescriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Prescriptions
     * const prescription = await prisma.prescription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PrescriptionUpdateManyArgs>(args: SelectSubset<T, PrescriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Prescription.
     * @param {PrescriptionUpsertArgs} args - Arguments to update or create a Prescription.
     * @example
     * // Update or create a Prescription
     * const prescription = await prisma.prescription.upsert({
     *   create: {
     *     // ... data to create a Prescription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Prescription we want to update
     *   }
     * })
     */
    upsert<T extends PrescriptionUpsertArgs>(args: SelectSubset<T, PrescriptionUpsertArgs<ExtArgs>>): Prisma__PrescriptionClient<$Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Prescriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionCountArgs} args - Arguments to filter Prescriptions to count.
     * @example
     * // Count the number of Prescriptions
     * const count = await prisma.prescription.count({
     *   where: {
     *     // ... the filter for the Prescriptions we want to count
     *   }
     * })
    **/
    count<T extends PrescriptionCountArgs>(
      args?: Subset<T, PrescriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PrescriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Prescription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PrescriptionAggregateArgs>(args: Subset<T, PrescriptionAggregateArgs>): Prisma.PrismaPromise<GetPrescriptionAggregateType<T>>

    /**
     * Group by Prescription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionGroupByArgs} args - Group by arguments.
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
      T extends PrescriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PrescriptionGroupByArgs['orderBy'] }
        : { orderBy?: PrescriptionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PrescriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrescriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Prescription model
   */
  readonly fields: PrescriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Prescription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PrescriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends Prescription$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Prescription$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrescriptionItemPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Prescription model
   */ 
  interface PrescriptionFieldRefs {
    readonly id: FieldRef<"Prescription", 'String'>
    readonly patientId: FieldRef<"Prescription", 'String'>
    readonly providerId: FieldRef<"Prescription", 'String'>
    readonly encounterId: FieldRef<"Prescription", 'String'>
    readonly status: FieldRef<"Prescription", 'PrescriptionStatus'>
    readonly notes: FieldRef<"Prescription", 'String'>
    readonly validFrom: FieldRef<"Prescription", 'DateTime'>
    readonly validUntil: FieldRef<"Prescription", 'DateTime'>
    readonly createdAt: FieldRef<"Prescription", 'DateTime'>
    readonly updatedAt: FieldRef<"Prescription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Prescription findUnique
   */
  export type PrescriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prescription
     */
    select?: PrescriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionInclude<ExtArgs> | null
    /**
     * Filter, which Prescription to fetch.
     */
    where: PrescriptionWhereUniqueInput
  }

  /**
   * Prescription findUniqueOrThrow
   */
  export type PrescriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prescription
     */
    select?: PrescriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionInclude<ExtArgs> | null
    /**
     * Filter, which Prescription to fetch.
     */
    where: PrescriptionWhereUniqueInput
  }

  /**
   * Prescription findFirst
   */
  export type PrescriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prescription
     */
    select?: PrescriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionInclude<ExtArgs> | null
    /**
     * Filter, which Prescription to fetch.
     */
    where?: PrescriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prescriptions to fetch.
     */
    orderBy?: PrescriptionOrderByWithRelationInput | PrescriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Prescriptions.
     */
    cursor?: PrescriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prescriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prescriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Prescriptions.
     */
    distinct?: PrescriptionScalarFieldEnum | PrescriptionScalarFieldEnum[]
  }

  /**
   * Prescription findFirstOrThrow
   */
  export type PrescriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prescription
     */
    select?: PrescriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionInclude<ExtArgs> | null
    /**
     * Filter, which Prescription to fetch.
     */
    where?: PrescriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prescriptions to fetch.
     */
    orderBy?: PrescriptionOrderByWithRelationInput | PrescriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Prescriptions.
     */
    cursor?: PrescriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prescriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prescriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Prescriptions.
     */
    distinct?: PrescriptionScalarFieldEnum | PrescriptionScalarFieldEnum[]
  }

  /**
   * Prescription findMany
   */
  export type PrescriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prescription
     */
    select?: PrescriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionInclude<ExtArgs> | null
    /**
     * Filter, which Prescriptions to fetch.
     */
    where?: PrescriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prescriptions to fetch.
     */
    orderBy?: PrescriptionOrderByWithRelationInput | PrescriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Prescriptions.
     */
    cursor?: PrescriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prescriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prescriptions.
     */
    skip?: number
    distinct?: PrescriptionScalarFieldEnum | PrescriptionScalarFieldEnum[]
  }

  /**
   * Prescription create
   */
  export type PrescriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prescription
     */
    select?: PrescriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Prescription.
     */
    data: XOR<PrescriptionCreateInput, PrescriptionUncheckedCreateInput>
  }

  /**
   * Prescription createMany
   */
  export type PrescriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Prescriptions.
     */
    data: PrescriptionCreateManyInput | PrescriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Prescription createManyAndReturn
   */
  export type PrescriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prescription
     */
    select?: PrescriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Prescriptions.
     */
    data: PrescriptionCreateManyInput | PrescriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Prescription update
   */
  export type PrescriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prescription
     */
    select?: PrescriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Prescription.
     */
    data: XOR<PrescriptionUpdateInput, PrescriptionUncheckedUpdateInput>
    /**
     * Choose, which Prescription to update.
     */
    where: PrescriptionWhereUniqueInput
  }

  /**
   * Prescription updateMany
   */
  export type PrescriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Prescriptions.
     */
    data: XOR<PrescriptionUpdateManyMutationInput, PrescriptionUncheckedUpdateManyInput>
    /**
     * Filter which Prescriptions to update
     */
    where?: PrescriptionWhereInput
  }

  /**
   * Prescription upsert
   */
  export type PrescriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prescription
     */
    select?: PrescriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Prescription to update in case it exists.
     */
    where: PrescriptionWhereUniqueInput
    /**
     * In case the Prescription found by the `where` argument doesn't exist, create a new Prescription with this data.
     */
    create: XOR<PrescriptionCreateInput, PrescriptionUncheckedCreateInput>
    /**
     * In case the Prescription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PrescriptionUpdateInput, PrescriptionUncheckedUpdateInput>
  }

  /**
   * Prescription delete
   */
  export type PrescriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prescription
     */
    select?: PrescriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionInclude<ExtArgs> | null
    /**
     * Filter which Prescription to delete.
     */
    where: PrescriptionWhereUniqueInput
  }

  /**
   * Prescription deleteMany
   */
  export type PrescriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Prescriptions to delete
     */
    where?: PrescriptionWhereInput
  }

  /**
   * Prescription.items
   */
  export type Prescription$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemInclude<ExtArgs> | null
    where?: PrescriptionItemWhereInput
    orderBy?: PrescriptionItemOrderByWithRelationInput | PrescriptionItemOrderByWithRelationInput[]
    cursor?: PrescriptionItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PrescriptionItemScalarFieldEnum | PrescriptionItemScalarFieldEnum[]
  }

  /**
   * Prescription without action
   */
  export type PrescriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prescription
     */
    select?: PrescriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionInclude<ExtArgs> | null
  }


  /**
   * Model PrescriptionItem
   */

  export type AggregatePrescriptionItem = {
    _count: PrescriptionItemCountAggregateOutputType | null
    _avg: PrescriptionItemAvgAggregateOutputType | null
    _sum: PrescriptionItemSumAggregateOutputType | null
    _min: PrescriptionItemMinAggregateOutputType | null
    _max: PrescriptionItemMaxAggregateOutputType | null
  }

  export type PrescriptionItemAvgAggregateOutputType = {
    quantity: number | null
    refillsAllowed: number | null
    refillsUsed: number | null
  }

  export type PrescriptionItemSumAggregateOutputType = {
    quantity: number | null
    refillsAllowed: number | null
    refillsUsed: number | null
  }

  export type PrescriptionItemMinAggregateOutputType = {
    id: string | null
    prescriptionId: string | null
    medicationName: string | null
    dosage: string | null
    frequency: string | null
    duration: string | null
    quantity: number | null
    refillsAllowed: number | null
    refillsUsed: number | null
    instructions: string | null
    isGenericAllowed: boolean | null
    createdAt: Date | null
  }

  export type PrescriptionItemMaxAggregateOutputType = {
    id: string | null
    prescriptionId: string | null
    medicationName: string | null
    dosage: string | null
    frequency: string | null
    duration: string | null
    quantity: number | null
    refillsAllowed: number | null
    refillsUsed: number | null
    instructions: string | null
    isGenericAllowed: boolean | null
    createdAt: Date | null
  }

  export type PrescriptionItemCountAggregateOutputType = {
    id: number
    prescriptionId: number
    medicationName: number
    dosage: number
    frequency: number
    duration: number
    quantity: number
    refillsAllowed: number
    refillsUsed: number
    instructions: number
    isGenericAllowed: number
    createdAt: number
    _all: number
  }


  export type PrescriptionItemAvgAggregateInputType = {
    quantity?: true
    refillsAllowed?: true
    refillsUsed?: true
  }

  export type PrescriptionItemSumAggregateInputType = {
    quantity?: true
    refillsAllowed?: true
    refillsUsed?: true
  }

  export type PrescriptionItemMinAggregateInputType = {
    id?: true
    prescriptionId?: true
    medicationName?: true
    dosage?: true
    frequency?: true
    duration?: true
    quantity?: true
    refillsAllowed?: true
    refillsUsed?: true
    instructions?: true
    isGenericAllowed?: true
    createdAt?: true
  }

  export type PrescriptionItemMaxAggregateInputType = {
    id?: true
    prescriptionId?: true
    medicationName?: true
    dosage?: true
    frequency?: true
    duration?: true
    quantity?: true
    refillsAllowed?: true
    refillsUsed?: true
    instructions?: true
    isGenericAllowed?: true
    createdAt?: true
  }

  export type PrescriptionItemCountAggregateInputType = {
    id?: true
    prescriptionId?: true
    medicationName?: true
    dosage?: true
    frequency?: true
    duration?: true
    quantity?: true
    refillsAllowed?: true
    refillsUsed?: true
    instructions?: true
    isGenericAllowed?: true
    createdAt?: true
    _all?: true
  }

  export type PrescriptionItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrescriptionItem to aggregate.
     */
    where?: PrescriptionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrescriptionItems to fetch.
     */
    orderBy?: PrescriptionItemOrderByWithRelationInput | PrescriptionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PrescriptionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrescriptionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrescriptionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PrescriptionItems
    **/
    _count?: true | PrescriptionItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PrescriptionItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PrescriptionItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PrescriptionItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PrescriptionItemMaxAggregateInputType
  }

  export type GetPrescriptionItemAggregateType<T extends PrescriptionItemAggregateArgs> = {
        [P in keyof T & keyof AggregatePrescriptionItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrescriptionItem[P]>
      : GetScalarType<T[P], AggregatePrescriptionItem[P]>
  }




  export type PrescriptionItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PrescriptionItemWhereInput
    orderBy?: PrescriptionItemOrderByWithAggregationInput | PrescriptionItemOrderByWithAggregationInput[]
    by: PrescriptionItemScalarFieldEnum[] | PrescriptionItemScalarFieldEnum
    having?: PrescriptionItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PrescriptionItemCountAggregateInputType | true
    _avg?: PrescriptionItemAvgAggregateInputType
    _sum?: PrescriptionItemSumAggregateInputType
    _min?: PrescriptionItemMinAggregateInputType
    _max?: PrescriptionItemMaxAggregateInputType
  }

  export type PrescriptionItemGroupByOutputType = {
    id: string
    prescriptionId: string
    medicationName: string
    dosage: string
    frequency: string
    duration: string | null
    quantity: number | null
    refillsAllowed: number
    refillsUsed: number
    instructions: string | null
    isGenericAllowed: boolean
    createdAt: Date
    _count: PrescriptionItemCountAggregateOutputType | null
    _avg: PrescriptionItemAvgAggregateOutputType | null
    _sum: PrescriptionItemSumAggregateOutputType | null
    _min: PrescriptionItemMinAggregateOutputType | null
    _max: PrescriptionItemMaxAggregateOutputType | null
  }

  type GetPrescriptionItemGroupByPayload<T extends PrescriptionItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PrescriptionItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PrescriptionItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PrescriptionItemGroupByOutputType[P]>
            : GetScalarType<T[P], PrescriptionItemGroupByOutputType[P]>
        }
      >
    >


  export type PrescriptionItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prescriptionId?: boolean
    medicationName?: boolean
    dosage?: boolean
    frequency?: boolean
    duration?: boolean
    quantity?: boolean
    refillsAllowed?: boolean
    refillsUsed?: boolean
    instructions?: boolean
    isGenericAllowed?: boolean
    createdAt?: boolean
    prescription?: boolean | PrescriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["prescriptionItem"]>

  export type PrescriptionItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prescriptionId?: boolean
    medicationName?: boolean
    dosage?: boolean
    frequency?: boolean
    duration?: boolean
    quantity?: boolean
    refillsAllowed?: boolean
    refillsUsed?: boolean
    instructions?: boolean
    isGenericAllowed?: boolean
    createdAt?: boolean
    prescription?: boolean | PrescriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["prescriptionItem"]>

  export type PrescriptionItemSelectScalar = {
    id?: boolean
    prescriptionId?: boolean
    medicationName?: boolean
    dosage?: boolean
    frequency?: boolean
    duration?: boolean
    quantity?: boolean
    refillsAllowed?: boolean
    refillsUsed?: boolean
    instructions?: boolean
    isGenericAllowed?: boolean
    createdAt?: boolean
  }

  export type PrescriptionItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prescription?: boolean | PrescriptionDefaultArgs<ExtArgs>
  }
  export type PrescriptionItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prescription?: boolean | PrescriptionDefaultArgs<ExtArgs>
  }

  export type $PrescriptionItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PrescriptionItem"
    objects: {
      prescription: Prisma.$PrescriptionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      prescriptionId: string
      medicationName: string
      dosage: string
      frequency: string
      duration: string | null
      quantity: number | null
      refillsAllowed: number
      refillsUsed: number
      instructions: string | null
      isGenericAllowed: boolean
      createdAt: Date
    }, ExtArgs["result"]["prescriptionItem"]>
    composites: {}
  }

  type PrescriptionItemGetPayload<S extends boolean | null | undefined | PrescriptionItemDefaultArgs> = $Result.GetResult<Prisma.$PrescriptionItemPayload, S>

  type PrescriptionItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PrescriptionItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PrescriptionItemCountAggregateInputType | true
    }

  export interface PrescriptionItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PrescriptionItem'], meta: { name: 'PrescriptionItem' } }
    /**
     * Find zero or one PrescriptionItem that matches the filter.
     * @param {PrescriptionItemFindUniqueArgs} args - Arguments to find a PrescriptionItem
     * @example
     * // Get one PrescriptionItem
     * const prescriptionItem = await prisma.prescriptionItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PrescriptionItemFindUniqueArgs>(args: SelectSubset<T, PrescriptionItemFindUniqueArgs<ExtArgs>>): Prisma__PrescriptionItemClient<$Result.GetResult<Prisma.$PrescriptionItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PrescriptionItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PrescriptionItemFindUniqueOrThrowArgs} args - Arguments to find a PrescriptionItem
     * @example
     * // Get one PrescriptionItem
     * const prescriptionItem = await prisma.prescriptionItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PrescriptionItemFindUniqueOrThrowArgs>(args: SelectSubset<T, PrescriptionItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PrescriptionItemClient<$Result.GetResult<Prisma.$PrescriptionItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PrescriptionItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionItemFindFirstArgs} args - Arguments to find a PrescriptionItem
     * @example
     * // Get one PrescriptionItem
     * const prescriptionItem = await prisma.prescriptionItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PrescriptionItemFindFirstArgs>(args?: SelectSubset<T, PrescriptionItemFindFirstArgs<ExtArgs>>): Prisma__PrescriptionItemClient<$Result.GetResult<Prisma.$PrescriptionItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PrescriptionItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionItemFindFirstOrThrowArgs} args - Arguments to find a PrescriptionItem
     * @example
     * // Get one PrescriptionItem
     * const prescriptionItem = await prisma.prescriptionItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PrescriptionItemFindFirstOrThrowArgs>(args?: SelectSubset<T, PrescriptionItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__PrescriptionItemClient<$Result.GetResult<Prisma.$PrescriptionItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PrescriptionItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PrescriptionItems
     * const prescriptionItems = await prisma.prescriptionItem.findMany()
     * 
     * // Get first 10 PrescriptionItems
     * const prescriptionItems = await prisma.prescriptionItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const prescriptionItemWithIdOnly = await prisma.prescriptionItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PrescriptionItemFindManyArgs>(args?: SelectSubset<T, PrescriptionItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrescriptionItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PrescriptionItem.
     * @param {PrescriptionItemCreateArgs} args - Arguments to create a PrescriptionItem.
     * @example
     * // Create one PrescriptionItem
     * const PrescriptionItem = await prisma.prescriptionItem.create({
     *   data: {
     *     // ... data to create a PrescriptionItem
     *   }
     * })
     * 
     */
    create<T extends PrescriptionItemCreateArgs>(args: SelectSubset<T, PrescriptionItemCreateArgs<ExtArgs>>): Prisma__PrescriptionItemClient<$Result.GetResult<Prisma.$PrescriptionItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PrescriptionItems.
     * @param {PrescriptionItemCreateManyArgs} args - Arguments to create many PrescriptionItems.
     * @example
     * // Create many PrescriptionItems
     * const prescriptionItem = await prisma.prescriptionItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PrescriptionItemCreateManyArgs>(args?: SelectSubset<T, PrescriptionItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PrescriptionItems and returns the data saved in the database.
     * @param {PrescriptionItemCreateManyAndReturnArgs} args - Arguments to create many PrescriptionItems.
     * @example
     * // Create many PrescriptionItems
     * const prescriptionItem = await prisma.prescriptionItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PrescriptionItems and only return the `id`
     * const prescriptionItemWithIdOnly = await prisma.prescriptionItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PrescriptionItemCreateManyAndReturnArgs>(args?: SelectSubset<T, PrescriptionItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrescriptionItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PrescriptionItem.
     * @param {PrescriptionItemDeleteArgs} args - Arguments to delete one PrescriptionItem.
     * @example
     * // Delete one PrescriptionItem
     * const PrescriptionItem = await prisma.prescriptionItem.delete({
     *   where: {
     *     // ... filter to delete one PrescriptionItem
     *   }
     * })
     * 
     */
    delete<T extends PrescriptionItemDeleteArgs>(args: SelectSubset<T, PrescriptionItemDeleteArgs<ExtArgs>>): Prisma__PrescriptionItemClient<$Result.GetResult<Prisma.$PrescriptionItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PrescriptionItem.
     * @param {PrescriptionItemUpdateArgs} args - Arguments to update one PrescriptionItem.
     * @example
     * // Update one PrescriptionItem
     * const prescriptionItem = await prisma.prescriptionItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PrescriptionItemUpdateArgs>(args: SelectSubset<T, PrescriptionItemUpdateArgs<ExtArgs>>): Prisma__PrescriptionItemClient<$Result.GetResult<Prisma.$PrescriptionItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PrescriptionItems.
     * @param {PrescriptionItemDeleteManyArgs} args - Arguments to filter PrescriptionItems to delete.
     * @example
     * // Delete a few PrescriptionItems
     * const { count } = await prisma.prescriptionItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PrescriptionItemDeleteManyArgs>(args?: SelectSubset<T, PrescriptionItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PrescriptionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PrescriptionItems
     * const prescriptionItem = await prisma.prescriptionItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PrescriptionItemUpdateManyArgs>(args: SelectSubset<T, PrescriptionItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PrescriptionItem.
     * @param {PrescriptionItemUpsertArgs} args - Arguments to update or create a PrescriptionItem.
     * @example
     * // Update or create a PrescriptionItem
     * const prescriptionItem = await prisma.prescriptionItem.upsert({
     *   create: {
     *     // ... data to create a PrescriptionItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PrescriptionItem we want to update
     *   }
     * })
     */
    upsert<T extends PrescriptionItemUpsertArgs>(args: SelectSubset<T, PrescriptionItemUpsertArgs<ExtArgs>>): Prisma__PrescriptionItemClient<$Result.GetResult<Prisma.$PrescriptionItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PrescriptionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionItemCountArgs} args - Arguments to filter PrescriptionItems to count.
     * @example
     * // Count the number of PrescriptionItems
     * const count = await prisma.prescriptionItem.count({
     *   where: {
     *     // ... the filter for the PrescriptionItems we want to count
     *   }
     * })
    **/
    count<T extends PrescriptionItemCountArgs>(
      args?: Subset<T, PrescriptionItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PrescriptionItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PrescriptionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PrescriptionItemAggregateArgs>(args: Subset<T, PrescriptionItemAggregateArgs>): Prisma.PrismaPromise<GetPrescriptionItemAggregateType<T>>

    /**
     * Group by PrescriptionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionItemGroupByArgs} args - Group by arguments.
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
      T extends PrescriptionItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PrescriptionItemGroupByArgs['orderBy'] }
        : { orderBy?: PrescriptionItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PrescriptionItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrescriptionItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PrescriptionItem model
   */
  readonly fields: PrescriptionItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PrescriptionItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PrescriptionItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    prescription<T extends PrescriptionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PrescriptionDefaultArgs<ExtArgs>>): Prisma__PrescriptionClient<$Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the PrescriptionItem model
   */ 
  interface PrescriptionItemFieldRefs {
    readonly id: FieldRef<"PrescriptionItem", 'String'>
    readonly prescriptionId: FieldRef<"PrescriptionItem", 'String'>
    readonly medicationName: FieldRef<"PrescriptionItem", 'String'>
    readonly dosage: FieldRef<"PrescriptionItem", 'String'>
    readonly frequency: FieldRef<"PrescriptionItem", 'String'>
    readonly duration: FieldRef<"PrescriptionItem", 'String'>
    readonly quantity: FieldRef<"PrescriptionItem", 'Int'>
    readonly refillsAllowed: FieldRef<"PrescriptionItem", 'Int'>
    readonly refillsUsed: FieldRef<"PrescriptionItem", 'Int'>
    readonly instructions: FieldRef<"PrescriptionItem", 'String'>
    readonly isGenericAllowed: FieldRef<"PrescriptionItem", 'Boolean'>
    readonly createdAt: FieldRef<"PrescriptionItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PrescriptionItem findUnique
   */
  export type PrescriptionItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemInclude<ExtArgs> | null
    /**
     * Filter, which PrescriptionItem to fetch.
     */
    where: PrescriptionItemWhereUniqueInput
  }

  /**
   * PrescriptionItem findUniqueOrThrow
   */
  export type PrescriptionItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemInclude<ExtArgs> | null
    /**
     * Filter, which PrescriptionItem to fetch.
     */
    where: PrescriptionItemWhereUniqueInput
  }

  /**
   * PrescriptionItem findFirst
   */
  export type PrescriptionItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemInclude<ExtArgs> | null
    /**
     * Filter, which PrescriptionItem to fetch.
     */
    where?: PrescriptionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrescriptionItems to fetch.
     */
    orderBy?: PrescriptionItemOrderByWithRelationInput | PrescriptionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrescriptionItems.
     */
    cursor?: PrescriptionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrescriptionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrescriptionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrescriptionItems.
     */
    distinct?: PrescriptionItemScalarFieldEnum | PrescriptionItemScalarFieldEnum[]
  }

  /**
   * PrescriptionItem findFirstOrThrow
   */
  export type PrescriptionItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemInclude<ExtArgs> | null
    /**
     * Filter, which PrescriptionItem to fetch.
     */
    where?: PrescriptionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrescriptionItems to fetch.
     */
    orderBy?: PrescriptionItemOrderByWithRelationInput | PrescriptionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrescriptionItems.
     */
    cursor?: PrescriptionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrescriptionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrescriptionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrescriptionItems.
     */
    distinct?: PrescriptionItemScalarFieldEnum | PrescriptionItemScalarFieldEnum[]
  }

  /**
   * PrescriptionItem findMany
   */
  export type PrescriptionItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemInclude<ExtArgs> | null
    /**
     * Filter, which PrescriptionItems to fetch.
     */
    where?: PrescriptionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrescriptionItems to fetch.
     */
    orderBy?: PrescriptionItemOrderByWithRelationInput | PrescriptionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PrescriptionItems.
     */
    cursor?: PrescriptionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrescriptionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrescriptionItems.
     */
    skip?: number
    distinct?: PrescriptionItemScalarFieldEnum | PrescriptionItemScalarFieldEnum[]
  }

  /**
   * PrescriptionItem create
   */
  export type PrescriptionItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemInclude<ExtArgs> | null
    /**
     * The data needed to create a PrescriptionItem.
     */
    data: XOR<PrescriptionItemCreateInput, PrescriptionItemUncheckedCreateInput>
  }

  /**
   * PrescriptionItem createMany
   */
  export type PrescriptionItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PrescriptionItems.
     */
    data: PrescriptionItemCreateManyInput | PrescriptionItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PrescriptionItem createManyAndReturn
   */
  export type PrescriptionItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PrescriptionItems.
     */
    data: PrescriptionItemCreateManyInput | PrescriptionItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PrescriptionItem update
   */
  export type PrescriptionItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemInclude<ExtArgs> | null
    /**
     * The data needed to update a PrescriptionItem.
     */
    data: XOR<PrescriptionItemUpdateInput, PrescriptionItemUncheckedUpdateInput>
    /**
     * Choose, which PrescriptionItem to update.
     */
    where: PrescriptionItemWhereUniqueInput
  }

  /**
   * PrescriptionItem updateMany
   */
  export type PrescriptionItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PrescriptionItems.
     */
    data: XOR<PrescriptionItemUpdateManyMutationInput, PrescriptionItemUncheckedUpdateManyInput>
    /**
     * Filter which PrescriptionItems to update
     */
    where?: PrescriptionItemWhereInput
  }

  /**
   * PrescriptionItem upsert
   */
  export type PrescriptionItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemInclude<ExtArgs> | null
    /**
     * The filter to search for the PrescriptionItem to update in case it exists.
     */
    where: PrescriptionItemWhereUniqueInput
    /**
     * In case the PrescriptionItem found by the `where` argument doesn't exist, create a new PrescriptionItem with this data.
     */
    create: XOR<PrescriptionItemCreateInput, PrescriptionItemUncheckedCreateInput>
    /**
     * In case the PrescriptionItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PrescriptionItemUpdateInput, PrescriptionItemUncheckedUpdateInput>
  }

  /**
   * PrescriptionItem delete
   */
  export type PrescriptionItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemInclude<ExtArgs> | null
    /**
     * Filter which PrescriptionItem to delete.
     */
    where: PrescriptionItemWhereUniqueInput
  }

  /**
   * PrescriptionItem deleteMany
   */
  export type PrescriptionItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrescriptionItems to delete
     */
    where?: PrescriptionItemWhereInput
  }

  /**
   * PrescriptionItem without action
   */
  export type PrescriptionItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionItem
     */
    select?: PrescriptionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrescriptionItemInclude<ExtArgs> | null
  }


  /**
   * Model Pharmacy
   */

  export type AggregatePharmacy = {
    _count: PharmacyCountAggregateOutputType | null
    _min: PharmacyMinAggregateOutputType | null
    _max: PharmacyMaxAggregateOutputType | null
  }

  export type PharmacyMinAggregateOutputType = {
    id: string | null
    name: string | null
    licenseNumber: string | null
    phone: string | null
    email: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PharmacyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    licenseNumber: string | null
    phone: string | null
    email: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PharmacyCountAggregateOutputType = {
    id: number
    name: number
    licenseNumber: number
    phone: number
    email: number
    address: number
    operatingHours: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PharmacyMinAggregateInputType = {
    id?: true
    name?: true
    licenseNumber?: true
    phone?: true
    email?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PharmacyMaxAggregateInputType = {
    id?: true
    name?: true
    licenseNumber?: true
    phone?: true
    email?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PharmacyCountAggregateInputType = {
    id?: true
    name?: true
    licenseNumber?: true
    phone?: true
    email?: true
    address?: true
    operatingHours?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PharmacyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pharmacy to aggregate.
     */
    where?: PharmacyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pharmacies to fetch.
     */
    orderBy?: PharmacyOrderByWithRelationInput | PharmacyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PharmacyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pharmacies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pharmacies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pharmacies
    **/
    _count?: true | PharmacyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PharmacyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PharmacyMaxAggregateInputType
  }

  export type GetPharmacyAggregateType<T extends PharmacyAggregateArgs> = {
        [P in keyof T & keyof AggregatePharmacy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePharmacy[P]>
      : GetScalarType<T[P], AggregatePharmacy[P]>
  }




  export type PharmacyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PharmacyWhereInput
    orderBy?: PharmacyOrderByWithAggregationInput | PharmacyOrderByWithAggregationInput[]
    by: PharmacyScalarFieldEnum[] | PharmacyScalarFieldEnum
    having?: PharmacyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PharmacyCountAggregateInputType | true
    _min?: PharmacyMinAggregateInputType
    _max?: PharmacyMaxAggregateInputType
  }

  export type PharmacyGroupByOutputType = {
    id: string
    name: string
    licenseNumber: string
    phone: string
    email: string | null
    address: JsonValue
    operatingHours: JsonValue | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: PharmacyCountAggregateOutputType | null
    _min: PharmacyMinAggregateOutputType | null
    _max: PharmacyMaxAggregateOutputType | null
  }

  type GetPharmacyGroupByPayload<T extends PharmacyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PharmacyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PharmacyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PharmacyGroupByOutputType[P]>
            : GetScalarType<T[P], PharmacyGroupByOutputType[P]>
        }
      >
    >


  export type PharmacySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    licenseNumber?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    operatingHours?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pharmacy"]>

  export type PharmacySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    licenseNumber?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    operatingHours?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pharmacy"]>

  export type PharmacySelectScalar = {
    id?: boolean
    name?: boolean
    licenseNumber?: boolean
    phone?: boolean
    email?: boolean
    address?: boolean
    operatingHours?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $PharmacyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pharmacy"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      licenseNumber: string
      phone: string
      email: string | null
      address: Prisma.JsonValue
      operatingHours: Prisma.JsonValue | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pharmacy"]>
    composites: {}
  }

  type PharmacyGetPayload<S extends boolean | null | undefined | PharmacyDefaultArgs> = $Result.GetResult<Prisma.$PharmacyPayload, S>

  type PharmacyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PharmacyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PharmacyCountAggregateInputType | true
    }

  export interface PharmacyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pharmacy'], meta: { name: 'Pharmacy' } }
    /**
     * Find zero or one Pharmacy that matches the filter.
     * @param {PharmacyFindUniqueArgs} args - Arguments to find a Pharmacy
     * @example
     * // Get one Pharmacy
     * const pharmacy = await prisma.pharmacy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PharmacyFindUniqueArgs>(args: SelectSubset<T, PharmacyFindUniqueArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Pharmacy that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PharmacyFindUniqueOrThrowArgs} args - Arguments to find a Pharmacy
     * @example
     * // Get one Pharmacy
     * const pharmacy = await prisma.pharmacy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PharmacyFindUniqueOrThrowArgs>(args: SelectSubset<T, PharmacyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Pharmacy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyFindFirstArgs} args - Arguments to find a Pharmacy
     * @example
     * // Get one Pharmacy
     * const pharmacy = await prisma.pharmacy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PharmacyFindFirstArgs>(args?: SelectSubset<T, PharmacyFindFirstArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Pharmacy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyFindFirstOrThrowArgs} args - Arguments to find a Pharmacy
     * @example
     * // Get one Pharmacy
     * const pharmacy = await prisma.pharmacy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PharmacyFindFirstOrThrowArgs>(args?: SelectSubset<T, PharmacyFindFirstOrThrowArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Pharmacies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pharmacies
     * const pharmacies = await prisma.pharmacy.findMany()
     * 
     * // Get first 10 Pharmacies
     * const pharmacies = await prisma.pharmacy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pharmacyWithIdOnly = await prisma.pharmacy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PharmacyFindManyArgs>(args?: SelectSubset<T, PharmacyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Pharmacy.
     * @param {PharmacyCreateArgs} args - Arguments to create a Pharmacy.
     * @example
     * // Create one Pharmacy
     * const Pharmacy = await prisma.pharmacy.create({
     *   data: {
     *     // ... data to create a Pharmacy
     *   }
     * })
     * 
     */
    create<T extends PharmacyCreateArgs>(args: SelectSubset<T, PharmacyCreateArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Pharmacies.
     * @param {PharmacyCreateManyArgs} args - Arguments to create many Pharmacies.
     * @example
     * // Create many Pharmacies
     * const pharmacy = await prisma.pharmacy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PharmacyCreateManyArgs>(args?: SelectSubset<T, PharmacyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pharmacies and returns the data saved in the database.
     * @param {PharmacyCreateManyAndReturnArgs} args - Arguments to create many Pharmacies.
     * @example
     * // Create many Pharmacies
     * const pharmacy = await prisma.pharmacy.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pharmacies and only return the `id`
     * const pharmacyWithIdOnly = await prisma.pharmacy.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PharmacyCreateManyAndReturnArgs>(args?: SelectSubset<T, PharmacyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Pharmacy.
     * @param {PharmacyDeleteArgs} args - Arguments to delete one Pharmacy.
     * @example
     * // Delete one Pharmacy
     * const Pharmacy = await prisma.pharmacy.delete({
     *   where: {
     *     // ... filter to delete one Pharmacy
     *   }
     * })
     * 
     */
    delete<T extends PharmacyDeleteArgs>(args: SelectSubset<T, PharmacyDeleteArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Pharmacy.
     * @param {PharmacyUpdateArgs} args - Arguments to update one Pharmacy.
     * @example
     * // Update one Pharmacy
     * const pharmacy = await prisma.pharmacy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PharmacyUpdateArgs>(args: SelectSubset<T, PharmacyUpdateArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Pharmacies.
     * @param {PharmacyDeleteManyArgs} args - Arguments to filter Pharmacies to delete.
     * @example
     * // Delete a few Pharmacies
     * const { count } = await prisma.pharmacy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PharmacyDeleteManyArgs>(args?: SelectSubset<T, PharmacyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pharmacies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pharmacies
     * const pharmacy = await prisma.pharmacy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PharmacyUpdateManyArgs>(args: SelectSubset<T, PharmacyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Pharmacy.
     * @param {PharmacyUpsertArgs} args - Arguments to update or create a Pharmacy.
     * @example
     * // Update or create a Pharmacy
     * const pharmacy = await prisma.pharmacy.upsert({
     *   create: {
     *     // ... data to create a Pharmacy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pharmacy we want to update
     *   }
     * })
     */
    upsert<T extends PharmacyUpsertArgs>(args: SelectSubset<T, PharmacyUpsertArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Pharmacies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyCountArgs} args - Arguments to filter Pharmacies to count.
     * @example
     * // Count the number of Pharmacies
     * const count = await prisma.pharmacy.count({
     *   where: {
     *     // ... the filter for the Pharmacies we want to count
     *   }
     * })
    **/
    count<T extends PharmacyCountArgs>(
      args?: Subset<T, PharmacyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PharmacyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pharmacy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PharmacyAggregateArgs>(args: Subset<T, PharmacyAggregateArgs>): Prisma.PrismaPromise<GetPharmacyAggregateType<T>>

    /**
     * Group by Pharmacy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyGroupByArgs} args - Group by arguments.
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
      T extends PharmacyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PharmacyGroupByArgs['orderBy'] }
        : { orderBy?: PharmacyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PharmacyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPharmacyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pharmacy model
   */
  readonly fields: PharmacyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pharmacy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PharmacyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Pharmacy model
   */ 
  interface PharmacyFieldRefs {
    readonly id: FieldRef<"Pharmacy", 'String'>
    readonly name: FieldRef<"Pharmacy", 'String'>
    readonly licenseNumber: FieldRef<"Pharmacy", 'String'>
    readonly phone: FieldRef<"Pharmacy", 'String'>
    readonly email: FieldRef<"Pharmacy", 'String'>
    readonly address: FieldRef<"Pharmacy", 'Json'>
    readonly operatingHours: FieldRef<"Pharmacy", 'Json'>
    readonly isActive: FieldRef<"Pharmacy", 'Boolean'>
    readonly createdAt: FieldRef<"Pharmacy", 'DateTime'>
    readonly updatedAt: FieldRef<"Pharmacy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pharmacy findUnique
   */
  export type PharmacyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Filter, which Pharmacy to fetch.
     */
    where: PharmacyWhereUniqueInput
  }

  /**
   * Pharmacy findUniqueOrThrow
   */
  export type PharmacyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Filter, which Pharmacy to fetch.
     */
    where: PharmacyWhereUniqueInput
  }

  /**
   * Pharmacy findFirst
   */
  export type PharmacyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Filter, which Pharmacy to fetch.
     */
    where?: PharmacyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pharmacies to fetch.
     */
    orderBy?: PharmacyOrderByWithRelationInput | PharmacyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pharmacies.
     */
    cursor?: PharmacyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pharmacies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pharmacies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pharmacies.
     */
    distinct?: PharmacyScalarFieldEnum | PharmacyScalarFieldEnum[]
  }

  /**
   * Pharmacy findFirstOrThrow
   */
  export type PharmacyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Filter, which Pharmacy to fetch.
     */
    where?: PharmacyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pharmacies to fetch.
     */
    orderBy?: PharmacyOrderByWithRelationInput | PharmacyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pharmacies.
     */
    cursor?: PharmacyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pharmacies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pharmacies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pharmacies.
     */
    distinct?: PharmacyScalarFieldEnum | PharmacyScalarFieldEnum[]
  }

  /**
   * Pharmacy findMany
   */
  export type PharmacyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Filter, which Pharmacies to fetch.
     */
    where?: PharmacyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pharmacies to fetch.
     */
    orderBy?: PharmacyOrderByWithRelationInput | PharmacyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pharmacies.
     */
    cursor?: PharmacyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pharmacies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pharmacies.
     */
    skip?: number
    distinct?: PharmacyScalarFieldEnum | PharmacyScalarFieldEnum[]
  }

  /**
   * Pharmacy create
   */
  export type PharmacyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * The data needed to create a Pharmacy.
     */
    data: XOR<PharmacyCreateInput, PharmacyUncheckedCreateInput>
  }

  /**
   * Pharmacy createMany
   */
  export type PharmacyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pharmacies.
     */
    data: PharmacyCreateManyInput | PharmacyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pharmacy createManyAndReturn
   */
  export type PharmacyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Pharmacies.
     */
    data: PharmacyCreateManyInput | PharmacyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pharmacy update
   */
  export type PharmacyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * The data needed to update a Pharmacy.
     */
    data: XOR<PharmacyUpdateInput, PharmacyUncheckedUpdateInput>
    /**
     * Choose, which Pharmacy to update.
     */
    where: PharmacyWhereUniqueInput
  }

  /**
   * Pharmacy updateMany
   */
  export type PharmacyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pharmacies.
     */
    data: XOR<PharmacyUpdateManyMutationInput, PharmacyUncheckedUpdateManyInput>
    /**
     * Filter which Pharmacies to update
     */
    where?: PharmacyWhereInput
  }

  /**
   * Pharmacy upsert
   */
  export type PharmacyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * The filter to search for the Pharmacy to update in case it exists.
     */
    where: PharmacyWhereUniqueInput
    /**
     * In case the Pharmacy found by the `where` argument doesn't exist, create a new Pharmacy with this data.
     */
    create: XOR<PharmacyCreateInput, PharmacyUncheckedCreateInput>
    /**
     * In case the Pharmacy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PharmacyUpdateInput, PharmacyUncheckedUpdateInput>
  }

  /**
   * Pharmacy delete
   */
  export type PharmacyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Filter which Pharmacy to delete.
     */
    where: PharmacyWhereUniqueInput
  }

  /**
   * Pharmacy deleteMany
   */
  export type PharmacyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pharmacies to delete
     */
    where?: PharmacyWhereInput
  }

  /**
   * Pharmacy without action
   */
  export type PharmacyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
  }


  /**
   * Model Medication
   */

  export type AggregateMedication = {
    _count: MedicationCountAggregateOutputType | null
    _min: MedicationMinAggregateOutputType | null
    _max: MedicationMaxAggregateOutputType | null
  }

  export type MedicationMinAggregateOutputType = {
    id: string | null
    name: string | null
    genericName: string | null
    strength: string | null
    dosageForm: string | null
    manufacturer: string | null
    ndcCode: string | null
    description: string | null
    isControlled: boolean | null
    schedule: string | null
    requiresPriorAuth: boolean | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MedicationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    genericName: string | null
    strength: string | null
    dosageForm: string | null
    manufacturer: string | null
    ndcCode: string | null
    description: string | null
    isControlled: boolean | null
    schedule: string | null
    requiresPriorAuth: boolean | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MedicationCountAggregateOutputType = {
    id: number
    name: number
    genericName: number
    brandNames: number
    strength: number
    dosageForm: number
    manufacturer: number
    ndcCode: number
    description: number
    sideEffects: number
    interactions: number
    isControlled: number
    schedule: number
    requiresPriorAuth: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MedicationMinAggregateInputType = {
    id?: true
    name?: true
    genericName?: true
    strength?: true
    dosageForm?: true
    manufacturer?: true
    ndcCode?: true
    description?: true
    isControlled?: true
    schedule?: true
    requiresPriorAuth?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MedicationMaxAggregateInputType = {
    id?: true
    name?: true
    genericName?: true
    strength?: true
    dosageForm?: true
    manufacturer?: true
    ndcCode?: true
    description?: true
    isControlled?: true
    schedule?: true
    requiresPriorAuth?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MedicationCountAggregateInputType = {
    id?: true
    name?: true
    genericName?: true
    brandNames?: true
    strength?: true
    dosageForm?: true
    manufacturer?: true
    ndcCode?: true
    description?: true
    sideEffects?: true
    interactions?: true
    isControlled?: true
    schedule?: true
    requiresPriorAuth?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MedicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Medication to aggregate.
     */
    where?: MedicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Medications to fetch.
     */
    orderBy?: MedicationOrderByWithRelationInput | MedicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MedicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Medications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Medications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Medications
    **/
    _count?: true | MedicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MedicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MedicationMaxAggregateInputType
  }

  export type GetMedicationAggregateType<T extends MedicationAggregateArgs> = {
        [P in keyof T & keyof AggregateMedication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMedication[P]>
      : GetScalarType<T[P], AggregateMedication[P]>
  }




  export type MedicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MedicationWhereInput
    orderBy?: MedicationOrderByWithAggregationInput | MedicationOrderByWithAggregationInput[]
    by: MedicationScalarFieldEnum[] | MedicationScalarFieldEnum
    having?: MedicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MedicationCountAggregateInputType | true
    _min?: MedicationMinAggregateInputType
    _max?: MedicationMaxAggregateInputType
  }

  export type MedicationGroupByOutputType = {
    id: string
    name: string
    genericName: string | null
    brandNames: string[]
    strength: string
    dosageForm: string
    manufacturer: string | null
    ndcCode: string | null
    description: string | null
    sideEffects: string[]
    interactions: string[]
    isControlled: boolean
    schedule: string | null
    requiresPriorAuth: boolean
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: MedicationCountAggregateOutputType | null
    _min: MedicationMinAggregateOutputType | null
    _max: MedicationMaxAggregateOutputType | null
  }

  type GetMedicationGroupByPayload<T extends MedicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MedicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MedicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MedicationGroupByOutputType[P]>
            : GetScalarType<T[P], MedicationGroupByOutputType[P]>
        }
      >
    >


  export type MedicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    genericName?: boolean
    brandNames?: boolean
    strength?: boolean
    dosageForm?: boolean
    manufacturer?: boolean
    ndcCode?: boolean
    description?: boolean
    sideEffects?: boolean
    interactions?: boolean
    isControlled?: boolean
    schedule?: boolean
    requiresPriorAuth?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    inventory?: boolean | Medication$inventoryArgs<ExtArgs>
    _count?: boolean | MedicationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["medication"]>

  export type MedicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    genericName?: boolean
    brandNames?: boolean
    strength?: boolean
    dosageForm?: boolean
    manufacturer?: boolean
    ndcCode?: boolean
    description?: boolean
    sideEffects?: boolean
    interactions?: boolean
    isControlled?: boolean
    schedule?: boolean
    requiresPriorAuth?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["medication"]>

  export type MedicationSelectScalar = {
    id?: boolean
    name?: boolean
    genericName?: boolean
    brandNames?: boolean
    strength?: boolean
    dosageForm?: boolean
    manufacturer?: boolean
    ndcCode?: boolean
    description?: boolean
    sideEffects?: boolean
    interactions?: boolean
    isControlled?: boolean
    schedule?: boolean
    requiresPriorAuth?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MedicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventory?: boolean | Medication$inventoryArgs<ExtArgs>
    _count?: boolean | MedicationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MedicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MedicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Medication"
    objects: {
      inventory: Prisma.$InventoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      genericName: string | null
      brandNames: string[]
      strength: string
      dosageForm: string
      manufacturer: string | null
      ndcCode: string | null
      description: string | null
      sideEffects: string[]
      interactions: string[]
      isControlled: boolean
      schedule: string | null
      requiresPriorAuth: boolean
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["medication"]>
    composites: {}
  }

  type MedicationGetPayload<S extends boolean | null | undefined | MedicationDefaultArgs> = $Result.GetResult<Prisma.$MedicationPayload, S>

  type MedicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MedicationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MedicationCountAggregateInputType | true
    }

  export interface MedicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Medication'], meta: { name: 'Medication' } }
    /**
     * Find zero or one Medication that matches the filter.
     * @param {MedicationFindUniqueArgs} args - Arguments to find a Medication
     * @example
     * // Get one Medication
     * const medication = await prisma.medication.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MedicationFindUniqueArgs>(args: SelectSubset<T, MedicationFindUniqueArgs<ExtArgs>>): Prisma__MedicationClient<$Result.GetResult<Prisma.$MedicationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Medication that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MedicationFindUniqueOrThrowArgs} args - Arguments to find a Medication
     * @example
     * // Get one Medication
     * const medication = await prisma.medication.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MedicationFindUniqueOrThrowArgs>(args: SelectSubset<T, MedicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MedicationClient<$Result.GetResult<Prisma.$MedicationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Medication that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationFindFirstArgs} args - Arguments to find a Medication
     * @example
     * // Get one Medication
     * const medication = await prisma.medication.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MedicationFindFirstArgs>(args?: SelectSubset<T, MedicationFindFirstArgs<ExtArgs>>): Prisma__MedicationClient<$Result.GetResult<Prisma.$MedicationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Medication that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationFindFirstOrThrowArgs} args - Arguments to find a Medication
     * @example
     * // Get one Medication
     * const medication = await prisma.medication.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MedicationFindFirstOrThrowArgs>(args?: SelectSubset<T, MedicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__MedicationClient<$Result.GetResult<Prisma.$MedicationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Medications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Medications
     * const medications = await prisma.medication.findMany()
     * 
     * // Get first 10 Medications
     * const medications = await prisma.medication.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const medicationWithIdOnly = await prisma.medication.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MedicationFindManyArgs>(args?: SelectSubset<T, MedicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Medication.
     * @param {MedicationCreateArgs} args - Arguments to create a Medication.
     * @example
     * // Create one Medication
     * const Medication = await prisma.medication.create({
     *   data: {
     *     // ... data to create a Medication
     *   }
     * })
     * 
     */
    create<T extends MedicationCreateArgs>(args: SelectSubset<T, MedicationCreateArgs<ExtArgs>>): Prisma__MedicationClient<$Result.GetResult<Prisma.$MedicationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Medications.
     * @param {MedicationCreateManyArgs} args - Arguments to create many Medications.
     * @example
     * // Create many Medications
     * const medication = await prisma.medication.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MedicationCreateManyArgs>(args?: SelectSubset<T, MedicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Medications and returns the data saved in the database.
     * @param {MedicationCreateManyAndReturnArgs} args - Arguments to create many Medications.
     * @example
     * // Create many Medications
     * const medication = await prisma.medication.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Medications and only return the `id`
     * const medicationWithIdOnly = await prisma.medication.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MedicationCreateManyAndReturnArgs>(args?: SelectSubset<T, MedicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Medication.
     * @param {MedicationDeleteArgs} args - Arguments to delete one Medication.
     * @example
     * // Delete one Medication
     * const Medication = await prisma.medication.delete({
     *   where: {
     *     // ... filter to delete one Medication
     *   }
     * })
     * 
     */
    delete<T extends MedicationDeleteArgs>(args: SelectSubset<T, MedicationDeleteArgs<ExtArgs>>): Prisma__MedicationClient<$Result.GetResult<Prisma.$MedicationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Medication.
     * @param {MedicationUpdateArgs} args - Arguments to update one Medication.
     * @example
     * // Update one Medication
     * const medication = await prisma.medication.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MedicationUpdateArgs>(args: SelectSubset<T, MedicationUpdateArgs<ExtArgs>>): Prisma__MedicationClient<$Result.GetResult<Prisma.$MedicationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Medications.
     * @param {MedicationDeleteManyArgs} args - Arguments to filter Medications to delete.
     * @example
     * // Delete a few Medications
     * const { count } = await prisma.medication.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MedicationDeleteManyArgs>(args?: SelectSubset<T, MedicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Medications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Medications
     * const medication = await prisma.medication.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MedicationUpdateManyArgs>(args: SelectSubset<T, MedicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Medication.
     * @param {MedicationUpsertArgs} args - Arguments to update or create a Medication.
     * @example
     * // Update or create a Medication
     * const medication = await prisma.medication.upsert({
     *   create: {
     *     // ... data to create a Medication
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Medication we want to update
     *   }
     * })
     */
    upsert<T extends MedicationUpsertArgs>(args: SelectSubset<T, MedicationUpsertArgs<ExtArgs>>): Prisma__MedicationClient<$Result.GetResult<Prisma.$MedicationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Medications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationCountArgs} args - Arguments to filter Medications to count.
     * @example
     * // Count the number of Medications
     * const count = await prisma.medication.count({
     *   where: {
     *     // ... the filter for the Medications we want to count
     *   }
     * })
    **/
    count<T extends MedicationCountArgs>(
      args?: Subset<T, MedicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MedicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Medication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MedicationAggregateArgs>(args: Subset<T, MedicationAggregateArgs>): Prisma.PrismaPromise<GetMedicationAggregateType<T>>

    /**
     * Group by Medication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationGroupByArgs} args - Group by arguments.
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
      T extends MedicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MedicationGroupByArgs['orderBy'] }
        : { orderBy?: MedicationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MedicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMedicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Medication model
   */
  readonly fields: MedicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Medication.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MedicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    inventory<T extends Medication$inventoryArgs<ExtArgs> = {}>(args?: Subset<T, Medication$inventoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Medication model
   */ 
  interface MedicationFieldRefs {
    readonly id: FieldRef<"Medication", 'String'>
    readonly name: FieldRef<"Medication", 'String'>
    readonly genericName: FieldRef<"Medication", 'String'>
    readonly brandNames: FieldRef<"Medication", 'String[]'>
    readonly strength: FieldRef<"Medication", 'String'>
    readonly dosageForm: FieldRef<"Medication", 'String'>
    readonly manufacturer: FieldRef<"Medication", 'String'>
    readonly ndcCode: FieldRef<"Medication", 'String'>
    readonly description: FieldRef<"Medication", 'String'>
    readonly sideEffects: FieldRef<"Medication", 'String[]'>
    readonly interactions: FieldRef<"Medication", 'String[]'>
    readonly isControlled: FieldRef<"Medication", 'Boolean'>
    readonly schedule: FieldRef<"Medication", 'String'>
    readonly requiresPriorAuth: FieldRef<"Medication", 'Boolean'>
    readonly isActive: FieldRef<"Medication", 'Boolean'>
    readonly createdAt: FieldRef<"Medication", 'DateTime'>
    readonly updatedAt: FieldRef<"Medication", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Medication findUnique
   */
  export type MedicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medication
     */
    select?: MedicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationInclude<ExtArgs> | null
    /**
     * Filter, which Medication to fetch.
     */
    where: MedicationWhereUniqueInput
  }

  /**
   * Medication findUniqueOrThrow
   */
  export type MedicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medication
     */
    select?: MedicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationInclude<ExtArgs> | null
    /**
     * Filter, which Medication to fetch.
     */
    where: MedicationWhereUniqueInput
  }

  /**
   * Medication findFirst
   */
  export type MedicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medication
     */
    select?: MedicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationInclude<ExtArgs> | null
    /**
     * Filter, which Medication to fetch.
     */
    where?: MedicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Medications to fetch.
     */
    orderBy?: MedicationOrderByWithRelationInput | MedicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Medications.
     */
    cursor?: MedicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Medications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Medications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Medications.
     */
    distinct?: MedicationScalarFieldEnum | MedicationScalarFieldEnum[]
  }

  /**
   * Medication findFirstOrThrow
   */
  export type MedicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medication
     */
    select?: MedicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationInclude<ExtArgs> | null
    /**
     * Filter, which Medication to fetch.
     */
    where?: MedicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Medications to fetch.
     */
    orderBy?: MedicationOrderByWithRelationInput | MedicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Medications.
     */
    cursor?: MedicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Medications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Medications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Medications.
     */
    distinct?: MedicationScalarFieldEnum | MedicationScalarFieldEnum[]
  }

  /**
   * Medication findMany
   */
  export type MedicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medication
     */
    select?: MedicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationInclude<ExtArgs> | null
    /**
     * Filter, which Medications to fetch.
     */
    where?: MedicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Medications to fetch.
     */
    orderBy?: MedicationOrderByWithRelationInput | MedicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Medications.
     */
    cursor?: MedicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Medications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Medications.
     */
    skip?: number
    distinct?: MedicationScalarFieldEnum | MedicationScalarFieldEnum[]
  }

  /**
   * Medication create
   */
  export type MedicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medication
     */
    select?: MedicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationInclude<ExtArgs> | null
    /**
     * The data needed to create a Medication.
     */
    data: XOR<MedicationCreateInput, MedicationUncheckedCreateInput>
  }

  /**
   * Medication createMany
   */
  export type MedicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Medications.
     */
    data: MedicationCreateManyInput | MedicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Medication createManyAndReturn
   */
  export type MedicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medication
     */
    select?: MedicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Medications.
     */
    data: MedicationCreateManyInput | MedicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Medication update
   */
  export type MedicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medication
     */
    select?: MedicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationInclude<ExtArgs> | null
    /**
     * The data needed to update a Medication.
     */
    data: XOR<MedicationUpdateInput, MedicationUncheckedUpdateInput>
    /**
     * Choose, which Medication to update.
     */
    where: MedicationWhereUniqueInput
  }

  /**
   * Medication updateMany
   */
  export type MedicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Medications.
     */
    data: XOR<MedicationUpdateManyMutationInput, MedicationUncheckedUpdateManyInput>
    /**
     * Filter which Medications to update
     */
    where?: MedicationWhereInput
  }

  /**
   * Medication upsert
   */
  export type MedicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medication
     */
    select?: MedicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationInclude<ExtArgs> | null
    /**
     * The filter to search for the Medication to update in case it exists.
     */
    where: MedicationWhereUniqueInput
    /**
     * In case the Medication found by the `where` argument doesn't exist, create a new Medication with this data.
     */
    create: XOR<MedicationCreateInput, MedicationUncheckedCreateInput>
    /**
     * In case the Medication was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MedicationUpdateInput, MedicationUncheckedUpdateInput>
  }

  /**
   * Medication delete
   */
  export type MedicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medication
     */
    select?: MedicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationInclude<ExtArgs> | null
    /**
     * Filter which Medication to delete.
     */
    where: MedicationWhereUniqueInput
  }

  /**
   * Medication deleteMany
   */
  export type MedicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Medications to delete
     */
    where?: MedicationWhereInput
  }

  /**
   * Medication.inventory
   */
  export type Medication$inventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    where?: InventoryWhereInput
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    cursor?: InventoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Medication without action
   */
  export type MedicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Medication
     */
    select?: MedicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationInclude<ExtArgs> | null
  }


  /**
   * Model PriorAuthorization
   */

  export type AggregatePriorAuthorization = {
    _count: PriorAuthorizationCountAggregateOutputType | null
    _min: PriorAuthorizationMinAggregateOutputType | null
    _max: PriorAuthorizationMaxAggregateOutputType | null
  }

  export type PriorAuthorizationMinAggregateOutputType = {
    id: string | null
    prescriptionId: string | null
    patientId: string | null
    providerId: string | null
    insurerId: string | null
    medicationName: string | null
    status: $Enums.PriorAuthStatus | null
    requestDate: Date | null
    approvalDate: Date | null
    denialDate: Date | null
    expirationDate: Date | null
    denialReason: string | null
    approvalCode: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PriorAuthorizationMaxAggregateOutputType = {
    id: string | null
    prescriptionId: string | null
    patientId: string | null
    providerId: string | null
    insurerId: string | null
    medicationName: string | null
    status: $Enums.PriorAuthStatus | null
    requestDate: Date | null
    approvalDate: Date | null
    denialDate: Date | null
    expirationDate: Date | null
    denialReason: string | null
    approvalCode: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PriorAuthorizationCountAggregateOutputType = {
    id: number
    prescriptionId: number
    patientId: number
    providerId: number
    insurerId: number
    medicationName: number
    status: number
    requestDate: number
    approvalDate: number
    denialDate: number
    expirationDate: number
    denialReason: number
    approvalCode: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PriorAuthorizationMinAggregateInputType = {
    id?: true
    prescriptionId?: true
    patientId?: true
    providerId?: true
    insurerId?: true
    medicationName?: true
    status?: true
    requestDate?: true
    approvalDate?: true
    denialDate?: true
    expirationDate?: true
    denialReason?: true
    approvalCode?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PriorAuthorizationMaxAggregateInputType = {
    id?: true
    prescriptionId?: true
    patientId?: true
    providerId?: true
    insurerId?: true
    medicationName?: true
    status?: true
    requestDate?: true
    approvalDate?: true
    denialDate?: true
    expirationDate?: true
    denialReason?: true
    approvalCode?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PriorAuthorizationCountAggregateInputType = {
    id?: true
    prescriptionId?: true
    patientId?: true
    providerId?: true
    insurerId?: true
    medicationName?: true
    status?: true
    requestDate?: true
    approvalDate?: true
    denialDate?: true
    expirationDate?: true
    denialReason?: true
    approvalCode?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PriorAuthorizationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriorAuthorization to aggregate.
     */
    where?: PriorAuthorizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorAuthorizations to fetch.
     */
    orderBy?: PriorAuthorizationOrderByWithRelationInput | PriorAuthorizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PriorAuthorizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorAuthorizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorAuthorizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PriorAuthorizations
    **/
    _count?: true | PriorAuthorizationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PriorAuthorizationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PriorAuthorizationMaxAggregateInputType
  }

  export type GetPriorAuthorizationAggregateType<T extends PriorAuthorizationAggregateArgs> = {
        [P in keyof T & keyof AggregatePriorAuthorization]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePriorAuthorization[P]>
      : GetScalarType<T[P], AggregatePriorAuthorization[P]>
  }




  export type PriorAuthorizationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriorAuthorizationWhereInput
    orderBy?: PriorAuthorizationOrderByWithAggregationInput | PriorAuthorizationOrderByWithAggregationInput[]
    by: PriorAuthorizationScalarFieldEnum[] | PriorAuthorizationScalarFieldEnum
    having?: PriorAuthorizationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PriorAuthorizationCountAggregateInputType | true
    _min?: PriorAuthorizationMinAggregateInputType
    _max?: PriorAuthorizationMaxAggregateInputType
  }

  export type PriorAuthorizationGroupByOutputType = {
    id: string
    prescriptionId: string
    patientId: string
    providerId: string
    insurerId: string | null
    medicationName: string
    status: $Enums.PriorAuthStatus
    requestDate: Date
    approvalDate: Date | null
    denialDate: Date | null
    expirationDate: Date | null
    denialReason: string | null
    approvalCode: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: PriorAuthorizationCountAggregateOutputType | null
    _min: PriorAuthorizationMinAggregateOutputType | null
    _max: PriorAuthorizationMaxAggregateOutputType | null
  }

  type GetPriorAuthorizationGroupByPayload<T extends PriorAuthorizationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PriorAuthorizationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PriorAuthorizationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PriorAuthorizationGroupByOutputType[P]>
            : GetScalarType<T[P], PriorAuthorizationGroupByOutputType[P]>
        }
      >
    >


  export type PriorAuthorizationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prescriptionId?: boolean
    patientId?: boolean
    providerId?: boolean
    insurerId?: boolean
    medicationName?: boolean
    status?: boolean
    requestDate?: boolean
    approvalDate?: boolean
    denialDate?: boolean
    expirationDate?: boolean
    denialReason?: boolean
    approvalCode?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dispensings?: boolean | PriorAuthorization$dispensingsArgs<ExtArgs>
    _count?: boolean | PriorAuthorizationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["priorAuthorization"]>

  export type PriorAuthorizationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prescriptionId?: boolean
    patientId?: boolean
    providerId?: boolean
    insurerId?: boolean
    medicationName?: boolean
    status?: boolean
    requestDate?: boolean
    approvalDate?: boolean
    denialDate?: boolean
    expirationDate?: boolean
    denialReason?: boolean
    approvalCode?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["priorAuthorization"]>

  export type PriorAuthorizationSelectScalar = {
    id?: boolean
    prescriptionId?: boolean
    patientId?: boolean
    providerId?: boolean
    insurerId?: boolean
    medicationName?: boolean
    status?: boolean
    requestDate?: boolean
    approvalDate?: boolean
    denialDate?: boolean
    expirationDate?: boolean
    denialReason?: boolean
    approvalCode?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PriorAuthorizationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dispensings?: boolean | PriorAuthorization$dispensingsArgs<ExtArgs>
    _count?: boolean | PriorAuthorizationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PriorAuthorizationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PriorAuthorizationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PriorAuthorization"
    objects: {
      dispensings: Prisma.$DispensingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      prescriptionId: string
      patientId: string
      providerId: string
      insurerId: string | null
      medicationName: string
      status: $Enums.PriorAuthStatus
      requestDate: Date
      approvalDate: Date | null
      denialDate: Date | null
      expirationDate: Date | null
      denialReason: string | null
      approvalCode: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["priorAuthorization"]>
    composites: {}
  }

  type PriorAuthorizationGetPayload<S extends boolean | null | undefined | PriorAuthorizationDefaultArgs> = $Result.GetResult<Prisma.$PriorAuthorizationPayload, S>

  type PriorAuthorizationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PriorAuthorizationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PriorAuthorizationCountAggregateInputType | true
    }

  export interface PriorAuthorizationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PriorAuthorization'], meta: { name: 'PriorAuthorization' } }
    /**
     * Find zero or one PriorAuthorization that matches the filter.
     * @param {PriorAuthorizationFindUniqueArgs} args - Arguments to find a PriorAuthorization
     * @example
     * // Get one PriorAuthorization
     * const priorAuthorization = await prisma.priorAuthorization.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PriorAuthorizationFindUniqueArgs>(args: SelectSubset<T, PriorAuthorizationFindUniqueArgs<ExtArgs>>): Prisma__PriorAuthorizationClient<$Result.GetResult<Prisma.$PriorAuthorizationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PriorAuthorization that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PriorAuthorizationFindUniqueOrThrowArgs} args - Arguments to find a PriorAuthorization
     * @example
     * // Get one PriorAuthorization
     * const priorAuthorization = await prisma.priorAuthorization.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PriorAuthorizationFindUniqueOrThrowArgs>(args: SelectSubset<T, PriorAuthorizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PriorAuthorizationClient<$Result.GetResult<Prisma.$PriorAuthorizationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PriorAuthorization that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorAuthorizationFindFirstArgs} args - Arguments to find a PriorAuthorization
     * @example
     * // Get one PriorAuthorization
     * const priorAuthorization = await prisma.priorAuthorization.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PriorAuthorizationFindFirstArgs>(args?: SelectSubset<T, PriorAuthorizationFindFirstArgs<ExtArgs>>): Prisma__PriorAuthorizationClient<$Result.GetResult<Prisma.$PriorAuthorizationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PriorAuthorization that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorAuthorizationFindFirstOrThrowArgs} args - Arguments to find a PriorAuthorization
     * @example
     * // Get one PriorAuthorization
     * const priorAuthorization = await prisma.priorAuthorization.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PriorAuthorizationFindFirstOrThrowArgs>(args?: SelectSubset<T, PriorAuthorizationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PriorAuthorizationClient<$Result.GetResult<Prisma.$PriorAuthorizationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PriorAuthorizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorAuthorizationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PriorAuthorizations
     * const priorAuthorizations = await prisma.priorAuthorization.findMany()
     * 
     * // Get first 10 PriorAuthorizations
     * const priorAuthorizations = await prisma.priorAuthorization.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const priorAuthorizationWithIdOnly = await prisma.priorAuthorization.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PriorAuthorizationFindManyArgs>(args?: SelectSubset<T, PriorAuthorizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriorAuthorizationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PriorAuthorization.
     * @param {PriorAuthorizationCreateArgs} args - Arguments to create a PriorAuthorization.
     * @example
     * // Create one PriorAuthorization
     * const PriorAuthorization = await prisma.priorAuthorization.create({
     *   data: {
     *     // ... data to create a PriorAuthorization
     *   }
     * })
     * 
     */
    create<T extends PriorAuthorizationCreateArgs>(args: SelectSubset<T, PriorAuthorizationCreateArgs<ExtArgs>>): Prisma__PriorAuthorizationClient<$Result.GetResult<Prisma.$PriorAuthorizationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PriorAuthorizations.
     * @param {PriorAuthorizationCreateManyArgs} args - Arguments to create many PriorAuthorizations.
     * @example
     * // Create many PriorAuthorizations
     * const priorAuthorization = await prisma.priorAuthorization.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PriorAuthorizationCreateManyArgs>(args?: SelectSubset<T, PriorAuthorizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PriorAuthorizations and returns the data saved in the database.
     * @param {PriorAuthorizationCreateManyAndReturnArgs} args - Arguments to create many PriorAuthorizations.
     * @example
     * // Create many PriorAuthorizations
     * const priorAuthorization = await prisma.priorAuthorization.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PriorAuthorizations and only return the `id`
     * const priorAuthorizationWithIdOnly = await prisma.priorAuthorization.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PriorAuthorizationCreateManyAndReturnArgs>(args?: SelectSubset<T, PriorAuthorizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriorAuthorizationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PriorAuthorization.
     * @param {PriorAuthorizationDeleteArgs} args - Arguments to delete one PriorAuthorization.
     * @example
     * // Delete one PriorAuthorization
     * const PriorAuthorization = await prisma.priorAuthorization.delete({
     *   where: {
     *     // ... filter to delete one PriorAuthorization
     *   }
     * })
     * 
     */
    delete<T extends PriorAuthorizationDeleteArgs>(args: SelectSubset<T, PriorAuthorizationDeleteArgs<ExtArgs>>): Prisma__PriorAuthorizationClient<$Result.GetResult<Prisma.$PriorAuthorizationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PriorAuthorization.
     * @param {PriorAuthorizationUpdateArgs} args - Arguments to update one PriorAuthorization.
     * @example
     * // Update one PriorAuthorization
     * const priorAuthorization = await prisma.priorAuthorization.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PriorAuthorizationUpdateArgs>(args: SelectSubset<T, PriorAuthorizationUpdateArgs<ExtArgs>>): Prisma__PriorAuthorizationClient<$Result.GetResult<Prisma.$PriorAuthorizationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PriorAuthorizations.
     * @param {PriorAuthorizationDeleteManyArgs} args - Arguments to filter PriorAuthorizations to delete.
     * @example
     * // Delete a few PriorAuthorizations
     * const { count } = await prisma.priorAuthorization.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PriorAuthorizationDeleteManyArgs>(args?: SelectSubset<T, PriorAuthorizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriorAuthorizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorAuthorizationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PriorAuthorizations
     * const priorAuthorization = await prisma.priorAuthorization.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PriorAuthorizationUpdateManyArgs>(args: SelectSubset<T, PriorAuthorizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PriorAuthorization.
     * @param {PriorAuthorizationUpsertArgs} args - Arguments to update or create a PriorAuthorization.
     * @example
     * // Update or create a PriorAuthorization
     * const priorAuthorization = await prisma.priorAuthorization.upsert({
     *   create: {
     *     // ... data to create a PriorAuthorization
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PriorAuthorization we want to update
     *   }
     * })
     */
    upsert<T extends PriorAuthorizationUpsertArgs>(args: SelectSubset<T, PriorAuthorizationUpsertArgs<ExtArgs>>): Prisma__PriorAuthorizationClient<$Result.GetResult<Prisma.$PriorAuthorizationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PriorAuthorizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorAuthorizationCountArgs} args - Arguments to filter PriorAuthorizations to count.
     * @example
     * // Count the number of PriorAuthorizations
     * const count = await prisma.priorAuthorization.count({
     *   where: {
     *     // ... the filter for the PriorAuthorizations we want to count
     *   }
     * })
    **/
    count<T extends PriorAuthorizationCountArgs>(
      args?: Subset<T, PriorAuthorizationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PriorAuthorizationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PriorAuthorization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorAuthorizationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PriorAuthorizationAggregateArgs>(args: Subset<T, PriorAuthorizationAggregateArgs>): Prisma.PrismaPromise<GetPriorAuthorizationAggregateType<T>>

    /**
     * Group by PriorAuthorization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriorAuthorizationGroupByArgs} args - Group by arguments.
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
      T extends PriorAuthorizationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PriorAuthorizationGroupByArgs['orderBy'] }
        : { orderBy?: PriorAuthorizationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PriorAuthorizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPriorAuthorizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PriorAuthorization model
   */
  readonly fields: PriorAuthorizationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PriorAuthorization.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PriorAuthorizationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dispensings<T extends PriorAuthorization$dispensingsArgs<ExtArgs> = {}>(args?: Subset<T, PriorAuthorization$dispensingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the PriorAuthorization model
   */ 
  interface PriorAuthorizationFieldRefs {
    readonly id: FieldRef<"PriorAuthorization", 'String'>
    readonly prescriptionId: FieldRef<"PriorAuthorization", 'String'>
    readonly patientId: FieldRef<"PriorAuthorization", 'String'>
    readonly providerId: FieldRef<"PriorAuthorization", 'String'>
    readonly insurerId: FieldRef<"PriorAuthorization", 'String'>
    readonly medicationName: FieldRef<"PriorAuthorization", 'String'>
    readonly status: FieldRef<"PriorAuthorization", 'PriorAuthStatus'>
    readonly requestDate: FieldRef<"PriorAuthorization", 'DateTime'>
    readonly approvalDate: FieldRef<"PriorAuthorization", 'DateTime'>
    readonly denialDate: FieldRef<"PriorAuthorization", 'DateTime'>
    readonly expirationDate: FieldRef<"PriorAuthorization", 'DateTime'>
    readonly denialReason: FieldRef<"PriorAuthorization", 'String'>
    readonly approvalCode: FieldRef<"PriorAuthorization", 'String'>
    readonly notes: FieldRef<"PriorAuthorization", 'String'>
    readonly createdAt: FieldRef<"PriorAuthorization", 'DateTime'>
    readonly updatedAt: FieldRef<"PriorAuthorization", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PriorAuthorization findUnique
   */
  export type PriorAuthorizationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorAuthorizationInclude<ExtArgs> | null
    /**
     * Filter, which PriorAuthorization to fetch.
     */
    where: PriorAuthorizationWhereUniqueInput
  }

  /**
   * PriorAuthorization findUniqueOrThrow
   */
  export type PriorAuthorizationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorAuthorizationInclude<ExtArgs> | null
    /**
     * Filter, which PriorAuthorization to fetch.
     */
    where: PriorAuthorizationWhereUniqueInput
  }

  /**
   * PriorAuthorization findFirst
   */
  export type PriorAuthorizationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorAuthorizationInclude<ExtArgs> | null
    /**
     * Filter, which PriorAuthorization to fetch.
     */
    where?: PriorAuthorizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorAuthorizations to fetch.
     */
    orderBy?: PriorAuthorizationOrderByWithRelationInput | PriorAuthorizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriorAuthorizations.
     */
    cursor?: PriorAuthorizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorAuthorizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorAuthorizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriorAuthorizations.
     */
    distinct?: PriorAuthorizationScalarFieldEnum | PriorAuthorizationScalarFieldEnum[]
  }

  /**
   * PriorAuthorization findFirstOrThrow
   */
  export type PriorAuthorizationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorAuthorizationInclude<ExtArgs> | null
    /**
     * Filter, which PriorAuthorization to fetch.
     */
    where?: PriorAuthorizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorAuthorizations to fetch.
     */
    orderBy?: PriorAuthorizationOrderByWithRelationInput | PriorAuthorizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriorAuthorizations.
     */
    cursor?: PriorAuthorizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorAuthorizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorAuthorizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriorAuthorizations.
     */
    distinct?: PriorAuthorizationScalarFieldEnum | PriorAuthorizationScalarFieldEnum[]
  }

  /**
   * PriorAuthorization findMany
   */
  export type PriorAuthorizationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorAuthorizationInclude<ExtArgs> | null
    /**
     * Filter, which PriorAuthorizations to fetch.
     */
    where?: PriorAuthorizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriorAuthorizations to fetch.
     */
    orderBy?: PriorAuthorizationOrderByWithRelationInput | PriorAuthorizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PriorAuthorizations.
     */
    cursor?: PriorAuthorizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriorAuthorizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriorAuthorizations.
     */
    skip?: number
    distinct?: PriorAuthorizationScalarFieldEnum | PriorAuthorizationScalarFieldEnum[]
  }

  /**
   * PriorAuthorization create
   */
  export type PriorAuthorizationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorAuthorizationInclude<ExtArgs> | null
    /**
     * The data needed to create a PriorAuthorization.
     */
    data: XOR<PriorAuthorizationCreateInput, PriorAuthorizationUncheckedCreateInput>
  }

  /**
   * PriorAuthorization createMany
   */
  export type PriorAuthorizationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PriorAuthorizations.
     */
    data: PriorAuthorizationCreateManyInput | PriorAuthorizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PriorAuthorization createManyAndReturn
   */
  export type PriorAuthorizationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PriorAuthorizations.
     */
    data: PriorAuthorizationCreateManyInput | PriorAuthorizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PriorAuthorization update
   */
  export type PriorAuthorizationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorAuthorizationInclude<ExtArgs> | null
    /**
     * The data needed to update a PriorAuthorization.
     */
    data: XOR<PriorAuthorizationUpdateInput, PriorAuthorizationUncheckedUpdateInput>
    /**
     * Choose, which PriorAuthorization to update.
     */
    where: PriorAuthorizationWhereUniqueInput
  }

  /**
   * PriorAuthorization updateMany
   */
  export type PriorAuthorizationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PriorAuthorizations.
     */
    data: XOR<PriorAuthorizationUpdateManyMutationInput, PriorAuthorizationUncheckedUpdateManyInput>
    /**
     * Filter which PriorAuthorizations to update
     */
    where?: PriorAuthorizationWhereInput
  }

  /**
   * PriorAuthorization upsert
   */
  export type PriorAuthorizationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorAuthorizationInclude<ExtArgs> | null
    /**
     * The filter to search for the PriorAuthorization to update in case it exists.
     */
    where: PriorAuthorizationWhereUniqueInput
    /**
     * In case the PriorAuthorization found by the `where` argument doesn't exist, create a new PriorAuthorization with this data.
     */
    create: XOR<PriorAuthorizationCreateInput, PriorAuthorizationUncheckedCreateInput>
    /**
     * In case the PriorAuthorization was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PriorAuthorizationUpdateInput, PriorAuthorizationUncheckedUpdateInput>
  }

  /**
   * PriorAuthorization delete
   */
  export type PriorAuthorizationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorAuthorizationInclude<ExtArgs> | null
    /**
     * Filter which PriorAuthorization to delete.
     */
    where: PriorAuthorizationWhereUniqueInput
  }

  /**
   * PriorAuthorization deleteMany
   */
  export type PriorAuthorizationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriorAuthorizations to delete
     */
    where?: PriorAuthorizationWhereInput
  }

  /**
   * PriorAuthorization.dispensings
   */
  export type PriorAuthorization$dispensingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingInclude<ExtArgs> | null
    where?: DispensingWhereInput
    orderBy?: DispensingOrderByWithRelationInput | DispensingOrderByWithRelationInput[]
    cursor?: DispensingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DispensingScalarFieldEnum | DispensingScalarFieldEnum[]
  }

  /**
   * PriorAuthorization without action
   */
  export type PriorAuthorizationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorAuthorizationInclude<ExtArgs> | null
  }


  /**
   * Model Dispensing
   */

  export type AggregateDispensing = {
    _count: DispensingCountAggregateOutputType | null
    _avg: DispensingAvgAggregateOutputType | null
    _sum: DispensingSumAggregateOutputType | null
    _min: DispensingMinAggregateOutputType | null
    _max: DispensingMaxAggregateOutputType | null
  }

  export type DispensingAvgAggregateOutputType = {
    quantity: number | null
  }

  export type DispensingSumAggregateOutputType = {
    quantity: number | null
  }

  export type DispensingMinAggregateOutputType = {
    id: string | null
    prescriptionId: string | null
    patientId: string | null
    pharmacyId: string | null
    priorAuthorizationId: string | null
    medicationName: string | null
    quantity: number | null
    dispensedAt: Date | null
    pharmacist: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type DispensingMaxAggregateOutputType = {
    id: string | null
    prescriptionId: string | null
    patientId: string | null
    pharmacyId: string | null
    priorAuthorizationId: string | null
    medicationName: string | null
    quantity: number | null
    dispensedAt: Date | null
    pharmacist: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type DispensingCountAggregateOutputType = {
    id: number
    prescriptionId: number
    patientId: number
    pharmacyId: number
    priorAuthorizationId: number
    medicationName: number
    quantity: number
    dispensedAt: number
    pharmacist: number
    notes: number
    createdAt: number
    _all: number
  }


  export type DispensingAvgAggregateInputType = {
    quantity?: true
  }

  export type DispensingSumAggregateInputType = {
    quantity?: true
  }

  export type DispensingMinAggregateInputType = {
    id?: true
    prescriptionId?: true
    patientId?: true
    pharmacyId?: true
    priorAuthorizationId?: true
    medicationName?: true
    quantity?: true
    dispensedAt?: true
    pharmacist?: true
    notes?: true
    createdAt?: true
  }

  export type DispensingMaxAggregateInputType = {
    id?: true
    prescriptionId?: true
    patientId?: true
    pharmacyId?: true
    priorAuthorizationId?: true
    medicationName?: true
    quantity?: true
    dispensedAt?: true
    pharmacist?: true
    notes?: true
    createdAt?: true
  }

  export type DispensingCountAggregateInputType = {
    id?: true
    prescriptionId?: true
    patientId?: true
    pharmacyId?: true
    priorAuthorizationId?: true
    medicationName?: true
    quantity?: true
    dispensedAt?: true
    pharmacist?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type DispensingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dispensing to aggregate.
     */
    where?: DispensingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dispensings to fetch.
     */
    orderBy?: DispensingOrderByWithRelationInput | DispensingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DispensingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dispensings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dispensings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Dispensings
    **/
    _count?: true | DispensingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DispensingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DispensingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DispensingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DispensingMaxAggregateInputType
  }

  export type GetDispensingAggregateType<T extends DispensingAggregateArgs> = {
        [P in keyof T & keyof AggregateDispensing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDispensing[P]>
      : GetScalarType<T[P], AggregateDispensing[P]>
  }




  export type DispensingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DispensingWhereInput
    orderBy?: DispensingOrderByWithAggregationInput | DispensingOrderByWithAggregationInput[]
    by: DispensingScalarFieldEnum[] | DispensingScalarFieldEnum
    having?: DispensingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DispensingCountAggregateInputType | true
    _avg?: DispensingAvgAggregateInputType
    _sum?: DispensingSumAggregateInputType
    _min?: DispensingMinAggregateInputType
    _max?: DispensingMaxAggregateInputType
  }

  export type DispensingGroupByOutputType = {
    id: string
    prescriptionId: string
    patientId: string
    pharmacyId: string
    priorAuthorizationId: string | null
    medicationName: string
    quantity: number
    dispensedAt: Date
    pharmacist: string | null
    notes: string | null
    createdAt: Date
    _count: DispensingCountAggregateOutputType | null
    _avg: DispensingAvgAggregateOutputType | null
    _sum: DispensingSumAggregateOutputType | null
    _min: DispensingMinAggregateOutputType | null
    _max: DispensingMaxAggregateOutputType | null
  }

  type GetDispensingGroupByPayload<T extends DispensingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DispensingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DispensingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DispensingGroupByOutputType[P]>
            : GetScalarType<T[P], DispensingGroupByOutputType[P]>
        }
      >
    >


  export type DispensingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prescriptionId?: boolean
    patientId?: boolean
    pharmacyId?: boolean
    priorAuthorizationId?: boolean
    medicationName?: boolean
    quantity?: boolean
    dispensedAt?: boolean
    pharmacist?: boolean
    notes?: boolean
    createdAt?: boolean
    priorAuthorization?: boolean | Dispensing$priorAuthorizationArgs<ExtArgs>
  }, ExtArgs["result"]["dispensing"]>

  export type DispensingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prescriptionId?: boolean
    patientId?: boolean
    pharmacyId?: boolean
    priorAuthorizationId?: boolean
    medicationName?: boolean
    quantity?: boolean
    dispensedAt?: boolean
    pharmacist?: boolean
    notes?: boolean
    createdAt?: boolean
    priorAuthorization?: boolean | Dispensing$priorAuthorizationArgs<ExtArgs>
  }, ExtArgs["result"]["dispensing"]>

  export type DispensingSelectScalar = {
    id?: boolean
    prescriptionId?: boolean
    patientId?: boolean
    pharmacyId?: boolean
    priorAuthorizationId?: boolean
    medicationName?: boolean
    quantity?: boolean
    dispensedAt?: boolean
    pharmacist?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type DispensingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    priorAuthorization?: boolean | Dispensing$priorAuthorizationArgs<ExtArgs>
  }
  export type DispensingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    priorAuthorization?: boolean | Dispensing$priorAuthorizationArgs<ExtArgs>
  }

  export type $DispensingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Dispensing"
    objects: {
      priorAuthorization: Prisma.$PriorAuthorizationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      prescriptionId: string
      patientId: string
      pharmacyId: string
      priorAuthorizationId: string | null
      medicationName: string
      quantity: number
      dispensedAt: Date
      pharmacist: string | null
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["dispensing"]>
    composites: {}
  }

  type DispensingGetPayload<S extends boolean | null | undefined | DispensingDefaultArgs> = $Result.GetResult<Prisma.$DispensingPayload, S>

  type DispensingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DispensingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DispensingCountAggregateInputType | true
    }

  export interface DispensingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Dispensing'], meta: { name: 'Dispensing' } }
    /**
     * Find zero or one Dispensing that matches the filter.
     * @param {DispensingFindUniqueArgs} args - Arguments to find a Dispensing
     * @example
     * // Get one Dispensing
     * const dispensing = await prisma.dispensing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DispensingFindUniqueArgs>(args: SelectSubset<T, DispensingFindUniqueArgs<ExtArgs>>): Prisma__DispensingClient<$Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Dispensing that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DispensingFindUniqueOrThrowArgs} args - Arguments to find a Dispensing
     * @example
     * // Get one Dispensing
     * const dispensing = await prisma.dispensing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DispensingFindUniqueOrThrowArgs>(args: SelectSubset<T, DispensingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DispensingClient<$Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Dispensing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispensingFindFirstArgs} args - Arguments to find a Dispensing
     * @example
     * // Get one Dispensing
     * const dispensing = await prisma.dispensing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DispensingFindFirstArgs>(args?: SelectSubset<T, DispensingFindFirstArgs<ExtArgs>>): Prisma__DispensingClient<$Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Dispensing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispensingFindFirstOrThrowArgs} args - Arguments to find a Dispensing
     * @example
     * // Get one Dispensing
     * const dispensing = await prisma.dispensing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DispensingFindFirstOrThrowArgs>(args?: SelectSubset<T, DispensingFindFirstOrThrowArgs<ExtArgs>>): Prisma__DispensingClient<$Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Dispensings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispensingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dispensings
     * const dispensings = await prisma.dispensing.findMany()
     * 
     * // Get first 10 Dispensings
     * const dispensings = await prisma.dispensing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dispensingWithIdOnly = await prisma.dispensing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DispensingFindManyArgs>(args?: SelectSubset<T, DispensingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Dispensing.
     * @param {DispensingCreateArgs} args - Arguments to create a Dispensing.
     * @example
     * // Create one Dispensing
     * const Dispensing = await prisma.dispensing.create({
     *   data: {
     *     // ... data to create a Dispensing
     *   }
     * })
     * 
     */
    create<T extends DispensingCreateArgs>(args: SelectSubset<T, DispensingCreateArgs<ExtArgs>>): Prisma__DispensingClient<$Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Dispensings.
     * @param {DispensingCreateManyArgs} args - Arguments to create many Dispensings.
     * @example
     * // Create many Dispensings
     * const dispensing = await prisma.dispensing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DispensingCreateManyArgs>(args?: SelectSubset<T, DispensingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Dispensings and returns the data saved in the database.
     * @param {DispensingCreateManyAndReturnArgs} args - Arguments to create many Dispensings.
     * @example
     * // Create many Dispensings
     * const dispensing = await prisma.dispensing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Dispensings and only return the `id`
     * const dispensingWithIdOnly = await prisma.dispensing.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DispensingCreateManyAndReturnArgs>(args?: SelectSubset<T, DispensingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Dispensing.
     * @param {DispensingDeleteArgs} args - Arguments to delete one Dispensing.
     * @example
     * // Delete one Dispensing
     * const Dispensing = await prisma.dispensing.delete({
     *   where: {
     *     // ... filter to delete one Dispensing
     *   }
     * })
     * 
     */
    delete<T extends DispensingDeleteArgs>(args: SelectSubset<T, DispensingDeleteArgs<ExtArgs>>): Prisma__DispensingClient<$Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Dispensing.
     * @param {DispensingUpdateArgs} args - Arguments to update one Dispensing.
     * @example
     * // Update one Dispensing
     * const dispensing = await prisma.dispensing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DispensingUpdateArgs>(args: SelectSubset<T, DispensingUpdateArgs<ExtArgs>>): Prisma__DispensingClient<$Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Dispensings.
     * @param {DispensingDeleteManyArgs} args - Arguments to filter Dispensings to delete.
     * @example
     * // Delete a few Dispensings
     * const { count } = await prisma.dispensing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DispensingDeleteManyArgs>(args?: SelectSubset<T, DispensingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dispensings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispensingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dispensings
     * const dispensing = await prisma.dispensing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DispensingUpdateManyArgs>(args: SelectSubset<T, DispensingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Dispensing.
     * @param {DispensingUpsertArgs} args - Arguments to update or create a Dispensing.
     * @example
     * // Update or create a Dispensing
     * const dispensing = await prisma.dispensing.upsert({
     *   create: {
     *     // ... data to create a Dispensing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dispensing we want to update
     *   }
     * })
     */
    upsert<T extends DispensingUpsertArgs>(args: SelectSubset<T, DispensingUpsertArgs<ExtArgs>>): Prisma__DispensingClient<$Result.GetResult<Prisma.$DispensingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Dispensings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispensingCountArgs} args - Arguments to filter Dispensings to count.
     * @example
     * // Count the number of Dispensings
     * const count = await prisma.dispensing.count({
     *   where: {
     *     // ... the filter for the Dispensings we want to count
     *   }
     * })
    **/
    count<T extends DispensingCountArgs>(
      args?: Subset<T, DispensingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DispensingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dispensing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispensingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DispensingAggregateArgs>(args: Subset<T, DispensingAggregateArgs>): Prisma.PrismaPromise<GetDispensingAggregateType<T>>

    /**
     * Group by Dispensing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DispensingGroupByArgs} args - Group by arguments.
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
      T extends DispensingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DispensingGroupByArgs['orderBy'] }
        : { orderBy?: DispensingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DispensingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDispensingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Dispensing model
   */
  readonly fields: DispensingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Dispensing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DispensingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    priorAuthorization<T extends Dispensing$priorAuthorizationArgs<ExtArgs> = {}>(args?: Subset<T, Dispensing$priorAuthorizationArgs<ExtArgs>>): Prisma__PriorAuthorizationClient<$Result.GetResult<Prisma.$PriorAuthorizationPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the Dispensing model
   */ 
  interface DispensingFieldRefs {
    readonly id: FieldRef<"Dispensing", 'String'>
    readonly prescriptionId: FieldRef<"Dispensing", 'String'>
    readonly patientId: FieldRef<"Dispensing", 'String'>
    readonly pharmacyId: FieldRef<"Dispensing", 'String'>
    readonly priorAuthorizationId: FieldRef<"Dispensing", 'String'>
    readonly medicationName: FieldRef<"Dispensing", 'String'>
    readonly quantity: FieldRef<"Dispensing", 'Int'>
    readonly dispensedAt: FieldRef<"Dispensing", 'DateTime'>
    readonly pharmacist: FieldRef<"Dispensing", 'String'>
    readonly notes: FieldRef<"Dispensing", 'String'>
    readonly createdAt: FieldRef<"Dispensing", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Dispensing findUnique
   */
  export type DispensingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingInclude<ExtArgs> | null
    /**
     * Filter, which Dispensing to fetch.
     */
    where: DispensingWhereUniqueInput
  }

  /**
   * Dispensing findUniqueOrThrow
   */
  export type DispensingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingInclude<ExtArgs> | null
    /**
     * Filter, which Dispensing to fetch.
     */
    where: DispensingWhereUniqueInput
  }

  /**
   * Dispensing findFirst
   */
  export type DispensingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingInclude<ExtArgs> | null
    /**
     * Filter, which Dispensing to fetch.
     */
    where?: DispensingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dispensings to fetch.
     */
    orderBy?: DispensingOrderByWithRelationInput | DispensingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dispensings.
     */
    cursor?: DispensingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dispensings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dispensings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dispensings.
     */
    distinct?: DispensingScalarFieldEnum | DispensingScalarFieldEnum[]
  }

  /**
   * Dispensing findFirstOrThrow
   */
  export type DispensingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingInclude<ExtArgs> | null
    /**
     * Filter, which Dispensing to fetch.
     */
    where?: DispensingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dispensings to fetch.
     */
    orderBy?: DispensingOrderByWithRelationInput | DispensingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dispensings.
     */
    cursor?: DispensingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dispensings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dispensings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dispensings.
     */
    distinct?: DispensingScalarFieldEnum | DispensingScalarFieldEnum[]
  }

  /**
   * Dispensing findMany
   */
  export type DispensingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingInclude<ExtArgs> | null
    /**
     * Filter, which Dispensings to fetch.
     */
    where?: DispensingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dispensings to fetch.
     */
    orderBy?: DispensingOrderByWithRelationInput | DispensingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Dispensings.
     */
    cursor?: DispensingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dispensings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dispensings.
     */
    skip?: number
    distinct?: DispensingScalarFieldEnum | DispensingScalarFieldEnum[]
  }

  /**
   * Dispensing create
   */
  export type DispensingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingInclude<ExtArgs> | null
    /**
     * The data needed to create a Dispensing.
     */
    data: XOR<DispensingCreateInput, DispensingUncheckedCreateInput>
  }

  /**
   * Dispensing createMany
   */
  export type DispensingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Dispensings.
     */
    data: DispensingCreateManyInput | DispensingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Dispensing createManyAndReturn
   */
  export type DispensingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Dispensings.
     */
    data: DispensingCreateManyInput | DispensingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Dispensing update
   */
  export type DispensingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingInclude<ExtArgs> | null
    /**
     * The data needed to update a Dispensing.
     */
    data: XOR<DispensingUpdateInput, DispensingUncheckedUpdateInput>
    /**
     * Choose, which Dispensing to update.
     */
    where: DispensingWhereUniqueInput
  }

  /**
   * Dispensing updateMany
   */
  export type DispensingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Dispensings.
     */
    data: XOR<DispensingUpdateManyMutationInput, DispensingUncheckedUpdateManyInput>
    /**
     * Filter which Dispensings to update
     */
    where?: DispensingWhereInput
  }

  /**
   * Dispensing upsert
   */
  export type DispensingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingInclude<ExtArgs> | null
    /**
     * The filter to search for the Dispensing to update in case it exists.
     */
    where: DispensingWhereUniqueInput
    /**
     * In case the Dispensing found by the `where` argument doesn't exist, create a new Dispensing with this data.
     */
    create: XOR<DispensingCreateInput, DispensingUncheckedCreateInput>
    /**
     * In case the Dispensing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DispensingUpdateInput, DispensingUncheckedUpdateInput>
  }

  /**
   * Dispensing delete
   */
  export type DispensingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingInclude<ExtArgs> | null
    /**
     * Filter which Dispensing to delete.
     */
    where: DispensingWhereUniqueInput
  }

  /**
   * Dispensing deleteMany
   */
  export type DispensingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dispensings to delete
     */
    where?: DispensingWhereInput
  }

  /**
   * Dispensing.priorAuthorization
   */
  export type Dispensing$priorAuthorizationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriorAuthorization
     */
    select?: PriorAuthorizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriorAuthorizationInclude<ExtArgs> | null
    where?: PriorAuthorizationWhereInput
  }

  /**
   * Dispensing without action
   */
  export type DispensingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dispensing
     */
    select?: DispensingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DispensingInclude<ExtArgs> | null
  }


  /**
   * Model ControlledSubstanceLog
   */

  export type AggregateControlledSubstanceLog = {
    _count: ControlledSubstanceLogCountAggregateOutputType | null
    _avg: ControlledSubstanceLogAvgAggregateOutputType | null
    _sum: ControlledSubstanceLogSumAggregateOutputType | null
    _min: ControlledSubstanceLogMinAggregateOutputType | null
    _max: ControlledSubstanceLogMaxAggregateOutputType | null
  }

  export type ControlledSubstanceLogAvgAggregateOutputType = {
    quantity: number | null
    daysSupply: number | null
  }

  export type ControlledSubstanceLogSumAggregateOutputType = {
    quantity: number | null
    daysSupply: number | null
  }

  export type ControlledSubstanceLogMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    prescriberId: string | null
    pharmacyId: string | null
    medicationName: string | null
    schedule: string | null
    quantity: number | null
    daysSupply: number | null
    dispensedAt: Date | null
    reportedToPDMP: boolean | null
    pdmpReportDate: Date | null
    createdAt: Date | null
  }

  export type ControlledSubstanceLogMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    prescriberId: string | null
    pharmacyId: string | null
    medicationName: string | null
    schedule: string | null
    quantity: number | null
    daysSupply: number | null
    dispensedAt: Date | null
    reportedToPDMP: boolean | null
    pdmpReportDate: Date | null
    createdAt: Date | null
  }

  export type ControlledSubstanceLogCountAggregateOutputType = {
    id: number
    patientId: number
    prescriberId: number
    pharmacyId: number
    medicationName: number
    schedule: number
    quantity: number
    daysSupply: number
    dispensedAt: number
    reportedToPDMP: number
    pdmpReportDate: number
    createdAt: number
    _all: number
  }


  export type ControlledSubstanceLogAvgAggregateInputType = {
    quantity?: true
    daysSupply?: true
  }

  export type ControlledSubstanceLogSumAggregateInputType = {
    quantity?: true
    daysSupply?: true
  }

  export type ControlledSubstanceLogMinAggregateInputType = {
    id?: true
    patientId?: true
    prescriberId?: true
    pharmacyId?: true
    medicationName?: true
    schedule?: true
    quantity?: true
    daysSupply?: true
    dispensedAt?: true
    reportedToPDMP?: true
    pdmpReportDate?: true
    createdAt?: true
  }

  export type ControlledSubstanceLogMaxAggregateInputType = {
    id?: true
    patientId?: true
    prescriberId?: true
    pharmacyId?: true
    medicationName?: true
    schedule?: true
    quantity?: true
    daysSupply?: true
    dispensedAt?: true
    reportedToPDMP?: true
    pdmpReportDate?: true
    createdAt?: true
  }

  export type ControlledSubstanceLogCountAggregateInputType = {
    id?: true
    patientId?: true
    prescriberId?: true
    pharmacyId?: true
    medicationName?: true
    schedule?: true
    quantity?: true
    daysSupply?: true
    dispensedAt?: true
    reportedToPDMP?: true
    pdmpReportDate?: true
    createdAt?: true
    _all?: true
  }

  export type ControlledSubstanceLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ControlledSubstanceLog to aggregate.
     */
    where?: ControlledSubstanceLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ControlledSubstanceLogs to fetch.
     */
    orderBy?: ControlledSubstanceLogOrderByWithRelationInput | ControlledSubstanceLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ControlledSubstanceLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ControlledSubstanceLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ControlledSubstanceLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ControlledSubstanceLogs
    **/
    _count?: true | ControlledSubstanceLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ControlledSubstanceLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ControlledSubstanceLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ControlledSubstanceLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ControlledSubstanceLogMaxAggregateInputType
  }

  export type GetControlledSubstanceLogAggregateType<T extends ControlledSubstanceLogAggregateArgs> = {
        [P in keyof T & keyof AggregateControlledSubstanceLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateControlledSubstanceLog[P]>
      : GetScalarType<T[P], AggregateControlledSubstanceLog[P]>
  }




  export type ControlledSubstanceLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ControlledSubstanceLogWhereInput
    orderBy?: ControlledSubstanceLogOrderByWithAggregationInput | ControlledSubstanceLogOrderByWithAggregationInput[]
    by: ControlledSubstanceLogScalarFieldEnum[] | ControlledSubstanceLogScalarFieldEnum
    having?: ControlledSubstanceLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ControlledSubstanceLogCountAggregateInputType | true
    _avg?: ControlledSubstanceLogAvgAggregateInputType
    _sum?: ControlledSubstanceLogSumAggregateInputType
    _min?: ControlledSubstanceLogMinAggregateInputType
    _max?: ControlledSubstanceLogMaxAggregateInputType
  }

  export type ControlledSubstanceLogGroupByOutputType = {
    id: string
    patientId: string
    prescriberId: string
    pharmacyId: string
    medicationName: string
    schedule: string
    quantity: number
    daysSupply: number
    dispensedAt: Date
    reportedToPDMP: boolean
    pdmpReportDate: Date | null
    createdAt: Date
    _count: ControlledSubstanceLogCountAggregateOutputType | null
    _avg: ControlledSubstanceLogAvgAggregateOutputType | null
    _sum: ControlledSubstanceLogSumAggregateOutputType | null
    _min: ControlledSubstanceLogMinAggregateOutputType | null
    _max: ControlledSubstanceLogMaxAggregateOutputType | null
  }

  type GetControlledSubstanceLogGroupByPayload<T extends ControlledSubstanceLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ControlledSubstanceLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ControlledSubstanceLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ControlledSubstanceLogGroupByOutputType[P]>
            : GetScalarType<T[P], ControlledSubstanceLogGroupByOutputType[P]>
        }
      >
    >


  export type ControlledSubstanceLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    prescriberId?: boolean
    pharmacyId?: boolean
    medicationName?: boolean
    schedule?: boolean
    quantity?: boolean
    daysSupply?: boolean
    dispensedAt?: boolean
    reportedToPDMP?: boolean
    pdmpReportDate?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["controlledSubstanceLog"]>

  export type ControlledSubstanceLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    prescriberId?: boolean
    pharmacyId?: boolean
    medicationName?: boolean
    schedule?: boolean
    quantity?: boolean
    daysSupply?: boolean
    dispensedAt?: boolean
    reportedToPDMP?: boolean
    pdmpReportDate?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["controlledSubstanceLog"]>

  export type ControlledSubstanceLogSelectScalar = {
    id?: boolean
    patientId?: boolean
    prescriberId?: boolean
    pharmacyId?: boolean
    medicationName?: boolean
    schedule?: boolean
    quantity?: boolean
    daysSupply?: boolean
    dispensedAt?: boolean
    reportedToPDMP?: boolean
    pdmpReportDate?: boolean
    createdAt?: boolean
  }


  export type $ControlledSubstanceLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ControlledSubstanceLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      prescriberId: string
      pharmacyId: string
      medicationName: string
      schedule: string
      quantity: number
      daysSupply: number
      dispensedAt: Date
      reportedToPDMP: boolean
      pdmpReportDate: Date | null
      createdAt: Date
    }, ExtArgs["result"]["controlledSubstanceLog"]>
    composites: {}
  }

  type ControlledSubstanceLogGetPayload<S extends boolean | null | undefined | ControlledSubstanceLogDefaultArgs> = $Result.GetResult<Prisma.$ControlledSubstanceLogPayload, S>

  type ControlledSubstanceLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ControlledSubstanceLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ControlledSubstanceLogCountAggregateInputType | true
    }

  export interface ControlledSubstanceLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ControlledSubstanceLog'], meta: { name: 'ControlledSubstanceLog' } }
    /**
     * Find zero or one ControlledSubstanceLog that matches the filter.
     * @param {ControlledSubstanceLogFindUniqueArgs} args - Arguments to find a ControlledSubstanceLog
     * @example
     * // Get one ControlledSubstanceLog
     * const controlledSubstanceLog = await prisma.controlledSubstanceLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ControlledSubstanceLogFindUniqueArgs>(args: SelectSubset<T, ControlledSubstanceLogFindUniqueArgs<ExtArgs>>): Prisma__ControlledSubstanceLogClient<$Result.GetResult<Prisma.$ControlledSubstanceLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ControlledSubstanceLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ControlledSubstanceLogFindUniqueOrThrowArgs} args - Arguments to find a ControlledSubstanceLog
     * @example
     * // Get one ControlledSubstanceLog
     * const controlledSubstanceLog = await prisma.controlledSubstanceLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ControlledSubstanceLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ControlledSubstanceLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ControlledSubstanceLogClient<$Result.GetResult<Prisma.$ControlledSubstanceLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ControlledSubstanceLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControlledSubstanceLogFindFirstArgs} args - Arguments to find a ControlledSubstanceLog
     * @example
     * // Get one ControlledSubstanceLog
     * const controlledSubstanceLog = await prisma.controlledSubstanceLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ControlledSubstanceLogFindFirstArgs>(args?: SelectSubset<T, ControlledSubstanceLogFindFirstArgs<ExtArgs>>): Prisma__ControlledSubstanceLogClient<$Result.GetResult<Prisma.$ControlledSubstanceLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ControlledSubstanceLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControlledSubstanceLogFindFirstOrThrowArgs} args - Arguments to find a ControlledSubstanceLog
     * @example
     * // Get one ControlledSubstanceLog
     * const controlledSubstanceLog = await prisma.controlledSubstanceLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ControlledSubstanceLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ControlledSubstanceLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ControlledSubstanceLogClient<$Result.GetResult<Prisma.$ControlledSubstanceLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ControlledSubstanceLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControlledSubstanceLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ControlledSubstanceLogs
     * const controlledSubstanceLogs = await prisma.controlledSubstanceLog.findMany()
     * 
     * // Get first 10 ControlledSubstanceLogs
     * const controlledSubstanceLogs = await prisma.controlledSubstanceLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const controlledSubstanceLogWithIdOnly = await prisma.controlledSubstanceLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ControlledSubstanceLogFindManyArgs>(args?: SelectSubset<T, ControlledSubstanceLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ControlledSubstanceLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ControlledSubstanceLog.
     * @param {ControlledSubstanceLogCreateArgs} args - Arguments to create a ControlledSubstanceLog.
     * @example
     * // Create one ControlledSubstanceLog
     * const ControlledSubstanceLog = await prisma.controlledSubstanceLog.create({
     *   data: {
     *     // ... data to create a ControlledSubstanceLog
     *   }
     * })
     * 
     */
    create<T extends ControlledSubstanceLogCreateArgs>(args: SelectSubset<T, ControlledSubstanceLogCreateArgs<ExtArgs>>): Prisma__ControlledSubstanceLogClient<$Result.GetResult<Prisma.$ControlledSubstanceLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ControlledSubstanceLogs.
     * @param {ControlledSubstanceLogCreateManyArgs} args - Arguments to create many ControlledSubstanceLogs.
     * @example
     * // Create many ControlledSubstanceLogs
     * const controlledSubstanceLog = await prisma.controlledSubstanceLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ControlledSubstanceLogCreateManyArgs>(args?: SelectSubset<T, ControlledSubstanceLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ControlledSubstanceLogs and returns the data saved in the database.
     * @param {ControlledSubstanceLogCreateManyAndReturnArgs} args - Arguments to create many ControlledSubstanceLogs.
     * @example
     * // Create many ControlledSubstanceLogs
     * const controlledSubstanceLog = await prisma.controlledSubstanceLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ControlledSubstanceLogs and only return the `id`
     * const controlledSubstanceLogWithIdOnly = await prisma.controlledSubstanceLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ControlledSubstanceLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ControlledSubstanceLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ControlledSubstanceLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ControlledSubstanceLog.
     * @param {ControlledSubstanceLogDeleteArgs} args - Arguments to delete one ControlledSubstanceLog.
     * @example
     * // Delete one ControlledSubstanceLog
     * const ControlledSubstanceLog = await prisma.controlledSubstanceLog.delete({
     *   where: {
     *     // ... filter to delete one ControlledSubstanceLog
     *   }
     * })
     * 
     */
    delete<T extends ControlledSubstanceLogDeleteArgs>(args: SelectSubset<T, ControlledSubstanceLogDeleteArgs<ExtArgs>>): Prisma__ControlledSubstanceLogClient<$Result.GetResult<Prisma.$ControlledSubstanceLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ControlledSubstanceLog.
     * @param {ControlledSubstanceLogUpdateArgs} args - Arguments to update one ControlledSubstanceLog.
     * @example
     * // Update one ControlledSubstanceLog
     * const controlledSubstanceLog = await prisma.controlledSubstanceLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ControlledSubstanceLogUpdateArgs>(args: SelectSubset<T, ControlledSubstanceLogUpdateArgs<ExtArgs>>): Prisma__ControlledSubstanceLogClient<$Result.GetResult<Prisma.$ControlledSubstanceLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ControlledSubstanceLogs.
     * @param {ControlledSubstanceLogDeleteManyArgs} args - Arguments to filter ControlledSubstanceLogs to delete.
     * @example
     * // Delete a few ControlledSubstanceLogs
     * const { count } = await prisma.controlledSubstanceLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ControlledSubstanceLogDeleteManyArgs>(args?: SelectSubset<T, ControlledSubstanceLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ControlledSubstanceLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControlledSubstanceLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ControlledSubstanceLogs
     * const controlledSubstanceLog = await prisma.controlledSubstanceLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ControlledSubstanceLogUpdateManyArgs>(args: SelectSubset<T, ControlledSubstanceLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ControlledSubstanceLog.
     * @param {ControlledSubstanceLogUpsertArgs} args - Arguments to update or create a ControlledSubstanceLog.
     * @example
     * // Update or create a ControlledSubstanceLog
     * const controlledSubstanceLog = await prisma.controlledSubstanceLog.upsert({
     *   create: {
     *     // ... data to create a ControlledSubstanceLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ControlledSubstanceLog we want to update
     *   }
     * })
     */
    upsert<T extends ControlledSubstanceLogUpsertArgs>(args: SelectSubset<T, ControlledSubstanceLogUpsertArgs<ExtArgs>>): Prisma__ControlledSubstanceLogClient<$Result.GetResult<Prisma.$ControlledSubstanceLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ControlledSubstanceLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControlledSubstanceLogCountArgs} args - Arguments to filter ControlledSubstanceLogs to count.
     * @example
     * // Count the number of ControlledSubstanceLogs
     * const count = await prisma.controlledSubstanceLog.count({
     *   where: {
     *     // ... the filter for the ControlledSubstanceLogs we want to count
     *   }
     * })
    **/
    count<T extends ControlledSubstanceLogCountArgs>(
      args?: Subset<T, ControlledSubstanceLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ControlledSubstanceLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ControlledSubstanceLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControlledSubstanceLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ControlledSubstanceLogAggregateArgs>(args: Subset<T, ControlledSubstanceLogAggregateArgs>): Prisma.PrismaPromise<GetControlledSubstanceLogAggregateType<T>>

    /**
     * Group by ControlledSubstanceLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControlledSubstanceLogGroupByArgs} args - Group by arguments.
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
      T extends ControlledSubstanceLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ControlledSubstanceLogGroupByArgs['orderBy'] }
        : { orderBy?: ControlledSubstanceLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ControlledSubstanceLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetControlledSubstanceLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ControlledSubstanceLog model
   */
  readonly fields: ControlledSubstanceLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ControlledSubstanceLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ControlledSubstanceLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ControlledSubstanceLog model
   */ 
  interface ControlledSubstanceLogFieldRefs {
    readonly id: FieldRef<"ControlledSubstanceLog", 'String'>
    readonly patientId: FieldRef<"ControlledSubstanceLog", 'String'>
    readonly prescriberId: FieldRef<"ControlledSubstanceLog", 'String'>
    readonly pharmacyId: FieldRef<"ControlledSubstanceLog", 'String'>
    readonly medicationName: FieldRef<"ControlledSubstanceLog", 'String'>
    readonly schedule: FieldRef<"ControlledSubstanceLog", 'String'>
    readonly quantity: FieldRef<"ControlledSubstanceLog", 'Int'>
    readonly daysSupply: FieldRef<"ControlledSubstanceLog", 'Int'>
    readonly dispensedAt: FieldRef<"ControlledSubstanceLog", 'DateTime'>
    readonly reportedToPDMP: FieldRef<"ControlledSubstanceLog", 'Boolean'>
    readonly pdmpReportDate: FieldRef<"ControlledSubstanceLog", 'DateTime'>
    readonly createdAt: FieldRef<"ControlledSubstanceLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ControlledSubstanceLog findUnique
   */
  export type ControlledSubstanceLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControlledSubstanceLog
     */
    select?: ControlledSubstanceLogSelect<ExtArgs> | null
    /**
     * Filter, which ControlledSubstanceLog to fetch.
     */
    where: ControlledSubstanceLogWhereUniqueInput
  }

  /**
   * ControlledSubstanceLog findUniqueOrThrow
   */
  export type ControlledSubstanceLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControlledSubstanceLog
     */
    select?: ControlledSubstanceLogSelect<ExtArgs> | null
    /**
     * Filter, which ControlledSubstanceLog to fetch.
     */
    where: ControlledSubstanceLogWhereUniqueInput
  }

  /**
   * ControlledSubstanceLog findFirst
   */
  export type ControlledSubstanceLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControlledSubstanceLog
     */
    select?: ControlledSubstanceLogSelect<ExtArgs> | null
    /**
     * Filter, which ControlledSubstanceLog to fetch.
     */
    where?: ControlledSubstanceLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ControlledSubstanceLogs to fetch.
     */
    orderBy?: ControlledSubstanceLogOrderByWithRelationInput | ControlledSubstanceLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ControlledSubstanceLogs.
     */
    cursor?: ControlledSubstanceLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ControlledSubstanceLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ControlledSubstanceLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ControlledSubstanceLogs.
     */
    distinct?: ControlledSubstanceLogScalarFieldEnum | ControlledSubstanceLogScalarFieldEnum[]
  }

  /**
   * ControlledSubstanceLog findFirstOrThrow
   */
  export type ControlledSubstanceLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControlledSubstanceLog
     */
    select?: ControlledSubstanceLogSelect<ExtArgs> | null
    /**
     * Filter, which ControlledSubstanceLog to fetch.
     */
    where?: ControlledSubstanceLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ControlledSubstanceLogs to fetch.
     */
    orderBy?: ControlledSubstanceLogOrderByWithRelationInput | ControlledSubstanceLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ControlledSubstanceLogs.
     */
    cursor?: ControlledSubstanceLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ControlledSubstanceLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ControlledSubstanceLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ControlledSubstanceLogs.
     */
    distinct?: ControlledSubstanceLogScalarFieldEnum | ControlledSubstanceLogScalarFieldEnum[]
  }

  /**
   * ControlledSubstanceLog findMany
   */
  export type ControlledSubstanceLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControlledSubstanceLog
     */
    select?: ControlledSubstanceLogSelect<ExtArgs> | null
    /**
     * Filter, which ControlledSubstanceLogs to fetch.
     */
    where?: ControlledSubstanceLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ControlledSubstanceLogs to fetch.
     */
    orderBy?: ControlledSubstanceLogOrderByWithRelationInput | ControlledSubstanceLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ControlledSubstanceLogs.
     */
    cursor?: ControlledSubstanceLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ControlledSubstanceLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ControlledSubstanceLogs.
     */
    skip?: number
    distinct?: ControlledSubstanceLogScalarFieldEnum | ControlledSubstanceLogScalarFieldEnum[]
  }

  /**
   * ControlledSubstanceLog create
   */
  export type ControlledSubstanceLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControlledSubstanceLog
     */
    select?: ControlledSubstanceLogSelect<ExtArgs> | null
    /**
     * The data needed to create a ControlledSubstanceLog.
     */
    data: XOR<ControlledSubstanceLogCreateInput, ControlledSubstanceLogUncheckedCreateInput>
  }

  /**
   * ControlledSubstanceLog createMany
   */
  export type ControlledSubstanceLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ControlledSubstanceLogs.
     */
    data: ControlledSubstanceLogCreateManyInput | ControlledSubstanceLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ControlledSubstanceLog createManyAndReturn
   */
  export type ControlledSubstanceLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControlledSubstanceLog
     */
    select?: ControlledSubstanceLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ControlledSubstanceLogs.
     */
    data: ControlledSubstanceLogCreateManyInput | ControlledSubstanceLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ControlledSubstanceLog update
   */
  export type ControlledSubstanceLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControlledSubstanceLog
     */
    select?: ControlledSubstanceLogSelect<ExtArgs> | null
    /**
     * The data needed to update a ControlledSubstanceLog.
     */
    data: XOR<ControlledSubstanceLogUpdateInput, ControlledSubstanceLogUncheckedUpdateInput>
    /**
     * Choose, which ControlledSubstanceLog to update.
     */
    where: ControlledSubstanceLogWhereUniqueInput
  }

  /**
   * ControlledSubstanceLog updateMany
   */
  export type ControlledSubstanceLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ControlledSubstanceLogs.
     */
    data: XOR<ControlledSubstanceLogUpdateManyMutationInput, ControlledSubstanceLogUncheckedUpdateManyInput>
    /**
     * Filter which ControlledSubstanceLogs to update
     */
    where?: ControlledSubstanceLogWhereInput
  }

  /**
   * ControlledSubstanceLog upsert
   */
  export type ControlledSubstanceLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControlledSubstanceLog
     */
    select?: ControlledSubstanceLogSelect<ExtArgs> | null
    /**
     * The filter to search for the ControlledSubstanceLog to update in case it exists.
     */
    where: ControlledSubstanceLogWhereUniqueInput
    /**
     * In case the ControlledSubstanceLog found by the `where` argument doesn't exist, create a new ControlledSubstanceLog with this data.
     */
    create: XOR<ControlledSubstanceLogCreateInput, ControlledSubstanceLogUncheckedCreateInput>
    /**
     * In case the ControlledSubstanceLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ControlledSubstanceLogUpdateInput, ControlledSubstanceLogUncheckedUpdateInput>
  }

  /**
   * ControlledSubstanceLog delete
   */
  export type ControlledSubstanceLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControlledSubstanceLog
     */
    select?: ControlledSubstanceLogSelect<ExtArgs> | null
    /**
     * Filter which ControlledSubstanceLog to delete.
     */
    where: ControlledSubstanceLogWhereUniqueInput
  }

  /**
   * ControlledSubstanceLog deleteMany
   */
  export type ControlledSubstanceLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ControlledSubstanceLogs to delete
     */
    where?: ControlledSubstanceLogWhereInput
  }

  /**
   * ControlledSubstanceLog without action
   */
  export type ControlledSubstanceLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControlledSubstanceLog
     */
    select?: ControlledSubstanceLogSelect<ExtArgs> | null
  }


  /**
   * Model Inventory
   */

  export type AggregateInventory = {
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  export type InventoryAvgAggregateOutputType = {
    quantity: number | null
    reorderLevel: number | null
  }

  export type InventorySumAggregateOutputType = {
    quantity: number | null
    reorderLevel: number | null
  }

  export type InventoryMinAggregateOutputType = {
    id: string | null
    pharmacyId: string | null
    medicationId: string | null
    quantity: number | null
    reorderLevel: number | null
    lotNumber: string | null
    expirationDate: Date | null
    lastRestocked: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryMaxAggregateOutputType = {
    id: string | null
    pharmacyId: string | null
    medicationId: string | null
    quantity: number | null
    reorderLevel: number | null
    lotNumber: string | null
    expirationDate: Date | null
    lastRestocked: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryCountAggregateOutputType = {
    id: number
    pharmacyId: number
    medicationId: number
    quantity: number
    reorderLevel: number
    lotNumber: number
    expirationDate: number
    lastRestocked: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InventoryAvgAggregateInputType = {
    quantity?: true
    reorderLevel?: true
  }

  export type InventorySumAggregateInputType = {
    quantity?: true
    reorderLevel?: true
  }

  export type InventoryMinAggregateInputType = {
    id?: true
    pharmacyId?: true
    medicationId?: true
    quantity?: true
    reorderLevel?: true
    lotNumber?: true
    expirationDate?: true
    lastRestocked?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryMaxAggregateInputType = {
    id?: true
    pharmacyId?: true
    medicationId?: true
    quantity?: true
    reorderLevel?: true
    lotNumber?: true
    expirationDate?: true
    lastRestocked?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryCountAggregateInputType = {
    id?: true
    pharmacyId?: true
    medicationId?: true
    quantity?: true
    reorderLevel?: true
    lotNumber?: true
    expirationDate?: true
    lastRestocked?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InventoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventory to aggregate.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inventories
    **/
    _count?: true | InventoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryMaxAggregateInputType
  }

  export type GetInventoryAggregateType<T extends InventoryAggregateArgs> = {
        [P in keyof T & keyof AggregateInventory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventory[P]>
      : GetScalarType<T[P], AggregateInventory[P]>
  }




  export type InventoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryWhereInput
    orderBy?: InventoryOrderByWithAggregationInput | InventoryOrderByWithAggregationInput[]
    by: InventoryScalarFieldEnum[] | InventoryScalarFieldEnum
    having?: InventoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryCountAggregateInputType | true
    _avg?: InventoryAvgAggregateInputType
    _sum?: InventorySumAggregateInputType
    _min?: InventoryMinAggregateInputType
    _max?: InventoryMaxAggregateInputType
  }

  export type InventoryGroupByOutputType = {
    id: string
    pharmacyId: string
    medicationId: string
    quantity: number
    reorderLevel: number
    lotNumber: string | null
    expirationDate: Date | null
    lastRestocked: Date | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  type GetInventoryGroupByPayload<T extends InventoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryGroupByOutputType[P]>
        }
      >
    >


  export type InventorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pharmacyId?: boolean
    medicationId?: boolean
    quantity?: boolean
    reorderLevel?: boolean
    lotNumber?: boolean
    expirationDate?: boolean
    lastRestocked?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    medication?: boolean | MedicationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pharmacyId?: boolean
    medicationId?: boolean
    quantity?: boolean
    reorderLevel?: boolean
    lotNumber?: boolean
    expirationDate?: boolean
    lastRestocked?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    medication?: boolean | MedicationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectScalar = {
    id?: boolean
    pharmacyId?: boolean
    medicationId?: boolean
    quantity?: boolean
    reorderLevel?: boolean
    lotNumber?: boolean
    expirationDate?: boolean
    lastRestocked?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InventoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    medication?: boolean | MedicationDefaultArgs<ExtArgs>
  }
  export type InventoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    medication?: boolean | MedicationDefaultArgs<ExtArgs>
  }

  export type $InventoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inventory"
    objects: {
      medication: Prisma.$MedicationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pharmacyId: string
      medicationId: string
      quantity: number
      reorderLevel: number
      lotNumber: string | null
      expirationDate: Date | null
      lastRestocked: Date | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inventory"]>
    composites: {}
  }

  type InventoryGetPayload<S extends boolean | null | undefined | InventoryDefaultArgs> = $Result.GetResult<Prisma.$InventoryPayload, S>

  type InventoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InventoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InventoryCountAggregateInputType | true
    }

  export interface InventoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inventory'], meta: { name: 'Inventory' } }
    /**
     * Find zero or one Inventory that matches the filter.
     * @param {InventoryFindUniqueArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryFindUniqueArgs>(args: SelectSubset<T, InventoryFindUniqueArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Inventory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InventoryFindUniqueOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Inventory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindFirstArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryFindFirstArgs>(args?: SelectSubset<T, InventoryFindFirstArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Inventory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindFirstOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Inventories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inventories
     * const inventories = await prisma.inventory.findMany()
     * 
     * // Get first 10 Inventories
     * const inventories = await prisma.inventory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryWithIdOnly = await prisma.inventory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryFindManyArgs>(args?: SelectSubset<T, InventoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Inventory.
     * @param {InventoryCreateArgs} args - Arguments to create a Inventory.
     * @example
     * // Create one Inventory
     * const Inventory = await prisma.inventory.create({
     *   data: {
     *     // ... data to create a Inventory
     *   }
     * })
     * 
     */
    create<T extends InventoryCreateArgs>(args: SelectSubset<T, InventoryCreateArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Inventories.
     * @param {InventoryCreateManyArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryCreateManyArgs>(args?: SelectSubset<T, InventoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inventories and returns the data saved in the database.
     * @param {InventoryCreateManyAndReturnArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inventories and only return the `id`
     * const inventoryWithIdOnly = await prisma.inventory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Inventory.
     * @param {InventoryDeleteArgs} args - Arguments to delete one Inventory.
     * @example
     * // Delete one Inventory
     * const Inventory = await prisma.inventory.delete({
     *   where: {
     *     // ... filter to delete one Inventory
     *   }
     * })
     * 
     */
    delete<T extends InventoryDeleteArgs>(args: SelectSubset<T, InventoryDeleteArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Inventory.
     * @param {InventoryUpdateArgs} args - Arguments to update one Inventory.
     * @example
     * // Update one Inventory
     * const inventory = await prisma.inventory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryUpdateArgs>(args: SelectSubset<T, InventoryUpdateArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Inventories.
     * @param {InventoryDeleteManyArgs} args - Arguments to filter Inventories to delete.
     * @example
     * // Delete a few Inventories
     * const { count } = await prisma.inventory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryDeleteManyArgs>(args?: SelectSubset<T, InventoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inventories
     * const inventory = await prisma.inventory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryUpdateManyArgs>(args: SelectSubset<T, InventoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Inventory.
     * @param {InventoryUpsertArgs} args - Arguments to update or create a Inventory.
     * @example
     * // Update or create a Inventory
     * const inventory = await prisma.inventory.upsert({
     *   create: {
     *     // ... data to create a Inventory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inventory we want to update
     *   }
     * })
     */
    upsert<T extends InventoryUpsertArgs>(args: SelectSubset<T, InventoryUpsertArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCountArgs} args - Arguments to filter Inventories to count.
     * @example
     * // Count the number of Inventories
     * const count = await prisma.inventory.count({
     *   where: {
     *     // ... the filter for the Inventories we want to count
     *   }
     * })
    **/
    count<T extends InventoryCountArgs>(
      args?: Subset<T, InventoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryAggregateArgs>(args: Subset<T, InventoryAggregateArgs>): Prisma.PrismaPromise<GetInventoryAggregateType<T>>

    /**
     * Group by Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryGroupByArgs} args - Group by arguments.
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
      T extends InventoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryGroupByArgs['orderBy'] }
        : { orderBy?: InventoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InventoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inventory model
   */
  readonly fields: InventoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inventory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    medication<T extends MedicationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MedicationDefaultArgs<ExtArgs>>): Prisma__MedicationClient<$Result.GetResult<Prisma.$MedicationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Inventory model
   */ 
  interface InventoryFieldRefs {
    readonly id: FieldRef<"Inventory", 'String'>
    readonly pharmacyId: FieldRef<"Inventory", 'String'>
    readonly medicationId: FieldRef<"Inventory", 'String'>
    readonly quantity: FieldRef<"Inventory", 'Int'>
    readonly reorderLevel: FieldRef<"Inventory", 'Int'>
    readonly lotNumber: FieldRef<"Inventory", 'String'>
    readonly expirationDate: FieldRef<"Inventory", 'DateTime'>
    readonly lastRestocked: FieldRef<"Inventory", 'DateTime'>
    readonly isActive: FieldRef<"Inventory", 'Boolean'>
    readonly createdAt: FieldRef<"Inventory", 'DateTime'>
    readonly updatedAt: FieldRef<"Inventory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Inventory findUnique
   */
  export type InventoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory findUniqueOrThrow
   */
  export type InventoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory findFirst
   */
  export type InventoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory findFirstOrThrow
   */
  export type InventoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory findMany
   */
  export type InventoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventories to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory create
   */
  export type InventoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Inventory.
     */
    data: XOR<InventoryCreateInput, InventoryUncheckedCreateInput>
  }

  /**
   * Inventory createMany
   */
  export type InventoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inventories.
     */
    data: InventoryCreateManyInput | InventoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inventory createManyAndReturn
   */
  export type InventoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Inventories.
     */
    data: InventoryCreateManyInput | InventoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inventory update
   */
  export type InventoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Inventory.
     */
    data: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
    /**
     * Choose, which Inventory to update.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory updateMany
   */
  export type InventoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inventories.
     */
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyInput>
    /**
     * Filter which Inventories to update
     */
    where?: InventoryWhereInput
  }

  /**
   * Inventory upsert
   */
  export type InventoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Inventory to update in case it exists.
     */
    where: InventoryWhereUniqueInput
    /**
     * In case the Inventory found by the `where` argument doesn't exist, create a new Inventory with this data.
     */
    create: XOR<InventoryCreateInput, InventoryUncheckedCreateInput>
    /**
     * In case the Inventory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
  }

  /**
   * Inventory delete
   */
  export type InventoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter which Inventory to delete.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory deleteMany
   */
  export type InventoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventories to delete
     */
    where?: InventoryWhereInput
  }

  /**
   * Inventory without action
   */
  export type InventoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
  }


  /**
   * Model DrugInteraction
   */

  export type AggregateDrugInteraction = {
    _count: DrugInteractionCountAggregateOutputType | null
    _min: DrugInteractionMinAggregateOutputType | null
    _max: DrugInteractionMaxAggregateOutputType | null
  }

  export type DrugInteractionMinAggregateOutputType = {
    id: string | null
    drug1Name: string | null
    drug2Name: string | null
    severity: string | null
    description: string | null
    source: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DrugInteractionMaxAggregateOutputType = {
    id: string | null
    drug1Name: string | null
    drug2Name: string | null
    severity: string | null
    description: string | null
    source: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DrugInteractionCountAggregateOutputType = {
    id: number
    drug1Name: number
    drug2Name: number
    severity: number
    description: number
    source: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DrugInteractionMinAggregateInputType = {
    id?: true
    drug1Name?: true
    drug2Name?: true
    severity?: true
    description?: true
    source?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DrugInteractionMaxAggregateInputType = {
    id?: true
    drug1Name?: true
    drug2Name?: true
    severity?: true
    description?: true
    source?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DrugInteractionCountAggregateInputType = {
    id?: true
    drug1Name?: true
    drug2Name?: true
    severity?: true
    description?: true
    source?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DrugInteractionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DrugInteraction to aggregate.
     */
    where?: DrugInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DrugInteractions to fetch.
     */
    orderBy?: DrugInteractionOrderByWithRelationInput | DrugInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DrugInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DrugInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DrugInteractions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DrugInteractions
    **/
    _count?: true | DrugInteractionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DrugInteractionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DrugInteractionMaxAggregateInputType
  }

  export type GetDrugInteractionAggregateType<T extends DrugInteractionAggregateArgs> = {
        [P in keyof T & keyof AggregateDrugInteraction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDrugInteraction[P]>
      : GetScalarType<T[P], AggregateDrugInteraction[P]>
  }




  export type DrugInteractionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DrugInteractionWhereInput
    orderBy?: DrugInteractionOrderByWithAggregationInput | DrugInteractionOrderByWithAggregationInput[]
    by: DrugInteractionScalarFieldEnum[] | DrugInteractionScalarFieldEnum
    having?: DrugInteractionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DrugInteractionCountAggregateInputType | true
    _min?: DrugInteractionMinAggregateInputType
    _max?: DrugInteractionMaxAggregateInputType
  }

  export type DrugInteractionGroupByOutputType = {
    id: string
    drug1Name: string
    drug2Name: string
    severity: string
    description: string
    source: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: DrugInteractionCountAggregateOutputType | null
    _min: DrugInteractionMinAggregateOutputType | null
    _max: DrugInteractionMaxAggregateOutputType | null
  }

  type GetDrugInteractionGroupByPayload<T extends DrugInteractionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DrugInteractionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DrugInteractionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DrugInteractionGroupByOutputType[P]>
            : GetScalarType<T[P], DrugInteractionGroupByOutputType[P]>
        }
      >
    >


  export type DrugInteractionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    drug1Name?: boolean
    drug2Name?: boolean
    severity?: boolean
    description?: boolean
    source?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["drugInteraction"]>

  export type DrugInteractionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    drug1Name?: boolean
    drug2Name?: boolean
    severity?: boolean
    description?: boolean
    source?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["drugInteraction"]>

  export type DrugInteractionSelectScalar = {
    id?: boolean
    drug1Name?: boolean
    drug2Name?: boolean
    severity?: boolean
    description?: boolean
    source?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $DrugInteractionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DrugInteraction"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      drug1Name: string
      drug2Name: string
      severity: string
      description: string
      source: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["drugInteraction"]>
    composites: {}
  }

  type DrugInteractionGetPayload<S extends boolean | null | undefined | DrugInteractionDefaultArgs> = $Result.GetResult<Prisma.$DrugInteractionPayload, S>

  type DrugInteractionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DrugInteractionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DrugInteractionCountAggregateInputType | true
    }

  export interface DrugInteractionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DrugInteraction'], meta: { name: 'DrugInteraction' } }
    /**
     * Find zero or one DrugInteraction that matches the filter.
     * @param {DrugInteractionFindUniqueArgs} args - Arguments to find a DrugInteraction
     * @example
     * // Get one DrugInteraction
     * const drugInteraction = await prisma.drugInteraction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DrugInteractionFindUniqueArgs>(args: SelectSubset<T, DrugInteractionFindUniqueArgs<ExtArgs>>): Prisma__DrugInteractionClient<$Result.GetResult<Prisma.$DrugInteractionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DrugInteraction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DrugInteractionFindUniqueOrThrowArgs} args - Arguments to find a DrugInteraction
     * @example
     * // Get one DrugInteraction
     * const drugInteraction = await prisma.drugInteraction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DrugInteractionFindUniqueOrThrowArgs>(args: SelectSubset<T, DrugInteractionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DrugInteractionClient<$Result.GetResult<Prisma.$DrugInteractionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DrugInteraction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugInteractionFindFirstArgs} args - Arguments to find a DrugInteraction
     * @example
     * // Get one DrugInteraction
     * const drugInteraction = await prisma.drugInteraction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DrugInteractionFindFirstArgs>(args?: SelectSubset<T, DrugInteractionFindFirstArgs<ExtArgs>>): Prisma__DrugInteractionClient<$Result.GetResult<Prisma.$DrugInteractionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DrugInteraction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugInteractionFindFirstOrThrowArgs} args - Arguments to find a DrugInteraction
     * @example
     * // Get one DrugInteraction
     * const drugInteraction = await prisma.drugInteraction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DrugInteractionFindFirstOrThrowArgs>(args?: SelectSubset<T, DrugInteractionFindFirstOrThrowArgs<ExtArgs>>): Prisma__DrugInteractionClient<$Result.GetResult<Prisma.$DrugInteractionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DrugInteractions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugInteractionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DrugInteractions
     * const drugInteractions = await prisma.drugInteraction.findMany()
     * 
     * // Get first 10 DrugInteractions
     * const drugInteractions = await prisma.drugInteraction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const drugInteractionWithIdOnly = await prisma.drugInteraction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DrugInteractionFindManyArgs>(args?: SelectSubset<T, DrugInteractionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DrugInteractionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DrugInteraction.
     * @param {DrugInteractionCreateArgs} args - Arguments to create a DrugInteraction.
     * @example
     * // Create one DrugInteraction
     * const DrugInteraction = await prisma.drugInteraction.create({
     *   data: {
     *     // ... data to create a DrugInteraction
     *   }
     * })
     * 
     */
    create<T extends DrugInteractionCreateArgs>(args: SelectSubset<T, DrugInteractionCreateArgs<ExtArgs>>): Prisma__DrugInteractionClient<$Result.GetResult<Prisma.$DrugInteractionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DrugInteractions.
     * @param {DrugInteractionCreateManyArgs} args - Arguments to create many DrugInteractions.
     * @example
     * // Create many DrugInteractions
     * const drugInteraction = await prisma.drugInteraction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DrugInteractionCreateManyArgs>(args?: SelectSubset<T, DrugInteractionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DrugInteractions and returns the data saved in the database.
     * @param {DrugInteractionCreateManyAndReturnArgs} args - Arguments to create many DrugInteractions.
     * @example
     * // Create many DrugInteractions
     * const drugInteraction = await prisma.drugInteraction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DrugInteractions and only return the `id`
     * const drugInteractionWithIdOnly = await prisma.drugInteraction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DrugInteractionCreateManyAndReturnArgs>(args?: SelectSubset<T, DrugInteractionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DrugInteractionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DrugInteraction.
     * @param {DrugInteractionDeleteArgs} args - Arguments to delete one DrugInteraction.
     * @example
     * // Delete one DrugInteraction
     * const DrugInteraction = await prisma.drugInteraction.delete({
     *   where: {
     *     // ... filter to delete one DrugInteraction
     *   }
     * })
     * 
     */
    delete<T extends DrugInteractionDeleteArgs>(args: SelectSubset<T, DrugInteractionDeleteArgs<ExtArgs>>): Prisma__DrugInteractionClient<$Result.GetResult<Prisma.$DrugInteractionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DrugInteraction.
     * @param {DrugInteractionUpdateArgs} args - Arguments to update one DrugInteraction.
     * @example
     * // Update one DrugInteraction
     * const drugInteraction = await prisma.drugInteraction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DrugInteractionUpdateArgs>(args: SelectSubset<T, DrugInteractionUpdateArgs<ExtArgs>>): Prisma__DrugInteractionClient<$Result.GetResult<Prisma.$DrugInteractionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DrugInteractions.
     * @param {DrugInteractionDeleteManyArgs} args - Arguments to filter DrugInteractions to delete.
     * @example
     * // Delete a few DrugInteractions
     * const { count } = await prisma.drugInteraction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DrugInteractionDeleteManyArgs>(args?: SelectSubset<T, DrugInteractionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DrugInteractions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugInteractionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DrugInteractions
     * const drugInteraction = await prisma.drugInteraction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DrugInteractionUpdateManyArgs>(args: SelectSubset<T, DrugInteractionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DrugInteraction.
     * @param {DrugInteractionUpsertArgs} args - Arguments to update or create a DrugInteraction.
     * @example
     * // Update or create a DrugInteraction
     * const drugInteraction = await prisma.drugInteraction.upsert({
     *   create: {
     *     // ... data to create a DrugInteraction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DrugInteraction we want to update
     *   }
     * })
     */
    upsert<T extends DrugInteractionUpsertArgs>(args: SelectSubset<T, DrugInteractionUpsertArgs<ExtArgs>>): Prisma__DrugInteractionClient<$Result.GetResult<Prisma.$DrugInteractionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DrugInteractions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugInteractionCountArgs} args - Arguments to filter DrugInteractions to count.
     * @example
     * // Count the number of DrugInteractions
     * const count = await prisma.drugInteraction.count({
     *   where: {
     *     // ... the filter for the DrugInteractions we want to count
     *   }
     * })
    **/
    count<T extends DrugInteractionCountArgs>(
      args?: Subset<T, DrugInteractionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DrugInteractionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DrugInteraction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugInteractionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DrugInteractionAggregateArgs>(args: Subset<T, DrugInteractionAggregateArgs>): Prisma.PrismaPromise<GetDrugInteractionAggregateType<T>>

    /**
     * Group by DrugInteraction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugInteractionGroupByArgs} args - Group by arguments.
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
      T extends DrugInteractionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DrugInteractionGroupByArgs['orderBy'] }
        : { orderBy?: DrugInteractionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DrugInteractionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDrugInteractionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DrugInteraction model
   */
  readonly fields: DrugInteractionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DrugInteraction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DrugInteractionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the DrugInteraction model
   */ 
  interface DrugInteractionFieldRefs {
    readonly id: FieldRef<"DrugInteraction", 'String'>
    readonly drug1Name: FieldRef<"DrugInteraction", 'String'>
    readonly drug2Name: FieldRef<"DrugInteraction", 'String'>
    readonly severity: FieldRef<"DrugInteraction", 'String'>
    readonly description: FieldRef<"DrugInteraction", 'String'>
    readonly source: FieldRef<"DrugInteraction", 'String'>
    readonly isActive: FieldRef<"DrugInteraction", 'Boolean'>
    readonly createdAt: FieldRef<"DrugInteraction", 'DateTime'>
    readonly updatedAt: FieldRef<"DrugInteraction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DrugInteraction findUnique
   */
  export type DrugInteractionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugInteraction
     */
    select?: DrugInteractionSelect<ExtArgs> | null
    /**
     * Filter, which DrugInteraction to fetch.
     */
    where: DrugInteractionWhereUniqueInput
  }

  /**
   * DrugInteraction findUniqueOrThrow
   */
  export type DrugInteractionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugInteraction
     */
    select?: DrugInteractionSelect<ExtArgs> | null
    /**
     * Filter, which DrugInteraction to fetch.
     */
    where: DrugInteractionWhereUniqueInput
  }

  /**
   * DrugInteraction findFirst
   */
  export type DrugInteractionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugInteraction
     */
    select?: DrugInteractionSelect<ExtArgs> | null
    /**
     * Filter, which DrugInteraction to fetch.
     */
    where?: DrugInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DrugInteractions to fetch.
     */
    orderBy?: DrugInteractionOrderByWithRelationInput | DrugInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DrugInteractions.
     */
    cursor?: DrugInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DrugInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DrugInteractions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DrugInteractions.
     */
    distinct?: DrugInteractionScalarFieldEnum | DrugInteractionScalarFieldEnum[]
  }

  /**
   * DrugInteraction findFirstOrThrow
   */
  export type DrugInteractionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugInteraction
     */
    select?: DrugInteractionSelect<ExtArgs> | null
    /**
     * Filter, which DrugInteraction to fetch.
     */
    where?: DrugInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DrugInteractions to fetch.
     */
    orderBy?: DrugInteractionOrderByWithRelationInput | DrugInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DrugInteractions.
     */
    cursor?: DrugInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DrugInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DrugInteractions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DrugInteractions.
     */
    distinct?: DrugInteractionScalarFieldEnum | DrugInteractionScalarFieldEnum[]
  }

  /**
   * DrugInteraction findMany
   */
  export type DrugInteractionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugInteraction
     */
    select?: DrugInteractionSelect<ExtArgs> | null
    /**
     * Filter, which DrugInteractions to fetch.
     */
    where?: DrugInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DrugInteractions to fetch.
     */
    orderBy?: DrugInteractionOrderByWithRelationInput | DrugInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DrugInteractions.
     */
    cursor?: DrugInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DrugInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DrugInteractions.
     */
    skip?: number
    distinct?: DrugInteractionScalarFieldEnum | DrugInteractionScalarFieldEnum[]
  }

  /**
   * DrugInteraction create
   */
  export type DrugInteractionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugInteraction
     */
    select?: DrugInteractionSelect<ExtArgs> | null
    /**
     * The data needed to create a DrugInteraction.
     */
    data: XOR<DrugInteractionCreateInput, DrugInteractionUncheckedCreateInput>
  }

  /**
   * DrugInteraction createMany
   */
  export type DrugInteractionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DrugInteractions.
     */
    data: DrugInteractionCreateManyInput | DrugInteractionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DrugInteraction createManyAndReturn
   */
  export type DrugInteractionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugInteraction
     */
    select?: DrugInteractionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DrugInteractions.
     */
    data: DrugInteractionCreateManyInput | DrugInteractionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DrugInteraction update
   */
  export type DrugInteractionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugInteraction
     */
    select?: DrugInteractionSelect<ExtArgs> | null
    /**
     * The data needed to update a DrugInteraction.
     */
    data: XOR<DrugInteractionUpdateInput, DrugInteractionUncheckedUpdateInput>
    /**
     * Choose, which DrugInteraction to update.
     */
    where: DrugInteractionWhereUniqueInput
  }

  /**
   * DrugInteraction updateMany
   */
  export type DrugInteractionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DrugInteractions.
     */
    data: XOR<DrugInteractionUpdateManyMutationInput, DrugInteractionUncheckedUpdateManyInput>
    /**
     * Filter which DrugInteractions to update
     */
    where?: DrugInteractionWhereInput
  }

  /**
   * DrugInteraction upsert
   */
  export type DrugInteractionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugInteraction
     */
    select?: DrugInteractionSelect<ExtArgs> | null
    /**
     * The filter to search for the DrugInteraction to update in case it exists.
     */
    where: DrugInteractionWhereUniqueInput
    /**
     * In case the DrugInteraction found by the `where` argument doesn't exist, create a new DrugInteraction with this data.
     */
    create: XOR<DrugInteractionCreateInput, DrugInteractionUncheckedCreateInput>
    /**
     * In case the DrugInteraction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DrugInteractionUpdateInput, DrugInteractionUncheckedUpdateInput>
  }

  /**
   * DrugInteraction delete
   */
  export type DrugInteractionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugInteraction
     */
    select?: DrugInteractionSelect<ExtArgs> | null
    /**
     * Filter which DrugInteraction to delete.
     */
    where: DrugInteractionWhereUniqueInput
  }

  /**
   * DrugInteraction deleteMany
   */
  export type DrugInteractionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DrugInteractions to delete
     */
    where?: DrugInteractionWhereInput
  }

  /**
   * DrugInteraction without action
   */
  export type DrugInteractionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugInteraction
     */
    select?: DrugInteractionSelect<ExtArgs> | null
  }


  /**
   * Model DrugAllergy
   */

  export type AggregateDrugAllergy = {
    _count: DrugAllergyCountAggregateOutputType | null
    _min: DrugAllergyMinAggregateOutputType | null
    _max: DrugAllergyMaxAggregateOutputType | null
  }

  export type DrugAllergyMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    allergen: string | null
    reaction: string | null
    severity: string | null
    onsetDate: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DrugAllergyMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    allergen: string | null
    reaction: string | null
    severity: string | null
    onsetDate: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DrugAllergyCountAggregateOutputType = {
    id: number
    patientId: number
    allergen: number
    reaction: number
    severity: number
    onsetDate: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DrugAllergyMinAggregateInputType = {
    id?: true
    patientId?: true
    allergen?: true
    reaction?: true
    severity?: true
    onsetDate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DrugAllergyMaxAggregateInputType = {
    id?: true
    patientId?: true
    allergen?: true
    reaction?: true
    severity?: true
    onsetDate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DrugAllergyCountAggregateInputType = {
    id?: true
    patientId?: true
    allergen?: true
    reaction?: true
    severity?: true
    onsetDate?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DrugAllergyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DrugAllergy to aggregate.
     */
    where?: DrugAllergyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DrugAllergies to fetch.
     */
    orderBy?: DrugAllergyOrderByWithRelationInput | DrugAllergyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DrugAllergyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DrugAllergies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DrugAllergies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DrugAllergies
    **/
    _count?: true | DrugAllergyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DrugAllergyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DrugAllergyMaxAggregateInputType
  }

  export type GetDrugAllergyAggregateType<T extends DrugAllergyAggregateArgs> = {
        [P in keyof T & keyof AggregateDrugAllergy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDrugAllergy[P]>
      : GetScalarType<T[P], AggregateDrugAllergy[P]>
  }




  export type DrugAllergyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DrugAllergyWhereInput
    orderBy?: DrugAllergyOrderByWithAggregationInput | DrugAllergyOrderByWithAggregationInput[]
    by: DrugAllergyScalarFieldEnum[] | DrugAllergyScalarFieldEnum
    having?: DrugAllergyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DrugAllergyCountAggregateInputType | true
    _min?: DrugAllergyMinAggregateInputType
    _max?: DrugAllergyMaxAggregateInputType
  }

  export type DrugAllergyGroupByOutputType = {
    id: string
    patientId: string
    allergen: string
    reaction: string | null
    severity: string | null
    onsetDate: Date | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: DrugAllergyCountAggregateOutputType | null
    _min: DrugAllergyMinAggregateOutputType | null
    _max: DrugAllergyMaxAggregateOutputType | null
  }

  type GetDrugAllergyGroupByPayload<T extends DrugAllergyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DrugAllergyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DrugAllergyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DrugAllergyGroupByOutputType[P]>
            : GetScalarType<T[P], DrugAllergyGroupByOutputType[P]>
        }
      >
    >


  export type DrugAllergySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    allergen?: boolean
    reaction?: boolean
    severity?: boolean
    onsetDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["drugAllergy"]>

  export type DrugAllergySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    allergen?: boolean
    reaction?: boolean
    severity?: boolean
    onsetDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["drugAllergy"]>

  export type DrugAllergySelectScalar = {
    id?: boolean
    patientId?: boolean
    allergen?: boolean
    reaction?: boolean
    severity?: boolean
    onsetDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $DrugAllergyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DrugAllergy"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      allergen: string
      reaction: string | null
      severity: string | null
      onsetDate: Date | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["drugAllergy"]>
    composites: {}
  }

  type DrugAllergyGetPayload<S extends boolean | null | undefined | DrugAllergyDefaultArgs> = $Result.GetResult<Prisma.$DrugAllergyPayload, S>

  type DrugAllergyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DrugAllergyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DrugAllergyCountAggregateInputType | true
    }

  export interface DrugAllergyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DrugAllergy'], meta: { name: 'DrugAllergy' } }
    /**
     * Find zero or one DrugAllergy that matches the filter.
     * @param {DrugAllergyFindUniqueArgs} args - Arguments to find a DrugAllergy
     * @example
     * // Get one DrugAllergy
     * const drugAllergy = await prisma.drugAllergy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DrugAllergyFindUniqueArgs>(args: SelectSubset<T, DrugAllergyFindUniqueArgs<ExtArgs>>): Prisma__DrugAllergyClient<$Result.GetResult<Prisma.$DrugAllergyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DrugAllergy that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DrugAllergyFindUniqueOrThrowArgs} args - Arguments to find a DrugAllergy
     * @example
     * // Get one DrugAllergy
     * const drugAllergy = await prisma.drugAllergy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DrugAllergyFindUniqueOrThrowArgs>(args: SelectSubset<T, DrugAllergyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DrugAllergyClient<$Result.GetResult<Prisma.$DrugAllergyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DrugAllergy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugAllergyFindFirstArgs} args - Arguments to find a DrugAllergy
     * @example
     * // Get one DrugAllergy
     * const drugAllergy = await prisma.drugAllergy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DrugAllergyFindFirstArgs>(args?: SelectSubset<T, DrugAllergyFindFirstArgs<ExtArgs>>): Prisma__DrugAllergyClient<$Result.GetResult<Prisma.$DrugAllergyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DrugAllergy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugAllergyFindFirstOrThrowArgs} args - Arguments to find a DrugAllergy
     * @example
     * // Get one DrugAllergy
     * const drugAllergy = await prisma.drugAllergy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DrugAllergyFindFirstOrThrowArgs>(args?: SelectSubset<T, DrugAllergyFindFirstOrThrowArgs<ExtArgs>>): Prisma__DrugAllergyClient<$Result.GetResult<Prisma.$DrugAllergyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DrugAllergies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugAllergyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DrugAllergies
     * const drugAllergies = await prisma.drugAllergy.findMany()
     * 
     * // Get first 10 DrugAllergies
     * const drugAllergies = await prisma.drugAllergy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const drugAllergyWithIdOnly = await prisma.drugAllergy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DrugAllergyFindManyArgs>(args?: SelectSubset<T, DrugAllergyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DrugAllergyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DrugAllergy.
     * @param {DrugAllergyCreateArgs} args - Arguments to create a DrugAllergy.
     * @example
     * // Create one DrugAllergy
     * const DrugAllergy = await prisma.drugAllergy.create({
     *   data: {
     *     // ... data to create a DrugAllergy
     *   }
     * })
     * 
     */
    create<T extends DrugAllergyCreateArgs>(args: SelectSubset<T, DrugAllergyCreateArgs<ExtArgs>>): Prisma__DrugAllergyClient<$Result.GetResult<Prisma.$DrugAllergyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DrugAllergies.
     * @param {DrugAllergyCreateManyArgs} args - Arguments to create many DrugAllergies.
     * @example
     * // Create many DrugAllergies
     * const drugAllergy = await prisma.drugAllergy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DrugAllergyCreateManyArgs>(args?: SelectSubset<T, DrugAllergyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DrugAllergies and returns the data saved in the database.
     * @param {DrugAllergyCreateManyAndReturnArgs} args - Arguments to create many DrugAllergies.
     * @example
     * // Create many DrugAllergies
     * const drugAllergy = await prisma.drugAllergy.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DrugAllergies and only return the `id`
     * const drugAllergyWithIdOnly = await prisma.drugAllergy.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DrugAllergyCreateManyAndReturnArgs>(args?: SelectSubset<T, DrugAllergyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DrugAllergyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DrugAllergy.
     * @param {DrugAllergyDeleteArgs} args - Arguments to delete one DrugAllergy.
     * @example
     * // Delete one DrugAllergy
     * const DrugAllergy = await prisma.drugAllergy.delete({
     *   where: {
     *     // ... filter to delete one DrugAllergy
     *   }
     * })
     * 
     */
    delete<T extends DrugAllergyDeleteArgs>(args: SelectSubset<T, DrugAllergyDeleteArgs<ExtArgs>>): Prisma__DrugAllergyClient<$Result.GetResult<Prisma.$DrugAllergyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DrugAllergy.
     * @param {DrugAllergyUpdateArgs} args - Arguments to update one DrugAllergy.
     * @example
     * // Update one DrugAllergy
     * const drugAllergy = await prisma.drugAllergy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DrugAllergyUpdateArgs>(args: SelectSubset<T, DrugAllergyUpdateArgs<ExtArgs>>): Prisma__DrugAllergyClient<$Result.GetResult<Prisma.$DrugAllergyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DrugAllergies.
     * @param {DrugAllergyDeleteManyArgs} args - Arguments to filter DrugAllergies to delete.
     * @example
     * // Delete a few DrugAllergies
     * const { count } = await prisma.drugAllergy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DrugAllergyDeleteManyArgs>(args?: SelectSubset<T, DrugAllergyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DrugAllergies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugAllergyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DrugAllergies
     * const drugAllergy = await prisma.drugAllergy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DrugAllergyUpdateManyArgs>(args: SelectSubset<T, DrugAllergyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DrugAllergy.
     * @param {DrugAllergyUpsertArgs} args - Arguments to update or create a DrugAllergy.
     * @example
     * // Update or create a DrugAllergy
     * const drugAllergy = await prisma.drugAllergy.upsert({
     *   create: {
     *     // ... data to create a DrugAllergy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DrugAllergy we want to update
     *   }
     * })
     */
    upsert<T extends DrugAllergyUpsertArgs>(args: SelectSubset<T, DrugAllergyUpsertArgs<ExtArgs>>): Prisma__DrugAllergyClient<$Result.GetResult<Prisma.$DrugAllergyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DrugAllergies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugAllergyCountArgs} args - Arguments to filter DrugAllergies to count.
     * @example
     * // Count the number of DrugAllergies
     * const count = await prisma.drugAllergy.count({
     *   where: {
     *     // ... the filter for the DrugAllergies we want to count
     *   }
     * })
    **/
    count<T extends DrugAllergyCountArgs>(
      args?: Subset<T, DrugAllergyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DrugAllergyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DrugAllergy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugAllergyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DrugAllergyAggregateArgs>(args: Subset<T, DrugAllergyAggregateArgs>): Prisma.PrismaPromise<GetDrugAllergyAggregateType<T>>

    /**
     * Group by DrugAllergy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DrugAllergyGroupByArgs} args - Group by arguments.
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
      T extends DrugAllergyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DrugAllergyGroupByArgs['orderBy'] }
        : { orderBy?: DrugAllergyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DrugAllergyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDrugAllergyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DrugAllergy model
   */
  readonly fields: DrugAllergyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DrugAllergy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DrugAllergyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the DrugAllergy model
   */ 
  interface DrugAllergyFieldRefs {
    readonly id: FieldRef<"DrugAllergy", 'String'>
    readonly patientId: FieldRef<"DrugAllergy", 'String'>
    readonly allergen: FieldRef<"DrugAllergy", 'String'>
    readonly reaction: FieldRef<"DrugAllergy", 'String'>
    readonly severity: FieldRef<"DrugAllergy", 'String'>
    readonly onsetDate: FieldRef<"DrugAllergy", 'DateTime'>
    readonly isActive: FieldRef<"DrugAllergy", 'Boolean'>
    readonly createdAt: FieldRef<"DrugAllergy", 'DateTime'>
    readonly updatedAt: FieldRef<"DrugAllergy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DrugAllergy findUnique
   */
  export type DrugAllergyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugAllergy
     */
    select?: DrugAllergySelect<ExtArgs> | null
    /**
     * Filter, which DrugAllergy to fetch.
     */
    where: DrugAllergyWhereUniqueInput
  }

  /**
   * DrugAllergy findUniqueOrThrow
   */
  export type DrugAllergyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugAllergy
     */
    select?: DrugAllergySelect<ExtArgs> | null
    /**
     * Filter, which DrugAllergy to fetch.
     */
    where: DrugAllergyWhereUniqueInput
  }

  /**
   * DrugAllergy findFirst
   */
  export type DrugAllergyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugAllergy
     */
    select?: DrugAllergySelect<ExtArgs> | null
    /**
     * Filter, which DrugAllergy to fetch.
     */
    where?: DrugAllergyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DrugAllergies to fetch.
     */
    orderBy?: DrugAllergyOrderByWithRelationInput | DrugAllergyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DrugAllergies.
     */
    cursor?: DrugAllergyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DrugAllergies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DrugAllergies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DrugAllergies.
     */
    distinct?: DrugAllergyScalarFieldEnum | DrugAllergyScalarFieldEnum[]
  }

  /**
   * DrugAllergy findFirstOrThrow
   */
  export type DrugAllergyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugAllergy
     */
    select?: DrugAllergySelect<ExtArgs> | null
    /**
     * Filter, which DrugAllergy to fetch.
     */
    where?: DrugAllergyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DrugAllergies to fetch.
     */
    orderBy?: DrugAllergyOrderByWithRelationInput | DrugAllergyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DrugAllergies.
     */
    cursor?: DrugAllergyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DrugAllergies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DrugAllergies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DrugAllergies.
     */
    distinct?: DrugAllergyScalarFieldEnum | DrugAllergyScalarFieldEnum[]
  }

  /**
   * DrugAllergy findMany
   */
  export type DrugAllergyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugAllergy
     */
    select?: DrugAllergySelect<ExtArgs> | null
    /**
     * Filter, which DrugAllergies to fetch.
     */
    where?: DrugAllergyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DrugAllergies to fetch.
     */
    orderBy?: DrugAllergyOrderByWithRelationInput | DrugAllergyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DrugAllergies.
     */
    cursor?: DrugAllergyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DrugAllergies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DrugAllergies.
     */
    skip?: number
    distinct?: DrugAllergyScalarFieldEnum | DrugAllergyScalarFieldEnum[]
  }

  /**
   * DrugAllergy create
   */
  export type DrugAllergyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugAllergy
     */
    select?: DrugAllergySelect<ExtArgs> | null
    /**
     * The data needed to create a DrugAllergy.
     */
    data: XOR<DrugAllergyCreateInput, DrugAllergyUncheckedCreateInput>
  }

  /**
   * DrugAllergy createMany
   */
  export type DrugAllergyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DrugAllergies.
     */
    data: DrugAllergyCreateManyInput | DrugAllergyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DrugAllergy createManyAndReturn
   */
  export type DrugAllergyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugAllergy
     */
    select?: DrugAllergySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DrugAllergies.
     */
    data: DrugAllergyCreateManyInput | DrugAllergyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DrugAllergy update
   */
  export type DrugAllergyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugAllergy
     */
    select?: DrugAllergySelect<ExtArgs> | null
    /**
     * The data needed to update a DrugAllergy.
     */
    data: XOR<DrugAllergyUpdateInput, DrugAllergyUncheckedUpdateInput>
    /**
     * Choose, which DrugAllergy to update.
     */
    where: DrugAllergyWhereUniqueInput
  }

  /**
   * DrugAllergy updateMany
   */
  export type DrugAllergyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DrugAllergies.
     */
    data: XOR<DrugAllergyUpdateManyMutationInput, DrugAllergyUncheckedUpdateManyInput>
    /**
     * Filter which DrugAllergies to update
     */
    where?: DrugAllergyWhereInput
  }

  /**
   * DrugAllergy upsert
   */
  export type DrugAllergyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugAllergy
     */
    select?: DrugAllergySelect<ExtArgs> | null
    /**
     * The filter to search for the DrugAllergy to update in case it exists.
     */
    where: DrugAllergyWhereUniqueInput
    /**
     * In case the DrugAllergy found by the `where` argument doesn't exist, create a new DrugAllergy with this data.
     */
    create: XOR<DrugAllergyCreateInput, DrugAllergyUncheckedCreateInput>
    /**
     * In case the DrugAllergy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DrugAllergyUpdateInput, DrugAllergyUncheckedUpdateInput>
  }

  /**
   * DrugAllergy delete
   */
  export type DrugAllergyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugAllergy
     */
    select?: DrugAllergySelect<ExtArgs> | null
    /**
     * Filter which DrugAllergy to delete.
     */
    where: DrugAllergyWhereUniqueInput
  }

  /**
   * DrugAllergy deleteMany
   */
  export type DrugAllergyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DrugAllergies to delete
     */
    where?: DrugAllergyWhereInput
  }

  /**
   * DrugAllergy without action
   */
  export type DrugAllergyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DrugAllergy
     */
    select?: DrugAllergySelect<ExtArgs> | null
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


  export const PrescriptionScalarFieldEnum: {
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

  export type PrescriptionScalarFieldEnum = (typeof PrescriptionScalarFieldEnum)[keyof typeof PrescriptionScalarFieldEnum]


  export const PrescriptionItemScalarFieldEnum: {
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

  export type PrescriptionItemScalarFieldEnum = (typeof PrescriptionItemScalarFieldEnum)[keyof typeof PrescriptionItemScalarFieldEnum]


  export const PharmacyScalarFieldEnum: {
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

  export type PharmacyScalarFieldEnum = (typeof PharmacyScalarFieldEnum)[keyof typeof PharmacyScalarFieldEnum]


  export const MedicationScalarFieldEnum: {
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

  export type MedicationScalarFieldEnum = (typeof MedicationScalarFieldEnum)[keyof typeof MedicationScalarFieldEnum]


  export const PriorAuthorizationScalarFieldEnum: {
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

  export type PriorAuthorizationScalarFieldEnum = (typeof PriorAuthorizationScalarFieldEnum)[keyof typeof PriorAuthorizationScalarFieldEnum]


  export const DispensingScalarFieldEnum: {
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

  export type DispensingScalarFieldEnum = (typeof DispensingScalarFieldEnum)[keyof typeof DispensingScalarFieldEnum]


  export const ControlledSubstanceLogScalarFieldEnum: {
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

  export type ControlledSubstanceLogScalarFieldEnum = (typeof ControlledSubstanceLogScalarFieldEnum)[keyof typeof ControlledSubstanceLogScalarFieldEnum]


  export const InventoryScalarFieldEnum: {
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

  export type InventoryScalarFieldEnum = (typeof InventoryScalarFieldEnum)[keyof typeof InventoryScalarFieldEnum]


  export const DrugInteractionScalarFieldEnum: {
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

  export type DrugInteractionScalarFieldEnum = (typeof DrugInteractionScalarFieldEnum)[keyof typeof DrugInteractionScalarFieldEnum]


  export const DrugAllergyScalarFieldEnum: {
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

  export type DrugAllergyScalarFieldEnum = (typeof DrugAllergyScalarFieldEnum)[keyof typeof DrugAllergyScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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
   * Reference to a field of type 'PrescriptionStatus'
   */
  export type EnumPrescriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PrescriptionStatus'>
    


  /**
   * Reference to a field of type 'PrescriptionStatus[]'
   */
  export type ListEnumPrescriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PrescriptionStatus[]'>
    


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'PriorAuthStatus'
   */
  export type EnumPriorAuthStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PriorAuthStatus'>
    


  /**
   * Reference to a field of type 'PriorAuthStatus[]'
   */
  export type ListEnumPriorAuthStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PriorAuthStatus[]'>
    


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


  export type PrescriptionWhereInput = {
    AND?: PrescriptionWhereInput | PrescriptionWhereInput[]
    OR?: PrescriptionWhereInput[]
    NOT?: PrescriptionWhereInput | PrescriptionWhereInput[]
    id?: StringFilter<"Prescription"> | string
    patientId?: StringFilter<"Prescription"> | string
    providerId?: StringFilter<"Prescription"> | string
    encounterId?: StringNullableFilter<"Prescription"> | string | null
    status?: EnumPrescriptionStatusFilter<"Prescription"> | $Enums.PrescriptionStatus
    notes?: StringNullableFilter<"Prescription"> | string | null
    validFrom?: DateTimeFilter<"Prescription"> | Date | string
    validUntil?: DateTimeNullableFilter<"Prescription"> | Date | string | null
    createdAt?: DateTimeFilter<"Prescription"> | Date | string
    updatedAt?: DateTimeFilter<"Prescription"> | Date | string
    items?: PrescriptionItemListRelationFilter
  }

  export type PrescriptionOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    items?: PrescriptionItemOrderByRelationAggregateInput
  }

  export type PrescriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PrescriptionWhereInput | PrescriptionWhereInput[]
    OR?: PrescriptionWhereInput[]
    NOT?: PrescriptionWhereInput | PrescriptionWhereInput[]
    patientId?: StringFilter<"Prescription"> | string
    providerId?: StringFilter<"Prescription"> | string
    encounterId?: StringNullableFilter<"Prescription"> | string | null
    status?: EnumPrescriptionStatusFilter<"Prescription"> | $Enums.PrescriptionStatus
    notes?: StringNullableFilter<"Prescription"> | string | null
    validFrom?: DateTimeFilter<"Prescription"> | Date | string
    validUntil?: DateTimeNullableFilter<"Prescription"> | Date | string | null
    createdAt?: DateTimeFilter<"Prescription"> | Date | string
    updatedAt?: DateTimeFilter<"Prescription"> | Date | string
    items?: PrescriptionItemListRelationFilter
  }, "id">

  export type PrescriptionOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PrescriptionCountOrderByAggregateInput
    _max?: PrescriptionMaxOrderByAggregateInput
    _min?: PrescriptionMinOrderByAggregateInput
  }

  export type PrescriptionScalarWhereWithAggregatesInput = {
    AND?: PrescriptionScalarWhereWithAggregatesInput | PrescriptionScalarWhereWithAggregatesInput[]
    OR?: PrescriptionScalarWhereWithAggregatesInput[]
    NOT?: PrescriptionScalarWhereWithAggregatesInput | PrescriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Prescription"> | string
    patientId?: StringWithAggregatesFilter<"Prescription"> | string
    providerId?: StringWithAggregatesFilter<"Prescription"> | string
    encounterId?: StringNullableWithAggregatesFilter<"Prescription"> | string | null
    status?: EnumPrescriptionStatusWithAggregatesFilter<"Prescription"> | $Enums.PrescriptionStatus
    notes?: StringNullableWithAggregatesFilter<"Prescription"> | string | null
    validFrom?: DateTimeWithAggregatesFilter<"Prescription"> | Date | string
    validUntil?: DateTimeNullableWithAggregatesFilter<"Prescription"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Prescription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Prescription"> | Date | string
  }

  export type PrescriptionItemWhereInput = {
    AND?: PrescriptionItemWhereInput | PrescriptionItemWhereInput[]
    OR?: PrescriptionItemWhereInput[]
    NOT?: PrescriptionItemWhereInput | PrescriptionItemWhereInput[]
    id?: StringFilter<"PrescriptionItem"> | string
    prescriptionId?: StringFilter<"PrescriptionItem"> | string
    medicationName?: StringFilter<"PrescriptionItem"> | string
    dosage?: StringFilter<"PrescriptionItem"> | string
    frequency?: StringFilter<"PrescriptionItem"> | string
    duration?: StringNullableFilter<"PrescriptionItem"> | string | null
    quantity?: IntNullableFilter<"PrescriptionItem"> | number | null
    refillsAllowed?: IntFilter<"PrescriptionItem"> | number
    refillsUsed?: IntFilter<"PrescriptionItem"> | number
    instructions?: StringNullableFilter<"PrescriptionItem"> | string | null
    isGenericAllowed?: BoolFilter<"PrescriptionItem"> | boolean
    createdAt?: DateTimeFilter<"PrescriptionItem"> | Date | string
    prescription?: XOR<PrescriptionRelationFilter, PrescriptionWhereInput>
  }

  export type PrescriptionItemOrderByWithRelationInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    medicationName?: SortOrder
    dosage?: SortOrder
    frequency?: SortOrder
    duration?: SortOrderInput | SortOrder
    quantity?: SortOrderInput | SortOrder
    refillsAllowed?: SortOrder
    refillsUsed?: SortOrder
    instructions?: SortOrderInput | SortOrder
    isGenericAllowed?: SortOrder
    createdAt?: SortOrder
    prescription?: PrescriptionOrderByWithRelationInput
  }

  export type PrescriptionItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PrescriptionItemWhereInput | PrescriptionItemWhereInput[]
    OR?: PrescriptionItemWhereInput[]
    NOT?: PrescriptionItemWhereInput | PrescriptionItemWhereInput[]
    prescriptionId?: StringFilter<"PrescriptionItem"> | string
    medicationName?: StringFilter<"PrescriptionItem"> | string
    dosage?: StringFilter<"PrescriptionItem"> | string
    frequency?: StringFilter<"PrescriptionItem"> | string
    duration?: StringNullableFilter<"PrescriptionItem"> | string | null
    quantity?: IntNullableFilter<"PrescriptionItem"> | number | null
    refillsAllowed?: IntFilter<"PrescriptionItem"> | number
    refillsUsed?: IntFilter<"PrescriptionItem"> | number
    instructions?: StringNullableFilter<"PrescriptionItem"> | string | null
    isGenericAllowed?: BoolFilter<"PrescriptionItem"> | boolean
    createdAt?: DateTimeFilter<"PrescriptionItem"> | Date | string
    prescription?: XOR<PrescriptionRelationFilter, PrescriptionWhereInput>
  }, "id">

  export type PrescriptionItemOrderByWithAggregationInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    medicationName?: SortOrder
    dosage?: SortOrder
    frequency?: SortOrder
    duration?: SortOrderInput | SortOrder
    quantity?: SortOrderInput | SortOrder
    refillsAllowed?: SortOrder
    refillsUsed?: SortOrder
    instructions?: SortOrderInput | SortOrder
    isGenericAllowed?: SortOrder
    createdAt?: SortOrder
    _count?: PrescriptionItemCountOrderByAggregateInput
    _avg?: PrescriptionItemAvgOrderByAggregateInput
    _max?: PrescriptionItemMaxOrderByAggregateInput
    _min?: PrescriptionItemMinOrderByAggregateInput
    _sum?: PrescriptionItemSumOrderByAggregateInput
  }

  export type PrescriptionItemScalarWhereWithAggregatesInput = {
    AND?: PrescriptionItemScalarWhereWithAggregatesInput | PrescriptionItemScalarWhereWithAggregatesInput[]
    OR?: PrescriptionItemScalarWhereWithAggregatesInput[]
    NOT?: PrescriptionItemScalarWhereWithAggregatesInput | PrescriptionItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PrescriptionItem"> | string
    prescriptionId?: StringWithAggregatesFilter<"PrescriptionItem"> | string
    medicationName?: StringWithAggregatesFilter<"PrescriptionItem"> | string
    dosage?: StringWithAggregatesFilter<"PrescriptionItem"> | string
    frequency?: StringWithAggregatesFilter<"PrescriptionItem"> | string
    duration?: StringNullableWithAggregatesFilter<"PrescriptionItem"> | string | null
    quantity?: IntNullableWithAggregatesFilter<"PrescriptionItem"> | number | null
    refillsAllowed?: IntWithAggregatesFilter<"PrescriptionItem"> | number
    refillsUsed?: IntWithAggregatesFilter<"PrescriptionItem"> | number
    instructions?: StringNullableWithAggregatesFilter<"PrescriptionItem"> | string | null
    isGenericAllowed?: BoolWithAggregatesFilter<"PrescriptionItem"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"PrescriptionItem"> | Date | string
  }

  export type PharmacyWhereInput = {
    AND?: PharmacyWhereInput | PharmacyWhereInput[]
    OR?: PharmacyWhereInput[]
    NOT?: PharmacyWhereInput | PharmacyWhereInput[]
    id?: StringFilter<"Pharmacy"> | string
    name?: StringFilter<"Pharmacy"> | string
    licenseNumber?: StringFilter<"Pharmacy"> | string
    phone?: StringFilter<"Pharmacy"> | string
    email?: StringNullableFilter<"Pharmacy"> | string | null
    address?: JsonFilter<"Pharmacy">
    operatingHours?: JsonNullableFilter<"Pharmacy">
    isActive?: BoolFilter<"Pharmacy"> | boolean
    createdAt?: DateTimeFilter<"Pharmacy"> | Date | string
    updatedAt?: DateTimeFilter<"Pharmacy"> | Date | string
  }

  export type PharmacyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    licenseNumber?: SortOrder
    phone?: SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrder
    operatingHours?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PharmacyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    licenseNumber?: string
    AND?: PharmacyWhereInput | PharmacyWhereInput[]
    OR?: PharmacyWhereInput[]
    NOT?: PharmacyWhereInput | PharmacyWhereInput[]
    name?: StringFilter<"Pharmacy"> | string
    phone?: StringFilter<"Pharmacy"> | string
    email?: StringNullableFilter<"Pharmacy"> | string | null
    address?: JsonFilter<"Pharmacy">
    operatingHours?: JsonNullableFilter<"Pharmacy">
    isActive?: BoolFilter<"Pharmacy"> | boolean
    createdAt?: DateTimeFilter<"Pharmacy"> | Date | string
    updatedAt?: DateTimeFilter<"Pharmacy"> | Date | string
  }, "id" | "licenseNumber">

  export type PharmacyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    licenseNumber?: SortOrder
    phone?: SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrder
    operatingHours?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PharmacyCountOrderByAggregateInput
    _max?: PharmacyMaxOrderByAggregateInput
    _min?: PharmacyMinOrderByAggregateInput
  }

  export type PharmacyScalarWhereWithAggregatesInput = {
    AND?: PharmacyScalarWhereWithAggregatesInput | PharmacyScalarWhereWithAggregatesInput[]
    OR?: PharmacyScalarWhereWithAggregatesInput[]
    NOT?: PharmacyScalarWhereWithAggregatesInput | PharmacyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pharmacy"> | string
    name?: StringWithAggregatesFilter<"Pharmacy"> | string
    licenseNumber?: StringWithAggregatesFilter<"Pharmacy"> | string
    phone?: StringWithAggregatesFilter<"Pharmacy"> | string
    email?: StringNullableWithAggregatesFilter<"Pharmacy"> | string | null
    address?: JsonWithAggregatesFilter<"Pharmacy">
    operatingHours?: JsonNullableWithAggregatesFilter<"Pharmacy">
    isActive?: BoolWithAggregatesFilter<"Pharmacy"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Pharmacy"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Pharmacy"> | Date | string
  }

  export type MedicationWhereInput = {
    AND?: MedicationWhereInput | MedicationWhereInput[]
    OR?: MedicationWhereInput[]
    NOT?: MedicationWhereInput | MedicationWhereInput[]
    id?: StringFilter<"Medication"> | string
    name?: StringFilter<"Medication"> | string
    genericName?: StringNullableFilter<"Medication"> | string | null
    brandNames?: StringNullableListFilter<"Medication">
    strength?: StringFilter<"Medication"> | string
    dosageForm?: StringFilter<"Medication"> | string
    manufacturer?: StringNullableFilter<"Medication"> | string | null
    ndcCode?: StringNullableFilter<"Medication"> | string | null
    description?: StringNullableFilter<"Medication"> | string | null
    sideEffects?: StringNullableListFilter<"Medication">
    interactions?: StringNullableListFilter<"Medication">
    isControlled?: BoolFilter<"Medication"> | boolean
    schedule?: StringNullableFilter<"Medication"> | string | null
    requiresPriorAuth?: BoolFilter<"Medication"> | boolean
    isActive?: BoolFilter<"Medication"> | boolean
    createdAt?: DateTimeFilter<"Medication"> | Date | string
    updatedAt?: DateTimeFilter<"Medication"> | Date | string
    inventory?: InventoryListRelationFilter
  }

  export type MedicationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    genericName?: SortOrderInput | SortOrder
    brandNames?: SortOrder
    strength?: SortOrder
    dosageForm?: SortOrder
    manufacturer?: SortOrderInput | SortOrder
    ndcCode?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    sideEffects?: SortOrder
    interactions?: SortOrder
    isControlled?: SortOrder
    schedule?: SortOrderInput | SortOrder
    requiresPriorAuth?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    inventory?: InventoryOrderByRelationAggregateInput
  }

  export type MedicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ndcCode?: string
    AND?: MedicationWhereInput | MedicationWhereInput[]
    OR?: MedicationWhereInput[]
    NOT?: MedicationWhereInput | MedicationWhereInput[]
    name?: StringFilter<"Medication"> | string
    genericName?: StringNullableFilter<"Medication"> | string | null
    brandNames?: StringNullableListFilter<"Medication">
    strength?: StringFilter<"Medication"> | string
    dosageForm?: StringFilter<"Medication"> | string
    manufacturer?: StringNullableFilter<"Medication"> | string | null
    description?: StringNullableFilter<"Medication"> | string | null
    sideEffects?: StringNullableListFilter<"Medication">
    interactions?: StringNullableListFilter<"Medication">
    isControlled?: BoolFilter<"Medication"> | boolean
    schedule?: StringNullableFilter<"Medication"> | string | null
    requiresPriorAuth?: BoolFilter<"Medication"> | boolean
    isActive?: BoolFilter<"Medication"> | boolean
    createdAt?: DateTimeFilter<"Medication"> | Date | string
    updatedAt?: DateTimeFilter<"Medication"> | Date | string
    inventory?: InventoryListRelationFilter
  }, "id" | "ndcCode">

  export type MedicationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    genericName?: SortOrderInput | SortOrder
    brandNames?: SortOrder
    strength?: SortOrder
    dosageForm?: SortOrder
    manufacturer?: SortOrderInput | SortOrder
    ndcCode?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    sideEffects?: SortOrder
    interactions?: SortOrder
    isControlled?: SortOrder
    schedule?: SortOrderInput | SortOrder
    requiresPriorAuth?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MedicationCountOrderByAggregateInput
    _max?: MedicationMaxOrderByAggregateInput
    _min?: MedicationMinOrderByAggregateInput
  }

  export type MedicationScalarWhereWithAggregatesInput = {
    AND?: MedicationScalarWhereWithAggregatesInput | MedicationScalarWhereWithAggregatesInput[]
    OR?: MedicationScalarWhereWithAggregatesInput[]
    NOT?: MedicationScalarWhereWithAggregatesInput | MedicationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Medication"> | string
    name?: StringWithAggregatesFilter<"Medication"> | string
    genericName?: StringNullableWithAggregatesFilter<"Medication"> | string | null
    brandNames?: StringNullableListFilter<"Medication">
    strength?: StringWithAggregatesFilter<"Medication"> | string
    dosageForm?: StringWithAggregatesFilter<"Medication"> | string
    manufacturer?: StringNullableWithAggregatesFilter<"Medication"> | string | null
    ndcCode?: StringNullableWithAggregatesFilter<"Medication"> | string | null
    description?: StringNullableWithAggregatesFilter<"Medication"> | string | null
    sideEffects?: StringNullableListFilter<"Medication">
    interactions?: StringNullableListFilter<"Medication">
    isControlled?: BoolWithAggregatesFilter<"Medication"> | boolean
    schedule?: StringNullableWithAggregatesFilter<"Medication"> | string | null
    requiresPriorAuth?: BoolWithAggregatesFilter<"Medication"> | boolean
    isActive?: BoolWithAggregatesFilter<"Medication"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Medication"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Medication"> | Date | string
  }

  export type PriorAuthorizationWhereInput = {
    AND?: PriorAuthorizationWhereInput | PriorAuthorizationWhereInput[]
    OR?: PriorAuthorizationWhereInput[]
    NOT?: PriorAuthorizationWhereInput | PriorAuthorizationWhereInput[]
    id?: StringFilter<"PriorAuthorization"> | string
    prescriptionId?: StringFilter<"PriorAuthorization"> | string
    patientId?: StringFilter<"PriorAuthorization"> | string
    providerId?: StringFilter<"PriorAuthorization"> | string
    insurerId?: StringNullableFilter<"PriorAuthorization"> | string | null
    medicationName?: StringFilter<"PriorAuthorization"> | string
    status?: EnumPriorAuthStatusFilter<"PriorAuthorization"> | $Enums.PriorAuthStatus
    requestDate?: DateTimeFilter<"PriorAuthorization"> | Date | string
    approvalDate?: DateTimeNullableFilter<"PriorAuthorization"> | Date | string | null
    denialDate?: DateTimeNullableFilter<"PriorAuthorization"> | Date | string | null
    expirationDate?: DateTimeNullableFilter<"PriorAuthorization"> | Date | string | null
    denialReason?: StringNullableFilter<"PriorAuthorization"> | string | null
    approvalCode?: StringNullableFilter<"PriorAuthorization"> | string | null
    notes?: StringNullableFilter<"PriorAuthorization"> | string | null
    createdAt?: DateTimeFilter<"PriorAuthorization"> | Date | string
    updatedAt?: DateTimeFilter<"PriorAuthorization"> | Date | string
    dispensings?: DispensingListRelationFilter
  }

  export type PriorAuthorizationOrderByWithRelationInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    insurerId?: SortOrderInput | SortOrder
    medicationName?: SortOrder
    status?: SortOrder
    requestDate?: SortOrder
    approvalDate?: SortOrderInput | SortOrder
    denialDate?: SortOrderInput | SortOrder
    expirationDate?: SortOrderInput | SortOrder
    denialReason?: SortOrderInput | SortOrder
    approvalCode?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dispensings?: DispensingOrderByRelationAggregateInput
  }

  export type PriorAuthorizationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PriorAuthorizationWhereInput | PriorAuthorizationWhereInput[]
    OR?: PriorAuthorizationWhereInput[]
    NOT?: PriorAuthorizationWhereInput | PriorAuthorizationWhereInput[]
    prescriptionId?: StringFilter<"PriorAuthorization"> | string
    patientId?: StringFilter<"PriorAuthorization"> | string
    providerId?: StringFilter<"PriorAuthorization"> | string
    insurerId?: StringNullableFilter<"PriorAuthorization"> | string | null
    medicationName?: StringFilter<"PriorAuthorization"> | string
    status?: EnumPriorAuthStatusFilter<"PriorAuthorization"> | $Enums.PriorAuthStatus
    requestDate?: DateTimeFilter<"PriorAuthorization"> | Date | string
    approvalDate?: DateTimeNullableFilter<"PriorAuthorization"> | Date | string | null
    denialDate?: DateTimeNullableFilter<"PriorAuthorization"> | Date | string | null
    expirationDate?: DateTimeNullableFilter<"PriorAuthorization"> | Date | string | null
    denialReason?: StringNullableFilter<"PriorAuthorization"> | string | null
    approvalCode?: StringNullableFilter<"PriorAuthorization"> | string | null
    notes?: StringNullableFilter<"PriorAuthorization"> | string | null
    createdAt?: DateTimeFilter<"PriorAuthorization"> | Date | string
    updatedAt?: DateTimeFilter<"PriorAuthorization"> | Date | string
    dispensings?: DispensingListRelationFilter
  }, "id">

  export type PriorAuthorizationOrderByWithAggregationInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    insurerId?: SortOrderInput | SortOrder
    medicationName?: SortOrder
    status?: SortOrder
    requestDate?: SortOrder
    approvalDate?: SortOrderInput | SortOrder
    denialDate?: SortOrderInput | SortOrder
    expirationDate?: SortOrderInput | SortOrder
    denialReason?: SortOrderInput | SortOrder
    approvalCode?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PriorAuthorizationCountOrderByAggregateInput
    _max?: PriorAuthorizationMaxOrderByAggregateInput
    _min?: PriorAuthorizationMinOrderByAggregateInput
  }

  export type PriorAuthorizationScalarWhereWithAggregatesInput = {
    AND?: PriorAuthorizationScalarWhereWithAggregatesInput | PriorAuthorizationScalarWhereWithAggregatesInput[]
    OR?: PriorAuthorizationScalarWhereWithAggregatesInput[]
    NOT?: PriorAuthorizationScalarWhereWithAggregatesInput | PriorAuthorizationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PriorAuthorization"> | string
    prescriptionId?: StringWithAggregatesFilter<"PriorAuthorization"> | string
    patientId?: StringWithAggregatesFilter<"PriorAuthorization"> | string
    providerId?: StringWithAggregatesFilter<"PriorAuthorization"> | string
    insurerId?: StringNullableWithAggregatesFilter<"PriorAuthorization"> | string | null
    medicationName?: StringWithAggregatesFilter<"PriorAuthorization"> | string
    status?: EnumPriorAuthStatusWithAggregatesFilter<"PriorAuthorization"> | $Enums.PriorAuthStatus
    requestDate?: DateTimeWithAggregatesFilter<"PriorAuthorization"> | Date | string
    approvalDate?: DateTimeNullableWithAggregatesFilter<"PriorAuthorization"> | Date | string | null
    denialDate?: DateTimeNullableWithAggregatesFilter<"PriorAuthorization"> | Date | string | null
    expirationDate?: DateTimeNullableWithAggregatesFilter<"PriorAuthorization"> | Date | string | null
    denialReason?: StringNullableWithAggregatesFilter<"PriorAuthorization"> | string | null
    approvalCode?: StringNullableWithAggregatesFilter<"PriorAuthorization"> | string | null
    notes?: StringNullableWithAggregatesFilter<"PriorAuthorization"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PriorAuthorization"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PriorAuthorization"> | Date | string
  }

  export type DispensingWhereInput = {
    AND?: DispensingWhereInput | DispensingWhereInput[]
    OR?: DispensingWhereInput[]
    NOT?: DispensingWhereInput | DispensingWhereInput[]
    id?: StringFilter<"Dispensing"> | string
    prescriptionId?: StringFilter<"Dispensing"> | string
    patientId?: StringFilter<"Dispensing"> | string
    pharmacyId?: StringFilter<"Dispensing"> | string
    priorAuthorizationId?: StringNullableFilter<"Dispensing"> | string | null
    medicationName?: StringFilter<"Dispensing"> | string
    quantity?: IntFilter<"Dispensing"> | number
    dispensedAt?: DateTimeFilter<"Dispensing"> | Date | string
    pharmacist?: StringNullableFilter<"Dispensing"> | string | null
    notes?: StringNullableFilter<"Dispensing"> | string | null
    createdAt?: DateTimeFilter<"Dispensing"> | Date | string
    priorAuthorization?: XOR<PriorAuthorizationNullableRelationFilter, PriorAuthorizationWhereInput> | null
  }

  export type DispensingOrderByWithRelationInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    patientId?: SortOrder
    pharmacyId?: SortOrder
    priorAuthorizationId?: SortOrderInput | SortOrder
    medicationName?: SortOrder
    quantity?: SortOrder
    dispensedAt?: SortOrder
    pharmacist?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    priorAuthorization?: PriorAuthorizationOrderByWithRelationInput
  }

  export type DispensingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DispensingWhereInput | DispensingWhereInput[]
    OR?: DispensingWhereInput[]
    NOT?: DispensingWhereInput | DispensingWhereInput[]
    prescriptionId?: StringFilter<"Dispensing"> | string
    patientId?: StringFilter<"Dispensing"> | string
    pharmacyId?: StringFilter<"Dispensing"> | string
    priorAuthorizationId?: StringNullableFilter<"Dispensing"> | string | null
    medicationName?: StringFilter<"Dispensing"> | string
    quantity?: IntFilter<"Dispensing"> | number
    dispensedAt?: DateTimeFilter<"Dispensing"> | Date | string
    pharmacist?: StringNullableFilter<"Dispensing"> | string | null
    notes?: StringNullableFilter<"Dispensing"> | string | null
    createdAt?: DateTimeFilter<"Dispensing"> | Date | string
    priorAuthorization?: XOR<PriorAuthorizationNullableRelationFilter, PriorAuthorizationWhereInput> | null
  }, "id">

  export type DispensingOrderByWithAggregationInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    patientId?: SortOrder
    pharmacyId?: SortOrder
    priorAuthorizationId?: SortOrderInput | SortOrder
    medicationName?: SortOrder
    quantity?: SortOrder
    dispensedAt?: SortOrder
    pharmacist?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DispensingCountOrderByAggregateInput
    _avg?: DispensingAvgOrderByAggregateInput
    _max?: DispensingMaxOrderByAggregateInput
    _min?: DispensingMinOrderByAggregateInput
    _sum?: DispensingSumOrderByAggregateInput
  }

  export type DispensingScalarWhereWithAggregatesInput = {
    AND?: DispensingScalarWhereWithAggregatesInput | DispensingScalarWhereWithAggregatesInput[]
    OR?: DispensingScalarWhereWithAggregatesInput[]
    NOT?: DispensingScalarWhereWithAggregatesInput | DispensingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Dispensing"> | string
    prescriptionId?: StringWithAggregatesFilter<"Dispensing"> | string
    patientId?: StringWithAggregatesFilter<"Dispensing"> | string
    pharmacyId?: StringWithAggregatesFilter<"Dispensing"> | string
    priorAuthorizationId?: StringNullableWithAggregatesFilter<"Dispensing"> | string | null
    medicationName?: StringWithAggregatesFilter<"Dispensing"> | string
    quantity?: IntWithAggregatesFilter<"Dispensing"> | number
    dispensedAt?: DateTimeWithAggregatesFilter<"Dispensing"> | Date | string
    pharmacist?: StringNullableWithAggregatesFilter<"Dispensing"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Dispensing"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Dispensing"> | Date | string
  }

  export type ControlledSubstanceLogWhereInput = {
    AND?: ControlledSubstanceLogWhereInput | ControlledSubstanceLogWhereInput[]
    OR?: ControlledSubstanceLogWhereInput[]
    NOT?: ControlledSubstanceLogWhereInput | ControlledSubstanceLogWhereInput[]
    id?: StringFilter<"ControlledSubstanceLog"> | string
    patientId?: StringFilter<"ControlledSubstanceLog"> | string
    prescriberId?: StringFilter<"ControlledSubstanceLog"> | string
    pharmacyId?: StringFilter<"ControlledSubstanceLog"> | string
    medicationName?: StringFilter<"ControlledSubstanceLog"> | string
    schedule?: StringFilter<"ControlledSubstanceLog"> | string
    quantity?: IntFilter<"ControlledSubstanceLog"> | number
    daysSupply?: IntFilter<"ControlledSubstanceLog"> | number
    dispensedAt?: DateTimeFilter<"ControlledSubstanceLog"> | Date | string
    reportedToPDMP?: BoolFilter<"ControlledSubstanceLog"> | boolean
    pdmpReportDate?: DateTimeNullableFilter<"ControlledSubstanceLog"> | Date | string | null
    createdAt?: DateTimeFilter<"ControlledSubstanceLog"> | Date | string
  }

  export type ControlledSubstanceLogOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    prescriberId?: SortOrder
    pharmacyId?: SortOrder
    medicationName?: SortOrder
    schedule?: SortOrder
    quantity?: SortOrder
    daysSupply?: SortOrder
    dispensedAt?: SortOrder
    reportedToPDMP?: SortOrder
    pdmpReportDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type ControlledSubstanceLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ControlledSubstanceLogWhereInput | ControlledSubstanceLogWhereInput[]
    OR?: ControlledSubstanceLogWhereInput[]
    NOT?: ControlledSubstanceLogWhereInput | ControlledSubstanceLogWhereInput[]
    patientId?: StringFilter<"ControlledSubstanceLog"> | string
    prescriberId?: StringFilter<"ControlledSubstanceLog"> | string
    pharmacyId?: StringFilter<"ControlledSubstanceLog"> | string
    medicationName?: StringFilter<"ControlledSubstanceLog"> | string
    schedule?: StringFilter<"ControlledSubstanceLog"> | string
    quantity?: IntFilter<"ControlledSubstanceLog"> | number
    daysSupply?: IntFilter<"ControlledSubstanceLog"> | number
    dispensedAt?: DateTimeFilter<"ControlledSubstanceLog"> | Date | string
    reportedToPDMP?: BoolFilter<"ControlledSubstanceLog"> | boolean
    pdmpReportDate?: DateTimeNullableFilter<"ControlledSubstanceLog"> | Date | string | null
    createdAt?: DateTimeFilter<"ControlledSubstanceLog"> | Date | string
  }, "id">

  export type ControlledSubstanceLogOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    prescriberId?: SortOrder
    pharmacyId?: SortOrder
    medicationName?: SortOrder
    schedule?: SortOrder
    quantity?: SortOrder
    daysSupply?: SortOrder
    dispensedAt?: SortOrder
    reportedToPDMP?: SortOrder
    pdmpReportDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ControlledSubstanceLogCountOrderByAggregateInput
    _avg?: ControlledSubstanceLogAvgOrderByAggregateInput
    _max?: ControlledSubstanceLogMaxOrderByAggregateInput
    _min?: ControlledSubstanceLogMinOrderByAggregateInput
    _sum?: ControlledSubstanceLogSumOrderByAggregateInput
  }

  export type ControlledSubstanceLogScalarWhereWithAggregatesInput = {
    AND?: ControlledSubstanceLogScalarWhereWithAggregatesInput | ControlledSubstanceLogScalarWhereWithAggregatesInput[]
    OR?: ControlledSubstanceLogScalarWhereWithAggregatesInput[]
    NOT?: ControlledSubstanceLogScalarWhereWithAggregatesInput | ControlledSubstanceLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ControlledSubstanceLog"> | string
    patientId?: StringWithAggregatesFilter<"ControlledSubstanceLog"> | string
    prescriberId?: StringWithAggregatesFilter<"ControlledSubstanceLog"> | string
    pharmacyId?: StringWithAggregatesFilter<"ControlledSubstanceLog"> | string
    medicationName?: StringWithAggregatesFilter<"ControlledSubstanceLog"> | string
    schedule?: StringWithAggregatesFilter<"ControlledSubstanceLog"> | string
    quantity?: IntWithAggregatesFilter<"ControlledSubstanceLog"> | number
    daysSupply?: IntWithAggregatesFilter<"ControlledSubstanceLog"> | number
    dispensedAt?: DateTimeWithAggregatesFilter<"ControlledSubstanceLog"> | Date | string
    reportedToPDMP?: BoolWithAggregatesFilter<"ControlledSubstanceLog"> | boolean
    pdmpReportDate?: DateTimeNullableWithAggregatesFilter<"ControlledSubstanceLog"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ControlledSubstanceLog"> | Date | string
  }

  export type InventoryWhereInput = {
    AND?: InventoryWhereInput | InventoryWhereInput[]
    OR?: InventoryWhereInput[]
    NOT?: InventoryWhereInput | InventoryWhereInput[]
    id?: StringFilter<"Inventory"> | string
    pharmacyId?: StringFilter<"Inventory"> | string
    medicationId?: StringFilter<"Inventory"> | string
    quantity?: IntFilter<"Inventory"> | number
    reorderLevel?: IntFilter<"Inventory"> | number
    lotNumber?: StringNullableFilter<"Inventory"> | string | null
    expirationDate?: DateTimeNullableFilter<"Inventory"> | Date | string | null
    lastRestocked?: DateTimeNullableFilter<"Inventory"> | Date | string | null
    isActive?: BoolFilter<"Inventory"> | boolean
    createdAt?: DateTimeFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeFilter<"Inventory"> | Date | string
    medication?: XOR<MedicationRelationFilter, MedicationWhereInput>
  }

  export type InventoryOrderByWithRelationInput = {
    id?: SortOrder
    pharmacyId?: SortOrder
    medicationId?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    lotNumber?: SortOrderInput | SortOrder
    expirationDate?: SortOrderInput | SortOrder
    lastRestocked?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    medication?: MedicationOrderByWithRelationInput
  }

  export type InventoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    pharmacyId_medicationId_lotNumber?: InventoryPharmacyIdMedicationIdLotNumberCompoundUniqueInput
    AND?: InventoryWhereInput | InventoryWhereInput[]
    OR?: InventoryWhereInput[]
    NOT?: InventoryWhereInput | InventoryWhereInput[]
    pharmacyId?: StringFilter<"Inventory"> | string
    medicationId?: StringFilter<"Inventory"> | string
    quantity?: IntFilter<"Inventory"> | number
    reorderLevel?: IntFilter<"Inventory"> | number
    lotNumber?: StringNullableFilter<"Inventory"> | string | null
    expirationDate?: DateTimeNullableFilter<"Inventory"> | Date | string | null
    lastRestocked?: DateTimeNullableFilter<"Inventory"> | Date | string | null
    isActive?: BoolFilter<"Inventory"> | boolean
    createdAt?: DateTimeFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeFilter<"Inventory"> | Date | string
    medication?: XOR<MedicationRelationFilter, MedicationWhereInput>
  }, "id" | "pharmacyId_medicationId_lotNumber">

  export type InventoryOrderByWithAggregationInput = {
    id?: SortOrder
    pharmacyId?: SortOrder
    medicationId?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    lotNumber?: SortOrderInput | SortOrder
    expirationDate?: SortOrderInput | SortOrder
    lastRestocked?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InventoryCountOrderByAggregateInput
    _avg?: InventoryAvgOrderByAggregateInput
    _max?: InventoryMaxOrderByAggregateInput
    _min?: InventoryMinOrderByAggregateInput
    _sum?: InventorySumOrderByAggregateInput
  }

  export type InventoryScalarWhereWithAggregatesInput = {
    AND?: InventoryScalarWhereWithAggregatesInput | InventoryScalarWhereWithAggregatesInput[]
    OR?: InventoryScalarWhereWithAggregatesInput[]
    NOT?: InventoryScalarWhereWithAggregatesInput | InventoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Inventory"> | string
    pharmacyId?: StringWithAggregatesFilter<"Inventory"> | string
    medicationId?: StringWithAggregatesFilter<"Inventory"> | string
    quantity?: IntWithAggregatesFilter<"Inventory"> | number
    reorderLevel?: IntWithAggregatesFilter<"Inventory"> | number
    lotNumber?: StringNullableWithAggregatesFilter<"Inventory"> | string | null
    expirationDate?: DateTimeNullableWithAggregatesFilter<"Inventory"> | Date | string | null
    lastRestocked?: DateTimeNullableWithAggregatesFilter<"Inventory"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"Inventory"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Inventory"> | Date | string
  }

  export type DrugInteractionWhereInput = {
    AND?: DrugInteractionWhereInput | DrugInteractionWhereInput[]
    OR?: DrugInteractionWhereInput[]
    NOT?: DrugInteractionWhereInput | DrugInteractionWhereInput[]
    id?: StringFilter<"DrugInteraction"> | string
    drug1Name?: StringFilter<"DrugInteraction"> | string
    drug2Name?: StringFilter<"DrugInteraction"> | string
    severity?: StringFilter<"DrugInteraction"> | string
    description?: StringFilter<"DrugInteraction"> | string
    source?: StringNullableFilter<"DrugInteraction"> | string | null
    isActive?: BoolFilter<"DrugInteraction"> | boolean
    createdAt?: DateTimeFilter<"DrugInteraction"> | Date | string
    updatedAt?: DateTimeFilter<"DrugInteraction"> | Date | string
  }

  export type DrugInteractionOrderByWithRelationInput = {
    id?: SortOrder
    drug1Name?: SortOrder
    drug2Name?: SortOrder
    severity?: SortOrder
    description?: SortOrder
    source?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DrugInteractionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DrugInteractionWhereInput | DrugInteractionWhereInput[]
    OR?: DrugInteractionWhereInput[]
    NOT?: DrugInteractionWhereInput | DrugInteractionWhereInput[]
    drug1Name?: StringFilter<"DrugInteraction"> | string
    drug2Name?: StringFilter<"DrugInteraction"> | string
    severity?: StringFilter<"DrugInteraction"> | string
    description?: StringFilter<"DrugInteraction"> | string
    source?: StringNullableFilter<"DrugInteraction"> | string | null
    isActive?: BoolFilter<"DrugInteraction"> | boolean
    createdAt?: DateTimeFilter<"DrugInteraction"> | Date | string
    updatedAt?: DateTimeFilter<"DrugInteraction"> | Date | string
  }, "id">

  export type DrugInteractionOrderByWithAggregationInput = {
    id?: SortOrder
    drug1Name?: SortOrder
    drug2Name?: SortOrder
    severity?: SortOrder
    description?: SortOrder
    source?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DrugInteractionCountOrderByAggregateInput
    _max?: DrugInteractionMaxOrderByAggregateInput
    _min?: DrugInteractionMinOrderByAggregateInput
  }

  export type DrugInteractionScalarWhereWithAggregatesInput = {
    AND?: DrugInteractionScalarWhereWithAggregatesInput | DrugInteractionScalarWhereWithAggregatesInput[]
    OR?: DrugInteractionScalarWhereWithAggregatesInput[]
    NOT?: DrugInteractionScalarWhereWithAggregatesInput | DrugInteractionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DrugInteraction"> | string
    drug1Name?: StringWithAggregatesFilter<"DrugInteraction"> | string
    drug2Name?: StringWithAggregatesFilter<"DrugInteraction"> | string
    severity?: StringWithAggregatesFilter<"DrugInteraction"> | string
    description?: StringWithAggregatesFilter<"DrugInteraction"> | string
    source?: StringNullableWithAggregatesFilter<"DrugInteraction"> | string | null
    isActive?: BoolWithAggregatesFilter<"DrugInteraction"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"DrugInteraction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DrugInteraction"> | Date | string
  }

  export type DrugAllergyWhereInput = {
    AND?: DrugAllergyWhereInput | DrugAllergyWhereInput[]
    OR?: DrugAllergyWhereInput[]
    NOT?: DrugAllergyWhereInput | DrugAllergyWhereInput[]
    id?: StringFilter<"DrugAllergy"> | string
    patientId?: StringFilter<"DrugAllergy"> | string
    allergen?: StringFilter<"DrugAllergy"> | string
    reaction?: StringNullableFilter<"DrugAllergy"> | string | null
    severity?: StringNullableFilter<"DrugAllergy"> | string | null
    onsetDate?: DateTimeNullableFilter<"DrugAllergy"> | Date | string | null
    isActive?: BoolFilter<"DrugAllergy"> | boolean
    createdAt?: DateTimeFilter<"DrugAllergy"> | Date | string
    updatedAt?: DateTimeFilter<"DrugAllergy"> | Date | string
  }

  export type DrugAllergyOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    allergen?: SortOrder
    reaction?: SortOrderInput | SortOrder
    severity?: SortOrderInput | SortOrder
    onsetDate?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DrugAllergyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DrugAllergyWhereInput | DrugAllergyWhereInput[]
    OR?: DrugAllergyWhereInput[]
    NOT?: DrugAllergyWhereInput | DrugAllergyWhereInput[]
    patientId?: StringFilter<"DrugAllergy"> | string
    allergen?: StringFilter<"DrugAllergy"> | string
    reaction?: StringNullableFilter<"DrugAllergy"> | string | null
    severity?: StringNullableFilter<"DrugAllergy"> | string | null
    onsetDate?: DateTimeNullableFilter<"DrugAllergy"> | Date | string | null
    isActive?: BoolFilter<"DrugAllergy"> | boolean
    createdAt?: DateTimeFilter<"DrugAllergy"> | Date | string
    updatedAt?: DateTimeFilter<"DrugAllergy"> | Date | string
  }, "id">

  export type DrugAllergyOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    allergen?: SortOrder
    reaction?: SortOrderInput | SortOrder
    severity?: SortOrderInput | SortOrder
    onsetDate?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DrugAllergyCountOrderByAggregateInput
    _max?: DrugAllergyMaxOrderByAggregateInput
    _min?: DrugAllergyMinOrderByAggregateInput
  }

  export type DrugAllergyScalarWhereWithAggregatesInput = {
    AND?: DrugAllergyScalarWhereWithAggregatesInput | DrugAllergyScalarWhereWithAggregatesInput[]
    OR?: DrugAllergyScalarWhereWithAggregatesInput[]
    NOT?: DrugAllergyScalarWhereWithAggregatesInput | DrugAllergyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DrugAllergy"> | string
    patientId?: StringWithAggregatesFilter<"DrugAllergy"> | string
    allergen?: StringWithAggregatesFilter<"DrugAllergy"> | string
    reaction?: StringNullableWithAggregatesFilter<"DrugAllergy"> | string | null
    severity?: StringNullableWithAggregatesFilter<"DrugAllergy"> | string | null
    onsetDate?: DateTimeNullableWithAggregatesFilter<"DrugAllergy"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"DrugAllergy"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"DrugAllergy"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DrugAllergy"> | Date | string
  }

  export type PrescriptionCreateInput = {
    id?: string
    patientId: string
    providerId: string
    encounterId?: string | null
    status?: $Enums.PrescriptionStatus
    notes?: string | null
    validFrom?: Date | string
    validUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: PrescriptionItemCreateNestedManyWithoutPrescriptionInput
  }

  export type PrescriptionUncheckedCreateInput = {
    id?: string
    patientId: string
    providerId: string
    encounterId?: string | null
    status?: $Enums.PrescriptionStatus
    notes?: string | null
    validFrom?: Date | string
    validUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: PrescriptionItemUncheckedCreateNestedManyWithoutPrescriptionInput
  }

  export type PrescriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: PrescriptionItemUpdateManyWithoutPrescriptionNestedInput
  }

  export type PrescriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: PrescriptionItemUncheckedUpdateManyWithoutPrescriptionNestedInput
  }

  export type PrescriptionCreateManyInput = {
    id?: string
    patientId: string
    providerId: string
    encounterId?: string | null
    status?: $Enums.PrescriptionStatus
    notes?: string | null
    validFrom?: Date | string
    validUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrescriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrescriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrescriptionItemCreateInput = {
    id?: string
    medicationName: string
    dosage: string
    frequency: string
    duration?: string | null
    quantity?: number | null
    refillsAllowed?: number
    refillsUsed?: number
    instructions?: string | null
    isGenericAllowed?: boolean
    createdAt?: Date | string
    prescription: PrescriptionCreateNestedOneWithoutItemsInput
  }

  export type PrescriptionItemUncheckedCreateInput = {
    id?: string
    prescriptionId: string
    medicationName: string
    dosage: string
    frequency: string
    duration?: string | null
    quantity?: number | null
    refillsAllowed?: number
    refillsUsed?: number
    instructions?: string | null
    isGenericAllowed?: boolean
    createdAt?: Date | string
  }

  export type PrescriptionItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    dosage?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    duration?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    refillsAllowed?: IntFieldUpdateOperationsInput | number
    refillsUsed?: IntFieldUpdateOperationsInput | number
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isGenericAllowed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prescription?: PrescriptionUpdateOneRequiredWithoutItemsNestedInput
  }

  export type PrescriptionItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    dosage?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    duration?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    refillsAllowed?: IntFieldUpdateOperationsInput | number
    refillsUsed?: IntFieldUpdateOperationsInput | number
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isGenericAllowed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrescriptionItemCreateManyInput = {
    id?: string
    prescriptionId: string
    medicationName: string
    dosage: string
    frequency: string
    duration?: string | null
    quantity?: number | null
    refillsAllowed?: number
    refillsUsed?: number
    instructions?: string | null
    isGenericAllowed?: boolean
    createdAt?: Date | string
  }

  export type PrescriptionItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    dosage?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    duration?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    refillsAllowed?: IntFieldUpdateOperationsInput | number
    refillsUsed?: IntFieldUpdateOperationsInput | number
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isGenericAllowed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrescriptionItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    dosage?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    duration?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    refillsAllowed?: IntFieldUpdateOperationsInput | number
    refillsUsed?: IntFieldUpdateOperationsInput | number
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isGenericAllowed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PharmacyCreateInput = {
    id?: string
    name: string
    licenseNumber: string
    phone: string
    email?: string | null
    address: JsonNullValueInput | InputJsonValue
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PharmacyUncheckedCreateInput = {
    id?: string
    name: string
    licenseNumber: string
    phone: string
    email?: string | null
    address: JsonNullValueInput | InputJsonValue
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PharmacyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PharmacyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PharmacyCreateManyInput = {
    id?: string
    name: string
    licenseNumber: string
    phone: string
    email?: string | null
    address: JsonNullValueInput | InputJsonValue
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PharmacyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PharmacyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: JsonNullValueInput | InputJsonValue
    operatingHours?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MedicationCreateInput = {
    id?: string
    name: string
    genericName?: string | null
    brandNames?: MedicationCreatebrandNamesInput | string[]
    strength: string
    dosageForm: string
    manufacturer?: string | null
    ndcCode?: string | null
    description?: string | null
    sideEffects?: MedicationCreatesideEffectsInput | string[]
    interactions?: MedicationCreateinteractionsInput | string[]
    isControlled?: boolean
    schedule?: string | null
    requiresPriorAuth?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    inventory?: InventoryCreateNestedManyWithoutMedicationInput
  }

  export type MedicationUncheckedCreateInput = {
    id?: string
    name: string
    genericName?: string | null
    brandNames?: MedicationCreatebrandNamesInput | string[]
    strength: string
    dosageForm: string
    manufacturer?: string | null
    ndcCode?: string | null
    description?: string | null
    sideEffects?: MedicationCreatesideEffectsInput | string[]
    interactions?: MedicationCreateinteractionsInput | string[]
    isControlled?: boolean
    schedule?: string | null
    requiresPriorAuth?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    inventory?: InventoryUncheckedCreateNestedManyWithoutMedicationInput
  }

  export type MedicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    genericName?: NullableStringFieldUpdateOperationsInput | string | null
    brandNames?: MedicationUpdatebrandNamesInput | string[]
    strength?: StringFieldUpdateOperationsInput | string
    dosageForm?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    ndcCode?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sideEffects?: MedicationUpdatesideEffectsInput | string[]
    interactions?: MedicationUpdateinteractionsInput | string[]
    isControlled?: BoolFieldUpdateOperationsInput | boolean
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    requiresPriorAuth?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory?: InventoryUpdateManyWithoutMedicationNestedInput
  }

  export type MedicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    genericName?: NullableStringFieldUpdateOperationsInput | string | null
    brandNames?: MedicationUpdatebrandNamesInput | string[]
    strength?: StringFieldUpdateOperationsInput | string
    dosageForm?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    ndcCode?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sideEffects?: MedicationUpdatesideEffectsInput | string[]
    interactions?: MedicationUpdateinteractionsInput | string[]
    isControlled?: BoolFieldUpdateOperationsInput | boolean
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    requiresPriorAuth?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory?: InventoryUncheckedUpdateManyWithoutMedicationNestedInput
  }

  export type MedicationCreateManyInput = {
    id?: string
    name: string
    genericName?: string | null
    brandNames?: MedicationCreatebrandNamesInput | string[]
    strength: string
    dosageForm: string
    manufacturer?: string | null
    ndcCode?: string | null
    description?: string | null
    sideEffects?: MedicationCreatesideEffectsInput | string[]
    interactions?: MedicationCreateinteractionsInput | string[]
    isControlled?: boolean
    schedule?: string | null
    requiresPriorAuth?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MedicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    genericName?: NullableStringFieldUpdateOperationsInput | string | null
    brandNames?: MedicationUpdatebrandNamesInput | string[]
    strength?: StringFieldUpdateOperationsInput | string
    dosageForm?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    ndcCode?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sideEffects?: MedicationUpdatesideEffectsInput | string[]
    interactions?: MedicationUpdateinteractionsInput | string[]
    isControlled?: BoolFieldUpdateOperationsInput | boolean
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    requiresPriorAuth?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MedicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    genericName?: NullableStringFieldUpdateOperationsInput | string | null
    brandNames?: MedicationUpdatebrandNamesInput | string[]
    strength?: StringFieldUpdateOperationsInput | string
    dosageForm?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    ndcCode?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sideEffects?: MedicationUpdatesideEffectsInput | string[]
    interactions?: MedicationUpdateinteractionsInput | string[]
    isControlled?: BoolFieldUpdateOperationsInput | boolean
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    requiresPriorAuth?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriorAuthorizationCreateInput = {
    id?: string
    prescriptionId: string
    patientId: string
    providerId: string
    insurerId?: string | null
    medicationName: string
    status?: $Enums.PriorAuthStatus
    requestDate?: Date | string
    approvalDate?: Date | string | null
    denialDate?: Date | string | null
    expirationDate?: Date | string | null
    denialReason?: string | null
    approvalCode?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dispensings?: DispensingCreateNestedManyWithoutPriorAuthorizationInput
  }

  export type PriorAuthorizationUncheckedCreateInput = {
    id?: string
    prescriptionId: string
    patientId: string
    providerId: string
    insurerId?: string | null
    medicationName: string
    status?: $Enums.PriorAuthStatus
    requestDate?: Date | string
    approvalDate?: Date | string | null
    denialDate?: Date | string | null
    expirationDate?: Date | string | null
    denialReason?: string | null
    approvalCode?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dispensings?: DispensingUncheckedCreateNestedManyWithoutPriorAuthorizationInput
  }

  export type PriorAuthorizationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    insurerId?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    status?: EnumPriorAuthStatusFieldUpdateOperationsInput | $Enums.PriorAuthStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    approvalCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dispensings?: DispensingUpdateManyWithoutPriorAuthorizationNestedInput
  }

  export type PriorAuthorizationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    insurerId?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    status?: EnumPriorAuthStatusFieldUpdateOperationsInput | $Enums.PriorAuthStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    approvalCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dispensings?: DispensingUncheckedUpdateManyWithoutPriorAuthorizationNestedInput
  }

  export type PriorAuthorizationCreateManyInput = {
    id?: string
    prescriptionId: string
    patientId: string
    providerId: string
    insurerId?: string | null
    medicationName: string
    status?: $Enums.PriorAuthStatus
    requestDate?: Date | string
    approvalDate?: Date | string | null
    denialDate?: Date | string | null
    expirationDate?: Date | string | null
    denialReason?: string | null
    approvalCode?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PriorAuthorizationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    insurerId?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    status?: EnumPriorAuthStatusFieldUpdateOperationsInput | $Enums.PriorAuthStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    approvalCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriorAuthorizationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    insurerId?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    status?: EnumPriorAuthStatusFieldUpdateOperationsInput | $Enums.PriorAuthStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    approvalCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DispensingCreateInput = {
    id?: string
    prescriptionId: string
    patientId: string
    pharmacyId: string
    medicationName: string
    quantity: number
    dispensedAt?: Date | string
    pharmacist?: string | null
    notes?: string | null
    createdAt?: Date | string
    priorAuthorization?: PriorAuthorizationCreateNestedOneWithoutDispensingsInput
  }

  export type DispensingUncheckedCreateInput = {
    id?: string
    prescriptionId: string
    patientId: string
    pharmacyId: string
    priorAuthorizationId?: string | null
    medicationName: string
    quantity: number
    dispensedAt?: Date | string
    pharmacist?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type DispensingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    dispensedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pharmacist?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    priorAuthorization?: PriorAuthorizationUpdateOneWithoutDispensingsNestedInput
  }

  export type DispensingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    priorAuthorizationId?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    dispensedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pharmacist?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DispensingCreateManyInput = {
    id?: string
    prescriptionId: string
    patientId: string
    pharmacyId: string
    priorAuthorizationId?: string | null
    medicationName: string
    quantity: number
    dispensedAt?: Date | string
    pharmacist?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type DispensingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    dispensedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pharmacist?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DispensingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    priorAuthorizationId?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    dispensedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pharmacist?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ControlledSubstanceLogCreateInput = {
    id?: string
    patientId: string
    prescriberId: string
    pharmacyId: string
    medicationName: string
    schedule: string
    quantity: number
    daysSupply: number
    dispensedAt?: Date | string
    reportedToPDMP?: boolean
    pdmpReportDate?: Date | string | null
    createdAt?: Date | string
  }

  export type ControlledSubstanceLogUncheckedCreateInput = {
    id?: string
    patientId: string
    prescriberId: string
    pharmacyId: string
    medicationName: string
    schedule: string
    quantity: number
    daysSupply: number
    dispensedAt?: Date | string
    reportedToPDMP?: boolean
    pdmpReportDate?: Date | string | null
    createdAt?: Date | string
  }

  export type ControlledSubstanceLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    prescriberId?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    schedule?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    daysSupply?: IntFieldUpdateOperationsInput | number
    dispensedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reportedToPDMP?: BoolFieldUpdateOperationsInput | boolean
    pdmpReportDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ControlledSubstanceLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    prescriberId?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    schedule?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    daysSupply?: IntFieldUpdateOperationsInput | number
    dispensedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reportedToPDMP?: BoolFieldUpdateOperationsInput | boolean
    pdmpReportDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ControlledSubstanceLogCreateManyInput = {
    id?: string
    patientId: string
    prescriberId: string
    pharmacyId: string
    medicationName: string
    schedule: string
    quantity: number
    daysSupply: number
    dispensedAt?: Date | string
    reportedToPDMP?: boolean
    pdmpReportDate?: Date | string | null
    createdAt?: Date | string
  }

  export type ControlledSubstanceLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    prescriberId?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    schedule?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    daysSupply?: IntFieldUpdateOperationsInput | number
    dispensedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reportedToPDMP?: BoolFieldUpdateOperationsInput | boolean
    pdmpReportDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ControlledSubstanceLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    prescriberId?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    schedule?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    daysSupply?: IntFieldUpdateOperationsInput | number
    dispensedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reportedToPDMP?: BoolFieldUpdateOperationsInput | boolean
    pdmpReportDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryCreateInput = {
    id?: string
    pharmacyId: string
    quantity?: number
    reorderLevel?: number
    lotNumber?: string | null
    expirationDate?: Date | string | null
    lastRestocked?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    medication: MedicationCreateNestedOneWithoutInventoryInput
  }

  export type InventoryUncheckedCreateInput = {
    id?: string
    pharmacyId: string
    medicationId: string
    quantity?: number
    reorderLevel?: number
    lotNumber?: string | null
    expirationDate?: Date | string | null
    lastRestocked?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    medication?: MedicationUpdateOneRequiredWithoutInventoryNestedInput
  }

  export type InventoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    medicationId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryCreateManyInput = {
    id?: string
    pharmacyId: string
    medicationId: string
    quantity?: number
    reorderLevel?: number
    lotNumber?: string | null
    expirationDate?: Date | string | null
    lastRestocked?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    medicationId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DrugInteractionCreateInput = {
    id?: string
    drug1Name: string
    drug2Name: string
    severity: string
    description: string
    source?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DrugInteractionUncheckedCreateInput = {
    id?: string
    drug1Name: string
    drug2Name: string
    severity: string
    description: string
    source?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DrugInteractionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    drug1Name?: StringFieldUpdateOperationsInput | string
    drug2Name?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DrugInteractionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    drug1Name?: StringFieldUpdateOperationsInput | string
    drug2Name?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DrugInteractionCreateManyInput = {
    id?: string
    drug1Name: string
    drug2Name: string
    severity: string
    description: string
    source?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DrugInteractionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    drug1Name?: StringFieldUpdateOperationsInput | string
    drug2Name?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DrugInteractionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    drug1Name?: StringFieldUpdateOperationsInput | string
    drug2Name?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    source?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DrugAllergyCreateInput = {
    id?: string
    patientId: string
    allergen: string
    reaction?: string | null
    severity?: string | null
    onsetDate?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DrugAllergyUncheckedCreateInput = {
    id?: string
    patientId: string
    allergen: string
    reaction?: string | null
    severity?: string | null
    onsetDate?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DrugAllergyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    allergen?: StringFieldUpdateOperationsInput | string
    reaction?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DrugAllergyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    allergen?: StringFieldUpdateOperationsInput | string
    reaction?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DrugAllergyCreateManyInput = {
    id?: string
    patientId: string
    allergen: string
    reaction?: string | null
    severity?: string | null
    onsetDate?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DrugAllergyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    allergen?: StringFieldUpdateOperationsInput | string
    reaction?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DrugAllergyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    allergen?: StringFieldUpdateOperationsInput | string
    reaction?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type EnumPrescriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PrescriptionStatus | EnumPrescriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PrescriptionStatus[] | ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PrescriptionStatus[] | ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPrescriptionStatusFilter<$PrismaModel> | $Enums.PrescriptionStatus
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

  export type PrescriptionItemListRelationFilter = {
    every?: PrescriptionItemWhereInput
    some?: PrescriptionItemWhereInput
    none?: PrescriptionItemWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PrescriptionItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PrescriptionCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    encounterId?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrescriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    encounterId?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrescriptionMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    encounterId?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    validFrom?: SortOrder
    validUntil?: SortOrder
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

  export type EnumPrescriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PrescriptionStatus | EnumPrescriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PrescriptionStatus[] | ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PrescriptionStatus[] | ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPrescriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.PrescriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPrescriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumPrescriptionStatusFilter<$PrismaModel>
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type PrescriptionRelationFilter = {
    is?: PrescriptionWhereInput
    isNot?: PrescriptionWhereInput
  }

  export type PrescriptionItemCountOrderByAggregateInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    medicationName?: SortOrder
    dosage?: SortOrder
    frequency?: SortOrder
    duration?: SortOrder
    quantity?: SortOrder
    refillsAllowed?: SortOrder
    refillsUsed?: SortOrder
    instructions?: SortOrder
    isGenericAllowed?: SortOrder
    createdAt?: SortOrder
  }

  export type PrescriptionItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    refillsAllowed?: SortOrder
    refillsUsed?: SortOrder
  }

  export type PrescriptionItemMaxOrderByAggregateInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    medicationName?: SortOrder
    dosage?: SortOrder
    frequency?: SortOrder
    duration?: SortOrder
    quantity?: SortOrder
    refillsAllowed?: SortOrder
    refillsUsed?: SortOrder
    instructions?: SortOrder
    isGenericAllowed?: SortOrder
    createdAt?: SortOrder
  }

  export type PrescriptionItemMinOrderByAggregateInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    medicationName?: SortOrder
    dosage?: SortOrder
    frequency?: SortOrder
    duration?: SortOrder
    quantity?: SortOrder
    refillsAllowed?: SortOrder
    refillsUsed?: SortOrder
    instructions?: SortOrder
    isGenericAllowed?: SortOrder
    createdAt?: SortOrder
  }

  export type PrescriptionItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    refillsAllowed?: SortOrder
    refillsUsed?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type PharmacyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    licenseNumber?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    address?: SortOrder
    operatingHours?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PharmacyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    licenseNumber?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PharmacyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    licenseNumber?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type InventoryListRelationFilter = {
    every?: InventoryWhereInput
    some?: InventoryWhereInput
    none?: InventoryWhereInput
  }

  export type InventoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MedicationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    genericName?: SortOrder
    brandNames?: SortOrder
    strength?: SortOrder
    dosageForm?: SortOrder
    manufacturer?: SortOrder
    ndcCode?: SortOrder
    description?: SortOrder
    sideEffects?: SortOrder
    interactions?: SortOrder
    isControlled?: SortOrder
    schedule?: SortOrder
    requiresPriorAuth?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MedicationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    genericName?: SortOrder
    strength?: SortOrder
    dosageForm?: SortOrder
    manufacturer?: SortOrder
    ndcCode?: SortOrder
    description?: SortOrder
    isControlled?: SortOrder
    schedule?: SortOrder
    requiresPriorAuth?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MedicationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    genericName?: SortOrder
    strength?: SortOrder
    dosageForm?: SortOrder
    manufacturer?: SortOrder
    ndcCode?: SortOrder
    description?: SortOrder
    isControlled?: SortOrder
    schedule?: SortOrder
    requiresPriorAuth?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumPriorAuthStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorAuthStatus | EnumPriorAuthStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PriorAuthStatus[] | ListEnumPriorAuthStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorAuthStatus[] | ListEnumPriorAuthStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorAuthStatusFilter<$PrismaModel> | $Enums.PriorAuthStatus
  }

  export type DispensingListRelationFilter = {
    every?: DispensingWhereInput
    some?: DispensingWhereInput
    none?: DispensingWhereInput
  }

  export type DispensingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PriorAuthorizationCountOrderByAggregateInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    insurerId?: SortOrder
    medicationName?: SortOrder
    status?: SortOrder
    requestDate?: SortOrder
    approvalDate?: SortOrder
    denialDate?: SortOrder
    expirationDate?: SortOrder
    denialReason?: SortOrder
    approvalCode?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PriorAuthorizationMaxOrderByAggregateInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    insurerId?: SortOrder
    medicationName?: SortOrder
    status?: SortOrder
    requestDate?: SortOrder
    approvalDate?: SortOrder
    denialDate?: SortOrder
    expirationDate?: SortOrder
    denialReason?: SortOrder
    approvalCode?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PriorAuthorizationMinOrderByAggregateInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    insurerId?: SortOrder
    medicationName?: SortOrder
    status?: SortOrder
    requestDate?: SortOrder
    approvalDate?: SortOrder
    denialDate?: SortOrder
    expirationDate?: SortOrder
    denialReason?: SortOrder
    approvalCode?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumPriorAuthStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorAuthStatus | EnumPriorAuthStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PriorAuthStatus[] | ListEnumPriorAuthStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorAuthStatus[] | ListEnumPriorAuthStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorAuthStatusWithAggregatesFilter<$PrismaModel> | $Enums.PriorAuthStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorAuthStatusFilter<$PrismaModel>
    _max?: NestedEnumPriorAuthStatusFilter<$PrismaModel>
  }

  export type PriorAuthorizationNullableRelationFilter = {
    is?: PriorAuthorizationWhereInput | null
    isNot?: PriorAuthorizationWhereInput | null
  }

  export type DispensingCountOrderByAggregateInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    patientId?: SortOrder
    pharmacyId?: SortOrder
    priorAuthorizationId?: SortOrder
    medicationName?: SortOrder
    quantity?: SortOrder
    dispensedAt?: SortOrder
    pharmacist?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type DispensingAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type DispensingMaxOrderByAggregateInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    patientId?: SortOrder
    pharmacyId?: SortOrder
    priorAuthorizationId?: SortOrder
    medicationName?: SortOrder
    quantity?: SortOrder
    dispensedAt?: SortOrder
    pharmacist?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type DispensingMinOrderByAggregateInput = {
    id?: SortOrder
    prescriptionId?: SortOrder
    patientId?: SortOrder
    pharmacyId?: SortOrder
    priorAuthorizationId?: SortOrder
    medicationName?: SortOrder
    quantity?: SortOrder
    dispensedAt?: SortOrder
    pharmacist?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type DispensingSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type ControlledSubstanceLogCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    prescriberId?: SortOrder
    pharmacyId?: SortOrder
    medicationName?: SortOrder
    schedule?: SortOrder
    quantity?: SortOrder
    daysSupply?: SortOrder
    dispensedAt?: SortOrder
    reportedToPDMP?: SortOrder
    pdmpReportDate?: SortOrder
    createdAt?: SortOrder
  }

  export type ControlledSubstanceLogAvgOrderByAggregateInput = {
    quantity?: SortOrder
    daysSupply?: SortOrder
  }

  export type ControlledSubstanceLogMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    prescriberId?: SortOrder
    pharmacyId?: SortOrder
    medicationName?: SortOrder
    schedule?: SortOrder
    quantity?: SortOrder
    daysSupply?: SortOrder
    dispensedAt?: SortOrder
    reportedToPDMP?: SortOrder
    pdmpReportDate?: SortOrder
    createdAt?: SortOrder
  }

  export type ControlledSubstanceLogMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    prescriberId?: SortOrder
    pharmacyId?: SortOrder
    medicationName?: SortOrder
    schedule?: SortOrder
    quantity?: SortOrder
    daysSupply?: SortOrder
    dispensedAt?: SortOrder
    reportedToPDMP?: SortOrder
    pdmpReportDate?: SortOrder
    createdAt?: SortOrder
  }

  export type ControlledSubstanceLogSumOrderByAggregateInput = {
    quantity?: SortOrder
    daysSupply?: SortOrder
  }

  export type MedicationRelationFilter = {
    is?: MedicationWhereInput
    isNot?: MedicationWhereInput
  }

  export type InventoryPharmacyIdMedicationIdLotNumberCompoundUniqueInput = {
    pharmacyId: string
    medicationId: string
    lotNumber: string
  }

  export type InventoryCountOrderByAggregateInput = {
    id?: SortOrder
    pharmacyId?: SortOrder
    medicationId?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    lotNumber?: SortOrder
    expirationDate?: SortOrder
    lastRestocked?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryAvgOrderByAggregateInput = {
    quantity?: SortOrder
    reorderLevel?: SortOrder
  }

  export type InventoryMaxOrderByAggregateInput = {
    id?: SortOrder
    pharmacyId?: SortOrder
    medicationId?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    lotNumber?: SortOrder
    expirationDate?: SortOrder
    lastRestocked?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryMinOrderByAggregateInput = {
    id?: SortOrder
    pharmacyId?: SortOrder
    medicationId?: SortOrder
    quantity?: SortOrder
    reorderLevel?: SortOrder
    lotNumber?: SortOrder
    expirationDate?: SortOrder
    lastRestocked?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventorySumOrderByAggregateInput = {
    quantity?: SortOrder
    reorderLevel?: SortOrder
  }

  export type DrugInteractionCountOrderByAggregateInput = {
    id?: SortOrder
    drug1Name?: SortOrder
    drug2Name?: SortOrder
    severity?: SortOrder
    description?: SortOrder
    source?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DrugInteractionMaxOrderByAggregateInput = {
    id?: SortOrder
    drug1Name?: SortOrder
    drug2Name?: SortOrder
    severity?: SortOrder
    description?: SortOrder
    source?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DrugInteractionMinOrderByAggregateInput = {
    id?: SortOrder
    drug1Name?: SortOrder
    drug2Name?: SortOrder
    severity?: SortOrder
    description?: SortOrder
    source?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DrugAllergyCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    allergen?: SortOrder
    reaction?: SortOrder
    severity?: SortOrder
    onsetDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DrugAllergyMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    allergen?: SortOrder
    reaction?: SortOrder
    severity?: SortOrder
    onsetDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DrugAllergyMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    allergen?: SortOrder
    reaction?: SortOrder
    severity?: SortOrder
    onsetDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrescriptionItemCreateNestedManyWithoutPrescriptionInput = {
    create?: XOR<PrescriptionItemCreateWithoutPrescriptionInput, PrescriptionItemUncheckedCreateWithoutPrescriptionInput> | PrescriptionItemCreateWithoutPrescriptionInput[] | PrescriptionItemUncheckedCreateWithoutPrescriptionInput[]
    connectOrCreate?: PrescriptionItemCreateOrConnectWithoutPrescriptionInput | PrescriptionItemCreateOrConnectWithoutPrescriptionInput[]
    createMany?: PrescriptionItemCreateManyPrescriptionInputEnvelope
    connect?: PrescriptionItemWhereUniqueInput | PrescriptionItemWhereUniqueInput[]
  }

  export type PrescriptionItemUncheckedCreateNestedManyWithoutPrescriptionInput = {
    create?: XOR<PrescriptionItemCreateWithoutPrescriptionInput, PrescriptionItemUncheckedCreateWithoutPrescriptionInput> | PrescriptionItemCreateWithoutPrescriptionInput[] | PrescriptionItemUncheckedCreateWithoutPrescriptionInput[]
    connectOrCreate?: PrescriptionItemCreateOrConnectWithoutPrescriptionInput | PrescriptionItemCreateOrConnectWithoutPrescriptionInput[]
    createMany?: PrescriptionItemCreateManyPrescriptionInputEnvelope
    connect?: PrescriptionItemWhereUniqueInput | PrescriptionItemWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumPrescriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.PrescriptionStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type PrescriptionItemUpdateManyWithoutPrescriptionNestedInput = {
    create?: XOR<PrescriptionItemCreateWithoutPrescriptionInput, PrescriptionItemUncheckedCreateWithoutPrescriptionInput> | PrescriptionItemCreateWithoutPrescriptionInput[] | PrescriptionItemUncheckedCreateWithoutPrescriptionInput[]
    connectOrCreate?: PrescriptionItemCreateOrConnectWithoutPrescriptionInput | PrescriptionItemCreateOrConnectWithoutPrescriptionInput[]
    upsert?: PrescriptionItemUpsertWithWhereUniqueWithoutPrescriptionInput | PrescriptionItemUpsertWithWhereUniqueWithoutPrescriptionInput[]
    createMany?: PrescriptionItemCreateManyPrescriptionInputEnvelope
    set?: PrescriptionItemWhereUniqueInput | PrescriptionItemWhereUniqueInput[]
    disconnect?: PrescriptionItemWhereUniqueInput | PrescriptionItemWhereUniqueInput[]
    delete?: PrescriptionItemWhereUniqueInput | PrescriptionItemWhereUniqueInput[]
    connect?: PrescriptionItemWhereUniqueInput | PrescriptionItemWhereUniqueInput[]
    update?: PrescriptionItemUpdateWithWhereUniqueWithoutPrescriptionInput | PrescriptionItemUpdateWithWhereUniqueWithoutPrescriptionInput[]
    updateMany?: PrescriptionItemUpdateManyWithWhereWithoutPrescriptionInput | PrescriptionItemUpdateManyWithWhereWithoutPrescriptionInput[]
    deleteMany?: PrescriptionItemScalarWhereInput | PrescriptionItemScalarWhereInput[]
  }

  export type PrescriptionItemUncheckedUpdateManyWithoutPrescriptionNestedInput = {
    create?: XOR<PrescriptionItemCreateWithoutPrescriptionInput, PrescriptionItemUncheckedCreateWithoutPrescriptionInput> | PrescriptionItemCreateWithoutPrescriptionInput[] | PrescriptionItemUncheckedCreateWithoutPrescriptionInput[]
    connectOrCreate?: PrescriptionItemCreateOrConnectWithoutPrescriptionInput | PrescriptionItemCreateOrConnectWithoutPrescriptionInput[]
    upsert?: PrescriptionItemUpsertWithWhereUniqueWithoutPrescriptionInput | PrescriptionItemUpsertWithWhereUniqueWithoutPrescriptionInput[]
    createMany?: PrescriptionItemCreateManyPrescriptionInputEnvelope
    set?: PrescriptionItemWhereUniqueInput | PrescriptionItemWhereUniqueInput[]
    disconnect?: PrescriptionItemWhereUniqueInput | PrescriptionItemWhereUniqueInput[]
    delete?: PrescriptionItemWhereUniqueInput | PrescriptionItemWhereUniqueInput[]
    connect?: PrescriptionItemWhereUniqueInput | PrescriptionItemWhereUniqueInput[]
    update?: PrescriptionItemUpdateWithWhereUniqueWithoutPrescriptionInput | PrescriptionItemUpdateWithWhereUniqueWithoutPrescriptionInput[]
    updateMany?: PrescriptionItemUpdateManyWithWhereWithoutPrescriptionInput | PrescriptionItemUpdateManyWithWhereWithoutPrescriptionInput[]
    deleteMany?: PrescriptionItemScalarWhereInput | PrescriptionItemScalarWhereInput[]
  }

  export type PrescriptionCreateNestedOneWithoutItemsInput = {
    create?: XOR<PrescriptionCreateWithoutItemsInput, PrescriptionUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PrescriptionCreateOrConnectWithoutItemsInput
    connect?: PrescriptionWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type PrescriptionUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<PrescriptionCreateWithoutItemsInput, PrescriptionUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PrescriptionCreateOrConnectWithoutItemsInput
    upsert?: PrescriptionUpsertWithoutItemsInput
    connect?: PrescriptionWhereUniqueInput
    update?: XOR<XOR<PrescriptionUpdateToOneWithWhereWithoutItemsInput, PrescriptionUpdateWithoutItemsInput>, PrescriptionUncheckedUpdateWithoutItemsInput>
  }

  export type MedicationCreatebrandNamesInput = {
    set: string[]
  }

  export type MedicationCreatesideEffectsInput = {
    set: string[]
  }

  export type MedicationCreateinteractionsInput = {
    set: string[]
  }

  export type InventoryCreateNestedManyWithoutMedicationInput = {
    create?: XOR<InventoryCreateWithoutMedicationInput, InventoryUncheckedCreateWithoutMedicationInput> | InventoryCreateWithoutMedicationInput[] | InventoryUncheckedCreateWithoutMedicationInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutMedicationInput | InventoryCreateOrConnectWithoutMedicationInput[]
    createMany?: InventoryCreateManyMedicationInputEnvelope
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
  }

  export type InventoryUncheckedCreateNestedManyWithoutMedicationInput = {
    create?: XOR<InventoryCreateWithoutMedicationInput, InventoryUncheckedCreateWithoutMedicationInput> | InventoryCreateWithoutMedicationInput[] | InventoryUncheckedCreateWithoutMedicationInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutMedicationInput | InventoryCreateOrConnectWithoutMedicationInput[]
    createMany?: InventoryCreateManyMedicationInputEnvelope
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
  }

  export type MedicationUpdatebrandNamesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type MedicationUpdatesideEffectsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type MedicationUpdateinteractionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type InventoryUpdateManyWithoutMedicationNestedInput = {
    create?: XOR<InventoryCreateWithoutMedicationInput, InventoryUncheckedCreateWithoutMedicationInput> | InventoryCreateWithoutMedicationInput[] | InventoryUncheckedCreateWithoutMedicationInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutMedicationInput | InventoryCreateOrConnectWithoutMedicationInput[]
    upsert?: InventoryUpsertWithWhereUniqueWithoutMedicationInput | InventoryUpsertWithWhereUniqueWithoutMedicationInput[]
    createMany?: InventoryCreateManyMedicationInputEnvelope
    set?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    disconnect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    delete?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    update?: InventoryUpdateWithWhereUniqueWithoutMedicationInput | InventoryUpdateWithWhereUniqueWithoutMedicationInput[]
    updateMany?: InventoryUpdateManyWithWhereWithoutMedicationInput | InventoryUpdateManyWithWhereWithoutMedicationInput[]
    deleteMany?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
  }

  export type InventoryUncheckedUpdateManyWithoutMedicationNestedInput = {
    create?: XOR<InventoryCreateWithoutMedicationInput, InventoryUncheckedCreateWithoutMedicationInput> | InventoryCreateWithoutMedicationInput[] | InventoryUncheckedCreateWithoutMedicationInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutMedicationInput | InventoryCreateOrConnectWithoutMedicationInput[]
    upsert?: InventoryUpsertWithWhereUniqueWithoutMedicationInput | InventoryUpsertWithWhereUniqueWithoutMedicationInput[]
    createMany?: InventoryCreateManyMedicationInputEnvelope
    set?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    disconnect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    delete?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    update?: InventoryUpdateWithWhereUniqueWithoutMedicationInput | InventoryUpdateWithWhereUniqueWithoutMedicationInput[]
    updateMany?: InventoryUpdateManyWithWhereWithoutMedicationInput | InventoryUpdateManyWithWhereWithoutMedicationInput[]
    deleteMany?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
  }

  export type DispensingCreateNestedManyWithoutPriorAuthorizationInput = {
    create?: XOR<DispensingCreateWithoutPriorAuthorizationInput, DispensingUncheckedCreateWithoutPriorAuthorizationInput> | DispensingCreateWithoutPriorAuthorizationInput[] | DispensingUncheckedCreateWithoutPriorAuthorizationInput[]
    connectOrCreate?: DispensingCreateOrConnectWithoutPriorAuthorizationInput | DispensingCreateOrConnectWithoutPriorAuthorizationInput[]
    createMany?: DispensingCreateManyPriorAuthorizationInputEnvelope
    connect?: DispensingWhereUniqueInput | DispensingWhereUniqueInput[]
  }

  export type DispensingUncheckedCreateNestedManyWithoutPriorAuthorizationInput = {
    create?: XOR<DispensingCreateWithoutPriorAuthorizationInput, DispensingUncheckedCreateWithoutPriorAuthorizationInput> | DispensingCreateWithoutPriorAuthorizationInput[] | DispensingUncheckedCreateWithoutPriorAuthorizationInput[]
    connectOrCreate?: DispensingCreateOrConnectWithoutPriorAuthorizationInput | DispensingCreateOrConnectWithoutPriorAuthorizationInput[]
    createMany?: DispensingCreateManyPriorAuthorizationInputEnvelope
    connect?: DispensingWhereUniqueInput | DispensingWhereUniqueInput[]
  }

  export type EnumPriorAuthStatusFieldUpdateOperationsInput = {
    set?: $Enums.PriorAuthStatus
  }

  export type DispensingUpdateManyWithoutPriorAuthorizationNestedInput = {
    create?: XOR<DispensingCreateWithoutPriorAuthorizationInput, DispensingUncheckedCreateWithoutPriorAuthorizationInput> | DispensingCreateWithoutPriorAuthorizationInput[] | DispensingUncheckedCreateWithoutPriorAuthorizationInput[]
    connectOrCreate?: DispensingCreateOrConnectWithoutPriorAuthorizationInput | DispensingCreateOrConnectWithoutPriorAuthorizationInput[]
    upsert?: DispensingUpsertWithWhereUniqueWithoutPriorAuthorizationInput | DispensingUpsertWithWhereUniqueWithoutPriorAuthorizationInput[]
    createMany?: DispensingCreateManyPriorAuthorizationInputEnvelope
    set?: DispensingWhereUniqueInput | DispensingWhereUniqueInput[]
    disconnect?: DispensingWhereUniqueInput | DispensingWhereUniqueInput[]
    delete?: DispensingWhereUniqueInput | DispensingWhereUniqueInput[]
    connect?: DispensingWhereUniqueInput | DispensingWhereUniqueInput[]
    update?: DispensingUpdateWithWhereUniqueWithoutPriorAuthorizationInput | DispensingUpdateWithWhereUniqueWithoutPriorAuthorizationInput[]
    updateMany?: DispensingUpdateManyWithWhereWithoutPriorAuthorizationInput | DispensingUpdateManyWithWhereWithoutPriorAuthorizationInput[]
    deleteMany?: DispensingScalarWhereInput | DispensingScalarWhereInput[]
  }

  export type DispensingUncheckedUpdateManyWithoutPriorAuthorizationNestedInput = {
    create?: XOR<DispensingCreateWithoutPriorAuthorizationInput, DispensingUncheckedCreateWithoutPriorAuthorizationInput> | DispensingCreateWithoutPriorAuthorizationInput[] | DispensingUncheckedCreateWithoutPriorAuthorizationInput[]
    connectOrCreate?: DispensingCreateOrConnectWithoutPriorAuthorizationInput | DispensingCreateOrConnectWithoutPriorAuthorizationInput[]
    upsert?: DispensingUpsertWithWhereUniqueWithoutPriorAuthorizationInput | DispensingUpsertWithWhereUniqueWithoutPriorAuthorizationInput[]
    createMany?: DispensingCreateManyPriorAuthorizationInputEnvelope
    set?: DispensingWhereUniqueInput | DispensingWhereUniqueInput[]
    disconnect?: DispensingWhereUniqueInput | DispensingWhereUniqueInput[]
    delete?: DispensingWhereUniqueInput | DispensingWhereUniqueInput[]
    connect?: DispensingWhereUniqueInput | DispensingWhereUniqueInput[]
    update?: DispensingUpdateWithWhereUniqueWithoutPriorAuthorizationInput | DispensingUpdateWithWhereUniqueWithoutPriorAuthorizationInput[]
    updateMany?: DispensingUpdateManyWithWhereWithoutPriorAuthorizationInput | DispensingUpdateManyWithWhereWithoutPriorAuthorizationInput[]
    deleteMany?: DispensingScalarWhereInput | DispensingScalarWhereInput[]
  }

  export type PriorAuthorizationCreateNestedOneWithoutDispensingsInput = {
    create?: XOR<PriorAuthorizationCreateWithoutDispensingsInput, PriorAuthorizationUncheckedCreateWithoutDispensingsInput>
    connectOrCreate?: PriorAuthorizationCreateOrConnectWithoutDispensingsInput
    connect?: PriorAuthorizationWhereUniqueInput
  }

  export type PriorAuthorizationUpdateOneWithoutDispensingsNestedInput = {
    create?: XOR<PriorAuthorizationCreateWithoutDispensingsInput, PriorAuthorizationUncheckedCreateWithoutDispensingsInput>
    connectOrCreate?: PriorAuthorizationCreateOrConnectWithoutDispensingsInput
    upsert?: PriorAuthorizationUpsertWithoutDispensingsInput
    disconnect?: PriorAuthorizationWhereInput | boolean
    delete?: PriorAuthorizationWhereInput | boolean
    connect?: PriorAuthorizationWhereUniqueInput
    update?: XOR<XOR<PriorAuthorizationUpdateToOneWithWhereWithoutDispensingsInput, PriorAuthorizationUpdateWithoutDispensingsInput>, PriorAuthorizationUncheckedUpdateWithoutDispensingsInput>
  }

  export type MedicationCreateNestedOneWithoutInventoryInput = {
    create?: XOR<MedicationCreateWithoutInventoryInput, MedicationUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: MedicationCreateOrConnectWithoutInventoryInput
    connect?: MedicationWhereUniqueInput
  }

  export type MedicationUpdateOneRequiredWithoutInventoryNestedInput = {
    create?: XOR<MedicationCreateWithoutInventoryInput, MedicationUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: MedicationCreateOrConnectWithoutInventoryInput
    upsert?: MedicationUpsertWithoutInventoryInput
    connect?: MedicationWhereUniqueInput
    update?: XOR<XOR<MedicationUpdateToOneWithWhereWithoutInventoryInput, MedicationUpdateWithoutInventoryInput>, MedicationUncheckedUpdateWithoutInventoryInput>
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

  export type NestedEnumPrescriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PrescriptionStatus | EnumPrescriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PrescriptionStatus[] | ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PrescriptionStatus[] | ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPrescriptionStatusFilter<$PrismaModel> | $Enums.PrescriptionStatus
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

  export type NestedEnumPrescriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PrescriptionStatus | EnumPrescriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PrescriptionStatus[] | ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PrescriptionStatus[] | ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPrescriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.PrescriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPrescriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumPrescriptionStatusFilter<$PrismaModel>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumPriorAuthStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorAuthStatus | EnumPriorAuthStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PriorAuthStatus[] | ListEnumPriorAuthStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorAuthStatus[] | ListEnumPriorAuthStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorAuthStatusFilter<$PrismaModel> | $Enums.PriorAuthStatus
  }

  export type NestedEnumPriorAuthStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorAuthStatus | EnumPriorAuthStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PriorAuthStatus[] | ListEnumPriorAuthStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorAuthStatus[] | ListEnumPriorAuthStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorAuthStatusWithAggregatesFilter<$PrismaModel> | $Enums.PriorAuthStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorAuthStatusFilter<$PrismaModel>
    _max?: NestedEnumPriorAuthStatusFilter<$PrismaModel>
  }

  export type PrescriptionItemCreateWithoutPrescriptionInput = {
    id?: string
    medicationName: string
    dosage: string
    frequency: string
    duration?: string | null
    quantity?: number | null
    refillsAllowed?: number
    refillsUsed?: number
    instructions?: string | null
    isGenericAllowed?: boolean
    createdAt?: Date | string
  }

  export type PrescriptionItemUncheckedCreateWithoutPrescriptionInput = {
    id?: string
    medicationName: string
    dosage: string
    frequency: string
    duration?: string | null
    quantity?: number | null
    refillsAllowed?: number
    refillsUsed?: number
    instructions?: string | null
    isGenericAllowed?: boolean
    createdAt?: Date | string
  }

  export type PrescriptionItemCreateOrConnectWithoutPrescriptionInput = {
    where: PrescriptionItemWhereUniqueInput
    create: XOR<PrescriptionItemCreateWithoutPrescriptionInput, PrescriptionItemUncheckedCreateWithoutPrescriptionInput>
  }

  export type PrescriptionItemCreateManyPrescriptionInputEnvelope = {
    data: PrescriptionItemCreateManyPrescriptionInput | PrescriptionItemCreateManyPrescriptionInput[]
    skipDuplicates?: boolean
  }

  export type PrescriptionItemUpsertWithWhereUniqueWithoutPrescriptionInput = {
    where: PrescriptionItemWhereUniqueInput
    update: XOR<PrescriptionItemUpdateWithoutPrescriptionInput, PrescriptionItemUncheckedUpdateWithoutPrescriptionInput>
    create: XOR<PrescriptionItemCreateWithoutPrescriptionInput, PrescriptionItemUncheckedCreateWithoutPrescriptionInput>
  }

  export type PrescriptionItemUpdateWithWhereUniqueWithoutPrescriptionInput = {
    where: PrescriptionItemWhereUniqueInput
    data: XOR<PrescriptionItemUpdateWithoutPrescriptionInput, PrescriptionItemUncheckedUpdateWithoutPrescriptionInput>
  }

  export type PrescriptionItemUpdateManyWithWhereWithoutPrescriptionInput = {
    where: PrescriptionItemScalarWhereInput
    data: XOR<PrescriptionItemUpdateManyMutationInput, PrescriptionItemUncheckedUpdateManyWithoutPrescriptionInput>
  }

  export type PrescriptionItemScalarWhereInput = {
    AND?: PrescriptionItemScalarWhereInput | PrescriptionItemScalarWhereInput[]
    OR?: PrescriptionItemScalarWhereInput[]
    NOT?: PrescriptionItemScalarWhereInput | PrescriptionItemScalarWhereInput[]
    id?: StringFilter<"PrescriptionItem"> | string
    prescriptionId?: StringFilter<"PrescriptionItem"> | string
    medicationName?: StringFilter<"PrescriptionItem"> | string
    dosage?: StringFilter<"PrescriptionItem"> | string
    frequency?: StringFilter<"PrescriptionItem"> | string
    duration?: StringNullableFilter<"PrescriptionItem"> | string | null
    quantity?: IntNullableFilter<"PrescriptionItem"> | number | null
    refillsAllowed?: IntFilter<"PrescriptionItem"> | number
    refillsUsed?: IntFilter<"PrescriptionItem"> | number
    instructions?: StringNullableFilter<"PrescriptionItem"> | string | null
    isGenericAllowed?: BoolFilter<"PrescriptionItem"> | boolean
    createdAt?: DateTimeFilter<"PrescriptionItem"> | Date | string
  }

  export type PrescriptionCreateWithoutItemsInput = {
    id?: string
    patientId: string
    providerId: string
    encounterId?: string | null
    status?: $Enums.PrescriptionStatus
    notes?: string | null
    validFrom?: Date | string
    validUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrescriptionUncheckedCreateWithoutItemsInput = {
    id?: string
    patientId: string
    providerId: string
    encounterId?: string | null
    status?: $Enums.PrescriptionStatus
    notes?: string | null
    validFrom?: Date | string
    validUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrescriptionCreateOrConnectWithoutItemsInput = {
    where: PrescriptionWhereUniqueInput
    create: XOR<PrescriptionCreateWithoutItemsInput, PrescriptionUncheckedCreateWithoutItemsInput>
  }

  export type PrescriptionUpsertWithoutItemsInput = {
    update: XOR<PrescriptionUpdateWithoutItemsInput, PrescriptionUncheckedUpdateWithoutItemsInput>
    create: XOR<PrescriptionCreateWithoutItemsInput, PrescriptionUncheckedCreateWithoutItemsInput>
    where?: PrescriptionWhereInput
  }

  export type PrescriptionUpdateToOneWithWhereWithoutItemsInput = {
    where?: PrescriptionWhereInput
    data: XOR<PrescriptionUpdateWithoutItemsInput, PrescriptionUncheckedUpdateWithoutItemsInput>
  }

  export type PrescriptionUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrescriptionUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryCreateWithoutMedicationInput = {
    id?: string
    pharmacyId: string
    quantity?: number
    reorderLevel?: number
    lotNumber?: string | null
    expirationDate?: Date | string | null
    lastRestocked?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryUncheckedCreateWithoutMedicationInput = {
    id?: string
    pharmacyId: string
    quantity?: number
    reorderLevel?: number
    lotNumber?: string | null
    expirationDate?: Date | string | null
    lastRestocked?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryCreateOrConnectWithoutMedicationInput = {
    where: InventoryWhereUniqueInput
    create: XOR<InventoryCreateWithoutMedicationInput, InventoryUncheckedCreateWithoutMedicationInput>
  }

  export type InventoryCreateManyMedicationInputEnvelope = {
    data: InventoryCreateManyMedicationInput | InventoryCreateManyMedicationInput[]
    skipDuplicates?: boolean
  }

  export type InventoryUpsertWithWhereUniqueWithoutMedicationInput = {
    where: InventoryWhereUniqueInput
    update: XOR<InventoryUpdateWithoutMedicationInput, InventoryUncheckedUpdateWithoutMedicationInput>
    create: XOR<InventoryCreateWithoutMedicationInput, InventoryUncheckedCreateWithoutMedicationInput>
  }

  export type InventoryUpdateWithWhereUniqueWithoutMedicationInput = {
    where: InventoryWhereUniqueInput
    data: XOR<InventoryUpdateWithoutMedicationInput, InventoryUncheckedUpdateWithoutMedicationInput>
  }

  export type InventoryUpdateManyWithWhereWithoutMedicationInput = {
    where: InventoryScalarWhereInput
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyWithoutMedicationInput>
  }

  export type InventoryScalarWhereInput = {
    AND?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
    OR?: InventoryScalarWhereInput[]
    NOT?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
    id?: StringFilter<"Inventory"> | string
    pharmacyId?: StringFilter<"Inventory"> | string
    medicationId?: StringFilter<"Inventory"> | string
    quantity?: IntFilter<"Inventory"> | number
    reorderLevel?: IntFilter<"Inventory"> | number
    lotNumber?: StringNullableFilter<"Inventory"> | string | null
    expirationDate?: DateTimeNullableFilter<"Inventory"> | Date | string | null
    lastRestocked?: DateTimeNullableFilter<"Inventory"> | Date | string | null
    isActive?: BoolFilter<"Inventory"> | boolean
    createdAt?: DateTimeFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeFilter<"Inventory"> | Date | string
  }

  export type DispensingCreateWithoutPriorAuthorizationInput = {
    id?: string
    prescriptionId: string
    patientId: string
    pharmacyId: string
    medicationName: string
    quantity: number
    dispensedAt?: Date | string
    pharmacist?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type DispensingUncheckedCreateWithoutPriorAuthorizationInput = {
    id?: string
    prescriptionId: string
    patientId: string
    pharmacyId: string
    medicationName: string
    quantity: number
    dispensedAt?: Date | string
    pharmacist?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type DispensingCreateOrConnectWithoutPriorAuthorizationInput = {
    where: DispensingWhereUniqueInput
    create: XOR<DispensingCreateWithoutPriorAuthorizationInput, DispensingUncheckedCreateWithoutPriorAuthorizationInput>
  }

  export type DispensingCreateManyPriorAuthorizationInputEnvelope = {
    data: DispensingCreateManyPriorAuthorizationInput | DispensingCreateManyPriorAuthorizationInput[]
    skipDuplicates?: boolean
  }

  export type DispensingUpsertWithWhereUniqueWithoutPriorAuthorizationInput = {
    where: DispensingWhereUniqueInput
    update: XOR<DispensingUpdateWithoutPriorAuthorizationInput, DispensingUncheckedUpdateWithoutPriorAuthorizationInput>
    create: XOR<DispensingCreateWithoutPriorAuthorizationInput, DispensingUncheckedCreateWithoutPriorAuthorizationInput>
  }

  export type DispensingUpdateWithWhereUniqueWithoutPriorAuthorizationInput = {
    where: DispensingWhereUniqueInput
    data: XOR<DispensingUpdateWithoutPriorAuthorizationInput, DispensingUncheckedUpdateWithoutPriorAuthorizationInput>
  }

  export type DispensingUpdateManyWithWhereWithoutPriorAuthorizationInput = {
    where: DispensingScalarWhereInput
    data: XOR<DispensingUpdateManyMutationInput, DispensingUncheckedUpdateManyWithoutPriorAuthorizationInput>
  }

  export type DispensingScalarWhereInput = {
    AND?: DispensingScalarWhereInput | DispensingScalarWhereInput[]
    OR?: DispensingScalarWhereInput[]
    NOT?: DispensingScalarWhereInput | DispensingScalarWhereInput[]
    id?: StringFilter<"Dispensing"> | string
    prescriptionId?: StringFilter<"Dispensing"> | string
    patientId?: StringFilter<"Dispensing"> | string
    pharmacyId?: StringFilter<"Dispensing"> | string
    priorAuthorizationId?: StringNullableFilter<"Dispensing"> | string | null
    medicationName?: StringFilter<"Dispensing"> | string
    quantity?: IntFilter<"Dispensing"> | number
    dispensedAt?: DateTimeFilter<"Dispensing"> | Date | string
    pharmacist?: StringNullableFilter<"Dispensing"> | string | null
    notes?: StringNullableFilter<"Dispensing"> | string | null
    createdAt?: DateTimeFilter<"Dispensing"> | Date | string
  }

  export type PriorAuthorizationCreateWithoutDispensingsInput = {
    id?: string
    prescriptionId: string
    patientId: string
    providerId: string
    insurerId?: string | null
    medicationName: string
    status?: $Enums.PriorAuthStatus
    requestDate?: Date | string
    approvalDate?: Date | string | null
    denialDate?: Date | string | null
    expirationDate?: Date | string | null
    denialReason?: string | null
    approvalCode?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PriorAuthorizationUncheckedCreateWithoutDispensingsInput = {
    id?: string
    prescriptionId: string
    patientId: string
    providerId: string
    insurerId?: string | null
    medicationName: string
    status?: $Enums.PriorAuthStatus
    requestDate?: Date | string
    approvalDate?: Date | string | null
    denialDate?: Date | string | null
    expirationDate?: Date | string | null
    denialReason?: string | null
    approvalCode?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PriorAuthorizationCreateOrConnectWithoutDispensingsInput = {
    where: PriorAuthorizationWhereUniqueInput
    create: XOR<PriorAuthorizationCreateWithoutDispensingsInput, PriorAuthorizationUncheckedCreateWithoutDispensingsInput>
  }

  export type PriorAuthorizationUpsertWithoutDispensingsInput = {
    update: XOR<PriorAuthorizationUpdateWithoutDispensingsInput, PriorAuthorizationUncheckedUpdateWithoutDispensingsInput>
    create: XOR<PriorAuthorizationCreateWithoutDispensingsInput, PriorAuthorizationUncheckedCreateWithoutDispensingsInput>
    where?: PriorAuthorizationWhereInput
  }

  export type PriorAuthorizationUpdateToOneWithWhereWithoutDispensingsInput = {
    where?: PriorAuthorizationWhereInput
    data: XOR<PriorAuthorizationUpdateWithoutDispensingsInput, PriorAuthorizationUncheckedUpdateWithoutDispensingsInput>
  }

  export type PriorAuthorizationUpdateWithoutDispensingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    insurerId?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    status?: EnumPriorAuthStatusFieldUpdateOperationsInput | $Enums.PriorAuthStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    approvalCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriorAuthorizationUncheckedUpdateWithoutDispensingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    insurerId?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    status?: EnumPriorAuthStatusFieldUpdateOperationsInput | $Enums.PriorAuthStatus
    requestDate?: DateTimeFieldUpdateOperationsInput | Date | string
    approvalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    denialReason?: NullableStringFieldUpdateOperationsInput | string | null
    approvalCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MedicationCreateWithoutInventoryInput = {
    id?: string
    name: string
    genericName?: string | null
    brandNames?: MedicationCreatebrandNamesInput | string[]
    strength: string
    dosageForm: string
    manufacturer?: string | null
    ndcCode?: string | null
    description?: string | null
    sideEffects?: MedicationCreatesideEffectsInput | string[]
    interactions?: MedicationCreateinteractionsInput | string[]
    isControlled?: boolean
    schedule?: string | null
    requiresPriorAuth?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MedicationUncheckedCreateWithoutInventoryInput = {
    id?: string
    name: string
    genericName?: string | null
    brandNames?: MedicationCreatebrandNamesInput | string[]
    strength: string
    dosageForm: string
    manufacturer?: string | null
    ndcCode?: string | null
    description?: string | null
    sideEffects?: MedicationCreatesideEffectsInput | string[]
    interactions?: MedicationCreateinteractionsInput | string[]
    isControlled?: boolean
    schedule?: string | null
    requiresPriorAuth?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MedicationCreateOrConnectWithoutInventoryInput = {
    where: MedicationWhereUniqueInput
    create: XOR<MedicationCreateWithoutInventoryInput, MedicationUncheckedCreateWithoutInventoryInput>
  }

  export type MedicationUpsertWithoutInventoryInput = {
    update: XOR<MedicationUpdateWithoutInventoryInput, MedicationUncheckedUpdateWithoutInventoryInput>
    create: XOR<MedicationCreateWithoutInventoryInput, MedicationUncheckedCreateWithoutInventoryInput>
    where?: MedicationWhereInput
  }

  export type MedicationUpdateToOneWithWhereWithoutInventoryInput = {
    where?: MedicationWhereInput
    data: XOR<MedicationUpdateWithoutInventoryInput, MedicationUncheckedUpdateWithoutInventoryInput>
  }

  export type MedicationUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    genericName?: NullableStringFieldUpdateOperationsInput | string | null
    brandNames?: MedicationUpdatebrandNamesInput | string[]
    strength?: StringFieldUpdateOperationsInput | string
    dosageForm?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    ndcCode?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sideEffects?: MedicationUpdatesideEffectsInput | string[]
    interactions?: MedicationUpdateinteractionsInput | string[]
    isControlled?: BoolFieldUpdateOperationsInput | boolean
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    requiresPriorAuth?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MedicationUncheckedUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    genericName?: NullableStringFieldUpdateOperationsInput | string | null
    brandNames?: MedicationUpdatebrandNamesInput | string[]
    strength?: StringFieldUpdateOperationsInput | string
    dosageForm?: StringFieldUpdateOperationsInput | string
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    ndcCode?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sideEffects?: MedicationUpdatesideEffectsInput | string[]
    interactions?: MedicationUpdateinteractionsInput | string[]
    isControlled?: BoolFieldUpdateOperationsInput | boolean
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    requiresPriorAuth?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrescriptionItemCreateManyPrescriptionInput = {
    id?: string
    medicationName: string
    dosage: string
    frequency: string
    duration?: string | null
    quantity?: number | null
    refillsAllowed?: number
    refillsUsed?: number
    instructions?: string | null
    isGenericAllowed?: boolean
    createdAt?: Date | string
  }

  export type PrescriptionItemUpdateWithoutPrescriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    dosage?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    duration?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    refillsAllowed?: IntFieldUpdateOperationsInput | number
    refillsUsed?: IntFieldUpdateOperationsInput | number
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isGenericAllowed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrescriptionItemUncheckedUpdateWithoutPrescriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    dosage?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    duration?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    refillsAllowed?: IntFieldUpdateOperationsInput | number
    refillsUsed?: IntFieldUpdateOperationsInput | number
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isGenericAllowed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrescriptionItemUncheckedUpdateManyWithoutPrescriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    dosage?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    duration?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    refillsAllowed?: IntFieldUpdateOperationsInput | number
    refillsUsed?: IntFieldUpdateOperationsInput | number
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isGenericAllowed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryCreateManyMedicationInput = {
    id?: string
    pharmacyId: string
    quantity?: number
    reorderLevel?: number
    lotNumber?: string | null
    expirationDate?: Date | string | null
    lastRestocked?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryUpdateWithoutMedicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryUncheckedUpdateWithoutMedicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryUncheckedUpdateManyWithoutMedicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRestocked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DispensingCreateManyPriorAuthorizationInput = {
    id?: string
    prescriptionId: string
    patientId: string
    pharmacyId: string
    medicationName: string
    quantity: number
    dispensedAt?: Date | string
    pharmacist?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type DispensingUpdateWithoutPriorAuthorizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    dispensedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pharmacist?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DispensingUncheckedUpdateWithoutPriorAuthorizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    dispensedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pharmacist?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DispensingUncheckedUpdateManyWithoutPriorAuthorizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescriptionId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    pharmacyId?: StringFieldUpdateOperationsInput | string
    medicationName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    dispensedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pharmacist?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PrescriptionCountOutputTypeDefaultArgs instead
     */
    export type PrescriptionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PrescriptionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MedicationCountOutputTypeDefaultArgs instead
     */
    export type MedicationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MedicationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PriorAuthorizationCountOutputTypeDefaultArgs instead
     */
    export type PriorAuthorizationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PriorAuthorizationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PrescriptionDefaultArgs instead
     */
    export type PrescriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PrescriptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PrescriptionItemDefaultArgs instead
     */
    export type PrescriptionItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PrescriptionItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PharmacyDefaultArgs instead
     */
    export type PharmacyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PharmacyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MedicationDefaultArgs instead
     */
    export type MedicationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MedicationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PriorAuthorizationDefaultArgs instead
     */
    export type PriorAuthorizationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PriorAuthorizationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DispensingDefaultArgs instead
     */
    export type DispensingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DispensingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ControlledSubstanceLogDefaultArgs instead
     */
    export type ControlledSubstanceLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ControlledSubstanceLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InventoryDefaultArgs instead
     */
    export type InventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InventoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DrugInteractionDefaultArgs instead
     */
    export type DrugInteractionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DrugInteractionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DrugAllergyDefaultArgs instead
     */
    export type DrugAllergyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DrugAllergyDefaultArgs<ExtArgs>

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